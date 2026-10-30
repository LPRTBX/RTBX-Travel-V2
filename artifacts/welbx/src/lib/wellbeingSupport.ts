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
  feedback: "Pending" | "Helped" | "Still needs support"; feedbackRecorded: boolean;
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
  arrived: false, delivered: false, unavailable: false, followup: false, feedback: "Pending", feedbackRecorded: false,
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
    add("consent", p.version === 1 ? "Share what would help with the guest support team" : "Agree to share with the replacement support team", editing && !p.consent,
      `Share your request for quieter waiting and practical assistance with ${supportOwnerRole(p) === "Duty Manager" ? "Reception and the Duty Manager" : "Reception, Guest Services and the Duty Manager"}, for this plan only. Housekeeping receives workload tasks, not your preferences. Nothing is shared until you choose.`);
    for (const [type, label, value] of [["helped", "Support helped", "Helped"], ["needs-support", "Still needs support", "Still needs support"], ["pending", "Keep feedback pending", "Pending"]] as const)
      add(type, label, p.delivered && (!p.feedbackRecorded || p.feedback !== value), "Feedback follows delivered support; it is separate from delivery evidence.");
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
    case "helped": p.feedback = "Helped"; p.feedbackRecorded = true; log("Guest reported support helped. No clinical or measured wellbeing outcome is inferred.", guestTeam); break;
    case "needs-support": p.feedback = "Still needs support"; p.feedbackRecorded = true; log("Guest requests further support. Duty Manager owns the next review.", guestTeam); break;
    case "pending": p.feedback = "Pending"; p.feedbackRecorded = true; log("Guest feedback remains pending; no benefit is inferred.", guestTeam); break;
  }
  return next;
}

type Requirement = { role: SupportRole; action: SupportAction | null };
/** A missing requirement, never a fixed step index or an action performed by role switching. */
function nextRequirement(state: SupportState): Requirement | null {
  const p = supportPlan(state);
  if (p.decision === "Invalidated") return { role: "Duty Manager", action: "revise" };
  if (p.decision === "Held" || p.decision === "Declined") return { role: "Duty Manager", action: "resume" };
  if (!p.consent) return { role: "Guest", action: "consent" };
  if (!p.quiet) return { role: "Reception", action: "quiet" };
  if (!p.capacity) return { role: "Housekeeping lead", action: "capacity" };
  if (!p.reviewed) return { role: "Duty Manager", action: "review" };
  if (p.decision !== "Approved") return { role: "Duty Manager", action: "approve" };
  if (!p.released) return { role: "Duty Manager", action: "release" };
  if (!p.accepted) return { role: supportOwnerRole(p), action: "accept" };
  if (!p.reallocated) return { role: "Housekeeping lead", action: "reallocate" };
  if (!p.updated) return { role: "Reception", action: "update" };
  if (!p.arrived) return { role: supportOwnerRole(p), action: "arrive" };
  if (!p.delivered) return { role: supportOwnerRole(p), action: "deliver" };
  // Choosing to leave feedback pending is explicit, not a successful outcome or a delivery gate.
  if (!p.feedbackRecorded) return { role: "Guest", action: "pending" };
  if (!p.followup) return { role: "Duty Manager", action: state.minute < 45 ? "overdue" : "followup" };
  return null;
}

export function supportGuidance(state: SupportState, role: SupportRole) {
  const p = supportPlan(state);
  const actions = supportActions(state, role).filter(a => a.enabled && a.type !== "reset");
  let target = nextRequirement(state);
  let context = p.decision === "Invalidated" ? "The earlier commitment is paused. A manager must review a replacement, with renewed agreement and checks."
    : p.decision === "Held" ? "This plan is on hold. The request remains open; nothing is released."
    : p.decision === "Declined" ? "This plan was declined. The request remains open for another reviewed response."
    : p.version > 1 && p.decision === "Pending" ? "A replacement plan is being checked. Earlier decisions and receipts remain in history."
    : p.decision === "Pending" ? "The first plan is being checked. Guest agreement, an available space, staff capacity and human review are needed before approval."
    : !p.released ? "The plan is approved, but no instructions have been released."
    : !p.accepted ? "Instructions are released. The named support contact still needs to accept the handover."
    : !p.arrived ? "The handover is accepted. Contact arrival and support delivery still need separate receipts."
    : !p.delivered ? "The contact has arrived. Confirm the guest update and workload handover, then record actual support."
    : "Support delivery is recorded. Guest feedback and the Duty Manager's timed follow-up are separate; room repair remains open.";
  // Shared-workload guidance must not change with private feedback, preferences or counts.
  if (role === "Housekeeping lead") {
    target = !p.capacity && p.decision === "Pending" ? { role, action: "capacity" }
      : p.released && p.decision === "Approved" && !p.reallocated ? { role, action: "reallocate" }
      : p.delivered || target?.action === "consent" || !target ? { role: "Duty Manager", action: null }
      : target;
    context = p.decision === "Invalidated" ? "The workload instruction is paused. The Duty Manager must review new instructions."
      : p.reallocated ? "Your task reallocation is acknowledged. The Duty Manager owns remaining coordination; Maintenance owns repair and clearance."
      : p.capacity ? "Capacity is confirmed. The Duty Manager must check the remaining requirements before releasing a workload instruction."
      : "Check capacity and room priorities before staff are committed. Personal support notes are not part of this view.";
  }
  if (role === "Guest Services" && p.delivered) {
    target = { role: "Duty Manager", action: null };
    context = "Your delivery receipt is recorded. The Duty Manager owns timed follow-up. Private guest feedback is not included in this view.";
  }
  const optional: SupportAction[] = ["hold", "decline", "revise", "unavailable", "helped", "needs-support", "pending", "overdue"];
  const primary = actions.find(a => target?.role === role && target.action === a.type)
    ?? actions.find(a => !optional.includes(a.type))
    ?? null;
  const alternatives = actions.filter(a => a.type !== primary?.type &&
    (optional.includes(a.type) || a.type === "followup") &&
    (a.type !== "overdue" || p.delivered));
  const targetAction = target?.action
    ? supportActions(state, target.role).find(a => a.type === target.action) : null;
  const handover = target && target.role !== role ? {
    role: target.role, action: target.action,
    text: role === "Housekeeping lead" || (role === "Guest Services" && p.delivered)
      ? `Continue the demonstration with ${target.role} to review remaining coordination. Switching views does not carry out an action.`
      : `${target.role} needs to ${targetAction?.label.toLowerCase() ?? "review the outstanding response"}. Switching views does not carry out that action.`,
  } : null;
  return { primary, alternatives, handover, context };
}

/** All visible records, counts, history and summaries derive from this projection. */
export function supportView(state: SupportState, role: SupportRole) {
  const p = supportPlan(state);
  const active = p.released && p.decision === "Approved";
  const privateSupport = role === "Guest" || role === "Reception" ||
    (p.consent && (role === "Duty Manager" || (role === "Guest Services" && supportOwnerRole(p) === role)));
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
      ? [active ? `Agreed support: quiet lounge · named contact ${p.owner}.`
          : p.decision === "Invalidated" ? "Your earlier plan is paused. Reception owns the next update while a replacement is reviewed."
          : p.decision === "Held" || p.decision === "Declined" ? `Your plan is ${p.decision === "Held" ? "on hold" : "declined"}. Your request remains open; Reception owns the next update.`
          : p.version > 1 ? "Your replacement plan is being checked. Nothing has been released."
          : "Your first support plan is being checked. Nothing has been released.",
        `Support: ${p.delivered ? "delivered with receipt" : "not yet verified"}.`, `Your feedback: ${p.feedback}.`, active ? `Next update: ${followup}.`
          : p.version > 1 || p.decision === "Invalidated" ? "Next update will be confirmed with the reviewed replacement plan."
          : "Proposed follow-up: 3:45 pm · Duty Manager; to be confirmed with the plan.", "Room repair remains open."]
      : [`Support: ${p.delivered ? "delivered with receipt" : "open; no delivery receipt"}.`,
        `Handover: ${p.decision === "Invalidated" ? "previous commitment invalidated" : p.accepted ? "accepted" : "not accepted"}.`,
        `Guest update: ${p.updated ? "recorded" : "open"}.`,
        ...(role === "Duty Manager" || role === "Reception" ? [`Guest feedback: ${p.feedback}; separate from delivery.`] : []),
        `Follow-up: ${followup}.`, "Room 304 repair: open · Maintenance lead; awaiting repair and clearance."];
  const actions = supportActions(state, role);
  const guidance = supportGuidance(state, role);
  return {
    facts, records, history, summary, actions,
    guidance,
    clock: supportTime(state.minute),
    feedbackNotice: p.feedbackRecorded && ["Guest", "Reception", "Duty Manager"].includes(role)
      ? p.feedback === "Pending" ? "Feedback left pending by choice. It remains open; no benefit is inferred."
        : p.feedback === "Still needs support" ? "Further support requested. The Duty Manager owns the next review."
        : "Guest feedback recorded: support helped. This is not a measured wellbeing outcome."
      : null,
    next: guidance.primary?.label ?? guidance.context,
    suggestion: role === "Guest" ? "People will review your request with you; no automatic decision is made."
      : role === "Housekeeping lead" ? "Scripted suggestion: verify capacity and agree room priorities before committing staff. No personal support notes are shared in this view."
      : privateSupport ? "Scripted AI suggestion: reported room delay, an explicit support request and capacity pressure suggest checking a quiet space and a named practical-support contact. People verify availability, review options and authorise. No diagnosis, inferred emotion or risk score."
      : "Only the assigned support team receives authorised preferences after guest agreement. This view has reported room status and capacity facts only.",
    status: role === "Guest" ? active ? "Agreed plan released" : p.decision === "Invalidated" ? "Earlier plan paused" : p.decision === "Held" ? "Plan on hold" : p.decision === "Declined" ? "Plan declined" : p.version > 1 ? "Replacement plan awaiting review" : "First plan awaiting review" : role === "Housekeeping lead" ? p.decision === "Invalidated" ? "Instructions awaiting renewed review" : p.reallocated ? "Reallocation acknowledged" : "Workload confirmation open" : p.decision,
    version: p.version,
  };
}
