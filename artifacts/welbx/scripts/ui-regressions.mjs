#!/usr/bin/env node
/**
 * ui-regressions.mjs
 * Browser checks for layout and interaction defects found in the UX audit that
 * unit tests cannot see. Starts the Vite dev server, drives Chromium with
 * Playwright and exits non-zero if any check fails.
 *
 * Usage: node scripts/ui-regressions.mjs   (set UI_BASE_URL to reuse a running server)
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

const browser = await chromium.launch();
const results = [];

async function check(name, viewport, fn) {
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

// #7 Stage 3: the final step leads somewhere.
await check("Stage 3 final step offers a forward path", { width: 1440, height: 900 }, async page => {
  await open(page, "/partner-room/product-proof/stage-3-operating-layer");
  for (let step = 0; step < 5; step += 1) {
    if (step === 3) await page.locator(".s3-decision-btn").first().click();
    await page.getByRole("button", { name: /^Continue$/i }).click();
  }
  const next = page.getByRole("link", { name: /pilot would prove/ });
  assert(await next.isVisible(), "no forward CTA on the final step");
  assert((await next.getAttribute("href")).endsWith("/partner-room/pilot-model"), "CTA does not open the pilot model");
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

await browser.close();
server?.kill();

for (const result of results) console.log(`${result.ok ? "PASS" : "FAIL"}  ${result.name}${result.ok ? "" : `\n      ${result.detail}`}`);
const failed = results.filter(result => !result.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
