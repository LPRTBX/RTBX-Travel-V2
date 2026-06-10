import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { SEEDED_MOMENTS } from "@/data/moments";
import { PLAYBOOKS } from "@/data/playbooks";
import { SIGNAL_CATEGORIES } from "@/data/signals";
import { useCc } from "@/context/CcContext";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
  LineChart, Line, CartesianGrid,
} from "recharts";

/* ─── Palette ────────────────────────────────────────────── */
const C = {
  amber:   "#c9a84c",
  emerald: "#10b981",
  crimson: "#ef4444",
  blue:    "#3b82f6",
  violet:  "#a78bfa",
  border:  "hsl(220 13% 9%)",
  card:    "hsl(220 13% 7%)",
  bg:      "hsl(220 13% 5%)",
  muted:   "hsl(215 16% 36%)",
  dimmed:  "hsl(215 16% 22%)",
};

/* ─── Period config ──────────────────────────────────────── */
type PeriodKey = "7d" | "30d" | "90d";

const PERIOD_CONFIG: Record<PeriodKey, {
  label: string;
  window: string;
  xLabels: string[];
}> = {
  "7d": {
    label: "7 Days",
    window: "4 Jun – 10 Jun 2026 · 7-day trailing window",
    xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  "30d": {
    label: "30 Days",
    window: "11 May – 10 Jun 2026 · 30-day trailing window",
    xLabels: ["W1", "W2", "W3", "W4", "W5", "W6"],
  },
  "90d": {
    label: "90 Days",
    window: "Jan – Jun 2026 · 90-day trailing window",
    xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
};

/* ─── Static mock data for 7d / 30d ─────────────────────── */
interface MetricData {
  id: string;
  label: string;
  score: number;
  trend: number[];
  delta: string;
  description: string;
}

const METRIC_DESCRIPTIONS: Record<string, string> = {
  visibility:   "Breadth and depth of real-time behavioural sensing across all guest and operational touchpoints.",
  decision:     "Accuracy and confidence of automated routing decisions against subsequent outcome data.",
  consistency:  "Percentage of moments resolved using the correct playbook action within the response window.",
  recovery:     "Success rate of service recovery interventions measured against guest sentiment shift post-action.",
  activation:   "Rate of staff-activation moments completed within the prescribed execution window.",
};

const PERIOD_DATA: Record<"7d" | "30d", {
  metrics: MetricData[];
  overall: number;
  overallDelta: string;
  insight: { leading: { name: string; score: number }; lever: { name: string; score: number } };
}> = {
  "7d": {
    overall: 79,
    overallDelta: "+2",
    insight: {
      leading: { name: "Response Consistency", score: 86 },
      lever:   { name: "Recovery Performance", score: 66 },
    },
    metrics: [
      { id: "visibility",  label: "Visibility Score",     score: 83, trend: [79, 80, 80, 82, 81, 83, 83], delta: "+4 pts", description: METRIC_DESCRIPTIONS.visibility },
      { id: "decision",    label: "Decision Quality",     score: 77, trend: [74, 75, 74, 76, 76, 77, 77], delta: "+3 pts", description: METRIC_DESCRIPTIONS.decision },
      { id: "consistency", label: "Response Consistency", score: 86, trend: [82, 83, 83, 84, 85, 85, 86], delta: "+4 pts", description: METRIC_DESCRIPTIONS.consistency },
      { id: "recovery",    label: "Recovery Performance", score: 66, trend: [62, 63, 64, 63, 65, 65, 66], delta: "+4 pts", description: METRIC_DESCRIPTIONS.recovery },
      { id: "activation",  label: "Activation Success",  score: 80, trend: [76, 77, 77, 78, 79, 79, 80], delta: "+4 pts", description: METRIC_DESCRIPTIONS.activation },
    ],
  },
  "30d": {
    overall: 82,
    overallDelta: "+2",
    insight: {
      leading: { name: "Response Consistency", score: 89 },
      lever:   { name: "Recovery Performance", score: 71 },
    },
    metrics: [
      { id: "visibility",  label: "Visibility Score",     score: 86, trend: [81, 82, 83, 84, 85, 86], delta: "+5 pts", description: METRIC_DESCRIPTIONS.visibility },
      { id: "decision",    label: "Decision Quality",     score: 80, trend: [75, 76, 77, 78, 79, 80], delta: "+5 pts", description: METRIC_DESCRIPTIONS.decision },
      { id: "consistency", label: "Response Consistency", score: 89, trend: [84, 85, 86, 87, 88, 89], delta: "+5 pts", description: METRIC_DESCRIPTIONS.consistency },
      { id: "recovery",    label: "Recovery Performance", score: 71, trend: [66, 67, 68, 69, 70, 71], delta: "+5 pts", description: METRIC_DESCRIPTIONS.recovery },
      { id: "activation",  label: "Activation Success",  score: 82, trend: [77, 78, 79, 80, 81, 82], delta: "+5 pts", description: METRIC_DESCRIPTIONS.activation },
    ],
  },
};

/* ─── Score colour helper ────────────────────────────────── */
function scoreColor(s: number) {
  if (s >= 80) return C.emerald;
  if (s >= 60) return C.amber;
  return C.crimson;
}

/* ─── Live metric types (90d) ────────────────────────────── */
interface MetricSource {
  label: string;
  link: string;
  summary: string;
}

interface Metric extends MetricData {
  trendDir?: "up" | "down";
  source?: MetricSource;
}

const PERIODS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

/* ─── 12-week history data ───────────────────────────────── */
const HISTORY_LINE_COLORS = {
  overall:     "#c9a84c",
  consistency: "#10b981",
  visibility:  "#60a5fa",
  activation:  "#a78bfa",
  decision:    "#38bdf8",
  recovery:    "#ef4444",
};

const HISTORY_DATA = [
  { week: "25 Mar", overall: 68, visibility: 68, decision: 62, consistency: 68, recovery: 55, activation: 62 },
  { week: "1 Apr",  overall: 70, visibility: 70, decision: 63, consistency: 70, recovery: 57, activation: 64 },
  { week: "8 Apr",  overall: 71, visibility: 73, decision: 65, consistency: 73, recovery: 59, activation: 66 },
  { week: "15 Apr", overall: 73, visibility: 75, decision: 67, consistency: 76, recovery: 62, activation: 68 },
  { week: "22 Apr", overall: 75, visibility: 77, decision: 70, consistency: 79, recovery: 64, activation: 71 },
  { week: "29 Apr", overall: 76, visibility: 79, decision: 72, consistency: 82, recovery: 66, activation: 73 },
  { week: "6 May",  overall: 78, visibility: 81, decision: 74, consistency: 84, recovery: 68, activation: 75 },
  { week: "13 May", overall: 79, visibility: 83, decision: 76, consistency: 86, recovery: 70, activation: 78 },
  { week: "20 May", overall: 81, visibility: 85, decision: 78, consistency: 88, recovery: 72, activation: 80 },
  { week: "27 May", overall: 82, visibility: 86, decision: 79, consistency: 89, recovery: 73, activation: 82 },
  { week: "3 Jun",  overall: 83, visibility: 87, decision: 81, consistency: 90, recovery: 75, activation: 83 },
  { week: "10 Jun", overall: 84, visibility: 88, decision: 82, consistency: 91, recovery: 76, activation: 84 },
];

/* ─── Improvement action copy ────────────────────────────── */
const IMPROVEMENT_ACTION: Record<string, string> = {
  activation: "Review Command Centre handoff cadence. ROUTED signals need faster escalation to increase activation completion rate.",
  recovery:   "Expand service-recovery playbook coverage for rooms 4–6. Current resolution pathway lacks fallback escalation branch.",
  decision:   "Increase training signal volume for mid-tier loyalty moments. Decision confidence sits below threshold for edge-case routing.",
  visibility: "Resolve EMERGING signals across strategic and commercial categories to improve active sensing breadth.",
  consistency:"Review activation cadence for weekend arrival surges. Staffing alignment with moment triggers needs recalibration.",
};

/* ─── Animated count-up ──────────────────────────────────── */
function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    setVal(0);
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return <>{val}</>;
}

/* ─── Custom tooltip ─────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "hsl(220 13% 10%)", border: "1px solid hsl(220 13% 16%)",
      padding: "7px 11px", fontSize: 11, color: "#fff",
    }}>
      <div style={{ color: C.muted, marginBottom: 3, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{payload[0].value}</div>
    </div>
  );
}

/* ─── History multi-line tooltip ─────────────────────────── */
const HISTORY_LABELS: Record<string, string> = {
  overall:     "Overall",
  consistency: "Consistency",
  visibility:  "Visibility",
  activation:  "Activation",
  decision:    "Decision",
  recovery:    "Recovery",
};

function HistoryTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].sort((a, b) => b.value - a.value);
  return (
    <div style={{
      background: "hsl(220 13% 10%)", border: "1px solid hsl(220 13% 16%)",
      padding: "9px 13px", fontSize: 10, color: "#fff", minWidth: 148,
    }}>
      <div style={{ color: C.muted, marginBottom: 7, fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
        {label}
      </div>
      {sorted.map((entry: any) => (
        <div key={entry.dataKey} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 4, gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: entry.dataKey === "overall" ? 14 : 8, height: 2, background: entry.color, flexShrink: 0 }} />
            <span style={{
              fontSize: 8.5, letterSpacing: "0.06em",
              color: entry.dataKey === "overall" ? "#fff" : C.muted,
              fontWeight: entry.dataKey === "overall" ? 700 : 400,
            }}>
              {HISTORY_LABELS[entry.dataKey]}
            </span>
          </div>
          <span style={{ fontWeight: entry.dataKey === "overall" ? 800 : 600, color: entry.color, fontSize: 11 }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Metric score card ──────────────────────────────────── */
function MetricCard({
  m, xLabels, delay, onNavigate,
}: {
  m: Metric;
  xLabels: string[];
  delay: number;
  onNavigate?: (link: string) => void;
}) {
  const color = scoreColor(m.score);
  const chartData = m.trend.map((v, i) => ({ p: xLabels[i] ?? i, v }));

  return (
    <motion.div
      key={m.id + m.score}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.32 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${color}`,
        padding: "20px 20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase", marginBottom: 10 }}>
        {m.label}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
        <div style={{ fontSize: 42, fontWeight: 900, color, letterSpacing: "-0.03em", lineHeight: 1 }}>
          {m.score}
          <span style={{ fontSize: 14, fontWeight: 600, color: C.muted, marginLeft: 2 }}>/100</span>
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700,
          color: C.emerald,
          padding: "3px 8px",
          background: `${C.emerald}12`,
          border: `1px solid ${C.emerald}30`,
          marginBottom: 2,
        }}>
          ↑ {m.delta}
        </div>
      </div>

      <div style={{ height: 3, background: "hsl(220 13% 11%)", marginBottom: 14 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${m.score}%` }}
          transition={{ delay: delay + 0.15, duration: 0.6, ease: "easeOut" }}
          style={{ height: "100%", background: color }}
        />
      </div>

      <div style={{ height: 56, marginBottom: 12 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="p" tick={{ fontSize: 7, fill: C.dimmed, fontFamily: "inherit" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone" dataKey="v"
              stroke={color} strokeWidth={1.5}
              fill={`url(#grad-${m.id})`}
              dot={false} activeDot={{ r: 2.5, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
        {m.description}
      </div>

      {/* ── Source attribution strip (live 90d view only) ── */}
      {m.source && onNavigate && (
        <div style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 7, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: C.dimmed,
              }}>
                Source
              </span>
              <span style={{
                fontSize: 7, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: C.amber,
                background: `${C.amber}14`, border: `1px solid ${C.amber}28`,
                padding: "1px 5px",
              }}>
                ● Live
              </span>
            </div>
            <button
              onClick={() => onNavigate(m.source!.link)}
              style={{
                background: "transparent",
                border: `1px solid ${C.amber}30`,
                padding: "2px 9px",
                cursor: "pointer",
                fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em",
                color: C.amber, textTransform: "uppercase",
                fontFamily: "inherit",
              }}
            >
              View →
            </button>
          </div>
          <div style={{
            fontSize: 8.5, color: "hsl(215 16% 30%)",
            letterSpacing: "0.01em", lineHeight: 1.55,
          }}>
            {m.source.label} · {m.source.summary}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Period toggle ──────────────────────────────────────── */
const PERIOD_KEYS: PeriodKey[] = ["7d", "30d", "90d"];

function PeriodToggle({ active, onChange }: { active: PeriodKey; onChange: (p: PeriodKey) => void }) {
  return (
    <div style={{
      display: "flex",
      background: "hsl(220 13% 8%)",
      border: `1px solid ${C.border}`,
      overflow: "hidden",
    }}>
      {PERIOD_KEYS.map((p) => {
        const isActive = p === active;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{
              padding: "7px 16px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: isActive ? "#fff" : C.muted,
              background: isActive ? C.amber : "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background 0.18s, color 0.18s",
              fontFamily: "inherit",
              borderRight: p !== "90d" ? `1px solid ${C.border}` : "none",
            }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ExecutionIndex() {
  const [, navigate] = useLocation();
  const [period, setPeriod] = useState<PeriodKey>("90d");
  const { ccRows } = useCc();
  const config = PERIOD_CONFIG[period];

  /* ── Live 90d calculations ── */
  const liveData = useMemo(() => {
    // Visibility: avg confidence of actively-sensing signals (ACTIVE + ALERT)
    const allSignals     = SIGNAL_CATEGORIES.flatMap(c => c.signals);
    const liveSignals    = allSignals.filter(s => s.status === "ACTIVE" || s.status === "ALERT");
    const activeSigCount = liveSignals.length;
    const visScore       = liveSignals.length > 0
      ? Math.round(liveSignals.reduce((s, sig) => s + sig.confidence, 0) / liveSignals.length)
      : 0;

    // Decision Quality: avg routing-decision confidence across CC rows
    const decScore = ccRows.length > 0
      ? Math.round(ccRows.reduce((s, r) => s + r.conf, 0) / ccRows.length)
      : 0;

    // Response Consistency: fire-weighted playbook success rate
    const totalFires = PLAYBOOKS.reduce((s, pb) => s + pb.stats.firesLast30Days, 0);
    const conScore   = totalFires > 0
      ? Math.round(PLAYBOOKS.reduce((s, pb) => s + pb.stats.successRate * pb.stats.firesLast30Days, 0) / totalFires)
      : 0;

    // Recovery Performance: avg conf of resolved CC rows + recovery PB success
    const recPBs   = PLAYBOOKS.filter(pb => pb.category === "Recovery" || pb.category === "Guest");
    const recFires = recPBs.reduce((s, pb) => s + pb.stats.firesLast30Days, 0);
    const recPbRate = recFires > 0
      ? recPBs.reduce((s, pb) => s + pb.stats.successRate * pb.stats.firesLast30Days, 0) / recFires
      : 0;
    const resolvedRows    = ccRows.filter(r => r.status === "RESOLVED" && r.outcome !== "—");
    const resolvedAvgConf = resolvedRows.length > 0
      ? resolvedRows.reduce((s, r) => s + r.conf, 0) / resolvedRows.length
      : recPbRate;
    const recScore = Math.round(resolvedAvgConf * 0.4 + recPbRate * 0.6);

    // Activation Success: CC completion rate + VIP/Workforce/Ops PB rate
    const completedRows = ccRows.filter(r => r.status === "RESOLVED" || r.status === "MONITORING");
    const ccRate        = ccRows.length > 0 ? (completedRows.length / ccRows.length) * 100 : 0;
    const actPBs        = PLAYBOOKS.filter(pb => pb.category === "VIP" || pb.category === "Workforce" || pb.category === "Operational");
    const actFires      = actPBs.reduce((s, pb) => s + pb.stats.firesLast30Days, 0);
    const pbActRate     = actFires > 0
      ? actPBs.reduce((s, pb) => s + pb.stats.successRate * pb.stats.firesLast30Days, 0) / actFires
      : 0;
    const actScore = Math.round(ccRate * 0.4 + pbActRate * 0.6);

    const metrics: Metric[] = [
      {
        id: "visibility", label: "Visibility Score", score: visScore,
        trend: [72, 76, 79, 82, 85, visScore], trendDir: "up",
        delta: `+${Math.max(0, visScore - 72)} pts`,
        description: "Average confidence of actively-sensing signals across all guest and operational categories.",
        source: {
          label: "Signal Registry", link: "/signal-registry",
          summary: `${activeSigCount} of ${allSignals.length} signals active/alerting · ${SIGNAL_CATEGORIES.length} categories · ${visScore}% avg confidence`,
        },
      },
      {
        id: "decision", label: "Decision Quality", score: decScore,
        trend: [65, 68, 72, 76, 79, decScore], trendDir: "up",
        delta: `+${Math.max(0, decScore - 65)} pts`,
        description: "Average routing-decision confidence across Command Centre activations — measuring how certain the engine is in each routing recommendation.",
        source: {
          label: "Command Centre", link: "/command-centre",
          summary: `${ccRows.length} CC routing decisions · ${decScore}% avg confidence`,
        },
      },
      {
        id: "consistency", label: "Response Consistency", score: conScore,
        trend: [71, 74, 79, 83, 89, conScore], trendDir: "up",
        delta: `+${Math.max(0, conScore - 71)} pts`,
        description: "Percentage of moments resolved using the correct playbook action within the response window.",
        source: {
          label: "Playbook Engine", link: "/playbook-engine",
          summary: `${PLAYBOOKS.length} playbooks · ${totalFires} fires (30d) · ${conScore}% weighted success rate`,
        },
      },
      {
        id: "recovery", label: "Recovery Performance", score: recScore,
        trend: [58, 62, 66, 70, 73, recScore], trendDir: "up",
        delta: `+${Math.max(0, recScore - 58)} pts`,
        description: "Success rate of service recovery interventions measured against guest sentiment shift post-action.",
        source: {
          label: "Command Centre + Playbook Engine", link: "/command-centre",
          summary: `${resolvedRows.length} resolved CC rows · ${recPBs.length} recovery playbooks · ${recScore}% blended score`,
        },
      },
      {
        id: "activation", label: "Activation Success", score: actScore,
        trend: [64, 68, 72, 77, 81, actScore], trendDir: "up",
        delta: `+${Math.max(0, actScore - 64)} pts`,
        description: "Rate of staff-activation moments completed within the prescribed execution window.",
        source: {
          label: "Command Centre + Playbook Engine", link: "/command-centre",
          summary: `${completedRows.length}/${ccRows.length} CC rows completed · ${actPBs.length} activation playbooks · ${actScore}% blended`,
        },
      },
    ];

    const overallScore = Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length);
    const prevScore    = 81;
    const overallDelta = overallScore - prevScore;
    const sorted       = [...metrics].sort((a, b) => b.score - a.score);

    return { metrics, overallScore, overallDelta, leader: sorted[0], laggard: sorted[sorted.length - 1] };
  }, [ccRows]);

  /* ── Active data (switches by period) ── */
  const activeMetrics: Metric[] = period === "90d"
    ? liveData.metrics
    : PERIOD_DATA[period].metrics as Metric[];

  const activeOverallScore = period === "90d" ? liveData.overallScore : PERIOD_DATA[period].overall;
  const activeOverallDelta = period === "90d"
    ? (liveData.overallDelta >= 0 ? `+${liveData.overallDelta}` : `${liveData.overallDelta}`)
    : PERIOD_DATA[period].overallDelta;

  const activeLeader = period === "90d"
    ? { label: liveData.leader.label, score: liveData.leader.score, color: scoreColor(liveData.leader.score) }
    : { label: PERIOD_DATA[period].insight.leading.name, score: PERIOD_DATA[period].insight.leading.score, color: C.emerald };
  const activeLaygard = period === "90d"
    ? { label: liveData.laggard.label, score: liveData.laggard.score, color: scoreColor(liveData.laggard.score) }
    : { label: PERIOD_DATA[period].insight.lever.name,    score: PERIOD_DATA[period].insight.lever.score,    color: C.amber  };

  const improvements = [...activeMetrics]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map(x => ({ ...x, action: IMPROVEMENT_ACTION[x.id] ?? IMPROVEMENT_ACTION.consistency }));

  const radarData = activeMetrics.map(x => ({ subject: x.label.split(" ")[0], score: x.score, fullMark: 100 }));

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 36, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.26em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Execution Intelligence
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 8 }}>
              EXECUTION INDEX
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em", maxWidth: 560 }}>
              A composite measurement of operational execution quality across five scored dimensions.
              Not activity volume — execution precision.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, paddingTop: 4 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>
              Time Window
            </div>
            <PeriodToggle active={period} onChange={setPeriod} />
          </div>
        </motion.div>

        {/* ── Overall Score Hero ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`hero-${period}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "hsl(220 13% 7%)",
              border: `1px solid ${C.border}`,
              borderTop: `3px solid ${C.amber}`,
              padding: "32px 40px",
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              gap: 48,
            }}
          >
            {/* Big score */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
                Overall Execution Score
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 88, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  <CountUp target={activeOverallScore} duration={1000} />
                </span>
                <span style={{ fontSize: 22, fontWeight: 600, color: C.muted }}>/100</span>
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  padding: "5px 12px",
                  background: `${C.emerald}14`,
                  border: `1px solid ${C.emerald}35`,
                  fontSize: 11, fontWeight: 800, color: C.emerald, letterSpacing: "0.06em",
                }}>
                  ↑ {activeOverallDelta} this period
                </div>
                <span style={{ fontSize: 10, color: C.muted }}>Strong execution. Improving across 5/5 dimensions.</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, alignSelf: "stretch", background: C.border, flexShrink: 0 }} />

            {/* Per-dimension summary bars */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {activeMetrics.map((m) => {
                const color = scoreColor(m.score);
                return (
                  <div key={m.id} style={{ display: "grid", gridTemplateColumns: "180px 1fr 40px", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.04em" }}>{m.label}</div>
                    <div style={{ height: 4, background: "hsl(220 13% 11%)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.score}%` }}
                        transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
                        style={{ height: "100%", background: color }}
                      />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color, textAlign: "right" }}>{m.score}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Period label strip */}
        <motion.div
          key={`strip-${period}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            padding: "8px 40px",
            background: "hsl(220 13% 6%)",
            border: `1px solid ${C.border}`,
            borderTop: "none",
            marginBottom: 32,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>Period</span>
          <span style={{ fontSize: 8.5, color: "hsl(215 16% 30%)", letterSpacing: "0.08em" }}>{config.window}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
            {[
              { label: "≥ 80", color: C.emerald },
              { label: "60–79", color: C.amber },
              { label: "< 60", color: C.crimson },
            ].map((leg) => (
              <div key={leg.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, background: leg.color }} />
                <span style={{ fontSize: 8, color: C.muted, letterSpacing: "0.08em" }}>{leg.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Five metric cards ── */}
        <AnimatePresence mode="wait">
          <div key={`cards-${period}`} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 32 }}>
            {activeMetrics.map((m, i) => (
              <MetricCard
                key={m.id}
                m={m}
                xLabels={config.xLabels}
                delay={i * 0.06}
                onNavigate={period === "90d" ? navigate : undefined}
              />
            ))}
          </div>
        </AnimatePresence>

        {/* ── Improvement Areas ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`improvements-${period}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: 32 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase" }}>
                Improvement Areas
              </div>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <div style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                2 Prioritised Dimensions
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
              {improvements.map((imp, i) => {
                const color = scoreColor(imp.score);
                return (
                  <motion.div
                    key={imp.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.32 }}
                    style={{
                      padding: "20px 22px",
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderLeft: `3px solid ${C.amber}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em", color: C.amber, textTransform: "uppercase", marginBottom: 5 }}>
                          Priority {i + 1} · Improvement
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{imp.label}</div>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {imp.score}
                        <span style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>/100</span>
                      </div>
                    </div>
                    <div style={{ height: 3, background: "hsl(220 13% 11%)", marginBottom: 14 }}>
                      <div style={{ width: `${imp.score}%`, height: "100%", background: color }} />
                    </div>
                    <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.65, marginBottom: 10 }}>
                      {imp.action}
                    </div>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: C.amber, textTransform: "uppercase" }}>
                      → Recommended Action
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Index History ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.42 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase" }}>
              Index History
            </div>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <div style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              12-Week Trend · All Dimensions
            </div>
          </div>

          <div style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            padding: "24px 28px 20px",
          }}>
            <div style={{ display: "flex", gap: 20, marginBottom: 18, flexWrap: "wrap" }}>
              {(Object.entries(HISTORY_LINE_COLORS) as [keyof typeof HISTORY_LINE_COLORS, string][]).map(([key, color]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: key === "overall" ? 20 : 12,
                    height: key === "overall" ? 2.5 : 1.5,
                    background: color,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase",
                    color: key === "overall" ? "#fff" : C.muted,
                    fontWeight: key === "overall" ? 700 : 400,
                  }}>
                    {HISTORY_LABELS[key]}
                  </span>
                  {key === "overall" && (
                    <span style={{
                      fontSize: 7, fontWeight: 700, letterSpacing: "0.1em",
                      color: C.amber, background: `${C.amber}18`,
                      border: `1px solid ${C.amber}30`,
                      padding: "1px 5px", marginLeft: 2,
                    }}>
                      COMPOSITE
                    </span>
                  )}
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={HISTORY_DATA} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 10%)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 7.5, fill: "hsl(215 16% 28%)", fontFamily: "inherit" }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} ticks={[50, 60, 70, 80, 90, 100]} tick={{ fontSize: 7.5, fill: "hsl(215 16% 28%)", fontFamily: "inherit" }} axisLine={false} tickLine={false} width={26} />
                <Tooltip content={<HistoryTooltip />} />
                <Line type="monotone" dataKey="consistency" stroke={HISTORY_LINE_COLORS.consistency} strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: HISTORY_LINE_COLORS.consistency }} />
                <Line type="monotone" dataKey="visibility"  stroke={HISTORY_LINE_COLORS.visibility}  strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: HISTORY_LINE_COLORS.visibility }} />
                <Line type="monotone" dataKey="activation"  stroke={HISTORY_LINE_COLORS.activation}  strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: HISTORY_LINE_COLORS.activation }} />
                <Line type="monotone" dataKey="decision"    stroke={HISTORY_LINE_COLORS.decision}    strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: HISTORY_LINE_COLORS.decision }} />
                <Line type="monotone" dataKey="recovery"    stroke={HISTORY_LINE_COLORS.recovery}    strokeWidth={1.5} dot={false} strokeDasharray="4 2" activeDot={{ r: 3, fill: HISTORY_LINE_COLORS.recovery }} />
                <Line type="monotone" dataKey="overall" stroke={HISTORY_LINE_COLORS.overall} strokeWidth={3} dot={false} activeDot={{ r: 4, fill: HISTORY_LINE_COLORS.overall }} />
              </LineChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 8, color: "hsl(215 16% 20%)", letterSpacing: "0.06em" }}>
                25 Mar 2026 — 10 Jun 2026
              </span>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Start</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{HISTORY_DATA[0].overall}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Current</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.amber }}>{activeOverallScore}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>12-Wk Δ</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.emerald }}>+{activeOverallScore - HISTORY_DATA[0].overall}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Executive Insight Panel ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`insight-${period}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              background: "hsl(220 13% 6%)",
              border: `1px solid ${C.amber}25`,
              padding: "36px 40px",
              display: "grid",
              gridTemplateColumns: "1fr 260px",
              gap: 40,
              alignItems: "center",
            }}
          >
            {/* Left: insight copy */}
            <div>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 14 }}>
                Executive Insight Panel
              </div>
              <div style={{
                fontSize: 20, fontWeight: 900, color: "#fff",
                letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: 20,
              }}>
                "WELBX Measures Execution, Not Activity."
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.7, maxWidth: 580 }}>
                  With an overall Execution Index of <strong style={{ color: "#fff" }}>{activeOverallScore}/100</strong> — 
                  up {activeOverallDelta} points this period — The Grand Meridian is operating in the upper performance tier 
                  across all five dimensions. {activeLeader.label} leads at{" "}
                  <strong style={{ color: activeLeader.color }}>{activeLeader.score}</strong>,{" "}
                  reflecting high-confidence execution across the most active data sources.
                </p>
                <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.7, maxWidth: 580 }}>
                  {activeLaygard.label} at <strong style={{ color: activeLaygard.color }}>{activeLaygard.score}</strong> remains the primary lever for 
                  score improvement. Targeted playbook expansion in this dimension represents the highest-yield 
                  opportunity to advance the overall index within the next operating quarter.
                </p>
                <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.7, maxWidth: 580 }}>
                  Every point on this index represents a closed loop: a signal sensed, a decision made, an action 
                  executed, and an outcome confirmed. This is what separates execution measurement from activity reporting.
                </p>
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 20 }}>
                {[
                  { label: "Leading Dimension", value: activeLeader.label,  score: activeLeader.score,  color: activeLeader.color },
                  { label: "Improvement Lever", value: activeLaygard.label, score: activeLaygard.score, color: activeLaygard.color },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    padding: "12px 16px",
                    background: "hsl(220 13% 8%)",
                    border: `1px solid ${C.border}`,
                    borderTop: `2px solid ${stat.color}`,
                    minWidth: 160,
                  }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 6 }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{stat.value}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.score}<span style={{ fontSize: 9, fontWeight: 600, color: C.muted }}>/100</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Radar chart */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
                Dimension Radar
              </div>
              <ResponsiveContainer width={240} height={220}>
                <RadarChart data={radarData} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                  <PolarGrid stroke="hsl(220 13% 13%)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 8.5, fill: "hsl(215 16% 38%)", fontFamily: "inherit" }}
                  />
                  <Radar
                    name="score"
                    dataKey="score"
                    stroke={C.amber}
                    fill={C.amber}
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                    dot={{ fill: C.amber, r: 2.5 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.08em", textAlign: "center" }}>
                All five dimensions · {PERIOD_CONFIG[period].label} window
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
