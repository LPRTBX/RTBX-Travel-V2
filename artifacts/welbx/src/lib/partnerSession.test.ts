import { describe, expect, it } from "vitest";
import { classifySessionResponse, readSessionResponse, signInHref } from "./partnerSession";

const csrf = "a".repeat(43);
const now = 1_000_000;
const ok = JSON.stringify({ expiresAt: now + 60_000, csrf });

describe("partner session check", () => {
  it("accepts only a well-formed, unexpired JSON session", () => {
    expect(classifySessionResponse(200, "application/json", ok, now)).toEqual({ kind: "ok", session: { expiresAt: now + 60_000, csrf } });
    expect(classifySessionResponse(200, "application/json; charset=utf-8", ok, now).kind).toBe("ok");
  });

  it("sends a 401 or an expired session to the entry form", () => {
    expect(classifySessionResponse(401, "application/json", '{"authenticated":false}', now).kind).toBe("sign-in");
    expect(classifySessionResponse(200, "application/json", JSON.stringify({ expiresAt: now, csrf }), now).kind).toBe("sign-in");
  });

  it("never grants access from a web page, even a 200 one (stale dev server)", () => {
    const html = "<!doctype html><html><body><div id=root></div></body></html>";
    expect(classifySessionResponse(200, "text/html", html, now).kind).toBe("unexpected");
    // A JSON body labelled as HTML is still not trusted.
    expect(classifySessionResponse(200, "text/html", ok, now).kind).toBe("unexpected");
    expect(classifySessionResponse(200, null, ok, now).kind).toBe("unexpected");
  });

  it("rejects malformed or partial JSON", () => {
    for (const body of ["not json", "{}", '{"expiresAt":"soon","csrf":"x"}', JSON.stringify({ expiresAt: now + 1, csrf: "short" }), "null", "[]"]) {
      expect(classifySessionResponse(200, "application/json", body, now).kind).toBe("unexpected");
    }
  });

  it("reports server errors as unavailable, other statuses as unexpected", () => {
    expect(classifySessionResponse(503, "text/plain", "Service unavailable", now).kind).toBe("unavailable");
    expect(classifySessionResponse(500, "text/plain", "The page is temporarily unavailable.", now).kind).toBe("unavailable");
    expect(classifySessionResponse(404, "text/plain", "Not found.", now).kind).toBe("unexpected");
    expect(classifySessionResponse(302, "text/html", "", now).kind).toBe("unexpected");
  });

  it("classifies a real Response by its declared type, not its body", async () => {
    expect((await readSessionResponse(new Response(ok.replace(String(now + 60_000), String(Date.now() + 60_000)), { status: 200, headers: { "content-type": "application/json" } }))).kind).toBe("ok");
    expect((await readSessionResponse(new Response("<!doctype html>", { status: 200, headers: { "content-type": "text/html" } }))).kind).toBe("unexpected");
  });

  it("returns to the same page after signing in", () => {
    expect(signInHref({ pathname: "/partner-room/operations", search: "?view=simulation", hash: "#x" }))
      .toBe("/partner-access?reason=expired&returnTo=%2Fpartner-room%2Foperations%3Fview%3Dsimulation%23x");
  });
});
