---
name: GitHub Git transport
description: CLI API authentication and the origin's Git credentials may disagree.
---
Verify a preservation branch on GitHub before switching the checkout. A working GitHub CLI API session does not prove the configured origin's Git push credentials work.

**Why:** The original Git transport rejected its credential even though the authenticated GitHub CLI could inspect the repository. A clean GitHub HTTPS endpoint with the CLI credential helper successfully backed up the local history without modifying existing credentials or remote configuration.

**How to apply:** If API access works but pushing fails, use the authenticated CLI helper with a clean repository URL for that operation. Never print embedded credentials, force shared main, or proceed past the backup step until the remote ref matches the intended local commit.
