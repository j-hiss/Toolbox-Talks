// Training cards and certifications a company can track per person (Admin → Training). Content, versioned like talks.
// The app never computes when a card expires from a rule: the admin types the expiry printed on the card (or none).
// A rule note appears only where the rule text was checked: the REPEAT_NOTES lines (research 2026-10-08) and the
// crane and scaffold lines below (29 CFR 1926.1427 and 1926.454, checked on the Cornell LII copy 2026-10-09), and the
// hazmat, lead-safe worker and DOT supervisor lines (49 CFR 172.704, 40 CFR 745.90 and 745.86, 49 CFR 382.603, read
// 2026-10-11 on eCFR or the Cornell LII copy; see docs/claims-and-evidence.md).
// Other types carry no rule note until their rule is checked; safety wording is not guessed.
import { REPEAT_NOTES, type RepeatNote } from "./repeats";

export const CERT_TYPES_VERSION = 1;

export type CertType = {
  id: string;
  name: string;
  /** What the rule says about renewing, when it was checked. Shown as information, never as "you comply". */
  note?: RepeatNote;
  /** Suggested length when the card has no printed expiry and the rule sets one (crane only). */
  suggestMonths?: number;
};

const CRANE: RepeatNote = {
  rule: "A crane operator's certification is valid for 5 years at most, and re-certification is by testing. The employer also retrains and re-evaluates an operator when an evaluation shows it's needed.",
  cite: "29 CFR 1926.1427(d)(4), (b)(5), (f)(7)", talk: "not", appliesIf: "Applies to operators of cranes covered by construction Subpart CC.",
};
const SCAFFOLD: RepeatNote = {
  rule: "No fixed renewal. The employer retrains a scaffold worker it has reason to believe lacks the skill or understanding to work safely, including after new hazards, new types of scaffold, or poor work.",
  cite: "29 CFR 1926.454(c)", talk: "not", appliesIf: "Applies to people who erect, take down, move, use, repair, maintain or inspect scaffolds in construction.",
};

const HAZMAT: RepeatNote = {
  rule: "Hazmat employee training is repeated at least once every 3 years. A new hazmat employee, or one who changes jobs, can do the work under direct supervision of a trained employee only until training is done, within 90 days. The record covers the last 3 years and is kept while they do hazmat work and 90 days after.",
  cite: "49 CFR 172.704(c)(1)-(2), (d)", talk: "not", agency: "DOT",
  appliesIf: "Applies to hazmat employees: people whose work directly affects the safety of shipping or transporting hazardous materials.",
};
const LEAD_WORKER: RepeatNote = {
  rule: "No renewal. On each renovation, the certified renovator trains the workers on the lead-safe work practices they will use, and the job record shows the topics for each worker. The firm keeps the job's records 3 years.",
  cite: "40 CFR 745.90(b)(2); 745.86(a), (b)(6)(i)", talk: "supports", agency: "EPA",
  appliesIf: "Applies to workers who aren't certified renovators, on renovation, repair or painting work covered by EPA's lead rule (homes and child-occupied buildings built before 1978).",
};
const DOT_SUPERVISOR: RepeatNote = {
  rule: "One time, no repeat: at least 60 minutes on alcohol misuse and 60 more on controlled substances, covering the signs a supervisor uses to decide whether to send a driver for a reasonable-suspicion test.",
  cite: "49 CFR 382.603", talk: "not", agency: "DOT",
  appliesIf: "Applies to anyone who supervises drivers who need a CDL.",
};

export const CERT_TYPES: CertType[] = [
  { id: "osha10", name: "OSHA 10-hour card" },
  { id: "osha30", name: "OSHA 30-hour card" },
  { id: "fall", name: "Fall protection training" },
  { id: "scaffold", name: "Scaffold training", note: SCAFFOLD },
  { id: "aerial", name: "Aerial lift operator" },
  { id: "forklift", name: "Forklift operator evaluation", note: REPEAT_NOTES.fork },
  { id: "crane", name: "Crane operator certification", note: CRANE, suggestMonths: 60 },
  { id: "respirator", name: "Respirator fit test and training", note: REPEAT_NOTES.respirators },
  { id: "hearing", name: "Hearing conservation training", note: REPEAT_NOTES.hearing },
  { id: "first_aid", name: "First aid / CPR" },
  { id: "bbp", name: "Bloodborne pathogens training", note: REPEAT_NOTES["first-aid-blood"] },
  { id: "confined", name: "Confined space training" },
  { id: "hazwoper", name: "HAZWOPER" },
  { id: "asbestos", name: "Asbestos training", note: REPEAT_NOTES.asbestos },
  { id: "lead", name: "Lead training", note: REPEAT_NOTES.lead },
  { id: "lead_rrp", name: "EPA lead-safe renovator (RRP)" },
  { id: "lead_rrp_worker", name: "Lead-safe work practices (trained by a certified renovator)", note: LEAD_WORKER },
  { id: "hazmat", name: "DOT hazmat employee training", note: HAZMAT },
  { id: "pesticide", name: "Pesticide safety training (EPA WPS)", note: REPEAT_NOTES.pesticides },
  { id: "cdl_medical", name: "CDL medical card" },
  { id: "dot_supervisor", name: "DOT reasonable-suspicion supervisor training", note: DOT_SUPERVISOR },
  { id: "flagger", name: "Flagger" },
];

/**
 * A card type's name. A company's or trainer's own training (code "c_...", migration 0053) uses the name stamped on
 * the card, or, for a job-title need with no card yet, the name from `courses`.
 */
export const certTypeName = (id: string, custom = "", courses: { code: string; name: string }[] = []) =>
  id === "custom" ? custom || "Other"
  : id.startsWith("c_") ? custom || courses.find((c) => c.code === id)?.name || "Own training"
  : CERT_TYPES.find((c) => c.id === id)?.name ?? id;
