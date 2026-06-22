import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { usePartnerContent } from "@/context/PartnerContentContext";
import { SEEDED_MOMENTS } from "@/data/moments";

const PARTNER_OPPORTUNITY: Record<string, string> = {
  m1:  "Queue sensor vendors, task management platforms",
  m2:  "PMS vendors, housekeeping platforms",
  m3:  "Housekeeping software, workforce management",
  m4:  "Guest app providers, sentiment analysis tools",
  m5:  "CRM platforms, feedback management tools",
  m6:  "POS systems, RMS vendors, CRM platforms",
  m10: "CRM vendors, loyalty programme operators",
  m12: "Workforce management, scheduling platforms",
  m11: "Guest feedback tools, CRM, review platforms",
};

const UPGRADE_MOMENT = {
  id: "m-upgrade",
  title: "Upgrade/Ancillary Offer Window",
  signals: ["Upsell conversion window", "Rate sensitivity signal", "PMS booking pattern"],
  risk: "Commercial activation window uncaptured, ADR opportunity missed",
  commercialValue: "ADR uplift activated, ancillary revenue captured",
  commercialExposure: "Activation opportunity: confirmed",
  recommendedAction: "Personalised upgrade or ancillary offer at check-in",
};

const MOMENT_IDS = ["m1", "m2", "m3", "m4", "m5", "m6", "m10", "m12", "m11"];

const BASE_MOMENTS = SEEDED_MOMENTS.filter(m => MOMENT_IDS.includes(m.id));

type MomentRow = {
  id: string;
  title: string;
  signals: string[];
  risk: string;
  value: string;
  action: string;
  partner: string;
};

const MOMENT_ROWS: MomentRow[] = [
  ...MOMENT_IDS.map(id => {
    const m = BASE_MOMENTS.find(x => x.id === id)!;
    return {
      id: m.id,
      title: m.title,
      signals: m.signals,
      risk: m.risk,
      value: m.commercialValue ?? m.commercialExposure,
      action: m.recommendedAction,
      partner: PARTNER_OPPORTUNITY[m.id] ?? "",
    };
  }),
  {
    id: UPGRADE_MOMENT.id,
    title: UPGRADE_MOMENT.title,
    signals: UPGRADE_MOMENT.signals,
    risk: UPGRADE_MOMENT.risk,
    value: UPGRADE_MOMENT.commercialValue,
    action: UPGRADE_MOMENT.recommendedAction,
    partner: "PMS vendors, RMS vendors, upsell platforms",
  },
];

export default function PartnerMomentsEconomy() {
  const { content } = usePartnerContent();
  const headline = content?.momentsEconomy?.headline ?? "Every Moment Has a Value.\nMost Are Left Unmanaged.";
  const subheadline = content?.momentsEconomy?.subheadline ?? "A hotel shift generates dozens of moments where the right action, taken at the right time, changes the outcome for the guest and for the property. WELBX detects, classifies, and routes each one — converting the moment economy from a theoretical concept into an operational reality.";

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Moments Economy
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 24, maxWidth: 720 }}>
            {headline.split("\n").map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 680 }}>
            {subheadline}
          </p>
        </div>

        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1.1fr 1fr 1fr 1.1fr", gap: 0, marginBottom: 4 }}>
          {["Moment", "Signals", "Risk If Missed", "Action Triggered", "Value Created / Protected", "Partner Opportunity"].map(h => (
            <div key={h} style={{ padding: "10px 14px", fontSize: 7.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700 }}>
              {h}
            </div>
          ))}
        </div>

        {/* Moment rows */}
        <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          {MOMENT_ROWS.map((row, i) => (
            <div key={row.id} style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr 1.1fr 1fr 1fr 1.1fr",
              gap: 0,
              borderBottom: i < MOMENT_ROWS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
            }}>
              <div style={{ padding: "18px 14px", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{row.title}</div>
                <div style={{ fontSize: 8.5, color: "rgba(201,168,76,0.45)", letterSpacing: "0.08em" }}>MOMENT #{String(i + 1).padStart(2, "0")}</div>
              </div>
              <div style={{ padding: "18px 14px", fontSize: 10.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.55, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                {row.signals.join(" · ")}
              </div>
              <div style={{ padding: "18px 14px", fontSize: 10.5, color: "rgba(255,100,100,0.65)", lineHeight: 1.55, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                {row.risk}
              </div>
              <div style={{ padding: "18px 14px", fontSize: 10.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.55, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                {row.action}
              </div>
              <div style={{ padding: "18px 14px", fontSize: 10.5, color: "rgba(16,185,129,0.75)", lineHeight: 1.55, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                {row.value}
              </div>
              <div style={{ padding: "18px 14px", fontSize: 10.5, color: "rgba(201,168,76,0.65)", lineHeight: 1.55 }}>
                {row.partner}
              </div>
            </div>
          ))}
        </div>

        {/* Summary panel */}
        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {[
            { num: "10",   label: "Core moment types",    sub: "In the standard library" },
            { num: "247",  label: "Signal inputs",         sub: "Across all categories" },
            { num: "<90s", label: "Median response time",  sub: "Signal to routed action" },
            { num: "100%", label: "Outcome records",       sub: "Every moment logged" },
          ].map(stat => (
            <div key={stat.num} style={{
              padding: "28px 24px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: "2px solid rgba(201,168,76,0.3)",
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#c9a84c", marginBottom: 8, letterSpacing: "-0.02em" }}>{stat.num}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
