-- The jobsite's address on each saved talk, next to its name and the GPS point, so the record shows where the talk
-- was without anyone looking the jobsite up (Joe, 2026-10-13). It's the address the jobsite had when the talk was
-- saved (typed in Admin or sent by the CRM), copied like the jobsite name, so a later change to the jobsite never
-- changes an old record. No outside address lookup.
-- Additive: one column with a default. save_talk_record is replaced only to keep it (same as 0057 plus that column).

alter table public.talk_records
  add column jobsite_address text not null default '' constraint talk_records_jobsite_address_len check (char_length(jobsite_address) <= 300);

-- save_talk_record, as in 0057, plus jobsite_address.
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
    held_at, latitude, longitude, gps_accuracy_m, site_notes, heat, photo_path, photo_taken_at, signing_statement, period_weeks, sheet_path, sheet_taken_at, record_kind, pretask, weather, jobsite_address
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
    case when jsonb_typeof(record->'pretask') = 'object' then record->'pretask' else null end,
    case when jsonb_typeof(record->'weather') = 'object' then record->'weather' else null end,
    left(coalesce(btrim(record->>'jobsite_address'), ''), 300)
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
