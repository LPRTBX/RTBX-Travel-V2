import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { ENGINE_STAGES } from "@/data/rtbxArchitecture";
import {
  travelScenarioExecutionPath,
  travelScenarioPath,
} from "@/lib/travelScenarioRouting";

const PROOF_MODES = [
  {
    num: "01",
    label: "Travel Scenario Library",
    color: "#c9a84c",
    desc: "Inspect one canonical scenario definition, then hand it to configuration or the single Execution Centre runtime.",
    href: travelScenarioPath("repeat-guest-room-not-ready"),
    cta: "Open Scenario Detail",
  },
  {
    num: "02",
    label: "Dual View Demo",
    color: "#3b82f6",
    desc: "See the same moment from the guest, operator, command and partner view.",
    href: "/partner-room/dual-view-demo",
    cta: "Open Dual View",
  },
  {
    num: "03",
    label: "Communications Routing Demo",
    color: "#10b981",
    desc: "Watch RTBX route the right message to the right person at the right time.",
    href: "/partner-room/comms-demo",
    cta: "Open Communications Demo",
  },
  {
    num: "04",
    label: "Proof of Value Calculator",
    color: "#a78bfa",
    desc: "Adjust assumptions and see indicative hypotheses for potential protected value, revenue opportunity and staff time.",
    href: "/partner-room/proof-calculator",
    cta: "Open Calculator",
  },
];

const CORE_SYSTEMS = [
  {
    label: "Moment Economy",
    tag: "Brief",
    tagColor: "#c9a84c",
    href: "/partner-room/moments-economy",
    does: "Categorises every guest interaction into one of ten moment types — from arrival friction to welfare, revenue activation and VIP service.",
    matters: "The moment layer is what turns raw signal data into something a system can act on with a governed, repeatable response.",
  },
  {
    label: "Signals Engine Brief",
    tag: "Brief",
    tagColor: "#c9a84c",
    href: "/partner-room/signals-engine",
    does: "Captures staff, guest and operator-entered signals first, then approved PMS, POS, workforce, messaging and environmental integrations over time — converting captured signals into classified moments.",
    matters: "Without a structured signal layer, operators are reactive. With it, RTBX Core acts before the guest needs to say anything.",
  },
  {
    label: "Signal Capture — How RTBX Collects Signals",
    tag: "Brief",
    tagColor: "#c9a84c",
    href: "/partner-room/product-proof/signal-capture",
    does: "Explains the seven signal sources, the pipeline from intake to assurance log, what is real for MVP vs pilot phase, and the four-stage deployment path.",
    matters: "A partner or funder needs to understand exactly how RTBX captures signals now and why the push-first MVP is a credible first step — not a fake automation claim.",
  },
  {
    label: "Decision Spine Demo",
    tag: "Interactive",
    tagColor: "#f97316",
    href: "/partner-room/decision-spine",
    does: "Matches each classified moment to a governed playbook — selects a decision, assigns an owner and sets an escalation threshold.",
    matters: "Consistent, auditable decisions across every property and shift — no reliance on individual judgement or memory.",
  },
  {
    label: "Intervention Library",
    tag: "Brief",
    tagColor: "#c9a84c",
    href: "/partner-room/signals-engine",
    does: "A library of pre-built and configurable response playbooks — one for every moment category, risk level and deployment environment.",
    matters: "Operators don't need to write protocols from scratch. The library gives them a tested, editable starting point for every scenario.",
  },
  {
    label: "Execution and Communication Layer",
    tag: "Interactive Demo",
    tagColor: "#10b981",
    href: "/partner-room/comms-demo",
    does: "Routes structured messages to the right recipient at the right time — guest via Guest Channel, staff via task app, manager via dashboard, command via record.",
    matters: "The right message to the right person in real time is what separates a resolved moment from an escalated one.",
  },
  {
    label: "Registry & Assurance Layer",
    tag: "Brief",
    tagColor: "#c9a84c",
    href: "/partner-room/signals-engine",
    does: "Logs every resolution with evidence — who actioned it, when, what outcome was reached, and what value was captured.",
    matters: "Operators and funders need proof the system works. The registry creates an auditable record for every moment handled.",
  },
];

const WALKTHROUGHS = [
  {
    label: "Holiday Parks Demo",
    desc: "A full operating scenario inside a holiday park environment.",
    href: "/partner-room/holiday-park-demo",
    cta: "Open Demo",
  },
  {
    label: "Guest Journey Walkthrough",
    desc: "Step through the guest experience from check-in to resolution.",
    href: "/partner-room/guest-demo",
    cta: "View Walkthrough",
  },
  {
    label: "Operator Deep Dive Walkthrough",
    desc: "Detailed operator-level walkthrough from signal detection to resolution.",
    href: "/partner-room/operations",
    cta: "Open Deep Dive",
  },
  {
    label: "Demo Directory",
    desc: "Full directory of all interactive demos and live scenario tools across every deployment environment.",
    href: "/partner-room/resources/travel-demo-links",
    cta: "View Directory",
  },
];

function ProofModeCard({ mode }: { mode: typeof PROOF_MODES[0] }) {
  return (
    <div style={{
      padding: "36px 32px",
      background: `${mode.color}07`,
      border: `1px solid ${mode.color}25`,
      borderTop: `2px solid ${mode.color}`,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: `${mode.color}45`, letterSpacing: "0.1em", marginBottom: 10 }}>{mode.num}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 14, lineHeight: 1.25 }}>
        {mode.label}
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.65, flex: 1, marginBottom: 28 }}>
        {mode.desc}
      </p>
      <Link href={mode.href}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "12px 0", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: mode.color, border: `1px solid ${mode.color}45`,
          cursor: "pointer", transition: "all 0.15s",
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${mode.color}12`; el.style.borderColor = `${mode.color}75`; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${mode.color}45`; }}
        >
          {mode.cta} →
        </div>
      </Link>
    </div>
  );
}

function SystemCard({ sys }: { sys: typeof CORE_SYSTEMS[0] }) {
  return (
    <div style={{
      padding: "26px 24px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      transition: "border-color 0.15s",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.18)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <div className="rtbx-responsive-card-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.78)", lineHeight: 1.35 }}>
          {sys.label}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          color: sys.tagColor, border: `1px solid ${sys.tagColor}35`, padding: "2px 8px",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {sys.tag}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>What it does</div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.6, margin: 0 }}>{sys.does}</p>
      </div>

      <div style={{ marginBottom: 20, flex: 1 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>Why it matters</div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.6, margin: 0 }}>{sys.matters}</p>
      </div>

      <Link href={sys.href}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "#c9a84c", cursor: "pointer", transition: "color 0.12s",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#d4b35e"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#c9a84c"; }}
        >
          View {sys.tag} →
        </div>
      </Link>
    </div>
  );
}

export default function PartnerProductProof() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Room · Product Proof
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14, lineHeight: 1.2 }}>
            Product Proof
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 600 }}>
            Explore the RTBX Travel Working Proof across simulated scenarios, role views, drafted communications, decision logic and indicative value modelling.
          </p>
        </div>

        {/* Honesty statement */}
        <div style={{ padding: "20px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid #c9a84c", marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            What This Proof Shows
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>
            This room demonstrates architecture, interface design, scenario replay and configurable data models. It is not an Integrated or Production system. Each section uses the canonical proof taxonomy so you can distinguish Working Proof and Simulation from Connector-ready, Integrated, Production or Planned capability.
          </p>
        </div>

        {/* Five-Step Proof Structure */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Five-Step Proof Structure
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.25 }}>
            Proof Grouped by Engine Stage
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 600, marginBottom: 32 }}>
            Each section of the Partner Room demonstrates a specific engine stage. Use this map to find the proof relevant to your question.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              {
                stageLabel: "Connect", stageNum: "01",
                items: [
                  { label: "Integration Brief", desc: "Planned system interfaces, integration maturity and responsibility model.", href: "/partner-room/integration-brief", status: "Planned" },
                  { label: "Travel Signal Registry", desc: "Signal taxonomy, source systems, signal-to-moment flow chain.", href: "/partner-room/signals-engine", status: "Working Proof" },
                ],
              },
              {
                stageLabel: "Understand", stageNum: "02",
                items: [
                  { label: "Moment Economy Explorer", desc: "8 moment types with signals, context, classification, OS, playbook and maturity.", href: "/partner-room/moments-economy", status: "Working Proof" },
                  { label: "Travel Intelligence", desc: "Full signal taxonomy, moment taxonomy, governance sources and role model.", href: "/partner-room/travel-intelligence", status: "Working Proof" },
                ],
              },
              {
                stageLabel: "Decide", stageNum: "03",
                items: [
                  { label: "Decision Spine", desc: "10-step decision chain and 4 Travel governance sources with interactive scenario.", href: "/partner-room/decision-spine", status: "Working Proof" },
                  { label: "Operating Model", desc: "Full architecture showing governance, playbook selection and role routing.", href: "/partner-room/operating-model", status: "Planned" },
                ],
              },
              {
                stageLabel: "Act", stageNum: "04",
                items: [
                  { label: "Comms Demo", desc: "Central Comms OS routing: signal to message routing across channels with approval indicators.", href: "/partner-room/comms-demo", status: "Simulation" },
                  { label: "Execution Centre", desc: "The only canonical local runtime for configured scenarios, governed actions and illustrative evidence.", href: travelScenarioExecutionPath("repeat-guest-room-not-ready"), status: "Working Proof" },
                  { label: "Operator Demo", desc: "What the role owner sees: signals, context, decision, action, comms, evidence.", href: "/partner-room/operator-demo", status: "Working Proof" },
                  { label: "Guest Demo", desc: "What the guest experiences as the output of coordinated RTBX action.", href: "/partner-room/guest-demo", status: "Working Proof" },
                ],
              },
              {
                stageLabel: "Learn", stageNum: "05",
                items: [
                  { label: "Validation Replay", desc: "Five-step replay: Connect to Learn, with what entered, interpreted, governed, actioned and learned.", href: "/partner-room/validation-replay", status: "Simulation" },
                  { label: "Product Proof Validation", desc: "8-category validation map using the canonical proof taxonomy.", href: "/partner-room/validation", status: "Working Proof" },
                ],
              },
            ].map(stage => (
              <div key={stage.stageLabel} style={{ border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ padding: "14px 22px", background: "rgba(201,168,76,0.05)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(201,168,76,0.4)", letterSpacing: "0.08em" }}>{stage.stageNum}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c", letterSpacing: "0.04em", textTransform: "uppercase" }}>{stage.stageLabel}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {stage.items.map((item, j) => (
                    <a key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                      <div className="rtbx-responsive-row" style={{
                        display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 16, padding: "16px 22px", alignItems: "center",
                        borderBottom: j < stage.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        background: "rgba(255,255,255,0.01)", transition: "all 0.12s", cursor: "pointer",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.01)"; }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{item.label} →</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>{item.desc}</div>
                        </div>
                        <div style={{
                          fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", textAlign: "right", lineHeight: 1.4, whiteSpace: "nowrap",
                          color: item.status === "Working Proof" ? "#10b981" : item.status === "Simulation" ? "#3b82f6" : "rgba(255,255,255,0.3)",
                        }}>{item.status}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Working Proof — featured above proof modes */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
            Working Proof
          </div>
          <Link href="/partner-room/guest-demo">
             <div className="rtbx-responsive-split" style={{
              padding: "28px 32px",
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.28)",
              borderTop: "2px solid #c9a84c",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32,
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(201,168,76,0.1)"; el.style.borderColor = "rgba(201,168,76,0.45)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(201,168,76,0.06)"; el.style.borderColor = "rgba(201,168,76,0.28)"; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#c9a84c" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9a84c" }}>Working Proof</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px 8px" }}>Simulation</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 8 }}>
                  RTBX Travel — Moment Response MVP
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, maxWidth: 720, margin: "0 0 8px 0" }}>
                   This Working Proof shows the first RTBX Travel product loop with synthetic inputs: capture, classification, assignment, drafted guest communication, escalation, assurance logging and indicative reporting.
                </p>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>
                  The Partner Room explains the RTBX Travel model. This Working Proof demonstrates the interface and governed flow; it does not send communications, activate partners or represent an Integrated or Production deployment.
                </div>
              </div>
               <div className="rtbx-responsive-cta" style={{
                padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.4)",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                Open Working Proof →
              </div>
            </div>
          </Link>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.05)", marginTop: 36 }} />
        </div>

        {/* Section 1: Choose a Proof Mode */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
              Section 01
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
              Choose a Proof Mode
            </div>
          </div>
           <div className="rtbx-responsive-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 2 }}>
            {PROOF_MODES.map(mode => <ProofModeCard key={mode.num} mode={mode} />)}
          </div>
        </div>

        {/* Section 2: Core Systems Preview */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
              Section 02
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>
              Core Systems Preview
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.36)", lineHeight: 1.65, maxWidth: 580, margin: 0 }}>
              RTBX Core is made up of reusable system layers that turn signals into action, assurance and value.
            </p>
          </div>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.05)", margin: "24px 0" }} />
           <div className="rtbx-responsive-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 2 }}>
            {CORE_SYSTEMS.map(sys => <SystemCard key={sys.label} sys={sys} />)}
          </div>
        </div>

        {/* Section 3: Demo Pathways */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
              Section 03
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 8 }}>
              Demo Pathways
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.34)", lineHeight: 1.65, maxWidth: 600, margin: 0 }}>
              Three views of RTBX Travel across the deployment pathway — the current Working Proof, a Planned integration-assisted pilot, and a Planned Stage 3 operating layer.
            </p>
          </div>
           <div className="rtbx-responsive-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 2 }}>
            {/* Card 1: Working Proof */}
            <Link href="/partner-room/guest-demo">
              <div style={{
                padding: "28px 24px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)",
                borderTop: "2px solid #c9a84c", display: "flex", flexDirection: "column", height: "100%",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(201,168,76,0.1)"; el.style.borderColor = "rgba(201,168,76,0.38)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(201,168,76,0.06)"; el.style.borderColor = "rgba(201,168,76,0.2)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", flexShrink: 0 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c" }}>Working Proof</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>Moment Response Working Proof</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, flex: 1, marginBottom: 20 }}>
                  An interactive, synthetic walkthrough of capture, classification, assignment, drafted guest communication, escalation and evidence logging.
                </p>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#c9a84c" }}>Open Working Proof →</div>
              </div>
            </Link>
            {/* Card 2: Pilot Expansion */}
            <Link href="/partner-room/product-proof/pilot-expansion-preview">
              <div style={{
                padding: "28px 24px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)",
                borderTop: "2px solid #10b981", display: "flex", flexDirection: "column", height: "100%",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(16,185,129,0.08)"; el.style.borderColor = "rgba(16,185,129,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(16,185,129,0.04)"; el.style.borderColor = "rgba(16,185,129,0.15)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#10b981" }}>Pilot-Stage Preview</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>Integration-Assisted Pilot Preview</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, flex: 1, marginBottom: 20 }}>
                  How the Moment Response workflow becomes faster and richer when approved integrations are added — PMS, task signals, guest messaging, weather and operator reporting.
                </p>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#10b981" }}>View Pilot Expansion →</div>
              </div>
            </Link>
            {/* Card 3: Stage 3 */}
            <Link href="/partner-room/product-proof/stage-3-operating-layer">
              <div style={{
                padding: "28px 24px", background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.15)",
                borderTop: "2px solid #a78bfa", display: "flex", flexDirection: "column", height: "100%",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(167,139,250,0.08)"; el.style.borderColor = "rgba(167,139,250,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(167,139,250,0.04)"; el.style.borderColor = "rgba(167,139,250,0.15)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", flexShrink: 0 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a78bfa" }}>Future-State Operating Preview</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>Stage 3 Operating Layer Preview</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, flex: 1, marginBottom: 20 }}>
                  Multi-site signal visibility, pattern insights, action routing, assurance reporting, value proof and marketplace activation — once the pilot is validated and integrations are approved.
                </p>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a78bfa" }}>View Stage 3 Preview →</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Section 4: Additional Walkthroughs */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
              Section 04
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "-0.01em" }}>
              Additional Walkthroughs
            </div>
          </div>
           <div className="rtbx-responsive-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 2 }}>
            {WALKTHROUGHS.map(w => (
              <div key={w.label} style={{
                padding: "20px 20px",
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.05)",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.35 }}>{w.label}</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{w.desc}</p>
                <Link href={w.href}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#c9a84c", cursor: "pointer" }}>{w.cta} →</div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
