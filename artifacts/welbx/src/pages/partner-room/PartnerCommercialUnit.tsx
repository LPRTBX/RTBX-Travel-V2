import { useEffect } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", green: "#10b981", blue: "#3b82f6", purple: "#a78bfa", orange: "#f97316", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)" };

const LAYERS = [
  { id: "master-platform-agreement", num: "01", label: "Master Platform Agreement", color: C.gold, desc: "The foundational agreement between RTBX and an operator, portfolio owner or travel network — establishing the right to activate RTBX Core across a defined estate." },
  { id: "property-portfolio-licence", num: "02", label: "Property / Portfolio Licence", color: C.gold, desc: "Licensing scoped to a single property, a portfolio, or a full network — the commercial unit RTBX Travel is priced against." },
  { id: "deployment-and-configuration", num: "03", label: "Deployment and Configuration", color: C.blue, desc: "One-time activation work — discovery, integration mapping, signal configuration and governance setup for the licensed unit." },
  { id: "operating-system-activation", num: "04", label: "Operating System Activation", color: C.blue, desc: "Recurring fee per Operating System activated (Guest Experience, Service Recovery, Marketplace & Loyalty, Operator Intelligence, Safety & Welfare)." },
  { id: "module-activation", num: "05", label: "Module Activation", color: C.blue, desc: "Recurring fee per module activated within an Operating System — allowing partners to scope exactly what is switched on for their environment." },
  { id: "managed-intelligence", num: "06", label: "Managed Intelligence", color: C.purple, desc: "Ongoing reporting, benchmarking and portfolio-level intelligence layered on top of an active deployment — outcome, evidence and value tracking across the estate." },
  { id: "partner-marketplace-revenue", num: "07", label: "Partner / Marketplace Revenue", color: C.green, desc: "Revenue share generated when marketplace, loyalty or local-service partners are activated through the guest journey." },
  { id: "expansion-model", num: "08", label: "Expansion Model", color: C.orange, desc: "How commercial terms extend as a deployment grows — additional properties, additional Operating Systems, and portfolio-wide intelligence." },
];

const USAGE_LEAD = ["Active properties", "Active Operating Systems", "Signals processed", "Moments recognised", "Playbooks executed", "Communications coordinated", "Outcomes completed", "Value recorded"];
const USAGE_AVOID = ["Seats", "Chats", "Tokens"];

function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>;
}

export default function PartnerCommercialUnit() {
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
          <SectionLabel>Commercial</SectionLabel>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.15, marginBottom: 18, maxWidth: 760 }}>
            The RTBX Travel Commercial Unit
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 720, marginBottom: 10 }}>
            Travel is primarily commercialised by <strong style={{ color: "rgba(255,255,255,0.7)" }}>property, portfolio or travel network</strong> — not by seat or user count. A licensed unit activates RTBX Core underneath it, then layers on Operating Systems, modules and managed intelligence as the deployment matures.
          </p>
          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
            This page describes commercial structure at a conceptual level. Specific pricing and terms are set out in the Commercial Partnership Brief and Revenue Model, available separately in the Brief Library.
          </p>
        </div>

        {/* Revenue layers */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Revenue Layers</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {LAYERS.map(l => (
              <div key={l.id} id={l.id} className="rtbx-stack-row" style={{ display: "grid", gridTemplateColumns: "44px 260px 1fr", gap: 0, border: "1px solid rgba(255,255,255,0.06)", scrollMarginTop: 100 }}>
                <div style={{ padding: "18px 0 18px 16px", fontSize: 10, fontWeight: 800, color: l.color, opacity: 0.6 }}>{l.num}</div>
                <div style={{ padding: "18px 16px", fontSize: 12.5, fontWeight: 700, color: l.color, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{l.label}</div>
                <div style={{ padding: "18px 16px", fontSize: 12, color: C.muted, lineHeight: 1.7, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{l.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage / metrics framing */}
        <div style={{ marginBottom: 56, padding: "30px 32px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${C.gold}` }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Usage — What We Report</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.green, marginBottom: 12 }}>Lead with</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {USAGE_LEAD.map(u => <div key={u} style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", padding: "6px 12px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>{u}</div>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(239,68,68,0.7)", marginBottom: 12 }}>Not seats, chats or tokens</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {USAGE_AVOID.map(u => <div key={u} style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", padding: "6px 12px", border: "1px solid rgba(255,255,255,0.1)", textDecoration: "line-through" }}>{u}</div>)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Commercial", href: "/partner-room/commercial" },
            { label: "Rollout Model", href: "/partner-room/rollout-model" },
            { label: "Commercial Partnership Brief", href: "/partner-room/resources/travel-commercial-partnership-brief" },
            { label: "Revenue Model", href: "/partner-room/resources/travel-revenue-model" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
