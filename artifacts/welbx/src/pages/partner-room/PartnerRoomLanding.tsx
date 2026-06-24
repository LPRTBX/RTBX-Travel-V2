import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { usePartnerContent } from "@/context/PartnerContentContext";
import { PartnerProofBanner } from "@/components/PartnerProofBanner";

const DEFAULT_FLOW_STEPS = [
  { label: "Signals",   desc: "Live data streams from every operational layer — a configured signal library across guest, staff and property sources" },
  { label: "Moments",   desc: "Pattern recognition surfaces what needs to happen now — validated against pilot moment categories" },
  { label: "Decisions", desc: "Governed response logic selects the right action" },
  { label: "Actions",   desc: "The right team member receives the right instruction" },
  { label: "Outcomes",  desc: "Every resolution is recorded and measured" },
  { label: "Value",     desc: "Learning compounds — the system improves on every cycle" },
];

const PARTNER_PATHS = [
  {
    id: "operator",
    title: "Operator / Hotel Group",
    sub: "FOR OPERATORS",
    desc: "Improve service recovery, staff consistency, escalation visibility, guest experience and measurable operational execution.",
    cta: "Show Operator Value",
    link: "/partner-room/operator-brief",
    color: "#c9a84c",
  },
  {
    id: "integration",
    title: "Integration Partner",
    sub: "FOR TECHNOLOGY PARTNERS",
    desc: "Connect existing systems into the RTBX Core signal layer so PMS, CRM, POS, workforce, loyalty, guest app and operational systems become live triggers.",
    cta: "Show Integration Model",
    link: "/partner-room/integration-brief",
    color: "#3b82f6",
  },
  {
    id: "commercial",
    title: "Commercial Partner",
    sub: "FOR COMMERCIAL PARTNERS",
    desc: "Activate moments where guest need, commercial intent and operational timing create new value.",
    cta: "Show Moments Economy",
    link: "/partner-room/moments-economy",
    color: "#a78bfa",
  },
  {
    id: "strategic",
    title: "Strategic / Funding Partner",
    sub: "FOR STRATEGIC PARTNERS",
    desc: "Understand the category opportunity, pilot validation model, commercial expansion and behavioural infrastructure position.",
    cta: "Show Commercial Model",
    link: "/partner-room/commercial-model",
    color: "#22d3ee",
  },
];

const PARTNER_ASKS = [
  {
    title: "Operator Partner",
    ask: "Pilot 1–3 properties and validate the operating layer against agreed metrics.",
    color: "#c9a84c",
  },
  {
    title: "Integration Partner",
    ask: "Map signal sources, confirm technical pathway and define first integration use case.",
    color: "#3b82f6",
  },
  {
    title: "Commercial Partner",
    ask: "Map activation moments, partner offers and revenue-sharing pathways.",
    color: "#a78bfa",
  },
  {
    title: "Strategic Partner",
    ask: "Support pilot validation, distribution, funding or category development.",
    color: "#22d3ee",
  },
];

const DEPLOYMENT_ENVS = [
  {
    id: "hotels",
    title: "Hotels & Resorts",
    color: "#c9a84c",
    focus: "Guest recovery, staff nudges, in-stay support, service moments, loyalty and concierge.",
    signals: ["Room readiness delay", "Service request spike", "Guest sentiment drop", "Loyalty profile trigger", "Staff response gap"],
    pathway: "Signal → Classify → Route to right team → Action delivered → Outcome logged",
    operatorValue: "Consistent service recovery without manual oversight. Every missed moment is caught.",
    guestValue: "Support arrives before the complaint forms. The stay recovers invisibly.",
    partnerOpportunity: "Loyalty activation, F&B moments, in-room upgrade offers, concierge experiences.",
    demoLink: null,
  },
  {
    id: "holiday-parks",
    title: "Holiday Parks & Outdoor Experiences",
    color: "#10b981",
    focus: "Family stays, caravan parks, camping, cabins, maintenance, weather disruption, guest welfare, local experiences and service recovery.",
    signals: ["Late arrival + weather change", "Cabin readiness delay", "Family profile + child welfare signal", "Maintenance alert", "Guest frustration threshold"],
    pathway: "Signal → Classify → Proactive support → Staff brief → Partner offer → Assurance",
    operatorValue: "Escalation prevented before the first complaint. Staff get the right instruction at the right moment.",
    guestValue: "Acknowledged on arrival, supported through disruption, offered alternatives that actually help.",
    partnerOpportunity: "Local experiences, weather-responsive activities, food & beverage, family-specific offers.",
    demoLink: "/partner-room/holiday-park-demo",
  },
  {
    id: "corporate",
    title: "Corporate & Business Travel",
    color: "#3b82f6",
    focus: "Business travellers, repeat stays, conference guests, loyalty pathways, duty-of-care and productivity support.",
    signals: ["Late checkout pattern", "Conference schedule conflict", "Loyalty tier trigger", "Repeat guest signal", "Duty-of-care flag"],
    pathway: "Signal → Classify → Silent intervention → Loyalty action → Value logged",
    operatorValue: "Repeat guests recognised and served without asking. Revenue per stay increases.",
    guestValue: "The stay adapts to their schedule. Friction disappears before it appears.",
    partnerOpportunity: "Corporate loyalty programmes, productivity tools, transport, premium service tiers.",
    demoLink: null,
  },
  {
    id: "events",
    title: "Events & Venues",
    color: "#a78bfa",
    focus: "Crowd flow, incident response, accessibility, welfare, service recovery and operational coordination.",
    signals: ["Crowd density alert", "Accessibility need flagged", "Incident proximity signal", "Service queue spike", "Welfare check trigger"],
    pathway: "Signal → Classify → Coordinate response → Dispatch → Confirm resolution",
    operatorValue: "Incidents caught early. Staff coordinated in real time. Liability reduced.",
    guestValue: "Support is visible when it matters. Issues resolved before they escalate.",
    partnerOpportunity: "Accessibility services, crowd management, F&B surge response, safety partners.",
    demoLink: null,
  },
  {
    id: "destination",
    title: "Destination & Tourism Operators",
    color: "#22d3ee",
    focus: "Visitor pathways, local recommendations, partner marketplace, itinerary nudges and destination-level intelligence.",
    signals: ["Visitor arrival pattern", "Itinerary gap detected", "Local partner availability", "Weather or transport change", "Return visitor signal"],
    pathway: "Signal → Classify → Personalised nudge → Partner activation → Value captured",
    operatorValue: "Visitor spend distributed across the destination. Partner ecosystem activated.",
    guestValue: "The right experience surfaces at the right moment. The destination feels effortless.",
    partnerOpportunity: "Entire local partner marketplace — experiences, transport, food, accommodation.",
    demoLink: null,
  },
];

const THIS_IS_NOT = [
  "A guest app",
  "A reporting dashboard",
  "A replacement PMS",
  "Another staff portal",
];

const THIS_IS = [
  "A real-time execution layer",
  "A signal-to-action system",
  "A governed response engine",
  "A partner value platform",
];

export default function PartnerRoomLanding() {
  const [activeEnv, setActiveEnv] = useState(0);
  const { content } = usePartnerContent();
  const landing = content?.landing;

  const flowSteps = landing?.flowSteps ?? DEFAULT_FLOW_STEPS;
  const partnerPaths = landing?.partnerPaths ?? PARTNER_PATHS;

  return (
    <PartnerRoomLayout>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px 120px" }}>

      {/* Header block */}
      <div style={{ marginBottom: 72 }}>
        {/* Brand hierarchy strip */}
        <div style={{ display: "flex", gap: 0, marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { label: "RTBX Group", sub: "Parent ecosystem", dim: true },
            { label: "RTBX Core", sub: "Signal-to-action engine", dim: false },
            { label: "RTBX Travel", sub: "Travel vertical", dim: false },
            { label: "WELBX", sub: "Guest experience layer", blue: true },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                padding: "6px 16px",
                background: item.blue ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${item.blue ? "rgba(59,130,246,0.2)" : item.dim ? "rgba(255,255,255,0.05)" : "rgba(201,168,76,0.15)"}`,
                borderRight: "none",
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: item.blue ? "#3b82f6" : item.dim ? "rgba(255,255,255,0.3)" : "#c9a84c" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em", marginTop: 2 }}>{item.sub}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ width: 16, height: 1, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
          {landing?.tagline ?? "RTBX Travel Partner Room · Private Strategic Briefing"}
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.08, marginBottom: 24, maxWidth: 780 }}>
          The execution layer travel operators<br />
          <span style={{ color: "#c9a84c" }}>do not currently have.</span>
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 640, marginBottom: 16 }}>
          RTBX Travel connects guest, staff and operational signals to the right action in the moment — before value is lost, risk escalates or experience breaks down.
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", lineHeight: 1.65, maxWidth: 580, marginBottom: 48 }}>
          RTBX Travel is powered by RTBX Core. WELBX is the guest-facing experience layer.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/partner-room/dual-view-demo">
            <div style={{
              padding: "14px 28px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              background: "#c9a84c",
              color: "#080c14",
              border: "1px solid #c9a84c",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}
            >
              Open Dual View Demo
            </div>
          </Link>
          {[
            { label: "Choose Partner Path", href: "#partner-paths" as string },
            { label: "View Pilot Model",    href: "/partner-room/pilot-model" as string },
          ].map(btn => (
            btn.href.startsWith("#") ? (
              <a key={btn.label} href={btn.href} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "14px 28px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  background: "transparent",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.4)"; el.style.color = "#fff"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(255,255,255,0.6)"; }}
                >
                  {btn.label}
                </div>
              </a>
            ) : (
              <Link key={btn.label} href={btn.href}>
                <div style={{
                  padding: "14px 28px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  background: "transparent",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.4)"; el.style.color = "#fff"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(255,255,255,0.6)"; }}
                >
                  {btn.label}
                </div>
              </Link>
            )
          ))}
        </div>
      </div>

      {/* What you are looking at */}
      <div style={{ marginBottom: 80 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
          What you are looking at
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {/* This is not */}
          <div style={{
            padding: "36px 32px",
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 24 }}>
              This is not
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {THIS_IS_NOT.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 14, height: 1, background: "rgba(239,68,68,0.4)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* This is */}
          <div style={{
            padding: "36px 32px",
            background: "rgba(201,168,76,0.03)",
            border: "1px solid rgba(201,168,76,0.12)",
            borderLeft: "2px solid rgba(201,168,76,0.4)",
          }}>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 24 }}>
              This is
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {THIS_IS.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 14, height: 1, background: "rgba(201,168,76,0.6)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Travel Deployment Environments */}
      <div style={{ marginBottom: 96 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
          RTBX Travel · Deployment Environments
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", marginBottom: 12, maxWidth: 680 }}>
          RTBX Travel. Five deployment environments.
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: 620, marginBottom: 36 }}>
          RTBX Travel applies the same RTBX Core signal-to-action infrastructure across different guest and operator environments. The setting changes — hotels, parks, events, corporate, destination — but the execution logic remains the same.
        </p>

        {/* Environment tab strip */}
        <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
          {DEPLOYMENT_ENVS.map((env, i) => (
            <button
              key={env.id}
              onClick={() => setActiveEnv(i)}
              style={{
                flex: 1,
                padding: "14px 10px",
                background: i === activeEnv ? `${env.color}10` : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === activeEnv ? env.color + "40" : "rgba(255,255,255,0.06)"}`,
                borderBottom: i === activeEnv ? `2px solid ${env.color}` : "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (i !== activeEnv) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = "rgba(255,255,255,0.12)"; }}}
              onMouseLeave={e => { if (i !== activeEnv) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.02)"; el.style.borderColor = "rgba(255,255,255,0.06)"; }}}
            >
              <div style={{
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: i === activeEnv ? DEPLOYMENT_ENVS[i].color : "rgba(255,255,255,0.35)",
                lineHeight: 1.4,
              }}>
                {env.title}
              </div>
            </button>
          ))}
        </div>

        {/* Active environment detail panel */}
        {(() => {
          const env = DEPLOYMENT_ENVS[activeEnv];
          return (
            <div style={{
              padding: "36px 36px",
              background: `${env.color}05`,
              border: `1px solid ${env.color}20`,
              borderTop: "none",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 32 }}>
                <div>
                  <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                    Focus
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 24 }}>
                    {env.focus}
                  </p>
                  <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                    Action Pathway
                  </div>
                  <div style={{ fontSize: 12, color: env.color, fontWeight: 600, letterSpacing: "0.03em" }}>
                    {env.pathway}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                    Signal Examples
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 0 }}>
                    {env.signals.map((sig, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 16, height: 1, background: `${env.color}50`, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{sig}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                {[
                  { label: "Operator Value", value: env.operatorValue, color: "#c9a84c" },
                  { label: "Guest Value", value: env.guestValue, color: "#10b981" },
                  { label: "Partner Opportunity", value: env.partnerOpportunity, color: "#3b82f6" },
                ].map(block => (
                  <div key={block.label} style={{
                    padding: "20px 20px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderTop: `2px solid ${block.color}`,
                  }}>
                    <div style={{ fontSize: 8, letterSpacing: "0.16em", color: block.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                      {block.label}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                      {block.value}
                    </div>
                  </div>
                ))}
              </div>

              {env.demoLink && (
                <div style={{ marginTop: 24 }}>
                  <Link href={env.demoLink}>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 24px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      background: env.color,
                      color: "#080c14",
                      border: `1px solid ${env.color}`,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                    >
                      Run Live Scenario →
                    </div>
                  </Link>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Six-step flow visual */}
      <div style={{ marginBottom: 96 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
          The RTBX Core Operating Chain
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}>
          {flowSteps.map((step, i) => (
            <div key={step.label} style={{
              padding: "24px 18px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: i === 0 ? "2px solid #c9a84c" : undefined,
              position: "relative",
            }}>
              <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(201,168,76,0.5)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "0.02em" }}>
                {step.label}
              </div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.55 }}>
                {step.desc}
              </div>
              {i < flowSteps.length - 1 && (
                <div style={{ position: "absolute", right: -9, top: "50%", transform: "translateY(-50%)", width: 16, height: 1, background: "rgba(201,168,76,0.3)", zIndex: 1 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Partner path cards */}
      <div id="partner-paths" style={{ marginBottom: 80 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
          Partnership Paths
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {partnerPaths.map((card: typeof PARTNER_PATHS[0]) => (
            <div key={card.id ?? card.title} style={{
              padding: "36px 28px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: `2px solid ${card.color}`,
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.2em", color: card.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
                {card.sub}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                {card.title}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.7, marginBottom: 28, flex: 1 }}>
                {card.desc}
              </div>
              <Link href={card.link}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: card.color,
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                >
                  {card.cta} →
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Ask section */}
      <div style={{ marginBottom: 80 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
          Where a partner can engage
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {PARTNER_ASKS.map(ask => (
            <div key={ask.title} style={{
              padding: "28px 24px",
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ width: 28, height: 2, background: ask.color, marginBottom: 18, opacity: 0.6 }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                {ask.title}
              </div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                {ask.ask}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proof discipline banner */}
      <PartnerProofBanner />

      {/* CTA footer */}
      <div style={{
        padding: "48px 40px",
        background: "rgba(201,168,76,0.04)",
        border: "1px solid rgba(201,168,76,0.12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 28,
      }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(201,168,76,0.6)", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
            Strongest Journey
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            Ready to map this to your environment?
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/partner-room/dual-view-demo">
            <div style={{
              padding: "12px 24px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              background: "#c9a84c",
              color: "#080c14",
              border: "1px solid #c9a84c",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}
            >
              Open Dual View Demo
            </div>
          </Link>
          <Link href="/partner-room/pilot-model">
            <div style={{
              padding: "12px 24px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.15)",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.4)"; el.style.color = "#fff"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(255,255,255,0.6)"; }}
            >
              View Pilot Model
            </div>
          </Link>
          <a href="mailto:lance@rtbx.com.au?subject=RTBX Travel Partner Briefing" style={{ textDecoration: "none" }}>
            <div style={{
              padding: "12px 24px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.15)",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.4)"; el.style.color = "#fff"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(255,255,255,0.6)"; }}
            >
              Request Partner Briefing
            </div>
          </a>
        </div>
      </div>

    </div>
    </PartnerRoomLayout>
  );
}
