import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const WORKING_PROOF_PATH = "/partner-room/guest-demo";

const SITES = [
  { name: "Harbour Hotel",               openMoments: 4,  escalated: 1, closedToday: 12, valueProtected: "£2,840", risk: "Medium",  riskColor: "#f97316" },
  { name: "Coastal Holiday Park",        openMoments: 7,  escalated: 2, closedToday: 19, valueProtected: "£4,110", risk: "High",    riskColor: "#ef4444" },
  { name: "City Corporate Hotel",        openMoments: 2,  escalated: 0, closedToday: 8,  valueProtected: "£1,960", risk: "Low",     riskColor: "#10b981" },
  { name: "Regional Event Venue",        openMoments: 5,  escalated: 1, closedToday: 14, valueProtected: "£3,200", risk: "Medium",  riskColor: "#f97316" },
  { name: "Destination Partner Network", openMoments: 11, escalated: 3, closedToday: 27, valueProtected: "£6,750", risk: "High",    riskColor: "#ef4444" },
];

const SIGNAL_STREAMS = [
  { label: "Guest signals",                    color: "#3b82f6",  count: "64 active",  desc: "Guest-entered inputs via Guest Channel QR, SMS link, kiosk or staff relay" },
  { label: "Staff signals",                    color: "#c9a84c",  count: "38 active",  desc: "Staff-entered operational moments through dashboard, mobile or manager console" },
  { label: "PMS / booking signals",            color: "#a78bfa",  count: "22 active",  desc: "Arrival times, room status, loyalty flags, special requests — via approved integration" },
  { label: "Task / housekeeping signals",      color: "#f97316",  count: "17 active",  desc: "Room readiness, cleaning delays, maintenance alerts — via approved task system feed" },
  { label: "Weather and disruption signals",   color: "#22d3ee",  count: "5 active",   desc: "Weather alerts, transport disruptions, external events — via approved API feed" },
  { label: "Partner / marketplace signals",    color: "#10b981",  count: "9 active",   desc: "Partner availability, local activity windows, marketplace triggers" },
  { label: "Communication signals",            color: "#e879f9",  count: "31 active",  desc: "Guest messages, unresolved replies, escalation flags, sentiment tags" },
];

const HEATMAP_ITEMS = [
  { site: "Harbour Hotel",               moment: "Arrival friction rising",               level: "Medium", color: "#f97316", detail: "4 concurrent early arrivals, 2 rooms delayed" },
  { site: "Coastal Holiday Park",        moment: "Weather disruption active",              level: "High",   color: "#ef4444", detail: "Wind advisory affecting outdoor activities, 7 active guest pathways" },
  { site: "City Corporate Hotel",        moment: "Checkout sentiment risk increasing",     level: "Medium", color: "#f97316", detail: "3 unresolved service requests from past 24 hours" },
  { site: "Destination Partner Network", moment: "Revenue opportunity window open",        level: "Active", color: "#10b981", detail: "11 guests with itinerary gaps, 3 partner availability windows open" },
];

const PATTERN_INSIGHTS = [
  { insight: "Room readiness delays spike between 1:30pm and 3:00pm across two properties.", sites: "Harbour Hotel · Coastal Holiday Park", action: "Pre-shift housekeeping briefing recommended" },
  { insight: "Weather disruptions are creating service recovery moments in family bookings.", sites: "Coastal Holiday Park", action: "Proactive alternative pathway triggered for weather-sensitive bookings" },
  { insight: "Unresolved guest requests are more likely to escalate when no owner is assigned within 12 minutes.", sites: "All sites", action: "Assignment threshold review recommended" },
  { insight: "Checkout sentiment improves when recovery action is completed before departure.", sites: "City Corporate Hotel · Harbour Hotel", action: "Pre-departure recovery window flagged in escalation logic" },
];

const ROLE_VIEWS = [
  { role: "Frontline staff", color: "#c9a84c", sees: "Assigned actions only. What to do, who to tell, when to escalate.", icon: "◎" },
  { role: "Property manager", color: "#10b981", sees: "Escalation watch and site performance. Open moments, overdue actions, today's outcome log.", icon: "◈" },
  { role: "Operator executive", color: "#3b82f6", sees: "Multi-site patterns, value proof and risk. Portfolio view across all properties.", icon: "◆" },
  { role: "Partner / funder", color: "#a78bfa", sees: "De-identified assurance and deployment evidence. Pilot metrics and recovery effectiveness.", icon: "◍" },
];

const STAGE3_FLOW = [
  "Multiple properties",
  "Multiple signal streams",
  "Moment classification across sites",
  "Pattern insights",
  "Action routing",
  "Manager / operator visibility",
  "Assurance records",
  "Commercial / value reporting",
];

export default function PartnerStage3Preview() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/partner-room/product-proof"><span style={{ cursor: "pointer", color: "rgba(255,255,255,0.35)" }}>Product Proof</span></Link>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
          <span>Stage 3 Operating Layer</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)", padding: "3px 10px" }}>
              Future-State Operating Preview
            </div>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14, lineHeight: 1.1 }}>
            Stage 3 Operating Layer Preview
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 720, marginBottom: 24 }}>
            What RTBX Travel becomes after the Moment Response workflow is validated and approved integrations are connected.
          </p>

          {/* Disclaimer */}
          <div style={{
            padding: "16px 20px",
            background: "rgba(167,139,250,0.04)",
            border: "1px solid rgba(167,139,250,0.18)",
            borderLeft: "3px solid #a78bfa",
            maxWidth: 760,
            marginBottom: 12,
          }}>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>
              This preview shows the intended Stage 3 operating layer once the Moment Response workflow has been validated and approved integrations are connected. It is not presented as the current MVP.
            </p>
          </div>

          {/* Back to Working Proof */}
          <Link href={WORKING_PROOF_PATH}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontSize: 9, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c",
              border: "1px solid rgba(201,168,76,0.25)", padding: "7px 14px", cursor: "pointer",
            }}>
              ← View Working Proof
            </div>
          </Link>
        </div>

        {/* Section A: Multi-Site Operator View */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section A</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>Multi-Site Operator View</div>
          </div>

          <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 100px 110px 110px 130px 110px",
              padding: "10px 20px", background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              {["Property", "Open", "Escalated", "Closed today", "Value protected", "Risk level"].map(h => (
                <div key={h} style={{ fontSize: 7.5, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700 }}>{h}</div>
              ))}
            </div>
            {SITES.map((site, i) => (
              <div key={site.name} style={{
                display: "grid", gridTemplateColumns: "2fr 100px 110px 110px 130px 110px",
                padding: "16px 20px",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                borderBottom: i < SITES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                alignItems: "center",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{site.name}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: site.openMoments > 5 ? "#f97316" : "rgba(255,255,255,0.7)" }}>{site.openMoments}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: site.escalated > 1 ? "#ef4444" : site.escalated === 1 ? "#f97316" : "#10b981" }}>{site.escalated}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{site.closedToday}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c" }}>{site.valueProtected}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: site.riskColor, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: site.riskColor }}>{site.risk}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", marginTop: 8, fontStyle: "italic" }}>
            Illustrative multi-site view. Values shown are for demonstration purposes only.
          </div>
        </div>

        {/* Section B: Simulated Signal Streams */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section B</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 6 }}>Simulated Signal Streams</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.65, maxWidth: 640, margin: 0 }}>
              Signals can start as staff, guest and operator-entered inputs, then expand through approved integrations over time.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {SIGNAL_STREAMS.map(stream => (
              <div key={stream.label} style={{
                padding: "20px 18px",
                background: `${stream.color}05`,
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${stream.color}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: stream.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 7.5, fontWeight: 700, color: stream.color, letterSpacing: "0.1em" }}>{stream.count}</span>
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{stream.label}</div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", lineHeight: 1.55, margin: 0 }}>{stream.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section C: Moment Heatmap */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section C</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>Moment Heatmap</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {HEATMAP_ITEMS.map(item => (
              <div key={item.site} style={{
                display: "grid", gridTemplateColumns: "220px 1fr 90px 1fr",
                gap: 0, alignItems: "center",
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}>
                <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.025)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.65)", lineHeight: 1.3 }}>{item.site}</div>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{item.moment}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", lineHeight: 1.4 }}>{item.detail}</div>
                </div>
                <div style={{ padding: "16px 12px", display: "flex", alignItems: "center", gap: 6, borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: item.color }}>{item.level}</span>
                </div>
                <div style={{ padding: "16px 20px", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: item.level === "High" ? "80%" : item.level === "Medium" ? "55%" : item.level === "Active" ? "65%" : "30%", background: item.color, borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section D: Pattern Insights */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section D</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 6 }}>Pattern Insights</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.65, maxWidth: 600, margin: 0 }}>
              Patterns identified from accumulated signal and outcome data. Not presented as predictive automation.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PATTERN_INSIGHTS.map((item, i) => (
              <div key={i} style={{
                padding: "20px 24px",
                background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: "3px solid rgba(201,168,76,0.35)",
                display: "grid", gridTemplateColumns: "1fr 200px 240px", gap: 20, alignItems: "center",
              }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>{item.insight}</div>
                <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{item.sites}</div>
                <div style={{ fontSize: 10, color: "#c9a84c", fontStyle: "italic", lineHeight: 1.5 }}>{item.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section E: Role-Based Views */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section E</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>Role-Based Views at Stage 3</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {ROLE_VIEWS.map(role => (
              <div key={role.role} style={{
                padding: "24px 20px",
                background: `${role.color}05`,
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${role.color}`,
              }}>
                <div style={{ fontSize: 18, color: role.color, marginBottom: 10 }}>{role.icon}</div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", marginBottom: 12, textTransform: "uppercase" }}>{role.role}</div>
                <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, margin: 0 }}>{role.sees}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section F: Stage 3 System Flow */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Section F</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>Stage 3 System Flow</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 560 }}>
            {STAGE3_FLOW.map((step, i) => (
              <div key={step}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 20px",
                  background: i % 2 === 0 ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderBottom: i < STAGE3_FLOW.length - 1 ? "none" : undefined,
                }}>
                  <div style={{ width: 8, height: 8, background: "#a78bfa", flexShrink: 0, opacity: 0.6 }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{step}</div>
                </div>
                {i < STAGE3_FLOW.length - 1 && (
                  <div style={{ paddingLeft: 23, color: "rgba(167,139,250,0.3)", fontSize: 16, lineHeight: 1 }}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related links */}
        <div style={{ paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Related</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { label: "Working Proof", href: WORKING_PROOF_PATH, ext: false, color: "#c9a84c" },
              { label: "Pilot Expansion Preview", href: "/partner-room/product-proof/pilot-expansion-preview", ext: false, color: "" },
              { label: "Signal Capture", href: "/partner-room/product-proof/signal-capture", ext: false, color: "" },
              { label: "Product Proof", href: "/partner-room/product-proof", ext: false, color: "" },
              { label: "Demo Links", href: "/partner-room/resources/travel-demo-links", ext: false, color: "" },
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
