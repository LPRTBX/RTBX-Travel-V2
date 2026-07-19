import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

/* ─── Palette ─────────────────────────────────────────── */
const C = {
  amber:  "#c9a84c",
  blue:   "#3b82f6",
  green:  "#10b981",
  red:    "#ef4444",
  violet: "#a78bfa",
  cyan:   "#22d3ee",
  slate:  "hsl(215 16% 44%)",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 36%)",
  dimmed: "hsl(215 16% 22%)",
};

/* ─── Types ───────────────────────────────────────────── */
type LaneType  = "Guest" | "Workforce" | "Operations" | "Executive" | "Partner";
type Channel   = "App" | "SMS" | "Email" | "Radio" | "Dashboard" | "PMS" | "Webhook";
type CommStatus = "Delivered" | "Pending" | "Failed";

const LANE_COLOR: Record<LaneType, string> = {
  Guest:      C.amber,
  Workforce:  C.blue,
  Operations: C.violet,
  Executive:  "#f43f5e",
  Partner:    C.green,
};

const STATUS_COLOR: Record<CommStatus, string> = {
  Delivered: C.green,
  Pending:   C.amber,
  Failed:    C.red,
};

const CHANNEL_COLOR: Record<Channel, string> = {
  App:       C.violet,
  SMS:       C.green,
  Email:     C.blue,
  Radio:     C.amber,
  Dashboard: C.slate,
  PMS:       "hsl(215 16% 40%)",
  Webhook:   C.cyan,
};

interface CommRecord {
  id:        string;
  timestamp: string;
  lane:      LaneType;
  trigger:   string;
  audience:  string;
  channel:   Channel;
  status:    CommStatus;
  outcome:   string;
  latencyMs: number;
  momentId?: string;
}

/* ─── Trend data generation ───────────────────────────── */
function seededRnd(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function makeTrend(seed: number, base: number, vol: number, drift: number): number[] {
  return Array.from({ length: 30 }, (_, i) => {
    const noise = (seededRnd(seed + i * 6.1) - 0.5) * vol;
    const trend = drift * (i / 29);
    return Math.min(99, Math.max(30, base + trend + noise));
  });
}

/* Delivery rate % by lane over last 30 days */
const LANE_TREND: Record<LaneType, number[]> = {
  Guest:      makeTrend(11, 84, 14, +5),
  Workforce:  makeTrend(22, 78, 12, +2),
  Operations: makeTrend(33, 72, 18, -4),
  Executive:  makeTrend(44, 91, 8,  +3),
  Partner:    makeTrend(55, 69, 20, +8),
};

/* Per-record sparkline: 30 days of delivery-rate-like values keyed by id seed */
function recordTrend(idSeed: number, lane: LaneType): number[] {
  const base = LANE_TREND[lane][29];
  return makeTrend(idSeed * 17.3, base, 22, (seededRnd(idSeed * 3.7) - 0.5) * 12);
}

/* ─── Sample data ─────────────────────────────────────── */
const RECORDS: CommRecord[] = [
  /* Guest */
  {
    id: "CR-001", timestamp: "09:14", lane: "Guest",
    trigger: "VIP Arrival · Loyalty Tier Gold+",
    audience: "Arriving VIP Guest",
    channel: "App", status: "Delivered",
    outcome: "Guest upgraded · Welcome gift acknowledged · NPS +1 logged",
    latencyMs: 210,
    momentId: "GM-002",
  },
  {
    id: "CR-002", timestamp: "11:32", lane: "Guest",
    trigger: "Service Recovery Window · Sentiment decline detected",
    audience: "Affected Guest",
    channel: "SMS", status: "Delivered",
    outcome: "Duty Manager contact initiated · F&B credit redeemed within 18 min",
    latencyMs: 185,
    momentId: "GM-004",
  },
  {
    id: "CR-003", timestamp: "12:05", lane: "Guest",
    trigger: "First-Stay Anxiety Pattern · Check-in complete",
    audience: "First-time Guest",
    channel: "App", status: "Delivered",
    outcome: "Concierge introduction viewed · Room preferences confirmed",
    latencyMs: 320,
    momentId: "GM-003",
  },
  {
    id: "CR-004", timestamp: "07:48", lane: "Guest",
    trigger: "Loyalty Activation Window · Departure day detected",
    audience: "Gold Tier Member",
    channel: "App", status: "Delivered",
    outcome: "14:00 checkout accepted · Loyalty value preserved",
    latencyMs: 290,
    momentId: "GM-005",
  },
  {
    id: "CR-005", timestamp: "15:22", lane: "Guest",
    trigger: "Suite Upgrade Window · Anniversary stay · Propensity 87",
    audience: "Standard Room Guest",
    channel: "App", status: "Delivered",
    outcome: "Junior Suite accepted · £85 supplement captured",
    latencyMs: 175,
    momentId: "CM-001",
  },
  {
    id: "CR-006", timestamp: "16:44", lane: "Guest",
    trigger: "Departure Feedback Loop · Stay concluded",
    audience: "Departing Guest",
    channel: "Email", status: "Pending",
    outcome: "Awaiting open — review link not yet clicked",
    latencyMs: 0,
    momentId: "CM-004",
  },
  {
    id: "CR-007", timestamp: "13:59", lane: "Guest",
    trigger: "Dining Reservation Prompt · F&B Upsell Window open",
    audience: "In-house Guest (2-night stay)",
    channel: "App", status: "Failed",
    outcome: "App session inactive — guest did not open notification",
    latencyMs: 0,
    momentId: "CM-002",
  },

  /* Workforce */
  {
    id: "CR-008", timestamp: "14:08", lane: "Workforce",
    trigger: "Staff Capacity Gap · Foyer queue > threshold",
    audience: "F&B Team Lead",
    channel: "Radio", status: "Delivered",
    outcome: "2 staff redeployed · Queue resolved in 8 min",
    latencyMs: 95,
    momentId: "WF-001",
  },
  {
    id: "CR-009", timestamp: "10:55", lane: "Workforce",
    trigger: "Welfare Check Trigger · 3 consecutive low-engagement shifts",
    audience: "HR Manager",
    channel: "Dashboard", status: "Delivered",
    outcome: "1:1 scheduled for 16:00 · Workload review pending",
    latencyMs: 520,
    momentId: "WF-003",
  },
  {
    id: "CR-010", timestamp: "14:58", lane: "Workforce",
    trigger: "Shift Handover Risk · Automated at shift boundary",
    audience: "Incoming Shift Lead",
    channel: "App", status: "Delivered",
    outcome: "3 open moments acknowledged · Escalations flagged",
    latencyMs: 310,
    momentId: "WF-002",
  },
  {
    id: "CR-011", timestamp: "09:02", lane: "Workforce",
    trigger: "Performance Deviation Alert · Housekeeping productivity -18%",
    audience: "Head Housekeeper",
    channel: "Dashboard", status: "Pending",
    outcome: "Alert visible — no acknowledgement recorded yet",
    latencyMs: 0,
    momentId: "WF-004",
  },

  /* Operations */
  {
    id: "CR-012", timestamp: "12:41", lane: "Operations",
    trigger: "Housekeeping Bottleneck · 6 VIP rooms pending",
    audience: "Housekeeping Supervisor",
    channel: "PMS", status: "Delivered",
    outcome: "VIP rooms prioritised · 0 VIP delays at 14:00 arrival",
    latencyMs: 140,
    momentId: "OP-002",
  },
  {
    id: "CR-013", timestamp: "13:17", lane: "Operations",
    trigger: "Maintenance Escalation Risk · Non-critical HVAC fault",
    audience: "Engineering Lead",
    channel: "Dashboard", status: "Delivered",
    outcome: "Post-15:00 maintenance slot confirmed · Monitoring active",
    latencyMs: 460,
    momentId: "OP-003",
  },
  {
    id: "CR-014", timestamp: "11:48", lane: "Operations",
    trigger: "Supply Threshold Alert · F&B stock below 20%",
    audience: "F&B Manager",
    channel: "App", status: "Delivered",
    outcome: "Emergency order placed · ETA 16:30 confirmed",
    latencyMs: 225,
    momentId: "OP-004",
  },
  {
    id: "CR-015", timestamp: "17:03", lane: "Operations",
    trigger: "Energy Anomaly · Ballroom HVAC overconsumption",
    audience: "Facilities Controller",
    channel: "Dashboard", status: "Failed",
    outcome: "Routing error — recipient offline at time of dispatch",
    latencyMs: 0,
    momentId: "OP-003",
  },

  /* Executive */
  {
    id: "CR-016", timestamp: "08:00", lane: "Executive",
    trigger: "Portfolio Performance Deviation · NPS -2.1 pts over 30 days",
    audience: "COO",
    channel: "Email", status: "Delivered",
    outcome: "Brand experience audit initiated · BXOS review scheduled",
    latencyMs: 615,
    momentId: "ST-001",
  },
  {
    id: "CR-017", timestamp: "08:00", lane: "Executive",
    trigger: "Cross-Property Learning Signal · 3 properties · 4-week alignment",
    audience: "General Manager + COO",
    channel: "Dashboard", status: "Delivered",
    outcome: "Friday staffing model review added to board agenda",
    latencyMs: 580,
    momentId: "ST-002",
  },
  {
    id: "CR-018", timestamp: "22:00", lane: "Executive",
    trigger: "Automated · End of operational day",
    audience: "Executive Team",
    channel: "Email", status: "Pending",
    outcome: "Digest scheduled for 22:00 send — not yet dispatched",
    latencyMs: 0,
    momentId: "ST-003",
  },

  /* Partner */
  {
    id: "CR-019", timestamp: "10:22", lane: "Partner",
    trigger: "Supplier SLA Breach · Linen delivery 47 min late",
    audience: "Supply Account Manager",
    channel: "Webhook", status: "Delivered",
    outcome: "SLA breach logged · Credit note request initiated",
    latencyMs: 88,
  },
  {
    id: "CR-020", timestamp: "15:44", lane: "Partner",
    trigger: "Co-Activation Revenue Window · Spa capacity open",
    audience: "Wellness Partner",
    channel: "Email", status: "Delivered",
    outcome: "3 referral bookings placed · £240 revenue activated",
    latencyMs: 395,
    momentId: "CM-002",
  },
];

const ALL_LANES: LaneType[] = ["Guest", "Workforce", "Operations", "Executive", "Partner"];

/* ─── Derived stats ───────────────────────────────────── */
function useStats(records: CommRecord[]) {
  return useMemo(() => {
    const total     = records.length;
    const delivered = records.filter(r => r.status === "Delivered").length;
    const rate      = total > 0 ? Math.round((delivered / total) * 100) : 0;
    const avgMs     = delivered > 0
      ? Math.round(records.filter(r => r.status === "Delivered").reduce((s, r) => s + r.latencyMs, 0) / delivered)
      : 0;
    const chCount: Record<Channel, number> = {} as Record<Channel, number>;
    records.filter(r => r.status === "Delivered").forEach(r => { chCount[r.channel] = (chCount[r.channel] ?? 0) + 1; });
    const topChannel = (Object.entries(chCount) as [Channel, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    return { total, delivered, rate, avgMs, topChannel };
  }, [records]);
}

/* ─── Animated count-up ───────────────────────────────── */
function CountUp({ target, suffix = "", duration = 1.1 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return <>{count}{suffix}</>;
}

/* ─── Small badge ─────────────────────────────────────── */
function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color, border: `1px solid ${color}33`, padding: "2px 7px", background: `${color}0d`,
      whiteSpace: "nowrap", flexShrink: 0,
    }}>{text}</span>
  );
}

/* ─── Status dot badge ────────────────────────────────── */
function StatusBadge({ status }: { status: CommStatus }) {
  const color = STATUS_COLOR[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color, border: `1px solid ${color}33`, padding: "2px 8px", background: `${color}0d`,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* ─── Search icon ─────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="5.5" cy="5.5" r="4.25" stroke="hsl(215 16% 32%)" strokeWidth="1.2" />
      <line x1="8.7" y1="8.7" x2="12" y2="12" stroke="hsl(215 16% 32%)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── View Moment link ────────────────────────────────── */
function ViewMomentLink({ momentId }: { momentId: string }) {
  const [, navigate] = useLocation();
  return (
    <button
      onClick={() => navigate(`/moment-registry#${momentId}`)}
      title={`View moment ${momentId} in the Moment Registry`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: C.cyan,
        background: `${C.cyan}0d`,
        border: `1px solid ${C.cyan}33`,
        padding: "3px 7px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        lineHeight: 1.5,
      }}
    >
      <span style={{ opacity: 0.7, fontSize: 8 }}>↗</span>
      {momentId}
    </button>
  );
}

/* ─── Inline sparkline ────────────────────────────────── */
function Sparkline({ data, color, w = 52, h = 18 }: { data: number[]; color: string; w?: number; h?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const last  = data[data.length - 1];
  const first = data[0];
  const rising = last > first + 1;
  const falling = last < first - 1;
  const trendColor = rising ? C.green : falling ? C.red : C.amber;
  const arrow = rising ? "↑" : falling ? "↓" : "→";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", flexShrink: 0 }}>
        <defs>
          <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth="1.1"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* end dot */}
        {(() => {
          const lastPt = pts.split(" ").pop()!.split(",");
          return (
            <circle
              cx={parseFloat(lastPt[0])}
              cy={parseFloat(lastPt[1])}
              r="1.8"
              fill={color}
              opacity="0.9"
            />
          );
        })()}
      </svg>
      <span style={{ fontSize: 7, fontWeight: 700, color: trendColor, letterSpacing: "0.04em", lineHeight: 1 }}>
        {arrow}{Math.abs(Math.round(last - first))}%
      </span>
    </div>
  );
}

/* ─── Summary trend chart ─────────────────────────────── */
function TrendChart() {
  const W = 860, H = 130, PAD_L = 36, PAD_R = 12, PAD_T = 12, PAD_B = 28;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const days   = 30;

  /* y-grid lines */
  const yTicks = [40, 60, 80, 100];

  function toXY(day: number, val: number) {
    const x = PAD_L + (day / (days - 1)) * chartW;
    const y = PAD_T + chartH - ((val - 30) / 70) * chartH;
    return { x, y };
  }

  function makePath(trend: number[]) {
    return trend
      .map((v, i) => {
        const { x, y } = toXY(i, v);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }

  /* x-axis labels: every 7 days */
  const today = new Date(2026, 5, 11); // June 11 2026
  const xLabels: { day: number; label: string }[] = [];
  for (let i = 0; i < days; i += 7) {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    xLabels.push({ day: i, label: `${d.toLocaleString("en", { month: "short" })} ${d.getDate()}` });
  }
  xLabels.push({
    day: days - 1,
    label: "Today",
  });

  const [hovered, setHovered] = useState<LaneType | null>(null);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "20px 24px 16px", marginBottom: 20 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.cyan, textTransform: "uppercase", marginBottom: 4 }}>
            Delivery Performance · 30-Day Trend
          </div>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.03em" }}>
            Aggregate delivery rate (%) by communication lane
          </div>
        </div>
        {/* legend */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {ALL_LANES.map(lane => {
            const color = LANE_COLOR[lane];
            const trend = LANE_TREND[lane];
            const delta = Math.round(trend[trend.length - 1] - trend[0]);
            const isHov = hovered === lane;
            return (
              <button
                key={lane}
                onMouseEnter={() => setHovered(lane)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
                  cursor: "pointer", opacity: hovered && !isHov ? 0.3 : 1, transition: "opacity 0.15s",
                }}
              >
                <span style={{ width: 20, height: 2, background: color, display: "inline-block", borderRadius: 1 }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: isHov ? "#fff" : "hsl(215 16% 48%)", letterSpacing: "0.06em" }}>
                  {lane}
                </span>
                <span style={{
                  fontSize: 7.5, fontWeight: 700, color: delta >= 0 ? C.green : C.red,
                  background: delta >= 0 ? `${C.green}12` : `${C.red}12`,
                  border: `1px solid ${delta >= 0 ? C.green : C.red}33`,
                  padding: "1px 5px",
                }}>
                  {delta >= 0 ? "+" : ""}{delta}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* chart */}
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* y grid */}
        {yTicks.map(tick => {
          const y = PAD_T + chartH - ((tick - 30) / 70) * chartH;
          return (
            <g key={tick}>
              <line
                x1={PAD_L} y1={y} x2={W - PAD_R} y2={y}
                stroke="hsl(220 13% 10%)" strokeWidth="1"
              />
              <text x={PAD_L - 5} y={y + 3.5} textAnchor="end"
                fill="hsl(215 16% 24%)" fontSize="7" fontFamily="monospace">
                {tick}%
              </text>
            </g>
          );
        })}

        {/* x labels */}
        {xLabels.map(({ day, label }) => {
          const x = PAD_L + (day / (days - 1)) * chartW;
          return (
            <text key={day} x={x} y={H - 5} textAnchor="middle"
              fill="hsl(215 16% 22%)" fontSize="7" fontFamily="monospace">
              {label}
            </text>
          );
        })}

        {/* lines — dimmed ones first, then hovered on top */}
        {ALL_LANES.filter(l => l !== hovered).map(lane => {
          const color = LANE_COLOR[lane];
          const trend = LANE_TREND[lane];
          const dim   = hovered !== null;
          return (
            <path
              key={lane}
              d={makePath(trend)}
              fill="none"
              stroke={color}
              strokeWidth="1.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={dim ? 0.12 : 0.55}
            />
          );
        })}
        {hovered && (() => {
          const lane  = hovered;
          const color = LANE_COLOR[lane];
          const trend = LANE_TREND[lane];
          const endPt = toXY(days - 1, trend[days - 1]);
          return (
            <g>
              <path
                d={makePath(trend)}
                fill="none"
                stroke={color}
                strokeWidth="2.2"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.9"
              />
              <circle cx={endPt.x} cy={endPt.y} r="3.5" fill={color} opacity="0.9" />
              <rect
                x={endPt.x + 6} y={endPt.y - 9}
                width="42" height="14" rx="2"
                fill="hsl(220 13% 10%)" stroke={`${color}44`} strokeWidth="1"
              />
              <text x={endPt.x + 10} y={endPt.y + 1}
                fill={color} fontSize="8" fontWeight="700" fontFamily="monospace">
                {Math.round(trend[days - 1])}%
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

/* ─── Table row ───────────────────────────────────────── */
function TableRow({ r, i }: { r: CommRecord; i: number }) {
  const laneColor = LANE_COLOR[r.lane];
  const chColor   = CHANNEL_COLOR[r.channel];
  const idNum     = parseInt(r.id.replace("CR-", ""), 10);
  const spark     = useMemo(() => recordTrend(idNum, r.lane), [idNum, r.lane]);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03, duration: 0.28 }}
      style={{
        borderBottom: `1px solid ${C.border}`,
        borderLeft: `3px solid ${laneColor}`,
      }}
    >
      {/* Timestamp + ID */}
      <td style={{ padding: "13px 16px", verticalAlign: "top", whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "hsl(215 16% 50%)", fontFamily: "monospace" }}>
          {r.timestamp}
        </div>
        <div style={{ fontSize: 7.5, letterSpacing: "0.08em", color: C.dimmed, marginTop: 3, fontFamily: "monospace" }}>
          {r.id}
        </div>
      </td>

      {/* Lane */}
      <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
        <Badge text={r.lane} color={laneColor} />
      </td>

      {/* Trigger */}
      <td style={{ padding: "13px 16px", verticalAlign: "top", maxWidth: 240 }}>
        <div style={{ fontSize: 10.5, color: "hsl(215 16% 52%)", lineHeight: 1.55 }}>
          {r.trigger}
        </div>
      </td>

      {/* Audience */}
      <td style={{ padding: "13px 16px", verticalAlign: "top", maxWidth: 180 }}>
        <div style={{ fontSize: 10.5, color: "hsl(215 16% 44%)", lineHeight: 1.55 }}>
          {r.audience}
        </div>
      </td>

      {/* Channel */}
      <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
        <Badge text={r.channel} color={chColor} />
      </td>

      {/* Status + sparkline trend */}
      <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
        <StatusBadge status={r.status} />
        {r.status === "Delivered" && (
          <div style={{ fontSize: 7.5, color: C.dimmed, marginTop: 4, letterSpacing: "0.06em" }}>
            {r.latencyMs < 1000
              ? `${r.latencyMs}ms`
              : `${(r.latencyMs / 1000).toFixed(1)}s`}
          </div>
        )}
        <Sparkline data={spark} color={laneColor} />
      </td>

      {/* Outcome */}
      <td style={{ padding: "13px 16px", verticalAlign: "top" }}>
        <div style={{ fontSize: 10.5, color: "hsl(215 16% 44%)", lineHeight: 1.55 }}>
          {r.outcome}
        </div>
      </td>

      {/* View Moment */}
      <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
        {r.momentId
          ? <ViewMomentLink momentId={r.momentId} />
          : <span style={{ fontSize: 8, color: C.dimmed, letterSpacing: "0.06em" }}>—</span>
        }
      </td>
    </motion.tr>
  );
}

/* ─── Page ─────────────────────────────────────────────── */
export default function CommunicationRegistry() {
  const [activeLane, setActiveLane]   = useState<LaneType | "All">("All");
  const [activeStatus, setActiveStatus] = useState<CommStatus | "All">("All");
  const [search, setSearch]           = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return RECORDS.filter(r => {
      if (activeLane !== "All" && r.lane !== activeLane) return false;
      if (activeStatus !== "All" && r.status !== activeStatus) return false;
      if (q) {
        return (
          r.trigger.toLowerCase().includes(q) ||
          r.audience.toLowerCase().includes(q) ||
          r.channel.toLowerCase().includes(q) ||
          r.lane.toLowerCase().includes(q) ||
          r.outcome.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeLane, activeStatus, search]);

  const stats = useStats(RECORDS);

  const laneCounts = useMemo(() =>
    ALL_LANES.reduce<Record<string, number>>((a, l) => {
      a[l] = RECORDS.filter(r => r.lane === l).length;
      return a;
    }, {}),
  []);

  const COL_HDR: React.CSSProperties = {
    padding: "10px 16px",
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: C.dimmed,
    textAlign: "left",
    borderBottom: `1px solid ${C.border}`,
    whiteSpace: "nowrap",
    background: "hsl(220 13% 6%)",
  };

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.cyan, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Communications Layer
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Communication Registry
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
              Every routed communication — logged from trigger to outcome.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
              {RECORDS.length} communications logged today
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 16%)", textTransform: "uppercase" }}>
              5 lanes · NEXUS routed
            </div>
          </div>
        </motion.div>

        {/* ── Stat strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 20 }}
        >
          {[
            { label: "Total Routed",     value: stats.total,    unit: "TODAY",          color: C.cyan,  isCount: true,   suffix: ""   },
            { label: "Delivery Rate",    value: stats.rate,     unit: "OF ALL SENDS",   color: C.green, isCount: true,   suffix: "%"  },
            { label: "Avg Latency",      value: Math.round(stats.avgMs / 10) * 10, unit: "DELIVERED MSGS", color: C.amber, isCount: true, suffix: "ms" },
            { label: "Top Channel",      value: stats.topChannel, unit: "MOST DELIVERED", color: C.violet, isCount: false, suffix: "" },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.07 }}
              style={{
                padding: "18px 20px",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderTop: `2px solid ${m.color}`,
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 7 }}>
                {m.isCount
                  ? <CountUp target={m.value as number} suffix={m.suffix} />
                  : <span>{m.value}</span>
                }
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 5 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>
                {m.unit}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Summary trend chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.38 }}
        >
          <TrendChart />
        </motion.div>

        {/* ── Controls: search row ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.35 }}
          style={{ marginBottom: 1 }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "0 16px",
            height: 42,
            background: "hsl(220 13% 7%)",
            border: `1px solid ${C.border}`,
          }}>
            <SearchIcon />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, trigger, audience, or outcome…"
              style={{
                background: "transparent", border: "none", outline: "none",
                fontSize: 11, color: "hsl(215 16% 65%)", width: "100%",
                fontFamily: "inherit",
              }}
            />
            {search ? (
              <button
                onClick={() => setSearch("")}
                title="Clear search"
                style={{ background: "none", border: "none", cursor: "pointer", color: C.dimmed, padding: "0 2px", fontSize: 14, lineHeight: 1, flexShrink: 0 }}
              >×</button>
            ) : (
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: "hsl(215 16% 18%)", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>
                {filtered.length} results
              </span>
            )}
          </div>
        </motion.div>

        {/* ── Controls: lane filter + status filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.35 }}
          style={{ display: "flex", gap: 1, alignItems: "stretch", marginBottom: 0 }}
        >
          {/* Lane tabs */}
          <div style={{ display: "flex", gap: 1, flex: 1 }}>
            {(["All", ...ALL_LANES] as Array<"All" | LaneType>).map((lane) => {
              const isActive = activeLane === lane;
              const color    = lane === "All" ? C.cyan : LANE_COLOR[lane];
              const count    = lane === "All" ? RECORDS.length : laneCounts[lane];
              return (
                <button
                  key={lane}
                  onClick={() => setActiveLane(lane)}
                  style={{
                    flex: 1, padding: "10px 10px",
                    background: isActive ? "hsl(220 13% 9%)" : "transparent",
                    border: `1px solid ${isActive ? color + "44" : "hsl(220 13% 10%)"}`,
                    borderTop: isActive ? `2px solid ${color}` : "2px solid transparent",
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", color: isActive ? "#fff" : "hsl(215 16% 36%)" }}>
                    {lane === "All" ? "All" : lane}
                  </span>
                  <span style={{
                    fontSize: 7.5, fontWeight: 700, color: isActive ? color : C.dimmed,
                    border: `1px solid ${isActive ? color + "33" : "transparent"}`,
                    padding: "1px 4px",
                    background: isActive ? `${color}0d` : "transparent",
                  }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", gap: 1 }}>
            {(["All", "Delivered", "Pending", "Failed"] as Array<"All" | CommStatus>).map((s) => {
              const isActive = activeStatus === s;
              const color    = s === "All" ? C.slate : STATUS_COLOR[s];
              return (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  style={{
                    padding: "10px 14px",
                    background: isActive ? "hsl(220 13% 9%)" : "transparent",
                    border: `1px solid ${isActive ? color + "44" : "hsl(220 13% 10%)"}`,
                    borderTop: isActive ? `2px solid ${color}` : "2px solid transparent",
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  {s !== "All" && (
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: isActive ? color : "hsl(215 16% 24%)", display: "inline-block", flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: isActive ? "#fff" : "hsl(215 16% 32%)", whiteSpace: "nowrap" }}>
                    {s}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Table ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36, duration: 0.35 }}
          style={{
            border: `1px solid ${C.border}`,
            borderTop: "none",
            background: "hsl(220 13% 6%)",
            marginBottom: 24,
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 88  }} />
              <col style={{ width: 108 }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: 96  }} />
              <col style={{ width: 130 }} />
              <col />
              <col style={{ width: 100 }} />
            </colgroup>
            <thead>
              <tr>
                {["Time / ID", "Lane", "Trigger", "Audience", "Channel", "Status · 30d Trend", "Outcome", "Moment"].map(h => (
                  <th key={h} style={COL_HDR}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((r, i) => <TableRow key={r.id} r={r} i={i} />)
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: "36px 24px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: C.dimmed, letterSpacing: "0.08em" }}>
                      No communications match the current filters.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        {/* ── Result count + legend ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.52, duration: 0.35 }}
          style={{
            padding: "12px 20px",
            border: `1px solid ${C.border}`,
            background: C.card,
            display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase" }}>
            {filtered.length} of {RECORDS.length} records
          </span>
          <div style={{ width: 1, height: 12, background: C.border }} />
          {(["Delivered", "Pending", "Failed"] as CommStatus[]).map(s => (
            <div key={s} style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLOR[s] }} />
              <span style={{ fontSize: 8.5, color: C.dimmed, letterSpacing: "0.06em" }}>{s}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 14%)", textTransform: "uppercase" }}>
            NEXUS · VECTOR · WELBX Communication Registry
          </div>
        </motion.div>

      </div>
    </div>
  );
}
