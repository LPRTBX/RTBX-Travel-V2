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
  { label: "Signal Detected",    core: signal,   action: "Signal flagged and queued",           owner: "RTBX Core (automated)",       log: "Signal event created · timestamp recorded" },
  { label: "Moment Classified",  core: classify, action: "Moment category and level assigned",   owner: "RTBX Core · Classification engine", log: "Moment record created · category + level logged" },
  { label: "Decision Selected",  core: decide,   action: "Playbook match found and triggered",   owner: "RTBX Core · Decision engine",  log: "Decision record created · playbook ID logged" },
  { label: "Intervention Executed", core: execute, action: "Staff task and guest comms issued",  owner: "Assigned staff member",        log: "Intervention record · owner assigned · timer started" },
  { label: "Outcome Assured",    core: assure,   action: "Completion confirmed and logged",       owner: "Staff + RTBX Core (verification)", log: "Outcome record · evidence attached · assurance complete" },
  { label: "Value Captured",     core: value,    action: "Value metric calculated and stored",    owner: "RTBX Core · Analytics",        log: "Value record · KPI updated · partner report generated" },
];

const SCENARIO_DATA: Record<ScenarioKey, ScenarioData> = {
  "Arrival friction": {
    stages: buildStages(
      "Check-in queue exceeded 8 min + 3 guests flagged sentiment drop in Guest View",
      "ARRIVAL_FRICTION · Hospitality · Guest-facing impact detected",
      "Queue relief protocol: mobile check-in activation + lounge access offer",
      "Staff alerted · Mobile check-in link pushed to queue · Lounge opened",
      "11 of 13 guests used mobile check-in. Average queue reduced to 2 min.",
      "A$1,240 estimated value protected · 3 reviews protected · 11 NPS points recovered"
    ),
    roles: {
      guest: "\"While you wait — skip the queue with mobile check-in. Your room is ready and your key is on your phone.\"",
      operator: "ACTION: Queue relief activated. Mobile check-in pushed to 13 guests. Lounge access open. Monitor until resolved.",
      command: "Moment #3812 | ARRIVAL_FRICTION | L1 | STATUS: RESOLVING | Queue: 2 min avg | 11/13 guests mobile | Owner: Front Desk",
      partner: "Arrival friction triggers: ~34/month | Mobile check-in activation rate: 84% | Value protected: ~A$42k/month | NPS recovery: consistent",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "Emergency protocol + duty manager alert added" : r === "Level 2: Escalated intervention" ? "Manager alert triggered at 12 min" : "Standard arrival relief protocol",
  },
  "Service recovery": {
    stages: buildStages(
      "Guest sentiment score dropped to 1.9 in Guest View after room assignment",
      "SERVICE_RECOVERY · Hospitality · Guest dissatisfaction · L1",
      "Immediate proactive contact + room upgrade offer activated",
      "Front desk alert issued. Room 614 (upgrade) reserved. Guest Channel message sent.",
      "Guest accepted upgrade at 14:47. Staff completed at 14:53. Confirmed.",
      "A$420 value protected · Negative review prevented · Guest NPS: +2.5"
    ),
    roles: {
      guest: "\"We noticed your room wasn't quite right. We've arranged an upgrade for you — our team will be with you in 5 minutes.\"",
      operator: "ACTION: Room 412 → 614 upgrade approved. Assigned: Front Desk (Sarah). Deadline: 15:00. Voucher: F&B A$30 attached.",
      command: "Moment #4421 | SERVICE_RECOVERY | RESOLVED | Time-to-resolution: 6 min | Owner: Front Desk | Evidence: staff note + guest confirmation",
      partner: "Service recovery rate: 94% | Avg resolution: 7 min | Value protected/month: A$34,200 | This scenario repeats ~82×/month",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "General Manager notified · External review monitoring activated" : r === "Level 2: Escalated intervention" ? "Duty manager escalated + compensation pre-approved" : "Front desk proactive contact",
  },
  "Guest welfare": {
    stages: buildStages(
      "Welfare signal: elderly solo guest, day 3 no F&B activity, no app engagement",
      "GUEST_WELFARE · Solo traveller · Extended inactivity pattern · L2",
      "Welfare check protocol: courteous contact initiated, staff briefed",
      "Dedicated staff member assigned. Discreet welfare check actioned at 10:15.",
      "Guest confirmed safe and well. Assistance with mobility offered and accepted.",
      "Welfare outcome recorded · No incident · Guest satisfaction maintained"
    ),
    roles: {
      guest: "\"Good morning — we just wanted to check you're comfortable and have everything you need. Is there anything we can arrange for you?\"",
      operator: "WELFARE CHECK: Room 208 · Solo guest · Day 3 · Assign senior staff for discreet check. Record outcome. No alarm raised unless needed.",
      command: "Moment #5503 | GUEST_WELFARE | L2 | STATUS: RESOLVED | Check completed: 10:22 | Staff: Maria T. | Outcome: Guest safe, assistance offered",
      partner: "Welfare protocol activations: ~8/month | Zero incidents since protocol deployed | Duty of care compliance: 100% | Family feedback: 4.9/5",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "Emergency services protocol ready · Duty manager on standby" : r === "Level 2: Escalated intervention" ? "Manager informed · Second welfare check scheduled" : "Discreet staff welfare check",
  },
  "Staff load": {
    stages: buildStages(
      "Staff response latency exceeded 12 min across 4 concurrent service requests",
      "STAFF_LOAD · Operational pressure · Service degradation risk · L2",
      "Load redistribution: cross-trained staff reassigned, non-urgent tasks deferred",
      "2 staff redeployed from back-of-house. Triage applied to active requests.",
      "Average response time recovered to 4 min. No guest escalations.",
      "Staff hours optimised · 4 escalations prevented · Guest SLA maintained"
    ),
    roles: {
      guest: "\"Your request is with our team — we'll be with you shortly. Thank you for your patience.\"",
      operator: "LOAD ALERT: Response times at 12 min. Redeploy: Tom (BOH) + Anika (events) to front service. Defer: room turndown until 16:00.",
      command: "Moment #6201 | STAFF_LOAD | L2 | STATUS: STABILISED | Response avg: 4 min | Staff redeployed: 2 | Escalations prevented: 4",
      partner: "Staff load events: ~22/month | Avg resolution: 14 min without RTBX → 4 min with | Escalations prevented: 88 projected/month",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "Duty manager override + emergency staffing request" : r === "Level 2: Escalated intervention" ? "Operations manager alerted + resource request raised" : "Automated load rebalancing",
  },
  "Weather disruption": {
    stages: buildStages(
      "Severe weather alert: 78 outdoor activities scheduled for next 4 hours",
      "WEATHER_DISRUPTION · Multi-guest impact · Activity disruption · L2",
      "Weather contingency protocol: alternative programming activated",
      "28 guests contacted via Guest Channel. Indoor alternatives offered. Refunds queued.",
      "24 guests accepted alternatives. 4 refunds processed. Zero complaints.",
      "A$3,400 revenue protected · 24 bookings retained · 4 refunds issued (vs 28 potential)"
    ),
    roles: {
      guest: "\"Due to weather conditions, your outdoor activity has been moved to our indoor experience centre. Alternatively, we can reschedule or refund.\"",
      operator: "WEATHER: 78 outdoor bookings affected 14:00–18:00. Push alternatives now. Activate indoor venue (capacity: 40). Refund portal open.",
      command: "Moment #7840 | WEATHER_DISRUPTION | L2 | Guests affected: 78 | Alternatives accepted: 24 | Refunds: 4 | Revenue protected: A$3,400",
      partner: "Weather disruption events: ~6/month | Revenue protection rate: 68% | Without RTBX: ~A$18k lost/month | With RTBX: ~A$5.8k lost/month",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "Safety protocol + emergency accommodation coordination" : r === "Level 2: Escalated intervention" ? "Operations manager + all department heads alerted" : "Automated rebooking and alternative offers",
  },
  "Revenue activation": {
    stages: buildStages(
      "High-intent signal: guest viewed spa 3× + added restaurant to wish list",
      "REVENUE_ACTIVATION · Commercial moment · High-value upsell · L1",
      "Personalised offer: spa + dining package at 15% to preferred guest segment",
      "Offer pushed via Guest Channel. Booking link created. Expiry: 2 hours.",
      "Guest booked spa (12:30) + dinner (19:00). Confirmation sent.",
      "A$340 incremental revenue created · Zero marginal cost · Conversion: 1 interaction"
    ),
    roles: {
      guest: "\"Based on your interests — a spa afternoon followed by dinner at The Terrace, 15% off, available today only. Book in one tap.\"",
      operator: "REVENUE MOMENT: Guest in room 318 — high intent signal. Offer: Spa 12:30 + Dinner 19:00 (package, 15% off). Expires 16:00. Monitor.",
      command: "Moment #2209 | REVENUE_ACTIVATION | CONVERTED | Revenue: A$340 | Conversion time: 18 min | Channel: Guest Channel | Zero staff interaction",
      partner: "Revenue activation triggers: ~180/month | Conversion rate: 34% | Avg revenue/conversion: A$280 | Monthly increment: ~A$17k/property",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "N/A for revenue — escalation path not applicable" : r === "Level 2: Escalated intervention" ? "VIP offer queue + concierge follow-up" : "Automated personalised offer push",
  },
  "VIP / high-value guest": {
    stages: buildStages(
      "VIP profile match: platinum loyalty tier + corporate account + suite booked",
      "VIP_GUEST · Priority class · Premium service mode activated · L1",
      "VIP welcome protocol: dedicated concierge, pre-arrival preferences loaded",
      "Concierge briefed. Room personalised. Guest Channel welcome with named greeting sent.",
      "Guest checked in at 15:12. Preferences fulfilled. Concierge confirmed.",
      "A$1,800 LTV protected · Loyalty renewal probability: +42% · Corporate account: retained"
    ),
    roles: {
      guest: "\"Welcome back, Mr. Harrison. Your suite is ready with your preferences. James, your dedicated concierge, will be with you at arrival.\"",
      operator: "VIP ARRIVAL: Mr. Harrison · Suite 901 · Platinum · Corporate: Meridian Group. Concierge: James. Preferences: quiet room, firm pillow, still water. By 15:00.",
      command: "Moment #1104 | VIP_GUEST | ACTIVE | Suite 901 | Concierge: James M. | Preferences: loaded | Corporate: Meridian | Status: on-track",
      partner: "VIP activations: ~22/month | Loyalty renewal uplift: +42% | Corporate account retention: 98% | LTV per VIP activation: ~A$1,800",
    },
    riskModifier: (r) => r === "Level 3: Critical assurance pathway" ? "General Manager involvement + corporate account manager notified" : r === "Level 2: Escalated intervention" ? "Department head briefed + F&B pre-authorised" : "Standard VIP welcome protocol",
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
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
            <strong style={{ color: "rgba(255,255,255,0.75)" }}>Configuration not persisted.</strong> This builder demonstrates how RTBX handles a chosen scenario type through the signal chain. It is not connected to a live configuration or execution system. Full configuration persistence is a Sprint 4 capability.
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
            Select an environment, scenario type, risk level and role view — then step through how RTBX Core handles it.
            The Canonical Contract Preview below shows how the selected scenario type maps to the governed scenario data model.
          </p>
        </div>

        {/* ── Canonical Contract Preview ── */}
        <CanonicalContractPreview builderScenario={scenario} />

        {/* Selectors */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2, marginBottom: 2 }}>
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
            RTBX Core · Signal Chain — click any stage
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 32 }}>
          {/* Step detail */}
          <div style={{ padding: "28px 26px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid #c9a84c" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
              Stage {activeStep + 1} · {step.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "What RTBX Core sees", value: step.core },
                { label: "Action triggered", value: step.action },
                { label: "Owner", value: step.owner },
                { label: "What gets logged", value: step.log },
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
                {roleContent}
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
