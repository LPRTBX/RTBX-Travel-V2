import { useState } from "react";
import { SCENARIOS } from "@/data/scenarios";
import { exportScenarioReport, exportFullValidationPack } from "@/utils/exportReport";

const P = {
  bg:     "hsl(220 13% 5%)",
  navy:   "hsl(220 16% 9%)",
  navy2:  "hsl(220 14% 12%)",
  border: "hsl(220 13% 16%)",
  amber:  "#c9a84c",
  white:  "#f8f9fb",
  muted:  "hsl(220 10% 55%)",
  dimmed: "hsl(220 10% 35%)",
  green:  "#10b981",
};

const URGENCY_COLOR: Record<string, string> = {
  CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: P.amber, LOW: P.dimmed,
};

const REPORT_CONTENTS: Record<"scenario" | "full", string[]> = {
  scenario: [
    "Scenario overview and urgency classification",
    "Validation scorecard with 10 criteria scores",
    "Chain step analysis — pass / flag per stage",
    "Comparison matrix and chain output summary",
    "Red team edge case review status",
    "Recommended improvements for this scenario",
  ],
  full: [
    "All 10 scenario validation reports",
    "Score comparison table across scenarios",
    "Chain stage pass rate analysis",
    "Aggregated scorecard and criteria averages",
    "Red team coverage summary",
    "Pilot readiness conclusion and recommended next steps",
  ],
};

export default function ExportReports() {
  const [selectedId, setSelectedId] = useState(SCENARIOS[0].id);
  const [exporting, setExporting] = useState<"scenario" | "full" | null>(null);

  const selected = SCENARIOS.find(s => s.id === selectedId) ?? SCENARIOS[0];

  async function handleScenarioExport() {
    setExporting("scenario");
    try { exportScenarioReport(selectedId); } finally {
      setTimeout(() => setExporting(null), 1200);
    }
  }

  async function handleFullExport() {
    setExporting("full");
    try { exportFullValidationPack(); } finally {
      setTimeout(() => setExporting(null), 1200);
    }
  }

  return (
    <div style={{
      marginLeft: 224, minHeight: "100vh",
      background: P.bg, color: P.white,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: P.navy, borderBottom: `1px solid ${P.border}`,
        padding: "24px 40px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 7.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: P.amber, padding: "2px 8px",
            border: `1px solid ${P.amber}30`, background: `${P.amber}08`,
          }}>Export Reports</span>
          <span style={{ fontSize: 7.5, color: P.dimmed }}>Validation Layer · The Grand Meridian, London</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: P.white, letterSpacing: "-0.02em", marginBottom: 6 }}>
          Export Reports
        </h1>
        <p style={{ fontSize: 11, color: P.muted, maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
          Generate print-ready landscape A4 validation reports. Export a single scenario's full analysis or download the complete validation pack covering all ten scenarios.
        </p>
      </div>

      <div style={{ padding: "36px 40px 72px", maxWidth: 1100 }}>

        {/* Two cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* — Card 1: Scenario Report — */}
          <div style={{
            background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8,
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ padding: "24px 28px 20px", borderBottom: `1px solid ${P.border}` }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: P.dimmed, textTransform: "uppercase", marginBottom: 8 }}>Individual Report</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: P.white, marginBottom: 6 }}>Scenario Validation Report</div>
              <p style={{ fontSize: 10.5, color: P.muted, lineHeight: 1.7, margin: 0 }}>
                Full analysis for a single scenario — scorecard, chain steps, comparison matrix, red team status, and improvement recommendations.
              </p>
            </div>

            <div style={{ padding: "20px 28px", borderBottom: `1px solid ${P.border}`, flex: 1 }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginBottom: 10 }}>Select Scenario</div>
              <div style={{ position: "relative" }}>
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: P.navy2, border: `1px solid ${P.border}`,
                    color: P.white, borderRadius: 5, fontSize: 11, fontWeight: 600,
                    appearance: "none", cursor: "pointer", outline: "none",
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {SCENARIOS.map(sc => (
                    <option key={sc.id} value={sc.id} style={{ background: "hsl(220 16% 12%)" }}>
                      {sc.id} · {sc.name}
                    </option>
                  ))}
                </select>
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 9, color: P.dimmed, pointerEvents: "none" }}>▾</span>
              </div>

              {/* Selected scenario summary */}
              <div style={{
                marginTop: 12, padding: "10px 12px",
                background: `${P.border}50`, borderRadius: 5,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: P.white, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {selected.name}
                  </div>
                  <div style={{ fontSize: 8.5, color: P.muted }}>{selected.category} · {selected.chain.length} chain steps</div>
                </div>
                <span style={{
                  fontSize: 7.5, fontWeight: 700, color: URGENCY_COLOR[selected.urgency],
                  padding: "2px 7px", border: `1px solid ${URGENCY_COLOR[selected.urgency]}30`,
                  background: `${URGENCY_COLOR[selected.urgency]}10`, borderRadius: 3, flexShrink: 0,
                }}>{selected.urgency}</span>
              </div>

              {/* Report contents */}
              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginBottom: 8 }}>Report Includes</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {REPORT_CONTENTS.scenario.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 8.5, color: P.green, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 9.5, color: P.muted, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "18px 28px" }}>
              <button
                onClick={handleScenarioExport}
                disabled={exporting === "scenario"}
                style={{
                  width: "100%", padding: "11px 0",
                  background: exporting === "scenario" ? `${P.amber}30` : `${P.amber}15`,
                  border: `1px solid ${P.amber}40`,
                  color: exporting === "scenario" ? `${P.amber}80` : P.amber,
                  borderRadius: 5, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: exporting === "scenario" ? "not-allowed" : "pointer",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (exporting !== "scenario") e.currentTarget.style.background = `${P.amber}22`; }}
                onMouseLeave={e => { e.currentTarget.style.background = exporting === "scenario" ? `${P.amber}30` : `${P.amber}15`; }}
              >
                {exporting === "scenario" ? "Generating Report…" : `Export ${selectedId} Report →`}
              </button>
              <div style={{ fontSize: 8, color: P.dimmed, textAlign: "center", marginTop: 7 }}>
                Opens as a print dialog · Landscape A4 · PDF-ready
              </div>
            </div>
          </div>

          {/* — Card 2: Full Validation Pack — */}
          <div style={{
            background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8,
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ padding: "24px 28px 20px", borderBottom: `1px solid ${P.border}` }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: P.green, textTransform: "uppercase", marginBottom: 8 }}>
                Complete Package
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: P.white, marginBottom: 6 }}>Full Validation Pack</div>
              <p style={{ fontSize: 10.5, color: P.muted, lineHeight: 1.7, margin: 0 }}>
                Comprehensive report covering all 10 scenarios. Includes cross-scenario comparison, aggregated scorecard, chain analysis, red team coverage, and pilot readiness conclusion.
              </p>
            </div>

            <div style={{ padding: "20px 28px", borderBottom: `1px solid ${P.border}`, flex: 1 }}>

              {/* Summary stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Scenarios", value: `${SCENARIOS.length}` },
                  { label: "Chain Steps", value: `${SCENARIOS.reduce((a, s) => a + s.chain.length, 0)}` },
                  { label: "Report Pages", value: "~12" },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: "10px 12px", background: `${P.border}50`, borderRadius: 5, textAlign: "center",
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: P.green, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 7.5, color: P.dimmed, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Report contents */}
              <div>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginBottom: 8 }}>Pack Includes</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {REPORT_CONTENTS.full.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 8.5, color: P.green, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 9.5, color: P.muted, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scenario list preview */}
              <div style={{ marginTop: 18, padding: "10px 12px", background: `${P.border}50`, borderRadius: 5 }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: P.dimmed, textTransform: "uppercase", marginBottom: 7 }}>Scenarios Covered</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {SCENARIOS.map(sc => (
                    <span key={sc.id} style={{
                      fontSize: 7.5, fontWeight: 700, color: P.muted,
                      padding: "2px 7px", background: P.navy2,
                      border: `1px solid ${P.border}`, borderRadius: 3,
                    }}>{sc.id}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "18px 28px" }}>
              <button
                onClick={handleFullExport}
                disabled={exporting === "full"}
                style={{
                  width: "100%", padding: "11px 0",
                  background: exporting === "full" ? `${P.green}20` : `${P.green}12`,
                  border: `1px solid ${P.green}40`,
                  color: exporting === "full" ? `${P.green}80` : P.green,
                  borderRadius: 5, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: exporting === "full" ? "not-allowed" : "pointer",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (exporting !== "full") e.currentTarget.style.background = `${P.green}20`; }}
                onMouseLeave={e => { e.currentTarget.style.background = exporting === "full" ? `${P.green}20` : `${P.green}12`; }}
              >
                {exporting === "full" ? "Generating Pack…" : "Export Full Validation Pack →"}
              </button>
              <div style={{ fontSize: 8, color: P.dimmed, textAlign: "center", marginTop: 7 }}>
                Opens as a print dialog · Landscape A4 · PDF-ready
              </div>
            </div>
          </div>

        </div>

        {/* Note */}
        <div style={{
          marginTop: 24, padding: "14px 20px",
          background: P.navy, border: `1px solid ${P.border}`, borderRadius: 6,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 11, color: P.dimmed }}>ℹ</span>
          <span style={{ fontSize: 9.5, color: P.dimmed, lineHeight: 1.6 }}>
            Reports reflect the current state of scorecard data. Any manual scorecard edits made in the Scenario Runner will be included. Reports open in a new print dialog — use your browser's "Save as PDF" option to download.
          </span>
        </div>

      </div>
    </div>
  );
}
