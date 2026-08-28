import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const P = {
  bg: "#080c14", navy: "#0d1220", border: "rgba(255,255,255,0.08)",
  amber: "#c9a84c", amberDim: "rgba(201,168,76,0.07)",
  white: "#f8f9fb", muted: "rgba(255,255,255,0.5)", dimmed: "rgba(255,255,255,0.22)",
  green: "#10b981", blue: "#3b82f6",
};

const DEMOS = [
  {
    id: "guest",
    num: "01",
    title: "Guest Experience Demo",
    sub: "What the guest sees through QR, TV, tablet or mobile access.",
    desc: "A calm, zero-download interface that turns synthetic guest signals into guided support. Five interactive scenarios from welcome to service recovery.",
    cta: "Open Guest Demo",
    path: "/partner-room/guest-demo",
    color: P.amber,
  },
  {
    id: "operator",
    num: "02",
    title: "Operator Response Demo",
    sub: "What the front desk, duty manager or operations team sees when a moment is detected.",
    desc: "Simulated moment queue, detail panel, signal breakdown, recommended action, and outcome capture — all in one operator view.",
    cta: "Open Operator Demo",
    path: "/partner-room/operator-demo",
    color: P.blue,
  },
  {
    id: "dual",
    num: "03",
    title: "Dual View Demo",
    sub: "See the same moment from both sides — guest experience and operator action.",
    desc: "Six scenarios. Seven steps each. Guest and operator views update in lockstep as the signal moves through detection, decision, action and outcome.",
    cta: "Open Dual View",
    path: "/partner-room/dual-view-demo",
    color: P.green,
  },
  {
    id: "moments",
    num: "04",
    title: "Moment-to-Value Demo",
    sub: "Follow a signal from detection through decision, response, outcome and value.",
    desc: "Ten illustrative hotel moments. Each shows what RTBX Core would classify, route and log, with Guest Channel representing guest-facing communication.",
    cta: "Open Moments Economy",
    path: "/partner-room/moments-economy",
    color: P.amber,
  },
  {
    id: "scenarios",
    num: "05",
    title: "RTBX Travel Scenarios",
    sub: "Six governed scenarios — signal through governance, action, evidence and value.",
    desc: "Select a role view, step through the full chain, send demo communications, confirm human actions and escalations, and view the resulting evidence and value.",
    cta: "Open Scenarios",
    path: "/partner-room/travel-scenarios",
    color: P.blue,
  },
];

function DemoFooter() {
  return (
    <div style={{ borderTop: `1px solid ${P.border}`, padding: "40px 60px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Ready to map this to your environment?</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Travel AI & Central Comms", path: "/partner-room/travel-ai-comms" },
            { label: "View Pilot Model", path: "/partner-room/pilot-model" },
            { label: "Open Integration Brief", path: "/partner-room/integration-brief" },
            { label: "View Moments Economy", path: "/partner-room/moments-economy" },
          ].map(b => (
            <Link key={b.path} href={b.path}>
              <div style={{
                padding: "10px 22px", border: `1px solid ${P.border}`,
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = P.white; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLElement).style.borderColor = P.border; }}
              >{b.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PartnerLiveDemos() {
  return (
    <PartnerRoomLayout>
      {/* Header */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "72px 60px 60px" }}>
        <div style={{ fontSize: 8, letterSpacing: "0.22em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
          PARTNER ROOM · INTERACTIVE UX DEMOS
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: P.white, letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.15 }}>
          Interactive UX Demos
        </h1>
        <p style={{ fontSize: 15, color: P.muted, maxWidth: 560, lineHeight: 1.75, margin: 0 }}>
          See how RTBX Travel works across guest, operator and signal-to-action views, with Guest Experience appearing only as the guest-facing experience layer.
        </p>
      </div>

      {/* Demo cards */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {DEMOS.map(demo => (
            <div key={demo.id} style={{
              background: P.navy, border: `1px solid ${P.border}`,
              padding: "36px 40px", display: "flex", flexDirection: "column",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${demo.color}40`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = P.border; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: `${demo.color}30`, letterSpacing: "-0.02em" }}>{demo.num}</span>
                <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.16em", color: demo.color, textTransform: "uppercase", padding: "3px 10px", border: `1px solid ${demo.color}30`, background: `${demo.color}08` }}>DEMO</span>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 800, color: P.white, letterSpacing: "-0.01em", marginBottom: 8 }}>{demo.title}</h2>
              <p style={{ fontSize: 11, color: demo.color, marginBottom: 12, lineHeight: 1.6, fontWeight: 500 }}>{demo.sub}</p>
              <p style={{ fontSize: 11, color: P.muted, lineHeight: 1.75, marginBottom: 28, flex: 1 }}>{demo.desc}</p>

              <Link href={demo.path}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 22px", background: `${demo.color}10`, border: `1px solid ${demo.color}40`,
                  color: demo.color, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.15s", alignSelf: "flex-start",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${demo.color}20`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${demo.color}10`; }}
                >
                  {demo.cta} →
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <DemoFooter />
    </PartnerRoomLayout>
  );
}
