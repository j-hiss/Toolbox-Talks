-- Jobsites: where talks happen. Each has a name, an address, and optionally the GPS point captured on site,
-- so the app can pick the nearest jobsite from the presenter's location.
-- Jobsites are deactivated, never deleted: saved talk records will point at them.

create table public.jobsites (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies (id) on delete cascade,
  name        text not null check (length(trim(name)) > 0),
  address     text not null default '',
  latitude    double precision check (latitude between -90 and 90),
  longitude   double precision check (longitude between -180 and 180),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  check ((latitude is null) = (longitude is null)),   -- both or neither
  unique (company_id, id)
);
create index jobsites_company_idx on public.jobsites (company_id) where active;

alter table public.jobsites enable row level security;
create policy "members read" on public.jobsites for select to authenticated using (private.is_member(company_id));
create policy "admins write" on public.jobsites for all to authenticated using (private.is_admin(company_id)) with check (private.is_admin(company_id));

revoke all on public.jobsites from anon;
grant select, insert, update on public.jobsites to authenticated;   -- no delete grant: jobsites are deactivated
