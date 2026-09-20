import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981" };

const PHASES = [
  { n: "01", label: "Proposed Operator Alignment", weeks: "Week 1", desc: "Propose objectives, proof environments, operator contact and governance for approval.", output: "Draft pilot brief, moment map and contact matrix." },
  { n: "02", label: "Proposed Moment Mapping", weeks: "Week 1–2", desc: "Propose a guest journey, moment types and candidate signal sources, subject to integration approval.", output: "Draft moment map and candidate signal-source list." },
  { n: "03", label: "Proposed Scenario Validation", weeks: "Week 2–3", desc: "Propose 5–10 operating scenarios and test illustrative classification logic; no real-environment validation is implied.", output: "Draft scenario set, thresholds and briefing materials." },
  { n: "04", label: "Staff & Guest Pathway Setup", weeks: "Week 3–4", desc: "Propose staff action cards and a Guest Experience interface for approved testing. Test a simulated end-to-end pathway.", output: "Proposed pathway configuration and test plan, subject to operator sign-off." },
  { n: "05", label: "Proposed Shadow Pilot", weeks: "Week 4–6", desc: "A future approved shadow pilot could run in parallel using agreed inputs; no live delivery occurs.", output: "Potential measurement data and adjustment recommendations, subject to approval." },
  { n: "06", label: "Proposed Live Pilot", weeks: "Week 6–10", desc: "Future live operation only if approved and integrated. Scope, guest/staff participation and pathways remain contingent on governance, with named operators accountable for every action.", output: "Potential measured operating data, subject to approved pilot execution." },
  { n: "07", label: "Reporting & Value Measurement", weeks: "Week 10–12", desc: "A future outcome report would compare approved baseline metrics. Any value or conversion case remains contingent on measurement.", output: "Proposed outcome report and measurement summary." },
  { n: "08", label: "Future Expansion Decision", weeks: "Post-pilot", desc: "Any expansion, additional environment or annual agreement follows approved pilot evidence and commercial agreement.", output: "Potential expansion recommendation and proposed terms." },
];

const METRICS = [
  { metric: "Guest engagement rate", target: "Illustrative target: >60%", why: "Potential measure for whether an approved pathway reaches an appropriate moment" },
  { metric: "Service recovery rate", target: "Illustrative target: >80%", why: "Potential measure, not proof, of a recovery hypothesis" },
  { metric: "Staff response completion", target: "Illustrative target: >90%", why: "Potential measure for an approved staff-pathway design" },
  { metric: "Escalation reduction hypothesis", target: "Illustrative baseline comparison: >30%", why: "Potential operational-risk measure requiring pilot evidence" },
  { metric: "Revenue opportunity signals", target: "Illustrative count + conversion comparison", why: "Potential marketplace/F&B measure after approved integration" },
  { metric: "Guest sentiment movement", target: "Proposed pre/post comparison", why: "Potential guest-experience measure" },
  { metric: "Assurance record coverage", target: "Illustrative target: 100%", why: "Potential duty-of-care and governance measure" },
  { metric: "Operator time hypothesis", target: "Proposed staff-hours comparison", why: "Potential efficiency measure for an ROI hypothesis" },
];

const PILOT_ENVS = [
  { label: "Hotels & Resorts", color: "#c9a84c", best: "Proposed first proof environment based on assumed signal density; value remains to be measured.", demo: "/partner-room/deployments/hotels-resorts/demo" },
  { label: "Holiday Parks", color: "#10b981", best: "Proposed environment for testing welfare and weather signal hypotheses.", demo: "/partner-room/holiday-park-demo" },
  { label: "Corporate Travel", color: "#3b82f6", best: "Proposed environment for repeat-guest and duty-of-care hypotheses; integration effort remains unvalidated.", demo: "/partner-room/deployments/corporate-travel/demo" },
  { label: "Events & Venues", color: "#a78bfa", best: "High-density, high-risk. Welfare and safety signals create auditable value.", demo: "/partner-room/deployments/events-venues/demo" },
  { label: "Destination", color: "#22d3ee", best: "Future marketplace and partner-ecosystem hypothesis, contingent on approved and measured earlier pilots.", demo: "/partner-room/deployments/destination-tourism/demo" },
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
        <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderLeft: "3px solid #c9a84c", marginBottom: 28 }}>
          <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 7 }}>Planned Pilot Model</div>
          <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6 }}>Timing, fees, targets and outcomes are illustrative planning assumptions, not live commitments or proven results. Any pilot, integration, guest/staff interaction, measurement or commercial conversion requires approval and agreed governance.</div>
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
            { label: "Explore a Design Partnership", href: "/partner-room/next-step" },
            { label: "Build & Configure", href: "/partner-room/build-configure" },
            { label: "Resource Library", href: "/partner-room/brief-library" },
            { label: "Next Step", href: "/partner-room/next-step" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
