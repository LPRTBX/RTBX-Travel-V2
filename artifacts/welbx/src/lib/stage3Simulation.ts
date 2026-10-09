/** Fictional preview state only. Never calls the operational runtime or an API. */
export type PortfolioChoice = "network" | "local";
export type SupportChoice = "onsite" | "transfer";
export type GuestResponse = "accept" | "decline";
export type Confirmation = { id: string; owner: string; label: string };
type BaseState = {
  step: number;
  confirmations: string[];
  receiptReview: boolean;
  followupAccepted: boolean;
  trialApprovals: string[];
};
export type PortfolioState = BaseState & {
  choice: PortfolioChoice | null;
  revisedChoice: PortfolioChoice | null;
  revision: number;
  initialAuthorisation: string[];
};
export type WellbeingState = BaseState & {
  revealed: number;
  humanReview: string[];
  choice: SupportChoice | null;
  revisedChoice: SupportChoice | null;
  revision: number;
  initialAuthorisation: string[];
  guestResponse: GuestResponse | null;
  helpRouteAgreed: boolean;
  followupLead: string;
};
export const PORTFOLIO_STEPS = ["Recognise", "Choose", "Authorise", "Adapt", "Verify", "Learn"];
export const WELLBEING_STEPS = ["Read signals", "Human review", "Intervene", "Adapt", "Verify", "Learn"];
const base = (): BaseState => ({
  step: 0, confirmations: [], receiptReview: false, followupAccepted: false, trialApprovals: [],
});
export const initialPortfolio = (): PortfolioState => ({
  ...base(), choice: null, revisedChoice: null, revision: 0, initialAuthorisation: [],
});
export const initialWellbeing = (): WellbeingState => ({
  ...base(), revealed: 1, humanReview: [], choice: null, revisedChoice: null, revision: 0,
  initialAuthorisation: [], guestResponse: null, helpRouteAgreed: false, followupLead: "",
});
function toggle(items: string[], id: string) {
  return items.includes(id) ? items.filter(item => item !== id) : [...items, id];
}
function complete(items: string[], required: string[]) {
  return required.every(id => items.includes(id));
}
export function portfolioPlan(choice: PortfolioChoice, revised = false) {
  const city = choice === "network" ? (revised ? 4 : 8) : 0;
  const park = choice === "network" ? 6 : 0;
  const relocated = city + park;
  const local = 24 - relocated;
  return {
    city, park, local, relocated, seats: relocated * 2,
    transport: relocated > 0 ? 240 : 0,
    relocationCost: relocated * 40, localCost: local * 15,
    cost: (relocated > 0 ? 240 : 0) + relocated * 40 + local * 15,
    relocationMinutes: relocated > 0 ? 45 : null, localMinutes: 90,
  };
}
export function portfolioConfirmations(choice: PortfolioChoice | null, revised: boolean): Confirmation[] {
  if (!choice) return [];
  const plan = portfolioPlan(choice, revised);
  const required: Confirmation[] = [
    { id: "harbour", owner: "Harbour Duty Manager", label: `Plan and modelled A$${plan.cost} budget approval` },
  ];
  if (choice === "network") required.push(
    { id: "city", owner: "City receiving manager", label: `${plan.city} inspected rooms confirmed` },
    { id: "park", owner: "Park receiving manager", label: "6 receiving rooms confirmed" },
    { id: "transport", owner: "Transport coordinator", label: `${plan.seats} guest seats confirmed` },
  );
  else required.push({ id: "housekeeping", owner: "Harbour Housekeeping Lead", label: "24-booking local readiness plan confirmed" });
  required.push({ id: "guests", owner: "Reception / guests", label: "Guest agreement to this plan confirmed" });
  return required;
}
export const HUMAN_REVIEW: Confirmation[] = [
  { id: "ownership", owner: "Alex · fictional Duty Manager", label: "Acknowledge ownership of the unmet assistance request" },
  { id: "conditions", owner: "Duty Manager / Facilities", label: "Verify lift and accessible-route conditions; do not infer a diagnosis" },
  { id: "preference", owner: "Duty Manager · private check", label: "Privately check preference: guest requests quieter waiting and supported access" },
];
export function supportConfirmations(choice: SupportChoice | null, revised: boolean): Confirmation[] {
  if (!choice) return [];
  const property = revised ? "Park" : "City";
  const required: Confirmation[] = [
    { id: "consent", owner: "Guest / Duty Manager · private", label: "Guest agreement and minimum-necessary handoff confirmed for this plan" },
    { id: "route", owner: "Facilities Lead", label: "Facilities acknowledgement and verified clear accessible route" },
    { id: "coverage", owner: "Shift Lead", label: "Staff coverage and relief confirmed" },
    { id: "contact", owner: revised ? "Alex · manager / Jordan · replacement contact" : "Taylor · fictional support contact", label: choice === "onsite" ? (revised ? "Manager-covered quiet accessible space and replacement contact confirmed" : "Quiet accessible space and named contact confirmed") : "Named support contact and pickup handoff confirmed" },
  ];
  if (choice === "transfer") required.push(
    { id: "receiving", owner: `${property} receiving manager`, label: `${property} accessible room and receiving staff confirmed` },
    { id: "vehicle", owner: "Transport coordinator", label: revised ? "Replacement suitable vehicle reverified" : "Suitable vehicle confirmed" },
  );
  return required;
}
export function portfolioReady(state: PortfolioState) {
  switch (state.step) {
    case 0: return true;
    case 1: return state.choice !== null;
    case 2: return !!state.choice && complete(state.confirmations, portfolioConfirmations(state.choice, false).map(c => c.id));
    case 3: return !!state.revisedChoice && complete(state.confirmations, portfolioConfirmations(state.revisedChoice, true).map(c => c.id));
    case 4: return state.receiptReview && state.followupAccepted;
    default: return false;
  }
}
export function wellbeingReady(state: WellbeingState) {
  switch (state.step) {
    case 0: return state.revealed === 4;
    case 1: return complete(state.humanReview, HUMAN_REVIEW.map(c => c.id));
    case 2: return !!state.choice && complete(state.confirmations, supportConfirmations(state.choice, false).map(c => c.id));
    case 3: return !!state.revisedChoice && complete(state.confirmations, supportConfirmations(state.revisedChoice, true).map(c => c.id));
    case 4: return state.receiptReview && !!state.guestResponse && (state.guestResponse !== "decline" || state.helpRouteAgreed) && !!state.followupLead && state.followupAccepted;
    default: return false;
  }
}
export type PortfolioEvent =
  | { type: "next" } | { type: "reset" }
  | { type: "choose"; choice: PortfolioChoice }
  | { type: "replan"; choice: PortfolioChoice }
  | { type: "confirm"; id: string }
  | { type: "reviewReceipts" } | { type: "acceptFollowup" }
  | { type: "trial"; id: string };
export function portfolioReducer(state: PortfolioState, event: PortfolioEvent): PortfolioState {
  switch (event.type) {
    case "reset": return initialPortfolio();
    case "choose": return state.step === 1 ? { ...state, choice: event.choice, confirmations: [] } : state;
    case "replan": return state.step === 3 ? { ...state, revisedChoice: event.choice, confirmations: [], receiptReview: false, followupAccepted: false } : state;
    case "confirm": {
      if (![2, 3].includes(state.step)) return state;
      const required = portfolioConfirmations(state.step === 3 ? state.revisedChoice : state.choice, state.step === 3);
      return required.some(c => c.id === event.id) ? { ...state, confirmations: toggle(state.confirmations, event.id) } : state;
    }
    case "reviewReceipts": return state.step === 4 ? { ...state, receiptReview: !state.receiptReview } : state;
    case "acceptFollowup": return state.step === 4 ? { ...state, followupAccepted: !state.followupAccepted } : state;
    case "trial": return state.step === 5 && event.id === "group" ? { ...state, trialApprovals: toggle(state.trialApprovals, event.id) } : state;
    case "next":
      if (!portfolioReady(state)) return state;
      if (state.step === 2) return { ...state, step: 3, revision: 1, initialAuthorisation: [...state.confirmations], confirmations: [], revisedChoice: null };
      return { ...state, step: state.step + 1 };
  }
}
export type WellbeingEvent =
  | { type: "next" } | { type: "reset" } | { type: "reveal" }
  | { type: "review"; id: string }
  | { type: "choose"; choice: SupportChoice }
  | { type: "replan"; choice: SupportChoice }
  | { type: "confirm"; id: string }
  | { type: "reviewReceipts" }
  | { type: "response"; response: GuestResponse }
  | { type: "helpRoute" }
  | { type: "lead"; lead: string }
  | { type: "acceptFollowup" }
  | { type: "trial"; id: string };
export const FOLLOWUP_LEADS = ["Alex · Duty Manager", "Jordan · Support Shift Lead"];
export function wellbeingReducer(state: WellbeingState, event: WellbeingEvent): WellbeingState {
  switch (event.type) {
    case "reset": return initialWellbeing();
    case "reveal": return state.step === 0 ? { ...state, revealed: Math.min(4, state.revealed + 1) } : state;
    case "review": return state.step === 1 && HUMAN_REVIEW.some(c => c.id === event.id) ? { ...state, humanReview: toggle(state.humanReview, event.id) } : state;
    case "choose": return state.step === 2 ? { ...state, choice: event.choice, confirmations: [] } : state;
    case "replan": return state.step === 3 ? { ...state, revisedChoice: event.choice, confirmations: [], receiptReview: false, guestResponse: null, helpRouteAgreed: false, followupLead: "", followupAccepted: false } : state;
    case "confirm": {
      if (![2, 3].includes(state.step)) return state;
      const required = supportConfirmations(state.step === 3 ? state.revisedChoice : state.choice, state.step === 3);
      return required.some(c => c.id === event.id) ? { ...state, confirmations: toggle(state.confirmations, event.id) } : state;
    }
    case "reviewReceipts": return state.step === 4 ? { ...state, receiptReview: !state.receiptReview } : state;
    case "response": return state.step === 4 && ["accept", "decline"].includes(event.response) ? { ...state, guestResponse: event.response, helpRouteAgreed: false, followupAccepted: false } : state;
    case "helpRoute": return state.step === 4 && state.guestResponse === "decline" ? { ...state, helpRouteAgreed: !state.helpRouteAgreed, followupAccepted: false } : state;
    case "lead": return state.step === 4 && (event.lead === "" || FOLLOWUP_LEADS.includes(event.lead)) ? { ...state, followupLead: event.lead, followupAccepted: false } : state;
    case "acceptFollowup": return state.step === 4 && !!state.guestResponse && (state.guestResponse !== "decline" || state.helpRouteAgreed) && !!state.followupLead ? { ...state, followupAccepted: !state.followupAccepted } : state;
    case "trial": return state.step === 5 && ["group", "safety"].includes(event.id) ? { ...state, trialApprovals: toggle(state.trialApprovals, event.id) } : state;
    case "next":
      if (!wellbeingReady(state)) return state;
      if (state.step === 2) return { ...state, step: 3, revision: 1, initialAuthorisation: [...state.confirmations], confirmations: [], revisedChoice: null };
      return { ...state, step: state.step + 1 };
  }
}
export function portfolioOutcomes(choice: PortfolioChoice) {
  const network = choice === "network";
  return {
    confirmedBookings: 23, totalBookings: 24, confirmedGuests: 46,
    guestMinutes: network ? 3240 : 4140, referenceGuestMinutes: 4140,
    fewerMinutes: network ? 900 : 0, modelledCost: network ? 850 : 360,
    relocatedBookings: network ? 10 : 0, transportedGuests: network ? 20 : 0,
    localConfirmedBookings: network ? 13 : 23,
  };
}
