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
    <div className="rtbx-stack-mobile" style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "14px 0" }}>
      <div style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, paddingRight: 16, paddingTop: 2 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: color || "rgba(255,255,255,0.72)", fontWeight: 600, lineHeight: 1.5, minWidth: 0, overflowWrap: "anywhere" }}>{value}</div>
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
      decision: "Illustrative emergency relief recommendation — family welfare priority + compensation subject to named human approval",
      intervention: "Draft duty-manager contact · Modelled temporary accommodation and voucher options · Nothing activated or issued",
      owner: "Duty Manager (personal ownership)",
      escalation: "Illustrative escalation to General Manager and corporate account manager · No notification sent",
      assurance: "Illustrative incident record and evidence requirements · GM sign-off would be required · No outcome recorded",
      riskColor: "#ef4444",
    };
  }
  if (delay === "Over 15 min" && (isHigh || (isMed && children))) {
    return {
      classification: "ARRIVAL_FRICTION · Escalated · Family impact · L2",
      decision: "Illustrative family-relief recommendation — manager contact, activity package and F&B compensation for approval",
      intervention: "Modelled manager greeting, activity pack, fee waiver and priority cabin assignment · Nothing issued",
      owner: "Shift Manager + Front Desk Lead",
      escalation: "Rules would propose Operations Manager review at 15 min · No alert sent",
      assurance: "Illustrative moment record and compensation-log requirements · Manager sign-off required",
      riskColor: "#f97316",
    };
  }
  if (delay === "Over 15 min") {
    return {
      classification: "ARRIVAL_FRICTION · Standard · Delay 15m+ · L1",
      decision: "Proactive delay management — comfort provisions + activity voucher",
      intervention: "Draft welcome-pack, A$40 voucher and ten-minute ETA communication options · Nothing delivered or issued",
      owner: "Front Desk (senior staff)",
      escalation: "Duty manager alert if delay exceeds 30 min or sentiment drops",
      assurance: "Illustrative delay and voucher evidence requirements · Resolution would require human confirmation",
      riskColor: "#f97316",
    };
  }
  if (weather && children) {
    return {
      classification: "WEATHER_DISRUPTION · Family · Outdoor activity risk · L1",
      decision: "Illustrative weather-contingency recommendation — indoor family alternatives for human approval",
      intervention: "Draft indoor-activity, guest-message and rescheduling options · Nothing opened, sent or rescheduled",
      owner: "Activities Team + Front Desk",
      escalation: "Escalate if weather worsens or guest sentiment drops below threshold",
      assurance: "Illustrative activity-change, guest-acceptance and refund evidence requirements",
      riskColor: "#3b82f6",
    };
  }
  return {
    classification: "ARRIVAL_FRICTION · Standard · Minor delay · L1",
    decision: "Proactive communication — friendly update + drinks voucher",
    intervention: "Guest Channel draft shown with ETA + modelled drinks voucher (A$15) · Operator confirmation required; no message dispatched",
    owner: "Front Desk (standard)",
    escalation: "Escalate if delay exceeds 15 min or guest makes direct complaint",
    assurance: "Illustrative delay and voucher evidence requirements · No outcome recorded",
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
            Scenario: Holiday Park family arrival disruption. Adjust synthetic inputs to see a deterministic, rules-based classification and illustrative recommendation.
          </p>
        </div>

        {/* Decision Chain */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
            The JALDO Core Decision Spine — Travel Configuration
          </div>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 640, marginBottom: 28 }}>
            This diagram illustrates the intended chain before any real action. Travel policies would configure the shared Decision Spine; this Working Proof does not execute it.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 780 }}>
            {[
              { n: "01", label: "Synthetic Signal", desc: "Synthetic signals are combined for deterministic, rules-based classification in this demonstration." },
              { n: "02", label: "Illustrative Context", desc: "The local model assembles synthetic context without reading guest, property or external-system data." },
              { n: "03", label: "Governance Source", desc: "The model identifies an applicable policy source, such as a recovery policy or approval matrix." },
              { n: "04", label: "Rule Evaluated", desc: "A deterministic rule models what response could be permitted." },
              { n: "05", label: "Threshold Modelled", desc: "Synthetic risk and modelled value are compared with configured demonstration thresholds." },
              { n: "06", label: "Permission Path Proposed", desc: "The model proposes a permission or escalation path; it does not grant operational authority." },
              { n: "07", label: "Human Approval Required", desc: "A named human retains approval accountability. The demonstration cannot approve a real response." },
              { n: "08", label: "Accountable Role Proposed", desc: "A named human role is shown as accountable; no autonomous system owns or performs the response." },
              { n: "09", label: "Draft Action Prepared", desc: "An illustrative recommendation and unsent communication draft are prepared for human review." },
              { n: "10", label: "Evidence Requirements", desc: "The demonstration shows illustrative evidence requirements; it does not create an evidence record or record an outcome." },
            ].map((item, i, arr) => (
              <div key={item.n} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#c9a84c", flexShrink: 0, marginTop: 4 }} />
                  {i < arr.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 32, background: "rgba(201,168,76,0.2)" }} />}
                </div>
                <div style={{ paddingBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: "rgba(201,168,76,0.4)", letterSpacing: "0.08em" }}>{item.n}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{item.label}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 640 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Governance Sources */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
            Travel Policies Configure the Shared Decision Spine
          </div>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 640, marginBottom: 24 }}>
            These are illustrative governance sources that could configure the shared Decision Spine in a future governed deployment.
          </p>
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {[
              { label: "Guest Service Recovery Policy", desc: "Defines compensation levels, recovery pathway requirements and SLA thresholds for service failure moments. Determines what the front desk may resolve independently and what requires manager authorisation.", color: "#c9a84c" },
              { label: "Compensation Approval Matrix", desc: "Sets approval authority by role and compensation value. Monetary compensation above defined thresholds requires a named authoriser. AI may not approve any compensation.", color: "#3b82f6" },
              { label: "Critical Incident Procedure", desc: "Mandates immediate escalation path for welfare, safety or legal moments. No autonomous AI action permitted. Named duty manager must own every critical incident response.", color: "#ef4444" },
              { label: "Privacy & Consent Rules", desc: "Governs what guest data may be captured, processed and acted on under what consent conditions. Welfare signals require privacy-safe handling. No guest data used without authorised consent.", color: "#a78bfa" },
            ].map(item => (
              <div key={item.label} style={{ padding: "22px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${item.color}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{item.label}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #c9a84c", marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
            <strong style={{ color: "#c9a84c" }}>Working Proof · Simulation boundary:</strong> controls below change synthetic inputs in local state only. Classification is deterministic and rules-based. Recommendations, interventions, evidence and outcomes are illustrative; communications remain unsent drafts, value is not measured, and no external system is updated. Named humans retain approval and action accountability.
          </div>
        </div>

        {/* Interactive demo */}
        <div className="rtbx-stack-mobile" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 2 }}>
          {/* Inputs */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", fontWeight: 700, marginBottom: 14, paddingLeft: 2 }}>Synthetic Scenario Inputs</div>
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
                Rules result · {result.classification.split("·").pop()?.trim()}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>Illustrative rules-based output</div>
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
                This local demonstration deterministically selects an illustrative playbook response. A named human must review, approve and carry out any real action; no timing, execution or outcome is claimed.
              </div>
            </div>
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
