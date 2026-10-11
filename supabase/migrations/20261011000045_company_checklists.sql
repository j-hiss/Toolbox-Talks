-- "Your own checklists": inspection checklists a company writes itself, run exactly like the app's (src/core/
-- ownChecklists.ts, src/core/inspections.ts). Additive: one new table, two functions, two triggers.
--
-- - Versions, never edits, like company talks (0029): each save is a new row with the next version; retiring is a
--   version marked retired. Saved inspections keep the exact items that were checked, as always.
-- - Staff read them (presenters run them); owners and admins write. Who saved each version is stamped.
-- - Items: 1 to 60, each { id, text, rule? }, ids unique within the checklist. How often: before each use, each shift,
--   daily or monthly (same as the app's checklists, so "due" and reminders work the same way).

create table public.company_checklists (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  checklist_key  text not null check (checklist_key ~ '^own-[a-z0-9]{8,32}$'),
  version        int not null check (version >= 1),
  retired        boolean not null default false,
  title          text not null check (char_length(btrim(title)) between 1 and 120),
  how_often      text not null check (how_often in ('each_use', 'each_shift', 'daily', 'monthly')),
  rule           text not null default '' check (char_length(rule) <= 300),
  items          jsonb not null,
  created_by     uuid references auth.users (id),
  created_at     timestamptz not null default now(),
  unique (company_id, checklist_key, version)
);
create index company_checklists_company_idx on public.company_checklists (company_id, checklist_key, version desc);

create or replace function private.valid_checklist_items(items jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select coalesce(jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 60 and pg_column_size(items) <= 65536
    and (select bool_and(jsonb_typeof(i) = 'object'
           and jsonb_typeof(i->'id') = 'string' and (i->>'id') ~ '^[a-z0-9-]{1,40}$'
           and jsonb_typeof(i->'text') = 'string' and char_length(btrim(i->>'text')) between 1 and 300
           and (i->'rule' is null or (jsonb_typeof(i->'rule') = 'string' and char_length(i->>'rule') <= 120)))
         from jsonb_array_elements(items) i)
    and (select count(distinct i->>'id') from jsonb_array_elements(items) i) = jsonb_array_length(items), false);
$$;
alter table public.company_checklists add constraint company_checklists_items check (private.valid_checklist_items(items));

alter table public.company_checklists enable row level security;
create policy "staff read company checklists" on public.company_checklists for select to authenticated using (private.is_member(company_id));
create policy "admins add checklist versions" on public.company_checklists for insert to authenticated with check (private.is_admin(company_id));
revoke all on public.company_checklists from anon, authenticated;
grant select, insert on public.company_checklists to authenticated;   -- never edited or deleted
create trigger stamp_actor before insert on public.company_checklists for each row execute function private.stamp_actor('created_by');
create trigger block_when_paused before insert or update on public.company_checklists for each row execute function private.block_when_paused();

-- Versions go 1, 2, 3... per checklist, with no gaps or repeats, and a retired checklist stays retired.
create or replace function private.next_checklist_version()
returns trigger language plpgsql set search_path = '' as $$
declare last int; was_retired boolean;
begin
  select version, retired into last, was_retired from public.company_checklists
  where company_id = new.company_id and checklist_key = new.checklist_key order by version desc limit 1;
  if new.version <> coalesce(last, 0) + 1 then
    raise exception 'Someone else changed this checklist. Reload and try again.' using errcode = '40001';
  end if;
  if was_retired then
    raise exception 'This checklist was retired. Make a new one instead.' using errcode = '23514';
  end if;
  new.created_at := now();
  return new;
end;
$$;
create trigger next_checklist_version before insert on public.company_checklists for each row execute function private.next_checklist_version();
