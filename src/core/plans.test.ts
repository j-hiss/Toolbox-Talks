import { describe, expect, it } from "vitest";
import { FAIR_PRICE, PLAN_SIZES, peopleLimit, planAllows, sizeForPeople, yearly } from "./plans";

describe("plans", () => {
  it("three flat sizes that grow in price and people", () => {
    expect(PLAN_SIZES.map((s) => [s.id, s.monthly, s.people])).toEqual([["crew", 29, 25], ["company", 79, 100], ["larger", 149, 250]]);
    expect(yearly(PLAN_SIZES[0])).toBe(290);
  });
  it("only a paid account is held to its size (same rule as the database)", () => {
    expect(planAllows({ plan: "trial", tier: "crew" }, "programs")).toBe(true);
    expect(planAllows({ plan: "paid", tier: "crew" }, "programs")).toBe(false);
    expect(planAllows({ plan: "paid", tier: "company" }, "osha_log")).toBe(true);
    expect(planAllows({ plan: "paid" }, "own_talks")).toBe(true);
    expect(peopleLimit({ plan: "comp", tier: "crew" })).toBeNull();
    expect(peopleLimit({ plan: "paid", tier: "crew" })).toBe(25);
  });
  it("picks the smallest size that fits, or none past the largest", () => {
    expect(sizeForPeople(10)?.id).toBe("crew");
    expect(sizeForPeople(26)?.id).toBe("company");
    expect(sizeForPeople(251)).toBeNull();
  });
  it("the fair-price wording never claims compliance and never says per-user", () => {
    const all = JSON.stringify([FAIR_PRICE, PLAN_SIZES]);
    expect(all).not.toMatch(/complian|per user|per seat/i);
  });
});
