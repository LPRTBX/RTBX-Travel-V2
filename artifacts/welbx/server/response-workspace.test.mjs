import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes, createHash } from "node:crypto";
import { createAccess, SESSION_COOKIE, SESSION_MS } from "./access.mjs";
import { createTravelServer } from "./app.mjs";

test("response workspace: gated direct/refresh/HEAD, hashed scripts, expiry and revocation", async () => {
  const code = randomBytes(32).toString("hex");
  let now = 0;
  const access = createAccess({ getCode: () => code, now: () => now });
  const server = createTravelServer({ access });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const route = "/partner-room/response-workspace";
  const get = (path, id, method = "GET") => fetch(base + path, { method, redirect: "manual", headers: id ? {cookie: `${SESSION_COOKIE}=${id}`} : {} });
  try {
    for (const path of [route, route + "/", route + "?review=1", "/server/private/response-workspace.html"]) {
      const res = await get(path);
      assert.equal(res.status, 401);
      assert.doesNotMatch(await res.text(), /Interactive demonstration|Core kernel/);
    }
    const id = access.enter(code);
    for (const path of [route, route + "/", route + "?review=1"]) {
      const res = await get(path, id);
      assert.equal(res.status, 200);
      assert.match(res.headers.get("cache-control"), /no-store/);
      const html = await res.text();
      assert.match(html, /Return to Partner Room/);
      assert.match(html, /fictional system events/);
      assert.match(html, /79939dc/);
      assert.match(html, /\/partner-session/);
      const policy = res.headers.get("content-security-policy");
      assert.match(policy, /img-src 'self' data:/);
      assert.doesNotMatch(policy, /unsafe-inline|unsafe-eval/);
      for (const tag of ["script", "style"]) {
        for (const match of html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))) {
          assert.ok(policy.includes(createHash("sha256").update(match[1]).digest("base64")), `${tag} has a matching CSP hash`);
        }
      }
    }
    const head = await get(route, id, "HEAD");
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    assert.equal((await get("/server/private/response-workspace.html", id)).status, 404);
    now = SESSION_MS;
    assert.equal((await get(route, id)).status, 401);
    const second = access.enter(code);
    access.leave(second);
    assert.equal((await get(route, second)).status, 401);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
