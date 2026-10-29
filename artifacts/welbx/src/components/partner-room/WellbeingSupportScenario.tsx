import { useState } from "react";
import {
  SUPPORT_ROLES, initialSupportState, reduceSupport, supportView,
  type SupportAction, type SupportRole, type SupportState,
} from "@/lib/wellbeingSupport";
import "./wellbeing-support.css";

const DISCLOSURE = "Interactive fictional demonstration. Scripted AI suggestions; no live model calls, external messages or stored personal data.";
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
// Approved public image is served by the Travel root, not the public bundle's asset prefix.
const IMG = "/images/travel/arrival-hero.webp";

type Spec = { type: SupportAction; label: string; enabled: boolean; reason: string };
const SURFACE: SupportAction[] = ["helped", "needs-support", "pending", "followup"];

/** Fictional wellbeing coordination story. State is owned here; every visible fact derives from supportView(state, role). */
export function WellbeingSupportScenario() {
  const [state, setState] = useState<SupportState>(initialSupportState);
  const [role, setRole] = useState<SupportRole>("Guest");
  const view = supportView(state, role);
  const act = (type: SupportAction) => setState(s => reduceSupport(s, role, type));
  const reset = view.actions.find(a => a.type === "reset");

  const { primary, alternatives: alts, handover, context } = view.guidance;
  const surfaced = alts.filter(a => SURFACE.includes(a.type));
  const optional = alts.filter(a => !SURFACE.includes(a.type));

  const btn = (a: Spec, cls = "") => {
    const id = `wbs-reason-${a.type}`;
    return (
      <div className="wbs-act" key={a.type}>
        <button type="button" className={`wbs-btn ${cls}`} disabled={!a.enabled} aria-describedby={id}
          data-testid={`button-wellbeing-${a.type}`} onClick={() => act(a.type)}>{a.label}</button>
        <span id={id} className={a.type === "consent" ? "wbs-scope" : "wbs-small"}>{a.reason}</span>
      </div>
    );
  };

  return (
    <section className="wbs" aria-labelledby="wbs-h" data-testid="panel-wellbeing-support">
      <div className="wbs-hero">
        <div className="wbs-hero-text">
          <span className="wbs-k">The situation · Fictional demonstration</span>
          <h2 id="wbs-h">A guest's room is delayed, and they've asked for somewhere quiet.</h2>
          <p className="wbs-lede">At 3:25 pm, a guest asks: “Could I wait somewhere quieter and have some practical help?” The team needs an available space, someone who can help and a named person to follow up. Room repair stays a separate job.</p>
          <details className="wbs-about">
            <summary>About this demo</summary>
            <p data-testid="text-wellbeing-disclosure">{DISCLOSURE}</p>
            <p>Each role view shows only what that role may see. Views are not authentication; progress is kept when you switch.</p>
          </details>
        </div>
        <figure className="wbs-photo">
          <img src={IMG} alt="A hotel host welcoming a guest at a warmly lit entrance" loading="lazy" />
          <figcaption>Illustrative image — not a real guest or record.</figcaption>
        </figure>
      </div>

      <div className="wbs-body">
        <div className="wbs-roles" role="group" aria-labelledby="wbs-roles-l">
          <span id="wbs-roles-l" className="wbs-k">Choose a role</span>
          <div className="wbs-tabs">
            {SUPPORT_ROLES.map(r => (
              <button key={r} type="button" className="wbs-role" aria-pressed={role === r}
                data-testid={`button-wellbeing-role-${slug(r)}`} onClick={() => setRole(r)}>{r}</button>
            ))}
          </div>
           <p className="wbs-small">Fictional perspectives, not sign-in permissions. Switching views keeps progress and carries out no action.</p>
        </div>

        <div className="wbs-next" aria-live="polite" data-testid="panel-wellbeing-next">
          <div className="wbs-badges">
            <span className="wbs-pill">Viewing as {role}</span>
            <span className="wbs-pill">Plan v{view.version}</span>
            <span className="wbs-pill">Demo time {view.clock}</span>
            <span className="wbs-pill o" data-testid="status-wellbeing">{view.status}</span>
          </div>
          <p className="do" data-testid="text-wellbeing-next">{context}</p>
          {view.feedbackNotice && <p role="status" className="wbs-scope" data-testid="status-wellbeing-feedback">{view.feedbackNotice}</p>}

          {primary && (
            <div className="wbs-primary">
              {btn(primary, "main")}
            </div>
          )}

          {surfaced.length > 0 && <div className="wbs-alts">{surfaced.map(a => btn(a, "alt"))}</div>}

          {handover && (
            <div className="wbs-handover">
              <p>{handover.text}</p>
              {handover.role !== role && (
                <button type="button" className="wbs-btn ghost" data-testid="button-wellbeing-continue"
                  onClick={() => setRole(handover.role)}>Continue as {handover.role}</button>
              )}
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
            <span className="wbs-k">Where things stand</span>
            <ul className="wbs-list" data-testid="list-wellbeing-summary">{view.summary.map(s => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="wbs-card wbs-comms">
            <span className="wbs-k">Coordinated response</span>
            {view.records.length === 0 ? (
              <p className="wbs-empty">No communication records for this view yet.</p>
            ) : (
              <ol className="wbs-tl" data-testid="list-wellbeing-records">
                {view.records.map(r => (
                  <li key={r.id} className={`wbs-msg ${r.status}`} data-testid={`record-wellbeing-${r.id}`}>
                    <div className="wbs-msg-h"><strong>{r.purpose}</strong><span className={`wbs-pill${r.status === "Draft" ? " o" : ""}`}>{r.status} · v{r.version}</span></div>
                    <p className="wbs-small">{r.time} · {r.author} → {r.recipients.join(", ")}
                      {r.acknowledgedBy && <> · acknowledged by {r.acknowledgedBy} at {r.acknowledgedAt}</>}</p>
                    {r.superseded && <p className="wbs-small"><strong>Earlier plan — not a current instruction.</strong></p>}
                    <p>{r.message}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <details className="wbs-more">
          <summary>Source facts and scripted suggestion</summary>
          <ul className="wbs-list" data-testid="list-wellbeing-facts">{view.facts.map(f => <li key={f}>{f}</li>)}</ul>
          <p className="wbs-ai">{view.suggestion}</p>
        </details>

        {view.history.length > 0 && (
          <details className="wbs-more">
            <summary>Detailed history ({view.history.length})</summary>
            <ol className="wbs-list wbs-hist" data-testid="list-wellbeing-history">
              {view.history.map((h, i) => <li key={i}><time>{h.time} · v{h.version}</time><span>{h.text}</span></li>)}
            </ol>
          </details>
        )}

        {reset && (
          <div className="wbs-reset">
            <button type="button" className="wbs-btn reset" data-testid="button-wellbeing-reset" onClick={() => act("reset")}>{reset.label}</button>
            <span className="wbs-small">{reset.reason}</span>
          </div>
        )}
      </div>
    </section>
  );
}
