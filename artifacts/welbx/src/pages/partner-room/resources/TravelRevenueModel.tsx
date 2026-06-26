import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981" };

const STREAMS = [
  {
    n: "01",
    label: "Platform Licence",
    type: "Recurring · Annual",
    color: "#c9a84c",
    range: "£8,000–£25,000 / yr",
    basis: "Per property / site / operator",
    desc: "Core platform access — signal layer, moment library, decision spine, assurance registry, WELBX configuration and support.",
    assumptions: "Low = independent hotel (sub-100 rooms). High = multi-site group operator or resort estate.",
    y1: "£80K–£250K (10–20 operators)", y2: "£300K–£1M (30–50 operators)", y3: "£800K–£2.5M (80–100 operators)",
  },
  {
    n: "02",
    label: "Deployment Fee",
    type: "One-off per environment",
    color: "#10b981",
    range: "£5,000–£15,000",
    basis: "Per environment setup and go-live",
    desc: "Configuration, moment mapping, staff pathway design, WELBX setup, test run and go-live support per deployment environment.",
    assumptions: "One-off at pilot-to-live conversion. Scales with environment complexity.",
    y1: "£100K–£300K (20–30 deployments)", y2: "£250K–£750K (50–75 deployments)", y3: "£600K–£1.5M (100–150 deployments)",
  },
  {
    n: "03",
    label: "Active Environment Fee",
    type: "Recurring · Monthly",
    color: "#3b82f6",
    range: "£500–£2,500 / mo",
    basis: "Per live environment",
    desc: "Monthly fee covering live RTBX Core signal processing, moment classification, action routing and assurance registry operations.",
    assumptions: "Scales with environment size and signal volume. Hotels at mid-range. Holiday parks and destination operators at higher end.",
    y1: "£120K–£600K (20 envs)", y2: "£450K–£2.25M (50–75 envs)", y3: "£900K–£4.5M (100+ envs)",
  },
  {
    n: "04",
    label: "Marketplace Revenue Share",
    type: "Transaction · Variable",
    color: "#a78bfa",
    range: "8–15% per transaction",
    basis: "Per activated offer or experience",
    desc: "Revenue share on dining, local experience, transport and partner marketplace transactions activated through RTBX Travel moment routing.",
    assumptions: "Assumes 10–20% of guests activate at least one marketplace offer per stay. Average transaction £40–£150.",
    y1: "Early stage — £20K–£80K", y2: "£150K–£600K (marketplace scaled)", y3: "£500K–£2M (full marketplace)",
  },
  {
    n: "05",
    label: "Loyalty Activation Fee",
    type: "Transaction · Per event",
    color: "#f97316",
    range: "£0.50–£5.00 per activation",
    basis: "Per loyalty moment delivered",
    desc: "Per-event fee for loyalty-tier recognition, recovery offers, repeat-stay prompts and CRM activations triggered through RTBX Travel.",
    assumptions: "Assumes 30–50% of guests receive a loyalty activation per stay. Scales with operator estate size.",
    y1: "£15K–£60K", y2: "£80K–£350K", y3: "£250K–£1M",
  },
  {
    n: "06",
    label: "Intelligence & Reporting",
    type: "Recurring · Annual",
    color: "#22d3ee",
    range: "£12,000–£40,000 / yr",
    basis: "Per operator group or portfolio",
    desc: "Premium environment health dashboards, portfolio comparison, value proof reporting and governance intelligence for group operators and funders.",
    assumptions: "Relevant for multi-property groups (5+ environments) or funders requiring board-level reporting.",
    y1: "£36K–£120K (3–5 groups)", y2: "£150K–£600K (10–20 groups)", y3: "£400K–£1.5M (30–50 groups)",
  },
  {
    n: "07",
    label: "Integration Partner Revenue",
    type: "Recurring + variable",
    color: "#c9a84c",
    range: "£3,000–£10,000 / yr + share",
    basis: "Per integration partner connection",
    desc: "Annual API access fee for technology partners (PMS, POS, CRM, workforce, loyalty). Plus signal-driven revenue share on moment outcomes.",
    assumptions: "10–30 integration partners across 3 years. Revenue share on moment activations driven by partner signal data.",
    y1: "£30K–£100K (10 partners)", y2: "£90K–£300K (20 partners)", y3: "£200K–£600K (30+ partners)",
  },
];

const FORECAST = [
  { period: "Year 1", label: "Proof Phase", low: "£361K", high: "£1.41M", envs: "20–30 environments", note: "Conservative — Hotels & Resorts + Holiday Parks only. Push-first deployment." },
  { period: "Year 2", label: "Expansion Phase", low: "£1.27M", high: "£5.85M", envs: "50–75 environments", note: "Three verticals live. Marketplace layer active. Distribution partner channel open." },
  { period: "Year 3", label: "Scale Phase", low: "£3.65M", high: "£13.1M", envs: "100–150 environments", note: "All five verticals. Intelligence layer monetised. Strategic partner co-distribution." },
];

export default function TravelRevenueModel() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · Revenue Model</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>RTBX Travel — Revenue Model</h1>
          <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.22)", borderLeft: "3px solid #c9a84c", maxWidth: 700 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              "RTBX Travel creates revenue at the platform, deployment, marketplace, intelligence and ecosystem layers."
            </p>
          </div>
          <div style={{ marginTop: 16, padding: "10px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", display: "inline-block" }}>
            <span style={{ fontSize: 10, color: C.dim, fontStyle: "italic" }}>All figures are indicative example assumptions only. Actual commercial terms negotiated per partnership and deployment context.</span>
          </div>
        </div>

        {/* Revenue streams */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Revenue Streams</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {STREAMS.map(s => (
              <div key={s.n} style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "28px 180px 120px 100px 1fr", gap: 0, background: "rgba(255,255,255,0.025)" }}>
                  <div style={{ padding: "14px 0 14px 14px", fontSize: 9, fontWeight: 700, color: s.color, opacity: 0.5 }}>{s.n}</div>
                  <div style={{ padding: "14px 14px", fontSize: 11.5, fontWeight: 700, color: s.color }}>{s.label}</div>
                  <div style={{ padding: "14px 10px", fontSize: 9.5, color: C.dim, fontStyle: "italic" }}>{s.type}</div>
                  <div style={{ padding: "14px 10px", fontSize: 12, fontWeight: 800, color: C.green }}>{s.range}</div>
                  <div style={{ padding: "14px 14px", fontSize: 11, color: C.muted }}>{s.basis}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 1fr 1fr", gap: 0, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <div />
                  <div style={{ padding: "12px 14px", fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, borderRight: "1px solid rgba(255,255,255,0.04)" }}>{s.desc}</div>
                  <div style={{ padding: "12px 14px", fontSize: 10.5, color: "rgba(255,255,255,0.28)", lineHeight: 1.55, borderRight: "1px solid rgba(255,255,255,0.04)" }}>{s.assumptions}</div>
                  <div style={{ padding: "12px 14px", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: 7.5, color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Year 1</div>
                    <div style={{ fontSize: 10.5, color: "rgba(201,168,76,0.7)" }}>{s.y1}</div>
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 7.5, color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Year 2 / 3</div>
                    <div style={{ fontSize: 10.5, color: "rgba(16,185,129,0.7)" }}>{s.y2}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-year forecast */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>3-Year Indicative Forecast</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {FORECAST.map((f, i) => (
              <div key={f.period} style={{ padding: "28px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${i === 0 ? "rgba(201,168,76,0.5)" : i === 1 ? "rgba(16,185,129,0.5)" : "rgba(59,130,246,0.5)"}` }}>
                <div style={{ fontSize: 8, letterSpacing: "0.16em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{f.period}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 16 }}>{f.label}</div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Indicative Revenue Range</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.green, letterSpacing: "-0.01em" }}>{f.low} – {f.high}</div>
                </div>
                <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", marginBottom: 8 }}>Environments: {f.envs}</div>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, margin: 0 }}>{f.note}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: C.dim, fontStyle: "italic" }}>Indicative assumptions only. Actual results depend on deployment rate, environment size, marketplace activation and partner revenue share agreements.</div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Commercial Brief", href: "/partner-room/resources/travel-commercial-partnership-brief" },
            { label: "Commercial Case", href: "/partner-room/resources/travel-commercial-case" },
            { label: "Pilot Model", href: "/partner-room/resources/travel-pilot-model" },
            { label: "Business Plan", href: "/partner-room/resources/travel-business-plan" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
