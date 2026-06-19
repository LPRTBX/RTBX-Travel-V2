import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const VALUE_PATHWAYS = [
  {
    title: "Operator Deployment",
    sub: "DEPLOYMENT PATHWAY",
    desc: "Commercial partners with relationships across hotel portfolios, management companies, or ownership groups deploy WELBX as the operating layer across multiple properties. Each deployment creates a compounding evidence base that accelerates the next.",
    points: ["Portfolio-scale deployment agreements", "Multi-property rollout with shared learning library", "Operator support and change management included"],
    color: "#c9a84c",
  },
  {
    title: "Technology Integration",
    sub: "INTEGRATION PATHWAY",
    desc: "Technology partners whose systems already run in hotel environments create a certified integration that makes their platform a live signal source in the WELBX moment engine. The integration creates mutual value: your platform becomes more operationally relevant; WELBX becomes richer.",
    points: ["Certified integration programme with documented schema", "Co-marketing to shared operator base", "Revenue share model for integrations that unlock new moment categories"],
    color: "#3b82f6",
  },
  {
    title: "Channel Partnership",
    sub: "CHANNEL PATHWAY",
    desc: "Distribution partners — including consultancies, technology resellers, and hospitality advisory groups — represent WELBX to their existing client base. The channel partnership is structured around successful operator deployments, not pipeline volume.",
    points: ["Structured onboarding and certification", "Deal registration and exclusivity by market where warranted", "Performance-based structure tied to live deployments"],
    color: "#a78bfa",
  },
  {
    title: "Data and Intelligence",
    sub: "DATA PATHWAY",
    desc: "Partners whose value proposition depends on operational intelligence — benchmarking platforms, consulting firms, ownership analytics groups — access anonymised, aggregated operational performance data from the WELBX network. This creates a new category of hospitality operating intelligence.",
    points: ["Aggregated, anonymised operational benchmarks", "Moment category performance by property type and market", "Joint research and industry publication opportunities"],
    color: "#10b981",
  },
  {
    title: "Pilot Co-Investment",
    sub: "PILOT PATHWAY",
    desc: "Strategic partners with an interest in proving the WELBX model in a specific market or segment co-invest in a structured pilot at a named property. The co-investment covers integration, deployment, and evidence generation — with rights to reference the outcome in joint go-to-market.",
    points: ["Named property pilot with shared evidence ownership", "Co-branded outcome report at completion", "Right of first refusal on broader deployment partnership in the same market"],
    color: "#22d3ee",
  },
  {
    title: "Market Development",
    sub: "MARKET PATHWAY",
    desc: "Partners developing new hospitality markets — from branded residences to extended-stay to mixed-use assets — work with WELBX to configure the operating layer for their specific context. The partnership creates a new application of the moment economy tailored to the asset class.",
    points: ["Custom moment library for the target asset class", "Joint IP and reference architecture for the market segment", "Exclusive deployment rights during the market development period"],
    color: "#f97316",
  },
];

export default function PartnerCommercialModel() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#a78bfa", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Commercial Model
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 720 }}>
            Value Created at the Point<br />of Execution
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 680 }}>
            WELBX creates value at the intersection of guest experience and operational performance — the moment of execution. Commercial partnerships are structured around that value: not in the pipeline, but in the proof. Each pathway below reflects a different way of participating in the operating layer and capturing its returns.
          </p>
        </div>

        {/* Value pathway cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {VALUE_PATHWAYS.map(pathway => (
            <div key={pathway.title} style={{
              padding: "36px 32px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: `2px solid ${pathway.color}`,
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.2em", color: pathway.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
                {pathway.sub}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, letterSpacing: "-0.01em" }}>
                {pathway.title}
              </div>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, marginBottom: 24, flex: 1 }}>
                {pathway.desc}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pathway.points.map((point, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 3, height: 3, borderRadius: "50%", background: pathway.color, flexShrink: 0, marginTop: 6 }} />
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.55 }}>{point}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{ marginTop: 56, padding: "28px 32px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, margin: 0 }}>
            Commercial model details — including pricing structure, revenue share terms, and exclusivity provisions — are covered in a direct briefing. The Partner Room is a pre-qualification environment. If one of the pathways above matches your organisation's context, the next step is a conversation.
          </p>
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
