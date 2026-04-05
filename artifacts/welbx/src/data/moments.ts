export type MomentStatus = 'DETECTED' | 'ACTIONED' | 'IN_PROGRESS' | 'STABILISED' | 'RESOLVED' | 'ESCALATED';

export interface Moment {
  id: string;
  title: string;
  whySurfaced: string;
  signals: string[];
  patternDetected: string;
  confidence: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk: string;
  commercialExposure: string;
  recommendedAction: string;
  status: MomentStatus;
  executionFeedback?: {
    whatHappened: string;
    whoNotified: string;
    teamAssigned: string;
    responseTime: string;
    outcomeDelta: string;
  };
}

export const SEEDED_MOMENTS: Moment[] = [
  {
    id: 'm1',
    title: 'Queue Pressure Building',
    whySurfaced: 'Check-in queue wait exceeded 8-minute threshold',
    signals: ['Queue depth 14 guests', 'Average wait 9.2min', '3 agents active'],
    patternDetected: 'Linear queue growth with no relief pathway',
    confidence: 94,
    urgency: 'HIGH',
    risk: 'Service failure, loyalty impact',
    commercialExposure: 'Est. £2,400 revenue at risk',
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
    whySurfaced: 'Priority guest arrival in 12 minutes, assigned room not released',
    signals: ['Guest tier DIAMOND', 'ETA 12 min', 'Room 847 status OCCUPIED', 'Housekeeping ETA 22 min'],
    patternDetected: 'Arrival window collision — VIP arrival before room availability',
    confidence: 91,
    urgency: 'CRITICAL',
    risk: 'VIP service failure, loyalty programme damage',
    commercialExposure: 'Est. £8,000 lifetime value at risk',
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
    whySurfaced: '7 rooms pending release against 4 arrivals in next 60 minutes',
    signals: ['Housekeeping team at 91% capacity', '7 rooms queued', '4 priority arrivals'],
    patternDetected: 'Supply-demand misalignment in room readiness pipeline',
    confidence: 88,
    urgency: 'HIGH',
    risk: 'Room not ready delays, cascading arrival disruption',
    commercialExposure: 'Est. £5,200 cost exposure',
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
    whySurfaced: 'Negative sentiment cues detected after 18-minute lobby wait',
    signals: ['3 guests in lobby 18+ minutes', '2 verbal complaint signals', 'Staff engagement at 40%'],
    patternDetected: 'Unaddressed wait turning into active dissatisfaction',
    confidence: 87,
    urgency: 'HIGH',
    risk: 'Public review, comp cost, loyalty exit',
    commercialExposure: 'Est. £1,800 recovery cost if unaddressed',
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
    whySurfaced: 'Guest in 604 experienced 40-minute housekeeping delay, no proactive contact made',
    signals: ['Complaint logged 09:47', 'No follow-up by 10:31', 'Guest checkout tomorrow'],
    patternDetected: 'Recovery window still open — guest contactable, goodwill gesture viable',
    confidence: 82,
    urgency: 'MEDIUM',
    risk: 'Silent detractor, negative review',
    commercialExposure: 'Recovery gesture cost ~£120 vs est. £3,400 review impact',
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
    whySurfaced: '8 checked-in guests with no F&B bookings, dinner window opening',
    signals: ['8 eligible guests', 'Restaurant 67% capacity tonight', '3 guests in spa zone (high F&B propensity)'],
    patternDetected: 'Unconverted revenue opportunity — optimal outreach timing now',
    confidence: 79,
    urgency: 'LOW',
    risk: 'Revenue left uncaptured',
    commercialValue: 'Est. £960 revenue opportunity',
    commercialExposure: 'Est. £960 revenue opportunity', // mapped for UI consistency
    recommendedAction: 'Personalised dining recommendations via concierge touchpoint',
    status: 'DETECTED',
    executionFeedback: {
      whatHappened: 'Concierge reached out to 8 guests',
      whoNotified: 'Concierge Team',
      teamAssigned: 'Concierge',
      responseTime: '15m',
      outcomeDelta: '3 bookings confirmed (£420 value)',
    }
  }
];
