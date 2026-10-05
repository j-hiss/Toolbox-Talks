"use client";

// Reports: weekly compliance for the company (or one team). Everyone on staff has to sign each week's talk; a makeup
// closes a missed week but stays marked as made up. Math: src/core/compliance.ts. Data: src/lib/data/reports.ts.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  buildCompliance, makeupDeadline, makeupSummary, needsMakeup, onTimeRate, pct, periodChange, score, teamGrid, trend, weekKeys,
  WEEK_STATE_LABEL, type Compliance, type ReportPerson, type ReportRecord, type Tally, type WeekState,
} from "@/core/compliance";
import { MAKEUP_REASONS, planWeekAt } from "@/core/makeup";
import { HBars, TeamGrid, TrendChart } from "@/components/charts";
import { cycleStart } from "@/core/plan";
import { STATUS_LABEL } from "@/core/attendance";
import { addDays, isoDay, mondayOf, parseDay, weekLabel } from "@/core/weeks";
import { TALKS } from "@/content/talks";
import { reportPeople, reportRecords } from "@/lib/data/reports";
import { listIssues } from "@/lib/data/issues";
import { isOverdue } from "@/components/Issues";
import { listTeams } from "@/lib/data/company";
import type { Issue, Membership, Team } from "@/lib/data/types";
import { usePlan } from "@/lib/usePlan";
import { newMakeupDraft } from "@/lib/draft";
import { readChosenJobsite } from "@/components/JobsitePicker";
import { useRouter } from "next/navigation";
import { saveFile } from "@/lib/download";
import { RequireCompany } from "@/components/Guard";
import { Button, Eyebrow, GroupHeading, Loading, MakeupTag, Notice, Shell, Title, inputClass } from "@/components/ui";

export default function ReportsPage() {
  return <RequireCompany admin>{(m) => <Reports m={m} />}</RequireCompany>;
}

const RANGES = [
  { id: "4", label: "4 weeks" },
  { id: "12", label: "12 weeks" },
  { id: "26", label: "26 weeks" },
  { id: "plan", label: "This plan year" },
] as const;
type RangeId = (typeof RANGES)[number]["id"];

const SEGMENTS: { state: WeekState; color: string; texture?: boolean }[] = [
  { state: "on_time", color: "var(--ok)" },
  { state: "made_up", color: "var(--ok)", texture: true },
  { state: "open", color: "var(--hivis)" },
  { state: "missed", color: "var(--warn)" },
  { state: "due", color: "var(--line)" },
];
const fill = (s: (typeof SEGMENTS)[number]) =>
  s.texture ? `repeating-linear-gradient(135deg, ${s.color} 0 4px, color-mix(in srgb, ${s.color} 45%, var(--surface)) 4px 7px)` : s.color;
const short = (d: Date | string) => (typeof d === "string" ? new Date(d) : d).toLocaleDateString(undefined, { month: "short", day: "numeric" });

function Reports({ m }: { m: Membership }) {
  const co = m.company;
  const { input } = usePlan(co);
  const [range, setRange] = useState<RangeId>("12");
  const [team, setTeam] = useState("all");
  const [onlyGaps, setOnlyGaps] = useState(false);
  const [openWeek, setOpenWeek] = useState<string | null>(null);
  const [data, setData] = useState<{ people: ReportPerson[]; records: ReportRecord[]; teams: Team[]; from: string; issues: Issue[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [csvMsg, setCsvMsg] = useState<string | null>(null);
  const router = useRouter();
  const startMakeup = (weekStart: string, weekNumber: number, talkId: string, personIds: string[]) => {
    newMakeupDraft(co.id, { weekStart, weekNumber, talkId, personIds }, readChosenJobsite(co.id) ?? "");
    router.push("/talk/");
  };

  const today = useMemo(() => new Date(), []);
  const programStart = isoDay(mondayOf(parseDay(co.program_start)));
  const from = useMemo(() => {
    const start = range === "plan" ? isoDay(cycleStart(co.program_start, today)) : isoDay(addDays(mondayOf(today), -7 * (Number(range) - 1)));
    return start < programStart ? programStart : start;
  }, [range, co.program_start, programStart, today]);

  useEffect(() => {
    let live = true;
    Promise.all([reportPeople(co.id), reportRecords(co.id, from), listTeams(co.id), listIssues(co.id)])
      .then(([people, records, teams, issues]) => live && setData({ people, records, teams, from, issues }))
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [co.id, from]);

  const report: Compliance | null = useMemo(() => {
    if (!data) return null;
    const people = data.people.filter((p) => team === "all" || (team === "none" ? !p.teamId : p.teamId === team));
    return buildCompliance({ people, records: data.records, weeks: weekKeys(data.from, today), makeupWeeks: co.makeup_weeks ?? 4, today });
  }, [data, team, today, co.makeup_weeks]);

  if (error) return <Shell><Notice tone="error">Couldn&apos;t load reports: {error}</Notice></Shell>;
  if (parseDay(co.program_start) > today) {
    return <Shell><Title>Reports</Title><div className="mt-4"><Notice>Your plan starts the week of {short(parseDay(co.program_start))}. Reports fill in from then.</Notice></div></Shell>;
  }
  if (!data || !report) return <Shell><Loading /></Shell>;

  const names = new Map(data.people.map((p) => [p.id, p]));
  const teamName = (id: string | null) => data.teams.find((t) => t.id === id)?.name ?? "";
  const recById = new Map(data.records.map((r) => [r.id, r]));
  const plan = (key: string) => planWeekAt(input, parseDay(key));
  const talkTitle = (key: string) => {
    const id = plan(key)?.talkId;
    return TALKS.find((t) => t.id === id)?.content.en.title ?? "";
  };
  const t = report.total;
  const current = report.weeks.find((w) => w.key === isoDay(mondayOf(today)));
  const people = report.people
    .filter((p) => !onlyGaps || p.tally.open + p.tally.missed > 0)
    .sort((a, b) => (score(a.tally) ?? 2) - (score(b.tally) ?? 2) || a.person.name.localeCompare(b.person.name));
  const gapsCount = report.people.filter((p) => p.tally.open + p.tally.missed > 0).length;
  const points = trend(report, today).map((w) => ({ key: w.key, label: short(parseDay(w.key)), score: w.score, onTime: w.onTime }));
  const span = Math.min(4, Math.floor(points.length / 2));
  const change = span >= 2 ? periodChange(report, span, today) : null;
  const owed = needsMakeup(report, co.makeup_weeks ?? 4, today);
  // Group by week (soonest deadline first): one makeup talk covers everyone who owes that week.
  const owedWeeks = [...new Set(owed.map((o) => o.week))].map((week) => {
    const rows = owed.filter((o) => o.week === week);
    return { week, people: rows.map((o) => o.personId), deadline: rows[0].deadline, daysLeft: rows[0].daysLeft };
  });
  const made = makeupSummary(report, MAKEUP_REASONS);
  const grid = teamGrid(report)
    .map((g) => ({ name: g.teamId ? teamName(g.teamId) || "Former team" : "No team", cells: g.weeks }))
    .sort((a, b) => (a.name === "No team" ? 1 : b.name === "No team" ? -1 : a.name.localeCompare(b.name)));
  const gridWeeks = [...report.weeks].reverse().map((w) => ({ key: w.key, label: short(parseDay(w.key)) }));
  const flags = data.records.flatMap((r) => r.attendees.filter((a) => a.status !== "signed").map((a) => ({ r, a }))).reverse();

  const exportCsv = async () => {
    setCsvMsg(null);
    const q = (v: unknown) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const rows = [["Week of", "Week #", "Talk", "Person", "Team", "Status", "Signed on", "Makeup reason", "Record ID"]];
    for (const w of [...report.weeks].reverse()) {
      for (const p of w.people) {
        const person = names.get(p.personId)!;
        rows.push([w.key, String(plan(w.key)?.n ?? ""), talkTitle(w.key), person.name, teamName(person.teamId), WEEK_STATE_LABEL[p.state],
          p.signedOn ? isoDay(new Date(p.signedOn)) : "", p.reason ?? "", p.recordId ?? ""]);
      }
    }
    const csv = rows.map((r) => r.map(q).join(",")).join("\r\n");
    try {
      const res = await saveFile(`Weekly compliance ${data.from} to ${isoDay(today)}.csv`, new Blob([csv], { type: "text/csv" }));
      if (res === "canceled") setCsvMsg("Canceled.");
    } catch (e) { setCsvMsg(e instanceof Error ? e.message : String(e)); }
  };

  return (
    <Shell>
      <Eyebrow>Reports · {co.name}</Eyebrow>
      <Title>Weekly compliance</Title>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button key={r.id} aria-pressed={range === r.id} onClick={() => setRange(r.id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-bold ${range === r.id ? "border-fg bg-fg text-bg" : "border-line bg-surface"}`}>
              {r.label}
            </button>
          ))}
        </div>
        <select aria-label="Team" className={`${inputClass} w-auto py-1.5`} value={team} onChange={(e) => setTeam(e.target.value)}>
          <option value="all">All teams</option>
          {data.teams.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          <option value="none">No team</option>
        </select>
      </div>
      <p className="mt-2 text-sm text-muted tabular-nums">Week of {short(parseDay(data.from))} to today{team !== "all" ? " · team as of today" : ""}</p>

      {/* Score ------------------------------------------------------------------------------------------------------- */}
      <section className="mt-5 rounded-lg border border-line bg-surface p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-muted">Compliance score</p>
            <p className="font-display text-6xl font-extrabold leading-none tabular-nums">{pct(score(t))}</p>
          </div>
          <p className="text-sm tabular-nums">
            <b>{pct(onTimeRate(t))}</b> on time<br />
            <span className="text-muted">{t.on_time + t.made_up} of {t.expected} people-weeks signed</span>
          </p>
        </div>
        {change && (
          <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5 text-sm tabular-nums">
            <span aria-hidden className={change.points > 0 ? "text-ok" : change.points < 0 ? "text-warn" : "text-muted"}>
              {change.points > 0 ? "▲" : change.points < 0 ? "▼" : "■"}
            </span>
            <b>{change.points > 0 ? `Up ${change.points}` : change.points < 0 ? `Down ${-change.points}` : "No change,"}{change.points ? " points" : ""}</b>
            <span className="text-muted">last {span} weeks ({pct(change.now)}) vs the {span} before ({pct(change.before)})</span>
          </p>
        )}
        <StatusBar tally={t} big />
        <Legend tally={t} />
        <p className="mt-3 text-xs text-muted">
          Each person on staff signs each week&apos;s talk. A makeup closes the week but stays marked as made up. Weeks that
          are over count; this week shows below but isn&apos;t scored until it ends.
        </p>
      </section>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {current && (
          <div className="rounded-lg border border-line bg-surface p-3 text-sm tabular-nums">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-muted">This week so far</p>
            <p className="mt-1"><b className="text-2xl">{current.tally.on_time}</b> of {current.tally.expected} signed</p>
          </div>
        )}
        <div className={`rounded-lg border p-3 text-sm tabular-nums ${t.open ? "border-hivis bg-surface" : "border-line bg-surface"}`}>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-muted">Can still be made up</p>
          <p className="mt-1"><b className="text-2xl">{t.open}</b> people-weeks{t.missed ? <> · <b className="text-warn">{t.missed}</b> missed for good</> : null}</p>
          {t.open > 0 && <Link href="/" className="text-sm font-bold underline">Make up from Home</Link>}
        </div>
      </div>

      {/* Who owes a makeup: one card per week, one tap to start it ------------------------------------------------- */}
      <GroupHeading aside={owed.length ? `${owed.length}` : undefined}>Needs a makeup</GroupHeading>
      {owedWeeks.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No one owes a past week right now.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {owedWeeks.map((g) => {
            const pw = plan(g.week);
            const urgent = g.daysLeft <= 7;
            return (
              <li key={g.week} className={`rounded-lg border p-3 ${urgent ? "border-warn bg-warn-bg" : "border-line bg-surface"}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <b className="block">{pw ? `Week ${pw.n} · ` : ""}{talkTitle(g.week)}</b>
                    <small className="text-muted">{weekLabel(parseDay(g.week))}</small>
                  </span>
                  <span className="shrink-0 text-right text-sm tabular-nums">
                    <b className="block">{g.daysLeft === 0 ? "Last day" : `${g.daysLeft} day${g.daysLeft === 1 ? "" : "s"} left`}</b>
                    <small className="text-muted">by {short(g.deadline)}</small>
                  </span>
                </div>
                <p className="mt-2 text-sm"><b>{g.people.length} still need it:</b> {g.people.map((p) => names.get(p)?.name).join(", ")}</p>
                {pw && (
                  <Button className="mt-2 !py-3" onClick={() => startMakeup(g.week, pw.n, pw.talkId, g.people)}>
                    Give this makeup now
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Trend ------------------------------------------------------------------------------------------------------- */}
      <GroupHeading>Trend</GroupHeading>
      {points.length === 0 ? (
        <p className="mt-3 text-sm text-muted">The trend starts once your first week is finished.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">
            {points.length === 1
              ? "One finished week so far. The lines fill in as more weeks finish."
              : "Each finished week. The shaded gap between the lines is makeups: people who signed late."}
          </p>
          <div className="mt-3 rounded-lg border border-line bg-surface p-3"><TrendChart points={points} /></div>
        </>
      )}

      {/* Teams ------------------------------------------------------------------------------------------------------- */}
      {team === "all" && grid.length > 0 && (
        <>
          <GroupHeading>By team</GroupHeading>
          <p className="mt-1 text-sm text-muted">Score per team per week (team as of today). Tap a square for the count.</p>
          <div className="mt-3"><TeamGrid rows={grid} weeks={gridWeeks} currentKey={isoDay(mondayOf(today))} /></div>
        </>
      )}

      {/* Makeups ----------------------------------------------------------------------------------------------------- */}
      {made.total > 0 && (
        <>
          <GroupHeading aside={`${made.total}`}>Why weeks were made up</GroupHeading>
          <p className="mt-1 text-sm text-muted">
            People-weeks closed by a makeup, by reason.{made.avgDaysLate !== null ? ` On average ${made.avgDaysLate} day${made.avgDaysLate === 1 ? "" : "s"} after the week ended.` : ""}
          </p>
          <div className="mt-3 rounded-lg border border-line bg-surface p-3">
            <HBars items={made.reasons.map((r) => ({ label: r.reason, n: r.n }))} unit={(n) => String(n)} />
          </div>
        </>
      )}

      {/* Issues ------------------------------------------------------------------------------------------------------ */}
      {(() => {
        const raised = data.issues.filter((i) => i.raised_at.slice(0, 10) >= data.from);
        const open = data.issues.filter((i) => i.status === "open");
        const late = open.filter(isOverdue).length;
        const fixed = raised.filter((i) => i.status === "fixed" && i.fixed_at);
        const days = fixed.map((i) => (new Date(i.fixed_at!).getTime() - new Date(i.raised_at).getTime()) / 86_400_000);
        const avg = days.length ? Math.round(days.reduce((a, b) => a + b, 0) / days.length) : null;
        if (!raised.length && !open.length) return null;
        return (
          <>
            <GroupHeading>Issues the crew raised</GroupHeading>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center tabular-nums">
              <div className="rounded-lg border border-line bg-surface p-2"><b className="block text-2xl">{raised.length}</b><small className="text-muted">raised in range</small></div>
              <div className={`rounded-lg border p-2 ${late ? "border-warn bg-warn-bg" : "border-line bg-surface"}`}><b className="block text-2xl">{open.length}</b><small className="text-muted">open{late ? ` · ${late} overdue` : ""}</small></div>
              <div className="rounded-lg border border-line bg-surface p-2"><b className="block text-2xl">{avg ?? "–"}</b><small className="text-muted">avg days to fix</small></div>
            </div>
            <Link href="/records/#issues" className="mt-2 inline-flex min-h-11 items-center text-sm font-bold underline">See all issues</Link>
          </>
        );
      })()}

      {/* Weeks ------------------------------------------------------------------------------------------------------- */}
      <GroupHeading>By week</GroupHeading>
      <ul className="mt-3 flex flex-col gap-2">
        {report.weeks.map((w) => {
          const pw = plan(w.key);
          const isNow = w === current;
          const expanded = openWeek === w.key;
          const by = (s: WeekState) => w.people.filter((p) => p.state === s);
          return (
            <li key={w.key} className="rounded-lg border border-line bg-surface">
              <button className="w-full p-3 text-left" aria-expanded={expanded} onClick={() => setOpenWeek(expanded ? null : w.key)}>
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <b className="block">{pw ? `Week ${pw.n} · ` : ""}{weekLabel(parseDay(w.key))}</b>
                    <small className="text-muted">{talkTitle(w.key)}</small>
                  </span>
                  <span className="text-right tabular-nums">
                    {isNow ? <b className="text-sm">In progress</b> : <b className="text-xl">{pct(score(w.tally))}</b>}
                    <small className="block text-muted">{w.tally.on_time + w.tally.made_up}/{w.tally.expected} signed</small>
                  </span>
                </span>
                <StatusBar tally={w.tally} />
              </button>
              {expanded && (
                <div className="border-t border-line p-3 text-sm">
                  {w.tally.expected === 0 && <p className="text-muted">No one was on staff this week.</p>}
                  <PeopleList title="Open: can still be made up" tone="open" rows={by("open")} names={names} note={`Make up by ${short(makeupDeadline(w.key, co.makeup_weeks ?? 4))}`} />
                  {by("open").length > 0 && pw && (
                    <Button size="sm" className="mt-2" onClick={() => startMakeup(w.key, pw.n, pw.talkId, by("open").map((p) => p.personId))}>
                      Give the makeup for these {by("open").length}
                    </Button>
                  )}
                  <PeopleList title="Missed" tone="missed" rows={by("missed")} names={names} note="Past the makeup limit" />
                  <PeopleList title="Not signed yet" tone="due" rows={by("due")} names={names} />
                  <PeopleList title="Made up" tone="made_up" rows={by("made_up")} names={names} detail={(p) => `${short(p.signedOn!)}${p.reason ? ` · ${p.reason}` : ""}`} />
                  <PeopleList title="On time" tone="on_time" rows={by("on_time")} names={names} />
                  {w.recordIds.length > 0 && (
                    <>
                      <p className="mt-3 font-bold">Talks given ({w.recordIds.length})</p>
                      <ul className="mt-1 flex flex-col gap-1">
                        {w.recordIds.map((id) => {
                          const r = recById.get(id)!;
                          return (
                            <li key={id}>
                              <Link href={`/record/#${id}`} className="underline">{short(r.heldAt)} · {r.title}{r.teamName ? ` · ${r.teamName}` : ""}</Link>
                              {r.makeupForWeek && <MakeupTag weekStart={r.makeupForWeek} reason={r.makeupReason} />}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* People ------------------------------------------------------------------------------------------------------ */}
      <GroupHeading aside={`${report.people.length}`}>By person</GroupHeading>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-5 w-5 accent-[var(--hivis)]" checked={onlyGaps} onChange={(e) => setOnlyGaps(e.target.checked)} />
        Only people with open or missed weeks ({gapsCount})
      </label>
      <div className="mt-3 overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full text-sm tabular-nums">
          <thead className="text-left font-display text-xs uppercase tracking-wide text-muted">
            <tr><th className="p-2">Name</th><th className="p-2 text-right">On time</th><th className="p-2 text-right">Made up</th><th className="p-2 text-right">Open</th><th className="p-2 text-right">Missed</th><th className="p-2 text-right">Score</th></tr>
          </thead>
          <tbody>
            {people.length === 0 ? (
              <tr><td colSpan={6} className="p-3 text-muted">No one to show.</td></tr>
            ) : people.map(({ person, tally }) => (
              <tr key={person.id} className={`border-t border-line ${tally.open + tally.missed ? "bg-warn-bg" : ""}`}>
                <td className="p-2"><b>{person.name}</b>{person.deactivatedAt && <small className="ml-1 text-muted">inactive</small>}<small className="block text-muted">{teamName(person.teamId)}</small></td>
                <td className="p-2 text-right">{tally.on_time}</td>
                <td className="p-2 text-right">{tally.made_up || ""}</td>
                <td className="p-2 text-right">{tally.open || ""}</td>
                <td className="p-2 text-right">{tally.missed || ""}</td>
                <td className="p-2 text-right font-bold">{pct(score(tally))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Flags ------------------------------------------------------------------------------------------------------- */}
      <GroupHeading aside={`${flags.length}`}>Flags on sign-in sheets</GroupHeading>
      {flags.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No one marked not signed or absent in this range.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-1.5">
          {flags.slice(0, 20).map(({ r, a }, i) => (
            <li key={`${r.id}-${i}`}>
              <Link href={`/record/#${r.id}`} className="flex items-center justify-between gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm">
                <span className="min-w-0"><b>{a.name}</b> <small className="text-muted">{short(r.heldAt)} · {r.title}{r.teamName ? ` · ${r.teamName}` : ""}</small></span>
                <span className="rounded bg-warn px-2 py-0.5 font-display text-xs font-bold uppercase text-white">{STATUS_LABEL[a.status]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={exportCsv}>Export CSV</Button>
        {csvMsg && <span className="text-sm text-muted" role="status">{csvMsg}</span>}
      </div>
      <p className="mt-2 text-xs text-muted">One row per person per week, with status, the date signed and any makeup reason. Opens in Excel.</p>
      <p className="mt-6 text-xs text-muted">These reports document safety meetings. They don&apos;t by themselves certify OSHA compliance.</p>
    </Shell>
  );
}

function StatusBar({ tally, big }: { tally: Tally; big?: boolean }) {
  if (tally.expected === 0) return <div className={`mt-2 rounded bg-line ${big ? "h-4" : "h-2"}`} />;
  const label = SEGMENTS.filter((s) => tally[s.state]).map((s) => `${WEEK_STATE_LABEL[s.state]} ${tally[s.state]}`).join(", ");
  return (
    <div role="img" aria-label={label} title={label} className={`mt-2 flex gap-[2px] overflow-hidden rounded ${big ? "h-4" : "h-2"}`}>
      {SEGMENTS.filter((s) => tally[s.state] > 0).map((s) => (
        <span key={s.state} style={{ flexGrow: tally[s.state], background: fill(s) }} />
      ))}
    </div>
  );
}

function Legend({ tally }: { tally: Tally }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm tabular-nums">
      {SEGMENTS.filter((s) => s.state !== "due").map((s) => (
        <li key={s.state} className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-3 w-3 rounded-sm" style={{ background: fill(s) }} />
          {WEEK_STATE_LABEL[s.state]} <b>{tally[s.state]}</b>
        </li>
      ))}
    </ul>
  );
}

function PeopleList({ title, tone, rows, names, note, detail }: {
  title: string; tone: WeekState; rows: Compliance["weeks"][number]["people"]; names: Map<string, ReportPerson>;
  note?: string; detail?: (p: Compliance["weeks"][number]["people"][number]) => string;
}) {
  if (rows.length === 0) return null;
  const seg = SEGMENTS.find((s) => s.state === tone)!;
  return (
    <div className="mt-2 first:mt-0">
      <p className="flex items-center gap-1.5 font-bold">
        <span aria-hidden className="inline-block h-3 w-3 rounded-sm" style={{ background: fill(seg) }} />
        {title} ({rows.length}){note && <small className="font-normal text-muted">· {note}</small>}
      </p>
      <p className="mt-0.5 text-muted">
        {rows.map((p) => `${names.get(p.personId)?.name ?? "?"}${detail ? ` (${detail(p)})` : ""}`).join(", ")}
      </p>
    </div>
  );
}
