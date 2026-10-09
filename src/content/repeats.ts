// What a rule asks to be repeated on a fixed schedule, for talks that touch it. Content, versioned like talks: a
// change in wording or a rule change means a new version. Shown on the Read screen and in Admin → Plan → Repeat
// talks. The app never says a talk satisfies these; most are formal training, tests or inspections a talk can't
// replace. Every line below was checked against the rule text (research, 2026-10-08).
export const REPEAT_NOTES_VERSION = 1;

export type RepeatNote = {
  /** What the rule asks, with how often, in plain words. */
  rule: string;
  cite: string;
  /** "supports": the talk can help cover it. "not": the talk is a refresher, not the required item. */
  talk: "supports" | "not";
  /** Who it applies to, so nobody reads it as applying to everyone. */
  appliesIf: string;
  /** The agency, when it isn't OSHA. */
  agency?: "EPA";
};

export const REPEAT_NOTES: Record<string, RepeatNote> = {
  fork: {
    rule: "Each forklift operator's performance is evaluated at least every 3 years, and refresher training is required after an accident or near-miss, unsafe operation, a failed evaluation, or a different type of truck.",
    cite: "29 CFR 1910.178(l)(4)", talk: "not", appliesIf: "Applies to each powered industrial truck operator.",
  },
  respirators: {
    rule: "Respirator users are retrained every year and fit tested at least every year for each tight-fitting facepiece they use.",
    cite: "29 CFR 1910.134(k)(5), (f)(2)", talk: "not", appliesIf: "Applies where respirators are required.",
  },
  hearing: {
    rule: "Hearing conservation training is repeated every year for each employee in the program.",
    cite: "29 CFR 1910.95(k)(2)", talk: "not", appliesIf: "Applies at or above an 85 dBA 8-hour average.",
  },
  "hearing-con": {
    rule: "Hearing conservation training is repeated every year for each employee in the program.",
    cite: "29 CFR 1910.95(k)(2)", talk: "not", appliesIf: "Applies at or above an 85 dBA 8-hour average.",
  },
  extinguishers: {
    rule: "Where extinguishers are provided for employees to use, employees get education on their general principles when hired and at least every year.",
    cite: "29 CFR 1910.157(g)(1)-(2)", talk: "supports", appliesIf: "Applies where extinguishers are provided for employee use.",
  },
  "first-aid-blood": {
    rule: "Bloodborne pathogens training is given at least every year to employees with occupational exposure.",
    cite: "29 CFR 1910.1030(g)(2)(ii)(B)", talk: "not", appliesIf: "Applies to employees with occupational exposure to blood.",
  },
  sharps: {
    rule: "Bloodborne pathogens training is given at least every year to employees with occupational exposure.",
    cite: "29 CFR 1910.1030(g)(2)(ii)(B)", talk: "not", appliesIf: "Applies to employees with occupational exposure to blood.",
  },
  asbestos: {
    rule: "Asbestos training is repeated at least every year for covered employees.",
    cite: "29 CFR 1910.1001(j)(7)(ii); 1926.1101(k)(9)(ii)", talk: "not", appliesIf: "Applies above the exposure limit, or for construction asbestos work.",
  },
  lead: {
    rule: "Lead training is repeated at least every year for covered employees.",
    cite: "29 CFR 1910.1025(l)(1)(iv); 1926.62(l)(1)(iv)", talk: "not", appliesIf: "Applies at or above the action level.",
  },
  "confined-space": {
    rule: "Designated rescue team members practice a permit-space rescue at least once every 12 months.",
    cite: "29 CFR 1910.146(k)(2)(iv)", talk: "not", appliesIf: "Applies to in-house permit-space rescue teams.",
  },
  loto: {
    rule: "Each energy-control procedure gets a periodic inspection at least every year, by an authorized employee other than the ones using it.",
    cite: "29 CFR 1910.147(c)(6)", talk: "not", appliesIf: "Applies to each lockout/tagout procedure.",
  },
  pesticides: {
    rule: "Agricultural workers and pesticide handlers must have had pesticide safety training within the last 12 months.",
    cite: "40 CFR 170.401(a); 170.501(a)", talk: "not", appliesIf: "Applies under EPA's Worker Protection Standard.", agency: "EPA",
  },
};

/** The line read on the Read screen. Never says the talk satisfies the rule. */
export function repeatNoteText(n: RepeatNote): string {
  const by = n.agency ? `${n.agency} rule` : "OSHA rule";
  return `${n.appliesIf} ${n.rule} (${by}: ${n.cite}) ${n.talk === "supports" ? "This talk can help cover it." : "This talk is a refresher, not that training, test or inspection."}`;
}
