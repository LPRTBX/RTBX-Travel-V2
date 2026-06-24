import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const INTERACTIVE_MODULES = [
  {
    num: "01",
    label: "Scenario Builder",
    color: "#c9a84c",
    tag: "Signal · Classify · Decide · Execute · Assure · Value",
    desc: "Choose an environment, scenario type, risk level and role view — step through how RTBX Core handles it in real time.",
    href: "/partner-room/scenario-builder",
    cta: "Open Scenario Builder",
  },
  {
    num: "02",
    label: "Communications Routing",
    color: "#3b82f6",
    tag: "Guest · Staff · Manager · Command",
    desc: "Select a scenario and watch RTBX Core route the right message to the right person at the right time.",
    href: "/partner-room/comms-demo",
    cta: "Open Comms Demo",
  },
  {
    num: "03",
    label: "Decision Spine",
    color: "#f97316",
    tag: "Classify · Decide · Intervene · Assure",
    desc: "Toggle inputs in a Holiday Park arrival scenario — see the classification, decision, intervention and assurance path update instantly.",
    href: "/partner-room/decision-spine",
    cta: "Open Decision Demo",
  },
  {
    num: "04",
    label: "Proof of Value Calculator",
    color: "#10b981",
    tag: "Value Protected · Revenue Created · Hours Saved",
    desc: "Adjust sliders for your property — get indicative monthly estimates for value protected, revenue created and staff hours saved.",
    href: "/partner-room/proof-calculator",
    cta: "Open Calculator",
  },
];

const DEMO_LANES = [
  {
    num: "01",
    label: "Dual View Demo",
    color: "#c9a84c",
    desc: "Side-by-side guest and operator view — watch the same moment unfold from both perspectives simultaneously.",
    href: "/partner-room/dual-view-demo",
    cta: "Open Dual View",
  },
  {
    num: "02",
    label: "Scenario Replay",
    color: "#10b981",
    desc: "Replay a live operating scenario — from signal detection through to resolution and outcome assurance.",
    href: "/partner-room/demo-paths",
    cta: "Run Scenario",
  },
  {
    num: "03",
    label: "Guest & Operator Demo",
    color: "#3b82f6",
    desc: "Walk through the system from the guest layer (WELBX) through to the operator console in a single flow.",
    href: "/partner-room/guest-demo",
    cta: "Start Demo",
  },
  {
    num: "04",
    label: "Core Systems Preview",
    color: "#a78bfa",
    desc: "A high-level preview of all active RTBX Core modules — moments, decisions, communications, assurance.",
    href: "/partner-room/demo-paths",
    cta: "View Preview",
  },
];

const PRODUCT_MODULES = [
  { label: "Moment Economy",                href: "/partner-room/moments-economy",   desc: "Ten moment categories driving measurable service, welfare and commercial value." },
  { label: "Decision & Action Layer",       href: "/partner-room/signals-engine",    desc: "How RTBX Core classifies moments, selects governed responses and routes to staff." },
  { label: "Intervention Library",          href: "/partner-room/signals-engine",    desc: "Pre-built and configurable response playbooks for every moment category." },
  { label: "Central Communications System", href: "/partner-room/signals-engine",    desc: "Structured guest messages, staff instructions and command assurance outputs." },
  { label: "Registry & Assurance Layer",    href: "/partner-room/signals-engine",    desc: "Every resolution recorded, measured and surfaced for audit and learning." },
  { label: "Signals Engine Brief",          href: "/partner-room/signals-engine",    desc: "Informational overview of how RTBX Core captures and classifies live signals." },
];

export default function PartnerProductProof() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Room · Product Proof
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Product Proof
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 640 }}>
            Live demos, moment economy, decision logic, intervention library and communications — the product operating in real time.
            Start with a demo lane or explore a specific module below.
          </p>
        </div>

        {/* Interactive Modules */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 24 }}>
            Interactive Modules
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 2 }}>
            {INTERACTIVE_MODULES.map(mod => (
              <div key={mod.num} style={{
                padding: "28px 24px",
                background: `${mod.color}06`,
                border: `1px solid ${mod.color}20`,
                borderTop: `2px solid ${mod.color}`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: `${mod.color}50`, letterSpacing: "0.1em", marginBottom: 6 }}>{mod.num}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: mod.color, marginBottom: 8, lineHeight: 1.3 }}>
                  {mod.label}
                </div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.08em", color: `${mod.color}80`, fontWeight: 600, marginBottom: 12, lineHeight: 1.5 }}>
                  {mod.tag}
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, flex: 1, marginBottom: 20 }}>
                  {mod.desc}
                </p>
                <Link href={mod.href}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "10px 0", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: mod.color, border: `1px solid ${mod.color}40`,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${mod.color}12`; el.style.borderColor = `${mod.color}70`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${mod.color}40`; }}
                  >
                    {mod.cta} →
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Lanes */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 24 }}>
            Demo Lanes
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {DEMO_LANES.map(lane => (
              <div key={lane.num} style={{
                padding: "28px 24px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${lane.color}`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: `${lane.color}50`, letterSpacing: "0.1em", marginBottom: 6 }}>{lane.num}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: lane.color, marginBottom: 14, lineHeight: 1.3 }}>
                  {lane.label}
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, flex: 1, marginBottom: 20 }}>
                  {lane.desc}
                </p>
                <Link href={lane.href}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "9px 0", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: lane.color, border: `1px solid ${lane.color}35`,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${lane.color}10`; el.style.borderColor = `${lane.color}70`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${lane.color}35`; }}
                  >
                    {lane.cta} →
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Product Modules */}
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 24 }}>
            Product Modules
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {PRODUCT_MODULES.map(mod => (
              <Link key={mod.label} href={mod.href}>
                <div style={{
                  padding: "22px 22px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", flexDirection: "column", gap: 8,
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = "rgba(201,168,76,0.2)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.02)"; el.style.borderColor = "rgba(255,255,255,0.06)"; }}
                >
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)" }}>
                    {mod.label}
                  </div>
                  <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.32)", lineHeight: 1.6, margin: 0 }}>
                    {mod.desc}
                  </p>
                  <div style={{ fontSize: 9, color: "#c9a84c", fontWeight: 700, letterSpacing: "0.08em", marginTop: 4 }}>View →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
