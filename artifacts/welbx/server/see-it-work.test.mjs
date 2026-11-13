import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createTravelServer } from './app.mjs';
import { createAccess, SESSION_COOKIE, SESSION_MS } from './access.mjs';

// Exercise the real HTTP request handler without binding a TCP port.
function request(server, url, { method = 'GET', id } = {}) {
  return new Promise((resolve, reject) => {
    const headers = {};
    const response = {
      setHeader(name, value) { headers[name.toLowerCase()] = value; },
      writeHead(status, values = {}) { this.status = status; for (const [k,v] of Object.entries(values)) headers[k.toLowerCase()] = v; },
      end(body) { resolve({ status: this.status, headers, body: body === undefined ? '' : String(body) }); },
    };
    try { server.emit('request', {url, method, headers: id ? {cookie: `${SESSION_COOKIE}=${id}`} : {}}, response); } catch (e) { reject(e); }
  });
}
function assertCsp(result) {
  const policy = result.headers['content-security-policy'];
  assert.doesNotMatch(policy, /unsafe-inline|unsafe-eval/);
  for (const tag of ['style','script']) for (const m of result.body.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))) {
    assert.ok(policy.includes(createHash('sha256').update(m[1]).digest('base64')), `${tag} hash allowed`);
  }
  assert.doesNotMatch(result.body, /\sstyle="|\sonclick=/);
}

test('public entry reuses existing demos, has no evidence payload and serves GET/HEAD without session', async () => {
  const server = createTravelServer();
  for (const path of ['/see-it-work', '/see-it-work/', '/see-it-work?source=home']) {
    const r = await request(server, path);
    assert.equal(r.status, 200);
    assert.match(r.body, /\/public-wellbeing\?scenario=practical/);
    assert.match(r.body, /\/public-wellbeing\?scenario=unsafe/);
    assert.match(r.body, /\/public-demo#sample-demo/);
    assert.match(r.body, /Illustrative demonstrations/);
    assert.doesNotMatch(r.body, /Source register|Core &amp; evidence|AC-01|review\/core-|github\.com/);
    assert.equal(r.headers['set-cookie'], undefined);
    assert.match(r.headers['cache-control'], /no-store/);
    assertCsp(r);
  }
  const head = await request(server, '/see-it-work', {method:'HEAD'});
  assert.equal(head.status,200); assert.equal(head.body,'');
  assert.equal((await request(server, '/see-it-work', {method:'POST'})).status,405);
});

test('review and source guesses stay closed; prefix does not create a public directory', async () => {
  const access = createAccess({getCode: () => 'review-code'});
  const server = createTravelServer({access});
  for (const path of ['/partner-room/application-review','/partner-room/application-review/','/partner-room/application-review?x=1','/server/private/application-review.html','/see-it-work/source.js','/see-it-work/anything']) {
    const r = await request(server,path);
    assert.equal(r.status,401,path);
    assert.doesNotMatch(r.body,/reference baseline|AC-01|TR-014/);
  }
  const login = await request(server, '/partner-room/application-review');
  assert.match(login.body,/application-review/);
});

test('authorised review includes retained evidence, safe CSP and session-expiry handling; expired/revoked sessions lose access', async () => {
  let now = 0;
  const access = createAccess({getCode: () => randomCode, now: () => now});
  const randomCode = randomBytes(24).toString('hex');
  const server = createTravelServer({access});
  const id = access.enter(randomCode);
  for (const path of ['/partner-room/application-review','/partner-room/application-review/','/partner-room/application-review?x=1']) {
    const r = await request(server,path,{id});
    assert.equal(r.status,200); assert.match(r.body,/Application design review · reference baseline/);
    assert.match(r.body,/AC-01/); assert.match(r.body,/\/partner-session/);
    assert.match(r.body,/document\.body\.replaceChildren/); assert.match(r.body,/visibilitychange/);
    assertCsp(r);
  }
  assert.equal((await request(server,'/partner-room/application-review',{id,method:'HEAD'})).body,'');
  assert.equal((await request(server,'/server/private/application-review.html',{id})).status,404);
  now = SESSION_MS;
  assert.equal((await request(server,'/partner-room/application-review',{id})).status,401);
  const next = access.enter(randomCode); access.leave(next);
  assert.equal((await request(server,'/partner-room/application-review',{id:next})).status,401);
});

test('public anchors resolve and homepage links into one shared entry', async () => {
  const server = createTravelServer();
  const page = (await request(server,'/see-it-work')).body;
  const ids = new Set([...page.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
  for (const m of page.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(m[1]),m[1]);
  const home = await readFile(new URL('./public.html',import.meta.url),'utf8');
  assert.match(home,/href="\/see-it-work" aria-label="See the hotel respond"/);
  assert.match(home,/id="sample-demo"/); // Legacy room demo remains available.
  assert.match(home,/href="\/public-wellbeing"/); // Existing wellbeing entry remains available.
});
