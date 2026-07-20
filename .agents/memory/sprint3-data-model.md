---
name: Sprint 3 Data Model Decisions
description: Key decisions about how S3 canonical fields were added alongside legacy fields in travelScenarios.ts, and how the four data files relate to each other.
---

## Rule
Legacy fields in `travelScenarios.ts` (signals, roles, comms, evidence, outcome, learning) were PRESERVED as-is. Canonical Sprint 3 fields were added under NEW names alongside them (`signalDetails`, `rolesConfig`, `communicationDetails`, `escalation[]`, `evidenceRequirements[]`, `outcomes[]`, `learningConfig`, `proof`). This keeps the ScenarioRunner UI working without modification.

**Why:** ScenarioRunner's interactive demo depends on the exact legacy field names. Renaming them would require rebuilding the runner or breaking the demo. Adding parallel fields was safer and keeps both layers independent.

**How to apply:** Any Sprint 4 work that adds new canonical fields should follow the same pattern: extend the interface with new optional fields, never rename or delete existing ones until the runner is formally replaced.

## File Relationships
- `travelScenarios.ts` — source of truth for `MaturityStatus` type; also exports `VALID_MATURITY_STATUSES`, `MATURITY_LABELS`, `MATURITY_COLORS`
- `travelOperatingSystems.ts` — imports `MaturityStatus` from `travelScenarios`; exports `OS_POSITION_LABELS`, `OS_POSITION_COLORS`
- `travelPlaybooks.ts` — NEW in S3; imports `MaturityStatus` from `travelScenarios`
- `travelRoles.ts` — NEW in S3; standalone, no imports from other data files
- `playbooks.ts` — UNTOUCHED; backs MomentIntelligence and OperationsCentre pages

## Validation
`src/lib/validateSprint3.ts` — 41-test suite covering all four data files for referential integrity. Run with: `pnpm --filter @workspace/welbx test`

## Marketplace OS is Prototype-Stage
`marketplace-loyalty-activation-os` and its only scenario (`premium-guest-opportunity`) and playbook (`pb-premium-guest-opportunity`) all carry `maturityStatus: "prototype"`. The other 4 scenarios and 5 playbooks are `"working-proof"`. This is intentional — Marketplace is not a pilot entry point.

## Position Field
OS positions: `guest-experience-os → lead`, `service-recovery-staff-response-os → lead`, `operator-intelligence-os → lead`, `safety-guest-welfare-os → cross-cutting`, `marketplace-loyalty-activation-os → expansion`.
