import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GUEST = {
  name: "Mr. J. Hartley",
  firstName: "James",
  tier: "DIAMOND",
  stayCount: 14,
  origin: "New York, USA",
  room: "847",
  roomType: "Superior Suite",
  floor: "14th Floor",
  ltv: "$42,000",
  arrival: "Today, 14:42",
  departure: "Tomorrow, 11:00",
  preferences: ["High floor", "Champagne on arrival", "Late checkout", "No housekeeping during stay"],
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
    time: 'T−48h', label: 'Pre-Arrival Personalisation', channel: 'Email',
    guestExperience: '"Mr. Hartley — your Superior Suite is being prepared with your preferences. Champagne will be waiting."',
    bxosContext: 'BXOS pulled 14-stay preference history. Communication personalised with room type, floor preference, and arrival signature.',
    sentiment: 'positive', status: 'delivered',
    message: 'Your preferred room, 14 floors above London. Champagne on arrival — as always.',
  },
  {
    time: 'T−12h', label: 'Arrival Readiness Check', channel: 'SMS',
    guestExperience: '"Arriving tomorrow? Let us know if anything has changed — your team will be ready."',
    bxosContext: 'Nexus confirmed no itinerary changes. Front desk pre-briefed on DIAMOND arrival. Room 847 assigned and locked.',
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
    guestExperience: '"Just checking in. Nothing was wrong — but knowing they asked made a difference."',
    bxosContext: 'Sentiment index stable. No service signals. Outreach triggered by BXOS loyalty protocol — not reactive.',
    sentiment: 'positive', status: 'delivered',
    message: "Mr. Hartley — how is your stay so far? We're here if you need anything.",
  },
  {
    time: 'T+18h', label: 'Late Checkout Activated', channel: 'App',
    guestExperience: '"I didn\'t even have to ask. They offered 13:00 checkout without me raising it."',
    bxosContext: 'BXOS triggered late-checkout offer based on DIAMOND tier + occupancy data. No margin impact. Loyalty signal captured.',
    sentiment: 'positive', status: 'active',
    message: 'Mr. Hartley — enjoy a 13:00 checkout tomorrow. No need to rush.',
  },
];

const APP_MESSAGES = [
  {
    id: 1, from: 'The Grand Meridian', time: '2 days ago', read: true,
    preview: 'Your preferred room, 14 floors above London…',
    body: 'Your preferred room, 14 floors above London. Champagne on arrival — as always. We look forward to welcoming you tomorrow.',
    type: 'notification',
  },
  {
    id: 2, from: 'Your Arrival Team', time: 'Yesterday, 08:14', read: true,
    preview: "We're ready for you. Reply if your plans…",
    body: "We're ready for you. Your suite is confirmed. Reply here if your arrival plans have changed.",
    type: 'message',
  },
  {
    id: 3, from: 'Front Desk', time: 'Today, 14:43', read: true,
    preview: 'Welcome back, Mr. Hartley. Room 847 is ready…',
    body: 'Welcome back, Mr. Hartley. Room 847 is ready and waiting. Your bags have been sent up. We hope the journey was smooth.',
    type: 'message',
  },
  {
    id: 4, from: 'The Grand Meridian', time: 'Today, 15:22', read: true,
    preview: 'Fourteen stays — and we still look forward…',
    body: 'Welcome back. Fourteen stays — and we still look forward to each one. Champagne is chilled. The view is yours.',
    type: 'notification',
  },
  {
    id: 5, from: 'Your Concierge', time: 'Today, 20:45', read: false,
    preview: "Mr. Hartley — how is your stay so far?",
    body: "Mr. Hartley — how is your stay so far? We're here if you need anything at all. Don't hesitate to message directly.",
    type: 'message',
  },
  {
    id: 6, from: 'Stay Services', time: 'Today, 21:30', read: false,
    preview: 'Mr. Hartley — enjoy a 13:00 checkout tomorrow…',
    body: 'Mr. Hartley — as a thank you for your loyalty, enjoy a 13:00 checkout tomorrow. No need to rush. We hope you sleep well.',
    type: 'offer',
  },
];

const SENTIMENT_CONFIG = {
  positive: { color: '#10b981', dot: '#10b981' },
  neutral:  { color: 'hsl(215 16% 48%)', dot: 'hsl(215 16% 40%)' },
  managed:  { color: '#c9a84c', dot: '#c9a84c' },
};

const STATUS_CONFIG: Record<TouchpointStatus, { color: string; bg: string; border: string }> = {
  delivered: { color: '#10b981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)' },
  active:    { color: '#c9a84c', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.22)' },
  pending:   { color: 'hsl(215 16% 35%)', bg: 'transparent', border: 'hsl(220 13% 14%)' },
};

function PhoneMockup() {
  const [activeScreen, setActiveScreen] = useState<'home' | 'messages' | 'room'>('home');
  const [openMsg, setOpenMsg] = useState<number | null>(null);
  const unread = APP_MESSAGES.filter(m => !m.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Context label */}
      <div style={{ textAlign: 'center' }}>
        <div className="label-caps mb-1" style={{ color: 'hsl(215 16% 26%)' }}>The Grand Meridian · Guest App</div>
        <div style={{ fontSize: 10, color: 'hsl(215 16% 22%)', letterSpacing: '0.06em' }}>WELBX intelligence embedded · invisible to guest</div>
      </div>

      {/* Phone frame */}
      <div style={{
        width: 280,
        height: 560,
        borderRadius: 36,
        background: 'hsl(220 13% 6%)',
        border: '7px solid hsl(220 13% 13%)',
        boxShadow: '0 0 0 1px hsl(220 13% 8%), 0 32px 64px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Notch */}
        <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'hsl(215 16% 45%)', fontFamily: 'var(--app-font-mono)', letterSpacing: '0.04em' }}>
            {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div style={{ width: 60, height: 14, background: 'hsl(220 13% 10%)', borderRadius: 8 }} />
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div style={{ width: 10, height: 7, border: '1.5px solid hsl(215 16% 40%)', borderRadius: 1.5, display: 'flex', alignItems: 'center', padding: '0 1.5px' }}>
              <div style={{ flex: 0.8, height: '100%', background: '#10b981', borderRadius: 0.5 }} />
            </div>
          </div>
        </div>

        {/* App content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'hsl(220 13% 5.5%)' }}>
          <AnimatePresence mode="wait">

            {/* HOME screen */}
            {activeScreen === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
              >
                {/* App header */}
                <div style={{ padding: '12px 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid hsl(220 13% 9%)' }}>
                  <div>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 1 }}>The Grand Meridian</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Good evening, James.</div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'hsl(220 13% 10%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: 12, color: 'hsl(215 16% 45%)' }}>🔔</div>
                    </div>
                    {unread > 0 && (
                      <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 6, color: '#fff', fontWeight: 700 }}>{unread}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Room hero card */}
                <div style={{ margin: '12px 14px', background: 'linear-gradient(135deg, hsl(220 13% 9%) 0%, hsl(220 13% 12%) 100%)', borderRadius: 12, padding: '14px 16px', border: '1px solid hsl(220 13% 14%)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 4 }}>Your Room</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{GUEST.room}</div>
                      <div style={{ fontSize: 9, color: 'hsl(215 16% 45%)', marginTop: 3 }}>{GUEST.roomType} · {GUEST.floor}</div>
                    </div>
                    <div style={{ padding: '3px 8px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 4 }}>
                      <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.1em', color: '#c9a84c', textTransform: 'uppercase' }}>{GUEST.tier}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { label: 'Check-in', value: '14:42' },
                      { label: 'Check-out', value: '13:00' },
                    ].map((f, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '6px 8px' }}>
                        <div style={{ fontSize: 7, color: 'hsl(215 16% 36%)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 2 }}>{f.label}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'var(--app-font-mono)' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest message */}
                <div style={{ margin: '0 14px 10px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#10b981', marginBottom: 4 }}>New from Stay Services</div>
                  <div style={{ fontSize: 10, color: 'hsl(215 16% 65%)', lineHeight: 1.5 }}>
                    Mr. Hartley — enjoy a 13:00 checkout tomorrow. No need to rush.
                  </div>
                  <button
                    onClick={() => setActiveScreen('messages')}
                    style={{ marginTop: 8, fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#10b981', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    View all messages →
                  </button>
                </div>

                {/* Quick actions */}
                <div style={{ margin: '0 14px', marginBottom: 8 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'hsl(215 16% 30%)', marginBottom: 8 }}>Quick Access</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                    {[
                      { icon: '🍽', label: 'Dining' },
                      { icon: '🧖', label: 'Spa' },
                      { icon: '🔑', label: 'Key' },
                      { icon: '🛎', label: 'Service' },
                      { icon: '🚗', label: 'Transport' },
                      { icon: '💬', label: 'Concierge' },
                    ].map((a, i) => (
                      <div key={i} style={{
                        background: 'hsl(220 13% 9%)', borderRadius: 8, padding: '8px 6px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                        border: '1px solid hsl(220 13% 12%)', cursor: 'pointer',
                      }}>
                        <span style={{ fontSize: 14 }}>{a.icon}</span>
                        <span style={{ fontSize: 7.5, color: 'hsl(215 16% 42%)', fontWeight: 600, letterSpacing: '0.06em' }}>{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WELBX invisible attribution */}
                <div style={{ margin: '8px 14px 10px', padding: '7px 10px', background: 'hsl(220 13% 7%)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: 8, color: 'hsl(215 16% 28%)', letterSpacing: '0.06em' }}>Your stay is being looked after · 14 stays on file</span>
                </div>
              </motion.div>
            )}

            {/* MESSAGES screen */}
            {activeScreen === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ padding: '12px 18px 8px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid hsl(220 13% 9%)', flexShrink: 0 }}>
                  <button onClick={() => { setActiveScreen('home'); setOpenMsg(null); }} style={{ background: 'transparent', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: 13, padding: 0 }}>‹</button>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Messages</div>
                  {unread > 0 && (
                    <div style={{ marginLeft: 'auto', padding: '1px 6px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8 }}>
                      <span style={{ fontSize: 7, color: '#ef4444', fontWeight: 700 }}>{unread} unread</span>
                    </div>
                  )}
                </div>

                {openMsg === null ? (
                  // Message list
                  <div style={{ flex: 1 }}>
                    {APP_MESSAGES.map((msg, i) => (
                      <div
                        key={msg.id}
                        onClick={() => setOpenMsg(msg.id)}
                        style={{
                          padding: '10px 14px',
                          borderBottom: '1px solid hsl(220 13% 8.5%)',
                          cursor: 'pointer',
                          background: !msg.read ? 'rgba(201,168,76,0.03)' : 'transparent',
                          display: 'flex', gap: 10, alignItems: 'flex-start',
                        }}
                      >
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: !msg.read ? '#c9a84c' : 'transparent', flexShrink: 0, marginTop: 4 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, color: !msg.read ? '#fff' : 'hsl(215 16% 50%)', letterSpacing: '0.02em' }}>{msg.from}</span>
                            <span style={{ fontSize: 8, color: 'hsl(215 16% 28%)', flexShrink: 0 }}>{msg.time}</span>
                          </div>
                          <div style={{ fontSize: 10, color: 'hsl(215 16% 40%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {msg.preview}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Open message
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                  >
                    {(() => {
                      const msg = APP_MESSAGES.find(m => m.id === openMsg)!;
                      return (
                        <>
                          <div style={{ padding: '10px 14px', borderBottom: '1px solid hsl(220 13% 9%)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button onClick={() => setOpenMsg(null)} style={{ background: 'transparent', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: 13, padding: 0 }}>‹</button>
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{msg.from}</div>
                              <div style={{ fontSize: 8, color: 'hsl(215 16% 32%)' }}>{msg.time}</div>
                            </div>
                          </div>
                          <div style={{ flex: 1, padding: '16px 14px' }}>
                            <div style={{ background: 'hsl(220 13% 9%)', borderRadius: '0 10px 10px 10px', padding: '10px 12px', maxWidth: '85%' }}>
                              <div style={{ fontSize: 11, color: 'hsl(215 16% 72%)', lineHeight: 1.55 }}>{msg.body}</div>
                            </div>
                          </div>
                          <div style={{ padding: '8px 14px 10px', display: 'flex', gap: 6 }}>
                            {['Reply', 'Request Service'].map(a => (
                              <div key={a} style={{ flex: 1, padding: '6px', background: 'hsl(220 13% 9%)', border: '1px solid hsl(220 13% 13%)', borderRadius: 6, textAlign: 'center', cursor: 'pointer' }}>
                                <span style={{ fontSize: 8, color: 'hsl(215 16% 42%)', fontWeight: 700 }}>{a}</span>
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
        <div style={{
          height: 52, background: 'hsl(220 13% 6%)', borderTop: '1px solid hsl(220 13% 9%)',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', flexShrink: 0,
        }}>
          {[
            { id: 'home', icon: '⌂', label: 'Home' },
            { id: 'messages', icon: '✉', label: 'Messages' },
            { id: 'room', icon: '🔑', label: 'Room' },
          ].map(tab => {
            const isActive = activeScreen === (tab.id as any);
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveScreen(tab.id as any); setOpenMsg(null); }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                }}
              >
                <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.35 }}>{tab.icon}</span>
                <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isActive ? '#c9a84c' : 'hsl(215 16% 28%)' }}>{tab.label}</span>
                {isActive && <div style={{ width: 16, height: 1.5, background: '#c9a84c', borderRadius: 1, position: 'absolute', bottom: 8 }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* WELBX layer label */}
      <div style={{ textAlign: 'center', maxWidth: 280 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 6 }}>
          <div style={{ flex: 1, height: 1, background: 'hsl(220 13% 9%)' }} />
          <span style={{ fontSize: 8, letterSpacing: '0.16em', color: 'hsl(215 16% 22%)', textTransform: 'uppercase', fontWeight: 700 }}>WELBX layer</span>
          <div style={{ flex: 1, height: 1, background: 'hsl(220 13% 9%)' }} />
        </div>
        <p style={{ fontSize: 9, color: 'hsl(215 16% 24%)', lineHeight: 1.6, letterSpacing: '0.02em' }}>
          Every message, gesture, and moment of delight in this app is triggered by the intelligence layer. The guest sees a great hotel. The hotel sees WELBX.
        </p>
      </div>
    </div>
  );
}

export default function GuestLayer() {
  const [tab, setTab] = useState<'timeline' | 'app'>('app');
  const [selected, setSelected] = useState<number | null>(3);

  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-6xl">

        {/* Header */}
        <header className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="label-caps mb-2" style={{ color: '#c9a84c' }}>BXOS · Guest Intelligence</div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Guest Layer</h1>
              <p className="text-xs mt-1.5" style={{ color: 'hsl(215 16% 40%)', letterSpacing: '0.01em', maxWidth: 500 }}>
                WELBX operates a dual mandate — optimising hotel performance while engineering the guest's lived experience.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <div style={{ padding: '10px 16px', border: '1px solid hsl(220 13% 12%)', background: 'hsl(220 13% 7%)', textAlign: 'right' }}>
                <div className="label-caps mb-1" style={{ color: 'hsl(215 16% 28%)' }}>Active Stay</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{GUEST.name}</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: '#c9a84c', textTransform: 'uppercase', marginTop: 2 }}>{GUEST.tier} · {GUEST.stayCount} stays</div>
              </div>
              {/* Tab toggle */}
              <div style={{ display: 'flex', border: '1px solid hsl(220 13% 14%)' }}>
                <button
                  onClick={() => setTab('app')}
                  style={{
                    padding: '7px 16px', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: tab === 'app' ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: tab === 'app' ? '#c9a84c' : 'hsl(215 16% 38%)',
                    border: 'none', borderRight: '1px solid hsl(220 13% 14%)', cursor: 'pointer',
                  }}
                >
                  Guest App
                </button>
                <button
                  onClick={() => setTab('timeline')}
                  style={{
                    padding: '7px 16px', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: tab === 'timeline' ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: tab === 'timeline' ? '#c9a84c' : 'hsl(215 16% 38%)',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  Engagement View
                </button>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {/* GUEST APP VIEW */}
          {tab === 'app' && (
            <motion.div
              key="app"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}
            >
              {/* Left: context panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* What the guest sees vs what WELBX sees */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ padding: '18px 20px', border: '1px solid hsl(220 13% 10%)', background: 'hsl(220 13% 7%)' }}>
                    <div className="label-caps mb-3">The guest sees</div>
                    <div className="space-y-2">
                      {[
                        'A hotel that knows their name',
                        'Messages that arrive at exactly the right moment',
                        'A room ready before they need to ask',
                        'A checkout extension without raising it',
                        'A champagne flute, already poured',
                      ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, alignItems: 'flex-start' }}>
                          <span style={{ color: '#10b981', marginTop: 1, flexShrink: 0 }}>—</span>
                          <span style={{ color: 'hsl(215 16% 60%)', lineHeight: 1.4 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '18px 20px', border: '1px solid rgba(201,168,76,0.14)', background: 'rgba(201,168,76,0.03)' }}>
                    <div className="label-caps mb-3" style={{ color: '#c9a84c' }}>WELBX is doing</div>
                    <div className="space-y-2">
                      {[
                        '14-stay preference pattern applied',
                        'Sentiment + timing intelligence',
                        'Operational routing + room release',
                        'Loyalty tier + occupancy data trigger',
                        'DIAMOND protocol execution',
                      ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, alignItems: 'flex-start' }}>
                          <span style={{ color: '#c9a84c', marginTop: 1, flexShrink: 0 }}>—</span>
                          <span style={{ color: 'hsl(215 16% 50%)', lineHeight: 1.4 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stay outcome */}
                <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.14)', padding: '18px 20px' }}>
                  <div className="label-caps mb-3" style={{ color: '#10b981' }}>Stay Outcome Forecast</div>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-3">
                    {[
                      { label: 'NPS Score', value: '9 / 10', color: '#10b981' },
                      { label: 'Return Intent', value: 'HIGH', color: '#10b981' },
                      { label: 'LTV Delta', value: '+$3,200', color: '#10b981' },
                      { label: 'Complaint Filed', value: 'None', color: '#10b981' },
                      { label: 'Recovery Cost', value: '$0', color: '#10b981' },
                      { label: 'Loyalty Action', value: 'Ambassador', color: '#c9a84c' },
                    ].map((f, i) => (
                      <div key={i}>
                        <div className="label-caps mb-1">{f.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: f.color }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dual mandate statement */}
                <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: '16px 20px' }}>
                  <div className="label-caps mb-2" style={{ color: 'hsl(215 16% 28%)' }}>The Dual Mandate</div>
                  <p style={{ fontSize: 11, color: 'hsl(215 16% 44%)', lineHeight: 1.75 }}>
                    Mr. Hartley never saw the pressure building at 14:32. He experienced a flawless arrival, a glass of champagne, and a hotel that knew his name. The same intelligence that protected $8,000 in operational value created a guest who will return, review, and refer. WELBX engineers both outcomes simultaneously — from a single operating layer.
                  </p>
                </div>
              </div>

              {/* Right: phone */}
              <PhoneMockup />
            </motion.div>
          )}

          {/* ENGAGEMENT TIMELINE VIEW */}
          {tab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 20 }}
            >
              {/* Left col */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Profile */}
                <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: 20 }}>
                  <div className="label-caps mb-4">Guest Profile</div>
                  {[
                    { label: 'Name', value: GUEST.name },
                    { label: 'Tier', value: GUEST.tier, color: '#c9a84c' },
                    { label: 'Stays', value: `${GUEST.stayCount} at The Grand Meridian` },
                    { label: 'Origin', value: GUEST.origin },
                    { label: 'Room', value: GUEST.room },
                    { label: 'LTV', value: GUEST.ltv, color: '#10b981' },
                    { label: 'Arrival', value: GUEST.arrival },
                    { label: 'Departure', value: GUEST.departure },
                  ].map((f, i, arr) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none' }}>
                      <span style={{ fontSize: 9, color: 'hsl(215 16% 34%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{f.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: f.color || 'hsl(215 16% 65%)' }}>{f.value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid hsl(220 13% 9%)' }}>
                    <div className="label-caps mb-2">Preferences on File</div>
                    <div className="flex flex-wrap gap-1.5">
                      {GUEST.preferences.map((p, i) => (
                        <span key={i} style={{ fontSize: 8, padding: '3px 7px', fontWeight: 600, letterSpacing: '0.06em', color: 'hsl(215 16% 42%)', border: '1px solid hsl(220 13% 13%)', background: 'hsl(220 13% 6.5%)' }}>{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Outcome */}
                <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.14)', padding: 18 }}>
                  <div className="label-caps mb-3" style={{ color: '#10b981' }}>Stay Outcome Forecast</div>
                  {[
                    { label: 'NPS Score', value: '9 / 10', color: '#10b981' },
                    { label: 'Return Intent', value: 'HIGH', color: '#10b981' },
                    { label: 'LTV Delta', value: '+$3,200', color: '#10b981' },
                    { label: 'Complaint Filed', value: 'None', color: '#10b981' },
                    { label: 'Review Signal', value: 'Positive — 4.9 expected' },
                    { label: 'Loyalty Action', value: 'Ambassador upgrade', color: '#c9a84c' },
                  ].map((f, i, arr) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(16,185,129,0.07)' : 'none', gap: 12 }}>
                      <span style={{ fontSize: 9, color: 'hsl(215 16% 34%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>{f.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: f.color || 'hsl(215 16% 60%)', textAlign: 'right' }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col: timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)', padding: '14px 18px', marginBottom: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="label-caps">Engagement Timeline</div>
                  <div style={{ fontSize: 9, color: 'hsl(215 16% 30%)', letterSpacing: '0.08em' }}>7 touchpoints · 18h span</div>
                </div>
                <div style={{ border: '1px solid hsl(220 13% 10%)' }}>
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
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 16px' }}>
                          <div style={{ fontFamily: 'var(--app-font-mono)', fontSize: 9, color: 'hsl(215 16% 30%)', letterSpacing: '0.06em', minWidth: 46, flexShrink: 0 }}>{tp.time}</div>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: sentCfg.dot, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: isInternal ? '#c9a84c' : '#fff' }}>{tp.label}</div>
                            <div style={{ fontSize: 9, color: 'hsl(215 16% 32%)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginTop: 1 }}>{tp.channel}{isInternal ? ' — Operational only' : ''}</div>
                          </div>
                          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 6px', color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, flexShrink: 0 }}>{tp.status}</div>
                          <div style={{ color: 'hsl(215 16% 30%)', fontSize: 10, transition: 'transform 0.2s', transform: isSelected ? 'rotate(90deg)' : 'none' }}>›</div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.2 }}
                            style={{ padding: '0 16px 14px', overflow: 'hidden' }}
                          >
                            <div className="grid grid-cols-2 gap-5 pt-3" style={{ borderTop: '1px solid hsl(220 13% 10%)' }}>
                              <div>
                                <div className="label-caps mb-2" style={{ color: isInternal ? '#c9a84c' : '#10b981' }}>{isInternal ? 'Operational Action' : 'Guest Experience'}</div>
                                {tp.message && !isInternal && (
                                  <div style={{ background: 'hsl(220 13% 10%)', border: '1px solid hsl(220 13% 13%)', padding: '8px 12px', marginBottom: 8 }}>
                                    <div style={{ fontSize: 8, color: 'hsl(215 16% 30%)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>{tp.channel} · The Grand Meridian</div>
                                    <div style={{ fontSize: 11, color: 'hsl(215 16% 72%)', lineHeight: 1.5, fontStyle: 'italic' }}>"{tp.message}"</div>
                                  </div>
                                )}
                                <div style={{ fontSize: 10, color: 'hsl(215 16% 55%)', lineHeight: 1.65 }}>{tp.guestExperience}</div>
                              </div>
                              <div>
                                <div className="label-caps mb-2" style={{ color: 'hsl(215 16% 28%)' }}>BXOS Context</div>
                                <div style={{ fontSize: 10, color: 'hsl(215 16% 44%)', lineHeight: 1.65 }}>{tp.bxosContext}</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                {/* Summary strip */}
                <div className="grid grid-cols-4 mt-3" style={{ border: '1px solid hsl(220 13% 10%)', background: 'hsl(220 13% 7%)' }}>
                  {[
                    { label: 'Touchpoints', value: '6' },
                    { label: 'Proactive', value: '5 of 6', color: '#10b981' },
                    { label: 'Sentiment', value: 'Positive', color: '#10b981' },
                    { label: 'Recovery', value: 'None', color: '#10b981' },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '12px 16px', borderRight: i < 3 ? '1px solid hsl(220 13% 10%)' : 'none' }}>
                      <div className="label-caps mb-1.5">{s.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: s.color || '#fff' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
