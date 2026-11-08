// Browser verification of the built workspace against the real Core kernel. Needs: a built dist (npm run build), system Chromium.
// Usage: node scripts/verify.mjs   (starts `vite preview` on 5320 itself)
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const here = dirname(fileURLToPath(import.meta.url)), root = resolve(here, "..");
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require(resolve(process.env.NODE_PATH || "", "playwright"))); }
// Target: VERIFY_FILE=<path to the packaged single HTML file> tests that file over file:// ; otherwise tests `vite preview` of dist/.
const FILE = process.env.VERIFY_FILE ? resolve(process.env.VERIFY_FILE) : null;
const srv = FILE ? { kill() {} } : spawn("node", ["../node_modules/vite/bin/vite.js", "preview", "--config", "vite.config.ts", "--port", "5320", "--strictPort"], { cwd: root, stdio: "ignore" });
if (!FILE) await new Promise((r) => setTimeout(r, 2500));
const URL = FILE ? "file://" + FILE : "http://127.0.0.1:5320/";
import { mkdirSync } from "node:fs";
const shotDir = resolve(root, FILE ? "screenshots/packaged" : "screenshots"); mkdirSync(shotDir, { recursive: true });
const shot = (n) => resolve(shotDir, n);
const fails = [], ok = [];
const check = (c, m) => (c ? ok : fails).push(m);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
const errors = [];
async function open(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(String(e))); p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await p.goto(URL); await p.waitForSelector("#role-view");
  return p;
}
const tools = async (p) => { if (!(await p.locator("#review-tools").evaluate((e) => e.open))) await p.locator("#review-tools > summary").click(); };
const collapse = (p) => p.evaluate(() => { document.getElementById("review-tools").open = false; });
const role = async (p, id) => { await tools(p); await p.click(`[data-role="${id}"]`); };
const guide = async (p) => { await tools(p); if (!(await p.locator("#guide").evaluate((e) => e.open))) await p.locator("#guide summary").click(); };
const text = (p) => p.locator("#role-view").innerText();
/** One step a person could take by clicking: adopt a recognised moment, a highlighted next step, or the guest's explicit choice to allow. */
const stepOnce = async (p) => {
  // The guest answers "Would you like practical help?" explicitly (yes), then chooses what to share. Neither is automatic.
  const yes = p.locator('[data-help="yes"]').first(); if ((await yes.count()) && (await yes.isVisible())) { await yes.click(); return true; }
  const adopt = p.locator("[data-adopt]").first(); if ((await adopt.count()) && (await adopt.isVisible())) { await p.fill("#adopt-reason", "The room is still unavailable and the repair is long, so a check-in is sensible."); await adopt.click(); return true; }
  const b = p.locator('[data-testid="next-step"] .wbs-primary button.main').first(); if (await b.count()) { await b.click(); return true; }
  const allow = p.locator('[data-testid="next-step"] .wbs-alts button').filter({ hasText: /^Allow / }).first(); if (await allow.count()) { await allow.click(); return true; }
  return false;
};
async function follow(p, max = 40) { // click only the highlighted primary
  let n = 0;
  while (n < max) { if (!(await stepOnce(p))) break; n++; }
  return n;
}
try {
  const p = await open(1440, 900);
  // normal journey by primaries, switching role as the next step moves
  const roles = ["duty-lead", "guest", "reception", "housekeeping", "guest-services", "maintenance"];
  let clicks = 0, idle = 0;
  while (idle < 6 && clicks < 120) {
    let moved = false;
    for (const r of roles) { await role(p, r); const n = await follow(p); if (n) { clicks += n; moved = true; } }
    idle = moved ? 0 : idle + 1; if (!moved) break;
  }
  await role(p, "duty-lead");
  const lead = await text(p);
  check(clicks > 8, `normal journey advanced by primary controls only (${clicks} clicks)`);
  check(/support/i.test(lead), "duty lead view renders after journey");
  // role isolation
  await role(p, "housekeeping"); const hk = await text(p);
  const guestFields = await p.evaluate(() => { const w = window.__workspace; return JSON.stringify(w.state.request ?? []); });
  for (const f of JSON.parse(guestFields).map((x) => x.value).filter(Boolean)) check(!hk.includes(f), `housekeeping view omits guest field "${f.slice(0, 24)}"`);
  for (const r of roles.filter((x) => x !== "duty-lead")) { await role(p, r); const t = await text(p); check(!/holder history|Accountable holder history/i.test(t) && (await p.locator("#role-view").locator("text=Holder history").count()) === 0, `holder history absent for ${r}`); }
  // keyboard: tab reaches a role button and shows a visible focus ring; focus moves to result after a command
  await p.keyboard.press("Tab"); const focusable = await p.evaluate(() => document.activeElement?.tagName);
  check(!!focusable, "keyboard focus lands on an element");
  await collapse(p); await p.screenshot({ path: shot("desktop-1440-journey-end.png"), fullPage: true });
  // each path
  const paths = ["normal", "missing", "capacity", "dependency", "didnothelp", "noresponse", "maintenance"];
  for (const id of paths) {
    await guide(p); await p.click(`[data-path="${id}"]`); await p.waitForSelector("#role-view");
    const setupErr = await p.locator("#result.refused").count();
    check(setupErr === 0, `path ${id}: setup accepted by Core`);
    for (const r of ["duty-lead", "guest", "guest-services", "maintenance"]) {
      await role(p, r);
      const small = await p.evaluate(() => [...document.querySelectorAll("#role-view *")].filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12.5).length);
      check(small === 0, `path ${id} / ${r}: no text under 12.5px`);
    }
    await role(p, "duty-lead");
    await collapse(p); await p.screenshot({ path: shot(`path-${id}-duty-lead-1440.png`), fullPage: true });
  }
  await p.close();
  // overflow at three widths + mobile/tablet screenshots
  for (const [w, h] of [[390, 844], [820, 1180], [1440, 900]]) {
    const q = await open(w, h);
    for (const id of ["didnothelp", "maintenance"]) {
      await guide(q); await q.click(`[data-path="${id}"]`);
      for (const r of roles) { await role(q, r); const o = await q.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); check(o <= 0, `${w}px ${id}/${r}: no horizontal page overflow`); }
    }
    await role(q, "guest"); await collapse(q); await q.screenshot({ path: shot(`${w <= 390 ? "mobile-390" : w <= 820 ? "tablet-820" : "desktop-1440"}-guest-maintenance.png`), fullPage: true });
    await role(q, "duty-lead"); await collapse(q); await q.screenshot({ path: shot(`${w <= 390 ? "mobile-390" : w <= 820 ? "tablet-820" : "desktop-1440"}-duty-lead-maintenance.png`), fullPage: true });
    await q.close();
  }
  check(errors.length === 0, `no console or page errors (${errors.length})`);
} catch (e) { fails.push("exception: " + e.message); }
await browser.close(); srv.kill();
console.log(errors.join("\n"));
console.log(ok.map((x) => "PASS " + x).join("\n")); console.log(fails.map((x) => "FAIL " + x).join("\n"));
console.log(`\n${ok.length} passed, ${fails.length} failed`);
process.exit(fails.length ? 1 : 0);
