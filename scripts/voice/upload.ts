// Step 3 of making recorded audio (run on your computer): upload new recordings and each voice's manifest to the
// talk-audio bucket.   npm run voice:upload
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local. The service-role key stays on your
// computer: this script never runs in the app, and the bucket is read-only for everyone else.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = join(import.meta.dirname, "..", "..");
const out = join(root, "audio-out");

function env(): Record<string, string> {
  const file = join(root, ".env.local");
  const vars: Record<string, string> = {};
  if (existsSync(file)) for (const line of readFileSync(file, "utf8").split("\n")) { const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/); if (m) vars[m[1]] = m[2]; }
  return { ...vars, ...process.env } as Record<string, string>;
}

async function main() {
  const e = env();
  const url = e.NEXT_PUBLIC_SUPABASE_URL, key = e.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local (never commit it).");
  const sb = createClient(url, key, { auth: { persistSession: false } });
  if (!existsSync(out)) throw new Error("Nothing to upload: run npm run voice:lines and python3 scripts/voice/generate.py first.");
  for (const voice of readdirSync(out, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
    const folder = join(out, voice);
    const manifest: string[] = JSON.parse(readFileSync(join(folder, "manifest.json"), "utf8"));
    const { data: existing } = await sb.storage.from("talk-audio").list(voice, { limit: 100000 });
    const there = new Set((existing ?? []).map((f) => f.name));
    let sent = 0;
    for (const k of manifest) {
      if (there.has(`${k}.mp3`)) continue;
      const { error } = await sb.storage.from("talk-audio").upload(`${voice}/${k}.mp3`, readFileSync(join(folder, `${k}.mp3`)), { contentType: "audio/mpeg", upsert: false });
      if (error && !/exists|duplicate/i.test(error.message)) throw new Error(`${voice}/${k}.mp3: ${error.message}`);
      sent++;
    }
    // The manifest goes last, so the app never lists a file that isn't uploaded yet.
    const { error } = await sb.storage.from("talk-audio").upload(`${voice}/manifest.json`, JSON.stringify(manifest), { contentType: "application/json", upsert: true, cacheControl: "300" });
    if (error) throw new Error(`${voice}/manifest.json: ${error.message}`);
    console.log(`${voice}: ${sent} new file(s), ${manifest.length} in the manifest.`);
  }
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
