// The trainer's own tools (migrations 0050-0052): their plan and earned free months, classes with sign-ins, the
// certificates they issued, and finding companies that are looking for a trainer. Pure module.
import { stateForZip } from "./climate";

export type PartnerKind = "trainer" | "insurance";
export type PartnerAccount = { user_id: string; kind: PartnerKind; plan: "trial" | "paid" | "comp"; trial_ends: string; free_until: string | null };
export type PartnerCredit = { id: string; kind: PartnerKind; company_id: string; months: number; granted_at: string };

export type TrainingClass = {
  id: string; company_id: string; trainer_id: string; cert_type: string; custom_name: string; held_on: string; place: string;
  expires_on: string | null; note: string; created_at: string; closed_at: string | null;
  people: ClassPerson[];
};
export type ClassPerson = { person_id: string; signed_at: string | null; result: "passed" | "not_passed" | null; submission_id: string | null };
export type NewClass = { companyId: string; certType: string; customName: string; heldOn: string; place: string; expiresOn: string | null; note: string; people: string[] };

export type Certificate = {
  submission_id: string; company_id: string; company_name: string; trainer_name: string; person_name: string; cert_type: string; custom_name: string;
  issued_on: string | null; expires_on: string | null; approved_at: string; verify_code: string; withdrawn: boolean;
};
export type VerifiedCertificate = { company: string; trainer: string; cert_type: string; custom_name: string; issued_on: string | null; expires_on: string | null; approved_at: string; withdrawn: boolean };

export type LookingCompany = { company_id: string; name: string; industry: string; zip: string; size: string; trainings: string[]; note: string; listed_since: string; requested: boolean };
export type ConnectRequest = { id: string; company_id: string; name: string; email: string; message: string; requested_at: string; answered_at: string | null; accepted: boolean | null };
export type TrainerListing = { looking: boolean; trainings: string[]; note: string };

const today = (d: Date) => d.toISOString().slice(0, 10);

/** Whether the paid extras are on (same rule as private.partner_active): paid, comp, trial, or free months left. */
export function partnerActive(a: PartnerAccount | null, now: Date = new Date()): boolean {
  if (!a) return false;
  const t = today(now);
  return a.plan === "paid" || a.plan === "comp" || a.trial_ends >= t || (!!a.free_until && a.free_until >= t);
}

/** One line on where the account stands. */
export function partnerPlanLine(a: PartnerAccount | null, now: Date = new Date()): string {
  if (!a) return "Not started";
  const t = today(now);
  const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (a.plan === "comp") return "Complimentary";
  if (a.plan === "paid") return a.free_until && a.free_until >= t ? `Paid · free months through ${fmt(a.free_until)}` : "Paid";
  if (a.free_until && a.free_until >= t && a.free_until > a.trial_ends) return `Free through ${fmt(a.free_until)} (months you earned)`;
  if (a.trial_ends >= t) return `Free trial through ${fmt(a.trial_ends)}`;
  return "Trial ended";
}

/** Who still needs a result, and whether the class can close (everyone has a result; every pass has signed). */
export function classProblem(c: Pick<TrainingClass, "people">): string | null {
  if (c.people.some((p) => !p.result)) return "Mark everyone passed or not passed first.";
  if (c.people.some((p) => p.result === "passed" && !p.signed_at)) return "Someone marked passed hasn't signed in. Have them sign, or mark them not passed.";
  return null;
}

export function newClassProblem(n: NewClass, today: string): string | null {
  if (!n.companyId) return "Pick the client.";
  if (!n.certType) return "Pick the training.";
  if (n.certType === "custom" && !n.customName.trim()) return "Name the training.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(n.heldOn)) return "Pick the class date.";
  if (n.heldOn > today) return "The class date can't be in the future.";
  if (n.expiresOn && n.expiresOn < n.heldOn) return "The card can't expire before the class.";
  if (!n.people.length) return "Pick at least one person.";
  if (n.people.length > 100) return "A class can have up to 100 people.";
  return null;
}

/** Certificates grouped for the summary: this year's count and clients. */
export function certificateTotals(certs: Certificate[], now: Date = new Date()) {
  const year = String(now.getFullYear());
  const thisYear = certs.filter((c) => c.approved_at.startsWith(year) && !c.withdrawn);
  return { thisYear: thisYear.length, clients: new Set(thisYear.map((c) => c.company_id)).size, all: certs.filter((c) => !c.withdrawn).length };
}

/** Whether a certificate is current today (not withdrawn, not past its expiry). */
export function certificateCurrent(c: Pick<Certificate, "expires_on" | "withdrawn">, now: Date = new Date()): boolean {
  return !c.withdrawn && (!c.expires_on || c.expires_on >= today(now));
}

/** Filter the companies looking for a trainer by state and training. */
export function filterLooking(rows: LookingCompany[], state: string, training: string): LookingCompany[] {
  return rows.filter((r) => (!state || stateForZip(r.zip) === state) && (!training || r.trainings.includes(training)));
}

export const lookingState = (r: Pick<LookingCompany, "zip">) => stateForZip(r.zip) ?? "";
