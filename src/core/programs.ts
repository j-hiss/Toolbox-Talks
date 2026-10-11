// Written safety programs: the company fills in a template from src/content/programs.ts, an owner or admin approves
// it, and it's saved as a version that never changes (migration 0047). Pure module.
//
// - Each template section is one element the rule lists, with its paragraph. The company writes how it does that
//   element; the app never writes it for them and never says the program meets the rule.
// - Every program is offered to every company (a plant can have a crew in a trench). The company's own industry
//   comes first, using the same rule as talks and checklists (checklistsFor in src/core/inspections.ts).
// - A yearly review: where the rule asks for one ("at least annually"), the program is due 12 months after its last
//   version. A review with no changes is saved as its own version, so the record shows it was looked at.
import { checklistsFor } from "./inspections";
import type { IndustryId } from "./industries";

export type ProgramSection = {
  id: string;
  heading: string;
  /** The paragraph that lists this element. */
  rule: string;
  /** What to write, in plain words, faithful to the rule. */
  ask: string;
  /** A labelled example to show the shape of an answer (never pre-filled). */
  example?: string;
  /** Optional sections apply only in some workplaces (shown with "if this applies"). */
  optional?: boolean;
};

export type ProgramTemplate = {
  id: string;
  version: number;
  title: string;
  /** The rule that asks for the written program. */
  rule: string;
  /** Who has to have it, in the rule's terms. */
  appliesIf: string;
  /** Industries it's most likely to apply to ("all" for every company); the rest still see it under More. */
  industries: (IndustryId | "all")[];
  /** Where the rule says the written program is kept or who may see it. */
  keep: string;
  /** Set when the rule asks for a review on a schedule. */
  review: { months: 12; cite: string; what: string } | null;
  sources: { label: string; url: string; kind: "standard" | "guidance" }[];
  sections: ProgramSection[];
};

export type ProgramRow = {
  program_key: string; template_version: number; version: number; answers: Record<string, string>;
  approved_name: string; approved_title: string; review_only: boolean; note: string; created_at: string;
};

export type ProgramDraft = { answers: Record<string, string>; approved_name: string; approved_title: string; note: string };

/** Programs for this company: its industry's first, then the rest ("More programs"). */
export function programsFor(all: ProgramTemplate[], industry: IndustryId): { mine: ProgramTemplate[]; more: ProgramTemplate[] } {
  const mine = checklistsFor(all, industry);
  return { mine, more: all.filter((t) => !mine.includes(t)) };
}

/** The latest saved version of each program. */
export function latestPrograms(rows: ProgramRow[]): Map<string, ProgramRow> {
  const out = new Map<string, ProgramRow>();
  for (const r of rows) { const p = out.get(r.program_key); if (!p || r.version > p.version) out.set(r.program_key, r); }
  return out;
}

/** When the latest version was last changed in substance (the newest version that wasn't review-only). */
export function lastChanged(rows: ProgramRow[], key: string): ProgramRow | null {
  return rows.filter((r) => r.program_key === key && !r.review_only).sort((a, b) => b.version - a.version)[0] ?? null;
}

export type ProgramState =
  | { kind: "not_started" }
  | { kind: "on_file"; at: string; reviewDue: string | null }
  | { kind: "review_due"; at: string; reviewDue: string }
  | { kind: "template_changed"; at: string; from: number; to: number };

/** Where a program stands: not started, on file, yearly review due, or the template has a newer edition. */
export function programState(t: ProgramTemplate, latest: ProgramRow | undefined, now: Date = new Date()): ProgramState {
  if (!latest) return { kind: "not_started" };
  if (latest.template_version < t.version) return { kind: "template_changed", at: latest.created_at, from: latest.template_version, to: t.version };
  if (!t.review) return { kind: "on_file", at: latest.created_at, reviewDue: null };
  const due = new Date(latest.created_at); due.setMonth(due.getMonth() + t.review.months);
  const dueDay = due.toISOString().slice(0, 10);
  return due <= now ? { kind: "review_due", at: latest.created_at, reviewDue: dueDay } : { kind: "on_file", at: latest.created_at, reviewDue: dueDay };
}

/** What stops a save, in plain words, or null. Required sections need an answer; the approver needs a name. */
export function programProblem(t: ProgramTemplate, d: ProgramDraft): string | null {
  const missing = t.sections.filter((s) => !s.optional && !(d.answers[s.id] ?? "").trim());
  if (missing.length) return `Fill in ${missing.length === 1 ? `"${missing[0].heading}"` : `${missing.length} sections, starting with "${missing[0].heading}"`}.`;
  const long = t.sections.find((s) => (d.answers[s.id] ?? "").length > 4000);
  if (long) return `"${long.heading}" is too long (4,000 characters at most). Put the detail in an attached document instead.`;
  if (!d.approved_name.trim()) return "Type the name of the person approving this program.";
  if (d.approved_name.trim().length > 120 || d.approved_title.length > 120) return "Keep the name and title under 120 characters.";
  if (d.note.length > 500) return "Keep the note under 500 characters.";
  return null;
}

/** Answers to save: only this template's sections, trimmed, empty optional ones left out. */
export function cleanAnswers(t: ProgramTemplate, answers: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const s of t.sections) { const v = (answers[s.id] ?? "").trim(); if (v) out[s.id] = v; }
  return out;
}

/** True when nothing changed from the latest version (so a save is a review, not a change). */
export function sameAnswers(t: ProgramTemplate, a: Record<string, string>, b: Record<string, string>): boolean {
  const x = cleanAnswers(t, a), y = cleanAnswers(t, b);
  return t.sections.every((s) => (x[s.id] ?? "") === (y[s.id] ?? ""));
}

/** Counts for Admin and the safety profile: how many programs are on file and how many need a review. */
export function programCounts(all: ProgramTemplate[], rows: ProgramRow[], now: Date = new Date()): { onFile: number; reviewDue: number; templateChanged: number } {
  const latest = latestPrograms(rows);
  let onFile = 0, reviewDue = 0, templateChanged = 0;
  for (const t of all) {
    const s = programState(t, latest.get(t.id), now);
    if (s.kind === "not_started") continue;
    onFile++;
    if (s.kind === "review_due") reviewDue++;
    if (s.kind === "template_changed") templateChanged++;
  }
  return { onFile, reviewDue, templateChanged };
}
