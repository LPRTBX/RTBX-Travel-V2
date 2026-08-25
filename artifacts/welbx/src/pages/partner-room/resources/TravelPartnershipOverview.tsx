import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", bg: "#080c14", navy: "#0d1220", border: "rgba(255,255,255,0.07)", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", blue: "#3b82f6", green: "#10b981" };

const ENVS = [
  { label: "Hotels & Resorts", color: "#c9a84c", desc: "City hotels, luxury resorts, boutique properties. Guest recovery, loyalty moments, in-stay service and commercial activation.", moat: "Loyalty + concierge revenue" },
  { label: "Holiday Parks & Outdoor Experiences", color: "#10b981", desc: "Caravan parks, cabins, camping, glamping. Family stays, weather disruption, welfare, maintenance and local experience routing.", moat: "Weather + welfare + local partner ecosystem" },
  { label: "Corporate & Business Travel", color: "#3b82f6", desc: "Business hotels, airport stays, conference venues. Repeat guests, duty-of-care, productivity support and silent loyalty execution.", moat: "Duty-of-care + repeat guest recognition" },
  { label: "Events & Venues", color: "#a78bfa", desc: "Concert venues, stadiums, exhibition centres. Crowd flow, incident coordination, accessibility, welfare and real-time staff response.", moat: "Safety + incident prevention + accessibility" },
  { label: "Destination & Tourism Operators", color: "#22d3ee", desc: "DMOs, tourism boards, multi-operator destinations. Visitor journeys, partner marketplace, itinerary activation and destination intelligence.", moat: "Partner ecosystem + destination-level intelligence" },
];

const PARTNER_TYPES = [
  { label: "Operator Partners", color: "#c9a84c", role: "Deploy RTBX Travel in their property or estate", value: "Execution infrastructure, service recovery, staff response, commercial activation", earn: "Reduced operational risk, increased revenue per guest, assurance evidence" },
  { label: "Integration Partners", color: "#3b82f6", role: "Connect their platform (PMS, POS, CRM, workforce) via RTBX Core API", value: "Unlock real-time signal flow from their system into the operating layer", earn: "API revenue share, data partnership, deployment leverage" },
  { label: "Distribution Partners", color: "#a78bfa", role: "Bring RTBX Travel into their client portfolio", value: "Commercial pathway for their vertical clients across accommodation and experience", earn: "Revenue share on platform and deployment fees" },
  { label: "Marketplace Partners", color: "#10b981", role: "Activate services, experiences or local offers via RTBX Travel", value: "Reach guests at the right moment in their stay journey", earn: "Transaction revenue, partner activation fees" },
  { label: "Strategic Partners", color: "#f97316", role: "Co-own deployment in a vertical, geography or asset class", value: "First-mover infrastructure position across a priority deployment vertical", earn: "Equity pathway, vertical exclusivity, revenue co-participation" },
  { label: "Funders & Investors", color: "#c9a84c", role: "Fund the deployment, scale or vertical build-out", value: "Capital into an infrastructure-grade travel execution system", earn: "Revenue participation, equity, exit pathway via strategic acquirer" },
];

const PATHWAY = [
  { n: "01", label: "Pilot Alignment", desc: "8–12 week proof environment. Signal validation, staff pathway setup, shadow mode before going live." },
  { n: "02", label: "Live Pilot", desc: "Full operating cycle. Real guests, real moments, real outcomes. Value measured against baseline." },
  { n: "03", label: "Proof & Reporting", desc: "Outcome report produced. Guest recovery, staff response, revenue created, assurance records evidenced." },
  { n: "04", label: "Expansion Decision", desc: "Scale across portfolio, vertical or geography. Commercial terms formalised. Partner role confirmed." },
  { n: "05", label: "Strategic Partnership", desc: "Long-term platform agreement. Revenue share, co-distribution, integration or investment pathway activated." },
];

export default function TravelPartnershipOverview() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Resource · Partnership Overview
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 20, maxWidth: 720 }}>
            RTBX Travel Partnership Overview
          </h1>
          <div style={{ padding: "18px 22px", background: `${C.gold}08`, border: `1px solid ${C.gold}30`, borderLeft: `3px solid ${C.gold}`, marginBottom: 24, maxWidth: 720 }}>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              "RTBX Travel is not just a travel platform to use. It is an execution ecosystem partners can help deploy, scale and monetise."
            </p>
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 680, margin: 0 }}>
            RTBX Travel is the travel and hospitality deployment vertical of the RTBX Group. It uses RTBX Core infrastructure to detect, classify, route and resolve guest, service, welfare and commercial moments across hotels, resorts, holiday parks, corporate travel, events and destination environments.
          </p>
        </div>

        {/* Architecture strip */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Architecture</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              { label: "RTBX Group", sub: "Parent ecosystem", note: "Owns the infrastructure, IP and vertical strategy across all RTBX deployment verticals.", color: "rgba(255,255,255,0.3)" },
              { label: "RTBX Core", sub: "Signal-to-action engine", note: "The operating infrastructure that powers every RTBX vertical. Signal ingestion, moment classification, decision logic, action routing, assurance.", color: C.gold },
              { label: "RTBX Travel", sub: "Travel vertical", note: "Hotels, resorts, holiday parks, corporate travel, events and destination operators. Deploying RTBX Core across the full travel and hospitality ecosystem.", color: C.gold },
              { label: "Guest Experience", sub: "Guest-facing layer only", note: "The zero-download, no-login guest interface. Surfaces support, recovery and experience options to guests. It is part of RTBX Travel, not the parent brand.", color: C.blue },
            ].map(item => (
              <div key={item.label} style={{ padding: "22px 20px", background: "rgba(255,255,255,0.02)", border: `1px solid ${item.color}25`, borderTop: `2px solid ${item.color}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: item.color, letterSpacing: "0.06em", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{item.sub}</div>
                <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Operating environments */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Travel Operating Environments</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ENVS.map((env, i) => (
              <div key={env.label} style={{ display: "grid", gridTemplateColumns: "28px 220px 1fr 180px", gap: 0, alignItems: "start", border: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <div style={{ padding: "18px 0 18px 18px", fontSize: 9, fontWeight: 700, color: env.color, opacity: 0.5 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ padding: "18px 16px 18px 10px", fontSize: 11.5, fontWeight: 700, color: env.color, lineHeight: 1.3 }}>{env.label}</div>
                <div style={{ padding: "18px 16px", fontSize: 11.5, color: C.muted, lineHeight: 1.65, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{env.desc}</div>
                <div style={{ padding: "18px 16px", fontSize: 10.5, color: C.gold, lineHeight: 1.55, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{env.moat}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner types */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Partner Types</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {PARTNER_TYPES.map(pt => (
              <div key={pt.label} style={{ padding: "24px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${pt.color}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: pt.color, marginBottom: 10, letterSpacing: "0.04em" }}>{pt.label}</div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Role</div>
                  <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.55 }}>{pt.role}</div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Value they unlock</div>
                  <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.55 }}>{pt.value}</div>
                </div>
                <div>
                  <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: C.green, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>What they earn</div>
                  <div style={{ fontSize: 11.5, color: "rgba(16,185,129,0.8)", lineHeight: 1.55 }}>{pt.earn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pilot-to-scale pathway */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Pilot-to-Scale Pathway</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
            {PATHWAY.map(p => (
              <div key={p.n} style={{ padding: "20px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: `${C.gold}60`, letterSpacing: "0.14em", marginBottom: 8 }}>{p.n}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{p.label}</div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer nav */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Commercial Brief", href: "/partner-room/resources/travel-commercial-partnership-brief" },
            { label: "Business Plan", href: "/partner-room/resources/travel-business-plan" },
            { label: "GTM Plan", href: "/partner-room/resources/travel-gtm-plan" },
            { label: "Demo Links", href: "/partner-room/resources/travel-demo-links" },
          ].map(b => (
            <Link key={b.href} href={b.href}>
              <div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div>
            </Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
