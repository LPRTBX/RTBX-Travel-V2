import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { INTEGRATION_RECORDS } from "@/data/travelDeploymentPathway";
import { MATURITY_LABELS, TRAVEL_SCENARIOS, VALID_MATURITY_STATUSES } from "@/data/travelScenarios";
import { CURRENT_PROOF_BOUNDARY, PROOF_TAXONOMY, WORKING_PROOF_PATH } from "./proofLanguage";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return entry === "archive" ? [] : sourceFiles(path);
    return /\.(?:ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts") ? [path] : [];
  });
}

const PRIMARY_PROOF_ROUTE_FILES = [
  "src/pages/partner-room/PartnerGuestDemo.tsx",
  "src/pages/partner-room/PartnerScenarioBuilder.tsx",
  "src/pages/partner-room/PartnerDualViewDemo.tsx",
  "src/pages/partner-room/PartnerOperationsCentre.tsx",
  "src/pages/partner-room/PartnerDecisionSpine.tsx",
  "src/pages/partner-room/PartnerCommsDemo.tsx",
  "src/pages/partner-room/PartnerTravelAiComms.tsx",
  "src/pages/partner-room/PartnerMomentsEconomy.tsx",
  "src/pages/partner-room/PartnerIntelligenceModel.tsx",
  "src/pages/partner-room/PartnerTravelOperatingSystems.tsx",
  "src/pages/partner-room/PartnerOperatingModel.tsx",
  "src/pages/partner-room/PartnerValidationReplay.tsx",
  "src/pages/partner-room/PartnerSignalCapture.tsx",
  "src/pages/partner-room/PartnerOperatorDemo.tsx",
  "src/pages/partner-room/PartnerCorporateTravelDemo.tsx",
  "src/pages/partner-room/PartnerEventsVenuesDemo.tsx",
  "src/pages/partner-room/PartnerDestinationTourismDemo.tsx",
  "src/pages/partner-room/PartnerHotelsResortsDemo.tsx",
  "src/pages/partner-room/PartnerHolidayParkDemo.tsx",
  "src/pages/partner-room/PartnerProofCalculator.tsx",
  "src/pages/partner-room/PartnerDemoPaths.tsx",
  "src/pages/partner-room/resources/TravelUxBlueprint.tsx",
  "src/pages/partner-room/resources/TravelPilotModel.tsx",
  "src/pages/partner-room/resources/TravelCommercialPartnershipBrief.tsx",
  "src/pages/partner-room/resources/TravelGtmPlan.tsx",
  "src/pages/StoryHub.tsx",
  "src/pages/StoryGuestStory.tsx",
  "src/pages/StoryOperator.tsx",
];

function readProjectSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Step 6 proof and claims guardrails", () => {
  it("uses the canonical seven-label proof taxonomy", () => {
    expect(PROOF_TAXONOMY).toEqual(VALID_MATURITY_STATUSES.map((status) => MATURITY_LABELS[status]));
  });

  it("states the current Working Proof and Simulation boundary", () => {
    expect(CURRENT_PROOF_BOUNDARY.maturity).toBe("Working Proof");
    expect(CURRENT_PROOF_BOUNDARY.evidence).toBe("Simulation");
    expect(CURRENT_PROOF_BOUNDARY.notice).toMatch(/not an Integrated or Production deployment/i);
    expect(WORKING_PROOF_PATH).toBe("/partner-room/guest-demo");
  });

  it("does not expose the inaccessible external MVP URL in active source", () => {
    const activeSource = sourceFiles(join(process.cwd(), "src"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");
    expect(activeSource).not.toContain("replit.com/@LP1313/rtbx-travel-moment-response-mvp");
  });

  it("rejects concrete current-state live and dispatch claims", () => {
    const activeSource = sourceFiles(join(process.cwd(), "src"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");
    const prohibitedClaims = [
      /Deployed MVP Preview/i,
      /turns live signals/i,
      /Live data received/i,
      /Guest Channel message sent/i,
      /Guest comms sent/i,
      /queued for auto-execution/i,
      /personalised activation message sent/i,
      /Action card dispatched/i,
      /Partner notification dispatched/i,
    ];
    for (const claim of prohibitedClaims) {
      expect(activeSource, `active source contains prohibited claim ${claim}`).not.toMatch(claim);
    }
  });

  it("keeps partner-facing proof routes semantically bounded", () => {
    const moments = readFileSync(join(process.cwd(), "src/pages/partner-room/PartnerMomentsEconomy.tsx"), "utf8");
    const comms = readFileSync(join(process.cwd(), "src/pages/partner-room/PartnerCommsDemo.tsx"), "utf8");
    const scenarios = readFileSync(join(process.cwd(), "src/pages/partner-room/PartnerTravelScenarios.tsx"), "utf8");

    expect(moments).not.toMatch(/\bDemonstrable\b/);
    expect(moments).toMatch(/Simulation boundary:[\s\S]*No guest message, staff task, welfare action, partner activation or external-system update is dispatched/);
    expect(moments).toContain("Illustrative Action State");
    expect(moments).toContain("Indicative Value");
    expect(moments).toContain("Illustrative Assurance Record");

    expect(comms).not.toContain('channel: "Live Record"');
    expect(comms).toMatch(/Simulation boundary:[\s\S]*No guest or staff message, task, welfare or emergency action/);
    expect(comms).toContain('label: "Draft Shown"');
    expect(comms).toContain('label: "Simulated"');
    expect(comms).toContain('label: "Illustrated"');

    expect(scenarios).toMatch(/Simulation boundary:[\s\S]*controls on this page only change local demonstration state/);
    expect(scenarios).not.toContain('"✓ Sent"');
    expect(scenarios).not.toContain('"✓ Action confirmed"');
    expect(scenarios).not.toContain('"✓ Outcome completed"');
  });

  it("keeps every active travel scenario within canonical proof and simulation boundaries", () => {
    for (const scenario of TRAVEL_SCENARIOS) {
      expect(VALID_MATURITY_STATUSES).toContain(scenario.maturityStatus);
      expect(["integrated", "production"]).not.toContain(scenario.maturityStatus);
      expect(scenario.signalDetails.every(({ status }) => status !== "integrated")).toBe(true);
      expect(scenario.proof.limitations.join(" ")).toMatch(/synthetic|simulat|illustrat|not sent|not connected|not a production|production engineering/i);
      expect(scenario.rolesConfig.accountableRoleId.trim().length).toBeGreaterThan(0);
    }
  });

  it("does not import the legacy replay fixture into active Partner Room code", () => {
    const activeImports = sourceFiles(join(process.cwd(), "src"))
      .filter((path) => !path.endsWith("data/scenarios.ts"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");
    expect(activeImports).not.toMatch(/from\s+["']@\/data\/scenarios["']/);
  });

  it("does not represent any current integration as Integrated or Production", () => {
    expect(INTEGRATION_RECORDS.some(({ maturity }) => maturity === "integrated" || maturity === "production")).toBe(false);
    expect(INTEGRATION_RECORDS.every(({ maturityNote }) => Boolean(maturityNote?.trim()))).toBe(true);
  });

  it("keeps human accountability explicit in the shared proof boundary", () => {
    expect(CURRENT_PROOF_BOUNDARY.notice).toMatch(/No guest communication, staff task, partner activation or emergency action is sent/i);
  });

  it("semantically bounds every primary partner demo and story target", () => {
    for (const relativePath of PRIMARY_PROOF_ROUTE_FILES) {
      const source = readProjectSource(relativePath);
      expect(source, `${relativePath} must identify synthetic or simulated content`).toMatch(/synthetic|simulation|simulated|fictional/i);
      expect(source, `${relativePath} must distinguish illustrative or modelled results`).toMatch(/illustrative|indicative|modelled|hypothesis/i);
      expect(source, `${relativePath} must retain named human accountability`).toMatch(/accountab|human review|operator review|named role|named people/i);
    }
  });

  it("rejects unqualified completion and dispatch language on primary proof routes", () => {
    const primarySource = PRIMARY_PROOF_ROUTE_FILES.map(readProjectSource).join("\n");
    const prohibitedPrimaryClaims = [
      /Live Operating Flow/i,
      /Action Executed/i,
      /Outcome Achieved/i,
      /Duty of care met\. Day intact\./i,
      /subtitle="Today · \d+ routed"/i,
      /status:\s*"Executed"/i,
      /owner:\s*"Auto-governed"/i,
      /Every moment generates a measured outcome/i,
      /Guest Channel message sent/i,
      /Action card dispatched/i,
      /status:\s*"(?:sent|delivered|actioned)"/i,
      /\bRevenue created\b/i,
      /\bValue protected\b/i,
    ];
    for (const claim of prohibitedPrimaryClaims) {
      expect(primarySource, `primary proof source contains prohibited claim ${claim}`).not.toMatch(claim);
    }
  });

  it("keeps current AI assistance Planned with a rules-based fallback", () => {
    const aiPage = readProjectSource("src/pages/partner-room/PartnerTravelAiComms.tsx");
    const aiData = readProjectSource("src/data/travelAiComms.ts");
    const aiSource = `${aiPage}\n${aiData}`;

    expect(aiSource).toMatch(/AI assistance is Planned|Planned AI/i);
    expect(aiSource).toMatch(/deterministic|rules-based/i);
    expect(aiSource).toMatch(/fallback/i);
    expect(aiSource).toMatch(/human approval|human accountability|named human/i);
    expect(aiSource).not.toMatch(/status:\s*"Delivered"/i);
    expect(aiSource).not.toMatch(/welfare (?:check|response).*(?:completed|confirmed)/i);
    expect(aiSource).not.toMatch(/booking (?:created|confirmed|logged)/i);
  });
});