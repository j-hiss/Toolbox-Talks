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
