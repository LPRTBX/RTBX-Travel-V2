/** Pure, in-memory fictional safeguarding coordination. No addresses, room/location
 * values, editable personal data, network effects or real emergency contacts. */
export const SAFE_ROLES = ["Guest", "Reception", "Guest Services", "Housekeeping lead", "Duty Manager", "Security"] as const;
export type SafeRole = typeof SAFE_ROLES[number];
export type SafeAction = "record" | "own" | "assess" | "contact" | "consent" | "decline-support" | "space" | "escort" | "review" | "approve" | "hold" | "decline-plan" | "resume" | "release" | "accept" | "arrive" | "deliver" | "practical" | "cover" | "unavailable" | "missed" | "revise" | "safer" | "still-unsafe" | "pending" | "overdue" | "followup" | "request-emergency" | "confirm-responder" | "reset";
export type SafeSpec = { type: SafeAction; label: string; reason: string };
type Event = { id: string; time: string; author: SafeRole; recipients: SafeRole[]; purpose: string; message: string; status: string; version: number };
export type SafeState = {
  version: number; minute: number; followupAt: number; recorded: boolean; owned: boolean; assessed: boolean; contact: boolean;
  consent: null | "agreed" | "declined"; space: boolean; escort: boolean; reviewed: boolean;
  decision: "Pending" | "Approved" | "Held" | "Declined"; released: boolean;
  assignment: "Security" | "Duty Manager"; accepted: boolean; arrived: boolean; delivered: boolean;
  unavailable: boolean; missed: boolean; replan: boolean; needsReview: boolean; practical: boolean; cover: boolean;
  feedback: null | "safer" | "still-unsafe" | "pending"; previousFeedback: SafeState["feedback"];
  followup: boolean; emergencyRequested: boolean; responderAccepted: boolean;
  emergencyAuthors: SafeRole[]; events: Event[];
};
export const createSafeState = (): SafeState => ({
  version: 1, minute: 10, followupAt: 30, recorded: false, owned: false, assessed: false, contact: false, consent: null,
  space: false, escort: false, reviewed: false, decision: "Pending", released: false,
  assignment: "Security", accepted: false, arrived: false, delivered: false,
  unavailable: false, missed: false, replan: false, needsReview: false, practical: false, cover: false,
  feedback: null, previousFeedback: null, followup: false, emergencyRequested: false,
  responderAccepted: false, emergencyAuthors: [], events: [],
});
const CORE: SafeRole[] = ["Guest", "Reception", "Duty Manager"];
const RESPONSE: SafeRole[] = [...CORE, "Security"];
const responseAudience = (s: SafeState): SafeRole[] => s.assignment === "Security" ? RESPONSE : CORE;
const time = (minute: number) => {
  const hour = (18 + Math.floor(minute / 60)) % 24;
  return `${hour % 12 || 12}:${String(minute % 60).padStart(2, "0")} ${hour >= 12 ? "pm" : "am"}`;
};
const clock = (s: SafeState) => time(s.minute);
const named = (s: SafeState) => s.assignment === "Security" ? "Riley, Security lead (fictional)" : "Morgan, Duty Manager (fictional)";
const privateView = (r: SafeRole) => CORE.includes(r);
const ready = (s: SafeState) => s.recorded && s.owned && s.assessed && s.contact && s.consent === "agreed" && s.space && s.escort && !s.replan;

export function safeActions(s: SafeState, role: SafeRole): SafeSpec[] {
  const list: SafeSpec[] = [];
  const add = (type: SafeAction, label: string, ok: boolean, reason: string) => { if (ok) list.push({ type, label, reason }); };
  const dm = role === "Duty Manager", guest = role === "Guest", rec = role === "Reception";
  const current = s.decision === "Approved" && s.released && !s.replan;
  const assigned = role === s.assignment;
  add("record", "Record the reported concern discreetly", rec && !s.recorded, "Necessary facts only. Do not record or disclose a room or location.");
  add("own", "Accept ownership as Duty Manager Morgan", dm && s.recorded && !s.owned, "Named site ownership does not authorise disclosure or promise support.");
  add("assess", "Assess the reported urgency as Morgan", dm && s.owned && !s.assessed, "Human assessment of reported facts, not a diagnosis or threat score. Use the immediate-danger path now if appropriate; routine checks must not delay emergency help.");
  add("contact", "Confirm safe contact through Reception", guest && s.recorded && !s.contact, `For this fictional plan: through Reception only, with the next update at ${time(s.followupAt)}. No room calls, public announcements or location disclosure.`);
  add("consent", "Agree to limited routine support", guest && s.recorded && s.contact && s.consent === null,
    `Share only the necessary discreet-support request with ${s.assignment === "Security" ? "Security lead Riley and Duty Manager Morgan" : "Duty Manager Morgan as replacement contact"}. Guest Services may receive a practical task only, not the disclosure or location. Housekeeping receives workload tasks only. This plan only.`);
  add("decline-support", "Decline optional support", guest && s.recorded && s.consent === null, "Declining is respected. The concern remains open with Morgan; emergency help does not depend on routine consent.");
  add("space", "Confirm a private support space is available", rec && s.recorded && s.owned && s.consent === "agreed" && !s.space && !s.replan, "Record availability only, never its location. Do not promise it before this check.");
  add("escort", "Confirm appropriate staff capacity", dm && s.recorded && s.owned && s.consent === "agreed" && !s.escort && !s.replan, `Check that ${named(s)} can provide the agreed discreet contact and escort. Assignment is not acceptance.`);
  add("review", "Review urgency and the routine plan", dm && ready(s) && !s.reviewed && s.decision === "Pending", "A person assesses reported facts, missing checks and the guest's wishes. No threat score or medical assessment.");
  add("approve", "Approve this routine response", dm && ready(s) && s.reviewed && s.decision === "Pending", "Approval is not release, acceptance, arrival, delivery or proof of safety.");
  add("hold", "Hold the routine plan", dm && s.owned && s.decision === "Pending" && !s.replan, "Keep the concern, owner and next review visible. Immediate-danger help remains available.");
  add("decline-plan", "Decline this routine plan", dm && s.owned && s.decision === "Pending" && !s.replan, "Decline the plan, not the person's concern. A new decision is needed; nothing is dispatched.");
  add("resume", "Reopen the routine decision", dm && ["Held", "Declined"].includes(s.decision), "Existing valid checks remain recorded. Approval still requires all current checks.");
  add("release", "Release the limited response instructions", dm && ready(s) && s.decision === "Approved" && !s.released, "Simulated release only. Recipients must separately accept their instructions.");
  add("accept", s.assignment === "Security" ? "Accept the discreet Security response" : "Accept the replacement response as Morgan", assigned && current && !s.accepted, "Explicit recipient acceptance. No contact has arrived yet.");
  add("arrive", "Record agreed staff contact arriving", assigned && current && s.accepted && !s.arrived, "Synthetic arrival receipt only; support delivery needs its own receipt.");
  add("deliver", "Record agreed practical support delivered", assigned && current && s.arrived && !s.delivered, "Synthetic escort/support receipt. Delivered support does not establish safety.");
  add("practical", "Accept the authorised practical support task", role === "Guest Services" && current && !s.practical, "Practical assistance through Reception only. No detailed disclosure, room or location.");
  add("cover", "Acknowledge the Reception workload cover", role === "Housekeeping lead" && current && !s.cover, "Workload cover only. No guest support account is shared.");
  add("unavailable", "Report assigned staff unavailable", (dm || assigned) && current && !s.delivered, "Keep the original task outstanding. A manager must replan and a replacement must explicitly accept.");
  add("missed", "Record missing Security acknowledgement", dm && current && s.assignment === "Security" && !s.accepted, "A released request without acknowledgement remains open. Escalate to named site ownership.");
  add("revise", "Review and propose a manager-owned replacement", dm && s.owned && (s.replan || s.needsReview), "Material change: preserve the earlier record, renew guest agreement, availability/capacity checks, review, approval and release. Morgan must explicitly accept too.");
  for (const [type, label] of [["safer", "I feel safer"], ["still-unsafe", "I still feel unsafe"], ["pending", "Leave feedback pending"]] as const)
    add(type, label, guest && s.delivered && !s.replan && !s.needsReview && s.feedback !== type, "Guest feedback is separate from delivery. It is a reported experience, not established safety.");
  add("overdue", `Advance the demo clock to ${time(s.followupAt + 5)}`, dm && s.owned && s.minute < s.followupAt + 5, `Makes the ${time(s.followupAt)} follow-up overdue; advancing time does not complete it.`);
  add("followup", "Record a safe-contact follow-up review", dm && s.owned && s.contact && s.minute >= s.followupAt && !s.followup, "Morgan reviews through the agreed safe contact method. Pending or still-unsafe feedback leaves the concern active.");
  add("request-emergency", "Record simulated request for emergency help", !s.emergencyRequested || (!RESPONSE.includes(role) && !s.emergencyAuthors.includes(role)), "Do not wait for routine consent or manager approval in this fictional immediate-danger path. No call/message is sent; this records a request, not acceptance.");
  add("confirm-responder", "Record simulated responder acceptance", s.emergencyRequested && !s.responderAccepted && ["Reception", "Duty Manager", "Security"].includes(role), "Separate synthetic receipt. A request alone is not confirmed responder acceptance; neither establishes safety.");
  add("reset", "Reset Guest feels unsafe", true, "Clears only this fictional scenario, not Practical guest support.");
  return list;
}

export function reduceSafe(s: SafeState, role: SafeRole, action: SafeAction): SafeState {
  if (!safeActions(s, role).some(a => a.type === action)) return s;
  if (action === "reset") return createSafeState();
  let n: SafeState = { ...s, events: [...s.events] };
  const log = (purpose: string, message: string, status = "Recorded", recipients = CORE) =>
    n.events.push({ id: `safe-${n.events.length + 1}`, time: clock(n), author: role, recipients, purpose, message, status, version: n.version });
  switch (action) {
    case "record": n.recorded = true; log("Private reported concern", "Adult guest reports that someone is trying to find them and asks that their room or location never be shared. Only necessary information recorded."); break;
    case "own": n.owned = true; log("Named ownership", `Morgan, Duty Manager (fictional), accepts ownership. Concern open; propose next update through an agreed safe contact by ${time(n.followupAt)}.`); break;
    case "assess": n.assessed = true; log("Human urgency assessment", "Morgan assesses the reported concern. No inferred danger, diagnosis or score. Immediate-danger procedures remain available independently of routine checks."); break;
    case "contact": n.contact = true; log("Safe contact preference", `Through Reception only; next update ${time(n.followupAt)}. No room calls, public announcements or location disclosure.`); break;
    case "consent": n.consent = "agreed"; log("Plan-only agreement", `Guest agrees to limited routine support for plan v${n.version}. Necessary information only to assigned response staff; practical tasks only to Guest Services; workload tasks only to Housekeeping.`); break;
    case "decline-support": n.consent = "declined"; log("Optional support declined", "Respect the choice. Concern remains open; named Duty Manager ownership, safe contact and follow-up remain needed. No routine instructions released."); break;
    case "space": n.space = true; log("Availability check", "Private support space available. No room, current or proposed location is recorded."); break;
    case "escort": n.escort = true; log("Capacity check", `${named(n)} has appropriate capacity for the routine plan. Recipient acceptance still required.`); break;
    case "review": n.reviewed = true; log("Human review", "Morgan reviewed reported facts, urgency, consent, safe contact and capacity. Scripted AI prepares options; it cannot assess danger or authorise the response."); break;
    case "approve": n.decision = "Approved"; log("Routine plan approved", "Morgan approves the checked routine plan. Instructions not released yet.", "Approved"); break;
    case "hold": n.decision = "Held"; log("Routine plan held", "Concern remains open with Morgan. No release; emergency path remains available.", "Held"); break;
    case "decline-plan": n.decision = "Declined"; log("Routine plan declined", "Concern not dismissed or resolved. Morgan owns the next review; no instructions released.", "Declined"); break;
    case "resume": n.decision = "Pending"; log("Routine decision reopened", "Review current checks before a new decision."); break;
    case "release":
      n.released = true;
      log("Discreet response request", `Limited authorised request to ${named(n)}: provide agreed discreet contact and practical support, coordinated through Reception only. Do not share any location. Acceptance and arrival still required.`, "Released", responseAudience(n));
      log("Authorised practical support", "Provide only the agreed practical assistance through Reception. Do not seek or broadcast guest details.", "Released", ["Guest Services", "Reception", "Duty Manager"]);
      log("Operational workload cover", "Cover Reception workload while the authorised lead responds. No guest details are needed.", "Released", ["Housekeeping lead", "Reception", "Duty Manager"]);
      break;
    case "accept": n.accepted = true; log("Response accepted", `${named(n)} explicitly accepts the discreet response. Arrival not recorded.`, "Accepted", responseAudience(n)); break;
    case "arrive": n.arrived = true; log("Staff contact arrival", `${named(n)} arrival recorded by synthetic receipt. Practical support not yet recorded as delivered.`, "Arrival recorded", responseAudience(n)); break;
    case "deliver": n.delivered = true; log("Support delivery receipt", "Agreed practical support/escort recorded by synthetic receipt. This does not establish safety. Guest feedback and follow-up remain separate.", "Delivery recorded", responseAudience(n)); break;
    case "practical": n.practical = true; log("Practical task accepted", "Guest Services accepted only the authorised practical assistance task through Reception.", "Accepted", ["Guest Services", "Reception", "Duty Manager"]); break;
    case "cover": n.cover = true; log("Workload cover accepted", "Housekeeping lead acknowledged Reception workload cover. No guest account shared.", "Accepted", ["Housekeeping lead", "Reception", "Duty Manager"]); break;
    case "unavailable": n.unavailable = true; n.replan = true; log("Assigned recipient unavailable", "Original response task remains outstanding, not delivered. Morgan must review reassignment and obtain renewed checks/approval and replacement acceptance.", "Outstanding", RESPONSE); break;
    case "missed": n.missed = true; n.replan = true; log("Missing acknowledgement", "Security has not accepted the released request. Assignment is not delivery. Morgan owns escalation and reassignment.", "Outstanding", RESPONSE); break;
    case "revise":
      n = { ...createSafeState(), version: s.version + 1, minute: s.minute, followupAt: s.minute + 20, recorded: true, owned: true, assignment: "Duty Manager", previousFeedback: s.feedback ?? s.previousFeedback, events: [...s.events], emergencyRequested: s.emergencyRequested, responderAccepted: s.responderAccepted, emergencyAuthors: [...s.emergencyAuthors] };
      log("Material plan revision", "Morgan proposes a manager-covered response. Earlier task remains in history, not a current instruction. Renew safe contact/agreement, space/capacity, review, approval, release and explicit acceptance.", "Review required");
      break;
    case "safer": case "still-unsafe": case "pending":
      n.feedback = action;
      if (action === "still-unsafe") { n.needsReview = true; n.followup = false; }
      log("Private guest feedback", action === "safer" ? "Guest reports feeling safer. This does not establish safety; follow-up and open concerns remain." : action === "pending" ? "Guest feedback left pending. No safety outcome inferred." : "Guest still feels unsafe. Response remains active; Morgan must review urgency and propose next action. Emergency help remains available.");
      break;
    case "overdue": n.minute = s.followupAt + 5; log("Fictional follow-up clock", `${time(n.followupAt)} follow-up is overdue. Morgan must separately record a safe-contact review.`, "Overdue"); break;
    case "followup": n.followup = true; log("Follow-up review", "Morgan recorded a synthetic safe-contact review. This does not close an unresolved concern or establish safety."); break;
    case "request-emergency":
      n.emergencyRequested = true; n.emergencyAuthors = [...s.emergencyAuthors, role];
      log("Simulated emergency help request", "Simulated request for local emergency help under hotel emergency procedures. No actual call or message sent. Responder acceptance is NOT confirmed.", "Requested — simulated", [...new Set<SafeRole>([...RESPONSE, role])]); break;
    case "confirm-responder": n.responderAccepted = true; log("Simulated responder acceptance", "Separate fictional responder acceptance receipt. No real responder contacted; safety not established.", "Acceptance — simulated", [...new Set<SafeRole>([...RESPONSE, ...n.emergencyAuthors])]); break;
  }
  return n;
}

function next(s: SafeState): { role: SafeRole; action: SafeAction } | null {
  if (!s.recorded) return { role: "Reception", action: "record" };
  if (!s.owned) return { role: "Duty Manager", action: "own" };
  if (s.replan || s.needsReview) return { role: "Duty Manager", action: "revise" };
  if (s.decision === "Held" || s.decision === "Declined") return { role: "Duty Manager", action: "resume" };
  if (!s.assessed) return { role: "Duty Manager", action: "assess" };
  if (!s.contact) return { role: "Guest", action: "contact" };
  if (s.consent === null) return { role: "Guest", action: "consent" };
  if (s.consent === "declined") return !s.followup ? { role: "Duty Manager", action: s.minute < s.followupAt ? "overdue" : "followup" } : null;
  if (!s.space) return { role: "Reception", action: "space" };
  if (!s.escort) return { role: "Duty Manager", action: "escort" };
  if (!s.reviewed) return { role: "Duty Manager", action: "review" };
  if (s.decision !== "Approved") return { role: "Duty Manager", action: "approve" };
  if (!s.released) return { role: "Duty Manager", action: "release" };
  if (!s.accepted) return { role: s.assignment, action: "accept" };
  if (!s.practical) return { role: "Guest Services", action: "practical" };
  if (!s.cover) return { role: "Housekeeping lead", action: "cover" };
  if (!s.arrived) return { role: s.assignment, action: "arrive" };
  if (!s.delivered) return { role: s.assignment, action: "deliver" };
  if (!s.feedback) return { role: "Guest", action: "pending" };
  if (!s.followup) return { role: "Duty Manager", action: s.minute < s.followupAt ? "overdue" : "followup" };
  return null;
}

export function safeView(s: SafeState, role: SafeRole) {
  const actions = safeActions(s, role);
  const core = privateView(role), security = role === "Security";
  const taskRole = role === "Housekeeping lead" || role === "Guest Services";
  const ownTask = role === "Housekeeping lead" ? "cover" : "practical";
  const publicNext = s.released && !s.replan && s.accepted
    ? !s.practical ? { role: "Guest Services" as SafeRole, action: "practical" as SafeAction }
      : !s.cover ? { role: "Housekeeping lead" as SafeRole, action: "cover" as SafeAction }
      : !s.arrived ? { role: s.assignment as SafeRole, action: "arrive" as SafeAction }
      : !s.delivered ? { role: s.assignment as SafeRole, action: "deliver" as SafeAction } : null : null;
  const target = taskRole
    ? s.released && !s.replan && !(role === "Housekeeping lead" ? s.cover : s.practical) ? { role, action: ownTask as SafeAction } : publicNext
    : security ? s.released && !s.replan && s.assignment === "Security" && !s.delivered
      ? !s.accepted ? { role, action: "accept" as SafeAction } : publicNext : null
    : next(s);
  const primary = target?.role === role ? actions.find(a => a.type === target.action) ?? null : null;
  // No private feedback-dependent navigation for support/workload roles.
  const handover: SafeRole | null = taskRole || security
    ? target && target.role !== role ? target.role : target ? null : "Duty Manager"
    : target?.role !== role ? target?.role ?? null : null;
  const routine = actions.filter(a => !["reset", "request-emergency", "confirm-responder"].includes(a.type));
  // Even identifiers are scoped: a global sequence must not reveal hidden activity.
  const records = s.events.filter(e => e.recipients.includes(role)).map((e, i) => ({ ...e, id: `visible-${i + 1}` }));
  const summary = taskRole ? [
    role === "Housekeeping lead" ? `Reception workload cover: ${s.cover ? "acknowledged" : s.released && !s.replan ? "awaiting acknowledgement" : "no current authorised task"}. No guest details.`
      : `Practical assistance: ${s.practical ? "accepted" : s.released && !s.replan ? "awaiting acceptance" : "no current authorised task"}. Through Reception only.`,
    "Private guest account and feedback are not included in this view.",
  ] : security && s.assignment !== "Security" ? [
    "No current authorised Security task. Earlier records are retained, not current instructions.",
    "Morgan retains coordination ownership. No replacement support account or private feedback is shared.",
  ] : [
    "Concern remains open — no safety outcome is automatically established.",
    `Accountable owner: ${s.owned ? "Morgan, Duty Manager (fictional)" : "Duty Manager ownership not yet accepted"}.`,
    `Routine plan v${s.version}: ${s.replan ? "paused; renewed review and plan required" : s.decision}.`,
    `Response: ${s.delivered ? "support delivered by synthetic receipt; not proof of safety" : s.arrived ? "staff arrival recorded; delivery not recorded" : s.accepted ? "accepted; staff arrival pending" : s.released ? "released; acceptance outstanding" : "not released"}.`,
    ...(s.version > 1 ? ["Earlier response evidence remains in history, not proof of the replacement. Morgan owns outstanding reassignment until its acceptance and delivery are recorded."] : []),
    ...core ? [
      `Optional support: ${s.consent === "declined" ? "declined; respect choice, concern still open" : s.consent === "agreed" ? "agreed for this plan only" : "agreement not recorded"}.`,
      `Contact: ${!s.contact ? "safe contact preference not yet confirmed" : s.consent === "declined" ? "routine support declined; Morgan owns agreed safe follow-up through Reception" : `${s.accepted ? "Named" : "Proposed"} staff contact ${named(s)}; method agreed through Reception only${s.accepted ? "; acceptance recorded" : "; no commitment until checks, approval and staff acceptance"}`}.`,
      `Guest feedback: ${s.feedback === "safer" ? "reports feeling safer; safety not established" : s.feedback === "still-unsafe" ? "still feels unsafe — active response and manager review needed" : "pending — no outcome inferred"}.`,
      ...(s.previousFeedback === "still-unsafe" ? ["Earlier feedback: still unsafe. Replacement response requires fresh evidence."] : []),
      `${s.contact ? "Agreed next" : "Proposed next"} update: ${time(s.followupAt)}, Morgan via Reception. ${!s.contact ? "Safe contact not yet agreed; do not promise contact." : s.followup ? "Follow-up review recorded; concern not automatically closed." : s.minute >= s.followupAt ? "OVERDUE — follow-up remains open." : "Follow-up open."}`,
      ...role !== "Guest" ? [
        `Guest Services practical task: ${!s.released ? "not released" : s.practical ? "accepted" : "acceptance outstanding"}.`,
        `Housekeeping workload cover: ${!s.released ? "not released" : s.cover ? "acknowledged" : "acknowledgement outstanding"}.`,
      ] : [],
    ] : ["Private guest feedback and disclosure are excluded. Morgan retains follow-up ownership."],
  ];
  const emergencyVisible = RESPONSE.includes(role) || s.emergencyAuthors.includes(role);
  if (s.emergencyRequested && emergencyVisible) summary.push(`Emergency help: ${s.responderAccepted ? "separate simulated responder acceptance recorded" : "simulated request only; responder acceptance unconfirmed"}. No real contact made.`);
  return {
    version: s.version, clock: clock(s),
    status: taskRole ? "Operational tasks only" : security ? "Limited response view" : s.replan || s.needsReview ? "Active — renewed review needed" : "Concern open",
    intro: core ? 'At 6:10 pm, an adult guest privately tells Reception: “Someone is trying to find me. I do not feel safe. Please do not share my room or location.” This is a reported concern, not inferred danger.'
      : security ? "A limited discreet response may be authorised to you. Do not seek or share a guest's room or location. Receive only the information needed for your task."
      : "An authorised team is coordinating discreet support. This view shows only necessary practical or workload tasks, never a private guest account.",
    context: taskRole ? "Act only on your authorised task. Private support details are not needed."
      : security ? "Accept the current instruction explicitly, then record arrival and delivery separately. Report unavailability; never assume assignment is delivery."
      : s.consent === "declined" ? "Optional support is declined, not the concern. Named site ownership and safe follow-up remain necessary; emergency help stays available."
      : s.replan || s.needsReview ? "The response stays active. Morgan must reassess urgency and review a changed plan; previous evidence is retained, not reused as approval."
      : "Coordinate the next checked action. People assess urgency; consent, availability and capacity are checked before routine commitments.",
    primary,
    alternatives: routine.filter(a => a.type !== primary?.type),
    handover, summary, records,
    history: records.map(e => ({ time: e.time, version: e.version, text: `${e.purpose}: ${e.message}` })),
    facts: core ? ["Source: adult guest's explicit private report to Reception at 6:10 pm.", "Source: guest-selected safe contact and plan-only sharing choices, recorded only when selected.", "Source: staff checks of space and escort capacity; unconfirmed until recorded.", "No current/proposed room or location is collected in this demonstration."]
      : security ? ["Source: limited authorised response instruction, once released.", "Space availability and appropriate staff capacity need checks; no location is shared."] : ["Source: authorised practical/workload instruction only, once released."],
    suggestion: core ? "Scripted AI organises the reported facts and flags missing safe contact, consent, ownership, space and staff checks. It can prepare discreet routine options; it cannot infer danger, diagnose, assess urgency, authorise, contact anyone or establish safety."
      : "Scripted assistance can organise your authorised task. Rules control release; people decide and acknowledge. No live AI or messages.",
    feedbackNotice: core && s.feedback ? s.feedback === "pending" ? "Feedback left pending. No safety outcome inferred." : s.feedback === "still-unsafe" ? "Still unsafe: response active. Morgan owns urgent reassessment and follow-up." : "Guest reports feeling safer. Delivered support and reported feedback do not establish safety." : null,
    emergencyActions: actions.filter(a => ["request-emergency", "confirm-responder"].includes(a.type)),
  };
}
