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

function LineSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 160;
  const H = 40;
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

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function CommunicationIntelligence() {
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
          </div>
          <p style={{ fontSize: 11, color: "hsl(215 16% 40%)", lineHeight: 1.7, marginBottom: 18, maxWidth: 620 }}>
            Action rate by channel × moment type. High-amber cells represent combinations where communication reliably changes behaviour. Use this to select the right channel for each moment class.
          </p>

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
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.outline = "1px solid rgba(201,168,76,0.3)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.outline = "none"; }}
                    >
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
          </div>
        </motion.div>

        {/* ── Behavioural Response Trends ── */}
        <motion.div {...fadeUp(0.3)}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>04 — Behavioural Response Trends</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
          </div>
          <p style={{ fontSize: 11, color: "hsl(215 16% 40%)", lineHeight: 1.7, marginBottom: 20, maxWidth: 620 }}>
            8-week journey per channel: message sent → response received → action taken → measurable outcome. Narrowing funnel is expected — the gap between each stage reveals where behavioural energy is lost.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {TREND_DATA.map((ch, i) => (
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
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
