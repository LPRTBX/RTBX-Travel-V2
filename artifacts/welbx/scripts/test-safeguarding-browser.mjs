import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2]?.replace(/\/$/, "");
assert(base && /^https?:\/\//.test(base), "Provide the managed preview URL; no credentials are used.");
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
const output = new URL("../../../generated-artifacts/", import.meta.url);
await mkdir(output, { recursive: true });
try {
  for (const width of [390, 820, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 950 }, reducedMotion: "reduce" });
    const errors = [], writes = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("request", r => { if (r.method() !== "GET") writes.push(r.method()); });
    page.on("console", m => { if (/violates.*Content Security Policy/i.test(m.text())) errors.push(m.text()); });
    assert.equal((await page.context().cookies()).length, 0);
    assert.equal((await page.goto(`${base}/public-wellbeing?scenario=unsafe`, { waitUntil: "networkidle" })).status(), 200);
    const panel = page.getByTestId("panel-safeguarding");
    await panel.waitFor({ state: "visible" });
    const role = async r => {
      const b = panel.getByTestId(`button-safe-role-${r.toLowerCase().replaceAll(" ", "-")}`);
      await b.focus(); await b.press("Enter");
      assert.equal(await b.getAttribute("aria-pressed"), "true");
    };
    const action = async a => {
      const b = panel.getByTestId(`button-safe-${a}`);
      const details = b.locator("xpath=ancestor::details[not(@open)]");
      if (await details.count()) await details.locator("summary").first().press("Enter");
      await b.press("Enter");
    };
    const reset = () => action("reset");
    const text = () => panel.innerText();
    const summary = () => panel.getByTestId("list-safe-summary").innerText();
    const projection = async () => JSON.stringify(await panel.locator("[data-testid]").evaluateAll(nodes => nodes.map(n => [n.dataset.testid, n.textContent])));
    async function checked() {
      await reset();
      await action("record"); await role("Duty Manager"); await action("own"); await action("assess");
      await role("Guest"); await action("contact"); await action("consent");
      await role("Reception"); await action("space");
      await role("Duty Manager"); await action("escort"); await action("review");
    }
    async function release() { await checked(); await action("approve"); await action("release"); }
    async function deliver() {
      await release(); await role("Security"); await action("accept"); await action("arrive"); await action("deliver");
    }
    async function guided() {
      const seen = [];
      for (let i = 0; i < 65; i++) {
        const primary = panel.locator(".wbs-primary button");
        if (await primary.count()) {
          const id = (await primary.getAttribute("data-testid")).replace("button-safe-", "");
          await action(id); seen.push(id);
        } else {
          const next = panel.getByTestId("button-safe-continue");
          if (!(await next.count())) break;
          const old = await panel.locator(".wbs-role[aria-pressed=true]").innerText();
          const before = await projection(), label = await next.innerText();
          await next.press("Enter");
          await page.waitForTimeout(40);
          const target = label.replace("Continue as ", "");
          await role(old); assert.equal(await projection(), before, "role handover performed an implicit action");
          await role(target);
        }
      }
      assert(seen.includes("approve") && seen.includes("release") && seen.includes("accept") && seen.includes("arrive") && seen.includes("deliver") && seen.includes("practical") && seen.includes("cover") && seen.includes("pending") && seen.includes("followup"));
    }

    // Immediate danger is available before any manager/consent/recording flag.
    assert.equal(await panel.locator("button:disabled").count(), 0);
    assert.equal(await panel.getByTestId("button-safe-safer").count(), 0);
    await action("request-emergency");
    assert((await summary()).includes("responder acceptance unconfirmed"));
    await action("confirm-responder");
    assert((await summary()).includes("separate simulated responder acceptance"));
    assert((await summary()).includes("not released"));
    await reset();
    if (width !== 820) await page.screenshot({ path: new URL(`safeguarding-initial-${width}.jpg`, output).pathname, fullPage: true, type: "jpeg" });
    await guided();
    assert((await summary()).includes("Concern remains open"));
    assert((await summary()).includes("Follow-up review recorded"));
    assert((await summary()).includes("pending"));
    if (width !== 820) {
      await panel.getByTestId("list-safe-summary").scrollIntoViewIfNeeded();
      await page.screenshot({ path: new URL(`safeguarding-guided-${width}.jpg`, output).pathname, type: "jpeg" });
    }

    // Both held/declined routine decisions remain open; neither releases anything.
    for (const choice of ["hold", "decline-plan"]) {
      await checked(); await action(choice);
      assert.equal(await panel.getByTestId("button-safe-release").count(), 0);
      assert((await summary()).includes("not released"));
      await action("resume");
    }
    // Consent/capacity missing: no approval, and declining support is not resolution.
    await reset(); await action("record"); await role("Duty Manager"); await action("own"); await action("assess");
    assert.equal(await panel.getByTestId("button-safe-approve").count(), 0);
    await role("Guest"); await action("contact"); await action("decline-support");
    assert((await summary()).includes("declined; respect choice, concern still open"));
    await role("Duty Manager"); assert.equal(await panel.getByTestId("button-safe-release").count(), 0);

    // Missing acknowledgement and unavailable recipient each force a renewed plan.
    for (const failure of ["missed", "unavailable"]) {
      await release();
      assert((await summary()).includes("acceptance outstanding"));
      await action(failure); await action("revise");
      assert.equal(await panel.getByTestId("button-safe-release").count(), 0);
      await action("assess"); await role("Guest"); await action("contact");
      assert((await panel.getByTestId("button-safe-consent").innerText()).includes("limited routine support"));
      await action("consent"); await role("Reception"); await action("space");
      await role("Duty Manager"); await action("escort"); await action("review"); await action("approve"); await action("release");
      assert((await summary()).includes("acceptance outstanding"));
      await action("accept"); await action("arrive"); await action("deliver");
      await role("Security");
      assert((await summary()).includes("No current authorised Security task"));
      assert(!(await text()).includes("Guest agrees to limited routine support for plan v2"));
    }
    // Full shared-role projections (including collapsed history/counts) do not
    // change because of private feedback or its next-action suggestion.
    await deliver();
    const before = {};
    for (const r of ["Security", "Guest Services", "Housekeeping lead"]) {
      await role(r); before[r] = await projection();
      assert(!(await text()).includes("Someone is trying to find me"));
    }
    for (const feedback of ["pending", "safer", "still-unsafe"]) {
      await role("Guest"); await action(feedback);
      assert((await summary()).includes("Concern remains open"));
      for (const r of Object.keys(before)) { await role(r); assert.equal(await projection(), before[r]); }
    }
    await role("Duty Manager");
    assert.equal(await panel.locator(".wbs-primary button").getAttribute("data-testid"), "button-safe-revise");
    await action("revise"); await role("Guest");
    assert((await summary()).includes("Earlier feedback: still unsafe"));

    // Scenario switching is not reset; resetting either story cannot affect the other.
    await page.getByRole("button", { name: "Practical guest support", exact: true }).press("Enter");
    const practical = page.getByTestId("panel-wellbeing-support");
    await practical.getByTestId("button-wellbeing-consent").press("Enter");
    const practicalBefore = await practical.getByTestId("list-wellbeing-summary").innerText();
    await page.getByRole("button", { name: "Guest feels unsafe", exact: true }).press("Enter");
    assert((await summary()).includes("Earlier feedback: still unsafe"));
    await reset(); assert((await panel.getByTestId("text-safe-intro").innerText()).includes("Someone is trying to find me"));
    await action("record");
    await page.getByRole("button", { name: "Practical guest support", exact: true }).press("Enter");
    assert.equal(await practical.getByTestId("list-wellbeing-summary").innerText(), practicalBefore);
    await practical.getByTestId("button-wellbeing-reset").press("Enter");
    await page.getByRole("button", { name: "Guest feels unsafe", exact: true }).press("Enter");
    assert.equal(await panel.locator("[data-testid^='record-safe-']").count(), 1, "practical reset cleared the other scenario");
    assert.equal(await panel.getByTestId("button-safe-role-reception").getAttribute("aria-pressed"), "true");
    await reset();
    assert.equal(await panel.getByTestId("list-safe-records").count(), 0);
    assert.equal(await panel.getByTestId("button-safe-record").count(), 1);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "horizontal overflow");
    assert.equal((await page.context().cookies()).length, 0);
    assert.deepEqual(errors, []); assert.deepEqual(writes, [], "demonstration made a network mutation");
    console.log(`PASS ${width}px: anonymous/direct public entry; emergency before gates; complete keyboard guide; hold/decline; missing checks; two reassignment paths/renewed approval/acceptance; feedback/open concern; all role projections/counts/history; scenario isolation/reset; layout; no network writes`);
    await page.close();
  }
} finally { await browser.close(); }
