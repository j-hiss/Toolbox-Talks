-- Insurance partner portal (PILOT: needs counsel's privacy review before real use; the app hides it unless
-- NEXT_PUBLIC_PARTNER_PORTAL=pilot). A company invites its agent, broker or carrier, then sends them a frozen copy of
-- its safety summary (counts and rates only, built by shareSnapshot in src/core/share.ts). Additive.
--
-- - A partner is not a company member: no records, people, names, signatures or injury details. They see the company's
--   name and the summaries the company chose to send, nothing else.
-- - Partners join by invite, claimed on sign-in with an email code (accept_invites, extended again here).
-- - Sent summaries are append-only. The company can withdraw one (the partner stops seeing it; it stays on file) or
--   remove the partner (all access ends at once).
-- - Every time a partner opens a summary is logged; the company sees who opened what and when.

create table public.company_partners (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies (id) on delete cascade,
  email        text not null check (email = lower(btrim(email)) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  name         text not null check (char_length(btrim(name)) between 1 and 120),
  kind         text not null check (kind in ('agent', 'broker', 'carrier', 'other')),
  user_id      uuid references auth.users (id),
  invited_by   uuid references auth.users (id),
  invited_at   timestamptz not null default now(),
  accepted_at  timestamptz,
  removed_at   timestamptz,
  removed_by   uuid references auth.users (id),
  unique (company_id, id)
);
create unique index company_partners_one_live_invite on public.company_partners (company_id, email) where removed_at is null;
create index company_partners_user_idx on public.company_partners (user_id) where removed_at is null;
alter table public.company_partners enable row level security;
create policy "admins read partners" on public.company_partners for select to authenticated using (private.is_admin(company_id));
create policy "partners read their own link" on public.company_partners for select to authenticated using (user_id = auth.uid() and removed_at is null);
revoke all on public.company_partners from anon, authenticated;
grant select on public.company_partners to authenticated;

create table public.partner_reports (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null,
  partner_id    uuid not null,
  snapshot      jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  period_from   date not null,
  period_to     date not null check (period_to >= period_from),
  sent_by       uuid references auth.users (id),
  sent_at       timestamptz not null default now(),
  withdrawn_at  timestamptz,
  withdrawn_by  uuid references auth.users (id),
  foreign key (company_id, partner_id) references public.company_partners (company_id, id)
);
create index partner_reports_idx on public.partner_reports (company_id, partner_id, sent_at desc);
alter table public.partner_reports enable row level security;
create policy "admins read partner reports" on public.partner_reports for select to authenticated using (private.is_admin(company_id));
revoke all on public.partner_reports from anon, authenticated;
-- Admins list without the copy; partners read only through partner_report() so every open is logged.
grant select (id, company_id, partner_id, period_from, period_to, sent_by, sent_at, withdrawn_at, withdrawn_by) on public.partner_reports to authenticated;

create table public.partner_report_views (
  id          bigint generated always as identity primary key,
  report_id   uuid not null references public.partner_reports (id) on delete cascade,
  company_id  uuid not null references public.companies (id) on delete cascade,
  partner_id  uuid not null,
  by_user     uuid references auth.users (id),
  viewed_at   timestamptz not null default now()
);
create index partner_report_views_idx on public.partner_report_views (company_id, report_id, viewed_at desc);
alter table public.partner_report_views enable row level security;
create policy "admins read partner views" on public.partner_report_views for select to authenticated using (private.is_admin(company_id));
revoke all on public.partner_report_views from anon, authenticated;
grant select on public.partner_report_views to authenticated;

create or replace function private.my_partner_id(co uuid)
returns uuid language sql stable security definer set search_path = '' as $$
  select p.id from public.company_partners p where p.company_id = co and p.user_id = auth.uid() and p.removed_at is null limit 1;
$$;
revoke execute on function private.my_partner_id(uuid) from public, anon;
grant execute on function private.my_partner_id(uuid) to authenticated;

-- Company side -------------------------------------------------------------------------------------------------------
create or replace function public.invite_partner(co uuid, email text, name text, kind text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  if not private.is_admin(co) then raise exception 'Only owners and admins can invite an insurance partner.' using errcode = '42501'; end if;
  insert into public.company_partners (company_id, email, name, kind, invited_by)
  values (co, lower(btrim(email)), btrim(name), kind, auth.uid()) returning id into new_id;
  return new_id;
exception when unique_violation then
  raise exception 'That partner is already invited.' using errcode = '23505';
end;
$$;

create or replace function public.remove_partner(partner uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare co uuid;
begin
  select company_id into co from public.company_partners where id = partner;
  if co is null or not private.is_admin(co) then raise exception 'Partner not found.' using errcode = '42501'; end if;
  update public.company_partners set removed_at = now(), removed_by = auth.uid() where id = partner and removed_at is null;
end;
$$;

create or replace function public.send_partner_report(partner uuid, period_from date, period_to date, snapshot jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare co uuid; new_id uuid;
begin
  select company_id into co from public.company_partners where id = partner and removed_at is null;
  if co is null or not private.is_admin(co) then raise exception 'Partner not found.' using errcode = '42501'; end if;
  if jsonb_typeof(snapshot) is distinct from 'object' or pg_column_size(snapshot) > 262144 then
    raise exception 'The summary is missing or too large.' using errcode = '22023';
  end if;
  insert into public.partner_reports (company_id, partner_id, snapshot, period_from, period_to, sent_by)
  values (co, partner, snapshot, period_from, period_to, auth.uid()) returning id into new_id;
  return new_id;
end;
$$;

create or replace function public.withdraw_partner_report(report uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare co uuid;
begin
  select company_id into co from public.partner_reports where id = report;
  if co is null or not private.is_admin(co) then raise exception 'Summary not found.' using errcode = '42501'; end if;
  update public.partner_reports set withdrawn_at = now(), withdrawn_by = auth.uid() where id = report and withdrawn_at is null;
end;
$$;
revoke all on function public.invite_partner(uuid, text, text, text), public.remove_partner(uuid),
  public.send_partner_report(uuid, date, date, jsonb), public.withdraw_partner_report(uuid) from public, anon;
grant execute on function public.invite_partner(uuid, text, text, text), public.remove_partner(uuid),
  public.send_partner_report(uuid, date, date, jsonb), public.withdraw_partner_report(uuid) to authenticated;

-- Partner side -------------------------------------------------------------------------------------------------------
-- The summaries sent to this partner (not withdrawn), newest first. No copy here; opening one is partner_report().
create or replace function public.partner_inbox()
returns table (report_id uuid, company_id uuid, company_name text, partner_name text, period_from date, period_to date, sent_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select r.id, c.id, c.name, p.name, r.period_from, r.period_to, r.sent_at
  from public.company_partners p
  join public.companies c on c.id = p.company_id
  join public.partner_reports r on r.partner_id = p.id and r.company_id = p.company_id and r.withdrawn_at is null
  where p.user_id = auth.uid() and p.removed_at is null
  order by r.sent_at desc;
$$;

-- Open one summary. Logs the open. Null when it isn't this partner's or was withdrawn.
create or replace function public.partner_report(report uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.partner_reports;
begin
  select * into r from public.partner_reports where id = report and withdrawn_at is null;
  if r.id is null or r.partner_id is distinct from private.my_partner_id(r.company_id) then return null; end if;
  insert into public.partner_report_views (report_id, company_id, partner_id, by_user) values (r.id, r.company_id, r.partner_id, auth.uid());
  return jsonb_build_object('id', r.id, 'period_from', r.period_from, 'period_to', r.period_to, 'sent_at', r.sent_at, 'snapshot', r.snapshot);
end;
$$;
revoke all on function public.partner_inbox(), public.partner_report(uuid) from public, anon;
grant execute on function public.partner_inbox(), public.partner_report(uuid) to authenticated;

-- Invites: staff (0022/0024), trainers (0026) and now partners. Email-code accounts only.
create or replace function public.accept_invites()
returns int language plpgsql security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  addr text;
  inv record;
  n int := 0;
  t int := 0;
  p int := 0;
  rank constant text[] := array['employee', 'office', 'presenter', 'admin', 'owner'];
begin
  if me is null then return 0; end if;
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
  update public.company_trainers set user_id = me, accepted_at = now()
  where email = addr and user_id is null and removed_at is null;
  get diagnostics t = row_count;
  update public.company_partners set user_id = me, accepted_at = now()
  where email = addr and user_id is null and removed_at is null;
  get diagnostics p = row_count;
  return n + t + p;
end;
$$;
