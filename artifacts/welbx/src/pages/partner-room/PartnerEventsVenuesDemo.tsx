import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const COLOR = "#a78bfa";

const ROLES = ["Guest / Attendee", "Operator", "Command / Assurance"] as const;
type Role = typeof ROLES[number];

interface FlowStep {
  key: string; label: string; color: string; icon: string;
  summary: string; status: string; detail: string[];
  roles: Record<Role, string>;
}

const FLOW_STEPS: FlowStep[] = [
  {
    key: "signal", label: "Signal", color: "#3b82f6", icon: "◎",
    summary: "Synthetic signal received", status: "DETECTED",
    detail: [
      "Crowd flow anomaly detected — entry gate throughput 40% below expected at T-45 min to main program",
      "Catering shortfall signal — pre-event F&B stations running 28% below required capacity",
      "Access delay escalating — average queue time 22 min, rising, guest sentiment dropping",
      "Sentiment signal: declining — Guest Channel engagement drop, complaint signal threshold approaching",
      "Event schedule pressure — main program start locked at 20:00, no flex in timeline",
    ],
    roles: {
      "Guest / Attendee": "Guests in the entry queue have not yet received any communication. The system has detected the flow issue and is preparing coordinated responses across all channels.",
      "Operator": "Operations dashboard showing: gate throughput anomaly + catering shortfall + queue time 22 min. Priority flag active. Waiting for decision output.",
      "Command / Assurance": "Moment #9120 opened. Signals: crowd_flow_anomaly + catering_shortfall + access_delay + sentiment_drop + schedule_pressure. Classification running.",
    },
  },
  {
    key: "classify", label: "Classify", color: "#a78bfa", icon: "◈",
    summary: "Moment identified", status: "CLASSIFIED",
    detail: [
      "LIVE_EVENT_OPERATIONS_RISK · Events & Venues · Multi-signal · L2",
      "Illustrative rules match: 91% — crowd flow + catering + sentiment inputs",
      "Moment sub-type: pre-program operations failure — window to resolve: 40 min before program impact",
      "Escalation threshold set: 30 min — event director notified if flow not restored",
      "Linked playbooks: crowd-flow-recovery + catering-alert + guest-comms-event",
    ],
    roles: {
      "Guest / Attendee": "Rules classify the synthetic inputs as a pre-program operations risk and show a proposed response for human review.",
      "Operator": "Rules-based classification: pre-program operations risk. Three proposed playbooks; the named event operator remains accountable.",
      "Command / Assurance": "SIMULATION #9120 | RULES-BASED CLASSIFICATION | L2 | Illustrative match: 91% | Human approval required",
    },
  },
  {
    key: "decide", label: "Decide", color: "#c9a84c", icon: "◇",
    summary: "Response proposed", status: "PROPOSED",
    detail: [
      "Proposed crowd-flow action: human review of opening gates B and C and staff redeployment",
      "Proposed catering action: review activation of backup F&B stations 4 and 5",
      "Guest communication draft: expectation-setting and a proposed welcome-drink offer",
      "Modelled redeployment: 8 staff to gates and 4 to F&B stations; no task dispatched",
      "Proposed escalation rule: human review at 30 min if modelled queue time remains above 8 min",
      "VIP lane option shown — operational state not externally confirmed",
    ],
    roles: {
      "Guest / Attendee": "A draft Guest Channel message shows an estimated entry time and proposed welcome-drink token. Nothing is sent or issued.",
      "Operator": "Simulated action card: proposed opening of gates B+C, redeployment of 8 staff and activation of F&B stations 4+5. Guest draft shown. Named operator approval required.",
      "Command / Assurance": "Proposed decision record | Draft actions: 5 | Modelled redeployment: 12 | No guest communication sent | Human approval required",
    },
  },
  {
    key: "execute", label: "Execute", color: "#10b981", icon: "◉",
    summary: "Actions modelled", status: "SIMULATED",
    detail: [
      "Gates B and C modelled as open — indicative queue state: 18 min → 11 min",
      "F&B stations 4 and 5 modelled as active — no staff or stock action dispatched",
      "Guest Channel draft shown for an illustrative 2,840 attendees; no notification or token dispatched",
      "Staff redeployment modelled — 12 proposed positions, no task dispatched",
      "VIP lane state modelled — no operational impact measured",
      "Event director update drafted — no status update or escalation dispatched",
    ],
    roles: {
      "Guest / Attendee": "DRAFT — \"We are modelling a higher-than-expected arrival flow. Proposed entry time: 11 minutes; a welcome-drink option is subject to staff approval.\"",
      "Operator": "SIMULATION: Proposed gate, F&B, queue and staffing states shown. No communication, token, task or director update dispatched.",
      "Command / Assurance": "SIMULATION #9120 | Proposed states only | No external updates | Human operator accountable",
    },
  },
  {
    key: "assure", label: "Assure", color: "#22d3ee", icon: "◍",
    summary: "Outcome modelled", status: "MODELLED",
    detail: [
      "Modelled outcome: queue time could reach 6 min by 19:48",
      "Modelled outcome: program could start at 20:00 without schedule impact",
      "Illustrative sentiment state — not measured from guests or an external channel",
      "Modelled F&B throughput — no live station state available",
      "Potential escalation avoidance — not an achieved operational outcome",
      "Illustrative assurance record shown — post-event validation is Planned",
    ],
    roles: {
      "Guest / Attendee": "Illustrative outcome only: entry before the program with a proposed goodwill option and reduced disruption.",
      "Operator": "MODELLED: Queue, program, sentiment, escalation and F&B outcomes require real pilot evidence.",
      "Command / Assurance": "SIMULATION #9120 | Outcome modelled | No measured sentiment or escalation result",
    },
  },
  {
    key: "value", label: "Value", color: COLOR, icon: "◆",
    summary: "Value modelled", status: "INDICATIVE",
    detail: [
      "Potential guest-experience effect across 2,840 illustrative attendees — not measured",
      "Modelled incident-risk reduction — no external complaint or escalation data connected",
      "Indicative F&B value: A$8,400 assumption for pilot evaluation",
      "Indicative timing: 14 min guided vs 38 min benchmark; pilot measurement Planned",
      "Potential reputation effect — no social or complaint systems connected",
      "Illustrative assurance record — operational evidence collection is Planned",
    ],
    roles: {
      "Guest / Attendee": "Illustrative value state: potentially smoother entry and reduced disruption.",
      "Operator": "INDICATIVE MODEL: 2,840 attendees | F&B A$8,400 assumption | Timing and escalation require pilot measurement",
      "Command / Assurance": "MODEL #9120 | Indicative value only | No measured revenue, reputation or repeatability outcome",
    },
  },
];

const PROOF_POINTS = [
  { label: "Modelled risk", desc: "Proposed crowd-flow and catering intervention", color: "#10b981" },
  { label: "Modelled escalation", desc: "Illustrative 30-min human review point", color: "#10b981" },
  { label: "Indicative value", desc: "A$8,400 F&B assumption; not measured", color: COLOR },
  { label: "Planned metric", desc: "Guided redeployment timing for pilot evaluation", color: COLOR },
  { label: "Illustrative assurance", desc: "Proposed incident evidence trail", color: "#a78bfa" },
  { label: "Modelled experience", desc: "Potential attendee-flow effect; not achieved", color: "#22d3ee" },
];

export default function PartnerEventsVenuesDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState<Role>("Operator");
  const step = FLOW_STEPS[activeStep];

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 120px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
          <Link href="/partner-room/deployments"><span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"}>Deployments</span></Link>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>›</span>
          <span style={{ fontSize: 10, letterSpacing: "0.14em", color: COLOR, textTransform: "uppercase", fontWeight: 700 }}>Events & Venues</span>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: COLOR, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Simulated Operating Flow · Events & Venues</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>
            A crowd flow issue, 40 minutes to program start.<br />
            <span style={{ color: COLOR }}>A response and outcome modelled.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, maxWidth: 620 }}>A synthetic scenario illustrates how JALDO Core could present a rules-based response to crowd-flow and catering indicators for accountable human review.</p>
          <div style={{ marginTop: 18, padding: "12px 16px", border: `1px solid ${COLOR}30`, borderLeft: `3px solid ${COLOR}`, fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 760 }}><strong style={{ color: COLOR }}>Working Proof · Simulation boundary:</strong> Classification is rules-based and communications are drafts. No message, token, task, welfare action, dispatch or external-system update occurs. Humans remain accountable; integrations and pilots are Planned.</div>
        </div>

        <div className="rtbx-grid-3" style={{ padding: "22px 28px", background: `${COLOR}06`, border: `1px solid ${COLOR}18`, borderLeft: `3px solid ${COLOR}60`, marginBottom: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { label: "Environment", value: "Major event venue · 3,200 capacity · Multi-zone layout" },
            { label: "Event Profile", value: "Corporate gala · 2,840 attendees · VIP tier active · Main program: 20:00" },
            { label: "Risk Factors", value: "Crowd flow anomaly · Catering shortfall · Queue time rising · Sentiment declining · 40 min window" },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 8, letterSpacing: "0.18em", color: `${COLOR}80`, textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Simulated Operating Flow · Step {activeStep + 1} of {FLOW_STEPS.length}</div>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {FLOW_STEPS.map((s, i) => (
              <button key={s.key} onClick={() => setActiveStep(i)} style={{ flex: "1 1 70px", minWidth: 0, padding: "14px 8px", background: i === activeStep ? `${s.color}12` : "rgba(255,255,255,0.02)", border: `1px solid ${i === activeStep ? s.color + "50" : "rgba(255,255,255,0.07)"}`, borderTop: `2px solid ${i === activeStep ? s.color : "transparent"}`, cursor: "pointer", textAlign: "center", transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
                onMouseEnter={e => { if (i !== activeStep) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (i !== activeStep) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
              >
                <span style={{ fontSize: 15, color: i === activeStep ? s.color : "rgba(255,255,255,0.2)" }}>{s.icon}</span>
                <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: i === activeStep ? s.color : "rgba(255,255,255,0.28)" }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "36px 32px", background: `${step.color}06`, border: `1px solid ${step.color}22`, marginBottom: 2, minHeight: 260 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.22em", color: step.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{step.label} · {step.summary}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>{step.detail[0]}</div>
            </div>
            <div style={{ padding: "5px 12px", background: `${step.color}15`, border: `1px solid ${step.color}40`, fontSize: 8, letterSpacing: "0.18em", color: step.color, textTransform: "uppercase", fontWeight: 700, flexShrink: 0 }}>● {step.status}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {step.detail.slice(1).map((line, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "11px 14px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: 18, height: 1, background: `${step.color}50`, flexShrink: 0, marginTop: 8 }} />
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>{line}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
            <button onClick={() => setActiveStep(s => Math.max(0, s - 1))} disabled={activeStep === 0} style={{ padding: "9px 18px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: activeStep === 0 ? "default" : "pointer", background: "transparent", color: activeStep === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)", border: `1px solid ${activeStep === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.15)"}` }}>← Previous</button>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>{FLOW_STEPS.map((s, i) => <button key={s.key} onClick={() => setActiveStep(i)} style={{ width: i === activeStep ? 18 : 5, height: 5, borderRadius: 3, background: i === activeStep ? step.color : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", transition: "all 0.2s", padding: 0 }} />)}</div>
            <button onClick={() => setActiveStep(s => Math.min(FLOW_STEPS.length - 1, s + 1))} disabled={activeStep === FLOW_STEPS.length - 1} style={{ padding: "9px 18px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: activeStep === FLOW_STEPS.length - 1 ? "default" : "pointer", background: activeStep === FLOW_STEPS.length - 1 ? "transparent" : step.color, color: activeStep === FLOW_STEPS.length - 1 ? "rgba(255,255,255,0.15)" : "#080c14", border: `1px solid ${activeStep === FLOW_STEPS.length - 1 ? "rgba(255,255,255,0.06)" : step.color}` }}>Next Step →</button>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 1 }}>
            {ROLES.map(r => <div key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "10px 8px", textAlign: "center", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.12s", background: r === role ? `${COLOR}12` : "rgba(255,255,255,0.02)", border: `1px solid ${r === role ? COLOR + "50" : "rgba(255,255,255,0.06)"}`, borderTop: "none", color: r === role ? COLOR : "rgba(255,255,255,0.3)" }}>{r}</div>)}
          </div>
          <div style={{ padding: "22px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.14em", color: COLOR, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>{role} · {step.label}</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: 0, fontStyle: role === "Guest / Attendee" ? "italic" : "normal" }}>{step.roles[role]}</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>Modelled Proof of Value</div>
          <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {PROOF_POINTS.map((pt, i) => (
              <div key={i} style={{ padding: "18px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${pt.color}` }}>
                <div style={{ width: 18, height: 1, background: `${pt.color}60`, marginBottom: 10 }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.72)", marginBottom: 5 }}>{pt.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{pt.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/partner-room/deployments"><div style={{ padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", transition: "all 0.15s" }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#fff"; el.style.borderColor = "rgba(255,255,255,0.4)"; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "rgba(255,255,255,0.5)"; el.style.borderColor = "rgba(255,255,255,0.15)"; }}>← All Environments</div></Link>
          <Link href="/partner-room/next-step"><div style={{ padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: "#c9a84c", color: "#080c14", border: "1px solid #c9a84c", transition: "all 0.15s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}>Request Briefing →</div></Link>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
