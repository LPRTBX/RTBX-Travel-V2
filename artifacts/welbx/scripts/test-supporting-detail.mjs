// Regression against the real managed preview, using no partner credentials.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.argv[2];
assert(base, "Usage: node scripts/test-supporting-detail.mjs <preview URL>");
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
try {
  for (const width of [320, 390, 820, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base);
    const section = page.locator("#supporting-detail");
    const disclosures = section.locator(".support-disclosure");
    assert.equal(await disclosures.count(), 3);
    // Measure computed colours against the actual ancestor backgrounds, including
    // the nested light, mist and navy cards. AA normal text: at least 4.5:1.
    async function contrast(locator, pseudo = null, minimum = 4.5, property = "color") {
      const readings = await locator.evaluateAll((elements, { pseudo, property }) => {
        const rgb = value => value.match(/[\d.]+/g).map(Number);
        const luminance = channels => channels.slice(0, 3).map(v => {
          v /= 255;
          return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
        }).reduce((total, v, i) => total + v * [.2126, .7152, .0722][i], 0);
        return elements.map(el => {
          const style = getComputedStyle(el, pseudo);
          let background = el;
          while (background && rgb(getComputedStyle(background).backgroundColor)[3] === 0) background = background.parentElement;
          const fg = luminance(rgb(style[property]));
          const bg = luminance(rgb(getComputedStyle(background).backgroundColor));
          return { text: el.textContent.trim().slice(0, 75), ratio: (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05) };
        });
      }, { pseudo, property });
      for (const reading of readings) assert(reading.ratio >= minimum, `${width}px ${pseudo || "text"} ${reading.text}: ${reading.ratio.toFixed(2)}:1`);
      return Math.min(...readings.map(reading => reading.ratio));
    }
    let lowest = Infinity;
    for (let i = 0; i < 3; i++) {
      const details = disclosures.nth(i);
      const summary = details.locator(":scope > summary");
      lowest = Math.min(lowest, await contrast(summary), await contrast(summary, "::after"));
      await summary.hover();
      lowest = Math.min(lowest, await contrast(summary), await contrast(summary, "::after"));
      await page.mouse.move(0, 0);
      await summary.focus();
      assert(await summary.evaluate(el => el.matches(":focus-visible") && getComputedStyle(el).outlineStyle !== "none"), "missing keyboard focus");
      await contrast(summary);
      await contrast(summary, null, 3, "outlineColor");
      await summary.evaluate(el => {
        const style = getComputedStyle(el);
        if (style.outlineWidth !== "3px") throw new Error("visible focus ring changed");
      });
      await page.keyboard.press("Enter");
      assert(await details.evaluate(el => el.open), "Enter did not expand disclosure");
      assert.equal(await summary.evaluate(el => getComputedStyle(el, "::after").content), '"−"');
      lowest = Math.min(lowest, await contrast(summary), await contrast(summary, "::after"));
      lowest = Math.min(lowest, await contrast(details.locator("h3,p,li,strong,span,dt,dd,a")));
      for (const link of await details.locator("a").all()) {
        await link.hover();
        await contrast(link);
        await link.focus();
        assert(await link.evaluate(el => getComputedStyle(el).outlineStyle !== "none"));
        await contrast(link);
        assert.equal(await link.getAttribute("href"), "/partner-access");
      }
      await summary.focus();
      await page.keyboard.press("Space");
      assert(!(await details.evaluate(el => el.open)), "Space did not collapse disclosure");
      assert.equal(await summary.evaluate(el => getComputedStyle(el, "::after").content), '"+"');
    }
    // Keep all three open to check wrapping and overflow together.
    await disclosures.evaluateAll(elements => elements.forEach(el => { el.open = true; }));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px: horizontal overflow`);
    assert.equal(errors.length, 0, errors.join("\n"));
    console.log(`PASS ${width}px: 3 disclosures, default/hover/focus/open contrast (minimum ${lowest.toFixed(2)}:1), Enter/Space, expanded copy/link and no overflow`);
    await page.close();
  }
} finally {
  await browser.close();
}
