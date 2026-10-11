-- Plans for trainers and insurance partners, with free months earned for every company they bring in. Additive:
-- two tables, functions, one trigger. Prices live in src/core/plans.ts; payment is outside the app for now.
--
-- - Each trainer or partner account has its own plan per kind (trainer, insurance): a 30-day trial when it first
--   opens the portal, then paid or complimentary (set by the operator).
-- - Free months: when a company that signed up with a partner's invite link starts paying, that partner earns 6 free
--   months (once per company). Months stack. Counting paid companies, not sign-ups, keeps fake sign-ups from earning
--   anything.
-- - Nothing the partner already sees is taken away by its plan: client lists, summaries and cards stay. Only the paid
--   extras (finding companies that need a trainer, migration 0052) check the plan.

create table public.partner_accounts (
  user_id      uuid not null references auth.users (id) on delete cascade,
  kind         text not null check (kind in ('trainer', 'insurance')),
  plan         text not null default 'trial' check (plan in ('trial', 'paid', 'comp')),
  trial_ends   date not null default (current_date + 30),
  free_until   date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (user_id, kind)
);
alter table public.partner_accounts enable row level security;
create policy "partners read their own plan" on public.partner_accounts for select to authenticated using (user_id = auth.uid());
revoke all on public.partner_accounts from anon, authenticated;
grant select on public.partner_accounts to authenticated;   -- written only by the functions below

create table public.partner_credits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  kind        text not null check (kind in ('trainer', 'insurance')),
  company_id  uuid not null references public.companies (id) on delete cascade,
  months      int not null check (months between 1 and 24),
  granted_at  timestamptz not null default now(),
  unique (user_id, kind, company_id)
);
alter table public.partner_credits enable row level security;
create policy "partners read their own credits" on public.partner_credits for select to authenticated using (user_id = auth.uid());
revoke all on public.partner_credits from anon, authenticated;
grant select on public.partner_credits to authenticated;
create trigger block_when_paused before insert or update on public.partner_credits for each row execute function private.block_when_paused();

-- The portal opens the account the first time (a 30-day trial). Returns the account.
create or replace function public.open_partner_account(kind text)
returns public.partner_accounts language plpgsql security definer set search_path = '' as $$
declare a public.partner_accounts;
begin
  if auth.uid() is null then raise exception 'Sign in first.' using errcode = '42501'; end if;
  if kind not in ('trainer', 'insurance') then raise exception 'Unknown kind.' using errcode = '22023'; end if;
  insert into public.partner_accounts (user_id, kind) values (auth.uid(), open_partner_account.kind) on conflict do nothing;
  select * into a from public.partner_accounts p where p.user_id = auth.uid() and p.kind = open_partner_account.kind;
  return a;
end;
$$;

-- Whether this account's paid extras are on: paid, complimentary, in its trial, or inside earned free months.
create or replace function private.partner_active(kind text)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select a.plan in ('paid', 'comp') or a.trial_ends >= current_date or coalesce(a.free_until >= current_date, false)
                   from public.partner_accounts a where a.user_id = auth.uid() and a.kind = partner_active.kind), false);
$$;
revoke all on function private.partner_active(text) from public, anon;
grant execute on function private.partner_active(text) to authenticated;

-- A referred company's first paid month earns its partner 6 free months (once per company).
create or replace function private.credit_referrer()
returns trigger language plpgsql security definer set search_path = '' as $$
declare r record; k text; added int;
begin
  if new.plan <> 'paid' or old.plan = 'paid' then return new; end if;
  select c.user_id, c.kind into r from public.company_referrals cr join public.partner_referral_codes c on c.code = cr.code where cr.company_id = new.company_id;
  if r.user_id is null then return new; end if;
  k := case when r.kind = 'training' then 'trainer' else 'insurance' end;
  insert into public.partner_credits (user_id, kind, company_id, months) values (r.user_id, k, new.company_id, 6) on conflict do nothing;
  get diagnostics added = row_count;
  if added = 0 then return new; end if;
  insert into public.partner_accounts (user_id, kind) values (r.user_id, k) on conflict do nothing;
  update public.partner_accounts
     set free_until = (greatest(coalesce(free_until, current_date), current_date) + interval '6 months')::date, updated_at = now()
   where user_id = r.user_id and kind = k;
  return new;
end;
$$;
create trigger credit_referrer after update of plan on public.company_accounts for each row execute function private.credit_referrer();

-- Operator: every partner account, and setting its plan.
create or replace function public.platform_partner_accounts()
returns table (user_id uuid, email text, kind text, plan text, trial_ends date, free_until date, credits int, clients int, created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  return query
  select a.user_id, lower(u.email)::text, a.kind, a.plan, a.trial_ends, a.free_until,
    (select count(*)::int from public.partner_credits c where c.user_id = a.user_id and c.kind = a.kind),
    case when a.kind = 'trainer' then (select count(*)::int from public.company_trainers t where t.user_id = a.user_id and t.removed_at is null)
         else (select count(*)::int from public.company_partners p where p.user_id = a.user_id and p.removed_at is null) end,
    a.created_at
  from public.partner_accounts a join auth.users u on u.id = a.user_id
  order by a.created_at desc;
end;
$$;
create or replace function public.platform_set_partner_plan(target uuid, kind text, new_plan text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  if new_plan not in ('trial', 'paid', 'comp') then raise exception 'Unknown plan.' using errcode = '22023'; end if;
  update public.partner_accounts a set plan = new_plan, updated_at = now() where a.user_id = target and a.kind = platform_set_partner_plan.kind;
  if not found then raise exception 'No such partner account.' using errcode = '22023'; end if;
  perform private.platform_log('set_partner_plan', null, jsonb_build_object('user_id', target, 'kind', kind, 'plan', new_plan));
end;
$$;

revoke all on function public.open_partner_account(text), public.platform_partner_accounts(), public.platform_set_partner_plan(uuid, text, text) from public, anon;
grant execute on function public.open_partner_account(text), public.platform_partner_accounts(), public.platform_set_partner_plan(uuid, text, text) to authenticated;
