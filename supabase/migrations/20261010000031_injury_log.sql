-- OSHA 300 log and 300A summary (src/core/oshaLog.ts). Additive: two new tables.
--
-- - Owners and admins only. Injury and illness details are health information: no presenter, office, employee,
--   trainer or partner account can read them, and nothing here reaches shared summaries.
-- - Versions, never edits, like company talks: each save is a new version and the latest counts, so the five years of
--   updates the rule asks for (29 CFR 1904.33) keep their history. A case found not recordable is "removed" in a new
--   version with a reason, the way a line is struck through on the paper log.
-- - Case numbers count up per company and year, set by the database on the first version and kept by later ones.
-- - Privacy concern cases (1904.29(b)(7)) keep the name here for the confidential list; the log prints "Privacy case".

create table public.injury_cases (
  id               uuid primary key default gen_random_uuid(),
  company_id       uuid not null references public.companies (id) on delete cascade,
  case_key         uuid not null,
  version          int not null check (version >= 1),
  year             int not null check (year between 2000 and 2100),
  case_no          int not null default 0,
  removed          boolean not null default false,
  removed_reason   text not null default '' check (char_length(removed_reason) <= 500 and (not removed or char_length(btrim(removed_reason)) > 0)),
  person_id        uuid,
  employee_name    text not null check (char_length(btrim(employee_name)) between 1 and 120),
  job_title        text not null default '' check (char_length(job_title) <= 120),
  injury_date      date not null,
  location         text not null default '' check (char_length(location) <= 200),
  description      text not null check (char_length(btrim(description)) between 1 and 1000),
  outcome          text not null check (outcome in ('death', 'days_away', 'restricted', 'other')),
  days_away        int not null default 0 check (days_away between 0 and 180),
  days_restricted  int not null default 0 check (days_restricted between 0 and 180),
  kind             text not null check (kind in ('injury', 'skin', 'respiratory', 'poisoning', 'hearing', 'other_illness')),
  privacy          boolean not null default false,
  privacy_reason   text check (privacy_reason in ('intimate', 'sexual_assault', 'mental_illness', 'infection', 'needlestick', 'employee_request')),
  created_by       uuid references auth.users (id),
  created_at       timestamptz not null default now(),
  unique (company_id, case_key, version),
  foreign key (company_id, person_id) references public.people (company_id, id),
  check (year = extract(year from injury_date)),
  check (privacy = (privacy_reason is not null)),
  -- Only illnesses can be withheld at the employee's request (1904.29(b)(7)(vi)).
  check (privacy_reason is distinct from 'employee_request' or kind <> 'injury'),
  -- The days match the box checked (G-J): days away for H, restricted days (and none away) for I, none for J.
  check (outcome <> 'days_away' or days_away >= 1),
  check (outcome <> 'restricted' or (days_restricted >= 1 and days_away = 0)),
  check (outcome <> 'other' or (days_away = 0 and days_restricted = 0))
);
create unique index injury_cases_number on public.injury_cases (company_id, year, case_no) where version = 1;
create index injury_cases_company_idx on public.injury_cases (company_id, year, case_key, version desc);
alter table public.injury_cases enable row level security;
create policy "admins read injury cases" on public.injury_cases for select to authenticated using (private.is_admin(company_id));
create policy "admins add injury case versions" on public.injury_cases for insert to authenticated with check (private.is_admin(company_id));
revoke all on public.injury_cases from anon, authenticated;
grant select, insert on public.injury_cases to authenticated;   -- never edited or deleted
create trigger stamp_actor before insert on public.injury_cases for each row execute function private.stamp_actor('created_by');

-- Version 1 gets the next case number for its year; later versions keep the number and year, in order, no gaps.
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
    new.case_no := prev.case_no;
  end if;
  new.created_at := now(); -- when it was logged is the database's clock, not the phone's
  return new;
end;
$$;
create trigger next_injury_version before insert on public.injury_cases for each row execute function private.next_injury_version();

-- The 300A for one year: establishment, employment and who certifies it. Versions, the latest counts.
create table public.injury_summaries (
  id                  uuid primary key default gen_random_uuid(),
  company_id          uuid not null references public.companies (id) on delete cascade,
  year                int not null check (year between 2000 and 2100),
  version             int not null check (version >= 1),
  establishment       text not null default '' check (char_length(establishment) <= 200),
  address             text not null default '' check (char_length(address) <= 300),
  industry            text not null default '' check (char_length(industry) <= 200),
  naics               text not null default '' check (naics ~ '^([0-9]{2,6})?$'),
  avg_employees       int check (avg_employees between 0 and 1000000),
  hours_worked        numeric(14, 2) check (hours_worked between 0 and 10000000000),
  certifier_name      text not null default '' check (char_length(certifier_name) <= 120),
  certifier_title     text not null default '' check (char_length(certifier_title) <= 120),
  certifier_phone     text not null default '' check (char_length(certifier_phone) <= 40),
  created_by          uuid references auth.users (id),
  created_at          timestamptz not null default now(),
  unique (company_id, year, version)
);
alter table public.injury_summaries enable row level security;
create policy "admins read injury summaries" on public.injury_summaries for select to authenticated using (private.is_admin(company_id));
create policy "admins add injury summary versions" on public.injury_summaries for insert to authenticated with check (private.is_admin(company_id));
revoke all on public.injury_summaries from anon, authenticated;
grant select, insert on public.injury_summaries to authenticated;
create trigger stamp_actor before insert on public.injury_summaries for each row execute function private.stamp_actor('created_by');

create or replace function private.next_summary_version()
returns trigger language plpgsql set search_path = '' as $$
declare last int;
begin
  select max(version) into last from public.injury_summaries where company_id = new.company_id and year = new.year;
  if new.version <> coalesce(last, 0) + 1 then
    raise exception 'Someone else changed this summary. Reload and try again.' using errcode = '40001';
  end if;
  new.created_at := now();
  return new;
end;
$$;
create trigger next_summary_version before insert on public.injury_summaries for each row execute function private.next_summary_version();
