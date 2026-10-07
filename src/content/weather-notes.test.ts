import { describe, expect, it } from "vitest";
import { weatherNote } from "./weather-notes";
import { WORK_SETTINGS } from "@/core/worksetting";

const KEYS = ["thunder", "high", "windy", "rain"] as const;

describe("weather notes", () => {
  it("every note, in every work setting, cites OSHA material", () => {
    for (const { id } of WORK_SETTINGS) for (const k of KEYS) {
      const n = weatherNote(id, k);
      expect(n.text.length).toBeGreaterThan(10);
      expect(n.refs.length).toBeGreaterThan(0);
      for (const r of n.refs) {
        expect(r.label).toMatch(/^OSHA /);
        expect(r.url).toMatch(/^https:\/\/www\.osha\.gov\//);
      }
    }
  });

  it("words the notes for where the crew works", () => {
    expect(weatherNote("outdoor", "thunder").text).toContain("off the roof");
    expect(weatherNote("outdoor", "thunder").text).toContain("30 minutes");
    expect(weatherNote("mixed", "thunder").text).toContain("stop outside work");
    expect(weatherNote("indoor", "thunder").text).toContain("yard, dock and outside work");
    for (const k of KEYS) expect(weatherNote("indoor", k).text).not.toContain("roof");
    expect(weatherNote("indoor", "rain").text).toContain("Forklifts");
  });

  it("never claims compliance", () => {
    for (const { id } of WORK_SETTINGS) for (const k of KEYS) expect(weatherNote(id, k).text).not.toMatch(/complian/i);
  });
});
