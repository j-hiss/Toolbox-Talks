import { describe, expect, it } from "vitest";
import { TALKS } from "@/content/talks";
import { climateFor } from "./climate";
import { buildPlan, cadenceFor, nextCadenceWeek, periodEnd, thisWeek, weekNumbers, type CadenceSetting } from "./plan";
import { canChangeWeek, canMakeUp, makeupWeeks, periodKeys, planWeekAt } from "./makeup";
import { buildCompliance, makeupDeadline, type ReportRecord } from "./compliance";
import { isoDay, parseDay } from "./weeks";

const base = { talks: TALKS, industry: "con" as const, climate: climateFor("33913"), programStart: "2026-01-05" };
const every = (weeks: 1 | 2 | 4, from = "2026-01-05"): CadenceSetting[] => [{ from_week: from, weeks }];

describe("cadence", () => {
  it("weekly by default: 52 one-week periods", () => {
    const plan = buildPlan({ ...base, today: parseDay("2026-03-04") });
    expect(plan).toHaveLength(52);
    expect(plan.every((w) => w.weeks === 1)).toBe(true);
    expect(cadenceFor(undefined, "2026-03-02")).toBe(1);
  });

  it("every 4 weeks: 13 periods covering the whole cycle, one talk each", () => {
    const plan = buildPlan({ ...base, cadences: every(4), today: parseDay("2026-03-04") });
    expect(plan).toHaveLength(13);
    expect(plan.reduce((n, w) => n + w.weeks, 0)).toBe(52);
    expect(plan[1].key).toBe("2026-02-02");
    expect(weekNumbers(plan[1])).toBe("Weeks 5–8");
    expect(isoDay(periodEnd(plan[1]))).toBe("2026-03-02");
  });

  it("every 2 weeks: 26 periods; any day in a period finds the same talk", () => {
    const input = { ...base, cadences: every(2) };
    const plan = buildPlan({ ...input, today: parseDay("2026-03-04") });
    expect(plan).toHaveLength(26);
    const a = thisWeek(plan, parseDay("2026-03-02"));
    const b = thisWeek(plan, parseDay("2026-03-13"));
    expect(a?.key).toBe("2026-03-02");
    expect(b?.key).toBe("2026-03-02");
    expect(planWeekAt(input, parseDay("2026-03-09"))?.talkId).toBe(a?.talkId);
  });

  it("hurricane country still gets storm prep on a 4-week cadence", () => {
    const plan = buildPlan({ ...base, cadences: every(4), today: parseDay("2026-03-04") });
    expect(plan.filter((w) => w.talkId === "storm").length).toBeGreaterThan(0);
    expect(plan.filter((w) => w.talkId === "heat").length).toBeGreaterThan(0);
  });

  it("a cadence change only affects periods from its start Monday on", () => {
    const weekly = buildPlan({ ...base, today: parseDay("2026-03-04") });
    const changed = buildPlan({ ...base, cadences: every(4, "2026-04-06"), today: parseDay("2026-03-04") });
    const before = (p: typeof weekly) => p.filter((w) => w.key < "2026-04-06").map((w) => [w.key, w.talkId]);
    expect(before(changed)).toEqual(before(weekly));
    expect(changed.find((w) => w.key === "2026-04-06")?.weeks).toBe(4);
  });

  it("a new cadence starts when the current period ends", () => {
    const input = { ...base, cadences: every(4) };
    expect(nextCadenceWeek(input, parseDay("2026-02-11"))).toBe("2026-03-02");
    expect(nextCadenceWeek(base, parseDay("2026-02-11"))).toBe("2026-02-16");
  });

  it("the last period of a cycle never runs into the next cycle", () => {
    const plan = buildPlan({ ...base, cadences: every(4, "2026-01-12"), today: parseDay("2026-03-04") });
    expect(plan[0].weeks).toBe(1); // weekly until the change
    expect(plan.reduce((n, w) => n + w.weeks, 0)).toBe(52);
    expect(plan[plan.length - 1].weeks).toBe(3); // 51 weeks left after week 1: 12 × 4 + 3
  });
});

describe("makeups, locks and scoring on a 4-week cadence", () => {
  const input = { ...base, cadences: every(4) };
  const today = parseDay("2026-03-18"); // inside the period that starts 2026-03-02

  it("past periods to make up, newest first, not counting the current one", () => {
    const ws = makeupWeeks(input, 4, today);
    expect(ws.map((w) => w.key)).toEqual(["2026-02-02"]); // its last week (Feb 23) is within 4 weeks
    expect(makeupWeeks(input, 8, today).map((w) => w.key)).toEqual(["2026-02-02", "2026-01-05"]);
  });

  it("a period can be changed until it ends, and can be made up only after", () => {
    expect(canChangeWeek("2026-03-02", [], today, 4)).toBe(true);
    expect(canChangeWeek("2026-03-02", ["2026-03-02"], today, 4)).toBe(false);
    expect(canChangeWeek("2026-02-02", [], today, 4)).toBe(false);
    expect(canMakeUp("2026-02-02", 4, today, 4)).toBe(true);
    expect(canMakeUp("2026-03-02", 4, today, 4)).toBe(false);
    expect(isoDay(makeupDeadline("2026-02-02", 4, 4))).toBe("2026-03-29");
  });

  it("a talk in any week of the period closes it; the current period is due, not scored", () => {
    const keys = periodKeys(input, "2026-01-05", today);
    expect(keys).toEqual([{ key: "2026-03-02", weeks: 4 }, { key: "2026-02-02", weeks: 4 }, { key: "2026-01-05", weeks: 4 }]);
    const person = { id: "p1", name: "Ana", teamId: null, createdAt: "2025-12-01T00:00:00Z", deactivatedAt: null };
    const rec = (id: string, weekStart: string, heldAt: string): ReportRecord => ({
      id, title: "t", heldAt, weekStart, makeupForWeek: null, makeupReason: null, teamName: "", presenterId: null, presenterSigned: false,
      attendees: [{ personId: "p1", name: "Ana", status: "signed" }],
    });
    // Held in the third week of the January period: its record carries the period's first Monday.
    const c = buildCompliance({ people: [person], records: [rec("r1", "2026-01-05", "2026-01-21T13:00:00Z")], weeks: keys, makeupWeeks: 4, today });
    expect(c.weeks.map((w) => [w.key, w.people[0].state])).toEqual([["2026-03-02", "due"], ["2026-02-02", "open"], ["2026-01-05", "on_time"]]);
    expect(c.total.expected).toBe(2);
  });
});

describe("state rules for cadence", () => {
  it("warns only where a checked state rule asks for more often", async () => {
    const { cadenceWarning } = await import("./staterules");
    expect(cadenceWarning("WA", "roof", 2)).toMatch(/WAC 296-155-110/);
    expect(cadenceWarning("WA", "roof", 1)).toBeNull();
    expect(cadenceWarning("CA", "con", 2)).toBeNull();
    expect(cadenceWarning("CA", "con", 4)).toMatch(/8 CCR 1509/);
    expect(cadenceWarning("CA", "wh", 4)).toBeNull(); // the rule is for construction
    expect(cadenceWarning("FL", "con", 4)).toBeNull();
  });
});
