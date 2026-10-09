#!/usr/bin/env node
// Draws the app icons for the installable web app (public/icons/) from the same placeholder mark as Mark in
// src/components/ui.tsx: a keel under a level line, dark ink on the brand green. Run again when the real logo lands.
//   CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/make-icons.mjs
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
const OUT = path.join(import.meta.dirname, "..", "public", "icons");
fs.mkdirSync(OUT, { recursive: true });
const BRAND = "#3DDC97", INK = "#0E1116";
// pad = how much of the square the mark fills; maskable icons keep it inside the 80% safe zone.
const svg = (size, pad, round) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <rect width="24" height="24" rx="${round ? 5.3 : 0}" fill="${BRAND}"/>
  <g transform="translate(12 12) scale(${pad}) translate(-12 -12)" fill="${INK}">
    <rect x="3" y="6" width="18" height="2.6" rx="1.3"/><path d="M6.5 10.5h11l-4 8.2a1.7 1.7 0 0 1-3 0z"/>
  </g></svg>`;
const icons = [
  ["icon-192.png", 192, 0.64, true], ["icon-512.png", 512, 0.64, true],
  ["maskable-512.png", 512, 0.5, false], ["apple-touch-icon.png", 180, 0.6, false],
];
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox"] });
for (const [name, size, pad, round] of icons) {
  const p = await b.newPage({ viewport: { width: size, height: size } });
  await p.setContent(`<style>html,body{margin:0;background:transparent}</style>${svg(size, pad, round)}`);
  await p.locator("svg").screenshot({ path: path.join(OUT, name), omitBackground: true });
  await p.close();
}
fs.writeFileSync(path.join(OUT, "icon.svg"), svg(512, 0.64, true));
await b.close();
console.log("icons written to", OUT);
