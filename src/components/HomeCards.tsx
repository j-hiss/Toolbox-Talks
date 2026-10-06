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
import { cachedConditions, checkConditions, CONDITIONS_FRESH_MS, type ConditionsCheck } from "@/lib/weather";
import { conditionNotes, conditionsLoud, RAIN_LABEL, WIND_LABEL } from "@/core/conditions";
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
    <section className="mt-3 rounded-2xl bg-surface p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm text-muted">Signed this week</p>
        <p className="tabular-nums text-muted"><b className="font-display text-3xl font-medium tracking-tight text-fg">{st.thisWeek.signed}</b>/{st.thisWeek.expected}</p>
      </div>
      {crews.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {crews.map((c) => {
            const done = c.t!.on_time + c.t!.made_up >= c.t!.expected;
            return (
              <li key={c.name} className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm tabular-nums ${done ? "border-transparent bg-ok-bg text-ok-text" : "border-line"}`}>
                {done ? <span aria-hidden>✓</span> : null}
                <b>{c.name}</b> <span className={done ? "" : "text-muted"}>{c.t!.on_time}/{c.t!.expected}</span>
                <span className="sr-only">{done ? "done" : "not done"}</span>
              </li>
            );
          })}
        </ul>
      )}
      {st.owed > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-sm">
          <span><b>{st.owed}</b> {st.owed === 1 ? "person-week needs" : "person-weeks need"} a makeup{st.expiringSoon ? <b className="text-warn-text"> · {st.expiringSoon} run out within 7 days</b> : null}</span>
          <span className="flex gap-3">
            <button className="min-h-11 font-semibold text-brand-text underline underline-offset-2" onClick={onMakeup}>Give a makeup</button>
            {isAdmin && <Link href="/reports/" className="flex min-h-11 items-center font-semibold text-brand-text underline underline-offset-2">See who</Link>}
          </span>
        </div>
      )}
      {st.openIssues > 0 && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-sm">
          <span><b>{st.openIssues}</b> open {st.openIssues === 1 ? "issue" : "issues"} the crew raised{st.overdueIssues ? <b className="text-warn-text"> · {st.overdueIssues} overdue</b> : null}</span>
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
    { done: st.teams.length > 0, label: "Make your crews", href: "/admin/#teams" },
    { done: st.hasJobsite, label: "Add a jobsite or your office", href: "/admin/#jobsites" },
    { done: st.records > 0, label: "Give your first talk", href: "/talk/" },
  ];
  const left = steps.filter((x) => !x.done).length;
  if (left === 0) return null;
  return (
    <section className="mt-4 rounded-2xl bg-surface p-4 ring-2 ring-brand">
      <p className="font-display text-sm font-semibold text-muted">Getting started · {steps.length - left} of {steps.length}</p>
      <ol className="mt-2 flex flex-col">
        {steps.map((x, i) => (
          <li key={x.label}>
            <Link href={x.href} className="flex min-h-11 items-center gap-3 py-1">
              <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${x.done ? "bg-ok text-ok-ink" : "border-2 border-line"}`}>
                {x.done ? "✓" : i + 1}
              </span>
              <span className={x.done ? "text-muted line-through" : "font-semibold"}>{x.label}</span>
              <span className="sr-only">{x.done ? "(done)" : ""}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * Live jobsite weather for the chosen place (or this phone's location): heat, rain, wind, thunder and the weather
 * service's active alerts for the rest of the work day (tomorrow's after hours). Refreshes every 15 minutes while
 * the app is open, when it comes back to the screen, and when signal returns. Shows the last check when offline.
 */
export function WeatherCard({ site }: { site: Jobsite | null }) {
  const sitePoint = site?.latitude != null && site.longitude != null ? { latitude: site.latitude, longitude: site.longitude } : null;
  const [herePoint, setHerePoint] = useState<{ latitude: number; longitude: number } | null>(null);
  const point = sitePoint ?? herePoint;
  const [c, setC] = useState<ConditionsCheck | null | undefined>(() => (sitePoint ? cachedConditions(sitePoint) ?? undefined : undefined));
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now()); // ticks each minute so "Last checked" stays honest
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60_000); return () => clearInterval(t); }, []);

  useEffect(() => {
    if (!point) return;
    let live = true;
    const run = (force = false) => {
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
      setBusy(true);
      checkConditions(point, force)
        .then((x) => { if (live) { setC(x); setMsg(null); } })
        .catch((e) => { if (live) setMsg(e instanceof Error ? e.message : String(e)); })
        .finally(() => live && setBusy(false));
    };
    run();
    const timer = setInterval(() => run(), CONDITIONS_FRESH_MS);
    const onVisible = () => { if (document.visibilityState === "visible") run(); };
    const onOnline = () => run();
    const onRefresh = () => run(true);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);
    window.addEventListener("tt-weather-refresh", onRefresh);
    return () => {
      live = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("tt-weather-refresh", onRefresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point?.latitude, point?.longitude]);

  const here = async () => {
    setBusy(true); setMsg(null);
    try { setHerePoint(await getLocation(10_000)); }
    catch (e) { setMsg(e instanceof LocationError || e instanceof Error ? e.message : String(e)); setBusy(false); }
  };

  if (!point) {
    return (
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-muted">{msg ?? "Jobsite weather needs a jobsite with GPS, or your location."}</span>
        <button className="min-h-11 font-semibold text-brand-text underline underline-offset-2" onClick={here} disabled={busy}>{busy ? "Checking…" : "Check the weather here"}</button>
      </div>
    );
  }
  if (c === undefined) return msg ? <p className="mt-3 text-sm text-muted">Jobsite weather unavailable: {msg}</p> : <div className="skeleton mt-3 h-28 rounded-xl" aria-label="Checking the weather" />;
  if (c === null) return null;

  const heatLoud = !!c.heat && alertWorthy(c.heat.level);
  const tone = conditionsLoud(c, heatLoud);
  const notes = conditionNotes(c);
  const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const hourOf = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric" });
  const old = now - new Date(c.checkedAt).getTime() > 2 * CONDITIONS_FRESH_MS;
  const sub = tone === "alert" || tone === "caution" ? "opacity-80" : "text-muted";

  return (
    <section
      className={`mt-3 rounded-2xl p-4 text-sm ${tone === "alert" ? "bg-warn-bg" : tone === "caution" ? "bg-caution-bg text-caution-text" : "bg-surface"}`}
      role={tone ? "alert" : "status"}
      aria-label="Jobsite weather"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold">{c.day === "tomorrow" ? "Tomorrow's work day" : "Jobsite weather"}<span className={`font-normal ${sub}`}>{c.place ? ` · ${c.place}` : ""}</span></p>
        <button
          className={`flex min-h-9 shrink-0 items-center gap-1 rounded-md px-1.5 text-xs ${sub}`}
          onClick={() => window.dispatchEvent(new Event("tt-weather-refresh"))}
          disabled={busy}
          aria-label="Refresh the weather"
        >
          {busy ? "Updating…" : `${old ? "Last checked" : "Updated"} ${time(c.checkedAt)}`}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" /></svg>
        </button>
      </div>

      {c.alerts.map((a) => (
        <p key={a.event} className={`mt-2 rounded-lg px-3 py-2 font-semibold ${a.loud ? "bg-warn text-warn-ink" : "bg-surface/70"}`}>
          {a.loud ? "⚠ " : ""}{a.event}{a.ends ? ` until ${time(a.ends)}` : ""}
        </p>
      ))}

      {c.now && (
        <p className={`mt-1 ${sub}`}>
          Now {c.now.tempF}°F · {c.now.shortForecast}{c.now.windMph != null ? ` · wind ${c.now.windMph} mph ${c.now.windDirection}` : ""}
        </p>
      )}

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Tile label="Heat index" value={c.heat ? `${c.heat.maxHeatIndexF}°` : "–"} note={c.heat ? HEAT_LABEL[c.heat.level] : "No reading"} />
        <Tile label="Rain" value={c.rain ? `${c.rain.maxPct}%` : "–"} note={c.rain && c.rain.maxPct >= 30 ? `around ${hourOf(c.rain.atHour)}` : c.rain ? RAIN_LABEL[c.rain.level] : "No reading"} />
        <Tile label="Wind" value={c.wind ? `${c.wind.maxMph}` : "–"} unit="mph" note={c.wind ? `${WIND_LABEL[c.wind.level]}${c.wind.direction ? ` · ${c.wind.direction}` : ""}` : "No reading"} />
      </div>

      {c.thunderAt && <p className="mt-3 font-semibold">⚡ Thunderstorms possible from about {hourOf(c.thunderAt)}</p>}
      {(notes.length > 0 || heatLoud) && (
        <ul className={`mt-2 flex flex-col gap-1 ${c.thunderAt ? "" : "mt-3"}`}>
          {notes.map((n) => <li key={n}>{n}</li>)}
          {heatLoud && c.day === "today" && <li>The heat reminder is added to today&apos;s talks.</li>}
        </ul>
      )}
      <p className={`mt-3 text-xs ${sub}`}>
        Forecast and alerts from the National Weather Service. Information for the crew; the crew lead decides.
        {c.alertsUnavailable ? " Alerts couldn't be checked just now." : ""}
        {msg && old ? ` Couldn't update: ${msg}` : ""}
      </p>
    </section>
  );
}

function Tile({ label, value, unit, note }: { label: string; value: string; unit?: string; note: string }) {
  return (
    <div className="rounded-xl bg-surface/80 px-3 py-2 text-fg">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-display text-2xl font-medium tracking-tight tabular-nums">{value}{unit && value !== "–" ? <span className="text-sm text-muted"> {unit}</span> : null}</p>
      <p className="truncate text-xs text-muted">{note}</p>
    </div>
  );
}
