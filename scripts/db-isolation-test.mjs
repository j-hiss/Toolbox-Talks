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
    const sig = "data:image/png;base64,AAAA";
    const clientA = randomUUID();
    const save = (user, company, clientId, att) => as(user, "select public.save_talk_record($1::jsonb, $2::jsonb) as id", rec(company, clientId, att));
    const recA = (await save(userA, coA, clientA, [{ name: "W1", status: "signed", signature: sig }, { name: "W2", status: "absent" }])).rows[0].id;
    const again = (await save(userA, coA, clientA, [{ name: "W1", status: "signed", signature: sig }])).rows[0].id;
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
  const EXPECTED = 27;
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
