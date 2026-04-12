import { motion } from "framer-motion";

const ACCENT = '#c9a84c';

const signalSources = [
  {
    name: 'Property Management System',
    abbr: 'PMS',
    description: 'Room status, reservation data, guest profiles, check-in/out times, and occupancy state.',
    status: 'CONNECTED',
  },
  {
    name: 'Point of Sale',
    abbr: 'POS',
    description: 'F&B transactions, restaurant capacity, spend patterns, and service velocity.',
    status: 'CONNECTED',
  },
  {
    name: 'Housekeeping Software',
    abbr: 'HKP',
    description: 'Room readiness pipeline, staff assignment, task queue depth, and completion times.',
    status: 'CONNECTED',
  },
  {
    name: 'Lobby Sensor Array',
    abbr: 'SENSOR',
    description: 'Footfall counts, dwell time, crowd density, and queue depth at key touchpoints.',
    status: 'CONNECTED',
  },
  {
    name: 'Staff Input Layer',
    abbr: 'STAFF',
    description: 'Verbal cues, incident logs, shift handover notes, and manual complaint entries.',
    status: 'CONNECTED',
  },
  {
    name: 'Guest App & Messaging',
    abbr: 'GUEST',
    description: 'In-app requests, sentiment signals, chat transcripts, and service feedback.',
    status: 'CONNECTED',
  },
  {
    name: 'CRM & Loyalty Engine',
    abbr: 'CRM',
    description: 'Guest tier, lifetime value, stay history, preference flags, and loyalty risk scores.',
    status: 'CONNECTED',
  },
  {
    name: 'Revenue Management System',
    abbr: 'RMS',
    description: 'Dynamic rate data, demand forecasts, channel performance, and revenue exposure.',
    status: 'LIVE',
  },
];

const signalCatalog = [
  {
    name: 'Queue Depth',
    measures: 'Number of guests waiting at a service touchpoint',
    threshold: '> 8 guests triggers monitoring; > 12 triggers alert',
  },
  {
    name: 'Wait Time',
    measures: 'Average time a guest has been waiting without service contact',
    threshold: '> 5 min monitoring; > 8 min operational alert',
  },
  {
    name: 'Room Status',
    measures: 'Current readiness state of a guest room (Occupied / Dirty / Inspecting / Ready)',
    threshold: 'Not Ready within 15 min of arrival window triggers risk flag',
  },
  {
    name: 'Guest Tier',
    measures: 'Loyalty programme classification (Standard / Gold / Platinum / Diamond)',
    threshold: 'Diamond tier amplifies urgency weighting by ×3',
  },
  {
    name: 'Staff Capacity',
    measures: 'Percentage of available staff currently deployed on active tasks',
    threshold: '> 85% capacity triggers reallocation assessment',
  },
  {
    name: 'Sentiment Cues',
    measures: 'Verbal, behavioural, and in-app signals indicating guest dissatisfaction',
    threshold: '2 or more concurrent cues triggers sentiment alert',
  },
  {
    name: 'Housekeeping ETA',
    measures: 'Projected time to room readiness based on current pipeline velocity',
    threshold: 'ETA > arrival window by 10 min triggers escalation',
  },
  {
    name: 'F&B Propensity',
    measures: 'Likelihood of a guest making a food & beverage purchase based on behaviour signals',
    threshold: 'Score > 0.72 triggers personalised outreach recommendation',
  },
  {
    name: 'Complaint Lag',
    measures: 'Time elapsed between a complaint being logged and a recovery action being taken',
    threshold: '> 30 min without response triggers recovery window alert',
  },
  {
    name: 'Revenue Exposure',
    measures: 'Estimated commercial value at risk from an unresolved operational moment',
    threshold: 'Any moment > $1,000 exposure is escalated for management visibility',
  },
];

const flowSteps = [
  {
    step: '01',
    label: 'Raw Signals',
    detail: 'BXOS ingests live data streams from all connected sources — PMS, sensors, staff input, and the guest layer — in real time.',
    color: 'hsl(215 16% 36%)',
  },
  {
    step: '02',
    label: 'Pattern Detection',
    detail: 'The BXOS intelligence layer correlates signals across systems, identifying compounding patterns that no single source reveals alone.',
    color: 'hsl(215 16% 50%)',
  },
  {
    step: '03',
    label: 'Confidence Scoring',
    detail: 'Each detected pattern is scored for operational confidence (0–100%) based on signal strength, data recency, and historical match rate.',
    color: ACCENT,
  },
  {
    step: '04',
    label: 'Moment Surfaced',
    detail: 'When confidence exceeds the threshold for a given signal type, BXOS surfaces the moment to the Live Moments layer with urgency, risk, and commercial context.',
    color: '#fff',
  },
  {
    step: '05',
    label: 'Action Recommended',
    detail: 'BXOS generates a specific, executable recommendation — calibrated to the moment type, guest tier, and available staff capacity — ready for one-tap Vector execution.',
    color: '#10b981',
  },
];

const workedExample = {
  title: 'Queue Pressure Building',
  signals: [
    { source: 'SENSOR', value: 'Queue depth 14 guests' },
    { source: 'PMS', value: 'Average wait 9.2 min' },
    { source: 'STAFF', value: '3 agents active' },
  ],
  pattern: 'Linear queue growth with no relief pathway',
  confidence: 94,
  moment: 'Queue Pressure Building — HIGH urgency — $2,400 exposure',
  action: 'Open secondary check-in lane, reallocate host',
};

export default function SignalIntelligence() {
  return (
    <div className="min-h-screen bg-background pl-56 text-foreground">
      <div className="px-10 pt-8 pb-16 max-w-5xl">

        {/* Header */}
        <header className="mb-10">
          <div className="label-caps mb-2" style={{ color: ACCENT }}>BXOS · Intelligence Layer</div>
          <h1 className="text-2xl font-bold text-white tracking-wide mb-2">Signal Intelligence</h1>
          <p className="text-xs" style={{ color: 'hsl(215 16% 45%)', letterSpacing: '0.01em', maxWidth: 640, lineHeight: 1.7 }}>
            BXOS listens to every system in your hotel simultaneously. This page shows where signals come from, what each signal type means, and how BXOS correlates them into the operational moments your team acts on.
          </p>
        </header>

        {/* Section 1: Signal Sources */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="label-caps" style={{ color: ACCENT }}>01 — Signal Sources</div>
            <div style={{ flex: 1, height: 1, background: 'hsl(220 13% 10%)' }} />
          </div>
          <p className="text-xs mb-6" style={{ color: 'hsl(215 16% 42%)', lineHeight: 1.7 }}>
            BXOS connects to the operational systems your hotel already runs. Each integration feeds a live signal stream that the intelligence layer processes continuously.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {signalSources.map((src, i) => (
              <motion.div
                key={src.abbr}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  background: 'hsl(220 13% 7%)',
                  border: '1px solid hsl(220 13% 10%)',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: '0.14em',
                      color: ACCENT, background: 'rgba(201,168,76,0.08)',
                      border: '1px solid rgba(201,168,76,0.18)',
                      padding: '2px 7px',
                    }}>
                      {src.abbr}
                    </span>
                    <span className="text-xs font-semibold text-white tracking-wide">{src.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: src.status === 'LIVE' ? '#c9a84c' : '#10b981',
                    }} />
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: '0.12em',
                      color: src.status === 'LIVE' ? ACCENT : '#10b981',
                    }}>
                      {src.status}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: 'hsl(215 16% 44%)', lineHeight: 1.6 }}>{src.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 2: Signal Catalog */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="label-caps" style={{ color: ACCENT }}>02 — Signal Catalog</div>
            <div style={{ flex: 1, height: 1, background: 'hsl(220 13% 10%)' }} />
          </div>
          <p className="text-xs mb-6" style={{ color: 'hsl(215 16% 42%)', lineHeight: 1.7 }}>
            Each signal type has a defined meaning and an operational threshold — the point at which a value becomes significant enough to influence a moment.
          </p>
          <div style={{ background: 'hsl(220 13% 7%)', border: '1px solid hsl(220 13% 10%)' }}>
            <div
              className="grid px-6 py-3"
              style={{
                gridTemplateColumns: '1fr 2fr 2fr',
                borderBottom: '1px solid hsl(220 13% 10%)',
              }}
            >
              <span className="label-caps">Signal</span>
              <span className="label-caps">What It Measures</span>
              <span className="label-caps">Operational Threshold</span>
            </div>
            {signalCatalog.map((sig, i) => (
              <motion.div
                key={sig.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.03 }}
                className="grid px-6 py-4"
                style={{
                  gridTemplateColumns: '1fr 2fr 2fr',
                  borderBottom: i < signalCatalog.length - 1 ? '1px solid hsl(220 13% 9%)' : 'none',
                  alignItems: 'start',
                  gap: 0,
                }}
              >
                <span className="text-xs font-semibold text-white pr-4">{sig.name}</span>
                <span style={{ fontSize: 11, color: 'hsl(215 16% 50%)', lineHeight: 1.6, paddingRight: 24 }}>{sig.measures}</span>
                <span style={{ fontSize: 11, color: 'hsl(215 16% 40%)', lineHeight: 1.6 }}>{sig.threshold}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 3: How Signals Become Moments */}
        <section>
          <div className="flex items-center gap-4 mb-5">
            <div className="label-caps" style={{ color: ACCENT }}>03 — How Signals Become Moments</div>
            <div style={{ flex: 1, height: 1, background: 'hsl(220 13% 10%)' }} />
          </div>
          <p className="text-xs mb-8" style={{ color: 'hsl(215 16% 42%)', lineHeight: 1.7 }}>
            BXOS does not alert on individual signals. It waits for patterns — combinations of signals that, together, indicate an emerging operational moment. Below is the five-step correlation pipeline, followed by a worked example using a live moment.
          </p>

          {/* Flow steps */}
          <div className="flex flex-col gap-0 mb-10" style={{ borderLeft: '1px solid hsl(220 13% 12%)', paddingLeft: 28, marginLeft: 8 }}>
            {flowSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  position: 'relative',
                  paddingBottom: i < flowSteps.length - 1 ? 28 : 0,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: -35,
                    top: 3,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: 'hsl(220 13% 4%)',
                    border: `1px solid ${step.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: step.color }} />
                </div>
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: 'hsl(215 16% 30%)' }}>{step.step}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: step.color, letterSpacing: '0.01em' }}>{step.label}</span>
                </div>
                <p style={{ fontSize: 12, color: 'hsl(215 16% 46%)', lineHeight: 1.7, maxWidth: 700 }}>{step.detail}</p>
              </motion.div>
            ))}
          </div>

          {/* Worked example */}
          <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}
            >
              <div className="label-caps" style={{ color: ACCENT }}>Worked Example — Queue Pressure Building</div>
              <span style={{ fontSize: 8, letterSpacing: '0.14em', color: 'hsl(215 16% 32%)', fontWeight: 600, textTransform: 'uppercase' }}>Live Moment Reference</span>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-5 gap-0" style={{ alignItems: 'start' }}>

                {/* Raw signals */}
                <div style={{ paddingRight: 20 }}>
                  <div className="label-caps mb-3" style={{ color: 'hsl(215 16% 36%)' }}>Raw Signals</div>
                  <div className="flex flex-col gap-2">
                    {workedExample.signals.map(sig => (
                      <div
                        key={sig.source}
                        style={{
                          background: 'hsl(220 13% 8%)',
                          border: '1px solid hsl(220 13% 13%)',
                          padding: '6px 10px',
                        }}
                      >
                        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: 'hsl(215 16% 36%)', marginBottom: 3 }}>{sig.source}</div>
                        <div style={{ fontSize: 10, color: 'hsl(215 16% 60%)' }}>{sig.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center pt-6" style={{ color: 'hsl(220 13% 22%)', fontSize: 18 }}>→</div>

                {/* Pattern + Confidence */}
                <div style={{ paddingRight: 20 }}>
                  <div className="label-caps mb-3" style={{ color: 'hsl(215 16% 36%)' }}>Pattern + Confidence</div>
                  <div style={{ background: 'hsl(220 13% 8%)', border: '1px solid hsl(220 13% 13%)', padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: 'hsl(215 16% 55%)', lineHeight: 1.6, marginBottom: 10 }}>
                      {workedExample.pattern}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span style={{ fontSize: 28, fontWeight: 800, color: ACCENT, letterSpacing: '-0.02em' }}>{workedExample.confidence}</span>
                      <span style={{ fontSize: 10, color: 'hsl(215 16% 40%)', fontWeight: 600 }}>% confidence</span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center pt-6" style={{ color: 'hsl(220 13% 22%)', fontSize: 18 }}>→</div>

                {/* Moment + Action */}
                <div>
                  <div className="label-caps mb-3" style={{ color: 'hsl(215 16% 36%)' }}>Moment + Action</div>
                  <div style={{ background: 'hsl(220 13% 8%)', border: '1px solid rgba(201,168,76,0.2)', padding: '10px 12px', marginBottom: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{workedExample.title}</div>
                    <div style={{ fontSize: 9, letterSpacing: '0.1em', color: '#ef4444', fontWeight: 700 }}>HIGH URGENCY</div>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', padding: '10px 12px' }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: '#10b981', marginBottom: 4 }}>RECOMMENDED ACTION</div>
                    <div style={{ fontSize: 10, color: 'hsl(215 16% 60%)', lineHeight: 1.5 }}>{workedExample.action}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
