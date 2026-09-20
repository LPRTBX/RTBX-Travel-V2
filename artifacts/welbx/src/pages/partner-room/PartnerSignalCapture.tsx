import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const PIPELINE = [
  { label: "Signal Source",            sub: "Staff · Guest · Operator · API · Environment" },
  { label: "Signal Intake",            sub: "Form · QR · Link · Webhook · Feed" },
  { label: "Moment Classification",    sub: "Type · Risk Level · Urgency · Context" },
  { label: "Decision Spine",           sub: "Playbook selected · Owner assigned · Threshold set" },
  { label: "Recommended Action",        sub: "Draft task · Draft message · Human review" },
  { label: "Communication Draft",       sub: "Illustrative message · Proposed recipient · Proposed timing" },
  { label: "Illustrative Trace",        sub: "Synthetic fields · Modelled timeline · Modelled outcome" },
  { label: "Indicative Value",          sub: "Hypothesis shown · Partner validation required" },
];

const SIGNAL_SOURCES = [
  {
    num: "01",
    label: "Manual Staff Signal Capture",
    color: "#c9a84c",
    explain: "In a future governed pilot, a staff member could enter an operational issue through an approved form or console. The current Working Proof uses fictional manual inputs only.",
    examples: ["Guest complaint", "Room delay", "Unresolved request", "Queue issue", "Guest frustration", "Maintenance problem", "Weather disruption", "Staff overload"],
    matters: "The Working Proof demonstrates rules-based classification and a recommended response; partner validation is still required.",
    mattersColor: "#c9a84c",
  },
  {
    num: "02",
    label: "Guest-Facing Signals",
    color: "#3b82f6",
    explain: "A future guest-facing layer could accept approved QR, web, kiosk or message inputs. The current proof uses synthetic guest inputs and sends nothing.",
    examples: ["My room is not ready", "I need help", "Something is wrong", "I want local activity options", "I am unhappy with my stay", "Post-stay sentiment", "Check-in friction", "Support request"],
    matters: "The simulation illustrates a potential human-facing signal layer without proving a deployed guest channel.",
    mattersColor: "#3b82f6",
    guestExperienceNote: true,
  },
  {
    num: "03",
    label: "PMS / Booking System Signals",
    color: "#a78bfa",
    explain: "With approved future integrations, RTBX could receive permitted fields from PMS and booking systems.",
    examples: ["Arrival time", "Departure time", "Room type", "Room/cabin status", "Loyalty or VIP flag", "Booking notes", "Special requests", "Guest profile", "Reservation changes", "Group or corporate booking context"],
    matters: "This is Planned and depends on partner approval, field mapping, access and validation.",
    mattersColor: "#a78bfa",
    pilotOnly: true,
  },
  {
    num: "04",
    label: "Webhooks and Event Signals",
    color: "#10b981",
    explain: "Where approved platforms support events or webhooks, a future connector could receive scheduled or event-driven updates.",
    examples: ["Reservation changed", "Room/cabin status updated", "Guest message received", "Task completed", "Task overdue", "Booking modified", "Service event triggered"],
    matters: "Planned capability only; no webhook or event connector is active.",
    mattersColor: "#10b981",
    pilotOnly: true,
  },
  {
    num: "05",
    label: "Task / Housekeeping / Maintenance Signals",
    color: "#f97316",
    explain: "These are some of the most valuable operational signals because they connect directly to action.",
    examples: ["Room not ready", "Cleaning delayed", "Maintenance unresolved", "Task overdue", "No owner assigned", "Repeated request", "Staff capacity issue"],
    matters: "The Working Proof models recommendations and thresholds; it does not create staff tasks or operational records.",
    mattersColor: "#f97316",
  },
  {
    num: "06",
    label: "Communications Signals",
    color: "#22d3ee",
    explain: "A future governed deployment could classify permitted communication inputs. The current proof uses fictional messages and deterministic rules.",
    examples: ["Guest message", "Staff update", "Manager note", "Unresolved reply", "Sentiment tag", "Escalation message", "Service recovery follow-up"],
    matters: "The simulation shows message → signal → moment → recommended action. No message is delivered.",
    mattersColor: "#22d3ee",
  },
  {
    num: "07",
    label: "External / Environmental Signals",
    color: "#e879f9",
    explain: "External signals are especially useful in travel, holiday parks and outdoor experiences.",
    examples: ["Weather alert", "Flight delay", "Road disruption", "Event crowding", "Local activity cancellation", "Safety alert", "Partner availability", "Transport disruption"],
    matters: "Synthetic environmental inputs help demonstrate classification and possible recovery or partner recommendations.",
    mattersColor: "#e879f9",
  },
];

const WORKING_PROOF = [
  "Synthetic staff input",
  "Synthetic guest input",
  "Synthetic manager input",
  "Rules classify the input",
  "Action pathway is recommended",
  "Accountable role is illustrated",
  "Guest-message draft is generated",
  "Threshold is modelled",
  "Outcome field is modelled",
  "Local trace is updated",
];

const PLANNED_PILOT = [
  "PMS reservation lookup",
  "Guest profile enrichment",
  "Room/cabin readiness signals",
  "Webhook/event triggers",
  "Task system signals",
  "Guest messaging integration",
  "Weather/API signals",
  "Basic partner marketplace triggers",
];

const NOT_YET = [
  "Fully automated predictive modelling",
  "Reading all systems without integration approval",
  "AI deciding sensitive welfare risk",
  "Live behavioural intelligence across every guest",
  "Universal PMS integration from day one",
];

const DEPLOYMENT_STAGES = [
  {
    num: "01",
    label: "Working Proof",
    color: "#c9a84c",
    desc: "Signals are captured through staff intake, guest QR/link, manager console, mock PMS data and simulated guest messages.",
    goal: "Demonstrate the interface and rules for partner review.",
  },
  {
    num: "02",
    label: "Integration-Assisted Pilot",
    color: "#10b981",
    desc: "Planned connectors could supply approved PMS, booking, readiness, task, messaging and weather fields.",
    goal: "Validate connected workflows and manual-load hypotheses.",
  },
  {
    num: "03",
    label: "Multi-Site Operating Layer",
    color: "#3b82f6",
    desc: "Signals are captured across multiple properties, parks or operator environments.",
    goal: "Validate pattern and consistency hypotheses across sites.",
  },
  {
    num: "04",
    label: "Intelligence Layer",
    color: "#a78bfa",
    desc: "Planned analytics could identify repeated moments, risk windows, response patterns and opportunity hypotheses from governed data.",
    goal: "Evaluate a governed intelligence-layer pathway.",
  },
];

function SignalSourceCard({ source }: { source: typeof SIGNAL_SOURCES[0] }) {
  return (
    <div style={{
      padding: "28px 26px",
      background: `${source.color}06`,
      border: "1px solid rgba(255,255,255,0.06)",
      borderTop: `2px solid ${source.color}`,
      display: "flex", flexDirection: "column",
      position: "relative",
    }}>
      {source.pilotOnly && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "#10b981", border: "1px solid #10b98130", padding: "2px 7px",
        }}>
          Planned
        </div>
      )}
      <div style={{ fontSize: 8, fontWeight: 800, color: `${source.color}40`, letterSpacing: "0.14em", marginBottom: 8 }}>
        {source.num}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 14, lineHeight: 1.3, paddingRight: source.pilotOnly ? 40 : 0 }}>
        {source.label}
        {source.guestExperienceNote && (
          <span style={{ fontSize: 8, fontWeight: 700, color: "#3b82f6", marginLeft: 8, letterSpacing: "0.1em", verticalAlign: "middle" }}>Guest Experience</span>
        )}
      </div>
      <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, marginBottom: 18 }}>
        {source.explain}
      </p>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
          Examples
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {source.examples.map(ex => (
            <span key={ex} style={{
              fontSize: 9.5, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)", padding: "3px 9px",
            }}>
              {ex}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "auto" }}>
        <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>
          Why it matters
        </div>
        <p style={{ fontSize: 11, color: `${source.mattersColor}80`, lineHeight: 1.6, margin: 0 }}>
          {source.matters}
        </p>
      </div>
    </div>
  );
}

export default function PartnerSignalCapture() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/partner-room/product-proof"><span style={{ cursor: "pointer", color: "rgba(255,255,255,0.35)" }}>Product Proof</span></Link>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
          <span>Signal Capture</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14, lineHeight: 1.1 }}>
            How RTBX Travel Captures Signals
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 700, marginBottom: 24 }}>
             The Working Proof uses synthetic signals, deterministic classification rules, recommended responses and an illustrative trace. It has no active partner integrations or dispatch.
          </p>

          {/* Core framing box */}
          <div style={{
            padding: "24px 28px",
            background: "rgba(201,168,76,0.05)",
            border: "1px solid rgba(201,168,76,0.18)",
            borderLeft: "3px solid #c9a84c",
            maxWidth: 760,
            marginBottom: 20,
          }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: "0 0 12px 0" }}>
              <strong style={{ color: "#c9a84c" }}>Working Proof boundary:</strong> all inputs, owners, actions, messages, evidence, outcomes and value on this page are synthetic, drafted, illustrative or modelled. Current classification is rules-based. Nothing is dispatched or written to a partner system, and named people remain accountable.
            </p>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: "#c9a84c", letterSpacing: "-0.01em" }}>
              Current evidence is Simulation, not integration, production operation or measured value.
            </div>
          </div>

          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.32)", lineHeight: 1.7, maxWidth: 680 }}>
            This interface demonstrates how fictional moments can be classified and routed for human review; a pilot must validate real operational usefulness.
          </p>
        </div>

        {/* Signal Pipeline */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section 01</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>The Signal Pipeline</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 640 }}>
            {PIPELINE.map((step, i) => (
              <div key={step.label}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "14px 20px",
                  background: i % 2 === 0 ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderBottom: i < PIPELINE.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ width: 8, height: 8, background: "#c9a84c", flexShrink: 0, opacity: 0.7 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{step.label}</div>
                    <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.28)", letterSpacing: "0.04em" }}>{step.sub}</div>
                  </div>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div style={{ paddingLeft: 23, color: "rgba(201,168,76,0.35)", fontSize: 16, lineHeight: 1 }}>↓</div>
                )}
              </div>
            ))}
          </div>

          {/* Example */}
          <div style={{ marginTop: 40, maxWidth: 760 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
              Synthetic Pipeline Example
            </div>
            <div style={{
              padding: "24px 28px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {[
                { label: "Signal", value: "Housekeeping status + guest arrival timing + sentiment risk", color: "#c9a84c" },
                { label: "Moment", value: "Room readiness delay", color: "#f97316" },
                { label: "Classification", value: "Level 2 arrival recovery moment", color: "#a78bfa" },
                { label: "Recommendation", value: "Draft front desk, housekeeping and guest-support pathway for review", color: "#10b981" },
                { label: "Draft", value: "Illustrative staff, guest and manager messages", color: "#3b82f6" },
                { label: "Trace", value: "Populate synthetic timestamp, owner and modelled action fields", color: "#22d3ee" },
                { label: "Indicative value", value: "Hypothesis: review risk may be reduced · partner validation required", color: "#c9a84c" },
              ].map((row, i, arr) => (
                <div key={row.label}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: row.color, minWidth: 100, paddingTop: 2 }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                      {row.value}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ marginLeft: 114, color: "rgba(255,255,255,0.12)", fontSize: 13, lineHeight: 1.4 }}>↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seven Signal Source Cards */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section 02</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 8 }}>Seven Signal Sources</div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.65, maxWidth: 600, margin: 0 }}>
              Sources marked <span style={{ color: "#10b981", fontWeight: 700 }}>Planned</span> require approved future integration. <span style={{ color: "#3b82f6", fontWeight: 700 }}>Guest Experience</span> identifies a proposed guest-facing channel, not a deployed one.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {SIGNAL_SOURCES.slice(0, 6).map(s => <SignalSourceCard key={s.num} source={s} />)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginTop: 2 }}>
            <SignalSourceCard source={SIGNAL_SOURCES[6]} />
            <div style={{ gridColumn: "2 / 4" }} />
          </div>
        </div>

        {/* Current proof vs planned */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section 03</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>Current Working Proof vs Planned</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {/* Working Proof */}
            <div style={{ padding: "28px 24px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)", borderTop: "2px solid #c9a84c" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 18 }}>
                Working Proof · Simulation
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {WORKING_PROOF.map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, background: "#c9a84c", flexShrink: 0, marginTop: 5, borderRadius: "50%" }} />
                    <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pilot Phase */}
            <div style={{ padding: "28px 24px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)", borderTop: "2px solid #10b981" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#10b981", marginBottom: 18 }}>
                Planned Pilot · Not Integrated
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {PLANNED_PILOT.map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, background: "#10b981", flexShrink: 0, marginTop: 5, borderRadius: "50%" }} />
                    <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Not Yet */}
            <div style={{ padding: "28px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(255,255,255,0.15)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 18 }}>
                Planned · Do Not Present as Current
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {NOT_YET.map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, background: "rgba(255,255,255,0.15)", flexShrink: 0, marginTop: 5, borderRadius: "50%" }} />
                    <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)", lineHeight: 1.4, textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.1)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: 10, color: "rgba(255,255,255,0.2)", lineHeight: 1.6, fontStyle: "italic" }}>
                These require future implementation and evidence. Do not present them as current Working Proof, Integrated or Production capability.
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Path */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section 04</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>The Deployment Path</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {DEPLOYMENT_STAGES.map(stage => (
              <div key={stage.num} style={{
                padding: "28px 22px",
                background: `${stage.color}05`,
                border: "1px solid rgba(255,255,255,0.05)",
                borderTop: `2px solid ${stage.color}`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: 7.5, fontWeight: 800, color: `${stage.color}45`, letterSpacing: "0.14em", marginBottom: 8 }}>
                  Stage {stage.num}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff", marginBottom: 14, lineHeight: 1.3 }}>
                  {stage.label}
                </div>
                <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, flex: 1, marginBottom: 18 }}>
                  {stage.desc}
                </p>
                <div style={{ paddingTop: 14, borderTop: `1px solid ${stage.color}18` }}>
                  <div style={{ fontSize: 7.5, letterSpacing: "0.12em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Goal</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: `${stage.color}90` }}>{stage.goal}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why This Is Credible */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section 05</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>Why This Is Credible</div>
          </div>

          <div style={{
            padding: "32px 36px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            maxWidth: 820,
          }}>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 24 }}>
              RTBX does not need every integration on day one to prove value. The first proof is whether the organisation can capture live moments, classify them, guide action and prove the response. Integrations make the signal layer faster and more automated, but the operating logic can be validated through a push-first pilot.
            </p>
            <div style={{
              paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)",
              fontSize: 13, fontWeight: 700, color: "#c9a84c", lineHeight: 1.5,
            }}>
              RTBX Travel turns captured signals into governed action. The MVP proves the response loop. Integrations make the signal layer more automated over time.
            </div>
          </div>
        </div>

        {/* Related links */}
        <div style={{ paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Related</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { label: "Signals Engine Brief", href: "/partner-room/signals-engine" },
              { label: "Moment Economy Explorer", href: "/partner-room/moments-economy" },
              { label: "Product Proof", href: "/partner-room/product-proof" },
              { label: "Integration Brief", href: "/partner-room/integration-brief" },
              { label: "Brief Library", href: "/partner-room/brief-library" },
              { label: "Pilot Model", href: "/partner-room/pilot-model" },
            ].map(link => (
              <Link key={link.href} href={link.href}>
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)",
                  padding: "8px 14px", cursor: "pointer", transition: "all 0.12s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#c9a84c"; el.style.borderColor = "rgba(201,168,76,0.3)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "rgba(255,255,255,0.35)"; el.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  {link.label} →
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
