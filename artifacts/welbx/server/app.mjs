import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createAccess, cookies, cookie, SESSION_COOKIE, CSRF_COOKIE, returnPath, SESSION_MS } from "./access.mjs";
import { loginPage } from "./login.mjs";

export const PUBLIC_FILES = new Set([
  "/favicon.svg", "/brand/jaldo-logo-white.webp",
  "/images/travel/arrival-hero.webp", "/images/travel/team-coordination.webp",
]);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".webp": "image/webp", ".json": "application/json", ".pdf": "application/pdf" };
const root = fileURLToPath(new URL("../dist/public/", import.meta.url));
const publicPage = fileURLToPath(new URL("./public.html", import.meta.url));

function htmlPolicy(html) {
  const hashes = tag => [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))]
    .map(match => `'sha256-${createHash("sha256").update(match[1]).digest("base64")}'`).join(" ");
  return `default-src 'none'; script-src 'self' ${hashes("script")}; style-src 'self' ${hashes("style")}; img-src 'self'; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'self' https://replit.com https://*.replit.com https://*.replit.dev`;
}
const partnerPolicy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://replit.com https://*.replit.com https://*.replit.dev";

export function createTravelServer({ access = createAccess({ getPaused: () => process.env.TRAVEL_PARTNER_ACCESS_PAUSED === "true" }), dist = root, publicHtmlPath = publicPage } = {}) {
  return createServer(async (req, res) => {
    const send = (status, body, type = "text/html; charset=utf-8") => {
      res.writeHead(status, { "Content-Type": type });
      res.end(req.method === "HEAD" ? undefined : body);
    };
    const redirect = target => { res.writeHead(303, { Location: target }); res.end(); };
    const showLogin = (status, destination, message = "") => {
      const csrf = access.challenge();
      res.setHeader("Set-Cookie", cookie(CSRF_COOKIE, csrf || "", csrf ? 600 : 0));
      const html = loginPage({ configured: access.configured(), csrf, destination, message });
      res.setHeader("Content-Security-Policy", htmlPolicy(html));
      send(status, html);
    };
    res.setHeader("Cache-Control", "private, no-store, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Vary", "Cookie");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Strict-Transport-Security", "max-age=31536000");
    res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'self'; base-uri 'none'; form-action 'self'");
    try {
      const url = new URL(req.url, "https://travel.invalid");
      let path;
      try { path = decodeURIComponent(url.pathname); } catch { return send(400, "Invalid address.", "text/plain"); }
      if (path.includes("\\") || path.includes("\0") || path.split("/").includes("..")) return send(400, "Invalid address.", "text/plain");
      const jar = cookies(req);
      const session = access.session(jar[SESSION_COOKIE]);
      if (req.method === "POST") {
        if (!["/partner-auth", "/partner-logout"].includes(path)) return send(405, "Method not allowed.", "text/plain");
        if (req.headers["sec-fetch-site"] === "cross-site") return send(403, "Please use the form on this site.", "text/plain");
        if (!(req.headers["content-type"] || "").startsWith("application/x-www-form-urlencoded")) return send(415, "Form submission required.", "text/plain");
        let body = "";
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 4096) return send(413, "Form too large.", "text/plain");
        }
        const fields = new URLSearchParams(body);
        if (path === "/partner-logout") {
          if (!session || fields.get("csrf") !== session.csrf) return send(403, "Session ended or invalid request.", "text/plain");
          access.leave(jar[SESSION_COOKIE]);
          res.setHeader("Set-Cookie", cookie(SESSION_COOKIE, "", 0));
          res.setHeader("Clear-Site-Data", '"cache", "storage"');
          return redirect("/");
        }
        const destination = returnPath(fields.get("returnTo"));
        if (!access.configured()) return showLogin(503, destination);
        if (!access.consumeChallenge(jar[CSRF_COOKIE], fields.get("csrf"))) return showLogin(403, destination, "This entry form expired. Please try again.");
        if (!access.attempt(req.socket.remoteAddress || "unknown")) {
          res.setHeader("Retry-After", "900");
          return showLogin(429, destination, "Too many entry attempts. Please wait 15 minutes before trying again.");
        }
        const id = access.enter(fields.get("code"));
        if (!id) return showLogin(401, destination, "Incorrect access code. Please check the code supplied to you and try again.");
        access.leave(jar[SESSION_COOKIE]);
        res.setHeader("Set-Cookie", [cookie(SESSION_COOKIE, id, SESSION_MS / 1000), cookie(CSRF_COOKIE, "", 0)]);
        return redirect(destination);
      }
      if (!["GET", "HEAD"].includes(req.method)) return send(405, "Method not allowed.", "text/plain");
      if (path === "/partner-session") {
        return send(session ? 200 : 401, JSON.stringify(session ? { expiresAt: session.until, csrf: session.csrf } : { authenticated: false }), "application/json");
      }
      if (["/contact", "/request-partner-access"].includes(path)) return redirect("/#contact");
      if (path === "/" || path === "/public-demo") {
        const html = await readFile(publicHtmlPath, "utf8");
        res.setHeader("Content-Security-Policy", htmlPolicy(html));
        return send(200, html);
      }
      if (path === "/partner-access") {
        const destination = returnPath(url.searchParams.get("returnTo"));
        if (session) return redirect(destination);
        return showLogin(access.configured() ? 200 : 503, destination,
          url.searchParams.get("reason") === "expired" ? "Your partner session has ended. Enter your access code again." : "");
      }
      if (path === "/healthz") return send(200, '{"ok":true}', "application/json");
      // Closed-by-default boundary BEFORE any static lookup or SPA fallback.
      // This includes old bookmarks, aliases, JS/CSS chunks, documents, downloads,
      // source-map guesses, Vite source paths and all unclassified asset names.
      if (!PUBLIC_FILES.has(path) && !session) {
        const navigation = !extname(path) && !path.startsWith("/assets/") && !path.startsWith("/src/") && !path.startsWith("/@");
        if (navigation) return showLogin(access.configured() ? 401 : 503, returnPath(req.url),
          jar[SESSION_COOKIE] ? "Your partner session has ended. Enter your access code again." : "");
        return send(401, '{"error":"Partner access required"}', "application/json");
      }
      // Source and configuration files are never served, even after entry.
      if (path.endsWith(".map") || path.startsWith("/src/") || path.startsWith("/@") || path.split("/").some(p => p.startsWith("."))) return send(404, "Not found.", "text/plain");
      const file = resolve(dist, "." + path);
      if (!file.startsWith(resolve(dist) + sep)) return send(404, "Not found.", "text/plain");
      let found;
      try { found = await stat(file); } catch { /* SPA navigation below, never asset fallback */ }
      if (found?.isFile()) {
        res.setHeader("Content-Security-Policy", partnerPolicy);
        return send(200, await readFile(file), TYPES[extname(file)] || "application/octet-stream");
      }
      if (extname(path) || PUBLIC_FILES.has(path)) return send(404, "Not found.", "text/plain");
      res.setHeader("Content-Security-Policy", partnerPolicy);
      return send(200, await readFile(resolve(dist, "index.html")));
    } catch {
      send(500, "The page is temporarily unavailable. Please try again.", "text/plain");
    }
  });
}
