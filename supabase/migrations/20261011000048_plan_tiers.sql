-- Plan sizes: Crew (up to 25 people), Company (up to 100) and Larger (up to 250), flat monthly prices kept outside the
-- app (src/core/plans.ts has the price list shown on screen). Additive: two columns, four functions, triggers.
--
-- - Only a paid account is held to its size. A trial, pilot or complimentary account has everything.
-- - Crew covers talks, signing, inspections, training cards, crew sign-in, reports, the safety profile and sending it
--   to an agent or trainer. Company and Larger add starting new OSHA log cases, written programs, the company's own
--   talks and its own checklists. Fair to a company that moves down: nothing it already has is locked. It can still
--   open, print, correct and review everything (a new version of an existing case, program, talk or checklist goes
--   through); only starting a new one waits for a larger plan.
-- - People: adding someone (or bringing someone back) past the plan's size is refused with a plain message. Nobody
--   already on the roster is ever removed or blocked.
-- - New companies get a 30-day trial when the operator hasn't set a trial length.

alter table public.company_accounts add column tier text not null default 'company' check (tier in ('crew', 'company', 'larger'));
update private.platform_settings set trial_days = 30 where trial_days is null;

-- What the account allows. Missing account (shouldn't happen) = allowed, so nothing breaks.
create or replace function private.plan_allows(co uuid, feature text)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select a.plan <> 'paid' or a.tier <> 'crew' or feature not in ('osha_log', 'programs', 'own_talks', 'own_checklists')
                   from public.company_accounts a where a.company_id = co), true);
$$;
revoke all on function private.plan_allows(uuid, text) from public, anon;
grant execute on function private.plan_allows(uuid, text) to authenticated;

create or replace function private.people_limit(co uuid)
returns int language sql stable security definer set search_path = '' as $$
  select case when a.plan <> 'paid' then null when a.tier = 'crew' then 25 when a.tier = 'company' then 100 else 250 end
  from public.company_accounts a where a.company_id = co;
$$;
revoke all on function private.people_limit(uuid) from public, anon;
grant execute on function private.people_limit(uuid) to authenticated;

-- Starting something new that the plan doesn't cover. Version 1 is "new"; later versions are corrections and reviews.
create or replace function private.require_plan_feature()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.version = 1 and not private.plan_allows(new.company_id, tg_argv[0]) then
    raise exception '%', case tg_argv[0]
      when 'osha_log' then 'Starting a new OSHA log case is on the Company plan. Cases you already have can still be corrected and printed.'
      when 'programs' then 'Written programs are on the Company plan. Programs you already have can still be reviewed, updated and printed.'
      when 'own_talks' then 'Your own talks are on the Company plan. Talks you already wrote can still be used and updated.'
      else 'Your own checklists are on the Company plan. Checklists you already made can still be run and updated.' end
      using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger require_plan_feature before insert on public.injury_cases for each row execute function private.require_plan_feature('osha_log');
create trigger require_plan_feature before insert on public.company_programs for each row execute function private.require_plan_feature('programs');
create trigger require_plan_feature before insert on public.company_talks for each row execute function private.require_plan_feature('own_talks');
create trigger require_plan_feature before insert on public.company_checklists for each row execute function private.require_plan_feature('own_checklists');

-- People past the plan's size. Counted at the moment someone is added or brought back.
create or replace function private.require_people_room()
returns trigger language plpgsql security definer set search_path = '' as $$
declare lim int; n int;
begin
  if not new.active or (tg_op = 'UPDATE' and old.active) then return new; end if;
  lim := private.people_limit(new.company_id);
  if lim is null then return new; end if;
  select count(*) into n from public.people where company_id = new.company_id and active and id <> new.id;
  if n >= lim then
    raise exception 'Your plan covers up to % people, and % are on the roster. Move to a larger plan to add more; nobody already on the roster is affected.', lim, n
      using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger require_people_room before insert or update of active on public.people for each row execute function private.require_people_room();

-- Operator: set the plan size (the console's plan screen).
create or replace function public.platform_set_tier(co uuid, new_tier text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  if new_tier not in ('crew', 'company', 'larger') then raise exception 'Unknown plan size.' using errcode = '22023'; end if;
  update public.company_accounts set tier = new_tier, updated_at = now() where company_id = co;
  perform private.platform_log('set_tier', co, jsonb_build_object('tier', new_tier));
end;
$$;
revoke all on function public.platform_set_tier(uuid, text) from public, anon;
grant execute on function public.platform_set_tier(uuid, text) to authenticated;

-- The console's company list gains the plan size (a new column means drop and create; same name, same access).
drop function public.platform_companies();
create or replace function public.platform_companies()
returns table (
  id uuid, name text, industry text, created_at timestamptz, plan text, tier text, trial_ends_at date, paused_at timestamptz, pause_reason text,
  closure_requested_at timestamptz, members int, people_active int, talks_total int, talks_30d int, last_talk_at timestamptz, inspections_total int
) language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_platform_admin();
  return query
  select c.id, c.name, c.industry, c.created_at, a.plan, a.tier, a.trial_ends_at, a.paused_at, a.pause_reason, a.closure_requested_at,
    (select count(*)::int from public.company_members m where m.company_id = c.id),
    (select count(*)::int from public.people p where p.company_id = c.id and p.active),
    (select count(*)::int from public.talk_records r where r.company_id = c.id),
    (select count(*)::int from public.talk_records r where r.company_id = c.id and r.held_at > now() - interval '30 days'),
    (select max(r.held_at) from public.talk_records r where r.company_id = c.id),
    (select count(*)::int from public.inspections i where i.company_id = c.id)
  from public.companies c join public.company_accounts a on a.company_id = c.id
  order by c.created_at desc;
end;
$$;
revoke all on function public.platform_companies() from public, anon;
grant execute on function public.platform_companies() to authenticated;
