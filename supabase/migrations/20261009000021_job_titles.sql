-- Job titles. `roles` already holds each company's titles (Owner, Foreman, ...); until now every title could present.
-- This adds a per-title switch so a company can list everyone's real job (Roofer, Laborer, Office) while only some
-- titles appear in the "Presented by" list. Additive: existing titles keep presenting (default true), so nothing a
-- company sees changes until it turns a title off. Starter lists per industry live in src/content/jobTitles.ts.

alter table public.roles add column presents boolean not null default true;
comment on column public.roles.presents is 'True: people with this job title appear in the "Presented by" list. False: they sign only.';
