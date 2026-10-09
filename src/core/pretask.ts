// Daily pre-task plan (PTP): a short plan the crew makes together before work, separate from the weekly talk.
// Pure module. Research and rules behind it: the "Daily tailgate talks" research (OSHA 3886 recommends daily
// planning meetings; GCs commonly require a daily PTP alongside a weekly toolbox talk; CPWR pre-task planning).
//
// Rules this module keeps:
// * A daily plan is its own record kind. It never counts toward the weekly talk or the sign-in rate, and a weekly
//   talk is never replaced by it (src/core/compliance.ts never sees daily records).
// * Equipment items are reminders of what a rule asks someone to check, with the cite. The app records what the
//   foreman answered ("done by ___" or "not today"); it never says an inspection happened or that anyone complies.
// * Suggested hazards and controls are starting points the foreman edits; they aren't rules.

export const PRETASK_TALK_ID = "pretask";

export type HazardControl = { hazard: string; control: string };

export type EquipmentAnswer = { id: string; answer: "done" | "na"; by: string };

export type PretaskPlan = {
  /** What the crew is doing today, one task per line. */
  tasks: string[];
  hazards: HazardControl[];
  ppe: string[];
  permits: string[];
  /** Where everyone meets in an emergency, and the plan (nearest hospital, who calls). Remembered per jobsite. */
  muster: string;
  emergency: string;
  /** Equipment reminders the foreman ticked, with the answer given. */
  equipment: EquipmentAnswer[];
  /** Other trades or work nearby that could affect the crew (CPWR: plan around clashes). */
  nearby: string;
};

export const emptyPlan = (): PretaskPlan => ({ tasks: [], hazards: [], ppe: [], permits: [], muster: "", emergency: "", equipment: [], nearby: "" });

/** Suggested hazards with a starting control. The foreman picks, edits or writes their own. */
export const HAZARD_SUGGESTIONS: HazardControl[] = [
  { hazard: "Falls from an edge, roof or opening", control: "Guardrail, cover or tie off before going near the edge" },
  { hazard: "Ladder use", control: "Inspect the ladder; set it on firm, level ground; keep three points of contact" },
  { hazard: "Heat", control: "Water, rest and shade; watch each other for signs of heat illness" },
  { hazard: "Overhead power lines", control: "Know where the lines are and keep tools, ladders and equipment clear" },
  { hazard: "Struck by vehicles or equipment", control: "High-visibility vest; stay out of the swing and backing area; use a spotter" },
  { hazard: "Falling objects", control: "Hard hats; keep the area below clear and secure tools and materials" },
  { hazard: "Power tools and cords", control: "Check guards and cords; plug into GFCI protection" },
  { hazard: "Lifting heavy material", control: "Get help or use equipment for heavy or awkward loads" },
  { hazard: "Hot work (welding, cutting, torches)", control: "Clear flammables, keep an extinguisher close, follow the hot work permit" },
  { hazard: "Trench or excavation", control: "Stay out until the competent person says it's safe; protective system in place" },
  { hazard: "Chemicals or dust", control: "Read the label and SDS; use the PPE it calls for; ventilate" },
  { hazard: "Weather (storms, wind, lightning)", control: "Watch the forecast; stop outside work when thunder roars" },
];

export const PPE_CHOICES = ["Hard hat", "Safety glasses", "High-visibility vest", "Gloves", "Safety boots", "Hearing protection", "Harness and lanyard", "Respirator", "Face shield"];

export const PERMIT_CHOICES = ["Hot work", "Confined space", "Excavation or dig ticket", "Lockout", "Crane lift plan", "Roof access"];

/**
 * Equipment the crew may use today, with what the rule asks and its cite. Shown as reminders when ticked.
 * Cites checked against eCFR text (research, 2026-10-08).
 */
export const EQUIPMENT_PROMPTS = [
  { id: "scaffold", name: "Scaffold", reminder: "A competent person inspects the scaffold before each work shift.", cite: "29 CFR 1926.451(f)(3)" },
  { id: "trench", name: "Trench or excavation", reminder: "A competent person inspects it daily before work starts and as needed during the shift.", cite: "29 CFR 1926.651(k)(1)" },
  { id: "crane", name: "Crane", reminder: "A competent person does a visual inspection before each shift.", cite: "29 CFR 1926.1412(d)(1)" },
  { id: "aerial", name: "Aerial lift", reminder: "Test the lift controls each day before use.", cite: "29 CFR 1926.453(b)(2)(i)" },
  { id: "forklift", name: "Forklift", reminder: "Examine it before use, at least daily.", cite: "29 CFR 1910.178(q)(7)" },
  { id: "harness", name: "Harness and lanyard", reminder: "Inspect personal fall arrest gear before each use.", cite: "29 CFR 1926.502(d)(21)" },
] as const;

export type EquipmentId = (typeof EQUIPMENT_PROMPTS)[number]["id"];

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

/** Why a plan can't go to signatures yet. Empty = ready. */
export function pretaskProblems(p: PretaskPlan): string[] {
  const out: string[] = [];
  if (!p.tasks.some((t) => clean(t))) out.push("Add at least one task the crew is doing today.");
  if (!p.hazards.some((h) => clean(h.hazard))) out.push("Add at least one hazard and how you'll control it.");
  const noControl = p.hazards.filter((h) => clean(h.hazard) && !clean(h.control)).map((h) => clean(h.hazard));
  if (noControl.length) out.push(`Say how you'll control: ${noControl.join(", ")}.`);
  const noBy = p.equipment.filter((e) => e.answer === "done" && !clean(e.by)).map((e) => EQUIPMENT_PROMPTS.find((x) => x.id === e.id)?.name ?? e.id);
  if (noBy.length) out.push(`Say who checked: ${noBy.join(", ")}.`);
  return out;
}

/** The plan, tidied for saving: blank lines dropped, text trimmed. */
export function tidyPlan(p: PretaskPlan): PretaskPlan {
  return {
    tasks: p.tasks.map(clean).filter(Boolean),
    hazards: p.hazards.map((h) => ({ hazard: clean(h.hazard), control: clean(h.control) })).filter((h) => h.hazard),
    ppe: [...new Set(p.ppe.map(clean).filter(Boolean))],
    permits: [...new Set(p.permits.map(clean).filter(Boolean))],
    muster: clean(p.muster),
    emergency: clean(p.emergency),
    equipment: p.equipment.map((e) => ({ ...e, by: e.answer === "done" ? clean(e.by) : "" })),
    nearby: clean(p.nearby),
  };
}

/**
 * The plan as the record's "what was read" content, so the record page and the PDF show it with the same sections
 * they use for a talk. The structured plan is saved next to it.
 */
export function pretaskContent(raw: PretaskPlan) {
  const p = tidyPlan(raw);
  const sections: { heading: string; items: string[] }[] = [];
  sections.push({ heading: "Today's tasks", items: p.tasks });
  sections.push({ heading: "Hazards and controls", items: p.hazards.map((h) => `${h.hazard}: ${h.control}`) });
  if (p.ppe.length) sections.push({ heading: "PPE", items: p.ppe });
  if (p.permits.length) sections.push({ heading: "Permits", items: p.permits });
  const eq = p.equipment.map((e) => {
    const x = EQUIPMENT_PROMPTS.find((q) => q.id === e.id);
    if (!x) return null;
    return e.answer === "done" ? `${x.name}: ${x.reminder} Foreman's answer: checked by ${e.by} (${x.cite})` : `${x.name}: not used today`;
  }).filter((s): s is string => !!s);
  if (eq.length) sections.push({ heading: "Equipment reminders", items: eq });
  const em = [p.muster && `Meet at: ${p.muster}`, p.emergency && `Emergency plan: ${p.emergency}`].filter((s): s is string => !!s);
  if (em.length) sections.push({ heading: "Emergency", items: em });
  if (p.nearby) sections.push({ heading: "Other work nearby", items: [p.nearby] });
  return {
    title: "Daily pre-task plan",
    hook: "Today's tasks, the hazards, how we control them, and what to do in an emergency.",
    sections,
    ask: "Anything else that could hurt someone today? Stop work and tell your lead if conditions change.",
  };
}

/** What each crew member taps before signing a daily plan. Versioned like the weekly statement. */
export const DAILY_STATEMENT_VERSION = 1;
export const DAILY_STATEMENT = {
  en: "By signing, I confirm I attended today's pre-task meeting, I know today's tasks, hazards and controls, and I will stop work and tell my lead if conditions change.",
  es: "Al firmar, confirmo que asistí a la reunión de planificación de hoy, conozco las tareas, los peligros y los controles de hoy, y pararé el trabajo y avisaré a mi líder si cambian las condiciones.",
} as const;

/** Days with a daily plan recorded, per crew name, in a set of records. Never a rate: the app doesn't know which days were worked. */
export function dailyTally(records: { held_at: string; team_name: string }[], toDay: (iso: string) => string): { crew: string; days: number }[] {
  const byCrew = new Map<string, Set<string>>();
  for (const r of records) {
    const crew = r.team_name || "No crew";
    if (!byCrew.has(crew)) byCrew.set(crew, new Set());
    byCrew.get(crew)!.add(toDay(r.held_at));
  }
  return [...byCrew].map(([crew, days]) => ({ crew, days: days.size })).sort((a, b) => a.crew.localeCompare(b.crew));
}
