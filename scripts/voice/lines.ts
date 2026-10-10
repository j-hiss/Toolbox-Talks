// Step 1 of making recorded audio (run on your computer): list every line that needs a recording.
//   npm run voice:lines
// Writes audio-out/lines.json: [{ lang, voice, speed, key, text }] for lines not already in audio-out/<voice>/.
// Only voices that docs/voice-licenses.md marks "Yes" for commercial use are included; only English and reviewed
// translations are recorded (draft translations keep the phone's voice).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TALKS } from "../../src/content/talks";
import { VOICES } from "../../src/content/voices";
import { crewText } from "../../src/content/ui";
import { heatReminder, heatReminderReviewed } from "../../src/content/heat";
import { LANGUAGES, type LanguageId } from "../../src/core/languages";
import { audioKey, normalizeLine, recordableLines } from "../../src/core/voice";

const root = join(import.meta.dirname, "..", "..");
const out = join(root, "audio-out");

/** Voices with a "Yes" in the commercial-use column of docs/voice-licenses.md. */
export function approvedVoices(md: string): Set<string> {
  const ok = new Set<string>();
  for (const row of md.split("\n").filter((l) => l.startsWith("|"))) {
    const cells = row.split("|").map((c) => c.trim());
    const voice = cells[3]?.replace(/[`*\\]/g, "");
    if (voice && /^yes\b/i.test(cells[5] ?? "")) ok.add(voice);
  }
  return ok;
}

function main() {
  const approved = approvedVoices(readFileSync(join(root, "docs", "voice-licenses.md"), "utf8"));
  const rows: { lang: LanguageId; voice: string; speed: number; key: string; text: string }[] = [];
  for (const { id: lang } of LANGUAGES.filter((l) => l.ready)) {
    const v = VOICES[lang];
    if (!v) continue;
    if (!approved.has(v.voice)) { console.log(`Skipping ${lang}: voice ${v.voice} isn't marked "Yes" for commercial use in docs/voice-licenses.md.`); continue; }
    const have = new Set<string>(existsSync(join(out, v.voice, "manifest.json")) ? JSON.parse(readFileSync(join(out, v.voice, "manifest.json"), "utf8")) : []);
    const lines = new Set<string>();
    for (const t of TALKS) {
      const text = t.content[lang];
      if (!text || (lang !== "en" && t.translationStatus[lang] !== "reviewed")) continue;
      recordableLines(text, crewText(lang).ask).forEach((l) => lines.add(l));
    }
    // Fixed lines the talk screen reads around the talk itself.
    if (lang === "en" || heatReminderReviewed[lang]) { const h = heatReminder(lang); [...h.items].forEach((l) => lines.add(normalizeLine(l))); }
    lines.add(lang === "es" ? "Hoy en este sitio" : "Today on this site");
    for (const text of lines) {
      const key = audioKey(text, lang, v.voice);
      if (!have.has(key)) rows.push({ lang, voice: v.voice, speed: v.speed, key, text });
    }
  }
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "lines.json"), JSON.stringify(rows, null, 1));
  console.log(`${rows.length} line(s) to record → audio-out/lines.json. Next: python3 scripts/voice/generate.py`);
}

if (process.argv[1]?.endsWith("lines.ts")) main();
