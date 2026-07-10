import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", border: "rgba(255,255,255,0.07)", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", blue: "#3b82f6", green: "#10b981", red: "rgba(239,68,68,0.65)" };

const PROBLEMS = [
  "PMS systems know what was booked. They don't know what is happening right now.",
  "Staff receive SOPs for what to do in a situation. They don't receive real-time guidance when that situation is actually occurring.",
  "Guest issues are logged in post-stay reviews. The escalation that created them is never caught in the moment.",
  "Welfare signals — a solo traveller at 2am, an unaccompanied minor, a distressed guest — go unrouted because there is no real-time classification system.",
  "Commercial moments — the guest who is free for 2 hours before dinner — are missed because no system is watching for them.",
  "Operators have dashboards. They don't have live operating intelligence.",
];

const MOATS = [
  { label: "Signal Library", desc: "247+ configured travel signal types — built to be environment-specific and deployment-ready." },
  { label: "Moment Classification Logic", desc: "Classification logic that converts captured signals into classified moments with governed responses." },
  { label: "Decision Spine", desc: "Intervention logic that applies the right response threshold across guest, welfare, recovery and commercial moment types." },
  { label: "Assurance Registry", desc: "Every moment, action and outcome logged. Evidence for operators, funders, regulators and guests." },
  { label: "Deployment Speed", desc: "Push-first, no-heavy-integration entry. A pilot can start in weeks, not months." },
  { label: "WELBX Guest Layer", desc: "Zero-download, no-login guest-facing experience layer used to surface support, recovery and experience options." },
];

const ROADMAP = [
  { period: "Year 1", label: "Beachhead & Proof", items: ["Hotels & Resorts: 10–20 live pilot environments", "Holiday Parks: 5–10 environments", "Validated outcome reports across both verticals", "First integration partners connected", "Distribution partner pathway launched"] },
  { period: "Year 2", label: "Vertical Expansion", items: ["Corporate Travel deployment live", "Events & Venues first pilots", "Marketplace layer activated", "Partner revenue share operational", "25–50 active environments across 3+ verticals"] },
  { period: "Year 3", label: "Ecosystem Scale", items: ["Destination & Tourism Operators launched", "100+ active environments", "Intelligence layer monetised", "Strategic partner co-distribution active", "Series A or strategic acquirer pathway open"] },
];

const STACK = [
  { label: "Guest Experience OS", sub: "WELBX-powered", items: ["Check-in pathways", "Welfare prompts", "In-stay nudges", "Post-stay sentiment"] },
  { label: "Service Recovery OS", sub: "Staff & operator", items: ["Moment classification", "Staff action routing", "Recovery playbooks", "Escalation rules"] },
  { label: "Marketplace & Loyalty OS", sub: "Commercial", items: ["Local experience offers", "Dining activation", "Partner marketplace", "Repeat-stay pathways"] },
  { label: "Operator Intelligence OS", sub: "Command layer", items: ["Moment registry", "Signal registry", "Value proof", "Environment health"] },
];

export default function TravelBusinessPlan() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · Business Plan</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 20, maxWidth: 720 }}>RTBX Travel — Business Plan</h1>
          <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.25)", borderLeft: "3px solid #c9a84c", marginBottom: 24, maxWidth: 680 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              "The gap is not lack of systems. The gap is real-time execution across guest, staff, service, welfare, recovery and commercial moments."
            </p>
          </div>
        </div>

        {/* Executive summary */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Executive Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {[
              { label: "What RTBX Travel is", text: "A real-time signal-to-action infrastructure layer deployed across the travel and hospitality sector. Powered by RTBX Core. Surfaced to guests via WELBX." },
              { label: "What problem it solves", text: "Operators have PMS, booking engines, CRMs, dashboards and SOPs. They do not have a real-time execution system that acts when a signal becomes a moment." },
              { label: "How it makes money", text: "Platform licensing, property deployment fees, marketplace revenue share, loyalty activation fees, intelligence reporting and partner distribution models." },
              { label: "Who the partners are", text: "Operators, integration platforms, distributors, marketplace partners, strategic co-owners and funders. Each with a distinct commercial pathway." },
            ].map(item => (
              <div key={item.label} style={{ padding: "22px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: C.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{item.label}</div>
                <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Problem */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>The Problem in Travel & Hospitality</div>
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            {PROBLEMS.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 0, borderBottom: i < PROBLEMS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <div style={{ width: 28, flexShrink: 0, display: "flex", alignItems: "flex-start", padding: "16px 0 16px 16px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.red, marginTop: 4 }} />
                </div>
                <div style={{ padding: "16px 16px 16px 8px", fontSize: 12.5, color: C.muted, lineHeight: 1.65 }}>{p}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product stack */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Product Stack — RTBX Travel Head Systems</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {STACK.map(s => (
              <div key={s.label} style={{ padding: "22px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(201,168,76,0.4)" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", marginBottom: 4, lineHeight: 1.3 }}>{s.label}</div>
                <div style={{ fontSize: 8, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>{s.sub}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {s.items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 1, background: "rgba(201,168,76,0.35)", flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: C.muted }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moats */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Competitive Moats</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {MOATS.map(m => (
              <div key={m.label} style={{ padding: "20px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, marginBottom: 8 }}>{m.label}</div>
                <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>3-Year Roadmap</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {ROADMAP.map((r, i) => (
              <div key={r.period} style={{ padding: "24px 22px", background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.06)`, borderTop: `2px solid ${i === 0 ? "rgba(201,168,76,0.5)" : i === 1 ? "rgba(16,185,129,0.5)" : "rgba(59,130,246,0.5)"}` }}>
                <div style={{ fontSize: 8, letterSpacing: "0.16em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{r.period}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 16 }}>{r.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {r.items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ width: 10, height: 1, background: "rgba(201,168,76,0.3)", flexShrink: 0, marginTop: 8 }} />
                      <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "GTM Plan", href: "/partner-room/resources/travel-gtm-plan" },
            { label: "Commercial Case", href: "/partner-room/resources/travel-commercial-case" },
            { label: "Revenue Model", href: "/partner-room/resources/travel-revenue-model" },
            { label: "Pilot Model", href: "/partner-room/resources/travel-pilot-model" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
