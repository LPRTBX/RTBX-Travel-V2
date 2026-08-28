import { useState } from "react";
import { Link } from "wouter";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";

const P = {
  bg: "#080c14", navy: "#0d1220", border: "rgba(255,255,255,0.08)",
  amber: "#c9a84c", white: "#f8f9fb", muted: "rgba(255,255,255,0.5)",
  dimmed: "rgba(255,255,255,0.22)", green: "#10b981",
};

export interface GuestAction {
  id: string;
  label: string;
  confirmation: string;
  rtbxCoordinates: string;
  operatorReceives: string;
  valueCreated: string;
}

export interface Stage {
  id: number;
  stage: string;
  label: string;
  phoneMessage: string;
  phoneSub: string;
  phoneActions: GuestAction[];
  guestSees: string;
  rtbxAutomates: string;
  operatorReceives: string;
  valueCreated: string;
}

export const STAGES: Stage[] = [
  {
    id: 0,
    stage: "Arrival",
    label: "01 · Arrival",
    phoneMessage: "Welcome back, Sarah.",
    phoneSub: "Your room is being prepared. Let us know how we can help while you wait.",
    phoneActions: [
      {
        id: "arrival-check-in",
        label: "Check in digitally",
        confirmation: "Demo response: Digital check-in is confirmed for this example. The configured room-readiness and key-delivery pathway is shown; no live check-in or key is issued.",
        rtbxCoordinates: "The demonstrated pathway coordinates a digital check-in signal with room-readiness and key-delivery rules.",
        operatorReceives: "The demonstrated operator view receives check-in completion, example Room 408 status and the next ownership cue.",
        valueCreated: "Shows how arrival friction could be reduced without a desk queue while keeping the handoff accountable.",
      },
      {
        id: "arrival-bags",
        label: "Hold my bags",
        confirmation: "Demo response: A concierge bag-storage request is acknowledged for this example; no real task is created.",
        rtbxCoordinates: "The demonstrated pathway routes a baggage-storage request to the configured concierge workflow.",
        operatorReceives: "The demonstrated operator view receives concierge ownership and the example collection requirement.",
        valueCreated: "Shows how waiting-time friction could be reduced with clear ownership and a visible collection handoff.",
      },
      {
        id: "arrival-quiet-space",
        label: "Find a quiet space",
        confirmation: "Demo response: A suitable waiting-space option is presented for this example; no real space is reserved.",
        rtbxCoordinates: "The demonstrated pathway checks configured waiting-space availability and carries the guest preference forward.",
        operatorReceives: "The demonstrated operator view receives the guest preference and the support or availability cue.",
        valueCreated: "Shows how a more considerate arrival can be offered without making the guest repeat their preference.",
      },
      {
        id: "arrival-question",
        label: "Ask a question",
        confirmation: "Demo response: A guest-support and concierge handoff is previewed with the question context; no check-in or baggage action occurs.",
        rtbxCoordinates: "The demonstrated pathway packages the question for the configured support channel without selecting an unrelated arrival action.",
        operatorReceives: "The demonstrated operator view receives the guest question and the suggested support owner.",
        valueCreated: "Shows how a guest can reach the right support context without being routed through the desk.",
      },
    ],
    guestSees: "Warm digital check-in with practical options. No queue, no desk wait, no friction.",
    rtbxAutomates: "Demo pathway: example arrival signal classified from PMS + app access data. Room-readiness rules and the relevant loyalty protocol are shown.",
    operatorReceives: "Demo operator view: example guest context card with tier, flight origin, room status and a recommended greeting script.",
    valueCreated: "Demonstrates reduced arrival friction, protected first-impression sentiment and accountable loyalty recognition.",
  },
  {
    id: 1,
    stage: "Room Delay",
    label: "02 · Room Delay",
    phoneMessage: "Your room is nearly ready.",
    phoneSub: "There's a 25-minute delay. Here's what we can arrange in the meantime.",
    phoneActions: [
      {
        id: "delay-notify",
        label: "Notify me when ready",
        confirmation: "Demo response: You are subscribed to the room-ready notification pathway for this example; no live message is sent.",
        rtbxCoordinates: "The demonstrated pathway monitors the example room-readiness signal and prepares the configured notification.",
        operatorReceives: "The demonstrated operator view receives the notification preference and the example room-readiness status.",
        valueCreated: "Shows how uncertainty can be reduced without asking the guest to keep checking or take another action.",
      },
      {
        id: "delay-bags",
        label: "Hold my bags",
        confirmation: "Demo response: A baggage-storage request is routed for this example; no real concierge task is created and no room-ready action is implied.",
        rtbxCoordinates: "The demonstrated pathway routes baggage storage only to the configured concierge workflow.",
        operatorReceives: "The demonstrated operator view receives baggage ownership and the example collection requirement.",
        valueCreated: "Shows a clear holding option while keeping baggage handling separate from room readiness.",
      },
      {
        id: "delay-lounge",
        label: "Use the lounge",
        confirmation: "Demo response: A lounge-access request is acknowledged for this example; no access is activated.",
        rtbxCoordinates: "The demonstrated pathway checks the configured lounge-access rule and carries the request context forward.",
        operatorReceives: "The demonstrated operator view receives the lounge preference and the access-support cue.",
        valueCreated: "Shows how a delay can become a more comfortable waiting experience without mixing unrelated tasks.",
      },
      {
        id: "delay-team",
        label: "Speak to the team",
        confirmation: "Demo response: A human contact request is prepared with the room-delay context; no message or call is sent.",
        rtbxCoordinates: "The demonstrated pathway packages the delay context for the configured human-support route.",
        operatorReceives: "The demonstrated operator view receives the guest request, delay timing and suggested owner.",
        valueCreated: "Shows accountable human contact without requiring the guest to repeat the delay details.",
      },
    ],
    guestSees: "A proactive update with timing and options — before they need to ask or complain.",
    rtbxAutomates: "Demo pathway: example delay timer, housekeeping priority and lounge rules are shown as coordinated responses.",
    operatorReceives: "Demo operator view: example room status, delay timing, ownership cue and selected waiting option.",
    valueCreated: "Demonstrates how a recovery pathway can open before frustration while keeping ownership visible.",
  },
  {
    id: 2,
    stage: "Weather Change",
    label: "03 · Weather Change",
    phoneMessage: "The weather has changed this afternoon.",
    phoneSub: "Your outdoor activity may be affected. Here are some alternatives we've put together for you.",
    phoneActions: [
      {
        id: "weather-indoor",
        label: "Indoor experiences nearby",
        confirmation: "Demo response: Relevant indoor alternatives are prepared for this example; no guide or partner message is sent.",
        rtbxCoordinates: "The demonstrated pathway matches the weather context with example indoor options and the guest preference profile.",
        operatorReceives: "The demonstrated operator view receives the indoor-preference signal and the example alternatives cue.",
        valueCreated: "Shows how the experience can be protected before disappointment occurs while preserving guest choice.",
      },
      {
        id: "weather-reschedule",
        label: "Reschedule outdoor activity",
        confirmation: "Demo response: A rescheduling workflow is previewed with the activity context; no booking is changed.",
        rtbxCoordinates: "The demonstrated pathway packages a rescheduling request for the configured activity and partner workflow.",
        operatorReceives: "The demonstrated operator view receives the activity context, weather signal and rescheduling ownership cue.",
        valueCreated: "Shows how a disruption can become an accountable partner handoff instead of an unresolved guest problem.",
      },
      {
        id: "weather-local",
        label: "Local recommendations",
        confirmation: "Demo response: Contextual local recommendations are prepared for this example; no recommendation is delivered.",
        rtbxCoordinates: "The demonstrated pathway combines weather context, location and guest preferences to shape local options.",
        operatorReceives: "The demonstrated operator view receives the local-interest preference and the recommendation pathway cue.",
        valueCreated: "Shows how relevant local discovery can continue even when the original plan changes.",
      },
      {
        id: "weather-keep-booking",
        label: "Keep my booking",
        confirmation: "Demo response: Your booking remains unchanged in this example and monitoring continues; no rescheduling occurs.",
        rtbxCoordinates: "The demonstrated pathway preserves the booking state and keeps the weather-risk monitor active.",
        operatorReceives: "The demonstrated operator view receives the keep-booking choice and continued-monitoring status.",
        valueCreated: "Shows that guest agency is preserved when the best response is to wait and keep monitoring.",
      },
    ],
    guestSees: "Alternatives delivered before the guest steps outside and faces disappointment. Proactive, not reactive.",
    rtbxAutomates: "Demo pathway: weather disruption classified as experience risk. Example activity, partner and indoor-alternative rules are shown.",
    operatorReceives: "Demo operator view: weather flag, selected guest preference and the relevant activity or partner ownership cue.",
    valueCreated: "Demonstrates experience recovery before it is lost while keeping partner opportunity and guest agency visible.",
  },
  {
    id: 3,
    stage: "Dining",
    label: "04 · Dining Opportunity",
    phoneMessage: "You have a free window before dinner.",
    phoneSub: "Based on your stay so far, here are a few options we thought you'd enjoy.",
    phoneActions: [
      {
        id: "dining-suggestions",
        label: "Dining suggestions",
        confirmation: "Demo response: Dining suggestions are prepared for this example based on the available window; no list is sent.",
        rtbxCoordinates: "The demonstrated pathway matches the dining opportunity with example venues, timing and preference signals.",
        operatorReceives: "The demonstrated operator view receives the dining preference, available window and relevant concierge cue.",
        valueCreated: "Shows how a timely dining prompt can create relevance without becoming a generic promotion.",
      },
      {
        id: "dining-wellness",
        label: "Wellness & spa",
        confirmation: "Demo response: A wellness and spa pathway is prepared for this example; no appointment or partner request is created.",
        rtbxCoordinates: "The demonstrated pathway matches the wellness preference with example availability and configured partner rules.",
        operatorReceives: "The demonstrated operator view receives the wellness preference, timing and support ownership cue.",
        valueCreated: "Shows how the same moment can support a wellness outcome rather than forcing a dining response.",
      },
      {
        id: "dining-transport",
        label: "Transport & transfers",
        confirmation: "Demo response: A transport pathway is prepared with the timing context; no transfer is booked.",
        rtbxCoordinates: "The demonstrated pathway carries the transport preference, timing and destination context to the configured route.",
        operatorReceives: "The demonstrated operator view receives the transport request context and the suggested transfer owner.",
        valueCreated: "Shows how coordination can reduce planning effort around a guest's available window.",
      },
      {
        id: "dining-local",
        label: "Local experiences",
        confirmation: "Demo response: Local-experience options are prepared for this example; no partner availability is reserved.",
        rtbxCoordinates: "The demonstrated pathway matches the guest profile and free window with example local-experience inventory.",
        operatorReceives: "The demonstrated operator view receives the experience preference and partner-support cue.",
        valueCreated: "Shows how relevant local discovery can create value without interrupting the guest's stay.",
      },
    ],
    guestSees: "A relevant, well-timed prompt — not a generic notification. Delivered at exactly the right moment based on their actual schedule.",
    rtbxAutomates: "Demo pathway: example commercial window detected from booking data, stay history and dwell pattern. The selected preference shapes the shown route.",
    operatorReceives: "Demo operator view: example Room 408 context, Gold tier, selected preference and the relevant support or partner cue.",
    valueCreated: "Demonstrates a timely, preference-led opportunity without implying a live booking or commercial activation.",
  },
  {
    id: 4,
    stage: "Guest Welfare",
    label: "05 · Guest Welfare Flag",
    phoneMessage: "We're here if you need anything.",
    phoneSub: "No need to explain — we can help discreetly and without any fuss.",
    phoneActions: [
      {
        id: "welfare-quiet-space",
        label: "Arrange a quiet space",
        confirmation: "Demo response: A quiet-space request is prepared for this example; no real space is arranged.",
        rtbxCoordinates: "The demonstrated pathway applies the configured privacy-safe support rule and carries the quiet-space preference forward.",
        operatorReceives: "The demonstrated operator view receives a discreet support cue, the guest preference and the configured care protocol.",
        valueCreated: "Shows how dignified support can be offered with clear governance and without requiring public disclosure.",
      },
      {
        id: "welfare-staff",
        label: "Speak to a staff member",
        confirmation: "Demo response: A human-contact request is prepared with the welfare context; no staff message or contact is sent.",
        rtbxCoordinates: "The demonstrated pathway selects the configured human-support route and preserves the context needed for a careful handoff.",
        operatorReceives: "The demonstrated operator view receives a discreet human-contact cue and the appropriate care context.",
        valueCreated: "Shows how the guest can choose human support while keeping the response governed and proportionate.",
      },
      {
        id: "welfare-later",
        label: "Come back to this later",
        confirmation: "Demo response: Your choice is respected and no immediate escalation is opened; discreet later follow-up remains configurable.",
        rtbxCoordinates: "The demonstrated pathway records the defer choice without automatically escalating or assigning a support action.",
        operatorReceives: "The demonstrated operator view receives a deferred status and the configured follow-up boundary.",
        valueCreated: "Shows restraint: the guest retains control while any later follow-up remains governed by configuration.",
      },
      {
        id: "welfare-fine",
        label: "I'm fine, thank you",
        confirmation: "Demo response: The prompt closes and your response is respected. No automatic escalation is shown unless a separate mandatory safety threshold applies.",
        rtbxCoordinates: "The demonstrated pathway records a self-resolved response and does not open an escalation pathway.",
        operatorReceives: "The demonstrated operator view shows the prompt closed with no action assigned; a mandatory safety threshold remains separately governed.",
        valueCreated: "Shows that guest agency and proportionality are preserved instead of turning a declined prompt into an intervention.",
      },
    ],
    guestSees: "Soft, dignified support — no intrusion, no stigma, no forms. Delivered at the right moment.",
    rtbxAutomates: "Demo pathway: welfare signal classified using a privacy-safe escalation model. Example support and threshold rules are shown.",
    operatorReceives: "Demo operator view: discreet welfare guidance card with role, action steps and care protocol; escalation remains threshold-governed.",
    valueCreated: "Demonstrates a duty-of-care pathway with proportionality, privacy and an accountable assurance trail.",
  },
  {
    id: 5,
    stage: "Service Recovery",
    label: "06 · Service Recovery",
    phoneMessage: "We noticed your room issue is still open.",
    phoneSub: "Let's resolve this properly. Choose how you'd like us to proceed.",
    phoneActions: [
      {
        id: "recovery-manager",
        label: "Escalate to a manager",
        confirmation: "Demo response: A manager-escalation pathway and five-minute timer are previewed; no manager is alerted.",
        rtbxCoordinates: "The demonstrated pathway packages the open-issue context and starts the configured manager-escalation timer in the example.",
        operatorReceives: "The demonstrated operator view receives the issue context, ownership cue and example five-minute resolution timer.",
        valueCreated: "Shows how unresolved service issues can gain visible ownership and a governed response clock.",
      },
      {
        id: "recovery-room-move",
        label: "Request a room move",
        confirmation: "Demo response: A room-availability and approval workflow is previewed; no room is changed or reserved.",
        rtbxCoordinates: "The demonstrated pathway carries the issue context into the configured room-availability and approval route.",
        operatorReceives: "The demonstrated operator view receives the room-move request, issue context and approval ownership cue.",
        valueCreated: "Shows how a room-move request can be governed without promising availability before approval.",
      },
      {
        id: "recovery-quick-fix",
        label: "Arrange a 5-minute fix",
        confirmation: "Demo response: An urgent service or maintenance action is previewed with a five-minute target; no task is dispatched.",
        rtbxCoordinates: "The demonstrated pathway routes the issue to the configured urgent service or maintenance owner.",
        operatorReceives: "The demonstrated operator view receives the issue context, urgent-action cue and five-minute target.",
        valueCreated: "Shows how a small fix can receive a clear owner and response target before frustration grows.",
      },
      {
        id: "recovery-sorted",
        label: "It's sorted — thank you",
        confirmation: "Demo response: The issue is marked resolved for this example and your confirmation is captured. No additional response is shown.",
        rtbxCoordinates: "The demonstrated pathway closes the open recovery loop and records guest confirmation without starting an escalation timer.",
        operatorReceives: "The demonstrated operator view receives a resolved status and guest confirmation; no additional alert is generated.",
        valueCreated: "Shows a proportionate close: the guest's confirmation resolves the example without unnecessary escalation.",
      },
    ],
    guestSees: "A clear resolution pathway, a committed timeframe and confidence that someone owns the problem.",
    rtbxAutomates: "Demo pathway: the unresolved issue is classified as an example recovery risk. The selected response determines whether a timer, approval route or close is shown.",
    operatorReceives: "Demo operator view: example room number, issue type, time open, prior actions, guest tier and selected ownership cue.",
    valueCreated: "Demonstrates governed service recovery with proportional ownership, evidence and guest confirmation.",
  },
  {
    id: 6,
    stage: "Checkout",
    label: "07 · Checkout",
    phoneMessage: "Thank you for staying, Sarah.",
    phoneSub: "Your checkout is ready. We'd love to hear how your stay went.",
    phoneActions: [
      {
        id: "checkout-express",
        label: "Express checkout",
        confirmation: "Demo response: Express checkout is confirmed for this example; no live checkout is processed.",
        rtbxCoordinates: "The demonstrated pathway coordinates the checkout confirmation with the example stay and assurance record.",
        operatorReceives: "The demonstrated operator view receives the example checkout status and any outstanding-stay context.",
        valueCreated: "Shows how checkout friction could be reduced while preserving a clear assurance record.",
      },
      {
        id: "checkout-feedback",
        label: "Share feedback",
        confirmation: "Demo response: A feedback-capture pathway is opened for this example; no feedback is submitted.",
        rtbxCoordinates: "The demonstrated pathway prepares sentiment capture and the configured post-stay review route.",
        operatorReceives: "The demonstrated operator view receives the feedback pathway cue and the relevant stay context.",
        valueCreated: "Shows how the guest voice can enter an accountable learning loop at the end of the stay.",
      },
      {
        id: "checkout-next-stay",
        label: "Book my next stay",
        confirmation: "Demo response: A repeat-stay booking pathway is previewed; no reservation or follow-up is created.",
        rtbxCoordinates: "The demonstrated pathway carries the repeat-stay intent to the configured booking and loyalty route.",
        operatorReceives: "The demonstrated operator view receives repeat-stay intent and the example follow-up ownership cue.",
        valueCreated: "Shows how a positive stay can inform a relevant repeat-stay pathway without implying a booking.",
      },
      {
        id: "checkout-receipt",
        label: "Request a receipt",
        confirmation: "Demo response: Receipt delivery is confirmed for this example; no real receipt is sent and no other checkout action is implied.",
        rtbxCoordinates: "The demonstrated pathway prepares the receipt-delivery route only, separate from checkout, feedback and repeat-stay paths.",
        operatorReceives: "The demonstrated operator view receives a receipt request and delivery-status cue only.",
        valueCreated: "Shows a precise post-stay service response without adding an unrelated booking or feedback action.",
      },
    ],
    guestSees: "Frictionless checkout, a loyalty moment and a dignified farewell — no queue, no desk.",
    rtbxAutomates: "Demo pathway: example checkout, sentiment and loyalty rules are shown; the selected action determines which route is prepared.",
    operatorReceives: "Demo operator view: example stay outcome, sentiment cue, unresolved items and the selected post-stay ownership cue.",
    valueCreated: "Demonstrates a precise end-of-stay response with an evidenced outcome and no implied live transaction.",
  },
];

const QUAD_COLORS = ["#c9a84c", "#3b82f6", "#10b981", "#a78bfa"];

function PhoneFrame({ stage, selected, onSelect }: {
  stage: Stage;
  selected: GuestAction | null;
  onSelect: (a: GuestAction | null) => void;
}) {
  return (
    <div className="rtbx-phone-frame" style={{
      width: 300,
      background: "#1a1b2e",
      borderRadius: 44,
      padding: "10px",
      boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
      flexShrink: 0,
    }}>
      <div style={{
        background: "#faf9f6",
        borderRadius: 36,
        overflow: "hidden",
        height: 580,
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{
          background: "#0d0d1a",
          padding: "10px 20px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>15:12</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)" }}>●●●</span>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)" }}>WiFi</span>
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)" }}>▌▌</span>
          </div>
        </div>

        <div style={{
          background: "#0d0d1a",
          padding: "8px 20px 12px",
          textAlign: "center",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 7.5, letterSpacing: "0.28em", color: "rgba(201,168,76,0.9)", textTransform: "uppercase", fontWeight: 700 }}>
            GRAND MERIDIAN · LONDON
          </div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginTop: 3, letterSpacing: "0.1em" }}>
            {stage.stage.toUpperCase()} MOMENT
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px 14px" }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 5, lineHeight: 1.3 }}>
              {stage.phoneMessage}
            </div>
            <div style={{ fontSize: 11.5, color: "#4a4a6a", lineHeight: 1.6 }}>
              {stage.phoneSub}
            </div>
          </div>

          {selected === null ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stage.phoneActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => onSelect(action)}
                  style={{
                    padding: "11px 14px",
                    background: "#f0eeea",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 10,
                    fontSize: 11, fontWeight: 600, color: "#1a1a2e",
                    textAlign: "left", cursor: "pointer",
                    fontFamily: "system-ui, sans-serif",
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#e6e4e0"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#f0eeea"; }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div style={{
                padding: "14px", background: "#eef7f2",
                border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, marginBottom: 14,
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>✓ Confirmed</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#2d4a3e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                  Guest choice: {selected.label}
                </div>
                <div style={{ fontSize: 11, color: "#2d4a3e", lineHeight: 1.6 }}>{selected.confirmation}</div>
              </div>
              <button
                onClick={() => onSelect(null)}
                style={{
                  padding: "8px 14px", background: "transparent",
                  border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8,
                  fontSize: 9.5, color: "#6b6b8a", cursor: "pointer",
                  fontFamily: "system-ui, sans-serif",
                }}
              >← Try another option</button>
            </div>
          )}
        </div>

        <div style={{
          padding: "10px 20px 14px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          textAlign: "center",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 8.5, color: "#9999b8", fontStyle: "italic" }}>
            No app. No login. In the moment.
          </div>
        </div>
      </div>
    </div>
  );
}

const QUAD_LABELS = ["What the Guest Sees", "What RTBX Core Coordinates", "What the Operator Receives", "Value Created"];

export default function PartnerGuestDemo() {
  const [stageIdx, setStageIdx] = useState(0);
  const [selected, setSelected] = useState<GuestAction | null>(null);
  const stage = STAGES[stageIdx];

  function goTo(idx: number) {
    setStageIdx(idx);
    setSelected(null);
  }

  const quadContent = [
    stage.guestSees,
    selected?.rtbxCoordinates ?? stage.rtbxAutomates,
    selected?.operatorReceives ?? stage.operatorReceives,
    selected?.valueCreated ?? stage.valueCreated,
  ];

  return (
    <PartnerRoomLayout>
      {/* Header */}
      <div className="rtbx-page-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 60px 36px" }}>
        <div style={{ fontSize: 8, letterSpacing: "0.22em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
          Guest Experience Demo
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: P.white, letterSpacing: "-0.02em", marginBottom: 10 }}>
          One Stay. Seven Moments.
        </h1>
        <p style={{ fontSize: 13, color: P.muted, maxWidth: 560, lineHeight: 1.7, margin: 0 }}>
          Follow a single guest from arrival to checkout — at each stage, see what the guest experiences, what RTBX Core automates, what the operator receives and what value is created.
        </p>
      </div>

      {/* Context callout */}
      <div className="rtbx-page-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 0" }}>
        <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid #3b82f6", marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
            The guest never interacts directly with RTBX. What the guest sees is the output of coordinated RTBX action — a message that arrived at the right moment, a problem resolved before they noticed it, a recommendation that felt personal. RTBX Core runs behind the scenes; Guest Experience is the layer guests interact with.
          </p>
        </div>
      </div>

      {/* Stage tabs */}
      <div className="rtbx-page-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 32px" }}>
        <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              style={{
                padding: "10px 16px",
                background: i === stageIdx ? `${P.amber}12` : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === stageIdx ? P.amber + "50" : "rgba(255,255,255,0.07)"}`,
                borderBottom: i === stageIdx ? `2px solid ${P.amber}` : "1px solid rgba(255,255,255,0.07)",
                cursor: "pointer",
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: i === stageIdx ? P.amber : P.dimmed,
                whiteSpace: "nowrap", transition: "all 0.12s",
              }}
              onMouseEnter={e => { if (i !== stageIdx) (e.currentTarget as HTMLElement).style.color = P.muted; }}
              onMouseLeave={e => { if (i !== stageIdx) (e.currentTarget as HTMLElement).style.color = P.dimmed; }}
            >
              {s.label.split("·")[0].trim()} · {s.stage}
            </button>
          ))}
        </div>
      </div>

      {/* Demo area */}
      <div className="rtbx-demo-area rtbx-page-pad" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 60px 80px", display: "flex", gap: 56, alignItems: "flex-start" }}>

        {/* Left: Phone */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <PhoneFrame stage={stage} selected={selected} onSelect={setSelected} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => goTo(Math.max(0, stageIdx - 1))}
              disabled={stageIdx === 0}
              style={{
                background: "none", border: `1px solid ${P.border}`,
                color: stageIdx === 0 ? P.dimmed : P.muted,
                padding: "5px 12px", fontSize: 10, cursor: stageIdx === 0 ? "not-allowed" : "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >←</button>
            {STAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === stageIdx ? 18 : 6, height: 6, borderRadius: 3,
                  border: "none",
                  background: i === stageIdx ? P.amber : "rgba(255,255,255,0.15)",
                  cursor: "pointer", transition: "all 0.2s", padding: 0,
                }}
              />
            ))}
            <button
              onClick={() => goTo(Math.min(STAGES.length - 1, stageIdx + 1))}
              disabled={stageIdx === STAGES.length - 1}
              style={{
                background: "none", border: `1px solid ${P.border}`,
                color: stageIdx === STAGES.length - 1 ? P.dimmed : P.muted,
                padding: "5px 12px", fontSize: 10, cursor: stageIdx === STAGES.length - 1 ? "not-allowed" : "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >→</button>
          </div>
          <div style={{ fontSize: 9, color: P.dimmed, textAlign: "center" }}>Stage {stageIdx + 1} of {STAGES.length} · {stage.stage}</div>
        </div>

        {/* Right: 4-quadrant context */}
        <div style={{ flex: 1, paddingTop: 4 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.2em", color: P.amber, textTransform: "uppercase", fontWeight: 700, marginBottom: 22 }}>
            {stage.label}
          </div>

          {/* 4 quadrants */}
          <div className="rtbx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 32 }}>
            {QUAD_LABELS.map((label, i) => (
              <div key={label} style={{
                padding: "20px 22px",
                background: P.navy,
                border: `1px solid rgba(255,255,255,0.06)`,
                borderTop: `2px solid ${QUAD_COLORS[i]}40`,
              }}>
                <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: QUAD_COLORS[i], textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                  {label}
                </div>
                <div style={{ fontSize: 12, color: P.muted, lineHeight: 1.7 }}>
                  {quadContent[i]}
                </div>
              </div>
            ))}
          </div>

          {/* Stage navigator */}
          <div style={{ fontSize: 7.5, letterSpacing: "0.14em", color: P.dimmed, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
            All Journey Stages
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {STAGES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "9px 14px",
                  background: i === stageIdx ? `${P.amber}08` : "transparent",
                  border: `1px solid ${i === stageIdx ? `${P.amber}30` : "transparent"}`,
                  cursor: "pointer", textAlign: "left", fontFamily: "system-ui, sans-serif",
                  transition: "all 0.12s",
                }}
                onMouseEnter={e => { if (i !== stageIdx) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (i !== stageIdx) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, color: i === stageIdx ? P.amber : P.dimmed, minWidth: 18 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 10.5, color: i === stageIdx ? P.white : P.muted, fontWeight: i === stageIdx ? 600 : 400 }}>
                  {s.stage}
                </span>
                {i === stageIdx && (
                  <span style={{ fontSize: 8.5, color: P.amber, marginLeft: "auto", letterSpacing: "0.1em", textTransform: "uppercase" }}>Active</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${P.border}`, padding: "36px 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Scenario Builder", path: "/partner-room/scenario-builder" },
            { label: "Dual View Demo", path: "/partner-room/dual-view-demo" },
            { label: "Deployment Demos", path: "/partner-room/deployments" },
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
    </PartnerRoomLayout>
  );
}
