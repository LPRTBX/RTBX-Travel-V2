import { describe, it, expect } from "vitest";
import {
  computeSignalHealthScore,
  computeDecisionHealthScore,
  computeExecutionHealthScore,
  computeLiveHealthStats,
} from "./envHealthScores";
import type { Signal } from "@/data/signals";
import type { Decision } from "@/data/decisions";
import type { Playbook } from "@/data/playbooks";

const makeSignal = (confidence: number, status: Signal["status"] = "ACTIVE"): Signal => ({
  name: "Test Signal",
  type: "Operational",
  source: "Test",
  frequency: "Real-time",
  confidence,
  weighting: "Medium",
  moments: [],
  status,
});

const makeDecision = (confidence: number, outcome: Decision["outcome"] = "Pending"): Decision => ({
  id: `D-${Math.random()}`,
  name: "Test Decision",
  relatedMoment: "Test",
  category: "Guest",
  reasoning: "Test reasoning",
  confidence,
  owner: "BXOS",
  recommendedAction: "Test action",
  outcome,
  learning: "",
  timestamp: new Date().toISOString(),
  decisionType: "Automated",
});

const makePlaybook = (successRate: number, fires: number, avgResolutionMinutes = 15): Playbook => ({
  id: `PB-${Math.random()}`,
  name: "Test Playbook",
  category: "Guest",
  status: "ACTIVE",
  triggerConditions: [],
  recommendedActions: [],
  owners: [],
  escalationRules: [],
  successCriteria: [],
  executions: [],
  stats: { firesLast30Days: fires, avgResolutionMinutes, successRate, dailyFires: [] },
});

/* ── Signal Health ── */
describe("computeSignalHealthScore", () => {
  it("returns 0 for empty signal list", () => {
    expect(computeSignalHealthScore([])).toBe(0);
  });

  it("higher confidence signals → higher score", () => {
    const low  = [makeSignal(40)];
    const high = [makeSignal(90)];
    expect(computeSignalHealthScore(high)).toBeGreaterThan(computeSignalHealthScore(low));
  });

  it("ALERT status lowers score relative to ACTIVE for same confidence", () => {
    const active = [makeSignal(90, "ACTIVE")];
    const alert  = [makeSignal(90, "ALERT")];
    expect(computeSignalHealthScore(alert)).toBeLessThan(computeSignalHealthScore(active));
  });

  it("all ALERT signals apply maximum alert penalty", () => {
    const allAlert  = [makeSignal(90, "ALERT"), makeSignal(80, "ALERT")];
    const noAlert   = [makeSignal(90, "ACTIVE"), makeSignal(80, "ACTIVE")];
    expect(computeSignalHealthScore(allAlert)).toBeLessThan(computeSignalHealthScore(noAlert));
  });

  it("score is bounded 0–100", () => {
    const score = computeSignalHealthScore([makeSignal(200, "ALERT")]);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

/* ── Decision Health ── */
describe("computeDecisionHealthScore", () => {
  it("returns 0 for empty decisions list", () => {
    expect(computeDecisionHealthScore([])).toBe(0);
  });

  it("higher confidence → higher score", () => {
    const low  = [makeDecision(40)];
    const high = [makeDecision(90)];
    expect(computeDecisionHealthScore(high)).toBeGreaterThan(computeDecisionHealthScore(low));
  });

  it("positive outcomes increase score relative to pending", () => {
    const pending  = [makeDecision(80, "Pending")];
    const positive = [makeDecision(80, "Positive")];
    expect(computeDecisionHealthScore(positive)).toBeGreaterThan(computeDecisionHealthScore(pending));
  });

  it("negative outcomes decrease score relative to pending", () => {
    const pending  = [makeDecision(80, "Pending")];
    const negative = [makeDecision(80, "Negative")];
    expect(computeDecisionHealthScore(negative)).toBeLessThan(computeDecisionHealthScore(pending));
  });

  it("score is bounded 0–100", () => {
    const score = computeDecisionHealthScore([makeDecision(200, "Positive")]);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

/* ── Execution Health ── */
describe("computeExecutionHealthScore", () => {
  it("returns 0 when no playbook fires", () => {
    expect(computeExecutionHealthScore([makePlaybook(90, 0)])).toBe(0);
  });

  it("higher success rate → higher score", () => {
    const low  = [makePlaybook(50, 10)];
    const high = [makePlaybook(95, 10)];
    expect(computeExecutionHealthScore(high)).toBeGreaterThan(computeExecutionHealthScore(low));
  });

  it("slow resolution time lowers score below target (>20 min)", () => {
    const fast = [makePlaybook(90, 10, 10)];
    const slow = [makePlaybook(90, 10, 60)];
    expect(computeExecutionHealthScore(slow)).toBeLessThan(computeExecutionHealthScore(fast));
  });

  it("score is bounded 0–100", () => {
    const score = computeExecutionHealthScore([makePlaybook(200, 5, 200)]);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

/* ── computeLiveHealthStats — integration ── */
describe("computeLiveHealthStats", () => {
  it("stats reflect input data — score changes when signals change", () => {
    const goodSignals = [makeSignal(95, "ACTIVE"), makeSignal(90, "ACTIVE")];
    const badSignals  = [makeSignal(95, "ALERT"),  makeSignal(90, "ALERT")];
    const decisions   = [makeDecision(80)];
    const playbooks   = [makePlaybook(90, 5)];

    const good = computeLiveHealthStats(goodSignals, decisions, playbooks);
    const bad  = computeLiveHealthStats(badSignals,  decisions, playbooks);

    expect(good.signal.score).toBeGreaterThan(bad.signal.score);
    expect(good.signal.alertCount).toBe(0);
    expect(bad.signal.alertCount).toBe(2);
  });

  it("stats reflect input data — decision score changes when decisions change", () => {
    const signals     = [makeSignal(85)];
    const playbooks   = [makePlaybook(90, 5)];
    const allPositive = [makeDecision(80, "Positive"), makeDecision(85, "Positive")];
    const allNegative = [makeDecision(80, "Negative"), makeDecision(85, "Negative")];

    const pos = computeLiveHealthStats(signals, allPositive, playbooks);
    const neg = computeLiveHealthStats(signals, allNegative, playbooks);

    expect(pos.decision.score).toBeGreaterThan(neg.decision.score);
  });

  it("stats reflect input data — execution score changes when playbooks change", () => {
    const signals   = [makeSignal(85)];
    const decisions = [makeDecision(80)];

    const highPerf = computeLiveHealthStats(signals, decisions, [makePlaybook(95, 10, 10)]);
    const lowPerf  = computeLiveHealthStats(signals, decisions, [makePlaybook(50, 10, 60)]);

    expect(highPerf.execution.score).toBeGreaterThan(lowPerf.execution.score);
  });
});
