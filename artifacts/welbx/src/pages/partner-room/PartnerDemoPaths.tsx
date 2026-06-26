import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const CORE_DEMOS = [
  {
    num: "01",
    title: "Scenario Builder",
    tag: "Interactive · Full Flow",
    tagColor: "#c9a84c",
    desc: "Choose an environment, scenario type, risk level and role view — step through the full Signal → Classify → Decide → Execute → Assure → Value cycle.",
    audience: "Operators · Commercial leads · Partners",
    href: "/partner-room/scenario-builder",
    cta: "Open Scenario Builder",
    color: "#c9a84c",
  },
  {
    num: "02",
    title: "Dual View Demo",
    tag: "Interactive · Side-by-Side",
    tagColor: "#3b82f6",
    desc: "See the same moment from the guest, operator and command view simultaneously — live synchronised perspectives.",
    audience: "All audiences",
    href: "/partner-room/dual-view-demo",
    cta: "Open Dual View",
    color: "#3b82f6",
  },
  {
    num: "03",
    title: "Live Guest Story",
    tag: "Interactive · Guest Journey",
    tagColor: "#a78bfa",
    desc: "Seven guest journey stages — arrival through checkout. Each stage shows what the guest sees, what RTBX Core automates and what the operator receives.",
    audience: "Experience-led audiences · Operators",
    href: "/partner-room/guest-demo",
    cta: "Start Guest Story",
    color: "#a78bfa",
  },
  {
    num: "04",
    title: "Communications Routing Demo",
    tag: "Interactive · Routing Logic",
    tagColor: "#10b981",
    desc: "Select a scenario and watch RTBX Core route the right message to the right person — guest, staff, manager and command layer.",
    audience: "Operations · Technology partners",
    href: "/partner-room/comms-demo",
    cta: "Open Comms Demo",
    color: "#10b981",
  },
  {
    num: "05",
    title: "Decision Spine Demo",
    tag: "Interactive · Decision Logic",
    tagColor: "#f97316",
    desc: "Toggle inputs in a live scenario — watch classification, decision, intervention and assurance path update in real time.",
    audience: "Operations · Technology leads",
    href: "/partner-room/decision-spine",
    cta: "Open Decision Demo",
    color: "#f97316",
  },
  {
    num: "06",
    title: "Proof of Value Calculator",
    tag: "Interactive · Value Proof",
    tagColor: "#22d3ee",
    desc: "Adjust sliders for your property — get indicative monthly estimates for value protected, revenue created and staff hours saved.",
    audience: "Commercial · Finance · Executives",
    href: "/partner-room/proof-calculator",
    cta: "Open Calculator",
    color: "#22d3ee",
  },
];

const DEPLOYMENT_DEMOS = [
  {
    label: "Hotels & Resorts",
    color: "#c9a84c",
    desc: "High-value arrival recovery in a city hotel.",
    href: "/partner-room/deployments/hotels-resorts/demo",
  },
  {
    label: "Holiday Parks",
    color: "#10b981",
    desc: "Family arrival at peak season — cabin delay.",
    href: "/partner-room/holiday-park-demo",
  },
  {
    label: "Corporate Travel",
    color: "#3b82f6",
    desc: "Duty of care + meeting schedule under pressure.",
    href: "/partner-room/deployments/corporate-travel/demo",
  },
  {
    label: "Events & Venues",
    color: "#a78bfa",
    desc: "Crowd flow issue 40 minutes before program.",
    href: "/partner-room/deployments/events-venues/demo",
  },
  {
    label: "Destination & Tourism",
    color: "#f97316",
    desc: "Transport delay cascading across 34 itineraries.",
    href: "/partner-room/deployments/destination-tourism/demo",
  },
];

export default function PartnerDemoPaths() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Demo Room
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 640 }}>
            RTBX Core — Live & Interactive Demos
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, maxWidth: 600 }}>
            Every item here is interactive. No static slides, no screenshots. See the operating system working in real scenarios across real environments.
          </p>
          <div style={{ marginTop: 18, padding: "12px 18px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", flexShrink: 0 }} />
            <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>Executive Briefing → Brief Library · Operator Deep Dive → Validation · Pilot Walkthrough → Commercial</span>
          </div>
        </div>

        {/* Core Interactive Demos */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section 01</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>Core Interactive Demos</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {CORE_DEMOS.map(demo => (
              <div key={demo.num} style={{
                padding: "32px 26px",
                background: `${demo.color}05`,
                border: `1px solid ${demo.color}20`,
                borderTop: `2px solid ${demo.color}`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ fontSize: 8, fontWeight: 800, color: `${demo.color}45`, letterSpacing: "0.12em" }}>{demo.num}</div>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: demo.tagColor, border: `1px solid ${demo.tagColor}30`, padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {demo.tag}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{demo.title}</div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, flex: 1, marginBottom: 10 }}>{demo.desc}</p>
                <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>{demo.audience}</div>
                <Link href={demo.href}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "11px 0", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: demo.color, border: `1px solid ${demo.color}40`,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${demo.color}12`; el.style.borderColor = `${demo.color}75`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${demo.color}40`; }}
                  >
                    {demo.cta} →
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Scenario Demos */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section 02</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 8 }}>Deployment Scenario Demos</div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, maxWidth: 540, margin: 0 }}>
              One complete operating scenario per deployment environment — Signal → Classify → Decide → Execute → Assure → Value.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
            {DEPLOYMENT_DEMOS.map(d => (
              <div key={d.label} style={{
                padding: "24px 20px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${d.color}`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: d.color, marginBottom: 10, lineHeight: 1.3 }}>{d.label}</div>
                <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.55, flex: 1, marginBottom: 18 }}>{d.desc}</p>
                <Link href={d.href}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                    color: d.color, cursor: "pointer", transition: "color 0.12s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    Run Demo →
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
