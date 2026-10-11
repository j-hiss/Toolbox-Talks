-- Trainer classes and the certificates trainers issue. Additive: two tables, one column, functions, triggers.
--
-- - A trainer runs a class for one client: the training (a card type), date, place, and the card's expiry if it has
--   one. People are picked from those the company shared with the trainer. Each signs on the trainer's phone, and the
--   trainer marks each passed or not.
-- - Closing the class sends a card for everyone who passed, through the same approval as a single card (the company
--   still approves each one). A closed class never changes; it stays as the attendance record for the company and the
--   trainer.
-- - Every card a trainer sends gets a check code. Once the company approves it, the trainer's certificate PDF carries
--   the code, and anyone can check it at /verify: company, training, trainer, dates and whether it's current. No
--   person's name (the paper has it), like the other check codes.

alter table public.cert_submissions add column verify_code text not null default private.new_verify_code() check (verify_code ~ '^[2-9A-HJKMNP-Z]{16}$');
alter table public.cert_submissions add constraint cert_submissions_verify_code_key unique (verify_code);

create table public.training_classes (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null,
  trainer_id   uuid not null,
  cert_type    text not null check (cert_type ~ '^[a-z0-9_]{2,30}$'),
  custom_name  text not null default '' check (length(custom_name) <= 100 and (cert_type <> 'custom' or length(btrim(custom_name)) > 0)),
  held_on      date not null,
  place        text not null default '' check (char_length(place) <= 200),
  expires_on   date check (expires_on is null or expires_on >= held_on),
  note         text not null default '' check (char_length(note) <= 300),
  created_by   uuid references auth.users (id),
  created_at   timestamptz not null default now(),
  closed_at    timestamptz,
  unique (company_id, id),
  foreign key (company_id, trainer_id) references public.company_trainers (company_id, id)
);
create index training_classes_trainer_idx on public.training_classes (trainer_id, held_on desc);
create index training_classes_company_idx on public.training_classes (company_id, held_on desc);

create table public.training_class_people (
  class_id      uuid not null,
  company_id    uuid not null,
  person_id     uuid not null,
  signature     text check (signature is null or (char_length(signature) <= 200000 and signature ~ '^data:image/png;base64,iVBORw0KGgo[A-Za-z0-9+/]*={0,2}$' and (char_length(signature) - 22) % 4 = 0)),
  signed_at     timestamptz,
  result        text check (result in ('passed', 'not_passed')),
  submission_id uuid references public.cert_submissions (id),
  primary key (class_id, person_id),
  foreign key (company_id, class_id) references public.training_classes (company_id, id) on delete cascade,
  foreign key (company_id, person_id) references public.people (company_id, id)
);

alter table public.training_classes enable row level security;
alter table public.training_class_people enable row level security;
create policy "admins read their company's classes" on public.training_classes for select to authenticated using (private.is_admin(company_id));
create policy "trainers read their classes" on public.training_classes for select to authenticated using (trainer_id = private.my_trainer_id(company_id));
create policy "admins read class attendance" on public.training_class_people for select to authenticated using (private.is_admin(company_id));
create policy "trainers read their class attendance" on public.training_class_people for select to authenticated
  using (exists (select 1 from public.training_classes c where c.id = class_id and c.trainer_id = private.my_trainer_id(c.company_id)));
revoke all on public.training_classes, public.training_class_people from anon, authenticated;
grant select on public.training_classes, public.training_class_people to authenticated;   -- written only by the functions below
create trigger block_when_paused before insert or update on public.training_classes for each row execute function private.block_when_paused();
create trigger block_when_paused before insert or update on public.training_class_people for each row execute function private.block_when_paused();

-- The class, if it belongs to the signed-in trainer and is still open.
create or replace function private.my_open_class(cls uuid)
returns public.training_classes language sql stable security definer set search_path = '' as $$
  select c.* from public.training_classes c where c.id = cls and c.closed_at is null and c.trainer_id = private.my_trainer_id(c.company_id);
$$;
revoke all on function private.my_open_class(uuid) from public, anon, authenticated;

create or replace function public.create_training_class(co uuid, cert_type text, custom_name text, held_on date, place text, expires_on date, note text, people uuid[])
returns uuid language plpgsql security definer set search_path = '' as $$
declare tr uuid := private.my_trainer_id(co); new_id uuid; p uuid;
begin
  if tr is null then raise exception 'This company hasn''t invited you as a trainer.' using errcode = '42501'; end if;
  if coalesce(array_length(people, 1), 0) not between 1 and 100 then raise exception 'Pick 1 to 100 people for the class.' using errcode = '22023'; end if;
  foreach p in array people loop
    if not private.trainer_sees(co, p) then raise exception 'You can only add people this company shared with you.' using errcode = '42501'; end if;
  end loop;
  insert into public.training_classes (company_id, trainer_id, cert_type, custom_name, held_on, place, expires_on, note, created_by)
  values (co, tr, cert_type, case when cert_type = 'custom' then btrim(coalesce(custom_name, '')) else '' end, held_on, btrim(coalesce(place, '')), expires_on, btrim(coalesce(note, '')), auth.uid())
  returning id into new_id;
  insert into public.training_class_people (class_id, company_id, person_id) select new_id, co, x from unnest(people) x on conflict do nothing;
  return new_id;
end;
$$;

-- Each person signs on the trainer's phone (once).
create or replace function public.sign_training_class(cls uuid, person uuid, image text)
returns void language plpgsql security definer set search_path = '' as $$
declare c public.training_classes := private.my_open_class(cls);
begin
  if c.id is null then raise exception 'This class is closed or isn''t yours.' using errcode = '42501'; end if;
  update public.training_class_people set signature = image, signed_at = now()
   where class_id = cls and person_id = person and signed_at is null;
  if not found then raise exception 'That person isn''t in this class, or already signed.' using errcode = '23514'; end if;
end;
$$;

create or replace function public.set_training_result(cls uuid, person uuid, passed boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare c public.training_classes := private.my_open_class(cls);
begin
  if c.id is null then raise exception 'This class is closed or isn''t yours.' using errcode = '42501'; end if;
  update public.training_class_people set result = case when passed then 'passed' else 'not_passed' end
   where class_id = cls and person_id = person;
  if not found then raise exception 'That person isn''t in this class.' using errcode = '23514'; end if;
end;
$$;

-- Close: everyone needs a result, and only people who signed can pass. Sends a card for each person who passed.
create or replace function public.close_training_class(cls uuid)
returns int language plpgsql security definer set search_path = '' as $$
declare c public.training_classes := private.my_open_class(cls); a record; sid uuid; n int := 0;
begin
  if c.id is null then raise exception 'This class is closed or isn''t yours.' using errcode = '42501'; end if;
  if exists (select 1 from public.training_class_people x where x.class_id = cls and x.result is null) then
    raise exception 'Mark everyone passed or not passed first.' using errcode = '23514';
  end if;
  if exists (select 1 from public.training_class_people x where x.class_id = cls and x.result = 'passed' and x.signed_at is null) then
    raise exception 'Someone marked passed hasn''t signed in. Have them sign, or mark them not passed.' using errcode = '23514';
  end if;
  for a in select * from public.training_class_people x where x.class_id = cls and x.result = 'passed' loop
    insert into public.cert_submissions (company_id, trainer_id, person_id, client_id, cert_type, custom_name, issued_on, expires_on, note, submitted_by)
    values (c.company_id, c.trainer_id, a.person_id, gen_random_uuid(), c.cert_type, c.custom_name, c.held_on, c.expires_on,
            left('Class on ' || to_char(c.held_on, 'Mon DD, YYYY') || case when c.place <> '' then ' at ' || c.place else '' end, 300), auth.uid())
    returning id into sid;
    update public.training_class_people set submission_id = sid where class_id = cls and person_id = a.person_id;
    n := n + 1;
  end loop;
  update public.training_classes set closed_at = now() where id = cls;
  return n;
end;
$$;

-- A closed class and its attendance never change.
create or replace function private.guard_closed_class()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_table_name = 'training_classes' then
    if old.closed_at is not null then raise exception 'A closed class can''t be changed.' using errcode = '23514'; end if;
  elsif exists (select 1 from public.training_classes c where c.id = old.class_id and c.closed_at is not null) then
    if new.submission_id is distinct from old.submission_id and old.submission_id is null and new.signature is not distinct from old.signature
       and new.result is not distinct from old.result then return new; end if;
    raise exception 'A closed class can''t be changed.' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger guard_closed_class before update on public.training_classes for each row execute function private.guard_closed_class();
create trigger guard_closed_class before update on public.training_class_people for each row execute function private.guard_closed_class();

-- The trainer's certificates: every card they sent that the company approved, with its check code.
create or replace function public.my_certificates()
returns table (submission_id uuid, company_id uuid, company_name text, trainer_name text, person_name text, cert_type text, custom_name text,
  issued_on date, expires_on date, approved_at timestamptz, verify_code text, withdrawn boolean)
language sql stable security definer set search_path = '' as $$
  select s.id, c.id, c.name, t.name, p.full_name, s.cert_type, s.custom_name, s.issued_on, s.expires_on, s.decided_at, s.verify_code, pc.withdrawn_at is not null
  from public.cert_submissions s
  join public.company_trainers t on t.id = s.trainer_id and t.company_id = s.company_id
  join public.companies c on c.id = s.company_id
  join public.people p on p.id = s.person_id and p.company_id = s.company_id
  left join public.person_certs pc on pc.id = s.cert_id
  where s.status = 'approved' and s.trainer_id = private.my_trainer_id(s.company_id)
  order by s.decided_at desc;
$$;

-- Anyone with a certificate's code: what was approved. No person's name.
create or replace function public.verify_certificate(code text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare c text := upper(regexp_replace(coalesce(code, ''), '[^0-9A-Za-z]', '', 'g')); s public.cert_submissions; withdrawn boolean;
begin
  if c !~ '^[2-9A-HJKMNP-Z]{16}$' then return null; end if;
  select * into s from public.cert_submissions where verify_code = c and status = 'approved';
  if s.id is null then return null; end if;
  select pc.withdrawn_at is not null into withdrawn from public.person_certs pc where pc.id = s.cert_id;
  return jsonb_build_object(
    'company', (select name from public.companies where id = s.company_id),
    'trainer', (select name from public.company_trainers where id = s.trainer_id),
    'cert_type', s.cert_type, 'custom_name', s.custom_name, 'issued_on', s.issued_on, 'expires_on', s.expires_on,
    'approved_at', s.decided_at, 'withdrawn', coalesce(withdrawn, false));
end;
$$;

revoke all on function public.create_training_class(uuid, text, text, date, text, date, text, uuid[]), public.sign_training_class(uuid, uuid, text),
  public.set_training_result(uuid, uuid, boolean), public.close_training_class(uuid), public.my_certificates() from public, anon;
grant execute on function public.create_training_class(uuid, text, text, date, text, date, text, uuid[]), public.sign_training_class(uuid, uuid, text),
  public.set_training_result(uuid, uuid, boolean), public.close_training_class(uuid), public.my_certificates() to authenticated;
revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;
