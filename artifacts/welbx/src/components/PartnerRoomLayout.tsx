import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { usePartnerContent } from "@/context/PartnerContentContext";

interface NavItem { label: string; path: string; }
interface NavGroup { label: string; path: string; items: NavItem[]; }

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Start",
    path: "/partner-room",
    items: [
      { label: "Partner Room",    path: "/partner-room" },
      { label: "Overview",        path: "/partner-room/overview" },
      { label: "Operator Brief",  path: "/partner-room/operator-brief" },
    ],
  },
  {
    label: "Platform",
    path: "/partner-room/operating-model",
    items: [
      { label: "Operating Model",          path: "/partner-room/operating-model" },
      { label: "Travel Intelligence",      path: "/partner-room/travel-intelligence" },
      { label: "Travel Operating Systems", path: "/partner-room/travel-operating-systems" },
      { label: "Integration",              path: "/partner-room/integration-brief" },
    ],
  },
  {
    label: "Configure and Execute",
    path: "/partner-room/build-configure",
    items: [
      { label: "Build & Configure",     path: "/partner-room/build-configure" },
      { label: "Execution Centre",      path: "/partner-room/operations" },
      { label: "Decision Spine",        path: "/partner-room/decision-spine" },
      { label: "Communications",        path: "/partner-room/travel-ai-comms" },
      { label: "Evidence and Outcomes", path: "/partner-room/operations#outcome-ledger" },
    ],
  },
  {
    label: "Proof",
    path: "/partner-room/product-proof",
    items: [
      { label: "Product Proof",   path: "/partner-room/product-proof" },
      { label: "Validation",      path: "/partner-room/validation" },
      { label: "Guest View",      path: "/partner-room/guest-demo" },
      { label: "Operator View",   path: "/partner-room/operator-demo" },
      { label: "Dual View",       path: "/partner-room/dual-view-demo" },
    ],
  },
  {
    label: "Pilot and Partnership",
    path: "/partner-room/pilot-model",
    items: [
      { label: "Pilot Model",       path: "/partner-room/pilot-model" },
      { label: "Deployment",        path: "/partner-room/rollout-model" },
      { label: "Commercial",        path: "/partner-room/commercial-unit" },
      { label: "Partner Ecosystem", path: "/partner-room/partner-ecosystem" },
      { label: "Resource Library",  path: "/partner-room/brief-library" },
      { label: "Next Step",         path: "/partner-room/next-step" },
    ],
  },
];

// Min width kept just wide enough for all 5 group labels without wrapping
const DROPDOWN_WIDTH = 260;

interface PartnerRoomLayoutProps {
  children: React.ReactNode;
}

export function PartnerRoomLayout({ children }: PartnerRoomLayoutProps) {
  const [location, navigate] = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const { content } = usePartnerContent();
  const contentVersion = content?.contentVersion ?? "1.0.0";
  const lastUpdated = content?.lastUpdated ?? "24 June 2026";

  // Refs to each group's trigger container (used for click-outside detection)
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Single ref for the currently open dropdown panel (for click-outside)
  const dropdownPanelRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside any group trigger or dropdown panel
  useEffect(() => {
    if (!openGroup) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideAnyGroup = Object.values(groupRefs.current).some(el => el?.contains(target));
      const insideDropdown = dropdownPanelRef.current?.contains(target);
      if (!insideAnyGroup && !insideDropdown) setOpenGroup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openGroup]);

  // Close dropdown on Escape key
  useEffect(() => {
    if (!openGroup) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openGroup]);

  // Close mobile nav on location change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  /**
   * Calculate where to render the fixed-position dropdown.
   * Uses getBoundingClientRect() from the group container ref so the dropdown
   * is positioned relative to the viewport — escaping all overflow contexts.
   */
  function getDropdownPosition(groupLabel: string): { top: number; left: number } | null {
    const el = groupRefs.current[groupLabel];
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    // Ensure dropdown never overflows the right edge
    const safeLeft = Math.min(rect.left, Math.max(0, window.innerWidth - DROPDOWN_WIDTH - 8));
    return { top: rect.bottom, left: safeLeft };
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#080c14", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* ── Top Nav ────────────────────────────────────────────────────────── */}
      <header>
        <nav
          aria-label="Partner Room navigation"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(8,12,20,0.98)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Row 1: Wordmark + controls */}
          <div style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            minHeight: 44,
            gap: 12,
          }}>
            <Link href="/partner-room">
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, cursor: "pointer" }}>
                <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.24em", color: "#fff", textTransform: "uppercase" }}>RTBX Travel</span>
                <span style={{ fontSize: 7.5, letterSpacing: "0.2em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, paddingBottom: 1 }}>Partner Room</span>
              </div>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Desktop-only tagline */}
              <span
                className="rtbx-nav-desc"
                style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 600 }}
              >
                RTBX Travel is powered by RTBX Core · WELBX is the guest-facing experience layer
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#c9a84c" }} aria-hidden="true" />
                <span style={{ fontSize: 7.5, letterSpacing: "0.18em", color: "rgba(201,168,76,0.6)", textTransform: "uppercase", fontWeight: 700 }}>Private</span>
              </div>
              <Link href="/partner-room/next-step">
                <div
                  style={{
                    padding: "6px 14px",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#080c14",
                    background: "#c9a84c",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    minHeight: 32,
                    display: "flex",
                    alignItems: "center",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}
                >
                  Next Step →
                </div>
              </Link>

              {/* Mobile hamburger */}
              <button
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-panel"
                onClick={() => setMobileOpen(o => !o)}
                style={{
                  display: "none",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: 14,
                  minHeight: 36,
                  minWidth: 36,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="rtbx-hamburger"
              >
                {mobileOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Row 2: Primary partner nav — grouped dropdowns (desktop only) */}
          {/*
            NOTE: overflowX is intentionally NOT set here. Previously setting
            overflowX:"auto" caused CSS to implicitly set overflowY:"hidden",
            which clipped the absolutely-positioned dropdowns. The dropdowns
            now use position:fixed so they escape all overflow/stacking contexts.
            Horizontal scrolling at narrow desktop viewports is handled by the
            nav items naturally fitting within the 641px+ breakpoint where this
            row is visible.
          */}
          <div
            className="rtbx-desktop-nav"
            style={{
              maxWidth: 1400,
              margin: "0 auto",
              padding: "0 20px",
              display: "flex",
              alignItems: "stretch",
            }}
          >
            {NAV_GROUPS.map((group) => {
              const isGroupActive = group.items.some(item =>
                location === item.path.split("#")[0] ||
                (item.path.split("#")[0] !== "/partner-room" && location.startsWith(item.path.split("#")[0]))
              );
              const isOpen = openGroup === group.label;
              const dropPos = isOpen ? getDropdownPosition(group.label) : null;

              return (
                <div
                  key={group.label}
                  ref={el => { groupRefs.current[group.label] = el; }}
                  onMouseEnter={() => setOpenGroup(group.label)}
                  onMouseLeave={() => setOpenGroup(null)}
                  onBlur={e => {
                    // Close only when focus leaves both the trigger and the dropdown panel
                    if (
                      !e.currentTarget.contains(e.relatedTarget as Node) &&
                      !dropdownPanelRef.current?.contains(e.relatedTarget as Node)
                    ) {
                      setOpenGroup(null);
                    }
                  }}
                >
                  <button
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() => navigate(group.path)}
                    onFocus={() => setOpenGroup(group.label)}
                    onKeyDown={e => {
                      if (e.key === " " || e.key === "ArrowDown") {
                        e.preventDefault();
                        setOpenGroup(isOpen ? null : group.label);
                      }
                      if (e.key === "Escape") setOpenGroup(null);
                    }}
                    style={{
                      padding: "11px 16px",
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      color: isGroupActive ? "#fff" : "rgba(255,255,255,0.38)",
                      border: "none",
                      borderBottom: isGroupActive ? "2px solid #c9a84c" : "2px solid transparent",
                      background: "transparent",
                      cursor: "pointer",
                      transition: "color 0.15s",
                      whiteSpace: "nowrap" as const,
                      userSelect: "none" as const,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      minHeight: 44,
                    }}
                    onMouseEnter={e => {
                      if (!isGroupActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)";
                    }}
                    onMouseLeave={e => {
                      if (!isGroupActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)";
                    }}
                  >
                    {group.label}
                    <span aria-hidden="true" style={{ fontSize: 7, color: "rgba(255,255,255,0.3)" }}>▾</span>
                  </button>

                  {/* Dropdown rendered at viewport level via fixed positioning.
                      This escapes the nav's overflow context entirely, so the
                      dropdown is never clipped regardless of ancestor styles. */}
                  {isOpen && dropPos && (
                    <div
                      ref={dropdownPanelRef}
                      role="menu"
                      aria-label={`${group.label} navigation`}
                      onMouseEnter={() => setOpenGroup(group.label)}
                      onMouseLeave={() => setOpenGroup(null)}
                      style={{
                        position: "fixed",
                        top: dropPos.top,
                        left: dropPos.left,
                        width: DROPDOWN_WIDTH,
                        background: "#0c1220",
                        border: "1px solid rgba(201,168,76,0.2)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.6)",
                        zIndex: 9999,
                        padding: "6px 0",
                        // Fallback for very short viewports: cap height and allow
                        // internal scroll only as last resort (spec requirement)
                        maxHeight: "calc(100vh - 100px)",
                        overflowY: "auto",
                      }}
                    >
                      {group.items.map(item => {
                        const itemActive = location === item.path.split("#")[0];
                        return (
                          <Link key={item.path} href={item.path}>
                            <div
                              role="menuitem"
                              tabIndex={0}
                              onClick={() => setOpenGroup(null)}
                              onKeyDown={e => {
                                if (e.key === "Enter" || e.key === " ") {
                                  navigate(item.path);
                                  setOpenGroup(null);
                                }
                                if (e.key === "Escape") setOpenGroup(null);
                                if (e.key === "ArrowDown") {
                                  e.preventDefault();
                                  (e.currentTarget.nextElementSibling?.querySelector("[role=menuitem]") as HTMLElement)?.focus();
                                }
                                if (e.key === "ArrowUp") {
                                  e.preventDefault();
                                  (e.currentTarget.previousElementSibling?.querySelector("[role=menuitem]") as HTMLElement)?.focus();
                                }
                              }}
                              style={{
                                padding: "10px 16px",
                                fontSize: 10,
                                fontWeight: 600,
                                letterSpacing: "0.02em",
                                color: itemActive ? "#c9a84c" : "rgba(255,255,255,0.62)",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "background 0.12s",
                                minHeight: 40,
                                display: "flex",
                                alignItems: "center",
                                borderLeft: itemActive ? "2px solid #c9a84c" : "2px solid transparent",
                              }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                              onFocus={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                              onBlur={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                            >
                              {item.label}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile nav panel — accordion style, no floating dropdowns */}
          {mobileOpen && (
            <div
              id="mobile-nav-panel"
              role="navigation"
              aria-label="Mobile navigation"
              style={{
                background: "#0c1220",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                padding: "8px 0 16px",
                // Full-width stacked layout — never horizontally scrollable
                overflowX: "hidden",
              }}
            >
              {NAV_GROUPS.map(group => {
                const isGroupOpen = mobileOpenGroup === group.label;
                const isGroupActive = group.items.some(item =>
                  location === item.path.split("#")[0]
                );
                return (
                  <div key={group.label}>
                    {/* Accordion group header */}
                    <button
                      aria-expanded={isGroupOpen}
                      onClick={() => setMobileOpenGroup(isGroupOpen ? null : group.label)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "12px 20px",
                        fontSize: 9,
                        letterSpacing: "0.18em",
                        color: isGroupActive ? "#c9a84c" : "rgba(201,168,76,0.5)",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        minHeight: 44,
                        transition: "color 0.15s",
                      }}
                    >
                      <span>{group.label}</span>
                      <span
                        aria-hidden="true"
                        style={{
                          fontSize: 9,
                          color: "rgba(255,255,255,0.3)",
                          transition: "transform 0.2s",
                          display: "inline-block",
                          transform: isGroupOpen ? "rotate(180deg)" : "none",
                        }}
                      >
                        ▾
                      </span>
                    </button>
                    {/* Accordion items */}
                    {isGroupOpen && group.items.map(item => {
                      const itemActive = location === item.path.split("#")[0];
                      return (
                        <Link key={item.path} href={item.path}>
                          <div
                            onClick={() => { setMobileOpen(false); setMobileOpenGroup(null); }}
                            style={{
                              padding: "10px 28px",
                              fontSize: 12,
                              fontWeight: itemActive ? 700 : 500,
                              color: itemActive ? "#c9a84c" : "rgba(255,255,255,0.7)",
                              cursor: "pointer",
                              borderLeft: itemActive ? "2px solid #c9a84c" : "2px solid transparent",
                              transition: "all 0.1s",
                              minHeight: 44,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {item.label}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </nav>
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "14px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        <p style={{ fontSize: 8.5, letterSpacing: "0.03em", color: "rgba(255,255,255,0.22)", margin: 0, lineHeight: 1.5, maxWidth: 900 }}>
          Travel Partner Room materials are provided for strategic partner and operator review and should not be redistributed without RTBX approval.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {[
            `RTBX Travel Partner Room v1.0`,
            `Content: ${contentVersion}`,
            `Updated: ${lastUpdated}`,
            `Powered by RTBX Core`,
          ].map((item, i, arr) => (
            <span key={item} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", fontWeight: 600 }}>{item}</span>
              {i < arr.length - 1 && <span aria-hidden="true" style={{ fontSize: 9, color: "rgba(255,255,255,0.08)" }}>·</span>}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
