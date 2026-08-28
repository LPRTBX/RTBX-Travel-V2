import { describe, expect, it } from "vitest";
import { DEFAULT_DEPLOYMENT } from "@/data/travelDeploymentConfig";
import { TRAVEL_PLAYBOOKS } from "@/data/travelPlaybooks";
import {
  MATURITY_LABELS,
  TRAVEL_SCENARIOS,
} from "@/data/travelScenarios";
import { TRAVEL_ROLES } from "@/data/travelRoles";
import {
  getScenarioIdFromLibraryLocation,
  getScenarioIdFromQuery,
  getDeploymentActivationReadiness,
  getScenarioRuntimeReadiness,
  travelScenarioConfigurePath,
  travelScenarioExecutionPath,
  travelScenarioPath,
} from "@/lib/travelScenarioRouting";

describe("Travel Scenario Library routing", () => {
  it("creates copied URLs that resolve to the exact canonical scenario", () => {
    for (const scenario of TRAVEL_SCENARIOS) {
      expect(getScenarioIdFromLibraryLocation(travelScenarioPath(scenario.id))).toBe(scenario.id);
      expect(getScenarioIdFromLibraryLocation(`/travel-scenarios/${scenario.id}`)).toBe(scenario.id);
      expect(getScenarioIdFromQuery(travelScenarioConfigurePath(scenario.id))).toBe(scenario.id);
      expect(getScenarioIdFromQuery(travelScenarioExecutionPath(scenario.id))).toBe(scenario.id);
    }
  });

  it("does not treat the library index or nested invalid paths as scenario details", () => {
    expect(getScenarioIdFromLibraryLocation("/partner-room/travel-scenarios")).toBeNull();
    expect(getScenarioIdFromLibraryLocation("/partner-room/travel-scenarios/a/b")).toBeNull();
  });
});

describe("Canonical scenario configuration", () => {
  const playbookIds = new Set(TRAVEL_PLAYBOOKS.map(item => item.id));
  const roleIds = new Set(TRAVEL_ROLES.map(item => item.id));

  it("keeps every deployment scenario aligned with canonical scenario, playbook, role and maturity data", () => {
    for (const configured of DEFAULT_DEPLOYMENT.scenarios) {
      const scenario = TRAVEL_SCENARIOS.find(item => item.id === configured.scenarioId);
      expect(scenario).toBeDefined();
      expect(configured.playbookId).toBe(scenario?.playbookId);
      expect(playbookIds.has(configured.playbookId)).toBe(true);
      expect(roleIds.has(configured.accountableRoleId)).toBe(true);
      expect(MATURITY_LABELS[scenario!.maturityStatus]).toBeTruthy();
    }
  });
});

describe("Execution Centre readiness", () => {
  const activeDeployment = {
    ...DEFAULT_DEPLOYMENT,
    deploymentStatus: "active-simulation" as const,
  };

  it("allows only an enabled scenario with canonical active prerequisites", () => {
    expect(
      getScenarioRuntimeReadiness(activeDeployment, "repeat-guest-room-not-ready"),
    ).toMatchObject({ ready: true, code: "ready" });
  });

  it("blocks inactive scenarios", () => {
    expect(
      getScenarioRuntimeReadiness(activeDeployment, "transport-disruption"),
    ).toMatchObject({ ready: false, code: "scenario-inactive" });
  });

  it("blocks a draft deployment and invalid IDs", () => {
    expect(
      getScenarioRuntimeReadiness(DEFAULT_DEPLOYMENT, "repeat-guest-room-not-ready"),
    ).toMatchObject({ ready: false, code: "deployment-inactive" });
    expect(
      getScenarioRuntimeReadiness(activeDeployment, "not-a-scenario"),
    ).toMatchObject({ ready: false, code: "unknown-scenario" });
  });

  it("blocks activation when an enabled scenario has an inactive canonical OS", () => {
    const invalid = {
      ...DEFAULT_DEPLOYMENT,
      operatingSystems: DEFAULT_DEPLOYMENT.operatingSystems.map(item => (
        item.osId === "guest-experience-os" ? { ...item, active: false } : item
      )),
    };
    expect(getDeploymentActivationReadiness(invalid)).toMatchObject({
      ready: false,
      readiness: "Blocked",
    });
    expect(getDeploymentActivationReadiness(invalid).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "operating-system-inactive" }),
      ]),
    );
  });

  it("blocks activation when the configured role is inactive", () => {
    const invalidRole = {
      ...DEFAULT_DEPLOYMENT,
      scenarios: DEFAULT_DEPLOYMENT.scenarios.map(item => (
        item.scenarioId === "repeat-guest-room-not-ready"
          ? { ...item, accountableRoleId: "group-operations" }
          : item
      )),
    };
    expect(getDeploymentActivationReadiness(invalidRole).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "accountable-role-inactive" }),
      ]),
    );
  });

  it("blocks activation when the configured playbook diverges from the canonical scenario", () => {
    const invalidPlaybook = {
      ...DEFAULT_DEPLOYMENT,
      scenarios: DEFAULT_DEPLOYMENT.scenarios.map(item => (
        item.scenarioId === "repeat-guest-room-not-ready"
          ? { ...item, playbookId: "pb-service-backlog" }
          : item
      )),
    };
    expect(getDeploymentActivationReadiness(invalidPlaybook).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "playbook-mismatch" }),
      ]),
    );
  });
});