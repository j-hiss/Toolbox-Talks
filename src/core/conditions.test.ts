import { describe, expect, it } from "vitest";
import { conditionNotes, conditionsFor, conditionsLoud, parseWindMph, rainLevel, summarizeAlerts, windLevel } from "./conditions";

// An hourly forecast in the site's own time (-04:00), like api.weather.gov returns.
const hour = (h: number, o: { t?: number; rh?: number; pop?: number; wind?: string; dir?: string; sf?: string; day?: string } = {}) => ({
  startTime: `${o.day ?? "2026-10-06"}T${String(h).padStart(2, "0")}:00:00-04:00`,
  temperature: o.t ?? 85, temperatureUnit: "F", relativeHumidity: { value: o.rh ?? 60 },
  probabilityOfPrecipitation: { value: o.pop ?? 10 }, windSpeed: o.wind ?? "5 mph", windDirection: o.dir ?? "E", shortForecast: o.sf ?? "Sunny",
});
const fc = (periods: unknown[]) => ({ properties: { periods } });
const at = (iso: string) => new Date(iso);

describe("jobsite conditions", () => {
  const day = fc([
    hour(9, { t: 84 }), hour(10, { t: 86, wind: "10 to 15 mph" }), hour(13, { t: 91, rh: 65, pop: 40, wind: "15 to 25 mph", dir: "SE", sf: "Chance Showers And Thunderstorms" }),
    hour(16, { pop: 70, sf: "Showers And Thunderstorms Likely" }), hour(20, { pop: 90, wind: "40 mph" }),
    hour(7, { day: "2026-10-07", t: 80 }), hour(12, { day: "2026-10-07", pop: 20, wind: "20 mph" }),
  ]);

  it("looks at the rest of today's work hours", () => {
    const c = conditionsFor(day, null, at("2026-10-06T10:20:00-04:00"))!;
    expect(c.day).toBe("today");
    expect(c.now).toMatchObject({ tempF: 86, windMph: 15 });
    expect(c.rain).toMatchObject({ maxPct: 70, level: "likely" });
    expect(c.wind).toMatchObject({ maxMph: 25, direction: "SE", level: "windy" });   // 8 PM's 40 mph is after work
    expect(c.thunderAt).toBe("2026-10-06T13:00:00-04:00");
    expect(c.heat?.maxHeatIndexF).toBeGreaterThan(91);
  });

  it("ignores hours already past", () => {
    const c = conditionsFor(day, null, at("2026-10-06T17:10:00-04:00"))!;
    expect(c.thunderAt).toBeNull();
    expect(c.rain?.maxPct ?? 0).toBeLessThan(70);
  });

  it("after work hours it looks at tomorrow", () => {
    const c = conditionsFor(day, null, at("2026-10-06T20:30:00-04:00"))!;
    expect(c).toMatchObject({ day: "tomorrow", dayKey: "2026-10-07", now: null });
    expect(c.wind?.maxMph).toBe(20);
  });

  it("reads wind like the weather service writes it", () => {
    expect(parseWindMph("10 mph")).toBe(10);
    expect(parseWindMph("10 to 15 mph")).toBe(15);
    expect(parseWindMph(undefined)).toBeNull();
    expect([windLevel(10), windLevel(15), windLevel(25), windLevel(35)]).toEqual(["calm", "breezy", "windy", "high"]);
    expect([rainLevel(20), rainLevel(30), rainLevel(60)]).toEqual(["none", "chance", "likely"]);
  });

  it("lists active weather service alerts, warnings first, and drops expired ones", () => {
    const a = summarizeAlerts({ features: [
      { properties: { event: "Heat Advisory", severity: "Moderate", status: "Actual", headline: "Heat Advisory until 7 PM", ends: "2026-10-06T19:00:00-04:00" } },
      { properties: { event: "Severe Thunderstorm Warning", severity: "Severe", status: "Actual", headline: "Severe Thunderstorm Warning until 2:15 PM", ends: "2026-10-06T14:15:00-04:00" } },
      { properties: { event: "Flood Watch", severity: "Moderate", status: "Actual", ends: "2026-10-05T10:00:00-04:00" } },
      { properties: { event: "Test Message", severity: "Minor", status: "Test" } },
    ] }, at("2026-10-06T13:00:00-04:00"));
    expect(a.map((x) => x.event)).toEqual(["Severe Thunderstorm Warning", "Heat Advisory"]);
    expect(a[0].loud).toBe(true);
    expect(a[1].loud).toBe(false);
  });

  it("gives plain notes and says when to call it out", () => {
    const c = conditionsFor(day, { features: [] }, at("2026-10-06T10:20:00-04:00"))!;
    const notes = conditionNotes(c);
    expect(notes.some((n) => n.startsWith("Thunderstorms"))).toBe(true);
    expect(notes.some((n) => n.startsWith("Windy"))).toBe(true);
    expect(notes.some((n) => n.startsWith("Rain likely"))).toBe(true);
    expect(conditionsLoud(c, false)).toBe("caution");
    const calm = conditionsFor(fc([hour(9), hour(10)]), null, at("2026-10-06T09:10:00-04:00"))!;
    expect(conditionNotes(calm)).toEqual([]);
    expect(conditionsLoud(calm, false)).toBeNull();
  });

  it("no forecast hours means nothing to show", () => {
    expect(conditionsFor({}, null)).toBeNull();
  });
});
