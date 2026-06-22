import { Link, useLocation } from "wouter";
import { usePartnerContent } from "@/context/PartnerContentContext";

const NAV_LINKS = [
  { label: "Overview",         path: "/partner-room/overview" },
  { label: "Operator Brief",   path: "/partner-room/operator-brief" },
  { label: "Integration",      path: "/partner-room/integration-brief" },
  { label: "Moments Economy",  path: "/partner-room/moments-economy" },
  { label: "Signals Engine",   path: "/partner-room/signals-engine" },
  { label: "Pilot Model",      path: "/partner-room/pilot-model" },
  { label: "Commercial Model", path: "/partner-room/commercial-model" },
  { label: "Live Demos",       path: "/partner-room/live-demos" },
];

interface PartnerRoomLayoutProps {
  children: React.ReactNode;
}

export function PartnerRoomLayout({ children }: PartnerRoomLayoutProps) {
  const [location] = useLocation();
  const { content } = usePartnerContent();

  return (
    <div style={{ minHeight: "100dvh", background: "#080c14", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Top Nav */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(8,12,20,0.97)",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        backdropFilter: "blur(8px)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 0 }}>
          {/* Wordmark */}
          <Link href="/partner-room">
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "14px 0", marginRight: 40, cursor: "pointer", flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", color: "#fff", textTransform: "uppercase" }}>WELBX</span>
              <span style={{ fontSize: 8, letterSpacing: "0.18em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700 }}>PARTNER ROOM</span>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, overflowX: "auto" }}>
            {NAV_LINKS.map(link => {
              const isActive = location === link.path;
              return (
                <Link key={link.path} href={link.path}>
                  <div style={{
                    padding: "16px 14px",
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.38)",
                    borderBottom: isActive ? "2px solid #c9a84c" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}
                  >
                    {link.label}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0, paddingLeft: 24 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#c9a84c" }} />
            <span style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", fontWeight: 700 }}>Private</span>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* Discreet footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 600 }}>
          Content version: {content?.contentVersion ?? "—"}
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.1)" }}>·</span>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 600 }}>
          Last updated: {content?.lastUpdated ?? "—"}
        </span>
      </footer>
    </div>
  );
}
