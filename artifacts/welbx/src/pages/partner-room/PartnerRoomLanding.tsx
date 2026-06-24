import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { usePartnerContent } from "@/context/PartnerContentContext";
import { PartnerProofBanner } from "@/components/PartnerProofBanner";

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

const PORTAL_SECTIONS = [
  {
    num: "01",
    label: "Partner Room",
    color: "#c9a84c",
    desc: "What RTBX Travel is, how RTBX Core powers it, and where WELBX fits as the guest-facing experience layer.",
    links: [
      { label: "What is RTBX Travel?",          href: "/partner-room/overview" },
      { label: "Powered by RTBX Core",           href: "/partner-room/overview" },
      { label: "WELBX Guest Experience Layer",   href: "/partner-room/guest-demo",  blue: true },
      { label: "Who this room is for",            href: "/partner-room/overview" },
    ],
    cta: "Start Briefing",
    ctaHref: "/partner-room/overview",
  },
  {
    num: "02",
    label: "Operating Environments",
    color: "#10b981",
    desc: "Five travel environments where RTBX Travel deploys the same RTBX Core operating logic.",
    links: [
      { label: "Hotels & Resorts",                     href: "/partner-room" },
      { label: "Holiday Parks & Outdoor Experiences",  href: "/partner-room/holiday-park-demo" },
      { label: "Corporate Travel",                      href: "/partner-room" },
      { label: "Events & Venues",                       href: "/partner-room" },
      { label: "Destination & Tourism Operators",       href: "/partner-room" },
    ],
    cta: "Run Holiday Parks Demo",
    ctaHref: "/partner-room/holiday-park-demo",
  },
  {
    num: "03",
    label: "Demo Room",
    color: "#c9a84c",
    desc: "Live operating scenarios, guest journeys, operator views and dual-view demonstrations.",
    links: [
      { label: "All Demo Paths",          href: "/partner-room/demo-paths" },
      { label: "Guest Demo",              href: "/partner-room/guest-demo", blue: true },
      { label: "Operator Demo",           href: "/partner-room/operator-demo" },
      { label: "Dual View Demo",          href: "/partner-room/dual-view-demo" },
      { label: "Holiday Parks Scenario",  href: "/partner-room/holiday-park-demo" },
      { label: "Scenario Demo",           href: "/scenario-demo" },
    ],
    cta: "Open Demo Room",
    ctaHref: "/partner-room/demo-paths",
  },
  {
    num: "04",
    label: "Moment Economy",
    color: "#a78bfa",
    desc: "The moment library — ten categories of service, welfare, commercial and operational moments that create measurable value.",
    links: [
      { label: "Partner Moments Economy",   href: "/partner-room/moments-economy" },
      { label: "Moment Registry",           href: "/moment-registry" },
      { label: "Moment Intelligence",       href: "/moment-intelligence" },
      { label: "Live Moments",              href: "/live-moments" },
    ],
    cta: "View Moments",
    ctaHref: "/partner-room/moments-economy",
  },
  {
    num: "05",
    label: "Decision & Action Layer",
    color: "#c9a84c",
    desc: "How RTBX Core classifies moments, selects responses, routes interventions and confirms outcomes.",
    links: [
      { label: "Decision Registry",       href: "/decision-registry" },
      { label: "Playbook Engine",         href: "/playbook-engine" },
      { label: "Intervention Library",    href: "/intervention-library" },
      { label: "Signals Engine",          href: "/partner-room/signals-engine" },
    ],
    cta: "View Decision Registry",
    ctaHref: "/decision-registry",
  },
  {
    num: "06",
    label: "Communications Layer",
    color: "#22d3ee",
    desc: "Guest messages, staff instructions and command assurance — structured communication from RTBX Core.",
    links: [
      { label: "Central Communications",       href: "/communications" },
      { label: "Communication Registry",       href: "/communication-registry" },
      { label: "Communication Intelligence",   href: "/communication-intelligence" },
    ],
    cta: "View Communications",
    ctaHref: "/communications",
  },
  {
    num: "07",
    label: "Validation Lab",
    color: "#10b981",
    desc: "Scenario replay, shadow pilot mode and full validation dashboards — test the system before go-live.",
    links: [
      { label: "Scenario Replay Lab",        href: "/scenario-replay-lab" },
      { label: "Shadow Pilot Mode",          href: "/shadow-pilot-mode" },
      { label: "Validation Dashboard",       href: "/scenario-validation-dashboard" },
      { label: "Validation Summary",         href: "/validation-summary" },
      { label: "Export Reports",             href: "/export-reports" },
    ],
    cta: "Open Validation Lab",
    ctaHref: "/scenario-replay-lab",
  },
  {
    num: "08",
    label: "Operator Story Lab",
    color: "#f97316",
    desc: "Explore how RTBX Travel works inside real-world operator environments — from guest signal to staff action, escalation, assurance and value capture.",
    links: [
      { label: "Executive Walkthrough",    href: "/story/executive-briefing" },
      { label: "Operator Deep Dive",        href: "/story/operator-deep-dive" },
      { label: "Live Guest Story",          href: "/story/live-guest-story", blue: true },
      { label: "Staff Action View",         href: "/partner-room/operator-demo" },
      { label: "Assurance & Value View",    href: "/partner-room/pilot-model" },
    ],
    cta: "Enter Story Lab",
    ctaHref: "/story",
  },
  {
    num: "09",
    label: "Commercial",
    color: "#a78bfa",
    desc: "Pilot model, commercial pathways, integration model and partner engagement structure.",
    links: [
      { label: "Pilot Model",           href: "/partner-room/pilot-model" },
      { label: "Commercial Model",      href: "/partner-room/commercial-model" },
      { label: "Integration Brief",     href: "/partner-room/integration-brief" },
    ],
    cta: "View Commercial Model",
    ctaHref: "/partner-room/commercial-model",
  },
  {
    num: "10",
    label: "Brief Library",
    color: "#3b82f6",
    desc: "Targeted briefings for operators, technology partners, commercial leads and holiday parks.",
    links: [
      { label: "Operator Brief",            href: "/partner-room/operator-brief" },
      { label: "Integration Brief",         href: "/partner-room/integration-brief" },
      { label: "Commercial Brief",          href: "/partner-room/commercial-model" },
      { label: "Holiday Parks Brief",       href: "/partner-room/holiday-park-demo" },
    ],
    cta: "Open Brief Library",
    ctaHref: "/partner-room/operator-brief",
  },
  {
    num: "11",
    label: "Next Step",
    color: "#c9a84c",
    desc: "Start a direct briefing — pilot conversation, partner pathway, integration or funding discussion.",
    links: [
      { label: "Partner Briefing",          href: "mailto:lance@rtbx.com.au?subject=RTBX Travel Partner Briefing",       ext: true },
      { label: "Pilot Conversation",        href: "mailto:lance@rtbx.com.au?subject=RTBX Travel Pilot Conversation",     ext: true },
      { label: "Integration Conversation",  href: "mailto:lance@rtbx.com.au?subject=RTBX Travel Integration Discussion", ext: true },
      { label: "Funding Conversation",      href: "mailto:lance@rtbx.com.au?subject=RTBX Travel Funding Discussion",     ext: true },
    ],
    cta: "Request Briefing",
    ctaHref: "mailto:lance@rtbx.com.au?subject=RTBX Travel Partner Briefing",
    ctaExt: true,
  },
];

const THIS_IS_NOT = ["A guest app", "A reporting dashboard", "A replacement PMS", "Another staff portal"];
const THIS_IS     = ["A real-time execution layer", "A signal-to-action system", "A governed response engine", "A partner value platform"];

const FLOW_STEPS = [
  { label: "Signals",   desc: "Live data from every operational layer — guest, staff and property sources" },
  { label: "Moments",   desc: "Pattern recognition surfaces what needs to happen now" },
  { label: "Decisions", desc: "Governed response logic selects the right action" },
  { label: "Actions",   desc: "The right team member receives the right instruction" },
  { label: "Outcomes",  desc: "Every resolution is recorded and measured" },
  { label: "Value",     desc: "Learning compounds — the system improves on every cycle" },
];

function GhostBtn({ href, children, ext = false }: { href: string; children: React.ReactNode; ext?: boolean }) {
  const inner = (
    <div style={{
      padding: "10px 20px",
      fontSize: 9.5,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      cursor: "pointer",
      background: "transparent",
      color: "rgba(255,255,255,0.55)",
      border: "1px solid rgba(255,255,255,0.14)",
      transition: "all 0.15s",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
    }}
    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.38)"; el.style.color = "#fff"; }}
    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.14)"; el.style.color = "rgba(255,255,255,0.55)"; }}
    >
      {children}
    </div>
  );
  if (ext) return <a href={href} style={{ textDecoration: "none" }}>{inner}</a>;
  return <Link href={href}>{inner}</Link>;
}

export default function PartnerRoomLanding() {
  const [activeEnv, setActiveEnv] = useState(0);
  const { content } = usePartnerContent();
  const landing = content?.landing;

  return (
    <PartnerRoomLayout>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

      {/* ── HERO ── */}
      <div style={{ marginBottom: 80 }}>
        {/* Brand hierarchy strip */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, flexWrap: "wrap" }}>
          {[
            { label: "RTBX Group",  sub: "Parent ecosystem",       dim: true,  blue: false },
            { label: "RTBX Core",   sub: "Signal-to-action engine", dim: false, blue: false },
            { label: "RTBX Travel", sub: "Travel vertical",         dim: false, blue: false },
            { label: "WELBX",       sub: "Guest experience layer",  dim: false, blue: true  },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                padding: "6px 16px",
                background: item.blue ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${item.blue ? "rgba(59,130,246,0.2)" : item.dim ? "rgba(255,255,255,0.05)" : "rgba(201,168,76,0.15)"}`,
                borderRight: "none",
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: item.blue ? "#3b82f6" : item.dim ? "rgba(255,255,255,0.28)" : "#c9a84c" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em", marginTop: 2 }}>{item.sub}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 16, height: 1, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
          {landing?.tagline ?? "Private Strategic Briefing · RTBX Travel"}
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.025em", color: "#fff", lineHeight: 1.06, marginBottom: 24, maxWidth: 820 }}>
          RTBX Travel<br />
          <span style={{ color: "#c9a84c" }}>Partner Room</span>
        </h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 680, marginBottom: 14, fontWeight: 400 }}>
          Real-time guest, operator and service-moment infrastructure — powered by RTBX Core.
        </p>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, maxWidth: 640, marginBottom: 14 }}>
          RTBX Travel turns live signals across hotels, resorts, holiday parks and experience environments into guided action, escalation, assurance and measurable value.
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.6, maxWidth: 560, marginBottom: 44, letterSpacing: "0.01em" }}>
          RTBX Travel is powered by RTBX Core. WELBX is the guest-facing experience layer.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/partner-room/dual-view-demo">
            <div style={{
              padding: "14px 28px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", background: "#c9a84c", color: "#080c14", border: "1px solid #c9a84c", transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}
            >
              Open Dual View Demo
            </div>
          </Link>
          <GhostBtn href="/story">Operator Story Lab</GhostBtn>
          <GhostBtn href="/partner-room/demo-paths">Demo Room</GhostBtn>
          <GhostBtn href="mailto:lance@rtbx.com.au?subject=RTBX Travel Partner Briefing" ext>Request Briefing</GhostBtn>
        </div>
      </div>

      {/* ── WHAT IT IS / IS NOT ── */}
      <div style={{ marginBottom: 72 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <div style={{ padding: "32px 28px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>This is not</div>
            {THIS_IS_NOT.map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 14, height: 1, background: "rgba(239,68,68,0.35)", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.36)" }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "32px 28px", background: "rgba(201,168,76,0.025)", border: "1px solid rgba(201,168,76,0.1)", borderLeft: "2px solid rgba(201,168,76,0.35)" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.16em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>This is</div>
            {THIS_IS.map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 14, height: 1, background: "rgba(201,168,76,0.5)", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.68)", fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RTBX CORE OPERATING CHAIN ── */}
      <div style={{ marginBottom: 88 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
          The RTBX Core Operating Chain
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2 }}>
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} style={{
              padding: "20px 16px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: i === 0 ? "2px solid #c9a84c" : undefined,
              position: "relative",
            }}>
              <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(201,168,76,0.45)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{step.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{step.desc}</div>
              {i < FLOW_STEPS.length - 1 && (
                <div style={{ position: "absolute", right: -7, top: "50%", transform: "translateY(-50%)", width: 12, height: 1, background: "rgba(201,168,76,0.25)", zIndex: 1 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 11 SECTION PORTAL CARDS ── */}
      <div style={{ marginBottom: 96 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
          Partner Room · Navigation
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", marginBottom: 8 }}>
          Eleven sections. One portal.
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, maxWidth: 580, marginBottom: 40 }}>
          Each section is a structured entry point into the RTBX Travel platform. Start with the one that fits your context — all routes remain active.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {PORTAL_SECTIONS.map(sec => (
            <div key={sec.num} style={{
              padding: "28px 26px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: `2px solid ${sec.color}`,
              display: "flex",
              flexDirection: "column",
            }}>
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: `${sec.color}50`, letterSpacing: "0.08em" }}>{sec.num}</span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: sec.color }}>{sec.label}</span>
              </div>

              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, marginBottom: 18, flex: 1 }}>
                {sec.desc}
              </p>

              {/* Sub-links */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 20 }}>
                {sec.links.map((link, j) => {
                  const inner = (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 11,
                      color: (link as any).blue ? "rgba(59,130,246,0.75)" : "rgba(255,255,255,0.42)",
                      cursor: "pointer",
                      transition: "color 0.12s",
                      padding: "3px 0",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = (link as any).blue ? "#3b82f6" : "rgba(255,255,255,0.85)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = (link as any).blue ? "rgba(59,130,246,0.75)" : "rgba(255,255,255,0.42)"; }}
                    >
                      <div style={{ width: 12, height: 1, background: (link as any).blue ? "rgba(59,130,246,0.4)" : `${sec.color}35`, flexShrink: 0 }} />
                      {link.label}
                    </div>
                  );
                  return (link as any).ext
                    ? <a key={j} href={link.href} style={{ textDecoration: "none" }}>{inner}</a>
                    : <Link key={j} href={link.href}>{inner}</Link>;
                })}
              </div>

              {/* CTA */}
              {(sec as any).ctaExt ? (
                <a href={sec.ctaHref} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "10px 0", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: sec.color, border: `1px solid ${sec.color}40`,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${sec.color}12`; el.style.borderColor = `${sec.color}80`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${sec.color}40`; }}
                  >
                    {sec.cta} →
                  </div>
                </a>
              ) : (
                <Link href={sec.ctaHref}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "10px 0", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: sec.color, border: `1px solid ${sec.color}40`,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${sec.color}12`; el.style.borderColor = `${sec.color}80`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${sec.color}40`; }}
                  >
                    {sec.cta} →
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── OPERATING ENVIRONMENTS (tabbed) ── */}
      <div id="environments" style={{ marginBottom: 96 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
          RTBX Travel · Deployment Environments
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10, maxWidth: 680 }}>
          Five deployment environments. One operating system.
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 620, marginBottom: 32 }}>
          RTBX Core applies the same signal-to-action infrastructure across every environment. The context changes — the execution logic remains the same.
        </p>

        {/* Tab strip */}
        <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
          {DEPLOYMENT_ENVS.map((env, i) => (
            <button
              key={env.id}
              onClick={() => setActiveEnv(i)}
              style={{
                flex: 1, padding: "13px 10px",
                background: i === activeEnv ? `${env.color}10` : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === activeEnv ? env.color + "40" : "rgba(255,255,255,0.06)"}`,
                borderBottom: i === activeEnv ? `2px solid ${env.color}` : "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer", textAlign: "center", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (i !== activeEnv) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; } }}
              onMouseLeave={e => { if (i !== activeEnv) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.02)"; } }}
            >
              <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: i === activeEnv ? env.color : "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
                {env.title}
              </div>
            </button>
          ))}
        </div>

        {(() => {
          const env = DEPLOYMENT_ENVS[activeEnv];
          return (
            <div style={{ padding: "32px 32px", background: `${env.color}05`, border: `1px solid ${env.color}20`, borderTop: "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, marginBottom: 28 }}>
                <div>
                  <div style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Focus</div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, marginBottom: 20 }}>{env.focus}</p>
                  <div style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Action Pathway</div>
                  <div style={{ fontSize: 12, color: env.color, fontWeight: 600 }}>{env.pathway}</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Signal Examples</div>
                  {env.signals.map((sig, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                      <div style={{ width: 14, height: 1, background: `${env.color}45`, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.48)" }}>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                {[
                  { label: "Operator Value",       value: env.operatorValue,       color: "#c9a84c" },
                  { label: "Guest Value",           value: env.guestValue,          color: "#10b981" },
                  { label: "Partner Opportunity",   value: env.partnerOpportunity,  color: "#3b82f6" },
                ].map(block => (
                  <div key={block.label} style={{ padding: "18px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderTop: `2px solid ${block.color}` }}>
                    <div style={{ fontSize: 8, letterSpacing: "0.14em", color: block.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{block.label}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.48)", lineHeight: 1.6 }}>{block.value}</div>
                  </div>
                ))}
              </div>
              {env.demoLink && (
                <div style={{ marginTop: 20 }}>
                  <Link href={env.demoLink}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px",
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                      cursor: "pointer", background: env.color, color: "#080c14", transition: "opacity 0.15s",
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

      {/* ── PARTNER PATHS ── */}
      <div id="partner-paths" style={{ marginBottom: 72 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 28 }}>
          Choose your entry point
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {[
            { sub: "FOR OPERATORS", title: "Operator / Hotel Group", desc: "Service recovery, staff consistency, escalation visibility and measurable operational execution.", cta: "Operator Brief", href: "/partner-room/operator-brief", color: "#c9a84c" },
            { sub: "FOR TECHNOLOGY PARTNERS", title: "Integration Partner", desc: "Connect PMS, CRM, POS, workforce and loyalty systems as live RTBX Core signal sources.", cta: "Integration Brief", href: "/partner-room/integration-brief", color: "#3b82f6" },
            { sub: "FOR COMMERCIAL PARTNERS", title: "Commercial Partner", desc: "Activate moments where guest need, commercial intent and operational timing create value.", cta: "Moments Economy", href: "/partner-room/moments-economy", color: "#a78bfa" },
            { sub: "FOR STRATEGIC PARTNERS", title: "Strategic / Funding Partner", desc: "Category opportunity, pilot validation model, commercial expansion and infrastructure position.", cta: "Commercial Model", href: "/partner-room/commercial-model", color: "#22d3ee" },
          ].map(card => (
            <div key={card.title} style={{
              padding: "32px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderTop: `2px solid ${card.color}`, display: "flex", flexDirection: "column",
            }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.2em", color: card.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{card.sub}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14, lineHeight: 1.3, flex: 1 }}>{card.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, marginBottom: 22 }}>{card.desc}</div>
              <Link href={card.href}>
                <div style={{
                  fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: card.color, cursor: "pointer", transition: "opacity 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.65"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  {card.cta} →
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROOF BANNER ── */}
      <PartnerProofBanner />

      {/* ── FOOTER CTA ── */}
      <div style={{
        padding: "44px 40px",
        background: "rgba(201,168,76,0.04)",
        border: "1px solid rgba(201,168,76,0.12)",
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(201,168,76,0.6)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Next Step
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            Ready to map this to your environment?
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/partner-room/dual-view-demo">
            <div style={{
              padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", background: "#c9a84c", color: "#080c14", border: "1px solid #c9a84c", transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}
            >
              Open Dual View Demo
            </div>
          </Link>
          <GhostBtn href="/story">Operator Story Lab</GhostBtn>
          <GhostBtn href="/partner-room/pilot-model">Pilot Model</GhostBtn>
          <GhostBtn href="mailto:lance@rtbx.com.au?subject=RTBX Travel Partner Briefing" ext>Request Partner Briefing</GhostBtn>
        </div>
      </div>

    </div>
    </PartnerRoomLayout>
  );
}
