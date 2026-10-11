-- Running many customer companies: an account per company, an operator console, read-only pause, data export and a
-- guarded purge. Additive: new tables and functions, one trigger per company table. No column is dropped or changed.
--
-- - company_accounts: one row per company with its plan (trial, pilot, paid, comp), trial end, whether it is paused,
--   and whether its owner asked to close it. Staff and employees read their own company's row; nobody in a company
--   can change it. Only the operator's functions write it (security definer, checked).
-- - Operators (the people running the service) are listed in private.platform_admins, which the API can't reach. Add
--   one by hand in the SQL editor: insert into private.platform_admins (user_id) values ('<auth user id>');
-- - The operator console lists companies with counts only. To help a company, an operator opens its working records
--   with a reason (platform_support_view, below); every look is logged and shown to the company's owners and admins.
--   Never shown: injury details, signature or photo images. Every operator action is written to private.platform_audit,
--   which outlives a purge.
-- - Paused = read-only. A paused company can still open, read and download everything (its OSHA records must stay
--   reachable), but nothing new can be saved or uploaded. Enforced by a trigger on every table that holds company data
--   and a restrictive storage policy. Switching access off (revoking links, removing people's access) still works.
-- - Export: owners and admins download every row their company has, table by table, through export_company_rows()
--   (secrets such as share-link hashes are left out).
-- - Closing: an owner asks to close; after 30 days an operator can purge, typing the company's exact name. Purge
--   deletes the company's rows (cascade); scripts/ops/purge-company.ts (service key, on the operator's computer)
--   removes the rows and then the company's files.
-- - Trial length is the operator's setting (private.platform_settings.trial_days); empty = trials don't end.

-- Operators, settings and the audit log (private schema: not reachable through the API) ------------------------------
create table private.platform_admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table private.platform_settings (
  id          boolean primary key default true check (id),
  trial_days  int check (trial_days between 1 and 365)
);
insert into private.platform_settings (id) values (true);

create table private.platform_audit (
  id            bigint generated always as identity primary key,
  at            timestamptz not null default now(),
  actor         uuid,
  action        text not null,
  company_id    uuid,            -- no foreign key: the log outlives a purged company
  company_name  text not null default '',
  detail        jsonb not null default '{}'::jsonb
);

create or replace function private.is_platform_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from private.platform_admins a where a.user_id = auth.uid());
$$;
revoke all on function private.is_platform_admin() from public, anon;
grant execute on function private.is_platform_admin() to authenticated;

create or replace function private.platform_log(act text, co uuid, detail jsonb default '{}'::jsonb)
returns void language sql security definer set search_path = '' as $$
  insert into private.platform_audit (actor, action, company_id, company_name, detail)
  values (auth.uid(), act, co, coalesce((select name from public.companies where id = co), ''), coalesce(detail, '{}'::jsonb));
$$;
revoke all on function private.platform_log(text, uuid, jsonb) from public, anon, authenticated;

-- Accounts -----------------------------------------------------------------------------------------------------------
create table public.company_accounts (
  company_id            uuid primary key references public.companies (id) on delete cascade,
  plan                  text not null default 'trial' check (plan in ('trial', 'pilot', 'paid', 'comp')),
  trial_ends_at         date,
  paused_at             timestamptz,
  pause_reason          text not null default '' check (char_length(pause_reason) <= 300),
  closure_requested_at  timestamptz,
  closure_requested_by  uuid references auth.users (id),
  updated_at            timestamptz not null default now()
);
alter table public.company_accounts enable row level security;
create policy "staff read their account" on public.company_accounts for select to authenticated using (private.is_member(company_id));
create policy "employees read their account" on public.company_accounts for select to authenticated using (private.is_employee(company_id));
revoke all on public.company_accounts from anon, authenticated;
grant select on public.company_accounts to authenticated;   -- written only by the functions below

-- Every company gets an account: existing ones now, new ones as they're created.
insert into public.company_accounts (company_id) select id from public.companies on conflict do nothing;

create or replace function private.open_account()
returns trigger language plpgsql security definer set search_path = '' as $$
declare days int := (select trial_days from private.platform_settings);
begin
  insert into public.company_accounts (company_id, trial_ends_at)
  values (new.id, case when days is null then null else current_date + days end)
  on conflict do nothing;
  return new;
end;
$$;
create trigger open_account after insert on public.companies for each row execute function private.open_account();

-- Paused = read-only: no insert or update on any table holding company data. Deletes stay possible (a purge cascades).
-- Two kinds of write stay allowed while paused, because read-only must never mean less safe or less reachable:
-- * logging that someone opened a shared profile or partner report (that is a read: the link keeps working);
-- * switching access off: revoking a share link, removing a trainer or partner, deactivating a person, changing or
--   withdrawing someone's access. An update that changes only those "off switch" columns goes through.
create or replace function private.block_when_paused()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  co uuid := coalesce((to_jsonb(new)->>'company_id')::uuid, case when tg_table_name = 'companies' then (to_jsonb(new)->>'id')::uuid end);
  off_switches text[] := array['revoked_at', 'revoked_by', 'removed_at', 'removed_by', 'active', 'deactivated_at', 'access', 'withdrawn_at', 'withdrawn_by', 'withdrawn_reason', 'updated_at'];
begin
  if tg_table_name in ('profile_share_views', 'partner_report_views') then return new; end if;
  if tg_op = 'UPDATE' and not exists (
    select 1 from jsonb_each(to_jsonb(new)) n where n.value is distinct from to_jsonb(old)->n.key and not (n.key = any (off_switches))
  ) then return new; end if;
  if co is not null and exists (select 1 from public.company_accounts a where a.company_id = co and a.paused_at is not null) then
    raise exception 'This company''s account is paused. Everything can still be viewed and downloaded, but nothing new can be saved until it''s resumed.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in
    select c.table_name from information_schema.columns c
    join information_schema.tables tb on tb.table_schema = c.table_schema and tb.table_name = c.table_name and tb.table_type = 'BASE TABLE'
    where c.table_schema = 'public' and c.column_name = 'company_id' and c.table_name <> 'company_accounts'
  loop
    execute format('create trigger block_when_paused before insert or update on public.%I for each row execute function private.block_when_paused()', t);
  end loop;
end;
$$;
create trigger block_when_paused before update on public.companies for each row execute function private.block_when_paused();

-- Files too: a paused company can't upload into its folders (restrictive: applies on top of every upload policy).
create or replace function private.company_paused(co uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select a.paused_at is not null from public.company_accounts a where a.company_id = co), false);
$$;
revoke all on function private.company_paused(uuid) from public, anon;
grant execute on function private.company_paused(uuid) to authenticated;
create policy "paused companies upload nothing" on storage.objects as restrictive for insert to authenticated
  with check (not private.company_paused(private.file_company(name)));


-- The plan guards (cadence, repeats, talk lists, week swaps) protect weeks already planned. When the company itself is
-- being removed (purge cascade), its rows go too: same rule as private.keep_an_owner. Otherwise unchanged.
CREATE OR REPLACE FUNCTION private.guard_cadence()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare wk date := coalesce(new.from_week, old.from_week);
begin
  if tg_op = 'DELETE' and not exists (select 1 from public.companies c where c.id = old.company_id) then return old; end if;
  if wk <= current_date or (tg_op = 'UPDATE' and old.from_week <= current_date) then
    raise exception 'A new cadence has to start after today (%), so talk periods already planned keep their shape.', wk using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$function$;
CREATE OR REPLACE FUNCTION private.guard_repeat()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare wk date := coalesce(new.from_week, old.from_week);
begin
  if tg_op = 'DELETE' and not exists (select 1 from public.companies c where c.id = old.company_id) then return old; end if;
  if wk <= current_date or (tg_op = 'UPDATE' and old.from_week <= current_date) then
    raise exception 'A repeat has to start after today (%), so weeks already planned keep their talks.', wk using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$function$;
CREATE OR REPLACE FUNCTION private.guard_talk_list()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare wk date := coalesce(new.from_week, old.from_week);
begin
  if tg_op = 'DELETE' and not exists (select 1 from public.companies c where c.id = old.company_id) then return old; end if;
  if wk <= current_date then
    raise exception 'A talk list has to start next week or later (%), so weeks already planned keep their talks.', wk using errcode = 'P0001';
  end if;
  if tg_op = 'UPDATE' and old.from_week <> new.from_week and old.from_week <= current_date then
    raise exception 'A talk list that has started can''t be moved.' using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$function$;
CREATE OR REPLACE FUNCTION private.guard_plan_override()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare wk date := coalesce(new.week_start, old.week_start);
        co uuid := coalesce(new.company_id, old.company_id);
begin
  if tg_op = 'DELETE' and not exists (select 1 from public.companies c where c.id = old.company_id) then return old; end if;
  if wk + 7 * private.period_weeks(co, wk) <= current_date then
    raise exception 'The talk period starting % is over; its talk can no longer change.', wk using errcode = 'P0001';
  end if;
  if exists (select 1 from public.talk_records r where r.company_id = co and r.week_start = wk and r.makeup_for_week is null) then
    raise exception 'The talk period starting % has already been recorded; its talk is locked.', wk using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$function$;

-- Operator console ---------------------------------------------------------------------------------------------------
create or replace function private.require_platform_admin()
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_platform_admin() then
    raise exception 'Only the people running this service can do that.' using errcode = '42501';
  end if;
end;
$$;
revoke all on function private.require_platform_admin() from public, anon;
grant execute on function private.require_platform_admin() to authenticated;

create or replace function public.am_platform_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select private.is_platform_admin();
$$;
revoke all on function public.am_platform_admin() from public, anon;
grant execute on function public.am_platform_admin() to authenticated;

-- Every company with counts only: no names of people, no records, no signatures, no injuries.
create or replace function public.platform_companies()
returns table (
  id uuid, name text, industry text, created_at timestamptz, plan text, trial_ends_at date, paused_at timestamptz, pause_reason text,
  closure_requested_at timestamptz, members int, people_active int, talks_total int, talks_30d int, last_talk_at timestamptz, inspections_total int
) language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  return query
  select c.id, c.name, c.industry, c.created_at, a.plan, a.trial_ends_at, a.paused_at, a.pause_reason, a.closure_requested_at,
    (select count(*)::int from public.company_members m where m.company_id = c.id),
    (select count(*)::int from public.people p where p.company_id = c.id and p.active),
    (select count(*)::int from public.talk_records r where r.company_id = c.id),
    (select count(*)::int from public.talk_records r where r.company_id = c.id and r.held_at > now() - interval '30 days'),
    (select max(r.held_at) from public.talk_records r where r.company_id = c.id),
    (select count(*)::int from public.inspections i where i.company_id = c.id)
  from public.companies c join public.company_accounts a on a.company_id = c.id
  order by c.created_at desc;
end;
$$;
revoke all on function public.platform_companies() from public, anon;
grant execute on function public.platform_companies() to authenticated;

create or replace function public.platform_set_plan(co uuid, new_plan text, trial_end date)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  if new_plan not in ('trial', 'pilot', 'paid', 'comp') then raise exception 'Unknown plan.' using errcode = '22023'; end if;
  update public.company_accounts set plan = new_plan, trial_ends_at = case when new_plan = 'trial' then trial_end end, updated_at = now()
  where company_id = co;
  if not found then raise exception 'No such company.' using errcode = 'P0002'; end if;
  perform private.platform_log('set_plan', co, jsonb_build_object('plan', new_plan, 'trial_ends_at', trial_end));
end;
$$;

create or replace function public.platform_pause(co uuid, reason text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  if char_length(btrim(coalesce(reason, ''))) = 0 then raise exception 'Say why the account is paused.' using errcode = '22023'; end if;
  update public.company_accounts set paused_at = now(), pause_reason = left(btrim(reason), 300), updated_at = now() where company_id = co;
  if not found then raise exception 'No such company.' using errcode = 'P0002'; end if;
  perform private.platform_log('pause', co, jsonb_build_object('reason', btrim(reason)));
end;
$$;

create or replace function public.platform_resume(co uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  update public.company_accounts set paused_at = null, pause_reason = '', updated_at = now() where company_id = co;
  if not found then raise exception 'No such company.' using errcode = 'P0002'; end if;
  perform private.platform_log('resume', co);
end;
$$;

create or replace function public.platform_settings()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  return (select jsonb_build_object('trial_days', trial_days) from private.platform_settings);
end;
$$;

create or replace function public.platform_set_trial_days(days int)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  update private.platform_settings set trial_days = days;
  perform private.platform_log('set_trial_days', null, jsonb_build_object('trial_days', days));
end;
$$;

create or replace function public.platform_audit(max_rows int default 200)
returns table (at timestamptz, action text, company_id uuid, company_name text, detail jsonb) language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  return query select l.at, l.action, l.company_id, l.company_name, l.detail from private.platform_audit l order by l.at desc limit least(greatest(max_rows, 1), 1000);
end;
$$;

-- A call made with the service key from the operator's own computer (scripts/ops/purge-company.ts). The key never
-- reaches a browser or phone; its role comes from the signed token, which nobody can forge without the project secret.
create or replace function private.is_service_call()
returns boolean language sql stable set search_path = '' as $$
  -- Always true or false, never null: a null here would slip past an "if not (...)" check.
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role' = 'service_role', false);
$$;

-- Purge: only after the owner asked to close at least 30 days ago, and only with the company's exact name typed.
-- From the console (an operator) or scripts/ops/purge-company.ts (service key), which then removes the files.
create or replace function public.platform_purge_company(co uuid, confirm_name text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare c public.companies; a public.company_accounts;
begin
  if not (private.is_platform_admin() or private.is_service_call()) then
    raise exception 'Only the people running this service can do that.' using errcode = '42501';
  end if;
  select * into c from public.companies where id = co;
  select * into a from public.company_accounts where company_id = co;
  if c.id is null then raise exception 'No such company.' using errcode = 'P0002'; end if;
  if a.closure_requested_at is null or a.closure_requested_at > now() - interval '30 days' then
    raise exception 'A company can be removed only 30 days after its owner asked to close it.' using errcode = '42501';
  end if;
  if confirm_name is distinct from c.name then raise exception 'Type the company''s name exactly to remove it.' using errcode = '22023'; end if;
  perform private.platform_log('purge', co, jsonb_build_object('company_id', co, 'closure_requested_at', a.closure_requested_at, 'by', case when private.is_service_call() then 'service key' else 'console' end));
  delete from public.companies where id = co;
  return co;
end;
$$;

revoke all on function public.platform_set_plan(uuid, text, date), public.platform_pause(uuid, text), public.platform_resume(uuid),
  public.platform_settings(), public.platform_set_trial_days(int), public.platform_audit(int), public.platform_purge_company(uuid, text) from public, anon;
grant execute on function public.platform_set_plan(uuid, text, date), public.platform_pause(uuid, text), public.platform_resume(uuid),
  public.platform_settings(), public.platform_set_trial_days(int), public.platform_audit(int), public.platform_purge_company(uuid, text) to authenticated;

-- Closing, asked by the company's owner ------------------------------------------------------------------------------
create or replace function public.request_company_closure(co uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_owner(co) then raise exception 'Only an owner can close the company''s account.' using errcode = '42501'; end if;
  update public.company_accounts set closure_requested_at = coalesce(closure_requested_at, now()), closure_requested_by = coalesce(closure_requested_by, auth.uid()), updated_at = now()
  where company_id = co;
  perform private.platform_log('closure_requested', co);
end;
$$;

create or replace function public.cancel_company_closure(co uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_owner(co) then raise exception 'Only an owner can change this.' using errcode = '42501'; end if;
  update public.company_accounts set closure_requested_at = null, closure_requested_by = null, updated_at = now() where company_id = co;
  perform private.platform_log('closure_canceled', co);
end;
$$;
revoke all on function public.request_company_closure(uuid), public.cancel_company_closure(uuid) from public, anon;
grant execute on function public.request_company_closure(uuid), public.cancel_company_closure(uuid) to authenticated;

-- Export: every row the company has, table by table, for its owners and admins -----------------------------------------
-- The table list comes from the database itself (every table with company_id), so a new table is never left out.
create or replace function public.export_company_tables(co uuid)
returns text[] language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_admin(co) then raise exception 'Only owners and admins can download the company''s data.' using errcode = '42501'; end if;
  return array['companies'] || array(
    select c.table_name::text from information_schema.columns c
    join information_schema.tables tb on tb.table_schema = c.table_schema and tb.table_name = c.table_name and tb.table_type = 'BASE TABLE'
    where c.table_schema = 'public' and c.column_name = 'company_id' order by c.table_name);
end;
$$;

-- One page (up to 1000 rows) of one table. Secret columns (share-link hashes) are left out.
create or replace function public.export_company_rows(co uuid, tbl text, page int default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare rows jsonb; secret text[] := array['token_hash']; keycols text;
begin
  if not private.is_admin(co) then raise exception 'Only owners and admins can download the company''s data.' using errcode = '42501'; end if;
  if not (tbl = any (public.export_company_tables(co))) then raise exception 'Not a company table.' using errcode = '22023'; end if;
  -- Pages in primary-key order, so a page boundary never skips or repeats a row.
  select string_agg(format('x.%I', a.attname), ', ' order by array_position(i.indkey::int2[], a.attnum)) into keycols
  from pg_index i join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any (i.indkey)
  where i.indrelid = format('public.%I', tbl)::regclass and i.indisprimary;
  execute format(
    'select coalesce(jsonb_agg(to_jsonb(t) - $2), ''[]''::jsonb) from (select * from public.%I x where %s = $1 order by %s limit 1000 offset $3) t',
    tbl, case when tbl = 'companies' then 'id' else 'company_id' end, coalesce(keycols, 'to_jsonb(x)::text'))
  into rows using co, secret, greatest(page, 0) * 1000;
  return rows;
end;
$$;
revoke all on function public.export_company_tables(uuid), public.export_company_rows(uuid, text, int) from public, anon;
grant execute on function public.export_company_tables(uuid), public.export_company_rows(uuid, text, int) to authenticated;

-- Support access (Joe, 2026-10-11: full support access, every look logged) -------------------------------------------
-- An operator opens a company's working records to help them, giving a reason each time. Every look is written to
-- the audit log, and the company's owners and admins see each one (when and why) under Admin -> Company.
-- What support sees: setup, people and teams, the latest talks with who signed, issues, inspections, safety log and
-- training cards. Never: the injury log's details (counts per year only) or incident titles (they can name someone),
-- signature or photo images, home addresses, phone numbers, or employee IDs. Read-only: support can't change anything.
create or replace function public.platform_support_view(co uuid, reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare c public.companies;
begin
  perform private.require_platform_admin();
  if char_length(btrim(coalesce(reason, ''))) < 5 then raise exception 'Say why you''re looking (what the company asked for help with).' using errcode = '22023'; end if;
  select * into c from public.companies where id = co;
  if c.id is null then raise exception 'No such company.' using errcode = 'P0002'; end if;
  perform private.platform_log('support_view', co, jsonb_build_object('reason', left(btrim(reason), 300)));
  return jsonb_build_object(
    'company', jsonb_build_object('name', c.name, 'industry', c.industry, 'work_setting', c.work_setting, 'program_start', c.program_start,
      'makeup_weeks', c.makeup_weeks, 'daily_enabled', c.daily_enabled, 'created_at', c.created_at),
    'account', (select to_jsonb(a) - 'company_id' - 'closure_requested_by' from public.company_accounts a where a.company_id = co),
    'members', coalesce((select jsonb_agg(jsonb_build_object('email', m.email, 'access', m.access, 'since', m.created_at) order by m.created_at)
      from public.company_members m where m.company_id = co), '[]'),
    'teams', coalesce((select jsonb_agg(jsonb_build_object('name', t.name) order by t.name) from public.teams t where t.company_id = co), '[]'),
    'people', coalesce((select jsonb_agg(jsonb_build_object('name', p.full_name, 'job_title', r.name, 'team', t.name, 'active', p.active,
        'language', p.preferred_language, 'has_account', p.user_id is not null) order by p.full_name)
      from public.people p left join public.roles r on r.id = p.role_id left join public.teams t on t.id = p.team_id where p.company_id = co), '[]'),
    'jobsites', coalesce((select jsonb_agg(jsonb_build_object('name', j.name, 'active', j.active) order by j.name) from public.jobsites j where j.company_id = co), '[]'),
    'talks', coalesce((select jsonb_agg(x order by x->>'held_at' desc) from (
      select jsonb_build_object('held_at', r.held_at, 'kind', r.record_kind, 'title', coalesce(r.content->'en'->>'title', r.content->>'title'),
        'team', r.team_name, 'presenter', r.presenter_name, 'week_start', r.week_start, 'makeup_for_week', r.makeup_for_week, 'jobsite', r.jobsite_name,
        'attendees', coalesce((select jsonb_agg(jsonb_build_object('name', a.name, 'status', a.status) order by a.position) from public.talk_attendees a where a.record_id = r.id), '[]')) x
      from public.talk_records r where r.company_id = co order by r.held_at desc limit 100) s), '[]'),
    'issues', coalesce((select jsonb_agg(x order by x->>'raised_at' desc) from (
      select jsonb_build_object('description', i.description, 'status', i.status, 'owner', i.owner_name, 'due', i.due_date, 'raised_at', i.raised_at, 'fixed_at', i.fixed_at) x
      from public.talk_issues i where i.company_id = co order by i.raised_at desc limit 100) s), '[]'),
    'inspections', coalesce((select jsonb_agg(x order by x->>'inspected_at' desc) from (
      select jsonb_build_object('title', i.title, 'subject', i.subject, 'inspector', i.inspector_name, 'inspected_at', i.inspected_at,
        'items', jsonb_array_length(i.items), 'failed', i.failed_count, 'jobsite', i.jobsite_name) x
      from public.inspections i where i.company_id = co order by i.inspected_at desc limit 100) s), '[]'),
    'safety_log', coalesce((select jsonb_agg(x order by x->>'occurred_on' desc) from (
      -- Incidents can name an injured person: kind, date and status only.
      select jsonb_build_object('kind', e.kind, 'title', case when e.kind = 'incident' then '' else e.title end, 'occurred_on', e.occurred_on, 'status', e.status) x
      from public.safety_events e where e.company_id = co order by e.occurred_on desc limit 100) s), '[]'),
    'training_cards', coalesce((select jsonb_agg(jsonb_build_object('person', p.full_name, 'card', coalesce(nullif(pc.custom_name, ''), pc.cert_type), 'expires_on', pc.expires_on) order by p.full_name)
      from public.person_certs pc join public.people p on p.id = pc.person_id where pc.company_id = co and pc.withdrawn_at is null), '[]'),
    'injury_log_counts', coalesce((select jsonb_object_agg(y.year::text, y.n) from (
      select year, count(distinct case_key)::int as n from public.injury_cases where company_id = co group by year) y), '{}')
  );
end;
$$;
revoke all on function public.platform_support_view(uuid, text) from public, anon;
grant execute on function public.platform_support_view(uuid, text) to authenticated;

-- What the company sees: each time support looked at its account, when and why. Owners and admins only.
create or replace function public.support_access_log(co uuid)
returns table (at timestamptz, reason text) language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_admin(co) then raise exception 'Only owners and admins can see this.' using errcode = '42501'; end if;
  return query select l.at, coalesce(l.detail->>'reason', '') from private.platform_audit l
    where l.company_id = co and l.action = 'support_view' order by l.at desc limit 200;
end;
$$;
revoke all on function public.support_access_log(uuid) from public, anon;
grant execute on function public.support_access_log(uuid) to authenticated;

-- The service role (Supabase's built-in role for the service key) may run the purge from scripts/ops/purge-company.ts.
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.platform_purge_company(uuid, text) to service_role;
  end if;
end $$;
