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
    summary: "Live data received", status: "DETECTED",
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
      "Classification confidence: 96% — multiple confirming signals across booking, loyalty and sentiment",
      "Moment priority: elevated — Platinum tier triggers enhanced care protocol",
      "Escalation threshold set: 40 minutes — auto-manager alert if unresolved",
      "Linked playbooks: arrival-recovery-premium + loyalty-care-platinum",
    ],
    roles: {
      "Guest / Traveller": "The system has recognised this as a high-priority arrival moment — the guest will receive premium recovery support, not a standard delay message.",
      "Operator": "Classification confirmed: Platinum arrival, room delay, recovery required. Playbook selected: arrival-recovery-premium. Action window: 40 min before escalation.",
      "Command / Assurance": "Moment #3214 | HIGH_VALUE_ARRIVAL_RECOVERY | L2 | Confidence: 96% | Playbook: arrival-recovery-premium | Timer set: 40 min",
    },
  },
  {
    key: "decide", label: "Decide", color: COLOR, icon: "◇",
    summary: "Response selected", status: "DECIDED",
    detail: [
      "Proactive Platinum welcome message — personalised, no apology language, practical options offered",
      "Concierge lounge access activated — Level 2, refreshments and workspace available",
      "Room priority escalation to housekeeping — Room 812 moved to top of queue",
      "F&B gesture queued — complimentary tray to lounge delivered on activation",
      "Luggage storage arranged — porter briefed, guest option sent via Guest Channel",
      "Manager visibility threshold set — duty manager alerted if delay exceeds 40 min",
    ],
    roles: {
      "Guest / Traveller": "Guest receives a warm message with immediate practical options: lounge access, refreshments, luggage storage, estimated room ready time.",
      "Operator": "Front desk receives guided action card: greet Ms. Yamamoto, direct to concierge lounge, confirm F&B tray, update every 10 min. Escalate at 40 min.",
      "Command / Assurance": "Decision record created. Playbook activated: arrival-recovery-premium. Actions queued: 4. Escalation timer: 40 min. Owner: Concierge (J. Martinez).",
    },
  },
  {
    key: "execute", label: "Execute", color: "#10b981", icon: "◉",
    summary: "Actions delivered", status: "EXECUTING",
    detail: [
      "Guest Channel message sent — welcome, lounge invitation, estimated room time: 14:45",
      "Concierge lounge access confirmed — guest acknowledged, arrived at lounge 14:12",
      "Housekeeping priority set — Room 812 reassigned to lead team, estimated ready: 14:40",
      "F&B tray delivered to lounge — 14:18, guest confirmed receipt via Guest Channel",
      "Luggage stored — porter completed, storage receipt sent to guest app",
      "Front desk briefed — guided script loaded, next update due 14:30",
    ],
    roles: {
      "Guest / Traveller": "\"Welcome, Ms. Yamamoto — your room is being prepared as a priority. The concierge lounge on Level 2 is ready for you. We'll send your key directly when ready — estimated 14:45.\"",
      "Operator": "ACTION LOG: Lounge access confirmed 14:12. F&B tray delivered 14:18. Luggage stored. Room 812: priority assigned. Next update: 14:30. No escalation yet.",
      "Command / Assurance": "Moment #3214 | STATUS: EXECUTING | Lounge: confirmed | F&B: delivered | Luggage: stored | Room: priority set | Timer: 22 min remaining",
    },
  },
  {
    key: "assure", label: "Assure", color: "#22d3ee", icon: "◍",
    summary: "Outcome confirmed", status: "ASSURED",
    detail: [
      "Room 812 ready at 14:38 — 2 minutes before 40-min escalation threshold",
      "Guest checked in successfully — digital key sent, acknowledged 14:42",
      "Recovery confirmed — guest sentiment signal recovered to 4.6 via Guest Channel",
      "No negative review signal detected — post-arrival monitoring window active 24 hrs",
      "Staff response logged — concierge J. Martinez: action time 6 min, outcome: positive",
      "Assurance record closed — all actions evidenced, outcome confirmed, file complete",
    ],
    roles: {
      "Guest / Traveller": "Room ready notification received. Digital key sent directly to phone. Guest gave 5-star in-stay rating within 2 hours of check-in.",
      "Operator": "RESOLVED: Room 812 ready 14:38. Guest checked in 14:42. Sentiment: 4.6. No escalation reached. Concierge time: 6 min. Record: complete.",
      "Command / Assurance": "Moment #3214 | RESOLVED | Resolution: 28 min | Escalation: prevented | Sentiment: recovered | LTV: protected | Record: closed | Evidence: complete",
    },
  },
  {
    key: "value", label: "Value", color: COLOR, icon: "◆",
    summary: "Value captured", status: "RECORDED",
    detail: [
      "Estimated value protected: A$680 — recovery of high-value stay, LTV maintained",
      "Negative review risk eliminated — Platinum guest, 28-min resolution, no complaint filed",
      "Staff efficiency: 6 min active concierge time vs 22 min unguided average",
      "Escalation prevented — duty manager intervention not required",
      "Loyalty renewal signal — Platinum tier guest post-stay: re-booking rate +38%",
      "Assurance record created — complete evidence trail, logged to partner dashboard",
    ],
    roles: {
      "Guest / Traveller": "Stay recovered before it was lost. Platinum treatment maintained. Guest left with a positive first impression despite a delayed room.",
      "Operator": "Recovery: 28 min | Value protected: A$680 | Staff time: 6 min | Review risk: eliminated | Escalation: prevented | LTV: maintained.",
      "Command / Assurance": "Value record #3214 | Protected: A$680 | LTV: maintained | Escalation: 0 | Assurance: complete | Repeatability: 94% protocol match rate",
    },
  },
];

const PROOF_POINTS = [
  { label: "Risk reduced", desc: "Sentiment risk intercepted before complaint", color: "#10b981" },
  { label: "Escalation prevented", desc: "Duty manager not required — 28 min resolution", color: "#10b981" },
  { label: "Revenue protected", desc: "A$680 estimated value and LTV maintained", color: COLOR },
  { label: "Staff time saved", desc: "6 min guided vs 22 min unguided response", color: COLOR },
  { label: "Assurance record", desc: "Complete evidence trail created and logged", color: "#a78bfa" },
  { label: "Experience recovered", desc: "Platinum sentiment recovered to 4.6 in-stay", color: "#3b82f6" },
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
            Live Operating Flow · Hotels & Resorts
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>
            A high-value guest arrives early.<br />
            <span style={{ color: COLOR }}>The system responds before she reaches the desk.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, maxWidth: 620 }}>
            A Platinum loyalty guest arrives 3 hours ahead of check-in after a long-haul flight. The room is not ready, the front desk is under load and sentiment risk is rising. This is how RTBX Core handles it.
          </p>
        </div>

        {/* Scenario context */}
        <div style={{ padding: "22px 28px", background: `${COLOR}06`, border: `1px solid ${COLOR}18`, borderLeft: `3px solid ${COLOR}60`, marginBottom: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
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
            Operating Flow · Step {activeStep + 1} of {FLOW_STEPS.length}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {FLOW_STEPS.map((s, i) => (
              <button key={s.key} onClick={() => setActiveStep(i)} style={{
                flex: 1, padding: "14px 8px",
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

        {/* CTAs */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/partner-room/deployments"><div style={{ padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", transition: "all 0.15s" }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#fff"; el.style.borderColor = "rgba(255,255,255,0.4)"; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "rgba(255,255,255,0.5)"; el.style.borderColor = "rgba(255,255,255,0.15)"; }}>← All Environments</div></Link>
          <Link href="/partner-room/next-step"><div style={{ padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: COLOR, color: "#080c14", border: `1px solid ${COLOR}`, transition: "all 0.15s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = COLOR; }}>Request Briefing →</div></Link>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
