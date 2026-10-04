-- New companies start with the usual presenting roles, so the "Presented by" list works on day one.
-- Additive: replaces create_company() with a version that also inserts the default roles.

create or replace function public.create_company(company_name text, company_industry text, company_zip text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in to create a company' using errcode = '42501'; end if;
  insert into public.companies (name, industry, zip) values (company_name, company_industry, company_zip) returning id into new_id;
  insert into public.company_members (company_id, user_id, access) values (new_id, auth.uid(), 'owner');
  insert into public.roles (company_id, name)
    select new_id, r from unnest(array['Owner', 'Safety Manager', 'Superintendent', 'Supervisor', 'Foreman', 'Team Lead']) as r;
  return new_id;
end;
$$;
revoke all on function public.create_company(text, text, text) from public, anon;
grant execute on function public.create_company(text, text, text) to authenticated;
