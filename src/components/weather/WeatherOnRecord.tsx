"use client";

// The weather saved with a talk (migration 0057), as the saved record shows it: one row with the sky, temperature and
// conditions; one row of small chips for the day's heat, rain, wind and storms; alerts; and a one-line note on where
// it came from. Compact on purpose. Wording and rules: src/core/weatherRecord.ts. Sky icons: ./Sky.tsx.
import { skyKind } from "@/core/conditions";
import { makeupWeatherNote, weatherChips, type WeatherChip, type WeatherRecord } from "@/core/weatherRecord";
import { SkyIcon, SkyIconDefs } from "./Sky";

const ICON: Record<WeatherChip["kind"] | "alert" | "clear", React.ReactNode> = {
  heat: <path d="M10 13.5V4.5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0zM12 9v7" />,
  rain: <path d="M12 3.5c-3 4.2-5 7-5 9.5a5 5 0 0 0 10 0c0-2.5-2-5.3-5-9.5z" />,
  wind: <path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h8" />,
  storm: <path d="M13 3 6 13h5l-1 8 7-10h-5z" />,
  alert: <path d="M12 4 2.8 20h18.4zM12 10v4.5M12 17.2v.3" />,
  clear: <path d="m5 12.5 4.5 4.5L19 7.5" />,
};
const Icon = ({ k }: { k: keyof typeof ICON }) => (
  <svg aria-hidden viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">{ICON[k]}</svg>
);
const Chip = ({ k, tone, children }: { k: keyof typeof ICON; tone: "hot" | "calm" | "ok"; children: React.ReactNode }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tone === "hot" ? "bg-warn-bg text-warn-text" : tone === "ok" ? "bg-ok-bg text-ok-text" : "bg-fg/[0.06] text-fg"}`}>
    <Icon k={k} />{children}
  </span>
);

/** `makeupFor`: on a makeup, says this is the weather where and when it was given, not the week it covers. */
export function WeatherOnRecord({ w, makeupFor = null }: { w: WeatherRecord; makeupFor?: string | null }) {
  const checked = new Date(w.checked_at);
  const hour = checked.getHours();
  const chips = weatherChips(w);
  return (
    <section aria-label="Weather at the talk" className="rounded-xl bg-surface px-3 py-2.5 shadow-card">
      <SkyIconDefs />
      <div className="flex items-center gap-2.5">
        <SkyIcon kind={skyKind(w.now?.sky)} daytime={hour >= 6 && hour < 19} size={36} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="flex items-baseline gap-2">
            {w.now && <b className="font-display text-xl tabular-nums tracking-tight">{w.now.temp_f}°</b>}
            <span className="truncate text-sm font-semibold">{w.now?.sky ?? "Weather at the talk"}</span>
          </p>
          <p className="truncate text-xs text-muted tabular-nums">
            {[w.now?.wind_mph != null ? `${w.now.wind_dir} ${w.now.wind_mph} mph` : null, w.now ? `${w.now.rain_pct}% rain` : null, w.high_f != null ? `H ${Math.round(w.high_f)}° L ${w.low_f != null ? Math.round(w.low_f) : "–"}°` : null].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((c) => <Chip key={c.kind} k={c.kind} tone={c.hot ? "hot" : "calm"}>{c.label}</Chip>)}
        {w.alerts_unavailable ? <Chip k="alert" tone="calm">Alerts not checked</Chip>
          : w.alerts.length ? w.alerts.map((a) => <Chip key={a.event} k="alert" tone="hot">{a.event}</Chip>)
          : <Chip k="clear" tone="ok">No alerts</Chip>}
      </div>
      {makeupFor && <p className="mt-1.5 text-[11px] font-semibold leading-snug text-caution-text">{makeupWeatherNote(w)}</p>}
      <p className="mt-1.5 text-[11px] leading-snug text-muted">
        Weather at the talk · NWS forecast for {w.place || "the jobsite"}, {checked.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} · not measured on site
      </p>
    </section>
  );
}
