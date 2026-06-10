import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Search, X, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

const SEARCH_ENTRIES = [
  { label: "Landing",                   path: "/",                       section: "FOUNDATION",       desc: "Why WELBX — the problem it solves" },
  { label: "GHSOL",                     path: "/ghsol",                  section: "FOUNDATION",       desc: "Framework — the 6-step operating chain" },
  { label: "Signal Registry",           path: "/signal-registry",        section: "SIGNALS",          desc: "247 signals catalogued, weighted and mapped" },
  { label: "Signal Intelligence",       path: "/signal-intelligence",    section: "SIGNALS",          desc: "Pattern analytics across signal categories" },
  { label: "Moment Registry",           path: "/moment-registry",        section: "MOMENTS",          desc: "20 canonical behavioural moments" },
  { label: "Moment Intelligence",       path: "/moment-intelligence",    section: "MOMENTS",          desc: "BXOS analysis — moment pattern view" },
  { label: "Live Moments",              path: "/live-moments",           section: "MOMENTS",          desc: "6 active moments — real-time feed" },
  { label: "Decision Registry",         path: "/decision-registry",      section: "DECISIONS",        desc: "Audit log of all decisions made" },
  { label: "Playbook Engine",           path: "/playbook-engine",        section: "DECISIONS",        desc: "Execution rules — trigger conditions" },
  { label: "Intervention Library",      path: "/intervention-library",   section: "DECISIONS",        desc: "Response catalogue — 12 intervention types" },
  { label: "Command Centre",            path: "/command-centre",         section: "EXECUTION",        desc: "Live operations — active monitoring" },
  { label: "Execution Timeline",        path: "/execution-timeline",     section: "EXECUTION",        desc: "Replay — full execution history" },
  { label: "Behavioural Genome",        path: "/behavioural-genome",     section: "EXECUTION",        desc: "Guest and staff behavioural profiles" },
  { label: "Communications",            path: "/communications",         section: "COMMUNICATIONS",   desc: "Message orchestration layer" },
  { label: "Communication Registry",   path: "/communication-registry", section: "COMMUNICATIONS",   desc: "Full message log — all communications" },
  { label: "Communication Intelligence",path: "/communication-intelligence", section: "COMMUNICATIONS", desc: "Influence layer — message effectiveness" },
  { label: "Outcome Registry",          path: "/outcome-registry",       section: "OUTCOMES",         desc: "Full chain — every moment resolved" },
  { label: "Outcome Intelligence",      path: "/outcome-intelligence",   section: "OUTCOMES",         desc: "Today view — outcome patterns" },
  { label: "Learning Layer",            path: "/learning-layer",         section: "OUTCOMES",         desc: "GHSOL step 6 — what the system learned" },
  { label: "Executive Dashboard",       path: "/executive-dashboard",    section: "VALUE",            desc: "Portfolio view — board-ready summary" },
  { label: "Strategic Visibility",      path: "/strategic-visibility",   section: "VALUE",            desc: "Patterns — strategic intelligence layer" },
  { label: "Execution Index",           path: "/execution-index",        section: "VALUE",            desc: "Execution quality across all moments" },
  { label: "Consistency Engine",        path: "/consistency-engine",     section: "VALUE",            desc: "Variability analysis — consistency score" },
  { label: "Environment Health",        path: "/environment-health",     section: "VALUE",            desc: "Property health index" },
  { label: "Value Proof",               path: "/value-proof",            section: "VALUE",            desc: "ROI dashboard — board-ready financials" },
  { label: "Causal Trace",              path: "/causal-trace",           section: "PLATFORM",         desc: "Full GHSOL chain for any moment" },
  { label: "System State",              path: "/system-state",           section: "PLATFORM",         desc: "Platform status — elevated mode active" },
  { label: "Guest Layer",               path: "/guest-layer",            section: "PLATFORM",         desc: "Guest engagement intelligence" },
  { label: "Scenario Demo",             path: "/scenario-demo",          section: "PLATFORM",         desc: "Guided walkthrough — 8-step demo" },
  { label: "Live Demo",                 path: "/demo",                   section: "HERO",             desc: "Full guided experience" },
  { label: "Comparison",               path: "/compare",                section: "HERO",             desc: "WELBX vs. standard operations" },
  { label: "Command Mode",              path: "/command-mode",           section: "HERO",             desc: "Critical response — 4-phase live demo" },
];

const SECTION_COLORS: Record<string, string> = {
  FOUNDATION:     "#c9a84c",
  SIGNALS:        "#3b82f6",
  MOMENTS:        "#c9a84c",
  DECISIONS:      "#a78bfa",
  EXECUTION:      "#10b981",
  COMMUNICATIONS: "#22d3ee",
  OUTCOMES:       "#10b981",
  VALUE:          "#c9a84c",
  PLATFORM:       "hsl(215 16% 42%)",
  HERO:           "#ef4444",
};

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useApp();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? SEARCH_ENTRIES.filter(e =>
        e.label.toLowerCase().includes(query.toLowerCase()) ||
        e.desc.toLowerCase().includes(query.toLowerCase()) ||
        e.section.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ENTRIES;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery("");
      setCursor(0);
    }
  }, [searchOpen]);

  useEffect(() => { setCursor(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === "Enter" && filtered[cursor]) {
      navigate(filtered[cursor].path);
      setSearchOpen(false);
    }
  };

  const go = (path: string) => { navigate(path); setSearchOpen(false); };

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSearchOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(7,10,15,0.72)", backdropFilter: "blur(3px)" }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed", top: "18%", left: "50%", transform: "translateX(-50%)",
              width: 560, zIndex: 201,
              background: "hsl(220 13% 6%)", border: "1px solid hsl(220 13% 14%)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.06)",
              maxHeight: "60vh", display: "flex", flexDirection: "column",
            }}
          >
            {/* Search input */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid hsl(220 13% 10%)" }}>
              <Search size={14} style={{ color: "hsl(215 16% 38%)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, features, sections..."
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  fontSize: 13, color: "#fff", fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <kbd style={{ fontSize: 8, padding: "2px 5px", background: "hsl(220 13% 10%)", border: "1px solid hsl(220 13% 14%)", color: "hsl(215 16% 35%)", letterSpacing: "0.04em" }}>ESC</kbd>
                <button onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "hsl(215 16% 38%)", display: "flex" }}>
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Results */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.length === 0 && (
                <div style={{ padding: "28px 20px", textAlign: "center", fontSize: 11, color: "hsl(215 16% 30%)" }}>
                  No pages matching &ldquo;{query}&rdquo;
                </div>
              )}
              {filtered.map((entry, i) => {
                const active = cursor === i;
                const sectionColor = SECTION_COLORS[entry.section] || "#c9a84c";
                return (
                  <div
                    key={entry.path}
                    onClick={() => go(entry.path)}
                    onMouseEnter={() => setCursor(i)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", cursor: "pointer",
                      background: active ? "hsl(220 13% 9%)" : "transparent",
                      borderLeft: active ? `2px solid ${sectionColor}` : "2px solid transparent",
                      borderBottom: "1px solid hsl(220 13% 8%)",
                      transition: "all 0.1s",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: active ? "#fff" : "hsl(215 16% 60%)" }}>{entry.label}</span>
                        <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: sectionColor, border: `1px solid ${sectionColor}25`, padding: "1px 5px", background: `${sectionColor}0d`, flexShrink: 0 }}>{entry.section}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "hsl(215 16% 32%)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.desc}</div>
                    </div>
                    {active && <ArrowRight size={11} style={{ color: sectionColor, flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>

            {/* Footer hint */}
            <div style={{ padding: "8px 18px", borderTop: "1px solid hsl(220 13% 8%)", display: "flex", alignItems: "center", gap: 12 }}>
              {[
                { keys: ["↑", "↓"], label: "navigate" },
                { keys: ["↵"], label: "open" },
                { keys: ["Esc"], label: "close" },
              ].map(hint => (
                <div key={hint.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {hint.keys.map(k => (
                    <kbd key={k} style={{ fontSize: 8, padding: "2px 5px", background: "hsl(220 13% 10%)", border: "1px solid hsl(220 13% 14%)", color: "hsl(215 16% 35%)" }}>{k}</kbd>
                  ))}
                  <span style={{ fontSize: 9, color: "hsl(215 16% 28%)" }}>{hint.label}</span>
                </div>
              ))}
              <div style={{ marginLeft: "auto", fontSize: 8, color: "hsl(215 16% 22%)" }}>{filtered.length} pages</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
