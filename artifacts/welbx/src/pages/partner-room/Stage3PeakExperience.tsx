import { useState } from "react";
import { CROSS_PROPERTY_COVER_EXCEPTION } from "@/lib/portfolioCoordination";
import { approvePortfolioSupport, initialPeakState, portfolioSummary, type ChallengeId } from "@/lib/peakPressure";
import { PeakPressureScenario } from "@/components/partner-room/PeakPressureScenario";
import { PortfolioCoordination } from "@/components/partner-room/PortfolioCoordination";

/**
 * The Stage 3 planned simulation: one property's peak-pressure case, decided locally,
 * and the portfolio that sees it only as aggregate exposure, response status and
 * outstanding decisions. Cross-property cover is a portfolio exception decided there.
 */
export default function Stage3PeakExperience() {
  const [state, setState] = useState(() => initialPeakState("standard"));
  const [run, setRun] = useState(0);
  const restart = (challenge: ChallengeId) => { setState(initialPeakState(challenge)); setRun(n => n + 1); };
  // The portfolio exception is raised only once the Duty Manager has recorded the escalation.
  const needsCover = state.challenge === "capacity" && state.review.status === "approved" && "escalate" in state.done;

  return (
    <>
      <PeakPressureScenario key={run} state={state} setState={setState} onRestart={restart} />
      <PortfolioCoordination peak={{
        ...portfolioSummary(state),
        extraException: needsCover ? CROSS_PROPERTY_COVER_EXCEPTION : undefined,
        runKey: String(run),
        onExceptionApproved: id => { if (id === CROSS_PROPERTY_COVER_EXCEPTION.id) setState(approvePortfolioSupport); },
      }} />
    </>
  );
}
