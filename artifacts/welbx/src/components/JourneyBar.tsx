import type { ReactNode } from "react";
import "./journey-bar.css";
import { useLocation, useSearch } from "wouter";
import { GUIDED_ROUTE, findJourneyStep } from "@/data/partnerJourney";
import { usePartnerRoomNavigate } from "@/components/PartnerRoomLayout";

/** A real link (works without JavaScript, opens in a new tab) that scrolls within the current page when it can. */
function Link({ href, className, children, ...rest }: { href: string; className?: string; children: ReactNode; "data-testid"?: string }) {
  const navigateTo = usePartnerRoomNavigate();
  return (
    <a
      href={href}
      className={className}
      {...rest}
      onClick={event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateTo(href);
      }}
    >{children}</a>
  );
}

const ROUTE_HOME = "/partner-room#guided-route";

/** Where the visitor is on the guided route, shown above the page content. */
export function JourneyProgress() {
  const [location] = useLocation();
  const search = useSearch();
  const match = findJourneyStep(location, search);
  if (!match) return null;
  const { step, index } = match;
  const next = GUIDED_ROUTE[index + 1];
  return (
    <nav className="journey-progress" aria-label="Guided route progress" data-testid="journey-progress">
      <div className="journey-progress-inner">
        <Link href={ROUTE_HOME} className="journey-progress-home">Guided route</Link>
        <span className="journey-progress-step" aria-current="step">Step {index + 1} of {GUIDED_ROUTE.length}: {step.title}</span>
        <ol className="journey-progress-dots" aria-hidden="true">
          {GUIDED_ROUTE.map((item, i) => <li key={item.id} className={i < index ? "done" : i === index ? "current" : ""} />)}
        </ol>
        {next && <Link href={next.path} className="journey-progress-next">Next: {next.title} →</Link>}
      </div>
    </nav>
  );
}

/** Previous and next steps, shown after the page content. */
export function JourneyNext() {
  const [location] = useLocation();
  const search = useSearch();
  const match = findJourneyStep(location, search);
  if (!match) return null;
  const { index } = match;
  const previous = GUIDED_ROUTE[index - 1];
  const next = GUIDED_ROUTE[index + 1];
  return (
    <nav className="journey-next" aria-label="Guided route: previous and next step" data-testid="journey-next">
      <div className="journey-next-inner">
        {previous
          ? <Link href={previous.path} className="journey-next-link journey-next-prev"><span>Previous · step {index}</span>{previous.title}</Link>
          : <Link href={ROUTE_HOME} className="journey-next-link journey-next-prev"><span>Start</span>The guided route</Link>}
        {next
          ? <Link href={next.path} className="journey-next-link journey-next-forward" data-testid="journey-next-step"><span>Next · step {index + 2} of {GUIDED_ROUTE.length}</span>{next.title} →<small>{next.summary}</small></Link>
          : <Link href="/partner-room/next-step" className="journey-next-link journey-next-forward" data-testid="journey-next-step"><span>Route complete</span>Discuss a named pilot →<small>Agree the property, the accountable people and the outcome to measure.</small></Link>}
      </div>
    </nav>
  );
}
