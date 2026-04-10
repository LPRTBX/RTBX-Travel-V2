import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type GuestType = 'returning' | 'first-time' | 'welfare' | 'crisis';
type TouchpointStatus = 'delivered' | 'active' | 'pending';

interface GuestData {
  name: string; firstName: string; tier: string; tierColor: string;
  stayCount: string; origin: string; room: string; roomType: string;
  floor: string; ltv: string; ltvLabel: string; arrival: string;
  departure: string; preferences: string[];
  bxosMode: string; bxosModeDetail: string;
}

interface Touchpoint {
  time: string; label: string; channel: string;
  guestExperience: string; bxosContext: string;
  sentiment: 'positive' | 'neutral' | 'managed'; status: TouchpointStatus;
  message?: string;
}

interface AppMessage {
  id: number; from: string; time: string; read: boolean;
  preview: string; body: string;
}

interface WelfareSignal {
  label: string; detail: string; time: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface ResponseAction {
  time: string; action: string; actor: string;
  status: 'done' | 'active' | 'pending'; critical?: boolean;
}

interface GuestScenario {
  guest: GuestData; touchpoints: Touchpoint[]; messages: AppMessage[];
  guestSees: string[]; welbxDoing: string[];
  outcome: { label: string; value: string; color?: string }[];
  mandateText: string; welcomeLine: string;
  notificationLabel: string; notificationBody: string;
}

interface EscalationScenario {
  guest: GuestData; signals: WelfareSignal[]; response: ResponseAction[];
  bxosConfidence: number; protocolLevel: string; protocolColor: string;
  signalOnset: string; escalationTitle: string; escalationSub: string;
  messages: AppMessage[];
  guestSees: string[]; hotelDoing: string[];
  mandateText: string;
}

// ─── NORMAL SCENARIOS ─────────────────────────────────────────────────────────

const RETURNING: GuestScenario = {
  guest: {
    name: "Mr. J. Hartley", firstName: "James", tier: "DIAMOND", tierColor: "#c9a84c",
    stayCount: "14 stays", origin: "New York, USA", room: "847", roomType: "Superior Suite",
    floor: "14th Floor", ltv: "$42,000", ltvLabel: "Confirmed LTV", arrival: "Today, 14:42",
    departure: "Tomorrow, 11:00", preferences: ["High floor", "Champagne on arrival", "Late checkout", "No housekeeping during stay"],
    bxosMode: "HISTORY MODE", bxosModeDetail: "14-stay preference record active",
  },
  touchpoints: [
    { time: 'T−48h', label: 'Pre-Arrival Personalisation', channel: 'Email', guestExperience: '"Mr. Hartley — your Superior Suite is being prepared exactly as you prefer it."', bxosContext: 'BXOS pulled 14-stay preference record. Communication personalised with room type, floor preference, and arrival signature.', sentiment: 'positive', status: 'delivered', message: 'Your preferred room, 14 floors above London. Champagne on arrival — as always.' },
    { time: 'T−12h', label: 'Arrival Readiness Check', channel: 'SMS', guestExperience: '"Let us know if anything has changed — your team will be ready."', bxosContext: 'Nexus confirmed no itinerary changes. Front desk pre-briefed. Room 847 assigned and locked.', sentiment: 'positive', status: 'delivered', message: "We're ready for you. Reply if your plans have changed." },
    { time: 'T−18min', label: 'Operational Risk Detected', channel: 'Internal · BXOS', guestExperience: 'Guest is unaware. WELBX is working.', bxosContext: 'M2 surfaced: Room 847 occupied, housekeeping overloaded, queue at 11. Confidence 91%. Response routed in 45 seconds.', sentiment: 'managed', status: 'delivered' },
    { time: 'T+00:00', label: 'Seamless Arrival', channel: 'In-Person', guestExperience: '"The room was ready the moment I arrived. My name was called before I reached the desk."', bxosContext: 'Secondary lane opened. Host pre-positioned. Room 847 released 2 min early. VIP welcome protocol active.', sentiment: 'positive', status: 'delivered', message: 'Welcome back, Mr. Hartley. Room 847 is ready. May I take your bags?' },
    { time: 'T+00:40', label: 'In-Room Welcome Gesture', channel: 'In-Room', guestExperience: '"The champagne was already open. There was a handwritten note."', bxosContext: 'DIAMOND protocol. Preference match: Billecart-Salmon, Blanc de Blancs. Note referenced prior stay.', sentiment: 'positive', status: 'delivered', message: 'Welcome back. Fourteen stays — and we still look forward to each one.' },
    { time: 'T+06h', label: 'Proactive Stay Check', channel: 'App', guestExperience: '"Nothing was wrong — but knowing they asked made a difference."', bxosContext: 'Sentiment index stable. Outreach triggered by BXOS loyalty protocol.', sentiment: 'positive', status: 'delivered', message: "Mr. Hartley — how is your stay so far?" },
    { time: 'T+18h', label: 'Late Checkout Activated', channel: 'App', guestExperience: '"I didn\'t even have to ask. They offered 13:00 checkout unprompted."', bxosContext: 'BXOS trigger: DIAMOND tier + occupancy data. No margin impact.', sentiment: 'positive', status: 'active', message: 'Mr. Hartley — enjoy a 13:00 checkout tomorrow. No need to rush.' },
  ],
  messages: [
    { id: 1, from: 'The Grand Meridian', time: '2 days ago', read: true, preview: 'Your preferred room, 14 floors above London…', body: 'Your preferred room, 14 floors above London. Champagne on arrival — as always.' },
    { id: 2, from: 'Your Arrival Team', time: 'Yesterday, 08:14', read: true, preview: "We're ready for you…", body: "We're ready for you. Your suite is confirmed. Reply here if your arrival plans have changed." },
    { id: 3, from: 'Front Desk', time: 'Today, 14:43', read: true, preview: 'Welcome back, Mr. Hartley…', body: 'Welcome back, Mr. Hartley. Room 847 is ready and waiting.' },
    { id: 4, from: 'The Grand Meridian', time: 'Today, 15:22', read: true, preview: 'Fourteen stays — and we still look forward…', body: 'Welcome back. Fourteen stays — and we still look forward to each one.' },
    { id: 5, from: 'Your Concierge', time: 'Today, 20:45', read: false, preview: "Mr. Hartley — how is your stay so far?", body: "Mr. Hartley — how is your stay so far? We're here if you need anything." },
    { id: 6, from: 'Stay Services', time: 'Today, 21:30', read: false, preview: 'Enjoy a 13:00 checkout…', body: 'Mr. Hartley — enjoy a 13:00 checkout tomorrow. No need to rush.' },
  ],
  guestSees: ['A hotel that knows their name and their preferences', 'Messages that arrive at exactly the right moment', 'A room ready before they need to ask', 'A checkout extension without raising it', 'A champagne flute, already poured'],
  welbxDoing: ['14-stay preference pattern applied', 'Sentiment and timing intelligence', 'Operational routing and room release', 'Loyalty tier and occupancy data trigger', 'DIAMOND protocol execution'],
  outcome: [{ label: 'NPS Score', value: '9 / 10', color: '#10b981' }, { label: 'Return Intent', value: 'HIGH', color: '#10b981' }, { label: 'LTV Delta', value: '+$3,200', color: '#10b981' }, { label: 'Complaint Filed', value: 'None', color: '#10b981' }, { label: 'Recovery Cost', value: '$0', color: '#10b981' }, { label: 'Loyalty Action', value: 'Ambassador upgrade', color: '#c9a84c' }],
  mandateText: "Mr. Hartley never saw the pressure building at 14:32. He experienced a flawless arrival, a glass of champagne, and a hotel that knew his name. The same intelligence that protected $8,000 in operational value created a guest who will return, review, and refer.",
  welcomeLine: "Good evening, James.",
  notificationLabel: 'New from Stay Services',
  notificationBody: "Mr. Hartley — enjoy a 13:00 checkout tomorrow. No need to rush.",
};

const FIRST_TIME: GuestScenario = {
  guest: {
    name: "Ms. P. Chen", firstName: "Priya", tier: "FIRST STAY", tierColor: "#60a5fa",
    stayCount: "1st stay", origin: "Singapore", room: "312", roomType: "Deluxe Double",
    floor: "8th Floor", ltv: "$18,000+", ltvLabel: "Estimated LTV Potential",
    arrival: "Today, 16:15", departure: "Day after tomorrow, 11:00",
    preferences: ["No prior history — BXOS inference mode active"],
    bxosMode: "INFERENCE MODE", bxosModeDetail: "Booking signal + arrival pattern + archetype matching",
  },
  touchpoints: [
    { time: 'T−24h', label: 'First-Stay Welcome', channel: 'Email', guestExperience: '"I didn\'t expect them to already feel prepared for me — I\'d never stayed before."', bxosContext: 'No preference history. Booking channel: Virtuoso (high-value). Archetype: Singapore business-leisure.', sentiment: 'positive', status: 'delivered', message: "Your first stay with us, Ms. Chen. We'd like to get it right." },
    { time: 'T−3h', label: 'Arrival Signal Intelligence', channel: 'SMS', guestExperience: '"They mentioned Singapore. They knew I\'d had a long journey."', bxosContext: 'Flight SQ321 tracked — on schedule, 10h. Long-haul fatigue pattern: room temp pre-set 19°C, blackout curtains lowered.', sentiment: 'positive', status: 'delivered', message: "We know it's been a long journey from Singapore, Ms. Chen. Your room is ready." },
    { time: 'T+00:00', label: 'Discovery Arrival', channel: 'In-Person', guestExperience: '"The welcome was warm without being overwhelming."', bxosContext: 'BXOS briefed host: Singapore origin, 10h flight, no prior stays. Discovery welcome protocol — orient, don\'t assume.', sentiment: 'positive', status: 'delivered', message: "Welcome to The Grand Meridian, Ms. Chen. Let us show you around." },
    { time: 'T+01h', label: 'In-Room Introduction', channel: 'App', guestExperience: '"It felt curated. A short list of recommendations — not overwhelming."', bxosContext: 'Long-haul fatigue protocol: low-demand content. 3 curated options only. No upsell.', sentiment: 'positive', status: 'delivered', message: "Good afternoon, Ms. Chen. A few things we think you might like — when you're ready." },
    { time: 'T+05h', label: 'Dining Recommendation', channel: 'App', guestExperience: '"They recommended a restaurant that was exactly what I wanted."', bxosContext: 'Archetype match: 84% correlation to Singapore business-leisure — high F&B propensity. The Meridian Room surfaced.', sentiment: 'positive', status: 'delivered', message: "The Meridian Room opens at 19:00. Based on your profile, we think you'll enjoy it." },
    { time: 'T+22h', label: 'Spa Discovery', channel: 'App', guestExperience: '"I booked the spa on a whim. It was the best part of the stay."', bxosContext: 'Spa candidate score: 78% based on archetype. Soft discovery trigger — no pressure.', sentiment: 'positive', status: 'delivered', message: "The spa is available this morning, Ms. Chen. No booking needed for first-time guests." },
    { time: 'T+44h', label: 'Loyalty Conversion Moment', channel: 'App', guestExperience: '"I signed up at the airport. First time I\'ve ever done that on a first stay."', bxosContext: 'BXOS optimal conversion window: 72h post-arrival. Loyalty invite personalised with stay summary.', sentiment: 'positive', status: 'active', message: "We'd love to have you back, Ms. Chen. Join our programme." },
  ],
  messages: [
    { id: 1, from: 'The Grand Meridian', time: 'Yesterday, 09:00', read: true, preview: "Your first stay with us, Ms. Chen…", body: "Your first stay with us, Ms. Chen. We'd like to get it right." },
    { id: 2, from: 'Your Arrival Team', time: 'Today, 13:10', read: true, preview: "We know it's been a long journey…", body: "We know it's been a long journey from Singapore. Your room is ready." },
    { id: 3, from: 'Front Desk', time: 'Today, 16:18', read: true, preview: 'Welcome to The Grand Meridian…', body: "Welcome to The Grand Meridian, Ms. Chen. Room 312 is ready." },
    { id: 4, from: 'The Grand Meridian', time: 'Today, 17:20', read: true, preview: 'A few things we think you might like…', body: "A few things we think you might enjoy — when you're ready. No rush." },
    { id: 5, from: 'The Meridian Room', time: 'Today, 18:45', read: false, preview: 'The Meridian Room opens at 19:00…', body: "The Meridian Room opens at 19:00. We've held a table if you'd like it." },
    { id: 6, from: 'Loyalty Programme', time: 'Today, 21:00', read: false, preview: "We'd love to have you back…", body: "We'd love to have you back, Ms. Chen. Join our programme and your next stay earns complimentary late checkout." },
  ],
  guestSees: ['A hotel that anticipated their needs without any history', 'A welcome that felt personal despite being a first visit', 'Recommendations that matched their taste precisely', 'A spa discovered at exactly the right moment', 'A loyalty invitation that actually felt worth accepting'],
  welbxDoing: ['Booking channel inference (Virtuoso = high-value signal)', 'Long-haul arrival pattern → fatigue protocol applied', 'Market archetype matching (Singapore business-leisure)', 'Optimal conversion window timing (loyalty invite)', 'First impression engineering — no history, full intelligence'],
  outcome: [{ label: 'NPS Score', value: '8 / 10', color: '#10b981' }, { label: 'Return Intent', value: 'HIGH', color: '#10b981' }, { label: 'Loyalty', value: 'ENROLLED', color: '#60a5fa' }, { label: 'Complaint Filed', value: 'None', color: '#10b981' }, { label: 'Recovery Cost', value: '$0', color: '#10b981' }, { label: 'LTV Potential', value: '$18,000+', color: '#c9a84c' }],
  mandateText: "Ms. Chen had no preference history. BXOS had four data points. From those, it inferred: business-leisure traveler, long-haul fatigue, high F&B propensity, spa candidate. The first stay is the most commercially important moment. It either converts a one-time booker into a lifetime relationship — or loses them forever.",
  welcomeLine: "Welcome to The Grand Meridian, Priya.",
  notificationLabel: 'Loyalty Programme',
  notificationBody: "We'd love to have you back. Join our programme — your next stay is already waiting.",
};

// ─── WELFARE ALERT SCENARIO ───────────────────────────────────────────────────

const WELFARE: EscalationScenario = {
  guest: {
    name: "Dr. A. Morrison", firstName: "Alex", tier: "GOLD", tierColor: "#f59e0b",
    stayCount: "3 stays", origin: "Edinburgh, UK", room: "624", roomType: "Business Double",
    floor: "8th Floor", ltv: "$8,400", ltvLabel: "Confirmed LTV",
    arrival: "3 days ago", departure: "Tomorrow, 11:00",
    preferences: ["Corner room", "Quiet floor", "No turn-down service"],
    bxosMode: "WELFARE MODE", bxosModeDetail: "Stress and withdrawal signals — Level 1 Protocol",
  },
  bxosConfidence: 73,
  protocolLevel: "LEVEL 1 · WELFARE ALERT",
  protocolColor: "#f59e0b",
  signalOnset: "18h 43m ago",
  escalationTitle: "Stress & Withdrawal Detected",
  escalationSub: "Guest showing behavioral withdrawal signals across 7 monitored dimensions. Discreet welfare protocol initiated.",
  signals: [
    { label: 'Room service declined', detail: '× 3 consecutive', time: 'Past 18 hours', severity: 'high' },
    { label: 'Housekeeping declined', detail: '3 days running', time: 'Consecutive days', severity: 'medium' },
    { label: 'App activity', detail: 'Inactive — 31 hours', time: '31h 14m', severity: 'high' },
    { label: 'Restaurant visits', detail: 'Zero', time: 'Since Day 1 breakfast', severity: 'medium' },
    { label: 'Room climate', detail: '15°C · Blackout curtains', time: 'Active now', severity: 'low' },
    { label: 'Outbound calls', detail: 'None recorded', time: '24 hour window', severity: 'medium' },
    { label: 'Departure', detail: 'Tomorrow · No check-out query', time: 'Check-out in 19h', severity: 'low' },
  ],
  response: [
    { time: '14:32', action: 'BXOS welfare signal confirmed — confidence 73%', actor: 'BXOS', status: 'done' },
    { time: '14:32', action: 'General Manager notified', actor: 'NEXUS → GM', status: 'done' },
    { time: '14:33', action: 'Welfare note placed under door · Room 624', actor: 'Night Manager', status: 'done' },
    { time: '14:35', action: 'In-app wellness check sent — non-intrusive framing', actor: 'VECTOR', status: 'done' },
    { time: '14:38', action: 'Complimentary meal and room service offered (no charge)', actor: 'F&B Team', status: 'done' },
    { time: '14:40', action: 'Night manager briefed — available on standby', actor: 'Front Desk', status: 'done' },
    { time: '15:00', action: 'Physical welfare check scheduled — quiet knock protocol', actor: 'Duty Manager', status: 'active' },
    { time: 'Ongoing', action: 'Continuous monitoring: app, room service, door sensor', actor: 'BXOS', status: 'active' },
  ],
  messages: [
    { id: 1, from: 'The Grand Meridian', time: 'Today, 14:35', read: false, preview: "Dr. Morrison — we just wanted to check in…", body: "Dr. Morrison — we noticed you haven't ordered anything today. We just wanted to make sure you have everything you need. There's no obligation to engage — we're simply here if you need us." },
    { id: 2, from: 'In-Room Dining', time: 'Today, 14:38', read: false, preview: "A complimentary meal — whenever you're ready…", body: "We've arranged a complimentary meal for you, available whenever you'd like it. No need to call — simply reply here and we'll send it up within 20 minutes. No charge." },
    { id: 3, from: 'Concierge', time: '2 days ago, 12:00', read: true, preview: "Welcome, Dr. Morrison — Day 1…", body: "Welcome, Dr. Morrison. We hope the conference went well. Your room is ready and the evening menu is available. Let us know if you need anything." },
  ],
  guestSees: [
    'A quiet, non-intrusive check-in from the hotel',
    'A complimentary meal offered without any pressure',
    'A note under the door — warm, no alarm',
    'No obligation to engage — just knowing care is there',
    'Space respected while safety is prioritised',
  ],
  hotelDoing: [
    'BXOS behavioral pattern analysis across 7 signals',
    'Non-intrusive welfare protocol — discreet at every step',
    'GM and night manager on standby — no direct intervention yet',
    'Monitoring door sensor and app activity passively',
    'Escalation to Level 2 if no engagement within 4 hours',
  ],
  mandateText: "Dr. Morrison did not signal distress directly. BXOS detected it through behavioral absence — no food ordered, no calls made, no services engaged, temperature set to cold, curtains closed. The hotel's role is not to intrude but to be present. A note under the door. A complimentary meal with no strings. A quiet knock scheduled at 15:00. If the guest is simply resting and prefers privacy, nothing changes. If they are struggling, they know the hotel has noticed — and is there.",
};

// ─── CRISIS PROTOCOL SCENARIO ─────────────────────────────────────────────────

const CRISIS: EscalationScenario = {
  guest: {
    name: "Mr. R. Nakamura", firstName: "Ryo", tier: "PLATINUM", tierColor: "#e2e8f0",
    stayCount: "7 stays", origin: "Tokyo, Japan", room: "1247", roomType: "Executive Suite",
    floor: "12th Floor", ltv: "$31,000", ltvLabel: "Confirmed LTV",
    arrival: "4 days ago", departure: "In 2 days, 11:00",
    preferences: ["High floor", "Pillow menu on file", "Japanese green tea"],
    bxosMode: "CRISIS MODE", bxosModeDetail: "Multiple critical welfare signals — immediate intervention",
  },
  bxosConfidence: 94,
  protocolLevel: "LEVEL 4 · CRISIS PROTOCOL",
  protocolColor: "#ef4444",
  signalOnset: "4h 12m ago",
  escalationTitle: "Crisis Intervention Required",
  escalationSub: "Multiple critical welfare signals detected. Level 4 protocol active. GM, security, and medical on immediate deployment.",
  signals: [
    { label: 'Do Not Disturb — active', detail: '22h continuous', time: '22h 17m', severity: 'critical' },
    { label: 'Front desk inquiry', detail: '"Permanent baggage storage" requested', time: '4h 12m ago', severity: 'critical' },
    { label: 'Missed welfare calls', detail: '8 unanswered — from reception', time: 'Past 2 hours', severity: 'critical' },
    { label: 'Room service declined', detail: '× 5 — all meals refused', time: '4 day pattern', severity: 'critical' },
    { label: 'Emergency contact', detail: 'Not filed at check-in', time: 'Day 0', severity: 'high' },
    { label: 'App interaction', detail: 'Zero — 96 hours', time: '4 days', severity: 'critical' },
    { label: 'Alcohol consumption', detail: 'Elevated pattern via minibar', time: 'Past 48 hours', severity: 'high' },
  ],
  response: [
    { time: '20:14', action: 'BXOS crisis protocol activated — confidence 94%', actor: 'BXOS', status: 'done', critical: true },
    { time: '20:14', action: 'General Manager notified — attending immediately', actor: 'BXOS → GM', status: 'done', critical: true },
    { time: '20:15', action: 'Duty Manager deployed to Floor 12 — Room 1247', actor: 'Operations', status: 'done', critical: true },
    { time: '20:15', action: 'Security positioned outside Room 1247 — standby', actor: 'Security', status: 'done', critical: true },
    { time: '20:16', action: 'Medical team placed on immediate call', actor: 'Medical', status: 'done', critical: false },
    { time: '20:16', action: 'Mental health liaison contacted — Samaritans partnership', actor: 'Welfare', status: 'done', critical: false },
    { time: '20:17', action: 'All guest calls redirected to General Manager', actor: 'Front Desk', status: 'done', critical: false },
    { time: '20:19', action: 'Welfare knock protocol initiated — GM + Security', actor: 'GM + Security', status: 'active', critical: true },
    { time: 'Pending', action: 'Emergency contact being located — Tokyo consulate', actor: 'Front Desk', status: 'pending', critical: false },
    { time: 'Pending', action: 'Post-intervention care plan + family notification', actor: 'Medical + Welfare', status: 'pending', critical: false },
  ],
  messages: [
    { id: 1, from: 'The Grand Meridian', time: 'Today, 18:00', read: false, preview: "Mr. Nakamura — we haven't heard from you…", body: "Mr. Nakamura — we haven't heard from you today and wanted to check you have everything you need. Please don't hesitate to call us at any time." },
    { id: 2, from: 'Front Desk', time: 'Today, 18:45', read: false, preview: "We tried calling — please do ring us…", body: "We tried calling, Mr. Nakamura. Please do ring us when you're able — we just want to make sure you're well." },
    { id: 3, from: 'Your Concierge', time: 'Today, 19:30', read: false, preview: "Mr. Nakamura — we are here if you need anything…", body: "Mr. Nakamura — we're here whenever you need us. Day or night. Please open your door when you're ready, or call reception on any room phone." },
    { id: 4, from: 'General Manager', time: 'Today, 20:10', read: false, preview: "This is the General Manager — please reach out…", body: "Mr. Nakamura, this is the General Manager personally. We care about your wellbeing. Please respond to this message or open the door — our team is outside and we simply want to know you are safe." },
    { id: 5, from: 'General Manager', time: 'Today, 20:19', read: false, preview: "We are outside your room, Mr. Nakamura…", body: "Mr. Nakamura — we are outside your door. We will knock gently. You are safe. We are here." },
  ],
  guestSees: [
    'A series of escalating messages — missed, unopened',
    'A general manager who personally reached out',
    'A hotel that has not given up after 8 attempts',
    'A knock at the door — quiet, not alarming',
    'A team that will stay until they know he is safe',
  ],
  hotelDoing: [
    'BXOS 7-signal crisis pattern confirmed at 94% confidence',
    'Level 4 protocol — full deployment cascade in 5 minutes',
    'GM, duty manager, security, medical, mental health liaison all active',
    'Welfare knock underway — trained staff, not security-first',
    'Post-intervention: medical evaluation, family contact, care plan',
  ],
  mandateText: "Mr. Nakamura had been a guest seven times. BXOS detected a critical pattern shift across all monitored dimensions — and what made it a crisis was not any single signal but their convergence. The hotel's role in this moment is not operational. It is human. Level 4 protocol exists because great hospitality includes duty of care — and WELBX is the system that ensures that duty is never missed.",
};

// ─── SEVERITY CONFIG ──────────────────────────────────────────────────────────

const SEVERITY = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', dot: '#ef4444' },
  high:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)', dot: '#f59e0b' },
  medium:   { color: '#c9a84c', bg: 'rgba(201,168,76,0.06)', border: 'rgba(201,168,76,0.16)', dot: '#c9a84c' },
  low:      { color: 'hsl(215 16% 48%)', bg: 'transparent', border: 'hsl(220 13% 13%)', dot: 'hsl(215 16% 36%)' },
};

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

// ─── MARKETPLACE DATA ─────────────────────────────────────────────────────────

type MarketplaceCategory = 'Dining' | 'Spa' | 'Key' | 'Service' | 'Transport' | 'Concierge';

interface MarketplaceItem {
  id: string;
  name: string;
  subtitle: string;
  detail: string;
  badge?: string;
  badgeColor?: string;
  action: string;
  highlight?: boolean;
}

const MARKETPLACE: Record<MarketplaceCategory, { title: string; icon: string; items: MarketplaceItem[] }> = {
  Dining: {
    title: 'Dining & Restaurants',
    icon: '🍽',
    items: [
      { id: 'd1', name: 'The Meridian Room', subtitle: 'Modern European · Signature dining', detail: 'Open 19:00 — 23:00 · Table availability', badge: 'BXOS MATCH', badgeColor: '#c9a84c', action: 'Reserve Table' },
      { id: 'd2', name: 'The Atrium Bar & Lounge', subtitle: 'Cocktails & light bites', detail: 'Open now · Walk-in welcome', action: 'View Menu' },
      { id: 'd3', name: 'In-Room Dining', subtitle: '24-hour service', detail: 'Full menu · 20-minute delivery', action: 'Order Now' },
      { id: 'd4', name: 'The Garden Terrace', subtitle: 'Breakfast & brunch', detail: 'Daily 07:00 — 11:30', action: 'Book Breakfast' },
    ],
  },
  Spa: {
    title: 'Spa & Wellness',
    icon: '🧖',
    items: [
      { id: 's1', name: 'Signature Meridian Ritual', subtitle: '90 min · Full body & face', detail: 'Next available: 10:00 tomorrow', badge: 'RECOMMENDED', badgeColor: '#10b981', action: 'Book Treatment' },
      { id: 's2', name: 'Deep Tissue Massage', subtitle: '60 min · Therapeutic', detail: 'Next available: 14:30 today', action: 'Book Treatment' },
      { id: 's3', name: 'Thermal Suite Access', subtitle: 'Pool, sauna & steam', detail: 'Open 07:00 — 21:00 · Complimentary for suite guests', action: 'Reserve Access' },
      { id: 's4', name: 'Facial & Skin Treatment', subtitle: '45 min · Luxury products', detail: 'Next available: 11:00 tomorrow', action: 'Book Treatment' },
    ],
  },
  Key: {
    title: 'Room Key & Access',
    icon: '🔑',
    items: [
      { id: 'k1', name: 'Digital Room Key', subtitle: 'Tap to unlock with phone', detail: 'Active · Room 847', action: 'View Key' },
      { id: 'k2', name: 'Request Physical Key', subtitle: 'Card key from front desk', detail: 'Collection from lobby', action: 'Request' },
    ],
  },
  Service: {
    title: 'Guest Services',
    icon: '🛎',
    items: [
      { id: 'sv0', name: 'Late Checkout', subtitle: 'Extended departure · No charge', detail: 'DIAMOND benefit · Checkout until 13:00', badge: 'ACTIVATED', badgeColor: '#c9a84c', action: 'View Confirmation' },
      { id: 'sv1', name: 'Housekeeping', subtitle: 'Room servicing', detail: 'Schedule or request now', action: 'Schedule' },
      { id: 'sv2', name: 'Luggage Assistance', subtitle: 'Storage & delivery', detail: 'Available on request', action: 'Request' },
      { id: 'sv3', name: 'Laundry & Pressing', subtitle: 'Same-day service available', detail: 'Collection before 09:00', action: 'Request' },
    ],
  },
  Transport: {
    title: 'Transport & Transfers',
    icon: '🚗',
    items: [
      { id: 't1', name: 'Airport Transfer', subtitle: 'Private chauffeur service', detail: 'Book 24h in advance', action: 'Book Now' },
      { id: 't2', name: 'City Chauffeur', subtitle: 'On-demand car service', detail: 'Available within 15 minutes', action: 'Book Now' },
      { id: 't3', name: 'Coming Soon', subtitle: 'More transport options arriving', detail: 'Rail, rental & tours', action: 'Notify Me' },
    ],
  },
  Concierge: {
    title: 'Concierge',
    icon: '💬',
    items: [
      { id: 'c1', name: 'Chat with Concierge', subtitle: 'Available 24 hours', detail: 'Immediate response', action: 'Start Chat' },
      { id: 'c2', name: 'Recommendations', subtitle: 'Personalised for your stay', detail: 'Dining, culture, experiences', action: 'Explore' },
      { id: 'c3', name: 'Reservations & Tickets', subtitle: 'Events, restaurants, theatre', detail: 'WELBX-assisted booking', action: 'Request' },
    ],
  },
};

// Per-guest highlighted items
const GUEST_HIGHLIGHTS: Record<'returning' | 'first-time', Partial<Record<MarketplaceCategory, string>>> = {
  'returning': {
    Dining: 'd3',
    Spa: 's2',
    Service: 'sv0',
  },
  'first-time': {
    Dining: 'd1',
    Spa: 's1',
  },
};

function MarketplaceScreen({
  category,
  guestType,
  accentColor,
  guest,
  onBack,
}: {
  category: MarketplaceCategory;
  guestType: GuestType;
  accentColor: string;
  guest: GuestData;
  onBack: () => void;
}) {
  const [booked, setBooked] = useState<string | null>(null);
  const isFirst = guestType === 'first-time';
  const baseData = MARKETPLACE[category];
  const highlightId = GUEST_HIGHLIGHTS[isFirst ? 'first-time' : 'returning']?.[category];

  // Patch guest-contextual details into items
  const data = {
    ...baseData,
    items: baseData.items.map(item => {
      if (item.id === 'k1') return { ...item, detail: `Active · Room ${guest.room}` };
      if (item.id === 'sv0') return {
        ...item,
        subtitle: `Extended departure · No charge`,
        detail: `${guest.tier} benefit · Checkout until 13:00`,
        badge: isFirst ? undefined : 'ACTIVATED',
        badgeColor: isFirst ? undefined : '#c9a84c',
      };
      return item;
    }).filter(item => item.id !== 'sv0' || !isFirst),
  };

  return (
    <motion.div key="marketplace" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.18 }}
      style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid hsl(220 13% 9%)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: 13, padding: 0, lineHeight: 1 }}>‹</button>
        <span style={{ fontSize: 9, marginRight: 3 }}>{data.icon}</span>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>{data.title}</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.items.map((item) => {
          const isHighlighted = item.id === highlightId || item.highlight;
          const isBooked = booked === item.id;
          return (
            <div key={item.id} style={{
              background: isHighlighted ? `${accentColor}0d` : 'hsl(220 13% 9%)',
              border: `1px solid ${isHighlighted ? `${accentColor}28` : 'hsl(220 13% 13%)'}`,
              borderRadius: 7, padding: '9px 10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: isHighlighted ? '#fff' : 'hsl(215 16% 72%)', marginBottom: 1 }}>{item.name}</div>
                  <div style={{ fontSize: 8, color: 'hsl(215 16% 40%)', marginBottom: 2 }}>{item.subtitle}</div>
                  <div style={{ fontSize: 7.5, color: 'hsl(215 16% 32%)', lineHeight: 1.35 }}>{item.detail}</div>
                </div>
                {(item.badge) && (
                  <div style={{ padding: '1.5px 5px', background: `${item.badgeColor ?? accentColor}15`, border: `1px solid ${item.badgeColor ?? accentColor}30`, borderRadius: 3, marginLeft: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 5.5, fontWeight: 700, letterSpacing: '0.08em', color: item.badgeColor ?? accentColor }}>{item.badge}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setBooked(isBooked ? null : item.id)}
                style={{
                  marginTop: 5, width: '100%', padding: '5px 8px',
                  background: isBooked ? `${accentColor}20` : isHighlighted ? `${accentColor}18` : 'hsl(220 13% 12%)',
                  border: `1px solid ${isBooked ? accentColor : isHighlighted ? `${accentColor}40` : 'hsl(220 13% 16%)'}`,
                  borderRadius: 4, cursor: 'pointer',
                  fontSize: 7.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: isBooked ? accentColor : isHighlighted ? accentColor : 'hsl(215 16% 46%)',
                  transition: 'all 0.15s',
                }}>
                {isBooked ? '✓ Confirmed' : item.action}
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── BXOS SUGGESTION DATA ─────────────────────────────────────────────────────

interface BxosSuggestion {
  label: string;
  headline: string;
  sub: string;
  category: MarketplaceCategory;
  accentColor: string;
}

const SUGGESTIONS: Record<'returning' | 'first-time', BxosSuggestion> = {
  'returning': {
    label: 'BXOS · Late Checkout Ready',
    headline: '13:00 Checkout Confirmed',
    sub: 'Activated for Mr. Hartley — no request needed.',
    category: 'Service',
    accentColor: '#c9a84c',
  },
  'first-time': {
    label: 'BXOS · Dining Match · 84%',
    headline: 'The Meridian Room at 19:00',
    sub: 'Held for you — matched to your profile.',
    category: 'Dining',
    accentColor: '#60a5fa',
  },
};

// ─── PHONE MOCKUP ─────────────────────────────────────────────────────────────

function PhoneMockup({ scenario, guestType, messages, welcomeLine, notifLabel, notifBody }: {
  scenario?: GuestScenario; guestType: GuestType;
  messages: AppMessage[]; welcomeLine: string; notifLabel: string; notifBody: string;
}) {
  const [screen, setScreen] = useState<'home' | 'messages' | 'marketplace' | 'room'>('home');
  const [marketplaceCategory, setMarketplaceCategory] = useState<MarketplaceCategory | null>(null);
  const [openMsg, setOpenMsg] = useState<number | null>(null);
  const isFirst = guestType === 'first-time';
  const isWelfare = guestType === 'welfare';
  const isCrisis = guestType === 'crisis';
  const unread = messages.filter(m => !m.read).length;

  const guest = scenario?.guest ?? (isWelfare ? WELFARE.guest : CRISIS.guest);
  const tierColor = guest.tierColor;

  const accentColor = isCrisis ? '#ef4444' : isWelfare ? '#f59e0b' : isFirst ? '#60a5fa' : '#10b981';
  const suggestion = SUGGESTIONS[isFirst ? 'first-time' : 'returning'];

  function openMarketplace(cat: MarketplaceCategory) {
    setMarketplaceCategory(cat);
    setScreen('marketplace');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ textAlign: 'center' }}>
        <div className="label-caps mb-0.5" style={{ color: 'hsl(215 16% 22%)' }}>The Grand Meridian · Guest App</div>
        <div style={{ fontSize: 8.5, color: 'hsl(215 16% 18%)', letterSpacing: '0.05em' }}>
          {isCrisis ? 'CRISIS PROTOCOL ACTIVE · Guest not responding' : isWelfare ? 'WELFARE MODE · Monitoring active' : 'WELBX intelligence embedded · invisible to guest'}
        </div>
      </div>

      <div style={{
        width: 270, height: 548, borderRadius: 32,
        background: isCrisis ? 'hsl(0 10% 5%)' : 'hsl(220 13% 5.5%)',
        border: `7px solid ${isCrisis ? 'hsl(0 10% 12%)' : isWelfare ? 'hsl(38 20% 12%)' : 'hsl(220 13% 12%)'}`,
        boxShadow: `0 0 0 1px hsl(220 13% 8%), 0 24px 56px rgba(0,0,0,0.55)${isCrisis ? ', 0 0 40px rgba(239,68,68,0.08)' : ''}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Status bar */}
        <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', flexShrink: 0, background: isCrisis ? 'rgba(239,68,68,0.06)' : 'transparent' }}>
          <span style={{ fontSize: 8.5, fontWeight: 700, color: isCrisis ? '#ef4444' : 'hsl(215 16% 40%)', fontFamily: 'var(--app-font-mono)' }}>
            {isCrisis ? 'SOS' : new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div style={{ width: 52, height: 11, background: 'hsl(220 13% 9%)', borderRadius: 5 }} />
          <div style={{ width: 9, height: 6, border: `1.5px solid ${isCrisis ? 'rgba(239,68,68,0.5)' : 'hsl(215 16% 38%)'}`, borderRadius: 1.5, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: '1px', background: isCrisis ? '#ef4444' : '#10b981', borderRadius: 0.5, width: isCrisis ? '20%' : '80%' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">

            {screen === 'room' && (
              <motion.div key="room" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.18 }}
                style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid hsl(220 13% 9%)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>🔑 My Room</div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ background: 'hsl(220 13% 9%)', border: '1px solid hsl(220 13% 13%)', borderRadius: 7, padding: '12px 12px' }}>
                    <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 6 }}>Room Details</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{guest.room}</div>
                    <div style={{ fontSize: 9, color: 'hsl(215 16% 40%)', marginTop: 3 }}>{guest.roomType} · {guest.floor}</div>
                  </div>
                  <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 7, padding: '11px 12px' }}>
                    <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 6 }}>Digital Key</div>
                    <div style={{ fontSize: 9.5, color: '#fff', marginBottom: 2 }}>Tap to unlock Room {guest.room}</div>
                    <div style={{ fontSize: 8, color: 'hsl(215 16% 38%)' }}>Key active · Valid until {guest.departure}</div>
                    <div style={{ marginTop: 8, padding: '6px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 5, textAlign: 'center' }}>
                      <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.1em', color: '#c9a84c', textTransform: 'uppercase' }}>🔓 Unlock Room</span>
                    </div>
                  </div>
                  <div style={{ background: 'hsl(220 13% 9%)', border: '1px solid hsl(220 13% 13%)', borderRadius: 7, padding: '10px 12px' }}>
                    <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(215 16% 30%)', marginBottom: 5 }}>Stay Info</div>
                    {[
                      { label: 'Check-in', value: guest.arrival },
                      { label: 'Check-out', value: guest.departure },
                      { label: 'Guest tier', value: guest.tier },
                    ].map((row, i, arr) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < arr.length - 1 ? '1px solid hsl(220 13% 11%)' : 'none' }}>
                        <span style={{ fontSize: 8, color: 'hsl(215 16% 32%)', fontWeight: 600 }}>{row.label}</span>
                        <span style={{ fontSize: 8.5, color: 'hsl(215 16% 60%)', fontWeight: 600 }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {screen === 'marketplace' && marketplaceCategory && (
              <MarketplaceScreen
                category={marketplaceCategory}
                guestType={guestType}
                accentColor={accentColor}
                guest={guest}
                onBack={() => { setScreen('home'); setMarketplaceCategory(null); }}
              />
            )}

            {screen === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{ padding: '10px 14px 7px', borderBottom: `1px solid ${isCrisis ? 'rgba(239,68,68,0.15)' : 'hsl(220 13% 9%)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 1 }}>The Grand Meridian</div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: isCrisis ? 'hsl(215 16% 55%)' : '#fff' }}>{welcomeLine}</div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: isCrisis ? 'rgba(239,68,68,0.1)' : 'hsl(220 13% 10%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                      {isCrisis ? '⚠' : '🔔'}
                    </div>
                    {unread > 0 && (
                      <div style={{ position: 'absolute', top: -2, right: -2, width: 11, height: 11, borderRadius: '50%', background: isCrisis ? '#ef4444' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 6, color: '#fff', fontWeight: 700 }}>{unread}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Crisis inactive overlay */}
                {isCrisis && (
                  <div style={{ margin: '10px 12px 4px', padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 7 }}>
                    <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#ef4444', marginBottom: 3 }}>App inactive — 96 hours</div>
                    <div style={{ fontSize: 9.5, color: 'hsl(215 16% 45%)', lineHeight: 1.4 }}>Mr. Nakamura has not opened the app. All messages unread. Hotel is initiating physical welfare knock.</div>
                  </div>
                )}

                {/* Room card */}
                <div style={{ margin: `${isCrisis ? '6px' : '10px'} 12px 8px`, background: `linear-gradient(135deg, hsl(220 13% 9%) 0%, hsl(220 13% ${isCrisis ? '10' : '12'}%) 100%)`, borderRadius: 10, padding: '12px 14px', border: `1px solid ${isCrisis ? 'rgba(239,68,68,0.12)' : 'hsl(220 13% 14%)'}`, opacity: isCrisis ? 0.5 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 3 }}>Your Room</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: isCrisis ? 'hsl(215 16% 40%)' : '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{guest.room}</div>
                      <div style={{ fontSize: 8, color: 'hsl(215 16% 38%)', marginTop: 2 }}>{guest.roomType}</div>
                    </div>
                    <div style={{ padding: '2px 6px', background: `${tierColor}18`, border: `1px solid ${tierColor}28`, borderRadius: 3 }}>
                      <span style={{ fontSize: 6, fontWeight: 700, letterSpacing: '0.1em', color: tierColor, textTransform: 'uppercase' }}>{guest.tier}</span>
                    </div>
                  </div>
                </div>

                {/* Notification or welfare message */}
                <div style={{ margin: '0 12px 8px', background: `${isCrisis ? 'rgba(239,68,68,0.06)' : isWelfare ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)'}`, border: `1px solid ${isCrisis ? 'rgba(239,68,68,0.18)' : isWelfare ? 'rgba(245,158,11,0.18)' : 'rgba(16,185,129,0.15)'}`, borderRadius: 7, padding: '8px 10px' }}>
                  <div style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accentColor, marginBottom: 3 }}>{notifLabel}</div>
                  <div style={{ fontSize: 9.5, color: isCrisis ? 'hsl(215 16% 38%)' : 'hsl(215 16% 62%)', lineHeight: 1.45 }}>{notifBody}</div>
                  {!isCrisis && (
                    <button onClick={() => setScreen('messages')} style={{ marginTop: 5, fontSize: 7.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                      View all messages →
                    </button>
                  )}
                </div>

                {/* Welfare-specific */}
                {isWelfare && (
                  <div style={{ margin: '0 12px 8px', padding: '8px 10px', background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', borderRadius: 6 }}>
                    <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(215 16% 28%)', marginBottom: 4 }}>Hotel Monitoring</div>
                    <div style={{ fontSize: 9, color: 'hsl(215 16% 36%)', lineHeight: 1.5 }}>App inactive 31h · Room service declined · Welfare protocol active</div>
                  </div>
                )}

                {!isCrisis && !isWelfare && (
                  <>
                    {/* BXOS Suggestion Card */}
                    <div
                      onClick={() => openMarketplace(suggestion.category)}
                      style={{
                        margin: '0 12px 8px',
                        padding: '9px 10px',
                        background: `${suggestion.accentColor}08`,
                        border: `1px solid ${suggestion.accentColor}30`,
                        borderRadius: 7,
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2.5, background: suggestion.accentColor, borderRadius: '0 1px 1px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <div style={{ fontSize: 5.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: suggestion.accentColor }}>{suggestion.label}</div>
                        <div style={{ width: 3.5, height: 3.5, borderRadius: '50%', background: suggestion.accentColor }} className="animate-pulse" />
                      </div>
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: '#fff', marginBottom: 1.5 }}>{suggestion.headline}</div>
                      <div style={{ fontSize: 8, color: 'hsl(215 16% 46%)', lineHeight: 1.4 }}>{suggestion.sub}</div>
                      <div style={{ marginTop: 5, fontSize: 7, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: suggestion.accentColor }}>View Details →</div>
                    </div>

                    {/* Quick Access */}
                    <div style={{ margin: '0 12px 8px' }}>
                      <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(215 16% 24%)', marginBottom: 5 }}>Quick Access</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
                        {(['🍽 Dining', '🧖 Spa', '🔑 Key', '🛎 Service', '🚗 Transport', '💬 Concierge'] as const).map((a) => {
                          const spaceIdx = a.indexOf(' ');
                          const icon = a.slice(0, spaceIdx);
                          const label = a.slice(spaceIdx + 1) as MarketplaceCategory;
                          return (
                            <div key={label}
                              onClick={() => openMarketplace(label)}
                              style={{ background: 'hsl(220 13% 9%)', borderRadius: 6, padding: '7px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: '1px solid hsl(220 13% 12%)', cursor: 'pointer', transition: 'background 0.15s' }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'hsl(220 13% 11%)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'hsl(220 13% 9%)')}>
                              <span style={{ fontSize: 11 }}>{icon}</span>
                              <span style={{ fontSize: 6.5, color: 'hsl(215 16% 38%)', fontWeight: 600 }}>{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Crisis emergency button */}
                {isCrisis && (
                  <div style={{ margin: '0 12px 8px', padding: '10px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Emergency Contact</div>
                    <div style={{ fontSize: 8, color: 'hsl(215 16% 36%)' }}>Reception is available 24 hours · Lift phone on any floor</div>
                  </div>
                )}

                <div style={{ margin: '0 12px 8px', padding: '5px 8px', background: 'hsl(220 13% 7%)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 3.5, height: 3.5, borderRadius: '50%', background: isCrisis ? '#ef4444' : isWelfare ? '#f59e0b' : '#10b981' }} className={isCrisis ? 'animate-pulse' : ''} />
                  <span style={{ fontSize: 7, color: 'hsl(215 16% 24%)', letterSpacing: '0.04em' }}>
                    {isCrisis ? 'Crisis protocol active · 20:19' : isWelfare ? 'Welfare monitoring active · App inactive 31h' : `${guest.stayCount} on file · Active monitoring`}
                  </span>
                </div>
              </motion.div>
            )}

            {screen === 'messages' && (
              <motion.div key="msgs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid hsl(220 13% 9%)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => { setScreen('home'); setOpenMsg(null); }} style={{ background: 'transparent', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: 13, padding: 0 }}>‹</button>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>Messages</div>
                  {unread > 0 && <div style={{ marginLeft: 'auto', padding: '1px 5px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7 }}><span style={{ fontSize: 6.5, color: '#ef4444', fontWeight: 700 }}>{unread} unread</span></div>}
                </div>
                {openMsg === null ? (
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {messages.map((msg) => (
                      <div key={msg.id} onClick={() => setOpenMsg(msg.id)}
                        style={{ padding: '8px 12px', borderBottom: '1px solid hsl(220 13% 8.5%)', cursor: 'pointer', background: !msg.read ? 'rgba(201,168,76,0.025)' : 'transparent', display: 'flex', gap: 8 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: !msg.read ? (isCrisis ? '#ef4444' : '#c9a84c') : 'transparent', flexShrink: 0, marginTop: 4 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1.5 }}>
                            <span style={{ fontSize: 8.5, fontWeight: 700, color: !msg.read ? '#fff' : 'hsl(215 16% 44%)' }}>{msg.from}</span>
                            <span style={{ fontSize: 7.5, color: 'hsl(215 16% 24%)', flexShrink: 0 }}>{msg.time.split(', ')[1] || msg.time}</span>
                          </div>
                          <div style={{ fontSize: 9, color: 'hsl(215 16% 36%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.preview}</div>
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
                            <div><div style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{msg.from}</div><div style={{ fontSize: 7.5, color: 'hsl(215 16% 28%)' }}>{msg.time}</div></div>
                          </div>
                          <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
                            <div style={{ background: 'hsl(220 13% 9%)', borderRadius: '0 8px 8px 8px', padding: '8px 10px', maxWidth: '90%' }}>
                              <div style={{ fontSize: 10, color: 'hsl(215 16% 68%)', lineHeight: 1.55 }}>{msg.body}</div>
                            </div>
                          </div>
                          <div style={{ padding: '6px 12px 8px', display: 'flex', gap: 5, flexShrink: 0 }}>
                            {['Reply', 'Call Reception'].map(a => (
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
        <div style={{ height: 46, background: `${isCrisis ? 'hsl(0 10% 6%)' : 'hsl(220 13% 6%)'}`, borderTop: `1px solid ${isCrisis ? 'rgba(239,68,68,0.15)' : 'hsl(220 13% 9%)'}`, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', flexShrink: 0 }}>
          {[{ id: 'home', icon: '⌂', label: 'Home' }, { id: 'messages', icon: '✉', label: 'Messages' }, { id: 'room', icon: '🔑', label: 'Room' }].map(tab => {
            const isActive = screen === tab.id || (tab.id === 'home' && screen === 'marketplace');
            return (
              <button key={tab.id} onClick={() => { setScreen(tab.id as 'home' | 'messages' | 'room'); setOpenMsg(null); setMarketplaceCategory(null); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, position: 'relative' }}>
                <span style={{ fontSize: 12, opacity: isActive ? 1 : 0.28 }}>{tab.icon}</span>
                <span style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isActive ? (isCrisis ? '#ef4444' : '#c9a84c') : 'hsl(215 16% 24%)' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ESCALATION VIEW ──────────────────────────────────────────────────────────

function EscalationView({ scenario, guestType }: { scenario: EscalationScenario; guestType: 'welfare' | 'crisis' }) {
  const [tab, setTab] = useState<'signals' | 'guest'>('signals');
  const [expandedSignal, setExpandedSignal] = useState<number | null>(null);
  const isCrisis = guestType === 'crisis';
  const color = scenario.protocolColor;

  return (
    <div>
      {/* Alert banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 16, padding: '14px 20px', background: `${color}09`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', gap: 14 }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} className="animate-pulse" />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color }}>{scenario.protocolLevel}</span>
            <span style={{ fontSize: 8.5, color: 'hsl(215 16% 32%)', letterSpacing: '0.06em' }}>Signal onset: {scenario.signalOnset}</span>
            <div style={{ marginLeft: 'auto', padding: '2px 10px', background: `${color}14`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.1em' }}>BXOS CONFIDENCE</span>
              <span style={{ fontSize: 14, fontWeight: 800, color, fontFamily: 'var(--app-font-mono)' }}>{scenario.bxosConfidence}%</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'hsl(215 16% 50%)', lineHeight: 1.4 }}>{scenario.escalationSub}</div>
        </div>
      </motion.div>

      {/* Tab toggle */}
      <div style={{ display: 'flex', border: '1px solid hsl(220 13% 14%)', marginBottom: 14, width: 'fit-content' }}>
        {[{ id: 'signals', label: 'Signal Matrix · Response Protocol' }, { id: 'guest', label: 'Guest View' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            style={{ padding: '7px 18px', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: tab === t.id ? `${color}12` : 'transparent', color: tab === t.id ? color : 'hsl(215 16% 36%)', border: 'none', borderRight: t.id === 'signals' ? '1px solid hsl(220 13% 14%)' : 'none', cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* SIGNAL MATRIX + RESPONSE */}
        {tab === 'signals' && (
          <motion.div key="signals" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: '5fr 6fr', gap: 16 }}>

            {/* Left: signal matrix */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Profile */}
              <div style={{ background: 'hsl(220 13% 7%)', border: `1px solid ${color}1a`, padding: '16px 18px' }}>
                <div className="label-caps mb-3">Guest Profile</div>
                {[
                  { label: 'Name', value: scenario.guest.name },
                  { label: 'Tier', value: scenario.guest.tier, color: scenario.guest.tierColor },
                  { label: 'Stays', value: scenario.guest.stayCount },
                  { label: 'Origin', value: scenario.guest.origin },
                  { label: 'Room', value: `${scenario.guest.room} — ${scenario.guest.roomType}` },
                  { label: 'Stay Status', value: `Day ${isCrisis ? '4 of 6' : '3 of 4'}`, color },
                ].map((f, i, arr) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none', gap: 10 }}>
                    <span style={{ fontSize: 8.5, color: 'hsl(215 16% 30%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>{f.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: f.color || 'hsl(215 16% 60%)', textAlign: 'right' }}>{f.value}</span>
                  </div>
                ))}
              </div>

              {/* Signal indicators */}
              <div style={{ border: `1px solid ${color}1a`, background: 'hsl(220 13% 7%)' }}>
                <div style={{ padding: '10px 16px', borderBottom: `1px solid ${color}14`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="label-caps" style={{ color }}>BXOS Signal Matrix</div>
                  <span style={{ fontSize: 8, color: 'hsl(215 16% 28%)', letterSpacing: '0.08em' }}>{scenario.signals.length} signals monitored</span>
                </div>
                {scenario.signals.map((sig, i) => {
                  const sev = SEVERITY[sig.severity];
                  return (
                    <div key={i} style={{ padding: '9px 16px', borderBottom: i < scenario.signals.length - 1 ? `1px solid hsl(220 13% 9%)` : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: sev.dot, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: sig.severity === 'critical' ? '#ef4444' : sig.severity === 'high' ? '#f59e0b' : 'hsl(215 16% 62%)' }}>{sig.label}</div>
                        <div style={{ fontSize: 8.5, color: 'hsl(215 16% 32%)', marginTop: 1 }}>{sig.time}</div>
                      </div>
                      <div style={{ padding: '1px 7px', background: sev.bg, border: `1px solid ${sev.border}`, flexShrink: 0 }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: sev.color, letterSpacing: '0.06em' }}>{sig.detail}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: response cascade */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ border: `1px solid ${color}1a`, background: 'hsl(220 13% 7%)' }}>
                <div style={{ padding: '10px 16px', borderBottom: `1px solid ${color}14`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="label-caps" style={{ color }}>Response Cascade</div>
                  <div style={{ padding: '2px 8px', background: `${color}12`, border: `1px solid ${color}25` }}>
                    <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.12em', color, textTransform: 'uppercase' }}>Active</span>
                  </div>
                </div>
                {scenario.response.map((r, i) => {
                  const statusColor = r.status === 'done' ? '#10b981' : r.status === 'active' ? color : 'hsl(215 16% 30%)';
                  return (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 16px', borderBottom: i < scenario.response.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none', background: r.status === 'active' ? `${color}05` : 'transparent', borderLeft: r.critical ? `2px solid ${color}` : '2px solid transparent' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--app-font-mono)', fontSize: 8.5, color: 'hsl(215 16% 28%)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{r.time}</div>
                        {i < scenario.response.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 8, background: 'hsl(220 13% 11%)' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor, flexShrink: 0 }} className={r.status === 'active' ? 'animate-pulse' : ''} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: r.status === 'active' ? '#fff' : 'hsl(215 16% 58%)' }}>{r.action}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 11 }}>
                          <span style={{ fontSize: 8.5, color: 'hsl(215 16% 32%)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{r.actor}</span>
                          <span style={{ fontSize: 7.5, fontWeight: 700, color: statusColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mandate */}
              <div style={{ padding: '14px 18px', border: '1px solid hsl(220 13% 10%)', background: 'hsl(220 13% 7%)' }}>
                <div className="label-caps mb-2" style={{ color: 'hsl(215 16% 26%)' }}>Duty of Care — WELBX Protocol</div>
                <p style={{ fontSize: 11, color: 'hsl(215 16% 42%)', lineHeight: 1.75 }}>{scenario.mandateText}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* GUEST VIEW */}
        {tab === 'guest' && (
          <motion.div key="guest" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 36, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* What they see vs hotel doing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: '16px 18px', border: '1px solid hsl(220 13% 10%)', background: 'hsl(220 13% 7%)' }}>
                  <div className="label-caps mb-3">What the guest {isCrisis ? 'has received' : 'sees'}</div>
                  {scenario.guestSees.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{ color, marginTop: 2, flexShrink: 0 }}>—</span>
                      <span style={{ color: 'hsl(215 16% 55%)', lineHeight: 1.4 }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px 18px', border: `1px solid ${color}18`, background: `${color}04` }}>
                  <div className="label-caps mb-3" style={{ color }}>Hotel is doing</div>
                  {scenario.hotelDoing.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{ color, marginTop: 2, flexShrink: 0 }}>—</span>
                      <span style={{ color: 'hsl(215 16% 46%)', lineHeight: 1.4 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Context strip */}
              <div style={{ padding: '14px 18px', border: `1px solid ${color}18`, background: `${color}04` }}>
                <div className="label-caps mb-2" style={{ color: 'hsl(215 16% 26%)' }}>{isCrisis ? 'Crisis Response · Escalation Principle' : 'Welfare Response · Escalation Principle'}</div>
                <p style={{ fontSize: 11, color: 'hsl(215 16% 42%)', lineHeight: 1.75 }}>{scenario.mandateText}</p>
              </div>
            </div>

            <PhoneMockup
              guestType={guestType}
              messages={scenario.messages}
              welcomeLine={isCrisis ? "Mr. Nakamura." : "Dr. Morrison."}
              notifLabel={isCrisis ? 'General Manager · Urgent' : 'Just checking in'}
              notifBody={isCrisis ? "We are outside your room. We simply want to know you are safe." : "Dr. Morrison — we noticed you haven't ordered anything today. We're here if you need us."}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function GuestLayer() {
  const [guestType, setGuestType] = useState<GuestType>('returning');
  const [tab, setTab] = useState<'timeline' | 'app'>('app');
  const [selected, setSelected] = useState<number | null>(null);

  const isEscalation = guestType === 'welfare' || guestType === 'crisis';
  const scenario = guestType === 'returning' ? RETURNING : FIRST_TIME;
  const escScenario = guestType === 'welfare' ? WELFARE : CRISIS;
  const isFirst = guestType === 'first-time';
  const activeGuest = isEscalation ? escScenario.guest : scenario.guest;

  const escalationColor = guestType === 'crisis' ? '#ef4444' : '#f59e0b';

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        <header className="mb-5">
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
              <div style={{ padding: '8px 14px', border: isEscalation ? `1px solid ${escalationColor}20` : '1px solid hsl(220 13% 12%)', background: isEscalation ? `${escalationColor}06` : 'hsl(220 13% 7%)', textAlign: 'right' }}>
                <div className="label-caps mb-1" style={{ color: 'hsl(215 16% 26%)' }}>Active Stay</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{activeGuest.name}</div>
                <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', color: activeGuest.tierColor, textTransform: 'uppercase', marginTop: 2 }}>{activeGuest.tier} · {activeGuest.stayCount}</div>
              </div>

              {/* Scenario toggles */}
              <div style={{ display: 'flex', gap: 6 }}>
                {/* Guest type */}
                <div style={{ display: 'flex', border: '1px solid hsl(220 13% 14%)' }}>
                  {[
                    { id: 'returning', label: 'Returning', color: '#c9a84c' },
                    { id: 'first-time', label: 'First Stay', color: '#60a5fa' },
                  ].map((g, i) => (
                    <button key={g.id} onClick={() => { setGuestType(g.id as GuestType); setSelected(null); }}
                      style={{ padding: '6px 12px', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: guestType === g.id ? `${g.color}12` : 'transparent', color: guestType === g.id ? g.color : 'hsl(215 16% 34%)', border: 'none', borderRight: i === 0 ? '1px solid hsl(220 13% 14%)' : 'none', cursor: 'pointer' }}>
                      {g.label}
                    </button>
                  ))}
                </div>

                {/* Escalation */}
                <div style={{ display: 'flex', border: `1px solid ${isEscalation ? `${escalationColor}25` : 'hsl(220 13% 14%)'}` }}>
                  {[
                    { id: 'welfare', label: 'Welfare Alert', color: '#f59e0b' },
                    { id: 'crisis', label: 'Crisis', color: '#ef4444' },
                  ].map((g, i) => (
                    <button key={g.id} onClick={() => { setGuestType(g.id as GuestType); setSelected(null); }}
                      style={{ padding: '6px 12px', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: guestType === g.id ? `${g.color}12` : 'transparent', color: guestType === g.id ? g.color : 'hsl(215 16% 34%)', border: 'none', borderRight: i === 0 ? `1px solid ${isEscalation ? `${escalationColor}25` : 'hsl(220 13% 14%)'}` : 'none', cursor: 'pointer' }}>
                      {g.label}
                    </button>
                  ))}
                </div>

                {/* View toggle — only for non-escalation */}
                {!isEscalation && (
                  <div style={{ display: 'flex', border: '1px solid hsl(220 13% 14%)' }}>
                    <button onClick={() => setTab('app')} style={{ padding: '6px 12px', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: tab === 'app' ? 'rgba(201,168,76,0.08)' : 'transparent', color: tab === 'app' ? '#c9a84c' : 'hsl(215 16% 34%)', border: 'none', borderRight: '1px solid hsl(220 13% 14%)', cursor: 'pointer' }}>Guest App</button>
                    <button onClick={() => setTab('timeline')} style={{ padding: '6px 12px', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: tab === 'timeline' ? 'rgba(201,168,76,0.08)' : 'transparent', color: tab === 'timeline' ? '#c9a84c' : 'hsl(215 16% 34%)', border: 'none', cursor: 'pointer' }}>Engagement</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BXOS mode banners */}
          <AnimatePresence>
            {isFirst && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                style={{ marginTop: 10, padding: '9px 14px', background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#60a5fa', flexShrink: 0 }} className="animate-pulse" />
                <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#60a5fa' }}>BXOS · Inference Mode</span>
                <span style={{ fontSize: 10, color: 'hsl(215 16% 38%)', marginLeft: 4 }}>No preference history. Operating from: booking channel · arrival pattern · market archetype · flight data.</span>
              </motion.div>
            )}
            {guestType === 'welfare' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                style={{ marginTop: 10, padding: '9px 14px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} className="animate-pulse" />
                <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f59e0b' }}>BXOS · Level 1 Welfare Protocol</span>
                <span style={{ fontSize: 10, color: 'hsl(215 16% 38%)', marginLeft: 4 }}>Stress and withdrawal signals detected · Confidence 73% · Discreet response initiated · Monitoring active</span>
              </motion.div>
            )}
            {guestType === 'crisis' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                style={{ marginTop: 10, padding: '9px 14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.28)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} className="animate-pulse" />
                <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ef4444' }}>BXOS · Level 4 Crisis Protocol — Active</span>
                <span style={{ fontSize: 10, color: 'hsl(215 16% 44%)', marginLeft: 4 }}>Multiple critical signals · Confidence 94% · GM · Security · Medical · Welfare Liaison all deployed</span>
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
            {/* ESCALATION VIEWS */}
            {isEscalation && <EscalationView scenario={escScenario} guestType={guestType as 'welfare' | 'crisis'} />}

            {/* GUEST APP VIEW */}
            {!isEscalation && tab === 'app' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 36, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ padding: '16px 18px', border: '1px solid hsl(220 13% 10%)', background: 'hsl(220 13% 7%)' }}>
                      <div className="label-caps mb-3">The guest sees</div>
                      {scenario.guestSees.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, alignItems: 'flex-start', marginBottom: 8 }}>
                          <span style={{ color: '#10b981', marginTop: 2, flexShrink: 0 }}>—</span>
                          <span style={{ color: 'hsl(215 16% 56%)', lineHeight: 1.4 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '16px 18px', border: 'rgba(201,168,76,0.14) 1px solid', background: 'rgba(201,168,76,0.03)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="label-caps" style={{ color: '#c9a84c' }}>WELBX is doing</div>
                        <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.12em', padding: '1px 5px', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', textTransform: 'uppercase' }}>{activeGuest.bxosMode}</span>
                      </div>
                      {scenario.welbxDoing.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, alignItems: 'flex-start', marginBottom: 8 }}>
                          <span style={{ color: '#c9a84c', marginTop: 2, flexShrink: 0 }}>—</span>
                          <span style={{ color: 'hsl(215 16% 46%)', lineHeight: 1.4 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.13)', padding: '16px 18px' }}>
                    <div className="label-caps mb-3" style={{ color: '#10b981' }}>Stay Outcome</div>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                      {scenario.outcome.map((f, i) => (
                        <div key={i}><div className="label-caps mb-1">{f.label}</div><div style={{ fontSize: 13, fontWeight: 700, color: f.color || '#fff' }}>{f.value}</div></div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: '14px 18px' }}>
                    <div className="label-caps mb-2" style={{ color: 'hsl(215 16% 26%)' }}>{isFirst ? 'First Stay — The Highest-Stakes Moment' : 'The Dual Mandate'}</div>
                    <p style={{ fontSize: 11, color: 'hsl(215 16% 42%)', lineHeight: 1.75 }}>{scenario.mandateText}</p>
                  </div>
                </div>
                <PhoneMockup
                  scenario={scenario}
                  guestType={guestType}
                  messages={scenario.messages}
                  welcomeLine={scenario.welcomeLine}
                  notifLabel={scenario.notificationLabel}
                  notifBody={scenario.notificationBody}
                />
              </div>
            )}

            {/* ENGAGEMENT TIMELINE */}
            {!isEscalation && tab === 'timeline' && (
              <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 18 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: 18 }}>
                    <div className="label-caps mb-3">Guest Profile</div>
                    {[
                      { label: 'Name', value: activeGuest.name },
                      { label: 'Tier', value: activeGuest.tier, color: activeGuest.tierColor },
                      { label: 'Stays', value: activeGuest.stayCount },
                      { label: 'Origin', value: activeGuest.origin },
                      { label: 'Room', value: `${activeGuest.room} — ${activeGuest.roomType}` },
                      { label: activeGuest.ltvLabel, value: activeGuest.ltv, color: '#10b981' },
                    ].map((f, i, arr) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none', gap: 10 }}>
                        <span style={{ fontSize: 8.5, color: 'hsl(215 16% 30%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>{f.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: f.color || 'hsl(215 16% 60%)', textAlign: 'right' }}>{f.value}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid hsl(220 13% 9%)' }}>
                      <div className="label-caps mb-2">{isFirst ? 'BXOS Inference Signals' : 'Preferences on File'}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeGuest.preferences.map((p, i) => (
                          <span key={i} style={{ fontSize: 7.5, padding: '2px 6px', fontWeight: 600, letterSpacing: '0.05em', color: isFirst ? '#60a5fa' : 'hsl(215 16% 38%)', border: `1px solid ${isFirst ? 'rgba(96,165,250,0.2)' : 'hsl(220 13% 13%)'}`, background: isFirst ? 'rgba(96,165,250,0.05)' : 'hsl(220 13% 6.5%)' }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.13)', padding: 16 }}>
                    <div className="label-caps mb-3" style={{ color: '#10b981' }}>Outcome</div>
                    {scenario.outcome.map((f, i, arr) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(16,185,129,0.07)' : 'none', gap: 10 }}>
                        <span style={{ fontSize: 8.5, color: 'hsl(215 16% 30%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>{f.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: f.color || '#fff', textAlign: 'right' }}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: '11px 16px', marginBottom: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="label-caps">Engagement Timeline</div>
                    <div style={{ fontSize: 8.5, color: 'hsl(215 16% 26%)' }}>{scenario.touchpoints.length} touchpoints</div>
                  </div>
                  <div style={{ border: '1px solid hsl(220 13% 10%)' }}>
                    {scenario.touchpoints.map((tp, i) => {
                      const isSelected = selected === i;
                      const sentCfg = SENTIMENT_CONFIG[tp.sentiment];
                      const statusCfg = STATUS_CFG[tp.status];
                      const isInternal = tp.sentiment === 'managed';
                      return (
                        <motion.div key={`${guestType}-${i}`} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          onClick={() => setSelected(isSelected ? null : i)}
                          style={{ borderBottom: i < scenario.touchpoints.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none', background: isSelected ? 'hsl(220 13% 8%)' : isInternal ? 'rgba(201,168,76,0.02)' : 'transparent', borderLeft: isSelected ? `2px solid ${sentCfg.dot}` : '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 14px' }}>
                            <div style={{ fontFamily: 'var(--app-font-mono)', fontSize: 8.5, color: 'hsl(215 16% 26%)', letterSpacing: '0.04em', minWidth: 46, flexShrink: 0 }}>{tp.time}</div>
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: sentCfg.dot, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: isInternal ? '#c9a84c' : '#fff' }}>{tp.label}</div>
                              <div style={{ fontSize: 8.5, color: 'hsl(215 16% 28%)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginTop: 1 }}>{tp.channel}</div>
                            </div>
                            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 6px', color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, flexShrink: 0 }}>{tp.status}</div>
                            <div style={{ color: 'hsl(215 16% 26%)', fontSize: 10, transition: 'transform 0.2s', transform: isSelected ? 'rotate(90deg)' : 'none' }}>›</div>
                          </div>
                          {isSelected && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }}
                              style={{ padding: '0 14px 12px', overflow: 'hidden' }}>
                              <div className="grid grid-cols-2 gap-5 pt-3" style={{ borderTop: '1px solid hsl(220 13% 10%)' }}>
                                <div>
                                  <div className="label-caps mb-2" style={{ color: isInternal ? '#c9a84c' : '#10b981' }}>Guest Experience</div>
                                  {tp.message && !isInternal && (
                                    <div style={{ background: 'hsl(220 13% 10%)', border: '1px solid hsl(220 13% 13%)', padding: '6px 10px', marginBottom: 6 }}>
                                      <div style={{ fontSize: 7, color: 'hsl(215 16% 26%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>{tp.channel}</div>
                                      <div style={{ fontSize: 10, color: 'hsl(215 16% 68%)', lineHeight: 1.5, fontStyle: 'italic' }}>"{tp.message}"</div>
                                    </div>
                                  )}
                                  <div style={{ fontSize: 10, color: 'hsl(215 16% 52%)', lineHeight: 1.65 }}>{tp.guestExperience}</div>
                                </div>
                                <div>
                                  <div className="label-caps mb-2" style={{ color: 'hsl(215 16% 24%)' }}>BXOS Context</div>
                                  <div style={{ fontSize: 10, color: 'hsl(215 16% 40%)', lineHeight: 1.65 }}>{tp.bxosContext}</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
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
