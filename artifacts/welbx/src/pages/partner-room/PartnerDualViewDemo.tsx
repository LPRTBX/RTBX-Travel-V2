import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const P = {
  bg: "#080c14", navy: "#0d1220", navy2: "#111827", border: "rgba(255,255,255,0.08)",
  amber: "#c9a84c", white: "#f8f9fb", muted: "rgba(255,255,255,0.5)",
  dimmed: "rgba(255,255,255,0.22)", green: "#10b981", red: "#ef4444",
  orange: "#f59e0b", blue: "#3b82f6",
};

const STEP_LABELS = [
  "Signal appears",
  "Moment detected",
  "Guest sees support option",
  "Operator receives recommended action",
  "Action is assigned",
  "Outcome is recorded",
  "Value is created or protected",
];

interface StepContent {
  guestMsg: string | null;
  guestSub?: string;
  guestActions?: string[];
  guestSelected?: string;
  operatorTitle: string;
  operatorSignals: string[];
  operatorAction: string;
  operatorOwner?: string;
  systemType: string;
  systemTime?: string;
  systemValue: string;
}

interface DualScenario {
  id: string;
  label: string;
  steps: StepContent[];
}

const SCENARIOS: DualScenario[] = [
  {
    id: "late-checkin",
    label: "Late Check-in Friction",
    steps: [
      { guestMsg: null, operatorTitle: "Signal cluster forming", operatorSignals: ["PMS: no room assigned", "Guest at reception: 2 min", "Queue length: 3 guests"], operatorAction: "BXOS monitoring — moment classification in progress.", systemType: "Pre-moment", systemValue: "Detection window open" },
      { guestMsg: null, operatorTitle: "Moment: Late Check-in Friction", operatorSignals: ["Confidence: 77%", "Pattern match: check-in delay cluster", "Urgency: HIGH"], operatorAction: "Moment created. Recommended action queued. Duty manager alerted.", systemType: "Check-in Friction", systemTime: "0.4s", systemValue: "Escalation risk identified" },
      { guestMsg: "Your room is nearly ready.", guestSub: "Would you like us to notify you, hold your bags or arrange a quiet space while you wait?", guestActions: ["Notify me when ready", "Hold my bags", "Arrange a quiet space", "Speak to the team"], operatorTitle: "Guest interface activated", operatorSignals: ["Guest presented with 4 options", "Response window: open", "Loyalty tier: Silver"], operatorAction: "Await guest response. Prepare room priority flag.", systemType: "Check-in Friction", systemTime: "1.1s", systemValue: "Frustration pre-empted" },
      { guestMsg: "Your room is nearly ready.", guestSub: "Would you like us to notify you, hold your bags or arrange a quiet space while you wait?", guestActions: ["Notify me when ready", "Hold my bags", "Arrange a quiet space", "Speak to the team"], operatorTitle: "Action recommended to front desk", operatorSignals: ["Guest selected: Notify me", "Room priority: elevated", "Housekeeping alert: sent"], operatorAction: "Expedite room 412. Assign desk agent for guest notification call.", operatorOwner: "Front Desk Coordinator", systemType: "Check-in Friction", systemTime: "2.8s", systemValue: "Recovery path active" },
      { guestMsg: "Your room is nearly ready.", guestSub: "We'll notify you the moment your room is ready.", guestSelected: "Notify me when ready", operatorTitle: "Assigned: Front Desk Coordinator", operatorSignals: ["Room 412 priority: active", "Housekeeping ETA: 9 min", "Guest notification: queued"], operatorAction: "Room 412 expedited. Guest to be notified when cleared.", operatorOwner: "Front Desk Coordinator", systemType: "Check-in Friction", systemTime: "5.2s", systemValue: "Escalation avoided" },
      { guestMsg: "Your room is ready. Welcome, Ms Chen.", guestSub: "Room 412 is prepared and ready for you. Please head to the desk.", guestSelected: "Notify me when ready", operatorTitle: "Outcome: Room cleared in 8 minutes", operatorSignals: ["Room cleared: 8 min", "Guest notified: ✓", "Guest arrived: satisfied"], operatorAction: "Moment resolved. Outcome recorded. No escalation.", systemType: "Check-in Friction", systemTime: "8 min total", systemValue: "No complaint lodged" },
      { guestMsg: "Your room is ready. Welcome, Ms Chen.", guestSub: "Room 412 is prepared and ready for you. Please head to the desk.", guestSelected: "Notify me when ready", operatorTitle: "Value recorded", operatorSignals: ["Guest satisfied: ✓", "No escalation: ✓", "Loyalty points retained: ✓"], operatorAction: "Pattern recorded for future check-in friction prevention.", systemType: "Check-in Friction", systemTime: "8 min", systemValue: "Complaint avoided · Loyalty retained · Learning captured" },
    ],
  },
  {
    id: "room-issue",
    label: "Room Issue Recovery",
    steps: [
      { guestMsg: null, operatorTitle: "Signal: room issue submitted", operatorSignals: ["Guest tablet: issue logged", "Category: maintenance", "Time: 21:14"], operatorAction: "BXOS monitoring — checking against guest profile and stay data.", systemType: "Pre-moment", systemValue: "Issue logged" },
      { guestMsg: null, operatorTitle: "Moment: Room Issue Recovery", operatorSignals: ["Confidence: 88%", "Guest: Gold loyalty", "Stay night: 2 of 3", "Maintenance: unassigned"], operatorAction: "Moment classified. Duty manager alert sent. Response timer started.", systemType: "Room Issue Recovery", systemTime: "0.6s", systemValue: "Recovery window open" },
      { guestMsg: "We noticed your room issue has been logged.", guestSub: "Would you prefer a quick fix, a room move request or a manager follow-up?", guestActions: ["Quick fix", "Room move request", "Manager follow-up", "Not urgent"], operatorTitle: "Guest recovery options presented", operatorSignals: ["4 options shown", "Guest engaged: confirmed", "Duty manager: alerted"], operatorAction: "Await guest preference. Prepare room move option.", systemType: "Room Issue Recovery", systemTime: "1.3s", systemValue: "Guest agency given" },
      { guestMsg: "We noticed your room issue has been logged.", guestSub: "We'll arrange a room move and send a team member to assist.", guestSelected: "Room move request", operatorTitle: "Guest selected: room move request", operatorSignals: ["Preference: room move", "Available rooms: 3", "Upgrade eligible: ✓"], operatorAction: "Identify suitable room. Assign duty manager to contact guest.", operatorOwner: "Duty Manager", systemType: "Room Issue Recovery", systemTime: "3.1s", systemValue: "Recovery path: room move" },
      { guestMsg: "We noticed your room issue has been logged.", guestSub: "A team member will be with you shortly to assist with your room move.", guestSelected: "Room move request", operatorTitle: "Duty Manager assigned", operatorSignals: ["Room 618: available", "Upgrade applied: complimentary", "Guest contact: in 4 min"], operatorAction: "Contact guest in person. Offer room 618 with complimentary upgrade.", operatorOwner: "Duty Manager", systemType: "Room Issue Recovery", systemTime: "6 min", systemValue: "Service recovery active" },
      { guestMsg: "Room move arranged. Welcome to Room 618.", guestSub: "We hope this makes the rest of your stay more comfortable.", guestSelected: "Room move request", operatorTitle: "Outcome: guest satisfied, room move complete", operatorSignals: ["Room move: ✓", "Guest satisfied: ✓", "No escalation: ✓", "Upgrade applied: ✓"], operatorAction: "Moment resolved. Recovery offer accepted. Pattern logged.", systemType: "Room Issue Recovery", systemTime: "18 min total", systemValue: "Loyalty protected" },
      { guestMsg: "Room move arranged. Welcome to Room 618.", guestSub: "We hope this makes the rest of your stay more comfortable.", guestSelected: "Room move request", operatorTitle: "Value captured", operatorSignals: ["Loyalty protected: ✓", "Review risk reduced: ✓", "Recovery logged: ✓"], operatorAction: "Pattern contributes to future issue detection improvement.", systemType: "Room Issue Recovery", systemTime: "18 min", systemValue: "Review risk reduced · Loyalty retained · Revenue protected" },
    ],
  },
  {
    id: "vip-arrival",
    label: "VIP Arrival Risk",
    steps: [
      { guestMsg: null, operatorTitle: "Signal cluster: VIP arrival risk", operatorSignals: ["Diamond guest ETA: 12 min", "Room 847: occupied", "Housekeeping ETA: 22 min"], operatorAction: "BXOS clustering signals — pattern confidence rising.", systemType: "Pre-moment", systemValue: "10-min gap identified" },
      { guestMsg: null, operatorTitle: "Moment: VIP Arrival Risk — CRITICAL", operatorSignals: ["Confidence: 91%", "Urgency: CRITICAL", "Pattern: VIP collision"], operatorAction: "CRITICAL moment created. Front Office Manager and Duty Manager alerted instantly.", systemType: "VIP Arrival Risk", systemTime: "0.4s", systemValue: "Brand-level risk flagged" },
      { guestMsg: "Welcome, Mr Hartmann.", guestSub: "Your suite is being prepared. While you wait, would you like us to arrange anything?", guestActions: ["Champagne on arrival", "Newspaper & quiet", "Access to bar early", "Nothing needed"], operatorTitle: "VIP pre-arrival interface activated", operatorSignals: ["Guest greeted via app/kiosk", "Preference options: 4", "Profile: champagne flag active"], operatorAction: "Housekeeping expedited. Escort to lobby arranged. Amenity prep started.", systemType: "VIP Arrival Risk", systemTime: "1.2s", systemValue: "Expectation managed" },
      { guestMsg: "Welcome, Mr Hartmann.", guestSub: "Your suite is being prepared. Your champagne will be ready on arrival.", guestSelected: "Champagne on arrival", operatorTitle: "Guest preference confirmed: champagne", operatorSignals: ["Amenity: champagne requested", "Room 847: housekeeping expedited", "Escort: arranged"], operatorAction: "Confirm champagne with F&B. Assign escort from lobby in 8 minutes.", operatorOwner: "Front Office Manager", systemType: "VIP Arrival Risk", systemTime: "2.1s", systemValue: "Recovery in progress" },
      { guestMsg: "Welcome, Mr Hartmann.", guestSub: "Your suite is ready. An escort will meet you at the main entrance.", guestSelected: "Champagne on arrival", operatorTitle: "Front Office Manager assigned", operatorSignals: ["Room cleared: 4 min before arrival", "Escort: lobby, confirmed", "Champagne: prepared"], operatorAction: "Personal escort ready. Champagne staged. Suite confirmed clear.", operatorOwner: "Front Office Manager", systemType: "VIP Arrival Risk", systemTime: "9 min", systemValue: "VIP experience protected" },
      { guestMsg: "Thank you for staying with us, Mr Hartmann.", guestSub: "We hope your arrival was seamless. Your suite is ready.", guestSelected: "Champagne on arrival", operatorTitle: "Outcome: flawless VIP arrival", operatorSignals: ["Guest arrived: ✓", "Suite cleared 4 min early: ✓", "Amenity delivered: ✓", "No complaint: ✓"], operatorAction: "Moment resolved. Outcome: exemplary service recovery.", systemType: "VIP Arrival Risk", systemTime: "12 min", systemValue: "Brand standard met" },
      { guestMsg: "Thank you for staying with us, Mr Hartmann.", guestSub: "We hope your arrival was seamless. Your suite is ready.", guestSelected: "Champagne on arrival", operatorTitle: "Value recorded", operatorSignals: ["VIP experience: protected", "Loyalty tier: retained", "Pattern: logged for future"], operatorAction: "Detection-to-resolution in 12 minutes. VIP standard maintained.", systemType: "VIP Arrival Risk", systemTime: "12 min", systemValue: "Complaint avoided · Loyalty retained · Staff confidence built" },
    ],
  },
  {
    id: "dining",
    label: "Dining Activation",
    steps: [
      { guestMsg: null, operatorTitle: "Signal: guest activation window", operatorSignals: ["Calendar gap: 2 hrs before 20:00", "In-room: confirmed", "Wellness preference: active"], operatorAction: "BXOS detecting partner activation opportunity.", systemType: "Pre-moment", systemValue: "Activation window detected" },
      { guestMsg: null, operatorTitle: "Moment: Dining Activation Window", operatorSignals: ["Confidence: 81%", "Partner opportunity: wellness + dining", "Guest tier: Gold"], operatorAction: "Concierge and partner activation channel alerted.", systemType: "Dining Activation", systemTime: "0.8s", systemValue: "Commercial opportunity open" },
      { guestMsg: "You have a free window before dinner.", guestSub: "Would you like nearby dining, wellness, transport or local experience options?", guestActions: ["Dining suggestions", "Wellness & spa", "Transport & transfers", "Local experiences"], operatorTitle: "Guest activation interface served", operatorSignals: ["Options: 4", "Guest engaged: confirmed", "Spa availability: checked"], operatorAction: "Spa and dining options pre-loaded. Partner offer flagged.", systemType: "Dining Activation", systemTime: "1.4s", systemValue: "Upsell window active" },
      { guestMsg: "You have a free window before dinner.", guestSub: "Your spa session has been arranged at 17:30. Enjoy.", guestSelected: "Wellness & spa", operatorTitle: "Guest selected: wellness & spa", operatorSignals: ["Preference: spa", "Slot: 17:30 available", "Partner: in-house spa"], operatorAction: "Spa booking confirmed. Concierge to notify guest.", operatorOwner: "Concierge / Spa Desk", systemType: "Dining Activation", systemTime: "2.6s", systemValue: "Partner revenue created" },
      { guestMsg: "Your spa session is confirmed for 17:30.", guestSub: "Head to the wellness floor 5 minutes before. No check-in needed.", guestSelected: "Wellness & spa", operatorTitle: "Concierge confirmed booking", operatorSignals: ["Spa: 17:30 confirmed", "Room notification: sent", "Partner booking: logged"], operatorAction: "Booking complete. Revenue from ancillary captured.", operatorOwner: "Spa Desk", systemType: "Dining Activation", systemTime: "5 min", systemValue: "Ancillary revenue created" },
      { guestMsg: "Your spa session is confirmed for 17:30.", guestSub: "We hope you enjoy it. Let us know if you need anything else.", guestSelected: "Wellness & spa", operatorTitle: "Outcome: spa booking completed", operatorSignals: ["Booking: ✓", "Guest satisfaction: high", "Revenue: ancillary captured"], operatorAction: "Moment resolved. Revenue logged. Pattern contributes to future activation triggers.", systemType: "Dining Activation", systemTime: "5 min total", systemValue: "Revenue created" },
      { guestMsg: "Your spa session is confirmed for 17:30.", guestSub: "We hope you enjoy it. Let us know if you need anything else.", guestSelected: "Wellness & spa", operatorTitle: "Value captured", operatorSignals: ["Ancillary revenue: recorded", "Partner value: created", "Guest experience: enhanced"], operatorAction: "Wellness partner and concierge credited with activation.", systemType: "Dining Activation", systemTime: "5 min", systemValue: "Revenue created · Partner value activated · Guest loyalty enhanced" },
    ],
  },
  {
    id: "support",
    label: "Guest Overwhelm / Support",
    steps: [
      { guestMsg: null, operatorTitle: "Signal: guest support need", operatorSignals: ["Help button: 23:40", "Solo traveller: flagged", "Quiet preference: on profile"], operatorAction: "BXOS pattern matching — wellbeing signal cluster forming.", systemType: "Pre-moment", systemValue: "Wellbeing signal detected" },
      { guestMsg: null, operatorTitle: "Moment: Guest Wellbeing Need", operatorSignals: ["Confidence: 83%", "Low-profile flag: active", "Previous support note: ✓"], operatorAction: "Discreet support moment created. Duty manager quietly alerted.", systemType: "Guest Wellbeing Need", systemTime: "0.7s", systemValue: "Discreet support triggered" },
      { guestMsg: "Need a quieter option or extra support during your stay?", guestSub: "We can help discreetly. No need to explain.", guestActions: ["Arrange a quiet space", "Speak to a staff member", "Come back to this later", "I'm fine, thank you"], operatorTitle: "Discreet support interface served", operatorSignals: ["Options: 4", "Interface: low-profile", "No public escalation"], operatorAction: "Duty manager on standby. No visible alert to other staff.", systemType: "Guest Wellbeing Need", systemTime: "1.1s", systemValue: "Privacy protected" },
      { guestMsg: "Need a quieter option or extra support during your stay?", guestSub: "A quiet space has been arranged. You'll receive a message with details.", guestSelected: "Arrange a quiet space", operatorTitle: "Guest selected: quiet space", operatorSignals: ["Preference: quiet space", "Availability: reading room", "Duty manager: alerted"], operatorAction: "Reading room reserved. Duty manager to quietly notify guest.", operatorOwner: "Duty Manager", systemType: "Guest Wellbeing Need", systemTime: "2.2s", systemValue: "Wellbeing protected" },
      { guestMsg: "A quiet space has been arranged for you.", guestSub: "The reading lounge on level 2 is reserved. No check-in needed.", guestSelected: "Arrange a quiet space", operatorTitle: "Duty Manager assigned — discreet", operatorSignals: ["Reading room: reserved", "Guest notification: sent", "No public escalation: ✓"], operatorAction: "Quiet room arranged. Duty manager following up privately.", operatorOwner: "Duty Manager", systemType: "Guest Wellbeing Need", systemTime: "4 min", systemValue: "Privacy and comfort maintained" },
      { guestMsg: "A quiet space has been arranged for you.", guestSub: "We're here if you need anything else. No pressure at all.", guestSelected: "Arrange a quiet space", operatorTitle: "Outcome: guest supported discreetly", operatorSignals: ["Guest: settled", "No escalation: ✓", "No complaint: ✓"], operatorAction: "Moment resolved. Guest wellbeing note logged privately.", systemType: "Guest Wellbeing Need", systemTime: "6 min total", systemValue: "Wellbeing protected" },
      { guestMsg: "A quiet space has been arranged for you.", guestSub: "We're here if you need anything else. No pressure at all.", guestSelected: "Arrange a quiet space", operatorTitle: "Value recorded", operatorSignals: ["Wellbeing: protected", "Privacy: maintained", "Loyalty: retained"], operatorAction: "Discreet support pattern improves future detection sensitivity.", systemType: "Guest Wellbeing Need", systemTime: "6 min", systemValue: "Guest trust built · Loyalty retained · No complaint lodged" },
    ],
  },
  {
    id: "housekeeping",
    label: "Housekeeping Delay",
    steps: [
      { guestMsg: null, operatorTitle: "Signal: housekeeping bottleneck forming", operatorSignals: ["Rooms overdue: 6", "Team capacity: 92%", "VIP arrivals in 40 min: 3"], operatorAction: "BXOS detecting capacity vs demand mismatch.", systemType: "Pre-moment", systemValue: "Bottleneck risk identified" },
      { guestMsg: null, operatorTitle: "Moment: Housekeeping Bottleneck — HIGH", operatorSignals: ["Confidence: 79%", "Cascading risk: VIP arrivals", "Urgency: HIGH"], operatorAction: "Housekeeping manager and duty manager alerted. Priority list generated.", systemType: "Housekeeping Bottleneck", systemTime: "0.6s", systemValue: "Cascade risk flagged" },
      { guestMsg: "Your room service is running slightly behind schedule.", guestSub: "We wanted to let you know and offer a few options.", guestActions: ["Proceed as planned", "Reschedule room service", "Contact us", "No action needed"], operatorTitle: "Affected guests notified proactively", operatorSignals: ["4 affected guests: notified", "Options: 3", "Expectation managed"], operatorAction: "Identify priority rooms. Redistribute team workload.", systemType: "Housekeeping Bottleneck", systemTime: "1.5s", systemValue: "Expectation managed" },
      { guestMsg: "Your room service is running slightly behind schedule.", guestSub: "We'll have it ready within 20 minutes and notify you.", guestSelected: "Proceed as planned", operatorTitle: "Guests responded — workload known", operatorSignals: ["2 guests: proceed", "1 guest: reschedule", "1 guest: no action"], operatorAction: "Prioritise rooms 2 and 4. Reschedule room 3 to 15:30.", operatorOwner: "Housekeeping Manager", systemType: "Housekeeping Bottleneck", systemTime: "3.8s", systemValue: "Workload redistributed" },
      { guestMsg: "Your room service is running slightly behind schedule.", guestSub: "We'll have it ready within 20 minutes and notify you.", guestSelected: "Proceed as planned", operatorTitle: "Housekeeping Manager assigned priority list", operatorSignals: ["Priority rooms: reassigned", "VIP rooms: fast-tracked", "Team: redistributed"], operatorAction: "VIP rooms cleared first. Standard rooms sequenced behind.", operatorOwner: "Housekeeping Manager", systemType: "Housekeeping Bottleneck", systemTime: "8 min", systemValue: "VIP standard protected" },
      { guestMsg: "Your room is now ready. Thank you for your patience.", guestSub: "We appreciate your understanding.", guestSelected: "Proceed as planned", operatorTitle: "Outcome: all rooms cleared on revised schedule", operatorSignals: ["VIP rooms: cleared ✓", "Standard rooms: cleared ✓", "No complaints: ✓"], operatorAction: "Bottleneck resolved. No escalations. Pattern logged.", systemType: "Housekeeping Bottleneck", systemTime: "28 min total", systemValue: "Service standard maintained" },
      { guestMsg: "Your room is now ready. Thank you for your patience.", guestSub: "We appreciate your understanding.", guestSelected: "Proceed as planned", operatorTitle: "Value captured", operatorSignals: ["Escalation avoided: ✓", "VIP experience: protected ✓", "Learning: logged"], operatorAction: "Capacity-demand mismatch pattern used to improve future shift planning.", systemType: "Housekeeping Bottleneck", systemTime: "28 min", systemValue: "Escalation avoided · VIP standard met · Future planning improved" },
    ],
  },
];

function MiniPhone({ step, scenario }: { step: StepContent; scenario: string }) {
  const hasGuest = step.guestMsg !== null;
  return (
    <div style={{ width: 230, flexShrink: 0 }}>
      <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 10, textAlign: "center" }}>GUEST SIDE</div>
      <div style={{
        background: "#1a1b2e", borderRadius: 32, padding: "8px",
        boxShadow: hasGuest ? `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.15)` : "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
      }}>
        <div style={{ background: hasGuest ? "#faf9f6" : "#0a0c16", borderRadius: 26, overflow: "hidden", height: 420 }}>
          {/* Status bar */}
          <div style={{ background: "#0d0d1a", padding: "8px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>23:46</span>
            <span style={{ fontSize: 6.5, color: "rgba(255,255,255,0.5)" }}>●●● WiFi ▌▌</span>
          </div>
          <div style={{ background: "#0d0d1a", padding: "6px 16px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 7, letterSpacing: "0.22em", color: "rgba(201,168,76,0.85)", textTransform: "uppercase", fontWeight: 700 }}>GRAND MERIDIAN</div>
          </div>

          {!hasGuest ? (
            <div style={{ padding: "30px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>Awaiting moment classification…</div>
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 4 }}>
                {[1,2,3].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: `rgba(201,168,76,${0.1 + i * 0.15})` }} />)}
              </div>
            </div>
          ) : (
            <div style={{ padding: "16px 14px", flex: 1 }}>
              {step.guestSelected ? (
                <div>
                  <div style={{ padding: "10px 12px", background: "#eef7f2", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, marginBottom: 10 }}>
                    <div style={{ fontSize: 7.5, color: "#10b981", fontWeight: 700, marginBottom: 3 }}>✓ Confirmed</div>
                    <div style={{ fontSize: 9.5, color: "#2d4a3e", lineHeight: 1.5 }}>{step.guestSub}</div>
                  </div>
                  <div style={{ padding: "6px 10px", background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 6, fontSize: 8.5, color: "#6b6b8a" }}>Selected: {step.guestSelected}</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1a1a2e", marginBottom: 5, lineHeight: 1.3 }}>{step.guestMsg}</div>
                  <div style={{ fontSize: 9.5, color: "#4a4a6a", marginBottom: 12, lineHeight: 1.5 }}>{step.guestSub}</div>
                  {step.guestActions?.slice(0, 3).map(a => (
                    <div key={a} style={{ padding: "8px 10px", background: "#f0eeea", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 7, fontSize: 9.5, color: "#1a1a2e", marginBottom: 5, fontWeight: 500 }}>{a}</div>
                  ))}
                  {(step.guestActions?.length ?? 0) > 3 && (
                    <div style={{ fontSize: 8, color: "#9999b8", textAlign: "center" }}>+{(step.guestActions?.length ?? 0) - 3} more</div>
                  )}
                </div>
              )}
              <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, textAlign: "center", fontSize: 7.5, color: "#b0b0cc", fontStyle: "italic" }}>No app. No login. In the moment.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SignalFlow({ step, currentStep }: { step: number; currentStep: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, paddingTop: 40 }}>
      <div style={{ fontSize: 7, letterSpacing: "0.16em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, writingMode: "vertical-rl", transform: "rotate(180deg)", marginBottom: 8 }}>SIGNAL FLOW</div>
      {[0,1,2,3,4,5,6].map(i => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: i <= currentStep ? P.amber : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
          {i < 6 && <div style={{ width: 1, height: 16, background: i < currentStep ? `${P.amber}60` : "rgba(255,255,255,0.06)" }} />}
        </div>
      ))}
    </div>
  );
}

function OperatorPanel({ step }: { step: StepContent }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>OPERATOR SIDE</div>
      <div style={{ background: P.navy, border: `1px solid ${P.border}`, padding: "18px 22px", marginBottom: 12 }}>
        <div style={{ fontSize: 7.5, letterSpacing: "0.12em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Active Moment</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: P.white, marginBottom: 8 }}>{step.operatorTitle}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {step.operatorSignals.map(s => (
            <span key={s} style={{ fontSize: 9, color: P.blue, padding: "3px 8px", background: `${P.blue}10`, border: `1px solid ${P.blue}20` }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ background: P.navy, border: `1px solid ${P.amber}25`, padding: "16px 22px", marginBottom: 12 }}>
        <div style={{ fontSize: 7.5, letterSpacing: "0.12em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Recommended Action</div>
        <div style={{ fontSize: 11, color: P.muted, lineHeight: 1.7 }}>{step.operatorAction}</div>
        {step.operatorOwner && <div style={{ marginTop: 8, fontSize: 9.5, color: P.green }}>→ {step.operatorOwner}</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {["Assign", "Defer", "Escalate"].map((btn, i) => (
          <div key={btn} style={{
            padding: "9px", background: i === 0 ? `${P.amber}10` : "transparent",
            border: `1px solid ${i === 0 ? `${P.amber}40` : P.border}`,
            fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            color: i === 0 ? P.amber : P.muted, textAlign: "center", cursor: "pointer",
          }}>{btn}</div>
        ))}
      </div>
    </div>
  );
}

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

export default function PartnerDualViewDemo() {
  const [scenarioId, setScenarioId] = useState("late-checkin");
  const [stepIdx, setStepIdx] = useState(0);

  const scenario = SCENARIOS.find(s => s.id === scenarioId) ?? SCENARIOS[0];
  const step = scenario.steps[stepIdx];

  function changeScenario(id: string) {
    setScenarioId(id);
    setStepIdx(0);
  }

  return (
    <PartnerRoomLayout>
      {/* Header */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 60px 32px" }}>
        <div style={{ fontSize: 8, letterSpacing: "0.22em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>DUAL VIEW DEMO</div>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: P.white, letterSpacing: "-0.02em", marginBottom: 10 }}>Both Sides of the Moment</h1>
        <p style={{ fontSize: 13, color: P.muted, maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
          The same moment shown from two perspectives. Step through the signal-to-value chain on both the guest and operator side.
        </p>
      </div>

      {/* Scenario selector */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 24px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => changeScenario(s.id)}
              style={{
                padding: "8px 16px",
                background: s.id === scenarioId ? `${P.amber}12` : "transparent",
                border: `1px solid ${s.id === scenarioId ? `${P.amber}50` : P.border}`,
                color: s.id === scenarioId ? P.amber : P.muted,
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em",
                cursor: "pointer", fontFamily: "system-ui, sans-serif", transition: "all 0.15s",
              }}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* Step progress */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 20px" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {STEP_LABELS.map((label, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => setStepIdx(i)}>
              <div style={{
                width: "100%", height: 3, background: i <= stepIdx ? P.amber : "rgba(255,255,255,0.08)",
                transition: "background 0.3s",
              }} />
              <div style={{ fontSize: 7.5, color: i === stepIdx ? P.amber : P.dimmed, fontWeight: i === stepIdx ? 700 : 400, letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.3 }}>
                {i + 1}. {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual view */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 24px", display: "flex", gap: 24, alignItems: "flex-start" }}>
        <MiniPhone step={step} scenario={scenarioId} />
        <SignalFlow step={stepIdx} currentStep={stepIdx} />
        <OperatorPanel step={step} />
      </div>

      {/* System record */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 24px" }}>
        <div style={{ background: P.navy, border: `1px solid ${P.border}`, padding: "16px 22px" }}>
          <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>System Records</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {[
              { label: "Moment Type", value: step.systemType },
              { label: "Response Time", value: step.systemTime ?? "—" },
              { label: "Owner", value: step.operatorOwner ?? "Unassigned" },
              { label: "Action", value: stepIdx >= 4 ? "Assigned" : stepIdx >= 2 ? "In progress" : "Classifying" },
              { label: "Value Created", value: step.systemValue },
            ].map(r => (
              <div key={r.label}>
                <div style={{ fontSize: 7, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 10.5, color: P.muted, lineHeight: 1.5 }}>{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
          disabled={stepIdx === 0}
          style={{
            padding: "10px 24px", background: "transparent", border: `1px solid ${P.border}`,
            color: stepIdx === 0 ? P.dimmed : P.muted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            cursor: stepIdx === 0 ? "not-allowed" : "pointer", fontFamily: "system-ui, sans-serif",
          }}
        >← Previous</button>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 9, color: P.amber, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Step {stepIdx + 1} of {STEP_LABELS.length}</div>
          <div style={{ fontSize: 11, color: P.muted, marginTop: 2 }}>{STEP_LABELS[stepIdx]}</div>
        </div>

        <button
          onClick={() => setStepIdx(Math.min(STEP_LABELS.length - 1, stepIdx + 1))}
          disabled={stepIdx === STEP_LABELS.length - 1}
          style={{
            padding: "10px 24px", background: stepIdx === STEP_LABELS.length - 1 ? "transparent" : `${P.amber}10`,
            border: `1px solid ${stepIdx === STEP_LABELS.length - 1 ? P.border : `${P.amber}40`}`,
            color: stepIdx === STEP_LABELS.length - 1 ? P.dimmed : P.amber,
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            cursor: stepIdx === STEP_LABELS.length - 1 ? "not-allowed" : "pointer", fontFamily: "system-ui, sans-serif",
          }}
        >Next →</button>
      </div>

      <DemoFooter />
    </PartnerRoomLayout>
  );
}
