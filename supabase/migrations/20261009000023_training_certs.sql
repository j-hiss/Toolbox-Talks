-- Training cards and certifications per person (Admin → Training). Additive.
-- * person_certs: one row per card as entered (type, issued, expiry typed from the card, optional photo). Append-only:
--   a renewal is a new row; a mistake is withdrawn with a reason (stays on file). The latest per type counts.
-- * title_cert_requirements: which cards each job title needs, so a missing card shows as missing.
-- * person-certs bucket: private photos of cards. Admins only; employees never see other people's cards.
-- Reads: owners, admins and office see the company's cards (they're training records); presenters and employees see
-- only their own (an employee through their linked roster person). Card photos: admins only.

create table public.person_certs (
  id                uuid primary key default gen_random_uuid(),
  company_id        uuid not null references public.companies (id) on delete cascade,
  person_id         uuid not null,
  cert_type         text not null check (cert_type ~ '^[a-z0-9_]{2,30}$'),
  custom_name       text not null default '' check (length(custom_name) <= 100 and (cert_type <> 'custom' or length(trim(custom_name)) > 0)),
  issued_on         date,
  expires_on        date check (expires_on is null or issued_on is null or expires_on >= issued_on),
  note              text not null default '' check (length(note) <= 300),
  card_path         text unique check (card_path is null or private.file_company(card_path) = company_id),
  entered_by        uuid not null default auth.uid() references auth.users (id),
  entered_at        timestamptz not null default now(),
  withdrawn_at      timestamptz,
  withdrawn_reason  text not null default '' check (withdrawn_at is null or length(trim(withdrawn_reason)) > 0),
  foreign key (company_id, person_id) references public.people (company_id, id)
);
create index person_certs_company_idx on public.person_certs (company_id, person_id);
alter table public.person_certs enable row level security;

create or replace function private.can_report(target uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.company_members m where m.company_id = target and m.user_id = auth.uid() and m.access in ('owner', 'admin', 'office'));
$$;
revoke execute on function private.can_report(uuid) from public, anon;
grant execute on function private.can_report(uuid) to authenticated;

create policy "admins and office read" on public.person_certs for select to authenticated using (private.can_report(company_id));
create policy "people read their own" on public.person_certs for select to authenticated using (
  exists (select 1 from public.people p where p.id = person_certs.person_id and p.company_id = person_certs.company_id and p.user_id = auth.uid()));
create policy "admins add" on public.person_certs for insert to authenticated with check (private.is_admin(company_id) and withdrawn_at is null);
create policy "admins withdraw" on public.person_certs for update to authenticated using (private.is_admin(company_id)) with check (private.is_admin(company_id));
revoke all on public.person_certs from anon, authenticated;
grant select, insert, update on public.person_certs to authenticated;   -- never deleted

-- An update can only withdraw a card, once, with a reason. Everything else stays as entered.
create or replace function private.certs_withdraw_only()
returns trigger language plpgsql set search_path = '' as $$
begin
  if old.withdrawn_at is not null then raise exception 'This card was already withdrawn.' using errcode = '23514'; end if;
  if new.withdrawn_at is null then raise exception 'A card can only be withdrawn, not edited. Add the corrected card instead.' using errcode = '23514'; end if;
  if (new.company_id, new.person_id, new.cert_type, new.custom_name, new.issued_on, new.expires_on, new.note, new.card_path, new.entered_by, new.entered_at)
     is distinct from (old.company_id, old.person_id, old.cert_type, old.custom_name, old.issued_on, old.expires_on, old.note, old.card_path, old.entered_by, old.entered_at)
  then raise exception 'A card can only be withdrawn, not edited. Add the corrected card instead.' using errcode = '23514'; end if;
  new.withdrawn_at := now();
  return new;
end;
$$;
create trigger person_certs_withdraw_only before update on public.person_certs for each row execute function private.certs_withdraw_only();

create table public.title_cert_requirements (
  company_id  uuid not null references public.companies (id) on delete cascade,
  role_id     uuid not null,
  cert_type   text not null check (cert_type ~ '^[a-z0-9_]{2,30}$' and cert_type <> 'custom'),
  primary key (company_id, role_id, cert_type),
  foreign key (company_id, role_id) references public.roles (company_id, id) on delete cascade
);
alter table public.title_cert_requirements enable row level security;
create policy "staff read" on public.title_cert_requirements for select to authenticated using (private.is_member(company_id));
create policy "admins write" on public.title_cert_requirements for all to authenticated using (private.is_admin(company_id)) with check (private.is_admin(company_id));
revoke all on public.title_cert_requirements from anon, authenticated;
grant select, insert, delete on public.title_cert_requirements to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('person-certs', 'person-certs', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
create policy "card photos: admins read their company's" on storage.objects for select to authenticated
  using (bucket_id = 'person-certs' and private.is_admin(private.file_company(name)));
create policy "card photos: admins add to their company's" on storage.objects for insert to authenticated
  with check (bucket_id = 'person-certs' and private.is_admin(private.file_company(name)));
