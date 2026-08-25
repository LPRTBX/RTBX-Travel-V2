import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const PIPELINE = [
  { label: "Signal Source",            sub: "Staff · Guest · Operator · API · Environment" },
  { label: "Signal Intake",            sub: "Form · QR · Link · Webhook · Feed" },
  { label: "Moment Classification",    sub: "Type · Risk Level · Urgency · Context" },
  { label: "Decision Spine",           sub: "Playbook selected · Owner assigned · Threshold set" },
  { label: "Action Pathway",           sub: "Staff notified · Guest supported · Manager alerted" },
  { label: "Communication Routing",    sub: "Right message · Right person · Right time" },
  { label: "Assurance Log",            sub: "Evidence created · Timeline recorded · Outcome noted" },
  { label: "Value Proof",              sub: "Recovery evidenced · Risk reduced · Report updated" },
];

const SIGNAL_SOURCES = [
  {
    num: "01",
    label: "Manual Staff Signal Capture",
    color: "#c9a84c",
    explain: "This is the first real-world signal method. A staff member sees or receives an operational issue and enters it into RTBX through a dashboard form, mobile web form, QR staff link, tablet/front-desk link or manager console.",
    examples: ["Guest complaint", "Room delay", "Unresolved request", "Queue issue", "Guest frustration", "Maintenance problem", "Weather disruption", "Staff overload"],
    matters: "This is enough for MVP because it proves whether RTBX can classify the moment and guide the right response.",
    mattersColor: "#c9a84c",
  },
  {
    num: "02",
    label: "Guest-Facing Signals",
    color: "#3b82f6",
    explain: "Guests can create signals through the WELBX guest-facing experience layer. This can start through QR codes, SMS/web links, in-room QR, tablet/kiosk, email link or guest message prompt. No app download is required.",
    examples: ["My room is not ready", "I need help", "Something is wrong", "I want local activity options", "I am unhappy with my stay", "Post-stay sentiment", "Check-in friction", "Support request"],
    matters: "This gives RTBX a direct human-facing signal layer while keeping WELBX positioned only as the guest-facing experience layer.",
    mattersColor: "#3b82f6",
    welbxNote: true,
  },
  {
    num: "03",
    label: "PMS / Booking System Signals",
    color: "#a78bfa",
    explain: "As integrations are approved, RTBX can receive or read signals from PMS and booking systems.",
    examples: ["Arrival time", "Departure time", "Room type", "Room/cabin status", "Loyalty or VIP flag", "Booking notes", "Special requests", "Guest profile", "Reservation changes", "Group or corporate booking context"],
    matters: "This is not required for the first MVP. It becomes part of the integration-assisted pilot and scale pathway.",
    mattersColor: "#a78bfa",
    pilotOnly: true,
  },
  {
    num: "04",
    label: "Webhooks and Event Signals",
    color: "#10b981",
    explain: "Where platforms support event notifications or webhooks, RTBX can receive real-time or near-real-time updates when operational events occur.",
    examples: ["Reservation changed", "Room/cabin status updated", "Guest message received", "Task completed", "Task overdue", "Booking modified", "Service event triggered"],
    matters: "Real-time or near-real-time where integration access allows.",
    mattersColor: "#10b981",
    pilotOnly: true,
  },
  {
    num: "05",
    label: "Task / Housekeeping / Maintenance Signals",
    color: "#f97316",
    explain: "These are some of the most valuable operational signals because they connect directly to action.",
    examples: ["Room not ready", "Cleaning delayed", "Maintenance unresolved", "Task overdue", "No owner assigned", "Repeated request", "Staff capacity issue"],
    matters: "These signals turn quickly into staff action pathways, escalation thresholds and assurance records.",
    mattersColor: "#f97316",
  },
  {
    num: "06",
    label: "Communications Signals",
    color: "#22d3ee",
    explain: "RTBX can collect and classify signals from guest messages, staff updates, manager notes, unresolved replies, sentiment tags, escalation messages and service recovery follow-ups.",
    examples: ["Guest message", "Staff update", "Manager note", "Unresolved reply", "Sentiment tag", "Escalation message", "Service recovery follow-up"],
    matters: "Message becomes signal → signal becomes moment → moment becomes action. This is where the Execution and Communication Layer becomes real.",
    mattersColor: "#22d3ee",
  },
  {
    num: "07",
    label: "External / Environmental Signals",
    color: "#e879f9",
    explain: "External signals are especially useful in travel, holiday parks and outdoor experiences.",
    examples: ["Weather alert", "Flight delay", "Road disruption", "Event crowding", "Local activity cancellation", "Safety alert", "Partner availability", "Transport disruption"],
    matters: "Environmental signals help RTBX classify disruption, trigger recovery pathways and create marketplace or local partner opportunities.",
    mattersColor: "#e879f9",
  },
];

const MVP_REAL = [
  "Staff enters moment",
  "Guest enters moment",
  "Manager enters moment",
  "System classifies moment",
  "Action pathway is recommended",
  "Owner is assigned",
  "Guest message is generated",
  "Escalation threshold is set",
  "Outcome is logged",
  "Pilot report is updated",
];

const PILOT_REAL = [
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
    label: "Push-First MVP",
    color: "#c9a84c",
    desc: "Signals are captured through staff intake, guest QR/link, manager console, mock PMS data and simulated guest messages.",
    goal: "Prove the workflow.",
  },
  {
    num: "02",
    label: "Integration-Assisted Pilot",
    color: "#10b981",
    desc: "Signals can come from PMS, booking data, room/cabin status, task systems, guest messaging tools and weather APIs.",
    goal: "Prove automation and reduced manual load.",
  },
  {
    num: "03",
    label: "Multi-Site Operating Layer",
    color: "#3b82f6",
    desc: "Signals are captured across multiple properties, parks or operator environments.",
    goal: "Prove patterns, consistency and operator intelligence.",
  },
  {
    num: "04",
    label: "Intelligence Layer",
    color: "#a78bfa",
    desc: "RTBX uses accumulated data to identify repeat moments, high-risk windows, staff response patterns, recovery effectiveness, marketplace opportunities and pattern insights for execution.",
    goal: "Become infrastructure.",
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
          Pilot Phase
        </div>
      )}
      <div style={{ fontSize: 8, fontWeight: 800, color: `${source.color}40`, letterSpacing: "0.14em", marginBottom: 8 }}>
        {source.num}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 14, lineHeight: 1.3, paddingRight: source.pilotOnly ? 40 : 0 }}>
        {source.label}
        {source.welbxNote && (
          <span style={{ fontSize: 8, fontWeight: 700, color: "#3b82f6", marginLeft: 8, letterSpacing: "0.1em", verticalAlign: "middle" }}>WELBX</span>
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
            RTBX Travel starts with captured signals, turns them into classified moments, guides the right response and creates an assurance trail. Early pilots can begin without heavy integration. Integrations make the signal layer more automated over time.
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
              RTBX Travel can start without heavy integration. Early pilots use staff, guest and operator-entered signals to validate the moment-to-action workflow. As partner and operator integrations are approved, RTBX can connect to PMS, task, communications, weather, marketplace and reporting systems to create real-time or near-real-time signal capture.
            </p>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: "#c9a84c", letterSpacing: "-0.01em" }}>
              The first proof is not full automation. The first proof is execution visibility.
            </div>
          </div>

          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.32)", lineHeight: 1.7, maxWidth: 680 }}>
            RTBX proves whether live moments are being captured, classified, assigned, acted on and logged.
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
              Pipeline Example
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
                { label: "Pathway", value: "Trigger front desk + housekeeping + guest support pathway", color: "#10b981" },
                { label: "Communication", value: "Notify staff, guest and manager", color: "#3b82f6" },
                { label: "Log", value: "Record recovery action with timestamp and owner", color: "#22d3ee" },
                { label: "Value", value: "Review risk reduced · Loyalty protected", color: "#c9a84c" },
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
              Sources marked <span style={{ color: "#10b981", fontWeight: 700 }}>Pilot Phase</span> are not required for MVP. Sources marked <span style={{ color: "#3b82f6", fontWeight: 700 }}>WELBX</span> operate through the guest-facing experience layer.
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

        {/* What Is Real Now vs Later */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section 03</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>What Is Real Now vs Later</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {/* MVP Real */}
            <div style={{ padding: "28px 24px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)", borderTop: "2px solid #c9a84c" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 18 }}>
                Real for MVP
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {MVP_REAL.map(item => (
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
                Real for Pilot Phase
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {PILOT_REAL.map(item => (
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
                Not Real Yet — Do Not Oversell
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
                These become real as the platform matures. Do not include them in MVP or pilot conversations.
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
