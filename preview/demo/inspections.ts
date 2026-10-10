// Demo version of src/lib/data/inspections.ts: inspections kept in this browser, saved once and never edited, like the
// database (owners, admins and presenters save; staff read; failed items can raise crew issues).
import type * as Real from "@/../src/lib/data/inspections";
import type { InspectionPayload, InspectionSummary } from "@/core/inspections";
import type { IssuePayload } from "@/core/record";
import { db, save, tick, uid } from "./store";
import { demoVerifyCode } from "./records";

type Stored = Omit<InspectionPayload, "signature"> & { id: string; signature: string | null; failed_count: number; verify_code: string; created_at: string };
const all = () => ((db() as unknown as { inspections?: Stored[] }).inspections ??= []);
const access = (companyId: string) => db().members.find((m) => m.company_id === companyId && m.user_id === db().session?.user.id)?.access;

export async function saveInspection(p: InspectionPayload, issues: IssuePayload[] = []): Promise<string> {
  await tick();
  const a = access(p.company_id);
  if (a !== "owner" && a !== "admin" && a !== "presenter") throw new Error("Only owners, admins and presenters can save an inspection for this company.");
  const existing = all().find((x) => x.client_id === p.client_id);
  if (existing) return existing.id;
  const id = uid();
  all().push({ ...p, id, failed_count: p.items.filter((i) => i.result === "fail").length, verify_code: demoVerifyCode(), created_at: new Date().toISOString() });
  const list = (db().issues ??= []);
  for (const x of issues) {
    if (list.some((i) => i.client_id === x.client_id)) continue;
    list.push({ ...x, id: uid(), company_id: p.company_id, record_id: null, jobsite_name: p.jobsite_name, status: "open", fixed_at: null, fixed_note: "" } as (typeof list)[number]);
  }
  save();
  return id;
}

const staff = (companyId: string) => { const a = access(companyId); return !!a && a !== "employee"; };

export async function listInspections(companyId: string, limit = 200): Promise<InspectionSummary[]> {
  await tick();
  if (!staff(companyId)) return [];
  return all().filter((x) => x.company_id === companyId).sort((a, b) => b.inspected_at.localeCompare(a.inspected_at)).slice(0, limit)
    .map((x) => ({ id: x.id, checklist_id: x.checklist_id, title: x.title, subject: x.subject, jobsite_name: x.jobsite_name, inspector_name: x.inspector_name, inspected_at: x.inspected_at, failed_count: x.failed_count, items_count: x.items.length }));
}

export type InspectionRecord = Real.InspectionRecord;
export async function getInspection(companyId: string, id: string): Promise<Real.InspectionRecord | null> {
  await tick();
  const x = all().find((r) => r.company_id === companyId && r.id === id);
  if (!x || !staff(companyId)) return null;
  return {
    id: x.id, checklist_id: x.checklist_id, checklist_version: x.checklist_version, title: x.title, rule: x.rule, subject: x.subject, jobsite_name: x.jobsite_name,
    inspector_name: x.inspector_name, inspected_at: x.inspected_at, failed_count: x.failed_count, items_count: x.items.length, items: x.items, notes: x.notes,
    signature: x.signature, verify_code: x.verify_code, latitude: x.latitude, longitude: x.longitude,
  };
}

const _sameShape = { saveInspection, listInspections, getInspection } satisfies Omit<typeof Real, never>;
void _sameShape;
