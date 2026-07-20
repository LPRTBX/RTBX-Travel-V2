import { useState } from "react";
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
      { label: "Build & Configure",    path: "/partner-room/build-configure" },
      { label: "Execution Centre",     path: "/partner-room/operations" },
      { label: "Decision Spine",       path: "/partner-room/decision-spine" },
      { label: "Communications",       path: "/partner-room/travel-ai-comms" },
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
      { label: "Pilot Model",        path: "/partner-room/pilot-model" },
      { label: "Deployment",         path: "/partner-room/rollout-model" },
      { label: "Commercial",         path: "/partner-room/commercial-unit" },
      { label: "Partner Ecosystem",  path: "/partner-room/partner-ecosystem" },
      { label: "Resource Library",   path: "/partner-room/brief-library" },
      { label: "Next Step",          path: "/partner-room/next-step" },
    ],
  },
];

interface PartnerRoomLayoutProps {
  children: React.ReactNode;
}

export function PartnerRoomLayout({ children }: PartnerRoomLayoutProps) {
  const [location, navigate] = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { content } = usePartnerContent();
  const contentVersion = content?.contentVersion ?? "1.0.0";
  const lastUpdated = content?.lastUpdated ?? "24 June 2026";

  return (
    <div style={{ minHeight: "100dvh", background: "#080c14", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Top Nav */}
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
                <div style={{
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
                /* Show on mobile via media query — we use a CSS class trick */
                className="rtbx-hamburger"
              >
                {mobileOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Row 2: Primary partner nav — grouped (desktop) */}
          <div
            style={{
              maxWidth: 1400,
              margin: "0 auto",
              padding: "0 20px",
              display: "flex",
              alignItems: "stretch",
              overflowX: "auto",
              position: "relative",
            }}
            className="rtbx-desktop-nav"
          >
            {NAV_GROUPS.map((group) => {
              const isGroupActive = group.items.some(item =>
                location === item.path.split("#")[0] ||
                (item.path.split("#")[0] !== "/partner-room" && location.startsWith(item.path.split("#")[0]))
              );
              const isOpen = openGroup === group.label;
              return (
                <div
                  key={group.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setOpenGroup(group.label)}
                  onMouseLeave={() => setOpenGroup(null)}
                  onBlur={e => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
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
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
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

                  {isOpen && (
                    <div
                      role="menu"
                      aria-label={`${group.label} navigation`}
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        minWidth: 260,
                        background: "#0c1220",
                        border: "1px solid rgba(201,168,76,0.2)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.5)",
                        zIndex: 60,
                        padding: "6px 0",
                      }}>
                      {group.items.map(item => {
                        const itemActive = location === item.path.split("#")[0];
                        return (
                          <Link key={item.path} href={item.path}>
                            <div
                              role="menuitem"
                              onClick={() => setOpenGroup(null)}
                              onKeyDown={e => {
                                if (e.key === "Escape") setOpenGroup(null);
                              }}
                              onFocus={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                              onBlur={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
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
                              }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
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

          {/* Mobile nav panel */}
          {mobileOpen && (
            <div
              id="mobile-nav-panel"
              role="navigation"
              aria-label="Mobile navigation"
              style={{
                background: "#0c1220",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                padding: "8px 0 16px",
              }}
            >
              {NAV_GROUPS.map(group => (
                <div key={group.label}>
                  <div style={{ padding: "10px 20px 4px", fontSize: 8, letterSpacing: "0.18em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", fontWeight: 700 }}>
                    {group.label}
                  </div>
                  {group.items.map(item => {
                    const itemActive = location === item.path.split("#")[0];
                    return (
                      <Link key={item.path} href={item.path}>
                        <div
                          onClick={() => setMobileOpen(false)}
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
              ))}
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
