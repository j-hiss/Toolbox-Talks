"use client";

// Live jobsite weather on Home, styled like a weather app: an animated sky that matches the forecast (sun, drifting
// clouds, rain, lightning, fog, stars at night), the temperature, then hour by hour for the rest of the work day.
// Numbers and judgments come from src/core/conditions.ts; this file only draws them. Motion stops for people who
// ask for reduced motion.
import { useEffect, useState } from "react";
import type { Jobsite } from "@/lib/data/types";
import { alertWorthy, HEAT_LABEL } from "@/core/heat";
import { conditionNotes, RAIN_LABEL, WIND_LABEL, windToward, type SkyKind } from "@/core/conditions";
import { cachedConditions, checkConditions, CONDITIONS_FRESH_MS, type ConditionsCheck } from "@/lib/weather";
import { getLocation, LocationError } from "@/lib/location";

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

  // A check saved by the earlier version has no hours or headline; fall back to what it has.
  const hours = c.hours ?? [];
  const head = c.headline ?? { sky: c.thunderAt ? "thunder" : "clear", daytime: true, tempF: c.now?.tempF ?? null, label: c.now?.shortForecast ?? "", highF: null, lowF: null };
  const heatLoud = !!c.heat && alertWorthy(c.heat.level);
  const notes = conditionNotes(c);
  const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const hourOf = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric" });
  const old = now - new Date(c.checkedAt).getTime() > 2 * CONDITIONS_FRESH_MS;
  const windy = c.wind?.level === "windy" || c.wind?.level === "high";
  const [d1, d2, n1, n2] = SKY_BG[head.sky];
  const bg = head.daytime ? `linear-gradient(165deg, ${d1}, ${d2})` : `linear-gradient(165deg, ${n1}, ${n2})`;
  const maxRain = Math.max(30, ...hours.map((h) => h.rainPct));

  return (
    <section className="mt-3 overflow-hidden rounded-2xl bg-surface" aria-label="Jobsite weather">
      {/* The sky */}
      <div className="relative h-48 overflow-hidden text-white" style={{ background: bg }}>
        <Sky kind={head.sky} daytime={head.daytime} windy={windy} />
        <div className="relative flex h-full flex-col justify-between p-4 [text-shadow:0_1px_8px_rgba(0,0,0,0.25)]">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium">{c.day === "tomorrow" ? "Tomorrow" : "Now"}{c.place ? ` in ${c.place}` : ""}</p>
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

const CLOUD = "M25 40a14 14 0 0 1 3-27.7A19 19 0 0 1 63 10a15 15 0 0 1 12 30z";

/** The animated sky behind the temperature. Pure SVG + CSS; nothing loads from the network. */
function Sky({ kind, daytime, windy }: { kind: SkyKind; daytime: boolean; windy: boolean }) {
  const cloudFill = kind === "thunder" ? "#3A4256" : kind === "rain" ? "#7D8BA0" : kind === "cloudy" || kind === "fog" ? "#C9D1DC" : "#FFFFFF";
  const showSun = daytime && (kind === "clear" || kind === "partly");
  const showMoon = !daytime && (kind === "clear" || kind === "partly");
  const clouds = kind === "clear" ? 0 : kind === "partly" ? 2 : 4;
  const rain = kind === "rain" || kind === "thunder";
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="wx-sun-glow">
          <stop offset="0" stopColor="#FFE9A3" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE9A3" stopOpacity="0" />
        </radialGradient>
      </defs>
      {showSun && (
        <g transform="translate(318 58)">
          <circle r="62" fill="url(#wx-sun-glow)" className="wx-pulse" />
          <g className="wx-spin">
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x="-2" y="-46" width="4" height="12" rx="2" fill="#FFE58A" opacity="0.8" transform={`rotate(${i * 30})`} />
            ))}
          </g>
          <circle r="27" fill="#FFD45C" />
        </g>
      )}
      {showMoon && (
        <g>
          {[[40, 30], [90, 60], [150, 22], [210, 48], [260, 18], [370, 120], [120, 110]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1.1} fill="#fff" className="wx-twinkle" style={{ animationDelay: `${i * 0.7}s` }} />
          ))}
          <path d="M330 30a26 26 0 1 0 22 40 21 21 0 1 1-22-40z" fill="#F3EBC8" />
        </g>
      )}
      {Array.from({ length: clouds }, (_, i) => {
        // Clouds stay on the right and along the top, so the temperature on the left stays easy to read.
        const x = [215, 300, 150, 290][i], y = [24, 72, -6, 118][i], s = [1.5, 1.15, 1.0, 1.0][i];
        return (
          <g key={i} className="wx-drift" style={{ animationDuration: `${38 + i * 14}s`, animationDelay: `${-i * 9}s` }}>
            <path d={CLOUD} transform={`translate(${x} ${y}) scale(${s})`} fill={cloudFill} opacity={kind === "partly" ? 0.95 : 0.85 - i * 0.08} />
          </g>
        );
      })}
      {rain && (
        <g stroke={kind === "thunder" ? "#A9B8D6" : "#D6E4F5"} strokeWidth="1.6" strokeLinecap="round" opacity="0.75">
          {Array.from({ length: 34 }, (_, i) => {
            const x = (i * 37) % 400 + 6, d = ((i * 53) % 100) / 100;
            return <line key={i} x1={x} y1={-12} x2={x - 4} y2={2} className="wx-fall" style={{ animationDelay: `${-d}s`, animationDuration: `${0.75 + (i % 4) * 0.12}s` }} />;
          })}
        </g>
      )}
      {kind === "thunder" && (
        <>
          <rect width="400" height="190" fill="#E9E4FF" className="wx-flash" />
          <path d="M248 70 232 104h14l-10 32 30-44h-15l12-22z" fill="#FFE27A" className="wx-bolt" />
        </>
      )}
      {kind === "fog" && (
        <g fill="#fff">
          {[70, 100, 130, 160].map((y, i) => (
            <rect key={y} x="-60" y={y} width="300" height="10" rx="5" opacity={0.28 - i * 0.03} className="wx-fog" style={{ animationDelay: `${-i * 3}s` }} />
          ))}
        </g>
      )}
      {windy && (
        <g fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.55">
          {[44, 86, 128].map((y, i) => (
            <path key={y} d={`M190 ${y} q50 -9 100 0 t100 0`} className="wx-gust" style={{ animationDelay: `${-i * 0.9}s` }} />
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
