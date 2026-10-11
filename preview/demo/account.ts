// Demo version of src/lib/data/account.ts: the company's account kept in this browser (plan, pause, closing), and the
// full data download read from the demo store. Files aren't stored in the preview, so the download has tables only.
import type * as Real from "@/../src/lib/data/account";
import type { CompanyAccount } from "@/core/account";
import { db, save, tick } from "./store";

export type DemoAccount = CompanyAccount & { company_id: string };
type Audit = { at: string; action: string; company_id: string | null; company_name: string; detail: Record<string, unknown> };
export const accounts = () => ((db() as unknown as { accounts?: DemoAccount[] }).accounts ??= []);
export const audit = () => ((db() as unknown as { platformAudit?: Audit[] }).platformAudit ??= []);
export function accountFor(companyId: string): DemoAccount {
  let a = accounts().find((x) => x.company_id === companyId);
  if (!a) { a = { company_id: companyId, plan: "trial", trial_ends_at: null, paused_at: null, pause_reason: "", closure_requested_at: null }; accounts().push(a); }
  return a;
}
export function log(action: string, companyId: string | null, detail: Record<string, unknown> = {}) {
  audit().unshift({ at: new Date().toISOString(), action, company_id: companyId, company_name: String(db().companies.find((c) => c.id === companyId)?.name ?? ""), detail });
}
const access = (companyId: string) => db().members.find((m) => m.company_id === companyId && m.user_id === db().session?.user.id)?.access;

export async function getAccount(companyId: string): Promise<CompanyAccount | null> {
  await tick();
  const { company_id: _c, ...a } = accountFor(companyId); void _c;
  return a;
}
export async function requestClosure(companyId: string): Promise<void> {
  await tick();
  if (access(companyId) !== "owner") throw new Error("Only an owner can close the company's account.");
  const a = accountFor(companyId); a.closure_requested_at ??= new Date().toISOString(); log("closure_requested", companyId); save();
}
export async function cancelClosure(companyId: string): Promise<void> {
  await tick();
  if (access(companyId) !== "owner") throw new Error("Only an owner can change this.");
  accountFor(companyId).closure_requested_at = null; log("closure_canceled", companyId); save();
}
const mustAdmin = (companyId: string) => { const a = access(companyId); if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can download the company's data."); };
/** Demo tables: every list in the demo store that holds this company's rows. */
export async function exportTables(companyId: string): Promise<string[]> {
  await tick(); mustAdmin(companyId);
  const d = db() as unknown as Record<string, unknown>;
  return ["companies", ...Object.keys(d).filter((k) => Array.isArray(d[k]) && (d[k] as Record<string, unknown>[]).some((r) => r && typeof r === "object" && "company_id" in r)).sort()];
}
export async function exportRows(companyId: string, table: string, page: number): Promise<Record<string, unknown>[]> {
  await tick(); mustAdmin(companyId);
  if (!(await exportTables(companyId)).includes(table)) throw new Error("Not a company table.");
  const d = db() as unknown as Record<string, Record<string, unknown>[]>;
  const rows = table === "companies" ? d.companies.filter((c) => c.id === companyId) : d[table].filter((r) => r.company_id === companyId);
  return rows.slice(page * 1000, page * 1000 + 1000).map((r) => Object.fromEntries(Object.entries(r).filter(([k, v]) => k !== "data" && !(typeof v === "string" && v.startsWith("data:")))));
}
export const FILE_BUCKETS = ["talk-files", "person-certs", "company-docs", "event-files"] as const;
export async function listCompanyFiles(companyId: string, bucket: string): Promise<string[]> { void companyId; void bucket; await tick(); return []; }
export async function downloadFile(bucket: string, path: string): Promise<Uint8Array> { void bucket; void path; await tick(); return new Uint8Array(); }
export async function supportAccessLog(companyId: string): Promise<{ at: string; reason: string }[]> {
  await tick(); mustAdmin(companyId);
  return audit().filter((l) => l.company_id === companyId && l.action === "support_view").map((l) => ({ at: l.at, reason: String(l.detail.reason ?? "") }));
}

const _sameShape = { getAccount, requestClosure, cancelClosure, exportTables, exportRows, FILE_BUCKETS, listCompanyFiles, downloadFile, supportAccessLog } satisfies Omit<typeof Real, never>;
void _sameShape;
