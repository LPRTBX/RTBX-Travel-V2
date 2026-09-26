import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const TYPE_COLORS: Record<string, string> = {
  Interactive: "#10b981",
  Simulation: "#a8dedb",
  Walkthrough: "#3b82f6",
  Briefing: "#a78bfa",
};

export default function PartnerValidation() {
  return (
    <PartnerRoomLayout>
      <div className="rtbx-responsive-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Room · Validation
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Validation & Operator Stories
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 640 }}>
            Scenario validation, shadow pilot mode, operator walkthroughs and the full guest story from signal to outcome.
            Use interactive labs to test the system, or structured walkthroughs to build confidence before a pilot.
          </p>

          {/* Type legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Working Proof */}
        <div style={{ marginBottom: 24 }}>
          <Link href="/partner-room/guest-demo">
            <div className="rtbx-responsive-split" style={{
              padding: "24px 32px",
              background: "rgba(168,222,219,0.05)",
              border: "1px solid rgba(168,222,219,0.22)",
              borderTop: "2px solid #a8dedb",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32,
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(168,222,219,0.09)"; el.style.borderColor = "rgba(168,222,219,0.4)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(168,222,219,0.05)"; el.style.borderColor = "rgba(168,222,219,0.22)"; }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a8dedb" }} />
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#a8dedb" }}>Working Proof</span>
                  </div>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px 8px" }}>Simulation</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 6 }}>Moment Response MVP</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, maxWidth: 620, margin: 0 }}>
                  Explore the push-first workflow with synthetic inputs before integrations are added. The interface demonstrates capture, classification, assignment, drafted communication, escalation and evidence logging; it does not dispatch real actions.
                </p>
              </div>
              <div className="rtbx-responsive-cta" style={{
                padding: "10px 22px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "#a8dedb", border: "1px solid rgba(168,222,219,0.4)",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                 Open Working Proof →
              </div>
            </div>
          </Link>
        </div>

        {/* Validation Replay — featured */}
         <div className="rtbx-responsive-split" style={{ marginBottom: 48, padding: "32px 32px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderTop: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", padding: "3px 10px" }}>Interactive · Replay</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Featured Demo</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>Validation Replay Lab</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 560, margin: 0 }}>
              Play the same scenario in Normal, Escalation or Failure mode — watch how JALDO Core responds at every stage and see what changes when things go wrong.
            </p>
          </div>
          <Link href="/partner-room/validation-replay">
            <div className="rtbx-responsive-cta" style={{
              padding: "12px 28px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#10b981", border: "1px solid rgba(16,185,129,0.4)",
              cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              Open Replay Lab →
            </div>
          </Link>
        </div>

        {/* 8-Category Validation Map */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Validation Map — Eight Categories
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 28 }}>
            What Is Proven, What Requires a Pilot
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              {
                num: "01", label: "Working Proof", color: "#10b981",
                desc: "Features you can interact with now in this Partner Room environment.",
                items: ["Validation Replay Lab (Connect → Learn replay)", "Moment Economy Explorer (8 moment types)", "Central Comms OS Routing Demo", "Decision Spine Interactive Demo", "Operator View Console", "Guest Journey Demo", "Dual View Orchestration Demo"],
              },
              {
                num: "02", label: "Simulation", color: "#3b82f6",
                desc: "Demonstrations using realistic but synthesised data — not live property data.",
                items: ["All scenario replays use representative guest profiles and synthesised signals", "Moment outcomes are illustrative — not drawn from a live property", "Comms demo messages are simulated deliveries"],
              },
              {
                num: "03", label: "Planned", color: "#a8dedb",
                desc: "Components fully specified and modelled but not yet live-integrated.",
                items: ["JALDO Integration Hub (connection model specified)", "Travel Governance Sources (11 canonical policies defined)", "Evidence Ledger schema (structure and fields defined)", "Travel Signal Registry taxonomy (30+ classified types defined)", "Decision Spine chain (10-step governance model complete)"],
              },
              {
                num: "04", label: "Planned", color: "#f97316",
                desc: "Systems that appear in the architecture but are not currently connected.",
                items: ["PMS (no live arrival manifest feed)", "POS / Revenue Management System", "IoT and building management sensors", "Booking engine", "Maintenance and work-order systems"],
              },
              {
                num: "05", label: "Planned", color: "#a78bfa",
                desc: "Capabilities that need a live property to validate at real signal volume and governance conditions.",
                items: ["Real signal ingestion from connected property systems", "Live governance gating with actual compensation thresholds", "Real playbook execution with named staff role owners", "Outcome recording from actual guest interactions", "Learning cycle running on real resolved moment history"],
              },
              {
                num: "06", label: "Planned", color: "#22d3ee",
                desc: "Capabilities requiring full engineering build beyond the current prototype.",
                items: ["Persistent webhook integration to live source systems", "Persistent data layer (moment records, evidence ledger, outcome history)", "Live role routing to real staff devices and communication channels", "Multi-property portfolio dashboard with live data", "Automated escalation timers connected to real operations"],
              },
              {
                num: "07", label: "Working Proof", color: "#10b981",
                desc: "Components reviewed against governance and compliance requirements in the architecture.",
                items: ["Decision Spine logic reviewed against human-approval requirements", "Compensation Approval Matrix — role authority levels specified", "Critical Incident Procedure — escalation path defined", "Privacy & Consent Rules — data handling boundaries defined", "AI boundary — what AI may and may not do, explicitly specified"],
              },
              {
                num: "08", label: "Planned", color: "#a8dedb",
                desc: "What the evidence trail would contain in a live production deployment.",
                items: ["Moment record: signal cluster, classification, risk level, value at stake", "Governance decision: source applied, rule, threshold, permission granted", "Action log: role owner, channel, message/instruction, timestamp", "Outcome log: resolution type, guest response, value attributed", "Learning signal: playbook performance, detection accuracy update"],
              },
            ].map(cat => (
              <div key={cat.num} style={{ border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${cat.color}`, padding: "22px 24px", background: "rgba(255,255,255,0.015)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: `${cat.color}60`, letterSpacing: "0.1em", paddingTop: 2, flexShrink: 0 }}>{cat.num}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: cat.color, marginBottom: 4, letterSpacing: "0.02em" }}>{cat.label}</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 12 }}>{cat.desc}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {cat.items.map(item => (
                        <div key={item} style={{ padding: "4px 10px", fontSize: 10.5, color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
