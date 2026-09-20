import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import {
  TRAVEL_SCENARIOS, SCENARIO_LABELS,
  MATURITY_LABELS, MATURITY_COLORS,
  type TravelScenario, type MaturityStatus,
} from "@/data/travelScenarios";
import { TRAVEL_OPERATING_SYSTEMS } from "@/data/travelOperatingSystems";
import { getTravelRole } from "@/data/travelRoles";
import {
  getScenarioIdFromLibraryLocation,
  travelScenarioConfigurePath,
  travelScenarioExecutionPath,
  travelScenarioPath,
} from "@/lib/travelScenarioRouting";

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
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
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
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
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
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
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
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
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

// ── Legacy unmounted ru───────────────────────────────────────────────────────

export default function PartnerTravelScenarios() {
  const [location] = useLocation();
  const requestedScenarioId = getScenarioIdFromLibraryLocation(location);
  const hasScenarioPath = location.split(/[?#]/, 1)[0].replace(/\/+$/, "") !== "/partner-room/travel-scenarios"
    && location.split(/[?#]/, 1)[0].replace(/\/+$/, "") !== "/travel-scenarios";
  const activeScenario = requestedScenarioId
    ? TRAVEL_SCENARIOS.find(s => s.id === requestedScenarioId)
    : TRAVEL_SCENARIOS[0];

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Scenario Library · Explorer</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 16, maxWidth: 760 }}>
            Travel Scenario Library
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 700, marginBottom: 16 }}>
            Explore the canonical definitions for synthetic triggers, governed decisions, accountable roles, playbooks, evidence requirements and modelled outcomes. Each scenario has a stable, copyable detail URL.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Badge color={C.gold}>{SCENARIO_LABELS.demo}</Badge>
            <Badge color="rgba(255,255,255,0.4)">{SCENARIO_LABELS.synthetic}</Badge>
            <Badge color={C.orange}>{SCENARIO_LABELS.approval}</Badge>
            <Badge color={C.blue}>Rules-based</Badge>
          </div>
          <div style={{ marginTop: 16, padding: "12px 16px", border: "1px solid rgba(201,168,76,0.25)", borderLeft: "3px solid #c9a84c", background: "rgba(201,168,76,0.04)", maxWidth: 760 }}>
            <p style={{ margin: 0, fontSize: 11.5, color: "rgba(255,255,255,0.58)", lineHeight: 1.65 }}>
              <strong style={{ color: C.gold }}>Library boundary:</strong> this page is a read-only explorer, not a runtime. Build &amp; Configure controls deployment selection and validation. The Execution Centre is the only canonical local scenario runtime; no communication, task, booking or external-system record is dispatched or completed.
            </p>
          </div>
        </div>

        {/* scenario picker */}
        <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 4, marginBottom: 0 }}>
          {TRAVEL_SCENARIOS.map(s => {
            const osObj = TRAVEL_OPERATING_SYSTEMS.find(o => o.id === s.operatingSystemId);
            const isActive = activeScenario?.id === s.id;
            return (
              <Link key={s.id} href={travelScenarioPath(s.id)}>
                <div aria-current={isActive ? "page" : undefined} style={{
                  padding: "14px 16px", cursor: "pointer", height: "100%", boxSizing: "border-box",
                  background: isActive ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                  borderTop: `2px solid ${isActive ? C.gold : "transparent"}`,
                }}>
                  <div style={{ fontSize: 8, fontWeight: 800, color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>{s.num}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#fff" : "rgba(255,255,255,0.6)", marginBottom: 5 }}>{s.title}</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    <MaturityBadge status={s.maturityStatus} />
                    {osObj && (
                      <span style={{ fontSize: 7.5, color: osObj.color, border: `1px solid ${osObj.color}35`, padding: "2px 6px", fontWeight: 700, letterSpacing: "0.04em" }}>
                        {osObj.name.replace(" OS", "")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {activeScenario ? (
          <>
            <ScenarioDetailPanel key={`detail-${activeScenario.id}`} scenario={activeScenario} />
            <div style={{ padding: "22px 24px", background: "rgba(10,20,40,0.5)", border: "1px solid rgba(201,168,76,0.22)", borderTop: "none", marginBottom: 4 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>
                Explore → Configure → Run
              </div>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: "0 0 14px", maxWidth: 760 }}>
                This library entry is immutable reference data. Preselect it in Build &amp; Configure to review operating-system, role, playbook and governance prerequisites. The Execution Centre will only offer it when the selected local deployment is activated and the scenario is enabled.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link href={travelScenarioConfigurePath(activeScenario.id)}>
                  <div style={{ padding: "10px 18px", background: C.gold, color: "#080c14", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
                    Preselect in Build &amp; Configure →
                  </div>
                </Link>
                <Link href={travelScenarioExecutionPath(activeScenario.id)}>
                  <div style={{ padding: "10px 18px", border: "1px solid rgba(255,255,255,0.16)", color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
                    Check Execution Readiness →
                  </div>
                </Link>
              </div>
            </div>
          </>
        ) : hasScenarioPath ? (
          <div role="alert" style={{ padding: "28px 30px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.25)", borderTop: "none" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Scenario not found</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: "0 0 16px" }}>
              “{requestedScenarioId ?? "Invalid scenario URL"}” is not a canonical Travel Scenario Library ID. No fallback scenario has been selected.
            </p>
            <Link href="/partner-room/travel-scenarios">
              <span style={{ fontSize: 10.5, color: C.gold, fontWeight: 700 }}>Return to the Scenario Library →</span>
            </Link>
          </div>
        ) : null}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 48, paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Travel AI & Central Comms", href: "/partner-room/travel-ai-comms" },
            { label: "Execution Centre",            href: "/partner-room/operations" },
            { label: "Build & Configure",           href: "/partner-room/build-configure" },
            { label: "Validation Replay Lab",       href: "/partner-room/validation-replay" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
