"use client";

// Live jobsite weather on Home, styled like a weather app: an animated sky that matches the forecast (sun, drifting
// clouds, rain, lightning, fog, stars at night), the temperature, then hour by hour for the rest of the work day.
// Numbers and judgments come from src/core/conditions.ts; this file only draws them. Motion stops for people who
// ask for reduced motion.
import { useEffect, useState } from "react";
import type { Jobsite } from "@/lib/data/types";
import { alertWorthy, HEAT_LABEL } from "@/core/heat";
import { attention, conditionNotes, RAIN_LABEL, WIND_LABEL, windToward, type SkyKind, type WindLevel } from "@/core/conditions";
import { cachedConditions, checkConditions, CONDITIONS_FRESH_MS, type ConditionsCheck } from "@/lib/weather";
import { getLocation, LocationError } from "@/lib/location";
import { RadarMap } from "./RadarMap";

const SKY_BG: Record<SkyKind, [string, string, string, string]> = {
  // [day top, day bottom, night top, night bottom]
  clear: ["#2F7FD8", "#7DB8EE", "#0B1734", "#243B6B"],
  partly: ["#3D7CC4", "#93B7DA", "#13213F", "#33466E"],
  cloudy: ["#56657A", "#8F9BAC", "#1E2633", "#3D4859"],
  fog: ["#5F6B78", "#919BA6", "#2A323C", "#4E5864"],
  rain: ["#34465E", "#62748D", "#151D2B", "#2F3C52"],
  thunder: ["#1C2130", "#3B4258", "#141824", "#30364A"],
};
const SKY_WORDS: Record<SkyKind, string> = { clear: "Clear", partly: "Partly cloudy", cloudy: "Cloudy", fog: "Fog", rain: "Rain", thunder: "Thunderstorms" };

export function WeatherCard({ site }: { site: Jobsite | null }) {
  const sitePoint = site?.latitude != null && site.longitude != null ? { latitude: site.latitude, longitude: site.longitude } : null;
  const [herePoint, setHerePoint] = useState<{ latitude: number; longitude: number } | null>(null);
  const point = sitePoint ?? herePoint;
  const [c, setC] = useState<ConditionsCheck | null | undefined>(() => (sitePoint ? cachedConditions(sitePoint) ?? undefined : undefined));
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now()); // ticks each minute so "Last checked" stays honest
  // Radar opens on a tap (it loads map pictures); once opened, this phone keeps it open.
  const [radar, setRadar] = useState(() => { try { return localStorage.getItem("tt-radar-open") === "1"; } catch { return false; } });
  const toggleRadar = () => setRadar((v) => { try { localStorage.setItem("tt-radar-open", v ? "0" : "1"); } catch { /* fine */ } return !v; });
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

  const hours = c.hours;
  const head = c.headline;
  const heatLoud = !!c.heat && alertWorthy(c.heat.level);
  const notes = conditionNotes(c);
  const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const hourOf = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric" });
  const old = now - new Date(c.checkedAt).getTime() > 2 * CONDITIONS_FRESH_MS;
  const windy = c.wind?.level === "windy" || c.wind?.level === "high"; // stat highlight
  const [d1, d2, n1, n2] = SKY_BG[head.sky];
  const bg = head.daytime ? `linear-gradient(165deg, ${d1}, ${d2})` : `linear-gradient(165deg, ${n1}, ${n2})`;
  const maxRain = Math.max(30, ...hours.map((h) => h.rainPct));
  const heads = attention(c);
  // A weather service warning already has its own red banner under the sky; the pill is for the app's own calls.
  const pill = heads && !c.alerts.some((a) => a.loud && a.event === heads.reason) ? heads : null;
  const heatDanger = c.heat?.level === "danger" || c.heat?.level === "extreme_danger";

  return (
    <section
      className={`mt-3 overflow-hidden rounded-2xl bg-surface ${heads?.level === "alert" ? "wx-ring-alert" : heads?.level === "caution" ? "wx-ring-caution" : ""}`}
      aria-label="Jobsite weather"
    >
      {/* The sky */}
      <div className={`relative overflow-hidden text-white ${pill ? "h-60" : "h-52"}`} style={{ background: bg }}>
        <Sky kind={head.sky} daytime={head.daytime} wind={c.wind?.level ?? "calm"} heatDanger={heatDanger && head.daytime && (head.sky === "clear" || head.sky === "partly")} />
        {/* A soft shade on the left keeps the temperature readable while clouds pass behind it */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent" aria-hidden />
        <div className="relative flex h-full flex-col justify-between p-4 [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium">{c.day === "tomorrow" ? "Tomorrow" : "Now"}{c.place ? ` in ${c.place}` : ""}</p>
              {pill && (
                <p
                  role="alert"
                  className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold [text-shadow:none] ${pill.level === "alert" ? "bg-warn text-warn-ink" : "bg-caution text-[#2B2000]"}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden><path d="M12 3 2 21h20L12 3z" fill="currentColor" /><path d="M12 10v5M12 17.5v.5" stroke={pill.level === "alert" ? "var(--warn)" : "var(--caution)"} strokeWidth="2.4" strokeLinecap="round" /></svg>
                  {pill.reason}
                </p>
              )}
            </div>
            <button
              className="flex min-h-9 shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 text-xs backdrop-blur-sm"
              onClick={() => window.dispatchEvent(new Event("tt-weather-refresh"))}
              disabled={busy}
              aria-label="Refresh the weather"
            >
              {busy ? "Updating…" : `${old ? "Last checked" : "Updated"} ${time(c.checkedAt)}`}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden className={busy ? "wx-spin-fast" : ""}><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" /></svg>
            </button>
          </div>
          <div>
            <p className="font-display text-[64px] font-medium leading-none tracking-tight tabular-nums">{head.tempF != null ? `${head.tempF}°` : "–"}</p>
            <p className="mt-1 text-[15px] font-medium">{head.label || SKY_WORDS[head.sky]}</p>
            {head.highF != null && head.lowF != null && (
              <p className="text-sm opacity-85">{c.day === "tomorrow" ? "Work day" : "Rest of the work day"}: high {head.highF}°, low {head.lowF}°</p>
            )}
          </div>
        </div>
      </div>

      {/* Weather service warnings: loud and first */}
      {c.alerts.map((a) => (
        <p key={a.event} className={`px-4 py-2.5 text-sm font-semibold ${a.loud ? "bg-warn text-warn-ink" : "bg-caution-bg text-caution-text"}`}>
          {a.loud ? "⚠ " : ""}{a.event}{a.ends ? ` until ${time(a.ends)}` : ""}
        </p>
      ))}

      {/* Hour by hour */}
      {hours.length > 0 && (
        <ol className="flex gap-1 overflow-x-auto px-2 pt-3 pb-2" aria-label="Hour by hour">
          {hours.map((h, i) => {
            const arrow = windToward(h.windDirection);
            return (
              <li key={h.time} className="flex w-14 shrink-0 flex-col items-center gap-1 text-center">
                <span className="text-xs text-muted">{i === 0 && c.day === "today" ? "Now" : hourOf(h.time)}</span>
                <SkyIcon kind={h.sky} daytime={h.daytime} />
                <span className="font-semibold tabular-nums">{h.tempF != null ? `${h.tempF}°` : "–"}</span>
                <span className="flex h-10 w-full flex-col items-center justify-end" title={`${h.rainPct}% chance of rain`}>
                  <span className="text-[10px] tabular-nums text-brand-text">{h.rainPct >= 20 ? `${h.rainPct}%` : ""}</span>
                  <span className="w-2.5 rounded-t-full bg-[#3B82D6]" style={{ height: `${Math.max(2, (h.rainPct / maxRain) * 26)}px`, opacity: h.rainPct >= 20 ? 0.9 : 0.25 }} />
                </span>
                <span className="flex items-center gap-0.5 text-[11px] text-muted tabular-nums">
                  {arrow != null && (
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden style={{ transform: `rotate(${arrow}deg)` }}><path d="M5 1 8.5 8.5 5 6.8 1.5 8.5Z" fill="currentColor" /></svg>
                  )}
                  {h.windMph ?? "–"}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {/* Radar */}
      <button
        className="flex min-h-11 w-full items-center justify-between border-t border-line px-4 text-sm font-semibold text-brand-text"
        onClick={toggleRadar}
        aria-expanded={radar}
      >
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><path d="M12 12 18.5 5.5" /></svg>
          {radar ? "Hide radar" : "Show radar"}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden className={`transition-transform ${radar ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {radar && point && <RadarMap latitude={point.latitude} longitude={point.longitude} />}

      {/* The day at a glance */}
      <dl className="grid grid-cols-3 border-t border-line text-sm">
        <Stat label="Heat index" value={c.heat ? `${c.heat.maxHeatIndexF}°` : "–"} note={c.heat ? HEAT_LABEL[c.heat.level] : "No reading"} hot={heatLoud} />
        <Stat label="Rain" value={c.rain ? `${c.rain.maxPct}%` : "–"} note={c.rain && c.rain.maxPct >= 30 ? `around ${hourOf(c.rain.atHour)}` : c.rain ? RAIN_LABEL[c.rain.level] : "No reading"} />
        <Stat label="Wind" value={c.wind ? `${c.wind.maxMph} mph` : "–"} note={c.wind ? `${WIND_LABEL[c.wind.level]}${c.wind.direction ? `, ${c.wind.direction}` : ""}` : "No reading"} hot={windy} />
      </dl>

      {(c.thunderAt || notes.length > 0 || heatLoud) && (
        <div className="mx-3 mb-3 rounded-xl bg-caution-bg px-3.5 py-3 text-sm text-caution-text" role="alert">
          {c.thunderAt && <p className="font-semibold">Thunderstorms possible from about {hourOf(c.thunderAt)}</p>}
          <ul className="mt-1 flex flex-col gap-1">
            {notes.map((n) => <li key={n}>{n}</li>)}
            {heatLoud && c.day === "today" && <li>The heat reminder is added to today&apos;s talks.</li>}
          </ul>
        </div>
      )}
      <p className="px-4 pb-3 text-xs text-muted">
        Forecast and alerts from the National Weather Service. Information for the crew; the crew lead decides.
        {c.alertsUnavailable ? " Alerts couldn't be checked just now." : ""}
        {msg && old ? ` Couldn't update: ${msg}` : ""}
      </p>
    </section>
  );
}

function Stat({ label, value, note, hot }: { label: string; value: string; note: string; hot?: boolean }) {
  return (
    <div className="border-r border-line px-3 py-2.5 last:border-r-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`font-display text-xl font-medium tracking-tight tabular-nums ${hot ? "text-caution-text" : ""}`}>{value}</dd>
      <dd className="truncate text-xs text-muted">{note}</dd>
    </div>
  );
}

// --- Drawing ----------------------------------------------------------------------------------------------------
// Everything below is drawn in the app (SVG + CSS animations in globals.css, "wx-*"); nothing is downloaded.
// Movement uses transform and opacity only, so it stays smooth on a phone, and stops with reduced motion.

type CloudTone = "light" | "gray" | "storm";
const CLOUD_TONES: Record<CloudTone, [string, string, string]> = {
  // highlight, body, underside
  light: ["#FFFFFF", "#EEF2F7", "#C3CCD8"],
  gray: ["#E4E9F0", "#B5BFCC", "#7F8B9C"],
  storm: ["#A3ADBF", "#636D82", "#2E3445"],
};
/** How much faster things move, and how far rain leans, for each wind level. */
const WIND_FX: Record<WindLevel, { speed: number; slant: number; streaks: number; debris: number }> = {
  calm: { speed: 1, slant: 6, streaks: 0, debris: 0 },
  breezy: { speed: 1.5, slant: 14, streaks: 2, debris: 0 },
  windy: { speed: 2.4, slant: 24, streaks: 4, debris: 3 },
  high: { speed: 3.6, slant: 36, streaks: 7, debris: 6 },
};

/** One soft, shaded cumulus made of overlapping puffs (each puff lit from the upper left). */
function Cloud({ tone }: { tone: CloudTone }) {
  const id = `wx-cl-${tone}`;
  return (
    <g>
      <ellipse cx="40" cy="20" rx="50" ry="13" fill={`url(#${id})`} />
      {[[0, 6, 20], [22, -8, 26], [50, -2, 22], [72, 8, 15], [36, 10, 20]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={`url(#${id})`} />
      ))}
    </g>
  );
}

type CloudSpot = { y: number; scale: number; layer: 0 | 1 | 2; offset: number };
// layer 0 = far (blurred, faint, slow), 1 = middle, 2 = near (crisp, fast). offset = where along its trip it starts.
const CLOUDS: Record<SkyKind, CloudSpot[]> = {
  clear: [],
  partly: [{ y: 30, scale: 1.3, layer: 1, offset: 0.55 }, { y: 70, scale: 0.9, layer: 0, offset: 0.2 }, { y: 6, scale: 1, layer: 2, offset: 0.85 }],
  cloudy: [{ y: 10, scale: 1.6, layer: 0, offset: 0.1 }, { y: 40, scale: 1.3, layer: 0, offset: 0.6 }, { y: 20, scale: 1.4, layer: 1, offset: 0.35 },
    { y: 70, scale: 1.1, layer: 1, offset: 0.8 }, { y: 0, scale: 1.2, layer: 2, offset: 0.5 }, { y: 95, scale: 0.9, layer: 2, offset: 0.05 }],
  fog: [{ y: 10, scale: 1.6, layer: 0, offset: 0.3 }, { y: 50, scale: 1.4, layer: 0, offset: 0.75 }, { y: 30, scale: 1.2, layer: 1, offset: 0.5 }],
  rain: [{ y: -10, scale: 1.8, layer: 0, offset: 0.15 }, { y: 20, scale: 1.5, layer: 0, offset: 0.65 }, { y: 0, scale: 1.4, layer: 1, offset: 0.4 },
    { y: 35, scale: 1.2, layer: 1, offset: 0.9 }, { y: -6, scale: 1.3, layer: 2, offset: 0.7 }, { y: 30, scale: 1.0, layer: 2, offset: 0.2 }],
  thunder: [{ y: -14, scale: 2, layer: 0, offset: 0.1 }, { y: 16, scale: 1.7, layer: 0, offset: 0.6 }, { y: -4, scale: 1.5, layer: 1, offset: 0.35 },
    { y: 30, scale: 1.3, layer: 1, offset: 0.85 }, { y: -10, scale: 1.4, layer: 2, offset: 0.55 }, { y: 26, scale: 1.1, layer: 2, offset: 0.15 }, { y: 4, scale: 1.2, layer: 2, offset: 0.95 }],
};
const LAYER = [
  { dur: 150, opacity: 0.55, blur: "url(#wx-blur-far)" },
  { dur: 95, opacity: 0.85, blur: "url(#wx-blur-soft)" },
  { dur: 62, opacity: 0.95, blur: undefined },
];

// Lightning: a jagged main stroke with a branch, drawn at two places on different, irregular timings.
const BOLTS = [
  { d: "M262 40 252 66 262 70 246 98 256 101 238 136", branch: "M252 66 236 80 240 88 226 104", flash: "wx-flash-a", cx: 252 },
  { d: "M148 30 156 54 146 58 160 84 150 88 166 120", branch: "M156 84 172 96 168 104 182 118", flash: "wx-flash-b", cx: 156 },
];

function Sky({ kind, daytime, wind, heatDanger }: { kind: SkyKind; daytime: boolean; wind: WindLevel; heatDanger: boolean }) {
  const fx = WIND_FX[wind];
  const tone: CloudTone = kind === "thunder" ? "storm" : kind === "rain" || kind === "cloudy" || kind === "fog" ? "gray" : "light";
  const showSun = daytime && (kind === "clear" || kind === "partly");
  const showMoon = !daytime && (kind === "clear" || kind === "partly");
  const rain = kind === "rain" || kind === "thunder";
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        {(Object.keys(CLOUD_TONES) as CloudTone[]).map((t) => (
          <radialGradient key={t} id={`wx-cl-${t}`} cx="0.35" cy="0.25" r="0.85">
            <stop offset="0" stopColor={CLOUD_TONES[t][0]} />
            <stop offset="0.55" stopColor={CLOUD_TONES[t][1]} />
            <stop offset="1" stopColor={CLOUD_TONES[t][2]} />
          </radialGradient>
        ))}
        <filter id="wx-blur-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6" /></filter>
        <filter id="wx-blur-far" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="wx-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" /></filter>
        <radialGradient id="wx-sun-glow"><stop offset="0" stopColor="#FFF1B8" stopOpacity="0.95" /><stop offset="0.45" stopColor="#FFE08A" stopOpacity="0.35" /><stop offset="1" stopColor="#FFE08A" stopOpacity="0" /></radialGradient>
        <radialGradient id="wx-sun-core" cx="0.4" cy="0.35"><stop offset="0" stopColor="#FFF6CF" /><stop offset="1" stopColor="#FFC93C" /></radialGradient>
        <radialGradient id="wx-moon-glow"><stop offset="0" stopColor="#FFF8DC" stopOpacity="0.45" /><stop offset="1" stopColor="#FFF8DC" stopOpacity="0" /></radialGradient>
        <linearGradient id="wx-drop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0.9" /></linearGradient>
        {BOLTS.map((b) => (
          <radialGradient key={b.flash} id={`${b.flash}-g`} cx={b.cx / 400} cy="0.35" r="0.75">
            <stop offset="0" stopColor="#F2EEFF" stopOpacity="0.95" /><stop offset="0.5" stopColor="#C9C2FF" stopOpacity="0.35" /><stop offset="1" stopColor="#C9C2FF" stopOpacity="0" />
          </radialGradient>
        ))}
        {/* Wind streaks and debris fade out on the left, so they never run through the temperature */}
        <linearGradient id="wx-right-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0.45" stopColor="#000" /><stop offset="0.68" stopColor="#fff" /></linearGradient>
        <mask id="wx-right" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="200"><rect width="400" height="200" fill="url(#wx-right-g)" /></mask>
        <linearGradient id="wx-heat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFB070" stopOpacity="0" /><stop offset="1" stopColor="#FF9A4D" stopOpacity="0.35" /></linearGradient>
      </defs>

      {/* Sun or moon, behind the clouds */}
      {showSun && (
        <g transform="translate(320 56)">
          <circle r="80" fill="url(#wx-sun-glow)" className="wx-pulse" />
          <g className="wx-spin" opacity="0.55">
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} d="M0 -40 L3 -64 L-3 -64Z" fill="#FFF0B3" transform={`rotate(${i * 22.5})`} opacity={i % 2 ? 0.5 : 0.9} />
            ))}
          </g>
          <circle r="26" fill="url(#wx-sun-core)" />
          {kind === "clear" && (
            <g fill="#FFF6D6" className="wx-flare">
              <circle cx="-70" cy="44" r="7" opacity="0.18" /><circle cx="-112" cy="70" r="12" opacity="0.1" /><circle cx="-150" cy="94" r="4" opacity="0.22" />
            </g>
          )}
        </g>
      )}
      {showMoon && (
        <g>
          {[[30, 24], [70, 58], [118, 18], [176, 44], [214, 14], [250, 70], [372, 126], [104, 96], [196, 96], [292, 22]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="#fff" className="wx-twinkle" style={{ animationDelay: `${(i * 0.73) % 3}s` }} />
          ))}
          <circle cx="322" cy="54" r="46" fill="url(#wx-moon-glow)" />
          <path d="M322 30a24 24 0 1 0 20 38 19 19 0 1 1-20-38z" fill="#F5EDCD" />
        </g>
      )}

      {/* A darker cloud deck along the top for rain and storms */}
      {(kind === "rain" || kind === "thunder") && (
        <rect x="-20" y="-20" width="440" height="90" rx="40" fill={kind === "thunder" ? "#2A3040" : "#6A788C"} opacity="0.55" filter="url(#wx-blur-far)" />
      )}

      {/* Clouds keep crossing the sky; far ones blurred and slow, near ones crisp and faster, all faster in wind */}
      {CLOUDS[kind].map((cl, i) => {
        const L = LAYER[cl.layer], dur = L.dur / fx.speed;
        return (
          <g key={i} className="wx-cross" style={{ animationDuration: `${dur}s`, animationDelay: `${-cl.offset * dur}s` }}>
            <g transform={`translate(0 ${cl.y}) scale(${cl.scale})`} opacity={L.opacity} filter={L.blur}>
              <Cloud tone={tone} />
            </g>
          </g>
        );
      })}

      {/* Lightning: the sky lights up, then the bolt; two strikes on their own irregular rhythms */}
      {kind === "thunder" && BOLTS.map((b) => (
        <g key={b.flash}>
          <rect x="0" y="0" width="400" height="200" fill={`url(#${b.flash}-g)`} className={b.flash} />
          <g className={`${b.flash}-bolt`} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={b.d} stroke="#B9B2FF" strokeWidth="7" filter="url(#wx-glow)" />
            <path d={b.branch} stroke="#B9B2FF" strokeWidth="4" filter="url(#wx-glow)" />
            <path d={b.d} stroke="#FFFFFF" strokeWidth="2.2" />
            <path d={b.branch} stroke="#FFFFFF" strokeWidth="1.3" />
          </g>
        </g>
      ))}

      {/* Rain in two depths, leaning with the wind */}
      {rain && (
        <g transform={`skewX(${-fx.slant})`}>
          {[{ n: 34, w: 1, h: 11, op: 0.35, dur: 1.05 }, { n: 26, w: 1.6, h: 19, op: 0.75, dur: 0.62 }].map((layer, li) =>
            Array.from({ length: layer.n }, (_, i) => {
              const x = ((i * 47 + li * 23) % 520) - 40 + (li ? 9 : 0), d = ((i * 37 + li * 11) % 100) / 100;
              return (
                <rect key={`${li}-${i}`} x={x} y={-24} width={layer.w} height={layer.h} rx={layer.w / 2} fill="url(#wx-drop)" opacity={layer.op}
                  className="wx-fall" style={{ animationDuration: `${layer.dur + (i % 3) * 0.08}s`, animationDelay: `${-d * 1.2}s` }} />
              );
            }),
          )}
        </g>
      )}

      {/* Fog: soft banks sliding past */}
      {kind === "fog" && (
        <g fill="#fff" filter="url(#wx-blur-far)">
          {[60, 92, 124, 156, 182].map((y, i) => (
            <rect key={y} x="-80" y={y} width="320" height="16" rx="8" opacity={0.34 - i * 0.04} className="wx-fog" style={{ animationDelay: `${-i * 2.7}s`, animationDuration: `${12 + i * 3}s` }} />
          ))}
        </g>
      )}

      {/* Wind: gust lines and blowing debris, more and faster as the wind picks up */}
      <g mask="url(#wx-right)">
      {fx.streaks > 0 && (
        <g fill="none" stroke="#fff" strokeLinecap="round">
          {Array.from({ length: fx.streaks }, (_, i) => {
            const y = 30 + ((i * 41) % 150), len = 70 + (i % 3) * 30;
            return (
              <path key={i} d={`M-120 ${y} q${len / 2} -8 ${len} 0 t${len} 0`} strokeWidth={i % 2 ? 1.2 : 1.8} opacity={0.35 + (i % 3) * 0.12}
                className="wx-streak" style={{ animationDuration: `${(2.6 - fx.speed * 0.35 + (i % 3) * 0.4).toFixed(2)}s`, animationDelay: `${-i * 0.55}s` }} />
            );
          })}
        </g>
      )}
      {fx.debris > 0 && Array.from({ length: fx.debris }, (_, i) => (
        <g key={i} className="wx-debris" style={{ animationDuration: `${(3.4 - fx.speed * 0.4 + (i % 3) * 0.5).toFixed(2)}s`, animationDelay: `${-i * 0.8}s`, ["--wx-y" as string]: `${60 + ((i * 37) % 110)}px` }}>
          <path d="M0 0c3-4 9-4 10 0-3 4-8 4-10 0z" fill={["#7C8F4E", "#A27B3E", "#8B9A6A"][i % 3]} className="wx-tumble" />
        </g>
      ))}
      </g>

      {/* Heat shimmer near the ground on dangerous heat days */}
      {heatDanger && (
        <g>
          <rect x="0" y="140" width="400" height="60" fill="url(#wx-heat)" />
          {[150, 162, 174, 186].map((y, i) => (
            <path key={y} d={`M-40 ${y} q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} fill="none" stroke="#FFF3E0"
              strokeWidth="1.2" opacity={0.22 - i * 0.03} className="wx-shimmer" style={{ animationDelay: `${-i * 0.6}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
}

/** Small still icon for the hour strip. */
function SkyIcon({ kind, daytime }: { kind: SkyKind; daytime: boolean }) {
  const sun = daytime ? <circle cx="11" cy="10" r="5" fill="#F5B700" /> : <path d="M13 4a6 6 0 1 0 5 9 5 5 0 1 1-5-9z" fill="#9AA8C7" />;
  const cloud = (fill: string) => <path d="M8 21a4.5 4.5 0 0 1 .6-9A6 6 0 0 1 20 11.5a4.75 4.75 0 0 1 .5 9.5z" fill={fill} />;
  const label = SKY_WORDS[kind];
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" role="img" aria-label={label}>
      {kind === "clear" && (daytime ? <><circle cx="14" cy="14" r="6" fill="#F5B700" />{Array.from({ length: 8 }, (_, i) => <rect key={i} x="13.2" y="2.5" width="1.6" height="4" rx=".8" fill="#F5B700" transform={`rotate(${i * 45} 14 14)`} />)}</> : <path d="M15 5a8 8 0 1 0 7 12 7 7 0 1 1-7-12z" fill="#9AA8C7" />)}
      {kind === "partly" && <>{sun}{cloud("#B9C3D0")}</>}
      {kind === "cloudy" && cloud("#97A3B4")}
      {kind === "fog" && <g stroke="#97A3B4" strokeWidth="2" strokeLinecap="round"><path d="M5 10h18M3 15h20M6 20h16" /></g>}
      {kind === "rain" && <>{cloud("#8291A6")}<g stroke="#3B82D6" strokeWidth="1.8" strokeLinecap="round"><path d="M10 23l-1 3M15 23l-1 3M20 23l-1 3" /></g></>}
      {kind === "thunder" && <>{cloud("#5B667A")}<path d="M15 17l-3 6h3l-1.5 4 5-7h-3l1.5-3z" fill="#F5B700" /></>}
    </svg>
  );
}
