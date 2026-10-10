import { describe, expect, it } from "vitest";
import { cleanCode, formatCode, verifyLink, verifySummary } from "./verify";

describe("record verification codes", () => {
  it("cleans what people type or scan", () => {
    expect(cleanCode("7kq2-m9tx 4hpa-zc3n")).toBe("7KQ2M9TX4HPAZC3N");
    expect(cleanCode("7KQ2M9TX4HPAZC3")).toBeNull(); // too short
    expect(cleanCode("0KQ2M9TX4HPAZC3N")).toBeNull(); // 0 is never used
    expect(cleanCode("LKQ2M9TX4HPAZC3N")).toBeNull(); // nor L
  });
  it("prints in groups of four and links after #", () => {
    expect(formatCode("7KQ2M9TX4HPAZC3N")).toBe("7KQ2-M9TX-4HPA-ZC3N");
    expect(verifyLink("https://app.example.com/", "7kq2-m9tx-4hpa-zc3n")).toBe("https://app.example.com/verify/#7KQ2M9TX4HPAZC3N");
    expect(() => verifyLink("https://x", "nope")).toThrow();
  });
  it("says the counts plainly, flags included", () => {
    expect(verifySummary({ roster: 5, signed: 3, not_signed: 1, absent: 1, presenter_signed: false }))
      .toBe("5 on the roster: 3 signed, 1 didn't sign, 1 absent. Presenter did not sign.");
  });
});
