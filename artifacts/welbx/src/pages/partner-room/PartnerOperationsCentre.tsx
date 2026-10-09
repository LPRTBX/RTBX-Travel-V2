import { useSearch } from "wouter";
import { TravelSimulationPanel } from "@/components/simulation/TravelSimulationPanel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { summariseDeployment, summariseScenarioExecution, type ScenarioConfigurationSummary } from "@/lib/deploymentOperation";
import { stateLabel as plainStateLabel } from "@/lib/plainLanguage";
import "./operations-centre.css";
import { Link, useLocation } from "wouter";
import { PartnerRoomLayout, schedulePartnerRoomHashScroll } from "@/components/PartnerRoomLayout";
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
  acknowledgeEscalation,
  approveDecision,
  returnDecision,
  getScenarioRuntimeRequirements,
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
import { TRAVEL_ROLES } from "@/data/travelRoles";
import { getTravelEvidenceSnapshot } from "@/simulation/evidenceSnapshot";
import type { TravelDeploymentConfig } from "@/data/travelDeploymentConfig";
import {
  getScenarioIdFromQuery,
  getScenarioRuntimeReadiness,
  travelScenarioConfigurePath,
  travelScenarioExecutionPath,
  travelScenarioPath,
} from "@/lib/travelScenarioRouting";

// ── Style constants ───────────────────────────────────────────────────────────

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", gold: "#a8dedb", green: "#10b981", red: "#ef4444", blue: "#3b82f6" };

const OPERATING_SYSTEMS: TravelOperatingSystemName[] = [
  "Guest Experience OS", "Service Recovery & Staff Response OS", "Marketplace & Loyalty Activation OS",
  "Operator Intelligence OS", "Safety & Guest Welfare OS",
];
const ROLES: TravelRole[] = ["Guest", "Frontline", "Manager", "Operator", "Partner", "Executive"];

const STATUS_COLORS: Record<ActionStatus, string> = {
  "New": "#3b82f6", "Acknowledged": "#a78bfa", "In progress": "#a8dedb",
  "Approval Required": "#f97316", "Escalated": "#ef4444", "Completed": "#10b981",
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
      color: active ? "#102d39" : "rgba(255,255,255,0.5)",
      background: active ? color : "rgba(255,255,255,0.03)",
      border: `1px solid ${active ? color : "rgba(255,255,255,0.12)"}`,
    }}>
      {label}
    </div>
  );
}

// ── Deployment Banner ─────────────────────────────────────────────────────────

function ScenarioSettingsCard({ summary }: { summary: ScenarioConfigurationSummary }) {
  return (
    <li className="ops-config-scenario" data-scenario-id={summary.scenarioId}>
      <div className="ops-config-scenario-title">{summary.title}{summary.welfare && <span className="ops-config-tag ops-config-tag-welfare">Welfare · human-only</span>}</div>
      <dl>
        <div><dt>Accountable owner</dt><dd>{summary.owner}</dd></div>
        <div><dt>Who decides</dt><dd>{summary.approvalGate ? `${summary.decider} — approval gate` : `${summary.decider} — delegated authority`}</dd></div>
        <div><dt>Closure requires</dt><dd data-testid="closure-requires">{summary.requiredEvidence.length} evidence item{summary.requiredEvidence.length === 1 ? "" : "s"}</dd></div>
        <div><dt>Drafts needing approval</dt><dd>{summary.draftsNeedingApproval.length ? `${summary.draftsNeedingApproval.length} of ${summary.draftCount}` : `None of ${summary.draftCount}`}</dd></div>
      </dl>
      <details>
        <summary>Evidence and drafts this scenario uses</summary>
        <div className="ops-config-detail-label">Required before closure</div>
        <ul>{summary.requiredEvidence.map(item => <li key={item}>{item}</li>)}</ul>
        {summary.optionalEvidence.length > 0 && <>
          <div className="ops-config-detail-label">Optional</div>
          <ul>{summary.optionalEvidence.map(item => <li key={item}>{item}</li>)}</ul>
        </>}
        {summary.draftsNeedingApproval.length > 0 && <>
          <div className="ops-config-detail-label">Drafts needing {summary.decider} approval</div>
          <ul>{summary.draftsNeedingApproval.map(item => <li key={item}>{item}</li>)}</ul>
        </>}
      </details>
    </li>
  );
}

function DeploymentBanner({ deployment }: { deployment: TravelDeploymentConfig | null }) {
  const summary = useMemo(() => deployment ? summariseDeployment(deployment) : null, [deployment]);
  if (!deployment || !summary) {
    return (
      <div className="ops-config ops-config-empty" data-testid="no-deployment">
        <div className="ops-config-eyebrow">No deployment active</div>
        <div className="ops-config-name">Nothing on this page comes from your configuration yet.</div>
        <p>
          Start the Working Proof three-scenario setup: in Build &amp; Configure, configure three initial scenarios for one initial hotel property / 1–5-property cohort and activate them. They then run here with your roles, approvals and evidence rules. Until then, the only content below is the static examples in Part 2, which are not results.
        </p>
        <Link href="/partner-room/build-configure" className="ops-config-cta">Go to Build &amp; Configure →</Link>
      </div>
    );
  }

  const activeOS = deployment.operatingSystems.filter(o => o.active).map(o => {
    const os = TRAVEL_OPERATING_SYSTEMS.find(item => item.id === o.osId);
    return { id: o.osId, name: os?.name ?? o.osId, color: os?.color ?? C.gold };
  });
  const maturityCounts = deployment.systems.reduce<Record<string, number>>((acc, system) => {
    acc[system.maturity] = (acc[system.maturity] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="ops-config" data-testid="deployment-summary">
      <div className="ops-config-head">
        <div>
          <div className="ops-config-eyebrow">Active deployment · local simulation</div>
          <div className="ops-config-name">{summary.name}</div>
          <div className="ops-config-meta">{summary.organisation} · <span data-testid="deployment-category">{summary.category}</span> · {summary.detail}</div>
          <div className="ops-config-meta">Mode: {summary.mode} · Activated {deployment.activatedAt ? new Date(deployment.activatedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "—"}</div>
        </div>
        <Link href="/partner-room/build-configure" className="ops-config-cta">Change configuration →</Link>
      </div>

      <div className="ops-config-columns">
        <div className="ops-config-block">
          <div className="ops-config-label">Operating systems ({activeOS.length})</div>
          <ul className="ops-config-chips">{activeOS.map(os => <li key={os.id} style={{ color: os.color, borderColor: `${os.color}66` }}>{os.name}</li>)}</ul>
        </div>
        <div className="ops-config-block">
          <div className="ops-config-label">Connection maturity</div>
          <ul className="ops-config-chips">{Object.entries(maturityCounts).map(([maturity, count]) => <li key={maturity}>{count}× {maturity}</li>)}</ul>
        </div>
      </div>

      <div className="ops-config-block">
        <div className="ops-config-label">Active roles ({summary.roles.length})</div>
        <ul className="ops-config-chips" data-testid="deployment-roles">{summary.roles.map(role => <li key={role}>{role}</li>)}</ul>
      </div>

      <div className="ops-config-block">
        <div className="ops-config-label">Enabled scenarios ({summary.scenarios.length}) · the settings each run will use</div>
        <ul className="ops-config-scenarios" data-testid="deployment-scenarios">
          {summary.scenarios.map(item => <ScenarioSettingsCard key={item.scenarioId} summary={item} />)}
        </ul>
        {summary.notRunning.length > 0 && (
          <div className="ops-config-note">Not running: {summary.notRunning.map(item => `${item.title} (${item.reason.replace(/\.$/, "").toLowerCase()})`).join("; ")}.</div>
        )}
      </div>

      <details className="ops-config-block">
        <summary>Governance settings ({summary.governance.length})</summary>
        <dl className="ops-config-governance">
          {summary.governance.map(rule => <div key={rule.label}><dt>{rule.label}</dt><dd>{rule.value}</dd></div>)}
        </dl>
      </details>

      <div className="ops-config-note">
        Changes made in Build &amp; Configure apply to the next run after you activate them. Each scenario's approval gate comes from its governance and cannot be switched off here, closure always waits for the required evidence, welfare cases stay human-only, and communications remain unsent drafts.
      </div>
    </div>
  );
}

const roleName = (id: string) => TRAVEL_ROLES.find(r => r.id === id)?.name ?? id;

// ── Records generated by the configured operation ─────────────────────────────

interface RunRecord { exec: ScenarioExecution; cycle: number }

function decisionText(exec: ScenarioExecution): string {
  if (!exec.approvalRequired) return `Delegated authority · ${roleName(exec.accountableRoleId)}`;
  const last = exec.decisions.at(-1);
  if (!last) return `Awaiting ${roleName(exec.approvalRoleId)}`;
  return last.decision === "approved" ? `Approved by ${roleName(last.roleId)} (simulated)` : `Returned by ${roleName(last.roleId)}`;
}

function RunRecords({ deploymentName, records }: { deploymentName: string | null; records: RunRecord[] }) {
  if (!deploymentName) {
    return (
      <section id="generated-evidence" className="ops-records ops-records-none" data-testid="run-records" aria-labelledby="run-records-title">
        <h3 id="run-records-title">Generated evidence</h3>
        <p className="ops-records-empty">
          No evidence has been generated. Evidence here comes only from scenarios you run with an activated deployment, so there is nothing to show until you configure one and run a scenario.
        </p>
        <Link href="/partner-room/build-configure" className="ops-config-cta">Go to Build &amp; Configure →</Link>
      </section>
    );
  }
  return (
    <section id="generated-evidence" className="ops-records" data-testid="run-records" aria-labelledby="run-records-title">
      <h3 id="run-records-title">Generated evidence · {deploymentName}</h3>
      <p>
        Decisions and synthetic evidence from runs started on this page during this visit, produced with {deploymentName}'s settings. They are not saved, and nothing was sent or updated outside this browser.
      </p>
      {records.length === 0 ? (
        <p className="ops-records-empty">No runs yet, so no evidence has been generated. Start a scenario above and its decisions and recorded evidence appear here.</p>
      ) : (
        <div className="ops-records-wrap">
          <table>
            <caption className="sr-only">Synthetic run records for {deploymentName}</caption>
            <thead><tr><th scope="col">Scenario</th><th scope="col">Status</th><th scope="col">Decision</th><th scope="col">Required evidence</th><th scope="col">Drafts reviewed</th></tr></thead>
            <tbody>
              {records.map(({ exec, cycle }) => {
                const required = exec.evidence.filter(ev => ev.required);
                const reviewed = exec.communications.filter(c => c.sent).length;
                return (
                  <tr key={exec.scenarioId}>
                    <th scope="row">{exec.scenarioTitle}<span>Run {cycle} · synthetic</span>
                      {exec.evidence.some(ev => ev.captured) && (
                        <details className="ops-records-evidence">
                          <summary>Evidence recorded ({exec.evidence.filter(ev => ev.captured).length})</summary>
                          <ul>{exec.evidence.filter(ev => ev.captured).map(ev => (
                            <li key={ev.id}>{ev.evidenceType}{ev.required ? "" : " (optional)"} · synthetic{ev.capturedAt ? `, ${new Date(ev.capturedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}</li>
                          ))}</ul>
                        </details>
                      )}
                    </th>
                    <td data-label="Status">{plainStateLabel(exec.state)}{exec.closedAt ? ` · ${new Date(exec.closedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}</td>
                    <td data-label="Decision">{decisionText(exec)}</td>
                    <td data-label="Required evidence">{required.filter(ev => ev.captured).length} of {required.length} recorded (synthetic)</td>
                    <td data-label="Drafts reviewed">{reviewed} of {exec.communications.length} · none sent</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ── Proof summary: implemented · simulated · required ──────────────────────────

function ProofSummary() {
  const snap = useMemo(() => getTravelEvidenceSnapshot(), []);
  const columns: Array<{ label: string; color: string; note: string; items: string[] }> = [
    {
      label: "Implemented in this build", color: C.green,
      note: "Working software. Runs in your browser now.",
      items: [
        "One Travel engine drives the Operations Centre trace, the Simulation Lab and the 100-signal mock hotel.",
        "Authority is enforced: only the scenario's approval role can approve; disagreement returns the case with a reason; a missed deadline escalates and work waits for acknowledgement.",
        "Closure is blocked until the scenario's own required evidence exists. Welfare cases receive internal, human-authored drafts only.",
        "Learning is proposed, reviewed by a named role and only then carried into the next cycle.",
      ],
    },
    {
      label: "Simulated results", color: C.gold,
      note: "Synthetic hotel, scripted actors, computed live from the engine.",
      items: [
        `${snap.signals} signals from ${snap.paths} input paths: ${snap.closed} closed, ${snap.approvalHeld} held at the approval gate, ${snap.evidenceHeld} held for missing evidence, ${snap.gateFailures} gate bypasses.`,
        `Against a 20-minute restoration target: ${snap.cycle1.met} met in cycle 1 → ${snap.cycle2.met} in cycle 2 after ${snap.approvedChanges} reviewed changes; ${snap.cycle2.pending} stay pending because nobody measured them.`,
        "These show the mechanism works. They are not a forecast for any hotel.",
      ],
    },
    {
      label: "Required to prove it in a hotel", color: "#f97316",
      note: "Integration and operating inputs from the partner.",
      items: [
        "Reservation and housekeeping events from the PMS (Oracle OHIP field mapping drafted; sandbox credentials not yet configured).",
        "Server-side sign-in and role permissions, so an approval is a named person's decision.",
        "Task and guest-messaging adapters with delivery receipts, durable storage and duplicate handling.",
        "One hotel-agreed outcome metric, its target and the person who measures it.",
      ],
    },
  ];
  return (
    <div id="proof-summary" style={{ marginBottom: 36, scrollMarginTop: 90 }}>
      <SectionLabel>What this Working Proof demonstrates</SectionLabel>
      <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 2 }}>
        {columns.map(col => (
          <div key={col.label} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderTop: `2px solid ${col.color}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: col.color, marginBottom: 4 }}>{col.label}</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>{col.note}</div>
            {col.items.map(item => (
              <div key={item} style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Execution Trace Panel ─────────────────────────────────────────────────────

type ExecView = "operator" | "guest" | "dual";

function ExecTracePanel({
  deployment, scenario, playbook, onReset, onExecutionChange,
}: {
  deployment: TravelDeploymentConfig;
  scenario: (typeof TRAVEL_SCENARIOS)[0];
  playbook: (typeof TRAVEL_PLAYBOOKS)[0];
  onReset: () => void;
  /** Reports each change to this scenario's run so the page can list what the configured operation generated. */
  onExecutionChange?: (scenarioId: string, exec: ScenarioExecution | null, cycle: number) => void;
}) {
  const [exec, setExec] = useState<ScenarioExecution | null>(null);
  const [view, setView]     = useState<ExecView>("operator");
  const [learning, setLearning] = useState<RuntimeLearning | null>(null);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [cycle, setCycle] = useState(1);
  const [priorLearning, setPriorLearning] = useState<RuntimeLearning | null>(null);
  const requirements = getScenarioRuntimeRequirements(deployment, scenario);
  // The settings the next run will use, read from the execution the engine creates.
  const configured = useMemo(
    () => summariseScenarioExecution(deployment, createExecution({ deployment, scenario, playbook })),
    [deployment, scenario, playbook],
  );
  useEffect(() => { onExecutionChange?.(scenario.id, exec, cycle); }, [exec, cycle, scenario.id, onExecutionChange]);

  const launch = () => setExec(createExecution({ deployment, scenario, playbook }));
  const reset  = () => { setExec(null); setLearning(null); setPriorLearning(null); setCycle(1); onReset(); };
  // Next cycle: a fresh execution of the same scenario, carrying the reviewed learning forward as context only.
  const runNextCycle = () => {
    setPriorLearning(learning);
    setLearning(null);
    setReturnReason("");
    setCycle(c => c + 1);
    setExec(createExecution({ deployment, scenario, playbook }));
  };
  const flash = (message: string) => {
    setBlockMessage(message);
    setTimeout(() => setBlockMessage(null), 4000);
  };

  const handleApprove = () => {
    if (!exec) return;
    try { setExec(approveDecision(exec, exec.approvalRoleId, scenario, `Approved in local simulation by visitor acting as ${roleName(exec.approvalRoleId)}`)); setBlockMessage(null); }
    catch (e) { flash(e instanceof Error ? e.message : String(e)); }
  };
  const handleReturn = () => {
    if (!exec) return;
    try { setExec(returnDecision(exec, exec.approvalRoleId, returnReason, scenario)); setReturnReason(""); setBlockMessage(null); }
    catch (e) { flash(e instanceof Error ? e.message : String(e)); }
  };
  const handleAcknowledge = () => {
    if (!exec) return;
    setExec(exec.escalations.reduce((current, item) => item.acknowledged ? current : acknowledgeEscalation(current, item.id), exec));
  };

  const handleAction = (toState: Parameters<typeof transitionExecution>[1] | undefined, note?: string) => {
    if (!exec || !toState) return;
    const check = canTransition(exec, toState, scenario);
    if (!check.allowed) {
      flash(check.reason ?? "This transition is not currently permitted.");
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
      flash(`This draft requires ${roleName(exec.approvalRoleId)} approval before it can be marked reviewed in the simulation.`);
      return;
    }
    try { setExec(sendCommunication(exec, id, approvedComms[id])); }
    catch (e) { flash(e instanceof Error ? e.message : String(e)); }
  };

  const handleEscalate = () => {
    if (!exec) return;
    const check = canTransition(exec, "escalated", scenario);
    if (!check.allowed) {
      flash(check.reason ?? "Escalation is not permitted from the current state.");
      return;
    }
    const target = escalationTarget(exec);
    const withEsc = triggerEscalation(exec, target.trigger, target.roleId);
    const next    = transitionExecution(withEsc, "escalated", scenario, "Escalation triggered");
    if (next) { setBlockMessage(null); setExec(next); }
  };

  // Delay at the approval gate goes one level up (gov-06); delay during action follows the scenario's first escalation rule.
  function escalationTarget(current: ScenarioExecution) {
    if (current.state === "approval-required") {
      // Welfare follows the scenario's own welfare escalation; other cases go one level up (gov-06).
      const up = current.isWelfareScenario && scenario.escalation[0]
        ? scenario.escalation[0].escalateToRoleId
        : current.approvalRoleId === "general-manager" ? "regional-operations" : "general-manager";
      return { roleId: up, trigger: `No decision from ${roleName(current.approvalRoleId)} by the deadline (${scenario.decision.decisionDeadline ?? "not configured"})` };
    }
    return { roleId: scenario.escalation[0]?.escalateToRoleId ?? "duty-manager", trigger: scenario.escalation[0]?.trigger ?? "Threshold exceeded" };
  }

  if (!exec) {
    return (
      <div style={{ padding: "22px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{scenario.title}</div>
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.65, marginBottom: 16, maxWidth: 680 }}>
          {scenario.context.riskOrOpportunity}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={launch} style={{ padding: "10px 22px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: C.gold, border: "none", color: "#102d39", cursor: "pointer" }}>
            Start Local Simulation →
          </button>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>
            Owner: {configured.owner} · {configured.approvalGate ? `${configured.decider} approval required` : `Delegated authority: ${configured.decider}`} · closure requires {configured.requiredEvidence.length} evidence item{configured.requiredEvidence.length === 1 ? "" : "s"} · {requirements.communications.length} communication drafts
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

  const guestPanel = (
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

  const operatorPanel = (
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
            <div data-testid="decision-authority" style={{ padding: "12px 14px", background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.22)", fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.65 }}>
              <div style={{ fontSize: 8.5, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#f97316", marginBottom: 6 }}>Authority at this decision</div>
              <div><strong style={{ color: "#fff" }}>Who decides:</strong> {exec.approvalRequired ? `${roleName(exec.approvalRoleId)} (approval gate)` : `${roleName(exec.accountableRoleId)} — within delegated authority, no approval gate`}</div>
              <div><strong style={{ color: "#fff" }}>Accountable owner:</strong> {roleName(exec.accountableRoleId)}</div>
              <div><strong style={{ color: "#fff" }}>Decision deadline:</strong> {scenario.decision.decisionDeadline ?? "Not configured"}</div>
              {scenario.governanceConfig.permissions.slice(0, 2).map(p => <div key={p}>· {p}</div>)}
              {exec.approvalRequired && <>
                <div><strong style={{ color: "#fff" }}>If no decision in time:</strong> escalates to {roleName(escalationTarget({ ...exec, state: "approval-required" }).roleId)}, who must acknowledge before work resumes.</div>
                <div><strong style={{ color: "#fff" }}>If the approver disagrees:</strong> the case returns to decision with their reason recorded; nothing is actioned.</div>
              </>}
              {exec.decisions.filter(d => d.decision === "returned").map((d, i) => (
                <div key={i} style={{ marginTop: 6, color: "#f97316" }}>Returned by {roleName(d.roleId)}: “{d.reason}”</div>
              ))}
            </div>
            {exec.state === "approval-required" && (
              <div style={{ marginTop: 10 }}>
                <label style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 4 }} htmlFor={`return-${exec.id}`}>
                  Reason, if {roleName(exec.approvalRoleId)} disagrees
                </label>
                <input
                  id={`return-${exec.id}`}
                  value={returnReason}
                  onChange={e => setReturnReason(e.currentTarget.value)}
                  placeholder="e.g. Offer lounge access instead of an upgrade"
                  style={{ width: "100%", maxWidth: 520, padding: "8px 10px", fontSize: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
                />
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
              const approvalRole = exec.approvalRoleId;
              return (
                <div key={c.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Draft: {c.purpose}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Proposed route: {c.channel} → {c.audience}</div>
                      {c.approvalRequired && (
                        <div style={{ fontSize: 12, color: isApproved ? C.green : "#f97316", marginTop: 3 }}>
                          {isApproved ? `Simulation approval recorded for ${roleName(approvedComms[c.id])}` : `Requires ${roleName(approvalRole)} approval before any future delivery`}
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
                            Approve as {roleName(approvalRole)}
                          </button>
                        )}
                        <button
                          onClick={() => handleSendComm(c.id)}
                          disabled={needsApproval}
                          title={needsApproval ? `${roleName(approvalRole)} approval required before review` : undefined}
                          aria-disabled={needsApproval}
                          style={{
                            padding: "6px 14px", fontSize: 12, fontWeight: 700, minHeight: 44,
                            background: needsApproval ? "rgba(255,255,255,0.04)" : "rgba(168,222,219,0.1)",
                            border: `1px solid ${needsApproval ? "rgba(255,255,255,0.1)" : "rgba(168,222,219,0.3)"}`,
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
                  <div key={e.id} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)" }}>
                    Simulated: {e.trigger} → {roleName(e.escalateToRoleId)} · {e.acknowledged ? "acknowledged (simulated)" : "awaiting acknowledgement — no alert was sent"}
                  </div>
                ))}
                {exec.escalations.some(e => !e.acknowledged) && (
                  <button type="button" onClick={handleAcknowledge} style={{ marginTop: 8, padding: "6px 14px", minHeight: 44, fontSize: 11, fontWeight: 700, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)", color: C.red, cursor: "pointer" }}>
                    Acknowledge as {roleName(exec.escalations.find(e => !e.acknowledged)!.escalateToRoleId)}
                  </button>
                )}
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
                  Synthetic evidence for this run — {evidencePct}% of required recorded
                </div>
                {gaps.length > 0 && (
                  <div style={{ fontSize: 9, color: "#f97316" }}>{gaps.length} required item{gaps.length > 1 ? "s" : ""} outstanding</div>
                )}
              </div>
              {exec.evidence.map(ev => (
                <label key={ev.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={ev.captured}
                    onChange={(event) => handleEvidence(ev.id, event.currentTarget.checked)}
                    aria-label={`${ev.evidenceType}${ev.required ? " (required)" : " (optional)"}`}
                    aria-required={ev.required}
                    style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, accentColor: C.green, cursor: "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.75)" }}>
                      {ev.evidenceType}
                      {ev.required && <span style={{ fontSize: 8.5, color: "#f97316", marginLeft: 6, fontWeight: 700 }}>REQUIRED</span>}
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{ev.completionRule}</div>
                    {ev.captured && ev.capturedAt && (
                      <div style={{ fontSize: 9, color: C.green, marginTop: 2 }}>Recorded (synthetic) {new Date(ev.capturedAt).toLocaleTimeString()}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>Illustrative Outcome Modelling — Not Measured</div>
              {exec.outcomes.map(o => (
                <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, fontSize: 10.5, color: "rgba(255,255,255,0.65)" }}>{o.metric}</div>
                  <div role="group" aria-label={`Model outcome for ${o.metric}`} style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {(["met", "partially-met", "not-met", "not-measured"] as OutcomeStatus[]).map(s => (
                      <button type="button" key={s} onClick={() => handleOutcome(o.id, s)} aria-pressed={o.status === s} style={{
                        padding: "3px 9px", fontSize: 8.5, fontWeight: 700, cursor: "pointer",
                        color: o.status === s ? "#102d39" : "rgba(255,255,255,0.4)",
                        background: o.status === s ? (s === "met" ? C.green : s === "partially-met" ? C.gold : C.red) : "rgba(255,255,255,0.03)",
                        border: `1px solid ${o.status === s ? (s === "met" ? C.green : s === "partially-met" ? C.gold : C.red) : "rgba(255,255,255,0.1)"}`,
                      }}>
                        Model: {OUTCOME_STATUS_LABELS[s]}
                      </button>
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
                else if (action.via === "approveDecision") { handleApprove(); }
                else if (action.via === "returnDecision") { handleReturn(); }
                else { handleAction(action.toState); }
              }}
              disabled={!action.toState}
              style={{
                padding: "8px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                cursor: action.toState ? "pointer" : "default",
                background: action.toState ? (action.id === "escalate" ? "rgba(239,68,68,0.1)" : "rgba(168,222,219,0.08)") : "rgba(255,255,255,0.03)",
                border: `1px solid ${action.toState ? (action.id === "escalate" ? "rgba(239,68,68,0.35)" : "rgba(168,222,219,0.3)") : "rgba(255,255,255,0.08)"}`,
                color: action.toState ? (action.id === "escalate" ? C.red : C.gold) : "rgba(255,255,255,0.25)",
              }}
            >
              {action.via === "approveDecision" ? `Approve as ${roleName(exec.approvalRoleId)}` : action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Learning output
  const LearningPanel = () => learning ? (
    <div style={{ marginTop: 12, padding: "16px 20px", background: "rgba(168,222,219,0.04)", border: "1px solid rgba(168,222,219,0.2)" }}>
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
      <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.25)", fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.65 }}>
        <div><strong style={{ color: "#fff" }}>Review trigger:</strong> {learning.reviewTrigger}</div>
        <div><strong style={{ color: "#fff" }}>Next action:</strong> {learning.nextAction}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>A proposal only. A named reviewer approves any playbook change; nothing is applied automatically.</div>
      </div>
      <div style={{ marginTop: 10, fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>
        Evidence quality: <span style={{ fontWeight: 700, color: learning.evidenceQuality === "complete" ? C.green : learning.evidenceQuality === "partial" ? C.gold : C.red }}>
          {learning.evidenceQuality}
        </span> · Outcome evidence: <span style={{ fontWeight: 700, color: learning.outcomeEvidence === "measured" ? C.gold : "rgba(255,255,255,0.5)" }}>{learning.outcomeEvidence === "measured" ? "values entered in simulation" : "not measured"}</span> · Cycle {cycle} · Generated {new Date(learning.generatedAt).toLocaleTimeString()}
      </div>
      <button type="button" onClick={runNextCycle} style={{ marginTop: 12, padding: "9px 18px", minHeight: 44, fontSize: 11, fontWeight: 700, background: C.gold, border: "none", color: "#102d39", cursor: "pointer" }}>
        Run cycle {cycle + 1} with this learning in view →
      </button>
    </div>
  ) : null;

  return (
    <div style={{ marginBottom: 4 }}>
      {/* Panel header */}
      <div style={{ padding: "14px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{scenario.title}</div>
            <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)" }}>{exec.playbookName} · Accountable: {roleName(exec.accountableRoleId)}</div>
          </div>
          <div style={{ padding: "4px 10px", fontSize: 9, fontWeight: 700, color: stateColor, border: `1px solid ${stateColor}40`, background: `${stateColor}0a` }}>
            Synthetic run · {stateLabel}
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
                color: view === v ? "#102d39" : "rgba(255,255,255,0.4)",
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
                  color: isDone || isCurrent ? "#102d39" : "rgba(255,255,255,0.35)",
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
        {priorLearning && (
          <div role="note" style={{ marginBottom: 12, padding: "10px 14px", background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.25)", fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
            <strong style={{ color: "#a78bfa" }}>Cycle {cycle} · carried from cycle {cycle - 1}:</strong> {priorLearning.nextAction}
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Shown to the deciding role as context. The playbook itself is unchanged until a reviewer approves an update.</div>
          </div>
        )}
        {view === "dual" ? (
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Operator View</div>
              {operatorPanel}
            </div>
            <div>
              <div style={{ fontSize: 8.5, letterSpacing: "0.12em", color: C.blue, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Guest View</div>
              {guestPanel}
            </div>
          </div>
        ) : view === "guest" ? (
          guestPanel
        ) : (
          operatorPanel
        )}

        <LearningPanel />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PartnerOperationsCentre() {
  const simulationView = new URLSearchParams(useSearch()).get("view") === "simulation";
  const [location, navigate] = useLocation();
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      return schedulePartnerRoomHashScroll(hash, "auto");
    };
    const cancelInitialScroll = scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      cancelInitialScroll?.();
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [location, simulationView]);

  const { activeDeployment } = useDeployment();
  const [launchedScenarioId, setLaunchedScenarioId] = useState<string | null>(null);
  const [runRecords, setRunRecords] = useState<Record<string, RunRecord>>({});
  const recordRun = useCallback((scenarioId: string, exec: ScenarioExecution | null, cycle: number) => {
    setRunRecords(prev => {
      if (!exec) {
        if (!(scenarioId in prev)) return prev;
        const { [scenarioId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [scenarioId]: { exec, cycle } };
    });
  }, []);
  // Records belong to one configuration; a different activation starts a clean list.
  useEffect(() => { setRunRecords({}); }, [activeDeployment?.id, activeDeployment?.activatedAt]);
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

  if (simulationView) return <PartnerRoomLayout><TravelSimulationPanel activeDeployment={activeDeployment} /></PartnerRoomLayout>;

  return (
    <PartnerRoomLayout>
      <div className="rtbx-responsive-page rtbx-page-pad" style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionLabel>JALDO Travel · Operations</SectionLabel>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 12, maxWidth: 760 }}>
            JALDO Operations Centre — Working Proof
          </h1>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 16, letterSpacing: "-0.01em" }}>
            Travel Operations Centre — Operator Interface
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700 }}>
            This page has two parts. <a href="#configured-operation" style={{ color: C.gold }}>Part 1</a> runs the deployment you activated in Build &amp; Configure, using its roles, approvals and evidence rules, and lists the synthetic records it generates. <a href="#static-examples" style={{ color: C.gold }}>Part 2</a> holds fixed examples that do not change with your configuration.
          </p>
        </div>

        <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #a8dedb", marginBottom: 36 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: C.gold }}>Working Proof · Simulation boundary:</strong> all operational inputs and states below are synthetic and local. Current classification is deterministic and rules-based. Communications remain drafts and are never sent or delivered; actions, evidence and outcomes are illustrative, and value is modelled rather than measured. No task, partner activation or external-system update occurs. Named humans retain approval and real-world accountability.
          </p>
        </div>

        <Link href="/partner-room/operating-evolution" style={{ display: "block", padding: "18px 22px", marginBottom: 24, border: "1px solid #81bcb8", borderRadius: 8, color: "#c5ece7", fontSize: 14 }}>Watch the operation evolve — reviewed patterns, earlier preparation and the next cycle’s impact →</Link>

        <ProofSummary />

        <Link href="/partner-room/operations?view=simulation" style={{ display: "block", padding: "18px 22px", marginBottom: 30, background: "#20474e", border: "1px solid #81bcb8", borderRadius: 8, color: "#c5ece7", fontSize: 14, fontWeight: 700 }}>Open Simulation Lab — watch signals move through the engine →</Link>

        <section id="configured-operation" className="ops-part" aria-labelledby="configured-operation-title">
          <div className="ops-part-head">
            <div className="ops-part-kicker">Part 1</div>
            <h2 id="configured-operation-title">Your configured operation</h2>
            <p>Runs here use the active deployment's roles, approvals and evidence rules. Every state, decision and evidence record in this part is generated by those settings in your browser and is synthetic.</p>
          </div>
        {/* ── DEPLOYMENT CONTEXT BANNER ── */}
        <div id="deployment-status" style={{ marginBottom: 40, scrollMarginTop: 90 }}>
          <SectionLabel>00 · Local Configuration</SectionLabel>
          <DeploymentBanner deployment={activeDeployment} />
          {!activeDeployment && <RunRecords deploymentName={null} records={[]} />}
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
                    onExecutionChange={recordRun}
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
                        onExecutionChange={recordRun}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            <RunRecords deploymentName={activeDeployment.deploymentName} records={Object.values(runRecords)} />
          </div>
        )}
        </section>

        <section id="static-examples" className="ops-part ops-part-examples" aria-labelledby="static-examples-title">
          <div className="ops-part-head">
            <div className="ops-part-kicker">Part 2</div>
            <h2 id="static-examples-title">Static illustrative examples</h2>
            <p data-testid="static-examples-note">
              Fixed examples across four sample properties ({TRAVEL_PROPERTIES.join(", ")}). {activeDeployment
                ? <>They do not change with <strong>{activeDeployment.deploymentName}</strong>'s configuration and are not results from it.</>
                : "They do not change with any configuration and are not results."} Use them to see the kinds of actions, records and value a pilot would track.
            </p>
          </div>

        <Link href="/partner-room/travel-ai-comms">
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", marginBottom: 40,
            background: "rgba(168,222,219,0.05)", border: "1px solid rgba(168,222,219,0.2)", cursor: "pointer",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#a8dedb", letterSpacing: "0.04em" }}>
              Explore the planned Central Comms model — Travel AI & Central Comms →
            </span>
          </div>
        </Link>

        {/* ── EXECUTION CENTRE (existing action cards) ── */}
        <div id="action-centre" style={{ marginBottom: 64, scrollMarginTop: 90 }}>
          <SectionLabel>01 · Execution</SectionLabel>
          <H2>Example Action Centre — static illustration</H2>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", marginBottom: 12, marginTop: -6 }}>Travel Operations Centre</div>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 760 }}>
            Review synthetic moments, accountable role owners and illustrative deadlines. Filters and controls change local demonstration state only.
          </p>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
              {["Synthetic Signals", "Modelled Moments", "Recommendations", "Illustrative Actions", "Draft Comms", "Modelled Escalations", "Illustrative Evidence", "Modelled Outcomes & Learning"].map((d, i) => (
                <div key={d} style={{
                  padding: "5px 12px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: i === 0 ? "#a8dedb" : "rgba(255,255,255,0.4)",
                  border: `1px solid ${i === 0 ? "rgba(168,222,219,0.3)" : "rgba(255,255,255,0.1)"}`,
                  background: i === 0 ? "rgba(168,222,219,0.06)" : "rgba(255,255,255,0.02)",
                }}>{d}</div>
              ))}
            </div>
            <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "2px solid rgba(168,222,219,0.4)" }}>
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
                    <div style={{ flex: 1, minWidth: 0 }}>
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
                      <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", marginBottom: 16 }}>
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
                            color: canAdvance ? "#102d39" : "rgba(255,255,255,0.25)", background: canAdvance ? C.gold : "rgba(255,255,255,0.04)",
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
                <div className="rtbx-grid-2" style={{ padding: "0 20px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
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
                  <div style={{ gridColumn: "1 / -1", marginTop: 4, padding: "10px 14px", background: "rgba(168,222,219,0.04)", border: "1px solid rgba(168,222,219,0.15)", fontSize: 10.5, color: "rgba(255,255,255,0.55)" }}>
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
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: "0 0 12px", maxWidth: 760 }}>
            <strong style={{ color: "#fff" }}>Modelled example.</strong> Each row shows what a pilot would record for a moment. Nothing below was sent, approved or captured in this demonstration.
          </p>
          <div className="rtbx-table-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {["Example record", "Example time", "Accountable role", "Action evidence", "Message", "Approval", "Escalation", "Guest acknowledgement", "Closure review"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", fontSize: 8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRAVEL_EVIDENCE_LEDGER.map(e => (
                  <tr key={e.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "9px 10px", fontWeight: 700, color: "#fff" }}>{e.label}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.timestamp}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.owner}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.actionConfirmation}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.messageDelivery}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.approvalRecord}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.escalationRecord}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.guestAcknowledgement}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.closureReview}</td>
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
          <div style={{ padding: "12px 16px", background: "rgba(168,222,219,0.05)", border: "1px solid rgba(168,222,219,0.2)", marginBottom: 24, maxWidth: 760 }}>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0, fontWeight: 600 }}>{VALUE_DEMO_LABEL_NOTE}</p>
          </div>
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, marginBottom: 32 }}>
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
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{m.value}</span>
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
                    color: i === arr.length - 1 ? "#102d39" : "rgba(255,255,255,0.65)",
                    background: i === arr.length - 1 ? "#a8dedb" : "rgba(255,255,255,0.03)",
                    border: i === arr.length - 1 ? "1px solid #a8dedb" : "1px solid rgba(255,255,255,0.1)",
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

        </section>

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
