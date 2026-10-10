// "Tailor with AI": adapt a library talk to one company's work as a DRAFT the admin checks and saves as their own
// talk (src/core/ownTalks.ts). Pure module, shared by the app and the tailor-talk server function
// (supabase/functions/tailor-talk), so the prompt and the checks are the same in both places. Relative imports only.
//
// Rules the prompt and the checks hold to:
// - Keep every safety requirement, number and rule reference the source talk has; never add a number, distance,
//   limit or regulation the source doesn't state; never say anything is compliant.
// - Same shape as every talk: title, opening line, sections with points, a question for the crew. Plain words.
// - The result is a draft. It is only ever saved by an admin, as a company talk marked AI-drafted.

export type TalkTextLike = { title: string; hook: string; sections: { heading: string; items: string[] }[]; ask: string };

export type TailorRequest = {
  companyId: string;
  /** The library talk's id and English text, and its source labels (so the model can't invent rules). */
  baseId: string;
  talk: TalkTextLike;
  sources: string[];
  industry: string;          // e.g. "Roofing: Residential and commercial roofing"
  workSetting: string;       // e.g. "Jobsites"
  notes: string;             // what the admin typed about their work, up to MAX_NOTES
};

export const MAX_NOTES = 600;
export const DAILY_LIMIT = 20;

export const SYSTEM_PROMPT = [
  "You adapt a workplace safety toolbox talk to one company's work. A foreman reads it aloud to a crew in about five minutes.",
  "Hard rules:",
  "1. Keep every safety requirement, number, distance, limit and rule reference that is in the source talk. Do not weaken or drop any.",
  "2. Never add a number, distance, limit, deadline, regulation or citation that the source talk and its sources do not state.",
  "3. Never say or imply that anything is compliant, approved or certified.",
  "4. Use the company's details only to make examples concrete (their equipment, sites, tasks). If a detail would change a safety rule, leave the rule as it is.",
  "5. Plain, short sentences a crew understands on first hearing. No jargon, no marketing, no emoji.",
  "6. Same shape as the source: a title, one opening line, 2 to 5 sections each with a short heading and 2 to 5 points, and one question to ask the crew.",
  "Answer with only a JSON object: {\"title\": string, \"hook\": string, \"sections\": [{\"heading\": string, \"items\": [string]}], \"ask\": string}.",
].join("\n");

/** The user message: the company, the admin's notes, the source talk and its sources. */
export function tailorPrompt(r: TailorRequest): string {
  return [
    `Company industry: ${r.industry}`,
    `Where they work: ${r.workSetting}`,
    r.notes.trim() ? `About their work, in the company's words:\n${r.notes.trim().slice(0, MAX_NOTES)}` : "The company added no notes; keep the talk general for this industry.",
    "",
    "Source talk (JSON):",
    JSON.stringify(r.talk),
    "",
    "The rules this talk is based on (do not add others):",
    ...r.sources.map((s) => `- ${s}`),
  ].join("\n");
}

/** Every number in a text, normalized (so "6 feet" and "6-foot" both give "6"). */
export const numbersIn = (text: string) => new Set((text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => n.replace(",", ".")));

/**
 * Parse and check the model's answer. Returns the talk, or a plain-words reason it can't be used. Rejects a draft that
 * adds a number the source didn't have, or drops a rule reference the source had.
 */
export function checkTailored(raw: string, source: TalkTextLike, sources: string[]): { talk: TalkTextLike } | { problem: string } {
  const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
  let t: TalkTextLike;
  try { t = JSON.parse(json); } catch { return { problem: "The AI's answer wasn't readable. Try again." }; }
  const str = (v: unknown) => typeof v === "string" && v.trim().length > 0;
  if (!str(t.title) || !str(t.hook) || !str(t.ask) || !Array.isArray(t.sections) || t.sections.length < 1 || t.sections.length > 8
    || t.sections.some((s) => !str(s?.heading) || !Array.isArray(s.items) || s.items.length < 1 || s.items.some((i) => !str(i)))) {
    return { problem: "The AI's draft was missing parts of a talk. Try again." };
  }
  const all = (x: TalkTextLike) => [x.title, x.hook, x.ask, ...x.sections.flatMap((s) => [s.heading, ...s.items])].join(" ");
  const allowed = new Set([...numbersIn(all(source)), ...numbersIn(sources.join(" "))]);
  const added = [...numbersIn(all(t))].filter((n) => !allowed.has(n));
  if (added.length) return { problem: `The AI's draft added numbers the source talk doesn't have (${added.slice(0, 3).join(", ")}). Try again, or write it yourself.` };
  if (/\bcomplian(t|ce)\b|\bcertified\b|\bapproved by osha\b/i.test(all(t))) return { problem: "The AI's draft talked about compliance. Try again." };
  const refs = (x: string) => new Set(x.match(/\b19[12]\d\.\d+(?:\([a-z0-9]+\))*/gi) ?? []);
  const lost = [...refs(all(source))].filter((ref) => !all(t).includes(ref));
  if (lost.length) return { problem: `The AI's draft dropped a rule reference (${lost[0]}). Try again.` };
  return { talk: { title: t.title.trim(), hook: t.hook.trim(), ask: t.ask.trim(), sections: t.sections.map((s) => ({ heading: s.heading.trim(), items: s.items.map((i) => i.trim()) })) } };
}
