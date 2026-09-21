import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const COLOR = "#3b82f6";

const ROLES = ["Guest / Traveller", "Operator", "Command / Assurance"] as const;
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
      "Delayed arrival detected — flight disruption + corporate booking cross-referenced: 2.5 hrs behind schedule",
      "Corporate profile active — Meridian Group, policy tier: Managed, duty-of-care flag: active",
      "Meeting schedule loaded — 3 back-to-back meetings from 09:00, workspace required",
      "Policy constraint flagged — accommodation cap, approved vendor list, expense rules active",
      "Traveller distress indicator — Guest Channel engagement: declining, app activity: low",
    ],
    roles: {
      "Guest / Traveller": "The app has received the flight delay notification and cross-referenced the corporate booking. A priority support message is queued pending classification.",
      "Operator": "Signal dashboard: delayed corporate arrival + duty-of-care flag + meeting schedule pressure. Priority flag applied to front desk queue for this booking.",
      "Command / Assurance": "Moment #7841 opened. Signals: flight_delay + corporate_profile + doc_flag + schedule_pressure + distress_indicator. Classification running.",
    },
  },
  {
    key: "classify", label: "Classify", color: "#a78bfa", icon: "◈",
    summary: "Moment identified", status: "CLASSIFIED",
    detail: [
      "CORPORATE_DUTY_OF_CARE · Productivity protection · Managed travel tier · L2",
      "Illustrative rules match: 93% — corporate profile + duty-of-care flag + schedule pressure",
      "Moment sub-type: delayed arrival + workspace urgency — policy-compliant pathway required",
      "Escalation threshold set: 60 minutes — corporate travel manager notification if unresolved",
      "Linked playbooks: corp-arrival-recovery + duty-of-care-L2 + managed-travel-priority",
    ],
    roles: {
      "Guest / Traveller": "Rules classify this synthetic scenario as a corporate duty-of-care moment and propose a policy-compliant support draft for human review.",
      "Operator": "Rules-based classification: corporate duty-of-care, productivity at risk. Proposed playbook: corp-arrival-recovery. A named operator remains accountable.",
      "Command / Assurance": "SIMULATION #7841 | RULES-BASED CLASSIFICATION | L2 | Illustrative match: 93% | Proposed playbook | Human approval required",
    },
  },
  {
    key: "decide", label: "Decide", color: "#c9a84c", icon: "◇",
    summary: "Response proposed", status: "PROPOSED",
    detail: [
      "Priority express check-in proposed — fast-track process and front-desk draft brief",
      "Policy-compliant room offer prepared — within approved accommodation tier",
      "Workspace option modelled — business centre or room workspace, subject to operator confirmation",
      "Transport option proposed — policy check shown, no booking made",
      "Meal credit proposed — within modelled policy allowance, not issued",
      "Escalation rule modelled — a human could alert the corporate travel manager after 60 min",
    ],
    roles: {
      "Guest / Traveller": "A draft message shows proposed express check-in, workspace, meal-credit and transport options. Nothing is sent or activated.",
      "Operator": "Illustrative action card: review express check-in and policy-tier room for Reynolds, D. Confirm availability before any action.",
      "Command / Assurance": "Proposed decision record | Draft actions: 4 | Duty-of-care state: modelled | Named human approval required",
    },
  },
  {
    key: "execute", label: "Execute", color: "#10b981", icon: "◉",
    summary: "Actions modelled", status: "SIMULATED",
    detail: [
      "Guest Channel draft shown — express check-in instructions, workspace details, modelled meal credit: A$45; no message dispatched",
      "Front-desk brief displayed — proposed priority flag and express-lane preparation",
      "Room 420 readiness modelled — illustrative housekeeping state at 08:42",
      "Business-centre reservation modelled — no reservation or access update made",
      "Transport option modelled — no taxi booked",
      "Corporate travel manager update drafted — no external notification sent",
    ],
    roles: {
      "Guest / Traveller": "DRAFT — \"Mr. Reynolds — we propose express check-in, workspace, a policy-approved meal credit and transport support, subject to staff confirmation.\"",
      "Operator": "SIMULATION: Proposed check-in, room, workspace, meal and transport states shown for review. No task, booking, credit or update dispatched.",
      "Command / Assurance": "SIMULATION #7841 | Proposed states only | No external updates | Human operator accountable",
    },
  },
  {
    key: "assure", label: "Assure", color: "#22d3ee", icon: "◍",
    summary: "Outcome modelled", status: "MODELLED",
    detail: [
      "Modelled outcome: traveller could check in at 09:04 within the proposed 60-minute window",
      "Modelled outcome: workspace support could reduce schedule disruption",
      "Proposed policy check: room, meal and transport options appear within illustrative limits",
      "Duty-of-care state modelled — not fulfilled or measured by this proof",
      "No corporate travel manager update sent and no escalation outcome measured",
      "Illustrative assurance record shown — pilot validation is Planned",
    ],
    roles: {
      "Guest / Traveller": "Illustrative outcome only: check-in at 09:04 with policy-aligned options and reduced schedule disruption.",
      "Operator": "MODELLED: check-in, duty-of-care, policy and productivity states require real pilot evidence and accountable human confirmation.",
      "Command / Assurance": "SIMULATION #7841 | Outcome modelled | Duty of care not measured | Record illustrative",
    },
  },
  {
    key: "value", label: "Value", color: COLOR, icon: "◆",
    summary: "Value modelled", status: "INDICATIVE",
    detail: [
      "Indicative productivity value: ~A$1,200 — assumption for pilot evaluation, not measured",
      "Proposed duty-of-care support — compliance and account effects are unverified",
      "Illustrative policy state — spend and exceptions are not externally validated",
      "Potential account value — no retention or satisfaction outcome claimed",
      "Indicative time comparison: 8 min guided vs 31 min benchmark; pilot measurement Planned",
      "Illustrative assurance record — auditability requires Planned integration and pilot evidence",
    ],
    roles: {
      "Guest / Traveller": "Illustrative value state: a supported trip with policy-aligned options and potentially lower disruption.",
      "Operator": "INDICATIVE MODEL: Productivity A$1,200 assumption | Duty of care unverified | Staff timing requires pilot measurement",
      "Command / Assurance": "MODEL #7841 | Indicative value only | No measured account, compliance or repeatability outcome",
    },
  },
];

const PROOF_POINTS = [
  { label: "Modelled risk", desc: "Proposed 60-min duty-of-care review window", color: "#10b981" },
  { label: "Modelled escalation", desc: "Illustrates when a human alert could be considered", color: "#10b981" },
  { label: "Indicative value", desc: "Account value hypothesis; not measured", color: COLOR },
  { label: "Planned metric", desc: "Guided versus unguided response time for pilot evaluation", color: COLOR },
  { label: "Illustrative assurance", desc: "Proposed policy and duty-of-care evidence trail", color: "#a78bfa" },
  { label: "Modelled experience", desc: "Potential schedule protection; not an achieved outcome", color: "#22d3ee" },
];

export default function PartnerCorporateTravelDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState<Role>("Operator");
  const step = FLOW_STEPS[activeStep];

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 120px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
          <Link href="/partner-room/deployments"><span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"}>Deployments</span></Link>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>›</span>
          <span style={{ fontSize: 10, letterSpacing: "0.14em", color: COLOR, textTransform: "uppercase", fontWeight: 700 }}>Corporate Travel</span>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: COLOR, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Simulated Operating Flow · Corporate Travel</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>
            A delayed business traveller, back-to-back meetings.<br />
            <span style={{ color: COLOR }}>Duty-of-care response modelled.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, maxWidth: 620 }}>A synthetic scenario illustrates how JALDO Core could present a rules-based response to a delayed managed traveller for accountable human review.</p>
          <div style={{ marginTop: 18, padding: "12px 16px", border: `1px solid ${COLOR}30`, borderLeft: `3px solid ${COLOR}`, fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 760 }}><strong style={{ color: COLOR }}>Working Proof · Simulation boundary:</strong> Classification is rules-based and communications are drafts. No message, task, booking, duty-of-care action, dispatch or external-system update occurs. Humans remain accountable; integrations and pilots are Planned.</div>
        </div>

        <div className="rtbx-grid-3" style={{ padding: "22px 28px", background: `${COLOR}06`, border: `1px solid ${COLOR}18`, borderLeft: `3px solid ${COLOR}60`, marginBottom: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { label: "Environment", value: "Managed corporate travel · City hotel · Business district" },
            { label: "Traveller Profile", value: "Mr. Reynolds · Meridian Group · Managed tier · Solo business" },
            { label: "Risk Factors", value: "Flight delay 2.5 hrs · Meetings from 09:00 · DOC flag · Policy tier active" },
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
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: 0, fontStyle: role === "Guest / Traveller" ? "italic" : "normal" }}>{step.roles[role]}</p>
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
