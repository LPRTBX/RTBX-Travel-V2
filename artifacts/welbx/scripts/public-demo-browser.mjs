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

// Compact, keyboard-operable navigation below 960px; full navigation above.
export async function checkPublicNavigation(page, width) {
  const toggle = page.locator("#nav-toggle");
  const links = page.locator("#site-nav a");
  const heroTop = await page.locator(".hero").evaluate(el => el.getBoundingClientRect().top + scrollY);
  const order = await page.locator("main > section").evaluateAll(list => list.map(section => section.id || section.className.split(" ")[0]));
  assert(order.slice(0, 6).join() === "hero,coordinated-response,sample-demo,outcomes,existing-systems,contact", `public page order changed: ${order}`);
  assert(order.indexOf("supporting-detail") === 6 && ["principles", "ai-in-the-work", "loop"].every(id => order.indexOf(id) > 6), "supporting detail not labelled after the main story");
  if (width >= 1000) {
    assert(!(await toggle.isVisible()) && await links.first().isVisible(), "desktop navigation collapsed");
    assert(await links.count() === 8 && await page.locator("#site-nav a:visible").count() === 8, "desktop navigation incomplete");
    return;
  }
  assert(heroTop <= 140, `mobile header still pushes the hero to ${heroTop}px`);
  assert(await toggle.isVisible() && await toggle.getAttribute("aria-expanded") === "false", "menu control missing or open");
  assert(await page.locator(".hdr-demo").isVisible() && await page.locator(".tb-partner").isVisible(), "demo or Partner Room entry not prominent");
  assert(!(await links.first().isVisible()), "collapsed navigation still visible");
  await toggle.focus();
  assert(await toggle.evaluate(el => getComputedStyle(el).outlineStyle !== "none"), "menu control focus not visible");
  await page.keyboard.press("Enter");
  assert(await toggle.getAttribute("aria-expanded") === "true" && await links.first().isVisible(), "menu did not open");
  assert(await page.evaluate(() => document.activeElement.closest("#site-nav") !== null), "focus did not move into opened menu");
  assert(await page.locator("#site-nav .partner").isVisible(), "Partner Room missing from menu");
  await page.keyboard.press("Tab");
  assert(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle !== "none"), "menu link focus not visible");
  await page.keyboard.press("Escape");
  assert(await toggle.getAttribute("aria-expanded") === "false" && await page.evaluate(() => document.activeElement.id === "nav-toggle"), "Escape did not close menu and return focus");
  await page.keyboard.press("Enter");
  await page.locator('#site-nav a[href="#outcomes"]').click();
  await page.waitForURL(url => url.hash === "#outcomes");
  assert(await toggle.getAttribute("aria-expanded") === "false", "menu stayed open after choosing a link");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `navigation overflow at ${width}px`);
  await page.evaluate(() => scrollTo(0, 0));
}

export async function checkPublicDemo(page, base, width) {
  const app = page.locator("#demo-app");
  const state = name => app.getAttribute(`data-${name}`);
  // Controls are revealed progressively: "not yet shown" and "shown but disabled" both mean unavailable.
  const unavailable = async id => {
    const control = page.locator(`#${id}`);
    return await control.count() === 0 || await control.isDisabled();
  };
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
  const openMenu = async () => {
    if (await page.locator("#nav-toggle").isVisible() && await page.locator("#nav-toggle").getAttribute("aria-expanded") === "false") await activate("nav-toggle");
  };
  await openMenu();
  await page.getByRole("link", { name: "You stay in control", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.waitForURL(url => url.hash === "#principles");
  await openMenu();
  await page.getByRole("link", { name: "Sample demo", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.waitForURL(url => url.pathname === "/public-demo" && url.hash === "#sample-demo");
  await page.goto(`${base}/public-demo`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => Math.abs(document.getElementById("sample-demo").getBoundingClientRect().top) < 180);
  assert(await page.locator("#demo-notice").textContent() === "Interactive fictional demonstration — no live actions", "demo identity notice changed");
  assert(await page.getByRole("heading", {
    name: "One delayed room. A connected hotel. One coordinated response.", exact: true,
  }).count() === 1, "approved demo title missing");
  assert(await unavailable("demo-plan-room"), "plan unlocked before signal review");
  assert(/no connected model/.test(await page.locator("#demo-interpretation").innerText()), "scripted AI labelled as live");

  for (const path of ["room", "wait"]) {
    await activate("demo-restart");
    await activate("demo-interpret-ack");
    await activate(`demo-plan-${path}`);
    await activate("demo-role-manager");
    assert(await page.locator("#demo-approve").isDisabled(), "exception allowed without availability");
    assert(/blocked/i.test(await page.locator("#demo-approval").innerText()), "blocked approval not explained");
    assert(/checks outstanding/.test(await page.locator("#demo-next-do").innerText()), "next step did not point at missing checks");
    await activate("demo-hold");
    assert(await state("decision") === "held", "cannot hold a plan while availability is unconfirmed");
    assert(await unavailable("demo-dispatch"), "unconfirmed held plan dispatched");
    await activate("demo-resume");
    await fillChecks(path, 0);
    await activate("demo-role-reception");
    assert(await page.locator("#demo-approve").isDisabled(), "Reception could approve manager exception");
    await verifyRoles();
    assert(await state("decision") === "pending", "viewing Manager silently approved");
    await activate("demo-hold");
    assert(await state("decision") === "held" && await unavailable("demo-dispatch"), "held plan dispatched");
    assert(/on hold/i.test(await page.locator("#demo-status").innerText()), "hold state not explained");
    await activate("demo-resume");
    await activate("demo-decline");
    assert(await state("decision") === "declined" && await state("plan") === "", "decline did not leave case open for replanning");
    assert(/Open: plan declined/.test(await page.locator("#demo-status").innerText()), "decline looked like completion");
    await activate(`demo-plan-${path}`);
    await fillChecks(path, 0);
    await activate("demo-approve");
    assert(await state("dispatched") === "false" && await state("agreed") === "false", "approval implied execution or agreement");
    assert(await unavailable("demo-accept"), "family acceptance recorded before dispatch");
    await activate("demo-dispatch");
    assert(await state("agreed") === "false", "dispatch implied completion");
    await finishDelivery(path, 0);
    await verifyRoles();
    await activate("demo-delay");
    assert(await state("version") === "2" && await state("decision") === "pending", "repair delay retained approval");
    assert(await state("dispatched") === "false" && await state("agreed") === "false", "old dispatch or agreement carried into revised plan");
    assert(/Invalidated by 3:25pm/.test(await page.locator("#demo-history").textContent()), "earlier approval was overwritten instead of retained");
    assert(await unavailable("demo-dispatch"), "revised response dispatched without new checks/approval");
    for (const key of checks[path][1]) assert(!(await page.locator(`#demo-check-${key}`).isChecked()), "revised availability pre-confirmed");
    await fillChecks(path, 1);
    await activate("demo-hold");
    assert(await unavailable("demo-dispatch"), "revised hold ignored");
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
  // Regression: advancing to 3:25pm before version 1 is fully recorded must not
  // report a finished plan with stale progress, nor complete version 1 after the fact.
  for (const path of ["room", "wait"]) {
    await activate("demo-restart");
    await activate("demo-interpret-ack");
    await activate(`demo-plan-${path}`);
    await fillChecks(path, 0);
    await activate("demo-role-manager");
    await activate("demo-approve");
    await activate("demo-dispatch");
    await activate("demo-ack-reception");
    await activate(`demo-evidence-${evidence[path][0][0]}`);
    assert(/3 unrecorded steps.*superseded, not complete/s.test(await page.locator("#demo-delay-blk").innerText()), "early advance not explained");
    await activate("demo-delay");
    const record = page.locator("#demo-v1-record");
    const states = async () => record.locator("li").evaluateAll(items => items.map(li => li.dataset.state).join(","));
    assert(await states() === "done,done,done,invalidated,done,superseded,superseded,superseded", `version 1 steps misreported: ${await states()}`);
    assert(await state("superseded") === "3", "superseded count missing");
    const recordText = await record.innerText();
    assert(/recorded: Reception; missing: Housekeeping, Maintenance, Guest services/.test(recordText), "original acknowledgements not preserved honestly");
    assert(/missing: /.test(recordText.split("\n").find(line => /Evidence recorded/.test(line))), "missing version 1 evidence hidden");
    assert(await state("progress") === "2/8" && await state("agreed") === "false", "revised response started with stale progress");
    assert(await unavailable("demo-dispatch") && await page.locator("#demo-approve").isDisabled(), "revised response skipped fresh checks");
    await fillChecks(path, 1);
    await activate("demo-approve");
    await activate("demo-dispatch");
    for (const role of acknowledgements) await activate(`demo-ack-${role}`);
    for (const key of evidence[path][1]) await activate(`demo-evidence-${key}`);
    await activate("demo-accept");
    const status = await page.locator("#demo-status").innerText();
    assert(await state("agreed") === "true" && await state("progress") === "8/8", "revised completion and progress disagree");
    assert(await page.locator("#demo-progress").evaluate(el => el.value === el.max && el.max === 8), "progress bar disagrees with completion");
    assert(/8 of 8 steps/.test(status) && /3 of 8 steps never recorded/.test(status), `completion status hides superseded steps: ${status}`);
    assert(await record.innerText() === recordText && await states() === "done,done,done,invalidated,done,superseded,superseded,superseded", "version 1 record rewritten after completion");
    assert(await page.locator("#demo-milestones li.done").count() === 8, "current response steps incomplete at completion");
    assert(/never recorded/.test(await page.locator("#demo-v1-summary").innerText()), "sidebar hides superseded version 1");
    await openMaintenance();
  }
  // The guidance panel alone must lead through both versions.
  await activate("demo-restart");
  let actions = 0;
  while (!(await state("version") === "2" && await state("agreed") === "true")) {
    assert(++actions <= 40, "guided path did not reach completion");
    const before = await page.locator("#demo-next-do").innerText();
    await activate("demo-next-go");
    const target = await page.evaluate(() => document.activeElement.id);
    assert(target && target !== "demo-next-go", `next step did not move focus: ${before}`);
    await page.keyboard.press(target.startsWith("demo-check-") ? "Space" : "Enter");
  }
  assert(actions >= 25 && actions <= 35, `guided path length changed unexpectedly (${actions} actions)`);
  assert(await state("superseded") === "0", "fully recorded version 1 shown as superseded");
  await activate("demo-restart");
  assert(await state("version") === "1" && await state("plan") === "" && await state("role") === "reception", "reset retained scenario or role");
  assert(await page.locator("#demo-progress").getAttribute("value") === "0", "reset retained progress");
  assert(/No decisions yet/.test(await page.locator("#demo-history").innerText()), "reset retained decision history");
  // Existing AI explanation must remain independent from the expanded public demo.
  assert(await page.locator("#aiw-title").innerText() === "Synthetic inputs", "demo controls changed existing AI story");
  assert(await page.locator("#aiw-role-reception").getAttribute("aria-pressed") === "true", "demo role changed AI role");
  assert(await page.locator("#aiw-evidence-missing").getAttribute("aria-pressed") === "true", "demo controls changed AI evidence");
  process.stdout.write(`PASS connected public demo: both paths, hold/decline, revised approval, receipts/acceptance, roles/reset, fragments, early-advance regression, guided path (${actions} steps) and keyboard at ${width}px\n`);
}
