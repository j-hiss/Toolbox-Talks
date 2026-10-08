// The safety log (Admin → Safety log) and what crews may hear of it (crew_bulletins). Admins read and write events;
// the database keeps an approved crew summary exactly as approved, never deletes an event, and only lets crews
// see approved, crew-safe columns (supabase/migrations/20261008000016_safety_log.sql). Rules: src/core/safetylog.ts.
import { supabase } from "@/lib/supabase";
import type { Bulletin, CaseStatus, EventKind } from "@/core/safetylog";
import type { SafetyEvent } from "./types";

export const EVENT_FILES_BUCKET = "event-files";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const COLUMNS = "id, client_id, kind, occurred_on, jobsite_id, jobsite_name, title, details, fields, case_status, crew_summary, summary_source, summary_status, reviewed_at, status, closed_at, withdrawn_at, withdrawn_reason, created_at";

export async function listEvents(companyId: string): Promise<SafetyEvent[]> {
  return check(await supabase().from("safety_events").select(COLUMNS).eq("company_id", companyId)
    .order("occurred_on", { ascending: false }).order("created_at", { ascending: false }).limit(500));
}

export type NewEvent = {
  kind: EventKind; occurredOn: string; jobsiteId: string | null; jobsiteName: string; title: string; details: string;
  fields: Record<string, string>; caseStatus: CaseStatus | null; crewSummary: string;
};

/** Logs an event as a draft. Returns its id. */
export async function logEvent(companyId: string, e: NewEvent): Promise<string> {
  const row = check(await supabase().from("safety_events").insert({
    company_id: companyId, client_id: crypto.randomUUID(), kind: e.kind, occurred_on: e.occurredOn, jobsite_id: e.jobsiteId,
    jobsite_name: e.jobsiteName, title: e.title.trim(), details: e.details.trim(), fields: e.fields,
    case_status: e.kind === "citation" ? e.caseStatus ?? "open" : null, crew_summary: e.crewSummary.trim(),
  }).select("id").single()) as { id: string };
  return row.id;
}

export type EventPatch = Partial<Pick<SafetyEvent, "title" | "details" | "fields" | "case_status" | "crew_summary" | "status" | "occurred_on" | "jobsite_id" | "jobsite_name">>;

export async function updateEvent(companyId: string, id: string, patch: EventPatch): Promise<void> {
  check(await supabase().from("safety_events").update(patch).eq("company_id", companyId).eq("id", id).select("id").single());
}

/** Approve the crew summary for talks. After this it can't change (the database stamps who and when). */
export async function approveSummary(companyId: string, id: string): Promise<void> {
  check(await supabase().from("safety_events").update({ summary_status: "reviewed" }).eq("company_id", companyId).eq("id", id).select("id").single());
}

/** Take an event out of future talks, with a reason. It stays on file. */
export async function withdrawEvent(companyId: string, id: string, reason: string): Promise<void> {
  check(await supabase().from("safety_events").update({ withdrawn_at: new Date().toISOString(), withdrawn_reason: reason.trim() })
    .eq("company_id", companyId).eq("id", id).select("id").single());
}

/** Approved, crew-safe summaries since a time, for the "Since last talk" section. Any member can read these. */
export async function crewBulletins(companyId: string, since: Date): Promise<Bulletin[]> {
  return check(await supabase().rpc("crew_bulletins", { co: companyId, since: since.toISOString() })) as Bulletin[];
}

/** When the last talk at this jobsite (or anywhere, for null) was held, for "since last talk". */
export async function lastTalkAt(companyId: string, jobsiteId: string | null): Promise<string | null> {
  let q = supabase().from("talk_records").select("held_at").eq("company_id", companyId);
  if (jobsiteId) q = q.eq("jobsite_id", jobsiteId);
  const rows = check(await q.order("held_at", { ascending: false }).limit(1)) as { held_at: string }[];
  return rows[0]?.held_at ?? null;
}

// Files behind an event (PDF or photos): private, admins only, never replaced or deleted. -------------------------
export type EventFile = { name: string; path: string };

export async function uploadEventFile(companyId: string, eventId: string, file: File): Promise<void> {
  const safe = file.name.replace(/[^\w.-]+/g, "_").slice(-80) || "file";
  const path = `${companyId}/${eventId}/${Date.now()}-${safe}`;
  const { error } = await supabase().storage.from(EVENT_FILES_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
}

export async function listEventFiles(companyId: string, eventId: string): Promise<EventFile[]> {
  const { data, error } = await supabase().storage.from(EVENT_FILES_BUCKET).list(`${companyId}/${eventId}`);
  if (error) throw new Error(error.message);
  return (data ?? []).map((f) => ({ name: f.name.replace(/^\d+-/, ""), path: `${companyId}/${eventId}/${f.name}` }));
}

/** A one-minute link to open a file. Never stored. */
export async function eventFileUrl(path: string): Promise<string> {
  const { data, error } = await supabase().storage.from(EVENT_FILES_BUCKET).createSignedUrl(path, 60);
  if (error || !data) throw new Error(error?.message ?? "Couldn't open the file.");
  return data.signedUrl;
}
