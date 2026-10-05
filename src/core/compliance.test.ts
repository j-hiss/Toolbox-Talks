import { describe, expect, it } from "vitest";
import { buildCompliance, makeupDeadline, onStaff, onTimeRate, pct, score, weekKeys, type ReportPerson, type ReportRecord } from "./compliance";
import { isoDay } from "./weeks";

const TODAY = new Date(2026, 9, 7); // Wed Oct 7 2026; this week = Oct 5
const person = (id: string, over: Partial<ReportPerson> = {}): ReportPerson => ({ id, name: id.toUpperCase(), teamId: "t1", createdAt: "2026-01-01T00:00:00Z", deactivatedAt: null, ...over });
let n = 0;
const rec = (weekStart: string, signed: string[], over: Partial<ReportRecord> = {}): ReportRecord => ({
  id: `r${++n}`, title: "Talk", heldAt: `${weekStart}T13:00:00Z`, weekStart, makeupForWeek: null, makeupReason: null, teamName: "Crew 1",
  presenterId: null, presenterSigned: false,
  attendees: signed.map((p) => ({ personId: p, name: p, status: "signed" as const })), ...over,
});

describe("weekly compliance", () => {
  const weeks = weekKeys("2026-08-24", TODAY); // Oct 5 back to Aug 24: 7 weeks
  it("lists weeks newest first through this week", () => {
    expect(weeks[0]).toBe("2026-10-05");
    expect(weeks.at(-1)).toBe("2026-08-24");
    expect(weeks).toHaveLength(7);
  });

  it("a makeup closes the week but stays marked; open vs missed follows the makeup limit; this week isn't scored", () => {
    const c = buildCompliance({
      people: [person("a"), person("b"), person("c")],
      records: [
        rec("2026-09-28", ["a", "b"]),                                                     // c open (within limit)
        rec("2026-09-21", ["a"], { attendees: [{ personId: "a", name: "a", status: "signed" }, { personId: "b", name: "b", status: "absent" }] }),
        rec("2026-10-05", ["b"], { makeupForWeek: "2026-09-21", makeupReason: "Out sick", heldAt: "2026-10-06T12:00:00Z" }), // b made up 9/21
        rec("2026-10-05", ["a"]),                                                          // this week
      ],
      weeks: weeks.slice(0, 3), // Oct 5, Sep 28, Sep 21
      makeupWeeks: 4,
      today: TODAY,
    });
    const wk = Object.fromEntries(c.weeks.map((w) => [w.key, w]));
    expect(wk["2026-10-05"].tally).toMatchObject({ expected: 3, on_time: 1, due: 2 });
    expect(wk["2026-09-28"].tally).toMatchObject({ on_time: 2, open: 1 });
    expect(wk["2026-09-21"].tally).toMatchObject({ on_time: 1, made_up: 1, open: 1 });
    const bMade = wk["2026-09-21"].people.find((p) => p.personId === "b")!;
    expect(bMade).toMatchObject({ state: "made_up", reason: "Out sick", signedOn: "2026-10-06T12:00:00Z" });
    // the makeup is counted toward Sep 21, never toward the week it was held in
    expect(wk["2026-10-05"].people.find((p) => p.personId === "b")!.state).toBe("due");
    // scored = past weeks only: 6 person-weeks, 4 closed (3 on time + 1 made up)
    expect(pct(score(c.total))).toBe("67%");
    expect(pct(onTimeRate(c.total))).toBe("50%");
  });

  it("weeks past the makeup limit are missed, not open", () => {
    const c = buildCompliance({ people: [person("a")], records: [], weeks: ["2026-09-28", "2026-08-24"], makeupWeeks: 4, today: TODAY });
    expect(c.weeks.map((w) => w.people[0].state)).toEqual(["open", "missed"]);
    expect(isoDay(makeupDeadline("2026-09-28", 4))).toBe("2026-11-01");
  });

  it("zero records for a week is missed, not fine", () => {
    const c = buildCompliance({ people: [person("a"), person("b")], records: [], weeks: ["2026-08-24"], makeupWeeks: 1, today: TODAY });
    expect(c.weeks[0].tally).toMatchObject({ expected: 2, missed: 2 });
    expect(score(c.total)).toBe(0);
  });

  it("only expects people in weeks they were on staff", () => {
    const newHire = person("n", { createdAt: "2026-10-01T15:00:00Z" });   // added Thu of the Sep 28 week
    const leaver = person("l", { deactivatedAt: "2026-09-20T12:00:00Z" }); // gone before Sep 21
    expect(onStaff(newHire, "2026-09-28")).toBe(true);
    expect(onStaff(newHire, "2026-09-21")).toBe(false);
    expect(onStaff(leaver, "2026-09-21")).toBe(false);
    expect(onStaff(leaver, "2026-09-14")).toBe(true);
    const c = buildCompliance({ people: [newHire, leaver], records: [], weeks: ["2026-09-21"], makeupWeeks: 4, today: TODAY });
    expect(c.weeks[0].tally.expected).toBe(0);
    expect(score(c.total)).toBeNull();
    expect(c.people).toHaveLength(0);
  });

  it("not signed and absent don't close a week; on time wins over a makeup for the same person", () => {
    const c = buildCompliance({
      people: [person("a"), person("b")],
      records: [
        rec("2026-09-28", [], { attendees: [{ personId: "a", name: "a", status: "not_signed" }, { personId: "b", name: "b", status: "signed" }] }),
        rec("2026-10-05", ["b"], { makeupForWeek: "2026-09-28", makeupReason: "x", heldAt: "2026-10-05T12:00:00Z" }),
      ],
      weeks: ["2026-09-28"], makeupWeeks: 4, today: TODAY,
    });
    const s = Object.fromEntries(c.weeks[0].people.map((p) => [p.personId, p.state]));
    expect(s).toEqual({ a: "open", b: "on_time" });
  });

  it("a presenter who signed as presenter has had the week's talk; an unsigned presenter hasn't", () => {
    const c = buildCompliance({
      people: [person("lead"), person("lead2")],
      records: [rec("2026-09-28", [], { presenterId: "lead", presenterSigned: true }), rec("2026-09-28", [], { presenterId: "lead2", presenterSigned: false })],
      weeks: ["2026-09-28"], makeupWeeks: 4, today: TODAY,
    });
    expect(Object.fromEntries(c.weeks[0].people.map((p) => [p.personId, p.state]))).toEqual({ lead: "on_time", lead2: "open" });
  });
});
