-- 14 more industries (src/core/industries.ts). Widens the allowed industry codes; every existing value stays valid,
-- so no row changes. The old check is replaced by a wider one in one transaction.
-- Approved by Joe on 2026-10-07 ("can we do this for every industry").

alter table public.companies drop constraint companies_industry_check;
alter table public.companies add constraint companies_industry_check check (industry in (
  'con', 'roof', 'elec', 'plumb', 'solar', 'site',
  'mfg', 'wh', 'truck', 'ag', 'land',
  'oil', 'util', 'health', 'retail', 'food', 'facil', 'auto'
));
