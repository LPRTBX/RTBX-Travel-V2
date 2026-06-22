import { Link } from "wouter";

export function PartnerCTAFooter() {
  return (
    <div style={{
      marginTop: 80,
      padding: "48px 40px",
      background: "rgba(201,168,76,0.04)",
      border: "1px solid rgba(201,168,76,0.12)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 28,
    }}>
      <div>
        <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(201,168,76,0.6)", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
          Next Step
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
          Ready to map this to your environment?
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <Link href="/partner-room/dual-view-demo">
          <div style={{
            padding: "12px 24px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            background: "#c9a84c",
            color: "#080c14",
            border: "1px solid #c9a84c",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4b35e"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; }}
          >
            Open Dual View Demo
          </div>
        </Link>
        <Link href="/partner-room/pilot-model">
          <div style={{
            padding: "12px 24px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            background: "transparent",
            color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.15)",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.4)"; el.style.color = "#fff"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(255,255,255,0.6)"; }}
          >
            View Pilot Model
          </div>
        </Link>
        <a href="mailto:lance@rtbx.com.au?subject=WELBX Partner Briefing" style={{ textDecoration: "none" }}>
          <div style={{
            padding: "12px 24px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            background: "transparent",
            color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.15)",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.4)"; el.style.color = "#fff"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(255,255,255,0.6)"; }}
          >
            Request Partner Briefing
          </div>
        </a>
      </div>
    </div>
  );
}
