import { EXAMPLE_GUEST_JOURNEY, type JourneyInteraction } from "./travelGuestJourney";
/** Illustrative operating model. Defaults are editable examples, not benchmarks or live evidence. */
export type MomentKind = "coordination" | "opportunity" | "prevention" | "recovery" | "welfare";
export type ValueTier = "low" | "base" | "high";
export interface MomentAssumption {
  kind: MomentKind;
  label: string;
  example: string;
  momentsPer100Stays: number;
  actionRate: number;
  minutesSaved: number;
  value?: Record<ValueTier, number>;
}
export interface TravelValueAssumptions {
  sites: number;
  roomsPerSite: number;
  days: number;
  occupancy: number;
  lengthOfStay: number;
  guestsPerRoom: number;
  journey: JourneyInteraction[];
  incrementalShare: number;
  overlapAllowance: number;
  monthlyCost: number;
  hoursPerFteMonth: number;
  hourlyStaffCost: number;
  cashRealisationRate: number;
  moments: MomentAssumption[];
}
export const DEFAULT_VALUE_ASSUMPTIONS: TravelValueAssumptions = {
  sites: 1, roomsPerSite: 120, days: 30, occupancy: 0.75, lengthOfStay: 3, guestsPerRoom: 1.5,
  journey: EXAMPLE_GUEST_JOURNEY, incrementalShare: 0.5, overlapAllowance: 0.2, monthlyCost: 0, hoursPerFteMonth: 160, hourlyStaffCost: 45, cashRealisationRate: 0,
  moments: [
    { kind: "coordination", label: "Routine coordination", example: "Arrival, room readiness and shift handover", momentsPer100Stays: 300, actionRate: 0.85, minutesSaved: 4 },
    { kind: "opportunity", label: "Service opportunities", example: "Relevant upgrade, transport or experience offer", momentsPer100Stays: 35, actionRate: 0.25, minutesSaved: 3, value: { low: 20, base: 40, high: 80 } },
    { kind: "prevention", label: "Prevention", example: "A maintenance signal before a room becomes unavailable", momentsPer100Stays: 15, actionRate: 0.6, minutesSaved: 10, value: { low: 15, base: 40, high: 90 } },
    { kind: "recovery", label: "Issue and recovery", example: "Room delay, missed transfer or service failure", momentsPer100Stays: 8, actionRate: 0.8, minutesSaved: 15, value: { low: 30, base: 80, high: 160 } },
    { kind: "welfare", label: "Welfare and safety", example: "A guest needs assistance and an accountable human response", momentsPer100Stays: 2, actionRate: 0.9, minutesSaved: 0 },
  ],
};

export function calculateTravelValue(a: TravelValueAssumptions) {
  const finite = (n: number, min = 0, max = Infinity) => {
    if (!Number.isFinite(n) || n < min || n > max) throw new Error("Invalid operating assumption");
  };
  finite(a.sites, 1); finite(a.roomsPerSite, 1); finite(a.days, 28, 31); finite(a.occupancy, 0, 1);
  finite(a.lengthOfStay, 0.1); finite(a.guestsPerRoom, 1);
  finite(a.incrementalShare, 0, 1); finite(a.overlapAllowance, 0, 1); finite(a.monthlyCost); finite(a.hoursPerFteMonth, 1); finite(a.hourlyStaffCost); finite(a.cashRealisationRate, 0, 1);
  if (a.moments.length !== 5 || new Set(a.moments.map(m => m.kind)).size !== 5 ||
      a.moments.some(m => !DEFAULT_VALUE_ASSUMPTIONS.moments.some(d => d.kind === m.kind))) throw new Error("Use each primary moment category once");
  const rooms = a.sites * a.roomsPerSite;
  const occupiedRoomNights = rooms * a.days * a.occupancy;
  // Steady-state estimate: a guest staying several nights is counted once per stay.
  const stays = occupiedRoomNights / a.lengthOfStay;
  const guests = stays * a.guestsPerRoom;
  const guestNights = occupiedRoomNights * a.guestsPerRoom;
  if (new Set(a.journey.map(j => j.id)).size !== a.journey.length) throw new Error("Journey exchanges must have unique IDs");
  const journeyRows = a.journey.map(j => {
    finite(j.frequency);
    if (!["room-stay", "room-night", "guest-night"].includes(j.basis)) throw new Error("Invalid interaction counting basis");
    const volume = j.basis === "room-stay" ? stays : j.basis === "room-night" ? occupiedRoomNights : guestNights;
    const perStay = j.frequency * (j.basis === "room-stay" ? 1 : j.basis === "room-night" ? a.lengthOfStay : a.lengthOfStay * a.guestsPerRoom);
    return { ...j, perStay, monthly: volume * j.frequency };
  });
  const interactionsPerRoomStay = journeyRows.reduce((sum, j) => sum + j.perStay, 0);
  const interactions = journeyRows.reduce((sum, j) => sum + j.monthly, 0);
  const sharedInteractions = journeyRows.filter(j => j.basis !== "guest-night").reduce((sum, j) => sum + j.monthly, 0);
  const individualInteractions = interactions - sharedInteractions;
  const rows = a.moments.map(m => {
    finite(m.momentsPer100Stays); finite(m.actionRate, 0, 1); finite(m.minutesSaved);
    if (m.value) {
      for (const tier of ["low", "base", "high"] as const) finite(m.value[tier]);
      if (m.value.low > m.value.base || m.value.base > m.value.high) throw new Error("Value tiers must be ordered low ≤ base ≤ high");
    }
    const moments = stays * m.momentsPer100Stays / 100;
    const actions = moments * m.actionRate;
    const financial = ["opportunity", "prevention", "recovery"].includes(m.kind);
    const gross = Object.fromEntries((["low", "base", "high"] as const).map(t => [t, financial ? actions * (m.value?.[t] ?? 0) : 0])) as Record<ValueTier, number>;
    return { ...m, moments, actions, staffHours: m.kind === "welfare" ? 0 : actions * m.minutesSaved / 60, gross };
  });
  const gross = Object.fromEntries((["low", "base", "high"] as const).map(t => [t, rows.reduce((sum, r) => sum + r.gross[t], 0)])) as Record<ValueTier, number>;
  const attributionFactor = a.incrementalShare * (1 - a.overlapAllowance);
  const adjusted = Object.fromEntries((["low", "base", "high"] as const).map(t => [t, gross[t] * attributionFactor])) as Record<ValueTier, number>;
  const net = Object.fromEntries((["low", "base", "high"] as const).map(t => [t, adjusted[t] - a.monthlyCost])) as Record<ValueTier, number>;
  const staffHours = rows.reduce((sum, r) => sum + r.staffHours, 0);
  const adjustedStaffHours = staffHours * attributionFactor;
  const fteEquivalent = adjustedStaffHours / a.hoursPerFteMonth;
  const staffCapacityValue = adjustedStaffHours * a.hourlyStaffCost;
  const cashStaffSavings = staffCapacityValue * a.cashRealisationRate;
  const bottomLine = Object.fromEntries((["low", "base", "high"] as const).map(t => [t, net[t] + cashStaffSavings])) as Record<ValueTier, number>;
  return { rooms, occupiedRoomNights, stays, guests, guestNights, journeyRows, sharedInteractions, individualInteractions, interactionsPerRoomStay, interactions, rows, gross, adjusted, net, staffHours, adjustedStaffHours, fteEquivalent, staffCapacityValue, cashStaffSavings, bottomLine,
    moments: rows.reduce((sum, r) => sum + r.moments, 0),
    actions: rows.reduce((sum, r) => sum + r.actions, 0),
  };
}
