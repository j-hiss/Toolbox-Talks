import { describe, expect, it } from "vitest";
import { aheadLabel, agoLabel, findValid, FORECAST, forecastCovers, forecastFrames, forecastMinute, guessLatest, parseRun, radarFrames, radarStamp, RADAR, runName } from "./radar";

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

describe("radar forecast (HRRR model)", () => {
  const init = new Date("2026-10-08T22:00:00Z");
  it("names layers by minutes from the run's start, 4 digits", () => {
    expect(FORECAST.layer(480, runName(init))).toBe("hrrr::REFD-F0480-202610082200");
    expect(FORECAST.tile(45, "202610082200", 8, 1, 2)).toBe("https://mesonet.agron.iastate.edu/c/tile.py/1.0.0/hrrr::REFD-F0045-202610082200/8/1/2.png");
  });
  it("turns 'hours from now' into the run's forecast minute, on 15-minute steps", () => {
    const now = new Date("2026-10-09T00:07:00Z"); // run started 2h07m ago
    expect(forecastMinute(init, now, 360)).toBe(480); // 2h07m + 6h = 8h07m, nearest 15-minute step is 480
    expect(forecastMinute(init, now, 30)).toBe(150);
    expect(forecastMinute(init, new Date("2026-10-09T15:00:00Z"), 360)).toBeNull(); // past 18 hours
  });
  it("12 frames, every 30 minutes out to 6 hours", () => {
    expect(forecastFrames()).toEqual([30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]);
  });
  it("is offered only over the lower 48", () => {
    expect(forecastCovers(26.6, -81.9)).toBe(true);    // Fort Myers
    expect(forecastCovers(21.3, -157.8)).toBe(false);  // Honolulu
    expect(forecastCovers(61.2, -149.9)).toBe(false);  // Anchorage
  });
  it("reads the run start from the server's file", () => {
    expect(parseRun({ model_init_utc: "2026-10-08T22:00:00Z" })?.toISOString()).toBe("2026-10-08T22:00:00.000Z");
    expect(parseRun({})).toBeNull();
  });
  it("labels frames as time ahead", () => {
    expect(aheadLabel(30)).toBe("In 30 min");
    expect(aheadLabel(270)).toBe("In 4 hr 30 min");
  });
});
