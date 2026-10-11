// Trainers and insurance partners with many clients (migration 0049): client lists, partner organizations, referral
// links and summary requests. Every call goes through checked database functions. Rules: src/core/partnerClients.ts.
import { supabase } from "@/lib/supabase";
import type { LinkOrgMember, MyReferral, OrgKind, OrgMember, PartnerClient, PartnerOrg, ReferralInfo, SummaryRequest, TrainerClient } from "@/core/partnerClients";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}
const num = (v: unknown) => (v == null ? null : Number(v));

// Partner side -----------------------------------------------------------------------------------------------------------

export async function partnerClients(): Promise<PartnerClient[]> {
  const rows = check(await supabase().rpc("partner_clients")) as PartnerClient[];
  return rows.map((r) => ({ ...r, sign_in: num(r.sign_in), on_time: num(r.on_time) }));
}

export async function trainerClients(): Promise<TrainerClient[]> {
  return check(await supabase().rpc("trainer_clients")) as TrainerClient[];
}

/** Ask a client for a fresh summary (once a week at most). */
export async function requestPartnerSummary(linkId: string, note: string): Promise<void> {
  check(await supabase().rpc("request_partner_summary", { link: linkId, note }));
}

/** Join any organization that invited this email. Never blocks signing in. */
export async function acceptOrgInvites(): Promise<number> {
  return check(await supabase().rpc("accept_partner_org_invites")) as number;
}

/** The organizations this account is in, with their people. */
export async function myOrgs(): Promise<PartnerOrg[]> {
  const orgs = check(await supabase().from("partner_orgs").select("id, name, kind").order("name")) as Omit<PartnerOrg, "members">[];
  if (!orgs.length) return [];
  const members = check(await supabase().from("partner_org_members").select("id, org_id, email, role, user_id, accepted_at").is("removed_at", null).order("email")) as OrgMember[];
  return orgs.map((o) => ({ ...o, members: members.filter((m) => m.org_id === o.id) }));
}

export async function createOrg(name: string, kind: OrgKind): Promise<string> {
  return check(await supabase().rpc("create_partner_org", { name: name.trim(), kind })) as string;
}
export async function inviteOrgMember(orgId: string, email: string, admin: boolean): Promise<void> {
  check(await supabase().rpc("invite_org_member", { org: orgId, email: email.trim(), admin }));
}
export async function removeOrgMember(memberId: string): Promise<void> {
  check(await supabase().rpc("remove_org_member", { member: memberId }));
}
/** Put a client you were invited by into one of your organizations (or null to take it out). */
export async function setLinkOrg(kind: "trainer" | "partner", linkId: string, orgId: string | null): Promise<void> {
  check(await supabase().rpc("set_link_org", { kind, link: linkId, org: orgId }));
}

export async function myReferralCode(kind: OrgKind, name: string, orgId: string | null): Promise<string> {
  return check(await supabase().rpc("my_referral_code", { kind, name: name.trim() || "Your partner", org: orgId })) as string;
}
export async function myReferrals(): Promise<MyReferral[]> {
  return check(await supabase().rpc("my_referrals")) as MyReferral[];
}

// Company side -----------------------------------------------------------------------------------------------------------

/** Who sent this sign-up link, or null for an unknown code. */
export async function referralInfo(code: string): Promise<ReferralInfo | null> {
  return (check(await supabase().rpc("referral_info", { code })) as ReferralInfo | null) ?? null;
}
/** Records which partner's link brought the company in (once). Shares nothing with them. */
export async function recordReferral(companyId: string, code: string): Promise<boolean> {
  return check(await supabase().rpc("record_referral", { co: companyId, code })) as boolean;
}
/** The organizations behind this company's trainers and partners, and everyone in them. */
export async function linkOrgMembers(companyId: string): Promise<LinkOrgMember[]> {
  return check(await supabase().rpc("link_org_members", { co: companyId })) as LinkOrgMember[];
}
/** Partners asking for a fresh summary, newest first. */
export async function summaryRequests(companyId: string): Promise<SummaryRequest[]> {
  return check(await supabase().from("partner_summary_requests").select("id, partner_id, note, requested_at").eq("company_id", companyId).order("requested_at", { ascending: false }).limit(20)) as SummaryRequest[];
}
