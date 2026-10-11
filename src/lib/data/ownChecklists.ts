// "Your own checklists" data (migration 0045). Every save is a new version; retiring is a version marked retired.
// Staff read, owners and admins write (the database enforces it). Rules: src/core/ownChecklists.ts.
import { supabase } from "@/lib/supabase";
import type { OwnChecklistDraft, OwnChecklistRow } from "@/core/ownChecklists";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const COLUMNS = "checklist_key, version, retired, title, how_often, rule, items, created_at";

/** Every version of every company checklist (latestOwnChecklists picks what's offered). */
export async function listOwnChecklists(companyId: string): Promise<OwnChecklistRow[]> {
  return check(await supabase().from("company_checklists").select(COLUMNS).eq("company_id", companyId).order("version")) as OwnChecklistRow[];
}

/** Save as the next version (version 1 for a new checklist). */
export async function saveOwnChecklist(companyId: string, key: string, version: number, d: OwnChecklistDraft): Promise<void> {
  check(await supabase().from("company_checklists").insert({ company_id: companyId, checklist_key: key, version, retired: false, title: d.title.trim(), how_often: d.how_often, rule: d.rule.trim(), items: d.items }).select("checklist_key"));
}

/** Retire a checklist: it stops being offered; inspections already saved keep their items. */
export async function retireOwnChecklist(companyId: string, latest: OwnChecklistRow): Promise<void> {
  check(await supabase().from("company_checklists").insert({
    company_id: companyId, checklist_key: latest.checklist_key, version: latest.version + 1, retired: true,
    title: latest.title, how_often: latest.how_often, rule: latest.rule, items: latest.items,
  }).select("checklist_key"));
}
