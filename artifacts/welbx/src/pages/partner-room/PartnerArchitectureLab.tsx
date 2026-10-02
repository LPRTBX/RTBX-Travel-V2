import { useMemo, useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { STATE_TO_STEP, TRACE_STEPS, transitionExecution, type ScenarioExecutionState } from "@/lib/runtimeEngine";
import { MOCK_HOTEL } from "@/simulation/mockHotel";
import { approveHotelDecision, createHotelCase, dispatchHotelAction, mockHotelFollowUp, verifyHotelOutcome, type Fault, type HotelCase } from "@/simulation/hotelLearning";
import { ARCHITECTURE_SCENARIOS, architectureContext, architectureSignalFor, buildArchitectureNodes, type ArchitectureScenarioId } from "@/lib/architectureLabModel";

const box = { background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)" };
const muted = { color: "rgba(255,255,255,.5)" };
const makeCase = (id: ArchitectureScenarioId) => createHotelCase(architectureSignalFor(id));

export default function PartnerArchitectureLab() {
  const [selected, setSelected] = useState<ArchitectureScenarioId>("repeat-guest-room-not-ready");
  const [hotelCase, setHotelCase] = useState<HotelCase>(() => makeCase("repeat-guest-room-not-ready"));
  const [inspect, setInspect] = useState("signal");
  const [fault, setFault] = useState<Fault>("none");
  const { scenario } = useMemo(() => architectureContext(selected), [selected]);
  const nodes = useMemo(() => buildArchitectureNodes(selected, hotelCase), [selected, hotelCase]);
  const execution = hotelCase.execution;
  const activeStep = STATE_TO_STEP[execution.state];
  const selectedNode = nodes.find(n => n.id === inspect) || nodes[1];

  const choose = (id: ArchitectureScenarioId) => {
    setSelected(id); setHotelCase(makeCase(id)); setFault("none"); setInspect("signal");
  };
  const move = (to: ScenarioExecutionState, note: string) => setHotelCase(c => {
    const next = transitionExecution(c.execution, to, scenario, note);
    return next ? { ...c, execution: next, audit: [...c.audit, { step: to, detail: note }] } : c;
  });
  const advance = () => {
    if (execution.state === "signal-received") return move("understanding", "Synthetic signal validated");
    if (execution.state === "understanding") return move("decision-required", "Moment classified");
    if (execution.state === "decision-required") return move("approval-required", "Governance and authority applied");
    if (execution.state === "approval-required" && !hotelCase.approved) return setHotelCase(c => approveHotelDecision(c, c.execution.accountableRoleId));
    if (execution.state === "approval-required") return setHotelCase(c => dispatchHotelAction(c));
    if (execution.state === "in-action" && !hotelCase.observation) return setHotelCase(c => verifyHotelOutcome(c, mockHotelFollowUp(c, fault)));
  };
  const nextLabel =
    execution.state === "signal-received" ? "Validate signal"
    : execution.state === "understanding" ? "Classify moment"
    : execution.state === "decision-required" ? "Apply governance"
    : execution.state === "approval-required" && !hotelCase.approved ? "Human approve"
    : execution.state === "approval-required" ? "Dispatch synthetic action"
    : execution.state === "in-action" && !hotelCase.observation ? "Verify synthetic outcome" : null;

  return <PartnerRoomLayout>
    <div style={{ minHeight: "100vh", background: "#071315", color: "#fff" }}>
      <section style={{ padding: "56px clamp(20px,5vw,72px) 42px", background: "linear-gradient(135deg,#081719,#10282b)", borderBottom: "1px solid rgba(168,222,219,.14)" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "#f59e0b", marginBottom: 12 }}>Partner Room · Working Proof · Architecture Lab</div>
          <h1 style={{ fontSize: "clamp(34px,5vw,60px)", lineHeight: 1.03, letterSpacing: "-.045em", margin: "0 0 16px", maxWidth: 980 }}>Watch one hotel signal move through the operating architecture.</h1>
          <p style={{ ...muted, maxWidth: 900, lineHeight: 1.7, fontSize: 15 }}>A live synthetic trace across connection, signal, classification, governance, decision, playbook, human authority, communications, evidence, outcome and learning. It uses the same canonical Travel scenarios, playbooks and runtime engine as the Execution Centre.</p>
          <div style={{ marginTop: 18, fontSize: 12, color: "#a8dedb" }}>Working Proof · synthetic inputs · rules-based logic · named human approval · no live hotel-system write</div>
        </div>
      </section>

      <main style={{ maxWidth: 1380, margin: "0 auto", padding: "32px clamp(20px,5vw,72px) 80px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", ...muted, marginBottom: 10 }}>Choose trace</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
          {ARCHITECTURE_SCENARIOS.map(([id,label]) => <button key={id} onClick={() => choose(id)} style={{ padding: "10px 14px", cursor: "pointer", color: selected === id ? "#071315" : "#fff", background: selected === id ? "#a8dedb" : "rgba(255,255,255,.035)", border: selected === id ? "1px solid #a8dedb" : "1px solid rgba(255,255,255,.1)", fontWeight: 800 }}>{label}</button>)}
        </div>

        <section style={{ ...box, padding: 22, marginBottom: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 18, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "#a8dedb", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{MOCK_HOTEL.name}</div>
              <h2 style={{ margin: "6px 0", fontSize: 22 }}>{scenario.title}</h2>
              <div style={{ ...muted, fontSize: 12 }}>{hotelCase.signal.title} · state: <strong style={{ color: "#fff" }}>{execution.state}</strong></div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <select value={fault} onChange={e => setFault(e.target.value as Fault)} disabled={execution.state !== "in-action"} style={{ padding: "10px 12px", background: "#0b1d1f", color: "#fff", border: "1px solid rgba(255,255,255,.12)" }}>
                <option value="none">Normal follow-up</option><option value="late-response">Late response</option><option value="ineffective-action">Ineffective action</option><option value="missing-receipt">Missing receipt</option>
              </select>
              {nextLabel && <button onClick={advance} style={{ padding: "11px 16px", background: "#f59e0b", color: "#111", border: 0, fontWeight: 900, cursor: "pointer" }}>{nextLabel} →</button>}
              <button onClick={() => setHotelCase(makeCase(selected))} style={{ padding: "10px 13px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.14)", cursor: "pointer" }}>Reset</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: 4, marginTop: 22 }}>
            {TRACE_STEPS.map((step,i) => <div key={step.id} style={{ padding: "12px 10px", borderTop: `3px solid ${i <= activeStep ? "#a8dedb" : "rgba(255,255,255,.08)"}`, background: i === activeStep ? "rgba(168,222,219,.08)" : "rgba(255,255,255,.015)" }}><div style={{ fontSize: 10, ...muted }}>0{i+1}</div><div style={{ fontSize: 13, fontWeight: 900, color: i <= activeStep ? "#a8dedb" : "rgba(255,255,255,.45)" }}>{step.label}</div></div>)}
          </div>
        </section>

        <div className="rtbx-responsive-split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(320px,.7fr)", gap: 16, alignItems: "start" }}>
          <section>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", ...muted, marginBottom: 10 }}>Architecture · click any layer to inspect</div>
            <div style={{ display: "grid", gap: 5 }}>
              {nodes.map(node => <button key={node.id} onClick={() => setInspect(node.id)} style={{ ...box, cursor: "pointer", padding: "14px 16px", textAlign: "left", display: "grid", gridTemplateColumns: "86px minmax(150px,.6fr) minmax(0,1fr) 20px", gap: 12, alignItems: "center", borderColor: inspect === node.id ? "rgba(168,222,219,.55)" : "rgba(255,255,255,.08)" }}>
                <span style={{ fontSize: 10, color: "#f59e0b", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 800 }}>{node.stage}</span>
                <strong style={{ color: "#fff", fontSize: 13 }}>{node.label}</strong>
                <span style={{ ...muted, fontSize: 12, lineHeight: 1.45 }}>{node.text}</span><span style={{ color: "#a8dedb" }}>→</span>
              </button>)}
            </div>
          </section>

          <aside style={{ ...box, borderTop: "2px solid #a8dedb", padding: 22, position: "sticky", top: 100 }}>
            <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{selectedNode.stage} · Inspector</div>
            <h3 style={{ margin: "7px 0 8px", fontSize: 20 }}>{selectedNode.label}</h3>
            <p style={{ ...muted, fontSize: 13, lineHeight: 1.6 }}>{selectedNode.text}</p>
            <div style={{ height: 1, background: "rgba(255,255,255,.08)", margin: "18px 0" }} />
            <div style={{ display: "grid", gap: 9 }}>{selectedNode.details.map((d,i) => <div key={i} style={{ fontSize: 12, lineHeight: 1.55, color: "rgba(255,255,255,.64)", paddingLeft: 12, borderLeft: "2px solid rgba(168,222,219,.28)" }}>{d}</div>)}</div>
          </aside>
        </div>

        <section style={{ ...box, marginTop: 26, padding: 24, borderTop: "2px solid #f59e0b" }}>
          <h3 style={{ margin: "0 0 8px" }}>From architecture proof to commercial proof</h3>
          <p style={{ ...muted, lineHeight: 1.65, margin: "0 0 16px", maxWidth: 900 }}>Once the trace is understood, move into configuration, integrations and modelled value. The Architecture Lab does not convert illustrative outcomes into measured ROI.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Link href="/partner-room/build-configure"><button style={{ padding: "10px 13px", cursor: "pointer" }}>Build & Configure →</button></Link>
            <Link href="/partner-room/integration-brief"><button style={{ padding: "10px 13px", cursor: "pointer" }}>Integration →</button></Link>
            <Link href="/partner-room/proof-calculator"><button style={{ padding: "10px 13px", cursor: "pointer" }}>Value / ROI →</button></Link>
          </div>
        </section>
      </main>
    </div>
  </PartnerRoomLayout>;
}
