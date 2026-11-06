#!/usr/bin/env node
/**
 * Checks a running Travel preview from the outside, as a visitor's browser would reach it.
 * Usage: node artifacts/welbx/scripts/verify-preview.mjs https://<your-preview-host>
 *
 * Anonymous requests only. It never sends or needs an access code, and changes nothing.
 * A stale Vite dev server answering the preview fails the session and protection checks.
 */
const base = (process.argv[2] || "").replace(/\/+$/, "");
if (!/^https?:\/\//.test(base)) {
  console.error("Usage: node scripts/verify-preview.mjs https://<preview-host>");
  process.exit(2);
}
const results = [];
const check = (name, ok, detail) => results.push({ name, ok, detail });
const get = path => fetch(base + path, { redirect: "manual", headers: { accept: "text/html,application/json" } });

for (const path of ["/", "/public-demo", "/public-wellbeing"]) {
  const response = await get(path);
  const body = await response.text();
  check(`Public page ${path} loads`, response.status === 200 && /JALDO Travel/.test(body) && !/\/@vite\/client|src\/main\.tsx/.test(body),
    `status ${response.status}${/\/@vite\/client|src\/main\.tsx/.test(body) ? ", served by a Vite dev server" : ""}`);
}

const session = await get("/partner-session");
const sessionType = session.headers.get("content-type") || "";
const sessionBody = await session.text();
let denied = false;
try { denied = session.status === 401 && sessionType.startsWith("application/json") && JSON.parse(sessionBody).authenticated === false; } catch { /* not JSON */ }
check("Anonymous session request returns the JSON denial", denied, `status ${session.status}, ${sessionType || "no content type"}${denied ? "" : `: ${sessionBody.slice(0, 80).replace(/\s+/g, " ")}`}`);

const entry = await get("/partner-access");
const entryBody = await entry.text();
const form = /<form method="post" action="\/partner-auth">/.test(entryBody) && /id="code" name="code" type="password"/.test(entryBody);
const locked = /awaiting secure setup/.test(entryBody);
check("Partner access shows the real entry form", entry.status === 200 && form, locked ? "access code not configured: the room is locked" : `status ${entry.status}`);

for (const path of ["/partner-room/architecture-lab", "/partner-room/brief.pdf"]) {
  const response = await get(path);
  const body = await response.text();
  check(`Protected ${path} is refused anonymously`, response.status === 401 && !/<div id="root">/.test(body), `status ${response.status}`);
}
const legacy = await get("/partner-room");
check("Anonymous Partner Room home returns to the public overview", legacy.status === 303 && legacy.headers.get("location") === "/", `status ${legacy.status} → ${legacy.headers.get("location")}`);

for (const result of results) console.log(`${result.ok ? "PASS" : "FAIL"}  ${result.name}${result.ok ? "" : ` (${result.detail})`}`);
const failed = results.filter(result => !result.ok).length;
console.log(failed ? `\n${failed} check(s) failed. If the session or protection checks fail, restart the Travel workflow so the access-checking server answers the preview.` : "\nPreview is served by the access-checking server.");
process.exit(failed ? 1 : 0);
