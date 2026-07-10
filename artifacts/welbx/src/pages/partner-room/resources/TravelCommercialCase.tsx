import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981", blue: "#3b82f6" };

const REVENUE_PATHWAYS = [
  { label: "Guest Recovery Value", color: "#c9a84c", desc: "Every avoided negative review, reduced churn event and loyalty recovery represents measurable revenue protected. Estimated A$300–A$4,000 per prevented review-driven cancellation or churn event.", signal: "Review risk prevented + repeat-stay preserved" },
  { label: "Staff Response Value", color: "#3b82f6", desc: "Faster, more accurate staff response reduces shift overhead, reduces repeat contact from the same guest and reduces management intervention cost per shift.", signal: "Staff time saved per shift" },
  { label: "Marketplace & Local Partner", color: "#10b981", desc: "Every activated dining, experience, transport or local offer moment creates a transaction. RTBX Travel takes a share. Partners pay for routing access and activation at the right moment.", signal: "Commercial moment activated" },
  { label: "Loyalty & Repeat Stay", color: "#a78bfa", desc: "A guest who receives a welfare prompt, a recovery option or a concierge activation is statistically more likely to return. Repeat-stay value across a property portfolio is material.", signal: "Repeat stay pathway activated" },
  { label: "Intelligence & Reporting", color: "#f97316", desc: "Operators, groups and funders pay for aggregated insight: which moments drive the most value, which staff responses reduce escalations, what the environment health score looks like across properties.", signal: "Intelligence layer subscription" },
];

const MOATS = [
  { label: "Signal Library Depth", text: "247+ configured signal types, built for travel-specific environments. Not generic IoT or building management data. Guest, staff, operational and commercial signals." },
  { label: "Moment-Level Classification", text: "Not just alerting — RTBX Core classifies the type of moment, the escalation threshold and the appropriate response logic. The MVP starts with rules-based classification. Over time, RTBX Core becomes a governed decision system strengthened by approved integrations, operator playbooks and outcome data." },
  { label: "Assurance Registry", text: "Every action and outcome is logged. This creates duty-of-care evidence, operational proof and a reportable audit trail that no other travel tech product currently provides." },
  { label: "WELBX Interface", text: "A zero-download, no-login guest interface that requires no adoption friction. The guest doesn't need an app. The interface meets them at the right moment." },
  { label: "Deployment Speed", text: "A pilot can begin without heavy integration. Push-first signal model means signal capture starts immediately, with deeper integration layered in over time." },
  { label: "Multi-Vertical Architecture", text: "The same RTBX Core engine serves hotels, holiday parks, corporate travel, events and destinations. No competitor operates across all five verticals with a unified operating layer." },
];

const EXIT_PATHWAYS = [
  { label: "Hospitality Tech Acquirer", desc: "Oracle Hospitality, Agilysys, Mews, Cloudbeds or a major PMS vendor acquiring an execution layer to deepen their product and lock in operators." },
  { label: "Travel Group Strategic Buyer", desc: "A major hotel group or travel management company acquiring RTBX Travel infrastructure to give their portfolio a competitive execution advantage." },
  { label: "Insurance or Liability Platform", desc: "The assurance registry and duty-of-care pathway has direct value to insurance and liability platforms operating in the travel and hospitality sector." },
  { label: "Loyalty or Experience Platform", desc: "A loyalty programme operator or experience marketplace acquiring the activation and marketplace layer as a retention and monetisation play." },
];

export default function TravelCommercialCase() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · Commercial Case</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>RTBX Travel — Commercial Case</h1>
          <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.22)", borderLeft: "3px solid #c9a84c", maxWidth: 720 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              "RTBX Travel sits at the intersection of guest experience, operator performance and commercial activation — a system where better execution creates value across the whole travel ecosystem."
            </p>
          </div>
        </div>

        {/* Category opportunity */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Category Opportunity</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              { label: "Global hotel market", value: "A$2.5T+", sub: "Annual revenue — execution infrastructure is a small but high-margin category" },
              { label: "Holiday parks (AU & NZ)", value: "A$12B+", sub: "AU & NZ outdoor hospitality market — rapidly digitalising, under-served by current tech" },
              { label: "Corporate travel", value: "A$1.3T+", sub: "Global market — duty-of-care and traveller wellbeing is a priority spend category" },
              { label: "Events & venues", value: "A$1.5T+", sub: "Global events market — welfare, safety and crowd management tech demand rising" },
            ].map(stat => (
              <div key={stat.label} style={{ padding: "24px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(201,168,76,0.35)" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.gold, marginBottom: 8, letterSpacing: "-0.02em" }}>{stat.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{stat.label}</div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.55 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue pathways */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Revenue Pathways</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {REVENUE_PATHWAYS.map(rp => (
              <div key={rp.label} style={{ display: "grid", gridTemplateColumns: "200px 1fr 180px", gap: 0, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ padding: "20px 16px 20px 20px" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: rp.color, lineHeight: 1.3 }}>{rp.label}</div>
                </div>
                <div style={{ padding: "20px 16px", fontSize: 11.5, color: C.muted, lineHeight: 1.65, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{rp.desc}</div>
                <div style={{ padding: "20px 16px", fontSize: 10.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.55, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{rp.signal}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Moats */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Multiple Moats</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {MOATS.map(m => (
              <div key={m.label} style={{ padding: "20px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{m.label}</div>
                </div>
                <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{m.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Exit pathways */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Strategic Exit Pathways</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {EXIT_PATHWAYS.map((ep, i) => (
              <div key={ep.label} style={{ padding: "22px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `2px solid rgba(201,168,76,${0.2 + i * 0.08})` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{ep.label}</div>
                <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{ep.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Revenue Model", href: "/partner-room/resources/travel-revenue-model" },
            { label: "Business Plan", href: "/partner-room/resources/travel-business-plan" },
            { label: "Commercial Brief", href: "/partner-room/resources/travel-commercial-partnership-brief" },
            { label: "GTM Plan", href: "/partner-room/resources/travel-gtm-plan" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
