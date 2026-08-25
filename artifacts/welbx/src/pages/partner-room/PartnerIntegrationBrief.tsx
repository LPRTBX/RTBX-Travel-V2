import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

type IntegrationStatus = "Demonstrable" | "Configurable" | "Planned" | "Architecturally Defined";

const STATUS_COLORS: Record<IntegrationStatus, string> = {
  Demonstrable: "#10b981", Configurable: "#3b82f6", Planned: "#f97316", "Architecturally Defined": "rgba(255,255,255,0.35)",
};

const INTEGRATION_CATEGORIES: { title: string; sub: string; desc: string; color: string; status: IntegrationStatus }[] = [
  {
    title: "Property Management Systems",
    sub: "PMS",
    desc: "Arrival manifests, room status, reservation data, loyalty tier, guest profile, check-in/out events.",
    color: "#c9a84c",
    status: "Configurable",
  },
  {
    title: "Housekeeping Platforms",
    sub: "OPERATIONS",
    desc: "Room readiness pipeline, task assignment status, completion timestamps, staff capacity ratios.",
    color: "#c9a84c",
    status: "Configurable",
  },
  {
    title: "Task Management & Workforce",
    sub: "WORKFORCE",
    desc: "Staff assignment, response latency, task completion rates, shift logs, handover quality signals.",
    color: "#3b82f6",
    status: "Configurable",
  },
  {
    title: "Guest-Facing Applications",
    sub: "GUEST APP",
    desc: "In-stay requests, sentiment signals, complaint submissions, dining intent, service interaction data.",
    color: "#3b82f6",
    status: "Demonstrable",
  },
  {
    title: "CRM & Loyalty Platforms",
    sub: "CRM / LOYALTY",
    desc: "Guest history, loyalty tier, preference profiles, spend patterns, prior stay records, cancellation signals.",
    color: "#a78bfa",
    status: "Configurable",
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
    status: "Demonstrable",
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
    status: "Architecturally Defined",
  },
  {
    title: "Building & IoT Infrastructure",
    sub: "BMS / IoT",
    desc: "Queue sensor data, environmental signals, energy anomalies, safety system triggers, HVAC status.",
    color: "#10b981",
    status: "Architecturally Defined",
  },
  {
    title: "Partner Systems",
    sub: "PARTNER SYSTEMS",
    desc: "Local service, marketplace and loyalty partner systems activated through RTBX Travel at the right moment in the guest journey.",
    color: "#22d3ee",
    status: "Planned",
  },
];

const FLOW_NODES = [
  { label: "Existing Systems",        sub: "PMS, HKP, CRM, POS, IoT" },
  { label: "RTBX Core Connection Layer",  sub: "247 signal types, real-time or near-real-time" },
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
            RTBX Travel is a signal-to-action layer, not a replacement. Every data source your platform already manages becomes a captured signal input to the moment engine, through the RTBX Integration Hub. A single approved integration makes your system a trigger in the operating chain — creating compounding value for operators that neither platform can generate alone.
          </p>
          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
            Not every system below is integrated for every deployment. Each category is labelled with its current status — 'Demonstrable' means working in this Partner Room environment; 'Architecturally Defined' means the integration model is specified but not yet connected.
          </p>
        </div>

        <div style={{ padding: "20px 24px", background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.15)", borderLeft: "3px solid #3b82f6", marginBottom: 24 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "#3b82f6", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>No Rip-and-Replace</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>
            RTBX Travel connects to the systems already running in your property. The PMS, housekeeping app, guest app, CRM and task management platforms you depend on today become signal sources. RTBX adds the governed execution layer between them — nothing is removed, nothing is replaced.
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
            Integration Categories → RTBX Integration Hub
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
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
            RTBX Core prefers a push-first model where approved systems can send signal events to RTBX. Where push events are not available, other integration patterns can be assessed during technical discovery. The integration surface is intentionally minimal: a single webhook endpoint per signal category, with a documented schema for each source type. Simple push-first or webhook-based integrations may be testable within a short technical sprint. Timing depends on partner access, data permissions, system capability and operator approval.
          </p>
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
