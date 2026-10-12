-- Your own trainings: certifications that aren't OSHA's (a company's equipment checkout, a manufacturer install
-- course, a site orientation). A company makes its own; an outside trainer or training company makes theirs and gives
-- them to any client. Internal trainers (a company's own staff invited as trainers) give the company's trainings.
-- Additive: one table, functions, triggers.
--
-- - A training has a code ("c_" + letters/numbers) that cards use as their card type, so job-title requirements,
--   expiry tracking, classes, approvals, certificates and check codes all work the same as for built-in types.
-- - Every card or class made with one carries the training's name at that moment, so a renamed or retired training
--   never changes a saved card.
-- - Who sees a training: the owning company's members; the owning trainer or their organization; trainers of the
--   owning company (so internal and outside trainers can give it); and admins of companies a training's owner trains
--   (so they can require it for a job title).
-- - Who can give one: the owning company's admins on their own people; the owner trainer (or organization staff) for
--   any client; any trainer of the owning company for that company. Anything else is refused.

create table public.training_courses (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique check (code ~ '^c_[a-z0-9]{8,20}$'),
  owner_company  uuid references public.companies (id) on delete cascade,
  owner_user     uuid references auth.users (id) on delete cascade,
  owner_org      uuid references public.partner_orgs (id) on delete cascade,
  name           text not null check (char_length(btrim(name)) between 1 and 100),
  description    text not null default '' check (char_length(description) <= 1000),
  renew_months   int check (renew_months between 1 and 120),
  retired        boolean not null default false,
  created_by     uuid references auth.users (id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  check (num_nonnulls(owner_company, owner_user, owner_org) = 1)
);
create index training_courses_company_idx on public.training_courses (owner_company) where owner_company is not null;
create index training_courses_user_idx on public.training_courses (owner_user) where owner_user is not null;
create index training_courses_org_idx on public.training_courses (owner_org) where owner_org is not null;

-- Whether a course's owner trains this company (a live trainer link by the owner user or in the owner organization).
create or replace function private.course_owner_trains(c public.training_courses, co uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.company_trainers t where t.company_id = co and t.removed_at is null
                 and ((c.owner_user is not null and t.user_id = c.owner_user) or (c.owner_org is not null and t.org_id = c.owner_org)));
$$;
revoke all on function private.course_owner_trains(public.training_courses, uuid) from public, anon, authenticated;

alter table public.training_courses enable row level security;
create policy "owners read their trainings" on public.training_courses for select to authenticated
  using (private.is_member(owner_company) or owner_user = auth.uid() or private.in_partner_org(owner_org));
create policy "trainers of the owning company read its trainings" on public.training_courses for select to authenticated
  using (owner_company is not null and private.my_trainer_id(owner_company) is not null);
create policy "companies read trainings their trainers give" on public.training_courses for select to authenticated
  using (exists (select 1 from public.company_trainers t where t.removed_at is null and private.is_admin(t.company_id)
                 and ((owner_user is not null and t.user_id = owner_user) or (owner_org is not null and t.org_id = owner_org))));
revoke all on public.training_courses from anon, authenticated;
grant select on public.training_courses to authenticated;   -- written only by the functions below

-- Make or change a training. owner_kind: 'company' (co = company id), 'me', or 'org' (co = organization id).
-- code null = new. Returns the code.
create or replace function public.save_training_course(owner_kind text, owner uuid, code text, name text, description text, renew_months int)
returns text language plpgsql security definer set search_path = '' as $$
declare c public.training_courses; new_code text; alphabet constant text := 'abcdefghijkmnpqrstuvwxyz23456789'; i int;
begin
  if code is not null then
    select * into c from public.training_courses t where t.code = save_training_course.code;
    if c.id is null or not coalesce((c.owner_company is not null and private.is_admin(c.owner_company)) or c.owner_user = auth.uid() or (c.owner_org is not null and private.partner_org_admin(c.owner_org)), false) then
      raise exception 'Training not found.' using errcode = '42501';
    end if;
    if c.owner_company is not null and private.company_paused(c.owner_company) then raise exception 'This account is paused: nothing new saves.' using errcode = '42501'; end if;
    update public.training_courses set name = btrim(save_training_course.name), description = btrim(coalesce(save_training_course.description, '')),
      renew_months = save_training_course.renew_months, updated_at = now() where id = c.id;
    return c.code;
  end if;
  if owner_kind = 'company' then
    if not coalesce(private.is_admin(owner), false) then raise exception 'Only owners and admins can make trainings.' using errcode = '42501'; end if;
    if private.company_paused(owner) then raise exception 'This account is paused: nothing new saves.' using errcode = '42501'; end if;
  elsif owner_kind = 'org' then
    if not coalesce(private.partner_org_admin(owner), false) then raise exception 'Only the organization''s admins can make its trainings.' using errcode = '42501'; end if;
  elsif owner_kind = 'me' then
    if auth.uid() is null then raise exception 'Sign in first.' using errcode = '42501'; end if;
  else raise exception 'Unknown owner.' using errcode = '22023'; end if;
  loop
    new_code := 'c_';
    for i in 1..12 loop new_code := new_code || substr(alphabet, 1 + floor(random() * 32)::int, 1); end loop;
    exit when not exists (select 1 from public.training_courses t where t.code = new_code);
  end loop;
  insert into public.training_courses (code, owner_company, owner_user, owner_org, name, description, renew_months, created_by)
  values (new_code, case when owner_kind = 'company' then owner end, case when owner_kind = 'me' then auth.uid() end, case when owner_kind = 'org' then owner end,
          btrim(name), btrim(coalesce(description, '')), renew_months, auth.uid());
  return new_code;
end;
$$;

create or replace function public.retire_training_course(code text, retire boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare c public.training_courses;
begin
  select * into c from public.training_courses t where t.code = retire_training_course.code;
  if c.id is null or not coalesce((c.owner_company is not null and private.is_admin(c.owner_company)) or c.owner_user = auth.uid() or (c.owner_org is not null and private.partner_org_admin(c.owner_org)), false) then
    raise exception 'Training not found.' using errcode = '42501';
  end if;
  update public.training_courses set retired = retire, updated_at = now() where id = c.id;
end;
$$;

-- The trainings that count for one company: its own, and those of the trainers who train it (retired ones too, so old
-- job-title needs keep their names). A member of the company sees them all; a trainer of it sees only the ones they
-- can give (the company's and their own or their organization's). Anyone else gets nothing.
create or replace function public.trainings_for_company(co uuid)
returns setof public.training_courses language sql stable security definer set search_path = '' as $$
  select c.* from public.training_courses c
  where (c.owner_company = co or private.course_owner_trains(c, co))
    and (private.is_member(co)
         or (private.my_trainer_id(co) is not null
             and (c.owner_company = co or c.owner_user = auth.uid() or coalesce(private.in_partner_org(c.owner_org), false))))
  order by c.name;
$$;
revoke all on function public.trainings_for_company(uuid) from public, anon;
grant execute on function public.trainings_for_company(uuid) to authenticated;

-- Cards, sent-in cards and classes made with one of these trainings: check who may give it, and stamp its name.
create or replace function private.stamp_course()
returns trigger language plpgsql security definer set search_path = '' as $$
declare c public.training_courses; tr public.company_trainers; ok boolean;
  -- Only person_certs has submission_id; read it through jsonb so the other tables don't trip on it.
  sub text := to_jsonb(new)->>'submission_id';
begin
  if new.cert_type !~ '^c_' then return new; end if;
  select * into c from public.training_courses t where t.code = new.cert_type;
  if c.id is null then raise exception 'That training doesn''t exist.' using errcode = '22023'; end if;
  if tg_table_name = 'person_certs' then
    -- A card the company enters, or one it approves from a trainer (checked when the trainer sent it).
    ok := coalesce(sub is not null or c.owner_company = new.company_id, false);
    if sub is null and c.retired then raise exception 'That training was retired.' using errcode = '23514'; end if;
  else
    if c.retired then raise exception 'That training was retired.' using errcode = '23514'; end if;
    select * into tr from public.company_trainers t where t.id = new.trainer_id and t.company_id = new.company_id;
    ok := coalesce(c.owner_company = new.company_id
       or (c.owner_user is not null and tr.user_id = c.owner_user)
       or (c.owner_org is not null and tr.org_id = c.owner_org), false);
  end if;
  if not ok then raise exception 'That training can''t be given here.' using errcode = '42501'; end if;
  if sub is null then new.custom_name := c.name; end if;
  return new;
end;
$$;
create trigger stamp_course before insert on public.person_certs for each row execute function private.stamp_course();
create trigger stamp_course before insert on public.cert_submissions for each row execute function private.stamp_course();
create trigger stamp_course before insert on public.training_classes for each row execute function private.stamp_course();

revoke all on function public.save_training_course(text, uuid, text, text, text, int), public.retire_training_course(text, boolean) from public, anon;
grant execute on function public.save_training_course(text, uuid, text, text, text, int), public.retire_training_course(text, boolean) to authenticated;
