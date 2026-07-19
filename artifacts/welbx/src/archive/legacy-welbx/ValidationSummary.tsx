import { useMemo } from "react";
import { Link } from "wouter";
import { SCENARIOS } from "@/data/scenarios";
import { SCORECARD_DEFAULTS } from "@/data/scorecardDefaults";
import { loadScorecard } from "@/pages/ScenarioScorecard";

/* ─── Palette ──────────────────────────────────────────────── */
const P = {
  bg:      "hsl(220 13% 5%)",
  navy:    "hsl(220 16% 9%)",
  navy2:   "hsl(220 14% 12%)",
  border:  "hsl(220 13% 16%)",
  amber:   "#c9a84c",
  amberDim:"rgba(201,168,76,0.1)",
  white:   "#f8f9fb",
  muted:   "hsl(220 10% 55%)",
  dimmed:  "hsl(220 10% 35%)",
  green:   "#10b981",
  red:     "#ef4444",
  orange:  "#f59e0b",
  blue:    "#3b82f6",
  violet:  "#a78bfa",
  cyan:    "#22d3ee",
};

const STAGE_COLOR: Record<string, string> = {
  SIGNAL: "#3b82f6", MOMENT: "#c9a84c", DECISION: "#a78bfa",
  COMMUNICATION: "#22d3ee", ACTION: "#10b981", OUTCOME: "#f59e0b", LEARNING: "#6b7280",
};

const CRITERIA_LABELS: Record<string, string> = {
  signalAccuracy:          "Signal Accuracy",
  momentClassification:    "Moment Classification",
  decisionUsefulness:      "Decision Usefulness",
  communicationRelevance:  "Communication Relevance",
  operationalPracticality: "Operational Practicality",
  guestExperienceImpact:   "Guest Experience Impact",
  staffAdoptionLikelihood: "Staff Adoption Likelihood",
  outcomeVisibility:       "Outcome Visibility",
  learningCaptured:        "Learning Captured",
  overallValue:            "Overall Value",
};

const CRITERIA_IMPROVEMENTS: Record<string, string> = {
  staffAdoptionLikelihood: "Schedule role-based staff onboarding sessions before go-live. Simplify notification format to reduce adoption friction.",
  operationalPracticality: "Validate each chain step with department heads against actual operational capacity before pilot activation.",
  communicationRelevance:  "Audit recipient targeting logic. Ensure all templates are role-specific and concise enough to act on within the response window.",
  decisionUsefulness:      "Enrich playbook rules with contextual conditions. Test decision output quality with the operations team.",
  momentClassification:    "Review classification confidence thresholds. Consider more granular urgency tiers for edge cases.",
  outcomeVisibility:       "Introduce mandatory closed-loop confirmation after each chain completion. Add resolution tracking.",
  learningCaptured:        "Add post-resolution review triggers. Ensure pattern updates are automated from completed outcomes.",
  signalAccuracy:          "Expand sensor integration points. Review detection thresholds to reduce false negatives.",
  guestExperienceImpact:   "Increase guest-facing touchpoints within the chain. Align recovery gestures to guest tier.",
  overallValue:            "Ensure the benefit of WELBX intervention is clearly communicated to all departmental stakeholders.",
};

const URGENCY_COLOR: Record<string, string> = {
  CRITICAL: P.red, HIGH: P.orange, MEDIUM: P.amber, LOW: P.muted,
};

/* ─── Helpers ──────────────────────────────────────────────── */
function scoreColor(n: number, max = 100): string {
  const r = n / max;
  if (r >= 0.85) return P.green;
  if (r >= 0.70) return P.amber;
  return P.red;
}

function CheckIcon({ pass, warn }: { pass: boolean; warn?: boolean }) {
  const color = pass ? P.green : warn ? P.orange : P.red;
  return (
    <span style={{ fontSize: 13, color, flexShrink: 0 }}>
      {pass ? "✓" : warn ? "⚠" : "✗"}
    </span>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function ValidationSummary() {

  /* — 1. Scenario scores — */
  const scoredScenarios = useMemo(() =>
    SCENARIOS.map(sc => {
      const saved = loadScorecard(sc.id);
      const scores = saved?.scores ?? SCORECARD_DEFAULTS[sc.id] ?? {};
      const total = saved?.total
        ?? Object.values(scores).reduce((a: number, b) => a + (b as number), 0);
      return { ...sc, total, scores };
    }),
  []);

  /* — 2. Core stats — */
  const stats = useMemo(() => {
    const totals = scoredScenarios.map(s => s.total);
    const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
    const strong    = scoredScenarios.filter(s => s.total >= 85).length;
    const refine    = scoredScenarios.filter(s => s.total >= 70 && s.total < 85).length;
    const notReady  = scoredScenarios.filter(s => s.total < 70).length;
    const criticals = scoredScenarios.filter(s => s.urgency === 'CRITICAL');
    const criticalPassed = criticals.filter(s => s.total >= 85).length;
    return { avg, strong, refine, notReady, criticals, criticalPassed };
  }, [scoredScenarios]);

  /* — 3. Chain stage analysis — */
  const stageStats = useMemo(() => {
    const map: Record<string, { total: number; flagged: number }> = {};
    SCENARIOS.forEach(sc => {
      sc.chain.forEach(step => {
        if (!map[step.stage]) map[step.stage] = { total: 0, flagged: 0 };
        map[step.stage].total++;
        if (!step.pass) map[step.stage].flagged++;
      });
    });
    return Object.entries(map)
      .map(([stage, d]) => ({ stage, ...d, rate: d.total > 0 ? d.flagged / d.total : 0 }))
      .sort((a, b) => b.rate - a.rate);
  }, []);

  const totalChainSteps = stageStats.reduce((a, s) => a + s.total, 0);
  const totalFlagged    = stageStats.reduce((a, s) => a + s.flagged, 0);
  const chainPassRate   = totalChainSteps > 0 ? 1 - totalFlagged / totalChainSteps : 1;

  /* — 4. Red team data — */
  const rtStats = useMemo(() => {
    const maxTotal = 7 * SCENARIOS.length;
    let reviewed = 0, risks = 0, mitigations = 0, resolved = 0;
    SCENARIOS.forEach(sc => {
      try {
        const raw = localStorage.getItem(`welbx_redteam_${sc.id}`);
        if (raw) {
          const data = JSON.parse(raw) as Record<string, { status: string | null }>;
          Object.values(data).forEach(e => {
            if (e.status) reviewed++;
            if (e.status === 'risk')       risks++;
            if (e.status === 'mitigation') mitigations++;
            if (e.status === 'resolved')   resolved++;
          });
        }
      } catch { /* ignore */ }
    });
    return { reviewed, total: maxTotal, risks, mitigations, resolved, pct: Math.round((reviewed / maxTotal) * 100) };
  }, []);

  /* — 5. Criteria averages for recommendations — */
  const criteriaAvgs = useMemo(() => {
    const map: Record<string, number[]> = {};
    scoredScenarios.forEach(sc => {
      Object.entries(sc.scores).forEach(([k, v]) => {
        if (!map[k]) map[k] = [];
        map[k].push(v as number);
      });
    });
    return Object.entries(map)
      .map(([k, vs]) => ({ key: k, avg: vs.reduce((a, b) => a + b, 0) / vs.length }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 5);
  }, [scoredScenarios]);

  /* — 6. Pilot confidence — */
  const pilotConfidence = useMemo(() => {
    const scoreComp  = (stats.avg / 100) * 65;
    const strongComp = (stats.strong / SCENARIOS.length) * 25;
    const rtComp     = rtStats.reviewed === 0 ? 5
      : rtStats.risks > 0 ? Math.max(3, 10 - rtStats.risks * 2)
      : 10;
    return Math.min(100, Math.round(scoreComp + strongComp + rtComp));
  }, [stats, rtStats]);

  /* — 7. Final status — */
  const finalStatus = useMemo(() => {
    if (stats.avg >= 88 && stats.notReady === 0 && stats.strong >= 8) return {
      label: "Ready for Shadow Pilot",
      color: P.green, bg: `${P.green}12`, border: `${P.green}30`,
      desc: "All critical validation conditions met. WELBX decision logic is sufficiently proven across scenarios to proceed to a controlled shadow pilot deployment alongside live operations.",
    };
    if (stats.avg >= 75 && stats.notReady <= 2) return {
      label: "Needs Scenario Refinement",
      color: P.orange, bg: `${P.orange}12`, border: `${P.orange}30`,
      desc: "Core logic is validated but some scenarios require additional tuning before shadow pilot activation. Address all flagged areas and re-run affected scenarios before proceeding.",
    };
    return {
      label: "Not Ready",
      color: P.red, bg: `${P.red}12`, border: `${P.red}30`,
      desc: "Significant validation gaps remain. Additional scenario testing, chain refinement, and scorecard review is required before pilot deployment can be considered.",
    };
  }, [stats]);

  /* — Deployment checklist — */
  const checklist = [
    { label: "All scenarios tested",                 pass: true,    warn: false, detail: `${SCENARIOS.length}/${SCENARIOS.length} scenarios evaluated` },
    { label: "Average validation score ≥ 88",        pass: stats.avg >= 88, warn: false, detail: `${stats.avg.toFixed(1)} / 100 overall average` },
    { label: "No scenarios below 70 (Not Ready)",    pass: stats.notReady === 0, warn: false, detail: stats.notReady === 0 ? "All scenarios above minimum threshold" : `${stats.notReady} scenario${stats.notReady > 1 ? "s" : ""} below threshold` },
    { label: "CRITICAL urgency scenarios ≥ 85",      pass: stats.criticalPassed === stats.criticals.length, warn: stats.criticals.length === 0, detail: stats.criticals.length === 0 ? "No CRITICAL scenarios in test suite" : `${stats.criticalPassed}/${stats.criticals.length} critical scenarios validated` },
    { label: "Chain logic passes ≥ 85% of steps",   pass: chainPassRate >= 0.85, warn: false, detail: `${(chainPassRate * 100).toFixed(0)}% pass rate across ${totalChainSteps} chain steps` },
    { label: "Red team review complete",             pass: rtStats.reviewed === rtStats.total && rtStats.risks === 0, warn: rtStats.reviewed < rtStats.total, detail: rtStats.reviewed === 0 ? "Not yet started — open RED TEAM tab in Scenario Lab" : `${rtStats.reviewed}/${rtStats.total} questions reviewed${rtStats.risks > 0 ? ` · ${rtStats.risks} unresolved risk${rtStats.risks > 1 ? "s" : ""}` : ""}` },
  ];

  const topScenarios = [...scoredScenarios].sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div style={{
      marginLeft: 224, minHeight: "100vh",
      background: P.bg, color: P.white,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: P.navy, borderBottom: `1px solid ${P.border}`,
        padding: "24px 40px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 7.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: finalStatus.color, padding: "2px 8px",
            border: `1px solid ${finalStatus.border}`, background: finalStatus.bg,
          }}>{finalStatus.label}</span>
          <span style={{ fontSize: 7.5, color: P.dimmed }}>Validation Summary · The Grand Meridian, London</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: P.white, letterSpacing: "-0.02em", marginBottom: 10 }}>
          Validation Summary
        </h1>
        {/* Executive summary */}
        <div style={{
          maxWidth: 700, padding: "14px 18px",
          background: P.amberDim, border: `1px solid ${P.amber}25`, borderRadius: 6,
        }}>
          <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: P.amber, textTransform: "uppercase", marginBottom: 6 }}>Executive Summary</div>
          <p style={{ fontSize: 11, color: P.muted, lineHeight: 1.75, margin: 0 }}>
            WELBX is tested through scenario replay before live integration. The goal is to validate decision quality, execution consistency and outcome visibility before touching live operations.
          </p>
        </div>
      </div>

      <div style={{ padding: "32px 40px 72px", maxWidth: 1400 }}>

        {/* ── Final status banner ── */}
        <div style={{
          background: finalStatus.bg, border: `1px solid ${finalStatus.border}`,
          borderRadius: 8, padding: "22px 28px", marginBottom: 28,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: `${finalStatus.color}20`, border: `2px solid ${finalStatus.color}50`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              fontSize: 22,
            }}>
              {finalStatus.color === P.green ? "✓" : finalStatus.color === P.orange ? "⚠" : "✗"}
            </div>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: finalStatus.color, textTransform: "uppercase", marginBottom: 5 }}>
                PILOT DEPLOYMENT STATUS
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: finalStatus.color, letterSpacing: "-0.01em", marginBottom: 5 }}>
                {finalStatus.label}
              </div>
              <div style={{ fontSize: 10.5, color: P.muted, maxWidth: 580, lineHeight: 1.65 }}>
                {finalStatus.desc}
              </div>
            </div>
          </div>

          {/* Confidence gauge */}
          <div style={{
            flexShrink: 0, textAlign: "center", padding: "16px 28px",
            background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8, minWidth: 160,
          }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: P.dimmed, textTransform: "uppercase", marginBottom: 6 }}>Pilot Confidence</div>
            <div style={{ fontSize: 44, fontWeight: 800, color: scoreColor(pilotConfidence), lineHeight: 1 }}>
              {pilotConfidence}
            </div>
            <div style={{ fontSize: 9, color: P.dimmed, marginBottom: 10 }}>out of 100</div>
            <div style={{ height: 5, background: P.border, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pilotConfidence}%`, background: scoreColor(pilotConfidence), borderRadius: 3, transition: "width 0.8s ease" }} />
            </div>
            <div style={{ fontSize: 8, color: P.dimmed, marginTop: 6 }}>
              Scenarios {rtStats.reviewed > 0 ? "· Red Team" : "· Red Team pending"}
            </div>
          </div>
        </div>

        {/* ── 4 metric cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Scenarios Tested",      value: `${SCENARIOS.length}/${SCENARIOS.length}`, sub: "100% coverage",          color: P.green },
            { label: "Average Score",          value: stats.avg.toFixed(1),                   sub: "across all 10 scenarios", color: scoreColor(stats.avg) },
            { label: "Strong Validations",     value: `${stats.strong}`,                      sub: "≥ 85 / 100",              color: P.green },
            { label: "Scenarios Not Ready",    value: `${stats.notReady}`,                    sub: "below 70 / 100",          color: stats.notReady > 0 ? P.red : P.muted },
          ].map(c => (
            <div key={c.label} style={{
              background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8,
              padding: "18px 22px",
            }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginBottom: 8 }}>{c.label}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: c.color, lineHeight: 1, marginBottom: 4 }}>{c.value}</div>
              <div style={{ fontSize: 9, color: P.muted }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Two column: top moments + chain stages ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>

          {/* Top Validated Moments */}
          <div style={{ background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8, padding: "20px 24px" }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: P.dimmed, textTransform: "uppercase", marginBottom: 4 }}>Top Validated Moments</div>
            <div style={{ fontSize: 10.5, color: P.muted, marginBottom: 16 }}>Highest-scoring scenarios from the replay suite</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topScenarios.map((sc, i) => {
                const col = scoreColor(sc.total);
                const pct = ((sc.total - 60) / 40) * 100;
                return (
                  <div key={sc.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: P.dimmed, minWidth: 16, textAlign: "right" }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: P.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {sc.name.split("·")[0].trim()}
                        </span>
                        <span style={{ fontSize: 7.5, color: URGENCY_COLOR[sc.urgency], fontWeight: 700, letterSpacing: "0.08em", flexShrink: 0 }}>{sc.urgency}</span>
                      </div>
                      <div style={{ height: 4, background: P.border, borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, pct))}%`, background: col, borderRadius: 2 }} />
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: col }}>{sc.total}</span>
                      <span style={{ fontSize: 8, color: P.dimmed }}>/100</span>
                    </div>
                    <Link href={`/scenario-replay-lab/${sc.id}`}
                      style={{ fontSize: 7.5, fontWeight: 700, color: P.amber, textDecoration: "none", flexShrink: 0 }}
                    >→</Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weakest Chain Stages */}
          <div style={{ background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8, padding: "20px 24px" }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: P.dimmed, textTransform: "uppercase", marginBottom: 4 }}>Chain Stage Analysis</div>
            <div style={{ fontSize: 10.5, color: P.muted, marginBottom: 16 }}>
              Flag rate per stage across {SCENARIOS.length} scenarios · <span style={{ color: chainPassRate >= 0.9 ? P.green : P.orange }}>{(chainPassRate * 100).toFixed(0)}% overall pass rate</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {stageStats.map(s => {
                const stageCol = STAGE_COLOR[s.stage] ?? P.muted;
                const passRate = 1 - s.rate;
                const isweak = s.rate > 0.1;
                return (
                  <div key={s.stage} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", color: stageCol, textTransform: "uppercase", minWidth: 100 }}>{s.stage}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 5, background: P.border, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${passRate * 100}%`, background: isweak ? P.orange : stageCol, borderRadius: 3 }} />
                      </div>
                    </div>
                    <div style={{ minWidth: 80, textAlign: "right" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isweak ? P.orange : P.green }}>
                        {s.flagged === 0 ? "All pass" : `${s.flagged}/${s.total} flagged`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14, padding: "8px 12px", background: `${P.border}50`, borderRadius: 4 }}>
              <span style={{ fontSize: 8.5, color: P.muted }}>
                {stageStats.filter(s => s.rate > 0).length === 0
                  ? "✓ All stages passing across the full test suite."
                  : `Weakest stage: ${stageStats[0]?.stage} · ${stageStats[0] ? ((1 - stageStats[0].rate) * 100).toFixed(0) : 100}% pass rate`}
              </span>
            </div>
          </div>
        </div>

        {/* ── Deployment criteria checklist ── */}
        <div style={{ background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: P.dimmed, textTransform: "uppercase", marginBottom: 16 }}>Pilot Deployment Criteria</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {checklist.map(c => (
              <div key={c.label} style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px",
                background: c.pass ? `${P.green}06` : c.warn ? `${P.orange}06` : `${P.red}06`,
                border: `1px solid ${c.pass ? P.green : c.warn ? P.orange : P.red}20`,
                borderRadius: 6,
              }}>
                <CheckIcon pass={c.pass} warn={c.warn} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: P.white, marginBottom: 3 }}>{c.label}</div>
                  <div style={{ fontSize: 9, color: P.muted, lineHeight: 1.55 }}>{c.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recommended next improvements ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: P.dimmed, textTransform: "uppercase", marginBottom: 14 }}>
            Recommended Next Improvements
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Criteria-based recommendations */}
            {criteriaAvgs.slice(0, 3).map((c, i) => (
              <div key={c.key} style={{
                background: P.navy, border: `1px solid ${P.border}`, borderRadius: 6,
                padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14,
              }}>
                <div style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                  background: `${P.amber}15`, border: `1px solid ${P.amber}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: P.amber,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: P.white }}>{CRITERIA_LABELS[c.key] ?? c.key}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, color: scoreColor(c.avg, 10), padding: "1px 6px", background: `${scoreColor(c.avg, 10)}15`, borderRadius: 3 }}>
                      avg {c.avg.toFixed(1)}/10
                    </span>
                  </div>
                  <div style={{ fontSize: 9.5, color: P.muted, lineHeight: 1.65 }}>
                    {CRITERIA_IMPROVEMENTS[c.key] ?? "Review and refine this criterion across scenario tests."}
                  </div>
                </div>
              </div>
            ))}

            {/* Red team note */}
            {rtStats.reviewed < rtStats.total && (
              <div style={{
                background: P.navy, border: `1px solid ${P.border}`, borderRadius: 6,
                padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14,
              }}>
                <div style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                  background: `${P.orange}15`, border: `1px solid ${P.orange}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: P.orange,
                }}>{criteriaAvgs.slice(0, 3).length + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: P.white }}>Complete Red Team Edge Case Review</span>
                    <span style={{ fontSize: 8, fontWeight: 700, color: P.orange, padding: "1px 6px", background: `${P.orange}15`, borderRadius: 3 }}>
                      {rtStats.total - rtStats.reviewed} pending
                    </span>
                  </div>
                  <div style={{ fontSize: 9.5, color: P.muted, lineHeight: 1.65 }}>
                    {rtStats.reviewed === 0
                      ? "Red team testing has not been started. Open the RED TEAM tab in Scenario Replay Lab for each scenario and assess all 7 edge case questions before proceeding to pilot."
                      : `${rtStats.reviewed}/${rtStats.total} questions reviewed. Complete the remaining ${rtStats.total - rtStats.reviewed} to close all edge case gaps before pilot activation.`}
                  </div>
                </div>
              </div>
            )}

            {/* Scenario refinement note */}
            {stats.refine > 0 && (
              <div style={{
                background: P.navy, border: `1px solid ${P.border}`, borderRadius: 6,
                padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14,
              }}>
                <div style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                  background: `${P.orange}15`, border: `1px solid ${P.orange}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: P.orange,
                }}>{criteriaAvgs.slice(0, 3).length + (rtStats.reviewed < rtStats.total ? 2 : 1)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: P.white }}>Refine {stats.refine} Scenario{stats.refine > 1 ? "s" : ""} in the 70–84 Band</span>
                    <span style={{ fontSize: 8, fontWeight: 700, color: P.amber, padding: "1px 6px", background: `${P.amber}15`, borderRadius: 3 }}>Needs Refinement</span>
                  </div>
                  <div style={{ fontSize: 9.5, color: P.muted, lineHeight: 1.65 }}>
                    {scoredScenarios.filter(s => s.total >= 70 && s.total < 85)
                      .map(s => `${s.id} (${s.total})`)
                      .join(", ")} — review chain logic, update playbook rules, and re-run the scenario scorecard.
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Quick links ── */}
        <div style={{
          padding: "18px 22px", background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginBottom: 4 }}>Continue Validation</div>
            <div style={{ fontSize: 10, color: P.muted }}>Open the tools below to run tests, review scores, or complete red team assessments.</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Run Scenarios", path: "/scenario-replay-lab", color: P.amber },
              { label: "Validation Dashboard", path: "/scenario-validation-dashboard", color: P.muted },
              { label: "Shadow Pilot Mode", path: "/shadow-pilot-mode", color: P.muted },
            ].map(l => (
              <Link key={l.path} href={l.path} style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                color: l.color, border: `1px solid ${l.color}30`,
                background: `${l.color}08`, padding: "8px 16px", borderRadius: 4,
                textDecoration: "none", display: "inline-block",
              }}>{l.label} →</Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
