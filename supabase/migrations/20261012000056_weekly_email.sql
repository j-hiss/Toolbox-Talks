-- Weekly email to the office: Monday morning, owners, admins and office get last week's summary (teams that missed,
-- makeups running out, training cards, open issues, crew reports). Sent by the weekly-digest server function
-- (supabase/functions/weekly-digest), started by a weekly schedule set up once per project (its README).
-- Additive: two tables, one function.
--
-- - Everyone who gets it can turn it off for themselves, per company (Admin → Company → Weekly email; office: Records →
--   Crew reports). A paused company gets no email.
-- - One email per company per week: the send log's unique key stops a second run from sending again.
-- - The send log keeps how many people it went to and whether it worked, never the addresses.

create table public.digest_optouts (
  company_id  uuid not null references public.companies (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (company_id, user_id)
);
alter table public.digest_optouts enable row level security;
create policy "people read their own choice" on public.digest_optouts for select to authenticated using (user_id = auth.uid());
revoke all on public.digest_optouts from anon, authenticated;
grant select on public.digest_optouts to authenticated;
create trigger block_when_paused before insert or update on public.digest_optouts for each row execute function private.block_when_paused();

create table public.digest_log (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies (id) on delete cascade,
  week_key    date not null,
  sent_at     timestamptz not null default now(),
  recipients  int not null default 0,
  status      text not null check (status in ('sent', 'skipped', 'failed')),
  detail      text not null default '' check (char_length(detail) <= 500),
  unique (company_id, week_key)
);
alter table public.digest_log enable row level security;
create policy "admins read the send log" on public.digest_log for select to authenticated using (private.is_admin(company_id));
revoke all on public.digest_log from anon, authenticated;
grant select on public.digest_log to authenticated;   -- written only by the server function (service key)
create trigger block_when_paused before insert or update on public.digest_log for each row execute function private.block_when_paused();   -- a paused company gets no email

-- Turn my weekly email on or off for one company. Owners, admins and office only (the people it goes to).
create or replace function public.set_weekly_email(co uuid, wanted boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not coalesce(private.can_report(co), false) then raise exception 'The weekly email goes to owners, admins and office.' using errcode = '42501'; end if;
  if wanted then delete from public.digest_optouts where company_id = co and user_id = auth.uid();
  else insert into public.digest_optouts (company_id, user_id) values (co, auth.uid()) on conflict do nothing; end if;
end;
$$;
revoke all on function public.set_weekly_email(uuid, boolean) from public, anon;
grant execute on function public.set_weekly_email(uuid, boolean) to authenticated;

-- Who gets this company's email: owners, admins and office who haven't turned it off, with a confirmed address.
-- Only the service key (the server function) can call it.
create or replace function public.digest_recipients(co uuid)
returns table (email text) language sql stable security definer set search_path = '' as $$
  select distinct lower(u.email) from public.company_members m join auth.users u on u.id = m.user_id
  where m.company_id = co and m.access in ('owner', 'admin', 'office') and u.email is not null and u.email_confirmed_at is not null
    and not exists (select 1 from public.digest_optouts o where o.company_id = co and o.user_id = m.user_id);
$$;
revoke all on function public.digest_recipients(uuid) from public, anon, authenticated;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.digest_recipients(uuid) to service_role;
    grant select, insert on public.digest_log to service_role;
  end if;
end $$;
