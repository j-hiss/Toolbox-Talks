-- Signed talk records. APPEND-ONLY: members can insert and read; nobody can update or delete through the app.
-- A record keeps a snapshot of what was read and who was there (names, roles, team, jobsite) so it still reads
-- correctly after people, teams or talk wording change. Corrections will be new linked records (later migration).

create table public.talk_records (
  id                    uuid primary key default gen_random_uuid(),
  company_id            uuid not null references public.companies (id) on delete cascade,
  client_id             uuid not null unique,      -- made on the phone; makes uploads from the offline outbox idempotent
  talk_id               text not null,
  language              text not null check (language in ('en', 'es', 'pt', 'ht', 'vi', 'zh')),
  content               jsonb not null,            -- exactly what was read: { title, hook, sections[], ask } (+ "en" copy)
  week_number           int check (week_number between 1 and 52),
  week_start            date,
  scheduled_talk_id     text,                      -- the plan's talk for that week; differs when this was a substitute
  jobsite_id            uuid,
  jobsite_name          text not null default '',
  team_id               uuid,
  team_name             text not null default '',
  team_lead_name        text not null default '',
  presenter_person_id   uuid,
  presenter_name        text not null,
  presenter_role        text not null default '',
  presenter_signature   text,                      -- PNG data URL; null = presenter didn't sign (flagged)
  presenter_signed_at   timestamptz,
  held_at               timestamptz not null,
  latitude              double precision,
  longitude             double precision,
  gps_accuracy_m        double precision,
  created_by            uuid not null default auth.uid() references auth.users (id),
  created_at            timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, jobsite_id) references public.jobsites (company_id, id),
  foreign key (company_id, team_id) references public.teams (company_id, id) on delete set null (team_id),
  foreign key (company_id, presenter_person_id) references public.people (company_id, id)
);
create index talk_records_company_held_idx on public.talk_records (company_id, held_at desc);

create table public.talk_attendees (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null,
  record_id   uuid not null,
  person_id   uuid,                                -- null for walk-ins not on the roster
  name        text not null,
  role        text not null default '',
  team_name   text not null default '',
  status      text not null check (status in ('signed', 'not_signed', 'absent')),
  signature   text,                                -- PNG data URL, only when signed
  signed_at   timestamptz,
  position    int not null,
  check ((status = 'signed') = (signature is not null)),
  foreign key (company_id, record_id) references public.talk_records (company_id, id) on delete cascade,
  foreign key (company_id, person_id) references public.people (company_id, id)
);
create index talk_attendees_record_idx on public.talk_attendees (record_id, position);

alter table public.talk_records   enable row level security;
alter table public.talk_attendees enable row level security;

create policy "members read" on public.talk_records for select to authenticated using (private.is_member(company_id));
create policy "members record talks" on public.talk_records for insert to authenticated
  with check (private.is_member(company_id) and created_by = auth.uid());
create policy "members read" on public.talk_attendees for select to authenticated using (private.is_member(company_id));
create policy "members record attendance" on public.talk_attendees for insert to authenticated
  with check (private.is_member(company_id));

-- Append-only at the permission level: no update or delete grant at all.
revoke all on public.talk_records, public.talk_attendees from anon, authenticated;
grant select, insert on public.talk_records, public.talk_attendees to authenticated;

-- Saves a record and all its attendees in one transaction. Runs as the caller, so RLS applies to every row.
-- Re-sending the same client_id returns the existing record instead of saving it twice (outbox retries).
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
    company_id, client_id, talk_id, language, content, week_number, week_start, scheduled_talk_id,
    jobsite_id, jobsite_name, team_id, team_name, team_lead_name,
    presenter_person_id, presenter_name, presenter_role, presenter_signature, presenter_signed_at,
    held_at, latitude, longitude, gps_accuracy_m
  ) values (
    (record->>'company_id')::uuid, (record->>'client_id')::uuid, record->>'talk_id', record->>'language', record->'content',
    (record->>'week_number')::int, (record->>'week_start')::date, record->>'scheduled_talk_id',
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
