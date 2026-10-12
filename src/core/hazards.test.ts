import { describe, expect, it } from "vitest";
import { byteaToDataUrl, hazardCounts, hazardLink, hazardProblem, reporterLabel, sortHazards, splitDataUrl } from "./hazards";

describe("crew hazard reports", () => {
  it("checks a report the same way the database does", () => {
    expect(hazardProblem({ what: "  ", where: "" })).toMatch(/Say what/);
    expect(hazardProblem({ what: "x".repeat(1001), where: "" })).toMatch(/1000/);
    expect(hazardProblem({ what: "Open hole", where: "x".repeat(201) })).toMatch(/200/);
    expect(hazardProblem({ what: "Open hole", where: "North side" })).toBeNull();
  });
  it("never shows a name for an anonymous report", () => {
    expect(reporterLabel({ anonymous: true, reporter_name: "", via: "app" })).toBe("No name");
    expect(reporterLabel({ anonymous: true, reporter_name: "", via: "sticker" })).toBe("No name (jobsite sticker)");
    expect(reporterLabel({ anonymous: false, reporter_name: "Example A", via: "app" })).toBe("Example A");
  });
  it("puts new reports first, oldest new on top, then reviewed newest first", () => {
    const r = (id: string, created_at: string, reviewed_at: string | null) => ({ id, created_at, reviewed_at });
    expect(sortHazards([r("a", "2026-10-01", "2026-10-02"), r("b", "2026-10-05", null), r("c", "2026-10-03", null), r("d", "2026-10-04", "2026-10-05")]).map((x) => x.id)).toEqual(["c", "b", "d", "a"]);
  });
  it("counts waiting and recent reports honestly", () => {
    const c = hazardCounts([
      { kind: "near_miss", reviewed_at: null, created_at: "2026-10-10T00:00:00Z" },
      { kind: "hazard", reviewed_at: "2026-10-11T00:00:00Z", created_at: "2026-10-09T00:00:00Z" },
      { kind: "hazard", reviewed_at: null, created_at: "2026-09-01T00:00:00Z" },
    ], "2026-10-05T00:00:00Z");
    expect(c).toEqual({ waiting: 2, newSince: 2, nearMissSince: 1 });
  });
  it("makes the sticker's report link and reads photos both ways", () => {
    expect(hazardLink("https://app.example.com/", "0F8FAD5B-D9CB-469F-A165-70867728950E")).toBe("https://app.example.com/report/?site=0f8fad5b-d9cb-469f-a165-70867728950e");
    expect(splitDataUrl("data:image/jpeg;base64,/9j/AA==")).toEqual({ mime: "image/jpeg", base64: "/9j/AA==" });
    expect(splitDataUrl("data:image/gif;base64,R0lG")).toBeNull();
    expect(byteaToDataUrl("\\xffd8ff", "image/jpeg")).toBe("data:image/jpeg;base64,/9j/");
  });
});
