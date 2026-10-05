// Weekly compliance. Pure module: the one report query layer's math (see BLUEPRINT-reuse-map.md).
//
// Each person on staff that week has to sign that week's talk. Per person, per week:
//   on_time  signed in that week's own talk
//   made_up  signed later in a makeup for that week. It closes the week, and stays marked as made up (late).
//   open     past week, not signed yet, still inside the makeup limit
//   missed   past week, not signed, and too late to make up
//   due      this week, not signed yet (the week isn't over, so it isn't scored)
// Weekly compliance = (on time + made up) / people expected, over weeks that are over (this week is shown, not scored). On-time rate shows next to it,
// so makeups never hide that a week was late. Absent and not-signed count as not signed. A presenter who signed
// as presenter has had the talk.
import { creditWeek } from "./makeup";
import { addDays, isoDay, mondayOf, parseDay } from "./weeks";

export type WeekState = "on_time" | "made_up" | "open" | "missed" | "due";
export const WEEK_STATE_LABEL: Record<WeekState, string> = {
  on_time: "On time",
  made_up: "Made up",
  open: "Open",
  missed: "Missed",
  due: "Due this week",
};

export type ReportPerson = { id: string; name: string; teamId: string | null; createdAt: string; deactivatedAt: string | null };
export type ReportAttendee = { personId: string | null; name: string; status: "signed" | "not_signed" | "absent" };
export type ReportRecord = {
  id: string;
  title: string;
  heldAt: string;
  weekStart: string | null;
  makeupForWeek: string | null;
  makeupReason: string | null;
  teamName: string;
  /** The presenter covers the week too when they signed as presenter. */
  presenterId: string | null;
  presenterSigned: boolean;
  attendees: ReportAttendee[];
};

export type PersonWeek = {
  personId: string;
  week: string;
  state: WeekState;
  /** The record that closed the week (first on-time signature, else first makeup). */
  recordId: string | null;
  signedOn: string | null;
  reason: string | null;
};

export type Tally = { expected: number; on_time: number; made_up: number; open: number; missed: number; due: number };
const zero = (): Tally => ({ expected: 0, on_time: 0, made_up: 0, open: 0, missed: 0, due: 0 });

/** Share of scored person-weeks that are closed (on time or made up). Null when nothing is scored yet. */
export function score(t: Tally): number | null {
  const scored = t.expected - t.due;
  return scored > 0 ? (t.on_time + t.made_up) / scored : null;
}
export function onTimeRate(t: Tally): number | null {
  const scored = t.expected - t.due;
  return scored > 0 ? t.on_time / scored : null;
}
export const pct = (v: number | null) => (v === null ? "–" : `${Math.round(v * 100)}%`);

/** Was this person on staff during the week of `weekKey`? Added before it ended, not deactivated before it began. */
export function onStaff(p: ReportPerson, weekKey: string): boolean {
  const start = parseDay(weekKey);
  const end = addDays(start, 7);
  if (new Date(p.createdAt) >= end) return false;
  return !p.deactivatedAt || new Date(p.deactivatedAt) >= start;
}

/** Week keys from `fromKey` through this week, newest first. */
export function weekKeys(fromKey: string, today: Date = new Date()): string[] {
  const out: string[] = [];
  const first = parseDay(fromKey);
  for (let d = mondayOf(today); d >= first; d = addDays(d, -7)) out.push(isoDay(d));
  return out;
}

export type Compliance = {
  weeks: { key: string; tally: Tally; people: PersonWeek[]; recordIds: string[] }[];
  people: { person: ReportPerson; tally: Tally; weeks: PersonWeek[] }[];
  total: Tally;
};

export function buildCompliance(input: {
  people: ReportPerson[];
  records: ReportRecord[];
  weeks: string[];            // newest first, from weekKeys()
  makeupWeeks: number;        // the company's makeup limit
  today?: Date;
}): Compliance {
  const today = input.today ?? new Date();
  const thisWeek = isoDay(mondayOf(today));
  const oldestMakeup = isoDay(addDays(mondayOf(today), -7 * input.makeupWeeks));

  // person -> week -> how they closed it
  const closed = new Map<string, { state: "on_time" | "made_up"; recordId: string; signedOn: string; reason: string | null }>();
  const byHeld = [...input.records].sort((a, b) => a.heldAt.localeCompare(b.heldAt));
  for (const r of byHeld) {
    const week = creditWeek({ week_start: r.weekStart, makeup_for_week: r.makeupForWeek });
    if (!week) continue;
    const state = r.makeupForWeek ? "made_up" : "on_time";
    const signers = r.attendees.filter((a) => a.personId && a.status === "signed").map((a) => a.personId!);
    if (r.presenterId && r.presenterSigned) signers.push(r.presenterId);
    for (const personId of signers) {
      const k = `${personId}|${week}`;
      const prev = closed.get(k);
      if (!prev || (prev.state === "made_up" && state === "on_time")) {
        closed.set(k, { state, recordId: r.id, signedOn: r.heldAt, reason: r.makeupReason });
      }
    }
  }

  const total = zero();
  const people = input.people.map((person) => ({ person, tally: zero(), weeks: [] as PersonWeek[] }));
  const weeks = input.weeks.map((key) => {
    const tally = zero();
    const rows: PersonWeek[] = [];
    for (const p of people) {
      if (!onStaff(p.person, key)) continue;
      const c = closed.get(`${p.person.id}|${key}`);
      const state: WeekState = c ? c.state : key >= thisWeek ? "due" : key >= oldestMakeup ? "open" : "missed";
      const row: PersonWeek = { personId: p.person.id, week: key, state, recordId: c?.recordId ?? null, signedOn: c?.signedOn ?? null, reason: c?.state === "made_up" ? c.reason : null };
      rows.push(row);
      p.weeks.push(row);
      // This week isn't over: it shows on its own row but stays out of the score until it ends.
      for (const t of key >= thisWeek ? [tally] : [tally, p.tally, total]) { t.expected++; t[state]++; }
    }
    const recordIds = input.records.filter((r) => creditWeek({ week_start: r.weekStart, makeup_for_week: r.makeupForWeek }) === key).map((r) => r.id);
    return { key, tally, people: rows, recordIds };
  });
  return { weeks, people: people.filter((p) => p.weeks.length > 0), total };
}

/** Last day a missed week can still be made up (the Sunday it falls out of the limit). */
export function makeupDeadline(weekKey: string, makeupWeeks: number): Date {
  return addDays(parseDay(weekKey), 7 * (makeupWeeks + 1) - 1);
}

// Views for the charts -------------------------------------------------------------------------------------------

export type Week = Compliance["weeks"][number];
const finished = (c: Compliance, today: Date) => c.weeks.filter((w) => w.key < isoDay(mondayOf(today)));

/** Finished weeks, oldest first, with their compliance and on-time rates (null when no one was expected). */
export function trend(c: Compliance, today: Date = new Date()) {
  return finished(c, today).reverse().map((w) => ({ key: w.key, score: score(w.tally), onTime: onTimeRate(w.tally), tally: w.tally }));
}

/** Score of the last `n` finished weeks against the `n` before them. Null when there aren't 2×n finished weeks. */
export function periodChange(c: Compliance, n: number, today: Date = new Date()) {
  const f = finished(c, today); // newest first
  if (f.length < 2 * n) return null;
  const sum = (ws: Week[]) => ws.reduce((t, w) => { (Object.keys(t) as (keyof Tally)[]).forEach((k) => (t[k] += w.tally[k])); return t; }, zero());
  const now = score(sum(f.slice(0, n)));
  const before = score(sum(f.slice(n, 2 * n)));
  return now === null || before === null ? null : { now, before, points: Math.round(now * 100) - Math.round(before * 100) };
}

/** Team × week tallies (team as of today; null = no team). Weeks newest first, as in `c.weeks`. */
export function teamGrid(c: Compliance) {
  const teamOf = new Map(c.people.map((p) => [p.person.id, p.person.teamId]));
  const teams = [...new Set(c.people.map((p) => p.person.teamId))];
  return teams.map((teamId) => ({
    teamId,
    weeks: c.weeks.map((w) => {
      const t = zero();
      for (const p of w.people) if (teamOf.get(p.personId) === teamId) { t.expected++; t[p.state]++; }
      return { key: w.key, tally: t };
    }),
  }));
}

/** Everyone who still owes a week, soonest deadline first. */
export function needsMakeup(c: Compliance, makeupWeeks: number, today: Date = new Date()) {
  const day = 86_400_000;
  return c.weeks
    .flatMap((w) => w.people.filter((p) => p.state === "open"))
    .map((p) => {
      const deadline = makeupDeadline(p.week, makeupWeeks);
      return { ...p, deadline, daysLeft: Math.max(0, Math.ceil((addDays(deadline, 1).getTime() - today.getTime()) / day)) }; // through the deadline day
    })
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
}

/** Why weeks were made up (the reason's quick pick), and how late on average, in days after the week ended. */
export function makeupSummary(c: Compliance, reasons: readonly string[]) {
  const made = c.weeks.flatMap((w) => w.people.filter((p) => p.state === "made_up"));
  const counts = new Map<string, number>();
  for (const p of made) {
    const pick = reasons.find((r) => p.reason === r || p.reason?.startsWith(`${r}: `)) ?? "Other";
    counts.set(pick, (counts.get(pick) ?? 0) + 1);
  }
  const late = made.filter((p) => p.signedOn).map((p) => (new Date(p.signedOn!).getTime() - addDays(parseDay(p.week), 7).getTime()) / 86_400_000);
  return {
    total: made.length,
    reasons: [...counts.entries()].map(([reason, n]) => ({ reason, n })).sort((a, b) => b.n - a.n),
    avgDaysLate: late.length ? Math.max(0, Math.round(late.reduce((a, b) => a + b, 0) / late.length)) : null,
  };
}
