/**
 * PartnerRolloutModel.tsx — Sprint 5
 *
 * Rollout model page aligned to canonical four-stage pathway:
 * Pilot property → Proven property model → Multi-property deployment → Additional operating systems → Partner ecosystem expansion
 *
 * Clearly separates: Demonstration / Pilot / Production deployment / Scale deployment.
 */

import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { EXPANSION_STAGES } from "@/data/travelPilotModel";

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", gold: "#a8dedb", green: "#10b981", blue: "#3b82f6", red: "#ef4444" };

function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>;
}
function H2({ children }: { children: string }) {
  return <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>{children}</h2>;
}

const STAGES = [
  {
    id: "demonstration",
    label: "Demonstration",
    sublabel: "What exists today",
    color: "#3b82f6",
    description: "JALDO Travel is working in an interactive simulation environment. Deployment configuration, scenario execution, governance, evidence and outcomes can all be demonstrated without a live hotel connection.",
    includes: [
      "Interactive Build & Configure flow",
      "All six scenarios running end-to-end",
      "Operator, Guest and Dual View",
      "Evidence capture and outcome recording",
      "Learning output generation",
      "Synthetic signal data — no live system connected",
    ],
    excludes: [
      "Live system integrations",
      "Production data or guest records",
      "Staff adoption",
    ],
    cta: { label: "Try Build & Configure →", href: "/partner-room/build-configure" },
  },
  {
    id: "pilot",
    label: "Pilot",
    sublabel: "Controlled working deployment",
    color: C.gold,
    description: "A controlled pilot at one to five hotel properties, running agreed scenarios with real staff participation. Signals come from actual or mapped source systems. Evidence and outcomes are captured and reviewed against agreed success measures.",
    includes: [
      "One to five properties — one hotel group",
      "Three lead operating systems activated",
      "Three primary scenarios end-to-end",
      "Real staff roles and governance rules",
      "Agreed evidence and outcome framework",
      "Synthetic or manual signal sources — not full production integrations",
    ],
    excludes: [
      "Production system connectors (unless specifically approved)",
      "Enterprise authentication",
      "Multi-tenant data controls",
      "Production monitoring and SLAs",
    ],
    cta: { label: "Design a Pilot →", href: "/partner-room/next-step#pilot-design" },
  },
  {
    id: "production-deployment",
    label: "Production Deployment",
    sublabel: "Approved live environment",
    color: C.green,
    description: "After the pilot is proven, production deployment replaces synthetic signal sources with approved connectors, implements authentication and data controls, and establishes a supported operational environment.",
    includes: [
      "Approved production integrations",
      "Enterprise authentication and access control",
      "Production communication dispatch",
      "Durable audit and evidence storage",
      "Support model and service levels",
      "Expanded user base",
    ],
    excludes: [
      "Cross-property data sharing without appropriate controls",
      "Marketplace activation without approved governance",
    ],
    cta: { label: "See Production Boundary →", href: "/partner-room/pilot-model#production-boundary" },
  },
  {
    id: "scale-deployment",
    label: "Scale Deployment",
    sublabel: "Multi-property, partner ecosystem",
    color: "#a78bfa",
    description: "Scale deployment adds properties, operating systems, partner services and — where commercially approved — marketplace and loyalty activation. Cross-property learning is introduced only with appropriate data controls and governance.",
    includes: [
      "Multi-property rollout",
      "Additional operating systems",
      "Partner ecosystem activation",
      "Cross-property operational intelligence",
      "Marketplace and Loyalty Activation (where approved)",
      "Learning model improvement from multi-property evidence",
    ],
    excludes: [
      "Automatic data sharing across customers",
      "Unapproved commercial arrangements",
    ],
    cta: { label: "See Expansion Pathway →", href: "/partner-room/pilot-model#expansion-pathway" },
  },
];

export default function PartnerRolloutModel() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>JALDO Travel · Rollout Model</SectionLabel>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 14, maxWidth: 760 }}>
            JALDO Travel Rollout Model
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700, marginBottom: 20 }}>
            From a working demonstration, through a controlled pilot, to production deployment and multi-property scale. Each stage has a clear boundary. Do not describe a previous stage as the next one.
          </p>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
            {STAGES.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ padding: "6px 14px", fontSize: 9.5, fontWeight: 700, color: s.color, border: `1px solid ${s.color}50`, background: `${s.color}08` }}>{s.label}</div>
                {i < STAGES.length - 1 && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", padding: "0 4px" }}>→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── FOUR STAGES ── */}
        <div id="rollout-stages" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>01 · Stages</SectionLabel>
          <H2>Four rollout stages</H2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {STAGES.map(stage => (
              <div key={stage.id} style={{ padding: "22px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `4px solid ${stage.color}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 8.5, color: stage.color, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 3 }}>{stage.sublabel}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{stage.label}</div>
                  </div>
                  <Link href={stage.cta.href}>
                    <div style={{ padding: "6px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", cursor: "pointer", flexShrink: 0 }}>{stage.cta.label}</div>
                  </Link>
                </div>
                <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7, marginBottom: 16, maxWidth: 760 }}>{stage.description}</p>
                <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
                  <div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Includes</div>
                    {stage.includes.map((item, i) => (
                      <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", padding: "2px 0" }}>
                        <span style={{ color: stage.color, marginRight: 6 }}>✓</span>{item}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Does not include</div>
                    {stage.excludes.map((item, i) => (
                      <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", padding: "2px 0" }}>
                        <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 6 }}>·</span>{item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EXPANSION PATHWAY ── */}
        <div id="expansion" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>02 · Expansion</SectionLabel>
          <H2>Expansion after production deployment</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            Seven expansion stages after the pilot is proven. Each requires a defined maturity gate before activation.
          </p>
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {EXPANSION_STAGES.map((stage, i) => (
              <div key={stage.id} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${i === 0 ? C.gold : "rgba(255,255,255,0.12)"}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", marginBottom: 5 }}>{stage.label}</div>
                <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.6, marginBottom: 6 }}>{stage.description}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>Gate: {stage.maturityGate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Pilot Model", href: "/partner-room/pilot-model" },
            { label: "Deployments", href: "/partner-room/deployments" },
            { label: "Explore a Design Partnership", href: "/partner-room/next-step" },
          ].map(b => <Link key={b.href} href={b.href}><div style={{ padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>)}
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
