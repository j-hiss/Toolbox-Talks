// Demo version of src/lib/data/apiKeys.ts: CRM keys kept in this browser with the database's rules (owners and admins
// only, shown once, 10 live keys at most, revoking is final). The preview has no endpoint, so a CRM can't call it.
import type * as Real from "@/../src/lib/data/apiKeys";
import type { ApiKeyRow } from "@/core/crm";
import { apiKeyNameProblem } from "@/core/crm";
import { db, save, tick, uid } from "./store";

type Row = ApiKeyRow & { company_id: string };
const rows = () => ((db() as unknown as { apiKeys?: Row[] }).apiKeys ??= []);
function mustBeAdmin(co: string) {
  const a = db().members.find((m) => m.company_id === co && m.user_id === db().session?.user.id)?.access;
  if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can make API keys.");
}

export async function listApiKeys(companyId: string): Promise<ApiKeyRow[]> {
  await tick(); mustBeAdmin(companyId);
  return rows().filter((r) => r.company_id === companyId).map(({ company_id: _c, ...r }) => { void _c; return r; });
}
export async function createApiKey(companyId: string, name: string): Promise<string> {
  await tick(); mustBeAdmin(companyId);
  const p = apiKeyNameProblem(name); if (p) throw new Error(p);
  if (rows().filter((r) => r.company_id === companyId && !r.revoked_at).length >= 10) throw new Error("A company can have 10 keys at a time. Revoke one first.");
  const key = `ttk_${Array.from(crypto.getRandomValues(new Uint8Array(20)), (b) => b.toString(16).padStart(2, "0")).join("")}`;
  rows().push({ id: uid(), company_id: companyId, name: name.trim(), key_prefix: key.slice(0, 8), created_at: new Date().toISOString(), last_used_at: null, uses: 0, revoked_at: null });
  save(); return key;
}
export async function revokeApiKey(companyId: string, keyId: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const r = rows().find((x) => x.company_id === companyId && x.id === keyId && !x.revoked_at);
  if (!r) throw new Error("Key not found.");
  r.revoked_at = new Date().toISOString(); save();
}

const _sameShape = { listApiKeys, createApiKey, revokeApiKey } satisfies Omit<typeof Real, never>;
void _sameShape;
