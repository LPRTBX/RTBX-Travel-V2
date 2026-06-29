import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Clock, BookOpen, Play } from "lucide-react";

const C = {
  bg:     "hsl(220 13% 5%)",
  card:   "hsl(220 13% 8%)",
  border: "hsl(220 13% 11%)",
  amber:  "#c9a84c",
  white:  "#ffffff",
  muted:  "hsl(215 16% 52%)",
  dimmed: "hsl(215 16% 28%)",
  green:  "#10b981",
  blue:   "#3b82f6",
  violet: "#a78bfa",
  cyan:   "#22d3ee",
};

const MODES = [
  {
    path: "/story/executive-briefing",
    icon: Clock,
    label: "Executive Walkthrough",
    duration: "5 Minutes",
    slides: "6 slides",
    format: "Senior stakeholder overview",
    desc: "A concise, high-impact overview of how RTBX Travel works inside a real operator environment. Designed for senior leaders with limited time and high expectations.",
    steps: ["The Execution Gap", "RTBX Core Position", "Signals to Moments", "One Guest · One Moment", "Executive Command", "Measurable Value"],
    accent: C.amber,
    badge: "STRATEGY",
  },
  {
    path: "/story/operator-deep-dive",
    icon: BookOpen,
    label: "Operator Deep Dive",
    duration: "15 Minutes",
    slides: "13 sections",
    format: "Inside the operating layer",
    desc: "A complete walkthrough of every layer — from signal sensing to value attribution. For operations directors and technology leads at multi-property hotel operators.",
    steps: ["Problem Statement", "GHSOL Framework", "Signal Registry", "Moment Registry", "Strategic Visibility", "Decision Registry", "Execution Index", "Communications", "Guest Layer", "Outcome Layer", "Value Layer", "Executive Command", "Future Vision"],
    accent: C.green,
    badge: "OPERATIONS",
  },
  {
    path: "/story/live-guest-story",
    icon: Play,
    label: "Live Guest Story",
    duration: "Immersive",
    slides: "8 steps",
    format: "The WELBX guest experience layer",
    desc: "Experience a single guest moment from three perspectives — Guest, Operating, and Infrastructure. Follow a guest signal to outcome in real time through the WELBX layer.",
    steps: ["Signal Detected", "Moment Created", "Decision Made", "Communication Routed", "Action Executed", "Outcome Achieved", "Learning Captured", "Value Created"],
    accent: C.violet,
    badge: "GUEST LAYER",
  },
  {
    path: "/partner-room/operator-demo",
    icon: BookOpen,
    label: "Staff Action View",
    duration: "Guided",
    slides: "Operator workflow",
    format: "RTBX Core guided response",
    desc: "The staff-facing side of RTBX Core — how guided responses, intervention instructions and operator workflows are delivered in the moment.",
    steps: ["Signal Classified", "Playbook Selected", "Staff Briefed", "Action Confirmed", "Escalation Handled", "Resolution Logged"],
    accent: C.cyan,
    badge: "OPERATOR",
  },
  {
    path: "/partner-room/pilot-model",
    icon: Clock,
    label: "Assurance & Value View",
    duration: "Evidence layer",
    slides: "Outcome trail",
    format: "Proof of action · Risk reduction · Commercial value",
    desc: "The assurance trail — how every action is logged, every outcome is measured, and how risk reduction and commercial value are captured and attributed.",
    steps: ["Action Logged", "Outcome Measured", "Risk Trail Created", "Proof of Action", "Commercial Value Attributed", "Pilot ROI Confirmed"],
    accent: "#f97316",
    badge: "VALUE",
  },
];

const BRANDS = ["Hyatt", "Marriott", "Accor", "Hilton", "IHG-scale operators"];

export default function StoryHub() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", padding: "56px 72px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.amber} 0%, transparent 50%)` }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 52 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.24em", color: C.white, textTransform: "uppercase" }}>WELBX</span>
          <span style={{ color: C.dimmed }}>·</span>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", color: C.amber, textTransform: "uppercase" }}>OPERATOR STORY LAB</span>
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 800, color: C.white, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>
          Operator Story Lab
        </h1>

        <p style={{ fontSize: 13, color: C.muted, maxWidth: 560, lineHeight: 1.75, marginBottom: 20 }}>
          Explore how RTBX Travel works inside real-world operator environments — from guest signal to staff action, escalation, assurance and value capture.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: C.dimmed, textTransform: "uppercase" }}>Designed for</span>
          {BRANDS.map((b, i) => (
            <span key={i} style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, padding: "3px 8px", border: `1px solid ${C.border}`, textTransform: "uppercase" }}>{b}</span>
          ))}
        </div>
      </motion.div>

      {/* Mode cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, flex: 1 }}>
        {MODES.map((mode, fi) => (
          <motion.div
            key={mode.path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 + fi * 0.09 }}
            style={{ flex: 1 }}
          >
            <Link href={mode.path}>
              <div
                style={{ padding: 28, background: C.card, border: `1px solid ${C.border}`, cursor: "pointer", transition: "border-color 0.18s, background 0.18s", height: "100%", display: "flex", flexDirection: "column" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${mode.accent}50`; e.currentTarget.style.background = `hsl(220 13% 9%)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <mode.icon size={13} color={mode.accent} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: mode.accent, textTransform: "uppercase" }}>{mode.label}</span>
                  </div>
                  <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.16em", color: mode.accent, padding: "2px 7px", border: `1px solid ${mode.accent}30`, textTransform: "uppercase" }}>{mode.badge}</span>
                </div>

                <div style={{ fontSize: 8.5, color: C.dimmed, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                  {mode.duration} · {mode.slides}
                </div>

                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>{mode.desc}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
                  {mode.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: mode.accent, opacity: 0.4, flexShrink: 0 }} />
                      <span style={{ fontSize: 9.5, color: C.muted }}>{step}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: mode.accent, textTransform: "uppercase" }}>Begin</span>
                  <ArrowRight size={10} color={mode.accent} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: C.dimmed, textTransform: "uppercase" }}>WELBX Behavioural Infrastructure  |  The Operating Layer Between Signal And Action</span>
        <Link href="/"><span style={{ fontSize: 8.5, color: C.dimmed, cursor: "pointer", textDecoration: "underline" }}>← Return to Platform</span></Link>
      </motion.div>
    </div>
  );
}
