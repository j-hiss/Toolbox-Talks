// The app's own name, tagline and logos, in one place. PLACEHOLDER: "Salvant" is the working name (Joe, 2026-10-09;
// it replaced Keel, which ran into a pending "KEEL" software trademark). Logos: src/content/logo.ts (direction D for
// the product, B for the company). Nothing is final until a trademark clearance is done. To rename, change it here
// (and appName in capacitor.config.ts, which can't import from src). Company names and colors are separate: every
// company sees its own name in the header; this is the product's name.
export const BRAND = {
  name: "Salvant",
  tagline: "Every talk. Every signature. Every time.", // Joe's line: the main tagline (app stores, install, PDFs)
  placeholder: true,
} as const;
