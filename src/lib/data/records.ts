// Saved talks. Records are append-only: there is no update or delete here, on purpose.
import { supabase } from "@/lib/supabase";
import type { AttendeeRow, RecordPayload } from "@/core/record";
import type { TalkRecord, TalkRecordSummary } from "./types";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/** Saves the record and its attendees in one transaction. Safe to retry: the same client_id saves once. */
export async function saveTalkRecord(record: RecordPayload, attendees: AttendeeRow[]): Promise<string> {
  return check(await supabase().rpc("save_talk_record", { record, attendees })) as string;
}

const SUMMARY = "id, client_id, talk_id, language, content, week_number, held_at, jobsite_name, team_name, presenter_name, presenter_signature, talk_attendees(status)";

type SummaryRow = Omit<TalkRecordSummary, "title" | "statuses" | "presenter_signed"> & {
  content: { title: string };
  presenter_signature: string | null;
  talk_attendees: { status: TalkRecordSummary["statuses"][number] }[];
};

const toSummary = (r: SummaryRow): TalkRecordSummary => ({
  id: r.id, client_id: r.client_id, talk_id: r.talk_id, language: r.language, title: (r.content as { en?: { title?: string } })?.en?.title ?? r.content?.title ?? r.talk_id, // English title for the office
  week_number: r.week_number, held_at: r.held_at, jobsite_name: r.jobsite_name, team_name: r.team_name,
  presenter_name: r.presenter_name, statuses: r.talk_attendees.map((a) => a.status), presenter_signed: !!r.presenter_signature,
});

export async function listRecords(companyId: string, limit = 100): Promise<TalkRecordSummary[]> {
  const rows = check(
    await supabase().from("talk_records").select(SUMMARY).eq("company_id", companyId).order("held_at", { ascending: false }).limit(limit),
  ) as unknown as SummaryRow[];
  return rows.map(toSummary);
}

export async function getRecord(companyId: string, id: string): Promise<TalkRecord | null> {
  const row = check(
    await supabase()
      .from("talk_records")
      .select("*, talk_attendees(person_id, name, role, team_name, status, signature, signed_at, position)")
      .eq("company_id", companyId)
      .eq("id", id)
      .order("position", { referencedTable: "talk_attendees" })
      .maybeSingle(),
  ) as (SummaryRow & Omit<TalkRecord, keyof TalkRecordSummary | "attendees"> & { talk_attendees: TalkRecord["attendees"] }) | null;
  if (!row) return null;
  return { ...row, ...toSummary(row), attendees: row.talk_attendees } as TalkRecord;
}
