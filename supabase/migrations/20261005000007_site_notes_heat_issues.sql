-- Today's site notes, the heat forecast at the time of the talk, and issues the crew raised.
--
-- * talk_records.site_notes: a line or two the presenter added for this site today. Part of the record (append-only).
-- * talk_records.heat: the forecast heat when the talk was given, if it was checked:
--   { "max_heat_index_f": 104, "level": "danger", "reminder_read": true, "checked_at": "...", "source": "NWS" }
-- * talk_issues: hazards or problems the crew raised at a talk, each with an owner and a fix-by date. Issues are
--   worked on afterward (assigned, marked fixed), so they can be updated; what was raised, when and at which talk
--   never changes, and nothing is deleted.
-- * save_talk(record, attendees, issues): saves the record and its issues in one transaction. Idempotent like
--   save_talk_record, so the offline outbox can retry safely.
-- Additive only.

alter table public.talk_records
  add column site_notes text not null default '' check (length(site_notes) <= 1000),
  add column heat jsonb;

create table public.talk_issues (
  id               uuid primary key default gen_random_uuid(),
  company_id       uuid not null references public.companies (id) on delete cascade,
  client_id        uuid not null unique,           -- made on the phone; idempotent uploads
  record_id        uuid,                            -- the talk it was raised at
  jobsite_id       uuid,
  jobsite_name     text not null default '',
  description      text not null check (length(trim(description)) > 0 and length(description) <= 1000),
  owner_person_id  uuid,
  owner_name       text not null default '',
  due_date         date,
  status           text not null default 'open' check (status in ('open', 'fixed')),
  raised_by_name   text not null default '',
  raised_at        timestamptz not null default now(),
  fixed_at         timestamptz,
  fixed_note       text not null default '',
  fixed_by         uuid references auth.users (id),
  created_by       uuid not null default auth.uid() references auth.users (id),
  unique (company_id, id),
  check ((status = 'fixed') = (fixed_at is not null)),
  foreign key (company_id, record_id) references public.talk_records (company_id, id),
  foreign key (company_id, jobsite_id) references public.jobsites (company_id, id),
  foreign key (company_id, owner_person_id) references public.people (company_id, id)
);
create index talk_issues_open_idx on public.talk_issues (company_id, status, due_date);

alter table public.talk_issues enable row level security;
create policy "members read" on public.talk_issues for select to authenticated using (private.is_member(company_id));
create policy "members raise" on public.talk_issues for insert to authenticated with check (private.is_member(company_id));
create policy "members work issues" on public.talk_issues for update to authenticated
  using (private.is_member(company_id)) with check (private.is_member(company_id));
revoke all on public.talk_issues from anon, authenticated;
grant select, insert, update on public.talk_issues to authenticated;   -- no delete

-- What was raised stays as raised; fixing stamps who and when; reopening clears it.
create or replace function private.guard_issue()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.company_id := old.company_id;
  new.client_id := old.client_id;
  new.record_id := old.record_id;
  new.description := old.description;
  new.raised_at := old.raised_at;
  new.raised_by_name := old.raised_by_name;
  new.created_by := old.created_by;
  if new.status = 'fixed' and old.status <> 'fixed' then
    new.fixed_at := now();
    new.fixed_by := auth.uid();
  elsif new.status = 'open' then
    new.fixed_at := null;
    new.fixed_by := null;
    new.fixed_note := '';
  else
    new.fixed_at := old.fixed_at;
    new.fixed_by := old.fixed_by;
  end if;
  return new;
end;
$$;
create trigger talk_issues_guard before update on public.talk_issues for each row execute function private.guard_issue();

-- save_talk_record now also stores site notes and heat. Same signature, same behavior otherwise.
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
    held_at, latitude, longitude, gps_accuracy_m, site_notes, heat
  ) values (
    (record->>'company_id')::uuid, (record->>'client_id')::uuid, record->>'talk_id', record->>'language', record->'content',
    (record->>'week_number')::int, (record->>'week_start')::date, record->>'scheduled_talk_id',
    (record->>'makeup_for_week')::date, nullif(btrim(record->>'makeup_reason'), ''),
    (record->>'jobsite_id')::uuid, coalesce(record->>'jobsite_name', ''), (record->>'team_id')::uuid,
    coalesce(record->>'team_name', ''), coalesce(record->>'team_lead_name', ''),
    (record->>'presenter_person_id')::uuid, record->>'presenter_name', coalesce(record->>'presenter_role', ''),
    record->>'presenter_signature', (record->>'presenter_signed_at')::timestamptz,
    (record->>'held_at')::timestamptz, (record->>'latitude')::double precision, (record->>'longitude')::double precision,
    (record->>'gps_accuracy_m')::double precision, coalesce(btrim(record->>'site_notes'), ''),
    case when jsonb_typeof(record->'heat') = 'object' then record->'heat' else null end
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

-- The record plus the issues raised at it, in one transaction. Safe to retry.
create or replace function public.save_talk(record jsonb, attendees jsonb, issues jsonb)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  rec_id uuid;
  x jsonb;
begin
  rec_id := public.save_talk_record(record, attendees);
  for x in select * from jsonb_array_elements(coalesce(issues, '[]'::jsonb)) loop
    insert into public.talk_issues (
      company_id, client_id, record_id, jobsite_id, jobsite_name, description, owner_person_id, owner_name, due_date,
      raised_by_name, raised_at
    ) values (
      (record->>'company_id')::uuid, (x->>'client_id')::uuid, rec_id, (record->>'jobsite_id')::uuid,
      coalesce(record->>'jobsite_name', ''), btrim(x->>'description'), (x->>'owner_person_id')::uuid,
      coalesce(x->>'owner_name', ''), (x->>'due_date')::date, coalesce(x->>'raised_by_name', ''),
      coalesce((x->>'raised_at')::timestamptz, (record->>'held_at')::timestamptz)
    ) on conflict (client_id) do nothing;
  end loop;
  return rec_id;
end;
$$;
revoke all on function public.save_talk(jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.save_talk(jsonb, jsonb, jsonb) to authenticated;
