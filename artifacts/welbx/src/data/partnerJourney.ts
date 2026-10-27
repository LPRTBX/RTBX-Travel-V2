/**
 * The guided Partner Room route and the operating loop it demonstrates.
 *
 * One ordered list drives the start page, the "Step N of 8" bar on each page and
 * the navigation tests, so the route cannot drift between them.
 */

export interface JourneyStep {
  id: string;
  title: string;
  /** Route path, optionally with a query or hash. */
  path: string;
  /** What the visitor does or sees on this step. */
  summary: string;
  /** Which parts of the operating loop this step shows. */
  shows: LoopStageId[];
  /** Orientation shown at the top of the page: what is on screen, what to do, and what it shows a hotel. */
  orientation: PageOrientation;
}

export interface PageOrientation {
  onScreen: string;
  doHere: string;
  forHotel: string;
}

export type LoopStageId = "signal" | "context" | "decision" | "action" | "evidence" | "learning" | "next-cycle";

export interface LoopStage {
  id: LoopStageId;
  label: string;
  /** What JALDO Travel does at this stage. */
  role: string;
  /** The same stage, followed through one scenario. */
  example: string;
  /** Who is accountable at this stage. */
  accountable: string;
  /** Where to see it working in the Partner Room. */
  see: { label: string; path: string };
}

export const OPERATING_LOOP: LoopStage[] = [
  {
    id: "signal",
    label: "Signal",
    role: "A change in the operation is captured from a connected or simulated source.",
    example: "The PMS shows a returning guest's room is still not ready shortly before they arrive.",
    accountable: "No one acts yet; the signal is validated first.",
    see: { label: "Architecture Lab", path: "/partner-room/architecture-lab" },
  },
  {
    id: "context",
    label: "Context",
    role: "The signal is checked against what is known about the guest, the stay and the property.",
    example: "Repeat guest, loyalty tier, housekeeping queue and arrival time are combined into one moment.",
    accountable: "Rules classify the moment; confidence and gaps are shown, not hidden.",
    see: { label: "Architecture Lab", path: "/partner-room/architecture-lab" },
  },
  {
    id: "decision",
    label: "Governed decision",
    role: "The configured rules decide who may act and whether a named approval is required.",
    example: "A recovery offer needs the Duty Manager's approval; the case waits at the approval gate until it is recorded.",
    accountable: "The configured approval role. Disagreement returns the case with a reason.",
    see: { label: "Build & Configure", path: "/partner-room/build-configure" },
  },
  {
    id: "action",
    label: "Action",
    role: "The accountable owner acts through the configured playbook; communications stay drafts until approved.",
    example: "Housekeeping is prioritised and a guest message is drafted for approval. Nothing is sent from this demonstration.",
    accountable: "The scenario's accountable owner; a missed deadline escalates and must be acknowledged.",
    see: { label: "Configured execution", path: "/partner-room/operations#runtime-execution" },
  },
  {
    id: "evidence",
    label: "Evidence",
    role: "The case cannot close until the evidence the configuration requires has been recorded.",
    example: "Room readiness confirmation, the approval and the guest outcome are recorded (synthetic) before closure.",
    accountable: "Each evidence item has a named owner; welfare cases cannot be closed by AI.",
    see: { label: "Generated evidence", path: "/partner-room/operations#generated-evidence" },
  },
  {
    id: "learning",
    label: "Reviewed learning",
    role: "Patterns across cases become proposals. A named reviewer approves or rejects each one.",
    example: "Late responses across many arrivals lead to a proposal to respond within 15 minutes instead of 30.",
    accountable: "The designated reviewer. Nothing changes until they approve it.",
    see: { label: "Simulation Lab", path: "/partner-room/operations?view=simulation" },
  },
  {
    id: "next-cycle",
    label: "Improved next cycle",
    role: "Only approved changes carry into the next operating cycle, and their effect is measured again.",
    example: "Cycle 2 runs with the approved response time; unmeasured results stay pending rather than counted.",
    accountable: "Accountable managers compare cycles before anything becomes standard practice.",
    see: { label: "Operating Evolution", path: "/partner-room/operating-evolution" },
  },
];

export const GUIDED_ROUTE: JourneyStep[] = [
  {
    id: "architecture",
    title: "Architecture",
    path: "/partner-room/architecture-lab",
    summary: "Follow one signal through every layer, from capture to reviewed learning.",
    shows: ["signal", "context", "decision", "action", "evidence", "learning"],
    orientation: {
      onScreen: "One synthetic hotel moment traced through five phases and eleven inspectable layers.",
      doHere: "Use the orange next-step button to advance the trace. Open any layer to inspect it.",
      forHotel: "How a late room becomes an owned, approved response with evidence, not a note in one system.",
    },
  },
  {
    id: "build-configure",
    title: "Build & Configure",
    path: "/partner-room/build-configure",
    summary: "Set the property, roles, approvals and the evidence each scenario needs, then activate it.",
    shows: ["decision", "evidence"],
    orientation: {
      onScreen: "A nine-stage setup of a synthetic deployment: property, systems, roles, approvals, scenarios and evidence.",
      doHere: "Work through the stages in order, then activate the deployment in Review & Activate.",
      forHotel: "Your own rules decide who may act, who must approve and what evidence closes a case.",
    },
  },
  {
    id: "configured-execution",
    title: "Configured execution and evidence",
    path: "/partner-room/operations#configured-operation",
    summary: "Run your configured scenarios and see the synthetic evidence they generate.",
    shows: ["decision", "action", "evidence"],
    orientation: {
      onScreen: "Runs of the scenarios you activated, using your roles, approvals and evidence rules. Part 2 holds fixed examples.",
      doHere: "Start a scenario, record the approval, dispatch the work and capture the evidence needed to close it.",
      forHotel: "Approval, dispatch, acknowledgement and closure stay separate, so nothing is marked done without proof.",
    },
  },
  {
    id: "simulation-lab",
    title: "Simulation Lab",
    path: "/partner-room/operations?view=simulation",
    summary: "Run 100 synthetic signals through the same engine and review the learning it proposes.",
    shows: ["evidence", "learning"],
    orientation: {
      onScreen: "A synthetic 100-room hotel sending a stream of signals through the same rules engine.",
      doHere: "Start the simulation, change the conditions and review the patterns it proposes.",
      forHotel: "How volume and pressure show up as patterns a manager reviews before anything changes.",
    },
  },
  {
    id: "operating-evolution",
    title: "Operating Evolution",
    path: "/partner-room/operating-evolution",
    summary: "Compare operating cycles after reviewed changes, with the conditions each cycle ran under.",
    shows: ["learning", "next-cycle"],
    orientation: {
      onScreen: "Operating cycles compared after a reviewed change, with the conditions each cycle ran under.",
      doHere: "Review the proposed change as the Duty Manager, then compare the next cycle.",
      forHotel: "Learning changes practice only after a named person approves it, and its effect is measured again.",
    },
  },
  {
    id: "value-calculator",
    title: "Value Calculator",
    path: "/partner-room/proof-calculator",
    summary: "Model volumes, attribution and value ranges with your own assumptions.",
    shows: ["next-cycle"],
    orientation: {
      onScreen: "A monthly value model built from your property's own assumptions.",
      doHere: "Enter the essential property figures and your currency. Adjust advanced assumptions only if you need to.",
      forHotel: "A hypothetical range to test in a pilot, after attribution and overlap. Not measured savings.",
    },
  },
  {
    id: "stage-3",
    title: "Stage 3",
    path: "/partner-room/product-proof/stage-3-operating-layer",
    summary: "See the planned connected operating layer, simulated end to end.",
    shows: ["signal", "action", "evidence"],
    orientation: {
      onScreen: "The planned connected operating layer, simulated for peak pressure and a portfolio disruption.",
      doHere: "Choose a story and step through it. Note what stays open at each step.",
      forHotel: "How coordination could extend across teams and properties. Planned and simulated, not live.",
    },
  },
  {
    id: "pilot",
    title: "Pilot",
    path: "/partner-room/pilot-model",
    summary: "What a named pilot would measure, who is accountable and what it needs from the partner.",
    shows: ["evidence", "next-cycle"],
    orientation: {
      onScreen: "What a named pilot would measure, who is accountable and what it needs from the property.",
      doHere: "Review the scope and the readiness checklist, then discuss a named pilot.",
      forHotel: "The steps to test these claims on your own property, with your own people and data.",
    },
  },
];

/** Orientation for the Partner Room start page, which introduces the route rather than being a step on it. */
export const PARTNER_ROOM_HOME_ORIENTATION: PageOrientation = {
  onScreen: "The Partner Room start page: what JALDO Travel is, and the eight-step guided route.",
  doHere: "Start the guided route, or open any section from the menu.",
  forHotel: "Where to see one hotel moment become an accountable, evidenced response.",
};

/** What each menu section offers a hotel, for pages outside the guided route. */
export const SECTION_PURPOSE: Record<string, string> = {
  "Start": "Context for evaluating JALDO Travel for your hotel.",
  "Platform": "How JALDO Travel works alongside your existing hotel systems, people and rules.",
  "Configure and Execute": "How your rules turn a hotel moment into an owned, approved and evidenced response.",
  "Proof": "Synthetic proof of how responses, evidence and learning could work in a hotel.",
  "Pilot and Partnership": "What it would take to test this on your own property.",
  "Reference material": "Supporting material for evaluating JALDO Travel. Synthetic and illustrative.",
};

const pathOnly = (path: string) => path.split(/[?#]/)[0];
const queryOf = (path: string) => (path.split("#")[0].split("?")[1] ?? "");

/**
 * The guided step for a route. The Operations Centre hosts two steps:
 * `?view=simulation` is the Simulation Lab; anything else is configured execution.
 */
export function findJourneyStep(pathname: string, search: string): { step: JourneyStep; index: number } | null {
  const query = new URLSearchParams(search.replace(/^\?/, ""));
  const index = GUIDED_ROUTE.findIndex(step => {
    if (pathOnly(step.path) !== pathname) return false;
    const wanted = new URLSearchParams(queryOf(step.path));
    const wantsView = wanted.get("view");
    return wantsView ? query.get("view") === wantsView : !query.get("view");
  });
  return index === -1 ? null : { step: GUIDED_ROUTE[index], index };
}

export const LOOP_STAGE_LABELS: Record<LoopStageId, string> =
  Object.fromEntries(OPERATING_LOOP.map(stage => [stage.id, stage.label])) as Record<LoopStageId, string>;
