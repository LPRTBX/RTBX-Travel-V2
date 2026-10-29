import { useState } from "react";
import {
  SUPPORT_ROLES, initialSupportState, reduceSupport, supportView,
  type SupportAction, type SupportRole, type SupportState,
} from "@/lib/wellbeingSupport";
import "./wellbeing-support.css";

const DISCLOSURE = "Interactive fictional demonstration. Scripted AI suggestions; no live model calls, external messages or stored personal data.";
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Fictional wellbeing coordination story. State is owned here; every visible fact derives from supportView(state, role). */
export function WellbeingSupportScenario() {
  const [state, setState] = useState<SupportState>(initialSupportState);
  const [role, setRole] = useState<SupportRole>("Guest");
  const view = supportView(state, role);
  const act = (type: SupportAction) => setState(s => reduceSupport(s, role, type));
  const actions = view.actions.filter(a => a.type !== "reset");
  const reset = view.actions.find(a => a.type === "reset");

  return (
    <section className="wbs" aria-labelledby="wbs-h" data-testid="panel-wellbeing-support">
      <div className="wbs-hero">
        <span className="wbs-k">Coordinate wellbeing support · fictional story</span>
        <h2 id="wbs-h">A guest needs support. <span>Your whole hotel knows how to respond.</span></h2>
        <ul className="wbs-promise" aria-label="Promise">
          <li>Connect the right people.</li>
          <li>Coordinate agreed actions.</li>
          <li>Keep follow-up visible.</li>
        </ul>
        <p className="wbs-disc" data-testid="text-wellbeing-disclosure">{DISCLOSURE}</p>
      </div>

      <div className="wbs-body">
        <div className="wbs-roles">
          <fieldset>
            <legend className="wbs-k">Fictional views · not authentication · progress is kept when you switch</legend>
            {SUPPORT_ROLES.map(r => (
              <button key={r} type="button" className="wbs-role" aria-pressed={role === r}
                data-testid={`button-wellbeing-role-${slug(r)}`} onClick={() => setRole(r)}>{r}</button>
            ))}
          </fieldset>
          <p className="wbs-small">Each view shows only what that role may see. Switch views to carry the story between people.</p>
        </div>

        <div className="wbs-next" aria-live="polite" data-testid="panel-wellbeing-next">
          <div className="wbs-badges">
            <span className="wbs-pill">Viewing as {role}</span>
            <span className="wbs-pill">Plan version {view.version}</span>
            <span className="wbs-pill o" data-testid="status-wellbeing">{view.status}</span>
          </div>
          <span className="wbs-k">Next action</span>
          <p className="do" data-testid="text-wellbeing-next">{view.next}</p>
        </div>

        <div className="wbs-card">
          <span className="wbs-k">Actions for this view</span>
          <h3>What {role} can record now</h3>
          {actions.length === 0 ? <p className="wbs-empty">No actions for this view yet. Switch fictional view to continue.</p> : (
            <div className="wbs-actions">
              {actions.map(a => {
                const id = `wbs-reason-${a.type}`;
                return (
                  <div className="wbs-act" key={a.type}>
                    <button type="button" className="wbs-btn" disabled={!a.enabled} aria-describedby={id}
                      data-testid={`button-wellbeing-${a.type}`} onClick={() => act(a.type)}>{a.label}</button>
                    <span id={id} className="wbs-small">{a.enabled ? "" : "Not yet: "}{a.reason}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="wbs-grid">
          <div className="wbs-card">
            <span className="wbs-k">Source facts</span>
            <h3>Reported, not inferred</h3>
            <ul className="wbs-list" data-testid="list-wellbeing-facts">{view.facts.map(f => <li key={f}>{f}</li>)}</ul>
            <p className="wbs-ai">{view.suggestion}</p>
          </div>
          <div className="wbs-card">
            <span className="wbs-k">Communications</span>
            <h3>Records visible to {role}</h3>
            {view.records.length === 0 ? (
              <p className="wbs-empty">No communication records for this view yet. Drafts appear after manager approval; recipients see them only once released.</p>
            ) : (
              <div className="wbs-comms" data-testid="list-wellbeing-records">
                {view.records.map(r => (
                  <article key={r.id} className={`wbs-msg ${r.status}`} data-testid={`record-wellbeing-${r.id}`}>
                    <header><h4>{r.purpose}</h4><span className={`wbs-pill${r.status === "Draft" ? " o" : ""}`}>{r.status} · v{r.version}</span></header>
                    {r.superseded && <p className="wbs-small"><strong>Earlier plan — not a current instruction.</strong> This record is retained, not reused as approval for the replacement.</p>}
                    <dl>
                      <dt>From</dt><dd>{r.author}</dd>
                      <dt>To</dt><dd>{r.recipients.join(", ")}</dd>
                      <dt>Time</dt><dd>{r.time}</dd>
                      {r.acknowledgedBy && <><dt>Acknowledged by</dt><dd>{r.acknowledgedBy} · {r.acknowledgedAt}</dd></>}
                    </dl>
                    <p>{r.message}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="wbs-grid">
          <div className="wbs-card">
            <span className="wbs-k">Open items and ownership</span>
            <h3>Summary for this view</h3>
            <ul className="wbs-list" data-testid="list-wellbeing-summary">{view.summary.map(s => <li key={s}>{s}</li>)}</ul>
            <p className="wbs-small" style={{ marginTop: 12 }}>The Duty Manager owns the timed follow-up. Guest feedback is recorded separately from delivered support. Room repair stays open until cleared.</p>
          </div>
          <div className="wbs-card">
            <span className="wbs-k">History · {view.history.length} entries visible</span>
            <h3>What has been recorded</h3>
            {view.history.length === 0 ? <p className="wbs-empty">Nothing recorded in this view yet.</p> : (
              <ol className="wbs-list wbs-hist" data-testid="list-wellbeing-history">
                {view.history.map((h, i) => <li key={i}><time>{h.time} · v{h.version}</time><span>{h.text}</span></li>)}
              </ol>
            )}
          </div>
        </div>

        <div>
          <span className="wbs-k">Each step is its own evidence</span>
          <ol className="wbs-chain" style={{ marginTop: 10 }}>
            <li><b>Approval</b>A manager agrees the plan. Nothing is sent.</li>
            <li><b>Release</b>Records are dispatched. Not yet accepted.</li>
            <li><b>Acceptance</b>The named contact takes the handover.</li>
            <li><b>Arrival</b>The contact is with the guest. Not yet delivered.</li>
            <li><b>Delivered</b>Practical support given. Not a claim of improved wellbeing.</li>
          </ol>
        </div>

        {reset && (
          <div>
            <button type="button" className="wbs-btn reset" data-testid="button-wellbeing-reset" onClick={() => act("reset")}>{reset.label}</button>
            <p className="wbs-small" style={{ marginTop: 6 }}>{reset.reason}</p>
          </div>
        )}
      </div>
    </section>
  );
}
