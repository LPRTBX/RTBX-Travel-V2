import { useState } from "react";
import { motion } from "framer-motion";

const ACCENT = "#c9a84c";

const SCORECARDS = [
  {
    label: "Engagement Rate",
    value: "73.4%",
    delta: "+8.2pts",
    deltaPositive: true,
    sub: "vs 30-day baseline",
    color: ACCENT,
    description: "Messages that prompted a measurable guest or staff response",
  },
  {
    label: "Response Rate",
    value: "61.7%",
    delta: "+4.9pts",
    deltaPositive: true,
    sub: "vs 30-day baseline",
    color: "#10b981",
    description: "Responses that arrived within the defined behavioural window",
  },
  {
    label: "Action Rate",
    value: "44.2%",
    delta: "+11.3pts",
    deltaPositive: true,
    sub: "vs 30-day baseline",
    color: "#60a5fa",
    description: "Responses that converted into a concrete, trackable action",
  },
  {
    label: "Outcome Influence",
    value: "38.9%",
    delta: "+6.1pts",
    deltaPositive: true,
    sub: "vs 30-day baseline",
    color: "#a78bfa",
    description: "Actions that produced a measurable moment outcome change",
  },
];

const CHANNELS = [
  { name: "In-App Push", type: "Digital", score: 94, volume: 312, actionRate: 61, trend: [58, 62, 65, 68, 72, 78, 83, 94] },
  { name: "Front-Desk Verbal", type: "Human", score: 88, volume: 204, actionRate: 71, trend: [70, 72, 73, 76, 79, 82, 85, 88] },
  { name: "SMS", type: "Digital", score: 81, volume: 178, actionRate: 54, trend: [60, 64, 67, 70, 73, 76, 78, 81] },
  { name: "Digital Signage", type: "Ambient", score: 62, volume: 580, actionRate: 28, trend: [44, 47, 50, 53, 55, 57, 60, 62] },
  { name: "Email", type: "Digital", score: 47, volume: 241, actionRate: 19, trend: [36, 38, 40, 41, 43, 44, 46, 47] },
  { name: "Printed Material", type: "Ambient", score: 21, volume: 420, actionRate: 8, trend: [18, 19, 20, 19, 21, 20, 21, 21] },
];

const MOMENT_TYPES = ["VIP Arrival", "Queue Alert", "Service Recovery", "Upsell Window", "Welfare Flag", "Staff Capacity"];

const MATRIX: Record<string, Record<string, number>> = {
  "In-App Push":       { "VIP Arrival": 91, "Queue Alert": 87, "Service Recovery": 76, "Upsell Window": 83, "Welfare Flag": 58, "Staff Capacity": 79 },
  "Front-Desk Verbal": { "VIP Arrival": 96, "Queue Alert": 74, "Service Recovery": 94, "Upsell Window": 71, "Welfare Flag": 88, "Staff Capacity": 82 },
  "SMS":               { "VIP Arrival": 78, "Queue Alert": 81, "Service Recovery": 69, "Upsell Window": 72, "Welfare Flag": 44, "Staff Capacity": 61 },
  "Digital Signage":   { "VIP Arrival": 38, "Queue Alert": 64, "Service Recovery": 31, "Upsell Window": 52, "Welfare Flag": 12, "Staff Capacity": 74 },
  "Email":             { "VIP Arrival": 22, "Queue Alert": 18, "Service Recovery": 41, "Upsell Window": 53, "Welfare Flag": 8,  "Staff Capacity": 28 },
  "Printed Material":  { "VIP Arrival": 12, "Queue Alert": 9,  "Service Recovery": 16, "Upsell Window": 22, "Welfare Flag": 4,  "Staff Capacity": 11 },
};

const TREND_DATA = [
  {
    channel: "In-App Push",
    color: ACCENT,
    sent:    [220, 240, 258, 271, 285, 298, 305, 312],
    response:[128, 141, 158, 167, 176, 188, 196, 208],
    action:  [72,  84,  96,  104, 112, 126, 134, 141],
    outcome: [38,  44,  51,  57,  63,  72,  79,  87],
  },
  {
    channel: "Front-Desk Verbal",
    color: "#10b981",
    sent:    [160, 168, 175, 181, 188, 194, 199, 204],
    response:[116, 121, 128, 133, 141, 148, 154, 160],
    action:  [84,  89,  96,  102, 109, 116, 122, 128],
    outcome: [58,  63,  68,  74,  79,  84,  88,  93],
  },
  {
    channel: "SMS",
    color: "#60a5fa",
    sent:    [130, 138, 146, 154, 160, 166, 171, 178],
    response:[74,  80,  88,  94,  98,  104, 109, 114],
    action:  [38,  42,  48,  54,  58,  62,  66,  70],
    outcome: [18,  21,  24,  27,  30,  33,  36,  39],
  },
  {
    channel: "Digital Signage",
    color: "#a78bfa",
    sent:    [420, 438, 458, 472, 490, 510, 542, 580],
    response:[118, 124, 131, 136, 142, 149, 156, 162],
    action:  [42,  46,  50,  54,  58,  62,  66,  70],
    outcome: [12,  14,  16,  18,  20,  22,  24,  26],
  },
];

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

const LANES_PERF = [
  {
    lane: "Guest",
    color: "#c9a84c",
    successRate: 97.4,
    deliveries: 312,
    avgLatency: "3.8m",
    latencyTrend: [5.1, 4.8, 4.4, 4.2, 4.0, 3.9, 3.8, 3.8],
    successTrend: [91.2, 92.8, 93.6, 94.5, 95.1, 96.0, 96.8, 97.4],
    priority: "CRITICAL",
    priorityColor: "#ef4444",
    topChannel: "In-App Push",
  },
  {
    lane: "Workforce",
    color: "#3b82f6",
    successRate: 94.1,
    deliveries: 187,
    avgLatency: "6.2m",
    latencyTrend: [8.4, 8.0, 7.7, 7.4, 7.0, 6.8, 6.4, 6.2],
    successTrend: [88.4, 89.6, 90.8, 91.5, 92.2, 93.0, 93.6, 94.1],
    priority: "ELEVATED",
    priorityColor: "#c9a84c",
    topChannel: "Ops Dashboard Alert",
  },
  {
    lane: "Operational",
    color: "#a78bfa",
    successRate: 98.7,
    deliveries: 241,
    avgLatency: "2.6m",
    latencyTrend: [3.8, 3.6, 3.3, 3.1, 2.9, 2.8, 2.7, 2.6],
    successTrend: [93.0, 94.4, 95.2, 96.0, 96.8, 97.4, 98.1, 98.7],
    priority: "HIGH",
    priorityColor: "#a78bfa",
    topChannel: "Command Centre",
  },
  {
    lane: "Executive",
    color: "#f43f5e",
    successRate: 99.2,
    deliveries: 64,
    avgLatency: "11.4m",
    latencyTrend: [16.2, 15.4, 14.6, 13.8, 13.0, 12.4, 11.8, 11.4],
    successTrend: [95.4, 96.0, 96.8, 97.4, 98.0, 98.4, 98.8, 99.2],
    priority: "STRATEGIC",
    priorityColor: "#f43f5e",
    topChannel: "Executive Digest",
  },
  {
    lane: "Partner",
    color: "#10b981",
    successRate: 91.6,
    deliveries: 98,
    avgLatency: "16.8m",
    latencyTrend: [22.0, 20.8, 19.6, 18.8, 18.0, 17.4, 17.0, 16.8],
    successTrend: [84.2, 86.0, 87.4, 88.6, 89.4, 90.2, 91.0, 91.6],
    priority: "STANDARD",
    priorityColor: "#10b981",
    topChannel: "Partner Portal",
  },
];

const TOP_RULES = [
  {
    rank: 1,
    rule: "Guest tier ≥ M1 AND complaint signal",
    fires: 214,
    successRate: 98.6,
    avgOutcomeShift: "+14.2 NPS pts",
    color: "#ef4444",
    lane: "Guest",
  },
  {
    rank: 2,
    rule: "Foyer occupancy > 85% for 8 min",
    fires: 178,
    successRate: 97.9,
    avgOutcomeShift: "–34% congestion",
    color: "#a78bfa",
    lane: "Operational",
  },
  {
    rank: 3,
    rule: "Revenue gap > £2,000 in window",
    fires: 142,
    successRate: 96.5,
    avgOutcomeShift: "+£1,840 recovered",
    color: "#10b981",
    lane: "Guest",
  },
  {
    rank: 4,
    rule: "Workforce welfare score < 3.5",
    fires: 116,
    successRate: 94.8,
    avgOutcomeShift: "+0.6 welfare score",
    color: "#c9a84c",
    lane: "Workforce",
  },
  {
    rank: 5,
    rule: "Executive NPS delta > −2.0 pts",
    fires: 84,
    successRate: 99.1,
    avgOutcomeShift: "+2.8 pts recovery",
    color: "#f43f5e",
    lane: "Executive",
  },
  {
    rank: 6,
    rule: "Partner SLA breach detected",
    fires: 61,
    successRate: 92.3,
    avgOutcomeShift: "93% SLA restored",
    color: "#3b82f6",
    lane: "Partner",
  },
];

const OUTCOME_TYPES = [
  {
    type: "Experience Recovery",
    color: "#c9a84c",
    correlation: 0.87,
    topChannel: "Front-Desk Verbal",
    avgDelay: "4.2m",
    trend: [0.71, 0.74, 0.76, 0.79, 0.81, 0.84, 0.86, 0.87],
    volume: 138,
  },
  {
    type: "Revenue Activation",
    color: "#10b981",
    correlation: 0.74,
    topChannel: "In-App Push",
    avgDelay: "3.1m",
    trend: [0.58, 0.60, 0.63, 0.66, 0.68, 0.71, 0.73, 0.74],
    volume: 96,
  },
  {
    type: "Operational Continuity",
    color: "#a78bfa",
    correlation: 0.81,
    topChannel: "Command Centre",
    avgDelay: "2.4m",
    trend: [0.64, 0.67, 0.70, 0.72, 0.75, 0.77, 0.79, 0.81],
    volume: 112,
  },
  {
    type: "Staff Wellbeing",
    color: "#3b82f6",
    correlation: 0.68,
    topChannel: "Ops Dashboard Alert",
    avgDelay: "6.8m",
    trend: [0.52, 0.54, 0.57, 0.59, 0.61, 0.63, 0.66, 0.68],
    volume: 74,
  },
  {
    type: "Governance Visibility",
    color: "#f43f5e",
    correlation: 0.92,
    topChannel: "Executive Digest",
    avgDelay: "12.6m",
    trend: [0.78, 0.81, 0.83, 0.85, 0.87, 0.89, 0.91, 0.92],
    volume: 48,
  },
  {
    type: "Partner SLA Compliance",
    color: "#06b6d4",
    correlation: 0.63,
    topChannel: "Partner Portal",
    avgDelay: "17.2m",
    trend: [0.48, 0.50, 0.53, 0.55, 0.57, 0.59, 0.61, 0.63],
    volume: 52,
  },
];

function heatColor(value: number): { bg: string; fg: string } {
  if (value >= 85) return { bg: "rgba(201,168,76,0.22)", fg: "#c9a84c" };
  if (value >= 70) return { bg: "rgba(201,168,76,0.12)", fg: "#c9a84c" };
  if (value >= 55) return { bg: "rgba(96,165,250,0.12)", fg: "#60a5fa" };
  if (value >= 35) return { bg: "rgba(96,165,250,0.06)", fg: "hsl(215 16% 50%)" };
  return { bg: "transparent", fg: "hsl(215 16% 30%)" };
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 28;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: h }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            width: 5,
            height: Math.max(2, ((v - min) / range) * h),
            background: i === data.length - 1 ? color : `${color}55`,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

function LineSparkline({ data, color, width = 160, height = 40 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = width;
  const H = height;
  const stepX = W / (data.length - 1);
  const points = data.map((v, i) => `${i * stepX},${H - ((v - min) / range) * (H - 4) - 2}`).join(" ");
  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={i * stepX}
          cy={H - ((v - min) / range) * (H - 4) - 2}
          r={i === data.length - 1 ? 3 : 1.5}
          fill={i === data.length - 1 ? color : `${color}88`}
        />
      ))}
    </svg>
  );
}

function WoWTrendBadge({ first, last }: { first: number; last: number }) {
  const delta = last - first;
  const improving = delta > 1.5;
  const declining = delta < -1.5;
  const label = improving ? "↑ Improving" : declining ? "↓ Declining" : "→ Steady";
  const color = improving ? "#10b981" : declining ? "#ef4444" : ACCENT;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 8, fontWeight: 700, letterSpacing: "0.12em",
      color, border: `1px solid ${color}44`,
      background: `${color}12`, padding: "3px 8px",
      textTransform: "uppercase",
    }}>
      {label}
    </div>
  );
}

function computeActionRates(sent: number[], action: number[]) {
  return sent.map((s, i) => parseFloat(((action[i] / s) * 100).toFixed(1)));
}

function computeResponseRates(sent: number[], response: number[]) {
  return sent.map((s, i) => parseFloat(((response[i] / s) * 100).toFixed(1)));
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

function getBestChannelPerMoment(): Record<string, { channel: string; value: number }> {
  const result: Record<string, { channel: string; value: number }> = {};
  for (const mt of MOMENT_TYPES) {
    let best = { channel: "", value: -1 };
    for (const ch of CHANNELS) {
      const v = MATRIX[ch.name]?.[mt] ?? 0;
      if (v > best.value) best = { channel: ch.name, value: v };
    }
    result[mt] = best;
  }
  return result;
}

const BEST_CHANNEL = getBestChannelPerMoment();

export default function CommunicationIntelligence() {
  const [matrixMode, setMatrixMode] = useState<"full" | "best">("full");
  return (
    <div className="min-h-screen pl-56" style={{ background: "hsl(220 13% 5%)" }}>
      <div style={{ maxWidth: 1200, padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.26em", color: ACCENT, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · Influence Layer
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 8 }}>
            Communication Intelligence
          </h1>
          <p style={{ fontSize: 12, color: "hsl(215 16% 44%)", lineHeight: 1.75, maxWidth: 560, margin: 0 }}>
            Causal communication analytics — not what was sent, but what actually changed behaviour.
          </p>
        </motion.div>

        {/* ── Headline Banner ── */}
        <motion.div {...fadeUp(0.06)} style={{ marginBottom: 36 }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 100%)",
            border: "1px solid rgba(201,168,76,0.22)",
            borderLeft: "3px solid #c9a84c",
            padding: "28px 36px",
          }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(201,168,76,0.5)", textTransform: "uppercase", marginBottom: 14 }}>
              Epistemological Principle
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 14 }}>
              Communication Is Only Valuable When It Changes Behaviour.
            </div>
            <p style={{ fontSize: 12.5, color: "hsl(215 16% 52%)", lineHeight: 1.75, maxWidth: 760, margin: 0 }}>
              Every channel, message, and moment of contact is measured against a single question: did it produce a different outcome than silence would have? Volume, open rates, and impressions are vanity. This layer tracks the causal chain — message sent → response received → action taken → outcome shifted.
            </p>
          </div>
        </motion.div>

        {/* ── Scorecards ── */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>01 — Intelligence Scorecards</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
            {SCORECARDS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 + i * 0.07 }}
                style={{
                  background: "hsl(220 13% 7%)",
                  border: "1px solid hsl(220 13% 10%)",
                  borderTop: `2px solid ${s.color}`,
                  padding: "24px 22px",
                }}
              >
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: "hsl(215 16% 32%)", textTransform: "uppercase", marginBottom: 14 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color: s.color, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8, fontFamily: "var(--app-font-mono)" }}>
                  {s.value}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: s.deltaPositive ? "#10b981" : "#ef4444",
                    fontFamily: "var(--app-font-mono)",
                  }}>
                    {s.deltaPositive ? "▲" : "▼"} {s.delta}
                  </span>
                  <span style={{ fontSize: 9, color: "hsl(215 16% 32%)", letterSpacing: "0.06em" }}>{s.sub}</span>
                </div>
                <div style={{ fontSize: 9.5, color: "hsl(215 16% 38%)", lineHeight: 1.6 }}>
                  {s.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Best Performing Channels ── */}
        <motion.div {...fadeUp(0.18)} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>02 — Best Performing Channels</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
            <div style={{ fontSize: 8, color: "hsl(215 16% 30%)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Ranked by behavioural impact score · not volume</div>
          </div>
          <div style={{ background: "hsl(220 13% 7%)", border: "1px solid hsl(220 13% 10%)" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "28px 180px 80px 1fr 80px 80px 80px",
              padding: "10px 20px",
              borderBottom: "1px solid hsl(220 13% 10%)",
              gap: 16,
            }}>
              {["#", "Channel", "Type", "Impact Score", "Volume", "Action Rate", "7d Trend"].map(h => (
                <div key={h} style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: "hsl(215 16% 26%)", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>
            {CHANNELS.map((ch, i) => {
              const barWidth = (ch.score / 100) * 100;
              const barColor = ch.score >= 80 ? ACCENT : ch.score >= 55 ? "#60a5fa" : "hsl(215 16% 30%)";
              return (
                <motion.div
                  key={ch.name}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + i * 0.05 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 180px 80px 1fr 80px 80px 80px",
                    padding: "14px 20px",
                    borderBottom: i < CHANNELS.length - 1 ? "1px solid hsl(220 13% 9%)" : "none",
                    alignItems: "center",
                    gap: 16,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "hsl(220 13% 8%)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: "hsl(215 16% 26%)", fontFamily: "var(--app-font-mono)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{ch.name}</div>
                  <div style={{ fontSize: 9, letterSpacing: "0.08em", color: "hsl(215 16% 40%)", textTransform: "uppercase" }}>{ch.type}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, height: 4, background: "hsl(220 13% 12%)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                        style={{ height: "100%", background: barColor }}
                      />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: barColor, minWidth: 28, textAlign: "right", fontFamily: "var(--app-font-mono)" }}>
                      {ch.score}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "hsl(215 16% 44%)", fontFamily: "var(--app-font-mono)" }}>{ch.volume.toLocaleString()}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ch.actionRate >= 50 ? "#10b981" : ch.actionRate >= 30 ? ACCENT : "hsl(215 16% 42%)", fontFamily: "var(--app-font-mono)" }}>
                    {ch.actionRate}%
                  </div>
                  <div>
                    <MiniSparkline data={ch.trend} color={barColor} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Communication Effectiveness Matrix ── */}
        <motion.div {...fadeUp(0.24)} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>03 — Communication Effectiveness Matrix</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
            {/* View Toggle */}
            <div style={{ display: "flex", border: "1px solid hsl(220 13% 14%)", overflow: "hidden" }}>
              {(["full", "best"] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setMatrixMode(mode)}
                  style={{
                    padding: "6px 14px",
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                    textTransform: "uppercase", cursor: "pointer", border: "none",
                    borderRight: mode === "full" ? "1px solid hsl(220 13% 14%)" : "none",
                    background: matrixMode === mode ? ACCENT : "hsl(220 13% 7%)",
                    color: matrixMode === mode ? "hsl(220 13% 5%)" : "hsl(215 16% 40%)",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {mode === "full" ? "Full Matrix" : "Best Channel"}
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 11, color: "hsl(215 16% 40%)", lineHeight: 1.7, marginBottom: 18, maxWidth: 620 }}>
            {matrixMode === "full"
              ? "Action rate by channel × moment type. High-amber cells represent combinations where communication reliably changes behaviour. Use this to select the right channel for each moment class."
              : "Quick-reference guide — the single best-performing channel for each moment type, ranked by action rate. Use this to make the right call the moment a situation fires."}
          </p>

          {matrixMode === "full" ? (
            <>
              <div style={{ background: "hsl(220 13% 7%)", border: "1px solid hsl(220 13% 10%)", overflowX: "auto" }}>
                {/* Column headers */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `160px repeat(${MOMENT_TYPES.length}, 1fr)`,
                  borderBottom: "1px solid hsl(220 13% 10%)",
                  background: "hsl(220 13% 6%)",
                }}>
                  <div style={{ padding: "10px 14px" }} />
                  {MOMENT_TYPES.map(mt => (
                    <div key={mt} style={{
                      padding: "10px 8px",
                      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em",
                      color: "hsl(215 16% 30%)", textTransform: "uppercase",
                      textAlign: "center", lineHeight: 1.4,
                      borderLeft: "1px solid hsl(220 13% 10%)",
                    }}>
                      {mt}
                    </div>
                  ))}
                </div>
                {/* Rows */}
                {CHANNELS.map((ch, ci) => (
                  <div
                    key={ch.name}
                    style={{
                      display: "grid",
                      gridTemplateColumns: `160px repeat(${MOMENT_TYPES.length}, 1fr)`,
                      borderBottom: ci < CHANNELS.length - 1 ? "1px solid hsl(220 13% 9%)" : "none",
                    }}
                  >
                    <div style={{
                      padding: "14px 14px",
                      fontSize: 11, fontWeight: 700, color: "hsl(215 16% 55%)",
                      display: "flex", alignItems: "center",
                      borderRight: "1px solid hsl(220 13% 10%)",
                    }}>
                      {ch.name}
                    </div>
                    {MOMENT_TYPES.map((mt) => {
                      const val = MATRIX[ch.name]?.[mt] ?? 0;
                      const isBest = BEST_CHANNEL[mt]?.channel === ch.name;
                      const { bg, fg } = heatColor(val);
                      return (
                        <div
                          key={mt}
                          style={{
                            padding: "12px 6px",
                            textAlign: "center",
                            background: bg,
                            borderLeft: "1px solid hsl(220 13% 9%)",
                            cursor: "default",
                            transition: "background 0.15s",
                            position: "relative",
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.outline = "1px solid rgba(201,168,76,0.3)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.outline = "none"; }}
                        >
                          {isBest && (
                            <div style={{
                              position: "absolute", top: 3, right: 4,
                              fontSize: 6.5, fontWeight: 700, letterSpacing: "0.1em",
                              color: ACCENT, opacity: 0.7,
                            }}>★</div>
                          )}
                          <div style={{ fontSize: 14, fontWeight: 800, color: fg, fontFamily: "var(--app-font-mono)", lineHeight: 1 }}>
                            {val}
                          </div>
                          <div style={{ fontSize: 7, color: "hsl(215 16% 28%)", marginTop: 2, letterSpacing: "0.08em" }}>ACTION %</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div style={{ display: "flex", gap: 20, marginTop: 12, alignItems: "center" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.12em", color: "hsl(215 16% 28%)", textTransform: "uppercase" }}>Legend:</div>
                {[
                  { label: "85–100 High Behavioural Impact", bg: "rgba(201,168,76,0.22)", fg: ACCENT },
                  { label: "70–84 Strong", bg: "rgba(201,168,76,0.12)", fg: ACCENT },
                  { label: "55–69 Moderate", bg: "rgba(96,165,250,0.12)", fg: "#60a5fa" },
                  { label: "35–54 Weak", bg: "rgba(96,165,250,0.06)", fg: "hsl(215 16% 50%)" },
                  { label: "< 35 Negligible", bg: "transparent", fg: "hsl(215 16% 30%)" },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, background: l.bg, border: "1px solid hsl(220 13% 14%)" }} />
                    <span style={{ fontSize: 8, color: l.fg, letterSpacing: "0.06em" }}>{l.label}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
                  <span style={{ fontSize: 10, color: ACCENT, opacity: 0.7 }}>★</span>
                  <span style={{ fontSize: 8, color: "hsl(215 16% 40%)", letterSpacing: "0.06em" }}>Best channel for this moment type</span>
                </div>
              </div>
            </>
          ) : (
            /* ── Best Channel View ── */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
              {MOMENT_TYPES.map((mt, i) => {
                const best = BEST_CHANNEL[mt];
                const { bg, fg } = heatColor(best.value);
                const channelData = CHANNELS.find(c => c.name === best.channel);
                return (
                  <motion.div
                    key={mt}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      background: "hsl(220 13% 7%)",
                      border: "1px solid hsl(220 13% 10%)",
                      borderTop: `2px solid ${ACCENT}`,
                      padding: "22px 22px",
                    }}
                  >
                    {/* Moment type label */}
                    <div style={{
                      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em",
                      color: "hsl(215 16% 32%)", textTransform: "uppercase", marginBottom: 14,
                    }}>
                      {mt}
                    </div>

                    {/* Directive line */}
                    <div style={{ fontSize: 9.5, color: "hsl(215 16% 36%)", marginBottom: 10, lineHeight: 1.5 }}>
                      Use when this moment fires:
                    </div>

                    {/* Best channel name */}
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10, lineHeight: 1.2 }}>
                      {best.channel}
                    </div>

                    {/* Channel type badge */}
                    {channelData && (
                      <div style={{
                        display: "inline-block", marginBottom: 16,
                        fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em",
                        color: "hsl(215 16% 44%)", textTransform: "uppercase",
                        border: "1px solid hsl(220 13% 16%)", padding: "2px 8px",
                      }}>
                        {channelData.type}
                      </div>
                    )}

                    {/* Action rate */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 14px",
                      background: bg,
                      border: `1px solid ${fg}22`,
                    }}>
                      <div style={{ fontSize: 32, fontWeight: 800, color: fg, fontFamily: "var(--app-font-mono)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {best.value}%
                      </div>
                      <div>
                        <div style={{ fontSize: 8.5, fontWeight: 700, color: fg, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Action Rate
                        </div>
                        <div style={{ fontSize: 8, color: "hsl(215 16% 36%)", marginTop: 2 }}>
                          for this moment type
                        </div>
                      </div>
                    </div>

                    {/* Runner-up hint */}
                    {(() => {
                      const sorted = CHANNELS
                        .map(c => ({ name: c.name, val: MATRIX[c.name]?.[mt] ?? 0 }))
                        .sort((a, b) => b.val - a.val);
                      const runnerUp = sorted[1];
                      return runnerUp ? (
                        <div style={{ marginTop: 10, fontSize: 9, color: "hsl(215 16% 30%)" }}>
                          Runner-up: <span style={{ color: "hsl(215 16% 44%)", fontWeight: 600 }}>{runnerUp.name}</span>
                          {" "}
                          <span style={{ fontFamily: "var(--app-font-mono)" }}>({runnerUp.val}%)</span>
                        </div>
                      ) : null;
                    })()}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* ── Channel Success Rate by Lane ── */}
        <motion.div {...fadeUp(0.3)} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>05 — Channel Success Rate by Lane</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
            <div style={{ fontSize: 8, color: "hsl(215 16% 30%)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Delivery confirmation rate · 8-week rolling</div>
          </div>
          <p style={{ fontSize: 11, color: "hsl(215 16% 40%)", lineHeight: 1.7, marginBottom: 18, maxWidth: 640 }}>
            Success rate per communication lane — the percentage of routed messages confirmed delivered and acknowledged within the lane's defined latency window.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {LANES_PERF.map((lane, i) => {
              const barW = Math.round(lane.successRate);
              const barColor = lane.successRate >= 97 ? ACCENT : lane.successRate >= 93 ? "#10b981" : "#60a5fa";
              return (
                <motion.div
                  key={lane.lane}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.34 + i * 0.06 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "130px 1fr 90px 80px 110px 120px",
                    alignItems: "center",
                    gap: 0,
                    background: i % 2 === 0 ? "hsl(220 13% 7%)" : "hsl(220 13% 8%)",
                    border: "1px solid hsl(220 13% 10%)",
                    borderLeft: `3px solid ${lane.color}`,
                  }}
                >
                  {/* Lane name */}
                  <div style={{ padding: "16px 18px", borderRight: "1px solid hsl(220 13% 10%)" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: lane.color, letterSpacing: "0.04em" }}>
                      {lane.lane.toUpperCase()}
                    </div>
                    <div style={{
                      display: "inline-block", marginTop: 5,
                      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em",
                      color: lane.priorityColor, border: `1px solid ${lane.priorityColor}40`,
                      background: `${lane.priorityColor}10`, padding: "2px 6px",
                    }}>
                      {lane.priority}
                    </div>
                  </div>
                  {/* Bar */}
                  <div style={{ padding: "16px 20px", borderRight: "1px solid hsl(220 13% 10%)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, height: 5, background: "hsl(220 13% 12%)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barW}%` }}
                          transition={{ delay: 0.5 + i * 0.05, duration: 0.7, ease: "easeOut" }}
                          style={{ height: "100%", background: barColor }}
                        />
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 800, color: barColor, minWidth: 44, textAlign: "right", fontFamily: "var(--app-font-mono)" }}>
                        {lane.successRate}%
                      </span>
                    </div>
                    <div style={{ fontSize: 7.5, color: "hsl(215 16% 30%)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                      Success Rate
                    </div>
                  </div>
                  {/* Deliveries */}
                  <div style={{ padding: "16px 16px", borderRight: "1px solid hsl(220 13% 10%)", textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "var(--app-font-mono)" }}>{lane.deliveries}</div>
                    <div style={{ fontSize: 7.5, color: "hsl(215 16% 30%)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>Deliveries</div>
                  </div>
                  {/* Latency */}
                  <div style={{ padding: "16px 16px", borderRight: "1px solid hsl(220 13% 10%)", textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "hsl(215 16% 60%)", fontFamily: "var(--app-font-mono)" }}>{lane.avgLatency}</div>
                    <div style={{ fontSize: 7.5, color: "hsl(215 16% 30%)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>Avg Latency</div>
                  </div>
                  {/* Latency sparkline */}
                  <div style={{ padding: "16px 16px", borderRight: "1px solid hsl(220 13% 10%)", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 28%)", textTransform: "uppercase" }}>Latency Trend</div>
                    <LineSparkline data={lane.latencyTrend} color={lane.color} />
                  </div>
                  {/* Top channel */}
                  <div style={{ padding: "16px 16px" }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 28%)", textTransform: "uppercase", marginBottom: 4 }}>Top Channel</div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: lane.color }}>{lane.topChannel}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Top-Performing Routing Rules ── */}
        <motion.div {...fadeUp(0.36)} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>06 — Top-Performing Routing Rules</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
            <div style={{ fontSize: 8, color: "hsl(215 16% 30%)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Ranked by fires × outcome shift</div>
          </div>
          <p style={{ fontSize: 11, color: "hsl(215 16% 40%)", lineHeight: 1.7, marginBottom: 18, maxWidth: 640 }}>
            The routing rules with the highest combined fire count and measured outcome shift. High-firing rules with strong outcome shifts indicate well-tuned thresholds; low-firing rules with high shifts may benefit from broader triggers.
          </p>
          <div style={{ background: "hsl(220 13% 7%)", border: "1px solid hsl(220 13% 10%)" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "36px 1fr 80px 80px 90px 150px",
              padding: "10px 20px",
              borderBottom: "1px solid hsl(220 13% 10%)",
              gap: 16,
            }}>
              {["#", "Condition Rule", "Lane", "Fires (8w)", "Success", "Avg Outcome Shift"].map(h => (
                <div key={h} style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>
            {TOP_RULES.map((r, i) => (
              <motion.div
                key={r.rank}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.40 + i * 0.05 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "36px 1fr 80px 80px 90px 150px",
                  padding: "14px 20px",
                  borderBottom: i < TOP_RULES.length - 1 ? "1px solid hsl(220 13% 9%)" : "none",
                  alignItems: "center",
                  gap: 16,
                  borderLeft: `2px solid ${r.color}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "hsl(220 13% 8%)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: "hsl(215 16% 28%)", fontFamily: "var(--app-font-mono)" }}>
                  {String(r.rank).padStart(2, "0")}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "hsl(215 16% 62%)", lineHeight: 1.5 }}>{r.rule}</div>
                <div style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: r.color, border: `1px solid ${r.color}40`, background: `${r.color}0d`,
                  padding: "3px 7px", textAlign: "center",
                }}>
                  {r.lane}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "var(--app-font-mono)" }}>{r.fires}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: r.successRate >= 98 ? ACCENT : "#10b981", fontFamily: "var(--app-font-mono)" }}>
                  {r.successRate}%
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{r.avgOutcomeShift}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Outcome Correlation by Communication Type ── */}
        <motion.div {...fadeUp(0.42)} style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>07 — Outcome Correlation by Communication Type</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
          </div>
          <p style={{ fontSize: 11, color: "hsl(215 16% 40%)", lineHeight: 1.7, marginBottom: 18, maxWidth: 640 }}>
            Statistical correlation (0–1) between communication delivery and measurable outcome change — not volume, not impressions. A score of 0.8 means 80% of measured outcomes followed a routed communication within the defined attribution window.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
            {OUTCOME_TYPES.map((o, i) => {
              const barW = Math.round(o.correlation * 100);
              return (
                <motion.div
                  key={o.type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.46 + i * 0.06 }}
                  style={{
                    background: "hsl(220 13% 7%)",
                    border: "1px solid hsl(220 13% 10%)",
                    borderTop: `2px solid ${o.color}`,
                    padding: "22px 22px",
                  }}
                >
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 30%)", textTransform: "uppercase", marginBottom: 12 }}>
                    {o.type}
                  </div>
                  {/* Correlation score */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
                    <div style={{ fontSize: 38, fontWeight: 800, color: o.color, fontFamily: "var(--app-font-mono)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                      {o.correlation.toFixed(2)}
                    </div>
                    <div style={{ paddingBottom: 4 }}>
                      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
                        Correlation
                      </div>
                    </div>
                  </div>
                  {/* Bar */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ height: 4, background: "hsl(220 13% 12%)", marginBottom: 6 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barW}%` }}
                        transition={{ delay: 0.6 + i * 0.05, duration: 0.7, ease: "easeOut" }}
                        style={{ height: "100%", background: o.color }}
                      />
                    </div>
                  </div>
                  {/* Trend sparkline */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 6 }}>8-Week Trend</div>
                    <LineSparkline data={o.trend.map(v => Math.round(v * 100))} color={o.color} />
                  </div>
                  {/* Meta */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 3 }}>Top Channel</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: o.color }}>{o.topChannel}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 3 }}>Avg Attribution Delay</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "hsl(215 16% 52%)", fontFamily: "var(--app-font-mono)" }}>{o.avgDelay}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 3 }}>8-Week Volume</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "hsl(215 16% 52%)", fontFamily: "var(--app-font-mono)" }}>{o.volume}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 3 }}>Direction</div>
                      <div style={{ fontSize: 8, fontWeight: 700, color: "#10b981", letterSpacing: "0.08em" }}>▲ RISING</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Behavioural Response Trends ── */}
        <motion.div {...fadeUp(0.5)}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>08 — Behavioural Response Trends</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
          </div>
          <p style={{ fontSize: 11, color: "hsl(215 16% 40%)", lineHeight: 1.7, marginBottom: 20, maxWidth: 620 }}>
            8-week journey per channel: message sent → response received → action taken → measurable outcome. Narrowing funnel is expected — the gap between each stage reveals where behavioural energy is lost.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {TREND_DATA.map((ch, i) => {
              const actionRates = computeActionRates(ch.sent, ch.action);
              const responseRates = computeResponseRates(ch.sent, ch.response);
              const firstActionRate = actionRates[0];
              const lastActionRate = actionRates[actionRates.length - 1];
              const firstResponseRate = responseRates[0];
              const lastResponseRate = responseRates[responseRates.length - 1];
              const actionDelta = lastActionRate - firstActionRate;
              return (
              <motion.div
                key={ch.channel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 + i * 0.06 }}
                style={{
                  background: "hsl(220 13% 7%)",
                  border: "1px solid hsl(220 13% 10%)",
                  borderTop: `2px solid ${ch.color}`,
                  padding: "20px 22px",
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{ch.channel}</div>
                  <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "hsl(215 16% 34%)", textTransform: "uppercase" }}>8-week causal chain</div>
                </div>

                {/* Funnel stages */}
                {[
                  { label: "Sent", data: ch.sent, color: "hsl(215 16% 44%)" },
                  { label: "Response", data: ch.response, color: ch.color },
                  { label: "Action", data: ch.action, color: "#10b981" },
                  { label: "Outcome", data: ch.outcome, color: "#a78bfa" },
                ].map((stage, si) => {
                  const latest = stage.data[stage.data.length - 1];
                  const prev = stage.data[stage.data.length - 2];
                  const delta = latest - prev;
                  return (
                    <div
                      key={stage.label}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "72px 160px 1fr",
                        alignItems: "center",
                        gap: 14,
                        marginBottom: si < 3 ? 14 : 0,
                        paddingBottom: si < 3 ? 14 : 0,
                        borderBottom: si < 3 ? "1px solid hsl(220 13% 9%)" : "none",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 30%)", textTransform: "uppercase", marginBottom: 3 }}>
                          {stage.label}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: stage.color, fontFamily: "var(--app-font-mono)", letterSpacing: "-0.02em" }}>
                          {latest}
                        </div>
                        <div style={{ fontSize: 8.5, color: delta >= 0 ? "#10b981" : "#ef4444", fontFamily: "var(--app-font-mono)" }}>
                          {delta >= 0 ? "+" : ""}{delta}
                        </div>
                      </div>
                      <LineSparkline data={stage.data} color={stage.color} />
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          {WEEKS.map((w, wi) => (
                            <div key={w} style={{ fontSize: 7, color: wi === WEEKS.length - 1 ? "hsl(215 16% 40%)" : "hsl(215 16% 22%)", letterSpacing: "0.04em" }}>{w}</div>
                          ))}
                        </div>
                        {si > 0 && (
                          <div style={{ fontSize: 9, color: "hsl(215 16% 30%)" }}>
                            Conv. {Math.round((latest / ch.sent[ch.sent.length - 1]) * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* ── WoW Conversion Rate Trend ── */}
                <div style={{
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: "1px solid hsl(220 13% 11%)",
                  background: "hsl(220 13% 6%)",
                  margin: "18px -22px -20px",
                  padding: "14px 22px 18px",
                }}>
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 30%)", textTransform: "uppercase", marginBottom: 3 }}>
                        Conversion Rate · Week over Week
                      </div>
                      <div style={{ fontSize: 8.5, color: "hsl(215 16% 36%)" }}>
                        Action rate % across 8 weeks
                      </div>
                    </div>
                    <WoWTrendBadge first={firstActionRate} last={lastActionRate} />
                  </div>

                  {/* Dual sparkline: action rate + response rate */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {/* Action rate sparkline */}
                    <div>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: "#10b981", textTransform: "uppercase", marginBottom: 6 }}>
                        Action Rate %
                      </div>
                      <LineSparkline data={actionRates} color="#10b981" width={140} height={34} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                        {WEEKS.map((w, wi) => (
                          <div key={w} style={{ fontSize: 6.5, color: wi === WEEKS.length - 1 ? "hsl(215 16% 38%)" : "hsl(215 16% 20%)", letterSpacing: "0.04em" }}>{w}</div>
                        ))}
                      </div>
                      {/* W1 → W8 callout */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                        <div>
                          <div style={{ fontSize: 6.5, color: "hsl(215 16% 28%)", letterSpacing: "0.1em", textTransform: "uppercase" }}>W1</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(215 16% 42%)", fontFamily: "var(--app-font-mono)" }}>{firstActionRate.toFixed(1)}%</div>
                        </div>
                        <div style={{ fontSize: 9, color: "hsl(215 16% 24%)" }}>→</div>
                        <div>
                          <div style={{ fontSize: 6.5, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase" }}>W8</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", fontFamily: "var(--app-font-mono)" }}>{lastActionRate.toFixed(1)}%</div>
                        </div>
                        <div style={{
                          marginLeft: "auto",
                          fontSize: 9, fontWeight: 700,
                          color: actionDelta >= 0 ? "#10b981" : "#ef4444",
                          fontFamily: "var(--app-font-mono)",
                        }}>
                          {actionDelta >= 0 ? "+" : ""}{actionDelta.toFixed(1)}pp
                        </div>
                      </div>
                    </div>

                    {/* Response rate sparkline */}
                    <div>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: ch.color, textTransform: "uppercase", marginBottom: 6 }}>
                        Response Rate %
                      </div>
                      <LineSparkline data={responseRates} color={ch.color} width={140} height={34} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                        {WEEKS.map((w, wi) => (
                          <div key={w} style={{ fontSize: 6.5, color: wi === WEEKS.length - 1 ? "hsl(215 16% 38%)" : "hsl(215 16% 20%)", letterSpacing: "0.04em" }}>{w}</div>
                        ))}
                      </div>
                      {/* W1 → W8 callout */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                        <div>
                          <div style={{ fontSize: 6.5, color: "hsl(215 16% 28%)", letterSpacing: "0.1em", textTransform: "uppercase" }}>W1</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(215 16% 42%)", fontFamily: "var(--app-font-mono)" }}>{firstResponseRate.toFixed(1)}%</div>
                        </div>
                        <div style={{ fontSize: 9, color: "hsl(215 16% 24%)" }}>→</div>
                        <div>
                          <div style={{ fontSize: 6.5, color: ch.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>W8</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: ch.color, fontFamily: "var(--app-font-mono)" }}>{lastResponseRate.toFixed(1)}%</div>
                        </div>
                        <div style={{
                          marginLeft: "auto",
                          fontSize: 9, fontWeight: 700,
                          color: (lastResponseRate - firstResponseRate) >= 0 ? "#10b981" : "#ef4444",
                          fontFamily: "var(--app-font-mono)",
                        }}>
                          {(lastResponseRate - firstResponseRate) >= 0 ? "+" : ""}{(lastResponseRate - firstResponseRate).toFixed(1)}pp
                        </div>
                      </div>
                    </div>
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
