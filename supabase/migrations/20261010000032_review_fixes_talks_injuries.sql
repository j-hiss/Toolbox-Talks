-- Fixes from the independent review of own talks and the injury log (2026-10-10). Additive: constraints and
-- functions replaced, no data changed.
--
-- 1. A company talk version's time is the database's clock (a client could backdate it and reorder the list).
-- 2. Company talk content has the shape every talk screen reads (title, hook, ask as text; sections as a list), so a
--    hand-made row can't break talk screens for the whole company.
-- 3. Days away plus days restricted stop at 180 together (29 CFR 1904.7(b)(3)(vii) lets counting stop once the
--    combined total reaches 180), so the 300A totals can't be inflated.
-- 4. An injury date can't be in the future.

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
  new.created_at := now();
  return new;
end;
$$;

create or replace function private.valid_talk_text(t jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select jsonb_typeof(t) = 'object'
    and jsonb_typeof(t->'title') = 'string' and jsonb_typeof(t->'hook') = 'string' and jsonb_typeof(t->'ask') = 'string'
    and jsonb_typeof(t->'sections') = 'array'
    and (select coalesce(bool_and(jsonb_typeof(s) = 'object' and jsonb_typeof(s->'heading') = 'string' and jsonb_typeof(s->'items') = 'array'
           and (select coalesce(bool_and(jsonb_typeof(i) = 'string'), true) from jsonb_array_elements(s->'items') i)), true)
         from jsonb_array_elements(t->'sections') s);
$$;
alter table public.company_talks add constraint company_talks_content_shape
  check (private.valid_talk_text(content->'en') and (content->'es' is null or private.valid_talk_text(content->'es')));

alter table public.injury_cases add constraint injury_cases_days_combined check (days_away + days_restricted <= 180);

create or replace function private.injury_date_not_future()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.injury_date > current_date + 1 then -- a day of slack for time zones
    raise exception 'The date can''t be in the future.' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger injury_date_not_future before insert on public.injury_cases for each row execute function private.injury_date_not_future();
grant execute on function private.valid_talk_text(jsonb) to authenticated;
