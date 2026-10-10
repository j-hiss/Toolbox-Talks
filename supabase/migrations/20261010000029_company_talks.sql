-- "Your own talks": talks a company writes itself (src/core/ownTalks.ts). Additive: one new table.
--
-- - Versions, never edits: each save is a new row with the next version number; the latest version is given from then
--   on. Retiring a talk is a new version marked retired. Saved records keep the exact text read, as always.
-- - Staff read them (presenters give them); owners and admins write. Who saved each version is stamped.
-- - Spanish stays "draft" until someone who reads Spanish marks it reviewed and is named on that version.

create table public.company_talks (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  talk_key        text not null check (talk_key ~ '^own-[a-z0-9]{8,32}$'),
  version         int not null check (version >= 1),
  retired         boolean not null default false,
  title           text not null check (char_length(btrim(title)) between 1 and 120),
  minutes         int not null default 5 check (minutes between 1 and 30),
  code            text not null default '' check (char_length(code) <= 60),
  content         jsonb not null check (jsonb_typeof(content) = 'object' and jsonb_typeof(content->'en') = 'object' and pg_column_size(content) <= 65536),
  es_status       text not null default 'none' check (es_status in ('none', 'draft', 'reviewed')),
  es_reviewed_by  text not null default '' check (char_length(es_reviewed_by) <= 120 and (es_status <> 'reviewed' or char_length(btrim(es_reviewed_by)) > 0)),
  based_on        text check (based_on is null or char_length(based_on) <= 60),
  created_by      uuid references auth.users (id),
  created_at      timestamptz not null default now(),
  unique (company_id, talk_key, version)
);
create index company_talks_company_idx on public.company_talks (company_id, talk_key, version desc);
alter table public.company_talks enable row level security;
create policy "staff read company talks" on public.company_talks for select to authenticated using (private.is_member(company_id));
create policy "admins add talk versions" on public.company_talks for insert to authenticated with check (private.is_admin(company_id));
revoke all on public.company_talks from anon, authenticated;
grant select, insert on public.company_talks to authenticated;   -- never edited or deleted
create trigger stamp_actor before insert on public.company_talks for each row execute function private.stamp_actor('created_by');

-- Versions go 1, 2, 3... per talk, with no gaps or repeats, and a retired talk stays retired.
create or replace function private.next_talk_version()
returns trigger language plpgsql set search_path = '' as $$
declare last int; was_retired boolean;
begin
  select version, retired into last, was_retired from public.company_talks
  where company_id = new.company_id and talk_key = new.talk_key order by version desc limit 1;
  if new.version <> coalesce(last, 0) + 1 then
    raise exception 'Someone else changed this talk. Reload and try again.' using errcode = '40001';
  end if;
  if was_retired then
    raise exception 'This talk was retired. Write a new one instead.' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger next_talk_version before insert on public.company_talks for each row execute function private.next_talk_version();
