/**
 * PartnerBuildConfigure — Sprint 4: 9-Stage Guided Deployment Stepper.
 *
 * Replaces the static Sprint 3 card list with a fully interactive
 * configuration workflow. All state is held in a single `draft` object
 * and persisted to DeploymentContext → localStorage on activation.
 *
 * SYNTHETIC DEMONSTRATION DATA ONLY.
 * Not a production customer environment.
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { useDeployment } from "@/context/DeploymentContext";
import {
  DEFAULT_DEPLOYMENT,
  SYSTEM_MATURITY_OPTIONS,
  GOVERNANCE_SOURCE_LABELS,
  GOVERNANCE_SOURCE_COLORS,
  OUTCOME_TARGET_LABELS,
  COMM_MODE_LABELS,
  computeReadiness,
  READINESS_COLORS,
  type TravelDeploymentConfig,
  type SystemConfig,
  type SystemMaturity,
  type GovernanceRuleSource,
  type CommunicationGenerationMode,
  type OutcomeTargetType,
} from "@/data/travelDeploymentConfig";
import { TRAVEL_ROLES } from "@/data/travelRoles";
import { TRAVEL_OPERATING_SYSTEMS, OS_POSITION_LABELS, OS_POSITION_COLORS } from "@/data/travelOperatingSystems";
import { TRAVEL_SCENARIOS } from "@/data/travelScenarios";
import { TRAVEL_PLAYBOOKS } from "@/data/travelPlaybooks";
import {
  getDeploymentActivationReadiness,
  getScenarioIdFromQuery,
  travelScenarioPath,
} from "@/lib/travelScenarioRouting";

// ── Palette ────────────────────────────────────────────────────────────────────
const C = {
  muted:  "rgba(255,255,255,0.5)",
  dim:    "rgba(255,255,255,0.22)",
  faint:  "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.08)",
  gold:   "#a8dedb",
  green:  "#10b981",
  red:    "#ef4444",
  blue:   "#3b82f6",
};

// ── Stage manifest ─────────────────────────────────────────────────────────────
const STAGES = [
  { num: 1,  id: "environment",       label: "Environment",          shortLabel: "Env"   },
  { num: 2,  id: "systems",           label: "Systems",              shortLabel: "Sys"   },
  { num: 3,  id: "roles",             label: "Roles",                shortLabel: "Roles" },
  { num: 4,  id: "operating-systems", label: "Operating Systems",    shortLabel: "OS"    },
  { num: 5,  id: "governance",        label: "Governance",           shortLabel: "Gov"   },
  { num: 6,  id: "scenarios",         label: "Scenarios & Playbooks",shortLabel: "Scen"  },
  { num: 7,  id: "communications",    label: "Communications",       shortLabel: "Comms" },
  { num: 8,  id: "evidence",          label: "Evidence & Outcomes",  shortLabel: "Evid"  },
  { num: 9,  id: "review",            label: "Review & Activate",    shortLabel: "Activate" },
];

// ── Shared UI primitives ───────────────────────────────────────────────────────

function SLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
      {children}
    </div>
  );
}

function FieldLabel({ children, required, htmlFor }: { children: string; required?: boolean; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{ display: "block", fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: 5, letterSpacing: "0.02em" }}
    >
      {children}
      {required && <span style={{ color: C.gold, marginLeft: 3 }} aria-label="required">*</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, id, required, "aria-describedby": describedBy }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  id?: string; required?: boolean; "aria-describedby"?: string;
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      aria-required={required}
      aria-describedby={describedBy}
      style={{
        width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 12.5,
        boxSizing: "border-box",
      }}
    />
  );
}

function NumberInput({ value, onChange, min, max, id, required }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number;
  id?: string; required?: boolean;
}) {
  return (
    <input
      id={id}
      type="number"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      min={min}
      max={max}
      required={required}
      aria-required={required}
      style={{
        width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 12.5,
        boxSizing: "border-box",
      }}
    />
  );
}

function StyledSelect({ value, onChange, options, id, "aria-label": ariaLabel }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
  id?: string; "aria-label"?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label={ariaLabel}
      style={{
        width: "100%", padding: "9px 12px", background: "#173b47",
        border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 12,
        cursor: "pointer", appearance: "none",
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Toggle({ active, onChange, label, sub }: { active: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => onChange(!active)}
      style={{
        display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
        padding: "10px 14px", width: "100%", textAlign: "left",
        background: active ? "rgba(168,222,219,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "rgba(168,222,219,0.25)" : "rgba(255,255,255,0.06)"}`,
        userSelect: "none", color: "inherit",
      }}
    >
      <div aria-hidden="true" style={{ width: 34, height: 18, background: active ? C.gold : "rgba(255,255,255,0.12)", borderRadius: 9, position: "relative", flexShrink: 0, transition: "background 0.15s" }}>
        <div style={{ position: "absolute", top: 2, left: active ? 18 : 2, width: 14, height: 14, background: "#fff", borderRadius: 7, transition: "left 0.15s" }} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: active ? "#fff" : "rgba(255,255,255,0.45)" }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{sub}</div>}
      </div>
    </button>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color, border: `1px solid ${color}40`, padding: "2px 7px" }}>
      {label}
    </span>
  );
}

function InfoPanel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "2px solid rgba(255,255,255,0.2)", marginBottom: 20, fontSize: 11.5, color: C.muted, lineHeight: 1.65 }}>
      {children}
    </div>
  );
}

function StageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: 8 }}>{title}</h2>
      <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7, maxWidth: 680, margin: 0 }}>{description}</p>
    </div>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────────

function ProgressBar({ current, onNavigate }: { current: number; onNavigate: (i: number) => void }) {
  return (
    <nav aria-label="Configuration stages" style={{ marginBottom: 32, overflowX: "auto" }}>
      <ol style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 600, listStyle: "none", margin: 0, padding: 0 }}>
        {STAGES.map((s, i) => {
          const done   = i < current;
          const active = i === current;
          return (
            <li key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STAGES.length - 1 ? "1 1 0" : "0 0 auto" }}>
              <button
                type="button"
                onClick={() => onNavigate(i)}
                aria-label={`Stage ${s.num}: ${s.label}${done ? " (complete)" : active ? " (current)" : ""}`}
                aria-current={active ? "step" : undefined}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer",
                  padding: "8px 6px", minWidth: 58, flexShrink: 0,
                  background: "transparent", border: "none", color: "inherit",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: active ? C.gold : done ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                  border: `2px solid ${active ? C.gold : done ? C.green : "rgba(255,255,255,0.12)"}`,
                  fontSize: 10, fontWeight: 800, color: active ? "#102d39" : done ? C.green : "rgba(255,255,255,0.3)",
                  transition: "all 0.15s",
                }}>
                  {done ? "✓" : s.num}
                </div>
                <div style={{ fontSize: 8.5, fontWeight: active ? 800 : 600, color: active ? C.gold : done ? C.green : "rgba(255,255,255,0.3)", textAlign: "center", whiteSpace: "nowrap", letterSpacing: "0.01em" }}>
                  {s.shortLabel}
                </div>
              </button>
              {i < STAGES.length - 1 && (
                <div aria-hidden="true" style={{ flex: 1, height: 1, background: done ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)", minWidth: 8 }} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ── Disclaimer banner ─────────────────────────────────────────────────────────

function Disclaimer() {
  return (
    <div style={{ padding: "11px 16px", background: "rgba(168,222,219,0.04)", border: "1px solid rgba(168,222,219,0.18)", borderLeft: "3px solid rgba(168,222,219,0.6)", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ fontSize: 9, letterSpacing: "0.1em", color: C.gold, fontWeight: 800, textTransform: "uppercase", whiteSpace: "nowrap", marginTop: 1 }}>Demo</span>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>
        This prototype stores synthetic deployment configuration locally for demonstration purposes. It is not a production customer environment and is not connected to any live system or data.
      </p>
    </div>
  );
}

// ── Stage 1: Environment ──────────────────────────────────────────────────────

function Stage1({ draft, setDraft }: { draft: TravelDeploymentConfig; setDraft: React.Dispatch<React.SetStateAction<TravelDeploymentConfig>> }) {
  const upd = (key: keyof TravelDeploymentConfig, val: unknown) => setDraft(prev => ({ ...prev, [key]: val, updatedAt: new Date().toISOString() }));

  const PROPERTY_TYPES = ["Hotel", "Resort", "Serviced Apartment", "Holiday Park", "Conference Venue", "Boutique Hotel", "Other"].map(v => ({ value: v, label: v }));
  const OPERATING_MODELS = ["Owner-operated", "Managed", "Franchised", "Independent", "Branded", "Mixed"].map(v => ({ value: v, label: v }));
  const DEPLOY_MODES = ["Demo environment", "Pilot design", "Pilot operation", "Production — requires engineering"].map(v => ({ value: v, label: v }));
  const TIMEZONES = ["Australia/Melbourne", "Australia/Sydney", "Australia/Brisbane", "Australia/Perth", "Australia/Adelaide", "Pacific/Auckland", "Asia/Singapore", "Asia/Tokyo", "Europe/London", "America/New_York", "America/Los_Angeles", "America/Chicago"].map(v => ({ value: v, label: v }));

  return (
    <div>
      <StageHeader title="Environment" description="Define the property context this deployment operates within. These details determine the operating frame for all signals, roles and governance." />
      <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 28px" }}>
        <div>
          <FieldLabel required htmlFor="deploy-name">Deployment name</FieldLabel>
          <TextInput id="deploy-name" value={draft.deploymentName} onChange={v => upd("deploymentName", v)} placeholder="e.g. Harbour Hotel Melbourne — Pilot" required />
        </div>
        <div>
          <FieldLabel required htmlFor="org-name">Organisation name</FieldLabel>
          <TextInput id="org-name" value={draft.organisationName} onChange={v => upd("organisationName", v)} placeholder="e.g. Harbour Hotel Group" required />
        </div>
        <div>
          <FieldLabel required htmlFor="property-type">Property type</FieldLabel>
          <StyledSelect id="property-type" value={draft.propertyType} onChange={v => upd("propertyType", v)} options={PROPERTY_TYPES} />
        </div>
        <div>
          <FieldLabel required htmlFor="room-count">Room / unit count</FieldLabel>
          <NumberInput id="room-count" value={draft.roomCount} onChange={v => upd("roomCount", v)} min={1} max={9999} required />
        </div>
        <div>
          <FieldLabel htmlFor="region">Region</FieldLabel>
          <TextInput id="region" value={draft.region} onChange={v => upd("region", v)} placeholder="e.g. Melbourne, Victoria, Australia" />
        </div>
        <div>
          <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
          <StyledSelect id="timezone" value={draft.timezone} onChange={v => upd("timezone", v)} options={TIMEZONES} />
        </div>
        <div>
          <FieldLabel htmlFor="operating-model">Operating model</FieldLabel>
          <StyledSelect id="operating-model" value={draft.operatingModel} onChange={v => upd("operatingModel", v)} options={OPERATING_MODELS} />
        </div>
        <div>
          <FieldLabel htmlFor="deploy-mode">Deployment mode</FieldLabel>
          <StyledSelect id="deploy-mode" value={draft.deploymentMode} onChange={v => upd("deploymentMode", v)} options={DEPLOY_MODES} />
        </div>
      </div>
    </div>
  );
}

// ── Stage 2: Systems ──────────────────────────────────────────────────────────

function Stage2({ draft, setDraft }: { draft: TravelDeploymentConfig; setDraft: React.Dispatch<React.SetStateAction<TravelDeploymentConfig>> }) {
  const updSystem = (id: string, field: keyof SystemConfig, val: string) => {
    setDraft(prev => ({
      ...prev,
      systems: prev.systems.map(s => s.id === id ? { ...s, [field]: val } : s),
      updatedAt: new Date().toISOString(),
    }));
  };

  const MATURITY_OPTS = SYSTEM_MATURITY_OPTIONS.map(o => ({ value: o.value, label: o.label }));

  const grouped = draft.systems.reduce<Record<string, SystemConfig[]>>((acc, sys) => {
    if (!acc[sys.category]) acc[sys.category] = [];
    acc[sys.category].push(sys);
    return acc;
  }, {});

  return (
    <div>
      <StageHeader title="Systems & Integrations" description="Configure which source systems supply signals for this deployment. Set the connection maturity for each system — this drives what evidence and signal accuracy labels are shown during execution." />
      <InfoPanel>
        <strong style={{ color: "rgba(255,255,255,0.75)" }}>Maturity levels:</strong>{" "}
        <span style={{ color: "rgba(255,255,255,0.4)" }}>Simulated</span> (stub data) ·{" "}
        <span style={{ color: "rgba(255,255,255,0.4)" }}>Manual</span> (staff-entered) ·{" "}
        <span style={{ color: "rgba(255,255,255,0.4)" }}>Demonstrated</span> (working interface) ·{" "}
        <span style={{ color: "rgba(255,255,255,0.4)" }}>Connector-ready</span> (pending activation) ·{" "}
        <span style={{ color: "rgba(255,255,255,0.4)" }}>Planned</span> (not built). "Integrated" is not available in demo mode.
      </InfoPanel>
      {Object.entries(grouped).map(([category, systems]) => (
        <div key={category} style={{ marginBottom: 22 }}>
          <SLabel>{category}</SLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {systems.map(sys => (
              <div key={sys.id} className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 200px 1fr", gap: 16, alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{sys.name}</div>
                </div>
                <StyledSelect
                  value={sys.maturity}
                  onChange={v => updSystem(sys.id, "maturity", v as SystemMaturity)}
                  options={MATURITY_OPTS}
                  aria-label={`${sys.name} maturity level`}
                />
                <input
                  type="text"
                  value={sys.notes ?? ""}
                  onChange={e => updSystem(sys.id, "notes" as keyof SystemConfig, e.target.value)}
                  placeholder="Notes (optional)"
                  aria-label={`Notes for ${sys.name}`}
                  style={{ padding: "8px 10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: 11 }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Stage 3: Roles ────────────────────────────────────────────────────────────

function Stage3({ draft, setDraft }: { draft: TravelDeploymentConfig; setDraft: React.Dispatch<React.SetStateAction<TravelDeploymentConfig>> }) {
  const updRole = (roleId: string, field: string, val: unknown) => {
    setDraft(prev => ({
      ...prev,
      roles: prev.roles.map(r => r.roleId === roleId ? { ...r, [field]: val } : r),
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <div>
      <StageHeader title="Roles" description="Activate the roles that exist in this deployment. Inactive roles cannot be assigned as accountable owners. Use the local title field to map JALDO role names to your property's naming conventions." />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {draft.roles.map(dr => {
          const roleDef = TRAVEL_ROLES.find(r => r.id === dr.roleId);
          if (!roleDef) return null;
          return (
            <div key={dr.roleId} className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 0, background: "rgba(255,255,255,0.02)", border: `1px solid ${dr.active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}` }}>
              <button
                type="button"
                role="switch"
                aria-checked={dr.active}
                onClick={() => updRole(dr.roleId, "active", !dr.active)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", cursor: "pointer", background: "transparent", border: "none", color: "inherit", textAlign: "left" }}
              >
                <div aria-hidden="true" style={{ width: 28, height: 16, background: dr.active ? C.gold : "rgba(255,255,255,0.1)", borderRadius: 8, position: "relative", flexShrink: 0, transition: "background 0.15s" }}>
                  <div style={{ position: "absolute", top: 2, left: dr.active ? 14 : 2, width: 12, height: 12, background: "#fff", borderRadius: 6, transition: "left 0.15s" }} />
                </div>
                <div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: dr.active ? "#fff" : "rgba(255,255,255,0.35)" }}>{roleDef.name}</span>
                  {" "}<Badge label={roleDef.level} color={dr.active ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)"} />
                </div>
              </button>
              <div style={{ padding: "10px 12px", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>
                <label style={{ display: "block" }}>
                  <span className="sr-only">Local title for {roleDef.name}</span>
                  <input
                    type="text"
                    value={dr.localTitle ?? ""}
                    onChange={e => updRole(dr.roleId, "localTitle", e.target.value)}
                    placeholder="Local title (optional)"
                    disabled={!dr.active}
                    aria-label={`Local title for ${roleDef.name} (optional)`}
                    style={{ width: "100%", padding: "7px 10px", background: dr.active ? "rgba(255,255,255,0.03)" : "transparent", border: `1px solid ${dr.active ? "rgba(255,255,255,0.1)" : "transparent"}`, color: "rgba(255,255,255,0.5)", fontSize: 11, boxSizing: "border-box" }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 10.5, color: "rgba(255,255,255,0.3)" }}>
        {draft.roles.filter(r => r.active).length} of {draft.roles.length} roles active
      </div>
    </div>
  );
}

// ── Stage 4: Operating Systems ────────────────────────────────────────────────

function Stage4({ draft, setDraft }: { draft: TravelDeploymentConfig; setDraft: React.Dispatch<React.SetStateAction<TravelDeploymentConfig>> }) {
  const updOS = (osId: string, active: boolean) => {
    setDraft(prev => ({
      ...prev,
      operatingSystems: prev.operatingSystems.map(o => o.osId === osId ? { ...o, active } : o),
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <div>
      <StageHeader title="Operating Systems" description="Select which Travel Operating Systems are active in this deployment. Lead OSes form the pilot foundation. Safety is cross-cutting and activates automatically when a welfare scenario is selected. Marketplace requires trust and signal accuracy to be established first." />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {TRAVEL_OPERATING_SYSTEMS.map(os => {
          const dOs = draft.operatingSystems.find(o => o.osId === os.id);
          const isActive = dOs?.active ?? false;
          const posColor = OS_POSITION_COLORS[os.position] ?? C.muted;
          const scenarios = draft.scenarios.filter(s => {
            const sc = TRAVEL_SCENARIOS.find(ts => ts.id === s.scenarioId);
            return sc?.operatingSystemId === os.id;
          });
          const activeScenarios = scenarios.filter(s => s.active);

          return (
            <div key={os.id} style={{ padding: "18px 20px", background: isActive ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)", border: `1px solid ${isActive ? `${os.color}30` : "rgba(255,255,255,0.06)"}`, borderLeft: `3px solid ${isActive ? os.color : "rgba(255,255,255,0.1)"}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }}>{os.name}</span>
                    <Badge label={OS_POSITION_LABELS[os.position] ?? os.position} color={posColor} />
                    <Badge label={os.maturityStatus} color={isActive ? os.color : "rgba(255,255,255,0.2)"} />
                  </div>
                  <p style={{ fontSize: 11.5, color: isActive ? C.muted : "rgba(255,255,255,0.3)", lineHeight: 1.6, margin: 0, maxWidth: 560 }}>{os.problem}</p>
                  {os.position === "cross-cutting" && (
                    <div style={{ marginTop: 8, fontSize: 10.5, color: "#ef444490" }}>⚠ Auto-activates with welfare scenarios — cannot be disabled while distressed-guest is active</div>
                  )}
                  {os.position === "expansion" && (
                    <div style={{ marginTop: 8, fontSize: 10.5, color: "rgba(168,222,219,0.7)" }}>★ Expansion: activate after trust, signal accuracy and governance are confirmed</div>
                  )}
                  {activeScenarios.length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {activeScenarios.map(s => {
                        const sc = TRAVEL_SCENARIOS.find(ts => ts.id === s.scenarioId);
                        return sc ? <span key={s.scenarioId} style={{ fontSize: 9, color: os.color, border: `1px solid ${os.color}30`, padding: "2px 7px" }}>{sc.title}</span> : null;
                      })}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  aria-label={`${os.name} — ${isActive ? "active, click to deactivate" : "inactive, click to activate"}`}
                  onClick={() => updOS(os.id, !isActive)}
                  style={{ width: 38, height: 38, background: "transparent", border: "none", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  <div aria-hidden="true" style={{ width: 38, height: 20, background: isActive ? C.gold : "rgba(255,255,255,0.12)", borderRadius: 10, position: "relative", transition: "background 0.15s" }}>
                    <div style={{ position: "absolute", top: 2, left: isActive ? 20 : 2, width: 16, height: 16, background: "#fff", borderRadius: 8, transition: "left 0.15s" }} />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Stage 5: Governance ───────────────────────────────────────────────────────

function Stage5({ draft, setDraft }: { draft: TravelDeploymentConfig; setDraft: React.Dispatch<React.SetStateAction<TravelDeploymentConfig>> }) {
  const updGov = (id: string, field: string, val: unknown) => {
    setDraft(prev => ({
      ...prev,
      governance: prev.governance.map(g => g.id === id ? { ...g, [field]: val } : g),
      updatedAt: new Date().toISOString(),
    }));
  };

  const SOURCE_OPTS: { value: GovernanceRuleSource; label: string }[] = [
    { value: "brand-standard",     label: "Brand Standard" },
    { value: "property-procedure", label: "Property Procedure" },
    { value: "demo-default",       label: "Demo Default" },
    { value: "regulatory",         label: "Regulatory" },
    { value: "to-be-agreed",       label: "To Be Agreed" },
  ];

  return (
    <div>
      <StageHeader title="Governance" description="Configure the rules that govern how this deployment responds to moments. Each rule identifies its source — brand standard, property procedure, demo default, or regulatory. Required rules must be filled before activation." />
      <InfoPanel>
        Governance rules are evaluated at runtime. The source label is shown in the execution record to make clear which authority governs each decision.
      </InfoPanel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {draft.governance.map(gov => (
          <div key={gov.id} style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: `1px solid ${gov.required && !gov.value.trim() ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.07)"}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{gov.label}</span>
                {gov.required && <Badge label="Required" color={C.gold} />}
              </div>
              <select
                value={gov.source}
                onChange={e => updGov(gov.id, "source", e.target.value as GovernanceRuleSource)}
                aria-label={`Source for ${gov.label}`}
                style={{ padding: "4px 8px", background: "#173b47", border: `1px solid ${GOVERNANCE_SOURCE_COLORS[gov.source]}40`, color: GOVERNANCE_SOURCE_COLORS[gov.source], fontSize: 10, cursor: "pointer" }}
              >
                {SOURCE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <textarea
              value={gov.value}
              onChange={e => updGov(gov.id, "value", e.target.value)}
              rows={2}
              style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: 11.5, lineHeight: 1.6, outline: "none", resize: "vertical", boxSizing: "border-box" }}
            />
            <div style={{ fontSize: 9.5, color: GOVERNANCE_SOURCE_COLORS[gov.source], marginTop: 4 }}>
              Source: {GOVERNANCE_SOURCE_LABELS[gov.source]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stage 6: Scenarios & Playbooks ────────────────────────────────────────────

function Stage6({ draft, setDraft, preselectedScenarioId }: {
  draft: TravelDeploymentConfig;
  setDraft: React.Dispatch<React.SetStateAction<TravelDeploymentConfig>>;
  preselectedScenarioId: string | null;
}) {
  const updScenario = (scenarioId: string, field: string, val: unknown) => {
    setDraft(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s => s.scenarioId === scenarioId ? { ...s, [field]: val } : s),
      updatedAt: new Date().toISOString(),
    }));
  };

  const activeRoles = draft.roles.filter(r => r.active).map(r => {
    const def = TRAVEL_ROLES.find(tr => tr.id === r.roleId);
    return { value: r.roleId, label: r.localTitle || def?.name || r.roleId };
  });

  return (
    <div>
      <StageHeader title="Scenarios & Playbooks" description="Select which canonical scenarios are active in this deployment. Each scenario requires an active Operating System, an accountable role, and a linked playbook. Inactive prerequisites are shown as blocking conditions." />
      {preselectedScenarioId && (
        <div style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(168,222,219,0.05)", border: "1px solid rgba(168,222,219,0.25)", borderLeft: `3px solid ${C.gold}` }}>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
            <strong style={{ color: C.gold }}>Preselected from the Travel Scenario Library:</strong>{" "}
            {TRAVEL_SCENARIOS.find(item => item.id === preselectedScenarioId)?.title}.
            Review its activation, operating system, accountable role and playbook below. No saved deployment state changes until you complete validation and select Activate.
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {draft.scenarios.map(ds => {
          const scenario = TRAVEL_SCENARIOS.find(ts => ts.id === ds.scenarioId);
          const playbook = TRAVEL_PLAYBOOKS.find(p => p.id === ds.playbookId);
          if (!scenario) return null;

          const osConfig  = draft.operatingSystems.find(o => o.osId === scenario.operatingSystemId);
          const osActive  = osConfig?.active ?? false;
          const osDef     = TRAVEL_OPERATING_SYSTEMS.find(o => o.id === scenario.operatingSystemId);
          const roleActive = draft.roles.find(r => r.roleId === ds.accountableRoleId)?.active ?? false;

          const blocked = ds.active && (!osActive || !roleActive);

          return (
            <div key={ds.scenarioId} style={{ padding: "18px 20px", background: ds.active ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.01)", border: `1px solid ${preselectedScenarioId === ds.scenarioId ? "rgba(168,222,219,0.55)" : blocked ? "rgba(239,68,68,0.3)" : ds.active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`, borderLeft: `3px solid ${preselectedScenarioId === ds.scenarioId ? C.gold : ds.active ? (osDef?.color ?? C.gold) : "rgba(255,255,255,0.1)"}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: ds.active ? "#fff" : "rgba(255,255,255,0.4)" }}>{scenario.title}</span>
                    <Badge label={scenario.num} color={osDef?.color ?? C.gold} />
                    <Badge label={scenario.maturityStatus} color={ds.active ? (osDef?.color ?? C.gold) : "rgba(255,255,255,0.2)"} />
                    {preselectedScenarioId === ds.scenarioId && <Badge label="Selected for review" color={C.gold} />}
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: "0 0 10px", maxWidth: 540 }}>
                    {scenario.trigger.description}
                  </p>
                  {/* Blocking conditions */}
                  {ds.active && !osActive && (
                    <div style={{ fontSize: 10.5, color: C.red, marginBottom: 6 }}>✗ OS not active: {osDef?.name} must be enabled in Stage 4</div>
                  )}
                  {ds.active && !roleActive && (
                    <div style={{ fontSize: 10.5, color: C.red, marginBottom: 6 }}>✗ Accountable role not active — select an active role below</div>
                  )}
                  {!playbook && (
                    <div style={{ fontSize: 10.5, color: C.red, marginBottom: 6 }}>✗ No matching playbook found for {ds.playbookId}</div>
                  )}
                  {ds.active && (
                    <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                      <div>
                        <FieldLabel>Accountable role</FieldLabel>
                        <StyledSelect
                          value={ds.accountableRoleId}
                          onChange={v => updScenario(ds.scenarioId, "accountableRoleId", v)}
                          options={activeRoles.length > 0 ? activeRoles : [{ value: ds.accountableRoleId, label: ds.accountableRoleId }]}
                        />
                      </div>
                      <div>
                        <FieldLabel>Playbook</FieldLabel>
                        <div style={{ padding: "9px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 11.5, color: playbook ? C.green : C.red }}>
                          {playbook?.name ?? `Not found: ${ds.playbookId}`}
                        </div>
                      </div>
                    </div>
                  )}
                  {ds.active && (
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                      <input
                        type="checkbox"
                        id={`syn-${ds.scenarioId}`}
                        checked={ds.syntheticSignalOverride}
                        onChange={e => updScenario(ds.scenarioId, "syntheticSignalOverride", e.target.checked)}
                        style={{ cursor: "pointer" }}
                      />
                      <label htmlFor={`syn-${ds.scenarioId}`} style={{ fontSize: 10.5, color: C.muted, cursor: "pointer" }}>
                        Synthetic signal override — signals always shown with "Synthetic" label in execution
                      </label>
                    </div>
                  )}
                  {ds.scenarioId === "distressed-guest" && ds.active && (
                    <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 10.5, color: "rgba(239,68,68,0.9)" }}>
                      ⚠ Welfare scenario: human review is mandatory. Restricted communication pathway enforced. AI cannot close this scenario.
                    </div>
                  )}
                  <div style={{ marginTop: 10 }}>
                    <Link href={travelScenarioPath(ds.scenarioId)}>
                      <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>View canonical scenario details →</span>
                    </Link>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={ds.active}
                  aria-label={`${scenario.title} — ${ds.active ? "active, click to deactivate" : "inactive, click to activate"}`}
                  onClick={() => updScenario(ds.scenarioId, "active", !ds.active)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", flexShrink: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44 }}
                >
                  <div aria-hidden="true" style={{ width: 38, height: 20, background: ds.active ? C.gold : "rgba(255,255,255,0.12)", borderRadius: 10, position: "relative", transition: "background 0.15s" }}>
                    <div style={{ position: "absolute", top: 2, left: ds.active ? 20 : 2, width: 16, height: 16, background: "#fff", borderRadius: 8, transition: "left 0.15s" }} />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 10.5, color: "rgba(255,255,255,0.3)" }}>
        {draft.scenarios.filter(s => s.active).length} of {draft.scenarios.length} scenarios active
      </div>
    </div>
  );
}

// ── Stage 7: Communications ───────────────────────────────────────────────────

function Stage7({ draft, setDraft }: { draft: TravelDeploymentConfig; setDraft: React.Dispatch<React.SetStateAction<TravelDeploymentConfig>> }) {
  const updComm = (id: string, field: string, val: unknown) => {
    setDraft(prev => ({
      ...prev,
      communications: prev.communications.map(c => c.id === id ? { ...c, [field]: val } : c),
      updatedAt: new Date().toISOString(),
    }));
  };

  const MODE_OPTS: { value: CommunicationGenerationMode; label: string }[] = Object.entries(COMM_MODE_LABELS).map(([k, v]) => ({ value: k as CommunicationGenerationMode, label: v }));

  return (
    <div>
      <StageHeader title="Communications" description="Configure how Central Comms OS generates and routes communications. The distressed-guest pathway restricts all automated guest-facing messages — these must always be human-authored and human-reviewed." />
      <InfoPanel>
        <strong style={{ color: "rgba(255,255,255,0.75)" }}>Distressed-guest pathway</strong>: All communications marked as welfare-restricted are removed from automated channels and routed to human-authored-only mode during an active welfare event.
      </InfoPanel>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {draft.communications.map(comm => (
          <div key={comm.id} style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: `1px solid ${comm.distressedGuestRestricted ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: "#fff" }}>{comm.communicationType}</span>
                {comm.distressedGuestRestricted && <Badge label="Welfare-restricted" color={C.red} />}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ fontSize: 10, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                  <input
                    type="checkbox"
                    checked={comm.approvalRequired}
                    onChange={e => updComm(comm.id, "approvalRequired", e.target.checked)}
                  />
                  Human approval required
                </label>
              </div>
            </div>
            <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <FieldLabel htmlFor={`comm-audience-${comm.id}`}>Audience</FieldLabel>
                <TextInput id={`comm-audience-${comm.id}`} value={comm.audience} onChange={v => updComm(comm.id, "audience", v)} />
              </div>
              <div>
                <FieldLabel htmlFor={`comm-channel-${comm.id}`}>Channel</FieldLabel>
                <TextInput id={`comm-channel-${comm.id}`} value={comm.channel} onChange={v => updComm(comm.id, "channel", v)} />
              </div>
              <div>
                <FieldLabel htmlFor={`comm-mode-${comm.id}`}>Generation mode</FieldLabel>
                <StyledSelect
                  id={`comm-mode-${comm.id}`}
                  value={comm.generationMode}
                  onChange={v => updComm(comm.id, "generationMode", v as CommunicationGenerationMode)}
                  options={MODE_OPTS}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stage 8: Evidence & Outcomes ──────────────────────────────────────────────

function Stage8({ draft, setDraft }: { draft: TravelDeploymentConfig; setDraft: React.Dispatch<React.SetStateAction<TravelDeploymentConfig>> }) {
  const updEv = (id: string, field: string, val: unknown) => {
    setDraft(prev => ({
      ...prev,
      evidence: prev.evidence.map(e => e.id === id ? { ...e, [field]: val } : e),
      updatedAt: new Date().toISOString(),
    }));
  };
  const updOut = (id: string, field: string, val: unknown) => {
    setDraft(prev => ({
      ...prev,
      outcomes: prev.outcomes.map(o => o.id === id ? { ...o, [field]: val } : o),
      updatedAt: new Date().toISOString(),
    }));
  };

  const TARGET_OPTS: { value: OutcomeTargetType; label: string }[] = Object.entries(OUTCOME_TARGET_LABELS).map(([k, v]) => ({ value: k as OutcomeTargetType, label: v }));
  const activeRoles = draft.roles.filter(r => r.active).map(r => {
    const def = TRAVEL_ROLES.find(tr => tr.id === r.roleId);
    return { value: r.roleId, label: r.localTitle || def?.name || r.roleId };
  });

  return (
    <div>
      <StageHeader title="Evidence & Outcomes" description="Configure the evidence requirements and outcome metrics for this deployment. Required evidence blocks scenario closure. Outcome targets define what successful resolution looks like — they are never claimed as guarantees." />

      <SLabel>Evidence requirements</SLabel>
      <div className="rtbx-table-scroll" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 560 }}>
          {draft.evidence.map(ev => (
            <div key={ev.id} style={{ display: "grid", gridTemplateColumns: "2fr 120px 180px 2fr", gap: 12, alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>{ev.evidenceType}</div>
              <button
                type="button"
                role="switch"
                aria-checked={ev.required}
                aria-label={`${ev.evidenceType} — ${ev.required ? "required" : "optional"}`}
                onClick={() => updEv(ev.id, "required", !ev.required)}
                style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", background: "transparent", border: "none", color: "inherit", padding: "4px 0" }}
              >
                <div aria-hidden="true" style={{ width: 28, height: 16, background: ev.required ? C.gold : "rgba(255,255,255,0.1)", borderRadius: 8, position: "relative", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 2, left: ev.required ? 14 : 2, width: 12, height: 12, background: "#fff", borderRadius: 6, transition: "left 0.15s" }} />
                </div>
                <span style={{ fontSize: 10, color: ev.required ? C.gold : "rgba(255,255,255,0.3)" }}>{ev.required ? "Required" : "Optional"}</span>
              </button>
              <select
                value={ev.ownerRoleId}
                onChange={e => updEv(ev.id, "ownerRoleId", e.target.value)}
                aria-label={`Owner role for ${ev.evidenceType}`}
                style={{ padding: "6px 8px", background: "#173b47", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 10.5 }}
              >
                {activeRoles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)" }}>{ev.completionRule}</div>
            </div>
          ))}
        </div>
      </div>

      <SLabel>Outcome metrics</SLabel>
      <div className="rtbx-table-scroll">
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 560 }}>
          {draft.outcomes.map(out => (
            <div key={out.id} style={{ display: "grid", gridTemplateColumns: "2fr 180px 160px 2fr", gap: 12, alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>{out.metric}</div>
              <select
                value={out.targetType}
                onChange={e => updOut(out.id, "targetType", e.target.value as OutcomeTargetType)}
                aria-label={`Target type for ${out.metric}`}
                style={{ padding: "6px 8px", background: "#173b47", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 10.5 }}
              >
                {TARGET_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <input
                type="text"
                value={out.targetValue ?? ""}
                onChange={e => updOut(out.id, "targetValue", e.target.value)}
                placeholder="Target value (optional)"
                aria-label={`Target value for ${out.metric}`}
                style={{ padding: "6px 8px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: 10.5 }}
              />
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)" }}>{out.measurementMethod}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Stage 9: Review & Activate ────────────────────────────────────────────────

function Stage9({ draft, onActivate }: { draft: TravelDeploymentConfig; onActivate: () => void }) {
  const activationReadiness = getDeploymentActivationReadiness(draft);
  const readiness     = activationReadiness.readiness;
  const readinessColor = READINESS_COLORS[readiness];
  const activeOSes    = draft.operatingSystems.filter(o => o.active);
  const activeScens   = draft.scenarios.filter(s => s.active);
  const activeRoles   = draft.roles.filter(r => r.active);
  const canActivate   = activationReadiness.ready;

  const SumRow = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{label}</span>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: color ?? "#fff" }}>{value}</span>
    </div>
  );

  return (
    <div>
      <StageHeader title="Review & Activate" description="Review the full deployment configuration and activate. Activation saves this configuration as the active deployment, making it available in the Execution Centre." />

      {/* Readiness state */}
      <div style={{ padding: "18px 22px", background: `${readinessColor}08`, border: `1px solid ${readinessColor}30`, borderLeft: `3px solid ${readinessColor}`, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 800, color: readinessColor }}>Readiness State</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: readinessColor }}>{readiness}</span>
        </div>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>
          {readiness === "Ready for simulation"
            ? "This deployment is configured for interactive simulation. Activation will make it available in the Execution Centre."
            : readiness === "Incomplete"
            ? "One or more required sections are incomplete. Review the stages above — missing required fields are highlighted."
            : readiness === "Blocked"
            ? "One or more active scenarios are blocked by inactive prerequisites. Check Stage 4 (Operating Systems) and Stage 6 (Scenarios)."
            : "Review the readiness details above before activating."}
        </p>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "10px 0 0", fontStyle: "italic" }}>
          Note: "Ready for production" is never a valid state in this prototype — production deployment requires engineering, integration and security review.
        </p>
        {activationReadiness.issues.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {activationReadiness.issues.map((issue, index) => (
              <div key={`${issue.code}-${issue.scenarioId ?? index}`} style={{ fontSize: 10.5, color: "rgba(239,68,68,0.9)", lineHeight: 1.55 }}>
                {issue.scenarioId ? `${TRAVEL_SCENARIOS.find(item => item.id === issue.scenarioId)?.title ?? issue.scenarioId}: ` : ""}{issue.reason}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary grid */}
      <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Environment */}
        <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SLabel>Environment</SLabel>
          <SumRow label="Name"             value={draft.deploymentName || "—"} />
          <SumRow label="Organisation"     value={draft.organisationName || "—"} />
          <SumRow label="Property type"    value={draft.propertyType} />
          <SumRow label="Room count"       value={draft.roomCount} />
          <SumRow label="Region"           value={draft.region || "—"} />
          <SumRow label="Deployment mode"  value={draft.deploymentMode} />
        </div>

        {/* Systems */}
        <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SLabel>Systems</SLabel>
          {draft.systems.map(s => <SumRow key={s.id} label={s.name} value={s.maturity} color={s.maturity === "simulated" ? C.gold : s.maturity === "demonstrated" ? C.green : "rgba(255,255,255,0.6)"} />)}
        </div>

        {/* Operating systems */}
        <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SLabel>Operating systems</SLabel>
          {draft.operatingSystems.map(o => {
            const osDef = TRAVEL_OPERATING_SYSTEMS.find(os => os.id === o.osId);
            return <SumRow key={o.osId} label={osDef?.name ?? o.osId} value={o.active ? "Active" : "Inactive"} color={o.active ? C.green : "rgba(255,255,255,0.25)"} />;
          })}
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>{activeOSes.length} of {draft.operatingSystems.length} active</div>
        </div>

        {/* Scenarios */}
        <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SLabel>Scenarios & Playbooks</SLabel>
          {draft.scenarios.map(ds => {
            const sc = TRAVEL_SCENARIOS.find(ts => ts.id === ds.scenarioId);
            return <SumRow key={ds.scenarioId} label={sc?.title ?? ds.scenarioId} value={ds.active ? "Active" : "Inactive"} color={ds.active ? C.green : "rgba(255,255,255,0.25)"} />;
          })}
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>{activeScens.length} of {draft.scenarios.length} active</div>
        </div>

        {/* Roles */}
        <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SLabel>Roles</SLabel>
          <SumRow label="Active roles"    value={`${activeRoles.length} of ${draft.roles.length}`} />
          <SumRow label="Frontline"       value={draft.roles.filter(r => r.active && ["front-office","guest-services","concierge","housekeeping","maintenance-lead"].includes(r.roleId)).length} />
          <SumRow label="Management"      value={draft.roles.filter(r => r.active && ["duty-manager","operations-manager","safety-security-lead","revenue-loyalty-lead"].includes(r.roleId)).length} />
          <SumRow label="Property/Group"  value={draft.roles.filter(r => r.active && ["general-manager","regional-operations","group-operations"].includes(r.roleId)).length} />
        </div>

        {/* Governance */}
        <div style={{ padding: "16px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SLabel>Governance</SLabel>
          <SumRow label="Rules defined"     value={draft.governance.length} />
          <SumRow label="Required rules"    value={draft.governance.filter(g => g.required).length} />
          <SumRow label="Filled rules"      value={draft.governance.filter(g => g.value.trim()).length} />
          <SumRow label="Evidence items"    value={draft.evidence.length} />
          <SumRow label="Required evidence" value={draft.evidence.filter(e => e.required).length} />
          <SumRow label="Outcome metrics"   value={draft.outcomes.length} />
        </div>
      </div>

      {/* Activate */}
      <div style={{ padding: "22px 24px", background: canActivate ? "rgba(168,222,219,0.04)" : "rgba(255,255,255,0.015)", border: `1px solid ${canActivate ? "rgba(168,222,219,0.25)" : "rgba(255,255,255,0.07)"}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: canActivate ? "#fff" : "rgba(255,255,255,0.35)", marginBottom: 4 }}>
              {canActivate ? "Ready to activate this Travel environment" : "Complete all required sections before activating"}
            </div>
            <p id="activate-description" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>
              {canActivate
                ? "Stores synthetic deployment configuration locally · Not a production environment"
                : readiness === "Incomplete"
                  ? "Required fields are missing — fill Deployment name, Organisation name and required governance rules, then return to this stage."
                  : readiness === "Blocked"
                    ? "Active scenarios have unmet prerequisites — resolve blocked scenarios in Stage 4 and Stage 6 before activating."
                    : "Complete all required sections before activating."}
            </p>
          </div>
          <button
            onClick={canActivate ? onActivate : undefined}
            disabled={!canActivate}
            aria-disabled={!canActivate}
            aria-describedby="activate-description"
            style={{
              padding: "12px 28px", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
              textTransform: "uppercase", border: "none", cursor: canActivate ? "pointer" : "not-allowed",
              background: canActivate ? C.gold : "rgba(255,255,255,0.06)",
              color: canActivate ? "#102d39" : "rgba(255,255,255,0.2)",
              whiteSpace: "nowrap", minHeight: 44,
            }}
          >
            Activate Travel Environment →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Activation success ─────────────────────────────────────────────────────────

function ActivationSuccess({ deployment }: { deployment: TravelDeploymentConfig }) {
  const activeScens = deployment.scenarios.filter(s => s.active);
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px 32px" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.18em", color: C.green, textTransform: "uppercase", fontWeight: 800, marginBottom: 16 }}>Deployment activated</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 16 }}>
          {deployment.deploymentName}
        </h1>
        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, marginBottom: 28, maxWidth: 580 }}>
          {deployment.organisationName} · {deployment.propertyType} · {deployment.roomCount} rooms<br />
          {activeScens.length} scenario{activeScens.length !== 1 ? "s" : ""} active · Status: active-simulation
        </p>
        <div style={{ padding: "14px 18px", background: "rgba(168,222,219,0.04)", border: "1px solid rgba(168,222,219,0.2)", marginBottom: 32, fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
          Deployment configuration saved locally (synthetic demonstration data). This is not a production customer environment.
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/partner-room/operations">
            <div style={{ padding: "13px 28px", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", background: C.gold, color: "#102d39", cursor: "pointer", whiteSpace: "nowrap" }}>
              Open Execution Centre →
            </div>
          </Link>
          <Link href="/partner-room/build-configure">
            <div style={{ padding: "13px 22px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.6)", cursor: "pointer", whiteSpace: "nowrap" }}>
              Back to Build & Configure
            </div>
          </Link>
        </div>
      </div>
    </PartnerRoomLayout>
  );
}

// ── Navigation footer ─────────────────────────────────────────────────────────

function NavFooter({
  stage, total, onPrev, onNext,
}: {
  stage: number; total: number; onPrev: () => void; onNext: () => void;
}) {
  const isLast = stage === total - 1;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 28, marginTop: 36, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <button
        onClick={onPrev}
        disabled={stage === 0}
        style={{ padding: "10px 22px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: stage === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)", cursor: stage === 0 ? "default" : "pointer" }}
      >
        ← Previous
      </button>
      <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>Stage {stage + 1} of {total}</div>
      {!isLast ? (
        <button
          onClick={onNext}
          style={{ padding: "10px 22px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: C.gold, border: "none", color: "#102d39", cursor: "pointer" }}
        >
          Next →
        </button>
      ) : (
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Use the Activate button above</div>
      )}
    </div>
  );
}

// ── Reset confirmation dialog ──────────────────────────────────────────────────

function ResetConfirmDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-dialog-title"
      aria-describedby="reset-dialog-desc"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.75)", padding: 24,
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", background: "#173b47", border: "1px solid rgba(239,68,68,0.3)", padding: "28px 32px" }}>
        <div id="reset-dialog-title" style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Reset configuration?</div>
        <p id="reset-dialog-desc" style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7, marginBottom: 24, margin: "0 0 24px" }}>
          This will clear your current draft and restore all fields to the default state. Any unsaved changes will be lost. This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            autoFocus
            style={{ padding: "10px 20px", fontSize: 10.5, fontWeight: 700, background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{ padding: "10px 20px", fontSize: 10.5, fontWeight: 700, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: C.red, cursor: "pointer" }}
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PartnerBuildConfigure() {
  const [location] = useLocation();
  const { activeDeployment, activateDeployment, resetDeployment } = useDeployment();
  const [stage, setStage]   = useState(0);
  const [draft, setDraft]   = useState<TravelDeploymentConfig>(() => activeDeployment ?? DEFAULT_DEPLOYMENT);
  const [activated, setActivated] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const requestedScenarioId = getScenarioIdFromQuery(
    location,
    typeof window === "undefined" ? "" : window.location.search,
  );
  const preselectedScenarioId = TRAVEL_SCENARIOS.some(item => item.id === requestedScenarioId)
    ? requestedScenarioId
    : null;

  useEffect(() => {
    if (preselectedScenarioId) setStage(5);
  }, [preselectedScenarioId]);

  function handleActivate() {
    try {
      activateDeployment(draft);
      setActivationError(null);
      setActivated(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setActivationError(error instanceof Error ? error.message : "Activation blocked by configuration validation.");
    }
  }

  function handleReset() {
    setDraft(DEFAULT_DEPLOYMENT);
    resetDeployment();
    setStage(0);
    setShowResetConfirm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (activated) {
    return <ActivationSuccess deployment={draft} />;
  }

  return (
    <PartnerRoomLayout>
      {showResetConfirm && (
        <ResetConfirmDialog onConfirm={handleReset} onCancel={() => setShowResetConfirm(false)} />
      )}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            JALDO Travel · Build &amp; Configure
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 14, maxWidth: 720 }}>
            Configure Your Travel Deployment
          </h1>
          <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, maxWidth: 680, margin: 0 }}>
            A guided 9-stage configuration workflow. Each stage builds on the last — from environment and systems through to governance, scenarios and activation. All configuration is stored locally as synthetic demonstration data.
          </p>
        </div>

        {/* Active deployment notice */}
        {activeDeployment && (
          <div style={{ padding: "12px 16px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)" }}>
              <span style={{ color: C.green, fontWeight: 700 }}>Active deployment: </span>
              {activeDeployment.deploymentName} · {activeDeployment.scenarios.filter(s => s.active).length} scenarios · {activeDeployment.deploymentStatus}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/partner-room/operations">
                <span style={{ fontSize: 10, color: C.green, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}>Open Execution Centre →</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", padding: "4px 12px", fontWeight: 700 }}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        <Disclaimer />
        <ProgressBar current={stage} onNavigate={setStage} />

        {/* Stage content */}
        <div style={{ minHeight: 460 }}>
          {stage === 0 && <Stage1 draft={draft} setDraft={setDraft} />}
          {stage === 1 && <Stage2 draft={draft} setDraft={setDraft} />}
          {stage === 2 && <Stage3 draft={draft} setDraft={setDraft} />}
          {stage === 3 && <Stage4 draft={draft} setDraft={setDraft} />}
          {stage === 4 && <Stage5 draft={draft} setDraft={setDraft} />}
          {stage === 5 && <Stage6 draft={draft} setDraft={setDraft} preselectedScenarioId={preselectedScenarioId} />}
          {stage === 6 && <Stage7 draft={draft} setDraft={setDraft} />}
          {stage === 7 && <Stage8 draft={draft} setDraft={setDraft} />}
          {stage === 8 && <Stage9 draft={draft} onActivate={handleActivate} />}
          {stage === 8 && activationError && (
            <div role="alert" style={{ marginTop: 12, padding: "12px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.9)", fontSize: 11, lineHeight: 1.6 }}>
              Activation blocked: {activationError}
            </div>
          )}
        </div>

        <NavFooter
          stage={stage}
          total={STAGES.length}
          onPrev={() => { setStage(s => Math.max(0, s - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          onNext={() => { setStage(s => Math.min(STAGES.length - 1, s + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      </div>
    </PartnerRoomLayout>
  );
}
