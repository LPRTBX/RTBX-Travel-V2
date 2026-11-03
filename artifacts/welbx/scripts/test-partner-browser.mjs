import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { createTravelServer } from "../server/app.mjs";
import { createAccess, SESSION_MS } from "../server/access.mjs";
import { checkPublicDemo, checkPublicNavigation } from "./public-demo-browser.mjs";

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const code = randomBytes(32).toString("hex"); // isolated, never displayed or configured
let clock = Date.now();
const access = createAccess({ getCode: () => code, now: () => clock });
const server = createTravelServer({ access });
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = `http://localhost:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined });
try {
  const html = await readFile(new URL("../dist/public/index.html", import.meta.url), "utf8");
  const bundle = html.match(/src="([^"]+\.js)"/)[1];
  const journeySource = await readFile(new URL("../src/data/partnerJourney.ts", import.meta.url), "utf8");
  const guidedPaths = [...journeySource.split("export const GUIDED_ROUTE")[1].split("];")[0].matchAll(/path: "([^"]+)"/g)].map(match => match[1]);
  assert(guidedPaths.length === 8, "eight-step journey changed unexpectedly");
  for (const width of [390, 820, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 950 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", message => {
      if (/violates.*Content Security Policy/i.test(message.text())) errors.push(message.text());
    });
    const requests = [];
    page.on("request", req => requests.push(new URL(req.url()).pathname));
    await page.goto(base, { waitUntil: "networkidle" });
    assert(await page.locator("h1").isVisible(), "public introduction missing");
    assert(await page.locator(".honest-grid, #status").count() === 0, "removed public proof-status block returned");
    assert(await page.locator("#demo-notice").textContent() === "Interactive fictional demonstration — no live actions", "concise demonstration note missing");
    for (const title of ["Your people retain authority", "Capacity is checked before commitments", "Completion needs evidence", "Improvements are reviewed before use"]) {
      assert(await page.getByRole("heading", { name: title, exact: true }).count() === 1, `response principle missing: ${title}`);
    }
    assert((await page.request.get(base + "/partner-room/validation")).status() === 401, "validation details exposed anonymously");
    assert(!requests.some(path => path.startsWith("/assets/") || path.startsWith("/src/")), "public page loaded partner code");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `public overflow at ${width}`);
    assert(await page.locator(".intro").innerText() === "When several things go wrong at once, give every team a clear priority—and the GM a clear view of what needs a decision.", "approved supporting promise changed");
    const responseLink = page.getByRole("link", { name: "See the coordinated response" });
    await responseLink.focus();
    await page.keyboard.press("Enter");
    await page.waitForURL(url => url.hash === "#coordinated-response");
    assert(new URL(page.url()).hash === "#coordinated-response", "primary CTA did not reach public explanation");
    const story = page.locator("#coordinated-response");
    assert(await story.isVisible(), "public pressure explanation missing");
    assert(/illustrative composite/i.test(await story.innerText()), "composite boundary missing");
    assert(await story.locator(".roles li").count() === 5, "accountable roles missing");
    const disclosures = story.locator("details");
    for (const detail of await disclosures.all()) {
      await detail.locator("summary").focus();
      await page.keyboard.press("Enter");
      assert(await detail.getAttribute("open") !== null, "public details not keyboard accessible");
    }
    for (const link of await story.locator('a[href^="/partner-access?"]').all()) {
      const target = new URL(await link.getAttribute("href"), base);
      assert((await page.request.get(base + target.searchParams.get("returnTo"))).status() === 401, "public proof link target bypassed access gate");
    }
    for (const href of await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute("href")))) {
      assert(await page.locator(href).count() === 1, `public anchor missing: ${href}`);
    }
    await checkPublicNavigation(page, width);
    await page.locator('#supporting-detail a[href="#ai-in-the-work"]').focus();
    await page.keyboard.press("Enter");
    await page.waitForURL(url => url.hash === "#ai-in-the-work");
    assert(new URL(page.url()).hash === "#ai-in-the-work", "AI explanation not discoverable by keyboard");
    const aiStory = page.locator("#ai-in-the-work");
    assert(/no connected model/i.test(await aiStory.innerText()), "scripted AI boundary missing");
    assert(await page.locator("#aiw-steps li").count() === 8, "AI explanation progression incomplete");
    assert(await page.locator("#aiw-prev").isDisabled(), "AI story started in wrong state");
    const firstReception = await page.locator("#aiw-roleline").innerText();
    for (const role of ["housekeeping", "manager", "reception"]) {
      await page.locator(`#aiw-role-${role}`).focus();
      await page.keyboard.press("Space");
      assert(await page.locator(`#aiw-role-${role}`).getAttribute("aria-pressed") === "true", "role control not keyboard selectable");
      assert((await page.locator("#aiw-roleline").innerText()).toLowerCase().includes(`${role} view`), "role explanation did not change");
      if (role !== "reception") assert(await page.locator("#aiw-roleline").innerText() !== firstReception, "role view only changed styling");
    }
    for (let step = 1; step < 7; step++) {
      await page.locator("#aiw-next").focus();
      await page.keyboard.press("Enter");
      assert(await page.locator("#aiw-steps li[aria-current=step]").count() === 1, "AI story active step missing");
    }
    assert(/1 of 2 rooms released/.test(await page.locator("#aiw-state").innerText()), "missing evidence falsely confirmed work");
    assert(/Supervisor owns/.test(await page.locator("#aiw-body").innerText()), "open inspection lost named ownership");
    for (const role of ["housekeeping", "manager", "reception"]) {
      await page.locator(`#aiw-role-${role}`).click();
      assert((await page.locator("#aiw-roleline").innerText()).toLowerCase().includes(`${role} view`), "evidence view lost role emphasis");
    }
    await page.locator("#aiw-next").click();
    assert(/Open: review held/.test(await page.locator("#aiw-state").innerText()), "missing evidence unlocked reviewed outcome");
    await page.locator("#aiw-evidence-supplied").focus();
    await page.keyboard.press("Enter");
    assert(/awaits authorised review/.test(await page.locator("#aiw-state").innerText()), "supplied evidence auto-approved learning");
    await page.locator("#aiw-prev").click();
    assert(/Confirmed: 2 of 2/.test(await page.locator("#aiw-state").innerText()), "supplied receipt not reflected");
    assert(/Floater unavailable/.test(await page.locator("#aiw-body").innerText()), "approval implied support arrival");
    for (const link of await aiStory.locator('a[href^="/partner-access?"]').all()) {
      const url = new URL(await link.getAttribute("href"), base);
      assert((await page.request.get(base + url.searchParams.get("returnTo"))).status() === 401, "AI proof link exposed partner material");
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `AI story overflow at ${width}`);
    await page.locator("#aiw-reset").click();
    assert(await page.locator("#aiw-title").innerText() === "Synthetic inputs", "AI story reset failed");
    assert(await page.locator("#aiw-role-reception").getAttribute("aria-pressed") === "true", "reset retained role");
    assert(await page.locator("#aiw-evidence-missing").getAttribute("aria-pressed") === "true", "reset retained receipt");
    assert(await page.locator("#demo-app").getAttribute("data-plan") === "", "AI story changed public demo state");
    await checkPublicDemo(page, base, width);
    // JALDO Main currently links to this legacy home instead of the public root.
    await page.goto(base + "/partner-room", { waitUntil: "networkidle" });
    assert(new URL(page.url()).pathname === "/", "legacy public arrival did not reach the overview");
    assert(await page.locator("h1").isVisible(), "legacy arrival lost the public overview");
    assert(await page.locator('a[href="https://wearejaldo.com"]').count() > 0, "return to JALDO Main missing");
    await page.locator('a[href="/partner-access"]:visible').first().click();
    assert(await page.getByRole("heading", { name: "Partner Room access" }).isVisible(), "public Partner Room link bypassed or missed gate");
    assert((await page.request.get(base + bundle)).status() === 401, "anonymous partner bundle allowed");
    assert((await page.request.get(base + "/partner-room/brief.pdf")).status() === 401, "anonymous document allowed");
    await page.goto(base + "/partner-room/architecture-lab", { waitUntil: "networkidle" });
    assert(await page.getByRole("heading", { name: "Partner Room access" }).isVisible(), "direct page bypassed gate");
    if (width === 390) {
      await page.getByLabel("Access code").fill(randomBytes(32).toString("hex"));
      await page.getByRole("button", { name: "Enter Partner Room" }).click();
      await page.getByRole("alert").waitFor();
      assert(/Incorrect access code/.test(await page.getByRole("alert").innerText()), "wrong-code message missing");
    }
    await page.getByLabel("Access code").fill(code);
    await page.getByRole("button", { name: "Enter Partner Room" }).click();
    await page.locator("#architecture-map").waitFor();
    assert(await page.getByRole("button", { name: "Leave Partner Room" }).count() === 1, "logout duplicated or missing");
    assert((await page.request.get(base + bundle)).status() === 200, "approved bundle blocked");
    assert(await page.evaluate(() => localStorage.length === 0 && sessionStorage.length === 0), "partner credential/content persisted in storage");
    await page.goto(base + "/partner-room", { waitUntil: "networkidle" });
    assert(await page.getByRole("heading", { name: "Pressure → accountable action → checked recovery" }).isVisible(), "public-to-partner narrative continuity missing");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `partner entry overflow at ${width}`);
    if (width === 820) {
      await page.goto(base + "/partner-room/validation#evidence-status", { waitUntil: "networkidle" });
      assert(await page.getByRole("heading", { name: "Evidence and pilot validation", exact: true }).isVisible(), "gated evidence status missing");
      for (const path of guidedPaths) {
        await page.goto(base + path, { waitUntil: "networkidle" });
        await page.getByTestId("journey-progress").waitFor();
        assert(await page.getByRole("button", { name: "Leave Partner Room" }).count() === 1, `journey destination failed: ${path}`);
      }
    }
    await page.goto(base + "/partner-room/product-proof/stage-3-operating-layer?scenario=portfolio", { waitUntil: "networkidle" });
    await page.locator("#portfolio-disruption").waitFor();
    assert(await page.locator("#portfolio-disruption").isVisible(), "portfolio path lost");
    await page.getByRole("button", { name: "Leave Partner Room" }).click();
    await page.waitForURL(base + "/");
    assert((await page.request.get(base + bundle)).status() === 401, "logout did not revoke asset access");
    await page.goBack({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Partner Room access" }).waitFor();
    assert(!(await page.locator("body").innerText()).includes("One disruption. Three hotels."), "history restored confidential content after logout");
    await page.goto(base + "/story/guest", { waitUntil: "networkidle" });
    assert(await page.getByRole("heading", { name: "Partner Room access" }).isVisible(), "old bookmark not gated");
    assert(errors.length === 0, `browser errors at ${width}: ${errors.join("; ")}`);
    await context.close();
    process.stdout.write(`PASS public sample, wrong/approved entry, direct assets/downloads, portfolio, logout, old bookmarks and storage at ${width}px\n`);
  }
  clock += 15 * 60 * 1000; // expire the fixture rate-limit window, not a production bypass
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(base + "/partner-access");
  await page.getByLabel("Access code").fill(code);
  await page.getByRole("button", { name: "Enter Partner Room" }).click();
  await page.getByRole("button", { name: "Leave Partner Room" }).waitFor();
  clock += SESSION_MS + 1;
  await page.goto(base + "/partner-room/operations");
  assert(await page.getByRole("heading", { name: "Partner Room access" }).isVisible(), "expired session retrieved page");
  assert(/session has ended/.test(await page.locator("body").innerText()), "expiry message missing");
  await context.close();
  process.stdout.write("PASS expired browser session denied\n");
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
