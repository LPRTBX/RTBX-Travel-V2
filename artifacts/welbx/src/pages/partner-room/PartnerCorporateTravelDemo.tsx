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
    summary: "Live data received", status: "DETECTED",
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
      "Classification confidence: 93% — corporate profile + duty-of-care flag + schedule pressure confirmed",
      "Moment sub-type: delayed arrival + workspace urgency — policy-compliant pathway required",
      "Escalation threshold set: 60 minutes — corporate travel manager notification if unresolved",
      "Linked playbooks: corp-arrival-recovery + duty-of-care-L2 + managed-travel-priority",
    ],
    roles: {
      "Guest / Traveller": "The system has recognised this as a corporate duty-of-care moment — the traveller will receive policy-compliant priority support, not a standard delay message.",
      "Operator": "Classification confirmed: corporate duty-of-care, productivity at risk. Playbook: corp-arrival-recovery. Corporate travel manager: on standby. Timer: 60 min.",
      "Command / Assurance": "Moment #7841 | CORPORATE_DUTY_OF_CARE | L2 | Confidence: 93% | Playbook: corp-arrival-recovery | DOC: active | Timer: 60 min",
    },
  },
  {
    key: "decide", label: "Decide", color: "#c9a84c", icon: "◇",
    summary: "Response selected", status: "DECIDED",
    detail: [
      "Priority express check-in activated — fast-track process, front desk pre-briefed",
      "Policy-compliant room offer prepared — within approved accommodation tier",
      "Workspace confirmed — business centre or room workspace, available immediately",
      "Transport option queued — taxi pre-approved within policy, ready on request",
      "Meal credit activated — within policy allowance, delivered via Guest Channel",
      "Escalation threshold: if DOC not resolved in 60 min, corporate travel manager alerted",
    ],
    roles: {
      "Guest / Traveller": "Traveller receives a direct message: express check-in ready, workspace confirmed, meal credit loaded, transport standing by. No policy friction.",
      "Operator": "Front desk action card: express check-in for Reynolds, D. (Meridian). Room: 420 (policy tier, approved). Workspace: business centre open. Update at 30 min.",
      "Command / Assurance": "Decision record created. Playbook activated: corp-arrival-recovery. Actions queued: 4. DOC compliance: confirmed. Corporate contact: standing by.",
    },
  },
  {
    key: "execute", label: "Execute", color: "#10b981", icon: "◉",
    summary: "Actions delivered", status: "EXECUTING",
    detail: [
      "Guest Channel message sent — express check-in instructions, workspace details, meal credit: A$45",
      "Front desk briefed — Reynolds, D. flagged as priority, express lane prepared",
      "Room 420 ready and confirmed — housekeeping priority completed at 08:42",
      "Business centre pre-opened — reserved session logged, keycard access activated",
      "Transport confirmed — taxi pre-booked for 18:30 return, within policy",
      "Corporate travel manager notified — update sent: traveller arrived, support active, DOC met",
    ],
    roles: {
      "Guest / Traveller": "\"Mr. Reynolds — express check-in is waiting for you. Your room is ready, the business centre is reserved and your meal credit is loaded. Transport is confirmed for 18:30.\"",
      "Operator": "EXECUTION LOG: Express check-in prepared. Room 420: ready 08:42. Business centre: reserved. Meal credit: activated. Transport: booked. Corporate manager: notified.",
      "Command / Assurance": "Moment #7841 | STATUS: EXECUTING | Check-in: prepared | Room: ready | Workspace: reserved | DOC: active | Transport: confirmed | Timer: 44 min remaining",
    },
  },
  {
    key: "assure", label: "Assure", color: "#22d3ee", icon: "◍",
    summary: "Outcome confirmed", status: "ASSURED",
    detail: [
      "Traveller checked in at 09:04 — within 60-minute duty-of-care window",
      "Meetings started on time — workspace confirmed, no productivity loss",
      "Policy compliance confirmed — room, meal and transport all within approved limits",
      "Duty of care met — DOC record closed, all thresholds maintained",
      "Corporate travel manager confirmed receipt of update — account: no escalation",
      "Assurance record closed — complete policy and DOC evidence trail logged",
    ],
    roles: {
      "Guest / Traveller": "Checked in at 09:04. First meeting started on time. Meal and transport within policy. No out-of-pocket expenses. Duty of care met.",
      "Operator": "RESOLVED: Check-in 09:04. DOC met. Policy: compliant. Productivity: protected. No escalation to corporate manager required. Record: complete.",
      "Command / Assurance": "Moment #7841 | RESOLVED | DOC: met | Policy: compliant | Check-in: 09:04 | Timer: used 24 of 60 min | Escalation: prevented | Record: closed",
    },
  },
  {
    key: "value", label: "Value", color: COLOR, icon: "◆",
    summary: "Value captured", status: "RECORDED",
    detail: [
      "Estimated productivity protected: ~A$1,200 — 3 meetings delivered on schedule",
      "Duty of care met — zero compliance risk, corporate account protected",
      "Policy compliance confirmed — zero out-of-policy spend, zero exception required",
      "Corporate account retained — Meridian Group satisfaction signal: positive",
      "Staff time saved — guided response: 8 min vs unguided average: 31 min",
      "Assurance record created — DOC and policy evidence trail complete, auditable",
    ],
    roles: {
      "Guest / Traveller": "Trip delivered on schedule. Policy compliant. No friction, no paperwork, no disruption to the day's agenda.",
      "Operator": "Value record: Productivity protected A$1,200 | DOC: met | Policy: zero exceptions | Corporate: satisfied | Staff efficiency: 8 min guided",
      "Command / Assurance": "Value record #7841 | Productivity: protected | DOC: compliant | Account: retained | Assurance: complete | Repeatability: 97% protocol match",
    },
  },
];

const PROOF_POINTS = [
  { label: "Risk reduced", desc: "Duty-of-care obligation met within 60-min window", color: "#10b981" },
  { label: "Escalation prevented", desc: "Corporate travel manager alert not triggered", color: "#10b981" },
  { label: "Revenue protected", desc: "Corporate account retained, no incident raised", color: COLOR },
  { label: "Staff time saved", desc: "8 min guided vs 31 min unguided response average", color: COLOR },
  { label: "Assurance record", desc: "Policy and DOC evidence trail complete and auditable", color: "#a78bfa" },
  { label: "Experience recovered", desc: "Traveller productive from 09:04, schedule intact", color: "#22d3ee" },
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
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: COLOR, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Live Operating Flow · Corporate Travel</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>
            A delayed business traveller, back-to-back meetings.<br />
            <span style={{ color: COLOR }}>Duty of care met. Day intact.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, maxWidth: 620 }}>A managed corporate traveller arrives 2.5 hours late after a flight disruption. Meetings start at 09:00. Policy constraints are active. Duty of care is on the line. This is how RTBX Core handles it.</p>
        </div>

        <div style={{ padding: "22px 28px", background: `${COLOR}06`, border: `1px solid ${COLOR}18`, borderLeft: `3px solid ${COLOR}60`, marginBottom: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
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
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: 0, fontStyle: role === "Guest / Traveller" ? "italic" : "normal" }}>{step.roles[role]}</p>
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
