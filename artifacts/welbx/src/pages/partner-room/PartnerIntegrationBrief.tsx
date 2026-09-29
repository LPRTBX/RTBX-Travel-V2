import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

type IntegrationStatus = "Working Proof" | "Connector-ready" | "Planned";

const STATUS_COLORS: Record<IntegrationStatus, string> = {
  "Working Proof": "#10b981", "Connector-ready": "#3b82f6", Planned: "#f97316",
};

const INTEGRATION_CATEGORIES: { title: string; sub: string; desc: string; color: string; status: IntegrationStatus }[] = [
  {
    title: "Property Management Systems",
    sub: "PMS",
    desc: "Arrival manifests, room status, reservation data, loyalty tier, guest profile, check-in/out events.",
    color: "#a8dedb",
    status: "Planned",
  },
  {
    title: "Housekeeping Platforms",
    sub: "OPERATIONS",
    desc: "Room readiness pipeline, task assignment status, completion timestamps, staff capacity ratios.",
    color: "#a8dedb",
    status: "Planned",
  },
  {
    title: "Task Management & Workforce",
    sub: "WORKFORCE",
    desc: "Staff assignment, response latency, task completion rates, shift logs, handover quality signals.",
    color: "#3b82f6",
    status: "Planned",
  },
  {
    title: "Guest-Facing Applications",
    sub: "GUEST APP",
    desc: "In-stay requests, sentiment signals, complaint submissions, dining intent, service interaction data.",
    color: "#3b82f6",
    status: "Working Proof",
  },
  {
    title: "CRM & Loyalty Platforms",
    sub: "CRM / LOYALTY",
    desc: "Guest history, loyalty tier, preference profiles, spend patterns, prior stay records, cancellation signals.",
    color: "#a78bfa",
    status: "Planned",
  },
  {
    title: "Booking Engine",
    sub: "BOOKING",
    desc: "Reservation intent, arrival windows, party composition and booking-channel signals feeding early arrival detection.",
    color: "#a78bfa",
    status: "Planned",
  },
  {
    title: "Guest Messaging",
    sub: "MESSAGING",
    desc: "Two-way guest communication channel used to deliver and confirm demo communications and staff-routed responses.",
    color: "#a78bfa",
    status: "Working Proof",
  },
  {
    title: "Maintenance Systems",
    sub: "MAINTENANCE",
    desc: "Work-order status, defect reports and technician scheduling feeding the Maintenance Defect scenario.",
    color: "#10b981",
    status: "Planned",
  },
  {
    title: "Payments",
    sub: "PAYMENTS",
    desc: "Spend patterns, refund and compensation triggers used in service-recovery and welfare playbooks.",
    color: "#10b981",
    status: "Planned",
  },
  {
    title: "Revenue Management Systems",
    sub: "RMS",
    desc: "Rate signals, occupancy patterns, activation exposure index, upsell window data, commercial triggers.",
    color: "#10b981",
    status: "Planned",
  },
  {
    title: "Building & IoT Infrastructure",
    sub: "BMS / IoT",
    desc: "Queue sensor data, environmental signals, energy anomalies, safety system triggers, HVAC status.",
    color: "#10b981",
    status: "Planned",
  },
  {
    title: "Partner Systems",
    sub: "PARTNER SYSTEMS",
    desc: "Local service, marketplace and loyalty partner systems activated through JALDO Travel at the right moment in the guest journey.",
    color: "#22d3ee",
    status: "Planned",
  },
];

const FLOW_NODES = [
  { label: "Existing Systems",        sub: "PMS, HKP, CRM, POS, IoT" },
  { label: "JALDO Core Connection Layer",  sub: "247 modelled signal types; real-time connection is Planned" },
  { label: "Context and Moment Layer", sub: "Pattern recognition and moment classification" },
  { label: "Decision Spine",          sub: "Governed playbook execution" },
  { label: "Routed Action",           sub: "Execution Centre — communication routing" },
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
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 680, marginBottom: 14 }}>
            JALDO Travel is designed as a signal-to-action layer, not a replacement. Approved data sources can become signal inputs to the moment engine through the JALDO Integration Hub. External connections remain Planned until a named integration is approved and evidenced.
          </p>
          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
            No system below is presented as currently Integrated or Production. Working Proof refers only to the demonstrated interface; Planned means the external connection is not active. Connector-ready may be used only when interface-contract evidence exists.
          </p>
        </div>

        <div style={{ padding: "20px 24px", background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.15)", borderLeft: "3px solid #3b82f6", marginBottom: 24 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "#3b82f6", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>No Rip-and-Replace</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>
            JALDO Travel is designed to connect to systems already running in a property. PMS, housekeeping, guest app, CRM and task platforms can become signal sources after approval and integration work. The Planned model adds a governed execution layer without requiring replacement of those systems.
          </p>
        </div>

        {/* Status legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          {(Object.keys(STATUS_COLORS) as IntegrationStatus[]).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLORS[s] }} />
              <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Integration category cards */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
            Integration Categories → JALDO Integration Hub
          </div>
          <div className="rtbx-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {INTEGRATION_CATEGORIES.map(cat => (
              <div key={cat.title} style={{
                padding: "26px 22px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `2px solid ${cat.color}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 7.5, letterSpacing: "0.18em", color: cat.color, textTransform: "uppercase", fontWeight: 700 }}>
                    {cat.sub}
                  </div>
                  <div style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: STATUS_COLORS[cat.status], border: `1px solid ${STATUS_COLORS[cat.status]}45`, padding: "2px 6px", whiteSpace: "nowrap" }}>
                    {cat.status}
                  </div>
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
          <div className="rtbx-stack-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0 }}>
            {FLOW_NODES.map((node, i) => (
              <div key={node.label} style={{ display: "flex", alignItems: "stretch" }}>
                <div style={{
                  flex: 1,
                  padding: "22px 16px",
                  background: i === 0 ? "rgba(59,130,246,0.07)" : i === 5 ? "rgba(168,222,219,0.07)" : "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: i === 0 ? "2px solid #3b82f6" : undefined,
                  borderRight: i === 5 ? "2px solid #a8dedb" : undefined,
                }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.3 }}>
                    {node.label}
                  </div>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                    {node.sub}
                  </div>
                </div>
                {i < 5 && (
                  <div style={{ display: "flex", alignItems: "center", padding: "0 6px", color: "rgba(168,222,219,0.3)", fontSize: 14 }}>→</div>
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
            JALDO Core prefers a push-first model where approved systems can send signal events to JALDO. Where push events are not available, other integration patterns can be assessed during technical discovery. The integration surface is intentionally minimal: a single webhook endpoint per signal category, with a documented schema for each source type. Simple push-first or webhook-based integrations may be testable within a short technical sprint. Timing depends on partner access, data permissions, system capability and operator approval.
          </p>
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
