import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const NEXT_STEPS = [
  {
    label: "Request Briefing",
    color: "#c9a84c",
    desc: "Request a direct executive briefing — 30 to 45 minutes, tailored to your organisation, role and commercial context. No pitch. No commitment.",
    subject: "RTBX Travel Partner Briefing",
    cta: "Request Briefing",
    recommended: true,
  },
  {
    label: "Pilot Conversation",
    color: "#10b981",
    desc: "Start a structured conversation about scoping a pilot in your environment — environment type, timeline, integration scope and success metrics.",
    subject: "RTBX Travel Pilot Conversation",
    cta: "Start Pilot Conversation",
    recommended: false,
  },
  {
    label: "Partner Conversation",
    color: "#a78bfa",
    desc: "Discuss a commercial, technology or strategic partnership — distribution, integration, investment or co-deployment.",
    subject: "RTBX Travel Partner Conversation",
    cta: "Start Partner Conversation",
    recommended: false,
  },
  {
    label: "Integration Conversation",
    color: "#3b82f6",
    desc: "Connect your existing PMS, CRM, POS, workforce or loyalty system — technical scope, API access and integration timeline.",
    subject: "RTBX Travel Integration Discussion",
    cta: "Start Integration Conversation",
    recommended: false,
  },
  {
    label: "Funding Conversation",
    color: "#f97316",
    desc: "Discuss category investment, strategic funding or co-deployment capital for RTBX Travel — series, structure and opportunity scope.",
    subject: "RTBX Travel Funding Discussion",
    cta: "Start Funding Conversation",
    recommended: false,
  },
];

export default function PartnerNextStep() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Room · Next Step
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Next Step
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 600 }}>
            Choose the conversation that fits your context. Every path leads to a direct, structured engagement —
            no general enquiry forms, no waiting rooms.
          </p>
        </div>

        {/* Recommended — prominent first card */}
        <div style={{ marginBottom: 32 }}>
          <a href={`mailto:lance@rtbx.com.au?subject=${encodeURIComponent(NEXT_STEPS[0].subject)}`} style={{ textDecoration: "none" }}>
            <div style={{
              padding: "40px 40px",
              background: "rgba(201,168,76,0.05)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderTop: "2px solid #c9a84c",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32,
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(201,168,76,0.09)"; el.style.borderColor = "rgba(201,168,76,0.4)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(201,168,76,0.05)"; el.style.borderColor = "rgba(201,168,76,0.2)"; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c" }}>
                    {NEXT_STEPS[0].label}
                  </div>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.35)", padding: "2px 8px" }}>
                    Recommended
                  </div>
                </div>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
                  {NEXT_STEPS[0].desc}
                </p>
              </div>
              <div style={{
                padding: "14px 32px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", background: "#c9a84c", color: "#080c14",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                {NEXT_STEPS[0].cta} →
              </div>
            </div>
          </a>
        </div>

        {/* Other options */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {NEXT_STEPS.slice(1).map(step => (
            <a key={step.label} href={`mailto:lance@rtbx.com.au?subject=${encodeURIComponent(step.subject)}`} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "28px 24px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${step.color}`,
                display: "flex", flexDirection: "column",
                cursor: "pointer", transition: "all 0.15s", height: "100%",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${step.color}08`; el.style.borderColor = `${step.color}35`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.02)"; el.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: step.color, marginBottom: 14, lineHeight: 1.3 }}>
                  {step.label}
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, flex: 1, marginBottom: 22 }}>
                  {step.desc}
                </p>
                <div style={{ fontSize: 9.5, color: step.color, fontWeight: 700, letterSpacing: "0.08em" }}>
                  {step.cta} →
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Contact note */}
        <div style={{ marginTop: 48, padding: "20px 28px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>Contact</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.6 }}>
            All conversations are with Lance — founder, RTBX Group. Every engagement is structured, confidential and directly relevant to your context.
            <span style={{ color: "rgba(255,255,255,0.45)", marginLeft: 8 }}>lance@rtbx.com.au</span>
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
