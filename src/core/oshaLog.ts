// OSHA 300 log and 300A summary. Pure module. Database side: supabase/migrations/20261010000031_injury_log.sql.
//
// Built from the OSHA forms' columns (29 CFR 1904.29, 1904.32), checked against the rule text on 2026-10-10:
// - Form 300, one line per recordable case: (A) case no., (B) employee's name, (C) job title, (D) date of injury or
//   onset of illness, (E) where the event occurred, (F) describe the injury or illness, parts of body affected, and
//   the object or substance that directly injured or made the person ill. Classify the case, one box only, the most
//   serious outcome: (G) death, (H) days away from work, (I) job transfer or restriction, (J) other recordable case.
//   Days: (K) away from work, (L) on job transfer or restriction. (M) type: (1) injury, (2) skin disorder,
//   (3) respiratory condition, (4) poisoning, (5) hearing loss, (6) all other illnesses.
// - Days are calendar days starting the day after the injury, whether or not the person was scheduled to work, and
//   may be capped at 180, days away and restricted together (1904.7(b)(3)-(4)).
// - Privacy concern cases (1904.29(b)(7)) show "Privacy case" instead of the name; the names go on a separate,
//   confidential list (1904.29(b)(6)).
// - Record a case within 7 calendar days of learning of it (1904.29(b)(3)).
// - The 300A totals the columns (zeros when there were no cases), adds the year, establishment, annual average
//   employees and total hours worked, is certified by a company executive, and is posted from February 1 to April 30
//   of the next year (1904.32).
// This documents what the company records. It never decides recordability or says a company is compliant.

export type Outcome = "death" | "days_away" | "restricted" | "other";
export type CaseKind = "injury" | "skin" | "respiratory" | "poisoning" | "hearing" | "other_illness";
export type PrivacyReason = "intimate" | "sexual_assault" | "mental_illness" | "infection" | "needlestick" | "employee_request";

export const OUTCOMES: { id: Outcome; col: "G" | "H" | "I" | "J"; label: string; hint: string }[] = [
  { id: "death", col: "G", label: "Death", hint: "The person died from the injury or illness." },
  { id: "days_away", col: "H", label: "Days away from work", hint: "Missed at least one day after the day it happened." },
  { id: "restricted", col: "I", label: "Job transfer or restriction", hint: "Couldn't do all their usual job, or was moved to another job, but didn't miss days." },
  { id: "other", col: "J", label: "Other recordable case", hint: "For example, medical treatment beyond first aid with no days away or restriction." },
];

export const KINDS: { id: CaseKind; n: 1 | 2 | 3 | 4 | 5 | 6; label: string }[] = [
  { id: "injury", n: 1, label: "Injury" },
  { id: "skin", n: 2, label: "Skin disorder" },
  { id: "respiratory", n: 3, label: "Respiratory condition" },
  { id: "poisoning", n: 4, label: "Poisoning" },
  { id: "hearing", n: 5, label: "Hearing loss" },
  { id: "other_illness", n: 6, label: "All other illnesses" },
];

/** 1904.29(b)(7), in plain words. */
export const PRIVACY_REASONS: { id: PrivacyReason; label: string }[] = [
  { id: "intimate", label: "An injury or illness to an intimate body part or the reproductive system" },
  { id: "sexual_assault", label: "An injury or illness from a sexual assault" },
  { id: "mental_illness", label: "A mental illness" },
  { id: "infection", label: "HIV infection, hepatitis or tuberculosis" },
  { id: "needlestick", label: "A needlestick or cut from a sharp object contaminated with someone else's blood or other potentially infectious material" },
  { id: "employee_request", label: "Another illness, and the person asked for their name to be left off" },
];

export const MAX_DAYS = 180;

export type InjuryCase = {
  case_key: string; version: number; year: number; case_no: number; removed: boolean; removed_reason: string;
  person_id: string | null; employee_name: string; job_title: string; injury_date: string; location: string; description: string;
  outcome: Outcome; days_away: number; days_restricted: number; kind: CaseKind; privacy: boolean; privacy_reason: PrivacyReason | null;
  created_at: string;
};

export type InjurySummary = {
  year: number; version: number; establishment: string; address: string; industry: string; naics: string;
  avg_employees: number | null; hours_worked: number | null; certifier_name: string; certifier_title: string; certifier_phone: string;
};

/** The latest version of each case for a year, by case number. Removed cases drop out unless `withRemoved`. */
export function latestCases<C extends Pick<InjuryCase, "case_key" | "version" | "removed" | "case_no">>(rows: C[], withRemoved = false): C[] {
  const best = new Map<string, C>();
  for (const r of rows) { const cur = best.get(r.case_key); if (!cur || r.version > cur.version) best.set(r.case_key, r); }
  return [...best.values()].filter((c) => withRemoved || !c.removed).sort((a, b) => a.case_no - b.case_no);
}

/** The latest 300A details for a year, or null. */
export function latestSummary(rows: InjurySummary[], year: number): InjurySummary | null {
  return rows.filter((r) => r.year === year).sort((a, b) => b.version - a.version)[0] ?? null;
}

export type CaseDraft = Omit<InjuryCase, "case_key" | "version" | "year" | "case_no" | "removed" | "removed_reason" | "created_at">;

/** What's missing or wrong before a case can be saved, in plain words, or null. Same rules as the database. */
export function caseProblem(c: CaseDraft, today: Date = new Date()): string | null {
  if (!c.employee_name.trim()) return "Add the person's name (it stays off the printed log for a privacy case).";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.injury_date)) return "Add the date it happened or the illness began.";
  if (c.injury_date > isoToday(today)) return "The date can't be in the future.";
  if (!c.description.trim()) return "Describe the injury or illness, the part of the body, and what caused it.";
  for (const d of [c.days_away, c.days_restricted]) if (!Number.isInteger(d) || d < 0 || d > MAX_DAYS) return `Days are whole numbers from 0 to ${MAX_DAYS}. Enter ${MAX_DAYS} when it ran longer.`;
  if (c.days_away + c.days_restricted > MAX_DAYS) return `Days away and restricted together stop at ${MAX_DAYS}.`;
  if (c.outcome === "days_away" && c.days_away < 1) return "A days-away case needs at least 1 day away.";
  if (c.outcome === "restricted" && c.days_restricted < 1) return "A restriction case needs at least 1 day of restriction or transfer.";
  if (c.outcome === "restricted" && c.days_away > 0) return "There were days away, so choose \"Days away from work\".";
  if (c.outcome === "other" && (c.days_away > 0 || c.days_restricted > 0)) return "There were days away or restricted, so choose the matching box.";
  if (c.privacy && !c.privacy_reason) return "Choose why it's a privacy case.";
  if (c.privacy_reason === "employee_request" && c.kind === "injury") return "Only an illness can be kept private at the person's request.";
  return null;
}

export type LogTotals = { G: number; H: number; I: number; J: number; K: number; L: number; M: Record<1 | 2 | 3 | 4 | 5 | 6, number> };

/** The 300A totals: zeros when there were no cases. */
export function logTotals(cases: Pick<InjuryCase, "outcome" | "days_away" | "days_restricted" | "kind">[]): LogTotals {
  const t: LogTotals = { G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 } };
  for (const c of cases) {
    t[OUTCOMES.find((o) => o.id === c.outcome)!.col]++;
    t.K += c.days_away; t.L += c.days_restricted;
    t.M[KINDS.find((k) => k.id === c.kind)!.n]++;
  }
  return t;
}

/**
 * Rates per 100 full-time workers (200,000 hours = 100 people × 40 hours × 50 weeks): every recordable case, and
 * cases with days away, restriction or transfer. Null without hours worked.
 */
export function logRates(t: LogTotals, hours: number | null): { recordable: number; dart: number } | null {
  if (!hours || hours <= 0) return null;
  const r = (n: number) => Math.round((n * 200_000 / hours) * 100) / 100;
  return { recordable: r(t.G + t.H + t.I + t.J), dart: r(t.H + t.I) };
}

/** "2026-003" */
export const caseLabel = (c: Pick<InjuryCase, "year" | "case_no">) => `${c.year}-${String(c.case_no).padStart(3, "0")}`;

/** Column B as printed on the log. */
export const nameOnLog = (c: Pick<InjuryCase, "privacy" | "employee_name">) => (c.privacy ? "Privacy case" : c.employee_name);

/** The 300A posting window for a year's log: February 1 to April 30 of the next year. */
export function postingWindow(year: number): { from: string; to: string } {
  return { from: `${year + 1}-02-01`, to: `${year + 1}-04-30` };
}

/** Calendar days from the day after `start` through `end` (inclusive), capped at 180: a helper for columns K and L. */
export function countDays(start: string, end: string): number {
  const ms = Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`);
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.min(MAX_DAYS, Math.round(ms / 86_400_000));
}

function isoToday(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Shown on the 300A (1904.32(b)(4) asks equivalent forms to carry them). */
export const EMPLOYEE_ACCESS = "Employees, former employees, and their representatives have the right to review the OSHA Form 300 in its entirety. They also have limited access to the OSHA Form 301 or its equivalent. See 29 CFR 1904.35 for details on the access provisions for these forms.";
export const FALSIFYING = "Knowingly falsifying this document may result in a fine.";
