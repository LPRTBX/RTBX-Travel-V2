import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { createTravelServer } from "../server/app.mjs";
import { createAccess, SESSION_MS } from "../server/access.mjs";

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
  for (const width of [390, 820, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 950 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    const requests = [];
    page.on("request", req => requests.push(new URL(req.url()).pathname));
    await page.goto(base, { waitUntil: "networkidle" });
    assert(await page.locator("h1").isVisible(), "public introduction missing");
    assert(!requests.some(path => path.startsWith("/assets/") || path.startsWith("/src/")), "public page loaded partner code");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `public overflow at ${width}`);
    await page.goto(base + "/public-demo", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Acknowledge the delay" }).click();
    await page.getByRole("button", { name: "Offer luggage storage" }).click();
    await page.getByRole("button", { name: "Approve (sample)", exact: true }).click();
    assert(/Bags delivered/.test(await page.locator("#panel").innerText()), "sample choice did not affect result");
    await page.getByRole("button", { name: "Start again" }).click();
    assert(/Acknowledge the delay/.test(await page.locator("#panel").innerText()), "sample reset failed");
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
