// Web-map tile math (the standard "slippy map" scheme used by OpenStreetMap and most radar tile services).
// Pure: which tiles cover a box around a point, and where to place each one so the point sits in the middle.

/** Fractional tile coordinates of a point at a zoom level. */
export function tileXY(lat: number, lon: number, z: number): { x: number; y: number } {
  const n = 2 ** z, r = (lat * Math.PI) / 180;
  return { x: ((lon + 180) / 360) * n, y: ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n };
}

export type PlacedTile = { x: number; y: number; z: number; left: number; top: number };

/**
 * The tiles (256 px) needed to fill a width × height view centered on lat/lon, with each tile's pixel position.
 * Tiles off the top or bottom of the world are left out; x wraps around the date line.
 */
export function tilesFor(lat: number, lon: number, z: number, width: number, height: number, size = 256): PlacedTile[] {
  const c = tileXY(lat, lon, z), n = 2 ** z;
  const x0 = Math.floor(c.x - width / 2 / size), x1 = Math.floor(c.x + width / 2 / size);
  const y0 = Math.floor(c.y - height / 2 / size), y1 = Math.floor(c.y + height / 2 / size);
  const out: PlacedTile[] = [];
  for (let ty = y0; ty <= y1; ty++) {
    if (ty < 0 || ty >= n) continue;
    for (let tx = x0; tx <= x1; tx++) {
      out.push({ x: ((tx % n) + n) % n, y: ty, z, left: Math.round(width / 2 + (tx - c.x) * size), top: Math.round(height / 2 + (ty - c.y) * size) });
    }
  }
  return out;
}

/** Roughly how many miles the view spans across, for the scale note. */
export function milesAcross(lat: number, z: number, width: number): number {
  const metersPerPx = (156543.03392 * Math.cos((lat * Math.PI) / 180)) / 2 ** z;
  return (metersPerPx * width) / 1609.34;
}
