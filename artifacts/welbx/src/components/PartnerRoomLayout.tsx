import { useState } from "react";
import { Link, useLocation } from "wouter";
import { usePartnerContent } from "@/context/PartnerContentContext";

interface NavItem { label: string; path: string; }
interface NavGroup { label: string; path: string; items: NavItem[]; }

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    path: "/partner-room",
    items: [
      { label: "Home",             path: "/partner-room" },
      { label: "Why RTBX Travel",  path: "/partner-room/overview" },
      { label: "Operating Model",  path: "/partner-room/operating-model" },
      { label: "Proof",            path: "/partner-room/product-proof" },
    ],
  },
  {
    label: "Travel Intelligence",
    path: "/partner-room/intelligence-model",
    items: [
      { label: "Travel Intelligence Model",  path: "/partner-room/intelligence-model" },
      { label: "Connection Map",             path: "/partner-room/resources/travel-systems-map" },
      { label: "Signals and Moments",        path: "/partner-room/signals-engine" },
      { label: "Governance and Playbooks",   path: "/partner-room/decision-spine" },
      { label: "Role Views",                 path: "/partner-room/operator-demo" },
      { label: "Central Comms and AI",       path: "/partner-room/comms-demo" },
    ],
  },
  {
    label: "Operating Systems",
    path: "/partner-room/resources/travel-systems-map",
    items: [
      { label: "Guest Experience OS",                    path: "/partner-room/resources/travel-systems-map#guest-experience-os" },
      { label: "Service Recovery & Staff Response OS",   path: "/partner-room/resources/travel-systems-map#service-recovery-os" },
      { label: "Marketplace & Loyalty Activation OS",    path: "/partner-room/resources/travel-systems-map#marketplace-loyalty-os" },
      { label: "Operator Intelligence OS",                path: "/partner-room/resources/travel-systems-map#operator-intelligence-os" },
      { label: "Safety & Guest Welfare OS",               path: "/partner-room/resources/travel-systems-map#safety-welfare-os" },
    ],
  },
  {
    label: "Build / Configure",
    path: "/partner-room/build-configure",
    items: [
      { label: "Deployment Builder",  path: "/partner-room/build-configure#deployment-builder" },
      { label: "Signal Mapper",       path: "/partner-room/build-configure#signal-mapper" },
      { label: "Governance Mapper",   path: "/partner-room/build-configure#governance-mapper" },
      { label: "Playbook Builder",    path: "/partner-room/build-configure#playbook-builder" },
      { label: "Comms Builder",       path: "/partner-room/build-configure#comms-builder" },
      { label: "Scenario Tester",     path: "/partner-room/build-configure#scenario-tester" },
    ],
  },
  {
    label: "Operations",
    path: "/partner-room/operations",
    items: [
      { label: "Action Centre",    path: "/partner-room/operations#action-centre" },
      { label: "Outcome Ledger",   path: "/partner-room/operations#outcome-ledger" },
      { label: "Evidence Ledger",  path: "/partner-room/operations#evidence-ledger" },
      { label: "Value Dashboard",  path: "/partner-room/operations#value-dashboard" },
    ],
  },
  {
    label: "Rooms",
    path: "/partner-room/brief-library",
    items: [
      { label: "Partner Room",  path: "/partner-room/brief-library" },
      { label: "Live Demos",    path: "/partner-room/live-demos" },
      { label: "Contact",       path: "/partner-room/next-step" },
    ],
  },
];

interface PartnerRoomLayoutProps {
  children: React.ReactNode;
}

export function PartnerRoomLayout({ children }: PartnerRoomLayoutProps) {
  const [location] = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { content } = usePartnerContent();
  const contentVersion = content?.contentVersion ?? "1.0.0";
  const lastUpdated = content?.lastUpdated ?? "24 June 2026";

  return (
    <div style={{ minHeight: "100dvh", background: "#080c14", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Top Nav — two rows */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(8,12,20,0.98)",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        backdropFilter: "blur(10px)",
      }}>
        {/* Row 1: Wordmark + controls */}
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          minHeight: 44,
        }}>
          <Link href="/partner-room">
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, cursor: "pointer" }}>
              <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.24em", color: "#fff", textTransform: "uppercase" }}>RTBX Travel</span>
              <span style={{ fontSize: 7.5, letterSpacing: "0.2em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, paddingBottom: 1 }}>Partner Room</span>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 600 }}>
              RTBX Travel is powered by RTBX Core · WELBX is the guest-facing experience layer
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#c9a84c" }} />
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
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}
              >
                Next Step →
              </div>
            </Link>
          </div>
        </div>

        {/* Row 2: primary partner nav — grouped */}
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "stretch",
          overflowX: "auto",
          position: "relative",
        }}>
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
              >
                <Link href={group.path}>
                  <div style={{
                    padding: "11px 16px",
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isGroupActive ? "#fff" : "rgba(255,255,255,0.38)",
                    borderBottom: isGroupActive ? "2px solid #c9a84c" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "color 0.15s",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                  onMouseEnter={e => {
                    if (!isGroupActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)";
                  }}
                  onMouseLeave={e => {
                    if (!isGroupActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)";
                  }}
                  >
                    {group.label}
                    <span style={{ fontSize: 7, color: "rgba(255,255,255,0.3)" }}>▾</span>
                  </div>
                </Link>

                {isOpen && (
                  <div style={{
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
                            onClick={() => setOpenGroup(null)}
                            style={{
                              padding: "9px 16px",
                              fontSize: 10,
                              fontWeight: 600,
                              letterSpacing: "0.02em",
                              color: itemActive ? "#c9a84c" : "rgba(255,255,255,0.62)",
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              transition: "background 0.12s",
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
      </nav>

      {/* Page content */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
      }}>
        {[
          `RTBX Travel Partner Room v1.0`,
          `Content: ${contentVersion}`,
          `Updated: ${lastUpdated}`,
          `Powered by RTBX Core`,
        ].map((item, i, arr) => (
          <span key={item} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", fontWeight: 600 }}>{item}</span>
            {i < arr.length - 1 && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.08)" }}>·</span>}
          </span>
        ))}
      </footer>
    </div>
  );
}
