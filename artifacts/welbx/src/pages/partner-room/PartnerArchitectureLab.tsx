import "./travel-impact.css";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { STATE_TO_STEP, TRACE_STEPS } from "@/lib/runtimeEngine";
import { MOCK_HOTEL } from "@/simulation/mockHotel";
import { createHotelCase, type Fault, proposeHotelLearning, reviewHotelLearning, replayHotelLearning, reconcileHotelFollowUp, type Proposal, type HotelCase } from "@/simulation/hotelLearning";
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

  const focusArchitecture = (nodeId: string, stage?: string) => {
    setInspect(nodeId);
    if (stage) setFocusStage(stage);
    window.setTimeout(() => {
      document.getElementById(`architecture-node-${nodeId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
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
    focusArchitecture(next.node, next.stage);
  };
  const nextLabel = architectureNextLabel(hotelCase);

  return <PartnerRoomLayout>
    <div className="travel-architecture" style={{ minHeight: "100vh", background: "#071315", color: "#fff" }}>
      <section style={{ padding: "56px clamp(20px,5vw,72px) 42px", background: "linear-gradient(135deg,#081719,#10282b)", borderBottom: "1px solid rgba(168,222,219,.14)" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "#f59e0b", marginBottom: 12 }}>Partner Room · Working Proof · Architecture Lab</div>
          <h1 style={{ fontSize: "clamp(34px,5vw,60px)", lineHeight: 1.03, letterSpacing: "-.045em", margin: "0 0 16px", maxWidth: 980 }}>Watch one hotel signal move through the operating architecture.</h1>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", color: "rgba(255,255,255,.86)", lineHeight: 1.55, maxWidth: 1080, margin: "0 0 10px", fontWeight: 700 }}><span style={{ color: "#a8dedb" }}>JALDO Travel is the operating layer that coordinates the hotel around the moment</span> — connecting guests, staff, systems, dashboards, buildings, partners, policies and communications so the right decision reaches the right person at the right time.</p>
          <p style={{ ...muted, maxWidth: 960, lineHeight: 1.65, fontSize: 14, margin: "0 0 12px" }}>The systems already exist. The people already exist. The dashboards and partners already exist. JALDO coordinates them into one governed decision-and-action flow.</p>
          <p style={{ ...muted, maxWidth: 900, lineHeight: 1.7, fontSize: 15 }}>This Working Proof traces that model across connection, signal, classification, governance, decision, playbook, human authority, communications, evidence, outcome and learning using the canonical Travel scenario, playbook and runtime model.</p>
          <div style={{ marginTop: 18, fontSize: 12, color: "#a8dedb" }}>Working Proof · synthetic inputs · rules-based logic · named human approval · no live hotel-system write</div>
        </div>
      </section>

      <main style={{ maxWidth: 1380, margin: "0 auto", padding: "32px clamp(20px,5vw,72px) 80px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", ...muted, marginBottom: 10 }}>Choose trace</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
          {ARCHITECTURE_SCENARIOS.map(([id,label]) => <button key={id} onClick={() => choose(id)} aria-pressed={selected === id} style={{ padding: "10px 14px", cursor: "pointer", color: selected === id ? "#071315" : "#fff", background: selected === id ? "#a8dedb" : "rgba(255,255,255,.035)", border: selected === id ? "1px solid #a8dedb" : "1px solid rgba(255,255,255,.1)", fontWeight: 800 }}>{label}</button>)}
        </div>

        <section style={{ ...box, padding: 22, marginBottom: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 18, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "#a8dedb", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{MOCK_HOTEL.name}</div>
              <h2 style={{ margin: "6px 0", fontSize: 22 }}>{scenario.title}</h2>
              <div style={{ ...muted, fontSize: 12 }}>{hotelCase.signal.title} · state: <strong style={{ color: "#fff" }}>{execution.state}</strong></div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <select value={fault} onChange={e => setFault(e.target.value as Fault)} aria-label="Synthetic follow-up condition" disabled={execution.state !== "in-action" || !!hotelCase.observation} style={{ padding: "10px 12px", background: "#0b1d1f", color: "#fff", border: "1px solid rgba(255,255,255,.12)" }}>
                <option value="none">Normal follow-up</option><option value="late-response">Late response</option><option value="ineffective-action">Ineffective action</option><option value="missing-receipt">Missing receipt</option><option value="missing-measurement">Missing measurement</option>
              </select>
              {nextLabel && <button onClick={advance} style={{ padding: "11px 16px", background: "#f59e0b", color: "#111", border: 0, fontWeight: 900, cursor: "pointer" }}>{nextLabel} →</button>}
              <button onClick={() => choose(selected)} style={{ padding: "10px 13px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.14)", cursor: "pointer" }}>Reset</button>
            </div>
          </div>
          <div className="travel-architecture-stages" style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: 4, marginTop: 22 }}>
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
            </button>)}
          </div>
        </section>

        <div className="travel-architecture-split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(320px,.7fr)", gap: 16, alignItems: "start" }}>
          <section id="architecture-map">
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", ...muted, marginBottom: 10 }}>Architecture · click any layer to inspect</div>
            <div style={{ display: "grid", gap: 5 }}>
              {nodes.map(node => <button
                className="travel-architecture-node"
                id={`architecture-node-${node.id}`}
                key={node.id}
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
              </button>)}
            </div>
          </section>

          <aside className="travel-architecture-inspector" aria-label="Layer inspector" style={{ ...box, borderTop: "2px solid #a8dedb", padding: 22, position: "sticky", top: 100 }}>
            <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{selectedNode.stage} · Inspector</div>
            <h3 style={{ margin: "7px 0 8px", fontSize: 20 }}>{selectedNode.label}</h3>
            <p style={{ ...muted, fontSize: 13, lineHeight: 1.6 }}>{selectedNode.text}</p>
            <div style={{ height: 1, background: "rgba(255,255,255,.08)", margin: "18px 0" }} />
            <div style={{ display: "grid", gap: 9 }}>{selectedNode.details.map((d,i) => <div key={i} style={{ fontSize: 12, lineHeight: 1.55, color: "rgba(255,255,255,.64)", paddingLeft: 12, borderLeft: "2px solid rgba(168,222,219,.28)" }}>{d}</div>)}</div>
          </aside>
        </div>

        {hotelCase.observation && <section className="travel-loop-review" style={{ ...box, marginTop: 26, padding: 24, borderTop: "2px solid #a8dedb" }} aria-label="Review and replay learning">
          <div style={{ color: "#a8dedb", fontSize: 12, fontWeight: 800 }}>LEARN → HUMAN REVIEW → REPLAY → VERIFY AGAIN</div>
          <h2 style={{ fontSize: 26, margin: "10px 0" }}>Did the response work—and what changes next?</h2>
          <p style={{ color: "rgba(255,255,255,.75)", lineHeight: 1.7 }}>Baseline outcome: <strong>{hotelCase.outcome}</strong> · case: <strong>{execution.state}</strong>. {hotelCase.reasons.join(", ") || "Receipt, restoration and the synthetic 20-minute target confirmed."}</p>
          <p style={{ ...muted, lineHeight: 1.7 }}>This fixture tests restoration with a receipt within 20 minutes. It does not measure each scenario’s guest, safety or commercial outcomes. A closed case can still miss its target; a pending case stays open.</p>
          {proposal ? <>
            <h3>Proposed adjustment</h3>
            <dl style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
              <div><dt>Response window</dt><dd>{hotelCase.policy.responseMinutes} → {proposal.candidate.responseMinutes} minutes</dd></div>
              <div><dt>Intervention attempts</dt><dd>{hotelCase.policy.interventionAttempts} → {proposal.candidate.interventionAttempts}</dd></div>
              <div><dt>Receipt attempts</dt><dd>{hotelCase.policy.receiptAttempts} → {proposal.candidate.receiptAttempts}</dd></div>
            </dl>
            {!reviewed && <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button className="travel-loop-button" onClick={() => reviewChange("approved")}>Approve synthetic improvement</button>
              <button className="travel-loop-button travel-loop-secondary" onClick={() => reviewChange("rejected")}>Reject improvement</button>
            </div>}
            {reviewed && <p role="status">Review: <strong>{reviewed.decision}</strong> · {reviewed.reviewer} · {reviewed.reviewedAt}. Original configuration retained.</p>}
            {reviewed?.decision === "approved" && <>
              <label style={{ display: "block", margin: "18px 0", lineHeight: 1.7 }}><input type="checkbox" checked={constrained} onChange={e => setConstrained(e.target.checked)} /> Challenge the improvement with insufficient response capacity</label>
              <button className="travel-loop-button" onClick={replayChange}>Replay approved improvement</button>
            </>}
            {reviewError && <p role="alert">{reviewError}</p>}
            {replay && <div role="status" style={{ marginTop: 20, padding: 18, border: "1px solid #a8dedb", lineHeight: 1.8 }}>
              <strong>Baseline {hotelCase.outcome} → replay {replay.outcome}</strong>
              <p style={{ margin: "8px 0" }}>Response: {hotelCase.observation.elapsedMinutes} → {replay.observation?.elapsedMinutes} minutes. Case: {replay.execution.state}. {replay.reasons.join(", ") || "Synthetic target met."}</p>
              <p style={{ margin: 0 }}>New execution, same source event, original evidence retained. {replay.outcome === "met" ? "Candidate passed this fixture; broader validation is still required." : "Approval did not guarantee improvement. Keep the unresolved work and reassess capacity."} No change is promoted to a saved deployment.</p>
            </div>}
          </> : hotelCase.outcome === "pending" ? <>
            <p>Missing measurement blocks an improvement claim. Collect a correlated follow-up first.</p>
            <button className="travel-loop-button" onClick={() => { resetLearning(); setHotelCase(c => reconcileHotelFollowUp(c, { ...c.observation!, measured: true })); }}>Supply synthetic measurement and recheck</button>
          </> : <p>No correction proposed for this successful fixture. Continue monitoring the next moment.</p>}
          <details style={{ marginTop: 20 }}><summary>Inspect retained baseline and review evidence</summary>
            <ol style={{ lineHeight: 1.8, paddingLeft: 24 }}>{hotelCase.audit.map((entry, index) => <li key={index}><strong>{entry.step}</strong>: {entry.detail}</li>)}</ol>
            {reviewed && <p>Source execution: {reviewed.sourceExecutionId} · review: {reviewed.reviewId} · candidate: {reviewed.candidate.version}</p>}
            {replay && <p>Replay execution: {replay.execution.id}</p>}
          </details>
        </section>}

        <section style={{ ...box, marginTop: 26, padding: 24, borderTop: "2px solid #f59e0b" }}>
          <h3 style={{ margin: "0 0 8px" }}>One moment is the entry point. The whole operation is the opportunity.</h3>
          <p style={{ ...muted, lineHeight: 1.65, margin: "0 0 16px", maxWidth: 900 }}>Inspect the impact across every canonical scenario, then move into configuration, integrations and modelled value. The Architecture Lab does not convert illustrative outcomes into measured ROI.</p>
          <div className="travel-architecture-actions">
            <Link className="travel-architecture-action" href="/partner-room/build-configure">Build & Configure →</Link>
            <Link className="travel-architecture-action" href="/partner-room/integration-brief">Integration →</Link>
            <Link className="travel-architecture-action" href="/partner-room/operating-evolution">Watch the operation evolve →</Link>
            <Link className="travel-architecture-action" href="/partner-room/impact-map">Scenario impact map →</Link>
            <Link className="travel-architecture-action" href="/partner-room/proof-calculator">Value / ROI →</Link>
          </div>
        </section>
      </main>
    </div>
  </PartnerRoomLayout>;
}
