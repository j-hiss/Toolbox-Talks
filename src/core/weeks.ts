// The week convention: weeks start Monday and are keyed by that Monday's local date (YYYY-MM-DD).
// Origin: prototype/index.html mondayOf, isoDay, weekLabel. Do not invent a second convention.

export function mondayOf(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

export function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Parse YYYY-MM-DD as a local date (not UTC midnight). */
export function parseDay(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Whole weeks between two Mondays, safe across daylight-saving changes. */
export function weeksBetween(fromMonday: Date, toMonday: Date): number {
  return Math.floor(Math.round((toMonday.getTime() - fromMonday.getTime()) / 86_400_000) / 7);
}

/** "Oct 5 – Oct 9": Monday through Friday of the week. */
export function weekLabel(monday: Date, locale?: string): string {
  const f = (d: Date) => d.toLocaleDateString(locale, { month: "short", day: "numeric" });
  return `${f(monday)} – ${f(addDays(monday, 4))}`;
}

/** "Oct 5 – Oct 30": Monday of the first week through Friday of the last (a one-week period is weekLabel). */
export function periodLabel(monday: Date, weeks: number, locale?: string): string {
  const f = (d: Date) => d.toLocaleDateString(locale, { month: "short", day: "numeric" });
  return `${f(monday)} – ${f(addDays(monday, 7 * (weeks - 1) + 4))}`;
}
