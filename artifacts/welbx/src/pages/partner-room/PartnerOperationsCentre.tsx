import { useEffect } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { muted: "rgba(255,255,255,0.5)", dim: "rgba(255,255,255,0.22)" };

const OPS = [
  { id: "action-centre",   label: "Action Centre",   color: "#10b981", desc: "Where every open moment, its assigned role owner and its response deadline live in real time.", href: "/partner-room/product-proof/signal-capture", cta: "Open Signal-to-Action Pipeline" },
  { id: "outcome-ledger",  label: "Outcome Ledger",  color: "#c9a84c", desc: "The record of every resolved moment — recovered, escalated, logged or missed — linked to its outcome.", href: "/partner-room/validation-replay", cta: "Open Validation Replay" },
  { id: "evidence-ledger", label: "Evidence Ledger", color: "#3b82f6", desc: "The auditable evidence trail behind every action — who acted, what was sent, and what was signed off.", href: "/partner-room/validation", cta: "Open Validation Lab" },
  { id: "value-dashboard", label: "Value Dashboard", color: "#a78bfa", desc: "Board-ready value evidence — recovery rate, revenue surfaced, assurance completeness and portfolio comparison.", href: "/partner-room/proof-calculator", cta: "Open Proof Calculator" },
];

export default function PartnerOperationsCentre() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 140px" }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Operations
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 720 }}>
            Running RTBX Travel Day to Day
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 700 }}>
            These are the operating surfaces a live deployment runs on once configuration is complete — the same Action Centre, Outcome Ledger, Evidence Ledger and Value Engine shared across RTBX Core, tuned for travel. Each links to the closest working proof of that capability in the Partner Room.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {OPS.map(o => (
            <div key={o.id} id={o.id} style={{ padding: "26px 26px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `2px solid ${o.color}`, display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center", scrollMarginTop: 90 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: o.color, marginBottom: 8, letterSpacing: "0.01em" }}>{o.label}</div>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, margin: 0, maxWidth: 620 }}>{o.desc}</p>
              </div>
              <Link href={o.href}>
                <div style={{
                  padding: "10px 18px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: o.color, border: `1px solid ${o.color}40`,
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${o.color}10`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {o.cta} →
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
