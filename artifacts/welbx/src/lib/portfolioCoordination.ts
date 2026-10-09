/**
 * Stage 3 portfolio coordination — a planned capability, simulated with synthetic data.
 *
 * Each property keeps its own accountable people and decides its own cases.
 * Some situations become portfolio exceptions; each exception names exactly who
 * may decide it. Welfare cases never move to the portfolio: the portfolio sees
 * only that a restricted case is open. Nothing here is sent or stored outside
 * the browser.
 */

export type CapabilityStatus = "implemented" | "simulated" | "proposed";

export const CAPABILITY_LABELS: Record<CapabilityStatus, string> = {
  implemented: "Implemented in the Working Proof (one property)",
  simulated: "Simulated here (planned Stage 3)",
  proposed: "Proposed integration (not built)",
};

export interface PortfolioActor {
  id: string;
  label: string;
  /** Property the actor is accountable for; absent for portfolio roles. */
  propertyId?: string;
}

export interface LocalCase {
  title: string;
  ownerId: string;
  state: string;
}

export interface PortfolioProperty {
  id: string;
  name: string;
  type: string;
  size: string;
  /** What the property decides without the portfolio. */
  localAuthority: string;
  cases: LocalCase[];
}

export type ExceptionKind = "pattern" | "authority" | "welfare";

export interface PortfolioException {
  id: string;
  kind: ExceptionKind;
  title: string;
  propertyIds: string[];
  /** The rule that raised it to the portfolio. */
  rule: string;
  /** Every listed role must approve before the response goes ahead. Empty for welfare. */
  requiredApproverIds: string[];
  /** The proposed response that approval would allow. */
  proposedResponse: string;
  /** What stays with each property's own accountable people, whatever the portfolio decides. */
  staysLocal: string;
  evidenceRequired: string[];
  /** Welfare: the local role who keeps the case. */
  localDeciderId?: string;
}

export const PORTFOLIO_ACTORS: PortfolioActor[] = [
  { id: "regional-ops", label: "Regional Operations Manager (portfolio)" },
  { id: "dm-harbour", label: "Duty Manager · Harbour Hotel", propertyId: "harbour" },
  { id: "gm-coastal", label: "General Manager · Coastal Resort", propertyId: "coastal" },
  { id: "dm-bayside", label: "Duty Manager · Bayside Holiday Park", propertyId: "bayside" },
  { id: "gm-riverside", label: "General Manager · Riverside Apartments", propertyId: "riverside" },
];

export const PORTFOLIO_PROPERTIES: PortfolioProperty[] = [
  {
    id: "harbour", name: "Harbour Hotel", type: "City hotel", size: "220 rooms",
    localAuthority: "Recovery offers within the property's agreed limit; room moves inside the hotel.",
    cases: [
      { title: "Repeat guest — room not ready", ownerId: "dm-harbour", state: "Awaiting Duty Manager approval" },
      { title: "Lift fault, level 4", ownerId: "dm-harbour", state: "In action · maintenance assigned" },
    ],
  },
  {
    id: "coastal", name: "Coastal Resort", type: "Resort", size: "140 rooms",
    localAuthority: "Recovery offers and room changes inside the resort; partner bookings with General Manager approval.",
    cases: [
      { title: "Villa readiness delay", ownerId: "gm-coastal", state: "In action · housekeeping prioritised" },
    ],
  },
  {
    id: "bayside", name: "Bayside Holiday Park", type: "Holiday park", size: "85 cabins",
    localAuthority: "Cabin changes, weather plans and welfare responses, always by a named person on site.",
    cases: [
      { title: "Restricted case open", ownerId: "dm-bayside", state: "Handled on site · details restricted" },
      { title: "Storm plan for tonight's arrivals", ownerId: "dm-bayside", state: "Drafted · awaiting review" },
    ],
  },
  {
    id: "riverside", name: "Riverside Apartments", type: "Serviced apartments", size: "90 apartments",
    localAuthority: "Service recovery and access issues inside the building.",
    cases: [
      { title: "Late check-in access code", ownerId: "gm-riverside", state: "Closed · evidence recorded" },
    ],
  },
];

export const PORTFOLIO_EXCEPTIONS: PortfolioException[] = [
  {
    id: "pattern-room-readiness",
    kind: "pattern",
    title: "Room readiness is late at two properties this afternoon",
    propertyIds: ["harbour", "coastal"],
    rule: "The same moment breaches its target at two or more properties within four hours.",
    requiredApproverIds: ["regional-ops"],
    proposedResponse: "Run a portfolio housekeeping review before tomorrow's arrivals and share the findings with both properties.",
    staysLocal: "Each property keeps its own guest cases, offers and approvals. The portfolio does not contact guests.",
    evidenceRequired: ["Portfolio decision and reason", "Review findings per property", "Outcome measured at the next arrival peak"],
  },
  {
    id: "authority-cross-property-move",
    kind: "authority",
    title: "Move a booked guest from Harbour Hotel to Coastal Resort",
    propertyIds: ["harbour", "coastal"],
    rule: "Moving a guest between properties exceeds either property's own authority.",
    requiredApproverIds: ["regional-ops", "gm-coastal"],
    proposedResponse: "Offer the guest a room at Coastal Resort tonight, held until the guest accepts.",
    staysLocal: "Harbour Hotel's Duty Manager keeps the guest relationship and drafts the offer; Coastal Resort confirms the room.",
    evidenceRequired: ["Portfolio approval", "Receiving property's confirmation of the room", "Guest's acceptance before any change", "Outcome record at both properties"],
  },
  {
    id: "welfare-bayside",
    kind: "welfare",
    title: "Restricted welfare case at Bayside Holiday Park",
    propertyIds: ["bayside"],
    rule: "Welfare and safety cases are visible to the portfolio only as an open restricted case.",
    requiredApproverIds: [],
    proposedResponse: "None at portfolio level.",
    staysLocal: "The Duty Manager on site owns every decision. No personal details reach the portfolio view.",
    evidenceRequired: ["Recorded on site by the accountable person; the portfolio sees only that the case is open or closed"],
    localDeciderId: "dm-bayside",
  },
];

/** Raised by the Stage 3 peak-pressure scenario when break cover is one person short. */
export const CROSS_PROPERTY_COVER_EXCEPTION: PortfolioException = {
  id: "capacity-cross-property-cover",
  kind: "authority",
  title: "Lend one front-office team member from Coastal Resort to Harbour Hotel for the peak",
  propertyIds: ["harbour", "coastal"],
  rule: "Moving staff between properties exceeds either property's own authority.",
  requiredApproverIds: ["regional-ops", "gm-coastal"],
  proposedResponse: "Coastal Resort lends one trained front-office team member from 14:00 to 16:00 to close Harbour Hotel's break-cover gap.",
  staysLocal: "Harbour Hotel's Duty Manager keeps the intervention. Coastal Resort's General Manager decides whether it can spare someone. No individual is named in the portfolio view.",
  evidenceRequired: ["Portfolio approval", "Coastal Resort's confirmation that its own cover is safe", "Hours lent recorded at both properties"],
};

export const MIN_RETURN_REASON = 10;

export interface PortfolioDecisionEntry { actorId: string; action: "approved" | "returned"; reason?: string; at: string }

export interface ExceptionRecord {
  exceptionId: string;
  status: "awaiting" | "approved" | "returned";
  entries: PortfolioDecisionEntry[];
}

export const actorLabel = (id: string) => PORTFOLIO_ACTORS.find(actor => actor.id === id)?.label ?? id;

export function newExceptionRecord(exceptionId: string): ExceptionRecord {
  return { exceptionId, status: "awaiting", entries: [] };
}

/** Approvals still needed, in the order listed. */
export function pendingApprovers(exception: PortfolioException, record: ExceptionRecord): string[] {
  const approved = new Set(record.entries.filter(entry => entry.action === "approved").map(entry => entry.actorId));
  return exception.requiredApproverIds.filter(id => !approved.has(id));
}

/**
 * Record a decision. Throws, leaving the record unchanged, when the actor has no
 * authority, the exception is a welfare case, the decision is already final, or a
 * return has no meaningful reason.
 */
export function decideException(
  exception: PortfolioException,
  record: ExceptionRecord,
  actorId: string,
  action: "approve" | "return",
  reason = "",
  at = new Date().toISOString(),
): ExceptionRecord {
  if (exception.kind === "welfare") {
    throw new Error(`Welfare cases stay with ${actorLabel(exception.localDeciderId ?? "")}. The portfolio view cannot decide them.`);
  }
  if (record.status !== "awaiting") throw new Error("This exception has already been decided.");
  if (!exception.requiredApproverIds.includes(actorId)) {
    throw new Error(`${actorLabel(actorId)} has no authority here. Only ${exception.requiredApproverIds.map(actorLabel).join(" and ")} may decide this exception.`);
  }
  if (action === "return") {
    if (reason.trim().length < MIN_RETURN_REASON) throw new Error(`A return needs a reason of at least ${MIN_RETURN_REASON} characters.`);
    return { ...record, status: "returned", entries: [...record.entries, { actorId, action: "returned", reason: reason.trim(), at }] };
  }
  if (!pendingApprovers(exception, record).includes(actorId)) throw new Error(`${actorLabel(actorId)} has already approved.`);
  const entries = [...record.entries, { actorId, action: "approved" as const, at }];
  const next = { ...record, entries };
  return { ...next, status: pendingApprovers(exception, next).length === 0 ? "approved" : "awaiting" };
}
