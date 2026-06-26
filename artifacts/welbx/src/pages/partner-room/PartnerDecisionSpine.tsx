import { useState } from "react";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 2 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.62)" }}>{label}</div>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
          background: value ? "#10b981" : "rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%",
          background: "#fff", transition: "left 0.2s",
        }} />
      </div>
    </div>
  );
}

function Select({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 2 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {options.map(o => (
          <div
            key={o}
            onClick={() => onChange(o)}
            style={{
              padding: "6px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
              cursor: "pointer", transition: "all 0.12s",
              border: `1px solid ${o === value ? "#c9a84c50" : "rgba(255,255,255,0.08)"}`,
              background: o === value ? "rgba(201,168,76,0.12)" : "transparent",
              color: o === value ? "#c9a84c" : "rgba(255,255,255,0.35)",
            }}
          >{o}</div>
        ))}
      </div>
    </div>
  );
}

function ResultRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "14px 0" }}>
      <div style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, paddingRight: 16, paddingTop: 2 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: color || "rgba(255,255,255,0.72)", fontWeight: 600, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

type Sentiment = "Low" | "Medium" | "High";
interface Decision {
  classification: string;
  decision: string;
  intervention: string;
  owner: string;
  escalation: string;
  assurance: string;
  riskColor: string;
}

function getDecision(delay: "Under 15 min" | "Over 15 min", children: boolean, weather: boolean, sentiment: Sentiment): Decision {
  const isComplex = weather && children;
  const isHigh = sentiment === "High";
  const isMed = sentiment === "Medium";

  if (delay === "Over 15 min" && isHigh && isComplex) {
    return {
      classification: "ARRIVAL_DISRUPTION · Critical · Multi-factor · L3",
      decision: "Emergency relief protocol — family welfare priority + full compensation pre-approved",
      intervention: "Duty manager personal contact · Temporary accommodation activated · Activity vouchers + meal comp issued immediately",
      owner: "Duty Manager (personal ownership)",
      escalation: "General Manager notified · Corporate account manager on standby · Legal hold protocol initiated",
      assurance: "Full incident record · Evidence trail · GM sign-off required · Guest outcome documented",
      riskColor: "#ef4444",
    };
  }
  if (delay === "Over 15 min" && (isHigh || (isMed && children))) {
    return {
      classification: "ARRIVAL_FRICTION · Escalated · Family impact · L2",
      decision: "Escalated family relief — manager contact + full activity package + F&B comp",
      intervention: "Manager personally greets family · Kids activity pack issued · Full cabin fee waived for Day 1 · Priority cabin assignment",
      owner: "Shift Manager + Front Desk Lead",
      escalation: "Operations manager alerted in 15 min if unresolved · Review at EOD",
      assurance: "Moment record created · Manager sign-off required · Compensation log attached",
      riskColor: "#f97316",
    };
  }
  if (delay === "Over 15 min") {
    return {
      classification: "ARRIVAL_FRICTION · Standard · Delay 15m+ · L1",
      decision: "Proactive delay management — comfort provisions + activity voucher",
      intervention: "Welcome pack delivered to waiting area · Activity voucher (A$40) issued · ETA communicated every 10 min",
      owner: "Front Desk (senior staff)",
      escalation: "Duty manager alert if delay exceeds 30 min or sentiment drops",
      assurance: "Delay logged · Voucher recorded · Resolution confirmation required",
      riskColor: "#f97316",
    };
  }
  if (weather && children) {
    return {
      classification: "WEATHER_DISRUPTION · Family · Outdoor activity risk · L1",
      decision: "Weather contingency — indoor family alternatives activated",
      intervention: "Indoor family activities opened · WELBX message with alternatives sent · Outdoor sessions rescheduled",
      owner: "Activities Team + Front Desk",
      escalation: "Escalate if weather worsens or guest sentiment drops below threshold",
      assurance: "Activity change logged · Guest acceptance recorded · Refund option open",
      riskColor: "#3b82f6",
    };
  }
  return {
    classification: "ARRIVAL_FRICTION · Standard · Minor delay · L1",
    decision: "Proactive communication — friendly update + drinks voucher",
    intervention: "WELBX message sent with ETA + drinks voucher (A$15) · No staff reassignment required",
    owner: "Front Desk (standard)",
    escalation: "Escalate if delay exceeds 15 min or guest makes direct complaint",
    assurance: "Delay noted · Voucher issued · No further action unless escalated",
    riskColor: "#10b981",
  };
}

export default function PartnerDecisionSpine() {
  const [delay, setDelay] = useState<"Under 15 min" | "Over 15 min">("Under 15 min");
  const [children, setChildren] = useState(false);
  const [weather, setWeather] = useState(false);
  const [sentiment, setSentiment] = useState<Sentiment>("Low");

  const result = getDecision(delay, children, weather, sentiment);

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Product Proof · Decision & Action Layer
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>
            Decision Spine Demo
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 560 }}>
            Scenario: Holiday Park family arrival disruption. Adjust the inputs — RTBX Core responds with the correct classification, decision, intervention and assurance path.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 2 }}>
          {/* Inputs */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 14, paddingLeft: 2 }}>Scenario Inputs</div>
            <Select
              label="Cabin delay"
              options={["Under 15 min", "Over 15 min"]}
              value={delay}
              onChange={v => setDelay(v as "Under 15 min" | "Over 15 min")}
            />
            <Toggle label="Children present" value={children} onChange={setChildren} />
            <Toggle label="Weather disruption active" value={weather} onChange={setWeather} />
            <Select
              label="Guest sentiment risk"
              options={["Low", "Medium", "High"]}
              value={sentiment}
              onChange={v => setSentiment(v as Sentiment)}
            />

            <div style={{ marginTop: 16, padding: "16px 16px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Active Conditions</div>
              {[
                { label: "Delay", value: delay, active: delay === "Over 15 min" },
                { label: "Children", value: children ? "Yes" : "No", active: children },
                { label: "Weather", value: weather ? "Active" : "Clear", active: weather },
                { label: "Sentiment", value: sentiment, active: sentiment !== "Low" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.active ? result.riskColor : "rgba(255,255,255,0.15)", flexShrink: 0, marginTop: 3 }} />
                  <div style={{ fontSize: 11, color: c.active ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.28)" }}>
                    <span style={{ fontWeight: 700 }}>{c.label}:</span> {c.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Output */}
          <div style={{ padding: "28px 28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${result.riskColor}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: result.riskColor, border: `1px solid ${result.riskColor}40`, padding: "4px 12px" }}>
                {result.classification.split("·").pop()?.trim()}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>RTBX Core Decision Output</div>
            </div>

            <ResultRow label="Classification"       value={result.classification}  color={result.riskColor} />
            <ResultRow label="Recommended Decision" value={result.decision} />
            <ResultRow label="Intervention"         value={result.intervention} />
            <ResultRow label="Assigned Owner"       value={result.owner} color="#c9a84c" />
            <ResultRow label="Escalation Threshold" value={result.escalation} color="#f97316" />
            <ResultRow label="Assurance Record"     value={result.assurance} color="#a78bfa" />

            <div style={{ marginTop: 24, padding: "14px 16px", background: `${result.riskColor}08`, border: `1px solid ${result.riskColor}20`, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: result.riskColor, flexShrink: 0, marginTop: 3 }} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
                This decision was selected from the RTBX Core playbook in &lt;200ms. Every input combination produces a governed, auditable response — no manual triage required.
              </div>
            </div>
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
