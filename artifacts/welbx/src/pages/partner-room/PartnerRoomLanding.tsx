import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const FLOW_STEPS = [
  { label: "Signals",   desc: "247 live data streams from every operational layer" },
  { label: "Moments",   desc: "Pattern recognition surfaces what needs to happen now" },
  { label: "Decisions", desc: "Governed response logic selects the right action" },
  { label: "Actions",   desc: "The right team member receives the right instruction" },
  { label: "Outcomes",  desc: "Every resolution is recorded and measured" },
  { label: "Value",     desc: "Learning compounds — the system improves on every cycle" },
];

const PARTNER_PATHS = [
  {
    title: "Hotel & Operator",
    sub: "FOR OPERATORS",
    desc: "You have the staff, the systems, and the guests. WELBX gives you the operating layer that connects them — so the right action reaches the right person at the right moment, every time.",
    cta: "Operator Brief",
    link: "/partner-room/operator-brief",
    color: "#c9a84c",
  },
  {
    title: "Integration Partner",
    sub: "FOR TECHNOLOGY PARTNERS",
    desc: "Your system already captures signals. WELBX reads them. A single integration makes your platform a trigger in the moment economy — surfacing value for operators that neither of us can create alone.",
    cta: "Integration Brief",
    link: "/partner-room/integration-brief",
    color: "#3b82f6",
  },
  {
    title: "Commercial Partner",
    sub: "FOR COMMERCIAL PARTNERS",
    desc: "WELBX is deployed where guest experience and operational revenue intersect. Your partnership creates protected value at the point of execution — not in the pipeline, but in the moment.",
    cta: "Commercial Model",
    link: "/partner-room/commercial-model",
    color: "#a78bfa",
  },
];

export default function PartnerRoomLanding() {
  return (
    <PartnerRoomLayout>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px 120px" }}>

      {/* Header block */}
      <div style={{ marginBottom: 80 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
          WELBX Partner Room · Private Strategic Briefing
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.08, marginBottom: 24, maxWidth: 760 }}>
          The Operating Layer<br />
          <span style={{ color: "#c9a84c" }}>Hotels Have Been Missing</span>
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 580, marginBottom: 48 }}>
          WELBX is a real-time operating intelligence platform that converts raw operational signals into governed actions — protecting value at every guest moment, across every shift, at every property.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {[
            { label: "Platform Overview",    link: "/partner-room/overview",          primary: true },
            { label: "See the Pilot Model",  link: "/partner-room/pilot-model",       primary: false },
            { label: "Moments Economy",      link: "/partner-room/moments-economy",   primary: false },
            { label: "Run a Demo Path",      link: "/partner-room/demo-paths",        primary: false },
          ].map(btn => (
            <Link key={btn.link} href={btn.link}>
              <div style={{
                padding: "12px 24px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.15s",
                background: btn.primary ? "#c9a84c" : "transparent",
                color: btn.primary ? "#080c14" : "rgba(255,255,255,0.6)",
                border: btn.primary ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.15)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                if (btn.primary) { el.style.background = "#d4b35e"; } else { el.style.borderColor = "rgba(255,255,255,0.4)"; el.style.color = "#fff"; }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                if (btn.primary) { el.style.background = "#c9a84c"; } else { el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(255,255,255,0.6)"; }
              }}
              >
                {btn.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Six-step flow visual */}
      <div style={{ marginBottom: 96 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
          The WELBX Operating Chain
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}>
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} style={{
              padding: "24px 18px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: i === 0 ? "2px solid #c9a84c" : undefined,
              position: "relative",
            }}>
              <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(201,168,76,0.5)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "0.02em" }}>
                {step.label}
              </div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.55 }}>
                {step.desc}
              </div>
              {i < 5 && (
                <div style={{ position: "absolute", right: -9, top: "50%", transform: "translateY(-50%)", width: 16, height: 1, background: "rgba(201,168,76,0.3)", zIndex: 1 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Partner path cards */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
          Partnership Paths
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {PARTNER_PATHS.map(card => (
            <div key={card.title} style={{
              padding: "36px 28px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.2em", color: card.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
                {card.sub}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 18, letterSpacing: "-0.01em" }}>
                {card.title}
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 32, flex: 1 }}>
                {card.desc}
              </div>
              <Link href={card.link}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: card.color,
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                >
                  {card.cta} →
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    </PartnerRoomLayout>
  );
}
