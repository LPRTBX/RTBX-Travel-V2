import { useState, type ReactNode } from "react";
import "./journey-bar.css";
import { useLocation, useSearch } from "wouter";
import { GUIDED_ROUTE, PARTNER_ROOM_HOME_ORIENTATION, SECTION_PURPOSE, findJourneyStep } from "@/data/partnerJourney";
import { NAV_GROUPS, usePartnerRoomNavigate } from "@/components/PartnerRoomLayout";

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
        <details className="journey-step-picker">
          <summary>All steps<span className="sr-only">: explore the eight journey steps</span></summary>
          <ol>
            {GUIDED_ROUTE.map((item, i) => <li key={item.id}>
              <Link href={item.path}><span>{i + 1}.</span> {item.title}</Link>
            </li>)}
          </ol>
        </details>
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

/** The menu section and page for a route outside the guided route, and the next page in that section. */
function findReferencePage(pathname: string) {
  for (const group of NAV_GROUPS) {
    const pages = group.items.filter(item => !/[?#]/.test(item.path));
    const index = pages.findIndex(item => item.path === pathname);
    if (index !== -1) return { section: group.label, label: pages[index].label, next: pages[index + 1] };
  }
  return { section: "Reference material", label: undefined, next: undefined };
}

/**
 * Answers, at the top of every Partner Room screen: what is on this screen, what to do here,
 * and what it shows a hotel. On narrow screens the action stays visible and the rest opens on demand.
 */
export function PageOrientation() {
  const [location] = useLocation();
  const search = useSearch();
  const [wide] = useState(() => typeof window === "undefined" || window.matchMedia("(min-width: 900px)").matches);
  const match = findJourneyStep(location, search);
  const home = location === "/partner-room";
  if (match || home) {
    const about = match ? match.step.orientation : PARTNER_ROOM_HOME_ORIENTATION;
    return (
      <section className="page-orientation" aria-label="About this screen" data-testid="page-orientation">
        <details className="page-orientation-inner" open={wide}>
          <summary><span className="page-orientation-key">Do here</span><span data-testid="orientation-do">{about.doHere}</span></summary>
          <dl>
            <div><dt>On this screen</dt><dd data-testid="orientation-screen">{about.onScreen}</dd></div>
            <div><dt>For a hotel</dt><dd data-testid="orientation-hotel">{about.forHotel}</dd></div>
          </dl>
        </details>
      </section>
    );
  }
  const page = findReferencePage(location);
  return (
    <section className="page-orientation page-orientation-reference" aria-label="About this screen" data-testid="page-orientation">
      <div className="page-orientation-inner">
        <p className="page-orientation-where"><span className="page-orientation-key">You are in</span>
          <span data-testid="orientation-where">{page.section}{page.label ? ` › ${page.label}` : ""}</span>
          <span className="page-orientation-aside">Reference material, outside the eight-step guided route.</span>
        </p>
        <p className="page-orientation-hotel"><span className="page-orientation-key">For a hotel</span><span data-testid="orientation-hotel">{SECTION_PURPOSE[page.section]}</span></p>
        <p className="page-orientation-links">
          <Link href={ROUTE_HOME} className="page-orientation-return" data-testid="orientation-return">← Return to the guided route</Link>
          {page.next && <Link href={page.next.path} className="page-orientation-next">Next in {page.section}: {page.next.label} →</Link>}
        </p>
      </div>
    </section>
  );
}
