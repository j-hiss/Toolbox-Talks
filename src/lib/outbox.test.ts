import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RecordPayload } from "@/core/record";

// Minimal localStorage for node.
const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
});

const { enqueue, flush, pending, setOutboxUser } = await import("./outbox");
const rec = (id: string, company = "c1") => ({ client_id: id, company_id: company }) as unknown as RecordPayload;

describe("offline outbox", () => {
  beforeEach(() => store.clear());

  it("keeps talks on the phone until they upload", async () => {
    enqueue(rec("a"), []);
    enqueue(rec("b"), []);
    expect(pending("c1").map((i) => i.record.client_id)).toEqual(["a", "b"]);
    const r = await flush(async () => {});
    expect(r).toEqual({ uploaded: 2, failed: 0 });
    expect(pending()).toHaveLength(0);
  });

  it("keeps a talk and the error when the upload fails (no signal)", async () => {
    enqueue(rec("a"), []);
    const r = await flush(async () => { throw new Error("Failed to fetch"); });
    expect(r).toEqual({ uploaded: 0, failed: 1 });
    expect(pending()[0]).toMatchObject({ lastError: "Failed to fetch" });
    await flush(async () => {});
    expect(pending()).toHaveLength(0);
  });

  it("queuing the same talk twice keeps one copy", () => {
    enqueue(rec("a"), []);
    enqueue(rec("a"), []);
    expect(pending()).toHaveLength(1);
  });

  it("filters waiting talks by company", () => {
    enqueue(rec("a", "c1"), []);
    enqueue(rec("b", "c2"), []);
    expect(pending("c2").map((i) => i.record.client_id)).toEqual(["b"]);
  });

  it("a talk saved on a shared phone only uploads under the account that saved it", async () => {
    setOutboxUser("user-ana");
    const before = pending().length;
    enqueue({ company_id: "co-1", client_id: "shared-1" } as never, []);
    expect(pending().length).toBe(before + 1);
    setOutboxUser("user-ben");
    expect(pending().some((i) => i.record.client_id === "shared-1")).toBe(false);
    const sent: string[] = [];
    await flush(async (r) => { sent.push(r.client_id); });
    expect(sent).not.toContain("shared-1");
    setOutboxUser("user-ana");
    await flush(async (r) => { sent.push(r.client_id); });
    expect(sent).toContain("shared-1");
    setOutboxUser(null);
  });
});
