// "Your own talks" data (migration 0029). Every save is a new version; retiring is a version marked retired.
// Staff read, owners and admins write (the database enforces it). Rules and mapping: src/core/ownTalks.ts.
import { supabase } from "@/lib/supabase";
import type { OwnTalkRow } from "@/core/ownTalks";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const COLUMNS = "talk_key, version, retired, title, minutes, code, content, es_status, es_reviewed_by, based_on, created_at";

/** Every version of every company talk (the latest per talk is worked out by latestOwnTalks). */
export async function listOwnTalks(companyId: string): Promise<OwnTalkRow[]> {
  return check(await supabase().from("company_talks").select(COLUMNS).eq("company_id", companyId).order("version")) as OwnTalkRow[];
}

export type OwnTalkSave = Omit<OwnTalkRow, "created_at" | "retired">;

/** Save a talk as its next version (version 1 for a new talk). */
export async function saveOwnTalk(companyId: string, t: OwnTalkSave): Promise<void> {
  check(await supabase().from("company_talks").insert({ company_id: companyId, ...t, retired: false }).select("talk_key"));
}

/** Retire a talk: it stops being offered; records that used it keep their text. */
export async function retireOwnTalk(companyId: string, latest: OwnTalkRow): Promise<void> {
  const { created_at: _c, retired: _r, ...rest } = latest; void _c; void _r;
  check(await supabase().from("company_talks").insert({ company_id: companyId, ...rest, version: latest.version + 1, retired: true }).select("talk_key"));
}
