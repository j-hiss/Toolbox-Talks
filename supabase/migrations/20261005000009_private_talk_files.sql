-- Signatures and crew photos move out of the record rows into private file storage, plus walk-ins' company.
--
-- * Bucket "talk-files" is PRIVATE. Files live at <company_id>/<record client_id>/<file>. Members of that company can
--   add and read files in their own folder; nobody can overwrite or delete one (no update/delete policy), so a
--   signature can't be swapped after it's saved. The app reads them through short-lived signed URLs.
-- * New records point at files by path. save_talk_record checks every path is inside this record's own folder and
--   that the file is really there, so a record can never point at another company's (or another talk's) files.
-- * Records saved before this keep their inline images untouched (append-only); readers handle both.
-- * Additive, except one CHECK on talk_attendees is replaced by a wider one (signed = has an inline image OR a file).
--   No data changes. Flagged in the build report.

-- Storage ------------------------------------------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('talk-files', 'talk-files', false, 5242880, array['image/png', 'image/jpeg'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- The company a storage path belongs to (its first folder), or null if it isn't a company id.
create or replace function private.file_company(path text)
returns uuid language sql immutable set search_path = '' as $$
  select case when split_part(path, '/', 1) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
              then split_part(path, '/', 1)::uuid end;
$$;

create policy "talk files: members read their company's" on storage.objects for select to authenticated
  using (bucket_id = 'talk-files' and private.is_member(private.file_company(name)));
create policy "talk files: members add to their company's" on storage.objects for insert to authenticated
  with check (bucket_id = 'talk-files' and private.is_member(private.file_company(name)));
-- No update or delete policy for talk-files: saved files can't be replaced or removed from the app.

-- Columns --------------------------------------------------------------------------------------------------------------
alter table public.talk_records
  add column presenter_signature_path text,
  add column photo_path text,
  add column photo_taken_at timestamptz,
  add constraint talk_records_one_presenter_signature check (presenter_signature is null or presenter_signature_path is null),
  add constraint talk_records_photo_time check ((photo_path is null) = (photo_taken_at is null));

alter table public.talk_attendees
  add column signature_path text,
  add column company_name text not null default '' check (length(company_name) <= 120);

alter table public.talk_attendees drop constraint talk_attendees_check;
alter table public.talk_attendees
  add constraint talk_attendees_signed_has_signature
    check ((status = 'signed') = (signature is not null or signature_path is not null)),
  add constraint talk_attendees_one_signature check (signature is null or signature_path is null);

-- A file path a record may point at: inside <company>/<client_id>/ and actually uploaded.
create or replace function private.check_talk_file(company uuid, client uuid, path text)
returns text language plpgsql stable security invoker set search_path = '' as $$
begin
  if path is null or path = '' then return null; end if;
  if left(path, 74) <> company::text || '/' || client::text || '/' or position('..' in path) > 0 then
    raise exception 'File % is not in this talk''s folder', path;
  end if;
  if not exists (select 1 from storage.objects o where o.bucket_id = 'talk-files' and o.name = path) then
    raise exception 'File % has not been uploaded', path;
  end if;
  return path;
end;
$$;

-- save_talk_record: signatures and the crew photo by file path; inline images are no longer accepted.
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
    held_at, latitude, longitude, gps_accuracy_m, site_notes, heat, photo_path, photo_taken_at
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
    photo, case when photo is null then null else (record->>'photo_taken_at')::timestamptz end
  ) returning id into new_id;

  for a in select * from jsonb_array_elements(attendees) loop
    insert into public.talk_attendees (company_id, record_id, person_id, name, role, team_name, company_name, status, signature_path, signed_at, position)
    values (
      co, new_id, (a->>'person_id')::uuid, a->>'name', coalesce(a->>'role', ''), coalesce(a->>'team_name', ''),
      coalesce(btrim(a->>'company_name'), ''), a->>'status', private.check_talk_file(co, cl, a->>'signature_path'),
      (a->>'signed_at')::timestamptz, i
    );
    i := i + 1;
  end loop;
  return new_id;
end;
$$;
revoke all on function public.save_talk_record(jsonb, jsonb) from public, anon;
grant execute on function public.save_talk_record(jsonb, jsonb) to authenticated;
