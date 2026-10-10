-- Fixes from the independent review of the trainer and insurance partner portals (2026-10-10). Additive: one new
-- column, one new private table, functions and policies replaced. No data changes.
--
-- 1. Shared copies (share links and partner summaries) are checked by the database: only the known counts-and-rates
--    keys, no document titles, no EMR notes. Free text could name a person. The period must match the copy.
-- 2. A trainer can have at most 200 cards waiting per company, and upload at most 100 card photos a day.
-- 4. Partner invites and sends work only for a company switched on for the pilot (private.partner_pilot), which
--    only the database owner can change. Counsel's privacy review comes first.
-- 5. An approved card records which submission it came from (person_certs.submission_id), instead of a label in the
--    note that a long note could cut off. Only the approval itself can set it.

-- 1. Shared copies --------------------------------------------------------------------------------------------------
create or replace function private.valid_profile_copy(c jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select jsonb_typeof(c) = 'object'
    and pg_column_size(c) <= 262144
    and (select coalesce(bool_and(k = any (array['v', 'kind', 'company', 'profile', 'florida', 'crew'])), true) from jsonb_object_keys(c) k)
    and (jsonb_typeof(c->'company') is null or (jsonb_typeof(c->'company') = 'object' and
         (select coalesce(bool_and(k = any (array['name', 'licenses', 'address', 'phone', 'email', 'industry', 'theme'])), true) from jsonb_object_keys(c->'company') k)))
    and jsonb_typeof(c->'profile') = 'object'
    and (select coalesce(bool_and(k = any (array['from', 'to', 'talks', 'makeups', 'topics', 'languages', 'periodsEnded', 'periodsWithTalk',
         'periodsMissed', 'missedKeys', 'total', 'signIn', 'onTime', 'months', 'dailyDays', 'log', 'issues', 'elements', 'emr', 'documents'])), true)
         from jsonb_object_keys(c->'profile') k)
    -- Documents: kind and date only, the title always empty.
    and (select coalesce(bool_and(jsonb_typeof(d) = 'object' and coalesce(d->>'title', '') = ''
         and (select coalesce(bool_and(k = any (array['kind', 'title', 'uploaded_at'])), true) from jsonb_object_keys(d) k)), true)
         from jsonb_array_elements(case when jsonb_typeof(c->'profile'->'documents') = 'array' then c->'profile'->'documents' else '[]'::jsonb end) d)
    -- EMR: year, rate and date only, the note always empty.
    and (select coalesce(bool_and(jsonb_typeof(e) = 'object' and coalesce(e->>'note', '') = ''
         and (select coalesce(bool_and(k = any (array['rating_year', 'emr', 'note', 'entered_at'])), true) from jsonb_object_keys(e) k)), true)
         from jsonb_array_elements(case when jsonb_typeof(c->'profile'->'emr') = 'array' then c->'profile'->'emr' else '[]'::jsonb end) e)
    and (select coalesce(bool_and(jsonb_typeof(x) = 'object'
         and (select coalesce(bool_and(k = any (array['id', 'name', 'status', 'evidence'])), true) from jsonb_object_keys(x) k)), true)
         from jsonb_array_elements(case when jsonb_typeof(c->'profile'->'elements') = 'array' then c->'profile'->'elements' else '[]'::jsonb end) x);
$$;

create or replace function public.create_profile_share(co uuid, label text, days int, period_from date, period_to date, snapshot jsonb)
returns text language plpgsql security definer set search_path = '' as $$
declare
  secret text := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
begin
  if not private.is_admin(co) then
    raise exception 'Only owners and admins can share the safety profile.' using errcode = '42501';
  end if;
  if days is null or days < 1 or days > 90 then
    raise exception 'A link can last 1 to 90 days.' using errcode = '22023';
  end if;
  if not private.valid_profile_copy(snapshot) then
    raise exception 'The profile copy has something a shared summary can''t carry. Update the app and try again.' using errcode = '22023';
  end if;
  if period_from::text is distinct from snapshot->'profile'->>'from' or period_to::text is distinct from snapshot->'profile'->>'to' then
    raise exception 'The dates don''t match the profile copy.' using errcode = '22023';
  end if;
  insert into public.profile_shares (company_id, token_hash, label, snapshot, period_from, period_to, created_by, expires_at)
  values (co, encode(sha256(convert_to(secret, 'UTF8')), 'hex'), btrim(label), snapshot, period_from, period_to, auth.uid(),
          now() + make_interval(days => days));
  return secret;
end;
$$;

-- 4. The partner pilot switch ---------------------------------------------------------------------------------------
-- Turn it on for one company (database owner only, e.g. in the Supabase SQL editor):
--   insert into private.partner_pilot (company_id, note) values ('<company id>', 'pilot approved by counsel');
create table private.partner_pilot (
  company_id  uuid primary key references public.companies (id) on delete cascade,
  note        text not null default '',
  enabled_at  timestamptz not null default now()
);
revoke all on private.partner_pilot from public, anon, authenticated;

create or replace function private.partner_pilot_on(co uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from private.partner_pilot where company_id = co);
$$;
revoke execute on function private.partner_pilot_on(uuid) from public, anon;
grant execute on function private.partner_pilot_on(uuid) to authenticated;

create or replace function public.invite_partner(co uuid, email text, name text, kind text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  if not private.is_admin(co) then raise exception 'Only owners and admins can invite an insurance partner.' using errcode = '42501'; end if;
  if not private.partner_pilot_on(co) then
    raise exception 'The insurance partner pilot isn''t switched on for this company.' using errcode = '42501';
  end if;
  insert into public.company_partners (company_id, email, name, kind, invited_by)
  values (co, lower(btrim(email)), btrim(name), kind, auth.uid()) returning id into new_id;
  return new_id;
exception when unique_violation then
  raise exception 'That partner is already invited.' using errcode = '23505';
end;
$$;

create or replace function public.send_partner_report(partner uuid, period_from date, period_to date, snapshot jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare co uuid; new_id uuid;
begin
  select company_id into co from public.company_partners where id = partner and removed_at is null;
  if co is null or not private.is_admin(co) then raise exception 'Partner not found.' using errcode = '42501'; end if;
  if not private.partner_pilot_on(co) then
    raise exception 'The insurance partner pilot isn''t switched on for this company.' using errcode = '42501';
  end if;
  if not private.valid_profile_copy(snapshot) then
    raise exception 'The summary has something a partner can''t receive. Update the app and try again.' using errcode = '22023';
  end if;
  if period_from::text is distinct from snapshot->'profile'->>'from' or period_to::text is distinct from snapshot->'profile'->>'to' then
    raise exception 'The dates don''t match the summary.' using errcode = '22023';
  end if;
  insert into public.partner_reports (company_id, partner_id, snapshot, period_from, period_to, sent_by)
  values (co, partner, snapshot, period_from, period_to, auth.uid()) returning id into new_id;
  return new_id;
end;
$$;

-- 2. Limits on what a trainer can send -------------------------------------------------------------------------------
create or replace function public.submit_cert(c jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  co uuid := (c->>'company_id')::uuid;
  person uuid := (c->>'person_id')::uuid;
  cl uuid := (c->>'client_id')::uuid;
  tr uuid := private.my_trainer_id(co);
  path text := nullif(c->>'card_path', '');
  existing uuid;
  new_id uuid;
begin
  if tr is null or not private.trainer_sees(co, person) then
    raise exception 'You can only send cards for people this company gave you.' using errcode = '42501';
  end if;
  select id into existing from public.cert_submissions where trainer_id = tr and client_id = cl;
  if existing is not null then return existing; end if;
  if (select count(*) from public.cert_submissions where trainer_id = tr and status = 'pending') >= 200 then
    raise exception 'You have 200 cards waiting for this company. Ask them to review those first.' using errcode = '54000';
  end if;
  if path is not null and (path not like co::text || '/trainer/' || tr::text || '/%'
     or not exists (select 1 from storage.objects o where o.bucket_id = 'person-certs' and o.name = path)) then
    raise exception 'The card photo is missing. Try sending it again.' using errcode = '22023';
  end if;
  insert into public.cert_submissions (company_id, trainer_id, person_id, client_id, cert_type, custom_name, issued_on, expires_on, note, card_path, submitted_by)
  values (co, tr, person, cl, c->>'cert_type', case when c->>'cert_type' = 'custom' then btrim(coalesce(c->>'custom_name', '')) else '' end,
          (c->>'issued_on')::date, (c->>'expires_on')::date, btrim(coalesce(c->>'note', '')), path, auth.uid())
  returning id into new_id;
  return new_id;
end;
$$;

-- Card photos a trainer uploaded in the last day (runs as owner: the trainer can't read storage rows themselves).
create or replace function private.trainer_uploads_today(prefix text)
returns int language sql stable security definer set search_path = '' as $$
  select count(*)::int from storage.objects o
  where o.bucket_id = 'person-certs' and o.name like prefix || '%' and o.created_at > now() - interval '1 day';
$$;
revoke execute on function private.trainer_uploads_today(text) from public, anon;
grant execute on function private.trainer_uploads_today(text) to authenticated;

drop policy "card photos: trainers add to their own folder" on storage.objects;
create policy "card photos: trainers add to their own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'person-certs' and split_part(name, '/', 2) = 'trainer'
              and split_part(name, '/', 3) = private.my_trainer_id(private.file_company(name))::text
              and private.trainer_uploads_today(split_part(name, '/', 1) || '/trainer/' || split_part(name, '/', 3) || '/') < 100);

-- 5. Where an approved card came from --------------------------------------------------------------------------------
alter table public.person_certs add column submission_id uuid unique references public.cert_submissions (id);

-- Set only inside decide_cert_submission (which marks the approval it is making), never by hand, never changed.
create or replace function private.guard_cert_submission()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then
    new.submission_id := old.submission_id;
  elsif new.submission_id is not null
        and new.submission_id::text is distinct from current_setting('app.approving_submission', true) then
    raise exception 'Only an approval can link a card to a trainer''s submission.' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger guard_cert_submission before insert or update on public.person_certs for each row execute function private.guard_cert_submission();

create or replace function public.decide_cert_submission(submission uuid, approve boolean, reason text default '')
returns void language plpgsql security definer set search_path = '' as $$
declare
  s public.cert_submissions;
  new_cert uuid;
begin
  select * into s from public.cert_submissions where id = submission for update;
  if s.id is null or not private.is_admin(s.company_id) then raise exception 'Card not found.' using errcode = '42501'; end if;
  if s.status <> 'pending' then raise exception 'This card was already reviewed.' using errcode = '23514'; end if;
  if approve then
    perform set_config('app.approving_submission', s.id::text, true);
    insert into public.person_certs (company_id, person_id, cert_type, custom_name, issued_on, expires_on, note, card_path, entered_by, submission_id)
    values (s.company_id, s.person_id, s.cert_type, s.custom_name, s.issued_on, s.expires_on, s.note, s.card_path, auth.uid(), s.id)
    returning id into new_cert;
    perform set_config('app.approving_submission', '', true);
    update public.cert_submissions set status = 'approved', decided_by = auth.uid(), decided_at = now(), cert_id = new_cert where id = s.id;
  else
    if coalesce(btrim(reason), '') = '' then raise exception 'Say why the card is declined.' using errcode = '23514'; end if;
    update public.cert_submissions set status = 'declined', decided_by = auth.uid(), decided_at = now(), decline_reason = btrim(reason) where id = s.id;
  end if;
end;
$$;
