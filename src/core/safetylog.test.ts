import { describe, expect, it } from "vitest";
import { bulletinHeading, crewSummaryProblems, selectBulletins, SINCE_LAST_DEFAULTS, sinceLastHint, windowStart, type Bulletin } from "./safetylog";

const b = (over: Partial<Bulletin>): Bulletin => ({
  id: "e1", kind: "inspection", occurred_on: "2026-10-05", jobsite_id: "site-a", jobsite_name: "Smith reroof",
  crew_summary: "Scaffold plank cracked on the north side; replaced.", case_status: null, status: "open",
  reviewed_at: "2026-10-05T15:00:00Z", ...over,
});
const on = { ...SINCE_LAST_DEFAULTS, enabled: true };

describe("since last talk: what gets read", () => {
  it("this jobsite plus company-wide items, not other jobsites", () => {
    const all = [b({ id: "a" }), b({ id: "co", jobsite_id: null, jobsite_name: "" }), b({ id: "other", jobsite_id: "site-b" })];
    const got = selectBulletins(all, on, { jobsiteId: "site-a", since: new Date("2026-10-01T00:00:00Z") });
    expect(got.map((x) => x.id)).toEqual(["a", "co"]);
    expect(selectBulletins(all, { ...on, scope: "all" }, { jobsiteId: "site-a", since: new Date("2026-10-01T00:00:00Z") })).toHaveLength(3);
  });

  it("only what happened or was approved since the window started", () => {
    const old = b({ id: "old", occurred_on: "2026-08-01", reviewed_at: "2026-08-02T00:00:00Z" });
    const lateApproval = b({ id: "late", occurred_on: "2026-08-01", reviewed_at: "2026-10-06T00:00:00Z" });
    const got = selectBulletins([old, lateApproval], on, { jobsiteId: "site-a", since: new Date("2026-10-01T00:00:00Z") });
    expect(got.map((x) => x.id)).toEqual(["late"]);
  });

  it("kinds and open-only follow the company's settings", () => {
    const all = [b({ id: "i" }), b({ id: "c", kind: "citation", case_status: "contested" }), b({ id: "closed", status: "closed" })];
    const at = { jobsiteId: "site-a", since: new Date("2026-10-01T00:00:00Z") };
    expect(selectBulletins(all, { ...on, kinds: ["citation"] }, at).map((x) => x.id)).toEqual(["c"]);
    expect(selectBulletins(all, { ...on, openOnly: true }, at).map((x) => x.id)).toEqual(["i", "c"]);
  });

  it("window: since the last talk there, else 30 days; or a fixed number of days", () => {
    const today = new Date("2026-10-08T12:00:00Z");
    expect(windowStart({ window: "since_last" }, "2026-10-01T13:00:00Z", today).toISOString()).toBe("2026-10-01T13:00:00.000Z");
    expect(windowStart({ window: "since_last" }, null, today).toISOString()).toBe("2026-09-08T12:00:00.000Z");
    expect(windowStart({ window: "60" }, "2026-10-01T13:00:00Z", today).toISOString()).toBe("2026-08-09T12:00:00.000Z");
  });

  it("a citation is read as alleged with its status until it's final", () => {
    expect(bulletinHeading(b({ kind: "citation", case_status: "contested" }), "en-US")).toBe("Citation (alleged, contested) · Oct 5 · Smith reroof");
    expect(bulletinHeading(b({ kind: "citation", case_status: null }), "en-US")).toMatch(/^Citation \(alleged, open\)/);
    expect(bulletinHeading(b({ kind: "citation", case_status: "final" }), "en-US")).toMatch(/^Citation \(final\)/);
    expect(bulletinHeading(b({ jobsite_id: null, jobsite_name: "" }), "en-US")).toBe("Inspection · Oct 5 · All jobsites");
  });

  it("states whose rule asks for this review get a hint", () => {
    expect(sinceLastHint("WA")).toMatch(/WAC 296-155-110/);
    expect(sinceLastHint("FL")).toBeNull();
  });
});

describe("crew summary checks", () => {
  const roster = ["Ana Lopez", "Will Carter", "Fred Foreman"];
  it("blocks names (full or last), claims, empty and long text", () => {
    expect(crewSummaryProblems("Scaffold plank replaced on the north side.", roster)).toEqual([]);
    expect(crewSummaryProblems("Lopez cut her hand on a box cutter.", roster).join()).toMatch(/Ana Lopez/);
    expect(crewSummaryProblems("Ana Lopez slipped near the dock.", roster).join()).toMatch(/Ana Lopez/);
    expect(crewSummaryProblems("We will mark the area and keep it clear.", roster)).toEqual([]); // "will" alone isn't a name
    expect(crewSummaryProblems("The site passed inspection.", roster).join()).toMatch(/passed/);
    expect(crewSummaryProblems("We are now OSHA compliant.", roster).join()).toMatch(/compliant/i);
    expect(crewSummaryProblems("  ", roster)).toHaveLength(1);
    expect(crewSummaryProblems("x".repeat(601), roster).join()).toMatch(/600/);
  });
});

describe("what the record keeps", () => {
  it("only items checked off, with when", async () => {
    const { sinceLastSnapshot } = await import("./safetylog");
    const snap = sinceLastSnapshot({
      status: "read", window: "since_last", since: "2026-10-01T00:00:00Z",
      items: [{ event_id: "a", heading: "Inspection · Oct 5 · Site", text: "Plank replaced." }, { event_id: "b", heading: "h", text: "t" }],
      checked: { a: "2026-10-08T13:00:00Z" },
    });
    expect(snap.items).toEqual([{ event_id: "a", heading: "Inspection · Oct 5 · Site", text: "Plank replaced.", reviewed_with_crew_at: "2026-10-08T13:00:00Z" }]);
  });
});
