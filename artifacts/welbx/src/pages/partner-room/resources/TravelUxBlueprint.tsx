import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981", blue: "#3b82f6" };

const ROLES = [
  {
    role: "Guest / Guest View",
    color: "#3b82f6",
    tag: "Guest-facing Experience",
    needs: "Immediate, friction-free support at the right moment — without needing an app, a login or a phone call.",
    action: "Selects from contextual options: check-in help, room issue, dining, welfare support, experience nudge, checkout.",
    signal: "Each selection creates a signal — moment type, action chosen, response received.",
    systemUpdate: "Moment classified and routed. Staff notified. Escalation timer set if needed. Assurance record opened.",
    value: "Guest experience recovered or enhanced. Loyalty protected. Escalation risk reduced.",
  },
  {
    role: "Frontline Staff View",
    color: "#10b981",
    tag: "Operator-facing",
    needs: "Clear, immediate instruction — not a dashboard to search. One guided action per moment.",
    action: "Receives moment card: guest context, issue type, recommended action, escalation timer, completion confirmation.",
    signal: "Response time, action completed, outcome confirmed, escalation triggered or resolved.",
    systemUpdate: "Staff action logged. Assurance record updated. Manager alert cancelled if resolved. Timer stopped.",
    value: "Staff response time reduced. Escalation prevented. Duty-of-care pathway evidenced.",
  },
  {
    role: "Operator / Manager View",
    color: "#c9a84c",
    tag: "Command layer",
    needs: "Live visibility of service risk, recovery progress and unresolved moments across the property.",
    action: "Reviews moment registry, assigns owners, monitors escalation timers, approves recovery actions.",
    signal: "Escalation patterns, staff response rates, unresolved moment count, sentiment trend by section.",
    systemUpdate: "Assignment logged. Priority updated. Alert cleared or escalated. Outcome report updated.",
    value: "Operational risk managed in real time. Staff performance visible. Escalation rate tracked.",
  },
  {
    role: "Executive / Command View",
    color: "#a78bfa",
    tag: "Strategic layer",
    needs: "Pattern intelligence, value proof, property performance comparison and assurance evidence.",
    action: "Reviews environment health score, recovery rate, revenue moments surfaced, assurance records, portfolio comparison.",
    signal: "Environment health score, escalation rate, revenue per moment activated, assurance record completeness.",
    systemUpdate: "Executive report generated. Board-level value proof updated. Pilot outcome data compiled.",
    value: "Investment case evidenced. Operational performance visible at group level. Assurance position protected.",
  },
  {
    role: "Integration Partner View",
    color: "#3b82f6",
    tag: "Technology layer",
    needs: "Clear API surface, signal schema, moment event feed and outcome data for their own product enrichment.",
    action: "Connects their PMS, POS, CRM or workforce platform. Provides signal data. Receives moment triggers and outcome events.",
    signal: "Signal volume delivered, moment triggers received, API uptime, integration health.",
    systemUpdate: "Signal registry updated. Integration health logged. Partner dashboard shows activation volume.",
    value: "Their platform enriched with moment intelligence. Revenue share on signal-driven outcomes.",
  },
  {
    role: "Marketplace Partner View",
    color: "#10b981",
    tag: "Activation layer",
    needs: "Reach guests at the exact moment they are ready to buy — not via push notification or mass marketing.",
    action: "Provides experience, dining, transport or local offer inventory. RTBX Travel routes activation at the right moment.",
    signal: "Offer impression, guest selection, booking or transaction confirmation.",
    systemUpdate: "Marketplace activation logged. Transaction recorded. Revenue share calculated. Partner dashboard updated.",
    value: "Revenue created at the right moment. Offer delivered to the right guest at the right time.",
  },
  {
    role: "Funder / Investor View",
    color: "#f97316",
    tag: "Capital layer",
    needs: "Commercial model clarity, deployment evidence, revenue proof, moat depth and exit pathway logic.",
    action: "Reviews business plan, revenue model, pilot outcomes, partner pipeline, moat analysis and exit pathways.",
    signal: "Pilot conversion rate, revenue per property, deployment rate, partner pipeline velocity.",
    systemUpdate: "Investment thesis updated. Board report compiled. Funding round materials prepared.",
    value: "Investable infrastructure business with recurring revenue, deployment leverage and multiple exit pathways.",
  },
];

export default function TravelUxBlueprint() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · UX Blueprint</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>RTBX Travel — UX Blueprint</h1>
          <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.22)", borderLeft: "3px solid #c9a84c", maxWidth: 700 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              "RTBX Travel makes execution visible by showing what each person sees, does and creates."
            </p>
          </div>
        </div>

        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 1fr 1fr", gap: 0, marginBottom: 2 }}>
          {["Role", "What they need", "What action they take", "Signal captured", "Value created"].map(h => (
            <div key={h} style={{ padding: "10px 14px 10px 16px", fontSize: 7.5, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700 }}>{h}</div>
          ))}
        </div>

        {/* Role rows */}
        <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          {ROLES.map((r, i) => (
            <div key={r.role} style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 1fr 1fr", gap: 0, borderBottom: i < ROLES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
              <div style={{ padding: "18px 14px 18px 16px", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: r.color, lineHeight: 1.3, marginBottom: 4 }}>{r.role}</div>
                <div style={{ fontSize: 7.5, color: r.color, opacity: 0.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{r.tag}</div>
              </div>
              <div style={{ padding: "18px 14px", fontSize: 11, color: C.muted, lineHeight: 1.6, borderRight: "1px solid rgba(255,255,255,0.04)" }}>{r.needs}</div>
              <div style={{ padding: "18px 14px", fontSize: 11, color: C.muted, lineHeight: 1.6, borderRight: "1px solid rgba(255,255,255,0.04)" }}>{r.action}</div>
              <div style={{ padding: "18px 14px", fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, borderRight: "1px solid rgba(255,255,255,0.04)" }}>{r.signal}</div>
              <div style={{ padding: "18px 14px", fontSize: 11, color: "rgba(16,185,129,0.75)", lineHeight: 1.6 }}>{r.value}</div>
            </div>
          ))}
        </div>

        {/* System update note */}
        <div style={{ marginTop: 24, padding: "18px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>What RTBX Core Creates at Every Stage</div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {["Signal classified", "Moment created", "Action routed", "Owner assigned", "Timer tracked", "Assurance record opened", "Outcome logged", "Value evidenced"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(201,168,76,0.4)", flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, color: C.muted }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 48, paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Systems Map", href: "/partner-room/resources/travel-systems-map" },
            { label: "Live Guest Story", href: "/partner-room/guest-demo" },
            { label: "Demo Links", href: "/partner-room/resources/travel-demo-links" },
            { label: "Partnership Overview", href: "/partner-room/resources/travel-partnership-overview" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
