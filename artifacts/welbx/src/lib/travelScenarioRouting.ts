import {
  computeReadiness,
  type ReadinessState,
  type TravelDeploymentConfig,
} from "@/data/travelDeploymentConfig";
import { TRAVEL_PLAYBOOKS } from "@/data/travelPlaybooks";
import { TRAVEL_SCENARIOS } from "@/data/travelScenarios";

export const TRAVEL_SCENARIO_LIBRARY_PATH = "/partner-room/travel-scenarios";
export const BUILD_CONFIGURE_PATH = "/partner-room/build-configure";
export const EXECUTION_CENTRE_PATH = "/partner-room/operations";

const RUNTIME_MATURITIES = new Set(["working-proof", "simulation", "prototype"]);
const ACTIVE_DEPLOYMENT_STATUSES = new Set(["active-simulation", "active-pilot"]);

export function travelScenarioPath(scenarioId: string): string {
  return `${TRAVEL_SCENARIO_LIBRARY_PATH}/${encodeURIComponent(scenarioId)}`;
}

export function travelScenarioConfigurePath(scenarioId: string): string {
  return `${BUILD_CONFIGURE_PATH}?scenario=${encodeURIComponent(scenarioId)}`;
}

export function travelScenarioExecutionPath(scenarioId: string): string {
  return `${EXECUTION_CENTRE_PATH}?scenario=${encodeURIComponent(scenarioId)}#runtime-execution`;
}

export function getScenarioIdFromLibraryLocation(location: string): string | null {
  const pathname = location.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  const prefix = pathname.startsWith(`${TRAVEL_SCENARIO_LIBRARY_PATH}/`)
    ? `${TRAVEL_SCENARIO_LIBRARY_PATH}/`
    : pathname.startsWith("/travel-scenarios/")
      ? "/travel-scenarios/"
      : null;
  if (!prefix) return null;

  const encodedId = pathname.slice(prefix.length);
  if (!encodedId || encodedId.includes("/")) return null;

  try {
    return decodeURIComponent(encodedId);
  } catch {
    return encodedId;
  }
}

export function getScenarioIdFromQuery(location: string, search = ""): string | null {
  const query = location.includes("?")
    ? location.slice(location.indexOf("?") + 1).split("#", 1)[0]
    : search.replace(/^\?/, "");
  return new URLSearchParams(query).get("scenario");
}

export type ScenarioRuntimeReadinessCode =
  | "ready"
  | "no-deployment"
  | "deployment-inactive"
  | "unknown-scenario"
  | "scenario-not-configured"
  | "scenario-inactive"
  | "maturity-not-runnable"
  | "operating-system-inactive"
  | "accountable-role-inactive"
  | "playbook-mismatch";

export interface ScenarioRuntimeReadiness {
  ready: boolean;
  code: ScenarioRuntimeReadinessCode;
  reason: string;
}

export function getScenarioConfigurationReadiness(
  deployment: TravelDeploymentConfig,
  scenarioId: string,
): ScenarioRuntimeReadiness {
  const scenario = TRAVEL_SCENARIOS.find(item => item.id === scenarioId);
  if (!scenario) {
    return {
      ready: false,
      code: "unknown-scenario",
      reason: "This scenario ID does not exist in the canonical Travel Scenario Library.",
    };
  }

  const configured = deployment.scenarios.find(item => item.scenarioId === scenarioId);
  if (!configured) {
    return {
      ready: false,
      code: "scenario-not-configured",
      reason: "This scenario is not included in the selected local simulation configuration.",
    };
  }

  if (!configured.active) {
    return {
      ready: false,
      code: "scenario-inactive",
      reason: "This scenario is configured but inactive. Review it in Build & Configure before activation.",
    };
  }

  if (!RUNTIME_MATURITIES.has(scenario.maturityStatus)) {
    return {
      ready: false,
      code: "maturity-not-runnable",
      reason: `This scenario is ${scenario.maturityStatus} and is not available for local runtime simulation.`,
    };
  }

  const operatingSystemActive = deployment.operatingSystems.some(
    item => item.osId === scenario.operatingSystemId && item.active,
  );
  if (!operatingSystemActive) {
    return {
      ready: false,
      code: "operating-system-inactive",
      reason: "The scenario's canonical operating system is not active in this configuration.",
    };
  }

  const accountableRoleActive = deployment.roles.some(
    item => item.roleId === configured.accountableRoleId && item.active,
  );
  if (!accountableRoleActive) {
    return {
      ready: false,
      code: "accountable-role-inactive",
      reason: "The configured accountable role is not active.",
    };
  }

  const canonicalPlaybookExists = TRAVEL_PLAYBOOKS.some(
    item => item.id === scenario.playbookId,
  );
  if (!canonicalPlaybookExists || configured.playbookId !== scenario.playbookId) {
    return {
      ready: false,
      code: "playbook-mismatch",
      reason: "The configured playbook does not match the scenario's canonical playbook.",
    };
  }

  return {
    ready: true,
    code: "ready",
    reason: "Ready for local synthetic simulation in the Execution Centre.",
  };
}

export interface DeploymentActivationReadiness {
  ready: boolean;
  readiness: ReadinessState;
  issues: Array<ScenarioRuntimeReadiness & { scenarioId?: string }>;
}

export function getDeploymentActivationReadiness(
  deployment: TravelDeploymentConfig,
): DeploymentActivationReadiness {
  const baseReadiness = computeReadiness(deployment);
  const issues: DeploymentActivationReadiness["issues"] = [];

  if (baseReadiness !== "Ready for simulation" && baseReadiness !== "Ready for pilot design") {
    issues.push({
      ready: false,
      code: "deployment-inactive",
      reason: `Deployment readiness is ${baseReadiness.toLowerCase()}. Complete all required configuration before activation.`,
    });
  }

  for (const configured of deployment.scenarios.filter(item => item.active)) {
    const result = getScenarioConfigurationReadiness(deployment, configured.scenarioId);
    if (!result.ready) issues.push({ ...result, scenarioId: configured.scenarioId });
  }

  return {
    ready: issues.length === 0,
    readiness: issues.length > 0 && baseReadiness !== "Incomplete" ? "Blocked" : baseReadiness,
    issues,
  };
}

export function getScenarioRuntimeReadiness(
  deployment: TravelDeploymentConfig | null,
  scenarioId: string,
): ScenarioRuntimeReadiness {
  if (!deployment) {
    return {
      ready: false,
      code: "no-deployment",
      reason: "Configure and activate a local simulation before opening a scenario in the Execution Centre.",
    };
  }

  if (!ACTIVE_DEPLOYMENT_STATUSES.has(deployment.deploymentStatus)) {
    return {
      ready: false,
      code: "deployment-inactive",
      reason: "This configuration has not been activated for local simulation.",
    };
  }

  return getScenarioConfigurationReadiness(deployment, scenarioId);
}