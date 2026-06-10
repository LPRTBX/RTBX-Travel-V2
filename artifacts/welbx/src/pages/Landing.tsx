import { motion } from "framer-motion";
import { Link } from "wouter";

const FLOW_STEPS = [
  { label: "Signals", desc: "Behavioural data surfaces from environment and people" },
  { label: "Moments", desc: "Patterns condense into a moment of consequence" },
  { label: "Visibility", desc: "The right person sees what matters, when it matters" },
  { label: "Decisions", desc: "Governed response is triggered at the point of relevance" },
  { label: "Actions", desc: "Execution is deployed with consistency and attribution" },
  { label: "Outcomes", desc: "Results are measured against defined thresholds" },
  { label: "Value", desc: "Compounding improvement across every interaction" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: "easeOut" as const },
});

export default function Landing() {
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
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", color: "#fff", textTransform: "uppercase" }}>
          WELBX
        </div>
        <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "hsl(215 16% 22%)", textTransform: "uppercase", fontWeight: 600 }}>
          Behavioural Infrastructure
        </div>
      </motion.header>

      {/* Main — scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 60px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", paddingTop: 72, paddingBottom: 80 }}>

          {/* Section label */}
          <motion.div {...fadeUp(0.06)} style={{
            fontSize: 8.5, fontWeight: 700, letterSpacing: "0.28em",
            color: "#c9a84c", textTransform: "uppercase", marginBottom: 28,
          }}>
            WHY WELBX EXISTS
          </motion.div>

          {/* Hero headline */}
          <motion.h1 {...fadeUp(0.14)} style={{
            fontSize: "clamp(32px, 4.2vw, 54px)", fontWeight: 800,
            color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1,
            margin: 0, marginBottom: 28,
          }}>
            Hotels Have Solved Information.
            <br />
            They Have Not Solved Execution.
          </motion.h1>

          {/* Subheading */}
          <motion.p {...fadeUp(0.22)} style={{
            fontSize: "clamp(14px, 1.4vw, 17px)", fontWeight: 400,
            color: "hsl(215 16% 52%)", letterSpacing: "-0.01em", lineHeight: 1.5,
            margin: 0, marginBottom: 64, maxWidth: 600,
          }}>
            WELBX is the Behavioural Infrastructure layer between signal and action.
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.28, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 1, background: "hsl(220 13% 9%)", marginBottom: 64 }}
          />

          {/* Two-column layout: flow + execution gap */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

            {/* Left — vertical flow */}
            <motion.div {...fadeUp(0.34)}>
              <div style={{
                fontSize: 8.5, fontWeight: 700, letterSpacing: "0.24em",
                color: "#c9a84c", textTransform: "uppercase", marginBottom: 32,
              }}>
                The Causal Chain
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {FLOW_STEPS.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.38 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "flex", gap: 20, alignItems: "flex-start" }}
                  >
                    {/* Connector column */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 16 }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: i === 0 ? "#c9a84c" : i === 6 ? "#c9a84c" : "hsl(220 13% 18%)",
                        border: i === 0 || i === 6 ? "none" : "1px solid #c9a84c",
                        marginTop: 3, flexShrink: 0,
                      }} />
                      {i < FLOW_STEPS.length - 1 && (
                        <div style={{ width: 1, flex: 1, minHeight: 28, background: "linear-gradient(to bottom, #c9a84c44, #c9a84c22)", marginTop: 2 }} />
                      )}
                    </div>

                    {/* Label + desc */}
                    <div style={{ paddingBottom: i < FLOW_STEPS.length - 1 ? 20 : 0 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                        color: "#fff", textTransform: "uppercase", marginBottom: 3,
                      }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: 11.5, color: "hsl(215 16% 38%)", lineHeight: 1.6 }}>
                        {step.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — Execution Gap */}
            <motion.div {...fadeUp(0.42)}>
              <div style={{
                fontSize: 8.5, fontWeight: 700, letterSpacing: "0.24em",
                color: "#c9a84c", textTransform: "uppercase", marginBottom: 32,
              }}>
                THE EXECUTION GAP
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  "Most organisations collect information.",
                  "Most organisations employ people to act.",
                  "Very few improve what happens in between.",
                ].map((sentence, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    style={{
                      padding: "22px 0",
                      borderBottom: i < 2 ? "1px solid hsl(220 13% 9%)" : "none",
                    }}
                  >
                    <p style={{
                      margin: 0,
                      fontSize: i === 2 ? "clamp(15px, 1.5vw, 19px)" : "clamp(13px, 1.2vw, 15px)",
                      fontWeight: i === 2 ? 600 : 400,
                      color: i === 2 ? "#fff" : "hsl(215 16% 46%)",
                      letterSpacing: i === 2 ? "-0.02em" : "0",
                      lineHeight: 1.45,
                    }}>
                      {sentence}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Spacer */}
              <div style={{ marginTop: 48 }} />

              {/* What WELBX does */}
              <motion.div {...fadeUp(0.8)} style={{
                padding: "28px 28px",
                border: "1px solid hsl(220 13% 10%)",
                borderLeft: "2px solid #c9a84c",
                background: "hsl(220 13% 6%)",
              }}>
                <div style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.22em",
                  color: "#c9a84c", textTransform: "uppercase", marginBottom: 14,
                }}>
                  What WELBX Does
                </div>
                <p style={{
                  margin: 0, fontSize: 13, color: "hsl(215 16% 52%)",
                  lineHeight: 1.75, letterSpacing: "0.01em",
                }}>
                  WELBX occupies the space between knowing and doing. It turns operational signals into governed actions — consistently, at scale, without loss of institutional intelligence.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            style={{ marginTop: 72, display: "flex", alignItems: "center", gap: 14 }}
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
            <Link href="/ghsol">
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
                The Framework →
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
          WELBX · Behavioural Infrastructure · Operating Framework
        </div>
        <div style={{ fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
          WELBX · Confidential
        </div>
      </motion.footer>

    </div>
  );
}
