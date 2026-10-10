// Offline-first sending for the trainer portal, like the talk outbox (./outbox.ts): a card a trainer sends goes onto
// the phone FIRST, then uploads. With no signal it waits and sends later. Each card keeps one client id from the moment
// it's saved, so a retry after a dropped connection never sends it twice (review 2026-10-10). Card photos are shrunk
// on the phone (SHEET_MAX_SIDE keeps printed card text readable); a PDF is kept as it is, up to 3 MB.
import type { NewCert } from "@/lib/data/certs";
import { SHEET_MAX_SIDE, shrinkPhoto } from "@/lib/photo";

export type QueuedCard = {
  clientId: string; companyId: string; trainerId: string; userId: string | null;
  cert: NewCert; label: string; // label: "First aid / CPR for Example Diaz", for the waiting list
  photo: { data: string; name: string; type: string } | null;
  queuedAt: string; lastError: string | null;
};

const KEY = "tt-card-outbox";
const MAX_PDF_CHARS = 4_200_000; // about 3 MB once encoded
const listeners = new Set<() => void>();

function read(): QueuedCard[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(items: QueuedCard[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); }
  catch { throw new Error("This phone is out of room for saved cards. Connect to send the waiting cards, then try again."); }
  listeners.forEach((l) => l());
}
export function onCardOutboxChange(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }

/** This account's waiting cards, oldest first. */
export function waitingCards(userId: string | null): QueuedCard[] {
  return read().filter((c) => c.userId === userId);
}

const asDataUrl = (f: Blob) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(f); });

/** Put a card on the phone. Throws only if it can't be kept (a PDF too big, or no room). */
export async function saveCard(c: Omit<QueuedCard, "clientId" | "photo" | "queuedAt" | "lastError">, file: File | null): Promise<QueuedCard> {
  let photo: QueuedCard["photo"] = null;
  if (file) {
    if (file.type === "application/pdf") {
      const data = await asDataUrl(file);
      if (data.length > MAX_PDF_CHARS) throw new Error("This PDF is too big to keep on the phone. Take a photo of the card instead.");
      photo = { data, name: file.name, type: file.type };
    } else {
      photo = { data: await shrinkPhoto(file, SHEET_MAX_SIDE), name: file.name.replace(/\.\w+$/, "") + ".jpg", type: "image/jpeg" };
    }
  }
  const item: QueuedCard = { ...c, clientId: crypto.randomUUID(), photo, queuedAt: new Date().toISOString(), lastError: null };
  write([...read(), item]);
  return item;
}

/** Drop a waiting card the trainer no longer wants to send. */
export function discardCard(clientId: string) { write(read().filter((c) => c.clientId !== clientId)); }

let flushing: Promise<{ sent: number; failed: number }> | null = null;

/** Send this account's waiting cards, oldest first. One flush at a time. */
export function flushCards(userId: string | null, send: (c: QueuedCard, file: File | null) => Promise<unknown>): Promise<{ sent: number; failed: number }> {
  if (flushing) return flushing;
  flushing = (async () => {
    let sent = 0, failed = 0;
    for (const c of waitingCards(userId)) {
      try {
        const file = c.photo ? new File([await (await fetch(c.photo.data)).blob()], c.photo.name, { type: c.photo.type }) : null;
        await send(c, file);
        write(read().filter((x) => x.clientId !== c.clientId));
        sent++;
      } catch (e) {
        write(read().map((x) => (x.clientId === c.clientId ? { ...x, lastError: e instanceof Error ? e.message : String(e) } : x)));
        failed++;
      }
    }
    return { sent, failed };
  })().finally(() => { flushing = null; });
  return flushing;
}
