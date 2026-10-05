#!/usr/bin/env node
// End-to-end in real Chromium at phone size: setup -> people/teams via the new admin -> talk with one-at-a-time
// signing (draw on the pad, mark someone absent, undo) -> review -> save -> home status -> records -> admin undo.
import { chromium } from "playwright-core";
import path from "node:path";
import fs from "node:fs";
const __dirname = import.meta.dirname;
const OUT = process.env.OUT || path.join(__dirname, "..", "preview", "dist", "e2e");
fs.mkdirSync(OUT, { recursive: true });
const PAGE = "file://" + path.join(__dirname, "..", "preview", "dist", "index.html");
// Uses CHROMIUM_PATH if set, else Playwright's own Chromium (npx playwright install chromium once).
const launch = () => chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox"] });
(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: false, colorScheme: process.env.SCHEME || "light" });
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  const log = (...a) => console.log(...a);
  const shot = async (n) => { await p.waitForTimeout(350); await p.screenshot({ path: `${OUT}/e-${n}.png` }); };
  const draw = async () => {
    const c = p.locator("canvas"); await c.scrollIntoViewIfNeeded(); const bb = await c.boundingBox();
    await p.mouse.move(bb.x + 30, bb.y + bb.height * 0.6); await p.mouse.down();
    for (const [dx, dy] of [[80, -40], [140, 30], [200, -30], [260, 20]]) await p.mouse.move(bb.x + dx, bb.y + bb.height * 0.5 + dy, { steps: 4 });
    await p.mouse.up(); await p.waitForTimeout(150);
  };
  await p.goto(PAGE); await p.waitForTimeout(800);
  await p.fill("#co-name", "Demo Roofing"); await p.fill("#co-zip", "33913"); await p.click("text=Create company"); await p.waitForTimeout(900);
  // teams
  await p.click("[role=tab]:has-text('Teams')"); await p.fill('input[aria-label="New team name"]', "Crew 1"); await p.click("text=Add team"); await p.waitForTimeout(400);
  await p.click("[role=tab]:has-text('People')"); await p.waitForTimeout(300);
  const add = async (n, role) => { await p.fill("#np-name", n); await p.selectOption('select[aria-label="Role"]', { label: role }); await p.click("text=Add person"); await p.waitForTimeout(350); };
  await add("Fred Foreman", "Foreman"); await add("Ana Worker", "Crew member"); await add("Ben Worker", "Crew member"); await add("Cal Worker", "Crew member");
  log("toast after add:", await p.locator("[role=status]").last().textContent().catch(() => "-"));
  await p.click("text=Done adding"); await p.fill('input[aria-label="Search people"]', "ana"); await p.waitForTimeout(200);
  log("search ana ->", await p.locator("ul li b").allTextContents());
  await p.fill('input[aria-label="Search people"]', ""); await shot("admin-people");
  // edit sheet: open Ben, remove, undo
  await p.click("button:has-text('Ben Worker')"); await p.waitForTimeout(300); await shot("edit-sheet");
  await p.click("text=Remove Ben Worker"); await p.waitForTimeout(400);
  log("after remove:", (await p.locator("ul li b").allTextContents()).join(","), "| toast:", await p.locator("[role=status]").last().textContent());
  await p.click("button:has-text('Undo')"); await p.waitForTimeout(500);
  log("after undo:", (await p.locator("ul li b").allTextContents()).join(","));
  // home -> start talk
  await p.click("nav[aria-label=Main] >> text=Home"); await p.waitForTimeout(700); await shot("home");
  log("getting started:", (await p.locator("text=Getting started").count()) ? await p.locator("section:has-text('Getting started') ol").innerText() : "none");
  await p.click("text=Start this talk"); await p.waitForTimeout(500);
  await p.click("button[aria-label='Bigger text']"); await shot("read");
  await p.click("text=Done reading"); await p.waitForTimeout(400);
  await p.selectOption("#presenter", { index: 1 }); await p.selectOption("#team", { label: "Crew 1" }); await p.waitForTimeout(200);
  await p.click("text=Collect signatures"); await p.waitForTimeout(400); await shot("sign-presenter");
  log("sign 1:", await p.locator("h1").textContent(), "| next disabled:", await p.locator("button:has-text('Next')").isDisabled());
  await draw(); log("next after draw:", await p.locator("button:has-text('Next')").textContent());
  await p.click("button:has-text('Next')"); await p.waitForTimeout(300);
  log("sign 2:", await p.locator("h1").textContent()); await draw(); await shot("sign-person");
  await p.click("button:has-text('Next')"); await p.waitForTimeout(300);
  log("sign 3:", await p.locator("h1").textContent());
  await p.click("button:has-text(\"Isn't here\")"); await p.waitForTimeout(300);
  log("after isn't here:", await p.locator("h1").textContent(), "| toast:", await p.locator("[role=status]").last().textContent().catch(() => "-"));
  // review
  await p.click("text=Review all").catch(() => {}); await p.waitForTimeout(300); await shot("review");
  log("review:", await p.locator("h1").textContent(), "|", (await p.locator("main ul li").allInnerTexts()).map((t) => t.replace(/\s+/g, " ")).join(" || "));
  await p.click("button:has-text('Save')"); await p.waitForTimeout(1200);
  log("saved:", await p.locator("h1").textContent());
  await p.click("nav[aria-label=Main] >> text=Home"); await p.waitForTimeout(900); await shot("home-after");
  log("week card:", (await p.locator("section:has-text('This week so far')").last().innerText().catch(() => "none")).replace(/\s+/g, " "));
  log("last setup:", await p.locator("text=Set up like last time").textContent().catch(() => "none"));
  await p.click("nav[aria-label=Main] >> text=Records"); await p.waitForTimeout(800); await shot("records");
  log("records:", (await p.locator("main h3").allInnerTexts()).join(" | "));
  await p.click("nav[aria-label=Main] >> text=Reports"); await p.waitForTimeout(1000); await shot("reports");
  log("tabs:", (await p.locator("nav[aria-label=Main] a").allInnerTexts()).join(","), "| current:", await p.locator("nav[aria-label=Main] a[aria-current=page]").innerText());
  // Scenario 2: example history -> makeup with "still needs" roster -> record PDF through the preview's save prompt.
  const q = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  q.on("pageerror", (e) => errs.push(e.message));
  await q.addInitScript(() => { window.__saved = null; window.claude = { use: async (n) => n === "downloads" ? { save: async ({ filename, data }) => { window.__saved = { filename, size: data.size }; return { status: "saved" }; } } : null }; });
  await q.goto(PAGE); await q.waitForTimeout(800);
  await q.fill("#co-name", "Demo 2"); await q.click("text=Create company"); await q.waitForTimeout(800);
  await q.click("text=Preview"); await q.click("text=Add example history"); await q.waitForTimeout(1500);
  log("2 home week card:", (await q.locator("section:has-text('This week so far')").last().innerText()).replace(/\s+/g, " "));
  await q.click("text=Give a makeup"); await q.waitForTimeout(600);
  await q.locator("[role=radio]").nth(0).click(); await q.click("button:has-text('Off that week')"); await q.click("text=Continue to the talk"); await q.waitForTimeout(400);
  await q.click("text=Done reading"); await q.waitForTimeout(300);
  await q.selectOption("#team", "needs"); await q.waitForTimeout(300);
  log("2 still-needs roster:", (await q.locator("main ul li b").allTextContents()).join(", "), "| presenter prefilled:", await q.locator("#presenter").inputValue() !== "");
  if (!(await q.locator("#presenter").inputValue())) await q.selectOption("#presenter", { index: 1 });
  await q.click("text=Collect signatures"); await q.waitForTimeout(300);
  for (let i = 0; i < 6; i++) {
    const c = q.locator("canvas"); if (!(await c.count())) break;
    const bb = await c.boundingBox(); await q.mouse.move(bb.x + 30, bb.y + 80); await q.mouse.down(); await q.mouse.move(bb.x + 150, bb.y + 40, { steps: 5 }); await q.mouse.move(bb.x + 250, bb.y + 90, { steps: 5 }); await q.mouse.up();
    await q.locator("button:has-text('Next'), button:has-text('Done signing')").first().click(); await q.waitForTimeout(250);
  }
  log("2 review:", await q.locator("h1").textContent()); await q.click("button:has-text('Save')"); await q.waitForTimeout(1200);
  log("2 saved:", await q.locator("main").innerText().then((t) => t.split("\n").slice(0, 2).join(" | ")));
  await q.click("text=See records"); await q.waitForTimeout(700); await q.locator("main ul li a").first().click(); await q.waitForTimeout(800);
  await q.click("text=Download PDF"); await q.waitForTimeout(2500);
  log("2 pdf:", JSON.stringify(await q.evaluate(() => window.__saved)));
  await q.click("nav[aria-label=Main] >> text=Reports"); await q.waitForTimeout(1200);
  log("2 reports score:", await q.locator("p.text-6xl").textContent());
  log("errors:", errs.length ? errs : "none");
  await b.close();
})().catch((e) => { console.log("E2E ERROR", e.message.split("\n")[0]); process.exit(1); });
