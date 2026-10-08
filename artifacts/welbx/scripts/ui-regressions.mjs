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

await browser.close();
server?.kill();

for (const result of results) console.log(`${result.ok ? "PASS" : "FAIL"}  ${result.name}${result.ok ? "" : `\n      ${result.detail}`}`);
const failed = results.filter(result => !result.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
