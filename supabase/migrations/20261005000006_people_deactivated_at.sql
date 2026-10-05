-- When a person was deactivated, so weekly compliance only expects them in the weeks they actually worked here.
-- (created_at already marks when they were added.) Set by the database, not the app, so it can't be skipped.
-- Additive only.

alter table public.people add column deactivated_at timestamptz;
update public.people set deactivated_at = now() where not active and deactivated_at is null;

create or replace function private.stamp_deactivated()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.active is distinct from old.active then
    new.deactivated_at := case when new.active then null else now() end;
  else
    new.deactivated_at := old.deactivated_at; -- the app can't move it
  end if;
  return new;
end;
$$;
create trigger people_stamp_deactivated before update on public.people
  for each row execute function private.stamp_deactivated();
