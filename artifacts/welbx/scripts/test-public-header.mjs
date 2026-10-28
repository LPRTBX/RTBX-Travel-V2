#!/usr/bin/env node
// Read-only browser checks against the managed preview; no partner credential needed.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.argv[2];
if (!base) throw new Error("Usage: node scripts/test-public-header.mjs <preview URL>");
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
});
try {
  for (const width of [320, 390, 820, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base);
    const header = page.locator("#site-header");
    assert.equal(await page.locator(".topbar").count(), 0);
    assert.equal(await header.getByRole("link", { includeHidden: true }).count(), 6);
    assert.equal(await header.locator(".hdr-demo").count(), 1);
    assert.equal(await header.locator(".hdr-demo").getAttribute("href"), "/public-demo#sample-demo");
    assert(await header.locator(".brand .sub").isVisible());
    const geometry = await header.evaluate(el => {
      const brand = el.querySelector(".brand").getBoundingClientRect();
      const cta = el.querySelector(".hdr-cta").getBoundingClientRect();
      const nav = el.querySelector("nav").getBoundingClientRect();
      return { left: brand.left, right: brand.right, top: brand.top, bottom: brand.bottom,
        ctaTop: cta.top, ctaBottom: cta.bottom, navTop: nav.top, navBottom: nav.bottom,
        overflow: document.documentElement.scrollWidth > innerWidth };
    });
    assert(!geometry.overflow, `${width}: horizontal overflow`);
    assert(geometry.left >= 16 && geometry.right < width - 16, `${width}: brand margins`);
    assert(geometry.ctaTop < geometry.bottom && geometry.ctaBottom > geometry.top, `${width}: controls wrapped`);
    const toggle = page.getByRole("button", { name: "Menu", exact: true });
    if (width <= 960) {
      assert(!(await page.locator("#site-nav").isVisible()));
      await toggle.focus();
      await page.keyboard.press("Enter");
      assert.equal(await toggle.getAttribute("aria-expanded"), "true");
      assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "How it works");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "In action");
      await page.keyboard.press("Escape");
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      assert(await toggle.evaluate(el => el === document.activeElement));
      await page.keyboard.press("Enter");
    } else {
      assert(geometry.navTop < geometry.bottom && geometry.navBottom > geometry.top, `${width}: navigation wrapped`);
    }
    for (const [label, hash] of [
      ["How it works", "#existing-systems"],
      ["In action", "#coordinated-response"],
      ["Outcomes", "#outcomes"],
    ]) {
      if (width <= 960 && !(await page.locator("#site-nav").isVisible())) await toggle.click();
      await header.getByRole("link", { name: label, exact: true }).click();
      assert.equal(new URL(page.url()).hash, hash);
      assert.equal(await page.locator(hash).count(), 1);
    }
    assert.equal(await page.locator("footer").getByRole("link", { name: /Back to JALDO/ }).getAttribute("href"), "https://wearejaldo.com");
    assert.equal(await page.locator("#contact").count(), 1);
    assert.equal(await page.locator("#ai-in-the-work").count(), 1);
    assert.equal(await page.locator("#principles").count(), 1);
    if (width <= 960) await toggle.click();
    await header.getByRole("link", { name: "Partner Room", exact: true }).click();
    await page.waitForURL("**/partner-access");
    assert(await page.getByLabel("Access code", { exact: true }).isVisible());
    await page.goto(base);
    await page.getByRole("link", { name: "Explore the demo", exact: true }).click();
    await page.waitForURL("**/public-demo#sample-demo");
    assert(await page.locator("#demo-app").isVisible());
    assert(await page.getByText("Interactive fictional demonstration — no live actions", { exact: true }).isVisible());
    assert.equal(errors.length, 0, errors.join("\n"));
    console.log(`PASS ${width}px: layout, logo margins, navigation, demo, gate${width <= 960 ? ", keyboard / Escape" : ""}`);
    await page.close();
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const page = await context.newPage();
  await page.goto(base);
  assert(await page.getByRole("link", { name: "How it works", exact: true }).isVisible());
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)));
  console.log("PASS 320px no-JavaScript navigation fallback");
  await context.close();
} finally {
  await browser.close();
}
