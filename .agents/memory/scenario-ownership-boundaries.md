---
name: Scenario ownership boundaries
description: Durable ownership and validation rules for scenario exploration, configuration, and execution.
---

The Travel Scenario Library is read-only and owns stable scenario detail URLs. Build & Configure owns scenario selection, prerequisite validation, and explicit activation. The Execution Centre is the only scenario runtime.

Activation and runtime readiness must share the same canonical prerequisite checks for scenario, operating system, accountable role, playbook, and runnable maturity. Runtime records must snapshot the validated deployment configuration rather than reconstructing a competing page-local model.

**Why:** Separate local runners and looser activation checks make synthetic demonstrations disagree about what is configured, runnable, approved, or evidenced.

**How to apply:** New scenario links should use the shared route helpers. New configuration fields that affect execution must be validated before activation and carried into the Execution Centre record. Replays and role views may visualize execution, but must not create an independent state machine.