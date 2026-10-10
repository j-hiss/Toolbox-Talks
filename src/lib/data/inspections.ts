// Inspections (migration 0034). Saved once through save_inspection(); never edited or deleted. Photos and the
// signature go to private storage first (same bucket and folder rule as talks), then the record. Safe to retry.
import { supabase } from "@/lib/supabase";
import { inspectionUpload, type CheckedItem, type InspectionPayload, type InspectionSummary } from "@/core/inspections";
import type { IssuePayload } from "@/core/record";
import { loadImages, uploadFile } from "@/lib/data/records";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export async function saveInspection(p: InspectionPayload, issues: IssuePayload[] = []): Promise<string> {
  const up = inspectionUpload(p);
  for (const f of up.files) await uploadFile(f);
  return check(await supabase().rpc("save_inspection", { insp: up.insp, issues })) as string;
}

type Row = Omit<InspectionSummary, "items_count"> & { items: CheckedItem[] };

/** Recent inspections, newest first (counts only; open one for its items and photos). */
export async function listInspections(companyId: string, limit = 200): Promise<InspectionSummary[]> {
  const rows = check(await supabase().from("inspections")
    .select("id, checklist_id, title, subject, jobsite_name, inspector_name, inspected_at, failed_count, items")
    .eq("company_id", companyId).order("inspected_at", { ascending: false }).limit(limit)) as unknown as Row[];
  return rows.map(({ items, ...r }) => ({ ...r, items_count: items.length }));
}

export type InspectionRecord = InspectionSummary & {
  checklist_version: number; rule: string; items: CheckedItem[]; notes: string; signature: string | null; verify_code: string; latitude: number | null; longitude: number | null;
};

/** One inspection with its photos and signature (short-lived signed URLs, read once). */
export async function getInspection(companyId: string, id: string): Promise<InspectionRecord | null> {
  const r = check(await supabase().from("inspections")
    .select("id, checklist_id, checklist_version, title, rule, subject, jobsite_name, inspector_name, inspected_at, failed_count, items, notes, signature_path, verify_code, latitude, longitude")
    .eq("company_id", companyId).eq("id", id).maybeSingle()) as (Row & { checklist_version: number; rule: string; notes: string; signature_path: string | null; verify_code: string; latitude: number | null; longitude: number | null }) | null;
  if (!r) return null;
  const paths = [r.signature_path, ...r.items.map((i) => i.photo_path ?? null)].filter((p): p is string => !!p);
  const img = await loadImages(paths);
  const { signature_path, ...rest } = r;
  return {
    ...rest, items_count: r.items.length,
    signature: signature_path ? img.get(signature_path) ?? null : null,
    items: r.items.map((i) => ({ ...i, photo: i.photo_path ? img.get(i.photo_path) ?? null : null })),
  };
}
