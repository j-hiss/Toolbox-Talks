import { describe, expect, it } from "vitest";
import { alertAreas, attention, conditionNotes, daySummary, siteHour, conditionsFor, parseWindMph, rainLevel, skyKind, summarizeAlerts, windLevel, windToward, worseSky } from "./conditions";

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
    expect(attention(c)?.level).toBe("caution");
    const calm = conditionsFor(fc([hour(9), hour(10)]), null, at("2026-10-06T09:10:00-04:00"))!;
    expect(conditionNotes(calm)).toEqual([]);
    expect(attention(calm)).toBeNull();
  });

  it("reads the sky from the short forecast", () => {
    expect(skyKind("Chance Showers And Thunderstorms")).toBe("thunder");
    expect(skyKind("Slight Chance Rain Showers")).toBe("rain");
    expect(skyKind("Patchy Fog")).toBe("fog");
    expect(skyKind("Mostly Sunny")).toBe("partly");
    expect(skyKind("Mostly Cloudy")).toBe("cloudy");
    expect(skyKind("Sunny")).toBe("clear");
    expect(worseSky("rain", "partly")).toBe("rain");
    expect(windToward("N")).toBe(180);
    expect(windToward("SW")).toBe(45);
    expect(windToward("??")).toBeNull();
  });

  it("gives an hour-by-hour strip and leads with the sky now, or tomorrow's roughest", () => {
    const today = conditionsFor(day, null, at("2026-10-06T10:20:00-04:00"))!;
    expect(today.hours.map((h) => h.time.slice(11, 13))).toEqual(["10", "13", "16", "19"].filter((h) => h !== "19"));
    expect(today.hours[1]).toMatchObject({ sky: "thunder", rainPct: 40, windMph: 25 });
    expect(today.headline).toMatchObject({ sky: "clear", tempF: 86 });
    const tmr = conditionsFor(day, null, at("2026-10-06T20:30:00-04:00"))!;
    expect(tmr.headline).toMatchObject({ sky: "clear", highF: 85, lowF: 80, tempF: 85 });
  });

  it("draws attention only on unusual days", () => {
    const base = conditionsFor(fc([hour(9), hour(10)]), { features: [] }, at("2026-10-06T09:10:00-04:00"))!;
    expect(attention(base)).toBeNull();
    // An ordinary hot Florida day (extreme caution) gets no border.
    expect(attention({ ...base, heat: { maxHeatIndexF: 98, atHour: "", level: "extreme_caution", tempF: 90, humidity: 60 } })).toBeNull();
    expect(attention({ ...base, heat: { maxHeatIndexF: 108, atHour: "", level: "danger", tempF: 95, humidity: 60 } })?.level).toBe("caution");
    expect(attention({ ...base, heat: { maxHeatIndexF: 126, atHour: "", level: "extreme_danger", tempF: 104, humidity: 60 } })?.level).toBe("alert");
    expect(attention({ ...base, wind: { maxMph: 28, direction: "E", atHour: "", level: "windy" } })).toMatchObject({ level: "caution", reason: "Windy, up to 28 mph" });
    expect(attention({ ...base, wind: { maxMph: 40, direction: "E", atHour: "", level: "high" } })?.level).toBe("alert");
    expect(attention({ ...base, thunderAt: "2026-10-06T09:00:00-04:00" }, at("2026-10-06T09:10:00-04:00"))?.reason).toBe("Thunderstorms now or within the hour");
    const warn = { event: "Tornado Warning", severity: "Extreme", headline: "", ends: null, loud: true, instruction: "", areas: [] };
    expect(attention({ ...base, thunderAt: "2026-10-06T09:00:00-04:00", alerts: [warn] })).toEqual({ level: "alert", reason: "Tornado Warning" });
  });

  it("says the day in plain words", () => {
    const today = conditionsFor(day, null, at("2026-10-06T10:20:00-04:00"))!;
    expect(daySummary(today)).toMatch(/^Thunderstorms likely from 4 PM, through the end of the work day\. Heat index up to \d+° around 1 PM\. Wind up to 25 mph around 1 PM\.$/);
    const dry = conditionsFor(fc([hour(9, { pop: 10 }), hour(10, { pop: 35 }), hour(11, { pop: 5 })]), null, at("2026-10-06T09:10:00-04:00"))!;
    expect(daySummary(dry)).toBe("Mostly dry, with a 35% chance of a shower around 10 AM.");
    const shower = conditionsFor(fc([9, 10, 11, 12, 13, 14].map((h) => hour(h, { pop: h >= 10 && h <= 12 ? [60, 80, 55][h - 10] : 10, sf: h >= 10 && h <= 12 ? "Rain Showers" : "Sunny" }))), null, at("2026-10-06T09:10:00-04:00"))!;
    expect(daySummary(shower)).toBe("Rain likely from 10 AM, wettest around 11 AM, clearing by 1 PM.");
    expect(siteHour("2026-10-06T00:00:00-04:00")).toBe("12 AM");
    expect(siteHour("2026-10-06T12:00:00-04:00")).toBe("12 PM");
  });

  it("gives each hour its words, humidity and feels-like", () => {
    const c = conditionsFor(day, null, at("2026-10-06T10:20:00-04:00"))!;
    expect(c.hours[1]).toMatchObject({ label: "Chance Showers And Thunderstorms", humidity: 65 });
    expect(c.hours[1].feelsF!).toBeGreaterThan(c.hours[1].tempF!);
  });

  it("reads warning areas and what to do", () => {
    expect(alertAreas({ type: "Polygon", coordinates: [[[-81.9, 26.6], [-81.8, 26.6], [-81.8, 26.7], [-81.9, 26.6]]] })).toEqual([[[26.6, -81.9], [26.6, -81.8], [26.7, -81.8], [26.6, -81.9]]]);
    expect(alertAreas({ type: "MultiPolygon", coordinates: [[[[0, 1], [1, 1], [1, 2]]], [[[5, 6], [6, 6], [6, 7]]]] })).toHaveLength(2);
    expect(alertAreas(null)).toEqual([]);
    const a = summarizeAlerts({ features: [{ geometry: { type: "Polygon", coordinates: [[[-81.9, 26.6], [-81.8, 26.6], [-81.8, 26.7]]] },
      properties: { event: "Tornado Warning", severity: "Extreme", status: "Actual", instruction: "  Take cover now.\n Move to an interior room.  " } }] });
    expect(a[0]).toMatchObject({ instruction: "Take cover now. Move to an interior room.", areas: [[[26.6, -81.9], [26.6, -81.8], [26.7, -81.8]]] });
  });

  it("no forecast hours means nothing to show", () => {
    expect(conditionsFor({}, null)).toBeNull();
  });
});
