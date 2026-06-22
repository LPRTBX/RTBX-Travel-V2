import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const DEMO_CARDS = [
  {
    title: "Executive Briefing",
    sub: "PARTNER DEMO",
    desc: "A six-slide executive narrative covering WELBX's positioning, the operating problem it solves, and the value it creates. Designed for a 5-minute briefing format.",
    duration: "5 minutes",
    audience: "C-suite, Owners, Board",
    link: "/partner-room/overview",
    external: false,
    color: "#c9a84c",
    cta: "Start Briefing",
  },
  {
    title: "Operator Deep Dive",
    sub: "PARTNER DEMO",
    desc: "A 13-section walkthrough of the full WELBX operating chain — from signal detection through to outcome and learning. Built for operations leaders and GMs.",
    duration: "15–20 minutes",
    audience: "GMs, Operations Directors",
    link: "/partner-room/operator-demo",
    external: false,
    color: "#10b981",
    cta: "Start Deep Dive",
  },
  {
    title: "Live Guest Story",
    sub: "PARTNER DEMO",
    desc: "An immersive walkthrough of a single guest journey — following one stay from arrival through to departure, showing every moment WELBX detects and manages along the way.",
    duration: "10 minutes",
    audience: "Experience-led audiences",
    link: "/partner-room/guest-demo",
    external: false,
    color: "#a78bfa",
    cta: "Start Guest Story",
  },
  {
    title: "Moments Economy Demo",
    sub: "PARTNER ROOM",
    desc: "An interactive reference showing all ten moment categories in the WELBX library — with signals, risk profile, action triggered, and partner opportunity for each.",
    duration: "Self-paced",
    audience: "Integration & commercial partners",
    link: "/partner-room/moments-economy",
    external: false,
    color: "#c9a84c",
    cta: "View Moments",
  },
  {
    title: "Signals Engine Demo",
    sub: "PARTNER ROOM",
    desc: "A reference walkthrough of the WELBX signal layer — four signal categories, 247 signal types, and the seven-step logic chain from raw event to moment creation.",
    duration: "Self-paced",
    audience: "Integration partners, technical leads",
    link: "/partner-room/signals-engine",
    external: false,
    color: "#3b82f6",
    cta: "View Signals",
  },
  {
    title: "Pilot Walkthrough",
    sub: "PARTNER ROOM",
    desc: "The full eight-phase pilot model with timelines, deliverables, and success criteria. The structured path from signed agreement to outcome report in eight weeks.",
    duration: "Self-paced",
    audience: "Operator partners, project leads",
    link: "/partner-room/pilot-model",
    external: false,
    color: "#10b981",
    cta: "View Pilot Model",
  },
];

export default function PartnerDemoPaths() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Demo Paths
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 680 }}>
            Choose the Right Entry Point
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 640 }}>
            Six paths through the WELBX platform — each calibrated to a different audience and intent. Start with the one that fits your current context, then navigate freely.
          </p>
        </div>

        {/* Demo cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {DEMO_CARDS.map(card => (
            <div key={card.title} style={{
              padding: "36px 28px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ fontSize: 7.5, letterSpacing: "0.2em", color: card.color, textTransform: "uppercase", fontWeight: 700 }}>
                  {card.sub}
                </div>
                <div style={{ width: 8, height: 8, border: `1px solid ${card.color}`, borderRadius: "50%", opacity: 0.5 }} />
              </div>

              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 14, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
                {card.title}
              </div>

              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.72, marginBottom: 28, flex: 1 }}>
                {card.desc}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 8, letterSpacing: "0.14em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, minWidth: 60 }}>Duration</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{card.duration}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 8, letterSpacing: "0.14em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, minWidth: 60 }}>Audience</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{card.audience}</span>
                </div>
              </div>

              <Link href={card.link}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 0",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: card.color,
                  border: `1px solid ${card.color}`,
                  opacity: 0.85,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.background = `${card.color}10`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = "0.85"; el.style.background = "transparent"; }}
                >
                  {card.cta} →
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
