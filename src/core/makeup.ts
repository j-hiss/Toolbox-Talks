// Locked weeks and makeups. Pure module: the one place that decides which week a talk counts toward, which past
// weeks can still be made up, and who still needs a week's talk.
//
// A makeup is never back-dated. It keeps its real date, week and GPS, and also names the past week it makes up
// and why. Reports count it toward that past week and show it as a makeup, so on-time vs. late stays visible.
import { buildPlan, thisWeek, type PlanInput, type PlanWeek } from "./plan";
import { addDays, isoDay, mondayOf, parseDay } from "./weeks";

/** Quick picks for why a talk is being made up. "Other" needs a note. */
export const MAKEUP_REASONS = ["Off that week", "Out sick", "New hire", "No work that week (weather, job gap)", "Other"] as const;
export type MakeupReason = (typeof MAKEUP_REASONS)[number];

/** The reason as saved: the pick, plus the note when there is one. Empty string = not valid yet. */
export function makeupReasonText(pick: string, note: string): string {
  const n = note.trim();
  if (!pick) return "";
  if (pick === "Other") return n ? `Other: ${n}` : "";
  return n ? `${pick}: ${n}` : pick;
}

/** The week a saved talk counts toward: the week it makes up, or the week it was held. */
export function creditWeek(r: { week_start: string | null; makeup_for_week?: string | null }): string | null {
  return r.makeup_for_week ?? r.week_start;
}

/** The plan entry for any week, including weeks in an earlier 52-week cycle. Null before the program starts. */
export function planWeekAt(input: Omit<PlanInput, "today">, monday: Date): PlanWeek | null {
  if (monday < mondayOf(parseDay(input.programStart))) return null;
  return thisWeek(buildPlan({ ...input, today: monday }), monday);
}

/**
 * Past weeks that can still be made up, newest first: up to `limit` weeks back from this week, never before the
 * program started. Each comes with the talk that was scheduled for it (admin swaps included).
 */
export function makeupWeeks(input: Omit<PlanInput, "today">, limit: number, today: Date = new Date()): PlanWeek[] {
  const thisMonday = mondayOf(today);
  const out: PlanWeek[] = [];
  for (let k = 1; k <= Math.max(0, Math.floor(limit)); k++) {
    const w = planWeekAt(input, addDays(thisMonday, -7 * k));
    if (!w) break;
    out.push(w);
  }
  return out;
}

/** True when `weekKey` is a past week inside the makeup limit. */
export function canMakeUp(weekKey: string, limit: number, today: Date = new Date()): boolean {
  const thisMonday = mondayOf(today);
  const wk = parseDay(weekKey);
  return wk < thisMonday && wk >= addDays(thisMonday, -7 * Math.floor(limit));
}

/** Active people who have not signed for the week (on time or by makeup). */
export function stillNeeds<P extends { id: string; active: boolean }>(people: P[], signedIds: Iterable<string>): P[] {
  const signed = new Set(signedIds);
  return people.filter((p) => p.active && !signed.has(p.id));
}

/** Person ids who signed for `weekKey` (as attendee, or as the presenter), from saved records. */
export function signedFor(
  weekKey: string,
  records: {
    week_start: string | null; makeup_for_week: string | null; attendees: { person_id: string | null; status: string }[];
    presenter_person_id?: string | null; presenter_signed_at?: string | null;
  }[],
): string[] {
  const ids = new Set<string>();
  for (const r of records) {
    if (creditWeek(r) !== weekKey) continue;
    for (const a of r.attendees) if (a.person_id && a.status === "signed") ids.add(a.person_id);
    if (r.presenter_person_id && r.presenter_signed_at) ids.add(r.presenter_person_id); // presenting counts
  }
  return [...ids];
}

/** An admin can swap a week's talk only while the week isn't over and nobody has given it yet. */
export function canChangeWeek(weekKey: string, recordedWeeks: Iterable<string>, today: Date = new Date()): boolean {
  if (parseDay(weekKey) < mondayOf(today)) return false; // week is over
  return !new Set(recordedWeeks).has(weekKey);
}

export const weekKeyOf = (d: Date) => isoDay(mondayOf(d));
