import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  PresentationSlide, SlideHeader, SlideFooter,
  FrameworkFlow, ScreenshotCard, ImpactCard, ExecutiveMetricCard,
  SlideNav, DataRow, Pill, C, PRINT_STYLES,
} from "@/components/presentation/PresentationComponents";

const TOTAL = 6;

/* ─── Slide 1: Why WELBX Exists ──────────────────────────────────── */
function S1() {
  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Executive Briefing" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 36 }}>
        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 16 }}>
            THE PROBLEM
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: C.white, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 10 }}>
            Hotels Have Solved<br />
            <span style={{ color: C.amber }}>Information.</span>
          </h2>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "hsl(215 16% 50%)", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            They Have Not Solved<br />
            <span style={{ color: C.white }}>Execution.</span>
          </h2>
        </div>
        <div style={{ maxWidth: 540, padding: "20px 24px", background: `${C.amber}08`, border: `1px solid ${C.amber}22` }}>
          <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>
            WELBX is <span style={{ color: C.white, fontWeight: 600 }}>Behavioural Infrastructure</span> — the operating layer between signal and action. It detects what is happening, decides what should happen, and ensures it does.
          </p>
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: C.dimmed, textTransform: "uppercase", marginBottom: 12 }}>THE WELBX OPERATING CHAIN</div>
          <FrameworkFlow steps={[
            { label: "Signal",   sub: "Something is detected" },
            { label: "Moment",   sub: "It becomes significant" },
            { label: "Decision", sub: "A response is governed" },
            { label: "Action",   sub: "It is executed" },
            { label: "Outcome",  sub: "Result is measured" },
          ]} />
        </div>
      </div>
      <SlideFooter slide={1} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── Slide 2: The Execution Gap ─────────────────────────────────── */
function S2() {
  const traditional = [
    ["Information available?", "✓", "✓"],
    ["Signals detected in real time?", "Partial", "✓"],
    ["Moments identified automatically?", "✗", "✓"],
    ["Decisions governed + tracked?", "✗", "✓"],
    ["Actions coordinated across teams?", "Variable", "✓"],
    ["Outcomes measured per moment?", "✗", "✓"],
    ["Learning fed back into the system?", "✗", "✓"],
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="The Execution Gap" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>The Execution Gap</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 520, lineHeight: 1.65 }}>
            Traditional environments collect information. Execution varies based on individual judgment, team capacity, and institutional memory — none of which scale.
          </p>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 20 }}>
          {/* Table */}
          <div style={{ flex: 2, background: C.card, border: `1px solid ${C.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ padding: "9px 14px", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.15em", color: C.dimmed, textTransform: "uppercase" }}>Capability</div>
              <div style={{ padding: "9px 14px", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.15em", color: C.muted, textTransform: "uppercase", borderLeft: `1px solid ${C.border}`, textAlign: "center" }}>Traditional</div>
              <div style={{ padding: "9px 14px", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.15em", color: C.amber, textTransform: "uppercase", borderLeft: `1px solid ${C.border}`, textAlign: "center" }}>WELBX</div>
            </div>
            {traditional.map(([cap, trad, welbx], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", borderBottom: i < traditional.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ padding: "8px 14px", fontSize: 10, color: C.muted }}>{cap}</div>
                <div style={{ padding: "8px 14px", fontSize: 10, fontWeight: 600, color: trad === "✗" ? C.red : trad === "✓" ? C.green : "hsl(215 16% 42%)", borderLeft: `1px solid ${C.border}`, textAlign: "center" }}>{trad}</div>
                <div style={{ padding: "8px 14px", fontSize: 10, fontWeight: 600, color: welbx === "✓" ? C.green : C.muted, borderLeft: `1px solid ${C.border}`, textAlign: "center" }}>{welbx}</div>
              </div>
            ))}
          </div>
          {/* Right panel */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Execution Consistency", trad: "Variable", welbx: "Governed", color: C.amber },
              { label: "Response Speed",        trad: "Minutes–Hours", welbx: "< 2 Minutes", color: C.green },
              { label: "Outcome Visibility",    trad: "Retrospective", welbx: "Real-time", color: C.blue },
              { label: "Institutional Memory",  trad: "Lost on departure", welbx: "Persistent", color: C.violet },
            ].map((item, i) => (
              <div key={i} style={{ padding: "13px 16px", background: C.card, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: item.color, textTransform: "uppercase", marginBottom: 8 }}>{item.label}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, padding: "5px 8px", background: "hsl(220 13% 11%)", textAlign: "center" }}>
                    <div style={{ fontSize: 7.5, color: C.dimmed, marginBottom: 2 }}>Traditional</div>
                    <div style={{ fontSize: 9, color: "hsl(215 16% 42%)", fontWeight: 600 }}>{item.trad}</div>
                  </div>
                  <div style={{ flex: 1, padding: "5px 8px", background: `${item.color}0C`, border: `1px solid ${item.color}22`, textAlign: "center" }}>
                    <div style={{ fontSize: 7.5, color: C.dimmed, marginBottom: 2 }}>WELBX</div>
                    <div style={{ fontSize: 9, color: item.color, fontWeight: 700 }}>{item.welbx}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter slide={2} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── Slide 3: Signals Become Moments ────────────────────────────── */
function S3() {
  const signals = [
    { category: "Guest",     signal: "Check-in queue depth: 14 guests",          confidence: "94%" },
    { category: "VIP",       signal: "Diamond guest ETA 12 min · room uncleared", confidence: "91%" },
    { category: "Sentiment", signal: "Guest satisfaction score: 6.2 / 10",        confidence: "88%" },
    { category: "Ops",       signal: "HVAC fault · Floors 3–5 (guest-impacting)", confidence: "97%" },
    { category: "Workforce", signal: "Fatigue signature · F&B team member",       confidence: "85%" },
  ];
  const moments = [
    { id: "M·001", title: "Queue Pressure Building",  urgency: "HIGH",   status: "DETECTED",  color: C.red },
    { id: "M·002", title: "VIP Arrival Risk",          urgency: "HIGH",   status: "ACTIONED",  color: C.amber },
    { id: "M·003", title: "Guest Sentiment Drop",      urgency: "MEDIUM", status: "IN PROGRESS", color: C.amber },
    { id: "M·004", title: "Critical System Failure",   urgency: "CRITICAL", status: "ESCALATED", color: C.red },
    { id: "M·005", title: "Staff Welfare Alert",       urgency: "MEDIUM", status: "DETECTED",  color: C.blue },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Signals to Moments" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Signals Become Moments</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 520, lineHeight: 1.65 }}>
            WELBX continuously monitors operational signals and converts them into governed moments — each one carrying context, urgency, and a recommended action.
          </p>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <ScreenshotCard title="Signal Registry" subtitle="Live · 247 signals active" flex={1}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {signals.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: i < signals.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase", minWidth: 54 }}>{s.category}</span>
                    <span style={{ fontSize: 9.5, color: C.muted }}>{s.signal}</span>
                  </div>
                  <span style={{ fontSize: 8.5, fontWeight: 600, color: C.amber, flexShrink: 0, marginLeft: 8 }}>{s.confidence}</span>
                </div>
              ))}
            </div>
          </ScreenshotCard>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", color: C.amber, fontSize: 20, opacity: 0.4 }}>→</div>

          <ScreenshotCard title="Moment Registry" subtitle="6 active moments" flex={1}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {moments.map((m, i) => (
                <div key={i} style={{ padding: "8px 10px", background: C.card2, border: `1px solid ${m.color}18` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.white }}>{m.title}</span>
                    <Pill label={m.status} color={m.color} />
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontSize: 7.5, color: C.dimmed }}>{m.id}</span>
                    <span style={{ fontSize: 7.5, color: C.dimmed }}>·</span>
                    <span style={{ fontSize: 7.5, fontWeight: 700, color: m.color }}>{m.urgency}</span>
                  </div>
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

/* ─── Slide 4: Guest Layer In Action ─────────────────────────────── */
function S4() {
  const flow = [
    { label: "Signal",        detail: "Diamond guest ETA 12 min. Assigned room still occupied." },
    { label: "Moment",        detail: "BXOS flags VIP Arrival Risk · Confidence 91% · HIGH urgency." },
    { label: "Decision",      detail: "Playbook PB-002 triggered. Housekeeping Priority Protocol initiated." },
    { label: "Communication", detail: "Targeted message routed to Housekeeping Lead + Duty Manager." },
    { label: "Action",        detail: "Room fast-tracked. Floor supervisor deployed. Lounge access pre-activated." },
    { label: "Outcome",       detail: "Room cleared 4 min before arrival. No disruption to guest experience." },
    { label: "Value",         detail: "Guest satisfaction maintained. Brand promise delivered. Loyalty protected." },
  ];

  const colors = [C.blue, C.amber, C.violet, C.cyan, C.green, C.green, C.amber];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Guest Layer" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>The Guest Layer In Action</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 580, lineHeight: 1.65 }}>
            One scenario. Every layer of WELBX engaged. Signal to outcome in under 15 minutes — invisibly to the guest, completely visible to the operation.
          </p>
        </div>

        {/* Scenario context */}
        <div style={{ display: "flex", gap: 12, padding: "12px 16px", background: `${C.amber}08`, border: `1px solid ${C.amber}22` }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.amber, textTransform: "uppercase", flexShrink: 0 }}>Scenario</div>
          <div style={{ fontSize: 10.5, color: C.muted }}>Mr V. Hartmann · Diamond Guest · 14th stay at The Grand Meridian, London. Arriving in 12 minutes. Room 847 not yet cleared.</div>
        </div>

        {/* Flow */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {flow.map((step, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ padding: "10px 10px 8px", background: `${colors[i]}0C`, border: `1px solid ${colors[i]}30`, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.16em", color: colors[i], textTransform: "uppercase", marginBottom: 7 }}>{step.label}</div>
                <p style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.5, flex: 1 }}>{step.detail}</p>
              </div>
              {i < flow.length - 1 && (
                <div style={{ textAlign: "center", color: colors[i], opacity: 0.35, fontSize: 12, padding: "2px 0", display: "none" }}>↓</div>
              )}
            </div>
          ))}
        </div>

        {/* Perspectives row */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { view: "Guest View",         desc: "Seamless arrival. Room ready. Preferences remembered. No friction.", color: C.blue },
            { view: "Operating View",     desc: "Task assigned, completed, confirmed. Timeline visible in real time.", color: C.amber },
            { view: "Infrastructure View", desc: "BXOS pattern matched. Playbook executed. Moment resolved. Learning captured.", color: C.violet },
          ].map((v, i) => (
            <div key={i} style={{ flex: 1, padding: "10px 12px", background: C.card, border: `1px solid ${v.color}22` }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: v.color, textTransform: "uppercase", marginBottom: 5 }}>{v.view}</div>
              <p style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.5 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter slide={4} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── Slide 5: Executive Command ─────────────────────────────────── */
function S5() {
  const kpis = [
    { label: "Environment Health",  value: "87",    delta: "↑ 6pts", note: "vs last 30 days", color: C.green },
    { label: "Execution Index",     value: "92%",   delta: "↑ 9pts", note: "vs last 30 days", color: C.amber },
    { label: "Active Moments",      value: "6",     delta: "↓ 4",    note: "vs last 30 days", color: C.blue },
    { label: "Outcome Success",     value: "94%",   delta: "↑ 12pts",note: "vs last 30 days", color: C.green },
    { label: "Recovery Speed",      value: "4.1m",  delta: "↓ 38%",  note: "avg resolution",  color: C.cyan },
    { label: "Value Score",         value: "Score 94", delta: "↑ 31%",note: "vs last 30 days", color: C.amber },
  ];

  const strategicRisks = [
    { level: "HIGH",   property: "Hotel du Lac, Geneva",        headline: "Welfare signal cluster detected · Floor 5",             color: C.red },
    { level: "MEDIUM", property: "The Cartwright, Edinburgh",   headline: "Front-of-house staffing gap · Thursday–Friday peak",    color: C.amber },
    { level: "MEDIUM", property: "Grand Meridian, Dubai",       headline: "Weekend surge · Mobile check-in not enabled",           color: C.amber },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Executive Command" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Executive Command</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 520, lineHeight: 1.65 }}>
            Leaders see the full operating environment in a single view — across every property, every moment, every outcome.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
          {kpis.map((kpi, i) => (
            <ExecutiveMetricCard key={i} {...kpi} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <ScreenshotCard title="Strategic Risks" subtitle="3 active patterns" flex={3}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {strategicRisks.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px", background: C.card2, border: `1px solid ${r.color}18` }}>
                  <Pill label={r.level} color={r.color} />
                  <div>
                    <div style={{ fontSize: 7.5, color: C.dimmed, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.1em" }}>{r.property}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{r.headline}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScreenshotCard>
          <ScreenshotCard title="Portfolio Coverage" subtitle="5 properties" flex={2}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { name: "Grand Meridian, London",    health: 91, color: C.green  },
                { name: "Grand Meridian, Dubai",     health: 78, color: C.amber  },
                { name: "The Cartwright, Edinburgh", health: 73, color: C.amber  },
                { name: "Hotel du Lac, Geneva",      health: 62, color: C.red    },
                { name: "Meridian Palace, Singapore",health: 88, color: C.green  },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 9, color: C.muted, flex: 1 }}>{p.name}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: p.color, width: 24, textAlign: "right" }}>{p.health}</div>
                  <div style={{ width: 60, height: 4, background: "hsl(220 13% 11%)" }}>
                    <div style={{ width: `${p.health}%`, height: "100%", background: p.color, opacity: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>
          </ScreenshotCard>
        </div>
      </div>
      <SlideFooter slide={5} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── Slide 6: Why It Matters ─────────────────────────────────────── */
function S6() {
  const impacts = [
    {
      category: "Experience Impact",
      color: C.amber,
      items: [
        "Every guest moment handled at the right time",
        "VIP protocols executed without manual instruction",
        "Service recovery completed before guests escalate",
      ],
    },
    {
      category: "Operational Impact",
      color: C.blue,
      items: [
        "Team coordination governed, not improvised",
        "Maintenance, housekeeping and F&B aligned",
        "Capacity decisions informed by live signals",
      ],
    },
    {
      category: "Workforce Impact",
      color: C.cyan,
      items: [
        "Staff welfare monitored and escalated appropriately",
        "Shift coverage gaps identified in advance",
        "Team performance visible at every level",
      ],
    },
    {
      category: "Strategic Impact",
      color: C.violet,
      items: [
        "Pattern intelligence builds with every interaction",
        "Portfolio visibility across all properties",
        "Institutional memory persists beyond individuals",
      ],
    },
    {
      category: "Value Impact",
      color: C.green,
      items: [
        "Activation exposure reduced through early intervention",
        "Consistency of delivery improves over time",
        "Every moment of value is tracked and attributable",
      ],
    },
  ];

  return (
    <PresentationSlide className="print-slide">
      <SlideHeader label="Why It Matters" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", marginBottom: 8 }}>Why It Matters</h2>
          <p style={{ fontSize: 12, color: C.muted, maxWidth: 520, lineHeight: 1.65 }}>
            WELBX improves execution during the moments that matter most — across experience, operations, workforce, strategy, and value.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flex: 1 }}>
          {impacts.map((imp, i) => (
            <ImpactCard key={i} {...imp} />
          ))}
        </div>
        <div style={{ padding: "22px 28px", background: `${C.amber}07`, border: `1px solid ${C.amber}22`, textAlign: "center" }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: C.white, letterSpacing: "0.01em", lineHeight: 1.5 }}>
            Better visibility. Better decisions. Better execution. Better outcomes.
          </p>
          <p style={{ fontSize: 10, color: C.dimmed, marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            WELBX Behavioural Infrastructure · Grand Meridian, London
          </p>
        </div>
      </div>
      <SlideFooter slide={6} total={TOTAL} />
    </PresentationSlide>
  );
}

/* ─── Presentation Shell ──────────────────────────────────────────── */
const SLIDES = [S1, S2, S3, S4, S5, S6];

export default function Presentation5Min() {
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
