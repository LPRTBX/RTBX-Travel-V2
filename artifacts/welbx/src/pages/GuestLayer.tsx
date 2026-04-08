import { useState } from "react";
import { motion } from "framer-motion";

const GUEST = {
  name: "Mr. J. Hartley",
  tier: "DIAMOND",
  stayCount: 14,
  origin: "New York, USA",
  room: "847 — Superior Suite",
  arrival: "Today, 14:42",
  departure: "Tomorrow, 11:00",
  preferences: ["High floor", "Champagne on arrival", "Late checkout", "No housekeeping during stay"],
  ltv: "$42,000",
};

type TouchpointStatus = 'delivered' | 'active' | 'pending';

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

const TOUCHPOINTS: Touchpoint[] = [
  {
    time: 'T−48h',
    label: 'Pre-Arrival Personalisation',
    channel: 'Email',
    guestExperience: '"Mr. Hartley — your Superior Suite is being prepared with your preferences. Champagne will be waiting."',
    bxosContext: 'BXOS pulled 14-stay preference history. Communication personalised with room type, floor preference, and arrival signature.',
    sentiment: 'positive',
    status: 'delivered',
    message: 'Your preferred room, 14 floors above London. Champagne on arrival — as always.',
  },
  {
    time: 'T−12h',
    label: 'Arrival Readiness Check',
    channel: 'SMS',
    guestExperience: '"Arriving tomorrow? Let us know if anything has changed — your team will be ready."',
    bxosContext: 'Nexus confirmed no itinerary changes. Front desk pre-briefed on DIAMOND arrival. Room 847 assigned and locked.',
    sentiment: 'positive',
    status: 'delivered',
    message: 'We\'re ready for you. Reply if your plans have changed.',
  },
  {
    time: 'T−18min',
    label: 'Operational Risk Detected',
    channel: 'Internal · BXOS',
    guestExperience: 'Guest is unaware. WELBX is working.',
    bxosContext: 'M2 surfaced: Room 847 occupied, housekeeping overloaded, queue at 11. Confidence 91%. Response routed in 45 seconds.',
    sentiment: 'managed',
    status: 'delivered',
    message: undefined,
  },
  {
    time: 'T+00:00',
    label: 'Seamless Arrival',
    channel: 'In-Person',
    guestExperience: '"The room was ready the moment I arrived. No queue, no wait. My name was called before I reached the desk."',
    bxosContext: 'Secondary lane opened. Host pre-positioned. Room 847 released 2 min early. VIP welcome protocol active.',
    sentiment: 'positive',
    status: 'delivered',
    message: 'Welcome back, Mr. Hartley. Room 847 is ready. May I take your bags?',
  },
  {
    time: 'T+00:40',
    label: 'In-Room Welcome Gesture',
    channel: 'In-Room',
    guestExperience: '"The champagne was already open. There was a handwritten note. It felt like they genuinely knew me."',
    bxosContext: 'DIAMOND protocol executed. Preference match: Billecart-Salmon, Blanc de Blancs. Note referenced prior stay.',
    sentiment: 'positive',
    status: 'delivered',
    message: 'Welcome back. Fourteen stays — and we still look forward to each one.',
  },
  {
    time: 'T+06h',
    label: 'Proactive Stay Check',
    channel: 'SMS',
    guestExperience: '"Just checking in. Nothing was wrong — but knowing they asked made a difference."',
    bxosContext: 'Sentiment index stable. No service signals. Outreach triggered by BXOS loyalty protocol — not reactive.',
    sentiment: 'positive',
    status: 'delivered',
    message: 'Mr. Hartley — how is your stay so far? We\'re here if you need anything.',
  },
  {
    time: 'T+18h',
    label: 'Late Checkout Activated',
    channel: 'App / SMS',
    guestExperience: '"I didn\'t even have to ask. They offered 13:00 checkout without me raising it."',
    bxosContext: 'BXOS triggered late-checkout offer based on DIAMOND tier + occupancy data. No margin impact. Loyalty signal captured.',
    sentiment: 'positive',
    status: 'active',
    message: 'Mr. Hartley — enjoy a 13:00 checkout tomorrow. No need to rush.',
  },
];

const OUTCOME = {
  nps: 9,
  returnIntent: 'HIGH',
  ltv_delta: '+$3,200',
  complaint: false,
  reviewLikelihood: 'Positive — 4.9 expected',
  loyaltyAction: 'Ambassador upgrade flagged',
};

const SENTIMENT_CONFIG = {
  positive: { color: '#10b981', label: 'Positive', dot: '#10b981' },
  neutral:  { color: 'hsl(215 16% 48%)', label: 'Neutral', dot: 'hsl(215 16% 40%)' },
  managed:  { color: '#c9a84c', label: 'Managed', dot: '#c9a84c' },
};

const STATUS_CONFIG: Record<TouchpointStatus, { color: string; bg: string; border: string }> = {
  delivered: { color: '#10b981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)' },
  active:    { color: '#c9a84c', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.22)' },
  pending:   { color: 'hsl(215 16% 35%)', bg: 'transparent', border: 'hsl(220 13% 14%)' },
};

export default function GuestLayer() {
  const [selected, setSelected] = useState<number | null>(3);

  const active = selected !== null ? TOUCHPOINTS[selected] : null;

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <header className="mb-7">
          <div className="flex items-start justify-between">
            <div>
              <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>BXOS · Guest Intelligence</div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Guest Layer</h1>
              <p className="text-xs mt-1.5" style={{ color: 'hsl(215 16% 40%)', letterSpacing: '0.01em', maxWidth: 520 }}>
                WELBX operates a dual mandate — optimising hotel performance while engineering the guest's lived experience. This is the guest side of the same moment.
              </p>
            </div>
            <div style={{ flexShrink: 0, padding: '10px 16px', border: '1px solid hsl(220 13% 12%)', background: 'hsl(220 13% 7%)', textAlign: 'right' }}>
              <div className="label-caps mb-1" style={{ color: 'hsl(215 16% 28%)' }}>Active Stay</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{GUEST.name}</div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: '#c9a84c', textTransform: 'uppercase', marginTop: 2 }}>{GUEST.tier} · {GUEST.stayCount} stays</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-5">

          {/* Left: guest profile + outcome */}
          <div className="col-span-4 flex flex-col gap-4">

            {/* Profile card */}
            <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: 20 }}>
              <div className="label-caps mb-4">Guest Profile</div>
              <div className="space-y-0">
                {[
                  { label: 'Name',       value: GUEST.name },
                  { label: 'Tier',       value: GUEST.tier,      color: '#c9a84c' },
                  { label: 'Stays',      value: `${GUEST.stayCount} at The Grand Meridian` },
                  { label: 'Origin',     value: GUEST.origin },
                  { label: 'Room',       value: GUEST.room },
                  { label: 'LTV',        value: GUEST.ltv,       color: '#10b981' },
                  { label: 'Arrival',    value: GUEST.arrival },
                  { label: 'Departure',  value: GUEST.departure },
                ].map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    padding: '7px 0', borderBottom: i < 7 ? '1px solid hsl(220 13% 9%)' : 'none',
                  }}>
                    <span style={{ fontSize: 9, color: 'hsl(215 16% 34%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{f.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: f.color || 'hsl(215 16% 65%)', textAlign: 'right', maxWidth: 160 }}>{f.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid hsl(220 13% 9%)' }}>
                <div className="label-caps mb-2">Preferences on File</div>
                <div className="flex flex-wrap gap-1.5">
                  {GUEST.preferences.map((p, i) => (
                    <span key={i} style={{
                      fontSize: 8, padding: '3px 7px', fontWeight: 600, letterSpacing: '0.06em',
                      color: 'hsl(215 16% 42%)', border: '1px solid hsl(220 13% 13%)', background: 'hsl(220 13% 6.5%)',
                    }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Outcome card */}
            <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', padding: 20 }}>
              <div className="label-caps mb-4" style={{ color: '#10b981' }}>Stay Outcome Forecast</div>
              <div className="space-y-0">
                {[
                  { label: 'NPS Score',        value: `${OUTCOME.nps} / 10`, color: '#10b981' },
                  { label: 'Return Intent',    value: OUTCOME.returnIntent,  color: '#10b981' },
                  { label: 'LTV Delta',        value: OUTCOME.ltv_delta,     color: '#10b981' },
                  { label: 'Complaint Filed',  value: 'None',                color: '#10b981' },
                  { label: 'Review Signal',    value: OUTCOME.reviewLikelihood },
                  { label: 'Loyalty Action',   value: OUTCOME.loyaltyAction, color: '#c9a84c' },
                ].map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '7px 0', borderBottom: i < 5 ? '1px solid rgba(16,185,129,0.07)' : 'none',
                    gap: 12,
                  }}>
                    <span style={{ fontSize: 9, color: 'hsl(215 16% 34%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>{f.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: f.color || 'hsl(215 16% 60%)', textAlign: 'right' }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dual mandate callout */}
            <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', padding: 18 }}>
              <div className="label-caps mb-2" style={{ color: 'rgba(201,168,76,0.6)' }}>The Dual Mandate</div>
              <p style={{ fontSize: 11, color: 'hsl(215 16% 44%)', lineHeight: 1.7 }}>
                Every operational intervention in the hotel layer produces a corresponding guest experience outcome. Mr. Hartley never saw the pressure building at 14:32. He experienced a flawless arrival, a glass of champagne, and a hotel that knew his name. WELBX engineers both realities simultaneously.
              </p>
            </div>
          </div>

          {/* Right: engagement timeline */}
          <div className="col-span-8 flex flex-col gap-0">
            <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: '16px 20px', marginBottom: 3 }}>
              <div className="flex items-center justify-between">
                <div className="label-caps">Guest Engagement Timeline — Current Stay</div>
                <div style={{ fontSize: 9, color: 'hsl(215 16% 30%)', letterSpacing: '0.08em' }}>7 touchpoints · 18h span</div>
              </div>
            </div>

            <div className="flex flex-col gap-0" style={{ border: '1px solid hsl(220 13% 10%)' }}>
              {TOUCHPOINTS.map((tp, i) => {
                const isSelected = selected === i;
                const sentCfg = SENTIMENT_CONFIG[tp.sentiment];
                const statusCfg = STATUS_CONFIG[tp.status];
                const isInternal = tp.sentiment === 'managed';

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => setSelected(isSelected ? null : i)}
                    style={{
                      borderBottom: i < TOUCHPOINTS.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none',
                      background: isSelected ? 'hsl(220 13% 8%)' : isInternal ? 'rgba(201,168,76,0.02)' : 'transparent',
                      borderLeft: isSelected ? `2px solid ${sentCfg.dot}` : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {/* Collapsed row */}
                    <div className="flex items-center gap-4 px-5 py-3.5">
                      {/* Time */}
                      <div style={{ fontFamily: 'var(--app-font-mono)', fontSize: 10, color: 'hsl(215 16% 32%)', letterSpacing: '0.06em', minWidth: 48, flexShrink: 0 }}>
                        {tp.time}
                      </div>

                      {/* Sentiment dot */}
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: sentCfg.dot, flexShrink: 0 }} />

                      {/* Label + channel */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: isInternal ? '#c9a84c' : '#fff', letterSpacing: '0.005em' }}>{tp.label}</div>
                        <div style={{ fontSize: 9, color: 'hsl(215 16% 33%)', letterSpacing: '0.08em', marginTop: 1, textTransform: 'uppercase', fontWeight: 600 }}>
                          {tp.channel}{isInternal ? ' — Operational only' : ''}
                        </div>
                      </div>

                      {/* Status badge */}
                      <div style={{
                        fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '2px 7px', color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}`,
                        flexShrink: 0,
                      }}>
                        {tp.status}
                      </div>

                      {/* Expand indicator */}
                      <div style={{
                        width: 14, height: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'hsl(215 16% 30%)', fontSize: 10, transition: 'transform 0.2s',
                        transform: isSelected ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}>
                        ›
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ padding: '0 20px 18px 20px', overflow: 'hidden' }}
                      >
                        <div className="grid grid-cols-2 gap-5 pt-3" style={{ borderTop: '1px solid hsl(220 13% 10%)' }}>

                          {/* Guest experience */}
                          <div>
                            <div className="label-caps mb-2" style={{ color: isInternal ? '#c9a84c' : '#10b981' }}>
                              {isInternal ? 'Operational Action' : 'Guest Experience'}
                            </div>
                            {tp.message && !isInternal ? (
                              <div style={{
                                background: 'hsl(220 13% 10%)',
                                border: '1px solid hsl(220 13% 13%)',
                                borderRadius: 2,
                                padding: '10px 14px',
                                marginBottom: 10,
                              }}>
                                <div style={{ fontSize: 9, color: 'hsl(215 16% 32%)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>
                                  {tp.channel} · The Grand Meridian
                                </div>
                                <div style={{ fontSize: 12, color: 'hsl(215 16% 75%)', lineHeight: 1.5, fontStyle: 'italic' }}>
                                  "{tp.message}"
                                </div>
                              </div>
                            ) : null}
                            <div style={{ fontSize: 11, color: 'hsl(215 16% 55%)', lineHeight: 1.65 }}>
                              {tp.guestExperience}
                            </div>
                          </div>

                          {/* BXOS context */}
                          <div>
                            <div className="label-caps mb-2" style={{ color: 'hsl(215 16% 28%)' }}>BXOS Context</div>
                            <div style={{ fontSize: 11, color: 'hsl(215 16% 44%)', lineHeight: 1.65 }}>
                              {tp.bxosContext}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Engagement summary strip */}
            <div className="grid grid-cols-4 mt-3" style={{ border: '1px solid hsl(220 13% 10%)', background: 'hsl(220 13% 7%)' }}>
              {[
                { label: 'Touchpoints Delivered', value: '6', color: '#fff' },
                { label: 'Proactive (not reactive)', value: '5 of 6', color: '#10b981' },
                { label: 'Guest Sentiment', value: 'Positive', color: '#10b981' },
                { label: 'Recovery Required', value: 'None', color: '#10b981' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: '14px 18px',
                  borderRight: i < 3 ? '1px solid hsl(220 13% 10%)' : 'none',
                }}>
                  <div className="label-caps mb-1.5">{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: s.color, letterSpacing: '-0.01em' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
