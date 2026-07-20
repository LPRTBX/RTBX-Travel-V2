/**
 * RTBX Travel — Sprint 3 Data Integrity Validation.
 *
 * Validates that all scenario, playbook, role and operating-system data
 * are internally consistent. Run during development or CI via the
 * accompanying test file.
 *
 * All checks must pass before Sprint 3 is considered complete.
 */

import { TRAVEL_OPERATING_SYSTEMS, type TravelOSPosition } from "../data/travelOperatingSystems";
import { TRAVEL_SCENARIOS, VALID_MATURITY_STATUSES } from "../data/travelScenarios";
import { TRAVEL_PLAYBOOKS } from "../data/travelPlaybooks";
import { TRAVEL_ROLES, TRAVEL_ROLE_IDS } from "../data/travelRoles";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ValidationIssue {
  category: string;
  severity: "error" | "warning";
  message: string;
}

export interface ValidationResult {
  passed: boolean;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
}

function error(category: string, message: string): ValidationIssue {
  return { category, severity: "error", message };
}

function warning(category: string, message: string): ValidationIssue {
  return { category, severity: "warning", message };
}

// ── Operating System Validation ───────────────────────────────────────────────

function validateOperatingSystems(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const osIds = TRAVEL_OPERATING_SYSTEMS.map(os => os.id);

  // Uniqueness
  const osIdSet = new Set(osIds);
  if (osIdSet.size !== osIds.length) {
    issues.push(error("OperatingSystems", "Duplicate operating system IDs found"));
  }

  // Required positions present
  const positions = TRAVEL_OPERATING_SYSTEMS.map(os => os.position);
  const VALID_POSITIONS: TravelOSPosition[] = ["lead", "cross-cutting", "expansion"];
  const leadCount = positions.filter(p => p === "lead").length;
  const crossCuttingCount = positions.filter(p => p === "cross-cutting").length;
  const expansionCount = positions.filter(p => p === "expansion").length;

  if (leadCount < 3) {
    issues.push(error("OperatingSystems", `Expected at least 3 lead operating systems, found ${leadCount}`));
  }
  if (crossCuttingCount < 1) {
    issues.push(error("OperatingSystems", `Expected at least 1 cross-cutting operating system, found ${crossCuttingCount}`));
  }
  if (expansionCount < 1) {
    issues.push(error("OperatingSystems", `Expected at least 1 expansion operating system, found ${expansionCount}`));
  }

  // Specific required OSes
  const requiredIds = [
    "guest-experience-os",
    "service-recovery-staff-response-os",
    "operator-intelligence-os",
    "safety-guest-welfare-os",
    "marketplace-loyalty-activation-os",
  ];
  for (const id of requiredIds) {
    if (!osIdSet.has(id)) {
      issues.push(error("OperatingSystems", `Required operating system missing: ${id}`));
    }
  }

  // Position values valid
  for (const os of TRAVEL_OPERATING_SYSTEMS) {
    if (!VALID_POSITIONS.includes(os.position)) {
      issues.push(error("OperatingSystems", `OS "${os.id}" has invalid position: "${os.position}"`));
    }
    if (!os.name) {
      issues.push(error("OperatingSystems", `OS "${os.id}" is missing a name`));
    }
    if (!os.problem) {
      issues.push(error("OperatingSystems", `OS "${os.id}" is missing a problem statement`));
    }
    if (!os.maturityStatus) {
      issues.push(error("OperatingSystems", `OS "${os.id}" is missing a maturityStatus`));
    }
    if (!VALID_MATURITY_STATUSES.includes(os.maturityStatus as any)) {
      issues.push(error("OperatingSystems", `OS "${os.id}" has invalid maturityStatus: "${os.maturityStatus}"`));
    }
  }

  // Every scenarioId on an OS resolves
  const scenarioIds = new Set(TRAVEL_SCENARIOS.map(s => s.id));
  for (const os of TRAVEL_OPERATING_SYSTEMS) {
    for (const sid of os.scenarioIds) {
      if (!scenarioIds.has(sid)) {
        issues.push(error("OperatingSystems", `OS "${os.id}" references unknown scenarioId: "${sid}"`));
      }
    }
  }

  // Every playbookId on an OS resolves
  const playbookIds = new Set(TRAVEL_PLAYBOOKS.map(p => p.id));
  for (const os of TRAVEL_OPERATING_SYSTEMS) {
    for (const pid of os.playbookIds) {
      if (!playbookIds.has(pid)) {
        issues.push(error("OperatingSystems", `OS "${os.id}" references unknown playbookId: "${pid}"`));
      }
    }
  }

  return issues;
}

// ── Scenario Validation ───────────────────────────────────────────────────────

function validateScenarios(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const osIds = new Set(TRAVEL_OPERATING_SYSTEMS.map(os => os.id));
  const playbookIds = new Set(TRAVEL_PLAYBOOKS.map(p => p.id));
  const scenarioIdsSeen = new Set<string>();

  for (const scenario of TRAVEL_SCENARIOS) {
    const ctx = `Scenario "${scenario.id}"`;

    // Uniqueness
    if (scenarioIdsSeen.has(scenario.id)) {
      issues.push(error("Scenarios", `${ctx} — duplicate ID`));
    }
    scenarioIdsSeen.add(scenario.id);

    // Required fields
    if (!scenario.title) issues.push(error("Scenarios", `${ctx} — missing title`));
    if (!scenario.operatingSystemId) issues.push(error("Scenarios", `${ctx} — missing operatingSystemId`));
    if (!scenario.maturityStatus) issues.push(error("Scenarios", `${ctx} — missing maturityStatus`));
    if (!scenario.trigger?.description) issues.push(error("Scenarios", `${ctx} — missing trigger.description`));
    if (!scenario.trigger?.type) issues.push(error("Scenarios", `${ctx} — missing trigger.type`));
    if (!scenario.playbookId) issues.push(error("Scenarios", `${ctx} — missing playbookId`));

    // Decision and accountability
    if (!scenario.decision?.accountableRoleId) {
      issues.push(error("Scenarios", `${ctx} — missing decision.accountableRoleId`));
    }
    if (!scenario.decision?.decisionRequired) {
      issues.push(error("Scenarios", `${ctx} — missing decision.decisionRequired`));
    }
    if (!scenario.rolesConfig?.accountableRoleId) {
      issues.push(error("Scenarios", `${ctx} — missing rolesConfig.accountableRoleId`));
    }

    // Maturity value is valid
    if (!VALID_MATURITY_STATUSES.includes(scenario.maturityStatus)) {
      issues.push(error("Scenarios", `${ctx} — invalid maturityStatus: "${scenario.maturityStatus}"`));
    }

    // Operating system resolves
    if (scenario.operatingSystemId && !osIds.has(scenario.operatingSystemId)) {
      issues.push(error("Scenarios", `${ctx} — operatingSystemId "${scenario.operatingSystemId}" not found`));
    }
    if (scenario.secondaryOperatingSystemIds) {
      for (const sid of scenario.secondaryOperatingSystemIds) {
        if (!osIds.has(sid)) {
          issues.push(error("Scenarios", `${ctx} — secondaryOperatingSystemId "${sid}" not found`));
        }
      }
    }

    // Playbook resolves
    if (scenario.playbookId && !playbookIds.has(scenario.playbookId)) {
      issues.push(error("Scenarios", `${ctx} — playbookId "${scenario.playbookId}" not found`));
    }

    // Accountable role resolves
    if (scenario.rolesConfig?.accountableRoleId && !TRAVEL_ROLE_IDS.includes(scenario.rolesConfig.accountableRoleId)) {
      issues.push(error("Scenarios", `${ctx} — rolesConfig.accountableRoleId "${scenario.rolesConfig.accountableRoleId}" not in role register`));
    }
    if (scenario.decision?.accountableRoleId && !TRAVEL_ROLE_IDS.includes(scenario.decision.accountableRoleId)) {
      issues.push(error("Scenarios", `${ctx} — decision.accountableRoleId "${scenario.decision.accountableRoleId}" not in role register`));
    }

    // Supporting roles resolve
    for (const rid of (scenario.rolesConfig?.supportingRoleIds ?? [])) {
      if (!TRAVEL_ROLE_IDS.includes(rid)) {
        issues.push(error("Scenarios", `${ctx} — rolesConfig.supportingRoleIds includes unknown role: "${rid}"`));
      }
    }

    // Action step owners resolve
    for (const step of (scenario.actionSteps ?? [])) {
      if (!TRAVEL_ROLE_IDS.includes(step.ownerRoleId)) {
        issues.push(error("Scenarios", `${ctx} step ${step.step} — ownerRoleId "${step.ownerRoleId}" not in role register`));
      }
    }

    // Escalation roles resolve
    for (const esc of (scenario.escalation ?? [])) {
      if (!TRAVEL_ROLE_IDS.includes(esc.escalateToRoleId)) {
        issues.push(error("Scenarios", `${ctx} escalation — escalateToRoleId "${esc.escalateToRoleId}" not in role register`));
      }
    }

    // Evidence requirements — at least one required
    if (!scenario.evidenceRequirements || scenario.evidenceRequirements.length === 0) {
      issues.push(error("Scenarios", `${ctx} — no evidenceRequirements defined`));
    }
    for (const ev of (scenario.evidenceRequirements ?? [])) {
      if (ev.ownerRoleId && !TRAVEL_ROLE_IDS.includes(ev.ownerRoleId)) {
        issues.push(error("Scenarios", `${ctx} evidence "${ev.evidenceType}" — ownerRoleId "${ev.ownerRoleId}" not in role register`));
      }
    }

    // Outcomes — at least one required
    if (!scenario.outcomes || scenario.outcomes.length === 0) {
      issues.push(error("Scenarios", `${ctx} — no outcomes defined`));
    }
    for (const out of (scenario.outcomes ?? [])) {
      if (out.ownerRoleId && !TRAVEL_ROLE_IDS.includes(out.ownerRoleId)) {
        issues.push(error("Scenarios", `${ctx} outcome "${out.metric}" — ownerRoleId "${out.ownerRoleId}" not in role register`));
      }
    }

    // Learning config present
    if (!scenario.learningConfig?.reviewTrigger) {
      issues.push(error("Scenarios", `${ctx} — missing learningConfig.reviewTrigger`));
    }

    // Proof present
    if (!scenario.proof?.proofType) {
      issues.push(error("Scenarios", `${ctx} — missing proof.proofType`));
    }

    // Signal details present
    if (!scenario.signalDetails || scenario.signalDetails.length === 0) {
      issues.push(warning("Scenarios", `${ctx} — no signalDetails defined`));
    }
  }

  return issues;
}

// ── Playbook Validation ───────────────────────────────────────────────────────

function validatePlaybooks(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const osIds = new Set(TRAVEL_OPERATING_SYSTEMS.map(os => os.id));
  const playbookIdsSeen = new Set<string>();

  for (const pb of TRAVEL_PLAYBOOKS) {
    const ctx = `Playbook "${pb.id}"`;

    // Uniqueness
    if (playbookIdsSeen.has(pb.id)) {
      issues.push(error("Playbooks", `${ctx} — duplicate ID`));
    }
    playbookIdsSeen.add(pb.id);

    // Required fields
    if (!pb.name) issues.push(error("Playbooks", `${ctx} — missing name`));
    if (!pb.operatingSystemId) issues.push(error("Playbooks", `${ctx} — missing operatingSystemId`));
    if (!pb.summary) issues.push(error("Playbooks", `${ctx} — missing summary`));
    if (!pb.accountableRoleId) issues.push(error("Playbooks", `${ctx} — missing accountableRoleId`));

    // Maturity
    if (!VALID_MATURITY_STATUSES.includes(pb.maturityStatus)) {
      issues.push(error("Playbooks", `${ctx} — invalid maturityStatus: "${pb.maturityStatus}"`));
    }

    // OS resolves
    if (pb.operatingSystemId && !osIds.has(pb.operatingSystemId)) {
      issues.push(error("Playbooks", `${ctx} — operatingSystemId "${pb.operatingSystemId}" not found`));
    }

    // Accountable role resolves
    if (pb.accountableRoleId && !TRAVEL_ROLE_IDS.includes(pb.accountableRoleId)) {
      issues.push(error("Playbooks", `${ctx} — accountableRoleId "${pb.accountableRoleId}" not in role register`));
    }

    // Supporting roles resolve
    for (const rid of (pb.supportingRoleIds ?? [])) {
      if (!TRAVEL_ROLE_IDS.includes(rid)) {
        issues.push(error("Playbooks", `${ctx} — supportingRoleId "${rid}" not in role register`));
      }
    }

    // Steps must be ordered and have owners
    if (!pb.steps || pb.steps.length === 0) {
      issues.push(error("Playbooks", `${ctx} — no steps defined`));
    }
    const stepNumbers = pb.steps.map(s => s.step);
    const expectedStepNumbers = pb.steps.map((_, i) => i + 1);
    const stepsOrdered = stepNumbers.every((n, i) => n === expectedStepNumbers[i]);
    if (!stepsOrdered) {
      issues.push(error("Playbooks", `${ctx} — steps are not ordered sequentially starting from 1`));
    }
    for (const step of pb.steps) {
      if (!step.ownerRoleId) {
        issues.push(error("Playbooks", `${ctx} step ${step.step} — missing ownerRoleId`));
      } else if (!TRAVEL_ROLE_IDS.includes(step.ownerRoleId)) {
        issues.push(error("Playbooks", `${ctx} step ${step.step} — ownerRoleId "${step.ownerRoleId}" not in role register`));
      }
      if (!step.action) {
        issues.push(error("Playbooks", `${ctx} step ${step.step} — missing action`));
      }
      if (!step.timing) {
        issues.push(error("Playbooks", `${ctx} step ${step.step} — missing timing`));
      }
    }

    // Escalation roles resolve
    for (const rule of (pb.escalationRules ?? [])) {
      if (!TRAVEL_ROLE_IDS.includes(rule.escalateToRoleId)) {
        issues.push(error("Playbooks", `${ctx} escalation — escalateToRoleId "${rule.escalateToRoleId}" not in role register`));
      }
    }

    // Completion criteria present
    if (!pb.completionCriteria || pb.completionCriteria.length === 0) {
      issues.push(error("Playbooks", `${ctx} — no completionCriteria defined`));
    }

    // Evidence requirements present
    if (!pb.evidenceRequirements || pb.evidenceRequirements.length === 0) {
      issues.push(error("Playbooks", `${ctx} — no evidenceRequirements defined`));
    }
  }

  // Every canonical scenario's playbookId has a corresponding playbook
  const playbookIds = new Set(TRAVEL_PLAYBOOKS.map(p => p.id));
  for (const scenario of TRAVEL_SCENARIOS) {
    if (scenario.playbookId && !playbookIds.has(scenario.playbookId)) {
      issues.push(error("Playbooks", `Scenario "${scenario.id}" references playbookId "${scenario.playbookId}" which does not exist`));
    }
  }

  return issues;
}

// ── Role Validation ───────────────────────────────────────────────────────────

function validateRoles(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const roleIdsSeen = new Set<string>();
  const VALID_LEVELS = ["frontline", "manager", "property", "regional", "group", "partner"];

  for (const role of TRAVEL_ROLES) {
    const ctx = `Role "${role.id}"`;

    // Uniqueness
    if (roleIdsSeen.has(role.id)) {
      issues.push(error("Roles", `${ctx} — duplicate ID`));
    }
    roleIdsSeen.add(role.id);

    // Required fields
    if (!role.name) issues.push(error("Roles", `${ctx} — missing name`));
    if (!role.level || !VALID_LEVELS.includes(role.level)) {
      issues.push(error("Roles", `${ctx} — invalid or missing level: "${role.level}"`));
    }
    if (!role.responsibilities || role.responsibilities.length === 0) {
      issues.push(error("Roles", `${ctx} — no responsibilities defined`));
    }
    if (!role.decisionRights || role.decisionRights.length === 0) {
      issues.push(warning("Roles", `${ctx} — no decisionRights defined`));
    }
    if (!role.escalationRights || role.escalationRights.length === 0) {
      issues.push(warning("Roles", `${ctx} — no escalationRights defined`));
    }
    if (!role.evidenceResponsibilities || role.evidenceResponsibilities.length === 0) {
      issues.push(warning("Roles", `${ctx} — no evidenceResponsibilities defined`));
    }
    if (!role.communicationPermissions || role.communicationPermissions.length === 0) {
      issues.push(warning("Roles", `${ctx} — no communicationPermissions defined`));
    }
  }

  // Check for orphaned role IDs — roles referenced but not in the register
  const allReferencedRoleIds = new Set<string>();
  for (const scenario of TRAVEL_SCENARIOS) {
    if (scenario.rolesConfig?.accountableRoleId) allReferencedRoleIds.add(scenario.rolesConfig.accountableRoleId);
    for (const rid of (scenario.rolesConfig?.supportingRoleIds ?? [])) allReferencedRoleIds.add(rid);
    for (const rid of (scenario.rolesConfig?.informedRoleIds ?? [])) allReferencedRoleIds.add(rid);
    if (scenario.decision?.accountableRoleId) allReferencedRoleIds.add(scenario.decision.accountableRoleId);
    for (const step of (scenario.actionSteps ?? [])) allReferencedRoleIds.add(step.ownerRoleId);
    for (const esc of (scenario.escalation ?? [])) allReferencedRoleIds.add(esc.escalateToRoleId);
    for (const ev of (scenario.evidenceRequirements ?? [])) { if (ev.ownerRoleId) allReferencedRoleIds.add(ev.ownerRoleId); }
    for (const out of (scenario.outcomes ?? [])) { if (out.ownerRoleId) allReferencedRoleIds.add(out.ownerRoleId); }
  }
  for (const pb of TRAVEL_PLAYBOOKS) {
    allReferencedRoleIds.add(pb.accountableRoleId);
    for (const rid of pb.supportingRoleIds) allReferencedRoleIds.add(rid);
    for (const step of pb.steps) allReferencedRoleIds.add(step.ownerRoleId);
    for (const rule of pb.escalationRules) allReferencedRoleIds.add(rule.escalateToRoleId);
  }

  for (const refId of allReferencedRoleIds) {
    if (!roleIdsSeen.has(refId)) {
      issues.push(error("Roles", `Role ID "${refId}" is referenced but not in the role register`));
    }
  }

  return issues;
}

// ── Cross-Surface Consistency ──────────────────────────────────────────────────

function validateCrossSurface(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const osIds = new Set(TRAVEL_OPERATING_SYSTEMS.map(os => os.id));
  const playbookIds = new Set(TRAVEL_PLAYBOOKS.map(p => p.id));
  const scenarioIds = new Set(TRAVEL_SCENARIOS.map(s => s.id));

  // Every scenario's OS is consistent with the OS's position
  for (const scenario of TRAVEL_SCENARIOS) {
    const os = TRAVEL_OPERATING_SYSTEMS.find(o => o.id === scenario.operatingSystemId);
    if (os) {
      // "premium-guest-opportunity" should be on marketplace OS (expansion)
      if (scenario.id === "premium-guest-opportunity" && os.position !== "expansion") {
        issues.push(warning("CrossSurface", `Scenario "premium-guest-opportunity" is on "${scenario.operatingSystemId}" (position: ${os.position}) — expected expansion OS`));
      }
      // "distressed-guest" should be on cross-cutting OS
      if (scenario.id === "distressed-guest" && os.position !== "cross-cutting") {
        issues.push(warning("CrossSurface", `Scenario "distressed-guest" is on "${scenario.operatingSystemId}" (position: ${os.position}) — expected cross-cutting OS`));
      }
    }
  }

  // Playbook maturity and scenario maturity should be compatible
  for (const scenario of TRAVEL_SCENARIOS) {
    const pb = TRAVEL_PLAYBOOKS.find(p => p.id === scenario.playbookId);
    if (pb && pb.maturityStatus !== scenario.maturityStatus) {
      issues.push(warning("CrossSurface", `Scenario "${scenario.id}" maturity "${scenario.maturityStatus}" differs from linked playbook "${pb.id}" maturity "${pb.maturityStatus}"`));
    }
  }

  // Every OS's playbookIds resolve in TRAVEL_PLAYBOOKS
  for (const os of TRAVEL_OPERATING_SYSTEMS) {
    for (const pid of os.playbookIds) {
      if (!playbookIds.has(pid)) {
        issues.push(error("CrossSurface", `OS "${os.id}" references playbookId "${pid}" which does not exist`));
      }
    }
    for (const sid of os.scenarioIds) {
      if (!scenarioIds.has(sid)) {
        issues.push(error("CrossSurface", `OS "${os.id}" references scenarioId "${sid}" which does not exist`));
      }
    }
  }

  return issues;
}

// ── Main validation entry point ───────────────────────────────────────────────

export function validateSprint3(): ValidationResult {
  const issues: ValidationIssue[] = [
    ...validateOperatingSystems(),
    ...validateScenarios(),
    ...validatePlaybooks(),
    ...validateRoles(),
    ...validateCrossSurface(),
  ];

  const errors = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warning");

  return {
    passed: errors.length === 0,
    errorCount: errors.length,
    warningCount: warnings.length,
    issues,
  };
}

/** Print a human-readable validation report to the console. */
export function printValidationReport(result: ValidationResult): void {
  if (result.passed) {
    console.log(`✅ Sprint 3 validation passed — ${result.errorCount} errors, ${result.warningCount} warnings`);
  } else {
    console.error(`❌ Sprint 3 validation FAILED — ${result.errorCount} errors, ${result.warningCount} warnings`);
  }

  const byCategory: Record<string, ValidationIssue[]> = {};
  for (const issue of result.issues) {
    (byCategory[issue.category] ??= []).push(issue);
  }

  for (const [category, categoryIssues] of Object.entries(byCategory)) {
    console.log(`\n  [${category}]`);
    for (const issue of categoryIssues) {
      const prefix = issue.severity === "error" ? "  ✗" : "  ⚠";
      console.log(`${prefix} ${issue.message}`);
    }
  }
}
