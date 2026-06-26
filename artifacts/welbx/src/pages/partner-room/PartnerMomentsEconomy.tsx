import { useState } from "react";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { PartnerCTAFooter } from "@/components/PartnerCTAFooter";
import { usePartnerContent } from "@/context/PartnerContentContext";

interface Moment {
  id: string;
  title: string;
  icon: string;
  color: string;
  signal: string;
  classification: string;
  action: string;
  value: string;
  assurance: string;
}

const MOMENTS: Moment[] = [
  {
    id: "arrival-friction",
    title: "Arrival Friction",
    icon: "◎",
    color: "#c9a84c",
    signal: "Early arrival + PMS room not ready + loyalty tier active + front desk load elevated",
    classification: "HIGH_RISK_ARRIVAL — service recovery window active, loyalty protection threshold applied",
    action: "Proactive check-in message delivered. Lounge access activated. Housekeeping escalated. Manager visibility set.",
    value: "Arrival sentiment protected. Review risk reduced. Loyalty moment delivered before complaint required.",
    assurance: "Arrival support record created. Escalation timer evidenced. Guest response logged. Resolution confirmed.",
  },
  {
    id: "room-readiness",
    title: "Room Readiness Delay",
    icon: "◈",
    color: "#f97316",
    signal: "Room readiness delay confirmed (>20 min) + guest ETA <15 min + loyalty flag + housekeeping load high",
    classification: "ROOM_DELAY_RISK — escalation threshold set based on loyalty tier and delay duration",
    action: "Guest notified proactively with timing + options. Housekeeping reprioritised. Manager timer started.",
    value: "Complaint prevented. Recovery pathway active. Escalation evidenced and managed. Review risk reduced.",
    assurance: "Delay record created. Timer logged. Housekeeping action evidenced. Guest outcome confirmed.",
  },
  {
    id: "guest-welfare",
    title: "Guest Welfare Flag",
    icon: "◍",
    color: "#a78bfa",
    signal: "App access at unusual hour + solo traveller profile + support behaviour pattern + quiet preference flag",
    classification: "WELFARE_SIGNAL — privacy-safe model applied, escalation threshold tiered by confidence score",
    action: "Discreet support pathway activated. Appropriate staff member notified with care guidance. Manager on standby.",
    value: "Duty-of-care obligation met. Guest supported without intrusion. Evidence trail created for audit.",
    assurance: "Welfare action logged with timestamp. Staff response recorded. Outcome noted. Escalation path documented.",
  },
  {
    id: "service-recovery",
    title: "Service Recovery",
    icon: "◉",
    color: "#10b981",
    signal: "Unresolved room issue >30 min + guest loyalty tier active + no staff action logged + repeat contact signal",
    classification: "ESCALATION_RISK — service failure window open, ownership required within SLA threshold",
    action: "Owner assigned. 5-minute resolution timer started. Manager alert queued. Full context packaged for handover.",
    value: "Escalation pathway active. Ownership assigned and tracked. Recovery evidenced. Negative review risk sharply reduced.",
    assurance: "Service failure record opened. Timer logged. Owner confirmed. Resolution outcome recorded and closed.",
  },
  {
    id: "dining-activation",
    title: "Dining Activation",
    icon: "◇",
    color: "#c9a84c",
    signal: "Dwell window detected + booking data shows free period + guest F&B profile + high-propensity indicator",
    classification: "COMMERCIAL_ACTIVATION — dining upsell moment, personalisation layer applied from loyalty profile",
    action: "Personalised dining prompt delivered. F&B team notified. POS upsell flag activated. Concierge list queued.",
    value: "Revenue opportunity captured. F&B activation logged. Ancillary income created from a managed dwell period.",
    assurance: "Commercial moment record created. Prompt delivery confirmed. F&B response logged. Outcome tracked.",
  },
  {
    id: "local-experience",
    title: "Local Experience Opportunity",
    icon: "◆",
    color: "#3b82f6",
    signal: "Guest time window open + weather clear + activity preference from profile + local partner capacity available",
    classification: "EXPERIENCE_ACTIVATION — marketplace moment, local partner routing triggered based on capacity match",
    action: "Curated local experience options surfaced. Partner pre-notified. Guest preference matched to available offers.",
    value: "Marketplace revenue created. Partner opportunity logged. Guest experience enriched beyond the property.",
    assurance: "Partner activation record created. Guest delivery confirmed. Booking or interest outcome logged.",
  },
  {
    id: "weather-disruption",
    title: "Weather Disruption",
    icon: "◈",
    color: "#22d3ee",
    signal: "Weather API: forecast change + outdoor activity bookings at risk + guest activity preference flags active",
    classification: "EXPERIENCE_RISK — outdoor bookings at risk, proactive recovery window open, indoor alternatives available",
    action: "Alternatives generated from guest profile. Activity partner notified. Indoor capacity checked. Guest updated proactively.",
    value: "Experience recovered before guest faces disruption. Local partner revenue created. Marketplace opportunity logged.",
    assurance: "Weather disruption record opened. Activity partner response confirmed. Indoor alternative delivered. Outcome closed.",
  },
  {
    id: "checkout-sentiment",
    title: "Checkout Sentiment Drop",
    icon: "◍",
    color: "#f97316",
    signal: "Checkout initiated + sentiment signal below threshold + unresolved items in stay record + loyalty tier active",
    classification: "SENTIMENT_RISK — post-stay pathway triggered, recovery offer window open, CRM flag applied",
    action: "Post-stay follow-up queued. Recovery offer personalised. GM briefed. CRM journey activated for this guest.",
    value: "Repeat-stay opportunity preserved. Loyalty tier re-engaged. Negative post-stay outcome risk reduced.",
    assurance: "Checkout sentiment record created. Follow-up delivered. CRM activation logged. Outcome tracked post-stay.",
  },
];

export default function PartnerMomentsEconomy() {
  const [selected, setSelected] = useState<Moment>(MOMENTS[0]);
  const { content } = usePartnerContent();
  const subheadline = content?.momentsEconomy?.subheadline ?? "A property generates dozens of moments every shift where the right action, taken at the right time, changes the outcome for the guest and for the operation. RTBX Core detects, classifies and routes each one — turning the moment economy from a concept into an operational reality.";

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Product Proof · Core Systems
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 20, maxWidth: 680 }}>
            Moment Economy Explorer
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 640 }}>
            {subheadline}
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.6, maxWidth: 500, marginTop: 12 }}>
            Select a moment below to see how RTBX Core detects, classifies, acts and creates evidence.
          </p>
        </div>

        {/* Moment selector grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 2 }}>
          {MOMENTS.map(m => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              style={{
                padding: "18px 18px",
                background: m.id === selected.id ? `${m.color}12` : "rgba(255,255,255,0.02)",
                border: `1px solid ${m.id === selected.id ? m.color + "50" : "rgba(255,255,255,0.07)"}`,
                borderTop: `2px solid ${m.id === selected.id ? m.color : "rgba(255,255,255,0.08)"}`,
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                display: "flex", alignItems: "flex-start", gap: 10,
              }}
              onMouseEnter={e => { if (m.id !== selected.id) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; } }}
              onMouseLeave={e => { if (m.id !== selected.id) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.02)"; } }}
            >
              <span style={{ fontSize: 14, color: m.id === selected.id ? m.color : "rgba(255,255,255,0.25)", flexShrink: 0, marginTop: 1 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: m.id === selected.id ? m.color : "rgba(255,255,255,0.45)", lineHeight: 1.3 }}>
                  {m.title}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div style={{
          padding: "36px 36px",
          background: `${selected.color}06`,
          border: `1px solid ${selected.color}25`,
          borderTop: "none",
          marginBottom: 48,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <span style={{ fontSize: 22, color: selected.color }}>{selected.icon}</span>
            <div>
              <div style={{ fontSize: 8, letterSpacing: "0.16em", color: selected.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
                Moment Selected
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{selected.title}</div>
            </div>
            <div style={{ marginLeft: "auto", padding: "5px 12px", background: `${selected.color}15`, border: `1px solid ${selected.color}40`, fontSize: 8, letterSpacing: "0.18em", color: selected.color, textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap" }}>
              ● ACTIVE
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 2 }}>
            {[
              { label: "Signal Detected", value: selected.signal, color: "#3b82f6" },
              { label: "Risk / Opportunity Classification", value: selected.classification, color: "#a78bfa" },
              { label: "Action Triggered", value: selected.action, color: selected.color },
              { label: "Value Created", value: selected.value, color: "#10b981" },
            ].map(field => (
              <div key={field.label} style={{
                padding: "20px 22px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: field.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
                  {field.label}
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{field.value}</div>
              </div>
            ))}
          </div>
          <div style={{
            padding: "20px 22px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "#22d3ee", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
              Assurance Record Created
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{selected.assurance}</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 48 }}>
          {[
            { num: "8",     label: "Moment categories shown",  sub: "Select any to see the full flow" },
            { num: "247+",  label: "Configured signal inputs",  sub: "Across all moment categories" },
            { num: "<90s",  label: "Target response time",      sub: "Signal to routed action" },
            { num: "100%",  label: "Outcome records created",   sub: "Every moment logged" },
          ].map(stat => (
            <div key={stat.num} style={{
              padding: "28px 24px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: "2px solid rgba(201,168,76,0.3)",
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#c9a84c", marginBottom: 8, letterSpacing: "-0.02em" }}>{stat.num}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <PartnerCTAFooter />
      </div>
    </PartnerRoomLayout>
  );
}
