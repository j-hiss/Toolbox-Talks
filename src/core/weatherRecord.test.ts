import { describe, expect, it } from "vitest";
import { conditionsFor } from "./conditions";
import { weatherChips, weatherLines, weatherPdfLines, weatherPlaceKey, weatherRecordFrom } from "./weatherRecord";

const hour = (h: number, o: { t?: number; pop?: number; wind?: string; sf?: string } = {}) => ({
  startTime: `2026-10-06T${String(h).padStart(2, "0")}:00:00-04:00`, temperature: o.t ?? 85, temperatureUnit: "F", relativeHumidity: { value: 70 },
  probabilityOfPrecipitation: { value: o.pop ?? 10 }, windSpeed: o.wind ?? "5 mph", windDirection: "SW", shortForecast: o.sf ?? "Sunny",
});
const now = new Date("2026-10-06T10:20:00-04:00");
const forecast = { properties: { periods: [hour(10, { t: 88 }), hour(13, { t: 94, pop: 40, wind: "15 to 20 mph", sf: "Chance Showers And Thunderstorms" }), hour(16, { pop: 70, sf: "Showers And Thunderstorms Likely" })] } };
const alerts = { features: [{ properties: { event: "Heat Advisory", severity: "Moderate", headline: "Heat Advisory until 7 PM", ends: null, instruction: "Drink plenty of fluids." }, geometry: null }] };
const check = (over: Partial<{ checkedAt: string; alertsUnavailable: boolean; withAlerts: boolean }> = {}) => ({
  ...conditionsFor(forecast, over.withAlerts === false ? { features: [] } : alerts, now)!, checkedAt: over.checkedAt ?? "2026-10-06T14:05:00Z", source: "NWS" as const,
  place: "Example, FL", alertsUnavailable: over.alertsUnavailable ?? false,
});

describe("weather saved with a talk", () => {
  it("keeps the forecast for outdoor and mixed work, never indoors", () => {
    const w = weatherRecordFrom(check(), "outdoor", now)!;
    expect(w.now).toEqual({ temp_f: 88, sky: "Sunny", wind_mph: 5, wind_dir: "SW", rain_pct: 10 });
    expect(w.alerts).toEqual([{ event: "Heat Advisory", severity: "Moderate" }]);
    expect(w.thunder_at).toBe("2026-10-06T13:00:00-04:00");
    expect(weatherRecordFrom(check(), "mixed", now)).not.toBeNull();
    expect(weatherRecordFrom(check(), "indoor", now)).toBeNull();
    expect(weatherRecordFrom(null, "outdoor", now)).toBeNull();
  });
  it("never saves an old check as the weather at the talk", () => {
    expect(weatherRecordFrom(check({ checkedAt: "2026-10-06T10:00:00Z" }), "outdoor", now)).toBeNull(); // over 3 hours old
    expect(weatherRecordFrom(check({ checkedAt: "2026-10-05T14:05:00Z" }), "outdoor", now)).toBeNull(); // yesterday
  });
  it("says what it is: the forecast for the spot, not measured on site", () => {
    const l = weatherLines(weatherRecordFrom(check(), "outdoor", now)!);
    expect(l.now).toBe("88°F, Sunny, wind SW 5 mph, 10% chance of rain");
    expect(l.day).toBe("The work day: high 94°F, low 85°F; heat index up to 119°F (Danger); rain chance up to 70% around 4 PM; wind up to 20 mph around 1 PM; thunderstorms possible from 1 PM.");
    expect(l.alerts).toBe("Active alerts: Heat Advisory.");
    expect(l.source.startsWith("National Weather Service forecast for Example, FL, checked ")).toBe(true);
    expect(l.source.endsWith("A forecast for the spot, not measured on site.")).toBe(true);
  });
  it("never claims no alerts when they couldn't be checked", () => {
    expect(weatherLines(weatherRecordFrom(check({ alertsUnavailable: true, withAlerts: false }), "outdoor", now)!).alerts).toBe("Weather alerts couldn't be checked.");
    expect(weatherLines(weatherRecordFrom(check({ withAlerts: false }), "outdoor", now)!).alerts).toBe("No active weather alerts.");
  });
});

describe("weather on the record, compact", () => {
  it("shows only the day's notable bits as chips, the dangerous ones marked", () => {
    const chips = weatherChips(weatherRecordFrom(check(), "outdoor", now)!);
    expect(chips.map((c) => [c.kind, c.label, c.hot])).toEqual([
      ["heat", "Heat index 119° · Danger", true], ["rain", "Rain 70% · 4 PM", true], ["wind", "Wind 20 mph · 1 PM", false], ["storm", "Storms from 1 PM", true],
    ]);
  });
  it("prints two short lines on the PDF", () => {
    const [main, source] = weatherPdfLines(weatherRecordFrom(check(), "outdoor", now)!);
    expect(main).toBe("88°F, Sunny, wind SW 5 mph, 10% chance of rain. Day: high 94°F / low 85°F, Heat index 119° · Danger, Rain 70% · 4 PM, Wind 20 mph · 1 PM, Storms from 1 PM. Active alerts: Heat Advisory.");
    expect(source).toMatch(/not measured on site\.$/);
  });
  it("knows when a talk moved to another place", () => {
    expect(weatherPlaceKey({ latitude: 26.6401, longitude: -81.8723 })).toBe(weatherPlaceKey({ latitude: 26.64012, longitude: -81.87228 }));
    expect(weatherPlaceKey({ latitude: 26.6401, longitude: -81.8723 })).not.toBe(weatherPlaceKey({ latitude: 26.66, longitude: -81.87 }));
  });
});
