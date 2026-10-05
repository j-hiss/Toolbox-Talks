import { describe, expect, it } from "vitest";
import { TALKS } from "@/content/talks";
import { climateFor } from "./climate";
import { buildPlan, thisWeek } from "./plan";
import { canChangeWeek, canMakeUp, creditWeek, makeupReasonText, makeupWeeks, planWeekAt, signedFor, stillNeeds } from "./makeup";
import { recordPayload } from "./record";
import { parseDay } from "./weeks";

const OCT_6_2026 = new Date(2026, 9, 6); // Tuesday of the week of Oct 5
const base = { talks: TALKS, industry: "con" as const, climate: climateFor("33913"), programStart: "2026-09-07" };

describe("makeups", () => {
  it("offers past weeks newest first, up to the limit", () => {
    const weeks = makeupWeeks(base, 3, OCT_6_2026);
    expect(weeks.map((w) => w.key)).toEqual(["2026-09-28", "2026-09-21", "2026-09-14"]);
    expect(weeks.map((w) => w.n)).toEqual([4, 3, 2]);
  });
  it("never offers weeks before the program started", () => {
    expect(makeupWeeks(base, 52, OCT_6_2026).map((w) => w.key).at(-1)).toBe("2026-09-07");
    expect(makeupWeeks({ ...base, programStart: "2026-10-05" }, 4, OCT_6_2026)).toEqual([]);
  });
  it("a makeup gets the talk that was scheduled that week, admin swaps included", () => {
    const plan = buildPlan({ ...base, today: parseDay("2026-09-21") });
    const scheduled = thisWeek(plan, parseDay("2026-09-21"))!.talkId;
    expect(planWeekAt(base, parseDay("2026-09-21"))!.talkId).toBe(scheduled);
    expect(planWeekAt({ ...base, overrides: { "2026-09-21": "ppe" } }, parseDay("2026-09-21"))!.talkId).toBe("ppe");
  });
  it("finds a week in the previous 52-week cycle", () => {
    const w = planWeekAt({ ...base, programStart: "2025-09-08" }, parseDay("2026-08-31"));
    expect(w?.n).toBe(52);
  });
  it("enforces the limit", () => {
    expect(canMakeUp("2026-09-28", 1, OCT_6_2026)).toBe(true);
    expect(canMakeUp("2026-09-21", 1, OCT_6_2026)).toBe(false);
    expect(canMakeUp("2026-10-05", 4, OCT_6_2026)).toBe(false); // this week isn't a makeup
  });
  it("needs a reason; Other needs a note", () => {
    expect(makeupReasonText("", "x")).toBe("");
    expect(makeupReasonText("Out sick", "")).toBe("Out sick");
    expect(makeupReasonText("Out sick", " flu ")).toBe("Out sick: flu");
    expect(makeupReasonText("Other", "  ")).toBe("");
    expect(makeupReasonText("Other", "court date")).toBe("Other: court date");
  });
  it("a makeup keeps its real week and counts toward the week it makes up", () => {
    const p = recordPayload({
      companyId: "c", clientId: "x", talkId: "ppe", language: "en", content: { title: "t", hook: "", sections: [], ask: "" },
      week: { number: 5, start: "2026-10-05", scheduledTalkId: "heat" }, jobsite: null, team: null,
      presenter: { personId: null, name: "P", role: "", signature: null }, heldAt: "2026-10-06T13:00:00Z", gps: null,
      makeup: { weekStart: "2026-09-21", reason: "Out sick" },
    });
    expect(p).toMatchObject({ week_start: "2026-10-05", week_number: 5, makeup_for_week: "2026-09-21", makeup_reason: "Out sick", held_at: "2026-10-06T13:00:00Z" });
    expect(creditWeek(p)).toBe("2026-09-21");
    expect(creditWeek({ week_start: "2026-10-05", makeup_for_week: null })).toBe("2026-10-05");
  });
  it("who still needs a week's talk: on-time and makeup signatures both count; absent and not-signed don't", () => {
    const people = [{ id: "a", active: true }, { id: "b", active: true }, { id: "c", active: true }, { id: "d", active: false }, { id: "e", active: true }];
    const records = [
      { week_start: "2026-09-21", makeup_for_week: null, attendees: [{ person_id: "a", status: "signed" }, { person_id: "b", status: "absent" }] },
      { week_start: "2026-10-05", makeup_for_week: "2026-09-21", attendees: [{ person_id: "c", status: "signed" }, { person_id: "e", status: "not_signed" }] },
      { week_start: "2026-09-21", makeup_for_week: "2026-09-14", attendees: [{ person_id: "b", status: "signed" }] }, // a different week's makeup
    ];
    const signed = signedFor("2026-09-21", records);
    expect(signed.sort()).toEqual(["a", "c"]);
    expect(stillNeeds(people, signed).map((p) => p.id)).toEqual(["b", "e"]);
  });
});

describe("weekly lock", () => {
  it("a week can change until it's given or over", () => {
    expect(canChangeWeek("2026-10-12", [], OCT_6_2026)).toBe(true);
    expect(canChangeWeek("2026-10-05", [], OCT_6_2026)).toBe(true); // this week, not given yet
    expect(canChangeWeek("2026-10-05", ["2026-10-05"], OCT_6_2026)).toBe(false); // given
    expect(canChangeWeek("2026-09-28", [], OCT_6_2026)).toBe(false); // over
  });
});
