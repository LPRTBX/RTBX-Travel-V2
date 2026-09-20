import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", border: "rgba(255,255,255,0.07)", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981" };

const PRIORITY = [
  { n: "01", label: "Hotels & Resorts", color: "#c9a84c", why: "Proposed first environment based on assumed signal density and integration potential; value remains to be measured.", target: "Illustrative target: 10–20 future pilot environments, subject to approval.", demo: "/partner-room/deployments/hotels-resorts/demo" },
  { n: "02", label: "Holiday Parks & Outdoor Experiences", color: "#10b981", why: "Proposed future environment. Welfare and weather signals are hypotheses requiring approved integration and measurement.", target: "Illustrative target: 5–10 future park environments, subject to approval.", demo: "/partner-room/holiday-park-demo" },
  { n: "03", label: "Corporate & Business Travel", color: "#3b82f6", why: "Proposed future environment based on repeat-guest and duty-of-care hypotheses; integration effort is unvalidated.", target: "Illustrative target: 3–5 future partners, subject to approval.", demo: "/partner-room/deployments/corporate-travel/demo" },
  { n: "04", label: "Events & Venues", color: "#a78bfa", why: "Proposed future environment where welfare and safety value would require governance, integration and measurement.", target: "Illustrative target: 2–3 future venue pilots, subject to approval.", demo: "/partner-room/deployments/events-venues/demo" },
  { n: "05", label: "Destination & Tourism Operators", color: "#22d3ee", why: "Future ecosystem hypothesis. Any marketplace offering and vertical evidence are contingent on approval and measured pilots.", target: "Illustrative target: 1–2 potential Year 2 pilots, subject to approval.", demo: "/partner-room/deployments/destination-tourism/demo" },
];

const CONV_SEQUENCE = [
  { n: "01–05", label: "Potential proof operators", desc: "Illustrative outreach target for independent hotel or park operators that may consider an approved shadow pilot. No commitment or validated signal outcome is implied." },
  { n: "06–10", label: "Potential commercial pilots", desc: "Illustrative future conversations about paid pilots, subject to agreed terms, approvals and subsequent measurement." },
  { n: "11–15", label: "Potential distribution conversations", desc: "Illustrative conversations with possible PMS, hospitality technology or distribution partners, contingent on their approval." },
  { n: "16–18", label: "Potential integration partners", desc: "Illustrative future API-integration targets; no integration exists until approved and implemented." },
  { n: "19–20", label: "Potential strategic partners", desc: "Illustrative future conversations; co-ownership, funding and exclusivity require separate agreement." },
];

const PILOT_PHASES = [
  { label: "Week 1–2", title: "Proposed Operator Alignment", desc: "Proposed moment mapping, candidate signal-source identification and pathway design, subject to approval." },
  { label: "Week 3–4", title: "Proposed Shadow Pilot", desc: "A future approved shadow pilot could run in parallel with no live delivery; signal validation remains contingent on integration." },
  { label: "Week 5–8", title: "Proposed Live Pilot", desc: "Future guest, staff and pathway participation only after approval, integration and governance sign-off." },
  { label: "Week 9–10", title: "Proposed Outcome Measurement", desc: "Potential baseline comparison for recovery, response, revenue hypotheses and assurance records." },
  { label: "Week 11+", title: "Future Expansion Decision", desc: "Any scale-up requires approved pilot evidence, measurement and a separate commercial agreement." },
];

export default function TravelGtmPlan() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · Go-To-Market Plan</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>RTBX Travel — Go-To-Market Plan</h1>
          <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.22)", borderLeft: "3px solid #c9a84c", maxWidth: 680 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
               "Focus first on approved pilots to measure value hypotheses, then consider future expansion across travel ecosystems."
            </p>
          </div>
        </div>
        <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: "3px solid #c9a84c", marginBottom: 28, maxWidth: 900 }}>
          <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 7 }}>Planned Go-To-Market Model</div>
          <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>This is a synthetic, forward-looking planning model. Pilot, live, integration, signal, offer, revenue and expansion language describes future possibilities only, contingent on partner approval, implementation, governance and measurement. Named people remain accountable for every decision.</div>
        </div>

        {/* Beachhead */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Beachhead Strategy</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 2 }}>
            {[
              { label: "Proposed entry point", text: "Hotels & Resorts — a proposed first environment based on assumed signal density and operational need; no value claim is proven." },
              { label: "Proposed proof method", text: "Illustrative 8–10 week shadow then approved live-pilot pathway. Integration scope and timing require agreement." },
              { label: "Proposed proof output", text: "Potential outcome measurement per environment: recovery, escalation, revenue-opportunity, response-time and assurance hypotheses." },
              { label: "Potential expansion trigger", text: "Measured, approved pilot evidence could inform future distribution conversations; it does not guarantee expansion." },
            ].map(item => (
              <div key={item.label} style={{ padding: "20px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: C.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{item.label}</div>
                <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority environments */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Priority Sequence — Deployment Environments</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PRIORITY.map(env => (
              <div key={env.n} style={{ display: "grid", gridTemplateColumns: "32px 200px 1fr 160px", gap: 0, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ padding: "20px 0 20px 18px", fontSize: 9, fontWeight: 700, color: env.color, opacity: 0.5 }}>{env.n}</div>
                <div style={{ padding: "20px 14px 20px 10px" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: env.color, lineHeight: 1.3, marginBottom: 4 }}>{env.label}</div>
                  <div style={{ fontSize: 10.5, color: C.dim }}>{env.target}</div>
                </div>
                <div style={{ padding: "20px 16px", fontSize: 11.5, color: C.muted, lineHeight: 1.6, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{env.why}</div>
                <div style={{ padding: "20px 16px", borderLeft: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center" }}>
                  <Link href={env.demo}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: env.color, cursor: "pointer" }}>Run Demo →</div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* First 20 conversations */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Illustrative First 20 Partner Conversations</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {CONV_SEQUENCE.map(c => (
              <div key={c.n} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 0, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ padding: "18px 16px", fontSize: 11, fontWeight: 700, color: C.gold, display: "flex", alignItems: "center" }}>{c.n}</div>
                <div style={{ padding: "18px 16px", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{c.label}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pilot pathway */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Pilot Pathway Timeline</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
            {PILOT_PHASES.map((p, i) => (
              <div key={p.label} style={{ padding: "20px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(201,168,76,0.3)" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: `rgba(201,168,76,${0.35 + i * 0.12})`, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{p.label}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{p.title}</div>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Partnership Overview", href: "/partner-room/resources/travel-partnership-overview" },
            { label: "Pilot Model", href: "/partner-room/resources/travel-pilot-model" },
            { label: "Commercial Case", href: "/partner-room/resources/travel-commercial-case" },
            { label: "Demo Links", href: "/partner-room/resources/travel-demo-links" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
