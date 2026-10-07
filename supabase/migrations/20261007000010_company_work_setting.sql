-- Where a company's crews work (Admin → Company), so weather notes fit the job: outside (roofing, exterior trades,
-- farms), inside and outside (general construction), or inside (warehouses, plants). Additive: one nullable column;
-- null means "the usual for our industry" (src/core/worksetting.ts). Who can change it is the existing rule: admins
-- update their own company ("admins update their company").

alter table public.companies
  add column work_setting text
  constraint companies_work_setting_valid check (work_setting is null or work_setting in ('outdoor', 'mixed', 'indoor'));
