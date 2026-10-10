import { beforeEach, describe, expect, it } from "vitest";
import { createQueue } from "./queue";

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  (globalThis as { localStorage?: unknown }).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) };
});

describe("offline queue", () => {
  it("keeps one copy per id, uploads only the saver's items, and keeps failures with the error", async () => {
    const q = createQueue<{ n: number }>("t", "full");
    q.add("a", "u1", { n: 1 }); q.add("a", "u1", { n: 2 }); q.add("b", "u2", { n: 3 });
    expect(q.waiting("u1").map((x) => x.item.n)).toEqual([2]);
    const seen: number[] = [];
    const r = await q.flush("u1", async (i) => { seen.push(i.n); });
    expect(r).toEqual({ sent: 1, failed: 0 });
    expect(seen).toEqual([2]);
    expect(q.waiting("u2")).toHaveLength(1);
    const r2 = await q.flush("u2", async () => { throw new Error("no signal"); });
    expect(r2.failed).toBe(1);
    expect(q.waiting("u2")[0].lastError).toBe("no signal");
  });
});
