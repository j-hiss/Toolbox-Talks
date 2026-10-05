import { describe, expect, it } from "vitest";
import { AT_SITE_METERS, distanceMeters, formatDistance, mapsLink, nearestJobsite } from "./geo";

// Real reference points: Fort Myers and Cape Coral city halls are about 12 km apart.
const FORT_MYERS = { latitude: 26.6406, longitude: -81.8723 };
const CAPE_CORAL = { latitude: 26.5629, longitude: -81.9495 };

describe("geo", () => {
  it("measures a known distance within 2%", () => {
    const d = distanceMeters(FORT_MYERS, CAPE_CORAL);
    expect(d).toBeGreaterThan(11_500);
    expect(d).toBeLessThan(12_500);
  });

  it("zero distance to itself", () => {
    expect(distanceMeters(FORT_MYERS, FORT_MYERS)).toBe(0);
  });

  it("picks the nearest site and says you're there when close", () => {
    const sites = [
      { name: "Cape", ...CAPE_CORAL },
      { name: "Fort Myers", latitude: FORT_MYERS.latitude + 0.001, longitude: FORT_MYERS.longitude }, // ~110 m away
    ];
    const r = nearestJobsite(sites, FORT_MYERS)!;
    expect(r.site.name).toBe("Fort Myers");
    expect(r.atSite).toBe(true);
    expect(r.meters).toBeLessThan(AT_SITE_METERS);
  });

  it("finds the nearest but does not claim you're there when far away", () => {
    const r = nearestJobsite([{ name: "Cape", ...CAPE_CORAL }], FORT_MYERS)!;
    expect(r.site.name).toBe("Cape");
    expect(r.atSite).toBe(false);
  });

  it("skips sites without a GPS point instead of guessing", () => {
    expect(nearestJobsite([{ name: "No GPS", latitude: null, longitude: null }], FORT_MYERS)).toBeNull();
  });

  it("formats in feet up close and miles farther out", () => {
    expect(formatDistance(30)).toBe("100 ft");
    expect(formatDistance(3862)).toBe("2.4 mi");
    expect(formatDistance(40_000)).toBe("25 mi");
  });

  it("builds a maps link", () => {
    expect(mapsLink(FORT_MYERS)).toContain("query=26.640600,-81.872300");
  });
});
