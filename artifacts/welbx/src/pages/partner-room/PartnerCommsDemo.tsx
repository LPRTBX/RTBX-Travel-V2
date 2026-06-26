import { useState } from "react";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const SCENARIOS = [
  "Room not ready at check-in",
  "Guest welfare concern — elderly guest, no activity",
  "Staff response timeout — service request 14 min",
  "VIP arrival — platinum guest suite",
  "Weather disruption — outdoor activities cancelled",
];

interface Message { recipient: string; role: string; color: string; channel: string; content: string; time: string; status: "sent" | "delivered" | "actioned" | "escalated"; }

const SCENARIO_MESSAGES: Record<string, { headline: string; trigger: string; messages: Message[] }> = {
  "Room not ready at check-in": {
    headline: "SERVICE_RECOVERY · Room readiness delay · L1",
    trigger: "WELBX check-in signal: guest arrived, room not ready, queue > 8 min",
    messages: [
      { recipient: "Guest", role: "WELBX App", color: "#3b82f6", channel: "WELBX Push", content: "Your room is nearly ready — we've reserved a comfortable spot in our lounge with complimentary refreshments. We'll send your key directly when ready.", time: "14:02", status: "delivered" },
      { recipient: "Front Desk", role: "Staff App", color: "#10b981", channel: "Staff Task", content: "ROOM DELAY: Guest [Chen, R.] — Room 412. Arrival: 14:00. Status: not ready. Assign lounge. Update every 10 min. Deadline: 14:30.", time: "14:02", status: "actioned" },
      { recipient: "Housekeeping", role: "Staff App", color: "#10b981", channel: "Priority Task", content: "PRIORITY: Room 412 — guest waiting at front desk. All other rooms on hold. Complete by 14:20.", time: "14:02", status: "actioned" },
      { recipient: "Duty Manager", role: "Manager Console", color: "#f97316", channel: "Dashboard Alert", content: "Room delay: Chen, R. · Room 412 · Guest waiting since 14:00 · Lounge offered · Escalation threshold: 14:30 · No action required yet.", time: "14:03", status: "sent" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#c9a84c", channel: "Live Record", content: "Moment #4821 | SERVICE_RECOVERY | STATUS: ACTIVE | Guest: Chen, R. | Delay: 14 min | Lounge: confirmed | Escalation timer: 27 min remaining", time: "14:03", status: "delivered" },
      { recipient: "Guest (completion)", role: "WELBX App", color: "#3b82f6", channel: "WELBX Push", content: "Your room is ready — key sent to your phone. Room 412, Level 4. We hope you enjoy your stay.", time: "14:22", status: "delivered" },
    ],
  },
  "Guest welfare concern — elderly guest, no activity": {
    headline: "GUEST_WELFARE · Inactivity pattern · L2",
    trigger: "Pattern signal: solo guest, Day 3, no app activity, no F&B scan, no room service",
    messages: [
      { recipient: "Welfare Officer", role: "Staff App", color: "#10b981", channel: "Priority Task", content: "WELFARE CHECK: Room 208 — Ms. Harper, solo guest, Day 3. No activity logged since 11pm last night. Discreet wellness check required. Record outcome.", time: "10:15", status: "actioned" },
      { recipient: "Duty Manager", role: "Manager Console", color: "#f97316", channel: "Dashboard Alert", content: "WELFARE PROTOCOL ACTIVE: Room 208 · Ms. Harper · Solo, Day 3 · Inactivity 11+ hrs · Check assigned to Maria T. · Standby for outcome.", time: "10:16", status: "sent" },
      { recipient: "Guest", role: "WELBX App", color: "#3b82f6", channel: "Courtesy Message", content: "Good morning Ms. Harper — we wanted to check you're comfortable and have everything you need. Would you like breakfast delivered to your room?", time: "10:17", status: "delivered" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#c9a84c", channel: "Live Record", content: "Moment #5503 | GUEST_WELFARE | L2 | STATUS: ACTIVE | Room 208 | Welfare check: assigned | Channel: multi | Timer: active", time: "10:16", status: "delivered" },
      { recipient: "Welfare Officer", role: "Staff App", color: "#10b981", channel: "Completion Confirm", content: "Welfare check complete: Ms. Harper confirmed safe and well. Offered mobility assistance. Guest accepted room service breakfast. Record closed.", time: "10:28", status: "actioned" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#c9a84c", channel: "Closure Record", content: "Moment #5503 | RESOLVED | Time: 12 min | Staff: Maria T. | Outcome: guest safe, assistance offered | Record: complete | No escalation", time: "10:28", status: "actioned" },
    ],
  },
  "Staff response timeout — service request 14 min": {
    headline: "STAFF_LOAD · Response threshold breach · L2",
    trigger: "Service request unactioned for 14 minutes — escalation threshold exceeded",
    messages: [
      { recipient: "Original Assignee", role: "Staff App", color: "#10b981", channel: "Escalation Reminder", content: "REMINDER: Guest request Room 318 — F&B delivery. Unactioned 14 min. Respond immediately or reassign.", time: "15:34", status: "sent" },
      { recipient: "Shift Supervisor", role: "Manager Console", color: "#f97316", channel: "Escalation Alert", content: "ESCALATION: Room 318 F&B request unactioned 14 min. Assigned: Tom B. (unresponsive). Reassign now or guest impact likely.", time: "15:34", status: "escalated" },
      { recipient: "Backup Staff", role: "Staff App", color: "#10b981", channel: "Reassignment Task", content: "REASSIGNED: Room 318 F&B — original owner unresponsive. Pick up immediately. Guest has been waiting 14 min. Apologise on delivery.", time: "15:35", status: "actioned" },
      { recipient: "Guest", role: "WELBX App", color: "#3b82f6", channel: "Apology Push", content: "We apologise for the delay with your order — we're with you in 5 minutes and have added a complimentary item to your delivery.", time: "15:35", status: "delivered" },
      { recipient: "Duty Manager", role: "Manager Console", color: "#f97316", channel: "Staffing Alert", content: "STAFF ALERT: Tom B. unresponsive to guest request. Second missed task this shift. Review performance. Guest impact: apologised + comp.", time: "15:36", status: "sent" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#c9a84c", channel: "Live Record", content: "Moment #6701 | STAFF_TIMEOUT | L2 | ESCALATED | Original owner: Tom B. | Reassigned: Anika S. | Guest: compensated | Record: complete", time: "15:38", status: "actioned" },
    ],
  },
  "VIP arrival — platinum guest suite": {
    headline: "VIP_GUEST · Platinum tier · Pre-arrival activation",
    trigger: "VIP profile loaded: Mr. Harrison, Platinum, Corporate: Meridian Group, Suite 901",
    messages: [
      { recipient: "Concierge (James M.)", role: "Staff App", color: "#10b981", channel: "VIP Brief", content: "VIP ARRIVAL: Mr. Harrison, Suite 901, ETA 15:00. Preferences: quiet room, firm pillow, still water, no housekeeping after 9pm. Personal greeting required.", time: "13:00", status: "actioned" },
      { recipient: "F&B", role: "Staff App", color: "#10b981", channel: "Pre-arrival Setup", content: "SUITE SETUP: Suite 901 — still water (x4), firm pillow swap completed, room preference notes loaded. Ready by 14:30.", time: "13:01", status: "actioned" },
      { recipient: "Duty Manager", role: "Manager Console", color: "#f97316", channel: "VIP Notification", content: "VIP IN HOUSE: Mr. Harrison · Platinum · Suite 901 · Corporate: Meridian Group · Concierge: James M. · No service disruptions on floor 9.", time: "13:02", status: "sent" },
      { recipient: "Mr. Harrison", role: "WELBX App", color: "#3b82f6", channel: "Welcome Message", content: "Welcome back, Mr. Harrison. Your suite is ready with your preferences. James, your dedicated concierge, is available directly through this app.", time: "15:05", status: "delivered" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#c9a84c", channel: "Live Record", content: "Moment #1104 | VIP_ARRIVAL | ACTIVE | Suite 901 | Concierge: James M. | Corporate: Meridian | Preferences: loaded | Status: on-track", time: "13:02", status: "delivered" },
      { recipient: "Corporate Account", role: "Account Dashboard", color: "#a78bfa", channel: "Account Update", content: "MERIDIAN GROUP: Mr. Harrison checked in Suite 901. VIP protocol active. Service standard: platinum. Account manager: notified.", time: "15:06", status: "sent" },
    ],
  },
  "Weather disruption — outdoor activities cancelled": {
    headline: "WEATHER_DISRUPTION · Multi-guest impact · L2",
    trigger: "Severe weather alert: 78 outdoor activities affected, 14:00–18:00",
    messages: [
      { recipient: "All Affected Guests", role: "WELBX Broadcast", color: "#3b82f6", channel: "WELBX Push", content: "Due to weather conditions, outdoor activities from 14:00–18:00 have moved indoors. Tap to select an alternative or request a reschedule or refund.", time: "13:45", status: "delivered" },
      { recipient: "Activities Team", role: "Staff App", color: "#10b981", channel: "Operations Brief", content: "WEATHER PROTOCOL: All outdoor sessions 14:00–18:00 cancelled. Indoor venue open (capacity: 40). Priority rebooking for families with children.", time: "13:44", status: "actioned" },
      { recipient: "F&B Manager", role: "Staff App", color: "#10b981", channel: "Capacity Alert", content: "ALERT: 78 guests indoors from 14:00. Open Terrace Bar + overflow café. Extra staffing approved by duty manager.", time: "13:44", status: "actioned" },
      { recipient: "Duty Manager", role: "Manager Console", color: "#f97316", channel: "Operations Alert", content: "WEATHER EVENT: 78 bookings affected. Comms sent. Indoor: 24 accepted. Refunds: 4 queued. Revenue protected: A$3,400 est. Monitor until 18:00.", time: "13:46", status: "sent" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#c9a84c", channel: "Live Record", content: "Moment #7840 | WEATHER_DISRUPTION | L2 | Guests: 78 | Alternatives accepted: 24 | Refunds: 4 | Revenue protected: A$3,400 | STATUS: ACTIVE", time: "13:46", status: "delivered" },
      { recipient: "Affected Guests (follow-up)", role: "WELBX App", color: "#3b82f6", channel: "Resolution Push", content: "We hope you enjoyed the indoor experience. As a thank-you for your patience, we've added a complimentary activity voucher for your next visit.", time: "18:10", status: "delivered" },
    ],
  },
};

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  sent:      { color: "rgba(255,255,255,0.3)", label: "Sent" },
  delivered: { color: "#3b82f6",              label: "Delivered" },
  actioned:  { color: "#10b981",              label: "Actioned" },
  escalated: { color: "#f97316",              label: "Escalated" },
};

export default function PartnerCommsDemo() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [active, setActive] = useState<number | null>(null);

  const data = SCENARIO_MESSAGES[scenario];

  return (
    <PartnerRoomLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 140px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            Product Proof · Communications
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>
            Communications Routing Demo
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 580 }}>
            Select a scenario — then see how RTBX Core routes the right message to the right person at the right time.
          </p>
        </div>

        {/* Scenario selector */}
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 32 }}>
          {SCENARIOS.map(s => (
            <div
              key={s}
              onClick={() => { setScenario(s); setActive(null); }}
              style={{
                padding: "9px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s",
                border: `1px solid ${s === scenario ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)"}`,
                background: s === scenario ? "rgba(201,168,76,0.1)" : "transparent",
                color: s === scenario ? "#c9a84c" : "rgba(255,255,255,0.35)",
              }}
            >{s}</div>
          ))}
        </div>

        {/* Trigger banner */}
        <div style={{ padding: "12px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 24, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginTop: 2, whiteSpace: "nowrap" }}>Trigger</div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>{data.trigger}</div>
          <div style={{ marginLeft: "auto", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)", padding: "3px 10px", whiteSpace: "nowrap" }}>
            {data.headline.split("·")[0].trim()}
          </div>
        </div>

        {/* Message routing */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "32px 140px 100px 1fr 100px 90px", gap: 0, padding: "8px 16px", background: "rgba(255,255,255,0.02)" }}>
            {["#", "Recipient", "Channel", "Message", "Time", "Status"].map(h => (
              <div key={h} style={{ fontSize: 7.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", fontWeight: 700, padding: "0 8px" }}>{h}</div>
            ))}
          </div>
          {data.messages.map((msg, i) => {
            const st = STATUS_STYLES[msg.status];
            const isActive = active === i;
            return (
              <div key={i}>
                <div
                  onClick={() => setActive(isActive ? null : i)}
                  style={{
                    display: "grid", gridTemplateColumns: "32px 140px 100px 1fr 100px 90px",
                    padding: "14px 16px", gap: 0, cursor: "pointer", transition: "background 0.12s",
                    background: isActive ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
                    border: `1px solid ${isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)"}`,
                    borderLeft: `3px solid ${msg.color}`,
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)"; }}
                >
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", padding: "0 8px", paddingTop: 2 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div style={{ padding: "0 8px" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: msg.color }}>{msg.recipient}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>{msg.role}</div>
                  </div>
                  <div style={{ padding: "0 8px", fontSize: 9.5, color: "rgba(255,255,255,0.38)", fontWeight: 600, paddingTop: 2 }}>{msg.channel}</div>
                  <div style={{ padding: "0 8px", fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.45, paddingTop: 1 }}>
                    {msg.content.length > 90 ? msg.content.slice(0, 90) + "…" : msg.content}
                  </div>
                  <div style={{ padding: "0 8px", fontSize: 10.5, color: "rgba(255,255,255,0.35)", fontWeight: 600, paddingTop: 2 }}>{msg.time}</div>
                  <div style={{ padding: "0 8px", paddingTop: 2 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: st.color, border: `1px solid ${st.color}30`, padding: "2px 7px", display: "inline-block" }}>
                      {st.label}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <div style={{ padding: "18px 24px", background: `${msg.color}07`, border: `1px solid ${msg.color}20`, borderTop: "none", marginBottom: 0 }}>
                    <div style={{ fontSize: 8, letterSpacing: "0.14em", color: msg.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Full Message</div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontStyle: msg.recipient === "Guest" || msg.recipient.startsWith("Mr.") || msg.recipient.startsWith("Ms.") || msg.recipient.includes("Guest") ? "italic" : "normal" }}>
                      {msg.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
