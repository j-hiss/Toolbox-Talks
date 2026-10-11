// Trainers and insurance partners with many clients (migration 0049): one list of every client, partner
// organizations whose staff share it, a link that brings new clients in, and asking a client for a fresh summary.
// Pure module.
//
// Privacy stays the company's choice: a client list only shows figures from summaries the company already sent
// (counts and rates) and card counts; a referral link shares nothing; an organization sees only the clients a member
// put in it, and the company sees everyone in that organization.

export type OrgKind = "insurance" | "training";
export type PartnerOrg = { id: string; name: string; kind: OrgKind; members: OrgMember[] };
export type OrgMember = { id: string; org_id: string; email: string; role: "admin" | "member"; user_id: string | null; accepted_at: string | null };

export type PartnerClient = {
  link_id: string; company_id: string; company_name: string; org_id: string | null; org_name: string | null; mine: boolean; reports: number;
  latest_report: string | null; period_from: string | null; period_to: string | null; sent_at: string | null; crew: number | null;
  sign_in: number | null; on_time: number | null; periods_ended: number | null; periods_missed: number | null; open_issues: number | null;
  last_requested: string | null;
};
export type TrainerClient = {
  link_id: string; company_id: string; company_name: string; org_id: string | null; org_name: string | null; mine: boolean;
  people: number; waiting: number; approved: number; declined: number; last_sent: string | null;
};
export type ReferralInfo = { kind: OrgKind; name: string; person: string; email: string };
export type MyReferral = { code: string; kind: OrgKind; signed_up: number; connected: string[] };
export type SummaryRequest = { id: string; partner_id: string; note: string; requested_at: string };
export type LinkOrgMember = { org_id: string; org_name: string; email: string; role: "admin" | "member"; accepted: boolean };

/** A summary older than this (or none) is worth asking for again. */
export const FRESH_DAYS = 35;
/** The database allows one request per client per week. */
export const REQUEST_EVERY_DAYS = 7;

const DAY = 86_400_000;

/** Whether the client's latest summary is missing or older than FRESH_DAYS. */
export function needsFreshSummary(c: Pick<PartnerClient, "sent_at">, now: Date = new Date()): boolean {
  return !c.sent_at || now.getTime() - new Date(c.sent_at).getTime() > FRESH_DAYS * DAY;
}

/** Whether a request can go out now (none in the last week). */
export function canRequest(c: Pick<PartnerClient, "last_requested">, now: Date = new Date()): boolean {
  return !c.last_requested || now.getTime() - new Date(c.last_requested).getTime() >= REQUEST_EVERY_DAYS * DAY;
}

export type ClientFlag = { text: string; tone: "warn" | "muted" | "ok" };

/** What stands out about one insurance client, most important first. Honest: missed weeks are never hidden. */
export function partnerClientFlags(c: PartnerClient, now: Date = new Date()): ClientFlag[] {
  const out: ClientFlag[] = [];
  if (!c.sent_at) out.push({ text: "No summary sent yet", tone: "muted" });
  else if (needsFreshSummary(c, now)) out.push({ text: `Latest summary is over ${FRESH_DAYS} days old`, tone: "warn" });
  if ((c.periods_missed ?? 0) > 0) out.push({ text: `${c.periods_missed} ${c.periods_missed === 1 ? "week" : "weeks"} with no talk`, tone: "warn" });
  if ((c.open_issues ?? 0) > 0) out.push({ text: `${c.open_issues} open ${c.open_issues === 1 ? "issue" : "issues"}`, tone: "muted" });
  if (c.sent_at && !out.some((f) => f.tone === "warn")) out.push({ text: "Up to date", tone: "ok" });
  return out;
}

/** Clients needing attention first (stale or missed weeks), then by name. */
export function sortPartnerClients(rows: PartnerClient[], now: Date = new Date()): PartnerClient[] {
  const score = (c: PartnerClient) => (needsFreshSummary(c, now) ? 2 : 0) + ((c.periods_missed ?? 0) > 0 ? 1 : 0);
  return [...rows].sort((a, b) => score(b) - score(a) || a.company_name.localeCompare(b.company_name));
}

/** Totals for the top of the client list. */
export function partnerTotals(rows: PartnerClient[], now: Date = new Date()) {
  const withSummary = rows.filter((r) => r.sign_in != null);
  const avg = withSummary.length ? withSummary.reduce((s, r) => s + (r.sign_in ?? 0), 0) / withSummary.length : null;
  return { clients: rows.length, stale: rows.filter((r) => needsFreshSummary(r, now)).length, missedWeeks: rows.filter((r) => (r.periods_missed ?? 0) > 0).length, avgSignIn: avg };
}

export function trainerTotals(rows: TrainerClient[]) {
  return { clients: rows.length, people: rows.reduce((s, r) => s + r.people, 0), waiting: rows.reduce((s, r) => s + r.waiting, 0), declined: rows.reduce((s, r) => s + r.declined, 0) };
}

/** The link a partner shares: the app's sign-up with their code. */
export function referralLink(origin: string, code: string): string {
  return `${origin.replace(/\/+$/, "")}/setup/?ref=${encodeURIComponent(code)}`;
}

/** The code in a sign-up address (?ref=...), cleaned, or null. */
export function refFromSearch(search: string): string | null {
  const v = new URLSearchParams(search).get("ref");
  const c = v?.trim().toLowerCase() ?? "";
  return /^[a-z2-9]{10}$/.test(c) ? c : null;
}

/** Problems with an organization name or a member email, or null. */
export function orgNameProblem(name: string): string | null {
  const n = name.trim();
  if (!n) return "Type your organization's name.";
  if (n.length > 120) return "Keep the name under 120 characters.";
  return null;
}
export function emailProblem(email: string): string | null {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) ? null : "Type an email address.";
}
