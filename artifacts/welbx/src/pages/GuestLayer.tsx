import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── DATA ────────────────────────────────────────────────────────────────────

type TouchpointStatus = 'delivered' | 'active' | 'pending';

interface GuestData {
  name: string;
  firstName: string;
  tier: string;
  tierColor: string;
  stayCount: string;
  origin: string;
  room: string;
  roomType: string;
  floor: string;
  ltv: string;
  ltvLabel: string;
  arrival: string;
  departure: string;
  preferences: string[];
  bxosMode: string;
  bxosModeDetail: string;
}

interface Touchpoint {
  time: string;
  label: string;
  channel: string;
  guestExperience: string;
  bxosContext: string;
  sentiment: 'positive' | 'neutral' | 'managed';
  status: TouchpointStatus;
  message?: string;
}

interface AppMessage {
  id: number;
  from: string;
  time: string;
  read: boolean;
  preview: string;
  body: string;
  highlight?: boolean;
}

interface GuestScenario {
  guest: GuestData;
  touchpoints: Touchpoint[];
  messages: AppMessage[];
  guestSees: string[];
  welbxDoing: string[];
  outcome: { label: string; value: string; color?: string }[];
  mandateText: string;
  welcomeLine: string;
  notificationLabel: string;
  notificationBody: string;
}

// ─── RETURNING GUEST ─────────────────────────────────────────────────────────

const RETURNING: GuestScenario = {
  guest: {
    name: "Mr. J. Hartley",
    firstName: "James",
    tier: "DIAMOND",
    tierColor: "#c9a84c",
    stayCount: "14 stays",
    origin: "New York, USA",
    room: "847",
    roomType: "Superior Suite",
    floor: "14th Floor",
    ltv: "$42,000",
    ltvLabel: "Confirmed LTV",
    arrival: "Today, 14:42",
    departure: "Tomorrow, 11:00",
    preferences: ["High floor", "Champagne on arrival", "Late checkout", "No housekeeping during stay"],
    bxosMode: "HISTORY MODE",
    bxosModeDetail: "14-stay preference record active",
  },
  touchpoints: [
    {
      time: 'T−48h', label: 'Pre-Arrival Personalisation', channel: 'Email',
      guestExperience: '"Mr. Hartley — your Superior Suite is being prepared exactly as you prefer it. Champagne will be waiting."',
      bxosContext: 'BXOS pulled 14-stay preference record. Communication personalised with room type, floor preference, and arrival signature drawn from history.',
      sentiment: 'positive', status: 'delivered',
      message: 'Your preferred room, 14 floors above London. Champagne on arrival — as always.',
    },
    {
      time: 'T−12h', label: 'Arrival Readiness Check', channel: 'SMS',
      guestExperience: '"Let us know if anything has changed — your team will be ready."',
      bxosContext: 'Nexus confirmed no itinerary changes. Front desk pre-briefed. Room 847 assigned and locked.',
      sentiment: 'positive', status: 'delivered',
      message: "We're ready for you. Reply if your plans have changed.",
    },
    {
      time: 'T−18min', label: 'Operational Risk Detected', channel: 'Internal · BXOS',
      guestExperience: 'Guest is unaware. WELBX is working.',
      bxosContext: 'M2 surfaced: Room 847 occupied, housekeeping overloaded, queue at 11. Confidence 91%. Response routed in 45 seconds.',
      sentiment: 'managed', status: 'delivered',
    },
    {
      time: 'T+00:00', label: 'Seamless Arrival', channel: 'In-Person',
      guestExperience: '"The room was ready the moment I arrived. No queue, no wait. My name was called before I reached the desk."',
      bxosContext: 'Secondary lane opened. Host pre-positioned. Room 847 released 2 min early. VIP welcome protocol active.',
      sentiment: 'positive', status: 'delivered',
      message: 'Welcome back, Mr. Hartley. Room 847 is ready. May I take your bags?',
    },
    {
      time: 'T+00:40', label: 'In-Room Welcome Gesture', channel: 'In-Room',
      guestExperience: '"The champagne was already open. There was a handwritten note. It felt like they genuinely knew me."',
      bxosContext: 'DIAMOND protocol executed. Preference match: Billecart-Salmon, Blanc de Blancs. Note referenced prior stay.',
      sentiment: 'positive', status: 'delivered',
      message: 'Welcome back. Fourteen stays — and we still look forward to each one.',
    },
    {
      time: 'T+06h', label: 'Proactive Stay Check', channel: 'App',
      guestExperience: '"Nothing was wrong — but knowing they asked made a difference."',
      bxosContext: 'Sentiment index stable. Outreach triggered by BXOS loyalty protocol — not reactive.',
      sentiment: 'positive', status: 'delivered',
      message: "Mr. Hartley — how is your stay so far? We're here if you need anything.",
    },
    {
      time: 'T+18h', label: 'Late Checkout Activated', channel: 'App',
      guestExperience: '"I didn\'t even have to ask. They offered 13:00 checkout without me raising it."',
      bxosContext: 'BXOS triggered late-checkout offer: DIAMOND tier + occupancy data. No margin impact. Loyalty signal captured.',
      sentiment: 'positive', status: 'active',
      message: 'Mr. Hartley — enjoy a 13:00 checkout tomorrow. No need to rush.',
    },
  ],
  messages: [
    { id: 1, from: 'The Grand Meridian', time: '2 days ago', read: true, preview: 'Your preferred room, 14 floors above London…', body: 'Your preferred room, 14 floors above London. Champagne on arrival — as always. We look forward to welcoming you tomorrow.' },
    { id: 2, from: 'Your Arrival Team', time: 'Yesterday, 08:14', read: true, preview: "We're ready for you. Reply if your plans…", body: "We're ready for you. Your suite is confirmed. Reply here if your arrival plans have changed." },
    { id: 3, from: 'Front Desk', time: 'Today, 14:43', read: true, preview: 'Welcome back, Mr. Hartley…', body: 'Welcome back, Mr. Hartley. Room 847 is ready and waiting. Your bags have been sent up. We hope the journey was smooth.' },
    { id: 4, from: 'The Grand Meridian', time: 'Today, 15:22', read: true, preview: 'Fourteen stays — and we still look forward…', body: 'Welcome back. Fourteen stays — and we still look forward to each one. Champagne is chilled. The view is yours.' },
    { id: 5, from: 'Your Concierge', time: 'Today, 20:45', read: false, preview: "Mr. Hartley — how is your stay so far?", body: "Mr. Hartley — how is your stay so far? We're here if you need anything at all. Don't hesitate to message directly." },
    { id: 6, from: 'Stay Services', time: 'Today, 21:30', read: false, preview: 'Enjoy a 13:00 checkout tomorrow…', body: 'Mr. Hartley — as a thank you for your loyalty, enjoy a 13:00 checkout tomorrow. No need to rush. We hope you sleep well.' },
  ],
  guestSees: [
    'A hotel that knows their name and their preferences',
    'Messages that arrive at exactly the right moment',
    'A room ready before they need to ask',
    'A checkout extension without raising it',
    'A champagne flute, already poured',
  ],
  welbxDoing: [
    '14-stay preference pattern applied',
    'Sentiment and timing intelligence',
    'Operational routing and room release',
    'Loyalty tier and occupancy data trigger',
    'DIAMOND protocol execution',
  ],
  outcome: [
    { label: 'NPS Score', value: '9 / 10', color: '#10b981' },
    { label: 'Return Intent', value: 'HIGH', color: '#10b981' },
    { label: 'LTV Delta', value: '+$3,200', color: '#10b981' },
    { label: 'Complaint Filed', value: 'None', color: '#10b981' },
    { label: 'Recovery Cost', value: '$0', color: '#10b981' },
    { label: 'Loyalty Action', value: 'Ambassador upgrade', color: '#c9a84c' },
  ],
  mandateText: "Mr. Hartley never saw the pressure building at 14:32. He experienced a flawless arrival, a glass of champagne, and a hotel that knew his name. The same intelligence that protected $8,000 in operational value created a guest who will return, review, and refer. WELBX engineers both outcomes simultaneously — from a single operating layer.",
  welcomeLine: "Good evening, James.",
  notificationLabel: 'New from Stay Services',
  notificationBody: "Mr. Hartley — enjoy a 13:00 checkout tomorrow. No need to rush.",
};

// ─── FIRST-TIME GUEST ─────────────────────────────────────────────────────────

const FIRST_TIME: GuestScenario = {
  guest: {
    name: "Ms. P. Chen",
    firstName: "Priya",
    tier: "FIRST STAY",
    tierColor: "#60a5fa",
    stayCount: "1st stay",
    origin: "Singapore",
    room: "312",
    roomType: "Deluxe Double",
    floor: "8th Floor",
    ltv: "$18,000+",
    ltvLabel: "Estimated LTV Potential",
    arrival: "Today, 16:15",
    departure: "Day after tomorrow, 11:00",
    preferences: ["No prior history — BXOS inference mode active"],
    bxosMode: "INFERENCE MODE",
    bxosModeDetail: "Booking signal + arrival pattern + archetype matching",
  },
  touchpoints: [
    {
      time: 'T−24h', label: 'First-Stay Welcome', channel: 'Email',
      guestExperience: '"I didn\'t expect them to already feel prepared for me — I\'d never stayed before."',
      bxosContext: 'No preference history. Booking channel: Virtuoso (high-value indicator). Guest archetype: Singapore business-leisure solo traveler. Discovery-mode communication scripted — warm, not assumptive.',
      sentiment: 'positive', status: 'delivered',
      message: "Your first stay with us, Ms. Chen. We'd like to get it right. Here's what to expect.",
    },
    {
      time: 'T−3h', label: 'Arrival Signal Intelligence', channel: 'SMS',
      guestExperience: '"They mentioned Singapore. They knew I\'d had a long journey. I felt looked after before I arrived."',
      bxosContext: 'Flight SQ321 tracked — on schedule, 10h duration. Long-haul fatigue pattern applied: room temperature pre-set 19°C, blackout curtains lowered, turndown prepared early.',
      sentiment: 'positive', status: 'delivered',
      message: "We know it's been a long journey from Singapore, Ms. Chen. Your room is ready and waiting.",
    },
    {
      time: 'T+00:00', label: 'Discovery Arrival', channel: 'In-Person',
      guestExperience: '"The welcome was warm without being overwhelming. They knew enough to make it feel personal — without any history to draw from."',
      bxosContext: 'First impression critical. BXOS briefed host: Singapore origin, 10h flight, no prior stays. Discovery welcome protocol — orient, don\'t assume. Upgrade to preferred floor offered proactively.',
      sentiment: 'positive', status: 'delivered',
      message: "Welcome to The Grand Meridian, Ms. Chen. We hope the flight was comfortable. Let us show you around.",
    },
    {
      time: 'T+01h', label: 'In-Room Introduction', channel: 'App',
      guestExperience: '"It felt curated. A short list of recommendations — not overwhelming. Exactly what I needed after a long flight."',
      bxosContext: 'Long-haul fatigue protocol: low-demand content. Hotel orientation sent with 3 curated options only. No upsell. Spa intro included as rest-recovery signal.',
      sentiment: 'positive', status: 'delivered',
      message: "Good afternoon, Ms. Chen. A few things we think you might like — when you're ready.",
    },
    {
      time: 'T+05h', label: 'Dining Recommendation', channel: 'App',
      guestExperience: '"They recommended a restaurant that was exactly what I wanted. I hadn\'t told them anything."',
      bxosContext: 'Archetype match: 84% correlation to "Singapore business-leisure" profile — high F&B propensity, preference for modern cuisine. The Meridian Room surfaced with a curated menu preview.',
      sentiment: 'positive', status: 'delivered',
      message: "The Meridian Room opens at 19:00. Based on your booking profile, we think you'll enjoy it.",
    },
    {
      time: 'T+22h', label: 'Spa Discovery', channel: 'App',
      guestExperience: '"I booked the spa on what felt like a whim. It turned out to be the best part of the stay."',
      bxosContext: 'Sentiment positive. Predicted low-activity window (10:00 GMT). Spa candidate score: 78% based on archetype. Soft discovery trigger — no pressure, no upsell framing.',
      sentiment: 'positive', status: 'delivered',
      message: "The spa is available this morning, Ms. Chen. No booking needed for first-time guests.",
    },
    {
      time: 'T+44h', label: 'Loyalty Conversion Moment', channel: 'App',
      guestExperience: '"I signed up at the airport. First time I\'ve ever done that on a first stay."',
      bxosContext: 'BXOS optimal conversion window: 72h post-arrival. NPS signal positive. Loyalty programme invite personalised with stay summary and projected benefit at next visit.',
      sentiment: 'positive', status: 'active',
      message: "We'd love to have you back, Ms. Chen. Join our programme — your next stay is already waiting.",
    },
  ],
  messages: [
    { id: 1, from: 'The Grand Meridian', time: 'Yesterday, 09:00', read: true, preview: "Your first stay with us, Ms. Chen…", body: "Your first stay with us, Ms. Chen. We'd like to get it right. Here's what to expect when you arrive — and how to reach us if you need anything." },
    { id: 2, from: 'Your Arrival Team', time: 'Today, 13:10', read: true, preview: 'We know it\'s been a long journey…', body: "We know it's been a long journey from Singapore, Ms. Chen. Your room is ready. Flight tracked — we'll see you soon." },
    { id: 3, from: 'Front Desk', time: 'Today, 16:18', read: true, preview: 'Welcome to The Grand Meridian…', body: "Welcome to The Grand Meridian, Ms. Chen. We hope the flight was comfortable. Room 312 is ready — your bags are on their way up." },
    { id: 4, from: 'The Grand Meridian', time: 'Today, 17:20', read: true, preview: 'A few things we think you might like…', body: "Good afternoon, Ms. Chen. A few things we think you might enjoy — when you're ready. The Meridian Bar opens at 18:00. The spa is on the 5th floor. No rush." },
    { id: 5, from: 'The Meridian Room', time: 'Today, 18:45', read: false, preview: 'The Meridian Room opens at 19:00…', body: "The Meridian Room opens at 19:00, Ms. Chen. Based on your booking, we think you'll enjoy the tasting menu. We've held a table if you'd like it.", highlight: true },
    { id: 6, from: 'Loyalty Programme', time: 'Today, 21:00', read: false, preview: "We'd love to have you back…", body: "We'd love to have you back, Ms. Chen. Join our programme now and your next stay earns you complimentary late checkout. No obligation." },
  ],
  guestSees: [
    'A hotel that anticipated their needs without any history',
    'A welcome that felt personal despite being their first visit',
    'Recommendations that matched their taste precisely',
    'A spa they discovered at exactly the right moment',
    'A loyalty invitation that actually felt worth accepting',
  ],
  welbxDoing: [
    'Booking channel inference (Virtuoso = high-value signal)',
    'Long-haul arrival pattern → fatigue protocol applied',
    'Market archetype matching (Singapore business-leisure)',
    'Optimal conversion window timing (loyalty invite)',
    'First impression engineering — no history, full intelligence',
  ],
  outcome: [
    { label: 'NPS Score', value: '8 / 10', color: '#10b981' },
    { label: 'Return Intent', value: 'HIGH', color: '#10b981' },
    { label: 'Loyalty', value: 'ENROLLED', color: '#60a5fa' },
    { label: 'Complaint Filed', value: 'None', color: '#10b981' },
    { label: 'Recovery Cost', value: '$0', color: '#10b981' },
    { label: 'LTV Potential', value: '$18,000+', color: '#c9a84c' },
  ],
  mandateText: "Ms. Chen had no preference history. BXOS had her booking channel (Virtuoso), her origin (Singapore), her flight duration (10h), and her room category (Deluxe Double). From that, it inferred: business-leisure traveler, long-haul fatigue, high F&B propensity, spa candidate. The first stay is the most commercially important moment in a guest relationship. It either converts a one-time booker into a lifetime loyalty relationship — or loses them forever. WELBX engineers the first impression as carefully as the fourteenth.",
  welcomeLine: "Welcome to The Grand Meridian, Priya.",
  notificationLabel: 'Loyalty Programme',
  notificationBody: "We'd love to have you back. Join our programme — your next stay is already waiting.",
};

// ─── COMPONENT UTILS ─────────────────────────────────────────────────────────

const SENTIMENT_CONFIG = {
  positive: { dot: '#10b981' },
  neutral:  { dot: 'hsl(215 16% 40%)' },
  managed:  { dot: '#c9a84c' },
};

const STATUS_CFG: Record<TouchpointStatus, { color: string; bg: string; border: string }> = {
  delivered: { color: '#10b981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)' },
  active:    { color: '#c9a84c', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.22)' },
  pending:   { color: 'hsl(215 16% 35%)', bg: 'transparent', border: 'hsl(220 13% 14%)' },
};

// ─── PHONE MOCKUP ─────────────────────────────────────────────────────────────

function PhoneMockup({ scenario, guestType }: { scenario: GuestScenario; guestType: 'returning' | 'first-time' }) {
  const [screen, setScreen] = useState<'home' | 'messages'>('home');
  const [openMsg, setOpenMsg] = useState<number | null>(null);
  const { guest, messages, welcomeLine, notificationLabel, notificationBody } = scenario;
  const unread = messages.filter(m => !m.read).length;
  const isFirst = guestType === 'first-time';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ textAlign: 'center' }}>
        <div className="label-caps mb-0.5" style={{ color: 'hsl(215 16% 24%)' }}>The Grand Meridian · Guest App</div>
        <div style={{ fontSize: 9, color: 'hsl(215 16% 20%)', letterSpacing: '0.05em' }}>
          {isFirst ? 'BXOS inference mode · invisible to guest' : 'BXOS history mode · invisible to guest'}
        </div>
      </div>

      {/* Phone */}
      <div style={{
        width: 272, height: 554, borderRadius: 34,
        background: 'hsl(220 13% 5.5%)',
        border: '7px solid hsl(220 13% 12%)',
        boxShadow: '0 0 0 1px hsl(220 13% 8%), 0 24px 56px rgba(0,0,0,0.55)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Status bar */}
        <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', flexShrink: 0 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'hsl(215 16% 42%)', fontFamily: 'var(--app-font-mono)' }}>
            {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div style={{ width: 54, height: 12, background: 'hsl(220 13% 9%)', borderRadius: 6 }} />
          <div style={{ width: 9, height: 6, border: '1.5px solid hsl(215 16% 38%)', borderRadius: 1.5, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: '1px', background: '#10b981', borderRadius: 0.5 }} />
          </div>
        </div>

        {/* Screen */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'hsl(220 13% 5.5%)' }}>
          <AnimatePresence mode="wait">

            {screen === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ padding: '10px 16px 7px', borderBottom: '1px solid hsl(220 13% 9%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 1 }}>The Grand Meridian</div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#fff' }}>{welcomeLine}</div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'hsl(220 13% 10%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🔔</div>
                    {unread > 0 && (
                      <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 6, color: '#fff', fontWeight: 700 }}>{unread}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Room card */}
                <div style={{ margin: '10px 12px 8px', background: 'linear-gradient(135deg, hsl(220 13% 9%) 0%, hsl(220 13% 12%) 100%)', borderRadius: 10, padding: '12px 14px', border: '1px solid hsl(220 13% 14%)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 3 }}>Your Room</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{guest.room}</div>
                      <div style={{ fontSize: 8.5, color: 'hsl(215 16% 42%)', marginTop: 2 }}>{guest.roomType} · {guest.floor}</div>
                    </div>
                    <div style={{ padding: '2px 7px', background: `${guest.tierColor}20`, border: `1px solid ${guest.tierColor}30`, borderRadius: 3 }}>
                      <span style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '0.1em', color: guest.tierColor, textTransform: 'uppercase' }}>{guest.tier}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {[{ label: 'Check-in', value: guest.arrival.split(', ')[1] }, { label: 'Check-out', value: isFirst ? '11:00' : '13:00' }].map((f, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 5, padding: '5px 7px' }}>
                        <div style={{ fontSize: 6.5, color: 'hsl(215 16% 34%)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 2 }}>{f.label}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: 'var(--app-font-mono)' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification card */}
                <div style={{ margin: '0 12px 8px', background: isFirst ? 'rgba(96,165,250,0.06)' : 'rgba(16,185,129,0.06)', border: `1px solid ${isFirst ? 'rgba(96,165,250,0.15)' : 'rgba(16,185,129,0.15)'}`, borderRadius: 7, padding: '8px 10px' }}>
                  <div style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: isFirst ? '#60a5fa' : '#10b981', marginBottom: 3 }}>{notificationLabel}</div>
                  <div style={{ fontSize: 9.5, color: 'hsl(215 16% 62%)', lineHeight: 1.45 }}>{notificationBody}</div>
                  <button onClick={() => setScreen('messages')} style={{ marginTop: 6, fontSize: 7.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isFirst ? '#60a5fa' : '#10b981', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                    View all messages →
                  </button>
                </div>

                {/* BXOS mode indicator */}
                {isFirst && (
                  <div style={{ margin: '0 12px 8px', padding: '6px 9px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 5 }}>
                    <div style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: 2 }}>BXOS · Inference Mode</div>
                    <div style={{ fontSize: 8.5, color: 'hsl(215 16% 38%)', lineHeight: 1.4 }}>Personalising your stay from booking signals. No prior history required.</div>
                  </div>
                )}

                {/* Quick actions */}
                <div style={{ margin: '0 12px 8px' }}>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(215 16% 26%)', marginBottom: 6 }}>Quick Access</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
                    {['🍽 Dining', '🧖 Spa', '🔑 Key', '🛎 Service', '🚗 Transport', '💬 Concierge'].map((a, i) => {
                      const [icon, label] = a.split(' ');
                      return (
                        <div key={i} style={{ background: 'hsl(220 13% 9%)', borderRadius: 7, padding: '7px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: '1px solid hsl(220 13% 12%)', cursor: 'pointer' }}>
                          <span style={{ fontSize: 12 }}>{icon}</span>
                          <span style={{ fontSize: 7, color: 'hsl(215 16% 40%)', fontWeight: 600, letterSpacing: '0.05em' }}>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ margin: '0 12px 8px', padding: '6px 8px', background: 'hsl(220 13% 7%)', borderRadius: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 3.5, height: 3.5, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: 7.5, color: 'hsl(215 16% 26%)', letterSpacing: '0.04em' }}>
                    {isFirst ? "We're learning your preferences · first stay" : `Your stay is being looked after · ${guest.stayCount} on file`}
                  </span>
                </div>
              </motion.div>
            )}

            {screen === 'messages' && (
              <motion.div key="msgs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid hsl(220 13% 9%)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => { setScreen('home'); setOpenMsg(null); }} style={{ background: 'transparent', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: 13, padding: 0 }}>‹</button>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>Messages</div>
                  {unread > 0 && (
                    <div style={{ marginLeft: 'auto', padding: '1px 5px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7 }}>
                      <span style={{ fontSize: 6.5, color: '#ef4444', fontWeight: 700 }}>{unread} unread</span>
                    </div>
                  )}
                </div>
                {openMsg === null ? (
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {messages.map((msg) => (
                      <div key={msg.id} onClick={() => setOpenMsg(msg.id)}
                        style={{ padding: '9px 12px', borderBottom: '1px solid hsl(220 13% 8.5%)', cursor: 'pointer', background: !msg.read ? 'rgba(201,168,76,0.025)' : 'transparent', display: 'flex', gap: 8 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: !msg.read ? '#c9a84c' : 'transparent', flexShrink: 0, marginTop: 4 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1.5 }}>
                            <span style={{ fontSize: 8.5, fontWeight: 700, color: !msg.read ? '#fff' : 'hsl(215 16% 48%)' }}>{msg.from}</span>
                            <span style={{ fontSize: 7.5, color: 'hsl(215 16% 26%)', flexShrink: 0 }}>{msg.time.split(', ')[1] || msg.time}</span>
                          </div>
                          <div style={{ fontSize: 9, color: 'hsl(215 16% 38%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.preview}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {(() => {
                      const msg = messages.find(m => m.id === openMsg)!;
                      return (
                        <>
                          <div style={{ padding: '8px 12px', borderBottom: '1px solid hsl(220 13% 9%)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            <button onClick={() => setOpenMsg(null)} style={{ background: 'transparent', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: 13, padding: 0 }}>‹</button>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{msg.from}</div>
                              <div style={{ fontSize: 7.5, color: 'hsl(215 16% 30%)' }}>{msg.time}</div>
                            </div>
                          </div>
                          <div style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
                            <div style={{ background: 'hsl(220 13% 9%)', borderRadius: '0 8px 8px 8px', padding: '8px 10px', maxWidth: '88%' }}>
                              <div style={{ fontSize: 10, color: 'hsl(215 16% 70%)', lineHeight: 1.55 }}>{msg.body}</div>
                            </div>
                          </div>
                          <div style={{ padding: '6px 12px 8px', display: 'flex', gap: 5, flexShrink: 0 }}>
                            {['Reply', 'Request Service'].map(a => (
                              <div key={a} style={{ flex: 1, padding: '5px', background: 'hsl(220 13% 9%)', border: '1px solid hsl(220 13% 13%)', borderRadius: 5, textAlign: 'center', cursor: 'pointer' }}>
                                <span style={{ fontSize: 7.5, color: 'hsl(215 16% 40%)', fontWeight: 700 }}>{a}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab bar */}
        <div style={{ height: 48, background: 'hsl(220 13% 6%)', borderTop: '1px solid hsl(220 13% 9%)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', flexShrink: 0 }}>
          {[{ id: 'home', icon: '⌂', label: 'Home' }, { id: 'messages', icon: '✉', label: 'Messages' }, { id: 'room', icon: '🔑', label: 'Room' }].map(tab => {
            const isActive = screen === tab.id;
            return (
              <button key={tab.id} onClick={() => { setScreen(tab.id as any); setOpenMsg(null); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                <span style={{ fontSize: 13, opacity: isActive ? 1 : 0.3 }}>{tab.icon}</span>
                <span style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isActive ? '#c9a84c' : 'hsl(215 16% 26%)' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 272 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', marginBottom: 5 }}>
          <div style={{ flex: 1, height: 1, background: 'hsl(220 13% 9%)' }} />
          <span style={{ fontSize: 7.5, letterSpacing: '0.16em', color: 'hsl(215 16% 20%)', textTransform: 'uppercase', fontWeight: 700 }}>WELBX · {isFirst ? 'INFERENCE MODE' : 'HISTORY MODE'}</span>
          <div style={{ flex: 1, height: 1, background: 'hsl(220 13% 9%)' }} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function GuestLayer() {
  const [guestType, setGuestType] = useState<'returning' | 'first-time'>('returning');
  const [tab, setTab] = useState<'timeline' | 'app'>('app');
  const [selected, setSelected] = useState<number | null>(null);

  const scenario = guestType === 'returning' ? RETURNING : FIRST_TIME;
  const { guest, touchpoints, guestSees, welbxDoing, outcome, mandateText } = scenario;
  const isFirst = guestType === 'first-time';

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <header className="mb-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>BXOS · Guest Intelligence</div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Guest Layer</h1>
              <p className="text-xs mt-1.5" style={{ color: 'hsl(215 16% 40%)', maxWidth: 480, letterSpacing: '0.01em' }}>
                WELBX operates a dual mandate — optimising hotel performance while engineering the guest's lived experience.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
              {/* Active stay */}
              <div style={{ padding: '9px 14px', border: '1px solid hsl(220 13% 12%)', background: 'hsl(220 13% 7%)', textAlign: 'right' }}>
                <div className="label-caps mb-1" style={{ color: 'hsl(215 16% 28%)' }}>Active Stay</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{guest.name}</div>
                <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', color: guest.tierColor, textTransform: 'uppercase', marginTop: 2 }}>{guest.tier} · {guest.stayCount}</div>
              </div>
              {/* Controls row */}
              <div style={{ display: 'flex', gap: 6 }}>
                {/* Guest type toggle */}
                <div style={{ display: 'flex', border: '1px solid hsl(220 13% 14%)' }}>
                  <button
                    onClick={() => { setGuestType('returning'); setSelected(null); }}
                    style={{ padding: '6px 14px', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: guestType === 'returning' ? 'rgba(201,168,76,0.1)' : 'transparent', color: guestType === 'returning' ? '#c9a84c' : 'hsl(215 16% 36%)', border: 'none', borderRight: '1px solid hsl(220 13% 14%)', cursor: 'pointer' }}
                  >
                    Returning
                  </button>
                  <button
                    onClick={() => { setGuestType('first-time'); setSelected(null); }}
                    style={{ padding: '6px 14px', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: guestType === 'first-time' ? 'rgba(96,165,250,0.1)' : 'transparent', color: guestType === 'first-time' ? '#60a5fa' : 'hsl(215 16% 36%)', border: 'none', cursor: 'pointer' }}
                  >
                    First Stay
                  </button>
                </div>
                {/* View toggle */}
                <div style={{ display: 'flex', border: '1px solid hsl(220 13% 14%)' }}>
                  <button onClick={() => setTab('app')} style={{ padding: '6px 14px', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: tab === 'app' ? 'rgba(201,168,76,0.08)' : 'transparent', color: tab === 'app' ? '#c9a84c' : 'hsl(215 16% 36%)', border: 'none', borderRight: '1px solid hsl(220 13% 14%)', cursor: 'pointer' }}>Guest App</button>
                  <button onClick={() => setTab('timeline')} style={{ padding: '6px 14px', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: tab === 'timeline' ? 'rgba(201,168,76,0.08)' : 'transparent', color: tab === 'timeline' ? '#c9a84c' : 'hsl(215 16% 36%)', border: 'none', cursor: 'pointer' }}>Engagement</button>
                </div>
              </div>
            </div>
          </div>

          {/* BXOS mode banner for first-time */}
          <AnimatePresence>
            {isFirst && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ marginTop: 12, padding: '10px 16px', background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#60a5fa', flexShrink: 0 }} className="animate-pulse" />
                <div>
                  <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#60a5fa' }}>BXOS · Inference Mode Active</span>
                  <span style={{ fontSize: 10, color: 'hsl(215 16% 38%)', marginLeft: 10 }}>No preference history available. Operating from: booking channel · arrival pattern · market archetype · flight data.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${guestType}-${tab}`}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {/* ── GUEST APP VIEW ── */}
            {tab === 'app' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 36, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {/* Sees vs Doing */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ padding: '16px 18px', border: '1px solid hsl(220 13% 10%)', background: 'hsl(220 13% 7%)' }}>
                      <div className="label-caps mb-3">The guest sees</div>
                      {guestSees.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, alignItems: 'flex-start', marginBottom: 8 }}>
                          <span style={{ color: '#10b981', marginTop: 2, flexShrink: 0 }}>—</span>
                          <span style={{ color: 'hsl(215 16% 58%)', lineHeight: 1.4 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '16px 18px', border: `1px solid rgba(201,168,76,0.14)`, background: 'rgba(201,168,76,0.03)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="label-caps" style={{ color: '#c9a84c' }}>WELBX is doing</div>
                        <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.12em', padding: '1px 5px', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', textTransform: 'uppercase' }}>{guest.bxosMode}</span>
                      </div>
                      {welbxDoing.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, alignItems: 'flex-start', marginBottom: 8 }}>
                          <span style={{ color: '#c9a84c', marginTop: 2, flexShrink: 0 }}>—</span>
                          <span style={{ color: 'hsl(215 16% 48%)', lineHeight: 1.4 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcome */}
                  <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.13)', padding: '16px 18px' }}>
                    <div className="label-caps mb-3" style={{ color: '#10b981' }}>Stay Outcome {isFirst ? '— First Stay Conversion' : 'Forecast'}</div>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                      {outcome.map((f, i) => (
                        <div key={i}>
                          <div className="label-caps mb-1">{f.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: f.color || '#fff' }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mandate */}
                  <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: '14px 18px' }}>
                    <div className="label-caps mb-2" style={{ color: 'hsl(215 16% 26%)' }}>{isFirst ? 'First Stay — The Highest-Stakes Moment' : 'The Dual Mandate'}</div>
                    <p style={{ fontSize: 11, color: 'hsl(215 16% 42%)', lineHeight: 1.75 }}>{mandateText}</p>
                  </div>
                </div>

                <PhoneMockup scenario={scenario} guestType={guestType} />
              </div>
            )}

            {/* ── ENGAGEMENT TIMELINE VIEW ── */}
            {tab === 'timeline' && (
              <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 18 }}>
                {/* Profile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: 18 }}>
                    <div className="label-caps mb-3">Guest Profile</div>
                    {[
                      { label: 'Name', value: guest.name },
                      { label: 'Tier', value: guest.tier, color: guest.tierColor },
                      { label: 'Stays', value: guest.stayCount },
                      { label: 'Origin', value: guest.origin },
                      { label: 'Room', value: `${guest.room} — ${guest.roomType}` },
                      { label: guest.ltvLabel, value: guest.ltv, color: '#10b981' },
                    ].map((f, i, arr) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < arr.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none', gap: 12 }}>
                        <span style={{ fontSize: 9, color: 'hsl(215 16% 32%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>{f.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: f.color || 'hsl(215 16% 62%)', textAlign: 'right' }}>{f.value}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid hsl(220 13% 9%)' }}>
                      <div className="label-caps mb-2">{isFirst ? 'BXOS Inference Signals' : 'Preferences on File'}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {guest.preferences.map((p, i) => (
                          <span key={i} style={{ fontSize: 8, padding: '2px 6px', fontWeight: 600, letterSpacing: '0.05em', color: isFirst ? '#60a5fa' : 'hsl(215 16% 40%)', border: `1px solid ${isFirst ? 'rgba(96,165,250,0.2)' : 'hsl(220 13% 13%)'}`, background: isFirst ? 'rgba(96,165,250,0.05)' : 'hsl(220 13% 6.5%)' }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.13)', padding: 16 }}>
                    <div className="label-caps mb-3" style={{ color: '#10b981' }}>Outcome</div>
                    {outcome.map((f, i, arr) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(16,185,129,0.07)' : 'none', gap: 12 }}>
                        <span style={{ fontSize: 9, color: 'hsl(215 16% 32%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>{f.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: f.color || '#fff', textAlign: 'right' }}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: '12px 16px', marginBottom: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="label-caps">Engagement Timeline</div>
                    <div style={{ fontSize: 8.5, color: 'hsl(215 16% 28%)', letterSpacing: '0.06em' }}>{touchpoints.length} touchpoints · {isFirst ? '48h span' : '18h span'}</div>
                  </div>
                  <div style={{ border: '1px solid hsl(220 13% 10%)' }}>
                    {touchpoints.map((tp, i) => {
                      const isSelected = selected === i;
                      const sentCfg = SENTIMENT_CONFIG[tp.sentiment];
                      const statusCfg = STATUS_CFG[tp.status];
                      const isInternal = tp.sentiment === 'managed';
                      return (
                        <motion.div
                          key={`${guestType}-${i}`}
                          initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                          onClick={() => setSelected(isSelected ? null : i)}
                          style={{ borderBottom: i < touchpoints.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none', background: isSelected ? 'hsl(220 13% 8%)' : isInternal ? 'rgba(201,168,76,0.02)' : 'transparent', borderLeft: isSelected ? `2px solid ${sentCfg.dot}` : '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px' }}>
                            <div style={{ fontFamily: 'var(--app-font-mono)', fontSize: 9, color: 'hsl(215 16% 28%)', letterSpacing: '0.05em', minWidth: 46, flexShrink: 0 }}>{tp.time}</div>
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: sentCfg.dot, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 11.5, fontWeight: 600, color: isInternal ? '#c9a84c' : '#fff' }}>{tp.label}</div>
                              <div style={{ fontSize: 8.5, color: 'hsl(215 16% 30%)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginTop: 1 }}>{tp.channel}{isInternal ? ' — Operational only' : ''}</div>
                            </div>
                            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 6px', color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, flexShrink: 0 }}>{tp.status}</div>
                            <div style={{ color: 'hsl(215 16% 28%)', fontSize: 10, transition: 'transform 0.2s', transform: isSelected ? 'rotate(90deg)' : 'none' }}>›</div>
                          </div>
                          {isSelected && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }} style={{ padding: '0 14px 12px', overflow: 'hidden' }}>
                              <div className="grid grid-cols-2 gap-5 pt-3" style={{ borderTop: '1px solid hsl(220 13% 10%)' }}>
                                <div>
                                  <div className="label-caps mb-2" style={{ color: isInternal ? '#c9a84c' : '#10b981' }}>{isInternal ? 'Operational Action' : 'Guest Experience'}</div>
                                  {tp.message && !isInternal && (
                                    <div style={{ background: 'hsl(220 13% 10%)', border: '1px solid hsl(220 13% 13%)', padding: '7px 10px', marginBottom: 7 }}>
                                      <div style={{ fontSize: 7.5, color: 'hsl(215 16% 28%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>{tp.channel} · Grand Meridian</div>
                                      <div style={{ fontSize: 10, color: 'hsl(215 16% 70%)', lineHeight: 1.5, fontStyle: 'italic' }}>"{tp.message}"</div>
                                    </div>
                                  )}
                                  <div style={{ fontSize: 10, color: 'hsl(215 16% 53%)', lineHeight: 1.65 }}>{tp.guestExperience}</div>
                                </div>
                                <div>
                                  <div className="label-caps mb-2" style={{ color: 'hsl(215 16% 26%)' }}>BXOS Context</div>
                                  <div style={{ fontSize: 10, color: 'hsl(215 16% 42%)', lineHeight: 1.65 }}>{tp.bxosContext}</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-4 mt-2" style={{ border: '1px solid hsl(220 13% 10%)', background: 'hsl(220 13% 7%)' }}>
                    {[
                      { label: 'Touchpoints', value: String(touchpoints.filter(t => t.sentiment !== 'managed').length) },
                      { label: 'Proactive', value: isFirst ? 'All 7' : '5 of 6', color: '#10b981' },
                      { label: 'Sentiment', value: 'Positive', color: '#10b981' },
                      { label: isFirst ? 'Conversion' : 'Recovery', value: isFirst ? 'ENROLLED' : 'None', color: isFirst ? '#60a5fa' : '#10b981' },
                    ].map((s, i) => (
                      <div key={i} style={{ padding: '10px 14px', borderRight: i < 3 ? '1px solid hsl(220 13% 10%)' : 'none' }}>
                        <div className="label-caps mb-1">{s.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: s.color || '#fff' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
