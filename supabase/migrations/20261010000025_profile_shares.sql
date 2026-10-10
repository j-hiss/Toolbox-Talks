-- "Share with your agent": a private, expiring link to a frozen copy of the company's safety profile (counts and rates
-- only, made by shareSnapshot in src/core/share.ts). Additive: new tables and functions only.
--
-- - The database makes the link's secret and returns it once. Only its sha256 fingerprint is stored, so a copy of this
--   table can't be turned back into working links.
-- - A link shows the copy made when it was created (what the company chose to send), never live data.
-- - Expires after 1 to 90 days. An admin can switch it off at any time; nothing is deleted.
-- - Every open is logged (not the company's own admins checking it); admins see how many times and when.
-- - Owners and admins only. Opening a link needs no account (an agent or carrier just taps it).

create table public.profile_shares (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies (id) on delete cascade,
  token_hash   text not null unique,
  label        text not null check (char_length(btrim(label)) between 1 and 120),
  snapshot     jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  period_from  date not null,
  period_to    date not null check (period_to >= period_from),
  created_by   uuid references auth.users (id),
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null,
  revoked_at   timestamptz,
  revoked_by   uuid references auth.users (id)
);
create index profile_shares_company_idx on public.profile_shares (company_id, created_at desc);
alter table public.profile_shares enable row level security;
create policy "admins read shares" on public.profile_shares for select to authenticated using (private.is_admin(company_id));
revoke all on public.profile_shares from anon, authenticated;
-- No fingerprint and no snapshot in the list; changes only through the functions below.
grant select (id, company_id, label, period_from, period_to, created_by, created_at, expires_at, revoked_at, revoked_by)
  on public.profile_shares to authenticated;

create table public.profile_share_views (
  id          bigint generated always as identity primary key,
  share_id    uuid not null references public.profile_shares (id) on delete cascade,
  company_id  uuid not null references public.companies (id) on delete cascade,
  viewed_at   timestamptz not null default now()
);
create index profile_share_views_share_idx on public.profile_share_views (company_id, share_id, viewed_at desc);
alter table public.profile_share_views enable row level security;
create policy "admins read share views" on public.profile_share_views for select to authenticated using (private.is_admin(company_id));
revoke all on public.profile_share_views from anon, authenticated;
grant select on public.profile_share_views to authenticated;

-- Make a link. Returns the secret once; the app builds the link from it and never stores it.
create or replace function public.create_profile_share(co uuid, label text, days int, period_from date, period_to date, snapshot jsonb)
returns text language plpgsql security definer set search_path = '' as $$
declare
  secret text := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
begin
  if not private.is_admin(co) then
    raise exception 'Only owners and admins can share the safety profile.' using errcode = '42501';
  end if;
  if days is null or days < 1 or days > 90 then
    raise exception 'A link can last 1 to 90 days.' using errcode = '22023';
  end if;
  if jsonb_typeof(snapshot) is distinct from 'object' or pg_column_size(snapshot) > 262144 then
    raise exception 'The profile copy is missing or too large.' using errcode = '22023';
  end if;
  insert into public.profile_shares (company_id, token_hash, label, snapshot, period_from, period_to, created_by, expires_at)
  values (co, encode(sha256(convert_to(secret, 'UTF8')), 'hex'), btrim(label), snapshot, period_from, period_to, auth.uid(),
          now() + make_interval(days => days));
  return secret;
end;
$$;
revoke all on function public.create_profile_share(uuid, text, int, date, date, jsonb) from public, anon;
grant execute on function public.create_profile_share(uuid, text, int, date, date, jsonb) to authenticated;

-- Switch a link off. Only once; the first time and who did it are kept.
create or replace function public.revoke_profile_share(share uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare co uuid;
begin
  select company_id into co from public.profile_shares where id = share;
  if co is null or not private.is_admin(co) then
    raise exception 'Link not found.' using errcode = '42501';
  end if;
  update public.profile_shares set revoked_at = now(), revoked_by = auth.uid() where id = share and revoked_at is null;
end;
$$;
revoke all on function public.revoke_profile_share(uuid) from public, anon;
grant execute on function public.revoke_profile_share(uuid) to authenticated;

-- Open a link: anyone with the secret, while it's live. Returns null for a wrong, expired or switched-off link (the
-- same answer for all three, so a guesser learns nothing). Logs the open, unless the company's own admin is checking it.
create or replace function public.shared_profile(token text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare s public.profile_shares;
begin
  if token is null or token !~ '^[0-9a-f]{64}$' then return null; end if;
  select * into s from public.profile_shares
  where token_hash = encode(sha256(convert_to(token, 'UTF8')), 'hex') and revoked_at is null and expires_at > now();
  if s.id is null then return null; end if;
  if not private.is_admin(s.company_id) then
    insert into public.profile_share_views (share_id, company_id) values (s.id, s.company_id);
  end if;
  return jsonb_build_object('label', s.label, 'period_from', s.period_from, 'period_to', s.period_to,
    'created_at', s.created_at, 'expires_at', s.expires_at, 'snapshot', s.snapshot);
end;
$$;
revoke all on function public.shared_profile(text) from public;
grant execute on function public.shared_profile(text) to anon, authenticated;
