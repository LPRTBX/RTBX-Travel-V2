# Travel visual Simulation Lab

Adds the interactive Simulation Lab to the existing Execution Centre, alongside continuous simulation checks.

## Entry points

The panel lives in the existing Execution Centre at `/partner-room/operations?view=simulation`. Partner Room navigation, the landing page Evidence section, Validation and the Operations Centre all link to it. Existing routes and the guided replay remain available.

The panel drives the canonical `runtimeEngine.ts`. It does not introduce an independent execution state machine. The same configuration readiness checks govern its scenario selection. A visitor explicitly starts an isolated copy of the hotel preset or their saved deployment. No saved configuration, production record or remote system is changed.

## Controls and behaviour

- Scenario selection respects active scenarios, operating systems, roles and maturity.
- Runs contain 1, 10, 25 or 100 signals, with 1×–4× visual playback.
- Start, pause, resume, single step and reset control the local session.
- Manual decisions pause at the approval gate. Scripted test approvals are separately labelled.
- Injected escalation waits for acknowledgement, including in scripted mode.
- Withheld required evidence blocks closure until the visitor supplies synthetic evidence.
- Signals show stage counts, accountable role, state history and evidence capture.
- JSON export records conditions, actors and complete execution traces. Sessions are otherwise temporary.
- Approval is recorded against the scenario’s governance approval role; scenarios without an approval gate (Transport Disruption) act under delegated authority.
- Outcomes remain unmeasured. No vendor calls, real communications, real authorisation checks or capacity claims are made.

## Verification

- Application TypeScript check passed.
- 14 test files / 340 tests passed, including manual approval, evidence holds, escalation holds and configuration readiness.
- Production build and access/bundle boundary checks passed.
- Standalone preview uses the actual component and driver. DOM smoke exercised manual approval, missing-evidence recovery, escalation acknowledgement, pause/step/resume and a 10-signal completion.
- Cloud browser refused the local preview address (`ERR_BLOCKED_BY_CLIENT`), so a rendered browser layout review is still outstanding. The inline preview is supplied for direct interaction and visual review.
- No new package dependencies or lockfile changes are included in the application.

The standalone preview has the hotel preset only; navigation to the full Partner Room is available after the site update is deployed. The nightly GitHub reports remain separate from this browser session.
