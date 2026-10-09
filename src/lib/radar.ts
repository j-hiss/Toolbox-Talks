// Where the radar map's pictures come from. Both are image tiles the phone loads directly (no key, no server).
// * Street map: OpenStreetMap's public tiles. Free with attribution and light use, which suits testing. Before the
//   app is sold, point BASEMAP at a paid map provider (same tile scheme, one line here).
// * Radar: the National Weather Service's NEXRAD radar mosaic, as map tiles from the Iowa Environmental Mesonet
//   (Iowa State University). It keeps the latest scan, named layers for the last 50 minutes, and an archive of every
//   5-minute scan by its UTC time ("ridge::USCOMP-N0Q-YYYYMMDDHHMI"), which is how the longer loops reach back.
export const BASEMAP = {
  tile: (z: number, x: number, y: number) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
  credit: "© OpenStreetMap contributors",
};

/**
 * How far back the loop goes. Each span has 13 frames, so a longer loop loads no more pictures, it just steps
 * further between them (1 hour: every 5 minutes; 3 hours: every 15; 6 hours: every 30).
 */
export const RADAR_SPANS = [
  { hours: 1, step: 5 },
  { hours: 3, step: 15 },
  { hours: 6, step: 30 },
] as const;
export type RadarSpan = (typeof RADAR_SPANS)[number]["hours"];

/** Radar frames for a span, oldest first: minutes before the latest scan. */
export function radarFrames(hours: RadarSpan): number[] {
  const span = RADAR_SPANS.find((s) => s.hours === hours) ?? RADAR_SPANS[0];
  const out: number[] = [];
  for (let m = hours * 60; m >= 0; m -= span.step) out.push(m);
  return out;
}

const IEM = "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0";

/** The archive name for the scan `minutesAgo` before `latest` (UTC, on the 5-minute mark). */
export function radarStamp(latest: Date, minutesAgo: number): string {
  const t = new Date(latest.getTime() - minutesAgo * 60_000);
  t.setUTCSeconds(0, 0);
  t.setUTCMinutes(t.getUTCMinutes() - (t.getUTCMinutes() % 5));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getUTCFullYear()}${p(t.getUTCMonth() + 1)}${p(t.getUTCDate())}${p(t.getUTCHours())}${p(t.getUTCMinutes())}`;
}

/** When the latest scan probably was, if the listing couldn't be read: the 5-minute mark before last. */
export function guessLatest(now = new Date()): Date {
  const t = new Date(now.getTime() - 5 * 60_000);
  t.setUTCSeconds(0, 0);
  t.setUTCMinutes(t.getUTCMinutes() - (t.getUTCMinutes() % 5));
  return t;
}

export const RADAR = {
  /** The last 50 minutes use the named layers; older scans come from the archive by time. */
  tile: (minutesAgo: number, z: number, x: number, y: number, latest: Date = guessLatest()) =>
    minutesAgo <= 50 && minutesAgo % 5 === 0
      ? `${IEM}/nexrad-n0q-900913${minutesAgo ? `-m${String(minutesAgo).padStart(2, "0")}m` : ""}/${z}/${x}/${y}.png`
      : `${IEM}/ridge::USCOMP-N0Q-${radarStamp(latest, minutesAgo)}/${z}/${x}/${y}.png`,
  credit: "Radar: NWS NEXRAD via Iowa Environmental Mesonet",
  minZoom: 6,
  maxZoom: 10,
};

/** "50 min earlier", "2 hr earlier", "2 hr 30 min earlier". */
export function agoLabel(minutes: number): string {
  if (minutes === 0) return "Latest";
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return `${h ? `${h} hr` : ""}${h && m ? " " : ""}${m ? `${m} min` : ""} earlier`;
}

/**
 * When the latest radar scan was taken, so the loop can show clock times. The Iowa Environmental Mesonet lists it in
 * a small JSON file; if that can't be read, the loop falls back to "5 min earlier" style labels. Kept for 4 minutes.
 */
let latest: { at: number; value: Date | null } | null = null;
export async function radarLatest(): Promise<Date | null> {
  if (latest && Date.now() - latest.at < 240_000) return latest.value;
  let value: Date | null = null;
  try {
    const r = await fetch("https://mesonet.agron.iastate.edu/json/tms.json");
    if (r.ok) value = findValid(await r.json());
  } catch { /* fall back to relative labels */ }
  latest = { at: Date.now(), value };
  return value;
}

/** Looks through the listing for the base-reflectivity mosaic's "utc_valid" time. Tolerant of the listing's shape. */
export function findValid(json: unknown): Date | null {
  const stack: unknown[] = [json];
  while (stack.length) {
    const v = stack.pop();
    if (Array.isArray(v)) { stack.push(...v); continue; }
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      const name = `${o.id ?? ""} ${o.layername ?? ""} ${o.name ?? ""}`;
      if (/n0q/i.test(name) && typeof o.utc_valid === "string") {
        const d = new Date(o.utc_valid);
        if (!Number.isNaN(d.getTime())) return d;
      }
      stack.push(...Object.values(o));
    }
  }
  return null;
}

// Forecast -----------------------------------------------------------------------------------------------------------
// The next 6 hours come from NOAA's HRRR weather model (simulated radar), as tiles from the same Iowa Environmental
// Mesonet server. It is a model forecast, not radar: the map labels it that way and never mixes it into the
// observed loop. Layer names count minutes from the model run's start ("F0480" = 8 hours after the run began), and
// a run is ready about 2 hours after it starts, so "6 hours from now" is around F0480-F0540 of the latest run.
// NOAA plans to replace HRRR with RRFS some day; the layer name lives in this one place.

export const FORECAST = {
  layer: (forecastMinute: number, run: string) => `hrrr::REFD-F${String(forecastMinute).padStart(4, "0")}-${run}`,
  /** Explicit run names are stable, so tiles come from the long-cache path (good for phones with weak signal). */
  tile: (forecastMinute: number, run: string, z: number, x: number, y: number) =>
    `https://mesonet.agron.iastate.edu/c/tile.py/1.0.0/${FORECAST.layer(forecastMinute, run)}/${z}/${x}/${y}.png`,
  credit: "Forecast: NOAA HRRR model via Iowa Environmental Mesonet",
  /** The model's tiles reach 18 hours (1080 minutes) past the run's start, every 15 minutes. */
  maxMinute: 1080,
  step: 15,
};

/** Forecast frames: minutes from now, every 30 minutes out to 6 hours (12 frames). */
export const forecastFrames = (): number[] => Array.from({ length: 12 }, (_, i) => (i + 1) * 30);

/** The run name the tiles use: the model run's start as YYYYMMDDHHMI (UTC). */
export function runName(init: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${init.getUTCFullYear()}${p(init.getUTCMonth() + 1)}${p(init.getUTCDate())}${p(init.getUTCHours())}${p(init.getUTCMinutes())}`;
}

/**
 * The forecast minute (from the run's start) closest to `minutesAhead` from `now`, on the model's 15-minute steps.
 * Null when that's beyond what the run covers.
 */
export function forecastMinute(init: Date, now: Date, minutesAhead: number): number | null {
  const m = Math.round((now.getTime() + minutesAhead * 60_000 - init.getTime()) / 60_000 / FORECAST.step) * FORECAST.step;
  return m >= 0 && m <= FORECAST.maxMinute ? m : null;
}

/** The model covers the lower 48 states only, so the forecast is offered only there (a generous box around them). */
export const forecastCovers = (lat: number, lon: number) => lat >= 24 && lat <= 50 && lon >= -125.5 && lon <= -66.5;

/** When the latest model run started (from the server's small JSON file). Kept 10 minutes; null when unknown. */
let run: { at: number; value: Date | null } | null = null;
export async function forecastRun(): Promise<Date | null> {
  if (run && Date.now() - run.at < 600_000) return run.value;
  let value: Date | null = null;
  try {
    const r = await fetch("https://mesonet.agron.iastate.edu/data/gis/images/4326/hrrr/refd_1080.json");
    if (r.ok) value = parseRun(await r.json());
  } catch { /* no forecast without a known run */ }
  run = { at: Date.now(), value };
  return value;
}

/** Reads "model_init_utc" from that file. */
export function parseRun(json: unknown): Date | null {
  const v = json && typeof json === "object" ? (json as Record<string, unknown>).model_init_utc : null;
  if (typeof v !== "string") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "In 30 min", "In 2 hr", "In 4 hr 30 min". */
export function aheadLabel(minutes: number): string {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return `In ${h ? `${h} hr` : ""}${h && m ? " " : ""}${m ? `${m} min` : ""}`;
}
