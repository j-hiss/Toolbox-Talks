// Jobsite weather for the rest of the work day: rain chance, wind, thunderstorms and the weather service's own
// active alerts, alongside heat (src/core/heat.ts). Pure module: reads api.weather.gov responses, judges them.
// The app shows this as information for the crew; it never says a site is safe or unsafe to work.
import { heatForDay, heatIndexF, type HeatDay } from "./heat";

export const WORK_START_HOUR = 6;
export const WORK_END_HOUR = 19;

export type RainLevel = "none" | "chance" | "likely";
export type WindLevel = "calm" | "breezy" | "windy" | "high";

export const RAIN_LABEL: Record<RainLevel, string> = { none: "Dry", chance: "Chance of rain", likely: "Rain likely" };
export const WIND_LABEL: Record<WindLevel, string> = { calm: "Light wind", breezy: "Breezy", windy: "Windy", high: "High wind" };

/** Rain chance: under 30% dry, 30–59% chance, 60% and up likely (the weather service's own wording bands). */
export const rainLevel = (pct: number): RainLevel => (pct >= 60 ? "likely" : pct >= 30 ? "chance" : "none");
/** Sustained wind in mph. */
export const windLevel = (mph: number): WindLevel => (mph >= 35 ? "high" : mph >= 25 ? "windy" : mph >= 15 ? "breezy" : "calm");

/** "10 mph" → 10, "10 to 15 mph" → 15, anything else → null. */
export function parseWindMph(s: unknown): number | null {
  if (typeof s !== "string") return null;
  const n = [...s.matchAll(/\d+(\.\d+)?/g)].map((m) => Number(m[0]));
  return n.length ? Math.max(...n) : null;
}

/** What the sky is doing, from the weather service's short forecast ("Chance Showers And Thunderstorms"). */
export type SkyKind = "clear" | "partly" | "cloudy" | "rain" | "thunder" | "fog";
const SKY_ORDER: SkyKind[] = ["clear", "partly", "cloudy", "fog", "rain", "thunder"];

export function skyKind(shortForecast: string | undefined): SkyKind {
  const s = (shortForecast ?? "").toLowerCase();
  if (/thunder|t-storm/.test(s)) return "thunder";
  if (/rain|shower|drizzle|sleet|snow|flurr/.test(s)) return "rain";
  if (/fog|haze|smoke|mist/.test(s)) return "fog";
  if (/partly|mostly sunny|mostly clear|few clouds|scattered clouds/.test(s)) return "partly";
  if (/cloud|overcast/.test(s)) return "cloudy";
  return "clear";
}
/** The rougher of two skies (thunder beats rain beats fog beats clouds beats clear). */
export const worseSky = (a: SkyKind, b: SkyKind): SkyKind => (SKY_ORDER.indexOf(a) >= SKY_ORDER.indexOf(b) ? a : b);

/** Compass direction ("SW") to the degrees an arrow should point (the way the wind is blowing toward). */
export function windToward(dir: string): number | null {
  const pts = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const i = pts.indexOf((dir ?? "").toUpperCase());
  return i < 0 ? null : (i * 22.5 + 180) % 360;
}

export type HourPoint = {
  time: string; tempF: number | null; rainPct: number; windMph: number | null; windDirection: string; sky: SkyKind; daytime: boolean;
  /** The weather service's words for the hour ("Chance Showers And Thunderstorms"). */
  label: string;
  humidity: number | null;
  /** Heat index when it's warm enough to matter (80°F and up), else the temperature. */
  feelsF: number | null;
};

/** A ring of [latitude, longitude] points (the outline of a warning area). */
export type Ring = [number, number][];

export type Alert = {
  event: string; severity: string; headline: string; ends: string | null; loud: boolean;
  /** What the weather service says to do, when it says ("Move to an interior room..."). */
  instruction: string;
  /** The warning's area, when the weather service drew one (storm-based warnings); empty for county-wide alerts. */
  areas: Ring[];
};

/** GeoJSON Polygon/MultiPolygon (lon, lat) → outer rings as [lat, lon]. Anything else → none. */
export function alertAreas(geometry: unknown): Ring[] {
  const g = geometry as { type?: string; coordinates?: unknown } | null;
  const ring = (r: unknown): Ring => (Array.isArray(r) ? r.filter((p) => Array.isArray(p) && p.length >= 2).map((p) => [Number(p[1]), Number(p[0])] as [number, number]) : []);
  if (g?.type === "Polygon" && Array.isArray(g.coordinates)) return [ring(g.coordinates[0])].filter((r) => r.length > 2);
  if (g?.type === "MultiPolygon" && Array.isArray(g.coordinates)) return (g.coordinates as unknown[]).map((poly) => ring(Array.isArray(poly) ? poly[0] : null)).filter((r) => r.length > 2);
  return [];
}

const SEVERITY_ORDER = ["Extreme", "Severe", "Moderate", "Minor", "Unknown"];

/** The weather service's active alerts for a point (warnings, watches, advisories), most severe first. */
export function summarizeAlerts(geojson: unknown, now: Date = new Date()): Alert[] {
  const features = (geojson as { features?: unknown[] })?.features;
  if (!Array.isArray(features)) return [];
  const out: Alert[] = [];
  for (const f of features) {
    const p = (f as { properties?: Record<string, unknown> })?.properties;
    const geometry = (f as { geometry?: unknown })?.geometry;
    if (!p || typeof p.event !== "string") continue;
    const ends = (typeof p.ends === "string" && p.ends) || (typeof p.expires === "string" && p.expires) || null;
    if (ends && new Date(ends) < now) continue;
    if (p.status && p.status !== "Actual") continue;
    const severity = typeof p.severity === "string" ? p.severity : "Unknown";
    const instruction = typeof p.instruction === "string" ? p.instruction.replace(/\s+/g, " ").trim().slice(0, 400) : "";
    out.push({
      event: p.event, severity, headline: typeof p.headline === "string" ? p.headline : p.event, ends,
      loud: severity === "Extreme" || severity === "Severe" || /warning/i.test(p.event), instruction, areas: alertAreas(geometry),
    });
  }
  const rank = (a: Alert) => (SEVERITY_ORDER.indexOf(a.severity) + 5) % 5 + (a.loud ? 0 : 5);
  return out.sort((a, b) => rank(a) - rank(b)).filter((a, i, all) => all.findIndex((x) => x.event === a.event) === i);
}

export type Conditions = {
  /** Which day the outlook is for: today, or tomorrow once today's work hours are over. */
  day: "today" | "tomorrow";
  dayKey: string;
  now: { tempF: number; shortForecast: string; windMph: number | null; windDirection: string; rainPct: number } | null;
  heat: HeatDay | null;
  rain: { maxPct: number; atHour: string; level: RainLevel } | null;
  wind: { maxMph: number; direction: string; atHour: string; level: WindLevel } | null;
  /** First work hour with thunderstorms in the forecast. */
  thunderAt: string | null;
  alerts: Alert[];
  /** Hour by hour for the rest of the work day (or tomorrow's). */
  hours: HourPoint[];
  /** The picture to lead with: the sky now (today) or the roughest sky of the day (tomorrow), and its temperature. */
  headline: { sky: SkyKind; daytime: boolean; tempF: number | null; label: string; highF: number | null; lowF: number | null };
};

type Period = { startTime?: string; isDaytime?: boolean; relativeHumidity?: { value: number | null } | number | null; temperature?: number | { value: number | null }; temperatureUnit?: string; shortForecast?: string;
  windSpeed?: string; windDirection?: string; probabilityOfPrecipitation?: { value: number | null } | number | null };

const num = (q: Period["probabilityOfPrecipitation"]) => (q == null ? null : typeof q === "number" ? q : q.value);
const tempF = (p: Period) => {
  const t = typeof p.temperature === "number" ? p.temperature : p.temperature?.value ?? null;
  return t == null ? null : p.temperatureUnit === "C" ? t * 9 / 5 + 32 : t;
};
const localDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * The work-day outlook from an api.weather.gov hourly forecast plus its active alerts. Looks from now to the end of
 * work hours; after work hours it looks at tomorrow. Times compare in the site's own local time (startTime's offset).
 */
export function conditionsFor(forecast: unknown, alerts: unknown, now: Date = new Date()): Conditions | null {
  const periods = ((forecast as { properties?: { periods?: Period[] } })?.properties?.periods ?? []).filter((p) => p.startTime);
  if (!periods.length) return null;
  // The site's local "now": the period that contains the current moment, else the first one.
  const current = periods.find((p) => {
    const s = new Date(p.startTime!).getTime();
    return s <= now.getTime() && now.getTime() < s + 3600_000;
  }) ?? periods[0];
  const siteDay = current.startTime!.slice(0, 10);
  const siteHour = Number(current.startTime!.slice(11, 13));
  const tomorrow = siteHour >= WORK_END_HOUR;
  const dayKey = tomorrow
    ? (periods.find((p) => p.startTime!.slice(0, 10) > siteDay)?.startTime!.slice(0, 10) ?? localDay(new Date(now.getTime() + 864e5)))
    : siteDay;

  const work = periods.filter((p) => {
    const day = p.startTime!.slice(0, 10), hour = Number(p.startTime!.slice(11, 13));
    return day === dayKey && hour >= WORK_START_HOUR && hour <= WORK_END_HOUR && (tomorrow || new Date(p.startTime!).getTime() + 3600_000 > now.getTime());
  });

  let rain: Conditions["rain"] = null, wind: Conditions["wind"] = null, thunderAt: string | null = null;
  for (const p of work) {
    const pct = num(p.probabilityOfPrecipitation) ?? 0;
    if (!rain || pct > rain.maxPct) rain = { maxPct: pct, atHour: p.startTime!, level: rainLevel(pct) };
    const mph = parseWindMph(p.windSpeed);
    if (mph != null && (!wind || mph > wind.maxMph)) wind = { maxMph: mph, direction: p.windDirection ?? "", atHour: p.startTime!, level: windLevel(mph) };
    if (!thunderAt && /thunder/i.test(p.shortForecast ?? "")) thunderAt = p.startTime!;
  }
  const t = tempF(current);
  const hours: HourPoint[] = work.slice(0, 14).map((p) => {
    const tf = tempF(p), rh = num(p.relativeHumidity);
    const feels = tf == null ? null : rh != null && tf >= 80 ? Math.round(heatIndexF(tf, rh)) : Math.round(tf);
    return { time: p.startTime!, tempF: tf == null ? null : Math.round(tf), rainPct: num(p.probabilityOfPrecipitation) ?? 0, windMph: parseWindMph(p.windSpeed),
      windDirection: p.windDirection ?? "", sky: skyKind(p.shortForecast), daytime: p.isDaytime ?? (() => { const h = Number(p.startTime!.slice(11, 13)); return h >= 7 && h < 19; })(),
      label: p.shortForecast ?? "", humidity: rh == null ? null : Math.round(rh), feelsF: feels };
  });
  const temps = hours.map((h) => h.tempF).filter((x): x is number => x != null);
  let roughest: Period | null = null;
  for (const p of work) if (!roughest || SKY_ORDER.indexOf(skyKind(p.shortForecast)) > SKY_ORDER.indexOf(skyKind(roughest.shortForecast))) roughest = p;
  const lead = tomorrow ? roughest ?? current : current;
  const headline = {
    sky: skyKind(lead.shortForecast),
    daytime: tomorrow ? true : current.isDaytime ?? (siteHour >= 7 && siteHour < 19),
    tempF: tomorrow ? (temps.length ? Math.max(...temps) : null) : t == null ? null : Math.round(t),
    label: lead.shortForecast ?? "",
    highF: temps.length ? Math.max(...temps) : null,
    lowF: temps.length ? Math.min(...temps) : null,
  };
  return {
    day: tomorrow ? "tomorrow" : "today",
    dayKey,
    now: tomorrow || t == null ? null : {
      tempF: Math.round(t), shortForecast: current.shortForecast ?? "", windMph: parseWindMph(current.windSpeed),
      windDirection: current.windDirection ?? "", rainPct: num(current.probabilityOfPrecipitation) ?? 0,
    },
    heat: heatForDay(forecast, dayKey),
    rain, wind, thunderAt,
    alerts: summarizeAlerts(alerts, now),
    hours, headline,
  };
}

/** Short, plain notes for the crew. Information only: the crew lead decides what to do. */
export function conditionNotes(c: Conditions): string[] {
  const out: string[] = [];
  if (c.thunderAt) out.push("Thunderstorms in the forecast. When thunder roars, get off the roof and out of lifts.");
  if (c.wind?.level === "high") out.push("High wind. Check limits for lifts, cranes and edge work before you start.");
  else if (c.wind?.level === "windy") out.push("Windy. Secure loose materials, sheets and debris on the roof.");
  if (c.rain?.level === "likely") out.push("Rain likely. Plan for slick surfaces and cover open work.");
  return out;
}

export type Attention = { level: "alert" | "caution"; reason: string };

/**
 * When the weather card should draw attention to itself (a border around it), and why. Only for unusual days, so
 * it keeps meaning something: red for a weather service warning, high wind, or extreme heat danger; amber for
 * thunderstorms, wind, or heat danger. An ordinary hot or rainy day gets no border (its notes still show).
 */
export function attention(c: Conditions, now: Date = new Date()): Attention | null {
  const fmt = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric" });
  const warning = c.alerts.find((a) => a.loud);
  if (warning) return { level: "alert", reason: warning.event };
  if (c.wind?.level === "high") return { level: "alert", reason: `High wind, up to ${c.wind.maxMph} mph` };
  if (c.heat?.level === "extreme_danger") return { level: "alert", reason: `Extreme heat, heat index ${c.heat.maxHeatIndexF}°` };
  if (c.thunderAt) {
    const soon = new Date(c.thunderAt).getTime() <= now.getTime() + 3600_000 && c.day === "today";
    return { level: "caution", reason: soon ? "Thunderstorms now or within the hour" : `Thunderstorms from about ${fmt(c.thunderAt)}` };
  }
  if (c.wind?.level === "windy") return { level: "caution", reason: `Windy, up to ${c.wind.maxMph} mph` };
  if (c.heat?.level === "danger") return { level: "caution", reason: `Heat danger, heat index ${c.heat.maxHeatIndexF}°` };
  return null;
}

/** "2026-10-06T14:00:00-04:00" → "2 PM", in the jobsite's own time (from the forecast's own offset). */
export function siteHour(iso: string): string {
  const h = Number(iso.slice(11, 13));
  return `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;
}

/**
 * The work day in a sentence or two, the way a foreman would say it: "Thunderstorms likely from 2 PM, wettest around
 * 3 PM, clearing by 6 PM. Heat index up to 104° around 1 PM." Information only.
 */
export function daySummary(c: Conditions): string {
  const hs = c.hours;
  if (!hs.length) return "";
  const parts: string[] = [];
  const wet = hs.map((h) => h.rainPct >= 50);
  const first = wet.indexOf(true), last = wet.lastIndexOf(true);
  if (first < 0) {
    const peak = hs.reduce((a, b) => (b.rainPct > a.rainPct ? b : a));
    parts.push(peak.rainPct >= 30 ? `Mostly dry, with a ${peak.rainPct}% chance of a shower around ${siteHour(peak.time)}.` : `Dry through the work day.`);
  } else {
    const window = hs.slice(first, last + 1);
    const storm = window.some((h) => h.sky === "thunder");
    const peak = window.reduce((a, b) => (b.rainPct > a.rainPct ? b : a));
    const start = first === 0 ? (c.day === "today" ? "now" : "at the start of the day") : `from ${siteHour(hs[first].time)}`;
    const bits = [`${storm ? "Thunderstorms" : "Rain"} likely ${start}`];
    if (window.length > 2 && peak.time !== hs[first].time) bits.push(`wettest around ${siteHour(peak.time)}`);
    bits.push(last === hs.length - 1 ? "through the end of the work day" : `clearing by ${siteHour(hs[last + 1].time)}`);
    parts.push(bits.join(", ") + ".");
  }
  if (c.heat && c.heat.level !== "none" && c.heat.level !== "caution") parts.push(`Heat index up to ${c.heat.maxHeatIndexF}° around ${siteHour(c.heat.atHour)}.`);
  if (c.wind && (c.wind.level === "windy" || c.wind.level === "high")) parts.push(`Wind up to ${c.wind.maxMph} mph around ${siteHour(c.wind.atHour)}.`);
  return parts.join(" ");
}

