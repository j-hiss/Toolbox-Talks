// Heat index and the day's heat level for a jobsite. Pure module: the one place heat is judged.
// Formula: the National Weather Service heat index (Rothfusz regression with its low/high humidity adjustments).
// Levels follow the NWS heat index chart: caution 80–90°F, extreme caution 91–102°F, danger 103–124°F,
// extreme danger 125°F and up. The forecast itself comes from api.weather.gov (see src/lib/weather.ts).

export type HeatLevel = "none" | "caution" | "extreme_caution" | "danger" | "extreme_danger";

export const HEAT_LABEL: Record<HeatLevel, string> = {
  none: "No heat concern",
  caution: "Caution",
  extreme_caution: "Extreme caution",
  danger: "Danger",
  extreme_danger: "Extreme danger",
};

/** NWS heat index in °F from air temperature (°F) and relative humidity (%). */
export function heatIndexF(t: number, rh: number): number {
  const simple = 0.5 * (t + 61 + (t - 68) * 1.2 + rh * 0.094);
  if ((simple + t) / 2 < 80) return simple;
  let hi = -42.379 + 2.04901523 * t + 10.14333127 * rh - 0.22475541 * t * rh - 0.00683783 * t * t
    - 0.05481717 * rh * rh + 0.00122874 * t * t * rh + 0.00085282 * t * rh * rh - 0.00000199 * t * t * rh * rh;
  if (rh < 13 && t >= 80 && t <= 112) hi -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
  else if (rh > 85 && t >= 80 && t <= 87) hi += ((rh - 85) / 10) * ((87 - t) / 5);
  return hi;
}

export function heatLevel(hiF: number): HeatLevel {
  if (hiF >= 125) return "extreme_danger";
  if (hiF >= 103) return "danger";
  if (hiF >= 91) return "extreme_caution";
  if (hiF >= 80) return "caution";
  return "none";
}

/** Show the heat banner and offer the heat reminder from "extreme caution" up. */
export const alertWorthy = (l: HeatLevel) => l === "extreme_caution" || l === "danger" || l === "extreme_danger";

type Quantity = number | { value: number | null; unitCode?: string } | null | undefined;
const toF = (q: Quantity, unit?: string): number | null => {
  if (q == null) return null;
  if (typeof q === "number") return unit === "C" ? q * 9 / 5 + 32 : q;
  if (q.value == null) return null;
  return q.unitCode?.endsWith("degC") ? q.value * 9 / 5 + 32 : q.value;
};
const toNum = (q: Quantity): number | null => (q == null ? null : typeof q === "number" ? q : q.value);

export type HeatDay = { maxHeatIndexF: number; atHour: string; level: HeatLevel; tempF: number; humidity: number };

/**
 * The hottest heat index during work hours (6 AM–7 PM) on `dayKey` (YYYY-MM-DD, local to the jobsite) from an
 * api.weather.gov hourly forecast. Accepts temperature as a number with temperatureUnit, or as a value object.
 * Returns null when the forecast has no hours for that day.
 */
export function heatForDay(forecast: unknown, dayKey: string): HeatDay | null {
  const periods = (forecast as { properties?: { periods?: unknown[] } })?.properties?.periods;
  if (!Array.isArray(periods)) return null;
  let best: HeatDay | null = null;
  for (const raw of periods) {
    const p = raw as { startTime?: string; temperature?: Quantity; temperatureUnit?: string; relativeHumidity?: Quantity };
    if (!p.startTime || p.startTime.slice(0, 10) !== dayKey) continue; // startTime carries the site's own offset
    const hour = Number(p.startTime.slice(11, 13));
    if (hour < 6 || hour > 19) continue;
    const t = toF(p.temperature, p.temperatureUnit);
    const rh = toNum(p.relativeHumidity);
    if (t == null || rh == null) continue;
    const hi = Math.round(heatIndexF(t, rh));
    if (!best || hi > best.maxHeatIndexF) best = { maxHeatIndexF: hi, atHour: p.startTime, level: heatLevel(hi), tempF: Math.round(t), humidity: Math.round(rh) };
  }
  return best;
}
