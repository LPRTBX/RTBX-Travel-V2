import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#a8dedb", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981", blue: "#3b82f6", violet: "#a78bfa" };

const ARCHITECTURE_STAGES = [
  "Captured Signals",
  "Signal Registry",
  "Moment Classification Engine",
  "Risk & Priority Engine",
  "Decision Spine",
  "Action Pathway Engine",
  "Communication Routing",
  "Assurance Log",
  "Outcome & Value Registry",
  "Pattern Intelligence Layer",
];

const DATA_MODEL = [
  { label: "Signal", desc: "The raw captured input — staff, guest, operator or approved system-sourced. Timestamped, sourced and typed." },
  { label: "Moment", desc: "A classified event created from one or more signals, assigned a category, urgency and escalation threshold." },
  { label: "Action", desc: "The governed response triggered by a moment — task, message, escalation or marketplace offer." },
  { label: "Outcome", desc: "The recorded result of an action — resolved, escalated, missed, converted." },
  { label: "Assurance Record", desc: "The immutable-by-design audit entry linking signal, moment, action and outcome for reporting and compliance." },
];

const ROLE_UX = [
  { role: "Guest", color: "#3b82f6", sees: "Guest-facing Experience layer — support prompts, recovery options, in-stay nudges." },
  { role: "Staff", color: "#10b981", sees: "Task queue, action cards, escalation alerts, resolution timers." },
  { role: "Manager", color: "#a8dedb", sees: "Property-level moment dashboard, escalation breaches, team performance." },
  { role: "Executive", color: "#a78bfa", sees: "Portfolio-level value proof, recovery rate, assurance completeness." },
  { role: "Partner", color: "#f97316", sees: "Deployment brief, integration status, commercial reporting." },
  { role: "Funder", color: "#22d3ee", sees: "Outcome evidence, category opportunity, roadmap and traction reporting." },
];

const QA_MODEL = [
  { label: "Classification QA", desc: "Every moment classification is testable against a labelled scenario library, with false-positive and false-negative rates tracked per moment category." },
  { label: "Role/Privacy QA", desc: "Access control tested per role — guests never see operator data, staff never see other guests' welfare signals beyond assigned scope." },
  { label: "Integration QA", desc: "Every webhook and push integration is contract-tested against its documented schema before going live in a pilot environment." },
  { label: "GitHub CI Pathway", desc: "Pull requests run automated type-checking, schema validation and scenario regression tests before merge; deployment gates require a passing CI run." },
];

export default function TravelArchitectureModellingUxQa() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · Architecture, Modelling, UX & QA</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 720 }}>
            JALDO Travel — Architecture, Modelling, UX & QA
          </h1>
          <div style={{ padding: "16px 20px", background: "rgba(168,222,219,0.06)", border: "1px solid rgba(168,222,219,0.22)", borderLeft: "3px solid #a8dedb", maxWidth: 700 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              "Same moment. Different view. One assurance trail."
            </p>
          </div>
        </div>

        {/* Core architecture */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Core Architecture — Signal-to-Action Flow</div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            {ARCHITECTURE_STAGES.map((stage, i) => (
              <div key={stage} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ padding: "9px 14px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.02)" }}>{stage}</div>
                {i < ARCHITECTURE_STAGES.length - 1 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Data model */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Data Model</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {DATA_MODEL.map(d => (
              <div key={d.label} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 0, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ padding: "14px 16px", fontSize: 11.5, fontWeight: 700, color: "#fff", borderRight: "1px solid rgba(255,255,255,0.05)" }}>{d.label}</div>
                <div style={{ padding: "14px 16px", fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Role-based UX */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Role-Based UX</div>
          <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {ROLE_UX.map(r => (
              <div key={r.role} style={{ padding: "20px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${r.color}` }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: r.color, marginBottom: 8 }}>{r.role}</div>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, margin: 0 }}>{r.sees}</p>
              </div>
            ))}
          </div>
        </div>

        {/* QA model */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>QA Model</div>
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {QA_MODEL.map(q => (
              <div key={q.label} style={{ padding: "20px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${C.green}` }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{q.label}</div>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, margin: 0 }}>{q.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Travel Intelligence", href: "/partner-room/travel-intelligence" },
            { label: "Travel AI & Central Comms", href: "/partner-room/travel-ai-comms" },
            { label: "AI Intelligence Layer", href: "/partner-room/resources/travel-ai-intelligence-layer" },
            { label: "Systems Map", href: "/partner-room/resources/travel-systems-map" },
            { label: "Brief Library", href: "/partner-room/brief-library" },
            { label: "Product Proof", href: "/partner-room/product-proof" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
