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
    summary: "Synthetic signal received", status: "DETECTED",
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
      "Illustrative rules match: 89% — synthetic transport delay, booking conflicts and partner gap",
      "Moment sub-type: itinerary cascade — multiple downstream partners require coordinated notification",
      "Escalation threshold set: 45 min — destination manager alerted if partner coordination fails",
      "Linked playbooks: transport-delay-cascade + itinerary-adjustment + partner-coordination",
    ],
    roles: {
      "Guest / Traveller": "Rules classify this synthetic scenario as a multi-guest destination disruption and propose a coordinated response for human review.",
      "Operator": "Rules-based classification: multi-partner cascade. Three proposed playbooks; a named destination operator remains accountable.",
      "Command / Assurance": "SIMULATION #5560 | RULES-BASED CLASSIFICATION | L2 | 34 illustrative guests | Human approval required",
    },
  },
  {
    key: "decide", label: "Decide", color: "#c9a84c", icon: "◇",
    summary: "Response proposed", status: "PROPOSED",
    detail: [
      "Itinerary adjustment proposed — draft arrival windows for 3 accommodation partners",
      "Partner notification draft shown for the activity provider and ferry operator; no external notification dispatched",
      "Guest communication draft prepared for 34 illustrative guests; nothing sent",
      "Alternative activity offer queued — weather-appropriate indoor options for afternoon slot",
      "Ferry alternative modelled — 18:30 option not confirmed with an operator",
      "Proposed escalation rule — human review if partner response is not confirmed in 20 min",
    ],
    roles: {
      "Guest / Traveller": "A draft itinerary shows proposed arrival times, an alternative activity and booking options. No communication or protection is confirmed.",
      "Operator": "Illustrative action record: draft partner and guest communications shown; no external contact or booking update occurs.",
      "Command / Assurance": "Proposed decision record | Draft actions: 5 | No partner or guest contact | Human approval required",
    },
  },
  {
    key: "execute", label: "Execute", color: "#10b981", icon: "◉",
    summary: "Actions modelled", status: "SIMULATED",
    detail: [
      "Guest Channel draft shown — proposed itinerary, 16:40 arrival and alternative activity; nothing sent",
      "Accommodation partner responses modelled — no external notifications or confirmations",
      "Activity session modelled at 17:00 — no capacity confirmation received",
      "Ferry passage modelled at 18:30 — no booking or guest-name transfer made",
      "Alternative activity option shown — availability not externally confirmed",
      "Destination manager update drafted — no status update dispatched",
    ],
    roles: {
      "Guest / Traveller": "DRAFT — \"A transport delay may affect your journey. Proposed options include a 16:40 arrival, 17:00 activity and 18:30 ferry, subject to operator confirmation.\"",
      "Operator": "SIMULATION: Guest draft shown at 14:12. Proposed accommodation, activity, ferry and indoor-alternative states are displayed for manager review; no external action is dispatched.",
      "Command / Assurance": "SIMULATION #5560 | Proposed states only | No external updates | Human operator accountable",
    },
  },
  {
    key: "assure", label: "Assure", color: "#22d3ee", icon: "◍",
    summary: "Outcome modelled", status: "MODELLED",
    detail: [
      "Modelled outcome: 34 illustrative guests could arrive by 16:55",
      "Modelled outcome: a 17:00 activity could preserve the itinerary",
      "Modelled ferry state: an 18:30 passage could reduce missed-connection risk",
      "Partner response state modelled — no external coordination records exist",
      "Illustrative sentiment state — no guest or complaint system is connected",
      "Illustrative assurance record shown — pilot validation is Planned",
    ],
    roles: {
      "Guest / Traveller": "Illustrative outcome only: adjusted accommodation, activity and ferry options with potentially lower disruption.",
      "Operator": "MODELLED: Guest, partner, itinerary, sentiment and complaint outcomes require real pilot evidence.",
      "Command / Assurance": "SIMULATION #5560 | Outcome modelled | No measured partner, sentiment or escalation result",
    },
  },
  {
    key: "value", label: "Value", color: COLOR, icon: "◆",
    summary: "Value modelled", status: "INDICATIVE",
    detail: [
      "Indicative value: A$12,800 assumption across 34 illustrative itineraries; not measured",
      "Potential journey effect — missed connections, refunds and complaints are not verified",
      "Indicative timing: 12 min guided vs 45+ min benchmark; pilot measurement Planned",
      "Potential escalation reduction — not an achieved outcome",
      "Potential reputation effect — no social or complaint systems connected",
      "Illustrative assurance record — evidence collection and learning are Planned",
    ],
    roles: {
      "Guest / Traveller": "Illustrative value state: potentially lower itinerary disruption, subject to partner confirmation.",
      "Operator": "INDICATIVE MODEL: A$12,800 assumption | 34 guests | Coordination timing and escalation require pilot measurement",
      "Command / Assurance": "MODEL #5560 | Indicative value only | No measured revenue, assurance or repeatability outcome",
    },
  },
];

const PROOF_POINTS = [
  { label: "Modelled risk", desc: "Illustrative 34-guest cascade response", color: "#10b981" },
  { label: "Modelled escalation", desc: "Proposed 45-min human review point", color: "#10b981" },
  { label: "Indicative value", desc: "A$12,800 itinerary assumption; not measured", color: COLOR },
  { label: "Planned metric", desc: "Partner coordination timing for pilot evaluation", color: COLOR },
  { label: "Illustrative assurance", desc: "Proposed multi-partner evidence trail", color: "#a78bfa" },
  { label: "Modelled experience", desc: "Potential journey effect; not achieved", color: "#22d3ee" },
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
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: COLOR, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Simulated Operating Flow · Destination & Tourism Operators</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>
            A transport delay cascades across 34 guest itineraries.<br />
            <span style={{ color: COLOR }}>A multi-partner response modelled.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, maxWidth: 620 }}>A synthetic scenario illustrates how JALDO Core could present a rules-based response to an itinerary cascade for accountable human review.</p>
          <div style={{ marginTop: 18, padding: "12px 16px", border: `1px solid ${COLOR}30`, borderLeft: `3px solid ${COLOR}`, fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 760 }}><strong style={{ color: COLOR }}>Working Proof · Simulation boundary:</strong> Classification is rules-based and communications are drafts. No message, task, booking, partner activation, dispatch or external-system update occurs. Humans remain accountable; integrations and pilots are Planned.</div>
        </div>

        <div className="rtbx-grid-3" style={{ padding: "22px 28px", background: `${COLOR}06`, border: `1px solid ${COLOR}18`, borderLeft: `3px solid ${COLOR}60`, marginBottom: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
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
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Simulated Operating Flow · Step {activeStep + 1} of {FLOW_STEPS.length}</div>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {FLOW_STEPS.map((s, i) => (
              <button key={s.key} onClick={() => setActiveStep(i)} style={{ flex: "1 1 70px", minWidth: 0, padding: "14px 8px", background: i === activeStep ? `${s.color}12` : "rgba(255,255,255,0.02)", border: `1px solid ${i === activeStep ? s.color + "50" : "rgba(255,255,255,0.07)"}`, borderTop: `2px solid ${i === activeStep ? s.color : "transparent"}`, cursor: "pointer", textAlign: "center", transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
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
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 18 }}>Modelled Proof of Value</div>
          <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
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
