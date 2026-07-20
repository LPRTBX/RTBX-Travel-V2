import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const P = {
  bg: "#080c14", navy: "#0d1220", border: "rgba(255,255,255,0.08)",
  amber: "#c9a84c", white: "#f8f9fb", muted: "rgba(255,255,255,0.5)",
  dimmed: "rgba(255,255,255,0.22)", green: "#10b981",
};

interface Stage {
  id: number;
  stage: string;
  label: string;
  phoneMessage: string;
  phoneSub: string;
  phoneActions: string[];
  phoneConfirm: string;
  guestSees: string;
  rtbxAutomates: string;
  operatorReceives: string;
  valueCreated: string;
}

const STAGES: Stage[] = [
  {
    id: 0,
    stage: "Arrival",
    label: "01 · Arrival",
    phoneMessage: "Welcome back, Sarah.",
    phoneSub: "Your room is being prepared. Let us know how we can help while you wait.",
    phoneActions: ["Check in digitally", "Hold my bags", "Find a quiet space", "Ask a question"],
    phoneConfirm: "You're checked in. Room 408 will be ready by 15:30 — we'll send your key directly. No need to visit the desk.",
    guestSees: "Warm digital check-in with practical options. No queue, no desk wait, no friction.",
    rtbxAutomates: "Arrival signal classified from PMS + app access. Room readiness check triggered. Loyalty tier activated — Gold protocol applied.",
    operatorReceives: "Front desk: guest context card — name, tier, flight origin, room status and recommended greeting script for this specific guest.",
    valueCreated: "Arrival friction reduced. First-impression sentiment protected. Loyalty recognition delivered in under 30 seconds.",
  },
  {
    id: 1,
    stage: "Room Delay",
    label: "02 · Room Delay",
    phoneMessage: "Your room is nearly ready.",
    phoneSub: "There's a 25-minute delay. Here's what we can arrange in the meantime.",
    phoneActions: ["Notify me when ready", "Hold my bags", "Use the lounge", "Speak to the team"],
    phoneConfirm: "Your bags are at concierge. Lounge access is arranged on Level 2. We'll notify you the moment your room is ready — expected 15:30.",
    guestSees: "A proactive update with timing and options — before they need to ask or complain.",
    rtbxAutomates: "Room delay escalation timer set: 45 minutes. Housekeeping reprioritised for Room 408. Lounge access pre-activated on guest profile.",
    operatorReceives: "Housekeeping: Room 408 to priority queue. Manager: 45-min escalation timer active — alert queued. Front desk: lounge access confirmed, bags held.",
    valueCreated: "Complaint prevented. Recovery pathway opened before frustration. Review risk reduced. Escalation timer set and tracked.",
  },
  {
    id: 2,
    stage: "Weather Change",
    label: "03 · Weather Change",
    phoneMessage: "The weather has changed this afternoon.",
    phoneSub: "Your outdoor activity may be affected. Here are some alternatives we've put together for you.",
    phoneActions: ["Indoor experiences nearby", "Reschedule outdoor activity", "Local recommendations", "Keep my booking"],
    phoneConfirm: "We've sent you a curated indoor guide based on your preferences. The activity team has been updated — no action needed on your end.",
    guestSees: "Alternatives delivered before the guest steps outside and faces disappointment. Proactive, not reactive.",
    rtbxAutomates: "Weather disruption classified as experience risk. Activity partner notified. Indoor alternatives generated from guest profile and local partner inventory.",
    operatorReceives: "Activity team: weather flag + guest preference update. Partner: capacity check triggered. Concierge: indoor options list queued for immediate delivery.",
    valueCreated: "Guest experience recovered before it was lost. Local partner revenue opportunity created. Marketplace activation logged and evidenced.",
  },
  {
    id: 3,
    stage: "Dining",
    label: "04 · Dining Opportunity",
    phoneMessage: "You have a free window before dinner.",
    phoneSub: "Based on your stay so far, here are a few options we thought you'd enjoy.",
    phoneActions: ["Dining suggestions", "Wellness & spa", "Transport & transfers", "Local experiences"],
    phoneConfirm: "Our concierge is sending you a personalised list now — curated to your profile and your available window before 20:00.",
    guestSees: "A relevant, well-timed prompt — not a generic notification. Delivered at exactly the right moment based on their actual schedule.",
    rtbxAutomates: "High-propensity commercial window detected from booking data + stay history + dwell pattern. F&B pathway triggered. Personalisation layer applied from loyalty profile.",
    operatorReceives: "F&B team: commercial activation window open for Room 408 — Gold tier, wellness preference noted. POS: upsell flag. Concierge: personalised list to be sent immediately.",
    valueCreated: "F&B revenue opportunity activated. Guest engaged during dwell period. Ancillary revenue and experience partner revenue created.",
  },
  {
    id: 4,
    stage: "Guest Welfare",
    label: "05 · Guest Welfare Flag",
    phoneMessage: "We're here if you need anything.",
    phoneSub: "No need to explain — we can help discreetly and without any fuss.",
    phoneActions: ["Arrange a quiet space", "Speak to a staff member", "Come back to this later", "I'm fine, thank you"],
    phoneConfirm: "Understood. A quiet space has been arranged on your floor. A staff member will check in discreetly — you don't need to do anything.",
    guestSees: "Soft, dignified support — no intrusion, no stigma, no forms. Delivered at the right moment.",
    rtbxAutomates: "Welfare signal classified using privacy-safe escalation model. Appropriate support pathway selected. No over-escalation. Quiet space pre-arranged based on signal confidence.",
    operatorReceives: "Appropriate staff member: discreet welfare guidance card — role, action steps and care protocol. Manager on standby with context only if threshold is met.",
    valueCreated: "Duty-of-care pathway created and evidenced. Guest supported without visibility. Welfare action logged with full assurance trail.",
  },
  {
    id: 5,
    stage: "Service Recovery",
    label: "06 · Service Recovery",
    phoneMessage: "We noticed your room issue is still open.",
    phoneSub: "Let's resolve this properly. Choose how you'd like us to proceed.",
    phoneActions: ["Escalate to a manager", "Request a room move", "Arrange a 5-minute fix", "It's sorted — thank you"],
    phoneConfirm: "A manager has been alerted and will be with you in under 5 minutes. You won't need to re-explain anything — we've passed the full context.",
    guestSees: "A clear resolution pathway, a committed timeframe and confidence that someone owns the problem.",
    rtbxAutomates: "Unresolved issue reclassified as escalation risk. Owner assigned. Timer started: 5 minutes. Manager alert queued. Full context packaged — no re-briefing needed.",
    operatorReceives: "Manager: escalation alert with full context — room number, issue type, time open, prior actions, guest tier. Owner assigned. Timer: 5 minutes to resolution.",
    valueCreated: "Escalation pathway active. Ownership assigned and logged. Evidence trail created. Negative review risk significantly reduced.",
  },
  {
    id: 6,
    stage: "Checkout",
    label: "07 · Checkout",
    phoneMessage: "Thank you for staying, Sarah.",
    phoneSub: "Your checkout is ready. We'd love to hear how your stay went.",
    phoneActions: ["Express checkout", "Share feedback", "Book my next stay", "Request a receipt"],
    phoneConfirm: "You're checked out. Your receipt is on its way. Your feedback has been recorded — thank you. We look forward to welcoming you back.",
    guestSees: "Frictionless checkout, a loyalty moment and a dignified farewell — no queue, no desk.",
    rtbxAutomates: "Checkout signal triggers sentiment capture + loyalty pathway. Post-stay flag raised if sentiment below threshold. Repeat-stay opportunity queued for CRM activation.",
    operatorReceives: "GM summary: stay outcome, guest sentiment signal, unresolved items (if any), loyalty re-engagement flag. Post-stay follow-up triggered if sentiment requires it.",
    valueCreated: "Assurance record completed. Outcome evidenced. Repeat-stay opportunity created. CRM journey activated for this guest.",
  },
];

const QUAD_COLORS = ["#c9a84c", "#3b82f6", "#10b981", "#a78bfa"];

function PhoneFrame({ stage, selected, onSelect }: {
  stage: Stage;
  selected: string | null;
  onSelect: (a: string) => void;
}) {
  return (
    <div style={{
      width: 300,
      background: "#1a1b2e",
      borderRadius: 44,
      padding: "10px",
      boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
      flexShrink: 0,
    }}>
      <div style={{
        background: "#faf9f6",
        borderRadius: 36,
        overflow: "hidden",
        height: 580,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{
          background: "#0d0d1a",
          padding: "10px 20px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>15:12</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)" }}>●●●</span>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)" }}>WiFi</span>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)" }}>▌▌</span>
          </div>
        </div>

        <div style={{
          background: "#0d0d1a",
          padding: "8px 20px 12px",
          textAlign: "center",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 7.5, letterSpacing: "0.28em", color: "rgba(201,168,76,0.9)", textTransform: "uppercase", fontWeight: 700 }}>
            GRAND MERIDIAN · LONDON
          </div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginTop: 3, letterSpacing: "0.1em" }}>
            {stage.stage.toUpperCase()} MOMENT
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px 14px" }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 5, lineHeight: 1.3 }}>
              {stage.phoneMessage}
            </div>
            <div style={{ fontSize: 11.5, color: "#4a4a6a", lineHeight: 1.6 }}>
              {stage.phoneSub}
            </div>
          </div>

          {selected === null ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stage.phoneActions.map(action => (
                <button
                  key={action}
                  onClick={() => onSelect(action)}
                  style={{
                    padding: "11px 14px",
                    background: "#f0eeea",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 10,
                    fontSize: 11, fontWeight: 600, color: "#1a1a2e",
                    textAlign: "left", cursor: "pointer",
                    fontFamily: "system-ui, sans-serif",
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#e6e4e0"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#f0eeea"; }}
                >
                  {action}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div style={{
                padding: "14px", background: "#eef7f2",
                border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, marginBottom: 14,
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>✓ Confirmed</div>
                <div style={{ fontSize: 11, color: "#2d4a3e", lineHeight: 1.6 }}>{stage.phoneConfirm}</div>
              </div>
              <button
                onClick={() => onSelect("")}
                style={{
                  padding: "8px 14px", background: "transparent",
                  border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8,
                  fontSize: 9.5, color: "#6b6b8a", cursor: "pointer",
                  fontFamily: "system-ui, sans-serif",
                }}
              >← Try another option</button>
            </div>
          )}
        </div>

        <div style={{
          padding: "10px 20px 14px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          textAlign: "center",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 8.5, color: "#9999b8", fontStyle: "italic" }}>
            No app. No login. In the moment.
          </div>
        </div>
      </div>
    </div>
  );
}

const QUAD_LABELS = ["What the Guest Sees", "What RTBX Core Coordinates", "What the Operator Receives", "Value Created"];

export default function PartnerGuestDemo() {
  const [stageIdx, setStageIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const stage = STAGES[stageIdx];

  function goTo(idx: number) {
    setStageIdx(idx);
    setSelected(null);
  }

  const quadContent = [stage.guestSees, stage.rtbxAutomates, stage.operatorReceives, stage.valueCreated];

  return (
    <PartnerRoomLayout>
      {/* Header */}
      <div className="rtbx-page-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 60px 36px" }}>
        <div style={{ fontSize: 8, letterSpacing: "0.22em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
          Guest Experience Demo
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: P.white, letterSpacing: "-0.02em", marginBottom: 10 }}>
          One Stay. Seven Moments.
        </h1>
        <p style={{ fontSize: 13, color: P.muted, maxWidth: 560, lineHeight: 1.7, margin: 0 }}>
          Follow a single guest from arrival to checkout — at each stage, see what the guest experiences, what RTBX Core automates, what the operator receives and what value is created.
        </p>
      </div>

      {/* Context callout */}
      <div className="rtbx-page-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 0" }}>
        <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #3b82f6", marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
            The guest never interacts directly with RTBX. What the guest sees is the output of coordinated RTBX action — a message that arrived at the right moment, a problem resolved before they noticed it, a recommendation that felt personal. RTBX Core runs behind the scenes; WELBX is the experience layer guests interact with.
          </p>
        </div>
      </div>

      {/* Stage tabs */}
      <div className="rtbx-page-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 32px" }}>
        <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              style={{
                padding: "10px 16px",
                background: i === stageIdx ? `${P.amber}12` : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === stageIdx ? P.amber + "50" : "rgba(255,255,255,0.07)"}`,
                borderBottom: i === stageIdx ? `2px solid ${P.amber}` : "1px solid rgba(255,255,255,0.07)",
                cursor: "pointer",
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: i === stageIdx ? P.amber : P.dimmed,
                whiteSpace: "nowrap", transition: "all 0.12s",
              }}
              onMouseEnter={e => { if (i !== stageIdx) (e.currentTarget as HTMLElement).style.color = P.muted; }}
              onMouseLeave={e => { if (i !== stageIdx) (e.currentTarget as HTMLElement).style.color = P.dimmed; }}
            >
              {s.label.split("·")[0].trim()} · {s.stage}
            </button>
          ))}
        </div>
      </div>

      {/* Demo area */}
      <div className="rtbx-demo-area rtbx-page-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 80px", display: "flex", gap: 56, alignItems: "flex-start" }}>

        {/* Left: Phone */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <PhoneFrame stage={stage} selected={selected} onSelect={s => setSelected(s || null)} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => goTo(Math.max(0, stageIdx - 1))}
              disabled={stageIdx === 0}
              style={{
                background: "none", border: `1px solid ${P.border}`,
                color: stageIdx === 0 ? P.dimmed : P.muted,
                padding: "5px 12px", fontSize: 10, cursor: stageIdx === 0 ? "not-allowed" : "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >←</button>
            {STAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === stageIdx ? 18 : 6, height: 6, borderRadius: 3,
                  border: "none",
                  background: i === stageIdx ? P.amber : "rgba(255,255,255,0.15)",
                  cursor: "pointer", transition: "all 0.2s", padding: 0,
                }}
              />
            ))}
            <button
              onClick={() => goTo(Math.min(STAGES.length - 1, stageIdx + 1))}
              disabled={stageIdx === STAGES.length - 1}
              style={{
                background: "none", border: `1px solid ${P.border}`,
                color: stageIdx === STAGES.length - 1 ? P.dimmed : P.muted,
                padding: "5px 12px", fontSize: 10, cursor: stageIdx === STAGES.length - 1 ? "not-allowed" : "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >→</button>
          </div>
          <div style={{ fontSize: 9, color: P.dimmed, textAlign: "center" }}>Stage {stageIdx + 1} of {STAGES.length} · {stage.stage}</div>
        </div>

        {/* Right: 4-quadrant context */}
        <div style={{ flex: 1, paddingTop: 4 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 22 }}>
            {stage.label}
          </div>

          {/* 4 quadrants */}
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 32 }}>
            {QUAD_LABELS.map((label, i) => (
              <div key={label} style={{
                padding: "20px 22px",
                background: P.navy,
                border: `1px solid rgba(255,255,255,0.06)`,
                borderTop: `2px solid ${QUAD_COLORS[i]}40`,
              }}>
                <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: QUAD_COLORS[i], textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                  {label}
                </div>
                <div style={{ fontSize: 12, color: P.muted, lineHeight: 1.7 }}>
                  {quadContent[i]}
                </div>
              </div>
            ))}
          </div>

          {/* Stage navigator */}
          <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            All Journey Stages
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {STAGES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "9px 14px",
                  background: i === stageIdx ? `${P.amber}08` : "transparent",
                  border: `1px solid ${i === stageIdx ? `${P.amber}30` : "transparent"}`,
                  cursor: "pointer", textAlign: "left", fontFamily: "system-ui, sans-serif",
                  transition: "all 0.12s",
                }}
                onMouseEnter={e => { if (i !== stageIdx) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (i !== stageIdx) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, color: i === stageIdx ? P.amber : P.dimmed, minWidth: 18 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 10.5, color: i === stageIdx ? P.white : P.muted, fontWeight: i === stageIdx ? 600 : 400 }}>
                  {s.stage}
                </span>
                {i === stageIdx && (
                  <span style={{ fontSize: 8.5, color: P.amber, marginLeft: "auto", letterSpacing: "0.1em", textTransform: "uppercase" }}>Active</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${P.border}`, padding: "36px 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Scenario Builder", path: "/partner-room/scenario-builder" },
            { label: "Dual View Demo", path: "/partner-room/dual-view-demo" },
            { label: "Deployment Demos", path: "/partner-room/deployments" },
          ].map(b => (
            <Link key={b.path} href={b.path}>
              <div style={{
                padding: "10px 22px", border: `1px solid ${P.border}`,
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = P.white; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLElement).style.borderColor = P.border; }}
              >{b.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
