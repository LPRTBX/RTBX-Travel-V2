import { useState } from "react";
import { GUIDED_ROUTE, LOOP_STAGE_LABELS, OPERATING_LOOP } from "@/data/partnerJourney";
import { usePartnerRoomNavigate } from "@/components/PartnerRoomLayout";
import "./start-journey.css";

function RouteLink({ href, className, children, testId }: { href: string; className?: string; children: React.ReactNode; testId?: string }) {
  const navigateTo = usePartnerRoomNavigate();
  return (
    <a
      href={href}
      className={className}
      data-testid={testId}
      onClick={event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateTo(href);
      }}
    >{children}</a>
  );
}

const AUDIENCES = [
  {
    title: "Hotel and resort operators",
    text: "Owners, general managers and operations leaders who want missed moments caught early, handled consistently and recorded, across one property or a small group.",
  },
  {
    title: "Duty managers and frontline teams",
    text: "The people who decide and act. JALDO Travel prepares the context, the options and the drafts; they approve, act and close the case.",
  },
  {
    title: "Guests",
    text: "Benefit from earlier acknowledgement and a practical recovery. No guest is contacted from this demonstration; every message is a draft.",
  },
  {
    title: "Technology and service partners",
    text: "PMS, housekeeping, messaging and transport providers whose signals and actions a pilot would connect, one integration at a time.",
  },
];

export function WhoWeServe() {
  return (
    <section id="who-we-serve" className="sj-section" aria-labelledby="who-we-serve-title">
      <p className="sj-eyebrow">Who JALDO Travel serves</p>
      <h2 id="who-we-serve-title">A governed operating layer for the people who run a property.</h2>
      <p className="sj-lead">
        JALDO Travel, powered by JALDO Core, turns operational signals into decisions that named people approve, actions they own and evidence they can review. It supports human judgement; it does not replace it.
      </p>
      <ul className="sj-audiences">
        {AUDIENCES.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}
      </ul>
    </section>
  );
}

export function OperatingLoop() {
  const [index, setIndex] = useState(0);
  const stage = OPERATING_LOOP[index];
  const last = OPERATING_LOOP.length - 1;
  return (
    <section id="operating-loop" className="sj-section" aria-labelledby="operating-loop-title">
      <p className="sj-eyebrow">How it works · one scenario, start to finish</p>
      <h2 id="operating-loop-title">Signal → context → governed decision → action → evidence → reviewed learning → improved next cycle</h2>
      <p className="sj-lead">Step through the loop with a repeat guest whose room is not ready. Every example is synthetic.</p>

      <ol className="sj-loop-stages" aria-label="Operating loop stages">
        {OPERATING_LOOP.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              className="sj-loop-stage"
              aria-current={i === index ? "step" : undefined}
              aria-controls="operating-loop-detail"
              onClick={() => setIndex(i)}
            >
              <span className="sj-loop-number">{i + 1}</span>{item.label}
            </button>
          </li>
        ))}
      </ol>

      <div id="operating-loop-detail" className="sj-loop-detail" role="region" aria-live="polite" aria-label={`Stage ${index + 1} of ${OPERATING_LOOP.length}: ${stage.label}`} data-testid="loop-detail">
        <div className="sj-loop-detail-head">
          <span className="sj-loop-count">Stage {index + 1} of {OPERATING_LOOP.length}</span>
          <h3>{stage.label}</h3>
        </div>
        <dl>
          <div><dt>What happens</dt><dd>{stage.role}</dd></div>
          <div><dt>In the scenario</dt><dd>{stage.example}</dd></div>
          <div><dt>Who is accountable</dt><dd>{stage.accountable}</dd></div>
        </dl>
        {index === last && <p className="sj-loop-return">The next cycle starts from the approved settings, and the loop begins again with the next signal.</p>}
        <div className="sj-loop-actions">
          <button type="button" onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}>← Previous stage</button>
          <button type="button" onClick={() => setIndex(i => (i === last ? 0 : i + 1))}>{index === last ? "Back to the first stage ↺" : "Next stage →"}</button>
          <RouteLink href={stage.see.path} className="sj-loop-see">See it working: {stage.see.label} →</RouteLink>
        </div>
      </div>
    </section>
  );
}

export function GuidedRoute() {
  return (
    <section id="guided-route" className="sj-section" aria-labelledby="guided-route-title">
      <p className="sj-eyebrow">Guided route · {GUIDED_ROUTE.length} steps</p>
      <h2 id="guided-route-title">Follow the loop through the Partner Room.</h2>
      <p className="sj-lead">
        Each page shows its step and links to the next. Every page stays available directly from the menu, so you can leave the route at any point.
      </p>
      <ol className="sj-route" data-testid="guided-route">
        {GUIDED_ROUTE.map((step, i) => (
          <li key={step.id} className="sj-route-step">
            <span className="sj-route-number" aria-hidden="true">{i + 1}</span>
            <div>
              <h3><RouteLink href={step.path}>{step.title}</RouteLink></h3>
              <p>{step.summary}</p>
              <p className="sj-route-shows">Shows: {step.shows.map(id => LOOP_STAGE_LABELS[id]).join(" · ")}</p>
            </div>
          </li>
        ))}
      </ol>
      <RouteLink href={GUIDED_ROUTE[0].path} className="sj-route-start" testId="guided-route-start">Start at step 1: {GUIDED_ROUTE[0].title} →</RouteLink>
    </section>
  );
}
