import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  PresentationSlide, SlideHeader, SlideFooter,
  FrameworkFlow, ScreenshotCard, ImpactCard, ExecutiveMetricCard,
  SlideNav, DataRow, Pill, C, PRINT_STYLES,
} from "@/components/presentation/PresentationComponents";

const TOTAL = 12;

/* ─── S1: Why WELBX Exists ───────────────────────────────────────── */
function S1() {
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Full Platform Briefing" />
      <div style={{ flex: 1, display: "flex", gap: 48, alignItems: "center" }}>
        <div style={{ flex: 3 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 16 }}>THE PROBLEM</div>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: C.white, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 16 }}>
            Hotels Have Solved Information.<br />
            <span style={{ color: "hsl(215 16% 50%)" }}>They Have Not Solved</span><br />
            <span style={{ color: C.amber }}>Execution.</span>
          </h2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.75, maxWidth: 480, marginBottom: 24 }}>
            Every hospitality operator has dashboards, PMS systems, and reporting tools. None of them convert signals into governed action. None of them close the gap between knowing and doing.
          </p>
          <div style={{ padding: "16px 20px", background: `${C.amber}08`, border: `1px solid ${C.amber}22`, maxWidth: 480 }}>
            <p style={{ fontSize: 12, color: C.white, lineHeight: 1.65, fontWeight: 500 }}>
              WELBX is <span style={{ color: C.amber, fontWeight: 700 }}>Behavioural Infrastructure</span> — the operating layer that sits between every signal your environment generates and every action your team must take.
            </p>
          </div>
        </div>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Information Gap",  value: "Solved", desc: "Hotels have data. WELBX does not add more data.", color: C.green },
            { label: "Execution Gap",    value: "Unsolved", desc: "No system converts signal into governed action at scale.", color: C.red },
            { label: "WELBX Position",   value: "The Bridge", desc: "Signal → Moment → Decision → Action → Outcome", color: C.amber },
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${item.color}22` }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.15em", color: item.color, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 5 }}>{item.value}</div>
              <div style={{ fontSize: 9.5, color: C.muted }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter slide={1} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S2: GHSOL Framework ────────────────────────────────────────── */
function S2() {
  const steps = [
    { label: "Signal",   color: C.blue,   def: "A measurable behavioural or environmental indicator that something is occurring or about to occur.", module: "Signal Registry · Signal Intelligence" },
    { label: "Moment",  color: C.amber,  def: "The point at which a signal — or cluster of signals — demands a human or institutional response.", module: "Moment Registry · Live Moments" },
    { label: "Decision", color: C.violet, def: "A governed, context-aware choice about what action is appropriate and who should take it.", module: "Decision Registry · Playbook Engine" },
    { label: "Action",   color: C.cyan,   def: "The execution of a response: deployed to the right person, at the right time, with measurable parameters.", module: "Command Centre · Communications" },
    { label: "Outcome",  color: C.green,  def: "The result of the action, measured against a defined threshold of intent.", module: "Outcome Registry · Value Proof" },
    { label: "Learning", color: "hsl(215 16% 60%)", def: "The institutional intelligence gained from each cycle — improving the next signal interpretation.", module: "Learning Layer · Causal Trace" },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="GHSOL Framework" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>The GHSOL Framework</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 560, lineHeight: 1.65 }}>
            Every WELBX operation follows one universal framework — from sensing a signal to capturing learning. The platform is built around this chain.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ flex: 1, padding: "16px 14px", background: `${step.color}08`, border: `1px solid ${step.color}30`, display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", color: step.color, textTransform: "uppercase" }}>{step.label}</div>
                <p style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.5, flex: 1 }}>{step.def}</p>
                <div style={{ fontSize: 7.5, color: C.dimmed, paddingTop: 6, borderTop: `1px solid ${step.color}20`, letterSpacing: "0.06em" }}>{step.module}</div>
              </div>
              {i < steps.length - 1 && <span style={{ color: step.color, fontSize: 14, padding: "0 4px", opacity: 0.35, flexShrink: 0 }}>→</span>}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Universal",  desc: "Works across all departments, properties, and guest types." },
            { label: "Continuous", desc: "The chain runs indefinitely — each cycle improves the next." },
            { label: "Governed",   desc: "Every step is auditable, traceable, and measurable." },
          ].map((item, i) => (
            <div key={i} style={{ padding: "12px 14px", background: C.card, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.amber, textTransform: "uppercase", marginBottom: 5 }}>{item.label}</div>
              <p style={{ fontSize: 9.5, color: C.muted }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter slide={2} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S3: Signal Registry ─────────────────────────────────────────── */
function S3() {
  const categories = [
    { label: "Guest",     count: 68, color: C.blue,   signals: ["Check-in queue depth: 14 guests","Guest sentiment score: 6.2","Mobile app request unresponded: 14 min"] },
    { label: "VIP",       count: 24, color: C.amber,  signals: ["Diamond guest ETA 12 min · room uncleared","Returning guest loyalty tier: DIAMOND"] },
    { label: "Workforce", count: 41, color: C.cyan,   signals: ["Fatigue signature · F&B team member","Shift coverage gap · Thursday–Friday"] },
    { label: "Ops",       count: 58, color: C.violet, signals: ["HVAC fault · Floors 3–5","Maintenance ticket unresolved: 2h 14m"] },
    { label: "Strategic", count: 56, color: C.green,  signals: ["Weekend surge · Mobile check-in inactive","Pattern: welfare cluster · Hotel du Lac"] },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Signal Registry" />
      <div style={{ flex: 1, display: "flex", gap: 32, alignItems: "flex-start" }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT ARE WE SEEING?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Signal Registry</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>
              247 active signals across 5 categories. Every signal is monitored, categorised, and scored for confidence in real time. Nothing is invisible to the operating layer.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {categories.map((cat, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: i < categories.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: cat.color, textTransform: "uppercase", minWidth: 64 }}>{cat.label}</span>
                  <div style={{ flex: 1, height: 3, background: "hsl(220 13% 10%)" }}>
                    <div style={{ width: `${(cat.count / 68) * 100}%`, height: "100%", background: cat.color, opacity: 0.5 }} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: C.muted, minWidth: 24 }}>{cat.count}</span>
                </div>
                {cat.signals.map((s, j) => (
                  <div key={j} style={{ fontSize: 9.5, color: C.dimmed, paddingLeft: 74, marginTop: 2 }}>· {s}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 3 }}>
          <ScreenshotCard title="Signal Registry · Live Feed" subtitle="247 signals · Updated continuously">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { time: "09:04:12", cat: "GUEST",     signal: "Check-in queue: 14 guests · 9.2 min avg wait",       conf: 94, status: "MOMENT TRIGGERED", statusColor: C.red },
                { time: "09:03:47", cat: "VIP",       signal: "Diamond guest ETA 12 min · Room 847 OCCUPIED",        conf: 91, status: "MOMENT TRIGGERED", statusColor: C.red },
                { time: "09:02:31", cat: "WORKFORCE", signal: "Fatigue signature detected · F&B team member",        conf: 85, status: "MONITORING",       statusColor: C.amber },
                { time: "09:01:08", cat: "OPS",       signal: "HVAC fault reported · Floors 3–5",                   conf: 97, status: "MOMENT TRIGGERED", statusColor: C.red },
                { time: "08:59:44", cat: "GUEST",     signal: "Mobile app request unresponded · 14 min elapsed",     conf: 88, status: "REVIEWING",        statusColor: C.amber },
                { time: "08:57:20", cat: "STRATEGIC", signal: "Weekend arrival surge forecast +28% · Sat 14 Jun",    conf: 82, status: "FLAGGED",          statusColor: C.blue },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 7.5, color: C.dimmed, minWidth: 52, fontFamily: "monospace" }}>{row.time}</span>
                  <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, minWidth: 58, textTransform: "uppercase" }}>{row.cat}</span>
                  <span style={{ fontSize: 9.5, color: C.muted, flex: 1 }}>{row.signal}</span>
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: C.amber }}>{row.conf}%</span>
                  <Pill label={row.status} color={row.statusColor} />
                </div>
              ))}
            </div>
          </ScreenshotCard>
        </div>
      </div>
      <SlideFooter slide={3} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S4: Moment Registry ─────────────────────────────────────────── */
function S4() {
  const moments = [
    { id: "GM-001", title: "Queue Pressure Building",   cat: "Recovery",    urgency: "HIGH",     status: "DETECTED",     conf: 94, color: C.red },
    { id: "GM-002", title: "VIP Arrival Risk",           cat: "VIP",         urgency: "HIGH",     status: "ACTIONED",     conf: 91, color: C.amber },
    { id: "GM-003", title: "First-Stay Anxiety Pattern", cat: "Guest",       urgency: "MEDIUM",   status: "IN PROGRESS",  conf: 78, color: C.amber },
    { id: "GM-004", title: "Critical System Failure",    cat: "Operational", urgency: "CRITICAL", status: "ESCALATED",    conf: 97, color: C.red },
    { id: "GM-005", title: "Staff Welfare Alert",        cat: "Workforce",   urgency: "MEDIUM",   status: "DETECTED",     conf: 85, color: C.blue },
    { id: "GM-006", title: "Dining Activation Window",   cat: "Commercial",  urgency: "LOW",      status: "RESOLVED",     conf: 82, color: C.green },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Moment Registry" />
      <div style={{ flex: 1, display: "flex", gap: 32 }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT DOES IT MEAN?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Moment Registry</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7, maxWidth: 340 }}>
              When signals cluster into significance, WELBX creates a Moment — a structured, governed unit of operational intelligence with a recommended action.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Urgency levels",   values: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], colors: [C.red, C.red, C.amber, C.blue] },
              { label: "Status states",    values: ["DETECTED", "ACTIONED", "IN PROGRESS", "RESOLVED"], colors: [C.amber, C.blue, C.cyan, C.green] },
              { label: "Categories",       values: ["Guest", "VIP", "Recovery", "Operational", "Workforce"], colors: [C.blue, C.amber, C.red, C.violet, C.cyan] },
            ].map((group, i) => (
              <div key={i} style={{ padding: "10px 12px", background: C.card, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase", marginBottom: 6 }}>{group.label}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {group.values.map((v, j) => <Pill key={j} label={v} color={group.colors[j]} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 3 }}>
          <ScreenshotCard title="Moment Registry" subtitle="6 active moments">
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {moments.map((m, i) => (
                <div key={i} style={{ padding: "9px 11px", background: C.card2, border: `1px solid ${m.color}20` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: C.white }}>{m.title}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Pill label={m.urgency} color={m.color} />
                      <Pill label={m.status} color={m.status === "RESOLVED" ? C.green : m.color} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 8, color: C.dimmed }}>{m.id}</span>
                    <span style={{ fontSize: 8, color: C.dimmed }}>·</span>
                    <span style={{ fontSize: 8, color: C.dimmed }}>{m.cat}</span>
                    <span style={{ fontSize: 8, color: C.dimmed }}>·</span>
                    <span style={{ fontSize: 8, fontWeight: 600, color: C.amber }}>{m.conf}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </ScreenshotCard>
        </div>
      </div>
      <SlideFooter slide={4} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S5: Strategic Visibility ───────────────────────────────────── */
function S5() {
  const patterns = [
    { level: "HIGH",   color: C.red,   headline: "Welfare signal cluster",  detail: "3 events in 8 days · Floor 5 · Hotel du Lac, Geneva. Pattern not yet attributed to systemic cause.", onset: "8 days",      confidence: 88 },
    { level: "MEDIUM", color: C.amber, headline: "Staffing gap recurring",   detail: "Thursday–Friday coverage below threshold. Peak arrival window at risk. The Cartwright, Edinburgh.", onset: "3 weeks",     confidence: 76 },
    { level: "MEDIUM", color: C.amber, headline: "Weekend surge unmitigated",detail: "Forecast +28% arrivals Saturday. Mobile check-in inactive. Grand Meridian, Dubai.", onset: "Forecast",    confidence: 82 },
    { level: "LOW",    color: C.blue,  headline: "Concierge response drift", detail: "Response time +22% over 14 days. Below complaint threshold. Meridian Palace, Singapore.", onset: "14 days",     confidence: 70 },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Strategic Visibility" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT PATTERNS ARE EMERGING?</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Strategic Visibility</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 580, lineHeight: 1.65 }}>
            BXOS detects cross-property patterns that no individual manager would see. Strategic leaders view portfolio-wide risks, opportunities, and anomalies in a single surface.
          </p>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <div style={{ flex: 3, display: "flex", flexDirection: "column", gap: 10 }}>
            {patterns.map((p, i) => (
              <div key={i} style={{ padding: "13px 16px", background: C.card, border: `1px solid ${p.color}22` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Pill label={p.level} color={p.color} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.white }}>{p.headline}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 8, color: C.dimmed, fontWeight: 700 }}>ONSET: {p.onset}</span>
                    <span style={{ fontSize: 8, color: C.amber, fontWeight: 700 }}>BXOS {p.confidence}%</span>
                  </div>
                </div>
                <p style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>{p.detail}</p>
              </div>
            ))}
          </div>
          <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 10 }}>
            <ScreenshotCard title="Portfolio Health Index">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { name: "Grand Meridian, London",    score: 91, color: C.green },
                  { name: "Meridian Palace, Singapore",score: 88, color: C.green },
                  { name: "Grand Meridian, Dubai",     score: 78, color: C.amber },
                  { name: "The Cartwright, Edinburgh", score: 73, color: C.amber },
                  { name: "Hotel du Lac, Geneva",      score: 62, color: C.red },
                ].map((prop, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 8.5, color: C.muted }}>{prop.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: prop.color }}>{prop.score}</span>
                    </div>
                    <div style={{ height: 4, background: "hsl(220 13% 11%)" }}>
                      <div style={{ width: `${prop.score}%`, height: "100%", background: prop.color, opacity: 0.65 }} />
                    </div>
                  </div>
                ))}
              </div>
            </ScreenshotCard>
            <ScreenshotCard title="Opportunity Windows">
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { type: "ACTIVATION", headline: "Late-arrival upgrade opportunity", window: "Tonight" },
                  { type: "RETENTION",  headline: "4th-stay milestone guest · suite offer", window: "Check-in 3pm" },
                  { type: "SERVICE",    headline: "Pre-empt dining activation · Rm 312", window: "18:00–20:00" },
                ].map((opp, i) => (
                  <div key={i} style={{ padding: "6px 8px", background: C.card2, borderLeft: `2px solid ${C.amber}` }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, color: C.amber, letterSpacing: "0.12em", marginBottom: 3 }}>{opp.type}</div>
                    <div style={{ fontSize: 9, color: C.muted, marginBottom: 2 }}>{opp.headline}</div>
                    <div style={{ fontSize: 7.5, color: C.dimmed }}>{opp.window}</div>
                  </div>
                ))}
              </div>
            </ScreenshotCard>
          </div>
        </div>
      </div>
      <SlideFooter slide={5} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S6: Decision Registry ──────────────────────────────────────── */
function S6() {
  const decisions = [
    { id: "DEC-047", moment: "VIP Arrival Risk", playbook: "PB-002", decision: "Trigger Housekeeping Priority Protocol + Lounge pre-access", owner: "BXOS Auto", status: "Executed", statusColor: C.green },
    { id: "DEC-046", moment: "Queue Pressure Building", playbook: "PB-001", decision: "Open secondary check-in lane · reallocate host", owner: "Duty Manager", status: "Executed", statusColor: C.green },
    { id: "DEC-045", moment: "Critical System Failure", playbook: "PB-005", decision: "Escalate HVAC to Engineering Lead + block affected rooms", owner: "Duty Manager", status: "In Progress", statusColor: C.amber },
    { id: "DEC-044", moment: "Staff Welfare Alert", playbook: "PB-004", decision: "HR welfare check initiated + cover arranged", owner: "R. Patel (HR)", status: "Resolved", statusColor: C.green },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Decision Registry" />
      <div style={{ flex: 1, display: "flex", gap: 32 }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT SHOULD HAPPEN?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Decision Registry</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>
              Every response is a governed decision — not an improvised reaction. WELBX records every decision made, who authorised it, which playbook applied, and what the outcome was.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Governed",   desc: "Decisions are made within a known playbook framework, not improvised." },
              { label: "Auditable",  desc: "Every decision is time-stamped, attributed, and retrievable." },
              { label: "Learning",   desc: "Decision outcomes feed back into playbook calibration." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: C.card, border: `1px solid ${C.border}` }}>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: C.amber, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 8.5, fontWeight: 700, color: C.amber, marginBottom: 3 }}>{item.label}</div>
                  <p style={{ fontSize: 9.5, color: C.muted }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 3 }}>
          <ScreenshotCard title="Decision Registry · Audit Log" subtitle="Today · 47 decisions">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {decisions.map((d, i) => (
                <div key={i} style={{ padding: "10px 12px", background: C.card2, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 8, color: C.dimmed, fontFamily: "monospace" }}>{d.id}</span>
                      <span style={{ fontSize: 7.5, fontWeight: 700, color: C.violet, letterSpacing: "0.1em" }}>{d.playbook}</span>
                    </div>
                    <Pill label={d.status} color={d.statusColor} />
                  </div>
                  <div style={{ fontSize: 9, color: C.dimmed, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Moment: {d.moment}</div>
                  <p style={{ fontSize: 10, color: C.muted }}>{d.decision}</p>
                  <div style={{ fontSize: 8.5, color: C.dimmed, marginTop: 4 }}>Owner: {d.owner}</div>
                </div>
              ))}
            </div>
          </ScreenshotCard>
        </div>
      </div>
      <SlideFooter slide={6} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S7: Execution Index ─────────────────────────────────────────── */
function S7() {
  const playbookPerf = [
    { id: "PB-001", name: "Guest Experience Recovery",     executions: 12, success: 92, avgTime: "4.1m",  color: C.blue },
    { id: "PB-002", name: "VIP Arrival Protocol",          executions: 9,  success: 100, avgTime: "2.8m", color: C.amber },
    { id: "PB-003", name: "Service Failure Recovery",      executions: 11, success: 87,  avgTime: "6.2m", color: C.violet },
    { id: "PB-004", name: "Workforce Welfare Response",    executions: 3,  success: 100, avgTime: "22m",  color: C.cyan },
    { id: "PB-005", name: "Maintenance Escalation",        executions: 9,  success: 78,  avgTime: "67m",  color: C.green },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Execution Index" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>HOW CONSISTENTLY ARE WE PERFORMING?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em" }}>Execution Index</h2>
          </div>
          <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.65, maxWidth: 380, marginBottom: 2 }}>
            WELBX measures execution quality across every playbook, team, and time period — not just whether something happened, but whether it happened consistently.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <ExecutiveMetricCard label="Execution Index"    value="92%"  delta="↑ 9pts"  note="vs last 30 days" color={C.amber} />
          <ExecutiveMetricCard label="Avg Resolution"    value="4.1m" delta="↓ 38%"   note="avg per moment"  color={C.green} />
          <ExecutiveMetricCard label="Playbook Success"  value="88%"  delta="↑ 6pts"  note="across 5 books"  color={C.blue}  />
          <ExecutiveMetricCard label="Moments Resolved"  value="44"   delta="vs 38"   note="last 30 days"    color={C.white} />
        </div>
        <ScreenshotCard title="Playbook Engine · Performance Overview" subtitle="Rolling 30 days">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {playbookPerf.map((pb, i) => (
              <div key={i} style={{ padding: "12px 10px", background: C.card2, border: `1px solid ${pb.color}22` }}>
                <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: pb.color, textTransform: "uppercase", marginBottom: 6 }}>{pb.id}</div>
                <div style={{ fontSize: 9, color: C.muted, marginBottom: 9, lineHeight: 1.35 }}>{pb.name}</div>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 7, color: C.dimmed, marginBottom: 2 }}>SUCCESS RATE</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: pb.success === 100 ? C.green : pb.success >= 88 ? C.amber : C.red, lineHeight: 1 }}>{pb.success}%</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 7, color: C.dimmed }}>RUNS</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>{pb.executions}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 7, color: C.dimmed }}>AVG TIME</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>{pb.avgTime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScreenshotCard>
      </div>
      <SlideFooter slide={7} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S8: Central Communications ─────────────────────────────────── */
function S8() {
  const messages = [
    { to: "Housekeeping Lead",  channel: "MOBILE",  priority: "URGENT",  msg: "Room 847 priority clearance required. Diamond guest arrival 12 min.", time: "09:03" },
    { to: "Duty Manager",       channel: "IN-APP",  priority: "HIGH",    msg: "VIP Arrival Risk activated. PB-002 running. Update required at 09:20.", time: "09:03" },
    { to: "Engineering Lead",   channel: "RADIO",   priority: "CRITICAL",msg: "HVAC fault · Floors 3–5. Escalation protocol initiated. Respond immediately.", time: "08:58" },
    { to: "Guest Room 312",     channel: "GUEST APP",priority: "LOW",    msg: "Your table at The Meridian is reserved for 7pm. See you shortly.", time: "08:45" },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Communications" />
      <div style={{ flex: 1, display: "flex", gap: 32, alignItems: "flex-start" }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHO NEEDS TO KNOW?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Central Communications System</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>
              The right message. The right person. The right time. The right channel. WELBX routes every communication — to staff, guests, and leadership — without manual coordination.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { channel: "Mobile Push",  use: "Urgent staff escalations", color: C.red },
              { channel: "In-App",       use: "Manager briefings and updates", color: C.amber },
              { channel: "Radio/Pager",  use: "Operational team coordination", color: C.violet },
              { channel: "Guest App",    use: "Guest-facing personalised comms", color: C.blue },
              { channel: "Email",        use: "Formal records and confirmations", color: C.green },
            ].map((ch, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: C.card, border: `1px solid ${C.border}` }}>
                <Pill label={ch.channel} color={ch.color} />
                <span style={{ fontSize: 9.5, color: C.muted }}>{ch.use}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 3 }}>
          <ScreenshotCard title="Communication Orchestration · Live Queue" subtitle="Today · 89 routed">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ padding: "10px 12px", background: C.card2, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <Pill label={msg.channel} color={C.blue} />
                      <span style={{ fontSize: 8.5, fontWeight: 600, color: C.muted }}>→ {msg.to}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 7.5, color: C.dimmed }}>{msg.time}</span>
                      <Pill label={msg.priority} color={msg.priority === "CRITICAL" ? C.red : msg.priority === "URGENT" ? C.red : msg.priority === "HIGH" ? C.amber : C.blue} />
                    </div>
                  </div>
                  <p style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.5 }}>{msg.msg}</p>
                </div>
              ))}
            </div>
          </ScreenshotCard>
        </div>
      </div>
      <SlideFooter slide={8} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S9: Guest Layer Scenario (full) ────────────────────────────── */
function S9() {
  const chain = [
    { step: "Signal",        color: C.blue,   detail: "Diamond guest ETA 12 min. Room 847 still occupied. Housekeeping ETA 22 min." },
    { step: "Moment",        color: C.amber,  detail: "BXOS: VIP Arrival Risk · Confidence 91% · HIGH urgency. Playbook PB-002 triggered." },
    { step: "Decision",      color: C.violet, detail: "Housekeeping Priority Protocol. Floor supervisor deployed. Lounge pre-access activated." },
    { step: "Action",        color: C.cyan,   detail: "Message routed to Housekeeping Lead + Duty Manager via Mobile and In-App." },
    { step: "Outcome",       color: C.green,  detail: "Room cleared 4 min before arrival. Guest arrival seamless. No friction experienced." },
    { step: "Learning",      color: "hsl(215 16% 56%)", detail: "Pattern recorded. Playbook calibrated. Next VIP arrival flagged 20 min earlier." },
    { step: "Value",         color: C.amber,  detail: "Brand promise delivered. Loyalty protected. Moment activation documented." },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Guest Layer" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-end" }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em" }}>Guest Layer — Full Scenario</h2>
          </div>
          <div style={{ padding: "8px 14px", background: `${C.amber}0A`, border: `1px solid ${C.amber}22`, flex: 1 }}>
            <span style={{ fontSize: 9, color: C.muted }}>
              <span style={{ color: C.amber, fontWeight: 700 }}>Mr V. Hartmann</span> · Diamond · 14th stay · Grand Meridian, London · Arriving in 12 min · Room 847 uncleared
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, flex: 1 }}>
          {chain.map((step, i) => (
            <div key={i} style={{ padding: "12px 10px", background: `${step.color}08`, border: `1px solid ${step.color}28`, display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: step.color, textTransform: "uppercase" }}>{step.step}</div>
              <p style={{ fontSize: 9, color: C.muted, lineHeight: 1.5 }}>{step.detail}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div style={{ padding: "13px 16px", background: C.card, border: `1px solid ${C.blue}22` }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.blue, textTransform: "uppercase", marginBottom: 7 }}>Guest Perspective</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["Arrival seamless — room ready on arrival","Lounge access waiting without request","Welcome message with remembered preferences"].map((s, i) => <div key={i} style={{ fontSize: 9.5, color: C.muted }}>· {s}</div>)}
            </div>
          </div>
          <div style={{ padding: "13px 16px", background: C.card, border: `1px solid ${C.amber}22` }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.amber, textTransform: "uppercase", marginBottom: 7 }}>Operating Perspective</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["Task auto-assigned and confirmed complete","Timeline visible in real time to management","Escalation path clear if timeline slips"].map((s, i) => <div key={i} style={{ fontSize: 9.5, color: C.muted }}>· {s}</div>)}
            </div>
          </div>
          <div style={{ padding: "13px 16px", background: C.card, border: `1px solid ${C.violet}22` }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.violet, textTransform: "uppercase", marginBottom: 7 }}>Infrastructure Perspective</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["Pattern matched · Confidence 91%","Playbook PB-002 executed and logged","Learning cycle completed · next arrival pre-empted earlier"].map((s, i) => <div key={i} style={{ fontSize: 9.5, color: C.muted }}>· {s}</div>)}
            </div>
          </div>
        </div>
      </div>
      <SlideFooter slide={9} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S10: Outcome + Value Layer ─────────────────────────────────── */
function S10() {
  const outcomes = [
    { id: "OUT-047", moment: "VIP Arrival Risk",          result: "Room cleared 4 min before arrival. No escalation.", success: true },
    { id: "OUT-046", moment: "Queue Pressure Building",   result: "Queue resolved in 4.1 minutes. Guest satisfaction maintained.", success: true },
    { id: "OUT-045", moment: "Service Failure Recovery",  result: "Written complaint resolved. Guest retained.", success: true },
    { id: "OUT-044", moment: "Critical System Failure",   result: "HVAC partial repair. 3 rooms temporarily relocated.", success: false },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Outcome & Value Layer" />
      <div style={{ flex: 1, display: "flex", gap: 24 }}>
        <div style={{ flex: 3, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Outcome & Value Layer</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7, maxWidth: 400 }}>
              Every moment generates a measurable outcome. WELBX tracks what happened, what the impact was, and what the operation learned.
            </p>
          </div>
          <ScreenshotCard title="Outcome Registry · Recent Results">
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {outcomes.map((o, i) => (
                <div key={i} style={{ padding: "8px 10px", background: C.card2, border: `1px solid ${o.success ? C.green : C.amber}1A` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 7.5, color: C.dimmed }}>{o.id}</span>
                      <span style={{ fontSize: 9, fontWeight: 600, color: C.white }}>{o.moment}</span>
                    </div>
                    <Pill label={o.success ? "RESOLVED" : "PARTIAL"} color={o.success ? C.green : C.amber} />
                  </div>
                  <p style={{ fontSize: 9.5, color: C.muted }}>{o.result}</p>
                </div>
              ))}
            </div>
          </ScreenshotCard>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <ExecutiveMetricCard label="Outcomes Resolved" value="44"   color={C.green} />
            <ExecutiveMetricCard label="Recovery Rate"     value="94%"  delta="↑ 12pts" color={C.amber} />
            <ExecutiveMetricCard label="Avg Impact Score"  value="8.7"  delta="↑ 0.4"   color={C.blue} />
          </div>
        </div>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { title: "Organisational Memory", color: C.violet, desc: "Every outcome is stored and retrievable. Pattern intelligence compounds with every operation." },
            { title: "Value Per Moment",       color: C.amber,  desc: "Each resolved moment carries an attributed activation value — tracked and visible at executive level." },
            { title: "Opportunity Loss",       color: C.red,    desc: "WELBX tracks moments that were missed or resolved late — making the cost of inaction visible." },
            { title: "Value Engine",           color: C.green,  desc: "The sum of activations across all properties creates a live value index for the entire portfolio." },
            { title: "Learning Layer",         color: C.cyan,   desc: "Outcomes feed back into signal calibration, playbook weighting, and team performance guidance." },
          ].map((item, i) => (
            <div key={i} style={{ padding: "12px 14px", background: C.card, border: `1px solid ${item.color}1A`, flex: 1 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: item.color, textTransform: "uppercase", marginBottom: 5 }}>{item.title}</div>
              <p style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter slide={10} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S11: Executive Command ─────────────────────────────────────── */
function S11() {
  const layers = [
    { label: "Signals",        value: "247 active", color: C.blue,   desc: "Monitored continuously across all dimensions" },
    { label: "Moments",        value: "6 active",   color: C.amber,  desc: "3 HIGH · 2 MEDIUM · 1 LOW urgency" },
    { label: "Decisions",      value: "47 today",   color: C.violet, desc: "44 resolved · 3 in progress" },
    { label: "Execution",      value: "92%",        color: C.cyan,   desc: "Execution Index · ↑ 9pts vs last period" },
    { label: "Communication",  value: "89 routed",  color: C.green,  desc: "Staff, operations, and guest channels" },
    { label: "Outcomes",       value: "94% success",color: C.green,  desc: "44 of 47 moments fully resolved" },
    { label: "Value",          value: "Score 94",   color: C.amber,  desc: "↑ 31% vs last 30 days" },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Executive Command" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Executive Command</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 560, lineHeight: 1.65 }}>
            Leadership sees the full operating environment in a single view — across every layer, every property, every moment. Nothing is invisible. Nothing is deferred.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
          {layers.map((layer, i) => (
            <div key={i} style={{ padding: "14px 12px", background: C.card, border: `1px solid ${layer.color}22` }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: layer.color, textTransform: "uppercase", marginBottom: 7 }}>{layer.label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.white, lineHeight: 1, marginBottom: 6 }}>{layer.value}</div>
              <p style={{ fontSize: 8.5, color: C.dimmed, lineHeight: 1.45 }}>{layer.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {[
            { name: "Grand Meridian, London",    health: 91, color: C.green  },
            { name: "Meridian Palace, Singapore",health: 88, color: C.green  },
            { name: "Grand Meridian, Dubai",     health: 78, color: C.amber  },
            { name: "The Cartwright, Edinburgh", health: 73, color: C.amber  },
            { name: "Hotel du Lac, Geneva",      health: 62, color: C.red    },
          ].map((p, i) => (
            <div key={i} style={{ padding: "12px 14px", background: C.card, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 8.5, color: C.muted, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: p.color, marginBottom: 5 }}>{p.health}</div>
              <div style={{ height: 4, background: "hsl(220 13% 11%)" }}>
                <div style={{ width: `${p.health}%`, height: "100%", background: p.color, opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter slide={11} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S12: Future Vision ──────────────────────────────────────────── */
function S12() {
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Future Vision" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 16 }}>WHERE WELBX IS GOING</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 20 }}>
            Behavioural Infrastructure Today.<br />
            <span style={{ color: C.amber }}>Behavioural Economy Tomorrow.</span><br />
            <span style={{ color: "hsl(215 16% 50%)" }}>Behavioural Exchange Over Time.</span>
          </h2>
        </div>

        <div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 12 }}>THE EXTENDED CHAIN</div>
          <FrameworkFlow steps={[
            { label: "Signal",      sub: "Real-time sensing",      color: C.blue },
            { label: "Moment",      sub: "Pattern intelligence",   color: C.amber },
            { label: "Action",      sub: "Governed execution",     color: C.violet },
            { label: "Outcome",     sub: "Measured result",        color: C.green },
            { label: "Activation",  sub: "Value realised",         color: C.cyan },
            { label: "Value",       sub: "Portfolio impact",       color: C.amber },
          ]} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            {
              phase: "Phase 1 · Now",
              title: "Behavioural Infrastructure",
              desc: "WELBX operates as the execution layer within individual properties — detecting, deciding, acting, and learning.",
              status: "LIVE",
              statusColor: C.green,
              color: C.amber,
            },
            {
              phase: "Phase 2 · 12–24 months",
              title: "Behavioural Economy",
              desc: "WELBX becomes the activation layer across portfolio networks — connecting value across properties, teams, and guest journeys.",
              status: "IN DEVELOPMENT",
              statusColor: C.amber,
              color: C.blue,
            },
            {
              phase: "Phase 3 · Vision",
              title: "Behavioural Exchange",
              desc: "An open exchange layer where behavioural intelligence flows across operators, brands, and sectors — creating a shared economy of execution.",
              status: "ROADMAP",
              statusColor: C.violet,
              color: C.violet,
            },
          ].map((phase, i) => (
            <div key={i} style={{ padding: "18px 20px", background: C.card, border: `1px solid ${phase.color}22` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: phase.color, textTransform: "uppercase" }}>{phase.phase}</div>
                <Pill label={phase.status} color={phase.statusColor} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8 }}>{phase.title}</div>
              <p style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.55 }}>{phase.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: "18px 24px", background: `${C.amber}07`, border: `1px solid ${C.amber}20`, textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.white, letterSpacing: "0.01em" }}>
            Better visibility. Better decisions. Better execution. Better outcomes.
          </p>
          <p style={{ fontSize: 9, color: C.dimmed, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            WELBX Behavioural Infrastructure · The Operating Layer Between Signal And Action
          </p>
        </div>
      </div>
      <SlideFooter slide={12} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── Presentation Shell ──────────────────────────────────────────── */
const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];

export default function Presentation15Min() {
  const [current, setCurrent] = useState(0);
  const [printing, setPrinting] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") setCurrent(c => Math.min(c + 1, TOTAL - 1));
      if (e.key === "ArrowLeft"  || e.key === "PageUp")   setCurrent(c => Math.max(c - 1, 0));
      if (e.key === "Escape") navigate("/presentation-mode");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrinting(false), 800);
    }, 250);
  };

  const SlideComponent = SLIDES[current];

  return (
    <>
      <style>{PRINT_STYLES}</style>
      {printing ? (
        SLIDES.map((S, i) => <S key={i} />)
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>
      )}
      <SlideNav
        current={current}
        total={TOTAL}
        onPrev={() => setCurrent(c => Math.max(c - 1, 0))}
        onNext={() => setCurrent(c => Math.min(c + 1, TOTAL - 1))}
        onClose={() => navigate("/presentation-mode")}
        onPrint={handlePrint}
      />
    </>
  );
}
