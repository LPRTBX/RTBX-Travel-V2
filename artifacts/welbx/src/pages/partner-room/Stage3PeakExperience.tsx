import { useState } from "react";
import { CROSS_PROPERTY_COVER_EXCEPTION } from "@/lib/portfolioCoordination";
import { approvePortfolioSupport, initialPeakState, portfolioSummary, type ChallengeId } from "@/lib/peakPressure";
import { PeakPressureScenario } from "@/components/partner-room/PeakPressureScenario";
import { PortfolioCoordination } from "@/components/partner-room/PortfolioCoordination";
import { PortfolioDisruptionScenario } from "@/components/partner-room/PortfolioDisruptionScenario";

/**
 * Stage 3 planned simulations: peak-period team pressure (default) and a Portfolio disruption.
 * Both stay mounted; the inactive one is hidden so its state persists.
 */
export default function Stage3PeakExperience() {
  const [state, setState] = useState(() => initialPeakState("standard"));
  const [run, setRun] = useState(0);
  const [scenario, setScenario] = useState<"peak" | "portfolio">("peak");
  const restart = (challenge: ChallengeId) => { setState(initialPeakState(challenge)); setRun(n => n + 1); };
  // The portfolio exception is raised only once the Duty Manager has recorded the escalation.
  const needsCover = state.challenge === "capacity" && state.review.status === "approved" && "escalate" in state.done;
  const tab = (on: boolean): React.CSSProperties => ({ padding: "12px 18px", cursor: "pointer", border: "1px solid #c9a84c", background: on ? "#c9a84c" : "transparent", color: on ? "#101113" : "#c9a84c", fontWeight: 700 });

  return (
    <>
      <div role="group" aria-label="Choose a Stage 3 scenario" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        <button type="button" data-testid="scenario-peak-pressure" aria-pressed={scenario === "peak"} onClick={() => setScenario("peak")} style={tab(scenario === "peak")}>Peak-period team pressure</button>
        <button type="button" data-testid="scenario-portfolio-disruption" aria-pressed={scenario === "portfolio"} onClick={() => setScenario("portfolio")} style={tab(scenario === "portfolio")}>Portfolio disruption</button>
      </div>
      <div hidden={scenario !== "peak"}>
        <PeakPressureScenario key={run} state={state} setState={setState} onRestart={restart} />
        <PortfolioCoordination peak={{
          ...portfolioSummary(state),
          extraException: needsCover ? CROSS_PROPERTY_COVER_EXCEPTION : undefined,
          runKey: String(run),
          onExceptionApproved: id => { if (id === CROSS_PROPERTY_COVER_EXCEPTION.id) setState(approvePortfolioSupport); },
        }} />
      </div>
      <div hidden={scenario !== "portfolio"}>
        <PortfolioDisruptionScenario />
      </div>
    </>
  );
}
