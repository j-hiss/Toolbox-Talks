// Insurance partner portal data (pilot, migration 0027). Company side: owners and admins invite a partner, send a
// frozen counts-only summary (shareSnapshot, src/core/share.ts), see opens, withdraw a summary, remove the partner.
// Partner side: the inbox and opening a summary (each open is logged). No server code.
import { supabase } from "@/lib/supabase";
import type { InboxRow, OpenedReport, Partner, PartnerKind, SentReport } from "@/core/partners";
import type { ShareSnapshot } from "@/core/share";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

// Company side ---------------------------------------------------------------------------------------------------------

export async function listPartners(companyId: string): Promise<Partner[]> {
  return check(await supabase().from("company_partners").select("id, email, name, kind, invited_at, accepted_at").eq("company_id", companyId).is("removed_at", null).order("name")) as Partner[];
}

export async function invitePartner(companyId: string, email: string, name: string, kind: PartnerKind): Promise<void> {
  check(await supabase().rpc("invite_partner", { co: companyId, email: email.trim().toLowerCase(), name: name.trim(), kind }));
}

/** Ends the partner's access at once. Sent summaries and opens stay on file. */
export async function removePartner(companyId: string, partnerId: string): Promise<void> {
  void companyId; // the database checks the partner belongs to a company this person runs
  check(await supabase().rpc("remove_partner", { partner: partnerId }));
}

export async function sendPartnerReport(companyId: string, partnerId: string, snapshot: ShareSnapshot): Promise<void> {
  void companyId;
  check(await supabase().rpc("send_partner_report", { partner: partnerId, period_from: snapshot.profile.from, period_to: snapshot.profile.to, snapshot }));
}

export async function listSentReports(companyId: string): Promise<SentReport[]> {
  const [rows, views] = await Promise.all([
    supabase().from("partner_reports").select("id, partner_id, period_from, period_to, sent_at, withdrawn_at").eq("company_id", companyId).order("sent_at", { ascending: false }).limit(200),
    supabase().from("partner_report_views").select("report_id, viewed_at").eq("company_id", companyId).order("viewed_at", { ascending: false }),
  ]);
  const seen = check(views) as { report_id: string; viewed_at: string }[];
  return (check(rows) as Omit<SentReport, "views" | "last_viewed_at">[]).map((r) => {
    const mine = seen.filter((v) => v.report_id === r.id);
    return { ...r, views: mine.length, last_viewed_at: mine[0]?.viewed_at ?? null };
  });
}

/** The partner stops seeing it; it stays on file. */
export async function withdrawPartnerReport(companyId: string, reportId: string): Promise<void> {
  void companyId;
  check(await supabase().rpc("withdraw_partner_report", { report: reportId }));
}

// Partner side ---------------------------------------------------------------------------------------------------------

/** Whether the signed-in account is an insurance partner of any company (decides where a non-member lands). */
export async function amPartner(userId: string): Promise<boolean> {
  const rows = check(await supabase().from("company_partners").select("id").eq("user_id", userId).is("removed_at", null).limit(1)) as { id: string }[];
  return rows.length > 0;
}

export async function partnerInbox(): Promise<InboxRow[]> {
  return check(await supabase().rpc("partner_inbox")) as InboxRow[];
}

/** Opens a summary (logged for the company). Null when withdrawn or no longer shared. */
export async function openPartnerReport(reportId: string): Promise<OpenedReport | null> {
  return (check(await supabase().rpc("partner_report", { report: reportId })) as OpenedReport | null) ?? null;
}
