// The 52-week plan. Pure module: the one plan builder (see BLUEPRINT-reuse-map.md).
// Origin: prototype/index.html buildPlan, cycleStart, thisWeek.
//
// A plan is a list of talk periods. Weekly companies (the default) get 52 one-week periods, exactly as before.
// A company can choose a talk every 2 or every 4 weeks (Admin → Plan): then each entry covers that many weeks, and
// every consumer (home, talk, makeups, reports, the database lock) treats the entry as the unit, keyed by its first
// Monday. Periods never cross into the next 52-week cycle.
import type { Climate } from "./climate";
import { talkFitsClimate, talksFor, type Talk } from "./talks";
import type { IndustryId } from "./industries";
import { addDays, isoDay, mondayOf, parseDay, weeksBetween } from "./weeks";

export const WEEKS_PER_PLAN = 52;
const SEASONAL = new Set(["heat", "cold", "storm"]);

export type PlanWeek = {
  /** Week number of the period's first week in the 52-week cycle, 1–52. */
  n: number;
  /** The period's first Monday. */
  monday: Date;
  /** That Monday as YYYY-MM-DD; the key overrides, records and makeups use. */
  key: string;
  /** How many weeks this talk period covers (1 for weekly companies). */
  weeks: number;
  talkId: string;
  /** True when an admin swapped this period's talk. */
  changed: boolean;
};

/** How often a crew gets a new talk, in weeks. 4 weeks is the "monthly" choice: never longer than a month. */
export type Cadence = 1 | 2 | 4;
export const CADENCES: { weeks: Cadence; name: string; sub: string }[] = [
  { weeks: 1, name: "Every week", sub: "A new talk each Monday" },
  { weeks: 2, name: "Every 2 weeks", sub: "A new talk every other Monday" },
  { weeks: 4, name: "Every 4 weeks", sub: "Monthly: 13 talks a year, never more than a month apart" },
];

/** A cadence the company chose, starting the Monday `from_week`. Kept once it starts, like talk lists. */
export type CadenceSetting = { from_week: string; weeks: Cadence };

/** The cadence in effect on a Monday: the latest setting starting on or before it, else weekly. */
export function cadenceFor(settings: CadenceSetting[] | undefined, weekKey: string): Cadence {
  let best: CadenceSetting | null = null;
  for (const c of settings ?? []) if (c.from_week <= weekKey && (!best || c.from_week > best.from_week)) best = c;
  return best?.weeks ?? 1;
}

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

/**
 * A talk the company wants back on a schedule (Admin → Plan → Repeat talks): every 3, 6 or 12 months, starting the
 * Monday `from_week`. 0 = stop repeating from then. Kept once its week starts, like talk lists, so past weeks keep
 * their talks.
 */
export type RepeatEvery = 0 | 3 | 6 | 12;
export type RepeatSetting = { talk_id: string; from_week: string; every_months: RepeatEvery };
export const REPEAT_CHOICES: { months: Exclude<RepeatEvery, 0>; name: string; weeks: number }[] = [
  { months: 3, name: "Every 3 months", weeks: 13 },
  { months: 6, name: "Every 6 months", weeks: 26 },
  { months: 12, name: "Every year", weeks: 52 },
];

/** The repeats in effect for a week: per talk, the latest setting starting on or before it (0 = off). */
export function repeatsFor(settings: RepeatSetting[] | undefined, weekKey: string): { talkId: string; fromWeek: string; weeks: number }[] {
  const latest = new Map<string, RepeatSetting>();
  for (const r of settings ?? []) {
    if (r.from_week > weekKey) continue;
    const cur = latest.get(r.talk_id);
    if (!cur || r.from_week > cur.from_week) latest.set(r.talk_id, r);
  }
  return [...latest.values()]
    .filter((r) => r.every_months > 0)
    .map((r) => ({ talkId: r.talk_id, fromWeek: r.from_week, weeks: REPEAT_CHOICES.find((c) => c.months === r.every_months)!.weeks }))
    .sort((a, b) => a.talkId.localeCompare(b.talkId));
}

export type PlanInput = {
  talks: Talk[];
  industry: IndustryId;
  climate: Climate;
  programStart: string;
  /** week key (YYYY-MM-DD) -> talk id */
  overrides?: Record<string, string>;
  /** The company's picked talk lists. None = its industry's talks plus the Every-job set. */
  lists?: TalkList[];
  /** How often the company gives a new talk. None = every week. */
  cadences?: CadenceSetting[];
  /** Talks that must come back on a schedule. None = rotation only. */
  repeats?: RepeatSetting[];
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
 * Builds the plan for the 52-week cycle containing `today`. Heat, cold and storm talks land by season for the
 * company's climate; every other period cycles through the remaining talks in library order, from the talk list in
 * effect when the period starts. Admin overrides win.
 */
export function buildPlan({ talks, industry, climate: c, programStart, overrides = {}, lists, cadences, repeats, today = new Date() }: PlanInput): PlanWeek[] {
  if (!talksFor(talks, industry, c).some((t) => !SEASONAL.has(t.id))) throw new Error(`No non-seasonal talks for industry "${industry}"`);

  const start = cycleStart(programStart, today);
  const peakHeat = c.hotLong ? [4, 5, 6, 7, 8, 9] : [5, 6, 7]; // months, 0 = January
  const shoulderHeat = c.hotLong ? [3] : [4, 8];
  const stormWeek = (d: Date) => {
    const m = d.getMonth(), day = d.getDate();
    return (m === 4 && day >= 25) || // last week of May, before the season opens June 1
      (m === 5 && day <= 7) ||
      (m === 7 && day <= 7) || // ahead of the August–September peak
      (m === 8 && day >= 8 && day <= 14) ||
      (m === 9 && day >= 8 && day <= 14);
  };
  // A cadence change starts its own grid on its start Monday, so the period before it ends there.
  const starts = new Set((cadences ?? []).map((x) => x.from_week));
  const periods: PlanWeek[] = [];
  let next = 0;
  // Repeat talks: each one is given at least once in every block of its interval (counted from when the repeat
  // started). The first open rotation slot in a block takes it; the rotation then carries on where it was.
  const given = new Set<string>(); // `${talkId}@${block}`
  const blockOf = (r: { fromWeek: string; weeks: number }, d: Date) => Math.floor(weeksBetween(parseDay(r.fromWeek), d) / r.weeks);

  for (let w = 0, p = 0; w < WEEKS_PER_PLAN; p++) {
    const monday = addDays(start, 7 * w);
    const key = isoDay(monday);
    let len = 1;
    const want = cadenceFor(cadences, key);
    while (len < want && w + len < WEEKS_PER_PLAN && !starts.has(isoDay(addDays(monday, 7 * len)))) len++;
    const mondays = Array.from({ length: len }, (_, i) => addDays(monday, 7 * i));

    const available = talksInPlan({ talks, industry, climate: c, lists }, key);
    const has = (id: string) => available.some((t) => t.id === id);
    const pool = available.filter((t) => !SEASONAL.has(t.id));
    const m = monday.getMonth();

    let id: string;
    if (c.hurricane && mondays.some(stormWeek) && has("storm")) id = "storm";
    else if (peakHeat.includes(m) && p % 2 === 0 && has("heat")) id = "heat";
    else if (shoulderHeat.includes(m) && p % 3 === 0 && has("heat")) id = "heat";
    else if (c.cold === "full" && [11, 0, 1].includes(m) && p % 3 === 0 && has("cold")) id = "cold";
    else if (c.cold === "light" && mondays.some((d) => d.getMonth() === 0 && d.getDate() <= 7) && has("cold")) id = "cold";
    else {
      const due = repeatsFor(repeats, key).find((r) => {
        const t = talks.find((x) => x.id === r.talkId);
        return t && !SEASONAL.has(t.id) && talkFitsClimate(t, c) && !given.has(`${r.talkId}@${blockOf(r, monday)}`);
      });
      id = due ? due.talkId : pool[next++ % pool.length].id;
    }

    const override = overrides[key];
    const final = override ?? id;
    for (const r of repeatsFor(repeats, key)) if (r.talkId === final) given.add(`${r.talkId}@${blockOf(r, monday)}`);
    periods.push({ n: w + 1, monday, key, weeks: len, talkId: override ?? id, changed: override !== undefined && override !== id });
    w += len;
  }
  return periods;
}

/** The plan period containing `today` (this week's talk), or null if the program hasn't started yet. */
export function thisWeek(plan: PlanWeek[], today: Date = new Date()): PlanWeek | null {
  const key = isoDay(mondayOf(today));
  return plan.find((w) => w.key <= key && key < isoDay(periodEnd(w))) ?? null;
}

/** The Monday after a period ends. */
export const periodEnd = (w: Pick<PlanWeek, "monday" | "weeks">): Date => addDays(w.monday, 7 * w.weeks);

/** "Week 5" or "Weeks 5–8". */
export const weekNumbers = (w: Pick<PlanWeek, "n" | "weeks">): string => (w.weeks > 1 ? `Weeks ${w.n}–${w.n + w.weeks - 1}` : `Week ${w.n}`);

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

/** The Monday a new cadence starts: when the current talk period ends, so no period is cut short. */
export function nextCadenceWeek(input: Omit<PlanInput, "today">, today: Date = new Date()): string {
  const now = thisWeek(buildPlan({ ...input, today }), today);
  return now ? isoDay(periodEnd(now)) : isoDay(mondayOf(parseDay(input.programStart)) > today ? mondayOf(parseDay(input.programStart)) : addDays(mondayOf(today), 7));
}
