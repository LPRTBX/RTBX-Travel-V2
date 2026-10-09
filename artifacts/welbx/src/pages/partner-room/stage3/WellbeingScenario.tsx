import type { Dispatch } from "react";
import {
  WellbeingState, WellbeingEvent, SupportChoice, HUMAN_REVIEW, FOLLOWUP_LEADS, supportConfirmations,
} from "@/lib/stage3Simulation";
import { Checks, Opt, Table } from "./shared";

export type Role = "restricted" | "shared" | "executive";
export const ROLE_LABEL: Record<Role, string> = { restricted: "Restricted support", shared: "Shared frontline + facilities", executive: "Executive" };
const SIGNALS = [
  "Fictional case W17 requests help reaching quieter waiting.",
  "The same case repeats the request 12 minutes later with no staff acknowledgement. This is one person, not two.",
  "The lift is unavailable; frontline reports congestion on the alternative accessible route.",
  "De-identified history: 3 missed accessible-assistance handoffs at peak arrivals across Harbour and City over 2 shifts.",
];

export function RoleBar({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <div className="s3-roles" role="group" aria-label="Demonstration role view">
      <span>Demo view:</span>
      {(Object.keys(ROLE_LABEL) as Role[]).map(r => (
        <button key={r} type="button" className="s3-btn" aria-pressed={role === r} onClick={() => setRole(r)} data-testid={`role-${r}`}>{ROLE_LABEL[r]}</button>
      ))}
      <span className="s3-note" style={{ margin: 0 }}>Demonstration view only. Not authenticated access control.</span>
    </div>
  );
}

function Alt({ state, role, steps, setRole }: { state: WellbeingState; role: Role; steps: string[]; setRole: (r: Role) => void }) {
  const choice = state.revisedChoice ?? state.choice;
  return (
    <div data-testid={`panel-${role}`}>
      {role === "shared" ? (
        <Table caption="Shared tasks" head={["Task", "Owner", "Status"]} rows={[
          ["Verify accessible route and lift status", "Facilities Lead", state.step >= 2 ? "Required" : "Awaiting review"],
          ["Staff coverage and relief", "Shift Lead", state.step >= 2 ? "Required" : "Not yet requested"],
          ["Named support contact at pickup or space", "Duty Manager", state.step >= 2 ? (choice ? "Assigned in plan" : "Pending") : "Not yet requested"],
          ["Vehicle and receiving room (transfer only)", "Transport / receiving manager", choice === "transfer" ? "Required" : "If needed"],
        ]} />
      ) : (
        <Table caption="Executive de-identified view" head={["Item", "Status"]} rows={[
           ["Pattern", state.revealed === 4 ? "Repeated unmet assistance, access constraint and recurring handoff failure (3 missed handoffs, 2 shifts)" : "Signal review in progress; no combined cue yet"],
          ["Current stage", steps[state.step]],
          ["Immediate response", state.step >= 5 && state.followupAccepted ? "Verified in simulation" : "In progress"],
          ["Follow-up", "Open"],
        ]} />
      )}
      <p className="s3-note">This view omits private preferences, case identifiers and individual accounts. Private verification controls exist only in the restricted view.</p>
      <button type="button" className="s3-btn s3-btn-primary" onClick={() => setRole("restricted")} data-testid="button-return-restricted">Return to restricted support view</button>
    </div>
  );
}

export function WellbeingBody({ state, dispatch, role, setRole, steps }: { state: WellbeingState; dispatch: Dispatch<WellbeingEvent>; role: Role; setRole: (r: Role) => void; steps: string[] }) {
  if (role !== "restricted") return <Alt state={state} role={role} steps={steps} setRole={setRole} />;
  const { step } = state;
  const opts = (revised: boolean, type: "choose" | "replan", current: SupportChoice | null) => (
    <div className="s3-opts">
      <Opt testid={`${type}-support-onsite`} on={current === "onsite"} onClick={() => dispatch({ type, choice: "onsite" })} title={revised ? "On-site, manager-covered, Jordan replacement contact" : "On-site accessible quiet space"}>
        <p>{revised ? "Alex covers; Jordan is the replacement named contact; clear route." : "Named contact (Taylor), clear route."}</p>
      </Opt>
      <Opt testid={`${type}-support-transfer`} on={current === "transfer"} onClick={() => dispatch({ type, choice: "transfer" })} title={revised ? "Park accessible transfer, vehicle and staff reverified" : "Supported City transfer"}>
        <p>{revised ? "Park accessible room and receiving staff; replacement suitable vehicle; guest agreement renewed." : "Receiving accessible room and staff, suitable vehicle, guest agreement."}</p>
      </Opt>
    </div>
  );

  if (step === 0) return (
    <>
      <ol className="s3-note" aria-live="polite">{SIGNALS.slice(0, state.revealed).map((s, i) => <li key={i}>{s}</li>)}</ol>
      {state.revealed < 4
        ? <button type="button" className="s3-btn" onClick={() => dispatch({ type: "reveal" })} data-testid="button-reveal">Reveal next signal ({state.revealed} of 4)</button>
        : <p className="s3-note"><strong>Combined cue:</strong> repeated unmet assistance, an access constraint and a recurring handoff failure call for Duty Manager review. This is not a diagnosis, welfare score or statement of cause.</p>}
    </>
  );
  if (step === 1) return (
    <>
      <p className="s3-note">Three individual human confirmations are needed before any intervention is chosen.</p>
      <Checks prefix="review-wellbeing" items={HUMAN_REVIEW} checked={state.humanReview} onToggle={id => dispatch({ type: "review", id })} />
    </>
  );
  if (step === 2) return (
    <>
      <p className="s3-note">No automatic relocation. Commercial offers are held for the affected guest. Immediate protection uses delegated site authority, not the commercial budget gate.</p>
      {opts(false, "choose", state.choice)}
      <Checks prefix="confirm-wellbeing" items={supportConfirmations(state.choice, false)} checked={state.confirmations} onToggle={id => dispatch({ type: "confirm", id })} />
    </>
  );
  if (step === 3) {
    const initial = supportConfirmations(state.choice, false).filter(c => state.initialAuthorisation.includes(c.id));
    return (
      <>
        <p className="s3-hold" role="status">Failure recorded automatically: {state.choice === "transfer" ? "the transfer vehicle was withdrawn before pickup." : "Taylor was called away before acknowledgement."} Assignment is not delivery; the guest's needs and ownership remain open.</p>
        <p className="s3-note">Approvals were cleared. Renewed guest agreement and minimum-necessary handoff are required. Fictional escalation: Alex, Duty Manager, owns the missed acknowledgement / delivery exception under the site rule. Immediate danger uses the site emergency procedure; this demo sends no emergency action.</p>
        <h3 className="s3-h3">Initial authorisations (audit only)</h3>
        <ul className="s3-note">{initial.map(c => <li key={c.id}>{c.label}</li>)}</ul>
        {opts(true, "replan", state.revisedChoice)}
        {state.revisedChoice && <Checks prefix="reconfirm-wellbeing" items={supportConfirmations(state.revisedChoice, true)} checked={state.confirmations} onToggle={id => dispatch({ type: "confirm", id })} />}
      </>
    );
  }
  const branch = state.revisedChoice === "transfer";
  if (step === 4) return (
    <>
      <p className="s3-note">Synthetic receipts, not live data.</p>
      <Table caption="Synthetic receipts" head={["Receipt", "Result"]} rows={[
        ["Route check", "Synthetic receipt recorded"], ["Human handoff", "Synthetic receipt recorded"],
        branch ? ["Park transfer", "Arrival and Park receiving staff acknowledgement recorded"] : ["Manager-covered on-site", "Jordan contact arrival and quiet accessible space recorded; Alex owns coverage"],
      ]} />
      <ul className="s3-checks"><li><label className="s3-check" data-on={state.receiptReview}><input type="checkbox" data-testid="check-receipt-review" checked={state.receiptReview} onChange={() => dispatch({ type: "reviewReceipts" })} /><span>Delivery reviewed<small>Owner: Duty Manager</small></span></label></li></ul>
      <fieldset className="s3-check" style={{ display: "block", marginBottom: 16 }}>
        <legend className="s3-card-title">Guest response (private)</legend>
        {(["accept", "decline"] as const).map(r => (
          <label key={r} style={{ display: "flex", gap: 8, margin: "6px 0" }}>
            <input type="radio" name="guest-response" data-testid={`radio-${r}`} checked={state.guestResponse === r} onChange={() => dispatch({ type: "response", response: r })} />
            {r === "accept" ? "Guest accepts the support" : "Guest declines further support. Not a failure: respect the choice and agree a help-again route."}
          </label>
        ))}
      </fieldset>
      {state.guestResponse === "decline" && (
        <label className="s3-check" data-on={state.helpRouteAgreed} style={{ marginBottom: 16 }}>
          <input type="checkbox" data-testid="check-help-route" checked={state.helpRouteAgreed} onChange={() => dispatch({ type: "helpRoute" })} />
          <span>Guest and Duty Manager agree how to request help again: ask reception or the named contact; Duty Manager owns acknowledgement. Declining further support is respected.</span>
        </label>
      )}
      <label htmlFor="lead-select" className="s3-card-title" style={{ display: "block" }}>Named follow-up lead</label>
      <select id="lead-select" data-testid="select-lead" value={state.followupLead} onChange={e => dispatch({ type: "lead", lead: e.target.value })}>
        <option value="">Select a lead</option>
        {FOLLOWUP_LEADS.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <ul className="s3-checks"><li><label className="s3-check" data-on={state.followupAccepted}>
        <input type="checkbox" data-testid="check-followup" disabled={!state.guestResponse || !state.followupLead || (state.guestResponse === "decline" && !state.helpRouteAgreed)} checked={state.followupAccepted} onChange={() => dispatch({ type: "acceptFollowup" })} />
        <span>{state.followupLead || "The selected lead"} explicitly accepts the private follow-up scheduled in 20 minutes<small>Requires guest response, help-again agreement if declined, and a named lead</small></span>
      </label></li></ul>
    </>
  );
  return (
    <>
      <p className="s3-hold s3-ok">Immediate response verified after all gates. The private follow-up remains open. No claim of improved wellbeing or prevented harm.</p>
      <p className="s3-note"><strong>Restricted record:</strong> {state.guestResponse === "accept" ? "Guest accepts support." : "Guest declines further support; choice respected and help-again route agreed."} {state.followupLead} accepts the private follow-up in 20 minutes. Status: OPEN.</p>
      <h3 className="s3-h3">Proposed learning</h3>
      <ul className="s3-note"><li>Accessible-route checks before peaks.</li><li>Named contact plus a backup.</li><li>Receiving acknowledgement for transfers.</li></ul>
      <ul className="s3-checks">
        {[["group", "Group Operations approves a limited next-shift trial (optional)"], ["safety", "Property safety lead approves a limited next-shift trial (optional)"]].map(([id, l]) => (
          <li key={id}><label className="s3-check" data-on={state.trialApprovals.includes(id)}><input type="checkbox" data-testid={`check-trial-${id}`} checked={state.trialApprovals.includes(id)} onChange={() => dispatch({ type: "trial", id })} /><span>{l}</span></label></li>
        ))}
      </ul>
      <p className={state.trialApprovals.length === 2 ? "s3-hold s3-ok" : "s3-hold"} role="status">{state.trialApprovals.length === 2 ? "Limited next-shift trial authorised in this fictional demonstration by Group Operations and property safety lead." : "Learning proposal awaiting both Group Operations and property safety lead; no trial authorised."}</p>
      <p className="s3-hold">Awaiting evidence. Not a rollout. Measures: acknowledgement, unmet requests, accessibility exceptions, workload. Private feedback stays restricted; only necessary de-identified learning is shared.</p>
    </>
  );
}
