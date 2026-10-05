"use client";

// Home's two status cards: where this week stands by crew (plus who owes a makeup), and, for a new company,
// a getting-started checklist. Both reuse the report query layer and compliance math; nothing is counted twice.
import { useEffect, useState } from "react";
import Link from "next/link";
import { buildCompliance, needsMakeup, teamGrid, weekKeys } from "@/core/compliance";
import { addDays, isoDay, mondayOf, parseDay } from "@/core/weeks";
import { reportPeople, reportRecords } from "@/lib/data/reports";
import { listJobsites, listTeams } from "@/lib/data/company";
import type { Company, Jobsite, Team } from "@/lib/data/types";
import { alertWorthy, HEAT_LABEL } from "@/core/heat";
import { checkHeat, type HeatCheck } from "@/lib/weather";
import { getLocation, LocationError } from "@/lib/location";
import { listIssues } from "@/lib/data/issues";

type Status = {
  teams: Team[];
  hasJobsite: boolean;
  people: number;
  records: number;
  week: ReturnType<typeof teamGrid>;
  thisWeek: { signed: number; expected: number };
  owed: number;
  expiringSoon: number;           // makeups whose deadline is within 7 days
  openIssues: number;
  overdueIssues: number;
};

export function useHomeStatus(co: Company, version = 0): Status | null {
  const [st, setSt] = useState<Status | null>(null);
  useEffect(() => {
    let live = true;
    const today = new Date();
    const thisMonday = mondayOf(today);
    const limit = co.makeup_weeks ?? 4;
    const start = isoDay(mondayOf(parseDay(co.program_start)));
    const fromKey = [isoDay(addDays(thisMonday, -7 * limit)), start].sort().at(-1)!;
    Promise.all([reportPeople(co.id), reportRecords(co.id, fromKey), listTeams(co.id), listJobsites(co.id), listIssues(co.id).catch(() => [])])
      .then(([people, records, teams, sites, issues]) => {
        if (!live) return;
        const keys = start > isoDay(thisMonday) ? [] : weekKeys(fromKey, today);
        const c = buildCompliance({ people, records, weeks: keys, makeupWeeks: limit, today });
        const now = c.weeks.find((w) => w.key === isoDay(thisMonday));
        setSt({
          teams,
          hasJobsite: sites.length > 0,
          people: people.filter((p) => !p.deactivatedAt).length,
          records: records.length,
          week: teamGrid({ ...c, weeks: now ? [now] : [] }),
          thisWeek: { signed: now ? now.tally.on_time : 0, expected: now ? now.tally.expected : 0 },
          owed: needsMakeup(c, limit, today).length,
          expiringSoon: needsMakeup(c, limit, today).filter((o) => o.daysLeft <= 7).length,
          openIssues: issues.filter((i) => i.status === "open").length,
          overdueIssues: issues.filter((i) => i.status === "open" && i.due_date && i.due_date < isoDay(today)).length,
        });
      })
      .catch(() => { /* offline: Home works without the cards */ });
    return () => { live = false; };
  }, [co.id, co.makeup_weeks, co.program_start, version]);
  return st;
}

/** "This week: 7 of 9 signed", one chip per crew, and how many people owe a past week. */
export function WeekStatusCard({ st, isAdmin, onMakeup }: { st: Status; isAdmin: boolean; onMakeup: () => void }) {
  if (st.thisWeek.expected === 0 && st.owed === 0 && st.openIssues === 0) return null;
  const name = (id: string | null) => (id ? st.teams.find((t) => t.id === id)?.name ?? "Former team" : "No team");
  const crews = st.week
    .map((g) => ({ name: name(g.teamId), t: g.weeks[0]?.tally }))
    .filter((c) => c.t && c.t.expected > 0)
    .sort((a, b) => (a.name === "No team" ? 1 : b.name === "No team" ? -1 : a.name.localeCompare(b.name)));
  return (
    <section className="mt-4 rounded-lg border border-line bg-surface p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-muted">This week so far</p>
        <p className="tabular-nums"><b className="text-lg">{st.thisWeek.signed}</b> of {st.thisWeek.expected} signed</p>
      </div>
      {crews.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {crews.map((c) => {
            const done = c.t!.on_time + c.t!.made_up >= c.t!.expected;
            return (
              <li key={c.name} className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm tabular-nums ${done ? "border-ok" : "border-line"}`}>
                {done ? <span aria-hidden className="text-ok">✓</span> : null}
                <b>{c.name}</b> <span className="text-muted">{c.t!.on_time}/{c.t!.expected}</span>
                <span className="sr-only">{done ? "done" : "not done"}</span>
              </li>
            );
          })}
        </ul>
      )}
      {st.owed > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-sm">
          <span><b>{st.owed}</b> {st.owed === 1 ? "person-week needs" : "person-weeks need"} a makeup{st.expiringSoon ? <b className="text-warn"> · {st.expiringSoon} run out within 7 days</b> : null}</span>
          <span className="flex gap-3">
            <button className="min-h-11 font-bold underline" onClick={onMakeup}>Give a makeup</button>
            {isAdmin && <Link href="/reports/" className="flex min-h-11 items-center font-bold underline">See who</Link>}
          </span>
        </div>
      )}
      {st.openIssues > 0 && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-sm">
          <span><b>{st.openIssues}</b> open {st.openIssues === 1 ? "issue" : "issues"} the crew raised{st.overdueIssues ? <b className="text-warn"> · {st.overdueIssues} overdue</b> : null}</span>
          <Link href="/records/#issues" className="flex min-h-11 items-center font-bold underline">See issues</Link>
        </div>
      )}
    </section>
  );
}

/** Shown to admins until the company is set up and has given its first talk. */
export function GettingStarted({ st }: { st: Status }) {
  const steps = [
    { done: st.people > 0, label: "Add your people", href: "/admin/#people" },
    { done: st.teams.length > 0, label: "Make your crews", href: "/admin/#teams" },
    { done: st.hasJobsite, label: "Add a jobsite or your office", href: "/admin/#jobsites" },
    { done: st.records > 0, label: "Give your first talk", href: "/talk/" },
  ];
  const left = steps.filter((x) => !x.done).length;
  if (left === 0) return null;
  return (
    <section className="mt-4 rounded-lg border-2 border-hivis bg-surface p-4">
      <p className="font-display text-sm font-bold uppercase tracking-widest text-muted">Getting started · {steps.length - left} of {steps.length}</p>
      <ol className="mt-2 flex flex-col">
        {steps.map((x, i) => (
          <li key={x.label}>
            <Link href={x.href} className="flex min-h-11 items-center gap-3 py-1">
              <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${x.done ? "bg-ok text-white" : "border-2 border-line"}`}>
                {x.done ? "✓" : i + 1}
              </span>
              <span className={x.done ? "text-muted line-through" : "font-bold"}>{x.label}</span>
              <span className="sr-only">{x.done ? "(done)" : ""}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Today's heat for the chosen place (or this phone's location). Loud only from "extreme caution" up. */
export function HeatCard({ site }: { site: Jobsite | null }) {
  const [h, setH] = useState<HeatCheck | null | undefined>(undefined);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const point = site?.latitude != null && site.longitude != null ? { latitude: site.latitude, longitude: site.longitude } : null;

  useEffect(() => {
    if (!point) return;
    let live = true;
    checkHeat(point).then((x) => live && setH(x)).catch((e) => live && setMsg(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point?.latitude, point?.longitude]);

  const here = async () => {
    setBusy(true); setMsg(null);
    try { setH(await checkHeat(await getLocation(10_000))); }
    catch (e) { setMsg(e instanceof LocationError || e instanceof Error ? e.message : String(e)); }
    setBusy(false);
  };

  if (!point && h === undefined) {
    return (
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-muted">{msg ?? "Heat check needs a jobsite with GPS, or your location."}</span>
        <button className="min-h-11 font-bold underline" onClick={here} disabled={busy}>{busy ? "Checking…" : "Check today's heat here"}</button>
      </div>
    );
  }
  if (h === undefined) return msg ? <p className="mt-3 text-sm text-muted">Heat check unavailable: {msg}</p> : null;
  if (h === null) return null;
  const loud = alertWorthy(h.level);
  return (
    <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${loud ? "border-2 border-warn bg-warn-bg" : "border border-line bg-surface"}`} role={loud ? "alert" : "status"}>
      <b>{loud ? "⚠ " : ""}Heat index up to {h.maxHeatIndexF}°F today</b> · {HEAT_LABEL[h.level]}
      <span className="block text-muted">
        {h.place ? `${h.place} · ` : ""}{h.tempF}°F, {h.humidity}% humidity at the hottest hour{loud ? " · the heat reminder is added to today's talks" : ""}
      </span>
    </div>
  );
}
