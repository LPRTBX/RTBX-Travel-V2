import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdtemp, writeFile, mkdir, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createAccess, SESSION_MS, SESSION_COOKIE, CSRF_COOKIE, returnPath } from "./access.mjs";
import { createTravelServer } from "./app.mjs";

// Ephemeral credentials exist only inside isolated test fixtures, never in the
// running preview, source constants, test output or environment configuration.
const fixture = () => randomBytes(32).toString("hex");

test("missing and short configuration fails closed", () => {
  for (const code of [undefined, "", randomBytes(3).toString("hex")]) {
    const access = createAccess({ getCode: () => code });
    assert.equal(access.configured(), false);
    assert.equal(access.enter(fixture()), null);
  }
});
test("approved session expires, can be revoked, and rotates with the code", () => {
  let clock = 0, code = fixture();
  const access = createAccess({ getCode: () => code, now: () => clock });
  assert.equal(access.enter(fixture()), null);
  const id = access.enter(code);
  assert.ok(access.session(id));
  clock = SESSION_MS;
  assert.equal(access.session(id), null);
  const second = access.enter(code);
  access.leave(second);
  assert.equal(access.session(second), null);
  const third = access.enter(code);
  code = fixture();
  assert.equal(access.session(third), null);
  const fourth = access.enter(code);
  code = undefined;
  assert.equal(access.session(fourth), null);
});
test("shorter configured codes remain exact and case-sensitive", () => {
  const code = fixture().slice(0, 10) + "x";
  const access = createAccess({ getCode: () => code });
  assert.equal(access.configured(), true);
  assert.ok(access.enter(code));
  assert.equal(access.enter(code.slice(0, -1) + "X"), null);
  assert.equal(access.enter(" " + code), null);
  assert.equal(access.enter(code + " "), null);
});
test("setup pause locks entry and existing sessions without opening public resources", () => {
  let paused = false;
  const code = fixture();
  const access = createAccess({ getCode: () => code, getPaused: () => paused });
  const session = access.enter(code);
  assert.ok(access.session(session));
  paused = true;
  assert.equal(access.configured(), false);
  assert.equal(access.enter(code), null);
  assert.equal(access.session(session), null);
});
test("guess limits, expiry and one-use CSRF challenges", () => {
  let clock = 0;
  const access = createAccess({ getCode: fixture, now: () => clock });
  for (let i = 0; i < 5; i++) assert.equal(access.attempt("test-ip"), true);
  assert.equal(access.attempt("test-ip"), false);
  clock += 15 * 60 * 1000;
  assert.equal(access.attempt("test-ip"), true);
  const csrf = access.challenge();
  assert.equal(access.consumeChallenge(csrf, csrf), true);
  assert.equal(access.consumeChallenge(csrf, csrf), false);
  const expired = access.challenge();
  clock += 11 * 60 * 1000;
  assert.equal(access.consumeChallenge(expired, expired), false);
});
test("return locations cannot redirect off site", () => {
  for (const path of ["//other.invalid", "https://other.invalid", "/\\other.invalid", "/partner-auth", "/\r\nx"]) assert.equal(returnPath(path), "/partner-room");
  assert.equal(returnPath("/partner-room/operations?view=simulation"), "/partner-room/operations?view=simulation");
});

test("HTTP boundary: public demo, all old routes, assets/downloads, wrong code, entry, logout and cache headers", async () => {
  const dir = await mkdtemp(join(tmpdir(), "jaldo-boundary-"));
  await mkdir(join(dir, "assets"));
  await writeFile(join(dir, "index.html"), "<h1>TEST PROTECTED MATERIAL</h1>");
  await writeFile(join(dir, "assets", "partner.js"), "TEST PROTECTED SCRIPT");
  await writeFile(join(dir, "brief.pdf"), "TEST PROTECTED DOWNLOAD");
  const code = fixture();
  const access = createAccess({ getCode: () => code });
  const server = createTravelServer({ access, dist: dir });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = (path, options = {}) => fetch(base + path, { redirect: "manual", ...options });
  try {
    for (const path of ["/", "/public-demo"]) {
      const result = await get(path);
      assert.equal(result.status, 200);
      const text = await result.text();
      assert.ok(!text.includes("TEST PROTECTED"));
      assert.ok(!text.includes(code));
      assert.ok(!/src\/main|\/assets\/index/.test(text));
      assert.ok(result.headers.get("content-security-policy").includes("sha256-"));
    }
    const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
    const routes = [...app.matchAll(/(?:path:\s*|path=)["']([^"']+)["']/g)].map(match => match[1].replace(":scenarioId", "sample")).filter(path => path !== "/");
    for (const path of new Set([...routes, "/partner-room/resources/travel-business-plan", "/opengraph.jpg", "/assets/partner.js", "/brief.pdf", "/index.html", "/src/main.tsx", "/@fs/etc/passwd", "/unknown-old-bookmark"])) {
      const result = await get(path);
      assert.equal(result.status, 401, path);
      assert.ok(!(await result.text()).includes("TEST PROTECTED"), path);
      assert.match(result.headers.get("cache-control"), /no-store/);
    }
    const entry = async value => {
      const screen = await get("/partner-access?returnTo=/partner-room/architecture-lab");
      const text = await screen.text();
      const csrf = text.match(/name="csrf" value="([^"]+)"/)[1];
      return get("/partner-auth", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: `${CSRF_COOKIE}=${csrf}` }, body: new URLSearchParams({ csrf, code: value, returnTo: "/partner-room/architecture-lab" }) });
    };
    const bad = await entry(fixture());
    assert.equal(bad.status, 401);
    assert.match(await bad.text(), /Incorrect access code/);
    const ok = await entry(code);
    assert.equal(ok.status, 303);
    assert.equal(ok.headers.get("location"), "/partner-room/architecture-lab");
    const sessionCookie = ok.headers.getSetCookie().find(c => c.startsWith(SESSION_COOKIE)).split(";")[0];
    assert.match(ok.headers.getSetCookie()[0], /HttpOnly; Secure; SameSite=Strict/);
    for (const path of ["/partner-room", "/assets/partner.js", "/brief.pdf"]) {
      const result = await get(path, { headers: { Cookie: sessionCookie } });
      assert.equal(result.status, 200);
      assert.match(await result.text(), /TEST PROTECTED/);
    }
    const session = await (await get("/partner-session", { headers: { Cookie: sessionCookie } })).json();
    const logout = await get("/partner-logout", { method: "POST", headers: { Cookie: sessionCookie, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ csrf: session.csrf }) });
    assert.equal(logout.status, 303);
    assert.equal((await get("/assets/partner.js", { headers: { Cookie: sessionCookie } })).status, 401);
    assert.equal((await get("/partner-auth", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "sec-fetch-site": "cross-site" }, body: "" })).status, 403);
    assert.equal((await get("/request-partner-access")).headers.get("location"), "/#contact");
    for (let i = 0; i < 3; i++) assert.equal((await entry(fixture())).status, 401);
    const limited = await entry(fixture());
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get("retry-after"), "900");
  } finally {
    await new Promise(resolve => server.close(resolve));
    await rm(dir, { recursive: true, force: true });
  }
});
test("unconfigured server never sends partner HTML or assets", async () => {
  const server = createTravelServer({ access: createAccess({ getCode: () => undefined }) });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(base + "/")).status, 200);
    const result = await fetch(base + "/partner-room");
    assert.equal(result.status, 503);
    const body = await result.text();
    assert.match(body, /awaiting secure setup/);
    assert.ok(!body.includes('name="code"'));
    assert.equal((await fetch(base + "/assets/index-old.js")).status, 401);
    assert.equal((await fetch(base + "/partner-session")).status, 401);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
test("paused server keeps public contact/sample available while blocking entry and protected retrieval", async () => {
  const server = createTravelServer({ access: createAccess({ getCode: fixture, getPaused: () => true }) });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const path of ["/", "/public-demo"]) assert.equal((await fetch(base + path)).status, 200);
    for (const path of ["/contact", "/request-partner-access"]) {
      const response = await fetch(base + path, { redirect: "manual" });
      assert.equal(response.status, 303);
      assert.equal(response.headers.get("location"), "/#contact");
    }
    for (const path of ["/partner-access", "/partner-room/architecture-lab", "/story/guest"]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 503);
      assert.ok(!(await response.text()).includes('name="code"'));
    }
    for (const path of ["/assets/partner.js", "/brief.pdf", "/opengraph.jpg", "/partner-session"]) {
      assert.equal((await fetch(base + path)).status, 401);
    }
  } finally { await new Promise(resolve => server.close(resolve)); }
});
