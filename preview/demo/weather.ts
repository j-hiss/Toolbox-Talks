// Demo version of src/lib/weather.ts. The preview can't reach the weather service, so it returns an EXAMPLE
// hot, stormy afternoon (labelled as such) so the heat banner, reminder and jobsite weather card can be tried.
import type * as Real from "@/../src/lib/weather";
import { heatIndexF, heatLevel } from "@/core/heat";
import { conditionsFor } from "@/core/conditions";
import type { Point } from "@/core/geo";
import { tick } from "./store";

export type HeatCheck = Real.HeatCheck;
export type ConditionsCheck = Real.ConditionsCheck;
export const CONDITIONS_FRESH_MS = 15 * 60_000;
export const CONDITIONS_VERSION = 2;

const example = (): HeatCheck => {
  const hi = Math.round(heatIndexF(93, 62));
  const at = new Date(); at.setHours(14, 0, 0, 0);
  return { maxHeatIndexF: hi, atHour: at.toISOString(), level: heatLevel(hi), tempF: 93, humidity: 62, checkedAt: new Date().toISOString(), source: "NWS", place: "Example forecast (preview)" };
};

// An example hourly forecast for today and tomorrow in this browser's time, built the same way the service sends it.
const exampleConditions = (): ConditionsCheck => {
  const iso = (d: Date) => {
    const off = -d.getTimezoneOffset(), sign = off >= 0 ? "+" : "-", hh = String(Math.floor(Math.abs(off) / 60)).padStart(2, "0"), mm = String(Math.abs(off) % 60).padStart(2, "0");
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00:00${sign}${hh}:${mm}`;
  };
  const periods = [];
  const start = new Date(); start.setMinutes(0, 0, 0);
  for (let i = 0; i < 36; i++) {
    const d = new Date(start.getTime() + i * 3600_000), h = d.getHours();
    const storm = h >= 14 && h <= 17;
    periods.push({
      startTime: iso(d), temperature: h >= 11 && h <= 16 ? 93 : 84, temperatureUnit: "F", relativeHumidity: { value: 62 },
      probabilityOfPrecipitation: { value: storm ? 70 : 15 }, windSpeed: storm ? "15 to 25 mph" : "5 to 10 mph", windDirection: "SE",
      shortForecast: storm ? "Showers And Thunderstorms Likely" : "Partly Sunny",
    });
  }
  const c = conditionsFor({ properties: { periods } }, { features: [] })!;
  return { ...c, checkedAt: new Date().toISOString(), source: "NWS", place: "Example forecast (preview)", alertsUnavailable: false, v: CONDITIONS_VERSION };
};

export function cachedHeat(p: Point): HeatCheck | null { void p; return example(); }
export async function checkHeat(p: Point): Promise<HeatCheck | null> { void p; await tick(); return example(); }
export function cachedConditions(p: Point): ConditionsCheck | null { void p; return null; }
export async function checkConditions(p: Point, force = false): Promise<ConditionsCheck | null> { void p; void force; await tick(); return exampleConditions(); }

const _sameShape = { cachedHeat, checkHeat, cachedConditions, checkConditions, CONDITIONS_FRESH_MS, CONDITIONS_VERSION } satisfies Omit<typeof Real, never>;
void _sameShape;
