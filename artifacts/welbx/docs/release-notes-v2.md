# RTBX Travel Partner Room — Release Notes v2.0

**Release:** Post-Sprint-6 QA correction pass  
**Version:** 2.0  
**Date:** July 22, 2026  
**Environment:** Demonstration (not production)  
**Commit:** Sprint 5 — Tasks #18–22  

---

## Product Purpose

The RTBX Travel Partner Room is a working demonstration environment for the RTBX Travel operating intelligence platform. It is built for partner evaluation sessions, pilot alignment meetings, and investor briefings. It shows how RTBX Travel deploys across hotels, resorts, holiday parks, corporate travel, events and venues, and destination tourism.

The Partner Room demonstrates how a real-time signal-to-action infrastructure layer connects signals from across a travel property, classifies moments, routes decisions through governance-aware playbooks, and produces evidenced outcomes — all without replacing existing systems.

---

## Major Capabilities in This Release

### 1. Execution Centre (Full Working Proof)

The RTBX Execution Centre provides an end-to-end demonstration of the RTBX Travel signal-to-action pipeline:

- **Build & Configure** (9-stage deployment configuration wizard) — set up deployment context, operating systems, integrations, roles, governance, and scenarios before running
- **Scenario Runtime** — launch any active scenario and step through the full `Connect → Understand → Decide → Act → Learn` trace
- **Action Centre** — 12 synthetic moment cards with status progression, linked communications, evidence, and outcomes
- **Outcome Ledger** — 12 outcome records with guest confirmation, operator outcome, and commercial outcome
- **Evidence Ledger** — 14 evidence records across scenarios
- **Value Dashboard** — running value estimates across scenarios
- **Three views**: Guest View, Operator View, Dual View (both panes sharing consistent execution state)
- **Learning output** — generated at scenario close from evidence quality, escalation pattern, and outcome data

### 2. Travel Intelligence (7 Scenarios, 5+ Playbooks)

Seven canonical scenarios across the full Operating System stack:

| # | Scenario | OS | Maturity |
|---|---|---|---|
| 1 | Repeat Guest — Room Not Ready | Guest Experience | Working Proof |
| 2 | Distressed Guest (Welfare) | Safety & Guest Welfare | Working Proof |
| 3 | Service Backlog | Service Recovery & Staff Response | Working Proof |
| 4 | Maintenance Defect | Service Recovery & Staff Response | Working Proof |
| 5 | Transport Disruption | Guest Experience | Simulation |
| 6 | Premium Guest Opportunity | Marketplace & Loyalty Activation | Simulation |
| 7 | VIP Arrival | Guest Experience | Working Proof |

Each scenario displays: trigger conditions, signal details, governance config, decision logic, action steps, communication templates, escalation rules, evidence requirements, outcome metrics, learning configuration, and maturity/proof status.

### 3. Partner Ecosystem (6 Lanes)

Full partner ecosystem model with:
- 6 partner lanes: Signal, Governance, Intervention, Technology, Deployment, Distribution
- Contribution matrices (partner/RTBX/customer) for each lane
- Ownership boundary: 20+ RTBX Core capabilities, 10+ customer capabilities
- Partnership pathway (5 stages: Identify → Align → Pilot → Prove → Expand)
- 4 selection criteria categories with detailed criteria
- Commercial model options per lane (all indicative, subject to agreement)

### 4. Pilot Model (7 Stages)

Detailed pilot model covering the full deployment lifecycle:
- 7 stages: Explore → Align → Configure → Pilot → Prove → Deploy → Expand
- 3 primary pilot scenarios and 4 OS configurations (Marketplace expansion-only)
- Success framework: 15+ measures across Operational, Guest, Staff, Governance, Value categories
- Readiness checklist (4 categories): Customer, Technical, Operational, Measurement
- Expansion pathway: 7 stages with maturity gates
- Deployment package including production-only sections

### 5. Commercial Framework (Fully Labelled)

Complete commercial model with enforced credibility labelling:
- 10 commercial components with `CommercialStatus` + `CommercialSourceStatus` on every item
- Value framework: 4 categories with evidence-backed items
- 4 proof boundaries: Demonstrated, Architecturally-defined, Pilot-dependent, Production-engineering-required
- Partner commercial models: 4 models (Referral, Reseller, Distribution, Integration), all "subject to agreement"
- No approved pricing — all figures indicative or subject to proposal
- Proof Calculator with inline disclaimer

### 6. Integration Responsibility Matrix

Comprehensive integration record for all 8 supported integrations:
- Fields: authentication owner, mapping owner, RTBX responsibility, customer responsibility, failure owner, maturity, proof
- Approved maturity vocabulary: Planned / Mapped / Integrated / Production
- `connector-ready` explicitly excluded from the type system
- Deployment responsibility matrix: 12 activities × 5 responsibility columns
- No production integration claims `proof: "none"`

### 7. Resource Library (14 Documents)

Complete brief library with metadata:
- 14 displayable documents across 5 classification levels
- All documents carry: title, audience, owner, version, confidentiality, maturity, lastReviewed
- Internal-only documents excluded from display
- Commercially restricted documents carry explicit status badges
- All hrefs resolve to canonical routes

---

## Working Proof Summary

| Capability | Maturity |
|---|---|
| Signal-to-action pipeline (5 stages) | Working Proof |
| Scenario execution engine (state machine) | Working Proof |
| Playbook-driven decision routing | Working Proof |
| Welfare governance (approval gate) | Working Proof |
| Evidence capture and closure gating | Working Proof |
| Outcome recording | Working Proof |
| Learning output generation | Working Proof |
| Guest View (filtered guest-only content) | Working Proof |
| Operator View (full field set) | Working Proof |
| Dual View (shared execution state) | Working Proof |
| Partner ecosystem model (6 lanes) | Architecturally defined |
| Commercial framework | Architecturally defined |
| Integration responsibility matrix | Architecturally defined |
| Production integrations (PMS, CRM, etc.) | Not connected |
| Marketplace & Loyalty activation | Not in pilot scope |

---

## Pilot Proposition

RTBX Travel proposes an **8–12 week proof pilot** with a hotel or resort partner:

**What the pilot delivers:**
- 3 primary scenarios in live operation: Room Not Ready Recovery, Service Backlog, Maintenance Defect
- Signal validation across 3 operating systems
- Evidence trail for all incidents
- Outcome report at 4 and 8 weeks
- Governance assurance at every step

**What the pilot requires from the partner:**
- Executive sponsor and pilot owner designated
- Property context (rooms, staff, operating context)
- Signal sources identified (manual signal entry required initially; integration optional)
- Governance sign-off on escalation and welfare rules

**What the pilot does NOT require:**
- Production system integration (manual signal entry only in Phase 1)
- Guest-facing technology changes
- Major IT project

---

## Known Limitations

| # | Limitation | Impact | Resolution |
|---|---|---|---|
| 1 | No production integrations connected | All signals are simulated or manually entered | Pilot Phase 2 with approved integration partners |
| 2 | Guest communications not sent | Guest messages are demonstrated, not dispatched | Production engineering — WELBX guest layer connection |
| 3 | Marketplace activation not in pilot | Expansion-only OS | Post-pilot expansion phase |
| 4 | Client-side authentication only | No login-gating for restricted documents | Production auth engineering (server-side) |
| 5 | Single-bundle SPA (1,612 KB) | All partner room routes in one bundle | Lazy loading partially implemented; further splitting for scale |
| 6 | localStorage persistence only | Execution state lost on browser refresh | Production engineering — server-backed state |
| 7 | Accessibility — keyboard navigation | Some interactive controls not keyboard-accessible | Task #24 (Prevent accessibility regressions) |
| 8 | No revenue share approved | Transaction/revenue-share commercial model is indicative | Partner commercial agreement required |
| 9 | All commercial figures indicative | Subject to proposal and commercial agreement | Pilot completion and commercial negotiation |
| 10 | No real-world pilot data | All outcome metrics are targets, not measured results | First pilot completion required |

---

## Supported Scenarios

All 7 canonical scenarios are supported in this release. See the Proof and Claims Register (`docs/proof-and-claims-register.md`) for per-scenario maturity, evidence, and limitation detail.

---

## Technical Verification

| Check | Result |
|---|---|
| TypeScript typecheck (`tsc --noEmit`) | ✅ 0 errors |
| Tests (`vitest run`) | ✅ 255 passed, 0 failed |
| Build (`vite build`) | ✅ No errors (1,612 KB bundle) |
| Route resolution (`test-routes.mjs`) | ✅ 57 routes, 0 missing |
| Internal links (`test-links.mjs`) | ✅ 59 links, 0 broken |
| Legacy terminology (`check-legacy.mjs`) | ✅ Clean |
| Architecture integrity (`validateSprint3`) | ✅ 0 errors |
| Deployment + runtime (`validateSprint4`) | ✅ 0 errors |
| Sprint 5 data (`validateSprint5`) | ✅ 0 errors |
| Cross-view + accessibility (`validateCrossView`) | ✅ 23 checks passed |
| Security scan | ✅ No secrets or credentials found |

---

## Test Suites

| Suite | File | Tests |
|---|---|---|
| Architecture Consistency | `architecture-consistency.test.ts` | 28 |
| Sprint 3 Data Integrity | `validateSprint3.test.ts` | 60+ |
| Sprint 4 Runtime Engine | `validateSprint4.test.ts` | 80+ |
| Environment Health Scores | `envHealthScores.test.ts` | 10+ |
| Sprint 5 Data Integrity | `validateSprint5.test.ts` | 57+ |
| Cross-View + Accessibility | `validateCrossView.test.ts` | 23 |
| **Total** | | **255** |

---

## Tested Browsers

| Browser | Status |
|---|---|
| Chrome (latest) | ✅ Verified |
| Safari (latest) | Advisory — not formally tested |
| Firefox (latest) | Advisory — not formally tested |
| Mobile Chrome | Advisory — responsive layout confirmed |

---

## Changed in v2.0 (Sprint 5)

1. **Partner Ecosystem** — 6-lane partner model, ownership matrix, selection criteria, pathway stages
2. **Pilot Model** — 7-stage deployment pathway, success framework, readiness checklist, expansion stages
3. **Commercial Framework** — CommercialStatus type system, value framework, proof boundaries, partner commercial models
4. **Integration Responsibility Matrix** — 8 integration records, deployment responsibility matrix, connector-ready prohibition
5. **Navigation** — Sidebar restructured (5 groups), brand cleanup to RTBX Travel, WELBX reserved for guest layer
6. **Typography & Density** — Heading hierarchy, card density, spacing standardised
7. **Responsive** — Mobile viewport, accessibility forms UX
8. **Content QA** — SYNTHETIC DEMO DATA label on KPI strip, Execution Centre copy corrected, claims register created
9. **Technical verification** — Cross-view tests, accessibility static analysis, 5 docs created, check-legacy fixed

---

## Docs Created in This Release

| Document | Location | Purpose |
|---|---|---|
| Final Page Register | `docs/final-page-register.md` | 69 routes registered |
| Proof and Claims Register | `docs/proof-and-claims-register.md` | All maturity and integration claims |
| Release Security Boundary | `docs/release-security-boundary.md` | Security posture and production requirements |
| Release Checklist | `docs/release-checklist.md` | Full release gate checklist |
| Release Notes | `docs/release-notes-v2.md` | This document |

---

## Contacts

For access to restricted documents, pilot alignment, or commercial discussion:  
**RTBX Travel — Partner Engagement**  
Refer to `/partner-room/next-step` for contact pathways.
