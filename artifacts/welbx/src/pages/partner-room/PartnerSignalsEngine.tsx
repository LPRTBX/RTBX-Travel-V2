import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { PartnerCTAFooter } from "@/components/PartnerCTAFooter";
import { PartnerProofBanner } from "@/components/PartnerProofBanner";
import { usePartnerContent } from "@/context/PartnerContentContext";
import { SIGNAL_CATEGORIES } from "@/data/signals";

const DEFAULT_LOGIC_CHAIN = [
  { step: "01", label: "Event Ingestion",      desc: "Signal arrives via push from source system in real time" },
  { step: "02", label: "Normalisation",         desc: "Event mapped to WELBX signal schema, type and source tagged" },
  { step: "03", label: "Confidence Scoring",    desc: "Historical accuracy and source reliability applied to weighting" },
  { step: "04", label: "Pattern Matching",      desc: "Signal compared against configured moment patterns in BXOS — pilot library" },
  { step: "05", label: "Cluster Detection",     desc: "Co-occurring signals grouped; combined confidence calculated" },
  { step: "06", label: "Threshold Evaluation",  desc: "Cluster assessed against moment creation threshold for its category" },
  { step: "07", label: "Moment Trigger",        desc: "If threshold met, moment created and playbook queued for execution" },
];

const CATEGORY_COLORS: Record<string, string> = {
  guest: "#c9a84c",
  workforce: "#3b82f6",
  operational: "#10b981",
  commercial: "#a78bfa",
  strategic: "#22d3ee",
};

export default function PartnerSignalsEngine() {
  const { content } = usePartnerContent();
  const logicChain = content?.signalsEngine?.logicChain ?? DEFAULT_LOGIC_CHAIN;
  const headline = content?.signalsEngine?.headline ?? "A Configured Signal Library.\nOne Operating Picture.";
  const subheadline = content?.signalsEngine?.subheadline ?? "The WELBX signal layer reads from every operational source a property already generates data from. Signals are normalised, weighted, and pattern-matched in real time — creating a live operating picture that the moment engine acts on continuously.";

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#3b82f6", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Signals Engine Brief
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 720 }}>
            {headline.split("\n").map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 680 }}>
            {subheadline}
          </p>
        </div>

        {/* Proof banner */}
        <PartnerProofBanner />

        {/* Signal category sections */}
        <div style={{ marginBottom: 80, display: "flex", flexDirection: "column", gap: 2 }}>
          {SIGNAL_CATEGORIES.filter(c => ["guest", "workforce", "operational", "commercial"].includes(c.id)).map(cat => {
            const color = CATEGORY_COLORS[cat.id] ?? "#c9a84c";
            return (
              <div key={cat.id} style={{
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}>
                {/* Category header */}
                <div style={{
                  padding: "20px 28px",
                  background: "rgba(255,255,255,0.025)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.06em" }}>{cat.label}</div>
                  <div style={{ fontSize: 9, color: color, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase" }}>
                    {cat.count} signal types — configured library
                  </div>
                </div>

                {/* Signal rows */}
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 100px 90px 1fr", gap: 0, padding: "10px 28px 6px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {["Signal", "Source", "Frequency", "Confidence", "Triggerable Moments"].map(h => (
                      <div key={h} style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700 }}>{h}</div>
                    ))}
                  </div>
                  {cat.signals.map((sig, i) => (
                    <div key={sig.name} style={{
                      display: "grid",
                      gridTemplateColumns: "1.5fr 1fr 100px 90px 1fr",
                      gap: 0,
                      padding: "14px 28px",
                      borderBottom: i < cat.signals.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      alignItems: "center",
                    }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{sig.name}</span>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginLeft: 8, letterSpacing: "0.06em" }}>{sig.type}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{sig.source}</div>
                      <div style={{ fontSize: 11, color: color, fontWeight: 600 }}>{sig.frequency}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: sig.confidence >= 90 ? "#10b981" : sig.confidence >= 75 ? "#c9a84c" : "rgba(255,255,255,0.5)" }}>
                        {sig.confidence}%
                      </div>
                      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                        {sig.moments.join(" · ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Logic chain */}
        <div style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
            Signal-to-Moment Logic Chain
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {logicChain.map((item: typeof DEFAULT_LOGIC_CHAIN[0], i: number) => (
              <div key={item.step} style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: 24,
                padding: "20px 0",
                borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
                alignItems: "flex-start",
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(59,130,246,0.4)", letterSpacing: "0.06em", paddingTop: 2 }}>{item.step}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <PartnerCTAFooter />
      </div>
    </PartnerRoomLayout>
  );
}
