import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981" };

const WORKING_PROOF_PATH = "/partner-room/guest-demo";

const SECTIONS = [
  {
    label: "Working Proof",
    tag: "Simulation",
    tagColor: "#c9a84c",
    desc: "The first interactive RTBX Travel product loop, demonstrated with synthetic inputs and no connected dispatch.",
    items: [
      { label: "RTBX Travel Moment Response", desc: "A synthetic signal is captured → classified → assigned to a named owner → a guest-facing message is drafted → escalation and assurance logging are demonstrated.", href: WORKING_PROOF_PATH, cta: "Open Working Proof", color: "#c9a84c", ext: false },
    ],
  },
  {
    label: "Demo Pathways",
    tag: "Deployment Timeline",
    tagColor: "#a78bfa",
    desc: "Three views across the RTBX Travel pathway — the current Working Proof and Planned pilot and Stage 3 states.",
    items: [
      { label: "Moment Response Working Proof", desc: "Interactive, synthetic capture, classification, assignment, drafted communication, escalation and assurance logging.", href: WORKING_PROOF_PATH, cta: "Open Working Proof", color: "#c9a84c", ext: false },
      { label: "Integration-Assisted Pilot Preview", desc: "How the Moment Response workflow becomes faster and more automated when PMS, task, messaging, weather and marketplace integrations are approved and connected.", href: "/partner-room/product-proof/pilot-expansion-preview", cta: "View Pilot Expansion", color: "#10b981" },
      { label: "Stage 3 Operating Layer Preview", desc: "Multi-site signal visibility, pattern insights, action routing, assurance reporting, value proof and marketplace activation. What RTBX Travel becomes at scale.", href: "/partner-room/product-proof/stage-3-operating-layer", cta: "View Stage 3 Preview", color: "#a78bfa" },
    ],
  },
  {
    label: "Product Proof Demos",
    tag: "Interactive",
    tagColor: "#c9a84c",
    desc: "Core interactive demos — each one shows Working Proof or Simulation behavior, not a connected production capability.",
    items: [
      { label: "Scenario Builder", desc: "Choose environment, scenario, risk level and role. Step through full Signal → Classify → Decide → Execute → Assure → Value flow.", href: "/partner-room/scenario-builder", cta: "Open Builder", color: "#c9a84c" },
      { label: "Dual View Demo", desc: "Same simulated moment seen from guest, operator and command layer through synchronised perspectives.", href: "/partner-room/dual-view-demo", cta: "Open Dual View", color: "#3b82f6" },
      { label: "Communications Routing Demo", desc: "Select a scenario — watch RTBX Core route the right message to the right person across the right channel.", href: "/partner-room/comms-demo", cta: "Open Demo", color: "#10b981" },
      { label: "Decision Spine Demo", desc: "Toggle synthetic inputs and watch the illustrative classification, decision, intervention and assurance path update immediately.", href: "/partner-room/decision-spine", cta: "Open Demo", color: "#f97316" },
      { label: "Proof of Value Calculator", desc: "Adjust property size, environment type and signal volume. Get an indicative monthly value estimate.", href: "/partner-room/proof-calculator", cta: "Open Calculator", color: "#22d3ee" },
    ],
  },
  {
    label: "Deployment Scenario Demos",
    tag: "Scenarios",
    tagColor: "#10b981",
    desc: "One fictional scenario per deployment environment — from synthetic signal to modelled outcome and indicative value.",
    items: [
      { label: "Hotels & Resorts Demo", desc: "High-value guest, early arrival, room delay 35 min. Full Signal → Classify → Decide → Execute → Assure → Value cycle.", href: "/partner-room/deployments/hotels-resorts/demo", cta: "Run Scenario", color: "#c9a84c" },
      { label: "Holiday Parks & Outdoor Demo", desc: "Family arrival after a long drive. Cabin not ready, children unsettled. Weather change. Full recovery cycle.", href: "/partner-room/holiday-park-demo", cta: "Run Scenario", color: "#10b981" },
      { label: "Corporate Travel Demo", desc: "Business traveller, duty-of-care flag, back-to-back meetings. Silent intervention pathway.", href: "/partner-room/deployments/corporate-travel/demo", cta: "Run Scenario", color: "#3b82f6" },
      { label: "Events & Venues Demo", desc: "Crowd flow anomaly, catering shortfall, 40 minutes to program. Simulated staff-coordination pathway.", href: "/partner-room/deployments/events-venues/demo", cta: "Run Scenario", color: "#a78bfa" },
      { label: "Destination & Tourism Demo", desc: "34 guests, transport delay 80 min, 3-partner cascade. Itinerary recovery across the destination.", href: "/partner-room/deployments/destination-tourism/demo", cta: "Run Scenario", color: "#22d3ee" },
    ],
  },
  {
    label: "Guest & Operator Experience",
    tag: "Journey Demos",
    tagColor: "#a78bfa",
    desc: "See what each stakeholder sees — guest, operator, manager. Role-based journey walkthroughs.",
    items: [
      { label: "Interactive Guest Story", desc: "Seven simulated guest-journey stages showing interface states, governed operator prompts and indicative value.", href: "/partner-room/guest-demo", cta: "Start Story", color: "#a78bfa" },
      { label: "Operator Deep Dive Walkthrough", desc: "A simulated operator walkthrough in a fictional hotel context — from synthetic signal to recommended response and illustrative assurance fields.", href: "/story/operator-deep-dive", cta: "Open Walkthrough", color: "#3b82f6" },
    ],
  },
  {
    label: "Validation & Proof",
    tag: "Validation",
    tagColor: "#f97316",
    desc: "Scenario replay, shadow pilot and validation lab — for partners who want to stress-test the system.",
    items: [
      { label: "Validation Lab", desc: "Configure synthetic inputs, run the rules-based simulation and review illustrative outcome fields.", href: "/partner-room/validation", cta: "Open Lab", color: "#10b981" },
      { label: "Scenario Replay Lab", desc: "Replay a fictional scenario step by step — synthetic signal, rules-based classification, recommendation and modelled outcome.", href: "/partner-room/validation-replay", cta: "Run Replay", color: "#f97316" },
    ],
  },
  {
    label: "Core Systems Preview",
    tag: "System Explorers",
    tagColor: "#22d3ee",
    desc: "Interactive and information explorers across the core RTBX Travel operating systems.",
    items: [
      { label: "Moment Economy Explorer", desc: "Select from 8 moment types. See Signal → Risk Classification → Action → Value → Assurance Record for each.", href: "/partner-room/moments-economy", cta: "Open Explorer", color: "#c9a84c" },
      { label: "Signals Engine Brief", desc: "247+ configured signal types across 4 categories. Seven-step classification chain from raw event to moment creation.", href: "/partner-room/signals-engine", cta: "View Brief", color: "#3b82f6" },
      { label: "Decision & Action Layer", desc: "The intervention logic that governs which action is triggered at which threshold across which moment type.", href: "/partner-room/product-proof", cta: "View Layer", color: "#10b981" },
      { label: "Intervention Library", desc: "Pre-configured playbooks for guest recovery, welfare, commercial activation and service response moments.", href: "/partner-room/product-proof", cta: "View Library", color: "#a78bfa" },
      { label: "Execution and Communication Layer", desc: "How RTBX Core routes the right message to guest, staff, manager and command layer per moment type.", href: "/partner-room/comms-demo", cta: "View Layer", color: "#f97316" },
      { label: "Registry & Assurance Layer", desc: "How every moment, action and outcome is logged as an auditable assurance record.", href: "/partner-room/product-proof", cta: "View Registry", color: "#22d3ee" },
    ],
  },
];

export default function TravelDemoLinks() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · Demo Links</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 14, maxWidth: 680 }}>RTBX Travel — Demo Directory</h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, maxWidth: 600, margin: 0 }}>
            Every link opens either the current Working Proof, a Simulation or a clearly labelled Planned preview. Demos use synthetic inputs and do not dispatch actions or prove production outcomes.
          </p>
          <div style={{ marginTop: 14, padding: "10px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", display: "inline-flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
            <span style={{ fontSize: 10, color: C.dim }}>Executive Briefing → Brief Library · Pilot Walkthrough → Commercial · Operator Deep Dive → Validation (if static) or here if interactive</span>
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {SECTIONS.map(section => (
            <div key={section.label}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{section.label}</div>
                  <div style={{ padding: "2px 10px", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: section.tagColor, border: `1px solid ${section.tagColor}35` }}>{section.tag}</div>
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: 0, maxWidth: 640 }}>{section.desc}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: section.items.length >= 5 ? "repeat(3, 1fr)" : "repeat(2, 1fr)", gap: 2 }}>
                {section.items.map(item => (
                  <div key={item.label} style={{ padding: "22px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${item.color}`, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: "-0.01em" }}>{item.label}</div>
                    <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6, flex: 1, marginBottom: 18 }}>{item.desc}</p>
                    {(item as any).ext ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          padding: "10px 0", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                          textTransform: "uppercase", color: item.color, border: `1px solid ${item.color}40`,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${item.color}12`; el.style.borderColor = `${item.color}80`; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${item.color}40`; }}
                        >
                          {item.cta}
                        </div>
                      </a>
                    ) : (
                      <Link href={item.href}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          padding: "10px 0", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                          textTransform: "uppercase", color: item.color, border: `1px solid ${item.color}40`,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${item.color}12`; el.style.borderColor = `${item.color}80`; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${item.color}40`; }}
                        >
                          {item.cta} →
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 56, paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Brief Library", href: "/partner-room/brief-library" },
            { label: "Validation", href: "/partner-room/validation" },
            { label: "Deployments", href: "/partner-room/deployments" },
            { label: "Product Proof", href: "/partner-room/product-proof" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
