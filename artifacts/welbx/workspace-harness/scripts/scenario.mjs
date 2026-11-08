// The proactive scenario end to end, by clicks only, against the packaged file: system events -> recognition -> recommendation ->
// authorised action -> the guest's choice -> Core's approvals, delivery and follow-up -> process review.
// Usage: VERIFY_FILE=dist-single/....html NODE_PATH=$(npm root -g) node scripts/scenario.mjs
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
const tools = async () => { if (!(await p.locator("#review-tools").evaluate((e) => e.open))) await p.locator("#review-tools > summary").click(); };
const role = async (r) => { await tools(); await p.click(`[data-role="${r}"]`); };
const openAll = () => p.evaluate(() => document.querySelectorAll("#role-view details").forEach((d) => (d.open = true)));
const txt = async () => { await openAll(); return p.locator("#role-view").evaluate((e) => e.textContent.replace(/\s+/g, " ")); };
const result = () => p.locator("#result").innerText();
const kinds = () => p.evaluate(() => window.__workspace.evidence().map((e) => e.kind));
const state = () => p.evaluate(() => { const s = window.__workspace.state(); return s && { actions: Object.fromEntries(s.actions.map((a) => [a.id, a.state])), full: s.actions, links: s.links ?? [] }; });
const signal = async (kind) => { await tools(); await p.click(`[data-signal="${kind}"]`); return result(); };
const guide = async (id) => { await tools(); if (!(await p.locator("#guide").evaluate((e) => e.open))) await p.locator("#guide > summary").click(); await p.click(`[data-path="${id}"]`); };
const shot = async (n) => { await p.evaluate(() => (document.getElementById("review-tools").open = false)); await p.screenshot({ path: resolve(dir, n), fullPage: true }); };
async function click(label) { await openAll(); const b = p.locator("#role-view button[data-cmd]").filter({ hasText: label }).first(); if (!(await b.count())) throw new Error(`no control "${label}"`); await b.click(); }
const ROLES = ["duty-lead", "guest", "reception", "housekeeping", "guest-services", "maintenance"];

// 1. Signals: source, event time and relevant facts
let t = await txt();
check(/JALDO is watching permitted system events/.test(t), "1. the experience leads with what JALDO does");
check(/Property management system.*08:50.*Room 412.*Not ready.*Promised ready 08:45/.test(t) || /Property management system 08:50/.test(t.replace(/\s+/g, " ")), "1. the property event shows its source, event time and facts");
check(/Maintenance work orders/.test(t) && /08:55/.test(t) && /WO-1182/.test(t) && /Estimated completion: 11:30/.test(t), "1. the maintenance event shows its source, event time and facts");
check(/Core's event envelope validates each one/.test(t) && /event_not_permitted/.test(t), "1. Core's admission result for the maintenance event type is shown, not assumed");
// 2 + 3. Recognition, evidence, uncertainty, recommendation, responsible team, next permitted action
check(/A proactive service check-in may help/.test(t) && /Why\. Two independent sources agree/.test(t), "2. the moment is recognised with its reason");
check(/does not establish distress/i.test(t) && /Not established/.test(t), "2. uncertainty is stated and a delay is not read as distress");
check(/The Duty lead decides/.test(t) && /Guest services would deliver/.test(t) && (await p.locator("[data-adopt]").count()) === 1, "3. the recommendation names who decides, the responsible team and the one permitted action");
check(/demonstrated recommendation/i.test(t), "3. it is labelled a demonstrated recommendation");
await shot("scenario-1-signals-and-recommendation.png");
// role privacy before adoption
for (const r of ROLES.slice(1)) { await role(r); const x = await txt(); check(!/Room 412|WO-1182|Property management|air-handling|Not ready/.test(x), `privacy: ${r} sees none of the signals before adoption`); }
await role("duty-lead");
// duplicate, stale, out-of-order and insufficient signals, by the reviewer's signal checks
check(/duplicate/i.test(await signal("duplicate")), "signals: a repeated event is a duplicate with no second effect");
check(/conflict/i.test(await signal("conflict")), "signals: the same key with different content is a conflict");
check(/superseded/i.test(await signal("stale")), "signals: a late, older reading is superseded");
t = await txt(); check(/A proactive service check-in may help/.test(t), "signals: none of those changed the recommendation");
await signal("out-of-order"); t = await txt(); check(/A proactive service check-in may help/.test(t) && t.indexOf("Property management") < t.indexOf("Maintenance work orders"), "signals: out-of-order arrival is read in event-time order");
await signal("pms-only"); t = await txt(); check(/Not enough to recommend a check-in/.test(t) && (await p.locator("[data-adopt]").count()) === 0, "signals: one source is insufficient and nothing can be adopted");
await signal("asked"); await signal("short-repair"); t = await txt(); check(/Not enough to recommend/.test(t), "signals: a short repair is insufficient");
await signal("asked"); await signal("reset-signals"); await signal("asked"); t = await txt(); check(/Not enough to recommend/.test(t) && /already has a help request open/.test(t), "signals: a guest who already asked is theirs to lead");
await signal("reset-signals"); t = await txt(); check(/A proactive service check-in may help/.test(t), "signals: restoring both events restores the recommendation");
// 4. Adopt (the authorised role decides), then the guest chooses
await p.click("[data-adopt]");
check((await kinds()).filter((k) => k === "request.opened").length === 1 && !(await kinds()).includes("approval.recorded") && !(await kinds()).includes("disclosure.made"), "adopting records one request and approves, shares and releases nothing");
await p.locator('[data-testid="next-step"] .wbs-primary button.main').click(); // the Duty lead accepts responsibility
check(Object.keys((await state()).actions).length >= 5 && !(await kinds()).includes("disclosure.made"), "Core prepared the plan after acceptance; still nothing shared or released");
await role("guest"); t = await txt();
const detail = await p.locator('[data-testid="share-detail"]').first().innerText();
check(/Recipient:\s*(Reception|Guest services)/.test(detail) && /Purpose:/.test(detail) && /Nothing yet: the hotel is offering a check-in/.test(detail) && /Alex \(fictional guest\)|Not yet asked/.test(detail + t), "4. the guest sees the recipient, purpose and exact field values before sharing");
const geom = await p.evaluate(() => [...document.querySelectorAll('[data-testid="next-step"] .wbs-alts button')].map((b) => { const r = b.getBoundingClientRect(); const c = getComputedStyle(b); return { label: b.innerText, w: Math.round(r.width), h: Math.round(r.height), bg: c.backgroundColor, fs: c.fontSize }; }));
check(geom.length >= 2 && /^Allow /.test(geom[0].label) && /^Do not allow /.test(geom[1].label) && geom[0].bg === geom[1].bg && geom[0].fs === geom[1].fs && geom[0].h === geom[1].h && geom[0].w === geom[1].w, "4. allow and decline are equally prominent (same size, colour and type)");
await shot("scenario-2-guest-choice.png");
await click("Do not allow"); // the guest declines the first sharing
const afterDecline = await kinds();
check(!afterDecline.includes("disclosure.made"), "4. declining shares nothing");
t = await txt(); check(/Allow (Reception|Guest services) to see these details/.test(t), "4. the guest can still choose for the other recipient");
await role("duty-lead"); t = await txt(); check(/What is shared, with whom, exactly/.test(t) && /Not shared:/.test(t), "the Duty lead sees what is shared, with whom, exactly");
check((await p.locator("[data-testid=\"next-step\"]").innerText()).length > 0, "the Duty lead still has Core's next step");

// 6. Changed capacity, unresolved required check, negative feedback, no response: the permitted response is in the attention panel
await guide("capacity"); await tools(); await p.click('[data-cap="housekeeping:down"]'); await role("duty-lead");
let panel = await p.locator(".review-attention").innerText();
check(/Capacity changed/.test(panel) && /Prepare: Check staff capacity/.test(panel), "6. capacity changed: the renewal is offered in the attention panel");
await shot("scenario-3-capacity-attention.png");
await p.locator(".review-attention button", { hasText: "Prepare: Check staff capacity" }).first().click();
check(/Renewed|accepted by Core/i.test(await result()), "6. the renewal runs through Core");
await guide("dependency"); await role("duty-lead"); panel = await p.locator(".review-attention").innerText();
check(/Handover blocked: Area safety clearance/.test(panel) && /Maintenance/.test(panel), "6. an unresolved required check is prominent and names its owner");
await shot("scenario-4-required-check-attention.png");
await guide("didnothelp"); await role("guest"); await click("Still needs support"); await role("duty-lead");
panel = await p.locator(".review-attention").innerText();
check(/The guest still needs support/.test(panel) && /owner: the duty lead/.test(panel), "6. negative feedback: the follow-up is prominent with its owner");
check((await p.locator('.review-attention button', { hasText: "Close the follow-up" }).count()) === 3, "6. the permitted follow-up responses are in the panel");
await p.locator('.review-attention button', { hasText: "Close the follow-up" }).first().click();
t = await txt(); check(/Resolution\s*Closed/.test(t) && !/The guest still needs support\./.test(t), "6. closing it records a resolution separate from delivery and feedback");
await guide("noresponse"); await tools(); await p.click('[data-adv="60"]'); await p.click('[data-adv="60"]'); await role("duty-lead");
panel = await p.locator(".review-attention").innerText();
check(/deadline is overdue/.test(panel) && /Guest response deadline/.test(panel), "6. no response: the overdue deadline is prominent");
check(/Guest feedback\s*None yet\. No answer is unknown/.test(await txt()), "6. no response stays unknown");
const before = await p.evaluate(() => window.__workspace.state().deadlines?.map((d) => d.dueAt));
await p.locator('.review-attention button', { hasText: "Give 30 more minutes from now" }).first().click();
const after = await p.evaluate(() => window.__workspace.state().deadlines?.map((d) => d.dueAt));
check(JSON.stringify(before) !== JSON.stringify(after), "6. the permitted reschedule is available from the panel and Core records it");
await shot("scenario-5-no-response-attention.png");

// 5/7. Complete journey then the process review
await guide("maintenance"); await role("duty-lead"); t = await txt();
check(/Process review · for authorised review/.test(t) && /JALDO recognised the moment from system events/.test(t) && /Delivery reported by the unit/.test(t), "7. the process review shows what was recognised, timing and delivery");
check(/Guest outcome/.test(t) && /Unresolved work/.test(t) && /Related work · stays open separately/.test(t), "7. it shows the guest outcome and unresolved work, with maintenance separate");
check(/Nobody is scored or ranked/.test(t) && /Proposal only: not applied/.test(t) && !/leaderboard|per person/i.test(t), "7. proposals are for authorised review, nothing is applied, no one is scored");
await shot("scenario-6-process-review.png");
for (const r of ROLES.slice(1)) { await role(r); check(!/Process review|Why this response exists|Property management|proactive-checkin-demo/.test(await txt()), `privacy: ${r} sees no review or recognition detail`); }
check(errors.length === 0, `no console or page errors (${errors.length}${errors[0] ? ": " + errors[0] : ""})`);
await browser.close();
console.log(ok.map((x) => "PASS " + x).join("\n")); console.log(fails.map((x) => "FAIL " + x).join("\n")); console.log(`\n${ok.length} passed, ${fails.length} failed`);
process.exit(fails.length ? 1 : 0);
