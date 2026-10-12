// CRM connector keys (migration 0054). Owners and admins make and revoke them; only a fingerprint is stored and the
// key itself is returned once. Rules: src/core/crm.ts.
import { supabase } from "@/lib/supabase";
import type { ApiKeyRow } from "@/core/crm";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export async function listApiKeys(companyId: string): Promise<ApiKeyRow[]> {
  return check(await supabase().from("company_api_keys").select("id, name, key_prefix, created_at, last_used_at, uses, revoked_at").eq("company_id", companyId).order("created_at", { ascending: false })) as ApiKeyRow[];
}

/** Make a key. The returned key is shown once and never stored by the app. */
export async function createApiKey(companyId: string, name: string): Promise<string> {
  return check(await supabase().rpc("create_api_key", { co: companyId, name: name.trim() })) as string;
}

export async function revokeApiKey(companyId: string, keyId: string): Promise<void> {
  check(await supabase().rpc("revoke_api_key", { co: companyId, key_id: keyId }));
}
