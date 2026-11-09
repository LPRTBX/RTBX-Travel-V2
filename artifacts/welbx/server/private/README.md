# Protected response workspace package

`response-workspace.html` is the owner-supplied, reviewed standalone build from Travel `f378fbb`, pinned to Core `79939dc`. It is kept outside `public/` and `dist/`. The server exposes it only at `/partner-room/response-workspace`, after the existing Partner Room session check. There is no static mount of this directory.

The JSON manifest records provenance and a SHA-256 integrity check. To update, rebuild and verify the standalone package through `workspace-harness`, replace the HTML, and update the manifest. Never patch the bundled kernel or application JavaScript. Normal Travel installation/build does not require private Core access.

The serving wrapper adds a return link and a session check on load, every 15 seconds, on visibility restoration and on pageshow. Session loss clears the page and returns to entry. In-memory demonstration progress resets on navigation or reload. The hosted wrapper contacts only the site's session endpoint; delivery remains simulated. The access code controls entry, not authenticated operational roles.

Preview: check out this branch in Replit, use the existing Run workflow, enter the Partner Room and select **Explore the response workspace**. Direct navigation and refresh use the same gate. No publication is needed for the development preview.

Validation: `node --test server/response-workspace.test.mjs` checks anonymous retrieval, approved retrieval, refresh/query/trailing slash, HEAD, cache headers, CSP hashes for every script/style, private file guesses, expiry and revocation. It is included in `test:server-access` and therefore Travel QA. The full original harness suite still requires the pinned Core checkout; these hosting tests do not replace it.
