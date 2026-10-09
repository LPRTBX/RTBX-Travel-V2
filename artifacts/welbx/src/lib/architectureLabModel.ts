import { TRAVEL_SCENARIOS } from "@/data/travelScenarios";
import { TRAVEL_PLAYBOOKS } from "@/data/travelPlaybooks";
import { createHotelSignals, HOTEL_ROUTES, PATH_LABELS, type HotelSignal } from "@/simulation/mockHotel";
import { approveHotelDecision, dispatchHotelAction, mockHotelFollowUp, verifyHotelOutcome, proposeHotelLearning, type Fault, type HotelCase } from "@/simulation/hotelLearning";

import { transitionExecution } from "./runtimeEngine";
import { OUTCOME_LABELS, describeFollowUpReasons, roleLabel, stateLabel } from "./plainLanguage";

export const ARCHITECTURE_SCENARIOS = [
  ["repeat-guest-room-not-ready", "Room delay"],
  ["service-backlog", "Service backlog"],
  ["maintenance-defect", "Maintenance"],
  ["distressed-guest", "Guest welfare"],
  ["transport-disruption", "Transport disruption"],
] as const;
export type ArchitectureScenarioId = typeof ARCHITECTURE_SCENARIOS[number][0];

export const ARCHITECTURE_SOURCES = [
  "PMS / reservations", "Guest interface", "Staff operations", "Room / building sensors",
  "Housekeeping", "CRM / loyalty", "Task management", "Messaging channels",
];

export function scenarioIdForSignal(signal: HotelSignal) {
  return (HOTEL_ROUTES[signal.path] as Record<string, string>)[signal.kind];
}

export function architectureSignalFor(id: ArchitectureScenarioId) {
  const signal = createHotelSignals(1).find(s => scenarioIdForSignal(s) === id);
  if (!signal) throw new Error(`Missing synthetic signal for ${id}`);
  return signal;
}

export function architectureContext(id: ArchitectureScenarioId) {
  const scenario = TRAVEL_SCENARIOS.find(s => s.id === id);
  if (!scenario) throw new Error(`Missing scenario ${id}`);
  const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === scenario.playbookId);
  if (!playbook) throw new Error(`Missing playbook ${scenario.playbookId}`);
  return { scenario, playbook };
}

/** Shared driver for the visible step-through trace; uses canonical approval roles. */
export function advanceArchitectureTrace(c: HotelCase, fault: Fault = "none") {
  const { scenario } = architectureContext(c.execution.scenarioId as ArchitectureScenarioId);
  const move = (to: "understanding" | "decision-required" | "approval-required", note: string) => {
    const execution = transitionExecution(c.execution, to, scenario, note);
    if (!execution) throw new Error(`Architecture trace blocked transition to ${to}`);
    return { ...c, execution, audit: [...c.audit, { step: to, detail: note }] };
  };
  const state = c.execution.state;
  if (state === "signal-received") return { hotelCase: move("understanding", "Synthetic signal validated"), node: "signal", stage: "Connect" };
  if (state === "understanding") return { hotelCase: move("decision-required", "Moment classified"), node: "moment", stage: "Understand" };
  if (state === "decision-required" && !c.approved) {
    return c.execution.approvalRequired
      ? { hotelCase: move("approval-required", "Governance and authority applied"), node: "governance", stage: "Decide" }
      : { hotelCase: approveHotelDecision(c, c.execution.accountableRoleId), node: "authority", stage: "Decide" };
  }
  if (state === "approval-required" && !c.approved) return { hotelCase: approveHotelDecision(c, c.execution.approvalRoleId), node: "authority", stage: "Act" };
  if ((state === "approval-required" || state === "decision-required") && c.approved) return { hotelCase: dispatchHotelAction(c), node: "comms", stage: "Act" };
  if (state === "in-action" && !c.observation) return { hotelCase: verifyHotelOutcome(c, mockHotelFollowUp(c, fault)), node: "outcome", stage: "Learn" };
  return null;
}

export function architectureNextLabel(c: HotelCase) {
  const state = c.execution.state;
  return state === "signal-received" ? "Validate signal"
    : state === "understanding" ? "Classify moment"
    : state === "decision-required" && !c.approved ? (c.execution.approvalRequired ? "Apply governance" : "Apply delegated authority")
    : state === "approval-required" && !c.approved ? `Simulate approval as ${roleLabel(c.execution.approvalRoleId)}`
    : (state === "approval-required" || state === "decision-required") && c.approved ? "Dispatch synthetic action"
    : state === "in-action" && !c.observation ? "Verify synthetic outcome" : null;
}

export interface ArchitectureNode {
  id: string;
  stage: "Connect" | "Understand" | "Decide" | "Act" | "Learn";
  label: string;
  text: string;
  details: string[];
}

export function buildArchitectureNodes(id: ArchitectureScenarioId, hotelCase: HotelCase): ArchitectureNode[] {
  const { scenario, playbook } = architectureContext(id);
  const execution = hotelCase.execution;
  const proposal = hotelCase.observation ? proposeHotelLearning(hotelCase) : null;
  return [
    {
      id: "connections", stage: "Connect", label: "Hotel systems",
      text: "Configured source pathways into JALDO Travel.",
      details: ARCHITECTURE_SOURCES.map(x => `${x} · deployment target; synthetic adapter in this Lab`),
    },
    {
      id: "signal", stage: "Connect", label: "Signal registry",
      text: `${PATH_LABELS[hotelCase.signal.path]} · ${hotelCase.signal.kind.replaceAll("-", " ")}`,
      details: [`Event ID · ${hotelCase.signal.eventId}`, `Room · ${hotelCase.signal.room}`, `Condition · ${hotelCase.signal.condition}`, `Payload · ${JSON.stringify(hotelCase.signal.payload)}`],
    },
    {
      id: "moment", stage: "Understand", label: "Moment classification",
      text: scenario.momentClassification,
      details: [scenario.trigger.description, scenario.trigger.threshold || "", scenario.context.riskOrOpportunity, scenario.context.confidence || ""].filter(Boolean),
    },
    {
      id: "governance", stage: "Decide", label: "Governance mapper",
      text: "Policy → rule → permission → authority.",
      details: [
        ...scenario.governanceConfig.sources.map(x => `Source · ${x}`),
        ...scenario.governanceConfig.rules.map(x => `Rule · ${x}`),
        ...scenario.governanceConfig.permissions.map(x => `Permission · ${x}`),
      ],
    },
    {
      id: "decision", stage: "Decide", label: "Decision spine",
      text: scenario.decision.recommendedDecision,
      details: [`Decision · ${scenario.decision.decisionRequired}`, `Owner · ${roleLabel(scenario.decision.accountableRoleId)}`, `Case status · ${stateLabel(execution.state)}`],
    },
    {
      id: "playbook", stage: "Act", label: "Playbook library", text: playbook.name,
      details: playbook.steps.map(s => `${s.step}. ${s.title} · ${roleLabel(s.ownerRoleId)} · ${s.timing}${s.approvalRequired ? " · approval required" : ""}`),
    },
    {
      id: "authority", stage: "Act", label: "Human authority",
      text: `${roleLabel(execution.accountableRoleId)} remains accountable.`,
      details: [`Accountable · ${roleLabel(execution.accountableRoleId)}`, `Supporting · ${scenario.rolesConfig.supportingRoleIds.map(roleLabel).join(", ")}`, `Authority · ${execution.approvalRequired ? `${roleLabel(execution.approvalRoleId)} approval ${hotelCase.approved ? "given (scripted test actor)" : "pending"}` : `${roleLabel(execution.accountableRoleId)} decides within delegated authority`}`, "AI / rules may propose; they do not authorise a real response."],
    },
    {
      id: "comms", stage: "Act", label: "Central comms",
      text: "Draft routing under human control.",
      details: playbook.communicationTemplates.map(c => `${c.audience} · ${c.channel} · ${c.purpose}${c.approvalRequired ? " · approval required" : ""}`),
    },
    {
      id: "evidence", stage: "Learn", label: "Evidence ledger",
      text: "Mandatory evidence gates closure.",
      details: execution.evidence.map(e => `${e.required ? "Required" : "Supporting"} · ${e.evidenceType} · ${roleLabel(e.ownerRoleId)} · ${e.captured ? "recorded" : "not yet recorded"}`),
    },
    {
      id: "outcome", stage: "Learn", label: "Outcome / value",
      text: hotelCase.observation ? `Simulated follow-up · ${OUTCOME_LABELS[hotelCase.outcome].toLowerCase()}` : "Waiting for the simulated follow-up.",
      details: execution.outcomes.map(o => `${o.metric} · ${o.status.replaceAll("-", " ")}`),
    },
    {
      id: "learning", stage: "Learn", label: "Learning loop",
      text: proposal ? "Candidate change generated for human review." : "Outcomes can create governed improvement candidates.",
      details: proposal
        ? [`Raised because of · ${describeFollowUpReasons(proposal.reasons)}`, "Proposed change to the response settings, shown in the review panel below", "A named reviewer must approve it before it is tested"]
        : [scenario.learningConfig.reviewTrigger, scenario.learningConfig.patternToDetect, scenario.learningConfig.improvementAction],
    },
  ];
}
