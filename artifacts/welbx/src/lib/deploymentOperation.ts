/**
 * What the active deployment configures, read through the runtime engine.
 *
 * The Operations Centre shows these values so people can see which settings
 * their next run will use. Each scenario is summarised from the execution the
 * engine would create, so the summary cannot drift from what actually runs.
 * Nothing here changes the engine, its authority checks or its closure rules.
 */
import type { TravelDeploymentConfig } from "@/data/travelDeploymentConfig";
import { TRAVEL_PLAYBOOKS } from "@/data/travelPlaybooks";
import { TRAVEL_SCENARIOS } from "@/data/travelScenarios";
import { createExecution, getMandatoryEvidenceGaps, type ScenarioExecution } from "@/lib/runtimeEngine";
import { roleLabel } from "@/lib/plainLanguage";
import { getScenarioRuntimeReadiness } from "@/lib/travelScenarioRouting";

export interface ScenarioConfigurationSummary {
  scenarioId: string;
  title: string;
  /** Configured accountable owner. */
  owner: string;
  /** Who makes the decision: the approval role at a gate, otherwise the owner within delegated authority. */
  decider: string;
  approvalGate: boolean;
  /** Evidence the engine requires before the case can close. */
  requiredEvidence: string[];
  optionalEvidence: string[];
  /** Drafts that need a named approval before any future delivery. */
  draftsNeedingApproval: string[];
  draftCount: number;
  welfare: boolean;
}

export interface DeploymentOperationSummary {
  name: string;
  organisation: string;
  /** Property type and operating model, e.g. "Hotel · Owner-operated". */
  category: string;
  detail: string;
  mode: string;
  roles: string[];
  scenarios: ScenarioConfigurationSummary[];
  /** Configured scenarios that are switched off or not ready to run. */
  notRunning: Array<{ title: string; reason: string }>;
  governance: Array<{ label: string; value: string }>;
}

function deploymentRoleName(deployment: TravelDeploymentConfig, roleId: string): string {
  return deployment.roles.find(role => role.roleId === roleId)?.localTitle?.trim() || roleLabel(roleId);
}

/** The settings one scenario will run with, taken from a prototype execution. */
export function summariseScenarioExecution(deployment: TravelDeploymentConfig, exec: ScenarioExecution): ScenarioConfigurationSummary {
  const owner = deploymentRoleName(deployment, exec.accountableRoleId);
  return {
    scenarioId: exec.scenarioId,
    title: exec.scenarioTitle,
    owner,
    decider: exec.approvalRequired ? deploymentRoleName(deployment, exec.approvalRoleId) : owner,
    approvalGate: exec.approvalRequired,
    requiredEvidence: getMandatoryEvidenceGaps(exec),
    optionalEvidence: exec.evidence.filter(ev => !ev.required).map(ev => ev.evidenceType),
    draftsNeedingApproval: exec.communications.filter(c => c.approvalRequired).map(c => c.purpose),
    draftCount: exec.communications.length,
    welfare: exec.isWelfareScenario,
  };
}

export function summariseScenarioConfiguration(deployment: TravelDeploymentConfig, scenarioId: string): ScenarioConfigurationSummary | null {
  const scenario = TRAVEL_SCENARIOS.find(item => item.id === scenarioId);
  const playbook = scenario && TRAVEL_PLAYBOOKS.find(item => item.id === scenario.playbookId);
  if (!scenario || !playbook || !getScenarioRuntimeReadiness(deployment, scenarioId).ready) return null;
  return summariseScenarioExecution(deployment, createExecution({ deployment, scenario, playbook }));
}

export function summariseDeployment(deployment: TravelDeploymentConfig): DeploymentOperationSummary {
  const scenarios: ScenarioConfigurationSummary[] = [];
  const notRunning: DeploymentOperationSummary["notRunning"] = [];
  for (const configured of deployment.scenarios) {
    const title = TRAVEL_SCENARIOS.find(item => item.id === configured.scenarioId)?.title ?? configured.scenarioId;
    const summary = summariseScenarioConfiguration(deployment, configured.scenarioId);
    if (summary) scenarios.push(summary);
    else notRunning.push({ title, reason: configured.active ? getScenarioRuntimeReadiness(deployment, configured.scenarioId).reason : "Switched off in this configuration" });
  }
  return {
    name: deployment.deploymentName,
    organisation: deployment.organisationName,
    category: [deployment.propertyType, deployment.operatingModel].filter(Boolean).join(" · "),
    detail: [`${deployment.roomCount} rooms`, deployment.region].filter(Boolean).join(" · "),
    mode: deployment.deploymentMode,
    roles: deployment.roles.filter(role => role.active).map(role => deploymentRoleName(deployment, role.roleId)),
    scenarios,
    notRunning,
    governance: deployment.governance.filter(rule => rule.value.trim()).map(rule => ({ label: rule.label, value: rule.value })),
  };
}
