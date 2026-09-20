---
name: Commercial resource boundaries
description: Rules for keeping internal and commercially restricted partner material out of a static external release.
---

Client-side access gates are presentation controls, not confidentiality controls. Restricted partner material must be absent from the external route graph, active import graph, and emitted bundle; hiding navigation cards is insufficient.

**Why:** A static SPA delivers its JavaScript and assets to anyone who can retrieve the application, so a bypassable gate cannot protect content that was shipped to the browser.

**How to apply:** Classify every partner-facing route and resource before release, keep the external manifest allowlisted, make source and bundle scans release-blocking, and add server-side authorization before reintroducing restricted content.