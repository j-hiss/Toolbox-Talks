-- The talks a company picks for its plan (Admin → Talks). Additive: a new table; no list = the industry's talks
-- plus the Every-job set, exactly as before (src/core/plan.ts talksInPlan).
--
-- A list starts on a Monday and stays in effect until a later list starts. Lists are kept, never rewritten once
-- their week has begun, so a past week always keeps the talk it was planned with (makeups and reports depend on
-- that). A list that hasn't started yet can be replaced or removed. The database enforces that, not just the app.

create table public.company_talk_lists (
  company_id  uuid not null references public.companies (id) on delete cascade,
  from_week   date not null check (extract(isodow from from_week) = 1),   -- a Monday
  talk_ids    text[] not null check (cardinality(talk_ids) between 1 and 500),
  set_by      uuid not null default auth.uid() references auth.users (id),
  set_at      timestamptz not null default now(),
  primary key (company_id, from_week)
);

alter table public.company_talk_lists enable row level security;
create policy "members read" on public.company_talk_lists for select to authenticated using (private.is_member(company_id));
create policy "admins write" on public.company_talk_lists for all to authenticated
  using (private.is_admin(company_id)) with check (private.is_admin(company_id));
revoke all on public.company_talk_lists from anon, authenticated;
grant select, insert, update, delete on public.company_talk_lists to authenticated;

-- Only lists that start after this week can be added, changed or removed.
create or replace function private.guard_talk_list()
returns trigger language plpgsql security definer set search_path = '' as $$
declare wk date := coalesce(new.from_week, old.from_week);
begin
  if wk <= current_date then
    raise exception 'A talk list has to start next week or later (%), so weeks already planned keep their talks.', wk using errcode = 'P0001';
  end if;
  if tg_op = 'UPDATE' and old.from_week <> new.from_week and old.from_week <= current_date then
    raise exception 'A talk list that has started can''t be moved.' using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$$;
create trigger company_talk_lists_lock before insert or update or delete on public.company_talk_lists
  for each row execute function private.guard_talk_list();
