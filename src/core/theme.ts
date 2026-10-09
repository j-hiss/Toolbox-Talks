// A company's colors. Pure logic: which colors can be set, the default look, readable text on each color,
// and plain-language warnings when a choice makes something hard to read or easy to confuse.
//
// The default ("Paper", 2026-10-09) is deep forest on warm tan, like the logo board. Phones in dark mode get its
// designed night version, "Momentum": a green-black page with one bright green for progress and action, warm gold for
// streaks and caution, a soft red for misses. Momentum is also a preset for companies that want dark all the time.
// "Clarity" (one blue accent), "Field" (charcoal and safety orange), "Ledger" (deep ink-blue) and "Signal" (the
// safety-sign colors, ANSI Z535 / ISO 3864) are presets too. Every color can be changed per company; the warnings say
// when a change hurts readability or meaning. Other light themes get dark versions worked out for phones in dark
// mode (themeVars → --t-dark-*); a dark theme stays as it is.

export const THEME_ROLES = [
  { id: "brand", label: "Brand", hint: "Header, week card, links, selected tab" },
  { id: "action", label: "Buttons", hint: "Main buttons like Start this talk" },
  { id: "done", label: "Done", hint: "Signed, finished, on time" },
  { id: "caution", label: "Caution", hint: "Open makeups, heat" },
  { id: "danger", label: "Missed", hint: "Not signed, missed weeks, flags" },
  { id: "bg", label: "Background", hint: "Behind everything" },
  { id: "surface", label: "Cards", hint: "Cards, sheets and the tab bar" },
  { id: "text", label: "Text", hint: "Main text; lighter text is mixed from it" },
] as const;

export type ThemeRole = (typeof THEME_ROLES)[number]["id"];
export type Theme = Record<ThemeRole, string>;

/**
 * The default look ("Paper", Joe 2026-10-09: "light by day, dark at night"): deep forest on warm tan, like the logo
 * board. Phones in dark mode get Momentum instead (darkVersion), the bright-green-on-green-black night look.
 */
export const DEFAULT_THEME: Theme = {
  brand: "#1F4D3A",
  action: "#1F4D3A",
  done: "#1E7A50",
  caution: "#A86A00",
  danger: "#B42318",
  bg: "#E9E7DF",
  surface: "#F6F5F0",
  text: "#1E2422",
};

/** "Momentum": one bright green for brand, buttons and done on a green-black page. The default's night version, and a
 *  preset for companies that want dark all the time. */
const MOMENTUM: Theme = {
  brand: "#3DDC97", action: "#3DDC97", done: "#3DDC97", caution: "#FFC24B", danger: "#FF6B6B", bg: "#111613", surface: "#1A211D", text: "#F2F4F7",
};

/** Calm and bright, one blue accent on a grey page (the default 2026-10-08 to 10-09). */
const CLARITY: Theme = {
  brand: "#0071E3", action: "#0071E3", done: "#248A3D", caution: "#C96F00", danger: "#D70015", bg: "#F5F5F7", surface: "#FFFFFF", text: "#1D1D1F",
};

/** Charcoal with safety-orange buttons and heavy type: the "jobsite" direction. */
const FIELD: Theme = {
  brand: "#FF7A1A", action: "#FF7A1A", done: "#4ADE80", caution: "#FACC15", danger: "#F87171", bg: "#141414", surface: "#1F1F1F", text: "#F5F5F4",
};

/** Deep ink-blue on cool paper (the default for one day, 2026-10-09). */
const LEDGER: Theme = {
  brand: "#1E3A5F", action: "#1E3A5F", done: "#2C7A51", caution: "#C58B14", danger: "#B42318", bg: "#F3F4F2", surface: "#FFFFFF", text: "#18212C",
};

/** The safety-sign colors (the look before 2026-10-09). */
const SIGNAL: Theme = {
  brand: "#0B4EA2", action: "#C8410C", done: "#00843D", caution: "#F5B700", danger: "#C8102E", bg: "#EEF1F5", surface: "#FFFFFF", text: "#14202E",
};

/** Starting points in Admin → Brand. Each passes every check in themeWarnings. */
export const THEME_PRESETS: { id: string; name: string; theme: Theme }[] = [
  { id: "paper", name: "Paper", theme: DEFAULT_THEME },
  { id: "momentum", name: "Momentum", theme: MOMENTUM },
  { id: "clarity", name: "Clarity", theme: CLARITY },
  { id: "field", name: "Field", theme: FIELD },
  { id: "ledger", name: "Ledger", theme: LEDGER },
  { id: "signal", name: "Signal", theme: SIGNAL },
  { id: "harbor", name: "Harbor", theme: { ...SIGNAL, brand: "#0F6A6E", action: "#D2492F", done: "#1E8A5A", danger: "#9F1239", bg: "#EDF1F1", text: "#15232A" } },
  { id: "graphite", name: "Graphite", theme: { ...CLARITY, brand: "#1D1D1F", action: "#1D1D1F" } },
];

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** "#abc" or "abc" → "#AABBCC"; anything else → null. */
export function normalizeHex(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const m = HEX.exec(v.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return `#${h.toUpperCase()}`;
}

/** A stored theme (possibly partial, possibly from an older version) → a full theme. Bad values fall back to the default. */
export function normalizeTheme(stored: unknown): Theme {
  const src = stored && typeof stored === "object" ? (stored as Record<string, unknown>) : {};
  const out = { ...DEFAULT_THEME };
  for (const { id } of THEME_ROLES) {
    const v = normalizeHex(src[id]);
    if (v) out[id] = v;
  }
  return out;
}

/** Only the colors that differ from the default: what gets saved, so a company keeps future default tweaks it never touched. */
export function themeChanges(t: Theme): Partial<Theme> {
  const out: Partial<Theme> = {};
  for (const { id } of THEME_ROLES) if (t[id] !== DEFAULT_THEME[id]) out[id] = t[id];
  return out;
}

type RGB = [number, number, number];

export function rgb(hex: string): RGB {
  const h = (normalizeHex(hex) ?? "#000000").slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
}

function toHex(c: RGB): string {
  return `#${c.map((n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

/** The same mix CSS makes with color-mix(in srgb, a p%, b). */
export function mix(a: string, b: string, p: number): string {
  const x = rgb(a), y = rgb(b);
  return toHex([0, 1, 2].map((i) => x[i] * p + y[i] * (1 - p)) as RGB);
}

function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((n) => {
    const c = n / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, 1 to 21. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const WHITE = "#FFFFFF";
const INK = "#14202E";

/** White or near-black, whichever reads better on this color. */
export function inkOn(color: string): string {
  return contrast(color, WHITE) >= contrast(color, INK) ? WHITE : INK;
}

/**
 * The light-mode colors the screens actually use, worked out from the eight choices. globals.css makes the
 * same mixes with color-mix(), so dark mode can swap the background, cards and text and keep the rest.
 */
export function derived(t: Theme) {
  return {
    muted: mix(t.text, t.surface, 0.64),
    line: mix(t.text, t.surface, 0.12),
    brandInk: inkOn(t.brand),
    actionInk: inkOn(t.action),
    doneInk: inkOn(t.done),
    dangerInk: inkOn(t.danger),
    doneBg: mix(t.done, t.surface, 0.14),
    doneText: mix(t.done, t.text, 0.75),
    cautionBg: mix(t.caution, t.surface, 0.13),
    cautionText: mix(t.caution, t.text, 0.35),
    dangerBg: mix(t.danger, t.surface, 0.13),
  };
}

/**
 * The brand color as it prints on white paper (the PDF header band and signature-line dots): a light brand color,
 * like Momentum's bright green, is darkened a step at a time until it reads on white (4.5:1).
 */
export function printBrand(t: Theme): string {
  for (let p = 1; p >= 0; p -= 0.05) {
    const c = mix(t.brand, "#000000", p);
    if (contrast(c, WHITE) >= 4.5) return c;
  }
  return "#000000";
}

/** A dark theme: its page is dark enough that phone dark mode should leave it alone. */
export function isDark(t: Theme): boolean {
  return luminance(t.bg) < 0.2;
}

const DARK_BG = "#101412";
const DARK_SURFACE = "#191F1C";
const DARK_TEXT = "#F2F4F7";

/** Mix a color toward white, a step at a time, until it reaches `min` contrast on `on`. */
function liftUntil(color: string, on: string, min: number): string {
  for (let p = 1; p >= 0; p -= 0.05) {
    const c = mix(color, WHITE, p);
    if (contrast(c, on) >= min) return c;
  }
  return WHITE;
}

/**
 * The colors for a phone in dark mode. A dark theme keeps its own. The default (or any theme with the default's
 * accents) gets Momentum, its designed night look. Any other light theme gets a dark page, cards and text, with brand
 * (used as link text, so 4.5:1) and buttons and status colors (3:1) lifted toward white until they read on dark cards.
 */
export function darkVersion(t: Theme) {
  const pick = (n: Theme) => {
    const d = derived(n);
    return {
      bg: n.bg, surface: n.surface, text: n.text, brand: n.brand, brandInk: d.brandInk, action: n.action, actionInk: d.actionInk,
      done: n.done, doneInk: d.doneInk, caution: n.caution, danger: n.danger, dangerInk: d.dangerInk,
    };
  };
  if (isDark(t)) return pick(t);
  if (t.brand === DEFAULT_THEME.brand && t.action === DEFAULT_THEME.action && t.done === DEFAULT_THEME.done) return pick(MOMENTUM);
  const brand = liftUntil(t.brand, DARK_SURFACE, 4.5);
  const action = liftUntil(t.action, DARK_SURFACE, 3);
  const done = liftUntil(t.done, DARK_SURFACE, 3);
  const danger = liftUntil(t.danger, DARK_SURFACE, 3);
  return {
    bg: DARK_BG, surface: DARK_SURFACE, text: DARK_TEXT, brand, brandInk: inkOn(brand), action, actionInk: inkOn(action),
    done, doneInk: inkOn(done), caution: liftUntil(t.caution, DARK_SURFACE, 3), danger, dangerInk: inkOn(danger),
  };
}

/** The CSS variables to set on the page. Only the inputs, the text-on-color inks and the dark-mode set; the CSS derives the rest. */
export function themeVars(t: Theme): Record<string, string> {
  const d = derived(t);
  const k = darkVersion(t);
  return {
    "--t-scheme": isDark(t) ? "dark" : "light",
    "--t-dark-bg": k.bg,
    "--t-dark-surface": k.surface,
    "--t-dark-text": k.text,
    "--t-dark-brand": k.brand,
    "--t-dark-brand-ink": k.brandInk,
    "--t-dark-action": k.action,
    "--t-dark-action-ink": k.actionInk,
    "--t-dark-done": k.done,
    "--t-dark-done-ink": k.doneInk,
    "--t-dark-caution": k.caution,
    "--t-dark-danger": k.danger,
    "--t-dark-danger-ink": k.dangerInk,
    "--t-brand": t.brand,
    "--t-brand-ink": d.brandInk,
    "--t-action": t.action,
    "--t-action-ink": d.actionInk,
    "--t-done": t.done,
    "--t-done-ink": d.doneInk,
    "--t-caution": t.caution,
    "--t-danger": t.danger,
    "--t-danger-ink": d.dangerInk,
    "--t-bg": t.bg,
    "--t-surface": t.surface,
    "--t-text": t.text,
  };
}

/** CIE L*a*b* from a hex color (D65). */
function lab(hex: string): RGB {
  const [r, g, b] = rgb(hex).map((n) => {
    const c = n / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const f = (v: number) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
  const x = f((r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047);
  const y = f(r * 0.2126 + g * 0.7152 + b * 0.0722);
  const z = f((r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

/** How different two colors look (CIE76 ΔE). About 2 is barely noticeable; under 20 two colors read as "the same kind". */
export function colorDifference(a: string, b: string): number {
  const x = lab(a), y = lab(b);
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

export type ThemeWarning = { roles: ThemeRole[]; text: string };

const fmt = (n: number) => `${n.toFixed(1)}:1`;

/**
 * Plain-language problems with a theme. Empty means every check passes.
 * Body text aims for 4.5:1 (WCAG AA); big bold button labels and colored labels for 3:1.
 */
export function themeWarnings(t: Theme): ThemeWarning[] {
  const d = derived(t);
  const out: ThemeWarning[] = [];
  const need = (roles: ThemeRole[], what: string, fg: string, bg: string, min: number) => {
    const c = contrast(fg, bg);
    if (c < min) out.push({ roles, text: `${what} is hard to read (${fmt(c)}, aim for ${fmt(min)}).` });
  };
  need(["text", "bg"], "Text on the background", t.text, t.bg, 4.5);
  need(["text", "surface"], "Text on cards", t.text, t.surface, 4.5);
  need(["text", "surface"], "Lighter text on cards", d.muted, t.surface, 4.5);
  need(["action"], "Button text", d.actionInk, t.action, 3);
  need(["brand"], "Text on the brand color", d.brandInk, t.brand, 4.5);
  need(["brand", "surface"], "Brand-colored links on cards", t.brand, t.surface, 3);
  need(["danger", "surface"], "Missed labels on cards", t.danger, t.surface, 3);
  need(["done", "surface"], "Done labels", d.doneText, d.doneBg, 4.5);
  need(["caution", "surface"], "Caution cards", d.cautionText, d.cautionBg, 4.5);
  const alike = (a: string, b: string) => colorDifference(a, b) < 20;
  if (colorDifference(t.surface, t.bg) < 2) out.push({ roles: ["surface", "bg"], text: "Cards and background are the same color, so cards won't stand out." });
  if (alike(t.done, t.danger)) out.push({ roles: ["done", "danger"], text: "Done and Missed look alike. They should never be confused." });
  if (alike(t.action, t.danger)) out.push({ roles: ["action", "danger"], text: "Buttons look like the Missed color, so a normal button can read as an alarm." });
  if (alike(t.caution, t.danger)) out.push({ roles: ["caution", "danger"], text: "Caution and Missed look alike." });
  // One accent for buttons and done (Momentum) is a deliberate choice; two near-but-different shades are the confusing case.
  if (t.action !== t.done && alike(t.action, t.done)) out.push({ roles: ["action", "done"], text: "Buttons look like the Done color, so it's unclear what's finished." });
  return out;
}
