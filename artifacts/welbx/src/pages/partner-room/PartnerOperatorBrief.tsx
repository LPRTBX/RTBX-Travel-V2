import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const VALUE_CARDS = [
  {
    title: "Execution Before Escalation",
    desc: "RTBX Core acts on signals before they become visible problems. The playbook fires before the guest notices the gap — not after the complaint lands.",
    color: "#c9a84c",
  },
  {
    title: "Consistent Standards at Scale",
    desc: "Every property in the portfolio follows the same decision logic. The quality of response no longer depends on which manager is on shift.",
    color: "#c9a84c",
  },
  {
    title: "Auditable Decisions",
    desc: "Every moment, decision, and outcome is logged. When a service failure occurs, the chain is traceable — not reconstructed from memory.",
    color: "#3b82f6",
  },
  {
    title: "Workforce Intelligence",
    desc: "Staff capacity signals, fatigue indicators, and response latency are monitored continuously. RTBX Core surfaces workforce pressure before it becomes a guest-facing error.",
    color: "#3b82f6",
  },
  {
    title: "Commercial Activation",
    desc: "Dining windows, upsell moments, and loyalty activation opportunities are detected and routed — not left in the data layer waiting for a human to notice.",
    color: "#10b981",
  },
  {
    title: "Learning That Compounds",
    desc: "Every resolved moment feeds the pattern library. Detection windows improve, thresholds recalibrate, and the system gets faster with each cycle.",
    color: "#10b981",
  },
];

const KPI_METRICS = [
  { label: "Moment Detection Rate",        desc: "% of qualifying moments detected before guest impact",     target: ">90%" },
  { label: "Response Time to Action",      desc: "Median elapsed time from signal to routed task",           target: "<90s" },
  { label: "Playbook Completion Rate",     desc: "% of triggered playbooks completed within SLA",            target: ">85%" },
  { label: "VIP Arrival Score",            desc: "% of VIP arrivals meeting the welcome protocol standard",  target: ">95%" },
  { label: "Complaint Resolution Time",    desc: "Median time from complaint signal to outcome closure",     target: "<30 min" },
  { label: "Commercial Activation Rate",   desc: "% of detected activation windows acted on within window", target: ">60%" },
  { label: "Queue SLA Adherence",          desc: "% of queue pressure moments resolved before SLA breach",   target: ">88%" },
  { label: "Learning Cycle Completion",    desc: "% of resolved moments with learning record created",       target: "100%" },
];

export default function PartnerOperatorBrief() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Operator Brief
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 680 }}>
            The Execution Gap That RTBX Core Closes
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 680 }}>
            Travel operators do not lack data. They lack a governed operating layer between the signals their systems generate and the actions their teams take. That gap is where guest experience degrades, commercial value leaks, and operational cost accumulates. RTBX Core closes it — not by adding process, but by routing the right action to the right person before the moment passes. WELBX is the guest-facing experience layer guests interact with directly.
          </p>
        </div>

        {/* Value cards */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
            Operator Value
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {VALUE_CARDS.map(card => (
              <div key={card.title} style={{
                padding: "32px 26px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${card.color}`,
              }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", marginBottom: 14, letterSpacing: "-0.01em" }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Panel */}
        <div>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
            Pilot Metrics
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
            {KPI_METRICS.map((m, i) => (
              <div key={m.label} style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 140px",
                gap: 24,
                padding: "20px 28px",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                borderBottom: i < KPI_METRICS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                alignItems: "center",
              }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#fff" }}>{m.label}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>{m.desc}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c", textAlign: "right", letterSpacing: "0.04em" }}>{m.target}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
