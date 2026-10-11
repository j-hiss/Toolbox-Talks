// A company's account with the service (migration 0042): plan, trial, pause, closing, and the full data download.
// Rules: src/core/account.ts. Writes go only through checked database functions; a company can't change its plan.
import { supabase } from "@/lib/supabase";
import type { CompanyAccount } from "@/core/account";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/** This company's account, or null if it can't be read yet (offline). */
export async function getAccount(companyId: string): Promise<CompanyAccount | null> {
  const rows = check(await supabase().from("company_accounts").select("plan, trial_ends_at, paused_at, pause_reason, closure_requested_at").eq("company_id", companyId).limit(1)) as CompanyAccount[];
  return rows[0] ?? null;
}

/** An owner asks to close the account. The data stays for 30 days; an owner can cancel until then. */
export async function requestClosure(companyId: string): Promise<void> {
  check(await supabase().rpc("request_company_closure", { co: companyId }));
}

export async function cancelClosure(companyId: string): Promise<void> {
  check(await supabase().rpc("cancel_company_closure", { co: companyId }));
}

/** Every table holding this company's data (owners and admins only). */
export async function exportTables(companyId: string): Promise<string[]> {
  return check(await supabase().rpc("export_company_tables", { co: companyId })) as string[];
}

/** One page (up to 1000 rows) of one table. */
export async function exportRows(companyId: string, table: string, page: number): Promise<Record<string, unknown>[]> {
  return check(await supabase().rpc("export_company_rows", { co: companyId, tbl: table, page })) as Record<string, unknown>[];
}

/** The private file buckets a company's files live in, each under "<company id>/". */
export const FILE_BUCKETS = ["talk-files", "person-certs", "company-docs", "event-files"] as const;

/** Every file path under the company's folder in a bucket (walks folders; files have an id, folders don't). */
export async function listCompanyFiles(companyId: string, bucket: string): Promise<string[]> {
  const out: string[] = [];
  const walk = async (prefix: string, depth: number): Promise<void> => {
    if (depth > 4) return;
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await supabase().storage.from(bucket).list(prefix, { limit: 1000, offset });
      if (error) throw new Error(error.message);
      for (const f of data ?? []) {
        const path = `${prefix}/${f.name}`;
        if (f.id) out.push(path); else await walk(path, depth + 1);
      }
      if (!data || data.length < 1000) break;
    }
  };
  await walk(companyId, 0);
  return out;
}

/** One file's bytes. */
export async function downloadFile(bucket: string, path: string): Promise<Uint8Array> {
  const { data, error } = await supabase().storage.from(bucket).download(path);
  if (error || !data) throw new Error(error?.message ?? "Download failed");
  return new Uint8Array(await data.arrayBuffer());
}

/** Each time support opened this company's records, and why (owners and admins only). */
export async function supportAccessLog(companyId: string): Promise<{ at: string; reason: string }[]> {
  return check(await supabase().rpc("support_access_log", { co: companyId })) as { at: string; reason: string }[];
}
