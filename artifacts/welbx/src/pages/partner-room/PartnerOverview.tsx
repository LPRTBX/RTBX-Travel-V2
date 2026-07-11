import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { usePartnerContent } from "@/context/PartnerContentContext";

const DEFAULT_SECTIONS = [
  {
    num: "01",
    heading: "What RTBX Travel Is",
    body: `RTBX Travel is the travel and hospitality vertical of RTBX Group. It applies RTBX Core — a real-time signal-to-action infrastructure — to the specific operating environment of guest-facing travel properties. RTBX Core sits between the signals your property already generates and the actions your teams need to take. It converts raw operational data into governed, auditable decisions routed to the right person at the right moment.

WELBX is the guest-facing experience layer inside RTBX Travel. It is what guests interact with — the check-in moment, the in-stay nudge, the wellbeing prompt, the concierge-style support. RTBX Core is the infrastructure that makes that experience consistent and measurable.

RTBX Travel is powered by RTBX Core. WELBX is the guest-facing experience layer.`,
  },
  {
    num: "02",
    heading: "Why It Exists",
    body: `Travel properties are high-signal environments. Every property generates thousands of data points per shift — from arrival manifests to queue depths, sentiment signals to staff capacity ratios. Most of that signal goes unread. The operational gap is not a data problem. It is an execution problem.

The interval between a signal being generated and the right person acting on it is where value is lost. RTBX Core closes that interval — not by creating more data, but by turning existing data into coordinated, measured action at the speed the guest experience actually requires.

WELBX is the human layer guests interact with. RTBX Core is the infrastructure layer that classifies signals, guides action, escalates risk and creates the assurance trail.`,
  },
  {
    num: "03",
    heading: "Why Partners Matter",
    body: `RTBX Travel is a platform, not a product. Its intelligence depends on the breadth and quality of signals it can read. The systems that already run in your property — the PMS, the task management platform, the housekeeping app, the CRM — are the signal sources that power the RTBX Core moment engine.

Integration partners extend what RTBX Core can detect and when. Operator partners are the deployment environment where the value is proven. Commercial partners extend the reach and the application of the operating layer to new contexts and asset classes. No single partner relationship is transactional. Each one deepens the platform.`,
  },
  {
    num: "04",
    heading: "Where Partner Value Is Created",
    body: `Value is created at the moment of execution — not in the planning layer, not in the reporting layer. When a VIP arrival is managed without incident, when a complaint is resolved before the guest leaves the property, when a dining activation window is acted on rather than missed — that is where the platform proves its case.

Partners participate in that value differently. Integration partners make the RTBX Core signal layer richer. Operator partners demonstrate the execution standard that makes the value measurable. Commercial partners extend the model to new properties, new markets, and new applications of the operating intelligence layer.`,
  },
  {
    num: "05",
    heading: "What Happens Next",
    body: `The Partner Room is a structured briefing — not a sales process. Each section is designed to give you the information you need to make a clear decision about whether and how a partnership makes sense.

Start with the section most relevant to your organisation — Brief Library for operator context, RTBX Core Demo for the technical chain, WELBX Experience for the guest layer, or Commercial Model for partnership structure. The Pilot Model outlines how we validate the platform in a live environment.

When you are ready, the next step is a direct briefing.`,
  },
];

export default function PartnerOverview() {
  const { content } = usePartnerContent();
  const sections = content?.overview?.sections ?? DEFAULT_SECTIONS;
  const headline = content?.overview?.headline ?? "RTBX Travel — Five Things Worth Knowing";

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "72px 32px 120px" }}>

        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Briefing Room · Platform Overview
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
            {headline}
          </h1>
          {/* Brand hierarchy callout */}
          <div style={{
            display: "inline-flex",
            flexWrap: "wrap",
            gap: 0,
            marginTop: 4,
          }}>
            {[
              { label: "RTBX Group", sub: "Parent ecosystem", color: "rgba(255,255,255,0.4)" },
              { label: "RTBX Core", sub: "Signal-to-action engine", color: "#c9a84c" },
              { label: "RTBX Travel", sub: "Travel vertical", color: "#c9a84c" },
              { label: "WELBX", sub: "Guest experience layer", color: "#3b82f6" },
            ].map((item, i, arr) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div style={{ padding: "6px 14px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRight: "none" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: item.color }}>{item.label}</div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", marginTop: 2 }}>{item.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 16, height: 1, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Link href="/partner-room/travel-intelligence">
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", marginBottom: 8,
            background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", cursor: "pointer",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", letterSpacing: "0.04em" }}>
              See how RTBX Core is configured for Travel — RTBX Travel Intelligence →
            </span>
          </div>
        </Link>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {sections.map((section) => (
            <div key={section.num} style={{
              padding: "48px 0",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "grid",
              gridTemplateColumns: "80px 1fr",
              gap: 40,
            }}>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(201,168,76,0.35)", letterSpacing: "0.08em" }}>{section.num}</div>
              </div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 24, letterSpacing: "-0.01em" }}>
                  {section.heading}
                </h2>
                {section.body.split("\n\n").map((para, j) => (
                  <p key={j} style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 16 }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PartnerRoomLayout>
  );
}
