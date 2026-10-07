-- Where the crew works at this jobsite, for companies with crews both outside and inside (a roof here, a warehouse
-- there). Additive: one nullable column; null means "the company's setting" (companies.work_setting, which itself
-- falls back to the industry, src/core/worksetting.ts). Who can change it is the existing rule: admins write jobsites.

alter table public.jobsites
  add column work_setting text
  constraint jobsites_work_setting_valid check (work_setting is null or work_setting in ('outdoor', 'mixed', 'indoor'));
