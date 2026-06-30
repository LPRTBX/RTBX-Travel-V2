import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const INTEGRATION_CATEGORIES = [
  {
    title: "Property Management Systems",
    sub: "PMS",
    desc: "Arrival manifests, room status, reservation data, loyalty tier, guest profile, check-in/out events.",
    color: "#c9a84c",
  },
  {
    title: "Housekeeping Platforms",
    sub: "OPERATIONS",
    desc: "Room readiness pipeline, task assignment status, completion timestamps, staff capacity ratios.",
    color: "#c9a84c",
  },
  {
    title: "Task Management & Workforce",
    sub: "WORKFORCE",
    desc: "Staff assignment, response latency, task completion rates, shift logs, handover quality signals.",
    color: "#3b82f6",
  },
  {
    title: "Guest-Facing Applications",
    sub: "GUEST APP",
    desc: "In-stay requests, sentiment signals, complaint submissions, dining intent, service interaction data.",
    color: "#3b82f6",
  },
  {
    title: "CRM & Loyalty Platforms",
    sub: "CRM",
    desc: "Guest history, loyalty tier, preference profiles, spend patterns, prior stay records, cancellation signals.",
    color: "#a78bfa",
  },
  {
    title: "Revenue Management Systems",
    sub: "RMS",
    desc: "Rate signals, occupancy patterns, activation exposure index, upsell window data, commercial triggers.",
    color: "#a78bfa",
  },
  {
    title: "Building & IoT Infrastructure",
    sub: "BMS / IoT",
    desc: "Queue sensor data, environmental signals, energy anomalies, safety system triggers, HVAC status.",
    color: "#10b981",
  },
  {
    title: "Point of Sale & F&B",
    sub: "POS",
    desc: "F&B velocity signals, menu constraint flags, group spend tracking, activation window confirmation.",
    color: "#10b981",
  },
];

const FLOW_NODES = [
  { label: "Existing Systems",        sub: "PMS, HKP, CRM, POS, IoT" },
  { label: "WELBX Signal Layer",      sub: "247 signal types, real-time" },
  { label: "Moment Engine",           sub: "Pattern recognition, BXOS" },
  { label: "Decision Spine",          sub: "Governed playbook execution" },
  { label: "Routed Action",           sub: "NEXUS communication routing" },
  { label: "Outcome Record",          sub: "Audit trail + learning cycle" },
];

export default function PartnerIntegrationBrief() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#3b82f6", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Integration Brief
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 680 }}>
            Your System Already Captures the Signal
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 680 }}>
            RTBX Travel is a signal-to-action layer, not a replacement. Every data source your platform already manages becomes a captured signal input to the moment engine. A single approved integration makes your system a trigger in the operating chain — creating compounding value for operators that neither platform can generate alone.
          </p>
        </div>

        {/* Integration category cards */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
            Integration Categories
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {INTEGRATION_CATEGORIES.map(cat => (
              <div key={cat.title} style={{
                padding: "26px 22px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `2px solid ${cat.color}`,
              }}>
                <div style={{ fontSize: 7.5, letterSpacing: "0.18em", color: cat.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                  {cat.sub}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
                  {cat.title}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
                  {cat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal flow diagram */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
            How It Flows
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0 }}>
            {FLOW_NODES.map((node, i) => (
              <div key={node.label} style={{ display: "flex", alignItems: "stretch" }}>
                <div style={{
                  flex: 1,
                  padding: "22px 16px",
                  background: i === 0 ? "rgba(59,130,246,0.07)" : i === 5 ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: i === 0 ? "2px solid #3b82f6" : undefined,
                  borderRight: i === 5 ? "2px solid #c9a84c" : undefined,
                }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.3 }}>
                    {node.label}
                  </div>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                    {node.sub}
                  </div>
                </div>
                {i < 5 && (
                  <div style={{ display: "flex", alignItems: "center", padding: "0 6px", color: "rgba(201,168,76,0.3)", fontSize: 14 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Push-first note */}
        <div style={{
          padding: "32px 36px",
          background: "rgba(59,130,246,0.04)",
          border: "1px solid rgba(59,130,246,0.15)",
          borderLeft: "3px solid #3b82f6",
        }}>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "#3b82f6", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
            Integration Model
          </div>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>
            WELBX operates on a push-first model. Your system pushes signal events to the WELBX API in real time — no polling, no batch sync. This ensures sub-second latency from event to moment detection. The integration surface is intentionally minimal: a single webhook endpoint per signal category, with a documented schema for each source type. Most integrations are live within a two-week technical sprint.
          </p>
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
