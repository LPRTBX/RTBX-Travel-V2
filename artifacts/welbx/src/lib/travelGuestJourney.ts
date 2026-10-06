/** A worked service journey, not a claim about average hotel behaviour. */
export type InteractionBasis = "room-stay" | "room-night" | "guest-night";
export interface JourneyInteraction {
  id: string;
  label: string;
  stage: string;
  basis: InteractionBasis;
  frequency: number;
  purpose: string;
}
export const INTERACTION_BASIS_LABELS: Record<InteractionBasis, string> = {
  "room-stay": "Per room stay · shared",
  "room-night": "Per occupied room night · shared",
  "guest-night": "Per guest night · individual",
};
export const EXAMPLE_GUEST_JOURNEY: JourneyInteraction[] = [
  { id: "confirmation", label: "Booking / arrival confirmation", stage: "Before arrival", basis: "room-stay", frequency: 1, purpose: "Confirm the reservation and arrival arrangements." },
  { id: "preferences", label: "Pre-arrival preference exchange", stage: "Before arrival", basis: "room-stay", frequency: 1, purpose: "Agree one relevant room or service preference." },
  { id: "check-in", label: "Check-in and essential orientation", stage: "Arrival", basis: "room-stay", frequency: 1, purpose: "One complete exchange; identity, keys and directions are not separate interactions." },
  { id: "settling", label: "Settling-in request", stage: "Arrival", basis: "room-stay", frequency: 1, purpose: "For example, explain Wi-Fi or arrange an extra item; set to zero if unnecessary." },
  { id: "housekeeping", label: "Housekeeping service coordination", stage: "During stay", basis: "room-night", frequency: 1, purpose: "One shared exchange about timing or service. An unseen room clean is not a guest interaction." },
  { id: "breakfast", label: "Breakfast service exchange", stage: "During stay", basis: "room-night", frequency: 1, purpose: "One service episode per room party, not separate counts for greeting, ordering and payment." },
  { id: "dinner", label: "Evening meal service exchange", stage: "During stay", basis: "room-night", frequency: 1, purpose: "One shared meal episode; set to zero for off-property dining." },
  { id: "refreshment", label: "Individual refreshment exchange", stage: "During stay", basis: "guest-night", frequency: 1, purpose: "A separate coffee or refreshment visit. If guests order together, allocate it once to a shared row instead." },
  { id: "activity", label: "Individual activity / assistance exchange", stage: "During stay", basis: "guest-night", frequency: 1, purpose: "A separate gym, local activity or assistance enquiry; lower the rate if not used daily." },
  { id: "checkout", label: "Checkout / account confirmation", stage: "Departure", basis: "room-stay", frequency: 1, purpose: "One shared checkout exchange, including payment if part of the same episode." },
  { id: "feedback", label: "Post-stay feedback exchange", stage: "After departure", basis: "room-stay", frequency: 1, purpose: "One meaningful feedback exchange; an unopened survey is not an interaction." },
];
