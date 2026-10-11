-- client_id is unique per company, not across every company (Joe's go, 2026-10-11).
-- client_id is made on the phone so an upload from the offline outbox can be retried safely. Unique across all
-- companies, a retry that collided with another company's id would fail with a database error instead of finding its
-- own row, and the error would tell one company that an id exists somewhere else. Unique per company keeps retries
-- safe and keeps companies fully apart. Every save function already looks rows up by company and client_id.
--
-- A constraint swap on four tables (talk_records, talk_issues, safety_events, inspections): the per-company unique is
-- added first, then the old one is dropped. No data changes; existing ids are already unique, so the new constraint
-- holds for every row. save_talk (0007) and save_inspection (0034) are replaced only so the issues they save use the
-- new constraint when a retry sends the same issue again.

do $$
declare t text; c text;
begin
  foreach t in array array['talk_records', 'talk_issues', 'safety_events', 'inspections'] loop
    execute format('alter table public.%I add constraint %I unique (company_id, client_id)', t, t || '_company_client_key');
    for c in select conname from pg_constraint
             where conrelid = format('public.%I', t)::regclass and contype = 'u' and pg_get_constraintdef(oid) = 'UNIQUE (client_id)' loop
      execute format('alter table public.%I drop constraint %I', t, c);
    end loop;
  end loop;
end;
$$;

-- Same as 0034, except issues raised by a failed item use the per-company unique.
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
    ) on conflict (company_id, client_id) do nothing;
  end loop;
  return new_id;
end;
$$;
revoke all on function public.save_inspection(jsonb, jsonb) from public, anon;
grant execute on function public.save_inspection(jsonb, jsonb) to authenticated;

-- Same as 0007, except a talk's issues use the per-company unique.
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
    ) on conflict (company_id, client_id) do nothing;
  end loop;
  return rec_id;
end;
$$;
revoke all on function public.save_talk(jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.save_talk(jsonb, jsonb, jsonb) to authenticated;
