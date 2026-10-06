import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { TRAVEL_SCENARIOS, MATURITY_LABELS } from "@/data/travelScenarios";
import { TRAVEL_OPERATING_SYSTEMS } from "@/data/travelOperatingSystems";
import { getTravelRole } from "@/data/travelRoles";
import { travelScenarioConfigurePath, travelScenarioExecutionPath, travelScenarioPath } from "@/lib/travelScenarioRouting";
import "./travel-impact.css";

const IMPACT: Record<string, { guest: string; team: string; property: string; expansion: string }> = {
  "repeat-guest-room-not-ready": {
    guest: "Acknowledge the delay, agree the recovery choice and confirm readiness before promising a room.",
    team: "Reception, housekeeping and the duty manager share one owner, deadline and recovery plan.",
    property: "Test whether earlier coordination reduces avoidable waiting, compensation and repeat complaints.",
    expansion: "Compare room-readiness patterns across shifts; later test approved recovery partners and cross-property alternatives.",
  },
  "distressed-guest": {
    guest: "A named human assesses the situation and owns appropriate support and follow-up.",
    team: "Frontline staff escalate to the duty manager or specialist rather than improvise automated welfare advice.",
    property: "Test timely human acknowledgement, restricted information access and documented escalation.",
    expansion: "Review de-identified response gaps across properties while keeping welfare details restricted. Safety is not a revenue metric.",
  },
  "service-backlog": {
    guest: "A delayed request gets an accountable response and an honest update.",
    team: "The operations manager reviews capacity and priorities; staff know which work takes precedence.",
    property: "Test backlog clearance, SLA breaches and whether reallocation creates pressure elsewhere.",
    expansion: "Compare recurring pressure by shift and property; carry reviewed staffing and routing changes into another controlled test.",
  },
  "maintenance-defect": {
    guest: "A room defect gets an assessed response, a safe alternative where needed and verified restoration.",
    team: "Maintenance, reception and the duty manager coordinate isolation, repair and guest communication.",
    property: "Test time to assessment, repair or isolation, repeat defects and unavailable room time.",
    expansion: "Use recurring defect evidence to inform preventative maintenance and approved supplier coordination.",
  },
  "transport-disruption": {
    guest: "The guest receives verified options and chooses an acceptable next step.",
    team: "Guest services and concierge verify disruption, availability, consent and any spending authority.",
    property: "Test acknowledgement, journey recovery and the cost of each approved alternative.",
    expansion: "Later test approved transport and destination partners; receipt of a booking request is not proof the journey was completed.",
  },
  "premium-guest-opportunity": {
    guest: "A relevant optional offer respects preference, consent and eligibility.",
    team: "Revenue and loyalty staff review availability and pricing before an offer or partner activation.",
    property: "Test incremental contribution after incentives, fulfilment costs and displacement—not gross offer value.",
    expansion: "Prototype pathway: approved dining, experience and loyalty partners could widen the offer set. No commercial activation is live today.",
  },
};
const QUESTIONS = [
  ["What is actually working today?", "Local interfaces, configurable scenario definitions, deterministic routing, approval and evidence gates, and synthetic outcome/replay tests. This room does not demonstrate a live PMS connection, real message delivery, task execution or measured hotel ROI."],
  ["Does every scenario use the same loop?", "Yes: Connect → Understand → Decide → Act → Learn. The scenario changes the signal contract, policy, accountable role, playbook, communication, evidence and outcome targets. Inspect those differences below. Activation still depends on the selected deployment configuration."],
  ["What if an action fails or evidence never arrives?", "Failure remains visible. The closed-loop fixture escalates a late or ineffective response; missing receipt or measurement leaves work pending. A late response may be operationally closed while still missing its target. Closure is not a success score."],
  ["Does learning change hotel policy automatically?", "No. The simulator proposes an explicit candidate. A scripted designated reviewer approves or rejects it before a new synthetic replay. Original evidence remains available; candidates are never promoted automatically. An approved candidate can still fail under insufficient capacity."],
  ["What does the 100-signal test prove?", "It exercises 25 distinct synthetic readings from each of four paths: PMS, guest, staff and sensor. Those adapters cover room delay, backlog, maintenance, welfare and transport. The separate outcome fixture checks restoration with a receipt within 20 minutes; it does not validate all six scenarios’ business outcomes or vendor APIs."],
  ["How is value established?", "Agree a baseline and a matched comparison period, then measure incremental outcomes and costs. Deduplicate by event and outcome; do not add staff time, protected revenue and guest recovery if they describe the same benefit. Keep welfare and safety measures separate. The calculator supplies hypotheses for pilot design."],
  ["How does one property become a portfolio?", "Reuse the common architecture, then explicitly configure each property’s sources, roles, policies, consent and outcome definitions. Multi-property coordination and partner fulfilment remain planned capabilities. A proven local response is a starting point, not proof of portfolio or tenant readiness."],
  ["What is needed before a live pilot?", "A sponsor and named operating owner, agreed scenarios, data permissions, approved connector credentials, server-enforced identity and access, channel delivery evidence, failure ownership and a measured evidence plan. The Partner Room code gate is for guided preview; it is not a production security boundary."],
];
const roleName = (id: string) => getTravelRole(id)?.name ?? id;

export default function PartnerImpactMap() {
  const [selectedId, setSelectedId] = useState(TRAVEL_SCENARIOS[0].id);
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === selectedId)!;
  const impact = IMPACT[scenario.id];
  const systems = [scenario.operatingSystemId, ...(scenario.secondaryOperatingSystemIds ?? [])]
    .map(id => TRAVEL_OPERATING_SYSTEMS.find(os => os.id === id)?.name ?? id);
  return <PartnerRoomLayout><main className="travel-impact">
    <header className="travel-impact-hero">
      <p className="travel-impact-eyebrow">JALDO TRAVEL · SCENARIO IMPACT MAP</p>
      <h1>One moment. A coordinated operation. A better next response.</h1>
      <p className="travel-impact-lead">Follow the impact from the guest to the team, the property and the wider ecosystem. Every response has an owner. Every outcome needs evidence. Every improvement earns its next test.</p>
      <div className="travel-impact-stats">
        <div><strong>{TRAVEL_SCENARIOS.length}</strong><span>Canonical scenarios</span></div>
        <div><strong>{TRAVEL_OPERATING_SYSTEMS.length}</strong><span>Operating systems</span></div>
        <div><strong>4</strong><span>Synthetic intake paths</span></div>
        <div><strong>100</strong><span>Distinct hotel readings</span></div>
      </div>
      <p className="travel-impact-boundary">Working Proof using synthetic data. Impact below describes pilot hypotheses and planned expansion—not measured customer results.</p>
    </header>
    <section aria-labelledby="impact-scenarios">
      <h2 id="impact-scenarios">Explore every canonical scenario</h2>
      <div className="travel-impact-picker" role="group" aria-label="Choose impact scenario">
        {TRAVEL_SCENARIOS.map(s => <button key={s.id} aria-pressed={s.id === selectedId} onClick={() => setSelectedId(s.id)}>{s.title}</button>)}
      </div>
      <article className="travel-impact-scenario" aria-live="polite">
        <p className="travel-impact-eyebrow">{MATURITY_LABELS[scenario.maturityStatus]} · {scenario.category}</p>
        <h2>{scenario.title}</h2><p>{scenario.trigger.description}</p>
        <p><strong>Accountable:</strong> {roleName(scenario.rolesConfig.accountableRoleId)} · <strong>Systems:</strong> {systems.join(" + ")}</p>
        <div className="travel-impact-grid">{(["guest", "team", "property", "expansion"] as const).map((layer, i) => <div className="travel-impact-card" key={layer}>
          <span className="travel-impact-eyebrow">0{i + 1} · {layer === "expansion" ? "Portfolio & ecosystem · planned" : layer}</span><p>{impact[layer]}</p>
        </div>)}</div>
        <h3>The operating loop for this scenario</h3>
        <ol className="travel-impact-loop">
          <li><strong>Connect</strong><p>{scenario.signalDetails.map(s => `${s.name} (${s.status})`).join("; ")}</p></li>
          <li><strong>Understand</strong><p>{scenario.context.riskOrOpportunity}</p></li>
          <li><strong>Decide</strong><p>{scenario.decision.decisionRequired}</p><p>{scenario.governanceConfig.humanApprovalRequired ? `Human approval: ${scenario.governanceConfig.approvalRole ?? roleName(scenario.rolesConfig.accountableRoleId)}` : "Accountable role reviews the configured response."}</p></li>
          <li><strong>Act</strong><p>{scenario.actionSteps.map(s => `${roleName(s.ownerRoleId)}: ${s.action}`).join(" · ")}</p></li>
          <li><strong>Learn</strong><p>{scenario.learningConfig.reviewTrigger} {scenario.learningConfig.improvementAction} Proposed changes need human review and a new test.</p></li>
        </ol>
        <details><summary>Inspect policy, communication, escalation and closure requirements</summary>
          <h3>Policy and prohibited actions</h3><ul>{[...scenario.governanceConfig.rules, ...(scenario.governanceConfig.prohibitedActions ?? [])].map(rule => <li key={rule}>{rule}</li>)}</ul>
          <h3>Communication routes</h3><ul>{scenario.communicationDetails.map((c, i) => <li key={i}>{c.audience} · {c.channel} · {c.purpose} · {c.approvalRequired ? "approval required" : "configured draft route"}</li>)}</ul>
          <h3>Escalation</h3><ul>{scenario.escalation.map((e, i) => <li key={i}>{e.trigger} · {e.threshold} → {roleName(e.escalateToRoleId)} · {e.action}</li>)}</ul>
          <h3>Evidence before closure</h3><ul>{scenario.evidenceRequirements.map((e, i) => <li key={i}>{e.required ? "Required" : "Supporting"}: {e.evidenceType} · {roleName(e.ownerRoleId)} · {e.completionRule}</li>)}</ul>
        </details>
        <h3>What the pilot must measure</h3><ul>{scenario.outcomes.map((o, i) => <li key={i}><strong>{o.metric}</strong>{o.target ? ` · target: ${o.target}` : ""} · {o.measure}</li>)}</ul>
        <p className="travel-impact-boundary">{scenario.proof.limitations.join(" ")}</p>
        <div className="travel-impact-actions"><Link href={travelScenarioPath(scenario.id)}>Inspect canonical definition →</Link><Link href={travelScenarioConfigurePath(scenario.id)}>Configure this scenario →</Link><Link href={travelScenarioExecutionPath(scenario.id)}>Check runtime readiness →</Link></div>
      </article>
    </section>
    <section className="travel-impact-section">
      <p className="travel-impact-eyebrow">MAKE THE LOOP VISIBLE</p><h2>Show the success. Then challenge it.</h2>
      <p>Open the Architecture Lab. Run a late response, review its proposed correction, approve it and replay. Then challenge the approved correction with insufficient capacity. Watch the outcome remain unsuccessful.</p>
      <p>In the Simulation Lab, compare the four intake paths, held approvals, missing evidence and outcome journeys. These are separate tests: an intake gate passing does not mean the guest outcome succeeded.</p>
      <div className="travel-impact-actions"><Link href="/partner-room/architecture-lab">Review and replay the loop →</Link><Link href="/partner-room/operations?view=simulation">Run the hotel simulation →</Link><Link href="/partner-room/proof-calculator">Model a value range →</Link></div>
    </section>
    <section className="travel-impact-section"><h2>The questions a serious partner should ask</h2>{QUESTIONS.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
    <section className="travel-impact-finish">
      <p className="travel-impact-eyebrow">SHAPE THE FIRST DEPLOYMENT</p><h2>Your next service failure can become your next operating improvement.</h2>
      <p>The cost of waiting is another shift handling the same recurring problem without a shared evidence loop. A design partnership is the opportunity to shape the scenarios, standards and evidence that your operation needs first.</p>
      <p>Bring one property, three recurring moments and the people accountable for them. Leave the alignment session with a scoped pilot, clear responsibilities and a measurable decision to proceed.</p>
      <div className="travel-impact-actions"><Link href="/partner-room/next-step">Shape a design partnership →</Link><Link href="/partner-room/pilot-model">Inspect the pilot pathway →</Link></div>
    </section>
  </main></PartnerRoomLayout>;
}
