#!/usr/bin/env node
// Company isolation test: proves one company can never read or write another company's data.
//
// It creates a throwaway database on the Postgres server in DATABASE_URL, applies every migration in
// supabase/migrations/ in order, runs the checks as real signed-in users, then drops the database.
// Works against local Supabase (npm run db:start) or any Postgres 15+ (CI uses a plain postgres:16 service).
//
// It also proves the test CAN fail: it turns row-level security off on one table and confirms the leak check
// catches it. A check that can't fail is decoration (docs/lessons-learned.md #1).
//
// Usage: DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres npm run test:db

import pg from "pg";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

const adminUrl = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const dbName = `tt_isolation_${Date.now()}`;
const migrationsDir = join(import.meta.dirname, "..", "supabase", "migrations");

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

// Minimal stand-ins for what Supabase provides, so migrations run on a fresh database anywhere.
const SUPABASE_STUB = `
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
end $$;
create schema if not exists auth;
create table if not exists auth.users (id uuid primary key);
create or replace function auth.uid() returns uuid language sql stable as
  $f$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $f$;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant usage on schema public to anon, authenticated;
-- Supabase Storage: buckets, objects (row-level security on, like the real one).
create schema if not exists storage;
create table if not exists storage.buckets (id text primary key, name text not null, public boolean default false,
  file_size_limit bigint, allowed_mime_types text[]);
create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets (id),
  name text not null, owner uuid default auth.uid(), created_at timestamptz default now(), unique (bucket_id, name));
alter table storage.objects enable row level security;
grant usage on schema storage to anon, authenticated;
grant select, insert, update, delete on storage.objects to anon, authenticated;
`;

async function main() {
  const admin = new pg.Client({ connectionString: adminUrl });
  await admin.connect();
  await admin.query(`create database ${dbName}`);
  const url = new URL(adminUrl);
  url.pathname = `/${dbName}`;
  const db = new pg.Client({ connectionString: url.toString() });

  try {
    await db.connect();
    await db.query(SUPABASE_STUB);
    const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
    if (files.length === 0) throw new Error("No migrations found");
    for (const f of files) await db.query(readFileSync(join(migrationsDir, f), "utf8"));
    console.log(`Applied ${files.length} migration(s) to ${dbName}`);

    const userA = randomUUID(), userB = randomUUID(), presenterA = randomUUID();
    await db.query("insert into auth.users (id) values ($1), ($2), ($3)", [userA, userB, presenterA]);

    // Run SQL as a signed-in user (or anon when user is null), inside a transaction that is rolled back on error.
    const as = async (user, sql, params = []) => {
      await db.query("begin");
      try {
        await db.query(`set local role ${user ? "authenticated" : "anon"}`);
        await db.query("select set_config('request.jwt.claim.sub', $1, true)", [user ?? ""]);
        const r = await db.query(sql, params);
        await db.query("commit");
        return r;
      } catch (e) {
        await db.query("rollback");
        throw e;
      }
    };
    const fails = async (fn) => { try { await fn(); return false; } catch { return true; } };

    // Two companies, each created by its own owner.
    const coA = (await as(userA, "select public.create_company('Company A', 'con', '33913') as id")).rows[0].id;
    const coB = (await as(userB, "select public.create_company('Company B', 'mfg', '55401') as id")).rows[0].id;
    const teamB = (await as(userB, "insert into public.teams (company_id, name) values ($1, 'B crew') returning id", [coB])).rows[0].id;
    await as(userA, "insert into public.people (company_id, full_name) values ($1, 'A worker 1'), ($1, 'A worker 2')", [coA]);
    await as(userB, "insert into public.people (company_id, full_name, team_id) values ($1, 'B worker', $2)", [coB, teamB]);
    await db.query("insert into public.company_members (company_id, user_id, access) values ($1, $2, 'presenter')", [coA, presenterA]);

    const leakCheck = async () => {
      const people = await as(userA, "select company_id from public.people");
      return people.rows.every((r) => r.company_id === coA) && people.rows.length === 2;
    };

    check("A sees only A's people", await leakCheck());
    const companies = await as(userA, "select id from public.companies");
    check("A sees only A's company", companies.rows.length === 1 && companies.rows[0].id === coA, `${companies.rows.length} visible`);
    check("A sees only A's teams", (await as(userA, "select id from public.teams")).rows.length === 0);
    await as(userA, "insert into public.jobsites (company_id, name, latitude, longitude) values ($1, 'A yard', 26.64, -81.87)", [coA]);
    await as(userB, "insert into public.jobsites (company_id, name) values ($1, 'B plant')", [coB]);
    const sitesA = await as(userA, "select company_id from public.jobsites");
    check("A sees only A's jobsites", sitesA.rows.length === 1 && sitesA.rows[0].company_id === coA, `${sitesA.rows.length} visible`);
    check("A cannot add a jobsite to B", await fails(() => as(userA, "insert into public.jobsites (company_id, name) values ($1, 'x')", [coB])));
    check("Jobsites can't be deleted, only deactivated", await fails(() => as(userA, "delete from public.jobsites where company_id = $1", [coA])));
    // Talk records: append-only, company-scoped, idempotent uploads.
    const rec = (company, clientId, attendees) => [
      JSON.stringify({ company_id: company, client_id: clientId, talk_id: "fall", language: "en", content: { title: "Fall Protection" },
        presenter_name: "Presenter", held_at: new Date().toISOString() }),
      JSON.stringify(attendees),
    ];
    // Signatures and photos are files in the private "talk-files" bucket at <company>/<talk client id>/<file>.
    const upload = (user, path) => as(user, "insert into storage.objects (bucket_id, name) values ('talk-files', $1)", [path]);
    const clientA = randomUUID();
    const sigPath = `${coA}/${clientA}/sig-0.png`;
    await upload(userA, sigPath);
    const save = (user, company, clientId, att) => as(user, "select public.save_talk_record($1::jsonb, $2::jsonb) as id", rec(company, clientId, att));
    const recA = (await save(userA, coA, clientA, [{ name: "W1", status: "signed", signature_path: sigPath }, { name: "W2", status: "absent" }])).rows[0].id;
    const again = (await save(userA, coA, clientA, [{ name: "W1", status: "signed", signature_path: sigPath }])).rows[0].id;
    const countA = (await as(userA, "select count(*)::int n from public.talk_records")).rows[0].n;
    check("Saving the same talk twice keeps one record", again === recA && countA === 1, `${countA} record(s)`);
    check("Attendees saved with the record", (await as(userA, "select status from public.talk_attendees order by position")).rows.map((r) => r.status).join(",") === "signed,absent");
    check("B sees none of A's records or attendees",
      (await as(userB, "select id from public.talk_records")).rows.length === 0 && (await as(userB, "select id from public.talk_attendees")).rows.length === 0);
    check("Records can't be edited", await fails(() => as(userA, "update public.talk_records set presenter_name = 'changed' where id = $1", [recA])));
    check("Records can't be deleted", await fails(() => as(userA, "delete from public.talk_records where id = $1", [recA])));
    check("Attendance can't be edited", await fails(() => as(userA, "update public.talk_attendees set status = 'signed' where record_id = $1", [recA])));
    check("B cannot save a record into A's company", await fails(() => save(userB, coA, randomUUID(), [])));
    check("'Signed' without a signature is rejected", await fails(() => save(userA, coA, randomUUID(), [{ name: "W3", status: "signed" }])));
    check("A presenter can record a talk", !!(await save(presenterA, coA, randomUUID(), [{ name: "W1", status: "not_signed" }])).rows[0].id);

    // Private files: company-only, can't be replaced or removed, and a record can only point at its own uploaded files.
    check("A can't upload into B's folder", await fails(() => upload(userA, `${coB}/${randomUUID()}/sig-0.png`)));
    check("A can't upload outside any company folder", await fails(() => upload(userA, `not-a-company/${randomUUID()}/x.png`)));
    check("B can't see A's signature files", (await as(userB, "select name from storage.objects where bucket_id = 'talk-files'")).rows.length === 0);
    check("A can see A's signature files", (await as(userA, "select name from storage.objects where name = $1", [sigPath])).rows.length === 1);
    check("Saved files can't be replaced", (await as(userA, "update storage.objects set name = name || 'x' where name = $1", [sigPath])).rowCount === 0);
    check("Saved files can't be deleted", (await as(userA, "delete from storage.objects where name = $1", [sigPath])).rowCount === 0);
    check("Signed needs an uploaded file, not an inline image",
      await fails(() => save(userA, coA, randomUUID(), [{ name: "W3", status: "signed", signature: "data:image/png;base64,AAAA" }])));
    check("A record can't point at a file that was never uploaded",
      await fails(() => { const c = randomUUID(); return save(userA, coA, c, [{ name: "W3", status: "signed", signature_path: `${coA}/${c}/sig-0.png` }]); }));
    check("A record can't point at another talk's file",
      await fails(() => save(userA, coA, randomUUID(), [{ name: "W3", status: "signed", signature_path: sigPath }])));
    {
      const c = randomUUID(), base = `${coA}/${c}/`;
      for (const f of ["presenter.png", "sig-0.png", "photo.jpg"]) await upload(userA, base + f);
      const [r] = rec(coA, c, []);
      const withFiles = JSON.stringify({ ...JSON.parse(r), presenter_signature_path: base + "presenter.png", presenter_signed_at: new Date().toISOString(),
        photo_path: base + "photo.jpg", photo_taken_at: new Date().toISOString() });
      const att = JSON.stringify([{ name: "Visiting electrician", status: "signed", signature_path: base + "sig-0.png", company_name: " Example Electric " }]);
      const id = (await as(userA, "select public.save_talk_record($1::jsonb, $2::jsonb) as id", [withFiles, att])).rows[0].id;
      const row = (await as(userA, "select r.photo_path, r.photo_taken_at, r.presenter_signature_path, a.company_name from public.talk_records r join public.talk_attendees a on a.record_id = r.id where r.id = $1", [id])).rows[0];
      check("Crew photo, presenter signature and a walk-in's company save with the record",
        row?.photo_path === base + "photo.jpg" && !!row.photo_taken_at && row.presenter_signature_path === base + "presenter.png" && row.company_name === "Example Electric");
      check("B can't save a record pointing at A's files",
        await fails(() => as(userB, "select public.save_talk_record($1::jsonb, $2::jsonb) as id", [JSON.stringify({ ...JSON.parse(withFiles), company_id: coB, client_id: randomUUID() }), "[]"])));
    }
    {
      // A paper sign-in sheet photo is kept with the record but never makes anyone signed.
      const c = randomUUID(), base = `${coA}/${c}/`;
      await upload(userA, base + "sheet.jpg");
      const [r] = rec(coA, c, []);
      const withSheet = JSON.stringify({ ...JSON.parse(r), sheet_path: base + "sheet.jpg", sheet_taken_at: new Date().toISOString() });
      const id = (await as(userA, "select public.save_talk_record($1::jsonb, $2::jsonb) as id", [withSheet, JSON.stringify([{ name: "W9", status: "not_signed" }])])).rows[0].id;
      const row = (await as(userA, "select r.sheet_path, r.sheet_taken_at, a.status from public.talk_records r join public.talk_attendees a on a.record_id = r.id where r.id = $1", [id])).rows[0];
      check("Paper sheet photo saves with the record; the person on it stays not signed",
        row?.sheet_path === base + "sheet.jpg" && !!row.sheet_taken_at && row.status === "not_signed");
      check("A sheet photo has to be in that talk's own folder",
        await fails(() => { const c2 = randomUUID(); return as(userA, "select public.save_talk_record($1::jsonb, $2::jsonb) as id", [JSON.stringify({ ...JSON.parse(rec(coA, c2, [])[0]), sheet_path: base + "sheet.jpg", sheet_taken_at: new Date().toISOString() }), "[]"]); }));
    }

    // Weekly lock and makeups.
    const monday = (offsetWeeks) => {
      const d = new Date();
      d.setUTCHours(0, 0, 0, 0);
      d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7) + offsetWeeks * 7);
      return d.toISOString().slice(0, 10);
    };
    const nextWk = monday(1), laterWk = monday(2), pastWk = monday(-2);
    const tuesday = new Date(Date.parse(monday(3)) + 86400000).toISOString().slice(0, 10);
    const setOverride = (user, company, wk, talk = "heat") =>
      as(user, "insert into public.plan_overrides (company_id, week_start, talk_id) values ($1, $2, $3) on conflict (company_id, week_start) do update set talk_id = excluded.talk_id", [company, wk, talk]);
    await setOverride(userA, coA, nextWk);
    await setOverride(userB, coB, nextWk);
    const ovA = await as(userA, "select company_id from public.plan_overrides");
    check("A sees only A's plan changes", ovA.rows.length === 1 && ovA.rows[0].company_id === coA, `${ovA.rows.length} visible`);
    check("A cannot change B's plan", await fails(() => setOverride(userA, coB, laterWk)));
    check("A presenter cannot change the plan", await fails(() => setOverride(presenterA, coA, laterWk)));
    check("A presenter can read the plan", (await as(presenterA, "select week_start from public.plan_overrides")).rows.length === 1);
    {
      // Daily pre-task plans: their own kind, no week, never a makeup, and they don't lock the weekly talk.
      const daily = (extra) => JSON.stringify({ ...JSON.parse(rec(coA, randomUUID(), [])[0]), talk_id: "pretask", record_kind: "daily",
        pretask: { tasks: ["Tear off"], hazards: [{ hazard: "Falls", control: "Tie off" }] }, ...extra });
      const id = (await as(userA, "select public.save_talk_record($1::jsonb, '[]'::jsonb) as id", [daily({})])).rows[0].id;
      const row = (await as(userA, "select record_kind, week_start, pretask->'tasks'->>0 as task from public.talk_records where id = $1", [id])).rows[0];
      check("A daily plan saves as its own kind with its plan and no week", row?.record_kind === "daily" && row.week_start === null && row.task === "Tear off");
      check("A daily plan can't claim a week", await fails(() => as(userA, "select public.save_talk_record($1::jsonb, '[]'::jsonb)", [daily({ week_start: nextWk, week_number: 2 })])));
      check("A daily plan can't be a makeup", await fails(() => as(userA, "select public.save_talk_record($1::jsonb, '[]'::jsonb)", [daily({ makeup_for_week: pastWk, makeup_reason: "x" })])));
      check("A weekly talk can't carry a daily plan", await fails(() => as(userA, "select public.save_talk_record($1::jsonb, '[]'::jsonb)", [JSON.stringify({ ...JSON.parse(rec(coA, randomUUID(), [])[0]), pretask: { tasks: ["x"] } })])));
      check("A daily plan doesn't lock the week's talk", (await setOverride(userA, coA, nextWk, "ladders").then(() => true, () => false)));
      check("B can't see A's daily plan", (await as(userB, "select id from public.talk_records where id = $1", [id])).rows.length === 0);
    }
    check("A week that's over can't be changed", await fails(() => setOverride(userA, coA, pastWk)));
    check("Plan weeks must start on a Monday", await fails(() => setOverride(userA, coA, tuesday)));
    // Picked talk lists (Admin → Talks): company-scoped, admins only, and only for weeks that haven't started.
    const setList = (user, company, wk, ids = ["fork", "racking"]) =>
      as(user, "insert into public.company_talk_lists (company_id, from_week, talk_ids) values ($1, $2, $3) on conflict (company_id, from_week) do update set talk_ids = excluded.talk_ids", [company, wk, ids]);
    await setList(userA, coA, nextWk);
    await setList(userB, coB, nextWk);
    const tlA = await as(userA, "select company_id from public.company_talk_lists");
    check("A sees only A's talk lists", tlA.rows.length === 1 && tlA.rows[0].company_id === coA, `${tlA.rows.length} visible`);
    check("A cannot set B's talk list", await fails(() => setList(userA, coB, laterWk)));
    check("A cannot remove B's talk list", (await as(userA, "delete from public.company_talk_lists where company_id = $1 returning 1", [coB])).rows.length === 0
      && (await as(userB, "select 1 from public.company_talk_lists where company_id = $1", [coB])).rows.length === 1);
    check("A presenter can read the talk list", (await as(presenterA, "select 1 from public.company_talk_lists")).rows.length === 1);
    check("A presenter cannot change the talk list", await fails(() => setList(presenterA, coA, laterWk)));
    check("A talk list can't start this week", await fails(() => setList(userA, coA, monday(0))));
    check("A talk list can't start in the past", await fails(() => setList(userA, coA, pastWk)));
    check("A talk list starts on a Monday", await fails(() => setList(userA, coA, tuesday)));
    check("A talk list needs at least one talk", await fails(() => setList(userA, coA, laterWk, [])));
    check("A future talk list can be replaced", !(await fails(() => setList(userA, coA, nextWk, ["fork"]))));
    check("A future talk list can be removed", (await as(userA, "delete from public.company_talk_lists where company_id = $1 and from_week = $2 returning 1", [coA, nextWk])).rows.length === 1);
    // A list that has started is kept as it was: backdate one as the database owner, then try to change it.
    await db.query("alter table public.company_talk_lists disable trigger company_talk_lists_lock");
    await db.query("insert into public.company_talk_lists (company_id, from_week, talk_ids, set_by) values ($1, $2, $3, $4)", [coA, pastWk, ["fork"], userA]);
    await db.query("alter table public.company_talk_lists enable trigger company_talk_lists_lock");
    check("A talk list that has started can't be changed", await fails(() => setList(userA, coA, pastWk, ["racking"])));
    check("…or removed", await fails(() => as(userA, "delete from public.company_talk_lists where company_id = $1 and from_week = $2", [coA, pastWk])));

    // Cadence (Admin → Plan): company-scoped, admins only, only for changes that start after today.
    const setCad = (user, company, wk, weeks = 4) =>
      as(user, "insert into public.company_cadences (company_id, from_week, weeks) values ($1, $2, $3) on conflict (company_id, from_week) do update set weeks = excluded.weeks", [company, wk, weeks]);
    await setCad(userB, coB, nextWk, 2);
    check("A cannot set B's cadence", await fails(() => setCad(userA, coB, laterWk)));
    check("A sees no cadence of B's", (await as(userA, "select 1 from public.company_cadences")).rows.length === 0);
    check("A presenter cannot set the cadence", await fails(() => setCad(presenterA, coA, nextWk)));
    check("A cadence can't start today or earlier", await fails(() => setCad(userA, coA, monday(0))));
    check("A cadence is 1, 2 or 4 weeks", await fails(() => setCad(userA, coA, nextWk, 3)));
    check("A cadence starts on a Monday", await fails(() => setCad(userA, coA, tuesday)));
    check("A future cadence can be set and removed", !(await fails(() => setCad(userA, coA, laterWk)))
      && (await as(userA, "delete from public.company_cadences where company_id = $1 and from_week = $2 returning 1", [coA, laterWk])).rows.length === 1);
    // Repeat talks (Admin → Plan): same rules as cadences.
    const setRep = (user, company, wk, every = 12, talk = "loto") =>
      as(user, "insert into public.company_repeats (company_id, talk_id, from_week, every_months) values ($1, $2, $3, $4) on conflict (company_id, talk_id, from_week) do update set every_months = excluded.every_months", [company, talk, wk, every]);
    await setRep(userB, coB, nextWk, 3);
    check("A cannot set B's repeats", await fails(() => setRep(userA, coB, laterWk)));
    check("A sees no repeat of B's", (await as(userA, "select 1 from public.company_repeats")).rows.length === 0);
    check("A presenter cannot set repeats", await fails(() => setRep(presenterA, coA, nextWk)));
    check("A repeat can't start today or earlier", await fails(() => setRep(userA, coA, monday(0))));
    check("A repeat is 0, 3, 6 or 12 months", await fails(() => setRep(userA, coA, nextWk, 4)));
    check("A future repeat can be set and removed", !(await fails(() => setRep(userA, coA, laterWk)))
      && (await as(userA, "delete from public.company_repeats where company_id = $1 and talk_id = 'loto' and from_week = $2 returning 1", [coA, laterWk])).rows.length === 1);
    // Safety profile (Reports → Safety profile): self-reported EMR and program documents. Admins of the company
    // only, append-only, private files.
    await as(userA, "insert into public.company_emr (company_id, rating_year, emr) values ($1, 2026, 0.92)", [coA]);
    check("A admin can add an EMR entry", (await as(userA, "select emr from public.company_emr")).rows.length === 1);
    check("B sees no EMR of A's", (await as(userB, "select 1 from public.company_emr")).rows.length === 0);
    check("A presenter can't read or add the EMR", (await as(presenterA, "select 1 from public.company_emr")).rows.length === 0
      && await fails(() => as(presenterA, "insert into public.company_emr (company_id, rating_year, emr) values ($1, 2025, 1.1)", [coA])));
    check("An EMR entry can't be changed or deleted", await fails(() => as(userA, "update public.company_emr set emr = 0.5"))
      && await fails(() => as(userA, "delete from public.company_emr")));
    check("B can't add an EMR to A", await fails(() => as(userB, "insert into public.company_emr (company_id, rating_year, emr) values ($1, 2026, 0.7)", [coA])));
    const docPath = `${coA}/${randomUUID()}-manual.pdf`;
    await as(userA, "insert into storage.objects (bucket_id, name) values ('company-docs', $1)", [docPath]);
    await as(userA, "insert into public.company_documents (company_id, kind, title, path) values ($1, 'safety_program', 'Safety manual', $2)", [coA, docPath]);
    check("A admin can add a program document", (await as(userA, "select title from public.company_documents")).rows[0]?.title === "Safety manual");
    check("B sees neither A's document nor its file", (await as(userB, "select 1 from public.company_documents")).rows.length === 0
      && (await as(userB, "select 1 from storage.objects where name = $1", [docPath])).rows.length === 0);
    check("A presenter can't see the company documents", (await as(presenterA, "select 1 from storage.objects where bucket_id = 'company-docs'")).rows.length === 0);
    check("A document must point into the company's own folder", await fails(() =>
      as(userA, "insert into public.company_documents (company_id, kind, title, path) values ($1, 'other', 'x', $2)", [coA, `${coB}/x.pdf`])));
    check("B can't put a file in A's documents folder", await fails(() => as(userB, "insert into storage.objects (bucket_id, name) values ('company-docs', $1)", [`${coA}/y.pdf`])));
    // Every 4 weeks since 10 weeks ago: periods start at -10, -6 and -2 weeks. The one that started two weeks ago can
    // still be swapped (it isn't over), then locks once given; the one before it is over. Backdate the cadence as
    // the database owner, since the app can't.
    const periodStart = monday(-2);
    await db.query("alter table public.company_cadences disable trigger company_cadences_lock");
    await db.query("insert into public.company_cadences (company_id, from_week, weeks, set_by) values ($1, $2, 4, $3)", [coB, monday(-10), userB]);
    await db.query("alter table public.company_cadences enable trigger company_cadences_lock");
    check("A cadence that has started can't be changed", await fails(() => setCad(userB, coB, monday(-10), 1)));
    check("A 4-week period's talk can be swapped until the period ends", !(await fails(() => setOverride(userB, coB, periodStart, "ppe"))));
    check("…but not a 4-week period that's over", await fails(() => setOverride(userB, coB, monday(-6), "ppe")));
    const recB = (wk, extra = {}) => [JSON.stringify({ company_id: coB, client_id: randomUUID(), talk_id: "ppe", language: "en", content: { title: "PPE" },
      presenter_name: "Presenter", held_at: new Date().toISOString(), week_number: 1, week_start: wk, ...extra }), "[]"];
    const savedB = (await as(userB, "select public.save_talk_record($1::jsonb, $2::jsonb) as id", recB(periodStart, { period_weeks: 4 }))).rows[0].id;
    check("A record keeps how many weeks its talk period covered",
      (await as(userB, "select period_weeks from public.talk_records where id = $1", [savedB])).rows[0]?.period_weeks === 4);
    check("Once a 4-week period's talk is given, it's locked", await fails(() => setOverride(userB, coB, periodStart, "fall")));
    const oldRec = (await as(userB, "select public.save_talk_record($1::jsonb, $2::jsonb) as id", recB(monday(-8)))).rows[0].id;
    check("A record saved without a period length counts as one week",
      (await as(userB, "select period_weeks from public.talk_records where id = $1", [oldRec])).rows[0]?.period_weeks === 1);

    const recWk = (company, clientId, wk, extra = {}) => [
      JSON.stringify({ company_id: company, client_id: clientId, talk_id: "heat", language: "en", content: { title: "Heat" },
        presenter_name: "Presenter", held_at: new Date().toISOString(), week_number: 2, week_start: wk, ...extra }),
      "[]",
    ];
    const saveWk = (...a) => as(userA, "select public.save_talk_record($1::jsonb, $2::jsonb) as id", recWk(...a));
    // A makeup held next week for an earlier week must NOT lock next week's talk.
    await saveWk(coA, randomUUID(), nextWk, { makeup_for_week: monday(0), makeup_reason: "Off that week" });
    check("A makeup doesn't lock the week it was held in", !(await fails(() => setOverride(userA, coA, nextWk, "heat"))));
    await saveWk(coA, randomUUID(), nextWk);
    check("Once a week is recorded, its talk is locked", await fails(() => setOverride(userA, coA, nextWk, "fall")));
    check("…and its plan change can't be removed", await fails(() => as(userA, "delete from public.plan_overrides where company_id = $1 and week_start = $2", [coA, nextWk])));
    check("An unrecorded future week can still be changed", !(await fails(() => setOverride(userA, coA, laterWk))));
    const thisWk = monday(0);
    const mk = (await saveWk(coA, randomUUID(), thisWk, { makeup_for_week: pastWk, makeup_reason: "Out sick" })).rows[0].id;
    check("A makeup keeps its real week and names the week it makes up",
      (await as(userA, "select week_start::text ws, makeup_for_week::text mf, makeup_reason from public.talk_records where id = $1", [mk]))
        .rows.every((r) => r.ws === thisWk && r.mf === pastWk && r.makeup_reason === "Out sick"));
    check("A makeup without a reason is rejected", await fails(() => saveWk(coA, randomUUID(), thisWk, { makeup_for_week: pastWk, makeup_reason: "  " })));
    check("A makeup can't be for a later week", await fails(() => saveWk(coA, randomUUID(), pastWk, { makeup_for_week: thisWk, makeup_reason: "x" })));
    check("Locations default to jobsite; office is allowed",
      (await as(userA, "insert into public.jobsites (company_id, name, kind) values ($1, 'Office', 'office') returning kind", [coA])).rows[0].kind === "office" &&
      (await as(userA, "select kind from public.jobsites where name = 'A yard'")).rows[0].kind === "site");
    // (in company B, so A's people counts used by the leak check stay the same)
    const pid = (await as(userB, "insert into public.people (company_id, full_name) values ($1, 'Leaving soon') returning id", [coB])).rows[0].id;
    await as(userB, "update public.people set active = false, deactivated_at = '2000-01-01' where id = $1", [pid]);
    const gone = (await as(userB, "select deactivated_at from public.people where id = $1", [pid])).rows[0];
    check("Deactivating stamps the date, and the app can't backdate it", gone.deactivated_at && new Date(gone.deactivated_at).getFullYear() > 2000);
    await as(userB, "update public.people set active = true where id = $1", [pid]);
    check("Reactivating clears it", (await as(userB, "select deactivated_at from public.people where id = $1", [pid])).rows[0].deactivated_at === null);
    await as(userB, "update public.people set active = false where id = $1", [pid]);
    check("Makeup limit defaults to 4 weeks, admin can change it",
      (await as(userA, "update public.companies set makeup_weeks = 8 where id = $1 returning makeup_weeks", [coA])).rows[0]?.makeup_weeks === 8);
    // Brand colors: admins set their own company's; nobody else can; only real colors are stored.
    check("A new company starts with the default colors", (await as(userA, "select theme from public.companies where id = $1", [coA])).rows[0]?.theme && Object.keys((await as(userA, "select theme from public.companies where id = $1", [coA])).rows[0].theme).length === 0);
    check("An admin can change their company's colors",
      (await as(userA, "update public.companies set theme = $2 where id = $1 returning theme", [coA, { brand: "#123456", action: "#AA3300" }])).rows[0]?.theme?.brand === "#123456");
    check("A can't change B's colors", (await as(userA, "update public.companies set theme = $2 where id = $1", [coB, { brand: "#000000" }])).rowCount === 0);
    check("A presenter can't change the colors", (await as(presenterA, "update public.companies set theme = $2 where id = $1", [coA, { brand: "#000000" }])).rowCount === 0);
    check("Only hex colors for known parts are stored", await fails(() => as(userA, "update public.companies set theme = $2 where id = $1", [coA, { brand: "red" }]))
      && await fails(() => as(userA, "update public.companies set theme = $2 where id = $1", [coA, { logo: "#000000" }])));

    // Industries: the 14 added codes are accepted, unknown ones refused.
    check("A company can be a roofing or healthcare company", (await as(userA, "update public.companies set industry = 'roof' where id = $1 returning industry", [coA])).rows[0]?.industry === "roof"
      && (await as(userA, "update public.companies set industry = 'health' where id = $1 returning industry", [coA])).rows[0]?.industry === "health");
    check("Unknown industries are refused", await fails(() => as(userA, "update public.companies set industry = 'pirates' where id = $1", [coA])));
    await as(userA, "update public.companies set industry = 'con' where id = $1", [coA]);
    // Where the crew works: starts unset (the industry default), admins set their own, nobody else can, only known values.
    check("A new company has no work setting until it picks one", (await as(userA, "select work_setting from public.companies where id = $1", [coA])).rows[0]?.work_setting === null);
    check("An admin can set where their crew works",
      (await as(userA, "update public.companies set work_setting = 'outdoor' where id = $1 returning work_setting", [coA])).rows[0]?.work_setting === "outdoor");
    check("A can't change where B's crew works", (await as(userA, "update public.companies set work_setting = 'indoor' where id = $1", [coB])).rowCount === 0);
    check("A presenter can't change where the crew works", (await as(presenterA, "update public.companies set work_setting = 'indoor' where id = $1", [coA])).rowCount === 0);
    check("Only known work settings are stored", await fails(() => as(userA, "update public.companies set work_setting = 'underwater' where id = $1", [coA])));
    const siteA = (await as(userA, "insert into public.jobsites (company_id, name) values ($1, 'Example warehouse') returning id", [coA])).rows[0].id;
    check("A jobsite starts on the company's work setting", (await as(userA, "select work_setting from public.jobsites where id = $1", [siteA])).rows[0]?.work_setting === null);
    check("An admin can set where the crew works at a jobsite",
      (await as(userA, "update public.jobsites set work_setting = 'indoor' where id = $1 returning work_setting", [siteA])).rows[0]?.work_setting === "indoor");
    check("B can't change A's jobsite setting", (await as(userB, "update public.jobsites set work_setting = 'outdoor' where id = $1", [siteA])).rowCount === 0);
    check("A presenter can't change a jobsite setting", (await as(presenterA, "update public.jobsites set work_setting = 'outdoor' where id = $1", [siteA])).rowCount === 0);
    check("Only known jobsite work settings are stored", await fails(() => as(userA, "update public.jobsites set work_setting = 'space' where id = $1", [siteA])));

    // Site notes, heat, and issues raised at a talk.
    const personA = (await as(userA, "select id from public.people where company_id = $1 limit 1", [coA])).rows[0].id;
    const personB = (await as(userB, "select id from public.people where company_id = $1 limit 1", [coB])).rows[0].id;
    const talk = (company, clientId, issues) => [
      JSON.stringify({ company_id: company, client_id: clientId, talk_id: "heat", language: "en", content: { title: "Heat" },
        presenter_name: "Presenter", held_at: new Date().toISOString(), site_notes: " Tie off at the ridge ",
        heat: { max_heat_index_f: 104, level: "danger", reminder_read: true } }),
      "[]",
      JSON.stringify(issues),
    ];
    const issueClient = randomUUID();
    const iss = [{ client_id: issueClient, description: "East ladder cracked", owner_person_id: personA, owner_name: "A worker", due_date: "2030-01-01" }];
    const tClient = randomUUID();
    const tId = (await as(userA, "select public.save_talk($1::jsonb, $2::jsonb, $3::jsonb) as id", talk(coA, tClient, iss))).rows[0].id;
    await as(userA, "select public.save_talk($1::jsonb, $2::jsonb, $3::jsonb) as id", talk(coA, tClient, iss)); // retry
    const saved = (await as(userA, "select site_notes, heat->>'level' lvl from public.talk_records where id = $1", [tId])).rows[0];
    check("Site notes and heat save with the record", saved.site_notes === "Tie off at the ridge" && saved.lvl === "danger");
    // The signing statement: saved with the record, each signer's tap time with their row; absent people get none.
    const stClient = randomUUID(), tapped = "2030-01-01T12:00:00.000Z";
    const stId = (await as(userA, "select public.save_talk($1::jsonb, $2::jsonb, $3::jsonb) as id", [
      JSON.stringify({ company_id: coA, client_id: stClient, talk_id: "heat", language: "es", content: { title: "Calor" }, presenter_name: "Presenter",
        held_at: new Date().toISOString(), signing_statement: { text: "Al firmar, confirmo que asistí a esta charla.", en: "By signing, I confirm I attended this talk.", language: "es", version: 1 } }),
      JSON.stringify([
        { person_id: personA, name: "A worker", status: "absent", confirmed_at: tapped },
        { person_id: null, name: "Walk-in", status: "not_signed", confirmed_at: tapped },
      ]),
      "[]",
    ])).rows[0].id;
    const st = (await as(userA, "select signing_statement from public.talk_records where id = $1", [stId])).rows[0]?.signing_statement;
    check("The signing statement saves with the record, in the language read and in English", st?.version === 1 && st?.en.startsWith("By signing") && st?.text.startsWith("Al firmar"));
    check("No statement time is kept for anyone who didn't sign",
      (await as(userA, "select confirmed_at from public.talk_attendees where record_id = $1", [stId])).rows.every((r) => r.confirmed_at === null));
    check("A malformed signing statement is refused", await fails(() => as(userA, "select public.save_talk($1::jsonb, '[]'::jsonb, '[]'::jsonb)", [
      JSON.stringify({ company_id: coA, client_id: randomUUID(), talk_id: "heat", language: "en", content: { title: "Heat" }, presenter_name: "P", held_at: new Date().toISOString(), signing_statement: { text: 5 } })])));
    check("B can't read A's signing statement", (await as(userB, "select signing_statement from public.talk_records where id = $1", [stId])).rows.length === 0);
    check("A saved statement can't be changed", await fails(() => as(userA, "update public.talk_records set signing_statement = null where id = $1", [stId])));
    const issuesA = await as(userA, "select id, record_id, status from public.talk_issues");
    check("Issues save with their talk, once even when retried", issuesA.rows.length === 1 && issuesA.rows[0].record_id === tId && issuesA.rows[0].status === "open");
    const issueId = issuesA.rows[0].id;
    check("B sees none of A's issues", (await as(userB, "select id from public.talk_issues")).rows.length === 0);
    check("B can't change A's issues", (await as(userB, "update public.talk_issues set status = 'fixed' where id = $1", [issueId])).rowCount === 0);
    check("B can't raise an issue in A", await fails(() => as(userB, "insert into public.talk_issues (company_id, client_id, description) values ($1, $2, 'x')", [coA, randomUUID()])));
    check("An issue's owner must be in the same company", await fails(() => as(userA, "insert into public.talk_issues (company_id, client_id, description, owner_person_id) values ($1, $2, 'x', $3)", [coA, randomUUID(), personB])));
    await as(presenterA, "update public.talk_issues set description = 'rewritten', status = 'fixed', fixed_note = 'Replaced' where id = $1", [issueId]);
    const fixed = (await as(userA, "select description, status, fixed_at, fixed_by, fixed_note from public.talk_issues where id = $1", [issueId])).rows[0];
    check("A presenter can mark an issue fixed; it stamps who and when", fixed.status === "fixed" && fixed.fixed_at && fixed.fixed_by === presenterA && fixed.fixed_note === "Replaced");
    check("What was raised can't be rewritten", fixed.description === "East ladder cracked");
    check("Issues can't be deleted", await fails(() => as(userA, "delete from public.talk_issues where id = $1", [issueId])));

    // Safety log (Admin → Safety log): admins only; crews see approved crew summaries through crew_bulletins.
    const logEvent = (user, company, extra = {}) => as(user,
      "insert into public.safety_events (company_id, client_id, kind, occurred_on, title, details, crew_summary, case_status, summary_status) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id",
      [company, randomUUID(), extra.kind ?? "inspection", extra.on ?? new Date().toISOString().slice(0, 10), extra.title ?? "Scaffold check",
        extra.details ?? "Inspector: Pat Example. Plank cracked.", extra.summary ?? "A cracked plank on the north scaffold was replaced.",
        extra.case_status ?? null, extra.status ?? "draft"]);
    const evA = (await logEvent(userA, coA)).rows[0].id;
    const evB = (await logEvent(userB, coB, { summary: "B's summary" })).rows[0].id;
    const since = new Date(Date.now() - 7 * 86400000).toISOString();
    const bulletins = (user, company) => as(user, "select id, crew_summary from public.crew_bulletins($1, $2)", [company, since]);
    check("A sees only A's safety log", (await as(userA, "select company_id from public.safety_events")).rows.every((r) => r.company_id === coA)
      && (await as(userA, "select 1 from public.safety_events")).rows.length === 1);
    check("A presenter can't read the safety log itself (details and names stay with admins)", (await as(presenterA, "select 1 from public.safety_events")).rows.length === 0);
    check("A presenter can't log an event", await fails(() => logEvent(presenterA, coA)));
    check("A can't log an event in B", await fails(() => logEvent(userA, coB)));
    check("An event can't be logged as already approved", await fails(() => logEvent(userA, coA, { status: "reviewed" })));
    check("Only citations carry a case status", await fails(() => logEvent(userA, coA, { case_status: "contested" })));
    check("A draft summary isn't read to crews", (await bulletins(presenterA, coA)).rows.length === 0);
    await as(userA, "update public.safety_events set summary_status = 'reviewed' where id = $1", [evA]);
    const approved = (await as(userA, "select reviewed_by, reviewed_at from public.safety_events where id = $1", [evA])).rows[0];
    check("Approving stamps who and when", approved.reviewed_by === userA && approved.reviewed_at);
    const crew = (await bulletins(presenterA, coA)).rows;
    check("Once approved, crews get the summary (and only crew-safe columns)", crew.length === 1 && crew[0].crew_summary.includes("cracked plank") && !("details" in crew[0]));
    check("B can't read A's crew summaries", (await bulletins(userB, coA)).rows.length === 0);
    await as(userA, "update public.safety_events set crew_summary = 'rewritten', summary_status = 'draft', occurred_on = '2020-01-01' where id = $1", [evA]);
    const kept = (await as(userA, "select crew_summary, summary_status, occurred_on::text d from public.safety_events where id = $1", [evA])).rows[0];
    check("An approved summary can't be changed or un-approved", kept.crew_summary.includes("cracked plank") && kept.summary_status === "reviewed" && kept.d !== "2020-01-01");
    check("B can't change A's events", (await as(userB, "update public.safety_events set title = 'x' where id = $1", [evA])).rowCount === 0);
    check("A presenter can't change events", (await as(presenterA, "update public.safety_events set title = 'x' where id = $1", [evA])).rowCount === 0);
    check("Events can't be deleted", await fails(() => as(userA, "delete from public.safety_events where id = $1", [evA])));
    check("Withdrawing needs a reason", await fails(() => as(userA, "update public.safety_events set withdrawn_at = now() where id = $1", [evA])));
    await as(userA, "update public.safety_events set withdrawn_at = now(), withdrawn_reason = 'Logged twice' where id = $1", [evA]);
    check("A withdrawn event isn't read to crews", (await bulletins(presenterA, coA)).rows.length === 0);
    await as(userA, "update public.safety_events set withdrawn_at = null, withdrawn_reason = '' where id = $1", [evA]);
    check("…and stays withdrawn", (await as(userA, "select withdrawn_reason from public.safety_events where id = $1", [evA])).rows[0].withdrawn_reason === "Logged twice");
    const cit = (await logEvent(userA, coA, { kind: "citation", case_status: "contested", summary: "Alleged: guardrail missing on the east edge." })).rows[0].id;
    check("A citation keeps its case status", (await as(userA, "select case_status from public.safety_events where id = $1", [cit])).rows[0].case_status === "contested");
    await as(userA, "insert into public.talk_issues (company_id, client_id, description, event_id) values ($1, $2, 'Add guardrail on east edge', $3)", [coA, randomUUID(), cit]);
    check("A finding goes on the issues list, linked to its event", (await as(userA, "select 1 from public.talk_issues where event_id = $1", [cit])).rows.length === 1);
    check("An issue can't point at another company's event", await fails(() => as(userA, "insert into public.talk_issues (company_id, client_id, description, event_id) values ($1, $2, 'x', $3)", [coA, randomUUID(), evB])));
    const eventFile = (user, path) => as(user, "insert into storage.objects (bucket_id, name) values ('event-files', $1)", [path]);
    check("An admin can attach a file to their company's event", !(await fails(() => eventFile(userA, `${coA}/${evA}/report.pdf`))));
    check("A presenter can't attach event files", await fails(() => eventFile(presenterA, `${coA}/${evA}/x.pdf`)));
    check("A presenter can't read event files", (await as(presenterA, "select 1 from storage.objects where bucket_id = 'event-files'")).rows.length === 0);
    check("A can't attach a file to B's folder", await fails(() => eventFile(userA, `${coB}/${evB}/x.pdf`)));
    check("Event files can't be deleted", (await as(userA, "delete from storage.objects where bucket_id = 'event-files'")).rowCount === 0);
    check("A presenter can't turn on the Since last talk section", (await as(presenterA, "update public.companies set since_last_enabled = true where id = $1", [coA])).rowCount === 0);
    check("The Since last talk window is one of the set choices", await fails(() => as(userA, "update public.companies set since_last_window = '7' where id = $1", [coA])));

    const rolesA = await as(userA, "select company_id from public.roles");
    check("New company gets its default roles, and A sees only A's", rolesA.rows.length === 6 && rolesA.rows.every((r) => r.company_id === coA), `${rolesA.rows.length} visible`);
    check("A cannot add a role to B", await fails(() => as(userA, "insert into public.roles (company_id, name) values ($1, 'Intruder')", [coB])));
    check("A cannot add a person to B", await fails(() => as(userA, "insert into public.people (company_id, full_name) values ($1, 'intruder')", [coB])));
    const upd = await as(userA, "update public.people set full_name = 'renamed' where company_id = $1", [coB]);
    check("A cannot change B's people", upd.rowCount === 0, `${upd.rowCount} rows changed`);
    check("A cannot put A's person on B's team", await fails(() => as(userA, "insert into public.people (company_id, full_name, team_id) values ($1, 'x', $2)", [coA, teamB])));
    check("A cannot make themselves a member of B", await fails(() => as(userA, "insert into public.company_members (company_id, user_id, access) values ($1, $2, 'admin')", [coB, userA])));
    check("A presenter can read A's people", (await as(presenterA, "select id from public.people")).rows.length === 2);
    check("A presenter cannot add people", await fails(() => as(presenterA, "insert into public.people (company_id, full_name) values ($1, 'x')", [coA])));
    check("Signed-out visitors read nothing", await fails(() => as(null, "select id from public.people")));
    check("Signed-out visitors cannot create a company", await fails(() => as(null, "select public.create_company('x', 'con')")));

    // Prove the leak check can fail: switch RLS off on people, expect the check to catch B's row, switch it back.
    await db.query("alter table public.people disable row level security");
    const caught = !(await leakCheck());
    await db.query("alter table public.people enable row level security");
    check("Leak check FAILS when RLS is off (proves the test has teeth)", caught);
    check("Leak check passes again with RLS back on", await leakCheck());
  } finally {
    await db.end().catch(() => {});
    await admin.query(`drop database if exists ${dbName}`);
    await admin.end();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} isolation checks passed`);
  // Guard against a run that "passes" because checks silently stopped running.
  const EXPECTED = 53;
  if (results.length < EXPECTED) {
    console.error(`Expected at least ${EXPECTED} checks, ran ${results.length}`);
    process.exit(1);
  }
  if (failed.length) process.exit(1);
}

main().catch((e) => {
  console.error("Isolation test could not run:", e.message);
  process.exit(1);
});
