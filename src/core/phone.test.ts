import { describe, expect, it } from "vitest";
import { formatPhone, licenseLabel } from "./phone";

describe("phone and license lines", () => {
  it("formats US numbers typed as digits", () => {
    expect(formatPhone("12395550100")).toBe("(239) 555-0100");
    expect(formatPhone("239-555-0100")).toBe("(239) 555-0100");
    expect(formatPhone("+1 (239) 555 0100")).toBe("(239) 555-0100");
  });
  it("leaves anything else as typed", () => {
    expect(formatPhone("555-0100")).toBe("555-0100");
    expect(formatPhone("239-555-0100 ext 4")).toBe("239-555-0100 ext 4");
    expect(formatPhone("+44 20 7946 0000")).toBe("+44 20 7946 0000");
    expect(formatPhone(null)).toBe("");
  });
  it("labels a bare license number, keeps a labelled one", () => {
    expect(licenseLabel("86500000000")).toBe("License #86500000000");
    expect(licenseLabel("#12345")).toBe("License #12345");
    expect(licenseLabel("CCC000000 (example)")).toBe("CCC000000 (example)");
  });
});
