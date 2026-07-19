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
  Normal:     "System performs as designed — signal to resolution in time.",
  Escalation: "Delay threshold breached — manager alert triggered, recovery still achieved.",
  Failure:    "Action missed — escalation cascade + assurance issue created.",
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
    normal:     { status: "complete", detail: "Room readiness delay signal — captured from housekeeping system — real-time status confirmed. Signal queued at 14:02." },
    escalation: { status: "complete", detail: "Room readiness delay signal — captured from housekeeping system — real-time status confirmed. Signal queued at 14:02." },
    failure:    { status: "complete", detail: "Room readiness delay signal — captured from housekeeping system — status field incomplete. Signal queued at 14:02 with data gap flagged." },
  },
  {
    label: "Understand — Moment Classified",
    normal:     { status: "complete", detail: "Service Recovery Moment identified — Risk: High — Loyalty tier active — Value at stake: guest satisfaction + repeat booking. Playbook match confirmed." },
    escalation: { status: "complete", detail: "Service Recovery Moment identified — Risk: High — Loyalty tier active — Value at stake: guest satisfaction + repeat booking. Playbook match confirmed." },
    failure:    { status: "failed",   detail: "Signal cluster incomplete — moment type ambiguous between Service Recovery and Arrival Friction. Classification defaulted without full context. Playbook match unreliable." },
  },
  {
    label: "Decide — Governance Applied",
    normal:     { status: "complete", detail: "Guest Service Recovery Policy applied — Compensation Approval Matrix checked — Duty manager response within SLA authorised. Decision logged." },
    escalation: { status: "complete", detail: "Guest Service Recovery Policy applied — Compensation Approval Matrix checked — Duty manager response within SLA authorised. Escalation threshold set at 10 min." },
    failure:    { status: "failed",   detail: "Governance check attempted — ambiguous moment classification meant no clear policy match. Decision deferred. No role owner assigned. Timer not started." },
  },
  {
    label: "Act — Response Coordinated",
    normal:     { status: "complete", detail: "Duty manager notified via staff app — guest recovery message drafted by AI — front desk approved send — room reprioritised in housekeeping queue. Completed at 14:09." },
    escalation: { status: "breached", detail: "Staff task not accepted — 10 min timer expired at 14:12. ESCALATION TRIGGERED. Manager alerted via secondary channel. Manager personally coordinated recovery at 14:18." },
    failure:    { status: "failed",   detail: "No role owner assigned — no staff task created — no guest message sent. Action window passed with no coordinated response." },
  },
  {
    label: "Act — Evidence Recorded",
    normal:     { status: "complete", detail: "Moment record complete — governance decision logged — action confirmed — timestamp and role owner recorded in Evidence Ledger. Record closed at 14:09." },
    escalation: { status: "complete", detail: "Moment record complete — escalation event logged — manager action confirmed — F&B voucher A$50 compensation recorded — Evidence Ledger updated at 14:18." },
    failure:    { status: "failed",   detail: "Evidence Ledger entry created but incomplete — no action log, no role owner, no outcome. Assurance ISSUE flagged. GM notified. Record remains open." },
  },
  {
    label: "Learn — Outcome & Learning",
    normal:     { status: "complete", detail: "Outcome: guest recovered — no complaint lodged — satisfaction preserved — playbook performance record updated — detection threshold calibrated. Value protected: A$420." },
    escalation: { status: "complete", detail: "Outcome: guest recovered with delay — manager compensation applied — escalation path validated — staff response time flagged for review — playbook updated. Value protected: A$420 (with A$18 cost)." },
    failure:    { status: "failed",   detail: "Value LOST. Negative review posted — estimated impact: −A$840. Learning signal: classification failure upstream — incomplete signal ingestion identified as root cause. Operational review required." },
  },
];

const STATUS_CONFIG = {
  pending:   { color: "rgba(255,255,255,0.15)", label: "Pending",   bg: "transparent" },
  active:    { color: "#c9a84c",               label: "Active",    bg: "rgba(201,168,76,0.08)" },
  complete:  { color: "#10b981",               label: "Complete",  bg: "rgba(16,185,129,0.06)" },
  breached:  { color: "#f97316",               label: "Breached",  bg: "rgba(249,115,22,0.06)" },
  failed:    { color: "#ef4444",               label: "Failed",    bg: "rgba(239,68,68,0.06)" },
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
            Validation Replay Demo
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 560 }}>
            Select a replay mode — then step through or play how the same scenario resolves differently under normal, escalation or failure conditions.
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
            <div style={{ fontSize: 9, letterSpacing: "0.16em", color: modeColor, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Replay Complete · {mode} Mode</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0 }}>
              {mode === "Normal" && "RTBX resolved the incident in 7 minutes across all five engine stages. Signal connected, moment understood, governance decided, response coordinated, evidence recorded, outcome learned. Value protected: A$420. No escalation. Record closed."}
              {mode === "Escalation" && "Escalation triggered at Act stage — 10 min SLA breached. Manager resolved at 16 min. Governance held throughout. Evidence complete including escalation event. Value still protected. Playbook updated with staff response time flag."}
              {mode === "Failure" && "Classification failure at Understand stage cascaded through all subsequent steps. No governance match, no role owner, no action, incomplete evidence. Negative review posted. Estimated impact: −A$840. Root cause: incomplete signal at Connect stage. Operational review required."}
            </p>
          </div>
        )}

      </div>
    </PartnerRoomLayout>
  );
}
