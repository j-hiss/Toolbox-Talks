// Demo version of src/lib/data/records.ts for the preview. Same functions; records stay append-only here too.
// The preview has no file storage: signatures and the crew photo stay inside the demo record on this device.
import type * as Real from "@/../src/lib/data/records";
import type { AttendeeRow, IssuePayload, RecordPayload } from "@/core/record";
import type { TalkRecord, TalkRecordSummary } from "@/lib/data/types";
import { signedFor } from "@/core/makeup";
import { db, save, tick, uid } from "./store";

type Stored = RecordPayload & { id: string; attendees: AttendeeRow[] };
const all = () => db().records as unknown as Stored[];

function isMember(companyId: string) {
  const user = db().session?.user.id;
  return db().members.some((m) => m.company_id === companyId && m.user_id === user);
}

export async function saveTalkRecord(record: RecordPayload, attendees: AttendeeRow[], issues: IssuePayload[] = []): Promise<string> {
  await tick();
  if (!isMember(record.company_id)) throw new Error("Not a member of this company.");
  const existing = all().find((r) => r.client_id === record.client_id);
  if (existing) return existing.id;
  for (const a of attendees) if ((a.status === "signed") !== !!a.signature) throw new Error("Signed status needs a signature.");
  const id = uid();
  all().push({ ...record, id, attendees });
  const list = (db().issues ??= []);
  for (const x of issues) {
    if (list.some((i) => i.client_id === x.client_id)) continue;
    list.push({ ...x, id: uid(), company_id: record.company_id, record_id: id, jobsite_name: record.jobsite_name, status: "open", fixed_at: null, fixed_note: "" });
  }
  save();
  return id;
}

const summary = (r: Stored): TalkRecordSummary => ({
  id: r.id, client_id: r.client_id, talk_id: r.talk_id, language: r.language, title: (r.content as { en?: { title?: string } }).en?.title ?? r.content.title,
  week_number: r.week_number, week_start: r.week_start, makeup_for_week: r.makeup_for_week ?? null, makeup_reason: r.makeup_reason ?? null, held_at: r.held_at, jobsite_name: r.jobsite_name, team_name: r.team_name,
  presenter_name: r.presenter_name, statuses: r.attendees.map((a) => a.status), presenter_signed: !!r.presenter_signed_at,
});

export async function listRecords(companyId: string, limit = 100): Promise<TalkRecordSummary[]> {
  await tick();
  return all().filter((r) => r.company_id === companyId).sort((a, b) => b.held_at.localeCompare(a.held_at)).slice(0, limit).map(summary);
}

export async function getRecord(companyId: string, id: string): Promise<TalkRecord | null> {
  await tick();
  const r = all().find((x) => x.company_id === companyId && x.id === id);
  if (!r) return null;
  return {
    ...summary(r),
    content: r.content as TalkRecord["content"],
    scheduled_talk_id: r.scheduled_talk_id, team_lead_name: r.team_lead_name,
    presenter_role: r.presenter_role, presenter_signature: r.presenter_signature, presenter_signed_at: r.presenter_signed_at,
    latitude: r.latitude, longitude: r.longitude, site_notes: r.site_notes ?? "", heat: r.heat ?? null, signing_statement: r.signing_statement ?? null, attendees: r.attendees,
    photo: r.photo ?? null, photo_taken_at: r.photo_taken_at ?? null,
  };
}

export async function signedForWeek(companyId: string, weekKey: string): Promise<string[]> {
  await tick();
  return signedFor(weekKey, all().filter((r) => r.company_id === companyId).map((r) => ({ ...r, makeup_for_week: r.makeup_for_week ?? null })));
}

export async function listRecordedWeeks(companyId: string, fromWeek: string): Promise<string[]> {
  await tick();
  return [...new Set(all().filter((r) => r.company_id === companyId && !r.makeup_for_week && r.week_start && r.week_start >= fromWeek).map((r) => r.week_start!))];
}

const _sameShape = { saveTalkRecord, listRecords, getRecord, signedForWeek, listRecordedWeeks } satisfies Omit<typeof Real, never>;
void _sameShape;
