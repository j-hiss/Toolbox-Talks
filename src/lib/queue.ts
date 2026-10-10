// A small offline queue on the phone: save first, upload when there's signal, never twice (each item keeps one id).
// Each item belongs to the account that saved it, so on a shared phone it only uploads under that account.
// Used by inspections; the talk outbox (./outbox.ts) and trainer cards (./cardOutbox.ts) follow the same rules and
// can move onto this when they're next changed.
export type Queued<T> = { id: string; userId: string | null; item: T; queuedAt: string; lastError: string | null };

export type Queue<T> = {
  waiting: (userId: string | null, filter?: (item: T) => boolean) => Queued<T>[];
  add: (id: string, userId: string | null, item: T) => void;
  drop: (id: string) => void;
  flush: (userId: string | null, upload: (item: T) => Promise<unknown>) => Promise<{ sent: number; failed: number }>;
  onChange: (cb: () => void) => () => void;
};

export function createQueue<T>(key: string, fullMessage: string): Queue<T> {
  const listeners = new Set<() => void>();
  const read = (): Queued<T>[] => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
  const write = (items: Queued<T>[]) => {
    try { localStorage.setItem(key, JSON.stringify(items)); } catch { throw new Error(fullMessage); }
    listeners.forEach((l) => l());
  };
  let flushing: Promise<{ sent: number; failed: number }> | null = null;
  return {
    waiting: (userId, filter) => read().filter((q) => q.userId === userId && (!filter || filter(q.item))),
    add: (id, userId, item) => write([...read().filter((q) => q.id !== id), { id, userId, item, queuedAt: new Date().toISOString(), lastError: null }]),
    drop: (id) => write(read().filter((q) => q.id !== id)),
    flush: (userId, upload) => {
      if (flushing) return flushing;
      flushing = (async () => {
        let sent = 0, failed = 0;
        for (const q of read().filter((x) => x.userId === userId)) {
          try { await upload(q.item); write(read().filter((x) => x.id !== q.id)); sent++; }
          catch (e) { write(read().map((x) => (x.id === q.id ? { ...x, lastError: e instanceof Error ? e.message : String(e) } : x))); failed++; }
        }
        return { sent, failed };
      })().finally(() => { flushing = null; });
      return flushing;
    },
    onChange: (cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; },
  };
}
