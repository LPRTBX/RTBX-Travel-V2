# RTBX Travel Partner Room — Route Register

**Version:** Sprint 1  
**Date:** 2026-07-19  
**Application:** `artifacts/welbx` · Router: `src/App.tsx` (wouter)

---

## How to use this register

Every distinct product concept must have one canonical route. When routes change, update this document. Run `pnpm test:routes` and `pnpm test:links` to verify.

---

## Canonical Partner Room routes

| Canonical route | Component | Purpose | Status | Alias routes | Nav location | Ext. dep. risk | Action |
|---|---|---|---|---|---|---|---|
| `/partner-room` | `PartnerRoomLanding` | Partner Room home / landing | Active | — | Rooms → Partner Room | Low | Keep |
| `/partner-room/overview` | `PartnerOverview` | Why RTBX Travel | Active | — | Start Here | Low | Keep |
| `/partner-room/operator-brief` | `PartnerOperatorBrief` | Operator brief | Active | — | Brief Library | Low | Keep |
| `/partner-room/operating-model` | `PartnerOperatingModel` | Travel operating architecture | Active | — | Start Here | Low | Keep |
| `/partner-room/travel-intelligence` | `PartnerIntelligenceModel` | Travel Intelligence Pack | Active | `/partner-room/intelligence-model`, `/travel-intelligence` | Start Here | Medium | Canonical; aliases redirect |
| `/partner-room/travel-operating-systems` | `PartnerTravelOperatingSystems` | 5 OS overview | Active | `/travel-operating-systems` | Platform & OS | Medium | Canonical; alias redirects |
| `/partner-room/resources/travel-systems-map` | `TravelSystemsMap` | Module catalogue / systems map | Active | — | Platform & OS | Low | Keep |
| `/partner-room/travel-ai-comms` | `PartnerTravelAiComms` | AI & Central Comms | Active | `/travel-ai-comms` | Platform & OS | Medium | Canonical; alias redirects |
| `/partner-room/integration-brief` | `PartnerIntegrationBrief` | Integration architecture | Active | — | Platform & OS | Low | Keep |
| `/partner-room/signals-engine` | `PartnerSignalsEngine` | Signals and moments | Active | — | Platform & OS | Low | Keep |
| `/partner-room/decision-spine` | `PartnerDecisionSpine` | Governance and playbooks | Active | — | Platform & OS | Low | Keep |
| `/partner-room/operator-demo` | `PartnerOperatorDemo` | Role views / operator demo | Active | — | Platform & OS | Low | Keep |
| `/partner-room/build-configure` | `PartnerBuildConfigure` | Discovery and configuration tools | Active | — | Configure | Low | Keep |
| `/partner-room/pilot-model` | `PartnerPilotModel` | Pilot model | Active | — | Deployment | Low | Keep |
| `/partner-room/rollout-model` | `PartnerRolloutModel` | Property activation & portfolio rollout | Active | — | Deployment | Low | Keep |
| `/partner-room/operations` | `PartnerOperationsCentre` | Managed intelligence (Action/Outcome/Evidence/Value) | Active | `/travel-action-centre` → `#action-centre`, `/travel-outcomes` → `#outcome-ledger`, `/travel-value` → `#value-dashboard` | Deployment | Medium | Canonical; aliases redirect |
| `/partner-room/travel-scenarios` | `PartnerTravelScenarios` | Live scenarios (6 governed demos) | Active | `/travel-scenarios` | Deployment | Medium | Canonical; alias redirects |
| `/partner-room/commercial` | `PartnerCommercial` | Commercial landing | Active | — | Start Here | Low | Keep |
| `/partner-room/commercial-unit` | `PartnerCommercialUnit` | Commercial unit (8 revenue layers) | Active | — | Commercial | Low | Keep |
| `/partner-room/commercial-model` | `PartnerCommercialModel` | Commercial model detail | Active | — | Brief Library | Low | Merge with commercial-unit Sprint 5 |
| `/partner-room/partner-ecosystem` | `PartnerEcosystem` | 7 partner-type ecosystem | Active | — | Partners / Start Here | Low | Keep |
| `/partner-room/brief-library` | `PartnerBriefLibrary` | Resource / brief library | Active | — | Rooms | Low | Keep |
| `/partner-room/next-step` | `PartnerNextStep` | Contact / next step | Active | — | Rooms | Low | Keep |

---

## Demo routes

| Canonical route | Component | Purpose | Status | Notes | Action |
|---|---|---|---|---|---|
| `/partner-room/live-demos` | `PartnerLiveDemos` | Demo hub | Active | — | Keep |
| `/partner-room/demo-paths` | `PartnerDemoPaths` | Demo path chooser | Active | Consolidate with live-demos Sprint 3 | Defer |
| `/partner-room/guest-demo` | `PartnerGuestDemo` | Guest demo | Active | — | Keep |
| `/partner-room/dual-view-demo` | `PartnerDualViewDemo` | Dual view demo | Active | — | Keep |
| `/partner-room/deployments` | `PartnerDeployments` | Deployment environment chooser | Active | — | Keep |
| `/partner-room/deployments/hotels-resorts/demo` | `PartnerHotelsResortsDemo` | Hotels & Resorts demo | Active | — | Keep |
| `/partner-room/deployments/corporate-travel/demo` | `PartnerCorporateTravelDemo` | Corporate Travel demo | Active | — | Keep |
| `/partner-room/deployments/events-venues/demo` | `PartnerEventsVenuesDemo` | Events & Venues demo | Active | — | Keep |
| `/partner-room/deployments/destination-tourism/demo` | `PartnerDestinationTourismDemo` | Destination Tourism demo | Active | — | Keep |
| `/partner-room/holiday-park-demo` | `PartnerHolidayParkDemo` | Holiday Park demo | Active | — | Keep |
| `/partner-room/comms-demo` | `PartnerCommsDemo` | Comms demo | Active | Consolidate with travel-ai-comms Sprint 3 | Defer |
| `/partner-room/scenario-builder` | `PartnerScenarioBuilder` | Scenario builder | Active | — | Keep |
| `/partner-room/validation-replay` | `PartnerValidationReplay` | Validation replay | Active | — | Keep |
| `/partner-room/resources/travel-demo-links` | `TravelDemoLinks` | Demo links resource | Active | Consolidate with live-demos Sprint 3 | Defer |

---

## Proof and validation routes

| Canonical route | Component | Purpose | Status | Action |
|---|---|---|---|---|
| `/partner-room/product-proof` | `PartnerProductProof` | Product proof hub | Active | Keep |
| `/partner-room/product-proof/signal-capture` | `PartnerSignalCapture` | Signal capture | Active | Keep |
| `/partner-room/product-proof/stage-3-operating-layer` | `PartnerStage3Preview` | Stage 3 preview | Active | Keep |
| `/partner-room/product-proof/pilot-expansion-preview` | `PartnerPilotExpansionPreview` | Pilot expansion preview | Active | Keep |
| `/partner-room/validation` | `PartnerValidation` | Validation | Active | Keep |
| `/partner-room/proof-calculator` | `PartnerProofCalculator` | Proof calculator | Active | Keep |
| `/partner-room/moments-economy` | `PartnerMomentsEconomy` | Moments economy | Active | Keep |

---

## Resource routes

| Canonical route | Component | Status | Action |
|---|---|---|---|
| `/partner-room/resources/travel-partnership-overview` | `TravelPartnershipOverview` | Active | Keep |
| `/partner-room/resources/travel-commercial-partnership-brief` | `TravelCommercialPartnershipBrief` | Active | Keep |
| `/partner-room/resources/travel-business-plan` | `TravelBusinessPlan` | Active | Keep |
| `/partner-room/resources/travel-gtm-plan` | `TravelGtmPlan` | Active | Keep |
| `/partner-room/resources/travel-commercial-case` | `TravelCommercialCase` | Active | Keep |
| `/partner-room/resources/travel-ux-blueprint` | `TravelUxBlueprint` | Active | Keep |
| `/partner-room/resources/travel-pilot-model` | `TravelPilotModel` | Active | Keep |
| `/partner-room/resources/travel-revenue-model` | `TravelRevenueModel` | Active | Keep |
| `/partner-room/resources/travel-architecture-modelling-ux-qa` | `TravelArchitectureModellingUxQa` | Active | Keep |

---

## Story Lab routes (protected)

| Canonical route | Component | Status | Notes |
|---|---|---|---|
| `/story` | `StoryHub` | Active | Protected — named brand references pre-approved |
| `/story/operator-deep-dive` | `StoryOperator` | Active | Protected |
| `/story/live-guest-story` | `StoryGuestStory` | Active | Protected |
| `/story/executive-briefing` | — | Redirect → `/story` | Temporary compat redirect |

---

## Redirect-only routes

| Route | Target | Reason |
|---|---|---|
| `/travel-intelligence` | `/partner-room/travel-intelligence` | Short URL alias — keep for external link compat |
| `/travel-operating-systems` | `/partner-room/travel-operating-systems` | Short URL alias |
| `/travel-ai-comms` | `/partner-room/travel-ai-comms` | Short URL alias |
| `/travel-scenarios` | `/partner-room/travel-scenarios` | Short URL alias |
| `/travel-action-centre` | `/partner-room/operations#action-centre` | Legacy route |
| `/travel-outcomes` | `/partner-room/operations#outcome-ledger` | Legacy route |
| `/travel-value` | `/partner-room/operations#value-dashboard` | Legacy route |
| `/partner-room/intelligence-model` | (same component as travel-intelligence) | Alias — consolidate Sprint 2 |
| `*` (catch-all) | `/partner-room` | All unmatched paths → Partner Room home |

---

## Archived routes (no longer active)

All routes for pages moved to `src/archive/legacy-welbx/` are no longer active. These pages were previously orphaned (not in the router) and have been confirmed unused. The catch-all `*` → `/partner-room` handles any legacy bookmark attempts.

---

## Deferred consolidation

### Sprint 2 — RTBX Core alignment
- Consolidate `/partner-room/intelligence-model` alias with `/partner-room/travel-intelligence`
- Rename BXOS/NEXUS internal labels to canonical RTBX Core component names
- Review `Sidebar.tsx` engine footer labels

### Sprint 3 — Demos and scenarios
- Consolidate demo discovery: `demo-paths` + `live-demos` + `travel-demo-links` → one canonical demo hub
- Consolidate `comms-demo` into `travel-ai-comms`

### Sprint 5 — Commercial pathway
- Consolidate `commercial-model` into `commercial-unit`
- Evaluate `proof-calculator` and `moments-economy` canonical placement

### Content management (future sprint)
- Activate `/partner-content.json` CMS mechanism (currently deferred — see `src/lib/partnerContent.ts`)
- Define and validate schema
- Add development warning when content file is missing
