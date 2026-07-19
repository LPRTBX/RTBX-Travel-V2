---
name: Sprint 2 terminology baseline
description: Canonical term replacements, nav structure, and WELBX disambiguation after Sprint 2 alignment work
---

## Canonical replacements applied

| Legacy term | Canonical replacement |
|---|---|
| BXOS | RTBX Intelligence Engine |
| NEXUS | RTBX Routing Engine |
| VECTOR | RTBX Execution Engine |
| Travel Moment Engine | Context and Moment Layer (or "Travel Moment Intelligence" as subordinate title) |
| Travel Action Centre | RTBX Execution Centre — Travel Environment |
| Travel Value Engine | Evidence, Outcome and Value Layer |
| Value Engine | Evidence, Outcome and Value Layer |
| BXOS · Auto / WELBX Platform | RTBX Auto |
| welbx_intervention_usage localStorage key | rtbx_intervention_usage |

## WELBX disambiguation (critical)

WELBX appears in ~122 check:legacy occurrences after Sprint 2. Most are CORRECT:
- "guest via WELBX", "WELBX message", "WELBX guest-facing layer", "Guest App / WELBX" → all correct, leave alone
- Only wrong: WELBX as agentive system ("WELBX Platform", "WELBX Command Centre", "WELBX Workforce Genome") → replaced with RTBX Auto / RTBX Execution Centre / RTBX Intelligence Engine

Protected areas (never touch): Story/* routes (StoryGuestStory, StoryOperator), presentation/PresentationComponents.tsx

## Navigation structure (PartnerRoomLayout NAV_GROUPS)

5 groups after Sprint 2:
1. **Start** — Partner Room, Overview, Operator Brief
2. **Platform** — Operating Model, Travel Intelligence, Travel Operating Systems, Integration
3. **Configure & Execute** — Build & Configure, Execution Centre, Decision Spine, Communications, Evidence & Outcomes
4. **Proof** — Product Proof, Validation, Guest View, Operator View, Dual View
5. **Pilot & Partnership** — Pilot Model, Deployment, Commercial, Partner Ecosystem, Resource Library, Next Step

## check:legacy advisory counts

- Sprint 1 baseline: 361
- After Sprint 2 (Task #2): 122 (mostly legitimate WELBX-as-guest-layer)
- Non-fixable remainder: Story/* (14), envHealthScores.test.ts (1), Landing.tsx legacy (7), presentation slides (2)
- Legitimate WELBX-as-guest-layer: ~90 occurrences across resources/, demo pages, partner-room pages

**Why:** check:legacy does not distinguish correct WELBX usage from wrong usage. The advisory count will never reach 0 unless WELBX is renamed globally (out of scope for Sprint 2).
