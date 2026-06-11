import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PROPERTIES, ROLES, type PropertyId, type RoleId } from "@/data/entities";

const SECTIONS = [
  {
    id: "signals",
    label: "SIGNALS",
    color: "#3b82f6",
    items: [
      { label: "Signal Registry",     path: "/signal-registry",     sub: "SENSING LAYER" },
      { label: "Signal Intelligence", path: "/signal-intelligence", sub: "ANALYTICS" },
    ],
  },
  {
    id: "moments",
    label: "MOMENTS",
    color: "#c9a84c",
    items: [
      { label: "Moment Registry",     path: "/moment-registry",     sub: "20 MOMENTS" },
      { label: "Moment Intelligence", path: "/moment-intelligence", sub: "BXOS ANALYSIS" },
      { label: "Live Moments",        path: "/live-moments",        sub: "6 ACTIVE" },
    ],
  },
  {
    id: "decisions",
    label: "DECISIONS",
    color: "#a78bfa",
    items: [
      { label: "Decision Registry",   path: "/decision-registry",   sub: "AUDIT LOG" },
      { label: "Playbook Engine",     path: "/playbook-engine",     sub: "EXECUTION RULES" },
      { label: "Intervention Library",path: "/intervention-library",sub: "RESPONSE CATALOGUE" },
    ],
  },
  {
    id: "execution",
    label: "EXECUTION",
    color: "#10b981",
    items: [
      { label: "Command Centre",      path: "/command-centre",      sub: "LIVE OPS" },
      { label: "Execution Timeline",  path: "/execution-timeline",  sub: "REPLAY" },
      { label: "Behavioural Genome",  path: "/behavioural-genome",  sub: "PROFILES" },
    ],
  },
  {
    id: "comms",
    label: "COMMUNICATIONS",
    color: "#22d3ee",
    items: [
      { label: "Communications",         path: "/communications",             sub: "ORCHESTRATION" },
      { label: "Communication Registry", path: "/communication-registry",     sub: "LOG" },
      { label: "Comm Intelligence",      path: "/communication-intelligence", sub: "ANALYTICS" },
    ],
  },
  {
    id: "outcomes",
    label: "OUTCOMES",
    color: "#10b981",
    items: [
      { label: "Outcome Registry",    path: "/outcome-registry",    sub: "RESULTS" },
      { label: "Outcome Intelligence",path: "/outcome-intelligence",sub: "PATTERN VIEW" },
      { label: "Learning Layer",      path: "/learning-layer",      sub: "GHSOL STEP 6" },
    ],
  },
  {
    id: "value",
    label: "VALUE",
    color: "#c9a84c",
    items: [
      { label: "Executive Dashboard", path: "/executive-dashboard", sub: "PORTFOLIO" },
      { label: "Strategic Visibility",path: "/strategic-visibility",sub: "PATTERNS" },
      { label: "Execution Index",     path: "/execution-index",     sub: "EXECUTION QUALITY" },
      { label: "Consistency Engine",  path: "/consistency-engine",  sub: "VARIABILITY" },
      { label: "Environment Health",  path: "/environment-health",  sub: "INDEX" },
      { label: "Value Proof",         path: "/value-proof",         sub: "ROI DASHBOARD" },
    ],
  },
  {
    id: "platform",
    label: "PLATFORM",
    color: "hsl(215 16% 38%)",
    items: [
      { label: "Causal Trace",        path: "/causal-trace",        sub: "FULL CHAIN" },
      { label: "System State",        path: "/system-state",        sub: "ELEVATED" },
      { label: "Guest Layer",         path: "/guest-layer",         sub: "ENGAGEMENT" },
      { label: "Scenario Demo",       path: "/scenario-demo",       sub: "DEMO" },
    ],
  },
];

const HERO_ITEMS = [
  { label: "GHSOL",        path: "/ghsol",        sub: "FRAMEWORK",  accent: "#c9a84c" },
  { label: "Live Demo",    path: "/demo",         sub: "GUIDED",     accent: "#c9a84c" },
  { label: "Comparison",  path: "/compare",      sub: "PROOF",      accent: undefined },
  { label: "Command Mode", path: "/command-mode", sub: "CRITICAL",   accent: "#ef4444" },
];

interface NavItemProps {
  label: string;
  path: string;
  sub: string;
  accent?: string;
  isActive: boolean;
}

function NavItem({ label, path, sub, accent, isActive }: NavItemProps) {
  return (
    <Link href={path}>
      <div
        style={{
          position: "relative",
          padding: "7px 20px",
          cursor: "pointer",
          transition: "all 0.12s",
          background: isActive ? "hsl(220 13% 8%)" : "transparent",
          borderLeft: isActive ? `2px solid ${accent ?? "#c9a84c"}` : "2px solid transparent",
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.015em", color: isActive ? "#fff" : "hsl(215 16% 46%)", transition: "color 0.12s" }}>
          {label}
        </div>
        <div style={{ fontSize: 8, letterSpacing: "0.12em", marginTop: 1, fontWeight: 700, color: isActive ? (accent ?? "#c9a84c") : "hsl(215 16% 26%)" }}>
          {sub}
        </div>
      </div>
    </Link>
  );
}

export function Sidebar() {
  const [location] = useLocation();
  const { activeProperty, setActiveProperty, activeRole, setActiveRole, setSearchOpen } = useApp();
  const [propOpen, setPropOpen] = useState(false);

  const prop = PROPERTIES.find(p => p.id === activeProperty) ?? PROPERTIES[0];

  const cycleProperty = () => {
    const idx = PROPERTIES.findIndex(p => p.id === activeProperty);
    setActiveProperty(PROPERTIES[(idx + 1) % PROPERTIES.length].id as PropertyId);
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 w-56 flex flex-col z-50"
      style={{ background: "hsl(220 13% 4%)", borderRight: "1px solid hsl(220 13% 9%)" }}
    >
      {/* Wordmark + property */}
      <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid hsl(220 13% 9%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <Link href="/">
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", color: "#fff", textTransform: "uppercase", cursor: "pointer" }}>WELBX</span>
          </Link>
          <button
            onClick={() => setSearchOpen(true)}
            title="Search (Cmd+K)"
            style={{ background: "none", border: "none", cursor: "pointer", color: "hsl(215 16% 30%)", padding: "3px", display: "flex", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "hsl(215 16% 55%)")}
            onMouseLeave={e => (e.currentTarget.style.color = "hsl(215 16% 30%)")}
          >
            <Search size={12} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
          <span style={{ fontSize: 8, letterSpacing: "0.14em", color: "hsl(215 16% 34%)", textTransform: "uppercase", fontWeight: 700 }}>SYSTEM ACTIVE</span>
        </div>

        {/* Property selector */}
        <button
          onClick={cycleProperty}
          title="Click to switch property"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
            padding: "6px 8px", background: "hsl(220 13% 7%)", border: "1px solid hsl(220 13% 12%)",
            cursor: "pointer", transition: "all 0.15s", marginBottom: 8,
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "hsl(220 13% 20%)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(220 13% 12%)")}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "hsl(215 16% 60%)", letterSpacing: "0.02em" }}>{prop.label}</div>
            <div style={{ fontSize: 7.5, letterSpacing: "0.1em", color: "hsl(215 16% 30%)", textTransform: "uppercase" }}>{prop.city}</div>
          </div>
          <ChevronDown size={9} style={{ color: "hsl(215 16% 30%)", flexShrink: 0 }} />
        </button>

        {/* Role selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
          {ROLES.map(r => {
            const active = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id as RoleId)}
                title={r.full}
                style={{
                  padding: "4px 0", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  border: `1px solid ${active ? "rgba(201,168,76,0.4)" : "hsl(220 13% 12%)"}`,
                  background: active ? "rgba(201,168,76,0.08)" : "transparent",
                  color: active ? "#c9a84c" : "hsl(215 16% 30%)",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", paddingBottom: 12 }}>
        {SECTIONS.map((section) => {
          const hasActive = section.items.some(i => location === i.path);
          return (
            <div key={section.id}>
              <div style={{
                padding: "10px 20px 4px",
                fontSize: 7, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                color: hasActive ? section.color : "hsl(215 16% 18%)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {hasActive && <div style={{ width: 3, height: 3, borderRadius: "50%", background: section.color, flexShrink: 0 }} />}
                {section.label}
              </div>
              {section.items.map(item => (
                <NavItem
                  key={item.path}
                  {...item}
                  isActive={location === item.path}
                />
              ))}
            </div>
          );
        })}

        {/* Hero section */}
        <div style={{ margin: "10px 20px 4px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: "hsl(220 13% 9%)" }} />
          <span style={{ fontSize: 7, letterSpacing: "0.18em", color: "hsl(215 16% 18%)", textTransform: "uppercase", fontWeight: 700, flexShrink: 0 }}>HERO</span>
          <div style={{ flex: 1, height: 1, background: "hsl(220 13% 9%)" }} />
        </div>
        {HERO_ITEMS.map(item => (
          <NavItem
            key={item.path}
            {...item}
            isActive={location === item.path}
          />
        ))}
      </nav>

      {/* Footer engines */}
      <div style={{ padding: "12px 20px 14px", borderTop: "1px solid hsl(220 13% 9%)" }}>
        <div style={{ fontSize: 7, letterSpacing: "0.18em", color: "hsl(215 16% 18%)", textTransform: "uppercase", marginBottom: 7, fontWeight: 700 }}>Engines</div>
        {[
          { name: "BXOS",   desc: "Intelligence" },
          { name: "NEXUS",  desc: "Routing" },
          { name: "VECTOR", desc: "Execution" },
        ].map(e => (
          <div key={e.name} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "2.5px 0" }}>
            <span style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "hsl(215 16% 26%)", textTransform: "uppercase", fontWeight: 700 }}>{e.name}</span>
            <span style={{ fontSize: 7.5, letterSpacing: "0.08em", color: "hsl(215 16% 18%)", textTransform: "uppercase" }}>{e.desc}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, padding: "4px 6px", background: "hsl(220 13% 7%)", border: "1px solid hsl(220 13% 11%)", textAlign: "center" }}>
          <span style={{ fontSize: 7, letterSpacing: "0.1em", color: "hsl(215 16% 20%)", textTransform: "uppercase" }}>
            Cmd+K · Search
          </span>
        </div>
      </div>
    </aside>
  );
}
