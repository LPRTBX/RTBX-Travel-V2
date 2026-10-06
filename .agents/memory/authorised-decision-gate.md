---
name: Authorised decision gate
description: How approval, disagreement, delay and scenario scoping are enforced in the Travel runtime engine.
---

The approval gate is passed only through `approveDecision(exec, exec.approvalRoleId, scenario)`; `returnDecision` records disagreement with a mandatory reason. `approvalRoleId` comes from the scenario's `governanceConfig.approvalRole` (falling back to the configured accountable role) and may differ from the accountable owner. Leaving `escalated` requires every escalation to be acknowledged. If mandatory approval was never recorded, acknowledgement only permits return to `approval-required`; it cannot authorise action or resolution. Scenarios with `humanApprovalRequired: false` act under delegated authority and skip the gate. Runtime communications/evidence/outcomes come from `getScenarioRuntimeRequirements` (deployment items filtered by `scenarioIds`; welfare cases only get `distressedGuestRestricted` communications).

**Why:** The engine previously let any caller move past the gate with no record, attached every deployment item to every scenario, and learning text claimed delivery/approval the trace did not show.

**How to apply:** New drivers, tests or views must call the decision functions rather than transitioning past the gate; derive learning statements from the trace; keep displayed simulation figures computed from the engine (see `evidenceSnapshot.ts`).
