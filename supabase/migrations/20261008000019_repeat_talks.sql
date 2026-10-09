-- Repeat talks (Admin → Plan): a talk the company wants back every 3, 6 or 12 months. Additive only.
--
-- * company_repeats: one row per change, per talk, starting on a Monday. every_months 0 = stop repeating from then.
--   Like talk lists and cadences, a row is kept once its week starts, so weeks already planned (and given) keep
--   their talks. Only a change that starts after today can be added, replaced or removed.
-- * The plan builder (src/core/plan.ts) places each repeat at least once in every block of its interval.

create table public.company_repeats (
  company_id    uuid not null references public.companies (id) on delete cascade,
  talk_id       text not null check (length(talk_id) between 1 and 80),
  from_week     date not null check (extract(isodow from from_week) = 1),   -- a Monday
  every_months  int not null check (every_months in (0, 3, 6, 12)),
  set_by        uuid not null default auth.uid() references auth.users (id),
  set_at        timestamptz not null default now(),
  primary key (company_id, talk_id, from_week)
);

alter table public.company_repeats enable row level security;
create policy "members read" on public.company_repeats for select to authenticated using (private.is_member(company_id));
create policy "admins write" on public.company_repeats for all to authenticated
  using (private.is_admin(company_id)) with check (private.is_admin(company_id));
revoke all on public.company_repeats from anon, authenticated;
grant select, insert, update, delete on public.company_repeats to authenticated;

create or replace function private.guard_repeat()
returns trigger language plpgsql security definer set search_path = '' as $$
declare wk date := coalesce(new.from_week, old.from_week);
begin
  if wk <= current_date or (tg_op = 'UPDATE' and old.from_week <= current_date) then
    raise exception 'A repeat has to start after today (%), so weeks already planned keep their talks.', wk using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$$;
create trigger company_repeats_lock before insert or update or delete on public.company_repeats
  for each row execute function private.guard_repeat();
