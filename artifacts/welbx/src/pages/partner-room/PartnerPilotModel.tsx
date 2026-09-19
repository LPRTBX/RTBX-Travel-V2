/**
 * PartnerPilotModel.tsx — Sprint 5
 *
 * Canonical pilot model page for RTBX Travel.
 *
 * Sources from travelPilotModel.ts, travelScenarios.ts and travelOperatingSystems.ts.
 * Does not invent performance results. Success measures identify what will be agreed during alignment.
 * All durations are indicative.
 */

import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import {
  PILOT_PROPOSITION,
  PILOT_OPERATING_SYSTEMS,
  PILOT_SCENARIOS,
  PILOT_USERS,
  PILOT_STAGES,
  PILOT_SUCCESS_MEASURES,
  READINESS_CHECKLIST,
  READINESS_STATE_LABELS,
  DEPLOYMENT_PACKAGE,
  EXPANSION_STAGES,
  type ReadinessState,
  type SuccessMeasureTargetType,
} from "@/data/travelPilotModel";
import { TRAVEL_SCENARIOS } from "@/data/travelScenarios";
import { travelScenarioPath } from "@/lib/travelScenarioRouting";
import { TRAVEL_OPERATING_SYSTEMS } from "@/data/travelOperatingSystems";

// ── Style constants ───────────────────────────────────────────────────────────

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.28)", gold: "#c9a84c", green: "#10b981", blue: "#3b82f6", red: "#ef4444" };

const READINESS_COLORS: Record<ReadinessState, string> = {
  "not-started":                   "rgba(255,255,255,0.25)",
  "in-progress":                   "#3b82f6",
  "ready":                         "#10b981",
  "blocked":                       "#ef4444",
  "requires-production-engineering": "#f97316",
};

const TARGET_COLORS: Record<SuccessMeasureTargetType, string> = {
  "customer-baseline": "#3b82f6",
  "pilot-target":      "#c9a84c",
  "indicative-target": "#a78bfa",
  "to-be-agreed":      "rgba(255,255,255,0.35)",
  "not-yet-measured":  "rgba(255,255,255,0.2)",
};

function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 11, letterSpacing: "0.16em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>;
}
function H2({ children }: { children: string }) {
  return <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10, lineHeight: 1.25 }}>{children}</h2>;
}

export default function PartnerPilotModel() {
  const [readinessStates, setReadinessStates] = useState<Record<string, ReadinessState>>(
    () => Object.fromEntries(READINESS_CHECKLIST.map(item => [item.id, item.defaultState]))
  );

  const categories = Array.from(new Set(READINESS_CHECKLIST.map(i => i.category)));
  const measureCategories = Array.from(new Set(PILOT_SUCCESS_MEASURES.map(m => m.category)));

  const nextState = (s: ReadinessState): ReadinessState => {
    const order: ReadinessState[] = ["not-started", "in-progress", "ready", "blocked", "requires-production-engineering"];
    const idx = order.indexOf(s);
    return order[(idx + 1) % order.length];
  };

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>RTBX Travel · Pilot Model</SectionLabel>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.15, marginBottom: 14, maxWidth: 760 }}>
            {PILOT_PROPOSITION.name}
          </h1>
          <div style={{ fontSize: 20, fontWeight: 300, color: C.gold, marginBottom: 16, fontStyle: "italic" }}>
            {PILOT_PROPOSITION.tagline}
          </div>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 700, marginBottom: 20 }}>
            {PILOT_PROPOSITION.summary}
          </p>
          <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
            <div style={{ padding: "6px 14px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)", fontSize: 12, fontWeight: 700, color: C.gold }}>
              Primary market: {PILOT_PROPOSITION.primaryMarket}
            </div>
            <div style={{ padding: "6px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>
              {PILOT_PROPOSITION.durationNote}
            </div>
          </div>
        </div>

        {/* ── TARGET BUYER ── */}
        <div id="target-buyer" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>01 · Buyer</SectionLabel>
          <H2>Target buyer and sponsor</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            The first pilot is led from the top. These are the most likely decision-makers and sponsors for an initial RTBX Travel engagement.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {PILOT_PROPOSITION.primaryBuyers.map((buyer, i) => (
              <div key={i} style={{ padding: "8px 14px", background: i === 0 ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${i === 0 ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.1)"}`, fontSize: 12, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.gold : "rgba(255,255,255,0.6)" }}>
                {buyer}
              </div>
            ))}
          </div>
        </div>

        {/* ── SCOPE ── */}
        <div id="scope" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>02 · Scope</SectionLabel>
          <H2>Pilot scope</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            Begin with one initial hotel property, then use the reviewed 1–5-property cohort pathway only when governance, integration readiness and evidence support expansion.
          </p>
           <div className="rtbx-responsive-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 2, marginBottom: 12 }}>
            <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 8 }}>Environment</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{PILOT_PROPOSITION.targetEnvironment}</div>
              <div style={{ fontSize: 12, color: C.muted }}>Hotels and resorts — primary market</div>
            </div>
            <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 8 }}>Pilot users</div>
              {PILOT_USERS.slice(0, 5).map((u, i) => <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", padding: "2px 0" }}>· {u}</div>)}
              {PILOT_USERS.length > 5 && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>+ {PILOT_USERS.length - 5} more</div>}
            </div>
            <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 8 }}>Duration</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontStyle: "italic" }}>{PILOT_PROPOSITION.durationNote}</div>
            </div>
          </div>
        </div>

        {/* ── OPERATING SYSTEMS ── */}
        <div id="operating-systems" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>03 · Operating Systems</SectionLabel>
          <H2>Pilot operating systems</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            The pilot activates three lead operating systems and uses Safety and Guest Welfare as a cross-cutting control. Marketplace and Loyalty is an expansion operating system — not activated for one initial hotel property.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PILOT_OPERATING_SYSTEMS.map(pos => {
              const os = TRAVEL_OPERATING_SYSTEMS.find(o => o.id === pos.id);
              const roleColor = pos.role === "primary-wedge" ? C.gold : pos.role === "cross-cutting-control" ? "#ef4444" : "rgba(255,255,255,0.25)";
              const roleLabel = pos.role === "primary-wedge" ? "Primary wedge" : pos.role === "cross-cutting-control" ? "Cross-cutting control" : "Expansion — not in initial pilot";
              return (
                 <div key={pos.id} className="rtbx-responsive-card-header" style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${roleColor}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{os?.name ?? pos.id}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{pos.note}</div>
                  </div>
                  <div style={{ padding: "3px 9px", fontSize: 11, fontWeight: 700, color: roleColor, border: `1px solid ${roleColor}50`, flexShrink: 0 }}>{roleLabel}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SCENARIOS ── */}
        <div id="scenarios" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>04 · Scenarios</SectionLabel>
          <H2>Pilot scenarios</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            Three primary end-to-end scenarios, with one optional fourth. All scenarios use the existing Sprint 4 simulation environment.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PILOT_SCENARIOS.map(ps => {
              const sc = TRAVEL_SCENARIOS.find(s => s.id === ps.scenarioId);
              return (
                 <div key={ps.scenarioId} className="rtbx-responsive-card-header" style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${ps.role === "primary" ? C.gold : "rgba(255,255,255,0.2)"}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{sc?.title ?? ps.scenarioId}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{ps.note}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ padding: "3px 9px", fontSize: 11, fontWeight: 700, color: ps.role === "primary" ? C.gold : "rgba(255,255,255,0.3)", border: `1px solid ${ps.role === "primary" ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)"}` }}>
                      {ps.role === "primary" ? "PRIMARY" : "OPTIONAL"}
                    </div>
                    <Link href={travelScenarioPath(ps.scenarioId)}>
                      <div style={{ padding: "3px 9px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>VIEW →</div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PILOT COMPONENTS ── */}
        <div id="pilot-components" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>05 · Components</SectionLabel>
          <H2>Pilot components</H2>
           <div className="rtbx-responsive-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2 }}>
            {DEPLOYMENT_PACKAGE.filter(p => !p.productionOnly).map(pkg => (
              <div key={pkg.id} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 10 }}>{pkg.name}</div>
                {pkg.items.map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color: C.gold, marginRight: 6 }}>◦</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── DELIVERY STAGES ── */}
        <div id="delivery-stages" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>06 · Delivery Stages</SectionLabel>
          <H2>Explore → Align → Configure → Pilot → Prove → Deploy → Expand</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 20 }}>
            Seven delivery stages from initial exploration to production deployment and expansion. Each stage has defined activities, outputs, owner groups and readiness requirements.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PILOT_STAGES.map((stage, i) => (
              <details key={stage.id} open={i < 3} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${i < 5 ? C.gold : "rgba(255,255,255,0.2)"}` }}>
                <summary style={{ padding: "14px 20px", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.gold, flexShrink: 0 }}>
                    {stage.label}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{stage.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{stage.purpose}</div>
                  </div>
                </summary>
                 <div className="rtbx-responsive-grid-2" style={{ padding: "0 20px 18px 62px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px 20px" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Activities</div>
                    {stage.activities.map((a, j) => <div key={j} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", padding: "2px 0" }}>· {a}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Outputs</div>
                    {stage.outputs.map((o, j) => <div key={j} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", padding: "2px 0" }}>· {o}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Owner groups</div>
                    {stage.ownerGroups.map((o, j) => <div key={j} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", padding: "2px 0" }}>· {o}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Readiness requirements</div>
                    {stage.readinessRequirements.map((r, j) => <div key={j} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", padding: "2px 0" }}>· {r}</div>)}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ── SUCCESS FRAMEWORK ── */}
        <div id="success-framework" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>07 · Success Framework</SectionLabel>
          <H2>Pilot success framework</H2>
          <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", margin: 0, lineHeight: 1.65 }}>
              This framework identifies the measures to be agreed during alignment. No performance results are invented. Target types indicate how each measure will be established.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {(Object.entries({
              "customer-baseline": "Customer baseline",
              "pilot-target":      "Pilot target",
              "indicative-target": "Indicative target",
              "to-be-agreed":      "To be agreed",
              "not-yet-measured":  "Not yet measured",
            }) as [SuccessMeasureTargetType, string][]).map(([status, label]) => (
              <div key={status} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: TARGET_COLORS[status] }} />
                {label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {measureCategories.map(cat => {
              const measures = PILOT_SUCCESS_MEASURES.filter(m => m.category === cat);
              return (
                <div key={cat}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{cat} measures</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {measures.map(m => (
                       <div key={m.id} className="rtbx-responsive-card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <div>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.68)" }}>{m.label}</span>
                          {m.note && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", fontStyle: "italic", marginLeft: 8 }}>{m.note}</span>}
                        </div>
                        <div style={{ padding: "2px 8px", fontSize: 11, fontWeight: 700, color: TARGET_COLORS[m.targetType], border: `1px solid ${TARGET_COLORS[m.targetType]}50`, flexShrink: 0 }}>
                          {m.targetType.replace(/-/g, " ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── READINESS CHECKLIST ── */}
        <div id="readiness-checklist" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>08 · Readiness</SectionLabel>
          <H2>Pilot readiness checklist</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 12 }}>
            Click any item to cycle its readiness state. This is a working interactive assessment tool — no data is saved between sessions.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {(Object.entries(READINESS_STATE_LABELS) as [ReadinessState, string][]).map(([state, label]) => (
              <div key={state} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: READINESS_COLORS[state] }} />{label}
              </div>
            ))}
          </div>
           <div className="rtbx-responsive-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            {categories.map(cat => (
              <div key={cat}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cat} readiness</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {READINESS_CHECKLIST.filter(i => i.category === cat).map(item => {
                    const state = readinessStates[item.id];
                    return (
                      <div
                        key={item.id}
                        className="rtbx-responsive-card-header"
                        onClick={() => setReadinessStates(prev => ({ ...prev, [item.id]: nextState(prev[item.id]) }))}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderLeft: `3px solid ${READINESS_COLORS[state]}`, cursor: "pointer" }}
                      >
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: READINESS_COLORS[state], flexShrink: 0 }} />
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", flex: 1 }}>{item.label}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: READINESS_COLORS[state], flexShrink: 0 }}>{READINESS_STATE_LABELS[state]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRODUCTION BOUNDARY ── */}
        <div id="production-boundary" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>09 · Production Boundary</SectionLabel>
          <H2>Production engineering boundary</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            The pilot proves the operating model and governance approach. Moving from pilot to production requires additional engineering that is outside the pilot scope.
          </p>
          {DEPLOYMENT_PACKAGE.filter(p => p.productionOnly).map(pkg => (
            <div key={pkg.id} style={{ padding: "18px 20px", background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.2)", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#f97316", marginBottom: 6 }}>{pkg.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", fontStyle: "italic", marginBottom: 10 }}>{pkg.productionNote}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {pkg.items.map((item, i) => (
                  <div key={i} style={{ padding: "4px 10px", fontSize: 11, color: "rgba(255,255,255,0.52)", border: "1px solid rgba(255,255,255,0.1)" }}>{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── EXPANSION PATHWAY ── */}
        <div id="expansion-pathway" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>10 · Expansion</SectionLabel>
          <H2>Expansion pathway after pilot proof</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 20 }}>
            Seven expansion stages after the pilot is proven. Each stage has a defined maturity gate before activation.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {EXPANSION_STAGES.map((stage, i) => (
              <div key={stage.id} style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${i === 0 ? C.gold : "rgba(255,255,255,0.12)"}` }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{stage.label}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>{stage.description}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                  {stage.examples.map((ex, j) => (
                    <div key={j} style={{ padding: "2px 8px", fontSize: 11, color: "rgba(255,255,255,0.48)", border: "1px solid rgba(255,255,255,0.08)" }}>{ex}</div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", fontStyle: "italic" }}>Gate: {stage.maturityGate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── NEXT STEP ── */}
        <div id="next-step" style={{ marginBottom: 40, scrollMarginTop: 90 }}>
          <SectionLabel>11 · Engage</SectionLabel>
          <H2>Design a pilot</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 700, marginBottom: 24 }}>
            Ready to scope the first pilot? A Pilot Design Session defines the environment, operating systems, scenarios, roles, governance and success measures before configuration begins.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/partner-room/next-step#pilot-design">
              <div style={{ padding: "12px 22px", background: C.gold, fontSize: 12, fontWeight: 700, color: "#080c14", cursor: "pointer" }}>Design a Pilot →</div>
            </Link>
            <Link href="/partner-room/pilot-model#readiness-checklist">
              <div style={{ padding: "12px 22px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>Review Pilot Readiness →</div>
            </Link>
            <Link href="/partner-room/build-configure">
              <div style={{ padding: "12px 22px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.52)", cursor: "pointer" }}>Try Build & Configure →</div>
            </Link>
          </div>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Partner Ecosystem", href: "/partner-room/partner-ecosystem" },
            { label: "Commercial Pathway", href: "/partner-room/commercial" },
            { label: "Execution Centre", href: "/partner-room/operations" },
            { label: "Travel Operating Systems", href: "/partner-room/travel-operating-systems" },
          ].map(b => <Link key={b.href} href={b.href}><div style={{ padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.48)", cursor: "pointer" }}>{b.label} →</div></Link>)}
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
