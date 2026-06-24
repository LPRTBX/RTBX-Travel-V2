import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const COMMERCIAL_SECTIONS = [
  {
    label: "Pilot Model",
    color: "#c9a84c",
    desc: "How a structured pilot is scoped, resourced and measured — timelines, success metrics and activation steps.",
    href: "/partner-room/pilot-model",
    cta: "View Pilot Model",
    ext: false,
  },
  {
    label: "Commercial Model",
    color: "#c9a84c",
    desc: "Pricing structure, revenue share, deployment tiers and commercial pathway options for operators and partners.",
    href: "/partner-room/commercial-model",
    cta: "View Commercial Model",
    ext: false,
  },
  {
    label: "Partner Pathways",
    color: "#a78bfa",
    desc: "Four structured entry points — Operator Partner, Technology Partner, Commercial Partner, Strategic / Funding Partner.",
    href: "/partner-room/commercial-model",
    cta: "View Pathways",
    ext: false,
  },
  {
    label: "Integration Model",
    color: "#3b82f6",
    desc: "How RTBX Travel connects to existing PMS, POS, CRM, workforce and loyalty systems — API-first, no rip-and-replace.",
    href: "/partner-room/integration-brief",
    cta: "View Integration Model",
    ext: false,
  },
  {
    label: "Pilot Conversation",
    color: "#10b981",
    desc: "Start a structured conversation about scoping a pilot in your environment — 30-minute briefing, no commitment required.",
    href: "mailto:lance@rtbx.com.au?subject=RTBX Travel Pilot Conversation",
    cta: "Request Pilot Conversation",
    ext: true,
  },
  {
    label: "Request Briefing",
    color: "#10b981",
    desc: "Request a direct executive briefing — tailored to your organisation, role and commercial context.",
    href: "mailto:lance@rtbx.com.au?subject=RTBX Travel Partner Briefing",
    cta: "Request Briefing",
    ext: true,
  },
];

export default function PartnerCommercial() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Room · Commercial
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Commercial
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 640 }}>
            Pilot model, commercial structure, partner pathways and integration model.
            Explore the commercial framework or start a direct conversation.
          </p>
        </div>

        {/* Proof of Value Calculator — featured */}
        <div style={{ marginBottom: 32, padding: "32px 32px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderTop: "2px solid #c9a84c", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)", padding: "3px 10px" }}>Interactive · Calculator</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Featured Tool</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>Proof of Value Calculator</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 560, margin: 0 }}>
              Adjust sliders for your property or portfolio — get indicative monthly estimates for value protected, revenue created, staff hours saved and escalations prevented.
            </p>
          </div>
          <Link href="/partner-room/proof-calculator">
            <div style={{
              padding: "12px 28px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.4)",
              cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              Open Calculator →
            </div>
          </Link>
        </div>

        {/* Commercial sections */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 64 }}>
          {COMMERCIAL_SECTIONS.map(sec => (
            <div key={sec.label} style={{
              padding: "30px 26px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: `2px solid ${sec.color}`,
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: sec.color, marginBottom: 14, lineHeight: 1.3 }}>
                {sec.label}
              </div>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, flex: 1, marginBottom: 22 }}>
                {sec.desc}
              </p>
              {sec.ext ? (
                <a href={sec.href} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "10px 0", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: sec.color, border: `1px solid ${sec.color}35`,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${sec.color}10`; el.style.borderColor = `${sec.color}70`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${sec.color}35`; }}
                  >
                    {sec.cta} →
                  </div>
                </a>
              ) : (
                <Link href={sec.href}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "10px 0", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: sec.color, border: `1px solid ${sec.color}35`,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${sec.color}10`; el.style.borderColor = `${sec.color}70`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${sec.color}35`; }}
                  >
                    {sec.cta} →
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Partner pathway strip */}
        <div style={{ padding: "32px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid #c9a84c" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
            Partner Entry Points
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              { label: "Operator Partner", desc: "Hotels, resorts, parks and travel operators deploying RTBX Travel." },
              { label: "Technology Partner", desc: "PMS, CRM, POS, workforce and loyalty system integration partners." },
              { label: "Commercial Partner", desc: "Distribution, channel and commercial activation partners." },
              { label: "Strategic / Funding Partner", desc: "Investment, category expansion and infrastructure funding partners." },
            ].map(p => (
              <Link key={p.label} href="/partner-room/commercial-model">
                <div style={{
                  padding: "20px 18px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(201,168,76,0.06)"; el.style.borderColor = "rgba(201,168,76,0.2)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.015)"; el.style.borderColor = "rgba(255,255,255,0.05)"; }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#c9a84c", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", lineHeight: 1.55 }}>{p.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
