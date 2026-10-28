import "./travel-impact.css";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { STATE_TO_STEP, TRACE_STEPS } from "@/lib/runtimeEngine";
import { MOCK_HOTEL } from "@/simulation/mockHotel";
import { createHotelCase, type Fault, proposeHotelLearning, reviewHotelLearning, replayHotelLearning, reconcileHotelFollowUp, type Proposal, type HotelCase } from "@/simulation/hotelLearning";
import { OUTCOME_LABELS, describeAuditEntry, describeFollowUpReasons, formatRecordedTime, roleLabel, stateLabel } from "@/lib/plainLanguage";
import { ProposalChanges } from "@/components/simulation/ProposalChanges";
import { advanceArchitectureTrace, architectureNextLabel, ARCHITECTURE_SCENARIOS, architectureContext, architectureSignalFor, buildArchitectureNodes, type ArchitectureScenarioId } from "@/lib/architectureLabModel";

const box = { background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)" };
const muted = { color: "rgba(255,255,255,.5)" };
const makeCase = (id: ArchitectureScenarioId) => createHotelCase(architectureSignalFor(id));

const STAGE_NODE_MAP: Record<string, string> = {
  Connect: "connections",
  Understand: "moment",
  Decide: "governance",
  Act: "playbook",
  Learn: "evidence",
};

const PHASE_GUIDES: Record<string, string> = {
  Connect: "Receive the signal",
  Understand: "Recognise the moment",
  Decide: "Check rules and authority",
  Act: "Coordinate the response",
  Learn: "Check evidence and improve",
};

/** True below 900px, where the Inspector opens inline under the chosen layer instead of beside the map. */
function useCompactLayout() {
  const query = "(max-width: 900px)";
  const [compact, setCompact] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setCompact(list.matches);
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, []);
  return compact;
}

export default function PartnerArchitectureLab() {
  const [selected, setSelected] = useState<ArchitectureScenarioId>("repeat-guest-room-not-ready");
  const [hotelCase, setHotelCase] = useState<HotelCase>(() => makeCase("repeat-guest-room-not-ready"));
  const [inspect, setInspect] = useState("signal");
  const [focusStage, setFocusStage] = useState("Connect");
  const [fault, setFault] = useState<Fault>("none");
  const [reviewed, setReviewed] = useState<Proposal | null>(null);
  const [replay, setReplay] = useState<HotelCase | null>(null);
  const [constrained, setConstrained] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const proposal = hotelCase.observation ? proposeHotelLearning(hotelCase) : null;
  const resetLearning = () => { setReviewed(null); setReplay(null); setConstrained(false); setReviewError(""); };
  const reviewChange = (decision: "approved" | "rejected") => {
    if (!proposal || reviewed) return;
    setReviewed(reviewHotelLearning(proposal, decision, "synthetic-duty-manager"));
  };
  const replayChange = () => {
    if (!reviewed || reviewed.decision !== "approved") return;
    try {
      const conditions = !constrained ? undefined : fault === "late-response" ? { minimumResponseMinutes: 35 }
        : fault === "ineffective-action" ? { requiredInterventionAttempts: 3 } : { requiredReceiptAttempts: 3 };
      setReplay(replayHotelLearning(hotelCase, reviewed, fault, conditions));
      setReviewError("");
    } catch (error) { setReviewError(error instanceof Error ? error.message : String(error)); }
  };
  const { scenario } = useMemo(() => architectureContext(selected), [selected]);
  const nodes = useMemo(() => buildArchitectureNodes(selected, hotelCase), [selected, hotelCase]);
  const execution = hotelCase.execution;
  const activeStep = STATE_TO_STEP[execution.state];
  const selectedNode = nodes.find(n => n.id === inspect) || nodes[1];

  const compact = useCompactLayout();
  const inspectorRef = useRef<HTMLElement | null>(null);
  const [scrollRequest, setScrollRequest] = useState(0);
  // A newly selected layer opens at the top of the Inspector, not at the previous layer's scroll position.
  useEffect(() => {
    if (inspectorRef.current) inspectorRef.current.scrollTop = 0;
  }, [inspect]);
  // Bring a layer chosen from the phases or "Inspect this layer" into view. Advancing the trace does not scroll,
  // so the next-step button stays where the visitor pressed it.
  useEffect(() => {
    if (!scrollRequest) return;
    document.getElementById(`architecture-node-${inspect}`)?.scrollIntoView({ behavior: compact ? "auto" : "smooth", block: compact ? "start" : "nearest" });
  }, [scrollRequest]);
  const focusArchitecture = (nodeId: string, stage?: string, scroll = true) => {
    setInspect(nodeId);
    if (stage) setFocusStage(stage);
    if (scroll) setScrollRequest(request => request + 1);
  };
  const focusArchitectureStage = (stage: string) => {
    const nodeId = STAGE_NODE_MAP[stage];
    if (nodeId) focusArchitecture(nodeId, stage);
  };
  const choose = (id: ArchitectureScenarioId) => {
    resetLearning(); setSelected(id); setHotelCase(makeCase(id)); setFault("none"); setInspect("signal"); setFocusStage("Connect");
  };
  const advance = () => {
    const next = advanceArchitectureTrace(hotelCase, fault);
    if (!next) return;
    setHotelCase(next.hotelCase);
    focusArchitecture(next.node, next.stage, false);
  };
  const nextLabel = architectureNextLabel(hotelCase);
  // One Inspector: beside the map on wide screens, inline under the chosen layer below 900px, so it never covers controls.
  const inspector = <aside ref={inspectorRef} id="architecture-inspector" className="travel-architecture-inspector" role="region" aria-label={`Layer inspector: ${selectedNode.label}`} tabIndex={compact ? undefined : 0} style={{ ...box, borderTop: "2px solid #a8dedb", padding: 22, ...(compact ? {} : { position: "sticky", top: 100 }) }}>
    <span role="status" className="sr-only">{`Showing ${selectedNode.label} in the inspector`}</span>
    <div style={{ fontSize: 12.5, color: "#f59e0b", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{selectedNode.stage} · Inspector</div>
    <h3 style={{ margin: "7px 0 8px", fontSize: 20 }}>{selectedNode.label}</h3>
    <p style={{ color: "rgba(255,255,255,.78)", fontSize: 15, lineHeight: 1.6 }}>{selectedNode.text}</p>
    <div style={{ height: 1, background: "rgba(255,255,255,.08)", margin: "18px 0" }} />
    <div style={{ display: "grid", gap: 9 }}>{selectedNode.details.map((d,i) => <div key={i} style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,.78)", paddingLeft: 12, borderLeft: "2px solid rgba(168,222,219,.28)" }}>{d}</div>)}</div>
  </aside>;
  // The engine records approval and moves the case on at dispatch; say so rather than show a stale gate.
  const statusText = hotelCase.approved && ["approval-required", "decision-required"].includes(execution.state)
    ? execution.approvalRequired
      ? `Approved by ${roleLabel(execution.approvalRoleId)} · ready to dispatch`
      : `Delegated decision by ${roleLabel(execution.accountableRoleId)} · ready to dispatch`
    : stateLabel(execution.state);
  const followUpLocked = execution.state !== "in-action" || !!hotelCase.observation;
  const followUpHint = hotelCase.observation
    ? "Follow-up recorded. Reset to try another condition."
    : followUpLocked
      ? "Choose a follow-up condition once the action is dispatched."
      : "Choose how the follow-up turns out, then verify.";
  const lateEvidence = hotelCase.audit.some(entry => entry.step === "prior-observation-retained");

  return <PartnerRoomLayout>
    <div className="travel-architecture" style={{ minHeight: "100vh", background: "#071315", color: "#fff" }}>
      <section style={{ padding: "56px clamp(20px,5vw,72px) 42px", background: "linear-gradient(135deg,#081719,#10282b)", borderBottom: "1px solid rgba(168,222,219,.14)" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "#f59e0b", marginBottom: 12 }}>Partner Room · Working Proof · Architecture Lab</div>
          <h1 style={{ fontSize: "clamp(34px,5vw,60px)", lineHeight: 1.03, letterSpacing: "-.045em", margin: "0 0 16px", maxWidth: 980 }}>One hotel moment. An accountable response. A reviewed next cycle.</h1>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", color: "rgba(255,255,255,.86)", lineHeight: 1.55, maxWidth: 960, margin: "0 0 10px" }}>A guest arrives before their room is ready. Follow the signal, the human decision and the evidence. If the response misses its target, review a change and test the same signal again.</p>
          <p style={{ ...muted, maxWidth: 960, lineHeight: 1.65, fontSize: 15 }}>The eight-step journey above visits the wider Partner Room. Inside this Lab, five architecture phases contain eleven inspectable layers. These are different views—not eight steps inside the Lab.</p>
          <details style={{ ...muted, lineHeight: 1.65, fontSize: 14 }}><summary>How the operating layer fits together</summary><p>JALDO coordinates existing hotel systems, people, rules and communications around a moment. Select a layer below to inspect its role. The same scenario and evidence engine powers the Working Proof.</p></details>
          <div style={{ marginTop: 18, fontSize: 13, color: "#a8dedb" }}>Fictional Working Proof · rules-based classification · illustrative confidence, not live AI inference · simulated human authority · no real messages or hotel-system writes</div>
          <details style={{ ...muted, marginTop: 16, lineHeight: 1.65, fontSize: 14 }}>
            <summary>AI interpretation is not the decision engine</summary>
            <p>The <a href="/#ai-in-the-work" style={{ color: "#a8dedb", textDecoration: "underline" }}>public hotel story</a> shows a scripted example of how AI could summarise room readiness, guest needs and staffing pressure, with sources and uncertainty, and prepare options. No AI model runs here. This Lab classifies signals using configured rules; the accountable role retains authority, required approval precedes dispatch, and receipts and measurements determine what can be confirmed. Reviewed changes are tested separately, not automatically deployed.</p>
          </details>
        </div>
      </section>

      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "32px clamp(20px,5vw,72px) 80px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", ...muted, marginBottom: 10 }}>Choose trace</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
          {ARCHITECTURE_SCENARIOS.map(([id,label]) => <button key={id} onClick={() => choose(id)} aria-pressed={selected === id} style={{ padding: "10px 14px", cursor: "pointer", color: selected === id ? "#071315" : "#fff", background: selected === id ? "#a8dedb" : "rgba(255,255,255,.035)", border: selected === id ? "1px solid #a8dedb" : "1px solid rgba(255,255,255,.1)", fontWeight: 800 }}>{label}</button>)}
        </div>

        <section className="travel-architecture-guide" aria-labelledby="architecture-scenario-title" data-testid="architecture-next-action">
          <div className="travel-architecture-guide-head">
            <div style={{ fontSize: 13, color: "#a8dedb", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{MOCK_HOTEL.name}</div>
            <h2 id="architecture-scenario-title" style={{ margin: "6px 0", fontSize: 22 }}>{scenario.title}</h2>
            <p className="travel-architecture-status">{hotelCase.signal.title} · Status: <strong>{statusText}</strong></p>
          </div>
          <div className="travel-architecture-now" aria-live="polite">
            <span className="travel-architecture-key">Now at</span>
            <span><strong>{selectedNode.stage} · {selectedNode.label}.</strong> {selectedNode.text}</span>
            <button type="button" className="travel-architecture-inspect" onClick={() => focusArchitecture(selectedNode.id, selectedNode.stage)}>Inspect this layer</button>
          </div>
          <div className="travel-architecture-next">
            <span className="travel-architecture-key">Your next step</span>
            {nextLabel
              ? <button type="button" className="travel-architecture-primary" data-testid="architecture-next" onClick={advance}>{nextLabel} →</button>
              : hotelCase.observation
                ? <a className="travel-architecture-primary" href="#architecture-review" data-testid="architecture-next">Review the outcome and the proposed change ↓</a>
                : <p style={{ margin: 0 }}>Trace complete. Reset or choose another trace.</p>}
            <p id="follow-up-condition-hint" className="travel-architecture-hint">{followUpHint}</p>
          </div>
          <details className="travel-architecture-options">
            <summary>Trace options: follow-up condition and reset</summary>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", paddingTop: 10 }}>
              <label htmlFor="follow-up-condition">Synthetic follow-up condition</label>
                <select id="follow-up-condition" value={fault} onChange={e => setFault(e.target.value as Fault)} aria-describedby="follow-up-condition-hint" disabled={followUpLocked} style={{ padding: "10px 12px", minHeight: 44, background: "#0b1d1f", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }}>
                  <option value="none">Normal follow-up</option><option value="late-response">Late response</option><option value="ineffective-action">Ineffective action</option><option value="missing-receipt">Missing receipt</option><option value="missing-measurement">Missing measurement</option>
                </select>
              <button type="button" onClick={() => choose(selected)} style={{ padding: "10px 16px", minHeight: 44, background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.3)", cursor: "pointer" }}>Reset trace</button>
            </div>
          </details>
          <p style={{ ...muted, fontSize: 14, margin: "22px 0 8px" }}><strong style={{ color: "#a8dedb" }}>Five architecture phases</strong> · select a phase to inspect its layers; use the orange button to advance the story.</p>
          <div className="travel-architecture-stages" style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: 4, marginTop: 8 }}>
            {TRACE_STEPS.map((step,i) => <button
              key={step.id}
              onClick={() => focusArchitectureStage(step.label)}
              aria-label={`Show ${step.label} in the architecture`}
              style={{
                padding: "12px 10px",
                border: 0,
                borderTop: `3px solid ${focusStage === step.label ? "#f59e0b" : i <= activeStep ? "#a8dedb" : "rgba(255,255,255,.08)"}`,
                background: focusStage === step.label ? "rgba(245,158,11,.08)" : i === activeStep ? "rgba(168,222,219,.08)" : "rgba(255,255,255,.015)",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 10, ...muted }}>0{i+1}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: focusStage === step.label ? "#f59e0b" : i <= activeStep ? "#a8dedb" : "rgba(255,255,255,.45)" }}>{step.label}</div>
              <small style={{ display: "block", marginTop: 5, color: "rgba(255,255,255,.7)", lineHeight: 1.4 }}>{PHASE_GUIDES[step.label]}</small>
            </button>)}
          </div>
        </section>

        <div className="travel-architecture-split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(320px,.7fr)", gap: 16, alignItems: "start" }}>
          <section id="architecture-map">
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", ...muted, marginBottom: 10 }}>Architecture · click any layer to inspect</div>
            <div style={{ display: "grid", gap: 5 }}>
              {nodes.map(node => <Fragment key={node.id}><button
                className="travel-architecture-node"
                id={`architecture-node-${node.id}`}
                type="button"
                aria-expanded={compact ? inspect === node.id : undefined}
                aria-controls={compact && inspect === node.id ? "architecture-inspector" : undefined}
                onClick={() => focusArchitecture(node.id, node.stage)}
                style={{
                  ...box,
                  cursor: "pointer",
                  padding: "14px 16px",
                  textAlign: "left",
                  display: "grid",
                  gridTemplateColumns: "86px minmax(150px,.6fr) minmax(0,1fr) 20px",
                  gap: 12,
                  alignItems: "center",
                  borderColor: inspect === node.id ? "#f59e0b" : node.stage === focusStage ? "rgba(245,158,11,.28)" : "rgba(255,255,255,.08)",
                  background: inspect === node.id ? "rgba(245,158,11,.08)" : node.stage === focusStage ? "rgba(245,158,11,.035)" : "rgba(255,255,255,.025)",
                  boxShadow: inspect === node.id ? "0 0 0 1px rgba(245,158,11,.18)" : "none",
                  transition: "border-color .18s ease, background .18s ease, box-shadow .18s ease",
                }}
              >
                <span style={{ fontSize: 10, color: "#f59e0b", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 800 }}>{node.stage}</span>
                <strong style={{ color: "#fff", fontSize: 13 }}>{node.label}</strong>
                <span style={{ ...muted, fontSize: 12, lineHeight: 1.45 }}>{node.text}</span><span style={{ color: "#a8dedb" }}>→</span>
              </button>{compact && inspect === node.id && inspector}</Fragment>)}
            </div>
          </section>

          {!compact && inspector}
        </div>

        {hotelCase.observation && <section id="architecture-review" className="travel-loop-review" style={{ ...box, marginTop: 26, padding: 24, borderTop: "2px solid #a8dedb" }} aria-label="Review and replay learning">
          <div style={{ color: "#a8dedb", fontSize: 12, fontWeight: 800 }}>LEARN → HUMAN REVIEW → REPLAY → VERIFY AGAIN</div>
          <h2 style={{ fontSize: 26, margin: "10px 0" }}>Did the response work—and what changes next?</h2>
          <p style={{ color: "rgba(255,255,255,.75)", lineHeight: 1.7 }}>{lateEvidence ? "Outcome after late evidence" : "Recorded outcome"}: <strong>{OUTCOME_LABELS[hotelCase.outcome]}</strong> · Case: <strong>{execution.state === "closed" ? "Closed" : `Open · ${stateLabel(execution.state)}`}</strong>. {hotelCase.reasons.length ? `Why: ${describeFollowUpReasons(hotelCase.reasons)}.` : "Synthetic receipt recorded and the issue restored within the 20-minute target. Nothing was sent."}</p>
          {lateEvidence && <p style={{ ...muted, lineHeight: 1.7 }}>The earlier follow-up (pending evidence) stays on record. The late measurement was added alongside it, not in place of it.</p>}
          <p style={{ ...muted, lineHeight: 1.7 }}>This fixture tests restoration with a receipt within 20 minutes. It does not measure each scenario’s guest, safety or commercial outcomes. A closed case can still miss its target; a pending case stays open.</p>
          {proposal ? <>
            <h3>Proposed change for the Duty Manager to review</h3>
            <p style={{ ...muted, lineHeight: 1.7 }}>Raised because of: {describeFollowUpReasons(proposal.reasons)}. Only the settings below would change.</p>
            <ProposalChanges before={hotelCase.policy} after={proposal.candidate} />
            {!reviewed && <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button className="travel-loop-button" onClick={() => reviewChange("approved")}>Approve change for testing</button>
              <button className="travel-loop-button travel-loop-secondary" onClick={() => reviewChange("rejected")}>Reject change</button>
            </div>}
            {reviewed && <p role="status">{reviewed.decision === "approved"
              ? `Approved for testing by ${roleLabel(reviewed.reviewer ?? "")} at ${formatRecordedTime(reviewed.reviewedAt)}. It applies only to the replay below; the hotel's live settings are unchanged.`
              : `Rejected by ${roleLabel(reviewed.reviewer ?? "")} at ${formatRecordedTime(reviewed.reviewedAt)}. The current settings stay in place and the proposal is kept on record.`}</p>}
            {reviewed?.decision === "approved" && <>
              <label style={{ display: "block", margin: "18px 0", lineHeight: 1.7 }}><input type="checkbox" checked={constrained} onChange={e => setConstrained(e.target.checked)} /> Challenge the improvement with insufficient response capacity</label>
              <button className="travel-loop-button" onClick={replayChange}>Replay approved improvement</button>
            </>}
            {reviewError && <p role="alert">{reviewError}</p>}
            {replay && <div role="status" style={{ marginTop: 20, padding: 18, border: "1px solid #a8dedb", lineHeight: 1.8 }}>
              <strong>Recorded: {OUTCOME_LABELS[hotelCase.outcome].toLowerCase()} → replay: {OUTCOME_LABELS[replay.outcome].toLowerCase()}</strong>
              <p style={{ margin: "8px 0" }}>Response time: {hotelCase.observation.elapsedMinutes} → {replay.observation?.elapsedMinutes} minutes. Replay case: {replay.execution.state === "closed" ? "Closed" : `Open · ${stateLabel(replay.execution.state)}`}. {replay.reasons.length ? `Why: ${describeFollowUpReasons(replay.reasons)}.` : "Target met in the replay."}</p>
              <p style={{ margin: 0 }}>The replay is a new execution of the same signal; the recorded outcome above is unchanged. {replay.outcome === "met" ? "Candidate passed this fixture; broader validation is still required." : "Approval did not guarantee improvement. Keep the unresolved work and reassess capacity."} No change is promoted to a saved deployment.</p>
            </div>}
          </> : hotelCase.outcome === "pending" ? <>
            <p>No follow-up measurement was recorded, so no change can be proposed yet. Record the measurement for this case first.</p>
            <button className="travel-loop-button" onClick={() => { resetLearning(); setHotelCase(c => reconcileHotelFollowUp(c, { ...c.observation!, measured: true })); }}>Supply synthetic measurement and recheck</button>
          </> : <p>The target was met, so no change is proposed. Continue monitoring the next moment.</p>}
          <details style={{ marginTop: 20 }}><summary>Inspect the recorded case history</summary>
            <ol style={{ lineHeight: 1.8, paddingLeft: 24 }}>{hotelCase.audit.map((entry, index) => { const line = describeAuditEntry(entry); return <li key={index}><strong>{line.title}</strong>{line.detail && ` · ${line.detail}`}</li>; })}</ol>
            <details style={{ marginTop: 12 }}><summary>Technical identifiers</summary>
              <ol style={{ lineHeight: 1.7, paddingLeft: 24, ...muted, fontSize: 12, overflowWrap: "anywhere" }}>{hotelCase.audit.map((entry, index) => <li key={index}><code>{entry.step}</code>: {entry.detail}</li>)}</ol>
              {reviewed && <p style={{ ...muted, fontSize: 12, overflowWrap: "anywhere" }}>Source execution: {reviewed.sourceExecutionId} · review: {reviewed.reviewId} · reviewed at {reviewed.reviewedAt} · candidate: {reviewed.candidate.version}</p>}
              {replay && <p style={{ ...muted, fontSize: 12, overflowWrap: "anywhere" }}>Replay execution: {replay.execution.id}</p>}
            </details>
          </details>
        </section>}

        <section style={{ ...box, marginTop: 26, padding: 24, borderTop: "2px solid #f59e0b" }}>
          <h3 style={{ margin: "0 0 8px" }}>Next story: pressure on the team, then a disruption across hotels.</h3>
          <p style={{ ...muted, lineHeight: 1.65, margin: "0 0 16px", maxWidth: 900 }}>Coordinated Response extends coordination and reviewed learning across properties. See the hotel respond under pressure, or explore Coordination across hotels. Both are fictional planned simulations, not live execution. Approval is not delivery; evidence must confirm the response. No illustrative outcome becomes real ROI.</p>
          <div className="travel-architecture-actions">
            <Link className="travel-architecture-action" href="/partner-room/product-proof/stage-3-operating-layer?scenario=peak">Peak-pressure response →</Link>
            <Link className="travel-architecture-action" href="/partner-room/product-proof/stage-3-operating-layer?scenario=portfolio">Coordination across hotels →</Link>
            <Link className="travel-architecture-action" href="/partner-room/build-configure">Build & Configure →</Link>
            <Link className="travel-architecture-action" href="/partner-room/integration-brief">Integration →</Link>
            <Link className="travel-architecture-action" href="/partner-room/operating-evolution">Watch the operation evolve →</Link>
            <Link className="travel-architecture-action" href="/partner-room/impact-map">Scenario impact map →</Link>
            <Link className="travel-architecture-action" href="/partner-room/proof-calculator">Value / ROI →</Link>
          </div>
        </section>
      </div>
    </div>
  </PartnerRoomLayout>;
}
