import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { usePartnerContent } from "@/context/PartnerContentContext";

const DEFAULT_SECTIONS = [
  {
    num: "01",
    heading: "The Operating Problem",
    body: `Travel properties are high-signal environments. Every property generates thousands of data points per shift — from arrival manifests to queue depths, sentiment signals to staff capacity ratios. Most of that signal goes unread. The operational gap is not a data problem. It is an execution problem.

The interval between a signal being generated and the right person acting on it is where value is lost. Complaint risk accumulates. Commercial windows close. Loyalty moments pass. Safety and welfare flags sit unread in inboxes. The property is full of information and short of coordinated action.`,
  },
  {
    num: "02",
    heading: "Why Existing Systems Don't Coordinate",
    body: `The PMS knows the room is not ready. The housekeeping app knows the team is overloaded. The guest app knows the guest is frustrated. The CRM knows the guest is a high-value loyalty member. None of these systems talk to each other. Each is optimised for its own function.

There is no governed execution layer between signal and action. No system asks: what is the right thing to do right now, for this guest, given what we know, within the rules we have agreed? That gap is structural — and it is where the value of the travel experience degrades.`,
  },
  {
    num: "03",
    heading: "The Role of JALDO",
    body: `JALDO Core is the shared signal-to-action infrastructure. It sits between the signals your property already generates and the actions your teams need to take. It does not replace any system. It reads them, classifies what they collectively mean, determines the governed response, and routes it to the right person.

JALDO Travel is JALDO Core configured for travel and hospitality environments — guest moments, operational pressure, commercial activation, welfare obligations, and partner ecosystems. Guest Experience is the guest-facing layer: what guests interact with directly.`,
  },
  {
    num: "04",
    heading: "The Five-Step Engine",
    body: `Every moment runs through five stages: Connect → Understand → Decide → Act → Learn. Signal ingestion, moment classification, governance-gated decision, human-owned action, and compounding value. No stage is an autonomous system decision.

See the full engine detail on the Operating Model page.`,
  },
  {
    num: "05",
    heading: "The Six Intelligence Layers",
    body: `JALDO Core is built on six layers, each configured for Travel: Signal, Moment, Governance, Decision, Communications, and Outcome & Value. Each layer has domain-specific signals, moment types, governance policies and outcome models configured for travel environments.

The full layer architecture is documented on the Operating Model page.`,
  },
  {
    num: "06",
    heading: "Travel Configuration",
    body: `The Travel Intelligence Pack configures JALDO Core for the specific operating environment of travel and hospitality. It provides:

Travel Signal Registry — 30+ classified signal types across guest experience, operations, safety and welfare, commercial and partner domains. The full library runs to hundreds of types per deployment.

Travel Moment Taxonomy — 10 canonical moment types, from Service Recovery and Guest Welfare to Commercial Activation and Post-Stay Recovery.

Travel Governance Sources — 11 canonical policies including Guest Safety Procedure, Compensation Approval Matrix, Loyalty Treatment Standard and Privacy and Consent Rules.

Travel Playbook Library — response patterns matched to moment types and governance clearance. Every playbook has a named human role owner.

Travel Role Model — 12 roles with defined scope, approval authority and escalation triggers.

Travel Outcome Model — 12 canonical outcome types, from Response Started to Post-Stay Outcome.`,
  },
  {
    num: "07",
    heading: "Travel Operating Systems",
    body: `JALDO Travel packages its capabilities into five operating systems, each addressing a major hotel operating problem:

Guest Experience OS — check-in, in-stay service, concierge moments, loyalty activation and departure.

Service Recovery & Staff Response OS — incident detection, SLA tracking, escalation routing, compensation governance and evidence logging.

Marketplace & Loyalty Activation OS — commercial moment detection, partner activation, dining and experience routing.

Operator Intelligence OS — portfolio performance, shift intelligence, staff capacity signals, management reporting.

Safety & Guest Welfare OS — welfare signal detection, duty-of-care protocols, incident evidence and critical escalation.

Each OS groups specific modules around its problem domain. Every OS depends on JALDO Core capabilities and Travel Intelligence configuration — no OS is a standalone platform.`,
  },
  {
    num: "08",
    heading: "Working Proof",
    body: `The system is architecturally complete and demonstrable in this Partner Room. The sections of this room show working interfaces, scenario replay, configurable data models, governance logic and evidence trail design.

This is not a claim that the site is a fully integrated production platform. Each demonstration is labelled with its current status: working interface in this environment, synthetic scenario using representative data, architecturally defined but not yet connected, or requiring a pilot to validate at full signal volume.

The internal Working Proof (available from the Product Proof section) demonstrates the governed Moment Response interface and synthetic workflow. It is not an Integrated or Production deployment.`,
  },
  {
    num: "09",
    heading: "Pilot Pathway",
    body: `The path from Partner Room to live deployment runs through seven stages: Explore, Align, Configure, Pilot, Prove, Deploy, Expand. The pilot conversation is the starting point.

JALDO Core remains consistent through every stage. What changes at each stage is the Travel environment — which systems are connected, which operating systems are activated, which governance rules are configured, which roles are assigned, and which outcome targets are set.

The Pilot Model section of this room describes the 8–10 week implementation and readiness structure followed by a 2–3 month controlled pilot, success criteria and evidence standard. The Commercial Model section describes partnership structure, investment and return model.`,
  },
];

export default function PartnerOverview() {
  const { content } = usePartnerContent();
  const sections = content?.overview?.sections ?? DEFAULT_SECTIONS;
  const headline = content?.overview?.headline ?? "JALDO Travel — The Operating Case";

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "72px 32px 120px" }}>

        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#a8dedb", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
            Briefing Room · Platform Overview
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
            {headline}
          </h1>
          {/* Brand context — concise, links to full model */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>JALDO</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>→</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#a8dedb" }}>JALDO Core</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>→</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#a8dedb" }}>JALDO Travel</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>→</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6" }}>Guest Experience</span>
            <Link href="/partner-room/operating-model">
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 8, cursor: "pointer", textDecoration: "underline" }}>Full Operating Model →</span>
            </Link>
          </div>
        </div>

        <Link href="/partner-room/travel-intelligence">
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", marginBottom: 8,
            background: "rgba(168,222,219,0.05)", border: "1px solid rgba(168,222,219,0.2)", cursor: "pointer",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#a8dedb", letterSpacing: "0.04em" }}>
              See how JALDO Core is configured for Travel — JALDO Travel Intelligence →
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
                <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(168,222,219,0.35)", letterSpacing: "0.08em" }}>{section.num}</div>
              </div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 24, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                  {section.heading}
                </h2>
                {section.body.split("\n\n").map((para, j) => (
                  <p key={j} style={{ fontSize: 15, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, marginBottom: 16 }}>
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
