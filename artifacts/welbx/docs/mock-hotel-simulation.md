# Harbour mock hotel: 100 readings across four paths

The existing Travel Simulation Lab now includes a mock hotel profile at `/partner-room/operations?view=simulation`. The single-scenario lab remains available. All execution records use the existing Travel engine and its validated deployment snapshot.

## Hotel and signal matrix

100 synthetic rooms (101–200), 76 occupied, 16 arriving reservations and eight departures form the operational fixture. This is not a complete PMS, billing or hotel-management product. No vendor requests, live messages, bookings, folio writes or device commands are dispatched.

Each input path has 25 distinct readings: five event kinds with five different payloads, room/guest correlations and test conditions. Every input has a schema version, hotel ID, unique event ID, source path, event kind, room, synthetic guest ID, timestamp and payload. The JSON signal catalogue is exported with every automated run.

| Path | Mock input fields | Hotel function / canonical pathways |
|---|---|---|
| PMS / reservations | reservationId, delayMinutes | Room delays and assignment conflicts, service requests, transfers, rooms out of service |
| Guest requests | requestId, message | Room readiness, service, defects, welfare and missed transfers |
| Staff operations | staffId, taskId, backlogMinutes | Housekeeping, task queues, defects, welfare observations and shuttle delays |
| Room / building sensors | sensorId, value, unit | Temperature, water leaks, HVAC, lifts and locks routed to maintenance |

The paths are synthetic adapters, not confirmed Oracle, messaging, CMMS or IoT API contracts. Vendor mapping must separately establish identifiers, timestamps/timezones, event versions, authentication, privacy, units/thresholds, retry limits and idempotency scope. The sensor fixtures are preclassified alerts; they do not verify physical sensor thresholds. Production tasks and messages still require actual connectors and delivery receipts.

## Expected results

Each complete 100-signal batch expects 60 closed synthetic executions, 20 held at approval-required and 20 held at resolved with missing required evidence. Twenty of the closed signals include an injected and scripted-acknowledged escalation. Expected holds pass their gate checks; they are not engine failures. All completed outcomes stay `not-measured`. Scripted actors do not verify server-side human identity.

The suite checks input validation and room/guest correlation, canonical routing and owners, snapshot isolation, event duplicates/conflicts, simulated outages/recovery, held approvals, missing evidence, escalation, closure and terminal-state behavior. Deduplication and retries are in-memory mock behavior only, not durable production guarantees.

## Continuous operation

- Browser: start the hotel profile and select **Repeat complete batches**. Disconnect a source to hold its queue, then reconnect. Other paths continue. Each failed batch stops automatic replay. The current cycle and up to 20 recent cycle summaries are exported with **Export hotel run**. Switching labs or closing the page ends that browser session.
- GitHub: `.github/workflows/travel-simulation.yml` is prepared to run hourly at minute 23 UTC, on relevant main pushes/pull requests and on manual dispatch. Scheduled runs use the default branch; the change must reach main to activate the new schedule. GitHub may delay schedules. This is recurring batch verification, not an always-on service.
- Scheduled/manual default: 100 repetitions per reading, giving 10,000 hotel executions plus the existing scenario replay checks. Pull-request/main-push default: 10 repetitions, giving 1,000 hotel executions. These are sequential engine checks, not a concurrency or capacity benchmark.
- Each workflow uploads JSON reports, a 100-signal catalogue, traces, pass/fail records and a readable summary for 30 days, including available evidence on failure. Missing/setup-failed reports do not constitute a pass. Check GitHub Actions failure notifications for the account; notification settings are not changed by this implementation.

Local command after locked dependency installation:

```sh
pnpm run typecheck:libs
SIMULATION_REPETITIONS=100 pnpm --filter @workspace/rtbx-travel test:simulation
```

Select 1, 10, 100 or 1000 repetitions. Reports are written to `artifacts/welbx/simulation-results/` and ignored by git. Keep a baseline report for the release, investigate failures before deployment and add a regression case whenever a real partner contract or new pathway exposes a gap.

## Verification of this change

The complete unit suite, shared-library build, application/simulation typechecks, production build and access/bundle checks are run locally. Interactive browser verification could not be completed in this workspace: the browser binary download failed and the cloud browser blocks local preview URLs. The pure driver behind browser playback is covered by batch drain and disconnect/reconnect tests; visual review and actual button/export behavior still require preview verification before publishing.

## Outcome and learning cycle extension

The original 100-signal intake profile remains a gate test. A second profile reuses the same 100 readings and canonical engine to test what happens after receipt. The Hotel Lab includes **Run 100 outcome journeys**, baseline traces, proposed changes, explicit approve/reject controls, before/after results and an evidence export.

Each journey follows intake → understanding → accountable decision → scripted approval → mock action → correlated follow-up → outcome assessment → escalation or closure → improvement proposal → reviewer decision → isolated replay. Follow-up must match the event, execution, action and policy version. Dispatch cannot repeat and unapproved changes cannot replay.

The additional synthetic metric requires delivery confirmation, measured restoration and a response within 20 minutes. It is a generic fixture metric, not a claimed hotel standard or welfare protocol. Other deployment outcome metrics stay unmeasured. Per batch, five fault profiles appear 20 times each across the four paths:

| Profile | Baseline outcome | Next step |
|---|---|---|
| Successful action | Met; closed | Retain evidence |
| Late response | Not met; closed after restoration | Review faster mock response and replay |
| Ineffective action | Not met; stays in action | Escalate, review second intervention and replay |
| Missing receipt | Pending; stays in action | Escalate, review receipt retry and replay |
| Missing follow-up measurement | Pending; stays in action | Request measurement; no improvement inferred |

The fixtures yield 20 met, 40 not met and 40 pending baseline outcomes. Sixty reviewed replay cases become met; twenty missing-measurement cases remain pending. This is deterministic synthetic evidence, not a measured service improvement. Failed expectations fail the suite even though deliberately injected operational faults are expected to pass their tests.

Learning candidates are in-memory copies only. They never edit the deployed configuration, train a model or promote a production policy. Approval identity remains scripted. A new replay keeps the original failed execution intact. Real connectors, correlated vendor receipts, authentic reviewer permissions and production release gates need separate integration verification.

`test:simulation` includes this suite automatically. The existing hourly workflow publishes `hotel-learning-summary.md` and retains `hotel-learning.json` with actual execution counts, outcome totals, review proposals and representative baseline/replay traces. Each scheduled 100-repetition run adds 10,000 baseline journeys and 6,000 reviewed replays alongside the original hotel tests. Do not add representative trace counts to execution totals.

Daily reporting should read the new artifact when present, distinguish baseline outcomes from replay outcomes, separate gate-profile holds from follow-up-profile holds, and flag missing reports as unverified. The extension must reach main before hourly runs can exercise it.
