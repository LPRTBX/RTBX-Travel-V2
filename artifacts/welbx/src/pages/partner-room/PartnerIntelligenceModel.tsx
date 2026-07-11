import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", green: "#10b981", blue: "#3b82f6", purple: "#a78bfa", cyan: "#22d3ee" };

const PACK_COMPONENTS = [
  { label: "Travel Signal Registry",  color: C.blue,   desc: "Every guest, staff, operator and system signal relevant to a travel environment, classified and scored.", href: "/partner-room/signals-engine" },
  { label: "Travel Moment Engine",    color: C.gold,   desc: "Recognises which of the known travel moment types a signal cluster belongs to.", href: "/partner-room/moments-economy" },
  { label: "Travel Governance",       color: C.purple, desc: "The pre-approved rules that decide what is allowed to happen in response to a moment.", href: "/partner-room/decision-spine" },
  { label: "Travel Playbook Library", color: C.green,  desc: "The response patterns available to a role owner once governance has cleared a moment.", href: "/partner-room/decision-spine" },
  { label: "Travel Role Routing",     color: C.cyan,   desc: "Ensures the right human role — never an autonomous system — owns the response.", href: "/partner-room/operator-demo" },
  { label: "Travel Central Comms & AI Assistants", color: "#f97316", desc: "AI-assisted drafting and routing of the communication or instruction, with a human owner approving delivery.", href: "/partner-room/comms-demo" },
];

export default function PartnerIntelligenceModel() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 140px" }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Travel Intelligence · Model
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 720 }}>
            The Travel Intelligence Pack
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700 }}>
            The Travel Intelligence Pack is how RTBX Core's shared intelligence — the Signal Registry, Moment Engine, Governance Library, Decision Spine, Playbook Library and Central Comms OS — is tuned specifically for travel and hospitality environments. It does not duplicate RTBX Core; it configures it.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 56 }}>
          {PACK_COMPONENTS.map(item => (
            <Link key={item.label} href={item.href}>
              <div style={{
                padding: "24px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${item.color}`, cursor: "pointer", transition: "all 0.15s", height: "100%",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: item.color, marginBottom: 10, letterSpacing: "0.02em" }}>{item.label}</div>
                <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ padding: "20px 22px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", marginBottom: 48 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.14em", color: C.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Governed, Not Autonomous</div>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, margin: 0 }}>
            AI assists with classification, drafting and routing across every Travel Intelligence Pack component. It does not autonomously make safety, compensation, legal or welfare decisions — every response passes through Travel Governance to a named human role owner.
          </p>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Operating Model", href: "/partner-room/operating-model" },
            { label: "Connection Map",  href: "/partner-room/resources/travel-systems-map" },
            { label: "Role Views",      href: "/partner-room/operator-demo" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
