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
    assert.equal(await header.getByRole("link", { includeHidden: true }).count(), 7);
    assert.equal(await header.locator(".hdr-demo").count(), 1);
    assert.equal(await header.locator(".hdr-demo").getAttribute("href"), "/see-it-work");
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
    if (width <= 1100) {
      assert(!(await page.locator("#site-nav").isVisible()));
      await toggle.focus();
      await page.keyboard.press("Enter");
      assert.equal(await toggle.getAttribute("aria-expanded"), "true");
      assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "How it works");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "See it work");
      await page.keyboard.press("Escape");
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      assert(await toggle.evaluate(el => el === document.activeElement));
      await page.keyboard.press("Enter");
    } else {
      assert(geometry.navTop < geometry.bottom && geometry.navBottom > geometry.top, `${width}: navigation wrapped`);
    }
    for (const [label, destination] of [
      ["How it works", "#existing-systems"],
      ["See it work", "/see-it-work"],
      ["Guest experience samples", "#travel-guest-app"],
      ["Outcomes", "#outcomes"],
    ]) {
      if (width <= 1100 && !(await page.locator("#site-nav").isVisible())) await toggle.click();
      await header.getByRole("link", { name: label, exact: true }).click();
      if (destination.startsWith("#")) {
        assert.equal(new URL(page.url()).hash, destination);
        assert.equal(await page.locator(destination).count(), 1);
      } else {
        await page.waitForURL(`${base}${destination}`);
        assert(await page.getByRole("heading", { name: /A guest needs help/ }).isVisible());
        await page.goBack();
      }
    }
    assert.equal(await page.locator("footer").getByRole("link", { name: /Back to JALDO/ }).getAttribute("href"), "https://wearejaldo.com");
    assert.equal(await page.locator("#contact").count(), 1);
    assert.equal(await page.locator("#ai-in-the-work").count(), 1);
    assert.equal(await page.locator("#principles").count(), 1);
    if (width <= 1100) await toggle.click();
    await header.getByRole("link", { name: "Partner Room", exact: true }).click();
    await page.waitForURL("**/partner-access");
    assert(await page.getByLabel("Access code", { exact: true }).isVisible());
    await page.goto(base);
    await page.getByRole("link", { name: "See the hotel respond", exact: true }).click();
    await page.waitForURL("**/see-it-work");
    await page.locator('a[href="/public-demo#sample-demo"]').click();
    await page.waitForURL("**/public-demo#sample-demo");
    assert(await page.locator("#demo-app").isVisible());
    await page.goto(`${base}/public-demo#guided-replay`);
    assert(await page.locator("#guided-app").isVisible());
    assert(await page.getByText("Scripted fictional replay · No decisions or actions are recorded", { exact: true }).isVisible());
    const replay = page.locator("#guided-app");
    assert.equal(await replay.getAttribute("data-step"), "0");
    await page.locator("#guided-next").focus();
    assert(await page.locator("#guided-next").evaluate(el => getComputedStyle(el).outlineStyle !== "none"), `${width}: replay action lacks visible keyboard focus`);
    await page.keyboard.press("Enter");
    assert.equal(await replay.getAttribute("data-step"), "1");
    await replay.getByRole("button", { name: "Housekeeping", exact: true }).focus();
    await page.keyboard.press("Enter");
    assert.equal(await replay.getAttribute("data-step"), "1", "role switch changed replay progress");
    assert.equal(await replay.getAttribute("data-role"), "housekeeping");
    for (let step = 1; step < 5; step++) {
      await page.locator("#guided-next").focus();
      await page.keyboard.press("Enter");
    }
    assert.equal(await replay.getAttribute("data-step"), "5");
    assert(/unresolved in this replay/i.test(await page.locator("#guided-fact").innerText()));
    assert(/no resolution is claimed/i.test(await page.locator("#guided-outcome").innerText()));
    await page.locator("#guided-reset").click();
    assert.equal(await replay.getAttribute("data-step"), "0");
    await page.goto(`${base}/public-demo#sample-demo`);
    assert(await page.locator("#sample-demo").evaluate(el => el.open), "legacy detailed-demo anchor did not open");
    assert(await page.locator("#demo-app").isVisible());
    const contact = page.locator("#contact");
    assert((await contact.locator('a[href^="mailto:"]').evaluateAll(links => links.map(link => link.href))).every(href => href.startsWith("mailto:lance@wearejaldo.com")), "public contact links do not use the confirmed JALDO address");
    assert.equal(errors.length, 0, errors.join("\n"));
    console.log(`PASS ${width}px: layout, logo margins, navigation, demo, gate${width <= 1100 ? ", keyboard / Escape" : ""}`);
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
