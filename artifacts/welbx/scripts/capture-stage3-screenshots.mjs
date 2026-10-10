/**
 * Captures the Stage 3 peak-pressure screenshots in screenshots/ux-stage3-peak-pressure.
 * Usage: start the app (pnpm exec vite --port 5196), then
 *   STAGE3_URL=http://localhost:5196 [STAGE3_BEFORE_URL=<a build of the old walkthrough>] node scripts/capture-stage3-screenshots.mjs
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "../../../screenshots/ux-stage3-peak-pressure");
const AFTER = process.env.STAGE3_URL ?? "http://localhost:5196";
const BEFORE = process.env.STAGE3_BEFORE_URL;
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const STAGE3 = "/partner-room/product-proof/stage-3-operating-layer";
const sizes = [[390, 844], [820, 1180], [1440, 900]];

for (const [w, h] of sizes) {
  if (BEFORE) {
    // Before: the old walkthrough (captured from f30cf66 for this PR).
    const b = await browser.newPage({ viewport: { width: w, height: h } });
    await b.goto(`${BEFORE}${STAGE3}`, { waitUntil: "networkidle" });
    await b.getByRole("button", { name: "Experience Stage 3 · Planned simulation" }).scrollIntoViewIfNeeded();
    await b.screenshot({ path: `${OUT}/00-before-old-walkthrough-${w}.png` });
    await b.close();
  }

  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto(`${AFTER}${STAGE3}`, { waitUntil: "networkidle" });
  const peak = p.locator("#peak-pressure");
  const approval = p.getByTestId("peak-approval");
  const choose = name => peak.getByRole("group", { name: "Choose a path through the scenario" }).getByRole("button", { name: new RegExp(name) }).click();
  const shot = async (name, loc) => loc.screenshot({ path: `${OUT}/${name}-${w}.png` });
  const recordAll = async () => { for (let i = 0; i < 12; i++) { const bt = peak.getByRole("button", { name: /^Record as / }); if (!await bt.count()) return; await bt.first().click(); } };

  await peak.scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${OUT}/01-intro-and-paths-${w}.png` });
  await shot("02-signals-and-why-review", peak.locator(".pk-block").nth(0));
  await shot("03-why-review", p.getByTestId("peak-why"));

  await choose("Wrong approval role");
  await approval.getByRole("button", { name: "Approve the intervention" }).click();
  await shot("04-challenge3-wrong-role", approval);

  await choose("Missing or conflicting signals");
  await shot("05-challenge1-missing-conflicting", peak.locator(".pk-block").nth(0));
  await approval.getByLabel("Reason, or the information you need").fill("Confirm who is on the desk and the break log");
  await approval.getByRole("button", { name: "Request more information" }).click();
  await shot("06-challenge1-information-requested", approval);

  await choose("Intervention declined or deferred");
  await approval.getByLabel("Reason, or the information you need").fill("Two agents return from lunch at 13:45");
  await approval.getByRole("button", { name: "Continue monitoring" }).click();
  await shot("07-challenge4-monitoring", approval);
  await approval.getByRole("button", { name: "Review time reached (simulated)" }).click();
  await approval.getByLabel("Reason, or the information you need").fill("Agency cover already arranged by the General Manager");
  await approval.getByRole("button", { name: "Decline" }).click();
  await shot("08-challenge4-declined-stages", p.getByTestId("peak-stages"));

  await choose("Not enough people to prepare");
  await approval.getByRole("button", { name: "Approve the intervention" }).click();
  await recordAll();
  await shot("09-challenge2-capacity-gap-execution", p.getByTestId("peak-execution"));
  await shot("10-portfolio-aggregate-outstanding", p.getByTestId("portfolio-aggregate"));
  const portfolio = p.locator("#portfolio-coordination");
  for (const a of ["regional-ops", "gm-coastal"]) { await p.locator("#pc-actor").selectOption(a); await portfolio.getByRole("button", { name: "Approve as selected role" }).click(); }
  await shot("11-portfolio-cover-approved", p.getByTestId("portfolio-response"));
  await shot("11a-cover-authorised-not-in-place", p.getByTestId("peak-capacity"));
  for (const id of ["release", "arrival"]) await peak.locator(`[data-action="${id}"]`).getByRole("button", { name: /^Record as / }).click();
  await shot("11b-cover-in-place-gap-closed", p.getByTestId("peak-capacity"));
  await peak.getByRole("button", { name: "Approve draft as Duty Manager" }).click();
  await recordAll();
  await peak.getByRole("button", { name: "Record follow-up measurements (synthetic)" }).click();
  await p.getByTestId("peak-learning").getByRole("button", { name: "Approve the proposal" }).click();
  await shot("12-verified-outcome", p.getByTestId("peak-outcome"));
  await shot("13-learning-approved", p.getByTestId("peak-learning"));
  await shot("14-stages-separated", p.getByTestId("peak-stages"));
  await shot("15-portfolio-aggregate-done", p.getByTestId("portfolio-aggregate"));

  await choose("Missing follow-up evidence");
  await approval.getByRole("button", { name: "Approve the intervention" }).click();
  await peak.getByRole("button", { name: "Approve draft as Duty Manager" }).click();
  await recordAll();
  await peak.getByRole("button", { name: "Record follow-up measurements (synthetic)" }).click();
  await shot("16-challenge5-missing-evidence", p.getByTestId("peak-outcome"));
  await p.close();
}
await browser.close();
console.log("done");
