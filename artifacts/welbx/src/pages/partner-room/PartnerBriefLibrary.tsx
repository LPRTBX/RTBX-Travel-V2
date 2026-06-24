import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const BRIEFS = [
  {
    label: "Operator Brief",
    tag: "Operations",
    color: "#c9a84c",
    desc: "The core briefing document for hotel, resort and park operators — covers system overview, deployment model, staff impact and value proof.",
    href: "/partner-room/operator-brief",
    audience: "Hotel · Resort · Park Operators",
  },
  {
    label: "Integration Brief",
    tag: "Technology",
    color: "#3b82f6",
    desc: "API-first integration guide for technology partners — PMS, POS, CRM, workforce and loyalty system connectivity.",
    href: "/partner-room/integration-brief",
    audience: "Technology Partners · IT Leads",
  },
  {
    label: "Commercial Brief",
    tag: "Commercial",
    color: "#a78bfa",
    desc: "Commercial structure, pricing tiers, revenue share and partner pathway summary for commercial and executive stakeholders.",
    href: "/partner-room/commercial-model",
    audience: "Commercial Leads · Executives",
  },
  {
    label: "Holiday Parks & Outdoor Experiences Brief",
    tag: "Environment",
    color: "#10b981",
    desc: "Sector-specific briefing for holiday park and outdoor experience operators — covers multi-site deployment, seasonal management and guest flow.",
    href: "/partner-room/holiday-park-demo",
    audience: "Parks · Outdoor Operators",
  },
  {
    label: "Pilot Metrics",
    tag: "Validation",
    color: "#f97316",
    desc: "Key performance indicators, outcome metrics and value measurement framework for a structured RTBX Travel pilot.",
    href: "/partner-room/pilot-model",
    audience: "Operators · Commercial · Finance",
  },
  {
    label: "Value Proof",
    tag: "Validation",
    color: "#f97316",
    desc: "Documented outcome data, service improvement evidence and commercial value capture from RTBX Travel deployments.",
    href: "/partner-room/pilot-model",
    audience: "Executives · Funders · Partners",
  },
  {
    label: "Deployment Brief",
    tag: "Operations",
    color: "#c9a84c",
    desc: "Technical and operational requirements for deploying RTBX Travel — infrastructure, integration, training and go-live checklist.",
    href: "/partner-room/operator-brief",
    audience: "Operations · IT · Project Leads",
  },
  {
    label: "Documents",
    tag: "Library",
    color: "rgba(255,255,255,0.3)",
    desc: "Supporting documents, annexures and reference materials for the RTBX Travel Partner Room.",
    href: "/partner-room/operator-brief",
    audience: "All Partners",
  },
];

const TAG_COLORS: Record<string, string> = {
  Operations:  "#c9a84c",
  Technology:  "#3b82f6",
  Commercial:  "#a78bfa",
  Environment: "#10b981",
  Validation:  "#f97316",
  Library:     "rgba(255,255,255,0.3)",
};

export default function PartnerBriefLibrary() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Room · Brief Library
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Brief Library
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 640 }}>
            Targeted briefings, validation documents and reference materials — each scoped for a specific audience and decision context.
          </p>

          {/* Tag filter legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
            {Object.entries(TAG_COLORS).map(([tag, color]) => (
              <div key={tag} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 2, background: color }} />
                <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brief cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {BRIEFS.map(brief => (
            <Link key={brief.label} href={brief.href}>
              <div style={{
                padding: "28px 24px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${brief.color}`,
                display: "flex", flexDirection: "column",
                cursor: "pointer", transition: "all 0.15s", height: "100%",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = `rgba(255,255,255,0.12)`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.02)"; el.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                {/* Tag */}
                <div style={{
                  display: "inline-flex", alignItems: "center", marginBottom: 14,
                  fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: TAG_COLORS[brief.tag] || "rgba(255,255,255,0.3)",
                  border: `1px solid ${TAG_COLORS[brief.tag] || "rgba(255,255,255,0.1)"}30`,
                  padding: "2px 8px", alignSelf: "flex-start",
                }}>
                  {brief.tag}
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#fff", marginBottom: 12, lineHeight: 1.35 }}>
                  {brief.label}
                </div>

                <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.32)", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                  {brief.desc}
                </p>

                <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>
                  {brief.audience}
                </div>

                <div style={{ fontSize: 9, color: brief.color, fontWeight: 700, letterSpacing: "0.08em" }}>
                  Open Brief →
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
