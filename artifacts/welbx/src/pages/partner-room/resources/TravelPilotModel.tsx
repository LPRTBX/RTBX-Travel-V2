import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981" };

const PHASES = [
  { n: "01", label: "Operator Alignment", weeks: "Week 1", desc: "Define objectives, identify proof environments, assign operator contact. Agree on success metrics and governance model.", output: "Signed pilot brief. Moment map draft. Contact matrix." },
  { n: "02", label: "Moment Mapping", weeks: "Week 1–2", desc: "Map the guest journey, identify moment types, confirm signal sources (PMS, POS, staff systems, app touch points).", output: "Moment map. Signal source list. Priority moment types confirmed." },
  { n: "03", label: "Scenario Validation", weeks: "Week 2–3", desc: "Define 5–10 operating scenarios. Validate classification logic against real environment data. Staff briefed on pathway structure.", output: "Scenario set. Classification thresholds set. Staff briefing completed." },
  { n: "04", label: "Staff & Guest Pathway Setup", weeks: "Week 3–4", desc: "Configure staff action cards. Set up Guest Experience interface. Test end-to-end pathway flow. Guest and staff test session.", output: "Staff pathway live. Guest Experience configured. Test run completed. Sign-off from operator." },
  { n: "05", label: "Shadow Pilot", weeks: "Week 4–6", desc: "RTBX Core runs in parallel — signals captured, moments classified, pathways queued. No live delivery to guests or staff yet.", output: "Shadow pilot data. Signal validation. Moment creation accuracy report. Adjustment recommendations." },
  { n: "06", label: "Live Pilot", weeks: "Week 6–10", desc: "Full live operation. Real guests, real staff, real moments. All six moment types active. Recovery, welfare, commercial and concierge pathways running.", output: "Live operating data. Moment log. Staff response data. Guest feedback. Escalation record." },
  { n: "07", label: "Reporting & Value Proof", weeks: "Week 10–12", desc: "Full outcome report produced. Value proof against baseline metrics. Assurance records collated. Commercial conversion case prepared.", output: "Outcome report. Value proof document. Assurance record summary. Commercial conversion proposal." },
  { n: "08", label: "Expansion Recommendation", weeks: "Post-pilot", desc: "Expand to full estate, add a second environment type, or formalise strategic partnership. Conversion to annual agreement.", output: "Expansion plan. Annual agreement terms. Partner pathway defined." },
];

const METRICS = [
  { metric: "Guest engagement rate", target: ">60% of moments result in guest action", why: "Validates that Guest Experience pathways are finding the right moment at the right time" },
  { metric: "Service recovery rate", target: ">80% of flagged issues resolved before escalation", why: "Core value proof — escalation prevented, outcome owned" },
  { metric: "Staff response completion", target: ">90% of routed actions completed within SLA", why: "Validates that staff pathway design is workable and followed" },
  { metric: "Escalations prevented", target: "Baseline comparison — target >30% reduction", why: "Direct evidence of operational risk reduction" },
  { metric: "Revenue moments surfaced", target: "Count + conversion rate vs baseline", why: "Commercial activation evidence for marketplace and F&B partners" },
  { metric: "Guest sentiment movement", target: "Pre/post pilot comparison", why: "Guest experience improvement evidence" },
  { metric: "Assurance records created", target: "100% of resolved moments logged", why: "Duty-of-care and governance evidence" },
  { metric: "Operator time saved", target: "Staff hours per shift comparison", why: "Efficiency value evidence for operator ROI case" },
];

const PILOT_ENVS = [
  { label: "Hotels & Resorts", color: "#c9a84c", best: "Highest signal density, clearest early value. First proof environment.", demo: "/partner-room/deployments/hotels-resorts/demo" },
  { label: "Holiday Parks", color: "#10b981", best: "Welfare and weather signals create immediately visible value. Family guest complexity.", demo: "/partner-room/holiday-park-demo" },
  { label: "Corporate Travel", color: "#3b82f6", best: "Repeat guest recognition + duty-of-care. Low integration overhead per guest.", demo: "/partner-room/deployments/corporate-travel/demo" },
  { label: "Events & Venues", color: "#a78bfa", best: "High-density, high-risk. Welfare and safety signals create auditable value.", demo: "/partner-room/deployments/events-venues/demo" },
  { label: "Destination", color: "#22d3ee", best: "Marketplace + partner ecosystem. Typically a Year 2 pilot after hotel/park proof.", demo: "/partner-room/deployments/destination-tourism/demo" },
];

export default function TravelPilotModel() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · Pilot Model</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 680 }}>RTBX Travel — Pilot Model</h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginTop: 28 }}>
            {[
              { label: "Duration", value: "8–12 weeks" },
              { label: "Integration needed", value: "Push-first — none required to start" },
              { label: "Pilot fee (indicative)", value: "A$15K–A$45K" },
              { label: "Output", value: "Outcome report + value proof" },
            ].map(s => (
              <div key={s.label} style={{ padding: "18px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(201,168,76,0.35)" }}>
                <div style={{ fontSize: 8, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 8 phases */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>8-Phase Pilot Pathway</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PHASES.map((p, i) => (
              <div key={p.n} style={{ display: "grid", gridTemplateColumns: "36px 80px 160px 1fr 200px", gap: 0, border: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <div style={{ padding: "16px 0 16px 14px", fontSize: 9, fontWeight: 700, color: C.gold, opacity: 0.5 }}>{p.n}</div>
                <div style={{ padding: "16px 10px", fontSize: 9.5, color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>{p.weeks}</div>
                <div style={{ padding: "16px 12px", fontSize: 11.5, fontWeight: 700, color: "#fff", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{p.label}</div>
                <div style={{ padding: "16px 12px", fontSize: 11.5, color: C.muted, lineHeight: 1.6, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{p.desc}</div>
                <div style={{ padding: "16px 12px", fontSize: 10.5, color: C.green, lineHeight: 1.55, borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{p.output}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Success metrics */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Success Metrics</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 1fr", gap: 0, marginBottom: 2 }}>
            {["Metric", "Target", "Why it matters"].map(h => (
              <div key={h} style={{ padding: "8px 14px", fontSize: 7.5, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", fontWeight: 700 }}>{h}</div>
            ))}
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            {METRICS.map((m, i) => (
              <div key={m.metric} style={{ display: "grid", gridTemplateColumns: "1fr 160px 1fr", gap: 0, borderBottom: i < METRICS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <div style={{ padding: "14px 14px", fontSize: 11, fontWeight: 700, color: "#fff", borderRight: "1px solid rgba(255,255,255,0.04)" }}>{m.metric}</div>
                <div style={{ padding: "14px 14px", fontSize: 11, color: C.gold, fontWeight: 600, borderRight: "1px solid rgba(255,255,255,0.04)" }}>{m.target}</div>
                <div style={{ padding: "14px 14px", fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{m.why}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pilot environments */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Pilot Environments</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
            {PILOT_ENVS.map(env => (
              <div key={env.label} style={{ padding: "20px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${env.color}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: env.color, marginBottom: 8, lineHeight: 1.3 }}>{env.label}</div>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>{env.best}</p>
                <Link href={env.demo}><div style={{ fontSize: 9, fontWeight: 700, color: env.color, letterSpacing: "0.08em", cursor: "pointer" }}>View Demo →</div></Link>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "GTM Plan", href: "/partner-room/resources/travel-gtm-plan" },
            { label: "Commercial Brief", href: "/partner-room/resources/travel-commercial-partnership-brief" },
            { label: "Revenue Model", href: "/partner-room/resources/travel-revenue-model" },
            { label: "Next Step", href: "/partner-room/next-step" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
