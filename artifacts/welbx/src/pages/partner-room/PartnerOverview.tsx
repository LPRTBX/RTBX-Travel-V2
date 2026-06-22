import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { usePartnerContent } from "@/context/PartnerContentContext";

const DEFAULT_SECTIONS = [
  {
    num: "01",
    heading: "What WELBX Is",
    body: `WELBX is a real-time operating intelligence platform built for the hospitality industry. It sits between the signals your property already generates — from PMS, housekeeping, queue sensors, CRM, and staff systems — and the actions your team needs to take. It converts raw operational data into governed, auditable decisions and routes them to the right person at the right moment.

It is not a reporting tool. It does not produce dashboards for review. It operates in the present tense — detecting, classifying, deciding, and routing — so that execution happens before a moment becomes a problem, or before an opportunity is missed.`,
  },
  {
    num: "02",
    heading: "Why It Exists",
    body: `Hotels are high-signal environments. Every property generates thousands of data points per shift — from arrival manifests to queue depths, sentiment signals to staff capacity ratios. Most of that signal goes unread. The operational gap is not a data problem. It is an execution problem.

The interval between a signal being generated and the right person acting on it is where value is lost. WELBX closes that interval. Not by creating more data, but by turning existing data into coordinated, measured action — at the speed the guest experience actually requires.`,
  },
  {
    num: "03",
    heading: "Why Partners Matter",
    body: `WELBX is a platform, not a product. Its intelligence depends on the breadth and quality of signals it can read. The systems that already run in your property — the PMS, the task management platform, the housekeeping app, the CRM — are the signal sources that power the moment engine.

Integration partners extend what WELBX can detect and when. Operator partners are the deployment environment where the value is proven. Commercial partners extend the reach and the application of the operating layer to new contexts and asset classes. No single partner relationship is transactional. Each one deepens the platform.`,
  },
  {
    num: "04",
    heading: "Where Partner Value Is Created",
    body: `Value is created at the moment of execution — not in the planning layer, not in the reporting layer. When a VIP arrival is managed without incident, when a complaint is resolved before the guest leaves the property, when a dining activation window is acted on rather than missed — that is where the platform proves its case.

Partners participate in that value differently. Integration partners make the signal layer richer. Operator partners demonstrate the execution standard that makes the value measurable. Commercial partners extend the model to new properties, new markets, and new applications of the operating intelligence layer.`,
  },
  {
    num: "05",
    heading: "What Happens Next",
    body: `The Partner Room is a structured briefing — not a sales process. Each section is designed to give you the information you need to make a clear decision about whether and how a partnership makes sense.

Start with the section most relevant to your organisation — Operator Brief, Integration Brief, or Commercial Model. The Pilot Model outlines how we validate the platform in a live environment. The Demo Paths let you walk through specific operating scenarios before committing to a next conversation.

When you are ready, the next step is a direct briefing.`,
  },
];

export default function PartnerOverview() {
  const { content } = usePartnerContent();
  const sections = content?.overview?.sections ?? DEFAULT_SECTIONS;
  const headline = content?.overview?.headline ?? "WELBX — Five Things Worth Knowing";

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "72px 32px 120px" }}>

        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Platform Overview
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1, marginBottom: 0 }}>
            {headline}
          </h1>
        </div>

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
