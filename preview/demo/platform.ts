// Demo version of src/lib/data/platform.ts: in the preview the demo account also runs the service, so the console
// shows the demo companies in this browser. Same rules as the database: reasons required, 30 days before removal,
// exact name, everything logged.
import type * as Real from "@/../src/lib/data/platform";
import type { Plan } from "@/core/account";
import { db, save, tick } from "./store";
import { accountFor, audit, log } from "./account";

type Row = Record<string, unknown>;
const rowsOf = (key: string) => (((db() as unknown as Record<string, Row[]>)[key]) ?? []);
const companyName = (id: string) => String(db().companies.find((c) => c.id === id)?.name ?? "");

export async function amPlatformAdmin(): Promise<boolean> { await tick(); return true; }

export async function platformCompanies(): Promise<Real.PlatformCompany[]> {
  await tick();
  const since = Date.now() - 30 * 86_400_000;
  return db().companies.map((c) => {
    const id = String(c.id); const a = accountFor(id);
    const talks = rowsOf("records").filter((r) => r.company_id === id);
    const last = talks.map((r) => String(r.held_at)).sort().at(-1) ?? null;
    return {
      id, name: String(c.name), industry: String(c.industry ?? ""), created_at: String(c.created_at ?? new Date().toISOString()), plan: a.plan, trial_ends_at: a.trial_ends_at,
      paused_at: a.paused_at, pause_reason: a.pause_reason, closure_requested_at: a.closure_requested_at,
      members: db().members.filter((m) => m.company_id === id).length, people_active: rowsOf("people").filter((p) => p.company_id === id && p.active !== false).length,
      talks_total: talks.length, talks_30d: talks.filter((r) => Date.parse(String(r.held_at)) > since).length, last_talk_at: last,
      inspections_total: rowsOf("inspections").filter((r) => r.company_id === id).length,
    };
  });
}
export async function platformSetPlan(companyId: string, plan: Plan, trialEnd: string | null): Promise<void> {
  await tick();
  const a = accountFor(companyId); a.plan = plan; a.trial_ends_at = plan === "trial" ? trialEnd : null;
  log("set_plan", companyId, { plan, trial_ends_at: trialEnd }); save();
}
export async function platformPause(companyId: string, reason: string): Promise<void> {
  await tick();
  if (!reason.trim()) throw new Error("Say why the account is paused.");
  const a = accountFor(companyId); a.paused_at = new Date().toISOString(); a.pause_reason = reason.trim().slice(0, 300);
  log("pause", companyId, { reason: reason.trim() }); save();
}
export async function platformResume(companyId: string): Promise<void> {
  await tick();
  const a = accountFor(companyId); a.paused_at = null; a.pause_reason = ""; log("resume", companyId); save();
}
const settings = () => ((db() as unknown as { platformSettings?: { trial_days: number | null } }).platformSettings ??= { trial_days: null });
export async function platformSettings(): Promise<{ trial_days: number | null }> { await tick(); return { ...settings() }; }
export async function platformSetTrialDays(days: number | null): Promise<void> { await tick(); settings().trial_days = days; log("set_trial_days", null, { trial_days: days }); save(); }
export async function platformAudit(max = 200): Promise<Real.AuditRow[]> {
  await tick();
  return audit().slice(0, max).map(({ at, action, company_id, company_name, detail }) => ({ at, action, company_id, company_name, detail }));
}
export async function platformPurge(companyId: string, confirmName: string): Promise<void> {
  await tick();
  const a = accountFor(companyId);
  if (!a.closure_requested_at || Date.parse(a.closure_requested_at) > Date.now() - 30 * 86_400_000) throw new Error("A company can be removed only 30 days after its owner asked to close it.");
  if (confirmName !== companyName(companyId)) throw new Error("Type the company's name exactly to remove it.");
  log("purge", companyId, { by: "console" });
  const d = db() as unknown as Record<string, unknown>;
  for (const k of Object.keys(d)) if (Array.isArray(d[k]) && k !== "platformAudit") d[k] = (d[k] as Row[]).filter((r) => !(r && typeof r === "object" && (r.company_id === companyId || (k === "companies" && r.id === companyId))));
  save();
}
export async function platformSupportView(companyId: string, reason: string): Promise<Real.SupportView> {
  await tick();
  if (reason.trim().length < 5) throw new Error("Say why you're looking (what the company asked for help with).");
  log("support_view", companyId, { reason: reason.trim().slice(0, 300) }); save();
  const c = db().companies.find((x) => x.id === companyId) ?? {};
  const of = (k: string) => rowsOf(k).filter((r) => r.company_id === companyId);
  const roles = rowsOf("roles"), teams = rowsOf("teams");
  const injuries = of("injuryCases");
  return {
    company: { name: String(c.name ?? ""), industry: String(c.industry ?? ""), work_setting: (c.work_setting as string) ?? null, program_start: String(c.program_start ?? ""), makeup_weeks: (c.makeup_weeks as number) ?? null, daily_enabled: (c.daily_enabled as boolean) ?? null, created_at: String(c.created_at ?? "") },
    account: (({ company_id: _c, ...a }) => { void _c; return a; })(accountFor(companyId)),
    members: db().members.filter((m) => m.company_id === companyId).map((m) => ({ email: m.email ?? (m.user_id === db().session?.user.id ? db().session?.user.email ?? "" : ""), access: m.access, since: m.created_at ?? "" })),
    teams: of("teams").map((t) => ({ name: String(t.name) })),
    people: of("people").map((p) => ({ name: String(p.full_name), job_title: (roles.find((r) => r.id === p.role_id)?.name as string) ?? null, team: (teams.find((t) => t.id === p.team_id)?.name as string) ?? null, active: p.active !== false, language: String(p.preferred_language ?? "en"), has_account: !!p.user_id })),
    jobsites: of("jobsites").map((j) => ({ name: String(j.name), active: j.active !== false })),
    talks: of("records").sort((a, b) => String(b.held_at).localeCompare(String(a.held_at))).slice(0, 100).map((r) => ({
      held_at: String(r.held_at), kind: String(r.record_kind ?? "weekly"), title: String((r.content as { title?: string; en?: { title?: string } })?.en?.title ?? (r.content as { title?: string })?.title ?? ""), team: String(r.team_name ?? ""), presenter: String(r.presenter_name ?? ""),
      week_start: (r.week_start as string) ?? null, makeup_for_week: (r.makeup_for_week as string) ?? null, jobsite: String(r.jobsite_name ?? ""),
      attendees: ((r.attendees as { name: string; status: string }[]) ?? []).map((a) => ({ name: a.name, status: a.status })) })),
    issues: of("issues").slice(0, 100).map((i) => ({ description: String(i.description), status: String(i.status), owner: String(i.owner_name ?? ""), due: (i.due_date as string) ?? null, raised_at: String(i.raised_at ?? ""), fixed_at: (i.fixed_at as string) ?? null })),
    inspections: of("inspections").slice(0, 100).map((i) => ({ title: String(i.title), subject: String(i.subject ?? ""), inspector: String(i.inspector_name ?? ""), inspected_at: String(i.inspected_at), items: ((i.items as unknown[]) ?? []).length, failed: Number(i.failed_count ?? 0), jobsite: String(i.jobsite_name ?? "") })),
    safety_log: of("events").slice(0, 100).map((e) => ({ kind: String(e.kind), title: e.kind === "incident" ? "" : String(e.title), occurred_on: String(e.occurred_on), status: String(e.status ?? "") })),
    training_cards: of("certs").filter((x) => !x.withdrawn_at).map((x) => ({ person: String(rowsOf("people").find((p) => p.id === x.person_id)?.full_name ?? ""), card: String(x.custom_name || x.cert_type), expires_on: (x.expires_on as string) ?? null })),
    injury_log_counts: injuries.reduce<Record<string, number>>((m, x) => { const y = String(x.year); m[y] = (m[y] ?? 0) + (x.version === 1 ? 1 : 0); return m; }, {}),
  };
}

const _sameShape = { amPlatformAdmin, platformCompanies, platformSetPlan, platformPause, platformResume, platformSettings, platformSetTrialDays, platformAudit, platformPurge, platformSupportView } satisfies Omit<typeof Real, never>;
void _sameShape;
