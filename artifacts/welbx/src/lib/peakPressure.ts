/**
 * Stage 3 · Peak-period team pressure — a planned capability, simulated with synthetic data.
 *
 * Several operational signals together suggest that demand at Harbour Hotel is
 * outrunning the team's capacity and recovery time. The pattern is about the
 * operation, never about a person: no individual is named, scored or labelled,
 * and nothing here infers anyone's health. An accountable manager decides what
 * happens; approval, execution and verified outcome are recorded separately.
 * Personal support stays with a restricted role. Nothing is sent.
 */

export type ChallengeId = "standard" | "signals" | "capacity" | "role" | "declined" | "evidence";

export const CHALLENGES: Array<{ id: ChallengeId; label: string; guide: string }> = [
  { id: "standard", label: "Standard run", guide: "All signals arrive and the plan has enough people to cover it." },
  { id: "signals", label: "Missing or conflicting signals", guide: "The break log is missing and two sources disagree on who is on shift. The manager can ask for more information before deciding." },
  { id: "capacity", label: "Not enough people to prepare", guide: "One support role is also unavailable, so break cover is short. Closing the gap needs portfolio support from another property." },
  { id: "role", label: "Wrong approval role", guide: "The Front Office Supervisor tries to approve. Only the Duty Manager may decide." },
  { id: "declined", label: "Intervention declined or deferred", guide: "The manager continues monitoring with a reason and a review time, or declines. Nothing is executed." },
  { id: "evidence", label: "Missing follow-up evidence", guide: "The break record is not completed after the peak, so that result stays unconfirmed and the case cannot close." },
];

export type Reliability = "high" | "medium" | "low";
export type SignalStatus = "present" | "missing" | "conflicting";
export type SignalKind = "demand" | "capacity" | "recovery" | "workload" | "service";

export interface PressureSignal {
  id: string;
  kind: SignalKind;
  label: string;
  value: string;
  source: string;
  observedAt: string;
  reliability: Reliability;
  status: SignalStatus;
  /** Why the reading is limited, missing or in conflict. */
  note?: string;
}

export const KIND_LABELS: Record<SignalKind, string> = {
  demand: "Demand", capacity: "Team capacity", recovery: "Recovery time", workload: "Workload", service: "Service",
};

export function buildSignals(challenge: ChallengeId, informationReceived = false): PressureSignal[] {
  const degraded = challenge === "signals" && !informationReceived;
  return [
    { id: "arrivals", kind: "demand", label: "Arrivals 14:00–16:00", value: "46 expected (typical 28)", source: "PMS arrivals list (simulated feed)", observedAt: "13:05", reliability: "high", status: "present" },
    degraded
      ? { id: "roster", kind: "capacity", label: "Front office on shift", value: "Roster shows 3; badge-in count shows 4", source: "Roster (manual entry) vs door badge log (simulated)", observedAt: "12:40", reliability: "low", status: "conflicting", note: "The two sources disagree. A supervisor needs to confirm who is actually on the desk." }
      : { id: "roster", kind: "capacity", label: "Front office on shift", value: informationReceived ? "3 of 5 planned (confirmed by the supervisor)" : "3 of 5 planned; 2 shifts uncovered", source: informationReceived ? "Roster, confirmed by the Front Office Supervisor" : "Roster (manual entry)", observedAt: informationReceived ? "13:40" : "12:40", reliability: informationReceived ? "high" : "medium", status: "present" },
    degraded
      ? { id: "breaks", kind: "recovery", label: "Breaks taken", value: "No break records since 09:00", source: "Time and attendance (simulated)", observedAt: "13:00", reliability: "low", status: "missing", note: "No record is not the same as no break: logging may simply be incomplete." }
      : { id: "breaks", kind: "recovery", label: "Breaks taken", value: informationReceived ? "4 team members past 5 hours without a break (confirmed count)" : "4 team members past 5 hours without a recorded break", source: informationReceived ? "Supervisor check of the break log" : "Time and attendance (simulated)", observedAt: informationReceived ? "13:40" : "13:00", reliability: "medium", status: "present", note: "A count for the team only. Nobody is named or assessed." },
    { id: "backlog", kind: "workload", label: "Open task backlog", value: "31 open tasks, up 40% in an hour", source: "Task queue (simulated feed)", observedAt: "13:10", reliability: "high", status: "present" },
    { id: "delays", kind: "service", label: "Service delays", value: "Check-in averaging 14 min (target 8); 3 wait-time complaints in 45 min", source: "Front desk timings and guest app (simulated)", observedAt: "13:15", reliability: "medium", status: "present" },
    { id: "housekeeping", kind: "capacity", label: "Housekeeping afternoon staffing", value: "Not reported", source: "Housekeeping roster (not connected)", observedAt: "—", reliability: "low", status: "missing", note: "Unknown, so it is not counted for or against the pattern." },
  ];
}

export interface PatternAssessment {
  warrantsReview: boolean;
  elevatedKinds: SignalKind[];
  gaps: PressureSignal[];
  confidence: "normal" | "reduced";
  explanation: string;
}

/**
 * Review is warranted when at least three kinds of signal are elevated within the hour,
 * including one about the team's capacity or recovery and one about demand, workload or service.
 * A conflicting reading counts only when every version of it points the same way (here,
 * 3 or 4 of 5 planned staff are both short), and it lowers confidence. A missing reading
 * never counts as evidence either way.
 */
export function assessPattern(signals: PressureSignal[]): PatternAssessment {
  const usable = signals.filter(s => s.status !== "missing");
  const elevatedKinds = [...new Set(usable.map(s => s.kind))];
  const people = elevatedKinds.some(k => k === "capacity" || k === "recovery");
  const pressure = elevatedKinds.some(k => k === "demand" || k === "workload" || k === "service");
  const gaps = signals.filter(s => s.status !== "present");
  const warrantsReview = elevatedKinds.length >= 3 && people && pressure;
  // Housekeeping staffing is never connected in this scenario; it is shown as unknown but does not lower confidence.
  const confidence = gaps.some(g => g.id !== "housekeeping") ? "reduced" : "normal";
  return {
    warrantsReview, elevatedKinds, gaps, confidence,
    explanation: warrantsReview
      ? `${elevatedKinds.length} different kinds of signal point the same way within an hour: demand is above normal while the team has fewer people${elevatedKinds.includes("recovery") ? " and less recovery time" : ""}. Together they suggest the operation, not any person, needs a decision now.${confidence === "reduced" ? " Some readings are missing or in conflict, so confidence is reduced: the manager can ask for confirmation before deciding." : ""}`
      : "Not enough independent signals agree to ask a manager to review. The pattern keeps being watched.",
  };
}

export const ACTORS = {
  "fo-supervisor": "Front Office Supervisor · Harbour Hotel",
  "duty-manager": "Duty Manager · Harbour Hotel",
  "general-manager": "General Manager · Harbour Hotel",
  "guest-services": "Guest Services Lead · Harbour Hotel",
  "housekeeping-lead": "Housekeeping Lead · Harbour Hotel",
  "people-lead": "People & Culture Lead (restricted)",
  "regional-ops": "Regional Operations Manager (portfolio)",
} as const;
export type ActorId = keyof typeof ACTORS;

/** Only this role may decide the review. */
export const REVIEW_ROLE: ActorId = "duty-manager";
/** Only this role may approve the learning proposal. */
export const LEARNING_ROLE: ActorId = "general-manager";
export const MIN_REASON = 10;
export const MONITOR_INTERVALS = [15, 30, 60] as const;

export type ReviewStatus = "awaiting-review" | "awaiting-information" | "monitoring" | "declined" | "approved";

export interface ActionItem {
  id: string;
  title: string;
  owner: ActorId;
  deadline: string;
  /** What must be true first. */
  dependsOn: string[];
  evidence: string;
  /** Present only when the plan needs it. */
  conditional?: string;
}

export type ActionState = "waiting" | "ready" | "done";

export interface MeasureResult { id: string; label: string; target: string; value: string | null; met: boolean | null }

export interface LearningProposal {
  text: string;
  basis: "complete" | "incomplete";
  status: "proposed" | "approved" | "rejected";
  decidedBy?: ActorId;
  reason?: string;
}

export interface PeakState {
  challenge: ChallengeId;
  informationReceived: boolean;
  review: { status: ReviewStatus; by?: ActorId; reason?: string; reviewInMinutes?: number; requested?: string; history: string[] };
  /** The guest-message draft needs the Duty Manager's approval before its action can finish. It is never sent. */
  draftApproved: boolean;
  /** Set when the portfolio approves cross-property support (capacity challenge). */
  portfolioSupportApproved: boolean;
  done: Record<string, string>;
  measures: MeasureResult[] | null;
  learning: LearningProposal | null;
}

export function initialPeakState(challenge: ChallengeId): PeakState {
  return {
    challenge, informationReceived: false,
    review: { status: "awaiting-review", history: [] },
    draftApproved: false, portfolioSupportApproved: false, done: {}, measures: null, learning: null,
  };
}

/** People available to redistribute to the front desk and break cover, and how many the plan needs. */
export function capacity(state: PeakState) {
  const needed = 2;
  const available = state.challenge === "capacity" ? 1 : 2;
  const gap = Math.max(0, needed - available - (state.portfolioSupportApproved ? 1 : 0));
  return { needed, available, gap };
}

export function planFor(state: PeakState): ActionItem[] {
  const short = state.challenge === "capacity";
  const plan: ActionItem[] = [
    { id: "redistribute", title: "Move a reservations agent and the concierge to the front desk for the peak", owner: "fo-supervisor", deadline: "13:45", dependsOn: ["approval"], evidence: "Roster change recorded" },
    { id: "breaks", title: "Stagger breaks so everyone on shift has one by 15:00, covered by the redistributed staff", owner: "fo-supervisor", deadline: "15:00", dependsOn: ["redistribute", ...(short ? ["capacity"] : [])], evidence: "Count of team members with a recorded break (team total only)" },
    { id: "expectations", title: "Prepare a message for arriving guests about waits and early bag drop", owner: "guest-services", deadline: "14:00", dependsOn: ["approval", "draft"], evidence: "Draft approved by the Duty Manager and held; it is not sent from the demonstration" },
    { id: "housekeeping", title: "Re-prioritise the task queue for rooms needed by today's arrivals", owner: "housekeeping-lead", deadline: "14:30", dependsOn: ["approval"], evidence: "Queue order snapshot" },
    { id: "support", title: "Make the confidential support contact available to the whole team", owner: "people-lead", deadline: "14:00", dependsOn: ["approval"], evidence: "Offer shared with the team; who uses it is never recorded here" },
  ];
  if (short) {
    plan.push({ id: "escalate", title: "Escalate the cover gap to the General Manager and request portfolio support", owner: "duty-manager", deadline: "13:50", dependsOn: ["approval"], evidence: "Escalation and portfolio request recorded", conditional: "Needed because break cover is one person short" });
  }
  return plan;
}

function dependencyMet(state: PeakState, dependency: string) {
  if (dependency === "approval") return state.review.status === "approved";
  if (dependency === "draft") return state.draftApproved;
  if (dependency === "capacity") return capacity(state).gap === 0;
  return dependency in state.done;
}

export function actionState(state: PeakState, action: ActionItem): ActionState {
  if (action.id in state.done) return "done";
  return action.dependsOn.every(d => dependencyMet(state, d)) ? "ready" : "waiting";
}

export const DEPENDENCY_LABELS: Record<string, string> = {
  approval: "Duty Manager approval",
  draft: "Duty Manager approval of the draft",
  capacity: "Cover gap closed by portfolio support",
  redistribute: "Staff moved to the front desk",
};

const assertRole = (actor: ActorId, required: ActorId, what: string) => {
  if (actor !== required) throw new Error(`${ACTORS[actor]} cannot ${what}. Only the ${ACTORS[required]} may.`);
};
const assertReason = (reason: string) => {
  if (reason.trim().length < MIN_REASON) throw new Error(`Give a reason of at least ${MIN_REASON} characters.`);
};
const deciding = (state: PeakState) => {
  if (state.review.status !== "awaiting-review" && state.review.status !== "monitoring") {
    throw new Error(state.review.status === "awaiting-information" ? "Waiting for the requested information." : "The review has already been decided.");
  }
};

export type ReviewDecision =
  | { kind: "approve"; reason?: string }
  | { kind: "request-information"; request: string }
  | { kind: "monitor"; reason: string; reviewInMinutes: number }
  | { kind: "decline"; reason: string };

/** Decide the review. Throws, leaving the state unchanged, if the role, timing or reason is wrong. */
export function decideReview(state: PeakState, actor: ActorId, decision: ReviewDecision): PeakState {
  assertRole(actor, REVIEW_ROLE, "decide this review");
  deciding(state);
  const assessment = assessPattern(buildSignals(state.challenge, state.informationReceived));
  const by = ACTORS[actor];
  if (decision.kind === "approve") {
    if (assessment.confidence === "reduced") {
      if (!decision.reason) throw new Error("Some signals are missing or in conflict. Request more information first, or give a reason for approving now.");
      assertReason(decision.reason);
    }
    return { ...state, review: { ...state.review, status: "approved", by: actor, reason: decision.reason, history: [...state.review.history, `Intervention approved by ${by}${decision.reason ? `: “${decision.reason.trim()}”` : ""}`] } };
  }
  if (decision.kind === "request-information") {
    assertReason(decision.request);
    return { ...state, review: { ...state.review, status: "awaiting-information", by: actor, requested: decision.request.trim(), history: [...state.review.history, `More information requested by ${by}: “${decision.request.trim()}”`] } };
  }
  assertReason(decision.reason);
  if (decision.kind === "monitor") {
    if (!MONITOR_INTERVALS.includes(decision.reviewInMinutes as 15)) throw new Error("Choose a review time.");
    return { ...state, review: { ...state.review, status: "monitoring", by: actor, reason: decision.reason.trim(), reviewInMinutes: decision.reviewInMinutes, history: [...state.review.history, `Monitoring continued by ${by} for ${decision.reviewInMinutes} minutes: “${decision.reason.trim()}”`] } };
  }
  return { ...state, review: { ...state.review, status: "declined", by: actor, reason: decision.reason.trim(), history: [...state.review.history, `Intervention declined by ${by}: “${decision.reason.trim()}”`] } };
}

/** The requested confirmation arrives (simulated): conflicts are resolved and the review reopens. */
export function receiveInformation(state: PeakState): PeakState {
  if (state.review.status !== "awaiting-information") throw new Error("No information was requested.");
  return { ...state, informationReceived: true, review: { ...state.review, status: "awaiting-review", history: [...state.review.history, "Requested information received (simulated): roster and break count confirmed by the Front Office Supervisor"] } };
}

/** The monitoring review time is reached (simulated): the manager must decide again. */
export function reviewAgain(state: PeakState): PeakState {
  if (state.review.status !== "monitoring") throw new Error("Nothing is being monitored.");
  return { ...state, review: { ...state.review, status: "awaiting-review", history: [...state.review.history, `Review time reached after ${state.review.reviewInMinutes} minutes; the pattern is still present`] } };
}

export function approveDraft(state: PeakState, actor: ActorId): PeakState {
  assertRole(actor, REVIEW_ROLE, "approve the guest message draft");
  if (state.review.status !== "approved") throw new Error("The intervention has not been approved.");
  return { ...state, draftApproved: true };
}

export function approvePortfolioSupport(state: PeakState): PeakState {
  return { ...state, portfolioSupportApproved: true };
}

export function completeAction(state: PeakState, actionId: string, actor: ActorId, at: string): PeakState {
  const action = planFor(state).find(item => item.id === actionId);
  if (!action) throw new Error("Unknown action.");
  assertRole(actor, action.owner, `record “${action.title}”`);
  const current = actionState(state, action);
  if (current === "done") throw new Error("Already recorded.");
  if (current === "waiting") throw new Error(`Waiting for: ${action.dependsOn.filter(d => !dependencyMet(state, d)).map(d => DEPENDENCY_LABELS[d] ?? d).join(", ")}.`);
  return { ...state, done: { ...state.done, [actionId]: at } };
}

export function followThrough(state: PeakState) {
  const plan = planFor(state);
  return { done: plan.filter(a => a.id in state.done).length, total: plan.length };
}

/** Synthetic follow-up measurements. A measurement that was not taken stays unconfirmed. */
export function recordMeasures(state: PeakState): PeakState {
  const { done, total } = followThrough(state);
  if (state.review.status !== "approved" || done < total) throw new Error("Every action must be recorded before the follow-up is measured.");
  const breaksRecorded = state.challenge !== "evidence";
  const measures: MeasureResult[] = [
    { id: "wait", label: "Check-in wait at 15:00", target: "8 minutes or less", value: "7 minutes", met: true },
    { id: "breaks", label: "Team members with a recorded break by 15:00", target: "All on shift", value: breaksRecorded ? "5 of 5 (team total)" : null, met: breaksRecorded ? true : null },
    { id: "backlog", label: "Open task backlog at 15:00", target: "Back under 25", value: "18 open tasks", met: true },
    { id: "complaints", label: "Wait-time complaints 14:00–15:00", target: "None", value: "0", met: true },
  ];
  const basis = measures.every(m => m.value !== null) ? "complete" : "incomplete";
  return {
    ...state, measures,
    learning: {
      text: "Before the next peak — when 40 or more arrivals are forecast and any front-office shift is uncovered — move one support role to the front desk 60 minutes early and publish a break-cover rota before 12:00.",
      basis, status: "proposed",
    },
  };
}

export function outcome(state: PeakState) {
  if (!state.measures) return { label: "Not measured yet", canClose: false, unconfirmed: [] as string[] };
  const unconfirmed = state.measures.filter(m => m.value === null).map(m => m.label);
  return unconfirmed.length
    ? { label: "Partly confirmed: some results are unconfirmed", canClose: false, unconfirmed }
    : { label: "Confirmed against every measure", canClose: true, unconfirmed };
}

/** Record the missing follow-up evidence after the fact (simulated). */
export function recordMissingEvidence(state: PeakState): PeakState {
  if (!state.measures) throw new Error("Nothing has been measured yet.");
  const measures = state.measures.map(m => m.value === null ? { ...m, value: "5 of 5 (team total, recorded late)", met: true } : m);
  return { ...state, measures, learning: state.learning && state.learning.status === "proposed" ? { ...state.learning, basis: "complete" } : state.learning };
}

/** Approve or reject the learning proposal. Nothing is applied until it is approved. */
export function decideLearning(state: PeakState, actor: ActorId, approve: boolean, reason = ""): PeakState {
  if (!state.learning) throw new Error("There is no proposal yet.");
  if (state.learning.status !== "proposed") throw new Error("The proposal has already been decided.");
  assertRole(actor, LEARNING_ROLE, "decide the learning proposal");
  if (!approve || state.learning.basis === "incomplete") assertReason(reason);
  return { ...state, learning: { ...state.learning, status: approve ? "approved" : "rejected", decidedBy: actor, reason: reason.trim() || undefined } };
}

/** What the portfolio may see: aggregate exposure, response status and open decisions. Never people. */
export function portfolioSummary(state: PeakState) {
  const s = state.review.status;
  const response = s === "approved"
    ? state.measures ? `Measured · ${outcome(state).label.toLowerCase()}` : `In action · ${followThrough(state).done} of ${followThrough(state).total} actions recorded`
    : ({ "awaiting-review": "Awaiting Duty Manager review", "awaiting-information": "Waiting for requested information", monitoring: "Monitoring with a set review time", declined: "Declined with a reason" } as const)[s];
  const outstanding: string[] = [];
  if (s === "awaiting-review" || s === "monitoring") outstanding.push("Duty Manager review of the peak-pressure pattern");
  if (s === "awaiting-information") outstanding.push("Information requested by the Duty Manager");
  if (s === "approved" && !state.draftApproved) outstanding.push("Duty Manager approval of the guest message draft");
  if (s === "approved" && state.challenge === "capacity" && !state.portfolioSupportApproved) outstanding.push("Portfolio decision on cross-property cover");
  if (state.learning?.status === "proposed") outstanding.push("General Manager decision on the learning proposal");
  return {
    exposure: "1 property under peak pressure · 46 arrivals vs 28 typical · 2 uncovered front-office shifts",
    response,
    outstanding,
  };
}
