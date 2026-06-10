import { useState } from "react";
import { motion } from "framer-motion";
import { SIGNAL_CATEGORIES, SIGNAL_SUMMARY } from "@/data/signals";
import type { SignalStatus, SignalWeight } from "@/data/signals";

const ACCENT = "#c9a84c";

const SUMMARY = [
  { label: "Total Signals", value: String(SIGNAL_SUMMARY.total), delta: "+12 this week", color: "#fff" },
  { label: "New Signals", value: String(SIGNAL_SUMMARY.new24h), delta: "Last 24 hours", color: ACCENT },
  { label: "Critical Signals", value: String(SIGNAL_SUMMARY.critical), delta: "Require attention", color: "#ef4444" },
  { label: "Emerging Signals", value: String(SIGNAL_SUMMARY.emerging), delta: "Pattern forming", color: "#f59e0b" },
  { label: "Signal Confidence", value: `${SIGNAL_SUMMARY.confidenceAvg}%`, delta: "Avg across registry", color: "#10b981" },
];

type Status = SignalStatus;
type Weight = SignalWeight;

const CATEGORIES = SIGNAL_CATEGORIES;

const STATUS_COLOR: Record<Status, string> = {
  ACTIVE: "#10b981",
  MONITORING: ACCENT,
  EMERGING: "#f59e0b",
  ALERT: "#ef4444",
};

const WEIGHT_COLOR: Record<Weight, string> = {
  Critical: "#ef4444",
  High: ACCENT,
  Medium: "hsl(215 16% 46%)",
  Low: "hsl(215 16% 30%)",
};

export default function SignalRegistry() {
  const [activeCategory, setActiveCategory] = useState("guest");

  const active = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="mb-10"
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.26em", color: ACCENT, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · Sensing Layer
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 10 }}>
            Signal Registry
          </h1>
          <p style={{ fontSize: 12, color: "hsl(215 16% 44%)", lineHeight: 1.75, maxWidth: 620, margin: 0 }}>
            Every behavioural, operational, and commercial signal catalogued, weighted, and mapped to the moments they activate. The sensing layer of every WELBX deployment.
          </p>
        </motion.header>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 36 }}>
          {SUMMARY.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 + i * 0.06, duration: 0.38 }}
              style={{
                padding: "18px 20px 20px",
                background: "hsl(220 13% 6%)",
                border: "1px solid hsl(220 13% 10%)",
                borderTop: `2px solid ${s.color === "#fff" ? "hsl(220 13% 16%)" : s.color}`,
                display: "flex", flexDirection: "column", gap: 6,
              }}
            >
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>
                {s.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 9.5, color: "hsl(215 16% 36%)", letterSpacing: "0.02em" }}>
                {s.delta}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ display: "flex", gap: 1, marginBottom: 1 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: isActive ? "hsl(220 13% 8%)" : "hsl(220 13% 5%)",
                  border: "1px solid hsl(220 13% 10%)",
                  borderBottom: isActive ? "1px solid hsl(220 13% 8%)" : "1px solid hsl(220 13% 10%)",
                  borderTop: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                  color: isActive ? "#fff" : "hsl(215 16% 38%)",
                  textTransform: "uppercase", marginBottom: 3,
                }}>
                  {cat.label}
                </div>
                <div style={{ fontSize: 9, color: isActive ? ACCENT : "hsl(215 16% 28%)", fontWeight: 600 }}>
                  {cat.count} signals
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Signal table */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}
          style={{ background: "hsl(220 13% 6%)", border: "1px solid hsl(220 13% 10%)" }}
        >
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 0.9fr 1fr 0.8fr 0.7fr 0.7fr 1.4fr 0.8fr",
            padding: "10px 20px",
            borderBottom: "1px solid hsl(220 13% 10%)",
            gap: 12,
          }}>
            {["Signal Name", "Type", "Source", "Frequency", "Confidence", "Weighting", "Related Moments", "Status"].map((h) => (
              <div key={h} style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 28%)", textTransform: "uppercase" }}>
                {h}
              </div>
            ))}
          </div>

          {active.signals.map((sig, i) => (
            <motion.div
              key={sig.name}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 0.9fr 1fr 0.8fr 0.7fr 0.7fr 1.4fr 0.8fr",
                padding: "16px 20px",
                borderBottom: i < active.signals.length - 1 ? "1px solid hsl(220 13% 9%)" : "none",
                gap: 12,
                alignItems: "center",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "hsl(220 13% 7%)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Signal Name */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>
                {sig.name}
              </div>

              {/* Type */}
              <div style={{ fontSize: 10, color: "hsl(215 16% 46%)" }}>
                {sig.type}
              </div>

              {/* Source */}
              <div style={{ fontSize: 10, color: "hsl(215 16% 38%)" }}>
                {sig.source}
              </div>

              {/* Frequency */}
              <div style={{ fontSize: 10, color: "hsl(215 16% 42%)" }}>
                {sig.frequency}
              </div>

              {/* Confidence bar */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  {sig.confidence}%
                </div>
                <div style={{ height: 2, background: "hsl(220 13% 12%)", width: "100%" }}>
                  <div style={{
                    height: "100%",
                    width: `${sig.confidence}%`,
                    background: sig.confidence >= 90 ? "#10b981" : sig.confidence >= 75 ? ACCENT : "#f59e0b",
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>

              {/* Weighting */}
              <div style={{
                fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em",
                color: WEIGHT_COLOR[sig.weighting], textTransform: "uppercase",
              }}>
                {sig.weighting}
              </div>

              {/* Moments */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {sig.moments.map((m) => (
                  <div key={m} style={{
                    fontSize: 9, color: "hsl(215 16% 42%)",
                    background: "hsl(220 13% 9%)",
                    padding: "2px 6px", lineHeight: 1.4,
                  }}>
                    {m}
                  </div>
                ))}
              </div>

              {/* Status */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLOR[sig.status], flexShrink: 0 }} />
                <span style={{
                  fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em",
                  color: STATUS_COLOR[sig.status], textTransform: "uppercase",
                }}>
                  {sig.status}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <div style={{ marginTop: 20, fontSize: 10, color: "hsl(215 16% 24%)", letterSpacing: "0.04em", lineHeight: 1.7 }}>
          Showing {active.signals.length} of {active.count} signals in {active.label}. Signals are continuously updated based on live data streams.
        </div>

      </div>
    </div>
  );
}
