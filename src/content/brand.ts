// The app's own name, taglines and logo (src/components/Logo.tsx; logo direction D picked 2026-10-09), in one place. PLACEHOLDER: "Keel" is a working name from the 2026-10-09 name
// shortlist (Look and Name Board); nothing is final until Joe picks and a trademark search is done. To rename,
// change it here (and appName in capacitor.config.ts, which can't import from src). Company names and colors are
// separate: every company sees its own name in the header; this is the product's name.
export const BRAND = {
  name: "Keel",
  tagline: "Every talk. Every signature. Every time.", // Joe's line: the main tagline (app stores, install, PDFs)
  motto: "Safety that stays the course.", // the second line Joe liked: explains the name (website, signs, gear)
  placeholder: true,
} as const;
