import { MomentCategory, MomentUrgency, derivePlaybookId } from "./playbooks";

export type MomentStatus = 'DETECTED' | 'ACTIONED' | 'IN_PROGRESS' | 'STABILISED' | 'RESOLVED' | 'ESCALATED';

export interface Moment {
  id: string;
  title: string;
  category: MomentCategory;
  whySurfaced: string;
  signals: string[];
  patternDetected: string;
  confidence: number;
  urgency: MomentUrgency;
  risk: string;
  commercialExposure: string;
  commercialValue?: string;
  recommendedAction: string;
  status: MomentStatus;
  playbookId?: string;
  executionFeedback?: {
    whatHappened: string;
    whoNotified: string;
    teamAssigned: string;
    responseTime: string;
    outcomeDelta: string;
  };
}

type RawMoment = Omit<Moment, 'playbookId'>;

const RAW_MOMENTS: RawMoment[] = [
  {
    id: 'm1',
    title: 'Queue Pressure Building',
    category: 'Recovery',
    whySurfaced: 'Check-in queue wait exceeded 8-minute threshold',
    signals: ['Queue depth 14 guests', 'Average wait 9.2min', '3 agents active'],
    patternDetected: 'Linear queue growth with no relief pathway',
    confidence: 94,
    urgency: 'HIGH',
    risk: 'Service failure, loyalty impact',
    commercialExposure: 'Activation exposure: high',
    recommendedAction: 'Open secondary check-in lane, reallocate host',
    status: 'DETECTED',
    executionFeedback: {
      whatHappened: 'Secondary check-in opened, host reallocated',
      whoNotified: 'Front Desk Lead',
      teamAssigned: 'Host Team B',
      responseTime: '1m 12s',
      outcomeDelta: 'Wait time reduced to 3.4min',
    }
  },
  {
    id: 'm2',
    title: 'VIP Arrival Risk',
    category: 'VIP',
    whySurfaced: 'Priority guest arrival in 12 minutes, assigned room not released',
    signals: ['Guest tier DIAMOND', 'ETA 12 min', 'Room 847 status OCCUPIED', 'Housekeeping ETA 22 min'],
    patternDetected: 'Arrival window collision — VIP arrival before room availability',
    confidence: 91,
    urgency: 'CRITICAL',
    risk: 'VIP service failure, loyalty programme damage',
    commercialExposure: 'Activation exposure: critical',
    recommendedAction: 'Prioritise housekeeping release, activate welcome protocol',
    status: 'DETECTED',
    executionFeedback: {
      whatHappened: 'Housekeeping prioritised, welcome protocol activated',
      whoNotified: 'Housekeeping Manager, Duty Manager',
      teamAssigned: 'Rapid Response Team',
      responseTime: '45s',
      outcomeDelta: 'Room released 2 mins before arrival',
    }
  },
  {
    id: 'm3',
    title: 'Housekeeping Bottleneck',
    category: 'Operational',
    whySurfaced: '7 rooms pending release against 4 arrivals in next 60 minutes',
    signals: ['Housekeeping team at 91% capacity', '7 rooms queued', '4 priority arrivals'],
    patternDetected: 'Supply-demand misalignment in room readiness pipeline',
    confidence: 88,
    urgency: 'HIGH',
    risk: 'Room not ready delays, cascading arrival disruption',
    commercialExposure: 'Operational cost exposure: significant',
    recommendedAction: 'Reallocate 2 staff from AM tasks, prioritise by arrival sequence',
    status: 'ACTIONED',
    executionFeedback: {
      whatHappened: '2 staff reallocated, sequence reprioritised',
      whoNotified: 'Housekeeping Lead',
      teamAssigned: 'AM Task Force',
      responseTime: '2m 30s',
      outcomeDelta: 'Pipeline aligned with arrivals',
    }
  },
  {
    id: 'm4',
    title: 'Guest Sentiment Drop',
    category: 'Recovery',
    whySurfaced: 'Negative sentiment cues detected after 18-minute lobby wait',
    signals: ['3 guests in lobby 18+ minutes', '2 verbal complaint signals', 'Staff engagement at 40%'],
    patternDetected: 'Unaddressed wait turning into active dissatisfaction',
    confidence: 87,
    urgency: 'HIGH',
    risk: 'Public review, comp cost, loyalty exit',
    commercialExposure: 'Recovery cost exposure if unaddressed',
    recommendedAction: 'Deploy lobby ambassador, activate service recovery gesture',
    status: 'IN_PROGRESS',
    executionFeedback: {
      whatHappened: 'Lobby ambassador deployed, drinks offered',
      whoNotified: 'Lobby Manager',
      teamAssigned: 'Guest Relations',
      responseTime: '1m 05s',
      outcomeDelta: 'Sentiment stabilised, no complaints escalated',
    }
  },
  {
    id: 'm5',
    title: 'Service Recovery Opportunity',
    category: 'Recovery',
    whySurfaced: 'Guest in 604 experienced 40-minute housekeeping delay, no proactive contact made',
    signals: ['Complaint logged 09:47', 'No follow-up by 10:31', 'Guest checkout tomorrow'],
    patternDetected: 'Recovery window still open — guest contactable, goodwill gesture viable',
    confidence: 82,
    urgency: 'MEDIUM',
    risk: 'Silent detractor, negative review',
    commercialExposure: 'Recovery gesture minimal vs review impact: high',
    recommendedAction: 'Personal call from duty manager, complimentary dinner offer',
    status: 'DETECTED',
    executionFeedback: {
      whatHappened: 'Duty manager called guest, dinner offered',
      whoNotified: 'Duty Manager, F&B Team',
      teamAssigned: 'Management',
      responseTime: '3m 10s',
      outcomeDelta: 'Guest accepted offer, NPS protected',
    }
  },
  {
    id: 'm6',
    title: 'Dining Activation Opportunity',
    category: 'VIP',
    whySurfaced: '8 checked-in guests with no F&B bookings, dinner window opening',
    signals: ['8 eligible guests', 'Restaurant 67% capacity tonight', '3 guests in spa zone (high F&B propensity)'],
    patternDetected: 'Uncaptured activation window — optimal outreach timing now',
    confidence: 79,
    urgency: 'LOW',
    risk: 'Activation opportunity uncaptured',
    commercialValue: 'Activation opportunity: confirmed',
    commercialExposure: 'Activation opportunity: confirmed',
    recommendedAction: 'Personalised dining recommendations via concierge touchpoint',
    status: 'DETECTED',
    executionFeedback: {
      whatHappened: 'Concierge reached out to 8 guests',
      whoNotified: 'Concierge Team',
      teamAssigned: 'Concierge',
      responseTime: '15m',
      outcomeDelta: '3 bookings confirmed (value activated)',
    }
  },
  {
    id: 'm7',
    title: 'Guest Welfare Flag',
    category: 'Guest',
    whySurfaced: 'Welfare concern for in-stay guest raised by hotel staff observation',
    signals: ['Staff welfare flag logged', 'Guest unresponsive to standard contact', 'Housekeeping observation escalated'],
    patternDetected: 'Behavioural or environmental signal consistent with guest requiring welfare check',
    confidence: 89,
    urgency: 'HIGH',
    risk: 'Guest safety, duty of care breach, legal exposure',
    commercialExposure: 'Activation exposure: critical if unaddressed',
    recommendedAction: 'Dispatch Duty Manager for welfare check within 90 seconds',
    status: 'RESOLVED',
    executionFeedback: {
      whatHappened: 'Duty Manager dispatched, welfare confirmed in person',
      whoNotified: 'Duty Manager, Security',
      teamAssigned: 'Guest Welfare Team',
      responseTime: '1m 05s',
      outcomeDelta: 'Guest welfare confirmed, no escalation required',
    }
  },
  {
    id: 'm8',
    title: 'Safety System Alert',
    category: 'Guest',
    whySurfaced: 'Room safety system unresponsive or active medical/distress alert detected',
    signals: ['Safety system non-response or trigger', 'Active distress or medical alert logged', 'Staff verbal distress report'],
    patternDetected: 'Immediate safety risk requiring emergency protocol activation',
    confidence: 96,
    urgency: 'CRITICAL',
    risk: 'Guest safety, emergency response obligation, duty of care',
    commercialExposure: 'Duty of care: critical',
    recommendedAction: 'Dispatch Security and First Aid immediately, notify Duty Manager',
    status: 'STABILISED',
    executionFeedback: {
      whatHappened: 'Security and First Aid dispatched, scene assessed and secured',
      whoNotified: 'Security Lead, First Aid Officer, Duty Manager',
      teamAssigned: 'Emergency Response',
      responseTime: '52s',
      outcomeDelta: 'Scene assessed, guest safe, incident fully documented',
    }
  },
  {
    id: 'm9',
    title: 'VIP Arrival Protocol',
    category: 'VIP',
    whySurfaced: 'VIP or corporate account guest arrival flagged requiring coordinated welcome protocol',
    signals: ['VIP flag active on reservation', 'Loyalty tier Platinum or above', 'Corporate account first or key arrival'],
    patternDetected: 'High-value arrival requiring pre-coordinated welcome and room readiness response',
    confidence: 93,
    urgency: 'MEDIUM',
    risk: 'First impression failure, loyalty programme damage',
    commercialExposure: 'Relationship activation exposure: high',
    recommendedAction: 'Activate welcome protocol, confirm room readiness, brief front-of-house',
    status: 'RESOLVED',
    executionFeedback: {
      whatHappened: 'Welcome protocol activated, room confirmed ready, team briefed with guest profile',
      whoNotified: 'Guest Relations, Concierge Lead',
      teamAssigned: 'Welcome Team',
      responseTime: '8m pre-arrival',
      outcomeDelta: 'Guest acknowledged by name within 45 seconds of arrival',
    }
  },
  {
    id: 'm10',
    title: 'Returning VIP Recognition',
    category: 'VIP',
    whySurfaced: 'Repeat high-value guest detected with multiple stays in the current quarter',
    signals: ['3+ stays in prior 12 months', 'High loyalty tier active', 'Known preference profile on file'],
    patternDetected: 'Recognition opportunity — relationship deepening visit requiring personalised response',
    confidence: 85,
    urgency: 'LOW',
    risk: 'Missed relationship moment, loyalty attrition risk if not acknowledged',
    commercialExposure: 'Loyalty activation opportunity: high',
    recommendedAction: 'Personalised welcome, preference-aligned amenity, GM acknowledgement note',
    status: 'RESOLVED',
    executionFeedback: {
      whatHappened: 'Preference profile applied, personalised amenity delivered, GM note sent to room',
      whoNotified: 'GM, Guest Relations',
      teamAssigned: 'Guest Relations',
      responseTime: '15m pre-arrival',
      outcomeDelta: 'Guest rated stay 10/10, forward booking confirmed at checkout',
    }
  },
  {
    id: 'm11',
    title: 'Written Complaint — Standards Failure',
    category: 'Recovery',
    whySurfaced: 'Formal written complaint lodged regarding room or facility standards failure',
    signals: ['Written complaint received via channel', 'Standards failure explicitly cited', 'Guest checkout within 24 hours'],
    patternDetected: 'Documented dissatisfaction requiring structured recovery and root-cause response',
    confidence: 91,
    urgency: 'HIGH',
    risk: 'Negative public review, loyalty exit, reputational record',
    commercialExposure: 'Recovery cost and review impact exposure: significant',
    recommendedAction: 'Acknowledge within 5 minutes, assign recovery lead, offer upgrade or gesture of goodwill',
    status: 'RESOLVED',
    executionFeedback: {
      whatHappened: 'Formal acknowledgement issued, room inspected, service recovery gesture offered',
      whoNotified: 'Duty Manager, Housekeeping Lead',
      teamAssigned: 'Guest Relations',
      responseTime: '4m 20s',
      outcomeDelta: 'Guest accepted apology and gesture, no negative review posted',
    }
  },
  {
    id: 'm12',
    title: 'Staff Welfare Alert',
    category: 'Workforce',
    whySurfaced: 'Fatigue signature or welfare concern detected for operational team member on shift',
    signals: ['Shift exceeding 10 hours without break', 'Fatigue signature in Workforce Genome', 'Peer or supervisor welfare flag raised'],
    patternDetected: 'Performance and wellbeing risk consistent with staff fatigue or welfare concern',
    confidence: 83,
    urgency: 'MEDIUM',
    risk: 'Guest-facing error risk, staff welfare obligation, operational safety',
    commercialExposure: 'Operational risk and HR liability: medium',
    recommendedAction: 'Private welfare check conversation, offer break or relief, redistribute task load',
    status: 'RESOLVED',
    executionFeedback: {
      whatHappened: 'Private welfare check conducted, relief arranged, task load redistributed',
      whoNotified: 'HR Manager, Department Head',
      teamAssigned: 'HR and Operations',
      responseTime: '6m 45s',
      outcomeDelta: 'Staff member rested, fitness to continue confirmed, no guest-facing impact',
    }
  },
  {
    id: 'm13',
    title: 'Critical System Failure',
    category: 'Operational',
    whySurfaced: 'Critical building system (HVAC, power, or water) failed in a guest-impacting zone',
    signals: ['HVAC or power failure detected', 'Multi-floor or zone impact confirmed', 'Internal resolution beyond standard SLA'],
    patternDetected: 'Infrastructure failure exceeding operational self-resolution capability',
    confidence: 97,
    urgency: 'CRITICAL',
    risk: 'Guest comfort and safety, regulatory compliance, potential property damage',
    commercialExposure: 'Operational disruption exposure: critical',
    recommendedAction: 'Triage by guest impact severity, dispatch engineering, engage external contractor if >2 hrs',
    status: 'STABILISED',
    executionFeedback: {
      whatHappened: 'Engineering dispatched, contractor engaged, affected guests proactively communicated to',
      whoNotified: 'Engineering Lead, Duty Manager, Director of Operations',
      teamAssigned: 'Engineering and Facilities',
      responseTime: '3m 30s',
      outcomeDelta: 'Partial restoration within 90 minutes, room moves offered to most-affected guests',
    }
  },
  {
    id: 'm14',
    title: 'Room Maintenance Defect',
    category: 'Operational',
    whySurfaced: 'Guest-impacting room maintenance fault unresolved beyond the 2-hour SLA threshold',
    signals: ['Plumbing or fixture fault reported', 'No resolution logged after 2+ hours', 'Guest in occupied room affected'],
    patternDetected: 'Maintenance SLA breach with confirmed active guest impact',
    confidence: 86,
    urgency: 'HIGH',
    risk: 'Guest comfort failure, negative review, potential compensation cost',
    commercialExposure: 'Service recovery exposure: medium',
    recommendedAction: 'Prioritise engineering dispatch, offer room move, communicate resolution ETA to guest',
    status: 'RESOLVED',
    executionFeedback: {
      whatHappened: 'Engineering prioritised and dispatched, fault resolved, guest kept informed throughout',
      whoNotified: 'Engineering Lead, Duty Manager',
      teamAssigned: 'Engineering',
      responseTime: '10m',
      outcomeDelta: 'Fault resolved within extended SLA, guest satisfied, no complaint logged',
    }
  },
  {
    id: 'm15',
    title: 'Facility Safety Defect',
    category: 'Operational',
    whySurfaced: 'Guest-impacting safety defect confirmed in public facility or amenity area',
    signals: ['Public area defect reported and verified', 'Pool or amenity zone access affected', 'Safety risk to guests confirmed'],
    patternDetected: 'Safety-relevant facility failure in guest-accessible zone requiring immediate action',
    confidence: 88,
    urgency: 'HIGH',
    risk: 'Guest injury liability, health and safety compliance, reputational exposure',
    commercialExposure: 'Liability and compliance exposure: significant',
    recommendedAction: 'Restrict guest access immediately, deploy facilities team, communicate alternative amenities',
    status: 'RESOLVED',
    executionFeedback: {
      whatHappened: 'Area access restricted, facilities team deployed, alternative amenities communicated to guests',
      whoNotified: 'Facilities Manager, Duty Manager',
      teamAssigned: 'Facilities and Safety',
      responseTime: '5m',
      outcomeDelta: 'Defect remediated within shift, access restored, no guest injuries reported',
    }
  },
];

export const SEEDED_MOMENTS: Moment[] = RAW_MOMENTS.map((m) => ({
  ...m,
  playbookId: derivePlaybookId(m),
}));
