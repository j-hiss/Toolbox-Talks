// Puts a company's colors on the page. The colors are worked out in src/core/theme.ts; this only sets the CSS
// variables globals.css reads, and remembers the last ones on this phone so the app opens in the right colors
// before it has signal.
import { normalizeTheme, themeVars, type Theme } from "@/core/theme";

const KEY = "tt-theme";

/** Set the page's colors. null = the default look. */
export function applyTheme(stored: Partial<Theme> | null | undefined, remember = true) {
  if (typeof document === "undefined") return;
  const vars = themeVars(normalizeTheme(stored));
  const root = document.documentElement.style;
  for (const [k, v] of Object.entries(vars)) root.setProperty(k, v);
  if (remember) {
    try { localStorage.setItem(KEY, JSON.stringify(stored ?? {})); } catch { /* private mode: just not remembered */ }
  }
}

/** The colors last used on this phone (before the company has loaded). */
export function rememberedTheme(): Partial<Theme> | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<Theme>) : null;
  } catch {
    return null;
  }
}
