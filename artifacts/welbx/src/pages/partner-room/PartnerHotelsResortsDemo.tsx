import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const COLOR = "#c9a84c";

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
      "Early arrival detected — flight data + booking cross-reference: 3 hrs ahead of check-in window",
      "Room readiness delay confirmed — housekeeping status: 35 min behind schedule",
      "Loyalty profile active: Platinum tier — LTV flag applied, elevated care threshold triggered",
      "Sentiment risk rising — Guest Channel engagement signals declining during wait period",
      "Front desk load: elevated — 4 concurrent arrivals, response latency 11 min",
    ],
    roles: {
      "Guest / Traveller": "The guest has arrived early and the app has acknowledged their early arrival signal — a warm holding message is queued but not yet sent.",
      "Operator": "Signal dashboard shows: early arrival + room delay + Platinum profile. Front desk receives a priority flag for this guest before they reach the desk.",
      "Command / Assurance": "Moment #3214 opened. Signals: early_arrival + room_delay + platinum_profile + sentiment_risk. Classification engine running.",
    },
  },
  {
    key: "classify", label: "Classify", color: "#a78bfa", icon: "◈",
    summary: "Moment identified", status: "CLASSIFIED",
    detail: [
      "HIGH_VALUE_ARRIVAL_RECOVERY · Hotels & Resorts · Loyalty tier: Platinum · L2",
      "Illustrative rules match: 96% — synthetic booking, loyalty and sentiment inputs",
      "Moment priority: elevated — Platinum tier triggers enhanced care protocol",
      "Escalation threshold set: 40 minutes — auto-manager alert if unresolved",
      "Linked playbooks: arrival-recovery-premium + loyalty-care-platinum",
    ],
    roles: {
      "Guest / Traveller": "Rules classify this synthetic scenario as a high-priority arrival moment and propose a premium-support draft for human review.",
      "Operator": "Rules-based classification: Platinum arrival and room delay. Proposed playbook: arrival-recovery-premium. A named operator remains accountable.",
      "Command / Assurance": "SIMULATION #3214 | RULES-BASED CLASSIFICATION | L2 | Illustrative match: 96% | Human approval required",
    },
  },
  {
    key: "decide", label: "Decide", color: COLOR, icon: "◇",
    summary: "Response proposed", status: "PROPOSED",
    detail: [
      "Platinum welcome draft — personalised practical options for human approval",
      "Concierge lounge access proposed — availability requires staff confirmation",
      "Room priority proposal — no housekeeping task dispatched",
      "F&B gesture proposed — no order or delivery created",
      "Luggage storage option drafted — no porter task or guest message sent",
      "Proposed manager threshold — a human could alert the duty manager after 40 min",
    ],
    roles: {
      "Guest / Traveller": "A draft message shows proposed lounge, refreshment, luggage and room-time options. Nothing is sent or activated.",
      "Operator": "Illustrative action card for front-desk review. Confirm every option before acting; no task is dispatched.",
      "Command / Assurance": "Proposed decision record | Draft actions: 4 | Owner model: Concierge | Human approval required",
    },
  },
  {
    key: "execute", label: "Execute", color: "#10b981", icon: "◉",
    summary: "Actions modelled", status: "SIMULATED",
    detail: [
      "Guest Channel draft shown — welcome, lounge invitation, estimated room time: 14:45; no message dispatched",
      "Lounge-access state modelled at 14:12 — no access update made",
      "Housekeeping priority modelled — no room assignment or task dispatched",
      "F&B tray state modelled at 14:18 — no order or delivery occurred",
      "Luggage-storage state modelled — no porter task or receipt sent",
      "Front-desk draft brief shown — no staff system updated",
    ],
    roles: {
      "Guest / Traveller": "DRAFT — \"Welcome, Ms. Yamamoto. We propose lounge access while your room is prepared, subject to staff confirmation. Illustrative estimate: 14:45.\"",
      "Operator": "SIMULATION: Proposed lounge, F&B, luggage and room-priority states shown. No message, task, order or external update occurs.",
      "Command / Assurance": "SIMULATION #3214 | Proposed states only | No external updates | Human operator accountable",
    },
  },
  {
    key: "assure", label: "Assure", color: "#22d3ee", icon: "◍",
    summary: "Outcome modelled", status: "MODELLED",
    detail: [
      "Modelled outcome: Room 812 could be ready at 14:38",
      "Modelled check-in state at 14:42 — no digital key sent",
      "Illustrative sentiment value: 4.6 — not measured from a guest channel",
      "Review-risk state modelled — no review platform is connected",
      "Illustrative staff timing: 6 min — requires pilot measurement",
      "Illustrative assurance record shown — pilot validation is Planned",
    ],
    roles: {
      "Guest / Traveller": "Illustrative outcome only: a room-ready draft and digital-key option with potentially improved arrival experience.",
      "Operator": "MODELLED: Room, check-in, sentiment, escalation and timing outcomes require real pilot evidence.",
      "Command / Assurance": "SIMULATION #3214 | Outcome modelled | No measured sentiment, loyalty or escalation result",
    },
  },
  {
    key: "value", label: "Value", color: COLOR, icon: "◆",
    summary: "Value modelled", status: "INDICATIVE",
    detail: [
      "Indicative value: A$680 assumption for pilot evaluation; not measured",
      "Potential review-risk reduction — no complaint or review outcome verified",
      "Indicative timing: 6 min guided vs 22 min benchmark; pilot measurement Planned",
      "Potential escalation reduction — not an achieved outcome",
      "Illustrative loyalty hypothesis: +38% re-booking assumption, not a measured signal",
      "Illustrative assurance record — partner-dashboard logging is Planned",
    ],
    roles: {
      "Guest / Traveller": "Illustrative value state: potentially improved arrival support despite a delayed room.",
      "Operator": "INDICATIVE MODEL: A$680 assumption | Staff timing, review risk and loyalty effect require pilot measurement",
      "Command / Assurance": "MODEL #3214 | Indicative value only | No measured loyalty, assurance or repeatability outcome",
    },
  },
];

const PROOF_POINTS = [
  { label: "Modelled risk", desc: "Proposed sentiment-risk intervention", color: "#10b981" },
  { label: "Modelled escalation", desc: "Illustrative 40-min human review point", color: "#10b981" },
  { label: "Indicative value", desc: "A$680 stay-value assumption; not measured", color: COLOR },
  { label: "Planned metric", desc: "Guided response timing for pilot evaluation", color: COLOR },
  { label: "Illustrative assurance", desc: "Proposed evidence trail", color: "#a78bfa" },
  { label: "Modelled experience", desc: "Illustrative sentiment only; not measured", color: "#3b82f6" },
];

export default function PartnerHotelsResortsDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState<Role>("Operator");

  const step = FLOW_STEPS[activeStep];

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
          <Link href="/partner-room/deployments">
            <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"}
            >Deployments</span>
          </Link>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>›</span>
          <span style={{ fontSize: 10, letterSpacing: "0.14em", color: COLOR, textTransform: "uppercase", fontWeight: 700 }}>Hotels & Resorts</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: COLOR, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
            Simulated Operating Flow · Hotels & Resorts
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>
            A high-value guest arrives early.<br />
            <span style={{ color: COLOR }}>A proposed response shown for review.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, maxWidth: 620 }}>
            A synthetic scenario illustrates how JALDO Core could present a rules-based response to an early arrival and room delay for accountable human review.
          </p>
          <div style={{ marginTop: 18, padding: "12px 16px", border: `1px solid ${COLOR}30`, borderLeft: `3px solid ${COLOR}`, fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 760 }}><strong style={{ color: COLOR }}>Working Proof · Simulation boundary:</strong> Classification is rules-based and communications are drafts. No message, task, order, guest-service action, dispatch or external-system update occurs. Humans remain accountable; integrations and pilots are Planned.</div>
        </div>

        {/* Scenario context */}
        <div className="rtbx-grid-3" style={{ padding: "22px 28px", background: `${COLOR}06`, border: `1px solid ${COLOR}18`, borderLeft: `3px solid ${COLOR}60`, marginBottom: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { label: "Environment", value: "City hotel · 280 rooms · Business & leisure mix" },
            { label: "Guest Profile", value: "Ms. Yamamoto · Platinum loyalty · Long-haul arrival · Solo" },
            { label: "Risk Factors", value: "Early arrival · Room delay 35 min · Front desk load elevated · Sentiment declining" },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 8, letterSpacing: "0.18em", color: `${COLOR}80`, textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Flow selector */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
            Simulated Operating Flow · Step {activeStep + 1} of {FLOW_STEPS.length}
          </div>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {FLOW_STEPS.map((s, i) => (
              <button key={s.key} onClick={() => setActiveStep(i)} style={{
                flex: "1 1 70px", minWidth: 0, padding: "14px 8px",
                background: i === activeStep ? `${s.color}12` : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === activeStep ? s.color + "50" : "rgba(255,255,255,0.07)"}`,
                borderTop: `2px solid ${i === activeStep ? s.color : "transparent"}`,
                cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
              }}
              onMouseEnter={e => { if (i !== activeStep) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; } }}
              onMouseLeave={e => { if (i !== activeStep) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.02)"; } }}
              >
                <span style={{ fontSize: 15, color: i === activeStep ? s.color : "rgba(255,255,255,0.2)" }}>{s.icon}</span>
                <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: i === activeStep ? s.color : "rgba(255,255,255,0.28)" }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step detail */}
        <div style={{ padding: "36px 32px", background: `${step.color}06`, border: `1px solid ${step.color}22`, marginBottom: 2, minHeight: 280 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.22em", color: step.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{step.label} · {step.summary}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>{step.detail[0]}</div>
            </div>
            <div style={{ padding: "5px 12px", background: `${step.color}15`, border: `1px solid ${step.color}40`, fontSize: 8, letterSpacing: "0.18em", color: step.color, textTransform: "uppercase", fontWeight: 700, flexShrink: 0 }}>
              ● {step.status}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {step.detail.slice(1).map((line, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "11px 14px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: 18, height: 1, background: `${step.color}50`, flexShrink: 0, marginTop: 8 }} />
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>{line}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
            <button onClick={() => setActiveStep(s => Math.max(0, s - 1))} disabled={activeStep === 0} style={{ padding: "9px 18px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: activeStep === 0 ? "default" : "pointer", background: "transparent", color: activeStep === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)", border: `1px solid ${activeStep === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.15)"}`, transition: "all 0.15s" }}>← Previous</button>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {FLOW_STEPS.map((s, i) => <button key={s.key} onClick={() => setActiveStep(i)} style={{ width: i === activeStep ? 18 : 5, height: 5, borderRadius: 3, background: i === activeStep ? step.color : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", transition: "all 0.2s", padding: 0 }} />)}
            </div>
            <button onClick={() => setActiveStep(s => Math.min(FLOW_STEPS.length - 1, s + 1))} disabled={activeStep === FLOW_STEPS.length - 1} style={{ padding: "9px 18px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: activeStep === FLOW_STEPS.length - 1 ? "default" : "pointer", background: activeStep === FLOW_STEPS.length - 1 ? "transparent" : step.color, color: activeStep === FLOW_STEPS.length - 1 ? "rgba(255,255,255,0.15)" : "#080c14", border: `1px solid ${activeStep === FLOW_STEPS.length - 1 ? "rgba(255,255,255,0.06)" : step.color}`, transition: "all 0.15s" }}>Next Step →</button>
          </div>
        </div>

        {/* Role view */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 1 }}>
            {ROLES.map(r => (
              <div key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "10px 8px", textAlign: "center", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.12s", background: r === role ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${r === role ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.06)"}`, borderTop: "none", color: r === role ? COLOR : "rgba(255,255,255,0.3)" }}>
                {r}
              </div>
            ))}
          </div>
          <div style={{ padding: "22px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.14em", color: COLOR, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>{role} · {step.label}</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: 0, fontStyle: role === "Guest / Traveller" ? "italic" : "normal" }}>{step.roles[role]}</p>
          </div>
        </div>

        {/* Proof of value */}
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

        {/* CTAs */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/partner-room/deployments"><div style={{ padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", transition: "all 0.15s" }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#fff"; el.style.borderColor = "rgba(255,255,255,0.4)"; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "rgba(255,255,255,0.5)"; el.style.borderColor = "rgba(255,255,255,0.15)"; }}>← All Environments</div></Link>
          <Link href="/partner-room/next-step"><div style={{ padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: COLOR, color: "#080c14", border: `1px solid ${COLOR}`, transition: "all 0.15s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = COLOR; }}>Request Briefing →</div></Link>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
