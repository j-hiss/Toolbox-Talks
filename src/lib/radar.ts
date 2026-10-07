// Where the radar map's pictures come from. Both are image tiles the phone loads directly (no key, no server).
// * Street map: OpenStreetMap's public tiles. Free with attribution and light use, which suits testing. Before the
//   app is sold, point BASEMAP at a paid map provider (same tile scheme, one line here).
// * Radar: the National Weather Service's NEXRAD radar mosaic, as map tiles from the Iowa Environmental Mesonet
//   (Iowa State University), which keeps the latest scan plus one every 5 minutes for the last 50 minutes.
export const BASEMAP = {
  tile: (z: number, x: number, y: number) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
  credit: "© OpenStreetMap contributors",
};

/** Radar frames, oldest first: minutes before the latest scan. */
export const RADAR_FRAMES = [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0] as const;

export const RADAR = {
  tile: (minutesAgo: number, z: number, x: number, y: number) =>
    `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913${minutesAgo ? `-m${String(minutesAgo).padStart(2, "0")}m` : ""}/${z}/${x}/${y}.png`,
  credit: "Radar: NWS NEXRAD via Iowa Environmental Mesonet",
  minZoom: 6,
  maxZoom: 10,
};

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
