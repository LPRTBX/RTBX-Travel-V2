/**
 * Reads the server's answer to the session check (requested only by PartnerAccessGate). The Node server is the
 * access boundary; this only decides which screen the Partner Room shows.
 * Anything other than a well-formed session never shows partner content.
 */

export interface PartnerSession { expiresAt: number; csrf: string }

export type SessionCheck =
  | { kind: "ok"; session: PartnerSession }
  /** No valid session (never signed in, signed out or expired): go to the entry form. */
  | { kind: "sign-in" }
  /** The server answered, but not with a session check (for example a web page from the wrong server). */
  | { kind: "unexpected" }
  /** The server reported a temporary problem. */
  | { kind: "unavailable" }
  /** The request did not reach the server. */
  | { kind: "network" };

const CSRF = /^[A-Za-z0-9_-]{43}$/;

export function isPartnerSession(value: unknown): value is PartnerSession {
  if (!value || typeof value !== "object") return false;
  const { expiresAt, csrf } = value as Record<string, unknown>;
  return typeof expiresAt === "number" && Number.isFinite(expiresAt) && typeof csrf === "string" && CSRF.test(csrf);
}

/** Classify a completed response. `body` is the raw text; it is parsed only when the server says it is JSON. */
export function classifySessionResponse(status: number, contentType: string | null, body: string, now = Date.now()): SessionCheck {
  if (status === 401) return { kind: "sign-in" };
  const json = /^application\/json\b/i.test(contentType ?? "");
  if (status >= 500 && !json) return { kind: "unavailable" };
  if (status !== 200 || !json) return { kind: "unexpected" };
  let parsed: unknown;
  try { parsed = JSON.parse(body); } catch { return { kind: "unexpected" }; }
  if (!isPartnerSession(parsed)) return { kind: "unexpected" };
  if (parsed.expiresAt <= now) return { kind: "sign-in" };
  return { kind: "ok", session: parsed };
}

/** Classify the session check's response. A failure to read the body counts as a network problem. */
export async function readSessionResponse(response: Response): Promise<SessionCheck> {
  let body = "";
  try { body = await response.text(); } catch { return { kind: "network" }; }
  return classifySessionResponse(response.status, response.headers.get("content-type"), body);
}

/** The entry form, returning here after sign-in. */
export function signInHref(location: Pick<Location, "pathname" | "search" | "hash">, expired = true): string {
  const returnTo = encodeURIComponent(location.pathname + location.search + location.hash);
  return `/partner-access?${expired ? "reason=expired&" : ""}returnTo=${returnTo}`;
}
