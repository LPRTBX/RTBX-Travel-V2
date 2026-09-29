import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#a8dedb", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981", blue: "#3b82f6" };

const ROLES = [
  {
    role: "Guest / Guest View",
    color: "#3b82f6",
    tag: "Guest-facing Experience",
    needs: "Planned support hypothesis at an appropriate moment, subject to approved journey design and integration.",
    action: "Would select from proposed contextual options: check-in help, room issue, dining, welfare support, experience nudge or checkout.",
    signal: "A future approved selection could provide a signal for measurement — no live signal is captured here.",
    systemUpdate: "A proposed moment could be classified and drafted for routing after approval and integration.",
    value: "Potential guest-experience and loyalty hypothesis, contingent on pilot measurement.",
  },
  {
    role: "Frontline Staff View",
    color: "#10b981",
    tag: "Operator-facing",
    needs: "Clear, immediate instruction — not a dashboard to search. One guided action per moment.",
    action: "Receives moment card: guest context, issue type, recommended action, escalation timer, completion confirmation.",
    signal: "Response time, action completed, outcome confirmed, escalation triggered or resolved.",
    systemUpdate: "A future approved staff action could be logged; this working proof sends no staff notifications.",
    value: "Potential response-time and duty-of-care hypothesis, contingent on deployment and measurement.",
  },
  {
    role: "Operator / Manager View",
    color: "#a8dedb",
    tag: "Command layer",
    needs: "Planned visibility of service-risk hypotheses, subject to operator approval, integration and measurement.",
    action: "Could review a future moment registry and approve actions; human accountability remains required.",
    signal: "Potential future measures: escalation patterns, staff response rates and unresolved-moment counts.",
    systemUpdate: "Future assignments and reports would require approved integration; no records are updated here.",
    value: "Potential operational-risk insight, to be tested and measured in an approved pilot.",
  },
  {
    role: "Executive / Command View",
    color: "#a78bfa",
    tag: "Strategic layer",
    needs: "Planned pattern intelligence and value hypotheses, contingent on approved measurement.",
    action: "Reviews environment health score, recovery rate, revenue moments surfaced, assurance records, portfolio comparison.",
    signal: "Environment health score, escalation rate, revenue per moment activated, assurance record completeness.",
    systemUpdate: "Future reporting could be generated from approved, integrated and measured pilot data.",
    value: "Potential investment-case evidence, not current proof or measured performance.",
  },
  {
    role: "Integration Partner View",
    color: "#3b82f6",
    tag: "Technology layer",
    needs: "Clear API surface, signal schema, moment event feed and outcome data for their own product enrichment.",
    action: "Could connect PMS, POS, CRM or workforce platforms following approval and integration.",
    signal: "Future candidate measures include signal volume, API uptime and integration health.",
    systemUpdate: "No integration or registry update occurs in this proof; future updates require approved implementation.",
    value: "Potential enrichment and revenue-share model, contingent on integration and measured outcomes.",
  },
  {
    role: "Marketplace Partner View",
    color: "#10b981",
    tag: "Activation layer",
    needs: "Reach guests at the exact moment they are ready to buy — not via push notification or mass marketing.",
    action: "Could provide offer inventory for a future approved marketplace integration.",
    signal: "Future measures could include offer impressions, selections and confirmed transactions.",
    systemUpdate: "No offer is activated, transaction recorded or revenue share calculated in this proof.",
    value: "Potential offer and revenue hypothesis, contingent on approval, integration and measurement.",
  },
  {
    role: "Strategic Sponsor View",
    color: "#f97316",
    tag: "Capital layer",
    needs: "Commercial model clarity, deployment evidence, revenue proof, moat depth and exit pathway logic.",
    action: "Could review planned business and pilot materials as they are approved and measured.",
    signal: "Future candidate measures include pilot conversion, revenue per property and deployment rate.",
    systemUpdate: "No strategic sponsorship or board materials are updated by this working proof.",
    value: "Forward-looking business-model hypothesis, not an established revenue or deployment claim.",
  },
];

export default function TravelUxBlueprint() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · UX Blueprint</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>JALDO Travel — UX Blueprint</h1>
          <div style={{ padding: "16px 20px", background: "rgba(168,222,219,0.06)", border: "1px solid rgba(168,222,219,0.22)", borderLeft: "3px solid #a8dedb", maxWidth: 700 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              "JALDO Travel makes execution visible by showing what each person sees, does and creates."
            </p>
          </div>
        </div>
        <div style={{ padding: "16px 20px", background: "rgba(168,222,219,0.05)", border: "1px solid rgba(168,222,219,0.2)", borderLeft: "3px solid #a8dedb", marginBottom: 28, maxWidth: 900 }}>
          <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 7 }}>Working Proof Boundary</div>
          <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>This blueprint is a synthetic future-state simulation. Any live workflow, pilot, signal, offer, integration, transaction or revenue outcome is contingent on approval, implementation, integration and measurement. No dispatches or external updates occur here, and named people retain accountability.</div>
        </div>

        <div className="rtbx-table-scroll">
        <div style={{ minWidth: 720 }}>
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
        </div>
        </div>

        {/* System update note */}
        <div style={{ marginTop: 24, padding: "18px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Proposed Future-State Outputs</div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {["Signal classification draft", "Proposed moment", "Proposed action route", "Human owner assignment", "Potential timer", "Proposed assurance record", "Future outcome measurement", "Value hypothesis"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(168,222,219,0.4)", flexShrink: 0 }} />
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
