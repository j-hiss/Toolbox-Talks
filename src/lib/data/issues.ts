// Issues the crew raised at talks, and findings from the safety log. They can be reassigned and marked fixed (the
// database stamps who and when); what was raised never changes and nothing is deleted. Issues raised at a talk
// arrive with it (saveTalkRecord); a finding is added here (addFinding).
import { supabase } from "@/lib/supabase";
import type { Issue } from "./types";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const COLUMNS = "id, client_id, record_id, event_id, jobsite_name, description, owner_person_id, owner_name, due_date, status, raised_by_name, raised_at, fixed_at, fixed_note";

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

export type NewFinding = { eventId: string; description: string; jobsiteId: string | null; jobsiteName: string; ownerId: string | null; ownerName: string; dueDate: string | null; raisedBy: string };

/** A finding from a safety-log event, added to the issues list and linked back to its event. */
export async function addFinding(companyId: string, f: NewFinding): Promise<void> {
  check(await supabase().from("talk_issues").insert({
    company_id: companyId, client_id: crypto.randomUUID(), event_id: f.eventId, description: f.description.trim(),
    jobsite_id: f.jobsiteId, jobsite_name: f.jobsiteName, owner_person_id: f.ownerId, owner_name: f.ownerName,
    due_date: f.dueDate, raised_by_name: f.raisedBy,
  }).select("id").single());
}
