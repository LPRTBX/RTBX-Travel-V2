import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const C = { gold: "#c9a84c", muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.22)", green: "#10b981", blue: "#3b82f6", violet: "#a78bfa" };

const MODEL_CARDS = [
  { label: "Signal Understanding", desc: "Interprets raw captured signals — text, structured events, sentiment cues — into normalised signal objects." },
  { label: "Moment Classification", desc: "Assists rules-based classification by surfacing likely moment type and category from ambiguous or compound signals." },
  { label: "Risk & Priority", desc: "Weighs urgency, guest impact and escalation risk to help order the response queue." },
  { label: "Decision Spine", desc: "Supports the governed decision system with pattern-informed recommendations, never bypassing operator-approved rules." },
  { label: "Communication Generation", desc: "Drafts guest and staff-facing messages within approved tone and policy guardrails for human review and approved dispatch." },
  { label: "Routing & Assignment", desc: "Recommends the right owner based on role, availability and moment type." },
  { label: "Escalation Forecasting", desc: "Flags moments likely to breach resolution thresholds before they do, based on historical pattern data." },
  { label: "Pattern Intelligence", desc: "Surfaces recurring moment clusters, high-risk windows and recovery effectiveness across a property or portfolio." },
  { label: "Marketplace Recommendation", desc: "Matches guest context and readiness signals to relevant local, dining or loyalty offers." },
  { label: "Assurance & Reporting", desc: "Synthesises assurance records into board-ready value and compliance reporting." },
  { label: "Operator Copilot", desc: "A conversational assistant for operators to query moment history, performance and pattern insights in plain language." },
];

const STAGES = [
  {
    num: "01",
    title: "Rules-Based MVP",
    color: "#c9a84c",
    desc: "The Working Proof uses deterministic rules and classification logic — no AI models in the response loop. Every demonstrated classification, routing decision and escalation is transparent and auditable by design.",
  },
  {
    num: "02",
    title: "AI-Assisted Pilot",
    color: "#3b82f6",
    desc: "As operator-approved integrations connect, AI models begin assisting signal understanding, classification confidence and communication drafting — always with a human or rules-based fallback.",
  },
  {
    num: "03",
    title: "Multi-Site Intelligence",
    color: "#a78bfa",
    desc: "At scale, pattern intelligence operates across a portfolio of properties — surfacing cross-site trends, benchmark performance and predictive risk windows for operators and funders.",
  },
];

const GRAPH_NODES = ["Captured Signal", "Signal Understanding", "Moment Classification", "Risk & Priority", "Decision Spine", "Action & Communication", "Outcome", "Pattern Intelligence"];

export default function TravelAiIntelligenceLayer() {
  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 120px" }}>

        {/* Positioning */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Partner Resource · AI Intelligence Layer</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 18, maxWidth: 720 }}>
            JALDO Travel — AI Intelligence Layer
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 700, marginBottom: 18 }}>
            The planned AI layer is designed to assist signal interpretation, classification confidence, recommendations and communication drafting. Governed rules and named human owners remain accountable for decisions and dispatch.
          </p>
          <div style={{ padding: "16px 20px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.22)", borderLeft: "3px solid #c9a84c", maxWidth: 700 }}>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>
              The current Working Proof uses deterministic rules and synthetic inputs. AI assistance is Planned for approved pilot stages after data sources, fallback rules and human-review controls are agreed.
            </p>
          </div>
        </div>

        {/* AI model stack */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>AI Model Stack</div>
          <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {MODEL_CARDS.map(m => (
              <div key={m.label} style={{ padding: "20px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${C.blue}` }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{m.label}</div>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stages */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Progressive Rollout</div>
          <div className="rtbx-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {STAGES.map(s => (
              <div key={s.num} style={{ padding: "22px 22px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderTop: `2px solid ${s.color}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: s.color, letterSpacing: "0.1em", marginBottom: 8 }}>STAGE {s.num}</div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff", marginBottom: 10 }}>{s.title}</div>
                <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Moment Graph */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>JALDO Travel Moment Graph</div>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7, maxWidth: 700, marginBottom: 20 }}>
            Every moment is a node connecting a captured signal to a classified outcome. Over time, the graph accumulates pattern intelligence — repeat moments, high-risk windows, recovery effectiveness — that strengthens classification and forecasting.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            {GRAPH_NODES.map((node, i) => (
              <div key={node} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ padding: "9px 14px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.02)" }}>{node}</div>
                {i < GRAPH_NODES.length - 1 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Build vs buy */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: C.dim, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Build vs Buy</div>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.75, maxWidth: 700, margin: 0 }}>
            JALDO Travel builds the classification, decision spine and assurance layer in-house — this is the proprietary moat. Underlying language and pattern-recognition models are sourced from established providers where it accelerates delivery without compromising governance, auditability or data control.
          </p>
        </div>

        {/* Safety and governance */}
        <div style={{ marginBottom: 40, padding: "20px 22px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ fontSize: 8, letterSpacing: "0.14em", color: C.gold, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Safety and Governance</div>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7, margin: 0 }}>
            AI-assisted outputs never bypass the governed decision system. Every AI-informed recommendation is logged, attributable and reviewable in the assurance registry. Operators retain override authority at every stage, and rules-based fallback logic remains active behind every AI model.
          </p>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Architecture, Modelling, UX & QA", href: "/partner-room/resources/travel-architecture-modelling-ux-qa" },
            { label: "Signals Engine Brief", href: "/partner-room/signals-engine" },
            { label: "Brief Library", href: "/partner-room/brief-library" },
            { label: "Product Proof", href: "/partner-room/product-proof" },
          ].map(b => (
            <Link key={b.href} href={b.href}><div style={{ padding: "9px 18px", border: "1px solid rgba(255,255,255,0.12)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{b.label} →</div></Link>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
