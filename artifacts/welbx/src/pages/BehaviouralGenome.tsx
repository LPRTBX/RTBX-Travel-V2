import { useState } from "react";
import { motion } from "framer-motion";

const ACCENT = "#c9a84c";

type TraitLevel = 1 | 2 | 3 | 4 | 5;

interface Profile {
  id: string;
  name: string;
  archetype: string;
  descriptor: string;
  communication: { style: string; preferred: string; avoid: string; level: TraitLevel };
  response: { speed: string; pattern: string; trigger: string; level: TraitLevel };
  engagement: { mode: string; depth: string; frequency: string; level: TraitLevel };
  activation: { channel: string; tone: string; timing: string; level: TraitLevel };
  tags: string[];
}

const GUEST_PROFILES: Profile[] = [
  {
    id: "guest-a",
    name: "Guest A",
    archetype: "The Autonomous Achiever",
    descriptor: "High-control, efficiency-driven. Minimises interaction. Optimises every touchpoint.",
    communication: { style: "Direct", preferred: "App notifications, concise written updates", avoid: "Unsolicited verbal check-ins", level: 4 },
    response: { speed: "Immediate", pattern: "Decides fast, rarely revisits", trigger: "Friction or unmet expectation", level: 5 },
    engagement: { mode: "Self-directed", depth: "Shallow but precise", frequency: "Low contact, high specificity", level: 2 },
    activation: { channel: "In-app, SMS", tone: "Functional, no small talk", timing: "On-demand only", level: 5 },
    tags: ["Low-touch", "High-value", "Efficiency-led", "Loyalty-sensitive"],
  },
  {
    id: "guest-b",
    name: "Guest B",
    archetype: "The Relationship Seeker",
    descriptor: "Warmth-driven, experience-oriented. Values acknowledgement and personal connection.",
    communication: { style: "Conversational", preferred: "Verbal, face-to-face, personalised notes", avoid: "Automated, transactional language", level: 2 },
    response: { speed: "Considered", pattern: "Seeks reassurance before deciding", trigger: "Feeling unrecognised or generic", level: 2 },
    engagement: { mode: "Collaborative", depth: "High, relationship-driven", frequency: "Regular, proactive contact welcome", level: 5 },
    activation: { channel: "Personal call, verbal interaction", tone: "Warm, name-led, narrative-rich", timing: "Proactive, not reactive", level: 3 },
    tags: ["High-touch", "Loyalty-loyal", "Recognition-driven", "Experience-led"],
  },
  {
    id: "guest-c",
    name: "Guest C",
    archetype: "The Status Validator",
    descriptor: "Prestige-aware, comparison-oriented. Acts when exclusivity or privilege is confirmed.",
    communication: { style: "Formal", preferred: "Private, discreet, elevated language", avoid: "Public-facing or standardised messaging", level: 3 },
    response: { speed: "Deliberate", pattern: "Validates before acting — seeks proof of distinction", trigger: "Perceived parity with other guests", level: 3 },
    engagement: { mode: "Selective", depth: "Moderate — high quality, low frequency", frequency: "Curated interactions only", level: 3 },
    activation: { channel: "Concierge-direct, private channel", tone: "Exclusive, elevated, specific to tier", timing: "Anticipatory — before they need to ask", level: 4 },
    tags: ["Prestige-driven", "Tier-sensitive", "Exclusivity-led", "High-value"],
  },
];

const STAFF_PROFILES: Profile[] = [
  {
    id: "staff-a",
    name: "Staff — Frontline Responder",
    archetype: "The Action-Oriented Executor",
    descriptor: "Responds to clear, immediate instructions. Thrives on task completion and visible impact.",
    communication: { style: "Concise", preferred: "Push notification, task card with single clear action", avoid: "Long briefings during live service", level: 5 },
    response: { speed: "Fast", pattern: "Executes first, questions after", trigger: "Ambiguous instruction or competing priorities", level: 5 },
    engagement: { mode: "Task-driven", depth: "Narrow focus per task", frequency: "Continuous, real-time", level: 4 },
    activation: { channel: "Handheld device / app", tone: "Directive, specific, immediate", timing: "At point of need", level: 5 },
    tags: ["Execution-first", "Real-time", "Clarity-dependent", "Operational"],
  },
  {
    id: "staff-b",
    name: "Staff — Service Artisan",
    archetype: "The Quality-Driven Professional",
    descriptor: "Standards-driven, reputation-conscious. Motivated by recognition and craft excellence.",
    communication: { style: "Contextual", preferred: "Context-rich briefings, acknowledged effort", avoid: "Purely metric-driven feedback", level: 3 },
    response: { speed: "Measured", pattern: "Considers best outcome before acting", trigger: "Standards compromise or lack of recognition", level: 3 },
    engagement: { mode: "Standards-led", depth: "Deep within own domain", frequency: "Focused, purposeful", level: 3 },
    activation: { channel: "Team briefing, supervisor interaction", tone: "Respectful, standards-affirming", timing: "Pre-shift and mid-shift context-setting", level: 3 },
    tags: ["Quality-driven", "Recognition-motivated", "Domain-expert", "Standards-led"],
  },
];

const MANAGER_PROFILES: Profile[] = [
  {
    id: "manager-a",
    name: "Manager — Operations Lead",
    archetype: "The Pattern Detector",
    descriptor: "Systems-thinker, pattern-aware. Acts on aggregate signals rather than individual events.",
    communication: { style: "Structured", preferred: "Dashboard summaries, exception-based alerts", avoid: "Noise — too many low-priority signals", level: 4 },
    response: { speed: "Considered", pattern: "Diagnosis before action", trigger: "Compounding signals with no visible resolution", level: 3 },
    engagement: { mode: "Analytical", depth: "Broad across operations", frequency: "Daily rhythm with live monitoring", level: 4 },
    activation: { channel: "Command view, shift summary", tone: "Evidence-based, action-implication clear", timing: "Scheduled + exception-triggered", level: 4 },
    tags: ["Systems-thinker", "Exception-led", "Analytical", "Operational"],
  },
  {
    id: "manager-b",
    name: "Manager — People Lead",
    archetype: "The Capability Builder",
    descriptor: "Team-focused, development-oriented. Intervenes to coach rather than instruct.",
    communication: { style: "Narrative", preferred: "Contextual briefings, team-framed outcomes", avoid: "Individual blame signals, raw metrics without context", level: 2 },
    response: { speed: "Deliberate", pattern: "Contextualises before intervening", trigger: "Staff capability gap, repeated patterns", level: 2 },
    engagement: { mode: "Coaching-led", depth: "Deep with individuals", frequency: "Regular touchpoints", level: 5 },
    activation: { channel: "Team huddle, 1:1 cadence, narrative summary", tone: "Growth-framing, capability-positive", timing: "Shift boundaries, learning moments", level: 3 },
    tags: ["People-first", "Coaching-led", "Development-oriented", "Narrative-driven"],
  },
];

const EXEC_PROFILES: Profile[] = [
  {
    id: "exec-a",
    name: "Executive — GM",
    archetype: "The Outcome Owner",
    descriptor: "Reputation and result-driven. Acts when outcomes are at risk or when strategic advantage is available.",
    communication: { style: "Telegraphic", preferred: "Three-line summary, risk + action + implication", avoid: "Operational detail without commercial frame", level: 5 },
    response: { speed: "Fast on risk, slow on strategy", pattern: "Delegates execution, owns narrative", trigger: "Reputational exposure or performance shortfall", level: 4 },
    engagement: { mode: "Outcome-focused", depth: "Shallow operationally, deep strategically", frequency: "Exception-only", level: 2 },
    activation: { channel: "Executive digest, critical alert", tone: "Outcome-framed, commercially anchored", timing: "Morning brief + exception escalation", level: 4 },
    tags: ["Outcome-led", "Exception-driven", "Reputation-aware", "Strategic"],
  },
  {
    id: "exec-b",
    name: "Executive — Commercial Director",
    archetype: "The Activation Architect",
    descriptor: "Value-maximising, opportunity-oriented. Activates on activation signals and commercial pattern breaks.",
    communication: { style: "Commercial", preferred: "Value quantification, comparative benchmarks", avoid: "Service narrative without commercial frame", level: 4 },
    response: { speed: "Fast on opportunity", pattern: "Seeks upside before addressing downside", trigger: "Missed activation signal, competitor advantage", level: 4 },
    engagement: { mode: "Opportunity-seeking", depth: "Deep on commercial, surface on operations", frequency: "Daily commercial pulse", level: 4 },
    activation: { channel: "Commercial dashboard, activation alert", tone: "Value-framed, comparative, opportunity-led", timing: "Daily commercial briefing", level: 5 },
    tags: ["Value-first", "Commercial-lens", "Opportunity-led", "Benchmark-driven"],
  },
];

const GROUPS = [
  { id: "guest", label: "Guests", profiles: GUEST_PROFILES },
  { id: "staff", label: "Staff", profiles: STAFF_PROFILES },
  { id: "manager", label: "Managers", profiles: MANAGER_PROFILES },
  { id: "executive", label: "Executives", profiles: EXEC_PROFILES },
];

function TraitBar({ level, color }: { level: TraitLevel; color: string }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          style={{
            width: 16, height: 3,
            background: n <= level ? color : "hsl(220 13% 12%)",
          }}
        />
      ))}
    </div>
  );
}

function ProfileCard({ profile, index }: { profile: Profile; index: number }) {
  const dims = [
    { key: "communication", label: "Communication", icon: "◈", color: ACCENT, data: profile.communication },
    { key: "response", label: "Response Behaviour", icon: "◈", color: "#10b981", data: profile.response },
    { key: "engagement", label: "Engagement Style", icon: "◈", color: "#a78bfa", data: profile.engagement },
    { key: "activation", label: "Activation Preferences", icon: "◈", color: "#60a5fa", data: profile.activation },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{
        background: "hsl(220 13% 6%)", border: "1px solid hsl(220 13% 10%)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Profile header */}
      <div style={{
        padding: "18px 20px 16px",
        borderBottom: "1px solid hsl(220 13% 9%)",
        background: "hsl(220 13% 7%)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: "0.04em" }}>
              {profile.archetype}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "hsl(215 16% 44%)", lineHeight: 1.6, margin: 0, marginTop: 8 }}>
          {profile.descriptor}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
          {profile.tags.map((t) => (
            <span key={t} style={{
              fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
              color: "hsl(215 16% 34%)", background: "hsl(220 13% 9%)",
              padding: "2px 6px", textTransform: "uppercase",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {dims.map((dim, di) => {
          const d = dim.data as { style?: string; preferred: string; avoid?: string; level: TraitLevel; speed?: string; pattern?: string; trigger?: string; mode?: string; depth?: string; frequency?: string; channel?: string; tone?: string; timing?: string };
          const primary = d.preferred || d.style || "";
          const secondary = d.avoid || d.pattern || d.depth || d.tone || "";
          const tertiary = d.trigger || d.timing || d.frequency || "";
          return (
            <div
              key={dim.key}
              style={{
                padding: "14px 20px",
                borderBottom: di < dims.length - 1 ? "1px solid hsl(220 13% 9%)" : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.16em", color: dim.color, textTransform: "uppercase" }}>
                  {dim.label}
                </div>
                <TraitBar level={d.level} color={dim.color} />
              </div>
              <div style={{ fontSize: 11, color: "#fff", marginBottom: 3 }}>{primary}</div>
              {secondary && <div style={{ fontSize: 10, color: "hsl(215 16% 40%)", lineHeight: 1.5 }}>{secondary}</div>}
              {tertiary && <div style={{ fontSize: 10, color: "hsl(215 16% 32%)", marginTop: 2 }}>{tertiary}</div>}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function BehaviouralGenome() {
  const [activeGroup, setActiveGroup] = useState("guest");
  const group = GROUPS.find((g) => g.id === activeGroup)!;

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="mb-10"
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.26em", color: ACCENT, textTransform: "uppercase", marginBottom: 10 }}>
            WELBX · Behavioural Layer
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0, marginBottom: 10 }}>
            Behavioural Genome
          </h1>
          <p style={{ fontSize: "clamp(14px, 1.5vw, 18px)", fontWeight: 500, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.4, margin: 0, marginBottom: 10 }}>
            Understanding behaviour improves outcomes.
          </p>
          <p style={{ fontSize: 12, color: "hsl(215 16% 44%)", lineHeight: 1.75, maxWidth: 620, margin: 0 }}>
            Different people respond to the same signal in different ways. WELBX maps behavioural profiles to ensure every moment is acted on in the right way, by the right person, with the right approach.
          </p>
        </motion.header>

        {/* Principle block */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1, marginBottom: 36,
          }}
        >
          {[
            { label: "Preferred Communication", desc: "How they want to receive information — channel, tone, density" },
            { label: "Response Behaviour", desc: "How they process and act — speed, pattern, what triggers friction" },
            { label: "Engagement Style", desc: "How deeply they want to be involved — directed, collaborative, or independent" },
            { label: "Activation Preferences", desc: "What makes them respond — channel, language, moment of delivery" },
          ].map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              style={{
                padding: "16px 18px",
                background: "hsl(220 13% 6%)", border: "1px solid hsl(220 13% 9%)",
                borderTop: `2px solid ${i === 0 ? ACCENT : i === 1 ? "#10b981" : i === 2 ? "#a78bfa" : "#60a5fa"}`,
              }}
            >
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
                color: [ACCENT, "#10b981", "#a78bfa", "#60a5fa"][i],
                textTransform: "uppercase", marginBottom: 8,
              }}>{p.label}</div>
              <div style={{ fontSize: 11, color: "hsl(215 16% 42%)", lineHeight: 1.6 }}>{p.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Group tabs */}
        <div style={{ display: "flex", gap: 1, marginBottom: 24 }}>
          {GROUPS.map((g) => {
            const isActive = g.id === activeGroup;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id)}
                style={{
                  padding: "10px 24px",
                  background: isActive ? "hsl(220 13% 8%)" : "hsl(220 13% 5%)",
                  border: "1px solid hsl(220 13% 10%)",
                  borderBottom: isActive ? "none" : "1px solid hsl(220 13% 10%)",
                  borderTop: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
                  cursor: "pointer",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
                  color: isActive ? "#fff" : "hsl(215 16% 36%)",
                  textTransform: "uppercase",
                  transition: "all 0.15s",
                }}
              >
                {g.label}
                <span style={{ marginLeft: 8, fontSize: 8.5, color: isActive ? ACCENT : "hsl(215 16% 28%)" }}>
                  {g.profiles.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Profile grid */}
        <motion.div
          key={activeGroup}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: group.profiles.length === 2 ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          {group.profiles.map((profile, i) => (
            <ProfileCard key={profile.id} profile={profile} index={i} />
          ))}
        </motion.div>

        {/* Insight footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{
            marginTop: 32, padding: "22px 28px",
            border: "1px solid hsl(220 13% 10%)",
            borderLeft: `2px solid ${ACCENT}`,
            background: "hsl(220 13% 6%)",
          }}
        >
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase", marginBottom: 10 }}>
            The Behavioural Principle
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "hsl(215 16% 50%)", lineHeight: 1.8, maxWidth: 740 }}>
            The same moment, communicated in the wrong way, produces the wrong response. WELBX does not just identify what needs to happen — it knows <em style={{ color: "#fff", fontStyle: "normal" }}>how to activate the right person</em> based on their behavioural profile. Execution is not just speed. It is fit.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
