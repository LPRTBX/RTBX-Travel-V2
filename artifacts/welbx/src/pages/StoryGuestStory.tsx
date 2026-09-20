import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ScreenshotCard, Pill, C } from "@/components/presentation/PresentationComponents";

type ViewMode = 'guest' | 'operating' | 'infrastructure';

const VIEW_CONFIG: Record<ViewMode, { label: string; color: string; sub: string }> = {
  guest:          { label: "GUEST VIEW",          color: C.blue,   sub: "What Mr Hartmann experiences" },
  operating:      { label: "OPERATING VIEW",       color: C.amber,  sub: "What the team sees and does" },
  infrastructure: { label: "INFRASTRUCTURE VIEW",  color: C.violet, sub: "What RTBX is doing invisibly" },
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
      points: ["Guest has no visibility of the simulation", "Possible pre-arrival support is illustrated, not delivered", "The synthetic signal is invisible in the fictional guest view"],
    },
    operating: {
      headline: "Three signals converge in the registry.",
      narrative: "The simulated Signal Registry displays three fictional signals.",
      points: ["Synthetic guest ETA: 12 minutes · illustrative confidence 97%", "Fictional room status: OCCUPIED · Housekeeping unassigned", "Modelled housekeeping ETA: 22 minutes — beyond fictional guest ETA"],
    },
    infrastructure: {
      headline: "Rules-based pattern matching is illustrated.",
      narrative: "Deterministic demonstration rules map three synthetic signals to a fictional VIP collision pattern.",
      points: ["Illustrative threshold: met (3 of 3 synthetic signals)", "Fictional reference set shown for interface demonstration", "Modelled confidence: 88% → 91%", "Moment-creation rule: met"],
    },
  },
  {
    label: "Moment Created", stage: "MOMENT", stageColor: C.amber,
    guest: {
      headline: "Still in transit. Unaware.",
      narrative: "In the fictional journey, Mr Hartmann is 10 minutes from the hotel while a local moment card appears.",
      points: ["Fictional guest view remains unchanged", "No external action occurs", "The interface illustrates a governed recommendation"],
    },
    operating: {
      headline: "VIP Arrival Risk appears in the simulated feed.",
      narrative: "An illustrative moment card appears: VIP Arrival Risk · HIGH urgency · 91% modelled confidence.",
      points: ["Moment GM-002 visible to Duty Manager and Housekeeping Lead", "Urgency: HIGH · Category: VIP", "Recommended action: Trigger Housekeeping Priority Protocol", "Playbook PB-002 queued for operator review"],
    },
    infrastructure: {
      headline: "Rule matched. Illustrative moment and playbook shown.",
      narrative: "Demonstration rules map the synthetic cluster to a fictional VIP arrival pattern and prepare a playbook recommendation.",
      points: ["Illustrative ID: GM-002 · VIP Arrival Risk", "Modelled confidence: 91% · fictional pattern", "Reference history is synthetic and not production evidence", "Playbook PB-002 shown for human review"],
    },
  },
  {
    label: "Decision Made", stage: "DECISION", stageColor: C.violet,
    guest: {
      headline: "Nothing visible. A recommended decision is ready.",
      narrative: "Mr Hartmann hasn't arrived yet. The walkthrough shows how a governed recommendation can be prepared for the named role owner.",
      points: ["Guest has no visibility of the recommendation", "No external communication is sent in this simulation", "The operator retains accountability for what happens next"],
    },
    operating: {
      headline: "Housekeeping Priority Protocol recommended.",
      narrative: "Playbook PB-002 is selected by the demonstrated rules. The Duty Manager remains the accountable owner.",
      points: ["Decision DEC-047 proposed: Trigger Housekeeping Priority Protocol", "Owner: Duty Manager", "Lounge pre-access shown as a proposed action", "Floor supervisor assignment shown for confirmation"],
    },
    infrastructure: {
      headline: "Illustrative decision DEC-047 appears.",
      narrative: "The simulation records the rules-based recommendation and its accountable owner.",
      points: ["Illustrative decision time: 0.8 seconds", "Governance path: governed rules → PB-002 → Duty Manager", "Decision record: time-stamped and reviewable", "Communication drafts prepared"],
    },
  },
  {
    label: "Communication Routed", stage: "ACTION", stageColor: C.cyan,
    guest: {
      headline: "A personalised welcome draft appears.",
      narrative: "The fictional guest view previews a calm message draft; nothing is sent.",
      points: ["Illustrative copy: 'We look forward to welcoming you, Mr Hartmann.'", "Illustrative copy: 'Your lounge access is proposed for this evening.'", "Draft tone: personal and calm", "No operational activity or delivery occurs"],
    },
    operating: {
      headline: "Three channel drafts prepared for review.",
      narrative: "The simulation prepares routed communications for the Housekeeping Lead, Duty Manager and guest app. It does not dispatch them.",
      points: ["Housekeeping Lead · Mobile push: 'Room 847 priority clearance. Diamond arrival 12 min.'", "Duty Manager · In-app: 'PB-002 running. VIP Arrival Risk active. ETA 12 min.'", "Guest app: personalised welcome and lounge confirmation"],
    },
    infrastructure: {
      headline: "Three channel drafts are displayed.",
      narrative: "The simulation separates staff and guest drafts by audience; no channel connector is active.",
      points: ["Illustrative IDs: CC-089 through CC-091", "Proposed channels: Mobile push · In-app · Guest app", "Modelled routing time: 1.2 seconds", "Drafts remain subject to accountable human review"],
    },
  },
  {
    label: "Action Modelled", stage: "ACTION", stageColor: C.cyan,
    guest: {
      headline: "6 minutes away. Nothing unusual.",
      narrative: "The fictional timeline models a room-priority pathway. No hotel work is taking place.",
      points: ["Fictional guest in transit", "No real hotel activity", "Illustrative room-clearance progress"],
    },
    operating: {
      headline: "Floor-supervisor assignment shown. Timeline illustrated.",
      narrative: "The walkthrough illustrates housekeeping progress for Room 847 in the Command Centre.",
      points: ["09:04 — modelled task acceptance", "09:05 — modelled supervisor assignment", "09:07 — illustrative clearance progress", "09:09 — modelled ETA: 6 minutes"],
    },
    infrastructure: {
      headline: "Playbook step 3 of 4 is modelled.",
      narrative: "The interface illustrates fields that accountable staff could confirm in a governed pilot.",
      points: ["Step 1: draft prepared", "Step 2: assignment modelled", "Step 3: progress state illustrated", "Step 4: modelled outcome pending"],
    },
  },
  {
    label: "Outcome Modelled", stage: "OUTCOME", stageColor: C.green,
    guest: {
      headline: "Illustrative arrival outcome.",
      narrative: "The fictional journey shows a seamless arrival, ready room and proposed lounge access; none of these outcomes occurred.",
      points: ["Modelled check-in: seamless", "Modelled room state: ready", "Proposed lounge access", "Illustrative preference handling"],
    },
    operating: {
      headline: "Modelled room-ready outcome with no escalation.",
      narrative: "The simulation populates an illustrative outcome; no room, arrival or escalation was confirmed.",
      points: ["Modelled room-ready time: 09:10:44", "Fictional arrival: 09:14:32", "Modelled escalation: none", "Moment GM-002: MODELLED OUTCOME"],
    },
    infrastructure: {
      headline: "Illustrative threshold result displayed.",
      narrative: "The local simulation marks its fictional criteria as met; it does not close a real playbook or start automated learning.",
      points: ["Modelled outcome: criteria met", "Modelled duration: 11 minutes", "Playbook PB-002: illustrative end state", "Learning proposal: human review required"],
    },
  },
  {
    label: "Learning Proposed", stage: "LEARNING", stageColor: "hsl(215 16% 60%)",
    guest: {
      headline: "Nothing changes for Mr Hartmann. The hotel got better.",
      narrative: "The fictional story shows a possible learning proposal; no hotel model is updated automatically.",
      points: ["Fictional guest view unchanged", "No measured improvement", "Proposed threshold change: 8 minutes earlier"],
    },
    operating: {
      headline: "Draft post-moment summary shown.",
      narrative: "An illustrative summary appears locally for a named Duty Manager to review; nothing is sent.",
      points: ["Moment summary: GM-002 · modelled", "Modelled response time: 11 minutes", "Illustrative roles: Housekeeping Lead + Floor Supervisor", "Outcome field: modelled success"],
    },
    infrastructure: {
      headline: "Threshold changes proposed for review.",
      narrative: "The interface illustrates potential rule updates; no AI learning service, pattern library or operational record is updated.",
      points: ["Proposed detection-window change: +8 minutes", "Proposed ETA threshold: 25 minutes", "Human approval required", "Synthetic reference set only"],
    },
  },
  {
    label: "Value Hypothesis", stage: "VALUE", stageColor: C.amber,
    guest: {
      headline: "'The Grand Meridian never misses a beat.'",
      narrative: "The fictional ending illustrates a positive stay and possible repeat-booking hypothesis; neither is measured.",
      points: ["Satisfaction: modelled", "Loyalty outcome: indicative", "Next booking: not measured", "Recovery need: modelled as none"],
    },
    operating: {
      headline: "Indicative KPI fields shown.",
      narrative: "The simulation displays value hypotheses; it does not prove service, cost or team-performance impact.",
      points: ["Recovery cost: illustrative", "Service KPI: not measured", "Team performance: not measured", "Moment hypothesis: documented locally"],
    },
    infrastructure: {
      headline: "Illustrative value attribution displayed.",
      narrative: "A hypothetical HIGH activation is shown for discussion; no property or portfolio score is updated.",
      points: ["Moment value: illustrative HIGH", "Attribution: not validated", "Portfolio impact: modelled +0.4 points", "Learning cycle: proposed"],
    },
  },
];

/* ─── Step Visual Panels ──────────────────────────────────────────── */
function StepVisual({ step, viewColor }: { step: number; viewColor: string }) {
  const panels: Record<number, React.ReactNode> = {
    0: (
      <ScreenshotCard title="Signal Registry · Simulated Feed" subtitle="3 illustrative signals">
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
      <ScreenshotCard title="Decision Registry · DEC-047" subtitle="Governed recommendation">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Decision", value: "Trigger Housekeeping Priority Protocol" },
            { label: "Playbook",   value: "PB-002 · VIP Arrival Protocol" },
            { label: "Owner",      value: "Duty Manager" },
            { label: "Time",       value: "0.8 seconds from moment creation" },
            { label: "Status",     value: "RECOMMENDED" },
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
      <ScreenshotCard title="Communication Orchestration" subtitle="3 channel drafts">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { to: "Housekeeping Lead", channel: "MOBILE PUSH", msg: "Room 847 priority clearance. Diamond arrival in 12 min.", color: C.red },
            { to: "Duty Manager",      channel: "IN-APP",       msg: "PB-002 active. VIP Arrival Risk. ETA 12 min. Update required at 09:20.", color: C.amber },
            { to: "Mr Hartmann", channel: "GUEST APP DRAFT", msg: "We look forward to welcoming you. Lounge access is proposed.", color: C.blue },
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
      <ScreenshotCard title="Command Centre · Simulated Tasks" subtitle="Room 847 priority">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { time: "09:04", label: "Task acceptance modelled", status: "MODELLED", statusColor: C.green },
            { time: "09:05", label: "Supervisor assignment modelled", status: "MODELLED", statusColor: C.green },
            { time: "09:06", label: "Lounge-access recommendation shown", status: "DRAFT", statusColor: C.green },
            { time: "09:07", label: "Illustrative room progress", status: "MODELLED", statusColor: C.amber },
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
      <ScreenshotCard title="Outcome Registry · GM-002" subtitle="MODELLED">
        <div style={{ padding: "12px", background: `${C.green}08`, border: `1px solid ${C.green}22`, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>VIP Arrival Risk</span>
            <Pill label="MODELLED" color={C.green} />
          </div>
          {[
            { label: "Room state", value: "Modelled ready at 09:10:44" },
            { label: "Guest arrival", value: "Fictional 09:14:32" },
            { label: "Escalation", value: "Modelled as none" },
            { label: "Recovery", value: "Modelled as not required" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "4px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 8.5, color: C.dimmed, minWidth: 80 }}>{r.label}</span>
              <span style={{ fontSize: 9.5, color: C.green, fontWeight: 600 }}>{r.value}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 9.5, color: C.muted }}>Illustrative duration: 11 minutes. No operational resolution occurred.</p>
      </ScreenshotCard>
    ),
    6: (
      <ScreenshotCard title="Learning Layer · Entry 848" subtitle="VIP arrival pattern">
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            { label: "Event",              value: "VIP Arrival Collision · Room Not Ready" },
            { label: "Outcome", value: "MODELLED · illustrative threshold met" },
            { label: "Detection window", value: "Proposed +8 minutes · human review required" },
            { label: "Housekeeper ETA", value: "Proposed threshold: 25 min" },
            { label: "Pattern confidence", value: "Illustrative 91.4%" },
            { label: "Reference entries", value: "Synthetic dataset only" },
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
            { label: "Brand promise",       value: "Modelled", color: C.green },
            { label: "Loyalty outcome",     value: "Indicative", color: C.green },
            { label: "Recovery cost",       value: "Illustrative", color: C.green },
            { label: "Portfolio impact",    value: "Modelled +0.4 pts", color: C.amber },
            { label: "Next stay",           value: "Not measured", color: C.blue },
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
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", color: C.white, textTransform: "uppercase" }}>RTBX Travel</span>
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
              <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 14 }}>RTBX Travel · SIMULATION</div>
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
