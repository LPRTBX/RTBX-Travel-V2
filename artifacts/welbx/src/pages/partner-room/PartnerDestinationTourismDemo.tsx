import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const COLOR = "#f97316";

const ROLES = ["Guest / Traveller", "Operator", "Command / Assurance"] as const;
type Role = typeof ROLES[number];

interface FlowStep {
  key: string; label: string; color: string; icon: string;
  summary: string; status: string; detail: string[];
  roles: Record<Role, string>;
}

const FLOW_STEPS: FlowStep[] = [
  {
    key: "signal", label: "Signal", color: "#3b82f6", icon: "◎",
    summary: "Live data received", status: "DETECTED",
    detail: [
      "Transport delay detected — regional coach service 80 min late, 34 guests affected across 6 itineraries",
      "Booking conflict cascade — 3 activity bookings, 2 accommodation arrival windows and 1 ferry connection at risk",
      "Partner response gap — activity provider not yet notified, ferry operator unconfirmed",
      "Weather trigger active — afternoon weather change compounding transport disruption",
      "Guest journey break — 34 guests without updated information, sentiment signal: declining",
    ],
    roles: {
      "Guest / Traveller": "Guests on the delayed coach have not yet received any update. The system has detected the transport delay and is mapping its impact across all affected bookings.",
      "Operator": "Destination ops dashboard: transport delay 80 min + 6 itinerary conflicts + partner gap + weather trigger. Multi-guest impact flag active.",
      "Command / Assurance": "Moment #5560 opened. Signals: transport_delay + booking_conflict + partner_gap + weather_trigger + guest_journey_break. Classification running.",
    },
  },
  {
    key: "classify", label: "Classify", color: "#a78bfa", icon: "◈",
    summary: "Moment identified", status: "CLASSIFIED",
    detail: [
      "DESTINATION_DISRUPTION · Multi-partner · 34 guests · L2 · Cascade risk",
      "Classification confidence: 89% — transport delay confirmed, booking conflicts mapped, partner gap detected",
      "Moment sub-type: itinerary cascade — multiple downstream partners require coordinated notification",
      "Escalation threshold set: 45 min — destination manager alerted if partner coordination fails",
      "Linked playbooks: transport-delay-cascade + itinerary-adjustment + partner-coordination",
    ],
    roles: {
      "Guest / Traveller": "The system has identified this as a multi-guest destination disruption and is coordinating a response across accommodation, activity and transport partners simultaneously.",
      "Operator": "Classification confirmed: multi-partner cascade. Playbooks: 3 activated. Coordination required: activity provider, ferry operator, accommodation. Timer: 45 min.",
      "Command / Assurance": "Moment #5560 | DESTINATION_DISRUPTION | L2 | Guests: 34 | Cascade: 6 itineraries | Partners: 3 | Timer: 45 min | Playbooks: 3 activated",
    },
  },
  {
    key: "decide", label: "Decide", color: "#c9a84c", icon: "◇",
    summary: "Response selected", status: "DECIDED",
    detail: [
      "Itinerary adjustment triggered — rescheduled arrival windows sent to all 3 accommodation partners",
      "Partner notification dispatched — activity provider and ferry operator notified via partner app",
      "Guest communication prepared — updated itinerary sent to all 34 guests via WELBX",
      "Alternative activity offer queued — weather-appropriate indoor options for afternoon slot",
      "Ferry connection: alternative passage identified — 18:30 service, confirmed with operator",
      "Escalation threshold maintained — destination manager on standby if partner response not confirmed in 20 min",
    ],
    roles: {
      "Guest / Traveller": "Guests on the delayed coach receive an updated itinerary via WELBX: new arrival times, alternative activity option and confirmation that all bookings are protected.",
      "Operator": "Action record: itinerary adjustments sent to 3 accommodation partners. Activity provider and ferry notified. Guest comms: 34 sent. Alternative: queued. Timer: 20 min.",
      "Command / Assurance": "Decision record created. Actions queued: 5. Partners contacted: 3. Guest comms: 34. Ferry alternative: confirmed. Escalation: standby at 20 min.",
    },
  },
  {
    key: "execute", label: "Execute", color: "#10b981", icon: "◉",
    summary: "Actions delivered", status: "EXECUTING",
    detail: [
      "Guest WELBX update sent — updated itinerary, revised arrival 16:40, alternative activity offered",
      "Accommodation partners notified — all 3 confirmed adjusted arrival windows by 14:18",
      "Activity provider responded — afternoon session rescheduled to 17:00, capacity confirmed",
      "Ferry operator confirmed — 18:30 passage secured, 34 guest names transferred",
      "Alternative activity offer delivered — indoor experience partner confirmed availability",
      "Destination manager status update sent — coordination in progress, no escalation required yet",
    ],
    roles: {
      "Guest / Traveller": "\"Your journey has been affected by a transport delay. Your updated itinerary is here — your accommodation arrival is moved to 16:40, your activity to 17:00. Your ferry is confirmed at 18:30.\"",
      "Operator": "EXECUTION: Guest comms sent 14:12. Accommodation confirmed 14:18. Activity: rescheduled 17:00. Ferry: secured. Indoor alt: available. Manager: updated. No escalation.",
      "Command / Assurance": "Moment #5560 | STATUS: EXECUTING | Guest comms: 34 delivered | Partners: 3 confirmed | Ferry: secured | Indoor alt: available | Timer: 24 min remaining",
    },
  },
  {
    key: "assure", label: "Assure", color: "#22d3ee", icon: "◍",
    summary: "Outcome confirmed", status: "ASSURED",
    detail: [
      "All 34 guests arrived at accommodation by 16:55 — adjusted window maintained",
      "Activity session completed at 17:00 — all guests attended, no no-shows",
      "Ferry connection secured — 34 guests boarded 18:30 passage, no missed connections",
      "Partner response confirmed — all 3 partners closed their coordination records",
      "Guest sentiment recovered — no complaint signals across all 34 guests, WELBX: positive",
      "Assurance record closed — full multi-partner coordination evidence trail complete",
    ],
    roles: {
      "Guest / Traveller": "Itinerary recovered. Accommodation, activity and ferry all delivered on adjusted schedule. No out-of-pocket costs. Journey intact.",
      "Operator": "RESOLVED: All 34 guests on track. Accommodation: on time. Activity: delivered. Ferry: secured. Sentiment: positive. No complaints. Record: complete.",
      "Command / Assurance": "Moment #5560 | RESOLVED | Guests: 34 | Partners: 3 coordinated | Escalation: prevented | Sentiment: positive | Record: closed",
    },
  },
  {
    key: "value", label: "Value", color: COLOR, icon: "◆",
    summary: "Value captured", status: "RECORDED",
    detail: [
      "Revenue protected — estimated $12,800 across 34 guest itineraries and partner bookings",
      "34 guest journeys preserved — zero missed connections, zero refunds, zero complaints",
      "Partner coordination: 3 operators aligned in 12 min vs typical manual: 45+ min",
      "Escalation prevented — destination manager intervention not required",
      "Destination reputation protected — no social media incident, no formal complaint",
      "Assurance record created — complete multi-partner coordination evidence, destination-level learning",
    ],
    roles: {
      "Guest / Traveller": "Journey protected. No disruption to the itinerary from the guest's perspective. Full value of trip maintained.",
      "Operator": "Value record: Revenue protected $12,800 | Guests: 34 | Partners: 3 coordinated | Escalation: 0 | Coordination time: 12 min guided vs 45 min unguided",
      "Command / Assurance": "Value record #5560 | Protected: $12,800 | Guests: 34 | Partners: 3 | Assurance: complete | Repeatability: multi-partner playbook confirmed",
    },
  },
];

const PROOF_POINTS = [
  { label: "Risk reduced", desc: "34-guest cascade intercepted, no missed connections", color: "#10b981" },
  { label: "Escalation prevented", desc: "Destination manager alert not triggered — 45-min window met", color: "#10b981" },
  { label: "Revenue protected", desc: "$12,800 estimated across 34 guest itineraries", color: COLOR },
  { label: "Staff time saved", desc: "3-partner coordination: 12 min guided vs 45 min average", color: COLOR },
  { label: "Assurance record", desc: "Complete multi-partner coordination evidence trail", color: "#a78bfa" },
  { label: "Experience recovered", desc: "34 guest journeys protected, zero complaints filed", color: "#22d3ee" },
];

export default function PartnerDestinationTourismDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState<Role>("Operator");
  const step = FLOW_STEPS[activeStep];

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 120px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
          <Link href="/partner-room/deployments"><span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"}>Deployments</span></Link>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>›</span>
          <span style={{ fontSize: 10, letterSpacing: "0.14em", color: COLOR, textTransform: "uppercase", fontWeight: 700 }}>Destination & Tourism</span>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: COLOR, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Live Operating Flow · Destination & Tourism Operators</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>
            A transport delay cascades across 34 guest itineraries.<br />
            <span style={{ color: COLOR }}>Three partners coordinated. Zero missed connections.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, maxWidth: 620 }}>A regional coach service is 80 minutes late. Six guest itineraries are at risk across accommodation, activities and a ferry connection. This is how RTBX Core coordinates a multi-partner destination disruption.</p>
        </div>

        <div style={{ padding: "22px 28px", background: `${COLOR}06`, border: `1px solid ${COLOR}18`, borderLeft: `3px solid ${COLOR}60`, marginBottom: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { label: "Environment", value: "Destination operator · Regional tourism network · Multi-partner" },
            { label: "Guest Profile", value: "34 guests · 6 itinerary groups · Mixed travel styles · Ferry connection at risk" },
            { label: "Risk Factors", value: "Transport delay 80 min · 3 partner bookings at risk · Weather compounding · Partner response gap" },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 8, letterSpacing: "0.18em", color: `${COLOR}80`, textTransform: "uppercase", fontWeight: 700, marginBottom: 5 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Operating Flow · Step {activeStep + 1} of {FLOW_STEPS.length}</div>
          <div style={{ display: "flex", gap: 2 }}>
            {FLOW_STEPS.map((s, i) => (
              <button key={s.key} onClick={() => setActiveStep(i)} style={{ flex: 1, padding: "14px 8px", background: i === activeStep ? `${s.color}12` : "rgba(255,255,255,0.02)", border: `1px solid ${i === activeStep ? s.color + "50" : "rgba(255,255,255,0.07)"}`, borderTop: `2px solid ${i === activeStep ? s.color : "transparent"}`, cursor: "pointer", textAlign: "center", transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
                onMouseEnter={e => { if (i !== activeStep) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (i !== activeStep) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
              >
                <span style={{ fontSize: 15, color: i === activeStep ? s.color : "rgba(255,255,255,0.2)" }}>{s.icon}</span>
                <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: i === activeStep ? s.color : "rgba(255,255,255,0.28)" }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "36px 32px", background: `${step.color}06`, border: `1px solid ${step.color}22`, marginBottom: 2, minHeight: 260 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.22em", color: step.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{step.label} · {step.summary}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>{step.detail[0]}</div>
            </div>
            <div style={{ padding: "5px 12px", background: `${step.color}15`, border: `1px solid ${step.color}40`, fontSize: 8, letterSpacing: "0.18em", color: step.color, textTransform: "uppercase", fontWeight: 700, flexShrink: 0 }}>● {step.status}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {step.detail.slice(1).map((line, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "11px 14px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: 18, height: 1, background: `${step.color}50`, flexShrink: 0, marginTop: 8 }} />
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>{line}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
            <button onClick={() => setActiveStep(s => Math.max(0, s - 1))} disabled={activeStep === 0} style={{ padding: "9px 18px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: activeStep === 0 ? "default" : "pointer", background: "transparent", color: activeStep === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)", border: `1px solid ${activeStep === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.15)"}` }}>← Previous</button>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>{FLOW_STEPS.map((s, i) => <button key={s.key} onClick={() => setActiveStep(i)} style={{ width: i === activeStep ? 18 : 5, height: 5, borderRadius: 3, background: i === activeStep ? step.color : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", transition: "all 0.2s", padding: 0 }} />)}</div>
            <button onClick={() => setActiveStep(s => Math.min(FLOW_STEPS.length - 1, s + 1))} disabled={activeStep === FLOW_STEPS.length - 1} style={{ padding: "9px 18px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: activeStep === FLOW_STEPS.length - 1 ? "default" : "pointer", background: activeStep === FLOW_STEPS.length - 1 ? "transparent" : step.color, color: activeStep === FLOW_STEPS.length - 1 ? "rgba(255,255,255,0.15)" : "#080c14", border: `1px solid ${activeStep === FLOW_STEPS.length - 1 ? "rgba(255,255,255,0.06)" : step.color}` }}>Next Step →</button>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 1 }}>
            {ROLES.map(r => <div key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "10px 8px", textAlign: "center", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.12s", background: r === role ? `${COLOR}12` : "rgba(255,255,255,0.02)", border: `1px solid ${r === role ? COLOR + "50" : "rgba(255,255,255,0.06)"}`, borderTop: "none", color: r === role ? COLOR : "rgba(255,255,255,0.3)" }}>{r}</div>)}
          </div>
          <div style={{ padding: "22px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.14em", color: COLOR, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>{role} · {step.label}</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: 0, fontStyle: role === "Guest / Traveller" ? "italic" : "normal" }}>{step.roles[role]}</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>Proof of Value</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {PROOF_POINTS.map((pt, i) => (
              <div key={i} style={{ padding: "18px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${pt.color}` }}>
                <div style={{ width: 18, height: 1, background: `${pt.color}60`, marginBottom: 10 }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.72)", marginBottom: 5 }}>{pt.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{pt.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/partner-room/deployments"><div style={{ padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", transition: "all 0.15s" }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#fff"; el.style.borderColor = "rgba(255,255,255,0.4)"; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "rgba(255,255,255,0.5)"; el.style.borderColor = "rgba(255,255,255,0.15)"; }}>← All Environments</div></Link>
          <Link href="/partner-room/next-step"><div style={{ padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: "#c9a84c", color: "#080c14", border: "1px solid #c9a84c", transition: "all 0.15s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}>Request Briefing →</div></Link>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
