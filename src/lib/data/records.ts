// Saved talks. Records are append-only: there is no update or delete here, on purpose.
import { supabase } from "@/lib/supabase";
import { TALK_FILES_BUCKET, toUpload, type AttendeeRow, type IssuePayload, type RecordPayload, type TalkFile } from "@/core/record";
import { signedFor } from "@/core/makeup";
import type { TalkRecord, TalkRecordSummary } from "./types";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

async function dataUrlToBlob(image: string): Promise<Blob> {
  return (await fetch(image)).blob();
}

/** Upload one signature or photo into the company's private folder. Already there (a retry) counts as done. */
async function uploadFile(f: TalkFile): Promise<void> {
  const { error } = await supabase().storage.from(TALK_FILES_BUCKET).upload(f.path, await dataUrlToBlob(f.image), { contentType: f.contentType, upsert: false });
  if (error && !/exists|duplicate|409/i.test(`${error.message} ${(error as { statusCode?: string }).statusCode ?? ""}`)) throw new Error(error.message);
}

/**
 * Saves a talk: signatures and the crew photo go to private storage first, then the record, its attendees and any
 * issues raised in one transaction that points at those files. Safe to retry at any point (fixed paths, client ids).
 */
export async function saveTalkRecord(record: RecordPayload, attendees: AttendeeRow[], issues: IssuePayload[] = []): Promise<string> {
  const up = toUpload(record, attendees);
  for (const f of up.files) await uploadFile(f);
  return check(await supabase().rpc("save_talk", { record: up.record, attendees: up.attendees, issues })) as string;
}

/** Files → images the screen and PDF can show. Short-lived signed URLs (one minute), read once, never stored. */
async function loadImages(paths: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (!paths.length) return out;
  const { data, error } = await supabase().storage.from(TALK_FILES_BUCKET).createSignedUrls(paths, 60);
  if (error) throw new Error(error.message);
  await Promise.all((data ?? []).map(async (d) => {
    if (!d.signedUrl || !d.path) return;
    const blob = await (await fetch(d.signedUrl)).blob();
    out.set(d.path, await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(r.error);
      r.readAsDataURL(blob);
    }));
  }));
  return out;
}

const SUMMARY = "id, client_id, talk_id, language, content, week_number, week_start, makeup_for_week, makeup_reason, held_at, jobsite_name, team_name, presenter_name, presenter_signed_at, talk_attendees(status)";

type SummaryRow = Omit<TalkRecordSummary, "title" | "statuses" | "presenter_signed"> & {
  content: { title: string };
  presenter_signed_at: string | null;
  talk_attendees: { status: TalkRecordSummary["statuses"][number] }[];
};

const toSummary = (r: SummaryRow): TalkRecordSummary => ({
  id: r.id, client_id: r.client_id, talk_id: r.talk_id, language: r.language, title: (r.content as { en?: { title?: string } })?.en?.title ?? r.content?.title ?? r.talk_id, // English title for the office
  week_number: r.week_number, week_start: r.week_start, makeup_for_week: r.makeup_for_week, makeup_reason: r.makeup_reason, held_at: r.held_at, jobsite_name: r.jobsite_name, team_name: r.team_name,
  presenter_name: r.presenter_name, statuses: r.talk_attendees.map((a) => a.status), presenter_signed: !!r.presenter_signed_at, // stamped only when the presenter signed (inline or file)
});

export async function listRecords(companyId: string, limit = 100): Promise<TalkRecordSummary[]> {
  const rows = check(
    await supabase().from("talk_records").select(SUMMARY).eq("company_id", companyId).order("held_at", { ascending: false }).limit(limit),
  ) as unknown as SummaryRow[];
  return rows.map(toSummary);
}

export async function getRecord(companyId: string, id: string): Promise<TalkRecord | null> {
  type Att = TalkRecord["attendees"][number] & { signature_path: string | null };
  const row = check(
    await supabase()
      .from("talk_records")
      .select("*, talk_attendees(person_id, name, role, team_name, company_name, status, signature, signature_path, signed_at, confirmed_at, position)")
      .eq("company_id", companyId)
      .eq("id", id)
      .order("position", { referencedTable: "talk_attendees" })
      .maybeSingle(),
  ) as (Omit<SummaryRow, "talk_attendees"> & Omit<TalkRecord, keyof TalkRecordSummary | "attendees"> & { presenter_signature_path: string | null; photo_path: string | null; talk_attendees: Att[] }) | null;
  if (!row) return null;
  // Records saved before signatures moved to private storage keep their inline images; newer ones load from files.
  const paths = [row.presenter_signature_path, row.photo_path, ...row.talk_attendees.map((a) => a.signature_path)].filter((p): p is string => !!p);
  const img = await loadImages(paths);
  const pick = (inline: string | null, path: string | null) => inline ?? (path ? img.get(path) ?? null : null);
  return {
    ...row, ...toSummary(row as unknown as SummaryRow),
    presenter_signature: pick(row.presenter_signature, row.presenter_signature_path),
    photo: row.photo_path ? img.get(row.photo_path) ?? null : null,
    photo_taken_at: row.photo_taken_at ?? null,
    attendees: row.talk_attendees.map(({ signature_path, ...a }) => ({ ...a, company_name: a.company_name ?? "", signature: pick(a.signature, signature_path) })),
  } as TalkRecord;
}

/** People who signed for a week, on time or by makeup (see creditWeek in src/core/makeup.ts). */
export async function signedForWeek(companyId: string, weekKey: string): Promise<string[]> {
  const rows = check(
    await supabase()
      .from("talk_records")
      .select("week_start, makeup_for_week, presenter_person_id, presenter_signed_at, talk_attendees(person_id, status)")
      .eq("company_id", companyId)
      .or(`week_start.eq.${weekKey},makeup_for_week.eq.${weekKey}`),
  ) as unknown as { week_start: string | null; makeup_for_week: string | null; presenter_person_id: string | null; presenter_signed_at: string | null; talk_attendees: { person_id: string | null; status: string }[] }[];
  return signedFor(weekKey, rows.map((r) => ({ ...r, attendees: r.talk_attendees })));
}

/** Weeks (from `fromWeek` on) whose scheduled talk has been given at least once. Those weeks are locked. */
export async function listRecordedWeeks(companyId: string, fromWeek: string): Promise<string[]> {
  const rows = check(
    await supabase()
      .from("talk_records")
      .select("week_start")
      .eq("company_id", companyId)
      .is("makeup_for_week", null)
      .gte("week_start", fromWeek),
  ) as { week_start: string }[];
  return [...new Set(rows.map((r) => r.week_start))];
}
