import { useState } from "react";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const SCENARIOS = [
  "Room not ready at check-in",
  "Guest welfare concern — elderly guest, no activity",
  "Staff response timeout — service request 14 min",
  "VIP arrival — platinum guest suite",
  "Weather disruption — outdoor activities cancelled",
];

interface Message { recipient: string; role: string; color: string; channel: string; content: string; time: string; status: "draft" | "proposed" | "modelled" | "approval-required"; }

const SCENARIO_MESSAGES: Record<string, { headline: string; trigger: string; messages: Message[] }> = {
  "Room not ready at check-in": {
    headline: "SERVICE_RECOVERY · Room readiness delay · L1",
    trigger: "Guest Channel check-in signal: guest arrived, room not ready, queue > 8 min",
    messages: [
      { recipient: "Guest", role: "Guest View", color: "#3b82f6", channel: "Proposed Guest Draft", content: "Draft option: while room readiness is reviewed by a named operator, a lounge option and refreshments could be offered.", time: "14:02", status: "draft" },
      { recipient: "Front Desk", role: "Staff App", color: "#10b981", channel: "Proposed Staff Draft", content: "Proposed room-delay response for human review: assess lounge availability and consider a ten-minute update cadence.", time: "14:02", status: "proposed" },
      { recipient: "Housekeeping", role: "Staff App", color: "#10b981", channel: "Proposed Priority Draft", content: "Proposed priority review: a named housekeeping lead could assess Room 412 against other room-readiness needs.", time: "14:02", status: "proposed" },
      { recipient: "Duty Manager", role: "Manager Console", color: "#f97316", channel: "Proposed Alert Draft", content: "Modelled room-delay context for Duty Manager approval: review a possible escalation threshold at 14:30.", time: "14:03", status: "approval-required" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#a8dedb", channel: "Modelled Local Trace", content: "Modelled trace #4821 | SERVICE_RECOVERY | proposed review | synthetic delay input | no record created.", time: "14:03", status: "modelled" },
      { recipient: "Guest (proposed follow-up)", role: "Guest View", color: "#3b82f6", channel: "Proposed Guest Draft", content: "Draft follow-up: a named operator could provide room-readiness details after human review. No key is sent.", time: "14:22", status: "draft" },
    ],
  },
  "Guest welfare concern — elderly guest, no activity": {
    headline: "GUEST_WELFARE · Inactivity pattern · L2",
    trigger: "Pattern signal: solo guest, Day 3, no app activity, no F&B scan, no room service",
    messages: [
      { recipient: "Welfare Officer", role: "Staff App", color: "#10b981", channel: "Proposed Welfare Draft", content: "Proposed discreet welfare-check draft for named Welfare Officer review. No welfare action is created.", time: "10:15", status: "approval-required" },
      { recipient: "Duty Manager", role: "Manager Console", color: "#f97316", channel: "Proposed Alert Draft", content: "Modelled welfare context for Duty Manager review; a named human decides whether a check is appropriate.", time: "10:16", status: "approval-required" },
      { recipient: "Guest", role: "Guest View", color: "#3b82f6", channel: "Courtesy Draft", content: "Draft: Good morning Ms. Harper. Would you like to discuss comfort or support options with a named staff member?", time: "10:17", status: "draft" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#a8dedb", channel: "Modelled Local Trace", content: "Modelled trace #5503 | GUEST_WELFARE | rules classification | human review required | no record created.", time: "10:16", status: "modelled" },
      { recipient: "Welfare Officer", role: "Staff App", color: "#10b981", channel: "Proposed Follow-up Draft", content: "Modelled follow-up prompt: a named Welfare Officer could document an outcome if a real check were approved.", time: "10:28", status: "proposed" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#a8dedb", channel: "Modelled Review Trace", content: "Modelled trace #5503 | outcome not measured | no closure or escalation recorded.", time: "10:28", status: "modelled" },
    ],
  },
  "Staff response timeout — service request 14 min": {
    headline: "STAFF_LOAD · Response threshold breach · L2",
    trigger: "Service request unactioned for 14 minutes — escalation threshold exceeded",
    messages: [
      { recipient: "Original Assignee", role: "Staff App", color: "#10b981", channel: "Proposed Reminder Draft", content: "Proposed reminder for human review: assess the synthetic Room 318 request and consider reassignment.", time: "15:34", status: "draft" },
      { recipient: "Shift Supervisor", role: "Manager Console", color: "#f97316", channel: "Proposed Escalation Draft", content: "Modelled escalation context for named Shift Supervisor approval; no escalation is raised.", time: "15:34", status: "approval-required" },
      { recipient: "Backup Staff", role: "Staff App", color: "#10b981", channel: "Proposed Reassignment Draft", content: "Proposed reassignment option for named staff review; no task is assigned.", time: "15:35", status: "proposed" },
      { recipient: "Guest", role: "Guest View", color: "#3b82f6", channel: "Proposed Apology Draft", content: "Draft apology: a named operator could review a delay update and possible goodwill option.", time: "15:35", status: "draft" },
      { recipient: "Duty Manager", role: "Manager Console", color: "#f97316", channel: "Proposed Staffing Draft", content: "Modelled staffing context for Duty Manager review; no performance conclusion or compensation is recorded.", time: "15:36", status: "approval-required" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#a8dedb", channel: "Modelled Local Trace", content: "Modelled trace #6701 | STAFF_TIMEOUT | proposed human review | no reassignment or record created.", time: "15:38", status: "modelled" },
    ],
  },
  "VIP arrival — platinum guest suite": {
    headline: "VIP_GUEST · Platinum tier · Pre-arrival activation",
    trigger: "VIP profile loaded: Mr. Harrison, Platinum, Corporate: Meridian Group, Suite 901",
    messages: [
      { recipient: "Concierge (James M.)", role: "Staff App", color: "#10b981", channel: "Proposed VIP Brief", content: "Proposed VIP-arrival brief for James M. to review, including synthetic preference examples. No task is created.", time: "13:00", status: "proposed" },
      { recipient: "F&B", role: "Staff App", color: "#10b981", channel: "Proposed Setup Draft", content: "Draft suite-setup options for named F&B approval; no preferences are loaded and no preparation occurs.", time: "13:01", status: "proposed" },
      { recipient: "Duty Manager", role: "Manager Console", color: "#f97316", channel: "Proposed VIP Draft", content: "Modelled VIP context for Duty Manager approval; no notification is sent.", time: "13:02", status: "approval-required" },
      { recipient: "Mr. Harrison", role: "Guest View", color: "#3b82f6", channel: "Proposed Welcome Draft", content: "Draft welcome: a named concierge could be introduced after human approval. No guest message is sent.", time: "15:05", status: "draft" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#a8dedb", channel: "Modelled Local Trace", content: "Modelled trace #1104 | VIP_ARRIVAL | proposed concierge review | no record created.", time: "13:02", status: "modelled" },
      { recipient: "Corporate Account", role: "Account Dashboard", color: "#a78bfa", channel: "Proposed Account Draft", content: "Draft account update for named account-manager approval; no external account update occurs.", time: "15:06", status: "approval-required" },
    ],
  },
  "Weather disruption — outdoor activities cancelled": {
    headline: "WEATHER_DISRUPTION · Multi-guest impact · L2",
    trigger: "Severe weather alert: 78 outdoor activities affected, 14:00–18:00",
    messages: [
      { recipient: "All Affected Guests", role: "Guest Channel Broadcast", color: "#3b82f6", channel: "Proposed Guest Draft", content: "Draft weather update: a named operator could offer alternative, rescheduling or refund options after approval. No message is sent.", time: "13:45", status: "draft" },
      { recipient: "Activities Team", role: "Staff App", color: "#10b981", channel: "Proposed Operations Draft", content: "Proposed weather-response options for human review, including indoor capacity and family-priority considerations.", time: "13:44", status: "proposed" },
      { recipient: "F&B Manager", role: "Staff App", color: "#10b981", channel: "Proposed Capacity Draft", content: "Modelled capacity considerations for named F&B Manager review; no venue or staffing change occurs.", time: "13:44", status: "proposed" },
      { recipient: "Duty Manager", role: "Manager Console", color: "#f97316", channel: "Proposed Operations Draft", content: "Modelled weather context: synthetic booking count, alternative options and indicative value only. No communications or refunds are queued.", time: "13:46", status: "approval-required" },
      { recipient: "Command", role: "Assurance Dashboard", color: "#a8dedb", channel: "Modelled Local Trace", content: "Modelled trace #7840 | WEATHER_DISRUPTION | proposed review | no acceptance, refund or value outcome measured.", time: "13:46", status: "modelled" },
      { recipient: "Affected Guests (proposed follow-up)", role: "Guest View", color: "#3b82f6", channel: "Proposed Follow-up Draft", content: "Draft follow-up for human approval: a named operator could discuss future options. No voucher is added.", time: "18:10", status: "draft" },
    ],
  },
};

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  draft:               { color: "rgba(255,255,255,0.3)", label: "Draft Shown" },
  proposed:            { color: "#3b82f6",              label: "Simulated" },
  modelled:            { color: "#10b981",              label: "Illustrated" },
  "approval-required": { color: "#f97316",              label: "Human Approval Required" },
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
            JALDO Travel · Comms
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>
            Central Comms OS — Routing Simulation
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, maxWidth: 580 }}>
            Select a synthetic scenario to see proposed routing, drafted content and illustrative workflow states.
          </p>
        </div>

        <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #a8dedb", marginBottom: 32 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "#a8dedb" }}>Working Proof · Simulation boundary:</strong> all inputs are synthetic and classification is deterministic and rules-based. Every communication is an unsent draft and is never delivered. People, records, tasks, welfare checks, keys, offers, evidence, outcomes and value are fictional, illustrative or modelled. No guest or staff message, task, welfare or emergency action, partner activation, refund, compensation or external-system update occurs. Named people remain accountable for approval and real-world action.
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
                border: `1px solid ${s === scenario ? "rgba(168,222,219,0.5)" : "rgba(255,255,255,0.08)"}`,
                background: s === scenario ? "rgba(168,222,219,0.1)" : "transparent",
                color: s === scenario ? "#a8dedb" : "rgba(255,255,255,0.35)",
              }}
            >{s}</div>
          ))}
        </div>

        {/* Trigger banner */}
        <div style={{ padding: "12px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 24, display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a8dedb", marginTop: 2, whiteSpace: "nowrap" }}>Trigger</div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, minWidth: 0, flex: "1 1 200px" }}>Synthetic input — {data.trigger}</div>
          <div style={{ marginLeft: "auto", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)", padding: "3px 10px", maxWidth: "100%" }}>
            Rules classification · {data.headline.split("·")[0].trim()}
          </div>
        </div>

        {/* Message routing */}
        <div className="rtbx-table-scroll">
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 620 }}>
          <div style={{ display: "grid", gridTemplateColumns: "32px 140px 100px 1fr 100px 90px", gap: 0, padding: "8px 16px", background: "rgba(255,255,255,0.02)" }}>
            {["#", "Proposed recipient", "Draft channel", "Unsent draft", "Illustrative time", "Simulation state"].map(h => (
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
                   <div style={{ padding: "0 8px", fontSize: 9.5, color: "rgba(255,255,255,0.38)", fontWeight: 600, paddingTop: 2 }}>{msg.channel === "Live Record" ? "Simulated Record" : msg.channel}</div>
                  <div style={{ padding: "0 8px", fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.45, paddingTop: 1 }}>
                     {`Illustrative: ${msg.content}`.length > 90 ? `Illustrative: ${msg.content}`.slice(0, 90) + "…" : `Illustrative: ${msg.content}`}
                  </div>
                  <div style={{ padding: "0 8px", fontSize: 10.5, color: "rgba(255,255,255,0.35)", fontWeight: 600, paddingTop: 2 }}>{msg.time}</div>
                  <div style={{ padding: "0 8px", paddingTop: 2 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: st.color, border: `1px solid ${st.color}30`, padding: "2px 7px", display: "inline-block" }}>
                      {st.label}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      {msg.recipient.includes("Guest") || msg.recipient.startsWith("Mr.") || msg.recipient.startsWith("Ms.") || msg.recipient.startsWith("All Affected") || msg.recipient.startsWith("Affected")
                        ? <div style={{ fontSize: 8, fontWeight: 700, color: "#f97316", letterSpacing: "0.08em", textTransform: "uppercase" }}>Human approval required</div>
                        : msg.recipient.includes("Duty Manager") || msg.recipient.includes("Shift Supervisor") || msg.recipient.includes("Corporate Account")
                        ? <div style={{ fontSize: 8, fontWeight: 700, color: "#3b82f6", letterSpacing: "0.08em", textTransform: "uppercase" }}>Manager approval</div>
                         : <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Simulated routing</div>
                      }
                    </div>
                  </div>
                </div>
                {isActive && (
                  <div style={{ padding: "18px 24px", background: `${msg.color}07`, border: `1px solid ${msg.color}20`, borderTop: "none", marginBottom: 0 }}>
                    <div style={{ fontSize: 8, letterSpacing: "0.14em", color: msg.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Full Unsent Draft</div>
                     <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontStyle: msg.recipient === "Guest" || msg.recipient.startsWith("Mr.") || msg.recipient.startsWith("Ms.") || msg.recipient.includes("Guest") ? "italic" : "normal" }}>
                       Illustrative content only — {msg.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </div>

      </div>
    </PartnerRoomLayout>
  );
}
