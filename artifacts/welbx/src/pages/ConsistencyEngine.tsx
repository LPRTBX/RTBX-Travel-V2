import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";

/* ─── Palette ─────────────────────────────────────────── */
const C = {
  amber:  "#c9a84c",
  blue:   "#3b82f6",
  green:  "#10b981",
  red:    "#ef4444",
  violet: "#a78bfa",
  cyan:   "#06b6d4",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 36%)",
  dimmed: "hsl(215 16% 22%)",
};

/* ─── Types ───────────────────────────────────────────── */
type Dimension = "Properties" | "Departments" | "Teams" | "Regions";

interface MetricScore {
  responseTime: number;
  recoverySuccess: number;
  communicationQuality: number;
  escalationPerformance: number;
  executionReliability: number;
}

interface Entity {
  id: string;
  name: string;
  scores: MetricScore;
  weekHistory: number[];
}

interface Driver {
  name: string;
  impact: "positive" | "negative" | "neutral";
  detail: string;
}

const METRICS: { key: keyof MetricScore; label: string; short: string }[] = [
  { key: "responseTime",           label: "Response Time",           short: "RESPONSE" },
  { key: "recoverySuccess",        label: "Recovery Success",         short: "RECOVERY" },
  { key: "communicationQuality",   label: "Communication Quality",    short: "COMMS" },
  { key: "escalationPerformance",  label: "Escalation Performance",   short: "ESCALATION" },
  { key: "executionReliability",   label: "Execution Reliability",    short: "EXECUTION" },
];

/* ─── Driver Templates per Metric ─────────────────────── */
const DRIVERS_HIGH: Record<keyof MetricScore, Driver[]> = {
  responseTime: [
    { name: "Avg acknowledgement time < 90s",  impact: "positive", detail: "93% of moments acknowledged within target window" },
    { name: "On-shift staffing coverage",       impact: "positive", detail: "Full coverage maintained across all critical hours" },
    { name: "Alert routing accuracy",           impact: "positive", detail: "98% of alerts delivered to correct responder first time" },
  ],
  recoverySuccess: [
    { name: "Playbook completion rate",         impact: "positive", detail: "91% of initiated playbooks completed without escalation" },
    { name: "Guest satisfaction post-incident", impact: "positive", detail: "Average recovery NPS of 8.4 following service failures" },
    { name: "Root cause documentation",         impact: "positive", detail: "82% of incidents have documented root cause within 24h" },
  ],
  communicationQuality: [
    { name: "Briefing completion rate",         impact: "positive", detail: "Pre-shift briefings completed on 96% of applicable shifts" },
    { name: "Message clarity index",            impact: "positive", detail: "Guest-facing communications score 4.6/5 for clarity" },
    { name: "Cross-team handover quality",      impact: "positive", detail: "94% of handovers rated complete by receiving team" },
  ],
  escalationPerformance: [
    { name: "Escalation decision accuracy",     impact: "positive", detail: "Managers agree with 89% of frontline escalation calls" },
    { name: "Time-to-escalate compliance",      impact: "positive", detail: "95% of escalations initiated within policy threshold" },
    { name: "Resolution authority matching",    impact: "positive", detail: "88% escalated to correct decision-maker first time" },
  ],
  executionReliability: [
    { name: "SOP adherence rate",               impact: "positive", detail: "97% task completion matches documented procedure" },
    { name: "Repeat incident rate",             impact: "positive", detail: "Only 4% of incident types recurring within 7 days" },
    { name: "Shift consistency score",          impact: "positive", detail: "Performance variance < 5pts between team members" },
  ],
};

const DRIVERS_MID: Record<keyof MetricScore, Driver[]> = {
  responseTime: [
    { name: "Avg acknowledgement time < 90s",  impact: "positive", detail: "78% of moments acknowledged within target window" },
    { name: "Radio coverage gaps · floors 3–5",impact: "negative",  detail: "Signal dead zones adding avg 40s to response on upper floors" },
    { name: "PM shift staffing shortfall",      impact: "negative",  detail: "15% understaffed on peak evening periods vs. forecast" },
  ],
  recoverySuccess: [
    { name: "Playbook initiation rate",         impact: "positive", detail: "Playbooks started on 84% of qualifying incidents" },
    { name: "Incomplete playbook closures",     impact: "negative",  detail: "22% of playbooks closed before all steps completed" },
    { name: "Guest follow-up gap",              impact: "negative",  detail: "Follow-up contact made in only 61% of recovery cases" },
  ],
  communicationQuality: [
    { name: "Briefing completion rate",         impact: "positive", detail: "Pre-shift briefings completed on 79% of applicable shifts" },
    { name: "Handover documentation gaps",      impact: "negative",  detail: "31% of shift handovers lack key context notes" },
    { name: "Message delivery failures",        impact: "neutral",   detail: "6% of scheduled communications undelivered or delayed" },
  ],
  escalationPerformance: [
    { name: "Time-to-escalate compliance",      impact: "positive", detail: "81% of escalations initiated within policy threshold" },
    { name: "Over-escalation rate",             impact: "negative",  detail: "18% of escalations handled below resolution authority" },
    { name: "Escalation feedback loop",         impact: "neutral",   detail: "Outcome data returned in 67% of escalated cases" },
  ],
  executionReliability: [
    { name: "SOP adherence rate",               impact: "positive", detail: "83% task completion matches documented procedure" },
    { name: "Informal workaround frequency",    impact: "negative",  detail: "14% of tasks completed via undocumented workarounds" },
    { name: "Repeat incident exposure",         impact: "neutral",   detail: "11% of incident types recurring within 7 days" },
  ],
};

const DRIVERS_LOW: Record<keyof MetricScore, Driver[]> = {
  responseTime: [
    { name: "Acknowledgement SLA breaches",     impact: "negative",  detail: "38% of moments exceed 90s acknowledgement target" },
    { name: "Staff coverage deficit · nights",  impact: "negative",  detail: "Night shift operating at 60% of optimal headcount" },
    { name: "Alert delivery failures",          impact: "negative",  detail: "12% of alerts not received by primary responder" },
  ],
  recoverySuccess: [
    { name: "Low playbook adoption",            impact: "negative",  detail: "Only 54% of qualifying incidents trigger a playbook" },
    { name: "No structured recovery process",   impact: "negative",  detail: "Guest recovery left to individual discretion in 46% of cases" },
    { name: "Repeat incidents unresolved",      impact: "neutral",   detail: "28% of incident types recurring within 7 days" },
  ],
  communicationQuality: [
    { name: "Briefing completion critical gap",  impact: "negative",  detail: "Pre-shift briefings missed on 41% of applicable shifts" },
    { name: "Guest comms inconsistency",        impact: "negative",  detail: "No standardised messaging for 5 of 12 common scenarios" },
    { name: "Handover failures",                impact: "negative",  detail: "52% of handovers rated incomplete by receiving team" },
  ],
  escalationPerformance: [
    { name: "Escalation policy non-compliance", impact: "negative",  detail: "Only 58% of escalations initiated within policy threshold" },
    { name: "Resolution mismatch rate",         impact: "negative",  detail: "34% escalated to wrong decision level first time" },
    { name: "Escalation avoidance pattern",     impact: "negative",  detail: "Managers flagging reluctance to escalate in 22% of cases" },
  ],
  executionReliability: [
    { name: "SOP adherence breakdown",          impact: "negative",  detail: "Only 61% task completion matches documented procedure" },
    { name: "High workaround frequency",        impact: "negative",  detail: "28% of tasks completed outside documented process" },
    { name: "Chronic repeat incidents",         impact: "negative",  detail: "23% of incident types recurring within 7 days without resolution" },
  ],
};

const RECOMMENDED_ACTIONS: Record<keyof MetricScore, string> = {
  responseTime:          "Audit radio coverage on problem floors and adjust staffing levels for PM/night shifts. Target: acknowledgement SLA above 85% within 30 days.",
  recoverySuccess:       "Mandate playbook initiation for all Tier 2+ incidents and introduce a 24h guest follow-up protocol. Review incomplete closure patterns in weekly ops meeting.",
  communicationQuality:  "Reinstate pre-shift briefing as a non-negotiable checkpoint. Create standardised messaging templates for the top 5 recurring guest scenarios.",
  escalationPerformance: "Run a 2-hour escalation calibration session with team leads. Clarify authority matrix and set up 30-day compliance monitoring.",
  executionReliability:  "Conduct a SOP audit to identify gaps driving workarounds. Prioritise the top 3 recurring incidents for root-cause playbook creation.",
};

/* ─── Mock Data ───────────────────────────────────────── */
const DATA: Record<Dimension, Entity[]> = {
  Properties: [
    { id: "P01", name: "The Grand Meridian London",   weekHistory: [86, 88, 89, 91, 92], scores: { responseTime: 94, recoverySuccess: 91, communicationQuality: 89, escalationPerformance: 88, executionReliability: 96 } },
    { id: "P02", name: "Meridian Edinburgh Castle",   weekHistory: [87, 86, 86, 85, 84], scores: { responseTime: 87, recoverySuccess: 84, communicationQuality: 82, escalationPerformance: 79, executionReliability: 88 } },
    { id: "P03", name: "Meridian Bath Spa",           weekHistory: [85, 86, 87, 88, 89], scores: { responseTime: 91, recoverySuccess: 88, communicationQuality: 93, escalationPerformance: 85, executionReliability: 90 } },
    { id: "P04", name: "Meridian Oxford Quad",        weekHistory: [74, 73, 71, 71, 70], scores: { responseTime: 72, recoverySuccess: 68, communicationQuality: 75, escalationPerformance: 64, executionReliability: 70 } },
    { id: "P05", name: "Meridian Bristol Harbourside",weekHistory: [77, 78, 79, 79, 80], scores: { responseTime: 78, recoverySuccess: 82, communicationQuality: 80, escalationPerformance: 77, executionReliability: 81 } },
    { id: "P06", name: "Meridian Manchester Central", weekHistory: [81, 80, 80, 81, 81], scores: { responseTime: 83, recoverySuccess: 79, communicationQuality: 77, escalationPerformance: 81, executionReliability: 85 } },
  ],
  Departments: [
    { id: "D01", name: "Front of House",     weekHistory: [84, 86, 87, 89, 90], scores: { responseTime: 92, recoverySuccess: 88, communicationQuality: 91, escalationPerformance: 86, executionReliability: 93 } },
    { id: "D02", name: "Housekeeping",       weekHistory: [82, 81, 80, 79, 78], scores: { responseTime: 76, recoverySuccess: 83, communicationQuality: 79, escalationPerformance: 72, executionReliability: 80 } },
    { id: "D03", name: "Food & Beverage",    weekHistory: [83, 84, 84, 85, 86], scores: { responseTime: 88, recoverySuccess: 85, communicationQuality: 87, escalationPerformance: 83, executionReliability: 89 } },
    { id: "D04", name: "Engineering",        weekHistory: [72, 73, 72, 71, 71], scores: { responseTime: 69, recoverySuccess: 74, communicationQuality: 65, escalationPerformance: 70, executionReliability: 77 } },
    { id: "D05", name: "Concierge",          weekHistory: [92, 93, 93, 94, 95], scores: { responseTime: 96, recoverySuccess: 94, communicationQuality: 97, escalationPerformance: 91, executionReliability: 95 } },
    { id: "D06", name: "Wellness & Spa",     weekHistory: [87, 87, 88, 88, 88], scores: { responseTime: 90, recoverySuccess: 87, communicationQuality: 92, escalationPerformance: 84, executionReliability: 88 } },
    { id: "D07", name: "Security",           weekHistory: [83, 83, 82, 81, 81], scores: { responseTime: 82, recoverySuccess: 78, communicationQuality: 71, escalationPerformance: 88, executionReliability: 84 } },
  ],
  Teams: [
    { id: "T01", name: "AM Shift · FOH",          weekHistory: [90, 91, 91, 92, 93], scores: { responseTime: 95, recoverySuccess: 92, communicationQuality: 94, escalationPerformance: 90, executionReliability: 96 } },
    { id: "T02", name: "PM Shift · FOH",           weekHistory: [85, 85, 86, 87, 87], scores: { responseTime: 88, recoverySuccess: 85, communicationQuality: 89, escalationPerformance: 83, executionReliability: 90 } },
    { id: "T03", name: "Night Shift · FOH",        weekHistory: [78, 77, 76, 75, 74], scores: { responseTime: 74, recoverySuccess: 71, communicationQuality: 68, escalationPerformance: 76, executionReliability: 79 } },
    { id: "T04", name: "AM Shift · Housekeeping",  weekHistory: [79, 80, 80, 81, 81], scores: { responseTime: 80, recoverySuccess: 86, communicationQuality: 82, escalationPerformance: 74, executionReliability: 83 } },
    { id: "T05", name: "PM Shift · Housekeeping",  weekHistory: [75, 75, 74, 73, 73], scores: { responseTime: 71, recoverySuccess: 78, communicationQuality: 73, escalationPerformance: 67, executionReliability: 75 } },
    { id: "T06", name: "Banqueting Team",          weekHistory: [81, 82, 82, 83, 84], scores: { responseTime: 84, recoverySuccess: 81, communicationQuality: 86, escalationPerformance: 79, executionReliability: 88 } },
    { id: "T07", name: "VIP Services Team",        weekHistory: [93, 94, 94, 95, 96], scores: { responseTime: 97, recoverySuccess: 95, communicationQuality: 96, escalationPerformance: 93, executionReliability: 97 } },
  ],
  Regions: [
    { id: "R01", name: "London & South East", weekHistory: [87, 88, 89, 90, 91], scores: { responseTime: 93, recoverySuccess: 90, communicationQuality: 91, escalationPerformance: 87, executionReliability: 94 } },
    { id: "R02", name: "Scotland & North",    weekHistory: [84, 84, 83, 82, 82], scores: { responseTime: 85, recoverySuccess: 82, communicationQuality: 80, escalationPerformance: 78, executionReliability: 86 } },
    { id: "R03", name: "Midlands",            weekHistory: [79, 79, 78, 78, 78], scores: { responseTime: 80, recoverySuccess: 76, communicationQuality: 79, escalationPerformance: 74, executionReliability: 82 } },
    { id: "R04", name: "West of England",     weekHistory: [83, 84, 84, 85, 86], scores: { responseTime: 88, recoverySuccess: 86, communicationQuality: 89, escalationPerformance: 82, executionReliability: 87 } },
    { id: "R05", name: "North West",          weekHistory: [79, 79, 80, 80, 80], scores: { responseTime: 82, recoverySuccess: 79, communicationQuality: 77, escalationPerformance: 80, executionReliability: 84 } },
  ],
};

/* ─── Mini Sparkline ─────────────────────────────────── */
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const W = 54, H = 18;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - 2 - ((v - min) / range) * (H - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.85}
      />
      <circle
        cx={(data.length - 1) / (data.length - 1) * W}
        cy={H - 2 - ((data[data.length - 1] - min) / range) * (H - 4)}
        r={2}
        fill={color}
      />
    </svg>
  );
}

/* ─── Helpers ─────────────────────────────────────────── */
function avg(scores: MetricScore): number {
  const vals = Object.values(scores);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function scoreColor(v: number): string {
  if (v >= 90) return C.green;
  if (v >= 80) return C.cyan;
  if (v >= 70) return C.amber;
  return C.red;
}

function metricSpread(entities: Entity[], key: keyof MetricScore): number {
  const vals = entities.map((e) => e.scores[key]);
  return Math.max(...vals) - Math.min(...vals);
}

function getDriversForScore(key: keyof MetricScore, score: number): Driver[] {
  if (score >= 88) return DRIVERS_HIGH[key];
  if (score >= 73) return DRIVERS_MID[key];
  return DRIVERS_LOW[key];
}

function lowestMetric(scores: MetricScore): keyof MetricScore {
  return (Object.entries(scores) as [keyof MetricScore, number][])
    .sort((a, b) => a[1] - b[1])[0][0];
}

/* ─── Drill-Down Panel ────────────────────────────────── */
function DrillDownPanel({ entity, onClose }: { entity: Entity; onClose: () => void }) {
  const overallScore = avg(entity.scores);
  const overallColor = scoreColor(overallScore);
  const worstKey    = lowestMetric(entity.scores);
  const worstMetric = METRICS.find((m) => m.key === worstKey)!;

  const impactColor = (impact: Driver["impact"]) =>
    impact === "positive" ? C.green : impact === "negative" ? C.red : C.amber;
  const impactIcon = (impact: Driver["impact"]) =>
    impact === "positive" ? "▲" : impact === "negative" ? "▼" : "–";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 40,
        }}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 38 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: 440,
          background: "hsl(220 13% 6%)",
          borderLeft: `1px solid hsl(220 13% 10%)`,
          zIndex: 50,
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* ── Panel header ── */}
        <div style={{
          padding: "22px 24px 18px",
          borderBottom: `1px solid ${C.border}`,
          background: "hsl(220 13% 7%)",
          position: "sticky", top: 0, zIndex: 1,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{
                fontSize: 7.5, fontWeight: 700, letterSpacing: "0.2em",
                color: C.amber, textTransform: "uppercase", marginBottom: 7,
              }}>
                Score Drivers
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 3 }}>
                {entity.name}
              </div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, fontFamily: "var(--app-font-mono)" }}>
                {entity.id}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: overallColor, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {overallScore}
                </div>
                <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginTop: 3 }}>
                  Overall
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "hsl(220 13% 11%)",
                  border: `1px solid ${C.border}`,
                  color: C.muted, cursor: "pointer",
                  width: 28, height: 28, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 14, marginTop: 2,
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* ── Per-metric drivers ── */}
        <div style={{ padding: "20px 24px", flex: 1 }}>
          <div style={{
            fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em",
            color: C.dimmed, textTransform: "uppercase", marginBottom: 16,
          }}>
            Contributing Factors by Metric
          </div>

          {METRICS.map((m, mi) => {
            const score   = entity.scores[m.key];
            const color   = scoreColor(score);
            const drivers = getDriversForScore(m.key, score);
            const isWorst = m.key === worstKey;

            return (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + mi * 0.07, duration: 0.28 }}
                style={{
                  marginBottom: 18,
                  border: `1px solid ${isWorst ? C.red + "44" : C.border}`,
                  background: isWorst ? `${C.red}06` : "hsl(220 13% 8%)",
                }}
              >
                {/* Metric header */}
                <div style={{
                  padding: "12px 14px 10px",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: isWorst ? `${C.red}08` : "hsl(220 13% 9%)",
                  borderTop: `2px solid ${color}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>
                      {m.label}
                    </span>
                    {isWorst && (
                      <span style={{
                        fontSize: 7, fontWeight: 700, letterSpacing: "0.12em",
                        color: C.red, border: `1px solid ${C.red}44`,
                        padding: "2px 5px", textTransform: "uppercase",
                      }}>
                        Lowest
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: "-0.02em" }}>
                    {score}
                  </span>
                </div>

                {/* Drivers list */}
                <div style={{ padding: "4px 0" }}>
                  {drivers.map((driver, di) => (
                    <div
                      key={di}
                      style={{
                        padding: "10px 14px",
                        borderBottom: di < drivers.length - 1 ? `1px solid hsl(220 13% 10%)` : "none",
                        display: "flex", alignItems: "flex-start", gap: 10,
                      }}
                    >
                      <span style={{
                        fontSize: 9, fontWeight: 800, color: impactColor(driver.impact),
                        flexShrink: 0, marginTop: 1, lineHeight: 1.6,
                      }}>
                        {impactIcon(driver.impact)}
                      </span>
                      <div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", marginBottom: 3, lineHeight: 1.35 }}>
                          {driver.name}
                        </div>
                        <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.45 }}>
                          {driver.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* ── Recommended Action ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.3 }}
            style={{
              marginTop: 8,
              border: `1px solid ${C.amber}33`,
              background: `${C.amber}08`,
              borderTop: `2px solid ${C.amber}`,
              padding: "16px 18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.amber, flexShrink: 0 }} />
              <span style={{
                fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em",
                color: C.amber, textTransform: "uppercase",
              }}>
                Recommended Action · {worstMetric.label}
              </span>
            </div>
            <p style={{
              fontSize: 11, fontWeight: 600, color: "hsl(215 16% 68%)",
              lineHeight: 1.6, margin: 0,
            }}>
              {RECOMMENDED_ACTIONS[worstKey]}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Score Cell ─────────────────────────────────────── */
function ScoreCell({ value }: { value: number }) {
  const color = scoreColor(value);
  return (
    <div style={{
      padding: "10px 14px",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 5, minWidth: 72,
    }}>
      <span style={{ fontSize: 15, fontWeight: 800, color, letterSpacing: "-0.01em", lineHeight: 1 }}>
        {value}
      </span>
      <div style={{ width: 36, height: 2, background: "hsl(220 13% 11%)", position: "relative" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ height: "100%", background: color, position: "absolute", left: 0, top: 0 }}
        />
      </div>
    </div>
  );
}

/* ─── Metrics Grid ────────────────────────────────────── */
function MetricsGrid({
  entities,
  onSelectEntity,
}: {
  entities: Entity[];
  onSelectEntity: (entity: Entity) => void;
}) {
  const sorted = [...entities].sort((a, b) => avg(b.scores) - avg(a.scores));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ overflowX: "auto", marginBottom: 28 }}
    >
      <div style={{
        border: `1px solid ${C.border}`,
        background: C.card,
        minWidth: 700,
      }}>
        {/* Header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "240px repeat(5, 1fr) 80px 100px",
          borderBottom: `1px solid ${C.border}`,
          background: "hsl(220 13% 6%)",
        }}>
          <div style={{ padding: "12px 18px" }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>
              Entity
            </span>
          </div>
          {METRICS.map((m) => (
            <div key={m.key} style={{ padding: "12px 14px", borderLeft: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>
                {m.short}
              </div>
            </div>
          ))}
          <div style={{ padding: "12px 14px", borderLeft: `1px solid ${C.border}`, textAlign: "center" }}>
            <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>
              OVERALL
            </span>
          </div>
          <div style={{ padding: "12px 14px", borderLeft: `1px solid ${C.border}`, textAlign: "center" }}>
            <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>
              W·O·W
            </span>
          </div>
        </div>

        {/* Entity rows */}
        {sorted.map((entity, i) => {
          const overall = avg(entity.scores);
          const overallColor = scoreColor(overall);
          const isTop    = i === 0;
          const isBottom = i === sorted.length - 1;
          const wowDelta = entity.weekHistory[entity.weekHistory.length - 1] - entity.weekHistory[entity.weekHistory.length - 2];
          const wowColor = wowDelta > 0 ? C.green : wowDelta < 0 ? C.red : C.muted;
          const wowArrow = wowDelta > 0 ? "▲" : wowDelta < 0 ? "▼" : "─";
          const wowLabel = wowDelta > 0 ? `+${wowDelta}` : wowDelta < 0 ? `${wowDelta}` : "0";
          return (
            <motion.div
              key={entity.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.28 }}
              onClick={() => onSelectEntity(entity)}
              style={{
                display: "grid",
                gridTemplateColumns: "240px repeat(5, 1fr) 80px 100px",
                borderBottom: i < sorted.length - 1 ? `1px solid ${C.border}` : "none",
                background: isTop ? `${C.green}08` : isBottom ? `${C.red}06` : "transparent",
                borderLeft: isTop ? `2px solid ${C.green}` : isBottom ? `2px solid ${C.red}` : `2px solid transparent`,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              whileHover={{ background: "hsl(220 13% 10%)" } as never}
            >
              <div style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.01em", marginBottom: 2 }}>
                    {entity.name}
                  </div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, fontFamily: "var(--app-font-mono)", display: "flex", alignItems: "center", gap: 6 }}>
                    {entity.id}
                    {isTop    && <span style={{ color: C.green }}>▲ BEST</span>}
                    {isBottom && <span style={{ color: C.red   }}>▼ LOWEST</span>}
                  </div>
                </div>
                <span style={{
                  fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em",
                  color: C.dimmed, textTransform: "uppercase",
                  border: `1px solid hsl(220 13% 14%)`,
                  padding: "2px 6px",
                  background: "hsl(220 13% 9%)",
                  whiteSpace: "nowrap" as const,
                }}>
                  Drill in →
                </span>
              </div>
              {METRICS.map((m) => (
                <div key={m.key} style={{ borderLeft: `1px solid ${C.border}` }}>
                  <ScoreCell value={entity.scores[m.key]} />
                </div>
              ))}
              <div style={{ borderLeft: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: overallColor, letterSpacing: "-0.02em" }}>
                  {overall}
                </span>
              </div>
              <div style={{
                borderLeft: `1px solid ${C.border}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 5, padding: "8px 10px",
              }}>
                <MiniSparkline data={entity.weekHistory} color={wowColor} />
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: wowColor, letterSpacing: "0.01em" }}>
                    {wowArrow}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: wowColor, letterSpacing: "0.02em", fontFamily: "var(--app-font-mono)" }}>
                    {wowLabel}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Summary Panels ──────────────────────────────────── */
function SummaryPanels({ entities }: { entities: Entity[] }) {
  const sorted = [...entities].sort((a, b) => avg(b.scores) - avg(a.scores));
  const best   = sorted.slice(0, Math.min(3, sorted.length));
  const worst  = sorted.slice(-Math.min(3, sorted.length)).reverse();

  const variabilityMetrics = METRICS.map((m) => ({
    ...m,
    spread: metricSpread(entities, m.key),
    maxEntity: entities.reduce((best, e) => e.scores[m.key] > best.scores[m.key] ? e : best, entities[0]),
    minEntity: entities.reduce((worst, e) => e.scores[m.key] < worst.scores[m.key] ? e : worst, entities[0]),
  })).sort((a, b) => b.spread - a.spread);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, marginBottom: 40 }}>

      {/* Best Performing */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderTop: `2px solid ${C.green}`,
          padding: "20px 22px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
          <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: C.green, textTransform: "uppercase" }}>
            Best Performing Areas
          </span>
        </div>
        {best.map((e, i) => (
          <div key={e.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0",
            borderBottom: i < best.length - 1 ? `1px solid hsl(220 13% 9%)` : "none",
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{e.name}</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase" }}>
                Avg score across 5 metrics
              </div>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.green, letterSpacing: "-0.02em", flexShrink: 0, marginLeft: 12 }}>
              {avg(e.scores)}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Lowest Performing */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.35 }}
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderTop: `2px solid ${C.red}`,
          padding: "20px 22px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.red }} />
          <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: C.red, textTransform: "uppercase" }}>
            Lowest Performing Areas
          </span>
        </div>
        {worst.map((e, i) => (
          <div key={e.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0",
            borderBottom: i < worst.length - 1 ? `1px solid hsl(220 13% 9%)` : "none",
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{e.name}</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase" }}>
                Priority improvement area
              </div>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.red, letterSpacing: "-0.02em", flexShrink: 0, marginLeft: 12 }}>
              {avg(e.scores)}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Sources of Variability */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.29, duration: 0.35 }}
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderTop: `2px solid ${C.amber}`,
          padding: "20px 22px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.amber }} />
          <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: C.amber, textTransform: "uppercase" }}>
            Sources of Variability
          </span>
        </div>
        {variabilityMetrics.map((m, i) => (
          <div key={m.key} style={{
            padding: "10px 0",
            borderBottom: i < variabilityMetrics.length - 1 ? `1px solid hsl(220 13% 9%)` : "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#fff" }}>{m.label}</span>
              <span style={{
                fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em",
                color: m.spread >= 20 ? C.red : m.spread >= 12 ? C.amber : C.green,
              }}>
                ±{m.spread} pt spread
              </span>
            </div>
            <div style={{ width: "100%", height: 3, background: "hsl(220 13% 11%)", position: "relative", marginBottom: 5 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(m.spread * 2.5, 100)}%` }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.3 + i * 0.07 }}
                style={{
                  height: "100%",
                  background: m.spread >= 20 ? C.red : m.spread >= 12 ? C.amber : C.green,
                  position: "absolute", left: 0, top: 0,
                }}
              />
            </div>
            <div style={{ fontSize: 8.5, color: C.dimmed, letterSpacing: "0.02em" }}>
              High: <span style={{ color: C.green }}>{m.maxEntity.name.split(" ")[0]}</span>
              {" · "}
              Low: <span style={{ color: C.red }}>{m.minEntity.name.split(" ")[0]}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Radar Chart View ───────────────────────────────────── */
const ENTITY_COLORS = [
  "#10b981", "#3b82f6", "#c9a84c", "#a78bfa",
  "#ef4444", "#06b6d4", "#f97316",
];

function RadarChartView({ entities }: { entities: Entity[] }) {
  const radarData = METRICS.map((m) => {
    const point: Record<string, string | number> = { metric: m.label };
    entities.forEach((e) => { point[e.id] = e.scores[m.key]; });
    return point;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        background: C.card, border: `1px solid ${C.border}`,
        padding: "32px 24px 24px", marginBottom: 28,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: C.amber, textTransform: "uppercase", marginBottom: 6 }}>
            Shape Overview
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(215 16% 48%)", letterSpacing: "0.02em" }}>
            All five consistency dimensions overlaid per entity — wider coverage = stronger execution shape.
          </div>
        </div>
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", textAlign: "right" }}>
          {entities.length} entities · 5 dimensions
        </div>
      </div>

      <ResponsiveContainer width="100%" height={460}>
        <RadarChart cx="50%" cy="50%" outerRadius={160} data={radarData}>
          <PolarGrid stroke="hsl(220 13% 12%)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "hsl(215 16% 52%)", fontSize: 10, fontWeight: 700, letterSpacing: "0.04em" }}
          />
          <PolarRadiusAxis
            domain={[50, 100]}
            tickCount={4}
            tick={{ fill: "hsl(215 16% 28%)", fontSize: 8 }}
            stroke="hsl(220 13% 12%)"
            axisLine={false}
          />
          {entities.map((e, i) => (
            <Radar
              key={e.id}
              name={e.name}
              dataKey={e.id}
              stroke={ENTITY_COLORS[i % ENTITY_COLORS.length]}
              fill={ENTITY_COLORS[i % ENTITY_COLORS.length]}
              fillOpacity={0.07}
              strokeWidth={2}
              dot={{ r: 3, fill: ENTITY_COLORS[i % ENTITY_COLORS.length], strokeWidth: 0 }}
            />
          ))}
          <Tooltip
            contentStyle={{
              background: "hsl(220 13% 8%)",
              border: `1px solid hsl(220 13% 14%)`,
              borderRadius: 0,
              fontSize: 11,
              color: "#fff",
              padding: "10px 14px",
            }}
            labelStyle={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.amber, textTransform: "uppercase", marginBottom: 6 }}
            formatter={(value: number, name: string) => {
              const entity = entities.find(e => e.id === name);
              return [
                <span style={{ color: scoreColor(value), fontWeight: 700 }}>{value}</span>,
                entity?.name ?? name,
              ];
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "10px 20px",
        marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}`,
      }}>
        {entities.map((e, i) => {
          const color = ENTITY_COLORS[i % ENTITY_COLORS.length];
          const overall = avg(e.scores);
          return (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>
                {e.name}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 800, color: scoreColor(overall),
                border: `1px solid ${scoreColor(overall)}33`,
                padding: "1px 5px",
                background: `${scoreColor(overall)}0a`,
              }}>
                {overall}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Page ─────────────────────────────────────────────── */
const DIMENSIONS: Dimension[] = ["Properties", "Departments", "Teams", "Regions"];

export default function ConsistencyEngine() {
  const [activeDimension, setActiveDimension] = useState<Dimension>("Properties");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [selectedEntity, setSelectedEntity]   = useState<Entity | null>(null);

  const entities = DATA[activeDimension];

  const overallAvg = Math.round(
    entities.reduce((sum, e) => sum + avg(e.scores), 0) / entities.length
  );

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Variability Intelligence
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Consistency Engine
            </h1>
            <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(215 16% 55%)", margin: 0, letterSpacing: "0.04em", fontStyle: "italic" }}>
              Consistency Creates Performance.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(overallAvg), letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>
              {overallAvg}
            </div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>
              Portfolio Avg · {activeDimension}
            </div>
          </div>
        </motion.div>

        {/* ── Summary metric strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 28 }}
        >
          {METRICS.map((m, i) => {
            const vals = entities.map((e) => e.scores[m.key]);
            const metricAvg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
            const spread = Math.max(...vals) - Math.min(...vals);
            return (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                style={{
                  padding: "18px 20px",
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderTop: `2px solid ${scoreColor(metricAvg)}`,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 6 }}>
                  {metricAvg}
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 5 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase" }}>
                  ±{spread} pt range
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Dimension selector + View toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.32 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 0 }}
        >
          <div style={{ display: "flex", gap: 1 }}>
            {DIMENSIONS.map((dim) => {
              const isActive = activeDimension === dim;
              return (
                <button
                  key={dim}
                  onClick={() => { setActiveDimension(dim); setSelectedEntity(null); }}
                  style={{
                    padding: "10px 20px",
                    background: isActive ? "hsl(220 13% 9%)" : "transparent",
                    border: `1px solid ${isActive ? C.amber + "44" : "hsl(220 13% 10%)"}`,
                    borderBottom: isActive ? "1px solid hsl(220 13% 9%)" : "1px solid hsl(220 13% 10%)",
                    borderTop: isActive ? `2px solid ${C.amber}` : "2px solid transparent",
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: isActive ? "#fff" : "hsl(215 16% 36%)" }}>
                    {dim}
                  </span>
                  <span style={{
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                    color: isActive ? C.amber : C.dimmed,
                    border: `1px solid ${isActive ? C.amber + "33" : "transparent"}`,
                    padding: "1px 5px",
                    background: isActive ? `${C.amber}0d` : "transparent",
                  }}>
                    {DATA[dim].length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View mode toggle */}
          <div style={{ display: "flex", gap: 1, marginBottom: 1 }}>
            {(["table", "chart"] as const).map((mode) => {
              const isActive = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: "8px 16px",
                    background: isActive ? "hsl(220 13% 9%)" : "transparent",
                    border: `1px solid ${isActive ? "hsl(220 13% 16%)" : "hsl(220 13% 10%)"}`,
                    borderTop: isActive ? `2px solid ${C.amber}` : "2px solid transparent",
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isActive ? "#fff" : "hsl(215 16% 36%)" }}>
                    {mode === "table" ? "⊞ Table" : "◎ Chart"}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <div style={{
          height: 1, background: C.border,
          marginBottom: 24, marginTop: 0,
          border: `1px solid ${C.border}`,
        }} />

        {/* ── Metrics grid / Radar chart ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeDimension}-${viewMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === "chart" ? (
              <RadarChartView entities={entities} />
            ) : (
              <>
                <MetricsGrid entities={entities} onSelectEntity={setSelectedEntity} />
                <SummaryPanels entities={entities} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Score legend ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          style={{
            display: "flex", gap: 20, alignItems: "center",
            padding: "12px 18px",
            background: C.card,
            border: `1px solid ${C.border}`,
          }}
        >
          <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>
            Score Legend
          </span>
          {[
            { label: "Excellent", range: "90–100", color: C.green },
            { label: "Good",      range: "80–89",  color: C.cyan  },
            { label: "Attention", range: "70–79",  color: C.amber },
            { label: "Critical",  range: "< 70",   color: C.red   },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: 8.5, color: C.muted, letterSpacing: "0.04em" }}>
                {l.label}
              </span>
              <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.04em" }}>
                {l.range}
              </span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 8.5, color: C.dimmed, letterSpacing: "0.04em" }}>
            Click any row to see score drivers
          </div>
        </motion.div>

      </div>

      {/* ── Drill-down panel ── */}
      <AnimatePresence>
        {selectedEntity && (
          <DrillDownPanel
            key={selectedEntity.id}
            entity={selectedEntity}
            onClose={() => setSelectedEntity(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
