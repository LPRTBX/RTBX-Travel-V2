import { useEffect } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#a8dedb", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981", blue: "#3b82f6" };

const HEAD_SYSTEMS = [
  {
    id: "guest-experience-os",
    label: "Guest Experience OS",
    color: "#3b82f6",
    note: "Guest-facing Experience layer",
    desc: "Everything the guest sees, chooses and experiences — from check-in support to checkout. Guest Experience is the delivery surface for this OS.",
    modules: [
      { name: "Guest check-in pathways", desc: "Digital check-in, room delay options, bag hold, quiet space routing" },
      { name: "Guest welfare prompts", desc: "Privacy-safe welfare signal classification and discreet support pathways" },
      { name: "In-stay nudges", desc: "Experience, dining, transport and activity prompts at high-propensity moments" },
      { name: "Experience preferences", desc: "Profile-driven personalisation layer for moment delivery" },
      { name: "Post-stay sentiment", desc: "Checkout feedback, loyalty moment, repeat-stay pathway activation" },
      { name: "Guest Experience interface", desc: "Zero-download, no-login guest-facing experience layer. Tablets, QR, SMS or embedded" },
    ],
  },
  {
    id: "service-recovery-os",
    label: "Service Recovery & Staff Response OS",
    color: "#10b981",
    note: "Operator-facing operating layer",
    desc: "The system that ensures every service moment is caught, routed, owned and resolved. Escalation logic governs the path from signal to resolution.",
    modules: [
      { name: "Moment classification", desc: "Signal cluster recognised, moment type assigned, escalation threshold set" },
      { name: "Staff action pathways", desc: "Right staff member, right instruction, right timing — guided not manual" },
      { name: "Recovery playbooks", desc: "Pre-configured playbooks per moment type and environment" },
      { name: "Escalation rules", desc: "Threshold-based escalation from frontline to manager to command layer" },
      { name: "Manager alerts", desc: "Push notification to manager if resolution timer breached" },
      { name: "Assurance records", desc: "Every action, response and outcome logged as an auditable assurance record" },
    ],
  },
  {
    id: "marketplace-loyalty-os",
    label: "Marketplace & Loyalty Activation OS",
    color: "#a8dedb",
    note: "Commercial activation layer",
    desc: "The system that turns dwell time, guest readiness and contextual signals into activated commercial moments — dining, experiences, loyalty and local partner offers.",
    modules: [
      { name: "Local experience offers", desc: "Partner experience inventory matched to guest profile and readiness signal" },
      { name: "Dining activation", desc: "F&B upsell at high-propensity moments — dwell window, booking gap, preference flag" },
      { name: "Partner marketplace", desc: "Local partners listed and routable via moment classification logic" },
      { name: "Loyalty moments", desc: "Tier recognition, recovery offers, repeat-stay prompts delivered at the right stage" },
      { name: "Repeat-stay pathways", desc: "Post-stay CRM activation for loyalty re-engagement and return booking" },
      { name: "Commercial opportunity capture", desc: "Every activated moment, transaction and revenue event logged and attributed" },
    ],
  },
  {
    id: "operator-intelligence-os",
    label: "Operator Intelligence OS",
    color: "#a78bfa",
    note: "Command and reporting layer",
    desc: "The system that turns operating data into intelligence — environment health, value proof, pattern analysis and governance reporting for operators, groups and funders.",
    modules: [
      { name: "Moment registry", desc: "Full log of every classified moment — type, resolution, owner, outcome" },
      { name: "Signal registry", desc: "All signal inputs, classifications and confidence scores across every environment" },
      { name: "Decision spine", desc: "The governed intervention logic that classifies and routes each moment type" },
      { name: "Outcome registry", desc: "Every resolved moment linked to its outcome — recovered, escalated, logged, missed" },
      { name: "Environment health view", desc: "Live operating performance score per environment — recovery rate, response time, escalation rate" },
      { name: "Value proof and reporting", desc: "Board-ready value evidence — recovery rate, revenue surfaced, assurance completeness, portfolio comparison" },
    ],
  },
  {
    id: "safety-welfare-os",
    label: "Safety & Guest Welfare OS",
    color: "#ef4444",
    note: "Duty-of-care and escalation layer",
    desc: "The system that governs welfare, safety and incident signals — routing them to the right role owner under pre-approved escalation rules. It never makes safety, legal or welfare decisions autonomously.",
    modules: [
      { name: "Welfare signal classification", desc: "Privacy-safe recognition of welfare and safety-relevant signal patterns" },
      { name: "Duty-of-care escalation", desc: "Threshold-based escalation to duty manager, security or welfare-trained staff" },
      { name: "Incident coordination", desc: "Coordinated dispatch and status tracking across staff involved in a live incident" },
      { name: "Accessibility routing", desc: "Flags and routes accessibility needs to the appropriate support pathway" },
      { name: "Legal and compensation hold", desc: "Holds compensation, legal or safety matters for named human sign-off — never auto-approved" },
      { name: "Assurance and audit trail", desc: "Every welfare and safety action logged to the Evidence Ledger for review" },
    ],
  },
];

const ENVS = [
  { label: "Hotels & Resorts", color: "#a8dedb", systems: ["Guest Experience OS", "Service Recovery OS", "Marketplace & Loyalty OS", "Operator Intelligence OS", "Guest Welfare OS"] },
  { label: "Holiday Parks & Outdoor", color: "#10b981", systems: ["Guest Experience OS", "Service Recovery OS", "Marketplace & Loyalty OS", "Operator Intelligence OS", "Guest Welfare OS"] },
  { label: "Corporate & Business Travel", color: "#3b82f6", systems: ["Guest Experience OS", "Service Recovery OS", "Operator Intelligence OS"] },
  { label: "Events & Venues", color: "#a78bfa", systems: ["Service Recovery OS", "Operator Intelligence OS", "Guest Welfare OS"] },
  { label: "Destination & Tourism", color: "#22d3ee", systems: ["Guest Experience OS", "Marketplace & Loyalty OS", "Operator Intelligence OS"] },
];

export default function TravelSystemsMap() {
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · Connection Map / Systems Map</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>JALDO Travel — Operating Systems &amp; Connection Map</h1>
          <div style={{ padding: "16px 20px", background: "rgba(168,222,219,0.06)", border: "1px solid rgba(168,222,219,0.22)", borderLeft: "3px solid #a8dedb", maxWidth: 680 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              "The environment changes. The JALDO Travel operating logic does not."
            </p>
          </div>
        </div>

        {/* Head systems */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>JALDO Travel — Five Head Systems</div>
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {HEAD_SYSTEMS.map(hs => (
              <div key={hs.label} id={hs.id} style={{ padding: "24px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${hs.color}`, scrollMarginTop: 90 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: hs.color, marginBottom: 4, letterSpacing: "0.02em" }}>{hs.label}</div>
                <div style={{ fontSize: 8, color: hs.color, opacity: 0.55, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>{hs.note}</div>
                <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6, marginBottom: 18 }}>{hs.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {hs.modules.map(m => (
                    <div key={m.name} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 0, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: "#fff", borderRight: "1px solid rgba(255,255,255,0.04)" }}>{m.name}</div>
                      <div style={{ padding: "10px 12px", fontSize: 10.5, color: C.muted, lineHeight: 1.5 }}>{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* JALDO Core note */}
        <div style={{ marginBottom: 40, padding: "20px 22px", background: "rgba(168,222,219,0.04)", border: "1px solid rgba(168,222,219,0.15)" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.14em", color: C.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>JALDO Core — Powers Every Head System</div>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, margin: 0 }}>
            All five head systems run on JALDO Core infrastructure — the same signal ingestion, moment classification, decision spine, action routing and assurance registry. Guest Experience appears only as the guest-facing delivery surface inside the Guest Experience OS. Every other layer is operator and partner-facing.
          </p>
        </div>

        {/* Deployment matrix */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Deployment Environment — System Coverage</div>
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            {ENVS.map((env, i) => (
              <div key={env.label} style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 0, borderBottom: i < ENVS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: env.color }}>{env.label}</div>
                </div>
                <div style={{ padding: "16px 18px", borderLeft: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  {HEAD_SYSTEMS.map(hs => {
                    const active = env.systems.some(s => hs.label.includes(s.replace(" OS", "")));
                    return (
                      <div key={hs.label} style={{ padding: "3px 10px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", color: active ? hs.color : "rgba(255,255,255,0.15)", border: `1px solid ${active ? hs.color + "40" : "rgba(255,255,255,0.06)"}`, background: active ? `${hs.color}08` : "transparent" }}>
                        {hs.label.replace(" OS", "").replace(" & Staff Response", "").replace(" & Loyalty Activation", "").replace(" & ", " &\u200b")}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "UX Blueprint", href: "/partner-room/resources/travel-ux-blueprint" },
            { label: "Partnership Overview", href: "/partner-room/resources/travel-partnership-overview" },
            { label: "Demo Links", href: "/partner-room/resources/travel-demo-links" },
            { label: "Product Proof", href: "/partner-room/product-proof" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
