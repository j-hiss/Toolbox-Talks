"use client";

// Live jobsite weather on Home, styled like a weather app: an animated sky that matches the forecast (sun, drifting
// clouds, rain, lightning, fog, stars at night), the temperature, then hour by hour for the rest of the work day.
// Numbers and judgments come from src/core/conditions.ts; this file only draws them. Motion stops for people who
// ask for reduced motion.
import { useEffect, useState } from "react";
import type { Jobsite } from "@/lib/data/types";
import { alertWorthy, HEAT_LABEL } from "@/core/heat";
import { attention, conditionNotes, daySummary, RAIN_LABEL, siteHour, WIND_LABEL, type Attention } from "@/core/conditions";
import { skyPhase, sunTimes, type SkyPhase } from "@/core/sun";
import type { WorkSetting } from "@/core/worksetting";
import { HEAT_REF, weatherNote, type Ref } from "@/content/weather-notes";
import { cachedConditions, checkConditions, CONDITIONS_FRESH_MS, type ConditionsCheck } from "@/lib/weather";
import { getLocation, LocationError } from "@/lib/location";
import { RadarMap, type MapArea } from "./RadarMap";
import { Sky, SKY_WORDS, SkyIconDefs, skyBackground } from "./weather/Sky";
import { HourStrip } from "./weather/HourStrip";

export function WeatherCard({ site, setting = "outdoor" }: { site: Jobsite | null; setting?: WorkSetting }) {
  const sitePoint = site?.latitude != null && site.longitude != null ? { latitude: site.latitude, longitude: site.longitude } : null;
  const [herePoint, setHerePoint] = useState<{ latitude: number; longitude: number } | null>(null);
  const point = sitePoint ?? herePoint;
  const [c, setC] = useState<ConditionsCheck | null | undefined>(() => (sitePoint ? cachedConditions(sitePoint) ?? undefined : undefined));
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now()); // ticks each minute so "Last checked" stays honest
  const [full, setFull] = useState(false);
  // Radar opens on a tap (it loads map pictures); once opened, this phone keeps it open.
  const [radar, setRadar] = useState(() => { try { return localStorage.getItem("tt-radar-open") === "1"; } catch { return false; } });
  const toggleRadar = () => setRadar((v) => { try { localStorage.setItem("tt-radar-open", v ? "0" : "1"); } catch { /* fine */ } return !v; });
  // Hour by hour opens and closes the same way; the day's sentence above it stays.
  const [hourly, setHourly] = useState(() => { try { return localStorage.getItem("tt-hourly-open") === "1"; } catch { return false; } });
  const toggleHourly = () => setHourly((v) => { try { localStorage.setItem("tt-hourly-open", v ? "0" : "1"); } catch { /* fine */ } return !v; });
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60_000); return () => clearInterval(t); }, []);

  // Live: every 15 minutes, when the app comes back on screen, when signal returns, and on tap.
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
  if (c === undefined) return msg ? <p className="mt-3 text-sm text-muted">Jobsite weather unavailable: {msg}</p> : <div className="skeleton mt-3 h-56 rounded-2xl" aria-label="Checking the weather" />;
  if (c === null) return null;

  const ctx = weatherView(c, point, now);
  const refresh = () => window.dispatchEvent(new Event("tt-weather-refresh"));

  return (
    <>
      <SkyIconDefs />
      <section
        className={`mt-3 overflow-hidden rounded-2xl bg-surface ${ctx.heads?.level === "alert" ? "wx-ring-alert" : ctx.heads?.level === "caution" ? "wx-ring-caution" : ""}`}
        aria-label="Jobsite weather"
      >
        <Hero c={c} ctx={ctx} busy={busy} old={ctx.old} onRefresh={refresh} onOpen={() => setFull(true)} />
        <AlertBanners c={c} />
        <Summary text={ctx.summary} divider={false} />
        <Toggle open={hourly} onClick={toggleHourly} label="hourly" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>} />
        {hourly && <HourStrip hours={c.hours} sun={ctx.sun} firstIsNow={c.day === "today"} />}

        <Toggle open={radar} onClick={toggleRadar} label="radar"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><path d="M12 12 18.5 5.5" /></svg>}
          chip={ctx.areas.length > 0 && !radar ? "Warning area" : null} />
        {radar && <RadarMap latitude={point.latitude} longitude={point.longitude} areas={ctx.areas} />}

        <Stats c={c} />
        <Notes c={c} setting={setting} />
        <div className="flex items-center justify-between gap-3 px-4 pb-3">
          <p className="text-xs text-muted">
            Forecast and alerts from the National Weather Service. Information for the team; the team lead decides.
            {c.alertsUnavailable ? " Alerts couldn't be checked just now." : ""}
            {msg && ctx.old ? ` Couldn't update: ${msg}` : ""}
          </p>
          <button className="shrink-0 rounded-full bg-brand-soft px-3 py-2 text-xs font-semibold text-brand-text" onClick={() => setFull(true)}>Full forecast</button>
        </div>
      </section>
      {full && <WeatherFull c={c} ctx={ctx} point={point} setting={setting} busy={busy} onRefresh={refresh} onClose={() => setFull(false)} />}
    </>
  );
}

// --- Shared pieces (card and full screen) -------------------------------------------------------------------

type View = {
  phase: SkyPhase;
  sun: { sunrise: Date; sunset: Date } | null;
  heads: Attention | null;
  pill: Attention | null;
  summary: string;
  areas: MapArea[];
  old: boolean;
  heatDanger: boolean;
};

/** Everything the screens need that's worked out from the forecast, the place and the time. */
function weatherView(c: ConditionsCheck, point: { latitude: number; longitude: number }, now: number): View {
  const [y, m, d] = c.dayKey.split("-").map(Number);
  const sun = sunTimes(y, m, d, point.latitude, point.longitude);
  const phase: SkyPhase = c.day === "tomorrow" ? "day" : skyPhase(new Date(now), sun);
  const heads = attention(c);
  return {
    phase, sun, heads,
    // A weather service warning has its own red banner under the sky; the pill is for the app's own calls.
    pill: heads && !c.alerts.some((a) => a.loud && a.event === heads.reason) ? heads : null,
    summary: daySummary(c),
    areas: c.alerts.filter((a) => a.areas?.length).map((a) => ({ event: a.event, rings: a.areas, loud: a.loud })),
    old: now - new Date(c.checkedAt).getTime() > 2 * CONDITIONS_FRESH_MS,
    heatDanger: c.heat?.level === "danger" || c.heat?.level === "extreme_danger",
  };
}

const clock = (iso: string | Date) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function Hero({ c, ctx, busy, old, onRefresh, onOpen, tall }: { c: ConditionsCheck; ctx: View; busy: boolean; old: boolean; onRefresh: () => void; onOpen?: () => void; tall?: boolean }) {
  const head = c.headline;
  const open = head.sky === "clear" || head.sky === "partly";
  return (
    <div className={`relative overflow-hidden text-white ${tall ? "h-80" : ctx.pill ? "h-60" : "h-52"}`} style={{ background: skyBackground(head.sky, ctx.phase) }}>
      <Sky kind={head.sky} phase={ctx.phase} wind={c.wind?.level ?? "calm"} heatDanger={ctx.heatDanger && ctx.phase !== "night" && open} />
      {/* A soft shade on the left keeps the temperature readable while clouds pass behind it */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent" aria-hidden />
      {onOpen && <button className="absolute inset-0" onClick={onOpen} aria-label="Open the full forecast" />}
      <div className="pointer-events-none relative flex h-full flex-col justify-between p-4 [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium">{c.day === "tomorrow" ? "Tomorrow" : "Now"}{c.place ? ` in ${c.place}` : ""}</p>
            {ctx.pill && (
              <p
                role="alert"
                className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold [text-shadow:none] ${ctx.pill.level === "alert" ? "bg-warn text-warn-ink" : "bg-caution text-[#2B2000]"}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden><path d="M12 3 2 21h20L12 3z" fill="currentColor" /><path d="M12 10v5M12 17.5v.5" stroke={ctx.pill.level === "alert" ? "var(--warn)" : "var(--caution)"} strokeWidth="2.4" strokeLinecap="round" /></svg>
                {ctx.pill.reason}
              </p>
            )}
          </div>
          <button
            className="pointer-events-auto flex min-h-9 shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 text-xs backdrop-blur-sm"
            onClick={onRefresh}
            disabled={busy}
            aria-label="Refresh the weather"
          >
            {busy ? "Updating…" : `${old ? "Last checked" : "Updated"} ${clock(c.checkedAt)}`}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden className={busy ? "wx-spin-fast" : ""}><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" /></svg>
          </button>
        </div>
        <div>
          <p className={`font-medium leading-none tracking-tight tabular-nums ${tall ? "text-[84px]" : "text-[64px]"}`}>{head.tempF != null ? `${head.tempF}°` : "–"}</p>
          <p className="mt-1 text-[15px] font-medium">{head.label || SKY_WORDS[head.sky]}</p>
          <p className="text-sm opacity-85">
            {head.highF != null && head.lowF != null ? `${c.day === "tomorrow" ? "Work day" : "Rest of the work day"}: high ${head.highF}°, low ${head.lowF}°` : ""}
            {tall && ctx.sun ? ` · Sunrise ${clock(ctx.sun.sunrise)}, sunset ${clock(ctx.sun.sunset)}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function AlertBanners({ c, detail }: { c: ConditionsCheck; detail?: boolean }) {
  return (
    <>
      {c.alerts.map((a) => (
        <div key={a.event} className={`px-4 py-2.5 text-sm ${a.loud ? "bg-warn text-warn-ink" : "bg-caution-bg text-caution-text"}`} role={a.loud ? "alert" : undefined}>
          <p className="font-semibold">{a.loud ? "⚠ " : ""}{a.event}{a.ends ? ` until ${clock(a.ends)}` : ""}</p>
          {detail && a.instruction && <p className="mt-1 opacity-90">{a.instruction}</p>}
        </div>
      ))}
    </>
  );
}

function Summary({ text, divider = true }: { text: string; divider?: boolean }) {
  if (!text) return null;
  return (
    <p className={`flex gap-2.5 ${divider ? "border-b border-line" : ""} px-4 py-3 text-[15px] leading-snug font-medium`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className="mt-0.5 shrink-0 text-brand-text"><path d="M4 6h16M4 12h10M4 18h13" /></svg>
      {text}
    </p>
  );
}

function Stats({ c }: { c: ConditionsCheck }) {
  const heatLoud = !!c.heat && alertWorthy(c.heat.level);
  const windy = c.wind?.level === "windy" || c.wind?.level === "high";
  return (
    <dl className="grid grid-cols-3 border-t border-line text-sm">
      <Stat label="Heat index" value={c.heat ? `${c.heat.maxHeatIndexF}°` : "–"} note={c.heat ? HEAT_LABEL[c.heat.level] : "No reading"} hot={heatLoud} />
      <Stat label="Rain" value={c.rain ? `${c.rain.maxPct}%` : "–"} note={c.rain && c.rain.maxPct >= 30 ? `around ${siteHour(c.rain.atHour)}` : c.rain ? RAIN_LABEL[c.rain.level] : "No reading"} />
      <Stat label="Wind" value={c.wind ? `${c.wind.maxMph} mph` : "–"} note={c.wind ? `${WIND_LABEL[c.wind.level]}${c.wind.direction ? `, ${c.wind.direction}` : ""}` : "No reading"} hot={windy} />
    </dl>
  );
}

function Notes({ c, setting }: { c: ConditionsCheck; setting: WorkSetting }) {
  const heatLoud = !!c.heat && alertWorthy(c.heat.level);
  const notes = conditionNotes(c).map((k) => ({ key: k, ...weatherNote(setting, k) }));
  if (!c.thunderAt && !notes.length && !heatLoud) return null;
  return (
    <div className="mx-3 mb-3 rounded-xl bg-caution-bg px-3.5 py-3 text-sm text-caution-text" role="alert">
      {c.thunderAt && <p className="font-semibold">Thunderstorms possible from about {siteHour(c.thunderAt)}</p>}
      <ul className="mt-1 flex flex-col gap-2">
        {notes.map((n) => <li key={n.key}>{n.text}<Refs refs={n.refs} /></li>)}
        {heatLoud && c.day === "today" && <li>The heat reminder is added to today&apos;s talks.<Refs refs={[HEAT_REF]} /></li>}
      </ul>
    </div>
  );
}

/** Where a note comes from, so a crew lead can read the OSHA source. */
function Refs({ refs }: { refs: Ref[] }) {
  return (
    <span className="mt-0.5 flex flex-wrap gap-x-2 text-[11px] opacity-75">
      {refs.map((r) => <a key={r.label} href={r.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{r.label}</a>)}
    </span>
  );
}

function Stat({ label, value, note, hot }: { label: string; value: string; note: string; hot?: boolean }) {
  return (
    <div className="border-r border-line px-3 py-2.5 last:border-r-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`text-xl font-medium tracking-tight tabular-nums ${hot ? "text-caution-text" : ""}`}>{value}</dd>
      <dd className="truncate text-xs text-muted">{note}</dd>
    </div>
  );
}

// --- Full screen ---------------------------------------------------------------------------------------------

/** A row that opens and closes a section of the card (hour by hour, radar). */
function Toggle({ open, onClick, label, icon, chip }: { open: boolean; onClick: () => void; label: string; icon: React.ReactNode; chip?: string | null }) {
  return (
    <button
      className="flex min-h-11 w-full items-center justify-between border-t border-line px-4 text-sm font-semibold text-brand-text focus:outline-none focus-visible:bg-brand-soft"
      onClick={onClick}
      aria-expanded={open}
    >
      <span className="flex items-center gap-2">
        {icon}
        {open ? `Hide ${label}` : `Show ${label}`}{chip ? <span className="rounded-full bg-warn px-2 py-0.5 text-[11px] text-warn-ink">{chip}</span> : null}
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
    </button>
  );
}

/** The whole forecast on one screen: bigger sky, warnings with what to do, hours, radar, sunrise and sunset. */
function WeatherFull({ c, ctx, point, setting, busy, onRefresh, onClose }: { c: ConditionsCheck; ctx: View; point: { latitude: number; longitude: number }; setting: WorkSetting; busy: boolean; onRefresh: () => void; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);
  const daylight = ctx.sun ? Math.round((ctx.sun.sunset.getTime() - ctx.sun.sunrise.getTime()) / 60_000) : null;
  return (
    <div className="sheet-in fixed inset-0 z-50 overflow-y-auto bg-bg pt-[env(safe-area-inset-top,0px)] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]" role="dialog" aria-modal="true" aria-label="Full forecast">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-bg/90 px-4 py-3 backdrop-blur">
        <button className="flex min-h-10 items-center gap-1.5 rounded-full bg-surface px-3.5 text-sm font-semibold ring-1 ring-line" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M15 6l-6 6 6 6" /></svg>
          Back
        </button>
        <p className="truncate text-sm font-semibold">{c.place || "Jobsite weather"}</p>
      </div>
      <div className={`mx-auto max-w-xl px-4 ${ctx.heads?.level === "alert" ? "" : ""}`}>
        <div className={`overflow-hidden rounded-2xl bg-surface ${ctx.heads?.level === "alert" ? "wx-ring-alert" : ctx.heads?.level === "caution" ? "wx-ring-caution" : ""}`}>
          <Hero c={c} ctx={ctx} busy={busy} old={ctx.old} onRefresh={onRefresh} tall />
          <AlertBanners c={c} detail />
          <Summary text={ctx.summary} />
          <HourStrip hours={c.hours} sun={ctx.sun} firstIsNow={c.day === "today"} />
        </div>

        <h2 className="mt-6 mb-2 px-1 text-base font-semibold">Radar</h2>
        <div className="overflow-hidden rounded-2xl bg-surface pt-3">
          <RadarMap latitude={point.latitude} longitude={point.longitude} height={340} areas={ctx.areas} />
        </div>

        <h2 className="mt-6 mb-2 px-1 text-base font-semibold">The work day</h2>
        <div className="overflow-hidden rounded-2xl bg-surface">
          <Stats c={c} />
          {ctx.sun && (
            <div className="grid grid-cols-3 border-t border-line text-sm">
              <div className="border-r border-line px-3 py-2.5"><p className="text-xs text-muted">Sunrise</p><p className="text-xl font-medium tabular-nums">{clock(ctx.sun.sunrise)}</p></div>
              <div className="border-r border-line px-3 py-2.5"><p className="text-xs text-muted">Sunset</p><p className="text-xl font-medium tabular-nums">{clock(ctx.sun.sunset)}</p></div>
              <div className="px-3 py-2.5"><p className="text-xs text-muted">Daylight</p><p className="text-xl font-medium tabular-nums">{daylight != null ? `${Math.floor(daylight / 60)}h ${daylight % 60}m` : "–"}</p></div>
            </div>
          )}
          <div className="pt-3"><Notes c={c} setting={setting} /></div>
        </div>
        <p className="mt-3 px-1 text-xs text-muted">Forecast and alerts from the National Weather Service. Information for the team; the team lead decides.</p>
      </div>
    </div>
  );
}
