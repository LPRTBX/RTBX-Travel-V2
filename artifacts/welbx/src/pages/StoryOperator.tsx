import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  PresentationSlide, SlideHeader as BaseSlideHeader, SlideFooter,
  FrameworkFlow, ScreenshotCard, ImpactCard, ExecutiveMetricCard,
  SlideNav, DataRow, Pill, C, PRINT_STYLES,
} from "@/components/presentation/PresentationComponents";

const TOTAL = 13;
const LABEL = "OPERATOR STORY LAB · SIMULATION";

function SlideHeader(props: React.ComponentProps<typeof BaseSlideHeader>) {
  return (
    <>
      <BaseSlideHeader {...props} />
      <div style={{ marginTop: -8, marginBottom: 10, fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: C.amber, textTransform: "uppercase" }}>
        Synthetic inputs · rules-based demonstration · illustrative statuses and metrics · no dispatch or external updates · named people remain accountable
      </div>
    </>
  );
}

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
             JALDO Travel is presented here as a <span style={{ color: C.amber, fontWeight: 700 }}>Working Proof</span> — a proposed operating layer demonstrated with synthetic data, not a connected production system.
            </p>
          </div>
        </div>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Information Gap",  value: "Solved",     desc: "Hotels have data. JALDO Travel does not add more data.", color: C.green },
            { label: "Execution Gap",    value: "Unsolved",   desc: "No system converts signal into governed action at scale.", color: C.red },
            { label: "JALDO Position",    value: "The Bridge", desc: "Signal → Moment → Decision → Action → Outcome", color: C.amber },
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
    { label: "Moment",   color: C.amber,  def: "The point at which a signal — or cluster of signals — may require a human or institutional response.", module: "Moment Registry · Simulated Moments" },
    { label: "Decision", color: C.violet, def: "A governed, context-aware choice about what action is appropriate and who should take it.", module: "Decision Registry · Playbook Engine" },
    { label: "Action",   color: C.cyan,   def: "A recommended response for an accountable person to review and, in a future deployment, execute.", module: "Command Centre · Draft Communications" },
    { label: "Outcome",  color: C.green,  def: "A modelled result shown against an illustrative threshold; partner measurement is still required.", module: "Outcome Registry · Indicative Value" },
    { label: "Learning", color: "hsl(215 16% 60%)", def: "A proposed rule or playbook update that remains subject to accountable human review.", module: "Learning Layer · Illustrative Trace" },
  ];
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>The GHSOL Framework</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 560, lineHeight: 1.65 }}>Every JALDO Travel operation follows one universal chain — from sensing a signal to capturing learning. The platform is built around this loop.</p>
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
        <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Universal",  desc: "Works across all departments, properties, and guest types." },
             { label: "Reviewable", desc: "The Working Proof exposes each rules-based step for partner and operator review." },
             { label: "Governed",   desc: "Named people remain accountable for approval, action and evidence." },
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
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>247 illustrative signal types across 5 categories. This walkthrough shows how captured signals can be categorised and scored for confidence.</p>
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
          <ScreenshotCard title="Signal Registry · Simulated Feed" subtitle="Illustrative data">
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
    { id: "GM-002", title: "VIP Arrival Risk",           cat: "VIP",         urgency: "HIGH",     status: "MODELLED",     color: C.amber },
    { id: "GM-003", title: "First-Stay Anxiety Pattern", cat: "Guest",       urgency: "MEDIUM",   status: "IN PROGRESS",  color: C.amber },
    { id: "GM-004", title: "Critical System Failure",    cat: "Operational", urgency: "CRITICAL", status: "ESCALATED",    color: C.red },
    { id: "GM-005", title: "Staff Welfare Review Prompt", cat: "Workforce", urgency: "MEDIUM", status: "SIMULATED", color: C.blue },
    { id: "GM-006", title: "Dining Opportunity", cat: "Commercial", urgency: "LOW", status: "MODELLED", color: C.green },
  ];
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", gap: 32 }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT DOES IT MEAN?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Moment Registry</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7, maxWidth: 340 }}>When signals cluster into significance, JALDO Travel creates a Moment — a structured, governed unit of operational intelligence with a recommended action.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Urgency levels", values: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],    colors: [C.red, C.red, C.amber, C.blue] },
              { label: "Simulation states", values: ["SIMULATED", "RECOMMENDED", "MODELLED PROGRESS", "MODELLED OUTCOME"], colors: [C.amber, C.blue, C.cyan, C.green] },
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
          <ScreenshotCard title="Moment Registry" subtitle="6 synthetic moments">
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {moments.map((m, i) => (
                <div key={i} style={{ padding: "9px 11px", background: C.card2, border: `1px solid ${m.color}20` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: C.white }}>{m.title}</span>
                    <div style={{ display: "flex", gap: 5 }}>
                      <Pill label={m.urgency} color={m.color} />
                       <Pill label={m.status} color={m.status === "MODELLED" ? C.green : m.color} />
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
    { id: "DEC-047", moment: "VIP Arrival Risk", playbook: "PB-002", decision: "Recommend housekeeping priority protocol and lounge review", owner: "Duty Manager", status: "MODELLED", sc: C.green },
    { id: "DEC-046", moment: "Queue Pressure", playbook: "PB-001", decision: "Recommend opening a secondary lane and reallocating a host", owner: "Duty Manager", status: "MODELLED", sc: C.green },
    { id: "DEC-045", moment: "Critical System Failure", playbook: "PB-005", decision: "Draft HVAC escalation and affected-room review", owner: "Duty Manager", status: "REVIEW", sc: C.amber },
    { id: "DEC-044", moment: "Staff Welfare Review Prompt", playbook: "PB-004", decision: "Recommend confidential HR review; no welfare action is automated", owner: "R. Patel (HR)", status: "REVIEW", sc: C.amber },
  ];
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label={LABEL} />
      <div style={{ flex: 1, display: "flex", gap: 32 }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>WHAT SHOULD HAPPEN?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 10 }}>Decision Registry</h2>
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>Every response is a governed decision. JALDO Travel records every decision made, who authorised it, which playbook applied, and what the outcome was.</p>
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
          <ScreenshotCard title="Decision Registry · Illustrative Trace" subtitle="47 synthetic records">
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
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 560, lineHeight: 1.65 }}>This simulation shows how future pilot measures could be structured. The figures below are fictional and do not evidence execution quality.</p>
        </div>
        <div className="rtbx-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <ExecutiveMetricCard label="Modelled Execution Index" value="92%" note="illustrative" color={C.amber} />
          <ExecutiveMetricCard label="Modelled Response Time" value="4.1m" note="illustrative" color={C.green} />
          <ExecutiveMetricCard label="Modelled Playbook Result" value="88%" note="illustrative" color={C.blue} />
          <ExecutiveMetricCard label="Synthetic Outcomes" value="44" note="illustrative" color={C.white} />
        </div>
        <ScreenshotCard title="Playbook Engine · Illustrative Measures" subtitle="Synthetic 30-day period">
          <div className="rtbx-grid-5" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
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
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>The Working Proof demonstrates governed message drafting and routing to named role owners. Human approval and connected delivery remain operator-controlled.</p>
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
          <ScreenshotCard title="Communication Orchestration" subtitle="89 illustrative drafts · none sent">
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
    { step: "Signal",   color: C.blue,   detail: "Synthetic signal: Diamond ETA 12 min; Room 847 uncleared; illustrative housekeeping ETA 22 min." },
    { step: "Moment",   color: C.amber,  detail: "Modelled VIP Arrival Risk · 91% illustrative confidence · HIGH urgency. PB-002 proposed." },
    { step: "Decision", color: C.violet, detail: "Proposed for A. Morgan, Duty Manager: review housekeeping priority and lounge pre-access." },
    { step: "Comms",    color: C.cyan,   detail: "Drafts only for M. Silva, Housekeeping Lead; A. Morgan; and Mr V. Hartmann. Nothing is sent." },
    { step: "Action",   color: C.green,  detail: "Proposed only: M. Silva reviews room priority and supervisor assignment. No task is issued or executed." },
    { step: "Outcome",  color: C.green,  detail: "Modelled only: room ready four minutes before arrival with no escalation. Outcome unmeasured." },
    { step: "Learning", color: "hsl(215 16% 56%)", detail: "Proposed for A. Morgan's review: extend the detection window by eight minutes. No rule is changed." },
    { step: "Value",    color: C.amber,  detail: "Indicative hypothesis only: brand promise and loyalty may be supported. Value is unmeasured and unattributed." },
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
        <div className="rtbx-stack-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8, flex: 1 }}>
          {chain.map((step, i) => (
            <div key={i} style={{ padding: "12px 9px", background: `${step.color}08`, border: `1px solid ${step.color}28`, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: "0.14em", color: step.color, textTransform: "uppercase" }}>{step.step}</div>
              <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{step.detail}</p>
            </div>
          ))}
        </div>
        <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { view: "Guest Perspective", color: C.blue, points: ["Modelled seamless arrival", "Proposed lounge access", "Illustrative preference handling"] },
            { view: "Operating Perspective",  color: C.amber,  points: ["Task assignment simulated", "Illustrative timeline visible", "Named role owner retains control"] },
            { view: "Infrastructure Perspective", color: C.violet, points: ["91% illustrative confidence", "Moment GM-002: modelled outcome", "Proposed learning record for human review"] },
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
            <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7 }}>This simulation shows the structure of possible outcome records. Every result below is modelled and requires pilot measurement and accountable human confirmation.</p>
          </div>
          <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <ExecutiveMetricCard label="Modelled Outcomes" value="44" note="illustrative" color={C.green} />
            <ExecutiveMetricCard label="Modelled Recovery Rate" value="94%" note="illustrative" color={C.amber} />
            <ExecutiveMetricCard label="Modelled Impact Score" value="8.7" note="illustrative" color={C.blue} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "What could be recorded?", desc: "A future governed record could attribute confirmed actions and outcomes to named people." },
              { label: "What could be measured?", desc: "A pilot could measure recovery, response time and execution quality against an agreed baseline." },
              { label: "What could be reviewed?", desc: "Confirmed outcomes could inform proposed rule and playbook changes subject to human approval." },
            ].map((item, i) => (
              <div key={i} style={{ padding: "11px 14px", background: C.card, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 8.5, fontWeight: 700, color: C.amber, marginBottom: 4 }}>{item.label}</div>
                <p style={{ fontSize: 9.5, color: C.muted }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 3 }}>
          <ScreenshotCard title="Outcome Registry · Modelled Results">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { id: "OUT-047", moment: "VIP Arrival Risk", result: "Modelled room-ready outcome with no escalation.", success: true },
                { id: "OUT-046", moment: "Queue Pressure", result: "Modelled queue reduction in 4.1 minutes.", success: true },
                { id: "OUT-045", moment: "Service Recovery", result: "Illustrative complaint and retention outcome.", success: true },
                { id: "OUT-044", moment: "System Failure", result: "Illustrative partial-repair and room-review outcome.", success: false },
                { id: "OUT-043", moment: "Staff Welfare Review Prompt", result: "Confidential HR review recommended; no welfare action completed.", success: false },
              ].map((o, i) => (
                <div key={i} style={{ padding: "8px 10px", background: C.card2, border: `1px solid ${o.success ? C.green : C.amber}18` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                    <div style={{ display: "flex", gap: 7 }}>
                      <span style={{ fontSize: 7.5, color: C.dimmed }}>{o.id}</span>
                      <span style={{ fontSize: 9, fontWeight: 600, color: C.white }}>{o.moment}</span>
                    </div>
                    <Pill label={o.success ? "MODELLED" : "REVIEW"} color={o.success ? C.green : C.amber} />
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
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 560, lineHeight: 1.65 }}>This slide distinguishes three types of value hypothesis. The examples are illustrative, not measured, protected, created or attributable value.</p>
        </div>
        <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, flex: 1 }}>
          <div style={{ padding: "22px", background: C.card, border: `1px solid ${C.green}22`, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: C.green, textTransform: "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.green}18` }}>Potential Protected Value</div>
            <p style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.65, marginBottom: 14 }}>Hypotheses about value that a future pilot could test against agreed baselines.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {["Hypothesis: VIP loyalty may be supported", "Hypothesis: service risk may be reduced", "Hypothesis: brand promise may be supported", "Repeat stay: not measured"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 7 }}><div style={{ width: 3, height: 3, borderRadius: "50%", background: C.green, marginTop: 5, flexShrink: 0 }} /><span style={{ fontSize: 9.5, color: C.muted }}>{s}</span></div>
              ))}
            </div>
          </div>
          <div style={{ padding: "22px", background: C.card, border: `1px solid ${C.amber}22`, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.amber}18` }}>Potential Created Value</div>
            <p style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.65, marginBottom: 14 }}>Opportunity hypotheses that require partner validation and measured attribution.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {["Proposed lounge-access recommendation", "Illustrative dining recommendation", "Next-stay intent: not captured", "Potential upsell window: not activated"].map((s, i) => (
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
        <div className="rtbx-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <ExecutiveMetricCard label="Modelled Value Score" value="94" note="illustrative" color={C.amber} />
          <ExecutiveMetricCard label="Potential Protected Value" value="HIGH" note="unvalidated" color={C.green} />
          <ExecutiveMetricCard label="Potential Created Value" value="Score 87" note="unvalidated" color={C.amber} />
          <ExecutiveMetricCard label="Illustrative Opportunities" value="3" note="synthetic" color={C.blue} />
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
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 560, lineHeight: 1.65 }}>This fictional portfolio view illustrates how leadership information could be organised. It is not connected to any property or production data.</p>
        </div>
        <div className="rtbx-stack-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
          {layers.map((l, i) => (
            <div key={i} style={{ padding: "14px 12px", background: C.card, border: `1px solid ${l.color}22` }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: l.color, textTransform: "uppercase", marginBottom: 6 }}>{l.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{l.value}</div>
            </div>
          ))}
        </div>
        <div className="rtbx-grid-5" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
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
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 14 }}>WHERE JALDO TRAVEL IS GOING</div>
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
        <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { phase: "Phase 1 · Current", title: "Working Proof", color: C.amber, status: "SIMULATION", sc: C.amber, desc: "Rules-based interface demonstration with synthetic inputs, no integrations and no dispatch." },
            { phase: "Phase 2 · Planned", title: "Behavioural Economy", color: C.blue, status: "PLANNED", sc: C.amber, desc: "Proposed activation layer across portfolio networks, dependent on integration and pilot evidence." },
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
          <p style={{ fontSize: 11, color: C.dimmed, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>JALDO Travel · Operator Story Lab · Example Multi-Property Hotel Operator Scenario</p>
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
