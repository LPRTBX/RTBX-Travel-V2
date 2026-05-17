import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const STAGES = [
  { label: "SIGNALS",     engine: "BXOS" },
  { label: "CONVERGENCE", engine: "BXOS" },
  { label: "DECISION",    engine: "BXOS" },
  { label: "PATHWAY",     engine: "NEXUS" },
  { label: "EXECUTION",   engine: "VECTOR" },
  { label: "OUTCOME",     engine: "" },
];

function FlowDiagram() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulse(p => (p + 1) % 7), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {STAGES.map((s, i) => {
        const isActive = pulse === i;
        const isPassed = pulse > i;
        return (
          <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 + 0.6, duration: 0.35 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
            >
              <div style={{
                padding: "10px 16px",
                minWidth: 96, textAlign: "center",
                border: `1px solid ${isActive ? "rgba(201,168,76,0.4)" : isPassed ? "hsl(220 13% 13%)" : "hsl(220 13% 12%)"}`,
                background: isActive ? "rgba(201,168,76,0.06)" : "hsl(220 13% 8%)",
                transition: "all 0.4s",
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: isActive ? "#c9a84c" : isPassed ? "hsl(215 16% 42%)" : "hsl(215 16% 32%)", textTransform: "uppercase", marginBottom: s.engine ? 3 : 0 }}>
                  {s.label}
                </div>
                {s.engine && (
                  <div style={{ fontSize: 7.5, letterSpacing: "0.12em", color: isActive ? "rgba(201,168,76,0.6)" : "hsl(215 16% 22%)", textTransform: "uppercase", fontWeight: 600 }}>
                    {s.engine}
                  </div>
                )}
              </div>
              <div style={{ width: 3, height: 3, borderRadius: "50%", background: isActive ? "#c9a84c" : "transparent", transition: "all 0.3s" }} />
            </motion.div>
            {i < STAGES.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.12 + 0.9, duration: 0.4 }}
                style={{ width: 28, height: 1, transformOrigin: "left", position: "relative", flexShrink: 0 }}
              >
                <div style={{ height: "100%", background: pulse > i ? "hsl(220 13% 20%)" : "hsl(220 13% 13%)", transition: "background 0.4s" }} />
                <div style={{ position: "absolute", right: -3, top: -4, fontSize: 8, color: "hsl(220 13% 22%)" }}>›</div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Landing() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 60,
      background: "hsl(220 13% 4%)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Subtle scan line */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)", pointerEvents: "none", zIndex: 0 }} />

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        style={{ position: "relative", zIndex: 1, padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid hsl(220 13% 8%)" }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.3em", color: "#fff", textTransform: "uppercase" }}>WELBX</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} className="animate-pulse" />
          <span style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "hsl(215 16% 30%)", textTransform: "uppercase", fontWeight: 600 }}>SYSTEM ACTIVE · THE GRAND MERIDIAN, LONDON</span>
        </div>
      </motion.div>

      {/* Main */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 48px", gap: 0 }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          style={{ fontSize: 8.5, letterSpacing: "0.22em", color: "hsl(215 16% 28%)", textTransform: "uppercase", fontWeight: 600, marginBottom: 28, textAlign: "center" }}
        >
          TRAVEL OPERATING LAYER · LIVE DEPLOYMENT
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
          style={{ fontSize: 44, fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: "-0.025em", lineHeight: 1.12, maxWidth: 660, marginBottom: 22 }}
        >
          This is how the Travel Operating Layer works in real time.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.45 }}
          style={{ fontSize: 15, color: "hsl(215 16% 40%)", textAlign: "center", maxWidth: 500, lineHeight: 1.7, marginBottom: 32 }}
        >
          WELBX converts multi-source operational signals into governed system states that trigger the right action in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.4 }}
          style={{ marginBottom: 40, textAlign: "center" }}
        >
          <div style={{
            display: "inline-block",
            padding: "10px 28px",
            border: "1px solid rgba(201,168,76,0.2)",
            background: "rgba(201,168,76,0.04)",
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
              color: "#c9a84c", fontStyle: "italic",
            }}>
              This is not a dashboard. This is the system that decides what happens next.
            </span>
          </div>
        </motion.div>

        {/* Flow diagram */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.4 }}>
          <FlowDiagram />
        </motion.div>

        {/* Scenario preview */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.4 }}
          style={{ display: "flex", gap: 10, marginTop: 40, marginBottom: 44 }}
        >
          {[
            { label: "Operations", sub: "Foyer Congestion", color: "#c9a84c" },
            { label: "Guest", sub: "Distress Signal", color: "#ef4444" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "10px 20px", border: `1px solid ${s.color}20`, background: `${s.color}06`, textAlign: "center" }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: s.color, marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "hsl(215 16% 40%)" }}>{s.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.4 }}>
          <Link href="/demo">
            <button style={{
              padding: "14px 42px",
              background: "#c9a84c", color: "hsl(220 13% 5%)",
              fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 10.5,
              border: "none", cursor: "pointer",
              transition: "opacity 0.15s",
            }}
              onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseOut={e => (e.currentTarget.style.opacity = "1")}
            >
              Start Live Scenario →
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.4 }}
        style={{ position: "relative", zIndex: 1, padding: "20px 48px", borderTop: "1px solid hsl(220 13% 8%)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div style={{ display: "flex", gap: 24 }}>
          {[{ n: "BXOS", d: "Intelligence" }, { n: "NEXUS", d: "Routing" }, { n: "VECTOR", d: "Execution" }].map(e => (
            <div key={e.n} style={{ display: "flex", items: "center", gap: 5 }}>
              <span style={{ fontSize: 8, letterSpacing: "0.14em", color: "hsl(215 16% 22%)", textTransform: "uppercase", fontWeight: 700 }}>{e.n}</span>
              <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.06em", marginLeft: 4 }}>· {e.d}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>WELBX · Confidential Demo</div>
      </motion.div>
    </div>
  );
}
