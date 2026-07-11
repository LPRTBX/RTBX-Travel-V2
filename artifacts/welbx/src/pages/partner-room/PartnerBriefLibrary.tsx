import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const RESOURCE_DOCS = [
  {
    label: "Partnership Overview",
    tag: "Strategy",
    color: "#c9a84c",
    desc: "What RTBX Travel is, who partners are, what they earn, and how the pilot-to-scale pathway works across all five deployment environments.",
    href: "/partner-room/resources/travel-partnership-overview",
    audience: "All Partners · First Briefing",
  },
  {
    label: "Business Plan",
    tag: "Strategy",
    color: "#c9a84c",
    desc: "Full RTBX Travel company logic — the problem, the solution, the product stack, the moats, the commercial model and the 3-year roadmap.",
    href: "/partner-room/resources/travel-business-plan",
    audience: "Strategic Partners · Funders",
  },
  {
    label: "GTM Plan",
    tag: "Strategy",
    color: "#c9a84c",
    desc: "Beachhead strategy, priority sequence across five environments, first 20 partner conversations and full pilot pathway timeline.",
    href: "/partner-room/resources/travel-gtm-plan",
    audience: "Commercial · Distribution Partners",
  },
  {
    label: "Commercial Case",
    tag: "Commercial",
    color: "#a78bfa",
    desc: "Category opportunity, revenue pathways, multiple moats and strategic exit analysis. Why RTBX Travel is commercially serious.",
    href: "/partner-room/resources/travel-commercial-case",
    audience: "Commercial Leads · Funders · Board",
  },
  {
    label: "Commercial Partnership Brief",
    tag: "Commercial",
    color: "#a78bfa",
    desc: "Seven revenue streams, five partner commercial models and pilot terms. Complete commercial structure for partner conversations.",
    href: "/partner-room/resources/travel-commercial-partnership-brief",
    audience: "Commercial Leads · Executives",
  },
  {
    label: "Revenue Model",
    tag: "Commercial",
    color: "#a78bfa",
    desc: "Indicative revenue streams with assumptions, per-environment economics and a 3-year forecast across platform, deployment, marketplace and intelligence layers.",
    href: "/partner-room/resources/travel-revenue-model",
    audience: "Finance · Funders · Executives",
  },
  {
    label: "UX Blueprint",
    tag: "Product",
    color: "#3b82f6",
    desc: "Role-based UX map — what each stakeholder (guest, staff, manager, exec, partner, funder) sees, does, captures and creates.",
    href: "/partner-room/resources/travel-ux-blueprint",
    audience: "Product · Technology · Commercial",
  },
  {
    label: "Systems Map",
    tag: "Product",
    color: "#3b82f6",
    desc: "Four head systems with all modules, RTBX Core infrastructure layer, and deployment environment coverage matrix.",
    href: "/partner-room/resources/travel-systems-map",
    audience: "Product · Technology · Operators",
  },
  {
    label: "Pilot Model",
    tag: "Operations",
    color: "#10b981",
    desc: "8-phase pilot pathway with week timing, outputs and governance. 8 success metrics with targets and why each matters.",
    href: "/partner-room/resources/travel-pilot-model",
    audience: "Operators · Commercial · Finance",
  },
  {
    label: "Demo Links",
    tag: "Demos",
    color: "#f97316",
    desc: "Clean directory of all interactive demos and live scenario tools. No static documents or placeholder links.",
    href: "/partner-room/resources/travel-demo-links",
    audience: "All Partners",
  },
  {
    label: "AI Intelligence Layer",
    tag: "Product",
    color: "#3b82f6",
    desc: "How RTBX Travel uses AI progressively across signal understanding, moment classification, risk and priority, decision support, communication, routing, pattern insights, marketplace activation and assurance reporting.",
    href: "/partner-room/resources/travel-ai-intelligence-layer",
    audience: "Product · Technology · Funders",
  },
  {
    label: "Architecture, Modelling, UX & QA",
    tag: "Product",
    color: "#3b82f6",
    desc: "The RTBX Travel operating architecture, data model, role-based UX model and QA approach across classification, privacy, assurance, integration and GitHub testing.",
    href: "/partner-room/resources/travel-architecture-modelling-ux-qa",
    audience: "Product · Technology · Engineering",
  },
  {
    label: "Commercial Unit",
    tag: "Commercial",
    color: "#a78bfa",
    desc: "How RTBX Travel is commercialised by property, portfolio or network — revenue layers from master platform agreement through to managed intelligence and partner revenue.",
    href: "/partner-room/commercial-unit",
    audience: "Commercial Leads · Executives",
  },
  {
    label: "Rollout Model",
    tag: "Operations",
    color: "#10b981",
    desc: "The rollout archetype — pilot properties through to network rollout, additional Operating Systems and portfolio intelligence. Illustrative, not a contracted commitment.",
    href: "/partner-room/rollout-model",
    audience: "Operators · Commercial · Partners",
  },
  {
    label: "Partner Ecosystem",
    tag: "Strategy",
    color: "#c9a84c",
    desc: "The seven partner roles around a licensed deployment — operator, integration, deployment, distribution, loyalty, marketplace and strategic vertical partners.",
    href: "/partner-room/partner-ecosystem",
    audience: "All Partners",
  },
];

const BRIEFINGS = [
  {
    label: "Executive Briefing",
    tag: "Executive",
    color: "#c9a84c",
    desc: "A concise executive narrative covering RTBX Travel's positioning, the operating problem it solves and the value it creates. Designed for a 5-minute briefing format.",
    href: "/partner-room/overview",
    audience: "C-Suite · Owners · Board",
  },
  {
    label: "Operator Brief",
    tag: "Operations",
    color: "#10b981",
    desc: "The core briefing for hotel, resort and park operators — system overview, deployment model, staff impact and value proof.",
    href: "/partner-room/operator-brief",
    audience: "Hotel · Resort · Park Operators",
  },
  {
    label: "Integration Brief",
    tag: "Technology",
    color: "#3b82f6",
    desc: "API-first integration guide for technology partners — PMS, POS, CRM, workforce and loyalty system connectivity.",
    href: "/partner-room/integration-brief",
    audience: "Technology Partners · IT Leads",
  },
  {
    label: "Signal Capture — How RTBX Collects Signals",
    tag: "Product",
    color: "#c9a84c",
    desc: "Seven signal sources, the signal-to-assurance pipeline, what is real for MVP vs pilot phase, and the four-stage deployment path. Honest, credible and commercially clear.",
    href: "/partner-room/product-proof/signal-capture",
    audience: "Partners · Operators · Funders",
  },
  {
    label: "Operator Deep Dive Walkthrough",
    tag: "Walkthrough",
    color: "#3b82f6",
    desc: "A detailed operator-level walkthrough of RTBX Core in a hotel or resort context — from signal detection through to resolution, assurance and learning.",
    href: "/story/operator-deep-dive",
    audience: "GMs · Operations Directors",
  },
  {
    label: "Holiday Parks & Outdoor Experiences",
    tag: "Environment",
    color: "#10b981",
    desc: "Sector-specific briefing for holiday park and outdoor experience operators — multi-site deployment, seasonal management and guest flow.",
    href: "/partner-room/holiday-park-demo",
    audience: "Parks · Outdoor Operators",
  },
];

const TAG_COLORS: Record<string, string> = {
  Strategy: "#c9a84c",
  Commercial: "#a78bfa",
  Product: "#3b82f6",
  Operations: "#10b981",
  Demos: "#f97316",
  Executive: "#c9a84c",
  Technology: "#3b82f6",
  Walkthrough: "#3b82f6",
  Environment: "#10b981",
};

function BriefCard({ brief }: { brief: { label: string; tag: string; color: string; desc: string; href: string; audience: string } }) {
  return (
    <Link href={brief.href}>
      <div style={{
        padding: "26px 22px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderTop: `2px solid ${brief.color}`,
        display: "flex", flexDirection: "column",
        cursor: "pointer", transition: "all 0.15s", height: "100%",
      }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = "rgba(255,255,255,0.12)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.02)"; el.style.borderColor = "rgba(255,255,255,0.06)"; }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", marginBottom: 12,
          fontSize: 7.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
          color: TAG_COLORS[brief.tag] || "rgba(255,255,255,0.3)",
          border: `1px solid ${TAG_COLORS[brief.tag] || "rgba(255,255,255,0.1)"}30`,
          padding: "2px 8px", alignSelf: "flex-start",
        }}>
          {brief.tag}
        </div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.35 }}>
          {brief.label}
        </div>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, flex: 1, marginBottom: 14 }}>
          {brief.desc}
        </p>
        <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>
          {brief.audience}
        </div>
        <div style={{ fontSize: 9, color: brief.color, fontWeight: 700, letterSpacing: "0.08em" }}>
          Open →
        </div>
      </div>
    </Link>
  );
}

export default function PartnerBriefLibrary() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Partner Room · Brief Library
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Brief Library
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 640 }}>
            Partner documents, resource pages and targeted briefings — each scoped for a specific audience and decision context.
            No placeholder pages. Every link opens a complete resource.
          </p>

          {/* Tag filter legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
            {Object.entries(TAG_COLORS).filter(([tag], i, arr) => arr.findIndex(([t]) => t === tag) === i).map(([tag, color]) => (
              <div key={tag} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 2, background: color }} />
                <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Resource Library */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Section 01</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 6 }}>RTBX Travel Resource Library</div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.65, maxWidth: 640, margin: 0 }}>
              Full planning and partner documents — business plan, commercial model, GTM strategy, systems map, pilot model and revenue model.
              Built for strategic partners, operators, funders and integration partners.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
            {RESOURCE_DOCS.map(doc => <BriefCard key={doc.label} brief={doc} />)}
          </div>
        </div>

        {/* Section 2: Briefings */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 8.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Section 02</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 6 }}>Targeted Briefings</div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.65, maxWidth: 640, margin: 0 }}>
              Audience-specific briefings — executive, operator, technology and environment-level. Each scoped to a specific decision context.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
            {BRIEFINGS.map(brief => <BriefCard key={brief.label} brief={brief} />)}
          </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
