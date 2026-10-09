import { useState } from "react";
import { Link } from "wouter";
import { WORKING_PROOF_PATH } from "@/lib/proofLanguage";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import Stage3ScenarioExperience from "./Stage3ScenarioExperience";

const linkStyle = {
  color: "#a8dedb", padding: "12px 16px",
  border: "1px solid rgba(168,222,219,0.4)", display: "inline-block",
};

export default function PartnerStage3Preview() {
  const [view, setView] = useState<"today" | "stage3">("stage3");
  return (
    <PartnerRoomLayout>
      <main className="rtbx-page-pad" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px 100px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12, color: "#a8dedb", marginBottom: 18 }}>
          <Link href="/partner-room/product-proof">Product Proof</Link>
          <span style={{ color: "#aeb5bf" }}> / Stage 3 Operating Layer</span>
        </nav>
        <header style={{ marginBottom: 28 }}>
          <p style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>JALDO Travel · Fictional demonstration</p>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)", color: "#fff", fontWeight: 800, lineHeight: 1.2, margin: "12px 0" }}>Stage 3 Operating Layer Preview</h1>
          <p style={{ color: "#bbc0ca", lineHeight: 1.7, maxWidth: 850 }}>
            Portfolio disruption and Safety &amp; wellbeing: two interactive Travel scenarios with accountable people, reviewed decisions and evidence of delivery.
            Safety intervention belongs earlier in the operating model. Stage 3 extends coordination and reviewed learning across properties.
          </p>
          <aside style={{ borderLeft: "3px solid #a78bfa", background: "rgba(167,139,250,.06)", padding: "16px 20px", color: "#c4c9d2", lineHeight: 1.7, margin: "20px 0" }}>
            All cases, signals, confirmations, receipts and outcomes are fictional. This is not live execution: no messages, tasks, bookings, transfers, welfare actions or payments are sent.
            Costs are modelled, not cash ROI. Role views demonstrate information boundaries, not authenticated access controls.
          </aside>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href={WORKING_PROOF_PATH} style={linkStyle}>View today's Working Proof →</Link>
            <Link href="/partner-room/product-proof/pilot-expansion-preview" style={linkStyle}>View the pilot preview →</Link>
          </div>
        </header>
        <div role="group" aria-label="Demo view" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
          <button type="button" aria-pressed={view === "today"} onClick={() => setView("today")} className="s3-btn">Explore today · Working Proof</button>
          <button type="button" aria-pressed={view === "stage3"} onClick={() => setView("stage3")} className="s3-btn">Experience Stage 3 · Planned simulation</button>
        </div>
        {view === "today" && (
          <section aria-label="Explore today" style={{ border: "1px solid rgba(168,222,219,.3)", padding: 24, marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, color: "#fff", fontWeight: 700 }}>Explore today · unchanged Working Proof</h2>
            <p style={{ color: "#c4c9d2", lineHeight: 1.7, margin: "16px 0" }}>The existing guest journey, Execution Centre and pilot preview keep their original routes and behaviour. They remain synthetic demonstrations, not external dispatch.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href="/partner-room/guest-demo" style={linkStyle}>Open the current guest journey →</Link>
              <Link href={WORKING_PROOF_PATH} style={linkStyle}>Open the current Working Proof →</Link>
              <Link href="/partner-room/product-proof/pilot-expansion-preview" style={linkStyle}>Open the pilot preview →</Link>
            </div>
          </section>
        )}
        <div hidden={view !== "stage3"}>
          <Stage3ScenarioExperience />
        </div>
      </main>
    </PartnerRoomLayout>
  );
}
