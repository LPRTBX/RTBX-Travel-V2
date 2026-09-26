import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import {
  TRAVEL_OPERATING_SYSTEMS,
  TRAVEL_SPECIALIST_EXTENSIONS,
  TRAVEL_HIERARCHY_STAGES,
  TRAVEL_ROLE_COLUMNS,
  TRAVEL_DEPLOYMENT_PHASES,
  TRAVEL_DEPLOYMENT_STATEMENT,
  TRAVEL_EXPANSION_STATEMENT,
  OS_POSITION_LABELS,
  OS_POSITION_COLORS,
  type TravelOSPosition,
} from "@/data/travelOperatingSystems";
import { MATURITY_LABELS, MATURITY_COLORS, type MaturityStatus } from "@/data/travelScenarios";
import { CURRENT_PROOF_BOUNDARY } from "@/lib/proofLanguage";

const C = { gold: "#a8dedb", muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)" };

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{children}</div>
);

const H2 = ({ children }: { children: string }) => (
  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 10 }}>{children}</h2>
);

const FieldRow = ({ label, items }: { label: string; items: string[] }) => (
  <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 12, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{label}</div>
    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.6 }}>{items.join(" · ")}</div>
  </div>
);

function PositionBadge({ position }: { position: TravelOSPosition }) {
  const color = OS_POSITION_COLORS[position];
  const label = OS_POSITION_LABELS[position];
  return (
    <span style={{
      fontSize: 7.5, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
      color, border: `1px solid ${color}45`, background: `${color}10`,
      padding: "2px 8px", display: "inline-block", marginLeft: 8,
    }}>
      {label}
    </span>
  );
}

function MaturityBadge({ status }: { status: MaturityStatus }) {
  const color = MATURITY_COLORS[status];
  const label = MATURITY_LABELS[status];
  return (
    <span style={{
      fontSize: 7.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
      color, border: `1px solid ${color}40`, background: `${color}0d`,
      padding: "2px 8px", display: "inline-block", marginLeft: 8,
    }}>
      {label}
    </span>
  );
}

function OsCatalogueSection({
  title,
  subtitle,
  oses,
  openId,
  setOpenId,
}: {
  title: string;
  subtitle: string;
  oses: typeof TRAVEL_OPERATING_SYSTEMS;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {oses.map(os => {
          const isOpen = openId === os.id;
          return (
            <div key={os.id} id={os.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${os.color}`, scrollMarginTop: 90 }}>
              <div
                onClick={() => setOpenId(isOpen ? null : os.id)}
                style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14.5, fontWeight: 800, color: "#fff" }}>{os.name}</span>
                    <PositionBadge position={os.position} />
                    <MaturityBadge status={os.maturityStatus} />
                  </div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>{os.problem}</div>
                </div>
                <div style={{ fontSize: 16, color: os.color, flexShrink: 0, marginLeft: 16 }}>{isOpen ? "\u2212" : "+"}</div>
              </div>
              {isOpen && (
                <div style={{ padding: "0 22px 22px" }}>
                  <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `2px solid ${os.color}`, marginBottom: 14 }}>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{os.purpose}</p>
                  </div>
                  <FieldRow label="Primary users" items={os.primaryUsers} />
                  <FieldRow label="Governance" items={os.governanceSources.length > 0 ? os.governanceSources : os.governance} />
                  {os.scenarioIds.length > 0 && <FieldRow label="Linked scenarios" items={os.scenarioIds} />}
                  {os.playbookIds.length > 0 && <FieldRow label="Linked playbooks" items={os.playbookIds} />}
                  <FieldRow label="Input systems" items={os.inputSystems} />
                  <FieldRow label="Signals" items={os.signals} />
                  <FieldRow label="Moments" items={os.moments} />
                  <FieldRow label="Draft actions" items={os.actions} />
                  <FieldRow label="Illustrative outcomes" items={os.outcomes} />
                  {os.evidenceRequirements.length > 0 && <FieldRow label="Evidence required" items={os.evidenceRequirements.slice(0, 3)} />}
                  {os.outcomeMetrics.length > 0 && <FieldRow label="Proposed metrics" items={os.outcomeMetrics.slice(0, 3)} />}
                  <FieldRow label="Pilot entry" items={[os.pilotEntryPoint]} />
                  <FieldRow label="Expansion pathway" items={[os.expansionPathway]} />

                  <div style={{ marginTop: 16 }}>
                     <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Proposed Modules</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {os.modules.map(m => (
                        <div key={m} style={{ padding: "6px 12px", fontSize: 10.5, color: "rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.02)", border: `1px solid ${os.color}33` }}>
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PartnerTravelOperatingSystems() {
  const [openId, setOpenId] = useState<string | null>(TRAVEL_OPERATING_SYSTEMS[0].id);

  const leadOses = TRAVEL_OPERATING_SYSTEMS.filter(os => os.position === "lead");
  const crossCuttingOses = TRAVEL_OPERATING_SYSTEMS.filter(os => os.position === "cross-cutting");
  const expansionOses = TRAVEL_OPERATING_SYSTEMS.filter(os => os.position === "expansion");

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionLabel>Travel Intelligence</SectionLabel>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 16, maxWidth: 760 }}>
            JALDO Travel Operating Systems
          </h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 720 }}>
            Proposed operating-system configurations modelled on one shared JALDO Core — prioritised for future pilot learning and potential commercial relevance.
          </p>
        </div>

        {/* ── WORKING PROOF BOUNDARY ── */}
        <div style={{ padding: "18px 22px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.24)", borderLeft: "3px solid #3b82f6", marginBottom: 40 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#60a5fa", marginBottom: 8 }}>
            Working Proof / Simulation
          </div>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, margin: 0 }}>
            {CURRENT_PROOF_BOUNDARY.notice} Current data is synthetic; classifications and suggestions are rules-based drafts only. There is no dispatch, incident coordination, commercial delivery or external-system update. All proposed actions require approval and execution by a named accountable person. Outcomes and value remain unmeasured.
          </p>
        </div>

        {/* ── POSITIONING ── */}
        <div style={{ padding: "18px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #a8dedb", marginBottom: 40 }}>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0, fontWeight: 600 }}>
            JALDO Core provides the proposed shared architecture. JALDO Travel models how tailored operating systems could extend it. Each configuration groups vertical-specific modules around a major hotel or travel operating problem.
          </p>
        </div>

        {/* ── OS PRIORITY OVERVIEW ── */}
        <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, marginBottom: 40 }}>
          {[
            { label: "Lead Operating Systems", desc: "Three proposed OS configurations for consideration in a future Travel pilot.", position: "lead" as TravelOSPosition, color: "#3b82f6", count: leadOses.length },
            { label: "Cross-Cutting Control", desc: "Safety and Guest Welfare is modelled across every OS; any threshold would require named human review.", position: "cross-cutting" as TravelOSPosition, color: "#ef4444", count: crossCuttingOses.length },
            { label: "Expansion Capability", desc: "Marketplace and Loyalty is planned only after trust, signals and governance are evidenced.", position: "expansion" as TravelOSPosition, color: "#a8dedb", count: expansionOses.length },
          ].map(item => (
            <div key={item.label} style={{ padding: "20px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${item.color}` }}>
              <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: item.color, marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{item.count}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* ── CROSS-CUTTING NOTICE ── */}
        <div style={{ padding: "14px 20px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)", borderLeft: "3px solid #ef4444", marginBottom: 32 }}>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0 }}>
            <strong style={{ color: "#ef4444" }}>Safety and Guest Welfare controls are proposed across all Travel operating systems.</strong> In a future deployment, a modelled risk, distress, vulnerability or human-impact threshold would pause commercial suggestions and require assessment, approval and action by a named accountable person. This simulation does not dispatch welfare checks or coordinate incidents.
          </p>
        </div>

        {/* ── EXPANSION NOTICE ── */}
        <div style={{ padding: "14px 20px", background: "rgba(168,222,219,0.04)", border: "1px solid rgba(168,222,219,0.18)", borderLeft: "3px solid #a8dedb", marginBottom: 40 }}>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: 0 }}>
            <strong style={{ color: "#a8dedb" }}>Marketplace and Loyalty Activation is a planned expansion capability</strong> — not a current pilot entry point. Future use would depend on evidenced signal accuracy, operational adoption, customer permission, governance and approved response workflows. Current offers, referrals and bookings are illustrative drafts; nothing is delivered or confirmed externally.
          </p>
        </div>

        {/* ── CATALOGUE ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Catalogue</SectionLabel>
          <H2>Travel Operating Systems</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 28, maxWidth: 760 }}>
            {TRAVEL_OPERATING_SYSTEMS.length} operating systems organised by position. Expand any system to see its full purpose, users, governance, scenarios, playbooks, evidence requirements, outcome metrics and rollout path.
          </p>

          <OsCatalogueSection
            title="Lead Operating Systems"
            subtitle="These three proposed OSes are candidates for a future Travel pilot and model high-volume operating problems."
            oses={leadOses}
            openId={openId}
            setOpenId={setOpenId}
          />

          <OsCatalogueSection
            title="Cross-Cutting Control"
            subtitle="Safety and Guest Welfare is a proposed control for every Travel OS; modelled thresholds require named human assessment and do not trigger dispatch."
            oses={crossCuttingOses}
            openId={openId}
            setOpenId={setOpenId}
          />

          <OsCatalogueSection
            title="Expansion Capability"
            subtitle="Marketplace and Loyalty Activation is planned only after lead OSes are evidenced and would not lead an initial pilot."
            oses={expansionOses}
            openId={openId}
            setOpenId={setOpenId}
          />
        </div>

        {/* ── How a Travel OS is Built ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionLabel>Architecture Pattern</SectionLabel>
          <H2>How a Travel Operating System Is Built</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 24, maxWidth: 700 }}>
            Each proposed Travel Operating System models three layers combined. No OS is represented as a standalone production platform; each would depend on future JALDO Core capabilities and Travel Intelligence configuration.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 20 }}>
            {[
              { label: "JALDO Core", sub: "Signal-to-action infrastructure", color: "#a8dedb", bg: "rgba(168,222,219,0.08)" },
              { label: "+", sub: "", color: "rgba(255,255,255,0.3)", bg: "transparent", border: "none" },
              { label: "Travel Intelligence Pack", sub: "Signals, moments, governance, playbooks", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
              { label: "+", sub: "", color: "rgba(255,255,255,0.3)", bg: "transparent", border: "none" },
              { label: "Property Configuration", sub: "Modules, roles, channels, rules", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
              { label: "=", sub: "", color: "rgba(255,255,255,0.3)", bg: "transparent", border: "none" },
              { label: "Travel Operating System", sub: "Purpose-built for a hotel problem domain", color: "#a8dedb", bg: "rgba(168,222,219,0.12)", highlight: true },
            ].map((item, i) => (
              item.sub === "" ? (
                <div key={i} style={{ fontSize: 22, fontWeight: 300, color: item.color }}>{item.label}</div>
              ) : (
                <div key={i} style={{
                  padding: "14px 18px", background: item.bg,
                  border: `1px solid ${(item as any).highlight ? "#a8dedb" : "rgba(255,255,255,0.1)"}`,
                  borderLeft: (item as any).highlight ? "3px solid #a8dedb" : undefined,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)" }}>{item.sub}</div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* ── HIERARCHY VISUAL ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Hierarchy</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            {TRAVEL_HIERARCHY_STAGES.map((stage, i, arr) => (
              <div key={stage} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  padding: "9px 14px", fontSize: 10.5, fontWeight: 700,
                  color: i === 0 ? "#102d39" : "rgba(255,255,255,0.65)",
                  background: i === 0 ? "#a8dedb" : "rgba(255,255,255,0.03)",
                  border: i === 0 ? "1px solid #a8dedb" : "1px solid rgba(255,255,255,0.1)",
                }}>
                  {stage}
                </div>
                {i < arr.length - 1 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ── OPTIONAL SPECIALIST EXTENSIONS ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Future / Optional</SectionLabel>
          <H2>Specialist Extensions</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 700 }}>
            Shown as future/optional extensions, not core operating systems — proposed only for properties or portfolios with the matching operating context.
          </p>
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
            {TRAVEL_SPECIALIST_EXTENSIONS.map(ext => (
              <div key={ext.id} style={{ padding: "16px 18px", background: "rgba(255,255,255,0.015)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>{ext.name}</div>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.15)", padding: "2px 6px" }}>Future</div>
                </div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>{ext.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MODULE MATRIX ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Coverage</SectionLabel>
          <H2>Module Matrix</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 700 }}>
            Which operating systems serve each role.
          </p>
          <div className="rtbx-table-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 820 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 8.5 }}>Operating System</th>
                  <th style={{ textAlign: "left", padding: "8px 10px", color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 8.5 }}>Position</th>
                  {TRAVEL_ROLE_COLUMNS.map(role => (
                    <th key={role} style={{ textAlign: "center", padding: "8px 10px", color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 8.5 }}>{role}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRAVEL_OPERATING_SYSTEMS.map(os => (
                  <tr key={os.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px", fontWeight: 700, color: os.color, whiteSpace: "nowrap" }}>{os.name}</td>
                    <td style={{ padding: "10px", fontSize: 9.5, color: OS_POSITION_COLORS[os.position], fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {OS_POSITION_LABELS[os.position]}
                    </td>
                    {TRAVEL_ROLE_COLUMNS.map(role => (
                      <td key={role} style={{ padding: "10px", textAlign: "center", color: os.primaryUsers.includes(role) ? os.color : "rgba(255,255,255,0.12)", fontWeight: 700 }}>
                        {os.primaryUsers.includes(role) ? "\u25CF" : "\u00B7"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DEPLOYMENT LOGIC ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>Rollout</SectionLabel>
          <H2>Deployment Logic</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 700 }}>
            {TRAVEL_DEPLOYMENT_STATEMENT}
          </p>
          <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 20 }}>
            {TRAVEL_DEPLOYMENT_PHASES.map(p => (
              <div key={p.phase} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: C.gold, marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.phase}</div>
                {p.operatingSystems.map(os => (
                  <div key={os} style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", marginBottom: 8, lineHeight: 1.5 }}>{os}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ padding: "18px 22px", background: "rgba(168,222,219,0.05)", border: "1px solid rgba(168,222,219,0.2)", borderLeft: "3px solid #a8dedb" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0, fontWeight: 600 }}>
              {TRAVEL_EXPANSION_STATEMENT}
            </p>
          </div>
        </div>

        {/* ── FOOTER LINKS ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Travel Intelligence",       href: "/partner-room/travel-intelligence" },
            { label: "Connection Map",            href: "/partner-room/resources/travel-systems-map" },
            { label: "Build / Configure",         href: "/partner-room/build-configure" },
            { label: "Operating Model",           href: "/partner-room/operating-model" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
