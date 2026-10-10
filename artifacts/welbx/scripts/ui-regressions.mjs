#!/usr/bin/env node
/**
 * ui-regressions.mjs
 * Browser checks for layout and interaction defects found in the UX audit that
 * unit tests cannot see. Starts the Vite dev server, drives Chromium with
 * Playwright and exits non-zero if any check fails.
 *
 * Usage: node scripts/ui-regressions.mjs   (set UI_BASE_URL to reuse a running server;
 *        set UI_WIDTH to rerun the checks that are not tied to a width at another width)
 */

import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.UI_PORT ?? 5187);
let base = process.env.UI_BASE_URL;
let server;

async function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try { if ((await fetch(url)).ok) return; } catch { /* not up yet */ }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Dev server did not start at ${url}`);
}

if (!base) {
  base = `http://localhost:${port}`;
  server = spawn("pnpm", ["exec", "vite", "--config", "vite.config.ts", "--port", String(port), "--strictPort"], {
    cwd: root, stdio: "ignore", env: { ...process.env, PORT: String(port), VITE_PARTNER_ROOM_CODE: "" },
  });
  await waitForServer(base);
}

// CI uses Playwright's installed browser; Nix/Replit can select the preinstalled
// compatible Chromium without changing app dependencies or system configuration.
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const results = [];

// UI_WIDTH=390|820|1440 reruns every check that is not already tied to a width at that width.
const forcedWidth = Number(process.env.UI_WIDTH) || 0;

async function check(name, viewport, fn) {
  if (forcedWidth && !/\d+px$/.test(name)) {
    viewport = { width: forcedWidth, height: forcedWidth <= 390 ? 844 : forcedWidth <= 820 ? 1180 : 900 };
    name = `${name} (at ${forcedWidth}px)`;
  }
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  try {
    await fn(page, errors);
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ name, ok: false, detail: error instanceof Error ? error.message : String(error) });
  } finally {
    await context.close();
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const open = (page, path) => page.goto(`${base}${path}`, { waitUntil: "networkidle" });

// #1 Architecture Lab: the map and Inspector stack below 900px and sit side by side on desktop.
for (const viewport of [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 1440, height: 900 }]) {
  await check(`Architecture Lab layout at ${viewport.width}px`, viewport, async page => {
    await open(page, "/partner-room/architecture-lab");
    const box = await page.evaluate(() => {
      const map = document.querySelector("#architecture-map").getBoundingClientRect();
      const inspector = document.querySelector(".travel-architecture-inspector").getBoundingClientRect();
      const node = document.querySelector(".travel-architecture-node").getBoundingClientRect();
      return { mapLeft: map.left, mapRight: map.right, mapWidth: map.width, inspectorLeft: inspector.left, inspectorWidth: inspector.width, nodeWidth: node.width, page: document.documentElement.scrollWidth };
    });
    assert(box.page <= viewport.width, `page scrolls horizontally (${box.page}px)`);
    if (viewport.width <= 900) {
      assert(Math.abs(box.inspectorLeft - box.mapLeft) < 2, "Inspector is not stacked under the map");
      assert(box.mapWidth > viewport.width * 0.8, `map is squeezed to ${Math.round(box.mapWidth)}px`);
      assert(Math.abs(box.inspectorWidth - box.mapWidth) < 2, "Inspector does not span the map width");
    } else {
      assert(box.inspectorLeft >= box.mapRight, "Inspector overlaps the map on desktop");
    }
    assert(box.nodeWidth > 300, `architecture nodes are only ${Math.round(box.nodeWidth)}px wide`);
  });
}

// #1 follow-up: the docked Inspector never hides the focused control, and its contents stay reachable by keyboard.
const inspectorGeometry = page => page.evaluate(() => {
  const active = document.activeElement;
  const inspector = document.querySelector(".travel-architecture-inspector");
  const panel = inspector.getBoundingClientRect();
  const rect = active.getBoundingClientRect();
  const style = getComputedStyle(active);
  const ring = (parseFloat(style.outlineWidth) || 0) + (parseFloat(style.outlineOffset) || 0);
  const docked = getComputedStyle(inspector).position === "sticky" && Math.abs(panel.bottom - innerHeight) < 2;
  const inside = inspector.contains(active);
  const overlap = docked && !inside && active !== document.body
    ? Math.max(0, Math.min(rect.bottom + ring, panel.bottom) - Math.max(rect.top - ring, panel.top)) : 0;
  const nav = document.querySelector("[data-partner-room-nav]").getBoundingClientRect();
  const navOverlap = active.closest(".travel-architecture-split") && !inside ? Math.max(0, Math.min(rect.bottom + ring, nav.bottom) - Math.max(rect.top - ring, nav.top)) : 0;
  return { label: (active.innerText || active.getAttribute("aria-label") || active.tagName).replace(/\s+/g, " ").slice(0, 40), inside, overlap: Math.round(overlap), navOverlap: Math.round(navOverlap) };
});

for (const viewport of [{ width: 390, height: 844 }, { width: 820, height: 1180 }]) {
  await check(`Architecture Lab Inspector never hides keyboard focus at ${viewport.width}px`, viewport, async page => {
    await open(page, "/partner-room/architecture-lab");
    const nodeCount = await page.locator(".travel-architecture-node").count();
    // Tab through every control on the page; nothing focused may sit behind the docked panel.
    const seen = [];
    for (let step = 0; step < 120; step += 1) {
      await page.keyboard.press("Tab");
      const geometry = await inspectorGeometry(page);
      if (seen.length && geometry.label === seen[0].label) break;
      seen.push(geometry);
      assert(geometry.overlap === 0, `Tab focus on "${geometry.label}" is hidden ${geometry.overlap}px behind the Inspector`);
      assert(geometry.navOverlap === 0, `Tab focus on "${geometry.label}" is hidden ${geometry.navOverlap}px under the navigation`);
    }
    // Activate every node with Enter: the node stays clear of the panel and the panel shows it.
    for (let index = 0; index < nodeCount; index += 1) {
      const node = page.locator(".travel-architecture-node").nth(index);
      await node.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(450);
      const geometry = await inspectorGeometry(page);
      const label = (await node.locator("strong").innerText()).trim();
      assert(geometry.overlap === 0, `after Enter, "${label}" is hidden ${geometry.overlap}px behind the Inspector`);
      assert((await page.locator(".travel-architecture-inspector h3").innerText()).trim() === label, `Inspector does not show "${label}" after Enter`);
      assert((await page.getByRole("status").filter({ hasText: "inspector" }).innerText()).includes(label), `selection of "${label}" is not announced`);
    }
    // Inspector contents: reachable by Tab straight after the last node, and scrollable from the keyboard when they overflow.
    for (let index = 0; index < nodeCount; index += 1) {
      const node = page.locator(".travel-architecture-node").nth(index);
      await node.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(450); // let the selection render and its deferred scroll adjustment run
      await page.locator(".travel-architecture-node").last().focus();
      await page.keyboard.press("Tab");
      const inspectorFocused = await page.evaluate(() => document.activeElement === document.querySelector(".travel-architecture-inspector"));
      assert(inspectorFocused, "Tab from the last node skips the Inspector");
      const before = await page.locator(".travel-architecture-inspector").evaluate(el => ({ overflow: el.scrollHeight - el.clientHeight, top: el.scrollTop }));
      assert(before.top === 0, `Inspector for node ${index + 1} opens scrolled ${before.top}px down instead of at its top`);
      if (before.overflow > 0) {
        await page.keyboard.press("End");
        // Keyboard scrolling is animated, so wait for it rather than reading scrollTop immediately.
        const scrolled = await page.waitForFunction(top => document.querySelector(".travel-architecture-inspector").scrollTop > top, before.top, { timeout: 2000 }).then(() => true, () => false);
        assert(scrolled, `Inspector content for node ${index + 1} overflows ${before.overflow}px but does not scroll from the keyboard`);
        await page.keyboard.press("Home");
        await page.waitForFunction(() => document.querySelector(".travel-architecture-inspector").scrollTop === 0, null, { timeout: 2000 });
      }
    }
    // Scroll the whole map: every node must be fully visible above the panel at some point.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const hidden = new Set(Array.from({ length: nodeCount }, (_, index) => index));
    for (let y = 0; y < height; y += 60) {
      const visible = await page.evaluate(top => {
        window.scrollTo(0, top);
        const panel = document.querySelector(".travel-architecture-inspector").getBoundingClientRect();
        return [...document.querySelectorAll(".travel-architecture-node")].map(node => {
          const rect = node.getBoundingClientRect();
          return rect.top >= 0 && rect.bottom <= Math.min(innerHeight, panel.top);
        });
      }, y);
      visible.forEach((ok, index) => { if (ok) hidden.delete(index); });
    }
    assert(hidden.size === 0, `nodes ${[...hidden].map(index => index + 1).join(", ")} are never fully visible while scrolling`);
  });
}

// #3 Build & Configure: blank required fields block Next and activation.
await check("Build & Configure blocks blank required fields", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/build-configure");
  await page.locator("#deploy-name").fill("");
  await page.getByRole("button", { name: /^Next/i }).click();
  assert(await page.getByRole("heading", { name: "Environment" }).isVisible(), "Next left Stage 1 with a blank required field");
  assert((await page.getByRole("alert").innerText()).includes("Deployment name"), "no alert names the missing field");
  assert(await page.locator("#deploy-name").evaluate(el => el === document.activeElement), "focus did not move to the missing field");
  await page.getByRole("button", { name: /Activate/ }).first().click();
  assert(await page.getByRole("button", { name: /Activate Travel Environment/ }).isDisabled(), "Activate is enabled with a blank deployment name");
  assert((await page.locator("body").innerText()).includes("missing required fields: Deployment name"), "Review does not name the missing field");
});

// #13 Calculator: typed values are kept exactly; tiers do not move while typing.
await check("Calculator keeps typed numeric values", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/proof-calculator");
  const days = page.getByLabel("Days in month — exact value", { exact: true });
  await days.click();
  await days.pressSequentially("30");
  await days.press("Tab");
  assert(await days.inputValue() === "30", `Days in month became ${await days.inputValue()}`);
  assert(await page.getByRole("slider", { name: "Days in month", exact: true }).inputValue() === "30", "slider did not follow the typed value");

  const low = page.getByLabel("Prevention: low value per successful action");
  const base = page.getByLabel("Prevention: base value per successful action");
  const before = [await low.inputValue(), await base.inputValue()];
  const high = page.getByLabel("Prevention: high value per successful action");
  await high.click();
  await high.pressSequentially("1200");
  await high.press("Enter");
  assert(await high.inputValue() === "1200", `high tier became ${await high.inputValue()}`);
  assert(JSON.stringify([await low.inputValue(), await base.inputValue()]) === JSON.stringify(before), "typing the high tier changed low/base");
});

// #2 Simulation Lab: recorded cycle 1 outcomes never change after reviews and replays.
await check("Simulation Lab keeps recorded cycle 1 outcomes", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/operations?view=simulation");
  await page.getByRole("button", { name: "Run 100 outcome journeys" }).click();
  const outcomeTiles = () => page.getByLabel("Cycle 1 recorded outcomes and proposals").locator(":scope > div").evaluateAll(tiles => tiles.slice(0, 3).map(tile => tile.innerText));
  const before = await outcomeTiles();
  await page.getByRole("button", { name: /Approve all/ }).click();
  const after = await outcomeTiles();
  assert(JSON.stringify(after) === JSON.stringify(before), `recorded cycle 1 tiles changed after approval: ${before.join(" / ")} → ${after.join(" / ")}`);
  assert((await page.getByLabel("Results recorded after cycle 1").innerText()).includes("replays of the same signals"), "replay results are not reported separately");
});

// #7 Stage 3: the scenario leads somewhere.
await check("Stage 3 final step offers a forward path", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/product-proof/stage-3-operating-layer");
  const next = page.locator("#peak-pressure").getByRole("link", { name: /what the pilot would prove/ });
  assert(await next.isVisible(), "no forward CTA after the Stage 3 scenario");
  assert((await next.getAttribute("href")).endsWith("/partner-room/pilot-model#pilot-scope"), "CTA does not open the pilot scope");
  await next.click();
  await page.waitForURL(url => url.pathname === "/partner-room/pilot-model" && url.hash === "#pilot-scope");
});

// #18 Integration Brief: status chips are legible.
await check("Integration status chips are at least 12px", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/integration-brief");
  const sizes = await page.locator(".integration-status-chip").evaluateAll(chips => chips.map(chip => parseFloat(getComputedStyle(chip).fontSize)));
  assert(sizes.length > 0, "no status chips found");
  assert(Math.min(...sizes) >= 12, `smallest status chip is ${Math.min(...sizes)}px`);
});

// #23 Pilot model resource renders without React key warnings.
await check("Pilot model resource has no console errors", { width: 1440, height: 900 }, async (page, errors) => {
  await open(page, "/partner-room/resources/travel-pilot-model");
  assert(errors.length === 0, errors.join(" | "));
});

// Operating Evolution: reviewer reason, full reset, per-cycle conditions and labelled arrivals.
const runCycle = page => page.getByRole("button", { name: /^Run cycle/ }).click();

await check("Operating Evolution requires a meaningful review reason", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/operating-evolution");
  await runCycle(page);
  await runCycle(page);
  const reason = page.getByLabel("Review reason");
  const approve = page.getByRole("button", { name: /Approve policy v2/ });
  const reject = page.getByRole("button", { name: /Reject and retain/ });
  assert(await reason.inputValue() === "", `review reason starts pre-filled: "${await reason.inputValue()}"`);
  assert(await approve.isDisabled() && await reject.isDisabled(), "a review can be submitted without a reason");
  await reason.fill("     ");
  assert(await approve.isDisabled(), "whitespace counts as a review reason");
  await reason.fill("ok");
  assert(await approve.isDisabled(), "a two-character reason is accepted");
  await reason.fill("Two measured cycles show 20 delays each.");
  assert(!(await approve.isDisabled()), "a meaningful reason does not enable approval");
  await approve.click();
  assert((await page.locator("section", { hasText: "Review and version history" }).innerText()).includes("Two measured cycles show 20 delays each."), "history does not record the reviewer's words");
});

await check("Operating Evolution reset restores the whole walkthrough", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/operating-evolution");
  const capacity = page.getByLabel("Housekeeping preparation capacity");
  await runCycle(page);
  await runCycle(page);
  await page.getByLabel("Review reason").fill("Approve earlier preparation for testing.");
  await page.getByRole("button", { name: /Approve policy v2/ }).click();
  await capacity.fill("5");
  await page.getByLabel("Follow-up measurements available").uncheck();
  await page.getByLabel("Readiness forecast available").uncheck();
  await runCycle(page);
  await page.locator("section", { hasText: "Inspect the moment, action and evidence" }).getByRole("combobox").selectOption({ index: 10 });
  await page.getByRole("button", { name: "Reset walkthrough" }).click();
  assert(await capacity.inputValue() === "20", `capacity stayed at ${await capacity.inputValue()} after reset`);
  assert(await page.getByLabel("Follow-up measurements available").isChecked(), "measurement setting survived reset");
  assert(await page.getByLabel("Readiness forecast available").isChecked(), "forecast setting survived reset");
  assert(await page.getByRole("button", { name: /^Run cycle/ }).innerText() === "Run cycle 1", "cycle history survived reset");
  assert((await page.locator("section", { hasText: "Review and version history" }).innerText()).includes("No reviewed changes yet"), "review history survived reset");
  await runCycle(page);
  const arrival = page.locator("section", { hasText: "Inspect the moment, action and evidence" }).getByRole("combobox");
  assert(await arrival.inputValue() === "0", `arrival selection survived reset (${await arrival.inputValue()})`);
});

await check("Operating Evolution records each cycle's conditions", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/operating-evolution");
  await runCycle(page);
  await page.getByLabel("Housekeeping preparation capacity").fill("5");
  await page.getByLabel("Readiness forecast available").uncheck();
  await runCycle(page);
  const rows = await page.locator(".evolution-table tbody tr").evaluateAll(trs => trs.map(tr => tr.innerText));
  assert(/capacity 20/i.test(rows[0]) && /forecast available/i.test(rows[0]), `cycle 1 row does not show its conditions: ${rows[0]}`);
  assert(/capacity 5/i.test(rows[1]) && /no forecast/i.test(rows[1]), `cycle 2 row does not show its conditions: ${rows[1]}`);
  await page.getByLabel("Housekeeping preparation capacity").fill("12");
  const after = await page.locator(".evolution-table tbody tr").first().innerText();
  assert(after === rows[0], "changing current settings rewrote cycle 1's conditions");
});

await check("Operating Evolution labels arrival selections", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/operating-evolution");
  await runCycle(page);
  const select = page.locator("section", { hasText: "Inspect the moment, action and evidence" }).getByRole("combobox");
  const options = await select.locator("option").allInnerTexts();
  assert(options.length === 100, `expected 100 arrivals, found ${options.length}`);
  assert(options.every(text => /^Arrival \d+ · /.test(text)), `arrival options are not labelled: ${options.slice(0, 3).join(" | ")}`);
  assert(options.some(text => /delayed/i.test(text)), "no arrival option names its outcome");
  const label = await select.evaluate(el => el.labels?.[0]?.innerText ?? el.getAttribute("aria-label") ?? "");
  assert(/cycle 1/i.test(label), `arrival picker label does not name the cycle: "${label}"`);
});

// Calculator: frequency inputs usable at 390px; $0 programme cost is called out.
await check("Calculator frequency inputs are usable at 390px", { width: 390, height: 844 }, async page => {
  await open(page, "/partner-room/proof-calculator");
  const inputs = page.getByLabel(/: frequency$/);
  const count = await inputs.count();
  assert(count === 11, `expected 11 frequency inputs, found ${count}`);
  // Measure without any horizontal scrolling: a visitor will not discover a hidden sideways scroll.
  const boxes = await inputs.evaluateAll(els => els.map(el => {
    const wrap = el.closest(".travel-value-table-wrap");
    const rect = el.getBoundingClientRect();
    return { left: rect.left, right: rect.right, hiddenOverflow: wrap ? wrap.scrollWidth - wrap.clientWidth : 0 };
  }));
  boxes.forEach((box, index) => {
    assert(box.left >= 0 && box.right <= 390, `frequency input ${index + 1} is off-screen (left ${Math.round(box.left)}px, right ${Math.round(box.right)}px)`);
    assert(box.hiddenOverflow <= 1, `interaction table hides ${box.hiddenOverflow}px behind a sideways scroll`);
  });
  const first = inputs.first();
  await first.click();
  await first.pressSequentially("2");
  await first.press("Enter");
  assert(await first.inputValue() === "2", "frequency input did not accept a typed value");
  assert(await page.evaluate(() => document.documentElement.scrollWidth) <= 390, "page scrolls horizontally");
});

await check("Calculator states when programme cost is not included", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/proof-calculator");
  const note = page.getByText("Programme costs are not included in this net estimate", { exact: false });
  const netRow = () => page.locator("tr", { hasText: "Net monthly impact hypothesis" }).innerText();
  assert(await note.first().isVisible(), "no statement that programme costs are excluded at $0");
  const atZero = await netRow();
  const cost = page.getByLabel("Monthly programme cost — exact value");
  await cost.click();
  await cost.pressSequentially("1000");
  await cost.press("Enter");
  assert(await note.count() === 0, "exclusion statement remains after a cost is entered");
  const withCost = await netRow();
  assert(atZero !== withCost, "entering a programme cost did not change the net estimate");
});

// Phase 2: engine identifiers stay behind "Technical identifiers"; wording matches what the demo actually does.
const ENGINE_TEXT = /\b(signal-received|decision-required|approval-required|in-action|mock-dispatch|outcome-verification|late-response|ineffective-action|missing-receipt|missing-measurement|synthetic-duty-manager|delegated-authority|duty-manager|hotel-loop-v\d)\b|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|"responseMinutes"/;
// innerText skips the contents of closed <details>, so this reads only what is shown by default.
const visibleText = (page, selector) => page.locator(selector).first().innerText();
const assertPlain = (text, where) => {
  const match = text.match(ENGINE_TEXT);
  assert(!match, `${where} shows the engine identifier "${match?.[0]}"`);
};

await check("Architecture Lab shows plain-language status, review and replay", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/architecture-lab");
  const main = "main";
  const advanceButton = () => page.locator("main > section").first().locator("button:has-text(\"→\")");
  for (let step = 0; step < 8 && await advanceButton().count(); step += 1) {
    assertPlain(await visibleText(page, main), `Architecture Lab step ${step + 1}`);
    const select = page.getByLabel("Synthetic follow-up condition");
    if (!(await select.isDisabled())) await select.selectOption("late-response");
    await advanceButton().click();
  }
  await page.getByRole("button", { name: "Approve change for testing" }).click();
  await page.getByRole("button", { name: "Replay approved improvement" }).click();
  await page.locator("summary", { hasText: "Inspect the recorded case history" }).click();
  const text = await visibleText(page, main);
  assertPlain(text, "Architecture Lab review, replay and case history");
  assert(/Respond within\s+30 minutes\s+15 minutes/.test(text), "proposal does not show the changed setting as Now → Proposed");
  assert(!/Intervention attempts before escalation/.test(text), "proposal lists a setting it does not change");
  assert(/the hotel's live settings are unchanged/.test(text), "approval does not say the live settings are unchanged");
});

await check("Architecture Lab keeps late evidence distinct from the recorded follow-up", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/architecture-lab");
  const advanceButton = () => page.locator("main > section").first().locator("button:has-text(\"→\")");
  for (let step = 0; step < 8 && await advanceButton().count(); step += 1) {
    const select = page.getByLabel("Synthetic follow-up condition");
    if (!(await select.isDisabled())) await select.selectOption("missing-measurement");
    await advanceButton().click();
  }
  await page.getByRole("button", { name: /Supply synthetic measurement/ }).click();
  const text = await visibleText(page, "main");
  assert(text.includes("Outcome after late evidence"), "late evidence is still labelled as the recorded outcome");
  assert(text.includes("The earlier follow-up (pending evidence) stays on record"), "the earlier follow-up is not shown as kept");
});

await check("Simulation Lab shows plain-language journeys and proposals", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/operations?view=simulation");
  await page.getByRole("button", { name: "Run 100 outcome journeys" }).click();
  const panel = 'section[aria-label="Hotel outcome and learning loop"]';
  const journey = page.locator(panel).getByRole("combobox");
  const options = await journey.locator("option").allInnerTexts();
  await journey.selectOption({ index: options.findIndex(text => /review needed/.test(text)) });
  let text = await visibleText(page, panel);
  assertPlain(text, "Simulation Lab journey awaiting review");
  assert(/Respond within\s+30 minutes\s+15 minutes/.test(text), "proposal is not shown as a Now → Proposed setting change");
  await page.getByRole("button", { name: "Approve change and replay" }).click();
  text = await visibleText(page, panel);
  assertPlain(text, "Simulation Lab approved journey");
  assert(/Approved for testing by Duty Manager \(simulated\) at \d{2}:\d{2}/.test(text), "approval does not name the reviewer and time in plain language");
  const pendingIndex = (await journey.locator("option").allInnerTexts()).findIndex(t => /Pending evidence/.test(t));
  await journey.selectOption({ index: pendingIndex });
  await page.getByRole("button", { name: "Record late follow-up measurement" }).click();
  text = await visibleText(page, panel);
  assertPlain(text, "Simulation Lab journey with late evidence");
  assert(text.includes("The earlier follow-up stays on record"), "late evidence does not say the earlier follow-up is kept");
  await page.getByRole("button", { name: /Approve all/ }).click();
  assert(/Run cycle 2 with \d+ approved proposals \(3 setting changes\)/.test(await page.locator(panel).getByRole("button", { name: /Run cycle 2/ }).innerText()), "cycle 2 button does not say how many settings change");
  const whole = await visibleText(page, "main");
  assert(!/GitHub|merged into main/.test(whole), "Simulation Lab still shows engineering workflow copy");
});

await check("Operations Centre and Integration Brief never claim delivery", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/operations");
  const ledger = await visibleText(page, "#evidence-ledger");
  assert(!ledger.includes("Illustrative only —"), "evidence ledger still prefixes every cell with a disclaimer");
  assert(!/\bDelivered to guest\b|\bGuest notified\b/.test(await visibleText(page, "main")), "Operations Centre says guests were notified or messages delivered");
  assert(ledger.includes("Nothing below was sent, approved or captured"), "ledger does not state once that its rows are modelled");
  await open(page, "/partner-room/integration-brief");
  assert(!(await visibleText(page, "main")).includes("deliver and confirm demo communications"), "Integration Brief says demo messages are delivered");
});

await check("Operating Evolution states unmeasured results plainly", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/operating-evolution");
  await page.getByLabel("Follow-up measurements available").uncheck();
  await page.getByRole("button", { name: /^Run cycle/ }).click();
  const cards = await visibleText(page, 'section[aria-labelledby="evolution-human"]');
  assert(!/Unconfirmed (modelled|total|arrival|staff|unnecessary)/.test(cards), "impact cards still read \"Unconfirmed …\" as a number");
  assert(cards.includes("not confirmed"), "impact cards do not say results are not confirmed");
});

await check("Delivery wording is conditional; recorded receipts are labelled synthetic", { width: 1440, height: 900 }, async page => {
  // Every "sent"/"delivered" claim must be negated, conditional or a draft: nothing leaves this demonstration.
  const unqualified = text => [...text.matchAll(/[^.\n]{0,60}\b(sent|delivered|notified)\b[^.\n]{0,20}/gi)]
    .map(match => match[0].trim())
    .filter(context => !/\b(not|never|nothing|no|unsent|would|draft|drafted|future|before|without|pilot|requires?|required)\b/i.test(context));
  await open(page, "/partner-room/operations");
  // Action Centre cards open one at a time; read each card's details as well as the rest of the page.
  const moments = ["Room Readiness Recovery", "Guest Distress Follow-Up", "Repeat Guest Loyalty Protection", "Maintenance Escalation", "Staff Pressure Response", "Partner Transport Activation", "Post-Stay Complaint Recovery"];
  let operationsText = await visibleText(page, "main");
  for (const moment of moments) {
    await page.getByText(moment, { exact: true }).first().click();
    operationsText += `\n${await visibleText(page, "main")}`;
  }
  assert(operationsText.includes("Communication status"), "Action Centre card details were not opened");
  const operations = unqualified(operationsText);
  assert(operations.length === 0, `Operations Centre states delivery as fact: "${operations[0]}"`);
  // Receipts the simulation records are synthetic evidence and must say so.
  await open(page, "/partner-room/operations?view=simulation");
  await page.getByRole("button", { name: "Run 100 outcome journeys" }).click();
  const learning = await visibleText(page, 'section[aria-label="Hotel outcome and learning loop"]');
  assert(learning.includes("Synthetic delivery receipt and restoration recorded"), "a met journey does not label its receipt as synthetic");
  assert(!/Delivery confirmed/.test(learning), "Simulation Lab says delivery was confirmed");
  await open(page, "/partner-room/architecture-lab");
  const advanceButton = () => page.locator("main > section").first().locator("button:has-text(\"→\")");
  for (let step = 0; step < 8 && await advanceButton().count(); step += 1) await advanceButton().click();
  await page.locator("summary", { hasText: "Inspect the recorded case history" }).click();
  const lab = await visibleText(page, "main");
  const bareReceipts = [...lab.matchAll(/[^.\n]{0,30}receipt recorded/gi)].map(match => match[0]).filter(context => !/synthetic/i.test(context));
  assert(bareReceipts.length === 0, `Architecture Lab shows a receipt without marking it synthetic: "${bareReceipts[0]}"`);
  assert(/Evidence ledger[\s\S]*Mandatory evidence gates closure/.test(lab), "evidence ledger node missing");
});

// Functional pass: the Operations Centre runs the activated deployment and keeps static examples separate.
async function activateDeployment(page, edit) {
  await open(page, "/partner-room/build-configure");
  if (edit) await edit(page);
  await page.getByRole("button", { name: /Activate/ }).first().click();
  await page.getByRole("button", { name: /Activate Travel Environment/ }).click();
  await page.waitForFunction(() => localStorage.getItem("rtbx_travel_deployment_v1")?.includes("active-simulation"));
}
const noHorizontalScroll = async (page, width) => {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  assert(scrollWidth <= width, `page scrolls horizontally (${scrollWidth}px at ${width}px)`);
};

for (const viewport of [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 1440, height: 900 }]) {
  await check(`Operations Centre without a deployment routes to Build & Configure at ${viewport.width}px`, viewport, async page => {
    await open(page, "/partner-room/operations");
    const empty = page.getByTestId("no-deployment");
    assert(await empty.isVisible(), "no empty state for a missing deployment");
    assert(/Nothing on this page comes from your configuration/.test(await empty.innerText()), "empty state does not say nothing is from the configuration");
    assert(await empty.getByRole("link", { name: "Go to Build & Configure →" }).getAttribute("href") === "/partner-room/build-configure", "no route to Build & Configure");
    assert(/not results/.test(await page.getByTestId("static-examples-note").innerText()), "static examples are not marked as non-results");
    await noHorizontalScroll(page, viewport.width);
  });

  await check(`Operations Centre reflects the activated deployment at ${viewport.width}px`, viewport, async page => {
    await activateDeployment(page, async p => {
      await p.locator("#deploy-name").fill("Bayside Resort — Pilot");
      await p.locator("#property-type").selectOption("Resort");
    });
    await open(page, "/partner-room/operations");
    const summary = page.getByTestId("deployment-summary");
    const text = await summary.innerText();
    assert(text.includes("Bayside Resort — Pilot"), "deployment name missing");
    assert(await page.getByTestId("deployment-category").innerText() === "Resort · Owner-operated", "category does not follow the configuration");
    const roles = await page.getByTestId("deployment-roles").locator("li").allInnerTexts();
    assert(roles.includes("Duty Manager") && roles.length === 10, `active roles not listed (${roles.length})`);
    const scenarios = await page.getByTestId("deployment-scenarios").locator(":scope > li").count();
    assert(scenarios === 3, `expected 3 enabled scenarios, found ${scenarios}`);
    assert(/Room Not Ready/i.test(text) && /Who decides/.test(text) && /Closure requires/.test(text), "scenario settings missing");
    const note = await page.getByTestId("static-examples-note").innerText();
    assert(note.includes("Bayside Resort — Pilot") && /not results from it/.test(note), "static examples are not separated from the deployment");
    assert(await page.locator("#static-examples-title").innerText() === "Static illustrative examples", "static examples heading missing");
    assert(await page.locator("#static-examples #action-centre").count() === 1 && await page.locator("#configured-operation #action-centre").count() === 0, "Action Centre is not in the static examples part");
    await noHorizontalScroll(page, viewport.width);
  });
}

await check("A configuration change reaches execution and closure", { width: 1440, height: 900 }, async page => {
  const scenarioCard = () => page.locator('[data-scenario-id="repeat-guest-room-not-ready"]');
  await activateDeployment(page);
  await open(page, "/partner-room/operations");
  const before = Number((await scenarioCard().getByTestId("closure-requires").innerText()).match(/\d+/)[0]);
  // Make an optional evidence item required, then re-activate.
  await activateDeployment(page, async p => {
    await p.getByRole("button", { name: /Evidence/ }).first().click();
    await p.getByRole("switch", { name: "Escalation notification record — optional" }).click();
  });
  await open(page, "/partner-room/operations");
  const after = Number((await scenarioCard().getByTestId("closure-requires").innerText()).match(/\d+/)[0]);
  assert(after === before + 1, `closure requirement did not change (${before} → ${after})`);
  await scenarioCard().locator("summary").click();
  assert((await scenarioCard().innerText()).includes("Escalation notification record"), "new requirement not listed");

  // Run the scenario: closure waits for the newly required item and the run is recorded as synthetic.
  const records = page.getByTestId("run-records");
  assert(/No runs yet/.test(await records.innerText()), "records shown before any run");
  await page.getByRole("button", { name: "Start Local Simulation →" }).first().click();
  for (const name of ["Receive Signal", "Validate Signal & Context", "Route for Approval", "Approve as Duty Manager", "Resolve Scenario"]) {
    await page.getByRole("button", { name, exact: true }).click();
  }
  const boxes = page.getByRole("checkbox", { name: /\(required\)$/ });
  for (let i = 0; i < await boxes.count(); i += 1) {
    const box = boxes.nth(i);
    if (!(await box.getAttribute("aria-label")).startsWith("Escalation notification record")) await box.check();
  }
  assert(await page.getByRole("button", { name: "Close (blocked — evidence incomplete)" }).isVisible(), "closure is not blocked by the newly required item");
  await page.getByRole("checkbox", { name: "Escalation notification record (required)" }).check();
  await page.getByRole("button", { name: "Close Scenario", exact: true }).click();
  const row = records.locator("tbody tr").first();
  await row.filter({ hasText: "Closed" }).waitFor({ timeout: 5000 }).catch(() => {});
  const rowText = await row.innerText();
  assert(/Closed/.test(rowText) && /Approved by Duty Manager \(simulated\)/.test(rowText) && new RegExp(`${after} of ${after} recorded \\(synthetic\\)`).test(rowText), `run record incomplete: ${rowText}`);
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  await check(`Calculator value tiers are validated, not adjusted, at ${viewport.width}px`, viewport, async page => {
    await open(page, "/partner-room/proof-calculator");
    const tier = name => page.getByLabel(`Service opportunities: ${name} value per successful action`);
    const values = async () => [await tier("low").inputValue(), await tier("base").inputValue(), await tier("high").inputValue()];
    // Draft typing: nothing commits or complains until editing ends.
    await tier("low").click();
    await tier("low").pressSequentially("900");
    assert(await page.getByTestId("estimate-paused").count() === 0, "estimate paused while still typing");
    await tier("low").press("Enter");
    assert(JSON.stringify(await values()) === JSON.stringify(["900", "40", "80"]), `tiers changed each other: ${await values()}`);
    const error = page.locator("#tiers-opportunity-error");
    assert((await error.innerText()).includes("Low ($900) is higher than Base ($40)"), "no specific inline message");
    assert(await tier("low").getAttribute("aria-invalid") === "true" && await tier("base").getAttribute("aria-invalid") === "true", "invalid tiers not marked");
    assert((await tier("low").getAttribute("aria-describedby"))?.includes("tiers-opportunity-error"), "message not linked to the field");
    assert(await page.getByTestId("estimate-paused").first().isVisible(), "estimate not paused");
    assert(await page.getByText("Illustrative monthly financial range").count() === 0, "a financial range is still shown for an invalid range");
    // Fixing the range keeps every entered value and restores the estimate.
    for (const [name, value] of [["base", "1000"], ["high", "1200"]]) {
      await tier(name).fill("");
      await tier(name).pressSequentially(value);
      await tier(name).press("Tab");
    }
    assert(JSON.stringify(await values()) === JSON.stringify(["900", "1000", "1200"]), `entered values not preserved: ${await values()}`);
    assert(await error.count() === 0 && await page.getByTestId("estimate-paused").count() === 0, "message remains after the range is fixed");
    assert(await page.getByText("Illustrative monthly financial range").isVisible(), "estimate did not return");
    await noHorizontalScroll(page, viewport.width);
  });
}

// Phase 3: the start page, the guided route and navigation.
const ROUTE = [
  ["Architecture", "/partner-room/architecture-lab", ""],
  ["Build & Configure", "/partner-room/build-configure", ""],
  ["Configured execution and evidence", "/partner-room/operations", ""],
  ["Simulation Lab", "/partner-room/operations", "?view=simulation"],
  ["Operating Evolution", "/partner-room/operating-evolution", ""],
  ["Value Calculator", "/partner-room/proof-calculator", ""],
  ["Stage 3", "/partner-room/product-proof/stage-3-operating-layer", ""],
  ["Pilot", "/partner-room/pilot-model", ""],
];
const inViewport = (page, selector) => page.evaluate(sel => {
  const rect = document.querySelector(sel)?.getBoundingClientRect();
  return !!rect && rect.top >= 0 && rect.top < window.innerHeight - 40;
}, selector);

for (const viewport of [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 1440, height: 900 }]) {
  await check(`Start page explains who it serves and the operating loop at ${viewport.width}px`, viewport, async page => {
    await open(page, "/partner-room");
    assert(await page.locator("#who-we-serve li").count() === 4, "audiences missing");
    const stages = await page.locator("#operating-loop .sj-loop-stage").allInnerTexts();
    assert(stages.map(text => text.replace(/^\d+\s*/, "").trim()).join(" → ") === "Signal → Context → Governed decision → Action → Evidence → Reviewed learning → Improved next cycle", `loop order: ${stages}`);
    // Keyboard: Enter on "Next stage" walks every stage, then returns to the first.
    const detail = page.getByTestId("loop-detail");
    await page.getByRole("button", { name: "Next stage →" }).focus();
    for (let i = 2; i <= 7; i += 1) {
      await page.keyboard.press("Enter");
      assert((await detail.textContent()).includes(`Stage ${i} of 7`), `Enter did not reach stage ${i}`);
    }
    assert(/Improved next cycle[\s\S]*approved settings/.test(await detail.textContent()), "last stage does not loop back to the next cycle");
    await page.keyboard.press("Enter");
    assert((await detail.textContent()).includes("Stage 1 of 7"), "loop does not return to the first stage");
    await page.getByRole("button", { name: /Evidence$/ }).click();
    assert(await page.getByRole("button", { name: /Evidence$/ }).getAttribute("aria-current") === "step", "chosen stage not marked current");
    assert((await detail.getByRole("link").getAttribute("href")) === "/partner-room/operations#generated-evidence", "evidence stage does not link to generated evidence");
    const route = await page.locator('[data-testid="guided-route"] h3').allInnerTexts();
    assert(JSON.stringify(route) === JSON.stringify(ROUTE.map(([title]) => title)), `route order: ${route}`);
    await page.getByTestId("hero-guided-route").click();
    await page.waitForFunction(() => { const r = document.querySelector("#guided-route").getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight / 2; });
    await noHorizontalScroll(page, viewport.width);
  });

  await check(`Guided route walks all eight steps by keyboard at ${viewport.width}px`, viewport, async page => {
    await open(page, "/partner-room");
    await page.getByTestId("guided-route-start").click();
    for (const [index, [title, path, search]] of ROUTE.entries()) {
      await page.waitForURL(url => url.pathname === path && url.search === search);
      const progress = page.getByTestId("journey-progress");
      await progress.waitFor();
      assert((await progress.innerText()).includes(`Step ${index + 1} of 8: ${title}`), `step ${index + 1} shows "${await progress.innerText()}"`);
      await noHorizontalScroll(page, viewport.width);
      const next = page.getByTestId("journey-next-step");
      await next.focus();
      await page.keyboard.press("Enter");
    }
    await page.waitForURL(url => url.pathname === "/partner-room/next-step");
    assert(await page.getByTestId("journey-progress").count() === 0, "progress shown off the route");
  });
}

await check("Guided route back from the Simulation Lab returns to the configured operation", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/operations?view=simulation");
  await page.getByTestId("journey-next").getByRole("link", { name: /Configured execution and evidence/ }).click();
  await page.waitForURL(url => url.pathname === "/partner-room/operations" && url.search === "" && url.hash === "#configured-operation");
  await page.waitForFunction(() => { const r = document.querySelector("#configured-operation")?.getBoundingClientRect(); return !!r && r.top >= 0 && r.top < innerHeight / 2; }, null, { timeout: 5000 });
});

for (const viewport of [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 1440, height: 900 }]) {
  await check(`Navigation reaches Calculator, Stage 3 and generated evidence at ${viewport.width}px`, viewport, async page => {
    const desktop = viewport.width >= 1024;
    const menu = async () => {
      if (desktop) return page.getByRole("navigation", { name: "Partner Room navigation" });
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      return page.locator("#mobile-nav-panel");
    };
    await open(page, "/partner-room");
    await (await menu()).getByRole("link", { name: "Calculator", exact: true }).click();
    await page.waitForURL(url => url.pathname === "/partner-room/proof-calculator");
    await page.getByRole("heading", { level: 1, name: /Everyday operations/ }).waitFor();
    await (await menu()).getByRole("link", { name: "Stage 3", exact: true }).click();
    await page.waitForURL(url => url.pathname === "/partner-room/product-proof/stage-3-operating-layer");
    await (await menu()).getByRole("link", { name: "Evidence", exact: true }).click();
    await page.waitForURL(url => url.pathname === "/partner-room/operations" && url.hash === "#generated-evidence");
    await page.waitForFunction(() => { const r = document.querySelector("#generated-evidence")?.getBoundingClientRect(); return !!r && r.top >= 0 && r.top < innerHeight / 2; }, null, { timeout: 5000 });
    assert((await page.locator("#generated-evidence").innerText()).includes("No evidence has been generated."), "no empty state before a run");
    assert(await page.locator("#generated-evidence").evaluate(el => !!el.closest("#configured-operation")), "generated evidence is not part of the configured operation");
    await noHorizontalScroll(page, viewport.width);
  });
}

await check("Reference menu works by keyboard and keeps every destination at 1440px", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room");
  const trigger = page.getByRole("button", { name: /Reference Material/ });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  const items = page.getByRole("menuitem");
  await items.first().waitFor();
  assert(await items.first().evaluate(el => el === document.activeElement), "ArrowDown did not focus the first item");
  const labels = await items.allInnerTexts();
  for (const label of ["Guided Route", "Architecture Lab", "Build & Configure", "Generated Evidence", "Simulation Lab", "Operating Evolution", "Value Calculator", "Stage 3 Operating Layer", "Pilot Model", "Static Examples: Outcomes and Value"]) {
    assert(labels.includes(label), `menu lacks ${label}`);
  }
  await page.keyboard.press("End");
  await page.waitForFunction(() => { const all = document.querySelectorAll('[role="menuitem"]'); return all[all.length - 1] === document.activeElement; }, null, { timeout: 2000 }).catch(() => { throw new Error("End did not reach the last item"); });
  await page.keyboard.press("Escape");
  assert(await trigger.evaluate(el => el === document.activeElement), "Escape did not return focus to the trigger");
});

await check("Primary navigation fits on one row at 1024px", { width: 1024, height: 768 }, async page => {
  await open(page, "/partner-room");
  const row = await page.locator(".rtbx-desktop-nav").evaluate(el => ({ scroll: el.scrollWidth, client: el.clientWidth, height: el.getBoundingClientRect().height }));
  assert(row.scroll <= row.client && row.height < 60, `navigation row overflows (${row.scroll} > ${row.client}, ${row.height}px tall)`);
  await noHorizontalScroll(page, 1024);
});

await check("Evidence navigation shows the records a run generated at 1440px", { width: 1440, height: 900 }, async page => {
  await activateDeployment(page);
  await open(page, "/partner-room/operations");
  assert((await page.locator("#generated-evidence").innerText()).includes("No runs yet, so no evidence has been generated."), "no empty state before a run");
  await page.getByRole("button", { name: "Start Local Simulation →" }).first().click();
  for (const name of ["Receive Signal", "Validate Signal & Context", "Route for Approval", "Approve as Duty Manager", "Resolve Scenario"]) {
    await page.getByRole("button", { name, exact: true }).click();
  }
  const boxes = page.getByRole("checkbox", { name: /\(required\)$/ });
  for (let i = 0; i < await boxes.count(); i += 1) await boxes.nth(i).check();
  await page.getByRole("button", { name: "Close Scenario", exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("navigation", { name: "Partner Room navigation" }).getByRole("link", { name: "Evidence", exact: true }).click();
  await page.waitForFunction(() => { const r = document.querySelector("#generated-evidence").getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight / 2; }, null, { timeout: 5000 });
  const section = page.locator("#generated-evidence");
  const row = await section.locator("tbody tr").first().innerText();
  assert(/Closed/.test(row) && /Approved by Duty Manager \(simulated\)/.test(row), `record missing: ${row}`);
  await section.locator("summary", { hasText: "Evidence recorded" }).click();
  assert(/Room readiness confirmation · synthetic/.test(await section.innerText()), "recorded evidence not listed as synthetic");
  assert(await page.locator("#static-examples").evaluate(el => /Static illustrative examples/.test(el.innerText)), "static examples lost their label");
});

// Generated evidence is a session record: it survives Partner Room navigation and never outlives its configuration.
const PRIMARY = ["Working Proof", "Evidence", "Calculator", "Stage 3", "Pilot", "Next Step"];
async function goVia(page, label, width) {
  const desktop = width >= 1024;
  if (!desktop) await page.getByRole("button", { name: "Open navigation menu" }).click();
  const scope = desktop ? page.getByRole("navigation", { name: "Partner Room navigation" }) : page.locator("#mobile-nav-panel");
  if (PRIMARY.includes(label)) return scope.getByRole("link", { name: label, exact: true }).first().click();
  await scope.getByRole("button", { name: /Reference Material/ }).click();
  await (desktop ? page.getByRole("menuitem", { name: label, exact: true }) : scope.getByRole("link", { name: label, exact: true })).click();
}
async function runRoomScenario(page) {
  const panel = page.locator("#runtime-execution");
  await panel.getByRole("button", { name: "Start Local Simulation →" }).first().click();
  for (const name of ["Receive Signal", "Validate Signal & Context", "Route for Approval", "Approve as Duty Manager", "Resolve Scenario"]) {
    await page.getByRole("button", { name, exact: true }).click();
  }
  const boxes = page.getByRole("checkbox", { name: /\(required\)$/ });
  for (let i = 0; i < await boxes.count(); i += 1) await boxes.nth(i).check();
  await page.getByRole("button", { name: "Close Scenario", exact: true }).click();
}
async function evidenceSnapshot(page) {
  const section = page.locator("#generated-evidence");
  await section.waitFor();
  const rows = section.locator("tbody tr");
  const count = await rows.count();
  if (!count) return { count, row: "", items: "", heading: await section.locator("h3").innerText() };
  const details = rows.first().locator("details");
  if (!(await details.getAttribute("open") !== null)) await details.locator("summary").click();
  return { count, row: await rows.first().innerText(), items: await details.locator("ul").innerText(), heading: await section.locator("h3").innerText() };
}
const waitForEvidenceInView = page => page.waitForFunction(() => {
  const r = document.querySelector("#generated-evidence")?.getBoundingClientRect();
  return !!r && r.top >= 0 && r.top < innerHeight / 2;
}, null, { timeout: 5000 });

for (const viewport of [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 1440, height: 900 }]) {
  await check(`Generated evidence survives Partner Room navigation at ${viewport.width}px`, viewport, async page => {
    await activateDeployment(page);
    await open(page, "/partner-room/operations");
    await runRoomScenario(page);
    const before = await evidenceSnapshot(page);
    assert(before.count === 1 && /Closed/.test(before.row) && /Approved by Duty Manager \(simulated\)/.test(before.row), `run not recorded: ${before.row}`);
    assert(/Room readiness confirmation · synthetic/.test(before.items), "recorded evidence missing");

    // Leave through the menu (Simulation Lab, Calculator, another page), then come back through Evidence.
    await goVia(page, "Simulation Lab", viewport.width);
    await page.waitForURL(url => url.search === "?view=simulation");
    await goVia(page, "Calculator", viewport.width);
    await page.waitForURL(url => url.pathname === "/partner-room/proof-calculator");
    await goVia(page, "Pilot", viewport.width);
    await page.waitForURL(url => url.pathname === "/partner-room/pilot-model");
    await goVia(page, "Evidence", viewport.width);
    await page.waitForURL(url => url.pathname === "/partner-room/operations" && url.hash === "#generated-evidence");
    await waitForEvidenceInView(page);
    const after = await evidenceSnapshot(page);
    assert(after.row === before.row, `run changed after navigation:\n${before.row}\n→ ${after.row}`);
    assert(after.items === before.items, "recorded evidence changed after navigation");
    assert(after.heading === before.heading, "record attributed to a different configuration");
    assert(await page.locator("#runtime-execution").getByText("Synthetic run · Closed").count() >= 1, "the closed run was not restored in its trace");
    assert(/Refreshing or closing the page ends the session/.test(await page.getByTestId("session-notice").innerText({ timeout: 2000 })), "refresh notice missing");
    await noHorizontalScroll(page, viewport.width);

    // Refreshing ends the demonstration session.
    await page.reload({ waitUntil: "networkidle" });
    assert((await evidenceSnapshot(page)).count === 0, "records survived a refresh");
  });

  await check(`Reconfiguring or resetting never carries records over at ${viewport.width}px`, viewport, async page => {
    await activateDeployment(page);
    await open(page, "/partner-room/operations");
    await runRoomScenario(page);
    assert((await evidenceSnapshot(page)).count === 1, "no record to carry over");

    // A changed configuration starts with no records and a fresh trace.
    await goVia(page, "Build & Configure", viewport.width);
    await page.locator("#deploy-name").fill("Bayside Resort — Pilot");
    await page.getByRole("button", { name: /Activate/ }).first().click();
    await page.getByRole("button", { name: /Activate Travel Environment/ }).click();
    await page.waitForFunction(() => localStorage.getItem("rtbx_travel_deployment_v1")?.includes("Bayside Resort"));
    await goVia(page, "Evidence", viewport.width);
    await waitForEvidenceInView(page);
    const changed = await evidenceSnapshot(page);
    assert(changed.count === 0 && changed.heading.includes("Bayside Resort — Pilot"), `old record shown for the new configuration: ${changed.heading} / ${changed.row}`);
    assert(/No runs yet/.test(await page.locator("#generated-evidence").innerText()), "no empty state for the new configuration");
    assert(await page.locator("#runtime-execution").getByText(/Synthetic run ·/).count() === 0, "an old run was restored into the new configuration's trace");

    // Run under the new configuration, then reset: nothing survives, and re-activating starts clean.
    await runRoomScenario(page);
    assert((await evidenceSnapshot(page)).count === 1, "new configuration's run not recorded");
    await goVia(page, "Build & Configure", viewport.width);
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("button", { name: "Reset to defaults" }).click();
    await goVia(page, "Evidence", viewport.width);
    await waitForEvidenceInView(page);
    assert((await page.locator("#generated-evidence").innerText()).includes("No evidence has been generated."), "records shown after reset");
    // Re-activate without reloading, so only the session rules (not a fresh page) can clear the records.
    await goVia(page, "Build & Configure", viewport.width);
    await page.getByRole("button", { name: /Activate/ }).first().click();
    await page.getByRole("button", { name: /Activate Travel Environment/ }).click();
    await goVia(page, "Evidence", viewport.width);
    await waitForEvidenceInView(page);
    assert((await evidenceSnapshot(page)).count === 0, "records from before the reset reappeared after re-activation");
  });
}

// A draft approval recorded in a run, but not yet marked reviewed, is restored exactly.
for (const viewport of [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 1440, height: 900 }]) {
  await check(`Draft approval survives navigation unchanged at ${viewport.width}px`, viewport, async page => {
    await activateDeployment(page);
    await open(page, "/partner-room/operations");
    const trace = page.locator('[data-testid="exec-trace"][data-trace-scenario="repeat-guest-room-not-ready"]');
    await trace.getByRole("button", { name: "Start Local Simulation →" }).click();
    for (const name of ["Receive Signal", "Validate Signal & Context", "Route for Approval", "Approve as Duty Manager"]) {
      await trace.getByRole("button", { name, exact: true }).click();
    }
    // In action: approve the first draft that needs approval, but do not mark it reviewed.
    const drafts = trace.getByRole("button", { name: "Approve as Duty Manager", exact: true });
    const pendingBefore = await drafts.count();
    assert(pendingBefore >= 2, `expected drafts awaiting approval, found ${pendingBefore}`);
    await drafts.first().click();
    const snapshot = async () => ({
      text: (await trace.innerText()).replace(/\s+/g, " "),
      approvals: await trace.getByText(/^Simulation approval recorded for Duty Manager$/).count(),
      pending: await drafts.count(),
      reviewed: await trace.getByText(/Draft reviewed locally/).count(),
      enabled: await trace.getByRole("button").evaluateAll(buttons => buttons.filter(b => !b.disabled).map(b => b.textContent.trim())),
    });
    const before = await snapshot();
    assert(before.approvals === 1 && before.pending === pendingBefore - 1 && before.reviewed === 0, `approval not recorded as expected: ${JSON.stringify(before)}`);
    assert(before.enabled.includes("Resolve Scenario"), "next action missing before navigation");

    await goVia(page, "Calculator", viewport.width);
    await page.waitForURL(url => url.pathname === "/partner-room/proof-calculator");
    await goVia(page, "Evidence", viewport.width);
    await page.waitForURL(url => url.pathname === "/partner-room/operations");
    await trace.getByText("Synthetic run ·").first().waitFor();
    const after = await snapshot();
    assert(after.approvals === 1, `approval lost after navigation (${after.approvals} recorded)`);
    assert(after.pending === before.pending, `drafts awaiting approval changed: ${before.pending} → ${after.pending}`);
    assert(after.reviewed === 0, "the approved draft was advanced to reviewed");
    assert(JSON.stringify(after.enabled) === JSON.stringify(before.enabled), `available actions changed:\n${before.enabled}\n→ ${after.enabled}`);
    assert(after.text === before.text, "the run's trace changed after navigation");
  });
}

// Phase 4: portfolio coordination → Calculator → Integration Brief security → pilot scope, as one journey.
for (const viewport of [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 1440, height: 900 }]) {
  await check(`Phase 4 journey: portfolio, security and pilot scope at ${viewport.width}px`, viewport, async page => {
    const requests = [];
    page.on("request", request => requests.push({ method: request.method(), url: request.url(), body: request.postData() }));
    const inView = selector => page.waitForFunction(sel => {
      const r = document.querySelector(sel)?.getBoundingClientRect();
      return !!r && r.top >= -5 && r.top < innerHeight / 2;
    }, selector, { timeout: 5000 });

    // Stage 3: several properties, local accountability, governed portfolio exceptions.
    await open(page, "/partner-room");
    await goVia(page, "Stage 3", viewport.width);
    const portfolio = page.locator("#portfolio-coordination");
    await portfolio.waitFor();
    assert(await portfolio.locator("[data-property]").count() === 4, "expected four properties");
    assert(/Synthetic data\./.test(await page.getByTestId("portfolio-synthetic").innerText()), "portfolio not labelled synthetic");
    for (const status of ["implemented", "simulated", "proposed"]) assert(await portfolio.locator(`[data-capability="${status}"]`).count() === 1, `capability group ${status} missing`);
    const message = page.getByTestId("portfolio-message");
    await portfolio.getByRole("button", { name: /Move a booked guest from Harbour Hotel to Coastal Resort/ }).click();
    await page.locator("#pc-actor").selectOption("dm-harbour");
    await portfolio.getByRole("button", { name: "Approve as selected role" }).click();
    assert(/has no authority here/.test(await message.innerText()), "a local Duty Manager approved a cross-property move");
    await page.locator("#pc-actor").selectOption("regional-ops");
    await portfolio.getByRole("button", { name: "Approve as selected role" }).click();
    assert(/Still needed: General Manager · Coastal Resort/.test(await message.innerText()), "second approval not required");
    await page.locator("#pc-actor").selectOption("gm-coastal");
    await portfolio.getByRole("button", { name: "Approve as selected role" }).click();
    assert(/All required approvals are recorded \(simulated\); nothing was sent/.test(await message.innerText()), "move not approved after both approvals");
    await portfolio.getByRole("button", { name: /Restricted welfare case at Bayside Holiday Park/ }).click();
    await page.locator("#pc-actor").selectOption("regional-ops");
    await portfolio.getByRole("button", { name: "Approve as selected role" }).click();
    assert(/Welfare cases stay with Duty Manager · Bayside Holiday Park/.test(await message.innerText()), "the portfolio decided a welfare case");
    await noHorizontalScroll(page, viewport.width);
    await portfolio.getByRole("link", { name: /Scope a pilot/ }).click();
    await page.waitForURL(url => url.pathname === "/partner-room/pilot-model" && url.hash === "#pilot-scope");
    await inView("#pilot-scope");
    assert(/Not modelled yet/.test(await page.getByTestId("scope-value").innerText()), "value shown before the Calculator was used");

    // Calculator: carry the modelled value into the scope.
    await goVia(page, "Calculator", viewport.width);
    await page.getByRole("button", { name: "Use in pilot scope →" }).click();
    await page.waitForURL(url => url.pathname === "/partner-room/pilot-model" && url.hash === "#pilot-scope");
    await inView("#pilot-scope");
    assert(/From the Calculator: 1 site\(s\) × 120 rooms; net monthly impact hypothesis .* Modelled, not a forecast/.test(await page.getByTestId("scope-value").innerText()), "Calculator value not carried");

    // Integration Brief: verified, demonstrated and required kept apart; no certification claimed.
    await goVia(page, "Integration", viewport.width);
    await page.locator("#security-data").waitFor();
    for (const group of ["verified", "demonstrated", "required"]) assert(await page.getByTestId(`security-${group}`).isVisible(), `${group} group missing`);
    assert((await page.getByTestId("security-verified").locator("li").allInnerTexts()).every(text => /Evidence:/.test(text)), "a verified control has no evidence");
    assert(!/Evidence:/.test(await page.getByTestId("security-demonstrated").innerText()), "demonstrated behaviour presented as verified");
    assert(/makes no certification claim/.test(await page.getByTestId("security-certification").innerText()), "certification statement missing");
    assert(/not authentication or access control/.test(await page.getByTestId("security-demonstrated").innerText()), "access code presented as a control");
    assert(/deployed Replit site has not been checked/.test(await page.getByTestId("security-scope").innerText()), "local-build findings not separated from the deployed site");
    assert(/ordinary request metadata/.test(await page.getByTestId("security-verified").innerText()), "font request metadata not explained");
    assert(!/No data leaves the browser/i.test(await page.locator("#security-data").innerText()), "unscoped data claim still shown");
    await noHorizontalScroll(page, viewport.width);
    await page.getByRole("link", { name: /Add integration and security prerequisites to a pilot scope/ }).click();
    await page.waitForURL(url => url.pathname === "/partner-room/pilot-model");
    await inView("#pilot-scope");

    // Pilot scope: two properties, accountable people, moments, baseline, measures, prerequisites, review.
    const scope = page.locator("#pilot-scope");
    await scope.getByLabel("Property 1 name").fill("Harbour Hotel");
    await scope.getByRole("button", { name: "Add a property" }).click();
    await scope.getByLabel("Property 2 name").fill("Coastal Resort");
    for (const role of ["Executive sponsor", "Pilot owner", "Property lead", "Approval role", "Measurement owner", "Integration and security owner", "Portfolio exception owner"]) {
      await scope.getByLabel(role).fill(`Named ${role}`);
    }
    await scope.getByLabel("What the decision will be based on").fill("Acknowledgement time improves on the baseline at both properties");
    assert(/Every part of the scope is filled in/.test(await page.getByTestId("scope-gaps").innerText()), `scope still has gaps: ${await page.getByTestId("scope-gaps").innerText()}`);
    const prereqs = await page.getByTestId("scope-prerequisites").innerText();
    assert(/Property Management Systems/.test(prereqs) && /Named sign-in and server-side permissions/.test(prereqs), "prerequisites missing");
    assert(/Subject to proposal; not a quote or approved pricing/.test(await page.getByTestId("scope-commercial").innerText()), "commercial assumptions not labelled");
    const summary = await page.getByTestId("scope-summary").inputValue();
    for (const part of ["- Harbour Hotel", "- Coastal Resort", "Portfolio exception owner: Named Portfolio exception owner", "SELECTED MOMENTS", "BASELINE", "MEASURES", "INTEGRATION PREREQUISITES", "REVIEW DECISION", "From the Calculator", "NOT A QUOTE"]) {
      assert(summary.includes(part), `summary lacks ${part}`);
    }
    // Honest enquiry fallback: an email draft for the visitor's own app, plus a download.
    const mail = await page.getByTestId("scope-mailto").getAttribute("href");
    assert(mail.startsWith("mailto:lance@rtbx.com.au?subject=") && decodeURIComponent(mail).includes("PROPERTIES"), "email draft not prepared");
    assert(/This page cannot send enquiries/.test(await page.getByTestId("scope-send-notice").innerText()), "no honest sending notice");
    const mailColours = await page.getByTestId("scope-mailto").evaluate(el => { const style = getComputedStyle(el); return [style.color, style.backgroundColor]; });
    assert(mailColours[0] !== mailColours[1], `email link text is invisible (${mailColours[0]} on ${mailColours[1]})`);
    const [download] = await Promise.all([page.waitForEvent("download"), scope.getByRole("button", { name: "Download as text" }).click()]);
    assert(download.suggestedFilename() === "jaldo-travel-pilot-scope.txt", "scope not downloadable");
    await noHorizontalScroll(page, viewport.width);

    // The draft survives moving away and back within the session.
    await goVia(page, "Stage 3", viewport.width);
    await page.locator("#portfolio-coordination").waitFor();
    await goVia(page, "Pilot", viewport.width);
    assert(await page.locator("#pilot-scope").getByLabel("Property 2 name").inputValue() === "Coastal Resort", "scope lost on navigation");

    // Nothing left the browser: only GETs, to the app itself or Google Fonts.
    const origin = new URL(page.url()).host;
    const unexpected = requests.filter(r => r.method !== "GET" || r.body || !(new URL(r.url).host === origin || /^fonts\.(googleapis|gstatic)\.com$/.test(new URL(r.url).host) || r.url.startsWith("blob:") || r.url.startsWith("data:")));
    assert(unexpected.length === 0, `unexpected requests: ${unexpected.slice(0, 3).map(r => `${r.method} ${r.url}`).join(", ")}`);
  });
}

// Stage 3 replacement: peak-period team pressure, its five challenge paths and the portfolio, as one journey.
for (const viewport of [{ width: 390, height: 844 }, { width: 820, height: 1180 }, { width: 1440, height: 900 }]) {
  await check(`Stage 3 peak-pressure journey and challenge paths at ${viewport.width}px`, viewport, async page => {
    const requests = [];
    page.on("request", request => requests.push({ method: request.method(), url: request.url(), body: request.postData() }));
    await open(page, "/partner-room");
    await goVia(page, "Stage 3", viewport.width);
    const peak = page.locator("#peak-pressure");
    await peak.waitFor();
    const approval = page.getByTestId("peak-approval");
    const message = () => page.getByTestId("peak-message").innerText();
    const stage = name => peak.locator(`[data-stage="${name}"] strong`).innerText();
    const reason = () => approval.getByLabel("Reason, or the information you need");
    const choose = name => peak.getByRole("group", { name: "Choose a path through the scenario" }).getByRole("button", { name: new RegExp(name) }).click();
    const aggregate = page.getByTestId("portfolio-aggregate");
    const recordAll = async () => {
      for (let i = 0; i < 12; i += 1) {
        const buttons = peak.getByRole("button", { name: /^Record as / });
        if (await buttons.count() === 0) return;
        await buttons.first().click();
      }
    };
    const approveDraft = () => peak.getByRole("button", { name: "Approve draft as Duty Manager" }).click();

    // Signals: source, time and reliability for each; the pattern is about the operation, not a person.
    assert(/Synthetic data\./.test(await page.getByTestId("peak-synthetic").innerText()), "scenario not labelled synthetic");
    const rows = page.getByTestId("peak-signals").locator("tbody tr");
    assert(await rows.count() === 6, "expected six signals");
    for (const cells of await rows.evaluateAll(trs => trs.map(tr => [...tr.querySelectorAll("td")].map(td => td.textContent.trim())))) {
      assert(cells.slice(1, 4).every(Boolean), `a signal lacks source, time or reliability: ${cells.join(" | ")}`);
    }
    const why = await page.getByTestId("peak-why").innerText();
    assert(/the operation, not any person/.test(why) && /not a diagnosis and it is not about any individual/.test(why), "review rationale labels a person");
    assert(/Housekeeping afternoon staffing \(missing\)/.test(await page.getByTestId("peak-gaps").innerText()), "missing reading not shown");
    assert(/Awaiting Duty Manager review/.test(await aggregate.innerText()), "portfolio does not show the response status");
    await noHorizontalScroll(page, viewport.width);

    // Challenge 3: the wrong approval role is refused and nothing moves.
    await choose("Wrong approval role");
    assert(await approval.getByLabel("Act as").inputValue() === "fo-supervisor", "wrong-role path does not start as the supervisor");
    await approval.getByRole("button", { name: "Approve the intervention" }).click();
    assert(/Only the Duty Manager · Harbour Hotel may/.test(await message()), "a supervisor approved the intervention");
    assert(await page.getByTestId("peak-message").getAttribute("role") === "alert", "refusal is not announced");
    assert(/Awaiting/.test(await stage("approval")) && /needs approval/.test(await stage("execution")), "state changed after a refused approval");

    // Challenge 1: missing and conflicting signals; request information before deciding.
    await choose("Missing or conflicting signals");
    assert(await peak.locator('[data-signal="roster"]').getAttribute("data-status") === "conflicting", "roster conflict not shown");
    assert(await peak.locator('[data-signal="breaks"]').getAttribute("data-status") === "missing", "missing break log not shown");
    assert(await page.getByTestId("peak-confidence").innerText() === "Reduced", "confidence not reduced");
    await approval.getByRole("button", { name: "Approve the intervention" }).click();
    assert(/Request more information first/.test(await message()), "approved on conflicting signals without a reason");
    await reason().fill("Confirm who is on the desk and the break log");
    await approval.getByRole("button", { name: "Request more information" }).click();
    assert(/More information requested/.test(await stage("approval")), "request not recorded");
    assert(await approval.getByRole("button", { name: "Approve the intervention" }).count() === 0, "decision possible while waiting for information");
    assert(/Information requested by the Duty Manager/.test(await aggregate.innerText()), "portfolio does not show the outstanding request");
    await approval.getByRole("button", { name: "Receive the requested confirmation (simulated)" }).click();
    assert(await page.getByTestId("peak-confidence").innerText() === "Normal", "confirmation did not restore confidence");
    await approval.getByRole("button", { name: "Approve the intervention" }).click();
    assert(/Approved by Duty Manager · Harbour Hotel/.test(await stage("approval")), "not approved after confirmation");

    // Challenge 4: continue monitoring with a reason and review time, then decline; nothing executes.
    await choose("Intervention declined or deferred");
    await reason().fill("ok");
    await approval.getByRole("button", { name: "Continue monitoring" }).click();
    assert(/reason of at least 10 characters/.test(await message()), "monitoring accepted without a reason");
    await reason().fill("Two agents return from lunch at 13:45");
    await approval.getByLabel("Review again in (if monitoring)").selectOption("30");
    await approval.getByRole("button", { name: "Continue monitoring" }).click();
    assert(/reviews again in 30 minutes/.test(await approval.innerText()), "review time not shown");
    assert(await peak.getByRole("button", { name: /^Record as / }).count() === 0, "actions executable while monitoring");
    await approval.getByRole("button", { name: "Review time reached (simulated)" }).click();
    await reason().fill("Agency cover already arranged by the General Manager");
    await approval.getByRole("button", { name: "Decline" }).click();
    assert(/Declined with a reason/.test(await stage("approval")) && /Nothing executed/.test(await stage("execution")), "decline not separated from execution");
    assert(/Declined with a reason/.test(await aggregate.innerText()), "portfolio does not show the declined status");
    assert(await peak.getByRole("button", { name: "Record follow-up measurements (synthetic)" }).isDisabled(), "outcome measurable after a decline");

    // Challenge 2: not enough people; escalation, a two-role portfolio decision, then execution and outcome.
    await choose("Not enough people to prepare");
    await approval.getByRole("button", { name: "Approve the intervention" }).click();
    assert(/Gap: 1 person/.test(await page.getByTestId("peak-capacity").innerText()), "capacity gap not shown");
    assert(await peak.locator('[data-action="escalate"]').count() === 1, "no escalation action");
    await recordAll();
    assert(await peak.locator('[data-action="breaks"]').getAttribute("data-state") === "waiting", "break cover executed without enough people");
    assert(/Cover in place: the lent team member.s arrival recorded/.test(await peak.locator('[data-action="breaks"]').innerText()), "break cover does not show its dependency");
    assert(/Portfolio decision on cross-property cover/.test(await aggregate.innerText()), "portfolio decision not outstanding");
    await peak.getByRole("link", { name: /Go to the portfolio decision/ }).click();
    const portfolio = page.locator("#portfolio-coordination");
    await page.waitForFunction(() => { const r = document.querySelector("#portfolio-coordination")?.getBoundingClientRect(); return !!r && r.top < innerHeight && r.bottom > 0; }, null, { timeout: 5000 });
    assert(/Lend one front-office team member/.test(await page.getByTestId("portfolio-response").innerText()), "cover exception not selected");
    await page.locator("#pc-actor").selectOption("dm-harbour");
    await portfolio.getByRole("button", { name: "Approve as selected role" }).click();
    assert(/has no authority here/.test(await page.getByTestId("portfolio-message").innerText()), "local Duty Manager approved cross-property cover");
    for (const actor of ["regional-ops", "gm-coastal"]) {
      await page.locator("#pc-actor").selectOption(actor);
      await portfolio.getByRole("button", { name: "Approve as selected role" }).click();
    }
    assert(/All required approvals are recorded/.test(await page.getByTestId("portfolio-message").innerText()), "cover not approved by both roles");
    assert(/authorised, not carried out/.test(await page.getByTestId("portfolio-message").innerText()), "portfolio approval presented as execution");
    // Approvals authorise the loan; they do not put cover in place.
    const breaksState = () => peak.locator('[data-action="breaks"]').getAttribute("data-state");
    const capacityText = () => page.getByTestId("peak-capacity").innerText();
    const recordAction = id => peak.locator(`[data-action="${id}"]`).getByRole("button", { name: /^Record as / }).click();
    assert(/Gap: 1 person, still open/.test(await capacityText()), "approvals alone closed the cover gap");
    assert(await breaksState() === "waiting", "approvals alone unlocked break cover");
    assert(/Cross-property cover authorised but not yet in place/.test(await aggregate.innerText()), "portfolio does not show cover pending");
    assert(/Move the reservations agent to the front desk/.test(await peak.locator('[data-action="redistribute"]').innerText()), "redistribution plan does not match the local staff");
    await recordAction("release");
    assert(/still open/.test(await capacityText()) && await breaksState() === "waiting", "release alone unlocked break cover");
    await recordAction("arrival");
    assert(/Gap closed: the lent team member's arrival is recorded/.test(await capacityText()), "recorded arrival did not close the gap");
    assert(await breaksState() === "ready", "recorded cover did not unlock break cover");
    await approveDraft();
    await recordAll();
    assert(/8 of 8 actions recorded/.test(await page.getByTestId("peak-follow-through").innerText()), "follow-through incomplete");
    assert(/Not measured yet/.test(await stage("outcome")), "outcome reported before measurement");
    await peak.getByRole("button", { name: "Record follow-up measurements (synthetic)" }).click();
    assert(/The case can close/.test(await page.getByTestId("peak-closure").innerText()), "complete outcome cannot close");
    const learning = page.getByTestId("peak-learning");
    await learning.getByLabel("Act as").selectOption("duty-manager");
    await learning.getByRole("button", { name: "Approve the proposal" }).click();
    assert(/Only the General Manager · Harbour Hotel may/.test(await page.getByTestId("peak-learning-message").innerText()), "wrong role approved the learning");
    assert(/Proposed · not applied/.test(await page.getByTestId("peak-learning-status").innerText()), "learning applied before approval");
    await learning.getByLabel("Act as").selectOption("general-manager");
    await learning.getByRole("button", { name: "Approve the proposal" }).click();
    assert(/Approved by General Manager · Harbour Hotel/.test(await page.getByTestId("peak-learning-status").innerText()), "learning not approved");
    const portfolioView = await aggregate.innerText();
    assert(/Outstanding decisions\s*None/.test(portfolioView), `decisions still outstanding: ${portfolioView}`);
    assert(!/People & Culture|support contact|who uses/i.test(portfolioView), "personal support details reached the portfolio");
    assert(/never who uses it/.test(await peak.getByTestId("peak-restricted").innerText()), "support not marked restricted");
    await noHorizontalScroll(page, viewport.width);

    // Challenge 5: a missing follow-up measurement stays unconfirmed and blocks closure.
    await choose("Missing follow-up evidence");
    await approval.getByRole("button", { name: "Approve the intervention" }).click();
    await approveDraft();
    await recordAll();
    await peak.getByRole("button", { name: "Record follow-up measurements (synthetic)" }).click();
    assert(/Not recorded/.test(await peak.locator('[data-measure="breaks"]').innerText()) && /Unconfirmed/.test(await peak.locator('[data-measure="breaks"]').innerText()), "missing measurement not unconfirmed");
    assert(/cannot close/.test(await page.getByTestId("peak-closure").innerText()) && /Partly confirmed/.test(await stage("outcome")), "case closable with missing evidence");
    await learning.getByRole("button", { name: "Approve the proposal" }).click();
    assert(/reason of at least 10 characters/.test(await page.getByTestId("peak-learning-message").innerText()), "learning approved on an incomplete basis without a reason");
    await peak.getByRole("button", { name: "Record the missing evidence late (simulated)" }).click();
    assert(/The case can close/.test(await page.getByTestId("peak-closure").innerText()) && /recorded late/.test(await peak.locator('[data-measure="breaks"]').innerText()), "late evidence not labelled");
    await noHorizontalScroll(page, viewport.width);

    // Forward to the pilot scope; nothing left the browser.
    await peak.getByRole("link", { name: /what the pilot would prove/ }).click();
    await page.waitForURL(url => url.pathname === "/partner-room/pilot-model" && url.hash === "#pilot-scope");
    const origin = new URL(page.url()).host;
    const unexpected = requests.filter(r => r.method !== "GET" || r.body || !(new URL(r.url).host === origin || /^fonts\.(googleapis|gstatic)\.com$/.test(new URL(r.url).host) || r.url.startsWith("blob:") || r.url.startsWith("data:")));
    assert(unexpected.length === 0, `unexpected requests: ${unexpected.slice(0, 3).map(r => `${r.method} ${r.url}`).join(", ")}`);
  });
}

// The retained guest-disruption scenario is independent of the reviewed staffing
// case. UI_WIDTH repeats these acceptance paths at each CI/requested viewport.
for (const choice of ["network", "local"]) {
  await check(`Stage 3 retained Portfolio disruption ${choice}, gates and reset isolation`, { width: 1440, height: 900 }, async (page, errors) => {
    await open(page, "/partner-room/product-proof/stage-3-operating-layer");
    const peak = page.locator("#peak-pressure");
    const pd = page.locator("#portfolio-disruption");
    const switchPeak = () => page.getByTestId("scenario-peak-pressure").click();
    const switchPortfolio = () => page.getByTestId("scenario-portfolio-disruption").click();
    assert(await page.getByTestId("scenario-peak-pressure").getAttribute("aria-pressed") === "true", "peak pressure is not the default");
    await peak.getByTestId("peak-approval").getByLabel("Act as").selectOption("duty-manager");
    await peak.getByRole("button", { name: "Approve the intervention" }).click();
    await switchPortfolio();
    assert(/24 bookings \/ 48 guests/.test(await pd.innerText()), "guest-disruption scope missing");
    await page.getByTestId("pd-next").click();
    assert(await page.getByTestId("pd-next").isDisabled(), "choose gate bypassed");
    await page.getByTestId(`pd-choice-${choice}`).focus();
    await page.keyboard.press("Enter");
    assert(await page.getByTestId(`pd-choice-${choice}`).getAttribute("aria-pressed") === "true", "keyboard choice did not select");
    assert(await page.getByTestId(`pd-choice-${choice}`).evaluate(el => el === document.activeElement), "choice render lost keyboard focus");
    assert((await pd.innerText()).includes(choice === "network" ? "A$950" : "A$360"), "initial cost missing");
    await page.getByTestId("pd-next").click();
    await page.getByTestId("pd-confirm-harbour").check();
    await switchPeak();
    assert(/Approved/.test(await peak.locator('[data-stage="approval"]').innerText()), "portfolio switch reset peak approval");
    await switchPortfolio();
    assert(await page.getByTestId("pd-confirm-harbour").isChecked(), "switch reset portfolio confirmation");
    await page.getByTestId("pd-reset").click();
    await switchPeak();
    assert(/Approved/.test(await peak.locator('[data-stage="approval"]').innerText()), "portfolio reset reset peak approval");
    await switchPortfolio();
    await page.getByTestId("pd-next").click();
    await page.getByTestId(`pd-choice-${choice}`).click();
    await page.getByTestId("pd-next").click();
    const owners = choice === "network" ? ["harbour", "city", "park", "transport", "guests"] : ["harbour", "housekeeping", "guests"];
    for (const id of owners.filter(id => id !== "guests")) {
      assert(await page.getByTestId("pd-next").isDisabled(), "missing initial owner failed to hold");
      await page.getByTestId(`pd-confirm-${id}`).check();
    }
    assert(await page.getByTestId("pd-next").isDisabled(), "missing guest agreement failed to hold");
    await page.getByTestId("pd-confirm-guests").focus();
    await page.keyboard.press("Space");
    await page.getByTestId("pd-next").click();
    assert(/withdraws 4 rooms/.test(await pd.innerText()) && /audit only/.test(await pd.innerText()), "capacity revision/audit missing");
    assert(await page.getByTestId("pd-next").isDisabled(), "old approvals carried into revision");
    await page.getByTestId(`pd-replan-${choice}`).click();
    await page.getByTestId("pd-reconfirm-harbour").check();
    await page.getByTestId(`pd-replan-${choice === "network" ? "local" : "network"}`).click();
    await page.getByTestId(`pd-replan-${choice}`).click();
    assert(!(await page.getByTestId("pd-reconfirm-harbour").isChecked()), "replan did not withdraw approval");
    for (const id of owners) {
      assert(await page.getByTestId("pd-next").isDisabled(), "missing renewed confirmation failed to hold");
      await page.getByTestId(`pd-reconfirm-${id}`).check();
    }
    await page.getByTestId("pd-next").click();
    const receipts = await pd.innerText();
    assert(choice === "network" ? /10 checked in after 45 min; 20 guests transported/.test(receipts) && /13 checked in after 90 min/.test(receipts) : /23 checked in after 90 min/.test(receipts), "wrong branch receipts");
    assert(/OPEN: Alex/.test(receipts) && /Unreviewed/.test(receipts), "missing unresolved/unreviewed receipt");
    await switchPeak();
    await peak.getByRole("group", { name: "Choose a path through the scenario" }).getByRole("button", { name: /Standard run/ }).click();
    await switchPortfolio();
    assert(/Synthetic receipts for the revised plan/.test(await pd.innerText()), "peak reset reset portfolio");
    assert(await page.getByTestId("pd-next").isDisabled(), "unreviewed receipts accepted");
    await page.getByTestId("pd-receipt-review").check();
    assert(await page.getByTestId("pd-next").isDisabled(), "missing follow-up owner accepted");
    await page.getByTestId("pd-followup").check();
    await page.getByTestId("pd-next").click();
    const result = await pd.innerText();
    assert(/23 of 24/.test(result) && /46 confirmed guests/.test(result), "unconfirmed outcome counted as success");
    assert(result.includes(choice === "network" ? "3240 vs 4140, 900 fewer" : "4140 vs 4140, 0 fewer"), "wrong paired waiting result");
    assert(/no cash ROI/.test(result) && /OPEN: one booking remains with Alex/.test(result), "ROI or unresolved boundary missing");
    assert(/Trial approval pending/.test(result), "trial automatically approved");
    await page.getByTestId("pd-trial-group").check();
    assert(/Limited next-disruption trial authorised/.test(await pd.innerText()), "limited learning decision not reflected");
    await page.getByRole("button", { name: "Explore today · Working Proof", exact: true }).click();
    const today = page.getByRole("region", { name: "Explore today" });
    assert(await today.locator('a[href="/partner-room/guest-demo"]').count() === 1, "guest link changed");
    assert(await today.getByRole("link", { name: "Open the current Working Proof →", exact: true }).count() === 1, "working proof link changed");
    await page.getByRole("button", { name: "Experience Stage 3 · Planned simulation", exact: true }).click();
    assert(/23 of 24/.test(await pd.innerText()), "today toggle lost outcome continuity");
    await noHorizontalScroll(page, forcedWidth || 1440);
    assert(errors.length === 0, `browser errors: ${errors.join("; ")}`);
  });
}

await browser.close();
server?.kill();

for (const result of results) console.log(`${result.ok ? "PASS" : "FAIL"}  ${result.name}${result.ok ? "" : `\n      ${result.detail}`}`);
const failed = results.filter(result => !result.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
