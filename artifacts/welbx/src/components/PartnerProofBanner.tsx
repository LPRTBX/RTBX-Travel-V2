export function PartnerProofBanner() {
  return (
    <div style={{
      padding: "14px 20px",
      border: "1px solid rgba(217,180,80,0.28)",
      borderLeft: "3px solid rgba(217,180,80,0.55)",
      background: "rgba(201,168,76,0.04)",
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      marginBottom: 48,
    }}>
      <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "rgba(201,168,76,0.55)", textTransform: "uppercase", fontWeight: 700, flexShrink: 0, paddingTop: 1 }}>
        Note
      </div>
      <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, margin: 0 }}>
        Performance figures shown in this Partner Room are pilot targets, configured examples or modelled indicators unless marked as live deployment results. The purpose of the pilot is to validate signal detection, response routing, adoption and value creation in a real operating environment.
      </p>
    </div>
  );
}
