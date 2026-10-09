#!/usr/bin/env -S npx tsx
// Draws the app icons for the installable web app (public/icons/) and the logo files (public/brand/) from the same
// drawings as the app (src/content/logo.ts, PLACEHOLDER Tuvant logos): the t mark on deep forest, the product
// wordmark (D) and the company wordmark (B), each for dark and light backgrounds.
// Run again when a logo changes:   CHROMIUM_PATH=/opt/pw-browsers/chromium npm run icons
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { BRAND_COLORS as C, companySvg, markSvgInner, productSvg } from "../src/content/logo";

const ROOT = path.join(__dirname, "..", "public");
const ICONS = path.join(ROOT, "icons");
const BRANDDIR = path.join(ROOT, "brand");
fs.mkdirSync(ICONS, { recursive: true });
fs.mkdirSync(BRANDDIR, { recursive: true });

// pad < 1 shrinks the mark toward the middle (maskable icons keep it inside the 80% safe zone).
const tile = (size: number, pad: number, round: boolean) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${round ? 14 : 0}" fill="${C.forest}"/>
  <g transform="translate(32 32) scale(${pad}) translate(-32 -32)">${markSvgInner(C.paper, C.green)}</g></svg>`;

(async () => {
  const icons: [string, number, number, boolean][] = [
    ["icon-192.png", 192, 1, true], ["icon-512.png", 512, 1, true],
    ["maskable-512.png", 512, 0.8, false], ["apple-touch-icon.png", 180, 0.92, false],
  ];
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox"] });
  for (const [name, size, pad, round] of icons) {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    await p.setContent(`<style>html,body{margin:0;background:transparent}</style>${tile(size, pad, round)}`);
    await p.locator("svg").screenshot({ path: path.join(ICONS, name), omitBackground: true });
    await p.close();
  }
  await b.close();
  fs.writeFileSync(path.join(ICONS, "icon.svg"), tile(512, 1, true));
  const files: Record<string, string> = {
    "tuvant-app-on-dark.svg": productSvg("#F2F4F7", C.green),
    "tuvant-app-on-light.svg": productSvg(C.charcoal, C.forest),
    "tuvant-company-on-light.svg": companySvg(C.charcoal, C.forest),
    "tuvant-company-on-dark.svg": companySvg(C.paper, "#6FB596"),
  };
  for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(BRANDDIR, name), svg);
  console.log("icons and logo files written to public/");
})();
