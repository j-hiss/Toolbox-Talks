-- Inspections: a checklist run on the phone (src/core/inspections.ts, content in src/content/checklists.ts).
-- Additive: one new table, one column on talk_issues, one function.
--
-- - Append-only, like talk records: an inspection is saved once, with the exact items checked, and never edited or
--   deleted. A correction is a new inspection.
-- - Owners, admins and presenters save them (private.can_present); staff read them. Saved through save_inspection(),
--   which checks access, item shape and file paths, and is safe to retry (client_id) for the offline outbox.
-- - Photos and the inspector's signature are private files in the talk-files bucket, in the inspection's own folder,
--   checked by private.check_talk_file (migration 0009).
-- - A failed item can raise a crew issue (talk_issues.inspection_id), so there's still one list of things to fix.
-- - Every inspection gets a check code like talk records (migration 0030), for its PDF.

create table public.inspections (
  id                  uuid primary key default gen_random_uuid(),
  company_id          uuid not null references public.companies (id) on delete cascade,
  client_id           uuid not null unique,
  checklist_id        text not null check (checklist_id ~ '^[a-z0-9-]{2,60}$'),
  checklist_version   int not null check (checklist_version >= 1),
  title               text not null check (char_length(btrim(title)) between 1 and 120),
  rule                text not null default '' check (char_length(rule) <= 300),
  items               jsonb not null,
  subject             text not null default '' check (char_length(subject) <= 120),
  jobsite_id          uuid,
  jobsite_name        text not null default '' check (char_length(jobsite_name) <= 200),
  inspector_person_id uuid,
  inspector_name      text not null check (char_length(btrim(inspector_name)) between 1 and 120),
  signature_path      text,
  notes               text not null default '' check (char_length(notes) <= 2000),
  inspected_at        timestamptz not null,
  latitude            double precision,
  longitude           double precision,
  failed_count        int not null default 0,
  verify_code         text not null unique default private.new_verify_code() check (verify_code ~ '^[2-9A-HJKMNP-Z]{16}$'),
  created_by          uuid references auth.users (id),
  created_at          timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, jobsite_id) references public.jobsites (company_id, id),
  foreign key (company_id, inspector_person_id) references public.people (company_id, id)
);
create index inspections_company_idx on public.inspections (company_id, inspected_at desc);
alter table public.inspections enable row level security;
create policy "staff read inspections" on public.inspections for select to authenticated using (private.is_member(company_id));
revoke all on public.inspections from anon, authenticated;
grant select on public.inspections to authenticated;   -- written only by save_inspection; never edited or deleted

alter table public.talk_issues add column inspection_id uuid;
alter table public.talk_issues add constraint talk_issues_inspection_fk foreign key (company_id, inspection_id) references public.inspections (company_id, id);

-- Items: 1 to 60, each { id, text, rule?, result: pass | fail | na, note?, photo_path? }.
create or replace function private.valid_inspection_items(items jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 60 and pg_column_size(items) <= 65536
    and (select bool_and(jsonb_typeof(i) = 'object'
           and jsonb_typeof(i->'id') = 'string' and jsonb_typeof(i->'text') = 'string'
           and i->>'result' in ('pass', 'fail', 'na')
           and (i->'note' is null or jsonb_typeof(i->'note') = 'string')
           and (i->'photo_path' is null or jsonb_typeof(i->'photo_path') in ('string', 'null')))
         from jsonb_array_elements(items) i);
$$;
grant execute on function private.valid_inspection_items(jsonb) to authenticated;

create or replace function public.save_inspection(insp jsonb, issues jsonb default '[]'::jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  co uuid := (insp->>'company_id')::uuid;
  cl uuid := (insp->>'client_id')::uuid;
  existing uuid;
  new_id uuid;
  checked jsonb := '[]'::jsonb;
  i jsonb;
  x jsonb;
begin
  if not private.can_present(co) then
    raise exception 'Only owners, admins and presenters can save an inspection for this company.' using errcode = '42501';
  end if;
  select id into existing from public.inspections where company_id = co and client_id = cl;
  if existing is not null then return existing; end if;
  if not private.valid_inspection_items(insp->'items') then
    raise exception 'The checklist items are missing or not in the right shape. Update the app and try again.' using errcode = '22023';
  end if;
  -- Every photo must be in this inspection's own folder and uploaded.
  for i in select * from jsonb_array_elements(insp->'items') loop
    checked := checked || jsonb_build_array(i || jsonb_build_object('photo_path', private.check_talk_file(co, cl, nullif(i->>'photo_path', ''))));
  end loop;
  insert into public.inspections (
    company_id, client_id, checklist_id, checklist_version, title, rule, items, subject, jobsite_id, jobsite_name,
    inspector_person_id, inspector_name, signature_path, notes, inspected_at, latitude, longitude, failed_count, created_by
  ) values (
    co, cl, insp->>'checklist_id', (insp->>'checklist_version')::int, btrim(insp->>'title'), coalesce(insp->>'rule', ''), checked,
    btrim(coalesce(insp->>'subject', '')), (insp->>'jobsite_id')::uuid, coalesce(insp->>'jobsite_name', ''),
    (insp->>'inspector_person_id')::uuid, btrim(insp->>'inspector_name'), private.check_talk_file(co, cl, insp->>'signature_path'),
    btrim(coalesce(insp->>'notes', '')), (insp->>'inspected_at')::timestamptz,
    (insp->>'latitude')::double precision, (insp->>'longitude')::double precision,
    (select count(*) from jsonb_array_elements(checked) e where e->>'result' = 'fail'), auth.uid()
  ) returning id into new_id;
  for x in select * from jsonb_array_elements(coalesce(issues, '[]'::jsonb)) loop
    insert into public.talk_issues (
      company_id, client_id, inspection_id, jobsite_id, jobsite_name, description, owner_person_id, owner_name, due_date, raised_by_name, raised_at
    ) values (
      co, (x->>'client_id')::uuid, new_id, (insp->>'jobsite_id')::uuid, coalesce(insp->>'jobsite_name', ''), btrim(x->>'description'),
      (x->>'owner_person_id')::uuid, coalesce(x->>'owner_name', ''), (x->>'due_date')::date, coalesce(x->>'raised_by_name', ''),
      coalesce((x->>'raised_at')::timestamptz, (insp->>'inspected_at')::timestamptz)
    ) on conflict (client_id) do nothing;
  end loop;
  return new_id;
end;
$$;
revoke all on function public.save_inspection(jsonb, jsonb) from public, anon;
grant execute on function public.save_inspection(jsonb, jsonb) to authenticated;

-- Check an inspection from its PDF, like verify_record (0030): counts only, no names, signatures, photos, places or
-- the free-text subject.
create or replace function public.verify_inspection(code text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  c text := upper(regexp_replace(coalesce(code, ''), '[^0-9A-Za-z]', '', 'g'));
  r public.inspections;
begin
  if c !~ '^[2-9A-HJKMNP-Z]{16}$' then return null; end if;
  select * into r from public.inspections where verify_code = c;
  if r.id is null then return null; end if;
  return jsonb_build_object(
    'company', (select name from public.companies where id = r.company_id),
    'title', r.title, 'rule', r.rule, -- not the subject: free text could name a person
    'inspected_at', r.inspected_at, 'saved_at', r.created_at,
    'items', jsonb_array_length(r.items),
    'passed', (select count(*) from jsonb_array_elements(r.items) e where e->>'result' = 'pass'),
    'failed', (select count(*) from jsonb_array_elements(r.items) e where e->>'result' = 'fail'),
    'na', (select count(*) from jsonb_array_elements(r.items) e where e->>'result' = 'na')
  );
end;
$$;
revoke all on function public.verify_inspection(text) from public;
grant execute on function public.verify_inspection(text) to anon, authenticated;
