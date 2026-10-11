// Turns Vite's single-file build into the page body the Artifact viewer expects (it supplies <html>/<head>/<body>).
// Run by `npm run preview:build` after vite.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = join(import.meta.dirname, "dist");
const html = readFileSync(join(dist, "index.html"), "utf8");

const pick = (re) => [...html.matchAll(re)].map((m) => m[0]).join("\n");
// Preview only (the real app keeps every font file): keep the Latin and Latin Extended faces, modern woff2 only. The
// fonts' Cyrillic, Greek and Vietnamese faces and the older woff copies are ~1 MB the preview never shows, and the
// Artifact publisher refuses pages past its size limit.
// Latin is "U+??,U+131,…" and Latin Extended "U+100-2BA,…" once minified (U+0000-00FF / U+0100-02BA in the source).
const latin = (block) => /unicode-range:U\+(\?\?|0000-00FF|100-2BA|0100-02BA)[,;}]/i.test(block) || !/unicode-range/.test(block);
const trimFonts = (css) => css
  .replace(/@font-face\{[^}]*\}/g, (block) => (latin(block) ? block : ""))
  .replace(/,url\(data:font\/woff;base64,[A-Za-z0-9+/=]+\)format\("woff"\)/g, "");
const styles = trimFonts(pick(/<style[^>]*>[\s\S]*?<\/style>/g));
const scripts = pick(/<script[^>]*>[\s\S]*?<\/script>/g);
if (!scripts) throw new Error("No script found in the Vite build; the preview would be blank.");

const page = `<title>Tuvant Preview</title>
${styles}
<div id="root"></div>
${scripts}
`;
writeFileSync(join(dist, "preview.html"), page);
console.log(`preview/dist/preview.html  ${(page.length / 1024).toFixed(0)} KB`);
