// Weekly email settings (migration 0056): my own on/off per company, and the send log for admins.
import { supabase } from "@/lib/supabase";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/** Whether I get this company's weekly email (on unless I turned it off). */
export async function weeklyEmailOn(companyId: string): Promise<boolean> {
  const rows = check(await supabase().from("digest_optouts").select("company_id").eq("company_id", companyId)) as { company_id: string }[];
  return rows.length === 0;
}

export async function setWeeklyEmail(companyId: string, on: boolean): Promise<void> {
  check(await supabase().rpc("set_weekly_email", { co: companyId, wanted: on }));
}

export type DigestLogRow = { week_key: string; sent_at: string; recipients: number; status: "sent" | "skipped" | "failed"; detail: string };

/** The last few sends (owners and admins). */
export async function digestLog(companyId: string): Promise<DigestLogRow[]> {
  return check(await supabase().from("digest_log").select("week_key, sent_at, recipients, status, detail").eq("company_id", companyId).order("week_key", { ascending: false }).limit(8)) as DigestLogRow[];
}
