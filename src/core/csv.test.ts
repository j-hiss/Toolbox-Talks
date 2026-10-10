import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "./csv";

describe("CSV export", () => {
  it("quotes what needs quoting", () => {
    expect(csvCell('Diaz, "Tito"')).toBe('"Diaz, ""Tito"""');
    expect(csvCell(null)).toBe("");
    expect(csvCell(12)).toBe("12");
  });
  it("never lets a name run as a formula, but keeps negative numbers", () => {
    expect(csvCell("=HYPERLINK(\"x\")")).toBe("\"'=HYPERLINK(\"\"x\"\")\"");
    expect(csvCell("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(csvCell("-3")).toBe("-3");
  });
  it("starts with a byte-order mark so Excel reads accents", () => {
    const out = toCsv([["Name"], ["Peña"]]);
    expect(out.startsWith("﻿Name\r\nPeña")).toBe(true);
  });
});
