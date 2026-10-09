import { describe, expect, it } from "vitest";
import { TALKS } from "@/content/talks";
import { climateFor } from "./climate";
import { buildPlan, repeatsFor, type RepeatSetting } from "./plan";
import { parseDay } from "./weeks";

const base = { talks: TALKS, industry: "wh" as const, climate: climateFor("55401"), programStart: "2026-10-05", today: parseDay("2026-10-07") };

describe("repeat talks", () => {
  it("no repeats means the same plan as before", () => {
    expect(buildPlan({ ...base, repeats: [] }).map((w) => w.talkId)).toEqual(buildPlan(base).map((w) => w.talkId));
  });

  it("a talk set to every 3 months comes up at least once in every 13 weeks from its start, and nothing before changes", () => {
    const repeats: RepeatSetting[] = [{ talk_id: "loto", from_week: "2026-10-19", every_months: 3 }];
    const before = buildPlan(base);
    const plan = buildPlan({ ...base, repeats });
    for (let i = 0; i < 52; i++) if (plan[i].key < "2026-10-19") expect(plan[i].talkId).toBe(before[i].talkId);
    const from = plan.findIndex((w) => w.key === "2026-10-19");
    for (let b = from; b + 13 <= 52; b += 13) expect(plan.slice(b, b + 13).some((w) => w.talkId === "loto")).toBe(true);
  });

  it("the rotation carries on where it was: no other talk is skipped for good", () => {
    const repeats: RepeatSetting[] = [{ talk_id: "loto", from_week: "2026-10-19", every_months: 12 }];
    const before = new Set(buildPlan(base).map((w) => w.talkId));
    const after = new Set(buildPlan({ ...base, repeats }).map((w) => w.talkId));
    for (const id of before) if (id !== "loto") expect(after.has(id)).toBe(true);
  });

  it("an admin's swap of the slot doesn't lose the repeat: it moves to the next open week", () => {
    const repeats: RepeatSetting[] = [{ talk_id: "loto", from_week: "2026-10-19", every_months: 3 }];
    const plan = buildPlan({ ...base, repeats });
    const slot = plan.find((w) => w.talkId === "loto" && w.key >= "2026-10-19")!;
    const swapped = buildPlan({ ...base, repeats, overrides: { [slot.key]: "fork" } });
    const from = swapped.findIndex((w) => w.key === "2026-10-19");
    expect(swapped.slice(from, from + 13).some((w) => w.talkId === "loto")).toBe(true);
  });

  it("a later 'off' stops it; the latest setting per talk wins", () => {
    const s: RepeatSetting[] = [{ talk_id: "loto", from_week: "2026-10-19", every_months: 3 }, { talk_id: "loto", from_week: "2027-01-04", every_months: 0 }];
    expect(repeatsFor(s, "2026-12-07").map((r) => r.weeks)).toEqual([13]);
    expect(repeatsFor(s, "2027-01-04")).toEqual([]);
    expect(repeatsFor(s, "2026-10-12")).toEqual([]);
  });
});
