import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { ENGINE_STAGES, INTELLIGENCE_LAYERS } from "@/data/rtbxArchitecture";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", green: "#10b981", blue: "#3b82f6", purple: "#a78bfa" };

const HIERARCHY = [
  { label: "RTBX Core", sub: "Signal-to-action infrastructure" },
  { label: "Travel Intelligence Pack", sub: "Signals, moments and governance tuned for travel" },
  { label: "Travel Operating Systems", sub: "Guest, Recovery, Marketplace, Intelligence, Welfare" },
  { label: "Activated Modules", sub: "The specific modules switched on for this deployment" },
  { label: "Hotel / Resort / Park Configuration", sub: "Property-specific rules, roles and channels" },
  { label: "Active Travel Operating Environment", sub: "The live, running system for this property" },
];

const PUBLIC_PROMISE = [
  { label: "Guest and Operational Signals", desc: "Every relevant signal already generated across guest and operational touchpoints" },
  { label: "Governed Response", desc: "Every response follows a pre-approved, auditable governance rule — never an autonomous judgement call" },
  { label: "Coordinated Action", desc: "The right role owner receives the right instruction through the right channel" },
  { label: "Measurable Guest and Operator Outcomes", desc: "Every action is logged as evidence and rolled up into value the operator can see" },
];

const OPERATING_LOOP = [
  { label: "Signal",              desc: "A guest, staff, system or partner signal is captured" },
  { label: "Moment",              desc: "The signal is classified into a known moment type" },
  { label: "Governance Rule",     desc: "A pre-approved governance rule determines what may happen next" },
  { label: "Travel Playbook",     desc: "The matching Travel Playbook selects the response pattern" },
  { label: "Role Owner",          desc: "A named human role owns the response — never an autonomous system" },
  { label: "Communication / Action", desc: "Central Comms OS delivers the instruction or update to the right person" },
  { label: "Outcome / Evidence",  desc: "The resolution is logged to the Outcome and Evidence Ledgers" },
  { label: "Value / Learning",    desc: "The Evidence, Outcome and Value Layer and Learning and Intelligence Layer turn the outcome into measurable, compounding value" },
];

const FULL_ARCHITECTURE = [
  "PMS / CRM / Guest / Staff / Partner Inputs",
  "RTBX Integration Hub",
  "Travel Signal Registry",
  "Context and Moment Layer — Travel Configuration",
  "Travel Governance",
  "Decision Spine",
  "Travel Playbook Library",
  "Escalation and Role Routing",
  "Central Comms OS",
  "RTBX Execution Centre — Travel Environment",
  "Evidence and Outcome Ledgers",
  "Evidence, Outcome and Value Layer",
  "Travel Intelligence",
];

function Chain({ items }: { items: { label: string; sub?: string; desc?: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {items.map((item, i) => (
        <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, flexShrink: 0, marginTop: 4 }} />
            {i < items.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 28, background: "rgba(201,168,76,0.25)" }} />}
          </div>
          <div style={{ paddingBottom: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, maxWidth: 560 }}>{item.sub ?? item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PartnerOperatingModel() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "72px 32px 140px" }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Travel Intelligence · Operating Model
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.15, marginBottom: 20, maxWidth: 720 }}>
            The RTBX Core Operating Model
          </h1>
          <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.22)", borderLeft: "3px solid #c9a84c", maxWidth: 700, marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: 0, fontWeight: 600 }}>
              This is the RTBX Core operating platform configured for Travel.
            </p>
          </div>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 700 }}>
            RTBX Travel is not a separate RTBX platform. It is RTBX Core — the same signal-to-action infrastructure used across every RTBX vertical — configured, tuned and governed for hotel, resort, holiday park, business travel and guest-service environments.
          </p>
        </div>

        {/* Hierarchy */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
            Simple Hierarchy
          </div>
          <div style={{ padding: "28px 28px 6px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Chain items={HIERARCHY} />
          </div>
        </div>

        {/* Public promise */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
            Public Promise
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {PUBLIC_PROMISE.map((step, i) => (
              <div key={step.label} style={{ padding: "20px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid #c9a84c", position: "relative" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(201,168,76,0.45)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{step.label}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{step.desc}</div>
                {i < PUBLIC_PROMISE.length - 1 && (
                  <div style={{ position: "absolute", right: -7, top: "50%", transform: "translateY(-50%)", width: 12, height: 1, background: "rgba(201,168,76,0.25)", zIndex: 1 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Operating loop */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
            Partner / Operating Loop
          </div>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 640, marginBottom: 24 }}>
            The deeper loop every moment runs through — from raw signal to compounding value. Every step has a named human role owner; no step is an autonomous system decision.
          </p>
          <div style={{ padding: "28px 28px 6px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Chain items={OPERATING_LOOP} />
          </div>
        </div>

        {/* Five-Step Engine */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
            Five-Step Engine
          </div>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 640, marginBottom: 24 }}>
            Every moment runs through five stages — from first signal to compounding value. Each stage has named human ownership; no stage is an autonomous system decision.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
            {ENGINE_STAGES.map((stage, i) => (
              <div key={stage.id} style={{ padding: "20px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid #c9a84c", position: "relative" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(201,168,76,0.45)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{stage.label}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{stage.summary}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Six Intelligence Layers */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
            Six Intelligence Layers
          </div>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 640, marginBottom: 24 }}>
            Each layer is part of RTBX Core, configured for Travel. The Travel configuration adds domain-specific signals, moment types, governance policies and outcome models.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {INTELLIGENCE_LAYERS.map(layer => (
              <div key={layer.id} style={{ padding: "20px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "2px solid #c9a84c" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{layer.label}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55, marginBottom: 10 }}>{layer.summary}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.5)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Primary Stage: {layer.primaryStage}</div>
                {layer.sharedCapabilities.map(cap => (
                  <div key={cap} style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", marginBottom: 3, paddingLeft: 8, borderLeft: "1px solid rgba(255,255,255,0.1)" }}>{cap}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Full architecture */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
            Full Architecture
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", lineHeight: 1.7, maxWidth: 640, marginBottom: 20, fontStyle: "italic" }}>
            Shown here because this is an architecture page. RTBX Core sits across your existing PMS, CRM, loyalty, booking and housekeeping systems — it does not replace them.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            {FULL_ARCHITECTURE.map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ padding: "9px 14px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                  {step}
                </div>
                {i < FULL_ARCHITECTURE.length - 1 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.15)" }}>→</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Travel Intelligence Model", href: "/partner-room/travel-intelligence" },
            { label: "Connection Map",            href: "/partner-room/resources/travel-systems-map" },
            { label: "Product Proof",             href: "/partner-room/product-proof" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
