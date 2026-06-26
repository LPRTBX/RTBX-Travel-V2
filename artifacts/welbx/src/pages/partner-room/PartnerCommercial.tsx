import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const COMMERCIAL_SECTIONS = [
  {
    label: "Pilot Model",
    color: "#c9a84c",
    desc: "8-phase structured pilot pathway with week timing, success metrics and governance. How an operator starts safely without heavy integration.",
    href: "/partner-room/resources/travel-pilot-model",
    cta: "View Pilot Model",
    ext: false,
  },
  {
    label: "Commercial Partnership Brief",
    color: "#c9a84c",
    desc: "Seven revenue streams, five partner commercial models, pilot terms and indicative pricing. The complete commercial structure.",
    href: "/partner-room/resources/travel-commercial-partnership-brief",
    cta: "View Commercial Brief",
    ext: false,
  },
  {
    label: "Revenue Model",
    color: "#a78bfa",
    desc: "Platform licence, deployment fees, marketplace revenue share, loyalty activation and intelligence revenue. 3-year indicative forecast.",
    href: "/partner-room/resources/travel-revenue-model",
    cta: "View Revenue Model",
    ext: false,
  },
  {
    label: "Commercial Case",
    color: "#a78bfa",
    desc: "Category opportunity, revenue pathways, multiple competitive moats and strategic exit pathways. Why RTBX Travel is commercially serious.",
    href: "/partner-room/resources/travel-commercial-case",
    cta: "View Commercial Case",
    ext: false,
  },
  {
    label: "Partner Pathways",
    color: "#10b981",
    desc: "Five partner entry points — Operator, Integration, Distribution, Marketplace and Strategic. Each with a distinct commercial model.",
    href: "/partner-room/resources/travel-partnership-overview",
    cta: "View Partner Pathways",
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
];

const CTA_ITEMS = [
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

const PARTNER_ENTRY_POINTS = [
  { label: "Operator Partner", desc: "Hotels, resorts, parks and travel operators deploying RTBX Travel.", href: "/partner-room/resources/travel-pilot-model" },
  { label: "Technology Partner", desc: "PMS, CRM, POS, workforce and loyalty system integration partners.", href: "/partner-room/integration-brief" },
  { label: "Commercial Partner", desc: "Distribution, channel and commercial activation partners.", href: "/partner-room/resources/travel-commercial-partnership-brief" },
  { label: "Strategic / Funding Partner", desc: "Investment, category expansion and infrastructure funding partners.", href: "/partner-room/resources/travel-commercial-case" },
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
            Pilot model, commercial structure, partner pathways, revenue model and integration model.
            Explore the full commercial framework or start a direct conversation.
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 32 }}>
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
            </div>
          ))}
        </div>

        {/* Direct conversation CTAs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, marginBottom: 64 }}>
          {CTA_ITEMS.map(sec => (
            <div key={sec.label} style={{
              padding: "30px 26px",
              background: "rgba(16,185,129,0.03)",
              border: "1px solid rgba(16,185,129,0.15)",
              borderTop: `2px solid ${sec.color}`,
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: sec.color, marginBottom: 14, lineHeight: 1.3 }}>
                {sec.label}
              </div>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, flex: 1, marginBottom: 22 }}>
                {sec.desc}
              </p>
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
            </div>
          ))}
        </div>

        {/* Partner pathway strip */}
        <div style={{ padding: "32px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid #c9a84c" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
            Partner Entry Points
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {PARTNER_ENTRY_POINTS.map(p => (
              <Link key={p.label} href={p.href}>
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
