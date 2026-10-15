---
name: Commercial resource boundaries
description: Rules for keeping internal and commercially restricted partner material out of a static external release.
---

Client-side access gates are presentation controls, not confidentiality controls. Public viewing must be separate from the confidential Partner Room: a concise introduction, sample-only demo and manual contact/request-access path are public; detailed partner material requires server-verified entry before pages, assets or downloads are delivered.

**Why:** The user explicitly requested server-enforced access while preserving partner materials. A static SPA or ordinary Vite development server can deliver confidential content before a client code check. Publication is separately authorized; updating preview does not secure the already-published older build.

**How to apply:** Default new routes/files to protected. Keep the public page independent of partner imports, and serve partner chunks through the same server check as pages. Do not revert to static hosting or unguarded Vite preview. Secrets stay server-side, missing configuration fails closed, and shared-code preview access is not named-user permission for live data. Preserve exclusion of unreviewed commercial claims unless separately approved.

Verify cookie attributes in the actual managed preview and separately after any approved publication; application settings and loopback browser tests are not proof of delivered cookie attributes.

**Why:** The managed HTTPS preview browser received the Partner Room entry and session cookies with `SameSite=None`, although the server specified `Strict`. `Secure` and `HttpOnly` remained present, and actual entry/logout checks passed.

**How to apply:** Retain the stricter server setting and independent CSRF checks. Report the observed preview difference without assuming published cookies behave identically. Never print cookie values or access codes while inspecting attributes.

Secret-form confirmation is not proof that an existing secret was replaced with the user's intended value. A successful test using the saved secret verifies that saved value only.

**Why:** The user reported that the value in Secrets differed from their intended code even after secure-form confirmations and successful configured-secret entry tests.

**How to apply:** Explicitly request replacement rather than confirmation when a mismatch is reported. Do not claim the saved secret matches a code from chat or reproduce either value. Keep preview partner access paused during the secure update, then test the saved value and distinguish preview from publication.