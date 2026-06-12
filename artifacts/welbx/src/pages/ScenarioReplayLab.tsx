import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RefreshCw, CheckCircle2, XCircle, Clock, ChevronRight, Loader2 } from "lucide-react";
import { SCENARIOS } from "@/data/scenarios";
import type { Urgency } from "@/data/scenarios";

/* ─── Types ──────────────────────────────────────────────────────── */
type Status = 'idle' | 'running' | 'complete' | 'failed';

/* ─── Palette ─────────────────────────────────────────────────────── */
const P = {
  bg:      "hsl(220 13% 5%)",
  panel:   "hsl(220 13% 7%)",
  card:    "hsl(220 13% 9%)",
  card2:   "hsl(220 13% 11%)",
  border:  "hsl(220 13% 12%)",
  amber:   "#c9a84c",
  white:   "#ffffff",
  muted:   "hsl(215 16% 52%)",
  dimmed:  "hsl(215 16% 28%)",
  green:   "#10b981",
  red:     "#ef4444",
  blue:    "#3b82f6",
  violet:  "#a78bfa",
  cyan:    "#22d3ee",
};

const URGENCY_COLOR: Record<Urgency, string> = {
  CRITICAL: P.red,
  HIGH:     P.red,
  MEDIUM:   P.amber,
  LOW:      P.blue,
};

const STAGE_COLOR: Record<string, string> = {
  SIGNAL:        P.blue,
  MOMENT:        P.amber,
  DECISION:      P.violet,
  COMMUNICATION: P.cyan,
  ACTION:        P.green,
  OUTCOME:       P.green,
  LEARNING:      "hsl(215 16% 56%)",
};


const STEP_DELAY = 520;

/* ─── Sub-components ─────────────────────────────────────────────── */
function StatusDot({ status, score }: { status: Status; score: number }) {
  if (status === 'running') return <Loader2 size={11} color={P.amber} style={{ animation: "spin 1s linear infinite" }} />;
  if (status === 'complete') {
    if (score >= 90) return <CheckCircle2 size={11} color={P.green} />;
    if (score >= 75) return <CheckCircle2 size={11} color={P.amber} />;
    return <XCircle size={11} color={P.red} />;
  }
  if (status === 'failed') return <XCircle size={11} color={P.red} />;
  return <div style={{ width: 7, height: 7, borderRadius: "50%", border: `1px solid ${P.border}`, background: P.card2 }} />;
}

function ScoreBadge({ score, status }: { score: number; status: Status }) {
  if (status !== 'complete') return null;
  const color = score >= 90 ? P.green : score >= 75 ? P.amber : P.red;
  const label = score >= 90 ? "PASS" : score >= 75 ? "PARTIAL" : "FAIL";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color, padding: "2px 8px", border: `1px solid ${color}30`, background: `${color}08` }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}<span style={{ fontSize: 8, color: P.dimmed }}>/100</span></span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function ScenarioReplayLab() {
  const [selectedId, setSelectedId] = useState<string>("SCN-001");
  const [stepProgress, setStepProgress] = useState<Record<string, number>>({});
  const [runStatus, setRunStatus] = useState<Record<string, Status>>({});
  const [runningAll, setRunningAll] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scenario = SCENARIOS.find(s => s.id === selectedId)!;
  const status = runStatus[selectedId] ?? 'idle';
  const progress = stepProgress[selectedId] ?? -1;

  function runScenario(id: string, onFinish?: () => void) {
    const sc = SCENARIOS.find(s => s.id === id)!;
    setRunStatus(p => ({ ...p, [id]: 'running' }));
    setStepProgress(p => ({ ...p, [id]: -1 }));
    let step = 0;
    const tick = () => {
      setStepProgress(p => ({ ...p, [id]: step }));
      step++;
      if (step < sc.chain.length) {
        timerRef.current = setTimeout(tick, STEP_DELAY);
      } else {
        timerRef.current = setTimeout(() => {
          setRunStatus(p => ({ ...p, [id]: 'complete' }));
          onFinish?.();
        }, STEP_DELAY);
      }
    };
    timerRef.current = setTimeout(tick, 200);
  }

  function handleRun() {
    if (status === 'running') return;
    runScenario(selectedId);
  }

  function handleReset(id?: string) {
    const target = id ?? selectedId;
    setRunStatus(p => ({ ...p, [target]: 'idle' }));
    setStepProgress(p => ({ ...p, [target]: -1 }));
  }

  async function handleRunAll() {
    if (runningAll) return;
    setRunningAll(true);
    let i = 0;
    const runNext = () => {
      if (i >= SCENARIOS.length) { setRunningAll(false); return; }
      const id = SCENARIOS[i].id;
      setSelectedId(id);
      runScenario(id, () => {
        i++;
        timerRef.current = setTimeout(runNext, 600);
      });
    };
    runNext();
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const passCount  = SCENARIOS.filter(s => (runStatus[s.id] === 'complete') && s.testScore >= 90).length;
  const partCount  = SCENARIOS.filter(s => (runStatus[s.id] === 'complete') && s.testScore >= 75 && s.testScore < 90).length;
  const failCount  = SCENARIOS.filter(s => (runStatus[s.id] === 'complete') && s.testScore < 75).length;
  const totalRun   = SCENARIOS.filter(s => runStatus[s.id] === 'complete' || runStatus[s.id] === 'running').length;

  return (
    <div style={{ marginLeft: 224, minHeight: "100vh", background: P.bg, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "22px 32px 18px", borderBottom: `1px solid ${P.border}`, background: P.panel, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.22em", color: P.green, textTransform: "uppercase", padding: "2px 8px", border: `1px solid ${P.green}30`, background: `${P.green}08` }}>VALIDATION · ACTIVE</span>
            <span style={{ fontSize: 7.5, color: P.dimmed }}>WELBX Scenario Replay Lab · v1.0</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: P.white, letterSpacing: "-0.01em", marginBottom: 5 }}>Scenario Replay Lab</h1>
          <p style={{ fontSize: 10.5, color: P.muted, maxWidth: 520 }}>
            Manually simulate hotel scenarios through the full WELBX chain before live integration. Each scenario is scored against expected behavioural logic at every step.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          {/* Suite summary */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "PASS",    val: passCount, color: P.green },
              { label: "PARTIAL", val: partCount, color: P.amber },
              { label: "FAIL",    val: failCount, color: P.red },
              { label: "PENDING", val: SCENARIOS.length - totalRun, color: P.dimmed },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color }}>{val}</div>
                <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.14em", color, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleRunAll}
              disabled={runningAll}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: runningAll ? "transparent" : `${P.green}12`, border: `1px solid ${runningAll ? P.border : P.green + "40"}`, cursor: runningAll ? "not-allowed" : "pointer", color: runningAll ? P.dimmed : P.green, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.15s" }}
            >
              {runningAll ? <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={10} />}
              {runningAll ? "Running Suite..." : "Run All Tests"}
            </button>
            <button
              onClick={() => { SCENARIOS.forEach(s => handleReset(s.id)); setRunningAll(false); }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", background: "transparent", border: `1px solid ${P.border}`, cursor: "pointer", color: P.dimmed, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              <RefreshCw size={10} /> Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left: Test list */}
        <div style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${P.border}`, overflowY: "auto", background: P.panel }}>
          <div style={{ padding: "14px 16px 8px", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase" }}>
            Test Suite · {SCENARIOS.length} scenarios
          </div>
          {SCENARIOS.map(sc => {
            const st = runStatus[sc.id] ?? 'idle';
            const isSelected = sc.id === selectedId;
            const scoreColor = sc.testScore >= 90 ? P.green : sc.testScore >= 75 ? P.amber : P.red;
            return (
              <div
                key={sc.id}
                style={{
                  borderLeft: isSelected ? `2px solid ${P.amber}` : `2px solid transparent`,
                  background: isSelected ? "hsl(220 13% 10%)" : "transparent",
                  transition: "all 0.12s",
                }}
              >
                <div
                  onClick={() => setSelectedId(sc.id)}
                  style={{ cursor: "pointer", padding: "9px 16px 5px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <StatusDot status={st} score={sc.testScore} />
                      <span style={{ fontSize: 9, fontWeight: 600, color: isSelected ? P.white : P.muted, lineHeight: 1.3 }}>{sc.name}</span>
                    </div>
                    {st === 'complete' && <span style={{ fontSize: 9, fontWeight: 700, color: scoreColor }}>{sc.testScore}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: 17 }}>
                    <span style={{ fontSize: 7.5, letterSpacing: "0.1em", color: URGENCY_COLOR[sc.urgency] as string, fontWeight: 700, textTransform: "uppercase" }}>{sc.urgency}</span>
                    <span style={{ color: P.border }}>·</span>
                    <span style={{ fontSize: 7.5, color: P.dimmed }}>{sc.category}</span>
                    <span style={{ color: P.border }}>·</span>
                    <span style={{ fontSize: 7.5, fontFamily: "monospace", color: P.dimmed }}>{sc.id}</span>
                  </div>
                </div>
                <div style={{ padding: "0 16px 8px", marginLeft: 17 }}>
                  <Link
                    href={`/scenario-replay-lab/${sc.id}`}
                    style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                      color: P.amber, textDecoration: "none",
                      display: "inline-flex", alignItems: "center", gap: 4,
                      opacity: 0.75,
                    }}
                  >
                    GUIDED TEST →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Scenario detail + chain */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {/* Scenario header */}
          <div style={{ marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${P.border}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 8, fontFamily: "monospace", color: P.dimmed }}>{scenario.id}</span>
                  <span style={{ color: P.border }}>·</span>
                  <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: URGENCY_COLOR[scenario.urgency] as string, textTransform: "uppercase" }}>{scenario.urgency}</span>
                  <span style={{ color: P.border }}>·</span>
                  <span style={{ fontSize: 7.5, color: P.dimmed }}>{scenario.category}</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: P.white, letterSpacing: "-0.01em", marginBottom: 6 }}>{scenario.name}</h2>
                <p style={{ fontSize: 10.5, color: P.muted, lineHeight: 1.65, maxWidth: 560 }}>{scenario.summary}</p>
              </div>
              <div style={{ display: "flex", flex: "column", gap: 8, alignItems: "flex-end", flexDirection: "column" }}>
                <ScoreBadge score={scenario.testScore} status={status} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleRun}
                    disabled={status === 'running'}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: status === 'running' ? "transparent" : `${P.amber}10`, border: `1px solid ${status === 'running' ? P.border : P.amber + "40"}`, cursor: status === 'running' ? "not-allowed" : "pointer", color: status === 'running' ? P.dimmed : P.amber, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.15s" }}
                  >
                    {status === 'running' ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={11} />}
                    {status === 'running' ? "Running..." : status === 'complete' ? "Re-run" : "Run Test"}
                  </button>
                  {status !== 'idle' && (
                    <button
                      onClick={() => handleReset()}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", background: "transparent", border: `1px solid ${P.border}`, cursor: "pointer", color: P.dimmed, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
                    >
                      <RefreshCw size={10} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            {status === 'complete' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 12, padding: "8px 12px", background: `${P.green}08`, border: `1px solid ${P.green}20`, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 8.5, fontFamily: "monospace", color: P.green, lineHeight: 1.5 }}>▶ {scenario.scoreNote}</span>
              </motion.div>
            )}
          </div>

          {/* Chain steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", marginBottom: 12 }}>
              Behavioural Chain · {scenario.chain.length} steps
            </div>
            {scenario.chain.map((step, i) => {
              const stepDone    = progress >= i;
              const stepActive  = status === 'running' && progress === i - 1 && i <= scenario.chain.length - 1;
              const isRunningThis = status === 'running' && progress === i;
              const stageColor  = STAGE_COLOR[step.stage] ?? P.muted;

              return (
                <div key={i} style={{ display: "flex", gap: 0, marginBottom: 0 }}>
                  {/* Connector column */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28, flexShrink: 0 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, border: `1px solid ${stepDone ? stageColor : isRunningThis ? stageColor : P.border}`, background: stepDone ? `${stageColor}14` : P.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", marginTop: 12 }}>
                      {isRunningThis
                        ? <Loader2 size={9} color={stageColor} style={{ animation: "spin 1s linear infinite" }} />
                        : stepDone
                          ? step.pass ? <span style={{ fontSize: 9, color: stageColor }}>✓</span> : <span style={{ fontSize: 9, color: P.red }}>✗</span>
                          : <span style={{ fontSize: 7, fontWeight: 700, color: P.dimmed }}>{i + 1}</span>
                      }
                    </div>
                    {i < scenario.chain.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: stepDone ? `${stageColor}30` : P.border, transition: "background 0.3s", minHeight: 16 }} />
                    )}
                  </div>

                  {/* Step card */}
                  <div
                    style={{
                      flex: 1, marginLeft: 10, marginBottom: 8, padding: "11px 14px",
                      background: isRunningThis ? `${stageColor}07` : stepDone ? `${stageColor}05` : P.card,
                      border: `1px solid ${isRunningThis ? stageColor + "30" : stepDone ? stageColor + "18" : P.border}`,
                      transition: "all 0.25s", opacity: stepDone || isRunningThis ? 1 : status === 'idle' ? 0.75 : 0.35,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: stepDone || isRunningThis ? 6 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.18em", color: stageColor, textTransform: "uppercase", minWidth: 76 }}>{step.stage}</span>
                        <ChevronRight size={9} color={P.border} />
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: stepDone || isRunningThis ? P.white : P.muted }}>{step.label}</span>
                      </div>
                      {stepDone && !isRunningThis && (
                        <span style={{ fontSize: 7.5, fontWeight: 700, color: step.pass ? P.green : P.amber, letterSpacing: "0.12em" }}>{step.pass ? "PASS" : "FLAGGED"}</span>
                      )}
                    </div>

                    {(stepDone || isRunningThis) && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }}>
                        <p style={{ fontSize: 9.5, color: P.muted, marginBottom: 5, lineHeight: 1.55 }}>{step.detail}</p>
                        <div style={{ padding: "5px 9px", background: "hsl(220 13% 4%)", border: `1px solid ${P.border}`, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 8, fontFamily: "monospace", color: step.pass ? P.green : P.amber }}>▶</span>
                          <span style={{ fontSize: 8.5, fontFamily: "monospace", color: step.pass ? P.green : P.amber, letterSpacing: "0.02em" }}>{step.output}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Score reveal */}
          <AnimatePresence>
            {status === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                style={{ marginTop: 16, padding: "18px 20px", background: P.card, border: `1px solid ${scenario.testScore >= 90 ? P.green + "30" : P.amber + "30"}` }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", marginBottom: 4 }}>Test Complete · {scenario.id}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 36, fontWeight: 800, color: scenario.testScore >= 90 ? P.green : P.amber, lineHeight: 1 }}>{scenario.testScore}</span>
                      <span style={{ fontSize: 13, color: P.dimmed }}>/100</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 14 }}>
                    {[
                      { label: "Passed",  val: scenario.chain.filter(s => s.pass).length,  color: P.green },
                      { label: "Flagged", val: scenario.chain.filter(s => !s.pass).length, color: P.amber },
                      { label: "Steps",   val: scenario.chain.length,                       color: P.muted },
                    ].map(({ label, val, color }) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
                        <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", color, textTransform: "uppercase" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 9, fontFamily: "monospace", color: P.muted, lineHeight: 1.65, padding: "8px 10px", background: "hsl(220 13% 4%)", border: `1px solid ${P.border}` }}>
                  <span style={{ color: P.green }}>✓ </span>{scenario.scoreNote}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
