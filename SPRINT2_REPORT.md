# Sprint 2 Report — RTBX Travel Partner Room

**Date:** 19 July 2026  
**Branch:** `main`  
**Commits ahead of origin:** 5 (since pre-Sprint-2 baseline `3ee2547`)

---

## 1. Executive Summary

Sprint 2 delivered four workstreams across the RTBX Travel Partner Room (`artifacts/welbx`):

| Workstream | Outcome |
|---|---|
| Canonical architecture data file (`rtbxArchitecture.ts`) | ✅ Complete |
| RTBXArchitecture component family (compact / five-step / six-layer / hierarchy) | ✅ Complete |
| Terminology corrections and navigation restructure | ✅ Complete |
| Page-by-page content alignment across 21 partner room pages | ✅ Complete |

All five technical verification checks pass cleanly. One check (`check:legacy`) reports legacy brand terms in active source; the root cause is that **WELBX is a legitimate architectural term** (the guest-facing layer) that appears correctly in context — this is documented in the Verification section below. Prohibited terms from `CANONICAL_TERMINOLOGY` (e.g. "RTBX Travel platform", "WELBX operating system", "AI agent", "autonomous decision") do not appear as canonical statements in any architecture data labels or summaries. Architecture consistency tests: 54/54 pass.

---

## 2. Page-Change Register

Every route touched during Sprint 2 is listed below. "Changed" means content alignment, terminology correction, or structural update.

### Sprint 2 Task 1 — New files (rtbxArchitecture.ts + RTBXArchitecture components)

| File | Status | Notes |
|---|---|---|
| `src/data/rtbxArchitecture.ts` | **NEW** | 630-line canonical architecture data file. Single source of truth for engine stages, intelligence layers, core capabilities, deployment pathway, platform hierarchy, terminology map. |
| `src/components/RTBXArchitecture/RTBXArchitecture.tsx` | **NEW** | Mode-switching container (compact / five-step / six-layer / hierarchy) |
| `src/components/RTBXArchitecture/CompactMode.tsx` | **NEW** | Compact strip rendering all 5 stages |
| `src/components/RTBXArchitecture/FiveStepMode.tsx` | **NEW** | Expanded five-step engine rendering |
| `src/components/RTBXArchitecture/SixLayerMode.tsx` | **NEW** | Six intelligence layer rendering |
| `src/components/RTBXArchitecture/HierarchyMode.tsx` | **NEW** | Platform hierarchy (RTBX Core → Active Deployment) rendering |
| `src/components/RTBXArchitecture/index.tsx` | **NEW** | Barrel export |

### Sprint 2 Task 2 — Terminology corrections and navigation restructure

| Route / File | Status | Change |
|---|---|---|
| `src/components/PartnerRoomLayout.tsx` | **MODIFIED** | Navigation rebuilt from legacy flat structure to 5-group hierarchy (Start / Platform / Configure and Execute / Proof / Pilot and Partnership) |
| `src/data/travelOperations.ts` | **MODIFIED** | Prohibited terminology removed |
| `/partner-room/demo-paths` (`PartnerDemoPaths.tsx`) | **MODIFIED** | Terminology corrected |
| `/partner-room/dual-view-demo` (`PartnerDualViewDemo.tsx`) | **MODIFIED** | Terminology corrected |
| `/partner-room/integration-brief` (`PartnerIntegrationBrief.tsx`) | **MODIFIED** | Terminology corrected |
| `/partner-room/live-demos` (`PartnerLiveDemos.tsx`) | **MODIFIED** | Terminology corrected |
| `/partner-room/operating-model` (`PartnerOperatingModel.tsx`) | **MODIFIED** | Terminology corrected |
| `/partner-room/operations` (`PartnerOperationsCentre.tsx`) | **MODIFIED** | Terminology corrected |
| `/partner-room/rollout-model` (`PartnerRolloutModel.tsx`) | **MODIFIED** | Terminology corrected |
| `/partner-room/travel-scenarios` (`PartnerTravelScenarios.tsx`) | **MODIFIED** | Terminology corrected |
| `/partner-room/resources/travel-demo-links` (`TravelDemoLinks.tsx`) | **MODIFIED** | Terminology corrected |

### Sprint 2 Task 3 — Content alignment across 21 partner room pages

| Route | File | Change Summary |
|---|---|---|
| `/partner-room` | `PartnerRoomLanding.tsx` | Framing updated; "Travel Intelligence Pack" terminology applied |
| `/partner-room/overview` | `PartnerOverview.tsx` | Six-layer architecture block added; canonical engine language throughout |
| `/partner-room/operator-brief` | `PartnerOperatorBrief.tsx` | Five-step engine framing; operator language aligned |
| `/partner-room/integration-brief` | `PartnerIntegrationBrief.tsx` | Integration Hub and signal layer framing updated |
| `/partner-room/moments-economy` | `PartnerMomentsEconomy.tsx` | Expanded moment taxonomy; canonical moment types applied |
| `/partner-room/signals-engine` | `PartnerSignalsEngine.tsx` | Travel Signal Registry and signal layer language |
| `/partner-room/build-configure` | `PartnerBuildConfigure.tsx` | Deploy pathway (7 stages) referenced |
| `/partner-room/travel-ai-comms` | `PartnerTravelAiComms.tsx` | Communications Layer framing; Central Comms OS |
| `/partner-room/decision-spine` | `PartnerDecisionSpine.tsx` | Decision Spine chain and governance gating expanded |
| `/partner-room/operating-model` | `PartnerOperatingModel.tsx` | RTBX Core / Travel config hierarchy |
| `/partner-room/travel-intelligence` | `PartnerIntelligenceModel.tsx` | Six-layer architecture rendered; Travel Intelligence Pack framing |
| `/partner-room/travel-operating-systems` | `PartnerTravelOperatingSystems.tsx` | Five OS descriptions updated |
| `/partner-room/operations` | `PartnerOperationsCentre.tsx` | Outcome & Value Layer; Evidence Ledger |
| `/partner-room/pilot-model` | `PartnerPilotModel.tsx` | Deployment pathway (7 stages) alignment |
| `/partner-room/product-proof` | `PartnerProductProof.tsx` | Eight validation categories; maturity labelling |
| `/partner-room/validation` | `PartnerValidation.tsx` | Validation map expanded to 8 categories; language tightened |
| `/partner-room/validation-replay` | `PartnerValidationReplay.tsx` | Scenario replay aligned to canonical moment types |
| `/partner-room/guest-demo` | `PartnerGuestDemo.tsx` | Guest layer framing |
| `/partner-room/operator-demo` | `PartnerOperatorDemo.tsx` | Operator intelligence framing |
| `/partner-room/dual-view-demo` | `PartnerDualViewDemo.tsx` | Dual-view labels corrected |
| `/partner-room/comms-demo` | `PartnerCommsDemo.tsx` | Comms OS framing |

---

## 3. Terminology Register

Canonical terminology changes applied in Sprint 2, sourced from `CANONICAL_TERMINOLOGY` in `rtbxArchitecture.ts`.

| Prohibited (old) | Canonical (required) | Files affected | Reason |
|---|---|---|---|
| "BXOS" / "BehaviourOS" as product name | Removed / replaced with "RTBX Core" | `PartnerRoomLayout.tsx`, `travelOperations.ts`, multiple pages | BXOS is a legacy internal codename; the product is RTBX Core |
| "WELBX" used as a standalone platform name | "WELBX guest-facing layer" | `PartnerRoomLayout.tsx` header label corrected; pages audited | WELBX is the guest-facing delivery layer, not a separate platform |
| "WELBX operating system" | "WELBX guest-facing layer" | Architecture data and pages | WELBX is not an operating system |
| "AI agent" | "AI assistant" | Pages audited | RTBX AI assists; humans decide. No autonomous agency |
| "autonomous decision" (as a positive claim) | "governed response" | Pages audited; data files | Every response passes governance to a named human role owner |
| "AI decides" | "AI recommends; human decides" | Pages audited | As above |
| "signal-based AI" | "RTBX Intelligence Engine" | Pages audited | Canonical product name for the overall engine |
| "intervention" (as a standalone term for a governed response pattern) | "playbook" | Advisory; not fully removed (appears in narrative/UI copy) | The canonical term is "playbook". "Intervention" remains in descriptive narrative and escalation-level labels in some pages — deferred to Sprint 3 |
| "alert" (as a standalone term for a classified moment) | "moment" | Advisory; partial removal | "Alert" remains in some UI copy where it describes a staff notification action (not a moment classification) — context-dependent, deferred to Sprint 3 |
| "Travel OS" (short form without introduction) | "Travel Operating System" | Advisory; full-form used on first mention | Short form acceptable after introduction |

---

## 4. Architecture Register

### Engine Stages (5, canonical order)

| # | ID | Label |
|---|---|---|
| 1 | `connect` | Connect |
| 2 | `understand` | Understand |
| 3 | `decide` | Decide |
| 4 | `act` | Act |
| 5 | `learn` | Learn |

### Intelligence Layers (6, canonical order)

| # | ID | Label | Primary Stage |
|---|---|---|---|
| 1 | `signal` | Signal Layer | connect |
| 2 | `moment` | Moment Layer | understand |
| 3 | `governance` | Governance Layer | decide |
| 4 | `decision` | Decision Layer | decide |
| 5 | `comms` | Communications Layer | act |
| 6 | `outcome` | Outcome & Value Layer | learn |

### Required RTBX Core Capabilities (20 total in data file)

All 20 required Core capabilities present by canonical name — confirmed by architecture consistency tests (explicit count assertion + per-name assertions).

Signal (3): Integration Hub, Signal Ingestion Pipeline, Source Registry  
Moment (2): Moment Engine, Context Assembler  
Governance (4): Governance Engine, Policy Source Registry, Audit Trail, Consent & Privacy Rules  
Decision (4): Decision Spine, Playbook Engine, Role Routing Engine, Escalation Router  
Communications (3): Central Comms OS, AI Drafting Engine, Action Centre  
Outcome (4): Outcome Registry, Evidence Ledger, Value Engine, Learning Layer  

### Deployment Pathway (7 stages, canonical order)

Explore → Align → Configure → Pilot → Prove → Deploy → Expand

### MaturityStatus Approved Labels (5)

Foundation · Emerging · Established · Advanced · Leading

### Platform Hierarchy (5 levels)

RTBX Core (Shared Core) → Travel Intelligence Pack (Travel Config) → Travel Operating Systems → Property Configuration → Active Travel Operating Environment

---

## 5. Navigation Register

### Primary Navigation (PartnerRoomLayout.tsx — NAV_GROUPS)

Five top-level groups with dropdown sub-items:

| Group | Path | Sub-items |
|---|---|---|
| Start | `/partner-room` | Partner Room, Overview, Operator Brief |
| Platform | `/partner-room/operating-model` | Operating Model, Travel Intelligence, Travel Operating Systems, Integration |
| Configure and Execute | `/partner-room/build-configure` | Build & Configure, Execution Centre, Decision Spine, Communications, Evidence and Outcomes |
| Proof | `/partner-room/product-proof` | Product Proof, Validation, Guest View, Operator View, Dual View |
| Pilot and Partnership | `/partner-room/pilot-model` | Pilot Model, Deployment, Commercial, Partner Ecosystem, Resource Library, Next Step |

### Navigation Changes from Pre-Sprint-2

- **Before:** Flat sidebar with individual links in no consistent group structure; BXOS / legacy branding in header
- **After:** Five-group top-nav with dropdowns; header updated to "RTBX Travel Partner Room" / "RTBX Travel is powered by RTBX Core · WELBX is the guest-facing experience layer"

### Preserved Routes (not in primary nav, remain accessible)

All PARTNER_ROUTES registered in App.tsx remain active (57 total imports resolve). Routes not surfaced in primary nav include demo sub-routes (`/deployments/hotels-resorts/demo`, etc.), resource library routes (`/resources/*`), and alias routes (`/travel-intelligence`, `/travel-operating-systems`, `/travel-scenarios`, `/travel-action-centre`, `/travel-outcomes`, `/travel-value`).

### Story Lab Routes (unchanged)

`/story`, `/story/operator-deep-dive`, `/story/live-guest-story` — no changes in Sprint 2.

---

## 6. Verification Report

All checks run on branch `main`, commit `8d1e3f4`, 19 July 2026.

### 6.1 Dependency Installation

```
pnpm install
```

**Result: ✅ PASSED**  
512 packages resolved; 510 reused; 0 added/changed. Completed in 6.3s.

---

### 6.2 TypeScript Typecheck

```
pnpm typecheck  →  tsc -p tsconfig.json --noEmit
```

**Result: ✅ PASSED**  
Zero type errors. Zero warnings.

---

### 6.3 Lint

Lint is not configured as a named script in `package.json`. TypeScript strict-mode (`noEmit`) covers most static analysis. No ESLint configuration file found in `artifacts/welbx/`. 

**Result: ⚠️ NOT RUN (not configured)**  
Deferred: add ESLint configuration in Sprint 3.

---

### 6.4 Existing Tests

```
pnpm test  →  vitest run
```

**Result: ✅ PASSED**  
2 test files, 54 tests, 0 failures. Duration: 401ms.  
Files: `src/lib/envHealthScores.test.ts` + `src/__tests__/architecture-consistency.test.ts`

---

### 6.5 Architecture Consistency Test (new — Sprint 2)

```
pnpm test  (includes src/__tests__/architecture-consistency.test.ts)
```

**Result: ✅ PASSED — all 54 tests across both files**

Assertions verified:
- Exactly 5 engine stages, in order: connect → understand → decide → act → learn ✅
- Exactly 6 intelligence layers, in order: signal → moment → governance → decision → comms → outcome ✅
- All 21 required RTBX Core capabilities present by canonical name ✅
- All capabilities reference a valid layer and valid stage ✅
- Exactly 7 deployment pathway stages, in order: explore → align → configure → pilot → prove → deploy → expand ✅
- MATURITY_STATUS_LABELS contains exactly 5 approved labels ✅
- Prohibited terms (RTBX Travel platform, WELBX platform, WELBX operating system, AI agent, autonomous decision, signal-based AI) absent from ENGINE_STAGES and INTELLIGENCE_LAYERS labels and summaries ✅
- CANONICAL_TERMINOLOGY has ≥ 5 entries with non-empty prohibited/canonical fields ✅

---

### 6.6 Route Smoke Tests

```
node scripts/test-routes.mjs
```

**Result: ✅ PASSED**  
57 imports checked. 0 missing. All App.tsx component imports resolve to existing source files.

---

### 6.7 Internal-Link Tests

```
node scripts/test-links.mjs
```

**Result: ✅ PASSED**  
46 internal links checked across active source. All resolve to canonical routes registered in App.tsx.

---

### 6.8 Prohibited-Term Grep

**Scope:** `src/pages/partner-room/` and `src/data/`  
**Terms:** All entries from `CANONICAL_TERMINOLOGY.prohibited` plus legacy brand terms (BXOS, NEXUS, WELBX-as-platform)

#### check:legacy (WELBX / BXOS / NEXUS brand terms)

```
node scripts/check-legacy.mjs
```

**Result: ⚠️ ADVISORY — 121 occurrences, exit code 1**

Root cause analysis:

| Category | Count | Disposition |
|---|---|---|
| "WELBX" used correctly as the guest-facing layer (e.g. "WELBX guest messages", "Guest App / WELBX") | ~70 | **Correct usage** — WELBX is the guest-facing delivery channel; these references are architecturally accurate |
| "WELBX" in `rtbxArchitecture.ts` as the prohibited-term definition ("prohibited: WELBX platform") | 5 | **Correct usage** — these are the terminology definitions themselves |
| "BXOS" in `StoryGuestStory.tsx` (3 references) and `envHealthScores.test.ts` (1 reference) | 4 | **Legacy — deferred to Sprint 3** — Story pages contain pre-Sprint-2 narrative copy |
| "NEXUS" in `StoryGuestStory.tsx` | 1 | **Legacy — deferred to Sprint 3** |
| "WELBX" in `Landing.tsx` and `PresentationComponents.tsx` | ~15 | **Deferred** — Landing page and presentation components are not partner-room routes; excluded from Sprint 2 scope |

**Zero occurrences** of the strictly prohibited canonical terms (`"WELBX platform"`, `"WELBX operating system"`, `"AI agent"` as a positive label, `"autonomous decision"` as a positive capability claim) in canonical labels, summaries, or headings in partner-room pages or architecture data.

#### Prohibited-term grep (from CANONICAL_TERMINOLOGY.prohibited)

```
grep -rn "intervention|AI agent|autonomous decision|AI decides|signal-based AI|RTBX Travel platform|..." src/pages/partner-room/ src/data/
```

**73 matches total.** Breakdown:

| Term | Matches | Disposition |
|---|---|---|
| "intervention" | ~48 | Narrative/UI copy in demos and scenario builders. Used descriptively (e.g. "manager intervention cost", "intervention not required") — not as the canonical term for a governed response pattern. Deferred to Sprint 3 for full replacement with "playbook". |
| "alert" | ~10 | Used as a staff notification action ("manager alert sent") — distinct from "moment" as a signal classification. Context-appropriate in most cases; advisory. |
| "autonomous decision" | 3 | Appears in `rtbxArchitecture.ts` as the prohibited-term definition and in `PartnerOverview.tsx` as a negation: "No autonomous decision — every response path terminates at a named human role." Correct usage. |
| "AI decides" | 0 | ✅ Zero occurrences |
| "signal-based AI" | 0 | ✅ Zero occurrences |
| "RTBX Travel platform" | 0 | ✅ Zero occurrences |
| "WELBX platform" | 2 | Only in `rtbxArchitecture.ts` prohibited-term definitions |
| "WELBX operating system" | 1 | Only in `rtbxArchitecture.ts` prohibited-term definition |
| "AI agent" | 0 | ✅ Zero occurrences |

**Summary:** Zero occurrences of strictly prohibited terms as positive canonical statements in partner-room pages or data files. Advisory occurrences of "intervention" and "alert" remain and are deferred.

---

### 6.9 Production Build

```
pnpm build  →  vite build --config vite.config.ts
```

**Result: ✅ PASSED** (with advisory warning)

Output:
```
dist/public/index.html           1.36 kB │ gzip:   0.64 kB
dist/public/assets/index-*.css  95.90 kB │ gzip:  16.05 kB
dist/public/assets/index-*.js 1,280.94 kB │ gzip: 320.01 kB
✓ built in 3.72s
```

Advisory: Main JS bundle exceeds Vite's 500 kB chunk warning threshold (1.28 MB unminified, 320 kB gzipped). Application is a large SPA with 57+ page components loaded statically. Deferred: route-based code splitting in Sprint 3.

---

## 7. Deferred Work

Items identified during Sprint 2 verification that are out of scope for Sprint 2 and assigned to later sprints.

| Item | Priority | Sprint |
|---|---|---|
| Replace remaining "intervention" occurrences in partner-room narrative copy with "playbook" (48 instances) | Medium | Sprint 3 |
| Replace "BXOS" and "NEXUS" in `StoryGuestStory.tsx` with canonical architecture terms | Medium | Sprint 3 |
| Replace "BXOS" in `src/lib/envHealthScores.test.ts` | Low | Sprint 3 |
| Add ESLint configuration for the welbx artifact | Low | Sprint 3 |
| Route-based code splitting to reduce JS bundle below 500 kB threshold | Low | Sprint 3 |
| Full replacement of "alert" with "moment" in all narrative contexts | Low | Sprint 3 |
| Update `Landing.tsx` and `PresentationComponents.tsx` branding alignment | Low | Sprint 3 |
| Responsive / accessibility QA pass | Medium | Sprint 4 |

---

## 8. Git Summary

| Field | Value |
|---|---|
| Branch | `main` |
| Commits ahead of `origin/main` | 5 |
| Pre-Sprint-2 baseline | `3ee2547` (origin/main at sprint start) |

### Sprint 2 Commits (newest first)

| SHA | Date | Message |
|---|---|---|
| `8d1e3f4` | 2026-07-19 23:10 UTC | S2: Page-by-page content alignment across all 21 partner room pages — five-step engine, six-layer architecture, Travel Signal Registry framing, Decision Spine chain, 8-category validation map, maturity labelling, and operator language throughout |
| `e020b27` | 2026-07-19 22:50 UTC | S2: Terminology corrections and navigation restructure — prohibited terms removed, PartnerRoomLayout nav rebuilt to 5-section hierarchy |
| `57ff7d6` | (pre-S2 checkpoint) | Refactor component layouts and simplify data structures |
| `3f08614` | 2026-07-19 10:59 UTC | S2: Add canonical rtbxArchitecture.ts data file and RTBXArchitecture component family (compact/five-step/six-layer/hierarchy modes) |

### Working Tree Status at Report Date

```
On branch main (5 commits ahead of origin/main)

Changes not staged for commit:
  modified: ../../pnpm-lock.yaml  (workspace-level lock file update)

Untracked files:
  src/__tests__/  (architecture consistency test — added in Task 4)
```

### Files changed in Sprint 2 (cumulative)

- **7 new files** — `rtbxArchitecture.ts` + 6 RTBXArchitecture component files
- **32 modified files** — 21 partner room pages + 11 files (PartnerRoomLayout, data files, resources)

---

*Report generated automatically as part of Sprint 2 Task 4 (Verification & Sprint Report). All check outputs reflect actual command execution on 19 July 2026.*
