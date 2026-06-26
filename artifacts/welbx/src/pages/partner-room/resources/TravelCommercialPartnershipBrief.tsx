import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981", blue: "#3b82f6" };

const REVENUE_STREAMS = [
  { stream: "Platform Licence", type: "Recurring", per: "Per property / site / operator", indicative: "£8,000–£25,000 / yr", desc: "Annual access to RTBX Travel operating platform, moment library, signal layer and assurance registry." },
  { stream: "Deployment Fee", type: "One-off", per: "Per environment setup", indicative: "£5,000–£15,000", desc: "Configuration, moment mapping, pathway design, staff training and go-live support per deployment environment." },
  { stream: "Active Environment Fee", type: "Recurring", per: "Per active property / month", indicative: "£500–£2,500 / mo", desc: "Monthly fee for live RTBX Core signal processing, moment classification and action routing per active environment." },
  { stream: "Marketplace Revenue", type: "Transaction", per: "Per activated offer", indicative: "8–15% transaction share", desc: "Revenue share on local experience, dining, transport and partner offer transactions activated through RTBX Travel moments." },
  { stream: "Loyalty Activation", type: "Transaction", per: "Per loyalty moment", indicative: "£0.50–£5 per activation", desc: "Fee per loyalty moment created — check-in recognition, recovery offer, repeat-stay pathway, tier upgrade trigger." },
  { stream: "Intelligence & Reporting", type: "Subscription", per: "Per operator group / portfolio", indicative: "£12,000–£40,000 / yr", desc: "Premium environment health, portfolio comparison, value proof and governance reporting for group operators and funders." },
  { stream: "Integration Partner Revenue", type: "Recurring", per: "Per integration / year", indicative: "£3,000–£10,000 / yr", desc: "API connection fee for technology partners — PMS, POS, CRM, workforce, loyalty. Includes signal schema access and event feed." },
];

const PARTNER_MODELS = [
  {
    label: "Operator Partner",
    color: "#c9a84c",
    deploy: "Deploy RTBX Travel across their own properties or estate.",
    earn: "Operational value — reduced review risk, recovered revenue, staff efficiency.",
    commercial: "Platform licence + deployment fee + active environment fee. Volume discount at 5+ properties.",
  },
  {
    label: "Vertical Launch Partner",
    color: "#10b981",
    deploy: "Introduce RTBX Travel to a portfolio of operators in one vertical (e.g. holiday parks or corporate hotels).",
    earn: "Revenue share on platform and deployment fees for each operator introduced and onboarded.",
    commercial: "20–30% revenue share on platform and deployment fees for referred and managed operators.",
  },
  {
    label: "Distribution Partner",
    color: "#3b82f6",
    deploy: "Bundle or distribute RTBX Travel to their client base (PMS vendors, hospitality platforms, travel groups).",
    earn: "Recurring revenue share on platform fees for each client using RTBX Travel via their distribution channel.",
    commercial: "15–25% channel revenue share on recurring licence and active environment fees.",
  },
  {
    label: "Integration Partner",
    color: "#a78bfa",
    deploy: "Connect their platform (PMS, POS, CRM, workforce) to RTBX Core via API.",
    earn: "API revenue share on signal-driven moment outcomes. Partner listed in RTBX Travel integration directory.",
    commercial: "Annual integration fee + signal-driven revenue share on downstream moment activations.",
  },
  {
    label: "Strategic Travel Partner",
    color: "#f97316",
    deploy: "Co-own a vertical deployment, geography or asset class within RTBX Travel.",
    earn: "Equity pathway, vertical exclusivity window, revenue co-participation on all deployments in scope.",
    commercial: "Negotiated strategic agreement. Minimum deployment commitment. Revenue co-participation from day one.",
  },
];

const PILOT_TERMS = [
  { label: "Duration", value: "8–12 weeks" },
  { label: "Phase 1", value: "3–4 week shadow pilot — signal validation, no live delivery" },
  { label: "Phase 2", value: "4–6 week live pilot — real moments, real outcomes" },
  { label: "Pilot fee", value: "£10,000–£25,000 (indicative, environment-dependent)" },
  { label: "Included", value: "Full configuration, staff pathway design, outcome reporting, commercial conversion terms" },
  { label: "Conversion", value: "Pilot converts to annual platform agreement if 3+ success metrics are met" },
  { label: "Guarantee", value: "Outcome report produced regardless of conversion. Evidence stays with the operator." },
];

export default function TravelCommercialPartnershipBrief() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · Commercial Partnership Brief</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 700 }}>RTBX Travel — Commercial Partnership Brief</h1>
          <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.22)", borderLeft: "3px solid #c9a84c", maxWidth: 720 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              "RTBX Travel creates layered value: platform revenue, deployment revenue, marketplace revenue, intelligence revenue and ecosystem revenue."
            </p>
          </div>
        </div>

        {/* Revenue streams table */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Revenue Streams</div>
          <div style={{ display: "grid", gridTemplateColumns: "8px 150px 80px 100px 140px 1fr", gap: 0, marginBottom: 4 }}>
            {["", "Stream", "Type", "Unit", "Indicative", "Description"].map(h => (
              <div key={h} style={{ padding: "8px 12px", fontSize: 7.5, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700 }}>{h}</div>
            ))}
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            {REVENUE_STREAMS.map((rs, i) => (
              <div key={rs.stream} style={{ display: "grid", gridTemplateColumns: "8px 150px 80px 100px 140px 1fr", gap: 0, borderBottom: i < REVENUE_STREAMS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <div style={{ background: i % 3 === 0 ? "rgba(201,168,76,0.3)" : i % 3 === 1 ? "rgba(16,185,129,0.3)" : "rgba(59,130,246,0.25)" }} />
                <div style={{ padding: "16px 12px", fontSize: 11, fontWeight: 700, color: "#fff" }}>{rs.stream}</div>
                <div style={{ padding: "16px 12px", fontSize: 10.5, color: C.gold }}>{rs.type}</div>
                <div style={{ padding: "16px 12px", fontSize: 10.5, color: C.muted, lineHeight: 1.4 }}>{rs.per}</div>
                <div style={{ padding: "16px 12px", fontSize: 11, fontWeight: 700, color: C.green }}>{rs.indicative}</div>
                <div style={{ padding: "16px 12px", fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{rs.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 9.5, color: C.dim, fontStyle: "italic" }}>All figures are indicative example assumptions only. Actual commercial terms negotiated per partnership.</div>
        </div>

        {/* Partner models */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Partner Commercial Models</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PARTNER_MODELS.map(pm => (
              <div key={pm.label} style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr 1fr", gap: 0, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ padding: "18px 16px 18px 18px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: pm.color, lineHeight: 1.3 }}>{pm.label}</div>
                </div>
                <div style={{ padding: "18px 14px", fontSize: 11, color: C.muted, lineHeight: 1.6, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{pm.deploy}</div>
                <div style={{ padding: "18px 14px", fontSize: 11, color: C.muted, lineHeight: 1.6, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{pm.earn}</div>
                <div style={{ padding: "18px 14px", fontSize: 11, color: C.green, lineHeight: 1.6, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{pm.commercial}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pilot terms */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Pilot Terms</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {PILOT_TERMS.map(pt => (
              <div key={pt.label} style={{ padding: "18px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{pt.label}</div>
                <div style={{ fontSize: 12, color: "#fff", fontWeight: 600, lineHeight: 1.4 }}>{pt.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Revenue Model", href: "/partner-room/resources/travel-revenue-model" },
            { label: "Pilot Model", href: "/partner-room/resources/travel-pilot-model" },
            { label: "Commercial Case", href: "/partner-room/resources/travel-commercial-case" },
            { label: "Next Step", href: "/partner-room/next-step" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
