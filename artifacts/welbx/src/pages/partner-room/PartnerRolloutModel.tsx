import { useEffect } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", green: "#10b981", blue: "#3b82f6", purple: "#a78bfa", orange: "#f97316", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)" };

const ARCHETYPE = [
  { num: "01", label: "Pilot Properties", color: C.gold, desc: "One or a small number of properties run a structured pilot — signal validation, staff pathway setup, shadow mode before going live." },
  { num: "02", label: "Initial Portfolio", color: C.gold, desc: "Pilot outcomes are reviewed. The licence extends to an initial portfolio within the same owner or network." },
  { num: "03", label: "Regional Rollout", color: C.blue, desc: "Deployment extends across a region — shared governance, shared playbooks, regional intelligence begins to compound." },
  { num: "04", label: "Network Rollout", color: C.blue, desc: "Full network activation. Every property in the estate runs on the same Operating Systems, governed the same way." },
  { num: "05", label: "Additional Operating Systems", color: C.purple, desc: "Beyond the initial Operating Systems, additional systems are activated — Marketplace & Loyalty, Safety & Welfare, Operator Intelligence." },
  { num: "06", label: "Portfolio Intelligence", color: C.purple, desc: "Cross-property patterns, benchmarking and managed intelligence reporting activate once enough properties are live." },
  { num: "07", label: "Partner / Marketplace Activation", color: C.green, desc: "Marketplace, loyalty and local-service partners are activated across the estate, creating a new partner revenue layer." },
];

const STAGES = [
  { id: "discovery-configuration", label: "Discovery and Configuration", color: C.gold, desc: "Signal sources mapped, governance rules set, playbooks and comms configured for the target property or portfolio.", href: "/partner-room/build-configure" },
  { id: "pilot-model", label: "Pilot Model", color: C.gold, desc: "8-phase structured pilot pathway with week timing, success metrics and governance sign-off before scaling.", href: "/partner-room/pilot-model" },
];

export default function PartnerRolloutModel() {
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
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Deployment</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.15, marginBottom: 18, maxWidth: 760 }}>
            Property Activation &amp; Portfolio Rollout
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 720 }}>
            Travel scales through property replication, operating-system expansion and portfolio intelligence.
          </p>
        </div>

        {/* Discovery / Pilot recap */}
        <div className="rtbx-stack-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 56 }}>
          {STAGES.map(s => (
            <div key={s.id} id={s.id} style={{ padding: "26px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${s.color}`, scrollMarginTop: 100 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 10 }}>{s.label}</div>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
              <Link href={s.href}><div style={{ display: "inline-block", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: s.color, border: `1px solid ${s.color}45`, padding: "8px 16px", cursor: "pointer" }}>Open →</div></Link>
            </div>
          ))}
        </div>

        {/* Rollout archetype */}
        <div style={{ marginBottom: 24 }}>
          <div id="property-activation" style={{ scrollMarginTop: 100, fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Rollout Archetype</div>
          <div id="portfolio-rollout" style={{ scrollMarginTop: 100, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, marginBottom: 20 }}>
            Illustrative — not a contracted rollout commitment
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 56 }}>
          {ARCHETYPE.map((a, i) => (
            <div key={a.num} className="rtbx-stack-row" style={{ display: "grid", gridTemplateColumns: "44px 240px 1fr", border: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
              <div style={{ padding: "16px 0 16px 16px", fontSize: 10, fontWeight: 800, color: a.color, opacity: 0.6 }}>{a.num}</div>
              <div style={{ padding: "16px 16px", fontSize: 12, fontWeight: 700, color: a.color, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{a.label}</div>
              <div style={{ padding: "16px 16px", fontSize: 11.5, color: C.muted, lineHeight: 1.65, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{a.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 56, padding: "20px 24px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
            "Travel scales through property replication, operating-system expansion and portfolio intelligence."
          </p>
        </div>

        <div id="managed-intelligence" style={{ scrollMarginTop: 100, marginBottom: 12, fontSize: 17, fontWeight: 800, color: "#fff" }}>Managed Intelligence &amp; Live Scenarios</div>
        <div className="rtbx-stack-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 32 }}>
          <Link href="/partner-room/operations">
            <div style={{ padding: "24px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${C.purple}`, cursor: "pointer" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.purple, marginBottom: 8 }}>Managed Intelligence</div>
              <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>Action Centre, Outcome Ledger, Evidence Ledger and Value Dashboard — the reporting layer for an active deployment.</p>
            </div>
          </Link>
          <Link href="/partner-room/travel-scenarios">
            <div style={{ padding: "24px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${C.blue}`, cursor: "pointer" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.blue, marginBottom: 8 }}>Live Scenarios</div>
              <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>Six governed scenarios walking through signal, governance, action, evidence and value end to end.</p>
            </div>
          </Link>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Commercial Unit", href: "/partner-room/commercial-unit" },
            { label: "Pilot Model (resource)", href: "/partner-room/resources/travel-pilot-model" },
            { label: "GTM Plan", href: "/partner-room/resources/travel-gtm-plan" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
