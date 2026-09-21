/**
 * PartnerDeployments.tsx — Sprint 5
 *
 * Deployment environments page.
 * Hotels and resorts are the primary initial market.
 * Holiday parks and hotel groups are secondary expansion.
 * Corporate travel, events and destinations are future environments.
 *
 * Does not present every environment as equally deployment-ready.
 */

import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)", gold: "#c9a84c", green: "#10b981", blue: "#3b82f6" };

function SectionLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>;
}
function H2({ children }: { children: string }) {
  return <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>{children}</h2>;
}

const PRIMARY_ENVS = [
  {
    id: "hotels-resorts",
    name: "Hotels and Resorts",
    category: "Primary deployment environment",
    color: C.gold,
    readiness: "Pilot-ready",
    summary: "The first JALDO Travel pilot is designed for a hotel or resort environment with existing PMS, housekeeping, task, guest messaging and CRM systems. JALDO connects these systems, governs moment response, coordinates staff action and captures evidence and outcomes.",
    signalExamples: ["PMS room status and reservation events", "Housekeeping task queue", "Guest messaging and preference signals", "Maintenance defect reports", "Loyalty tier and stay history"],
    operatingSystems: ["Guest Experience OS", "Service Recovery and Staff Response OS", "Operator Intelligence OS"],
    pilotScenarios: ["Repeat guest — room not ready", "Service backlog", "Maintenance defect"],
    typicalRoles: ["General Manager", "Duty Manager", "Front Office", "Guest Services", "Housekeeping", "Maintenance"],
    demoHref: "/partner-room/deployments/hotels-resorts/demo",
  },
  {
    id: "multi-property-hotel-groups",
    name: "Multi-Property Hotel Groups",
    category: "Secondary expansion",
    color: "#10b981",
    readiness: "Architecturally defined",
    summary: "After a property pilot is proven, JALDO Travel can expand to additional properties within the same group. Multi-property deployment adds regional operations visibility, group-level pattern detection and cross-property playbook improvement.",
    signalExamples: ["Group PMS and reservation aggregation", "Regional operations signals", "Group-level maintenance and defect data"],
    operatingSystems: ["Guest Experience OS", "Service Recovery OS", "Operator Intelligence OS", "Expanding to Safety and Welfare OS"],
    pilotScenarios: ["All pilot scenarios expanded across properties"],
    typicalRoles: ["Regional Operations", "Group Operations", "All property roles"],
    demoHref: "/partner-room/deployments/hotels-resorts/demo",
  },
];

const SECONDARY_ENVS = [
  {
    id: "holiday-parks",
    name: "Holiday Parks",
    category: "Secondary expansion",
    color: "#3b82f6",
    readiness: "Expansion pathway",
    summary: "The JALDO operating model is applicable to holiday parks — guest arrivals, accommodation readiness, activity coordination and service recovery. The core scenario and playbook framework applies with environment-specific configuration. This is an expansion pathway after hotel pilot proof.",
    signalExamples: ["Cabin and accommodation status", "Activity and facility booking signals", "Guest arrival and departure events"],
    note: "Holiday parks are a secondary expansion environment. Initial pilot focus is hotels and resorts.",
  },
];

const FUTURE_ENVS = [
  {
    id: "corporate-travel",
    name: "Corporate Travel",
    summary: "Traveller disruption management, booking change coordination and employer duty-of-care signals. Future environment — not in the initial deployment scope.",
    color: "rgba(255,255,255,0.3)",
  },
  {
    id: "events-venues",
    name: "Events and Venues",
    summary: "Event operations, delegate experience coordination, service recovery and safety protocols. Future environment — requires event-specific signal and playbook configuration.",
    color: "rgba(255,255,255,0.3)",
  },
  {
    id: "destination-tourism",
    name: "Destination Tourism",
    summary: "Broader destination experience coordination across accommodation, transport and activity providers. Long-term ecosystem expansion — requires multi-party governance and commercial agreements.",
    color: "rgba(255,255,255,0.3)",
  },
];

export default function PartnerDeployments() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>JALDO Travel · Deployment Environments</SectionLabel>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 14, maxWidth: 760 }}>
            JALDO Travel Deployment Environments
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700, marginBottom: 20 }}>
            One core intelligence and governance model — configurable for different Travel environments. JALDO Travel leads with hotels and resorts. Other environments are expansion pathways after pilot proof.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {[
              { label: "Hotels & resorts", color: C.gold, note: "Primary — pilot-ready" },
              { label: "Hotel groups", color: C.green, note: "Secondary — expansion" },
              { label: "Holiday parks", color: C.blue, note: "Secondary — expansion" },
              { label: "Corporate / Events / Destination", color: "rgba(255,255,255,0.3)", note: "Future environment" },
            ].map(item => (
              <div key={item.label} style={{ padding: "6px 14px", fontSize: 9.5, fontWeight: 700, color: item.color, border: `1px solid ${item.color}50`, background: `${item.color}08` }}>
                {item.label} <span style={{ fontWeight: 400, fontSize: 9, opacity: 0.7 }}>— {item.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ARCHITECTURE NOTE ── */}
        <div style={{ padding: "14px 18px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.2)", marginBottom: 40 }}>
          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: C.gold }}>One core, configurable for context.</strong> The JALDO Intelligence Engine, six intelligence layers, Decision Spine and Execution Centre are the same across all environments. What changes is the signal configuration, scenario library, playbook content and role model — each aligned to the specific operational context.
          </p>
        </div>

        {/* ── PRIMARY ENVIRONMENTS ── */}
        <div id="primary" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>01 · Primary</SectionLabel>
          <H2>Hotels and resorts — primary deployment environment</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 20 }}>
            The first JALDO Travel pilot targets hotels and resorts. This is the environment with the clearest operational signal availability, most established governance requirements and most direct commercial pathway.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PRIMARY_ENVS.map(env => (
              <div key={env.id} style={{ padding: "22px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${env.color}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 8.5, color: env.color, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>{env.category}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{env.name}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                    <div style={{ padding: "4px 10px", fontSize: 9, fontWeight: 700, color: env.color, border: `1px solid ${env.color}40` }}>{env.readiness}</div>
                    <Link href={env.demoHref}>
                      <div style={{ padding: "6px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>View demo →</div>
                    </Link>
                  </div>
                </div>
                <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7, marginBottom: 16, maxWidth: 800 }}>{env.summary}</p>
                <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 16px" }}>
                  <div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Signal examples</div>
                    {env.signalExamples.map((s, i) => <div key={i} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.55)", padding: "2px 0" }}>· {s}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Operating systems</div>
                    {env.operatingSystems.map((s, i) => <div key={i} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.55)", padding: "2px 0" }}>· {s}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Typical pilot roles</div>
                    {env.typicalRoles.map((r, i) => <div key={i} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.55)", padding: "2px 0" }}>· {r}</div>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECONDARY ENVIRONMENTS ── */}
        <div id="secondary" style={{ marginBottom: 56, scrollMarginTop: 90 }}>
          <SectionLabel>02 · Secondary</SectionLabel>
          <H2>Secondary expansion environments</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            These environments are appropriate for JALDO Travel expansion after hotel pilot proof. They are not primary deployment environments and are not presented as equally deployment-ready.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SECONDARY_ENVS.map(env => (
              <div key={env.id} style={{ padding: "18px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${env.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{env.name}</div>
                  <div style={{ padding: "3px 9px", fontSize: 8.5, fontWeight: 700, color: env.color, border: `1px solid ${env.color}40` }}>{env.readiness}</div>
                </div>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.65, marginBottom: 8 }}>{env.summary}</p>
                {env.note && <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{env.note}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── FUTURE ENVIRONMENTS ── */}
        <div id="future" style={{ marginBottom: 48, scrollMarginTop: 90 }}>
          <SectionLabel>03 · Future</SectionLabel>
          <H2>Future environments</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, maxWidth: 760, marginBottom: 16 }}>
            These environments are longer-term opportunities that share common JALDO architecture but require environment-specific configuration, signal mapping and commercial agreements. They are not in the initial deployment scope.
          </p>
          <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {FUTURE_ENVS.map(env => (
              <div key={env.id} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", opacity: 0.7 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>{env.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{env.summary}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Pilot Model", href: "/partner-room/pilot-model" },
            { label: "Rollout Model", href: "/partner-room/rollout-model" },
            { label: "Build & Configure", href: "/partner-room/build-configure" },
          ].map(b => <Link key={b.href} href={b.href}><div style={{ padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>)}
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
