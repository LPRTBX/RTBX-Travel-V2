/**
 * Sprint 3 data integrity tests.
 *
 * Run with: pnpm --filter @workspace/welbx test
 *
 * All tests must pass before Sprint 3 is considered complete.
 * Tests validate cross-file referential integrity across:
 * - travelOperatingSystems.ts
 * - travelScenarios.ts
 * - travelPlaybooks.ts
 * - travelRoles.ts
 */

import { describe, it, expect } from "vitest";
import { validateSprint3, printValidationReport } from "./validateSprint3";
import { TRAVEL_OPERATING_SYSTEMS, TRAVEL_ROLE_COLUMNS } from "../data/travelOperatingSystems";
import { TRAVEL_SCENARIOS, VALID_MATURITY_STATUSES, TRAVEL_ROLES as _TRCheck } from "../data/travelScenarios";
import { TRAVEL_PLAYBOOKS } from "../data/travelPlaybooks";
import { TRAVEL_ROLES, TRAVEL_ROLE_IDS } from "../data/travelRoles";

// ── Master validation ─────────────────────────────────────────────────────────

describe("Sprint 3 Data Integrity", () => {
  it("passes all validation checks with zero errors", () => {
    const result = validateSprint3();
    if (!result.passed) {
      printValidationReport(result);
    }
    expect(result.errorCount).toBe(0);
  });
});

// ── Operating System checks ───────────────────────────────────────────────────

describe("Operating Systems", () => {
  const osIds = TRAVEL_OPERATING_SYSTEMS.map(os => os.id);

  it("has unique operating system IDs", () => {
    expect(new Set(osIds).size).toBe(osIds.length);
  });

  it("has at least 3 lead operating systems", () => {
    const leads = TRAVEL_OPERATING_SYSTEMS.filter(os => os.position === "lead");
    expect(leads.length).toBeGreaterThanOrEqual(3);
  });

  it("has at least 1 cross-cutting operating system", () => {
    const crossCutting = TRAVEL_OPERATING_SYSTEMS.filter(os => os.position === "cross-cutting");
    expect(crossCutting.length).toBeGreaterThanOrEqual(1);
  });

  it("has at least 1 expansion operating system", () => {
    const expansion = TRAVEL_OPERATING_SYSTEMS.filter(os => os.position === "expansion");
    expect(expansion.length).toBeGreaterThanOrEqual(1);
  });

  it("Safety and Guest Welfare OS is cross-cutting", () => {
    const safety = TRAVEL_OPERATING_SYSTEMS.find(os => os.id === "safety-guest-welfare-os");
    expect(safety).toBeDefined();
    expect(safety?.position).toBe("cross-cutting");
  });

  it("Marketplace and Loyalty OS is expansion", () => {
    const marketplace = TRAVEL_OPERATING_SYSTEMS.find(os => os.id === "marketplace-loyalty-activation-os");
    expect(marketplace).toBeDefined();
    expect(marketplace?.position).toBe("expansion");
  });

  it("every OS has a valid position", () => {
    const validPositions = ["lead", "cross-cutting", "expansion"];
    for (const os of TRAVEL_OPERATING_SYSTEMS) {
      expect(validPositions).toContain(os.position);
    }
  });

  it("every OS has a valid maturityStatus", () => {
    for (const os of TRAVEL_OPERATING_SYSTEMS) {
      expect(VALID_MATURITY_STATUSES).toContain(os.maturityStatus);
    }
  });

  it("every OS scenarioId resolves to a known scenario", () => {
    const scenarioIds = new Set(TRAVEL_SCENARIOS.map(s => s.id));
    for (const os of TRAVEL_OPERATING_SYSTEMS) {
      for (const sid of os.scenarioIds) {
        expect(scenarioIds.has(sid)).toBe(true);
      }
    }
  });

  it("every OS playbookId resolves to a known playbook", () => {
    const playbookIds = new Set(TRAVEL_PLAYBOOKS.map(p => p.id));
    for (const os of TRAVEL_OPERATING_SYSTEMS) {
      for (const pid of os.playbookIds) {
        expect(playbookIds.has(pid)).toBe(true);
      }
    }
  });
});

// ── Scenario checks ───────────────────────────────────────────────────────────

describe("Scenarios", () => {
  const osIds = new Set(TRAVEL_OPERATING_SYSTEMS.map(os => os.id));
  const playbookIds = new Set(TRAVEL_PLAYBOOKS.map(p => p.id));
  const scenarioIds = TRAVEL_SCENARIOS.map(s => s.id);

  it("has unique scenario IDs", () => {
    expect(new Set(scenarioIds).size).toBe(scenarioIds.length);
  });

  it("every scenario has a valid maturityStatus", () => {
    for (const s of TRAVEL_SCENARIOS) {
      expect(VALID_MATURITY_STATUSES).toContain(s.maturityStatus);
    }
  });

  it("every scenario has a trigger with type and description", () => {
    for (const s of TRAVEL_SCENARIOS) {
      expect(s.trigger?.type).toBeTruthy();
      expect(s.trigger?.description).toBeTruthy();
    }
  });

  it("every scenario references a valid operatingSystemId", () => {
    for (const s of TRAVEL_SCENARIOS) {
      expect(osIds.has(s.operatingSystemId)).toBe(true);
    }
  });

  it("every scenario has a playbookId that resolves", () => {
    for (const s of TRAVEL_SCENARIOS) {
      expect(s.playbookId).toBeTruthy();
      expect(playbookIds.has(s.playbookId)).toBe(true);
    }
  });

  it("every scenario has an accountable role that is in the role register", () => {
    for (const s of TRAVEL_SCENARIOS) {
      expect(TRAVEL_ROLE_IDS).toContain(s.rolesConfig?.accountableRoleId);
      expect(TRAVEL_ROLE_IDS).toContain(s.decision?.accountableRoleId);
    }
  });

  it("every scenario action step owner is in the role register", () => {
    for (const s of TRAVEL_SCENARIOS) {
      for (const step of s.actionSteps) {
        expect(TRAVEL_ROLE_IDS).toContain(step.ownerRoleId);
      }
    }
  });

  it("every scenario escalation role is in the role register", () => {
    for (const s of TRAVEL_SCENARIOS) {
      for (const esc of s.escalation) {
        expect(TRAVEL_ROLE_IDS).toContain(esc.escalateToRoleId);
      }
    }
  });

  it("every scenario has at least one evidence requirement", () => {
    for (const s of TRAVEL_SCENARIOS) {
      expect(s.evidenceRequirements.length).toBeGreaterThan(0);
    }
  });

  it("every scenario evidence requirement owner is in the role register", () => {
    for (const s of TRAVEL_SCENARIOS) {
      for (const ev of s.evidenceRequirements) {
        if (ev.ownerRoleId) {
          expect(TRAVEL_ROLE_IDS).toContain(ev.ownerRoleId);
        }
      }
    }
  });

  it("every scenario has at least one measurable outcome", () => {
    for (const s of TRAVEL_SCENARIOS) {
      expect(s.outcomes.length).toBeGreaterThan(0);
    }
  });

  it("every scenario has a learning rule", () => {
    for (const s of TRAVEL_SCENARIOS) {
      expect(s.learningConfig?.reviewTrigger).toBeTruthy();
      expect(s.learningConfig?.patternToDetect).toBeTruthy();
      expect(s.learningConfig?.improvementAction).toBeTruthy();
    }
  });

  it("every scenario has a proof record", () => {
    for (const s of TRAVEL_SCENARIOS) {
      expect(s.proof?.proofType).toBeTruthy();
      expect(s.proof?.source).toBeTruthy();
    }
  });

  it("all 6 required core scenarios are present", () => {
    const requiredIds = [
      "repeat-guest-room-not-ready",
      "distressed-guest",
      "service-backlog",
      "maintenance-defect",
      "transport-disruption",
      "premium-guest-opportunity",
    ];
    const ids = new Set(scenarioIds);
    for (const rid of requiredIds) {
      expect(ids.has(rid)).toBe(true);
    }
  });
});

// ── Playbook checks ───────────────────────────────────────────────────────────

describe("Playbooks", () => {
  const osIds = new Set(TRAVEL_OPERATING_SYSTEMS.map(os => os.id));
  const playbookIds = TRAVEL_PLAYBOOKS.map(p => p.id);

  it("has unique playbook IDs", () => {
    expect(new Set(playbookIds).size).toBe(playbookIds.length);
  });

  it("every playbook operatingSystemId resolves", () => {
    for (const pb of TRAVEL_PLAYBOOKS) {
      expect(osIds.has(pb.operatingSystemId)).toBe(true);
    }
  });

  it("every playbook accountableRoleId is in the role register", () => {
    for (const pb of TRAVEL_PLAYBOOKS) {
      expect(TRAVEL_ROLE_IDS).toContain(pb.accountableRoleId);
    }
  });

  it("every playbook supporting role is in the role register", () => {
    for (const pb of TRAVEL_PLAYBOOKS) {
      for (const rid of pb.supportingRoleIds) {
        expect(TRAVEL_ROLE_IDS).toContain(rid);
      }
    }
  });

  it("every playbook has ordered steps starting at 1", () => {
    for (const pb of TRAVEL_PLAYBOOKS) {
      expect(pb.steps.length).toBeGreaterThan(0);
      pb.steps.forEach((step, i) => {
        expect(step.step).toBe(i + 1);
      });
    }
  });

  it("every playbook step has an owner and action", () => {
    for (const pb of TRAVEL_PLAYBOOKS) {
      for (const step of pb.steps) {
        expect(step.ownerRoleId).toBeTruthy();
        expect(step.action).toBeTruthy();
        expect(TRAVEL_ROLE_IDS).toContain(step.ownerRoleId);
      }
    }
  });

  it("every playbook escalation role is in the role register", () => {
    for (const pb of TRAVEL_PLAYBOOKS) {
      for (const rule of pb.escalationRules) {
        expect(TRAVEL_ROLE_IDS).toContain(rule.escalateToRoleId);
      }
    }
  });

  it("every playbook has completion criteria", () => {
    for (const pb of TRAVEL_PLAYBOOKS) {
      expect(pb.completionCriteria.length).toBeGreaterThan(0);
    }
  });

  it("every playbook has evidence requirements", () => {
    for (const pb of TRAVEL_PLAYBOOKS) {
      expect(pb.evidenceRequirements.length).toBeGreaterThan(0);
    }
  });

  it("every playbook has a valid maturityStatus", () => {
    for (const pb of TRAVEL_PLAYBOOKS) {
      expect(VALID_MATURITY_STATUSES).toContain(pb.maturityStatus);
    }
  });

  it("every canonical scenario has a corresponding playbook", () => {
    const playbookIdSet = new Set(playbookIds);
    for (const s of TRAVEL_SCENARIOS) {
      expect(playbookIdSet.has(s.playbookId)).toBe(true);
    }
  });
});

// ── Role checks ───────────────────────────────────────────────────────────────

describe("Roles", () => {
  const roleIds = TRAVEL_ROLES.map(r => r.id);

  it("has unique role IDs", () => {
    expect(new Set(roleIds).size).toBe(roleIds.length);
  });

  it("has at least 13 canonical roles", () => {
    expect(TRAVEL_ROLES.length).toBeGreaterThanOrEqual(13);
  });

  it("every role has a valid level", () => {
    const validLevels = ["frontline", "manager", "property", "regional", "group", "partner"];
    for (const role of TRAVEL_ROLES) {
      expect(validLevels).toContain(role.level);
    }
  });

  it("every role referenced by scenarios and playbooks is in the register", () => {
    const allReferenced = new Set<string>();

    for (const s of TRAVEL_SCENARIOS) {
      if (s.rolesConfig?.accountableRoleId) allReferenced.add(s.rolesConfig.accountableRoleId);
      for (const rid of s.rolesConfig?.supportingRoleIds ?? []) allReferenced.add(rid);
      if (s.decision?.accountableRoleId) allReferenced.add(s.decision.accountableRoleId);
      for (const step of s.actionSteps) allReferenced.add(step.ownerRoleId);
      for (const esc of s.escalation) allReferenced.add(esc.escalateToRoleId);
    }

    for (const pb of TRAVEL_PLAYBOOKS) {
      allReferenced.add(pb.accountableRoleId);
      for (const rid of pb.supportingRoleIds) allReferenced.add(rid);
      for (const step of pb.steps) allReferenced.add(step.ownerRoleId);
      for (const rule of pb.escalationRules) allReferenced.add(rule.escalateToRoleId);
    }

    const roleIdSet = new Set(roleIds);
    for (const refId of allReferenced) {
      expect(roleIdSet.has(refId)).toBe(true);
    }
  });

  it("TRAVEL_ROLE_IDS matches TRAVEL_ROLES array", () => {
    expect(TRAVEL_ROLE_IDS).toEqual(TRAVEL_ROLES.map(r => r.id));
  });
});
