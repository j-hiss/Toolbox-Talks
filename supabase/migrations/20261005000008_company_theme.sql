-- A company's colors (Admin → Brand). Additive: one column, default empty = the app's default look.
-- Holds only the colors a company changed, as {"brand": "#0B4EA2", ...}; src/core/theme.ts fills in the rest.
-- Who can change it is the existing rule: admins update their own company ("admins update their company").

create or replace function private.valid_theme(t jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select jsonb_typeof(t) = 'object'
     and pg_column_size(t) < 2048
     and not exists (
       select 1 from jsonb_each(t) e
       where e.key not in ('brand', 'action', 'done', 'caution', 'danger', 'bg', 'surface', 'text')
          or jsonb_typeof(e.value) <> 'string'
          or (e.value #>> '{}') !~ '^#[0-9A-Fa-f]{6}$'
     );
$$;

alter table public.companies
  add column theme jsonb not null default '{}'::jsonb
  constraint companies_theme_valid check (private.valid_theme(theme));
