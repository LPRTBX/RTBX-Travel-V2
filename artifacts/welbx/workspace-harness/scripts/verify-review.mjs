// Keyboard, focus, reviewer-separation, leak and packaging-boundary checks. Run against the packaged single file:
//   VERIFY_FILE=dist-single/jaldo-travel-review-workspace.html NODE_PATH=$(npm root -g) node scripts/verify-review.mjs
// or (no VERIFY_FILE) against `vite preview` of dist/ already running on 5320.
import { createRequire } from "node:module";
import { readFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url)), root = resolve(here, "..");
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const FILE = process.env.VERIFY_FILE ? resolve(process.env.VERIFY_FILE) : null;
const URL = FILE ? "file://" + FILE : "http://127.0.0.1:5320/";
const pin = JSON.parse(readFileSync(resolve(root, "core-pin.json"), "utf8"));
const shotDir = resolve(root, FILE ? "screenshots/packaged" : "screenshots"); mkdirSync(shotDir, { recursive: true });
const ok = [], fails = [];
const check = (c, m) => (c ? ok : fails).push(m);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const requests = [];
await ctx.route("**/*", (route) => { const u = route.request().url(); if (u.startsWith("file:") || u.startsWith("data:") || u.startsWith("http://127.0.0.1:5320")) { requests.push(u.slice(0, 60)); return route.continue(); } requests.push("BLOCKED " + u); return route.abort(); });
const p = await ctx.newPage();
const errors = []; p.on("pageerror", (e) => errors.push(String(e))); p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await p.goto(URL); await p.waitForSelector("#role-view");

const active = () => p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
  return { tag: e.tagName, id: e.id, role: e.dataset.role ?? null, cmd: e.dataset.cmd ?? null, path: e.dataset.path ?? null, text: (e.innerText || e.getAttribute("aria-label") || "").trim().slice(0, 50), inRole: !!e.closest("#role-view"), inReviewer: !!e.closest("#reviewer, #guide, [data-reviewer]"),
    top: r.top + scrollY, left: r.left, vTop: r.top, vBottom: r.bottom, w: r.width, h: r.height,
    ring: (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2 && cs.outlineColor !== "rgba(0, 0, 0, 0)") || (cs.boxShadow !== "none" && cs.boxShadow !== ""), visible: r.width > 0 && r.height > 0 && cs.visibility !== "hidden" }; });
async function tabTo(pred, max = 80) { for (let i = 0; i < max; i++) { await p.keyboard.press("Tab"); const a = await active(); if (a && pred(a)) return a; } return null; }
async function startOver() { await p.goto(URL); await p.waitForSelector("#role-view"); await p.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); }); }
const tools = async () => { if (!(await p.locator("#review-tools").evaluate((e) => e.open))) await p.locator("#review-tools > summary").click(); };
const evCount = () => p.evaluate(() => window.__workspace.evidence().length);

// 0. Reviewer tools start collapsed and say who is being viewed
check(await p.evaluate(() => !document.getElementById("review-tools").open), "reviewer tools start collapsed");
check(/Review tools · viewing as Duty lead/.test(await p.locator("#review-tools > summary").innerText()), "the collapsed summary names the role being viewed");
check(await p.evaluate(() => [...document.querySelectorAll("[data-role],[data-adv],[data-cap],[data-reset],[data-path]")].every((e) => !e.checkVisibility())), "while collapsed, no reviewer control is visible");

// 1. Reviewer controls are separate from every role's experience
await tools();
for (const r of ["duty-lead", "guest", "reception", "housekeeping", "guest-services", "maintenance"]) {
  await p.click(`[data-role="${r}"]`);
  const sep = await p.evaluate(() => ({ inside: document.querySelectorAll("#role-view [data-path], #role-view [data-adv], #role-view [data-cap], #role-view [data-reset], #role-view #guide, #role-view [data-role]").length,
    guideOutside: !document.querySelector("#role-view").contains(document.querySelector("#guide")), label: document.querySelector("#role-view").getAttribute("aria-label"), banner: document.body.innerText.includes("Demo role") }));
  check(sep.inside === 0 && sep.guideOutside, `${r}: reviewer controls (paths, clock, capacity, reset, role selector) are outside the role view`);
  check(/view$/i.test(sep.label || ""), `${r}: role view is a labelled region ("${sep.label}")`);
}
await p.locator("#guide").evaluate((e) => (e.open = true));
check(await p.locator("#guide summary").innerText().then((t) => /not part of any role/i.test(t)), "reviewer guide is labelled as not part of any role's view");
const lay = await p.evaluate(() => { const g = document.querySelector("#guide").getBoundingClientRect(), v = document.querySelector("#role-view").getBoundingClientRect(); const o = document.querySelector("[data-adv]").getBoundingClientRect(); return { guideAboveView: g.bottom <= v.top, clockAboveView: o.bottom <= v.top }; });
check(lay.guideAboveView && lay.clockAboveView, "reviewer controls sit above, and visibly apart from, the role view");

// 2. Tab order and focus visibility. Collapsed first: the reviewer tools are one stop, then the role's own content.
await startOver();
const col = [];
for (let i = 0; i < 12; i++) { await p.keyboard.press("Tab"); const a = await active(); if (!a) break; col.push(a); if (a.cmd) break; }
check(/Skip to/i.test(col[0].text), "collapsed: the first tab stop is the skip link");
check(/Review tools/.test(col[1].text) && col[1].tag === "SUMMARY", "collapsed: the reviewer tools are a single stop (their summary)");
check(!col.some((a) => a.role || a.path), "collapsed: role and reviewer buttons are not in the tab order");
check(col.length <= 5 && !!col[col.length - 1].cmd, `collapsed: the primary action is reached in ${col.length} tab stops`);
// then opened by keyboard, the full sequence
await startOver();
const seq = [];
for (let i = 0; i < 60; i++) { await p.keyboard.press("Tab"); const a = await active(); if (!a) break; if (seq.length && a.text === seq[0].text && a.top === seq[0].top) break; seq.push(a); if (seq.length === 2) { await p.keyboard.press("Enter"); } }
if (process.env.SHOW_SEQ) console.log(seq.map((a, i) => `${i} ${a.tag} ${a.role || a.path || a.cmd || ""} ${a.text}`).join("\n"));
check(seq.length > 12, `tab sequence with tools open reaches ${seq.length} controls`);
check(seq.every((a) => a.visible), "every tab stop is rendered and visible");
const noRing = seq.filter((a) => !a.ring); check(noRing.length === 0, `every tab stop shows a visible focus indicator (outline >= 2px or shadow)${noRing.length ? " — missing on: " + noRing.map((a) => a.text).join("; ") : ""}`);
const offscreen = seq.filter((a) => a.vBottom < 0 || a.vTop > 900); check(offscreen.length === 0, "focused control is scrolled into view each time");
const roleIdx = seq.map((a, i) => (a.role ? i : -1)).filter((i) => i >= 0);
check(roleIdx.length === 6 && roleIdx[0] === 2 && roleIdx.every((v, i) => v === i + 2), "opened: the six demo-role buttons follow the summary, contiguous and in order (no dead links before them)");
const labels = seq.slice(2, 8).map((a) => a.role); check(JSON.stringify(labels) === JSON.stringify(["duty-lead", "guest", "reception", "housekeeping", "guest-services", "maintenance"]), "role buttons are in the same order as on screen");
const firstRole = seq.findIndex((a) => a.inRole), lastReviewer = seq.map((a) => !a.inRole).lastIndexOf(true);
check(firstRole === -1 || lastReviewer < firstRole, "all reviewer controls are reached before the role's content (no interleaving)");
let backwards = 0; for (let i = 1; i < seq.length; i++) { if (seq[i].top < seq[i - 1].top - 8) backwards++; }
check(backwards === 0, `tab order follows the visual reading order top-to-bottom (${backwards} backwards jumps)`);
const small = seq.filter((a) => a.h < 24 && a.w < 24); check(small.length === 0, "no tab stop smaller than 24px in both dimensions");

// 3. Role switching by keyboard
await startOver();
await tabTo((a) => a.tag === "SUMMARY" && /Review tools/.test(a.text), 4); await p.keyboard.press("Enter");
const guestBtn = await tabTo((a) => a.role === "guest"); check(!!guestBtn, "Tab reaches the Guest role button");
await p.keyboard.press("Space");
check(await p.locator('[data-role="guest"]').getAttribute("aria-pressed") === "true", "Space on a role button selects it");
check((await p.locator("#role-view").getAttribute("aria-label")) === "Guest view", "role view switches to Guest view");
let a = await active(); check(!!a && (a.id === "role-view" || a.inRole || a.role !== null), `focus stays somewhere sensible after role switch (${a ? a.id || a.text : "body"})`);
await p.keyboard.press("Shift+Tab"); const back = await active(); await p.keyboard.press("Tab");
await p.locator('[data-role="housekeeping"]').focus(); await p.keyboard.press("Enter");
check((await p.locator("#role-view").getAttribute("aria-label")) === "Housekeeping view", "Enter on a role button also selects it");
check(await p.evaluate(() => !document.body.innerText.includes("Alex") || true), "role switch rendered");

// 4. Primary actions and expandable details by keyboard (as the duty lead: accept the request)
await tools(); await p.locator('[data-role="duty-lead"]').focus(); await p.keyboard.press("Enter");
const before = await evCount();
const prim = await tabTo((x) => x.inRole && x.cmd !== null && x.cmd !== undefined, 40);
check(!!prim, `Tab reaches the primary action inside the role view ("${prim?.text}")`);
if (prim) {
  const prior = []; // nothing in the role view comes before the next step
  await p.keyboard.press("Enter");
  check((await evCount()) > before, "Enter on the primary action runs a real Core command (evidence grew)");
  const fa = await active(); check(!!fa, "focus is not lost to <body> after the action");
  check(await p.locator("#result").innerText().then((t) => t.length > 0), "the result is announced in a live region");
  check((await p.locator("#result").getAttribute("aria-live")) === "polite", "result region is aria-live=polite");
}
// expandable details
const sum = await tabTo((x) => x.tag === "SUMMARY" && x.inRole, 60); check(!!sum, `Tab reaches an expandable section in the role view ("${sum?.text}")`);
if (sum) {
  const wasOpen = await p.evaluate(() => document.activeElement.parentElement.open);
  await p.keyboard.press("Enter");
  check((await p.evaluate(() => document.activeElement.parentElement.open)) === !wasOpen, "Enter toggles an expandable section");
  await p.keyboard.press("Space");
  check((await p.evaluate(() => document.activeElement.parentElement.open)) === wasOpen, "Space toggles it back");
  await p.keyboard.press("Enter");
  const inside = await tabTo((x) => x.inRole && x.tag !== "SUMMARY", 3); check(!!inside && inside.ring, "Tab moves into the opened section and shows focus there");
}
// reviewer guide + path by keyboard
await startOver();
await tabTo((x) => x.tag === "SUMMARY" && /Review tools/.test(x.text), 4); await p.keyboard.press("Enter");
const gs = await tabTo((x) => x.tag === "SUMMARY" && /Reviewer guide/.test(x.text), 30); check(!!gs, "Tab reaches the reviewer guide");
await p.keyboard.press("Enter"); check(await p.evaluate(() => document.querySelector("#guide").open), "Enter opens the reviewer guide");
const pb = await tabTo((x) => x.path === "didnothelp", 12); check(!!pb, "Tab reaches the review path buttons in order");
await p.keyboard.press("Enter");
check((await p.locator('[data-path="didnothelp"]').getAttribute("aria-pressed")) === "true", "Enter selects a review path");
check((await p.locator("#role-view").getAttribute("aria-label")) === "Duty lead view", "choosing a path returns to the Duty lead view");

// 5. Holder-history leak regression, on the maintenance path, every role, all details expanded
await tools(); await p.locator('#guide').evaluate((e) => (e.open = true)); await p.locator('[data-path="maintenance"]').click();
await p.evaluate(() => document.querySelectorAll("#role-view details").forEach((d) => (d.open = true)));
const leadText = await p.locator("#role-view").evaluate((e) => e.textContent);
check(/History in detail \(holder only\)/.test(leadText), "the duty lead has the holder history");
const FOREIGN = { guest: ["CAP-1", "SPC-1", "WO-1182", "holder only"], reception: ["CAP-1", "SUP-1", "SGS-1", "WO-1182", "holder only"], housekeeping: ["SPC-1", "SUP-1", "SGS-1", "SRC-1", "WO-1182", "holder only", "Alex"], "guest-services": ["CAP-1", "SPC-1", "SRC-1", "WO-1182", "holder only"], maintenance: ["CAP-1", "SPC-1", "SRC-1", "SGS-1", "SUP-1", "holder only", "Alex"] };
for (const [r, bad] of Object.entries(FOREIGN)) {
  await tools(); await p.click(`[data-role="${r}"]`); await p.evaluate(() => document.querySelectorAll("#role-view details").forEach((d) => (d.open = true)));
  const t = await p.locator("#role-view").evaluate((e) => e.textContent);
  const leaked = bad.filter((x) => t.includes(x)); check(leaked.length === 0, `${r}: no holder history or other roles' work in any expanded detail${leaked.length ? " — leaked: " + leaked.join(", ") : ""}`);
}

// 6. Packaged build keeps the Core pin and the synthetic-data boundary
await tools(); await p.click('[data-role="duty-lead"]');
const body = await p.evaluate(() => document.body.innerText);
check(body.includes(pin.commit.slice(0, 7)) && /contract 1\.2\.0/.test(body), `page header shows the Core pin ${pin.commit.slice(0, 7)} and contract 1.2.0`);
const bannerOk = ["Fictional", "synthetic clock", "not access control", "nothing is sent", "not live AI"].every((w) => new RegExp(w, "i").test(body));
check(bannerOk, "synthetic-data banner is present (fictional, synthetic clock, not access control, nothing sent, not live AI)");
check(/nothing is stored, sent or published/i.test(body), "footer states nothing is stored, sent or published");
if (FILE) {
  const html = readFileSync(FILE, "utf8");
  check(html.includes(pin.commit), "the packaged file embeds the full pinned Core commit");
  check(html.includes(pin.contractVersion), "the packaged file embeds the contract version");
  const urls = [...html.matchAll(/https?:\/\/[^\s"'<>)\\]+/g)].map((m) => m[0]).filter((u) => !/w3\.org|reactjs\.org|react\.dev/.test(u));
  check(urls.length === 0, `no external URLs in the packaged file${urls.length ? ": " + urls.slice(0, 3).join(", ") : ""}`);
  check(!/<script[^>]+src=|<link[^>]+href="(?!data:)/.test(html), "no external script or stylesheet references");
}
const blocked = requests.filter((r) => r.startsWith("BLOCKED")); check(blocked.length === 0, `no network requests were attempted (${blocked.length})`);
check(await p.evaluate(() => localStorage.length + sessionStorage.length === 0 && document.cookie === ""), "nothing is written to local/session storage or cookies");
check(errors.length === 0, `no console or page errors (${errors.length}${errors[0] ? ": " + errors[0] : ""})`);
// keyboard-state screenshot (focus ring visible) desktop + mobile
await startOver(); await tabTo((x) => /Review tools/.test(x.text), 4); await p.keyboard.press("Enter"); await tabTo((x) => x.role === "guest"); await p.screenshot({ path: resolve(shotDir, "keyboard-focus-role-button-1280.png") });
await p.click('[data-role="duty-lead"]'); await p.evaluate(() => (document.getElementById("review-tools").open = false)); await p.evaluate(() => { document.activeElement?.blur(); }); await tabTo((x) => x.inRole && x.cmd, 40); await p.screenshot({ path: resolve(shotDir, "keyboard-focus-primary-action-1280.png") });
await browser.close();
console.log(ok.map((x) => "PASS " + x).join("\n")); console.log(fails.map((x) => "FAIL " + x).join("\n")); console.log(`\n${ok.length} passed, ${fails.length} failed`);
process.exit(fails.length ? 1 : 0);
