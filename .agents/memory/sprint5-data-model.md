---
name: Sprint 5 data model decisions
description: Canonical data files, type conventions, validation patterns and constraint rules introduced in Sprint 5 of the RTBX Travel Partner Room.
---

## Sprint 5 canonical data files

Four new data files, all synthetic, no backend:

- `travelPartnerEcosystem.ts` — TravelPartnerLane (6 lanes), PARTNER_OWNERSHIP_MATRIX, RTBX_OWNED_CAPABILITIES, CUSTOMER_OWNED_CAPABILITIES, PARTNER_SELECTION_CRITERIA, PARTNERSHIP_PATHWAY_STAGES
- `travelPilotModel.ts` — PilotStage (7: explore→expand), PILOT_OPERATING_SYSTEMS, PILOT_SCENARIOS (3 primary + 1 optional), PILOT_SUCCESS_MEASURES, READINESS_CHECKLIST, EXPANSION_STAGES, DEPLOYMENT_PACKAGE
- `travelCommercialModel.ts` — CommercialStatus enum, CommercialSourceStatus enum, COMMERCIAL_COMPONENTS (all mandatory:false), VALUE_FRAMEWORK, COMMERCIAL_PROOF_BOUNDARIES
- `travelDeploymentPathway.ts` — IntegrationRecord (9 systems), DEPLOYMENT_RESPONSIBILITIES (12 activities × 5 parties)

## Critical constraints (enforced by types + tests)

- `marketplace-loyalty-activation-os` must always be `role: "expansion-only"` in PILOT_OPERATING_SYSTEMS. Validated in tests.
- All commercial components must have `mandatory: false`. Status type is `CommercialStatus` — never unlabelled.
- `connector-ready` is NOT in the `IntegrationMaturity` type. Deliberately excluded.
- No integration can claim `production` maturity with `proof: "none"`. Validated in tests.
- Revenue-share and transaction components must carry `unapproved` sourceStatus with explicit note.
- Partner lanes must have `maturityNote` and must never claim `production` maturity (no confirmed partnerships).

**Why:** Spec section 33 requires accurate maturity labelling throughout. Any claim not backed by evidence is a compliance issue for the partner environment.

## Validation architecture

`validateSprint5()` from `src/lib/validateSprint5.ts` → `ValidationResult { passed, errorCount, warningCount, issues }` (same type as Sprint 3/4). Tests in `validateSprint5.test.ts` (74 tests, total suite 232). Master test: `result.errorCount === 0`.

## Readiness checklist interactivity

READINESS_CHECKLIST items have `defaultState: ReadinessState`. The page component (`PartnerPilotModel.tsx`) cycles state on click via `useState`. Not persisted — session only.

## Deployment package boundary

`DEPLOYMENT_PACKAGE` in `travelPilotModel.ts` includes a `productionOnly: true` section. This section is described at requirements level only — not presented as delivered capability. Validated in tests.
