// The company safety profile: one summary of the safety program built from the company's own records, for the
// renewal packet an agent or carrier reads and the monthly "the program stayed on" summary. Pure module.
//
// Rules this module keeps:
// * Honest status: missed talk periods are counted and shown, never hidden. A period with no talk at all is missed.
// * Only what the records show. Anything the company types in (EMR) is labelled self-reported, never ours.
// * No compliance claims: program elements say what records the app holds for each, never that a requirement is met.
// * Company first, worded for the company: it's the company's summary of its own effort, shared only when it chooses.
//   Wording credits what was done and states gaps plainly, without instructions or blame ("not part of the app").
// * Counts and rates only: no worker names, no signatures, no injury details (those stay in the records).
// Research behind it: the partner portal plan (Florida 440.1025 program elements; schedule rating; NCCI on mods).
import { onTimeRate, score, type Compliance, type Tally } from "./compliance";
import { addDays, isoDay, parseDay } from "./weeks";

export type ProfileRecord = { id: string; talk_id: string; language: string; held_at: string; makeup_for_week: string | null; kind?: "weekly" | "daily" };
export type ProfileEvent = { kind: "inspection" | "walkaround" | "citation" | "incident" | "near_miss"; occurred_on: string; status: "open" | "closed"; case_status: string | null; withdrawn_at: string | null };
export type ProfileIssue = { raised_at: string; status: "open" | "fixed"; fixed_at: string | null; due_date: string | null; event_id?: string | null };
export type EmrEntry = { rating_year: number; emr: number; note: string; entered_at: string };
export type CompanyDocument = { kind: DocumentKind; title: string; uploaded_at: string };
export type DocumentKind = "safety_program" | "emr_worksheet" | "osha_300a" | "other";

export const DOCUMENT_KINDS: { id: DocumentKind; name: string }[] = [
  { id: "safety_program", name: "Written safety program or rules" },
  { id: "emr_worksheet", name: "Experience rating (EMR) worksheet" },
  { id: "osha_300a", name: "OSHA 300A summary" },
  { id: "other", name: "Other" },
];

export type ProfileInput = {
  /** The weekly sign-ins over the talk periods in range (buildCompliance over periodKeys). */
  compliance: Compliance;
  /** Weekly talk records held in range (daily plans are passed separately). */
  records: ProfileRecord[];
  /** Days with a daily pre-task plan in range. */
  daily: { held_at: string }[];
  events: ProfileEvent[];
  issues: ProfileIssue[];
  emr: EmrEntry[];
  documents: CompanyDocument[];
  /** Training cards entered by the company (src/core/certs.ts trainingSummary), counted today. Optional. */
  training?: { current: number; expiring: number; expired: number; missing: number };
  /** Inclusive range, YYYY-MM-DD. */
  from: string;
  to: string;
  today?: Date;
};

export type MonthRow = { month: string; periods: number; missed: number; talks: number; tally: Tally; signIn: number | null; onTime: number | null };
export type ElementStatus = "records" | "some" | "outside";
export type ProgramElement = { id: string; name: string; status: ElementStatus; evidence: string };

export type SafetyProfile = {
  from: string; to: string;
  talks: number; makeups: number; topics: number;
  languages: { language: string; talks: number }[];
  periodsEnded: number; periodsWithTalk: number; periodsMissed: number;
  /** First Mondays of the talk periods with no talk at all, oldest first. */
  missedKeys: string[];
  total: Tally; signIn: number | null; onTime: number | null;
  months: MonthRow[];
  dailyDays: number;
  log: { inspections: number; walkarounds: number; incidents: number; nearMisses: number; citations: { status: string }[]; open: number };
  issues: { raised: number; fixed: number; open: number; overdue: number; medianDaysToFix: number | null };
  elements: ProgramElement[];
  emr: EmrEntry[];
  documents: CompanyDocument[];
};

const day = (iso: string) => iso.slice(0, 10);
const inRange = (d: string, from: string, to: string) => d >= from && d <= to;
const zero = (): Tally => ({ expected: 0, on_time: 0, made_up: 0, open: 0, missed: 0, due: 0 });
const add = (a: Tally, b: Tally) => { for (const k of Object.keys(a) as (keyof Tally)[]) a[k] += b[k]; };

/** Florida's workplace safety program elements (s. 440.1025, F.S.), in the statute's order. */
export const PROGRAM_ELEMENTS = [
  { id: "policy", name: "Written safety policy and safety rules" },
  { id: "inspections", name: "Safety inspections" },
  { id: "maintenance", name: "Preventive maintenance" },
  { id: "training", name: "Safety training" },
  { id: "first_aid", name: "First aid" },
  { id: "investigation", name: "Accident investigation" },
  { id: "records", name: "Necessary recordkeeping" },
] as const;

/** "Written program attached (1 document, uploaded Mar 1, 2026)." Counts and dates, never titles. */
export function programDocsEvidence(docs: Pick<CompanyDocument, "uploaded_at">[]): string {
  const latest = docs.map((d) => d.uploaded_at.slice(0, 10)).sort().at(-1);
  const when = latest ? parseDay(latest).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
  return `Written program attached (${docs.length} document${docs.length === 1 ? "" : "s"}${when ? `, latest uploaded ${when}` : ""}).`;
}

export function buildProfile(input: ProfileInput): SafetyProfile {
  const today = input.today ?? new Date();
  const { from, to } = input;
  const thisWeek = isoDay(addDays(today, -((today.getDay() + 6) % 7)));
  const records = input.records.filter((r) => r.kind !== "daily" && inRange(day(r.held_at), from, to));

  // Talk periods: ended ones are scored; a period with no record at all (not even a makeup) is a missed period.
  const ended = input.compliance.weeks.filter((w) => isoDay(addDays(parseDay(w.key), 7 * w.weeks)) <= thisWeek && w.key >= from && w.key <= to);
  const total = zero();
  for (const w of ended) add(total, w.tally);
  const periodsMissed = ended.filter((w) => w.recordIds.length === 0).length;

  const monthMap = new Map<string, MonthRow>();
  const month = (m: string) => {
    if (!monthMap.has(m)) monthMap.set(m, { month: m, periods: 0, missed: 0, talks: 0, tally: zero(), signIn: null, onTime: null });
    return monthMap.get(m)!;
  };
  for (const w of ended) {
    const row = month(w.key.slice(0, 7));
    row.periods++;
    if (w.recordIds.length === 0) row.missed++;
    add(row.tally, w.tally);
  }
  for (const r of records) month(day(r.held_at).slice(0, 7)).talks++;
  const months = [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month)).map((r) => ({ ...r, signIn: score(r.tally), onTime: onTimeRate(r.tally) }));

  const langs = new Map<string, number>();
  for (const r of records) langs.set(r.language, (langs.get(r.language) ?? 0) + 1);

  const dailyDays = new Set(input.daily.map((d) => day(d.held_at)).filter((d) => inRange(d, from, to))).size;

  const events = input.events.filter((e) => !e.withdrawn_at && inRange(e.occurred_on, from, to));
  const count = (k: ProfileEvent["kind"]) => events.filter((e) => e.kind === k).length;
  const log = {
    inspections: count("inspection"), walkarounds: count("walkaround"), incidents: count("incident"), nearMisses: count("near_miss"),
    citations: events.filter((e) => e.kind === "citation").map((e) => ({ status: e.case_status ?? "open" })),
    open: events.filter((e) => e.status === "open").length,
  };

  const raised = input.issues.filter((i) => inRange(day(i.raised_at), from, to));
  const fixedDays = raised.filter((i) => i.status === "fixed" && i.fixed_at)
    .map((i) => (new Date(i.fixed_at!).getTime() - new Date(i.raised_at).getTime()) / 86_400_000).sort((a, b) => a - b);
  const median = fixedDays.length ? fixedDays[Math.floor((fixedDays.length - 1) / 2)] : null;
  const todayKey = isoDay(today);
  const issues = {
    raised: raised.length,
    fixed: raised.filter((i) => i.status === "fixed").length,
    open: input.issues.filter((i) => i.status === "open").length,
    overdue: input.issues.filter((i) => i.status === "open" && i.due_date && i.due_date < todayKey).length,
    medianDaysToFix: median === null ? null : Math.max(0, Math.round(median)),
  };

  const docs = input.documents;
  const findings = raised.filter((i) => i.event_id).length;
  const firstAidTalks = records.filter((r) => /first-aid|bloodborne|sharps/.test(r.talk_id)).length;
  const s = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
  const t = input.training;
  // Training cards are entered by the company, so they're labelled that way; expired and missing are said plainly.
  const cards = t && t.current + t.expiring + t.expired + t.missing > 0
    ? ` Training cards entered by the company, as of today: ${t.current + t.expiring} current${t.expiring ? ` (${t.expiring} expiring within 30 days)` : ""}${t.expired ? `, ${t.expired} expired` : ""}${t.missing ? `, ${t.missing} missing for job titles that need them` : ""}.`
    : "";
  const elements: ProgramElement[] = [
    docs.some((d) => d.kind === "safety_program")
      // Never the document's title: titles are free text and summaries go to agents and carriers (review 2026-10-10).
      ? { id: "policy", name: PROGRAM_ELEMENTS[0].name, status: "records", evidence: programDocsEvidence(docs.filter((d) => d.kind === "safety_program")) }
      : { id: "policy", name: PROGRAM_ELEMENTS[0].name, status: "outside", evidence: "Not attached to this summary. The company can attach its written program in the app." },
    log.inspections + log.walkarounds > 0
      ? { id: "inspections", name: PROGRAM_ELEMENTS[1].name, status: "records", evidence: `${s(log.inspections, "inspection")} and ${s(log.walkarounds, "walk-around")} logged in the safety log.` }
      : { id: "inspections", name: PROGRAM_ELEMENTS[1].name, status: "outside", evidence: "No inspections were logged in the app in this range." },
    { id: "maintenance", name: PROGRAM_ELEMENTS[2].name, status: "outside", evidence: "Equipment maintenance records aren't part of the app." },
    records.length + dailyDays > 0
      ? { id: "training", name: PROGRAM_ELEMENTS[3].name, status: "records", evidence: `${s(records.length, "signed toolbox talk")} and ${s(dailyDays, "day")} with a signed daily pre-task plan.${cards}` }
      : { id: "training", name: PROGRAM_ELEMENTS[3].name, status: cards ? "some" : "outside", evidence: `No talks recorded in this range.${cards}` },
    { id: "first_aid", name: PROGRAM_ELEMENTS[4].name, status: firstAidTalks ? "some" : "outside",
      evidence: `${firstAidTalks ? `${s(firstAidTalks, "talk")} on first aid or bloodborne pathogens. ` : ""}First aid kits and trained responders aren't part of the app.` },
    log.incidents + log.nearMisses > 0
      ? { id: "investigation", name: PROGRAM_ELEMENTS[5].name, status: "records", evidence: `${s(log.incidents, "incident")} and ${s(log.nearMisses, "near miss", "near misses")} logged, with ${s(findings, "finding")} added to the issues list.` }
      : { id: "investigation", name: PROGRAM_ELEMENTS[5].name, status: "some", evidence: "The safety log is ready for incidents and near misses; none were logged in this range." },
    { id: "records", name: PROGRAM_ELEMENTS[6].name, status: "records", evidence: "Every talk, daily plan and log entry is kept as a signed, dated record that can't be changed afterward; corrections are added as new linked records." },
  ];

  return {
    from, to,
    talks: records.length, makeups: records.filter((r) => r.makeup_for_week).length, topics: new Set(records.map((r) => r.talk_id)).size,
    languages: [...langs].map(([language, talks]) => ({ language, talks })).sort((a, b) => b.talks - a.talks),
    periodsEnded: ended.length, periodsWithTalk: ended.length - periodsMissed, periodsMissed,
    missedKeys: ended.filter((w) => w.recordIds.length === 0).map((w) => w.key).sort(),
    total, signIn: score(total), onTime: onTimeRate(total),
    months, dailyDays, log, issues, elements,
    emr: [...input.emr].sort((a, b) => b.rating_year - a.rating_year || b.entered_at.localeCompare(a.entered_at))
      .filter((e, i, all) => all.findIndex((x) => x.rating_year === e.rating_year) === i), // latest entry per year
    documents: docs,
  };
}

/** The usual ranges: the last 12 months (renewal packet) and last month (the monthly summary). */
export function profileRange(kind: "year" | "month", today: Date = new Date()): { from: string; to: string } {
  if (kind === "month") {
    const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const last = new Date(today.getFullYear(), today.getMonth(), 0);
    return { from: isoDay(first), to: isoDay(last) };
  }
  const from = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate() + 1);
  return { from: isoDay(from), to: isoDay(today) };
}
