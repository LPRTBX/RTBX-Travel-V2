// Hotel wording and presentation, keyed by Core ids. Core owns the lifecycle; Travel owns these words.
// A test fails if this file names an id Core does not define, or a Core id has no wording here.
import type { Command } from "@workspace/jaldo-orchestration";

/** Action types: how each step is described to people. */
export const STEP: Record<string, { title: string; unit: string }> = {
  "share-reception": { title: "Share the request with Reception", unit: "Reception" },
  "share-guest-services": { title: "Share the request with Guest services", unit: "Guest services" },
  "share-duty-cover": { title: "Share the request with Duty cover", unit: "Duty cover" },
  "space-check": { title: "Check a quiet space is available", unit: "Reception" },
  "space-recheck": { title: "Check the quiet space again", unit: "Reception" },
  "capacity-check": { title: "Check staff capacity", unit: "Housekeeping" },
  "capacity-recheck": { title: "Check staff capacity again", unit: "Housekeeping" },
  "support-handover": { title: "Hand the practical support to Guest services", unit: "Guest services" },
  "replacement-handover": { title: "Hand the support to Duty cover instead", unit: "Duty cover" },
  "workload-instruction": { title: "Ask Housekeeping to reassign one task", unit: "Housekeeping" },
};

/** Core plan step statuses. */
export const STEP_STATUS: Record<string, string> = {
  "to-prepare": "Not yet prepared", prepared: "Prepared", "awaiting-approval": "Awaiting approval", authorised: "Approved, not yet released",
  blocked: "Waiting", "in-progress": "In progress", done: "Done", unresolved: "Needs a decision",
};

/** Action states, in words that never claim more than the record. */
export const STATE_WORDS: Record<string, string> = {
  proposed: "Prepared", awaiting_approval: "Awaiting approval", approved: "Approved, not released", queued: "Queued, not sent",
  sent: "Released (simulated: nothing is sent)", received: "Received", accepted: "Accepted", completed: "Delivery reported by the unit",
  confirmed: "Confirmed by the guest", withdrawn: "Withdrawn", not_approved: "Not approved", declined: "Declined", unresolved: "Needs a decision",
};

/** What each command is called on a button. Core decides whether it is accepted. */
export const VERB: Record<string, string> = {
  acceptRequest: "Accept responsibility for this request", propose: "Prepare", submit: "Put forward for approval", approve: "Approve", refuse: "Do not approve",
  revokeApproval: "Take back this agreement (before anything is sent)", execute: "Release", receive: "Record receipt", accept: "Accept", decline: "Decline",
  complete: "Report delivered", confirm: "Confirm", recheck: "Check again", withdraw: "Withdraw", releaseCommunication: "Release the prepared message",
  revisePlan: "Revise the plan (material change)", rescheduleDeadline: "Move the due time 30 minutes later", cancelDeadline: "Cancel the deadline",
  linkWork: "Link", recordLinkStatus: "Record", withdrawLink: "Withdraw link",
};
/** Commands that stop or step back rather than move the response forward. Presentation only; Core still decides acceptance. */
export const STOPS: ReadonlySet<Command["type"]> = new Set(["withdraw", "refuse", "decline", "revokeApproval", "cancelDeadline", "withdrawLink", "revisePlan"]);

/** Short names for Core's configured deadlines. The configured expectation (e.g. "90 minutes") is Core's label and is not repeated as if it were the due time: the recorded due time is what is shown. */
export const DEADLINE_NAMES: Record<string, string> = {
  "handover-acceptance": "Guest services accept the handover",
  "guest-response-window": "Guest response deadline",
  "follow-up-review": "Follow-up review deadline",
};
export const REASON_WORDS: Record<string, string> = { "material-change": "a material change" };

/** Plain wording for the guest about sharing. The commands are unchanged; only what the guest reads. */
export const GUEST_SHARE = {
  step: (unit: string) => `Choose what to share with ${unit}`,
  allow: (unit: string) => `Allow ${unit} to see these details`,
  decline: (unit: string) => `Do not allow ${unit} to see these details`,
  takeBack: (unit: string) => `Take back permission for ${unit} (before anything is sent)`,
  section: "What you can choose to share",
  waiting: "awaiting your choice",
  would: (unit: string, fields: string) => `Would share with ${unit}: ${fields}`,
};

/** Short introductions, one per kind of role. */
export const INTRO: Record<"holder" | "subject" | "unit" | "linked", { heading: string; body: string }> = {
  holder: { heading: "Room delayed · practical support requested", body: "Alex has asked for somewhere calm, water and help with luggage. Coordinate the response; track the room repair separately." },
  subject: { heading: "Your quiet-space request", body: "You choose which details can be shared. Check progress and tell the team whether the support helped." },
  unit: { heading: "Your part in the response", body: "See the work and information shared with your team." },
  linked: { heading: "Your linked work", body: "Update the work assigned to you. Required checks and independent repairs have different effects." },
};

/** Labels for sections the reviewer sees (presentation only). */
export const WORDS = {
  actionsNote: "Actions follow the response's permissions and checks.",
  moreActions: "More permitted actions",
  unavailable: "Unavailable actions",
  nextStep: "Your next step",
  otherWork: "Other available work",
  attention: "Needs attention now",
  requiredChecks: "Required checks",
  relatedWork: "Related work · stays open separately",
  deliveryFollowUp: "Delivery reported — follow-up open",
};

/** What JALDO does in this demonstration, said accurately. */
export const JALDO_DOES = {
  signalsHeading: "JALDO is watching permitted system events",
  signalsBody: "Fictional property and maintenance events arrive here. JALDO recognises a possible need and recommends a response; people decide; nothing is shared or sent without them.",
  openedHeading: "Proactive check-in · room delay",
  openedBody: "JALDO recognised a delay from system events. Coordinate the response with the guest's own choice; track the room repair separately.",
  guestWaitingHeading: "Your stay",
  guestWaitingBody: "The hotel has not contacted you about help. Nothing about you has been shared.",
  unitWaitingBody: "Nothing has been sent to your team. You will see only what is sent to you.",
  guestOpenedHeading: "Your room is delayed",
  guestOpenedBody: "The hotel noticed and is offering practical help. You choose whether it is wanted, and exactly what is shared.",
};

/** Core contract status as the repository records it. A merged contract is not an accepted contract. */
export const CONTRACTS: { name: string; status: string; used: string }[] = [
  { name: "jaldo.event envelope and event admission (contracts/events.ts, admitEvent)", status: "In Core. Used by Core's kernel for opening and capacity events.", used: "Used: every signal is validated against the envelope; the opening event is admitted by Core." },
  { name: "Kernel contract 1.2.0 (plan versions, approval prerequisites, deadlines, responses, linked work)", status: "Merged to Core main (#120, #121). Its documents say “draft for review”; no owner acceptance is recorded.", used: "Used, pinned (79939dc). A review demonstration, not an acceptance claim." },
  { name: "Kernel contract 1.3.0", status: "DRAFT. Merged to Core main without a recorded owner review (#126, #128); “not reviewed, not accepted”.", used: "Not used. Core main is already at 1.3.0; this workspace stays on the pinned 1.2.0." },
  { name: "ADR-0036 (coordination foundation)", status: "Accepted by the owner (recorded 2026-10-31).", used: "Not exercised here (no server, storage or bridge)." },
  { name: "ADR-0037 (multi-party coordination; queued execution)", status: "Proposed. Not accepted.", used: "Not relied on." },
  { name: "ADR-0038 (federation), consent withdrawal design", status: "Proposed / design only. Not accepted, not implemented.", used: "Not used. Withdrawal is outside this demonstration." },
  { name: "Advisory recommendation contract (api-server/src/ai/recommendation.ts)", status: "Exists in Core code; no model is connected here.", used: "Not invoked." },
];

/** What Core does not provide, precisely. Each is checked by a test in this workspace. */
export const GAPS: { id: string; gap: string; boundary: string }[] = [
  { id: "G1", gap: "No accepted pre-request signal store: ordering, staleness, per-source freshness limits, business-field validation (required fields, allowed values, room matching, full timestamps), cross-source correlation. Core's duplicate rule (idempotency key) exists only inside an opened coordination, and its event envelope checks shape, scope, purpose, classification and permitted context only.", boundary: "The signal desk (Travel-side adapter) mirrors the duplicate rule and adds event-time ordering, freshness limits re-evaluated whenever the clock moves and at adoption, future-date rejection and the business checks. Labelled a demonstration, not a Core capability." },
  { id: "G2", gap: "Core admits only an opening event and capacity changes. A maintenance work-order event cannot be recorded as a fact in a coordination.", boundary: "Maintenance facts are held by the desk and shown with source and time; Core refuses the event type (shown in the signal table)." },
  { id: "G3", gap: "A system actor may open a request only because this configuration's prepare-plan automation lets the kernel's system actor prepare. Core has no purpose-specific permission for \"open from an integration\", and no accepted contract says whether a system may open a guest-related request unprompted.", boundary: "Core's configured system actor records the opening event, and only after the Duty lead adopts the recognised moment. Whether that is acceptable policy is a decision for Core's owners." },
  { id: "G4", gap: "Core derives recommendations for the request owner after acceptance. None exists for an addressed holder who has not accepted, or as a role-scoped queue.", boundary: "The pre-acceptance recommendation is the desk's, not Core's. After acceptance, Core's plan, approvals and recognition drive everything." },
  { id: "G5", gap: "No Core command for a holder to adopt a recognised pre-request moment, and no adoption evidence contract: Core's record holds the opening event (id, sequence, idempotency key) but has no field for who decided, when, why, on which sources or under which rule version.", boundary: "The Duty lead's button triggers Core's configured system actor. A demonstration decision record (authorised by, when, reason, source references, rule version) is kept by this adapter beside Core's opening event, and is labelled as not Core evidence." },
  { id: "G6", gap: "No Core record for process-review proposals or rule changes.", boundary: "Proposals are shown for authorised review and recorded nowhere; no rule changes." },
  { id: "G7", gap: "Not connected: real PMS and maintenance systems, verified identity and grants, delivery channels, a recommendation model.", boundary: "Everything is fictional, in-page and simulated." },
  { id: "G8", gap: "No Core contract for the guest to accept or decline an offer of help, distinct from sharing approvals; no record of an offer; no deadline or no-response handling for an unanswered offer. Core's `responses` apply only to completed work.", boundary: "The guest's Yes, No thanks or no response is a demonstration record, and a demonstration gate keeps sharing choices closed until the guest says yes. Agreement to share never stands in for accepting help. Withdrawing after sharing is outside this demonstration." },
  { id: "G9", gap: "No Core contract for stopping released work, recalling shared information or withdrawing a permission after disclosure (the consent-withdrawal design is a proposal only). Core's `withdraw` and `revokeApproval` apply before release.", boundary: "Declining further help is recorded as the guest's request and nothing else: no Core evidence is added, nothing is cancelled, recalled or withdrawn, and released steps are listed for the Duty lead's manual review with whatever Core actions it does offer." },
];

/** The guest's answers about help, in their own words. */
export const HELP_WORDS: Record<string, string> = { yes: "Yes, I would like help", no: "No thanks", unanswered: "No response" };
export const HELP_DECLINED: Record<string, boolean> = { yes: false, no: true, unanswered: false };
export const HELP_FURTHER = "I don't want further help";
export const HELP_ACCEPTED: Record<string, boolean> = { yes: true, no: false, unanswered: false };

export const LINK_REF: Record<string, string> = { "facility-repair": "WO-1182", "area-safety-clearance": "SC-77" };

export const STRENGTH: Record<string, string> = {
  "system-recorded": "recorded by the system",
  "actor-recorded": "recorded by the person named",
  "party-recorded": "recorded by the party itself",
  attested: "recorded by a member on the party's behalf (attested)",
  "standing-policy": "authorised by standing policy",
};

export const LABELS = {
  banner: "Interactive demonstration · fictional system events · simulated delivery",
  roleNote: "Demo role · not access control. Choosing a role only changes which view and which Core actor you try things as.",
};

export const PATHS: { id: string; title: string; what: string; try: string }[] = [
  { id: "normal", title: "Normal practical-support journey", what: "Starts at the request. Follow “Your next step” as each role.", try: "Begin as Duty lead and accept responsibility. Core prepares the plan; switch roles as the next step moves." },
  { id: "missing", title: "Missing approval prerequisite", what: "Everything is prepared and put forward, with no checks done.", try: "As Duty lead, open the plan: the handover is waiting and Core names what it needs. No approval is offered." },
  { id: "capacity", title: "Capacity withdrawn after approval", what: "The handover is approved, not yet released.", try: "Press “Housekeeping unavailable”. Core withdraws the approval and refuses release; renew the capacity check, then approve again." },
  { id: "dependency", title: "Required safety dependency blocks release", what: "Approved, with the area safety clearance linked and not resolved.", try: "As Duty lead, release is not offered and the plan says why. As Maintenance, resolve the clearance, then release." },
  { id: "didnothelp", title: "Guest says “did not help”", what: "Support has been delivered by Guest services.", try: "As Guest choose “Still needs support”. The delivery record stays; a follow-up opens for the Duty lead." },
  { id: "noresponse", title: "No response and deadline expiry", what: "Support delivered, the guest has not answered.", try: "Advance the synthetic clock past the response window. Core raises one overdue item; no response stays unknown." },
  { id: "maintenance", title: "Support completes while maintenance stays open", what: "Delivered and confirmed, with an independent repair linked and open.", try: "As Duty lead see the repair listed separately and still open; as Maintenance see only your own work." },
];

/** Words for Core's own record statuses (lookups, so no view compares lifecycle state). */
export const DEADLINE_WORDS: Record<string, string> = { open: "open", met: "met", cancelled: "cancelled" };
export const FOLLOWUP_WORDS: Record<string, string> = { open: "open", closed: "closed" };
export const LINK_WORDS: Record<string, string> = { open: "open", resolved: "resolved", unknown: "status not yet known" };
/** Which recorded statuses call for the holder's attention first (presentation only; Core owns the statuses and what they allow). */
export const NEEDS_ATTENTION = { followUp: { open: true, closed: false } as Record<string, boolean>, link: { open: true, unknown: true, resolved: false } as Record<string, boolean> };
export const DEPENDENCY_WORDS: Record<string, string> = {
  required: "Required: blocks release of the handover until it is resolved.",
  informational: "Independent: tracked beside this response; it neither blocks nor is closed by it.",
};

/** What "complete" means for each kind of step, in words that do not overclaim. */
export const COMPLETE: Record<string, string> = {
  "share-reception": "Report the request received and noted", "share-guest-services": "Report the request received and noted", "share-duty-cover": "Report the request received and noted",
  "space-check": "Report the space check done", "space-recheck": "Report the space check done", "capacity-check": "Report the capacity check done", "capacity-recheck": "Report the capacity check done",
  "support-handover": "Report the support delivered", "replacement-handover": "Report the support delivered", "workload-instruction": "Report the task reassigned",
};
