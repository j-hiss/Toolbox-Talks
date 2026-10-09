-- App roles: who can do what in the app, separate from job titles. Approved by Joe on 2026-10-09.
--   owner      everything, including who is an owner or admin
--   admin      everything except making or changing owners and admins
--   presenter  runs talks and daily plans; sees records, the plan and the roster
--   office     sees reports and records and works the issues list; doesn't run talks or change setup
--   employee   signs in to see only their own talk history; sees nothing else of the company
-- Members join by invite: an admin enters an email; the next time that person signs in (email code, so the address is
-- proven), public.accept_invites() adds them. No server code.
--
-- Changes to shared access code (reviewed in the report):
-- * company_members.access accepts 'office' and 'employee' (the old check is replaced by a wider one; every existing
--   value stays valid, no row changes).
-- * private.is_member() now means "staff": any member except an employee. Every existing "members read" policy uses it,
--   so employees are kept out of company-wide data without rewriting those policies.
-- * Writes that ran a talk (talk_records, talk_attendees, raising issues, talk files) now need private.can_present():
--   owner, admin or presenter. Office can't create records.
-- * Admins can no longer change owner or admin rows; only owners can. The last owner can't be removed or demoted.

alter table public.company_members drop constraint company_members_access_check;
alter table public.company_members add constraint company_members_access_check
  check (access in ('owner', 'admin', 'presenter', 'office', 'employee'));

-- Email on the membership, so admins can see who has access (the browser can't read auth.users).
alter table public.company_members add column email text not null default '';
update public.company_members m set email = coalesce(u.email, '') from auth.users u where u.id = m.user_id;

-- A person on the roster can be linked to the app account that signs in for them (employees' own history).
alter table public.people add column user_id uuid references auth.users (id) on delete set null;
create unique index people_user_idx on public.people (company_id, user_id) where user_id is not null;

-- Access helpers --------------------------------------------------------------------------------------------------
create or replace function private.is_member(target uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  -- Staff only: an employee account is not a member for company-wide reads (see private.is_employee).
  select exists (select 1 from public.company_members m where m.company_id = target and m.user_id = auth.uid() and m.access <> 'employee');
$$;

create or replace function private.is_owner(target uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.company_members m where m.company_id = target and m.user_id = auth.uid() and m.access = 'owner');
$$;

create or replace function private.can_present(target uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.company_members m where m.company_id = target and m.user_id = auth.uid() and m.access in ('owner', 'admin', 'presenter'));
$$;

create or replace function private.is_employee(target uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.company_members m where m.company_id = target and m.user_id = auth.uid() and m.access = 'employee');
$$;

revoke execute on function private.is_owner(uuid), private.can_present(uuid), private.is_employee(uuid) from public, anon;
grant execute on function private.is_owner(uuid), private.can_present(uuid), private.is_employee(uuid) to authenticated;

-- Members ----------------------------------------------------------------------------------------------------------
-- Everyone sees their own membership row (an employee needs it to know their company); staff see the whole list.
create policy "see own membership" on public.company_members for select to authenticated using (user_id = auth.uid());

-- Admins manage presenters, office and employees; owners manage everyone. Replaces "admins manage members".
drop policy "admins manage members" on public.company_members;
create policy "admins manage staff" on public.company_members for all to authenticated
  using (private.is_owner(company_id) or (private.is_admin(company_id) and access in ('presenter', 'office', 'employee')))
  with check (private.is_owner(company_id) or (private.is_admin(company_id) and access in ('presenter', 'office', 'employee')));

-- Never leave a company without an owner.
create or replace function private.keep_an_owner()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.access = 'owner' and (tg_op = 'DELETE' or new.access <> 'owner')
     and exists (select 1 from public.companies c where c.id = old.company_id)   -- not when the company itself is deleted
     and not exists (select 1 from public.company_members m where m.company_id = old.company_id and m.access = 'owner' and m.user_id <> old.user_id)
  then raise exception 'A company needs at least one owner. Make someone else an owner first.' using errcode = '23514';
  end if;
  return coalesce(new, old);
end;
$$;
create trigger keep_an_owner before update or delete on public.company_members for each row execute function private.keep_an_owner();

-- Employees can read their company's name and colors (the companies row), nothing else.
create policy "employees read their company" on public.companies for select to authenticated using (private.is_employee(id));

-- Running talks needs presenter access or above --------------------------------------------------------------------
drop policy "members record talks" on public.talk_records;
create policy "presenters record talks" on public.talk_records for insert to authenticated
  with check (private.can_present(company_id) and created_by = auth.uid());
drop policy "members record attendance" on public.talk_attendees;
create policy "presenters record attendance" on public.talk_attendees for insert to authenticated
  with check (private.can_present(company_id));
drop policy "members raise" on public.talk_issues;
create policy "presenters raise" on public.talk_issues for insert to authenticated with check (private.can_present(company_id));
-- "members work issues" (update) stays: office works the issues list too.
drop policy "talk files: members add to their company's" on storage.objects;
create policy "talk files: presenters add to their company's" on storage.objects for insert to authenticated
  with check (bucket_id = 'talk-files' and private.can_present(private.file_company(name)));

-- Employees see their own history: the talks they were on, and only their own attendance row.
create policy "employees read their own talks" on public.talk_records for select to authenticated using (
  private.is_employee(company_id) and exists (
    select 1 from public.talk_attendees a join public.people p on p.id = a.person_id
    where a.record_id = talk_records.id and p.user_id = auth.uid()));
create policy "employees read their own attendance" on public.talk_attendees for select to authenticated using (
  private.is_employee(company_id) and exists (select 1 from public.people p where p.id = talk_attendees.person_id and p.user_id = auth.uid()));
create policy "employees read their own person" on public.people for select to authenticated using (
  private.is_employee(company_id) and user_id = auth.uid());

-- Invites -------------------------------------------------------------------------------------------------------------
create table public.company_invites (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies (id) on delete cascade,
  email        text not null check (email = lower(trim(email)) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  access       text not null check (access in ('owner', 'admin', 'presenter', 'office', 'employee')),
  person_id    uuid,                      -- employees: which roster person this account is
  invited_by   uuid not null default auth.uid() references auth.users (id),
  invited_at   timestamptz not null default now(),
  accepted_at  timestamptz,
  accepted_by  uuid references auth.users (id),
  foreign key (company_id, person_id) references public.people (company_id, id) on delete cascade,
  check (access = 'employee' or person_id is null)
);
create unique index company_invites_open_idx on public.company_invites (company_id, email) where accepted_at is null;
alter table public.company_invites enable row level security;
create policy "admins read invites" on public.company_invites for select to authenticated using (private.is_admin(company_id));
create policy "admins invite" on public.company_invites for insert to authenticated with check (
  accepted_at is null and invited_by = auth.uid()
  and (private.is_owner(company_id) or (private.is_admin(company_id) and access in ('presenter', 'office', 'employee'))));
create policy "admins cancel open invites" on public.company_invites for delete to authenticated using (
  accepted_at is null and (private.is_owner(company_id) or (private.is_admin(company_id) and access in ('presenter', 'office', 'employee'))));
revoke all on public.company_invites from anon, authenticated;
grant select, insert, delete on public.company_invites to authenticated;

-- Called by the app after every sign-in. Adds the signed-in user to each company that invited their (proven) email.
-- An existing membership keeps its access unless the invite is for more; returns how many companies were joined.
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
  select lower(u.email) into addr from auth.users u where u.id = me and u.email_confirmed_at is not null;
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
revoke all on function public.accept_invites() from public, anon;
grant execute on function public.accept_invites() to authenticated;

-- create_company: same as 0002, and records the owner's email on the membership.
create or replace function public.create_company(company_name text, company_industry text, company_zip text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in to create a company' using errcode = '42501'; end if;
  insert into public.companies (name, industry, zip) values (company_name, company_industry, company_zip) returning id into new_id;
  insert into public.company_members (company_id, user_id, access, email)
    values (new_id, auth.uid(), 'owner', coalesce((select lower(u.email) from auth.users u where u.id = auth.uid()), ''));
  insert into public.roles (company_id, name)
    select new_id, r from unnest(array['Owner', 'Safety Manager', 'Superintendent', 'Supervisor', 'Foreman', 'Team Lead']) as r;
  return new_id;
end;
$$;
revoke all on function public.create_company(text, text, text) from public, anon;
grant execute on function public.create_company(text, text, text) to authenticated;
