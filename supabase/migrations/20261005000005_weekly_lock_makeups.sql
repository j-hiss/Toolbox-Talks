-- One talk per week for the whole company, makeups for missed weeks, and office/shop locations.
--
-- * plan_overrides: an admin can swap a week's talk, but only for a week that is not over and that nobody has
--   recorded yet. Once any session of that week's talk is saved, the week is locked for good.
-- * talk_records.makeup_for_week + makeup_reason: a makeup keeps its REAL date, week and GPS (nothing is back-dated);
--   it also names the past week it makes up and why (someone was off, sick, new hire...). Reports count it toward
--   that week and show it as a makeup, so on-time vs. late can be graded honestly.
-- * companies.makeup_weeks: how many weeks back a makeup is allowed (admin setting).
-- * jobsites.kind: 'site' or 'office' (talks at the office or shop are normal, not a red flag).
-- Additive only.

alter table public.companies add column makeup_weeks int not null default 4 check (makeup_weeks between 1 and 52);
alter table public.jobsites add column kind text not null default 'site' check (kind in ('site', 'office'));
alter table public.talk_records
  add column makeup_for_week date check (extract(isodow from makeup_for_week) = 1),
  add column makeup_reason text,
  add constraint makeup_has_reason check ((makeup_for_week is null) = (nullif(btrim(makeup_reason), '') is null)),
  add constraint makeup_is_earlier check (makeup_for_week is null or week_start is null or makeup_for_week < week_start);
create index talk_records_week_idx on public.talk_records (company_id, week_start);
create index talk_records_makeup_idx on public.talk_records (company_id, makeup_for_week) where makeup_for_week is not null;

create table public.plan_overrides (
  company_id  uuid not null references public.companies (id) on delete cascade,
  week_start  date not null check (extract(isodow from week_start) = 1),   -- a Monday
  talk_id     text not null,
  set_by      uuid not null default auth.uid() references auth.users (id),
  set_at      timestamptz not null default now(),
  primary key (company_id, week_start)
);

alter table public.plan_overrides enable row level security;
create policy "members read" on public.plan_overrides for select to authenticated using (private.is_member(company_id));
create policy "admins write" on public.plan_overrides for all to authenticated
  using (private.is_admin(company_id)) with check (private.is_admin(company_id));
revoke all on public.plan_overrides from anon, authenticated;
grant select, insert, update, delete on public.plan_overrides to authenticated;

-- The lock, enforced in the database so no app bug can change a week that's already been given.
create or replace function private.guard_plan_override()
returns trigger language plpgsql security definer set search_path = '' as $$
declare wk date := coalesce(new.week_start, old.week_start);
        co uuid := coalesce(new.company_id, old.company_id);
begin
  if wk + 7 <= current_date then
    raise exception 'Week of % is over; its talk can no longer change.', wk using errcode = 'P0001';
  end if;
  if exists (select 1 from public.talk_records r where r.company_id = co and r.week_start = wk and r.makeup_for_week is null) then
    raise exception 'Week of % has already been recorded; its talk is locked.', wk using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$$;
create trigger plan_overrides_lock before insert or update or delete on public.plan_overrides
  for each row execute function private.guard_plan_override();

-- save_talk_record now also stores the makeup week and reason. Same signature, same behavior otherwise.
create or replace function public.save_talk_record(record jsonb, attendees jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  existing uuid;
  new_id uuid;
  a jsonb;
  i int := 0;
begin
  select id into existing from public.talk_records where client_id = (record->>'client_id')::uuid;
  if existing is not null then return existing; end if;

  insert into public.talk_records (
    company_id, client_id, talk_id, language, content, week_number, week_start, scheduled_talk_id, makeup_for_week, makeup_reason,
    jobsite_id, jobsite_name, team_id, team_name, team_lead_name,
    presenter_person_id, presenter_name, presenter_role, presenter_signature, presenter_signed_at,
    held_at, latitude, longitude, gps_accuracy_m
  ) values (
    (record->>'company_id')::uuid, (record->>'client_id')::uuid, record->>'talk_id', record->>'language', record->'content',
    (record->>'week_number')::int, (record->>'week_start')::date, record->>'scheduled_talk_id',
    (record->>'makeup_for_week')::date, nullif(btrim(record->>'makeup_reason'), ''),
    (record->>'jobsite_id')::uuid, coalesce(record->>'jobsite_name', ''), (record->>'team_id')::uuid,
    coalesce(record->>'team_name', ''), coalesce(record->>'team_lead_name', ''),
    (record->>'presenter_person_id')::uuid, record->>'presenter_name', coalesce(record->>'presenter_role', ''),
    record->>'presenter_signature', (record->>'presenter_signed_at')::timestamptz,
    (record->>'held_at')::timestamptz, (record->>'latitude')::double precision, (record->>'longitude')::double precision,
    (record->>'gps_accuracy_m')::double precision
  ) returning id into new_id;

  for a in select * from jsonb_array_elements(attendees) loop
    insert into public.talk_attendees (company_id, record_id, person_id, name, role, team_name, status, signature, signed_at, position)
    values (
      (record->>'company_id')::uuid, new_id, (a->>'person_id')::uuid, a->>'name', coalesce(a->>'role', ''),
      coalesce(a->>'team_name', ''), a->>'status', a->>'signature', (a->>'signed_at')::timestamptz, i
    );
    i := i + 1;
  end loop;
  return new_id;
end;
$$;
revoke all on function public.save_talk_record(jsonb, jsonb) from public, anon;
grant execute on function public.save_talk_record(jsonb, jsonb) to authenticated;
