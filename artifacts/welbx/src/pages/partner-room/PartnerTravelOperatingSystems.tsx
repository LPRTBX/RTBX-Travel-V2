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
} from "@/data/travelOperatingSystems";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)" };

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

export default function PartnerTravelOperatingSystems() {
  const [openId, setOpenId] = useState<string | null>(TRAVEL_OPERATING_SYSTEMS[0].id);

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionLabel>Travel Intelligence</SectionLabel>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 16, maxWidth: 760 }}>
            RTBX Travel Operating Systems
          </h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 720 }}>
            Purpose-built operating systems running on one shared RTBX Core.
          </p>
        </div>

        {/* ── POSITIONING ── */}
        <div style={{ padding: "18px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #c9a84c", marginBottom: 40 }}>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0, fontWeight: 600 }}>
            RTBX Core provides the shared execution architecture. RTBX Travel extends the core through tailored operating systems. Each operating system groups vertical-specific modules around a major hotel or travel operating problem.
          </p>
        </div>

        {/* ── HIERARCHY VISUAL ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Hierarchy</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            {TRAVEL_HIERARCHY_STAGES.map((stage, i, arr) => (
              <div key={stage} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  padding: "9px 14px", fontSize: 10.5, fontWeight: 700,
                  color: i === 0 ? "#080c14" : "rgba(255,255,255,0.65)",
                  background: i === 0 ? "#c9a84c" : "rgba(255,255,255,0.03)",
                  border: i === 0 ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.1)",
                }}>
                  {stage}
                </div>
                {i < arr.length - 1 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ── CATALOGUE (expandable sections) ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Catalogue</SectionLabel>
          <H2>Travel Operating Systems</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 760 }}>
            {TRAVEL_OPERATING_SYSTEMS.length} operating systems, each with a fixed module set. Expand a system to see its full purpose, users, systems, signals, moments, governance, playbooks, communications, actions, outcomes, value measures and rollout path.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TRAVEL_OPERATING_SYSTEMS.map(os => {
              const isOpen = openId === os.id;
              return (
                <div key={os.id} id={os.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${os.color}`, scrollMarginTop: 90 }}>
                  <div
                    onClick={() => setOpenId(isOpen ? null : os.id)}
                    style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                  >
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{os.name}</div>
                      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)" }}>{os.purpose}</div>
                    </div>
                    <div style={{ fontSize: 16, color: os.color, flexShrink: 0, marginLeft: 16 }}>{isOpen ? "\u2212" : "+"}</div>
                  </div>
                  {isOpen && (
                    <div style={{ padding: "0 22px 22px" }}>
                      <FieldRow label="Primary users" items={os.primaryUsers} />
                      <FieldRow label="Input systems" items={os.inputSystems} />
                      <FieldRow label="Signals" items={os.signals} />
                      <FieldRow label="Moments" items={os.moments} />
                      <FieldRow label="Governance" items={os.governance} />
                      <FieldRow label="Playbooks" items={os.playbooks} />
                      <FieldRow label="Communications" items={os.communications} />
                      <FieldRow label="Actions" items={os.actions} />
                      <FieldRow label="Outcomes" items={os.outcomes} />
                      <FieldRow label="Value measures" items={os.valueMeasures} />
                      <FieldRow label="Pilot entry point" items={[os.pilotEntryPoint]} />
                      <FieldRow label="Expansion pathway" items={[os.expansionPathway]} />

                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Modules Available</div>
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

        {/* ── OPTIONAL SPECIALIST EXTENSIONS ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Future / Optional</SectionLabel>
          <H2>Specialist Extensions</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 700 }}>
            Shown as future/optional extensions, not core operating systems — activated only for properties or portfolios with the matching operating context.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
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

        {/* ── MODULE MATRIX (role coverage) ── */}
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Coverage</SectionLabel>
          <H2>Module Matrix</H2>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 700 }}>
            Which operating systems serve each role.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 820 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 8.5 }}>Operating System</th>
                  {TRAVEL_ROLE_COLUMNS.map(role => (
                    <th key={role} style={{ textAlign: "center", padding: "8px 10px", color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 8.5 }}>{role}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRAVEL_OPERATING_SYSTEMS.map(os => (
                  <tr key={os.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px", fontWeight: 700, color: os.color, whiteSpace: "nowrap" }}>{os.name}</td>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 20 }}>
            {TRAVEL_DEPLOYMENT_PHASES.map(p => (
              <div key={p.phase} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: C.gold, marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.phase}</div>
                {p.operatingSystems.map(os => (
                  <div key={os} style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", marginBottom: 8, lineHeight: 1.5 }}>{os}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ padding: "18px 22px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: "3px solid #c9a84c" }}>
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
