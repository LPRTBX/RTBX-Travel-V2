import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ScreenshotCard, Pill, C } from "@/components/presentation/PresentationComponents";

type ViewMode = 'guest' | 'operating' | 'infrastructure';

const VIEW_CONFIG: Record<ViewMode, { label: string; color: string; sub: string }> = {
  guest:          { label: "GUEST VIEW",          color: C.blue,   sub: "What Mr Hartmann experiences" },
  operating:      { label: "OPERATING VIEW",       color: C.amber,  sub: "What the team sees and does" },
  infrastructure: { label: "INFRASTRUCTURE VIEW",  color: C.violet, sub: "What WELBX is doing invisibly" },
};

interface StepView { headline: string; narrative: string; points: string[]; }
interface Step {
  label: string; stage: string; stageColor: string;
  guest: StepView; operating: StepView; infrastructure: StepView;
}

const STEPS: Step[] = [
  {
    label: "Signal Detected", stage: "SIGNAL", stageColor: C.blue,
    guest: {
      headline: "Unaware. In transit.",
      narrative: "Mr Hartmann is approaching The Grand Meridian in a cab. His 14th stay. Nothing unusual from his perspective.",
      points: ["Guest has no visibility of operational activity", "Experience is already being protected before arrival", "The first signal is invisible to the guest"],
    },
    operating: {
      headline: "Three signals converge in the registry.",
      narrative: "The Signal Registry has flagged three simultaneous signals in the past 90 seconds.",
      points: ["Diamond guest ETA: 12 minutes · confidence 97%", "Room 847 status: OCCUPIED · Housekeeping not assigned", "Housekeeping estimated arrival: 22 minutes — beyond guest ETA"],
    },
    infrastructure: {
      headline: "BXOS pattern matching begins.",
      narrative: "BXOS clustering algorithm identifies signal convergence. Three signals map to a known VIP collision pattern.",
      points: ["Signal cluster threshold: met (3 of 3 signals)", "Pattern match against 847 prior VIP arrival events", "Confidence building: 88% → 91% in 14 seconds", "Moment creation threshold: imminent"],
    },
  },
  {
    label: "Moment Created", stage: "MOMENT", stageColor: C.amber,
    guest: {
      headline: "Still in transit. Unaware.",
      narrative: "Mr Hartmann is 10 minutes from the hotel. The moment has been created — but he will never know it was needed.",
      points: ["Guest experience unchanged", "No visible action has occurred yet", "The infrastructure is now governing the response"],
    },
    operating: {
      headline: "VIP Arrival Risk appears in the live feed.",
      narrative: "A moment card appears in the Live Moments feed: VIP Arrival Risk · HIGH urgency · 91% confidence.",
      points: ["Moment GM-002 visible to Duty Manager and Housekeeping Lead", "Urgency: HIGH · Category: VIP", "Recommended action: Trigger Housekeeping Priority Protocol", "Playbook PB-002 queued for auto-execution"],
    },
    infrastructure: {
      headline: "Pattern matched. Moment created. Playbook queued.",
      narrative: "BXOS has matched the signal cluster against the VIP arrival collision pattern. Moment GM-002 is created and governance chain begins.",
      points: ["Moment ID: GM-002 · VIP Arrival Risk", "Confidence: 91% · Pattern: Arrival Window Collision", "Historical match: 847 prior VIP events — 94% resolved successfully", "Playbook PB-002 queued. Decision pending."],
    },
  },
  {
    label: "Decision Made", stage: "DECISION", stageColor: C.violet,
    guest: {
      headline: "Nothing visible. The decision takes 0 seconds.",
      narrative: "Mr Hartmann hasn't arrived yet. The decision has already been made without a single manual instruction.",
      points: ["Guest has no visibility of the decision", "No phone calls. No radio traffic. No visible coordination.", "The hotel has already decided what happens next"],
    },
    operating: {
      headline: "Housekeeping Priority Protocol auto-triggered.",
      narrative: "Playbook PB-002 triggers automatically. No Duty Manager input required. The decision is governed.",
      points: ["Decision DEC-047 created: Trigger Housekeeping Priority Protocol", "Owner: BXOS Auto", "Lounge pre-access activated", "Floor supervisor deployment initiated"],
    },
    infrastructure: {
      headline: "Decision DEC-047 logged in 0.8 seconds.",
      narrative: "The governance chain executes instantly. Decision is logged, attributed, and auditable.",
      points: ["Decision time: 0.8 seconds from moment creation", "Governance path: BXOS Auto → PB-002 → Step 1 of 4", "Decision log: time-stamped, attributed, retrievable", "Communication routing initiated"],
    },
  },
  {
    label: "Communication Routed", stage: "ACTION", stageColor: C.cyan,
    guest: {
      headline: "A personalised welcome appears in the guest app.",
      narrative: "Mr Hartmann receives a calm, personal message. No urgency. No visible hotel activity.",
      points: ["'We look forward to welcoming you, Mr Hartmann.'", "'Your lounge access is confirmed for this evening.'", "Guest communication: personal, warm, accurate", "Zero operational urgency visible to guest"],
    },
    operating: {
      headline: "Three channels routed. Zero manual coordination.",
      narrative: "NEXUS routing engine deploys communications simultaneously to Housekeeping Lead, Duty Manager, and the guest app.",
      points: ["Housekeeping Lead · Mobile push: 'Room 847 priority clearance. Diamond arrival 12 min.'", "Duty Manager · In-app: 'PB-002 running. VIP Arrival Risk active. ETA 12 min.'", "Guest app: personalised welcome and lounge confirmation"],
    },
    infrastructure: {
      headline: "NEXUS deploys 3 channels in parallel.",
      narrative: "Staff and guest communications are separated by design. The guest never sees operational urgency.",
      points: ["Communication ID: CC-089 through CC-091", "Channels: Mobile push · In-app · Guest app", "Routing time: 1.2 seconds from decision", "Staff and guest comms decoupled"],
    },
  },
  {
    label: "Action Executed", stage: "ACTION", stageColor: C.cyan,
    guest: {
      headline: "6 minutes away. Nothing unusual.",
      narrative: "Room 847 is being fast-tracked. Mr Hartmann is unaware of anything happening. The experience is already being protected.",
      points: ["Guest in transit", "No visible hotel activity", "Room 847 being cleared at pace"],
    },
    operating: {
      headline: "Floor supervisor deployed. Timeline visible in real time.",
      narrative: "Housekeeping team working on Room 847. Progress tracking live in the Command Centre.",
      points: ["09:04 — Housekeeping Lead confirmed task receipt", "09:05 — Supervisor deployed to Floor 8", "09:07 — Room 847 clearance underway", "09:09 — ETA for completion: 6 minutes"],
    },
    infrastructure: {
      headline: "Playbook step 3 of 4 executing.",
      narrative: "VECTOR execution engine is tracking action progress in real time. Each step is logged and timestamped.",
      points: ["Step 1: Communication routed ✓", "Step 2: Supervisor deployed ✓", "Step 3: Room clearance underway ← current", "Step 4: Outcome confirmation · pending"],
    },
  },
  {
    label: "Outcome Achieved", stage: "OUTCOME", stageColor: C.green,
    guest: {
      headline: "Arrival seamless. Not one moment of friction.",
      narrative: "Mr Hartmann walks in. Key is ready. Room is perfect. Lounge access waiting. His 14th stay begins exactly as expected.",
      points: ["Check-in: seamless", "Room 847: immaculate", "Lounge: pre-confirmed without request", "Preferences: remembered and actioned"],
    },
    operating: {
      headline: "Room ready 4 minutes before arrival. No escalation.",
      narrative: "Outcome confirmed. Moment resolved. No Duty Manager escalation required.",
      points: ["Room 847 cleared: 09:10:44 (4 min before arrival)", "Guest arrival: 09:14:32", "Escalation: none", "Moment GM-002: RESOLVED"],
    },
    infrastructure: {
      headline: "100% threshold met. Playbook PB-002 closed.",
      narrative: "All outcome criteria met. The playbook closes and the learning cycle begins immediately.",
      points: ["Outcome: SUCCESS · all criteria met", "Resolution time: 11 minutes from signal detection", "Playbook PB-002: closed", "Learning cycle: initiated"],
    },
  },
  {
    label: "Learning Captured", stage: "LEARNING", stageColor: "hsl(215 16% 60%)",
    guest: {
      headline: "Nothing changes for Mr Hartmann. The hotel got better.",
      narrative: "His 14th stay completes. The hotel has learned from this moment — the 15th stay will be handled even more smoothly.",
      points: ["Guest experience unchanged", "No visible improvement from his perspective", "Invisibly: detection will now be 8 minutes earlier"],
    },
    operating: {
      headline: "Post-moment summary sent to Duty Manager.",
      narrative: "A structured summary lands in the Duty Manager's dashboard. No action required. Information only.",
      points: ["Moment summary: GM-002 · Resolved", "Response time: 11 minutes", "Team: Housekeeping Lead + Floor Supervisor", "Outcome: 100% success"],
    },
    infrastructure: {
      headline: "Signal weights recalibrated. 848th VIP event logged.",
      narrative: "BXOS updates the pattern library based on this event. Future detection improves automatically.",
      points: ["VIP arrival detection window: extended by 8 minutes", "Housekeeping ETA threshold: recalibrated", "Institutional memory: updated", "Pattern library: 848 VIP events — 94.6% resolved"],
    },
  },
  {
    label: "Value Created", stage: "VALUE", stageColor: C.amber,
    guest: {
      headline: "'The Grand Meridian never misses a beat.'",
      narrative: "Mr Hartmann enjoys his stay. He books stay 15 before departure. A loyal guest, retained without recovery.",
      points: ["Guest satisfaction: maintained", "Loyalty tier: Diamond — protected", "Next booking: confirmed", "Recovery required: none"],
    },
    operating: {
      headline: "KPIs maintained. No recovery required.",
      narrative: "The moment has been converted to value. Service score maintained. No resource spent on recovery.",
      points: ["Recovery cost: zero", "Service KPI: maintained", "Team performance score: ↑ updated", "Moment activation: documented"],
    },
    infrastructure: {
      headline: "Value activation documented. Portfolio score updated.",
      narrative: "Every resolved VIP moment contributes to the property's value score. This one was HIGH activation.",
      points: ["Moment value: HIGH activation", "Value attribution: logged and attributable", "Portfolio score: ↑ 0.4 points", "Learning cycle: complete"],
    },
  },
];

/* ─── Step Visual Panels ──────────────────────────────────────────── */
function StepVisual({ step, viewColor }: { step: number; viewColor: string }) {
  const panels: Record<number, React.ReactNode> = {
    0: (
      <ScreenshotCard title="Signal Registry · Live Feed" subtitle="3 signals flagged">
        {[
          { cat: "VIP",     signal: "Diamond guest ETA: 12 minutes",                    conf: "97%", status: "FLAGGED", sc: C.amber },
          { cat: "OPS",     signal: "Room 847 status: OCCUPIED · Housekeeping unassigned", conf: "100%", status: "FLAGGED", sc: C.red },
          { cat: "OPS",     signal: "Housekeeping ETA 22 min · arrival gap: 10 min",       conf: "94%", status: "FLAGGED", sc: C.red },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
            <Pill label={r.cat} color={viewColor} />
            <span style={{ fontSize: 9.5, color: C.muted, flex: 1 }}>{r.signal}</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: C.amber }}>{r.conf}</span>
            <Pill label={r.status} color={r.sc} />
          </div>
        ))}
      </ScreenshotCard>
    ),
    1: (
      <ScreenshotCard title="Moment Registry · GM-002" subtitle="VIP Arrival Risk">
        <div style={{ padding: "12px", background: `${C.amber}0A`, border: `1px solid ${C.amber}22`, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>VIP Arrival Risk</span>
            <Pill label="HIGH" color={C.red} />
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <Pill label="DETECTED" color={C.amber} />
            <span style={{ fontSize: 8, color: C.dimmed }}>Category: VIP</span>
            <span style={{ fontSize: 8, color: C.dimmed }}>Pattern: Arrival Window Collision</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 8, color: C.dimmed }}>Confidence</span>
            <div style={{ flex: 1, height: 4, background: "hsl(220 13% 11%)" }}>
              <div style={{ width: "91%", height: "100%", background: C.amber }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.amber }}>91%</span>
          </div>
        </div>
        <div style={{ fontSize: 9.5, color: C.muted, marginBottom: 6, fontWeight: 600 }}>Recommended Action</div>
        <p style={{ fontSize: 9.5, color: C.muted }}>Trigger Housekeeping Priority Protocol. Deploy floor supervisor. Activate lounge access.</p>
      </ScreenshotCard>
    ),
    2: (
      <ScreenshotCard title="Decision Registry · DEC-047" subtitle="Auto-governed">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Decision", value: "Trigger Housekeeping Priority Protocol" },
            { label: "Playbook",   value: "PB-002 · VIP Arrival Protocol" },
            { label: "Owner",      value: "BXOS Auto" },
            { label: "Time",       value: "0.8 seconds from moment creation" },
            { label: "Status",     value: "EXECUTING" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 8.5, color: C.dimmed, minWidth: 72 }}>{row.label}</span>
              <span style={{ fontSize: 9.5, color: row.label === "Status" ? C.green : C.muted, fontWeight: row.label === "Status" ? 700 : 400 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </ScreenshotCard>
    ),
    3: (
      <ScreenshotCard title="Communication Orchestration" subtitle="3 channels deployed">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { to: "Housekeeping Lead", channel: "MOBILE PUSH", msg: "Room 847 priority clearance. Diamond arrival in 12 min.", color: C.red },
            { to: "Duty Manager",      channel: "IN-APP",       msg: "PB-002 active. VIP Arrival Risk. ETA 12 min. Update required at 09:20.", color: C.amber },
            { to: "Mr Hartmann",       channel: "GUEST APP",    msg: "We look forward to welcoming you. Your lounge access is confirmed.", color: C.blue },
          ].map((m, i) => (
            <div key={i} style={{ padding: "8px 10px", background: `${m.color}08`, border: `1px solid ${m.color}22` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Pill label={m.channel} color={m.color} />
                <span style={{ fontSize: 8.5, color: C.dimmed }}>→ {m.to}</span>
              </div>
              <p style={{ fontSize: 9.5, color: C.muted }}>{m.msg}</p>
            </div>
          ))}
        </div>
      </ScreenshotCard>
    ),
    4: (
      <ScreenshotCard title="Command Centre · Live Tasks" subtitle="Room 847 priority">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { time: "09:04", label: "Housekeeping Lead confirmed task receipt",  status: "DONE",    statusColor: C.green },
            { time: "09:05", label: "Floor supervisor deployed to Level 8",      status: "DONE",    statusColor: C.green },
            { time: "09:06", label: "Lounge access pre-activated for guest",     status: "DONE",    statusColor: C.green },
            { time: "09:07", label: "Room 847 clearance underway",               status: "ACTIVE",  statusColor: C.amber },
            { time: "09:10", label: "Outcome confirmation",                       status: "PENDING", statusColor: C.dimmed },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 7.5, color: C.dimmed, minWidth: 36, fontFamily: "monospace" }}>{t.time}</span>
              <span style={{ fontSize: 9.5, color: t.status === "ACTIVE" ? C.white : C.muted, flex: 1 }}>{t.label}</span>
              <Pill label={t.status} color={t.statusColor} />
            </div>
          ))}
        </div>
      </ScreenshotCard>
    ),
    5: (
      <ScreenshotCard title="Outcome Registry · GM-002" subtitle="RESOLVED">
        <div style={{ padding: "12px", background: `${C.green}08`, border: `1px solid ${C.green}22`, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>VIP Arrival Risk</span>
            <Pill label="RESOLVED" color={C.green} />
          </div>
          {[
            { label: "Room cleared",  value: "09:10:44 · 4 min before arrival" },
            { label: "Guest arrival", value: "09:14:32 · seamless" },
            { label: "Escalation",    value: "None" },
            { label: "Recovery",      value: "Not required" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "4px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 8.5, color: C.dimmed, minWidth: 80 }}>{r.label}</span>
              <span style={{ fontSize: 9.5, color: C.green, fontWeight: 600 }}>{r.value}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 9.5, color: C.muted }}>Resolution time: 11 minutes from first signal detection.</p>
      </ScreenshotCard>
    ),
    6: (
      <ScreenshotCard title="Learning Layer · Entry 848" subtitle="VIP arrival pattern">
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            { label: "Event",              value: "VIP Arrival Collision · Room Not Ready" },
            { label: "Outcome",            value: "SUCCESS · 100% threshold met" },
            { label: "Detection window",   value: "Extended by 8 minutes (new baseline: 20 min)" },
            { label: "Housekeeper ETA",    value: "Threshold recalibrated: 25 min (was 20 min)" },
            { label: "Pattern confidence", value: "↑ 0.4% — now 91.4%" },
            { label: "Library entries",    value: "848 VIP events · 94.6% resolved" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 8.5, color: C.dimmed, minWidth: 110 }}>{row.label}</span>
              <span style={{ fontSize: 9.5, color: C.muted }}>{row.value}</span>
            </div>
          ))}
        </div>
      </ScreenshotCard>
    ),
    7: (
      <ScreenshotCard title="Value Attribution · GM-002" subtitle="Moment activation">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Activation level",   value: "HIGH",      color: C.amber },
            { label: "Brand promise",       value: "Delivered", color: C.green },
            { label: "Loyalty outcome",     value: "Protected", color: C.green },
            { label: "Recovery cost",       value: "Zero",      color: C.green },
            { label: "Portfolio impact",    value: "↑ 0.4 pts", color: C.amber },
            { label: "Next stay",           value: "Confirmed", color: C.blue },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 9.5, color: C.muted }}>{row.label}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </ScreenshotCard>
    ),
  };
  return <>{panels[step] ?? null}</>;
}

/* ─── Main Component ──────────────────────────────────────────────── */
export default function StoryGuestStory() {
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('guest');
  const [, navigate] = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
      if (e.key === "ArrowLeft"  || e.key === "PageUp")   setCurrentStep(s => Math.max(s - 1, 0));
      if (e.key === "Escape") navigate("/story");
      if (e.key === "1") setViewMode("guest");
      if (e.key === "2") setViewMode("operating");
      if (e.key === "3") setViewMode("infrastructure");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const step = STEPS[currentStep];
  const vc = VIEW_CONFIG[viewMode];
  const viewContent = step[viewMode];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${vc.color} 0%, transparent 50%)`, transition: "background 0.3s", flexShrink: 0 }} />

      {/* Header */}
      <div style={{ padding: "16px 32px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "hsl(220 13% 4%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", color: C.white, textTransform: "uppercase" }}>WELBX</span>
          <span style={{ color: C.border }}>·</span>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: vc.color, textTransform: "uppercase" }}>THE DIAMOND ARRIVAL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 8.5, color: C.dimmed }}>Mr V. Hartmann</span>
            <span style={{ color: C.border }}>·</span>
            <span style={{ fontSize: 8.5, color: C.dimmed }}>Diamond Member</span>
            <span style={{ color: C.border }}>·</span>
            <span style={{ fontSize: 8.5, color: C.dimmed }}>14th Stay</span>
            <span style={{ color: C.border }}>·</span>
            <span style={{ fontSize: 8.5, color: vc.color, fontWeight: 600 }}>Arrival in 12 Minutes</span>
          </div>
          <button onClick={() => navigate("/story")} style={{ background: "none", border: `1px solid ${C.border}`, cursor: "pointer", color: C.dimmed, padding: "4px 8px", display: "flex", alignItems: "center" }}>
            <X size={11} />
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left timeline */}
        <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "24px 0", background: "hsl(220 13% 4%)", overflowY: "auto" }}>
          <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.2em", color: C.dimmed, textTransform: "uppercase", padding: "0 20px", marginBottom: 16 }}>The Diamond Arrival</div>
          {STEPS.map((s, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                style={{
                  width: "100%", border: "none", cursor: "pointer",
                  padding: "10px 20px", textAlign: "left",
                  borderLeft: isActive ? `2px solid ${vc.color}` : `2px solid transparent`,
                  background: isActive ? "hsl(220 13% 8%)" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                    background: isDone ? C.green : isActive ? vc.color : "transparent",
                    border: `1px solid ${isDone ? C.green : isActive ? vc.color : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 7, fontWeight: 700, color: isDone || isActive ? C.bg : C.dimmed,
                  }}>
                    {isDone ? "✓" : i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: isActive ? C.white : isDone ? C.muted : C.dimmed }}>{s.label}</div>
                    <div style={{ fontSize: 7.5, letterSpacing: "0.1em", color: isActive ? vc.color : C.dimmed, textTransform: "uppercase", fontWeight: 700 }}>{s.stage}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* View toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "16px 32px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            {(Object.entries(VIEW_CONFIG) as [ViewMode, typeof VIEW_CONFIG[ViewMode]][]).map(([mode, cfg]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "7px 18px", border: `1px solid ${C.border}`, marginRight: -1,
                  background: viewMode === mode ? `${cfg.color}12` : "transparent",
                  borderColor: viewMode === mode ? `${cfg.color}40` : C.border,
                  color: viewMode === mode ? cfg.color : C.dimmed,
                  cursor: "pointer", fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                  transition: "all 0.15s", zIndex: viewMode === mode ? 1 : 0, position: "relative",
                }}
              >
                {cfg.label}
              </button>
            ))}
            <span style={{ fontSize: 9, color: C.dimmed, marginLeft: 16 }}>{vc.sub}</span>
          </div>

          {/* Step content */}
          <div style={{ flex: 1, display: "flex", gap: 0, overflow: "hidden" }}>
            {/* Narrative panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStep}-${viewMode}`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                style={{ flex: 1, padding: "32px", display: "flex", flexDirection: "column", gap: 20, overflow: "auto" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: step.stageColor, textTransform: "uppercase", padding: "2px 8px", border: `1px solid ${step.stageColor}30`, background: `${step.stageColor}08` }}>{step.stage}</span>
                    <span style={{ fontSize: 8, color: C.dimmed }}>Step {currentStep + 1} of {STEPS.length}</span>
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: 10 }}>{step.label}</h2>
                  <div style={{ height: 2, width: 40, background: vc.color, marginBottom: 16 }} />
                  <p style={{ fontSize: 12, color: vc.color, fontWeight: 600, lineHeight: 1.55, marginBottom: 10 }}>{viewContent.headline}</p>
                  <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.75, maxWidth: 480 }}>{viewContent.narrative}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {viewContent.points.map((point, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", background: `${vc.color}07`, border: `1px solid ${vc.color}18` }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: vc.color, marginTop: 5, flexShrink: 0 }} />
                      <span style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.5 }}>{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Visual panel */}
            <div style={{ width: 360, flexShrink: 0, borderLeft: `1px solid ${C.border}`, padding: "24px 20px", overflow: "auto", background: "hsl(220 13% 4%)" }}>
              <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 14 }}>WELBX · LIVE VIEW</div>
              <StepVisual step={currentStep} viewColor={vc.color} />
            </div>
          </div>

          {/* Bottom navigation */}
          <div style={{ padding: "14px 32px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <button
              onClick={() => navigate("/story")}
              style={{ background: "none", border: `1px solid ${C.border}`, cursor: "pointer", color: C.dimmed, padding: "7px 14px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              ← Exit Story
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  style={{
                    width: i === currentStep ? 20 : 6, height: 6, borderRadius: 3,
                    background: i === currentStep ? vc.color : i < currentStep ? C.green : C.border,
                    border: "none", cursor: "pointer", transition: "all 0.2s",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setCurrentStep(s => Math.max(s - 1, 0))}
                disabled={currentStep === 0}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: `1px solid ${C.border}`, cursor: currentStep === 0 ? "not-allowed" : "pointer", color: currentStep === 0 ? C.dimmed : C.muted, padding: "7px 14px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: currentStep === 0 ? 0.4 : 1 }}
              >
                <ChevronLeft size={11} /> Previous
              </button>
              <button
                onClick={() => setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))}
                disabled={currentStep === STEPS.length - 1}
                style={{ display: "flex", alignItems: "center", gap: 5, background: currentStep === STEPS.length - 1 ? "none" : `${vc.color}10`, border: `1px solid ${currentStep === STEPS.length - 1 ? C.border : vc.color + "40"}`, cursor: currentStep === STEPS.length - 1 ? "not-allowed" : "pointer", color: currentStep === STEPS.length - 1 ? C.dimmed : vc.color, padding: "7px 14px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: currentStep === STEPS.length - 1 ? 0.4 : 1 }}
              >
                Next <ChevronRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
