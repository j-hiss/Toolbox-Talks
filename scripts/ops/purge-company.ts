// Remove a closed company for good, on your own computer:
//   npm run ops:purge-company -- "<exact company name>"              (dry run: shows what would go)
//   npm run ops:purge-company -- "<exact company name>" --confirm    (removes rows, then files)
//   npm run ops:purge-company -- --files-only <company id>            (finish removing files if a run stopped)
//
// Rules (the database enforces them too, in platform_purge_company, migration 0042): only 30 days or more after the
// company's owner asked to close, and only with the exact name. Rows go first (the database checks and logs it), then
// every file under the company's folder in each private bucket.
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local. The service key stays on your computer.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BUCKETS = ["talk-files", "person-certs", "company-docs", "event-files"]; // same as FILE_BUCKETS in src/lib/data/account.ts
const WAIT_DAYS = 30;
const root = join(import.meta.dirname, "..", "..");

function env(): Record<string, string> {
  const file = join(root, ".env.local");
  const vars: Record<string, string> = {};
  if (existsSync(file)) for (const line of readFileSync(file, "utf8").split("\n")) { const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/); if (m) vars[m[1]] = m[2]; }
  return { ...vars, ...process.env } as Record<string, string>;
}

async function listFiles(sb: SupabaseClient, bucket: string, prefix: string, depth = 0): Promise<string[]> {
  if (depth > 5) return [];
  const out: string[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await sb.storage.from(bucket).list(prefix, { limit: 1000, offset });
    if (error) throw new Error(`${bucket}/${prefix}: ${error.message}`);
    for (const f of data ?? []) {
      const path = `${prefix}/${f.name}`;
      if (f.id) out.push(path); else out.push(...await listFiles(sb, bucket, path, depth + 1));
    }
    if (!data || data.length < 1000) break;
  }
  return out;
}

async function removeFiles(sb: SupabaseClient, companyId: string, really: boolean): Promise<number> {
  let total = 0;
  for (const bucket of BUCKETS) {
    const paths = await listFiles(sb, bucket, companyId);
    total += paths.length;
    console.log(`  ${bucket}: ${paths.length} file(s)`);
    if (!really) continue;
    for (let i = 0; i < paths.length; i += 100) {
      const { error } = await sb.storage.from(bucket).remove(paths.slice(i, i + 100));
      if (error) throw new Error(`${bucket}: ${error.message}. Run again with --files-only ${companyId} to finish.`);
    }
  }
  return total;
}

async function main() {
  const args = process.argv.slice(2);
  const e = env();
  const url = e.NEXT_PUBLIC_SUPABASE_URL, key = e.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local (never commit it).");
  const sb = createClient(url, key, { auth: { persistSession: false } });

  if (args[0] === "--files-only") {
    const id = args[1];
    if (!id || !/^[0-9a-f-]{36}$/.test(id)) throw new Error("Give the company id: --files-only <id>");
    const { data, error } = await sb.from("companies").select("id").eq("id", id);
    if (error || !Array.isArray(data)) throw new Error(`Couldn't check that company: ${error?.message ?? "no answer"}. Nothing removed.`);
    if (data.length) throw new Error("That company still exists. Remove its rows first (run with its name and --confirm).");
    console.log(`Removing files for removed company ${id}:`);
    await removeFiles(sb, id, true);
    console.log("Done.");
    return;
  }

  const name = args.find((a) => !a.startsWith("--"));
  const confirm = args.includes("--confirm");
  if (!name) throw new Error('Give the exact company name: npm run ops:purge-company -- "Company Name"');
  const { data: found, error } = await sb.from("companies").select("id, name").eq("name", name);
  if (error) throw new Error(error.message);
  if (!found?.length) throw new Error(`No company named exactly "${name}".`);
  if (found.length > 1) throw new Error(`${found.length} companies are named "${name}". Remove one from the console instead.`);
  const co = found[0] as { id: string; name: string };
  const { data: acct } = await sb.from("company_accounts").select("closure_requested_at").eq("company_id", co.id).single();
  const asked = (acct as { closure_requested_at: string | null } | null)?.closure_requested_at;
  if (!asked) throw new Error(`${co.name} hasn't asked to close. Nothing removed.`);
  const from = new Date(new Date(asked).getTime() + WAIT_DAYS * 86_400_000);
  if (from > new Date()) throw new Error(`${co.name} asked to close on ${asked.slice(0, 10)}; it can be removed from ${from.toISOString().slice(0, 10)}. Nothing removed.`);

  const count = async (t: string) => (await sb.from(t).select("id", { count: "exact", head: true }).eq("company_id", co.id)).count ?? 0;
  console.log(`${co.name} (${co.id}): asked to close ${asked.slice(0, 10)}.`);
  console.log(`  ${await count("people")} people, ${await count("talk_records")} talk records, ${await count("inspections")} inspections`);
  if (!confirm) {
    console.log("Files that would be removed:");
    await removeFiles(sb, co.id, false);
    console.log("\nDry run: nothing removed. Add --confirm to remove the rows and then the files. This can't be undone.");
    return;
  }
  const { error: purgeError } = await sb.rpc("platform_purge_company", { co: co.id, confirm_name: co.name });
  if (purgeError) throw new Error(`The database refused: ${purgeError.message}. Nothing removed.`);
  console.log("Rows removed (logged). Removing files:");
  const n = await removeFiles(sb, co.id, true);
  console.log(`Done. ${co.name} is removed: rows and ${n} file(s).`);
}

main().catch((err) => { console.error(err instanceof Error ? err.message : err); process.exit(1); });
