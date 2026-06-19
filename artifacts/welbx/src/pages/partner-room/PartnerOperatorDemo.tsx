import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const P = {
  bg: "#080c14", navy: "#0d1220", navy2: "#111827", border: "rgba(255,255,255,0.08)",
  amber: "#c9a84c", white: "#f8f9fb", muted: "rgba(255,255,255,0.5)",
  dimmed: "rgba(255,255,255,0.22)", green: "#10b981", red: "#ef4444",
  orange: "#f59e0b", blue: "#3b82f6",
};

const PRIORITY_COLOR: Record<string, string> = { CRITICAL: P.red, HIGH: P.orange, MEDIUM: P.amber, LOW: P.muted };

interface Moment {
  id: string;
  title: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  confidence: number;
  timeOpen: string;
  area: string;
  owner: string;
  suggestedAction: string;
  detail: {
    whatHappened: string;
    whyItMatters: string;
    signals: string[];
    recommendedAction: string;
    sopNudge: string;
    assignTo: string[];
    outcomes: string[];
  };
}

const MOMENTS: Moment[] = [
  {
    id: "vip", title: "VIP Arrival Risk", priority: "CRITICAL", confidence: 91,
    timeOpen: "3 min", area: "Rooms / Lobby", owner: "Front Office Manager",
    suggestedAction: "Upgrade or expedite room, arrange personal escort from lobby.",
    detail: {
      whatHappened: "Diamond-tier guest Mr V. Hartmann has an ETA of 12 minutes. Room 847 shows as occupied. Housekeeping ETA is 22 minutes — creating a 10-minute gap.",
      whyItMatters: "A Diamond-tier guest arriving to an uncleared room is a brand-level service failure. Recovery after arrival is significantly more costly than prevention.",
      signals: ["Diamond guest ETA: 12 min", "Room 847: occupied", "Housekeeping ETA: 22 min", "Loyalty tier: Diamond", "Previous visit flag: champagne on arrival"],
      recommendedAction: "Expedite housekeeping to Room 847 immediately. Assign front office escort to greet guest in lobby. Prepare welcome amenity.",
      sopNudge: "SOP VIP-002: Diamond arrivals require personal greeting, room readiness confirmation and complimentary amenity within 5 minutes of arrival.",
      assignTo: ["Front Office Manager", "Housekeeping Supervisor", "Duty Manager"],
      outcomes: ["Room cleared in time", "VIP escorted", "Amenity delivered", "Complaint avoided", "Follow-up required"],
    },
  },
  {
    id: "queue", title: "Queue Pressure Building", priority: "HIGH", confidence: 84,
    timeOpen: "8 min", area: "Main Lobby", owner: "Front Desk Supervisor",
    suggestedAction: "Deploy additional staff to secondary check-in desk. Activate mobile check-in.",
    detail: {
      whatHappened: "4 guests waiting at check-in desk. One agent handling. Average wait time rising to 7 minutes. Two guests show visible frustration signals.",
      whyItMatters: "Extended check-in queues are the leading cause of negative first impressions. Sentiment risk rises significantly after 6 minutes.",
      signals: ["Queue length: 4 guests", "Active agents: 1", "Average wait: 7 min", "Sentiment signal: 2 guests frustrated", "Lobby camera: crowd forming"],
      recommendedAction: "Deploy second agent to front desk within 2 minutes. Offer mobile check-in via QR to waiting guests.",
      sopNudge: "SOP FD-003: Queue exceeding 4 guests requires immediate secondary desk activation and manager acknowledgement.",
      assignTo: ["Front Desk Supervisor", "Duty Manager", "Concierge"],
      outcomes: ["Queue resolved", "Guests acknowledged", "Mobile check-in activated", "Escalated", "Follow-up required"],
    },
  },
  {
    id: "room-issue", title: "Room Issue Recovery", priority: "HIGH", confidence: 88,
    timeOpen: "12 min", area: "Room 614", owner: "Duty Manager",
    suggestedAction: "Assign duty manager to contact guest within 5 minutes and offer repair, room move or recovery option.",
    detail: {
      whatHappened: "Guest submitted room issue via in-room tablet at 21:14. Maintenance not yet assigned. Guest is Gold loyalty member on night 2 of 3-night stay.",
      whyItMatters: "Unresolved room issues on multi-night stays carry high churn risk. Gold members have elevated expectation of proactive recovery.",
      signals: ["Guest submitted room issue", "Maintenance not yet assigned", "Guest is loyalty member: Gold", "Sentiment risk rising", "Stay length: 3 nights, night 2"],
      recommendedAction: "Assign duty manager to contact guest within 5 minutes and offer repair, room move or service recovery gesture.",
      sopNudge: "SOP SR-001: Loyalty member room issues require direct manager contact within 5 minutes and documented recovery offer.",
      assignTo: ["Duty Manager", "Maintenance Lead", "Housekeeping"],
      outcomes: ["Resolved", "Guest satisfied", "Room move completed", "Revenue protected", "Follow-up required"],
    },
  },
  {
    id: "sentiment", title: "Guest Sentiment Drop", priority: "MEDIUM", confidence: 76,
    timeOpen: "6 min", area: "F&B / Restaurant", owner: "F&B Manager",
    suggestedAction: "Proactive outreach from F&B manager. Offer a complimentary course or gesture.",
    detail: {
      whatHappened: "Two guests at table 14 have had a 22-minute wait between courses. One guest made a comment to passing staff member. No escalation yet.",
      whyItMatters: "F&B sentiment drops have an outsized impact on overall stay rating. Review platform signals often correlate with restaurant experience.",
      signals: ["Course gap: 22 minutes", "Staff comment noted", "Review risk flag: table 14", "Guest: first visit", "Reservation: via OTA — review-sensitive"],
      recommendedAction: "F&B Manager to visit table 14, acknowledge the wait and offer a complimentary gesture. Kitchen to expedite next course.",
      sopNudge: "SOP FB-004: Course gaps exceeding 18 minutes require manager acknowledgement and documented recovery if guest shows frustration.",
      assignTo: ["F&B Manager", "Head Waiter", "Kitchen Supervisor"],
      outcomes: ["Guest acknowledged", "Recovery offered", "Review risk reduced", "Escalated to GM", "Follow-up required"],
    },
  },
  {
    id: "dining", title: "Dining Activation Window", priority: "MEDIUM", confidence: 81,
    timeOpen: "2 min", area: "Concierge / Hotel-wide", owner: "Concierge Team",
    suggestedAction: "Send curated dining suggestions via guest interface. Include partner restaurant options.",
    detail: {
      whatHappened: "Guest Sarah K. has a 2-hour gap before her restaurant reservation at 20:00. Wellness preference on profile. Currently in-room.",
      whyItMatters: "Identified free windows are the highest-conversion moments for ancillary and partner activation. Guest is receptive and in-property.",
      signals: ["Calendar gap: 2 hours before 20:00 reservation", "In-room: confirmed", "Wellness preference: flagged", "Loyalty tier: Gold", "No previous spa booking"],
      recommendedAction: "Present wellness, dining and local experience options via in-room interface. Flag spa availability. Attach partner offer if applicable.",
      sopNudge: "SOP CC-007: Identified guest windows with partner offer opportunity should be surfaced within 90 seconds of pattern detection.",
      assignTo: ["Concierge Team", "Spa Desk", "Partner Coordinator"],
      outcomes: ["Booking made", "Partner revenue created", "Guest engaged", "Offer declined", "Follow-up required"],
    },
  },
  {
    id: "staff-load", title: "Staff Load Risk", priority: "HIGH", confidence: 79,
    timeOpen: "18 min", area: "Housekeeping", owner: "Housekeeping Manager",
    suggestedAction: "Redistribute workload across available team. Flag priority rooms for first service.",
    detail: {
      whatHappened: "6 rooms overdue for service. Housekeeping team at 92% task capacity. 3 VIP arrivals expected in 40 minutes.",
      whyItMatters: "Staff overload ahead of VIP arrivals creates cascading failure risk. Housekeeping delays become VIP experience failures.",
      signals: ["Rooms overdue: 6", "Team capacity: 92%", "VIP arrivals in 40 min: 3", "Current average room turn: 28 min", "Required turn: 18 min"],
      recommendedAction: "Redeploy 2 staff from lower-priority areas. Mark 3 VIP rooms as priority one. Alert duty manager to monitor.",
      sopNudge: "SOP HK-002: Team capacity exceeding 85% with VIP arrivals pending requires immediate redistribution and manager sign-off.",
      assignTo: ["Housekeeping Manager", "Duty Manager", "Floor Supervisor"],
      outcomes: ["Workload redistributed", "VIP rooms cleared", "Escalated", "Additional resource called", "Follow-up required"],
    },
  },
];

const KPI = [
  { label: "Moments Today", value: "47", color: P.amber },
  { label: "Avg Response Time", value: "4.2 min", color: P.green },
  { label: "Recovery Success", value: "91%", color: P.green },
  { label: "Escalations Prevented", value: "12", color: P.blue },
  { label: "Opportunities Surfaced", value: "8", color: P.amber },
];

function DemoFooter() {
  return (
    <div style={{ borderTop: `1px solid ${P.border}`, padding: "40px 60px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Ready to map this to your environment?</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
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

export default function PartnerOperatorDemo() {
  const [selectedId, setSelectedId] = useState("room-issue");
  const selected = MOMENTS.find(m => m.id === selectedId) ?? MOMENTS[2];

  return (
    <PartnerRoomLayout>
      {/* Header */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "56px 60px 40px" }}>
        <div style={{ fontSize: 8, letterSpacing: "0.22em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
          OPERATOR RESPONSE DEMO
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: P.white, letterSpacing: "-0.02em", marginBottom: 10 }}>What the Operator Sees</h1>
        <p style={{ fontSize: 13, color: P.muted, maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
          A focused, action-first console. No complex dashboard. Every moment with a clear recommendation, owner and outcome path.
        </p>
      </div>

      {/* KPI Strip */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {KPI.map(k => (
            <div key={k.label} style={{ background: P.navy, border: `1px solid ${P.border}`, padding: "16px 20px" }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main: Queue + Detail */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 80px", display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, alignItems: "flex-start" }}>

        {/* Moment Queue */}
        <div style={{ background: P.navy, border: `1px solid ${P.border}` }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${P.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 8, letterSpacing: "0.18em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700 }}>Moment Queue</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: P.orange, padding: "2px 8px", background: `${P.orange}10`, border: `1px solid ${P.orange}30` }}>6 OPEN</span>
          </div>
          <div>
            {MOMENTS.map(m => {
              const isSelected = m.id === selectedId;
              const col = PRIORITY_COLOR[m.priority];
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  style={{
                    padding: "16px 20px", cursor: "pointer",
                    background: isSelected ? `${P.amber}06` : "transparent",
                    borderLeft: `3px solid ${isSelected ? P.amber : "transparent"}`,
                    borderBottom: `1px solid ${P.border}`,
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 7.5, fontWeight: 700, color: col, letterSpacing: "0.1em", textTransform: "uppercase" }}>{m.priority}</span>
                    <span style={{ fontSize: 7.5, color: P.dimmed }}>{m.timeOpen} ago</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: P.white, marginBottom: 5 }}>{m.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                    <span style={{ fontSize: 9, color: P.muted }}>{m.area}</span>
                    <span style={{ fontSize: 8, color: P.dimmed }}>·</span>
                    <span style={{ fontSize: 9, color: P.dimmed }}>{m.confidence}% confidence</span>
                  </div>
                  <div style={{ fontSize: 9.5, color: P.muted, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                    {m.suggestedAction}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div>
          {/* Header */}
          <div style={{ background: P.navy, border: `1px solid ${P.border}`, padding: "20px 26px", marginBottom: 14, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 7.5, fontWeight: 700, color: PRIORITY_COLOR[selected.priority], letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 8px", border: `1px solid ${PRIORITY_COLOR[selected.priority]}40`, background: `${PRIORITY_COLOR[selected.priority]}10` }}>{selected.priority}</span>
                <span style={{ fontSize: 7.5, color: P.dimmed }}>{selected.confidence}% confidence · Open {selected.timeOpen}</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: P.white, marginBottom: 4 }}>{selected.title}</h2>
              <div style={{ fontSize: 10.5, color: P.muted }}>{selected.area} · Recommended owner: {selected.owner}</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <div style={{ padding: "6px 14px", background: `${P.amber}12`, border: `1px solid ${P.amber}40`, color: P.amber, fontSize: 9, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em" }}>ASSIGN</div>
              <div style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${P.border}`, color: P.muted, fontSize: 9, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em" }}>DEFER</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {/* What happened */}
            <div style={{ background: P.navy, border: `1px solid ${P.border}`, padding: "18px 22px" }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>What Happened</div>
              <div style={{ fontSize: 11, color: P.muted, lineHeight: 1.7 }}>{selected.detail.whatHappened}</div>
            </div>
            {/* Why it matters */}
            <div style={{ background: P.navy, border: `1px solid ${P.border}`, padding: "18px 22px" }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Why It Matters</div>
              <div style={{ fontSize: 11, color: P.muted, lineHeight: 1.7 }}>{selected.detail.whyItMatters}</div>
            </div>
          </div>

          {/* Signals */}
          <div style={{ background: P.navy, border: `1px solid ${P.border}`, padding: "18px 22px", marginBottom: 14 }}>
            <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Signals Detected</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selected.detail.signals.map(s => (
                <span key={s} style={{ fontSize: 9.5, color: P.blue, padding: "4px 10px", background: `${P.blue}10`, border: `1px solid ${P.blue}25` }}>{s}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {/* Recommended action */}
            <div style={{ background: P.navy, border: `1px solid ${P.amber}25`, padding: "18px 22px" }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Recommended Action</div>
              <div style={{ fontSize: 11, color: P.muted, lineHeight: 1.7 }}>{selected.detail.recommendedAction}</div>
            </div>
            {/* SOP nudge */}
            <div style={{ background: P.navy, border: `1px solid ${P.border}`, padding: "18px 22px" }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>SOP Reference</div>
              <div style={{ fontSize: 10, color: P.muted, lineHeight: 1.7 }}>{selected.detail.sopNudge}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Assign to */}
            <div style={{ background: P.navy, border: `1px solid ${P.border}`, padding: "18px 22px" }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Assign To</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {selected.detail.assignTo.map(a => (
                  <div key={a} style={{
                    padding: "8px 12px", background: P.navy2, border: `1px solid ${P.border}`,
                    fontSize: 10.5, color: P.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    {a}
                    <span style={{ fontSize: 8, color: P.dimmed }}>→</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Outcome buttons */}
            <div style={{ background: P.navy, border: `1px solid ${P.border}`, padding: "18px 22px" }}>
              <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Record Outcome</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {selected.detail.outcomes.map((o, i) => (
                  <div key={o} style={{
                    padding: "8px 12px",
                    background: i === 0 ? `${P.green}08` : "transparent",
                    border: `1px solid ${i === 0 ? `${P.green}30` : P.border}`,
                    fontSize: 10.5, color: i === 0 ? P.green : P.muted, cursor: "pointer",
                  }}>
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DemoFooter />
    </PartnerRoomLayout>
  );
}
