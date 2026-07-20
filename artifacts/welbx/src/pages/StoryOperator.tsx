import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  PresentationSlide, SlideHeader, SlideFooter,
  FrameworkFlow, ScreenshotCard, ImpactCard, ExecutiveMetricCard,
  SlideNav, DataRow, Pill, C, PRINT_STYLES,
} from "@/components/presentation/PresentationComponents";

const TOTAL = 13;
const LABEL = "OPERATOR STORY LAB · OPERATOR DEEP DIVE";

/* ─── S1: The Problem ────────────────────────────────────────────── */
function S1() {
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", gap: 40, alignItems: "center" }}>
        <div style={{ flex: 3 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 14 }}>THE PROBLEM</div>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: C.white, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 16 }}>
            Hotels Have Solved Information.<br />
            <span style={{ color: "hsl(215 16% 50%)" }}>They Have Not Solved</span><br />
            <span style={{ color: C.amber }}>Execution.</span>
          </h2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.75, maxWidth: 500, marginBottom: 22 }}>
            Every operator has dashboards, PMS systems, and reporting tools. None of them convert signals into governed action. None of them close the gap between knowing and doing.
          </p>
          <div style={{ padding: "16px 20px", background: `${C.amber}08`, border: `1px solid ${C.amber}22`, maxWidth: 500 }}>
            <p style={{ fontSize: 12, color: C.white, lineHeight: 1.65, fontWeight: 500 }}>
              RTBX Travel is <span style={{ color: C.amber, fontWeight: 700 }}>Behavioural Infrastructure</span> — the operating layer that sits between every signal your environment generates and every action your team must take.
            </p>
          </div>
        </div>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Information Gap",  value: "Solved",     desc: "Hotels have data. RTBX Travel does not add more data.", color: C.green },
            { label: "Execution Gap",    value: "Unsolved",   desc: "No system converts signal into governed action at scale.", color: C.red },
            { label: "RTBX Position",    value: "The Bridge", desc: "Signal → Moment → Decision → Action → Outcome", color: C.amber },
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${item.color}22` }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.15em", color: item.color, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 5 }}>{item.value}</div>
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
    { label: "Signal",   color: C.blue,   def: "A measurable behavioural or environmental indicator that something is occurring or about to occur.", module: "Signal Registry · Intelligence" },
    { label: "Moment",   color: C.amber,  def: "The point at which a signal — or cluster of signals — demands a human or institutional response.", module: "Moment Registry · Live Moments" },
    { label: "Decision", color: C.violet, def: "A governed, context-aware choice about what action is appropriate and who should take it.", module: "Decision Registry · Playbook Engine" },
    { label: "Action",   color: C.cyan,   def: "The execution of a response: deployed to the right person, at the right time, with measurable parameters.", module: "Command Centre · Communications" },
    { label: "Outcome",  color: C.green,  def: "The result of the action, measured against a defined threshold of intent.", module: "Outcome Registry · Value Proof" },
    { label: "Learning", color: "hsl(215 16% 60%)", def: "The institutional intelligence gained from each cycle — improving the next signal interpretation.", module: "Learning Layer · Causal Trace" },
  ];
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>The GHSOL Framework</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 560, lineHeight: 1.65 }}>Every RTBX Travel operation follows one universal chain — from sensing a signal to capturing learning. The platform is built around this loop.</p>
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0, flex: 1 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ flex: 1, padding: "16px 12px", background: `${step.color}08`, border: `1px solid ${step.color}30`, display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", color: step.color, textTransform: "uppercase" }}>{step.label}</div>
                <p style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.5, flex: 1 }}>{step.def}</p>
                <div style={{ fontSize: 7.5, color: C.dimmed, paddingTop: 6, borderTop: `1px solid ${step.color}20` }}>{step.module}</div>
              </div>
              {i < steps.length - 1 && <span style={{ color: step.color, fontSize: 14, padding: "0 4px", opacity: 0.3 }}>→</span>}
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
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", gap: 32, alignItems: "flex-start" }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT ARE WE SEEING?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Signal Registry</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>247 active signals across 5 categories. Every signal monitored, categorised, and scored for confidence in real time.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { cat: "Guest",     count: 68, color: C.blue },
              { cat: "VIP",       count: 24, color: C.amber },
              { cat: "Workforce", count: 41, color: C.cyan },
              { cat: "Ops",       count: 58, color: C.violet },
              { cat: "Strategic", count: 56, color: C.green },
            ].map((cat, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: cat.color, textTransform: "uppercase", minWidth: 64 }}>{cat.cat}</span>
                  <div style={{ flex: 1, height: 3, background: "hsl(220 13% 10%)" }}>
                    <div style={{ width: `${(cat.count / 68) * 100}%`, height: "100%", background: cat.color, opacity: 0.5 }} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: C.muted, minWidth: 24 }}>{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 3 }}>
          <ScreenshotCard title="Signal Registry · Live Feed" subtitle="Updated continuously">
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { time: "09:04", cat: "GUEST",     signal: "Check-in queue: 14 guests · 9.2 min avg wait",         conf: "94%", status: "MOMENT", sc: C.red },
                { time: "09:03", cat: "VIP",       signal: "Diamond guest ETA 12 min · Room 847 OCCUPIED",           conf: "91%", status: "MOMENT", sc: C.red },
                { time: "09:02", cat: "WORKFORCE", signal: "Fatigue signature detected · F&B team member",           conf: "85%", status: "REVIEW", sc: C.amber },
                { time: "09:01", cat: "OPS",       signal: "HVAC fault reported · Floors 3–5 guest-impacting",      conf: "97%", status: "MOMENT", sc: C.red },
                { time: "08:59", cat: "GUEST",     signal: "Mobile app request unresponded · 14 min elapsed",        conf: "88%", status: "REVIEW", sc: C.amber },
                { time: "08:57", cat: "STRATEGIC", signal: "Weekend arrival surge forecast +28% · Saturday 14 Jun",  conf: "82%", status: "FLAGGED", sc: C.blue },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 7.5, color: C.dimmed, minWidth: 40, fontFamily: "monospace" }}>09:{row.time.split(":")[1]}</span>
                  <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, minWidth: 58, textTransform: "uppercase" }}>{row.cat}</span>
                  <span style={{ fontSize: 9.5, color: C.muted, flex: 1 }}>{row.signal}</span>
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: C.amber }}>{row.conf}</span>
                  <Pill label={row.status} color={row.sc} />
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
    { id: "GM-001", title: "Queue Pressure Building",   cat: "Recovery",    urgency: "HIGH",     status: "DETECTED",     color: C.red },
    { id: "GM-002", title: "VIP Arrival Risk",           cat: "VIP",         urgency: "HIGH",     status: "ACTIONED",     color: C.amber },
    { id: "GM-003", title: "First-Stay Anxiety Pattern", cat: "Guest",       urgency: "MEDIUM",   status: "IN PROGRESS",  color: C.amber },
    { id: "GM-004", title: "Critical System Failure",    cat: "Operational", urgency: "CRITICAL", status: "ESCALATED",    color: C.red },
    { id: "GM-005", title: "Staff Welfare Alert",        cat: "Workforce",   urgency: "MEDIUM",   status: "DETECTED",     color: C.blue },
    { id: "GM-006", title: "Dining Activation Window",   cat: "Commercial",  urgency: "LOW",      status: "RESOLVED",     color: C.green },
  ];
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", gap: 32 }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT DOES IT MEAN?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Moment Registry</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7, maxWidth: 340 }}>When signals cluster into significance, RTBX Travel creates a Moment — a structured, governed unit of operational intelligence with a recommended action.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Urgency levels", values: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],    colors: [C.red, C.red, C.amber, C.blue] },
              { label: "Status states",  values: ["DETECTED", "ACTIONED", "IN PROGRESS", "RESOLVED"], colors: [C.amber, C.blue, C.cyan, C.green] },
              { label: "Categories",     values: ["Guest", "VIP", "Recovery", "Operational", "Workforce"], colors: [C.blue, C.amber, C.red, C.violet, C.cyan] },
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
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: C.white }}>{m.title}</span>
                    <div style={{ display: "flex", gap: 5 }}>
                      <Pill label={m.urgency} color={m.color} />
                      <Pill label={m.status} color={m.status === "RESOLVED" ? C.green : m.color} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 8, color: C.dimmed }}>{m.id}</span>
                    <span style={{ fontSize: 8, color: C.dimmed }}>·</span>
                    <span style={{ fontSize: 8, color: C.dimmed }}>{m.cat}</span>
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
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT PATTERNS ARE EMERGING?</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Strategic Visibility</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 580, lineHeight: 1.65 }}>The intelligence engine detects cross-property patterns no individual manager would see. Leaders view portfolio-wide risks, opportunities, and anomalies in a single surface.</p>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <div style={{ flex: 3, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { level: "HIGH",   color: C.red,   headline: "Welfare signal cluster",   detail: "3 events in 8 days · Floor 5 · Hotel du Lac, Geneva. Pattern unattributed. 88% confidence.", onset: "8 days" },
              { level: "MEDIUM", color: C.amber, headline: "Staffing gap recurring",    detail: "Thursday–Friday coverage below threshold at peak arrival window. The Cartwright, Edinburgh.", onset: "3 weeks" },
              { level: "MEDIUM", color: C.amber, headline: "Weekend surge unmitigated", detail: "Forecast +28% arrivals Saturday. Mobile check-in inactive. Grand Meridian, Dubai.", onset: "Forecast" },
              { level: "LOW",    color: C.blue,  headline: "Concierge response drift",  detail: "Response time +22% over 14 days. Below complaint threshold. Meridian Palace, Singapore.", onset: "14 days" },
            ].map((p, i) => (
              <div key={i} style={{ padding: "12px 14px", background: C.card, border: `1px solid ${p.color}22` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Pill label={p.level} color={p.color} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.white }}>{p.headline}</span>
                  </div>
                  <span style={{ fontSize: 8, color: C.dimmed, fontWeight: 700 }}>ONSET: {p.onset}</span>
                </div>
                <p style={{ fontSize: 10, color: C.muted }}>{p.detail}</p>
              </div>
            ))}
          </div>
          <div style={{ flex: 2 }}>
            <ScreenshotCard title="Portfolio Health">
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
          </div>
        </div>
      </div>
      <SlideFooter slide={5} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S6–S8: Decision / Execution / Communications (compact) ─────── */
function S6() {
  const decisions = [
    { id: "DEC-047", moment: "VIP Arrival Risk",     playbook: "PB-002", decision: "Trigger Housekeeping Priority Protocol + Lounge pre-access", owner: "Auto-governed", status: "Executed",     sc: C.green },
    { id: "DEC-046", moment: "Queue Pressure",        playbook: "PB-001", decision: "Open secondary check-in lane · reallocate host",             owner: "Duty Manager", status: "Executed",     sc: C.green },
    { id: "DEC-045", moment: "Critical System Failure",playbook: "PB-005",decision: "Escalate HVAC to Engineering Lead + block affected rooms",    owner: "Duty Manager", status: "In Progress",  sc: C.amber },
    { id: "DEC-044", moment: "Staff Welfare Alert",   playbook: "PB-004", decision: "HR welfare check initiated + cover arranged",                  owner: "R. Patel (HR)",status: "Resolved",     sc: C.green },
  ];
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", gap: 32 }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT SHOULD HAPPEN?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Decision Registry</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>Every response is a governed decision. RTBX Travel records every decision made, who authorised it, which playbook applied, and what the outcome was.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Governed",  desc: "Decisions made within a known playbook framework." },
              { label: "Auditable", desc: "Every decision is time-stamped, attributed, and retrievable." },
              { label: "Learning",  desc: "Decision outcomes feed back into playbook calibration." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: C.card, border: `1px solid ${C.border}` }}>
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
                <div key={i} style={{ padding: "9px 11px", background: C.card2, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 8, color: C.dimmed, fontFamily: "monospace" }}>{d.id}</span>
                      <span style={{ fontSize: 7.5, fontWeight: 700, color: C.violet }}>{d.playbook}</span>
                    </div>
                    <Pill label={d.status} color={d.sc} />
                  </div>
                  <div style={{ fontSize: 8.5, color: C.dimmed, marginBottom: 3 }}>Moment: {d.moment}</div>
                  <p style={{ fontSize: 9.5, color: C.muted }}>{d.decision}</p>
                  <div style={{ fontSize: 8, color: C.dimmed, marginTop: 3 }}>Owner: {d.owner}</div>
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

function S7() {
  const pb = [
    { id: "PB-001", name: "Guest Recovery",         runs: 12, success: 92,  time: "4.1m", color: C.blue },
    { id: "PB-002", name: "VIP Arrival Protocol",   runs: 9,  success: 100, time: "2.8m", color: C.amber },
    { id: "PB-003", name: "Service Failure",        runs: 11, success: 87,  time: "6.2m", color: C.violet },
    { id: "PB-004", name: "Workforce Welfare",      runs: 3,  success: 100, time: "22m",  color: C.cyan },
    { id: "PB-005", name: "Maintenance Escalation", runs: 9,  success: 78,  time: "67m",  color: C.green },
  ];
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>HOW CONSISTENTLY ARE WE PERFORMING?</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Execution Index</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 560, lineHeight: 1.65 }}>RTBX Travel measures execution quality across every playbook — not just whether something happened, but whether it happened consistently and within threshold.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <ExecutiveMetricCard label="Execution Index"   value="92%"  delta="↑ 9pts"  note="vs last 30 days" color={C.amber} />
          <ExecutiveMetricCard label="Avg Resolution"    value="4.1m" delta="↓ 38%"   note="avg per moment"  color={C.green} />
          <ExecutiveMetricCard label="Playbook Success"  value="88%"  delta="↑ 6pts"  note="across 5 books"  color={C.blue}  />
          <ExecutiveMetricCard label="Moments Resolved"  value="44"   delta="vs 38"   note="last 30 days"    color={C.white} />
        </div>
        <ScreenshotCard title="Playbook Engine · Performance Overview" subtitle="Rolling 30 days">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {pb.map((p, i) => (
              <div key={i} style={{ padding: "12px 10px", background: C.card2, border: `1px solid ${p.color}22` }}>
                <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: p.color, textTransform: "uppercase", marginBottom: 5 }}>{p.id}</div>
                <div style={{ fontSize: 9, color: C.muted, marginBottom: 8, lineHeight: 1.35 }}>{p.name}</div>
                <div style={{ fontSize: 7, color: C.dimmed, marginBottom: 2 }}>SUCCESS RATE</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: p.success === 100 ? C.green : p.success >= 87 ? C.amber : C.red, lineHeight: 1 }}>{p.success}%</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <div><div style={{ fontSize: 7, color: C.dimmed }}>RUNS</div><div style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>{p.runs}</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 7, color: C.dimmed }}>AVG</div><div style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>{p.time}</div></div>
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

function S8() {
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", gap: 32, alignItems: "flex-start" }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHO NEEDS TO KNOW?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Central Communications</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>The right message. The right person. The right time. The right channel. RTBX Travel routes every communication without manual coordination.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { channel: "Mobile Push",  use: "Urgent staff escalations",     color: C.red },
              { channel: "In-App",       use: "Manager briefings",             color: C.amber },
              { channel: "Radio/Pager",  use: "Operational coordination",      color: C.violet },
              { channel: "Guest App",    use: "Personalised guest comms",      color: C.blue },
              { channel: "Email",        use: "Formal records",                color: C.green },
            ].map((ch, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: C.card, border: `1px solid ${C.border}` }}>
                <Pill label={ch.channel} color={ch.color} />
                <span style={{ fontSize: 9.5, color: C.muted }}>{ch.use}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 3 }}>
          <ScreenshotCard title="Communication Orchestration" subtitle="Today · 89 routed">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { to: "Housekeeping Lead", channel: "MOBILE", priority: "URGENT",   msg: "Room 847 priority clearance. Diamond arrival 12 min.", color: C.red },
                { to: "Duty Manager",      channel: "IN-APP", priority: "HIGH",     msg: "VIP Arrival Risk active. PB-002 running. Update at 09:20.", color: C.amber },
                { to: "Engineering Lead",  channel: "RADIO",  priority: "CRITICAL", msg: "HVAC fault · Floors 3–5. Escalation protocol initiated.", color: C.red },
                { to: "Guest Room 312",    channel: "GUEST",  priority: "LOW",      msg: "Your table at The Meridian is reserved for 7pm.", color: C.blue },
              ].map((m, i) => (
                <div key={i} style={{ padding: "9px 10px", background: C.card2, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Pill label={m.channel} color={m.color} />
                      <span style={{ fontSize: 8.5, color: C.muted }}>→ {m.to}</span>
                    </div>
                    <Pill label={m.priority} color={m.priority === "CRITICAL" || m.priority === "URGENT" ? C.red : m.priority === "HIGH" ? C.amber : C.blue} />
                  </div>
                  <p style={{ fontSize: 9.5, color: C.muted }}>{m.msg}</p>
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

/* ─── S9: Guest Layer ─────────────────────────────────────────────── */
function S9() {
  const chain = [
    { step: "Signal",   color: C.blue,   detail: "Diamond ETA 12 min. Room 847 occupied. Housekeeping ETA 22 min." },
    { step: "Moment",   color: C.amber,  detail: "Intelligence Engine: VIP Arrival Risk · 91% confidence · HIGH urgency. PB-002 queued." },
    { step: "Decision", color: C.violet, detail: "Housekeeping Priority Protocol. Floor supervisor. Lounge pre-access." },
    { step: "Comms",    color: C.cyan,   detail: "3 channels deployed: Housekeeping Lead · Duty Manager · Guest App." },
    { step: "Action",   color: C.green,  detail: "Room 847 fast-tracked. Supervisor on floor. Task confirmed complete." },
    { step: "Outcome",  color: C.green,  detail: "Room ready 4 min before arrival. Seamless. No escalation." },
    { step: "Learning", color: "hsl(215 16% 56%)", detail: "Pattern recalibrated. Detection window extended by 8 minutes." },
    { step: "Value",    color: C.amber,  detail: "Brand promise delivered. Loyalty protected. Moment activation: HIGH." },
  ];
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Guest Layer — The Diamond Arrival</h2>
          <div style={{ padding: "8px 14px", background: `${C.amber}0A`, border: `1px solid ${C.amber}22`, display: "inline-block" }}>
            <span style={{ fontSize: 9.5, color: C.muted }}><span style={{ color: C.amber, fontWeight: 700 }}>Mr V. Hartmann</span> · Diamond · 14th stay · Grand Meridian, London · Arriving in 12 min · Room 847 uncleared</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8, flex: 1 }}>
          {chain.map((step, i) => (
            <div key={i} style={{ padding: "12px 9px", background: `${step.color}08`, border: `1px solid ${step.color}28`, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: "0.14em", color: step.color, textTransform: "uppercase" }}>{step.step}</div>
              <p style={{ fontSize: 9, color: C.muted, lineHeight: 1.5 }}>{step.detail}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { view: "Guest Perspective",     color: C.blue,   points: ["Seamless arrival · room ready", "Lounge access waiting", "Preferences remembered"] },
            { view: "Operating Perspective",  color: C.amber,  points: ["Task auto-assigned and confirmed", "Timeline visible in real time", "No manual coordination required"] },
            { view: "Infrastructure Perspective", color: C.violet, points: ["91% confidence · PB-002 executed", "Moment GM-002: RESOLVED", "Learning cycle: complete"] },
          ].map((v, i) => (
            <div key={i} style={{ padding: "12px 14px", background: C.card, border: `1px solid ${v.color}22` }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: v.color, textTransform: "uppercase", marginBottom: 7 }}>{v.view}</div>
              {v.points.map((p, j) => <div key={j} style={{ fontSize: 9.5, color: C.muted, marginBottom: 3 }}>· {p}</div>)}
            </div>
          ))}
        </div>
      </div>
      <SlideFooter slide={9} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S10: Outcome Layer ──────────────────────────────────────────── */
function S10() {
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", gap: 28 }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT HAPPENED?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Outcome Layer</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>Every moment generates a measured outcome. RTBX Travel tracks what happened, what improved, and what the operation learned — making every result attributable.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <ExecutiveMetricCard label="Outcomes Resolved" value="44"   color={C.green} />
            <ExecutiveMetricCard label="Recovery Rate"     value="94%"  delta="↑ 12pts" color={C.amber} />
            <ExecutiveMetricCard label="Avg Impact Score"  value="8.7"  delta="↑ 0.4"   color={C.blue} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "What happened?",   desc: "Every resolved moment is logged with full attribution — who acted, when, and what the outcome was." },
              { label: "What improved?",   desc: "Recovery rate, response time, and execution quality all tracked against previous periods." },
              { label: "What was learned?",desc: "Outcomes feed directly back into signal calibration, playbook weighting, and team guidance." },
            ].map((item, i) => (
              <div key={i} style={{ padding: "11px 14px", background: C.card, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 8.5, fontWeight: 700, color: C.amber, marginBottom: 4 }}>{item.label}</div>
                <p style={{ fontSize: 9.5, color: C.muted }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 3 }}>
          <ScreenshotCard title="Outcome Registry · Recent Results">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { id: "OUT-047", moment: "VIP Arrival Risk",          result: "Room cleared 4 min before arrival. No escalation.", success: true },
                { id: "OUT-046", moment: "Queue Pressure Building",   result: "Queue resolved in 4.1 minutes. Satisfaction maintained.", success: true },
                { id: "OUT-045", moment: "Service Failure Recovery",  result: "Written complaint resolved. Guest retained.", success: true },
                { id: "OUT-044", moment: "Critical System Failure",   result: "HVAC partial repair. 3 rooms temporarily relocated.", success: false },
                { id: "OUT-043", moment: "Staff Welfare Alert",       result: "HR check completed. Cover arranged. Team member supported.", success: true },
              ].map((o, i) => (
                <div key={i} style={{ padding: "8px 10px", background: C.card2, border: `1px solid ${o.success ? C.green : C.amber}18` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                    <div style={{ display: "flex", gap: 7 }}>
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
        </div>
      </div>
      <SlideFooter slide={10} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S11: Value Layer (NEW) ──────────────────────────────────────── */
function S11() {
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT WAS THE VALUE?</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Value Layer</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 560, lineHeight: 1.65 }}>RTBX Travel distinguishes between three types of value created by each resolved moment. Together they form the total activation picture.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, flex: 1 }}>
          <div style={{ padding: "22px", background: C.card, border: `1px solid ${C.green}22`, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: C.green, textTransform: "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.green}18` }}>Protected Value</div>
            <p style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.65, marginBottom: 14 }}>Value that was at risk of being lost — and wasn't. Retained because RTBX Travel acted before the moment became a problem.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {["VIP loyalty maintained — no alternative required", "Service SLA met — no complaint triggered", "Brand promise delivered — trust preserved", "Retention outcome: stay 15 already confirmed"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 7 }}><div style={{ width: 3, height: 3, borderRadius: "50%", background: C.green, marginTop: 5, flexShrink: 0 }} /><span style={{ fontSize: 9.5, color: C.muted }}>{s}</span></div>
              ))}
            </div>
          </div>
          <div style={{ padding: "22px", background: C.card, border: `1px solid ${C.amber}22`, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.amber}18` }}>Created Value</div>
            <p style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.65, marginBottom: 14 }}>Value generated through proactive action — opportunities identified and realised because RTBX Travel detected the moment before it was obvious.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {["Lounge access activated before guest arrived", "Dining recommendation timed to guest pattern", "Next-stay intent captured at peak sentiment", "Upsell window identified and deployed"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 7 }}><div style={{ width: 3, height: 3, borderRadius: "50%", background: C.amber, marginTop: 5, flexShrink: 0 }} /><span style={{ fontSize: 9.5, color: C.muted }}>{s}</span></div>
              ))}
            </div>
          </div>
          <div style={{ padding: "22px", background: C.card, border: `1px solid ${C.blue}22`, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: C.blue, textTransform: "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.blue}18` }}>Opportunity Visibility</div>
            <p style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.65, marginBottom: 14 }}>Moments that were identified but not fully activated — making the cost of inaction visible, not invisible. A signal for process improvement.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {["HVAC fault: room move required — partial activation", "Maintenance backlog: response delayed beyond SLA", "Pattern: 3 weekend surge events unmitigated", "Opportunity loss: quantified and visible"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 7 }}><div style={{ width: 3, height: 3, borderRadius: "50%", background: C.blue, marginTop: 5, flexShrink: 0 }} /><span style={{ fontSize: 9.5, color: C.muted }}>{s}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <ExecutiveMetricCard label="Value Score"         value="94"   delta="↑ 31%"  note="vs last 30 days"  color={C.amber} />
          <ExecutiveMetricCard label="Protected Value"     value="HIGH" color={C.green}  />
          <ExecutiveMetricCard label="Created Value"       value="Score 87" delta="↑ 12%" color={C.amber} />
          <ExecutiveMetricCard label="Opportunity Tracked" value="3"   note="this period" color={C.blue}  />
        </div>
      </div>
      <SlideFooter slide={11} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S12: Executive Command ─────────────────────────────────────── */
function S12() {
  const layers = [
    { label: "Signals",       value: "247", color: C.blue   },
    { label: "Moments",       value: "6",   color: C.amber  },
    { label: "Decisions",     value: "47",  color: C.violet },
    { label: "Execution",     value: "92%", color: C.cyan   },
    { label: "Comms",         value: "89",  color: C.green  },
    { label: "Outcomes",      value: "94%", color: C.green  },
    { label: "Value",         value: "94",  color: C.amber  },
  ];
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Executive Command — Everything Connected</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 560, lineHeight: 1.65 }}>Leadership sees the full operating environment in a single view — across every layer, every property, every moment. Nothing is invisible.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
          {layers.map((l, i) => (
            <div key={i} style={{ padding: "14px 12px", background: C.card, border: `1px solid ${l.color}22` }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: l.color, textTransform: "uppercase", marginBottom: 6 }}>{l.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{l.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {[
            { name: "Grand Meridian, London",    score: 91, color: C.green },
            { name: "Meridian Palace, Singapore",score: 88, color: C.green },
            { name: "Grand Meridian, Dubai",     score: 78, color: C.amber },
            { name: "The Cartwright, Edinburgh", score: 73, color: C.amber },
            { name: "Hotel du Lac, Geneva",      score: 62, color: C.red   },
          ].map((p, i) => (
            <div key={i} style={{ padding: "12px 14px", background: C.card, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 8, color: C.muted, marginBottom: 6, lineHeight: 1.35 }}>{p.name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: p.color, marginBottom: 6 }}>{p.score}</div>
              <div style={{ height: 4, background: "hsl(220 13% 11%)" }}>
                <div style={{ width: `${p.score}%`, height: "100%", background: p.color, opacity: 0.65 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter slide={12} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── S13: Future Vision ──────────────────────────────────────────── */
function S13() {
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 28 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 14 }}>WHERE RTBX TRAVEL IS GOING</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            Behavioural Infrastructure Today.<br />
            <span style={{ color: C.amber }}>Behavioural Economy Tomorrow.</span><br />
            <span style={{ color: "hsl(215 16% 50%)" }}>Behavioural Exchange Over Time.</span>
          </h2>
        </div>
        <FrameworkFlow steps={[
          { label: "Behavioural Infrastructure", sub: "Operating layer within properties", color: C.amber },
          { label: "Behavioural Economy",        sub: "Activation layer across portfolios", color: C.blue },
          { label: "Behavioural Exchange",        sub: "Intelligence exchange across operators", color: C.violet },
        ]} gap={28} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { phase: "Phase 1 · Now",       title: "Behavioural Infrastructure", color: C.amber, status: "LIVE",          sc: C.green,  desc: "RTBX Travel operates as the execution layer within individual properties — detecting, deciding, acting, and learning." },
            { phase: "Phase 2 · 12–24 mo",  title: "Behavioural Economy",        color: C.blue,  status: "IN DEVELOPMENT",sc: C.amber,  desc: "RTBX Travel becomes the activation layer across portfolio networks — connecting value across properties and guest journeys." },
            { phase: "Phase 3 · Vision",    title: "Behavioural Exchange",        color: C.violet,status: "ROADMAP",       sc: C.violet, desc: "An open exchange layer where behavioural intelligence flows across operators, brands, and sectors." },
          ].map((phase, i) => (
            <div key={i} style={{ padding: "18px 20px", background: C.card, border: `1px solid ${phase.color}22` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: phase.color, textTransform: "uppercase" }}>{phase.phase}</div>
                <Pill label={phase.status} color={phase.sc} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8 }}>{phase.title}</div>
              <p style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.55 }}>{phase.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "18px 24px", background: `${C.amber}07`, border: `1px solid ${C.amber}20`, textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.white }}>Better visibility. Better decisions. Better execution. Better outcomes.</p>
          <p style={{ fontSize: 9, color: C.dimmed, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>RTBX Travel · Operator Story Lab · Example Multi-Property Hotel Operator Scenario</p>
        </div>
      </div>
      <SlideFooter slide={13} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── Shell ───────────────────────────────────────────────────────── */
const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13];

export default function StoryOperator() {
  const [current, setCurrent] = useState(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") setCurrent(c => Math.min(c + 1, TOTAL - 1));
      if (e.key === "ArrowLeft"  || e.key === "PageUp")   setCurrent(c => Math.max(c - 1, 0));
      if (e.key === "Escape") navigate("/story");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const SlideComponent = SLIDES[current];

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
          <SlideComponent />
        </motion.div>
      </AnimatePresence>
      <SlideNav
        current={current} total={TOTAL}
        onPrev={() => setCurrent(c => Math.max(c - 1, 0))}
        onNext={() => setCurrent(c => Math.min(c + 1, TOTAL - 1))}
        onClose={() => navigate("/story")}
        onPrint={() => {}}
        showExport={false}
      />
    </>
  );
}
