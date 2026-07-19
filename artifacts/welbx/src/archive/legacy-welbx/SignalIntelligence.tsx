import { motion } from "framer-motion";

const ACCENT = "#c9a84c";

// Mini bar chart component
function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 2, background: "hsl(220 13% 12%)" }}>
      <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, transition: "width 0.6s ease" }} />
    </div>
  );
}

// Sparkline using inline divs
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 6;
  const gap = 2;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap, height: h }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            width: w,
            height: Math.max(2, ((v - min) / range) * h),
            background: i === data.length - 1 ? color : `${color}55`,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

const DENSITY_METRICS = [
  { label: "Guest Signals", value: 52, total: 80, rate: "+8%", trend: [28, 30, 34, 36, 38, 44, 48, 52], color: ACCENT },
  { label: "Workforce Signals", value: 44, total: 80, rate: "+3%", trend: [36, 37, 38, 40, 40, 42, 43, 44], color: "#a78bfa" },
  { label: "Operational Signals", value: 61, total: 80, rate: "+14%", trend: [30, 35, 40, 44, 50, 54, 58, 61], color: "#10b981" },
  { label: "Commercial Signals", value: 48, total: 80, rate: "+6%", trend: [38, 39, 41, 42, 44, 45, 47, 48], color: "#f59e0b" },
  { label: "Strategic Signals", value: 42, total: 80, rate: "+2%", trend: [38, 38, 39, 40, 40, 41, 41, 42], color: "#60a5fa" },
];

const INCREASING_SIGNALS = [
  { name: "Operational Signals", velocity: 94, delta: "+14% WoW", color: "#10b981", reason: "Room readiness and queue depth events rising" },
  { name: "Guest Sentiment Signals", velocity: 87, delta: "+11% WoW", color: ACCENT, reason: "Arrival and departure mood signals compounding" },
  { name: "Commercial Signals", velocity: 73, delta: "+6% WoW", color: "#f59e0b", reason: "Upsell windows and F&B propensity events increasing" },
  { name: "Workforce Engagement", velocity: 58, delta: "+4% WoW", color: "#a78bfa", reason: "Response latency and handover signals rising" },
  { name: "Strategic Signals", velocity: 31, delta: "+2% WoW", color: "#60a5fa", reason: "Brand sentiment and competitive position events" },
];

const HIGH_VALUE_SIGNALS = [
  { name: "Activation Exposure Index", contribution: 96, moments: 42, value: "High exposure index", color: ACCENT },
  { name: "Loyalty Recognition Gap", contribution: 91, moments: 38, value: "×3 urgency multiplier", color: ACCENT },
  { name: "Wait Anxiety", contribution: 88, moments: 67, value: "Avg risk: high", color: "#f59e0b" },
  { name: "F&B Propensity Score", contribution: 82, moments: 31, value: "Activation opportunity", color: "#10b981" },
  { name: "Upsell Conversion Window", contribution: 76, moments: 28, value: "Avg uplift score", color: "#10b981" },
  { name: "Guest Lifetime Value Shift", contribution: 71, moments: 19, value: "Portfolio-level impact", color: "#60a5fa" },
];

const RISK_SIGNALS = [
  { name: "Queue Depth", risk: 94, incidents: 23, category: "Operational", trend: [4, 5, 7, 6, 8, 9, 12, 14], alert: "CRITICAL" },
  { name: "Staff Capacity Ratio", risk: 88, incidents: 18, category: "Workforce", trend: [6, 6, 7, 8, 9, 10, 11, 13], alert: "HIGH" },
  { name: "Complaint Lag", risk: 79, incidents: 14, category: "Guest", trend: [2, 3, 3, 4, 5, 6, 8, 9], alert: "HIGH" },
  { name: "Brand Sentiment Drift", risk: 66, incidents: 9, category: "Strategic", trend: [1, 1, 2, 2, 3, 4, 5, 6], alert: "ELEVATED" },
  { name: "Cancellation Risk Score", risk: 58, incidents: 7, category: "Commercial", trend: [2, 2, 3, 3, 4, 4, 5, 5], alert: "ELEVATED" },
];

const CONFIDENCE_BANDS = [
  { band: "90–100%", count: 94, pct: 38, color: "#10b981" },
  { band: "75–89%", count: 82, pct: 33, color: ACCENT },
  { band: "60–74%", count: 46, pct: 19, color: "#f59e0b" },
  { band: "Below 60%", count: 25, pct: 10, color: "hsl(215 16% 30%)" },
];

const TOP_SIGNALS = [
  { rank: "01", name: "Wait Anxiety", category: "Guest", activations: 67, confidence: 94, value: "HIGH" },
  { rank: "02", name: "Room Readiness Pipeline", category: "Operational", activations: 61, confidence: 99, value: "CRITICAL" },
  { rank: "03", name: "Staff Capacity Ratio", category: "Workforce", activations: 58, confidence: 98, value: "CRITICAL" },
  { rank: "04", name: "Activation Exposure Index", category: "Commercial", activations: 42, confidence: 93, value: "CRITICAL" },
  { rank: "05", name: "Loyalty Recognition Gap", category: "Guest", activations: 38, confidence: 97, value: "CRITICAL" },
  { rank: "06", name: "Response Latency", category: "Workforce", activations: 34, confidence: 95, value: "HIGH" },
  { rank: "07", name: "F&B Propensity Score", category: "Commercial", activations: 31, confidence: 77, value: "HIGH" },
  { rank: "08", name: "Brand Sentiment Drift", category: "Strategic", activations: 19, confidence: 74, value: "HIGH" },
];

const VALUE_COLOR: Record<string, string> = {
  CRITICAL: "#ef4444",
  HIGH: ACCENT,
  MEDIUM: "hsl(215 16% 46%)",
};

export default function SignalIntelligence() {
  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="mb-10"
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.26em", color: ACCENT, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · Behavioural Analytics
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 10 }}>
            Signal Intelligence
          </h1>
          <p style={{ fontSize: 12, color: "hsl(215 16% 44%)", lineHeight: 1.75, maxWidth: 620, margin: 0 }}>
            Behavioural sensing analytics. Not what happened — what the pattern of signals is telling you about what is about to happen.
          </p>
        </motion.header>

        {/* ── 01 Signal Density ── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>01 — Signal Density</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
          </div>
          <p style={{ fontSize: 11.5, color: "hsl(215 16% 42%)", lineHeight: 1.75, marginBottom: 20, maxWidth: 560 }}>
            How many signals are active in each category. Density is a proxy for operational complexity — more active signals means more behavioural information to act on.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {DENSITY_METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  display: "grid", gridTemplateColumns: "180px 1fr 60px 90px 80px",
                  alignItems: "center", gap: 20,
                  padding: "14px 20px",
                  background: "hsl(220 13% 6%)", border: "1px solid hsl(220 13% 9%)",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{m.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Bar value={m.value} max={m.total} color={m.color} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: m.color, textAlign: "right" }}>{m.value}</div>
                <div style={{ fontSize: 10, color: "hsl(215 16% 36%)" }}>of {m.total} capacity</div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Sparkline data={m.trend} color={m.color} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 02 Signal Trends: Increasing Signals ── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>02 — Signals Increasing</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
          </div>
          <p style={{ fontSize: 11.5, color: "hsl(215 16% 42%)", lineHeight: 1.75, marginBottom: 20, maxWidth: 560 }}>
            Signal categories with accelerating activation rates week-on-week. Increasing velocity means more moments will form — and more action will be required.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {INCREASING_SIGNALS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                style={{
                  padding: "16px 20px",
                  background: "hsl(220 13% 6%)", border: "1px solid hsl(220 13% 9%)",
                  display: "grid", gridTemplateColumns: "200px 1fr 80px 48px",
                  alignItems: "center", gap: 20,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: "hsl(215 16% 38%)", lineHeight: 1.5 }}>{s.reason}</div>
                </div>
                <div>
                  <div style={{ height: 6, background: "hsl(220 13% 10%)", marginBottom: 4 }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${s.velocity}%` }}
                      transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: "easeOut" }}
                      style={{ height: "100%", background: s.color }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textAlign: "right" }}>{s.delta}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", textAlign: "right" }}>{s.velocity}%</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Two column: High-Value + Risk ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>

          {/* 03 — High-Value Moment Contributors */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>03 — High-Value Contributors</div>
            </div>
            <p style={{ fontSize: 11, color: "hsl(215 16% 40%)", lineHeight: 1.7, marginBottom: 16 }}>
              Signals most likely to generate moments with significant commercial or loyalty value.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {HIGH_VALUE_SIGNALS.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.05 }}
                  style={{
                    padding: "12px 16px",
                    background: "hsl(220 13% 6%)", border: "1px solid hsl(220 13% 9%)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{s.name}</div>
                    <div style={{ fontSize: 9, color: "hsl(215 16% 36%)" }}>{s.moments} moments</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <div style={{ flex: 1, height: 3, background: "hsl(220 13% 12%)" }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${s.contribution}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                        style={{ height: "100%", background: s.color }}
                      />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.contribution}%</span>
                  </div>
                  <div style={{ fontSize: 9.5, color: "hsl(215 16% 34%)" }}>{s.value}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 04 — Risk-Creating Signals */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: "#ef4444", textTransform: "uppercase" }}>04 — Risk Signals</div>
            </div>
            <p style={{ fontSize: 11, color: "hsl(215 16% 40%)", lineHeight: 1.7, marginBottom: 16 }}>
              Signals most frequently creating adverse moments. High risk score means compounding exposure without intervention.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {RISK_SIGNALS.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.05 }}
                  style={{
                    padding: "12px 16px",
                    background: "hsl(220 13% 6%)",
                    border: "1px solid hsl(220 13% 9%)",
                    borderLeft: `2px solid ${s.alert === "CRITICAL" ? "#ef4444" : s.alert === "HIGH" ? ACCENT : "hsl(215 16% 22%)"}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{s.name}</div>
                    <span style={{
                      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em",
                      color: s.alert === "CRITICAL" ? "#ef4444" : ACCENT,
                      textTransform: "uppercase",
                    }}>
                      {s.alert}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ flex: 1, height: 3, background: "hsl(220 13% 12%)" }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${s.risk}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                        style={{
                          height: "100%",
                          background: s.alert === "CRITICAL" ? "#ef4444" : s.alert === "HIGH" ? ACCENT : "#f59e0b",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{s.risk}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div style={{ fontSize: 9.5, color: "hsl(215 16% 36%)" }}>{s.category} · {s.incidents} incidents this week</div>
                    <Sparkline data={s.trend} color={s.alert === "CRITICAL" ? "#ef4444" : ACCENT} />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* ── 05 Signal Confidence Distribution ── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>05 — Signal Confidence Distribution</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
          </div>
          <p style={{ fontSize: 11.5, color: "hsl(215 16% 42%)", lineHeight: 1.75, marginBottom: 20, maxWidth: 560 }}>
            How well-evidenced the signal registry is. High-confidence signals produce reliable moments. Low-confidence signals are early indicators — emerging, not yet actionable.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
            {CONFIDENCE_BANDS.map((b, i) => (
              <motion.div
                key={b.band}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                style={{
                  padding: "20px",
                  background: "hsl(220 13% 6%)", border: "1px solid hsl(220 13% 9%)",
                  borderTop: `2px solid ${b.color}`,
                }}
              >
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: "hsl(215 16% 30%)", textTransform: "uppercase", marginBottom: 10 }}>{b.band}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: b.color, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 6 }}>{b.count}</div>
                <div style={{ fontSize: 10, color: "hsl(215 16% 36%)", marginBottom: 12 }}>{b.pct}% of registry</div>
                <div style={{ height: 3, background: "hsl(220 13% 12%)" }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${b.pct * 2.5}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                    style={{ height: "100%", background: b.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 06 Top Contributing Signals ── */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase" }}>06 — Top Contributing Signals</div>
            <div style={{ flex: 1, height: 1, background: "hsl(220 13% 10%)" }} />
          </div>
          <p style={{ fontSize: 11.5, color: "hsl(215 16% 42%)", lineHeight: 1.75, marginBottom: 20, maxWidth: 560 }}>
            Ranked by moment activation frequency. These are the signals driving the most operational response — the core behavioural vocabulary of the deployment.
          </p>
          <div style={{ background: "hsl(220 13% 6%)", border: "1px solid hsl(220 13% 10%)" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "40px 2fr 1fr 1fr 1fr 0.8fr",
              padding: "10px 20px", borderBottom: "1px solid hsl(220 13% 10%)", gap: 16,
            }}>
              {["#", "Signal", "Category", "Activations", "Confidence", "Weighting"].map((h) => (
                <div key={h} style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 28%)", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>
            {TOP_SIGNALS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.04 }}
                style={{
                  display: "grid", gridTemplateColumns: "40px 2fr 1fr 1fr 1fr 0.8fr",
                  padding: "14px 20px", borderBottom: i < TOP_SIGNALS.length - 1 ? "1px solid hsl(220 13% 9%)" : "none",
                  alignItems: "center", gap: 16,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "hsl(220 13% 7%)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: "hsl(215 16% 28%)", letterSpacing: "0.06em" }}>{s.rank}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{s.name}</div>
                <div style={{ fontSize: 10, color: "hsl(215 16% 42%)" }}>{s.category}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{s.activations}</div>
                  <div style={{ height: 2, background: "hsl(220 13% 12%)", width: "80%" }}>
                    <div style={{ height: "100%", width: `${(s.activations / 70) * 100}%`, background: ACCENT }} />
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.confidence >= 90 ? "#10b981" : ACCENT }}>{s.confidence}%</div>
                <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", color: VALUE_COLOR[s.value], textTransform: "uppercase" }}>{s.value}</div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
