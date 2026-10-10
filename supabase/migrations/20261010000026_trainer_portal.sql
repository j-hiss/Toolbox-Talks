-- Trainer portal: a company invites an outside trainer (or training company), picks which people the trainer may see,
-- and the trainer sends in training cards for those people. Each card waits until an owner or admin approves it; only
-- then does it become a training card (person_certs). Additive: new tables and functions, accept_invites extended.
--
-- - A trainer is not a company member: they see none of the company's records, talks, reports or other people.
--   They see each company's name and, for the people they were given, the name and job title. Nothing else.
-- - Trainers join by invite, claimed on sign-in with an email code (same rule as staff invites, migration 0024).
-- - Submissions are append-only: pending, then approved or declined once (declined needs a reason). An approved card is
--   added to person_certs by the approver, so person_certs keeps "admins add" as its only way in.
-- - Removing a trainer ends their access at once; their earlier submissions stay on file for the company.
-- - Card photos go in the private person-certs bucket under <company>/trainer/<trainer>/; admins read them as before.

create table public.company_trainers (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies (id) on delete cascade,
  email        text not null check (email = lower(btrim(email)) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  name         text not null check (char_length(btrim(name)) between 1 and 120),
  user_id      uuid references auth.users (id),
  invited_by   uuid references auth.users (id),
  invited_at   timestamptz not null default now(),
  accepted_at  timestamptz,
  removed_at   timestamptz,
  removed_by   uuid references auth.users (id),
  unique (company_id, id)
);
create unique index company_trainers_one_live_invite on public.company_trainers (company_id, email) where removed_at is null;
create index company_trainers_user_idx on public.company_trainers (user_id) where removed_at is null;
alter table public.company_trainers enable row level security;
create policy "admins read trainers" on public.company_trainers for select to authenticated using (private.is_admin(company_id));
create policy "trainers read their own link" on public.company_trainers for select to authenticated using (user_id = auth.uid() and removed_at is null);
revoke all on public.company_trainers from anon, authenticated;
grant select on public.company_trainers to authenticated;   -- changes only through the functions below

-- Which people each trainer may see. An access list, not a record: admins add and take people off it.
create table public.company_trainer_people (
  company_id  uuid not null,
  trainer_id  uuid not null,
  person_id   uuid not null,
  added_by    uuid references auth.users (id),
  added_at    timestamptz not null default now(),
  primary key (trainer_id, person_id),
  foreign key (company_id, trainer_id) references public.company_trainers (company_id, id) on delete cascade,
  foreign key (company_id, person_id) references public.people (company_id, id)
);
alter table public.company_trainer_people enable row level security;
create policy "admins read trainer people" on public.company_trainer_people for select to authenticated using (private.is_admin(company_id));
create policy "admins add trainer people" on public.company_trainer_people for insert to authenticated with check (private.is_admin(company_id));
create policy "admins remove trainer people" on public.company_trainer_people for delete to authenticated using (private.is_admin(company_id));
revoke all on public.company_trainer_people from anon, authenticated;
grant select, insert, delete on public.company_trainer_people to authenticated;
create trigger stamp_actor before insert on public.company_trainer_people for each row execute function private.stamp_actor('added_by');

-- The signed-in user's live trainer link for a company, or null.
create or replace function private.my_trainer_id(co uuid)
returns uuid language sql stable security definer set search_path = '' as $$
  select t.id from public.company_trainers t where t.company_id = co and t.user_id = auth.uid() and t.removed_at is null limit 1;
$$;
-- Whether the signed-in trainer was given this person (and the person is still active).
create or replace function private.trainer_sees(co uuid, person uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.company_trainer_people tp
    join public.company_trainers t on t.id = tp.trainer_id and t.company_id = tp.company_id
    join public.people p on p.id = tp.person_id and p.company_id = tp.company_id
    where tp.company_id = co and tp.person_id = person and t.user_id = auth.uid() and t.removed_at is null and p.deactivated_at is null);
$$;
revoke execute on function private.my_trainer_id(uuid), private.trainer_sees(uuid, uuid) from public, anon;
grant execute on function private.my_trainer_id(uuid), private.trainer_sees(uuid, uuid) to authenticated;

-- Invite and remove ---------------------------------------------------------------------------------------------------
create or replace function public.invite_trainer(co uuid, email text, name text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  if not private.is_admin(co) then raise exception 'Only owners and admins can invite a trainer.' using errcode = '42501'; end if;
  insert into public.company_trainers (company_id, email, name, invited_by)
  values (co, lower(btrim(email)), btrim(name), auth.uid()) returning id into new_id;
  return new_id;
exception when unique_violation then
  raise exception 'That trainer is already invited.' using errcode = '23505';
end;
$$;
create or replace function public.remove_trainer(trainer uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare co uuid;
begin
  select company_id into co from public.company_trainers where id = trainer;
  if co is null or not private.is_admin(co) then raise exception 'Trainer not found.' using errcode = '42501'; end if;
  update public.company_trainers set removed_at = now(), removed_by = auth.uid() where id = trainer and removed_at is null;
  delete from public.company_trainer_people where trainer_id = trainer;
end;
$$;
revoke all on function public.invite_trainer(uuid, text, text), public.remove_trainer(uuid) from public, anon;
grant execute on function public.invite_trainer(uuid, text, text), public.remove_trainer(uuid) to authenticated;

-- Invites are claimed on sign-in: staff invites (as in 0024) and now trainer invites, email-code accounts only.
create or replace function public.accept_invites()
returns int language plpgsql security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  addr text;
  inv record;
  n int := 0;
  t int := 0;
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
  return n + t;
end;
$$;

-- What a trainer sees: their companies and the people they were given. Names and job titles only.
create or replace function public.trainer_roster()
returns table (company_id uuid, company_name text, trainer_id uuid, person_id uuid, full_name text, job_title text)
language sql stable security definer set search_path = '' as $$
  select c.id, c.name, t.id, p.id, p.full_name, coalesce(r.name, '')
  from public.company_trainers t
  join public.companies c on c.id = t.company_id
  left join public.company_trainer_people tp on tp.trainer_id = t.id and tp.company_id = t.company_id
  left join public.people p on p.id = tp.person_id and p.company_id = tp.company_id and p.deactivated_at is null
  left join public.roles r on r.id = p.role_id and r.company_id = p.company_id
  where t.user_id = auth.uid() and t.removed_at is null
  order by c.name, p.full_name;
$$;
revoke all on function public.trainer_roster() from public, anon;
grant execute on function public.trainer_roster() to authenticated;

-- Submissions ---------------------------------------------------------------------------------------------------------
create table public.cert_submissions (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null,
  trainer_id      uuid not null,
  person_id       uuid not null,
  client_id       uuid not null,
  cert_type       text not null check (cert_type ~ '^[a-z0-9_]{2,30}$'),
  custom_name     text not null default '' check (length(custom_name) <= 100 and (cert_type <> 'custom' or length(trim(custom_name)) > 0)),
  issued_on       date,
  expires_on      date check (expires_on is null or issued_on is null or expires_on >= issued_on),
  note            text not null default '' check (length(note) <= 300),
  card_path       text unique check (card_path is null or private.file_company(card_path) = company_id),
  submitted_by    uuid references auth.users (id),
  submitted_at    timestamptz not null default now(),
  status          text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  decided_by      uuid references auth.users (id),
  decided_at      timestamptz,
  decline_reason  text not null default '' check (status <> 'declined' or length(trim(decline_reason)) > 0),
  cert_id         uuid references public.person_certs (id),
  unique (trainer_id, client_id),
  foreign key (company_id, trainer_id) references public.company_trainers (company_id, id),
  foreign key (company_id, person_id) references public.people (company_id, id)
);
create index cert_submissions_company_idx on public.cert_submissions (company_id, status, submitted_at desc);
alter table public.cert_submissions enable row level security;
create policy "admins read submissions" on public.cert_submissions for select to authenticated using (private.is_admin(company_id));
create policy "trainers read their own submissions" on public.cert_submissions for select to authenticated
  using (trainer_id = private.my_trainer_id(company_id));
revoke all on public.cert_submissions from anon, authenticated;
grant select on public.cert_submissions to authenticated;   -- written only through the functions below

-- Send a card in. Idempotent on the phone's client_id, so a retry after a dropped connection doesn't send it twice.
create or replace function public.submit_cert(c jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  co uuid := (c->>'company_id')::uuid;
  person uuid := (c->>'person_id')::uuid;
  cl uuid := (c->>'client_id')::uuid;
  tr uuid := private.my_trainer_id(co);
  path text := nullif(c->>'card_path', '');
  existing uuid;
  new_id uuid;
begin
  if tr is null or not private.trainer_sees(co, person) then
    raise exception 'You can only send cards for people this company gave you.' using errcode = '42501';
  end if;
  select id into existing from public.cert_submissions where trainer_id = tr and client_id = cl;
  if existing is not null then return existing; end if;
  if path is not null and (path not like co::text || '/trainer/' || tr::text || '/%'
     or not exists (select 1 from storage.objects o where o.bucket_id = 'person-certs' and o.name = path)) then
    raise exception 'The card photo is missing. Try sending it again.' using errcode = '22023';
  end if;
  insert into public.cert_submissions (company_id, trainer_id, person_id, client_id, cert_type, custom_name, issued_on, expires_on, note, card_path, submitted_by)
  values (co, tr, person, cl, c->>'cert_type', case when c->>'cert_type' = 'custom' then btrim(coalesce(c->>'custom_name', '')) else '' end,
          (c->>'issued_on')::date, (c->>'expires_on')::date, btrim(coalesce(c->>'note', '')), path, auth.uid())
  returning id into new_id;
  return new_id;
end;
$$;
revoke all on function public.submit_cert(jsonb) from public, anon;
grant execute on function public.submit_cert(jsonb) to authenticated;

-- Approve (adds the training card) or decline (with a reason). Once.
create or replace function public.decide_cert_submission(submission uuid, approve boolean, reason text default '')
returns void language plpgsql security definer set search_path = '' as $$
declare
  s public.cert_submissions;
  trainer_name text;
  new_cert uuid;
begin
  select * into s from public.cert_submissions where id = submission for update;
  if s.id is null or not private.is_admin(s.company_id) then raise exception 'Card not found.' using errcode = '42501'; end if;
  if s.status <> 'pending' then raise exception 'This card was already reviewed.' using errcode = '23514'; end if;
  if approve then
    select name into trainer_name from public.company_trainers where id = s.trainer_id;
    insert into public.person_certs (company_id, person_id, cert_type, custom_name, issued_on, expires_on, note, card_path, entered_by)
    values (s.company_id, s.person_id, s.cert_type, s.custom_name, s.issued_on, s.expires_on,
            left(btrim(concat_ws(' ', nullif(s.note, ''), '(Sent by trainer ' || trainer_name || ')')), 300), s.card_path, auth.uid())
    returning id into new_cert;
    update public.cert_submissions set status = 'approved', decided_by = auth.uid(), decided_at = now(), cert_id = new_cert where id = s.id;
  else
    if coalesce(btrim(reason), '') = '' then raise exception 'Say why the card is declined.' using errcode = '23514'; end if;
    update public.cert_submissions set status = 'declined', decided_by = auth.uid(), decided_at = now(), decline_reason = btrim(reason) where id = s.id;
  end if;
end;
$$;
revoke all on function public.decide_cert_submission(uuid, boolean, text) from public, anon;
grant execute on function public.decide_cert_submission(uuid, boolean, text) to authenticated;

-- Card photos from trainers: only into their own folder at a company that gave them people. Admins read them through
-- the existing "card photos: admins read" policy. No update or delete.
create policy "card photos: trainers add to their own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'person-certs' and split_part(name, '/', 2) = 'trainer'
              and split_part(name, '/', 3) = private.my_trainer_id(private.file_company(name))::text);
