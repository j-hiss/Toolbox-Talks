// Offline-first saving. A finished talk goes into this outbox on the phone FIRST, then uploads. If there's no
// signal, it waits and uploads later; nothing is lost when the jobsite has no reception.
// Uploads are idempotent (client_id), so retrying after a half-finished upload never saves a talk twice.
// Each saved talk belongs to the account that gave it: on a shared phone, someone else signing in never uploads it
// under their name; it waits until its own account signs in again (security review, 2026-10-10).
import type { AttendeeRow, IssuePayload, RecordPayload } from "@/core/record";

export type OutboxItem = {
  record: RecordPayload;
  attendees: AttendeeRow[];
  issues?: IssuePayload[];         // raised at this talk; uploaded with it
  queuedAt: string;
  lastError: string | null;
  userId?: string;                 // the account that saved it (missing on talks saved before 2026-10-10)
};

const KEY = "tt-outbox";
const listeners = new Set<() => void>();

// The signed-in account (set by the session). Only its own saved talks are listed and uploaded.
let currentUser: string | null = null;
export function setOutboxUser(userId: string | null) {
  currentUser = userId;
  listeners.forEach((l) => l());
}
const mine = (i: OutboxItem) => !i.userId || i.userId === currentUser;

function read(): OutboxItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(items: OutboxItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    throw new Error("This phone is out of storage for saved talks. Connect to upload the waiting talks, then try again.");
  }
  listeners.forEach((l) => l());
}

export function onOutboxChange(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }

export function pending(companyId?: string): OutboxItem[] {
  return read().filter((i) => mine(i) && (!companyId || i.record.company_id === companyId));
}

/** Put a finished talk on the phone. Throws only if the phone can't store it at all. */
export function enqueue(record: RecordPayload, attendees: AttendeeRow[], issues: IssuePayload[] = []) {
  const items = read().filter((i) => i.record.client_id !== record.client_id);
  items.push({ record, attendees, issues, queuedAt: new Date().toISOString(), lastError: null, userId: currentUser ?? undefined });
  write(items);
}

let flushing: Promise<{ uploaded: number; failed: number }> | null = null;

/** Upload everything waiting, oldest first. One flush at a time. */
export function flush(upload: (r: RecordPayload, a: AttendeeRow[], issues: IssuePayload[]) => Promise<unknown>): Promise<{ uploaded: number; failed: number }> {
  if (flushing) return flushing;
  flushing = (async () => {
    let uploaded = 0, failed = 0;
    for (const item of read().filter(mine)) {
      try {
        await upload(item.record, item.attendees, item.issues ?? []);
        write(read().filter((i) => i.record.client_id !== item.record.client_id));
        uploaded++;
      } catch (e) {
        write(read().map((i) => (i.record.client_id === item.record.client_id ? { ...i, lastError: e instanceof Error ? e.message : String(e) } : i)));
        failed++;
      }
    }
    return { uploaded, failed };
  })().finally(() => { flushing = null; });
  return flushing;
}
