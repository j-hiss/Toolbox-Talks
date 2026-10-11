// "My record": one person's own safety-talk record, built with the same rules as company reports (buildCompliance,
// needsMakeup, talkStreak in ./compliance), so a person's weeks match their row in Reports over the same periods
// (My record covers all history since the program started; Reports shows the range picked). Pure module.
//
// Each person sees only their own record. There is no leaderboard and no ranking against coworkers on purpose: a
// signature should mean someone heard the talk, not that they were chasing a score. Admins already see everyone in
// Reports. Honest numbers: weeks still open or missed are shown, never hidden.
import { buildCompliance, needsMakeup, onTimeRate, score, talkStreak, type ReportPerson, type ReportRecord, type Tally } from "./compliance";

export type MyRecord = {
  tally: Tally;
  /** Share of finished weeks closed (on time or made up), and on time only. Null before any week has finished. */
  closedRate: number | null;
  onTimeRate: number | null;
  streak: number;
  /** Weeks still open to make up, soonest deadline first. */
  owed: { week: string; deadline: Date; daysLeft: number }[];
  /** Weeks gone past the makeup limit. */
  missed: string[];
};

export function myRecord(input: {
  person: ReportPerson;
  records: ReportRecord[];
  periods: { key: string; weeks: number }[]; // newest first, the company's talk periods (periodKeys)
  makeupWeeks: number;
  today?: Date;
}): MyRecord {
  const today = input.today ?? new Date();
  const c = buildCompliance({ people: [input.person], records: input.records, weeks: input.periods, makeupWeeks: input.makeupWeeks, today });
  const mine = c.people[0];
  const tally = mine?.tally ?? { expected: 0, on_time: 0, made_up: 0, open: 0, missed: 0, due: 0 };
  const weeks = mine?.weeks ?? [];
  // A streak counts periods held on time; a makeup given later closes the week but doesn't keep a streak (talkStreak).
  const onTime = weeks.filter((w) => w.state === "on_time").map((w) => w.week);
  const onStaffPeriods = input.periods.filter((p) => weeks.some((w) => w.week === p.key));
  return {
    tally,
    closedRate: score(tally),
    onTimeRate: onTimeRate(tally),
    streak: talkStreak(onStaffPeriods, onTime).count,
    owed: needsMakeup(c, input.makeupWeeks, today).map(({ week, deadline, daysLeft }) => ({ week, deadline, daysLeft })),
    missed: weeks.filter((w) => w.state === "missed").map((w) => w.week),
  };
}

/** What a presenter, admin or office account did themselves, counted from rows they created. */
export type MyActivity = { talksGiven: number; talksGivenRecent: number; inspections: number; inspectionsRecent: number; issuesFixed: number; issuesRaised: number };
