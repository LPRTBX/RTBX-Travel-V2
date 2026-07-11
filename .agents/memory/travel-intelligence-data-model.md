---
name: Travel Intelligence data model
description: Where the RTBX Travel Intelligence content lives and the route/naming convention used for it
---

`src/data/travelIntelligence.ts` in the welbx artifact holds the structured content (signal taxonomy, moment taxonomy, governance sources, role model, AI assistant boundary, outcome model, value model, integration map) rendered by the Travel Intelligence page. Extend this file's typed arrays rather than hardcoding new content in the page component.

## Route convention
This app's routes all live under `/partner-room/*` and `PartnerAccessGate` wraps the whole router (not scoped per-path). When a directive asks for a bare top-level route (e.g. `/travel-intelligence`), add it as a thin alias pointing at the same component alongside the canonical `/partner-room/...` route, rather than breaking the nav/access-gating convention.

**Why:** Keeps sidebar nav, breadcrumbs and access gating consistent for all pages while still satisfying literal route requests from directives.
