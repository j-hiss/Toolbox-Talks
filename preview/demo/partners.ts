// Demo version of src/lib/data/partners.ts: partners and sent summaries kept in this browser with the database's rules
// (admins invite, send, withdraw and remove; a partner sees only what was sent to them; every open is logged). The
// preview can't sign in as a second person, so "View as → Insurance partner" makes the demo account the partner of its
// own company (see viewAs in ./example.ts).
import type * as Real from "@/../src/lib/data/partners";
import type { InboxRow, OpenedReport, Partner, PartnerKind, SentReport } from "@/core/partners";
import type { ShareSnapshot } from "@/core/share";
import { db, save, tick, uid } from "./store";

type DemoPartner = Partner & { company_id: string; removed_at: string | null; user_id: string | null };
type DemoReport = Omit<SentReport, "views" | "last_viewed_at"> & { company_id: string; snapshot: ShareSnapshot; opens: string[] };
type Extra = { partners?: DemoPartner[]; partnerReports?: DemoReport[] };
const x = () => db() as unknown as Extra;
const partners = () => (x().partners ??= []);
const reports = () => (x().partnerReports ??= []);
const me = () => db().session?.user.id ?? null;
function mustBeAdmin(companyId: string) {
  const a = db().members.find((m) => m.company_id === companyId && m.user_id === me())?.access;
  if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can manage insurance partners.");
}
const live = (p: DemoPartner) => !p.removed_at;

export async function listPartners(companyId: string): Promise<Partner[]> {
  await tick(); mustBeAdmin(companyId);
  return partners().filter((p) => p.company_id === companyId && live(p)).sort((a, b) => a.name.localeCompare(b.name))
    .map(({ id, email, name, kind, invited_at, accepted_at }) => ({ id, email, name, kind, invited_at, accepted_at }));
}

export async function invitePartner(companyId: string, email: string, name: string, kind: PartnerKind): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const e = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw new Error("Type the partner's email address.");
  if (partners().some((p) => p.company_id === companyId && p.email === e && live(p))) throw new Error("That partner is already invited.");
  partners().push({ id: uid(), company_id: companyId, email: e, name: name.trim(), kind, invited_at: new Date().toISOString(), accepted_at: null, removed_at: null, user_id: null });
  save();
}

export async function removePartner(companyId: string, partnerId: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const p = partners().find((y) => y.id === partnerId && y.company_id === companyId);
  if (!p) throw new Error("Partner not found.");
  p.removed_at ??= new Date().toISOString(); save();
}

export async function sendPartnerReport(companyId: string, partnerId: string, snapshot: ShareSnapshot): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  if (!partners().some((p) => p.id === partnerId && p.company_id === companyId && live(p))) throw new Error("Partner not found.");
  reports().push({ id: uid(), company_id: companyId, partner_id: partnerId, period_from: snapshot.profile.from, period_to: snapshot.profile.to, sent_at: new Date().toISOString(), withdrawn_at: null, snapshot, opens: [] });
  save();
}

export async function listSentReports(companyId: string): Promise<SentReport[]> {
  await tick(); mustBeAdmin(companyId);
  return reports().filter((r) => r.company_id === companyId).sort((a, b) => b.sent_at.localeCompare(a.sent_at))
    .map(({ id, partner_id, period_from, period_to, sent_at, withdrawn_at, opens }) => ({ id, partner_id, period_from, period_to, sent_at, withdrawn_at, views: opens.length, last_viewed_at: opens.at(-1) ?? null }));
}

export async function withdrawPartnerReport(companyId: string, reportId: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const r = reports().find((y) => y.id === reportId && y.company_id === companyId);
  if (!r) throw new Error("Summary not found.");
  r.withdrawn_at ??= new Date().toISOString(); save();
}

export async function amPartner(userId: string): Promise<boolean> {
  await tick();
  return partners().some((p) => p.user_id === userId && live(p));
}

export async function partnerInbox(): Promise<InboxRow[]> {
  await tick();
  const companies = db().companies as { id: string; name: string }[];
  return partners().filter((p) => p.user_id === me() && live(p)).flatMap((p) => reports().filter((r) => r.partner_id === p.id && !r.withdrawn_at).map((r) => ({
    report_id: r.id, company_id: p.company_id, company_name: companies.find((c) => c.id === p.company_id)?.name ?? "", partner_name: p.name,
    period_from: r.period_from, period_to: r.period_to, sent_at: r.sent_at,
  }))).sort((a, b) => b.sent_at.localeCompare(a.sent_at));
}

export async function openPartnerReport(reportId: string): Promise<OpenedReport | null> {
  await tick();
  const r = reports().find((y) => y.id === reportId && !y.withdrawn_at);
  const p = r && partners().find((y) => y.id === r.partner_id && y.user_id === me() && live(y));
  if (!r || !p) return null;
  r.opens.push(new Date().toISOString()); save();
  return { id: r.id, period_from: r.period_from, period_to: r.period_to, sent_at: r.sent_at, snapshot: r.snapshot };
}

const _sameShape = { listPartners, invitePartner, removePartner, sendPartnerReport, listSentReports, withdrawPartnerReport, amPartner, partnerInbox, openPartnerReport } satisfies Omit<typeof Real, never>;
void _sameShape;
