import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_MS = 30 * 60 * 1000;
const WINDOW_MS = 15 * 60 * 1000;
export const SESSION_COOKIE = "__Host-jaldo_partner";
export const CSRF_COOKIE = "__Host-jaldo_entry";
const digest = value => createHash("sha256").update(value).digest();
const token = () => randomBytes(32).toString("base64url");
const equal = (a, b) => timingSafeEqual(digest(a), digest(b));

// Process-local, bounded stores deliberately fail closed on restart. No code,
// session credential or request body is logged or written to browser storage.
export function createAccess({ getCode = () => process.env.TRAVEL_PARTNER_ACCESS_CODE, getPaused = () => false, now = Date.now } = {}) {
  const sessions = new Map();
  const challenges = new Map();
  const attempts = new Map();
  let globalAttempts = { count: 0, until: 0 };
  const fingerprint = () => {
    if (getPaused()) return null;
    const code = getCode();
    return typeof code === "string" && code.length >= 8 ? digest(code).toString("hex") : null;
  };
  const prune = map => {
    for (const [key, value] of map) if (value.until <= now()) map.delete(key);
  };
  return {
    configured: () => Boolean(fingerprint()),
    challenge() {
      prune(challenges);
      if (challenges.size >= 2000) return null;
      const id = token();
      challenges.set(id, { until: now() + 10 * 60 * 1000 });
      return id;
    },
    consumeChallenge(cookie, supplied) {
      const found = challenges.get(cookie);
      challenges.delete(cookie);
      return Boolean(found && found.until > now() && typeof supplied === "string" && equal(cookie, supplied));
    },
    attempt(ip) {
      prune(attempts);
      if (globalAttempts.until <= now()) globalAttempts = { count: 0, until: now() + WINDOW_MS };
      if (!attempts.has(ip)) {
        if (attempts.size >= 2000) return false;
        attempts.set(ip, { count: 0, until: now() + WINDOW_MS });
      }
      const bucket = attempts.get(ip);
      // The socket address is used, not attacker-controlled forwarding headers.
      // A shared proxy may share this conservative limit across visitors.
      if (bucket.count >= 5 || globalAttempts.count >= 100) return false;
      bucket.count++;
      globalAttempts.count++;
      return true;
    },
    enter(input) {
      const code = getCode();
      if (!fingerprint() || typeof input !== "string" || !equal(input, code)) return null;
      prune(sessions);
      if (sessions.size >= 1000) return null;
      const id = token();
      sessions.set(digest(id).toString("hex"), {
        until: now() + SESSION_MS, fingerprint: fingerprint(), csrf: token(),
      });
      return id;
    },
    session(id) {
      if (!id || !fingerprint()) return null;
      const key = digest(id).toString("hex");
      const found = sessions.get(key);
      if (!found || found.until <= now() || found.fingerprint !== fingerprint()) {
        sessions.delete(key);
        return null;
      }
      return found;
    },
    leave(id) {
      if (id) sessions.delete(digest(id).toString("hex"));
    },
  };
}

export function cookies(req) {
  return Object.fromEntries((req.headers.cookie || "").split(";").map(value => {
    const index = value.indexOf("=");
    return index < 0 ? ["", ""] : [value.slice(0, index).trim(), value.slice(index + 1)];
  }));
}

export function cookie(name, value, maxAge) {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function returnPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") ||
      /[\\\u0000-\u0020\u007f]/.test(value) || value.startsWith("/partner-auth") ||
      value.startsWith("/partner-access") || value.startsWith("/partner-logout")) return "/partner-room";
  return value;
}
