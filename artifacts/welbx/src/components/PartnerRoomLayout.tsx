import { Link, useLocation } from "wouter";
import { usePartnerContent } from "@/context/PartnerContentContext";

const NAV_SECTIONS = [
  { label: "Partner Room",   path: "/partner-room",                    anchor: false },
  { label: "Deployments",    path: "/partner-room#environments",       anchor: true  },
  { label: "Product Proof",  path: "/partner-room/demo-paths",         anchor: false },
  { label: "Validation",     path: "/story",                           anchor: false },
  { label: "Commercial",     path: "/partner-room/commercial-model",   anchor: false },
  { label: "Brief Library",  path: "/partner-room/operator-brief",     anchor: false },
  { label: "Next Step",      path: "mailto:lance@rtbx.com.au?subject=RTBX Travel Partner Briefing", ext: true },
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
            <a href="mailto:lance@rtbx.com.au?subject=RTBX Travel Partner Briefing" style={{ textDecoration: "none" }}>
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
            </a>
          </div>
        </div>

        {/* Row 2: 11 section nav */}
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "stretch",
          overflowX: "auto",
        }}>
          {NAV_SECTIONS.map((sec, i) => {
            const isExt = !!(sec as any).ext;
            const basePath = sec.path.split("#")[0];
            const isAnchorOnly = !isExt && sec.path.includes("#") && basePath === "/partner-room";
            const isActive = !isExt && !isAnchorOnly && (
              location === basePath ||
              (basePath !== "/partner-room" && basePath !== "/" && location.startsWith(basePath))
            );
            const itemStyle: React.CSSProperties = {
              padding: "11px 16px",
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isExt ? "#c9a84c" : isActive ? "#fff" : "rgba(255,255,255,0.38)",
              borderBottom: isActive ? "2px solid #c9a84c" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              userSelect: "none",
            };
            const inner = (
              <div style={itemStyle}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  if (isExt) { el.style.color = "#d4b35e"; }
                  else if (!isActive) { el.style.color = "rgba(255,255,255,0.72)"; }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  if (isExt) { el.style.color = "#c9a84c"; }
                  else if (!isActive) { el.style.color = "rgba(255,255,255,0.38)"; }
                }}
              >
                {sec.label}
              </div>
            );
            return isExt
              ? <a key={i} href={sec.path} style={{ textDecoration: "none" }}>{inner}</a>
              : <Link key={i} href={sec.path}>{inner}</Link>;
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
