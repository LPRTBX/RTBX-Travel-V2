import { useEffect } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", green: "#10b981", blue: "#3b82f6", purple: "#a78bfa", orange: "#f97316", cyan: "#22d3ee", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)" };

const PARTNER_TYPES = [
  { id: "hotel-group-operator", label: "Hotel Group / Operator", color: C.gold, role: "Deploys RTBX Travel across a property or estate.", value: "Execution infrastructure, service recovery, staff response and commercial activation on the ground." },
  { id: "pms-crm-integration-partner", label: "PMS / CRM Integration Partner", color: C.blue, role: "Connects an existing PMS or CRM platform to RTBX Core via API.", value: "Unlocks real-time signal flow from an existing system into the operating layer, without rip-and-replace." },
  { id: "deployment-partner", label: "Deployment Partner", color: C.blue, role: "Leads discovery, configuration and activation for an operator or portfolio.", value: "Owns the on-the-ground deployment relationship and delivery timeline." },
  { id: "travel-distribution-partner", label: "Travel Distribution Partner", color: C.purple, role: "Brings RTBX Travel into a distribution network or client portfolio.", value: "Commercial pathway into vertical clients across accommodation and experience operators." },
  { id: "loyalty-partner", label: "Loyalty Partner", color: C.orange, role: "Connects loyalty programs into Marketplace & Loyalty Activation.", value: "Loyalty-tier signals inform moment recognition; loyalty offers are activated at the right moment in the guest journey." },
  { id: "local-service-marketplace-partner", label: "Local Service / Marketplace Partner", color: C.green, role: "Activates local services, experiences or offers via RTBX Travel.", value: "Reaches guests at the right moment in their stay journey; earns marketplace transaction revenue." },
  { id: "strategic-vertical-partner", label: "Strategic Vertical Partner", color: C.cyan, role: "Co-owns deployment in a vertical, geography or asset class.", value: "First-mover infrastructure position across a priority deployment vertical." },
];

export default function PartnerEcosystem() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 32px 140px" }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Start Here</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.15, marginBottom: 18, maxWidth: 760 }}>
            Partner Ecosystem
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 720 }}>
            Seven partner roles activate the RTBX Travel Operating Environment around a licensed property or portfolio — from the operator running it, through to the partners who integrate, distribute, and activate value inside it.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 48 }}>
          {PARTNER_TYPES.map((p, i) => (
            <div key={p.id} id={p.id} className="rtbx-stack-row" style={{ display: "grid", gridTemplateColumns: "260px 1fr 1fr", border: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)", scrollMarginTop: 100 }}>
              <div style={{ padding: "20px 18px", fontSize: 12.5, fontWeight: 700, color: p.color, lineHeight: 1.35 }}>{p.label}</div>
              <div style={{ padding: "20px 16px", fontSize: 11.5, color: C.muted, lineHeight: 1.65, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{p.role}</div>
              <div style={{ padding: "20px 16px", fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{p.value}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic", marginBottom: 48 }}>
          Roles described here are illustrative categories, not commitments to specific organisations. Named partner examples appear only on approved, deliberately scoped pages.
        </p>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Partnership Overview (resource)", href: "/partner-room/resources/travel-partnership-overview" },
            { label: "Commercial Partnership Brief", href: "/partner-room/resources/travel-commercial-partnership-brief" },
            { label: "Integration Architecture", href: "/partner-room/integration-brief" },
            { label: "Commercial Unit", href: "/partner-room/commercial-unit" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
