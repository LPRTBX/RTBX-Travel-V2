// Built-app fixture with an ephemeral credential. No managed access configuration is changed.
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { createTravelServer } from "../server/app.mjs";
import { createAccess } from "../server/access.mjs";

const code = randomBytes(32).toString("hex");
const server = createTravelServer({ access: createAccess({ getCode: () => code }) });
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = `http://localhost:${server.address().port}`;
const path = "/partner-room/product-proof/stage-3-operating-layer?scenario=wellbeing";
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const outputs = new URL("../../../generated-artifacts/", import.meta.url);
await mkdir(outputs, { recursive: true });
try {
  for (const width of [390, 820, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 950 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (/violates.*Content Security Policy/i.test(m.text())) errors.push(m.text()); });
    await page.goto(base);
    const entry = page.getByRole("link", { name: "Coordinate wellbeing support", exact: false });
    assert.equal(await entry.count(), 1);
    await entry.focus();
    await page.keyboard.press("Enter");
    await page.waitForURL("**/partner-access?**");
    assert.equal(new URL(page.url()).searchParams.get("returnTo"), path);
    await page.getByLabel("Access code", { exact: true }).fill(code);
    await page.getByRole("button", { name: "Enter Partner Room", exact: true }).click();
    await page.waitForURL(url => url.pathname + url.search === path);
    const panel = page.getByTestId("panel-wellbeing-support");
    await panel.waitFor({ state: "visible" });
    const role = async name => {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await panel.getByTestId(`button-wellbeing-role-${id}`).focus();
      await page.keyboard.press("Enter");
      assert.equal(await panel.getByTestId(`button-wellbeing-role-${id}`).getAttribute("aria-pressed"), "true");
    };
    const action = async id => {
      const button = panel.getByTestId(`button-wellbeing-${id}`);
      assert(await button.isEnabled(), `${width}: ${id} unexpectedly disabled`);
      await button.focus();
      await page.keyboard.press("Enter");
    };
    const disabled = async id => assert(await panel.getByTestId(`button-wellbeing-${id}`).isDisabled(), `${id} should be held`);
    const summary = () => panel.getByTestId("list-wellbeing-summary").innerText();
    const reset = async () => { await panel.getByTestId("button-wellbeing-reset").click(); };
    const checks = async () => {
      await role("Guest"); await action("consent");
      await role("Reception"); await action("quiet");
      await role("Housekeeping lead"); await action("capacity");
      await role("Duty Manager"); await action("review");
    };
    const release = async () => { await role("Duty Manager"); await action("approve"); await action("release"); };
    const delivery = async (owner = "Guest Services") => {
      await role("Reception"); await action("update");
      await role("Housekeeping lead"); await action("reallocate");
      await role(owner); await action("accept"); await action("arrive"); await action("deliver");
    };
    // Missing checks, hold and decline cannot release.
    await role("Duty Manager");
    await disabled("approve"); await disabled("release");
    await action("hold"); await disabled("release"); await action("resume");
    await action("decline"); await disabled("release"); await action("resume");
    await role("Guest Services");
    assert(!(await panel.getByTestId("list-wellbeing-facts").innerText()).includes("quieter waiting"));
    await disabled("accept"); await disabled("deliver");
    await checks();
    await action("approve");
    assert.equal(await panel.locator(".wbs-msg.Draft").count(), 3);
    await role("Guest");
    assert.equal(await panel.locator(".wbs-msg").count(), 0, "guest saw unreleased drafts");
    await role("Duty Manager"); await action("release");
    assert.equal(await panel.locator(".wbs-msg.Released").count(), 3);
    assert((await summary()).includes("not accepted"));
    await role("Guest Services"); await disabled("arrive"); await disabled("deliver");
    await delivery();
    await role("Guest");
    assert((await summary()).includes("Pending"));
    await action("helped");
    await role("Housekeeping lead");
    const hkBefore = await panel.innerText();
    assert.equal(await panel.locator(".wbs-msg").count(), 1);
    for (const privateCopy of ["quieter waiting", "practical assistance", "Guest reported support helped"])
      assert(!hkBefore.includes(privateCopy), `Housekeeping leaked ${privateCopy}`);
    await role("Guest"); await action("needs-support");
    await role("Housekeeping lead");
    assert.equal(await panel.innerText(), hkBefore, "private feedback changed shared history/counts/summary");
    await role("Guest"); await action("pending");
    await role("Duty Manager");
    await disabled("followup");
    await action("overdue");
    assert((await summary()).includes("Overdue"));
    await action("followup");
    assert((await summary()).includes("Guest feedback: Pending"));
    assert((await summary()).includes("Room 304 repair: open"));
    if (width === 1440) {
      await panel.locator(".wbs-comms").scrollIntoViewIfNeeded();
      await page.screenshot({ path: new URL("wellbeing-communications-desktop.jpg", outputs).pathname, type: "jpeg", quality: 80 });
    }
    // Reset isolation: retain portfolio selection while wellbeing reset clears only wellbeing.
    await page.getByTestId("scenario-portfolio-disruption").click();
    await page.getByTestId("pd-next").click();
    await page.getByTestId("pd-choice-network").click();
    await page.getByTestId("scenario-wellbeing-support").click();
    assert((await summary()).includes("delivered with receipt"), "scenario switching lost progress");
    await reset();
    await page.getByTestId("scenario-portfolio-disruption").click();
    assert.equal(await page.getByTestId("pd-choice-network").getAttribute("aria-pressed"), "true", "wellbeing reset changed portfolio");
    await page.getByTestId("scenario-peak-pressure").click();
    assert(await page.locator("#peak-pressure").isVisible(), "existing pressure scenario missing");
    await page.getByTestId("scenario-wellbeing-support").click();
    await role("Duty Manager"); await disabled("approve");
    // Unavailable recipient and material change: renew every check and owner.
    await checks(); await release();
    await role("Guest Services"); await action("unavailable"); await disabled("accept");
    await role("Duty Manager");
    assert.equal((await panel.getByTestId("status-wellbeing").textContent()).trim(), "Invalidated");
    await action("revise"); await disabled("approve"); await disabled("release");
    await role("Guest");
    assert(!(await summary()).includes("Agreed support:"));
    assert((await panel.innerText()).includes("Earlier plan — not a current instruction."));
    await checks(); await release();
    await role("Guest Services");
    assert.equal(await panel.getByTestId("button-wellbeing-accept").count(), 0, "previous owner retained replacement actions");
    await delivery("Duty Manager");
    await role("Duty Manager");
    assert((await summary()).includes("delivered with receipt"));
    assert.equal(await panel.locator(".wbs-msg").count(), 6, "prior record history lost");
    await reset();
    await role("Guest");
    assert.equal(await panel.locator(".wbs-msg").count(), 0);
    assert(await panel.getByTestId("button-wellbeing-consent").isEnabled());
    await panel.locator(".wbs-hero").scrollIntoViewIfNeeded();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}: overflow`);
    if (width !== 820)
      await page.screenshot({ path: new URL(`wellbeing-${width === 390 ? "phone" : "desktop"}.jpg`, outputs).pathname, type: "jpeg", quality: 80 });
    assert.deepEqual(errors, [], `browser errors: ${errors.join("; ")}`);
    console.log(`PASS ${width}px: keyboard, consent/checks, hold/decline, communications, delivery/feedback, privacy, unavailable/replan, overdue, reset isolation`);
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
