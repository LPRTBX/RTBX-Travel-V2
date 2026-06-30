import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const MVP_URL = "https://replit.com/@LP1313/rtbx-travel-moment-response-mvp";

const INTEGRATION_SECTIONS = [
  {
    num: "01",
    label: "PMS / Booking Enrichment",
    color: "#a78bfa",
    explain: "With an approved PMS or booking system integration, RTBX can receive or look up arrival time, room type, loyalty tier, special requests and group booking context automatically — removing the need for staff to enter this manually.",
    examples: ["Arrival time confirmed automatically", "Loyalty tier applied at signal creation", "Special requests surfaced before guest arrives", "Group booking context added to moment classification"],
    mvpVsPilot: "MVP: staff manually enters arrival context. Pilot: PMS feeds this directly.",
  },
  {
    num: "02",
    label: "Task and Housekeeping Signal Feeds",
    color: "#f97316",
    explain: "Where an approved task or housekeeping system is connected, RTBX can receive room readiness updates, cleaning completion signals and maintenance alerts in real-time or near-real-time, without staff needing to relay them.",
    examples: ["Room ready signal triggers automatic guest notification", "Cleaning delay detected, escalation timer started", "Maintenance fault logged automatically as signal", "Task overdue flag creates moment without manual input"],
    mvpVsPilot: "MVP: staff enters room delay. Pilot: task system sends the signal.",
  },
  {
    num: "03",
    label: "Guest Messaging Integration",
    color: "#3b82f6",
    explain: "With approved guest messaging integration, RTBX and WELBX can send and receive messages through the guest's preferred channel — SMS, in-app, email or kiosk — and capture guest responses as classified signals.",
    examples: ["WELBX message delivered via SMS if no app installed", "Guest reply captured and classified as signal", "Pre-arrival message triggered by PMS arrival data", "Post-stay sentiment collected automatically"],
    mvpVsPilot: "MVP: WELBX guest message is generated in the platform. Pilot: delivered via approved external channel.",
    welbx: true,
  },
  {
    num: "04",
    label: "Weather and Disruption Signals",
    color: "#22d3ee",
    explain: "External signals from weather APIs, transport feeds or event systems allow RTBX to pre-classify disruption moments before guests are affected, enabling proactive recovery pathways rather than reactive responses.",
    examples: ["Weather alert triggers activity disruption pathway", "Transport delay creates guest arrival risk signal", "Event cancellation cascades to alternative activity offer", "Road disruption flagged before impact on arrivals"],
    mvpVsPilot: "MVP: staff enters disruption manually. Pilot: external feed sends the signal automatically.",
  },
  {
    num: "05",
    label: "Operator Reporting",
    color: "#10b981",
    explain: "With approved reporting integration or data output, RTBX pilot reports can be delivered directly into operator dashboards, property management systems or executive briefing tools — replacing manual PDF exports.",
    examples: ["Daily pilot summary delivered to operator dashboard", "Value protected metric pushed to management reporting", "Escalation frequency reported by property", "Recovery effectiveness tracked over pilot period"],
    mvpVsPilot: "MVP: pilot report visible in RTBX platform only. Pilot: exported to operator tools via integration.",
  },
  {
    num: "06",
    label: "Marketplace and Local Partner Triggers",
    color: "#e879f9",
    explain: "With approved marketplace or partner connections, RTBX can surface local activity options, alternative transport, food and beverage offers or destination experiences at the right moment — activated by signal context.",
    examples: ["Weather disruption triggers local indoor activity offer", "Arrival friction creates complimentary welcome offer", "Loyalty tier activates premium experience prompt", "Group booking triggers partner coordination signal"],
    mvpVsPilot: "MVP: marketplace offers are manually created per scenario. Pilot: partner availability confirmed via integration.",
  },
];

export default function PartnerPilotExpansionPreview() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/partner-room/product-proof"><span style={{ cursor: "pointer", color: "rgba(255,255,255,0.35)" }}>Product Proof</span></Link>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
          <span>Pilot Expansion Preview</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", padding: "3px 10px" }}>
              Pilot-Stage Preview
            </div>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14, lineHeight: 1.1 }}>
            Integration-Assisted Pilot Preview
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 720, marginBottom: 20 }}>
            How the push-first Moment Response MVP becomes faster and more automated when approved integrations are added.
          </p>

          {/* Honest framing */}
          <div style={{
            padding: "18px 22px",
            background: "rgba(16,185,129,0.04)",
            border: "1px solid rgba(16,185,129,0.18)",
            borderLeft: "3px solid #10b981",
            maxWidth: 720,
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, margin: 0 }}>
              The first MVP does not require heavy integrations. Integrations are added to reduce manual load, improve timing and strengthen signal context. Each integration requires partner or operator approval before connection.
            </p>
          </div>

          {/* Link to live MVP */}
          <a href={MVP_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontSize: 9, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c",
              border: "1px solid rgba(201,168,76,0.25)", padding: "7px 14px", cursor: "pointer",
            }}>
              ← View Current Live MVP ↗
            </div>
          </a>
        </div>

        {/* Pathway overview */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {[
              { stage: "Stage 1 — Push-First MVP", color: "#c9a84c", desc: "Staff, guest and operator-entered signals. Manual intake. Workflow proven.", status: "Live Now" },
              { stage: "Stage 2 — Integration-Assisted Pilot", color: "#10b981", desc: "PMS, task, messaging, weather and marketplace signals added as integrations are approved.", status: "This Preview" },
              { stage: "Stage 3 — Multi-Site Operating Layer", color: "#a78bfa", desc: "Signals captured across multiple properties. Pattern insights, value proof, scale.", status: "Future State" },
            ].map(s => (
              <div key={s.stage} style={{
                padding: "20px 20px",
                background: `${s.color}05`,
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${s.color}`,
              }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: s.color, marginBottom: 6 }}>{s.status}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>{s.stage}</div>
                <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Integration sections */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Integration Areas</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>What Each Integration Adds</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {INTEGRATION_SECTIONS.map(section => (
              <div key={section.num} style={{
                padding: "28px 28px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `3px solid ${section.color}`,
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ fontSize: 7.5, fontWeight: 800, color: `${section.color}50`, letterSpacing: "0.14em" }}>{section.num}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
                        {section.label}
                        {section.welbx && <span style={{ fontSize: 8, fontWeight: 700, color: "#3b82f6", marginLeft: 8, letterSpacing: "0.1em", verticalAlign: "middle" }}>WELBX</span>}
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: "0 0 16px 0" }}>
                      {section.explain}
                    </p>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: section.color, fontStyle: "italic", padding: "8px 12px", background: `${section.color}08`, borderLeft: `2px solid ${section.color}30` }}>
                      {section.mvpVsPilot}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>What this integration enables</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {section.examples.map(ex => (
                        <div key={ex} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 4, height: 4, background: section.color, borderRadius: "50%", flexShrink: 0, marginTop: 5 }} />
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related links */}
        <div style={{ paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Related</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { label: "Live MVP Preview ↗", href: MVP_URL, ext: true },
              { label: "Stage 3 Operating Layer", href: "/partner-room/product-proof/stage-3-operating-layer", ext: false },
              { label: "Signal Capture", href: "/partner-room/product-proof/signal-capture", ext: false },
              { label: "Integration Brief", href: "/partner-room/integration-brief", ext: false },
              { label: "Product Proof", href: "/partner-room/product-proof", ext: false },
            ].map(link => (
              link.ext
                ? <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.25)", padding: "8px 14px", cursor: "pointer" }}>
                      {link.label}
                    </div>
                  </a>
                : <Link key={link.href} href={link.href}>
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
