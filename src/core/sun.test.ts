import { describe, expect, it } from "vitest";
import { skyPhase, sunTimes } from "./sun";

const near = (d: Date, iso: string, minutes = 5) => expect(Math.abs(d.getTime() - new Date(iso).getTime())).toBeLessThan(minutes * 60_000);

describe("sunrise and sunset", () => {
  it("Fort Myers in early October", () => {
    const s = sunTimes(2026, 10, 7, 26.64, -81.87)!;
    near(s.sunrise, "2026-10-07T07:24:00-04:00");
    near(s.sunset, "2026-10-07T19:06:00-04:00");
  });
  it("Minneapolis in late June", () => {
    const s = sunTimes(2026, 6, 21, 44.98, -93.27)!;
    near(s.sunrise, "2026-06-21T05:26:00-05:00");
    near(s.sunset, "2026-06-21T21:03:00-05:00");
  });
  it("knows dawn, day, dusk and night", () => {
    const s = sunTimes(2026, 10, 7, 26.64, -81.87)!;
    expect(skyPhase(new Date("2026-10-07T07:10:00-04:00"), s)).toBe("dawn");
    expect(skyPhase(new Date("2026-10-07T12:00:00-04:00"), s)).toBe("day");
    expect(skyPhase(new Date("2026-10-07T19:15:00-04:00"), s)).toBe("dusk");
    expect(skyPhase(new Date("2026-10-07T22:00:00-04:00"), s)).toBe("night");
    expect(skyPhase(new Date(), null)).toBe("day");
  });
});
