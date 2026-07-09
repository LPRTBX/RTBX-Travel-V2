import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { PartnerCTAFooter } from "@/components/PartnerCTAFooter";
import { PartnerProofBanner } from "@/components/PartnerProofBanner";
import { usePartnerContent } from "@/context/PartnerContentContext";

const DEFAULT_PILOT_PHASES = [
  {
    num: "01",
    title: "Partner Alignment",
    duration: "Week 1",
    desc: "Executive alignment on pilot scope, property selection, and success metrics. Stakeholder briefing with operations and technology leads. Pilot agreement signed.",
    color: "#c9a84c",
  },
  {
    num: "02",
    title: "Signal Source Audit",
    duration: "Week 1–2",
    desc: "Review of existing data sources available at the pilot property — PMS, housekeeping software, guest app, CRM, and IoT where present. Integration surface mapped and documented.",
    color: "#c9a84c",
  },
  {
    num: "03",
    title: "Integration Sprint",
    duration: "Week 2–3",
    desc: "Technical integration of priority signal sources. Push-webhook configuration for each confirmed source. RTBX Core signal layer activated and receiving approved data from the property.",
    color: "#3b82f6",
  },
  {
    num: "04",
    title: "Moment Library Configuration",
    duration: "Week 3",
    desc: "Pilot moment library configured for the property context. Urgency thresholds reviewed with operations team. Playbooks mapped to existing staff roles and communication channels.",
    color: "#3b82f6",
  },
  {
    num: "05",
    title: "Shadow Mode",
    duration: "Week 4",
    desc: "RTBX Travel runs in parallel with existing operations — detecting, classifying, and routing moments without displacing existing workflows. Output compared against actual operational decisions made during the same period.",
    color: "#a78bfa",
  },
  {
    num: "06",
    title: "Live Activation",
    duration: "Week 5–6",
    desc: "RTBX Travel goes live as the moment-to-action operating layer for agreed moment categories. Staff briefed and supported by the RTBX Travel team. Moment detection, routing, and outcome recording active.",
    color: "#a78bfa",
  },
  {
    num: "07",
    title: "Performance Review",
    duration: "Week 7",
    desc: "Mid-pilot review against agreed KPI metrics. Playbook adjustments made based on live data. Moment library expanded if early performance justifies it.",
    color: "#10b981",
  },
  {
    num: "08",
    title: "Pilot Outcome Report",
    duration: "Week 8",
    desc: "Full pilot outcome report produced — moment detection rate, response times, resolution quality, commercial activation rate, and learning cycle completions. Basis for full deployment discussion.",
    color: "#10b981",
  },
];

const DEFAULT_SUCCESS_CRITERIA = [
  "Moment detection rate meets pilot target across all configured moment categories — validation metric",
  "Median response time from signal to routed action meets operating benchmark — pilot target",
  "VIP arrival protocol executed without incident for flagged arrivals during the pilot period",
  "At least three service recovery moments resolved before guest departure",
  "At least one commercial activation moment (dining, upsell, or ancillary) acted on per day",
  "All triggered playbooks generating a complete outcome record with learning entry",
  "Operations team satisfaction score above threshold at end-of-pilot review",
];

const READINESS_CHECKLIST = [
  "Executive sponsor confirmed",
  "Pilot property or property group identified",
  "Operations lead nominated",
  "Technology / integration lead nominated",
  "Priority signal sources mapped",
  "Priority moment categories selected",
  "Staff workflow pathway confirmed",
  "Baseline measures agreed",
  "Review cadence agreed",
  "Pilot decision date confirmed",
];

export default function PartnerPilotModel() {
  const { content } = usePartnerContent();
  const pilotModel = content?.pilotModel;

  const phases = pilotModel?.phases ?? DEFAULT_PILOT_PHASES;
  const successCriteria = pilotModel?.successCriteria ?? DEFAULT_SUCCESS_CRITERIA;
  const headline = pilotModel?.headline ?? "Eight Weeks to a Proven\nOperating Layer";
  const subheadline = pilotModel?.subheadline ?? "The RTBX Travel pilot is structured as a compressed, high-evidence engagement. It is designed to prove the value of the moment-to-action operating layer in a live property environment — with measurable outcomes at every stage and a clear performance record at the end.";

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Pilot Model
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 680 }}>
            {headline.split("\n").map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 660 }}>
            {subheadline}
          </p>
        </div>

        {/* Proof banner */}
        <PartnerProofBanner />

        {/* Phases */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
            Pilot Phases
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {phases.map((phase: typeof DEFAULT_PILOT_PHASES[0]) => (
              <div key={phase.num} style={{
                padding: "28px 28px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `2px solid ${phase.color}`,
                display: "grid",
                gridTemplateColumns: "52px 1fr",
                gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: phase.color, opacity: 0.5, letterSpacing: "-0.01em" }}>{phase.num}</div>
                  <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginTop: 4 }}>{phase.duration}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{phase.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{phase.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pilot Readiness Checklist */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
            Pilot Readiness Checklist
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
            {READINESS_CHECKLIST.map((item, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "16px 28px",
                borderBottom: i < READINESS_CHECKLIST.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}>
                <div style={{
                  width: 18,
                  height: 18,
                  border: "1px solid rgba(201,168,76,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <div style={{ width: 6, height: 6, background: "rgba(201,168,76,0.2)" }} />
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.55 }}>{item}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Success criteria */}
        <div style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
            Validation Metrics
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
            {successCriteria.map((criterion: string, i: number) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                padding: "18px 28px",
                borderBottom: i < successCriteria.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}>
                <div style={{ width: 20, height: 20, border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#c9a84c" }}>{String(i + 1).padStart(2, "0")}</div>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{criterion}</div>
              </div>
            ))}
          </div>
        </div>

        <PartnerCTAFooter />
      </div>
    </PartnerRoomLayout>
  );
}
