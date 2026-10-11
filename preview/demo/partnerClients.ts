// Demo version of src/lib/data/partnerClients.ts: client lists, partner organizations, referral codes and summary
// requests kept in this browser with the database's rules (organization admins add people; only the invited partner
// moves a client into an organization; one request a week per client; a referral shares nothing).
import type * as Real from "@/../src/lib/data/partnerClients";
import type { LinkOrgMember, MyReferral, OrgKind, OrgMember, PartnerClient, PartnerOrg, ReferralInfo, SummaryRequest, TrainerClient } from "@/core/partnerClients";
import type { ShareSnapshot } from "@/core/share";
import { db, save, tick, uid } from "./store";

type Link = { id: string; company_id: string; user_id: string | null; removed_at: string | null; org_id?: string | null; name: string };
type Report = { id: string; company_id: string; partner_id: string; period_from: string; period_to: string; sent_at: string; withdrawn_at: string | null; snapshot: ShareSnapshot };
type Sub = { trainer_id: string; status: string; submitted_at: string };
type Org = { id: string; name: string; kind: OrgKind };
type Member = OrgMember & { removed_at: string | null };
type Code = { code: string; kind: OrgKind; user_id: string; org_id: string | null; name: string };
type Extra = {
  partners?: Link[]; partnerReports?: Report[]; trainers?: Link[]; trainerPeople?: { trainer_id: string; person_id: string }[]; certSubs?: Sub[];
  partnerOrgs?: Org[]; partnerOrgMembers?: Member[]; summaryRequests?: (SummaryRequest & { company_id: string })[]; referralCodes?: Code[]; companyReferrals?: { company_id: string; code: string }[];
};
const x = () => db() as unknown as Extra;
const me = () => db().session?.user.id ?? null;
const myEmail = () => db().session?.user.email?.toLowerCase() ?? "";
const orgs = () => (x().partnerOrgs ??= []);
const members = () => (x().partnerOrgMembers ??= []);
const requests = () => (x().summaryRequests ??= []);
const codes = () => (x().referralCodes ??= []);
const refs = () => (x().companyReferrals ??= []);
const inOrg = (org: string | null | undefined) => !!org && members().some((m) => m.org_id === org && m.user_id === me() && !m.removed_at);
const orgAdmin = (org: string) => members().some((m) => m.org_id === org && m.user_id === me() && !m.removed_at && m.role === "admin");
const mine = (l: Link) => !l.removed_at && (l.user_id === me() || inOrg(l.org_id));
const companyName = (id: string) => (db().companies as { id: string; name: string }[]).find((c) => c.id === id)?.name ?? "";
const isAdmin = (co: string) => ["owner", "admin"].includes(db().members.find((m) => m.company_id === co && m.user_id === me())?.access ?? "");

export async function partnerClients(): Promise<PartnerClient[]> {
  await tick();
  return (x().partners ?? []).filter(mine).map((p) => {
    const reps = (x().partnerReports ?? []).filter((r) => r.partner_id === p.id && !r.withdrawn_at).sort((a, b) => b.sent_at.localeCompare(a.sent_at));
    const l = reps[0];
    const pr = l?.snapshot.profile;
    return {
      link_id: p.id, company_id: p.company_id, company_name: companyName(p.company_id), org_id: p.org_id ?? null, org_name: orgs().find((o) => o.id === p.org_id)?.name ?? null,
      mine: p.user_id === me(), reports: reps.length, latest_report: l?.id ?? null, period_from: l?.period_from ?? null, period_to: l?.period_to ?? null, sent_at: l?.sent_at ?? null,
      crew: l?.snapshot.crew ?? null, sign_in: pr?.signIn ?? null, on_time: pr?.onTime ?? null, periods_ended: pr?.periodsEnded ?? null, periods_missed: pr?.periodsMissed ?? null,
      open_issues: pr?.issues?.open ?? null, last_requested: requests().filter((q) => q.partner_id === p.id).map((q) => q.requested_at).sort().at(-1) ?? null,
    };
  }).sort((a, b) => a.company_name.localeCompare(b.company_name));
}

export async function trainerClients(): Promise<TrainerClient[]> {
  await tick();
  const subs = x().certSubs ?? [];
  return (x().trainers ?? []).filter(mine).map((t) => {
    const s = subs.filter((y) => y.trainer_id === t.id);
    return {
      link_id: t.id, company_id: t.company_id, company_name: companyName(t.company_id), org_id: t.org_id ?? null, org_name: orgs().find((o) => o.id === t.org_id)?.name ?? null,
      mine: t.user_id === me(), people: (x().trainerPeople ?? []).filter((l) => l.trainer_id === t.id).length,
      waiting: s.filter((y) => y.status === "pending").length, approved: s.filter((y) => y.status === "approved").length, declined: s.filter((y) => y.status === "declined").length,
      last_sent: s.map((y) => y.submitted_at).sort().at(-1) ?? null,
    };
  }).sort((a, b) => a.company_name.localeCompare(b.company_name));
}

export async function requestPartnerSummary(linkId: string, note: string): Promise<void> {
  await tick();
  const p = (x().partners ?? []).find((l) => l.id === linkId && mine(l));
  if (!p) throw new Error("Client not found.");
  const week = Date.now() - 7 * 86_400_000;
  if (requests().some((q) => q.partner_id === linkId && Date.parse(q.requested_at) > week)) throw new Error("You asked this client in the last 7 days. Give them a little time.");
  requests().push({ id: uid(), company_id: p.company_id, partner_id: linkId, note: note.trim().slice(0, 300), requested_at: new Date().toISOString() });
  save();
}

export async function acceptOrgInvites(): Promise<number> {
  await tick();
  let n = 0;
  for (const m of members()) if (m.email === myEmail() && !m.user_id && !m.removed_at) { m.user_id = me(); m.accepted_at = new Date().toISOString(); n++; }
  if (n) save();
  return n;
}

export async function myOrgs(): Promise<PartnerOrg[]> {
  await tick();
  return orgs().filter((o) => inOrg(o.id)).sort((a, b) => a.name.localeCompare(b.name))
    .map((o) => ({ ...o, members: members().filter((m) => m.org_id === o.id && !m.removed_at).map(({ removed_at: _r, ...m }) => { void _r; return m; }) }));
}

export async function createOrg(name: string, kind: OrgKind): Promise<string> {
  await tick();
  if (!me()) throw new Error("Sign in with your email first.");
  const id = uid();
  orgs().push({ id, name: name.trim(), kind });
  members().push({ id: uid(), org_id: id, email: myEmail() || "you@example.com", role: "admin", user_id: me(), accepted_at: new Date().toISOString(), removed_at: null });
  save();
  return id;
}

export async function inviteOrgMember(orgId: string, email: string, admin: boolean): Promise<void> {
  await tick();
  if (!orgAdmin(orgId)) throw new Error("Only the organization's admins can add people.");
  const e = email.trim().toLowerCase();
  if (members().some((m) => m.org_id === orgId && m.email === e && !m.removed_at)) throw new Error("That person is already in the organization.");
  members().push({ id: uid(), org_id: orgId, email: e, role: admin ? "admin" : "member", user_id: null, accepted_at: null, removed_at: null });
  save();
}

export async function removeOrgMember(memberId: string): Promise<void> {
  await tick();
  const m = members().find((y) => y.id === memberId && !y.removed_at);
  if (!m || !(orgAdmin(m.org_id) || m.user_id === me())) throw new Error("Person not found.");
  if (m.role === "admin" && members().filter((y) => y.org_id === m.org_id && !y.removed_at && y.role === "admin").length === 1) throw new Error("An organization needs at least one admin. Add another admin first.");
  m.removed_at = new Date().toISOString(); save();
}

export async function setLinkOrg(kind: "trainer" | "partner", linkId: string, orgId: string | null): Promise<void> {
  await tick();
  if (orgId && !inOrg(orgId)) throw new Error("You're not in that organization.");
  const want = kind === "trainer" ? "training" : "insurance";
  if (orgId && orgs().find((o) => o.id === orgId)?.kind !== want) throw new Error(`Use ${want === "training" ? "a training" : "an insurance"} organization.`);
  const l = (kind === "trainer" ? x().trainers ?? [] : x().partners ?? []).find((y) => y.id === linkId && y.user_id === me() && !y.removed_at);
  if (!l) throw new Error("Only the person the company invited can move this client.");
  l.org_id = orgId; save();
}

export async function myReferralCode(kind: OrgKind, name: string, orgId: string | null): Promise<string> {
  await tick();
  const found = codes().find((c) => c.user_id === me() && c.kind === kind && c.org_id === orgId);
  if (found) return found.code;
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const code = Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => alphabet[b % 32]).join("");
  codes().push({ code, kind, user_id: me() ?? "", org_id: orgId, name: name.trim() || "Your partner" });
  save();
  return code;
}

export async function myReferrals(): Promise<MyReferral[]> {
  await tick();
  return codes().filter((c) => c.user_id === me()).map((c) => {
    const signed = refs().filter((r) => r.code === c.code);
    const connected = signed.map((r) => r.company_id).filter((co) => [...(x().partners ?? []), ...(x().trainers ?? [])].some((l) => l.company_id === co && mine(l))).map(companyName).sort();
    return { code: c.code, kind: c.kind, signed_up: signed.length, connected };
  });
}

export async function referralInfo(code: string): Promise<ReferralInfo | null> {
  await tick();
  const c = codes().find((y) => y.code === code.trim().toLowerCase());
  if (!c) return null;
  return { kind: c.kind, name: orgs().find((o) => o.id === c.org_id)?.name ?? c.name, person: c.name, email: myEmail() };
}

export async function recordReferral(companyId: string, code: string): Promise<boolean> {
  await tick();
  if (!isAdmin(companyId)) throw new Error("Only owners and admins can do this.");
  const c = codes().find((y) => y.code === code.trim().toLowerCase());
  if (!c || refs().some((r) => r.company_id === companyId)) return false;
  refs().push({ company_id: companyId, code: c.code }); save();
  return true;
}

export async function linkOrgMembers(companyId: string): Promise<LinkOrgMember[]> {
  await tick();
  if (!isAdmin(companyId)) return [];
  const ids = new Set([...(x().partners ?? []), ...(x().trainers ?? [])].filter((l) => l.company_id === companyId && !l.removed_at && l.org_id).map((l) => l.org_id!));
  return orgs().filter((o) => ids.has(o.id)).flatMap((o) => members().filter((m) => m.org_id === o.id && !m.removed_at)
    .map((m) => ({ org_id: o.id, org_name: o.name, email: m.email, role: m.role, accepted: !!m.accepted_at })));
}

export async function summaryRequests(companyId: string): Promise<SummaryRequest[]> {
  await tick();
  if (!isAdmin(companyId)) return [];
  return requests().filter((q) => q.company_id === companyId).sort((a, b) => b.requested_at.localeCompare(a.requested_at)).map(({ company_id: _c, ...q }) => { void _c; return q; });
}

const _sameShape = {
  partnerClients, trainerClients, requestPartnerSummary, acceptOrgInvites, myOrgs, createOrg, inviteOrgMember, removeOrgMember, setLinkOrg,
  myReferralCode, myReferrals, referralInfo, recordReferral, linkOrgMembers, summaryRequests,
} satisfies Omit<typeof Real, never>;
void _sameShape;
