import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", border: "rgba(255,255,255,0.07)", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981" };

const PRIORITY = [
  { n: "01", label: "Hotels & Resorts", color: "#c9a84c", why: "Highest signal density, clearest value proof, most likely early adopter operators. Existing PMS and guest tech creates rich integration surface.", target: "10–20 pilot environments. Target: 3-star+ independent and boutique hotel groups.", demo: "/partner-room/deployments/hotels-resorts/demo" },
  { n: "02", label: "Holiday Parks & Outdoor Experiences", color: "#10b981", why: "High family volume, seasonal disruption cycles, under-served by existing tech. Welfare and weather signals create immediately visible value.", target: "5–10 park environments. Target: mid-size UK and European park operators.", demo: "/partner-room/holiday-park-demo" },
  { n: "03", label: "Corporate & Business Travel", color: "#3b82f6", why: "Repeat guest value, duty-of-care obligation, corporate travel management company distribution channel. Lower integration overhead per guest.", target: "3–5 corporate travel hotel partners. Target: business hotels and extended-stay properties.", demo: "/partner-room/deployments/corporate-travel/demo" },
  { n: "04", label: "Events & Venues", color: "#a78bfa", why: "High-density, high-risk environments. Welfare, safety and crowd management create visible, auditable value. Insurance and liability angle.", target: "2–3 venue pilots. Target: mid-size event venues and exhibition centres.", demo: "/partner-room/deployments/events-venues/demo" },
  { n: "05", label: "Destination & Tourism Operators", color: "#22d3ee", why: "Largest ecosystem opportunity. Partner marketplace at scale. Requires earlier vertical proof before leading with destination plays.", target: "1–2 DMO or destination-level pilots in Year 2.", demo: "/partner-room/deployments/destination-tourism/demo" },
];

const CONV_SEQUENCE = [
  { n: "01–05", label: "Proof operators", desc: "5 independent hotel or park operators willing to run a shadow pilot. No revenue commitment. Just signal validation and outcome observation." },
  { n: "06–10", label: "First commercial pilots", desc: "5 operators who agree to a paid pilot on defined terms. Outcome report produced. Commercial pathway opened." },
  { n: "11–15", label: "Distribution conversations", desc: "5 conversations with PMS vendors, hospitality tech platforms or distribution partners who can bring RTBX Travel to their client portfolio." },
  { n: "16–18", label: "Integration partners", desc: "3 platform API integrations that enrich signal quality — PMS, POS, workforce management or CRM." },
  { n: "19–20", label: "Strategic partners", desc: "2 conversations with strategic co-ownership or funding interest. Vertical-level or geographic exclusivity framing." },
];

const PILOT_PHASES = [
  { label: "Week 1–2", title: "Operator Alignment", desc: "Moment mapping, signal source identification, staff and guest pathway design." },
  { label: "Week 3–4", title: "Shadow Pilot", desc: "RTBX Core runs in parallel — no live delivery to guests or staff yet. Signal validation only." },
  { label: "Week 5–8", title: "Live Pilot", desc: "Real guests, real staff, real moments. Recovery, welfare, commercial and concierge pathways active." },
  { label: "Week 9–10", title: "Outcome Report", desc: "Value evidenced against baseline. Guest recovery, staff response, revenue created, assurance records." },
  { label: "Week 11+", title: "Expansion Decision", desc: "Scale to full estate, additional vertical, or strategic partnership formalisation." },
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
              "Focus first. Prove value in live travel environments. Expand across accommodation, experience and destination ecosystems."
            </p>
          </div>
        </div>

        {/* Beachhead */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Beachhead Strategy</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 2 }}>
            {[
              { label: "Entry point", text: "Hotels & Resorts — highest signal density, clearest value proof, existing operational pain that RTBX Core directly addresses." },
              { label: "Proof method", text: "8–10 week shadow then live pilot. No heavy integration required to start. Push-first signal model means a pilot can begin within weeks of agreement." },
              { label: "Proof output", text: "Outcome report per environment: guest recovery rate, escalations prevented, revenue moments surfaced, staff response time, assurance records created." },
              { label: "Expansion trigger", text: "Two successful pilots create the proof case for category-level distribution conversations with technology partners and hospitality groups." },
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
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>First 20 Partner Conversations</div>
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
