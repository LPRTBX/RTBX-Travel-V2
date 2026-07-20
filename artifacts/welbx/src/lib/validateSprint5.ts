/**
 * validateSprint5.ts — Sprint 5
 *
 * Validates Sprint 5 data integrity:
 * - Partner ecosystem (lanes, ownership, maturity values)
 * - Pilot model (stages, scenarios, OS IDs, role IDs, success measures, readiness states)
 * - Commercial model (component status labels, unapproved flagging, integration ownership)
 * - Integration responsibility (ownership, maturity, proof status)
 *
 * Imports ValidationIssue and ValidationResult from validateSprint3.ts.
 * Exports validateSprint5() for use in tests and runtime validation.
 */

import type { ValidationIssue, ValidationResult } from "./validateSprint3";
import {
  TRAVEL_PARTNER_LANES,
  PARTNER_OWNERSHIP_MATRIX,
  VALID_PARTNER_LANE_IDS,
  VALID_PARTNER_MATURITY_STATUSES,
  RTBX_OWNED_CAPABILITIES,
  CUSTOMER_OWNED_CAPABILITIES,
  PARTNER_SELECTION_CRITERIA,
  PARTNERSHIP_PATHWAY_STAGES,
} from "../data/travelPartnerEcosystem";
import {
  PILOT_STAGES,
  PILOT_SCENARIOS,
  PILOT_OPERATING_SYSTEMS,
  PILOT_SUCCESS_MEASURES,
  READINESS_CHECKLIST,
  EXPANSION_STAGES,
  DEPLOYMENT_PACKAGE,
  VALID_READINESS_STATES,
  VALID_SUCCESS_MEASURE_TARGET_TYPES,
  PILOT_STAGE_IDS,
} from "../data/travelPilotModel";
import {
  COMMERCIAL_COMPONENTS,
  PARTNER_COMMERCIAL_MODELS,
  VALUE_FRAMEWORK,
  COMMERCIAL_PROOF_BOUNDARIES,
  VALID_COMMERCIAL_STATUSES,
  VALID_SOURCE_STATUSES,
  UNAPPROVED_STATUSES,
} from "../data/travelCommercialModel";
import {
  INTEGRATION_RECORDS,
  DEPLOYMENT_RESPONSIBILITIES,
  VALID_INTEGRATION_MATURITY_STATUSES,
  VALID_INTEGRATION_PROOF_STATUSES,
} from "../data/travelDeploymentPathway";
import { TRAVEL_SCENARIOS } from "../data/travelScenarios";
import { TRAVEL_OPERATING_SYSTEMS } from "../data/travelOperatingSystems";
import { TRAVEL_ROLE_IDS } from "../data/travelRoles";

// ── Helper ─────────────────────────────────────────────────────────────────────

function issue(category: string, severity: "error" | "warning", message: string): ValidationIssue {
  return { category, severity, message };
}

function buildResult(issues: ValidationIssue[]): ValidationResult {
  const errors   = issues.filter(i => i.severity === "error").length;
  const warnings = issues.filter(i => i.severity === "warning").length;
  return { passed: errors === 0, errorCount: errors, warningCount: warnings, issues };
}

// ── Partner ecosystem validation ──────────────────────────────────────────────

function validatePartnerEcosystem(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Six lanes required
  if (TRAVEL_PARTNER_LANES.length !== 6) {
    issues.push(issue("Partner Ecosystem", "error", `Expected 6 partner lanes, found ${TRAVEL_PARTNER_LANES.length}`));
  }

  const requiredLaneIds = [
    "signal-partners", "governance-partners", "intervention-partners",
    "technology-partners", "deployment-partners", "distribution-partners",
  ];
  for (const id of requiredLaneIds) {
    if (!VALID_PARTNER_LANE_IDS.includes(id)) {
      issues.push(issue("Partner Ecosystem", "error", `Required partner lane missing: "${id}"`));
    }
  }

  // Each lane must define contributions
  for (const lane of TRAVEL_PARTNER_LANES) {
    if (lane.partnerContribution.length === 0) {
      issues.push(issue("Partner Ecosystem", "error", `Lane "${lane.id}" has no partnerContribution items`));
    }
    if (lane.rtbxContribution.length === 0) {
      issues.push(issue("Partner Ecosystem", "error", `Lane "${lane.id}" has no rtbxContribution items`));
    }
    if (lane.customerContribution.length === 0) {
      issues.push(issue("Partner Ecosystem", "error", `Lane "${lane.id}" has no customerContribution items`));
    }

    // Maturity values must be valid
    if (!VALID_PARTNER_MATURITY_STATUSES.includes(lane.maturityStatus)) {
      issues.push(issue("Partner Ecosystem", "error", `Lane "${lane.id}" has invalid maturity status: "${lane.maturityStatus}"`));
    }

    // No lane should claim "production" maturity unless explicitly verified
    if (lane.maturityStatus === "production") {
      issues.push(issue("Partner Ecosystem", "warning", `Lane "${lane.id}" claims production maturity — verify this is accurate`));
    }

    // Must have a maturity note
    if (!lane.maturityNote || lane.maturityNote.trim().length < 10) {
      issues.push(issue("Partner Ecosystem", "warning", `Lane "${lane.id}" has an insufficient maturityNote`));
    }
  }

  // Ownership matrix must have 6 rows (one per lane)
  if (PARTNER_OWNERSHIP_MATRIX.length !== 6) {
    issues.push(issue("Partner Ecosystem", "error", `Expected 6 ownership matrix rows, found ${PARTNER_OWNERSHIP_MATRIX.length}`));
  }

  // Each ownership row must have all three columns
  for (const row of PARTNER_OWNERSHIP_MATRIX) {
    if (!row.partnerOwns) issues.push(issue("Partner Ecosystem", "error", `Ownership matrix row "${row.partnerType}" missing partnerOwns`));
    if (!row.rtbxOwns)    issues.push(issue("Partner Ecosystem", "error", `Ownership matrix row "${row.partnerType}" missing rtbxOwns`));
    if (!row.customerOwns) issues.push(issue("Partner Ecosystem", "error", `Ownership matrix row "${row.partnerType}" missing customerOwns`));
  }

  // RTBX ownership list must be non-empty
  if (RTBX_OWNED_CAPABILITIES.length === 0) {
    issues.push(issue("Partner Ecosystem", "error", "RTBX_OWNED_CAPABILITIES is empty"));
  }

  // Customer ownership list must be non-empty
  if (CUSTOMER_OWNED_CAPABILITIES.length === 0) {
    issues.push(issue("Partner Ecosystem", "error", "CUSTOMER_OWNED_CAPABILITIES is empty"));
  }

  // Selection criteria must have 4 categories
  if (PARTNER_SELECTION_CRITERIA.length < 4) {
    issues.push(issue("Partner Ecosystem", "error", `Expected at least 4 partner selection categories, found ${PARTNER_SELECTION_CRITERIA.length}`));
  }

  // Partnership pathway stages must be present
  if (PARTNERSHIP_PATHWAY_STAGES.length === 0) {
    issues.push(issue("Partner Ecosystem", "error", "PARTNERSHIP_PATHWAY_STAGES is empty"));
  }

  return issues;
}

// ── Pilot model validation ─────────────────────────────────────────────────────

function validatePilotModel(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Seven stages required (Explore → Expand)
  const requiredStageIds = ["explore", "align", "configure", "pilot", "prove", "deploy", "expand"];
  if (PILOT_STAGES.length !== 7) {
    issues.push(issue("Pilot Model", "error", `Expected 7 pilot stages, found ${PILOT_STAGES.length}`));
  }
  for (const id of requiredStageIds) {
    if (!PILOT_STAGE_IDS.includes(id)) {
      issues.push(issue("Pilot Model", "error", `Required pilot stage missing: "${id}"`));
    }
  }

  // Each stage must have activities, outputs, ownerGroups, readinessRequirements
  for (const stage of PILOT_STAGES) {
    if (stage.activities.length === 0) issues.push(issue("Pilot Model", "error", `Stage "${stage.id}" has no activities`));
    if (stage.outputs.length === 0)    issues.push(issue("Pilot Model", "error", `Stage "${stage.id}" has no outputs`));
    if (stage.ownerGroups.length === 0) issues.push(issue("Pilot Model", "warning", `Stage "${stage.id}" has no ownerGroups`));
  }

  // Pilot scenarios reference valid scenario IDs
  const scenarioIds = new Set(TRAVEL_SCENARIOS.map(s => s.id));
  for (const ps of PILOT_SCENARIOS) {
    if (!scenarioIds.has(ps.scenarioId)) {
      issues.push(issue("Pilot Model", "error", `Pilot scenario "${ps.scenarioId}" does not resolve in TRAVEL_SCENARIOS`));
    }
  }

  // Three primary scenarios required
  const primaryCount = PILOT_SCENARIOS.filter(ps => ps.role === "primary").length;
  if (primaryCount < 3) {
    issues.push(issue("Pilot Model", "error", `Expected at least 3 primary pilot scenarios, found ${primaryCount}`));
  }

  // Pilot OS IDs reference valid operating system IDs
  const osIds = new Set(TRAVEL_OPERATING_SYSTEMS.map(o => o.id));
  for (const pos of PILOT_OPERATING_SYSTEMS) {
    if (!osIds.has(pos.id)) {
      issues.push(issue("Pilot Model", "error", `Pilot OS "${pos.id}" does not resolve in TRAVEL_OPERATING_SYSTEMS`));
    }
  }

  // Marketplace/Loyalty must be expansion-only
  const marketplace = PILOT_OPERATING_SYSTEMS.find(o => o.id === "marketplace-loyalty-activation-os");
  if (!marketplace) {
    issues.push(issue("Pilot Model", "error", "marketplace-loyalty-activation-os is not listed in PILOT_OPERATING_SYSTEMS"));
  } else if (marketplace.role !== "expansion-only") {
    issues.push(issue("Pilot Model", "error", `marketplace-loyalty-activation-os must have role "expansion-only", found "${marketplace.role}"`));
  }

  // Success measures use approved target types
  for (const m of PILOT_SUCCESS_MEASURES) {
    if (!VALID_SUCCESS_MEASURE_TARGET_TYPES.includes(m.targetType)) {
      issues.push(issue("Pilot Model", "error", `Success measure "${m.id}" has invalid targetType: "${m.targetType}"`));
    }
  }

  // Success measure categories must include all required categories
  const measureCategories = new Set(PILOT_SUCCESS_MEASURES.map(m => m.category));
  for (const cat of ["Operational", "Guest", "Staff", "Governance", "Value"]) {
    if (!measureCategories.has(cat)) {
      issues.push(issue("Pilot Model", "error", `Success measures missing category: "${cat}"`));
    }
  }

  // Readiness states must be valid
  for (const item of READINESS_CHECKLIST) {
    if (!VALID_READINESS_STATES.includes(item.defaultState)) {
      issues.push(issue("Pilot Model", "error", `Readiness item "${item.id}" has invalid defaultState: "${item.defaultState}"`));
    }
  }

  // Readiness categories must include all required categories
  const readinessCategories = new Set(READINESS_CHECKLIST.map(i => i.category));
  for (const cat of ["Customer", "Technical", "Operational", "Measurement"]) {
    if (!readinessCategories.has(cat)) {
      issues.push(issue("Pilot Model", "error", `Readiness checklist missing category: "${cat}"`));
    }
  }

  // Expansion stages must be present
  if (EXPANSION_STAGES.length < 7) {
    issues.push(issue("Pilot Model", "error", `Expected at least 7 expansion stages, found ${EXPANSION_STAGES.length}`));
  }

  // Deployment package must include production package
  const hasProduction = DEPLOYMENT_PACKAGE.some(p => p.productionOnly);
  if (!hasProduction) {
    issues.push(issue("Pilot Model", "error", "Deployment package must include a production-only section"));
  }

  return issues;
}

// ── Commercial model validation ───────────────────────────────────────────────

function validateCommercialModel(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // All commercial components use approved status labels
  for (const comp of COMMERCIAL_COMPONENTS) {
    if (!VALID_COMMERCIAL_STATUSES.includes(comp.status)) {
      issues.push(issue("Commercial Model", "error", `Component "${comp.id}" has invalid status: "${comp.status}"`));
    }
    if (!VALID_SOURCE_STATUSES.includes(comp.sourceStatus)) {
      issues.push(issue("Commercial Model", "error", `Component "${comp.id}" has invalid sourceStatus: "${comp.sourceStatus}"`));
    }

    // Unapproved components must not be marked as mandatory (type-level check)
    if (comp.mandatory !== false) {
      issues.push(issue("Commercial Model", "error", `Component "${comp.id}" must have mandatory: false`));
    }

    // Figures labelled "approved" must have a note explaining what is approved
    if (comp.status === "approved" && !comp.note) {
      issues.push(issue("Commercial Model", "warning", `Component "${comp.id}" is labelled approved but has no supporting note`));
    }
  }

  // Partner commercial models must be present
  if (PARTNER_COMMERCIAL_MODELS.length === 0) {
    issues.push(issue("Commercial Model", "error", "PARTNER_COMMERCIAL_MODELS is empty"));
  }

  // Each partner commercial model must have a statusNote
  for (const model of PARTNER_COMMERCIAL_MODELS) {
    if (!model.statusNote || model.statusNote.trim().length < 5) {
      issues.push(issue("Commercial Model", "error", `Partner commercial model "${model.id}" has insufficient statusNote`));
    }
    if (model.potentialModels.length === 0) {
      issues.push(issue("Commercial Model", "error", `Partner commercial model "${model.id}" has no potentialModels`));
    }
  }

  // Value framework categories
  for (const cat of VALUE_FRAMEWORK) {
    if (cat.items.length === 0) {
      issues.push(issue("Commercial Model", "error", `Value framework category "${cat.id}" has no items`));
    }
    for (const item of cat.items) {
      if (!VALID_SOURCE_STATUSES.includes(item.targetStatus)) {
        issues.push(issue("Commercial Model", "error", `Value framework item "${item.id}" has invalid targetStatus: "${item.targetStatus}"`));
      }
    }
  }

  // Proof boundaries must include all four categories
  const requiredBoundaries = ["demonstrated", "architecturally-defined", "pilot-dependent", "production-engineering-required"];
  const boundaryIds = COMMERCIAL_PROOF_BOUNDARIES.map(b => b.id);
  for (const req of requiredBoundaries) {
    if (!boundaryIds.includes(req)) {
      issues.push(issue("Commercial Model", "error", `Commercial proof boundary missing: "${req}"`));
    }
  }

  return issues;
}

// ── Integration responsibility validation ─────────────────────────────────────

function validateIntegrationResponsibility(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (INTEGRATION_RECORDS.length === 0) {
    issues.push(issue("Integration Responsibility", "error", "INTEGRATION_RECORDS is empty"));
    return issues;
  }

  for (const rec of INTEGRATION_RECORDS) {
    // Every integration must have ownership
    if (!rec.authenticationOwner) issues.push(issue("Integration Responsibility", "error", `Integration "${rec.id}" missing authenticationOwner`));
    if (!rec.mappingOwner)         issues.push(issue("Integration Responsibility", "error", `Integration "${rec.id}" missing mappingOwner`));
    if (!rec.rtbxResponsibility)   issues.push(issue("Integration Responsibility", "error", `Integration "${rec.id}" missing rtbxResponsibility`));
    if (!rec.customerResponsibility) issues.push(issue("Integration Responsibility", "error", `Integration "${rec.id}" missing customerResponsibility`));
    if (!rec.failureOwner)         issues.push(issue("Integration Responsibility", "error", `Integration "${rec.id}" missing failureOwner`));

    // Every integration must have maturity
    if (!VALID_INTEGRATION_MATURITY_STATUSES.includes(rec.maturity)) {
      issues.push(issue("Integration Responsibility", "error", `Integration "${rec.id}" has invalid maturity: "${rec.maturity}"`));
    }

    // Every integration must have proof status
    if (!VALID_INTEGRATION_PROOF_STATUSES.includes(rec.proof)) {
      issues.push(issue("Integration Responsibility", "error", `Integration "${rec.id}" has invalid proof: "${rec.proof}"`));
    }

    // Connector-ready claims must not be used (not in VALID_INTEGRATION_MATURITY_STATUSES)
    // This is enforced by type — but double-check via string
    if ((rec.maturity as string) === "connector-ready") {
      issues.push(issue("Integration Responsibility", "error", `Integration "${rec.id}" uses "connector-ready" which is not in the approved maturity list`));
    }

    // Production maturity must have proof
    if (rec.maturity === "production" && rec.proof === "none") {
      issues.push(issue("Integration Responsibility", "error", `Integration "${rec.id}" claims production maturity but has no proof`));
    }
  }

  // Deployment responsibility matrix must cover required activities
  const requiredActivities = ["dep-discovery", "dep-system-access", "dep-governance-approval", "dep-configuration", "dep-integration", "dep-testing", "dep-training", "dep-operational-activation", "dep-support", "dep-evidence-review", "dep-outcome-review", "dep-expansion"];
  const activityIds = new Set(DEPLOYMENT_RESPONSIBILITIES.map(a => a.id));
  for (const id of requiredActivities) {
    if (!activityIds.has(id)) {
      issues.push(issue("Integration Responsibility", "error", `Deployment responsibility missing activity: "${id}"`));
    }
  }

  return issues;
}

// ── Main validator ─────────────────────────────────────────────────────────────

export function validateSprint5(): ValidationResult {
  const allIssues: ValidationIssue[] = [
    ...validatePartnerEcosystem(),
    ...validatePilotModel(),
    ...validateCommercialModel(),
    ...validateIntegrationResponsibility(),
  ];
  return buildResult(allIssues);
}

// Re-export for test convenience
export { TRAVEL_PARTNER_LANES, VALID_PARTNER_LANE_IDS, VALID_PARTNER_MATURITY_STATUSES };
export { PILOT_STAGES, PILOT_SCENARIOS, PILOT_OPERATING_SYSTEMS, PILOT_SUCCESS_MEASURES, READINESS_CHECKLIST };
export { COMMERCIAL_COMPONENTS, PARTNER_COMMERCIAL_MODELS, VALID_COMMERCIAL_STATUSES };
export { INTEGRATION_RECORDS, DEPLOYMENT_RESPONSIBILITIES };
