import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INTERVENTION_LIBRARY, type Category, type FreqLabel, type Intervention, type LibraryMoment } from "@/data/interventions";

const C = {
  amber:  "#c9a84c",
  blue:   "#3b82f6",
  green:  "#10b981",
  red:    "#ef4444",
  violet: "#a78bfa",
  slate:  "hsl(215 16% 44%)",
  border: "hsl(220 13% 9%)",
  card:   "hsl(220 13% 7%)",
  bg:     "hsl(220 13% 5%)",
  muted:  "hsl(215 16% 36%)",
  dimmed: "hsl(215 16% 22%)",
  dim2:   "hsl(215 16% 32%)",
};

const CAT_COLOR: Record<Category, string> = {
  Guest:       C.amber,
  Workforce:   C.blue,
  Operational: C.slate,
  Commercial:  C.green,
  Strategic:   C.violet,
};

const FREQ_COLOR: Record<FreqLabel, string> = {
  Low:    C.slate,
  Medium: C.amber,
  High:   C.green,
};

const ALL_CATEGORIES: Category[] = ["Guest", "Workforce", "Operational", "Commercial", "Strategic"];

function OutcomeTag({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
      color: C.amber, border: `1px solid ${C.amber}33`, padding: "2px 8px",
      background: `${C.amber}0d`, flexShrink: 0,
    }}>{label}</span>
  );
}

function MetricPill({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "8px 14px",
      background: "hsl(220 13% 6%)",
      border: `1px solid hsl(220 13% 11%)`,
      minWidth: 80,
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color, letterSpacing: "-0.01em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginTop: 5, textAlign: "center" }}>
        {label}
      </div>
    </div>
  );
}

function InterventionRow({ intervention, index }: { intervention: Intervention; index: number }) {
  const freqColor = FREQ_COLOR[intervention.usageFrequency];
  const qualColor = intervention.outcomeQuality >= 8.5 ? C.green
    : intervention.outcomeQuality >= 7.0 ? C.amber
    : C.slate;

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "12px 20px",
        borderBottom: "1px solid hsl(220 13% 8%)",
        background: index % 2 === 0 ? "hsl(220 13% 5%)" : "hsl(220 13% 6%)",
      }}
    >
      <div style={{
        fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed,
        minWidth: 18, flexShrink: 0,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>
        {intervention.name}
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <MetricPill label="Success Rate" value={`${intervention.successRate}%`} color={intervention.successRate >= 85 ? C.green : intervention.successRate >= 72 ? C.amber : C.slate} />
        <MetricPill label="Usage Freq" value={intervention.usageFrequency} color={freqColor} />
        <MetricPill label="Outcome Quality" value={intervention.outcomeQuality.toFixed(1)} color={qualColor} />
      </div>
    </motion.div>
  );
}

function MomentAccordion({ moment, catColor, globalIndex }: { moment: LibraryMoment; catColor: string; globalIndex: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: globalIndex * 0.05, duration: 0.3 }}
      style={{
        border: `1px solid hsl(220 13% 9%)`,
        borderLeft: `2px solid ${catColor}`,
        marginBottom: 2,
        overflow: "hidden",
      }}
    >
      {/* Accordion header */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px 14px 18px",
          background: open ? "hsl(220 13% 8%)" : "hsl(220 13% 7%)",
          border: "none", cursor: "pointer",
          transition: "background 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, minWidth: 44, textTransform: "uppercase", fontFamily: "var(--app-font-mono)" }}>
            {moment.id}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
            {moment.name}
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {moment.expectedOutcomes.map((o) => (
              <OutcomeTag key={o} label={o} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color: C.dim2, textTransform: "uppercase" }}>
            {moment.interventions.length} interventions
          </span>
          <div style={{
            width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid hsl(220 13% 12%)`,
            background: "hsl(220 13% 9%)",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 2.5L4 5.5L7 2.5" stroke={C.amber} strokeWidth="1.5" strokeLinecap="square"/>
            </svg>
          </div>
        </div>
      </button>

      {/* Accordion body */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ borderTop: `1px solid hsl(220 13% 9%)` }}>
              {/* Column headers */}
              <div style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "7px 20px 7px 18px",
                background: "hsl(220 13% 6%)",
                borderBottom: "1px solid hsl(220 13% 9%)",
              }}>
                <div style={{ minWidth: 18 }} />
                <div style={{ flex: 1, fontSize: 7, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>
                  Intervention Option
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {["Success Rate", "Usage Frequency", "Outcome Quality"].map((h) => (
                    <div key={h} style={{ minWidth: 80, fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", textAlign: "center" }}>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
              {moment.interventions.map((iv, i) => (
                <InterventionRow key={iv.name} intervention={iv} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function InterventionLibrary() {
  const [activeCategory, setActiveCategory] = useState<Category>("Guest");
  const catData = INTERVENTION_LIBRARY.find((d) => d.category === activeCategory)!;
  const catColor = CAT_COLOR[activeCategory];

  let globalIndex = 0;

  return (
    <div className="pl-56 min-h-screen" style={{ background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}
        >
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase", marginBottom: 10 }}>
              WELBX · Operating Layer
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 6 }}>
              Intervention Library
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, letterSpacing: "0.04em" }}>
              Behavioural response catalogue — what to do, how to do it, and why it works
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.dimmed, textTransform: "uppercase", marginBottom: 4 }}>
              {INTERVENTION_LIBRARY.reduce((a, d) => a + d.moments.reduce((b, m) => b + m.interventions.length, 0), 0)} interventions
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 18%)", textTransform: "uppercase" }}>
              {INTERVENTION_LIBRARY.reduce((a, d) => a + d.moments.length, 0)} moments · 5 domains
            </div>
          </div>
        </motion.div>

        {/* Summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.38 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, marginBottom: 28 }}
        >
          {INTERVENTION_LIBRARY.map((d) => {
            const cc = CAT_COLOR[d.category];
            const totalIvs = d.moments.reduce((a, m) => a + m.interventions.length, 0);
            const avgSuccess = Math.round(
              d.moments.flatMap((m) => m.interventions).reduce((a, iv) => a + iv.successRate, 0) / totalIvs
            );
            return (
              <div
                key={d.category}
                onClick={() => setActiveCategory(d.category)}
                style={{
                  padding: "16px 20px",
                  background: activeCategory === d.category ? "hsl(220 13% 9%)" : C.card,
                  borderTop: `2px solid ${cc}`,
                  border: `1px solid ${activeCategory === d.category ? cc + "44" : C.border}`,
                  borderTopColor: cc,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 5 }}>
                  {avgSuccess}%
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "hsl(215 16% 48%)", marginBottom: 3 }}>
                  {d.category}
                </div>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: cc, textTransform: "uppercase" }}>
                  Avg success · {d.moments.length} moments
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.35 }}
          style={{ display: "flex", gap: 1, marginBottom: 0 }}
        >
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const color = CAT_COLOR[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "10px 20px",
                  background: isActive ? "hsl(220 13% 9%)" : "transparent",
                  border: `1px solid ${isActive ? color + "44" : "hsl(220 13% 10%)"}`,
                  borderBottom: isActive ? `1px solid hsl(220 13% 9%)` : `1px solid hsl(220 13% 10%)`,
                  borderTop: isActive ? `2px solid ${color}` : "2px solid transparent",
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: isActive ? "#fff" : "hsl(215 16% 36%)" }}>
                  {cat}
                </span>
                <span style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                  color: isActive ? color : C.dimmed,
                  border: `1px solid ${isActive ? color + "33" : "transparent"}`,
                  padding: "1px 5px",
                  background: isActive ? `${color}0d` : "transparent",
                }}>
                  {INTERVENTION_LIBRARY.find((d) => d.category === cat)!.moments.length}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Accordion list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              border: `1px solid hsl(220 13% 9%)`,
              borderTop: `2px solid ${catColor}`,
              background: "hsl(220 13% 7%)",
              padding: "16px 16px",
            }}
          >
            {/* Section label */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
              paddingBottom: 12, borderBottom: `1px solid hsl(220 13% 9%)`,
            }}>
              <div style={{ width: 3, height: 18, background: catColor, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: catColor, textTransform: "uppercase" }}>
                  {activeCategory} Domain
                </div>
                <div style={{ fontSize: 8.5, color: C.dim2, marginTop: 2 }}>
                  {catData.moments.length} moment categories · Expand to view intervention options
                </div>
              </div>
            </div>

            {catData.moments.map((moment) => {
              const idx = globalIndex++;
              return (
                <MomentAccordion
                  key={moment.id}
                  moment={moment}
                  catColor={catColor}
                  globalIndex={idx}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Legend / key */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            marginTop: 20, padding: "14px 20px",
            border: `1px solid ${C.border}`,
            background: C.card,
            display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap",
          }}
        >
          {[
            { color: C.green, label: "Success Rate ≥ 85% · High confidence" },
            { color: C.amber, label: "Success Rate 72–84% · Strong confidence" },
            { color: C.slate, label: "Success Rate < 72% · Situational" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 20, height: 3, background: color }} />
              <span style={{ fontSize: 8.5, color: C.dimmed }}>{label}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
            Outcome Quality scored 0–10 · Usage Frequency: observed operational pattern
          </div>
        </motion.div>

        {/* Engine footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.4 }}
          style={{
            marginTop: 16, paddingTop: 16,
            borderTop: `1px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { name: "BXOS", desc: "Moment classification · Intervention scoring · Outcome attribution" },
              { name: "NEXUS", desc: "Response routing · Escalation governance · Owner assignment" },
              { name: "VECTOR", desc: "Execution tracking · Success measurement · Library learning" },
            ].map(e => (
              <div key={e.name} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: C.dimmed, textTransform: "uppercase" }}>{e.name}</span>
                <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.04em" }}>· {e.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "hsl(215 16% 14%)", textTransform: "uppercase" }}>
            Response Catalogue · v1.0
          </div>
        </motion.div>

      </div>
    </div>
  );
}
