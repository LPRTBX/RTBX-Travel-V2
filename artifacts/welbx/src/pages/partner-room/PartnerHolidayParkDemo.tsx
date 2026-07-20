import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const FLOW_STEPS = [
  {
    key: "signal",
    label: "Signal",
    color: "#3b82f6",
    icon: "◎",
    summary: "Live data received",
    detail: [
      "Late arrival detected — GPS + booking data cross-referenced",
      "Weather disruption logged — local conditions API flagged",
      "Cabin readiness delay confirmed — housekeeping status: 38 mins behind",
      "Family profile active — 2 adults, 2 children under 8",
      "Low patience moment scored — arrival window exceeded by 42 minutes",
    ],
    status: "DETECTED",
  },
  {
    key: "classify",
    label: "Classify",
    color: "#a78bfa",
    icon: "◈",
    summary: "Moment identified",
    detail: [
      "High-risk welcome moment — confidence: 94%",
      "Service recovery opportunity — first impression window active",
      "Family support pathway triggered — child welfare protocol engaged",
      "Escalation risk: elevated — monitor threshold set to 15 mins",
      "Moment category: Arrival Support / Service Recovery",
    ],
    status: "CLASSIFIED",
  },
  {
    key: "decide",
    label: "Decide",
    color: "#c9a84c",
    icon: "◇",
    summary: "Response selected",
    detail: [
      "Trigger proactive arrival support message — personalised to family",
      "Notify front desk — recommended response script prepared",
      "Offer activity alternative — kids' activity zone + weather cover",
      "Queue food & beverage option — park café discount code generated",
      "Local partner option surfaced — indoor experience within 5km",
      "Escalate if cabin delay exceeds 60 minutes — auto-trigger set",
    ],
    status: "DECIDED",
  },
  {
    key: "execute",
    label: "Execute",
    color: "#10b981",
    icon: "◉",
    summary: "Actions delivered",
    detail: [
      "Guest message sent — warm, practical, no apology language",
      "Staff briefed — front desk receives recommended next step",
      "Activity suggestion delivered — kids' zone location + map link",
      "Café offer activated — discount applied to family profile",
      "Operator dashboard updated — moment logged, timer running",
      "Partner experience queued — local indoor venue option ready if needed",
    ],
    status: "EXECUTING",
  },
  {
    key: "assure",
    label: "Assure",
    color: "#22d3ee",
    icon: "◍",
    summary: "Value protected",
    detail: [
      "Action completed — guest acknowledged support offer",
      "Recovery offer logged — café visit recorded 18 mins post-arrival",
      "Guest sentiment checked — no complaint signal detected",
      "Delay reason recorded — housekeeping schedule updated",
      "Escalation prevented — cabin ready before 60-min threshold",
      "Partner value created — local experience opportunity logged",
    ],
    status: "ASSURED",
  },
];

const PROOF_POINTS = [
  { label: "Escalation prevented", color: "#10b981" },
  { label: "Review risk reduced", color: "#10b981" },
  { label: "Staff response made consistent", color: "#c9a84c" },
  { label: "Guest experience recovered", color: "#c9a84c" },
  { label: "Partner / local experience opportunity created", color: "#3b82f6" },
];

export default function PartnerHolidayParkDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  const step = FLOW_STEPS[activeStep];

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
          <Link href="/partner-room">
            <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"}
            >Partner Room</span>
          </Link>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>›</span>
          <Link href="/partner-room/demo-paths">
            <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"}
            >Demo Paths</span>
          </Link>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>›</span>
          <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "#10b981", textTransform: "uppercase", fontWeight: 700 }}>Holiday Parks</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Live Operating Flow · Holiday Parks & Outdoor Experiences
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 20, maxWidth: 720 }}>
            The arrival that almost went wrong —<br />
            <span style={{ color: "#10b981" }}>and didn't.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 640 }}>
            A family arrives at a holiday park after a long drive. Weather has changed, the cabin is not ready, children are unsettled, and the guest is at risk of frustration before the stay has properly begun. This is what RTBX Travel does in that moment, with WELBX carrying the guest-facing message.
          </p>
        </div>

        {/* Scenario context strip */}
        <div style={{
          padding: "24px 32px",
          background: "rgba(16,185,129,0.04)",
          border: "1px solid rgba(16,185,129,0.12)",
          borderLeft: "3px solid rgba(16,185,129,0.5)",
          marginBottom: 48,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}>
          {[
            { label: "Environment", value: "Holiday Park · Peak season · Coastal location" },
            { label: "Guest Profile", value: "Family · 2 adults · 2 children under 8 · First visit" },
            { label: "Risk Factors", value: "Late arrival · Weather change · Cabin delay · Unsettled children" },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(16,185,129,0.6)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Flow step selector */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Operating Flow · Step {activeStep + 1} of {FLOW_STEPS.length}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {FLOW_STEPS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setActiveStep(i)}
                style={{
                  flex: 1,
                  padding: "16px 12px",
                  background: i === activeStep ? `${s.color}12` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${i === activeStep ? s.color + "50" : "rgba(255,255,255,0.07)"}`,
                  borderTop: `2px solid ${i === activeStep ? s.color : "transparent"}`,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={e => { if (i !== activeStep) { (e.currentTarget as HTMLElement).style.borderColor = `rgba(255,255,255,0.15)`; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}}
                onMouseLeave={e => { if (i !== activeStep) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}}
              >
                <span style={{ fontSize: 16, color: i === activeStep ? s.color : "rgba(255,255,255,0.2)" }}>{s.icon}</span>
                <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: i === activeStep ? s.color : "rgba(255,255,255,0.3)" }}>
                  {s.label}
                </span>
                {i < FLOW_STEPS.length - 1 && i === activeStep && (
                  <div style={{ position: "absolute", right: -1, top: "50%", width: 8, height: 1, background: `${s.color}40` }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active step detail */}
        <div style={{
          padding: "40px 36px",
          background: `${step.color}06`,
          border: `1px solid ${step.color}25`,
          marginBottom: 40,
          minHeight: 320,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.22em", color: step.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                {step.label} · {step.summary}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                {step.detail[0]}
              </div>
            </div>
            <div style={{
              padding: "6px 14px",
              background: `${step.color}15`,
              border: `1px solid ${step.color}40`,
              fontSize: 8,
              letterSpacing: "0.18em",
              color: step.color,
              textTransform: "uppercase",
              fontWeight: 700,
              flexShrink: 0,
            }}>
              ● {step.status}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {step.detail.slice(1).map((line, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "12px 16px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ width: 20, height: 1, background: `${step.color}50`, flexShrink: 0, marginTop: 9 }} />
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{line}</span>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
            <button
              onClick={() => setActiveStep(s => Math.max(0, s - 1))}
              disabled={activeStep === 0}
              style={{
                padding: "10px 20px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: activeStep === 0 ? "default" : "pointer",
                background: "transparent",
                color: activeStep === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
                border: `1px solid ${activeStep === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.15)"}`,
                transition: "all 0.15s",
              }}
            >
              ← Previous
            </button>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {FLOW_STEPS.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setActiveStep(i)}
                  style={{
                    width: i === activeStep ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === activeStep ? step.color : "rgba(255,255,255,0.15)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveStep(s => Math.min(FLOW_STEPS.length - 1, s + 1))}
              disabled={activeStep === FLOW_STEPS.length - 1}
              style={{
                padding: "10px 20px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: activeStep === FLOW_STEPS.length - 1 ? "default" : "pointer",
                background: activeStep === FLOW_STEPS.length - 1 ? "transparent" : step.color,
                color: activeStep === FLOW_STEPS.length - 1 ? "rgba(255,255,255,0.15)" : "#080c14",
                border: `1px solid ${activeStep === FLOW_STEPS.length - 1 ? "rgba(255,255,255,0.06)" : step.color}`,
                transition: "all 0.15s",
              }}
            >
              Next Step →
            </button>
          </div>
        </div>

        {/* Proof of value — always visible */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
            Proof of Value
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
            {PROOF_POINTS.map((pt, i) => (
              <div key={i} style={{
                padding: "20px 16px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${pt.color}`,
              }}>
                <div style={{ width: 20, height: 1, background: `${pt.color}60`, marginBottom: 12 }} />
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, fontWeight: 500 }}>
                  {pt.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What this shows a partner */}
        <div style={{
          padding: "36px 36px",
          background: "rgba(255,255,255,0.015)",
          border: "1px solid rgba(255,255,255,0.07)",
          marginBottom: 48,
        }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
            What this demonstrates
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            {[
              { role: "Operator", color: "#c9a84c", points: ["Consistent staff response without training overhead", "Escalation prevention logged with cause and outcome", "Guest sentiment protection at the highest-risk moment"] },
              { role: "Guest", color: "#10b981", points: ["Acknowledged before they need to complain", "Practical support delivered without friction", "Stay salvaged before the first impression is lost"] },
              { role: "Partner", color: "#3b82f6", points: ["Local experience opportunity surfaced at the right moment", "Café and activity options activated contextually", "Partner revenue generated from a recovery moment"] },
            ].map(group => (
              <div key={group.role}>
                <div style={{ fontSize: 9, letterSpacing: "0.16em", color: group.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
                  {group.role} value
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {group.points.map((pt, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 16, height: 1, background: `${group.color}50`, flexShrink: 0, marginTop: 8 }} />
                      <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/partner-room/dual-view-demo">
            <div style={{
              padding: "14px 28px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              background: "#c9a84c",
              color: "#080c14",
              border: "1px solid #c9a84c",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}
            >
              See Live Dual View Demo
            </div>
          </Link>
          <Link href="/partner-room/demo-paths">
            <div style={{
              padding: "14px 28px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              background: "transparent",
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.15)",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.4)"; el.style.color = "#fff"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(255,255,255,0.55)"; }}
            >
              All Demo Paths
            </div>
          </Link>
          <a href="mailto:lance@rtbx.com.au?subject=Holiday Parks Demo — RTBX Travel" style={{ textDecoration: "none" }}>
            <div style={{
              padding: "14px 28px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              background: "transparent",
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.15)",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.4)"; el.style.color = "#fff"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(255,255,255,0.55)"; }}
            >
              Request Partner Briefing
            </div>
          </a>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
