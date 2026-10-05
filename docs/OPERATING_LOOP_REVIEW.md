# JALDO Travel — operating-loop review

Prepared 5 October 2026. Branch `claude/tender-pascal-ytza51`. Evidence classification: synthetic engine, scripted actors, local browser state. Nothing here is a live-hotel, vendor or measured-business claim.

The review exercised every implemented scenario through signal → interpretation → authorised decision → action → evidence → outcome → learning → next action, as a hotel operator, frontline employee, guest and group executive, in the source and in the running interface (desktop 1440 px and mobile 390 px).

## Who acts, with what authority

Generated from `TRAVEL_SCENARIOS`, `DEFAULT_DEPLOYMENT` and `getScenarioRuntimeRequirements`.

| Scenario | Accountable owner | Who decides | Decision deadline | Escalates to | Runtime requirements | First success measure | Learning review trigger | Preset |
|---|---|---|---|---|---|---|---|---|
| Repeat Guest — Room Not Ready | Duty Manager | Duty Manager | Within 10 minutes of signal receipt | Duty Manager | 6 required evidence · 5 drafts (2 need approval) | Time from signal to guest acknowledgement | Delay event recurs for the same room category more than twice in 7 days | Active |
| Distressed Guest | Duty Manager | Duty Manager | Immediate — no delay permitted | Safety and Security Lead, General Manager | 5 required evidence · 3 drafts (1 need approval) | Time from signal to Duty Manager escalation | Any welfare event where escalation reached Duty Manager outside the 2-minute window, or where automated communication was sent during the event | Inactive in preset |
| Service Backlog | Operations Manager | Operations Manager | Within 8 minutes of backlog alert | Duty Manager | 6 required evidence · 5 drafts (1 need approval) | Time from alert to backlog clearance | Backlog event recurs in the same operational window more than twice in 14 days | Active |
| Maintenance Defect | Maintenance Lead | Duty Manager | Within 12 minutes of defect report | Duty Manager, General Manager | 7 required evidence · 4 drafts (1 need approval) | Time from report to repair completion | Asset generates more than one defect report in 30 days, or repair ETA is consistently exceeded | Active |
| Transport Disruption | Guest Services | Delegated — Guest Services | Within 15 minutes of disruption verification | Duty Manager | 5 required evidence · 4 drafts (1 need approval) | Time from disruption to guest notification | Same route, carrier or time window generates more than two disruption events in 30 days | Inactive in preset |
| Premium Guest Opportunity | Revenue and Loyalty Lead | Revenue and Loyalty Lead | Within 10 minutes of opportunity signal | Duty Manager, Concierge | 5 required evidence · 4 drafts (1 need approval) | Offer delivered with consent confirmed | Decline rate exceeds threshold, or any case where an offer was delivered during an undetected welfare or recovery event | Inactive in preset |

**Delay:** at the approval gate, a missed decision escalates (welfare → the scenario's welfare escalation role; otherwise one level up, per rule gov-06). The case cannot resume or resolve until the receiving role acknowledges. **Disagreement:** the approver returns the case to decision with a mandatory reason; the reason stays in the trace and drives the learning output. **Delegated authority:** Transport Disruption has no approval gate; Guest Services acts and the trace says so.

Role views: the **operator** works the Operations Centre trace; the **frontline employee** is the owner of playbook steps and evidence items; the **guest** sees only guest-facing drafts in the Guest view (none for welfare cases); the **group executive** sees the proof summary, value dashboard and the Stage 3 portfolio walkthrough, which ends with unresolved responsibilities rather than a success claim.

## Defects found and fixed

| # | Defect | Effect before | Fix |
|---|---|---|---|
| 1 | Every execution inherited *all* deployment communications and evidence | Welfare cases drafted a guest "Recovery Offer"; maintenance cases required "Room readiness confirmation"; launch summary counts disagreed with the runtime | Optional `scenarioIds` on deployment communications, evidence and outcomes; welfare cases receive only restricted, human-authored drafts; added welfare, transport and premium items; one helper feeds both summary and runtime |
| 2 | Approval gate recorded nobody | Any `approval-required → in-action` transition passed; the comms approver was the accountable owner even where governance names another role (maintenance: Maintenance Lead vs Duty Manager) | `approveDecision` / `returnDecision` record role, time and gate entry; only the scenario's approval role may decide, once per gate; comms approval must come from that role |
| 3 | No disagreement path | An approver could only approve or escalate | `approval-required → decision-required` with a mandatory reason |
| 4 | Escalations could be left unacknowledged | Cases resumed or resolved; the Operations Centre said "acknowledgement not modelled" | Leaving `escalated` requires acknowledgement; UI offers "Acknowledge as <role>" |
| 5 | Lab and mock hotel forced approval on Transport Disruption | Contradicted its governance (no approval required); the Lab said "A person must decide" | Drivers honour delegated authority; mock hotel expectations are now 63 closed / 17 approval held / 20 evidence held |
| 6 | Learning text overclaimed | "All configured communications were delivered"; welfare "all actions human-approved" even when approval was bypassed by escalation | Learning derives every statement from the trace; adds review trigger, prioritised next action and an outcome-evidence label |
| 7 | Learning never reached the next cycle | Approved changes replayed one signal only | Reviewed proposals merge into one policy applied to 100 fresh cycle-2 signals; pending cases accept late evidence; Operations Centre can run cycle 2 with prior learning in view |
| 8 | Lab timeline mislabelled every `in-action` as "Test approval" | Post-escalation resumption looked like an approval | Timeline explains approval, delegated authority and acknowledgement separately |
| 9 | Layout | Simulation rail and panel headings rendered at page-h2 size (layered `!important` clamp); comparison grid had an empty cell; mobile rail select truncated | Scoped override in the same CSS layer; three-column comparison; single-column rail under 480 px |

## Implemented, simulated, required

Shown at the top of `/partner-room/operations`; figures are computed live from the engine (`src/simulation/evidenceSnapshot.ts`) and pinned by a test.

- **Implemented:** one engine across trace, Lab and mock hotel; enforced approval authority, disagreement and escalation acknowledgement; scenario-specific evidence gating closure; reviewed learning carried into the next cycle.
- **Simulated:** 100 signals / 4 paths → 63 closed, 17 held at approval, 20 held for evidence, 0 gate bypasses. Restoration target: 20 met in cycle 1 → 80 in cycle 2 after 60 reviewed changes; 20 stay pending because nothing measured them.
- **Required for a hotel:** PMS and housekeeping events (OHIP mapping drafted, sandbox credentials not configured); server-side identity and role permissions; task/messaging adapters with receipts, durable storage and deduplication; a hotel-agreed outcome metric and measurement owner.

## Verification

- `tsc` (app) and `test:simulation` typecheck: pass. Vitest: 24 files, 621 tests pass (new `src/lib/operatingLoop.test.ts`, 14 tests).
- `test:routes`, `test:links`, `check:legacy`, `check:assets`, access and bundle boundary checks, production build: pass.
- Browser (Playwright + bundled Chromium against the Vite dev server), desktop and mobile, no page errors, no horizontal overflow:
  - Build & Configure activation → room-not-ready trace: return without reason blocked; return with reason; re-route; approve as Duty Manager; escalate; resolve blocked until acknowledgement; drafts approved by the approval role; closure blocked until evidence; outcome recorded Not met; learning prioritises it; cycle 2 carries it.
  - Distressed Guest: only internal drafts, zero guest-facing; delay escalates to Safety and Security Lead. Transport: delegated authority, no gate.
  - Mock hotel batch: checks pass at 63/17/20. Learning loop: late evidence resolves a pending case; a rejected proposal stays rejected; cycle 2 shows 20 → 80 met, 40 → 0 not met, 40 → 20 pending.
  - Stage 3 executive walkthrough completes via the exception path with unresolved responsibilities listed.

## Remaining blockers

1. No server-side identity: a "Duty Manager approval" is a role string chosen in the browser.
2. No live data: OHIP sandbox credentials and approved property are not configured; housekeeping, task and messaging adapters do not exist.
3. No persistence or durable deduplication; sessions reset on reload except the saved configuration in localStorage.
4. Outcome measurement is a single synthetic follow-up metric; the hotel must define the real metric and owner.
5. Configurations saved before this change lack `scenarioIds`; their deployment-wide evidence still applies to every scenario until the user resets to the preset in Build & Configure.
6. The cross-property and group views (Stage 3) remain a planned-capability walkthrough, not engine-backed.

## Strongest demo sequence (about 12 minutes)

1. **Operations Centre → proof summary** (`/partner-room/operations`): what is built, what is simulated, what the hotel must supply.
2. **Build & Configure → Activate** — the configuration the runtime will enforce.
3. **Repeat Guest — Room Not Ready**: Receive → Validate → Route for approval. Read the authority panel. As Duty Manager, *disagree* ("Offer lounge access first"). Re-route, approve. Escalate, try to resolve (blocked), acknowledge. Approve and review drafts; switch to Guest view. Try to close (blocked), capture evidence, mark one outcome Not met, close. Read the learning; run cycle 2 and show the carried-forward action.
4. **Simulation Lab → Mock hotel**: run the 100-signal batch at 4× — 63 / 17 / 20 with every gate checked.
5. **Outcome and learning loop**: run 100 journeys; resolve a pending case with late evidence; reject one proposal; approve the rest; run cycle 2 — 20 → 80 met, 20 still pending for lack of measurement.
6. **Close on the requirement table** and the permitted claim: a configurable governed process tested with synthetic inputs, explicit gates, follow-up verification and reviewed learning — and exactly what is needed to prove it in your hotel.
