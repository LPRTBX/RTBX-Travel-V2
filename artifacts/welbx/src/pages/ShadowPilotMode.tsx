import { useState, useEffect } from "react";
import { Link } from "wouter";

/* ─── Palette ──────────────────────────────────────────────────── */
const P = {
  bg:       "hsl(220 13% 5%)",
  navy:     "hsl(220 16% 9%)",
  navy2:    "hsl(220 14% 12%)",
  border:   "hsl(220 13% 18%)",
  amber:    "#c9a84c",
  amberDim: "rgba(201,168,76,0.12)",
  white:    "#f8f9fb",
  muted:    "hsl(220 10% 55%)",
  dimmed:   "hsl(220 10% 35%)",
  green:    "#10b981",
  greenDim: "rgba(16,185,129,0.1)",
  red:      "#ef4444",
  orange:   "#f59e0b",
  violet:   "#a78bfa",
  cyan:     "#22d3ee",
  blue:     "#60a5fa",
};

/* ─── Finding types ────────────────────────────────────────────── */
interface Finding {
  key: string;
  label: string;
  desc: string;
  color: string;
  dim: string;
}

const FINDINGS: Finding[] = [
  { key: "same_outcome",        label: "Same Outcome",          desc: "WELBX and the traditional approach reached the same result.",                 color: P.muted,   dim: "rgba(140,150,170,0.1)" },
  { key: "faster_visibility",   label: "Faster Visibility",     desc: "WELBX would have flagged the situation significantly sooner.",               color: P.blue,    dim: "rgba(96,165,250,0.1)" },
  { key: "better_decision",     label: "Better Decision",       desc: "WELBX's recommendation was more precise, timely, or appropriate.",           color: P.violet,  dim: "rgba(167,139,250,0.1)" },
  { key: "better_coordination", label: "Better Coordination",   desc: "WELBX would have aligned more departments more effectively.",                color: P.cyan,    dim: "rgba(34,211,238,0.1)" },
  { key: "improved_guest",      label: "Improved Guest Outcome",desc: "The guest experience would have been measurably better.",                    color: P.amber,   dim: P.amberDim },
  { key: "reduced_escalation",  label: "Reduced Escalation Risk",desc: "WELBX would have prevented the situation from worsening or escalating.",   color: P.orange,  dim: "rgba(245,158,11,0.1)" },
  { key: "learning_captured",   label: "Learning Captured",     desc: "WELBX would have generated a reusable insight from this event.",            color: P.green,   dim: P.greenDim },
];

/* ─── Data types ───────────────────────────────────────────────── */
export interface ShadowEntry {
  id: string;
  ref: string;
  createdAt: string;
  whatHappened: string;
  welbxDetected: string;
  welbxRecommended: string;
  communicationTriggered: string;
  actionFollowed: string;
  outcomeImproved: string;
  findings: string[];
}

const STORAGE_KEY = "welbx_shadow_pilot_entries";

function loadEntries(): ShadowEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ShadowEntry[]) : [];
  } catch { return []; }
}
function saveEntries(entries: ShadowEntry[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch { /* */ }
}
function uid() {
  return `SP-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/* ─── Form fields ──────────────────────────────────────────────── */
const FIELDS: Array<{ key: keyof Omit<ShadowEntry, "id"|"ref"|"createdAt"|"findings">; label: string; placeholder: string; color: string }> = [
  { key: "whatHappened",          label: "What Actually Happened",                color: P.red,    placeholder: "Describe the real operational event as it unfolded — guest, context, timing, staff involved." },
  { key: "welbxDetected",         label: "What WELBX Would Have Detected",        color: P.blue,   placeholder: "Which signals would WELBX have picked up? What data sources would have triggered it?" },
  { key: "welbxRecommended",      label: "What WELBX Would Have Recommended",     color: P.violet, placeholder: "What decision or action would the playbook engine have issued? To whom and at what urgency?" },
  { key: "communicationTriggered",label: "What Communication Would Have Triggered",color: P.cyan,  placeholder: "Which channels, recipients and message content would WELBX have dispatched?" },
  { key: "actionFollowed",        label: "What Action Would Have Followed",        color: P.amber,  placeholder: "What operational step would have been taken as a result — by which team, within what timeframe?" },
  { key: "outcomeImproved",       label: "What Outcome May Have Improved",         color: P.green,  placeholder: "How might the guest experience, operational efficiency or staff load have differed?" },
];

/* ─── Empty form state ─────────────────────────────────────────── */
const EMPTY_FORM = {
  ref: "",
  whatHappened: "",
  welbxDetected: "",
  welbxRecommended: "",
  communicationTriggered: "",
  actionFollowed: "",
  outcomeImproved: "",
  findings: [] as string[],
};

/* ─── Finding badge ────────────────────────────────────────────── */
function FindingBadge({ fkey, small }: { fkey: string; small?: boolean }) {
  const f = FINDINGS.find(x => x.key === fkey);
  if (!f) return null;
  return (
    <span style={{
      fontSize: small ? 7 : 8, fontWeight: 700, letterSpacing: "0.08em",
      color: f.color, border: `1px solid ${f.color}35`,
      background: f.dim, borderRadius: 3,
      padding: small ? "1px 5px" : "2px 7px",
      whiteSpace: "nowrap",
    }}>{f.label}</span>
  );
}

/* ─── Empty state ──────────────────────────────────────────────── */
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 48, textAlign: "center",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: P.amberDim, border: `1px solid ${P.amber}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, marginBottom: 20,
      }}>◎</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: P.white, marginBottom: 8 }}>
        No shadow pilot entries yet
      </div>
      <div style={{ fontSize: 12, color: P.muted, maxWidth: 340, lineHeight: 1.7, marginBottom: 24 }}>
        Record a real hotel event and simulate what WELBX would have done. Each entry builds your validation evidence.
      </div>
      <button
        onClick={onNew}
        style={{
          padding: "10px 24px", borderRadius: 5,
          border: `1px solid ${P.amber}50`, background: P.amberDim,
          color: P.amber, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          cursor: "pointer",
        }}
      >+ LOG FIRST FINDING</button>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────── */
export default function ShadowPilotMode() {
  const [entries, setEntries] = useState<ShadowEntry[]>(loadEntries);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"view" | "new" | "edit">("new");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (entries.length > 0 && !selectedId) {
      setSelectedId(entries[0].id);
      setMode("view");
    }
  }, []);

  const selected = entries.find(e => e.id === selectedId) ?? null;

  function startNew() {
    setSelectedId(null);
    setMode("new");
    setForm({ ...EMPTY_FORM });
    setSaved(false);
  }

  function selectEntry(id: string) {
    setSelectedId(id);
    setMode("view");
    setSaved(false);
  }

  function startEdit() {
    if (!selected) return;
    setForm({
      ref: selected.ref,
      whatHappened: selected.whatHappened,
      welbxDetected: selected.welbxDetected,
      welbxRecommended: selected.welbxRecommended,
      communicationTriggered: selected.communicationTriggered,
      actionFollowed: selected.actionFollowed,
      outcomeImproved: selected.outcomeImproved,
      findings: [...selected.findings],
    });
    setMode("edit");
    setSaved(false);
  }

  function handleSave() {
    if (!form.whatHappened.trim()) return;
    if (mode === "new") {
      const fallbackRef = form.ref.trim() || `Shadow Event ${entries.length + 1}`;
      const entry: ShadowEntry = {
        id: uid(),
        createdAt: new Date().toISOString(),
        ...form,
        ref: fallbackRef,
      };
      const updated = [entry, ...entries];
      setEntries(updated);
      saveEntries(updated);
      setSelectedId(entry.id);
      setMode("view");
      setSaved(true);
    } else if (mode === "edit" && selected) {
      const updated = entries.map(e => e.id === selected.id
        ? { ...e, ...form, ref: form.ref.trim() || e.ref }
        : e
      );
      setEntries(updated);
      saveEntries(updated);
      setMode("view");
      setSaved(true);
    }
  }

  function handleDelete(id: string) {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
    if (selectedId === id) {
      if (updated.length > 0) { setSelectedId(updated[0].id); setMode("view"); }
      else { setSelectedId(null); setMode("new"); }
    }
  }

  function toggleFinding(key: string) {
    setForm(prev => ({
      ...prev,
      findings: prev.findings.includes(key)
        ? prev.findings.filter(k => k !== key)
        : [...prev.findings, key],
    }));
    setSaved(false);
  }

  /* ── Aggregate stats ── */
  const findingCounts: Record<string, number> = {};
  FINDINGS.forEach(f => { findingCounts[f.key] = entries.filter(e => e.findings.includes(f.key)).length; });
  const topFinding = FINDINGS.reduce((best, f) =>
    findingCounts[f.key] > findingCounts[best.key] ? f : best, FINDINGS[0]);

  return (
    <div style={{
      marginLeft: 224, minHeight: "100vh",
      background: P.bg, color: P.white,
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>

      {/* ── Page header ── */}
      <div style={{
        borderBottom: `1px solid ${P.border}`, padding: "0 32px",
        background: P.navy,
        flexShrink: 0,
      }}>
        <div style={{ padding: "20px 0 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.18em",
                color: P.amber, padding: "2px 8px",
                border: `1px solid ${P.amber}30`, background: P.amberDim,
              }}>SHADOW PILOT · INACTIVE</span>
              <span style={{ fontSize: 8, color: P.dimmed }}>WELBX Shadow Pilot Mode · v1.0</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: P.white, letterSpacing: "-0.02em", marginBottom: 5 }}>
              Shadow Pilot Mode
            </h1>
            <p style={{ fontSize: 11, color: P.muted, maxWidth: 560, lineHeight: 1.65 }}>
              Simulate how WELBX would run alongside real hotel operations — without touching live systems.
              Log actual events, then map what WELBX would have detected, recommended, and improved.
            </p>
          </div>

          {/* Stats strip */}
          {entries.length > 0 && (
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexShrink: 0 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: P.amber, lineHeight: 1 }}>{entries.length}</div>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginTop: 2 }}>ENTRIES</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: P.green, lineHeight: 1 }}>
                  {entries.filter(e => e.findings.includes("improved_guest")).length}
                </div>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginTop: 2 }}>GUEST<br />IMPROVED</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: P.blue, lineHeight: 1 }}>
                  {entries.filter(e => e.findings.includes("faster_visibility")).length}
                </div>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginTop: 2 }}>FASTER<br />VISIBILITY</div>
              </div>
              {entries.length >= 2 && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: topFinding.color, lineHeight: 1.3, maxWidth: 80 }}>{topFinding.label}</div>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginTop: 2 }}>TOP FINDING</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Finding frequency bar */}
        {entries.length > 0 && (
          <div style={{ display: "flex", gap: 6, paddingBottom: 14, flexWrap: "wrap" }}>
            {FINDINGS.map(f => {
              const count = findingCounts[f.key];
              return (
                <div key={f.key} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "3px 8px 3px 5px",
                  background: count > 0 ? f.dim : "transparent",
                  border: `1px solid ${count > 0 ? f.color + "30" : P.border}`,
                  borderRadius: 3,
                  opacity: count > 0 ? 1 : 0.35,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: f.color, minWidth: 16, textAlign: "center" }}>{count}</span>
                  <span style={{ fontSize: 7.5, fontWeight: 600, color: count > 0 ? f.color : P.dimmed, letterSpacing: "0.06em" }}>{f.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* Left: entry list */}
        <div style={{
          width: 248, flexShrink: 0,
          borderRight: `1px solid ${P.border}`,
          overflowY: "auto", background: P.navy,
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ padding: "10px 12px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: P.dimmed, textTransform: "uppercase" }}>
              {entries.length} {entries.length === 1 ? "ENTRY" : "ENTRIES"}
            </span>
            <button
              onClick={startNew}
              style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                color: P.amber, background: "transparent",
                border: `1px solid ${P.amber}35`, borderRadius: 3,
                padding: "3px 8px", cursor: "pointer",
              }}
            >+ NEW</button>
          </div>

          {entries.length === 0 ? (
            <div style={{ padding: "20px 14px", fontSize: 10, color: P.dimmed, lineHeight: 1.6 }}>
              No entries yet. Log your first shadow pilot event using the form on the right.
            </div>
          ) : (
            entries.map(entry => {
              const isActive = entry.id === selectedId && mode !== "new";
              return (
                <div
                  key={entry.id}
                  onClick={() => selectEntry(entry.id)}
                  style={{
                    borderLeft: isActive ? `2px solid ${P.amber}` : "2px solid transparent",
                    background: isActive ? "hsl(220 13% 11%)" : "transparent",
                    padding: "9px 14px 9px 12px", cursor: "pointer",
                    transition: "all 0.12s",
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 600, color: isActive ? P.white : P.muted, marginBottom: 3, lineHeight: 1.3 }}>
                    {entry.ref}
                  </div>
                  <div style={{ fontSize: 8, color: P.dimmed, marginBottom: 5 }}>
                    {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    {entry.findings.length > 0 && (
                      <span style={{ marginLeft: 6, color: P.amber }}>· {entry.findings.length} finding{entry.findings.length !== 1 ? "s" : ""}</span>
                    )}
                  </div>
                  {entry.findings.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {entry.findings.slice(0, 3).map(k => <FindingBadge key={k} fkey={k} small />)}
                      {entry.findings.length > 3 && (
                        <span style={{ fontSize: 7, color: P.dimmed }}>+{entry.findings.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right: form or detail */}
        {mode === "view" && selected ? (
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 48px 80px" }}>
            {/* View header */}
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${P.border}`,
            }}>
              <div>
                <div style={{ fontSize: 9, fontFamily: "monospace", color: P.dimmed, marginBottom: 5 }}>
                  {selected.id} · {new Date(selected.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: P.white, letterSpacing: "-0.01em", marginBottom: 10 }}>
                  {selected.ref}
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selected.findings.length === 0
                    ? <span style={{ fontSize: 10, color: P.dimmed }}>No findings recorded</span>
                    : selected.findings.map(k => <FindingBadge key={k} fkey={k} />)
                  }
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={startEdit}
                  style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                    color: P.muted, background: "transparent",
                    border: `1px solid ${P.border}`, borderRadius: 4,
                    padding: "7px 14px", cursor: "pointer",
                  }}
                >EDIT</button>
                <button
                  onClick={() => handleDelete(selected.id)}
                  style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                    color: P.dimmed, background: "transparent",
                    border: `1px solid ${P.border}`, borderRadius: 4,
                    padding: "7px 14px", cursor: "pointer",
                  }}
                >DELETE</button>
              </div>
            </div>

            {/* Field values */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {FIELDS.map(f => {
                const val = selected[f.key as keyof typeof selected] as string;
                if (!val) return null;
                return (
                  <div key={f.key}>
                    <div style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                      color: f.color, textTransform: "uppercase", marginBottom: 8,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{ width: 3, height: 14, background: f.color, borderRadius: 2, display: "inline-block" }} />
                      {f.label}
                    </div>
                    <div style={{
                      padding: "14px 18px",
                      background: P.navy, border: `1px solid ${P.border}`,
                      borderLeft: `3px solid ${f.color}30`,
                      borderRadius: "0 6px 6px 0",
                      fontSize: 12, color: P.white, lineHeight: 1.75,
                    }}>
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shadow Pilot Finding summary */}
            <div style={{
              marginTop: 32, padding: "20px 24px",
              background: P.navy, border: `1px solid ${P.border}`,
              borderRadius: 8,
            }}>
              <div style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.16em",
                color: P.dimmed, textTransform: "uppercase", marginBottom: 14,
              }}>SHADOW PILOT FINDING</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {FINDINGS.map(f => {
                  const active = selected.findings.includes(f.key);
                  return (
                    <div key={f.key} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "10px 12px",
                      background: active ? f.dim : "transparent",
                      border: `1px solid ${active ? f.color + "30" : P.border}`,
                      borderRadius: 6,
                      opacity: active ? 1 : 0.4,
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 3,
                        background: active ? f.color : P.dimmed,
                      }} />
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: active ? f.color : P.dimmed, marginBottom: 2 }}>
                          {f.label}
                        </div>
                        <div style={{ fontSize: 9, color: P.dimmed, lineHeight: 1.55 }}>{f.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        ) : entries.length === 0 && mode !== "new" ? (
          <EmptyState onNew={startNew} />

        ) : (
          /* ── Form (new or edit) ── */
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 48px 100px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 6,
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: P.white, letterSpacing: "-0.01em" }}>
                {mode === "edit" ? "Edit Entry" : "New Shadow Pilot Entry"}
              </h2>
              {mode === "edit" && (
                <button
                  onClick={() => { setMode("view"); }}
                  style={{ fontSize: 9, fontWeight: 600, color: P.dimmed, background: "transparent", border: "none", cursor: "pointer" }}
                >
                  CANCEL
                </button>
              )}
            </div>
            <p style={{ fontSize: 11, color: P.muted, marginBottom: 28, lineHeight: 1.6 }}>
              Record a real hotel event, then fill in how WELBX would have responded. Select the findings that apply.
            </p>

            {/* Incident reference */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                color: P.dimmed, textTransform: "uppercase", display: "block", marginBottom: 7,
              }}>Incident Reference</label>
              <input
                type="text"
                value={form.ref}
                onChange={e => { setForm(p => ({ ...p, ref: e.target.value })); setSaved(false); }}
                placeholder="e.g. Late Departure — VIP Guest, Floor 12, 14 Jun"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: P.navy, border: `1px solid ${P.border}`,
                  borderRadius: 6, padding: "10px 14px",
                  color: P.white, fontSize: 13,
                  outline: "none", fontFamily: "'Inter', system-ui, sans-serif",
                }}
                onFocus={e => (e.target.style.borderColor = P.amber + "60")}
                onBlur={e => (e.target.style.borderColor = P.border)}
              />
            </div>

            {/* Six field textareas */}
            {FIELDS.map(f => (
              <div key={f.key} style={{ marginBottom: 18 }}>
                <label style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                  color: f.color, textTransform: "uppercase",
                  display: "flex", alignItems: "center", gap: 7, marginBottom: 7,
                }}>
                  <span style={{ width: 3, height: 12, background: f.color, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
                  {f.label}
                </label>
                <textarea
                  value={(form as Record<string, unknown>)[f.key] as string}
                  onChange={e => { setForm(p => ({ ...p, [f.key]: e.target.value })); setSaved(false); }}
                  placeholder={f.placeholder}
                  rows={3}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: P.navy, border: `1px solid ${P.border}`,
                    borderLeft: `3px solid ${f.color}25`,
                    borderRadius: "0 6px 6px 0",
                    padding: "12px 16px", color: P.white,
                    fontSize: 12, lineHeight: 1.7, resize: "vertical",
                    outline: "none", fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                  onFocus={e => (e.target.style.borderColor = f.color + "50")}
                  onBlur={e => (e.target.style.borderColor = P.border)}
                />
              </div>
            ))}

            {/* Shadow Pilot Findings */}
            <div style={{ marginBottom: 28 }}>
              <div style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "0.16em",
                color: P.dimmed, textTransform: "uppercase", marginBottom: 14,
              }}>SHADOW PILOT FINDING — select all that apply</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {FINDINGS.map(f => {
                  const active = form.findings.includes(f.key);
                  return (
                    <div
                      key={f.key}
                      onClick={() => toggleFinding(f.key)}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 10,
                        padding: "12px 14px", cursor: "pointer",
                        background: active ? f.dim : "transparent",
                        border: `1px solid ${active ? f.color + "40" : P.border}`,
                        borderRadius: 6, transition: "all 0.15s",
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: 14, height: 14, borderRadius: 3, flexShrink: 0, marginTop: 1,
                        border: `2px solid ${active ? f.color : P.dimmed}`,
                        background: active ? f.color : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.12s",
                      }}>
                        {active && <span style={{ fontSize: 9, color: P.bg, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: active ? f.color : P.muted, marginBottom: 3 }}>
                          {f.label}
                        </div>
                        <div style={{ fontSize: 9.5, color: P.dimmed, lineHeight: 1.55 }}>{f.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Fixed save bar (form mode only) ── */}
      {(mode === "new" || mode === "edit") && (
        <div style={{
          position: "fixed", bottom: 0, left: 224, right: 0,
          background: P.navy, borderTop: `1px solid ${P.border}`,
          padding: "14px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          zIndex: 100,
        }}>
          <div style={{ fontSize: 11, color: P.dimmed }}>
            {form.findings.length > 0
              ? <>{form.findings.length} finding{form.findings.length !== 1 ? "s" : ""} selected</>
              : "Select at least one Shadow Pilot Finding before saving"}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {saved && <span style={{ fontSize: 11, color: P.green, fontWeight: 600 }}>✓ Saved</span>}
            <button
              onClick={handleSave}
              disabled={!form.whatHappened.trim()}
              style={{
                padding: "9px 28px", borderRadius: 5,
                border: `1px solid ${form.whatHappened.trim() ? P.amber + "60" : P.border}`,
                background: form.whatHappened.trim() ? P.amberDim : "transparent",
                color: form.whatHappened.trim() ? P.amber : P.dimmed,
                fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                cursor: form.whatHappened.trim() ? "pointer" : "default",
                opacity: form.whatHappened.trim() ? 1 : 0.5,
              }}
            >
              {mode === "edit" ? "SAVE CHANGES" : "SAVE FINDING →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
