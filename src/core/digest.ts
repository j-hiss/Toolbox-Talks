// The weekly email to the office (migration 0056). Pure module: builds the summary from the same math as Reports and
// Home (src/core/compliance.ts, certs.ts, hazards.ts), so the email can never disagree with the app. Used by the
// weekly-digest server function (bundled by `npm run functions:sync`) and by the in-app preview.
//
// Honest status: a team with people on staff and no signatures shows as not signed, never left out. Nothing here says
// or implies a company is compliant; the footer says so.
import { buildCompliance, needsMakeup, pct, score, teamGrid, type ReportPerson, type ReportRecord } from "./compliance";
import { trainingSummary, type CertRequirement, type PersonCert } from "./certs";
import { hazardCounts } from "./hazards";
import { addDays, parseDay } from "./weeks";

export type DigestInput = {
  companyName: string;
  appUrl: string | null;
  today: Date;
  /** The plan's talk periods, newest first, covering the makeup window (periodKeys in src/core/makeup.ts). */
  periods: { key: string; weeks: number }[];
  makeupWeeks: number;
  people: ReportPerson[];
  records: ReportRecord[];
  teams: { id: string; name: string }[];
  issues: { status: "open" | "fixed"; due_date: string | null }[];
  roster: { id: string; role_id: string | null }[];
  certs: PersonCert[];
  reqs: CertRequirement[];
  hazards: { kind: "hazard" | "near_miss"; reviewed_at: string | null; created_at: string }[];
};

export type DigestTone = "ok" | "attention" | "info";
export type DigestSection = { title: string; tone: DigestTone; lines: string[] };
export type Digest = { weekKey: string | null; subject: string; attention: number; sections: DigestSection[]; text: string; html: string };

export const DIGEST_FOOTER = "This summary shows the safety meetings, cards and reports recorded in the app. It doesn't mean the company is compliant with OSHA or any other rule.";

const dayLabel = (iso: string) => parseDay(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function buildDigest(d: DigestInput): Digest {
  const c = buildCompliance({ people: d.people, records: d.records, weeks: d.periods, makeupWeeks: d.makeupWeeks, today: d.today });
  const todayIso = d.today.toISOString().slice(0, 10);
  // Newest first: [0] is the period still running; [1] is the last one that ended.
  const last = c.weeks.find((w) => w.tally.expected > 0 && w.people.every((p) => p.state !== "due")) ?? null;
  const sections: DigestSection[] = [];
  let attention = 0;

  if (last) {
    const name = new Map(d.teams.map((t) => [t.id, t.name]));
    const grid = teamGrid({ ...c, weeks: [last] });
    const rows = grid.map((g) => ({ team: g.teamId ? name.get(g.teamId) ?? "A removed team" : "No team", t: g.weeks[0].tally }))
      .filter((r) => r.t.expected > 0).sort((a, b) => a.team.localeCompare(b.team));
    const missed = rows.filter((r) => r.t.on_time + r.t.made_up === 0);
    attention += missed.length;
    const signed = last.tally.on_time + last.tally.made_up;
    const lines = [
      `${signed} of ${last.tally.expected} people signed (${pct(score(last.tally))}).`,
      ...rows.map((r) => {
        const s = r.t.on_time + r.t.made_up;
        return s === 0 ? `${r.team}: no one signed. No talk recorded for this team.` : `${r.team}: ${s} of ${r.t.expected} signed${r.t.made_up ? ` (${r.t.made_up} made up late)` : ""}.`;
      }),
    ];
    const label = last.weeks > 1 ? `Talk period starting ${dayLabel(last.key)}` : `Week of ${dayLabel(last.key)}`;
    sections.push({ title: label, tone: missed.length ? "attention" : signed === last.tally.expected ? "ok" : "info", lines });
  } else {
    sections.push({ title: "Last week", tone: "info", lines: ["No finished talk period with people on staff yet."] });
  }

  const owed = needsMakeup(c, d.makeupWeeks, d.today);
  const soon = owed.filter((o) => o.daysLeft <= 7).length;
  if (owed.length) {
    attention += soon;
    sections.push({ title: "Makeups", tone: soon ? "attention" : "info", lines: [
      `${plural(owed.length, "makeup")} still owed, by ${plural(new Set(owed.map((o) => o.personId)).size, "person", "people")}.`,
      ...(soon ? [`${plural(soon, "makeup runs", "makeups run")} out within 7 days.`] : []),
    ] });
  }

  const t = trainingSummary(d.roster, d.certs, d.reqs, d.today);
  if (t.expired || t.expiring || t.missing) {
    attention += t.expired + t.missing;
    sections.push({ title: "Training cards", tone: t.expired || t.missing ? "attention" : "info", lines: [
      ...(t.expired ? [`${plural(t.expired, "card")} expired.`] : []),
      ...(t.expiring ? [`${plural(t.expiring, "card")} expire${t.expiring === 1 ? "s" : ""} within 30 days.`] : []),
      ...(t.missing ? [`${plural(t.missing, "required card")} missing.`] : []),
    ] });
  }

  const open = d.issues.filter((i) => i.status === "open");
  const overdue = open.filter((i) => i.due_date && i.due_date < todayIso).length;
  if (open.length) {
    attention += overdue;
    sections.push({ title: "Issues to fix", tone: overdue ? "attention" : "info", lines: [`${plural(open.length, "open issue")}${overdue ? `, ${overdue} overdue` : ""}.`] });
  }

  const h = hazardCounts(d.hazards, addDays(d.today, -7).toISOString());
  if (h.waiting || h.newSince) {
    attention += h.waiting;
    sections.push({ title: "Crew reports", tone: h.waiting ? "attention" : "info", lines: [
      `${plural(h.newSince, "new report")} in the last 7 days${h.nearMissSince ? ` (${plural(h.nearMissSince, "near miss", "near misses")})` : ""}.`,
      ...(h.waiting ? [`${h.waiting} waiting for someone to review.`] : []),
    ] });
  }

  const weekLabel = last ? dayLabel(last.key) : dayLabel(todayIso);
  const subject = `${d.companyName}: weekly safety summary, week of ${weekLabel}${attention ? ` (${plural(attention, "item")} need attention)` : ""}`;
  return { weekKey: last?.key ?? null, subject, attention, sections, text: digestText(d, subject, sections), html: digestHtml(d, subject, sections) };
}

function digestText(d: DigestInput, subject: string, sections: DigestSection[]): string {
  return [subject, "", ...sections.flatMap((s) => [s.title.toUpperCase(), ...s.lines.map((l) => `- ${l}`), ""]),
    ...(d.appUrl ? [`Open the app: ${d.appUrl}`, ""] : []), DIGEST_FOOTER,
    "To stop these emails, open the app: Admin > Company > Weekly email (office: Records > Crew reports > Weekly email)."].join("\n");
}

const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
const TONE: Record<DigestTone, string> = { attention: "#b42318", ok: "#1f7a4d", info: "#475467" };

function digestHtml(d: DigestInput, subject: string, sections: DigestSection[]): string {
  const block = (s: DigestSection) =>
    `<tr><td style="padding:14px 0;border-top:1px solid #e4e7ec"><div style="font:600 13px/1.4 Arial,sans-serif;color:${TONE[s.tone]};text-transform:uppercase;letter-spacing:.04em">${esc(s.title)}</div>` +
    `<ul style="margin:6px 0 0;padding-left:18px;font:15px/1.5 Arial,sans-serif;color:#101828">${s.lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul></td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#f5f5f2"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:20px 24px">` +
    `<tr><td style="font:700 20px/1.3 Arial,sans-serif;color:#101828;padding-bottom:6px">${esc(d.companyName)}</td></tr>` +
    `<tr><td style="font:15px/1.4 Arial,sans-serif;color:#475467;padding-bottom:8px">${esc(subject.replace(`${d.companyName}: `, ""))}</td></tr>` +
    sections.map(block).join("") +
    (d.appUrl ? `<tr><td style="padding:16px 0"><a href="${esc(d.appUrl)}" style="display:inline-block;background:#1f4d3a;color:#ffffff;text-decoration:none;font:600 15px Arial,sans-serif;padding:10px 18px;border-radius:999px">Open the app</a></td></tr>` : "") +
    `<tr><td style="font:12px/1.5 Arial,sans-serif;color:#667085;border-top:1px solid #e4e7ec;padding-top:12px">${esc(DIGEST_FOOTER)}<br>To stop these emails: Admin &gt; Company &gt; Weekly email (office: Records &gt; Crew reports &gt; Weekly email).</td></tr>` +
    `</table></td></tr></table></body></html>`;
}
