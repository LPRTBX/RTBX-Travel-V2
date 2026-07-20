/**
 * validateSprint5.test.ts — Sprint 5
 *
 * Tests for Sprint 5 data integrity validation.
 * Covers partner ecosystem, pilot model, commercial model and integration responsibility.
 */

import { describe, it, expect } from "vitest";
import { validateSprint5 } from "./validateSprint5";
import {
  TRAVEL_PARTNER_LANES,
  VALID_PARTNER_MATURITY_STATUSES,
  RTBX_OWNED_CAPABILITIES,
  CUSTOMER_OWNED_CAPABILITIES,
  PARTNER_OWNERSHIP_MATRIX,
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
  UNAPPROVED_STATUSES,
  COMMERCIAL_STATUS_LABELS,
} from "../data/travelCommercialModel";
import {
  INTEGRATION_RECORDS,
  DEPLOYMENT_RESPONSIBILITIES,
  VALID_INTEGRATION_MATURITY_STATUSES,
  VALID_INTEGRATION_PROOF_STATUSES,
} from "../data/travelDeploymentPathway";
import { TRAVEL_SCENARIOS } from "../data/travelScenarios";
import { TRAVEL_OPERATING_SYSTEMS } from "../data/travelOperatingSystems";

// ── Master validation ─────────────────────────────────────────────────────────

describe("Sprint 5 Data Integrity", () => {
  it("passes all validation checks with zero errors", () => {
    const result = validateSprint5();
    if (!result.passed) {
      for (const issue of result.issues.filter(i => i.severity === "error")) {
        console.error(`✗ [${issue.category}] ${issue.message}`);
      }
    }
    expect(result.errorCount).toBe(0);
  });
});

// ── Partner ecosystem ─────────────────────────────────────────────────────────

describe("Partner Ecosystem — six lanes", () => {
  it("has exactly 6 partner lanes", () => {
    expect(TRAVEL_PARTNER_LANES.length).toBe(6);
  });

  it("includes all required lane IDs", () => {
    const ids = TRAVEL_PARTNER_LANES.map(l => l.id);
    expect(ids).toContain("signal-partners");
    expect(ids).toContain("governance-partners");
    expect(ids).toContain("intervention-partners");
    expect(ids).toContain("technology-partners");
    expect(ids).toContain("deployment-partners");
    expect(ids).toContain("distribution-partners");
  });

  it("each lane has partnerContribution items", () => {
    for (const lane of TRAVEL_PARTNER_LANES) {
      expect(lane.partnerContribution.length).toBeGreaterThan(0);
    }
  });

  it("each lane has rtbxContribution items", () => {
    for (const lane of TRAVEL_PARTNER_LANES) {
      expect(lane.rtbxContribution.length).toBeGreaterThan(0);
    }
  });

  it("each lane has customerContribution items", () => {
    for (const lane of TRAVEL_PARTNER_LANES) {
      expect(lane.customerContribution.length).toBeGreaterThan(0);
    }
  });

  it("each lane has a valid maturity status", () => {
    for (const lane of TRAVEL_PARTNER_LANES) {
      expect(VALID_PARTNER_MATURITY_STATUSES).toContain(lane.maturityStatus);
    }
  });

  it("no lane claims production maturity (no confirmed partnerships)", () => {
    for (const lane of TRAVEL_PARTNER_LANES) {
      expect(lane.maturityStatus).not.toBe("production");
    }
  });

  it("each lane has a non-trivial maturityNote", () => {
    for (const lane of TRAVEL_PARTNER_LANES) {
      expect(lane.maturityNote.trim().length).toBeGreaterThan(20);
    }
  });

  it("each lane has at least one commercial model option", () => {
    for (const lane of TRAVEL_PARTNER_LANES) {
      expect(lane.commercialModels.length).toBeGreaterThan(0);
    }
  });
});

describe("Partner Ecosystem — ownership boundaries", () => {
  it("ownership matrix has 6 rows", () => {
    expect(PARTNER_OWNERSHIP_MATRIX.length).toBe(6);
  });

  it("each ownership row has partnerOwns, rtbxOwns and customerOwns", () => {
    for (const row of PARTNER_OWNERSHIP_MATRIX) {
      expect(row.partnerOwns).toBeTruthy();
      expect(row.rtbxOwns).toBeTruthy();
      expect(row.customerOwns).toBeTruthy();
    }
  });

  it("RTBX owns at least 10 capabilities", () => {
    expect(RTBX_OWNED_CAPABILITIES.length).toBeGreaterThanOrEqual(10);
  });

  it("Customer owns at least 10 capabilities", () => {
    expect(CUSTOMER_OWNED_CAPABILITIES.length).toBeGreaterThanOrEqual(10);
  });

  it("Intelligence Engine is in RTBX owned capabilities", () => {
    expect(RTBX_OWNED_CAPABILITIES.some(c => c.includes("Intelligence Engine"))).toBe(true);
  });

  it("Customer data is in customer owned capabilities", () => {
    expect(CUSTOMER_OWNED_CAPABILITIES.some(c => c.toLowerCase().includes("customer data") || c.toLowerCase().includes("data"))).toBe(true);
  });
});

describe("Partner Ecosystem — selection criteria and pathway", () => {
  it("has at least 4 selection criteria categories", () => {
    expect(PARTNER_SELECTION_CRITERIA.length).toBeGreaterThanOrEqual(4);
  });

  it("each selection category has criteria items", () => {
    for (const cat of PARTNER_SELECTION_CRITERIA) {
      expect(cat.criteria.length).toBeGreaterThan(0);
    }
  });

  it("includes strategic, technical, governance and commercial fit categories", () => {
    const ids = PARTNER_SELECTION_CRITERIA.map(c => c.id);
    expect(ids).toContain("strategic-fit");
    expect(ids).toContain("technical-fit");
    expect(ids).toContain("governance-fit");
    expect(ids).toContain("commercial-fit");
  });

  it("partnership pathway has stages", () => {
    expect(PARTNERSHIP_PATHWAY_STAGES.length).toBeGreaterThan(0);
  });

  it("partnership pathway stages include identify and expand", () => {
    const ids = PARTNERSHIP_PATHWAY_STAGES.map(s => s.id);
    expect(ids).toContain("identify");
    expect(ids).toContain("expand");
  });
});

// ── Pilot model ───────────────────────────────────────────────────────────────

describe("Pilot Model — seven stages", () => {
  it("has exactly 7 pilot stages", () => {
    expect(PILOT_STAGES.length).toBe(7);
  });

  it("includes all required stage IDs (Explore → Expand)", () => {
    const required = ["explore", "align", "configure", "pilot", "prove", "deploy", "expand"];
    for (const id of required) {
      expect(PILOT_STAGE_IDS).toContain(id);
    }
  });

  it("each stage has activities and outputs", () => {
    for (const stage of PILOT_STAGES) {
      expect(stage.activities.length).toBeGreaterThan(0);
      expect(stage.outputs.length).toBeGreaterThan(0);
    }
  });

  it("each stage has a purpose statement", () => {
    for (const stage of PILOT_STAGES) {
      expect(stage.purpose.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Pilot Model — scenarios", () => {
  it("has at least 3 primary scenarios", () => {
    const primary = PILOT_SCENARIOS.filter(ps => ps.role === "primary");
    expect(primary.length).toBeGreaterThanOrEqual(3);
  });

  it("all pilot scenario IDs resolve in TRAVEL_SCENARIOS", () => {
    const ids = new Set(TRAVEL_SCENARIOS.map(s => s.id));
    for (const ps of PILOT_SCENARIOS) {
      expect(ids.has(ps.scenarioId)).toBe(true);
    }
  });

  it("includes repeat-guest-room-not-ready as primary", () => {
    const sc = PILOT_SCENARIOS.find(ps => ps.scenarioId === "repeat-guest-room-not-ready");
    expect(sc).toBeDefined();
    expect(sc?.role).toBe("primary");
  });

  it("includes service-backlog as primary", () => {
    const sc = PILOT_SCENARIOS.find(ps => ps.scenarioId === "service-backlog");
    expect(sc).toBeDefined();
    expect(sc?.role).toBe("primary");
  });

  it("includes maintenance-defect as primary", () => {
    const sc = PILOT_SCENARIOS.find(ps => ps.scenarioId === "maintenance-defect");
    expect(sc).toBeDefined();
    expect(sc?.role).toBe("primary");
  });
});

describe("Pilot Model — operating systems", () => {
  it("all pilot OS IDs resolve in TRAVEL_OPERATING_SYSTEMS", () => {
    const ids = new Set(TRAVEL_OPERATING_SYSTEMS.map(o => o.id));
    for (const pos of PILOT_OPERATING_SYSTEMS) {
      expect(ids.has(pos.id)).toBe(true);
    }
  });

  it("marketplace-loyalty-activation-os is expansion-only in the pilot", () => {
    const mp = PILOT_OPERATING_SYSTEMS.find(o => o.id === "marketplace-loyalty-activation-os");
    expect(mp).toBeDefined();
    expect(mp?.role).toBe("expansion-only");
  });

  it("guest-experience-os is a primary-wedge OS", () => {
    const os = PILOT_OPERATING_SYSTEMS.find(o => o.id === "guest-experience-os");
    expect(os?.role).toBe("primary-wedge");
  });

  it("service-recovery-staff-response-os is a primary-wedge OS", () => {
    const os = PILOT_OPERATING_SYSTEMS.find(o => o.id === "service-recovery-staff-response-os");
    expect(os?.role).toBe("primary-wedge");
  });

  it("safety-guest-welfare-os is a cross-cutting-control OS", () => {
    const os = PILOT_OPERATING_SYSTEMS.find(o => o.id === "safety-guest-welfare-os");
    expect(os?.role).toBe("cross-cutting-control");
  });
});

describe("Pilot Model — success framework", () => {
  it("has success measures for all required categories", () => {
    const cats = new Set(PILOT_SUCCESS_MEASURES.map(m => m.category));
    expect(cats.has("Operational")).toBe(true);
    expect(cats.has("Guest")).toBe(true);
    expect(cats.has("Staff")).toBe(true);
    expect(cats.has("Governance")).toBe(true);
    expect(cats.has("Value")).toBe(true);
  });

  it("all success measures use approved target types", () => {
    for (const m of PILOT_SUCCESS_MEASURES) {
      expect(VALID_SUCCESS_MEASURE_TARGET_TYPES).toContain(m.targetType);
    }
  });

  it("no success measure invents a result (no customer-provided targetType without a note)", () => {
    // All financial/revenue measures should not be customer-provided without qualification
    const revenueMeasure = PILOT_SUCCESS_MEASURES.find(m => m.id === "sm-revenue-attr");
    if (revenueMeasure) {
      expect(revenueMeasure.targetType).toBe("not-yet-measured");
      expect(revenueMeasure.note).toBeTruthy();
    }
  });
});

describe("Pilot Model — readiness checklist", () => {
  it("has readiness items for all required categories", () => {
    const cats = new Set(READINESS_CHECKLIST.map(i => i.category));
    expect(cats.has("Customer")).toBe(true);
    expect(cats.has("Technical")).toBe(true);
    expect(cats.has("Operational")).toBe(true);
    expect(cats.has("Measurement")).toBe(true);
  });

  it("all readiness items have valid defaultState values", () => {
    for (const item of READINESS_CHECKLIST) {
      expect(VALID_READINESS_STATES).toContain(item.defaultState);
    }
  });

  it("security requirements readiness is production-engineering by default", () => {
    const secReq = READINESS_CHECKLIST.find(i => i.id === "rt-security-req");
    expect(secReq).toBeDefined();
    expect(secReq?.defaultState).toBe("requires-production-engineering");
  });
});

describe("Pilot Model — expansion and deployment package", () => {
  it("has at least 7 expansion stages", () => {
    expect(EXPANSION_STAGES.length).toBeGreaterThanOrEqual(7);
  });

  it("expansion stages have a maturityGate", () => {
    for (const stage of EXPANSION_STAGES) {
      expect(stage.maturityGate.trim().length).toBeGreaterThan(0);
    }
  });

  it("deployment package includes a production-only section", () => {
    const prod = DEPLOYMENT_PACKAGE.find(p => p.productionOnly);
    expect(prod).toBeDefined();
    expect(prod?.items.length).toBeGreaterThan(0);
  });

  it("deployment package production section has a productionNote", () => {
    const prod = DEPLOYMENT_PACKAGE.find(p => p.productionOnly);
    expect(prod?.productionNote).toBeTruthy();
  });
});

// ── Commercial model ──────────────────────────────────────────────────────────

describe("Commercial Model — components", () => {
  it("has commercial components", () => {
    expect(COMMERCIAL_COMPONENTS.length).toBeGreaterThan(0);
  });

  it("all components use approved status labels", () => {
    for (const comp of COMMERCIAL_COMPONENTS) {
      expect(VALID_COMMERCIAL_STATUSES).toContain(comp.status);
    }
  });

  it("all components have mandatory: false", () => {
    for (const comp of COMMERCIAL_COMPONENTS) {
      expect(comp.mandatory).toBe(false);
    }
  });

  it("unapproved components have a warning note", () => {
    const unapproved = COMMERCIAL_COMPONENTS.filter(c => UNAPPROVED_STATUSES.includes(c.status));
    for (const comp of unapproved) {
      expect(comp.note).toBeTruthy();
    }
  });

  it("COMMERCIAL_STATUS_LABELS covers all valid statuses", () => {
    for (const status of VALID_COMMERCIAL_STATUSES) {
      expect(COMMERCIAL_STATUS_LABELS[status]).toBeTruthy();
    }
  });

  it("transaction/revenue-share is not presented as a default component", () => {
    const revShare = COMMERCIAL_COMPONENTS.find(c => c.id === "cc-transaction-revenue-share");
    expect(revShare).toBeDefined();
    // Must be unapproved
    expect(UNAPPROVED_STATUSES).toContain(revShare!.status);
    // Must have a clear note
    expect(revShare!.note).toBeTruthy();
  });
});

describe("Commercial Model — partner commercial models", () => {
  it("has partner commercial models", () => {
    expect(PARTNER_COMMERCIAL_MODELS.length).toBeGreaterThan(0);
  });

  it("each model has a statusNote", () => {
    for (const model of PARTNER_COMMERCIAL_MODELS) {
      expect(model.statusNote.trim().length).toBeGreaterThan(5);
    }
  });

  it("each model has potential model options", () => {
    for (const model of PARTNER_COMMERCIAL_MODELS) {
      expect(model.potentialModels.length).toBeGreaterThan(0);
    }
  });

  it("referral model does not claim exclusivity", () => {
    const referral = PARTNER_COMMERCIAL_MODELS.find(m => m.id === "referral");
    expect(referral).toBeDefined();
    // Status note should indicate subject to agreement
    expect(referral!.statusNote.toLowerCase()).toContain("agreement");
  });

  it("reseller model does not imply exclusivity", () => {
    const reseller = PARTNER_COMMERCIAL_MODELS.find(m => m.id === "reseller");
    expect(reseller).toBeDefined();
    expect(reseller!.statusNote.toLowerCase()).not.toContain("exclusive");
  });
});

describe("Commercial Model — value framework", () => {
  it("has value framework categories", () => {
    expect(VALUE_FRAMEWORK.length).toBeGreaterThan(0);
  });

  it("each category has value items", () => {
    for (const cat of VALUE_FRAMEWORK) {
      expect(cat.items.length).toBeGreaterThan(0);
    }
  });

  it("all value items have an evidence source", () => {
    for (const cat of VALUE_FRAMEWORK) {
      for (const item of cat.items) {
        expect(item.evidenceSource.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("all value items have an outcome metric", () => {
    for (const cat of VALUE_FRAMEWORK) {
      for (const item of cat.items) {
        expect(item.outcomeMetric.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("attributable activation item is marked unapproved", () => {
    const activation = VALUE_FRAMEWORK.flatMap(c => c.items).find(i => i.id === "vf-activation");
    expect(activation).toBeDefined();
    expect(activation!.targetStatus).toBe("unapproved");
  });
});

describe("Commercial Model — proof boundaries", () => {
  it("has all four required proof boundary categories", () => {
    const ids = COMMERCIAL_PROOF_BOUNDARIES.map(b => b.id);
    expect(ids).toContain("demonstrated");
    expect(ids).toContain("architecturally-defined");
    expect(ids).toContain("pilot-dependent");
    expect(ids).toContain("production-engineering-required");
  });

  it("each boundary category has items", () => {
    for (const cat of COMMERCIAL_PROOF_BOUNDARIES) {
      expect(cat.items.length).toBeGreaterThan(0);
    }
  });

  it("production integrations are in production-engineering-required", () => {
    const prodCat = COMMERCIAL_PROOF_BOUNDARIES.find(b => b.id === "production-engineering-required");
    expect(prodCat).toBeDefined();
    expect(prodCat!.items.some(i => i.toLowerCase().includes("integration"))).toBe(true);
  });
});

// ── Integration responsibility ─────────────────────────────────────────────────

describe("Integration Responsibility — records", () => {
  it("has integration records", () => {
    expect(INTEGRATION_RECORDS.length).toBeGreaterThan(0);
  });

  it("all integration maturity values are valid", () => {
    for (const rec of INTEGRATION_RECORDS) {
      expect(VALID_INTEGRATION_MATURITY_STATUSES).toContain(rec.maturity);
    }
  });

  it("no integration uses connector-ready maturity", () => {
    for (const rec of INTEGRATION_RECORDS) {
      expect(rec.maturity).not.toBe("connector-ready");
    }
  });

  it("all integration proof statuses are valid", () => {
    for (const rec of INTEGRATION_RECORDS) {
      expect(VALID_INTEGRATION_PROOF_STATUSES).toContain(rec.proof);
    }
  });

  it("every integration has authentication ownership", () => {
    for (const rec of INTEGRATION_RECORDS) {
      expect(rec.authenticationOwner.trim().length).toBeGreaterThan(0);
    }
  });

  it("every integration has RTBX responsibility defined", () => {
    for (const rec of INTEGRATION_RECORDS) {
      expect(rec.rtbxResponsibility.trim().length).toBeGreaterThan(0);
    }
  });

  it("every integration has customer responsibility defined", () => {
    for (const rec of INTEGRATION_RECORDS) {
      expect(rec.customerResponsibility.trim().length).toBeGreaterThan(0);
    }
  });

  it("every integration has a failure owner", () => {
    for (const rec of INTEGRATION_RECORDS) {
      expect(rec.failureOwner.trim().length).toBeGreaterThan(0);
    }
  });

  it("PMS integration exists and is not production maturity", () => {
    const pms = INTEGRATION_RECORDS.find(r => r.id === "int-pms");
    expect(pms).toBeDefined();
    expect(pms!.maturity).not.toBe("production");
  });

  it("IoT integration is planned (not connected)", () => {
    const iot = INTEGRATION_RECORDS.find(r => r.id === "int-iot-sensors");
    expect(iot).toBeDefined();
    expect(iot!.maturity).toBe("planned");
    expect(iot!.proof).toBe("none");
  });

  it("no production integration has proof of none", () => {
    const prodWithNoProof = INTEGRATION_RECORDS.filter(r => r.maturity === "production" && r.proof === "none");
    expect(prodWithNoProof.length).toBe(0);
  });
});

describe("Integration Responsibility — deployment matrix", () => {
  it("deployment responsibilities matrix has entries", () => {
    expect(DEPLOYMENT_RESPONSIBILITIES.length).toBeGreaterThan(0);
  });

  it("covers all required deployment activities", () => {
    const ids = new Set(DEPLOYMENT_RESPONSIBILITIES.map(a => a.id));
    for (const id of ["dep-discovery", "dep-configuration", "dep-integration", "dep-testing", "dep-training", "dep-support", "dep-expansion"]) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("every activity has RTBX responsibility defined", () => {
    for (const act of DEPLOYMENT_RESPONSIBILITIES) {
      expect(act.rtbx.trim().length).toBeGreaterThan(0);
    }
  });

  it("every activity has customer responsibility defined", () => {
    for (const act of DEPLOYMENT_RESPONSIBILITIES) {
      expect(act.customer.trim().length).toBeGreaterThan(0);
    }
  });

  it("deployment partner role is defined for configuration", () => {
    const config = DEPLOYMENT_RESPONSIBILITIES.find(a => a.id === "dep-configuration");
    expect(config).toBeDefined();
    expect(config!.deploymentPartner.trim().length).toBeGreaterThan(0);
  });
});
