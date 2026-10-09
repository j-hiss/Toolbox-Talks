"use client";

// Home's two status cards: where this week stands by crew (plus who owes a makeup), and, for a new company,
// a getting-started checklist. Both reuse the report query layer and compliance math; nothing is counted twice.
import { useEffect, useState } from "react";
import Link from "next/link";
import { buildCompliance, needsMakeup, teamGrid } from "@/core/compliance";
import { periodKeys } from "@/core/makeup";
import type { PlanInput } from "@/core/plan";
import { addDays, isoDay, mondayOf, parseDay } from "@/core/weeks";
import { reportPeople, reportRecords } from "@/lib/data/reports";
import { listJobsites, listTeams } from "@/lib/data/company";
import type { Company, Team } from "@/lib/data/types";
import { listIssues } from "@/lib/data/issues";

type Status = {
  teams: Team[];
  hasJobsite: boolean;
  people: number;
  records: number;
  week: ReturnType<typeof teamGrid>;
  thisWeek: { signed: number; expected: number };
  periodWeeks: number;            // weeks in the current talk period (1 = weekly)
  owed: number;
  expiringSoon: number;           // makeups whose deadline is within 7 days
  openIssues: number;
  overdueIssues: number;
};

/** `input` is the plan (usePlan), so talk periods match the company's cadence. */
export function useHomeStatus(co: Company, input: Omit<PlanInput, "today">, version = 0): Status | null {
  const [st, setSt] = useState<Status | null>(null);
  useEffect(() => {
    let live = true;
    const today = new Date();
    const thisMonday = mondayOf(today);
    const limit = co.makeup_weeks ?? 4;
    const start = isoDay(mondayOf(parseDay(co.program_start)));
    const keys = start > isoDay(thisMonday) ? [] : periodKeys(input, [isoDay(addDays(thisMonday, -7 * limit)), start].sort().at(-1)!, today);
    const fromKey = keys.at(-1)?.key ?? isoDay(thisMonday);
    Promise.all([reportPeople(co.id), reportRecords(co.id, fromKey), listTeams(co.id), listJobsites(co.id), listIssues(co.id).catch(() => [])])
      .then(([people, records, teams, sites, issues]) => {
        if (!live) return;
        const c = buildCompliance({ people, records, weeks: keys, makeupWeeks: limit, today });
        const now = keys.length ? c.weeks[0] : undefined; // newest first: the current talk period
        setSt({
          teams,
          hasJobsite: sites.length > 0,
          people: people.filter((p) => !p.deactivatedAt).length,
          records: records.length,
          week: teamGrid({ ...c, weeks: now ? [now] : [] }),
          // Same count as the crew chips below: everyone on staff who has this week's talk signed.
          thisWeek: { signed: now ? now.tally.on_time + now.tally.made_up : 0, expected: now ? now.tally.expected : 0 },
          periodWeeks: now?.weeks ?? 1,
          owed: needsMakeup(c, limit, today).length,
          expiringSoon: needsMakeup(c, limit, today).filter((o) => o.daysLeft <= 7).length,
          openIssues: issues.filter((i) => i.status === "open").length,
          overdueIssues: issues.filter((i) => i.status === "open" && i.due_date && i.due_date < isoDay(today)).length,
        });
      })
      .catch(() => { /* offline: Home works without the cards */ });
    return () => { live = false; };
  }, [co.id, co.makeup_weeks, co.program_start, input, version]);
  return st;
}

/** "This week: 7 of 9 signed", one chip per crew, and how many people owe a past week. */
export function WeekStatusCard({ st, isAdmin, onMakeup }: { st: Status; isAdmin: boolean; onMakeup?: () => void }) {
  if (st.thisWeek.expected === 0 && st.owed === 0 && st.openIssues === 0) return null;
  const name = (id: string | null) => (id ? st.teams.find((t) => t.id === id)?.name ?? "Former team" : "No team");
  const crews = st.week
    .map((g) => ({ name: name(g.teamId), t: g.weeks[0]?.tally }))
    .filter((c) => c.t && c.t.expected > 0)
    .sort((a, b) => (a.name === "No team" ? 1 : b.name === "No team" ? -1 : a.name.localeCompare(b.name)));
  return (
    <section className="mt-3 rounded-2xl bg-surface shadow-card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm text-muted">On staff who signed this {st.periodWeeks > 1 ? "talk period" : "week"}</p>
        <p className="tabular-nums text-muted"><b className="text-3xl font-semibold tracking-[-0.02em] text-fg">{st.thisWeek.signed}</b>/{st.thisWeek.expected}</p>
      </div>
      {crews.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {crews.map((c) => {
            const done = c.t!.on_time + c.t!.made_up >= c.t!.expected;
            return (
              <li key={c.name} className={`flex items-center gap-1 rounded-md border px-2.5 py-1 text-sm tabular-nums ${done ? "border-transparent bg-ok-bg text-ok-text" : "border-line"}`}>
                {done ? <span aria-hidden>✓</span> : null}
                <b>{c.name}</b> <span className={done ? "" : "text-muted"}>{c.t!.on_time + c.t!.made_up}/{c.t!.expected}</span>
                <span className="sr-only">{done ? "done" : "not done"}</span>
              </li>
            );
          })}
        </ul>
      )}
      {st.owed > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-sm">
          <span><b>{st.owed}</b> {st.periodWeeks > 1 ? (st.owed === 1 ? "missed talk needs" : "missed talks need") : st.owed === 1 ? "missed sign-in needs" : "missed sign-ins need"} a makeup{st.expiringSoon ? <b className="text-warn-text"> · {st.expiringSoon} run out within 7 days</b> : null}</span>
          <span className="flex gap-3">
            {onMakeup && <button className="min-h-11 font-semibold text-brand-text underline underline-offset-2" onClick={onMakeup}>Make up a talk</button>}
            {isAdmin && <Link href="/reports/" className="flex min-h-11 items-center font-semibold text-brand-text underline underline-offset-2">See who</Link>}
          </span>
        </div>
      )}
      {st.openIssues > 0 && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-sm">
          <span><b>{st.openIssues}</b> open {st.openIssues === 1 ? "issue" : "issues"} the team raised{st.overdueIssues ? <b className="text-warn-text"> · {st.overdueIssues} overdue</b> : null}</span>
          <Link href="/records/#issues" className="flex min-h-11 items-center font-semibold text-brand-text underline underline-offset-2">See issues</Link>
        </div>
      )}
    </section>
  );
}

/** Shown to admins until the company is set up and has given its first talk. */
export function GettingStarted({ st }: { st: Status }) {
  const steps = [
    { done: st.people > 0, label: "Add your people", href: "/admin/#people" },
    { done: st.teams.length > 0, label: "Make your teams", href: "/admin/#teams" },
    { done: st.hasJobsite, label: "Add a jobsite or your office", href: "/admin/#jobsites" },
    { done: st.records > 0, label: "Give your first talk", href: "/talk/" },
  ];
  const left = steps.filter((x) => !x.done).length;
  if (left === 0) return null;
  // Below the week card, so Start stays near the top. Finished steps fold into the count.
  return (
    <section className="mt-3 rounded-2xl bg-surface shadow-card p-4 ring-2 ring-brand">
      <p className="text-sm font-semibold text-muted">Getting started · {steps.length - left} of {steps.length} done</p>
      <ol className="mt-2 flex flex-col">
        {steps.map((x, i) => (x.done ? null : (
          <li key={x.label}>
            <Link href={x.href} className="flex min-h-11 items-center gap-3 py-1">
              <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-line text-sm font-semibold">{i + 1}</span>
              <span className="font-semibold">{x.label}</span>
            </Link>
          </li>
        )))}
      </ol>
    </section>
  );
}
