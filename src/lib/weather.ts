// Today's heat at a place, from the National Weather Service (api.weather.gov: free, no key, US only).
// The phone calls it directly. The answer is kept on the phone for the day, so it still shows with no signal later.
// The judging (heat index, levels) is in src/core/heat.ts.
import { heatForDay, type HeatDay } from "@/core/heat";
import type { Point } from "@/core/geo";

export type HeatCheck = HeatDay & { checkedAt: string; source: "NWS"; place: string };

const cacheKey = (p: Point, day: string) => `tt-heat-${day}-${p.latitude.toFixed(2)},${p.longitude.toFixed(2)}`;
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function cachedHeat(p: Point): HeatCheck | null {
  try { const raw = localStorage.getItem(cacheKey(p, dayKey())); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

/** Null when the forecast has nothing for today (late at night, or outside the US). Throws when it can't be reached. */
export async function checkHeat(p: Point): Promise<HeatCheck | null> {
  const hit = cachedHeat(p);
  if (hit && Date.now() - new Date(hit.checkedAt).getTime() < 3 * 3600_000) return hit;
  const get = async (url: string) => {
    const r = await fetch(url, { headers: { Accept: "application/geo+json" } });
    if (!r.ok) throw new Error(r.status === 404 ? "The weather service doesn't cover this location." : `Weather service error ${r.status}.`);
    return r.json();
  };
  const point = await get(`https://api.weather.gov/points/${p.latitude.toFixed(4)},${p.longitude.toFixed(4)}`);
  const url: string | undefined = point?.properties?.forecastHourly;
  if (!url) throw new Error("No hourly forecast for this location.");
  const place = [point.properties.relativeLocation?.properties?.city, point.properties.relativeLocation?.properties?.state].filter(Boolean).join(", ");
  const day = heatForDay(await get(url), dayKey());
  if (!day) return null;
  const out: HeatCheck = { ...day, checkedAt: new Date().toISOString(), source: "NWS", place };
  try { localStorage.setItem(cacheKey(p, dayKey()), JSON.stringify(out)); } catch { /* fine */ }
  return out;
}
