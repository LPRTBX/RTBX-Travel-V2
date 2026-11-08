# JALDO Travel — isolated review workspace (synthetic)

A clearly labelled **synthetic** practical-support response workspace. It runs the real JALDO Core kernel in the browser; every
control is offered or refused by Core. It is **not** part of the Travel production build, the public routes, the Partner Room or
the guest app, and it is not deployed anywhere. Demo roles are a view selector, **not access control**. Nothing is sent, stored or published.

Out of scope for this slice: consent withdrawal after disclosure and the unsafe-guest story (designs live in Core `docs/architecture/`).

## The scenario this demonstrates
JALDO recognising a moment from permitted system signals, recommending a response, coordinating authorised action and reviewing the outcome, on one fictional case (Room 412 still unavailable). The default start is **system events first**; "Guest asks first" (review tools) keeps the original path, and the seven original review paths work from either start.
1. **Signals**: a fictional property-system event and a maintenance event, each with source, event time and facts. A signal desk (Travel-side adapter) validates each against Core's event envelope and handles duplicates, conflicts, stale readings, out-of-order arrival and insufficient evidence.
2. **Recognition and recommendation**: two independent, *fresh* sources (maximum ages configurable per source, re-evaluated whenever the clock moves and again at adoption; future-dated and invalid events refused; full timestamps so midnight is exact) agree the room is unavailable past its promised time with a long repair, and no help request is open, so a proactive check-in *may* be appropriate. Evidence and uncertainty are shown; a delay does not establish distress. Single sources, short repairs and a guest who already asked are not enough.
3. **Authorised decision**: only the Duty lead can open the check-in, with a recorded reason. The decision (who, when, reason, source references, rule version) is kept as a *demonstration decision record*, shown apart from Core's own evidence; Core has no adoption contract. Opening records one request addressed to the Duty lead through Core; nothing is approved, shared or released.
4. **Guest choice**: first "Would you like practical help?" (Yes / No thanks / no response are three different things; Yes shares nothing; agreeing to share never counts as accepting help; Core has no contract for this, so it is a demonstration record and gate). Then, before anything is shared, the guest sees the recipient, purpose and exact field values beside equal Allow / Do not allow choices.
5. **Core does the rest**: acceptance, plan, approvals, checks, handover, delivery, deadlines, feedback and follow-up are the pinned kernel's.
6. **Changed capacity, unresolved required check, negative feedback, no response**: the "Needs attention now" panel carries the responses Core would accept.
7. **Process review** for authorised review: what was recognised, timing, delivery evidence, guest outcome (delivery confirmation, feedback and resolution kept separate), unresolved work, and proposals that are not applied. Steps are described, nobody is scored.

**What is Core's and what is not, and which contracts are accepted, draft or missing: see [CORE-GAPS.md](CORE-GAPS.md).** Reused from JALDO-Travel-Guest PR #9 and its APP_LOOP_AUDIT: interaction lessons only, no code or local lifecycle engine. No AI model is connected; the recommendation is a fixed, versioned rule with fixed wording.

## Exact Core dependency
`core-pin.json` pins RTBX-Main commit `79939dcc69755353f5cdbdebc52dce4af05724c4` (draft PR #121, branch `feat/jaldo-os-bridge-commands`, contract 1.2.0).
Nothing in Travel's `package.json`, lockfile or `pnpm-workspace.yaml` references Core, so normal Travel install and CI are unchanged.

## Run locally
1. Check out RTBX-Main at the pinned commit as a sibling (`../../../../rtbx-main` from this folder) or set `JALDO_CORE_DIR`; in Core run `pnpm install --filter "@workspace/jaldo-orchestration..."`.
2. From `artifacts/welbx/workspace-harness`:
   - `node check-core-pin.mjs` — verifies commit, clean kernel directory, contract version
   - `node ../node_modules/vitest/vitest.mjs run --config vitest.config.ts` — 114 tests (workspace.test.ts, scenario.test.ts, hardening.test.ts)
   - `node ../../../node_modules/typescript/bin/tsc -p tsconfig.json`
   - `node ../node_modules/vite/bin/vite.js build --config vite.config.ts` (dist contains only index.html, assets and the approved logo)
   - `NODE_PATH=$(npm root -g) node scripts/verify.mjs` — Playwright run against `vite preview` on port 5320 using system Chromium (`CHROMIUM` env to override); 80 checks, writes `screenshots/`
   - `scenario.mjs` — the whole proactive scenario by clicks only (66 checks: signals, freshness, adoption reason and record, help question, recognition, privacy, adoption, guest choice, capacity, required check, feedback, no response, review)
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
