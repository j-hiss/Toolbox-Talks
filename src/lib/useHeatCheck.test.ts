import { describe, expect, it, vi, beforeEach } from "vitest";
import { conditionsFor } from "@/core/conditions";
import { weatherPlaceKey } from "@/core/weatherRecord";
import type { TalkDraft } from "@/lib/draft";
import type { Jobsite } from "@/lib/data/types";

const calls: string[] = [];
const place = (lat: number) => ({
  ...conditionsFor({ properties: { periods: [{ startTime: new Date(Date.now() + 3600e3).toISOString().slice(0, 13) + ":00:00Z", temperature: lat > 27 ? 70 : 90, temperatureUnit: "F", probabilityOfPrecipitation: { value: 10 }, windSpeed: "5 mph", windDirection: "N", shortForecast: "Sunny" }] } }, { features: [] })!,
  checkedAt: new Date().toISOString(), source: "NWS" as const, place: lat > 27 ? "North site" : "South site", alertsUnavailable: false, v: 3,
});
vi.mock("@/lib/weather", () => ({
  checkConditions: async (p: { latitude: number }) => { calls.push(String(p.latitude)); return place(p.latitude); },
  cachedConditions: () => null,
  checkHeat: async () => null,
}));
const { weatherForSave } = await import("./useHeatCheck");

const site = (id: string, latitude: number): Jobsite => ({ id, company_id: "c", name: id, address: "", latitude, longitude: -81.8, kind: "site", active: true });
const jobsites = [site("south", 26.6), site("north", 28.5), { ...site("shop", 26.7), work_setting: "indoor" as const }];
const co = { industry: "con" as const, work_setting: null };
const draft = (over: Partial<TalkDraft>) => ({ jobsiteId: "south", gps: null, weather: null, weatherAt: null, ...over }) as TalkDraft;

describe("weather saved for the place on the record", () => {
  beforeEach(() => { calls.length = 0; });
  it("keeps the check when the place didn't change", async () => {
    const first = await weatherForSave(draft({}), jobsites, co);
    const kept = await weatherForSave(draft({ weather: first, weatherAt: weatherPlaceKey({ latitude: 26.6, longitude: -81.8 }) }), jobsites, co);
    expect(kept).toBe(first);
    expect(calls).toEqual(["26.6"]);
  });
  it("checks again when the jobsite changed after the check (or a makeup is somewhere else)", async () => {
    const south = await weatherForSave(draft({}), jobsites, co);
    const moved = await weatherForSave(draft({ jobsiteId: "north", weather: south, weatherAt: weatherPlaceKey({ latitude: 26.6, longitude: -81.8 }) }), jobsites, co);
    expect(south?.place).toBe("South site");
    expect(moved?.place).toBe("North site");
  });
  it("saves none for indoor work, even if a check was made earlier", async () => {
    const south = await weatherForSave(draft({}), jobsites, co);
    expect(await weatherForSave(draft({ jobsiteId: "shop", weather: south, weatherAt: "26.600,-81.800" }), jobsites, co)).toBeNull();
  });
});
