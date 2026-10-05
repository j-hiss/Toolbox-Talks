// Distances and "which jobsite am I at". Pure module.

export type Point = { latitude: number; longitude: number };

const EARTH_RADIUS_M = 6_371_000;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in meters (haversine). Accurate to well under 1% at jobsite scale. */
export function distanceMeters(a: Point, b: Point): number {
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Within this distance the app treats you as "at" the jobsite. Big sites and weak GPS both need room. */
export const AT_SITE_METERS = 400;

export type NearestResult<T> = { site: T; meters: number; atSite: boolean } | null;

/**
 * The closest jobsite that has a GPS point. Sites without coordinates are skipped, never guessed.
 * `atSite` is true only within AT_SITE_METERS; otherwise the caller should ask instead of assuming.
 */
export function nearestJobsite<T extends { latitude: number | null; longitude: number | null }>(
  sites: T[],
  here: Point,
): NearestResult<T> {
  let best: NearestResult<T> = null;
  for (const site of sites) {
    if (site.latitude == null || site.longitude == null) continue;
    const meters = distanceMeters(here, { latitude: site.latitude, longitude: site.longitude });
    if (!best || meters < best.meters) best = { site, meters, atSite: meters <= AT_SITE_METERS };
  }
  return best;
}

/** "120 ft" up close, "2.4 mi" farther away. US units: crews think in feet and miles. */
export function formatDistance(meters: number): string {
  const feet = meters * 3.28084;
  if (feet < 1000) return `${Math.round(feet / 10) * 10} ft`;
  const miles = meters / 1609.344;
  return `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`;
}

/** A link that opens the point in the phone's maps app (works on iPhone and Android). */
export function mapsLink(p: Point): string {
  return `https://www.google.com/maps/search/?api=1&query=${p.latitude.toFixed(6)},${p.longitude.toFixed(6)}`;
}
