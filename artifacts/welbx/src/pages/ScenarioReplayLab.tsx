import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RefreshCw, CheckCircle2, XCircle, Clock, ChevronRight, Loader2, FileDown } from "lucide-react";
import { exportScenarioReport } from "@/utils/exportReport";
import { SCENARIOS } from "@/data/scenarios";
import type { Urgency } from "@/data/scenarios";
import { loadScorecard } from "@/pages/ScenarioScorecard";
import { COMPARISONS, DIMENSIONS } from "@/data/comparisons";

/* ─── Types ──────────────────────────────────────────────────────── */
type Status = 'idle' | 'running' | 'complete' | 'failed';
type RedTeamStatus = 'risk' | 'mitigation' | 'resolved' | 'na';
type RedTeamEntry = { status: RedTeamStatus | null; notes: string };

/* ─── Red team constants ─────────────────────────────────────────── */
const RT_QUESTIONS: Array<{ key: string; text: string; detail: string }> = [
  { key: "wrong_signal",      text: "What if the signal is wrong?",                       detail: "Sensor misfire, stale data, or false positive triggers an incorrect moment classification." },
  { key: "conflict",          text: "What if two moments conflict?",                      detail: "Two simultaneous moments compete for the same resource, staff member, or communication channel." },
  { key: "staff_ignore",      text: "What if staff ignore the alert?",                    detail: "Notification received but no action taken within the expected response window." },
  { key: "guest_no_respond",  text: "What if the guest does not respond?",                detail: "Communication sent to guest but no acknowledgement or engagement is returned." },
  { key: "wrong_owner",       text: "What if the wrong owner is assigned?",               detail: "Action routed to incorrect department, role, or individual due to stale ownership data." },
  { key: "delayed_escalation",text: "What if escalation is delayed?",                    detail: "Escalation trigger fires late due to network latency, system load, or manual override." },
  { key: "privacy_limit",     text: "What if privacy constraints limit available data?",  detail: "GDPR or guest consent restrictions prevent key data points from being surfaced to the chain." },
];

const RT_STATUSES: Array<{ key: RedTeamStatus; label: string; color: string; bg: string }> = [
  { key: "risk",       label: "Risk Identified",     color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  { key: "mitigation", label: "Mitigation Required", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { key: "resolved",   label: "Resolved",            color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { key: "na",         label: "Not Applicable",      color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
];

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
  const [detailTab, setDetailTab] = useState<'chain' | 'comparison' | 'redteam'>('chain');
  const [redTeam, setRedTeam] = useState<Record<string, Record<string, RedTeamEntry>>>(() => {
    const out: Record<string, Record<string, RedTeamEntry>> = {};
    SCENARIOS.forEach(sc => {
      try {
        const raw = localStorage.getItem(`welbx_redteam_${sc.id}`);
        if (raw) out[sc.id] = JSON.parse(raw) as Record<string, RedTeamEntry>;
      } catch { /* ignore */ }
    });
    return out;
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateRedTeam(scenarioId: string, questionKey: string, update: Partial<RedTeamEntry>) {
    setRedTeam(prev => {
      const current = prev[scenarioId] ?? {};
      const entry = current[questionKey] ?? { status: null, notes: "" };
      const updated = { ...current, [questionKey]: { ...entry, ...update } };
      const next = { ...prev, [scenarioId]: updated };
      try { localStorage.setItem(`welbx_redteam_${scenarioId}`, JSON.stringify(updated)); } catch { /* ignore */ }
      return next;
    });
  }

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
            <span style={{ fontSize: 7.5, color: P.dimmed }}>RTBX Travel Scenario Replay Lab · v1.0</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: P.white, letterSpacing: "-0.01em", marginBottom: 5 }}>Scenario Replay Lab</h1>
          <p style={{ fontSize: 10.5, color: P.muted, maxWidth: 520 }}>
            Manually simulate hotel scenarios through the full RTBX Travel operating chain before live integration. Each scenario is scored against expected behavioural logic at every step.
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
                <div style={{ padding: "0 16px 8px", marginLeft: 17, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
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
                  {(() => {
                    const card = loadScorecard(sc.id);
                    if (!card) return null;
                    const statusColor = card.total >= 85 ? P.green : card.total >= 70 ? "#f59e0b" : P.red;
                    return (
                      <>
                        <span style={{ color: P.border }}>·</span>
                        <Link
                          href={`/scenario-replay-lab/${sc.id}/scorecard`}
                          style={{
                            fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                            color: statusColor, textDecoration: "none",
                            display: "inline-flex", alignItems: "center", gap: 4,
                            opacity: 0.85,
                          }}
                        >
                          SCORED: {card.total}/100 →
                        </Link>
                      </>
                    );
                  })()}
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
                <button
                  onClick={() => exportScenarioReport(scenario.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "transparent", border: `1px solid ${P.border}`, cursor: "pointer", color: P.muted, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = P.white; (e.currentTarget as HTMLButtonElement).style.borderColor = P.dimmed; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = P.muted; (e.currentTarget as HTMLButtonElement).style.borderColor = P.border; }}
                >
                  <FileDown size={10} />
                  Export Scenario Validation Report
                </button>
              </div>
            </div>
            {status === 'complete' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 12, padding: "8px 12px", background: `${P.green}08`, border: `1px solid ${P.green}20`, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 8.5, fontFamily: "monospace", color: P.green, lineHeight: 1.5 }}>▶ {scenario.scoreNote}</span>
              </motion.div>
            )}
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", borderBottom: `1px solid ${P.border}`, marginBottom: 18, marginTop: 4 }}>
            {(["chain", "comparison", "redteam"] as const).map(tab => {
              const rtData = redTeam[selectedId] ?? {};
              const riskCount = Object.values(rtData).filter(e => e.status === 'risk').length;
              const unreviewed = RT_QUESTIONS.filter(q => !rtData[q.key]?.status).length;
              return (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  style={{
                    padding: "8px 16px", background: "transparent", border: "none",
                    borderBottom: detailTab === tab ? `2px solid ${P.amber}` : "2px solid transparent",
                    color: detailTab === tab ? P.white : P.dimmed,
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                    cursor: "pointer", marginBottom: -1, transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 7,
                  }}
                >
                  {tab === "chain" ? "BEHAVIOURAL CHAIN" : tab === "comparison" ? "VS TRADITIONAL" : "RED TEAM"}
                  {tab === "redteam" && riskCount > 0 && (
                    <span style={{ fontSize: 7, fontWeight: 800, background: P.red, color: "#fff", borderRadius: 3, padding: "1px 5px", letterSpacing: 0 }}>{riskCount}</span>
                  )}
                  {tab === "redteam" && riskCount === 0 && unreviewed > 0 && (
                    <span style={{ fontSize: 7, fontWeight: 800, background: P.dimmed, color: "#fff", borderRadius: 3, padding: "1px 5px", letterSpacing: 0 }}>{unreviewed}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Chain steps */}
          {detailTab === "chain" && (
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
          )} {/* end chain tab */}

          {/* Comparison tab */}
          {detailTab === "comparison" && (() => {
            const comp = COMPARISONS[scenario.id];
            if (!comp) return (
              <div style={{ padding: "32px 0", textAlign: "center", color: P.dimmed, fontSize: 11 }}>
                No comparison data available for this scenario.
              </div>
            );
            const majorCount = DIMENSIONS.filter(d => comp[d.key].delta === "major").length;
            const modCount   = DIMENSIONS.filter(d => comp[d.key].delta === "moderate").length;
            return (
              <div>
                {/* Column headers */}
                <div style={{
                  display: "grid", gridTemplateColumns: "148px 1fr 1fr",
                  gap: 1, background: P.border,
                  borderRadius: "6px 6px 0 0", overflow: "hidden", marginBottom: 1,
                }}>
                  <div style={{ background: P.panel, padding: "10px 14px" }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase" }}>DIMENSION</div>
                  </div>
                  <div style={{ background: "rgba(239,68,68,0.09)", padding: "10px 14px" }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: "#f87171", textTransform: "uppercase" }}>Traditional Hotel Response</div>
                    <div style={{ fontSize: 9.5, color: P.dimmed, marginTop: 2 }}>Without the RTBX Travel operating layer</div>
                  </div>
                  <div style={{ background: "rgba(201,168,76,0.09)", padding: "10px 14px" }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.amber, textTransform: "uppercase" }}>RTBX Travel Response</div>
                    <div style={{ fontSize: 9.5, color: P.dimmed, marginTop: 2 }}>With the RTBX Travel operating layer active</div>
                  </div>
                </div>

                {DIMENSIONS.map((dim, idx) => {
                  const row = comp[dim.key];
                  const isLast = idx === DIMENSIONS.length - 1;
                  const deltaColor = row.delta === "major" ? P.green : row.delta === "moderate" ? P.amber : P.muted;
                  return (
                    <div
                      key={dim.key}
                      style={{
                        display: "grid", gridTemplateColumns: "148px 1fr 1fr",
                        gap: 1, background: P.border, marginBottom: 1,
                        ...(isLast ? { borderRadius: "0 0 6px 6px", overflow: "hidden" } : {}),
                      }}
                    >
                      <div style={{ background: P.panel, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ fontSize: 12 }}>{dim.icon}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: P.white, lineHeight: 1.3 }}>{dim.label}</div>
                        <div style={{
                          display: "inline-block", fontSize: 7, fontWeight: 700, letterSpacing: "0.1em",
                          color: deltaColor, border: `1px solid ${deltaColor}35`,
                          padding: "1px 5px", borderRadius: 2, textTransform: "uppercase",
                          background: `${deltaColor}12`, alignSelf: "flex-start",
                        }}>
                          {row.delta}
                        </div>
                      </div>
                      <div style={{ background: "rgba(239,68,68,0.04)", padding: "12px 14px" }}>
                        <div style={{ fontSize: 10.5, color: "#f87171", lineHeight: 1.6, opacity: 0.85 }}>{row.traditional}</div>
                      </div>
                      <div style={{ background: "rgba(201,168,76,0.04)", padding: "12px 14px" }}>
                        <div style={{ fontSize: 10.5, color: P.white, lineHeight: 1.6 }}>{row.welbx}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Summary bar */}
                <div style={{
                  marginTop: 14, padding: "14px 20px",
                  background: P.panel, border: `1px solid ${P.border}`, borderRadius: 6,
                  display: "flex", alignItems: "center", gap: 24,
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 26, fontWeight: 800, color: P.green }}>{majorCount}</span>
                    <span style={{ fontSize: 9, color: P.muted }}>of 8 dimensions — major improvement</span>
                  </div>
                  {modCount > 0 && (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: 700, color: P.amber }}>{modCount}</span>
                      <span style={{ fontSize: 9, color: P.muted }}>moderate</span>
                    </div>
                  )}
                  <div style={{ marginLeft: "auto", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: P.dimmed, textTransform: "uppercase" }}>
                    RTBX Travel vs. Traditional · {scenario.id}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Red Team tab */}
          {detailTab === "redteam" && (() => {
            const rtData = redTeam[selectedId] ?? {};
            const counts = {
              risk:       RT_QUESTIONS.filter(q => rtData[q.key]?.status === 'risk').length,
              mitigation: RT_QUESTIONS.filter(q => rtData[q.key]?.status === 'mitigation').length,
              resolved:   RT_QUESTIONS.filter(q => rtData[q.key]?.status === 'resolved').length,
              na:         RT_QUESTIONS.filter(q => rtData[q.key]?.status === 'na').length,
              unreviewed: RT_QUESTIONS.filter(q => !rtData[q.key]?.status).length,
            };
            const allDone = counts.unreviewed === 0;
            return (
              <div>
                {/* Summary bar */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                  padding: "12px 16px", background: P.card, border: `1px solid ${P.border}`, borderRadius: 6,
                  marginBottom: 16,
                }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginRight: 4 }}>Red Team Status · {scenario.id}</div>
                  {RT_STATUSES.map(s => {
                    const n = counts[s.key];
                    return (
                      <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: n > 0 ? s.color : P.dimmed }}>{n}</span>
                        <span style={{ fontSize: 8, color: P.dimmed }}>{s.label}</span>
                      </div>
                    );
                  })}
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: P.border }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: counts.unreviewed > 0 ? P.muted : P.dimmed }}>{counts.unreviewed}</span>
                    <span style={{ fontSize: 8, color: P.dimmed }}>Unreviewed</span>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <span style={{
                      fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: allDone ? (counts.risk > 0 ? P.red : P.green) : P.dimmed,
                      padding: "2px 8px", border: `1px solid ${allDone ? (counts.risk > 0 ? P.red : P.green) : P.border}30`,
                      background: allDone ? (counts.risk > 0 ? `${P.red}10` : `${P.green}10`) : "transparent",
                    }}>
                      {allDone ? (counts.risk > 0 ? `${counts.risk} UNRESOLVED RISK${counts.risk > 1 ? "S" : ""}` : "ALL CLEAR") : `${counts.unreviewed} QUESTION${counts.unreviewed !== 1 ? "S" : ""} PENDING REVIEW`}
                    </span>
                  </div>
                </div>

                {/* Question cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {RT_QUESTIONS.map((q, i) => {
                    const entry = rtData[q.key] ?? { status: null, notes: "" };
                    const activeStatus = RT_STATUSES.find(s => s.key === entry.status);
                    const leftColor = activeStatus?.color ?? P.border;
                    return (
                      <div key={q.key} style={{
                        background: P.card, border: `1px solid ${activeStatus ? leftColor + "25" : P.border}`,
                        borderLeft: `3px solid ${leftColor}`, borderRadius: 5,
                        padding: "14px 16px", transition: "border-color 0.2s",
                      }}>
                        {/* Question header */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                          <span style={{ fontSize: 8, fontWeight: 700, color: P.dimmed, minWidth: 16, marginTop: 1 }}>Q{i + 1}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: P.white, marginBottom: 3, lineHeight: 1.4 }}>{q.text}</div>
                            <div style={{ fontSize: 9, color: P.muted, lineHeight: 1.55 }}>{q.detail}</div>
                          </div>
                          {activeStatus && (
                            <span style={{
                              fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                              color: activeStatus.color, background: activeStatus.bg,
                              padding: "2px 8px", borderRadius: 3, flexShrink: 0,
                            }}>{activeStatus.label}</span>
                          )}
                        </div>

                        {/* Status buttons */}
                        <div style={{ display: "flex", gap: 6, marginBottom: entry.status ? 10 : 0, flexWrap: "wrap" }}>
                          {RT_STATUSES.map(s => {
                            const isActive = entry.status === s.key;
                            return (
                              <button
                                key={s.key}
                                onClick={() => updateRedTeam(selectedId, q.key, { status: isActive ? null : s.key })}
                                style={{
                                  fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                                  padding: "5px 11px", cursor: "pointer", transition: "all 0.15s",
                                  border: `1px solid ${isActive ? s.color : P.border}`,
                                  background: isActive ? s.bg : "transparent",
                                  color: isActive ? s.color : P.dimmed,
                                  borderRadius: 3,
                                }}
                              >{s.label}</button>
                            );
                          })}
                        </div>

                        {/* Notes — shown once a status is selected */}
                        {entry.status && (
                          <div style={{ marginTop: 8 }}>
                            <textarea
                              value={entry.notes}
                              onChange={e => updateRedTeam(selectedId, q.key, { notes: e.target.value })}
                              placeholder="Add tester notes, mitigation steps, or resolution detail…"
                              rows={2}
                              style={{
                                width: "100%", background: "hsl(220 13% 4%)", border: `1px solid ${P.border}`,
                                color: P.white, fontSize: 9.5, lineHeight: 1.6,
                                padding: "7px 10px", resize: "vertical", outline: "none",
                                fontFamily: "inherit", borderRadius: 3,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer guidance */}
                <div style={{ marginTop: 14, padding: "12px 16px", background: `${P.amber}08`, border: `1px solid ${P.amber}20`, borderRadius: 5 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: P.amber, textTransform: "uppercase", marginBottom: 5 }}>Purpose · Operational Edge Case Review</div>
                  <div style={{ fontSize: 9.5, color: P.muted, lineHeight: 1.65 }}>
                    Red team testing exposes operational failure modes before live pilot deployment. Mark each question with the appropriate status and add resolution notes where required. All findings are included in the exported Scenario Validation Report.
                  </div>
                </div>
              </div>
            );
          })()}

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
