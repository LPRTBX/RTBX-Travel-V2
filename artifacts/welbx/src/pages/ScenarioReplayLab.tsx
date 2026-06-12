import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RefreshCw, CheckCircle2, XCircle, Clock, ChevronRight, Loader2 } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────── */
type Status = 'idle' | 'running' | 'complete' | 'failed';
type Urgency = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface ChainStep {
  stage: string;
  label: string;
  detail: string;
  output: string;
  pass: boolean;
}

interface Scenario {
  id: string;
  name: string;
  summary: string;
  category: string;
  urgency: Urgency;
  chain: ChainStep[];
  testScore: number;
  scoreNote: string;
}

/* ─── Palette ─────────────────────────────────────────────────────── */
const P = {
  bg:      "hsl(220 13% 5%)",
  panel:   "hsl(220 13% 7%)",
  card:    "hsl(220 13% 9%)",
  card2:   "hsl(220 13% 11%)",
  border:  "hsl(220 13% 12%)",
  amber:   "#c9a84c",
  white:   "#ffffff",
  muted:   "hsl(215 16% 52%)",
  dimmed:  "hsl(215 16% 28%)",
  green:   "#10b981",
  red:     "#ef4444",
  blue:    "#3b82f6",
  violet:  "#a78bfa",
  cyan:    "#22d3ee",
};

const URGENCY_COLOR: Record<Urgency, string> = {
  CRITICAL: P.red,
  HIGH:     P.red,
  MEDIUM:   P.amber,
  LOW:      P.blue,
};

const STAGE_COLOR: Record<string, string> = {
  SIGNAL:        P.blue,
  MOMENT:        P.amber,
  DECISION:      P.violet,
  COMMUNICATION: P.cyan,
  ACTION:        P.green,
  OUTCOME:       P.green,
  LEARNING:      "hsl(215 16% 56%)",
};

/* ─── Scenario Data ───────────────────────────────────────────────── */
const SCENARIOS: Scenario[] = [
  {
    id: "SCN-001",
    name: "VIP Arrival · Room Not Ready",
    summary: "Diamond guest arriving in 12 minutes. Assigned room occupied. Housekeeping ETA exceeds guest ETA by 10 minutes.",
    category: "VIP",
    urgency: "HIGH",
    testScore: 97,
    scoreNote: "Pattern matched in 1.2s. Playbook auto-triggered. Room cleared 4 min before arrival.",
    chain: [
      { stage: "SIGNAL",        label: "Three signals detected",             detail: "Diamond ETA: 12min · Room 847 occupied · Housekeeping ETA: 22min",                     output: "Signal cluster: 3 of 3 · Pattern confidence: 91%",                          pass: true },
      { stage: "MOMENT",        label: "VIP Arrival Risk classified",        detail: "Urgency: HIGH · Category: VIP · Confidence: 91% · Moment ID: GM-002",                   output: "Moment created in 0.4s · Playbook PB-002 queued",                           pass: true },
      { stage: "DECISION",      label: "Housekeeping Priority Protocol",     detail: "Playbook PB-002 auto-triggered · Decision DEC-047 · Owner: BXOS Auto",                   output: "Decision time: 0.8s · Governance path: clear",                             pass: true },
      { stage: "COMMUNICATION", label: "3 channels deployed",                detail: "Housekeeping Lead (Mobile) · Duty Manager (In-App) · Mr Hartmann (Guest App)",           output: "Routing time: 1.2s · All channels confirmed",                              pass: true },
      { stage: "ACTION",        label: "Room prioritised + supervisor on floor", detail: "Room 847 fast-tracked · Floor supervisor deployed · Lounge access activated",         output: "All 4 playbook steps initiated · Completion: 09:10:44",                    pass: true },
      { stage: "OUTCOME",       label: "Room ready 4 min before arrival",    detail: "Guest arrived 09:14:32 · No escalation · Seamless check-in",                             output: "PASS · Threshold: met (100%) · Moment GM-002: RESOLVED",                   pass: true },
      { stage: "LEARNING",      label: "Detection window extended +8 min",   detail: "Signal weights recalibrated · New VIP detection window: 20 min (was 12 min)",            output: "Pattern 848/848 logged · Confidence ↑ 0.4% · Library updated",            pass: true },
    ],
  },
  {
    id: "SCN-002",
    name: "Guest Complaint",
    summary: "Guest in Room 312 reports service failure following a delayed room service order. Sentiment negative. Prior Gold-tier stay.",
    category: "Recovery",
    urgency: "HIGH",
    testScore: 88,
    scoreNote: "Complaint resolved. Manager visit successful. Root cause logged but kitchen KPI breach not auto-escalated.",
    chain: [
      { stage: "SIGNAL",        label: "Complaint signal received",          detail: "Room 312 · In-app complaint · Sentiment: -ve · Prior stay: Gold tier",                  output: "Signal confidence: 89% · Moment threshold: met",                           pass: true },
      { stage: "MOMENT",        label: "Service Failure classified",         detail: "Urgency: HIGH · Category: Recovery · Confidence: 89%",                                   output: "Moment created · Playbook PB-003 queued",                                  pass: true },
      { stage: "DECISION",      label: "Service Failure Protocol triggered", detail: "PB-003 · Manager contact + amenity deployment · Owner: Duty Manager",                    output: "Decision logged · Manual confirmation required",                           pass: true },
      { stage: "COMMUNICATION", label: "2 channels deployed",                detail: "Duty Manager (In-App) · Room 312 Guest (Apology message)",                               output: "Routing time: 1.4s · Both channels confirmed",                             pass: true },
      { stage: "ACTION",        label: "Service recovery deployed",          detail: "Manager visit to Room 312 · Complimentary amenity sent · Apology delivered",             output: "3 of 4 playbook steps completed in threshold",                             pass: true },
      { stage: "OUTCOME",       label: "Complaint resolved · Partial flag",  detail: "Guest satisfied · Root cause (kitchen timing) not auto-escalated to F&B",               output: "PARTIAL · Guest outcome: PASS · Systemic flag: MISSED",                    pass: false },
      { stage: "LEARNING",      label: "Root cause logged · KPI gap noted",  detail: "Service failure attributed to kitchen timing breach · Escalation rule gap flagged",     output: "Learning captured · PB-003 escalation rule flagged for review",            pass: true },
    ],
  },
  {
    id: "SCN-003",
    name: "Check-in Congestion",
    summary: "14 guests queuing at front desk. Average wait 9.2 minutes. Three VIP arrivals expected in the next 20 minutes.",
    category: "Operational",
    urgency: "HIGH",
    testScore: 93,
    scoreNote: "Queue resolved in 4.1 minutes. Secondary lane activated successfully. VIP arrivals unaffected.",
    chain: [
      { stage: "SIGNAL",        label: "Queue pressure detected",            detail: "Queue length: 14 guests · Avg wait: 9.2 min · VIP window: 20 min",                      output: "Cluster: 3 signals · Confidence: 94%",                                     pass: true },
      { stage: "MOMENT",        label: "Queue Pressure Building",            detail: "Urgency: HIGH · Category: Operational · Confidence: 94%",                                output: "Moment created · Playbook PB-001 queued",                                  pass: true },
      { stage: "DECISION",      label: "Queue Management Protocol",          detail: "PB-001 · Secondary lane open · Host reallocated · Mobile check-in prompt",               output: "Auto-triggered · Decision time: 0.9s",                                     pass: true },
      { stage: "COMMUNICATION", label: "3 channels deployed",                detail: "Front Desk Lead · Bellhop Team · Guest mobile check-in prompt (8 guests)",              output: "All channels confirmed",                                                   pass: true },
      { stage: "ACTION",        label: "Secondary lane opened",              detail: "Lane 2 activated · 2 agents reallocated · Mobile check-in: 5 of 8 guests completed",    output: "Queue management: active",                                                 pass: true },
      { stage: "OUTCOME",       label: "Queue cleared in 4.1 minutes",       detail: "Wait time: 2.1 min (was 9.2 min) · VIP arrivals unaffected · No escalation",            output: "PASS · Threshold: met · Moment: RESOLVED",                                 pass: true },
      { stage: "LEARNING",      label: "Threshold recalibrated to 8 guests", detail: "Queue trigger lowered from 12 to 8 guests based on resolution data",                    output: "Baseline updated · Recalibration: complete",                               pass: true },
    ],
  },
  {
    id: "SCN-004",
    name: "Staff Fatigue",
    summary: "F&B team member showing fatigue signatures. Shift duration 9.5h. Response time drift +34%. Wellness score: low.",
    category: "Workforce",
    urgency: "MEDIUM",
    testScore: 91,
    scoreNote: "Welfare check initiated. Relief cover arranged. Team member supported without service disruption.",
    chain: [
      { stage: "SIGNAL",        label: "Fatigue pattern detected",           detail: "Shift: 9.5h · Response drift: +34% · Wellness: LOW · Error rate: elevated",             output: "Welfare signal · Confidence: 85%",                                         pass: true },
      { stage: "MOMENT",        label: "Staff Welfare Concern classified",   detail: "Urgency: MEDIUM · Category: Workforce · Confidence: 85%",                               output: "Moment created · HR pathway initiated",                                    pass: true },
      { stage: "DECISION",      label: "Welfare Protocol triggered",         detail: "PB-004 · HR welfare check + relief cover · Owner: HR Manager",                          output: "Manual owner assigned · Initiated in 1.1s",                                pass: true },
      { stage: "COMMUNICATION", label: "2 channels deployed",                detail: "HR Manager (In-App confidential) · Shift Supervisor (In-App task)",                    output: "Private channel confirmed · Supervisor briefed",                           pass: true },
      { stage: "ACTION",        label: "Break + relief cover arranged",      detail: "Team member: 30 min break scheduled · Relief: colleague reassigned for 90 min",         output: "Both actions confirmed · No service gap",                                  pass: true },
      { stage: "OUTCOME",       label: "Staff member supported",             detail: "Welfare check: complete · Cover: seamless · Service KPI: maintained",                   output: "PASS · Threshold: met · No escalation",                                    pass: true },
      { stage: "LEARNING",      label: "Fatigue threshold recalibrated",     detail: "Shift trigger lowered to 8.5h for F&B profiles · Pattern logged",                       output: "2 prior events matched retroactively",                                     pass: true },
    ],
  },
  {
    id: "SCN-005",
    name: "Maintenance Issue",
    summary: "HVAC fault affecting Floors 3–5. Three occupied rooms. One guest with known health sensitivity on Floor 4.",
    category: "Operational",
    urgency: "CRITICAL",
    testScore: 74,
    scoreNote: "Fault escalated correctly. Rooms blocked. Sensitive guest relocated. Full repair exceeded SLA by 2 hours.",
    chain: [
      { stage: "SIGNAL",        label: "HVAC fault · high severity",         detail: "Fault: Floors 3–5 · 3 occupied rooms · Guest sensitivity: F4 occupant",                output: "Confidence: 97% · Critical threshold: met",                                pass: true },
      { stage: "MOMENT",        label: "Critical System Failure classified", detail: "Urgency: CRITICAL · Category: Operational · Immediate escalation",                      output: "Moment created · PB-005 triggered",                                        pass: true },
      { stage: "DECISION",      label: "Maintenance Escalation Protocol",    detail: "PB-005 · Engineering lead + room block + alternatives",                                  output: "Duty Manager confirmation required · Initiated",                           pass: true },
      { stage: "COMMUNICATION", label: "4 channels deployed",                detail: "Engineering Lead · Duty Manager · Housekeeping · Affected guests",                       output: "3 of 4 channels confirmed · 1 guest comms delayed 4 min",                  pass: false },
      { stage: "ACTION",        label: "Rooms blocked + sensitive guest relocated", detail: "Floors 3–5 rooms blocked · Floor 4 guest: relocated to Floor 7 equivalent",      output: "Relocation: complete · Engineering: on site",                              pass: true },
      { stage: "OUTCOME",       label: "Partial repair · SLA breached",      detail: "Partial repair only · Full fix: +2h beyond SLA · Guest relocated successfully",        output: "PARTIAL · SLA breach: logged · Sensitive guest: PASS",                     pass: false },
      { stage: "LEARNING",      label: "HVAC inspection frequency increased", detail: "Weekly inspection protocol added · Sensitivity flag now auto-triggers priority relay",  output: "2 rule changes queued · Engineering protocol updated",                     pass: true },
    ],
  },
  {
    id: "SCN-006",
    name: "Lost Property",
    summary: "Guest reports high-value item missing (watch) after checkout. Housekeeping completed turnover 40 minutes ago.",
    category: "Guest",
    urgency: "MEDIUM",
    testScore: 95,
    scoreNote: "Property located in housekeeping found items. Returned to guest within 45 minutes of report.",
    chain: [
      { stage: "SIGNAL",        label: "Lost property report received",      detail: "Guest: Room 521 checkout · Item: high value · Housekeeping: turnover 40 min ago",        output: "Confidence: 92% · Property trace initiated",                               pass: true },
      { stage: "MOMENT",        label: "Lost Property · High Value classified", detail: "Urgency: MEDIUM · Value flag: HIGH · CCTV trace recommended",                         output: "Moment created · PB-007 queued",                                           pass: true },
      { stage: "DECISION",      label: "Lost Property Protocol",             detail: "PB-007 · Housekeeping trace + Security review + Guest notification",                     output: "Manual decision confirmed in 1.8s",                                        pass: true },
      { stage: "COMMUNICATION", label: "3 channels deployed",                detail: "Housekeeping Lead · Security (CCTV) · Guest (status update)",                           output: "All channels confirmed",                                                   pass: true },
      { stage: "ACTION",        label: "Room searched · CCTV reviewed",      detail: "Room 521 re-inspected · Found items box checked · CCTV confirmed item in housekeeping", output: "Item located: 28 min after report",                                         pass: true },
      { stage: "OUTCOME",       label: "Property returned within 45 minutes", detail: "Item: returned via concierge · Guest: notified + satisfied · No complaint",            output: "PASS · Threshold: met · Moment: RESOLVED",                                 pass: true },
      { stage: "LEARNING",      label: "Found items workflow updated",        detail: "High-value items: mandatory photography on discovery · Protocol tightened",             output: "Workflow rule change queued · Pattern logged",                             pass: true },
    ],
  },
  {
    id: "SCN-007",
    name: "Accessibility Need",
    summary: "Guest arriving in 3 hours has logged mobility assistance requirements. Room specification does not currently meet profile.",
    category: "Guest",
    urgency: "HIGH",
    testScore: 98,
    scoreNote: "All accessibility requirements met before arrival. Staff fully briefed. Zero friction at check-in.",
    chain: [
      { stage: "SIGNAL",        label: "Accessibility request detected",     detail: "Room spec: not compliant · Arrival: 3h · Requirement: mobility aid + bathroom rail",    output: "Confidence: 99% · Time window: adequate",                                  pass: true },
      { stage: "MOMENT",        label: "Accessibility Requirement classified", detail: "Urgency: HIGH · Category: Guest Needs · SLA: 3h window",                              output: "Moment created · PB-008 triggered",                                        pass: true },
      { stage: "DECISION",      label: "Accessibility Protocol",             detail: "PB-008 · Room reassignment + equipment deploy + staff brief",                            output: "Auto-triggered · Room 614 reserved (compliant)",                           pass: true },
      { stage: "COMMUNICATION", label: "3 channels deployed",                detail: "Housekeeping Lead · Front Desk · Concierge (briefed on guest profile)",                 output: "All confirmed · Staff brief: complete",                                    pass: true },
      { stage: "ACTION",        label: "Room reconfigured + equipment deployed", detail: "Room 614 assigned · Bathroom rail installed · Mobility aid at entrance",             output: "All equipment in place · 90 min before arrival",                           pass: true },
      { stage: "OUTCOME",       label: "Requirements met before arrival",    detail: "Guest arrived · No friction · All aids in place · Staff fully prepared",               output: "PASS · Zero adjustment required at check-in",                              pass: true },
      { stage: "LEARNING",      label: "Accessibility profile created",       detail: "Guest profile: accessibility flag set permanently · Auto-triggers on future bookings", output: "Profile updated · Future stays: pre-configured",                           pass: true },
    ],
  },
  {
    id: "SCN-008",
    name: "Late Arrival",
    summary: "Guest arriving at 23:45. Dining closed. Night skeleton crew. Preferences indicate food & beverage interests.",
    category: "Guest",
    urgency: "MEDIUM",
    testScore: 90,
    scoreNote: "Late arrival seamless. Light menu activated. Night porter briefed. No friction at reception.",
    chain: [
      { stage: "SIGNAL",        label: "Late arrival window detected",       detail: "ETA: 23:45 · Dining: closed · Crew: skeleton · F&B interest: noted in profile",         output: "Confidence: 83% · Comfort protocol queued",                                pass: true },
      { stage: "MOMENT",        label: "Late Arrival Window classified",     detail: "Urgency: MEDIUM · Category: Guest Experience · Window: 4.5h",                           output: "Moment created · PB-009 queued",                                           pass: true },
      { stage: "DECISION",      label: "Late Arrival Protocol",              detail: "PB-009 · Welcome pack + light menu + night porter brief",                                output: "Auto-triggered",                                                           pass: true },
      { stage: "COMMUNICATION", label: "3 channels deployed",                detail: "Night Manager · Room Service (light menu activated) · Guest App (welcome note)",         output: "All confirmed · Guest app message delivered",                              pass: true },
      { stage: "ACTION",        label: "Welcome pack + light menu prepared", detail: "Room: welcome pack placed · Light menu: available until 01:00 · Porter: briefed",       output: "All 3 actions complete · 2h ahead of arrival",                             pass: true },
      { stage: "OUTCOME",       label: "Seamless late check-in",             detail: "Guest arrived 23:52 · No friction · Room service order placed at 00:14",               output: "PASS · Guest satisfaction: maintained",                                    pass: true },
      { stage: "LEARNING",      label: "Late arrival pattern logged",        detail: "Profile updated: late arrival flag + F&B interest · Auto-activates for future stays",   output: "Pattern recorded · Protocol will pre-trigger next visit",                  pass: true },
    ],
  },
  {
    id: "SCN-009",
    name: "Dining Service Failure",
    summary: "Guest in restaurant reports 45+ minute wait for main course. Kitchen timing breach detected. Table occupancy: anniversary party.",
    category: "F&B",
    urgency: "HIGH",
    testScore: 86,
    scoreNote: "Guest retained. Complaint resolved. Kitchen KPI breach logged but not prevented — detection was reactive not predictive.",
    chain: [
      { stage: "SIGNAL",        label: "F&B delay and complaint detected",   detail: "Wait: 47 min (threshold: 25 min) · Complaint: table 14 · Occasion: anniversary",       output: "Confidence: 91% · Reactive trigger",                                       pass: true },
      { stage: "MOMENT",        label: "F&B Service Failure classified",     detail: "Urgency: HIGH · Occasion sensitivity: HIGH · Category: F&B",                            output: "Moment created · PB-003 (F&B variant) queued",                             pass: true },
      { stage: "DECISION",      label: "F&B Service Recovery Protocol",      detail: "Chef visit + complimentary course + partial bill adjustment offered",                    output: "Duty Manager confirmation: required",                                      pass: true },
      { stage: "COMMUNICATION", label: "3 channels deployed",                detail: "F&B Manager · Head Chef · Duty Manager",                                                output: "All confirmed",                                                            pass: true },
      { stage: "ACTION",        label: "Chef visit + complimentary course",  detail: "Head Chef visited table 14 · Dessert course: complimentary · 15% discount offered",    output: "Service recovery actions: complete",                                       pass: true },
      { stage: "OUTCOME",       label: "Guest retained · detection was reactive", detail: "Guest satisfied · Anniversary noted and acknowledged · Complaint: resolved",       output: "PARTIAL · Guest: PASS · Predictive miss: flagged",                         pass: false },
      { stage: "LEARNING",      label: "Kitchen timing threshold tightened", detail: "Alert threshold: 25 min → 18 min · Occasion-sensitive tables: elevated priority",       output: "Rule change queued · Occasion flag linked to predictive trigger",          pass: true },
    ],
  },
  {
    id: "SCN-010",
    name: "Transport Disruption",
    summary: "Guest airport transfer cancelled 90 minutes before departure. Checkout in 2 hours. Alternative not pre-arranged.",
    category: "Concierge",
    urgency: "MEDIUM",
    testScore: 92,
    scoreNote: "Alternative arranged within 18 minutes. Express checkout prepared. Guest departed on time.",
    chain: [
      { stage: "SIGNAL",        label: "Transport cancellation detected",    detail: "Transfer: cancelled · Checkout: 2h · Alternative: none arranged · Flight: confirmed",   output: "Confidence: 88% · Urgent window: 2h",                                      pass: true },
      { stage: "MOMENT",        label: "Transport Disruption classified",    detail: "Urgency: MEDIUM · Category: Concierge · Flight time: fixed constraint",                 output: "Moment created · PB-010 queued",                                           pass: true },
      { stage: "DECISION",      label: "Transport Protocol triggered",       detail: "PB-010 · Alternative transport + luggage store + express checkout",                     output: "Auto-triggered · Concierge notified",                                      pass: true },
      { stage: "COMMUNICATION", label: "3 channels deployed",                detail: "Concierge · Guest App (update + options) · Third-party Transport (backup)",             output: "All confirmed · Guest response: received in 3 min",                        pass: true },
      { stage: "ACTION",        label: "Alternative arranged in 18 minutes", detail: "Backup transport: confirmed · Luggage: stored · Express checkout: prepared",            output: "All 3 actions complete · Guest confirmed departure plan",                   pass: true },
      { stage: "OUTCOME",       label: "Guest departed on time",             detail: "Departure: on schedule · No additional cost to guest · Complaint: none",               output: "PASS · Threshold: met · Moment: RESOLVED",                                 pass: true },
      { stage: "LEARNING",      label: "Transport backup linked to profile", detail: "Profile: backup transport auto-queued for future bookings · Supplier protocol updated", output: "Profile updated · Supplier redundancy rule applied",                       pass: true },
    ],
  },
];

const STEP_DELAY = 520;

/* ─── Sub-components ─────────────────────────────────────────────── */
function StatusDot({ status, score }: { status: Status; score: number }) {
  if (status === 'running') return <Loader2 size={11} color={P.amber} style={{ animation: "spin 1s linear infinite" }} />;
  if (status === 'complete') {
    if (score >= 90) return <CheckCircle2 size={11} color={P.green} />;
    if (score >= 75) return <CheckCircle2 size={11} color={P.amber} />;
    return <XCircle size={11} color={P.red} />;
  }
  if (status === 'failed') return <XCircle size={11} color={P.red} />;
  return <div style={{ width: 7, height: 7, borderRadius: "50%", border: `1px solid ${P.border}`, background: P.card2 }} />;
}

function ScoreBadge({ score, status }: { score: number; status: Status }) {
  if (status !== 'complete') return null;
  const color = score >= 90 ? P.green : score >= 75 ? P.amber : P.red;
  const label = score >= 90 ? "PASS" : score >= 75 ? "PARTIAL" : "FAIL";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color, padding: "2px 8px", border: `1px solid ${color}30`, background: `${color}08` }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}<span style={{ fontSize: 8, color: P.dimmed }}>/100</span></span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function ScenarioReplayLab() {
  const [selectedId, setSelectedId] = useState<string>("SCN-001");
  const [stepProgress, setStepProgress] = useState<Record<string, number>>({});
  const [runStatus, setRunStatus] = useState<Record<string, Status>>({});
  const [runningAll, setRunningAll] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scenario = SCENARIOS.find(s => s.id === selectedId)!;
  const status = runStatus[selectedId] ?? 'idle';
  const progress = stepProgress[selectedId] ?? -1;

  function runScenario(id: string, onFinish?: () => void) {
    const sc = SCENARIOS.find(s => s.id === id)!;
    setRunStatus(p => ({ ...p, [id]: 'running' }));
    setStepProgress(p => ({ ...p, [id]: -1 }));
    let step = 0;
    const tick = () => {
      setStepProgress(p => ({ ...p, [id]: step }));
      step++;
      if (step < sc.chain.length) {
        timerRef.current = setTimeout(tick, STEP_DELAY);
      } else {
        timerRef.current = setTimeout(() => {
          setRunStatus(p => ({ ...p, [id]: 'complete' }));
          onFinish?.();
        }, STEP_DELAY);
      }
    };
    timerRef.current = setTimeout(tick, 200);
  }

  function handleRun() {
    if (status === 'running') return;
    runScenario(selectedId);
  }

  function handleReset(id?: string) {
    const target = id ?? selectedId;
    setRunStatus(p => ({ ...p, [target]: 'idle' }));
    setStepProgress(p => ({ ...p, [target]: -1 }));
  }

  async function handleRunAll() {
    if (runningAll) return;
    setRunningAll(true);
    let i = 0;
    const runNext = () => {
      if (i >= SCENARIOS.length) { setRunningAll(false); return; }
      const id = SCENARIOS[i].id;
      setSelectedId(id);
      runScenario(id, () => {
        i++;
        timerRef.current = setTimeout(runNext, 600);
      });
    };
    runNext();
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const passCount  = SCENARIOS.filter(s => (runStatus[s.id] === 'complete') && s.testScore >= 90).length;
  const partCount  = SCENARIOS.filter(s => (runStatus[s.id] === 'complete') && s.testScore >= 75 && s.testScore < 90).length;
  const failCount  = SCENARIOS.filter(s => (runStatus[s.id] === 'complete') && s.testScore < 75).length;
  const totalRun   = SCENARIOS.filter(s => runStatus[s.id] === 'complete' || runStatus[s.id] === 'running').length;

  return (
    <div style={{ marginLeft: 224, minHeight: "100vh", background: P.bg, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "22px 32px 18px", borderBottom: `1px solid ${P.border}`, background: P.panel, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.22em", color: P.green, textTransform: "uppercase", padding: "2px 8px", border: `1px solid ${P.green}30`, background: `${P.green}08` }}>VALIDATION · ACTIVE</span>
            <span style={{ fontSize: 7.5, color: P.dimmed }}>WELBX Scenario Replay Lab · v1.0</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: P.white, letterSpacing: "-0.01em", marginBottom: 5 }}>Scenario Replay Lab</h1>
          <p style={{ fontSize: 10.5, color: P.muted, maxWidth: 520 }}>
            Manually simulate hotel scenarios through the full WELBX chain before live integration. Each scenario is scored against expected behavioural logic at every step.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          {/* Suite summary */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "PASS",    val: passCount, color: P.green },
              { label: "PARTIAL", val: partCount, color: P.amber },
              { label: "FAIL",    val: failCount, color: P.red },
              { label: "PENDING", val: SCENARIOS.length - totalRun, color: P.dimmed },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color }}>{val}</div>
                <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.14em", color, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleRunAll}
              disabled={runningAll}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: runningAll ? "transparent" : `${P.green}12`, border: `1px solid ${runningAll ? P.border : P.green + "40"}`, cursor: runningAll ? "not-allowed" : "pointer", color: runningAll ? P.dimmed : P.green, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.15s" }}
            >
              {runningAll ? <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={10} />}
              {runningAll ? "Running Suite..." : "Run All Tests"}
            </button>
            <button
              onClick={() => { SCENARIOS.forEach(s => handleReset(s.id)); setRunningAll(false); }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", background: "transparent", border: `1px solid ${P.border}`, cursor: "pointer", color: P.dimmed, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              <RefreshCw size={10} /> Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left: Test list */}
        <div style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${P.border}`, overflowY: "auto", background: P.panel }}>
          <div style={{ padding: "14px 16px 8px", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase" }}>
            Test Suite · {SCENARIOS.length} scenarios
          </div>
          {SCENARIOS.map(sc => {
            const st = runStatus[sc.id] ?? 'idle';
            const isSelected = sc.id === selectedId;
            const scoreColor = sc.testScore >= 90 ? P.green : sc.testScore >= 75 ? P.amber : P.red;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedId(sc.id)}
                style={{
                  width: "100%", border: "none", cursor: "pointer", textAlign: "left",
                  padding: "9px 16px",
                  borderLeft: isSelected ? `2px solid ${P.amber}` : `2px solid transparent`,
                  background: isSelected ? "hsl(220 13% 10%)" : "transparent",
                  transition: "all 0.12s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <StatusDot status={st} score={sc.testScore} />
                    <span style={{ fontSize: 9, fontWeight: 600, color: isSelected ? P.white : P.muted, lineHeight: 1.3 }}>{sc.name}</span>
                  </div>
                  {st === 'complete' && <span style={{ fontSize: 9, fontWeight: 700, color: scoreColor }}>{sc.testScore}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: 17 }}>
                  <span style={{ fontSize: 7.5, letterSpacing: "0.1em", color: URGENCY_COLOR[sc.urgency] as string, fontWeight: 700, textTransform: "uppercase" }}>{sc.urgency}</span>
                  <span style={{ color: P.border }}>·</span>
                  <span style={{ fontSize: 7.5, color: P.dimmed }}>{sc.category}</span>
                  <span style={{ color: P.border }}>·</span>
                  <span style={{ fontSize: 7.5, fontFamily: "monospace", color: P.dimmed }}>{sc.id}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Scenario detail + chain */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {/* Scenario header */}
          <div style={{ marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${P.border}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 8, fontFamily: "monospace", color: P.dimmed }}>{scenario.id}</span>
                  <span style={{ color: P.border }}>·</span>
                  <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: URGENCY_COLOR[scenario.urgency] as string, textTransform: "uppercase" }}>{scenario.urgency}</span>
                  <span style={{ color: P.border }}>·</span>
                  <span style={{ fontSize: 7.5, color: P.dimmed }}>{scenario.category}</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: P.white, letterSpacing: "-0.01em", marginBottom: 6 }}>{scenario.name}</h2>
                <p style={{ fontSize: 10.5, color: P.muted, lineHeight: 1.65, maxWidth: 560 }}>{scenario.summary}</p>
              </div>
              <div style={{ display: "flex", flex: "column", gap: 8, alignItems: "flex-end", flexDirection: "column" }}>
                <ScoreBadge score={scenario.testScore} status={status} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleRun}
                    disabled={status === 'running'}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: status === 'running' ? "transparent" : `${P.amber}10`, border: `1px solid ${status === 'running' ? P.border : P.amber + "40"}`, cursor: status === 'running' ? "not-allowed" : "pointer", color: status === 'running' ? P.dimmed : P.amber, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.15s" }}
                  >
                    {status === 'running' ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={11} />}
                    {status === 'running' ? "Running..." : status === 'complete' ? "Re-run" : "Run Test"}
                  </button>
                  {status !== 'idle' && (
                    <button
                      onClick={() => handleReset()}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", background: "transparent", border: `1px solid ${P.border}`, cursor: "pointer", color: P.dimmed, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
                    >
                      <RefreshCw size={10} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            {status === 'complete' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 12, padding: "8px 12px", background: `${P.green}08`, border: `1px solid ${P.green}20`, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 8.5, fontFamily: "monospace", color: P.green, lineHeight: 1.5 }}>▶ {scenario.scoreNote}</span>
              </motion.div>
            )}
          </div>

          {/* Chain steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", marginBottom: 12 }}>
              Behavioural Chain · {scenario.chain.length} steps
            </div>
            {scenario.chain.map((step, i) => {
              const stepDone    = progress >= i;
              const stepActive  = status === 'running' && progress === i - 1 && i <= scenario.chain.length - 1;
              const isRunningThis = status === 'running' && progress === i;
              const stageColor  = STAGE_COLOR[step.stage] ?? P.muted;

              return (
                <div key={i} style={{ display: "flex", gap: 0, marginBottom: 0 }}>
                  {/* Connector column */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28, flexShrink: 0 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, border: `1px solid ${stepDone ? stageColor : isRunningThis ? stageColor : P.border}`, background: stepDone ? `${stageColor}14` : P.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", marginTop: 12 }}>
                      {isRunningThis
                        ? <Loader2 size={9} color={stageColor} style={{ animation: "spin 1s linear infinite" }} />
                        : stepDone
                          ? step.pass ? <span style={{ fontSize: 9, color: stageColor }}>✓</span> : <span style={{ fontSize: 9, color: P.red }}>✗</span>
                          : <span style={{ fontSize: 7, fontWeight: 700, color: P.dimmed }}>{i + 1}</span>
                      }
                    </div>
                    {i < scenario.chain.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: stepDone ? `${stageColor}30` : P.border, transition: "background 0.3s", minHeight: 16 }} />
                    )}
                  </div>

                  {/* Step card */}
                  <div
                    style={{
                      flex: 1, marginLeft: 10, marginBottom: 8, padding: "11px 14px",
                      background: isRunningThis ? `${stageColor}07` : stepDone ? `${stageColor}05` : P.card,
                      border: `1px solid ${isRunningThis ? stageColor + "30" : stepDone ? stageColor + "18" : P.border}`,
                      transition: "all 0.25s", opacity: stepDone || isRunningThis ? 1 : status === 'idle' ? 0.75 : 0.35,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: stepDone || isRunningThis ? 6 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.18em", color: stageColor, textTransform: "uppercase", minWidth: 76 }}>{step.stage}</span>
                        <ChevronRight size={9} color={P.border} />
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: stepDone || isRunningThis ? P.white : P.muted }}>{step.label}</span>
                      </div>
                      {stepDone && !isRunningThis && (
                        <span style={{ fontSize: 7.5, fontWeight: 700, color: step.pass ? P.green : P.amber, letterSpacing: "0.12em" }}>{step.pass ? "PASS" : "FLAGGED"}</span>
                      )}
                    </div>

                    {(stepDone || isRunningThis) && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }}>
                        <p style={{ fontSize: 9.5, color: P.muted, marginBottom: 5, lineHeight: 1.55 }}>{step.detail}</p>
                        <div style={{ padding: "5px 9px", background: "hsl(220 13% 4%)", border: `1px solid ${P.border}`, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 8, fontFamily: "monospace", color: step.pass ? P.green : P.amber }}>▶</span>
                          <span style={{ fontSize: 8.5, fontFamily: "monospace", color: step.pass ? P.green : P.amber, letterSpacing: "0.02em" }}>{step.output}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Score reveal */}
          <AnimatePresence>
            {status === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                style={{ marginTop: 16, padding: "18px 20px", background: P.card, border: `1px solid ${scenario.testScore >= 90 ? P.green + "30" : P.amber + "30"}` }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", marginBottom: 4 }}>Test Complete · {scenario.id}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 36, fontWeight: 800, color: scenario.testScore >= 90 ? P.green : P.amber, lineHeight: 1 }}>{scenario.testScore}</span>
                      <span style={{ fontSize: 13, color: P.dimmed }}>/100</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 14 }}>
                    {[
                      { label: "Passed",  val: scenario.chain.filter(s => s.pass).length,  color: P.green },
                      { label: "Flagged", val: scenario.chain.filter(s => !s.pass).length, color: P.amber },
                      { label: "Steps",   val: scenario.chain.length,                       color: P.muted },
                    ].map(({ label, val, color }) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
                        <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color, textTransform: "uppercase" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 9, fontFamily: "monospace", color: P.muted, lineHeight: 1.65, padding: "8px 10px", background: "hsl(220 13% 4%)", border: `1px solid ${P.border}` }}>
                  <span style={{ color: P.green }}>✓ </span>{scenario.scoreNote}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
