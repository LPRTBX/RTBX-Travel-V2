import { useState, useEffect } from "react";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

type Mode = "Normal" | "Escalation" | "Failure";

const MODES: Mode[] = ["Normal", "Escalation", "Failure"];

const MODE_COLORS: Record<Mode, string> = {
  Normal:     "#10b981",
  Escalation: "#f97316",
  Failure:    "#ef4444",
};

const MODE_DESC: Record<Mode, string> = {
  Normal:     "Modelled path completes within the fictional threshold.",
  Escalation: "Modelled threshold breach shows a draft manager escalation.",
  Failure:    "Modelled failure shows missing ownership and incomplete evidence.",
};

interface StepState { status: "pending" | "active" | "complete" | "breached" | "failed"; detail: string; }

interface ReplayStep {
  label: string;
  normal:     StepState;
  escalation: StepState;
  failure:    StepState;
}

const STEPS: ReplayStep[] = [
  {
    label: "Connect — Signal Entered",
    normal:     { status: "complete", detail: "Simulated room-readiness delay signal — illustrative status confirmed. Signal queued at 14:02 in this replay." },
    escalation: { status: "complete", detail: "Simulated room-readiness delay signal — illustrative status confirmed. Signal queued at 14:02 in this replay." },
    failure:    { status: "complete", detail: "Synthetic room-readiness signal with an intentionally incomplete field shown in the local replay." },
  },
  {
    label: "Understand — Moment Classified",
    normal:     { status: "complete", detail: "Rules classify the synthetic input as a service-recovery moment and show illustrative risk, loyalty and value fields." },
    escalation: { status: "complete", detail: "Rules classify the synthetic input as a service-recovery moment and show an illustrative escalation threshold." },
    failure:    { status: "failed",   detail: "Rules flag the deliberately incomplete synthetic input as ambiguous; a human review would be required." },
  },
  {
    label: "Decide — Governance Applied",
    normal:     { status: "complete", detail: "The replay applies a fictional policy rule and proposes a duty-manager review within an illustrative threshold." },
    escalation: { status: "complete", detail: "The replay applies a fictional policy rule and models a 10-minute escalation threshold." },
    failure:    { status: "failed",   detail: "No fictional policy match is produced; the interface models a deferred decision with no owner." },
  },
  {
    label: "Act — Response Coordinated",
    normal:     { status: "complete", detail: "Illustrative duty-manager notification, guest-message draft and room recommendation shown. No AI service, dispatch or hotel update occurred." },
    escalation: { status: "breached", detail: "The replay models an unaccepted task, threshold breach and secondary manager alert; nothing was dispatched." },
    failure:    { status: "failed",   detail: "The replay models a missing owner and no action. No task or guest message was created." },
  },
  {
    label: "Act — Evidence Recorded",
    normal:     { status: "complete", detail: "Illustrative trace fields show a rule result, timestamp and named accountable role; this is not an operational record." },
    escalation: { status: "complete", detail: "Illustrative trace fields show an escalation, modelled manager response and hypothetical A$50 voucher." },
    failure:    { status: "failed",   detail: "Illustrative incomplete trace shows no action, owner or outcome and a proposed human review flag." },
  },
  {
    label: "Learn — Outcome & Learning",
    normal:     { status: "complete", detail: "Illustrative outcome: recovery recorded, no complaint modelled, playbook record updated and threshold review proposed. Indicative value: A$420." },
    escalation: { status: "complete", detail: "Illustrative outcome: delayed recovery and compensation recorded; escalation path and response time flagged for review. Indicative value: A$420 with A$18 modelled cost." },
    failure:    { status: "failed",   detail: "Illustrative failure outcome: a negative review and −A$840 impact are modelled. Incomplete signal ingestion is flagged for human operational review." },
  },
];

const STATUS_CONFIG = {
  pending:   { color: "rgba(255,255,255,0.15)", label: "Pending",   bg: "transparent" },
  active:    { color: "#c9a84c",               label: "Active",    bg: "rgba(201,168,76,0.08)" },
  complete:  { color: "#10b981",               label: "Simulated", bg: "rgba(16,185,129,0.06)" },
  breached:  { color: "#f97316",               label: "Modelled breach", bg: "rgba(249,115,22,0.06)" },
  failed:    { color: "#ef4444",               label: "Modelled failure", bg: "rgba(239,68,68,0.06)" },
};

export default function PartnerValidationReplay() {
  const [mode, setMode] = useState<Mode>("Normal");
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (activeStep >= STEPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setActiveStep(s => s + 1), 900);
    return () => clearTimeout(t);
  }, [playing, activeStep]);

  const handleModeChange = (m: Mode) => {
    setMode(m);
    setActiveStep(0);
    setPlaying(false);
  };

  const handlePlay = () => {
    setActiveStep(0);
    setPlaying(true);
  };

  const modeColor = MODE_COLORS[mode];

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Validation · Replay Lab
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>
            Validation Replay Simulation
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 560 }}>
            Step through a fictional, rules-based scenario. All inputs, actions, communications, evidence, outcomes and value are simulated; nothing is dispatched or written to an external system, and named people remain accountable.
          </p>
        </div>

        {/* Mode selector */}
        <div style={{ display: "flex", gap: 2, marginBottom: 24 }}>
          {MODES.map(m => (
            <div
              key={m}
              onClick={() => handleModeChange(m)}
              style={{
                flex: 1, padding: "18px 20px", cursor: "pointer", transition: "all 0.15s",
                background: m === mode ? `${MODE_COLORS[m]}12` : "rgba(255,255,255,0.02)",
                border: `1px solid ${m === mode ? MODE_COLORS[m] + "50" : "rgba(255,255,255,0.06)"}`,
                borderTop: `2px solid ${m === mode ? MODE_COLORS[m] : "transparent"}`,
              }}
              onMouseEnter={e => { if (m !== mode) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (m !== mode) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: m === mode ? MODE_COLORS[m] : "rgba(255,255,255,0.35)", letterSpacing: "0.04em", marginBottom: 6 }}>{m} Mode</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{MODE_DESC[m]}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, alignItems: "center" }}>
          <div
            onClick={handlePlay}
            style={{
              padding: "10px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s",
              background: modeColor, color: "#080c14",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            {playing ? "▶ Playing…" : "▶ Play Replay"}
          </div>
          <div
            onClick={() => { setActiveStep(0); setPlaying(false); }}
            style={{ padding: "10px 20px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.38)", transition: "all 0.12s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}
          >↺ Reset</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginLeft: 8 }}>
            Scenario: Service recovery · Hotel · L1 · {mode} mode
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {STEPS.map((step, i) => {
            const stepData = step[mode.toLowerCase() as keyof Omit<ReplayStep, "label">] as StepState;
            const isVisible = i <= activeStep;
            const isActive = i === activeStep;
            const cfg = STATUS_CONFIG[stepData.status];
            return (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  display: "grid", gridTemplateColumns: "36px 40px 220px 1fr 100px",
                  padding: "16px 16px", gap: 0, cursor: "pointer", transition: "all 0.2s",
                  opacity: isVisible ? 1 : 0.25,
                  background: isActive ? cfg.bg : "rgba(255,255,255,0.015)",
                  border: `1px solid ${isActive ? cfg.color + "40" : "rgba(255,255,255,0.05)"}`,
                  borderLeft: `3px solid ${isVisible ? cfg.color : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.2)", paddingTop: 2 }}>0{i + 1}</div>
                <div style={{ paddingTop: 1 }}>
                  {isVisible ? (
                    stepData.status === "complete"  ? <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#10b98125", border: "1.5px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#10b981", fontSize: 10, lineHeight: 1 }}>✓</span></div>
                    : stepData.status === "breached" ? <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#f9731625", border: "1.5px solid #f97316", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#f97316", fontSize: 9, lineHeight: 1 }}>!</span></div>
                    : stepData.status === "failed"  ? <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#ef444425", border: "1.5px solid #ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#ef4444", fontSize: 10, lineHeight: 1 }}>✕</span></div>
                    : <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#c9a84c25", border: "1.5px solid #c9a84c" }} />
                  ) : <div style={{ width: 18, height: 18, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.12)" }} />}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: isVisible ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.25)", padding: "0 12px", paddingTop: 1 }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 11.5, color: isVisible ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.18)", lineHeight: 1.5, padding: "0 12px 0 0", paddingTop: 1 }}>
                  {isVisible ? stepData.detail : "—"}
                </div>
                <div style={{ paddingTop: 2 }}>
                  {isVisible && (
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: cfg.color, border: `1px solid ${cfg.color}30`, padding: "2px 8px", display: "inline-block" }}>
                      {cfg.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {activeStep === STEPS.length - 1 && (
          <div style={{ marginTop: 24, padding: "24px 28px", background: `${modeColor}08`, border: `1px solid ${modeColor}25`, borderTop: `2px solid ${modeColor}` }}>
            <div style={{ fontSize: 9, letterSpacing: "0.16em", color: modeColor, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Simulation Finished · {mode} Mode</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0 }}>
              {mode === "Normal" && "Modelled result: the fictional response path stays within its illustrative threshold and populates a synthetic trace. Indicative value: A$420; no value was measured or protected."}
              {mode === "Escalation" && "Modelled result: the fictional threshold is breached and a draft manager escalation appears. The synthetic trace is populated for review; no recovery or value protection occurred."}
              {mode === "Failure" && "Modelled result: incomplete synthetic input produces no policy match or owner and an incomplete trace. A hypothetical −A$840 impact is shown for discussion; no review was posted."}
            </p>
          </div>
        )}

      </div>
    </PartnerRoomLayout>
  );
}
