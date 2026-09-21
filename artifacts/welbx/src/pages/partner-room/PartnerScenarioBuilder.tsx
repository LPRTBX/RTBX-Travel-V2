import { useState } from "react";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { TRAVEL_SCENARIOS, MATURITY_LABELS, MATURITY_COLORS, type MaturityStatus } from "@/data/travelScenarios";
import { TRAVEL_OPERATING_SYSTEMS } from "@/data/travelOperatingSystems";
import { getTravelRole } from "@/data/travelRoles";

// ── Existing builder data (preserved exactly) ─────────────────────────────────

const ENVS = ["Hotels & Resorts", "Holiday Parks & Outdoor Experiences", "Corporate Travel", "Events & Venues", "Destination & Tourism Operators"];
const SCENARIOS = ["Arrival friction", "Service recovery", "Guest welfare", "Staff load", "Weather disruption", "Revenue activation", "VIP / high-value guest"];
const RISKS = ["Level 1: Early signal", "Level 2: Escalated intervention", "Level 3: Critical assurance pathway"];
const ROLES = ["Guest / Guest View", "Operator View", "Command / Assurance View", "Partner / Funder View"];

const RISK_COLORS: Record<string, string> = {
  "Level 1: Early signal": "#10b981",
  "Level 2: Escalated intervention": "#f97316",
  "Level 3: Critical assurance pathway": "#ef4444",
};

type ScenarioKey = string;
interface StageContent { label: string; core: string; action: string; owner: string; log: string; }
interface RoleContent { guest: string; operator: string; command: string; partner: string; }
interface ScenarioData { stages: StageContent[]; roles: RoleContent; riskModifier: (r: string) => string; }

const buildStages = (signal: string, classify: string, decide: string, execute: string, assure: string, value: string): StageContent[] => [
  { label: "Synthetic Signal", core: signal, action: "Illustrative signal enters the local simulation", owner: "Named operator (accountable)", log: "Illustrative trace entry only · no external record" },
  { label: "Rules Classification", core: classify, action: "Deterministic rules model a category and level", owner: "Named operator (accountable)", log: "Illustrative classification trace only" },
  { label: "Recommendation", core: decide, action: "Rules model a playbook recommendation for human review", owner: "Named decision owner (accountable)", log: "Illustrative recommendation trace only" },
  { label: "Intervention Model", core: execute, action: "Draft task and communication are shown; nothing is dispatched", owner: "Named staff role (accountable)", log: "Illustrative intervention trace only" },
  { label: "Outcome Model", core: assure, action: "Illustrative evidence and outcome are shown, not completed or measured", owner: "Named staff role (accountable)", log: "Illustrative assurance trace only" },
  { label: "Value Model", core: value, action: "Indicative value is modelled, not measured or stored", owner: "Named operator (accountable)", log: "Illustrative value trace only · no partner report" },
];

const SCENARIO_DATA: Record<ScenarioKey, ScenarioData> = {
  "Arrival friction": {
    stages: buildStages(
      "Synthetic input: modelled check-in queue above eight minutes and three fictional sentiment flags",
      "Rules-based classification: ARRIVAL_FRICTION · Hospitality · illustrative guest-impact level",
      "Recommendation: named Front Desk lead reviews mobile check-in and lounge options",
      "Draft only: proposed staff prompt and guest communication remain local with no dispatch or external update",
      "Modelled outcome: mobile check-in uptake and queue timing are illustrative and not measured",
      "Indicative value hypothesis: A$1,240 · review and NPS effects are unmeasured"
    ),
    roles: {
      guest: "\"Unsent draft: a named Front Desk lead could offer mobile check-in or a lounge option after approval.\"",
      operator: "Proposed response: named Front Desk lead reviews queue-relief options; no operational change or guest dispatch occurs.",
      command: "Synthetic trace #3812 | rules-based ARRIVAL_FRICTION classification | modelled timing | named Front Desk lead accountable",
      partner: "Modelled frequency and uptake assumptions | indicative value hypothesis | review and NPS effects unmeasured",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "Proposal: named Duty Manager reviews a critical protocol; no alert or external update" : r === "Level 2: Escalated intervention" ? "Proposal: named Manager reviews escalation at twelve modelled minutes" : "Recommendation: named Front Desk lead reviews the standard arrival pathway",
  },
  "Service recovery": {
    stages: buildStages(
      "Synthetic input: fictional sentiment score of 1.9 after a modelled room allocation",
      "Rules-based classification: SERVICE_RECOVERY · Hospitality · illustrative L1",
      "Recommendation: named Front Desk lead reviews proactive contact and a room-upgrade option",
      "Draft only: proposed staff prompt, room option and guest communication remain local with no dispatch or external update",
      "Modelled outcome: guest response and staff follow-through are not observed or measured",
      "Indicative value hypothesis: A$420 · review and NPS effects are unmeasured"
    ),
    roles: {
      guest: "\"Unsent draft: a named team member could discuss a room option after human approval.\"",
      operator: "Proposed response: Sarah at Front Desk reviews a fictional room option and A$30 voucher; no task, reservation or voucher exists.",
      command: "Synthetic trace #4421 | rules-based SERVICE_RECOVERY classification | modelled timing | named Front Desk lead accountable | no evidence capture",
      partner: "Modelled recovery assumptions, timing and frequency | indicative value only and unmeasured",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "Proposal: named General Manager reviews the pathway; no notification or monitoring update" : r === "Level 2: Escalated intervention" ? "Proposal: named Duty Manager reviews escalation and compensation" : "Recommendation: named Front Desk lead reviews proactive contact",
  },
  "Guest welfare": {
    stages: buildStages(
      "Synthetic input: fictional solo-guest inactivity pattern with no real guest data",
      "Rules-based classification: GUEST_WELFARE · illustrative extended-inactivity pattern · L2",
      "Recommendation: named Duty Manager decides whether a discreet welfare pathway is appropriate",
      "Proposal only: named Welfare Officer could perform a check after approval; no welfare action or dispatch occurs",
      "Modelled outcome: guest safety, assistance and satisfaction are not observed or measured",
      "Indicative duty-of-care illustration only · no incident, evidence or outcome record"
    ),
    roles: {
      guest: "\"Unsent draft: a named staff member could ask whether support is wanted after Duty Manager approval.\"",
      operator: "Proposed welfare review: fictional Room 208 context for named Duty Manager and Welfare Officer decision; no check or record occurs.",
      command: "Synthetic trace #5503 | rules-based GUEST_WELFARE classification | Maria T. shown as accountable human | outcome unmeasured",
      partner: "Modelled welfare-pathway frequency | incident, compliance and feedback indicators are illustrative and unmeasured",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "Proposal: named Duty Manager reviews emergency-services criteria; no contact occurs" : r === "Level 2: Escalated intervention" ? "Proposal: named Manager decides whether a second check is appropriate" : "Recommendation: named Welfare Officer reviews a discreet pathway",
  },
  "Staff load": {
    stages: buildStages(
      "Synthetic input: modelled response latency above twelve minutes across four fictional requests",
      "Rules-based classification: STAFF_LOAD · illustrative operational-pressure risk · L2",
      "Recommendation: named Operations Manager reviews a staffing and deferral proposal",
      "Proposal only: two fictional staff moves and request triage are shown; no roster, task or external system changes",
      "Modelled outcome: response timing and escalation effects are illustrative and unmeasured",
      "Indicative staffing, SLA and escalation hypothesis only · no operational result"
    ),
    roles: {
      guest: "\"Unsent draft: a named team member could provide an update after reviewing the request.\"",
      operator: "Proposed staffing review: named Operations Manager considers fictional roles for Tom and Anika; no roster or task change occurs.",
      command: "Synthetic trace #6201 | rules-based STAFF_LOAD classification | modelled timing | named Operations Manager accountable",
      partner: "Modelled staff-load frequency and timing assumptions | indicative escalation hypothesis, unmeasured",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "Proposal: named Duty Manager reviews an emergency staffing request" : r === "Level 2: Escalated intervention" ? "Proposal: named Operations Manager reviews resources; no alert or request" : "Recommendation: named Operations Manager reviews load-balancing options",
  },
  "Weather disruption": {
    stages: buildStages(
      "Synthetic input: fictional weather alert affecting 78 modelled outdoor activities",
      "Rules-based classification: WEATHER_DISRUPTION · illustrative multi-guest impact · L2",
      "Recommendation: named Operations Manager reviews alternative-programming options",
      "Draft only: guest and staff options await named-human approval; no contact, refund, booking or external update",
      "Modelled outcome: alternative uptake, refund choices and complaints are illustrative and unmeasured",
      "Indicative value hypothesis: A$3,400 · booking and refund effects are unmeasured"
    ),
    roles: {
      guest: "\"Unsent draft: weather alternatives, rescheduling or refunds could be discussed after approval.\"",
      operator: "Proposed weather review: named Operations Manager considers fictional bookings, venue capacity and refund options; no change occurs.",
      command: "Synthetic trace #7840 | rules-based WEATHER_DISRUPTION classification | fictional guest count | outcomes and value unmeasured",
      partner: "Modelled disruption frequency and loss assumptions | indicative comparison only, not a measured revenue result",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "Proposal: named Duty Manager reviews safety and accommodation criteria" : r === "Level 2: Escalated intervention" ? "Proposal: named Operations Manager and department heads review options; no alerts" : "Recommendation: named Operations Manager reviews rebooking and alternative options",
  },
  "Revenue activation": {
    stages: buildStages(
      "Synthetic input: fictional spa views and restaurant preference",
      "Rules-based classification: REVENUE_OPPORTUNITY · illustrative commercial moment · L1",
      "Recommendation: named Commercial Manager reviews a spa-and-dining offer proposal",
      "Unsent draft: proposed offer and booking-link concept remain local with no dispatch, booking or external update",
      "Modelled outcome: spa, dining and guest-response assumptions are illustrative and unmeasured",
      "Indicative revenue hypothesis: A$340 · conversion and cost are unmeasured"
    ),
    roles: {
      guest: "\"Unsent draft: a spa-and-dining option could be considered after named-human approval.\"",
      operator: "Proposed commercial review: named Commercial Manager assesses a fictional 15% package; no offer or booking exists.",
      command: "Synthetic trace #2209 | rules-based REVENUE_OPPORTUNITY classification | indicative A$340 hypothesis | response unmeasured",
      partner: "Modelled opportunity frequency, conversion and average-value assumptions | indicative monthly hypothesis only",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "No commercial action proposed at this level; named Manager review required" : r === "Level 2: Escalated intervention" ? "Proposal: named Concierge reviews a VIP option; no queue or follow-up" : "Recommendation: named Commercial Manager reviews a personalised draft",
  },
  "VIP / high-value guest": {
    stages: buildStages(
      "Synthetic input: fictional platinum tier, corporate account and suite preference",
      "Rules-based classification: VIP_GUEST · illustrative priority class · L1",
      "Recommendation: named Front Office Manager reviews concierge and preference options",
      "Draft only: concierge brief, room-preference proposal and welcome message remain local with no dispatch or external update",
      "Modelled outcome: check-in, preference fulfilment and concierge response are not observed or measured",
      "Indicative LTV hypothesis: A$1,800 · loyalty, retention and renewal are unmeasured"
    ),
    roles: {
      guest: "\"Unsent draft: James could discuss suite preferences after named Front Office Manager approval.\"",
      operator: "Proposed VIP review: named Front Office Manager and James assess fictional suite preferences; no room or concierge task changes.",
      command: "Synthetic trace #1104 | rules-based VIP_GUEST classification | fictional suite context | named Front Office Manager accountable",
      partner: "Modelled VIP frequency, loyalty, retention and LTV assumptions | indicative and unmeasured",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "Proposal: named General Manager and account manager review the pathway; no notification" : r === "Level 2: Escalated intervention" ? "Proposal: named Department Head reviews F&B options; no brief or authorisation" : "Recommendation: named Front Office Manager reviews a VIP welcome draft",
  },
};

const ROLE_KEYS: Record<string, keyof RoleContent> = {
  "Guest / Guest View": "guest",
  "Operator View": "operator",
  "Command / Assurance View": "command",
  "Partner / Funder View": "partner",
};

const ROLE_COLORS: Record<string, string> = {
  "Guest / Guest View": "#3b82f6",
  "Operator View": "#10b981",
  "Command / Assurance View": "#c9a84c",
  "Partner / Funder View": "#a78bfa",
};

// ── Canonical scenario mapping ────────────────────────────────────────────────
// Maps the builder's scenario types to the closest canonical scenario ID
const BUILDER_TO_CANONICAL: Record<string, string> = {
  "Arrival friction":       "repeat-guest-room-not-ready",
  "Service recovery":       "repeat-guest-room-not-ready",
  "Guest welfare":          "distressed-guest",
  "Staff load":             "service-backlog",
  "Weather disruption":     "transport-disruption",
  "Revenue activation":     "premium-guest-opportunity",
  "VIP / high-value guest": "repeat-guest-room-not-ready",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function roleName(id: string): string {
  const role = getTravelRole(id);
  return role ? role.name : id;
}

function Pill({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  const c = color || "#c9a84c";
  return (
    <div onClick={onClick} style={{
      padding: "7px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase", cursor: "pointer",
      border: `1px solid ${active ? c : "rgba(255,255,255,0.08)"}`,
      background: active ? `${c}18` : "transparent",
      color: active ? c : "rgba(255,255,255,0.35)",
      whiteSpace: "nowrap",
    }}>{label}</div>
  );
}

function MaturityBadge({ status }: { status: MaturityStatus }) {
  const color = MATURITY_COLORS[status];
  return (
    <span style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color, border: `1px solid ${color}40`, background: `${color}0d`, padding: "2px 8px" }}>
      {MATURITY_LABELS[status]}
    </span>
  );
}

// ── Canonical Contract Preview panel ─────────────────────────────────────────

function CanonicalContractPreview({ builderScenario }: { builderScenario: string }) {
  const canonicalId = BUILDER_TO_CANONICAL[builderScenario];
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === canonicalId);
  const os = scenario ? TRAVEL_OPERATING_SYSTEMS.find(o => o.id === scenario.operatingSystemId) : null;

  if (!scenario) return null;

  return (
    <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.07)", borderTop: "2px solid #a78bfa", marginBottom: 32 }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 8.5, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#a78bfa" }}>Canonical Contract Preview</div>
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>Closest canonical scenario: <strong style={{ color: "rgba(255,255,255,0.6)" }}>{scenario.title}</strong></div>
        <MaturityBadge status={scenario.maturityStatus} />
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Prototype — configuration not persisted</div>
      </div>

      <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
        {/* Column 1: Core config */}
        <div style={{ padding: "16px 18px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>Core Configuration</div>
          {[
            { label: "Operating System", value: os?.name ?? scenario.operatingSystemId },
            { label: "Trigger Type", value: scenario.trigger.type },
            { label: "Accountable Role", value: roleName(scenario.rolesConfig.accountableRoleId) },
            { label: "Linked Playbook", value: scenario.playbook },
            { label: "Maturity", value: MATURITY_LABELS[scenario.maturityStatus] },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 8.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 700, marginBottom: 3 }}>{row.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{row.value}</div>
            </div>
          ))}
        </div>

        {/* Column 2: Governance + Escalation */}
        <div style={{ padding: "16px 18px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>Governance & Escalation</div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 700, marginBottom: 5 }}>Governance Sources</div>
            {scenario.governanceConfig.sources.slice(0, 3).map(s => (
              <div key={s} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", marginBottom: 3, lineHeight: 1.5 }}>▸ {s}</div>
            ))}
            {scenario.governanceConfig.sources.length > 3 && (
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>+ {scenario.governanceConfig.sources.length - 3} more</div>
            )}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 700, marginBottom: 5 }}>Human Approval Required</div>
            <div style={{ fontSize: 11, color: scenario.governanceConfig.humanApprovalRequired ? "#f97316" : "#10b981" }}>
              {scenario.governanceConfig.humanApprovalRequired ? "Yes" : "No"}{scenario.governanceConfig.approvalRole ? ` — ${roleName(scenario.governanceConfig.approvalRole)}` : ""}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 8.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 700, marginBottom: 5 }}>Escalation Rules</div>
            {scenario.escalation.slice(0, 2).map((esc, i) => (
              <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.45)", marginBottom: 5, lineHeight: 1.5, paddingLeft: 8, borderLeft: "1px solid rgba(249,115,22,0.3)" }}>
                <span style={{ color: "#f97316" }}>→</span> {roleName(esc.escalateToRoleId)}<br />
                <span style={{ color: "rgba(255,255,255,0.3)" }}>{esc.threshold}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Evidence + Outcomes */}
        <div style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>Evidence & Outcomes</div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 700, marginBottom: 5 }}>Required Evidence</div>
            {scenario.evidenceRequirements.filter(e => e.required).slice(0, 3).map(ev => (
              <div key={ev.evidenceType} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", marginBottom: 3, lineHeight: 1.5 }}>● {ev.evidenceType}</div>
            ))}
            {scenario.evidenceRequirements.filter(e => e.required).length > 3 && (
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>+ more</div>
            )}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 700, marginBottom: 5 }}>Outcome Metrics</div>
            {scenario.outcomes.slice(0, 3).map(out => (
              <div key={out.metric} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", marginBottom: 3, lineHeight: 1.5 }}>◆ {out.metric}</div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "8px 10px", background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.15)" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a78bfa", fontWeight: 700, marginBottom: 3 }}>Learning Review Trigger</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>{scenario.learningConfig.reviewTrigger}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PartnerScenarioBuilder() {
  const [env, setEnv] = useState(ENVS[0]);
  const [scenario, setScenario] = useState(SCENARIOS[1]);
  const [risk, setRisk] = useState(RISKS[0]);
  const [role, setRole] = useState(ROLES[1]);
  const [activeStep, setActiveStep] = useState(0);

  const data = SCENARIO_DATA[scenario] || SCENARIO_DATA["Service recovery"];
  const stages = data.stages;
  const riskLabel = data.riskModifier(risk);
  const riskColor = RISK_COLORS[risk];
  const roleKey = ROLE_KEYS[role];
  const roleContent = data.roles[roleKey];
  const roleColor = ROLE_COLORS[role];
  const step = stages[activeStep];

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── PROTOTYPE BANNER ── */}
        <div style={{ padding: "12px 20px", background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.25)", borderLeft: "3px solid #a78bfa", marginBottom: 32, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a78bfa" }}>Prototype</div>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
            <strong style={{ color: "rgba(255,255,255,0.75)" }}>Working Proof · Simulation boundary:</strong> this builder uses synthetic inputs and deterministic, rules-based classification. Actions, evidence and outcomes are illustrative and value is modelled. Communications remain drafts and are never sent or delivered; no task, partner activation or external-system update occurs. Named humans retain accountability. The controls on this page only change local demonstration state.
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Product Proof · Scenario Builder
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>
            Build a Scenario
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 600 }}>
            Select an environment, scenario type, risk level and role view — then step through a model of how JALDO Core could handle it.
            The Canonical Contract Preview below shows how the selected scenario type maps to the governed scenario data model.
          </p>
        </div>

        {/* ── Canonical Contract Preview ── */}
        <CanonicalContractPreview builderScenario={scenario} />

        {/* Selectors */}
        <div className="rtbx-stack-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2, marginBottom: 2 }}>
          {[
            { label: "Environment", items: ENVS, value: env, setter: setEnv, color: "#10b981" },
            { label: "Scenario Type", items: SCENARIOS, value: scenario, setter: setScenario, color: "#c9a84c" },
            { label: "Risk Level", items: RISKS, value: risk, setter: setRisk, color: riskColor },
            { label: "Role View", items: ROLES, value: role, setter: setRole, color: roleColor },
          ].map(group => (
            <div key={group.label} style={{ padding: "16px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>{group.label}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {group.items.map(item => (
                  <div
                    key={item}
                    onClick={() => { group.setter(item); setActiveStep(0); }}
                    style={{
                      padding: "6px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer",
                      borderLeft: `2px solid ${item === group.value ? group.color : "transparent"}`,
                      color: item === group.value ? "#fff" : "rgba(255,255,255,0.3)",
                      background: item === group.value ? `${group.color}10` : "transparent",
                    }}
                    onMouseEnter={e => { if (item !== group.value) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
                    onMouseLeave={e => { if (item !== group.value) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}
                  >{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Risk modifier banner */}
        <div style={{ padding: "10px 16px", background: `${riskColor}0a`, border: `1px solid ${riskColor}30`, borderTop: "none", marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: riskColor }}>{risk}</div>
          <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{riskLabel}</div>
        </div>

        {/* Signal Chain — clickable steps */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
            Illustrative rules-based signal chain — click any stage
          </div>
          <div className="rtbx-stack-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}>
            {stages.map((st, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  padding: "14px 12px",
                  background: i === activeStep ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${i === activeStep ? "#c9a84c50" : "rgba(255,255,255,0.06)"}`,
                  borderTop: `2px solid ${i === activeStep ? "#c9a84c" : "rgba(255,255,255,0.08)"}`,
                  cursor: "pointer",
                }}
                onMouseEnter={e => { if (i !== activeStep) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (i !== activeStep) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ fontSize: 7.5, fontWeight: 800, color: i === activeStep ? "#c9a84c" : "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginBottom: 5 }}>0{i + 1}</div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: i === activeStep ? "#fff" : "rgba(255,255,255,0.38)", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.3 }}>
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step detail + Role view — two columns */}
        <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 32 }}>
          {/* Step detail */}
          <div style={{ padding: "28px 26px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid #c9a84c" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
              Stage {activeStep + 1} · {step.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Synthetic input / model", value: step.core },
                { label: "Illustrative response", value: step.action },
                { label: "Accountable human role", value: step.owner },
                { label: "Illustrative trace", value: step.log },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}>{row.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              <div
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                style={{ padding: "8px 16px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.38)", cursor: activeStep > 0 ? "pointer" : "default" }}
                onMouseEnter={e => { if (activeStep > 0) (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}
              >← Prev</div>
              <div
                onClick={() => setActiveStep(Math.min(stages.length - 1, activeStep + 1))}
                style={{ padding: "8px 16px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(201,168,76,0.4)", color: "#c9a84c", cursor: activeStep < stages.length - 1 ? "pointer" : "default", background: "transparent" }}
                onMouseEnter={e => { if (activeStep < stages.length - 1) (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >Next →</div>
            </div>
          </div>

          {/* Role view */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 1, marginBottom: 2 }}>
              {ROLES.map(r => (
                <div
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1, padding: "9px 4px", textAlign: "center", fontSize: 8, fontWeight: 700, letterSpacing: "0.06em",
                    textTransform: "uppercase", cursor: "pointer",
                    background: r === role ? `${ROLE_COLORS[r]}18` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${r === role ? ROLE_COLORS[r] + "50" : "rgba(255,255,255,0.06)"}`,
                    borderBottom: r === role ? `2px solid ${ROLE_COLORS[r]}` : "1px solid rgba(255,255,255,0.06)",
                    color: r === role ? ROLE_COLORS[r] : "rgba(255,255,255,0.28)",
                  }}
                >
                  {r.split(" ")[0]}
                </div>
              ))}
            </div>
            <div style={{ flex: 1, padding: "28px 26px", background: `${roleColor}06`, border: `1px solid ${roleColor}25`, borderTop: `2px solid ${roleColor}` }}>
              <div style={{ fontSize: 8, letterSpacing: "0.18em", color: roleColor, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
                {role}
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, fontStyle: roleKey === "guest" ? "italic" : "normal" }}>
                Illustrative view only — {roleContent}
              </p>
              <div style={{ marginTop: 24, padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.12em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Context</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
                  {env} · {scenario} · {risk.split(":")[0]}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
