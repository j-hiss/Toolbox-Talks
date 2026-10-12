-- CRM connector: a company's CRM sends a job's ID and address with one HTTP POST, and the jobsite appears (or updates)
-- here. No server: the CRM calls a database function through the Supabase REST endpoint
--   POST <project url>/rest/v1/rpc/crm_jobsite   headers: apikey: <publishable key>, Content-Type: application/json
--   body: {"key": "<company API key>", "job_id": "1234", "address": "1 Example St, Town, ST 00000", "name": "optional"}
-- Additive: two jobsite columns, one table, functions.
--
-- - API keys: owners and admins make one per connection (Admin → Jobsites → Connect your CRM). The key is shown once;
--   only its sha256 fingerprint and first characters are stored. A key can be revoked; a revoked key stops at once.
-- - A key only ever touches its own company's jobsites (company-scoped by the key itself).
-- - The job ID is unique per company. A new job ID makes a jobsite; the same job ID updates its name and address. A
--   changed address clears the old map pin (the pin was for the old place). "active": false closes the jobsite (never
--   deleted, same as in the app).
-- - At most 600 calls an hour per key. A paused company's calls are refused like any other save.

alter table public.jobsites
  add column external_id text constraint jobsites_external_id_valid check (external_id is null or char_length(external_id) between 1 and 100),
  add column external_source text not null default '' check (char_length(external_source) <= 60),
  add column external_updated_at timestamptz;
create unique index jobsites_external_id_unique on public.jobsites (company_id, external_id) where external_id is not null;

create table public.company_api_keys (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  name          text not null check (char_length(btrim(name)) between 1 and 60),
  key_hash      text not null unique,
  key_prefix    text not null,
  created_by    uuid references auth.users (id),
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz,
  uses          bigint not null default 0,
  window_start  timestamptz,
  window_count  int not null default 0,
  revoked_at    timestamptz,
  revoked_by    uuid references auth.users (id)
);
create index company_api_keys_company_idx on public.company_api_keys (company_id);
alter table public.company_api_keys enable row level security;
create policy "admins read api keys" on public.company_api_keys for select to authenticated using (private.is_admin(company_id));
revoke all on public.company_api_keys from anon, authenticated;
grant select (id, company_id, name, key_prefix, created_by, created_at, last_used_at, uses, revoked_at) on public.company_api_keys to authenticated;
create trigger block_when_paused before insert or update on public.company_api_keys for each row execute function private.block_when_paused();

-- Make a key. Returns it once ("ttk_" + 40 letters/numbers); the app shows it and never stores it.
create or replace function public.create_api_key(co uuid, name text)
returns text language plpgsql security definer set search_path = '' as $$
declare k text := 'ttk_' || replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
begin
  if not coalesce(private.is_admin(co), false) then raise exception 'Only owners and admins can make API keys.' using errcode = '42501'; end if;
  if (select count(*) from public.company_api_keys a where a.company_id = co and a.revoked_at is null) >= 10 then
    raise exception 'A company can have 10 keys at a time. Revoke one first.' using errcode = '23514';
  end if;
  k := substr(k, 1, 44);
  insert into public.company_api_keys (company_id, name, key_hash, key_prefix, created_by)
  values (co, btrim(create_api_key.name), encode(sha256(convert_to(k, 'UTF8')), 'hex'), substr(k, 1, 8), auth.uid());
  return k;
end;
$$;

create or replace function public.revoke_api_key(co uuid, key_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not coalesce(private.is_admin(co), false) then raise exception 'Only owners and admins can revoke API keys.' using errcode = '42501'; end if;
  update public.company_api_keys set revoked_at = now(), revoked_by = auth.uid() where id = key_id and company_id = co and revoked_at is null;
  if not found then raise exception 'Key not found.' using errcode = '42501'; end if;
end;
$$;

-- The CRM's call. Every refusal says why in plain words; nothing about other companies ever comes back.
create or replace function public.crm_jobsite(key text, job_id text, address text default null, name text default null,
                                               active boolean default true, source text default 'crm')
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  k public.company_api_keys;
  j public.jobsites;
  jid text := btrim(coalesce(job_id, ''));
  addr text := nullif(btrim(coalesce(address, '')), '');
  nm text := nullif(btrim(coalesce(name, '')), '');
  src text := left(btrim(coalesce(source, 'crm')), 60);
  made boolean := false;
begin
  select * into k from public.company_api_keys a where a.key_hash = encode(sha256(convert_to(coalesce(crm_jobsite.key, ''), 'UTF8')), 'hex');
  if k.id is null or k.revoked_at is not null then raise exception 'That API key isn''t valid.' using errcode = '28000'; end if;
  if k.window_start is not null and k.window_start > now() - interval '1 hour' and k.window_count >= 600 then
    raise exception 'Too many calls. Up to 600 an hour per key.' using errcode = '54000';
  end if;
  if char_length(jid) not between 1 and 100 then raise exception 'Send the job ID (1 to 100 characters).' using errcode = '22023'; end if;
  if addr is not null and char_length(addr) > 300 then raise exception 'Keep the address to 300 characters.' using errcode = '22023'; end if;
  if nm is not null and char_length(nm) > 120 then raise exception 'Keep the name to 120 characters.' using errcode = '22023'; end if;

  select * into j from public.jobsites s where s.company_id = k.company_id and s.external_id = jid;
  if j.id is null then
    if addr is null and nm is null then raise exception 'A new job needs an address or a name.' using errcode = '22023'; end if;
    insert into public.jobsites (company_id, name, address, active, external_id, external_source, external_updated_at)
    values (k.company_id, coalesce(nm, addr), coalesce(addr, ''), coalesce(crm_jobsite.active, true), jid, src, now())
    returning * into j;
    made := true;
  else
    update public.jobsites s set
      name = coalesce(nm, case when s.name = s.address and addr is not null then addr else s.name end),
      address = coalesce(addr, s.address),
      latitude = case when addr is not null and addr is distinct from s.address then null else s.latitude end,
      longitude = case when addr is not null and addr is distinct from s.address then null else s.longitude end,
      active = coalesce(crm_jobsite.active, s.active),
      external_source = src,
      external_updated_at = now()
    where s.id = j.id
    returning * into j;
  end if;

  update public.company_api_keys set last_used_at = now(), uses = uses + 1,
    window_start = case when window_start is null or window_start <= now() - interval '1 hour' then now() else window_start end,
    window_count = case when window_start is null or window_start <= now() - interval '1 hour' then 1 else window_count + 1 end
  where id = k.id;

  return jsonb_build_object('jobsite_id', j.id, 'job_id', j.external_id, 'name', j.name, 'address', j.address, 'active', j.active,
                            'result', case when made then 'created' else 'updated' end);
end;
$$;

revoke all on function public.create_api_key(uuid, text), public.revoke_api_key(uuid, uuid) from public, anon;
grant execute on function public.create_api_key(uuid, text), public.revoke_api_key(uuid, uuid) to authenticated;
revoke all on function public.crm_jobsite(text, text, text, text, boolean, text) from public;
grant execute on function public.crm_jobsite(text, text, text, text, boolean, text) to anon, authenticated;
