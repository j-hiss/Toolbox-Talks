-- Check a record from its PDF: every saved talk record gets a verification code, printed on its PDF with a QR code.
-- Anyone holding the paper (an inspector, an insurer, a GC) scans it and sees what was saved, straight from the
-- database: company, talk, date, and how many were on the roster, signed, didn't sign and were absent. No names,
-- signatures, places or photos: the paper has those; this only shows the paper matches what was saved.
-- Additive: one new column (filled for existing records), one function. Records stay append-only.

-- 16 characters from an alphabet with no look-alikes (no 0/O, 1/I/L): about 79 random bits, so codes can't be guessed.
create or replace function private.new_verify_code()
returns text language plpgsql volatile set search_path = '' as $$
declare
  alphabet constant text := '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; -- 31 characters
  b bytea := uuid_send(gen_random_uuid()) || uuid_send(gen_random_uuid());
  out text := '';
  i int;
begin
  -- Skip the version and variant bytes of each UUID (6, 8, 22, 24); 16 of the remaining 28 bytes, one character each.
  for i in 0..31 loop
    continue when i in (6, 8, 22, 24);
    out := out || substr(alphabet, 1 + (get_byte(b, i) % 31), 1);
    exit when length(out) = 16;
  end loop;
  return out;
end;
$$;
revoke execute on function private.new_verify_code() from public, anon, authenticated;

alter table public.talk_records add column verify_code text not null default private.new_verify_code()
  check (verify_code ~ '^[2-9A-HJKMNP-Z]{16}$');
alter table public.talk_records add constraint talk_records_verify_code_key unique (verify_code);

-- What a code shows. Accepts the code with or without dashes or spaces, any case. Null for a code that doesn't exist.
create or replace function public.verify_record(code text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  c text := upper(regexp_replace(coalesce(code, ''), '[^0-9A-Za-z]', '', 'g'));
  r public.talk_records;
  co_name text;
begin
  if c !~ '^[2-9A-HJKMNP-Z]{16}$' then return null; end if;
  select * into r from public.talk_records where verify_code = c;
  if r.id is null then return null; end if;
  select name into co_name from public.companies where id = r.company_id;
  return jsonb_build_object(
    'company', co_name,
    'kind', r.record_kind,
    'title', coalesce(r.content->>'title', ''),
    'title_en', coalesce(r.content->'en'->>'title', r.content->>'title', ''),
    'language', r.language,
    'held_at', r.held_at,
    'saved_at', r.created_at,
    'week_start', r.week_start,
    'week_number', r.week_number,
    'makeup_for_week', r.makeup_for_week,
    'presenter_signed', r.presenter_signed_at is not null,
    'roster', (select count(*) from public.talk_attendees a where a.record_id = r.id),
    'signed', (select count(*) from public.talk_attendees a where a.record_id = r.id and a.status = 'signed'),
    'not_signed', (select count(*) from public.talk_attendees a where a.record_id = r.id and a.status = 'not_signed'),
    'absent', (select count(*) from public.talk_attendees a where a.record_id = r.id and a.status = 'absent')
  );
end;
$$;
revoke all on function public.verify_record(text) from public;
grant execute on function public.verify_record(text) to anon, authenticated;
