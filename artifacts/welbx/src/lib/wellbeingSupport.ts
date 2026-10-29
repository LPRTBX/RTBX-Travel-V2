/** Synthetic, in-memory story only. Role projections are demonstration views, not authentication. */
export const SUPPORT_ROLES = ["Guest", "Reception", "Guest Services", "Housekeeping lead", "Duty Manager"] as const;
export type SupportRole = typeof SUPPORT_ROLES[number];
export type SupportAction =
  | "consent" | "quiet" | "capacity" | "review" | "approve" | "hold" | "decline" | "resume"
  | "release" | "accept" | "reallocate" | "update" | "arrive" | "deliver" | "unavailable"
  | "revise" | "overdue" | "followup" | "helped" | "needs-support" | "pending" | "reset";
export type SupportRecord = {
  id: string; version: number; author: SupportRole; recipients: SupportRole[]; time: string;
  purpose: string; message: string; status: "Draft" | "Released" | "Acknowledged";
  acknowledgedBy?: SupportRole; acknowledgedAt?: string;
};
export type SupportHistory = { version: number; time: string; text: string; audience: SupportRole[] };
export type SupportPlan = {
  version: number; owner: "Guest Services contact A" | "Duty Manager contact B";
  consent: boolean; quiet: boolean; capacity: boolean; reviewed: boolean;
  decision: "Pending" | "Approved" | "Held" | "Declined" | "Invalidated";
  released: boolean; accepted: boolean; reallocated: boolean; updated: boolean;
  arrived: boolean; delivered: boolean; unavailable: boolean; followup: boolean;
  feedback: "Pending" | "Helped" | "Still needs support";
};
export type SupportState = { plans: SupportPlan[]; records: SupportRecord[]; history: SupportHistory[]; minute: number };
const managers: SupportRole[] = ["Duty Manager"];
const supportTeam: SupportRole[] = ["Reception", "Guest Services", "Duty Manager"];
const guestTeam: SupportRole[] = ["Guest", "Reception", "Duty Manager"];
const workTeam: SupportRole[] = ["Housekeeping lead", "Duty Manager"];
const blank = (version = 1): SupportPlan => ({
  version, owner: version === 1 ? "Guest Services contact A" : "Duty Manager contact B",
  consent: false, quiet: false, capacity: false, reviewed: false, decision: "Pending",
  released: false, accepted: false, reallocated: false, updated: false,
  arrived: false, delivered: false, unavailable: false, followup: false, feedback: "Pending",
});
export const initialSupportState = (): SupportState => ({ plans: [blank()], records: [], history: [], minute: 25 });
export const supportPlan = (state: SupportState) => state.plans[state.plans.length - 1];
export const supportTime = (minute: number) => `3:${String(minute).padStart(2, "0")} pm`;
export const supportReady = (p: SupportPlan) => p.consent && p.quiet && p.capacity && p.reviewed && !p.unavailable;
export const supportOwnerRole = (p: SupportPlan): SupportRole => p.owner === "Guest Services contact A" ? "Guest Services" : "Duty Manager";
type ActionSpec = { type: SupportAction; label: string; enabled: boolean; reason: string };

/** Both the UI and reducer use this permission/gate list. No UI-only approval bypass. */
export function supportActions(state: SupportState, role: SupportRole): ActionSpec[] {
  const p = supportPlan(state);
  const editing = p.decision === "Pending";
  const owner = role === supportOwnerRole(p);
  const list: ActionSpec[] = [];
  const add = (type: SupportAction, label: string, enabled: boolean, reason: string) => list.push({ type, label, enabled, reason });
  if (role === "Guest") {
    add("consent", p.version === 1 ? "Agree to share practical support preferences" : "Renew agreement for the revised handover", editing && !p.consent, "Agreement is recorded before support details can be handed over.");
    for (const [type, label] of [["helped", "Support helped"], ["needs-support", "Still needs support"], ["pending", "Keep feedback pending"]] as const)
      add(type, label, p.delivered, "Feedback follows delivered support; it is separate from delivery evidence.");
  }
  if (role === "Reception") {
    add("quiet", "Confirm quiet-space availability", editing && !p.quiet, "Reception must check availability before a commitment.");
    add("update", "Record approved guest update", p.released && !p.updated && p.decision === "Approved", "Only the released, approved plan may be communicated.");
  }
  if (role === "Housekeeping lead") {
    add("capacity", "Confirm staff capacity and room priorities", editing && !p.capacity, "Confirm capacity before the manager commits.");
    add("reallocate", "Acknowledge and confirm task reallocation", p.released && !p.reallocated && p.decision === "Approved", "A released workload instruction must be accepted, not assumed.");
  }
  if (role === "Duty Manager") {
    add("review", "Review facts and scripted suggestion", editing && !p.reviewed, "A person reviews the suggestion; no model or automatic decision is used.");
    add("approve", "Approve plan and own 3:45 pm follow-up", editing && supportReady(p), "Requires guest agreement, quiet-space availability, staff capacity and human review.");
    add("hold", "Hold plan", editing, "Held means no release or delivery.");
    add("decline", "Decline plan", editing, "Declined means no release; the guest request remains open.");
    add("resume", "Reopen human review", p.decision === "Held" || p.decision === "Declined", "Resume review without claiming approval.");
    add("release", "Release coordinated response", p.decision === "Approved" && supportReady(p) && !p.released, "Approval is not dispatch. Release the three drafted communication records separately.");
    add("revise", "Review reassignment to manager-covered support", !p.delivered && (p.unavailable || p.decision === "Approved" || p.decision === "Declined"), "Material changes create a new version; renew consent, checks and approval. Earlier history is retained.");
    add("overdue", "Advance demonstration clock to 3:50 pm", state.minute < 50, "The fictional clock exposes overdue follow-up; it does not send a message.");
    add("followup", "Record timed follow-up review", p.delivered && state.minute >= 45 && !p.followup, "Due at 3:45 pm: advance the fictional clock to inspect overdue follow-up. Delivery and a manager review do not close pending feedback or further support.");
  }
  if (owner) {
    add("accept", "Accept practical support handover", p.released && p.decision === "Approved" && !p.accepted && !p.unavailable, "Dispatch is not acceptance. The receiving contact must accept.");
    add("arrive", "Record contact arrival", p.accepted && p.decision === "Approved" && !p.arrived && !p.unavailable, "An accepted assignment is not arrival evidence.");
    add("deliver", "Record practical support delivered", p.arrived && p.reallocated && p.updated && p.decision === "Approved" && !p.delivered && !p.unavailable, "Requires arrival, confirmed reallocation and the approved guest update. Delivery is not improved wellbeing.");
    add("unavailable", "Report support contact unavailable", !p.delivered && p.decision === "Approved" && !p.unavailable, "The commitment is invalidated. A manager must review a replacement plan.");
  }
  add("reset", "Reset wellbeing scenario", true, "Only this fictional scenario is reset.");
  return list;
}

export function reduceSupport(state: SupportState, role: SupportRole, action: SupportAction): SupportState {
  if (!supportActions(state, role).find(a => a.type === action)?.enabled) return state;
  if (action === "reset") return initialSupportState();
  const next: SupportState = structuredClone(state);
  let p = supportPlan(next);
  const log = (text: string, audience: SupportRole[]) => next.history.push({ version: p.version, time: supportTime(next.minute), text, audience });
  const acknowledge = (purpose: string) => {
    next.records.filter(r => r.version === p.version && r.purpose === purpose).forEach(r => {
      r.status = "Acknowledged"; r.acknowledgedBy = role; r.acknowledgedAt = supportTime(next.minute);
    });
  };
  switch (action) {
    case "consent":
      p.consent = true;
      log("Guest agreed to share the request for quieter waiting and practical assistance with the named support team, for this plan only.", guestTeam);
      break;
    case "quiet": p.quiet = true; log("Reception verified the quiet lounge is available.", ["Reception", "Duty Manager"]); break;
    case "capacity": p.capacity = true; log("Housekeeping lead confirmed capacity and room priorities.", workTeam); break;
    case "review": p.reviewed = true; log("Duty Manager reviewed reported facts and the scripted suggestion. No diagnosis or inferred emotion.", managers); break;
    case "approve": {
      p.decision = "Approved";
      log(`Duty Manager approved version ${p.version}; ${p.owner} owns practical support. Duty Manager owns the 3:45 pm follow-up. Nothing released yet.`, managers);
      const add = (purpose: string, author: SupportRole, recipients: SupportRole[], message: string) => next.records.push({
        id: `${p.version}-${purpose}`, version: p.version, author, recipients, purpose, message, time: supportTime(next.minute), status: "Draft",
      });
      add("Practical support handover", "Duty Manager", [...new Set<SupportRole>([supportOwnerRole(p), "Duty Manager"])],
        `Guest agreed to quieter waiting and practical assistance. Quiet lounge checked; ${p.owner} must accept, arrive and record support. Use only these authorised preferences.`);
      add("Workload reallocation", "Duty Manager", workTeam,
        "Keep room repair separate and open. Reassign one waiting-room task within confirmed capacity; Housekeeping lead must confirm the new priorities.");
      add("Approved guest update", "Reception", guestTeam,
        `Quiet lounge support is approved with ${p.owner}. Next update: 3:45 pm from Duty Manager. Room repair is still open. Record the update after release.`);
      break;
    }
    case "hold": p.decision = "Held"; log("Duty Manager held the plan. Request remains open; nothing released.", managers); break;
    case "decline": p.decision = "Declined"; log("Duty Manager declined the plan. Request remains open; choose a reviewed alternative.", managers); break;
    case "resume": p.decision = "Pending"; log("Duty Manager reopened review; no approval implied.", managers); break;
    case "release":
      p.released = true;
      next.records.filter(r => r.version === p.version).forEach(r => { r.status = "Released"; r.time = supportTime(next.minute); });
      log("Duty Manager released the response; recipient acknowledgements and delivery are still outstanding.", managers);
      break;
    case "accept": p.accepted = true; acknowledge("Practical support handover"); log(`${p.owner} accepted the practical support handover. Arrival not yet recorded.`, supportTeam); break;
    case "reallocate": p.reallocated = true; acknowledge("Workload reallocation"); log("Housekeeping lead confirmed task reallocation. Repair remains open.", workTeam); break;
    case "update": p.updated = true; acknowledge("Approved guest update"); log("Reception recorded the approved guest update.", guestTeam); break;
    case "arrive": p.arrived = true; log(`${p.owner} arrival receipt recorded. Support delivery still needs a separate receipt.`, [...supportTeam, "Guest"]); break;
    case "deliver": p.delivered = true; log("Practical support delivered in the checked quiet lounge. This is delivery evidence, not evidence of improved wellbeing.", [...supportTeam, "Guest"]); break;
    case "unavailable":
      p.unavailable = true; p.capacity = false; p.decision = "Invalidated";
      log("Support contact unavailable. Previous commitment and approval invalidated; support request stays open for manager-reviewed reassignment.", supportTeam);
      log("Workload instruction requires renewed manager review; the previous plan is invalidated.", workTeam);
      log("Your earlier plan is paused. Reception will update you after a replacement is reviewed; your request remains open.", guestTeam);
      break;
    case "revise":
      log("Duty Manager reviewed material reassignment. This version is superseded; its records and missing receipts remain in history.", managers);
      p.decision = "Invalidated";
      next.plans.push(blank(p.version + 1));
      p = supportPlan(next);
      log("New manager-covered plan drafted. Renew guest agreement, quiet-space and capacity checks, human review and approval before release.", managers);
      break;
    case "overdue": next.minute = 50; log("Fictional clock advanced to 3:50 pm. Duty Manager must review overdue follow-up.", managers); break;
    case "followup": p.followup = true; log("Duty Manager recorded the timed follow-up review. Pending feedback or further support is not closed by this review.", [...supportTeam, "Guest"]); break;
    case "helped": p.feedback = "Helped"; log("Guest reported support helped. No clinical or measured wellbeing outcome is inferred.", guestTeam); break;
    case "needs-support": p.feedback = "Still needs support"; log("Guest requests further support. Duty Manager owns the next review.", guestTeam); break;
    case "pending": p.feedback = "Pending"; log("Guest feedback remains pending; no benefit is inferred.", guestTeam); break;
  }
  return next;
}

/** All visible records, counts, history and summaries derive from this projection. */
export function supportView(state: SupportState, role: SupportRole) {
  const p = supportPlan(state);
  const active = p.released && p.decision === "Approved";
  const privateSupport = role === "Guest" || role === "Reception" || (p.consent && (role === "Guest Services" || role === "Duty Manager"));
  const facts = role === "Guest"
    ? ["3:25 pm · Your request: somewhere quiet and practical support while your room is delayed."]
    : [
      "3:25 pm · Room-status report: room 304 is unavailable pending repair and clearance.",
      "3:25 pm · Housekeeping lead: capacity pressure; confirm priorities before reallocation.",
      ...(privateSupport ? ["3:25 pm · Guest report to Reception: requests quieter waiting and practical assistance.", "3:25 pm · Reception: requests a named handover."] : []),
    ];
  const records = state.records.filter(r =>
    r.recipients.includes(role) &&
    (r.status !== "Draft" || role === "Duty Manager" || r.author === role) &&
    (role !== "Guest" || r.purpose === "Approved guest update"))
    .map(r => ({ ...r, superseded: r.version !== p.version || p.decision === "Invalidated" }));
  const history = state.history.filter(e => e.audience.includes(role));
  const followup = p.followup ? "Review recorded" : state.minute > 45 ? "Overdue · Duty Manager owns follow-up" : "Due 3:45 pm · Duty Manager";
  const summary = role === "Housekeeping lead"
    ? [`Task reallocation: ${p.decision === "Invalidated" ? "previous plan invalidated; await reviewed instructions" : p.reallocated ? "confirmed" : "open"}.`, "Room 304 repair: open · Maintenance lead; awaiting repair and clearance."]
    : role === "Guest"
      ? [active ? `Agreed support: quiet lounge · named contact ${p.owner}.` : "Your support plan is not yet released or has been paused; Reception owns the next update.",
        `Support: ${p.delivered ? "delivered with receipt" : "not yet verified"}.`, `Your feedback: ${p.feedback}.`, active ? `Next update: ${followup}.` : "Next update time awaits the approved replacement plan.", "Room repair remains open."]
      : [`Support: ${p.delivered ? "delivered with receipt" : "open; no delivery receipt"}.`,
        `Handover: ${p.decision === "Invalidated" ? "previous commitment invalidated" : p.accepted ? "accepted" : "not accepted"}.`,
        `Guest update: ${p.updated ? "recorded" : "open"}.`,
        ...(role === "Duty Manager" || role === "Reception" ? [`Guest feedback: ${p.feedback}; separate from delivery.`] : []),
        `Follow-up: ${followup}.`, "Room 304 repair: open · Maintenance lead; awaiting repair and clearance."];
  const actions = supportActions(state, role);
  const preferred = actions.find(a => a.enabled && !["reset", "overdue", "hold", "decline", "revise", "unavailable", "pending", "helped", "needs-support"].includes(a.type));
  const awaiting = role === "Housekeeping lead"
    ? "Await the Duty Manager's released workload instruction; personal support details are not part of this view."
    : role === "Guest"
      ? p.delivered ? "Record your feedback if you wish. Pending feedback is not a failed outcome." : "Reception will confirm the reviewed plan and next update. Switch fictional view to continue the team story."
      : p.decision === "Invalidated" ? "Duty Manager: review reassignment. Renew guest agreement, availability, capacity and approval."
      : p.decision === "Held" || p.decision === "Declined" ? "Duty Manager: reopen review or review a replacement; no response is released."
      : !p.consent ? "Guest: review and agree the minimum-necessary support handover before details are shared."
      : !p.quiet ? "Reception: confirm quiet-space availability."
      : !p.capacity ? "Housekeeping lead: confirm staff capacity and priorities."
      : !p.reviewed ? "Duty Manager: review the reported facts and scripted suggestion."
      : p.decision !== "Approved" ? "Duty Manager: approve, hold or decline the checked plan."
      : !p.released ? "Duty Manager: release the response. Approval alone sent nothing."
      : !p.accepted ? `${supportOwnerRole(p)}: accept the support handover. Dispatch is not acceptance.`
      : !p.reallocated ? "Housekeeping lead: acknowledge and confirm task reallocation."
      : !p.updated ? "Reception: record the approved guest update."
      : !p.arrived ? `${supportOwnerRole(p)}: record actual contact arrival.`
      : !p.delivered ? `${supportOwnerRole(p)}: record practical support delivered.`
      : !p.followup ? "Duty Manager: record the timed follow-up. Delivery alone is not improved wellbeing."
      : p.feedback === "Still needs support" ? "Duty Manager owns further support review; the guest request remains open."
      : p.feedback === "Pending" ? "Guest feedback remains optional and pending; no benefit is inferred."
      : "Support and feedback are recorded. Room repair is still a separate open issue.";
  return {
    facts, records, history, summary, actions,
    next: preferred?.label ?? awaiting,
    suggestion: role === "Guest" ? "People will review your request with you; no automatic decision is made."
      : role === "Housekeeping lead" ? "Scripted suggestion: verify capacity and agree room priorities before committing staff. No personal support notes are shared in this view."
      : privateSupport ? "Scripted AI suggestion: reported room delay, an explicit support request and capacity pressure suggest checking a quiet space and a named practical-support contact. People verify availability, review options and authorise. No diagnosis, inferred emotion or risk score."
      : "Await guest agreement before sharing support preferences. Only reported room status and capacity facts are available in this view.",
    status: role === "Guest" ? active ? "Agreed plan released" : "Plan awaiting review" : role === "Housekeeping lead" ? p.decision === "Invalidated" ? "Instructions awaiting renewed review" : p.reallocated ? "Reallocation acknowledged" : "Workload confirmation open" : p.decision,
    version: p.version,
  };
}
