-- Crew self check-in: during a talk, the presenter shows a QR code and each crew member signs on their own phone, no
-- account needed. Additive: two new tables and six functions. Nothing existing changes.
--
-- - The presenter opens a check-in for one talk in progress (its client_id): the names on that talk's roster, the
--   statement they sign under, and the talk's title. The phone gets a long random secret for the QR code; only its
--   SHA-256 is stored, like share links (migration 0025).
-- - Anyone with the code sees only: the company's name, the talk title, the statement and the roster names with
--   whether each has signed. They can sign once for one name on that roster. Open 1 hour at most; the presenter can
--   close it sooner. Every failure looks the same (null / false, also for a paused company), so a code can't be probed.
-- - Signatures wait in checkin_signatures (private: presenters and admins of that company only) until the presenter's
--   phone takes them into the talk (take_checkin_signatures deletes each one taken), which then saves exactly as a talk
--   signed on the presenter's phone (its files go to private storage through save_talk). Restarting a code never
--   deletes a waiting signature. Closing deletes the talk's check-ins, and every check-in a day past its expiry is
--   cleared on any check-in call, so signature images don't sit in the database.
-- - A waiting image must be a real PNG (base64 with the PNG header), 200 KB at most, so nothing can stop the talk
--   from uploading.
-- - The saved record is the same as a talk signed on the presenter's phone: the person's signature, when they tapped
--   the signing statement and when they signed.
-- - A paused company can't open or take check-ins (block_when_paused, migration 0042, added to both tables).

create table public.checkin_sessions (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies (id) on delete cascade,
  client_id    uuid not null,                 -- the talk in progress on the presenter's phone
  token_hash   text not null unique,
  roster       jsonb not null,                -- [{ key, name }]
  statement    text not null check (char_length(statement) between 1 and 600),
  title        text not null default '' check (char_length(title) <= 200),
  created_by   uuid references auth.users (id),
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null,
  closed_at    timestamptz,
  unique (company_id, id)
);
create index checkin_sessions_client_idx on public.checkin_sessions (company_id, client_id);
create index checkin_sessions_expires_idx on public.checkin_sessions (expires_at);
alter table public.checkin_sessions enable row level security;
create policy "presenters read their company's check-ins" on public.checkin_sessions for select to authenticated using (private.can_present(company_id));
revoke all on public.checkin_sessions from anon, authenticated;
grant select (id, company_id, client_id, title, created_at, expires_at, closed_at) on public.checkin_sessions to authenticated;   -- never the hash

create table public.checkin_signatures (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null,
  session_id    uuid not null,
  roster_key    text not null check (char_length(roster_key) between 1 and 80),
  name          text not null check (char_length(name) between 1 and 120),
  image         text not null check (char_length(image) <= 200000 and image ~ '^data:image/png;base64,iVBORw0KGgo[A-Za-z0-9+/]*={0,2}$' and (char_length(image) - 22) % 4 = 0),
  signed_at     timestamptz not null default now(),
  confirmed_at  timestamptz not null,
  unique (session_id, roster_key),
  foreign key (company_id, session_id) references public.checkin_sessions (company_id, id) on delete cascade
);
alter table public.checkin_signatures enable row level security;
create policy "presenters read waiting signatures" on public.checkin_signatures for select to authenticated using (private.can_present(company_id));
revoke all on public.checkin_signatures from anon, authenticated;
grant select on public.checkin_signatures to authenticated;   -- written only by checkin_sign, removed by close/clear

create trigger block_when_paused before insert or update on public.checkin_sessions for each row execute function private.block_when_paused();
create trigger block_when_paused before insert or update on public.checkin_signatures for each row execute function private.block_when_paused();

-- Clear every check-in (and its waiting signatures) a day past its expiry, for every company. Cheap (indexed).
create or replace function private.sweep_checkins()
returns void language sql security definer set search_path = '' as $$
  delete from public.checkin_sessions where expires_at < now() - interval '1 day';
$$;
revoke all on function private.sweep_checkins() from public, anon, authenticated;

-- Presenter: open a check-in for the talk in progress. Closes any earlier one for the same talk. Returns the secret.
create or replace function public.open_checkin(co uuid, talk_client uuid, roster jsonb, statement text, title text)
returns text language plpgsql security definer set search_path = '' as $$
declare secret text := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
begin
  if not private.can_present(co) then raise exception 'Only presenters can start a check-in.' using errcode = '42501'; end if;
  if jsonb_typeof(roster) <> 'array' or jsonb_array_length(roster) not between 1 and 200
     or exists (select 1 from jsonb_array_elements(roster) r
                where jsonb_typeof(r->'key') is distinct from 'string' or jsonb_typeof(r->'name') is distinct from 'string'
                   or coalesce(char_length(r->>'key'), 0) not between 1 and 80 or coalesce(char_length(btrim(r->>'name')), 0) not between 1 and 120)
     or (select count(distinct r->>'key') from jsonb_array_elements(roster) r) <> jsonb_array_length(roster) then
    raise exception 'The roster for check-in isn''t in the right shape.' using errcode = '22023';
  end if;
  perform private.sweep_checkins();
  -- An earlier code for this talk stops working; anything signed with it still waits to be taken.
  update public.checkin_sessions set closed_at = now() where company_id = co and client_id = talk_client and closed_at is null;
  insert into public.checkin_sessions (company_id, client_id, token_hash, roster, statement, title, created_by, expires_at)
  values (co, talk_client, encode(sha256(convert_to(secret, 'UTF8')), 'hex'),
          (select jsonb_agg(jsonb_build_object('key', r->>'key', 'name', btrim(r->>'name'))) from jsonb_array_elements(roster) r),
          btrim(statement), left(btrim(coalesce(title, '')), 200), auth.uid(), now() + interval '1 hour');
  return secret;
end;
$$;

-- Presenter: the phone has taken these signatures into the talk; delete them from the waiting area.
create or replace function public.take_checkin_signatures(co uuid, talk_client uuid, keys text[])
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.can_present(co) then raise exception 'Only presenters can take signatures.' using errcode = '42501'; end if;
  delete from public.checkin_signatures s using public.checkin_sessions c
    where s.session_id = c.id and c.company_id = co and c.client_id = talk_client and s.roster_key = any (keys);
end;
$$;

-- Presenter: the talk is saved or discarded; its check-ins and anything still waiting are deleted. (A delete, so it
-- also works for a paused company.)
create or replace function public.close_checkin(co uuid, talk_client uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.can_present(co) then raise exception 'Only presenters can close a check-in.' using errcode = '42501'; end if;
  delete from public.checkin_sessions where company_id = co and client_id = talk_client;
end;
$$;

create or replace function private.open_checkin_by_token(token text)
returns public.checkin_sessions language sql stable security definer set search_path = '' as $$
  select * from public.checkin_sessions
  where token is not null and token ~ '^[0-9a-f]{64}$' and token_hash = encode(sha256(convert_to(token, 'UTF8')), 'hex')
    and closed_at is null and expires_at > now();
$$;
revoke all on function private.open_checkin_by_token(text) from public, anon, authenticated;

-- Anyone with the code: what to show on their phone, or null.
create or replace function public.checkin_view(token text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare s public.checkin_sessions;
begin
  perform private.sweep_checkins();
  s := private.open_checkin_by_token(token);
  if s.id is null or private.company_paused(s.company_id) then return null; end if;
  return jsonb_build_object(
    'company', (select name from public.companies where id = s.company_id),
    'title', s.title, 'statement', s.statement, 'expires_at', s.expires_at,
    'roster', (select jsonb_agg(jsonb_build_object('key', r->>'key', 'name', r->>'name',
                 'signed', exists (select 1 from public.checkin_signatures g where g.session_id = s.id and g.roster_key = r->>'key')) order by n)
               from jsonb_array_elements(s.roster) with ordinality as t(r, n)));
end;
$$;

-- Anyone with the code: sign once for one name on the roster. Returns true when saved; false otherwise (closed,
-- expired, wrong code, not on the roster, or already signed). The statement tap time comes with it.
create or replace function public.checkin_sign(token text, key text, image text, confirmed_at timestamptz)
returns boolean language plpgsql security definer set search_path = '' as $$
declare s public.checkin_sessions := private.open_checkin_by_token(token); nm text;
begin
  if s.id is null or private.company_paused(s.company_id) then return false; end if;
  select r->>'name' into nm from jsonb_array_elements(s.roster) r where r->>'key' = key;
  if nm is null then return false; end if;
  if image is null or char_length(image) > 200000 or image !~ '^data:image/png;base64,iVBORw0KGgo[A-Za-z0-9+/]*={0,2}$'
     or (char_length(image) - 22) % 4 <> 0 then return false; end if;
  insert into public.checkin_signatures (company_id, session_id, roster_key, name, image, confirmed_at)
  values (s.company_id, s.id, key, nm, image, least(greatest(coalesce(confirmed_at, now()), s.created_at), now()))
  on conflict (session_id, roster_key) do nothing;
  return found;
end;
$$;

revoke all on function public.open_checkin(uuid, uuid, jsonb, text, text), public.close_checkin(uuid, uuid), public.take_checkin_signatures(uuid, uuid, text[]) from public, anon;
grant execute on function public.open_checkin(uuid, uuid, jsonb, text, text), public.close_checkin(uuid, uuid), public.take_checkin_signatures(uuid, uuid, text[]) to authenticated;
revoke all on function public.checkin_view(text), public.checkin_sign(text, text, text, timestamptz) from public;
grant execute on function public.checkin_view(text), public.checkin_sign(text, text, text, timestamptz) to anon, authenticated;
