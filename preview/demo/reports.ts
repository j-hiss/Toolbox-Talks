// Demo version of src/lib/data/reports.ts.
import type * as Real from "@/../src/lib/data/reports";
import type { ReportPerson, ReportRecord } from "@/core/compliance";
import { db, tick } from "./store";

type P = { id: string; company_id: string; full_name: string; team_id: string | null; created_at?: string; deactivated_at?: string | null };
type R = {
  id: string; company_id: string; content: { title: string; en?: { title: string } }; held_at: string; week_start: string | null;
  makeup_for_week?: string | null; makeup_reason?: string | null; team_name: string;
  presenter_person_id: string | null; presenter_signed_at: string | null;
  attendees: { person_id: string | null; name: string; status: ReportRecord["attendees"][number]["status"] }[];
};

export async function reportPeople(companyId: string): Promise<ReportPerson[]> {
  await tick();
  return (db().people as unknown as P[]).filter((p) => p.company_id === companyId)
    .map((p) => ({ id: p.id, name: p.full_name, teamId: p.team_id, createdAt: p.created_at ?? "2000-01-01T00:00:00Z", deactivatedAt: p.deactivated_at ?? null }));
}

export async function reportRecords(companyId: string, fromWeek: string): Promise<ReportRecord[]> {
  await tick();
  return (db().records as unknown as R[])
    .filter((r) => r.company_id === companyId && ((r.week_start ?? "") >= fromWeek || (r.makeup_for_week ?? "") >= fromWeek))
    .sort((a, b) => a.held_at.localeCompare(b.held_at))
    .map((r) => ({
      id: r.id, title: r.content.en?.title ?? r.content.title, heldAt: r.held_at, weekStart: r.week_start, makeupForWeek: r.makeup_for_week ?? null,
      makeupReason: r.makeup_reason ?? null, teamName: r.team_name, presenterId: r.presenter_person_id, presenterSigned: !!r.presenter_signed_at,
      attendees: r.attendees.map((a) => ({ personId: a.person_id, name: a.name, status: a.status })),
    }));
}

const _sameShape = { reportPeople, reportRecords } satisfies Omit<typeof Real, never>;
void _sameShape;
