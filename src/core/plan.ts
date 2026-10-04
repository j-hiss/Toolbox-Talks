// The 52-week plan. Pure module: the one plan builder (see BLUEPRINT-reuse-map.md).
// Origin: prototype/index.html buildPlan, cycleStart, thisWeek.
import type { Climate } from "./climate";
import { talksFor, type Talk } from "./talks";
import type { IndustryId } from "./industries";
import { addDays, isoDay, mondayOf, parseDay, weeksBetween } from "./weeks";

export const WEEKS_PER_PLAN = 52;
const SEASONAL = new Set(["heat", "cold", "storm"]);

export type PlanWeek = {
  /** 1–52 */
  n: number;
  monday: Date;
  /** Monday as YYYY-MM-DD; the key overrides are stored under. */
  key: string;
  talkId: string;
  /** True when an admin swapped this week's talk. */
  changed: boolean;
};

/**
 * The Monday that starts the plan cycle containing `today`. Week 1 is the company's program start; after 52 weeks
 * the plan rolls into a new cycle. Before the program starts, the first cycle is returned.
 */
export function cycleStart(programStart: string, today: Date = new Date()): Date {
  const start = mondayOf(parseDay(programStart));
  const weeks = weeksBetween(start, mondayOf(today));
  return weeks > 0 ? addDays(start, Math.floor(weeks / WEEKS_PER_PLAN) * WEEKS_PER_PLAN * 7) : start;
}

export type PlanInput = {
  talks: Talk[];
  industry: IndustryId;
  climate: Climate;
  programStart: string;
  /** week key (YYYY-MM-DD) -> talk id */
  overrides?: Record<string, string>;
  today?: Date;
};

/**
 * Builds the 52-week plan. Heat, cold and storm talks land by season for the company's climate; every other week
 * cycles through the remaining talks in library order. Admin overrides win.
 */
export function buildPlan({ talks, industry, climate: c, programStart, overrides = {}, today = new Date() }: PlanInput): PlanWeek[] {
  const available = talksFor(talks, industry, c);
  const has = (id: string) => available.some((t) => t.id === id);
  const pool = available.filter((t) => !SEASONAL.has(t.id));
  if (pool.length === 0) throw new Error(`No non-seasonal talks for industry "${industry}"`);

  const start = cycleStart(programStart, today);
  const peakHeat = c.hotLong ? [4, 5, 6, 7, 8, 9] : [5, 6, 7]; // months, 0 = January
  const shoulderHeat = c.hotLong ? [3] : [4, 8];
  const weeks: PlanWeek[] = [];
  let next = 0;

  for (let w = 0; w < WEEKS_PER_PLAN; w++) {
    const monday = addDays(start, 7 * w);
    const m = monday.getMonth();
    const day = monday.getDate();
    const stormWeek =
      (m === 4 && day >= 25) || // last week of May, before the season opens June 1
      (m === 5 && day <= 7) ||
      (m === 7 && day <= 7) || // ahead of the August–September peak
      (m === 8 && day >= 8 && day <= 14) ||
      (m === 9 && day >= 8 && day <= 14);

    let id: string;
    if (c.hurricane && stormWeek && has("storm")) id = "storm";
    else if (peakHeat.includes(m) && w % 2 === 0 && has("heat")) id = "heat";
    else if (shoulderHeat.includes(m) && w % 3 === 0 && has("heat")) id = "heat";
    else if (c.cold === "full" && [11, 0, 1].includes(m) && w % 3 === 0 && has("cold")) id = "cold";
    else if (c.cold === "light" && m === 0 && day <= 7 && has("cold")) id = "cold";
    else id = pool[next++ % pool.length].id;

    const key = isoDay(monday);
    const override = overrides[key];
    weeks.push({ n: w + 1, monday, key, talkId: override ?? id, changed: override !== undefined && override !== id });
  }
  return weeks;
}

/** This week's entry in the plan, or null if the program hasn't started yet. */
export function thisWeek(plan: PlanWeek[], today: Date = new Date()): PlanWeek | null {
  const key = isoDay(mondayOf(today));
  return plan.find((w) => w.key === key) ?? null;
}
