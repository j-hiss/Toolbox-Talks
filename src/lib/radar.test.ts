import { describe, expect, it } from "vitest";
import { agoLabel, findValid, guessLatest, radarFrames, radarStamp, RADAR } from "./radar";

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


describe("radar loop spans", () => {
  it("13 frames for each span, oldest first, ending on the latest", () => {
    expect(radarFrames(1)).toEqual([60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0]);
    expect(radarFrames(3)).toHaveLength(13);
    expect(radarFrames(3)[0]).toBe(180);
    expect(radarFrames(6)).toEqual([360, 330, 300, 270, 240, 210, 180, 150, 120, 90, 60, 30, 0]);
  });
  it("archive names are UTC on the 5-minute mark", () => {
    const latest = new Date("2026-10-07T02:20:00Z");
    expect(radarStamp(latest, 0)).toBe("202610070220");
    expect(radarStamp(latest, 180)).toBe("202610062320");
    expect(radarStamp(new Date("2026-10-07T02:23:41Z"), 60)).toBe("202610070120");
  });
  it("guesses the latest scan as the 5-minute mark before last", () => {
    expect(guessLatest(new Date("2026-10-07T02:23:41Z")).toISOString()).toBe("2026-10-07T02:15:00.000Z");
  });
  it("uses the named layers for the last 50 minutes and the archive before that", () => {
    const latest = new Date("2026-10-07T02:20:00Z");
    expect(RADAR.tile(0, 8, 69, 107, latest)).toContain("/nexrad-n0q-900913/8/69/107.png");
    expect(RADAR.tile(50, 8, 69, 107, latest)).toContain("/nexrad-n0q-900913-m50m/8/69/107.png");
    expect(RADAR.tile(60, 8, 69, 107, latest)).toContain("/ridge::USCOMP-N0Q-202610070120/8/69/107.png");
  });
  it("labels time back plainly", () => {
    expect(agoLabel(0)).toBe("Latest");
    expect(agoLabel(45)).toBe("45 min earlier");
    expect(agoLabel(120)).toBe("2 hr earlier");
    expect(agoLabel(150)).toBe("2 hr 30 min earlier");
  });
});
