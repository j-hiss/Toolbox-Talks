-- Trainers and insurance partners with many clients: one screen of all their clients, a link that brings new clients
-- in, and partner organizations (an agency or training company whose staff share one client list). Additive: five
-- tables, new functions, and the trainer and partner access checks widened to include organization staff.
--
-- Privacy stays the company's choice:
-- - A partner organization sees only the companies whose link a member put in the organization. The company sees the
--   organization's name and every member on its partner or trainer list, every open is logged by person as before,
--   and removing the partner or trainer still ends access for all of them at once.
-- - A client list shows the figures from summaries the company already sent (counts and rates only) and, for
--   trainers, card counts. Nothing live, no names beyond what the company already shared.
-- - A referral link records which partner brought a company in. It shares nothing: the company still invites the
--   partner itself if it wants to.
-- - A partner can ask a company for a fresh summary (at most once a week per company); the company sees the request
--   and decides.

-- Organizations ------------------------------------------------------------------------------------------------------
create table public.partner_orgs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 1 and 120),
  kind        text not null check (kind in ('insurance', 'training')),
  created_by  uuid references auth.users (id),
  created_at  timestamptz not null default now()
);
create table public.partner_org_members (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.partner_orgs (id) on delete cascade,
  email        text not null check (email = lower(btrim(email)) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  role         text not null default 'member' check (role in ('admin', 'member')),
  user_id      uuid references auth.users (id),
  invited_by   uuid references auth.users (id),
  invited_at   timestamptz not null default now(),
  accepted_at  timestamptz,
  removed_at   timestamptz,
  removed_by   uuid references auth.users (id)
);
create unique index partner_org_members_one_live on public.partner_org_members (org_id, email) where removed_at is null;
create index partner_org_members_user_idx on public.partner_org_members (user_id) where removed_at is null;

create or replace function private.in_partner_org(org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select org is not null and exists (select 1 from public.partner_org_members m where m.org_id = org and m.user_id = auth.uid() and m.removed_at is null);
$$;
create or replace function private.partner_org_admin(org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.partner_org_members m where m.org_id = org and m.user_id = auth.uid() and m.removed_at is null and m.role = 'admin');
$$;
revoke all on function private.in_partner_org(uuid), private.partner_org_admin(uuid) from public, anon;
grant execute on function private.in_partner_org(uuid), private.partner_org_admin(uuid) to authenticated;

alter table public.partner_orgs enable row level security;
alter table public.partner_org_members enable row level security;
create policy "members read their organization" on public.partner_orgs for select to authenticated using (private.in_partner_org(id));
create policy "members read fellow members" on public.partner_org_members for select to authenticated using (private.in_partner_org(org_id));
revoke all on public.partner_orgs, public.partner_org_members from anon, authenticated;
grant select on public.partner_orgs, public.partner_org_members to authenticated;   -- written only by the functions below

-- Links can belong to an organization (set by the partner who holds the link).
alter table public.company_trainers add column org_id uuid references public.partner_orgs (id);
alter table public.company_partners add column org_id uuid references public.partner_orgs (id);
create policy "organization staff read the organization's links" on public.company_trainers for select to authenticated using (removed_at is null and private.in_partner_org(org_id));
create policy "organization staff read the organization's links" on public.company_partners for select to authenticated using (removed_at is null and private.in_partner_org(org_id));

-- Companies see the organization behind a link and who is in it (names are emails; that's who can see their data).
create or replace function public.link_org_members(co uuid)
returns table (org_id uuid, org_name text, email text, role text, accepted boolean)
language sql stable security definer set search_path = '' as $$
  select o.id, o.name, m.email, m.role, m.accepted_at is not null
  from public.partner_orgs o join public.partner_org_members m on m.org_id = o.id and m.removed_at is null
  where private.is_admin(co) and o.id in (
    select t.org_id from public.company_trainers t where t.company_id = co and t.removed_at is null
    union select p.org_id from public.company_partners p where p.company_id = co and p.removed_at is null)
  order by o.name, m.role, m.email;
$$;

create or replace function public.create_partner_org(name text, kind text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); addr text; new_id uuid;
begin
  select lower(u.email) into addr from auth.users u where u.id = me and u.email_confirmed_at is not null;
  if addr is null then raise exception 'Sign in with your email first.' using errcode = '42501'; end if;
  if (select count(*) from public.partner_org_members m where m.user_id = me and m.removed_at is null and m.role = 'admin') >= 5 then
    raise exception 'You can run up to 5 organizations.' using errcode = '54000';
  end if;
  insert into public.partner_orgs (name, kind, created_by) values (btrim(name), kind, me) returning id into new_id;
  insert into public.partner_org_members (org_id, email, role, user_id, invited_by, accepted_at) values (new_id, addr, 'admin', me, me, now());
  return new_id;
end;
$$;

create or replace function public.invite_org_member(org uuid, email text, admin boolean default false)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  if not private.partner_org_admin(org) then raise exception 'Only the organization''s admins can add people.' using errcode = '42501'; end if;
  if (select count(*) from public.partner_org_members m where m.org_id = org and m.removed_at is null) >= 200 then
    raise exception 'An organization can have up to 200 people.' using errcode = '54000';
  end if;
  insert into public.partner_org_members (org_id, email, role, invited_by)
  values (org, lower(btrim(email)), case when admin then 'admin' else 'member' end, auth.uid()) returning id into new_id;
  return new_id;
exception when unique_violation then
  raise exception 'That person is already in the organization.' using errcode = '23505';
end;
$$;

create or replace function public.remove_org_member(member uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare m public.partner_org_members;
begin
  select * into m from public.partner_org_members where id = member and removed_at is null;
  if m.id is null or not (private.partner_org_admin(m.org_id) or m.user_id = auth.uid()) then
    raise exception 'Person not found.' using errcode = '42501';
  end if;
  if m.role = 'admin' and (select count(*) from public.partner_org_members x where x.org_id = m.org_id and x.removed_at is null and x.role = 'admin') = 1 then
    raise exception 'An organization needs at least one admin. Add another admin first.' using errcode = '23514';
  end if;
  update public.partner_org_members set removed_at = now(), removed_by = auth.uid() where id = member;
end;
$$;

-- Joining: an invited person signs in with the invited email (email-code accounts, like every other invite).
create or replace function public.accept_partner_org_invites()
returns int language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); addr text; n int;
begin
  if me is null then return 0; end if;
  select lower(u.email) into addr from auth.users u
  where u.id = me and u.email_confirmed_at is not null and coalesce(u.encrypted_password, '') = '';
  if addr is null then return 0; end if;
  update public.partner_org_members set user_id = me, accepted_at = now() where email = addr and user_id is null and removed_at is null;
  get diagnostics n = row_count;
  return n;
end;
$$;

-- The partner who holds a link puts it in (or takes it out of) one of their organizations. kind: 'trainer' | 'partner'.
create or replace function public.set_link_org(kind text, link uuid, org uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if org is not null and not private.in_partner_org(org) then raise exception 'You''re not in that organization.' using errcode = '42501'; end if;
  if kind = 'trainer' then
    if org is not null and (select o.kind from public.partner_orgs o where o.id = org) <> 'training' then raise exception 'Use a training organization.' using errcode = '22023'; end if;
    update public.company_trainers set org_id = org where id = link and user_id = auth.uid() and removed_at is null;
  elsif kind = 'partner' then
    if org is not null and (select o.kind from public.partner_orgs o where o.id = org) <> 'insurance' then raise exception 'Use an insurance organization.' using errcode = '22023'; end if;
    update public.company_partners set org_id = org where id = link and user_id = auth.uid() and removed_at is null;
  else raise exception 'Unknown kind.' using errcode = '22023'; end if;
  if not found then raise exception 'Only the person the company invited can move this client.' using errcode = '42501'; end if;
end;
$$;

-- Access checks widened to organization staff -------------------------------------------------------------------------
create or replace function private.my_trainer_id(co uuid)
returns uuid language sql stable security definer set search_path = '' as $$
  select t.id from public.company_trainers t
  where t.company_id = co and t.removed_at is null and (t.user_id = auth.uid() or private.in_partner_org(t.org_id))
  order by (t.user_id = auth.uid()) desc limit 1;
$$;
create or replace function private.trainer_sees(co uuid, person uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.company_trainer_people tp
    join public.company_trainers t on t.id = tp.trainer_id and t.company_id = tp.company_id
    join public.people p on p.id = tp.person_id and p.company_id = tp.company_id
    where tp.company_id = co and tp.person_id = person and t.removed_at is null and p.deactivated_at is null
      and (t.user_id = auth.uid() or private.in_partner_org(t.org_id)));
$$;
create or replace function public.trainer_roster()
returns table (company_id uuid, company_name text, trainer_id uuid, person_id uuid, full_name text, job_title text)
language sql stable security definer set search_path = '' as $$
  select c.id, c.name, t.id, p.id, p.full_name, coalesce(r.name, '')
  from public.company_trainers t
  join public.companies c on c.id = t.company_id
  left join public.company_trainer_people tp on tp.trainer_id = t.id and tp.company_id = t.company_id
  left join public.people p on p.id = tp.person_id and p.company_id = tp.company_id and p.deactivated_at is null
  left join public.roles r on r.id = p.role_id and r.company_id = p.company_id
  where t.removed_at is null and (t.user_id = auth.uid() or private.in_partner_org(t.org_id))
  order by c.name, p.full_name;
$$;
create or replace function private.my_partner_id(co uuid)
returns uuid language sql stable security definer set search_path = '' as $$
  select p.id from public.company_partners p
  where p.company_id = co and p.removed_at is null and (p.user_id = auth.uid() or private.in_partner_org(p.org_id))
  order by (p.user_id = auth.uid()) desc limit 1;
$$;
create or replace function public.partner_inbox()
returns table (report_id uuid, company_id uuid, company_name text, partner_name text, period_from date, period_to date, sent_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select r.id, c.id, c.name, p.name, r.period_from, r.period_to, r.sent_at
  from public.company_partners p
  join public.companies c on c.id = p.company_id
  join public.partner_reports r on r.partner_id = p.id and r.company_id = p.company_id and r.withdrawn_at is null
  where p.removed_at is null and (p.user_id = auth.uid() or private.in_partner_org(p.org_id))
  order by r.sent_at desc;
$$;

-- Asking for a fresh summary ------------------------------------------------------------------------------------------
create table public.partner_summary_requests (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null,
  partner_id    uuid not null,
  note          text not null default '' check (char_length(note) <= 300),
  by_user       uuid references auth.users (id),
  requested_at  timestamptz not null default now(),
  foreign key (company_id, partner_id) references public.company_partners (company_id, id) on delete cascade
);
create index partner_summary_requests_idx on public.partner_summary_requests (company_id, requested_at desc);
alter table public.partner_summary_requests enable row level security;
create policy "admins read summary requests" on public.partner_summary_requests for select to authenticated using (private.is_admin(company_id));
revoke all on public.partner_summary_requests from anon, authenticated;
grant select on public.partner_summary_requests to authenticated;
create trigger block_when_paused before insert or update on public.partner_summary_requests for each row execute function private.block_when_paused();

create or replace function public.request_partner_summary(link uuid, note text default '')
returns void language plpgsql security definer set search_path = '' as $$
declare co uuid;
begin
  select company_id into co from public.company_partners where id = link and removed_at is null;
  if co is null or private.my_partner_id(co) is distinct from link then raise exception 'Client not found.' using errcode = '42501'; end if;
  if exists (select 1 from public.partner_summary_requests r where r.partner_id = link and r.requested_at > now() - interval '7 days') then
    raise exception 'You asked this client in the last 7 days. Give them a little time.' using errcode = '54000';
  end if;
  insert into public.partner_summary_requests (company_id, partner_id, note, by_user) values (co, link, left(btrim(coalesce(note, '')), 300), auth.uid());
end;
$$;

-- Client lists --------------------------------------------------------------------------------------------------------
-- Insurance: one row per client, with the figures from the latest summary the company sent (counts and rates only).
create or replace function public.partner_clients()
returns table (link_id uuid, company_id uuid, company_name text, org_id uuid, org_name text, mine boolean, reports int,
  latest_report uuid, period_from date, period_to date, sent_at timestamptz, crew int, sign_in numeric, on_time numeric,
  periods_ended int, periods_missed int, open_issues int, last_requested timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, c.id, c.name, o.id, o.name, p.user_id = auth.uid(),
    (select count(*)::int from public.partner_reports r where r.partner_id = p.id and r.withdrawn_at is null),
    l.id, l.period_from, l.period_to, l.sent_at,
    (l.snapshot->>'crew')::int, (l.snapshot->'profile'->>'signIn')::numeric, (l.snapshot->'profile'->>'onTime')::numeric,
    (l.snapshot->'profile'->>'periodsEnded')::int, (l.snapshot->'profile'->>'periodsMissed')::int,
    (l.snapshot->'profile'->'issues'->>'open')::int,
    (select max(q.requested_at) from public.partner_summary_requests q where q.partner_id = p.id)
  from public.company_partners p
  join public.companies c on c.id = p.company_id
  left join public.partner_orgs o on o.id = p.org_id
  left join lateral (select r.* from public.partner_reports r where r.partner_id = p.id and r.withdrawn_at is null order by r.sent_at desc limit 1) l on true
  where p.removed_at is null and (p.user_id = auth.uid() or private.in_partner_org(p.org_id))
  order by c.name;
$$;

-- Trainers: one row per client, with how many people they were given and how their cards stand.
create or replace function public.trainer_clients()
returns table (link_id uuid, company_id uuid, company_name text, org_id uuid, org_name text, mine boolean, people int,
  waiting int, approved int, declined int, last_sent timestamptz)
language sql stable security definer set search_path = '' as $$
  select t.id, c.id, c.name, o.id, o.name, t.user_id = auth.uid(),
    (select count(*)::int from public.company_trainer_people tp join public.people pe on pe.id = tp.person_id and pe.company_id = tp.company_id
       where tp.trainer_id = t.id and pe.deactivated_at is null),
    (select count(*)::int from public.cert_submissions s where s.trainer_id = t.id and s.status = 'pending'),
    (select count(*)::int from public.cert_submissions s where s.trainer_id = t.id and s.status = 'approved'),
    (select count(*)::int from public.cert_submissions s where s.trainer_id = t.id and s.status = 'declined'),
    (select max(s.submitted_at) from public.cert_submissions s where s.trainer_id = t.id)
  from public.company_trainers t
  join public.companies c on c.id = t.company_id
  left join public.partner_orgs o on o.id = t.org_id
  where t.removed_at is null and (t.user_id = auth.uid() or private.in_partner_org(t.org_id))
  order by c.name;
$$;

-- Referral links ------------------------------------------------------------------------------------------------------
create table public.partner_referral_codes (
  code        text primary key check (code ~ '^[a-z2-9]{10}$'),
  kind        text not null check (kind in ('insurance', 'training')),
  user_id     uuid not null references auth.users (id) on delete cascade,
  org_id      uuid references public.partner_orgs (id),
  name        text not null check (char_length(btrim(name)) between 1 and 120),
  created_at  timestamptz not null default now(),
  retired_at  timestamptz
);
alter table public.partner_referral_codes enable row level security;
create policy "partners read their own codes" on public.partner_referral_codes for select to authenticated using (user_id = auth.uid());
revoke all on public.partner_referral_codes from anon, authenticated;
grant select on public.partner_referral_codes to authenticated;

create table public.company_referrals (
  company_id   uuid primary key references public.companies (id) on delete cascade,
  code         text not null references public.partner_referral_codes (code),
  recorded_by  uuid references auth.users (id),
  recorded_at  timestamptz not null default now()
);
alter table public.company_referrals enable row level security;
create policy "admins read their referral" on public.company_referrals for select to authenticated using (private.is_admin(company_id));
revoke all on public.company_referrals from anon, authenticated;
grant select on public.company_referrals to authenticated;
create trigger block_when_paused before insert or update on public.company_referrals for each row execute function private.block_when_paused();

-- A partner's link code (one live code per kind and organization; asking again returns the same one).
create or replace function public.my_referral_code(kind text, name text, org uuid default null)
returns text language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); c text; alphabet constant text := 'abcdefghijkmnpqrstuvwxyz23456789'; i int;
begin
  if me is null then raise exception 'Sign in first.' using errcode = '42501'; end if;
  if kind not in ('insurance', 'training') then raise exception 'Unknown kind.' using errcode = '22023'; end if;
  if org is not null and not private.in_partner_org(org) then raise exception 'You''re not in that organization.' using errcode = '42501'; end if;
  select r.code into c from public.partner_referral_codes r
  where r.user_id = me and r.kind = my_referral_code.kind and r.org_id is not distinct from org and r.retired_at is null limit 1;
  if c is not null then return c; end if;
  loop
    c := '';
    for i in 1..10 loop c := c || substr(alphabet, 1 + floor(random() * 32)::int, 1); end loop;
    exit when not exists (select 1 from public.partner_referral_codes where code = c);
  end loop;
  insert into public.partner_referral_codes (code, kind, user_id, org_id, name) values (c, kind, me, org, btrim(name));
  return c;
end;
$$;

-- What a new company sees for a code: who sent it. Null for an unknown or retired code.
create or replace function public.referral_info(code text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('kind', r.kind, 'name', coalesce(o.name, r.name), 'person', r.name, 'email', lower(u.email))
  from public.partner_referral_codes r join auth.users u on u.id = r.user_id left join public.partner_orgs o on o.id = r.org_id
  where r.code = lower(btrim(referral_info.code)) and r.retired_at is null;
$$;

-- The company records which code brought it in (once). Shares nothing with the partner.
create or replace function public.record_referral(co uuid, code text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin(co) then raise exception 'Only owners and admins can do this.' using errcode = '42501'; end if;
  insert into public.company_referrals (company_id, code, recorded_by)
  select co, r.code, auth.uid() from public.partner_referral_codes r where r.code = lower(btrim(record_referral.code)) and r.retired_at is null
  on conflict (company_id) do nothing;
  return found;
end;
$$;

-- A partner's referral count: companies that signed up with their codes (names only once they connected).
create or replace function public.my_referrals()
returns table (code text, kind text, signed_up int, connected text[])
language sql stable security definer set search_path = '' as $$
  select r.code, r.kind,
    (select count(*)::int from public.company_referrals cr where cr.code = r.code),
    coalesce((select array_agg(distinct c.name order by c.name) from public.company_referrals cr join public.companies c on c.id = cr.company_id
      where cr.code = r.code and (
        exists (select 1 from public.company_partners p where p.company_id = c.id and p.removed_at is null and (p.user_id = auth.uid() or private.in_partner_org(p.org_id)))
        or exists (select 1 from public.company_trainers t where t.company_id = c.id and t.removed_at is null and (t.user_id = auth.uid() or private.in_partner_org(t.org_id))))), '{}')
  from public.partner_referral_codes r where r.user_id = auth.uid() and r.retired_at is null;
$$;

revoke all on function public.link_org_members(uuid), public.create_partner_org(text, text), public.invite_org_member(uuid, text, boolean),
  public.remove_org_member(uuid), public.accept_partner_org_invites(), public.set_link_org(text, uuid, uuid), public.request_partner_summary(uuid, text),
  public.partner_clients(), public.trainer_clients(), public.my_referral_code(text, text, uuid), public.referral_info(text),
  public.record_referral(uuid, text), public.my_referrals() from public, anon;
grant execute on function public.link_org_members(uuid), public.create_partner_org(text, text), public.invite_org_member(uuid, text, boolean),
  public.remove_org_member(uuid), public.accept_partner_org_invites(), public.set_link_org(text, uuid, uuid), public.request_partner_summary(uuid, text),
  public.partner_clients(), public.trainer_clients(), public.my_referral_code(text, text, uuid), public.referral_info(text),
  public.record_referral(uuid, text), public.my_referrals() to authenticated;
