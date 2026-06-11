import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, BookOpen, Printer, ArrowRight } from "lucide-react";

const C = {
  bg:     "hsl(220 13% 5%)",
  card:   "hsl(220 13% 8%)",
  border: "hsl(220 13% 11%)",
  amber:  "#c9a84c",
  white:  "#ffffff",
  muted:  "hsl(215 16% 52%)",
  dimmed: "hsl(215 16% 28%)",
  green:  "#10b981",
};

const FORMATS = [
  {
    path: "/presentation-mode/5-minute",
    icon: Clock,
    label: "5-Minute Presentation",
    slides: "6 slides",
    format: "Executive summary format",
    outline: ["Why WELBX Exists", "The Execution Gap", "Signals Become Moments", "Guest Layer In Action", "Executive Command", "Why It Matters"],
    accent: C.amber,
  },
  {
    path: "/presentation-mode/15-minute",
    icon: BookOpen,
    label: "15-Minute Presentation",
    slides: "12 slides",
    format: "Full platform walkthrough",
    outline: ["Why WELBX Exists", "GHSOL Framework", "Signal Registry", "Moment Registry", "Strategic Visibility", "Decision Registry", "Execution Index", "Communications", "Guest Layer Scenario", "Outcome & Value", "Executive Command", "Future Vision"],
    accent: C.green,
  },
];

export default function PresentationMode() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", padding: "60px 72px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.amber} 0%, transparent 50%)` }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.24em", color: C.white, textTransform: "uppercase" }}>WELBX</span>
          <span style={{ color: C.dimmed }}>·</span>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: C.amber, textTransform: "uppercase" }}>PRESENTATION MODE</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: C.white, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 14 }}>
          Behavioural Infrastructure<br />
          <span style={{ color: C.amber }}>Executive Briefing</span>
        </h1>
        <p style={{ fontSize: 13, color: C.muted, maxWidth: 460, lineHeight: 1.75 }}>
          Presentation-ready views extracted from the live WELBX operating environment. Select a format to begin.
        </p>
      </motion.div>

      {/* Format cards */}
      <div style={{ display: "flex", gap: 24, maxWidth: 900, marginBottom: 48 }}>
        {FORMATS.map((fmt, fi) => (
          <motion.div
            key={fmt.path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + fi * 0.08 }}
            style={{ flex: 1 }}
          >
            <Link href={fmt.path}>
              <div
                style={{ padding: 28, background: C.card, border: `1px solid ${C.border}`, cursor: "pointer", transition: "border-color 0.15s", height: "100%" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${fmt.accent}44`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <fmt.icon size={13} color={fmt.accent} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: fmt.accent, textTransform: "uppercase" }}>{fmt.label}</span>
                </div>
                <div style={{ fontSize: 9, color: C.dimmed, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                  {fmt.slides} · {fmt.format}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {fmt.outline.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: C.dimmed, minWidth: 14 }}>{i + 1}</span>
                      <span style={{ fontSize: 9.5, color: C.muted }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 20, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: fmt.accent, textTransform: "uppercase" }}>Open Presentation</span>
                  <ArrowRight size={10} color={fmt.accent} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Export note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: C.card, border: `1px solid ${C.border}`, maxWidth: 560 }}
      >
        <Printer size={12} color={C.dimmed} />
        <p style={{ fontSize: 10, color: C.dimmed, lineHeight: 1.6 }}>
          Each presentation includes an <span style={{ color: C.muted }}>Export PDF</span> button. PDF export uses browser print — landscape A4, no navigation, WELBX branding on every page.
        </p>
      </motion.div>
    </div>
  );
}
