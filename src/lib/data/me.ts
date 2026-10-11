// "My record" data: the signed-in person's own talks (from the roster person linked to their account) and, for staff,
// what they did themselves. Row-level security already limits an employee to their own rows; staff rows are filtered
// to the linked person here. Math: src/core/myRecord.ts.
import { supabase } from "@/lib/supabase";
import type { ReportPerson, ReportRecord } from "@/core/compliance";
import type { CadenceSetting } from "@/core/plan";
import type { MyActivity } from "@/core/myRecord";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export type MyRecordData = { person: ReportPerson | null; records: ReportRecord[]; cadences: CadenceSetting[] };

/** The roster person linked to this account (null when none), their weekly talk records, and the company's cadences. */
export async function myRecordData(companyId: string, userId: string): Promise<MyRecordData> {
  const people = check(await supabase().from("people").select("id, full_name, team_id, created_at, deactivated_at").eq("company_id", companyId).eq("user_id", userId).limit(1)) as
    { id: string; full_name: string; team_id: string | null; created_at: string; deactivated_at: string | null }[];
  const cadences = check(await supabase().from("company_cadences").select("from_week, weeks").eq("company_id", companyId).order("from_week")) as CadenceSetting[];
  const p = people[0];
  if (!p) return { person: null, records: [], cadences };
  type Row = { id: string; held_at: string; week_start: string | null; makeup_for_week: string | null; makeup_reason: string | null; team_name: string;
    presenter_person_id: string | null; presenter_signed_at: string | null; content: { title?: string; en?: { title?: string } };
    talk_attendees: { person_id: string | null; name: string; status: "signed" | "not_signed" | "absent" }[] };
  // Talks they were on the roster for, plus talks they gave: a presenter who signed has had the talk, the same rule
  // Reports uses (buildCompliance in src/core/compliance.ts). Only their own roster row comes back.
  const cols = "id, held_at, week_start, makeup_for_week, makeup_reason, team_name, presenter_person_id, presenter_signed_at, content";
  const [attended, presented] = await Promise.all([
    supabase().from("talk_records").select(`${cols}, talk_attendees!inner(person_id, name, status)`)
      .eq("company_id", companyId).eq("record_kind", "weekly").eq("talk_attendees.person_id", p.id).order("held_at"),
    supabase().from("talk_records").select(cols).eq("company_id", companyId).eq("record_kind", "weekly").eq("presenter_person_id", p.id).order("held_at"),
  ]);
  const byId = new Map<string, Row>();
  for (const r of check(presented) as unknown as Omit<Row, "talk_attendees">[]) byId.set(r.id, { ...r, talk_attendees: [] });
  for (const r of check(attended) as unknown as Row[]) byId.set(r.id, r);
  const rows = [...byId.values()].sort((a, b) => a.held_at.localeCompare(b.held_at));
  return {
    person: { id: p.id, name: p.full_name, teamId: p.team_id, createdAt: p.created_at, deactivatedAt: p.deactivated_at },
    cadences,
    records: rows.map((r) => ({
      id: r.id, title: r.content?.en?.title ?? r.content?.title ?? "", heldAt: r.held_at, weekStart: r.week_start, makeupForWeek: r.makeup_for_week,
      makeupReason: r.makeup_reason, teamName: r.team_name, presenterId: r.presenter_person_id, presenterSigned: !!r.presenter_signed_at,
      attendees: r.talk_attendees.map((a) => ({ personId: a.person_id, name: a.name, status: a.status })),
    })),
  };
}

/** Counts of what this account did itself: toolbox talks it saved (not daily plans), inspections it did, issues it raised and fixed. */
export async function myActivity(companyId: string, userId: string): Promise<MyActivity> {
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const count = async (q: PromiseLike<{ count: number | null; error: { message: string } | null }>) => { const r = await q; if (r.error) throw new Error(r.error.message); return r.count ?? 0; };
  const sb = supabase();
  const [talksGiven, talksGivenRecent, inspections, inspectionsRecent, issuesFixed, issuesRaised] = await Promise.all([
    count(sb.from("talk_records").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("record_kind", "weekly").eq("created_by", userId)),
    count(sb.from("talk_records").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("record_kind", "weekly").eq("created_by", userId).gte("held_at", since)),
    count(sb.from("inspections").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("created_by", userId)),
    count(sb.from("inspections").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("created_by", userId).gte("inspected_at", since)),
    count(sb.from("talk_issues").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("fixed_by", userId)),
    count(sb.from("talk_issues").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("created_by", userId)),
  ]);
  return { talksGiven, talksGivenRecent, inspections, inspectionsRecent, issuesFixed, issuesRaised };
}
