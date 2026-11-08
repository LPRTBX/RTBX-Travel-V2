// Captures the five moments of the decision-maker walkthrough from the PACKAGED file: one desktop (1440x900) and one mobile (390x844)
// viewport screenshot each, reached only through the page's own controls. Output: screenshots/tour/mN-name-{desktop,mobile}.png
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = createRequire(import.meta.url)("playwright");
const FILE = process.env.VERIFY_FILE ? resolve(process.env.VERIFY_FILE) : null;
const URL = FILE ? "file://" + FILE : "http://127.0.0.1:5320/";
const dir = resolve(root, "screenshots/tour"); mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
const errors = [];
for (const [mode, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const p = await (await browser.newContext({ viewport: vp })).newPage();
  p.on("pageerror", (e) => errors.push(String(e))); p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await p.goto(URL); await p.waitForSelector("#role-view");
  const tools = async () => { if (!(await p.locator("#review-tools").evaluate((e) => e.open))) await p.locator("#review-tools > summary").click(); };
  const role = async (r) => { await tools(); await p.click(`[data-role="${r}"]`); };
  const guide = async (id) => { await tools(); if (!(await p.locator("#guide").evaluate((e) => e.open))) await p.locator("#guide > summary").click(); await p.click(`[data-path="${id}"]`); };
  const open = (sel) => p.evaluate((q) => document.querySelectorAll(q).forEach((d) => (d.open = true)), sel);
  const shoot = async (name, selector, { skip = 0 } = {}) => {
    await p.evaluate(() => (document.getElementById("review-tools").open = false));
    await p.evaluate(([q, k]) => { const e = document.querySelector(q); const y = e.getBoundingClientRect().top + window.scrollY - 70 + k; window.scrollTo(0, Math.max(0, y)); }, [selector, skip]);
    await p.waitForTimeout(150);
    await p.screenshot({ path: resolve(dir, `${name}-${mode}.png`) });
  };
  // 1 Recognise (fresh load)
  await shoot("m1-recognise", '[data-testid="recognise"]');
  // 2 Decide (reason typed, nothing pressed)
  await p.fill("#adopt-reason", "The room is still unavailable and the repair is long, so a check-in is sensible.");
  await shoot("m2-decide", '[data-testid="decide"]');
  // 3 Coordinate: a response with every team involved
  await guide("maintenance"); await role("duty-lead");
  await shoot("m3-coordinate", '[data-testid="teams"]');
  // 4 Adapt: capacity disappears after approval, then the guest declines further help
  await guide("capacity"); await tools(); await p.click('[data-cap="housekeeping:down"]'); await role("guest"); await open("#role-view details"); await p.click('[data-help="no"]');
  await role("duty-lead");
  await shoot("m4-adapt", ".review-attention");
  // 5 Establish the outcome: delivered, guest says it still needs support, a repair is open
  await guide("maintenance"); await role("guest"); await open("#role-view details"); await p.locator("#role-view button[data-cmd]").filter({ hasText: "Still needs support" }).first().click();
  await role("duty-lead");
  await shoot("m5-outcome", '[data-testid="outcome-summary"]');
  await p.close();
}
await browser.close();
if (errors.length) { console.log("ERRORS", errors.slice(0, 3)); process.exit(1); }
console.log("tour captured");
