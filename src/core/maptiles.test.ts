import { describe, expect, it } from "vitest";
import { milesAcross, tileXY, tilesFor } from "./maptiles";

describe("map tiles", () => {
  it("finds the standard tile for a point (Fort Myers area, zoom 8)", () => {
    const t = tileXY(26.64, -81.87, 8);
    expect(Math.floor(t.x)).toBe(69);
    expect(Math.floor(t.y)).toBe(108);
  });

  it("covers the whole view and puts the point in the middle", () => {
    const tiles = tilesFor(26.64, -81.87, 8, 390, 220);
    const minL = Math.min(...tiles.map((t) => t.left)), maxR = Math.max(...tiles.map((t) => t.left + 256));
    const minT = Math.min(...tiles.map((t) => t.top)), maxB = Math.max(...tiles.map((t) => t.top + 256));
    expect(minL).toBeLessThanOrEqual(0); expect(maxR).toBeGreaterThanOrEqual(390);
    expect(minT).toBeLessThanOrEqual(0); expect(maxB).toBeGreaterThanOrEqual(220);
    const c = tileXY(26.64, -81.87, 8);
    const home = tiles.find((t) => t.x === Math.floor(c.x) && t.y === Math.floor(c.y))!;
    expect(home.left + (c.x - Math.floor(c.x)) * 256).toBeCloseTo(195, 0);
  });

  it("wraps across the date line and skips tiles past the poles", () => {
    expect(tilesFor(0, 179.9, 2, 800, 200).every((t) => t.x >= 0 && t.x < 4)).toBe(true);
    expect(tilesFor(84, 0, 1, 256, 2000).every((t) => t.y >= 0 && t.y < 2)).toBe(true);
  });

  it("gives a sensible scale", () => {
    expect(milesAcross(26.6, 8, 390)).toBeGreaterThan(100);
    expect(milesAcross(26.6, 8, 390)).toBeLessThan(160);
  });
});
