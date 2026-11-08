# JALDO Travel — isolated review workspace (synthetic)

A clearly labelled **synthetic** practical-support response workspace. It runs the real JALDO Core kernel in the browser; every
control is offered or refused by Core. It is **not** part of the Travel production build, the public routes, the Partner Room or
the guest app, and it is not deployed anywhere. Demo roles are a view selector, **not access control**. Nothing is sent, stored or published.

Out of scope for this slice: consent withdrawal after disclosure and the unsafe-guest story (designs live in Core `docs/architecture/`).

## Exact Core dependency
`core-pin.json` pins RTBX-Main commit `79939dcc69755353f5cdbdebc52dce4af05724c4` (draft PR #121, branch `feat/jaldo-os-bridge-commands`, contract 1.2.0).
Nothing in Travel's `package.json`, lockfile or `pnpm-workspace.yaml` references Core, so normal Travel install and CI are unchanged.

## Run locally
1. Check out RTBX-Main at the pinned commit as a sibling (`../../../../rtbx-main` from this folder) or set `JALDO_CORE_DIR`; in Core run `pnpm install --filter "@workspace/jaldo-orchestration..."`.
2. From `artifacts/welbx/workspace-harness`:
   - `node check-core-pin.mjs` — verifies commit, clean kernel directory, contract version
   - `node ../node_modules/vitest/vitest.mjs run --config vitest.config.ts` — 32 tests
   - `node ../../../node_modules/typescript/bin/tsc -p tsconfig.json`
   - `node ../node_modules/vite/bin/vite.js build --config vite.config.ts` (dist contains only index.html, assets and the approved logo)
   - `NODE_PATH=$(npm root -g) node scripts/verify.mjs` — Playwright run against `vite preview` on port 5320 using system Chromium (`CHROMIUM` env to override); 80 checks, writes `screenshots/`
   - `node scripts/shots.mjs` (390/820/1440 screenshots of the reviewed presentation with an overflow check, into `screenshots/review-2/`, not committed) and
   - `node scripts/package-single.mjs` — after a build, writes ONE self-contained file, `dist-single/jaldo-travel-review-workspace.html` (script, styles and the approved logo embedded; no network, no external URL). It runs the same Core kernel bundle by double-clicking the file (file://).
   - `VERIFY_FILE=dist-single/jaldo-travel-review-workspace.html NODE_PATH=$(npm root -g) node scripts/verify.mjs` / `verify-review.mjs` / `walkthrough.mjs` — the same browser checks run against the packaged file itself (`verify-review.mjs` covers keyboard order and focus visibility, reviewer/role separation, the holder-history leak, and the Core-pin and synthetic-data boundary; `walkthrough.mjs` is the four-step walkthrough below, by clicks only).
   - `node ../node_modules/vite/bin/vite.js --config vite.config.ts` for interactive use (port 5320).

## Reviewed presentation (ported from the reviewed standalone file into the source)
Collapsed review tools (role selector, synthetic facts and the reviewer guide sit in one disclosure above the role view; the summary names the role being viewed), a short role introduction, mobile task cards for the tables (≤600px), a "Needs attention now" panel for the Duty lead (open guest follow-up, unresolved required check, expired deadline, all from Core's own coordination record and `deadlineExpired`), separate "Required checks" and "Related work · stays open separately", and plain guest wording about sharing ("Choose what to share with Reception", "Allow Reception to see these details"). Only wording and layout changed: the commands, Core's refusals, projections and role isolation are as before. The role view no longer shows the hero photo, so the packaged file embeds only the logo.

**Deadline finding.** The Duty lead's "Move the due time by 30 minutes" control set the new due time to *now* + 30 minutes, not the recorded due time + 30. On the guest-response deadline (due 10:30, clock 09:00) it silently moved the due time *earlier*, to 09:30, while the row still read "within 90 minutes of delivery". Core was correct (it accepts any later instant and records the move). The control now moves the recorded due time 30 minutes later and states the target ("…to 11:00 UTC"), and each deadline row shows the recorded due time plus any move ("moved 10:30 → 11:00 UTC (a material change)"); Core's configured expectation ("within 90 minutes of delivery") is kept in a separate "How due times are set" disclosure rather than as if it were the due time. Regression tests cover the arithmetic and the display.

## Short walkthrough (what `scripts/walkthrough.mjs` automates)
1. Normal journey: click only the highlighted "Your next step"; switch role when the page names who is waiting.
2. Capacity withdrawn after approval: reviewer guide → *Capacity withdrawn after approval* → "Housekeeping unavailable". Core withdraws the handover approval, refuses release and re-approval (with its reason) and asks the Duty lead to renew the check; "Housekeeping available", then follow the next steps to delivery.
3. "Did not help": guide → *Guest says "did not help"* → Guest → "Still needs support". Delivery evidence is unchanged; the Duty lead gets the follow-up; the guest sees "Your response was recorded".
4. Maintenance independent: guide → *Support completes while maintenance stays open* → Duty lead sees the repair (WO-1182) listed separately and open; Maintenance sees only its own work.

## All seven paths
Open the **Reviewer guide** (outside every role's view) and pick a path; each path applies real Core commands as the roles that would take them.
1. Normal journey — follow only the highlighted "Your next step", switching role when the page says who is waiting.
2. Missing approval prerequisite — the handover cannot be approved; Core says what is outstanding.
3. Capacity withdrawn after approval — approval withdrawn, release refused; renewing the check restores it.
4. Required safety dependency — release of the handover is blocked until the linked clearance is resolved.
5. Guest says "did not help" — delivery evidence is kept; an owned review is created.
6. No response — advance the clock; the response is unknown (not "no"), one overdue item, no repeats.
7. Support completes while maintenance stays open — repair is tracked independently.
"What Core would refuse from this role now" lists refusals with Core's reason; "History in detail" is holder-only.

## What is and is not covered
- Covered locally: the commands above (vitest, Playwright). Includes the regression for the holder-history leak found in the spike, Housekeeping seeing no guest fields, feedback not overwriting delivery evidence, due times belonging to the viewing role, 390/820/1440 overflow, text size, keyboard focus.
- **Not covered by Travel CI:** this folder is not a workspace package and CI does not run it. Running it in CI needs read access to the private RTBX-Main repository (e.g. a repository-scoped read-only deploy key — a decision for the owner; no credential was created).
- Not checked: screen-reader testing, real authentication, real channels, real delivery. These are operational-readiness gaps.
