---
name: Browser QA on Replit
description: Why upstream Playwright Chromium downloads are not enough on this Nix host.
---
Use the Replit-supplied compatible Chromium for local browser QA rather than adding system packages merely to run an upstream browser download. Preserve the default Playwright browser on GitHub CI.

**Why:** Installing the repository's locked Playwright dependency and its downloaded browser succeeded, but the browser could not launch because this Nix host lacks its expected shared libraries. The preinstalled Replit Chromium launched successfully without system or deployment configuration changes.

**How to apply:** Check for the supplied Chromium before attempting dependency or system changes. Run acceptance against the managed, proxied preview, not a separately spawned server, when proving what the user actually sees.
