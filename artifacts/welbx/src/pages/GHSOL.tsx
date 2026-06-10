import { motion } from "framer-motion";
import { Link } from "wouter";

const FRAMEWORK_STEPS = [
  {
    id: "signal",
    label: "Signal",
    def: "A measurable behavioural or environmental indicator that something is occurring or about to occur.",
  },
  {
    id: "moment",
    label: "Moment",
    def: "The point at which a signal — or cluster of signals — demands a human or institutional response.",
  },
  {
    id: "decision",
    label: "Decision",
    def: "A governed, context-aware choice about what action is appropriate and who should take it.",
  },
  {
    id: "action",
    label: "Action",
    def: "The execution of a response: deployed to the right person, at the right time, with measurable parameters.",
  },
  {
    id: "outcome",
    label: "Outcome",
    def: "The result of the action, measured against a defined threshold of intent.",
  },
  {
    id: "learning",
    label: "Learning",
    def: "The institutional intelligence gained from each cycle — improving the next signal interpretation.",
  },
];

const VERTICALS = [
  {
    label: "Travel",
    signal: "Guest behaviour deviates from expectation",
    action: "Staff deploy targeted service intervention",
    outcome: "Revenue per stay and satisfaction improve",
  },
  {
    label: "Workplace",
    signal: "Employee engagement patterns shift",
    action: "Manager receives contextual nudge",
    outcome: "Retention and productivity improve",
  },
  {
    label: "Sport",
    signal: "Athlete biometric or performance signal",
    action: "Coaching staff receive load management instruction",
    outcome: "Injury prevention, performance consistency",
  },
  {
    label: "Education",
    signal: "Student attention or comprehension signal",
    action: "Educator adjusts delivery or support",
    outcome: "Attainment and engagement improve",
  },
  {
    label: "Health",
    signal: "Patient behavioural or physiological signal",
    action: "Clinical team receives prioritised action",
    outcome: "Earlier intervention, improved care pathway",
  },
  {
    label: "Government",
    signal: "Citizen interaction or service signal",
    action: "Case worker or system triggers appropriate response",
    outcome: "Faster resolution, better public outcomes",
  },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: "easeOut" as const },
});

export default function GHSOL() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 60,
      background: "hsl(220 13% 4%)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
        style={{
          padding: "22px 60px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid hsl(220 13% 8%)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", color: "#fff", textTransform: "uppercase", cursor: "pointer" }}>
              WELBX
            </div>
          </Link>
          <div style={{ width: 1, height: 14, background: "hsl(220 13% 12%)" }} />
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase" }}>
            GHSOL
          </div>
        </div>
        <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "hsl(215 16% 22%)", textTransform: "uppercase", fontWeight: 600 }}>
          Global Human Signal Operating Layer
        </div>
      </motion.header>

      {/* Main — scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 60px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", paddingTop: 64, paddingBottom: 88 }}>

          {/* Title block */}
          <motion.div {...fadeUp(0.06)} style={{
            fontSize: 8.5, fontWeight: 700, letterSpacing: "0.28em",
            color: "#c9a84c", textTransform: "uppercase", marginBottom: 22,
          }}>
            The Universal Behavioural Framework
          </motion.div>

          <motion.h1 {...fadeUp(0.12)} style={{
            fontSize: "clamp(28px, 3.6vw, 46px)", fontWeight: 800,
            color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1,
            margin: 0, marginBottom: 20,
          }}>
            Global Human Signal<br />Operating Layer
          </motion.h1>

          <motion.p {...fadeUp(0.2)} style={{
            fontSize: "clamp(13px, 1.3vw, 16px)", fontWeight: 400,
            color: "hsl(215 16% 48%)", lineHeight: 1.6,
            margin: 0, marginBottom: 60, maxWidth: 580,
          }}>
            GHSOL is the operating framework that powers every WELBX deployment. One causal loop. Six steps. Applicable across every human institution on earth.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 1, background: "hsl(220 13% 9%)", marginBottom: 60 }}
          />

          {/* ── Framework diagram ── */}
          <motion.div {...fadeUp(0.3)} style={{ marginBottom: 72 }}>
            <div style={{
              fontSize: 8.5, fontWeight: 700, letterSpacing: "0.24em",
              color: "#c9a84c", textTransform: "uppercase", marginBottom: 36,
            }}>
              The Framework
            </div>

            {/* Horizontal step rail */}
            <div style={{ position: "relative" }}>
              {/* Connecting line behind steps */}
              <div style={{
                position: "absolute", top: 22, left: 22, right: 22, height: 1,
                background: "linear-gradient(to right, #c9a84c55, #c9a84c22, #c9a84c55)",
              }} />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2, position: "relative" }}>
                {FRAMEWORK_STEPS.map((step, i) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36 + i * 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Node */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
                      <div style={{
                        width: 44, height: 44,
                        border: "1px solid #c9a84c",
                        background: "hsl(220 13% 4%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative", zIndex: 1,
                      }}>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#c9a84c" }}>
                          0{i + 1}
                        </span>
                      </div>
                      {i < 5 && (
                        <div style={{
                          position: "absolute",
                          top: 22, right: -1, width: "calc(100% - 44px)",
                          height: 1, background: "transparent",
                          zIndex: 0,
                        }} />
                      )}
                    </div>

                    {/* Label */}
                    <div style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                      color: "#fff", textTransform: "uppercase", marginBottom: 10,
                      paddingLeft: 2,
                    }}>
                      {step.label}
                    </div>

                    {/* Definition */}
                    <div style={{
                      fontSize: 11, color: "hsl(215 16% 36%)", lineHeight: 1.65,
                      paddingLeft: 2,
                    }}>
                      {step.def}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Loop statement */}
          <motion.div {...fadeUp(0.82)} style={{
            padding: "28px 32px",
            border: "1px solid hsl(220 13% 10%)",
            borderLeft: "2px solid #c9a84c",
            background: "hsl(220 13% 6%)",
            marginBottom: 72,
          }}>
            <div style={{
              fontSize: 8, fontWeight: 700, letterSpacing: "0.22em",
              color: "#c9a84c", textTransform: "uppercase", marginBottom: 12,
            }}>
              The Loop
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {["Signal", "Moment", "Decision", "Action", "Outcome", "Learning"].map((s, i, arr) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#fff", textTransform: "uppercase" }}>{s}</span>
                  {i < arr.length - 1 && (
                    <span style={{ fontSize: 10, color: "#c9a84c", opacity: 0.6 }}>→</span>
                  )}
                </span>
              ))}
              <span style={{ fontSize: 10, color: "#c9a84c", opacity: 0.6 }}>↺</span>
            </div>
          </motion.div>

          {/* ── Applications ── */}
          <motion.div {...fadeUp(0.88)}>
            <div style={{
              fontSize: 8.5, fontWeight: 700, letterSpacing: "0.24em",
              color: "#c9a84c", textTransform: "uppercase", marginBottom: 12,
            }}>
              Applications
            </div>
            <p style={{
              fontSize: 13, color: "hsl(215 16% 40%)", lineHeight: 1.7,
              margin: 0, marginBottom: 36, maxWidth: 560,
            }}>
              The same six-step loop operates identically across every human institution. The inputs change. The framework does not.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
              {VERTICALS.map((v, i) => (
                <motion.div
                  key={v.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.94 + i * 0.07, duration: 0.4 }}
                  style={{
                    padding: "24px 24px 26px",
                    background: "hsl(220 13% 6%)",
                    border: "1px solid hsl(220 13% 9%)",
                    borderTop: "1px solid #c9a84c33",
                    display: "flex", flexDirection: "column", gap: 14,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#fff", textTransform: "uppercase" }}>
                    {v.label}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#c9a84c", textTransform: "uppercase", flexShrink: 0, marginTop: 1.5 }}>Signal</span>
                      <span style={{ fontSize: 11, color: "hsl(215 16% 38%)", lineHeight: 1.55 }}>{v.signal}</span>
                    </div>
                    <div style={{ height: 1, background: "hsl(220 13% 10%)" }} />
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 32%)", textTransform: "uppercase", flexShrink: 0, marginTop: 1.5 }}>Action</span>
                      <span style={{ fontSize: 11, color: "hsl(215 16% 38%)", lineHeight: 1.55 }}>{v.action}</span>
                    </div>
                    <div style={{ height: 1, background: "hsl(220 13% 10%)" }} />
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "hsl(215 16% 32%)", textTransform: "uppercase", flexShrink: 0, marginTop: 1.5 }}>Value</span>
                      <span style={{ fontSize: 11, color: "hsl(215 16% 38%)", lineHeight: 1.55 }}>{v.outcome}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            style={{ marginTop: 64, display: "flex", alignItems: "center", gap: 14 }}
          >
            <Link href="/command-centre">
              <button
                style={{
                  padding: "14px 34px",
                  background: "#c9a84c", color: "hsl(220 13% 5%)",
                  fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 10,
                  border: "none", cursor: "pointer", transition: "opacity 0.18s",
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = "0.82")}
                onMouseOut={e => (e.currentTarget.style.opacity = "1")}
              >
                Enter the Operating Layer →
              </button>
            </Link>
            <Link href="/">
              <button
                style={{
                  padding: "13px 28px",
                  background: "transparent", color: "hsl(215 16% 44%)",
                  fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 10,
                  border: "1px solid hsl(220 13% 14%)", cursor: "pointer", transition: "all 0.18s",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                  e.currentTarget.style.color = "#c9a84c";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = "hsl(220 13% 14%)";
                  e.currentTarget.style.color = "hsl(215 16% 44%)";
                }}
              >
                ← Why WELBX Exists
              </button>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.4 }}
        style={{
          padding: "14px 60px",
          borderTop: "1px solid hsl(220 13% 8%)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 18%)" }}>
          GHSOL · Global Human Signal Operating Layer · Universal Framework
        </div>
        <div style={{ fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
          WELBX · Confidential
        </div>
      </motion.footer>

    </div>
  );
}
