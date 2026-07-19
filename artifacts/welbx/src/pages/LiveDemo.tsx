import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const STAGES = ["SIGNALS", "CONVERGENCE", "DECISION", "PATHWAY", "EXECUTION", "OUTCOME"] as const;
type Stage = typeof STAGES[number];

const STAGE_ENGINES: Record<Stage, string> = {
  SIGNALS:     "RTBX Intelligence Engine",
  CONVERGENCE: "RTBX Intelligence Engine",
  DECISION:    "RTBX Intelligence Engine",
  PATHWAY:     "RTBX Routing Engine",
  EXECUTION:   "RTBX Execution Engine",
  OUTCOME:     "",
};

const STAGE_DESCS: Record<Stage, string> = {
  SIGNALS:     "Multi-source data streams entering the operating layer",
  CONVERGENCE: "Pattern recognition — signals aligned against model",
  DECISION:    "Governed action selection — options evaluated",
  PATHWAY:     "Routing chain activated — departments assigned",
  EXECUTION:   "Real-time deployment — tracked state by state",
  OUTCOME:     "System state confirmed — metrics captured",
};

type ScenarioId = "operations" | "guest";
type ViewMode = "ops" | "guest";

// ─── SIGNAL CARDS ─────────────────────────────────────────────────────────────

const SEVERITY_STYLE = {
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.22)" },
  high:     { color: "#f59e0b", bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.2)" },
  elevated: { color: "#c9a84c", bg: "rgba(201,168,76,0.08)", border: "rgba(201,168,76,0.2)" },
  normal:   { color: "hsl(215 16% 40%)", bg: "transparent", border: "hsl(220 13% 14%)" },
  resolved: { color: "#10b981", bg: "rgba(16,185,129,0.07)", border: "rgba(16,185,129,0.2)" },
};
type Severity = keyof typeof SEVERITY_STYLE;

function SignalRow({ label, value, sev, delay = 0 }: { label: string; value: string; sev: Severity; delay?: number }) {
  const s = SEVERITY_STYLE[sev];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.3 }}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid hsl(220 13% 9%)", gap: 12 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "hsl(215 16% 62%)", fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--app-font-mono)" }}>{value}</span>
        <div style={{ padding: "2px 7px", background: s.bg, border: `1px solid ${s.border}`, flexShrink: 0 }}>
          <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: s.color, textTransform: "uppercase" }}>{sev}</span>
        </div>
      </div>
    </motion.div>
  );
}

function MetricRow({ label, before, after, delay = 0 }: { label: string; before?: string; after: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.3 }}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid hsl(220 13% 9%)", gap: 12 }}>
      <span style={{ fontSize: 11, color: "hsl(215 16% 46%)", fontWeight: 500, letterSpacing: "0.02em" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {before && <span style={{ fontSize: 11, color: "hsl(215 16% 30%)", fontFamily: "var(--app-font-mono)", textDecoration: "line-through" }}>{before}</span>}
        <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981", fontFamily: "var(--app-font-mono)" }}>{after}</span>
        {before && <span style={{ fontSize: 10, color: "#10b981" }}>✓</span>}
      </div>
    </motion.div>
  );
}

function TimelineRow({ time, action, status, delay = 0 }: { time: string; action: string; status: "done" | "active" | "pending"; delay?: number }) {
  const c = status === "done" ? "#10b981" : status === "active" ? "#c9a84c" : "hsl(215 16% 28%)";
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.3 }}
      style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "9px 16px", borderBottom: "1px solid hsl(220 13% 9%)", background: status === "active" ? "rgba(201,168,76,0.03)" : "transparent" }}>
      <span style={{ fontSize: 10, color: "hsl(215 16% 32%)", fontFamily: "var(--app-font-mono)", letterSpacing: "0.04em", flexShrink: 0, marginTop: 1 }}>{time}</span>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: c, flexShrink: 0, marginTop: 4 }} className={status === "active" ? "animate-pulse" : ""} />
      <span style={{ fontSize: 12, color: status === "done" ? "hsl(215 16% 56%)" : status === "active" ? "#fff" : "hsl(215 16% 28%)", fontWeight: status === "active" ? 600 : 400 }}>{action}</span>
      <span style={{ marginLeft: "auto", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: c, textTransform: "uppercase", flexShrink: 0 }}>{status}</span>
    </motion.div>
  );
}

function OptionRow({ chosen, label, reason, delay = 0 }: { chosen: boolean; label: string; reason: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.3 }}
      style={{ display: "flex", gap: 12, padding: "10px 16px", borderBottom: "1px solid hsl(220 13% 9%)", background: chosen ? "rgba(16,185,129,0.04)" : "transparent", borderLeft: chosen ? "2px solid #10b981" : "2px solid transparent" }}>
      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{chosen ? "✓" : "✗"}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: chosen ? "#fff" : "hsl(215 16% 36%)", marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 10, color: chosen ? "hsl(215 16% 48%)" : "hsl(215 16% 30%)" }}>{reason}</div>
      </div>
    </motion.div>
  );
}

function RouteRow({ dept, action, delay = 0 }: { dept: string; action: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.3 }}
      style={{ display: "flex", gap: 12, padding: "10px 16px", borderBottom: "1px solid hsl(220 13% 9%)", alignItems: "center" }}>
      <span style={{ fontSize: 10, color: "#c9a84c", flexShrink: 0 }}>→</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: "hsl(215 16% 60%)", minWidth: 140, flexShrink: 0 }}>{dept}</span>
      <span style={{ fontSize: 11, color: "hsl(215 16% 42%)" }}>{action}</span>
    </motion.div>
  );
}

// ─── STEP CONTENT ─────────────────────────────────────────────────────────────

function StepContent({ scenario, step, view }: { scenario: ScenarioId; step: number; view: ViewMode }) {
  const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.25 } };

  // ── OPERATIONS: FOYER CONGESTION ──────────────────────────────────────────

  if (scenario === "operations") {
    if (step === 0) return (
      <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, height: "100%" }}>
        <div>
          <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", marginBottom: 12 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: "#ef4444", textTransform: "uppercase", marginBottom: 4 }}>System State · 12:46:38</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>CHECK-IN CAPACITY THRESHOLD EXCEEDED</div>
            <div style={{ fontSize: 10, color: "hsl(215 16% 40%)", marginTop: 4 }}>Three signal streams converging. Intervention window: T+4 minutes.</div>
          </div>
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            <SignalRow label="Arrival rate" value="+34% above forecast" sev="critical" delay={0.1} />
            <SignalRow label="Foyer density" value="87 / 100 capacity" sev="critical" delay={0.18} />
            <SignalRow label="Check-in desks" value="4 of 4 — maxed" sev="critical" delay={0.26} />
            <SignalRow label="Mobile check-in" value="Not enabled" sev="elevated" delay={0.34} />
            <SignalRow label="Staff on floor" value="2 of 4 available" sev="high" delay={0.42} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 10 }}>Signal Origin</div>
            {[["Arrival rate", "Property PMS + door sensor"], ["Foyer density", "Lobby occupancy sensor grid"], ["Desk capacity", "Front desk system"], ["Mobile eligibility", "PMS cohort filter"]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid hsl(220 13% 9%)", gap: 12 }}>
                <span style={{ fontSize: 9, color: "hsl(215 16% 30%)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 10, color: "hsl(215 16% 48%)", textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 8 }}>Contributing factor</div>
            <div style={{ fontSize: 12, color: "hsl(215 16% 50%)", lineHeight: 1.6 }}>BA0173 LHR arrived 14 minutes early. 31 passengers checking in simultaneously — unforecast arrival cluster.</div>
          </div>
        </div>
      </motion.div>
    );

    if (step === 1) return (
      <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, height: "100%" }}>
        <div>
          <div style={{ padding: "14px 16px", border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.04)", marginBottom: 12 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 6 }}>RTBX Intelligence Engine — Pattern Confirmation</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>89%</span>
              <span style={{ fontSize: 11, color: "hsl(215 16% 40%)" }}>signal confidence</span>
            </div>
            <div style={{ height: 4, background: "hsl(220 13% 11%)", borderRadius: 2 }}>
              <motion.div initial={{ width: 0 }} animate={{ width: "89%" }} transition={{ delay: 0.2, duration: 0.8 }} style={{ height: "100%", background: "#c9a84c", borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            {[
              { label: "Arrival cluster detected", detail: "BA0173 early arrival · 31-guest surge" },
              { label: "Historical match", detail: "Pre-weekend surge · 6 prior occurrences" },
              { label: "Capacity model output", detail: "Critical zone in T+4 minutes" },
              { label: "Predicted queue (no action)", detail: "12–16 minutes at current rate" },
              { label: "Risk tier", detail: "Operational · Revenue · NPS" },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 + 0.1, duration: 0.3 }}
                style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid hsl(220 13% 9%)", gap: 16 }}>
                <span style={{ fontSize: 11, color: "hsl(215 16% 46%)" }}>{r.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", textAlign: "right" }}>{r.detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 10 }}>Risk Model Output</div>
            {[["Queue time (no action)", "12–16 min", "critical"], ["Revenue at risk", "$4,800 (22 guests)", "high"], ["NPS impact (no action)", "−1.2 projected", "high"], ["Intervention window", "T+4 minutes", "elevated"]].map(([k, v, sev], i) => {
              const c = sev === "critical" ? "#ef4444" : sev === "high" ? "#f59e0b" : "#c9a84c";
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid hsl(220 13% 9%)", gap: 10 }}>
                  <span style={{ fontSize: 9, color: "hsl(215 16% 30%)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c, textAlign: "right" }}>{v}</span>
                </div>
              );
            })}
          </div>
          <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)", flex: 1 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 8 }}>RTBX Intelligence Engine — Assessment</div>
            <p style={{ fontSize: 11, color: "hsl(215 16% 42%)", lineHeight: 1.7 }}>Signal convergence confirms a non-random threshold event. Pattern matches historical pre-weekend arrival surge with early inbound flight. Immediate multi-channel intervention is warranted. Decision required within T+2 minutes to preserve outcome window.</p>
          </div>
        </div>
      </motion.div>
    );

    if (step === 2) return (
      <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ padding: "12px 16px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)", marginBottom: 12 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#10b981", textTransform: "uppercase", marginBottom: 3 }}>RTBX Intelligence Engine — Decision · 3 options evaluated</div>
            <div style={{ fontSize: 12, color: "hsl(215 16% 52%)" }}>Decision latency: <span style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--app-font-mono)" }}>8 seconds</span></div>
          </div>
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            <OptionRow chosen={false} label="Continue monitoring" reason="Risk: Queue exceeds 18 min — revenue exposure confirmed. Rejected." delay={0.1} />
            <OptionRow chosen={false} label="Emergency staff call-in" reason="ETA 22 minutes — window closes in 4 min. Too slow. Rejected." delay={0.2} />
            <OptionRow chosen={true}  label="Multi-channel flow redistribution" reason="Open D3 + enable mobile bypass + active rerouting. Immediate. Selected." delay={0.3} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 10 }}>Selected Action Parameters</div>
            {[["Action type", "Multi-channel redistribution"], ["Components", "3 (Desk · Mobile · Routing)"], ["Staff impact", "1 additional (D3 assignment)"], ["Guest impact", "22 in scope"], ["Revenue preserved", "$4,800 estimated"], ["Confidence", "91%"]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid hsl(220 13% 9%)", gap: 10 }}>
                <span style={{ fontSize: 9, color: "hsl(215 16% 30%)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 60%)", textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 16px", border: "1px solid rgba(16,185,129,0.14)", background: "rgba(16,185,129,0.03)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#10b981", textTransform: "uppercase", marginBottom: 6 }}>Governance</div>
            <p style={{ fontSize: 11, color: "hsl(215 16% 42%)", lineHeight: 1.65 }}>Decision governed by capacity policy v3.2. All three options were evaluated against: guest impact, revenue risk, staff availability, and execution time. The selected action falls within automated execution parameters — no manual approval required.</p>
          </div>
        </div>
      </motion.div>
    );

    if (step === 3) return (
      <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ padding: "12px 16px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 12 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 3 }}>RTBX Routing Engine — Initiated 12:47:00</div>
            <div style={{ fontSize: 12, color: "hsl(215 16% 52%)" }}>Four channels activated · Estimated impact: <span style={{ color: "#fff", fontWeight: 700 }}>−8 min queue</span></div>
          </div>
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            <RouteRow dept="Front Desk — Desk D3" action="Open desk · assign available staff member" delay={0.1} />
            <RouteRow dept="Concierge Team" action="Active guest rerouting · 7 eligible in foyer" delay={0.18} />
            <RouteRow dept="Mobile Check-in" action="Enable bypass for 18-guest cohort · push notification" delay={0.26} />
            <RouteRow dept="Dynamic Wayfinding" action="Update signage routing (if connected)" delay={0.34} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 10 }}>Routing Parameters</div>
            {[["Guest cohort in scope", "22 guests"], ["Immediate desk allocation", "D3 — 1 staff member"], ["Mobile redirect cohort", "18 guests (PMS filter)"], ["Concierge active redirects", "7 in foyer now"], ["Routing time", "< 10 seconds"], ["Notification channel", "App push + SMS"]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid hsl(220 13% 9%)", gap: 10 }}>
                <span style={{ fontSize: 9, color: "hsl(215 16% 30%)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 58%)", textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)", flex: 1 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 8 }}>RTBX Routing Engine — Logic</div>
            <p style={{ fontSize: 11, color: "hsl(215 16% 42%)", lineHeight: 1.7 }}>RTBX Routing Engine selects the fastest viable path for each component of the decision. Desk D3 is opened in parallel with the mobile bypass — neither depends on the other. Guest routing begins before desk is staffed, reducing effective wait time.</p>
          </div>
        </div>
      </motion.div>
    );

    if (step === 4) return (
      <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ padding: "12px 16px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 3 }}>RTBX Execution Engine — Deploying · Live</div>
              <div style={{ fontSize: 11, color: "hsl(215 16% 46%)" }}>7 guests in active flow · 5 completed</div>
            </div>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#c9a84c" }} className="animate-pulse" />
          </div>
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            <TimelineRow time="12:47:02" action="Desk D3 opened — M. Clarke assigned" status="done" delay={0.1} />
            <TimelineRow time="12:47:03" action="Mobile bypass active — push sent to 18 guests" status="done" delay={0.18} />
            <TimelineRow time="12:47:15" action="3 guests rerouted via concierge" status="done" delay={0.26} />
            <TimelineRow time="12:47:31" action="Foyer density: 87% → 72%" status="done" delay={0.34} />
            <TimelineRow time="12:47:45" action="Queue time: 12 min → 7 min" status="done" delay={0.42} />
            <TimelineRow time="12:48:12" action="Queue time: 7 min → 3 min — target reached" status="active" delay={0.5} />
            <TimelineRow time="Ongoing" action="5 guests still in mobile check-in flow" status="pending" delay={0.58} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 10 }}>Live State Readings</div>
            {[["Foyer density", "72%", "#c9a84c"], ["Queue time", "3 min", "#10b981"], ["Desk D3", "Active", "#10b981"], ["Mobile bypass", "Active", "#10b981"], ["Guests redirected", "17 of 22", "#c9a84c"]].map(([k, v, c], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid hsl(220 13% 9%)", gap: 10 }}>
                <span style={{ fontSize: 9, color: "hsl(215 16% 30%)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: c, fontFamily: "var(--app-font-mono)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );

    if (step === 5) return (
      <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ padding: "14px 16px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.22)", marginBottom: 12 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#10b981", textTransform: "uppercase", marginBottom: 4 }}>System State · STABILISED</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Flow normalised. State confirmed. Protocol closed.</div>
            <div style={{ fontSize: 10, color: "hsl(215 16% 40%)", marginTop: 4 }}>Recovery time: <span style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--app-font-mono)" }}>4 min 12 sec</span></div>
          </div>
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            <MetricRow label="Queue time" before="12 min" after="3 min" delay={0.1} />
            <MetricRow label="Foyer density" before="87%" after="61%" delay={0.18} />
            <MetricRow label="Check-in desks active" before="4 / 4" after="5 / 5 (D3 open)" delay={0.26} />
            <MetricRow label="Guests routed" after="22" delay={0.34} />
            <MetricRow label="Value preserved" after="$4,800" delay={0.42} />
            <MetricRow label="NPS impact (projected)" after="+0.8" delay={0.5} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 10 }}>Protocol Summary</div>
            {[["Trigger", "Threshold breach · 12:46:38"], ["Signal confidence", "89%"], ["Decision latency", "8 seconds"], ["Pathway activation", "< 10 seconds"], ["Full stabilisation", "4 min 12 sec"], ["Guest complaint", "Zero — none filed"], ["Escalation required", "None"]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid hsl(220 13% 9%)", gap: 10 }}>
                <span style={{ fontSize: 9, color: "hsl(215 16% 30%)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 58%)", textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 16px", border: "1px solid rgba(16,185,129,0.14)", background: "rgba(16,185,129,0.03)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#10b981", textTransform: "uppercase", marginBottom: 6 }}>What guests experienced</div>
            <p style={{ fontSize: 11, color: "hsl(215 16% 42%)", lineHeight: 1.7 }}>Twenty-two guests arrived into a congestion event they never experienced. Three were redirected by a concierge. Eighteen received a mobile check-in option. One desk opened within 90 seconds. The hotel handled it invisibly, in real time, without manual decision-making.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── GUEST: DISTRESS SIGNAL ─────────────────────────────────────────────────

  const isGuest = view === "guest";

  if (step === 0) return (
    <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)", marginBottom: 12 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#ef4444", textTransform: "uppercase", marginBottom: 4 }}>System State · 20:14:07</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>WELFARE THRESHOLD EXCEEDED</div>
          <div style={{ fontSize: 10, color: "hsl(215 16% 40%)", marginTop: 4 }}>Mr. R. Nakamura · Room 1247 · Day 4 of 6 · Seven signals aligned.</div>
        </div>
        {isGuest ? (
          <div style={{ padding: "16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 8 }}>The guest is unaware</div>
            <p style={{ fontSize: 13, color: "hsl(215 16% 46%)", lineHeight: 1.8 }}>RTBX Intelligence Engine is building a picture from behavioral absence. No interaction. No signal from the guest. Only what is not happening.</p>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid hsl(220 13% 10%)" }}>
              <div style={{ fontSize: 10, color: "hsl(215 16% 32%)", marginBottom: 6 }}>From the guest's perspective at this moment:</div>
              <div style={{ fontSize: 13, fontStyle: "italic", color: "hsl(215 16% 50%)", lineHeight: 1.7 }}>"The door is closed. The room is quiet. No one has knocked."</div>
            </div>
          </div>
        ) : (
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            <SignalRow label="Do Not Disturb — active" value="22h continuous" sev="critical" delay={0.1} />
            <SignalRow label="App interaction" value="Zero — 96 hours" sev="critical" delay={0.18} />
            <SignalRow label="Meals declined" value="× 5 — all refused" sev="critical" delay={0.26} />
            <SignalRow label='Desk inquiry' value='"Permanent baggage storage"' sev="critical" delay={0.34} />
            <SignalRow label="Missed welfare calls" value="8 unanswered" sev="critical" delay={0.42} />
            <SignalRow label="Emergency contact" value="Not filed at check-in" sev="high" delay={0.5} />
            <SignalRow label="Alcohol pattern" value="Elevated — 48 hours" sev="high" delay={0.58} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 10 }}>Guest Profile</div>
          {[["Name", "Mr. R. Nakamura"], ["Tier", "PLATINUM"], ["Prior stays", "7 at this property"], ["Baseline", "Highly engaged — usually dining, gym, spa"], ["Behavioral deviation", "Confirmed — not preference-driven"], ["Origin", "Tokyo, Japan"]].map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid hsl(220 13% 9%)", gap: 10 }}>
              <span style={{ fontSize: 9, color: "hsl(215 16% 30%)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: "hsl(215 16% 56%)", textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  if (step === 1) return (
    <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <div style={{ padding: "14px 16px", border: "1px solid rgba(239,68,68,0.22)", background: "rgba(239,68,68,0.05)", marginBottom: 12 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#ef4444", textTransform: "uppercase", marginBottom: 6 }}>RTBX Intelligence Engine — Welfare Model · Confirmed</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>94%</span>
            <span style={{ fontSize: 11, color: "hsl(215 16% 40%)" }}>signal confidence</span>
          </div>
          <div style={{ height: 4, background: "hsl(220 13% 11%)", borderRadius: 2 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} transition={{ delay: 0.2, duration: 0.8 }} style={{ height: "100%", background: "#ef4444", borderRadius: 2 }} />
          </div>
        </div>
        {isGuest ? (
          <div style={{ padding: "16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 8 }}>Still invisible to the guest</div>
            <p style={{ fontSize: 13, color: "hsl(215 16% 46%)", lineHeight: 1.8 }}>Seven signals have aligned. The confidence threshold is crossed. The hotel knows. The guest does not know the hotel knows.</p>
          </div>
        ) : (
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            {[
              { label: "Signal convergence", v: "7 of 7 monitored dimensions" },
              { label: "Pattern classification", v: "Acute distress — not preference isolation" },
              { label: "Historical baseline", v: "7 prior stays — behavioral deviation confirmed" },
              { label: "Threshold", v: "Exceeded — immediate protocol required" },
              { label: "False positive risk", v: "6% — governed by welfare model v2.1" },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 + 0.1, duration: 0.3 }}
                style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid hsl(220 13% 9%)", gap: 16 }}>
                <span style={{ fontSize: 11, color: "hsl(215 16% 44%)", flexShrink: 0 }}>{r.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", textAlign: "right" }}>{r.v}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)", flex: 1 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 8 }}>What makes this a convergence event</div>
          <p style={{ fontSize: 11, color: "hsl(215 16% 42%)", lineHeight: 1.75 }}>Any single signal in isolation could reflect preference. The 22-hour DND could be a long sleep. No meals could be dietary. What RTBX identifies is the alignment of seven independent dimensions simultaneously — each one unlikely on its own, impossible together without cause.</p>
          <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <div style={{ fontSize: 10, fontStyle: "italic", color: "hsl(215 16% 48%)", lineHeight: 1.65 }}>"This is not a guest who prefers quiet. This is a guest who has gone quiet."</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (step === 2) return (
    <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 12 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#ef4444", textTransform: "uppercase", marginBottom: 3 }}>RTBX Intelligence Engine — Level 4 Crisis Protocol</div>
          <div style={{ fontSize: 12, color: "hsl(215 16% 50%)" }}>Decision latency: <span style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--app-font-mono)" }}>6 seconds</span></div>
        </div>
        <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
          <OptionRow chosen={false} label="Continue monitoring" reason="Welfare risk unacceptable at 94% confidence. Rejected." delay={0.1} />
          <OptionRow chosen={false} label="Phone outreach only" reason="8 attempts already made — no response. Rejected." delay={0.2} />
          <OptionRow chosen={true}  label="Physical welfare protocol — GM-led" reason="Immediate welfare knock. Medical on standby. Crisis chain activated." delay={0.3} />
        </div>
        {isGuest && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ marginTop: 10, padding: "12px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 6 }}>Guest view at this stage</div>
            <p style={{ fontSize: 11, color: "hsl(215 16% 44%)", lineHeight: 1.7 }}>A decision is made. The guest is not yet aware. What changes is what happens next — and how it's delivered.</p>
          </motion.div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 10 }}>Protocol Parameters</div>
          {[["Protocol level", "Level 4 — Crisis"], ["Responder chain", "GM → Duty Manager → Security → Medical"], ["Guest framing", "Calm · personal · no alarm language"], ["Physical approach", "GM-led · not security-first"], ["Medical status", "On immediate call"], ["Welfare partnership", "Samaritans liaison contacted"]].map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid hsl(220 13% 9%)", gap: 10 }}>
              <span style={{ fontSize: 9, color: "hsl(215 16% 30%)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: "hsl(215 16% 56%)", textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  if (step === 3) return (
    <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.18)", marginBottom: 12 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#ef4444", textTransform: "uppercase", marginBottom: 3 }}>
            {isGuest ? "Guest Pathway — What the guest receives" : "RTBX Routing Engine — Level 4 Crisis"}
          </div>
          <div style={{ fontSize: 12, color: "hsl(215 16% 50%)" }}>
            {isGuest ? "Calm · Personal · No alarm language" : "Six channels activated · Simultaneous deployment"}
          </div>
        </div>
        <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
          {isGuest ? (
            <>
              <RouteRow dept="Language protocol" action='"We simply want to know you are safe"' delay={0.1} />
              <RouteRow dept="Tone" action="Warm · unhurried · no urgency language" delay={0.18} />
              <RouteRow dept="Security framing" action="Not mentioned · not visible to guest initially" delay={0.26} />
              <RouteRow dept="Door knock" action="Quiet · spaced · GM-led approach" delay={0.34} />
              <RouteRow dept="Message channel" action="In-app + room phone — personal, not automated" delay={0.42} />
              <RouteRow dept="Guest agency" action="Every touch preserves guest's ability to respond" delay={0.5} />
            </>
          ) : (
            <>
              <RouteRow dept="General Manager" action="Attending personally — Floor 12" delay={0.1} />
              <RouteRow dept="Duty Manager" action="Deployed — Room 1247" delay={0.18} />
              <RouteRow dept="Security" action="Standby position — outside room" delay={0.26} />
              <RouteRow dept="Medical Team" action="On immediate call — standing by" delay={0.34} />
              <RouteRow dept="Welfare Liaison" action="Samaritans partnership — contacted" delay={0.42} />
              <RouteRow dept="Front Desk" action="All guest calls redirected to GM" delay={0.5} />
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)", flex: 1 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 8 }}>
            {isGuest ? "The design of care" : "RTBX Routing Engine logic"}
          </div>
          <p style={{ fontSize: 11, color: "hsl(215 16% 42%)", lineHeight: 1.75 }}>
            {isGuest
              ? "Every decision about the guest pathway is made with one principle: preserve dignity. The hotel does not respond to this moment with alarm. It responds with presence. The guest should feel, at the moment of contact, that they are cared for — not managed."
              : "RTBX Routing Engine activates all six channels simultaneously. The GM route and the welfare liaison route do not depend on each other — they run in parallel. Security is positioned but not visible to the guest. The routing chain is ordered by human warmth, not operational hierarchy."}
          </p>
        </div>
      </div>
    </motion.div>
  );

  if (step === 4) return (
    <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#ef4444", textTransform: "uppercase", marginBottom: 3 }}>RTBX Execution Engine — Tracking · Crisis</div>
            <div style={{ fontSize: 11, color: "hsl(215 16% 44%)" }}>{isGuest ? "Guest-side delivery · All messages unread" : "Welfare knock in progress · 20:19"}</div>
          </div>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444" }} className="animate-pulse" />
        </div>
        {isGuest ? (
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            <TimelineRow time="18:00" action={`"We noticed you haven't been in touch — we're here."`} status="done" delay={0.1} />
            <TimelineRow time="18:45" action={`"We tried calling, Mr. Nakamura. Please do ring us."`} status="done" delay={0.18} />
            <TimelineRow time="19:30" action={`"We're here whenever you need us. Day or night."`} status="done" delay={0.26} />
            <TimelineRow time="20:10" action={`General Manager — personal message: "Please let us know you are safe."`} status="done" delay={0.34} />
            <TimelineRow time="20:19" action={`"We are outside your door. We simply want to know you're safe."`} status="active" delay={0.42} />
          </div>
        ) : (
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            <TimelineRow time="20:14" action="Crisis protocol activated — confidence 94%" status="done" delay={0.1} />
            <TimelineRow time="20:14" action="GM notified — attending immediately" status="done" delay={0.18} />
            <TimelineRow time="20:15" action="Duty Manager deployed — Floor 12" status="done" delay={0.26} />
            <TimelineRow time="20:15" action="Security positioned — outside Room 1247" status="done" delay={0.34} />
            <TimelineRow time="20:16" action="Medical on call · Welfare liaison notified" status="done" delay={0.42} />
            <TimelineRow time="20:17" action="All calls redirected to GM" status="done" delay={0.5} />
            <TimelineRow time="20:19" action="GM welfare knock initiated — in progress" status="active" delay={0.58} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)", flex: 1 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 8 }}>
            {isGuest ? "What the guest has received" : "RTBX Execution Engine — deployment status"}
          </div>
          {isGuest ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["Messages sent", "5"], ["Messages opened", "0"], ["Calls attempted", "8"], ["Calls answered", "0"], ["GM messages", "2 — personal"], ["Current status", "Welfare knock active"]].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid hsl(220 13% 9%)", gap: 10 }}>
                  <span style={{ fontSize: 9, color: "hsl(215 16% 30%)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "hsl(215 16% 56%)", fontFamily: "var(--app-font-mono)" }}>{v}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["GM", "Floor 12 — en route"], ["Duty Manager", "Room 1247 — standing by"], ["Security", "Positioned — not visible"], ["Medical", "On call — 4 min ETA"], ["Welfare liaison", "Active"], ["Front desk", "All calls → GM"]].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid hsl(220 13% 9%)", gap: 10 }}>
                  <span style={{ fontSize: 9, color: "hsl(215 16% 30%)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "hsl(215 16% 56%)", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (step === 5) return (
    <motion.div {...fade} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <div style={{ padding: "14px 16px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: 12 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#10b981", textTransform: "uppercase", marginBottom: 4 }}>System State · STABILISED</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Guest safety confirmed. Care plan active.</div>
          <div style={{ fontSize: 10, color: "hsl(215 16% 40%)", marginTop: 4 }}>Protocol closed: <span style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--app-font-mono)" }}>5 min 14 sec</span></div>
        </div>
        {isGuest ? (
          <div style={{ padding: "24px 20px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "A door that opened.",
                "A team that waited — without judgment, without alarm.",
                "The right words at the right moment.",
                "Care delivered without spectacle.",
                "Situation stabilised.",
              ].map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.18 + 0.2 }}
                  style={{ fontSize: i === 4 ? 13 : 13, color: i === 4 ? "#10b981" : "hsl(215 16% 54%)", fontStyle: "italic", lineHeight: 1.5, fontWeight: i === 4 ? 600 : 400, borderLeft: i === 4 ? "2px solid #10b981" : "none", paddingLeft: i === 4 ? 12 : 0 }}>
                  {line}
                </motion.div>
              ))}
              <div style={{ marginTop: 8, paddingTop: 12, borderTop: "1px solid hsl(220 13% 9%)" }}>
                <div style={{ fontSize: 10, color: "hsl(215 16% 32%)", letterSpacing: "0.08em" }}>This is RTBX Travel in service of the human stay.</div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div style={{ border: "1px solid hsl(220 13% 10%)" }}>
            <MetricRow label="Contact achieved" after="✓ Confirmed" delay={0.1} />
            <MetricRow label="Medical evaluation" after="In progress" delay={0.18} />
            <MetricRow label="Care plan initiated" after="✓ Active" delay={0.26} />
            <MetricRow label="Family notification" after="Underway" delay={0.34} />
            <MetricRow label="Protocol grade" after="Level 4 · 5 min 14 sec" delay={0.42} />
            <MetricRow label="Guest safety" after="CONFIRMED" delay={0.5} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "14px 16px", border: "1px solid hsl(220 13% 10%)", background: "hsl(220 13% 7%)", flex: 1 }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 26%)", textTransform: "uppercase", marginBottom: 8 }}>Duty of care — protocol note</div>
          <p style={{ fontSize: 11, color: "hsl(215 16% 42%)", lineHeight: 1.75 }}>Mr. Nakamura had been a PLATINUM guest for seven stays. RTBX detected a critical pattern shift across all monitored dimensions. The hotel's role in this moment was not operational. It was human. Level 4 protocol exists because great hospitality includes duty of care — and RTBX Travel is the system that ensures that duty is never missed.</p>
          <div style={{ marginTop: 14, padding: "10px 14px", border: "1px solid rgba(16,185,129,0.14)", background: "rgba(16,185,129,0.03)" }}>
            <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, marginBottom: 4 }}>Recovery note</div>
            <div style={{ fontSize: 10, color: "hsl(215 16% 42%)", lineHeight: 1.6 }}>This scenario demonstrates RTBX Travel operating at the boundary of hospitality and human care. The same operating layer — different signal class, same governed response.</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return null;
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function LiveDemo() {
  const [scenario, setScenario] = useState<ScenarioId>("operations");
  const [step, setStep] = useState(0);
  const [view, setView] = useState<ViewMode>("ops");
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const AUTO_DELAY = 5000;

  const canShowViewToggle = scenario === "guest";
  const stage = STAGES[step];

  // Reset on scenario change
  useEffect(() => {
    setStep(0);
    setView("ops");
    setAutoPlay(false);
    setAutoProgress(0);
  }, [scenario]);

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay) { setAutoProgress(0); return; }
    setAutoProgress(0);
    const start = Date.now();
    let frameId: number;
    const tick = () => {
      const p = Math.min((Date.now() - start) / AUTO_DELAY * 100, 100);
      setAutoProgress(p);
      if (p < 100) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    const timer = setTimeout(() => {
      setStep(s => {
        if (s < 5) return s + 1;
        setAutoPlay(false);
        return s;
      });
    }, AUTO_DELAY);
    return () => { clearTimeout(timer); cancelAnimationFrame(frameId); };
  }, [autoPlay, step]);

  const goNext = useCallback(() => { if (step < 5) { setStep(step + 1); setAutoPlay(false); } }, [step]);
  const goPrev = useCallback(() => { if (step > 0) { setStep(step - 1); setAutoPlay(false); } }, [step]);

  const ENGINE_COLOR: Record<string, string> = { "RTBX Intelligence Engine": "#c9a84c", "RTBX Routing Engine": "#60a5fa", "RTBX Execution Engine": "#10b981", "": "transparent" };
  const engine = STAGE_ENGINES[stage];
  const engineColor = ENGINE_COLOR[engine] || "#c9a84c";

  return (
    <div style={{ position: "fixed", inset: 0, paddingLeft: 224, display: "flex", flexDirection: "column", background: "hsl(220 13% 5%)", overflow: "hidden" }}>

      {/* Top bar: Scenario selector */}
      <div style={{ padding: "14px 28px", borderBottom: "1px solid hsl(220 13% 9%)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "hsl(215 16% 24%)", textTransform: "uppercase", marginRight: 4 }}>SCENARIO</div>
        <div style={{ display: "flex", border: "1px solid hsl(220 13% 14%)" }}>
          <button onClick={() => setScenario("operations")}
            style={{ padding: "7px 18px", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: scenario === "operations" ? "rgba(201,168,76,0.1)" : "transparent", color: scenario === "operations" ? "#c9a84c" : "hsl(215 16% 36%)", border: "none", borderRight: "1px solid hsl(220 13% 14%)", cursor: "pointer" }}>
            Operations · Foyer Congestion
          </button>
          <button onClick={() => setScenario("guest")}
            style={{ padding: "7px 18px", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: scenario === "guest" ? "rgba(239,68,68,0.08)" : "transparent", color: scenario === "guest" ? "#ef4444" : "hsl(215 16% 36%)", border: "none", cursor: "pointer" }}>
            Guest · Distress Signal
          </button>
        </div>

        {/* View toggle — guest scenario only */}
        <AnimatePresence>
          {canShowViewToggle && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              style={{ display: "flex", border: "1px solid hsl(220 13% 14%)", marginLeft: 4 }}>
              <button onClick={() => setView("ops")}
                style={{ padding: "7px 14px", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: view === "ops" ? "rgba(201,168,76,0.08)" : "transparent", color: view === "ops" ? "#c9a84c" : "hsl(215 16% 34%)", border: "none", borderRight: "1px solid hsl(220 13% 14%)", cursor: "pointer" }}>
                Operations View
              </button>
              <button onClick={() => setView("guest")}
                style={{ padding: "7px 14px", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: view === "guest" ? "rgba(239,68,68,0.08)" : "transparent", color: view === "guest" ? "#ef4444" : "hsl(215 16% 34%)", border: "none", cursor: "pointer" }}>
                Guest View
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginLeft: "auto", fontSize: 8.5, color: "hsl(215 16% 28%)", letterSpacing: "0.08em" }}>
          RTBX Travel · {scenario === "operations" ? "The Grand Meridian, London — 12:46" : "The Grand Meridian, London — 20:14"}
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ padding: "12px 28px", borderBottom: "1px solid hsl(220 13% 9%)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {STAGES.map((s, i) => {
            const isActive = i === step;
            const isPast = i < step;
            const c = isActive ? "#fff" : isPast ? "hsl(215 16% 42%)" : "hsl(215 16% 24%)";
            const eng = STAGE_ENGINES[s];
            const engC = { "RTBX Intelligence Engine": "#c9a84c", "RTBX Routing Engine": "#60a5fa", "RTBX Execution Engine": "#10b981", "": "#fff" }[eng] || "#c9a84c";
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STAGES.length - 1 ? 1 : "none" }}>
                <button onClick={() => { setStep(i); setAutoPlay(false); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, background: "transparent", border: "none", cursor: "pointer", padding: "4px 8px", flexShrink: 0, borderBottom: isActive ? `1px solid ${engineColor}` : "1px solid transparent" }}>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: c, transition: "color 0.2s" }}>{s}</span>
                  {eng && <span style={{ fontSize: 7, letterSpacing: "0.1em", color: isActive ? engC : "hsl(215 16% 20%)", textTransform: "uppercase", fontWeight: 600, transition: "color 0.2s" }}>{eng}</span>}
                </button>
                {i < STAGES.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: isPast ? "hsl(220 13% 18%)" : "hsl(220 13% 11%)", position: "relative", transition: "background 0.3s" }}>
                    {isActive && autoPlay && (
                      <motion.div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: engineColor, width: `${autoProgress}%`, transition: "none" }} />
                    )}
                    <span style={{ position: "absolute", right: -4, top: -5, fontSize: 8, color: isPast ? "hsl(220 13% 22%)" : "hsl(220 13% 14%)" }}>›</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage header */}
      <div style={{ padding: "16px 28px 12px", borderBottom: "1px solid hsl(220 13% 8%)", flexShrink: 0, display: "flex", alignItems: "center", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{stage}</span>
            {engine && (
              <div style={{ padding: "2px 8px", background: `${engineColor}15`, border: `1px solid ${engineColor}30` }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: engineColor, textTransform: "uppercase" }}>{engine}</span>
              </div>
            )}
          </div>
          <div style={{ fontSize: 11, color: "hsl(215 16% 36%)" }}>{STAGE_DESCS[stage]}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "hsl(215 16% 24%)", textTransform: "uppercase" }}>
          {step + 1} / 6
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: "hidden", padding: "16px 28px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${scenario}-${step}-${view}`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            style={{ height: "100%" }}
          >
            <StepContent scenario={scenario} step={step} view={view} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div style={{ padding: "12px 28px", borderTop: "1px solid hsl(220 13% 9%)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={goPrev} disabled={step === 0}
          style={{ padding: "7px 16px", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: "hsl(220 13% 8%)", border: "1px solid hsl(220 13% 14%)", color: step === 0 ? "hsl(215 16% 22%)" : "hsl(215 16% 48%)", cursor: step === 0 ? "not-allowed" : "pointer" }}>
          ← Previous
        </button>

        <button onClick={() => setAutoPlay(!autoPlay)}
          style={{ padding: "7px 16px", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: autoPlay ? `${engineColor}12` : "hsl(220 13% 8%)", border: `1px solid ${autoPlay ? `${engineColor}30` : "hsl(220 13% 14%)"}`, color: autoPlay ? engineColor : "hsl(215 16% 36%)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: autoPlay ? engineColor : "hsl(215 16% 28%)" }} className={autoPlay ? "animate-pulse" : ""} />
          {autoPlay ? "Auto · Playing" : "Auto · Play"}
        </button>

        <div style={{ flex: 1 }} />

        <div style={{ fontSize: 8.5, color: "hsl(215 16% 28%)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Signals → Convergence → Decision → Pathway → Execution → Outcome
        </div>

        <button onClick={goNext} disabled={step === 5}
          style={{ padding: "7px 20px", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: step === 5 ? "hsl(220 13% 8%)" : engineColor, border: "none", color: step === 5 ? "hsl(215 16% 30%)" : "hsl(220 13% 5%)", cursor: step === 5 ? "not-allowed" : "pointer" }}>
          {step === 5 ? "Complete" : "Next →"}
        </button>
      </div>
    </div>
  );
}
