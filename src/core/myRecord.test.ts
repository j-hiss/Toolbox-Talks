import { describe, expect, it } from "vitest";
import { myRecord } from "./myRecord";
import type { ReportRecord } from "./compliance";

const TODAY = new Date(2026, 9, 7); // Wed; this week = Oct 5
const me = { id: "me", name: "Example Worker", teamId: null, createdAt: "2026-08-01T00:00:00Z", deactivatedAt: null };
const P = (...keys: string[]) => keys.map((key) => ({ key, weeks: 1 }));
const rec = (week: string, status: "signed" | "not_signed" | "absent", makeupFor: string | null = null): ReportRecord => ({
  id: `${week}-${status}-${makeupFor}`, title: "Talk", heldAt: `${week}T13:00:00Z`, weekStart: week, makeupForWeek: makeupFor, makeupReason: makeupFor ? "Was out" : null,
  teamName: "", presenterId: null, presenterSigned: false, attendees: [{ personId: "me", name: "Example Worker", status }],
});

describe("my record", () => {
  it("matches the company math: on time, made up, owed, missed, streak, this week not scored", () => {
    const periods = P("2026-10-05", "2026-09-28", "2026-09-21", "2026-09-14", "2026-09-07", "2026-08-31", "2026-08-03");
    const r = myRecord({
      person: me, periods, makeupWeeks: 4, today: TODAY,
      records: [rec("2026-09-28", "signed"), rec("2026-09-21", "absent"), rec("2026-10-05", "signed", "2026-09-14"), rec("2026-09-07", "signed"), rec("2026-08-31", "not_signed")],
    });
    expect(r.tally).toMatchObject({ on_time: 2, made_up: 1, open: 1, missed: 2 });
    expect(r.owed.map((o) => o.week)).toEqual(["2026-09-21"]);
    expect(r.missed.sort()).toEqual(["2026-08-03", "2026-08-31"]);
    expect(r.streak).toBe(1); // Sep 28 held, Sep 21 open breaks it
    expect(r.closedRate).toBeCloseTo(3 / 6);
  });
  it("someone added this week has nothing scored yet", () => {
    const r = myRecord({ person: { ...me, createdAt: "2026-10-05T12:00:00Z" }, periods: P("2026-10-05", "2026-09-28"), records: [], makeupWeeks: 4, today: TODAY });
    expect(r.closedRate).toBeNull();
    expect(r.owed).toEqual([]);
  });
  it("a week they presented and signed as presenter counts as had, like Reports; unsigned presenting doesn't", () => {
    const gave = (week: string, signed: boolean): ReportRecord => ({ ...rec(week, "signed"), id: `gave-${week}`, presenterId: "me", presenterSigned: signed, attendees: [] });
    const r = myRecord({ person: me, periods: P("2026-09-28", "2026-09-21"), records: [gave("2026-09-28", true), gave("2026-09-21", false)], makeupWeeks: 4, today: TODAY });
    expect(r.tally).toMatchObject({ on_time: 1, open: 1 });
  });
});
