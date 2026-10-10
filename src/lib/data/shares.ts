// "Share with your agent" links (Reports → Safety profile). Owners and admins make, list and switch off links; anyone
// with a live link opens it, no account needed. Database: supabase/migrations/20261010000025_profile_shares.sql.
// What a link carries: shareSnapshot in src/core/share.ts (counts and rates only).
import { supabase } from "@/lib/supabase";
import type { OpenedShare, ShareDays, ShareRow, ShareSnapshot } from "@/core/share";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/** Make a link. Returns its secret once; build the link with shareLink() and don't store the secret. */
export async function createShare(companyId: string, label: string, days: ShareDays, snapshot: ShareSnapshot): Promise<string> {
  return check(await supabase().rpc("create_profile_share", {
    co: companyId, label: label.trim(), days, period_from: snapshot.profile.from, period_to: snapshot.profile.to, snapshot,
  })) as string;
}

export async function listShares(companyId: string): Promise<ShareRow[]> {
  const [rows, views] = await Promise.all([
    supabase().from("profile_shares").select("id, label, period_from, period_to, created_at, expires_at, revoked_at").eq("company_id", companyId).order("created_at", { ascending: false }),
    supabase().from("profile_share_views").select("share_id, viewed_at").eq("company_id", companyId).order("viewed_at", { ascending: false }),
  ]);
  const seen = check(views) as { share_id: string; viewed_at: string }[];
  return (check(rows) as Omit<ShareRow, "views" | "last_viewed_at">[]).map((r) => {
    const mine = seen.filter((v) => v.share_id === r.id);
    return { ...r, views: mine.length, last_viewed_at: mine[0]?.viewed_at ?? null };
  });
}

/** Switch a link off for good. The link and its opens stay on file. */
export async function revokeShare(companyId: string, shareId: string): Promise<void> {
  void companyId; // the database checks the link belongs to a company this person runs
  check(await supabase().rpc("revoke_profile_share", { share: shareId }));
}

/** Open a link. Null when it's wrong, expired or switched off (the database gives the same answer for all three). */
export async function openShare(secret: string): Promise<OpenedShare | null> {
  return (check(await supabase().rpc("shared_profile", { token: secret })) as OpenedShare | null) ?? null;
}
