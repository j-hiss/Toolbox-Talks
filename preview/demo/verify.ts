// Demo version of src/lib/data/verify.ts: looks the code up in this browser's demo records, counts only, like
// public.verify_record().
import type * as Real from "@/../src/lib/data/verify";
import type { VerifiedRecord } from "@/core/verify";
import { db, tick } from "./store";
import { withCode } from "./records";

type Rec = { company_id: string; record_kind?: "weekly" | "daily"; content: { title: string; en?: { title?: string } }; language: string; held_at: string;
  week_start: string | null; week_number: number | null; makeup_for_week?: string | null; presenter_signed_at: string | null;
  attendees: { status: string }[]; verify_code?: string; created_at?: string };

export async function verifyRecord(code: string): Promise<VerifiedRecord | null> {
  await tick();
  const r = (db().records as unknown as Rec[]).find((x) => withCode(x) === code);
  if (!r) return null;
  const n = (s: string) => r.attendees.filter((a) => a.status === s).length;
  return {
    company: String(db().companies.find((c) => c.id === r.company_id)?.name ?? ""), kind: r.record_kind ?? "weekly",
    title: r.content.title, title_en: r.content.en?.title ?? r.content.title, language: r.language,
    held_at: r.held_at, saved_at: r.created_at ?? r.held_at, week_start: r.week_start, week_number: r.week_number, makeup_for_week: r.makeup_for_week ?? null,
    presenter_signed: !!r.presenter_signed_at, roster: r.attendees.length, signed: n("signed"), not_signed: n("not_signed"), absent: n("absent"),
  };
}

export async function verifyInspection(code: string): Promise<Real.VerifiedInspection | null> {
  await tick();
  type I = { company_id: string; title: string; rule: string; subject: string; inspected_at: string; created_at: string; verify_code: string; items: { result: string }[] };
  const r = ((db() as unknown as { inspections?: I[] }).inspections ?? []).find((x) => x.verify_code === code);
  if (!r) return null;
  const n = (s: string) => r.items.filter((i) => i.result === s).length;
  return { company: String(db().companies.find((c) => c.id === r.company_id)?.name ?? ""), title: r.title, rule: r.rule, inspected_at: r.inspected_at, saved_at: r.created_at, items: r.items.length, passed: n("pass"), failed: n("fail"), na: n("na") };
}

const _sameShape = { verifyRecord, verifyInspection } satisfies Omit<typeof Real, never>;
void _sameShape;
