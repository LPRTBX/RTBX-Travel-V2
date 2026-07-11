import { useEffect } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)" };

const BUILDERS = [
  { id: "deployment-builder", label: "Deployment Builder", color: "#c9a84c", desc: "Configures which environment, roles and channels are active for a property before go-live.", href: "/partner-room/deployments", cta: "Open Deployment Environments" },
  { id: "signal-mapper",      label: "Signal Mapper",      color: "#3b82f6", desc: "Maps which signal sources — PMS, CRM, staff app, guest app — feed the Travel Signal Registry for this deployment.", href: "/partner-room/product-proof/signal-capture", cta: "Open Signal Capture" },
  { id: "governance-mapper",  label: "Governance Mapper",  color: "#a78bfa", desc: "Maps which governance rules apply to which moment types, and which role owner is authorised to act.", href: "/partner-room/decision-spine", cta: "Open Decision Spine" },
  { id: "playbook-builder",   label: "Playbook Builder",   color: "#10b981", desc: "Assembles the Travel Playbooks available to a role owner once governance has cleared a moment.", href: "/partner-room/scenario-builder", cta: "Open Scenario Builder" },
  { id: "comms-builder",      label: "Comms Builder",      color: "#22d3ee", desc: "Configures the message templates and channels Central Comms OS uses to deliver an instruction or update.", href: "/partner-room/comms-demo", cta: "Open Comms Demo" },
  { id: "scenario-tester",    label: "Scenario Tester",    color: "#f97316", desc: "Runs a scenario end-to-end against the configured deployment before it goes live, including escalation and failure paths.", href: "/partner-room/validation-replay", cta: "Open Validation Replay" },
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
            Build / Configure
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 720 }}>
            Configuring the RTBX Travel Deployment
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700 }}>
            These are the configuration surfaces used to set up an RTBX Core deployment for a property — not a replacement for the property's PMS, CRM, loyalty platform or booking engine. Each surface below links to the closest working proof of that capability in the Partner Room.
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
