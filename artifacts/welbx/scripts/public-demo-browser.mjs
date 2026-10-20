// Shared with the existing public/partner browser regression run.
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const roles = ["reception", "housekeeping", "maintenance", "guest", "manager"];
const acknowledgements = ["reception", "housekeeping", "maintenance", "guest"];
const checks = {
  room: [["r218", "cot", "m304est"], ["r218n2", "cot2", "rate"]],
  wait: [["lounge", "porter", "m304est"], ["r221", "lounge2", "dinner"]],
};
const evidence = {
  room: [["ins218", "cotplaced"], ["assign218", "moved"]],
  wait: [["loungeset", "luggage"], ["ins221", "seating"]],
};

export async function checkPublicDemo(page, base, width) {
  const app = page.locator("#demo-app");
  const state = name => app.getAttribute(`data-${name}`);
  const activate = async id => {
    await page.locator(`#${id}`).focus();
    await page.keyboard.press("Enter");
  };
  const openMaintenance = async () => {
    const text = await page.locator("#demo-room304").textContent();
    assert(/Held.*not released/s.test(text) && /WO-1182/.test(text) && /Open/.test(text),
      "faulty room or outstanding maintenance disappeared");
    assert(await page.locator("#demo-room304").getByText(/Owner:/).count() > 0, "maintenance owner missing");
  };
  const verifyRoles = async () => {
    const before = await app.evaluate(el => ({
      version: el.dataset.version, plan: el.dataset.plan, decision: el.dataset.decision,
      dispatched: el.dataset.dispatched, agreed: el.dataset.agreed,
    }));
    const history = await page.locator("#demo-history").innerText();
    const views = [];
    for (const role of roles) {
      await activate(`demo-role-${role}`);
      assert(await state("role") === role, "role selector did not change explanatory view");
      const after = await app.evaluate(el => ({
        version: el.dataset.version, plan: el.dataset.plan, decision: el.dataset.decision,
        dispatched: el.dataset.dispatched, agreed: el.dataset.agreed,
      }));
      assert(JSON.stringify(before) === JSON.stringify(after), "role switching changed scenario progress");
      assert(await page.locator("#demo-history").innerText() === history, "role switching rewrote decision history");
      views.push(await page.locator("#demo-role-view").innerText());
    }
    assert(new Set(views).size === roles.length, "roles did not provide distinct tasks");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `demo overflow at ${width}px`);
  };
  const fillChecks = async (path, version) => {
    for (const key of checks[path][version]) {
      await page.locator(`#demo-check-${key}`).focus();
      await page.keyboard.press("Space");
      assert(await page.locator(`#demo-check-${key}`).isChecked(), "availability keyboard check failed");
    }
  };
  const finishDelivery = async (path, version) => {
    // Acceptance alone never proves delivery.
    await activate("demo-accept");
    assert(await state("agreed") === "false", "acceptance alone closed an unevidenced response");
    for (const role of acknowledgements) await activate(`demo-ack-${role}`);
    assert(await state("agreed") === "false", "acknowledgements substituted for evidence");
    assert(/evidence receipts missing/i.test(await page.locator("#demo-status").innerText()), "missing evidence not visible");
    await activate(`demo-evidence-${evidence[path][version][0]}`);
    assert(await state("agreed") === "false", "one missing receipt was silently treated as delivered");
    await activate(`demo-evidence-${evidence[path][version][1]}`);
    assert(await state("agreed") === "true", "complete acknowledged response with acceptance not reflected");
    await openMaintenance();
  };

  // Explicit fragments must not be overridden by the default /public-demo arrival.
  for (const hash of ["principles", "sample-demo"]) {
    await page.goto(`${base}/public-demo#${hash}`, { waitUntil: "networkidle" });
    await page.waitForFunction(id => Math.abs(document.getElementById(id).getBoundingClientRect().top) < 180, hash);
    assert(new URL(page.url()).hash === `#${hash}`, "explicit public fragment overwritten");
  }
  assert(await page.getByRole("heading", {
    name: "JALDO coordinates the work. Your people retain authority.", exact: true,
  }).count() === 1, "control principles lost their own heading");
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "You stay in control", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.waitForURL(url => url.hash === "#principles");
  await page.getByRole("link", { name: "Sample demo", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.waitForURL(url => url.pathname === "/public-demo" && url.hash === "#sample-demo");
  await page.goto(`${base}/public-demo`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => Math.abs(document.getElementById("sample-demo").getBoundingClientRect().top) < 180);
  assert(await page.locator("#demo-notice").textContent() === "Interactive fictional demonstration — no live actions", "demo identity notice changed");
  assert(await page.getByRole("heading", {
    name: "One delayed room. A connected hotel. One coordinated response.", exact: true,
  }).count() === 1, "approved demo title missing");
  assert(await page.locator("#demo-plan-room").isDisabled(), "plan unlocked before signal review");
  assert(/no connected model/.test(await page.locator("#demo-interpretation").innerText()), "scripted AI labelled as live");

  for (const path of ["room", "wait"]) {
    await activate("demo-restart");
    await activate("demo-interpret-ack");
    await activate(`demo-plan-${path}`);
    await activate("demo-role-manager");
    assert(await page.locator("#demo-approve").isDisabled(), "exception allowed without availability");
    await activate("demo-hold");
    assert(await state("decision") === "held", "cannot hold a plan while availability is unconfirmed");
    assert(await page.locator("#demo-dispatch").isDisabled(), "unconfirmed held plan dispatched");
    await activate("demo-resume");
    await fillChecks(path, 0);
    await activate("demo-role-reception");
    assert(await page.locator("#demo-approve").isDisabled(), "Reception could approve manager exception");
    await verifyRoles();
    assert(await state("decision") === "pending", "viewing Manager silently approved");
    await activate("demo-hold");
    assert(await state("decision") === "held" && await page.locator("#demo-dispatch").isDisabled(), "held plan dispatched");
    assert(/on hold/i.test(await page.locator("#demo-status").innerText()), "hold state not explained");
    await activate("demo-resume");
    await activate("demo-decline");
    assert(await state("decision") === "declined" && await state("plan") === "", "decline did not leave case open for replanning");
    assert(/Open: plan declined/.test(await page.locator("#demo-status").innerText()), "decline looked like completion");
    await activate(`demo-plan-${path}`);
    await fillChecks(path, 0);
    await activate("demo-approve");
    assert(await state("dispatched") === "false" && await state("agreed") === "false", "approval implied execution or agreement");
    assert(await page.locator("#demo-accept").isDisabled(), "family acceptance recorded before dispatch");
    await activate("demo-dispatch");
    assert(await state("agreed") === "false", "dispatch implied completion");
    await finishDelivery(path, 0);
    await verifyRoles();
    await activate("demo-delay");
    assert(await state("version") === "2" && await state("decision") === "pending", "repair delay retained approval");
    assert(await state("dispatched") === "false" && await state("agreed") === "false", "old dispatch or agreement carried into revised plan");
    assert(/Invalidated by 3:25pm/.test(await page.locator("#demo-history").textContent()), "earlier approval was overwritten instead of retained");
    assert(await page.locator("#demo-dispatch").isDisabled(), "revised response dispatched without new checks/approval");
    for (const key of checks[path][1]) assert(!(await page.locator(`#demo-check-${key}`).isChecked()), "revised availability pre-confirmed");
    await fillChecks(path, 1);
    await activate("demo-hold");
    assert(await page.locator("#demo-dispatch").isDisabled(), "revised hold ignored");
    await activate("demo-resume");
    await activate("demo-approve");
    assert(await page.locator("#demo-history").getByText(/Duty Manager approved exception/).count() === 2, "renewed approval did not retain both decisions");
    assert(await state("dispatched") === "false", "renewed approval auto-dispatched");
    await activate("demo-dispatch");
    // Delivery can be confirmed without family acceptance, but is not an agreed plan.
    for (const role of acknowledgements) await activate(`demo-ack-${role}`);
    for (const key of evidence[path][1]) await activate(`demo-evidence-${key}`);
    assert(await state("agreed") === "false" && /acceptance not recorded/.test(await page.locator("#demo-status").innerText()), "family agreement assumed");
    assert(await page.locator("#demo-improvement").count() === 0, "learning outcome appeared with agreement missing");
    await activate("demo-accept");
    assert(await state("agreed") === "true", "revised plan did not reach checked agreement");
    assert(/Awaiting authorised review; not deployed/.test(await page.locator("#demo-improvement").innerText()), "improvement auto-promoted");
    assert(!/all.*resolved/i.test(await page.locator("#demo-outcome").innerText()), "whole hotel claimed resolved");
    await openMaintenance();
    await verifyRoles();
    assert(await page.evaluate(() => localStorage.length === 0 && sessionStorage.length === 0), "demo wrote persistent browser storage");
  }
  await activate("demo-restart");
  assert(await state("version") === "1" && await state("plan") === "" && await state("role") === "reception", "reset retained scenario or role");
  assert(await page.locator("#demo-progress").getAttribute("value") === "0", "reset retained progress");
  assert(/No decisions yet/.test(await page.locator("#demo-history").innerText()), "reset retained decision history");
  // Existing AI explanation must remain independent from the expanded public demo.
  assert(await page.locator("#aiw-title").innerText() === "Synthetic inputs", "demo controls changed existing AI story");
  assert(await page.locator("#aiw-role-reception").getAttribute("aria-pressed") === "true", "demo role changed AI role");
  assert(await page.locator("#aiw-evidence-missing").getAttribute("aria-pressed") === "true", "demo controls changed AI evidence");
  process.stdout.write(`PASS connected public demo: both paths, hold/decline, revised approval, receipts/acceptance, roles/reset, fragments and keyboard at ${width}px\n`);
}
