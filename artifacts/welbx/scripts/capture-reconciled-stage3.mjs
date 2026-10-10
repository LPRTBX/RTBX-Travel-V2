#!/usr/bin/env node
/**
 * Capture the combined selector and each independently selectable simulation.
 * Use STAGE3_URL for the actual managed preview. Generated images are excluded
 * from Git/deployment; this script does not execute decisions or publish.
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const base = process.env.STAGE3_URL;
if (!base) throw new Error("Set STAGE3_URL to the running preview origin.");
const output = join(dirname(fileURLToPath(import.meta.url)), "../../../generated-artifacts/reconciliation");
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
try {
  for (const [width, height] of [[390, 844], [820, 1180], [1440, 1100]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(new URL("/partner-room/product-proof/stage-3-operating-layer", base).href, { waitUntil: "networkidle" });
    const selectors = page.getByRole("group", { name: "Choose a Stage 3 scenario", exact: true });
    for (const scenario of ["peak-pressure", "portfolio-disruption"]) {
      await page.getByTestId(`scenario-${scenario}`).click();
      await selectors.scrollIntoViewIfNeeded();
      await page.screenshot({ path: join(output, `${scenario}-${width}.jpg`), type: "jpeg", quality: 85 });
      console.log(`CAPTURED ${scenario} at ${width}px`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
