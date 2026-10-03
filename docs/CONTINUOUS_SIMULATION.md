# JALDO continuous simulation — Travel first implementation

The simulation workflow runs from main. Engine-only changes require no site deployment. Scheduled execution is best effort; observed coverage must be checked separately.

## Run and inspect

Use the repository's pinned pnpm 10.26.1 and Node 24:

```sh
pnpm install --frozen-lockfile
pnpm --filter @workspace/rtbx-travel test:simulation
SIMULATION_REPETITIONS=100 pnpm --filter @workspace/rtbx-travel test:simulation
```

Choose 1, 10, 100 or 1000 repetitions per scenario. The six configured scenarios run against the existing `runtimeEngine.ts`, deployment configuration and canonical playbooks. Dormant scenarios are enabled in test copies only. No configuration is written back.

GitHub Actions → **JALDO Travel continuous simulation** → **Run workflow** allows a volume choice. On relevant pushes and pull requests, 10 executions per scenario run. The hourly schedule requests 100 per scenario at minute 23 UTC. GitHub scheduling is not an exact-time guarantee. The workflow has a 15-minute limit and read-only repository permissions.

Each run creates `artifacts/welbx/simulation-results/travel.json` and `summary.md`. The workflow attaches these for 30 days and displays the summary even when tests fail. Setup failures are reported separately if no simulation results exist. Local results are ignored by Git.

## What is measured

- Completion through the same execution reducer used by the demonstration.
- Exact state sequence, configured owner, blocked invalid transitions and evidence-dependent closure.
- Communication approval gates, escalation recording and acknowledgement.
- Repeated execution counts, transition counts, simulated communication counts and rejected attempts.
- Local elapsed time and p95 per scenario. These include assertions and represent sequential in-process exercises, not concurrent users, server throughput or live service latency.
- Burst execution/evidence identifier uniqueness, missing scenario rejection and mismatched playbook rejection.
- No mutation of the shared deployment fixture.

The input matrix and logical clock are fixed for replay; execution IDs deliberately remain unique. Re-run the same commit with the same repetition count. Timing and IDs will differ. Each JSON result carries scenario/deployment identity and the final repetition's transition trace. Assertion failures produce a failed check and a non-zero test exit.

All actors, evidence and communications are synthetic. Passing a scripted approval step does not verify a person's identity or permissions. The original reducer gate suite records deployment outcomes as `not-measured`. The separate hotel-learning suite measures one synthetic follow-up metric. No external messages or vendor calls occur.

## Shared evidence format

`jaldo.simulation.v1` contains vertical, evidence level, commit, run timestamps, repetition count, summary, per-check results and explicit untested areas. This is the proposed common output contract for future Health, Assure, Enterprise, Sport and Hub adapters. It is not yet an aggregator or a cross-site deployment.

## Next coverage work

1. Inspect each vertical's server-side paths and add its engine adapter and workflow.
2. Verify backend identity, role/tenant boundaries, approval records, persisted outcomes and escalation deadlines independently of the demo UI.
3. Define incoming API contracts with required identifiers, timestamps, schema versions, validation failures and idempotency rules. Then test missing fields, duplicates, timeouts, retries and recovery against real adapters in an isolated environment.
4. Add browser journeys and synchronisation checks across role views.
5. Connect vendor sandboxes; label vendor contract results separately from simulated results.
6. Add controlled concurrency tests and actual API/token/infrastructure metering before making capacity or cost claims.

## Defect found by this suite

Execution IDs previously used scenario ID plus milliseconds. A 100-event burst at the same timestamp produced a single repeated ID, also duplicating related evidence IDs. The engine now uses `crypto.randomUUID()` so simultaneous executions do not overwrite or confuse one another by sharing a timestamp-derived identifier. This does not implement incoming-event deduplication; that remains an adapter responsibility.

## Coverage, reviewed learning and pilot progression

See [SIMULATION_ACTION_AND_PILOT_PLAN.md](SIMULATION_ACTION_AND_PILOT_PLAN.md) for cadence recovery, review evidence, challenge coverage and the first sandbox journey.
