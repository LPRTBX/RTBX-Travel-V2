import { useEffect } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)" };

const BUILDERS = [
  { id: "property-setup",       label: "Property Setup",                color: "#c9a84c", desc: "Configure the property type, environment (hotel, resort, serviced apartment), and portfolio scope for this deployment. Defines the operational context RTBX Core operates within.", href: "/partner-room/deployments", cta: "Open Deployment Environments" },
  { id: "systems-integrations", label: "Systems & Integrations",        color: "#3b82f6", desc: "Maps which signal sources — PMS, housekeeping, CRM, guest app, IoT — feed the Travel Signal Registry for this deployment. Defines the integration surface and data flows.", href: "/partner-room/product-proof/signal-capture", cta: "Open Signal Capture" },
  { id: "operating-systems",    label: "Operating Systems & Modules",   color: "#a78bfa", desc: "Select which Travel Operating Systems and modules are activated for this deployment — Arrival OS, Rooms OS, F&B OS, Welfare OS, and the Commercial Activation layer.", href: "/partner-room/decision-spine", cta: "Open Decision Spine" },
  { id: "roles-governance",     label: "Roles & Governance",            color: "#10b981", desc: "Configure the roles, approval authorities, and governance sources that determine who owns each moment type and what they are authorised to do. Maps to your existing org structure.", href: "/partner-room/scenario-builder", cta: "Open Scenario Builder" },
  { id: "scenarios-playbooks",  label: "Scenarios & Playbooks",         color: "#22d3ee", desc: "Select and configure the scenarios and playbooks available to role owners once governance has cleared a moment. Assembles the Travel Playbook library for this property.", href: "/partner-room/scenario-builder", cta: "Open Scenario Builder" },
  { id: "comms-channels",       label: "Comms Channels",                color: "#f59e0b", desc: "Configure the communication channels Central Comms OS uses to deliver instructions and updates — staff app, guest app, SMS, email, in-room system, and front desk alerts.", href: "/partner-room/comms-demo", cta: "Open Comms Demo" },
  { id: "evidence-outcomes",    label: "Evidence & Outcomes",           color: "#f97316", desc: "Set the outcome targets and evidence requirements for each moment category. Defines what successful resolution looks like and what is logged to the assurance record.", href: "/partner-room/validation-replay", cta: "Open Validation Replay" },
];

export default function PartnerBuildConfigure() {
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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 140px" }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            RTBX Travel · Build &amp; Configure
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 720 }}>
            Configure Your Travel Deployment
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700 }}>
            These are the configuration surfaces used to set up an RTBX Core deployment for a property — not a replacement for the property's PMS, CRM, loyalty platform or booking engine. Each surface below links to the closest working proof of that capability in the Partner Room.
          </p>
        </div>

        {/* Maturity callout */}
        <div style={{ padding: "18px 22px", background: "rgba(255,165,0,0.04)", border: "1px solid rgba(255,165,0,0.2)", borderLeft: "3px solid #f97316", marginBottom: 36 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.16em", color: "#f97316", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Current Status: Prototype &amp; Simulation
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>
            This configurator demonstrates the selection model for Travel deployments. Full functional persistence — saving configurations, activating integrations, creating live accounts — is deferred to Sprint 4 and pilot engagement. The selection surfaces shown are architecturally representative of what will be configured during an actual deployment.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {BUILDERS.map(b => (
            <div key={b.id} id={b.id} style={{ padding: "26px 26px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `2px solid ${b.color}`, display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center", scrollMarginTop: 90 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: b.color, marginBottom: 8, letterSpacing: "0.01em" }}>{b.label}</div>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, margin: 0, maxWidth: 620 }}>{b.desc}</p>
              </div>
              <Link href={b.href}>
                <div style={{
                  padding: "10px 18px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: b.color, border: `1px solid ${b.color}40`,
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${b.color}10`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {b.cta} →
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
