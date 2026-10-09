import { useReducer, useState } from "react";
import "./stage3-scenario.css";
import {
  portfolioReducer, wellbeingReducer, initialPortfolio, initialWellbeing, portfolioReady, wellbeingReady,
  PORTFOLIO_STEPS, WELLBEING_STEPS,
} from "@/lib/stage3Simulation";
import { Stepper, Progress, Boundary } from "./stage3/shared";
import { PortfolioBody } from "./stage3/PortfolioScenario";
import { WellbeingBody, RoleBar, Role } from "./stage3/WellbeingScenario";

type Id = "wellbeing" | "portfolio";

export default function Stage3ScenarioExperience() {
  const [id, setId] = useState<Id>("wellbeing");
  const [p, pd] = useReducer(portfolioReducer, undefined, initialPortfolio);
  const [w, wd] = useReducer(wellbeingReducer, undefined, initialWellbeing);
  const [role, setRole] = useState<Role>("restricted");
  const wb = id === "wellbeing";
  const steps = wb ? WELLBEING_STEPS : PORTFOLIO_STEPS;
  const step = wb ? w.step : p.step;
  const ready = wb ? wellbeingReady(w) : portfolioReady(p);
  const last = step === steps.length - 1;
  const title = wb ? "Recognise the pressure. Protect the person." : "One disruption. Three hotels. A coordinated response.";

  return (
    <div className="s3-widget" style={{ "--s3-accent": "#c9a84c" } as React.CSSProperties}>
      <header className="s3-header">
        <div className="s3-brand-lockup">
          <div className="s3-brand-title">JALDO Travel</div>
          <div className="s3-brand-tag">Stage 3 · fictional governed-response simulation</div>
        </div>
        <div className="s3-header-actions">
          <div className="s3-toggle-group" role="group" aria-label="Scenario">
            <button className="s3-toggle-btn" aria-pressed={wb} onClick={() => setId("wellbeing")} data-testid="toggle-wellbeing">Safety &amp; wellbeing</button>
            <button className="s3-toggle-btn" aria-pressed={!wb} onClick={() => setId("portfolio")} data-testid="toggle-portfolio">Portfolio disruption</button>
          </div>
          <button className="s3-btn" onClick={() => (wb ? wd({ type: "reset" }) : pd({ type: "reset" }))} data-testid="button-reset">Reset this scenario</button>
        </div>
      </header>
      <div className="s3-title-block"><h1>{title}</h1></div>
      <div className="s3-main">
        <Stepper steps={steps} step={step} />
        <div className="s3-content-area">
          <Progress step={step} total={steps.length} />
          <Boundary>{wb ? "Role views are a demonstration, not access control." : ""}</Boundary>
          {wb && <RoleBar role={role} setRole={setRole} />}
          <div className="s3-step-kicker">{steps[step]}</div>
          <h2 className="s3-step-title" aria-live="polite">Step {step + 1}: {steps[step]}</h2>
          <div className="s3-step-body">
            {wb
              ? <WellbeingBody state={w} dispatch={wd} role={role} setRole={setRole} steps={steps} />
              : <PortfolioBody state={p} dispatch={pd} />}
          </div>
          <footer className="s3-footer">
            <span className="s3-note" style={{ margin: 0 }}>{last ? "End of fictional simulation." : ready ? "Gate satisfied." : "Gate not yet satisfied."}</span>
            <button className="s3-btn s3-btn-primary" disabled={!ready || last} onClick={() => (wb ? wd({ type: "next" }) : pd({ type: "next" }))} data-testid="button-next">Next</button>
          </footer>
        </div>
      </div>
    </div>
  );
}
