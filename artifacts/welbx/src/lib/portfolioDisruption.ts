/**
 * Fictional guest-disruption demonstration, independent of the peak-pressure
 * staffing case. Confirmation records are demo assertions, not sign-in or dispatch.
 */
export type PortfolioChoice = "network" | "local";
export interface Confirmation { id: string; owner: string; label: string }
export interface PortfolioState {
  step: number;
  choice: PortfolioChoice | null;
  revisedChoice: PortfolioChoice | null;
  revision: number;
  confirmations: string[];
  initialAuthorisation: string[];
  receiptReview: boolean;
  followupAccepted: boolean;
  trialApprovals: string[];
}
export const PORTFOLIO_STEPS = ["Recognise", "Choose", "Authorise", "Adapt", "Verify", "Learn"];
export const initialPortfolio = (): PortfolioState => ({
  step: 0, choice: null, revisedChoice: null, revision: 0, confirmations: [],
  initialAuthorisation: [], receiptReview: false, followupAccepted: false, trialApprovals: [],
});
export function portfolioPlan(choice: PortfolioChoice, revised = false) {
  const city = choice === "network" ? (revised ? 4 : 8) : 0;
  const park = choice === "network" ? 6 : 0;
  const relocated = city + park;
  const local = 24 - relocated;
  return {
    city, park, relocated, local, seats: relocated * 2,
    transport: relocated ? 240 : 0, relocationCost: relocated * 40, localCost: local * 15,
    cost: (relocated ? 240 : 0) + relocated * 40 + local * 15,
    relocationMinutes: relocated ? 45 : null, localMinutes: 90,
  };
}
export function portfolioConfirmations(choice: PortfolioChoice | null, revised: boolean): Confirmation[] {
  if (!choice) return [];
  const plan = portfolioPlan(choice, revised);
  return [
    { id: "harbour", owner: "Harbour Duty Manager", label: `Plan and modelled A$${plan.cost} budget approval` },
    ...(choice === "network" ? [
      { id: "city", owner: "City receiving manager", label: `${plan.city} inspected receiving rooms confirmed` },
      { id: "park", owner: "Park receiving manager", label: "6 receiving rooms confirmed" },
      { id: "transport", owner: "Transport coordinator", label: `${plan.seats} guest seats confirmed` },
    ] : [{ id: "housekeeping", owner: "Harbour Housekeeping Lead", label: "24-booking local readiness plan confirmed" }]),
    { id: "guests", owner: "Reception / guests", label: "Guest agreement to this plan confirmed" },
  ];
}
const complete = (state: PortfolioState, revised: boolean) => {
  const choice = revised ? state.revisedChoice : state.choice;
  return !!choice && portfolioConfirmations(choice, revised).every(c => state.confirmations.includes(c.id));
};
export function portfolioReady(state: PortfolioState): boolean {
  switch (state.step) {
    case 0: return true;
    case 1: return !!state.choice;
    case 2: return complete(state, false);
    case 3: return complete(state, true);
    case 4: return state.receiptReview && state.followupAccepted;
    default: return false;
  }
}
export type PortfolioEvent =
  | { type: "reset" | "next" | "reviewReceipts" | "acceptFollowup" }
  | { type: "choose" | "replan"; choice: PortfolioChoice }
  | { type: "confirm" | "trial"; id: string };
const toggle = (ids: string[], id: string) => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id];
export function portfolioReducer(state: PortfolioState, event: PortfolioEvent): PortfolioState {
  switch (event.type) {
    case "reset": return initialPortfolio();
    case "next":
      if (!portfolioReady(state)) return state;
      if (state.step === 2) return {
        ...state, step: 3, revision: 1, initialAuthorisation: [...state.confirmations],
        confirmations: [], revisedChoice: null,
      };
      return { ...state, step: state.step + 1 };
    case "choose":
      return state.step === 1 ? { ...state, choice: event.choice, confirmations: [] } : state;
    case "replan":
      return state.step === 3 ? {
        ...state, revisedChoice: event.choice, confirmations: [], receiptReview: false, followupAccepted: false,
      } : state;
    case "confirm": {
      if (state.step !== 2 && state.step !== 3) return state;
      const required = portfolioConfirmations(state.step === 3 ? state.revisedChoice : state.choice, state.step === 3);
      return required.some(c => c.id === event.id) ? { ...state, confirmations: toggle(state.confirmations, event.id) } : state;
    }
    case "reviewReceipts": return state.step === 4 ? { ...state, receiptReview: !state.receiptReview } : state;
    case "acceptFollowup": return state.step === 4 ? { ...state, followupAccepted: !state.followupAccepted } : state;
    case "trial": return state.step === 5 && event.id === "group" ? { ...state, trialApprovals: toggle(state.trialApprovals, event.id) } : state;
  }
}
export function portfolioOutcomes(choice: PortfolioChoice) {
  return {
    confirmedBookings: 23, totalBookings: 24, confirmedGuests: 46,
    guestMinutes: choice === "network" ? 3240 : 4140,
    referenceGuestMinutes: 4140, fewerMinutes: choice === "network" ? 900 : 0,
    modelledCost: choice === "network" ? 850 : 360,
    relocatedBookings: choice === "network" ? 10 : 0,
    transportedGuests: choice === "network" ? 20 : 0,
    localConfirmedBookings: choice === "network" ? 13 : 23,
  };
}
