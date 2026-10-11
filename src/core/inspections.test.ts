import { describe, expect, it } from "vitest";
import { CHECKLISTS } from "@/content/checklists";
import { TALKS } from "@/content/talks";
import { INDUSTRIES } from "./industries";
import { checklistsFor, dueFor, dueState, inspectionProblem, inspectionUpload, wordingHash, wordingMatch, wordingText } from "./inspections";

describe("checklist content", () => {
  it("every industry gets the Every-job set plus at least two of its own", () => {
    const everyJob = CHECKLISTS.filter((c) => c.industries.includes("all")).length;
    expect(everyJob).toBeGreaterThanOrEqual(5);
    for (const i of INDUSTRIES) {
      const own = checklistsFor(CHECKLISTS, i.id).length - everyJob;
      expect(own, i.id).toBeGreaterThanOrEqual(2);
    }
  });
  it("ids are unique, items cite a rule, sources are real links, and related talks exist", () => {
    const ids = CHECKLISTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of CHECKLISTS) {
      expect(c.rule, c.id).toBeTruthy();
      expect(c.sources.length, c.id).toBeGreaterThan(0);
      for (const s of c.sources) expect(s.url, c.id).toMatch(/^https:\/\/www\.(osha\.gov|ecfr\.gov)\//);
      expect(new Set(c.items.map((i) => i.id)).size, c.id).toBe(c.items.length);
      for (const it of c.items) expect(it.rule, `${c.id}/${it.id}`).toBeTruthy();
      if (c.talkId) expect(TALKS.some((t) => t.id === c.talkId), `${c.id} → ${c.talkId}`).toBe(true);
    }
  });
  it("never claims compliance", () => {
    expect(JSON.stringify(CHECKLISTS)).not.toMatch(/\bcomplian(t|ce)\b|\bpassed OSHA\b/i);
  });
});

describe("running an inspection", () => {
  it("every item marked, failures explained, signed", () => {
    const items = [{ text: "Guard in place", result: "pass" as const }, { text: "Work rest", result: null }];
    expect(inspectionProblem(items, "Example Lead", true)).toMatch(/1 still blank/);
    expect(inspectionProblem([{ text: "Work rest", result: "fail" }], "Example Lead", true)).toMatch(/what's wrong/);
    expect(inspectionProblem([{ text: "Work rest", result: "fail", note: "1/2 inch gap" }], "Example Lead", false)).toBe("Sign to finish.");
    expect(inspectionProblem([{ text: "Work rest", result: "na" }], "Example Lead", true)).toBeNull();
  });
  it("due from how often the rule asks", () => {
    const now = new Date(2026, 9, 10, 9);
    expect(dueState("daily", null, now).due).toBe(true);
    expect(dueState("each_shift", new Date(2026, 9, 10, 7).toISOString(), now).due).toBe(false);
    expect(dueState("daily", new Date(2026, 9, 9, 7).toISOString(), now).due).toBe(true);
    expect(dueState("monthly", new Date(2026, 8, 20).toISOString(), now).due).toBe(false);
    expect(dueState("monthly", new Date(2026, 7, 20).toISOString(), now).due).toBe(true);
    expect(dueState("each_use", null, now).due).toBe(false);
    expect(dueFor({ when: "daily", industries: ["con"] }, null, now).due).toBe(false); // not every crew has a trench
    expect(dueFor({ when: "daily", industries: ["all"] }, null, now).due).toBe(true);
  });
  it("photos and signature become files in the inspection's own folder", () => {
    const up = inspectionUpload({
      company_id: "co", client_id: "cl", checklist_id: "grinders", checklist_version: 1, title: "Bench grinders", rule: "", subject: "", jobsite_id: null, jobsite_name: "",
      inspector_person_id: null, inspector_name: "Example Lead", signature: "data:image/png;base64,AAA", notes: "", inspected_at: "2026-10-10T12:00:00Z", latitude: null, longitude: null,
      items: [{ id: "rest", text: "Work rest", result: "fail", note: " gap ", photo: "data:image/jpeg;base64,BBB" }, { id: "guard", text: "Guard", result: "pass" }],
    });
    expect(up.files.map((f) => f.path)).toEqual(["co/cl/signature.png", "co/cl/item-0.jpg"]);
    expect(up.insp.items[0]).toMatchObject({ note: "gap", photo_path: "co/cl/item-0.jpg" });
    expect(up.insp.items[1].photo_path).toBeNull();
    expect("photo" in up.insp.items[0]).toBe(false);
  });
});

// The same fixture and hash are checked against public.verify_inspection() in scripts/db-isolation-test.mjs, so the
// app and the database agree on the fingerprint byte for byte.
const WORDING_FIXTURE = { title: "Ladders – daily", rule: "OSHA 1926.1053(b)(15)", items: [
  { id: "feet", text: "Feet and rungs sound; no cracks", rule: "1926.1053(b)(15)" },
  { id: "label", text: "Label readable (año)" },
] };
const WORDING_FIXTURE_HASH = "ce32251b8e6109356c35c1f8c2bde373d688327a75384a017d602fcf99745dc3";

describe("checklist wording fingerprint", () => {
  it("joins title, rule and items in order, with blank item rules kept as empty", () => {
    expect(wordingText(WORDING_FIXTURE)).toBe("Ladders – daily\nOSHA 1926.1053(b)(15)\nfeet\tFeet and rungs sound; no cracks\t1926.1053(b)(15)\nlabel\tLabel readable (año)\t");
  });
  it("hashes to the value the database computes", async () => {
    expect(await wordingHash(WORDING_FIXTURE)).toBe(WORDING_FIXTURE_HASH);
  });
  it("tells standard wording from changed wording and from a version this app doesn't carry", async () => {
    const c = CHECKLISTS[0];
    const hash = await wordingHash(c);
    expect(await wordingMatch(CHECKLISTS, { checklist_id: c.id, checklist_version: c.version, wording_hash: hash })).toBe("standard");
    const edited = { ...c, items: c.items.map((i, n) => (n === 0 ? { ...i, text: i.text + " (mostly)" } : i)) };
    expect(await wordingMatch(CHECKLISTS, { checklist_id: c.id, checklist_version: c.version, wording_hash: await wordingHash(edited) })).toBe("different");
    expect(await wordingMatch(CHECKLISTS, { checklist_id: c.id, checklist_version: c.version + 1, wording_hash: hash })).toBe("unknown_version");
  });
  it("tabs, newlines and backslashes inside text can't pass for item boundaries (same vector as the database test)", async () => {
    const odd = { title: "Odd\ttitle", rule: "rule\\x", items: [{ id: "a", text: "x\t\nb\ty" }] };
    expect(await wordingHash(odd)).toBe("45b575df476f4d9ce185687d7211643f24cb96122eb33bc1bf2187adabf181a1");
    const split = { title: "T", rule: "R", items: [{ id: "a", text: "x", rule: "" }, { id: "b", text: "y", rule: "" }] };
    const smuggled = { title: "T", rule: "R", items: [{ id: "a", text: "x\t\nb\ty", rule: "" }] };
    expect(await wordingHash(smuggled)).not.toBe(await wordingHash(split));
  });
  it("every shipped checklist has a distinct fingerprint", async () => {
    const all = await Promise.all(CHECKLISTS.map(wordingHash));
    expect(new Set(all).size).toBe(CHECKLISTS.length);
  });
});
