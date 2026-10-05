// Offline-first saving. A finished talk goes into this outbox on the phone FIRST, then uploads. If there's no
// signal, it waits and uploads later; nothing is lost when the jobsite has no reception.
// Uploads are idempotent (client_id), so retrying after a half-finished upload never saves a talk twice.
import type { AttendeeRow, RecordPayload } from "@/core/record";

export type OutboxItem = {
  record: RecordPayload;
  attendees: AttendeeRow[];
  queuedAt: string;
  lastError: string | null;
};

const KEY = "tt-outbox";
const listeners = new Set<() => void>();

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
  return read().filter((i) => !companyId || i.record.company_id === companyId);
}

/** Put a finished talk on the phone. Throws only if the phone can't store it at all. */
export function enqueue(record: RecordPayload, attendees: AttendeeRow[]) {
  const items = read().filter((i) => i.record.client_id !== record.client_id);
  items.push({ record, attendees, queuedAt: new Date().toISOString(), lastError: null });
  write(items);
}

let flushing: Promise<{ uploaded: number; failed: number }> | null = null;

/** Upload everything waiting, oldest first. One flush at a time. */
export function flush(upload: (r: RecordPayload, a: AttendeeRow[]) => Promise<unknown>): Promise<{ uploaded: number; failed: number }> {
  if (flushing) return flushing;
  flushing = (async () => {
    let uploaded = 0, failed = 0;
    for (const item of read()) {
      try {
        await upload(item.record, item.attendees);
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
