// Issues the crew raised at talks. They can be reassigned and marked fixed (the database stamps who and when);
// what was raised never changes and nothing is deleted. New issues arrive with their talk (saveTalkRecord).
import { supabase } from "@/lib/supabase";
import type { Issue } from "./types";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const COLUMNS = "id, client_id, record_id, jobsite_name, description, owner_person_id, owner_name, due_date, status, raised_by_name, raised_at, fixed_at, fixed_note";

export async function listIssues(companyId: string): Promise<Issue[]> {
  return check(await supabase().from("talk_issues").select(COLUMNS).eq("company_id", companyId).order("raised_at", { ascending: false }).limit(500));
}

export async function listIssuesForRecord(companyId: string, recordId: string): Promise<Issue[]> {
  return check(await supabase().from("talk_issues").select(COLUMNS).eq("company_id", companyId).eq("record_id", recordId).order("raised_at"));
}

export type IssuePatch = Partial<Pick<Issue, "status" | "fixed_note" | "owner_person_id" | "owner_name" | "due_date">>;

export async function updateIssue(companyId: string, id: string, patch: IssuePatch): Promise<void> {
  check(await supabase().from("talk_issues").update(patch).eq("company_id", companyId).eq("id", id).select("id").single());
}
