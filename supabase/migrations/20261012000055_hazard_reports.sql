-- Crew hazard and near-miss reports: anyone on the job can say "this is unsafe" or "that was close", with a photo,
-- any time, not only at a talk. Additive: two tables, functions, triggers.
--
-- - Who can report: anyone signed in to the company (any app role, employees too), or anyone with no account by
--   scanning the jobsite's QR sticker (the link holds only the jobsite id). Up to 30 sticker reports a jobsite a day.
-- - Anonymous: the reporter can leave their name off. Then nothing about who sent it is kept, not even their account.
-- - A report never changes and is never deleted. Owners, admins and office read them and mark each one reviewed with
--   what was done; optionally it goes on the crew issues list (talk_issues.hazard_id) so there's one list to fix from.
-- - A signed-in reporter who gave their name can see their own reports and what was done.
-- - Photos: one JPEG or PNG under 1.5 MB per report, kept in the database (private; readable by the same people).
-- - A paused company takes no new reports (block_when_paused).

create table public.hazard_reports (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  client_id       uuid not null,
  kind            text not null check (kind in ('hazard', 'near_miss')),
  what            text not null check (char_length(btrim(what)) between 1 and 1000),
  where_text      text not null default '' check (char_length(where_text) <= 200),
  jobsite_id      uuid,
  jobsite_name    text not null default '',
  anonymous       boolean not null default false,
  reporter_user   uuid references auth.users (id) on delete set null,
  reporter_name   text not null default '' check (char_length(reporter_name) <= 120),
  via             text not null check (via in ('app', 'sticker')),
  has_photo       boolean not null default false,
  created_at      timestamptz not null default now(),
  reviewed_at     timestamptz,
  reviewed_by     uuid references auth.users (id),
  action          text not null default '' check (char_length(action) <= 1000),
  unique (company_id, client_id),
  unique (company_id, id),
  foreign key (company_id, jobsite_id) references public.jobsites (company_id, id),
  check (not anonymous or (reporter_user is null and reporter_name = '')),
  check ((reviewed_at is null) = (reviewed_by is null))
);
create index hazard_reports_company_idx on public.hazard_reports (company_id, created_at desc);
create index hazard_reports_site_day_idx on public.hazard_reports (jobsite_id, created_at) where via = 'sticker';

create table public.hazard_report_photos (
  report_id   uuid primary key,
  company_id  uuid not null,
  mime        text not null check (mime in ('image/jpeg', 'image/png')),
  data        bytea not null check (octet_length(data) between 100 and 1572864),
  foreign key (company_id, report_id) references public.hazard_reports (company_id, id) on delete cascade
);

alter table public.talk_issues add column hazard_id uuid;
alter table public.talk_issues add constraint talk_issues_hazard_fk foreign key (company_id, hazard_id) references public.hazard_reports (company_id, id);
create unique index talk_issues_hazard_unique on public.talk_issues (hazard_id) where hazard_id is not null;

alter table public.hazard_reports enable row level security;
alter table public.hazard_report_photos enable row level security;
create policy "office reads hazard reports" on public.hazard_reports for select to authenticated using (private.can_report(company_id));
create policy "reporters read their own" on public.hazard_reports for select to authenticated
  using (reporter_user = auth.uid() and (private.is_member(company_id) or private.is_employee(company_id)));
create policy "office reads hazard photos" on public.hazard_report_photos for select to authenticated using (private.can_report(company_id));
revoke all on public.hazard_reports, public.hazard_report_photos from anon, authenticated;
grant select on public.hazard_reports, public.hazard_report_photos to authenticated;   -- written only by the functions below
create trigger block_when_paused before insert or update on public.hazard_reports for each row execute function private.block_when_paused();
create trigger block_when_paused before insert or update on public.hazard_report_photos for each row execute function private.block_when_paused();

-- Shared by both ways in: checks the words and photo, then saves. Returns the report id (the same one on a resend).
create or replace function private.save_hazard(co uuid, client_id uuid, kind text, what text, where_text text, site uuid,
                                               anonymous boolean, reporter uuid, reporter_name text, via text, photo text, photo_mime text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare r uuid; js public.jobsites; bytes bytea;
begin
  select h.id into r from public.hazard_reports h where h.company_id = co and h.client_id = save_hazard.client_id;
  if r is not null then return r; end if;   -- sent twice (no signal the first time): one report
  if kind not in ('hazard', 'near_miss') then raise exception 'Pick hazard or near miss.' using errcode = '22023'; end if;
  if char_length(btrim(coalesce(what, ''))) not between 1 and 1000 then raise exception 'Say what you saw (up to 1000 characters).' using errcode = '22023'; end if;
  if site is not null then
    select * into js from public.jobsites j where j.id = site and j.company_id = co;
    if js.id is null then raise exception 'That jobsite isn''t this company''s.' using errcode = '22023'; end if;
  end if;
  if photo is not null then
    if coalesce(photo_mime, '') not in ('image/jpeg', 'image/png') then raise exception 'Only JPEG or PNG photos.' using errcode = '22023'; end if;
    begin bytes := decode(photo, 'base64'); exception when others then raise exception 'The photo didn''t come through. Try again.' using errcode = '22023'; end;
    if (photo_mime = 'image/jpeg' and substr(bytes, 1, 3) <> '\xffd8ff'::bytea)
       or (photo_mime = 'image/png' and substr(bytes, 1, 8) <> '\x89504e470d0a1a0a'::bytea) then
      raise exception 'Only JPEG or PNG photos.' using errcode = '22023';
    end if;
    if octet_length(bytes) > 1572864 then raise exception 'The photo is too large (1.5 MB at most).' using errcode = '22023'; end if;
  end if;
  insert into public.hazard_reports (company_id, client_id, kind, what, where_text, jobsite_id, jobsite_name, anonymous, reporter_user, reporter_name, via, has_photo)
  values (co, save_hazard.client_id, kind, btrim(what), left(btrim(coalesce(where_text, '')), 200), js.id, coalesce(js.name, ''), coalesce(anonymous, false),
          case when coalesce(anonymous, false) then null else reporter end,
          case when coalesce(anonymous, false) then '' else left(btrim(coalesce(reporter_name, '')), 120) end, via, bytes is not null)
  returning id into r;
  if bytes is not null then insert into public.hazard_report_photos (report_id, company_id, mime, data) values (r, co, photo_mime, bytes); end if;
  return r;
end;
$$;
revoke all on function private.save_hazard(uuid, uuid, text, text, text, uuid, boolean, uuid, text, text, text, text) from public, anon, authenticated;

-- In the app: anyone signed in to the company, any role.
create or replace function public.report_hazard(co uuid, client_id uuid, kind text, what text, where_text text default '', site uuid default null,
                                                anonymous boolean default false, photo text default null, photo_mime text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare nm text;
begin
  if not (coalesce(private.is_member(co), false) or coalesce(private.is_employee(co), false)) then
    raise exception 'Sign in to this company to send a report.' using errcode = '42501';
  end if;
  select coalesce(nullif(p.full_name, ''), u.email, '') into nm from auth.users u
    left join public.people p on p.user_id = u.id and p.company_id = co where u.id = auth.uid();
  return private.save_hazard(co, client_id, kind, what, where_text, site, anonymous, auth.uid(), nm, 'app', photo, photo_mime);
end;
$$;

-- From the jobsite's QR sticker, no account. The jobsite decides the company.
create or replace function public.report_hazard_at_site(site uuid, client_id uuid, kind text, what text, where_text text default '',
                                                        reporter_name text default '', photo text default null, photo_mime text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare js public.jobsites;
begin
  select * into js from public.jobsites j where j.id = site and j.active;
  if js.id is null then raise exception 'This sticker isn''t active. Tell your supervisor.' using errcode = '22023'; end if;
  if (select count(*) from public.hazard_reports h where h.jobsite_id = site and h.via = 'sticker' and h.created_at > now() - interval '1 day') >= 30
     and not exists (select 1 from public.hazard_reports h where h.company_id = js.company_id and h.client_id = report_hazard_at_site.client_id) then
    raise exception 'This sticker has had many reports today. Tell your supervisor in person.' using errcode = '54000';
  end if;
  return private.save_hazard(js.company_id, client_id, kind, what, where_text, site, nullif(btrim(coalesce(reporter_name, '')), '') is null,
                             null, reporter_name, 'sticker', photo, photo_mime);
end;
$$;

-- What the sticker page shows before sending: the company and jobsite names only.
create or replace function public.hazard_site_info(site uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('company', c.name, 'jobsite', j.name) from public.jobsites j join public.companies c on c.id = j.company_id
  where j.id = site and j.active and not exists (select 1 from public.company_accounts a where a.company_id = j.company_id and a.paused_at is not null);
$$;

-- Mark a report reviewed with what was done; optionally put it on the crew issues list. Once.
create or replace function public.review_hazard(co uuid, report uuid, action text, add_issue boolean default false,
                                                owner_person uuid default null, due date default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare h public.hazard_reports; issue uuid; owner_nm text := '';
begin
  if not coalesce(private.can_report(co), false) then raise exception 'Only owners, admins and office review reports.' using errcode = '42501'; end if;
  select * into h from public.hazard_reports r where r.id = report and r.company_id = co;
  if h.id is null then raise exception 'Report not found.' using errcode = '42501'; end if;
  if h.reviewed_at is not null then raise exception 'This report was already reviewed.' using errcode = '23514'; end if;
  if char_length(btrim(coalesce(action, ''))) not between 1 and 1000 then raise exception 'Say what was done (up to 1000 characters).' using errcode = '22023'; end if;
  if add_issue then
    if owner_person is not null then
      select p.full_name into owner_nm from public.people p where p.id = owner_person and p.company_id = co;
      if owner_nm is null then raise exception 'That person isn''t on this company''s roster.' using errcode = '22023'; end if;
    end if;
    insert into public.talk_issues (company_id, client_id, hazard_id, description, jobsite_id, jobsite_name, owner_person_id, owner_name, due_date, raised_by_name)
    values (co, gen_random_uuid(), h.id, left((case when h.kind = 'near_miss' then 'Near miss: ' else 'Hazard: ' end) || h.what, 1000), h.jobsite_id, h.jobsite_name,
            owner_person, coalesce(owner_nm, ''), due, case when h.anonymous or h.reporter_name = '' then 'Crew report' else h.reporter_name end)
    returning id into issue;
  end if;
  update public.hazard_reports set reviewed_at = now(), reviewed_by = auth.uid(), action = btrim(review_hazard.action) where id = h.id;
  return issue;
end;
$$;

-- A report's words never change: only the review is ever written, once. (No one has delete permission; a company's
-- purge still cascades.)
create or replace function private.guard_hazard_report()
returns trigger language plpgsql set search_path = '' as $$
begin
  if (to_jsonb(new) - array['reviewed_at', 'reviewed_by', 'action']) is distinct from (to_jsonb(old) - array['reviewed_at', 'reviewed_by', 'action'])
     or old.reviewed_at is not null then
    raise exception 'A report never changes once sent; its review is written once.' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger guard_hazard_report before update on public.hazard_reports for each row execute function private.guard_hazard_report();

revoke all on function public.report_hazard(uuid, uuid, text, text, text, uuid, boolean, text, text), public.review_hazard(uuid, uuid, text, boolean, uuid, date) from public, anon;
grant execute on function public.report_hazard(uuid, uuid, text, text, text, uuid, boolean, text, text), public.review_hazard(uuid, uuid, text, boolean, uuid, date) to authenticated;
revoke all on function public.report_hazard_at_site(uuid, uuid, text, text, text, text, text, text), public.hazard_site_info(uuid) from public;
grant execute on function public.report_hazard_at_site(uuid, uuid, text, text, text, text, text, text), public.hazard_site_info(uuid) to anon, authenticated;
