import { useMemo } from "react";
import { Link } from "wouter";
import { FileDown, Package } from "lucide-react";
import { exportScenarioReport, exportFullValidationPack } from "@/utils/exportReport";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { SCENARIOS } from "@/data/scenarios";
import { loadScorecard } from "@/pages/ScenarioScorecard";
import { SCORECARD_DEFAULTS } from "@/data/scorecardDefaults";

/* ─── Palette ──────────────────────────────────────────────────── */
const P = {
  bg:      "hsl(220 13% 5%)",
  navy:    "hsl(220 16% 9%)",
  navy2:   "hsl(220 14% 12%)",
  border:  "hsl(220 13% 18%)",
  amber:   "#c9a84c",
  amberDim:"rgba(201,168,76,0.12)",
  white:   "#f8f9fb",
  muted:   "hsl(220 10% 55%)",
  dimmed:  "hsl(220 10% 35%)",
  green:   "#10b981",
  red:     "#ef4444",
  orange:  "#f59e0b",
  blue:    "#60a5fa",
  violet:  "#a78bfa",
  cyan:    "#22d3ee",
};

const URGENCY_COLOR: Record<string, string> = { CRITICAL: P.red, HIGH: P.orange, MEDIUM: P.amber, LOW: P.muted };

/* ─── Criteria ─────────────────────────────────────────────────── */
const CRITERIA_KEYS = [
  "signalAccuracy", "momentClassification", "decisionUsefulness", "communicationRelevance",
  "operationalPracticality", "guestExperienceImpact", "staffAdoptionLikelihood",
  "outcomeVisibility", "learningCaptured", "overallValue",
];

const CRITERIA_LABELS: Record<string, string> = {
  signalAccuracy:          "Signal Accuracy",
  momentClassification:    "Moment Classification",
  decisionUsefulness:      "Decision Usefulness",
  communicationRelevance:  "Communication Relevance",
  operationalPracticality: "Operational Practicality",
  guestExperienceImpact:   "Guest Experience Impact",
  staffAdoptionLikelihood: "Staff Adoption",
  outcomeVisibility:       "Outcome Visibility",
  learningCaptured:        "Learning Captured",
  overallValue:            "Overall Value",
};

/* ─── Performance areas ────────────────────────────────────────── */
const AREAS = [
  { key: "signal",         label: "Signal",         color: P.blue,   criteria: ["signalAccuracy"],                              desc: "Accuracy of environmental and behavioural signal detection" },
  { key: "moment",         label: "Moment",          color: P.amber,  criteria: ["momentClassification"],                       desc: "Precision of moment classification and urgency assessment" },
  { key: "decision",       label: "Decision",        color: P.violet, criteria: ["decisionUsefulness","operationalPracticality"],desc: "Clarity and practicality of automated decision output" },
  { key: "communication",  label: "Communication",   color: P.cyan,   criteria: ["communicationRelevance"],                     desc: "Relevance and targeting of communication dispatched" },
  { key: "outcome",        label: "Outcome",         color: P.green,  criteria: ["outcomeVisibility","guestExperienceImpact"],  desc: "Visibility of results and guest experience improvement" },
  { key: "learning",       label: "Learning",        color: P.orange, criteria: ["learningCaptured","staffAdoptionLikelihood"], desc: "Knowledge captured and staff readiness to adopt" },
];

/* ─── Status helpers ───────────────────────────────────────────── */
function statusFor(total: number) {
  if (total >= 85) return { label: "Strong Validation", color: P.green };
  if (total >= 70) return { label: "Needs Refinement",  color: P.orange };
  return              { label: "Not Ready",             color: P.red };
}

function scoreColor(n: number, max = 10) {
  const pct = n / max;
  if (pct >= 0.85) return P.green;
  if (pct >= 0.70) return P.amber;
  return P.red;
}

/* ─── Custom tooltip ───────────────────────────────────────────── */
function BarTip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value as number;
  const status = statusFor(val);
  return (
    <div style={{
      background: P.navy2, border: `1px solid ${P.border}`, borderRadius: 5,
      padding: "8px 12px", fontSize: 11, color: P.white,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <div style={{ color: status.color, fontWeight: 700 }}>{val} / 100 · {status.label}</div>
    </div>
  );
}

/* ─── Metric card ──────────────────────────────────────────────── */
function MetricCard({ label, value, sub, color, large }: { label: string; value: string | number; sub?: string; color: string; large?: boolean }) {
  return (
    <div style={{
      background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8,
      padding: large ? "20px 24px" : "16px 20px", flex: 1, minWidth: 0,
    }}>
      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.16em", color: P.dimmed, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: large ? 40 : 32, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: P.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ─── Performance area card ────────────────────────────────────── */
function AreaCard({ area, scenarioScores }: {
  area: typeof AREAS[0];
  scenarioScores: Array<{ id: string; name: string; scores: Record<string, number> }>;
}) {
  const barData = scenarioScores.map(sc => {
    const vals = area.criteria.map(c => sc.scores[c] ?? 0);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return { name: sc.id.replace("SCN-", ""), avg: Math.round(avg * 10) / 10 };
  });
  const overallAvg = barData.reduce((a, b) => a + b.avg, 0) / barData.length;

  return (
    <div style={{
      background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8,
      padding: "18px 20px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: area.color, textTransform: "uppercase", marginBottom: 4 }}>
            {area.label} Performance
          </div>
          <div style={{ fontSize: 11, color: P.muted, lineHeight: 1.5, maxWidth: 200 }}>{area.desc}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(overallAvg), lineHeight: 1 }}>
            {overallAvg.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: P.dimmed }}>avg / 10</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={60}>
        <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap="15%">
          <XAxis dataKey="name" tick={{ fontSize: 7, fill: P.dimmed }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 10]} hide />
          <Bar dataKey="avg" radius={[2, 2, 0, 0]}>
            {barData.map((d, i) => (
              <Cell key={i} fill={scoreColor(d.avg)} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────── */
export default function ScenarioValidationDashboard() {
  const scenarioData = useMemo(() => {
    return SCENARIOS.map(sc => {
      const saved = loadScorecard(sc.id);
      const scores = saved?.scores ?? SCORECARD_DEFAULTS[sc.id] ?? {};
      const total = saved?.total ?? sc.testScore;
      return { ...sc, scores, total, fromSaved: !!saved };
    });
  }, []);

  const stats = useMemo(() => {
    const totals = scenarioData.map(s => s.total);
    const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
    const strong    = scenarioData.filter(s => s.total >= 85).length;
    const refine    = scenarioData.filter(s => s.total >= 70 && s.total < 85).length;
    const notReady  = scenarioData.filter(s => s.total < 70).length;
    const highest   = scenarioData.reduce((a, b) => a.total > b.total ? a : b);
    const lowest    = scenarioData.reduce((a, b) => a.total < b.total ? a : b);
    const savedCount = scenarioData.filter(s => s.fromSaved).length;

    // Per-criterion averages
    const critAvgs: Record<string, number> = {};
    CRITERIA_KEYS.forEach(k => {
      const vals = scenarioData.map(s => s.scores[k] ?? 0).filter(v => v > 0);
      critAvgs[k] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });

    const worstCrit  = CRITERIA_KEYS.reduce((a, b) => critAvgs[a] < critAvgs[b] ? a : b);
    const bestCrit   = CRITERIA_KEYS.reduce((a, b) => critAvgs[a] > critAvgs[b] ? a : b);

    const radarData = CRITERIA_KEYS.map(k => ({
      subject: CRITERIA_LABELS[k].replace(" ", "\n"),
      fullLabel: CRITERIA_LABELS[k],
      value: Math.round(critAvgs[k] * 10) / 10,
    }));

    const barData = scenarioData
      .slice()
      .sort((a, b) => b.total - a.total)
      .map(s => ({ name: s.id.replace("SCN-", ""), label: s.name.split("·")[0].trim(), total: s.total, urgency: s.urgency }));

    return { avg, strong, refine, notReady, highest, lowest, critAvgs, worstCrit, bestCrit, radarData, barData, savedCount };
  }, [scenarioData]);

  const pilotReady = stats.strong >= 8 && stats.notReady === 0;
  const pilotColor = pilotReady ? P.green : stats.notReady > 2 ? P.red : P.orange;

  return (
    <div style={{
      marginLeft: 224, minHeight: "100vh",
      background: P.bg, color: P.white,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: P.navy, borderBottom: `1px solid ${P.border}`,
        padding: "22px 40px 18px",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{
              fontSize: 8, fontWeight: 700, letterSpacing: "0.18em",
              color: pilotColor, padding: "2px 8px",
              border: `1px solid ${pilotColor}30`, background: `${pilotColor}10`,
            }}>{pilotReady ? "PILOT READY" : "VALIDATION IN PROGRESS"}</span>
            <span style={{ fontSize: 8, color: P.dimmed }}>
              Scenario Validation Dashboard · {stats.savedCount > 0 ? `${stats.savedCount} manual + ${10 - stats.savedCount} default` : "10 default scorecards"}
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: P.white, letterSpacing: "-0.02em", marginBottom: 5 }}>
            Scenario Validation Dashboard
          </h1>
          <p style={{ fontSize: 11, color: P.muted, maxWidth: 540, lineHeight: 1.65 }}>
            Aggregated results across all {scenarioData.length} scenario tests. Use this dashboard to determine whether WELBX logic is ready for live pilot integration.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Link
              href="/scenario-replay-lab"
              style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                color: P.amber, border: `1px solid ${P.amber}35`,
                background: P.amberDim, padding: "7px 16px", borderRadius: 4,
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5,
              }}
            >RUN SCENARIOS →</Link>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => exportFullValidationPack()}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                color: P.white, border: `1px solid ${P.border}`,
                background: "rgba(255,255,255,0.05)", padding: "7px 14px", borderRadius: 4,
                cursor: "pointer",
              }}
            >
              <Package size={11} />
              Export Full Validation Pack
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "32px 40px 64px", maxWidth: 1400 }}>

        {/* ── Top metric row ── */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
          <MetricCard label="Average Score" value={stats.avg.toFixed(1)} sub="across 10 scenarios / 100" color={scoreColor(stats.avg, 100)} large />
          <MetricCard label="Strong Validations" value={stats.strong} sub="≥ 85 / 100" color={P.green} />
          <MetricCard label="Needs Refinement" value={stats.refine} sub="70–84 / 100" color={P.orange} />
          <MetricCard label="Not Ready" value={stats.notReady} sub="below 70 / 100" color={P.red} />
        </div>

        {/* ── Insight cards ── */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
          {[
            {
              label: "Highest Scoring Scenario",
              value: stats.highest.total,
              sub: `${stats.highest.id} · ${stats.highest.name.split("·")[0].trim()}`,
              color: P.green,
            },
            {
              label: "Lowest Scoring Scenario",
              value: stats.lowest.total,
              sub: `${stats.lowest.id} · ${stats.lowest.name.split("·")[0].trim()}`,
              color: stats.lowest.total < 70 ? P.red : P.orange,
            },
            {
              label: "Most Common Failure Point",
              value: CRITERIA_LABELS[stats.worstCrit] ?? "—",
              sub: `avg ${stats.critAvgs[stats.worstCrit]?.toFixed(1)} / 10 — lowest criterion across all scenarios`,
              color: P.red,
            },
            {
              label: "Most Improved Execution Area",
              value: CRITERIA_LABELS[stats.bestCrit] ?? "—",
              sub: `avg ${stats.critAvgs[stats.bestCrit]?.toFixed(1)} / 10 — highest criterion across all scenarios`,
              color: P.green,
            },
          ].map(c => (
            <div key={c.label} style={{
              background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8,
              padding: "16px 20px", flex: 1, minWidth: 0,
            }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginBottom: 8 }}>{c.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: c.color, lineHeight: 1.2, marginBottom: 5 }}>{c.value}</div>
              <div style={{ fontSize: 9.5, color: P.muted, lineHeight: 1.55 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>

          {/* Scenario scores bar chart */}
          <div style={{ background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8, padding: "20px 24px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginBottom: 4 }}>Scenario Scores</div>
            <div style={{ fontSize: 11, color: P.muted, marginBottom: 16 }}>Validation score per scenario (sorted highest → lowest)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.barData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }} barCategoryGap="18%">
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: P.dimmed }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 8, fill: P.dimmed }} axisLine={false} tickLine={false} />
                <Tooltip content={<BarTip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="total" radius={[3, 3, 0, 0]}>
                  {stats.barData.map((d, i) => (
                    <Cell key={i} fill={scoreColor(d.total, 100)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Threshold lines legend */}
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {[
                { label: "Strong Validation (≥85)", color: P.green },
                { label: "Needs Refinement (70–84)", color: P.orange },
                { label: "Not Ready (<70)", color: P.red },
              ].map(b => (
                <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: b.color }} />
                  <span style={{ fontSize: 8, color: P.dimmed }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Radar chart */}
          <div style={{ background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8, padding: "20px 24px" }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginBottom: 4 }}>Criterion Performance Radar</div>
            <div style={{ fontSize: 11, color: P.muted, marginBottom: 8 }}>Average score per criterion across all 10 scenarios</div>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={stats.radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke={P.border} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: P.dimmed, fontSize: 7, fontWeight: 600 }}
                  tickFormatter={(v: string) => v.replace("\n", " ")}
                />
                <Radar
                  name="Avg Score"
                  dataKey="value"
                  stroke={P.amber}
                  fill={P.amber}
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── 6 performance area cards ── */}
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", marginBottom: 14 }}>
          Performance by Area — Average Score per Scenario
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
          {AREAS.map(area => (
            <AreaCard key={area.key} area={area} scenarioScores={scenarioData} />
          ))}
        </div>

        {/* ── Scenario ranking table ── */}
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", marginBottom: 14 }}>
          Scenario Ranking
        </div>
        <div style={{ background: P.navy, border: `1px solid ${P.border}`, borderRadius: 8, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "64px 1fr 80px 180px 60px 90px",
            padding: "10px 20px", borderBottom: `1px solid ${P.border}`,
            fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color: P.dimmed, textTransform: "uppercase",
          }}>
            <span>ID</span>
            <span>Scenario</span>
            <span>Score</span>
            <span>Status</span>
            <span>Urgency</span>
            <span>Details</span>
          </div>

          {scenarioData
            .slice()
            .sort((a, b) => b.total - a.total)
            .map((sc, idx) => {
              const st = statusFor(sc.total);
              const pct = ((sc.total - 60) / 40) * 100;
              return (
                <div
                  key={sc.id}
                  style={{
                    display: "grid", gridTemplateColumns: "64px 1fr 80px 180px 60px 90px",
                    padding: "12px 20px", alignItems: "center",
                    borderBottom: idx < scenarioData.length - 1 ? `1px solid ${P.border}` : "none",
                    background: idx % 2 === 0 ? "transparent" : `${P.white}02`,
                  }}
                >
                  <span style={{ fontSize: 8.5, fontFamily: "monospace", color: P.dimmed }}>{sc.id}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: P.white, marginBottom: 2 }}>{sc.name}</div>
                    <div style={{ fontSize: 8, color: P.dimmed }}>{sc.category}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: st.color, lineHeight: 1 }}>{sc.total}</span>
                    <span style={{ fontSize: 8, color: P.dimmed }}>/100</span>
                  </div>
                  <div>
                    <div style={{ height: 5, background: P.border, borderRadius: 3, overflow: "hidden", marginBottom: 4, maxWidth: 160 }}>
                      <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, pct))}%`, background: st.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                    </div>
                    <span style={{ fontSize: 8, fontWeight: 700, color: st.color, letterSpacing: "0.08em" }}>{st.label}</span>
                  </div>
                  <span style={{
                    fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em",
                    color: URGENCY_COLOR[sc.urgency] ?? P.muted,
                  }}>{sc.urgency}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link
                      href={`/scenario-replay-lab/${sc.id}`}
                      style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.08em", color: P.amber, textDecoration: "none" }}
                    >CHAIN →</Link>
                    <span style={{ color: P.border }}>·</span>
                    <Link
                      href={`/scenario-replay-lab/${sc.id}/scorecard`}
                      style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.08em", color: P.muted, textDecoration: "none" }}
                    >SCORE</Link>
                  </div>
                </div>
              );
            })}
        </div>

        {/* ── Criterion detail table ── */}
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", marginBottom: 14, marginTop: 32 }}>
          Criterion Averages — All 10 Criteria
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {CRITERIA_KEYS.map(k => {
            const avg = stats.critAvgs[k] ?? 0;
            const col = scoreColor(avg);
            const pct = (avg / 10) * 100;
            return (
              <div key={k} style={{
                background: P.navy, border: `1px solid ${P.border}`, borderRadius: 6,
                padding: "12px 16px", display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: P.white, marginBottom: 6 }}>{CRITERIA_LABELS[k]}</div>
                  <div style={{ height: 4, background: P.border, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 2, transition: "width 0.6s" }} />
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: col }}>{avg.toFixed(1)}</span>
                  <span style={{ fontSize: 8, color: P.dimmed }}> /10</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
