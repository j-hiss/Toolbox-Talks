-- "Tailor with AI" (src/core/aiTailor.ts, supabase/functions/tailor-talk). Additive: one table, one column, one function.
--
-- - Owners and admins only. The server function calls ai_tailor_start() with the signed-in user's own token first, so
--   the database decides who may use it and keeps a usage log; the AI key lives only in the function's secrets.
-- - At most 20 drafts per company per day.
-- - A draft is never saved by the AI. An admin checks it and saves it as a company talk, and that version is marked
--   source = 'ai' so it's clear later how it started.

create table public.ai_requests (
  id          bigint generated always as identity primary key,
  company_id  uuid not null references public.companies (id) on delete cascade,
  user_id     uuid references auth.users (id),
  kind        text not null check (kind in ('tailor_talk')),
  base_id     text not null default '' check (char_length(base_id) <= 60),
  created_at  timestamptz not null default now()
);
create index ai_requests_company_idx on public.ai_requests (company_id, created_at desc);
alter table public.ai_requests enable row level security;
create policy "admins read ai requests" on public.ai_requests for select to authenticated using (private.is_admin(company_id));
revoke all on public.ai_requests from anon, authenticated;
grant select on public.ai_requests to authenticated;

create or replace function public.ai_tailor_start(co uuid, base text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare new_id bigint;
begin
  if not private.is_admin(co) then
    raise exception 'Only owners and admins can draft talks with AI.' using errcode = '42501';
  end if;
  if (select count(*) from public.ai_requests where company_id = co and created_at > now() - interval '1 day') >= 20 then
    raise exception 'That''s 20 AI drafts today. Try again tomorrow, or write the talk yourself.' using errcode = '54000';
  end if;
  insert into public.ai_requests (company_id, user_id, kind, base_id) values (co, auth.uid(), 'tailor_talk', left(coalesce(base, ''), 60))
  returning id into new_id;
  return new_id;
end;
$$;
revoke all on function public.ai_tailor_start(uuid, text) from public, anon;
grant execute on function public.ai_tailor_start(uuid, text) to authenticated;

alter table public.company_talks add column source text not null default 'written' check (source in ('written', 'ai'));
