// Demo version of src/lib/weather.ts. The preview can't reach the weather service, so it returns an EXAMPLE
// hot-day forecast (labelled as such) so the heat banner and reminder can be tried.
import type * as Real from "@/../src/lib/weather";
import { heatIndexF, heatLevel } from "@/core/heat";
import type { Point } from "@/core/geo";
import { tick } from "./store";

export type HeatCheck = Real.HeatCheck;

const example = (): HeatCheck => {
  const hi = Math.round(heatIndexF(93, 62));
  const at = new Date(); at.setHours(14, 0, 0, 0);
  return { maxHeatIndexF: hi, atHour: at.toISOString(), level: heatLevel(hi), tempF: 93, humidity: 62, checkedAt: new Date().toISOString(), source: "NWS", place: "Example forecast (preview)" };
};

export function cachedHeat(p: Point): HeatCheck | null { void p; return example(); }
export async function checkHeat(p: Point): Promise<HeatCheck | null> { void p; await tick(); return example(); }

const _sameShape = { cachedHeat, checkHeat } satisfies Omit<typeof Real, never>;
void _sameShape;
