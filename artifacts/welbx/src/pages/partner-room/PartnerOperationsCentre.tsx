import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import {
  TRAVEL_ACTION_CARDS, TRAVEL_PROPERTIES, TRAVEL_PRIORITIES, ACTION_STATUS_SEQUENCE,
  TRAVEL_OUTCOME_LEDGER, TRAVEL_EVIDENCE_LEDGER, EVIDENCE_WORDING_NOTE,
  TRAVEL_VALUE_CATEGORIES, VALUE_DEMO_LABEL_NOTE,
  TRAVEL_FEEDBACK_LOOP, TRAVEL_FEEDBACK_LOOP_STATEMENT,
  type ActionStatus, type TravelOperatingSystemName, type TravelRole,
} from "@/data/travelOperations";

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", gold: "#c9a84c", green: "#10b981", red: "#ef4444" };

const OPERATING_SYSTEMS: TravelOperatingSystemName[] = [
  "Guest Experience OS", "Service Recovery & Staff Response OS", "Marketplace & Loyalty Activation OS",
  "Operator Intelligence OS", "Safety & Guest Welfare OS",
];
const ROLES: TravelRole[] = ["Guest", "Frontline", "Manager", "Operator", "Partner", "Executive"];

const STATUS_COLORS: Record<ActionStatus, string> = {
  "New": "#3b82f6", "Acknowledged": "#a78bfa", "In progress": "#c9a84c",
  "Waiting approval": "#f97316", "Escalated": "#ef4444", "Completed": "#10b981",
  "Follow-up required": "#f97316", "Closed": "rgba(255,255,255,0.35)",
};

const PRIORITY_COLORS: Record<string, string> = { Low: "rgba(255,255,255,0.35)", Medium: "#3b82f6", High: "#f97316", Critical: "#ef4444" };

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>
);
const H2 = ({ children }: { children: string }) => (
  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>{children}</h2>
);

function FilterPill({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{
      padding: "6px 13px", fontSize: 10, fontWeight: 700, cursor: "pointer",
      color: active ? "#080c14" : "rgba(255,255,255,0.5)",
      background: active ? color : "rgba(255,255,255,0.03)",
      border: `1px solid ${active ? color : "rgba(255,255,255,0.12)"}`,
    }}>
      {label}
    </div>
  );
}

export default function PartnerOperationsCentre() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  // filters
  const [propertyFilter, setPropertyFilter] = useState<string | null>(null);
  const [osFilter, setOsFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<TravelRole | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(TRAVEL_ACTION_CARDS[0].id);

  // demo-progressable statuses, seeded from data
  const [statuses, setStatuses] = useState<Record<string, ActionStatus>>(
    () => Object.fromEntries(TRAVEL_ACTION_CARDS.map(a => [a.id, a.status]))
  );

  const filteredActions = useMemo(() => TRAVEL_ACTION_CARDS.filter(a =>
    (!propertyFilter || a.property === propertyFilter) &&
    (!osFilter || a.operatingSystem === osFilter) &&
    (!roleFilter || a.supportingRoles.includes(roleFilter)) &&
    (!priorityFilter || a.priority === priorityFilter)
  ), [propertyFilter, osFilter, roleFilter, priorityFilter]);

  const advanceStatus = (id: string) => {
    setStatuses(prev => {
      const current = prev[id];
      const idx = ACTION_STATUS_SEQUENCE.indexOf(current);
      const next = idx >= 0 && idx < ACTION_STATUS_SEQUENCE.length - 1 ? ACTION_STATUS_SEQUENCE[idx + 1] : current;
      return { ...prev, [id]: next };
    });
  };

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>RTBX Travel · Operations</SectionLabel>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 12, maxWidth: 760 }}>
            RTBX Execution Centre — Travel Environment
          </h1>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 16, letterSpacing: "-0.01em" }}>
            Travel Operations Centre — Operator Interface
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700 }}>
            The Action Centre, Outcome Ledger, Evidence Ledger and Value Dashboard below run on synthetic demo data and connect signals to playbooks, communications, actions, evidence, outcomes and value — the same operating surfaces a live deployment runs on once configuration is complete.
          </p>
        </div>

        <Link href="/partner-room/travel-ai-comms">
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", marginBottom: 40,
            background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", cursor: "pointer",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", letterSpacing: "0.04em" }}>
              Every action here is coordinated through Central Comms — Travel AI & Central Comms →
            </span>
          </div>
        </Link>

        {/* ── EXECUTION CENTRE ── */}
        <div id="action-centre" style={{ marginBottom: 64, scrollMarginTop: 90 }}>
          <SectionLabel>01 · Execution</SectionLabel>
          <H2>RTBX Execution Centre — Travel Environment</H2>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", marginBottom: 12, marginTop: -6 }}>Travel Operations Centre</div>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 760 }}>
            Every open moment, its assigned role owner and its response deadline. Filter by property, operating system, role or priority. Expand a card for its linked communications, evidence and outcome — or progress it through its demo status sequence.
          </p>

          {/* 8 operational domains */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
              {["Active Signals", "Moments", "Decisions", "Actions", "Comms", "Escalations", "Evidence", "Outcomes & Learning"].map((d, i) => (
                <div key={d} style={{
                  padding: "5px 12px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: i === 0 ? "#c9a84c" : "rgba(255,255,255,0.4)",
                  border: `1px solid ${i === 0 ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.1)"}`,
                  background: i === 0 ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)",
                }}>{d}</div>
              ))}
            </div>
            <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "2px solid rgba(201,168,76,0.4)" }}>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>
                This is the RTBX Execution Centre configured for the Travel environment. Every live moment, decision, communication and outcome record flows through this interface. Operators see only what they are authorised to see; every action is governed and evidenced.
              </p>
            </div>
          </div>

          {/* filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Property</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <FilterPill label="All" active={!propertyFilter} color={C.gold} onClick={() => setPropertyFilter(null)} />
                {TRAVEL_PROPERTIES.map(p => <FilterPill key={p} label={p} active={propertyFilter === p} color={C.gold} onClick={() => setPropertyFilter(p)} />)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Operating System</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <FilterPill label="All" active={!osFilter} color="#3b82f6" onClick={() => setOsFilter(null)} />
                {OPERATING_SYSTEMS.map(os => <FilterPill key={os} label={os} active={osFilter === os} color="#3b82f6" onClick={() => setOsFilter(os)} />)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Role</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <FilterPill label="All" active={!roleFilter} color={C.green} onClick={() => setRoleFilter(null)} />
                {ROLES.map(r => <FilterPill key={r} label={r} active={roleFilter === r} color={C.green} onClick={() => setRoleFilter(r)} />)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8.5, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Priority</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <FilterPill label="All" active={!priorityFilter} color={C.red} onClick={() => setPriorityFilter(null)} />
                {TRAVEL_PRIORITIES.map(p => <FilterPill key={p} label={p} active={priorityFilter === p} color={PRIORITY_COLORS[p]} onClick={() => setPriorityFilter(p)} />)}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>{filteredActions.length} of {TRAVEL_ACTION_CARDS.length} actions shown</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredActions.map(a => {
              const status = statuses[a.id];
              const isOpen = expandedId === a.id;
              const outcome = TRAVEL_OUTCOME_LEDGER.find(o => o.id === a.linkedOutcomeId);
              const evidences = TRAVEL_EVIDENCE_LEDGER.filter(e => a.linkedEvidenceIds.includes(e.id));
              const canAdvance = ACTION_STATUS_SEQUENCE.indexOf(status) < ACTION_STATUS_SEQUENCE.length - 1;
              return (
                <div key={a.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${STATUS_COLORS[status]}` }}>
                  <div onClick={() => setExpandedId(isOpen ? null : a.id)} style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, cursor: "pointer", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff" }}>{a.moment}</div>
                        <div style={{ fontSize: 8.5, fontWeight: 700, color: PRIORITY_COLORS[a.priority], border: `1px solid ${PRIORITY_COLORS[a.priority]}50`, padding: "2px 7px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{a.priority}</div>
                      </div>
                      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)" }}>{a.property} · {a.owner} · Due {a.dueTime}</div>
                    </div>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: STATUS_COLORS[status], border: `1px solid ${STATUS_COLORS[status]}50`, padding: "5px 11px", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{status}</div>
                  </div>

                  {isOpen && (
                    <div style={{ padding: "0 20px 22px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", marginBottom: 16 }}>
                        {[
                          ["Action ID", a.id], ["Linked signal", a.linkedSignal], ["Linked playbook", a.linkedPlaybook],
                          ["Supporting roles", a.supportingRoles.join(", ")], ["Communication status", a.communicationStatus],
                          ["Escalation status", a.escalationStatus], ["Evidence required", a.evidenceRequired], ["Outcome required", a.outcomeRequired],
                        ].map(([label, val]) => (
                          <div key={label} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                            <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>{label}: </span>{val}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); advanceStatus(a.id); }}
                          disabled={!canAdvance}
                          style={{
                            padding: "8px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                            color: canAdvance ? "#080c14" : "rgba(255,255,255,0.25)", background: canAdvance ? C.gold : "rgba(255,255,255,0.04)",
                            border: "none", cursor: canAdvance ? "pointer" : "default",
                          }}
                        >
                          {canAdvance ? "Progress demo action →" : "Sequence complete"}
                        </button>
                        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", alignSelf: "center" }}>Demo control — advances this card's status locally</div>
                      </div>

                      {/* Linked comms */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Linked Communications</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {a.linkedCommunicationIds.map(id => (
                            <Link key={id} href={`/partner-room/travel-ai-comms#${id}`}>
                              <div style={{ padding: "6px 12px", fontSize: 10, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>{id.replace("comm-", "").replace(/-/g, " ")}</div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Linked evidence */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>Linked Evidence</div>
                        {evidences.length === 0 ? (
                          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>No evidence recorded yet</div>
                        ) : evidences.map(ev => (
                          <div key={ev.id} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>
                            <span style={{ color: C.gold }}>●</span> {ev.label} — {ev.timestamp}
                          </div>
                        ))}
                      </div>

                      {/* Linked outcome */}
                      {outcome && (
                        <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Linked Outcome</div>
                          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                            <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>Guest confirmation: </span>{outcome.guestConfirmation}<br />
                            <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>Operator outcome: </span>{outcome.operatorOutcome}<br />
                            <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>Commercial outcome: </span>{outcome.commercialOutcome}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link href="/partner-room/product-proof/signal-capture"><div style={{ display: "inline-block", fontSize: 10, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>See also: Signal-to-Action Pipeline (product proof) →</div></Link>
          </div>
        </div>

        {/* ── OUTCOME LEDGER ── */}
        <div id="outcome-ledger" style={{ marginBottom: 64, scrollMarginTop: 90 }}>
          <SectionLabel>02 · Record</SectionLabel>
          <H2>Travel Outcome Ledger</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 760 }}>
            Every resolved or in-progress moment — from signal through governance, playbook, action and communication to outcome and learning.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TRAVEL_OUTCOME_LEDGER.map(o => (
              <details key={o.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <summary style={{ padding: "14px 20px", cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: "#fff", listStyle: "none", display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>{o.moment}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{o.owner}</span>
                </summary>
                <div style={{ padding: "0 20px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                  {[
                    ["Signal", o.signal], ["Governance rule", o.governanceRule], ["Playbook", o.playbook],
                    ["Actions taken", o.actionsTaken], ["Communications sent", o.communicationsSent], ["Approval", o.approval],
                    ["Time to response", o.timeToResponse], ["Time to completion", o.timeToCompletion],
                    ["Guest confirmation", o.guestConfirmation], ["Operator outcome", o.operatorOutcome],
                    ["Commercial outcome", o.commercialOutcome], ["Follow-up", o.followUp],
                  ].map(([label, val]) => (
                    <div key={label} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>{label}: </span>{val}
                    </div>
                  ))}
                  <div style={{ gridColumn: "1 / -1", marginTop: 4, padding: "10px 14px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", fontSize: 10.5, color: "rgba(255,255,255,0.55)" }}>
                    <span style={{ color: C.gold, fontWeight: 700 }}>Learning note: </span>{o.learningNote}
                  </div>
                </div>
              </details>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link href="/partner-room/validation-replay"><div style={{ display: "inline-block", fontSize: 10, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>See also: Scenario Replay Lab →</div></Link>
          </div>
        </div>

        {/* ── EVIDENCE LEDGER ── */}
        <div id="evidence-ledger" style={{ marginBottom: 64, scrollMarginTop: 90 }}>
          <SectionLabel>03 · Trace</SectionLabel>
          <H2>Travel Evidence Ledger</H2>
          <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 20, maxWidth: 760 }}>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{EVIDENCE_WORDING_NOTE}</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {["Record", "Timestamp", "Owner", "Action Confirmation", "Message Delivery", "Approval Record", "Escalation Record", "Guest Acknowledgement", "Closure Review"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", fontSize: 8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRAVEL_EVIDENCE_LEDGER.map(e => (
                  <tr key={e.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "9px 10px", fontWeight: 700, color: "#fff" }}>{e.label}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.timestamp}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.owner}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.actionConfirmation}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.messageDelivery}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.approvalRecord}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.escalationRecord}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.guestAcknowledgement}</td>
                    <td style={{ padding: "9px 10px", color: "rgba(255,255,255,0.5)" }}>{e.closureReview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 14 }}>
            <Link href="/partner-room/validation"><div style={{ display: "inline-block", fontSize: 10, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>See also: Validation & Operator Stories →</div></Link>
          </div>
        </div>

        {/* ── VALUE DASHBOARD ── */}
        <div id="value-dashboard" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>04 · Value</SectionLabel>
          <H2>Travel Value Dashboard</H2>
          <div style={{ padding: "12px 16px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 24, maxWidth: 760 }}>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0, fontWeight: 600 }}>{VALUE_DEMO_LABEL_NOTE}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, marginBottom: 32 }}>
            {TRAVEL_VALUE_CATEGORIES.map(cat => (
              <div key={cat.id} style={{ padding: "20px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${cat.color}` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: cat.color, marginBottom: 14, letterSpacing: "0.02em" }}>{cat.label}</div>
                {cat.measures.map(m => (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{m.label}</div>
                      {m.note && <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{m.note}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{m.value}</span>
                      {m.demo && <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.15)", padding: "1px 5px", textTransform: "uppercase" }}>Demo</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Feedback loop */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Feedback Loop</div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 16 }}>
              {TRAVEL_FEEDBACK_LOOP.map((step, i, arr) => (
                <div key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    padding: "9px 14px", fontSize: 10, fontWeight: 700,
                    color: i === arr.length - 1 ? "#080c14" : "rgba(255,255,255,0.65)",
                    background: i === arr.length - 1 ? "#c9a84c" : "rgba(255,255,255,0.03)",
                    border: i === arr.length - 1 ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                    {step}
                  </div>
                  {i < arr.length - 1 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>→</span>}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 700, fontWeight: 600 }}>{TRAVEL_FEEDBACK_LOOP_STATEMENT}</p>
          </div>
          <Link href="/partner-room/proof-calculator"><div style={{ display: "inline-block", fontSize: 10, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>See also: Proof Calculator (model your own property) →</div></Link>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Travel AI & Central Comms", href: "/partner-room/travel-ai-comms" },
            { label: "Travel Operating Systems",  href: "/partner-room/travel-operating-systems" },
            { label: "Travel Intelligence",       href: "/partner-room/travel-intelligence" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
