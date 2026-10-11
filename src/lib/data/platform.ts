// The operator console (migration 0042): the people running the service see every company with counts, open one's
// records to help (support view, logged and shown to the company), set plans, pause and resume, and remove a company 30 days after its owner asked to close it. Every call is checked in
// the database (private.platform_admins) and logged; nobody in a customer company can reach these.
import type { Tier } from "@/core/plans";
import { supabase } from "@/lib/supabase";
import type { Plan } from "@/core/account";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export type PlatformCompany = {
  id: string; name: string; industry: string; created_at: string; plan: Plan; tier?: Tier; trial_ends_at: string | null; paused_at: string | null; pause_reason: string;
  closure_requested_at: string | null; members: number; people_active: number; talks_total: number; talks_30d: number; last_talk_at: string | null; inspections_total: number;
};
export type AuditRow = { at: string; action: string; company_id: string | null; company_name: string; detail: Record<string, unknown> };

/** Whether the signed-in account runs the service. False for everyone in a customer company. */
export async function amPlatformAdmin(): Promise<boolean> {
  const { data, error } = await supabase().rpc("am_platform_admin");
  if (error) return false;
  return data === true;
}

export async function platformCompanies(): Promise<PlatformCompany[]> {
  return check(await supabase().rpc("platform_companies")) as PlatformCompany[];
}

/** Set the plan size (Crew, Company or Larger); only a paid account is held to it. */
export async function platformSetTier(companyId: string, tier: Tier): Promise<void> {
  check(await supabase().rpc("platform_set_tier", { co: companyId, new_tier: tier }));
}

export async function platformSetPlan(companyId: string, plan: Plan, trialEnd: string | null): Promise<void> {
  check(await supabase().rpc("platform_set_plan", { co: companyId, new_plan: plan, trial_end: trialEnd }));
}

export async function platformPause(companyId: string, reason: string): Promise<void> {
  check(await supabase().rpc("platform_pause", { co: companyId, reason }));
}

export async function platformResume(companyId: string): Promise<void> {
  check(await supabase().rpc("platform_resume", { co: companyId }));
}

export async function platformSettings(): Promise<{ trial_days: number | null }> {
  return check(await supabase().rpc("platform_settings")) as { trial_days: number | null };
}

export async function platformSetTrialDays(days: number | null): Promise<void> {
  check(await supabase().rpc("platform_set_trial_days", { days }));
}

export async function platformAudit(max = 200): Promise<AuditRow[]> {
  return check(await supabase().rpc("platform_audit", { max_rows: max })) as AuditRow[];
}

/** Remove a closing company's data for good (rows only; scripts/ops/purge-company.ts on the operator's computer removes rows and files). */
export async function platformPurge(companyId: string, confirmName: string): Promise<void> {
  check(await supabase().rpc("platform_purge_company", { co: companyId, confirm_name: confirmName }));
}

/** What support sees when helping a company (logged with the reason; the company sees each look). */
export type SupportView = {
  company: { name: string; industry: string; work_setting: string | null; program_start: string; makeup_weeks: number | null; daily_enabled: boolean | null; created_at: string };
  account: Record<string, unknown> | null;
  members: { email: string; access: string; since: string }[];
  teams: { name: string }[];
  people: { name: string; job_title: string | null; team: string | null; active: boolean; language: string; has_account: boolean }[];
  jobsites: { name: string; active: boolean }[];
  talks: { held_at: string; kind: string; title: string; team: string; presenter: string; week_start: string | null; makeup_for_week: string | null; jobsite: string; attendees: { name: string; status: string }[] }[];
  issues: { description: string; status: string; owner: string; due: string | null; raised_at: string; fixed_at: string | null }[];
  inspections: { title: string; subject: string; inspector: string; inspected_at: string; items: number; failed: number; jobsite: string }[];
  safety_log: { kind: string; title: string; occurred_on: string; status: string }[];
  training_cards: { person: string; card: string; expires_on: string | null }[];
  injury_log_counts: Record<string, number>;
};

export async function platformSupportView(companyId: string, reason: string): Promise<SupportView> {
  return check(await supabase().rpc("platform_support_view", { co: companyId, reason })) as SupportView;
}
