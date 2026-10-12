"use client";

// Home's status cards: the hero ring and streak, where this week stands by team (plus who owes a makeup), and, for
// a new company, a getting-started checklist. Both reuse the report query layer and compliance math; nothing is counted twice.
import { useEffect, useState } from "react";
import Link from "next/link";
import { buildCompliance, needsMakeup, talkStreak, teamGrid } from "@/core/compliance";
import { periodKeys } from "@/core/makeup";
import type { PlanInput } from "@/core/plan";
import { addDays, isoDay, mondayOf, parseDay } from "@/core/weeks";
import { reportPeople, reportRecords } from "@/lib/data/reports";
import { listJobsites, listTeams } from "@/lib/data/company";
import type { Company, Team } from "@/lib/data/types";
import { listIssues } from "@/lib/data/issues";
import { listRecordedWeeks } from "@/lib/data/records";
import { listInvites, listMembers } from "@/lib/data/members";
import { listCerts } from "@/lib/data/certs";
import { setupDone, setupProgress, setupSteps } from "@/core/onboarding";

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
  streak: ReturnType<typeof talkStreak>;
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
    // The streak looks back up to a year (never before the program started).
    const yearKeys = start > isoDay(thisMonday) ? [] : periodKeys(input, [isoDay(addDays(thisMonday, -7 * 51)), start].sort().at(-1)!, today);
    const yearFrom = yearKeys.at(-1)?.key ?? isoDay(thisMonday);
    Promise.all([reportPeople(co.id), reportRecords(co.id, fromKey), listTeams(co.id), listJobsites(co.id), listIssues(co.id).catch(() => []), listRecordedWeeks(co.id, yearFrom)])
      .then(([people, records, teams, sites, issues, recorded]) => {
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
          streak: talkStreak(yearKeys, recorded),
        });
      })
      .catch(() => { /* offline: Home works without the cards */ });
    return () => { live = false; };
  }, [co.id, co.makeup_weeks, co.program_start, input, version]);
  return st;
}

/**
 * Home's hero (the "Momentum" look): a ring that closes as people sign this period's talk, and the streak of periods
 * in a row with a talk held. Same counts as the team chips below; a missed period shows red in the row of dots.
 */
export function MomentumHero({ st }: { st: Status }) {
  const { signed, expected } = st.thisWeek;
  const p = expected ? Math.min(1, signed / expected) : 0;
  const R = 50, C = 2 * Math.PI * R;
  const unit = st.periodWeeks > 1 ? "talk period" : "week";
  const left = Math.max(0, expected - signed);
  // Held weeks in Done green (amber means "needs attention" everywhere else); missed in red; this week dashed.
  const dotTone = { held: "bg-ok", now: "bg-ok", missed: "bg-warn", open: "border-2 border-dashed border-muted" } as const;
  const dotLabel = { held: "talk held", now: "talk held", missed: "missed", open: "this period, not held yet" } as const;
  return (
    <section aria-label={`This ${unit}`} className="mt-4 rounded-2xl bg-surface p-5 shadow-card">
      <div className="flex items-center gap-5">
        <div className="relative h-[124px] w-[124px] shrink-0">
          <svg viewBox="0 0 124 124" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="62" cy="62" r={R} fill="none" stroke="var(--line)" strokeWidth="12" />
            <defs><linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--ok) 70%, var(--caution))" }} /><stop offset="1" style={{ stopColor: "var(--ok)" }} /></linearGradient></defs>
            <circle cx="62" cy="62" r={R} fill="none" stroke="url(#ring-grad)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - p)} className="ring-fill" style={{ opacity: p ? 1 : 0 }} />
          </svg>
          <p className="absolute inset-0 flex flex-col items-center justify-center tabular-nums">
            <b className="font-display text-[34px] font-extrabold leading-none tracking-[-0.03em]">{signed}</b>
            <span className="text-sm text-muted">of {expected}</span>
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted">Signed this {unit}</p>
          <p className="mt-1 font-display text-[22px] font-bold leading-tight tracking-[-0.02em]">
            {expected === 0 ? "No one on staff yet" : left === 0 ? "Everyone signed" : `${left} still to sign`}
          </p>
          <p className="mt-3 text-sm font-semibold text-muted">Streak</p>
          <p className={`font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em] tabular-nums ${st.streak.count ? "text-ok-text" : ""}`}>
            {st.streak.count} {st.streak.count === 1 ? unit : `${unit}s`}
          </p>
          <p className="text-sm text-muted">in a row with a talk</p>
        </div>
      </div>
      {st.streak.recent.length > 1 && (
        <div className="mt-4 border-t border-line pt-3">
          <ol className="flex items-center gap-1.5" aria-label={`Last ${st.streak.recent.length} ${unit}s`}>
            {st.streak.recent.map((d) => (
              <li key={d.key} title={`${d.key}: ${dotLabel[d.state]}`} className={`h-3 flex-1 rounded-full ${dotTone[d.state]}`}>
                <span className="sr-only">{d.key}: {dotLabel[d.state]}</span>
              </li>
            ))}
          </ol>
          {st.streak.missedInYear > 0 && (
            <p className="mt-2 text-sm text-warn-text"><b>{st.streak.missedInYear}</b> {st.streak.missedInYear === 1 ? `${unit} with no talk` : `${unit}s with no talk`} in the last year</p>
          )}
        </div>
      )}
    </section>
  );
}

/** One chip per team for this period, and how many people owe a past week. The total is in the hero above. */
export function WeekStatusCard({ st, isAdmin, onMakeup }: { st: Status; isAdmin: boolean; onMakeup?: () => void }) {
  if (st.thisWeek.expected === 0 && st.owed === 0 && st.openIssues === 0) return null;
  const name = (id: string | null) => (id ? st.teams.find((t) => t.id === id)?.name ?? "Former team" : "No team");
  const crews = st.week
    .map((g) => ({ name: name(g.teamId), t: g.weeks[0]?.tally }))
    .filter((c) => c.t && c.t.expected > 0)
    .sort((a, b) => (a.name === "No team" ? 1 : b.name === "No team" ? -1 : a.name.localeCompare(b.name)));
  return (
    <section className="mt-3 rounded-2xl bg-surface shadow-card p-4">
      {crews.length > 0 && <p className="text-sm font-semibold text-muted">By team</p>}
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
/**
 * The getting-started checklist for owners and admins (steps and rules: src/core/onboarding.ts). Each step ticks
 * itself from what the company has. Gone once the required steps are done, or after "Hide this list" (this phone).
 * Below the week card, so Start stays near the top. Finished steps fold into the count.
 */
export function GettingStarted({ st, companyId, myUserId }: { st: Status; companyId: string; myUserId: string | null }) {
  const [extra, setExtra] = useState<{ helpers: number; certs: number } | null>(null);
  const [hidden, setHidden] = useState(() => { try { return localStorage.getItem(`tt-setup-hidden-${companyId}`) === "1"; } catch { return false; } });
  const basicsDone = st.people >= 2 && st.teams.length > 0 && st.hasJobsite && st.records > 0;
  useEffect(() => {
    if (hidden) return;
    let live = true;
    Promise.all([listMembers(companyId).catch(() => []), listInvites(companyId).catch(() => []), listCerts(companyId).catch(() => [])])
      .then(([m, i, c]) => live && setExtra({ helpers: m.filter((x) => x.user_id !== myUserId).length + i.length, certs: c.length }));
    return () => { live = false; };
  }, [companyId, myUserId, hidden]);
  if (hidden || (!extra && basicsDone)) return null;
  const steps = setupSteps({ people: st.people, teams: st.teams.length, jobsites: st.hasJobsite ? 1 : 0, talks: st.records, helpers: extra?.helpers ?? 0, certs: extra?.certs ?? 0 });
  if (setupDone(steps)) return null;
  const { done, total } = setupProgress(steps);
  const hide = () => { try { localStorage.setItem(`tt-setup-hidden-${companyId}`, "1"); } catch { /* private mode */ } setHidden(true); };
  return (
    <section aria-label="Getting started" className="mt-3 rounded-2xl bg-surface shadow-card p-4 ring-2 ring-brand">
      <p className="text-sm font-semibold text-muted">Getting started · {done} of {total} done</p>
      <ol className="mt-2 flex flex-col">
        {steps.map((x, i) => (x.done ? null : (
          <li key={x.id}>
            <Link href={x.href} className="flex min-h-11 items-start gap-3 py-1.5">
              <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-line text-sm font-semibold">{i + 1}</span>
              <span className="min-w-0"><span className="block font-semibold">{x.title}{x.optional && <small className="font-normal text-muted"> · optional</small>}</span>
                <small className="block text-muted">{x.why}</small></span>
            </Link>
          </li>
        )))}
      </ol>
      <button type="button" className="mt-1 text-sm font-semibold text-muted underline" onClick={hide}>Hide this list</button>
    </section>
  );
}
