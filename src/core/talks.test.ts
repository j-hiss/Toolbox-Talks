import { describe, expect, it } from "vitest";
import { talksFor, type Talk } from "./talks";
import { INDUSTRIES } from "./industries";
import { DEFAULT_BY_INDUSTRY } from "./worksetting";
describe("industries", () => {
  it("construction trades get every construction talk plus their own", () => {
    const climate = { hurricane: false, cold: "none", hotLong: false } as unknown as Parameters<typeof talksFor>[2];
    const t = (id: string, industries: Talk["industries"]) => ({ id, industries } as unknown as Talk);
    const lib = [t("fall", ["con"]), t("kettle", ["roof"]), t("heat", ["all"]), t("fork", ["wh"])];
    // Its own talks and the Every-job set first, then the borrowed construction talks.
    expect(talksFor(lib, "roof", climate).map((x) => x.id)).toEqual(["kettle", "heat", "fall"]);
    expect(talksFor(lib, "con", climate).map((x) => x.id)).toEqual(["fall", "heat"]);
    expect(talksFor(lib, "health", climate).map((x) => x.id)).toEqual(["heat"]);
  });
  it("every industry has a name and a default work setting", () => {
    for (const i of INDUSTRIES) {
      expect(i.name.trim()).not.toBe("");
      expect(DEFAULT_BY_INDUSTRY[i.id], i.id).toBeDefined();
    }
  });
});
