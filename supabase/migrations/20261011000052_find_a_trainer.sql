-- Find a trainer: a company says it's looking for a trainer (for which trainings), and trainers on an active plan
-- (migration 0050) can find those companies and ask to connect. Additive: two tables, functions, triggers.
--
-- - Opt-in only. A company is listed only while an owner or admin has turned "We're looking for a trainer" on. It
--   shows its name, industry, ZIP, roughly how many people it has, the trainings it wants and its note. Nothing else.
-- - A trainer asks to connect with a short message. The company sees the request and decides; accepting invites that
--   trainer exactly like Admin -> Training -> Trainers (then the company picks which people they see).
-- - One open request per trainer per company; at most 30 new requests a day per trainer.

create table public.company_trainer_listings (
  company_id  uuid primary key references public.companies (id) on delete cascade,
  looking     boolean not null default false,
  trainings   text[] not null default '{}' check (cardinality(trainings) <= 30),
  note        text not null default '' check (char_length(note) <= 300),
  updated_by  uuid references auth.users (id),
  updated_at  timestamptz not null default now()
);
alter table public.company_trainer_listings enable row level security;
create policy "admins read their listing" on public.company_trainer_listings for select to authenticated using (private.is_admin(company_id));
revoke all on public.company_trainer_listings from anon, authenticated;
grant select on public.company_trainer_listings to authenticated;
create trigger block_when_paused before insert or update on public.company_trainer_listings for each row execute function private.block_when_paused();

create table public.trainer_connect_requests (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  email         text not null,
  name          text not null check (char_length(btrim(name)) between 1 and 120),
  message       text not null default '' check (char_length(message) <= 500),
  requested_at  timestamptz not null default now(),
  answered_at   timestamptz,
  accepted      boolean,
  answered_by   uuid references auth.users (id)
);
create unique index trainer_connect_one_open on public.trainer_connect_requests (company_id, user_id) where answered_at is null;
alter table public.trainer_connect_requests enable row level security;
create policy "admins read requests to them" on public.trainer_connect_requests for select to authenticated using (private.is_admin(company_id));
create policy "trainers read their own requests" on public.trainer_connect_requests for select to authenticated using (user_id = auth.uid());
revoke all on public.trainer_connect_requests from anon, authenticated;
grant select on public.trainer_connect_requests to authenticated;
create trigger block_when_paused before insert or update on public.trainer_connect_requests for each row execute function private.block_when_paused();

create or replace function public.set_trainer_listing(co uuid, looking boolean, trainings text[], note text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin(co) then raise exception 'Only owners and admins can do this.' using errcode = '42501'; end if;
  if exists (select 1 from unnest(coalesce(trainings, '{}')) t where t !~ '^[a-z0-9_]{2,30}$') then raise exception 'Unknown training.' using errcode = '22023'; end if;
  insert into public.company_trainer_listings (company_id, looking, trainings, note, updated_by)
  values (co, looking, coalesce(trainings, '{}'), left(btrim(coalesce(note, '')), 300), auth.uid())
  on conflict (company_id) do update set looking = excluded.looking, trainings = excluded.trainings, note = excluded.note, updated_by = auth.uid(), updated_at = now();
end;
$$;

-- Trainers on an active plan: companies looking for a trainer, minus ones this trainer already works with.
create or replace function public.find_companies_for_training()
returns table (company_id uuid, name text, industry text, zip text, size text, trainings text[], note text, listed_since timestamptz, requested boolean)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.partner_active('trainer') then
    raise exception 'Finding companies is part of the trainer plan. Your trial or free months have ended.' using errcode = '42501';
  end if;
  return query
  select c.id, c.name, c.industry, coalesce(c.zip, ''),
    case when n <= 10 then '1-10 people' when n <= 25 then '11-25 people' when n <= 100 then '26-100 people' else 'over 100 people' end,
    l.trainings, l.note, l.updated_at,
    exists (select 1 from public.trainer_connect_requests r where r.company_id = c.id and r.user_id = auth.uid() and r.answered_at is null)
  from public.company_trainer_listings l
  join public.companies c on c.id = l.company_id
  cross join lateral (select count(*)::int as n from public.people p where p.company_id = c.id and p.active) cnt
  where l.looking and not private.company_paused(c.id)
    and not exists (select 1 from public.company_trainers t where t.company_id = c.id and t.user_id = auth.uid() and t.removed_at is null)
  order by l.updated_at desc
  limit 500;
end;
$$;

create or replace function public.request_trainer_connect(co uuid, name text, message text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); addr text; new_id uuid;
begin
  if not private.partner_active('trainer') then raise exception 'Asking to connect is part of the trainer plan.' using errcode = '42501'; end if;
  select lower(u.email) into addr from auth.users u where u.id = me and u.email_confirmed_at is not null;
  if addr is null then raise exception 'Sign in with your email first.' using errcode = '42501'; end if;
  if not exists (select 1 from public.company_trainer_listings l where l.company_id = co and l.looking) then
    raise exception 'That company isn''t looking for a trainer right now.' using errcode = '22023';
  end if;
  if (select count(*) from public.trainer_connect_requests r where r.user_id = me and r.requested_at > now() - interval '1 day') >= 30 then
    raise exception 'You''ve sent 30 requests today. Try again tomorrow.' using errcode = '54000';
  end if;
  insert into public.trainer_connect_requests (company_id, user_id, email, name, message) values (co, me, addr, btrim(name), left(btrim(coalesce(message, '')), 500))
  returning id into new_id;
  return new_id;
exception when unique_violation then
  raise exception 'You already asked this company. They''ll see your request.' using errcode = '23505';
end;
$$;

-- The company answers. Accepting invites the trainer (same as Admin -> Training -> Trainers).
create or replace function public.answer_trainer_connect(request uuid, accept boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare r public.trainer_connect_requests;
begin
  select * into r from public.trainer_connect_requests where id = request and answered_at is null for update;
  if r.id is null or not private.is_admin(r.company_id) then raise exception 'Request not found.' using errcode = '42501'; end if;
  update public.trainer_connect_requests set answered_at = now(), accepted = accept, answered_by = auth.uid() where id = request;
  if accept and not exists (select 1 from public.company_trainers t where t.company_id = r.company_id and t.email = r.email and t.removed_at is null) then
    insert into public.company_trainers (company_id, email, name, user_id, invited_by, accepted_at)
    values (r.company_id, r.email, r.name, r.user_id, auth.uid(), now());
  end if;
end;
$$;

revoke all on function public.set_trainer_listing(uuid, boolean, text[], text), public.find_companies_for_training(),
  public.request_trainer_connect(uuid, text, text), public.answer_trainer_connect(uuid, boolean) from public, anon;
grant execute on function public.set_trainer_listing(uuid, boolean, text[], text), public.find_companies_for_training(),
  public.request_trainer_connect(uuid, text, text), public.answer_trainer_connect(uuid, boolean) to authenticated;
