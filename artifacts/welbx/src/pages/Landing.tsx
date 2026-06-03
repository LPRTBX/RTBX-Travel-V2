import { motion } from "framer-motion";
import { Link } from "wouter";

const CARDS = [
  {
    index: "01",
    title: "Identify",
    body: "Surface what matters from operational noise. Distinguish signal from background. Elevate what requires attention.",
  },
  {
    index: "02",
    title: "Prioritise",
    body: "Rank risk and opportunity against defined thresholds. Know what to act on, in what order, and within what window.",
  },
  {
    index: "03",
    title: "Decide",
    body: "Trigger governed responses at the moment of relevance. Decision speed without decision risk.",
  },
  {
    index: "04",
    title: "Execute",
    body: "Deploy to teams and systems with consistency. Every action tracked, attributed, and measurable.",
  },
];

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
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981", opacity: 0.7 }} />
          <span style={{ fontSize: 8, letterSpacing: "0.16em", color: "hsl(215 16% 26%)", textTransform: "uppercase", fontWeight: 600 }}>
            The Grand Meridian, London &nbsp;·&nbsp; Live Deployment
          </span>
        </div>
      </motion.header>

      {/* Main */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 60px",
        maxWidth: 1100, margin: "0 auto", width: "100%",
        gap: 0,
      }}>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}
          style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 18 }}
        >
          WELBX · Behavioural Infrastructure
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.45 }}
          style={{
            fontSize: "clamp(36px, 4.6vw, 58px)", fontWeight: 800,
            color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.08,
            margin: 0, marginBottom: 16,
          }}
        >
          Behavioural Infrastructure
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.4 }}
          style={{
            fontSize: "clamp(15px, 1.6vw, 19px)", fontWeight: 400,
            color: "hsl(215 16% 50%)", letterSpacing: "-0.01em", lineHeight: 1.4,
            margin: 0, marginBottom: 22,
          }}
        >
          The operating layer between signal and action.
        </motion.p>

        {/* Rule */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
          style={{ height: 1, background: "hsl(220 13% 11%)", marginBottom: 22 }}
        />

        {/* Explainer */}
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }}
          style={{
            fontSize: 13.5, color: "hsl(215 16% 42%)",
            lineHeight: 1.75, maxWidth: 600, margin: 0, marginBottom: 36,
          }}
        >
          Every organisation already collects information. WELBX helps identify what matters, prioritise risk and opportunity, support better decisions, and improve execution consistency.
        </motion.p>

        {/* Four value cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 36 }}>
          {CARDS.map((card, i) => (
            <motion.div
              key={card.index}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 + i * 0.06, duration: 0.38 }}
              style={{
                padding: "18px 20px 20px",
                borderTop: "1px solid #c9a84c",
                borderRight: i < 3 ? "1px solid hsl(220 13% 10%)" : "none",
                borderBottom: "1px solid hsl(220 13% 10%)",
                borderLeft: i === 0 ? "1px solid hsl(220 13% 10%)" : "none",
                background: "hsl(220 13% 6%)",
                display: "flex", flexDirection: "column", gap: 8,
              }}
            >
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.18em", color: "hsl(215 16% 22%)", textTransform: "uppercase" }}>
                {card.index}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#fff", textTransform: "uppercase" }}>
                {card.title}
              </div>
              <div style={{ fontSize: 11.5, color: "hsl(215 16% 38%)", lineHeight: 1.65 }}>
                {card.body}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.66, duration: 0.38 }}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <Link href="/demo">
            <button
              style={{
                padding: "13px 30px",
                background: "#c9a84c", color: "hsl(220 13% 5%)",
                fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 10,
                border: "none", cursor: "pointer", transition: "opacity 0.18s",
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = "0.82")}
              onMouseOut={e => (e.currentTarget.style.opacity = "1")}
            >
              Enter the Operating Layer →
            </button>
          </Link>

          <Link href="/live-moments">
            <button
              style={{
                padding: "12px 26px",
                background: "transparent", color: "hsl(215 16% 46%)",
                fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 10,
                border: "1px solid hsl(220 13% 16%)", cursor: "pointer", transition: "all 0.18s",
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                e.currentTarget.style.color = "#c9a84c";
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = "hsl(220 13% 16%)";
                e.currentTarget.style.color = "hsl(215 16% 46%)";
              }}
            >
              View Executive Dashboard
            </button>
          </Link>
        </motion.div>

      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}
        style={{
          padding: "16px 60px",
          borderTop: "1px solid hsl(220 13% 8%)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 28 }}>
          {[
            { name: "BXOS", role: "Intelligence" },
            { name: "NEXUS", role: "Routing" },
            { name: "VECTOR", role: "Execution" },
          ].map(e => (
            <div key={e.name} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: "hsl(215 16% 22%)", textTransform: "uppercase" }}>{e.name}</span>
              <span style={{ fontSize: 8, color: "hsl(215 16% 16%)", letterSpacing: "0.06em" }}>· {e.role}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 8, letterSpacing: "0.08em", color: "hsl(215 16% 16%)" }}>
          WELBX · Confidential
        </div>
      </motion.footer>

    </div>
  );
}
