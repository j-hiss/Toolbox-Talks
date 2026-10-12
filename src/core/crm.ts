// CRM connector (migration 0054): what a company's CRM sends to make or update a jobsite from a job ID and address.
// Pure module. The call goes to a database function through the Supabase REST endpoint; no server of our own.

export type ApiKeyRow = { id: string; name: string; key_prefix: string; created_at: string; last_used_at: string | null; uses: number; revoked_at: string | null };

export const API_KEY_NAME_MAX = 60;

/** The web address the CRM posts to, from the project's address (null until it's set). */
export function crmEndpoint(supabaseUrl: string | undefined | null): string | null {
  if (!supabaseUrl) return null;
  try { return `${new URL(supabaseUrl).origin}/rest/v1/rpc/crm_jobsite`; } catch { return null; }
}

/** The body a CRM sends. Only the key and job ID are required; a new job also needs an address or a name. */
export function crmBody(key: string, sample = true): Record<string, string | boolean> {
  return sample
    ? { key, job_id: "1234", address: "1 Example St, Exampletown, ST 00000", name: "Example reroof", active: true }
    : { key, job_id: "" };
}

/** A ready-to-run test call, with the key in place (shown once, right after the key is made). */
export function crmCurl(endpoint: string, publishableKey: string, key: string): string {
  return [
    `curl -X POST '${endpoint}' \\`,
    `  -H 'apikey: ${publishableKey}' \\`,
    `  -H 'Content-Type: application/json' \\`,
    `  -d '${JSON.stringify(crmBody(key))}'`,
  ].join("\n");
}

/** What's wrong with a key's name, or null. */
export function apiKeyNameProblem(name: string): string | null {
  const n = name.trim();
  if (!n) return "Name the connection, like the CRM's name.";
  if (n.length > API_KEY_NAME_MAX) return `Keep the name to ${API_KEY_NAME_MAX} characters.`;
  return null;
}

/** Live keys first (newest first), then revoked. */
export const sortKeys = (keys: ApiKeyRow[]) =>
  [...keys].sort((a, b) => Number(!!a.revoked_at) - Number(!!b.revoked_at) || b.created_at.localeCompare(a.created_at));
