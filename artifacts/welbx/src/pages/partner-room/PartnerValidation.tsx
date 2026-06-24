import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const VALIDATION_ITEMS = [
  {
    label: "Validation Lab",
    color: "#10b981",
    type: "Interactive",
    desc: "Full validation environment — configure a scenario, run it through RTBX Core and review the outcome log.",
    href: "/story",
    cta: "Open Lab",
  },
  {
    label: "Scenario Replay Lab",
    color: "#10b981",
    type: "Interactive",
    desc: "Replay a recorded operating scenario step by step — signal, classification, decision, action, outcome.",
    href: "/story",
    cta: "Run Replay",
  },
  {
    label: "Shadow Pilot Mode",
    color: "#c9a84c",
    type: "Simulation",
    desc: "Run RTBX Core in parallel with an existing operation — no live changes, full signal capture and outcome modelling.",
    href: "/story",
    cta: "Enter Shadow Mode",
  },
  {
    label: "Operator Story Lab",
    color: "#f97316",
    type: "Walkthrough",
    desc: "Step through how RTBX Travel operates inside a real hospitality environment — guest signal to staff action, escalation and assurance.",
    href: "/story",
    cta: "Enter Story Lab",
  },
  {
    label: "Executive Walkthrough",
    color: "#a78bfa",
    type: "Briefing",
    desc: "A structured executive-level walkthrough of the RTBX Travel system — positioning, proof, commercial and next steps.",
    href: "/story",
    cta: "Start Walkthrough",
  },
  {
    label: "Operator Deep Dive Walkthrough",
    color: "#3b82f6",
    type: "Walkthrough",
    desc: "A detailed operator-level walkthrough of RTBX Core in a hotel or resort context — from signal detection through to resolution.",
    href: "/story/operator-deep-dive",
    cta: "Open Deep Dive",
  },
];

const TYPE_COLORS: Record<string, string> = {
  Interactive: "#10b981",
  Simulation: "#c9a84c",
  Walkthrough: "#3b82f6",
  Briefing: "#a78bfa",
};

export default function PartnerValidation() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Room · Validation
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Validation & Operator Stories
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 640 }}>
            Scenario validation, shadow pilot mode, operator walkthroughs and the full guest story from signal to outcome.
            Use interactive labs to test the system, or structured walkthroughs to build confidence before a pilot.
          </p>

          {/* Type legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Replay — featured */}
        <div style={{ marginBottom: 32, padding: "32px 32px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderTop: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", padding: "3px 10px" }}>Interactive · Replay</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Featured Demo</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>Validation Replay Lab</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 560, margin: 0 }}>
              Play the same scenario in Normal, Escalation or Failure mode — watch how RTBX Core responds at every stage and see what changes when things go wrong.
            </p>
          </div>
          <Link href="/partner-room/validation-replay">
            <div style={{
              padding: "12px 28px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#10b981", border: "1px solid rgba(16,185,129,0.4)",
              cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              Open Replay Lab →
            </div>
          </Link>
        </div>

        {/* Validation cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {VALIDATION_ITEMS.map(item => (
            <div key={item.label} style={{
              padding: "30px 26px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: `2px solid ${item.color}`,
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: item.color, lineHeight: 1.3 }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: TYPE_COLORS[item.type] || "rgba(255,255,255,0.3)",
                  border: `1px solid ${TYPE_COLORS[item.type] || "rgba(255,255,255,0.1)"}30`,
                  padding: "2px 7px", whiteSpace: "nowrap",
                }}>
                  {item.type}
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, flex: 1, marginBottom: 22 }}>
                {item.desc}
              </p>

              <Link href={item.href}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "10px 0", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: item.color, border: `1px solid ${item.color}35`,
                  cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${item.color}10`; el.style.borderColor = `${item.color}70`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${item.color}35`; }}
                >
                  {item.cta} →
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
