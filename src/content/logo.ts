// The logo's drawing data (PLACEHOLDER, direction D). Pure data and string building, no React, so the app
// (src/components/Logo.tsx, Mark in ui.tsx) and the icon script (scripts/make-icons.ts) draw the same thing.
import data from "./logo.json";

export const logo = data;

/** The square app mark's inside on a 64×64 tile: a lowercase k over the line and keel, in `ink`. */
export function markSvgInner(ink: string): string {
  const k = data.k;
  const s = 33 / k.h; // the k is 33 of the tile's 64 units tall
  const x = (64 - k.w * s) / 2;
  return `<path transform="translate(${x.toFixed(2)} 6.5) scale(${s.toFixed(5)})" d="${k.d}" fill="${ink}"/>`
    + `<rect x="13" y="44" width="38" height="4.6" rx="2.3" fill="${ink}"/>`
    + `<path d="M24 52h16l-5.4 7.4a3 3 0 0 1-5.2 0z" fill="${ink}"/>`;
}
