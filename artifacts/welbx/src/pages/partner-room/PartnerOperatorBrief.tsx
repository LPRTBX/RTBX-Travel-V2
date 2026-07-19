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

        {/* Five-Step Engine — Operator Language */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
            The Five-Step Engine — Operator Language
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              {
                step: "01", label: "Connect", color: "#c9a84c",
                ops: "Your systems are already generating signals — arrival manifests, room status, guest app events, housekeeping updates. RTBX connects to them and reads every relevant signal as it arrives.",
                example: "PMS flags a VIP arrival with a 45-minute room delay. Guest app shows the guest has checked in remotely. Housekeeping reports the room team is at capacity.",
              },
              {
                step: "02", label: "Understand", color: "#3b82f6",
                ops: "Signals are classified into known moment types. A room delay, a loyalty arrival and a guest app check-in become a single moment: Arrival Friction — High Risk — Loyalty Protection Threshold Active.",
                example: "The system does not send a notification. It recognises that three signals together create a specific, high-priority service moment.",
              },
              {
                step: "03", label: "Decide", color: "#a78bfa",
                ops: "Governance rules determine what is permitted. Lounge access may be activated without approval. Compensation above a threshold requires manager sign-off. Guest-facing messages require human approval. No autonomous decisions.",
                example: "The Compensation Approval Matrix determines that the front desk may offer a complimentary upgrade but that any monetary compensation requires duty manager authorisation.",
              },
              {
                step: "04", label: "Act", color: "#10b981",
                ops: "The right role owner — front desk, duty manager, housekeeping team lead — receives a clear, contextualised instruction through the right channel. AI drafts the guest message; a human approves and sends it.",
                example: "Front desk receives: 'VIP arrival in 10 minutes — room not ready — lounge access authorised — send guest message to offer lounge and estimated room time.' Manager is on standby.",
              },
              {
                step: "05", label: "Learn", color: "#22d3ee",
                ops: "Every resolved moment feeds back. Detection windows improve, thresholds recalibrate, playbook performance is tracked by property and shift. Value is measured and reported to management.",
                example: "This moment type now has a resolved record: arrival sentiment protected, lounge activated, housekeeping reprioritised, no complaint received. The evidence trail is complete.",
              },
            ].map((item, i) => (
              <div key={item.step} style={{
                display: "grid", gridTemplateColumns: "60px 180px 1fr 1fr", gap: 24,
                padding: "24px 28px", background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${item.color}`,
                alignItems: "flex-start",
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: `${item.color}55`, letterSpacing: "0.08em", paddingTop: 2 }}>{item.step}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: item.color, letterSpacing: "-0.01em", paddingTop: 2 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{item.ops}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", lineHeight: 1.6, fontStyle: "italic" }}>{item.example}</div>
              </div>
            ))}
          </div>
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
