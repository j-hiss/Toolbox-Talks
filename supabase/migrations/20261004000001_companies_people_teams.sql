-- Companies, members, roles, teams and people, each company walled off from every other by row-level security.
-- Additive. Never edit this file once it has been applied anywhere; add a new migration instead.

create schema if not exists private;

-- Companies ---------------------------------------------------------------------------------------------------------
create table public.companies (
  id               uuid primary key default gen_random_uuid(),
  name             text not null check (length(trim(name)) > 0),
  licenses         text not null default '',         -- one per line, printed on every PDF
  address          text not null default '',
  phone            text not null default '',
  email            text not null default '',
  industry         text not null check (industry in ('con', 'mfg', 'ag', 'wh')),
  zip              text check (zip is null or zip ~ '^\d{5}$'),
  program_start    date not null default (date_trunc('week', now())::date),  -- Week 1 Monday
  default_jobsite  text not null default '',
  created_at       timestamptz not null default now()
);

-- Who can sign in to a company, and what they can do in the app.
create table public.company_members (
  company_id  uuid not null references public.companies (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  access      text not null check (access in ('owner', 'admin', 'presenter')),
  created_at  timestamptz not null default now(),
  primary key (company_id, user_id)
);
create index company_members_user_idx on public.company_members (user_id);

-- Access helpers. SECURITY DEFINER so policies can read memberships without recursing through RLS.
create or replace function private.is_member(target uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.company_members m where m.company_id = target and m.user_id = auth.uid());
$$;

create or replace function private.is_admin(target uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.company_members m
    where m.company_id = target and m.user_id = auth.uid() and m.access in ('owner', 'admin')
  );
$$;

-- Creating a company: one call that makes the company and makes the caller its owner, so the new row is
-- immediately readable under RLS. (A plain INSERT ... RETURNING would be checked before the owner row exists.)
create or replace function public.create_company(company_name text, company_industry text, company_zip text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in to create a company' using errcode = '42501'; end if;
  insert into public.companies (name, industry, zip) values (company_name, company_industry, company_zip) returning id into new_id;
  insert into public.company_members (company_id, user_id, access) values (new_id, auth.uid(), 'owner');
  return new_id;
end;
$$;
revoke all on function public.create_company(text, text, text) from public, anon;
grant execute on function public.create_company(text, text, text) to authenticated;

-- Roles that can present (Owner, Safety Manager, Superintendent, ...). "Crew member" is people.role_id = null.
create table public.roles (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies (id) on delete cascade,
  name        text not null check (length(trim(name)) > 0),
  unique (company_id, name),
  unique (company_id, id)
);

create table public.teams (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  name            text not null check (length(trim(name)) > 0),
  lead_person_id  uuid,
  unique (company_id, id)
);

create table public.people (
  id                  uuid primary key default gen_random_uuid(),
  company_id          uuid not null references public.companies (id) on delete cascade,
  full_name           text not null check (length(trim(full_name)) > 0),
  role_id             uuid,                       -- null = crew member (signs only)
  team_id             uuid,
  employee_id         text,                       -- used to match rows on spreadsheet re-import
  phone               text,
  preferred_language  text not null default 'en' check (preferred_language in ('en', 'es', 'pt', 'ht', 'vi', 'zh')),
  active              boolean not null default true,
  created_at          timestamptz not null default now(),
  unique (company_id, id),
  -- Composite keys: a person's role and team must belong to the person's own company.
  foreign key (company_id, role_id) references public.roles (company_id, id) on delete set null (role_id),
  foreign key (company_id, team_id) references public.teams (company_id, id) on delete set null (team_id)
);
create unique index people_employee_id_idx on public.people (company_id, employee_id) where employee_id is not null;

alter table public.teams
  add foreign key (company_id, lead_person_id) references public.people (company_id, id) on delete set null (lead_person_id);

-- Row-level security ------------------------------------------------------------------------------------------------
alter table public.companies       enable row level security;
alter table public.company_members enable row level security;
alter table public.roles           enable row level security;
alter table public.teams           enable row level security;
alter table public.people          enable row level security;

create policy "members read their company" on public.companies
  for select to authenticated using (private.is_member(id));
create policy "admins update their company" on public.companies
  for update to authenticated using (private.is_admin(id)) with check (private.is_admin(id));

create policy "members see their company's members" on public.company_members
  for select to authenticated using (private.is_member(company_id));
create policy "admins manage members" on public.company_members
  for all to authenticated using (private.is_admin(company_id)) with check (private.is_admin(company_id));

-- roles, teams, people: members read, admins write. Same rule, one per table.
create policy "members read" on public.roles  for select to authenticated using (private.is_member(company_id));
create policy "admins write" on public.roles  for all to authenticated using (private.is_admin(company_id)) with check (private.is_admin(company_id));
create policy "members read" on public.teams  for select to authenticated using (private.is_member(company_id));
create policy "admins write" on public.teams  for all to authenticated using (private.is_admin(company_id)) with check (private.is_admin(company_id));
create policy "members read" on public.people for select to authenticated using (private.is_member(company_id));
create policy "admins write" on public.people for all to authenticated using (private.is_admin(company_id)) with check (private.is_admin(company_id));

-- The anonymous role gets nothing. Crew members sign on a presenter's signed-in phone; they never sign in.
revoke all on public.companies, public.company_members, public.roles, public.teams, public.people from anon;
grant select, update on public.companies to authenticated;   -- new companies come from create_company()
grant select, insert, update, delete on public.company_members, public.roles, public.teams, public.people to authenticated;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;
revoke execute on function private.is_member(uuid), private.is_admin(uuid) from public, anon;
grant execute on function private.is_member(uuid), private.is_admin(uuid) to authenticated;
