// The safety log: inspections, walk-arounds, citations, incidents and near misses a company records, and the
// "Since last talk" section that reads their crew summaries at the next talk. Pure module.
//
// What crews hear is only the crew summary, and only after an admin approves it (the same "draft until reviewed"
// rule as translations). Details, names and medical information stay in the admin-only record. Citations are
// read as alleged, with their case status, until they're final. Nothing here says a company passed or complies.
// Research and rules behind this: the "Next Features: Research Findings" doc (WAC 296-155-110, OAR 437-001-0765,
// 29 CFR 1903.16, 1904.29(b)(7)).

export type EventKind = "inspection" | "walkaround" | "citation" | "incident" | "near_miss";

export const EVENT_KINDS: { id: EventKind; name: string; sub: string }[] = [
  { id: "inspection", name: "Inspection", sub: "Scaffold, trench, crane, ladder, harness, forklift, extinguisher, site" },
  { id: "walkaround", name: "Walk-around", sub: "A walk of the site, for example a manager and a crew rep together" },
  { id: "citation", name: "Citation", sub: "From OSHA or a state plan. Read to crews as alleged until final" },
  { id: "incident", name: "Incident", sub: "Injury, illness, property damage or a spill" },
  { id: "near_miss", name: "Near miss", sub: "Could have hurt someone, didn't" },
];

export const kindName = (k: EventKind) => EVENT_KINDS.find((x) => x.id === k)?.name ?? k;

/** A citation stays an allegation until it's a final order; crews hear its status with it. */
export type CaseStatus = "open" | "informal_conference" | "contested" | "settled" | "final";
export const CASE_STATUSES: { id: CaseStatus; name: string }[] = [
  { id: "open", name: "Open" },
  { id: "informal_conference", name: "Informal conference" },
  { id: "contested", name: "Contested" },
  { id: "settled", name: "Settled" },
  { id: "final", name: "Final order" },
];
export const caseStatusName = (s: CaseStatus | null | undefined) => CASE_STATUSES.find((x) => x.id === s)?.name ?? "Open";

/** What a crew may see of an event (from the crew_bulletins database function: approved and not withdrawn). */
export type Bulletin = {
  id: string;
  kind: EventKind;
  occurred_on: string;          // YYYY-MM-DD
  jobsite_id: string | null;    // null = company-wide
  jobsite_name: string;
  crew_summary: string;
  case_status: CaseStatus | null;
  status: "open" | "closed";
  reviewed_at: string;          // when an admin approved the crew summary
};

export type SinceLastWindow = "since_last" | "30" | "60" | "90";
export type SinceLastSettings = {
  enabled: boolean;
  window: SinceLastWindow;
  /** "jobsite": this jobsite's events plus company-wide ones. "all": every jobsite. */
  scope: "jobsite" | "all";
  kinds: EventKind[];
  openOnly: boolean;
};

export const SINCE_LAST_DEFAULTS: SinceLastSettings = {
  enabled: false, window: "since_last", scope: "jobsite", kinds: EVENT_KINDS.map((k) => k.id), openOnly: false,
};

/** A company's settings, filled in with the defaults for anything not set yet. */
export function sinceLastSettings(co: {
  since_last_enabled?: boolean; since_last_window?: SinceLastWindow; since_last_scope?: "jobsite" | "all";
  since_last_kinds?: EventKind[]; since_last_open_only?: boolean;
}): SinceLastSettings {
  return {
    enabled: co.since_last_enabled ?? SINCE_LAST_DEFAULTS.enabled,
    window: co.since_last_window ?? SINCE_LAST_DEFAULTS.window,
    scope: co.since_last_scope ?? SINCE_LAST_DEFAULTS.scope,
    kinds: co.since_last_kinds ?? SINCE_LAST_DEFAULTS.kinds,
    openOnly: co.since_last_open_only ?? SINCE_LAST_DEFAULTS.openOnly,
  };
}

export const WINDOW_NAMES: { id: SinceLastWindow; name: string }[] = [
  { id: "since_last", name: "Since the last talk at that jobsite" },
  { id: "30", name: "Last 30 days" },
  { id: "60", name: "Last 60 days" },
  { id: "90", name: "Last 90 days" },
];

/** A state whose meeting rule asks for this review, to suggest turning it on. Read against the rule text. */
export function sinceLastHint(state: string | undefined): string | null {
  if (state === "WA") return "Washington's construction rule asks each crew safety meeting to review walk-arounds since the last meeting, citations, and accident investigations (WAC 296-155-110).";
  if (state === "OR") return "Oregon's safety meeting rule includes accident investigations, their causes and the fixes (OAR 437-001-0765).";
  return null;
}

const DAY = 86_400_000;

/** Where the window starts. "Since last talk" with no earlier talk there falls back to 30 days. */
export function windowStart(s: Pick<SinceLastSettings, "window">, lastTalkAt: string | null, today: Date = new Date()): Date {
  if (s.window === "since_last") return lastTalkAt ? new Date(lastTalkAt) : new Date(today.getTime() - 30 * DAY);
  return new Date(today.getTime() - Number(s.window) * DAY);
}

/**
 * The items to read at a talk: approved since the window started, or happened since then; for this jobsite (plus
 * company-wide ones) unless the company reads every jobsite's; only the kinds it picked; oldest first, the way
 * they happened.
 */
export function selectBulletins(all: Bulletin[], s: SinceLastSettings, at: { jobsiteId: string | null; since: Date }): Bulletin[] {
  const sinceDay = isoDate(at.since);
  return all
    .filter((b) => s.kinds.includes(b.kind))
    .filter((b) => !s.openOnly || b.status === "open")
    .filter((b) => s.scope === "all" || b.jobsite_id === null || b.jobsite_id === at.jobsiteId)
    .filter((b) => new Date(b.reviewed_at) >= at.since || b.occurred_on >= sinceDay)
    .sort((a, b) => a.occurred_on.localeCompare(b.occurred_on) || a.reviewed_at.localeCompare(b.reviewed_at));
}

const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** The heading read for one item: "Citation (alleged, contested) · Oct 2 · Smith reroof". */
export function bulletinHeading(b: Pick<Bulletin, "kind" | "occurred_on" | "jobsite_name" | "case_status">, locale?: string): string {
  const [y, m, d] = b.occurred_on.split("-").map(Number);
  const date = new Date(y, m - 1, d).toLocaleDateString(locale, { month: "short", day: "numeric" });
  const kind = b.kind === "citation"
    ? `Citation (${b.case_status === "final" ? "final" : `alleged, ${caseStatusName(b.case_status).toLowerCase()}`})`
    : kindName(b.kind);
  return [kind, date, b.jobsite_name || "All jobsites"].join(" · ");
}

/** Words a crew summary can't use: no "compliant", "passed", "OSHA approved" or similar claims. */
const BANNED = /\b(complian\w*|compliant|passed|pass(es)? inspection|osha[- ]approved|approved by osha|certified safe|violation[- ]free)\b/i;

/**
 * Why a crew summary can't be approved yet: empty, too long, a claim word, or a name from the company's roster
 * (crews never hear who was hurt, and names stay out of what's read). Empty list = OK to approve.
 */
export function crewSummaryProblems(text: string, rosterNames: string[]): string[] {
  const t = text.trim();
  const out: string[] = [];
  if (!t) out.push("Write what the crew should hear.");
  if (t.length > 600) out.push("Keep it under 600 characters; it's read aloud.");
  const banned = t.match(BANNED);
  if (banned) out.push(`Leave out "${banned[0]}". The app never says a company passed or complies.`);
  const lower = ` ${t.toLowerCase().replace(/[^a-z0-9áéíóúñü' ]+/g, " ")} `;
  const named = new Set<string>();
  // Full names and last names; first names alone ("Will", "Mark") are too often ordinary words.
  for (const full of rosterNames) {
    const parts = full.toLowerCase().split(/\s+/).filter(Boolean);
    const last = parts.length > 1 ? parts[parts.length - 1] : "";
    if (lower.includes(` ${parts.join(" ")} `) || (last.length >= 3 && lower.includes(` ${last} `))) named.add(full);
  }
  if (named.size) out.push(`Take out names (${[...named].join(", ")}). Crews hear what happened and the fix, not who.`);
  return out;
}

/** What a saved talk keeps of the section: exactly what was read, and that the presenter reviewed each with the crew. */
export type SinceLastSnapshot = {
  since: string;                // ISO time the window started
  window: SinceLastWindow;
  status: "read" | "none" | "unavailable";
  items: { event_id: string; heading: string; text: string; reviewed_with_crew_at: string }[];
};

/**
 * What the record keeps: the items read and when each was checked off. Items never checked aren't claimed as
 * reviewed (the talk can't finish reading without checking them, so this only matters for a tampered draft).
 */
export function sinceLastSnapshot(d: {
  status: SinceLastSnapshot["status"]; window: SinceLastWindow; since: string;
  items: { event_id: string; heading: string; text: string }[]; checked: Record<string, string>;
}): SinceLastSnapshot {
  return {
    since: d.since, window: d.window, status: d.status,
    items: d.items.filter((i) => d.checked[i.event_id]).map((i) => ({ ...i, reviewed_with_crew_at: d.checked[i.event_id] })),
  };
}
