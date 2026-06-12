import { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { SCENARIOS } from "@/data/scenarios";

/* ─── Palette ──────────────────────────────────────────────────── */
const P = {
  bg:      "hsl(220 13% 5%)",
  navy:    "hsl(220 16% 9%)",
  navy2:   "hsl(220 14% 12%)",
  border:  "hsl(220 13% 18%)",
  amber:   "#c9a84c",
  amberDim:"rgba(201,168,76,0.14)",
  white:   "#f8f9fb",
  muted:   "hsl(220 10% 55%)",
  dimmed:  "hsl(220 10% 35%)",
  green:   "#10b981",
  greenDim:"rgba(16,185,129,0.12)",
  red:     "#ef4444",
  redDim:  "rgba(239,68,68,0.12)",
  orange:  "#f59e0b",
  orangeDim:"rgba(245,158,11,0.12)",
};

const URGENCY_COLOR: Record<string, string> = {
  CRITICAL: P.red, HIGH: P.orange, MEDIUM: P.amber, LOW: P.muted,
};

/* ─── Criteria ─────────────────────────────────────────────────── */
interface Criterion {
  key: string;
  label: string;
  desc: string;
}

const CRITERIA: Criterion[] = [
  { key: "signalAccuracy",           label: "Signal Accuracy",           desc: "Did WELBX detect the correct signals, at the right time, for this scenario?" },
  { key: "momentClassification",     label: "Moment Classification",     desc: "Was the moment classified with the correct urgency, category, and confidence?" },
  { key: "decisionUsefulness",       label: "Decision Usefulness",       desc: "Did the decision produce a clear, actionable, and proportionate response?" },
  { key: "communicationRelevance",   label: "Communication Relevance",   desc: "Were the right channels deployed to the right recipients with the right content?" },
  { key: "operationalPracticality",  label: "Operational Practicality",  desc: "Is this chain realistic and executable within normal hotel operational constraints?" },
  { key: "guestExperienceImpact",    label: "Guest Experience Impact",   desc: "Does the chain demonstrably protect or improve the guest outcome?" },
  { key: "staffAdoptionLikelihood",  label: "Staff Adoption Likelihood", desc: "Would hotel teams actually follow this protocol without resistance or workarounds?" },
  { key: "outcomeVisibility",        label: "Outcome Visibility",        desc: "Is it easy to see, in real time, whether the chain response succeeded or failed?" },
  { key: "learningCaptured",         label: "Learning Captured",         desc: "Does the learning step produce a meaningful, measurable improvement for future events?" },
  { key: "overallValue",             label: "Overall Value",             desc: "Would this scenario demonstrate WELBX's operational value to a General Manager?" },
];

const DEFAULT_SCORES: Record<string, number> = Object.fromEntries(CRITERIA.map(c => [c.key, 0]));

/* ─── Storage ──────────────────────────────────────────────────── */
const storageKey = (id: string) => `welbx_scorecard_${id}`;

export interface ScorecardData {
  scenarioId: string;
  scores: Record<string, number>;
  notes: string;
  savedAt: string;
  total: number;
}

export function loadScorecard(id: string): ScorecardData | null {
  try {
    const raw = localStorage.getItem(storageKey(id));
    return raw ? (JSON.parse(raw) as ScorecardData) : null;
  } catch {
    return null;
  }
}

function saveScorecard(data: ScorecardData) {
  try {
    localStorage.setItem(storageKey(data.scenarioId), JSON.stringify(data));
  } catch {
    /* silent */
  }
}

/* ─── Status helpers ───────────────────────────────────────────── */
function statusFor(total: number): { label: string; color: string; dimColor: string } {
  if (total >= 85) return { label: "Strong Validation",  color: P.green,  dimColor: P.greenDim };
  if (total >= 70) return { label: "Needs Refinement",   color: P.orange, dimColor: P.orangeDim };
  return              { label: "Not Ready",              color: P.red,    dimColor: P.redDim };
}

function scoreColor(n: number): string {
  if (n >= 8) return P.green;
  if (n >= 5) return P.amber;
  return P.red;
}

/* ─── Dot Scorer ───────────────────────────────────────────────── */
function DotScore({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const active = hover > 0 ? hover : value;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map(n => {
        const filled = n <= active;
        const col = active > 0 ? scoreColor(active) : P.dimmed;
        return (
          <div
            key={n}
            onClick={() => onChange(n === value ? 0 : n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            style={{
              width: 14, height: 14, borderRadius: "50%",
              background: filled ? col : "transparent",
              border: `2px solid ${filled ? col : P.border}`,
              cursor: "pointer",
              transition: "all 0.12s",
              flexShrink: 0,
            }}
          />
        );
      })}
      <span style={{
        marginLeft: 6, minWidth: 18, textAlign: "right",
        fontSize: 13, fontWeight: 700,
        color: value === 0 ? P.dimmed : scoreColor(value),
      }}>
        {value === 0 ? "—" : value}
      </span>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────── */
export default function ScenarioScorecard() {
  const [, params] = useRoute("/scenario-replay-lab/:id/scorecard");
  const scenarioId = params?.id ?? "SCN-001";
  const scenario = SCENARIOS.find(s => s.id === scenarioId) ?? SCENARIOS[0];

  const [, navigate] = useLocation();

  const [scores, setScores] = useState<Record<string, number>>(() => {
    const saved = loadScorecard(scenarioId);
    return saved?.scores ?? { ...DEFAULT_SCORES };
  });
  const [notes, setNotes] = useState(() => loadScorecard(scenarioId)?.notes ?? "");
  const [saved, setSaved] = useState(false);

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxPossible = CRITERIA.length * 10;
  const allScored = Object.values(scores).every(v => v > 0);
  const status = statusFor(total);

  useEffect(() => { setSaved(false); }, [scores, notes]);

  function handleSave() {
    saveScorecard({ scenarioId, scores, notes, savedAt: new Date().toISOString(), total });
    setSaved(true);
  }

  function handleSaveAndReturn() {
    saveScorecard({ scenarioId, scores, notes, savedAt: new Date().toISOString(), total });
    navigate("/scenario-replay-lab");
  }

  return (
    <div style={{
      marginLeft: 224, minHeight: "100vh",
      background: P.bg, color: P.white,
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${P.border}`,
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 52, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/scenario-replay-lab"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              color: P.muted, textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            SCENARIO LAB
          </Link>
          <span style={{ color: P.border }}>›</span>
          <Link
            href={`/scenario-replay-lab/${scenarioId}`}
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: P.dimmed, textDecoration: "none" }}
          >
            {scenario.id}
          </Link>
          <span style={{ color: P.border }}>›</span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            color: P.amber, padding: "2px 7px",
            background: P.amberDim, borderRadius: 3,
            border: `1px solid ${P.amber}40`,
          }}>SCORECARD</span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
            color: URGENCY_COLOR[scenario.urgency] ?? P.muted,
            border: `1px solid ${URGENCY_COLOR[scenario.urgency] ?? P.muted}`,
            borderRadius: 3, padding: "2px 6px",
          }}>{scenario.urgency}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
            color: P.muted, padding: "2px 8px",
            border: `1px solid ${P.border}`, borderRadius: 3,
          }}>{scenario.category}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 48px 120px", maxWidth: 900 }}>

        {/* Scenario title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: P.white, letterSpacing: "-0.02em" }}>
            {scenario.name}
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: P.muted, lineHeight: 1.6 }}>
            {scenario.summary}
          </p>
        </div>

        {/* Score header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 20,
        }}>
          <div>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
              color: P.dimmed, marginBottom: 4, textTransform: "uppercase",
            }}>VALIDATION SCORECARD</div>
            <div style={{ fontSize: 12, color: P.muted }}>
              Rate each criterion 1–10. All 10 criteria required for a complete score.
            </div>
          </div>

          {/* Live total */}
          <div style={{
            textAlign: "center",
            background: allScored ? status.dimColor : P.navy,
            border: `1px solid ${allScored ? status.color + "40" : P.border}`,
            borderRadius: 10, padding: "14px 28px",
            transition: "all 0.3s",
          }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: allScored ? status.color : P.dimmed, lineHeight: 1 }}>
              {total}
            </div>
            <div style={{ fontSize: 10, color: P.muted, marginTop: 2 }}>/ {maxPossible}</div>
            {allScored && (
              <div style={{
                marginTop: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                color: status.color, textTransform: "uppercase",
              }}>{status.label}</div>
            )}
          </div>
        </div>

        {/* Criteria rows */}
        <div style={{
          background: P.navy,
          border: `1px solid ${P.border}`,
          borderRadius: 10,
          overflow: "hidden",
          marginBottom: 28,
        }}>
          {CRITERIA.map((c, idx) => {
            const val = scores[c.key] ?? 0;
            const isLast = idx === CRITERIA.length - 1;
            return (
              <div
                key={c.key}
                style={{
                  display: "flex", alignItems: "center",
                  padding: "16px 24px",
                  borderBottom: isLast ? "none" : `1px solid ${P.border}`,
                  gap: 16,
                  background: val > 0 ? `${scoreColor(val)}06` : "transparent",
                  transition: "background 0.2s",
                }}
              >
                {/* Number */}
                <span style={{
                  flexShrink: 0, width: 22, textAlign: "right",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  color: P.dimmed,
                }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Label + desc */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: P.white,
                    marginBottom: 2,
                  }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: P.dimmed, lineHeight: 1.5 }}>
                    {c.desc}
                  </div>
                </div>

                {/* Score dots */}
                <div style={{ flexShrink: 0 }}>
                  <DotScore value={val} onChange={v => setScores(prev => ({ ...prev, [c.key]: v }))} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Status band */}
        {allScored && (
          <div style={{
            background: status.dimColor,
            border: `1px solid ${status.color}30`,
            borderRadius: 8,
            padding: "20px 28px",
            display: "flex", alignItems: "center", gap: 20,
            marginBottom: 28,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: `${status.color}25`,
              border: `2px solid ${status.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: status.color }}>
                {total}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: status.color, marginBottom: 3 }}>
                {status.label}
              </div>
              <div style={{ fontSize: 12, color: P.muted }}>
                {total >= 85
                  ? "This scenario is ready for live demonstration. All major chain steps are validated and realistic."
                  : total >= 70
                  ? "This scenario has a sound structure but identified gaps should be addressed before live use."
                  : "This scenario requires significant revision before it can be used in a live demonstration context."}
              </div>
            </div>

            {/* Band breakdown */}
            <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
              {[
                { range: "85–100", label: "Strong Validation", color: P.green },
                { range: "70–84",  label: "Needs Refinement",  color: P.orange },
                { range: "< 70",   label: "Not Ready",         color: P.red },
              ].map(b => (
                <div key={b.range} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: b.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: b.color === status.color ? P.white : P.dimmed }}>
                    {b.range} {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: P.dimmed, marginBottom: 10, textTransform: "uppercase",
          }}>TESTER NOTES</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add validation notes, observations, edge cases, or improvement suggestions for this scenario..."
            rows={5}
            style={{
              width: "100%", boxSizing: "border-box",
              background: P.navy, border: `1px solid ${P.border}`,
              borderRadius: 8, padding: "14px 18px",
              color: P.white, fontSize: 13, lineHeight: 1.7,
              resize: "vertical",
              outline: "none",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
            onFocus={e => (e.target.style.borderColor = P.amber + "60")}
            onBlur={e => (e.target.style.borderColor = P.border)}
          />
        </div>

        {/* Criterion breakdown table (if all scored) */}
        {allScored && (
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              color: P.dimmed, marginBottom: 12, textTransform: "uppercase",
            }}>SCORE BREAKDOWN</div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}>
              {CRITERIA.map(c => {
                const val = scores[c.key] ?? 0;
                const col = scoreColor(val);
                const pct = (val / 10) * 100;
                return (
                  <div key={c.key} style={{
                    background: P.navy2, border: `1px solid ${P.border}`,
                    borderRadius: 6, padding: "10px 14px",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: P.white, marginBottom: 5 }}>{c.label}</div>
                      <div style={{
                        height: 4, borderRadius: 2, background: P.border, overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%", width: `${pct}%`,
                          background: col, borderRadius: 2,
                          transition: "width 0.4s ease",
                        }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: col, flexShrink: 0 }}>
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 224, right: 0,
        background: P.navy, borderTop: `1px solid ${P.border}`,
        padding: "14px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 100,
      }}>
        <Link
          href={`/scenario-replay-lab/${scenarioId}`}
          style={{
            fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
            color: P.muted, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M8 1.5L3 6.5l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          BACK TO SCENARIO
        </Link>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {saved && (
            <span style={{ fontSize: 11, color: P.green, fontWeight: 600 }}>
              ✓ Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!allScored}
            style={{
              padding: "8px 20px", borderRadius: 5,
              border: `1px solid ${allScored ? P.border : P.border}`,
              background: "transparent",
              color: allScored ? P.white : P.dimmed,
              fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
              cursor: allScored ? "pointer" : "default",
              opacity: allScored ? 1 : 0.4,
            }}
          >
            SAVE
          </button>
          <button
            onClick={handleSaveAndReturn}
            disabled={!allScored}
            style={{
              padding: "8px 24px", borderRadius: 5,
              border: `1px solid ${allScored ? P.amber : P.border}`,
              background: allScored ? P.amberDim : "transparent",
              color: allScored ? P.amber : P.dimmed,
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              cursor: allScored ? "pointer" : "default",
              opacity: allScored ? 1 : 0.4,
            }}
          >
            SAVE &amp; RETURN TO LAB →
          </button>
        </div>
      </div>
    </div>
  );
}
