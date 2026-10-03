# JALDO Travel — simulation action and pilot evidence plan

Prepared 3 October 2026. Evidence classification: synthetic engine, mock adapters and scripted governance; Oracle documentation mapping and qualification harness. This document is a technical operating plan, not a live-hotel performance claim.

## Decisions arising from the testing

| Work item | Implemented control | Acceptance evidence | Accountable function |
|---|---|---|---|
| Missing scheduled executions | Hourly cadence observer, creation-time coverage ledger, stale-run recovery dispatch | Cadence artifact accounts for observations; dispatched recovery must subsequently complete | Engineering / platform operations |
| Saved learning proposals remain pending | Export final reviewer decision, timestamp, candidate snapshot, review ID and replay linkage alongside original proposal | Every saved replay links to an approved reviewed candidate and original execution | Engineering / governance lead |
| Corrections succeed only in their fixtures | Adversarial capability constraints, harmful candidate test, new signal cycle and two property configuration variants | Faults remain visible; changed conditions may still fail; no automatic promotion | Simulation owner / hotel operations lead |
| Missing follow-up and renewed complaints | Late-evidence reconciliation retains prior observation; new complaint creates a linked fresh execution and approval gate | Original evidence stays intact; missing evidence and unauthorised actions remain blocked | Hotel duty manager / evidence owner |
| Vendor readiness unknown | OHIP preflight retains blocked evidence when credentials are missing | Sandbox report classifies blocked, failed and passed checks explicitly | Integration lead / partner IT |

These are proposed responsibility assignments, not appointments of named people. Resolve the named owner at pilot kickoff.

## Cadence and recovery

The simulation requests hourly execution at minute 23 UTC. The observer runs at minute 47, on manual dispatch and after main simulation completions. It reads every page of simulation runs up to a bounded limit, deduplicates run IDs, keeps event types separate, and retains cadence JSON for 30 days.

Coverage entries use the run's creation time. GitHub's run API does not identify the original nominal cron slot; a delayed run cannot be attributed exactly. Empty matured buckets mean **no run observed**, with the cause explicitly unknown. Recent slots receive a grace period. Failed, cancelled and active records remain distinguishable. Push and PR runs cannot fill scheduled gaps.

If no successful scheduled/manual continuous run has been observed for more than 90 minutes, no main run is active and no continuous run was recently requested, the observer requests one 100-repetition recovery on main. An accepted dispatch is not a completed run. Recovery does not backdate or erase gaps. API read/pagination errors withhold recovery rather than assuming absence.

The observer has contents-read and actions-write permissions, no credential storage and a serial concurrency group. It checks out main only and never runs PR code with the recovery token. Existing simulation permissions stay contents-read.

Both GitHub cron triggers share platform risk. This mitigates gaps but cannot guarantee hourly operation. GitHub documents that scheduled jobs can be delayed or dropped under load: https://docs.github.com/en/actions/how-tos/troubleshoot-workflows

For an independent trusted scheduler, run `node artifacts/welbx/scripts/simulation-cadence.mjs` hourly with `GITHUB_REPOSITORY=LPRTBX/RTBX-Travel-V2`, a narrowly scoped server-side `GITHUB_TOKEN` granting Actions read/write, and `CADENCE_RECOVER=true`. Hosting and the scoped credential must be provisioned separately. Do not put tokens in browser code or commit them. The external script is ready; no independent host is provisioned by this change.

## Learning evidence and challenge matrix

`hotel-learning.json` schema v2 preserves both `proposed` and the final `proposal`. Reviewed records include reviewer, decision, review time, candidate snapshot and review ID. Each replay audit links the baseline execution, proposal/review, candidate and new execution. Changes after review are rejected unless reviewed again through a fresh proposal. These are mock records and correlation checks, not cryptographic attestation or authenticated human identity.

`hotel-learning-challenges.json` retains check results and selected comparisons:

- A response policy cannot overcome a simulated 35-minute resource floor.
- Two intervention/receipt attempts cannot satisfy a three-attempt fixture.
- An approved harmful candidate produces a measurable regression.
- Rejected/wrong reviewers cannot replay; post-review candidate changes are blocked.
- Delivered actions with failed restoration remain not met and open.
- Conflicting department approval and cross-case evidence are rejected.
- Later valid measurement can resolve the same pending case with its prior observation retained.
- A renewed complaint creates a fresh linked execution requiring approval.
- A new 100-signal cycle runs five fault profiles in two property configuration variants (1,000 additional challenge executions).

The variants reuse one synthetic property identity; tenant isolation remains untested. Challenge executions are separate from baseline and reviewed replay totals. Successful challenge checks can contain deliberately unsuccessful outcomes. Candidates never promote into production or train a model.

## First sandbox journey: arriving guest, room not ready

Demonstration target: an arriving reservation signal identifies a room-readiness conflict, routes the case to its accountable role, holds action for approval, coordinates housekeeping and guest communication, receives confirmations, measures the result and reviews an improvement.

| Step | Requirement | Current evidence | Sandbox/pilot acceptance |
|---|---|---|---|
| Reservation / arrival | Hotel, reservation/event IDs, version, observed time, status and room correlation | Synthetic PMS input; partial OHIP event mapping | Approved reservation query or configured business event is received and correctly mapped |
| Room readiness | Correlated room/housekeeping status and timestamps | Synthetic room delay; OHIP housekeeping read plan | Validate actual fields and status meanings; reject incomplete/stale data |
| Decision and approval | Named accountable role, server-side identity, permissions and approval record | Scripted engine gates | Real authorised reviewer approves; other roles/tenants are blocked |
| Action delivery | Housekeeping task and guest-message adapters, idempotent action IDs | Mock dispatch only | Actual sandbox acknowledgements and receipts correlate to the approved action |
| Follow-up outcome | Room-ready time plus guest/service confirmation | Synthetic receipt, restoration and 20-minute fixture target | Hotel agrees metric and SLA; receipt alone cannot assert resolution |
| Learning review | Failed result, candidate change, review and regression comparison | Reviewed isolated synthetic replays and challenges | Operations reviewer approves candidate; deployment requires a separate controlled release |

The existing OHIP smoke workflow verifies authentication and property reads only. It does not implement this complete journey. Reservation reads are optional until a bounded approved smoke path is configured; streaming events, task management, guest messaging and outcome capture remain separate gates. HTTP success alone does not establish payload compatibility.

Required partner inputs: approved sandbox/property, six server-side OHIP settings (`OHIP_GATEWAY_URL`, `OHIP_APP_KEY`, `OHIP_CLIENT_ID`, `OHIP_CLIENT_SECRET`, `OHIP_ENTERPRISE_ID`, `OHIP_HOTEL_ID`), permitted query/event configuration, sample payloads with agreed redaction, room/reservation correlation, housekeeping/task and messaging providers, accountable operational roles, delivery receipt semantics and follow-up measurement ownership. Do not send secrets in chat; configure the approved `ohip-sandbox` GitHub environment or equivalent secure runtime.

Exit from simulation to pilot requires actual sandbox evidence for the selected journey, identity/tenant gates, durable deduplication/retries, safe failure/recovery, receipt correlation and agreed measurements. Transport and marketplace activation remain out of the first journey and retain their explicit integration gaps.

## Daily decision report

1. Observed coverage: expected slots, actual scheduled completions, empty buckets, recovery requested versus completed and evidence limitations.
2. Changes: new check failures/regressions against a comparable commit baseline.
3. Unresolved cases: reason, age where recorded, proposed owner and next action; mark missing age/owner as unrecorded.
4. Learning: original outcome, final recorded review, replay result and challenge regressions; preserve pending/rejected records.
5. Integration asks: exact access/data/receipt/measurement gaps, classified as documentation, sandbox or live evidence.

Use actual artifacts for counts. Never infer executions from configured cadence, add representative traces to totals, or merge independent gate/outcome profiles. Every material item should end with an accountable function and a next action. Daily reports stay in ChatGPT; no partner messages are sent.

## Partner evidence pack

Show these in sequence:

1. The four input paths and 100 unique synthetic signals.
2. One baseline journey showing approval, communication, evidence and follow-up.
3. The retained final review and linked replay; then a challenge where the approved change still fails.
4. A pending case resolved by late evidence and a reopened complaint returning to approval.
5. Actual test and cadence artifacts, including gaps and recovery status.
6. The sandbox requirement table above and the hotel-defined pilot metric.

Permitted claim: “We have tested a configurable governed process with synthetic inputs, explicit gates, follow-up verification and reviewed mock learning. These are the integration and operational requirements to prove it in your hotel.”

Do not claim live hotel operation, verified vendor payload compatibility, autonomous learning, guaranteed cadence, authenticated human authority, concurrent capacity or real business ROI from these tests. Browser button/export verification is separate from engine tests.
