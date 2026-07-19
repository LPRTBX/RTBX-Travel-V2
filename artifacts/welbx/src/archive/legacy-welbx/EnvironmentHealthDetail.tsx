import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, ReferenceLine,
} from "recharts";

/* ─── Palette ─────────────────────────────────────────── */
const C = {
  amber:  "#c9a84c",
  green:  "#10b981",
  blue:   "#3b82f6",
  red:    "#ef4444",
  violet: "#a78bfa",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 36%)",
  dimmed: "hsl(215 16% 22%)",
};

/* ─── Score helpers ──────────────────────────────────── */
function scoreColor(s: number): string {
  if (s >= 90) return C.green;
  if (s >= 75) return C.amber;
  if (s >= 60) return "#f97316";
  return C.red;
}
function scoreCategory(s: number) {
  if (s >= 90) return "Excellent";
  if (s >= 75) return "Healthy";
  if (s >= 60) return "Watch";
  return "At Risk";
}

/* ─── Data generators ───────────────────────────────── */
function spark(base: number, variance: number, days = 30) {
  const result: { d: string; v: number }[] = [];
  let current = base - variance * 0.5;
  for (let i = 0; i < days; i++) {
    current = Math.min(100, Math.max(0, current + (Math.random() - 0.42) * variance));
    const date = new Date(2026, 4, 12 + i - 30); // relative to today
    result.push({ d: `${date.getMonth() + 1}/${date.getDate()}`, v: Math.round(current) });
  }
  result[days - 1].v = base;
  return result;
}

/* ─── Dimension detail definitions ────────────────────── */
interface SubFactor {
  name: string;
  score: number;
  weight: number;
  status: string;
  note: string;
}
interface Event {
  time: string;
  type: "warning" | "info" | "critical" | "ok";
  title: string;
  detail: string;
}
interface ActionItem {
  priority: "HIGH" | "MEDIUM" | "LOW";
  action: string;
  owner: string;
  effort: string;
  impact: string;
  rationale: string;
}
interface DimensionDetail {
  id: string;
  label: string;
  sub: string;
  score: number;
  color: string;
  description: string;
  longDescription: string;
  subFactors: SubFactor[];
  events: Event[];
  actions: ActionItem[];
  keyMetrics: { label: string; value: string; delta: string; positive: boolean }[];
}

const DETAIL_DATA: Record<string, DimensionDetail> = {
  signal: {
    id: "signal",
    label: "Signal Health",
    sub: "SENSING LAYER",
    score: 82,
    color: C.amber,
    description: "Quality and completeness of incoming behavioural signals",
    longDescription: "Signal Health measures the integrity of the sensing infrastructure that feeds all downstream intelligence. It captures how completely and accurately the physical environment is observed—coverage across zones, data freshness, sensor uptime, and signal deduplication quality.",
    keyMetrics: [
      { label: "Active Sensors", value: "147 / 153", delta: "−6 offline", positive: false },
      { label: "Signal Coverage", value: "91.4%", delta: "−2.1% vs last week", positive: false },
      { label: "Avg Latency", value: "1.2s", delta: "−0.3s vs last week", positive: true },
      { label: "Dedup Rate", value: "99.1%", delta: "+0.4% vs last week", positive: true },
    ],
    subFactors: [
      { name: "Sensor Uptime", score: 96, weight: 25, status: "Excellent", note: "153 sensors deployed; 6 offline in lounge/bar zones" },
      { name: "Zone Coverage Completeness", score: 74, weight: 30, status: "Watch", note: "F&B zone coverage at 74%—three nodes down for 6+ days" },
      { name: "Signal Freshness", score: 88, weight: 20, status: "Healthy", note: "Average signal age 1.2s; within acceptable window" },
      { name: "Deduplication Quality", score: 91, weight: 15, status: "Excellent", note: "99.1% clean dedup rate; minimal duplicate events" },
      { name: "Baseline Calibration", score: 79, weight: 10, status: "Healthy", note: "Seasonal baseline updated 8 days ago; due for refresh" },
    ],
    events: [
      { time: "Today 07:14", type: "warning", title: "F&B Zone Node Timeout", detail: "Sensing node BRZ-04 in the bar zone failed to heartbeat. Signal gap entered 6th consecutive day." },
      { time: "Today 03:40", type: "info", title: "Baseline Recalibration Skipped", detail: "Nightly recalibration routine skipped due to incomplete zone data. Scheduled retry at 04:30." },
      { time: "Yesterday 22:10", type: "ok", title: "Lobby Signal Restored", detail: "LBB-12 sensor reconnected after firmware update. Lobby coverage returned to 100%." },
      { time: "Jun 9 14:30", type: "critical", title: "Lounge Node Cluster Offline", detail: "Three lounge sensing nodes (LNG-07, LNG-08, LNG-09) went offline simultaneously. Engineering ticket raised." },
      { time: "Jun 8 09:15", type: "info", title: "Signal Latency Improvement", detail: "Edge processing upgrade deployed. Average signal latency reduced from 1.5s to 1.2s." },
      { time: "Jun 7 16:44", type: "ok", title: "Baseline Sync Completed", detail: "Monthly behavioural baseline successfully synchronised across all active zones." },
    ],
    actions: [
      { priority: "HIGH", action: "Restore offline sensing nodes in lounge and bar zones", owner: "Engineering Lead", effort: "Medium", impact: "High", rationale: "Three offline nodes have degraded F&B signal coverage for 6 days. Restoration closes the coverage gap and improves signal completeness to 97%+, adding an estimated +6 pts to Signal Health." },
      { priority: "MEDIUM", action: "Trigger zone baseline recalibration after restoration", owner: "BXOS Configuration", effort: "Low", impact: "Medium", rationale: "Once nodes are back, the baseline will be stale by 6+ days. A fresh calibration ensures moment detection accuracy is not compromised by outdated reference profiles." },
      { priority: "LOW", action: "Schedule quarterly sensor firmware audit", owner: "Engineering Lead", effort: "Low", impact: "Low", rationale: "The simultaneous failure of three lounge nodes suggests a firmware dependency. A coordinated audit prevents cluster failures from recurring." },
    ],
  },
  moment: {
    id: "moment",
    label: "Moment Health",
    sub: "DETECTION LAYER",
    score: 76,
    color: C.blue,
    description: "Accuracy and timeliness of moment detection and classification",
    longDescription: "Moment Health reflects how well BXOS identifies meaningful guest behavioural events in real time. It measures classification accuracy, detection latency, false positive and negative rates, and the system's ability to maintain performance across all operational hours—including overnight when staffing and signal density change.",
    keyMetrics: [
      { label: "Detection Accuracy", value: "88.3%", delta: "+1.2% vs last week", positive: true },
      { label: "Avg Detection Lag", value: "2.8s (day) / 4.4s (night)", delta: "+38% overnight", positive: false },
      { label: "False Positive Rate", value: "6.1%", delta: "+0.8% vs last week", positive: false },
      { label: "Moments Detected (7d)", value: "1,842", delta: "+14% vs prior 7d", positive: true },
    ],
    subFactors: [
      { name: "Classification Accuracy", score: 88, weight: 30, status: "Healthy", note: "88.3% accuracy against labelled validation set; above 85% target" },
      { name: "Detection Latency (Day)", score: 91, weight: 20, status: "Excellent", note: "Average 2.8s daytime lag; well within the 5s threshold" },
      { name: "Detection Latency (Night)", score: 57, weight: 20, status: "At Risk", note: "Latency rises 38% between 22:00–06:00; estimated −7 pts" },
      { name: "False Positive Rate", score: 79, weight: 20, status: "Healthy", note: "6.1% false positive rate; slightly above the 5% target" },
      { name: "Coverage Continuity", score: 84, weight: 10, status: "Healthy", note: "Moment pipeline uptime 99.6% in last 7 days" },
    ],
    events: [
      { time: "Today 04:17", type: "warning", title: "Overnight Lag Spike", detail: "Detection lag reached 6.2s at 04:17—highest overnight peak this week. Overnight accelerator not active." },
      { time: "Today 01:05", type: "info", title: "Late-Shift Moment Cluster", detail: "11 moments detected in 4-minute window; classification confidence averaged 74%." },
      { time: "Yesterday 22:00", type: "warning", title: "Night Mode Transition", detail: "Automatic overnight detection mode failed to activate. Root cause: configuration flag not toggled." },
      { time: "Jun 9 11:32", type: "ok", title: "Accuracy Benchmark Passed", detail: "Weekly validation run completed. Classification accuracy 88.3%—above the 85% threshold." },
      { time: "Jun 8 14:00", type: "info", title: "New Moment Type Deployed", detail: "\"Extended Check-In Friction\" moment type released to production. Initial detection rate nominal." },
      { time: "Jun 7 08:45", type: "ok", title: "False Positive Reduction", detail: "Model calibration tweak reduced false positives from 7.8% to 6.1%." },
    ],
    actions: [
      { priority: "HIGH", action: "Enable overnight detection accelerator in BXOS", owner: "BXOS Configuration", effort: "Low", impact: "High", rationale: "Activating the overnight fast-path reduces late-shift latency by an estimated 60%, closing the detection lag gap and adding ~7 pts to Moment Health." },
      { priority: "MEDIUM", action: "Investigate overnight mode configuration flag", owner: "Engineering Lead", effort: "Low", impact: "Medium", rationale: "Night mode failed to auto-activate last night. A review of the transition logic prevents recurring overnight blind spots." },
      { priority: "LOW", action: "Tune false positive threshold for hospitality edge cases", owner: "BXOS Intelligence", effort: "Medium", impact: "Low", rationale: "Reducing false positives from 6.1% to below 5% would improve operator trust in automated detections and reduce unnecessary notifications." },
    ],
  },
  decision: {
    id: "decision",
    label: "Decision Health",
    sub: "INTELLIGENCE LAYER",
    score: 88,
    color: C.violet,
    description: "Confidence and outcome quality of automated and human decisions",
    longDescription: "Decision Health measures the quality of the intelligence layer—how confident and accurate automated decisions are, how well human escalations are resolved, and whether decisions consistently lead to positive guest outcomes. A high Decision Health score means BXOS is operating as a trusted autonomous partner rather than a burden on staff attention.",
    keyMetrics: [
      { label: "Avg Decision Confidence", value: "84.2%", delta: "+2.1% vs last week", positive: true },
      { label: "Escalation Rate", value: "12%", delta: "+4% above target", positive: false },
      { label: "Decision Accuracy", value: "91.7%", delta: "+0.9% vs last week", positive: true },
      { label: "Outcome Validation Rate", value: "78%", delta: "−3% vs last week", positive: false },
    ],
    subFactors: [
      { name: "Automated Decision Confidence", score: 84, weight: 30, status: "Healthy", note: "84.2% average confidence; target is 85%—just below threshold" },
      { name: "Decision Accuracy (Validated)", score: 92, weight: 25, status: "Excellent", note: "91.7% decisions validated as correct in post-hoc review" },
      { name: "Escalation Rate", score: 76, weight: 20, status: "Healthy", note: "12% escalation rate vs 8% target; driven by hospitality edge cases" },
      { name: "Human Decision Quality", score: 89, weight: 15, status: "Healthy", note: "Staff escalation decisions rated 89% accuracy by outcome review" },
      { name: "Outcome Feedback Loop", score: 78, weight: 10, status: "Healthy", note: "78% of decisions have linked outcome validation; gaps in F&B category" },
    ],
    events: [
      { time: "Today 10:22", type: "info", title: "Confidence Threshold Crossed", detail: "Batch of 7 F&B decisions fell below 70% confidence—automatically escalated to duty manager." },
      { time: "Today 08:45", type: "ok", title: "Decision Accuracy Benchmark", detail: "Morning validation run: 91.7% accuracy across 143 reviewed decisions. Above 90% target." },
      { time: "Yesterday 16:30", type: "warning", title: "Escalation Rate Alert", detail: "Hourly escalation rate reached 18% between 15:00–16:00. Spike linked to F&B edge case cluster." },
      { time: "Jun 9 09:00", type: "info", title: "Model Retrain Completed", detail: "Weekly model retrain incorporated 1,200 new labelled decisions. Confidence baseline lifted by 1.3%." },
      { time: "Jun 8 14:15", type: "ok", title: "Outcome Feedback Batch Processed", detail: "312 pending outcome validations processed. F&B category still 34% unvalidated." },
      { time: "Jun 7 11:00", type: "warning", title: "Confidence Calibration Drift", detail: "Statistical calibration drift detected in dining-related decision cluster. Correction applied." },
    ],
    actions: [
      { priority: "MEDIUM", action: "Recalibrate confidence thresholds for hospitality edge cases", owner: "BXOS Intelligence", effort: "Medium", impact: "Medium", rationale: "Tightening the escalation trigger from 70% to 65% confidence would reduce unnecessary human escalations by ~40% without materially reducing decision accuracy." },
      { priority: "MEDIUM", action: "Close F&B outcome validation gap", owner: "Operations Manager", effort: "Low", impact: "Medium", rationale: "34% of F&B decisions lack outcome validation. Closing this gap improves model feedback quality and lifts the Outcome Feedback Loop sub-factor." },
      { priority: "LOW", action: "Review escalation routing rules for dining-related moments", owner: "BXOS Configuration", effort: "Low", impact: "Low", rationale: "F&B moments are disproportionately driving the escalation spike. Refined routing rules may resolve without model changes." },
    ],
  },
  execution: {
    id: "execution",
    label: "Execution Health",
    sub: "RESPONSE LAYER",
    score: 91,
    color: C.green,
    description: "Playbook execution fidelity and staff response consistency",
    longDescription: "Execution Health reflects how consistently and accurately staff carry out the playbooks triggered by BXOS decisions. It measures response time from trigger to first action, step completion fidelity, staff acknowledgement speed, and whether playbook outcomes match expected resolution patterns.",
    keyMetrics: [
      { label: "Playbook Completion Rate", value: "93.8%", delta: "+1.2% vs last week", positive: true },
      { label: "Avg Response Time", value: "3.1 min", delta: "−0.4 min vs last week", positive: true },
      { label: "Step Fidelity Rate", value: "96.4%", delta: "+0.7% vs last week", positive: true },
      { label: "Acknowledgement Rate", value: "89.2%", delta: "−1.1% vs last week", positive: false },
    ],
    subFactors: [
      { name: "Playbook Completion Rate", score: 94, weight: 30, status: "Excellent", note: "93.8% of triggered playbooks completed all required steps" },
      { name: "Response Initiation Speed", score: 92, weight: 25, status: "Excellent", note: "Average 3.1 minutes from trigger to first staff action" },
      { name: "Step Completion Fidelity", score: 96, weight: 20, status: "Excellent", note: "96.4% of individual steps completed without skip or deviation" },
      { name: "Staff Acknowledgement Rate", score: 89, weight: 15, status: "Healthy", note: "89.2% of playbook assignments acknowledged within the expected window" },
      { name: "Outcome Resolution Rate", score: 88, weight: 10, status: "Healthy", note: "88% of executed playbooks resulted in a verified positive outcome" },
    ],
    events: [
      { time: "Today 09:48", type: "ok", title: "High-Priority Playbook Resolved", detail: "\"VIP Early Arrival\" playbook completed in 2.8 min with all 5 steps verified. Outcome rated Excellent." },
      { time: "Today 07:30", type: "info", title: "Morning Briefing Playbook", detail: "Daily briefing playbook executed across 3 departments. 100% step completion; 92% acknowledged." },
      { time: "Yesterday 21:15", type: "warning", title: "Unacknowledged Assignment", detail: "Night shift F&B playbook assignment unacknowledged for 8 minutes before escalation. Resolved by supervisor." },
      { time: "Jun 9 15:40", type: "ok", title: "Response Time Record", detail: "\"Guest Distress\" playbook triggered and first action taken in 1.4 minutes—fastest this month." },
      { time: "Jun 8 11:20", type: "info", title: "Playbook Step Skipped", detail: "\"Room Upgrade\" playbook: step 3 (confirmation call) skipped by front desk. Flagged for coaching." },
      { time: "Jun 7 14:00", type: "ok", title: "Weekly Execution Benchmark", detail: "7-day execution review: 93.8% completion rate, 3.1 min avg response. Both above target." },
    ],
    actions: [
      { priority: "LOW", action: "Investigate overnight acknowledgement gap", owner: "Operations Manager", effort: "Low", impact: "Low", rationale: "Night shift acknowledgement rate dipped 1.1% this week. Reviewing staffing and notification routing during low-cover periods would prevent the trend from worsening." },
      { priority: "LOW", action: "Coach front desk on confirmation step skipping", owner: "Department Head", effort: "Low", impact: "Low", rationale: "The skipped confirmation step in the Room Upgrade playbook is a training signal. A brief coaching session closes the compliance gap before it becomes a pattern." },
    ],
  },
  communication: {
    id: "communication",
    label: "Communication Health",
    sub: "DELIVERY LAYER",
    score: 71,
    color: "#f97316",
    description: "Message delivery speed, clarity, and acknowledgement rates",
    longDescription: "Communication Health measures how effectively BXOS-triggered communications reach their intended recipients and drive action. It covers delivery speed, channel reliability, message acknowledgement rates, and whether communications are resulting in the intended staff or guest response. This is the current lowest-scoring dimension and the highest-priority improvement area.",
    keyMetrics: [
      { label: "Message Delivery Rate", value: "97.3%", delta: "+0.2% vs last week", positive: true },
      { label: "Acknowledgement Rate", value: "61%", delta: "−4% vs last week", positive: false },
      { label: "Avg Read Time", value: "4.8 min", delta: "+1.2 min vs last week", positive: false },
      { label: "Channel Reliability", value: "84%", delta: "−6% vs last week", positive: false },
    ],
    subFactors: [
      { name: "Message Delivery Rate", score: 97, weight: 15, status: "Excellent", note: "97.3% of messages successfully delivered to intended channel" },
      { name: "Acknowledgement Rate", score: 52, weight: 35, status: "At Risk", note: "Only 61% of dispatched communications confirmed as read within expected window. −9 pts." },
      { name: "Channel Reliability", score: 68, weight: 25, status: "Watch", note: "Primary staff channel (app) at 84% reliability this week; push notification failures elevated" },
      { name: "Message Clarity Score", score: 81, weight: 15, status: "Healthy", note: "Staff feedback scores message clarity at 8.1/10 on average" },
      { name: "Response-to-Communication Rate", score: 74, weight: 10, status: "Watch", note: "74% of communications result in a recorded staff response or action" },
    ],
    events: [
      { time: "Today 08:55", type: "critical", title: "Acknowledgement Rate Below Threshold", detail: "7-day rolling acknowledgement rate dropped to 61%—below the 85% minimum threshold. Alert raised to Operations Manager." },
      { time: "Today 06:30", type: "warning", title: "Push Notification Delivery Failure", detail: "14 push notifications failed to deliver during 06:00–06:30 window. Device registration issue on night-shift devices." },
      { time: "Yesterday 19:45", type: "warning", title: "Channel Reliability Drop", detail: "Staff app push channel reliability dropped from 91% to 84% following OS update rollout on shift devices." },
      { time: "Jun 9 14:00", type: "info", title: "SMS Fallback Activated", detail: "SMS fallback triggered for 23 unacknowledged messages. 19 of 23 subsequently acknowledged via SMS." },
      { time: "Jun 8 10:30", type: "ok", title: "Message Clarity Feedback", detail: "Weekly clarity survey returned 8.1/10 average. \"Conciseness\" rated highest; \"urgency indication\" lowest." },
      { time: "Jun 7 09:00", type: "warning", title: "Night Shift Ack Gap", detail: "Night shift acknowledgement rate: 44%—well below the 85% target. Staffing and device coverage reviewed." },
    ],
    actions: [
      { priority: "HIGH", action: "Audit and restore staff communication channel reliability", owner: "Operations Manager", effort: "Low", impact: "High", rationale: "Restoring acknowledgement rates to 90%+ would add ~9 points to Communication Health and lift the overall Environment Score by ~1.5 points. The OS update rollout is the likely root cause." },
      { priority: "HIGH", action: "Re-register night-shift devices for push notifications", owner: "IT / Engineering", effort: "Low", impact: "High", rationale: "14 notification failures this morning were traced to stale device registrations after the overnight OS update. Re-registration resolves the delivery gap immediately." },
      { priority: "MEDIUM", action: "Review and improve urgency signalling in message templates", owner: "BXOS Communications", effort: "Medium", impact: "Medium", rationale: "Clarity feedback rates urgency indication as the lowest-scoring dimension. Improving urgency cues in templates is likely to lift acknowledgement speed." },
      { priority: "LOW", action: "Enable automatic SMS fallback for unacknowledged messages", owner: "BXOS Configuration", effort: "Low", impact: "Medium", rationale: "The manual SMS fallback on Jun 9 recovered 19/23 messages. Automating this fallback creates a permanent safety net when primary channel reliability degrades." },
    ],
  },
  activation: {
    id: "activation",
    label: "Activation Health",
    sub: "OUTCOME LAYER",
    score: 84,
    color: C.amber,
    description: "Staff activation rates and commercial trigger conversion",
    longDescription: "Activation Health measures whether the end-to-end BXOS loop is converting detected moments into real-world outcomes—staff activations, guest upsells, service recoveries, and commercial conversions. A high score means the system is translating intelligence into tangible value rather than just generating alerts that go unacted upon.",
    keyMetrics: [
      { label: "Staff Activation Rate", value: "87.4%", delta: "+2.3% vs last week", positive: true },
      { label: "Commercial Conversion Rate", value: "31.2%", delta: "+1.1% vs last week", positive: true },
      { label: "Recovery Success Rate", value: "88.6%", delta: "+0.4% vs last week", positive: true },
      { label: "Avg Time to Activation", value: "4.6 min", delta: "+0.8 min vs last week", positive: false },
    ],
    subFactors: [
      { name: "Staff Activation Rate", score: 87, weight: 30, status: "Healthy", note: "87.4% of triggered interventions resulted in a recorded staff activation" },
      { name: "Commercial Conversion Rate", score: 82, weight: 25, status: "Healthy", note: "31.2% of commercial triggers converted to revenue-generating outcomes" },
      { name: "Service Recovery Rate", score: 89, weight: 20, status: "Healthy", note: "88.6% of service recovery triggers resolved with guest satisfaction confirmation" },
      { name: "Activation Speed", score: 80, weight: 15, status: "Healthy", note: "Average 4.6 min from trigger to activation; slightly above the 4.0 min target" },
      { name: "Outcome Proof Rate", score: 76, weight: 10, status: "Healthy", note: "76% of activations have a linked outcome record with measurable result" },
    ],
    events: [
      { time: "Today 11:15", type: "ok", title: "Upsell Conversion Cluster", detail: "7 consecutive upsell triggers converted between 10:30–11:15. Highest hourly rate this week." },
      { time: "Today 09:00", type: "info", title: "Activation Rate Summary", detail: "7-day rolling activation rate: 87.4%. +2.3% week-over-week. Three departments above 90%." },
      { time: "Yesterday 20:30", type: "warning", title: "Evening Activation Slowdown", detail: "Activation speed dropped to 7.2 min average between 19:00–21:00. Dinner service peak staffing review needed." },
      { time: "Jun 9 15:00", type: "ok", title: "Service Recovery Milestone", detail: "100th successful service recovery this month logged. Recovery success rate 88.6%—above target." },
      { time: "Jun 8 10:00", type: "info", title: "Outcome Proof Gap Review", detail: "24% of activations still lack linked outcome records. F&B and spa categories most affected." },
      { time: "Jun 7 14:30", type: "ok", title: "Commercial Conversion Benchmark", detail: "Weekly commercial review: 31.2% conversion rate. Target is 28%. Outperforming for 3rd consecutive week." },
    ],
    actions: [
      { priority: "MEDIUM", action: "Investigate evening activation speed drop", owner: "Operations Manager", effort: "Low", impact: "Medium", rationale: "Activation speed during dinner service (19:00–21:00) is 56% slower than the daily average. Reviewing staffing levels and notification routing during this window would close the gap." },
      { priority: "MEDIUM", action: "Close outcome proof gap in F&B and spa categories", owner: "Department Heads", effort: "Medium", impact: "Medium", rationale: "24% of activations lack linked outcome records. Adding outcome capture steps to F&B and spa playbooks improves proof rate and model feedback quality." },
      { priority: "LOW", action: "Replicate upsell conversion patterns from top-performing departments", owner: "BXOS Intelligence", effort: "Medium", impact: "Low", rationale: "Three departments are achieving 90%+ activation rates. Analysing their playbook configurations and communication timing may surface replicable patterns for lower-performing areas." },
    ],
  },
};

/* ─── Tooltip ─────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "hsl(220 13% 10%)",
      border: "1px solid hsl(220 13% 16%)",
      padding: "6px 10px",
      fontSize: 10,
      color: "#fff",
      fontWeight: 700,
    }}>
      <div style={{ color: C.muted, marginBottom: 2, fontWeight: 400 }}>{label}</div>
      {payload[0].value}
    </div>
  );
}

/* ─── Score arc ──────────────────────────────────────── */
function ScoreArc({ score, color }: { score: number; color: string }) {
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - score / 100);
  return (
    <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
      <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="65" cy="65" r="52" fill="none" stroke="hsl(220 13% 10%)" strokeWidth="8" />
        <motion.circle
          cx="65" cy="65" r="52" fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 32, fontWeight: 900, color, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginTop: 2 }}>
          / 100
        </div>
      </div>
    </div>
  );
}

/* ─── Event icon ─────────────────────────────────────── */
function EventDot({ type }: { type: Event["type"] }) {
  const colors: Record<Event["type"], string> = { critical: C.red, warning: "#f97316", info: C.blue, ok: C.green };
  const col = colors[type];
  return (
    <div style={{
      width: 6, height: 6, borderRadius: "50%",
      background: col, flexShrink: 0, marginTop: 4,
      boxShadow: `0 0 5px ${col}60`,
    }} />
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function EnvironmentHealthDetail() {
  const { dimensionId } = useParams<{ dimensionId: string }>();
  const [, navigate] = useLocation();

  const d = DETAIL_DATA[dimensionId ?? ""];

  if (!d) {
    return (
      <div className="pl-56 min-h-screen" style={{ background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: C.muted }}>Dimension not found.</div>
          <button
            onClick={() => navigate("/environment-health")}
            style={{ marginTop: 16, fontSize: 11, color: C.amber, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            ← Back to Environment Health
          </button>
        </div>
      </div>
    );
  }

  const col = scoreColor(d.score);
  const cat = scoreCategory(d.score);
  const historyData = spark(d.score, 9, 30);
  const priorityColors: Record<string, string> = { HIGH: C.red, MEDIUM: "#f97316", LOW: C.blue };

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Back nav ── */}
        <motion.button
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/environment-health")}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "none", border: "none", cursor: "pointer",
            color: C.dimmed, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            marginBottom: 20, padding: 0,
          }}
        >
          <span style={{ fontSize: 12 }}>←</span>
          Environment Health Index
        </motion.button>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          style={{ marginBottom: 28 }}
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: d.color, textTransform: "uppercase", marginBottom: 8 }}>
            WELBX · Environment Intelligence · {d.sub}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
            {d.label}
          </h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em", maxWidth: 700, lineHeight: 1.7 }}>
            {d.longDescription}
          </p>
        </motion.div>

        {/* ── Score hero + key metrics ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.38 }}
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderTop: `2px solid ${col}`,
            padding: "28px 32px",
            marginBottom: 1,
            display: "flex", alignItems: "center", gap: 36,
          }}
        >
          <ScoreArc score={d.score} color={col} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
              color: col, border: `1px solid ${col}44`,
              padding: "4px 12px", background: `${col}10`,
              display: "inline-block", marginBottom: 8, textTransform: "uppercase",
            }}>
              {cat}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 4 }}>
              {d.label}
            </div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, maxWidth: 420 }}>
              {d.description}
            </div>
          </div>
          {/* Key metrics row */}
          <div style={{ display: "flex", gap: 1, flexShrink: 0 }}>
            {d.keyMetrics.map((m, i) => (
              <div key={i} style={{
                padding: "14px 18px",
                background: "hsl(220 13% 6%)",
                border: `1px solid ${C.border}`,
                minWidth: 130,
                textAlign: "center",
              }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 6 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 9, fontWeight: 600, color: m.positive ? C.green : C.red, letterSpacing: "0.06em" }}>
                  {m.delta}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Score history chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.38 }}
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderTop: "none",
            padding: "20px 24px",
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
              Score History
            </span>
            <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Last 30 days
            </span>
          </div>
          <div style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={d.color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={d.color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fontSize: 8, fill: C.dimmed }} tickLine={false} axisLine={false} interval={5} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 8, fill: C.dimmed }} tickLine={false} axisLine={false} />
                <CartesianGrid stroke="hsl(220 13% 9%)" strokeDasharray="3 3" vertical={false} />
                <ReferenceLine y={75} stroke={`${C.amber}50`} strokeDasharray="4 3" label={{ value: "75", fill: C.dimmed, fontSize: 8 }} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone" dataKey="v"
                  stroke={d.color} strokeWidth={1.5}
                  fill="url(#histGrad)"
                  dot={false} activeDot={{ r: 3, fill: d.color }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ── Sub-factors + Events ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 1, marginBottom: 28 }}>

          {/* Sub-factors */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.38 }}
          >
            <div style={{
              padding: "10px 20px",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderBottom: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
                Sub-Factor Breakdown
              </span>
              <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {d.subFactors.length} factors
              </span>
            </div>
            {d.subFactors.map((f, i) => {
              const fc = scoreColor(f.score);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24 + i * 0.06, duration: 0.32 }}
                  style={{
                    padding: "16px 20px",
                    background: i % 2 === 0 ? "hsl(220 13% 6%)" : "hsl(220 13% 7%)",
                    border: `1px solid ${C.border}`,
                    borderLeft: `2px solid ${fc}`,
                    borderTopWidth: 0,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{f.name}</div>
                      <div style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.5 }}>{f.note}</div>
                    </div>
                    <div style={{ marginLeft: 16, textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: fc, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 2 }}>
                        {f.score}
                      </div>
                      <div style={{
                        fontSize: 7, fontWeight: 700, letterSpacing: "0.1em",
                        color: fc, border: `1px solid ${fc}33`,
                        padding: "1px 6px", background: `${fc}0d`,
                        textTransform: "uppercase",
                      }}>
                        {f.status}
                      </div>
                    </div>
                  </div>
                  {/* Weight + score bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.08em", textTransform: "uppercase", minWidth: 56 }}>
                      {f.weight}% weight
                    </span>
                    <div style={{ flex: 1, height: 3, background: "hsl(220 13% 11%)", position: "relative", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${f.score}%` }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: "easeOut" }}
                        style={{ height: "100%", background: fc, position: "absolute", top: 0, left: 0 }}
                      />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: fc, minWidth: 20, textAlign: "right" }}>{f.score}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contributing events */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.38 }}
          >
            <div style={{
              padding: "10px 20px",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderBottom: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
                Contributing Events
              </span>
              <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Recent 7 days
              </span>
            </div>
            {d.events.map((ev, i) => {
              const evColors: Record<Event["type"], string> = { critical: C.red, warning: "#f97316", info: C.blue, ok: C.green };
              const evCol = evColors[ev.type];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.26 + i * 0.06, duration: 0.32 }}
                  style={{
                    padding: "13px 20px",
                    background: i % 2 === 0 ? "hsl(220 13% 6%)" : "hsl(220 13% 7%)",
                    border: `1px solid ${C.border}`,
                    borderTopWidth: 0,
                    display: "flex", gap: 12, alignItems: "flex-start",
                  }}
                >
                  <EventDot type={ev.type} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{ev.title}</div>
                      <div style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.06em", marginLeft: 10, flexShrink: 0 }}>{ev.time}</div>
                    </div>
                    <div style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.55 }}>{ev.detail}</div>
                    <div style={{
                      marginTop: 5, display: "inline-block",
                      fontSize: 7, fontWeight: 700, letterSpacing: "0.12em",
                      color: evCol, border: `1px solid ${evCol}33`,
                      padding: "1px 6px", background: `${evCol}0d`, textTransform: "uppercase",
                    }}>
                      {ev.type}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Action items ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.38 }}
        >
          <div style={{
            padding: "10px 20px",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderBottom: "none",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
              Specific Action Items
            </span>
            <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {d.actions.length} recommended
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(d.actions.length, 3)}, 1fr)`, gap: 1 }}>
            {d.actions.map((a, i) => {
              const pc = priorityColors[a.priority];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 + i * 0.07, duration: 0.32 }}
                  style={{
                    padding: "20px 22px",
                    background: "hsl(220 13% 6%)",
                    border: `1px solid ${C.border}`,
                    borderTop: `2px solid ${pc}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em",
                      color: pc, border: `1px solid ${pc}33`,
                      padding: "2px 7px", background: `${pc}0d`, textTransform: "uppercase",
                    }}>
                      {a.priority}
                    </span>
                    <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.06em" }}>{a.owner}</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>
                    {a.action}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.65, marginBottom: 12 }}>
                    {a.rationale}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, padding: "6px 10px", background: "hsl(220 13% 9%)", border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 2 }}>Effort</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff" }}>{a.effort}</div>
                    </div>
                    <div style={{ flex: 1, padding: "6px 10px", background: "hsl(220 13% 9%)", border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 2 }}>Impact</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff" }}>{a.impact}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
