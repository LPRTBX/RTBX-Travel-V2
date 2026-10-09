import { describe, expect, it } from "vitest";
import { describeAuditEntry, describeEngineNote, describePolicyChanges, formatRecordedTime, roleLabel, withRoleNames } from "@/lib/plainLanguage";
import { createHotelSignals } from "@/simulation/mockHotel";
import {
  BASELINE_POLICY, HOTEL_FAULTS, approveHotelDecision, createHotelCase, prepareHotelDecision, proposeHotelLearning,
  reconcileHotelFollowUp, replayHotelLearning, reviewHotelLearning, simulateHotelCase, type HotelCase,
} from "@/simulation/hotelLearning";
import { TRAVEL_ROLES } from "@/data/travelRoles";
import { ARCHITECTURE_SCENARIOS, advanceArchitectureTrace, architectureNextLabel, architectureSignalFor } from "@/lib/architectureLabModel";

const ENGINE_TOKEN = /\b(signal-received|decision-required|approval-required|in-action|mock-dispatch|outcome-verification|late-response|ineffective-action|missing-receipt|missing-measurement|synthetic-duty-manager|delegated-authority)\b/;
const ROLE_ID = new RegExp(`\\b(${TRAVEL_ROLES.map(role => role.id).join("|")})\\b`);
const ISO_TIME = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

/** Every audit trail the hotel learning engine can produce: each fault, a replay, and late evidence. */
function allEngineCases(): HotelCase[] {
  const signals = createHotelSignals();
  const cases: HotelCase[] = HOTEL_FAULTS.map((fault, index) => simulateHotelCase(signals[index], fault));
  const late = cases.find(c => c.reasons.includes("late-response"))!;
  const proposal = reviewHotelLearning(proposeHotelLearning(late)!, "approved", "synthetic-duty-manager");
  cases.push(replayHotelLearning(late, proposal, "late-response"));
  const pending = cases.find(c => c.outcome === "pending" && c.reasons.includes("missing-measurement"))!;
  cases.push(reconcileHotelFollowUp(pending, { ...pending.observation!, measured: true }));
  return cases;
}

describe("Plain-language engine labels", () => {
  it("describes every audit step the engine records without exposing engine identifiers", () => {
    const entries = allEngineCases().flatMap(c => c.audit);
    const steps = new Set(entries.map(entry => entry.step));
    expect(steps).toEqual(new Set([
      "signal-received", "understanding", "decision-required", "approval-required", "approval", "in-action",
      "mock-dispatch", "outcome-verification", "escalated", "resolved", "closed", "reviewed-learning-replay", "prior-observation-retained",
    ]));
    for (const entry of entries) {
      const line = describeAuditEntry(entry);
      const shown = `${line.title} ${line.detail ?? ""}`;
      expect(shown, `${entry.step}: ${entry.detail}`).not.toMatch(ENGINE_TOKEN);
      expect(shown, `${entry.step}: ${entry.detail}`).not.toMatch(ROLE_ID);
      expect(shown, `${entry.step}: ${entry.detail}`).not.toMatch(ISO_TIME);
      expect(line.technical).toBe(`${entry.step}: ${entry.detail}`);
    }
  });

  it("covers the delegated-authority step used when no approval gate applies", () => {
    expect(describeAuditEntry({ step: "delegated-authority", detail: "Synthetic actor: guest-services" }).detail)
      .toBe("By Guest Services (scripted test actor)");
  });

  it("names roles, including simulated reviewers, and replaces role ids inside notes", () => {
    expect(roleLabel("duty-manager")).toBe("Duty Manager");
    expect(roleLabel("synthetic-duty-manager")).toBe("Duty Manager (simulated)");
    expect(withRoleNames("Scripted test approval — duty-manager")).toBe("Scripted test approval — Duty Manager");
    expect(describeEngineNote("Simulation Lab synthetic step")).toBe("Simulated step");
    expect(formatRecordedTime("2026-10-08T07:55:36.557Z")).not.toMatch(ISO_TIME);
  });

  it("lists only the settings a proposal changes", () => {
    const late = allEngineCases().find(c => c.reasons.includes("late-response"))!;
    const proposal = proposeHotelLearning(late)!;
    expect(describePolicyChanges(late.policy, proposal.candidate)).toEqual([
      { setting: "Respond within", from: "30 minutes", to: "15 minutes" },
    ]);
    expect(describePolicyChanges(BASELINE_POLICY, BASELINE_POLICY)).toEqual([]);
  });
});

describe("Architecture Lab case history", () => {
  it("labels the lab's own trace entries without calling notes owners", () => {
    for (const [scenarioId] of ARCHITECTURE_SCENARIOS) {
      let c = createHotelCase(architectureSignalFor(scenarioId));
      for (let step = 0; step < 10 && architectureNextLabel(c); step += 1) c = advanceArchitectureTrace(c, "late-response")!.hotelCase;
      expect(architectureNextLabel({ ...c, execution: { ...c.execution, state: "approval-required" }, approved: false } as HotelCase) ?? "").not.toMatch(ROLE_ID);
      for (const entry of c.audit) {
        const line = describeAuditEntry(entry);
        const shown = `${line.title} ${line.detail ?? ""}`;
        expect(shown, `${scenarioId} ${entry.step}: ${entry.detail}`).not.toMatch(ENGINE_TOKEN);
        expect(shown, `${scenarioId} ${entry.step}: ${entry.detail}`).not.toMatch(ROLE_ID);
        if (line.detail?.startsWith("Owner: ")) expect(TRAVEL_ROLES.map(role => role.name)).toContain(line.detail.slice(7));
      }
    }
  });
});

describe("Recorded evidence and authority are unchanged by labelling", () => {
  it("does not alter the recorded audit trail it describes", () => {
    for (const c of allEngineCases()) {
      const recorded = structuredClone(c.audit);
      c.audit.forEach(entry => describeAuditEntry(Object.freeze({ ...entry })));
      expect(c.audit).toEqual(recorded);
    }
  });

  it("still rejects approval from anyone but the authorised role and review by anyone but the designated reviewer", () => {
    const signal = createHotelSignals()[0];
    const prepared = prepareHotelDecision(createHotelCase(signal));
    const wrongRole = TRAVEL_ROLES.map(role => role.id).find(id => id !== prepared.execution.approvalRoleId && id !== prepared.execution.accountableRoleId)!;
    expect(() => approveHotelDecision(prepared, wrongRole)).toThrow();
    const late = allEngineCases().find(c => c.reasons.includes("late-response"))!;
    expect(() => reviewHotelLearning(proposeHotelLearning(late)!, "approved", "duty-manager")).toThrow();
  });
});
