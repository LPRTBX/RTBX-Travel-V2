import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const PROOF_MODES = [
  {
    num: "01",
    label: "Scenario Builder",
    color: "#c9a84c",
    desc: "Build a travel scenario and watch RTBX classify, decide, execute and assure.",
    href: "/partner-room/scenario-builder",
    cta: "Open Scenario Builder",
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
    desc: "Adjust assumptions and see indicative value protected, revenue created and staff time saved.",
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
    does: "Captures real-time data from WELBX, PMS, POS, workforce and IoT sources — converts streams into classified moment signals.",
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
    label: "Central Communications Layer",
    tag: "Interactive Demo",
    tagColor: "#10b981",
    href: "/partner-room/comms-demo",
    does: "Routes structured messages to the right recipient at the right time — guest via WELBX, staff via task app, manager via dashboard, command via record.",
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
    href: "/story/operator-deep-dive",
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
      <div style={{ fontSize: 9, fontWeight: 800, color: `${mode.color}45`, letterSpacing: "0.12em", marginBottom: 10 }}>{mode.num}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 14, lineHeight: 1.25 }}>
        {mode.label}
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, flex: 1, marginBottom: 28 }}>
        {mode.desc}
      </p>
      <Link href={mode.href}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "12px 0", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
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
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.78)", lineHeight: 1.35 }}>
          {sys.label}
        </div>
        <div style={{
          fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: sys.tagColor, border: `1px solid ${sys.tagColor}35`, padding: "2px 8px",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {sys.tag}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>What it does</div>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.6, margin: 0 }}>{sys.does}</p>
      </div>

      <div style={{ marginBottom: 20, flex: 1 }}>
        <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>Why it matters</div>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.6, margin: 0 }}>{sys.matters}</p>
      </div>

      <Link href={sys.href}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
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
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Room · Product Proof
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Product Proof
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, maxWidth: 600 }}>
            See RTBX Travel working across live scenarios, role views, communications, decision logic and value proof.
          </p>
        </div>

        {/* Live MVP Preview — featured above proof modes */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
            Working Product Preview
          </div>
          <a href="https://replit.com/@LP1313/rtbx-travel-moment-response-mvp" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{
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
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c9a84c" }}>Live MVP Preview</span>
                  </div>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px 8px" }}>Working Product</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 8 }}>
                  RTBX Travel — Moment Response MVP
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 720, margin: "0 0 8px 0" }}>
                  This MVP shows the first RTBX Travel product loop: a staff, guest or operator signal is captured, converted into a classified moment, assigned to the right person, supported with a guest-facing WELBX message, escalated if required, logged for assurance and reported as pilot evidence.
                </p>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", fontStyle: "italic" }}>
                  The Partner Room explains the RTBX Travel model. The Live MVP Preview shows the first working product loop. This is not the full Travel OS — it is the first deployable wedge: Moment Response.
                </div>
              </div>
              <div style={{
                padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.4)",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                Open Live MVP ↗
              </div>
            </div>
          </a>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.05)", marginTop: 36 }} />
        </div>

        {/* Section 1: Choose a Proof Mode */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
              Section 01
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
              Choose a Proof Mode
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {PROOF_MODES.map(mode => <ProofModeCard key={mode.num} mode={mode} />)}
          </div>
        </div>

        {/* Section 2: Core Systems Preview */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
              Section 02
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>
              Core Systems Preview
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.32)", lineHeight: 1.65, maxWidth: 580, margin: 0 }}>
              RTBX Core is made up of reusable system layers that turn signals into action, assurance and value.
            </p>
          </div>
          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.05)", margin: "24px 0" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {CORE_SYSTEMS.map(sys => <SystemCard key={sys.label} sys={sys} />)}
          </div>
        </div>

        {/* Section 3: Additional Walkthroughs */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
              Section 03
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "-0.01em" }}>
              Additional Walkthroughs
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {WALKTHROUGHS.map(w => (
              <div key={w.label} style={{
                padding: "20px 20px",
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.05)",
                display: "flex", flexDirection: "column",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)"; }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 10, lineHeight: 1.3 }}>
                  {w.label}
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                  {w.desc}
                </p>
                <Link href={w.href}>
                  <div style={{
                    fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)", cursor: "pointer", transition: "color 0.12s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}
                  >
                    {w.cta} →
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
