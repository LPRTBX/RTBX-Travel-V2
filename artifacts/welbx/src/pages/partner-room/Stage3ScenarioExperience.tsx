import { useState, useEffect } from "react";
import "./stage3-scenario.css";

// ── Types ──────────────────────────────────────────────────────────────────

type Decision = "A" | "B" | null;

type StepConfig = {
  title: string;
  kicker: string;
  label: string;
  content: (decision: Decision, setDecision: (d: Decision) => void) => React.ReactNode;
};

type ScenarioConfig = {
  id: "travel" | "enterprise";
  brandName: string;
  brandTag: string;
  color: string;
  steps: StepConfig[];
};

// ── Shared UI Components ───────────────────────────────────────────────────

const DataCard = ({ title, desc, highlight }: { title: string; desc: React.ReactNode; highlight?: boolean }) => (
  <div className={`s3-card ${highlight ? "s3-card-highlight" : ""}`}>
    <div className="s3-card-title" style={highlight ? { color: "var(--s3-accent)" } : {}}>
      {title}
    </div>
    <div className="s3-card-desc" style={highlight ? { color: "#fff" } : {}}>
      {desc}
    </div>
  </div>
);

const EvidenceBox = ({ completed, unresolved, evidence, notSent }: { completed: string; unresolved: string; evidence: string; notSent: string }) => (
  <div className="s3-evidence-box">
    <div className="s3-evidence-row">
      <div className="s3-evidence-label">Completed in simulation</div>
      <div className="s3-evidence-value">{completed}</div>
    </div>
    <div className="s3-evidence-row">
      <div className="s3-evidence-label">Unresolved responsibilities</div>
      <div className="s3-evidence-value">{unresolved}</div>
    </div>
    <div className="s3-evidence-row">
      <div className="s3-evidence-label">Evidence</div>
      <div className="s3-evidence-value">{evidence}</div>
    </div>
    <div className="s3-warning-text">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <strong>Explicitly not sent:</strong> {notSent}
      </div>
    </div>
  </div>
);

// ── Scenario Configurations ────────────────────────────────────────────────

const TRAVEL_STEPS: StepConfig[] = [
  {
    title: "Situation & Affected People",
    kicker: "Planned Simulation",
    label: "Situation",
    content: () => (
      <div className="s3-data-grid">
        <DataCard title="Location" desc="Harbour Hotel" />
        <DataCard title="Affected people" desc="Four fictional early-arrival guests, reception and the housekeeping team. Two rooms remain unavailable." />
        <DataCard title="Status" desc="Rooms 302 and 304 are not ready; reception needs an approved recovery plan before anyone is contacted." />
      </div>
    ),
  },
  {
    title: "Simulated Signals",
    kicker: "Synthetic context · no connected feeds",
    label: "Signals",
    content: () => (
      <div className="s3-data-grid">
        <DataCard title="Booking context · simulated" desc="A fictional booking shows arrival earlier than the proposed check-in window; no PMS is connected." />
        <DataCard title="Housekeeping · simulated" desc="Rooms 302 and 304 remain in a modelled room-turn queue; no task system is connected." />
        <DataCard title="Other property · simulated" desc="A second illustrative hotel has a ready-room option. Multi-property coordination is a planned Stage 3 capability, not available today." />
      </div>
    ),
  },
  {
    title: "Proposed Actions",
    kicker: "Cross-team Routing",
    label: "Actions",
    content: () => (
      <div className="s3-data-grid">
        <DataCard title="Reception" desc="Greet & manage expectations." />
        <DataCard title="Housekeeping" desc="Escalate turn priority for 302/304." />
        <DataCard title="External service" desc="Prepare a request for a local café waiting option; do not reserve or contact the partner." />
        <DataCard title="Multi-property coordinator" desc="Review a modelled alternative-room option at another hotel; availability and permission require human confirmation." />
      </div>
    ),
  },
  {
    title: "Meaningful Decision",
    kicker: "Human Authority",
    label: "Decision",
    content: (decision, setDecision) => (
      <div className="s3-decision-grid">
        <button
          className="s3-decision-btn"
          data-selected={decision === "A"}
          onClick={() => setDecision("A")}
          aria-pressed={decision === "A"}
        >
          <span className="s3-decision-badge">Standard Protocol</span>
          <div className="s3-decision-title">Standard Recovery</div>
          <div className="s3-decision-desc">Approve a simulated priority room turn and draft a café waiting option for a human to confirm.</div>
        </button>
        <button
          className="s3-decision-btn"
          data-selected={decision === "B"}
          onClick={() => setDecision("B")}
          aria-pressed={decision === "B"}
        >
          <span className="s3-decision-badge">Exception</span>
          <div className="s3-decision-title">Cross-property exception review</div>
          <div className="s3-decision-desc">Escalate to a manager to review the illustrative alternative-property room before any offer or assignment.</div>
        </button>
      </div>
    ),
  },
  {
    title: "Assignments & Notifications",
    kicker: "Branch-dependent Outcomes",
    label: "Outcomes",
    content: (decision) => (
      <div className="s3-data-grid">
        {decision === "A" ? (
          <>
            <DataCard title="Reception" desc="Simulated assignment: explain the wait; draft a café option for manager review." highlight />
            <DataCard title="Housekeeping" desc="Simulated assignment: prioritise rooms 302/304; room readiness remains unconfirmed." />
            <DataCard title="External service" desc="Draft request held for human confirmation; no café booking or notification sent." />
          </>
        ) : (
          <>
            <DataCard title="Manager / multi-property" desc="Exception queued: verify alternative room and obtain property approval. No room allocated." highlight />
            <DataCard title="Housekeeping" desc="Simulated assignment: continue normal room turn; still owns readiness confirmation." />
            <DataCard title="Reception / guest" desc="Draft alternative-property offer withheld pending manager approval; no notification sent." />
          </>
        )}
      </div>
    ),
  },
  {
    title: "Evidence Summary",
    kicker: "Simulation Complete",
    label: "Evidence",
    content: (decision) => (
      <EvidenceBox
        completed={decision === "A" ? "Priority routing and a café option drafted in this simulation." : "Cross-property exception and draft offer recorded in this simulation."}
        unresolved={decision === "A" ? "Housekeeping: confirm room readiness. Reception: confirm guest preference. External café: availability and consent." : "Manager: approve alternative property and room. Housekeeping: confirm original rooms. Reception: await authority before contact."}
        evidence={decision === "A" ? "Decision: standard recovery. Illustrative commercial hypothesis: an optional café credit could cost £20; no revenue or value measured." : "Decision: cross-property exception. Illustrative commercial hypothesis: an alternative room could change allocation cost; no revenue or value measured."}
        notSent="No PMS or task records changed, no café reservation, room allocation, guest message or transaction. All people, properties, costs and outcomes are synthetic."
      />
    ),
  },
];

const ENTERPRISE_STEPS: StepConfig[] = [
  {
    title: "Situation & Affected People",
    kicker: "Proposed Concept",
    label: "Situation",
    content: () => (
      <div className="s3-data-grid">
        <DataCard title="Location" desc="Regional Office (Zone C)" />
        <DataCard title="Trigger Event" desc="Workplace-risk issue spanning facilities and private support." />
        <DataCard title="Status" desc="A fictional private report suggests an ergonomic concern. No identity or support detail appears in the shared operations view." />
      </div>
    ),
  },
  {
    title: "Simulated Signals",
    kicker: "Synthetic context · no connected feeds",
    label: "Signals",
    content: () => (
      <div className="s3-data-grid">
        <DataCard title="Private report · restricted" desc="Only a private-support lead could review underlying details; other teams see a generic risk flag." />
        <DataCard title="Facilities · simulated" desc="A proposed environmental-check cue; no sensor or safety portal is connected." />
        <DataCard title="Operations · simulated" desc="A fictional shift-context cue; no HR roster is connected or shared." />
      </div>
    ),
  },
  {
    title: "Proposed Actions",
    kicker: "Cross-team Routing",
    label: "Actions",
    content: () => (
      <div className="s3-data-grid">
        <DataCard title="Facilities" desc="Check environmental factors in Zone C." />
        <DataCard title="Operations Manager" desc="Review standard shift rotation." />
        <DataCard title="Private-Support Lead" desc="Review incident for potential human welfare assignment." />
      </div>
    ),
  },
  {
    title: "Meaningful Decision",
    kicker: "Human Authority",
    label: "Decision",
    content: (decision, setDecision) => (
      <div className="s3-decision-grid">
        <button
          className="s3-decision-btn"
          data-selected={decision === "A"}
          onClick={() => setDecision("A")}
          aria-pressed={decision === "A"}
        >
          <span className="s3-decision-badge">Standard Protocol</span>
          <div className="s3-decision-title">Standard Assessment</div>
          <div className="s3-decision-desc">Authorise simulated facilities and operations checks using only a de-identified risk flag.</div>
        </button>
        <button
          className="s3-decision-btn"
          data-selected={decision === "B"}
          onClick={() => setDecision("B")}
          aria-pressed={decision === "B"}
        >
          <span className="s3-decision-badge">Exception</span>
          <div className="s3-decision-title">Direct Intervention</div>
          <div className="s3-decision-desc">Hold shared-team checks and ask the private-support lead to assess next steps. No automated outreach.</div>
        </button>
      </div>
    ),
  },
  {
    title: "Assignments & Notifications",
    kicker: "Branch-dependent Outcomes",
    label: "Outcomes",
    content: (decision) => (
      <div className="s3-data-grid">
        {decision === "A" ? (
          <>
            <DataCard title="Facilities" desc="Simulated assignment: inspect workspace conditions; sees no private report detail." />
            <DataCard title="Operations Manager" desc="Simulated assignment: review workload process; sees only a de-identified flag." />
            <DataCard title="Private-support lead" desc="Human review remains pending; private details are visible only to the authorised role." />
          </>
        ) : (
          <>
            <DataCard title="Private-support lead" desc="Simulated exception assignment: decide whether, when and how to offer private support. No welfare check has occurred." highlight />
            <DataCard title="Facilities & operations" desc="Shared checks held pending a human decision; sees no individual details." />
            <DataCard title="Cross-team view" desc="Only 'restricted review pending' is visible. No individual or support details are shared." highlight />
          </>
        )}
      </div>
    ),
  },
  {
    title: "Evidence Summary",
    kicker: "Simulation Complete",
    label: "Evidence",
    content: (decision) => (
      <EvidenceBox
        completed={decision === "A" ? "De-identified facilities and operations review requests drafted in simulation." : "Restricted exception routing drafted in simulation; shared checks marked on hold."}
        unresolved={decision === "A" ? "Facilities: inspect conditions. Operations manager: review process. Private-support lead: decide whether support is needed." : "Private-support lead: review privately and decide next step. Facilities and operations: await authorised status only."}
        evidence={decision === "A" ? "Illustrative metric: two review requests modelled, zero real inspections completed." : "Illustrative metric: one restricted review modelled, zero real welfare actions completed."}
        notSent="No HR action, private-support outreach, safety dispatch or external update. No real personal information is stored or shared."
      />
    ),
  },
];

const SCENARIOS: Record<string, ScenarioConfig> = {
  travel: {
    id: "travel",
    brandName: "JALDO Travel",
     brandTag: "Stage 3 · planned capability · simulated data",
    color: "#c9a84c", // Amber/Gold
    steps: TRAVEL_STEPS,
  },
  enterprise: {
    id: "enterprise",
    brandName: "JALDO Enterprise",
    brandTag: "Proposed concept · not approved roadmap",
    color: "#3b82f6", // Blue
    steps: ENTERPRISE_STEPS,
  },
};

// ── Main Component ─────────────────────────────────────────────────────────

export default function Stage3ScenarioExperience() {
  const [scenarioId, setScenarioId] = useState<"travel" | "enterprise">("travel");
  const [step, setStep] = useState(0);
  const [decision, setDecision] = useState<Decision>(null);
  const [announcement, setAnnouncement] = useState("");

  const currentScenario = SCENARIOS[scenarioId];
  const steps = currentScenario.steps;
  const currentStep = steps[step];

  const canProceed = step < steps.length - 1 && (step !== 3 || decision !== null);

  // Announce step changes to screen readers
  useEffect(() => {
    setAnnouncement(`Step ${step + 1} of ${steps.length}: ${currentStep.title}`);
  }, [step, currentStep.title, steps.length]);

  const handleToggle = (id: "travel" | "enterprise") => {
    setScenarioId(id);
    setStep(0);
    setDecision(null);
  };

  const handleReset = () => {
    setStep(0);
    setDecision(null);
  };

  const handleStepClick = (idx: number) => {
    // Can click back to any completed step
    if (idx < step) {
      setStep(idx);
    } 
    // Can click forward only to the very next step, and only if allowed
    else if (idx === step + 1 && canProceed) {
      setStep(idx);
    }
  };

  return (
    <div 
      className="s3-widget" 
      style={{ "--s3-accent": currentScenario.color } as React.CSSProperties}
    >
      {/* Live Region for Accessibility */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Header */}
      <header className="s3-header">
        <div className="s3-brand-lockup">
          <div className="s3-brand-title">{currentScenario.brandName}</div>
          <div className="s3-brand-tag">{currentScenario.brandTag}</div>
        </div>
        <div className="s3-header-actions">
          <div className="s3-toggle-group">
            <button
              className="s3-toggle-btn"
              aria-pressed={scenarioId === "travel"}
              onClick={() => handleToggle("travel")}
            >
              Travel
            </button>
            <button
              className="s3-toggle-btn"
              aria-pressed={scenarioId === "enterprise"}
              onClick={() => handleToggle("enterprise")}
            >
              Enterprise
            </button>
          </div>
          <button className="s3-btn" onClick={handleReset}>
            Reset Scenario
          </button>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="s3-main">
        {/* Stepper */}
        <div className="s3-stepper" role="tablist" aria-label="Scenario Progress">
          {steps.map((s, idx) => {
            const isActive = step === idx;
            const isCompleted = step > idx;
            const isDisabled = idx > step && (idx > step + 1 || (step === 3 && decision === null));

            return (
              <button
                key={idx}
                role="tab"
                aria-selected={isActive}
                aria-controls={`s3-panel-${idx}`}
                id={`s3-tab-${idx}`}
                className="s3-step-item"
                data-active={isActive}
                data-completed={isCompleted}
                disabled={isDisabled}
                onClick={() => handleStepClick(idx)}
              >
                <div className="s3-step-indicator">{idx + 1}</div>
                <div className="s3-step-label">{s.label}</div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div 
          className="s3-content-area"
          role="tabpanel"
          id={`s3-panel-${step}`}
          aria-labelledby={`s3-tab-${step}`}
        >
          <div className="s3-step-kicker">{currentStep.kicker}</div>
          <h2 className="s3-step-title">{currentStep.title}</h2>
          
          <div className="s3-step-body">
            {currentStep.content(decision, setDecision)}
          </div>

          {/* Footer Navigation */}
          <footer className="s3-footer">
            <button
              className="s3-btn"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              Back
            </button>
            {step < steps.length - 1 && (
              <button
                className="s3-btn s3-btn-primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 3 && decision === null}
              >
                Continue
              </button>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}
