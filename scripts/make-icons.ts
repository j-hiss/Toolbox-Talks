#!/usr/bin/env -S npx tsx
// Draws the app icons for the installable web app (public/icons/) and the logo files (public/brand/) from the same
// drawing as the app (src/content/logo.ts, PLACEHOLDER logo direction D): dark ink on the brand green.
// Run again when the logo changes:   CHROMIUM_PATH=/opt/pw-browsers/chromium npm run icons
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { logo, markSvgInner } from "../src/content/logo";
import { DEFAULT_THEME } from "../src/core/theme";

const ROOT = path.join(__dirname, "..", "public");
const ICONS = path.join(ROOT, "icons");
const BRANDDIR = path.join(ROOT, "brand");
fs.mkdirSync(ICONS, { recursive: true });
fs.mkdirSync(BRANDDIR, { recursive: true });
const GREEN = DEFAULT_THEME.brand, INK = DEFAULT_THEME.bg;

// pad < 1 shrinks the mark toward the middle (maskable icons keep it inside the 80% safe zone).
const tile = (size: number, pad: number, round: boolean) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${round ? 14 : 0}" fill="${GREEN}"/>
  <g transform="translate(32 32) scale(${pad}) translate(-32 -32)">${markSvgInner(INK)}</g></svg>`;

const W = logo.wordmark;
const wordmark = (text: string, accent: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${W.viewBox}">
  <path d="${W.word}" fill="${text}"/>
  <rect x="${W.line.x}" y="${W.line.y}" width="${W.line.w}" height="${W.line.h}" rx="${W.line.h / 2}" fill="${accent}"/>
  <path d="${W.keel}" fill="${accent}"/></svg>`;

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
  fs.writeFileSync(path.join(BRANDDIR, "keel-wordmark-on-dark.svg"), wordmark("#F2F4F7", GREEN));
  fs.writeFileSync(path.join(BRANDDIR, "keel-wordmark-on-light.svg"), wordmark(INK, "#1E9E66"));
  console.log("icons and logo files written to public/");
})();
