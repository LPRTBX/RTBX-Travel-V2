import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const VALUE_CARDS = [
  {
    title: "Execution Before Escalation",
    desc: "The Working Proof models how a playbook could surface a proposed response before a guest notices a gap. A named human remains accountable for approval and execution.",
    color: "#c9a84c",
  },
  {
    title: "Consistent Standards at Scale",
    desc: "Planned: operators could configure consistent decision rules across a portfolio while retaining human ownership of each response.",
    color: "#c9a84c",
  },
  {
    title: "Auditable Decisions",
    desc: "The simulation illustrates a proposed evidence trail for moments, decisions and modelled outcomes. Production logging is Planned.",
    color: "#3b82f6",
  },
  {
    title: "Workforce Intelligence",
    desc: "Planned: connected workforce signals could help surface capacity, fatigue and response-latency indicators for human review.",
    color: "#3b82f6",
  },
  {
    title: "Commercial Activation",
    desc: "The simulation models rules-based identification of dining, upsell and loyalty opportunities; no offer, task or activation is dispatched.",
    color: "#10b981",
  },
  {
    title: "Learning That Compounds",
    desc: "Planned: pilot evidence could inform reviewed changes to patterns and thresholds. The current proof does not learn or recalibrate autonomously.",
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
            Travel operators do not lack data. They lack a governed operating layer between the signals their systems generate and the actions their teams take. This Working Proof illustrates a proposed layer that could surface the right action to an accountable person. Guest Experience is the proposed guest-facing layer.
          </p>
          <div style={{ marginTop: 20, padding: "14px 18px", border: "1px solid rgba(201,168,76,0.3)", borderLeft: "3px solid #c9a84c", color: "rgba(255,255,255,0.58)", fontSize: 11.5, lineHeight: 1.65, maxWidth: 760 }}>
            <strong style={{ color: "#c9a84c" }}>Working Proof · Simulation boundary:</strong> Synthetic inputs are classified by rules and communications are drafts. No guest message, staff task, welfare action, partner activation, dispatch or external-system update occurs. Named humans remain accountable for every decision and action; integrations and pilots are Planned.
          </div>
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
                ops: "The simulation accepts synthetic arrival, room-status, guest-app and housekeeping inputs. Live system connections are Planned.",
                example: "Illustrative inputs model a VIP arrival, a 45-minute room delay, remote check-in and housekeeping capacity.",
              },
              {
                step: "02", label: "Understand", color: "#3b82f6",
                ops: "Rules classify synthetic signals into known moment types. A room delay, loyalty arrival and app check-in are modelled as one high-priority arrival-friction moment.",
                example: "No notification is sent. The proof illustrates a rules-based classification for human review.",
              },
              {
                step: "03", label: "Decide", color: "#a78bfa",
                ops: "Governance rules propose what may be permitted. All operational decisions, compensation and guest-facing communications require an accountable human. No autonomous decisions.",
                example: "An illustrative approval matrix proposes options and routes them to the named duty manager for review.",
              },
              {
                step: "04", label: "Act", color: "#10b981",
                ops: "The proof displays a proposed instruction and communication draft for the selected role. It does not dispatch tasks or messages; a human would approve and act.",
                example: "Illustrative front-desk draft: 'VIP arrival in 10 minutes — room not ready — propose lounge access and estimated room time.'",
              },
              {
                step: "05", label: "Learn", color: "#22d3ee",
                ops: "The simulation shows a proposed assurance record and indicative value model. Pilot measurement, reviewed threshold changes and management reporting are Planned.",
                example: "The model illustrates possible states: sentiment protection, proposed lounge access, housekeeping reprioritisation and a draft evidence trail.",
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
            Planned Pilot Metrics
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
