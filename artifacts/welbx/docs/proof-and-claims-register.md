# RTBX Travel Partner Room — Proof and Claims Register

**Document type:** Internal QA reference — not for external distribution  
**Owner:** RTBX  
**Version:** 0.5 (Sprint 5)  
**Last reviewed:** July 2025  
**Status:** Working — updated with every Sprint

---

## Purpose

Every significant maturity claim, integration reference and commercial figure across the RTBX Travel Partner Room must appear in this register. The register records what the claim is, which page makes it, what evidence backs it, what the limitations are, and whether it has been approved for presentation.

**Approved** means: reviewed and confirmed by RTBX as an accurate representation of working proof, architecture or simulation — not approved for commercial commitment or as a production deployment claim.

---

## Maturity Vocabulary

| Label | Meaning |
|---|---|
| Working Proof | Demonstrated in the Partner Room — interactive, real logic, simulated signals |
| Prototype | Logic is built; signals are injected manually; communications are not sent |
| Simulation | Scenario replayed with synthetic data; no live system connected |
| Connector-ready | Interface specification written; integration not yet connected |
| Integrated | Integration is connected in a staging or pilot environment |
| Production | Connected and operating in a live production environment |
| Planned | Architecture or design exists; implementation not yet started |

---

## Proof and Claims Register

### 1. Scenario Claims

| Claim | Page | Maturity | Evidence | Limitation | Approved |
|---|---|---|---|---|---|
| Scenario 01: Repeat Guest — Room Not Ready demonstrates signal-to-action pipeline | PartnerTravelScenarios, PartnerOperationsCentre | Working Proof | Interactive scenario runner with 12-node pipeline; signals, governance, decision, communications, escalation, evidence, outcomes rendered | Signals are simulated — no live PMS or housekeeping system connected. Communications are not sent to real guests. Compensation decisions are illustrative. | Yes |
| Scenario 02: Distressed Guest demonstrates welfare escalation with mandatory human review | PartnerTravelScenarios, PartnerOperationsCentre | Working Proof | Welfare escalation logic demonstrated; AI prohibited from closing event; Duty Manager mandatory; communications restricted | AI governance rules are demonstrated through UI constraints, not connected to a production welfare system. Emergency service pathways are not active. | Yes |
| Scenario 03: Service Backlog demonstrates operational reallocation | PartnerTravelScenarios, PartnerOperationsCentre | Working Proof | Task prioritisation, reallocation decision, communications and evidence requirements demonstrated | Task management system signal is simulated. Actual staff reallocation is not executed. | Yes |
| Scenario 04: Maintenance Defect demonstrates safety classification and room isolation | PartnerTravelScenarios, PartnerOperationsCentre | Working Proof | Defect classification, safety escalation, room isolation and evidence requirements demonstrated | Maintenance system signal is manual. No live CMMS integration connected. Safety classification is illustrative. | Yes |
| Scenario 05: Transport Disruption demonstrates partner activation and guest notification | PartnerTravelScenarios | Simulation | Scenario runner demonstrates trigger, signals, governance, partner activation communications and escalation | Transport API signal is simulated. Partner activation is not sent to any real partner system. | Yes |
| Scenario 06: Dining Opportunity demonstrates commercial activation window | PartnerTravelScenarios, PartnerOperationsCentre | Simulation | Commercial window detection, personalisation and partner notification demonstrated | Guest profile data is synthetic. Marketplace activation is not live. | Yes |
| Scenario 07: VIP Arrival demonstrates brand-level escalation | PartnerTravelScenarios, PartnerOperationsCentre | Working Proof | Signal cluster, priority escalation, role assignment and evidence trail demonstrated | Guest profile and loyalty signals are simulated. Personal escort and amenity delivery are not executed. | Yes |
| Confidence score "92% — Repeat Guest Room Delay pattern" | PartnerTravelScenarios | Simulation | Classification label shown with "(simulated classification)" qualifier in data | Not from a production AI model. Label represents what the classification system would output at this confidence threshold. | Yes |
| Confidence score "87% — Guest Welfare pattern" | PartnerTravelScenarios | Simulation | Classification label shown with mandatory human review qualifier | Not from a production AI model. | Yes |

---

### 2. Playbook Claims

| Claim | Page | Maturity | Evidence | Limitation | Approved |
|---|---|---|---|---|---|
| All scenarios have a linked playbook with entry conditions, ordered steps, decision rules, escalation rules, evidence requirements and completion criteria | PartnerTravelScenarios (Proof Status tab) | Working Proof | 4+ playbooks in travelPlaybooks.ts; all reference playbookId in travelScenarios.ts; validation tests confirm zero orphans | Playbooks are synthetic demo content — not the customer's operational SOPs. Not approved for production deployment without customer adaptation. | Yes |
| Playbooks display accountable role, approval requirements and communication templates | PartnerTravelScenarios | Working Proof | Rendered in ScenarioDetailPanel across 6 tabs | Playbook steps are demonstrations of the structure, not final operational instructions. | Yes |

---

### 3. Signal and Integration Claims

| Claim | Page | Maturity | Evidence | Limitation | Approved |
|---|---|---|---|---|---|
| PMS (Property Management System) integration | PartnerEcosystem (Integration Responsibility), PartnerOperationsCentre | Mapped | Integration record with authentication owner, mapping owner and failure owner defined | No live PMS connected. Signals are simulated in the demonstration. Production engineering required. | Yes |
| Housekeeping App integration | PartnerEcosystem (Integration Responsibility) | Mapped | Integration record defined; maturity: mapped | No live housekeeping app connected. Manual signal injection in demo. | Yes |
| CRM / Loyalty Platform integration | PartnerEcosystem (Integration Responsibility) | Mapped | Integration record defined; maturity: mapped | No live CRM connected. Guest profile and loyalty data are synthetic. | Yes |
| Task Management System integration | PartnerEcosystem (Integration Responsibility) | Planned | Integration record defined; maturity: planned | Architecture defined; not yet mapped or implemented. | Yes |
| Loyalty Activation integration | PartnerEcosystem (Integration Responsibility) | Planned | Integration record defined as expansion-only | Not available in pilot scope. Requires production engineering and marketplace OS activation. | Yes |
| Maintenance Management (CMMS) integration | PartnerEcosystem (Integration Responsibility) | Mapped | Integration record defined; maturity: mapped; entered manually in demonstration | Production integration requires CMMS API assessment. Manual entry only in demonstration. | Yes |
| Guest Messaging Platform integration | PartnerEcosystem (Integration Responsibility) | Mapped | Integration record defined | No live guest messaging platform connected. Communications are demonstrated, not dispatched. | Yes |
| Staff App integration | PartnerEcosystem (Integration Responsibility) | Planned | Integration record defined | Architecture defined; not yet mapped. | Yes |
| IoT / Environmental Sensor integration | PartnerEcosystem (Integration Responsibility) | Planned | Integration record defined | Architecture defined; not yet implemented. | Yes |
| Guest communication via Guest-facing Experience / Guest App | PartnerGuestDemo, PartnerDualViewDemo | Working Proof | Guest interface demonstrated in phone frame; 7-stage guest journey; communications rendered | No real guest messages are sent. The phone frame is a demonstration prototype. The Guest-facing Experience app is the intended production delivery layer. | Yes |
| Signal classification and moment detection | PartnerTravelScenarios, PartnerOperationsCentre | Working Proof | Classification labels, confidence scores and operating system routing demonstrated | Classification uses deterministic demonstration logic — not a production AI model. Results would vary in a real deployment based on signal quality and training data. | Yes |
| Operator console receives structured moment cards | PartnerOperatorDemo | Simulation | 6 synthetic moment cards shown with structured fields (signal, context, decision, role, action, comms, evidence, outcome) | Moment cards are synthetic — not from a live deployment. KPI values (47 moments, 4.2 min, 91% recovery) are illustrative demo indicators. Not from a production environment. | Yes |

---

### 4. Operating System Claims

| Claim | Page | Maturity | Evidence | Limitation | Approved |
|---|---|---|---|---|---|
| Guest Experience OS — active in pilot | PartnerPilotModel, PartnerOperationsCentre | Working Proof | 3 primary scenarios linked; interactive execution demonstrated | Demonstration uses simulated signals. Production requires PMS and Guest-facing Experience integration. | Yes |
| Service Recovery & Staff Response OS — active in pilot | PartnerPilotModel, PartnerOperationsCentre | Working Proof | Service backlog and maintenance defect scenarios demonstrated | Demonstration uses simulated task management signals. | Yes |
| Safety & Guest Welfare OS — active in pilot | PartnerPilotModel, PartnerOperationsCentre | Working Proof | Welfare escalation with mandatory human review demonstrated | Safety classification is illustrative. No connection to emergency services. | Yes |
| Marketplace & Loyalty Activation OS — expansion only, not in pilot | PartnerPilotModel | Planned | Explicitly labelled expansion-only in pilot OS list; excluded from pilot scope | Not available in the pilot. Requires production marketplace engineering and commercial approval before activation. | Yes |

---

### 5. Commercial Claims

| Claim | Page | Maturity | Evidence | Limitation | Approved |
|---|---|---|---|---|---|
| Alignment and Discovery Fee | PartnerCommercial | Indicative | Component labelled: indicative assumption / to-be-validated | Not an approved price. Subject to proposal and scope agreement. | Yes — with status label |
| Configuration and Implementation | PartnerCommercial | Subject to proposal | Component labelled: subject-to-proposal | Not an approved price. Partner and deployment partner engagement required. | Yes — with status label |
| Platform Licence (pilot) | PartnerCommercial | Indicative | Component labelled: indicative assumption | Not approved. Subject to scope, property count and operating system selection. | Yes — with status label |
| Property Deployment Licence | PartnerCommercial | Subject to proposal | Component labelled: subject-to-proposal | Not approved. Requires production integration and commercial agreement. | Yes — with status label |
| Connector and Integration Engineering | PartnerCommercial | Subject to proposal | Component labelled: customer-specific / subject-to-proposal | Not approved. Depends on integration complexity and system type. | Yes — with status label |
| Managed Intelligence and Support | PartnerCommercial | Subject to proposal | Component labelled: subject-to-proposal | Not approved. SLA level and support tier to be agreed. | Yes — with status label |
| Training and Change Management | PartnerCommercial | Subject to proposal | Component labelled: customer-specific | Not approved. Depends on property count and deployment partner model. | Yes — with status label |
| Expansion OS Licence | PartnerCommercial | Subject to proposal | Component labelled: subject-to-proposal | Not approved. Expansion OSes are activated individually; each requires separate commercial agreement. | Yes — with status label |
| Partner Service Revenue Share | PartnerCommercial | Partner-specific | Component labelled: partner-specific / unapproved | No revenue share agreement exists. Unapproved commercial model — clearly marked. | Yes — with warning label |
| Transaction Revenue Share (Marketplace) | PartnerCommercial | Unapproved | Component labelled: unapproved / pilot-dependent | Not approved. Marketplace and Loyalty Activation is expansion-only. This component is labelled as unapproved and carries an explicit warning. | Yes — with warning label |
| Proof Calculator output values | PartnerProofCalculator | Indicative | Calculator header states "All outputs are indicative estimates for discussion purposes only". Output footer states "indicative estimate only". | Outputs are mathematical models based on user-entered assumptions. Not based on RTBX deployment data. Not guaranteed. Default values are illustrative. | Yes |
| Value Framework outcome metrics and targets | PartnerCommercial | Mixed — see maturity column per item | Each item shows maturity (demonstrated / architecturally-defined / pilot-dependent / not-yet-measured) and target status (pilot-target / to-be-validated / indicative-assumption) | Framework items have different maturity levels. Pilot-dependent and not-yet-measured items require production data. | Yes |

---

### 6. Partner Ecosystem Claims

| Claim | Page | Maturity | Evidence | Limitation | Approved |
|---|---|---|---|---|---|
| Six partner lanes (Signal, Governance, Intervention, Technology, Deployment, Distribution) | PartnerEcosystem | Architecturally defined | Partner lane structure with contribution matrices defined in travelPartnerEcosystem.ts | No named partner agreements are confirmed. All commercial models are indicative. Maturity varies by lane. | Yes |
| Partnership pathway (5 stages: Identify → Align → Pilot → Prove → Expand) | PartnerEcosystem | Planned (working pathway) | Pathway stages documented with criteria and outputs | No partner has completed the full pathway in a production environment. | Yes |
| RTBX ownership boundary (Intelligence Engine, 6 layers, Spine, Ledgers) | PartnerEcosystem, PartnerOperationsModel | Architecturally defined | Capability list defined in travelPartnerEcosystem.ts; demonstrated in Partner Room | Architecture is working in the demonstration environment. Production capabilities require engineering confirmation. | Yes |

---

### 7. Deployment and Rollout Claims

| Claim | Page | Maturity | Evidence | Limitation | Approved |
|---|---|---|---|---|---|
| Hotels and Resorts are the primary deployment environment | PartnerDeployments | Pilot-ready | Primary market section in PartnerDeployments.tsx; Hotel Moment Response and Service Recovery Pilot defined | No hotel production deployment has completed. This is the target first pilot environment. | Yes |
| Hotel Groups are a secondary expansion environment | PartnerDeployments | Planned | Secondary section in PartnerDeployments.tsx; listed as post-pilot expansion | Not in current pilot scope. Expansion requires pilot completion and commercial agreement. | Yes |
| Holiday Parks are a secondary expansion environment | PartnerDeployments | Planned | Secondary section in PartnerDeployments.tsx | Not in current pilot scope. | Yes |
| Four-stage rollout (Demonstration → Pilot → Production → Scale) | PartnerRolloutModel | Architecturally defined | Rollout model with includes/excludes for each stage defined in PartnerRolloutModel.tsx | Model is the intended pathway. No property has completed all four stages. Demonstration stage is the current position. | Yes |
| 7-stage expansion pathway | PartnerPilotModel | Planned | Expansion stages from travelPilotModel.ts rendered in PartnerPilotModel | No expansion has occurred. Pathway is the planned architecture based on pilot model design. | Yes |

---

### 8. Demo and View Claims

| Claim | Page | Maturity | Evidence | Limitation | Approved |
|---|---|---|---|---|---|
| Guest View shows only approved guest-facing content | PartnerGuestDemo, PartnerOperationsCentre (Guest tab) | Working Proof | Guest phone frame in PartnerGuestDemo shows only guest-facing messages, actions and confirmations. GuestPanel in PartnerOperationsCentre filters communications to `isGuestFacing: true` only | Internal notes, escalation logic, staff performance data and risk classifications are not visible in the Guest View. Simulated content only. | Yes |
| Operator View shows signal, context, decision, role, action, comms, evidence, outcome | PartnerOperatorDemo, PartnerOperationsCentre (Operator tab) | Working Proof | Operator moment cards and ExecTracePanel both render all required operator fields | Data is synthetic. Not from a live deployment. | Yes |
| Dual View uses consistent scenario state across both panes | PartnerDualViewDemo | Working Proof | Both Guest and Operator panes reference the same `stepIdx` and `scenario` state; timestamps are narrative-consistent | Dual view is a demonstration walkthrough, not a live split-screen of a production deployment. | Yes |
| Execution Centre displays active deployment, scenario, stage, status, accountable role, next action, approval requirement, escalation status, evidence completion, outcome status, learning | PartnerOperationsCentre | Working Proof | ExecTracePanel renders all fields; `canTransition` blocks invalid state changes; `blockMessage` explains blocked states; evidence percentage shown; outcome recording shown; learning panel generated at close | Execution data is synthetic and session-only. State is not persisted after browser refresh. No live system connected. | Yes |

---

### 9. Resource Library Claims

| Claim | Page | Maturity | Evidence | Limitation | Approved |
|---|---|---|---|---|---|
| 14 displayable documents with full metadata (title, audience, owner, version, confidentiality, maturity, last reviewed) | PartnerBriefLibrary | Working | All 14 RESOURCE_DOCS entries verified with all required fields. Internal-only documents excluded from display. | Documents are living working versions (v0.5). Content evolves with each sprint. | Yes |
| Commercially restricted documents are labelled and filtered | PartnerBriefLibrary | Working | 2 commercially restricted documents (Commercial Pathway, Proof Calculator) carry `commercialStatus` label and orange warning indicator | Access to the detailed content remains through the Partner Room — no login-gating implemented in the demonstration environment. | Yes |
| Internal-only documents are not accessible from general partner navigation | PartnerBriefLibrary | Working | `DISPLAYABLE_DOCS` filter excludes all `confidentiality: "internal-only"` records | Internal documents are excluded from the displayed list but the filter is a client-side exclusion only. This is a demonstration environment — not a production access-controlled system. | Yes |

---

## Approved Maturity Labels in Use

The following maturity labels appear in the Partner Room and are approved for use:

| Label | Used in | Approved |
|---|---|---|
| Working Proof | Scenarios, Playbooks, Operator/Guest Views | Yes |
| Prototype | PartnerTravelScenarios (proof type) | Yes |
| Simulation | Scenarios 05, 06; Operator Demo KPI; Proof Calculator | Yes |
| Planned | Integrations, Expansion OSes, some partner lanes | Yes |
| Mapped | Integration records (PMS, Housekeeping, CRM, Maintenance, Guest Messaging) | Yes |
| Architecturally defined | Partner Ecosystem, Rollout Model, Value Framework items | Yes |
| Pilot-dependent | Value Framework items where outcome requires pilot data | Yes |

## Prohibited Labels

The following labels must NOT be used without confirmed evidence:

| Label | Why prohibited |
|---|---|
| Production (for any integration) | No production deployment has occurred |
| Connected | Would imply a live integration exists |
| Live data | No live system is connected in the Partner Room |
| Guaranteed | No financial or operational outcome is guaranteed |
| Approved pricing | No commercial pricing has been approved |
| Connector-ready | Removed from IntegrationMaturity type in Sprint 5 — use Mapped or Planned instead |

---

## Change Log

| Sprint | Changes |
|---|---|
| Sprint 3 | Initial scenario and playbook canonical contract. All 7 scenarios with proof, maturity, limitations. |
| Sprint 4 | Runtime engine, evidence ledger, outcome ledger, value dashboard. Working Proof labels on runtime. |
| Sprint 5 | Partner ecosystem, pilot model, commercial model, integration responsibility matrix. CommercialStatus and CommercialSourceStatus type system. All commercial components labelled. Marketplace expansion-only enforced. |
| Sprint 5 QA | Execution Centre "live moment" text corrected to "demonstration". Operator demo KPI strip labelled SYNTHETIC DEMO DATA. This register created. |
