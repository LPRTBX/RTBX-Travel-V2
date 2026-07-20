import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { INTELLIGENCE_LAYERS, CORE_CAPABILITIES } from "@/data/rtbxArchitecture";
import {
  TRAVEL_SIGNAL_TAXONOMY,
  TRAVEL_MOMENT_TAXONOMY,
  TRAVEL_GOVERNANCE_SOURCES,
  TRAVEL_ROLE_MODEL,
  TRAVEL_AI_ASSISTANT_MODEL,
  TRAVEL_OUTCOME_MODEL,
  TRAVEL_VALUE_MODEL,
  TRAVEL_INTEGRATION_MAP,
  type TravelSignalDomain,
} from "@/data/travelIntelligence";

const C = {
  gold: "#c9a84c", muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.28)",
  green: "#10b981", blue: "#3b82f6", purple: "#a78bfa", cyan: "#22d3ee", red: "#ef4444", orange: "#f97316",
};

const DOMAIN_COLOR: Record<TravelSignalDomain, string> = {
  "Guest Experience": C.blue,
  "Operations": C.green,
  "Safety & Welfare": C.red,
  "Commercial": C.gold,
  "Partner": C.purple,
};

const RISK_COLOR: Record<string, string> = { Low: C.green, Medium: C.gold, High: C.orange, Critical: C.red };

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ fontSize: 11, letterSpacing: "0.16em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>
);

const H2 = ({ children }: { children: string }) => (
  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10, lineHeight: 1.25 }}>{children}</h2>
);

const SYSTEMS_FLOW = ["Travel Signals", "Travel Moments", "Governed Playbooks", "Travel Roles", "Central Comms", "Actions", "Outcomes", "Travel Intelligence"];

const PACK_COMPONENTS = [
  { label: "Travel Signal Registry",  color: C.blue,   desc: "Every guest, staff, operator and system signal relevant to a travel environment, classified and scored.", href: "/partner-room/signals-engine" },
  { label: "Travel Moment Intelligence",    color: C.gold,   desc: "Recognises which of the known travel moment types a signal cluster belongs to. Travel configuration of the shared Context and Moment Layer.", href: "/partner-room/moments-economy" },
  { label: "Travel Governance",       color: C.purple, desc: "The pre-approved rules that decide what is allowed to happen in response to a moment.", href: "/partner-room/decision-spine" },
  { label: "Travel Playbook Library", color: C.green,  desc: "The response patterns available to a role owner once governance has cleared a moment.", href: "/partner-room/decision-spine" },
  { label: "Travel Role Routing",     color: C.cyan,   desc: "Ensures the right human role — never an autonomous system — owns the response.", href: "/partner-room/operator-demo" },
  { label: "Travel Central Comms & AI Assistants", color: C.orange, desc: "AI-assisted drafting and routing of the communication or instruction, with a human owner approving delivery.", href: "/partner-room/comms-demo" },
];

export default function PartnerIntelligenceModel() {
  const domains = Array.from(new Set(TRAVEL_SIGNAL_TAXONOMY.map(s => s.domain)));

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionLabel>Travel Intelligence</SectionLabel>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.15, marginBottom: 16, maxWidth: 760 }}>
            RTBX Travel Intelligence
          </h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 720 }}>
            The RTBX Core operating platform configured for guest, staff, operator and partner moments.
          </p>
        </div>

        {/* ── PACK COMPONENTS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 40 }}>
          {PACK_COMPONENTS.map(item => (
            <Link key={item.label} href={item.href}>
              <div style={{
                padding: "24px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${item.color}`, cursor: "pointer", transition: "all 0.15s", height: "100%",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: item.color, marginBottom: 10, letterSpacing: "0.02em" }}>{item.label}</div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Six-Layer Position Map */}
        <div style={{ marginBottom: 40 }}>
          <SectionLabel>Six-Layer Position Map</SectionLabel>
          <H2>Every Travel Element Mapped to the RTBX Core Architecture</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 24, maxWidth: 700 }}>
            Every capability in the Travel Intelligence Pack has a position in the RTBX Core six-layer architecture. Each item is labelled as Shared Core, Travel Configuration, or Property Configuration.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {INTELLIGENCE_LAYERS.map(layer => {
              const caps = CORE_CAPABILITIES.filter(c => c.layer === layer.id);
              return (
                <div key={layer.id} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{layer.label}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{layer.summary}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {caps.map(cap => (
                      <div key={cap.id} style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
                        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
                      }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.68)" }}>{cap.name}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
                          padding: "1px 5px",
                          color: cap.origin === "RTBX Core" ? "#c9a84c" : cap.origin === "Travel Configuration" ? "#3b82f6" : "#10b981",
                          border: `1px solid ${cap.origin === "RTBX Core" ? "rgba(201,168,76,0.3)" : cap.origin === "Travel Configuration" ? "rgba(59,130,246,0.3)" : "rgba(16,185,129,0.3)"}`,
                        }}>{cap.origin === "RTBX Core" ? "Shared Core" : cap.origin === "Travel Configuration" ? "Travel Config" : "Property Config"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Origin legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {[{ label: "Shared Core", color: "#c9a84c" }, { label: "Travel Config", color: "#3b82f6" }, { label: "Property Config", color: "#10b981" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, background: l.color, borderRadius: 1 }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 700, letterSpacing: "0.04em" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SHARED ARCHITECTURE STATEMENT ── */}
        <div style={{ padding: "18px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #c9a84c", marginBottom: 40 }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, margin: 0, fontWeight: 600 }}>
            The architecture is shared. Travel Intelligence changes what RTBX understands, recommends, communicates and measures inside the travel environment.
          </p>
        </div>

        {/* ── SYSTEMS AND HUMAN INPUTS FLOW ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Travel Systems and Human Inputs</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            {SYSTEMS_FLOW.map((step, i, arr) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  padding: "8px 13px", fontSize: 12, fontWeight: 700,
                  color: i === arr.length - 1 ? "#080c14" : "rgba(255,255,255,0.65)",
                  background: i === arr.length - 1 ? "#c9a84c" : "rgba(255,255,255,0.03)",
                  border: i === arr.length - 1 ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                }}>
                  {step}
                </div>
                {i < arr.length - 1 && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ── SIGNAL TAXONOMY ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Data Model · 01</SectionLabel>
          <H2>Travel Signal Taxonomy</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 700 }}>
            {TRAVEL_SIGNAL_TAXONOMY.length} representative signals across {domains.length} domains. The full configured library runs to hundreds of signal types per deployment — see the Signals Engine for live examples.
          </p>
          {domains.map(domain => (
            <div key={domain} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: DOMAIN_COLOR[domain], letterSpacing: "0.04em", marginBottom: 8 }}>{domain}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TRAVEL_SIGNAL_TAXONOMY.filter(s => s.domain === domain).map(s => (
                  <div key={s.id} title={s.description} style={{
                    padding: "6px 11px", fontSize: 12, color: "rgba(255,255,255,0.65)",
                    background: "rgba(255,255,255,0.02)", border: `1px solid ${DOMAIN_COLOR[domain]}33`,
                  }}>
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── MOMENT TAXONOMY ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Data Model · 02</SectionLabel>
          <H2>Travel Moment Taxonomy</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 700 }}>
            {TRAVEL_MOMENT_TAXONOMY.length} moment types. Each carries its own risk level, governance sources, playbooks, owner and AI boundary.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {TRAVEL_MOMENT_TAXONOMY.map(m => (
              <div key={m.id} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${RISK_COLOR[m.riskLevel]}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{m.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: RISK_COLOR[m.riskLevel], flexShrink: 0 }}>{m.riskLevel}</div>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", marginBottom: 10 }}>{m.valueAtStake}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.52)", marginBottom: 10 }}>
                  <div><span style={{ color: "rgba(255,255,255,0.3)" }}>Owner: </span>{m.primaryOwner}</div>
                  <div><span style={{ color: "rgba(255,255,255,0.3)" }}>Human approval: </span>{m.humanApprovalRequired ? "Required" : "Not required"}</div>
                  <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "rgba(255,255,255,0.3)" }}>Escalation: </span>{m.escalationThreshold}</div>
                  <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "rgba(255,255,255,0.3)" }}>Governance: </span>{m.governanceSources.join(", ")}</div>
                  <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "rgba(255,255,255,0.3)" }}>Playbooks: </span>{m.likelyPlaybooks.join(", ")}</div>
                  <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "rgba(255,255,255,0.3)" }}>AI may: </span>{m.aiSupportAllowed.join(", ")}</div>
                  <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "rgba(255,255,255,0.3)" }}>Outcomes: </span>{m.outcomeMeasures.join(", ")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GOVERNANCE SOURCES ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Data Model · 03</SectionLabel>
          <H2>Travel Governance Sources</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 700 }}>
            {TRAVEL_GOVERNANCE_SOURCES.length} governance sources gate every moment response before it reaches a human owner.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
            {TRAVEL_GOVERNANCE_SOURCES.map(g => (
              <div key={g.id} style={{ padding: "14px 18px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{g.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>{g.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROLE MODEL ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Data Model · 04</SectionLabel>
          <H2>Travel Role Model</H2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 700 }}>
            {TRAVEL_ROLE_MODEL.length} roles, each with a defined scope of sight, action, ownership and approval authority.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 1100 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {["Role", "Sees", "Can do", "Cannot do", "Owns", "Can approve", "Escalation trigger"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "rgba(255,255,255,0.38)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRAVEL_ROLE_MODEL.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px", fontWeight: 700, color: C.gold, whiteSpace: "nowrap" }}>{r.name}</td>
                    <td style={{ padding: "10px", color: "rgba(255,255,255,0.58)" }}>{r.sees}</td>
                    <td style={{ padding: "10px", color: "rgba(255,255,255,0.58)" }}>{r.canDo}</td>
                    <td style={{ padding: "10px", color: "rgba(255,255,255,0.42)" }}>{r.cannotDo}</td>
                    <td style={{ padding: "10px", color: "rgba(255,255,255,0.58)" }}>{r.owns}</td>
                    <td style={{ padding: "10px", color: "rgba(255,255,255,0.58)" }}>{r.canApprove}</td>
                    <td style={{ padding: "10px", color: "rgba(255,255,255,0.42)" }}>{r.triggersEscalation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── AI ASSISTANT MODEL / BOUNDARY ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Data Model · 05</SectionLabel>
          <H2>Travel AI Assistant Model</H2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 20 }}>
            <div style={{ padding: "20px 22px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.18)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", color: C.green, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>AI May</div>
              {TRAVEL_AI_ASSISTANT_MODEL.allowed.map(item => (
                <div key={item} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.72)" }}>
                  <span style={{ color: C.green }}>+</span>{item}
                </div>
              ))}
            </div>
            <div style={{ padding: "20px 22px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.18)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", color: C.red, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Requires Human Approval</div>
              {TRAVEL_AI_ASSISTANT_MODEL.requiresHumanApproval.map(item => (
                <div key={item} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.72)" }}>
                  <span style={{ color: C.red }}>—</span>{item}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "18px 22px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: "3px solid #c9a84c" }}>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0, fontWeight: 600 }}>
              {TRAVEL_AI_ASSISTANT_MODEL.statement}
            </p>
          </div>
        </div>

        {/* ── OUTCOME MODEL ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Data Model · 06</SectionLabel>
          <H2>Travel Outcome Model</H2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TRAVEL_OUTCOME_MODEL.map(o => (
              <div key={o.id} title={o.description} style={{ padding: "8px 13px", fontSize: 12, color: "rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {o.name}
              </div>
            ))}
          </div>
        </div>

        {/* ── VALUE MODEL ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Data Model · 07</SectionLabel>
          <H2>Travel Value Model</H2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {TRAVEL_VALUE_MODEL.map(cat => (
              <div key={cat.id} style={{ padding: "18px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.gold, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>{cat.label}</div>
                {cat.measures.map(m => (
                  <div key={m.id} style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", marginBottom: 7 }}>{m.name}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── INTEGRATION MAP ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Data Model · 08</SectionLabel>
          <H2>Travel Integration Map</H2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
            {TRAVEL_INTEGRATION_MAP.map(i => (
              <div key={i.id} style={{ padding: "14px 18px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{i.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>{i.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GOVERNED, NOT AUTONOMOUS ── */}
        <div style={{ padding: "20px 22px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", color: C.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Governed, Not Autonomous</div>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 }}>
            AI assists with classification, drafting and routing across every Travel Intelligence Pack component. It does not autonomously make safety, compensation, legal or welfare decisions — every response passes through Travel Governance to a named human role owner.
          </p>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Travel Operating Systems", href: "/partner-room/travel-operating-systems" },
            { label: "Operating Model",  href: "/partner-room/operating-model" },
            { label: "Connection Map",   href: "/partner-room/resources/travel-systems-map" },
            { label: "Architecture, Modelling & UX/QA", href: "/partner-room/resources/travel-architecture-modelling-ux-qa" },
            { label: "Role Views",       href: "/partner-room/operator-demo" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.48)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
