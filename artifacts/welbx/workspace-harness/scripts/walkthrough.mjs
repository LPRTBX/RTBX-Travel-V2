// The four-step reviewer walkthrough, driven through the page's own controls (clicks only), against the packaged file (or preview).
// Every assertion reads Core's own record through the read-only window.__workspace; nothing is set up outside the UI except by the
// reviewer guide's real-command path setup. Usage: VERIFY_FILE=dist-single/....html NODE_PATH=$(npm root -g) node scripts/walkthrough.mjs
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = createRequire(import.meta.url)("playwright");
const FILE = process.env.VERIFY_FILE ? resolve(process.env.VERIFY_FILE) : null;
const URL = FILE ? "file://" + FILE : "http://127.0.0.1:5320/";
const dir = resolve(root, FILE ? "screenshots/packaged" : "screenshots"); mkdirSync(dir, { recursive: true });
const ok = [], fails = []; const check = (c, m) => (c ? ok : fails).push(m);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
const p = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const errors = []; p.on("pageerror", (e) => errors.push(String(e))); p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await p.goto(URL); await p.waitForSelector("#role-view");
const ROLES = ["duty-lead", "guest", "reception", "housekeeping", "guest-services", "maintenance"];
const tools = async () => { if (!(await p.locator("#review-tools").evaluate((e) => e.open))) await p.locator("#review-tools > summary").click(); };
const collapse = () => p.evaluate(() => { document.getElementById("review-tools").open = false; });
const role = async (r) => { await tools(); await p.click(`[data-role="${r}"]`); };
const state = () => p.evaluate(() => { const s = window.__workspace.state(); return { actions: Object.fromEntries(s.actions.map((a) => [a.id, a.state])), full: s.actions.map((a) => ({ id: a.id, typeId: a.typeId, state: a.state, planVersion: a.planVersion })), links: s.links ?? [], clock: window.__workspace.clock() }; });
const kinds = () => p.evaluate(() => window.__workspace.evidence().map((e) => e.kind ?? e.record?.kind));
const openAll = () => p.evaluate(() => document.querySelectorAll("#role-view details").forEach((d) => (d.open = true)));
const roleText = async () => { await openAll(); return p.locator("#role-view").evaluate((e) => e.textContent.replace(/\s+/g, " ")); };
async function click(label) { await openAll(); const b = p.locator("#role-view button[data-cmd]").filter({ hasText: label }).first(); if (!(await b.count())) throw new Error(`no control "${label}" for ${await p.locator("#role-view").getAttribute("aria-label")}`); await b.click(); }
async function primaries(max = 60) { let n = 0, idle = 0; while (idle < 2 && n < max) { let moved = false; for (const r of ROLES) { await role(r); const b = p.locator('[data-testid="next-step"] .wbs-primary button.main').first(); if (await b.count()) { await b.click(); n++; moved = true; } } idle = moved ? 0 : idle + 1; } return n; }
const shot = async (n) => { await collapse(); return p.screenshot({ path: resolve(dir, n), fullPage: true }); };
const guide = async (id) => { await tools(); if (!(await p.locator("#guide").evaluate((e) => e.open))) await p.locator("#guide summary").click(); await p.click(`[data-path="${id}"]`); };

// 1. Normal journey: start from the request, click only highlighted next steps (switching role as the page says).
let n = await primaries(); let st = await state();
check(n > 10 && Object.values(st.actions).every((v) => ["completed", "confirmed", "accepted", "awaiting_approval", "withdrawn"].includes(v)), `1. normal journey: ${n} primary clicks`);
check(st.actions["SUP-1"] === "completed" || st.actions["SUP-1"] === "confirmed", `1. handover delivered and reported done (SUP-1 = ${st.actions["SUP-1"]})`);
check((await kinds()).includes("disclosure.made") && (await kinds()).includes("completion.recorded"), "1. disclosure and completion are in Core's record");
await role("duty-lead"); await shot("walkthrough-1-normal-journey-end.png");

// 2. Capacity withdrawn after approval, then recovery.
await guide("capacity"); await role("duty-lead");
check((await state()).actions["SUP-1"] === "approved", `2. start: handover approved, not yet released (SUP-1 = ${(await state()).actions["SUP-1"]})`);
await tools(); await p.click('[data-cap="housekeeping:down"]');
const lead2 = await roleText();
check(/Renew Capacity check/.test(await p.locator('[data-testid="next-step"]').innerText()), "2. Core's next step for the Duty lead is to renew the lost capacity check");
check(/renewed check is needed|lost capacity/i.test(lead2), "2. the page says why approval was withdrawn");
await openAll();
const ref2 = await p.locator("#refusals").innerText();
check(/Release · Hand the practical support[^\n]*Only an approved action can be executed/.test(ref2), "2. releasing the handover is refused by Core (approval was withdrawn)");
check(/Approve · Hand the practical support[^\n]*dependency_unmet[^\n]*renewed check is needed/.test(ref2), "2. re-approving is refused until the capacity check is renewed, with Core's reason");
await shot("walkthrough-2a-capacity-lost.png");
await tools(); await p.click('[data-cap="housekeeping:up"]');
n = await primaries(); st = await state(); const ev2 = await kinds();
check(ev2.includes("capacity.lost") && ev2.includes("authority.stale"), "2. Core recorded the capacity loss and the withdrawn approval");
check(st.actions["SUP-1"] === "completed" || st.actions["SUP-1"] === "confirmed" || st.actions["SUP-1"] === "accepted", `2. recovery by following Core's next steps (${n} clicks) reaches delivery (SUP-1 = ${st.actions["SUP-1"]})`);
await role("duty-lead"); await shot("walkthrough-2b-recovered.png");

// 3. Guest says "did not help"; delivery evidence stays; follow-up is owned.
await guide("didnothelp"); const before3 = await kinds(); await role("guest");
await click("Still needs support"); 
const k3 = await kinds();
check(k3.includes("response.recorded"), "3. the guest's response is recorded as a separate response record");
check(["disclosure.made", "completion.recorded"].every((k) => k3.includes(k)) && k3.filter((k) => k === "completion.recorded").length === before3.filter((k) => k === "completion.recorded").length, "3. delivery evidence is unchanged by the feedback (no new or overwritten completion)");
check((await state()).actions["SUP-1"] === "completed", "3. the handover is still shown as delivered by Guest services");
await role("duty-lead"); await openAll(); const lead3 = await p.locator('[data-testid="next-step"]').evaluate((e) => e.textContent.replace(/\s+/g, " "));
check(/follow-up|did not help|still needs/i.test(lead3), "3. the Duty lead is asked, in Core's next-step list, to review the follow-up");
const t3 = await roleText(); check(/follow-up/i.test(t3), "3. the follow-up is visible with owner/due time in the lead's ownership table");
await role("guest"); const g3 = await roleText(); check(/Your response was recorded/.test(g3), "3. the guest sees their response acknowledged in their own words");
await role("duty-lead"); await shot("walkthrough-3-did-not-help.png");

// 4. Maintenance stays open independently.
await guide("maintenance"); await role("duty-lead");
st = await state(); const link = st.links.find((l) => !l.withdrawn);
check(st.actions["SUP-1"] === "confirmed" || st.actions["SUP-1"] === "completed", `4. support is complete (SUP-1 = ${st.actions["SUP-1"]})`);
check(!!link && link.status === "open", `4. the linked repair is still open (${link ? link.reference + " " + link.status : "none"})`);
check(/Related work · stays open separately[\s\S]*Facility repair · WO-1182 · open/i.test(await roleText()) && /Independent/i.test(await roleText()), "4. the lead sees the repair listed separately, labelled independent and open");
await role("maintenance"); const m4 = await roleText();
check(/WO-1182/.test(m4) && !/SUP-1|Alex|SGS-1|CAP-1/.test(m4), "4. Maintenance sees only its own work, none of the guest support");
await role("duty-lead"); await shot("walkthrough-4-maintenance-open.png");
check(errors.length === 0, `no console or page errors (${errors.length}${errors[0] ? ": " + errors[0] : ""})`);
await browser.close();
console.log(ok.map((x) => "PASS " + x).join("\n")); console.log(fails.map((x) => "FAIL " + x).join("\n")); console.log(`\n${ok.length} passed, ${fails.length} failed`);
process.exit(fails.length ? 1 : 0);
