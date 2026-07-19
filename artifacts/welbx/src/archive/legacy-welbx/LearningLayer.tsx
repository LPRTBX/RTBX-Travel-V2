import { motion } from "framer-motion";

const C = {
  amber: "#c9a84c", green: "#10b981", blue: "#3b82f6",
  violet: "#a78bfa", red: "#ef4444", cyan: "#22d3ee",
  border: "hsl(220 13% 9%)", card: "hsl(220 13% 7%)",
  bg: "hsl(220 13% 5%)", muted: "hsl(215 16% 38%)", dimmed: "hsl(215 16% 22%)",
};

const KPIS = [
  { label: "Patterns Learned",       value: "214",  delta: "+18 this month",      color: C.violet },
  { label: "Protocol Updates",       value: "31",   delta: "Triggered by outcomes", color: C.amber  },
  { label: "Confidence Improvements",value: "47",   delta: "Across signal set",    color: C.green  },
  { label: "System Accuracy Delta",  value: "+6.2%",delta: "vs. 90-day baseline",  color: C.cyan   },
];

const EVENTS = [
  {
    id: "LE-001", date: "Today · 09:12", engine: "BXOS",
    headline: "VIP arrival signal weights recalibrated",
    detail: "Room readiness weight increased +12% following 23 outcome observations. VIP arrival confidence improved from 91% to 97%. Earlier detection now confirmed at 3.8 minutes average lead time.",
    impact: "Confidence +6pt · Lead time +3.8 min",
    type: "CALIBRATION",
    color: C.amber,
  },
  {
    id: "LE-002", date: "Yesterday · 14:37", engine: "BXOS",
    headline: "Queue pressure threshold recalibrated",
    detail: "Alert threshold reduced from 14 to 11 guests based on complaint pattern analysis. Pre-complaint window now extends 3.2 minutes. Edinburgh and Dubai deployments updated.",
    impact: "Early warning +3.2 min · Complaint prevention +18%",
    type: "THRESHOLD",
    color: C.blue,
  },
  {
    id: "LE-003", date: "2 days ago · 11:05", engine: "NEXUS",
    headline: "Recovery gesture recommendation updated",
    detail: "F&B offer now default over room credit following 47 outcome comparisons. F&B acceptance rate 84% vs. room credit 41%. Routing rules updated across Guest Distress and Complaint Recovery playbooks.",
    impact: "Acceptance rate +43pt · Cost efficiency +22%",
    type: "PROTOCOL",
    color: C.green,
  },
  {
    id: "LE-004", date: "4 days ago · 16:22", engine: "BXOS",
    headline: "Staff fatigue signal index updated",
    detail: "Desk-unattended events now weighted at 0.8× in the fatigue composite index. Data from 3-week pattern confirms accumulative model is more predictive than daily pulse model. Edinburgh signal updated.",
    impact: "Fatigue prediction accuracy +14%",
    type: "CALIBRATION",
    color: C.violet,
  },
  {
    id: "LE-005", date: "6 days ago · 08:54", engine: "NEXUS",
    headline: "First-stay engagement contact window reduced",
    detail: "Proactive contact window tightened from 10 to 8 minutes following analysis of 94 first-stay outcomes. Earlier contact correlates with 28% higher repeat booking probability for this segment.",
    impact: "Repeat booking probability +28% for first-stay cohort",
    type: "PROTOCOL",
    color: C.green,
  },
  {
    id: "LE-006", date: "8 days ago · 13:15", engine: "BXOS",
    headline: "In-app notification outperformance confirmed",
    detail: "In-app notifications outperform SMS by 3.4× for operational acknowledgement across 6 properties. Communication routing weights updated. SMS now reserved for non-app users only.",
    impact: "Acknowledgement rate +34% · Routing efficiency improved",
    type: "CHANNEL",
    color: C.cyan,
  },
  {
    id: "LE-007", date: "11 days ago · 10:43", engine: "VECTOR",
    headline: "VIP pre-arrival suite message protocol added",
    detail: "New touchpoint added for DIAMOND+ tier guests: suite preview message 24 hours prior to arrival. Based on positive correlation observed in 12 VIP outcomes where preview messaging preceded the stay.",
    impact: "VIP satisfaction delta +0.9 NPS equivalent",
    type: "PROTOCOL",
    color: C.amber,
  },
];

const PATTERNS = [
  {
    id: "PAT-001",
    name: "Arrival Cluster Collision",
    observation: "Room readiness conflicts peak when multiple arrivals occur within 20 minutes of each other, regardless of total daily volume.",
    instances: 34, confidence: 96, status: "ACTIVE",
    implication: "Pre-shift room sequencing must account for arrival clustering, not total count.",
  },
  {
    id: "PAT-002",
    name: "Complaint Chain Precursors",
    observation: "74% of complaint escalations are preceded by at least two signals visible to BXOS 6+ minutes before the complaint is registered by staff.",
    instances: 67, confidence: 91, status: "ACTIVE",
    implication: "Earlier signal-to-moment threshold reduces formal complaint rate by estimated 31%.",
  },
  {
    id: "PAT-003",
    name: "VIP First-90 Sensitivity",
    observation: "Tier M1/M2 guests show sentiment sensitivity 3.2× higher during the first 90 minutes of their stay than at any other point.",
    instances: 28, confidence: 89, status: "ACTIVE",
    implication: "VIP protocol activation window should be weighted toward arrival, not spread equally.",
  },
  {
    id: "PAT-004",
    name: "Staff Fatigue Accumulation",
    observation: "Response latency increases follow a 3-week accumulation pattern, not daily fluctuation. Tuesday–Thursday week 3 shows peak degradation.",
    instances: 21, confidence: 82, status: "EMERGING",
    implication: "Scheduling intervention should be triggered at week-2.5, not reactively.",
  },
  {
    id: "PAT-005",
    name: "F&B Revenue Window",
    observation: "F&B propensity peaks between 16:00–18:00 for guests with no dinner booking on record, regardless of stay length or property.",
    instances: 44, confidence: 88, status: "ACTIVE",
    implication: "All F&B outreach should default to this window unless guest preference data overrides.",
  },
  {
    id: "PAT-006",
    name: "Same-Shift Recovery Effect",
    observation: "Recovery gestures offered within the same shift as the service failure succeed at 84%. Next-shift recovery rate: 41%. 48-hour rate: 19%.",
    instances: 52, confidence: 94, status: "ACTIVE",
    implication: "Recovery time is as important as recovery quality. Speed is the primary success variable.",
  },
];

const UPDATES = [
  {
    id: "PU-001", playbook: "PB-001 · Guest Distress",
    change: "Queue alert threshold reduced from 14 to 11 guests",
    reason: "Pattern PAT-001 confirmed earlier threshold improves complaint prevention",
    appliedAt: "3 days ago",
  },
  {
    id: "PU-002", playbook: "PB-003 · Complaint Recovery",
    change: "Default recovery gesture changed: F&B offer replaces room credit",
    reason: "Outcome analysis (47 instances): F&B acceptance 84% vs. room credit 41%",
    appliedAt: "2 days ago",
  },
  {
    id: "PU-003", playbook: "PB-002 · VIP Arrival",
    change: "DIAMOND+ suite preview message added 24h before arrival",
    reason: "Positive outcome correlation in 12 VIP arrivals where preview preceded stay",
    appliedAt: "11 days ago",
  },
  {
    id: "PU-004", playbook: "PB-004 · Staff Fatigue",
    change: "Early intervention trigger moved from week 3 to week 2.5",
    reason: "Pattern PAT-004: fatigue accumulates on 3-week cycle, peak at Tue–Thu wk 3",
    appliedAt: "5 days ago",
  },
];

const TYPE_COLOR: Record<string, string> = {
  CALIBRATION: C.amber, THRESHOLD: C.blue, PROTOCOL: C.green,
  CHANNEL: C.cyan, PROFILE: C.violet,
};

const fade = (d: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.38 } });

export default function LearningLayer() {
  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* Header */}
        <motion.div {...fade(0)} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · BXOS Learning Engine
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
            Learning Layer
          </h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em", marginBottom: 12 }}>
            The sixth step of GHSOL. Every outcome teaches the next response.
          </p>
          <div style={{ padding: "14px 18px", borderLeft: `2px solid ${C.violet}`, background: `${C.violet}08`, border: `1px solid ${C.violet}20`, borderLeftWidth: 2, maxWidth: 680 }}>
            <div style={{ fontSize: 12.5, color: "hsl(215 16% 52%)", lineHeight: 1.75, fontStyle: "italic" }}>
              "GHSOL is not a pipeline — it is a loop. Signal → Moment → Decision → Action → Outcome → <span style={{ color: "#fff", fontStyle: "normal", fontWeight: 700 }}>Learning</span>. The system that does not learn from its outcomes is repeating the same response indefinitely."
            </div>
          </div>
        </motion.div>

        {/* KPIs */}
        <motion.div {...fade(0.06)} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 36 }}>
          {KPIS.map(k => (
            <div key={k.label} style={{ padding: "18px 20px", background: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${k.color}` }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 6, letterSpacing: "-0.025em" }}>{k.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color: k.color, textTransform: "uppercase" }}>{k.delta}</div>
            </div>
          ))}
        </motion.div>

        {/* GHSOL loop reminder */}
        <motion.div {...fade(0.1)} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36, overflowX: "auto", paddingBottom: 2 }}>
          {["Signal", "Moment", "Decision", "Action", "Outcome", "Learning"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                padding: "7px 14px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                background: s === "Learning" ? C.violet : i < 5 ? "hsl(220 13% 8%)" : "transparent",
                color: s === "Learning" ? "#fff" : "hsl(215 16% 40%)",
                border: `1px solid ${s === "Learning" ? C.violet : C.border}`,
                whiteSpace: "nowrap",
              }}>
                {String(i + 1).padStart(2, "0")} {s}
              </div>
              {i < 5 && <div style={{ width: 24, height: 1, background: `${C.amber}40`, flexShrink: 0 }} />}
            </div>
          ))}
          <div style={{ marginLeft: 8, fontSize: 12, color: `${C.amber}60` }}>↺</div>
        </motion.div>

        {/* Two-col: Events + Patterns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, marginBottom: 1 }}>

          {/* Learning Events */}
          <div>
            <div style={{ padding: "10px 0 12px", borderBottom: `1px solid ${C.border}`, marginBottom: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 3, height: 16, background: C.violet }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Learning Events</span>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.violet, border: `1px solid ${C.violet}30`, padding: "2px 7px", background: `${C.violet}0d` }}>{EVENTS.length} RECENT</span>
              </div>
            </div>
            {EVENTS.map((ev, i) => (
              <motion.div
                key={ev.id}
                {...fade(0.14 + i * 0.05)}
                style={{ padding: "16px 18px", background: i % 2 === 0 ? C.card : "hsl(220 13% 8%)", border: `1px solid ${C.border}`, borderTopWidth: 0, borderLeft: `2px solid ${ev.color}` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: ev.color, border: `1px solid ${ev.color}30`, padding: "1px 6px", background: `${ev.color}0d`, textTransform: "uppercase" }}>{ev.type}</span>
                    <span style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.08em" }}>{ev.engine}</span>
                  </div>
                  <span style={{ fontSize: 8.5, color: C.dimmed, whiteSpace: "nowrap" }}>{ev.date}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.35, marginBottom: 5 }}>{ev.headline}</div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.65, marginBottom: 8 }}>{ev.detail}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: ev.color, letterSpacing: "0.06em" }}>↑ {ev.impact}</div>
              </motion.div>
            ))}
          </div>

          {/* Patterns + Protocol updates */}
          <div>
            {/* Learned patterns */}
            <div style={{ padding: "10px 0 12px", borderBottom: `1px solid ${C.border}`, marginBottom: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 3, height: 16, background: C.green }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Institutional Patterns</span>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.green, border: `1px solid ${C.green}30`, padding: "2px 7px", background: `${C.green}0d` }}>{PATTERNS.length} ACTIVE</span>
              </div>
            </div>
            {PATTERNS.map((p, i) => (
              <motion.div
                key={p.id}
                {...fade(0.16 + i * 0.05)}
                style={{ padding: "14px 18px", background: i % 2 === 0 ? C.card : "hsl(220 13% 8%)", border: `1px solid ${C.border}`, borderTopWidth: 0, borderLeft: `2px solid ${C.green}` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 7.5, color: C.dimmed, letterSpacing: "0.08em", fontFamily: "var(--app-font-mono)" }}>{p.id}</span>
                    <span style={{ fontSize: 7.5, fontWeight: 700, color: p.status === "ACTIVE" ? C.green : C.amber, letterSpacing: "0.1em" }}>{p.status}</span>
                  </div>
                  <span style={{ fontSize: 9, color: C.muted }}>{p.instances} instances · {p.confidence}% conf.</span>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", lineHeight: 1.35, marginBottom: 5 }}>{p.name}</div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 7 }}>{p.observation}</div>
                <div style={{ padding: "7px 10px", background: `${C.green}07`, borderLeft: `2px solid ${C.green}40`, fontSize: 10, color: C.green, lineHeight: 1.55 }}>
                  {p.implication}
                </div>
              </motion.div>
            ))}

            {/* Protocol evolution */}
            <div style={{ padding: "10px 0 12px", borderBottom: `1px solid ${C.border}`, marginTop: 20, marginBottom: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 3, height: 16, background: C.amber }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Protocol Evolution</span>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.amber, border: `1px solid ${C.amber}30`, padding: "2px 7px", background: `${C.amber}0d` }}>4 UPDATES</span>
              </div>
            </div>
            {UPDATES.map((u, i) => (
              <motion.div
                key={u.id}
                {...fade(0.4 + i * 0.05)}
                style={{ padding: "13px 18px", background: i % 2 === 0 ? C.card : "hsl(220 13% 8%)", border: `1px solid ${C.border}`, borderTopWidth: 0, borderLeft: `2px solid ${C.amber}` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: C.amber, letterSpacing: "0.06em" }}>{u.playbook}</span>
                  <span style={{ fontSize: 8, color: C.dimmed }}>{u.appliedAt}</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{u.change}</div>
                <div style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.55 }}>{u.reason}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 24 }}>
            {[{ n: "BXOS", d: "Pattern calibration · Signal weighting" }, { n: "NEXUS", d: "Protocol routing · Response optimisation" }, { n: "VECTOR", d: "Outcome attribution · Learning capture" }].map(e => (
              <div key={e.n} style={{ display: "flex", gap: 7, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.n}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 15%)", letterSpacing: "0.04em" }}>· {e.d}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, color: "hsl(215 16% 14%)" }}>Learning Layer · GHSOL Step 6 · WELBX</div>
        </motion.div>

      </div>
    </div>
  );
}
