// Hotel wording and presentation, keyed by Core ids. Core owns the lifecycle; Travel owns these words.
// A test fails if this file names an id Core does not define, or a Core id has no wording here.
import type { Command } from "@workspace/jaldo-orchestration";

export const SITUATION = {
  eyebrow: "The situation · fictional demonstration",
  title: "A guest's room is delayed, and they've asked for somewhere quiet.",
  body: "At 9:00 am Alex, a fictional guest, asks: “Could I wait somewhere quieter and have some practical help?” The team needs an available space, enough capacity, Alex's own agreement to share, one accountable person, and an honest follow-up. Room repair stays a separate job.",
  image: "/images/travel/arrival-hero.webp",
  imageAlt: "A hotel host welcoming a guest at a warmly lit entrance",
};

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
  revisePlan: "Revise the plan (material change)", rescheduleDeadline: "Move the due time by 30 minutes", cancelDeadline: "Cancel the deadline",
  linkWork: "Link", recordLinkStatus: "Record", withdrawLink: "Withdraw link",
};
/** Commands that stop or step back rather than move the response forward. Presentation only; Core still decides acceptance. */
export const STOPS: ReadonlySet<Command["type"]> = new Set(["withdraw", "refuse", "decline", "revokeApproval", "cancelDeadline", "withdrawLink", "revisePlan"]);

export const LINK_REF: Record<string, string> = { "facility-repair": "WO-1182", "area-safety-clearance": "SC-77" };

export const STRENGTH: Record<string, string> = {
  "system-recorded": "recorded by the system",
  "actor-recorded": "recorded by the person named",
  "party-recorded": "recorded by the party itself",
  attested: "recorded by a member on the party's behalf (attested)",
  "standing-policy": "authorised by standing policy",
};

export const LABELS = {
  banner: "Fictional · synthetic clock · Demo role selector, not access control · Simulated delivery, nothing is sent · Configured rule, not live AI",
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
