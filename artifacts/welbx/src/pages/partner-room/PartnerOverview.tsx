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
    heading: "The Role of RTBX",
    body: `RTBX Core is the shared signal-to-action infrastructure. It sits between the signals your property already generates and the actions your teams need to take. It does not replace any system. It reads them, classifies what they collectively mean, determines the governed response, and routes it to the right person.

RTBX Travel is RTBX Core configured for travel and hospitality environments — guest moments, operational pressure, commercial activation, welfare obligations, and partner ecosystems. WELBX is the guest-facing experience layer: what guests interact with directly.`,
  },
  {
    num: "04",
    heading: "The Five-Step Engine",
    body: `Every moment runs through five stages:

Connect — Ingest signals from every guest, staff, system and partner touchpoint. PMS arrivals, guest app events, housekeeping status, IoT alerts — all normalised and classified.

Understand — Classify incoming signals into known moment types. A room delay plus a loyalty flag plus a frustrated guest signal becomes a Service Recovery Moment with a risk level and value at stake.

Decide — Apply pre-approved governance rules to determine the permitted response path. Compensation requires manager approval. Welfare decisions require human sign-off. No autonomous action is permitted.

Act — Route the governed response to the correct human role owner via the right channel. The duty manager receives a clear instruction. The guest receives a message that was drafted by AI and approved by a human.

Learn — Turn every actioned outcome into measurable, compounding value. Every resolution feeds the pattern library. Detection improves. Playbook performance is tracked and reported.`,
  },
  {
    num: "05",
    heading: "The Six Intelligence Layers",
    body: `RTBX Core is built on six layers, each configured for Travel:

Signal Layer — captures, normalises and classifies every incoming signal across all sources. The Travel Signal Registry holds 30+ representative signal types across guest experience, operations, safety and welfare, commercial and partner domains.

Moment Layer — recognises which known moment type a signal cluster represents. The Travel Moment Taxonomy defines 10 canonical moment types, each with risk level, governance requirements and value at stake.

Governance Layer — applies pre-approved governance rules before any response is permitted. Every moment response is gated by at least one governance source.

Decision Layer — selects the permitted playbook and assigns the human role owner. No autonomous decision — every response path terminates at a named human role.

Communications Layer — delivers governed instructions and AI-drafted messages to the right person via the right channel. WELBX is the guest-facing delivery channel.

Outcome & Value Layer — records every actioned outcome and converts it into measurable, compounding value.`,
  },
  {
    num: "06",
    heading: "Travel Configuration",
    body: `The Travel Intelligence Pack configures RTBX Core for the specific operating environment of travel and hospitality. It provides:

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
    body: `RTBX Travel packages its capabilities into five operating systems, each addressing a major hotel operating problem:

Guest Experience OS — check-in, in-stay service, concierge moments, loyalty activation and departure.

Service Recovery & Staff Response OS — incident detection, SLA tracking, escalation routing, compensation governance and evidence logging.

Marketplace & Loyalty Activation OS — commercial moment detection, partner activation, dining and experience routing.

Operator Intelligence OS — portfolio performance, shift intelligence, staff capacity signals, management reporting.

Safety & Guest Welfare OS — welfare signal detection, duty-of-care protocols, incident evidence and critical escalation.

Each OS groups specific modules around its problem domain. Every OS depends on RTBX Core capabilities and Travel Intelligence configuration — no OS is a standalone platform.`,
  },
  {
    num: "08",
    heading: "Working Proof",
    body: `The system is architecturally complete and demonstrable in this Partner Room. The sections of this room show working interfaces, scenario replay, configurable data models, governance logic and evidence trail design.

This is not a claim that the site is a fully integrated production platform. Each demonstration is labelled with its current status: working interface in this environment, synthetic scenario using representative data, architecturally defined but not yet connected, or requiring a pilot to validate at full signal volume.

The Live MVP Preview (available from the Product Proof section) demonstrates the first deployable wedge — Moment Response — as a working product.`,
  },
  {
    num: "09",
    heading: "Pilot Pathway",
    body: `The path from Partner Room to live deployment runs through seven stages: Explore, Align, Configure, Pilot, Prove, Deploy, Expand. The pilot conversation is the starting point.

RTBX Core remains consistent through every stage. What changes at each stage is the Travel environment — which systems are connected, which operating systems are activated, which governance rules are configured, which roles are assigned, and which outcome targets are set.

The Pilot Model section of this room describes the eight-week pilot structure, success criteria and evidence standard. The Commercial Model section describes partnership structure, investment and return model.`,
  },
];

export default function PartnerOverview() {
  const { content } = usePartnerContent();
  const sections = content?.overview?.sections ?? DEFAULT_SECTIONS;
  const headline = content?.overview?.headline ?? "RTBX Travel — The Operating Case";

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
