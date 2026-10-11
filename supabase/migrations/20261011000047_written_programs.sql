-- Written safety programs: a company fills in the app's program templates (src/content/programs.ts: hazard
-- communication, emergency action plan, fire prevention plan, bloodborne pathogens, silica, lockout/tagout,
-- respiratory protection). Additive: one new table, two functions, three triggers.
--
-- - Versions, never edits, like company checklists (0045): each save is a new row with the next version. A yearly
--   review with no changes is also a new version (review_only), so the record shows when it was looked at.
-- - Everyone in the company can read them (the rules say the written program is available to employees); owners and
--   admins write. Who saved each version is stamped.
-- - Answers: an object of { section id: text }, at most 60 sections, 4000 characters each. Which sections are
--   required is the template's business (src/core/programs.ts); the database checks the shape.

create table public.company_programs (
  id                uuid primary key default gen_random_uuid(),
  company_id        uuid not null references public.companies (id) on delete cascade,
  program_key       text not null check (program_key ~ '^[a-z0-9-]{2,40}$'),
  template_version  int not null check (template_version >= 1),
  version           int not null check (version >= 1),
  answers           jsonb not null,
  approved_name     text not null check (char_length(btrim(approved_name)) between 1 and 120),
  approved_title    text not null default '' check (char_length(approved_title) <= 120),
  review_only       boolean not null default false,
  note              text not null default '' check (char_length(note) <= 500),
  created_by        uuid references auth.users (id),
  created_at        timestamptz not null default now(),
  unique (company_id, program_key, version)
);
create index company_programs_company_idx on public.company_programs (company_id, program_key, version desc);

create or replace function private.valid_program_answers(a jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select case when a is null or jsonb_typeof(a) <> 'object' then false else
    pg_column_size(a) <= 262144
    and (select count(*) from jsonb_object_keys(a)) <= 60
    and coalesce((select bool_and(k ~ '^[a-z0-9-]{1,40}$' and jsonb_typeof(a->k) = 'string' and char_length(a->>k) <= 4000)
                  from jsonb_object_keys(a) k), true)
  end;
$$;
alter table public.company_programs add constraint company_programs_answers check (private.valid_program_answers(answers));

alter table public.company_programs enable row level security;
create policy "members read company programs" on public.company_programs for select to authenticated using (private.is_member(company_id));
create policy "admins add program versions" on public.company_programs for insert to authenticated with check (private.is_admin(company_id));
revoke all on public.company_programs from anon, authenticated;
grant select, insert on public.company_programs to authenticated;   -- never edited or deleted
create trigger stamp_actor before insert on public.company_programs for each row execute function private.stamp_actor('created_by');
create trigger block_when_paused before insert or update on public.company_programs for each row execute function private.block_when_paused();

-- Versions go 1, 2, 3... per program with no gaps or repeats; the time is the database's.
create or replace function private.next_program_version()
returns trigger language plpgsql set search_path = '' as $$
declare last int;
begin
  select version into last from public.company_programs
  where company_id = new.company_id and program_key = new.program_key order by version desc limit 1;
  if new.version <> coalesce(last, 0) + 1 then
    raise exception 'Someone else changed this program. Reload and try again.' using errcode = '40001';
  end if;
  new.created_at := now();
  return new;
end;
$$;
create trigger next_program_version before insert on public.company_programs for each row execute function private.next_program_version();
