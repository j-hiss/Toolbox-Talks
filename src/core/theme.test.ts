import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME, THEME_PRESETS, THEME_ROLES, contrast, derived, inkOn, mix, normalizeHex, normalizeTheme, themeChanges, themeVars, themeWarnings,
} from "./theme";

describe("theme", () => {
  it("default look passes every readability and meaning check", () => {
    expect(themeWarnings(DEFAULT_THEME)).toEqual([]);
  });

  it("every preset passes every check", () => {
    for (const p of THEME_PRESETS) expect([p.id, themeWarnings(p.theme)]).toEqual([p.id, []]);
  });

  it("normalizes hex and ignores junk", () => {
    expect(normalizeHex("#0b4ea2")).toBe("#0B4EA2");
    expect(normalizeHex("abc")).toBe("#AABBCC");
    expect(normalizeHex("red")).toBeNull();
    expect(normalizeHex("#12345")).toBeNull();
    expect(normalizeHex(42)).toBeNull();
  });

  it("fills missing or bad stored colors from the default", () => {
    expect(normalizeTheme(null)).toEqual(DEFAULT_THEME);
    expect(normalizeTheme({ brand: "#123456", action: "javascript:alert(1)", extra: "#FFFFFF" })).toEqual({ ...DEFAULT_THEME, brand: "#123456" });
  });

  it("saves only what changed from the default", () => {
    expect(themeChanges(DEFAULT_THEME)).toEqual({});
    expect(themeChanges({ ...DEFAULT_THEME, bg: "#FAFAFA" })).toEqual({ bg: "#FAFAFA" });
  });

  it("works out contrast like WCAG", () => {
    expect(contrast("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
    expect(contrast("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
  });

  it("puts white text on dark colors and dark text on light ones", () => {
    expect(inkOn("#0B4EA2")).toBe("#FFFFFF");
    expect(inkOn("#F5B700")).not.toBe("#FFFFFF");
    expect(derived({ ...DEFAULT_THEME, action: "#FFE14D" }).actionInk).not.toBe("#FFFFFF");
  });

  it("mixes like CSS color-mix in srgb", () => {
    expect(mix("#000000", "#FFFFFF", 0.5)).toBe("#808080");
    expect(mix("#FF0000", "#0000FF", 1)).toBe("#FF0000");
  });

  it("warns, in plain words, when text gets hard to read", () => {
    const w = themeWarnings({ ...DEFAULT_THEME, text: "#C8CCD2" });
    expect(w.some((x) => x.text.startsWith("Text on the background is hard to read"))).toBe(true);
    expect(w.every((x) => x.roles.length > 0)).toBe(true);
  });

  it("warns when Done and Missed can be confused", () => {
    const w = themeWarnings({ ...DEFAULT_THEME, done: "#C0182A" });
    expect(w.map((x) => x.text)).toContain("Done and Missed look alike. They should never be confused.");
  });

  it("warns when buttons look like an alarm", () => {
    expect(themeWarnings({ ...DEFAULT_THEME, action: "#D2101E" }).some((x) => x.roles.includes("action") && x.roles.includes("danger"))).toBe(true);
  });

  it("sets a variable for every color plus readable inks", () => {
    const v = themeVars(DEFAULT_THEME);
    for (const { id } of THEME_ROLES) expect(Object.values(v)).toContain(DEFAULT_THEME[id]);
    expect(v["--t-action-ink"]).toBe("#FFFFFF");
  });
});
