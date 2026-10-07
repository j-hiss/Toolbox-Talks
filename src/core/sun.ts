// Sunrise and sunset for a place and day (the NOAA sunrise equation, good to within a couple of minutes), and which
// part of the day it is, so the weather sky can show dawn and dusk at the real times. Pure.
const RAD = Math.PI / 180;
const ZENITH = 90.833; // the sun's top edge at the horizon, with refraction

function utcHours(dayOfYear: number, lat: number, lon: number, rising: boolean): number | null {
  const lngHour = lon / 15;
  const t = dayOfYear + ((rising ? 6 : 18) - lngHour) / 24;
  const M = 0.9856 * t - 3.289;
  let L = M + 1.916 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 282.634;
  L = ((L % 360) + 360) % 360;
  let RA = Math.atan(0.91764 * Math.tan(L * RAD)) / RAD;
  RA = ((RA % 360) + 360) % 360;
  RA = (RA + (Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90)) / 15;
  const sinDec = 0.39782 * Math.sin(L * RAD), cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(ZENITH * RAD) - sinDec * Math.sin(lat * RAD)) / (cosDec * Math.cos(lat * RAD));
  if (cosH > 1 || cosH < -1) return null; // polar day or night
  const H = (rising ? 360 - Math.acos(cosH) / RAD : Math.acos(cosH) / RAD) / 15;
  const T = H + RA - 0.06571 * t - 6.622;
  return ((T - lngHour) % 24 + 24) % 24;
}

/** Sunrise and sunset (as moments in time) for the calendar day `y-m-d` at a place. Null near the poles. */
export function sunTimes(y: number, m: number, d: number, lat: number, lon: number): { sunrise: Date; sunset: Date } | null {
  const start = Date.UTC(y, m - 1, d), dayOfYear = Math.round((start - Date.UTC(y, 0, 0)) / 864e5);
  const r = utcHours(dayOfYear, lat, lon, true), s = utcHours(dayOfYear, lat, lon, false);
  if (r == null || s == null) return null;
  // Times are UTC hours on that date; west of Greenwich, sunset can fall after UTC midnight.
  const sunrise = new Date(start + r * 3600_000);
  let sunset = new Date(start + s * 3600_000);
  if (sunset <= sunrise) sunset = new Date(sunset.getTime() + 864e5);
  return { sunrise, sunset };
}

export type SkyPhase = "dawn" | "day" | "dusk" | "night";

/** Dawn runs from 45 min before sunrise to 35 min after; dusk from 35 min before sunset to 45 min after. */
export function skyPhase(now: Date, sun: { sunrise: Date; sunset: Date } | null): SkyPhase {
  if (!sun) return "day";
  const t = now.getTime(), r = sun.sunrise.getTime(), s = sun.sunset.getTime(), m = 60_000;
  if (t >= r - 45 * m && t <= r + 35 * m) return "dawn";
  if (t >= s - 35 * m && t <= s + 45 * m) return "dusk";
  return t > r && t < s ? "day" : "night";
}
