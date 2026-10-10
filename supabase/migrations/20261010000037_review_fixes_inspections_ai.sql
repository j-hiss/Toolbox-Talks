-- Fixes from the independent review of inspections and AI tailoring (2026-10-10). Functions replaced; no data changed.
--
-- 1. An issue's link to the inspection that raised it can't be changed (guard_issue now keeps inspection_id too).
-- 2. AI drafts: besides 20 a day per company, at most 20 a day per person (making extra companies doesn't add more)
--    and 300 a day across everyone, to cap what the AI key can spend. Counted under a lock so simultaneous requests
--    can't slip past the limits.

create or replace function private.guard_issue()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.company_id := old.company_id;
  new.client_id := old.client_id;
  new.record_id := old.record_id;
  new.event_id := old.event_id;
  new.inspection_id := old.inspection_id;
  new.description := old.description;
  new.raised_at := old.raised_at;
  new.raised_by_name := old.raised_by_name;
  new.created_by := old.created_by;
  if new.status = 'fixed' and old.status <> 'fixed' then
    new.fixed_at := now();
    new.fixed_by := auth.uid();
  elsif new.status = 'open' then
    new.fixed_at := null;
    new.fixed_by := null;
    new.fixed_note := '';
  else
    new.fixed_at := old.fixed_at;
    new.fixed_by := old.fixed_by;
  end if;
  return new;
end;
$$;

create index if not exists ai_requests_user_idx on public.ai_requests (user_id, created_at desc);

create or replace function public.ai_tailor_start(co uuid, base text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare new_id bigint;
begin
  if auth.uid() is null or not private.is_admin(co) then
    raise exception 'Only owners and admins can draft talks with AI.' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(hashtext('ai_tailor_start'));
  if (select count(*) from public.ai_requests where company_id = co and created_at > now() - interval '1 day') >= 20 then
    raise exception 'That''s 20 AI drafts today for this company. Try again tomorrow, or write the talk yourself.' using errcode = '54000';
  end if;
  if (select count(*) from public.ai_requests where user_id = auth.uid() and created_at > now() - interval '1 day') >= 20 then
    raise exception 'That''s 20 AI drafts today. Try again tomorrow, or write the talk yourself.' using errcode = '54000';
  end if;
  if (select count(*) from public.ai_requests where created_at > now() - interval '1 day') >= 300 then
    raise exception 'AI drafting is busy today. Try again tomorrow, or write the talk yourself.' using errcode = '54000';
  end if;
  insert into public.ai_requests (company_id, user_id, kind, base_id) values (co, auth.uid(), 'tailor_talk', left(coalesce(base, ''), 60))
  returning id into new_id;
  return new_id;
end;
$$;
revoke all on function public.ai_tailor_start(uuid, text) from public, anon;
grant execute on function public.ai_tailor_start(uuid, text) to authenticated;
