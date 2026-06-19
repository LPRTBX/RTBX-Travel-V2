import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const P = {
  bg: "#080c14", navy: "#0d1220", border: "rgba(255,255,255,0.08)",
  amber: "#c9a84c", white: "#f8f9fb", muted: "rgba(255,255,255,0.5)",
  dimmed: "rgba(255,255,255,0.22)", green: "#10b981",
};

interface Screen {
  id: number;
  label: string;
  signal: string;
  moment: string;
  welbxAction: string;
  partnerOpportunity: string;
  headerSub?: string;
  message: string;
  sub: string;
  actions: string[];
  confirmMsg: string;
}

const SCREENS: Screen[] = [
  {
    id: 0,
    label: "01 · Welcome & Needs Triage",
    signal: "Guest accessed WELBX interface via in-room tablet. Loyalty tier: Gold. Stay: 3 nights.",
    moment: "Guest Needs Triage",
    welbxAction: "Presenting contextual support options based on loyalty tier and stay history.",
    partnerOpportunity: "Dining, transport and wellness upsell visible at steps 3–4.",
    message: "Welcome back, Sarah.",
    sub: "How can we make this stay easier?",
    actions: ["I need help", "Improve my stay", "Dining & transport", "Feeling unwell or overwhelmed", "Room issue", "Something else"],
    confirmMsg: "We're connecting you with the right team. A member of staff will be with you shortly.",
  },
  {
    id: 1,
    label: "02 · Smart Check-In Moment",
    signal: "PMS: room not yet cleared. Guest ETA within 8 minutes. Housekeeping: 18 min ETA.",
    moment: "Check-In Friction Risk",
    welbxAction: "Presenting proactive waitlist options to pre-empt guest frustration at desk.",
    partnerOpportunity: "Quiet lounge, bar and concierge upsell while guest waits.",
    message: "Your room is nearly ready.",
    sub: "Would you like us to notify you, hold your bags or arrange a quiet space while you wait?",
    actions: ["Notify me when ready", "Hold my bags", "Arrange a quiet space", "Speak to the team"],
    confirmMsg: "Noted. We'll notify you the moment your room is ready. Your bags will be held at the desk.",
  },
  {
    id: 2,
    label: "03 · Service Recovery Moment",
    signal: "Room issue logged via tablet. Guest is loyalty member. Maintenance unassigned. Stay: night 2 of 3.",
    moment: "Room Issue Recovery",
    welbxAction: "Presenting recovery options with low-friction escalation path. Duty manager alerted in parallel.",
    partnerOpportunity: "Room move or upgrade recovery. Service recovery offer window open.",
    message: "We noticed your room issue has been logged.",
    sub: "Would you prefer a quick fix, a room move request or a manager follow-up?",
    actions: ["Quick fix", "Room move request", "Manager follow-up", "Not urgent"],
    confirmMsg: "A member of our team has been notified and will follow up within 5 minutes.",
  },
  {
    id: 3,
    label: "04 · Concierge & Commercial Moment",
    signal: "Guest calendar: 2-hour window before restaurant booking at 20:00. Wellness preference flag on profile.",
    moment: "Dining & Activation Window",
    welbxAction: "Surfacing curated concierge options aligned to guest profile and available window.",
    partnerOpportunity: "Spa, dining, transport and experience partners can activate here.",
    message: "You have a free window before dinner.",
    sub: "Would you like nearby dining, wellness, transport or local experience options?",
    actions: ["Dining suggestions", "Wellness & spa", "Transport & transfers", "Local experiences"],
    confirmMsg: "Our concierge will send you a curated list within 2 minutes. No need to call.",
  },
  {
    id: 4,
    label: "05 · Support & Wellbeing Moment",
    signal: "Guest used help function at 23:40. Solo traveller flag. Quiet preference on profile. Previous support note.",
    moment: "Guest Wellbeing Need",
    welbxAction: "Low-profile, discreet support options surfaced. No intrusive escalation.",
    partnerOpportunity: "Quiet room upgrade, wellbeing amenity or specialist service activation.",
    message: "Need a quieter option or extra support during your stay?",
    sub: "We can help discreetly. No need to explain.",
    actions: ["Arrange a quiet space", "Speak to a staff member", "Come back to this later", "I'm fine, thank you"],
    confirmMsg: "Understood. A quiet space has been arranged. You'll receive a note with the details.",
  },
];

function PhoneFrame({ screen, selected, onSelect }: {
  screen: Screen;
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
      {/* Phone screen */}
      <div style={{
        background: "#faf9f6",
        borderRadius: 36,
        overflow: "hidden",
        height: 580,
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Status bar */}
        <div style={{
          background: "#0d0d1a",
          padding: "10px 20px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>23:46</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)" }}>●●●</span>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)" }}>WiFi</span>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)" }}>▌▌</span>
          </div>
        </div>

        {/* Hotel header */}
        <div style={{
          background: "#0d0d1a",
          padding: "10px 20px 14px",
          textAlign: "center",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 8, letterSpacing: "0.28em", color: "rgba(201,168,76,0.9)", textTransform: "uppercase", fontWeight: 700 }}>
            GRAND MERIDIAN · LONDON
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 20px 16px" }}>
          {/* Greeting */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 5, lineHeight: 1.3 }}>
              {screen.message}
            </div>
            <div style={{ fontSize: 11.5, color: "#4a4a6a", lineHeight: 1.6 }}>
              {screen.sub}
            </div>
          </div>

          {/* Actions */}
          {selected === null ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {screen.actions.map(action => (
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
                <div style={{ fontSize: 9, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>✓ Received</div>
                <div style={{ fontSize: 11, color: "#2d4a3e", lineHeight: 1.6 }}>{screen.confirmMsg}</div>
              </div>
              <button
                onClick={() => onSelect("")}
                style={{
                  padding: "8px 14px", background: "transparent",
                  border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8,
                  fontSize: 9.5, color: "#6b6b8a", cursor: "pointer",
                  fontFamily: "system-ui, sans-serif",
                }}
              >← Go back</button>
            </div>
          )}
        </div>

        {/* Microcopy */}
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

function DemoFooter() {
  return (
    <div style={{ borderTop: `1px solid ${P.border}`, padding: "40px 60px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Ready to map this to your environment?</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "View Pilot Model", path: "/partner-room/pilot-model" },
            { label: "Open Integration Brief", path: "/partner-room/integration-brief" },
            { label: "View Moments Economy", path: "/partner-room/moments-economy" },
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
    </div>
  );
}

export default function PartnerGuestDemo() {
  const [screenIdx, setScreenIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const screen = SCREENS[screenIdx];

  function goTo(idx: number) {
    setScreenIdx(idx);
    setSelected(null);
  }

  return (
    <PartnerRoomLayout>
      {/* Header */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "56px 60px 48px" }}>
        <div style={{ fontSize: 8, letterSpacing: "0.22em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
          GUEST EXPERIENCE DEMO
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: P.white, letterSpacing: "-0.02em", marginBottom: 10 }}>
          What the Guest Sees
        </h1>
        <p style={{ fontSize: 13, color: P.muted, maxWidth: 500, lineHeight: 1.7, margin: 0 }}>
          A zero-download, concierge-grade interface. Five moments. Each one turning a signal into a supported action.
        </p>
      </div>

      {/* Demo area */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 80px", display: "flex", gap: 60, alignItems: "flex-start" }}>

        {/* Left: Phone + nav */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <PhoneFrame screen={screen} selected={selected} onSelect={s => setSelected(s || null)} />

          {/* Step dots */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => goTo(Math.max(0, screenIdx - 1))}
              disabled={screenIdx === 0}
              style={{
                background: "none", border: `1px solid ${P.border}`, color: screenIdx === 0 ? P.dimmed : P.muted,
                padding: "5px 12px", fontSize: 10, cursor: screenIdx === 0 ? "not-allowed" : "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >←</button>
            {SCREENS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: 8, height: 8, borderRadius: "50%", border: "none",
                  background: i === screenIdx ? P.amber : "rgba(255,255,255,0.15)",
                  cursor: "pointer", transition: "background 0.2s", padding: 0,
                }}
              />
            ))}
            <button
              onClick={() => goTo(Math.min(SCREENS.length - 1, screenIdx + 1))}
              disabled={screenIdx === SCREENS.length - 1}
              style={{
                background: "none", border: `1px solid ${P.border}`, color: screenIdx === SCREENS.length - 1 ? P.dimmed : P.muted,
                padding: "5px 12px", fontSize: 10, cursor: screenIdx === SCREENS.length - 1 ? "not-allowed" : "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >→</button>
          </div>
          <div style={{ fontSize: 9, color: P.dimmed, textAlign: "center" }}>Screen {screenIdx + 1} of {SCREENS.length}</div>
        </div>

        {/* Right: Context panel */}
        <div style={{ flex: 1, paddingTop: 8 }}>
          {/* Screen label */}
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
            {screen.label}
          </div>

          {/* Signal */}
          <div style={{ marginBottom: 24, padding: "18px 22px", background: P.navy, border: `1px solid ${P.border}` }}>
            <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Signal Detected</div>
            <div style={{ fontSize: 12, color: P.muted, lineHeight: 1.7 }}>{screen.signal}</div>
          </div>

          {/* Moment + WELBX action */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            <div style={{ padding: "18px 22px", background: P.navy, border: `1px solid ${P.border}` }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Moment Type</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: P.amber }}>{screen.moment}</div>
            </div>
            <div style={{ padding: "18px 22px", background: P.navy, border: `1px solid ${P.border}` }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Partner Opportunity</div>
              <div style={{ fontSize: 11, color: P.green, lineHeight: 1.6 }}>{screen.partnerOpportunity}</div>
            </div>
          </div>

          {/* WELBX action */}
          <div style={{ padding: "18px 22px", background: P.navy, border: `1px solid ${P.border}`, marginBottom: 32 }}>
            <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>What WELBX Is Doing</div>
            <div style={{ fontSize: 12, color: P.muted, lineHeight: 1.7 }}>{screen.welbxAction}</div>
          </div>

          {/* Screen navigator list */}
          <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>All Screens</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SCREENS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", background: i === screenIdx ? `${P.amber}08` : "transparent",
                  border: `1px solid ${i === screenIdx ? `${P.amber}30` : "transparent"}`,
                  cursor: "pointer", textAlign: "left", fontFamily: "system-ui, sans-serif",
                  transition: "all 0.12s",
                }}
                onMouseEnter={e => { if (i !== screenIdx) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (i !== screenIdx) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, color: i === screenIdx ? P.amber : P.dimmed, minWidth: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 10.5, color: i === screenIdx ? P.white : P.muted, fontWeight: i === screenIdx ? 600 : 400 }}>{s.label.split("·")[1]?.trim()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <DemoFooter />
    </PartnerRoomLayout>
  );
}
