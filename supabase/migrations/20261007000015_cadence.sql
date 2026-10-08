-- How often a company gives a new talk (Admin → Plan): every week (the default), every 2 weeks, or every 4 weeks
-- ("monthly": never more than a month apart). Additive only.
--
-- * company_cadences: one row per change, starting on a Monday. Like talk lists, a cadence is kept once its week
--   starts, so past talk periods (and their makeups and reports) never re-shape. Only a change that starts after
--   today can be added, replaced or removed. No row = weekly, exactly as before.
-- * A talk period is keyed by its first Monday everywhere: plan_overrides.week_start, talk_records.week_start and
--   makeup_for_week. talk_records.period_weeks says how long the period was (1 for every record before this), so
--   the PDF can say which weeks the talk covered.
-- * The plan-swap lock now knows the period length: a 4-week period's talk can be swapped until the period ends
--   (not just its first week), and still locks as soon as anyone gives it.
-- * save_talk_record stores period_weeks. Same signature and checks as 0012; only that field added.

create table public.company_cadences (
  company_id  uuid not null references public.companies (id) on delete cascade,
  from_week   date not null check (extract(isodow from from_week) = 1),   -- a Monday
  weeks       int not null check (weeks in (1, 2, 4)),
  set_by      uuid not null default auth.uid() references auth.users (id),
  set_at      timestamptz not null default now(),
  primary key (company_id, from_week)
);

alter table public.company_cadences enable row level security;
create policy "members read" on public.company_cadences for select to authenticated using (private.is_member(company_id));
create policy "admins write" on public.company_cadences for all to authenticated
  using (private.is_admin(company_id)) with check (private.is_admin(company_id));
revoke all on public.company_cadences from anon, authenticated;
grant select, insert, update, delete on public.company_cadences to authenticated;

create or replace function private.guard_cadence()
returns trigger language plpgsql security definer set search_path = '' as $$
declare wk date := coalesce(new.from_week, old.from_week);
begin
  if wk <= current_date or (tg_op = 'UPDATE' and old.from_week <= current_date) then
    raise exception 'A new cadence has to start after today (%), so talk periods already planned keep their shape.', wk using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$$;
create trigger company_cadences_lock before insert or update or delete on public.company_cadences
  for each row execute function private.guard_cadence();

-- Weeks in the talk period that starts on `wk` for a company: its cadence then, cut short by a later change.
create or replace function private.period_weeks(co uuid, wk date)
returns int language sql stable security definer set search_path = '' as $$
  select least(
    coalesce((select c.weeks from public.company_cadences c where c.company_id = co and c.from_week <= wk order by c.from_week desc limit 1), 1),
    coalesce((select ((min(c.from_week) - wk) / 7)::int from public.company_cadences c where c.company_id = co and c.from_week > wk), 4)
  );
$$;
revoke all on function private.period_weeks(uuid, date) from public;

create or replace function private.guard_plan_override()
returns trigger language plpgsql security definer set search_path = '' as $$
declare wk date := coalesce(new.week_start, old.week_start);
        co uuid := coalesce(new.company_id, old.company_id);
begin
  if wk + 7 * private.period_weeks(co, wk) <= current_date then
    raise exception 'The talk period starting % is over; its talk can no longer change.', wk using errcode = 'P0001';
  end if;
  if exists (select 1 from public.talk_records r where r.company_id = co and r.week_start = wk and r.makeup_for_week is null) then
    raise exception 'The talk period starting % has already been recorded; its talk is locked.', wk using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$$;

alter table public.talk_records add column period_weeks int not null default 1 check (period_weeks in (1, 2, 3, 4));

create or replace function public.save_talk_record(record jsonb, attendees jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  existing uuid;
  new_id uuid;
  a jsonb;
  i int := 0;
  co uuid := (record->>'company_id')::uuid;
  cl uuid := (record->>'client_id')::uuid;
  photo text;
begin
  select id into existing from public.talk_records where client_id = cl;
  if existing is not null then return existing; end if;

  photo := private.check_talk_file(co, cl, record->>'photo_path');
  insert into public.talk_records (
    company_id, client_id, talk_id, language, content, week_number, week_start, scheduled_talk_id, makeup_for_week, makeup_reason,
    jobsite_id, jobsite_name, team_id, team_name, team_lead_name,
    presenter_person_id, presenter_name, presenter_role, presenter_signature_path, presenter_signed_at,
    held_at, latitude, longitude, gps_accuracy_m, site_notes, heat, photo_path, photo_taken_at, signing_statement, period_weeks
  ) values (
    co, cl, record->>'talk_id', record->>'language', record->'content',
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
    coalesce((record->>'period_weeks')::int, 1)
  ) returning id into new_id;

  for a in select * from jsonb_array_elements(attendees) loop
    insert into public.talk_attendees (company_id, record_id, person_id, name, role, team_name, company_name, status, signature_path, signed_at, confirmed_at, position)
    values (
      co, new_id, (a->>'person_id')::uuid, a->>'name', coalesce(a->>'role', ''), coalesce(a->>'team_name', ''),
      coalesce(btrim(a->>'company_name'), ''), a->>'status', private.check_talk_file(co, cl, a->>'signature_path'),
      (a->>'signed_at')::timestamptz,
      case when a->>'status' = 'signed' then (a->>'confirmed_at')::timestamptz else null end, i
    );
    i := i + 1;
  end loop;
  return new_id;
end;
$$;

revoke all on function public.save_talk_record(jsonb, jsonb) from public, anon;
grant execute on function public.save_talk_record(jsonb, jsonb) to authenticated;
