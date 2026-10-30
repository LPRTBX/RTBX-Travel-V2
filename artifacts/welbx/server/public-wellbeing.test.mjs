import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createTravelServer } from "./app.mjs";
import { createAccess } from "./access.mjs";

test("only the isolated fictional wellbeing entry and JS/CSS are public; partner gate remains closed", async () => {
  const temp = await mkdtemp(join(tmpdir(), "travel-public-wellbeing-"));
  const dist = join(temp, "partner"), publicWellbeingDist = join(temp, "story");
  await mkdir(join(dist, "assets"), { recursive: true });
  await mkdir(join(publicWellbeingDist, "assets"), { recursive: true });
  await writeFile(join(dist, "index.html"), "PROTECTED APPLICATION");
  await writeFile(join(dist, "assets/partner.js"), "PROTECTED SCRIPT");
  await writeFile(join(publicWellbeingDist, "index.html"), '<html><script type="module" src="/public-wellbeing/assets/story-a.js"></script>FICTIONAL PUBLIC STORY</html>');
  await writeFile(join(publicWellbeingDist, "assets/story-a.js"), "/* public fictional story */");
  await writeFile(join(publicWellbeingDist, "assets/story-a.css"), "body{}");
  // Even misplaced source maps/documents must not become public.
  await writeFile(join(publicWellbeingDist, "assets/private.pdf"), "PRIVATE DOCUMENT");
  await writeFile(join(publicWellbeingDist, "assets/story-a.js.map"), "PRIVATE SOURCE");
  const server = createTravelServer({ dist, publicWellbeingDist, access: createAccess({ getCode: () => undefined }) });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const path of ["/public-wellbeing", "/public-wellbeing/"]) {
      const r = await fetch(base + path);
      assert.equal(r.status, 200);
      assert.match(r.headers.get("content-type"), /text\/html/);
      assert.equal(r.headers.get("set-cookie"), null);
      assert.match(r.headers.get("content-security-policy"), /script-src 'self'/);
      assert.match(await r.text(), /FICTIONAL PUBLIC STORY/);
    }
    for (const [name, type] of [["story-a.js", "javascript"], ["story-a.css", "text/css"]]) {
      const r = await fetch(`${base}/public-wellbeing/assets/${name}`);
      assert.equal(r.status, 200); assert.ok(r.headers.get("content-type").includes(type));
    }
    assert.equal((await fetch(base + "/public-wellbeing/assets/missing.js")).status, 404);
    for (const path of [
      "/partner-room/architecture-lab", "/partner-room/scenario-builder", "/partner-room/proof-calculator",
      "/partner-room/brief.pdf", "/assets/partner.js", "/src/App.tsx",
      "/public-wellbeing/assets/private.pdf", "/public-wellbeing/assets/story-a.js.map",
      "/public-wellbeing/index.html", "/public-wellbeing/assets/%252e%252e%252fpartner.js",
    ]) {
      const r = await fetch(base + path, { redirect: "manual" });
      assert.ok([401, 503].includes(r.status), `${path} must remain gated`);
      assert.doesNotMatch(await r.text(), /PROTECTED APPLICATION|PROTECTED SCRIPT|PRIVATE DOCUMENT|PRIVATE SOURCE/);
    }
    const session = await fetch(base + "/partner-session");
    assert.equal(session.status, 401);
    assert.deepEqual(await session.json(), { authenticated: false });
  } finally {
    await new Promise(resolve => server.close(resolve));
    await rm(temp, { recursive: true, force: true });
  }
});
