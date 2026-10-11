// A company's account with the service: its plan, trial, pause and closing (migration 0042). Pure module.
//
// - Paused is read-only: everything stays viewable and downloadable (OSHA records must stay reachable), nothing new
//   saves. The app says so plainly instead of failing quietly.
// - Closing: an owner asks; the data stays for CLOSE_WAIT_DAYS so they can download it or change their mind; after
//   that the operator can remove it for good.
// - Plans are labels the operator sets (trial, pilot, paid, comp). Prices and payment live outside the app for now.

export type Plan = "trial" | "pilot" | "paid" | "comp";

export type CompanyAccount = {
  plan: Plan;
  /** Plan size (migration 0048): only a paid account is held to it. Older databases leave it out. */
  tier?: "crew" | "company" | "larger";
  trial_ends_at: string | null;      // YYYY-MM-DD, null = no end date
  paused_at: string | null;
  pause_reason: string;
  closure_requested_at: string | null;
};

export const PLAN_LABEL: Record<Plan, string> = { trial: "Trial", pilot: "Pilot", paid: "Paid", comp: "Complimentary" };

/** Days between the owner asking to close and the operator being able to remove the data (matches the database). */
export const CLOSE_WAIT_DAYS = 30;

/** Days before a trial ends when admins start seeing it. */
export const TRIAL_WARN_DAYS = 7;

const DAY = 86_400_000;
const startOf = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const dayOf = (iso: string) => { const [y, m, d] = iso.slice(0, 10).split("-").map(Number); return new Date(y, m - 1, d); };

/** The earliest day the operator can remove a closing company's data. */
export function removableFrom(closureRequestedAt: string): Date {
  return new Date(new Date(closureRequestedAt).getTime() + CLOSE_WAIT_DAYS * DAY);
}

export type AccountNotice =
  | { kind: "paused"; reason: string }
  | { kind: "closing"; removableFrom: Date; daysLeft: number }
  | { kind: "trial_over"; endedOn: Date }
  | { kind: "trial_ending"; endsOn: Date; daysLeft: number };

/**
 * What the company should be told about its account right now, most important first, or null when nothing. Paused
 * comes first because it changes what the app can do; a trial that has ended doesn't stop anything by itself (the
 * operator decides), it only says so.
 */
export function accountNotice(a: CompanyAccount | null, today: Date = new Date()): AccountNotice | null {
  if (!a) return null;
  if (a.paused_at) return { kind: "paused", reason: a.pause_reason };
  if (a.closure_requested_at) {
    const from = removableFrom(a.closure_requested_at);
    // Whole calendar days (rounded, so a daylight-saving change doesn't add a day).
    return { kind: "closing", removableFrom: from, daysLeft: Math.max(0, Math.round((startOf(from).getTime() - startOf(today).getTime()) / DAY)) };
  }
  if (a.plan === "trial" && a.trial_ends_at) {
    const end = dayOf(a.trial_ends_at);
    const daysLeft = Math.round((end.getTime() - startOf(today).getTime()) / DAY);
    if (daysLeft < 0) return { kind: "trial_over", endedOn: end };
    if (daysLeft <= TRIAL_WARN_DAYS) return { kind: "trial_ending", endsOn: end, daysLeft };
  }
  return null;
}

/** Plain words for a notice; `admin` gets what to do about it, everyone else what it means for them. */
export function noticeText(n: AccountNotice, admin: boolean): string {
  const day = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  switch (n.kind) {
    case "paused":
      return admin
        ? `This company's account is paused${n.reason ? ` (${n.reason})` : ""}. Everything can still be viewed and downloaded, but nothing new saves. Contact us to resume it.`
        : "This company's account is paused. You can still view records, but new talks can't be saved right now. Let your admin know.";
    case "closing":
      return admin
        ? `Closing was requested. The company's data can be removed for good from ${day(n.removableFrom)} (${n.daysLeft} day${n.daysLeft === 1 ? "" : "s"}). Download everything first; an owner can cancel until then.`
        : "This company's account is closing. Ask your admin if you need copies of your records.";
    case "trial_over":
      return admin ? `The trial ended on ${day(n.endedOn)}. Contact us to keep going.` : "";
    case "trial_ending":
      return admin ? `The trial ends ${n.daysLeft === 0 ? "today" : `in ${n.daysLeft} day${n.daysLeft === 1 ? "" : "s"}`} (${day(n.endsOn)}). Contact us to keep going.` : "";
  }
}

/** Rows of one exported table as CSV cells: every column seen across the rows, nested values as JSON. */
export function exportCsvRows(rows: Record<string, unknown>[]): unknown[][] {
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  return [cols, ...rows.map((r) => cols.map((c) => {
    const v = r[c];
    return v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : v;
  }))];
}
