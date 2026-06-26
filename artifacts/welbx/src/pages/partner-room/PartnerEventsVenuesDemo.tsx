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
    summary: "Live data received", status: "DETECTED",
    detail: [
      "Crowd flow anomaly detected — entry gate throughput 40% below expected at T-45 min to main program",
      "Catering shortfall signal — pre-event F&B stations running 28% below required capacity",
      "Access delay escalating — average queue time 22 min, rising, guest sentiment dropping",
      "Sentiment signal: declining — WELBX engagement drop, complaint signal threshold approaching",
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
      "Classification confidence: 91% — crowd flow + catering + sentiment cross-confirmed",
      "Moment sub-type: pre-program operations failure — window to resolve: 40 min before program impact",
      "Escalation threshold set: 30 min — event director notified if flow not restored",
      "Linked playbooks: crowd-flow-recovery + catering-alert + guest-comms-event",
    ],
    roles: {
      "Guest / Attendee": "The system has identified a live operations risk affecting guest experience before the event starts. A coordinated response is now being assembled.",
      "Operator": "Classification confirmed: pre-program ops risk. Playbooks: crowd-flow-recovery + catering-alert + comms-event. Resolution window: 40 min. Escalation: 30 min.",
      "Command / Assurance": "Moment #9120 | LIVE_EVENT_OPERATIONS_RISK | L2 | Confidence: 91% | Window: 40 min | Escalation timer: 30 min | Playbooks: 3 activated",
    },
  },
  {
    key: "decide", label: "Decide", color: "#c9a84c", icon: "◇",
    summary: "Response selected", status: "DECIDED",
    detail: [
      "Crowd flow action: open secondary gates B and C — staff redeployment from internal positions",
      "Catering alert: activate backup F&B stations 4 and 5, restock from reserve",
      "Guest communication: proactive WELBX message — manage expectations, offer early access incentive",
      "Staff redeployment: 8 internal staff redirected to gates, 4 to F&B backup stations",
      "Escalation path set: event director notified in 30 min if queue time not below 8 min",
      "VIP lane protected — guest tier separation maintained throughout intervention",
    ],
    roles: {
      "Guest / Attendee": "Guests in queue receive a proactive WELBX message with an updated expected entry time and a complimentary welcome drink token as a goodwill gesture.",
      "Operator": "Action card dispatched: open gates B+C now. Redeploy 8 staff. Activate F&B stations 4+5. Guest comms sent. VIP lane: protected. Timer: 30 min to director alert.",
      "Command / Assurance": "Decision record created. Actions queued: 5. Staff redeployment: 12 total. Guest comms: sent. Escalation timer: 30 min. Director: on standby.",
    },
  },
  {
    key: "execute", label: "Execute", color: "#10b981", icon: "◉",
    summary: "Actions delivered", status: "EXECUTING",
    detail: [
      "Gates B and C opened — staff redeployed, throughput recovering, queue time: 18 min → 11 min",
      "F&B stations 4 and 5 activated — restocked from reserve, operational at 19:28",
      "Guest WELBX message sent — 2,840 attendees notified, welcome drink token delivered",
      "Staff redeployment complete — 12 staff repositioned, gate throughput improving",
      "VIP lane confirmed — separate entrance maintained, zero VIP impact",
      "Event director status update sent — situation active, recovery in progress, no escalation required yet",
    ],
    roles: {
      "Guest / Attendee": "\"We're managing a higher-than-expected arrival flow. Your entry time is approximately 11 minutes — enjoy a complimentary welcome drink from any bar on entry. Thanks for your patience.\"",
      "Operator": "EXECUTION: Gates B+C open 19:22. F&B stations active 19:28. Queue: 22→11 min. Staff: redeployed. Guest comms: delivered. Director: updated. No escalation yet.",
      "Command / Assurance": "Moment #9120 | STATUS: EXECUTING | Gates: B+C open | F&B: active | Queue: 11 min | Guest comms: delivered | Timer: 18 min remaining",
    },
  },
  {
    key: "assure", label: "Assure", color: "#22d3ee", icon: "◍",
    summary: "Outcome confirmed", status: "ASSURED",
    detail: [
      "Queue time recovered to 6 min by 19:48 — within 30-min escalation window",
      "Program started on time at 20:00 — no schedule impact",
      "Guest sentiment signal recovered — complaint threshold not reached, WELBX: positive",
      "F&B throughput normalised — stations 4 and 5 remain active through main program",
      "Event director not escalated — situation resolved within managed window",
      "Assurance record closed — actions evidenced, outcome confirmed, post-event review queued",
    ],
    roles: {
      "Guest / Attendee": "Guests entered in time for the program. Sentiment recovered. Welcome drink received. No complaint signals detected during or after entry.",
      "Operator": "RESOLVED: Queue 6 min at 19:48. Program on time. Sentiment: positive. Director: no escalation. F&B: normalised. Evidence trail: complete.",
      "Command / Assurance": "Moment #9120 | RESOLVED | Queue: 6 min | Program: on time | Sentiment: recovered | Escalation: prevented | Record: closed",
    },
  },
  {
    key: "value", label: "Value", color: COLOR, icon: "◆",
    summary: "Value captured", status: "RECORDED",
    detail: [
      "Guest experience protected — 2,840 attendees entered without significant disruption",
      "Incident risk reduced — escalation to event director prevented, no external complaint",
      "Revenue protected — estimated $8,400 F&B spend preserved through catering recovery",
      "Staff time optimised — guided redeployment: 14 min vs unguided average: 38 min",
      "Event reputation maintained — no social media escalation, no formal complaint filed",
      "Assurance record created — full incident and resolution evidence, post-event learnable",
    ],
    roles: {
      "Guest / Attendee": "Event started on time. Welcome drink received. A minor flow issue was handled without reaching guests as a problem.",
      "Operator": "Value record: Guest experience: protected | Revenue: $8,400 | Escalation: prevented | Staff time: 14 min guided | Reputation: maintained",
      "Command / Assurance": "Value record #9120 | Guests protected: 2,840 | Revenue: $8,400 | Escalation: 0 | Assurance: complete | Repeatability: confirmed",
    },
  },
];

const PROOF_POINTS = [
  { label: "Risk reduced", desc: "Crowd flow and catering issues resolved before program impact", color: "#10b981" },
  { label: "Escalation prevented", desc: "Event director alert not triggered — 30-min window met", color: "#10b981" },
  { label: "Revenue protected", desc: "$8,400 estimated F&B spend preserved", color: COLOR },
  { label: "Staff time saved", desc: "Guided redeployment: 14 min vs unguided 38 min average", color: COLOR },
  { label: "Assurance record", desc: "Full incident and resolution evidence trail created", color: "#a78bfa" },
  { label: "Experience recovered", desc: "2,840 guests entered on time, sentiment positive", color: "#22d3ee" },
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
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: COLOR, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Live Operating Flow · Events & Venues</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>
            A crowd flow issue, 40 minutes to program start.<br />
            <span style={{ color: COLOR }}>Resolved before any guest noticed.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, maxWidth: 620 }}>A guest flow anomaly emerges 45 minutes before a major event program. Catering is under capacity, queue times are rising and sentiment is starting to drop. This is how RTBX Core responds in real time.</p>
        </div>

        <div style={{ padding: "22px 28px", background: `${COLOR}06`, border: `1px solid ${COLOR}18`, borderLeft: `3px solid ${COLOR}60`, marginBottom: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
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
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Operating Flow · Step {activeStep + 1} of {FLOW_STEPS.length}</div>
          <div style={{ display: "flex", gap: 2 }}>
            {FLOW_STEPS.map((s, i) => (
              <button key={s.key} onClick={() => setActiveStep(i)} style={{ flex: 1, padding: "14px 8px", background: i === activeStep ? `${s.color}12` : "rgba(255,255,255,0.02)", border: `1px solid ${i === activeStep ? s.color + "50" : "rgba(255,255,255,0.07)"}`, borderTop: `2px solid ${i === activeStep ? s.color : "transparent"}`, cursor: "pointer", textAlign: "center", transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
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
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>Proof of Value</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
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
