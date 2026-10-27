# JALDO Travel public / partner boundary

## Preview setup (not publication)

- Configure `TRAVEL_PARTNER_ACCESS_CODE` through the project's secure Secrets
  interface. Prefer a privately chosen, strong code of at least 16 characters
  (the entry form accepts up to 512). Never use a `VITE_` variable for this code.
- No default code exists. Missing configuration or fewer than 8 characters locks
  the room. Exact, case-sensitive matching permits the user's chosen shorter
  code; values are never trimmed or changed.
- While a secure code update is pending, set the non-secret
  `TRAVEL_PARTNER_ACCESS_PAUSED=true` to lock entry and existing sessions.
  After the user updates the secret through the secure interface, remove the
  pause (or set it to `false`), restart the preview and verify actual entry.
- Restart the managed `artifacts/welbx: web` workflow after configuring or
  changing the secret. A restart signs out every session.
- Public `/` and `/public-demo` remain usable while partner access is locked.
- Actual approved preview entry needs the configured secret. Automated tests
  use separate, loopback-only, ephemeral fixtures—not a preview bypass.
- Do not publish the old static service configuration. The updated artifact
  configuration starts the access-checking Node server and has no static
  public-directory handler.

## Production release condition

The owner confirmed **maximum machines = 1** in Publishing. Production is now
configured with `TRAVEL_PARTNER_ACCESS_PAUSED=false`; existing credentials are retained.
This machine limit is owner-confirmed, not independently exposed by deployment metadata.
If the limit becomes unverified or multiple machines are enabled, set the production-only
pause to `true` until shared access-state storage is implemented. Publishing with the
pause enabled keeps the public overview/sample available but denies partner entry,
private pages, bundles and downloads, including existing sessions.
Updating production environment settings does not change the already-running published
build until it is republished.

The available deployment metadata identifies Autoscale but does not expose or
allow changing its maximum machine count. In **Publishing → Adjust settings →
Machine configuration**, the owner must set and verify **maximum machines = 1**
before setting the production pause to `false` and republishing with partner access.
Do not interpret one running preview process as proof of production configuration.
If multiple machines are needed, implement shared sessions, one-use entry challenges,
revocation and atomic guessing limits before lifting the pause; a shared cookie
signing secret alone is not sufficient.

Manage invitations through **Tools → Secrets → TRAVEL_PARTNER_ACCESS_CODE**;
production-specific overrides are under **Publishing → Adjust settings →
Production app secrets**. Retain the working value unless deliberately rotating it.
Never copy it into source, browser storage, public pages or diagnostic output.

## Complete entry-point classification

**Public:** `/` (concise introduction / benefits / contact), `/public-demo`
(independent fictional sample), `/contact` and `/request-partner-access`
(contact section, manual request only), `/partner-access` (entry page).
`/healthz` contains only an availability flag. Four explicitly listed marketing
images/favicon are public. The old `opengraph.jpg` Partner Room screenshot is
protected, not a public marketing image. No public page imports the partner application.

**Legacy public arrival:** JALDO Main still links to the old `/partner-room`
home on the deployment alias. Anonymous requests to that exact home (with or
without a trailing slash) redirect to `/`, the public overview; they receive
no Partner Room content. Approved sessions keep the Partner Room home. Update
JALDO Main separately to link directly to `https://travel.wearejaldo.com/`
and use `/public-demo` for a public sample link, removing its obsolete
"Requires Partner Room access code" label for the public overview/sample.
This exception does not apply to invited deep pages or downloads.

**Protected:** every other address before any filesystem lookup or SPA fallback.
This includes all registered `/partner-room/*` pages/resources, the original
`/story`, `/story/operator`, `/story/guest`, all `/travel-*` aliases, the eight
journey destinations, deployment demos, calculators, evidence, simulation,
architecture, pilot/rollout, partner/commercial discussion and technical material.
All JS/CSS chunks, HTML, JSON, documents and downloads require a session too.
Removed/unknown bookmarks are not an exception: anonymous visitors see entry,
never a partner page. Authorized visitors retain the existing route/not-found
behaviour. Unapproved commercial source pages remain preserved but unregistered;
this change does not restore unreviewed commercial claims.

**Never served:** workspace source, dotfiles, Vite source endpoints and source
maps—even after entry. The canvas HTTP surface is disabled so its development
server cannot bypass the Travel boundary. The separate API artifact has only
a health endpoint; it stores or supplies no partner data.

## Security and session behaviour

The code stays server-side. Entry uses a one-use CSRF challenge and constant-time
hashed comparison. An opaque random session credential is delivered only as an
HttpOnly, Secure, SameSite=Strict, host-only cookie. It is not the access code.
The room expires after 30 minutes, checks expiry at every retrieval, shows
a leave-room control and revokes the session on leaving. Browser history restores
reload through the boundary. Protected responses are not cacheable.

Repeated entry is limited to five attempts per socket address per 15 minutes,
with an additional process-wide cap of 100. Forwarding headers cannot supply a
fake limiter address. A shared reverse-proxy address may conservatively share
the five-attempt limit between visitors.

Sessions and guessing limits are process-local and bounded. The preview is
one server. Before a multi-instance production deployment, adopt a shared
session/revocation and rate-limit store or explicitly use a single instance;
otherwise legitimate visitors may be signed out when another instance serves
their request. This shared-code room is not named-user identity, per-partner
permissions, live-guest authorization or an independently audited pilot system.

Partner demonstration state stays in page memory, not local/session storage.
Refresh, expiry and leaving end that state. Existing synthetic configuration
from the earlier storage implementation is removed, not restored. Approved
exports remain intentional downloads for authorized visitors.

## Checks

- `pnpm --filter @workspace/rtbx-travel run test:server-access`
- `pnpm --filter @workspace/rtbx-travel run test:partner-browser`
- `pnpm --filter @workspace/rtbx-travel run test:ui`

The browser scripts use the access-checking server with isolated test credentials.
They never start an unguarded Vite HTTP server. Run a final real-preview approved
entry / wrong-code / logout check after the secret is configured. Publication
requires separate approval; editing the preview does not protect an older
already-published static build or remove assets already copied by visitors.
