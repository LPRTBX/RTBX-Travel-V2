import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { usePartnerContent } from "@/context/PartnerContentContext";
import { TravelWordmark } from "@/components/TravelWordmark";

interface NavItem { label: string; path: string; }
interface NavGroup { label: string; items: NavItem[]; }

export const PRIMARY_NAV: NavItem[] = [
  { label: "Overview", path: "/partner-room/overview" },
  { label: "Working Proof", path: "/partner-room/operations" },
  { label: "Pilot", path: "/partner-room/pilot-model" },
  { label: "Evidence", path: "/partner-room/operations#outcome-ledger" },
  { label: "Next Step", path: "/partner-room/next-step" },
];

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Start",
    items: [
      { label: "Partner Room",    path: "/partner-room" },
      { label: "Overview",        path: "/partner-room/overview" },
      { label: "Operator Brief",  path: "/partner-room/operator-brief" },
      { label: "Next Step",       path: "/partner-room/next-step" },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Operating Model",          path: "/partner-room/operating-model" },
      { label: "Travel Intelligence",      path: "/partner-room/travel-intelligence" },
      { label: "Travel Operating Systems", path: "/partner-room/travel-operating-systems" },
      { label: "Integration",              path: "/partner-room/integration-brief" },
    ],
  },
  {
    label: "Configure and Execute",
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
    items: [
      { label: "Pilot Model",       path: "/partner-room/pilot-model" },
      { label: "Deployment",        path: "/partner-room/rollout-model" },
      { label: "Partner Ecosystem", path: "/partner-room/partner-ecosystem" },
      { label: "Resource Library",  path: "/partner-room/brief-library" },
    ],
  },
];

const REFERENCE_GROUPS: NavGroup[] = [{
  label: "Reference Material",
  items: NAV_GROUPS.flatMap(group => group.items),
}];

const DROPDOWN_WIDTH = 260;
export const PARTNER_ROOM_SCROLL_CLEARANCE = 104;

export function scrollToPartnerRoomHash(hash: string, behavior: ScrollBehavior = "smooth") {
  const targetId = decodeURIComponent(hash.replace(/^#/, ""));
  if (!targetId) return false;
  const target = document.getElementById(targetId);
  if (!target) return false;
  const top = target.getBoundingClientRect().top + window.scrollY - PARTNER_ROOM_SCROLL_CLEARANCE;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

export function schedulePartnerRoomHashScroll(hash: string, behavior: ScrollBehavior = "smooth") {
  let cancelled = false;
  let attempt = 0;
  const delays = [0, 50, 150, 300];

  const run = () => {
    if (cancelled) return;
    scrollToPartnerRoomHash(hash, behavior);
    attempt += 1;
    if (attempt < delays.length) window.setTimeout(run, delays[attempt]);
  };

  requestAnimationFrame(run);
  return () => { cancelled = true; };
}

interface PartnerRoomLayoutProps {
  children: React.ReactNode;
}

export function PartnerRoomLayout({ children }: PartnerRoomLayoutProps) {
  const [location, navigate] = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const { content } = usePartnerContent();
  const contentVersion = content?.contentVersion ?? "1.0.0";
  const lastUpdated = content?.lastUpdated ?? "24 June 2026";

  // Refs to each group's trigger container (used for click-outside detection)
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuItemRefs = useRef<Record<string, Array<HTMLAnchorElement | null>>>({});
  const pendingInitialFocusRef = useRef<string | null>(null);
  const dropdownPanelRef = useRef<HTMLDivElement | null>(null);
  const mobileNavPanelRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

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

  // Arrow Down can open a menu from a closed state. Wait for its fixed panel to
  // mount before moving focus to the first destination.
  useEffect(() => {
    if (
      openGroup &&
      dropdownPosition &&
      pendingInitialFocusRef.current === openGroup
    ) {
      menuItemRefs.current[openGroup]?.[0]?.focus();
      pendingInitialFocusRef.current = null;
    }
  }, [dropdownPosition, openGroup]);

  // Close dropdown on Escape, returning focus to the group trigger.
  useEffect(() => {
    if (!openGroup) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        const trigger = triggerRefs.current[openGroup];
        setOpenGroup(null);
        trigger?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openGroup]);

  // Close both navigation modes on route changes.
  useEffect(() => {
    setMobileOpen(false);
    setMobileOpenGroup(null);
    setOpenGroup(null);
    setDropdownPosition(null);
  }, [location]);

  // Keep the fixed dropdown anchored to its trigger while the viewport changes.
  useEffect(() => {
    if (!openGroup) {
      setDropdownPosition(null);
      return;
    }

    const updateDropdownPosition = () => {
      const trigger = groupRefs.current[openGroup];
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - DROPDOWN_WIDTH - 8));
      setDropdownPosition({ top: rect.bottom, left });
    };

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);
    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [openGroup]);

  // Close the mobile drawer when tapping outside it or pressing Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!mobileNavPanelRef.current?.contains(target) && !hamburgerRef.current?.contains(target)) {
        setMobileOpen(false);
        setMobileOpenGroup(null);
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        setMobileOpenGroup(null);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [mobileOpen]);

  function toggleDesktopGroup(groupLabel: string) {
    setDropdownPosition(null);
    setOpenGroup(current => {
      if (current === groupLabel) {
        pendingInitialFocusRef.current = null;
        return null;
      }
      return groupLabel;
    });
  }

  function focusMenuItem(groupLabel: string, index: number) {
    requestAnimationFrame(() => {
      menuItemRefs.current[groupLabel]?.[index]?.focus();
    });
  }

  function focusFirstMenuItem(groupLabel: string) {
    const firstItem = menuItemRefs.current[groupLabel]?.[0];
    if (openGroup === groupLabel && firstItem) {
      firstItem.focus();
      return;
    }

    pendingInitialFocusRef.current = groupLabel;
    setDropdownPosition(null);
    setOpenGroup(groupLabel);
  }

  function closeDesktopMenu(returnFocus = false) {
    const trigger = returnFocus && openGroup ? triggerRefs.current[openGroup] : null;
    setOpenGroup(null);
    setDropdownPosition(null);
    pendingInitialFocusRef.current = null;
    if (returnFocus) trigger?.focus();
  }

  function navigateFromMenu(path: string) {
    const [targetPath, hash] = path.split("#");
    if (hash && location === targetPath) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#${hash}`);
      scrollToPartnerRoomHash(hash, "auto");
      schedulePartnerRoomHashScroll(hash, "auto");
      return;
    }
    navigate(path);
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#102d39", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* ── Top Nav ────────────────────────────────────────────────────────── */}
      <header>
        <nav
          data-partner-room-nav
          aria-label="Partner Room navigation"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(16,45,57,0.98)",
            borderBottom: "1px solid rgba(168,222,219,0.15)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Row 1: Wordmark + controls */}
          <div className="rtbx-nav-topline" style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            minHeight: 64,
            gap: 12,
          }}>
            <a href="/partner-room" onClick={(e) => { e.preventDefault(); navigateFromMenu("/partner-room"); }}>
              <div className="rtbx-brand-lockup" style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
                <span className="rtbx-brand-title"><TravelWordmark /></span>
                <span className="rtbx-brand-context" style={{ fontSize: 12, letterSpacing: "0.14em", color: "#a8dedb", textTransform: "uppercase", fontWeight: 700, paddingBottom: 1 }}>Partner Room</span>
              </div>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Desktop-only tagline */}
              <span
                className="rtbx-nav-desc"
                style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.46)", textTransform: "uppercase", fontWeight: 600 }}
              >
                Powered by JALDO Core
              </span>
              <div className="rtbx-nav-private" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#a8dedb" }} aria-hidden="true" />
                <span style={{ fontSize: 12, letterSpacing: "0.12em", color: "rgba(168,222,219,0.82)", textTransform: "uppercase", fontWeight: 700 }}>Controlled Preview</span>
              </div>
              {/* Mobile hamburger */}
              <button
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-panel"
                ref={hamburgerRef}
                onClick={() => {
                  setMobileOpen(o => {
                    if (o) setMobileOpenGroup(null);
                    return !o;
                  });
                }}
                style={{
                  display: "none",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: 14,
                   minHeight: 44,
                   minWidth: 44,
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
             Tablet layouts switch to the accordion drawer below 1024px instead
             of forcing this five-group row to overflow.
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
            {PRIMARY_NAV.map(item => {
              const basePath = item.path.split("#")[0];
              const itemActive = location === basePath;
              return (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateFromMenu(item.path);
                  }}
                  style={{
                    padding: "11px 16px",
                    minHeight: 44,
                    display: "flex",
                    alignItems: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: itemActive ? "#fff" : "rgba(255,255,255,0.5)",
                    borderBottom: itemActive ? "2px solid #a8dedb" : "2px solid transparent",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </a>
              );
            })}
            {REFERENCE_GROUPS.map((group) => {
              const isGroupActive = group.items.some(item =>
                location === item.path.split("#")[0] ||
                (item.path.split("#")[0] !== "/partner-room" && location.startsWith(item.path.split("#")[0]))
              );
              const isOpen = openGroup === group.label;
              return (
                <div
                  key={group.label}
                  ref={el => { groupRefs.current[group.label] = el; }}
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
                    id={`nav-trigger-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    aria-controls={`nav-menu-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    ref={el => { triggerRefs.current[group.label] = el; }}
                    onClick={() => toggleDesktopGroup(group.label)}
                    onKeyDown={e => {
                      if (e.key === " ") {
                        e.preventDefault();
                        toggleDesktopGroup(group.label);
                      }
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        focusFirstMenuItem(group.label);
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        closeDesktopMenu(true);
                      }
                    }}
                    style={{
                      padding: "11px 16px",
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase" as const,
                      color: isGroupActive ? "#fff" : "rgba(255,255,255,0.38)",
                      border: "none",
                      borderBottom: isGroupActive ? "2px solid #a8dedb" : "2px solid transparent",
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
                   {isOpen && dropdownPosition && (
                    <div
                      id={`nav-menu-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      ref={dropdownPanelRef}
                      role="menu"
                      aria-label={`${group.label} navigation`}
                      style={{
                        position: "fixed",
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: DROPDOWN_WIDTH,
                        background: "#173b47",
                        border: "1px solid rgba(168,222,219,0.2)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.6)",
                        zIndex: 9999,
                        padding: "6px 0",
                        // Fallback for very short viewports: cap height and allow
                        // internal scroll only as last resort (spec requirement)
                        maxHeight: "calc(100vh - 100px)",
                        overflowY: "auto",
                      }}
                    >
                      {group.items.map((item, index) => {
                        const itemActive = location === item.path.split("#")[0];
                        return (
                          <a
                            key={item.path}
                            ref={el => {
                              if (!menuItemRefs.current[group.label]) menuItemRefs.current[group.label] = [];
                              menuItemRefs.current[group.label][index] = el;
                            }}
                            href={item.path}
                            role="menuitem"
                            onClick={(e) => {
                              e.preventDefault();
                              closeDesktopMenu();
                              navigateFromMenu(item.path);
                            }}
                              onKeyDown={e => {
                                const lastIndex = group.items.length - 1;
                                if (e.key === "ArrowDown") {
                                  e.preventDefault();
                                  focusMenuItem(group.label, index === lastIndex ? 0 : index + 1);
                                }
                                if (e.key === "ArrowUp") {
                                  e.preventDefault();
                                  focusMenuItem(group.label, index === 0 ? lastIndex : index - 1);
                                }
                                if (e.key === "Home") {
                                  e.preventDefault();
                                  focusMenuItem(group.label, 0);
                                }
                                if (e.key === "End") {
                                  e.preventDefault();
                                  focusMenuItem(group.label, lastIndex);
                                }
                                if (e.key === "Escape") {
                                  e.preventDefault();
                                  closeDesktopMenu(true);
                                }
                              }}
                              style={{
                                padding: "10px 16px",
                                fontSize: 14,
                                fontWeight: 600,
                                letterSpacing: "0.02em",
                                color: itemActive ? "#a8dedb" : "rgba(255,255,255,0.62)",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "background 0.12s",
                                 minHeight: 44,
                                display: "flex",
                                alignItems: "center",
                                borderLeft: itemActive ? "2px solid #a8dedb" : "2px solid transparent",
                              }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                              onFocus={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                              onBlur={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                             >
                               {item.label}
                             </a>
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
              ref={mobileNavPanelRef}
              style={{
                background: "#173b47",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                padding: "8px 0 16px",
                // Full-width stacked layout — never horizontally scrollable
                overflowX: "hidden",
              }}
            >
              {PRIMARY_NAV.map(item => {
                const itemActive = location === item.path.split("#")[0];
                return (
                  <a
                    key={item.label}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileOpen(false);
                      setMobileOpenGroup(null);
                      navigateFromMenu(item.path);
                    }}
                    style={{
                      padding: "12px 20px",
                      minHeight: 44,
                      display: "flex",
                      alignItems: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: itemActive ? "#a8dedb" : "rgba(255,255,255,0.72)",
                      borderLeft: itemActive ? "2px solid #a8dedb" : "2px solid transparent",
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
              {REFERENCE_GROUPS.map(group => {
                const isGroupOpen = mobileOpenGroup === group.label;
                const isGroupActive = group.items.some(item =>
                  location === item.path.split("#")[0]
                );
                return (
                  <div key={group.label}>
                    {/* Accordion group header */}
                    <button
                      aria-expanded={isGroupOpen}
                      aria-controls={`mobile-menu-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      onClick={() => setMobileOpenGroup(isGroupOpen ? null : group.label)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "12px 20px",
                         fontSize: 14,
                         letterSpacing: "0.08em",
                        color: isGroupActive ? "#a8dedb" : "rgba(168,222,219,0.5)",
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
                    {isGroupOpen && (
                      <div id={`mobile-menu-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                        {group.items.map(item => {
                      const itemActive = location === item.path.split("#")[0];
                      return (
                        <a
                          key={item.path}
                          href={item.path}
                          onClick={(e) => {
                            e.preventDefault();
                            setMobileOpen(false);
                            setMobileOpenGroup(null);
                            navigateFromMenu(item.path);
                          }}
                            style={{
                              padding: "10px 28px",
                               fontSize: 14,
                              fontWeight: itemActive ? 700 : 500,
                              color: itemActive ? "#a8dedb" : "rgba(255,255,255,0.7)",
                              cursor: "pointer",
                              borderLeft: itemActive ? "2px solid #a8dedb" : "2px solid transparent",
                              transition: "all 0.1s",
                              minHeight: 44,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {item.label}
                          </a>
                      );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </nav>
      </header>

      {/* Page content */}
       <main className="rtbx-readable-content" style={{ flex: 1 }}>
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
        <a className="jaldo-return-home" href="/" onClick={(e) => { e.preventDefault(); navigateFromMenu("/"); }}>← JALDO Travel home</a>
         <p style={{ fontSize: 16, letterSpacing: "0.01em", color: "rgba(255,255,255,0.62)", margin: 0, lineHeight: 1.55, maxWidth: 900 }}>
          Travel Partner Room materials are provided for strategic partner and operator review and should not be redistributed without JALDO approval.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {[
            `JALDO Travel Partner Room v1.0`,
            `Content: ${contentVersion}`,
            `Updated: ${lastUpdated}`,
            `Powered by JALDO Core`,
          ].map((item, i, arr) => (
            <span key={item} style={{ display: "flex", alignItems: "center", gap: 16 }}>
               <span style={{ fontSize: 12, letterSpacing: "0.08em", color: "rgba(255,255,255,0.48)", textTransform: "uppercase", fontWeight: 600 }}>{item}</span>
               {i < arr.length - 1 && <span aria-hidden="true" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>·</span>}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
