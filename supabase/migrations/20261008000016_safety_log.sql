-- The safety log (Admin → Safety log): inspections, walk-arounds, citations, incidents and near misses, and the
-- crew summary of each that can be read at the next talk ("Since last talk"). Additive only.
--
-- * safety_events: admins only. Details, kind-specific fields and attachments can hold names and medical
--   information, so crews never read this table. Nothing is deleted: an event that shouldn't be read is withdrawn,
--   with a reason, and stays on file.
-- * The crew summary is a draft until an admin approves it (the same rule as translations). Once approved it can't
--   change; a different wording is a new event. It can still be withdrawn from future talks.
-- * crew_bulletins(company, since): what crews may see: approved, not withdrawn, crew-safe columns only. Any member
--   can call it for their own company.
-- * Findings become crew issues (talk_issues.event_id), so there's one list of things to fix.
-- * event-files: private bucket for the PDF or photos behind an event. Admins add and read their company's folder;
--   nobody can replace or delete a file.
-- * companies.since_last_*: whether talks read the section, the time window, this jobsite or all, which kinds.
-- * summary_source is 'typed' for now; an AI-drafted summary would come in as 'ai' and still need approval.

create table public.safety_events (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  client_id       uuid not null unique,
  kind            text not null check (kind in ('inspection', 'walkaround', 'citation', 'incident', 'near_miss')),
  occurred_on     date not null,
  jobsite_id      uuid,
  jobsite_name    text not null default '',
  title           text not null check (length(trim(title)) > 0 and length(title) <= 200),
  details         text not null default '' check (length(details) <= 5000),
  fields          jsonb not null default '{}' check (jsonb_typeof(fields) = 'object' and pg_column_size(fields) < 8192),
  case_status     text check (case_status in ('open', 'informal_conference', 'contested', 'settled', 'final')),
  crew_summary    text not null default '' check (length(crew_summary) <= 600),
  summary_source  text not null default 'typed' check (summary_source in ('typed', 'ai')),
  summary_status  text not null default 'draft' check (summary_status in ('draft', 'reviewed')),
  reviewed_by     uuid references auth.users (id),
  reviewed_at     timestamptz,
  status          text not null default 'open' check (status in ('open', 'closed')),
  closed_at       timestamptz,
  withdrawn_at    timestamptz,
  withdrawn_reason text not null default '',
  created_by      uuid not null default auth.uid() references auth.users (id),
  created_at      timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, jobsite_id) references public.jobsites (company_id, id),
  check ((summary_status = 'reviewed') = (reviewed_at is not null)),
  check (summary_status = 'draft' or length(trim(crew_summary)) > 0),
  check ((kind = 'citation') or case_status is null),
  check ((status = 'closed') = (closed_at is not null)),
  check (withdrawn_at is null or length(trim(withdrawn_reason)) > 0)
);
create index safety_events_company_idx on public.safety_events (company_id, occurred_on desc);

alter table public.safety_events enable row level security;
create policy "admins read" on public.safety_events for select to authenticated using (private.is_admin(company_id));
create policy "admins log" on public.safety_events for insert to authenticated
  with check (private.is_admin(company_id) and summary_status = 'draft');
create policy "admins work" on public.safety_events for update to authenticated
  using (private.is_admin(company_id)) with check (private.is_admin(company_id));
revoke all on public.safety_events from anon, authenticated;
grant select, insert, update on public.safety_events to authenticated;   -- no delete

create or replace function private.guard_safety_event()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.id := old.id;
  new.company_id := old.company_id;
  new.client_id := old.client_id;
  new.kind := old.kind;
  new.created_by := old.created_by;
  new.created_at := old.created_at;
  if old.summary_status = 'reviewed' then
    -- An approved summary is what crews may already have heard: it stays exactly as approved.
    new.summary_status := 'reviewed';
    new.crew_summary := old.crew_summary;
    new.summary_source := old.summary_source;
    new.reviewed_by := old.reviewed_by;
    new.reviewed_at := old.reviewed_at;
    new.occurred_on := old.occurred_on;
    new.jobsite_id := old.jobsite_id;
    new.jobsite_name := old.jobsite_name;
  elsif new.summary_status = 'reviewed' then
    new.reviewed_by := auth.uid();
    new.reviewed_at := now();
  else
    new.reviewed_by := null;
    new.reviewed_at := null;
  end if;
  if new.status = 'closed' and old.status <> 'closed' then new.closed_at := now();
  elsif new.status = 'open' then new.closed_at := null;
  else new.closed_at := old.closed_at;
  end if;
  if old.withdrawn_at is not null then   -- withdrawn stays withdrawn, with its reason
    new.withdrawn_at := old.withdrawn_at;
    new.withdrawn_reason := old.withdrawn_reason;
  elsif new.withdrawn_at is not null then
    new.withdrawn_at := now();
  end if;
  return new;
end;
$$;
create trigger safety_events_guard before update on public.safety_events
  for each row execute function private.guard_safety_event();

-- What crews may see: approved, not withdrawn, crew-safe columns. Members of the company only.
create or replace function public.crew_bulletins(co uuid, since timestamptz)
returns table (id uuid, kind text, occurred_on date, jobsite_id uuid, jobsite_name text, crew_summary text,
               case_status text, status text, reviewed_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select e.id, e.kind, e.occurred_on, e.jobsite_id, e.jobsite_name, e.crew_summary, e.case_status, e.status, e.reviewed_at
  from public.safety_events e
  where e.company_id = co and private.is_member(co)
    and e.summary_status = 'reviewed' and e.withdrawn_at is null
    and (e.reviewed_at >= since or e.occurred_on >= (since at time zone 'UTC')::date - 1)
  order by e.occurred_on, e.reviewed_at;
$$;
revoke all on function public.crew_bulletins(uuid, timestamptz) from public, anon;
grant execute on function public.crew_bulletins(uuid, timestamptz) to authenticated;

-- Findings go on the crew issues list, linked back to their event.
alter table public.talk_issues add column event_id uuid;
alter table public.talk_issues add constraint talk_issues_event_fk
  foreign key (company_id, event_id) references public.safety_events (company_id, id);

create or replace function private.guard_issue()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.company_id := old.company_id;
  new.client_id := old.client_id;
  new.record_id := old.record_id;
  new.event_id := old.event_id;
  new.description := old.description;
  new.raised_at := old.raised_at;
  new.raised_by_name := old.raised_by_name;
  new.created_by := old.created_by;
  if new.status = 'fixed' and old.status <> 'fixed' then
    new.fixed_at := now();
    new.fixed_by := auth.uid();
  elsif new.status = 'open' then
    new.fixed_at := null;
    new.fixed_by := null;
    new.fixed_note := '';
  else
    new.fixed_at := old.fixed_at;
    new.fixed_by := old.fixed_by;
  end if;
  return new;
end;
$$;

-- Files behind an event: private, admins of the company only, never replaced or deleted.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-files', 'event-files', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
create policy "event files: admins read their company's" on storage.objects for select to authenticated
  using (bucket_id = 'event-files' and private.is_admin(private.file_company(name)));
create policy "event files: admins add to their company's" on storage.objects for insert to authenticated
  with check (bucket_id = 'event-files' and private.is_admin(private.file_company(name)));

-- Company settings for the "Since last talk" section. Off until an admin turns it on.
alter table public.companies
  add column since_last_enabled boolean not null default false,
  add column since_last_window text not null default 'since_last' check (since_last_window in ('since_last', '30', '60', '90')),
  add column since_last_scope text not null default 'jobsite' check (since_last_scope in ('jobsite', 'all')),
  add column since_last_kinds text[] not null default array['inspection', 'walkaround', 'citation', 'incident', 'near_miss']
    check (since_last_kinds <@ array['inspection', 'walkaround', 'citation', 'incident', 'near_miss']),
  add column since_last_open_only boolean not null default false;
