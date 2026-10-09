// Turns Vite's single-file build into the page body the Artifact viewer expects (it supplies <html>/<head>/<body>).
// Run by `npm run preview:build` after vite.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = join(import.meta.dirname, "dist");
const html = readFileSync(join(dist, "index.html"), "utf8");

const pick = (re) => [...html.matchAll(re)].map((m) => m[0]).join("\n");
const styles = pick(/<style[^>]*>[\s\S]*?<\/style>/g);
const scripts = pick(/<script[^>]*>[\s\S]*?<\/script>/g);
if (!scripts) throw new Error("No script found in the Vite build; the preview would be blank.");

const page = `<title>Keel Preview</title>
${styles}
<div id="root"></div>
${scripts}
`;
writeFileSync(join(dist, "preview.html"), page);
console.log(`preview/dist/preview.html  ${(page.length / 1024).toFixed(0)} KB`);
