import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { TRAVEL_SCENARIOS, ALL_SCENARIO_ROLES, SCENARIO_LABELS, type TravelScenario, type TravelScenarioRole } from "@/data/travelScenarios";

const C = { gold: "#c9a84c", green: "#10b981", blue: "#3b82f6", orange: "#f97316", red: "#ef4444", purple: "#a78bfa", muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)" };

type NodeId = "input" | "signal" | "moment" | "governance" | "playbook" | "role" | "communication" | "action" | "evidence" | "outcome" | "value" | "learning";

const NODES: { id: NodeId; label: string }[] = [
  { id: "input",         label: "Existing System" },
  { id: "signal",        label: "Signal" },
  { id: "moment",        label: "Moment" },
  { id: "governance",    label: "Governance" },
  { id: "playbook",      label: "Playbook" },
  { id: "role",          label: "Role" },
  { id: "communication", label: "Communication" },
  { id: "action",        label: "Action" },
  { id: "evidence",      label: "Evidence" },
  { id: "outcome",       label: "Outcome" },
  { id: "value",         label: "Value" },
  { id: "learning",      label: "Learning" },
];

function Badge({ children, color }: { children: string; color: string }) {
  return (
    <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color, border: `1px solid ${color}45`, background: `${color}0c`, padding: "2px 8px", display: "inline-block" }}>
      {children}
    </span>
  );
}

function ScenarioRunner({ scenario }: { scenario: TravelScenario }) {
  const [started, setStarted] = useState(false);
  const [reachedIdx, setReachedIdx] = useState(0); // furthest unlocked node index
  const [activeIdx, setActiveIdx] = useState(0);
  const [roleView, setRoleView] = useState<TravelScenarioRole>(scenario.roles[0]);
  const [commsSent, setCommsSent] = useState<Record<string, boolean>>({});
  const [actionConfirmed, setActionConfirmed] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [outcomeCompleted, setOutcomeCompleted] = useState(false);

  const reset = () => {
    setStarted(false); setReachedIdx(0); setActiveIdx(0); setRoleView(scenario.roles[0]);
    setCommsSent({}); setActionConfirmed(false); setEscalated(false); setOutcomeCompleted(false);
  };

  const start = () => { setStarted(true); setReachedIdx(1); setActiveIdx(1); };

  const goto = (idx: number) => { if (idx <= reachedIdx) setActiveIdx(idx); };

  const advance = () => {
    const next = Math.min(activeIdx + 1, NODES.length - 1);
    setReachedIdx(r => Math.max(r, next));
    setActiveIdx(next);
  };

  const sendComm = (id: string) => setCommsSent(prev => ({ ...prev, [id]: true }));
  const allCommsSent = scenario.comms.every(c => commsSent[c.id]);

  const activeNode = NODES[activeIdx].id;

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderTop: `2px solid ${C.gold}`, padding: "28px 30px", marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.25)" }}>{scenario.num}</span>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>{scenario.title}</h3>
            <Badge color={C.gold}>{SCENARIO_LABELS.demo}</Badge>
            <Badge color="rgba(255,255,255,0.4)">{SCENARIO_LABELS.synthetic}</Badge>
          </div>
          <div style={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>{scenario.category}</div>
        </div>
        {started && (
          <div onClick={reset} style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.15)", padding: "8px 16px", cursor: "pointer", whiteSpace: "nowrap" }}>
            ↺ Reset scenario
          </div>
        )}
      </div>

      {!started ? (
        <div>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 18, maxWidth: 680 }}>
            Existing system: <strong style={{ color: "rgba(255,255,255,0.7)" }}>{scenario.existingSystem}</strong>. Signals: {scenario.signals.join(", ")}.
          </p>
          <div onClick={start} style={{ display: "inline-block", padding: "11px 24px", background: C.gold, color: "#080c14", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            ▶ Start scenario
          </div>
        </div>
      ) : (
        <>
          {/* role view selector */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 7 }}>Select role view</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {scenario.roles.map(r => (
                <div key={r} onClick={() => setRoleView(r)} style={{
                  padding: "6px 13px", fontSize: 10, fontWeight: 700, cursor: "pointer",
                  color: roleView === r ? "#080c14" : "rgba(255,255,255,0.5)",
                  background: roleView === r ? C.blue : "rgba(255,255,255,0.03)",
                  border: `1px solid ${roleView === r ? C.blue : "rgba(255,255,255,0.12)"}`,
                }}>
                  {r}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>Viewing as <strong style={{ color: "rgba(255,255,255,0.55)" }}>{roleView}</strong> — communications and actions relevant to this role are highlighted below.</div>
          </div>

          {/* pipeline nodes */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 20 }}>
            {NODES.map((n, i) => {
              const unlocked = i <= reachedIdx;
              const isActive = i === activeIdx;
              return (
                <div key={n.id} onClick={() => goto(i)} style={{
                  padding: "8px 12px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.03em",
                  cursor: unlocked ? "pointer" : "default",
                  color: isActive ? "#080c14" : unlocked ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)",
                  background: isActive ? C.gold : unlocked ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
                  border: `1px solid ${isActive ? C.gold : unlocked ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
                }}>
                  {i + 1}. {n.label}
                </div>
              );
            })}
          </div>

          {/* node detail panel */}
          <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", padding: "20px 22px", marginBottom: 16, minHeight: 120 }}>
            {activeNode === "input" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Existing System / Input</div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{scenario.existingSystem}</p>
              </div>
            )}
            {activeNode === "signal" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Incoming Signal <Badge color={C.blue}>{SCENARIO_LABELS.aiAssisted}</Badge></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {scenario.signals.map(s => <div key={s} style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", padding: "6px 12px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>{s}</div>)}
                </div>
              </div>
            )}
            {activeNode === "moment" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Moment · AI Classification <Badge color={C.blue}>{SCENARIO_LABELS.aiAssisted}</Badge></div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{scenario.moment}</div>
                <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{scenario.momentClassification}</p>
              </div>
            )}
            {activeNode === "governance" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Governance Source</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {scenario.governance.map(g => <div key={g} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", padding: "8px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>{g}</div>)}
                </div>
              </div>
            )}
            {activeNode === "playbook" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Recommended Playbook <Badge color={C.blue}>{SCENARIO_LABELS.aiAssisted}</Badge></div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{scenario.playbook}</div>
                {scenario.aiBoundary && (
                  <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.red, marginBottom: 6 }}>AI Boundary</div>
                    <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>{scenario.aiBoundary}</p>
                  </div>
                )}
              </div>
            )}
            {activeNode === "role" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Roles Involved</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {scenario.roles.map(r => (
                    <div key={r} style={{
                      fontSize: 11, fontWeight: 700, padding: "6px 13px",
                      color: r === roleView ? "#080c14" : "rgba(255,255,255,0.55)",
                      background: r === roleView ? C.blue : "rgba(255,255,255,0.03)",
                      border: `1px solid ${r === roleView ? C.blue : "rgba(255,255,255,0.12)"}`,
                    }}>{r}{r === roleView ? " (your view)" : ""}</div>
                  ))}
                </div>
              </div>
            )}
            {activeNode === "communication" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Communications</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {scenario.comms.map(c => {
                    const sent = !!commsSent[c.id];
                    const relevant = c.toRole === roleView;
                    return (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 14px", background: relevant ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${relevant ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.07)"}` }}>
                        <div>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{c.label} {c.requiresApproval && <Badge color={C.orange}>{SCENARIO_LABELS.approval}</Badge>}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{c.channel} → {c.toRole}</div>
                        </div>
                        <div onClick={() => sendComm(c.id)} style={{
                          fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                          padding: "7px 14px", cursor: sent ? "default" : "pointer", whiteSpace: "nowrap",
                          color: sent ? C.green : "#080c14", background: sent ? "transparent" : C.gold,
                          border: sent ? `1px solid ${C.green}50` : "none",
                        }}>
                          {sent ? "✓ Sent" : "Send demo communication"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {activeNode === "action" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Human Action <Badge color={C.orange}>{SCENARIO_LABELS.approval}</Badge></div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 14 }}>{scenario.actionDetail}</p>
                {scenario.requiresEscalation && (
                  <div style={{ marginBottom: 14, padding: "12px 16px", background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.25)" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.orange, marginBottom: 6 }}>Escalation Required</div>
                    <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 0 10px" }}>{scenario.escalationNote}</p>
                    <div onClick={() => setEscalated(true)} style={{
                      display: "inline-block", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                      padding: "8px 16px", cursor: escalated ? "default" : "pointer",
                      color: escalated ? C.green : "#080c14", background: escalated ? "transparent" : C.orange,
                      border: escalated ? `1px solid ${C.green}50` : "none",
                    }}>
                      {escalated ? "✓ Escalated to human owner" : "Escalate to human owner"}
                    </div>
                  </div>
                )}
                <div onClick={() => { if (!scenario.requiresEscalation || escalated) setActionConfirmed(true); }} style={{
                  display: "inline-block", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "10px 20px", cursor: (!scenario.requiresEscalation || escalated) && !actionConfirmed ? "pointer" : "default",
                  color: actionConfirmed ? C.green : (!scenario.requiresEscalation || escalated) ? "#080c14" : "rgba(255,255,255,0.25)",
                  background: actionConfirmed ? "transparent" : (!scenario.requiresEscalation || escalated) ? C.gold : "rgba(255,255,255,0.04)",
                  border: actionConfirmed ? `1px solid ${C.green}50` : "none",
                }}>
                  {actionConfirmed ? "✓ Action confirmed" : scenario.actionLabel}
                </div>
              </div>
            )}
            {activeNode === "evidence" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Evidence Captured</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {scenario.evidence.map(e => (
                    <div key={e} style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", display: "flex", gap: 8 }}>
                      <span style={{ color: C.gold }}>●</span>{e}
                    </div>
                  ))}
                </div>
                {!allCommsSent && <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic", marginTop: 12 }}>Some demo communications have not been sent yet — return to the Communication step to complete the trail.</p>}
              </div>
            )}
            {activeNode === "outcome" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Outcome</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                  {scenario.outcome.map(o => (
                    <div key={o} style={{ fontSize: 11.5, color: outcomeCompleted ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)", display: "flex", gap: 8 }}>
                      <span style={{ color: outcomeCompleted ? C.green : "rgba(255,255,255,0.2)" }}>{outcomeCompleted ? "✓" : "○"}</span>{o}
                    </div>
                  ))}
                </div>
                <div onClick={() => setOutcomeCompleted(true)} style={{
                  display: "inline-block", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "10px 20px", cursor: outcomeCompleted ? "default" : "pointer",
                  color: outcomeCompleted ? C.green : "#080c14", background: outcomeCompleted ? "transparent" : C.gold,
                  border: outcomeCompleted ? `1px solid ${C.green}50` : "none",
                }}>
                  {outcomeCompleted ? "✓ Outcome completed" : "Complete outcome"}
                </div>
              </div>
            )}
            {activeNode === "value" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Value <Badge color={C.gold}>{SCENARIO_LABELS.demo}</Badge></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {scenario.value.map(v => <div key={v} style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", padding: "7px 14px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>{v}</div>)}
                </div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 12, fontStyle: "italic" }}>Illustrative values from synthetic scenario data — not verified financial or operational performance.</p>
              </div>
            )}
            {activeNode === "learning" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Learning</div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{scenario.learning}</p>
              </div>
            )}
          </div>

          {activeIdx < NODES.length - 1 && (
            <div onClick={advance} style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, border: `1px solid ${C.gold}50`, padding: "9px 18px", cursor: "pointer" }}>
              Next: {NODES[activeIdx + 1].label} →
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PartnerTravelScenarios() {
  const [activeScenarioId, setActiveScenarioId] = useState(TRAVEL_SCENARIOS[0].id);
  const activeScenario = TRAVEL_SCENARIOS.find(s => s.id === activeScenarioId)!;

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Scenarios</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 16, maxWidth: 760 }}>
            RTBX Travel Scenarios
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 700, marginBottom: 16 }}>
            See how signals move through governance, communication, action, evidence and value.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Badge color={C.gold}>{SCENARIO_LABELS.demo}</Badge>
            <Badge color="rgba(255,255,255,0.4)">{SCENARIO_LABELS.synthetic}</Badge>
            <Badge color={C.orange}>{SCENARIO_LABELS.approval}</Badge>
            <Badge color={C.blue}>{SCENARIO_LABELS.aiAssisted}</Badge>
          </div>
        </div>

        {/* scenario picker */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, marginBottom: 32 }}>
          {TRAVEL_SCENARIOS.map(s => (
            <div key={s.id} onClick={() => setActiveScenarioId(s.id)} style={{
              padding: "14px 16px", cursor: "pointer",
              background: activeScenarioId === s.id ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${activeScenarioId === s.id ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
              borderTop: `2px solid ${activeScenarioId === s.id ? C.gold : "transparent"}`,
            }}>
              <div style={{ fontSize: 8, fontWeight: 800, color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: activeScenarioId === s.id ? "#fff" : "rgba(255,255,255,0.6)" }}>{s.title}</div>
            </div>
          ))}
        </div>

        <ScenarioRunner key={activeScenario.id} scenario={activeScenario} />

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 48, paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Travel AI & Central Comms", href: "/partner-room/travel-ai-comms" },
            { label: "Travel Operations",          href: "/partner-room/operations" },
            { label: "Scenario Builder",            href: "/partner-room/scenario-builder" },
            { label: "Validation Replay Lab",       href: "/partner-room/validation-replay" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
