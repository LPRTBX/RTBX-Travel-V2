import type { Dispatch } from "react";
import {
  PortfolioState, PortfolioEvent, PortfolioChoice, portfolioPlan, portfolioConfirmations, portfolioOutcomes,
} from "@/lib/stage3Simulation";
import { Checks, Opt, Table } from "./shared";

const money = (n: number) => `A$${n}`;

export function PortfolioBody({ state, dispatch }: { state: PortfolioState; dispatch: Dispatch<PortfolioEvent> }) {
  const { step } = state;
  const planRows = (revised: boolean) => (["network", "local"] as PortfolioChoice[]).map(c => {
    const p = portfolioPlan(c, revised);
    return [c === "network" ? "Network relocation" : "Local readiness", `${p.city} City + ${p.park} Park + ${p.local} Harbour`, p.seats ? `${p.seats} seats` : "None", p.relocationMinutes ? `${p.relocationMinutes} min` : "n/a", `${p.localMinutes} min`, money(p.cost)];
  });
  const head = ["Plan", "Allocation (24 bookings)", "Transport", "Relocated forecast", "Local forecast", "Modelled cost"];

  if (step === 0) return (
    <>
      <p className="s3-note"><strong>Signal.</strong> A rail cancellation brings <strong>24 bookings / 48 guests</strong> to Harbour early. An outage and backlog put room readiness about <strong>90 minutes</strong> away. City has <strong>8</strong> potential rooms and Park <strong>6</strong>.</p>
      <Table caption="Capacity and accountable owners" head={["Site", "Capacity", "Accountable owner"]} rows={[
        ["Harbour", "24 bookings arriving; rooms ~90 min from ready", "Harbour Duty Manager"],
        ["City", "8 potential rooms (unconfirmed)", "City receiving manager"],
        ["Park", "6 potential rooms (unconfirmed)", "Park receiving manager"],
        ["Housekeeping", "Backlog clearing at Harbour", "Harbour Housekeeping Lead"],
        ["Transport", "Seats to be confirmed", "Transport coordinator"],
      ]} />
      <p className="s3-note">Capacity is potential until each owner confirms it. The simulation will not allocate anything on an unconfirmed assumption.</p>
    </>
  );

  if (step === 1) return (
    <>
      <div className="s3-opts">
        {(["network", "local"] as PortfolioChoice[]).map(c => {
          const p = portfolioPlan(c);
          return (
            <Opt key={c} testid={`choice-portfolio-${c}`} on={state.choice === c} onClick={() => dispatch({ type: "choose", choice: c })} title={c === "network" ? "Network relocation" : "Local readiness"}>
              <p>{c === "network" ? `Relocate ${p.relocated} bookings (${p.city} City, ${p.park} Park); ${p.local} stay at Harbour.` : "Keep all 24 bookings at Harbour."}</p>
              <p>Forecast: {p.relocationMinutes ? `${p.relocationMinutes} min relocated / ` : ""}{p.localMinutes} min local.</p>
              <p>Modelled cost {money(p.cost)}.</p>
            </Opt>
          );
        })}
      </div>
      <Table caption="Plan comparison" head={head} rows={planRows(false)} />
      {state.choice && (() => { const p = portfolioPlan(state.choice); return (
        <p className="s3-note"><strong>Breakdown:</strong> transport {money(p.transport)} + {money(p.relocationCost)} ({p.relocated} relocated at A$40) + {money(p.localCost)} ({p.local} local at A$15) = <strong>{money(p.cost)}</strong>. Modelled cost, not cash ROI. Waiting time is not converted to money.</p>
      ); })()}
    </>
  );

  if (step === 2) {
    const items = portfolioConfirmations(state.choice, false);
    return (
      <>
        <p className="s3-note">Each confirmation is recorded individually by its accountable owner. There is no confirm-all. Anything missing holds the plan.</p>
        <Checks prefix="confirm-portfolio" items={items} checked={state.confirmations} onToggle={id => dispatch({ type: "confirm", id })} />
      </>
    );
  }

  if (step === 3) {
    const initial = portfolioConfirmations(state.choice, false).filter(c => state.initialAuthorisation.includes(c.id));
    const items = portfolioConfirmations(state.revisedChoice, true);
    return (
      <>
        <p className="s3-note"><strong>Revision 1.</strong> City inspection withdraws 4 rooms: City falls from 8 to 4; Park stays at 6. The earlier City 8-room approval is no longer valid. {state.choice === "network" ? "Revised plan and budget, transport and guest agreements reopen." : "Your local plan does not depend on City, so its initial approval is not affected, but a renewed revised-plan confirmation is still required."} All approvals were cleared.</p>
        <h3 className="s3-h3">Initial authorisations (audit only, not carried forward)</h3>
        <ul className="s3-note">{initial.map(c => <li key={c.id}>{c.label} — {c.owner}</li>)}</ul>
        <h3 className="s3-h3">Replan</h3>
        <div className="s3-opts">
          <Opt testid="replan-portfolio-network" on={state.revisedChoice === "network"} onClick={() => dispatch({ type: "replan", choice: "network" })} title="Network: 4 City + 6 Park + 14 Harbour">
            <p>20 seats. Modelled cost {money(portfolioPlan("network", true).cost)}.</p>
          </Opt>
          <Opt testid="replan-portfolio-local" on={state.revisedChoice === "local"} onClick={() => dispatch({ type: "replan", choice: "local" })} title="Local: 24 at Harbour">
            <p>Modelled cost {money(portfolioPlan("local", true).cost)}.</p>
          </Opt>
        </div>
        <Table caption="Revised plan comparison" head={head} rows={planRows(true)} />
        {state.revisedChoice && <Checks prefix="reconfirm-portfolio" items={items} checked={state.confirmations} onToggle={id => dispatch({ type: "confirm", id })} />}
      </>
    );
  }

  const choice = state.revisedChoice ?? "local";
  const out = portfolioOutcomes(choice);
  if (step === 4) return (
    <>
      <p className="s3-note">Synthetic receipts for the revised plan. Receipts are illustrative, not live data.</p>
      <Table caption="Synthetic receipts" head={["Receipt", "Result", "Status"]} rows={choice === "network" ? [
        ["Network bookings", "10 checked in after 45 min; 20 guests transported", state.receiptReview ? "Reviewed · synthetic" : "Awaiting receipt review"],
        ["Harbour bookings", "13 checked in after 90 min", state.receiptReview ? "Reviewed · synthetic" : "Awaiting receipt review"],
        ["One booking", "Unconfirmed", "Open: Duty Manager"],
      ] : [
        ["Harbour bookings", "23 checked in after 90 min", state.receiptReview ? "Reviewed · synthetic" : "Awaiting receipt review"],
        ["One booking", "Unconfirmed", "Open: Duty Manager"],
      ]} />
      <ul className="s3-checks">
        <li><label className="s3-check" data-on={state.receiptReview}><input type="checkbox" data-testid="check-receipt-review" checked={state.receiptReview} onChange={() => dispatch({ type: "reviewReceipts" })} /><span>Receipts reviewed<small>Owner: Harbour Duty Manager</small></span></label></li>
        <li><label className="s3-check" data-on={state.followupAccepted}><input type="checkbox" data-testid="check-followup" checked={state.followupAccepted} onChange={() => dispatch({ type: "acceptFollowup" })} /><span>Alex (fictional Duty Manager) explicitly accepts follow-up ownership of the open booking<small>Owner: Alex</small></span></label></li>
      </ul>
    </>
  );

  const net = portfolioOutcomes("network"), loc = portfolioOutcomes("local");
  return (
    <>
      <h3 className="s3-h3">Result of the revised plan</h3>
      <p className="s3-note"><strong>{out.confirmedBookings} of {out.totalBookings}</strong> bookings confirmed, the same {out.confirmedGuests} confirmed guests under either plan. The unconfirmed booking contributes no success.</p>
      <p className="s3-hold">OPEN: one unconfirmed booking remains with Alex, fictional Harbour Duty Manager. Follow-up ownership accepted; no outcome or success recorded for that booking.</p>
      <Table caption="Paired outcome comparison" head={["Measure", "Network", "Local"]} rows={[
        ["Guest-minutes waiting", `${net.guestMinutes}`, `${loc.guestMinutes}`],
        ["Difference vs local", `${net.fewerMinutes} fewer`, "0"],
        ["Modelled cost", money(net.modelledCost), money(loc.modelledCost)],
        ["Confirmed guests", `${net.confirmedGuests}`, `${loc.confirmedGuests}`],
      ]} />
      <p className="s3-note">Your plan: {choice === "network" ? `${out.guestMinutes} vs paired local ${out.referenceGuestMinutes} guest-minutes, ${out.fewerMinutes} fewer.` : `${out.guestMinutes} vs ${out.referenceGuestMinutes}, no change.`} Costs are modelled ({money(850)} / {money(360)}), not cash ROI. Waiting time is not money.</p>
      <h3 className="s3-h3">Proposed learning</h3>
      <ul className="s3-note"><li>Reconfirm inventory before allocation.</li><li>Show the fallback plan alongside the primary.</li><li>Reopen approval after any capacity change.</li></ul>
      <ul className="s3-checks"><li><label className="s3-check" data-on={state.trialApprovals.includes("group")}><input type="checkbox" data-testid="check-trial-group" checked={state.trialApprovals.includes("group")} onChange={() => dispatch({ type: "trial", id: "group" })} /><span>Group Operations approves a limited next-disruption trial (optional)<small>Owner: Group Operations</small></span></label></li></ul>
      <p className={state.trialApprovals.includes("group") ? "s3-hold s3-ok" : "s3-hold"} role="status">{state.trialApprovals.includes("group") ? "Limited next-disruption trial authorised in this fictional demonstration only." : "Learning proposal awaiting Group Operations review; no trial authorised."}</p>
      <p className="s3-hold">Still awaiting evidence on waiting time, failed allocation, workload and cost. This is not a rollout or outcome claim.</p>
    </>
  );
}
