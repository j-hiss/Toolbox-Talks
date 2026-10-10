-- Security hardening from the independent review of 2026-10-10 (before partner access is added).
-- Additive: no table or column is dropped or renamed and no data changes. Permissions, policies and functions only.
--
-- 1. Invites can only be claimed by an email-code (passwordless) account. A password sign-up with someone else's email
--    could otherwise look "confirmed" when email confirmation is off (supabase/config.toml now turns it on too).
-- 2. Talk records and attendance can only be written through save_talk_record(), which now checks presenter access
--    itself. Direct inserts let a presenter add forged "signed" rows to an old record or backdate a record.
-- 3. New rows can't carry inline signature images; signatures are private files checked by check_talk_file().
-- 4. Memberships are created only by create_company() and accept_invites(). Admins can change and remove staff but
--    can't add an arbitrary account, and can't rewrite whose membership a row is or its email.
-- 5. People are deactivated, never deleted (CLAUDE.md): no delete permission on people.
-- 6. Who-did-it columns (created_by, entered_by, set_by) are always the signed-in user, never what the phone sends.
-- 7. Issue history: every open/fixed change is kept in talk_issue_events, so reopening an issue no longer loses the
--    record that it was fixed, when and by whom.
-- Not here (needs Joe's go, see the report): client_id unique per company instead of across all companies.

-- 1. Invites ---------------------------------------------------------------------------------------------------------
create or replace function public.accept_invites()
returns int language plpgsql security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  addr text;
  inv record;
  n int := 0;
  rank constant text[] := array['employee', 'office', 'presenter', 'admin', 'owner'];
begin
  if me is null then return 0; end if;
  -- Proven email, signed in with an email code: no password on the account.
  select lower(u.email) into addr from auth.users u
  where u.id = me and u.email_confirmed_at is not null and coalesce(u.encrypted_password, '') = '';
  if addr is null then return 0; end if;
  for inv in select * from public.company_invites where email = addr and accepted_at is null for update loop
    insert into public.company_members (company_id, user_id, access, email) values (inv.company_id, me, inv.access, addr)
    on conflict (company_id, user_id) do update
      set access = case when array_position(rank, excluded.access) > array_position(rank, public.company_members.access)
                        then excluded.access else public.company_members.access end,
          email = excluded.email;
    if inv.person_id is not null then
      update public.people set user_id = me where company_id = inv.company_id and id = inv.person_id and user_id is null;
    end if;
    update public.company_invites set accepted_at = now(), accepted_by = me where id = inv.id;
    n := n + 1;
  end loop;
  return n;
end;
$$;

-- 2. Records only through the checked save --------------------------------------------------------------------------
create or replace function public.save_talk_record(record jsonb, attendees jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
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

revoke insert on public.talk_records, public.talk_attendees from authenticated;

-- 3. No new inline signature images (old rows stay valid) -----------------------------------------------------------
alter table public.talk_attendees add constraint talk_attendees_no_new_inline_signature check (signature is null) not valid;
alter table public.talk_records add constraint talk_records_no_new_inline_presenter_signature check (presenter_signature is null) not valid;

-- 4. Memberships ----------------------------------------------------------------------------------------------------
drop policy "admins manage staff" on public.company_members;
create policy "admins change staff" on public.company_members for update to authenticated
  using (private.is_owner(company_id) or (private.is_admin(company_id) and access in ('presenter', 'office', 'employee')))
  with check (private.is_owner(company_id) or (private.is_admin(company_id) and access in ('presenter', 'office', 'employee')));
create policy "admins remove staff" on public.company_members for delete to authenticated
  using (private.is_owner(company_id) or (private.is_admin(company_id) and access in ('presenter', 'office', 'employee')));
revoke insert on public.company_members from authenticated;

create or replace function private.pin_membership()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.company_id := old.company_id;
  new.user_id := old.user_id;
  new.email := old.email;
  new.created_at := old.created_at;
  return new;
end;
$$;
create trigger pin_membership before update on public.company_members for each row execute function private.pin_membership();

-- 5. People are deactivated, never deleted ---------------------------------------------------------------------------
revoke delete on public.people from authenticated;

-- 6. Who-did-it columns are the signed-in user ------------------------------------------------------------------------
create or replace function private.stamp_actor()
returns trigger language plpgsql set search_path = '' as $$
begin
  -- TG_ARGV[0] names the column. Only when someone is signed in (migrations and seeds run without a user).
  if auth.uid() is not null then
    new := jsonb_populate_record(new, jsonb_build_object(tg_argv[0], auth.uid()));
  end if;
  return new;
end;
$$;
create trigger stamp_actor before insert on public.talk_issues for each row execute function private.stamp_actor('created_by');
create trigger stamp_actor before insert on public.safety_events for each row execute function private.stamp_actor('created_by');
create trigger stamp_actor before insert on public.company_emr for each row execute function private.stamp_actor('entered_by');
create trigger stamp_actor before insert on public.person_certs for each row execute function private.stamp_actor('entered_by');
create trigger stamp_actor before insert on public.company_documents for each row execute function private.stamp_actor('entered_by');
create trigger stamp_actor before insert on public.plan_overrides for each row execute function private.stamp_actor('set_by');
create trigger stamp_actor before insert on public.company_talk_lists for each row execute function private.stamp_actor('set_by');
create trigger stamp_actor before insert on public.company_cadences for each row execute function private.stamp_actor('set_by');
create trigger stamp_actor before insert on public.company_repeats for each row execute function private.stamp_actor('set_by');

-- 7. Issue history ----------------------------------------------------------------------------------------------------
create table public.talk_issue_events (
  id          bigint generated always as identity primary key,
  company_id  uuid not null references public.companies (id) on delete cascade,
  issue_id    uuid not null,
  status      text not null,
  note        text not null default '',
  at          timestamptz not null default now(),
  by_user     uuid references auth.users (id)
);
create index talk_issue_events_issue_idx on public.talk_issue_events (company_id, issue_id, at);
alter table public.talk_issue_events enable row level security;
create policy "members read issue history" on public.talk_issue_events for select to authenticated using (private.is_member(company_id));
revoke all on public.talk_issue_events from anon, authenticated;
grant select on public.talk_issue_events to authenticated;

create or replace function private.log_issue_status()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status is distinct from old.status then
    insert into public.talk_issue_events (company_id, issue_id, status, note, by_user)
    values (new.company_id, new.id, new.status, coalesce(case when new.status = 'fixed' then new.fixed_note end, ''), auth.uid());
  end if;
  return new;
end;
$$;
create trigger log_issue_status after update on public.talk_issues for each row execute function private.log_issue_status();
