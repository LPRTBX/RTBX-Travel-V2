import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import {
  TRAVEL_SCENARIOS, ALL_SCENARIO_ROLES, SCENARIO_LABELS,
  MATURITY_LABELS, MATURITY_COLORS,
  type TravelScenario, type TravelScenarioRole, type MaturityStatus,
} from "@/data/travelScenarios";
import { TRAVEL_OPERATING_SYSTEMS } from "@/data/travelOperatingSystems";
import { getTravelRole } from "@/data/travelRoles";

const C = {
  gold: "#c9a84c", green: "#10b981", blue: "#3b82f6",
  orange: "#f97316", red: "#ef4444", purple: "#a78bfa",
  muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)",
};

// ── Shared badge ────────────────────────────────────────────────────────────

function Badge({ children, color }: { children: string; color: string }) {
  return (
    <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color, border: `1px solid ${color}45`, background: `${color}0c`, padding: "2px 8px", display: "inline-block" }}>
      {children}
    </span>
  );
}

function MaturityBadge({ status }: { status: MaturityStatus }) {
  const color = MATURITY_COLORS[status];
  return <Badge color={color}>{MATURITY_LABELS[status]}</Badge>;
}

// ── Canonical Detail Panel ───────────────────────────────────────────────────

type DetailTab = "overview" | "trigger" | "governance" | "escalation" | "evidence" | "proof";

const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: "overview",    label: "Overview" },
  { id: "trigger",     label: "Trigger & Signals" },
  { id: "governance",  label: "Governance & Decision" },
  { id: "escalation",  label: "Escalation" },
  { id: "evidence",    label: "Evidence & Outcomes" },
  { id: "proof",       label: "Proof Status" },
];

function roleName(id: string): string {
  const role = getTravelRole(id);
  return role ? role.name : id;
}

function osName(id: string): string {
  const os = TRAVEL_OPERATING_SYSTEMS.find(o => o.id === id);
  return os ? os.name : id;
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 8.5, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: C.dim, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function TextValue({ children }: { children: string }) {
  return <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>{children}</p>;
}

function TagList({ items, color = "rgba(255,255,255,0.12)" }: { items: string[]; color?: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {items.map(item => (
        <span key={item} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)", padding: "4px 10px", background: "rgba(255,255,255,0.02)", border: `1px solid ${color}` }}>
          {item}
        </span>
      ))}
    </div>
  );
}

function ScenarioDetailPanel({ scenario }: { scenario: TravelScenario }) {
  const [tab, setTab] = useState<DetailTab>("overview");

  return (
    <div style={{ marginBottom: 0, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none" }}>
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", overflowX: "auto" }}>
        {DETAIL_TABS.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 16px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap",
            color: tab === t.id ? C.gold : "rgba(255,255,255,0.3)",
            borderBottom: tab === t.id ? `2px solid ${C.gold}` : "2px solid transparent",
            background: tab === t.id ? "rgba(201,168,76,0.04)" : "transparent",
          }}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: "20px 24px" }}>

        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <FieldBlock label="Primary Operating System">
                <TextValue>{osName(scenario.operatingSystemId)}</TextValue>
              </FieldBlock>
              {scenario.secondaryOperatingSystemIds && scenario.secondaryOperatingSystemIds.length > 0 && (
                <FieldBlock label="Secondary Operating Systems">
                  <TagList items={scenario.secondaryOperatingSystemIds.map(osName)} />
                </FieldBlock>
              )}
              <FieldBlock label="Maturity">
                <MaturityBadge status={scenario.maturityStatus} />
              </FieldBlock>
              <FieldBlock label="Accountable Role">
                <TextValue>{roleName(scenario.rolesConfig.accountableRoleId)}</TextValue>
              </FieldBlock>
            </div>
            <div>
              <FieldBlock label="Supporting Roles">
                <TagList items={scenario.rolesConfig.supportingRoleIds.map(roleName)} />
              </FieldBlock>
              <FieldBlock label="Linked Playbook">
                <TextValue>{scenario.playbook}</TextValue>
                <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>ID: {scenario.playbookId}</div>
              </FieldBlock>
              <FieldBlock label="Context">
                <TextValue>{scenario.context.riskOrOpportunity}</TextValue>
                {scenario.context.confidence && (
                  <div style={{ fontSize: 10.5, color: C.blue, marginTop: 6 }}>{scenario.context.confidence}</div>
                )}
              </FieldBlock>
            </div>
          </div>
        )}

        {tab === "trigger" && (
          <div>
            <FieldBlock label="Trigger Type">
              <TextValue>{scenario.trigger.type}</TextValue>
            </FieldBlock>
            <FieldBlock label="Trigger Description">
              <TextValue>{scenario.trigger.description}</TextValue>
            </FieldBlock>
            {scenario.trigger.threshold && (
              <FieldBlock label="Threshold">
                <div style={{ padding: "10px 14px", background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.2)", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                  {scenario.trigger.threshold}
                </div>
              </FieldBlock>
            )}
            <FieldBlock label="Signal Sources">
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {scenario.signalDetails.map(sig => (
                  <div key={sig.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, padding: "8px 12px", background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.15)" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{sig.name}</div>
                      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)" }}>Source: {sig.source}</div>
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                      {sig.dataRequired.join(", ")}
                    </div>
                    <Badge color={C.blue}>{sig.status}</Badge>
                  </div>
                ))}
              </div>
            </FieldBlock>
            <FieldBlock label="Relevant Context">
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {scenario.context.relevantFacts.map(fact => (
                  <div key={fact} style={{ display: "flex", gap: 8, fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                    <span style={{ color: C.gold, flexShrink: 0 }}>●</span>{fact}
                  </div>
                ))}
              </div>
            </FieldBlock>
          </div>
        )}

        {tab === "governance" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <FieldBlock label="Governance Sources">
                <TagList items={scenario.governanceConfig.sources} color="rgba(255,255,255,0.15)" />
              </FieldBlock>
              <FieldBlock label="Governance Rules">
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {scenario.governanceConfig.rules.map(rule => (
                    <div key={rule} style={{ display: "flex", gap: 8, fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                      <span style={{ color: C.gold, flexShrink: 0 }}>▸</span>{rule}
                    </div>
                  ))}
                </div>
              </FieldBlock>
              {scenario.governanceConfig.prohibitedActions && (
                <FieldBlock label="Prohibited Actions">
                  <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    {scenario.governanceConfig.prohibitedActions.map(a => (
                      <div key={a} style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 5, lineHeight: 1.55 }}>✗ {a}</div>
                    ))}
                  </div>
                </FieldBlock>
              )}
            </div>
            <div>
              <FieldBlock label="Decision Required">
                <TextValue>{scenario.decision.decisionRequired}</TextValue>
              </FieldBlock>
              <FieldBlock label="Recommended Decision">
                <TextValue>{scenario.decision.recommendedDecision}</TextValue>
              </FieldBlock>
              <FieldBlock label="Accountable Role">
                <div style={{ padding: "10px 14px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: "3px solid #c9a84c" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{roleName(scenario.decision.accountableRoleId)}</div>
                  {scenario.decision.decisionDeadline && (
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Deadline: {scenario.decision.decisionDeadline}</div>
                  )}
                </div>
              </FieldBlock>
              <FieldBlock label="Human Approval Required">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: scenario.governanceConfig.humanApprovalRequired ? C.orange : C.green }}>
                    {scenario.governanceConfig.humanApprovalRequired ? "●" : "○"}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                    {scenario.governanceConfig.humanApprovalRequired
                      ? `Yes — ${scenario.governanceConfig.approvalRole ? roleName(scenario.governanceConfig.approvalRole) : "approval role required"}`
                      : "Standard authority — no additional approval"}
                  </span>
                </div>
              </FieldBlock>
            </div>
          </div>
        )}

        {tab === "escalation" && (
          <div>
            {scenario.escalation.length === 0 ? (
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>No formal escalation rules defined for this scenario.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {scenario.escalation.map((esc, i) => (
                  <div key={i} style={{ padding: "16px 18px", background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.2)", borderLeft: "3px solid #f97316" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 8.5, letterSpacing: "0.1em", textTransform: "uppercase", color: C.orange, fontWeight: 700, marginBottom: 4 }}>Trigger</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{esc.trigger}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 8.5, letterSpacing: "0.1em", textTransform: "uppercase", color: C.orange, fontWeight: 700, marginBottom: 4 }}>Threshold</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{esc.threshold}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 8.5, letterSpacing: "0.1em", textTransform: "uppercase", color: C.orange, fontWeight: 700, marginBottom: 4 }}>Escalate to</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{roleName(esc.escalateToRoleId)}</div>
                        {esc.maximumDelay && <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Max delay: {esc.maximumDelay}</div>}
                      </div>
                      <div>
                        <div style={{ fontSize: 8.5, letterSpacing: "0.1em", textTransform: "uppercase", color: C.orange, fontWeight: 700, marginBottom: 4 }}>Required Action</div>
                        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{esc.action}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 20 }}>
              <FieldBlock label="Playbook Steps Overview">
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {scenario.actionSteps.slice(0, 5).map(step => (
                    <div key={step.step} style={{ display: "flex", gap: 10, padding: "7px 12px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: C.gold, flexShrink: 0, paddingTop: 1 }}>{step.step}</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)" }}>{step.action}</span>
                        <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>— {roleName(step.ownerRoleId)} · {step.timing}</span>
                      </div>
                      {step.approvalRequired && <Badge color={C.orange}>Approval</Badge>}
                    </div>
                  ))}
                  {scenario.actionSteps.length > 5 && (
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic", padding: "4px 12px" }}>
                      + {scenario.actionSteps.length - 5} more steps in the full playbook
                    </div>
                  )}
                </div>
              </FieldBlock>
            </div>
          </div>
        )}

        {tab === "evidence" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <FieldBlock label="Evidence Requirements">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {scenario.evidenceRequirements.map(ev => (
                    <div key={ev.evidenceType} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", flex: 1 }}>{ev.evidenceType}</div>
                        <Badge color={ev.required ? C.gold : "rgba(255,255,255,0.3)"}>{ev.required ? "Required" : "Optional"}</Badge>
                      </div>
                      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                        Owner: {roleName(ev.ownerRoleId)} · {ev.completionRule}
                      </div>
                    </div>
                  ))}
                </div>
              </FieldBlock>
            </div>
            <div>
              <FieldBlock label="Outcome Metrics">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {scenario.outcomes.map(out => (
                    <div key={out.metric} style={{ padding: "10px 14px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{out.metric}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
                        {out.measure}
                        {out.target && <span style={{ color: C.green }}> · Target: {out.target}</span>}
                      </div>
                      {out.ownerRoleId && (
                        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>Owner: {roleName(out.ownerRoleId)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </FieldBlock>
              <FieldBlock label="Learning Rule">
                <div style={{ padding: "12px 14px", background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.2)", borderLeft: "2px solid #a78bfa" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.purple, marginBottom: 6 }}>Review Trigger</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 8, lineHeight: 1.6 }}>{scenario.learningConfig.reviewTrigger}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.purple, marginBottom: 6 }}>Improvement Action</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{scenario.learningConfig.improvementAction}</div>
                </div>
              </FieldBlock>
            </div>
          </div>
        )}

        {tab === "proof" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <FieldBlock label="Proof Type">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MaturityBadge status={scenario.maturityStatus} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textTransform: "capitalize" }}>{scenario.proof.proofType.replace(/-/g, " ")}</span>
                </div>
              </FieldBlock>
              <FieldBlock label="Proof Source">
                <TextValue>{scenario.proof.source}</TextValue>
              </FieldBlock>
            </div>
            <div>
              <FieldBlock label="Limitations — What This Proof Does Not Confirm">
                <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {scenario.proof.limitations.map(lim => (
                    <div key={lim} style={{ display: "flex", gap: 8, fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 5 }}>
                      <span style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>–</span>{lim}
                    </div>
                  ))}
                </div>
              </FieldBlock>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Existing ScenarioRunner ──────────────────────────────────────────────────

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

function ScenarioRunner({ scenario }: { scenario: TravelScenario }) {
  const [started, setStarted] = useState(false);
  const [reachedIdx, setReachedIdx] = useState(0);
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.25)" }}>{scenario.num}</span>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>{scenario.title}</h3>
            <Badge color={C.gold}>{SCENARIO_LABELS.demo}</Badge>
            <Badge color="rgba(255,255,255,0.4)">{SCENARIO_LABELS.synthetic}</Badge>
            <MaturityBadge status={scenario.maturityStatus} />
          </div>
          <div style={{ fontSize: 11, color: C.gold, fontWeight: 600, marginBottom: 4 }}>{scenario.category}</div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)" }}>
            {osName(scenario.operatingSystemId)}
            {scenario.secondaryOperatingSystemIds && scenario.secondaryOperatingSystemIds.length > 0 && (
              <span> · {scenario.secondaryOperatingSystemIds.map(osName).join(" · ")}</span>
            )}
          </div>
        </div>
        {started && (
          <div onClick={reset} style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.15)", padding: "8px 16px", cursor: "pointer", whiteSpace: "nowrap" }}>
            ↺ Reset scenario
          </div>
        )}
      </div>

      {!started ? (
        <div>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 12, maxWidth: 680 }}>
            Existing system: <strong style={{ color: "rgba(255,255,255,0.7)" }}>{scenario.existingSystem}</strong>. Signals: {scenario.signals.join(", ")}.
          </p>
          <div style={{ padding: "10px 14px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 18, maxWidth: 680 }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gold }}>Trigger: </span>
            <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)" }}>{scenario.trigger.description}</span>
          </div>
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
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Synthetic Signal</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {scenario.signals.map(s => <div key={s} style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", padding: "6px 12px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>{s}</div>)}
                </div>
              </div>
            )}
            {activeNode === "moment" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Moment Classification <Badge color={C.blue}>Rules-based</Badge></div>
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
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Recommended Playbook <Badge color={C.blue}>Rules-based</Badge></div>
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
                          {sent ? "✓ Draft previewed" : "Preview demo draft"}
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
                  {actionConfirmed ? "✓ Simulated action recorded" : `Simulate: ${scenario.actionLabel}`}
                </div>
              </div>
            )}
            {activeNode === "evidence" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Illustrative Evidence</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {scenario.evidence.map(e => (
                    <div key={e} style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", display: "flex", gap: 8 }}>
                      <span style={{ color: C.gold }}>●</span>{e}
                    </div>
                  ))}
                </div>
                {!allCommsSent && <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic", marginTop: 12 }}>Some communication drafts have not been previewed yet — return to the Communication step to complete the simulated trail.</p>}
              </div>
            )}
            {activeNode === "outcome" && (
              <div>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, fontWeight: 700, marginBottom: 8 }}>Illustrative Outcome</div>
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
                  {outcomeCompleted ? "✓ Simulated outcome recorded" : "Record simulated outcome"}
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
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 12px" }}>{scenario.learning}</p>
                <div style={{ padding: "10px 14px", background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.2)", borderLeft: "2px solid #a78bfa" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.purple, marginBottom: 5 }}>Pattern to detect</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{scenario.learningConfig.patternToDetect}</div>
                </div>
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

// ── Page ─────────────────────────────────────────────────────────────────────

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
            Every scenario demonstrates a synthetic trigger, recommended decision, accountable role, proposed action, illustrative evidence and modelled outcome.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Badge color={C.gold}>{SCENARIO_LABELS.demo}</Badge>
            <Badge color="rgba(255,255,255,0.4)">{SCENARIO_LABELS.synthetic}</Badge>
            <Badge color={C.orange}>{SCENARIO_LABELS.approval}</Badge>
            <Badge color={C.blue}>Rules-based</Badge>
          </div>
          <div style={{ marginTop: 16, padding: "12px 16px", border: "1px solid rgba(201,168,76,0.25)", borderLeft: "3px solid #c9a84c", background: "rgba(201,168,76,0.04)", maxWidth: 760 }}>
            <p style={{ margin: 0, fontSize: 11.5, color: "rgba(255,255,255,0.58)", lineHeight: 1.65 }}>
              <strong style={{ color: C.gold }}>Simulation boundary:</strong> controls on this page only change local demonstration state. No communication, staff task, partner activation, welfare or emergency action, compensation, booking or external-system record is dispatched or completed.
            </p>
          </div>
        </div>

        {/* scenario picker */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, marginBottom: 0 }}>
          {TRAVEL_SCENARIOS.map(s => {
            const osObj = TRAVEL_OPERATING_SYSTEMS.find(o => o.id === s.operatingSystemId);
            return (
              <div key={s.id} onClick={() => setActiveScenarioId(s.id)} style={{
                padding: "14px 16px", cursor: "pointer",
                background: activeScenarioId === s.id ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${activeScenarioId === s.id ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                borderTop: `2px solid ${activeScenarioId === s.id ? C.gold : "transparent"}`,
              }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>{s.num}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: activeScenarioId === s.id ? "#fff" : "rgba(255,255,255,0.6)", marginBottom: 5 }}>{s.title}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  <MaturityBadge status={s.maturityStatus} />
                  {osObj && (
                    <span style={{ fontSize: 7.5, color: osObj.color, border: `1px solid ${osObj.color}35`, padding: "2px 6px", fontWeight: 700, letterSpacing: "0.04em" }}>
                      {osObj.name.replace(" OS", "")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Canonical detail panel — sits between picker and ScenarioRunner */}
        <ScenarioDetailPanel key={`detail-${activeScenario.id}`} scenario={activeScenario} />

        {/* Interactive ScenarioRunner — preserved exactly */}
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
