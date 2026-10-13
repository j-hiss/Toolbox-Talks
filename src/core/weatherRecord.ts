// The weather saved with a signed talk (migration 0057): a snapshot of the National Weather Service forecast for the
// jobsite, taken from the same check Home and the heat note use (src/lib/weather.ts → src/core/conditions.ts).
// Pure module. Kept for outdoor and mixed work only (where the crew works decides it, src/core/worksetting.ts).
//
// Honest: it's the weather service's forecast for that spot at the time it was checked, never a measurement taken on
// site, and the record says so. A check that's too old, or from another day, isn't saved as "the weather at the talk".
import { daySummary, siteHour, type Conditions } from "./conditions";
import { HEAT_LABEL } from "./heat";
import type { WorkSetting } from "./worksetting";

export const WEATHER_RECORD_VERSION = 1;
/** How old a forecast check can be and still go on the record. */
export const WEATHER_MAX_AGE_MS = 3 * 60 * 60_000;

export type WeatherRecord = {
  v: number;
  source: "NWS";
  checked_at: string;
  place: string;
  work_setting: WorkSetting;
  /** "today", or "tomorrow" when the talk was after work hours and the outlook was for the next day. */
  day: "today" | "tomorrow";
  now: { temp_f: number; sky: string; wind_mph: number | null; wind_dir: string; rain_pct: number } | null;
  high_f: number | null;
  low_f: number | null;
  heat_index_max_f: number | null;
  heat_level: string | null;
  rain: { max_pct: number; at: string } | null;
  wind: { max_mph: number; dir: string; at: string } | null;
  thunder_at: string | null;
  alerts: { event: string; severity: string }[];
  /** The alerts lookup failed: "no alerts" can't be claimed. */
  alerts_unavailable: boolean;
  /** The work day in a sentence, as Home showed it. */
  summary: string;
};

/**
 * Which place a snapshot was taken for (about 100 m), so a talk whose jobsite changed after the check, or a makeup at
 * another site, never keeps the weather of somewhere else.
 */
export const weatherPlaceKey = (p: { latitude: number; longitude: number }) => `${p.latitude.toFixed(3)},${p.longitude.toFixed(3)}`;

type Check = Conditions & { checkedAt: string; source: "NWS"; place: string; alertsUnavailable: boolean };

/** The snapshot to save, or null: indoor work, no check, or a check too old or from another day. */
export function weatherRecordFrom(c: Check | null, setting: WorkSetting, now: Date = new Date()): WeatherRecord | null {
  if (!c || setting === "indoor") return null;
  const checked = new Date(c.checkedAt);
  if (now.getTime() - checked.getTime() > WEATHER_MAX_AGE_MS || checked.toDateString() !== now.toDateString()) return null;
  return {
    v: WEATHER_RECORD_VERSION, source: "NWS", checked_at: c.checkedAt, place: c.place.slice(0, 120), work_setting: setting, day: c.day,
    now: c.now ? { temp_f: Math.round(c.now.tempF), sky: c.now.shortForecast.slice(0, 80), wind_mph: c.now.windMph, wind_dir: c.now.windDirection.slice(0, 4), rain_pct: c.now.rainPct } : null,
    high_f: c.headline.highF, low_f: c.headline.lowF,
    heat_index_max_f: c.heat?.maxHeatIndexF ?? null, heat_level: c.heat?.level ?? null,
    rain: c.rain ? { max_pct: c.rain.maxPct, at: c.rain.atHour } : null,
    wind: c.wind ? { max_mph: c.wind.maxMph, dir: c.wind.direction.slice(0, 4), at: c.wind.atHour } : null,
    thunder_at: c.thunderAt,
    alerts: c.alerts.slice(0, 6).map((a) => ({ event: a.event.slice(0, 80), severity: a.severity.slice(0, 20) })),
    alerts_unavailable: c.alertsUnavailable,
    summary: daySummary(c).slice(0, 300),
  };
}

const timeOf = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

/** The lines the record screen and the PDF print, in that order. */
export function weatherLines(w: WeatherRecord): { now: string | null; day: string; alerts: string; source: string } {
  const now = w.now
    ? `${w.now.temp_f}°F, ${w.now.sky}${w.now.wind_mph != null ? `, wind ${w.now.wind_dir ? `${w.now.wind_dir} ` : ""}${w.now.wind_mph} mph` : ""}, ${w.now.rain_pct}% chance of rain`
    : null;
  const day: string[] = [];
  if (w.high_f != null) day.push(`high ${Math.round(w.high_f)}°F${w.low_f != null ? `, low ${Math.round(w.low_f)}°F` : ""}`);
  if (w.heat_index_max_f != null) day.push(`heat index up to ${w.heat_index_max_f}°F${w.heat_level ? ` (${HEAT_LABEL[w.heat_level as keyof typeof HEAT_LABEL] ?? w.heat_level})` : ""}`);
  if (w.rain && w.rain.max_pct > 0) day.push(`rain chance up to ${w.rain.max_pct}% around ${siteHour(w.rain.at)}`);
  if (w.wind) day.push(`wind up to ${w.wind.max_mph} mph around ${siteHour(w.wind.at)}`);
  if (w.thunder_at) day.push(`thunderstorms possible from ${siteHour(w.thunder_at)}`);
  const lead = w.day === "tomorrow" ? "Tomorrow's work day" : "The work day";
  return {
    now,
    day: day.length ? `${lead}: ${day.join("; ")}.` : w.summary || `${lead}: no details in the forecast.`,
    alerts: w.alerts_unavailable ? "Weather alerts couldn't be checked." : w.alerts.length ? `Active alerts: ${w.alerts.map((a) => a.event).join(", ")}.` : "No active weather alerts.",
    source: `National Weather Service forecast for ${w.place || "the jobsite"}, checked ${timeOf(w.checked_at)}. A forecast for the spot, not measured on site.`,
  };
}

export type WeatherChip = { kind: "heat" | "rain" | "wind" | "storm"; label: string; hot: boolean };

/** The day's notable bits as short chips, in the order the record shows them. Only what the forecast had. */
export function weatherChips(w: WeatherRecord): WeatherChip[] {
  const out: WeatherChip[] = [];
  if (w.heat_index_max_f != null) {
    const level = w.heat_level ? HEAT_LABEL[w.heat_level as keyof typeof HEAT_LABEL] ?? w.heat_level : "";
    out.push({ kind: "heat", label: `Heat index ${w.heat_index_max_f}°${level ? ` · ${level}` : ""}`, hot: w.heat_level === "danger" || w.heat_level === "extreme_danger" });
  }
  if (w.rain && w.rain.max_pct >= 30) out.push({ kind: "rain", label: `Rain ${w.rain.max_pct}% · ${siteHour(w.rain.at)}`, hot: w.rain.max_pct >= 60 });
  if (w.wind && w.wind.max_mph >= 15) out.push({ kind: "wind", label: `Wind ${w.wind.max_mph} mph · ${siteHour(w.wind.at)}`, hot: w.wind.max_mph >= 25 });
  if (w.thunder_at) out.push({ kind: "storm", label: `Storms from ${siteHour(w.thunder_at)}`, hot: true });
  return out;
}

/**
 * What the PDF prints: one compact line of conditions (each part separated by " · ", in the order the screen shows
 * them) and a small source line. Only what the forecast had.
 */
export function weatherPdfLines(w: WeatherRecord): [string, string] {
  const level = w.heat_level ? HEAT_LABEL[w.heat_level as keyof typeof HEAT_LABEL] ?? w.heat_level : "";
  const parts = [
    w.now ? `${w.now.temp_f}°F, ${w.now.sky}` : "Conditions at the time weren't in the forecast",
    w.now?.wind_mph != null ? `Wind ${w.now.wind_dir ? `${w.now.wind_dir} ` : ""}${w.now.wind_mph} mph` : null,
    w.now ? `Rain ${w.now.rain_pct}% now` : null,
    w.high_f != null ? `${w.day === "tomorrow" ? "Tomorrow h" : "H"}igh ${Math.round(w.high_f)}°F${w.low_f != null ? ` / low ${Math.round(w.low_f)}°F` : ""}` : null,
    w.heat_index_max_f != null ? `Heat index up to ${w.heat_index_max_f}°F${level ? ` (${level})` : ""}` : null,
    w.rain && w.rain.max_pct >= 30 ? `Rain up to ${w.rain.max_pct}% around ${siteHour(w.rain.at)}` : null,
    w.wind && w.wind.max_mph >= 15 ? `Wind up to ${w.wind.max_mph} mph around ${siteHour(w.wind.at)}` : null,
    w.thunder_at ? `Storms possible from ${siteHour(w.thunder_at)}` : null,
    w.alerts_unavailable ? "Alerts couldn't be checked" : w.alerts.length ? `Alert: ${w.alerts.map((a) => a.event).join(", ")}` : "No weather alerts",
  ].filter(Boolean);
  return [parts.join("  ·  "), `National Weather Service forecast for ${w.place || "the jobsite"}, checked ${timeOf(w.checked_at)}. A forecast for the spot, not measured on site.`];
}

/** On a makeup: the weather is from when and where it was given, not the week it makes up. */
export function makeupWeatherNote(w: Pick<WeatherRecord, "checked_at">): string {
  const day = new Date(w.checked_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return `Makeup: the weather the day it was given (${day}) where it was given, not the week it makes up.`;
}
