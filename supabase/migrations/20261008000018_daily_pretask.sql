-- Daily pre-task plans (PTP), saved as talk records of their own kind. Additive only.
--
-- * talk_records.record_kind: 'weekly' (every record so far, the default) or 'daily'. A daily plan reuses the whole
--   record pipeline (roster, signatures in private files, offline outbox, PDF, append-only) but never counts toward
--   the weekly talk: it has no week, can't be a makeup, and the weekly lock and reports only look at weekly records.
-- * talk_records.pretask: the structured plan (tasks, hazards and controls, PPE, permits, emergency, equipment
--   answers). The same plan is also in `content` as sections, which is what the record page and PDF show.
-- * companies.daily_enabled: whether Home offers "Start today's pre-task plan". Off until an admin turns it on.

alter table public.companies add column daily_enabled boolean not null default false;

alter table public.talk_records
  add column record_kind text not null default 'weekly' check (record_kind in ('weekly', 'daily')),
  add column pretask jsonb check (pretask is null or (jsonb_typeof(pretask) = 'object' and pg_column_size(pretask) < 16384)),
  add constraint talk_records_daily_shape check (
    record_kind = 'weekly'
    or (week_start is null and week_number is null and makeup_for_week is null and pretask is not null)
  ),
  add constraint talk_records_pretask_daily_only check (pretask is null or record_kind = 'daily');
create index talk_records_daily_idx on public.talk_records (company_id, held_at desc) where record_kind = 'daily';

-- save_talk_record: same as 0017, plus record_kind and pretask.
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
  sheet text;
begin
  select id into existing from public.talk_records where client_id = cl;
  if existing is not null then return existing; end if;

  photo := private.check_talk_file(co, cl, record->>'photo_path');
  sheet := private.check_talk_file(co, cl, record->>'sheet_path');
  insert into public.talk_records (
    company_id, client_id, talk_id, language, content, week_number, week_start, scheduled_talk_id, makeup_for_week, makeup_reason,
    jobsite_id, jobsite_name, team_id, team_name, team_lead_name,
    presenter_person_id, presenter_name, presenter_role, presenter_signature_path, presenter_signed_at,
    held_at, latitude, longitude, gps_accuracy_m, site_notes, heat, photo_path, photo_taken_at, signing_statement, period_weeks, sheet_path, sheet_taken_at, record_kind, pretask
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
    coalesce((record->>'period_weeks')::int, 1),
    sheet, case when sheet is null then null else (record->>'sheet_taken_at')::timestamptz end,
    coalesce(record->>'record_kind', 'weekly'),
    case when jsonb_typeof(record->'pretask') = 'object' then record->'pretask' else null end
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
