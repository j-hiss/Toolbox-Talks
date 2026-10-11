// Demo version of src/lib/data/me.ts: the demo account's own record from this browser's demo data.
import type * as Real from "@/../src/lib/data/me";
import type { MyActivity } from "@/core/myRecord";
import { db, tick } from "./store";

type P = { id: string; company_id: string; full_name: string; team_id: string | null; created_at?: string; deactivated_at?: string | null; user_id?: string | null };
type R = { id: string; company_id: string; held_at: string; week_start: string | null; makeup_for_week?: string | null; makeup_reason?: string | null; team_name: string;
  presenter_person_id: string | null; presenter_signed_at: string | null; record_kind?: string; content: { title?: string; en?: { title?: string } };
  attendees: { person_id: string | null; name: string; status: "signed" | "not_signed" | "absent" }[]; created_by?: string };

export async function myRecordData(companyId: string, userId: string): Promise<Real.MyRecordData> {
  await tick();
  const cadences = ((db() as unknown as { cadences?: { company_id: string; from_week: string; weeks: 1 | 2 | 4 }[] }).cadences ?? []).filter((c) => c.company_id === companyId).map(({ from_week, weeks }) => ({ from_week, weeks }));
  const p = (db().people as unknown as P[]).find((x) => x.company_id === companyId && x.user_id === userId);
  if (!p) return { person: null, records: [], cadences };
  const records = (db().records as unknown as R[]).filter((r) => r.company_id === companyId && (r.record_kind ?? "weekly") === "weekly" && (r.attendees.some((a) => a.person_id === p.id) || r.presenter_person_id === p.id))
    .sort((a, b) => a.held_at.localeCompare(b.held_at))
    .map((r) => ({ id: r.id, title: r.content?.en?.title ?? r.content?.title ?? "", heldAt: r.held_at, weekStart: r.week_start, makeupForWeek: r.makeup_for_week ?? null, makeupReason: r.makeup_reason ?? null,
      teamName: r.team_name, presenterId: r.presenter_person_id, presenterSigned: !!r.presenter_signed_at,
      attendees: r.attendees.filter((a) => a.person_id === p.id).map((a) => ({ personId: a.person_id, name: a.name, status: a.status })) }));
  return { person: { id: p.id, name: p.full_name, teamId: p.team_id, createdAt: p.created_at ?? new Date(0).toISOString(), deactivatedAt: p.deactivated_at ?? null }, records, cadences };
}

export async function myActivity(companyId: string, userId: string): Promise<MyActivity> {
  await tick();
  const since = Date.now() - 30 * 86_400_000;
  const recs = (db().records as unknown as R[]).filter((r) => r.company_id === companyId && (r.record_kind ?? "weekly") === "weekly");
  const insp = ((db() as unknown as { inspections?: { company_id: string; inspected_at: string }[] }).inspections ?? []).filter((i) => i.company_id === companyId);
  const issues = (db().issues ?? []).filter((i) => i.company_id === companyId);
  // The preview has one account, so everything in this demo company counts as the demo account's own.
  void userId;
  return {
    talksGiven: recs.length, talksGivenRecent: recs.filter((r) => Date.parse(r.held_at) > since).length,
    inspections: insp.length, inspectionsRecent: insp.filter((i) => Date.parse(i.inspected_at) > since).length,
    issuesFixed: issues.filter((i) => i.status === "fixed").length, issuesRaised: issues.length,
  };
}

const _sameShape = { myRecordData, myActivity } satisfies Omit<typeof Real, never>;
void _sameShape;
