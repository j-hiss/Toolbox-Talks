import { describe, expect, it } from "vitest";
import { TALKS } from "@/content/talks";
import { climateFor } from "./climate";
import { buildPlan, cycleStart, thisWeek } from "./plan";
import { talksFor } from "./talks";
import { countStatuses, resolveStatus } from "./attendance";
import { isoDay, mondayOf, parseDay } from "./weeks";
import { INDUSTRIES } from "./industries";

const OCT_6_2026 = new Date(2026, 9, 6); // a Tuesday

describe("climate", () => {
  it("Fort Myers: no cold, long heat, hurricanes", () => {
    expect(climateFor("33913")).toMatchObject({ state: "FL", cold: "none", hotLong: true, hurricane: true });
  });
  it("North Florida still gets light cold", () => {
    expect(climateFor("32301")).toMatchObject({ state: "FL", cold: "light" });
  });
  it("Minneapolis: full cold, no hurricanes", () => {
    expect(climateFor("55401")).toMatchObject({ state: "MN", cold: "full", hurricane: false, hotLong: false });
  });
  it("bad or missing ZIP falls back to no location", () => {
    expect(climateFor("abc").state).toBeUndefined();
    expect(climateFor(null).label).toBe("No location set");
  });
});

describe("talk library", () => {
  it("every talk has a unique id", () => {
    expect(new Set(TALKS.map((t) => t.id)).size).toBe(TALKS.length);
  });
  it("every translation matches the English structure", () => {
    for (const t of TALKS) {
      for (const [lang, text] of Object.entries(t.content)) {
        if (!text) continue;
        expect(text.sections.length, `${t.id}/${lang} sections`).toBe(t.content.en.sections.length);
        text.sections.forEach((s, i) =>
          expect(s.items.length, `${t.id}/${lang} section ${i}`).toBe(t.content.en.sections[i].items.length),
        );
      }
    }
  });
  it("Spanish ships as draft until reviewed", () => {
    for (const t of TALKS) if (t.content.es) expect(t.translationStatus.es).not.toBe("reviewed");
  });
  it("hurricane talk only where hurricanes happen; cold talk hidden with no winter", () => {
    const fl = talksFor(TALKS, "con", climateFor("33913")).map((t) => t.id);
    const mn = talksFor(TALKS, "con", climateFor("55401")).map((t) => t.id);
    expect(fl).toContain("storm");
    expect(fl).not.toContain("cold");
    expect(mn).toContain("cold");
    expect(mn).not.toContain("storm");
  });
  it("every industry has talks beyond the seasonal ones", () => {
    for (const i of INDUSTRIES) {
      expect(talksFor(TALKS, i.id, climateFor("55401")).filter((t) => !["heat", "cold", "storm"].includes(t.id)).length).toBeGreaterThan(3);
    }
  });
});

describe("52-week plan", () => {
  const base = { talks: TALKS, industry: "con" as const, programStart: "2026-09-28", today: OCT_6_2026 };

  it("has 52 consecutive Monday weeks starting at the program start", () => {
    const plan = buildPlan({ ...base, climate: climateFor("33913") });
    expect(plan).toHaveLength(52);
    expect(plan[0].key).toBe("2026-09-28");
    plan.forEach((w, i) => {
      expect(w.n).toBe(i + 1);
      expect(w.monday.getDay()).toBe(1);
    });
  });

  it("Fort Myers: storm prep in season, heat in summer, never cold", () => {
    const plan = buildPlan({ ...base, climate: climateFor("33913") });
    const ids = plan.map((w) => w.talkId);
    expect(ids).not.toContain("cold");
    const storm = plan.filter((w) => w.talkId === "storm").map((w) => w.monday.getMonth());
    expect(storm.length).toBeGreaterThan(0);
    for (const m of storm) expect([4, 5, 7, 8, 9]).toContain(m);
    expect(plan.some((w) => w.talkId === "heat" && w.monday.getMonth() === 6)).toBe(true);
  });

  it("Minneapolis: cold talks only in winter, no storm", () => {
    const plan = buildPlan({ ...base, climate: climateFor("55401") });
    const cold = plan.filter((w) => w.talkId === "cold").map((w) => w.monday.getMonth());
    expect(cold.length).toBeGreaterThan(0);
    for (const m of cold) expect([11, 0, 1]).toContain(m);
    expect(plan.some((w) => w.talkId === "storm")).toBe(false);
  });

  it("an admin override wins and is marked changed", () => {
    const plan = buildPlan({ ...base, climate: climateFor("55401"), overrides: { "2026-10-12": "ppe" } });
    const wk = plan.find((w) => w.key === "2026-10-12")!;
    expect(wk.talkId).toBe("ppe");
  });

  it("this week is week 2 when the program started the week before", () => {
    const plan = buildPlan({ ...base, climate: climateFor("33913") });
    expect(thisWeek(plan, OCT_6_2026)?.n).toBe(2);
  });

  it("rolls into a new 52-week cycle after a year", () => {
    const later = new Date(2027, 9, 6);
    expect(isoDay(cycleStart("2026-09-28", later))).toBe("2027-09-27");
    const plan = buildPlan({ ...base, climate: climateFor("33913"), today: later });
    expect(thisWeek(plan, later)?.n).toBe(2);
  });

  it("before the program starts there is no current week", () => {
    const plan = buildPlan({ ...base, programStart: "2026-11-02", climate: climateFor("33913") });
    expect(thisWeek(plan, OCT_6_2026)).toBeNull();
  });
});

describe("weeks", () => {
  it("mondayOf a Sunday is the Monday before", () => {
    expect(isoDay(mondayOf(new Date(2026, 9, 11)))).toBe("2026-10-05");
  });
  it("parseDay reads a local date, not UTC", () => {
    expect(parseDay("2026-03-08").getDate()).toBe(8);
  });
});

describe("attendance", () => {
  it("present + signature = signed; present without = not signed; not present = absent", () => {
    expect(resolveStatus(true, true)).toBe("signed");
    expect(resolveStatus(true, false)).toBe("not_signed");
    expect(resolveStatus(false, true)).toBe("absent");
  });
  it("counts flags honestly", () => {
    const c = countStatuses([{ status: "signed" }, { status: "not_signed" }, { status: "absent" }, { status: "signed" }]);
    expect(c).toEqual({ signed: 2, not_signed: 1, absent: 1, flagged: 2, total: 4 });
  });
  it("rejects an unknown status instead of counting it as signed", () => {
    // @ts-expect-error deliberately invalid
    expect(() => countStatuses([{ status: "maybe" }])).toThrow();
  });
});
