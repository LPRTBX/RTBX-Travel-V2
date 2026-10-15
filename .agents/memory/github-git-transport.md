---
name: GitHub Git transport
description: CLI API authentication and the origin's Git credentials may disagree.
---
Use normally configured GitHub access only. A working GitHub CLI API session does not prove the configured origin's Git push credentials work. If Git authentication fails, stop remote sync and report the failure; do not extract or repurpose credentials or attempt alternate authentication.

**Why:** The owner explicitly required stopping a failed GitHub sync rather than trying credential workarounds. API access and origin Git transport have behaved differently in this environment.

**How to apply:** Preserve the original branch and a named local backup. If requested, prepare a separate tested local candidate without claiming it is remotely backed up. Report push and PR creation as blocked until the owner restores normal Git authentication. Never force shared main, discard history or claim backup status proves merge/deployment parity.
