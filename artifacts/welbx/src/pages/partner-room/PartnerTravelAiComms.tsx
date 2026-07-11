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
          <SectionLabel>Travel Intelligence</SectionLabel>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 16, maxWidth: 760 }}>
            Travel AI &amp; Central Comms
          </h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 720 }}>
            Governed AI assistants and communications coordinated across guest, staff and operator roles.
          </p>
        </div>

        {/* ── POSITIONING ── */}
        <div style={{ padding: "18px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #c9a84c", marginBottom: 40 }}>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0, fontWeight: 600 }}>
            {TRAVEL_AI_COMMS_POSITIONING_STATEMENT}
          </p>
        </div>

        {/* ── FLOW ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Signal to Outcome</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            {TRAVEL_AI_COMMS_FLOW.map((step, i, arr) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  padding: "8px 13px", fontSize: 10, fontWeight: 700,
                  color: step.includes("AI Assistant") ? "#080c14" : "rgba(255,255,255,0.6)",
                  background: step.includes("AI Assistant") ? "#c9a84c" : "rgba(255,255,255,0.03)",
                  border: step.includes("AI Assistant") ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
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
          <H2>Travel AI Assistants</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 760 }}>
            {TRAVEL_AI_ASSISTANTS.length} role-scoped assistants. Each has a fixed boundary — what it may do, and what it must escalate or must never do.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {TRAVEL_AI_ASSISTANTS.map(a => (
              <div key={a.id} style={{ padding: "20px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${a.color}` }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{a.name}</div>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: a.color, marginBottom: 14 }}>{a.role}</div>

                <div style={{ marginBottom: a.mustEscalate || a.mustNot ? 12 : 0 }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.green, marginBottom: 6 }}>Can</div>
                  {a.can.map(item => (
                    <div key={item} style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 5, display: "flex", gap: 8 }}>
                      <span style={{ color: C.green }}>+</span>{item}
                    </div>
                  ))}
                </div>

                {a.mustEscalate && (
                  <div>
                    <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.red, marginBottom: 6 }}>Must Escalate</div>
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
          <SectionLabel>02 · Reach</SectionLabel>
          <H2>Central Comms Channels</H2>
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
            {TRAVEL_COMMUNICATION_REGISTRY.length} structured travel communication examples. Every communication is tied to a moment type, a governed approval rule, an escalation rule and an outcome requirement.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TRAVEL_COMMUNICATION_REGISTRY.map(c => {
              const isOpen = openId === c.id;
              return (
                <div key={c.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div
                    onClick={() => setOpenId(isOpen ? null : c.id)}
                    style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(201,168,76,0.5)", letterSpacing: "0.04em" }}>{c.id.replace("comm-", "").toUpperCase()}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{c.momentType}</div>
                    </div>
                    <div style={{ fontSize: 15, color: C.gold, flexShrink: 0, marginLeft: 16 }}>{isOpen ? "\u2212" : "+"}</div>
                  </div>
                  {isOpen && (
                    <div style={{ padding: "0 20px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                      {[
                        ["Audience", c.audience], ["Role", c.role], ["Channel", c.channel],
                        ["Tone", c.tone], ["Approval rule", c.approvalRule], ["Escalation rule", c.escalationRule],
                        ["Linked playbook", c.linkedPlaybook], ["Linked governance", c.linkedGovernance],
                        ["Delivery status", c.deliveryStatus], ["Response status", c.responseStatus],
                        ["Outcome requirement", c.outcomeRequirement],
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
          <H2>AI Operating Model</H2>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 20 }}>
            {TRAVEL_AI_OPERATING_MODEL_STAGES.map((stage, i, arr) => (
              <div key={stage} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  padding: "9px 14px", fontSize: 10, fontWeight: 700,
                  color: stage === "Human Approval" ? "#080c14" : "rgba(255,255,255,0.65)",
                  background: stage === "Human Approval" ? "#c9a84c" : "rgba(255,255,255,0.03)",
                  border: stage === "Human Approval" ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
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

        {/* ── GOVERNED, NOT AUTONOMOUS ── */}
        <div style={{ padding: "20px 22px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", marginBottom: 48 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.14em", color: C.red, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>What AI Does Not Do</div>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, margin: 0 }}>
            No Travel AI assistant independently approves compensation, safety response, security action, medical advice or critical escalation. Central Comms OS is the coordination layer; AI assistants are interfaces inside it. Every consequential decision passes to a named human role.
          </p>
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
