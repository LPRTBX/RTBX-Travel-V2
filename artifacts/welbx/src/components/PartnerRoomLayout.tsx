import { Link, useLocation } from "wouter";
import { usePartnerContent } from "@/context/PartnerContentContext";

const NAV_LINKS = [
  { label: "Briefing Room",            path: "/partner-room/overview" },
  { label: "Travel Environments",      path: "/partner-room" },
  { label: "RTBX Core Demo",           path: "/partner-room/demo-paths" },
  { label: "WELBX Experience",         path: "/partner-room/guest-demo" },
  { label: "Commercial Model",         path: "/partner-room/commercial-model" },
  { label: "Brief Library",            path: "/partner-room/operator-brief" },
  { label: "Pilot Model",              path: "/partner-room/pilot-model" },
];

interface PartnerRoomLayoutProps {
  children: React.ReactNode;
}

export function PartnerRoomLayout({ children }: PartnerRoomLayoutProps) {
  const [location] = useLocation();
  const { content } = usePartnerContent();

  const contentVersion = content?.contentVersion ?? "1.0.0";
  const lastUpdated = content?.lastUpdated ?? "24 June 2026";

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
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "14px 0", marginRight: 40, cursor: "pointer", flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", color: "#fff", textTransform: "uppercase" }}>RTBX Travel</span>
              <span style={{ fontSize: 8, letterSpacing: "0.18em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700 }}>Partner Room</span>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, overflowX: "auto" }}>
            {NAV_LINKS.map(link => {
              const isActive = location === link.path;
              const isWelbx = link.label === "WELBX Experience";
              return (
                <Link key={link.path} href={link.path}>
                  <div style={{
                    padding: "16px 14px",
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isActive ? "#fff" : isWelbx ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.38)",
                    borderBottom: isActive ? "2px solid #c9a84c" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = isWelbx ? "rgba(59,130,246,0.9)" : "rgba(255,255,255,0.7)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = isWelbx ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.38)"; }}
                  >
                    {link.label}
                  </div>
                </Link>
              );
            })}

            {/* Next Step — mailto CTA */}
            <a href="mailto:lance@rtbx.com.au?subject=RTBX Travel Partner Briefing" style={{ textDecoration: "none", marginLeft: "auto", flexShrink: 0 }}>
              <div style={{
                padding: "8px 16px",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#080c14",
                background: "#c9a84c",
                cursor: "pointer",
                transition: "background 0.15s",
                whiteSpace: "nowrap",
                marginLeft: 16,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}
              >
                Next Step →
              </div>
            </a>
          </div>

          {/* Status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0, paddingLeft: 20 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#c9a84c" }} />
            <span style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", fontWeight: 700 }}>Private</span>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* Discreet version footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 600 }}>
          RTBX Travel Partner Room v1.0
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.1)" }}>·</span>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 600 }}>
          Content version: {contentVersion}
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.1)" }}>·</span>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", fontWeight: 600 }}>
          Last updated: {lastUpdated}
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.1)" }}>·</span>
        <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase", fontWeight: 600 }}>
          Powered by RTBX Core
        </span>
      </footer>
    </div>
  );
}
