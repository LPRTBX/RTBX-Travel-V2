export type Delta = "major" | "moderate" | "minor";

export interface DimensionRow {
  traditional: string;
  welbx: string;
  delta: Delta;
}

export interface ScenarioComparison {
  timeToVisibility: DimensionRow;
  decisionClarity: DimensionRow;
  communicationCoordination: DimensionRow;
  escalationControl: DimensionRow;
  guestImpact: DimensionRow;
  staffImpact: DimensionRow;
  outcomeVisibility: DimensionRow;
  learningCaptured: DimensionRow;
}

export const DIMENSIONS: Array<{ key: keyof ScenarioComparison; label: string; icon: string }> = [
  { key: "timeToVisibility",          label: "Time to Visibility",          icon: "⏱" },
  { key: "decisionClarity",           label: "Decision Clarity",            icon: "◎" },
  { key: "communicationCoordination", label: "Communication Coordination",  icon: "⇄" },
  { key: "escalationControl",         label: "Escalation Control",          icon: "△" },
  { key: "guestImpact",               label: "Guest Impact",                icon: "★" },
  { key: "staffImpact",               label: "Staff Impact",                icon: "◈" },
  { key: "outcomeVisibility",         label: "Outcome Visibility",          icon: "◉" },
  { key: "learningCaptured",          label: "Learning Captured",           icon: "⟳" },
];

export const COMPARISONS: Record<string, ScenarioComparison> = {

  "SCN-001": {
    timeToVisibility:          { traditional: "8–15 min via manual check at shift handover",              welbx: "< 90 sec via PMS arrival flag + room status cross-check",     delta: "major" },
    decisionClarity:           { traditional: "Reception manager decides ad-hoc; no defined protocol",    welbx: "Automated room reallocation with ranked suite alternatives",     delta: "major" },
    communicationCoordination: { traditional: "Reception calls housekeeping, then F&B separately",        welbx: "Simultaneous broadcast to HK, F&B, Concierge and GM",           delta: "major" },
    escalationControl:         { traditional: "Escalates reactively when guest arrives first",            welbx: "Pre-emptive escalation triggered 12 min before arrival window", delta: "major" },
    guestImpact:               { traditional: "Guest waits in lobby without explanation or gesture",      welbx: "Suite upgrade offered; champagne and letter ready on arrival",   delta: "major" },
    staffImpact:               { traditional: "Reception scrambles; manager improvises under pressure",   welbx: "Pre-assigned resolution path; staff briefed with specific steps", delta: "major" },
    outcomeVisibility:         { traditional: "No record unless a guest complaint is later raised",       welbx: "Full audit trail: detection time to resolution time logged",     delta: "major" },
    learningCaptured:          { traditional: "Verbal debrief only; no systemic operational change",      welbx: "Arrival threshold adjusted; HK pre-check window expanded",      delta: "major" },
  },

  "SCN-002": {
    timeToVisibility:          { traditional: "Complaint surfaces at front desk after 20–40 min",         welbx: "Sentiment drop detected in real time via service interaction log", delta: "major" },
    decisionClarity:           { traditional: "Duty manager uses discretion; no tier-based protocol",     welbx: "Gold-tier recovery protocol auto-triggered with defined gestures", delta: "major" },
    communicationCoordination: { traditional: "Front desk notifies F&B verbally; notes remain informal",  welbx: "CRM updated; F&B, GM and room team all notified simultaneously",   delta: "moderate" },
    escalationControl:         { traditional: "Escalates only if complaint unresolved after several hours", welbx: "Recovery gesture deployed before a second service touchpoint",   delta: "major" },
    guestImpact:               { traditional: "Guest feels ignored until manual follow-up is made",       welbx: "Proactive recovery action completed within 8 min of detection",  delta: "major" },
    staffImpact:               { traditional: "Staff attend guest with no prior complaint context",       welbx: "Full guest history and preferred resolution shown to attending staff", delta: "moderate" },
    outcomeVisibility:         { traditional: "Resolution unclear unless complaint is closed manually",   welbx: "Sentiment recovery tracked; resolution status logged and dated",   delta: "moderate" },
    learningCaptured:          { traditional: "Complaint file created but rarely actioned or reviewed",   welbx: "Root cause flagged; similar trigger pattern added to monitoring",  delta: "moderate" },
  },

  "SCN-003": {
    timeToVisibility:          { traditional: "Duty manager observes congestion visually; no alert",      welbx: "Queue depth auto-detected via PMS check-in rate + lobby sensors",  delta: "major" },
    decisionClarity:           { traditional: "Manager decides ad-hoc whether to open extra counters",   welbx: "Congestion protocol activates: staff redeployment + mobile check-in", delta: "major" },
    communicationCoordination: { traditional: "Verbal instruction to nearby staff; uneven response",      welbx: "Targeted task assignment to available staff within 60 seconds",     delta: "moderate" },
    escalationControl:         { traditional: "VIP guests arrive into the congestion without warning",   welbx: "VIPs pre-routed to express lane 8 min before their arrival",        delta: "major" },
    guestImpact:               { traditional: "All guests experience the same queue regardless of tier", welbx: "VIPs separated; standard guests offered direct mobile check-in",    delta: "major" },
    staffImpact:               { traditional: "Staff overwhelmed at peak; no clear priority system",     welbx: "Staff receive prioritised task list; no ad-hoc decisions required",  delta: "major" },
    outcomeVisibility:         { traditional: "No record of queue depth or wait times over time",        welbx: "Per-guest wait time logged; peak congestion window documented",     delta: "moderate" },
    learningCaptured:          { traditional: "No systemic change; same congestion pattern repeats",     welbx: "Peak check-in pattern updated; staffing model adjusted for next week", delta: "moderate" },
  },

  "SCN-004": {
    timeToVisibility:          { traditional: "Fatigue goes undetected until guest service quality drops", welbx: "Fatigue indicators detected via shift duration + response drift",  delta: "major" },
    decisionClarity:           { traditional: "Supervisor acts only after a guest complaint is received", welbx: "Wellness protocol: break rotation, task reassignment, relief cover", delta: "major" },
    communicationCoordination: { traditional: "Supervisor notified informally by a colleague or HR",      welbx: "Shift manager and HR notified with staff profile and flag reason",   delta: "moderate" },
    escalationControl:         { traditional: "No escalation path until a service incident occurs",       welbx: "Pre-emptive relief action before any performance degradation",      delta: "major" },
    guestImpact:               { traditional: "Guest receives degraded service before action is taken",  welbx: "Invisible — service handoff completed before guest interaction",    delta: "major" },
    staffImpact:               { traditional: "Staff continues under fatigue with no support offered",   welbx: "Staff offered break; relief cover assigned; no stigma trigger",     delta: "major" },
    outcomeVisibility:         { traditional: "No record of fatigue event unless an incident is filed",  welbx: "Wellness event logged; shift pattern review automatically flagged",  delta: "moderate" },
    learningCaptured:          { traditional: "Pattern continues; same staff affected on future shifts", welbx: "Shift scheduling model reviewed; roster adjusted within 24 hours",  delta: "moderate" },
  },

  "SCN-005": {
    timeToVisibility:          { traditional: "Fault detected only when guest complains about temperature", welbx: "HVAC fault auto-detected via BMS sensor cross-reference",         delta: "major" },
    decisionClarity:           { traditional: "Engineering called informally; response time unknown",      welbx: "Affected rooms identified; engineering + relocation playbook fired", delta: "major" },
    communicationCoordination: { traditional: "Engineering informed verbally; affected guests not warned", welbx: "Engineering, HK and front desk all notified simultaneously",        delta: "major" },
    escalationControl:         { traditional: "Escalates after guest complaints; rooms not cleared first", welbx: "Health-sensitive guest on Floor 4 flagged first; contact made",    delta: "major" },
    guestImpact:               { traditional: "Guests disturbed by poor air quality before any action",  welbx: "Affected guests offered room moves within 5 minutes of detection",  delta: "major" },
    staffImpact:               { traditional: "Engineering reactive; no cross-department coordination",   welbx: "Step-by-step protocol issued to each department with timing",       delta: "moderate" },
    outcomeVisibility:         { traditional: "Fault fix not linked to any guest experience outcome",     welbx: "Engineering resolution and guest satisfaction both tracked",        delta: "moderate" },
    learningCaptured:          { traditional: "Fault logged in maintenance system only; no wider review", welbx: "HVAC threshold tuned; affected floor added to inspection schedule", delta: "minor" },
  },

  "SCN-006": {
    timeToVisibility:          { traditional: "Reported at checkout; 40-minute window already passed",   welbx: "Loss reported; last-known location cross-referenced immediately",    delta: "major" },
    decisionClarity:           { traditional: "Front desk takes informal note; HK manager called later",  welbx: "Item triage: HK re-sweep, security review, CCTV flag initiated",    delta: "major" },
    communicationCoordination: { traditional: "Phone chain: front desk → HK manager → room attendant",   welbx: "Security, HK team and duty manager all notified in parallel",       delta: "major" },
    escalationControl:         { traditional: "No escalation unless item not found after several hours", welbx: "High-value item flag triggers security protocol immediately",        delta: "major" },
    guestImpact:               { traditional: "Guest receives vague response with no timeline offered",  welbx: "Guest contacted within 15 min with structured search progress",     delta: "major" },
    staffImpact:               { traditional: "HK team informed informally; search remains uncoordinated", welbx: "Each team member given a specific, timed search task",            delta: "moderate" },
    outcomeVisibility:         { traditional: "Outcome unknown unless guest calls back to follow up",    welbx: "Search status tracked; found/not-found logged with timestamp",     delta: "major" },
    learningCaptured:          { traditional: "Incident noted informally; no property log improvement",  welbx: "Turnover check updated; high-value room exit protocol strengthened", delta: "minor" },
  },

  "SCN-007": {
    timeToVisibility:          { traditional: "Accessibility need only visible when guest arrives at desk", welbx: "Profile cross-referenced 3 hours pre-arrival; gap identified",  delta: "major" },
    decisionClarity:           { traditional: "Front desk improvises room move at check-in counter",      welbx: "Accessible room pre-assigned; specialist equipment staged in advance", delta: "major" },
    communicationCoordination: { traditional: "Front desk tells one team member verbally",                welbx: "Concierge, HK, F&B and Rooms all briefed from shared guest profile", delta: "major" },
    escalationControl:         { traditional: "Issue escalates if guest arrives to incorrect room setup", welbx: "Resolved 3 hours pre-arrival; no escalation path required",        delta: "major" },
    guestImpact:               { traditional: "Guest must explain their needs at check-in; risk of distress", welbx: "Room and all staff ready on arrival; no guest action required", delta: "major" },
    staffImpact:               { traditional: "Staff unprepared; ad-hoc adjustments cause visible delays", welbx: "Specific setup checklist issued to each department with timing",  delta: "major" },
    outcomeVisibility:         { traditional: "No audit trail of whether accessibility needs were met",   welbx: "Setup checklist completion tracked and confirmed before arrival",   delta: "moderate" },
    learningCaptured:          { traditional: "Profile notes updated manually if staff remember to do so", welbx: "Guest profile enriched; accessibility playbook updated for future", delta: "moderate" },
  },

  "SCN-008": {
    timeToVisibility:          { traditional: "Late arrival noted only if front desk checks manifest",    welbx: "23:45 arrival auto-flagged; preference profile reviewed at 22:00",  delta: "major" },
    decisionClarity:           { traditional: "Night team improvises; limited F&B options at that hour", welbx: "Late dining protocol: in-room menu curated to guest preferences",    delta: "major" },
    communicationCoordination: { traditional: "Night reception may not know the guest's preferences",    welbx: "Night team briefed with welcome note, preferred snacks, room setup",  delta: "major" },
    escalationControl:         { traditional: "No anticipation; guest requests food; staff apologises",  welbx: "Provisions prepared in advance; no guest request needed",            delta: "moderate" },
    guestImpact:               { traditional: "Guest arrives tired to a generic late-night setup",       welbx: "Warm, personal welcome; curated late-night in-room F&B ready",      delta: "major" },
    staffImpact:               { traditional: "Night team surprised by requests with limited options",   welbx: "Night team briefed with step-by-step late arrival welcome protocol", delta: "moderate" },
    outcomeVisibility:         { traditional: "No record of whether the late arrival experience was good", welbx: "Arrival satisfaction touchpoint logged; F&B consumption tracked",  delta: "minor" },
    learningCaptured:          { traditional: "No improvement; same generic late-night experience each time", welbx: "Late-arrival preference pattern updated; protocol refined",    delta: "minor" },
  },

  "SCN-009": {
    timeToVisibility:          { traditional: "Detected only when the guest complains directly to a waiter", welbx: "Kitchen breach detected at 22-min mark before guest frustration", delta: "major" },
    decisionClarity:           { traditional: "Floor manager visits table after complaint; improvises",   welbx: "Recovery: complimentary course, manager visit, ETA communicated",   delta: "major" },
    communicationCoordination: { traditional: "Kitchen and floor staff not coordinated on recovery",      welbx: "Kitchen ETA and floor manager briefed simultaneously with script",   delta: "major" },
    escalationControl:         { traditional: "Anniversary context unknown; response is generic",         welbx: "Anniversary context loaded; response elevated to occasion-level care", delta: "major" },
    guestImpact:               { traditional: "Guest marks anniversary with apology and no resolution",  welbx: "Champagne, complimentary dish and personal manager apology delivered", delta: "major" },
    staffImpact:               { traditional: "Waiter and manager handle independently; mixed message",  welbx: "Unified recovery script issued; both staff aligned before approach",  delta: "moderate" },
    outcomeVisibility:         { traditional: "No record unless guest later files a complaint",           welbx: "Kitchen breach and recovery action both timestamped and logged",     delta: "moderate" },
    learningCaptured:          { traditional: "Kitchen told verbally; same delay likely on next service", welbx: "Kitchen timing threshold adjusted; occasion-booking flag added",    delta: "moderate" },
  },

  "SCN-010": {
    timeToVisibility:          { traditional: "Guest discovers cancellation themselves; calls front desk", welbx: "Cancellation signal detected via transport API; flagged 90 min out", delta: "major" },
    decisionClarity:           { traditional: "Concierge contacts hotel cars ad-hoc; limited options",    welbx: "Alternatives ranked (hotel car, partner taxi, rail) and presented",  delta: "major" },
    communicationCoordination: { traditional: "Concierge handles alone; no cross-department awareness",   welbx: "Concierge, front desk and GM notified; guest contacted proactively",  delta: "major" },
    escalationControl:         { traditional: "Escalates when guest reaches departure anxiety",           welbx: "Pre-emptive contact 85 min before departure with options ready",     delta: "major" },
    guestImpact:               { traditional: "Guest must self-arrange transport under severe time pressure", welbx: "Resolution offered before the guest is aware of the problem",   delta: "major" },
    staffImpact:               { traditional: "Concierge scrambles with no established protocol",         welbx: "Step-by-step transport recovery protocol with preferred supplier list", delta: "major" },
    outcomeVisibility:         { traditional: "No record of outcome unless guest leaves a review",        welbx: "Transport resolution logged; departure on-time status tracked",      delta: "moderate" },
    learningCaptured:          { traditional: "No systemic improvement; same vulnerability in future",   welbx: "Monitoring window updated; backup supplier chain strengthened",     delta: "moderate" },
  },

};
