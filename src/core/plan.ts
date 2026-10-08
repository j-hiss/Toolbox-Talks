// The 52-week plan. Pure module: the one plan builder (see BLUEPRINT-reuse-map.md).
// Origin: prototype/index.html buildPlan, cycleStart, thisWeek.
import type { Climate } from "./climate";
import { talkFitsClimate, talksFor, type Talk } from "./talks";
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

/**
 * The talks a company picked for its plan (Admin → Talks), starting the week of `from_week` (a Monday). Lists are
 * kept, never edited once their week starts, so past weeks keep the talk they were planned with.
 */
export type TalkList = { from_week: string; talk_ids: string[] };

export type PlanInput = {
  talks: Talk[];
  industry: IndustryId;
  climate: Climate;
  programStart: string;
  /** week key (YYYY-MM-DD) -> talk id */
  overrides?: Record<string, string>;
  /** The company's picked talk lists. None = its industry's talks plus the Every-job set. */
  lists?: TalkList[];
  today?: Date;
};

/** The talk list in effect for a week: the latest one starting on or before that Monday, or null for the default. */
export function listFor(lists: TalkList[] | undefined, weekKey: string): TalkList | null {
  let best: TalkList | null = null;
  for (const l of lists ?? []) if (l.from_week <= weekKey && (!best || l.from_week > best.from_week)) best = l;
  return best;
}

/**
 * The talks a week's plan draws from, in library order: the company's picked list for that week, else its
 * industry's talks. Talks that don't fit the climate (storm prep away from hurricanes) are never planned. A picked
 * list with nothing usable left falls back to the industry's talks, so a plan always has a talk.
 */
export function talksInPlan(input: Pick<PlanInput, "talks" | "industry" | "climate" | "lists">, weekKey: string): Talk[] {
  const fallback = talksFor(input.talks, input.industry, input.climate);
  const list = listFor(input.lists, weekKey);
  if (!list) return fallback;
  const ids = new Set(list.talk_ids);
  const picked = input.talks.filter((t) => ids.has(t.id) && talkFitsClimate(t, input.climate));
  return picked.some((t) => !SEASONAL.has(t.id)) ? picked : fallback;
}

/**
 * Builds the 52-week plan. Heat, cold and storm talks land by season for the company's climate; every other week
 * cycles through the remaining talks in library order, from the talk list in effect that week. Admin overrides win.
 */
export function buildPlan({ talks, industry, climate: c, programStart, overrides = {}, lists, today = new Date() }: PlanInput): PlanWeek[] {
  if (!talksFor(talks, industry, c).some((t) => !SEASONAL.has(t.id))) throw new Error(`No non-seasonal talks for industry "${industry}"`);

  const start = cycleStart(programStart, today);
  const peakHeat = c.hotLong ? [4, 5, 6, 7, 8, 9] : [5, 6, 7]; // months, 0 = January
  const shoulderHeat = c.hotLong ? [3] : [4, 8];
  const weeks: PlanWeek[] = [];
  let next = 0;

  for (let w = 0; w < WEEKS_PER_PLAN; w++) {
    const monday = addDays(start, 7 * w);
    const key = isoDay(monday);
    const available = talksInPlan({ talks, industry, climate: c, lists }, key);
    const has = (id: string) => available.some((t) => t.id === id);
    const pool = available.filter((t) => !SEASONAL.has(t.id));
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

/** The Monday a new talk list starts: next week. This week's talk is already set (and may already be given). */
export function nextListWeek(today: Date = new Date()): string {
  return isoDay(addDays(mondayOf(today), 7));
}

/** Why a picked list can't be saved, or null when it can: it needs at least one talk that isn't seasonal. */
export function talkListProblem(ids: Iterable<string>, talks: Talk[]): string | null {
  const set = new Set(ids);
  const usable = talks.filter((t) => set.has(t.id) && !SEASONAL.has(t.id));
  return usable.length === 0 ? "Pick at least one talk besides heat, cold and storm prep." : null;
}

/** True for the talks the plan places by season (heat, cold, storm prep) rather than in rotation. */
export const isSeasonal = (id: string) => SEASONAL.has(id);
