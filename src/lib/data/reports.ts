// The report query layer: everyone who was ever on staff, and every record that counts toward the weeks in range.
// Signatures are not loaded here (reports only need statuses). Math lives in src/core/compliance.ts.
import { supabase } from "@/lib/supabase";
import type { ReportPerson, ReportRecord } from "@/core/compliance";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/** All people, including deactivated ones: past weeks still expected them. */
export async function reportPeople(companyId: string): Promise<ReportPerson[]> {
  const rows = check(
    await supabase().from("people").select("id, full_name, team_id, created_at, deactivated_at").eq("company_id", companyId).order("full_name"),
  ) as { id: string; full_name: string; team_id: string | null; created_at: string; deactivated_at: string | null }[];
  return rows.map((p) => ({ id: p.id, name: p.full_name, teamId: p.team_id, createdAt: p.created_at, deactivatedAt: p.deactivated_at }));
}

type Row = {
  id: string; title_en: string | null; title: string | null; held_at: string; week_start: string | null;
  makeup_for_week: string | null; makeup_reason: string | null; team_name: string;
  presenter_person_id: string | null; presenter_signed_at: string | null;
  talk_attendees: { person_id: string | null; name: string; status: ReportRecord["attendees"][number]["status"] }[];
};

/** Days with a daily pre-task plan from `fromDay` on (held time and crew only). Never part of the weekly math. */
export async function listDailyPlans(companyId: string, fromDay: string): Promise<{ held_at: string; team_name: string }[]> {
  return check(
    await supabase().from("talk_records").select("held_at, team_name").eq("company_id", companyId).eq("record_kind", "daily").gte("held_at", fromDay).order("held_at"),
  ) as { held_at: string; team_name: string }[];
}

/** Records held in, or making up, any week from `fromWeek` on. */
export async function reportRecords(companyId: string, fromWeek: string): Promise<ReportRecord[]> {
  const rows = check(
    await supabase()
      .from("talk_records")
      .select("id, title_en:content->en->>title, title:content->>title, held_at, week_start, makeup_for_week, makeup_reason, team_name, presenter_person_id, presenter_signed_at, talk_attendees(person_id, name, status)")
      .eq("company_id", companyId)
      .or(`week_start.gte.${fromWeek},makeup_for_week.gte.${fromWeek}`)
      .order("held_at"),
  ) as unknown as Row[];
  return rows.map((r) => ({
    id: r.id, title: r.title_en ?? r.title ?? "", heldAt: r.held_at, weekStart: r.week_start, makeupForWeek: r.makeup_for_week,
    makeupReason: r.makeup_reason, teamName: r.team_name, presenterId: r.presenter_person_id, presenterSigned: !!r.presenter_signed_at,
    attendees: r.talk_attendees.map((a) => ({ personId: a.person_id, name: a.name, status: a.status })),
  }));
}
