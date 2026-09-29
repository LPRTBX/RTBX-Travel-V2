import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { PartnerCTAFooter } from "@/components/PartnerCTAFooter";
import { usePartnerContent } from "@/context/PartnerContentContext";

interface Moment {
  id: string;
  title: string;
  icon: string;
  color: string;
  signal: string;
  context: string;
  classification: string;
  os: string;
  decisionReq: string;
  playbook: string;
  maturity: string;
  action: string;
  value: string;
  assurance: string;
}

const MOMENTS: Moment[] = [
  {
    id: "arrival-friction",
    title: "Arrival Friction",
    icon: "◎",
    color: "#a8dedb",
    signal: "Synthetic early-arrival signal + illustrative room-readiness delay + loyalty tier + elevated front-desk load",
    context: "Illustrative loyalty tier, early-arrival window and front-desk load applied",
    classification: "HIGH_RISK_ARRIVAL — synthetic service-recovery window for review",
    os: "Guest Experience OS",
    decisionReq: "A. Morgan, Duty Manager, reviews the proposed lounge action",
    playbook: "Proactive Arrival Recovery Playbook",
    maturity: "Working Proof",
    action: "Guest check-in message drafted only. Lounge access and housekeeping reprioritisation proposed for A. Morgan's approval; no task is issued.",
    value: "Indicative, unmeasured hypothesis: arrival sentiment may improve and review risk may fall. No value is attributed.",
    assurance: "Illustrative record only: draft message, proposed timer and modelled guest outcome; no response or resolution is evidenced.",
  },
  {
    id: "room-readiness",
    title: "Room Readiness Delay",
    icon: "◈",
    color: "#f97316",
    signal: "Synthetic room-readiness delay (>20 min) + guest ETA <15 min + illustrative loyalty flag + high housekeeping load",
    context: "Illustrative loyalty tier, modelled delay and constrained housekeeping capacity applied",
    classification: "ROOM_DELAY_RISK — proposed escalation threshold based on synthetic inputs",
    os: "Service Recovery & Staff Response OS",
    decisionReq: "A. Morgan, Duty Manager, reviews the proposed escalation timer",
    playbook: "Room Delay Recovery Playbook",
    maturity: "Working Proof",
    action: "Guest timing-and-options message drafted only. Housekeeping reprioritisation and a manager timer are proposed; no staff task is issued.",
    value: "Indicative, unmeasured hypothesis: complaint and review risk may fall. No recovery value is attributed.",
    assurance: "Illustrative delay record with a proposed timer, proposed housekeeping action and modelled guest outcome; no execution is evidenced.",
  },
  {
    id: "guest-welfare",
    title: "Guest Welfare Flag",
    icon: "◍",
    color: "#a78bfa",
    signal: "Synthetic unusual-hour access pattern + illustrative solo-traveller profile + support pattern + quiet preference",
    context: "Illustrative privacy-safe model, solo profile and confidence score applied",
    classification: "WELFARE_SIGNAL — proposed review threshold tiered by illustrative confidence",
    os: "Safety & Guest Welfare OS",
    decisionReq: "A. Morgan, Duty Manager, personally decides whether any welfare check is appropriate",
    playbook: "Discreet Welfare Support Playbook",
    maturity: "Working Proof",
    action: "Discreet guest support message drafted only. A welfare review and care guidance are proposed to A. Morgan; no welfare action or staff notification occurs.",
    value: "Indicative, unmeasured hypothesis: discreet support may help duty of care. No welfare outcome or value is claimed.",
    assurance: "Illustrative timestamp, proposed review path and modelled outcome only; no welfare response or action is evidenced.",
  },
  {
    id: "service-recovery",
    title: "Service Recovery",
    icon: "◉",
    color: "#10b981",
    signal: "Synthetic open room issue >30 min + illustrative loyalty tier + no staff action + repeat-contact signal",
    context: "Illustrative open-issue timer, elevated loyalty risk and repeat-contact pattern applied",
    classification: "ESCALATION_RISK — modelled service-failure window with proposed human ownership",
    os: "Service Recovery & Staff Response OS",
    decisionReq: "A. Morgan, Duty Manager, reviews and may accept proposed ownership",
    playbook: "Service Failure Recovery Playbook",
    maturity: "Working Proof",
    action: "Guest recovery message drafted only. Ownership, a five-minute review timer and a manager alert are proposed to A. Morgan; nothing is issued.",
    value: "Indicative, unmeasured hypothesis: proposed ownership may reduce escalation and review risk. No recovery value is attributed.",
    assurance: "Illustrative service-failure record with proposed owner and timer plus a modelled resolution outcome; no action or closure is evidenced.",
  },
  {
    id: "dining-activation",
    title: "Dining Activation",
    icon: "◇",
    color: "#a8dedb",
    signal: "Synthetic dwell window + illustrative free period + guest dining preference + modelled propensity indicator",
    context: "Illustrative dwell window, loyalty profile and propensity score applied",
    classification: "COMMERCIAL_ACTIVATION — proposed dining recommendation for human review",
    os: "Marketplace & Loyalty Activation OS",
    decisionReq: "L. Chen, F&B Manager, reviews the proposed dining recommendation",
    playbook: "Dining Activation Playbook",
    maturity: "Working Proof",
    action: "Personalised guest dining prompt drafted only. F&B review, an illustrative upsell flag and concierge follow-up are proposed; nothing is routed or activated.",
    value: "Indicative, unmeasured revenue hypothesis only. No ancillary income or commercial value is attributed.",
    assurance: "Illustrative commercial record with draft prompt, proposed F&B response and modelled outcome; no guest or staff activity is evidenced.",
  },
  {
    id: "local-experience",
    title: "Local Experience Opportunity",
    icon: "◆",
    color: "#3b82f6",
    signal: "Synthetic guest time window + illustrative clear-weather scenario + activity preference + assumed local capacity",
    context: "Illustrative preference, weather scenario and assumed partner capacity applied",
    classification: "EXPERIENCE_ACTIVATION — proposed marketplace option for human review",
    os: "Marketplace & Loyalty Activation OS",
    decisionReq: "S. Okafor, Concierge Lead, reviews any proposed partner contact",
    playbook: "Experience Activation Playbook",
    maturity: "Working Proof",
    action: "Curated guest options drafted only. Partner contact and preference matching are proposed to S. Okafor; no partner or guest contact occurs.",
    value: "Indicative, unmeasured marketplace hypothesis only. No revenue or guest-experience value is attributed.",
    assurance: "Illustrative partner-opportunity record with draft guest options and a modelled interest outcome; no reservation or contact is evidenced.",
  },
  {
    id: "weather-disruption",
    title: "Weather Disruption",
    icon: "◈",
    color: "#22d3ee",
    signal: "Illustrative forecast change + synthetic outdoor-activity risk + guest activity preference flags",
    context: "Synthetic weather scenario, modelled outdoor risk and assumed indoor alternatives applied",
    classification: "EXPERIENCE_RISK — modelled disruption with proposed indoor alternatives",
    os: "Guest Experience OS",
    decisionReq: "S. Okafor, Concierge Lead, reviews proposed partner contact and capacity checks",
    playbook: "Weather Recovery Playbook",
    maturity: "Working Proof",
    action: "Alternative guest message drafted only. Partner contact and indoor-capacity checks are proposed to S. Okafor; no contact, reservation or update occurs.",
    value: "Indicative, unmeasured hypothesis: disruption may be reduced and partner opportunity may arise. No recovery or revenue is attributed.",
    assurance: "Illustrative disruption record with proposed partner response and modelled indoor-alternative outcome; no activity is evidenced.",
  },
  {
    id: "checkout-sentiment",
    title: "Checkout Sentiment Drop",
    icon: "◍",
    color: "#f97316",
    signal: "Synthetic checkout event + sentiment below illustrative threshold + open stay items + loyalty tier",
    context: "Illustrative post-stay pathway, loyalty re-engagement window and open items applied",
    classification: "SENTIMENT_RISK — modelled post-stay recovery opportunity for human review",
    os: "Service Recovery & Staff Response OS",
    decisionReq: "E. Rossi, General Manager, reviews the proposed follow-up and recovery offer",
    playbook: "Post-Stay Recovery Playbook",
    maturity: "Working Proof",
    action: "Post-stay guest follow-up and personalised recovery offer drafted only for E. Rossi's review. No briefing, external update or journey activation occurs.",
    value: "Indicative, unmeasured hypothesis: repeat-stay opportunity may improve and negative sentiment risk may fall. No value is attributed.",
    assurance: "Illustrative checkout-sentiment record with draft follow-up and modelled post-stay outcome; no contact or external-system activity is evidenced.",
  },
];

export default function PartnerMomentsEconomy() {
  const [selected, setSelected] = useState<Moment>(MOMENTS[0]);
  const { content } = usePartnerContent();
  const subheadline = content?.momentsEconomy?.subheadline ?? "A property generates dozens of moments every shift where the right action, taken at the right time, changes the outcome for the guest and for the operation. JALDO Core detects, classifies and routes each one — turning the moment economy from a concept into an operational reality.";

  const fields = [
    { label: "Signal Detected", value: selected.signal, color: "#3b82f6" },
    { label: "Context Applied", value: selected.context, color: "#a78bfa" },
    { label: "Risk / Opportunity Classification", value: selected.classification, color: selected.color },
    { label: "Illustrative Action State", value: selected.action, color: selected.color },
  ];

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#a8dedb", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Product Proof · Core Systems
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 20, maxWidth: 680 }}>
            Moment Economy Explorer
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 640 }}>
            {subheadline}
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.6, maxWidth: 500, marginTop: 12 }}>
            Select a moment below to explore a synthetic classification, proposed action and illustrative evidence state.
          </p>
          <div style={{ marginTop: 18, padding: "12px 16px", border: "1px solid rgba(168,222,219,0.25)", borderLeft: "3px solid #a8dedb", background: "rgba(168,222,219,0.04)", maxWidth: 760 }}>
            <p style={{ margin: 0, fontSize: 11.5, color: "rgba(255,255,255,0.58)", lineHeight: 1.65 }}>
              <strong style={{ color: "#a8dedb" }}>Simulation boundary:</strong> every signal, action, outcome and assurance record on this page is illustrative. No guest message, staff task, welfare action, partner activation or external-system update is dispatched.
            </p>
          </div>
        </div>

        {/* Moment selector grid */}
        <div className="rtbx-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 2 }}>
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

        {/* Positioning callout */}
        <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #a8dedb", marginBottom: 2 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
            Moments are classified by the Context and Moment Layer — a Travel-configured layer of JALDO Core. A moment is not a notification or an alert. It is a classified signal cluster with risk level, value at stake, and governance requirements that determine the response path.
          </p>
        </div>

        {/* Detail panel */}
        <div style={{
          padding: "36px 36px",
          background: `${selected.color}06`,
          border: `1px solid ${selected.color}25`,
          borderTop: "none",
          marginBottom: 48,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
            <span style={{ fontSize: 22, color: selected.color }}>{selected.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 8, letterSpacing: "0.16em", color: selected.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
                Moment Selected
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{selected.title}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ padding: "3px 10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", fontSize: 8, letterSpacing: "0.12em", color: "#10b981", textTransform: "uppercase", fontWeight: 700 }}>{selected.maturity}</div>
               <div style={{ padding: "5px 12px", background: `${selected.color}15`, border: `1px solid ${selected.color}40`, fontSize: 8, letterSpacing: "0.18em", color: selected.color, textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap" }}>● SIMULATION</div>
            </div>
          </div>

          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 2 }}>
            {fields.map(field => (
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

          {/* Value Created row */}
          <div style={{
            padding: "20px 22px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.05)",
            marginBottom: 2,
          }}>
            <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "#10b981", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
               Indicative Value
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{selected.value}</div>
          </div>

          {/* OS / Decision / Playbook row */}
          <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, marginBottom: 2 }}>
            {[
              { label: "Operating System", value: selected.os, color: "#10b981" },
              { label: "Decision Requirement", value: selected.decisionReq, color: "#f97316" },
              { label: "Playbook", value: selected.playbook, color: "#3b82f6" },
            ].map(f => (
              <div key={f.label} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: f.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{f.label}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{f.value}</div>
              </div>
            ))}
          </div>

          <div style={{
            padding: "20px 22px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "#22d3ee", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
               Illustrative Assurance Record
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{selected.assurance}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="rtbx-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 48 }}>
          {[
            { num: "8",     label: "Moment categories shown",  sub: "Select any to see the full flow" },
            { num: "247+",  label: "Configured signal inputs",  sub: "Across all moment categories" },
            { num: "<90s",  label: "Target response time",      sub: "Signal to routed action" },
             { num: "100%",  label: "Scenario records shown",   sub: "Illustrative states only" },
          ].map(stat => (
            <div key={stat.num} style={{
              padding: "28px 24px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: "2px solid rgba(168,222,219,0.3)",
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#a8dedb", marginBottom: 8, letterSpacing: "-0.02em" }}>{stat.num}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <PartnerCTAFooter />

        {/* Signal Capture link */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Related</div>
          <Link href="/partner-room/product-proof/signal-capture">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              padding: "14px 20px",
              background: "rgba(168,222,219,0.04)",
              border: "1px solid rgba(168,222,219,0.18)",
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(168,222,219,0.08)"; el.style.borderColor = "rgba(168,222,219,0.3)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(168,222,219,0.04)"; el.style.borderColor = "rgba(168,222,219,0.18)"; }}
            >
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#a8dedb", marginBottom: 2 }}>How JALDO Travel Captures Signals →</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", lineHeight: 1.4 }}>Seven signal sources · Signal pipeline · MVP vs Pilot Phase · Deployment stages</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
