// OSHA 300 log data (migration 0031). Owners and admins only; every save is a new version. Rules: src/core/oshaLog.ts.
import { supabase } from "@/lib/supabase";
import type { CaseDraft, InjuryCase, InjurySummary } from "@/core/oshaLog";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const CASE_COLS = "case_key, version, year, case_no, removed, removed_reason, person_id, employee_name, job_title, injury_date, location, description, outcome, days_away, days_restricted, kind, privacy, privacy_reason, created_at";
const SUMMARY_COLS = "year, version, establishment, address, industry, naics, avg_employees, hours_worked, certifier_name, certifier_title, certifier_phone";

/** Every version of every case for a year (the latest per case: latestCases). */
export async function listInjuryCases(companyId: string, year: number): Promise<InjuryCase[]> {
  return check(await supabase().from("injury_cases").select(CASE_COLS).eq("company_id", companyId).eq("year", year).order("version")) as InjuryCase[];
}

/** Save a case: a new case (no `prev`) gets the next number; an edit is the next version of `prev`. */
export async function saveInjuryCase(companyId: string, c: CaseDraft, prev: InjuryCase | null): Promise<void> {
  const year = Number(c.injury_date.slice(0, 4));
  const { person_id, employee_name, job_title, injury_date, location, description, outcome, days_away, days_restricted, kind, privacy, privacy_reason } = c;
  check(await supabase().from("injury_cases").insert({
    company_id: companyId, person_id, employee_name, job_title, injury_date, location, description, outcome, days_away, days_restricted, kind, privacy, privacy_reason, case_key: prev?.case_key ?? crypto.randomUUID(), version: (prev?.version ?? 0) + 1, year, removed: false, removed_reason: "",
  }).select("case_key"));
}

/** Take a case off the log (found not recordable), with the reason. History stays. */
export async function removeInjuryCase(companyId: string, prev: InjuryCase, reason: string): Promise<void> {
  const { created_at: _c, case_no: _n, ...rest } = prev; void _c; void _n; // the database keeps the number and stamps the time
  check(await supabase().from("injury_cases").insert({ company_id: companyId, ...rest, version: prev.version + 1, removed: true, removed_reason: reason.trim() }).select("case_key"));
}

/** Every version of the 300A details, all years (latestSummary picks one). */
export async function listInjurySummaries(companyId: string): Promise<InjurySummary[]> {
  return (check(await supabase().from("injury_summaries").select(SUMMARY_COLS).eq("company_id", companyId).order("version")) as InjurySummary[])
    .map((s) => ({ ...s, hours_worked: s.hours_worked === null ? null : Number(s.hours_worked) }));
}

export async function saveInjurySummary(companyId: string, s: InjurySummary): Promise<void> {
  check(await supabase().from("injury_summaries").insert({ company_id: companyId, ...s }).select("year"));
}
