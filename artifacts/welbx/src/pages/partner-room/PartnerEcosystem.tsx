/**
 * PartnerEcosystem.tsx — Sprint 5
 *
 * Canonical partner ecosystem page for RTBX Travel.
 *
 * Sources from travelPartnerEcosystem.ts and travelDeploymentPathway.ts.
 * No named partner relationship is represented as confirmed.
 * All partnership descriptions are indicative.
 */

import { useEffect } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import {
  TRAVEL_PARTNER_LANES,
  RTBX_OWNED_CAPABILITIES,
  CUSTOMER_OWNED_CAPABILITIES,
  PARTNER_OWNERSHIP_MATRIX,
  PARTNER_SELECTION_CRITERIA,
  PARTNERSHIP_PATHWAY_STAGES,
  type TravelPartnerLane,
  type PartnerMaturityStatus,
} from "@/data/travelPartnerEcosystem";
import {
  INTEGRATION_RECORDS,
  DEPLOYMENT_RESPONSIBILITIES,
  INTEGRATION_MATURITY_LABELS,
  INTEGRATION_MATURITY_COLORS,
  type IntegrationMaturity,
} from "@/data/travelDeploymentPathway";
import { PARTNER_COMMERCIAL_MODELS } from "@/data/travelCommercialModel";

// ── Style constants ───────────────────────────────────────────────────────────

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.28)", gold: "#c9a84c", green: "#10b981", blue: "#3b82f6", red: "#ef4444", purple: "#a78bfa" };

const MATURITY_COLORS: Record<PartnerMaturityStatus, string> = {
  "planned":        "rgba(255,255,255,0.3)",
  "in-development": "#3b82f6",
  "demonstrated":   "#c9a84c",
  "pilot-ready":    "#10b981",
  "production":     "#10b981",
};

const LANE_COLORS: Record<string, string> = {
  "signal-partners":       "#3b82f6",
  "governance-partners":   "#a78bfa",
  "intervention-partners": "#f97316",
  "technology-partners":   "#c9a84c",
  "deployment-partners":   "#10b981",
  "distribution-partners": "rgba(255,255,255,0.5)",
};

function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 11, letterSpacing: "0.16em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>;
}
function H2({ children }: { children: string }) {
  return <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10, lineHeight: 1.25 }}>{children}</h2>;
}
function MTag({ status }: { status: PartnerMaturityStatus }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", color: MATURITY_COLORS[status], border: `1px solid ${MATURITY_COLORS[status]}50` }}>
      {status.replace(/-/g, " ").toUpperCase()}
    </div>
  );
}

function LaneCard({ lane }: { lane: TravelPartnerLane }) {
  const color = LANE_COLORS[lane.id] ?? C.gold;
  return (
    <div id={lane.id} style={{ scrollMarginTop: 90, marginBottom: 2 }}>
      <details open style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${color}` }}>
        <summary style={{ padding: "18px 22px", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{lane.name}</div>
            <div style={{ fontSize: 12, color: C.muted, maxWidth: 680 }}>{lane.summary.split(".")[0]}.</div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <MTag status={lane.maturityStatus} />
          </div>
        </summary>
        <div style={{ padding: "0 22px 22px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px 16px", marginBottom: 16 }}>
            {[
              { title: "Partner contributes", items: lane.partnerContribution, c: color },
              { title: "RTBX contributes",    items: lane.rtbxContribution,    c: C.gold },
              { title: "Customer contributes", items: lane.customerContribution, c: "rgba(255,255,255,0.5)" },
            ].map(col => (
              <div key={col.title} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: `1px solid ${col.c}20` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: col.c, marginBottom: 8 }}>{col.title}</div>
                {col.items.map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", lineHeight: 1.5 }}>
                    <span style={{ color: col.c, marginRight: 6 }}>◦</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Partner types</div>
              {lane.partnerTypes.map((t, i) => <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", padding: "2px 0" }}>· {t}</div>)}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Commercial models (indicative)</div>
              {lane.commercialModels.map((m, i) => <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.52)", padding: "2px 0" }}>· {m}</div>)}
            </div>
          </div>

          <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.38)", fontStyle: "italic" }}>
            {lane.maturityNote}
          </div>
        </div>
      </details>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PartnerEcosystem() {
  useEffect(() => {
    const go = () => {
      const h = window.location.hash.slice(1);
      if (h) document.getElementById(h)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>RTBX Travel · Partner Ecosystem</SectionLabel>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.15, marginBottom: 14, maxWidth: 760 }}>
            RTBX Travel Partner Ecosystem
          </h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 700, marginBottom: 20 }}>
            RTBX Travel is designed to operate within an ecosystem of partners — not as a standalone replacement for existing systems. This page defines how signal, governance, intervention, technology, deployment and distribution partners contribute alongside RTBX and the customer.
          </p>
          <div style={{ padding: "12px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.42)", fontStyle: "italic" }}>
            No named partnership relationship on this page is represented as confirmed or active unless explicitly stated. All partnership structures are indicative models. Commercial terms are subject to agreement.
          </div>
        </div>

        {/* ── WHY AN ECOSYSTEM MODEL ── */}
        <div id="why-ecosystem" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>01 · Model</SectionLabel>
          <H2>Why RTBX uses an ecosystem model</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, maxWidth: 760, marginBottom: 20 }}>
            Hotels and resorts already have systems — property management, housekeeping, guest messaging, maintenance, loyalty. RTBX does not replace them. RTBX connects them: assembling context, applying governance, activating playbooks, coordinating accountable action, capturing evidence and measuring outcomes.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 16 }}>
            {[
              { label: "Signal partners", desc: "Provide the operational signals RTBX needs to detect moments", color: LANE_COLORS["signal-partners"] },
              { label: "Governance partners", desc: "Provide the policies and standards that shape RTBX decision rules", color: LANE_COLORS["governance-partners"] },
              { label: "Intervention partners", desc: "Deliver the services RTBX triggers when a moment is identified", color: LANE_COLORS["intervention-partners"] },
              { label: "Technology partners", desc: "Provide the technical infrastructure that supports RTBX deployment", color: LANE_COLORS["technology-partners"] },
              { label: "Deployment partners", desc: "Implement, configure and support RTBX within the customer environment", color: LANE_COLORS["deployment-partners"] },
              { label: "Distribution partners", desc: "Provide market access and channel reach to hotel operators", color: LANE_COLORS["distribution-partners"] },
            ].map(item => (
              <div key={item.label} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${item.color}` }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SIX PARTNER LANES ── */}
        <div id="partner-lanes" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>02 · Partner Lanes</SectionLabel>
          <H2>Six partner lanes</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 20 }}>
            Each lane defines what the partner contributes, what RTBX contributes, what the customer contributes, and the commercial model options available. Expand a lane to see the full structure.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TRAVEL_PARTNER_LANES.map(lane => <LaneCard key={lane.id} lane={lane} />)}
          </div>
        </div>

        {/* ── WHAT RTBX OWNS ── */}
        <div id="rtbx-ownership" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>03 · RTBX Ownership</SectionLabel>
          <H2>What RTBX owns</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            RTBX owns the intelligence, governance and execution layer — not the underlying customer systems, source data or third-party services.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {RTBX_OWNED_CAPABILITIES.map((cap, i) => (
              <div key={i} style={{ padding: "10px 14px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)", fontSize: 12, color: "rgba(255,255,255,0.72)" }}>
                <span style={{ color: C.gold, marginRight: 8, fontWeight: 700 }}>◦</span>{cap}
              </div>
            ))}
          </div>
        </div>

        {/* ── WHAT CUSTOMER OWNS ── */}
        <div id="customer-ownership" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>04 · Customer Ownership</SectionLabel>
          <H2>What the customer owns</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            RTBX supports accountable human operations rather than removing customer control. The customer retains authority over all systems, data, policies and deployment decisions.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {CUSTOMER_OWNED_CAPABILITIES.map((cap, i) => (
              <div key={i} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "rgba(255,255,255,0.68)" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", marginRight: 8, fontWeight: 700 }}>◦</span>{cap}
              </div>
            ))}
          </div>
        </div>

        {/* ── WHAT THE PARTNER OWNS ── */}
        <div id="partner-ownership" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>05 · Partner Ownership</SectionLabel>
          <H2>What the partner owns</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            The answer depends on partner type. The matrix below summarises ownership across all six partner lanes.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {["Partner type", "Partner owns", "RTBX owns", "Customer owns"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 14px", color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PARTNER_OWNERSHIP_MATRIX.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "#fff" }}>{row.partnerType}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{row.partnerOwns}</td>
                    <td style={{ padding: "10px 14px", color: C.gold }}>{row.rtbxOwns}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.52)" }}>{row.customerOwns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── INTEGRATION RESPONSIBILITY ── */}
        <div id="integration-responsibility" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>06 · Integration Responsibility</SectionLabel>
          <H2>Integration responsibility matrix</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 8 }}>
            Every integration has a defined ownership, maturity and proof status. Connector-ready status is only claimed where the approved proof standard is met. No production integration is presented where it does not exist.
          </p>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginBottom: 16 }}>
            Maturity: {(["planned","mapped","mocked","tested","integrated","production"] as IntegrationMaturity[]).map(m => (
              <span key={m} style={{ color: INTEGRATION_MATURITY_COLORS[m], marginRight: 10, fontStyle: "normal", fontWeight: 700 }}>{INTEGRATION_MATURITY_LABELS[m]}</span>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {INTEGRATION_RECORDS.map(rec => (
              <details key={rec.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${INTEGRATION_MATURITY_COLORS[rec.maturity]}` }}>
                <summary style={{ padding: "12px 18px", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginRight: 12 }}>{rec.system}</span>
                    {rec.provider && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.42)" }}>{rec.provider}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <div style={{ padding: "2px 8px", fontSize: 11, fontWeight: 700, color: INTEGRATION_MATURITY_COLORS[rec.maturity], border: `1px solid ${INTEGRATION_MATURITY_COLORS[rec.maturity]}40` }}>
                      {INTEGRATION_MATURITY_LABELS[rec.maturity]}
                    </div>
                  </div>
                </summary>
                <div style={{ padding: "0 18px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                  <div style={{ gridColumn: "1/-1", fontSize: 12, color: C.muted, marginBottom: 8 }}>{rec.purpose}</div>
                  {[
                    ["Signals received", rec.signalsReceived.join("; ")],
                    ["Actions sent", rec.actionsSent.length ? rec.actionsSent.join("; ") : "None currently"],
                    ["Interface", rec.interfaceType],
                    ["Authentication owner", rec.authenticationOwner],
                    ["Mapping owner", rec.mappingOwner],
                    ["Customer responsibility", rec.customerResponsibility],
                    ["Partner responsibility", rec.partnerResponsibility],
                    ["RTBX responsibility", rec.rtbxResponsibility],
                    ["Failure owner", rec.failureOwner],
                    ["Proof", rec.proof === "none" ? "None" : rec.proof],
                  ].map(([label, val]) => (
                    <div key={label} style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", lineHeight: 1.55 }}>
                      <span style={{ color: "rgba(255,255,255,0.32)", fontWeight: 700 }}>{label}: </span>{val}
                    </div>
                  ))}
                  {rec.maturityNote && (
                    <div style={{ gridColumn: "1/-1", marginTop: 6, padding: "8px 12px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.38)", fontStyle: "italic" }}>
                      {rec.maturityNote}
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ── DEPLOYMENT RESPONSIBILITY ── */}
        <div id="deployment-responsibility" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>07 · Deployment Responsibility</SectionLabel>
          <H2>Deployment responsibility</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            Responsibilities across RTBX, customer, technology partner, deployment partner and intervention partner for each stage of deployment.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {DEPLOYMENT_RESPONSIBILITIES.map(act => (
              <details key={act.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <summary style={{ padding: "11px 18px", cursor: "pointer", listStyle: "none", fontSize: 13, fontWeight: 700, color: "#fff" }}>{act.label}</summary>
                <div style={{ padding: "0 18px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px" }}>
                  {[
                    ["RTBX", act.rtbx, C.gold],
                    ["Customer", act.customer, "rgba(255,255,255,0.6)"],
                    ["Technology partner", act.technologyPartner, "#3b82f6"],
                    ["Deployment partner", act.deploymentPartner, "#10b981"],
                    ["Intervention partner", act.interventionPartner, "#f97316"],
                  ].map(([label, val, color]) => (
                    <div key={String(label)} style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", lineHeight: 1.6 }}>
                      <span style={{ color: color as string, fontWeight: 700 }}>{label}: </span>{val}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ── COMMERCIAL MODEL OPTIONS ── */}
        <div id="commercial-models" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>08 · Commercial Models</SectionLabel>
          <H2>Partner commercial model options</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            Credible commercial structures for each partner type. No agreement is confirmed unless stated. All models are indicative or subject to proposal.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {PARTNER_COMMERCIAL_MODELS.map(model => (
              <div key={model.id} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{model.partnerType}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>{model.summary}</div>
                <div style={{ marginBottom: 10 }}>
                  {model.potentialModels.map((m, i) => (
                    <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color: C.gold, marginRight: 6 }}>◦</span>{m}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", fontStyle: "italic" }}>{model.statusNote}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PARTNER SELECTION CRITERIA ── */}
        <div id="selection-criteria" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>09 · Selection Criteria</SectionLabel>
          <H2>Partner selection criteria</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            What makes a strong RTBX Travel partner.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {PARTNER_SELECTION_CRITERIA.map(cat => (
              <div key={cat.id} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.gold, marginBottom: 10, letterSpacing: "0.02em" }}>{cat.label}</div>
                {cat.criteria.map((c, i) => (
                  <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.68)", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color: C.gold, marginRight: 8 }}>◦</span>{c}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── PARTNERSHIP PATHWAY ── */}
        <div id="partnership-pathway" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>10 · Pathway</SectionLabel>
          <H2>Partnership pathway</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 20 }}>
            The journey from initial identification to active partnership.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {PARTNERSHIP_PATHWAY_STAGES.map((stage, i) => (
              <div key={stage.id} style={{ flex: "1 1 180px", padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${i === 0 ? C.gold : "rgba(255,255,255,0.12)"}` }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{stage.label}</div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, lineHeight: 1.5 }}>{stage.description}</div>
                {stage.actions.map((a, j) => <div key={j} style={{ fontSize: 11, color: "rgba(255,255,255,0.48)", padding: "2px 0" }}>· {a}</div>)}
              </div>
            ))}
          </div>
        </div>

        {/* ── NEXT STEP ── */}
        <div id="next-step" style={{ marginBottom: 40, scrollMarginTop: 90 }}>
          <SectionLabel>11 · Engage</SectionLabel>
          <H2>Explore a partner model</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 700, marginBottom: 24 }}>
            The right conversation depends on your partner type and what you're trying to solve. Choose the engagement that fits.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/partner-room/next-step">
              <div style={{ padding: "12px 22px", background: C.gold, fontSize: 12, fontWeight: 700, color: "#080c14", cursor: "pointer" }}>Explore a Partner Model →</div>
            </Link>
            <Link href="/partner-room/partner-ecosystem#integration-responsibility">
              <div style={{ padding: "12px 22px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>Review Responsibilities →</div>
            </Link>
          </div>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Pilot Model", href: "/partner-room/pilot-model" },
            { label: "Commercial Pathway", href: "/partner-room/commercial" },
            { label: "Next Step", href: "/partner-room/next-step" },
            { label: "Build & Configure", href: "/partner-room/build-configure" },
          ].map(b => <Link key={b.href} href={b.href}><div style={{ padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.48)", cursor: "pointer" }}>{b.label} →</div></Link>)}
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
