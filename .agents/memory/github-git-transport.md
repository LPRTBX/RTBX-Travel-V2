---
name: GitHub Git transport
description: CLI API authentication and the origin's Git credentials may disagree.
---
Use normally configured GitHub access only. A working GitHub CLI API session does not prove the configured origin's Git push credentials work. Do not extract tokens, inspect credential files or use credential-bearing URLs.

**Why:** API access and origin Git transport have behaved differently in this environment. After the HTTPS origin failed, the owner explicitly authorised the already authenticated GitHub CLI's standard credential helper with a clean HTTPS repository URL, provided the account and repository permissions were verified first.

**How to apply:** Verify GitHub CLI's account is the intended repository owner and has push permission. The authorised operation-only helper is `git -c credential.helper= -c 'credential.helper=!gh auth git-credential'` against `https://github.com/LPRTBX/RTBX-Travel-V2.git`; it does not modify global credentials. Verify the exact remote SHA after preservation. If this supported access fails, stop and report the precise authentication action required. Never force shared main, discard history or claim backup status proves merge/deployment parity.
