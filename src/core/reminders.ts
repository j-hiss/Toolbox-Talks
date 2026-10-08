// Which reminders the phone should have scheduled right now. Pure: the app reschedules from this every time it
// opens, so reminders always match the latest plan and records. Delivery is src/lib/reminders.ts.
import { addDays, mondayOf } from "./weeks";

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
    out.push({ id: 102, at: thu, title: "Toolbox talk not done yet", body: `${i.crewName ?? "Your crew"} still needs ${weeks > 1 ? "this period's" : "this week's"} talk: ${i.thisWeekTitle}` });
  }
  // Next morning 7 AM: makeups about to run out.
  if (i.expiringSoon > 0) {
    out.push({ id: 103, at: at(addDays(i.today, 1), 7), title: "Makeups running out", body: `${i.expiringSoon} missed ${i.expiringSoon === 1 ? "talk runs" : "talks run"} out within a week. Give the makeup from Home.` });
  }
  return out.filter((r) => r.at > i.today);
}
