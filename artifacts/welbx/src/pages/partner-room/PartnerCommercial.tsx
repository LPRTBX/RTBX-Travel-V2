/**
 * PartnerCommercial.tsx — Sprint 5
 *
 * Canonical commercial pathway page for RTBX Travel.
 *
 * Sources from travelCommercialModel.ts.
 * Every commercial figure or claim identifies its source status.
 * No approved pricing is invented. Unapproved figures are clearly labelled.
 * This is not the Revenue Model or Commercial Unit page — those remain as controlled appendices.
 */

import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import {
  COMMERCIAL_COMPONENTS,
  PARTNER_COMMERCIAL_MODELS,
  VALUE_FRAMEWORK,
  COMMERCIAL_PROOF_BOUNDARIES,
  COMMERCIAL_STATUS_LABELS,
  COMMERCIAL_STATUS_COLORS,
  SOURCE_STATUS_LABELS,
  UNAPPROVED_STATUSES,
  VALID_COMMERCIAL_STATUSES,
  type CommercialStatus,
  type CommercialSourceStatus,
} from "@/data/travelCommercialModel";

// ── Style constants ───────────────────────────────────────────────────────────

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", gold: "#c9a84c", green: "#10b981", blue: "#3b82f6", red: "#ef4444" };

function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>;
}
function H2({ children }: { children: string }) {
  return <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>{children}</h2>;
}

function StatusBadge({ status }: { status: CommercialStatus }) {
  const isWarning = UNAPPROVED_STATUSES.includes(status);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", fontSize: 8.5, fontWeight: 700, color: COMMERCIAL_STATUS_COLORS[status], border: `1px solid ${COMMERCIAL_STATUS_COLORS[status]}50`, background: `${COMMERCIAL_STATUS_COLORS[status]}08` }}>
      {isWarning && "⚠ "}{COMMERCIAL_STATUS_LABELS[status]}
    </div>
  );
}

function SourceBadge({ status }: { status: CommercialSourceStatus }) {
  const COLORS: Record<CommercialSourceStatus, string> = {
    "customer-provided":    "#10b981",
    "rtbx-approved":        "#10b981",
    "partner-provided":     "#3b82f6",
    "external-source":      "#3b82f6",
    "indicative-assumption":"#c9a84c",
    "demonstration-input":  "#c9a84c",
    "pilot-target":         "#a78bfa",
    "unapproved":           "#ef4444",
    "to-be-validated":      "rgba(255,255,255,0.35)",
  };
  return (
    <div style={{ fontSize: 8, fontWeight: 700, color: COLORS[status], letterSpacing: "0.06em" }}>
      {SOURCE_STATUS_LABELS[status].toUpperCase()}
    </div>
  );
}

export default function PartnerCommercial() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>RTBX Travel · Commercial Pathway</SectionLabel>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 14, maxWidth: 760 }}>
            RTBX Travel Commercial Pathway
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700, marginBottom: 20 }}>
            The commercial journey follows the operating model: Explore → Align → Configure → Pilot → Prove → Deploy → Expand. Each stage has a defined commercial structure.
          </p>
          <div style={{ padding: "12px 18px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            Every commercial component on this page identifies its source and approval status. Figures labelled as indicative or subject to proposal are not commitments. No approved pricing is shown. Contact RTBX directly for a commercial proposal.
          </div>
        </div>

        {/* ── COMMERCIAL PRINCIPLES ── */}
        <div id="commercial-principles" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>01 · Principles</SectionLabel>
          <H2>Commercial principles</H2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {[
              { title: "Staged entry", desc: "Commercial engagement begins with alignment and discovery, not a full platform commitment. Customers prove value before scaling." },
              { title: "Transparent assumptions", desc: "Every figure or estimate identifies its source status. Indicative assumptions are clearly labelled. No figure is presented as an approved commitment unless confirmed." },
              { title: "Configurable structure", desc: "Commercial components are not all mandatory. The right structure depends on the pilot scope, property count, operating systems and partner model." },
              { title: "Customer control", desc: "The customer retains authority over systems, data, governance and deployment decisions. RTBX commercial structure reflects this — the customer is not locked into a black-box platform." },
              { title: "Expansion logic", desc: "Value grows as deployment expands. The commercial model scales with operating systems, properties and partner services — not as an upfront commitment." },
              { title: "Partner-shared value", desc: "Where deployment or distribution partners are engaged, commercial terms are structured to reflect their contribution without creating channel conflict." },
            ].map(item => (
              <div key={item.title} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PILOT COMMERCIAL STRUCTURE ── */}
        <div id="pilot-structure" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>02 · Pilot Structure</SectionLabel>
          <H2>Pilot commercial structure</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            The pilot commercial structure covers alignment, configuration and execution across one to five properties. Components are not all mandatory — scope defines which apply.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {COMMERCIAL_COMPONENTS.filter(c => ["cc-alignment-discovery", "cc-configuration-implementation", "cc-platform-licence"].includes(c.id)).map(comp => (
              <div key={comp.id} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{comp.name}</div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <StatusBadge status={comp.status} />
                    <SourceBadge status={comp.sourceStatus} />
                  </div>
                </div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>{comp.summary}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {comp.appliesTo.map((a, i) => <div key={i} style={{ padding: "2px 8px", fontSize: 9, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>{a}</div>)}
                </div>
                {comp.note && <div style={{ marginTop: 8, fontSize: 9.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{comp.note}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── DEPLOYMENT STRUCTURE ── */}
        <div id="deployment-structure" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>03 · Deployment Structure</SectionLabel>
          <H2>Deployment commercial structure</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            After the pilot is proven, the commercial model extends to cover production integration, property licensing, managed intelligence and support.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {COMMERCIAL_COMPONENTS.filter(c => ["cc-property-deployment-licence", "cc-connector-integration", "cc-managed-intelligence", "cc-training-change"].includes(c.id)).map(comp => (
              <div key={comp.id} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{comp.name}</div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <StatusBadge status={comp.status} />
                    <SourceBadge status={comp.sourceStatus} />
                  </div>
                </div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>{comp.summary}</div>
                {comp.note && <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{comp.note}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── EXPANSION STRUCTURE ── */}
        <div id="expansion-structure" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>04 · Expansion Structure</SectionLabel>
          <H2>Expansion commercial structure</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            After production deployment, expansion adds operating systems, properties, partner services and — where commercially approved — marketplace and loyalty activation. These components carry higher uncertainty and are clearly labelled.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {COMMERCIAL_COMPONENTS.filter(c => ["cc-expansion-os-licence", "cc-partner-service-revenue", "cc-transaction-revenue-share"].includes(c.id)).map(comp => (
              <div key={comp.id} style={{ padding: "16px 20px", background: `${comp.sourceStatus === "unapproved" ? "rgba(239,68,68,0.03)" : "rgba(255,255,255,0.02)"}`, border: `1px solid ${comp.sourceStatus === "unapproved" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)"}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{comp.name}</div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <StatusBadge status={comp.status} />
                    <SourceBadge status={comp.sourceStatus} />
                  </div>
                </div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>{comp.summary}</div>
                {comp.note && <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{comp.note}</div>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                  {comp.appliesTo.map((a, i) => <div key={i} style={{ padding: "2px 8px", fontSize: 9, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>{a}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PARTNER COMMERCIAL MODELS ── */}
        <div id="partner-commercial-models" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>05 · Partner Models</SectionLabel>
          <H2>Partner commercial models</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            Credible commercial structures for each partner type. No agreement is confirmed unless stated. All models are indicative or subject to proposal.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {PARTNER_COMMERCIAL_MODELS.map(model => (
              <div key={model.id} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{model.partnerType}</div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>{model.summary}</div>
                {model.potentialModels.map((m, i) => (
                  <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color: C.gold, marginRight: 6 }}>◦</span>{m}
                  </div>
                ))}
                <div style={{ marginTop: 8, fontSize: 9, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{model.statusNote}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VALUE FRAMEWORK ── */}
        <div id="value-framework" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>06 · Value Framework</SectionLabel>
          <H2>Value framework</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            Every claimed value is linked to an evidence source, outcome metric, target status and maturity. No value is presented without these links. Pilot-dependent and not-yet-measured items are clearly labelled.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {VALUE_FRAMEWORK.map(cat => (
              <div key={cat.id}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "0.01em" }}>{cat.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {cat.items.map(item => (
                    <div key={item.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
                      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)" }}>{item.label}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{item.evidenceSource}</div>
                      <div>
                        <SourceBadge status={item.targetStatus} />
                      </div>
                      <div style={{ padding: "2px 7px", fontSize: 7.5, fontWeight: 700, color: item.maturity === "demonstrated" ? C.green : item.maturity === "architecturally-defined" ? C.blue : item.maturity === "pilot-dependent" ? C.gold : "rgba(255,255,255,0.25)", border: `1px solid ${item.maturity === "demonstrated" ? C.green : item.maturity === "architecturally-defined" ? C.blue : item.maturity === "pilot-dependent" ? C.gold : "rgba(255,255,255,0.1)"}50` }}>
                        {item.maturity.replace(/-/g, " ").toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ASSUMPTION STATUS ── */}
        <div id="assumption-status" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>07 · Assumptions</SectionLabel>
          <H2>Commercial assumption status</H2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {VALID_COMMERCIAL_STATUSES.map(status => (
              <div key={status} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: `1px solid ${COMMERCIAL_STATUS_COLORS[status]}40`, background: `${COMMERCIAL_STATUS_COLORS[status]}06` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COMMERCIAL_STATUS_COLORS[status] }} />
                <div style={{ fontSize: 10, fontWeight: 700, color: COMMERCIAL_STATUS_COLORS[status] }}>{COMMERCIAL_STATUS_LABELS[status]}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 760 }}>
            Subject-to-proposal, partner-specific and customer-specific components are not presented as mandatory or as approved commercial terms. Do not treat these as committed pricing. Contact RTBX for a specific commercial proposal.
          </p>
        </div>

        {/* ── PROOF BOUNDARIES ── */}
        <div id="proof-boundaries" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>08 · Proof Boundaries</SectionLabel>
          <H2>What is demonstrated vs. what requires production engineering</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            The site clearly distinguishes what is working today, what is architecturally defined, what depends on the pilot and what requires production engineering before commercial deployment.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {COMMERCIAL_PROOF_BOUNDARIES.map(cat => (
              <div key={cat.id} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${cat.color}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 10, color: cat.color }}>{cat.label}</div>
                {cat.items.map((item, i) => (
                  <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color: cat.color, marginRight: 6 }}>◦</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── WHAT IS INCLUDED / REQUIRES PROPOSAL ── */}
        <div id="included-vs-proposal" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>09 · Included vs Proposal</SectionLabel>
          <H2>What is included · What requires proposal</H2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <div style={{ padding: "16px 18px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.green, marginBottom: 10 }}>What is included in the pilot engagement</div>
              {["Discovery workshop and scope alignment", "Travel environment configuration", "Scenario and playbook activation", "Simulation and staff walkthrough", "Evidence and outcome framework", "Pilot support from RTBX", "Evidence and outcome review session"].map((item, i) => (
                <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: C.green, marginRight: 6 }}>✓</span>{item}
                </div>
              ))}
              <div style={{ marginTop: 8, fontSize: 9, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>Subject to scope and commercial proposal</div>
            </div>
            <div style={{ padding: "16px 18px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.gold, marginBottom: 10 }}>What requires a separate proposal</div>
              {["Production system integrations", "Enterprise authentication and security", "Production communication dispatch", "Durable audit and evidence storage", "Support and monitoring SLAs", "Multi-property deployment engineering", "Marketplace and Loyalty Activation"].map((item, i) => (
                <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: C.gold, marginRight: 6 }}>→</span>{item}
                </div>
              ))}
              <div style={{ marginTop: 8, fontSize: 9, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>Requires production engineering and commercial approval</div>
            </div>
          </div>
        </div>

        {/* ── NEXT STEP ── */}
        <div id="next-step" style={{ marginBottom: 40, scrollMarginTop: 90 }}>
          <SectionLabel>10 · Engage</SectionLabel>
          <H2>Define the commercial structure</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 700, marginBottom: 24 }}>
            Commercial structure is agreed during the Align stage — after the operating model and pilot scope are defined. The right conversation depends on your role and what you're trying to prove.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/partner-room/next-step">
              <div style={{ padding: "12px 22px", background: C.gold, fontSize: 11, fontWeight: 700, color: "#080c14", cursor: "pointer" }}>Define the Commercial Structure →</div>
            </Link>
            <Link href="#value-framework">
              <div style={{ padding: "12px 22px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>Review the Value Framework →</div>
            </Link>
            <Link href="/partner-room/proof-calculator">
              <div style={{ padding: "12px 22px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>Proof Calculator →</div>
            </Link>
          </div>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Pilot Model",       href: "/partner-room/pilot-model" },
            { label: "Partner Ecosystem", href: "/partner-room/partner-ecosystem" },
            { label: "Commercial Model",  href: "/partner-room/commercial-model" },
            { label: "Proof Calculator",  href: "/partner-room/proof-calculator" },
          ].map(b => <Link key={b.href} href={b.href}><div style={{ padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>)}
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
