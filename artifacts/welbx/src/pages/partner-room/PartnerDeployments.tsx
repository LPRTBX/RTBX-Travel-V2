import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const ENVS = [
  {
    label: "Hotels & Resorts",
    color: "#c9a84c",
    desc: "Full-property operating layer — guest signal to staff action across rooms, F&B, concierge and maintenance.",
    moments: ["Room readiness delay", "Service request spike", "Guest sentiment drop", "Loyalty profile trigger", "Staff response gap"],
    status: "Available",
  },
  {
    label: "Holiday Parks & Outdoor Experiences",
    color: "#10b981",
    desc: "Multi-site, seasonal operating environments with dispersed guest populations and varied facility types.",
    moments: ["Check-in queue build-up", "Facility maintenance signal", "Weather-related activity shift", "Peak-period guest cluster", "Site-level sentiment alert"],
    status: "Live Demo Available",
    demo: { label: "Run Holiday Parks Demo", href: "/partner-room/holiday-park-demo" },
  },
  {
    label: "Corporate Travel",
    color: "#3b82f6",
    desc: "Managed travel environments — programme compliance, policy adherence, duty of care and cost control signals.",
    moments: ["Policy breach signal", "Duty of care trigger", "Cost overrun alert", "Itinerary change cascade", "Traveller distress flag"],
    status: "Available",
  },
  {
    label: "Events & Venues",
    color: "#a78bfa",
    desc: "Event-day operating logic — from arrival through to experience delivery, F&B flow and post-event assurance.",
    moments: ["Crowd flow anomaly", "Catering shortfall signal", "Access control issue", "Performer schedule change", "Guest escalation trigger"],
    status: "Available",
  },
  {
    label: "Destination & Tourism Operators",
    color: "#f97316",
    desc: "Multi-experience, multi-partner environments — coordinating between accommodation, activity and transport layers.",
    moments: ["Transport delay cascade", "Booking conflict signal", "Partner response gap", "Guest journey break", "Weather impact trigger"],
    status: "Available",
  },
];

export default function PartnerDeployments() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Room · Deployments
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Deployment Environments
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 640 }}>
            Five travel and hospitality environments — one RTBX Core operating system deployed across all of them.
            The signal-to-action logic is identical. The context, configuration and moment library adapts to each environment.
          </p>
        </div>

        {/* Environment cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 2, marginBottom: 80 }}>
          {ENVS.map(env => (
            <div key={env.label} style={{
              padding: "32px 28px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: `2px solid ${env.color}`,
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: env.color, lineHeight: 1.3, maxWidth: "75%" }}>
                  {env.label}
                </div>
                <div style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: env.demo ? "#10b981" : "rgba(255,255,255,0.22)",
                  border: `1px solid ${env.demo ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
                  padding: "3px 8px",
                  whiteSpace: "nowrap",
                }}>
                  {env.status}
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, marginBottom: 22, flex: 1 }}>
                {env.desc}
              </p>

              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                  Signal Examples
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {env.moments.map(m => (
                    <div key={m} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 14, height: 1, background: `${env.color}35`, flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)" }}>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {env.demo && (
                <Link href={env.demo.href}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "10px 0", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: env.color, border: `1px solid ${env.color}35`,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${env.color}10`; el.style.borderColor = `${env.color}70`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = `${env.color}35`; }}
                  >
                    {env.demo.label} →
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ padding: "28px 32px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)", display: "flex", alignItems: "flex-start", gap: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", marginTop: 2, whiteSpace: "nowrap" }}>Note</div>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: 0 }}>
            Each environment shares the same RTBX Core infrastructure — signal capture, moment classification, governed response, staff routing, outcome assurance.
            No duplicate systems. No custom builds per environment. The same operating logic, deployed once.
          </p>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
