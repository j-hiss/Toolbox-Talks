-- Inspection wording check. An inspection saves the exact items that were checked, and that wording comes from the
-- phone. The check page (/verify) can now tell whether it is the app's own checklist wording, word for word:
-- verify_inspection() also returns the checklist id and version and a SHA-256 fingerprint of the wording, and the page
-- compares it with the same checklist in the app (src/core/inspections.ts wordingText / wordingHash).
-- Still counts only: the fingerprint covers the checklist's title, rule and item wording, never notes, names, photos,
-- places or the free-text subject. Replaces one function; no table changes.

-- One field, escaped: backslash, tab and newline become \\, \t, \n, so no text can pass for a field or item boundary.
create or replace function private.wording_field(v text)
returns text language sql immutable set search_path = '' as $$
  select replace(replace(replace(coalesce(v, ''), E'\\', E'\\\\'), E'\t', E'\\t'), E'\n', E'\\n');
$$;
revoke all on function private.wording_field(text) from public, anon;

create or replace function private.inspection_wording_hash(title text, rule text, items jsonb)
returns text language sql immutable set search_path = '' as $$
  -- Same string as wordingText(): title, rule, then "id<TAB>text<TAB>rule" per item, joined by newlines.
  select encode(sha256(convert_to(
    private.wording_field(title) || E'\n' || private.wording_field(rule) || coalesce((
      select string_agg(E'\n' || private.wording_field(e->>'id') || E'\t' || private.wording_field(e->>'text') || E'\t' || private.wording_field(e->>'rule'), '' order by n)
      from jsonb_array_elements(items) with ordinality as t(e, n)), ''),
    'UTF8')), 'hex');
$$;
revoke all on function private.inspection_wording_hash(text, text, jsonb) from public, anon;

create or replace function public.verify_inspection(code text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  c text := upper(regexp_replace(coalesce(code, ''), '[^0-9A-Za-z]', '', 'g'));
  r public.inspections;
begin
  if c !~ '^[2-9A-HJKMNP-Z]{16}$' then return null; end if;
  select * into r from public.inspections where verify_code = c;
  if r.id is null then return null; end if;
  return jsonb_build_object(
    'company', (select name from public.companies where id = r.company_id),
    'title', r.title, 'rule', r.rule, -- not the subject: free text could name a person
    'inspected_at', r.inspected_at, 'saved_at', r.created_at,
    'items', jsonb_array_length(r.items),
    'passed', (select count(*) from jsonb_array_elements(r.items) e where e->>'result' = 'pass'),
    'failed', (select count(*) from jsonb_array_elements(r.items) e where e->>'result' = 'fail'),
    'na', (select count(*) from jsonb_array_elements(r.items) e where e->>'result' = 'na'),
    'checklist_id', r.checklist_id, 'checklist_version', r.checklist_version,
    'wording_hash', private.inspection_wording_hash(r.title, r.rule, r.items)
  );
end;
$$;
revoke all on function public.verify_inspection(text) from public;
grant execute on function public.verify_inspection(text) to anon, authenticated;
