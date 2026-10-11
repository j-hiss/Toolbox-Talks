-- PROPOSED, NOT APPLIED. Waits for Joe's go (CLAUDE.md: destructive changes are proposed first).
-- Makes each OSHA log (main log and each location from migration 0040) number its cases from 1 each year, instead of
-- one count shared by all of a company's logs. No data changes: existing case numbers stay as they are. It replaces
-- the unique index from migration 0031 with one that includes the log, and counts per log in the trigger.
-- To apply: copy into supabase/migrations/ with the next number, then run npm run test:db.

drop index public.injury_cases_number;
create unique index injury_cases_number_per_log on public.injury_cases
  (company_id, coalesce(establishment_id, '00000000-0000-0000-0000-000000000000'::uuid), year, case_no) where version = 1;
-- In private.next_injury_version(): lock and count on (company_id, establishment_id, year) instead of (company_id, year):
--   perform pg_advisory_xact_lock(hashtext(new.company_id::text || ':' || coalesce(new.establishment_id::text, '') || ':' || new.year::text));
--   select coalesce(max(case_no), 0) + 1 into new.case_no from public.injury_cases
--   where company_id = new.company_id and establishment_id is not distinct from new.establishment_id and year = new.year and version = 1;
