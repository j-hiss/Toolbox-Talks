// Training cards and certifications a company can track per person (Admin → Training). Content, versioned like talks.
// The app never computes when a card expires from a rule: the admin types the expiry printed on the card (or none).
// A rule note appears only where the rule text was checked: the REPEAT_NOTES lines (research 2026-10-08) and the
// crane and scaffold lines below (29 CFR 1926.1427 and 1926.454, checked on the Cornell LII copy 2026-10-09).
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
  { id: "pesticide", name: "Pesticide safety training (EPA WPS)", note: REPEAT_NOTES.pesticides },
  { id: "cdl_medical", name: "CDL medical card" },
  { id: "flagger", name: "Flagger" },
];

export const certTypeName = (id: string, custom = "") => (id === "custom" ? custom || "Other" : CERT_TYPES.find((c) => c.id === id)?.name ?? id);
