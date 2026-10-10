// Insurance partner portal (pilot): who a partner is and what they get. Pure module. A partner gets frozen,
// counts-only summaries the company chooses to send (built by shareSnapshot, ./share.ts), never live data, names,
// signatures or injury details. Database: supabase/migrations/20261010000027_partner_portal.sql.
import type { ShareSnapshot } from "./share";

export const PARTNER_KINDS = [
  { id: "agent", name: "Insurance agent" },
  { id: "broker", name: "Broker" },
  { id: "carrier", name: "Insurance carrier" },
  { id: "other", name: "Other" },
] as const;
export type PartnerKind = (typeof PARTNER_KINDS)[number]["id"];
export const partnerKindName = (k: string) => PARTNER_KINDS.find((x) => x.id === k)?.name ?? "Partner";

/** A partner as the company sees it. */
export type Partner = { id: string; email: string; name: string; kind: PartnerKind; invited_at: string; accepted_at: string | null };
/** A summary sent to a partner, as the company sees it (no copy), with its opens. */
export type SentReport = { id: string; partner_id: string; period_from: string; period_to: string; sent_at: string; withdrawn_at: string | null; views: number; last_viewed_at: string | null };
/** One line of a partner's inbox. */
export type InboxRow = { report_id: string; company_id: string; company_name: string; partner_name: string; period_from: string; period_to: string; sent_at: string };
export type OpenedReport = { id: string; period_from: string; period_to: string; sent_at: string; snapshot: ShareSnapshot };

/** A partner's inbox by company: latest summary first, then earlier ones. */
export function inboxByCompany(rows: InboxRow[]): { companyId: string; companyName: string; reports: InboxRow[] }[] {
  const by = new Map<string, { companyId: string; companyName: string; reports: InboxRow[] }>();
  for (const r of rows) {
    const c = by.get(r.company_id) ?? { companyId: r.company_id, companyName: r.company_name, reports: [] };
    c.reports.push(r);
    by.set(r.company_id, c);
  }
  const list = [...by.values()];
  list.forEach((c) => c.reports.sort((a, b) => b.sent_at.localeCompare(a.sent_at)));
  return list.sort((a, b) => a.companyName.localeCompare(b.companyName));
}
