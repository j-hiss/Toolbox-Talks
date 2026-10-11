-- Weekly inspections: some rules ask for a check at least every 7 days (EPA hazardous waste storage areas, 40 CFR
-- 262.16(b)(2)(iv) and 262.17(a)(1)(v); construction stormwater, EPA CGP Part 4.2). The app's checklists gain a
-- "weekly" schedule, and a company's own checklists (migration 0045) can use it too.
--
-- Widens one check constraint: every value allowed before is still allowed, so no saved row changes and nothing is
-- dropped. Added as not valid then validated, so it never blocks writes while it runs.
alter table public.company_checklists
  add constraint company_checklists_how_often_check2
  check (how_often in ('each_use', 'each_shift', 'daily', 'weekly', 'monthly')) not valid;
alter table public.company_checklists validate constraint company_checklists_how_often_check2;
alter table public.company_checklists drop constraint company_checklists_how_often_check;
