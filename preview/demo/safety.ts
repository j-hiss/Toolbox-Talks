// Demo version of src/lib/data/safety.ts, stored in this browser, with the rules the database enforces: admins only,
// an approved crew summary never changes, nothing is deleted, crews see approved and not-withdrawn summaries only.
import type * as Real from "@/../src/lib/data/safety";
import type { Bulletin } from "@/core/safetylog";
import type { SafetyEvent } from "@/lib/data/types";
import { db, save, tick, uid } from "./store";

export const EVENT_FILES_BUCKET = "event-files";

type Row = SafetyEvent & { company_id: string };
const rows = () => (db().events ??= []) as Row[];
const files = () => (db().eventFiles ??= []);
const me = () => db().session?.user.id;
const access = (companyId: string) => db().members.find((m) => m.company_id === companyId && m.user_id === me())?.access;
function mustBeAdmin(companyId: string) {
  const a = access(companyId);
  if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can use the safety log.");
}
const strip = ({ company_id: _c, ...e }: Row): SafetyEvent => { void _c; return { ...e, fields: { ...e.fields } }; };

export async function listEvents(companyId: string): Promise<SafetyEvent[]> {
  await tick(); mustBeAdmin(companyId);
  return rows().filter((e) => e.company_id === companyId)
    .sort((a, b) => b.occurred_on.localeCompare(a.occurred_on) || b.created_at.localeCompare(a.created_at)).map(strip);
}

export type NewEvent = Real.NewEvent;

export async function logEvent(companyId: string, e: NewEvent): Promise<string> {
  await tick(); mustBeAdmin(companyId);
  if (!e.title.trim()) throw new Error("Give it a short title.");
  const id = uid();
  rows().push({
    company_id: companyId, id, client_id: uid(), kind: e.kind, occurred_on: e.occurredOn, jobsite_id: e.jobsiteId, jobsite_name: e.jobsiteName,
    title: e.title.trim(), details: e.details.trim(), fields: { ...e.fields }, case_status: e.kind === "citation" ? e.caseStatus ?? "open" : null,
    crew_summary: e.crewSummary.trim(), summary_source: "typed", summary_status: "draft", reviewed_at: null, status: "open", closed_at: null,
    withdrawn_at: null, withdrawn_reason: "", created_at: new Date().toISOString(),
  });
  save();
  return id;
}

export type EventPatch = Real.EventPatch;

function find(companyId: string, id: string) {
  const e = rows().find((x) => x.company_id === companyId && x.id === id);
  if (!e) throw new Error("Event not found.");
  return e;
}

export async function updateEvent(companyId: string, id: string, patch: EventPatch): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const e = find(companyId, id);
  const locked = e.summary_status === "reviewed"
    ? { crew_summary: e.crew_summary, occurred_on: e.occurred_on, jobsite_id: e.jobsite_id, jobsite_name: e.jobsite_name } : {};
  const was = e.status;
  Object.assign(e, patch, locked);
  if (e.status === "closed" && was !== "closed") e.closed_at = new Date().toISOString();
  if (e.status === "open") e.closed_at = null;
  save();
}

export async function approveSummary(companyId: string, id: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const e = find(companyId, id);
  if (!e.crew_summary.trim()) throw new Error("Write the crew summary first.");
  if (e.summary_status !== "reviewed") { e.summary_status = "reviewed"; e.reviewed_at = new Date().toISOString(); }
  save();
}

export async function withdrawEvent(companyId: string, id: string, reason: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  if (!reason.trim()) throw new Error("Say why it's withdrawn.");
  const e = find(companyId, id);
  if (!e.withdrawn_at) { e.withdrawn_at = new Date().toISOString(); e.withdrawn_reason = reason.trim(); }
  save();
}

export async function crewBulletins(companyId: string, since: Date): Promise<Bulletin[]> {
  await tick();
  if (!access(companyId)) return [];
  const sinceDay = since.toISOString().slice(0, 10);
  return rows()
    .filter((e) => e.company_id === companyId && e.summary_status === "reviewed" && !e.withdrawn_at)
    .filter((e) => new Date(e.reviewed_at!) >= since || e.occurred_on >= sinceDay)
    .map((e) => ({ id: e.id, kind: e.kind, occurred_on: e.occurred_on, jobsite_id: e.jobsite_id, jobsite_name: e.jobsite_name,
      crew_summary: e.crew_summary, case_status: e.case_status, status: e.status, reviewed_at: e.reviewed_at! }));
}

export async function lastTalkAt(companyId: string, jobsiteId: string | null): Promise<string | null> {
  await tick();
  const held = db().records
    .filter((r) => r.company_id === companyId && r.record_kind !== "daily" && (!jobsiteId || r.jobsite_id === jobsiteId))
    .map((r) => String(r.held_at)).sort();
  return held.at(-1) ?? null;
}

export type EventFile = Real.EventFile;

export async function uploadEventFile(companyId: string, eventId: string, file: File): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  if (file.size > 10 * 1024 * 1024) throw new Error("Files can be up to 10 MB.");
  const data = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(file); });
  files().push({ company_id: companyId, event_id: eventId, name: file.name, path: `${companyId}/${eventId}/${Date.now()}-${file.name}`, data });
  save();
}

export async function listEventFiles(companyId: string, eventId: string): Promise<EventFile[]> {
  await tick(); mustBeAdmin(companyId);
  return files().filter((f) => f.company_id === companyId && f.event_id === eventId).map(({ name, path }) => ({ name, path }));
}

export async function eventFileUrl(path: string): Promise<string> {
  await tick();
  const f = files().find((x) => x.path === path);
  if (!f) throw new Error("File not found.");
  return f.data;
}

const _sameShape = {
  EVENT_FILES_BUCKET, listEvents, logEvent, updateEvent, approveSummary, withdrawEvent, crewBulletins, lastTalkAt,
  uploadEventFile, listEventFiles, eventFileUrl,
} satisfies Omit<typeof Real, never>;
void _sameShape;
