// Admin swaps of a week's talk. The database refuses a swap for a week that is over or already given
// (supabase/migrations/20261005000005_weekly_lock_makeups.sql), so the lock holds even if the app is wrong.
import { supabase } from "@/lib/supabase";
import type { PlanOverride } from "./types";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export async function listOverrides(companyId: string): Promise<PlanOverride[]> {
  return check(await supabase().from("plan_overrides").select("week_start, talk_id").eq("company_id", companyId));
}

export async function setOverride(companyId: string, weekStart: string, talkId: string): Promise<void> {
  check(
    await supabase()
      .from("plan_overrides")
      .upsert({ company_id: companyId, week_start: weekStart, talk_id: talkId }, { onConflict: "company_id,week_start" })
      .select("week_start"),
  );
}

export async function clearOverride(companyId: string, weekStart: string): Promise<void> {
  check(await supabase().from("plan_overrides").delete().eq("company_id", companyId).eq("week_start", weekStart).select("week_start"));
}
