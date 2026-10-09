import { useId, useState, type Dispatch, type SetStateAction } from "react";
import {
  ACTORS, CHALLENGES, DEPENDENCY_LABELS, KIND_LABELS, LEARNING_ROLE, MIN_REASON, MONITOR_INTERVALS, REVIEW_ROLE,
  actionState, approveDraft, assessPattern, buildSignals, capacity, completeAction, decideLearning, decideReview,
  followThrough, outcome, planFor, receiveInformation, recordMeasures, recordMissingEvidence, reviewAgain,
  type ActorId, type ChallengeId, type PeakState, type ReviewDecision,
} from "@/lib/peakPressure";
import { usePartnerRoomNavigate } from "@/components/PartnerRoomLayout";
import "./peak-pressure.css";

type Message = { tone: "refused" | "done"; text: string } | null;

const RELIABILITY_LABELS = { high: "High", medium: "Medium", low: "Low" } as const;
const STATUS_LABELS = { present: "Present", missing: "Missing", conflicting: "In conflict" } as const;
const REVIEW_LABELS = {
  "awaiting-review": "Awaiting the Duty Manager's decision",
  "awaiting-information": "More information requested",
  monitoring: "Monitoring, with a set review time",
  declined: "Declined with a reason",
  approved: "Intervention approved",
} as const;

const GUEST_DRAFT = "Welcome to Harbour Hotel. Arrivals are busy this afternoon, so check-in may take a little longer than usual. You are welcome to leave your bags with us and enjoy the lounge; we will let you know as soon as your room is ready.";

/**
 * Stage 3 · peak-period team pressure. Several operational signals are combined into a
 * pattern for a manager to review; the manager decides, the plan is executed by named
 * owners, and the outcome is verified separately. Synthetic data; nothing is sent.
 */
export function PeakPressureScenario({ state, setState, onRestart }: {
  state: PeakState;
  setState: Dispatch<SetStateAction<PeakState>>;
  onRestart: (challenge: ChallengeId) => void;
}) {
  const navigateTo = usePartnerRoomNavigate();
  const ids = { actor: useId(), reason: useId(), interval: useId(), learningActor: useId(), learningReason: useId() };
  const defaultActor: ActorId = state.challenge === "role" ? "fo-supervisor" : REVIEW_ROLE;
  const [actor, setActor] = useState<ActorId>(defaultActor);
  const [reason, setReason] = useState("");
  const [monitorMinutes, setMonitorMinutes] = useState<number>(30);
  const [learningActor, setLearningActor] = useState<ActorId>(LEARNING_ROLE);
  const [learningReason, setLearningReason] = useState("");
  const [message, setMessage] = useState<Message>(null);
  const [learningMessage, setLearningMessage] = useState<Message>(null);

  const signals = buildSignals(state.challenge, state.informationReceived);
  const assessment = assessPattern(signals);
  const plan = planFor(state);
  const cover = capacity(state);
  const progress = followThrough(state);
  const result = outcome(state);
  const status = state.review.status;
  const challenge = CHALLENGES.find(c => c.id === state.challenge)!;

  const restart = (id: ChallengeId) => {
    onRestart(id);
    setActor(id === "role" ? "fo-supervisor" : REVIEW_ROLE);
    setReason(""); setMonitorMinutes(30); setLearningActor(LEARNING_ROLE); setLearningReason("");
    setMessage(null); setLearningMessage(null);
  };

  const attempt = (change: (s: PeakState) => PeakState, done: string, set: (m: Message) => void = setMessage) => {
    try {
      const next = change(state);
      setState(next);
      set({ tone: "done", text: done });
      return true;
    } catch (error) {
      set({ tone: "refused", text: error instanceof Error ? error.message : String(error) });
      return false;
    }
  };

  const decide = (decision: ReviewDecision, done: string) => {
    if (attempt(s => decideReview(s, actor, decision), done)) setReason("");
  };

  const reviewOpen = status === "awaiting-review" || status === "monitoring";
  const approvalStage = status === "approved" ? `Approved by ${ACTORS[state.review.by!]}` : REVIEW_LABELS[status];
  const executionStage = status !== "approved" ? (status === "declined" ? "Nothing executed" : "Not started: needs approval")
    : `${progress.done} of ${progress.total} actions recorded`;

  return (
    <section id="peak-pressure" className="pk" aria-labelledby="peak-pressure-title">
      <p className="pk-eyebrow">Stage 3 · Harbour Hotel · planned simulation</p>
      <h2 id="peak-pressure-title">Peak-period team pressure: a wellbeing and safety intervention, decided by a person.</h2>
      <p className="pk-lead">
        A busy arrival period meets a short-staffed shift. No single reading proves anything, but when several independent signals point the same way, JALDO asks the accountable manager to review the pattern. The manager decides; named owners act; results are measured afterwards. Approval, execution and verified outcome are recorded separately.
      </p>
      <p className="pk-synthetic" data-testid="peak-synthetic">
        <strong>Synthetic data.</strong> Every property, role, count and time below is fictional. No system is connected, no person is identified and nothing is sent.
      </p>

      <div className="pk-challenges" role="group" aria-label="Choose a path through the scenario">
        {CHALLENGES.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={item.id === state.challenge} onClick={() => restart(item.id)} className="pk-challenge">
            <span>{index === 0 ? "Standard" : `Challenge ${index}`}</span>
            {item.label}
          </button>
        ))}
      </div>
      <p className="pk-guide" data-testid="peak-guide"><strong>{challenge.label}.</strong> {challenge.guide}</p>

      <ol className="pk-stages" aria-label="Approval, execution and verified outcome" data-testid="peak-stages">
        <li data-stage="approval"><span>Approval</span><strong>{approvalStage}</strong></li>
        <li data-stage="execution"><span>Execution</span><strong>{executionStage}</strong></li>
        <li data-stage="outcome"><span>Verified outcome</span><strong>{result.label}</strong></li>
      </ol>

      {/* 1. Signals */}
      <div className="pk-block">
        <h3><span className="pk-step">1</span>Signals, 12:40–13:40</h3>
        <div className="pk-table-wrap">
          <table className="pk-signals" data-testid="peak-signals">
            <caption className="pk-sr">Operational signals with source, time, reliability and status</caption>
            <thead><tr><th scope="col">Signal</th><th scope="col">Reading</th><th scope="col">Source</th><th scope="col">Time</th><th scope="col">Reliability</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {signals.map(signal => (
                <tr key={signal.id} data-signal={signal.id} data-status={signal.status}>
                  <th scope="row"><span className="pk-kind">{KIND_LABELS[signal.kind]}</span>{signal.label}</th>
                  <td data-label="Reading">{signal.value}{signal.note && <span className="pk-note">{signal.note}</span>}</td>
                  <td data-label="Source">{signal.source}</td>
                  <td data-label="Time">{signal.observedAt}</td>
                  <td data-label="Reliability"><span className={`pk-rel pk-rel-${signal.reliability}`}>{RELIABILITY_LABELS[signal.reliability]}</span></td>
                  <td data-label="Status"><span className={`pk-status pk-status-${signal.status}`}>{STATUS_LABELS[signal.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {assessment.gaps.length > 0 && (
          <p className="pk-gaps" data-testid="peak-gaps">
            <strong>Missing or in conflict:</strong> {assessment.gaps.map(g => `${g.label} (${STATUS_LABELS[g.status].toLowerCase()})`).join("; ")}. Missing readings are never counted as evidence either way.
          </p>
        )}
      </div>

      {/* 2. Why review */}
      <div className="pk-block" data-testid="peak-why">
        <h3><span className="pk-step">2</span>Why the combined pattern needs a person to review it</h3>
        <p className="pk-explain">{assessment.explanation}</p>
        <p className="pk-meta-line">
          <span>Kinds of signal elevated: {assessment.elevatedKinds.map(k => KIND_LABELS[k]).join(", ")}</span>
          <span>Confidence: <strong data-testid="peak-confidence">{assessment.confidence === "normal" ? "Normal" : "Reduced"}</strong></span>
        </p>
        <p className="pk-boundary-note">
          This is not a diagnosis and it is not about any individual. It describes workload, staffing and recovery time for the shift as a whole. Nobody is named, scored or assessed, and the decision stays with the Duty Manager.
        </p>
      </div>

      {/* 3. Approval */}
      <div className="pk-block pk-approval" role="region" aria-label="Approval" data-testid="peak-approval">
        <h3><span className="pk-step">3</span>Approval · {REVIEW_LABELS[status]}</h3>
        <p className="pk-who">Accountable decision-maker: <strong>{ACTORS[REVIEW_ROLE]}</strong>. Roles are simulated by choosing them; a pilot needs named sign-in.</p>

        {state.review.history.length > 0 && (
          <ol className="pk-log" aria-label="Decision record (synthetic)">
            {state.review.history.map((entry, i) => <li key={i}>{entry}</li>)}
          </ol>
        )}

        {status === "awaiting-information" && (
          <div className="pk-wait">
            <p>Waiting for: “{state.review.requested}”. Nothing proceeds until it arrives.</p>
            <button type="button" onClick={() => attempt(receiveInformation, "The requested confirmation arrived (simulated). The signals are updated; the Duty Manager decides again.")}>
              Receive the requested confirmation (simulated)
            </button>
          </div>
        )}
        {status === "monitoring" && (
          <div className="pk-wait">
            <p>Monitoring continues. The Duty Manager reviews again in {state.review.reviewInMinutes} minutes. Nothing is executed meanwhile.</p>
            <button type="button" onClick={() => attempt(reviewAgain, "Review time reached (simulated). The pattern is still present; the Duty Manager decides again.")}>
              Review time reached (simulated)
            </button>
          </div>
        )}
        {status === "declined" && (
          <p className="pk-wait">The intervention was declined with a reason. No action is executed and nothing is measured. The pattern stays visible to the portfolio as declined.</p>
        )}

        {reviewOpen && (
          <div className="pk-controls">
            <label htmlFor={ids.actor}>Act as</label>
            <select id={ids.actor} value={actor} onChange={event => { setActor(event.target.value as ActorId); setMessage(null); }}>
              {(Object.keys(ACTORS) as ActorId[]).map(id => <option key={id} value={id}>{ACTORS[id]}</option>)}
            </select>
            <label htmlFor={ids.reason}>Reason, or the information you need</label>
            <textarea id={ids.reason} rows={2} value={reason} onChange={event => setReason(event.target.value)}
              placeholder={`At least ${MIN_REASON} characters. Required to request information, monitor, decline, or approve while confidence is reduced.`} />
            <label htmlFor={ids.interval}>Review again in (if monitoring)</label>
            <select id={ids.interval} value={monitorMinutes} onChange={event => setMonitorMinutes(Number(event.target.value))}>
              {MONITOR_INTERVALS.map(minutes => <option key={minutes} value={minutes}>{minutes} minutes</option>)}
            </select>
            <div className="pk-buttons">
              <button type="button" onClick={() => decide({ kind: "approve", reason: reason.trim() || undefined }, "Intervention approved (simulated). The plan below can now be executed by its owners.")}>Approve the intervention</button>
              <button type="button" onClick={() => decide({ kind: "request-information", request: reason }, "Information requested (simulated). Nothing proceeds until it arrives.")}>Request more information</button>
              <button type="button" onClick={() => decide({ kind: "monitor", reason, reviewInMinutes: monitorMinutes }, `Monitoring continues with a review in ${monitorMinutes} minutes. Nothing is executed.`)}>Continue monitoring</button>
              <button type="button" onClick={() => decide({ kind: "decline", reason }, "Intervention declined with a reason. Nothing is executed.")}>Decline</button>
            </div>
          </div>
        )}
        {message && <p className={`pk-message pk-${message.tone}`} role={message.tone === "refused" ? "alert" : "status"} data-testid="peak-message">{message.text}</p>}
      </div>

      {/* 4. Execution */}
      <div className="pk-block" role="region" aria-label="Execution" data-testid="peak-execution">
        <h3><span className="pk-step">4</span>Execution · {executionStage}</h3>
        <p className="pk-who">Approval allows these actions; it does not complete them. Each owner records their own action against its deadline, dependencies and evidence.</p>

        {state.challenge === "capacity" && (
          <div className={`pk-capacity${cover.gap ? "" : " pk-capacity-closed"}`} data-testid="peak-capacity">
            <p><strong>Preparation capacity:</strong> break cover needs {cover.needed} people; {cover.available} can be released at Harbour Hotel. {cover.gap
              ? `Gap: ${cover.gap} person. Only a portfolio decision can close it: the Regional Operations Manager and Coastal Resort's General Manager must both approve.`
              : "Gap closed by the approved portfolio support (simulated)."}</p>
            {cover.gap > 0 && status === "approved" && !("escalate" in state.done) && (
              <p>Record the escalation below to raise the portfolio decision.</p>
            )}
            {cover.gap > 0 && "escalate" in state.done && (
              <a href="#portfolio-coordination" className="pk-link" onClick={event => { event.preventDefault(); navigateTo("/partner-room/product-proof/stage-3-operating-layer#portfolio-coordination"); }}>
                Go to the portfolio decision on cross-property cover ↓
              </a>
            )}
          </div>
        )}

        <ul className="pk-actions" aria-label="Intervention plan">
          {plan.map(action => {
            const current = actionState(state, action);
            const waitingFor = action.dependsOn.filter(d => d === "approval" ? status !== "approved" : d === "draft" ? !state.draftApproved : d === "capacity" ? cover.gap > 0 : !(d in state.done));
            return (
              <li key={action.id} className={`pk-action pk-action-${current}`} data-action={action.id} data-state={current}>
                <div className="pk-action-head">
                  <strong>{action.title}</strong>
                  <span className={`pk-pill pk-pill-${current}`}>{current === "done" ? `Recorded ${state.done[action.id]} (simulated)` : current === "ready" ? "Ready" : "Waiting"}</span>
                </div>
                {action.conditional && <p className="pk-conditional">{action.conditional}</p>}
                <dl>
                  <div><dt>Owner</dt><dd>{ACTORS[action.owner]}</dd></div>
                  <div><dt>Deadline</dt><dd>{action.deadline}</dd></div>
                  <div><dt>Depends on</dt><dd>{action.dependsOn.map(d => DEPENDENCY_LABELS[d] ?? d).join("; ")}</dd></div>
                  <div><dt>Evidence required</dt><dd>{action.evidence}</dd></div>
                </dl>
                {action.id === "expectations" && (
                  <div className="pk-draft">
                    <p className="pk-draft-label">Draft guest message · held, not sent</p>
                    <blockquote>{GUEST_DRAFT}</blockquote>
                    {status === "approved" && !state.draftApproved && (
                      <button type="button" onClick={() => attempt(s => approveDraft(s, REVIEW_ROLE), "Draft approved by the Duty Manager (simulated). It is held; the demonstration never sends it.")}>
                        Approve draft as Duty Manager
                      </button>
                    )}
                    {state.draftApproved && <p className="pk-draft-ok">Approved by the Duty Manager · held, not sent</p>}
                  </div>
                )}
                {action.id === "support" && (
                  <p className="pk-restricted" data-testid="peak-restricted">Restricted: support details stay with the People &amp; Culture Lead. This view records only that the offer was shared with the whole team, never who uses it.</p>
                )}
                {current === "waiting" && waitingFor.length > 0 && <p className="pk-waiting">Waiting for: {waitingFor.map(d => DEPENDENCY_LABELS[d] ?? d).join(", ")}</p>}
                {current === "ready" && (
                  <button type="button" className="pk-record" onClick={() => attempt(s => completeAction(s, action.id, action.owner, action.deadline), `Recorded by ${ACTORS[action.owner]} (simulated): ${action.evidence.toLowerCase()}.`)}>
                    Record as {ACTORS[action.owner].split(" · ")[0]}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 5. Verified outcome */}
      <div className="pk-block" role="region" aria-label="Verified outcome" data-testid="peak-outcome">
        <h3><span className="pk-step">5</span>Verified outcome · {result.label}</h3>
        <p className="pk-who">Follow-through: <strong data-testid="peak-follow-through">{progress.done} of {progress.total} actions recorded</strong>. Results are measured at 15:00, after the peak, and only once every action is recorded. A result that was not measured stays unconfirmed.</p>
        {!state.measures && (
          <button type="button" className="pk-primary" disabled={status !== "approved" || progress.done < progress.total} onClick={() => attempt(recordMeasures, "Follow-up measurements recorded (synthetic).")}>
            Record follow-up measurements (synthetic)
          </button>
        )}
        {state.measures && (
          <>
            <div className="pk-table-wrap">
              <table className="pk-measures" data-testid="peak-measures">
                <caption className="pk-sr">Follow-up measurements</caption>
                <thead><tr><th scope="col">Measure</th><th scope="col">Target</th><th scope="col">Result</th><th scope="col">Status</th></tr></thead>
                <tbody>
                  {state.measures.map(m => (
                    <tr key={m.id} data-measure={m.id}>
                      <th scope="row">{m.label}</th>
                      <td data-label="Target">{m.target}</td>
                      <td data-label="Result">{m.value ?? "Not recorded"}</td>
                      <td data-label="Status"><span className={`pk-status ${m.met === null ? "pk-status-missing" : m.met ? "pk-status-present" : "pk-status-conflicting"}`}>{m.met === null ? "Unconfirmed" : m.met ? "Met" : "Not met"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`pk-closure${result.canClose ? " pk-closure-ok" : ""}`} data-testid="peak-closure">
              {result.canClose
                ? "Every measure is confirmed. The case can close."
                : `The case cannot close. Unconfirmed: ${result.unconfirmed.join("; ")}. A missing result is not treated as a success.`}
            </p>
            {!result.canClose && (
              <button type="button" onClick={() => attempt(recordMissingEvidence, "The missing break count was recorded late (simulated) and is labelled as late.")}>
                Record the missing evidence late (simulated)
              </button>
            )}
          </>
        )}
      </div>

      {/* 6. Learning */}
      <div className="pk-block" role="region" aria-label="Learning for the next peak" data-testid="peak-learning">
        <h3><span className="pk-step">6</span>Learning for the next peak period</h3>
        {!state.learning
          ? <p className="pk-who">A proposal is generated once the follow-up has been measured.</p>
          : (
            <>
              <blockquote className="pk-proposal">{state.learning.text}</blockquote>
              <p className="pk-who">
                Basis: <strong>{state.learning.basis === "complete" ? "every result confirmed" : "incomplete: some results are unconfirmed"}</strong>.
                Status: <strong data-testid="peak-learning-status">{state.learning.status === "proposed" ? "Proposed · not applied" : state.learning.status === "approved" ? `Approved by ${ACTORS[state.learning.decidedBy!]} for the next peak (simulated) · no roster or system was changed` : `Rejected by ${ACTORS[state.learning.decidedBy!]}`}</strong>
                {state.learning.reason ? ` · “${state.learning.reason}”` : ""}
              </p>
              {state.learning.status === "proposed" && (
                <div className="pk-controls">
                  <label htmlFor={ids.learningActor}>Act as</label>
                  <select id={ids.learningActor} value={learningActor} onChange={event => { setLearningActor(event.target.value as ActorId); setLearningMessage(null); }}>
                    {(Object.keys(ACTORS) as ActorId[]).map(id => <option key={id} value={id}>{ACTORS[id]}</option>)}
                  </select>
                  <label htmlFor={ids.learningReason}>Reason (needed to reject, or to approve on an incomplete basis)</label>
                  <textarea id={ids.learningReason} rows={2} value={learningReason} onChange={event => setLearningReason(event.target.value)} placeholder={`At least ${MIN_REASON} characters`} />
                  <div className="pk-buttons">
                    <button type="button" onClick={() => attempt(s => decideLearning(s, learningActor, true, learningReason), "Proposal approved for the next peak (simulated). Nothing was changed in any system.", setLearningMessage)}>Approve the proposal</button>
                    <button type="button" onClick={() => attempt(s => decideLearning(s, learningActor, false, learningReason), "Proposal rejected with a reason. Nothing is applied.", setLearningMessage)}>Reject with reason</button>
                  </div>
                </div>
              )}
              {learningMessage && <p className={`pk-message pk-${learningMessage.tone}`} role={learningMessage.tone === "refused" ? "alert" : "status"} data-testid="peak-learning-message">{learningMessage.text}</p>}
            </>
          )}
      </div>

      <div className="pk-footer">
        <button type="button" onClick={() => restart(state.challenge)}>Run this path again</button>
        <a href="/partner-room/pilot-model#pilot-scope" className="pk-next" onClick={event => { event.preventDefault(); navigateTo("/partner-room/pilot-model#pilot-scope"); }}>
          Take this to a pilot scope: what the pilot would prove →
        </a>
      </div>
      <p className="pk-boundary">No roster, task, guest message, support referral or system is changed. Times are simulated; communications are drafts that are never sent.</p>
    </section>
  );
}
