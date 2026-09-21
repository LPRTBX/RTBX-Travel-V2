import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import {
  TRAVEL_AI_COMMS_FLOW,
  TRAVEL_AI_ASSISTANTS,
  TRAVEL_CENTRAL_COMMS_CHANNELS,
  TRAVEL_COMMUNICATION_REGISTRY,
  TRAVEL_AI_OPERATING_MODEL_STAGES,
  TRAVEL_AI_OPERATING_MODEL_STATEMENT,
  TRAVEL_AI_COMMS_POSITIONING_STATEMENT,
} from "@/data/travelAiComms";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", green: "#10b981", red: "#ef4444" };

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>
);

const H2 = ({ children }: { children: string }) => (
  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>{children}</h2>
);

export default function PartnerTravelAiComms() {
  const [openId, setOpenId] = useState<string | null>(TRAVEL_COMMUNICATION_REGISTRY[0].id);

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionLabel>JALDO Travel · Communications</SectionLabel>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 16, maxWidth: 760 }}>
            Prompt &amp; Nudge Engine and Central Comms OS
          </h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 720 }}>
            A deterministic Working Proof of governed draft communications across guest, staff and operator roles.
          </p>
        </div>

        <div style={{ padding: "16px 20px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.22)", borderLeft: "3px solid #ef4444", maxWidth: 820, marginBottom: 16 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: C.red, textTransform: "uppercase", fontWeight: 800, marginBottom: 7 }}>Working Proof + Simulation Boundary</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.76)", lineHeight: 1.7, margin: 0, fontWeight: 600 }}>
            Current behaviour is deterministic and rules-based. Every communication below is a draft shown with synthetic data: nothing is delivered, externally routed, booked, activated, completed or logged. AI assistance and external integrations are Planned only. Deterministic rules remain the fallback, and a named human owner must approve and remains accountable for any real-world action.
          </p>
        </div>

        <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)", borderLeft: "3px solid #c9a84c", maxWidth: 700, marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, margin: 0, fontWeight: 600 }}>
            The current Prompt &amp; Nudge Engine uses deterministic rules to show draft recommendations. Planned AI may assist with drafting later, but cannot replace the deterministic fallback or named human approval. This proof does not contact guests, staff, partners or external channels.
          </p>
        </div>

        {/* ── FLOW ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Modelled Signal to Illustrative Outcome</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            {TRAVEL_AI_COMMS_FLOW.map((step, i, arr) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  padding: "8px 13px", fontSize: 10, fontWeight: 700,
                  color: step.includes("Planned AI") ? "#080c14" : "rgba(255,255,255,0.6)",
                  background: step.includes("Planned AI") ? "#c9a84c" : "rgba(255,255,255,0.03)",
                  border: step.includes("Planned AI") ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                }}>
                  {step}
                </div>
                {i < arr.length - 1 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ── TRAVEL AI ASSISTANTS ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>01 · Interfaces</SectionLabel>
          <H2>Planned Travel AI Assistants</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 760 }}>
            {TRAVEL_AI_ASSISTANTS.length} proposed role-scoped assistants. These capabilities are Planned, not current; deterministic rules show the present drafts, while named humans own approval and accountability.
          </p>
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {TRAVEL_AI_ASSISTANTS.map(a => (
              <div key={a.id} style={{ padding: "20px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${a.color}` }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{a.name}</div>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: a.color, marginBottom: 14 }}>{a.role}</div>

                <div style={{ marginBottom: a.mustEscalate || a.mustNot ? 12 : 0 }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.green, marginBottom: 6 }}>Planned Scope</div>
                  {a.can.map(item => (
                    <div key={item} style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 5, display: "flex", gap: 8 }}>
                      <span style={{ color: C.green }}>+</span>{item}
                    </div>
                  ))}
                </div>

                {a.mustEscalate && (
                  <div>
                    <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.red, marginBottom: 6 }}>Planned Escalation</div>
                    {a.mustEscalate.map(item => (
                      <div key={item} style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 5, display: "flex", gap: 8 }}>
                        <span style={{ color: C.red }}>!</span>{item}
                      </div>
                    ))}
                  </div>
                )}

                {a.mustNot && (
                  <div>
                    <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.red, marginBottom: 6 }}>Must Not</div>
                    {a.mustNot.map(item => (
                      <div key={item} style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 5, display: "flex", gap: 8 }}>
                        <span style={{ color: C.red }}>—</span>{item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTRAL COMMS CHANNELS ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>02 · Proposed Reach</SectionLabel>
          <H2>Illustrative Channel Targets</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 760 }}>
            Display labels only. No channel is connected and this Working Proof does not deliver or route communications externally.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TRAVEL_CENTRAL_COMMS_CHANNELS.map(ch => (
              <div key={ch.id} style={{ padding: "8px 13px", fontSize: 11, color: "rgba(255,255,255,0.62)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {ch.name}
              </div>
            ))}
          </div>
        </div>

        {/* ── COMMUNICATION REGISTRY ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>03 · Registry</SectionLabel>
          <H2>Communication Registry</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 760 }}>
            {TRAVEL_COMMUNICATION_REGISTRY.length} illustrative travel communication drafts. Each shows a proposed moment, named approval responsibility and modelled acceptance criterion; none represents delivery, response, completion or evidence.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TRAVEL_COMMUNICATION_REGISTRY.map(c => {
              const isOpen = openId === c.id;
              return (
                <div key={c.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div
                    onClick={() => setOpenId(isOpen ? null : c.id)}
                    style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", flexWrap: "wrap", gap: 8 }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", minWidth: 0 }}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(201,168,76,0.5)", letterSpacing: "0.04em" }}>{c.id.replace("comm-", "").toUpperCase()}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{c.momentType}</div>
                    </div>
                    <div style={{ fontSize: 15, color: C.gold, flexShrink: 0, marginLeft: 16 }}>{isOpen ? "\u2212" : "+"}</div>
                  </div>
                  {isOpen && (
                    <div className="rtbx-grid-2" style={{ padding: "0 20px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                      {[
                        ["Audience", c.audience], ["Role", c.role], ["Channel", c.channel],
                        ["Tone", c.tone], ["Approval rule", c.approvalRule], ["Escalation rule", c.escalationRule],
                        ["Linked playbook", c.linkedPlaybook], ["Linked governance", c.linkedGovernance],
                        ["Draft status", c.deliveryStatus], ["Modelled response", c.responseStatus],
                        ["Illustrative acceptance criterion", c.outcomeRequirement],
                      ].map(([label, val]) => (
                        <div key={label} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                          <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>{label}: </span>{val}
                        </div>
                      ))}
                      <div style={{ gridColumn: "1 / -1", marginTop: 6, padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", fontSize: 10.5, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
                        "{c.template}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── AI OPERATING MODEL ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>04 · How It Runs</SectionLabel>
          <H2>Current Rules + Planned AI Model</H2>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 20 }}>
            {TRAVEL_AI_OPERATING_MODEL_STAGES.map((stage, i, arr) => (
              <div key={stage} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  padding: "9px 14px", fontSize: 10, fontWeight: 700,
                  color: stage === "Named Human Approval" ? "#080c14" : "rgba(255,255,255,0.65)",
                  background: stage === "Named Human Approval" ? "#c9a84c" : "rgba(255,255,255,0.03)",
                  border: stage === "Named Human Approval" ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                }}>
                  {stage}
                </div>
                {i < arr.length - 1 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>→</span>}
              </div>
            ))}
          </div>
          <div style={{ padding: "18px 22px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: "3px solid #c9a84c" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0, fontWeight: 600 }}>
              {TRAVEL_AI_OPERATING_MODEL_STATEMENT}
            </p>
          </div>
        </div>

        {/* AI Boundary */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
            Planned AI Operating Boundary
          </div>
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 20 }}>
            <div style={{ padding: "22px 24px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)", borderTop: "2px solid #10b981" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#10b981", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Planned AI Scope</div>
              {[
                "Assist with classification while deterministic rules remain available",
                "Draft guest-facing copy for named human review",
                "Recommend playbooks to accountable role owners",
                "Summarise synthetic moment context for review",
                "Suggest escalation paths without initiating them",
                "Suggest channel targets without delivery or external routing",
              ].map(item => (
                <div key={item} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                  <span style={{ color: "#10b981", flexShrink: 0 }}>+</span>{item}
                </div>
              ))}
            </div>
            <div style={{ padding: "22px 24px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)", borderTop: "2px solid #ef4444" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#ef4444", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Named Human Accountability</div>
              {[
                "Approve and initiate any guest-facing communication outside this proof",
                "Approve compensation or refund at any value",
                "Make welfare, safety or duty-of-care decisions",
                "Override configured governance thresholds",
                "Act without a named accountable role owner",
                "Contact external channels, staff or partners",
              ].map(item => (
                <div key={item} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                  <span style={{ color: "#ef4444", flexShrink: 0 }}>—</span>{item}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "14px 18px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderLeft: "3px solid #c9a84c" }}>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>
              AI assistance is Planned only. Current classifications and draft suggestions are deterministic, with a deterministic fallback retained for future assistance. The proof cannot act, deliver, confirm welfare or create evidence; a named human role owner approves and remains accountable outside the simulation.
            </p>
          </div>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Live Comms Demo",       href: "/partner-room/comms-demo" },
            { label: "Travel Intelligence",    href: "/partner-room/travel-intelligence" },
            { label: "Travel Operating Systems", href: "/partner-room/travel-operating-systems" },
            { label: "Architecture, Modelling & UX/QA", href: "/partner-room/resources/travel-architecture-modelling-ux-qa" },
            { label: "Action Centre",          href: "/partner-room/operations#action-centre" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
