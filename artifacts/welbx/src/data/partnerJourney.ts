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
  },
  {
    id: "build-configure",
    title: "Build & Configure",
    path: "/partner-room/build-configure",
    summary: "Set the property, roles, approvals and the evidence each scenario needs, then activate it.",
    shows: ["decision", "evidence"],
  },
  {
    id: "configured-execution",
    title: "Configured execution and evidence",
    path: "/partner-room/operations#configured-operation",
    summary: "Run your configured scenarios and see the synthetic evidence they generate.",
    shows: ["decision", "action", "evidence"],
  },
  {
    id: "simulation-lab",
    title: "Simulation Lab",
    path: "/partner-room/operations?view=simulation",
    summary: "Run 100 synthetic signals through the same engine and review the learning it proposes.",
    shows: ["evidence", "learning"],
  },
  {
    id: "operating-evolution",
    title: "Operating Evolution",
    path: "/partner-room/operating-evolution",
    summary: "Compare operating cycles after reviewed changes, with the conditions each cycle ran under.",
    shows: ["learning", "next-cycle"],
  },
  {
    id: "value-calculator",
    title: "Value Calculator",
    path: "/partner-room/proof-calculator",
    summary: "Model volumes, attribution and value ranges with your own assumptions.",
    shows: ["next-cycle"],
  },
  {
    id: "stage-3",
    title: "Stage 3",
    path: "/partner-room/product-proof/stage-3-operating-layer",
    summary: "See the planned connected operating layer, simulated end to end.",
    shows: ["signal", "action", "evidence"],
  },
  {
    id: "pilot",
    title: "Pilot",
    path: "/partner-room/pilot-model",
    summary: "What a named pilot would measure, who is accountable and what it needs from the partner.",
    shows: ["evidence", "next-cycle"],
  },
];

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
