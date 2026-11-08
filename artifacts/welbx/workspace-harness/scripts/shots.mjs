// Fresh screenshots of the reviewed presentation at 390, 820 and 1440, with a horizontal-overflow check, from the packaged file.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = createRequire(import.meta.url)("playwright");
const FILE = process.env.VERIFY_FILE ? resolve(process.env.VERIFY_FILE) : null;
const URL = FILE ? "file://" + FILE : "http://127.0.0.1:5320/";
const dir = resolve(root, "screenshots/review-2"); mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
const fails = [], ok = [];
for (const w of [390, 820, 1440]) {
  const p = await (await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 } })).newPage();
  await p.goto(URL); await p.waitForSelector("#role-view");
  const tools = async () => { if (!(await p.locator("#review-tools").evaluate((e) => e.open))) await p.locator("#review-tools > summary").click(); };
  const collapse = () => p.evaluate(() => (document.getElementById("review-tools").open = false));
  const go = async (path, r) => { await tools(); if (!(await p.locator("#guide").evaluate((e) => e.open))) await p.locator("#guide > summary").click(); await p.click(`[data-path="${path}"]`); await tools(); await p.click(`[data-role="${r}"]`); };
  const snap = async (name) => { const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); (o <= 0 ? ok : fails).push(`${w}px ${name}: ${o <= 0 ? "no horizontal overflow" : "overflow " + o + "px"}`); await collapse(); await p.screenshot({ path: resolve(dir, `${w}-${name}.png`), fullPage: true }); };
  await go("normal", "duty-lead"); await snap("signals-recognition-recommendation-lead");
  await p.evaluate(() => (document.getElementById("review-tools").open = true)); await p.screenshot({ path: resolve(dir, `${w}-review-tools-open.png`) });
  await go("dependency", "duty-lead"); await snap("blocked-required-check-lead");
  await go("didnothelp", "guest"); await p.evaluate(() => document.querySelectorAll("#role-view details").forEach((d) => (d.open = true))); await p.locator("#role-view button[data-cmd]").filter({ hasText: "Still needs support" }).first().click();
  await tools(); await p.click('[data-role="duty-lead"]'); await snap("guest-needs-support-lead");
  await tools(); await p.click('[data-role="guest"]'); await snap("guest-sharing-and-progress");
  await go("didnothelp", "duty-lead"); await go("missing", "guest"); await snap("guest-choose-what-to-share");
  await go("maintenance", "duty-lead"); await snap("process-review-required-vs-independent-lead");
  await tools(); await p.click('[data-role="maintenance"]'); await snap("maintenance-own-work");
  await go("noresponse", "duty-lead"); await tools(); await p.click('[data-adv="60"]'); await p.click('[data-adv="60"]'); await snap("deadline-overdue-lead");
  await p.close();
}
await browser.close();
console.log(ok.map((x) => "PASS " + x).join("\n")); console.log(fails.map((x) => "FAIL " + x).join("\n")); console.log(`\n${ok.length} passed, ${fails.length} failed`);
process.exit(fails.length ? 1 : 0);
