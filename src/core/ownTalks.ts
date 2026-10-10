// "Your own talks": talks a company writes itself, alongside the built-in library. Pure module.
//
// - Stored as versions (supabase/migrations/20261010000029_company_talks.sql): editing saves a new version and the
//   latest one is what's given from then on. A saved record keeps the exact text that was read, as with every talk.
// - Ids start with "own-", so they never collide with library talks and work in plans, swaps, makeups and records.
// - They don't join the automatic rotation by themselves (industries: []), so adding one never shifts planned weeks.
//   An admin adds them to the plan from Admin → Talks, swaps one into a week, or gives one any day.
// - Spanish is optional and stays a draft until someone who reads Spanish marks it reviewed, naming themselves.
import type { Talk, TalkText } from "./talks";

export const OWN_PREFIX = "own-";
export const isOwnTalk = (id: string) => id.startsWith(OWN_PREFIX);

export type OwnTalkRow = {
  talk_key: string; version: number; retired: boolean; title: string; minutes: number; code: string;
  content: { en: TalkText; es?: TalkText }; es_status: "none" | "draft" | "reviewed"; es_reviewed_by: string;
  based_on: string | null; created_at: string;
};

/** A fresh id for a new company talk. */
export function newTalkKey(rand: () => string = () => crypto.randomUUID()): string {
  return OWN_PREFIX + rand().replace(/-/g, "").slice(0, 12).toLowerCase();
}

/**
 * The latest version of each talk, newest first. Retired talks drop out unless `withRetired` (a week already planned
 * with a talk that was later retired still shows that talk's title).
 */
export function latestOwnTalks<R extends Pick<OwnTalkRow, "talk_key" | "version" | "retired" | "created_at">>(rows: R[], withRetired = false): R[] {
  const best = new Map<string, R>();
  for (const r of rows) { const cur = best.get(r.talk_key); if (!cur || r.version > cur.version) best.set(r.talk_key, r); }
  return [...best.values()].filter((r) => withRetired || !r.retired).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/** A company talk as a Talk the plan, picker and talk screens already understand. */
export function ownTalkToTalk(r: OwnTalkRow): Talk {
  const content: Talk["content"] = { en: r.content.en };
  if (r.content.es && r.es_status !== "none") content.es = r.content.es;
  return {
    id: r.talk_key, industries: [], code: r.code.trim() || "Company talk", minutes: r.minutes, sources: [],
    content, translationStatus: { en: "source", ...(content.es ? { es: r.es_status === "reviewed" ? "reviewed" : "draft" } : {}) },
  };
}

/** What's missing before a talk can be saved, in plain words, or null. Same shape rules as the library. */
export function ownTalkProblem(t: TalkText, es?: TalkText | null): string | null {
  if (!t.title.trim()) return "Give the talk a title.";
  if (!t.hook.trim()) return "Add an opening line: why this matters today.";
  const sections = t.sections.filter((s) => s.heading.trim() || s.items.some((i) => i.trim()));
  if (!sections.length) return "Add at least one section with a point or two.";
  if (sections.some((s) => !s.heading.trim())) return "Every section needs a heading.";
  if (sections.some((s) => !s.items.some((i) => i.trim()))) return "Every section needs at least one point.";
  if (!t.ask.trim()) return "Add a question to ask the crew at the end.";
  if (es) {
    // Spanish is read on its own, so it has to be whole: every part of the English, translated.
    const esSections = es.sections.filter((s) => s.heading.trim() || s.items.some((i) => i.trim()));
    const whole = es.title.trim() && es.hook.trim() && es.ask.trim() && esSections.length === sections.length
      && esSections.every((s) => s.heading.trim() && s.items.some((i) => i.trim()));
    if (!whole) return "Finish the Spanish: every box the English has, or remove the Spanish.";
  }
  return null;
}

/** Trim and drop empty lines and sections, so what's saved is exactly what's read. */
export function tidyTalkText(t: TalkText): TalkText {
  return {
    title: t.title.trim(), hook: t.hook.trim(), ask: t.ask.trim(),
    sections: t.sections.map((s) => ({ heading: s.heading.trim(), items: s.items.map((i) => i.trim()).filter(Boolean) }))
      .filter((s) => s.heading || s.items.length),
  };
}

/** A starting point copied from a library talk (the company then makes it its own). */
export function copyFromLibrary(t: Talk): { en: TalkText; es?: TalkText } {
  const clone = (x: TalkText): TalkText => ({ ...x, sections: x.sections.map((s) => ({ ...s, items: [...s.items] })) });
  return { en: clone(t.content.en), ...(t.content.es ? { es: clone(t.content.es) } : {}) };
}
