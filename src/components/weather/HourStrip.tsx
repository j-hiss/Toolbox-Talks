"use client";

// Hour by hour, like a weather app: sky icon, a temperature curve, feels-like when the heat index runs higher,
// rain-chance bars, wind with an arrow, and sunrise/sunset where they fall. Tap an hour for its details.
import { useState } from "react";
import { siteHour, windToward, type HourPoint } from "@/core/conditions";
import { HEAT_LABEL, heatLevel } from "@/core/heat";
import { SkyIcon, SunEventIcon } from "./Sky";

const COL = 60;     // width of an hour
const MARK = 54;    // width of a sunrise/sunset marker
const CURVE_H = 58; // height of the temperature curve band

type Column = { kind: "hour"; h: HourPoint; i: number } | { kind: "sun"; rise: boolean; at: Date };

export function HourStrip({ hours, sun, firstIsNow }: { hours: HourPoint[]; sun: { sunrise: Date; sunset: Date } | null; firstIsNow: boolean }) {
  const [sel, setSel] = useState<number | null>(null);
  if (!hours.length) return null;

  // Hours, with sunrise/sunset slotted in after the hour they fall in.
  const cols: Column[] = [];
  hours.forEach((h, i) => {
    cols.push({ kind: "hour", h, i });
    const start = new Date(h.time).getTime(), end = start + 3600_000;
    for (const [rise, at] of [[true, sun?.sunrise], [false, sun?.sunset]] as const) {
      if (at && at.getTime() >= start && at.getTime() < end) cols.push({ kind: "sun", rise, at });
    }
  });
  const xs: number[] = [];
  let x = 0;
  for (const c of cols) { xs.push(x + (c.kind === "hour" ? COL : MARK) / 2); x += c.kind === "hour" ? COL : MARK; }
  const width = x;

  // The temperature curve: a smooth line through each hour's temperature.
  const pts = cols.map((c, k) => (c.kind === "hour" && c.h.tempF != null ? { x: xs[k], t: c.h.tempF } : null)).filter((p): p is { x: number; t: number } => !!p);
  const tMin = Math.min(...pts.map((p) => p.t)), tMax = Math.max(...pts.map((p) => p.t));
  const y = (t: number) => 26 + (tMax === tMin ? 0.5 : (tMax - t) / (tMax - tMin)) * (CURVE_H - 36);
  const path = pts.reduce((d, p, k) => {
    if (!k) return `M${p.x} ${y(p.t)}`;
    const q = pts[k - 1], mx = (q.x + p.x) / 2;
    return `${d} C${mx} ${y(q.t)} ${mx} ${y(p.t)} ${p.x} ${y(p.t)}`;
  }, "");
  const area = pts.length ? `${path} L${pts[pts.length - 1].x} ${CURVE_H} L${pts[0].x} ${CURVE_H} Z` : "";
  const maxRain = Math.max(40, ...hours.map((h) => h.rainPct));
  const clock = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const picked = sel != null ? hours[sel] : null;

  return (
    <div>
      <div className="wx-strip relative overflow-x-auto pt-3 pb-2" style={{ scrollbarWidth: "none" }}>
        <div className="relative px-2" style={{ width: width + 16 }}>
          {/* Columns */}
          <ol className="flex" aria-label="Hour by hour">
            {cols.map((c, k) => c.kind === "sun" ? (
              <li key={`sun-${k}`} className="flex shrink-0 flex-col items-center text-center" style={{ width: MARK }}>
                <span className="text-[11px] font-semibold text-[#E08A00]">{clock(c.at)}</span>
                <span className="mt-1"><SunEventIcon rise={c.rise} /></span>
                <span className="mt-1 text-[11px] text-muted">{c.rise ? "Sunrise" : "Sunset"}</span>
              </li>
            ) : (
              <li key={c.h.time} className="shrink-0" style={{ width: COL }}>
                <button
                  className={`flex w-full flex-col items-center rounded-2xl px-0.5 pt-1 pb-1.5 text-center transition-colors ${sel === c.i ? "bg-brand-soft" : c.i === 0 && firstIsNow ? "bg-fg/[0.04]" : ""}`}
                  onClick={() => setSel((v) => (v === c.i ? null : c.i))}
                  aria-pressed={sel === c.i}
                  aria-label={`${c.i === 0 && firstIsNow ? "Now" : siteHour(c.h.time)}: ${c.h.label}, ${c.h.tempF ?? "no"} degrees, ${c.h.rainPct}% chance of rain, wind ${c.h.windMph ?? "unknown"} miles per hour`}
                >
                  <span className={`text-xs ${c.i === 0 && firstIsNow ? "font-semibold text-fg" : "text-muted"}`}>{c.i === 0 && firstIsNow ? "Now" : siteHour(c.h.time)}</span>
                  <span className="mt-1"><SkyIcon kind={c.h.sky} daytime={c.h.daytime} /></span>
                  <span className="h-3.5 text-[10px] font-semibold tabular-nums text-[#3B8BE0]">{c.h.rainPct >= 20 ? `${c.h.rainPct}%` : ""}</span>
                  {/* room for the curve, drawn across all columns below */}
                  <span className="block" style={{ height: CURVE_H }} />
                  <span className="h-4 text-[10px] tabular-nums text-caution-text">{c.h.feelsF != null && c.h.tempF != null && c.h.feelsF - c.h.tempF >= 3 ? `feels ${c.h.feelsF}°` : ""}</span>
                  <span className="mt-1 flex h-9 w-3 items-end overflow-hidden rounded-full bg-[#3B8BE0]/12" aria-hidden>
                    <span className="block w-full rounded-full" style={{ height: `${Math.max(8, (c.h.rainPct / maxRain) * 100)}%`, background: "linear-gradient(180deg,#7CC0FF,#2F7FE0)", opacity: c.h.rainPct >= 20 ? 1 : 0.35 }} />
                  </span>
                  <span className="mt-1.5 flex items-center gap-1 text-[11px] tabular-nums text-muted">
                    {windToward(c.h.windDirection) != null && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-fg/[0.07]">
                        <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden style={{ transform: `rotate(${windToward(c.h.windDirection)}deg)` }}><path d="M5 1 8.5 8.5 5 6.8 1.5 8.5Z" fill="currentColor" /></svg>
                      </span>
                    )}
                    {c.h.windMph ?? "–"}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          {/* Temperature curve across the columns, with each hour's temperature on the line */}
          {pts.length > 1 && (
            <svg className="pointer-events-none absolute left-2" style={{ top: 72, width, height: CURVE_H }} viewBox={`0 0 ${width} ${CURVE_H}`} aria-hidden>
              <defs>
                <linearGradient id="wx-curve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF9A4D" stopOpacity="0.28" /><stop offset="1" stopColor="#FF9A4D" stopOpacity="0" /></linearGradient>
                <linearGradient id="wx-curve-line" x1="0" y1="0" x2="1" y2="0">
                  {pts.map((p, k) => <stop key={k} offset={pts.length > 1 ? k / (pts.length - 1) : 0} stopColor={p.t >= 90 ? "#F06A2A" : p.t >= 80 ? "#F5A300" : p.t >= 65 ? "#E3C24A" : "#5AA7E8"} />)}
                </linearGradient>
              </defs>
              <path d={area} fill="url(#wx-curve)" />
              <path d={path} fill="none" stroke="url(#wx-curve-line)" strokeWidth="2.5" strokeLinecap="round" />
              {pts.map((p, k) => (
                <g key={k}>
                  <circle cx={p.x} cy={y(p.t)} r="3.2" fill="var(--surface)" stroke={p.t >= 90 ? "#F06A2A" : p.t >= 80 ? "#F5A300" : "#5AA7E8"} strokeWidth="2" />
                  <text x={p.x} y={y(p.t) - 9} textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--fg)" className="tabular-nums">{p.t}°</text>
                </g>
              ))}
            </svg>
          )}
        </div>
      </div>

      {/* Details for the hour tapped */}
      {picked && (
        <div className="mx-3 mb-2 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 rounded-xl bg-brand-soft px-3.5 py-3 text-sm" role="status">
          <span className="row-span-3"><SkyIcon kind={picked.sky} daytime={picked.daytime} size={44} /></span>
          <p className="font-semibold">{siteHour(picked.time)} · {picked.label}</p>
          <p className="text-muted tabular-nums">
            {picked.tempF}°{picked.feelsF != null && picked.tempF != null && picked.feelsF !== picked.tempF ? `, feels like ${picked.feelsF}° (${HEAT_LABEL[heatLevel(picked.feelsF)].toLowerCase()})` : ""}
            {picked.humidity != null ? ` · humidity ${picked.humidity}%` : ""}
          </p>
          <p className="text-muted tabular-nums">Rain chance {picked.rainPct}% · wind {picked.windMph ?? "–"} mph {picked.windDirection}</p>
        </div>
      )}
    </div>
  );
}
