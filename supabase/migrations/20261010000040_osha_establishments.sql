-- More than one OSHA log per company (29 CFR 1904.30). Additive: one new table, one column on injury_cases and
-- injury_summaries, and the case-version trigger replaced with one more check.
--
-- - A separate 300 log and 300A for each establishment expected to run a year or longer (1904.30(a)). Short-term
--   sites (under a year, like most jobsites) can share one log (1904.30(b)(1)); short_term marks that log.
-- - establishment_id null = the company's main log, so every log kept before this change stays exactly as it was.
-- - Owners and admins only, like the log itself. A location is closed, never deleted: its cases and summaries stay.
-- - A case stays on the log it was put on, like it stays in its year: move it by taking it off one log (with a reason)
--   and adding it to the other.
-- - Case numbers keep counting per company and year across all logs, so every number is still unique. Starting each
--   location's log at 1 means replacing the unique index from 0031; that is a proposed change waiting for Joe's go
--   (docs/proposed-migrations/case-numbers-per-log.sql).

create table public.osha_establishments (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies (id) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 1 and 120),
  short_term  boolean not null default false,
  closed_at   timestamptz,
  created_by  uuid references auth.users (id),
  created_at  timestamptz not null default now(),
  unique (company_id, id)
);
create unique index osha_establishments_name on public.osha_establishments (company_id, lower(btrim(name)));
alter table public.osha_establishments enable row level security;
create policy "admins read establishments" on public.osha_establishments for select to authenticated using (private.is_admin(company_id));
create policy "admins add establishments" on public.osha_establishments for insert to authenticated with check (private.is_admin(company_id));
create policy "admins change establishments" on public.osha_establishments for update to authenticated using (private.is_admin(company_id)) with check (private.is_admin(company_id));
revoke all on public.osha_establishments from anon, authenticated;
grant select on public.osha_establishments to authenticated;
grant insert (company_id, name, short_term) on public.osha_establishments to authenticated;   -- id, times and who are the database's
grant update (name, short_term, closed_at) on public.osha_establishments to authenticated;   -- never moved to another company or deleted
create trigger stamp_actor before insert on public.osha_establishments for each row execute function private.stamp_actor('created_by');

alter table public.injury_cases add column establishment_id uuid;
alter table public.injury_cases add constraint injury_cases_establishment_fk foreign key (company_id, establishment_id) references public.osha_establishments (company_id, id);
alter table public.injury_summaries add column establishment_id uuid;
alter table public.injury_summaries add constraint injury_summaries_establishment_fk foreign key (company_id, establishment_id) references public.osha_establishments (company_id, id);
create index injury_cases_establishment_idx on public.injury_cases (company_id, establishment_id, year);

-- Same as 0031, plus: a later version keeps its log.
create or replace function private.next_injury_version()
returns trigger language plpgsql set search_path = '' as $$
declare prev public.injury_cases;
begin
  select * into prev from public.injury_cases
  where company_id = new.company_id and case_key = new.case_key order by version desc limit 1;
  if new.version <> coalesce(prev.version, 0) + 1 then
    raise exception 'Someone else changed this case. Reload and try again.' using errcode = '40001';
  end if;
  if prev.id is null then
    perform pg_advisory_xact_lock(hashtext(new.company_id::text || ':' || new.year::text));
    select coalesce(max(case_no), 0) + 1 into new.case_no from public.injury_cases
    where company_id = new.company_id and year = new.year and version = 1;
  else
    if new.year <> prev.year then
      raise exception 'A case stays in the year it was logged. Remove it here and add it to %.', new.year using errcode = '23514';
    end if;
    if new.establishment_id is distinct from prev.establishment_id then
      raise exception 'A case stays on the log it was put on. Take it off this log and add it to the other one.' using errcode = '23514';
    end if;
    new.case_no := prev.case_no;
  end if;
  new.created_at := now(); -- when it was logged is the database's clock, not the phone's
  return new;
end;
$$;
