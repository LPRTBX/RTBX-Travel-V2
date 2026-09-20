/**
 * PartnerNextStep.tsx — Sprint 5
 *
 * Canonical next-step engagement page.
 *
 * Four specific engagement options, each with:
 * - Intended audience
 * - Purpose
 * - What will be covered
 * - Required participants
 * - Expected output
 *
 * Does not use vague "Contact us" language as the only action.
 */

import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { Link } from "wouter";

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", gold: "#c9a84c", green: "#10b981", blue: "#3b82f6" };

function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>;
}

const ENGAGEMENTS = [
  {
    id: "design-partnership",
    label: "Primary",
    name: "Explore a Design Partnership",
    color: C.gold,
    tagline: "For operators and partners ready to shape the first governed Travel deployment",
    audience: "Executive sponsor, operating lead, technology lead and the accountable people who would own a pilot",
    purpose: "Explore whether a focused design partnership is the right path to define the first property, three scenarios, governance boundaries and evidence plan together.",
    covered: [
      "The first operational problem and property context",
      "Three initial scenarios and accountable role owners",
      "Synthetic Working Proof review and pilot evidence needs",
      "Integration assumptions, governance boundaries and responsibilities",
      "A practical 1–5-property cohort pathway",
    ],
    participants: ["Executive sponsor or decision-maker", "Operations or guest-experience lead", "Technology or systems contact", "RTBX Travel team"],
    output: "A shared design-partnership brief covering initial scope, responsibilities, proof boundaries and the decision path to a pilot",
    cta: { label: "Explore a Design Partnership →", href: "mailto:lance@rtbx.com.au?subject=Explore a Design Partnership — RTBX Travel" },
    primary: true,
  },
  {
    id: "operating-alignment",
    label: "01",
    name: "Operating Alignment Session",
    color: C.gold,
    tagline: "For operators wanting to identify the first use case",
    audience: "Chief Operating Officer, General Manager, Guest Experience Director, Operations Director",
    purpose: "Identify the right operational starting point for an RTBX Travel engagement. Understand the first moment, the first signal and the first operating-system wedge.",
    covered: [
      "Current operational challenges and signal availability",
      "RTBX operating model and intelligence engine overview",
      "First operating-system selection",
      "Initial scenario and role mapping",
      "What a pilot would look like for this environment",
    ],
    participants: ["Executive sponsor or decision-maker", "General Manager or operations lead", "Technology or systems contact"],
    output: "Operating model alignment summary, first scenario candidates, initial pilot scope",
    cta: { label: "Request an Operating Alignment Session →", href: "mailto:lance@rtbx.com.au?subject=Operating Alignment Session — RTBX Travel" },
    primary: false,
  },
  {
    id: "integration-technical",
    label: "02",
    name: "Integration and Technical Workshop",
    color: C.blue,
    tagline: "For technology or system partners",
    audience: "Technology or Systems Leader, Digital or Transformation Director, Systems Integrator, PMS or CRM partner team",
    purpose: "Map signal sources, interface types and integration maturity for a specific deployment environment. Define ownership, authentication and failure responsibilities.",
    covered: [
      "RTBX Integration Hub and signal mapping model",
      "Review of existing system interfaces",
      "Integration maturity classification (planned / mapped / mocked / tested)",
      "Signal-to-context assembly approach",
      "Authentication, data governance and failure ownership",
      "Connector feasibility and priority order",
    ],
    participants: ["Technical lead from RTBX", "IT or technology leader from customer", "PMS or source-system technical contact"],
    output: "Integration responsibility matrix, maturity map, priority connector list, technical scoping document",
    cta: { label: "Request an Integration and Technical Workshop →", href: "mailto:lance@rtbx.com.au?subject=Integration and Technical Workshop — RTBX Travel" },
    primary: false,
  },
  {
    id: "pilot-design",
    label: "03",
    name: "Pilot Design Session",
    color: C.green,
    tagline: "For a customer ready to define scope, roles, scenarios and outcomes",
    audience: "Executive sponsor, Pilot owner, General Manager, Guest Experience Director, Transformation lead",
    purpose: "Define the full pilot scope — environment, operating systems, scenarios, roles, governance, systems, success measures and readiness plan — before configuration begins.",
    covered: [
      "Pilot environment and property scope",
      "Operating system selection and activation order",
      "Scenario and playbook selection (from existing library)",
      "Role mapping and accountability structure",
      "Governance rules and approval requirements",
      "Systems and signal maturity assessment",
      "Success measures and evidence framework",
      "Pilot readiness checklist review",
    ],
    participants: ["Executive sponsor", "Pilot owner", "Operations and department heads", "Technology lead", "RTBX team"],
    output: "Signed pilot scope, governance alignment, role map, system maturity map, success measures, readiness plan",
    cta: { label: "Request a Pilot Design Session →", href: "mailto:lance@rtbx.com.au?subject=Pilot Design Session — RTBX Travel" },
    primary: false,
  },
  {
    id: "partner-model",
    label: "04",
    name: "Partner Model Discussion",
    color: "#a78bfa",
    tagline: "For distribution, delivery or intervention partners",
    audience: "Hotel technology consultants, systems integrators, distribution networks, intervention service providers, advisory firms",
    purpose: "Define the right partner lane, commercial model and engagement pathway for a distribution, implementation or intervention partner.",
    covered: [
      "RTBX partner ecosystem structure and six partner lanes",
      "Partner ownership and contribution model",
      "Commercial model options for your partner type",
      "First customer or pilot pathway",
      "Partner selection criteria review",
      "Partnership pathway stages",
    ],
    participants: ["Partner commercial or business development lead", "Technical contact where relevant", "RTBX partner team"],
    output: "Partner lane alignment, commercial model outline, first customer or pilot pathway, next steps for partnership formalisation",
    cta: { label: "Request a Partner Model Discussion →", href: "mailto:lance@rtbx.com.au?subject=Partner Model Discussion — RTBX Travel" },
    primary: false,
  },
];

export default function PartnerNextStep() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>RTBX Travel · Next Step</SectionLabel>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 14, maxWidth: 760 }}>
            Explore a Design Partnership
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700 }}>
            Start with a focused design partnership to define the first property, three scenarios, governance boundaries and evidence plan. If another structured conversation fits better, choose it below.
          </p>
        </div>

        {/* ── ENGAGEMENT QUICK NAV ── */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 48 }}>
          {ENGAGEMENTS.map(eng => (
            <a key={eng.id} href={`#${eng.id}`} style={{ textDecoration: "none" }}>
              <div style={{ padding: eng.primary ? "9px 16px" : "7px 14px", fontSize: 9.5, fontWeight: 700, color: eng.primary ? "#080c14" : eng.color, border: `1px solid ${eng.color}40`, background: eng.primary ? eng.color : `${eng.color}08`, cursor: "pointer" }}>
                {eng.primary ? "Explore a Design Partnership" : `${eng.label} ${eng.name}`}
              </div>
            </a>
          ))}
        </div>

        {/* ── ENGAGEMENTS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {ENGAGEMENTS.map(eng => (
            <div key={eng.id} id={eng.id} style={{ scrollMarginTop: 90, padding: eng.primary ? "34px 32px" : "28px 28px", background: eng.primary ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${eng.primary ? "rgba(201,168,76,0.36)" : "rgba(255,255,255,0.06)"}`, borderLeft: `4px solid ${eng.color}`, boxShadow: eng.primary ? "0 18px 44px rgba(0,0,0,0.24)" : "none" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${eng.color}12`, border: `1px solid ${eng.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: eng.color, flexShrink: 0 }}>
                  {eng.label}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{eng.name}</div>
                  <div style={{ fontSize: 11, color: eng.color, fontStyle: "italic" }}>{eng.tagline}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px 24px", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Intended audience</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{eng.audience}</div>
                </div>
                <div>
                  <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Purpose</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{eng.purpose}</div>
                </div>
                <div>
                  <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>What will be covered</div>
                  {eng.covered.map((item, i) => (
                    <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", padding: "2px 0" }}>
                      <span style={{ color: eng.color, marginRight: 6 }}>·</span>{item}
                    </div>
                  ))}
                </div>
                <div>
                  <div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Required participants</div>
                    {eng.participants.map((p, i) => (
                      <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", padding: "2px 0" }}>
                        <span style={{ color: "rgba(255,255,255,0.3)", marginRight: 6 }}>·</span>{p}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Expected output</div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{eng.output}</div>
                  </div>
                </div>
              </div>

              <a href={eng.cta.href} style={{ textDecoration: "none" }}>
                <div style={{ display: "inline-flex", alignItems: "center", padding: "10px 20px", background: `${eng.color}10`, border: `1px solid ${eng.color}40`, fontSize: 10, fontWeight: 700, color: eng.color, cursor: "pointer" }}>
                  {eng.cta.label}
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* ── WORKING PROOF ── */}
        <div style={{ marginTop: 48, padding: "22px 24px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Not ready for a conversation yet?</div>
          <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.65, marginBottom: 16 }}>
            Explore the working proof first. The Execution Centre, Build & Configure and the scenario library are all available to try directly.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/partner-room/operations"><div style={{ padding: "9px 18px", background: C.gold, fontSize: 10, fontWeight: 700, color: "#080c14", cursor: "pointer" }}>Try the Execution Centre →</div></Link>
            <Link href="/partner-room/build-configure"><div style={{ padding: "9px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.65)", cursor: "pointer" }}>Build & Configure →</div></Link>
            <Link href="/partner-room/pilot-model"><div style={{ padding: "9px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", cursor: "pointer" }}>Review the Pilot Model →</div></Link>
          </div>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Partner Ecosystem", href: "/partner-room/partner-ecosystem" },
            { label: "Pilot Model", href: "/partner-room/pilot-model" },
            { label: "Commercial Pathway", href: "/partner-room/commercial" },
          ].map(b => <Link key={b.href} href={b.href}><div style={{ padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>)}
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
