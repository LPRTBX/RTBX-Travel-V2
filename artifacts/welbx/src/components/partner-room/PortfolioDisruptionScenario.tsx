import { useReducer, type ReactNode } from "react";
import {
  PORTFOLIO_STEPS, initialPortfolio, portfolioConfirmations, portfolioOutcomes, portfolioPlan, portfolioReady,
  portfolioReducer, type Confirmation, type PortfolioChoice,
} from "@/lib/portfolioDisruption";
import "./portfolio-disruption.css";

const money = (n: number) => `A$${n}`;
const CHOICES: PortfolioChoice[] = ["network", "local"];

function Table({ caption, head, rows }: { caption: string; head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="pdemo-wrap" tabIndex={0} role="region" aria-label={caption}>
      <table><caption className="sr-only">{caption}</caption>
        <thead><tr>{head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Checks({ prefix, items, checked, onToggle }: { prefix: string; items: Confirmation[]; checked: string[]; onToggle: (id: string) => void }) {
  return (
    <ul className="pdemo-list">
      {items.map(c => (
        <li key={c.id}><label className="pdemo-check">
          <input type="checkbox" data-testid={`${prefix}-${c.id}`} checked={checked.includes(c.id)} onChange={() => onToggle(c.id)} />
          <span>{c.label}<small>Owner: {c.owner}</small></span>
        </label></li>
      ))}
    </ul>
  );
}

function Opt({ id, on, onClick, title, children }: { id: string; on: boolean; onClick: () => void; title: string; children: ReactNode }) {
  return <button type="button" className="pdemo-opt" data-testid={id} aria-pressed={on} onClick={onClick}><strong>{title}</strong>{children}</button>;
}

export function PortfolioDisruptionScenario() {
  const [state, dispatch] = useReducer(portfolioReducer, undefined, initialPortfolio);
  const { step } = state;
  const head = ["Plan", "Allocation (24 bookings)", "Transport", "Relocated forecast", "Local forecast", "Modelled cost"];
  const planRows = (revised: boolean) => CHOICES.map(c => {
    const p = portfolioPlan(c, revised);
    return [c === "network" ? "Network relocation" : "Local readiness", `${p.city} City + ${p.park} Park + ${p.local} Harbour`, p.seats ? `${p.seats} seats` : "None", p.relocationMinutes ? `${p.relocationMinutes} min` : "n/a", `${p.localMinutes} min`, money(p.cost)];
  });

  let body: ReactNode;
  if (step === 0) body = (
    <>
      <p><strong>Recognise.</strong> A rail cancellation brings <strong>24 bookings / 48 guests</strong> to Harbour early. An outage and backlog put room readiness about <strong>90 minutes</strong> away. City has <strong>8</strong> potential rooms and Park <strong>6</strong>.</p>
      <Table caption="Property capacity and accountable owners" head={["Site", "Capacity", "Accountable owner"]} rows={[
        ["Harbour", "24 bookings arriving; rooms ~90 min from ready", "Harbour Duty Manager"],
        ["City", "8 potential rooms (unconfirmed)", "City receiving manager"],
        ["Park", "6 potential rooms (unconfirmed)", "Park receiving manager"],
        ["Housekeeping", "Backlog clearing at Harbour", "Harbour Housekeeping Lead"],
        ["Transport", "Seats to be confirmed", "Transport coordinator"],
      ]} />
      <p>Capacity is potential until each owner confirms it. Nothing is allocated on an unconfirmed assumption.</p>
    </>
  );
  else if (step === 1) {
    const p = state.choice ? portfolioPlan(state.choice) : null;
    body = (
      <>
        <div className="pdemo-opts">
          {CHOICES.map(c => { const q = portfolioPlan(c); return (
            <Opt key={c} id={`pd-choice-${c}`} on={state.choice === c} onClick={() => dispatch({ type: "choose", choice: c })} title={c === "network" ? "Network relocation" : "Local readiness"}>
              <p>{c === "network" ? `Relocate ${q.relocated} bookings (${q.city} City, ${q.park} Park); ${q.local} stay at Harbour.` : "Keep all 24 bookings at Harbour."}</p>
              <p>Forecast: {q.relocationMinutes ? `${q.relocationMinutes} min relocated / ` : ""}{q.localMinutes} min local. Modelled cost {money(q.cost)}.</p>
            </Opt>); })}
        </div>
        <Table caption="Plan comparison" head={head} rows={planRows(false)} />
        {p && <p><strong>Breakdown:</strong> transport {money(p.transport)} + {money(p.relocationCost)} ({p.relocated} relocated at A$40) + {money(p.localCost)} ({p.local} local at A$15) = <strong>{money(p.cost)}</strong>. Modelled cost, not cash ROI; waiting time is not converted to money.</p>}
      </>
    );
  } else if (step === 2) body = (
    <>
      <p>Each confirmation is a fictional demo assertion by its owner, not sign-in or dispatch. No confirm-all. Anything missing holds the plan.</p>
      <Checks prefix="pd-confirm" items={portfolioConfirmations(state.choice, false)} checked={state.confirmations} onToggle={id => dispatch({ type: "confirm", id })} />
    </>
  );
  else if (step === 3) {
    const initial = portfolioConfirmations(state.choice, false).filter(c => state.initialAuthorisation.includes(c.id));
    body = (
      <>
        <p><strong>Revision 1.</strong> City inspection withdraws 4 rooms: City falls from 8 to 4; Park stays at 6. The earlier City approval is no longer valid. {state.choice === "network" ? "Plan and budget, transport and guest agreements reopen." : "Your local plan does not depend on City, but renewed confirmation is still required."} All approvals were cleared; the audit history is kept.</p>
        <h3>Initial authorisations (audit only, not carried forward)</h3>
        <ul>{initial.map(c => <li key={c.id}>{c.label}: {c.owner}</li>)}</ul>
        <h3>Replan</h3>
        <div className="pdemo-opts">
          <Opt id="pd-replan-network" on={state.revisedChoice === "network"} onClick={() => dispatch({ type: "replan", choice: "network" })} title="Network: 4 City + 6 Park + 14 Harbour"><p>20 seats. Modelled cost {money(portfolioPlan("network", true).cost)}.</p></Opt>
          <Opt id="pd-replan-local" on={state.revisedChoice === "local"} onClick={() => dispatch({ type: "replan", choice: "local" })} title="Local: 24 at Harbour"><p>Modelled cost {money(portfolioPlan("local", true).cost)}.</p></Opt>
        </div>
        <Table caption="Revised plan comparison" head={head} rows={planRows(true)} />
        {state.revisedChoice && <Checks prefix="pd-reconfirm" items={portfolioConfirmations(state.revisedChoice, true)} checked={state.confirmations} onToggle={id => dispatch({ type: "confirm", id })} />}
      </>
    );
  } else if (step === 4) {
    const choice = state.revisedChoice ?? "local";
    const st = state.receiptReview ? "Reviewed · synthetic" : "Unreviewed · awaiting receipt review";
    body = (
      <>
        <p>Synthetic receipts for the revised plan. They are unreviewed until reviewed, and are not live data.</p>
        <Table caption="Synthetic receipts" head={["Receipt", "Result", "Status"]} rows={choice === "network" ? [
          ["Network bookings", "10 checked in after 45 min; 20 guests transported", st],
          ["Harbour bookings", "13 checked in after 90 min", st],
          ["One booking", "Unconfirmed", "OPEN: Alex, Harbour Duty Manager"],
        ] : [
          ["Harbour bookings", "23 checked in after 90 min", st],
          ["One booking", "Unconfirmed", "OPEN: Alex, Harbour Duty Manager"],
        ]} />
        <ul className="pdemo-list">
          <li><label className="pdemo-check"><input type="checkbox" data-testid="pd-receipt-review" checked={state.receiptReview} onChange={() => dispatch({ type: "reviewReceipts" })} /><span>Receipts reviewed<small>Owner: Harbour Duty Manager</small></span></label></li>
          <li><label className="pdemo-check"><input type="checkbox" data-testid="pd-followup" checked={state.followupAccepted} onChange={() => dispatch({ type: "acceptFollowup" })} /><span>Alex (fictional Duty Manager) explicitly accepts follow-up ownership of the open booking<small>Owner: Alex</small></span></label></li>
        </ul>
      </>
    );
  } else {
    const choice = state.revisedChoice ?? "local";
    const out = portfolioOutcomes(choice), net = portfolioOutcomes("network"), loc = portfolioOutcomes("local");
    const trial = state.trialApprovals.includes("group");
    body = (
      <>
        <p><strong>{out.confirmedBookings} of {out.totalBookings}</strong> bookings confirmed; the same {out.confirmedGuests} confirmed guests under either plan. The unconfirmed booking contributes no success.</p>
        <p className="pdemo-hold">OPEN: one booking remains with Alex, fictional Harbour Duty Manager. Follow-up ownership accepted; no outcome or success is recorded for it.</p>
        <Table caption="Paired outcome comparison" head={["Measure", "Network", "Local"]} rows={[
          ["Guest-minutes waiting", `${net.guestMinutes}`, `${loc.guestMinutes}`],
          ["Difference vs paired synthetic local reference", `${net.fewerMinutes} fewer`, "0 fewer"],
          ["Modelled cost", money(net.modelledCost), money(loc.modelledCost)],
          ["Confirmed guests", `${net.confirmedGuests}`, `${loc.confirmedGuests}`],
        ]} />
        <p>Your plan: {out.guestMinutes} vs {out.referenceGuestMinutes}, {out.fewerMinutes ? `${out.fewerMinutes} fewer` : "0 fewer"}. Costs are modelled ({money(850)} / {money(360)}); no cash ROI is claimed and waiting time is not money.</p>
        <h3>Proposed learning</h3>
        <ul><li>Reconfirm inventory before allocation.</li><li>Show the fallback plan alongside the primary.</li><li>Reopen approval after any capacity change.</li></ul>
        <ul className="pdemo-list"><li><label className="pdemo-check"><input type="checkbox" data-testid="pd-trial-group" checked={trial} onChange={() => dispatch({ type: "trial", id: "group" })} /><span>Group Operations approves a limited next-disruption trial (optional)<small>Owner: Group Operations</small></span></label></li></ul>
        <p className={trial ? "pdemo-hold pdemo-ok" : "pdemo-hold"} role="status">{trial ? "Limited next-disruption trial authorised in this fictional demonstration only; no automatic rollout." : "Trial approval pending; no trial authorised."}</p>
        <p className="pdemo-hold">Still waiting on evidence: waiting time, failed allocations, workload and cost. This is not a rollout or outcome claim.</p>
      </>
    );
  }

  const holding = step === 2 || step === 3 || step === 4;
  const missingOwners = (step === 2 || step === 3)
    ? portfolioConfirmations(step === 3 ? state.revisedChoice : state.choice, step === 3).filter(c => !state.confirmations.includes(c.id)).map(c => c.owner)
    : [!state.receiptReview && "Harbour Duty Manager · receipt review", !state.followupAccepted && "Alex · follow-up ownership"].filter(Boolean);
  return (
    <section id="portfolio-disruption" className="pdemo" aria-labelledby="pdemo-title" data-testid="portfolio-disruption">
      <h2 id="pdemo-title">One disruption. Three hotels. A coordinated response.</h2>
      <p>Fictional synthetic inputs, approvals and receipts. No dispatch occurs and no authenticated role authority is implied. Approval, delivery evidence and unresolved outcomes stay distinct.</p>
      <ol className="pdemo-steps" aria-label="Scenario steps">
        {PORTFOLIO_STEPS.map((s, i) => <li key={s} aria-current={i === step ? "step" : undefined}>{i + 1}. {s}</li>)}
      </ol>
      <h3>{PORTFOLIO_STEPS[step]}</h3>
      {body}
      {holding && !portfolioReady(state) && <p className="pdemo-hold" role="status">Holding: {missingOwners.length ? `awaiting ${missingOwners.join("; ")}.` : "choose the revised plan before recording renewed confirmations."} The next step is blocked.</p>}
      <div className="pdemo-actions">
        {step < 5 && <button type="button" data-testid="pd-next" disabled={!portfolioReady(state)} onClick={() => dispatch({ type: "next" })}>Next</button>}
        <button type="button" className="pdemo-ghost" data-testid="pd-reset" onClick={() => dispatch({ type: "reset" })}>Reset Portfolio scenario</button>
      </div>
    </section>
  );
}
