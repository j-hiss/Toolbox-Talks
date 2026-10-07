import { describe, expect, it } from "vitest";
import { findValid } from "./radar";

describe("radar scan time", () => {
  it("finds the base reflectivity mosaic's time in the listing", () => {
    const json = { services: [{ id: "ridge_uscomp_n0r", utc_valid: "2026-10-07T01:00:00Z" }, { id: "ridge_uscomp_n0q", layername: "nexrad-n0q-900913", utc_valid: "2026-10-07T02:10:00Z" }] };
    expect(findValid(json)?.toISOString()).toBe("2026-10-07T02:10:00.000Z");
  });
  it("gives nothing when the listing has no such entry", () => {
    expect(findValid({ services: [] })).toBeNull();
    expect(findValid(null)).toBeNull();
  });
});
