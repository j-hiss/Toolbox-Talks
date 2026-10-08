import { describe, expect, it } from "vitest";
import { TALKS } from "@/content/talks";
import { climateFor } from "./climate";
import { buildPlan, listFor, talksInPlan, type TalkList } from "./plan";
import { planWeekAt } from "./makeup";
import { talksFor } from "./talks";
import { parseDay } from "./weeks";

const base = { talks: TALKS, industry: "wh" as const, climate: climateFor("55401"), programStart: "2026-10-05" };

describe("picked talk lists", () => {
  it("no list means the industry's talks, same plan as before", () => {
    const a = buildPlan({ ...base, today: parseDay("2026-10-07") });
    const b = buildPlan({ ...base, lists: [], today: parseDay("2026-10-07") });
    expect(b.map((w) => w.talkId)).toEqual(a.map((w) => w.talkId));
    expect(talksInPlan(base, "2026-10-05").map((t) => t.id)).toEqual(talksFor(TALKS, "wh", base.climate).map((t) => t.id));
  });

  it("a list only changes weeks from its start week on", () => {
    const picked = ["fork", "pallet-jacks", "loading-docks"];
    const lists: TalkList[] = [{ from_week: "2026-11-02", talk_ids: picked }];
    const before = buildPlan({ ...base, today: parseDay("2026-10-07") });
    const after = buildPlan({ ...base, lists, today: parseDay("2026-10-07") });
    for (let i = 0; i < 52; i++) {
      if (after[i].key < "2026-11-02") expect(after[i].talkId).toBe(before[i].talkId);
      else expect([...picked, "heat", "cold"]).toContain(after[i].talkId);
    }
    expect(after.some((w) => w.key >= "2026-11-02" && w.talkId !== before[after.indexOf(w)].talkId)).toBe(true);
  });

  it("a past week keeps its talk when a later list is added (makeups see the same talk)", () => {
    const lists: TalkList[] = [{ from_week: "2026-12-07", talk_ids: ["fork", "racking"] }];
    const wk = parseDay("2026-10-19");
    expect(planWeekAt({ ...base, lists }, wk)?.talkId).toBe(planWeekAt(base, wk)?.talkId);
  });

  it("the latest list that has started wins", () => {
    const lists = [{ from_week: "2026-10-05", talk_ids: ["fork"] }, { from_week: "2026-11-02", talk_ids: ["racking"] }];
    expect(listFor(lists, "2026-10-26")?.talk_ids).toEqual(["fork"]);
    expect(listFor(lists, "2026-11-02")?.talk_ids).toEqual(["racking"]);
    expect(listFor(lists, "2026-09-28")).toBeNull();
  });

  it("a list can add a talk from another industry, in library order", () => {
    const ids = talksInPlan({ ...base, lists: [{ from_week: "2026-10-05", talk_ids: ["racking", "trenching", "fork"] }] }, "2026-10-05").map((t) => t.id);
    expect(ids).toEqual(TALKS.filter((t) => ["racking", "trenching", "fork"].includes(t.id)).map((t) => t.id));
  });

  it("a list with only seasonal or unknown talks falls back to the industry's talks", () => {
    const lists = [{ from_week: "2026-10-05", talk_ids: ["heat", "no-such-talk"] }];
    expect(talksInPlan({ ...base, lists }, "2026-10-05").length).toBe(talksFor(TALKS, "wh", base.climate).length);
  });

  it("storm prep is never planned away from hurricane country, even if picked", () => {
    const lists = [{ from_week: "2026-10-05", talk_ids: ["storm", "fork"] }];
    expect(talksInPlan({ ...base, lists }, "2026-10-05").map((t) => t.id)).toEqual(["fork"]);
  });
});

describe("saving a talk list", () => {
  it("starts next Monday", async () => {
    const { nextListWeek } = await import("./plan");
    expect(nextListWeek(parseDay("2026-10-07"))).toBe("2026-10-12");
    expect(nextListWeek(parseDay("2026-10-12"))).toBe("2026-10-19");
  });
  it("needs a talk that isn't seasonal", async () => {
    const { talkListProblem } = await import("./plan");
    expect(talkListProblem(["heat", "cold"], TALKS)).not.toBeNull();
    expect(talkListProblem([], TALKS)).not.toBeNull();
    expect(talkListProblem(["heat", "fork"], TALKS)).toBeNull();
  });
});
