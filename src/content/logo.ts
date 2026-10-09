// The logos' drawing data (PLACEHOLDER for the working name Tuvant, picked 2026-10-09). Pure data and string
// building, no React, so the app (src/components/Logo.tsx, Mark in ui.tsx) and the icon script
// (scripts/make-icons.ts) draw the same thing.
//   product: direction D, bold lowercase "tuvant" with a rule (bar + dot) under it. The app, app icon, website.
//   company: direction B, spaced serif TUVANT between thin rules, SAFETY PROGRAMS under it. Partner and insurer
//            material, letterhead, the website footer.
import data from "./logo.json";

export const logo = data;

/** The brand's own colors (fixed, unlike a company's theme): deep forest, warm off-white, charcoal, and the app's green. */
export const BRAND_COLORS = { forest: "#1F4D3A", paper: "#F6F5F0", charcoal: "#1E2422", green: "#3DDC97" } as const;

/** The square app mark's inside on a 64×64 tile: the name's first letter, lowercase, over the rule. */
export function markSvgInner(ink: string, rule: string): string {
  const s = data.mark.letter;
  const k = 27 / s.h; // the letter is 27 of the tile's 64 units tall
  const x = (64 - s.w * k) / 2;
  const barW = 25, gap = 2.4, dot = 4.6;
  const left = (64 - (barW + gap + dot)) / 2;
  return `<path transform="translate(${x.toFixed(2)} 11) scale(${k.toFixed(5)})" d="${s.d}" fill="${ink}"/>`
    + `<rect x="${left}" y="44" width="${barW}" height="${dot}" rx="${dot / 2}" fill="${rule}"/>`
    + `<circle cx="${left + barW + gap + dot / 2}" cy="${44 + dot / 2}" r="${dot / 2}" fill="${rule}"/>`;
}

/** The product wordmark (D) as a standalone SVG: letters in `text`, rule in `rule`. */
export function productSvg(text: string, rule: string): string {
  const p = data.product;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${p.viewBox}"><path d="${p.word}" fill="${text}"/>`
    + `<rect x="${p.bar.x}" y="${p.bar.y}" width="${p.bar.w}" height="${p.bar.h}" rx="${p.bar.h / 2}" fill="${rule}"/>`
    + `<circle cx="${p.dot.cx}" cy="${p.dot.cy}" r="${p.dot.r}" fill="${rule}"/></svg>`;
}

/** The company wordmark (B) as a standalone SVG: capitals in `text`, rules and descriptor in `accent`. */
export function companySvg(text: string, accent: string): string {
  const c = data.company;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${c.viewBox}">`
    + c.rules.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${accent}"/>`).join("")
    + `<path transform="translate(${c.title.x} ${c.title.y})" d="${c.title.d}" fill="${text}"/>`
    + `<path transform="translate(${c.sub.x} ${c.sub.y}) scale(${c.sub.scale})" d="${c.sub.d}" fill="${accent}"/></svg>`;
}
