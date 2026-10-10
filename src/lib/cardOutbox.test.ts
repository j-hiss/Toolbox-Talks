import { beforeEach, describe, expect, it } from "vitest";

const store = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v); }, removeItem: (k: string) => { store.delete(k); },
  clear: () => store.clear(), key: () => null, length: 0,
} as Storage;

const { saveCard, waitingCards, flushCards } = await import("./cardOutbox");
const cert = { personId: "p1", certType: "osha10", customName: "", issuedOn: null, expiresOn: null, note: "" };
const base = { companyId: "c1", trainerId: "t1", cert, label: "OSHA 10 for Ann" };

describe("card outbox", () => {
  beforeEach(() => store.clear());

  it("keeps one client id across retries, so a card is never sent twice", async () => {
    await saveCard({ ...base, userId: "u1" }, null);
    const ids: string[] = [];
    await flushCards("u1", async (c) => { ids.push(c.clientId); throw new Error("no signal"); });
    expect(waitingCards("u1")[0].lastError).toBe("no signal");
    await flushCards("u1", async (c) => { ids.push(c.clientId); });
    expect(ids[0]).toBe(ids[1]);
    expect(waitingCards("u1")).toEqual([]);
  });

  it("only sends the signed-in account's cards on a shared phone", async () => {
    await saveCard({ ...base, userId: "u1" }, null);
    await saveCard({ ...base, userId: "u2" }, null);
    const sent: string[] = [];
    await flushCards("u2", async (c) => { sent.push(c.userId!); });
    expect(sent).toEqual(["u2"]);
    expect(waitingCards("u1")).toHaveLength(1);
  });
});
