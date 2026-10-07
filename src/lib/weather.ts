// Jobsite weather from the National Weather Service (api.weather.gov: free, no key, US only). The phone calls it
// directly. Answers are kept on the phone, so the last check still shows with no signal.
// The judging (heat index, rain, wind, thunder, alerts) is in src/core/heat.ts and src/core/conditions.ts.
import { heatForDay, type HeatDay } from "@/core/heat";
import { conditionsFor, type Conditions } from "@/core/conditions";
import type { Point } from "@/core/geo";

export type HeatCheck = HeatDay & { checkedAt: string; source: "NWS"; place: string };
export type ConditionsCheck = Conditions & { checkedAt: string; source: "NWS"; place: string; alertsUnavailable: boolean; v: number };

/** Bump when the saved shape changes, so a phone never shows a check saved by an older version of the app. */
export const CONDITIONS_VERSION = 3;

/** How long a live conditions check is reused before asking the weather service again. */
export const CONDITIONS_FRESH_MS = 15 * 60_000;

const at = (p: Point) => `${p.latitude.toFixed(4)},${p.longitude.toFixed(4)}`;
const short = (p: Point) => `${p.latitude.toFixed(2)},${p.longitude.toFixed(2)}`;
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function readJson<T>(key: string): T | null {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
}
function writeJson(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* full or private: fine */ }
}

async function get(url: string) {
  const r = await fetch(url, { headers: { Accept: "application/geo+json" } });
  if (!r.ok) throw new Error(r.status === 404 ? "The weather service doesn't cover this location." : `Weather service error ${r.status}.`);
  return r.json();
}

/** Which forecast covers a point, and the nearest town. Rarely changes, so it's remembered on the phone. */
async function pointInfo(p: Point): Promise<{ forecastHourly: string; place: string }> {
  const key = `tt-nws-point-${short(p)}`;
  const hit = readJson<{ forecastHourly: string; place: string }>(key);
  if (hit) return hit;
  const point = await get(`https://api.weather.gov/points/${at(p)}`);
  const forecastHourly: string | undefined = point?.properties?.forecastHourly;
  if (!forecastHourly) throw new Error("No hourly forecast for this location.");
  const rel = point.properties.relativeLocation?.properties;
  const out = { forecastHourly, place: [rel?.city, rel?.state].filter(Boolean).join(", ") };
  writeJson(key, out);
  return out;
}

// --- Heat for a talk (saved with the record) -------------------------------------------------------------------

const heatKey = (p: Point, day: string) => `tt-heat-${day}-${short(p)}`;

export function cachedHeat(p: Point): HeatCheck | null {
  return readJson<HeatCheck>(heatKey(p, dayKey()));
}

/** Null when the forecast has nothing for today (late at night, or outside the US). Throws when it can't be reached. */
export async function checkHeat(p: Point): Promise<HeatCheck | null> {
  const hit = cachedHeat(p);
  if (hit && Date.now() - new Date(hit.checkedAt).getTime() < 3 * 3600_000) return hit;
  const info = await pointInfo(p);
  const day = heatForDay(await get(info.forecastHourly), dayKey());
  if (!day) return null;
  const out: HeatCheck = { ...day, checkedAt: new Date().toISOString(), source: "NWS", place: info.place };
  writeJson(heatKey(p, dayKey()), out);
  return out;
}

// --- Live conditions for Home ------------------------------------------------------------------------------------

const condKey = (p: Point) => `tt-wx-${short(p)}`;

/** The last conditions check for this place, however old (shown with its time when there's no signal). */
export function cachedConditions(p: Point): ConditionsCheck | null {
  const hit = readJson<ConditionsCheck>(condKey(p));
  return hit?.v === CONDITIONS_VERSION ? hit : null;
}

/**
 * Heat, rain, wind, thunder and active alerts for the rest of the work day (tomorrow after work hours).
 * Reuses a check from the last 15 minutes unless `force`. Alerts failing alone doesn't hide the forecast.
 */
export async function checkConditions(p: Point, force = false): Promise<ConditionsCheck | null> {
  const hit = cachedConditions(p);
  if (!force && hit && Date.now() - new Date(hit.checkedAt).getTime() < CONDITIONS_FRESH_MS) return hit;
  const info = await pointInfo(p);
  const [forecast, alerts] = await Promise.all([
    get(info.forecastHourly),
    get(`https://api.weather.gov/alerts/active?point=${at(p)}`).catch(() => null),
  ]);
  const c = conditionsFor(forecast, alerts);
  if (!c) return null;
  const out: ConditionsCheck = { ...c, checkedAt: new Date().toISOString(), source: "NWS", place: info.place, alertsUnavailable: alerts === null, v: CONDITIONS_VERSION };
  writeJson(condKey(p), out);
  return out;
}
