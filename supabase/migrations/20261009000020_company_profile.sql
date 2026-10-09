-- The company safety profile's self-reported pieces: EMR entries and program documents. Additive only.
--
-- * company_emr: the experience mod the company reads off its rating worksheet, per rating year. Append-only: a
--   correction is a new row (the latest per year is shown). Always labelled "self-reported" in the app and PDFs;
--   the app never computes or verifies an EMR.
-- * company_documents + the private company-docs bucket: the written safety program, the EMR worksheet, the OSHA
--   300A summary form. Admins of the company only; files can't be replaced or deleted from the app. Later, partner
--   access goes through the partner links (phase 2), never through these policies.

create table public.company_emr (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies (id) on delete cascade,
  rating_year  int not null check (rating_year between 1990 and 2100),
  emr          numeric(4, 2) not null check (emr > 0 and emr < 10),
  note         text not null default '' check (length(note) <= 300),
  entered_by   uuid not null default auth.uid() references auth.users (id),
  entered_at   timestamptz not null default now()
);
create index company_emr_company_idx on public.company_emr (company_id, rating_year desc);
alter table public.company_emr enable row level security;
create policy "admins read" on public.company_emr for select to authenticated using (private.is_admin(company_id));
create policy "admins add" on public.company_emr for insert to authenticated with check (private.is_admin(company_id));
revoke all on public.company_emr from anon, authenticated;
grant select, insert on public.company_emr to authenticated;   -- no update or delete: corrections are new rows

create table public.company_documents (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies (id) on delete cascade,
  kind         text not null check (kind in ('safety_program', 'emr_worksheet', 'osha_300a', 'other')),
  title        text not null check (length(trim(title)) > 0 and length(title) <= 200),
  path         text not null unique,
  uploaded_by  uuid not null default auth.uid() references auth.users (id),
  uploaded_at  timestamptz not null default now(),
  check (private.file_company(path) = company_id)
);
create index company_documents_company_idx on public.company_documents (company_id, uploaded_at desc);
alter table public.company_documents enable row level security;
create policy "admins read" on public.company_documents for select to authenticated using (private.is_admin(company_id));
create policy "admins add" on public.company_documents for insert to authenticated with check (private.is_admin(company_id));
revoke all on public.company_documents from anon, authenticated;
grant select, insert on public.company_documents to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('company-docs', 'company-docs', false, 20971520, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
create policy "company docs: admins read their company's" on storage.objects for select to authenticated
  using (bucket_id = 'company-docs' and private.is_admin(private.file_company(name)));
create policy "company docs: admins add to their company's" on storage.objects for insert to authenticated
  with check (bucket_id = 'company-docs' and private.is_admin(private.file_company(name)));
