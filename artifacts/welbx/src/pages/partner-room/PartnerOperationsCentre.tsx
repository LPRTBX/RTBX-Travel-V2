import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import {
  TRAVEL_ACTION_CARDS, TRAVEL_PROPERTIES, TRAVEL_PRIORITIES, ACTION_STATUS_SEQUENCE,
  TRAVEL_OUTCOME_LEDGER, TRAVEL_EVIDENCE_LEDGER, EVIDENCE_WORDING_NOTE,
  TRAVEL_VALUE_CATEGORIES, VALUE_DEMO_LABEL_NOTE,
  TRAVEL_FEEDBACK_LOOP, TRAVEL_FEEDBACK_LOOP_STATEMENT,
  type ActionStatus, type TravelOperatingSystemName, type TravelRole,
} from "@/data/travelOperations";
import { useDeployment } from "@/context/DeploymentContext";
import {
  createExecution,
  transitionExecution,
  captureEvidence,
  uncaptureEvidence,
  recordOutcome,
  sendCommunication,
  triggerEscalation,
  generateLearning,
  getAvailableActions,
  getMandatoryEvidenceGaps,
  getEvidenceCompleteness,
  getStateLabel,
  getStateColor,
  canTransition,
  STATE_TO_STEP,
  TRACE_STEPS,
  OUTCOME_STATUS_LABELS,
  type ScenarioExecution,
  type RuntimeLearning,
  type OutcomeStatus,
} from "@/lib/runtimeEngine";
import { TRAVEL_SCENARIOS } from "@/data/travelScenarios";
import { TRAVEL_PLAYBOOKS } from "@/data/travelPlaybooks";
import { TRAVEL_OPERATING_SYSTEMS } from "@/data/travelOperatingSystems";
import type { TravelDeploymentConfig } from "@/data/travelDeploymentConfig";
import {
  getScenarioIdFromQuery,
  getScenarioRuntimeReadiness,
  travelScenarioConfigurePath,
  travelScenarioExecutionPath,
  travelScenarioPath,
} from "@/lib/travelScenarioRouting";

// ── Style constants ───────────────────────────────────────────────────────────

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", gold: "#c9a84c", green: "#10b981", red: "#ef4444", blue: "#3b82f6" };

const OPERATING_SYSTEMS: TravelOperatingSystemName[] = [
  "Guest Experience OS", "Service Recovery & Staff Response OS", "Marketplace & Loyalty Activation OS",
  "Operator Intelligence OS", "Safety & Guest Welfare OS",
];
const ROLES: TravelRole[] = ["Guest", "Frontline", "Manager", "Operator", "Partner", "Executive"];

const STATUS_COLORS: Record<ActionStatus, string> = {
  "New": "#3b82f6", "Acknowledged": "#a78bfa", "In progress": "#c9a84c",
  "Waiting approval": "#f97316", "Escalated": "#ef4444", "Completed": "#10b981",
  "Follow-up required": "#f97316", "Closed": "rgba(255,255,255,0.35)",
};
const PRIORITY_COLORS: Record<string, string> = { Low: "rgba(255,255,255,0.35)", Medium: "#3b82f6", High: "#f97316", Critical: "#ef4444" };

// ── Shared small components ───────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>
);
const H2 = ({ children }: { children: string }) => (
  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>{children}</h2>
);

function FilterPill({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{
      padding: "6px 13px", fontSize: 10, fontWeight: 700, cursor: "pointer",
      color: active ? "#080c14" : "rgba(255,255,255,0.5)",
      background: active ? color : "rgba(255,255,255,0.03)",
      border: `1px solid ${active ? color : "rgba(255,255,255,0.12)"}`,
    }}>
      {label}
    </div>
  );
}

// ── Deployment Banner ─────────────────────────────────────────────────────────

function DeploymentBanner({ deployment }: { deployment: TravelDeploymentConfig | null }) {
  if (!deployment) {
    return (
      <div style={{ marginBottom: 36, padding: "20px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid rgba(255,255,255,0.2)" }}>
        <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Local Simulation Configuration</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 12 }}>Start the Working Proof three-scenario setup.</div>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginBottom: 14, lineHeight: 1.65 }}>
          Configure three initial scenarios for one initial hotel property / 1–5-property cohort, then review their local traces in the interactive Execution Centre. The Action Centre, Outcome Ledger and Value Dashboard below contain synthetic, illustrative and modelled demonstration data only.
        </p>
        <Link href="/partner-room/build-configure">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)", cursor: "pointer" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: "0.06em" }}>Configure Deployment →</span>
          </div>
        </Link>
      </div>
    );
  }

  const activeOSCount      = deployment.operatingSystems.filter(o => o.active).length;
  const activeScenarios    = deployment.scenarios.filter(s => s.active);
  const activeRoleCount    = deployment.roles.filter(r => r.active).length;
  const systemMaturityMap  = Object.fromEntries(deployment.systems.map(s => [s.id, s.maturity]));
  const maturityCounts     = Object.values(systemMaturityMap).reduce<Record<string, number>>((acc, m) => {
    acc[m] = (acc[m] ?? 0) + 1;
    return acc;
  }, {});

  const MATURITY_COLORS: Record<string, string> = {
    simulated: "#3b82f6", manual: "rgba(255,255,255,0.45)",
    demonstrated: "#10b981", "connector-ready": "#c9a84c", planned: "rgba(255,255,255,0.3)",
  };

  return (
    <div style={{ marginBottom: 36, padding: "20px 24px", background: "rgba(10,20,40,0.5)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: "3px solid #c9a84c" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Selected Local Simulation Configuration</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{deployment.deploymentName}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{deployment.organisationName} · {deployment.propertyType} · {deployment.roomCount} rooms · {deployment.region}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ padding: "5px 12px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
            WORKING PROOF · LOCAL SIMULATION
          </div>
          <div style={{ padding: "5px 12px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
            SYNTHETIC DATA
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Selected OSes ({activeOSCount})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {deployment.operatingSystems.filter(o => o.active).map(os => {
              const osData = TRAVEL_OPERATING_SYSTEMS.find(d => d.id === os.osId);
              return (
                <div key={os.osId} style={{ padding: "3px 9px", fontSize: 9, fontWeight: 700, color: osData?.color ?? C.gold, border: `1px solid ${osData?.color ?? C.gold}40`, background: `${osData?.color ?? C.gold}0a` }}>
                  {osData?.name ?? os.osId}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Selected Scenarios ({activeScenarios.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {activeScenarios.map(ds => {
              const sc = TRAVEL_SCENARIOS.find(s => s.id === ds.scenarioId);
              return (
                <div key={ds.scenarioId} style={{ padding: "3px 9px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}>
                  {sc?.title ?? ds.scenarioId}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Connection Maturity</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {Object.entries(maturityCounts).map(([m, count]) => (
              <div key={m} style={{ padding: "3px 9px", fontSize: 9, fontWeight: 700, color: MATURITY_COLORS[m] ?? "rgba(255,255,255,0.4)", border: `1px solid ${MATURITY_COLORS[m] ?? "rgba(255,255,255,0.1)"}40` }}>
                {count}× {m}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Selected Roles</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{activeRoleCount} <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>of {deployment.roles.length}</span></div>
        </div>
      </div>

      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
        Synthetic local state only. Deterministic rules model classifications; communications remain drafts and are never sent or delivered. Nothing updates an external system, and named humans retain accountability.
      </div>
    </div>
  );
}

// ── Execution Trace Panel ─────────────────────────────────────────────────────

type ExecView = "operator" | "guest" | "dual";

function ExecTracePanel({
  deployment, scenario, playbook, onReset,
}: {
  deployment: TravelDeploymentConfig;
  scenario: (typeof TRAVEL_SCENARIOS)[0];
  playbook: (typeof TRAVEL_PLAYBOOKS)[0];
  onReset: () => void;
}) {
  const [exec, setExec] = useState<ScenarioExecution | null>(null);
  const [view, setView]     = useState<ExecView>("operator");
  const [learning, setLearning] = useState<RuntimeLearning | null>(null);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  const launch = () => setExec(createExecution({ deployment, scenario, playbook }));
  const reset  = () => { setExec(null); setLearning(null); onReset(); };

  const handleAction = (toState: Parameters<typeof transitionExecution>[1] | undefined, note?: string) => {
    if (!exec || !toState) return;
    const check = canTransition(exec, toState, scenario);
    if (!check.allowed) {
      setBlockMessage(check.reason ?? "This transition is not currently permitted.");
      setTimeout(() => setBlockMessage(null), 4000);
      return;
    }
    const next = transitionExecution(exec, toState, scenario, note);
    if (next) {
      setBlockMessage(null);
      setExec(next);
      if (next.state === "closed") setLearning(generateLearning(next, scenario, playbook));
    }
  };

  const handleEvidence = (id: string, captured: boolean) => {
    if (!exec) return;
    setExec(captured ? captureEvidence(exec, id, { capturedByRole: "operator" }) : uncaptureEvidence(exec, id));
  };

  const handleOutcome = (id: string, status: OutcomeStatus) => {
    if (!exec) return;
    setExec(recordOutcome(exec, id, status));
  };

  // Track which approval-required communications have been explicitly approved by
  // a human action (not auto-recorded). Key: commId, value: approving role label.
  const [approvedComms, setApprovedComms] = useState<Record<string, string>>({});

  const handleApproveComm = (id: string, role: string) => {
    setApprovedComms(prev => ({ ...prev, [id]: role }));
  };

  const handleSendComm = (id: string) => {
    if (!exec) return;
    const comm = exec.communications.find(c => c.id === id);
    if (!comm) return;
    // Approval gate: do not auto-approve. approvedBy must come from explicit human action.
    if (comm.approvalRequired && !approvedComms[id]) {
      setBlockMessage("This draft requires named human approval before it can be marked reviewed in the simulation.");
      setTimeout(() => setBlockMessage(null), 4000);
      return;
    }
    setExec(sendCommunication(exec, id, approvedComms[id]));
  };

  const handleEscalate = () => {
    if (!exec) return;
    const check = canTransition(exec, "escalated", scenario);
    if (!check.allowed) {
      setBlockMessage(check.reason ?? "Escalation is not permitted from the current state.");
      setTimeout(() => setBlockMessage(null), 4000);
      return;
    }
    const withEsc = triggerEscalation(exec, scenario.escalation[0]?.trigger ?? "Threshold exceeded", scenario.escalation[0]?.escalateToRoleId ?? "duty-manager");
    const next    = transitionExecution(withEsc, "escalated", scenario, "Escalation triggered");
    if (next) { setBlockMessage(null); setExec(next); }
  };

  if (!exec) {
    return (
      <div style={{ padding: "22px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{scenario.title}</div>
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.65, marginBottom: 16, maxWidth: 680 }}>
          {scenario.context.riskOrOpportunity}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={launch} style={{ padding: "10px 22px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: C.gold, border: "none", color: "#080c14", cursor: "pointer" }}>
            Start Local Simulation →
          </button>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>
            {scenario.evidenceRequirements.filter(e => e.required).length} required evidence items · {scenario.communicationDetails.length} communications
            {scenario.governanceConfig.humanApprovalRequired && " · Human approval required"}
          </div>
        </div>
      </div>
    );
  }

  const currentStep = STATE_TO_STEP[exec.state];
  const actions     = getAvailableActions(exec, scenario);
  const gaps        = getMandatoryEvidenceGaps(exec);
  const evidencePct = getEvidenceCompleteness(exec);
  const stateColor  = getStateColor(exec.state);
  const stateLabel  = getStateLabel(exec.state);

  const guestComms = exec.communications.filter(c => c.isGuestFacing);

  const GuestPanel = () => (
    <div style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.12)", padding: "18px 20px" }}>
      <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: C.blue, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Guest View — Unsent Draft Content Only</div>
      {guestComms.length === 0 ? (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>No guest-facing communications in this scenario.</div>
      ) : guestComms.map(c => (
        <div key={c.id} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${c.sent ? C.green : "rgba(255,255,255,0.2)"}`, marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>{c.purpose}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: c.sent ? C.green : "rgba(255,255,255,0.3)", border: `1px solid ${c.sent ? C.green : "rgba(255,255,255,0.1)"}`, padding: "2px 8px" }}>
              {c.sent ? "DRAFT REVIEWED" : "UNSENT DRAFT"}
            </div>
          </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>Proposed route: {c.channel} → {c.audience}</div>
          {c.approvalRequired && !c.sent && (
            <div style={{ fontSize: 9.5, color: "#f97316", marginTop: 4 }}>Requires named human approval before any future delivery</div>
          )}
          {c.sentAt && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Draft reviewed locally at {new Date(c.sentAt).toLocaleTimeString()}</div>}
        </div>
      ))}
    </div>
  );

  const OperatorPanel = () => (
    <div>
      {/* Step content */}
      <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
        <div style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
          {TRACE_STEPS[currentStep].label} — {TRACE_STEPS[currentStep].description}
        </div>

        {/* Step 0: Connect — signal details */}
        {currentStep === 0 && (
          <div>
            <div style={{ fontSize: 10.5, color: C.muted, marginBottom: 8 }}>{scenario.trigger.description}</div>
            {scenario.signalDetails.slice(0, 4).map(sig => (
              <div key={sig.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: sig.status === "simulated" ? C.blue : sig.status === "demonstrated" ? C.green : "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)", flex: 1 }}>{sig.name}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase" }}>{sig.status}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{sig.source}</div>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Understand — context facts */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: 10 }}>
              {scenario.context.relevantFacts.map((f, i) => (
                <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: C.gold, marginRight: 8 }}>→</span>{f}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
              Confidence: {scenario.context.confidence ?? "Not specified"}
            </div>
          </div>
        )}

        {/* Step 2: Decide — governance + decision */}
        {currentStep === 2 && (
          <div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>Illustrative recommendation: </span>{scenario.decision.recommendedDecision}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {exec.governanceRules.slice(0, 3).map(rule => (
                <div key={rule.id} style={{ padding: "3px 9px", fontSize: 9, color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>{rule.label}: {rule.value}</div>
              ))}
            </div>
            {scenario.governanceConfig.humanApprovalRequired && (
              <div style={{ padding: "8px 12px", background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", fontSize: 10, color: "#f97316" }}>
                Human approval required — {scenario.governanceConfig.approvalRole ?? "manager"} must approve before action
              </div>
            )}
          </div>
        )}

        {/* Step 3: Act — comms + escalation */}
        {currentStep === 3 && (
          <div>
          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>Configured Playbook · {exec.playbookName}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
              {exec.playbookSteps.slice(0, 4).map(step => (
                <div key={step.step} style={{ padding: "6px 9px", fontSize: 10, color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <strong style={{ color: C.gold }}>{step.step}. {step.title}</strong> — {step.ownerRoleId} · {step.timing}
                </div>
              ))}
            </div>
          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>Configured Unsent Communication Drafts</div>
            {exec.communications.map(c => {
              const isApproved = !!approvedComms[c.id];
              const needsApproval = c.approvalRequired && !isApproved;
              const approvalRole = exec.accountableRoleId;
              return (
                <div key={c.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Draft: {c.purpose}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Proposed route: {c.channel} → {c.audience}</div>
                      {c.approvalRequired && (
                        <div style={{ fontSize: 12, color: isApproved ? C.green : "#f97316", marginTop: 3 }}>
                          {isApproved ? `Simulation approval recorded for ${approvedComms[c.id]}` : `Requires named ${approvalRole} approval before any future delivery`}
                        </div>
                      )}
                    </div>
                    {!c.sent ? (
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                        {c.approvalRequired && !isApproved && (
                          <button
                            onClick={() => handleApproveComm(c.id, approvalRole)}
                            style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.35)", color: "#f97316", cursor: "pointer", minHeight: 44 }}
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleSendComm(c.id)}
                          disabled={needsApproval}
                          title={needsApproval ? `${approvalRole} approval required before sending` : undefined}
                          aria-disabled={needsApproval}
                          style={{
                            padding: "6px 14px", fontSize: 12, fontWeight: 700, minHeight: 44,
                            background: needsApproval ? "rgba(255,255,255,0.04)" : "rgba(201,168,76,0.1)",
                            border: `1px solid ${needsApproval ? "rgba(255,255,255,0.1)" : "rgba(201,168,76,0.3)"}`,
                            color: needsApproval ? "rgba(255,255,255,0.25)" : C.gold,
                            cursor: needsApproval ? "not-allowed" : "pointer",
                          }}
                        >
                          Mark draft reviewed →
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.green, flexShrink: 0 }}>Draft reviewed locally {new Date(c.sentAt!).toLocaleTimeString()}</div>
                    )}
                  </div>
                </div>
              );
            })}
            {exec.escalations.length > 0 && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div style={{ fontSize: 8.5, color: C.red, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Active Escalation</div>
                {exec.escalations.map(e => (
                  <div key={e.id} style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
                    Illustrative: {e.trigger} → {e.escalateToRoleId} {e.acknowledged ? "· acknowledgement modelled" : "· acknowledgement not modelled"}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Learn — evidence + outcomes */}
        {currentStep === 4 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                  Illustrative Evidence Selection — {evidencePct}% selected
                </div>
                {gaps.length > 0 && (
                  <div style={{ fontSize: 9, color: "#f97316" }}>{gaps.length} required item{gaps.length > 1 ? "s" : ""} outstanding</div>
                )}
              </div>
              {exec.evidence.map(ev => (
                <div key={ev.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div
                    onClick={() => handleEvidence(ev.id, !ev.captured)}
                    style={{ width: 16, height: 16, border: `1px solid ${ev.captured ? C.green : (ev.required ? "#f97316" : "rgba(255,255,255,0.25)")}`, background: ev.captured ? C.green : "transparent", cursor: "pointer", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {ev.captured && <span style={{ fontSize: 10, color: "#080c14", fontWeight: 900 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.75)" }}>
                      {ev.evidenceType}
                      {ev.required && <span style={{ fontSize: 8.5, color: "#f97316", marginLeft: 6, fontWeight: 700 }}>REQUIRED</span>}
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{ev.completionRule}</div>
                    {ev.captured && ev.capturedAt && (
                      <div style={{ fontSize: 9, color: C.green, marginTop: 2 }}>Selected locally {new Date(ev.capturedAt).toLocaleTimeString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>Illustrative Outcome Modelling — Not Measured</div>
              {exec.outcomes.map(o => (
                <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, fontSize: 10.5, color: "rgba(255,255,255,0.65)" }}>{o.metric}</div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {(["met", "partially-met", "not-met", "not-measured"] as OutcomeStatus[]).map(s => (
                      <div key={s} onClick={() => handleOutcome(o.id, s)} style={{
                        padding: "3px 9px", fontSize: 8.5, fontWeight: 700, cursor: "pointer",
                        color: o.status === s ? "#080c14" : "rgba(255,255,255,0.4)",
                        background: o.status === s ? (s === "met" ? C.green : s === "partially-met" ? C.gold : C.red) : "rgba(255,255,255,0.03)",
                        border: `1px solid ${o.status === s ? (s === "met" ? C.green : s === "partially-met" ? C.gold : C.red) : "rgba(255,255,255,0.1)"}`,
                      }}>
                        Model: {OUTCOME_STATUS_LABELS[s]}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Blocked transition feedback */}
      {blockMessage && (
        <div style={{ marginBottom: 6, padding: "8px 14px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", fontSize: 10.5, color: C.red }}>
          ⚠ {blockMessage}
        </div>
      )}

      {/* Action buttons */}
      {exec.state !== "closed" && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {actions.map(action => (
            <button
              key={action.id}
              onClick={() => {
                if (action.id === "escalate") { handleEscalate(); }
                else { handleAction(action.toState); }
              }}
              disabled={!action.toState}
              style={{
                padding: "8px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                cursor: action.toState ? "pointer" : "default",
                background: action.toState ? (action.id === "escalate" ? "rgba(239,68,68,0.1)" : "rgba(201,168,76,0.08)") : "rgba(255,255,255,0.03)",
                border: `1px solid ${action.toState ? (action.id === "escalate" ? "rgba(239,68,68,0.35)" : "rgba(201,168,76,0.3)") : "rgba(255,255,255,0.08)"}`,
                color: action.toState ? (action.id === "escalate" ? C.red : C.gold) : "rgba(255,255,255,0.25)",
              }}
            >
              Model: {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Learning output
  const LearningPanel = () => learning ? (
    <div style={{ marginTop: 12, padding: "16px 20px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.2)" }}>
      <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: C.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Modelled Learning Output — Local Sequence End</div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Patterns Detected</div>
        {learning.patterns.map((p, i) => (
          <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ color: C.gold, marginRight: 8 }}>◦</span>{p}
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Improvement Actions</div>
        {learning.improvements.map((imp, i) => (
          <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ color: "#a78bfa", marginRight: 8 }}>→</span>{imp}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>
        Evidence quality: <span style={{ fontWeight: 700, color: learning.evidenceQuality === "complete" ? C.green : learning.evidenceQuality === "partial" ? C.gold : C.red }}>
          {learning.evidenceQuality}
        </span> · Generated {new Date(learning.generatedAt).toLocaleTimeString()}
      </div>
    </div>
  ) : null;

  return (
    <div style={{ marginBottom: 4 }}>
      {/* Panel header */}
      <div style={{ padding: "14px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{scenario.title}</div>
            <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)" }}>{exec.playbookName} · {exec.accountableRoleId}</div>
          </div>
          <div style={{ padding: "4px 10px", fontSize: 9, fontWeight: 700, color: stateColor, border: `1px solid ${stateColor}40`, background: `${stateColor}0a` }}>
            Illustrative state · {stateLabel}
          </div>
          {exec.isWelfareScenario && (
            <div style={{ padding: "4px 10px", fontSize: 9, fontWeight: 700, color: C.red, border: "1px solid rgba(239,68,68,0.3)" }}>
              WELFARE · HUMAN-ONLY
            </div>
          )}
        </div>
        <div role="group" aria-label="View mode" style={{ display: "flex", gap: 4 }}>
          {(["operator", "guest", "dual"] as ExecView[]).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              style={{
                padding: "5px 12px", fontSize: 9, fontWeight: 700, cursor: "pointer", textTransform: "uppercase",
                color: view === v ? "#080c14" : "rgba(255,255,255,0.4)",
                background: view === v ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${view === v ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)"}`,
              }}
            >{v === "dual" ? "Dual" : v === "guest" ? "Guest" : "Operator"}</button>
          ))}
          <button
            type="button"
            onClick={reset}
            style={{ padding: "5px 12px", fontSize: 9, fontWeight: 700, cursor: "pointer", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)", background: "transparent" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* 5-step trace progress */}
      <div style={{ padding: "12px 20px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", borderBottom: "none", display: "flex", alignItems: "center", gap: 0 }}>
        {TRACE_STEPS.map((step, i) => {
          const isDone    = currentStep > i;
          const isCurrent = currentStep === i;
          return (
            <div key={step.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8.5, fontWeight: 800, flexShrink: 0,
                  background: isDone ? C.green : isCurrent ? C.gold : "rgba(255,255,255,0.07)",
                  color: isDone || isCurrent ? "#080c14" : "rgba(255,255,255,0.35)",
                  border: `1px solid ${isDone ? C.green : isCurrent ? C.gold : "rgba(255,255,255,0.12)"}`,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, color: isCurrent ? "#fff" : isDone ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
                  {step.label}
                </div>
              </div>
              {i < TRACE_STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: isDone ? C.green : "rgba(255,255,255,0.08)", margin: "0 8px" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Main panel */}
      <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {view === "dual" ? (
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Operator View</div>
              <OperatorPanel />
            </div>
            <div>
              <div style={{ fontSize: 8.5, letterSpacing: "0.12em", color: C.blue, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Guest View</div>
              <GuestPanel />
            </div>
          </div>
        ) : view === "guest" ? (
          <GuestPanel />
        ) : (
          <OperatorPanel />
        )}

        <LearningPanel />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PartnerOperationsCentre() {
  const [location, navigate] = useLocation();
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [location]);

  const { activeDeployment } = useDeployment();
  const [launchedScenarioId, setLaunchedScenarioId] = useState<string | null>(null);
  const requestedScenarioId = getScenarioIdFromQuery(
    location,
    typeof window === "undefined" ? "" : window.location.search,
  );
  const requestedScenario = requestedScenarioId
    ? TRAVEL_SCENARIOS.find(item => item.id === requestedScenarioId)
    : undefined;
  const requestedReadiness = requestedScenarioId
    ? getScenarioRuntimeReadiness(activeDeployment, requestedScenarioId)
    : null;

  // Action Centre filters
  const [propertyFilter, setPropertyFilter] = useState<string | null>(null);
  const [osFilter, setOsFilter]             = useState<string | null>(null);
  const [roleFilter, setRoleFilter]         = useState<TravelRole | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId]         = useState<string | null>(TRAVEL_ACTION_CARDS[0].id);

  const [statuses, setStatuses] = useState<Record<string, ActionStatus>>(
    () => Object.fromEntries(TRAVEL_ACTION_CARDS.map(a => [a.id, a.status]))
  );

  const filteredActions = useMemo(() => TRAVEL_ACTION_CARDS.filter(a =>
    (!propertyFilter || a.property === propertyFilter) &&
    (!osFilter || a.operatingSystem === osFilter) &&
    (!roleFilter || a.supportingRoles.includes(roleFilter)) &&
    (!priorityFilter || a.priority === priorityFilter)
  ), [propertyFilter, osFilter, roleFilter, priorityFilter]);

  const advanceStatus = (id: string) => {
    setStatuses(prev => {
      const current = prev[id];
      const idx  = ACTION_STATUS_SEQUENCE.indexOf(current);
      const next = idx >= 0 && idx < ACTION_STATUS_SEQUENCE.length - 1 ? ACTION_STATUS_SEQUENCE[idx + 1] : current;
      return { ...prev, [id]: next };
    });
  };

  // Active deployment scenarios available for execution
  const activeDeploymentScenarios = useMemo(() => {
    if (!activeDeployment) return [];
    return activeDeployment.scenarios
      .filter(ds => getScenarioRuntimeReadiness(activeDeployment, ds.scenarioId).ready)
      .map(ds => {
        const scenario = TRAVEL_SCENARIOS.find(s => s.id === ds.scenarioId);
        const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === ds.playbookId);
        return scenario && playbook ? { ds, scenario, playbook } : null;
      })
      .filter(Boolean) as Array<{ ds: (typeof activeDeployment.scenarios)[0]; scenario: (typeof TRAVEL_SCENARIOS)[0]; playbook: (typeof TRAVEL_PLAYBOOKS)[0] }>;
  }, [activeDeployment]);

  const launchedEntry = activeDeploymentScenarios.find(e => e.scenario.id === launchedScenarioId);

  useEffect(() => {
    if (!requestedScenarioId) return;
    setLaunchedScenarioId(requestedReadiness?.ready ? requestedScenarioId : null);
  }, [requestedScenarioId, requestedReadiness?.ready]);

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionLabel>RTBX Travel · Operations</SectionLabel>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 12, maxWidth: 760 }}>
            RTBX Operations Centre — Working Proof
          </h1>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 16, letterSpacing: "-0.01em" }}>
            Travel Operations Centre — Operator Interface
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700 }}>
            This Working Proof provides local scenario traces. Synthetic inputs pass through deterministic rules; actions, evidence and outcomes are illustrative and value indicators are modelled.
          </p>
        </div>

        <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #c9a84c", marginBottom: 36 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: C.gold }}>Working Proof · Simulation boundary:</strong> all operational inputs and states below are synthetic and local. Current classification is deterministic and rules-based. Communications remain drafts and are never sent or delivered; actions, evidence and outcomes are illustrative, and value is modelled rather than measured. No task, partner activation or external-system update occurs. Named humans retain approval and real-world accountability.
          </p>
        </div>

        {/* ── DEPLOYMENT CONTEXT BANNER ── */}
        <div id="deployment-status" style={{ marginBottom: 40, scrollMarginTop: 90 }}>
          <SectionLabel>00 · Local Configuration</SectionLabel>
          <DeploymentBanner deployment={activeDeployment} />
        </div>

        {/* ── RUNTIME EXECUTION PANEL ── */}
        {activeDeployment && (
          <div id="runtime-execution" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
            <SectionLabel>00B · Execution Trace</SectionLabel>
            <H2>Interactive Local Scenario Simulation</H2>
            <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 6, maxWidth: 760 }}>
              Select a configured scenario and step through a local Connect → Understand → Decide → Act → Learn trace. Model evidence, outcomes and learning without executing operational work.
            </p>
            <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", marginBottom: 20, fontStyle: "italic" }}>
              Deterministic rules and synthetic inputs only. No communication, task or external update is dispatched.
            </div>

            {requestedReadiness && (
              <div role={requestedReadiness.ready ? "status" : "alert"} style={{ padding: "14px 18px", marginBottom: 16, background: requestedReadiness.ready ? "rgba(16,185,129,0.05)" : "rgba(249,115,22,0.05)", border: `1px solid ${requestedReadiness.ready ? "rgba(16,185,129,0.25)" : "rgba(249,115,22,0.3)"}`, borderLeft: `3px solid ${requestedReadiness.ready ? C.green : "#f97316"}` }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: requestedReadiness.ready ? C.green : "#f97316", marginBottom: 5 }}>
                  {requestedReadiness.ready ? "Scenario ready for local simulation" : "Scenario not ready for runtime"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  {requestedScenario?.title ?? requestedScenarioId}: {requestedReadiness.reason}
                </div>
                {!requestedReadiness.ready && requestedScenario && (
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
                    <Link href={travelScenarioConfigurePath(requestedScenario.id)}>
                      <span style={{ fontSize: 10, color: C.gold, fontWeight: 700 }}>Review in Build &amp; Configure →</span>
                    </Link>
                    <Link href={travelScenarioPath(requestedScenario.id)}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>View library entry →</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeDeploymentScenarios.length === 0 ? (
              <div style={{ padding: "20px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>No runtime-ready scenarios are enabled in the selected local simulation configuration.</div>
                <Link href="/partner-room/build-configure">
                  <span style={{ fontSize: 10, color: C.gold, fontWeight: 700 }}>Review configuration →</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Scenario selector */}
                {!launchedScenarioId && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                    {activeDeploymentScenarios.map(({ scenario }) => (
                      <button
                        type="button"
                        key={scenario.id}
                        onClick={() => {
                          setLaunchedScenarioId(scenario.id);
                          navigate(travelScenarioExecutionPath(scenario.id));
                        }}
                        style={{ padding: "8px 16px", fontSize: 10, fontWeight: 700, cursor: "pointer", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.02)" }}
                      >
                        {scenario.title}
                      </button>
                    ))}
                  </div>
                )}

                {/* Active execution trace */}
                {launchedEntry ? (
                  <ExecTracePanel
                    key={launchedEntry.scenario.id}
                    deployment={activeDeployment}
                    scenario={launchedEntry.scenario}
                    playbook={launchedEntry.playbook}
                    onReset={() => setLaunchedScenarioId(null)}
                  />
                ) : launchedScenarioId ? (
                  // Scenario selected but not yet in launchedEntry (shouldn't happen)
                  <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 11, color: C.muted }}>Preparing execution environment…</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {activeDeploymentScenarios.map(({ scenario, playbook }) => (
                      <ExecTracePanel
                        key={scenario.id}
                        deployment={activeDeployment}
                        scenario={scenario}
                        playbook={playbook}
                        onReset={() => {}}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <Link href="/partner-room/travel-ai-comms">
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", marginBottom: 40,
            background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", cursor: "pointer",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", letterSpacing: "0.04em" }}>
              Explore the planned Central Comms model — Travel AI & Central Comms →
            </span>
          </div>
        </Link>

        {/* ── EXECUTION CENTRE (existing action cards) ── */}
        <div id="action-centre" style={{ marginBottom: 64, scrollMarginTop: 90 }}>
          <SectionLabel>01 · Execution</SectionLabel>
          <H2>RTBX Action Centre — Synthetic Simulation</H2>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", marginBottom: 12, marginTop: -6 }}>Travel Operations Centre</div>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 760 }}>
            Review synthetic moments, accountable role owners and illustrative deadlines. Filters and controls change local demonstration state only.
          </p>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
              {["Synthetic Signals", "Modelled Moments", "Recommendations", "Illustrative Actions", "Draft Comms", "Modelled Escalations", "Illustrative Evidence", "Modelled Outcomes & Learning"].map((d, i) => (
                <div key={d} style={{
                  padding: "5px 12px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: i === 0 ? "#c9a84c" : "rgba(255,255,255,0.4)",
                  border: `1px solid ${i === 0 ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.1)"}`,
                  background: i === 0 ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)",
                }}>{d}</div>
              ))}
            </div>
            <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "2px solid rgba(201,168,76,0.4)" }}>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>
                This local Travel simulation shows how governed information could flow through an operator interface. It does not prove execution, delivery, evidence capture or outcomes.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Property</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <FilterPill label="All" active={!propertyFilter} color={C.gold} onClick={() => setPropertyFilter(null)} />
                {TRAVEL_PROPERTIES.map(p => <FilterPill key={p} label={p} active={propertyFilter === p} color={C.gold} onClick={() => setPropertyFilter(p)} />)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Operating System</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <FilterPill label="All" active={!osFilter} color="#3b82f6" onClick={() => setOsFilter(null)} />
                {OPERATING_SYSTEMS.map(os => <FilterPill key={os} label={os} active={osFilter === os} color="#3b82f6" onClick={() => setOsFilter(os)} />)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Role</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <FilterPill label="All" active={!roleFilter} color={C.green} onClick={() => setRoleFilter(null)} />
                {ROLES.map(r => <FilterPill key={r} label={r} active={roleFilter === r} color={C.green} onClick={() => setRoleFilter(r)} />)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Priority</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <FilterPill label="All" active={!priorityFilter} color={C.red} onClick={() => setPriorityFilter(null)} />
                {TRAVEL_PRIORITIES.map(p => <FilterPill key={p} label={p} active={priorityFilter === p} color={PRIORITY_COLORS[p]} onClick={() => setPriorityFilter(p)} />)}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>{filteredActions.length} of {TRAVEL_ACTION_CARDS.length} illustrative actions shown</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredActions.map(a => {
              const status   = statuses[a.id];
              const isOpen   = expandedId === a.id;
              const outcome  = TRAVEL_OUTCOME_LEDGER.find(o => o.id === a.linkedOutcomeId);
              const evidences = TRAVEL_EVIDENCE_LEDGER.filter(e => a.linkedEvidenceIds.includes(e.id));
              const canAdvance = ACTION_STATUS_SEQUENCE.indexOf(status) < ACTION_STATUS_SEQUENCE.length - 1;
              return (
                <div key={a.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${STATUS_COLORS[status]}` }}>
                  <div onClick={() => setExpandedId(isOpen ? null : a.id)} style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, cursor: "pointer", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff" }}>{a.moment}</div>
                        <div style={{ fontSize: 8.5, fontWeight: 700, color: PRIORITY_COLORS[a.priority], border: `1px solid ${PRIORITY_COLORS[a.priority]}50`, padding: "2px 7px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{a.priority}</div>
                      </div>
                      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)" }}>{a.property} · {a.owner} · Due {a.dueTime}</div>
                    </div>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: STATUS_COLORS[status], border: `1px solid ${STATUS_COLORS[status]}50`, padding: "5px 11px", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Illustrative · {status}</div>
                  </div>

                  {isOpen && (
                    <div style={{ padding: "0 20px 22px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", marginBottom: 16 }}>
                        {[
                          ["Action ID", a.id], ["Linked signal", a.linkedSignal], ["Linked playbook", a.linkedPlaybook],
                          ["Supporting roles", a.supportingRoles.join(", ")], ["Communication status", a.communicationStatus],
                          ["Escalation status", a.escalationStatus], ["Evidence required", a.evidenceRequired], ["Outcome required", a.outcomeRequired],
                        ].map(([label, val]) => (
                          <div key={label} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                            <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>{label}: </span>Illustrative — {val}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); advanceStatus(a.id); }}
                          disabled={!canAdvance}
                          style={{
                            padding: "8px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                            color: canAdvance ? "#080c14" : "rgba(255,255,255,0.25)", background: canAdvance ? C.gold : "rgba(255,255,255,0.04)",
                            border: "none", cursor: canAdvance ? "pointer" : "default",
                          }}
                        >
                          {canAdvance ? "Advance local illustration →" : "End of local sequence"}
                        </button>
                        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", alignSelf: "center" }}>Demo control — advances this card's status locally</div>
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Linked Unsent Drafts</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {a.linkedCommunicationIds.map(id => (
                            <Link key={id} href={`/partner-room/travel-ai-comms#${id}`}>
                              <div style={{ padding: "6px 12px", fontSize: 10, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>{id.replace("comm-", "").replace(/-/g, " ")}</div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Illustrative Evidence</div>
                        {evidences.length === 0 ? (
                          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>No evidence recorded yet</div>
                        ) : evidences.map(ev => (
                          <div key={ev.id} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>
                            <span style={{ color: C.gold }}>●</span> Illustrative: {ev.label} — modelled time {ev.timestamp}
                          </div>
                        ))}
                      </div>

                      {outcome && (
                        <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Modelled Outcome — Not Measured</div>
                          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                            <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>Guest confirmation: </span>{outcome.guestConfirmation}<br />
                            <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>Operator outcome: </span>{outcome.operatorOutcome}<br />
                            <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>Commercial outcome: </span>{outcome.commercialOutcome}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link href="/partner-room/product-proof/signal-capture"><div style={{ display: "inline-block", fontSize: 10, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>See also: Signal-to-Action Pipeline (product proof) →</div></Link>
          </div>
        </div>

        {/* ── OUTCOME LEDGER ── */}
        <div id="outcome-ledger" style={{ marginBottom: 64, scrollMarginTop: 90 }}>
          <SectionLabel>02 · Record</SectionLabel>
          <H2>Illustrative Travel Outcome Ledger</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 760 }}>
            Modelled records only — these do not represent completed actions, delivered communications or measured outcomes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TRAVEL_OUTCOME_LEDGER.map(o => (
              <details key={o.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <summary style={{ padding: "14px 20px", cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: "#fff", listStyle: "none", display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>{o.moment}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{o.owner}</span>
                </summary>
                <div style={{ padding: "0 20px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                  {[
                    ["Signal", o.signal], ["Governance rule", o.governanceRule], ["Playbook", o.playbook],
                    ["Illustrative actions", o.actionsTaken], ["Unsent communication drafts", o.communicationsSent], ["Approval requirement", o.approval],
                    ["Modelled response time", o.timeToResponse], ["Modelled sequence time", o.timeToCompletion],
                    ["Illustrative guest response", o.guestConfirmation], ["Modelled operator outcome", o.operatorOutcome],
                    ["Modelled commercial outcome", o.commercialOutcome], ["Illustrative follow-up", o.followUp],
                  ].map(([label, val]) => (
                    <div key={label} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>{label}: </span>Illustrative — {val}
                    </div>
                  ))}
                  <div style={{ gridColumn: "1 / -1", marginTop: 4, padding: "10px 14px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", fontSize: 10.5, color: "rgba(255,255,255,0.55)" }}>
                    <span style={{ color: C.gold, fontWeight: 700 }}>Learning note: </span>{o.learningNote}
                  </div>
                </div>
              </details>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link href="/partner-room/validation-replay"><div style={{ display: "inline-block", fontSize: 10, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>See also: Scenario Replay Lab →</div></Link>
          </div>
        </div>

        {/* ── EVIDENCE LEDGER ── */}
        <div id="evidence-ledger" style={{ marginBottom: 64, scrollMarginTop: 90 }}>
          <SectionLabel>03 · Trace</SectionLabel>
          <H2>Illustrative Travel Evidence Ledger</H2>
          <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 20, maxWidth: 760 }}>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{EVIDENCE_WORDING_NOTE}</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {["Illustrative Record", "Modelled Time", "Accountable Owner", "Action Requirement", "Draft State", "Approval Requirement", "Escalation Model", "Guest Acknowledgement Model", "Closure Requirement"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", fontSize: 8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRAVEL_EVIDENCE_LEDGER.map(e => (
                  <tr key={e.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "9px 10px", fontWeight: 700, color: "#fff" }}>Illustrative: {e.label}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>Modelled: {e.timestamp}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>Accountable role: {e.owner}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>Illustrative only — {e.actionConfirmation}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>Illustrative only — {e.messageDelivery}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>Illustrative only — {e.approvalRecord}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>Illustrative only — {e.escalationRecord}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>Illustrative only — {e.guestAcknowledgement}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>Illustrative only — {e.closureReview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 14 }}>
            <Link href="/partner-room/validation"><div style={{ display: "inline-block", fontSize: 10, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>See also: Validation & Operator Stories →</div></Link>
          </div>
        </div>

        {/* ── VALUE DASHBOARD ── */}
        <div id="value-dashboard" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>04 · Value</SectionLabel>
          <H2>Modelled Travel Value Dashboard</H2>
          <div style={{ padding: "12px 16px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 24, maxWidth: 760 }}>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0, fontWeight: 600 }}>{VALUE_DEMO_LABEL_NOTE}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, marginBottom: 32 }}>
            {TRAVEL_VALUE_CATEGORIES.map(cat => (
              <div key={cat.id} style={{ padding: "20px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${cat.color}` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: cat.color, marginBottom: 14, letterSpacing: "0.02em" }}>{cat.label}</div>
                {cat.measures.map(m => (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{m.label}</div>
                      {m.note && <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{m.note}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{m.value} modelled</span>
                      {m.demo && <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.15)", padding: "1px 5px", textTransform: "uppercase" }}>Demo</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Feedback Loop</div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 16 }}>
              {TRAVEL_FEEDBACK_LOOP.map((step, i, arr) => (
                <div key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    padding: "9px 14px", fontSize: 10, fontWeight: 700,
                    color: i === arr.length - 1 ? "#080c14" : "rgba(255,255,255,0.65)",
                    background: i === arr.length - 1 ? "#c9a84c" : "rgba(255,255,255,0.03)",
                    border: i === arr.length - 1 ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                    {step}
                  </div>
                  {i < arr.length - 1 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>→</span>}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 700, fontWeight: 600 }}>Illustrative model only — {TRAVEL_FEEDBACK_LOOP_STATEMENT}</p>
          </div>
          <Link href="/partner-room/proof-calculator"><div style={{ display: "inline-block", fontSize: 10, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>See also: Proof Calculator (model your own property) →</div></Link>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Travel AI & Central Comms", href: "/partner-room/travel-ai-comms" },
            { label: "Travel Operating Systems",  href: "/partner-room/travel-operating-systems" },
            { label: "Travel Intelligence",       href: "/partner-room/travel-intelligence" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
