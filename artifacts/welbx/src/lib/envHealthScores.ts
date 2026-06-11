import type { Signal } from "@/data/signals";
import type { Decision } from "@/data/decisions";
import type { Playbook } from "@/data/playbooks";

/**
 * Signal Health — derived from signal confidence averages and active alert count.
 *
 * Each ALERT-status signal represents a known gap or live risk in the sensing
 * layer.  We penalise the base confidence average proportionally to the share of
 * signals currently in ALERT state.
 *
 * Accepts a flat array of signals so callers control the data source — this
 * makes the function pure and testable without module mocks.
 */
export function computeSignalHealthScore(signals: Signal[]): number {
  if (signals.length === 0) return 0;
  const avgConf =
    signals.reduce((s, sig) => s + sig.confidence, 0) / signals.length;
  const alertCount = signals.filter(s => s.status === "ALERT").length;
  const alertPenalty = (alertCount / signals.length) * 40;
  return Math.round(Math.min(100, Math.max(0, avgConf - alertPenalty)));
}

/**
 * Decision Health — weighted average of decision confidence scores, adjusted
 * by outcome quality.
 *
 * Positive outcomes add a modest bonus; negative outcomes apply a larger
 * deduction, reflecting the operational cost of incorrect decisions.
 */
export function computeDecisionHealthScore(decisions: Decision[]): number {
  if (decisions.length === 0) return 0;
  const avgConf =
    decisions.reduce((s, d) => s + d.confidence, 0) / decisions.length;
  const positive = decisions.filter(d => d.outcome === "Positive").length;
  const negative = decisions.filter(d => d.outcome === "Negative").length;
  const outcomeAdjustment =
    (positive / decisions.length) * 8 - (negative / decisions.length) * 12;
  return Math.round(Math.min(100, Math.max(0, avgConf + outcomeAdjustment)));
}

/**
 * Execution Health — fire-weighted average playbook success rate, with a
 * resolution-time penalty for slow average throughput.
 *
 * Target average resolution: ≤20 min.  Each minute above that target applies
 * a small proportional deduction, capped so a very slow playbook cannot drive
 * the score below what success rates alone would indicate.
 */
export function computeExecutionHealthScore(playbooks: Playbook[]): number {
  const totalFires = playbooks.reduce(
    (s, p) => s + p.stats.firesLast30Days,
    0,
  );
  if (totalFires === 0) return 0;
  const weightedSuccess = playbooks.reduce(
    (s, p) => s + p.stats.successRate * p.stats.firesLast30Days,
    0,
  );
  const avgSuccessRate = weightedSuccess / totalFires;
  const weightedResolution = playbooks.reduce(
    (s, p) => s + p.stats.avgResolutionMinutes * p.stats.firesLast30Days,
    0,
  );
  const avgResolution = weightedResolution / totalFires;
  const resolutionPenalty = Math.max(0, ((avgResolution - 20) / 100) * 10);
  return Math.round(Math.min(100, Math.max(0, avgSuccessRate - resolutionPenalty)));
}

/** Aggregate source stats surfaced on the EnvironmentHealthIndex detail panel */
export interface LiveHealthStats {
  signal: {
    score: number;
    totalSignals: number;
    alertCount: number;
    avgConfidence: number;
  };
  decision: {
    score: number;
    totalDecisions: number;
    avgConfidence: number;
    positiveRate: number;
    negativeCount: number;
  };
  execution: {
    score: number;
    totalFires: number;
    avgSuccessRate: number;
    avgResolutionMinutes: number;
  };
}

export function computeLiveHealthStats(
  signals: Signal[],
  decisions: Decision[],
  playbooks: Playbook[],
): LiveHealthStats {
  const alertCount = signals.filter(s => s.status === "ALERT").length;
  const signalAvgConf =
    signals.length > 0
      ? signals.reduce((s, sig) => s + sig.confidence, 0) / signals.length
      : 0;

  const decisionAvgConf =
    decisions.length > 0
      ? decisions.reduce((s, d) => s + d.confidence, 0) / decisions.length
      : 0;
  const positiveCount = decisions.filter(d => d.outcome === "Positive").length;
  const negativeCount = decisions.filter(d => d.outcome === "Negative").length;

  const totalFires = playbooks.reduce((s, p) => s + p.stats.firesLast30Days, 0);
  const weightedSuccess =
    totalFires > 0
      ? playbooks.reduce((s, p) => s + p.stats.successRate * p.stats.firesLast30Days, 0) /
        totalFires
      : 0;
  const weightedResolution =
    totalFires > 0
      ? playbooks.reduce(
          (s, p) => s + p.stats.avgResolutionMinutes * p.stats.firesLast30Days,
          0,
        ) / totalFires
      : 0;

  return {
    signal: {
      score: computeSignalHealthScore(signals),
      totalSignals: signals.length,
      alertCount,
      avgConfidence: Math.round(signalAvgConf),
    },
    decision: {
      score: computeDecisionHealthScore(decisions),
      totalDecisions: decisions.length,
      avgConfidence: Math.round(decisionAvgConf),
      positiveRate: decisions.length > 0 ? Math.round((positiveCount / decisions.length) * 100) : 0,
      negativeCount,
    },
    execution: {
      score: computeExecutionHealthScore(playbooks),
      totalFires,
      avgSuccessRate: Math.round(weightedSuccess),
      avgResolutionMinutes: Math.round(weightedResolution),
    },
  };
}
