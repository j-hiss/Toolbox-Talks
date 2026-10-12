// Your own trainings (migration 0053): certifications that aren't OSHA's, made by a company, an outside trainer or a
// training company. Pure module. A training's code ("c_" + letters/numbers) is used as the card type, so job-title
// needs, expiry tracking, classes, approvals, certificates and check codes work the same as for the built-in types.
// Every card made with one carries the training's name at that moment (the database stamps it).

export type CourseOwnerKind = "company" | "me" | "org";

export type TrainingCourse = {
  code: string;
  owner_company: string | null;
  owner_user: string | null;
  owner_org: string | null;
  name: string;
  description: string;
  /** How long a card lasts, in months, when the training sets one. A suggestion for the expiry, never a rule. */
  renew_months: number | null;
  retired: boolean;
};

export type CourseDraft = { name: string; description: string; renewMonths: number | null };

export const COURSE_NAME_MAX = 100;
export const COURSE_DESCRIPTION_MAX = 1000;
export const COURSE_RENEW_MAX = 120;

export const isCourseCode = (id: string) => /^c_[a-z0-9]{8,20}$/.test(id);

/** What's wrong with a training before it's saved, or null. Same limits as the database. */
export function courseProblem(d: CourseDraft): string | null {
  const name = d.name.trim();
  if (!name) return "Name the training.";
  if (name.length > COURSE_NAME_MAX) return `Keep the name to ${COURSE_NAME_MAX} characters.`;
  if (d.description.length > COURSE_DESCRIPTION_MAX) return `Keep the description to ${COURSE_DESCRIPTION_MAX} characters.`;
  if (d.renewMonths != null && (!Number.isInteger(d.renewMonths) || d.renewMonths < 1 || d.renewMonths > COURSE_RENEW_MAX)) return `Renewal is 1 to ${COURSE_RENEW_MAX} months, or leave it blank for no expiry.`;
  return null;
}

/** "Every 2 years", "Every 18 months", or "No expiry". */
export function renewText(months: number | null): string {
  if (!months) return "No expiry";
  if (months % 12 === 0) return months === 12 ? "Every year" : `Every ${months / 12} years`;
  return months === 1 ? "Every month" : `Every ${months} months`;
}

/** The suggested expiry: the issue date plus this many months (the last day of a shorter month when it overflows). */
export function expiryAfter(issuedOn: string, months: number): string {
  const [y, m, d] = issuedOn.split("-").map(Number);
  const total = y * 12 + (m - 1) + months;
  const ty = Math.floor(total / 12), tm = total % 12;
  const last = new Date(Date.UTC(ty, tm + 1, 0)).getUTCDate();
  return `${ty}-${String(tm + 1).padStart(2, "0")}-${String(Math.min(d, last)).padStart(2, "0")}`;
}

/** Who made a training: a company, a trainer on their own, or a training company. */
export function courseOwnerKind(c: Pick<TrainingCourse, "owner_company" | "owner_user" | "owner_org">): CourseOwnerKind {
  return c.owner_company ? "company" : c.owner_user ? "me" : "org";
}

/** The trainings to offer in a picker: not retired, by name. */
export const activeCourses = <C extends Pick<TrainingCourse, "retired" | "name">>(courses: C[]): C[] =>
  courses.filter((c) => !c.retired).sort((a, b) => a.name.localeCompare(b.name));

/** The trainings you own as a trainer: made by you, or by an organization you're in (never a company's). */
export const myOwnCourses = (courses: TrainingCourse[], myId: string, myOrgIds: string[]) =>
  courses.filter((c) => !c.owner_company && (c.owner_user === myId || (!!c.owner_org && myOrgIds.includes(c.owner_org))));
