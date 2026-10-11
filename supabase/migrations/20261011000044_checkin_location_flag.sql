-- Flag a crew member who signed on their own phone away from the talk (Joe, 2026-10-11: "if someone isn't at the
-- site or in proximity to the person giving the talk it should flag"). Additive: new columns, two new function
-- versions, and save_talk_record replaced only to keep the new attendee fields.
--
-- - When the presenter shows the code, the talk's spot comes with it: the presenter's GPS (or the jobsite's, if the
--   phone has none). When a crew member signs, their phone's location is checked once against it in the database.
--   Only the distance and a flag are kept, never where the worker was.
-- - Flags: near (within the at-site distance, 400 m, plus both phones' GPS accuracy), far, not_shared (they didn't
--   allow location), unknown (no spot for the talk, or GPS too rough to tell). A flagged signature still counts as
--   signed, because they did sign; the flag shows on the presenter's screen, the record and the PDF. Never hidden.
-- - Saved on the attendee: signed_on (presenter_phone | own_phone), distance_m and location (own_phone only).

alter table public.checkin_sessions
  add column near_lat double precision check (near_lat between -90 and 90),
  add column near_lng double precision check (near_lng between -180 and 180),
  add column near_accuracy_m int check (near_accuracy_m between 0 and 100000);
alter table public.checkin_signatures
  add column distance_m int check (distance_m >= 0),
  add column location text not null default 'unknown' check (location in ('near', 'far', 'not_shared', 'unknown'));
alter table public.talk_attendees
  add column signed_on text not null default 'presenter_phone' check (signed_on in ('presenter_phone', 'own_phone')),
  add column distance_m int check (distance_m >= 0),
  add column location text check (location in ('near', 'far', 'not_shared', 'unknown')),
  add constraint talk_attendees_location_own_phone check ((signed_on = 'own_phone') = (location is not null) and (distance_m is null or signed_on = 'own_phone'));

-- The flag each phone signature got, kept by the database when the presenter's phone takes the signature, so the
-- saved record uses the database's flag and never what a phone sends. No image, no position. Cleared when the talk
-- is saved, and two days after it was taken if the talk never is.
create table public.checkin_results (
  company_id   uuid not null references public.companies (id) on delete cascade,
  client_id    uuid not null,
  roster_key   text not null check (char_length(roster_key) between 1 and 80),
  distance_m   int check (distance_m >= 0),
  location     text not null check (location in ('near', 'far', 'not_shared', 'unknown')),
  taken_at     timestamptz not null default now(),
  primary key (company_id, client_id, roster_key)
);
alter table public.checkin_results enable row level security;
create policy "presenters read check-in results" on public.checkin_results for select to authenticated using (private.can_present(company_id));
revoke all on public.checkin_results from anon, authenticated;
grant select on public.checkin_results to authenticated;   -- written by take_checkin_signatures, read by save_talk_record
create trigger block_when_paused before insert or update on public.checkin_results for each row execute function private.block_when_paused();

-- take_checkin_signatures (0043) now keeps each signature's flag before deleting it.
create or replace function public.take_checkin_signatures(co uuid, talk_client uuid, keys text[])
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.can_present(co) then raise exception 'Only presenters can take signatures.' using errcode = '42501'; end if;
  delete from public.checkin_results where taken_at < now() - interval '2 days';
  insert into public.checkin_results (company_id, client_id, roster_key, distance_m, location)
  select co, talk_client, s.roster_key, s.distance_m, s.location
  from public.checkin_signatures s join public.checkin_sessions c on c.id = s.session_id
  where c.company_id = co and c.client_id = talk_client and s.roster_key = any (keys)
  on conflict (company_id, client_id, roster_key) do update set distance_m = excluded.distance_m, location = excluded.location, taken_at = now();
  delete from public.checkin_signatures s using public.checkin_sessions c
    where s.session_id = c.id and c.company_id = co and c.client_id = talk_client and s.roster_key = any (keys);
end;
$$;

-- Same rule as nearOrFar in src/core/checkin.ts.
create or replace function private.checkin_location(plat double precision, plng double precision, pacc int,
  clat double precision, clng double precision, cacc int, out distance_m int, out flag text)
language plpgsql immutable set search_path = '' as $$
declare d double precision;
begin
  if plat is null or plng is null then distance_m := null; flag := 'unknown'; return; end if;
  if clat is null or clng is null then distance_m := null; flag := 'unknown'; return; end if;   -- 'not_shared' is decided by the caller
  d := 2 * 6371000 * asin(sqrt(power(sin(radians(clat - plat) / 2), 2) + cos(radians(plat)) * cos(radians(clat)) * power(sin(radians(clng - plng) / 2), 2)));
  distance_m := round(d)::int;
  -- GPS rougher than 500 m on either phone can't tell near from far.
  if coalesce(cacc, 0) > 500 or coalesce(pacc, 0) > 500 then flag := 'unknown';
  elsif d > 400 + coalesce(pacc, 0) + coalesce(cacc, 0) then flag := 'far';
  else flag := 'near';
  end if;
end;
$$;

-- Presenter: open a check-in with the talk's spot (lat/lng may be null: then every phone signature is "unknown").
create or replace function public.open_checkin(co uuid, talk_client uuid, roster jsonb, statement text, title text,
  near_lat double precision, near_lng double precision, near_accuracy_m int)
returns text language plpgsql security definer set search_path = '' as $$
declare secret text := public.open_checkin(co, talk_client, roster, statement, title);
begin
  update public.checkin_sessions s set near_lat = open_checkin.near_lat, near_lng = open_checkin.near_lng,
    near_accuracy_m = least(greatest(round(open_checkin.near_accuracy_m), 0), 100000)
  where s.token_hash = encode(sha256(convert_to(secret, 'UTF8')), 'hex');
  return secret;
end;
$$;

-- Anyone with the code: sign once, with this phone's location if they allow it (null when not). Same checks as 0043.
create or replace function public.checkin_sign(token text, key text, image text, confirmed_at timestamptz,
  lat double precision, lng double precision, accuracy_m int, location_denied boolean)
returns boolean language plpgsql security definer set search_path = '' as $$
declare s public.checkin_sessions := private.open_checkin_by_token(token); nm text; loc record;
begin
  if s.id is null or private.company_paused(s.company_id) then return false; end if;
  select r->>'name' into nm from jsonb_array_elements(s.roster) r where r->>'key' = key;
  if nm is null then return false; end if;
  if image is null or char_length(image) > 200000 or image !~ '^data:image/png;base64,iVBORw0KGgo[A-Za-z0-9+/]*={0,2}$'
     or (char_length(image) - 22) % 4 <> 0 then return false; end if;
  if (lat is not null and (lat not between -90 and 90)) or (lng is not null and (lng not between -180 and 180)) then return false; end if;
  select * into loc from private.checkin_location(s.near_lat, s.near_lng, s.near_accuracy_m, lat, lng, accuracy_m);
  -- No position: "not shared" only when the person said no; a GPS that failed is "couldn't be checked".
  if lat is null or lng is null then loc.distance_m := null; loc.flag := case when location_denied then 'not_shared' else 'unknown' end; end if;
  insert into public.checkin_signatures (company_id, session_id, roster_key, name, image, confirmed_at, distance_m, location)
  values (s.company_id, s.id, key, nm, image, least(greatest(coalesce(confirmed_at, now()), s.created_at), now()), loc.distance_m, loc.flag)
  on conflict (session_id, roster_key) do nothing;
  return found;
end;
$$;

revoke all on function public.open_checkin(uuid, uuid, jsonb, text, text, double precision, double precision, int) from public, anon;
grant execute on function public.open_checkin(uuid, uuid, jsonb, text, text, double precision, double precision, int) to authenticated;
revoke all on function public.checkin_sign(text, text, text, timestamptz, double precision, double precision, int, boolean) from public;
grant execute on function public.checkin_sign(text, text, text, timestamptz, double precision, double precision, int, boolean) to anon, authenticated;
-- Phones must use the version that checks location, so a signature can't skip the check.
revoke execute on function public.checkin_sign(text, text, text, timestamptz) from anon, authenticated;

-- save_talk_record, as in 0024, plus the attendee's signed_on, distance_m and location.
CREATE OR REPLACE FUNCTION public.save_talk_record(record jsonb, attendees jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  cr record;
  existing uuid;
  new_id uuid;
  a jsonb;
  i int := 0;
  co uuid := (record->>'company_id')::uuid;
  cl uuid := (record->>'client_id')::uuid;
  photo text;
  sheet text;
begin
  -- Runs with the table owner's rights (direct inserts are revoked), so it checks access itself.
  if not private.can_present(co) then
    raise exception 'Only owners, admins and presenters can save a talk for this company.' using errcode = '42501';
  end if;
  select id into existing from public.talk_records where company_id = co and client_id = cl;
  if existing is not null then return existing; end if;

  photo := private.check_talk_file(co, cl, record->>'photo_path');
  sheet := private.check_talk_file(co, cl, record->>'sheet_path');
  insert into public.talk_records (
    company_id, client_id, created_by, talk_id, language, content, week_number, week_start, scheduled_talk_id, makeup_for_week, makeup_reason,
    jobsite_id, jobsite_name, team_id, team_name, team_lead_name,
    presenter_person_id, presenter_name, presenter_role, presenter_signature_path, presenter_signed_at,
    held_at, latitude, longitude, gps_accuracy_m, site_notes, heat, photo_path, photo_taken_at, signing_statement, period_weeks, sheet_path, sheet_taken_at, record_kind, pretask
  ) values (
    co, cl, auth.uid(), record->>'talk_id', record->>'language', record->'content',
    (record->>'week_number')::int, (record->>'week_start')::date, record->>'scheduled_talk_id',
    (record->>'makeup_for_week')::date, nullif(btrim(record->>'makeup_reason'), ''),
    (record->>'jobsite_id')::uuid, coalesce(record->>'jobsite_name', ''), (record->>'team_id')::uuid,
    coalesce(record->>'team_name', ''), coalesce(record->>'team_lead_name', ''),
    (record->>'presenter_person_id')::uuid, record->>'presenter_name', coalesce(record->>'presenter_role', ''),
    private.check_talk_file(co, cl, record->>'presenter_signature_path'), (record->>'presenter_signed_at')::timestamptz,
    (record->>'held_at')::timestamptz, (record->>'latitude')::double precision, (record->>'longitude')::double precision,
    (record->>'gps_accuracy_m')::double precision, coalesce(btrim(record->>'site_notes'), ''),
    case when jsonb_typeof(record->'heat') = 'object' then record->'heat' else null end,
    photo, case when photo is null then null else (record->>'photo_taken_at')::timestamptz end,
    case when jsonb_typeof(record->'signing_statement') = 'object' then record->'signing_statement' else null end,
    coalesce((record->>'period_weeks')::int, 1),
    sheet, case when sheet is null then null else (record->>'sheet_taken_at')::timestamptz end,
    coalesce(record->>'record_kind', 'weekly'),
    case when jsonb_typeof(record->'pretask') = 'object' then record->'pretask' else null end
  ) returning id into new_id;

  for a in select * from jsonb_array_elements(attendees) loop
    select r.location, r.distance_m into cr from public.checkin_results r
      where r.company_id = co and r.client_id = cl and r.roster_key = a->>'person_id';
    insert into public.talk_attendees (company_id, record_id, person_id, name, role, team_name, company_name, status, signature_path, signed_at, confirmed_at, position,
      signed_on, distance_m, location)
    values (
      co, new_id, (a->>'person_id')::uuid, a->>'name', coalesce(a->>'role', ''), coalesce(a->>'team_name', ''),
      coalesce(btrim(a->>'company_name'), ''), a->>'status', private.check_talk_file(co, cl, a->>'signature_path'),
      (a->>'signed_at')::timestamptz,
      case when a->>'status' = 'signed' then (a->>'confirmed_at')::timestamptz else null end, i,
      -- Signed on their own phone (crew self check-in, 0043/0044): the flag the database kept when the presenter's
      -- phone took the signature (checkin_results), never what the phone sends; distance and flag only.
      case when a->>'status' = 'signed' and cr.location is not null then 'own_phone' else 'presenter_phone' end,
      case when a->>'status' = 'signed' and cr.location is not null then cr.distance_m end,
      case when a->>'status' = 'signed' then cr.location end
    );
    i := i + 1;
  end loop;
  delete from public.checkin_results where company_id = co and client_id = cl;   -- used; nothing kept after the save
  return new_id;
end;
$function$;
revoke all on function public.save_talk_record(jsonb, jsonb) from public, anon;
grant execute on function public.save_talk_record(jsonb, jsonb) to authenticated;
