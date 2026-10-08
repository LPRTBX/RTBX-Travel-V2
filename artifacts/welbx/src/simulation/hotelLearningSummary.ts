import type { HotelCase } from './hotelLearning';

export type HotelOutcome = HotelCase['outcome'];
export type OutcomeCounts = Record<HotelOutcome, number>;

/** One outcome journey: the recorded baseline plus any later results, each kept separately. */
export interface LearningRowOutcomes {
  baseline: Pick<HotelCase, 'outcome'>;
  reconciled?: Pick<HotelCase, 'outcome'>;
  replay?: Pick<HotelCase, 'outcome'>;
}

export interface LearningSummary {
  /** Outcomes as originally recorded in cycle 1. Reviews, replays and late evidence never change these. */
  recorded: OutcomeCounts;
  /** Pending journeys later reconciled with a correlated follow-up measurement. */
  lateEvidence: { journeys: number; outcomes: OutcomeCounts };
  /** Approved changes replayed against the same source signals as new executions. */
  replays: { journeys: number; outcomes: OutcomeCounts };
}

const emptyCounts = (): OutcomeCounts => ({ met: 0, 'not-met': 0, pending: 0 });

export function summariseLearningRows(rows: LearningRowOutcomes[]): LearningSummary {
  const summary: LearningSummary = {
    recorded: emptyCounts(),
    lateEvidence: { journeys: 0, outcomes: emptyCounts() },
    replays: { journeys: 0, outcomes: emptyCounts() },
  };
  for (const row of rows) {
    summary.recorded[row.baseline.outcome] += 1;
    if (row.reconciled) {
      summary.lateEvidence.journeys += 1;
      summary.lateEvidence.outcomes[row.reconciled.outcome] += 1;
    }
    if (row.replay) {
      summary.replays.journeys += 1;
      summary.replays.outcomes[row.replay.outcome] += 1;
    }
  }
  return summary;
}

/** Journey label that keeps the recorded outcome first and names any later result by its source. */
export function describeJourneyOutcome(row: LearningRowOutcomes, labels: Record<HotelOutcome, string>): string {
  const later = [
    row.reconciled && `late evidence ${labels[row.reconciled.outcome].toLowerCase()}`,
    row.replay && `replay ${labels[row.replay.outcome].toLowerCase()}`,
  ].filter(Boolean);
  return later.length ? `${labels[row.baseline.outcome]} → ${later.join(' · ')}` : labels[row.baseline.outcome];
}
