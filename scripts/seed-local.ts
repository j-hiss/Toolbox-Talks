#!/usr/bin/env node
// Fills your LOCAL database with test data: a made-up company ("Example Test Co (test data)") with three crews,
// people, jobsites and about three months of talks (signatures, crew photos, walk-ins, makeups, misses, heat,
// issues). Run it again any time: it removes the previous test company first and builds a fresh one.
//
//   npm run seed -- --email you@yourcompany.com
//
// * LOCAL ONLY. It refuses to run unless both the app's Supabase URL and the database are on this computer.
// * Saves talks the same way the app does (signatures and photos to private storage, then save_talk), as a test
//   owner account, so row-level security and the database checks apply. Your account is added as an owner of the
//   test company so you see it in the app's company switcher. Your real companies are never touched.
// * Uses the database directly only for what the app can't do: back-dating when people joined or left and when
//   issues were fixed (so past weeks report correctly), adding you to the company, and removing the old test company.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { TALKS } from "@/content/talks";
import { heatReminder, HEAT_REMINDER_VERSION } from "@/content/heat";
import { talkText } from "@/core/talks";
import { buildAttendees, recordPayload, toUpload, TALK_FILES_BUCKET, type RosterEntry, type Signature } from "@/core/record";
import { addDays, isoDay, mondayOf } from "@/core/weeks";
import { buildSeed, rng, SEED_COMPANY, staffDates } from "./seed/build";
import { examplePhoto, exampleSignature } from "./seed/png";

const SEED_OWNER = { email: "toolbox-seed@example.com", password: "local-test-data-only-2026" };
const root = join(import.meta.dirname, "..");

function env(): Record<string, string> {
  const out: Record<string, string> = { ...process.env } as Record<string, string>;
  const file = join(root, ".env.local");
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && out[m[1]] === undefined) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return out;
}

const isLocal = (u: string) => { try { return ["127.0.0.1", "localhost", "::1", "[::1]"].includes(new URL(u).hostname); } catch { return false; } };
const fail = (msg: string): never => { console.error(`\n✗ ${msg}\n`); process.exit(1); };
const step = (msg: string) => console.log(`• ${msg}`);

/**
 * Back-dating needs one of the "the app can't move this date" triggers off for a moment. Done in one transaction,
 * so the trigger is back on before anything else can see the table (and stays on if anything fails).
 */
async function withTriggerOff(db: pg.Client, table: string, trigger: string, fn: () => Promise<void>) {
  await db.query("begin");
  try {
    await db.query(`alter table ${table} disable trigger ${trigger}`);
    await fn();
    await db.query(`alter table ${table} enable trigger ${trigger}`);
    await db.query("commit");
  } catch (err) { await db.query("rollback"); throw err; }
}

/** --dry-run: plan the data and make the images, touch nothing. */
function dryRun() {
  const plan = buildSeed(new Date());
  const rand = rng(2026);
  const sig = exampleSignature(rand), photo = examplePhoto(rand);
  const count = (f: (t: (typeof plan.talks)[number]) => number) => plan.talks.reduce((n, t) => n + f(t), 0);
  console.log(`Plan for "${SEED_COMPANY}" (nothing saved):`);
  console.log(`  ${plan.teams.length} crews, ${plan.people.length} people, ${plan.jobsites.length} places, program started ${plan.company.program_start}`);
  console.log(`  ${plan.talks.length} talks (${count((t) => (t.makeup ? 1 : 0))} makeups), ${count((t) => t.attendees.filter((a) => "walkin" in a).length)} walk-ins, ${count((t) => (t.photo ? 1 : 0))} photos, ${count((t) => t.issues.length)} issues`);
  console.log(`  example signature ${Math.round(sig.length / 1024)} KB, example photo ${Math.round(photo.length / 1024)} KB`);
}

async function main() {
  if (process.argv.includes("--dry-run")) return dryRun();
  const args = process.argv.slice(2);
  const emailArg = args[args.indexOf("--email") + 1];
  const email = (args.includes("--email") ? emailArg : env().SEED_EMAIL ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) fail("Tell it which account should see the test company:\n  npm run seed -- --email you@yourcompany.com");

  const e = env();
  const url = e.NEXT_PUBLIC_SUPABASE_URL, anon = e.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const dbUrl = e.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
  if (!url || !anon) fail("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY aren't set. Copy .env.example to .env.local and fill them from `npx supabase status`.");
  if (!isLocal(url) || !isLocal(dbUrl)) fail(`This only fills a database on this computer. The app points at ${new URL(url).hostname}; the database at ${new URL(dbUrl).hostname}. Nothing was changed.`);

  const db = new pg.Client({ connectionString: dbUrl });
  try { await db.connect(); } catch { fail("Can't reach the local database. Start it with `npm run db:start`, then try again."); }

  try {
    const cols = await db.query("select 1 from information_schema.columns where table_schema = 'public' and table_name = 'talk_records' and column_name = 'photo_path'");
    if (!cols.rowCount) fail("The local database is missing the latest changes. Run `npx supabase migration up`, then try again.");

    const me = (await db.query("select id from auth.users where lower(email) = $1", [email])).rows[0]?.id as string | undefined;
    if (!me) fail(`No account for ${email} in the local database yet. Open the app, sign in once with that email (the code shows up in the local mail viewer, http://127.0.0.1:54324), then run this again.`);

    // 1. Remove the previous test company (local only; records are append-only in the app, so this is done here).
    const old = (await db.query("select id from public.companies where name = $1", [SEED_COMPANY])).rows.map((r) => r.id as string);
    for (const id of old) {
      // Its files: best effort (newer local Storage may refuse direct deletes; leftover test files are harmless).
      await db.query("begin");
      try {
        await db.query("set local storage.allow_delete_query = 'true'");
        await db.query("delete from storage.objects where bucket_id = $1 and name like $2", [TALK_FILES_BUCKET, `${id}/%`]);
        await db.query("commit");
      } catch { await db.query("rollback"); }
      // Then its data, children first (records point at people and places), all or nothing.
      await db.query("begin");
      try {
        for (const t of ["talk_issues", "talk_attendees", "talk_records"]) await db.query(`delete from public.${t} where company_id = $1`, [id]);
        await db.query("delete from public.companies where id = $1", [id]); // people, crews, places, members go with it
        await db.query("commit");
      } catch (err) { await db.query("rollback"); throw err; }
    }
    if (old.length) step(`Removed the previous test company (${old.length}).`);

    // 2. Sign in as the test owner (made on first run; local sign-ups need no email confirmation).
    const sb: SupabaseClient = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
    let session = await sb.auth.signInWithPassword(SEED_OWNER);
    if (session.error) {
      const up = await sb.auth.signUp(SEED_OWNER);
      if (up.error) fail(`Couldn't create the test owner account: ${up.error.message}`);
      session = await sb.auth.signInWithPassword(SEED_OWNER);
      if (session.error) fail(`Couldn't sign in as the test owner: ${session.error.message}`);
    }
    const ok = <T,>(r: { data: T; error: { message: string } | null }, what: string): T => { if (r.error) fail(`${what}: ${r.error.message}`); return r.data; };

    const today = new Date();
    const plan = buildSeed(today);
    const rand = rng(2026);

    // 3. Company, then you as an owner of it.
    const coId = ok(await sb.rpc("create_company", { company_name: plan.company.name, company_industry: plan.company.industry, company_zip: plan.company.zip }), "Creating the company") as string;
    const { name: _n, industry: _i, zip: _z, ...details } = plan.company;
    void _n; void _i; void _z;
    ok(await sb.from("companies").update(details).eq("id", coId).select("id"), "Saving company details");
    await db.query("insert into public.company_members (company_id, user_id, access) values ($1, $2, 'owner') on conflict do nothing", [coId, me]);
    step(`Made "${SEED_COMPANY}" and added ${email} as an owner.`);

    // 4. Teams, people, jobsites.
    const roles = ok(await sb.from("roles").select("id, name").eq("company_id", coId), "Reading roles") as { id: string; name: string }[];
    const roleId = (name: string | null) => (name ? roles.find((r) => r.name === name)?.id ?? null : null);
    const teamIds = new Map<string, string>();
    for (const t of plan.teams) {
      const row = ok(await sb.from("teams").insert({ company_id: coId, name: t.name }).select("id").single(), "Adding a team") as { id: string };
      teamIds.set(t.name, row.id);
    }
    const personIds = new Map<string, string>();
    for (const p of plan.people) {
      const row = ok(await sb.from("people").insert({
        company_id: coId, full_name: p.name, role_id: roleId(p.role), team_id: p.team ? teamIds.get(p.team) : null, preferred_language: p.language,
        employee_id: `EX-${1000 + personIds.size}`,
      }).select("id").single(), "Adding a person") as { id: string };
      personIds.set(p.key, row.id);
    }
    for (const t of plan.teams) ok(await sb.from("teams").update({ lead_person_id: personIds.get(t.lead) }).eq("id", teamIds.get(t.name)!).select("id"), "Setting a team lead");
    const siteIds = new Map<string, string>();
    for (const j of plan.jobsites) {
      const row = ok(await sb.from("jobsites").insert({ company_id: coId, name: j.name, address: j.address, latitude: j.latitude, longitude: j.longitude, kind: j.kind }).select("id").single(), "Adding a jobsite") as { id: string };
      siteIds.set(j.key, row.id);
    }
    // When people joined and left, so past weeks expect the right people (database only; the app stamps "now").
    for (const p of plan.people) {
      if (p.leftWeeksAgo !== undefined) ok(await sb.from("people").update({ active: false }).eq("id", personIds.get(p.key)!).select("id"), "Deactivating a person");
    }
    await withTriggerOff(db, "public.people", "people_stamp_deactivated", async () => {
      for (const p of plan.people) {
        const d = staffDates(p, today);
        await db.query("update public.people set created_at = $2, deactivated_at = $3 where id = $1", [personIds.get(p.key), d.createdAt, d.deactivatedAt]);
      }
    });
    step(`Added ${plan.teams.length} crews, ${plan.people.length} people (1 new hire, 1 who left), ${plan.jobsites.length} places.`);

    // 5. Talks, saved like the app saves them: files to private storage, then the record and its issues.
    const person = (key: string) => plan.people.find((p) => p.key === key)!;
    const roleName = (key: string) => person(key).role ?? "Team member";
    const fixes: { clientId: string; at: Date; note: string }[] = [];
    let photos = 0, walkins = 0, makeups = 0, issues = 0;
    for (const t of plan.talks) {
      const talk = TALKS.find((x) => x.id === t.talkId) ?? TALKS[0];
      const { text, lang } = talkText(talk, t.language);
      const signedAt = (i: number) => new Date(t.heldAt.getTime() + (8 + i) * 60_000).toISOString();
      const roster: RosterEntry[] = t.attendees.map((a, i) => "walkin" in a
        ? { key: `walkin:${i}`, personId: null, name: a.walkin.name, role: "Not on roster", teamName: "", company: a.walkin.company }
        : { key: a.personKey, personId: personIds.get(a.personKey)!, name: person(a.personKey).name, role: roleName(a.personKey), teamName: person(a.personKey).team ?? "" });
      const present: Record<string, boolean> = {}, sigs: Record<string, Signature> = {};
      t.attendees.forEach((a, i) => {
        const k = roster[i].key;
        present[k] = a.here;
        if (a.signed) sigs[k] = { image: exampleSignature(rand), signedAt: signedAt(i) };
      });
      const lead = person(t.presenterKey);
      const team = t.teamKey ? plan.teams.find((x) => x.name === t.teamKey) : null;
      const record = recordPayload({
        companyId: coId, clientId: crypto.randomUUID(), talkId: talk.id, language: lang,
        content: lang === "en" ? text : { ...text, en: talk.content.en },
        week: t.weekNumber ? { number: t.weekNumber, start: isoDay(mondayOf(t.heldAt)), scheduledTalkId: t.scheduledTalkId ?? talk.id } : null,
        jobsite: { id: siteIds.get(t.jobsiteKey)!, name: plan.jobsites.find((j) => j.key === t.jobsiteKey)!.name },
        team: team ? { id: teamIds.get(team.name)!, name: team.name, leadName: person(team.lead).name } : { id: "", name: t.teamName, leadName: "" },
        presenter: { personId: personIds.get(t.presenterKey)!, name: lead.name, role: lead.role ?? "", signature: t.presenterSigned ? { image: exampleSignature(rand), signedAt: signedAt(-3) } : null },
        heldAt: t.heldAt.toISOString(),
        gps: (() => { const j = plan.jobsites.find((x) => x.key === t.jobsiteKey)!; return j.latitude == null ? null : { latitude: j.latitude + (rand() - 0.5) * 0.0004, longitude: j.longitude! + (rand() - 0.5) * 0.0004, accuracyMeters: 8 + Math.round(rand() * 20) }; })(),
        makeup: t.makeup,
        siteNotes: t.siteNotes,
        photo: t.photo ? { image: examplePhoto(rand), takenAt: signedAt(t.attendees.length + 1) } : null,
        heat: t.heat ? {
          max_heat_index_f: t.heat.max, level: t.heat.level, reminder_read: t.heat.reminderRead, checked_at: new Date(t.heldAt.getTime() - 30 * 60_000).toISOString(),
          source: "Example forecast (test data)", ...(t.heat.reminderRead ? { reminder: { ...heatReminder(lang), version: HEAT_REMINDER_VERSION } } : {}),
        } : null,
      });
      if (record.team_id === "") record.team_id = null;
      const attendees = buildAttendees(roster, present, sigs);
      const issuePayload = t.issues.map((x) => ({
        client_id: crypto.randomUUID(), description: x.description, owner_person_id: personIds.get(x.ownerKey)!, owner_name: person(x.ownerKey).name,
        due_date: isoDay(addDays(t.heldAt, x.dueInDays)), raised_by_name: lead.name, raised_at: t.heldAt.toISOString(),
      }));
      t.issues.forEach((x, i) => { if (x.fixed) fixes.push({ clientId: issuePayload[i].client_id, at: addDays(t.heldAt, x.fixed.afterDays), note: x.fixed.note }); });

      const up = toUpload(record, attendees);
      for (const f of up.files) {
        const r = await sb.storage.from(TALK_FILES_BUCKET).upload(f.path, Buffer.from(f.image.split(",")[1], "base64"), { contentType: f.contentType, upsert: false });
        if (r.error) fail(`Uploading ${f.path}: ${r.error.message}`);
      }
      ok(await sb.rpc("save_talk", { record: up.record, attendees: up.attendees, issues: issuePayload }), `Saving a talk from ${t.heldAt.toDateString()}`);
      photos += t.photo ? 1 : 0; walkins += t.attendees.filter((a) => "walkin" in a).length; makeups += t.makeup ? 1 : 0; issues += t.issues.length;
    }
    step(`Saved ${plan.talks.length} talks: ${makeups} makeups, ${walkins} walk-ins, ${photos} crew photos, ${issues} issues raised.`);

    // 6. Fix some of the issues (as the app would), then date the fixes when they happened.
    for (const f of fixes) ok(await sb.from("talk_issues").update({ status: "fixed", fixed_note: f.note }).eq("client_id", f.clientId).select("id"), "Marking an issue fixed");
    if (fixes.length) {
      await withTriggerOff(db, "public.talk_issues", "talk_issues_guard", async () => {
        for (const f of fixes) await db.query("update public.talk_issues set fixed_at = $2 where client_id = $1", [f.clientId, f.at]);
      });
    }
    step(`${fixes.length} issues marked fixed, the rest still open.`);

    console.log(`\n✓ Done. Open the app, sign in as ${email}, and pick "${SEED_COMPANY}" in the company menu on Home.`);
    console.log("  Run this again any time for a fresh copy. Your other companies weren't touched.\n");
  } finally {
    await db.end();
  }
}

main().catch((e) => fail(e instanceof Error ? e.message : String(e)));
