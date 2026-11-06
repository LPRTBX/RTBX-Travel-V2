import { useRef, useState } from "react";
import { SAFE_ROLES, createSafeState, reduceSafe, safeView, type SafeRole, type SafeAction } from "./safeguarding";
import "../components/partner-room/wellbeing-support.css";
import "./safeguarding.css";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const IMG = "/images/travel/arrival-hero.webp";
type Spec = { type: SafeAction; label: string; reason: string; enabled?: boolean };
const FEEDBACK = ["safer", "still-unsafe", "pending"];

/** Fictional safeguarding story. State owned here; every visible fact derives from safeView(state, role). */
export function SafeguardingScenario() {
  const [state, setState] = useState(createSafeState);
  const [role, setRole] = useState<SafeRole>("Reception");
  const nextPanel = useRef<HTMLDivElement>(null);
  const view = safeView(state, role);
  const act = (type: SafeAction) => setState(s => reduceSafe(s, role, type));

  const alts = (view.alternatives as Spec[]).filter(a => a.type !== "reset");
  const feedback = alts.filter(a => FEEDBACK.includes(String(a.type)));
  const optional = alts.filter(a => !FEEDBACK.includes(String(a.type)));
  const reset = (view.alternatives as Spec[]).find(a => a.type === "reset");
  const earlier = view.records.slice(0, -5);
  const recent = view.records.slice(-5);
  const record = (r: typeof view.records[number]) => (
    <li key={r.id} className={`wbs-msg ${r.status}`} data-testid={`record-safe-${r.id}`}>
      <div className="wbs-msg-h"><strong>{r.purpose}</strong><span className={`wbs-pill${r.status === "Draft" ? " o" : ""}`}>{r.status} · v{r.version}</span></div>
      <p className="wbs-small">{r.time} · {r.author} → {r.recipients.join(", ")}</p>
      {r.version !== view.version && <p className="wbs-small"><strong>Earlier plan — not a current instruction.</strong></p>}
      <p>{r.message}</p>
    </li>
  );

  const btn = (a: Spec, cls = "", scope = "o") => {
    const id = `sg-${scope}-reason-${a.type}`;
    return (
      <div className="wbs-act" key={`${scope}-${a.type}`}>
        <button type="button" className={`wbs-btn ${cls}`} disabled={a.enabled === false} aria-describedby={id}
          data-testid={`button-safe-${a.type}`} onClick={() => act(a.type)}>{a.label}</button>
        <span id={id} className="wbs-small">{a.reason}</span>
      </div>
    );
  };

  return (
    <section className="wbs sg" aria-labelledby="sg-h" data-testid="panel-safeguarding">
      <div className="wbs-hero">
        <div className="wbs-hero-text">
          <span className="wbs-k">Safeguarding · Fictional demonstration</span>
          <h2 id="sg-h">Guest feels unsafe. A discreet response, with accountable people.</h2>
          <p className="wbs-lede" data-testid="text-safe-intro">{view.intro}</p>
          <details className="wbs-about">
            <summary>About this demo</summary>
            <p data-testid="text-safe-disclosure">Fictional demonstration. Suggestions are scripted — no AI models run, and no real messages or calls are sent.</p>
            <p>Role views are fictional perspectives, not authentication. This is not medical advice and does not describe a universal legal rule; follow your own hotel procedures and local law.</p>
          </details>
        </div>
        <figure className="wbs-photo">
          <img src={IMG} alt="A calm, warmly lit hotel entrance" loading="lazy" />
          <figcaption>Illustrative hotel image — not a guest-support record.</figcaption>
        </figure>
      </div>

      <div className="wbs-body">
        <div className="sg-emergency" role="region" aria-labelledby="sg-em-h" data-testid="panel-safe-emergency">
          <strong id="sg-em-h">If anyone is in immediate danger</strong>
          <p>Follow your hotel emergency procedures and contact local emergency services. This demo cannot place calls.</p>
          {view.emergencyActions.length > 0 && (
            <div className="wbs-alts">{(view.emergencyActions as Spec[]).map(a => btn(a, "alt", "e"))}</div>
          )}
        </div>

        <div className="wbs-roles" role="group" aria-labelledby="sg-roles-l">
          <span id="sg-roles-l" className="wbs-k">Choose a role</span>
          <div className="wbs-tabs">
            {SAFE_ROLES.map(r => (
              <button key={r} type="button" className="wbs-role" aria-pressed={role === r}
                data-testid={`button-safe-role-${slug(r)}`} onClick={() => setRole(r)}>{r}</button>
            ))}
          </div>
          <p className="wbs-small">Fictional perspectives, not sign-in permissions. Switching keeps progress and takes no action.</p>
        </div>

        <div className="wbs-next" aria-live="polite" tabIndex={-1} ref={nextPanel} aria-label="Your role and next action">
          <div className="wbs-badges">
            <span className="wbs-pill">Viewing as {role}</span>
            <span className="wbs-pill">Plan v{view.version}</span>
            <span className="wbs-pill">Demo time {view.clock}</span>
            <span className="wbs-pill o" data-testid="status-safe">{view.status}</span>
          </div>
          <p className="do" data-testid="text-safe-next">{view.context}</p>
          {view.feedbackNotice && <p role="status" className="wbs-scope" data-testid="status-safe-feedback">{view.feedbackNotice}</p>}
          {view.primary && <div className="wbs-primary">{btn(view.primary as Spec, "main", "p")}</div>}
          {feedback.length > 0 && <div className="wbs-alts">{feedback.map(a => btn(a, "alt"))}</div>}
          {view.handover && view.handover !== role && (
            <div className="wbs-handover">
              <p>The next accountable step sits with {view.handover}.</p>
              <button type="button" className="wbs-btn ghost" data-testid="button-safe-continue"
                onClick={() => { setRole(view.handover as SafeRole); requestAnimationFrame(() => nextPanel.current?.focus()); }}>Continue as {view.handover}</button>
            </div>
          )}
          {optional.length > 0 && (
            <details className="wbs-more">
              <summary>Other decisions ({optional.length})</summary>
              <div className="wbs-alts">{optional.map(a => btn(a, "alt"))}</div>
            </details>
          )}
        </div>

        <div className="wbs-grid">
          <div className="wbs-card">
            <span className="wbs-k">Open concern</span>
            <ul className="wbs-list" data-testid="list-safe-summary">{view.summary.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
          <div className="wbs-card wbs-comms">
            <span className="wbs-k">Coordinated response</span>
            {view.records.length === 0 ? (
              <p className="wbs-empty">No communication records for this view yet.</p>
            ) : (
              <>
                <p className="wbs-small">Event statuses describe what was recorded then. Current open items are shown alongside.</p>
                {earlier.length > 0 && <details className="wbs-more">
                  <summary>Earlier communication records ({earlier.length})</summary>
                  <ol className="wbs-tl">{earlier.map(record)}</ol>
                </details>}
                <ol className="wbs-tl" data-testid="list-safe-records">{recent.map(record)}</ol>
              </>
            )}
          </div>
        </div>

        <details className="wbs-more">
          <summary>Source facts and scripted suggestion</summary>
          <ul className="wbs-list" data-testid="list-safe-facts">{view.facts.map((f, i) => <li key={i}>{f}</li>)}</ul>
          <p className="wbs-ai">{view.suggestion}</p>
        </details>

        {view.history.length > 0 && (
          <details className="wbs-more">
            <summary>Detailed history ({view.history.length})</summary>
            <ol className="wbs-list wbs-hist" data-testid="list-safe-history">
              {view.history.map((h, i) => <li key={i}><time>{h.time} · v{h.version}</time><span>{h.text}</span></li>)}
            </ol>
          </details>
        )}

        <div className="wbs-reset">
          <button type="button" className="wbs-btn reset" data-testid="button-safe-reset" onClick={() => { act("reset"); setRole("Reception"); }}>{reset?.label ?? "Reset this scenario"}</button>
          <span className="wbs-small">{reset?.reason ?? "Restarts this safeguarding story only."}</span>
        </div>
      </div>
    </section>
  );
}

export default SafeguardingScenario;
