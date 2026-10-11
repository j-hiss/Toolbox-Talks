// Which reminders the phone should have scheduled right now. Pure: the app reschedules from this every time it
// opens, so reminders always match the latest plan and records. Delivery is src/lib/reminders.ts.
import { addDays, mondayOf } from "./weeks";
import { dueState, type TrackedCheck } from "./inspections";

/** Every id planReminders can use, so turning reminders off or rescheduling clears all of them. */
export const REMINDER_IDS = [101, 102, 103, 104] as const;

export type Reminder = { id: number; at: Date; title: string; body: string };

export type ReminderInput = {
  today: Date;
  thisWeekTitle: string | null;
  nextWeekTitle: string | null;
  crewName: string | null;       // the crew this phone usually gives talks to
  crewDone: boolean;             // that crew has had this week's talk
  expiringSoon: number;          // makeups that run out within 7 days
  /** The current talk period (every 2 or 4 weeks); null or absent = weekly. */
  period?: { start: Date; weeks: number } | null;
  /** The company's scheduled checklists and when each was last done (trackedChecks in src/core/inspections.ts). */
  inspections?: TrackedCheck[];
};

const at = (d: Date, h: number, m = 0) => { const x = new Date(d); x.setHours(h, m, 0, 0); return x; };

export function planReminders(i: ReminderInput): Reminder[] {
  const out: Reminder[] = [];
  // Weekly: the period is this week. Every 2 or 4 weeks: the reminders follow the talk period instead.
  const start = i.period ? mondayOf(i.period.start) : mondayOf(i.today);
  const weeks = i.period?.weeks ?? 1;
  const title = weeks > 1 ? "New toolbox talk" : "This week's toolbox talk";
  // Monday 6:30 AM when a talk period starts: its talk (the current one if it's still before 6:30 that Monday).
  const thisMon = at(start, 6, 30);
  if (i.today < thisMon && i.thisWeekTitle) out.push({ id: 101, at: thisMon, title, body: i.thisWeekTitle });
  else if (i.nextWeekTitle) out.push({ id: 101, at: at(addDays(start, 7 * weeks), 6, 30), title, body: i.nextWeekTitle });
  // Thursday noon of the period's last week: nudge if this phone's crew hasn't had it yet.
  const thu = at(addDays(start, 7 * (weeks - 1) + 3), 12);
  if (!i.crewDone && i.thisWeekTitle && i.today < thu) {
    out.push({ id: 102, at: thu, title: "Toolbox talk not done yet", body: `${i.crewName ?? "Your team"} still needs ${weeks > 1 ? "this period's" : "this week's"} talk: ${i.thisWeekTitle}` });
  }
  // Next morning 7 AM: makeups about to run out.
  if (i.expiringSoon > 0) {
    out.push({ id: 103, at: at(addDays(i.today, 1), 7), title: "Makeups running out", body: `${i.expiringSoon} missed ${i.expiringSoon === 1 ? "talk runs" : "talks run"} out within a week. Give the makeup from Home.` });
  }
  // 6:45 AM, today if it's still early, else tomorrow: the checks due by then (daily ones done today come due again).
  if (i.inspections?.length) {
    const early = at(i.today, 6, 45);
    const when = i.today < early ? early : at(addDays(i.today, 1), 6, 45);
    const due = i.inspections.filter((c) => dueState(c.when, c.last, when).due).map((c) => c.title);
    if (due.length) {
      const names = due.length <= 2 ? due.join(" and ") : `${due.slice(0, 2).join(", ")} and ${due.length - 2} more`;
      out.push({ id: 104, at: when, title: due.length === 1 ? "Inspection due" : `${due.length} inspections due`, body: `${names}. Open Inspections to do ${due.length === 1 ? "it" : "them"}.` });
    }
  }
  return out.filter((r) => r.at > i.today);
}
