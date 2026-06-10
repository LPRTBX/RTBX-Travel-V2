export interface PlaybookExecution {
  id: string;
  timestamp: string;
  trigger: string;
  owner: string;
  outcome: "Resolved" | "Escalated" | "Partial";
  resolutionMinutes: number;
}

export interface PlaybookStats {
  firesLast30Days: number;
  avgResolutionMinutes: number;
  successRate: number;
}

export interface Playbook {
  id: string;
  name: string;
  category: "Guest" | "VIP" | "Recovery" | "Workforce" | "Operational";
  status: "ACTIVE" | "STANDBY" | "ESCALATED";
  triggerConditions: string[];
  recommendedActions: string[];
  owners: string[];
  escalationRules: string[];
  successCriteria: string[];
  executions: PlaybookExecution[];
  stats: PlaybookStats;
}

export function getPlaybookById(id: string): Playbook | undefined {
  return PLAYBOOKS.find((p) => p.id === id);
}

export const PLAYBOOKS: Playbook[] = [
  {
    id: "PB-001",
    name: "Guest Distress",
    category: "Guest",
    status: "ACTIVE",
    triggerConditions: [
      "Verbal distress signal detected by floor staff or sensors",
      "Guest welfare flag raised by any team member",
      "Room safety system triggered or unresponsive for >3 minutes",
      "Medical alert or emergency call logged in system",
    ],
    recommendedActions: [
      "Dispatch Duty Manager to guest location within 90 seconds",
      "Notify Security and First Aid team simultaneously",
      "Isolate guest in a private, calm environment away from public areas",
      "Document incident with time-stamped log in WELBX Command Centre",
      "Arrange welfare follow-up within 30 minutes of resolution",
    ],
    owners: ["Duty Manager", "Security Lead", "First Aid Officer"],
    escalationRules: [
      "If no resolution within 5 minutes → escalate to General Manager",
      "If medical emergency confirmed → call emergency services immediately",
      "If reputational risk identified → notify Communications Lead",
    ],
    successCriteria: [
      "Guest welfare confirmed and documented within 10 minutes",
      "No public escalation or media exposure",
      "Incident report completed and filed within 1 hour",
      "Follow-up contact made with guest before next shift handover",
    ],
    stats: {
      firesLast30Days: 7,
      avgResolutionMinutes: 8,
      successRate: 86,
    },
    executions: [
      {
        id: "EX-001-07",
        timestamp: "2026-06-09T22:14:00Z",
        trigger: "Room safety system unresponsive — Room 412",
        owner: "A. Marsh (Duty Manager)",
        outcome: "Resolved",
        resolutionMinutes: 6,
      },
      {
        id: "EX-001-06",
        timestamp: "2026-06-07T14:38:00Z",
        trigger: "Guest welfare flag raised by housekeeping",
        owner: "D. Osei (Security Lead)",
        outcome: "Resolved",
        resolutionMinutes: 9,
      },
      {
        id: "EX-001-05",
        timestamp: "2026-06-04T03:22:00Z",
        trigger: "Medical alert logged — lobby area",
        owner: "P. Nguyen (First Aid Officer)",
        outcome: "Escalated",
        resolutionMinutes: 14,
      },
      {
        id: "EX-001-04",
        timestamp: "2026-06-01T19:55:00Z",
        trigger: "Verbal distress signal — F&B floor",
        owner: "A. Marsh (Duty Manager)",
        outcome: "Resolved",
        resolutionMinutes: 7,
      },
      {
        id: "EX-001-03",
        timestamp: "2026-05-28T11:10:00Z",
        trigger: "Guest welfare flag — Room 208",
        owner: "D. Osei (Security Lead)",
        outcome: "Resolved",
        resolutionMinutes: 5,
      },
    ],
  },
  {
    id: "PB-002",
    name: "VIP Arrival",
    category: "VIP",
    status: "ACTIVE",
    triggerConditions: [
      "Diamond or Platinum tier guest arrival confirmed within 20-minute window",
      "VIP flag set on reservation by sales or GM office",
      "Corporate account guest arriving for first time at property",
      "Repeat high-value guest with 3+ stays in prior 12 months",
    ],
    recommendedActions: [
      "Pre-assign preferred room category and confirm readiness 30 minutes before ETA",
      "Activate personalised welcome protocol with name recognition at entrance",
      "Prepare complimentary welcome amenity aligned to guest preference profile",
      "Brief front-of-house team with guest name, tier, and any known preferences",
      "Confirm F&B reservation or offer personalised dining recommendation",
    ],
    owners: ["General Manager", "Guest Relations Manager", "Concierge Lead"],
    escalationRules: [
      "If assigned room not ready within 15 minutes of arrival → offer suite upgrade",
      "If guest expresses dissatisfaction → escalate to GM within 2 minutes",
      "If revenue opportunity identified → notify Commercial Director",
    ],
    successCriteria: [
      "Guest acknowledged by name within 60 seconds of arrival",
      "Room ready prior to or at check-in with zero waiting time",
      "Welcome amenity delivered within 15 minutes of check-in",
      "No unresolved issues within first 2 hours of stay",
    ],
    stats: {
      firesLast30Days: 19,
      avgResolutionMinutes: 18,
      successRate: 95,
    },
    executions: [
      {
        id: "EX-002-19",
        timestamp: "2026-06-10T09:05:00Z",
        trigger: "Diamond tier arrival — Mr. K. Ashworth (Platinum Corp)",
        owner: "C. Adeyemi (GM)",
        outcome: "Resolved",
        resolutionMinutes: 15,
      },
      {
        id: "EX-002-18",
        timestamp: "2026-06-08T16:42:00Z",
        trigger: "VIP flag — Reservation #RES-3917",
        owner: "L. Ferreira (Guest Relations)",
        outcome: "Resolved",
        resolutionMinutes: 20,
      },
      {
        id: "EX-002-17",
        timestamp: "2026-06-06T12:18:00Z",
        trigger: "Repeat high-value guest — 5th stay this quarter",
        owner: "L. Ferreira (Guest Relations)",
        outcome: "Resolved",
        resolutionMinutes: 17,
      },
      {
        id: "EX-002-16",
        timestamp: "2026-06-04T14:00:00Z",
        trigger: "Corporate first-arrival — Nexus Group executive",
        owner: "C. Adeyemi (GM)",
        outcome: "Partial",
        resolutionMinutes: 28,
      },
      {
        id: "EX-002-15",
        timestamp: "2026-06-02T10:30:00Z",
        trigger: "Platinum tier arrival — Ms. R. Yuen",
        owner: "T. Blaine (Concierge Lead)",
        outcome: "Resolved",
        resolutionMinutes: 13,
      },
    ],
  },
  {
    id: "PB-003",
    name: "Complaint Recovery",
    category: "Recovery",
    status: "ACTIVE",
    triggerConditions: [
      "Formal complaint lodged via any channel (verbal, digital, or written)",
      "Sentiment negative flag triggered by behavioural scoring (confidence >75%)",
      "Guest requests to speak to a manager",
      "Review window open and service failure logged within prior 24 hours",
    ],
    recommendedActions: [
      "Acknowledge complaint within 5 minutes via direct staff contact",
      "Assign dedicated recovery lead for the guest interaction",
      "Determine appropriate service recovery gesture (upgrade, comp, gesture of goodwill)",
      "Document root cause and apply operational fix to prevent recurrence",
      "Follow up with personal call or note from senior manager within 4 hours",
    ],
    owners: ["Front Desk Lead", "Duty Manager", "Guest Relations"],
    escalationRules: [
      "If resolution not accepted by guest → escalate to General Manager",
      "If complaint involves safety → notify Risk and Legal immediately",
      "If social media risk identified → loop in Communications Lead",
    ],
    successCriteria: [
      "Guest satisfaction confirmed before departure",
      "No negative review posted within 72 hours of recovery",
      "Root cause documented and operationally addressed within 48 hours",
      "Guest offered to return with loyalty gesture or benefit",
    ],
    stats: {
      firesLast30Days: 12,
      avgResolutionMinutes: 34,
      successRate: 83,
    },
    executions: [
      {
        id: "EX-003-12",
        timestamp: "2026-06-09T17:22:00Z",
        trigger: "Sentiment flag — dining experience (confidence 88%)",
        owner: "B. Okello (Front Desk Lead)",
        outcome: "Resolved",
        resolutionMinutes: 28,
      },
      {
        id: "EX-003-11",
        timestamp: "2026-06-08T09:45:00Z",
        trigger: "Formal written complaint — room cleanliness",
        owner: "A. Marsh (Duty Manager)",
        outcome: "Resolved",
        resolutionMinutes: 42,
      },
      {
        id: "EX-003-10",
        timestamp: "2026-06-05T21:08:00Z",
        trigger: "Guest requested manager — check-in delay",
        owner: "B. Okello (Front Desk Lead)",
        outcome: "Escalated",
        resolutionMinutes: 55,
      },
      {
        id: "EX-003-09",
        timestamp: "2026-06-03T13:50:00Z",
        trigger: "Review window open — service failure logged",
        owner: "L. Ferreira (Guest Relations)",
        outcome: "Resolved",
        resolutionMinutes: 30,
      },
    ],
  },
  {
    id: "PB-004",
    name: "Staff Fatigue",
    category: "Workforce",
    status: "STANDBY",
    triggerConditions: [
      "Staff member flagged by peer or supervisor for welfare concern",
      "Shift duration exceeds 10 hours without documented break",
      "Error rate or task completion rate drops >20% versus baseline",
      "WELBX Workforce Genome detects pattern consistent with fatigue signature",
    ],
    recommendedActions: [
      "Conduct immediate welfare check conversation in private",
      "Offer scheduled break or early relief where operationally feasible",
      "Redistribute task load across available team members",
      "Log welfare flag and schedule line manager review within 24 hours",
      "Confirm staff member fitness to continue before returning to guest-facing role",
    ],
    owners: ["Department Head", "HR Manager", "Duty Manager"],
    escalationRules: [
      "If staff member declines welfare check → escalate to HR Manager",
      "If safety risk to guests identified → remove from role immediately",
      "If pattern is recurring (>2 incidents) → trigger formal HR review",
    ],
    successCriteria: [
      "Welfare check completed and documented within 30 minutes of trigger",
      "Staff member either rested, relieved, or formally assessed",
      "No guest-facing impact resulting from the fatigue event",
      "Follow-up review scheduled within 5 working days",
    ],
    stats: {
      firesLast30Days: 3,
      avgResolutionMinutes: 22,
      successRate: 100,
    },
    executions: [
      {
        id: "EX-004-03",
        timestamp: "2026-06-06T07:15:00Z",
        trigger: "Workforce Genome fatigue signature — F&B team member",
        owner: "R. Patel (HR Manager)",
        outcome: "Resolved",
        resolutionMinutes: 20,
      },
      {
        id: "EX-004-02",
        timestamp: "2026-05-29T22:40:00Z",
        trigger: "Shift >10 hrs without documented break — Housekeeping",
        owner: "J. Torres (Department Head)",
        outcome: "Resolved",
        resolutionMinutes: 18,
      },
      {
        id: "EX-004-01",
        timestamp: "2026-05-21T15:30:00Z",
        trigger: "Supervisor welfare concern flag — Front Desk",
        owner: "R. Patel (HR Manager)",
        outcome: "Resolved",
        resolutionMinutes: 27,
      },
    ],
  },
  {
    id: "PB-005",
    name: "Maintenance Escalation",
    category: "Operational",
    status: "ACTIVE",
    triggerConditions: [
      "Maintenance fault unresolved for more than 2 hours post-report",
      "Guest-impacting defect in room or public area confirmed",
      "Critical system failure (HVAC, water, power) in any operational zone",
      "Maintenance backlog exceeds capacity threshold for current shift",
    ],
    recommendedActions: [
      "Triage fault by guest impact severity and assign priority classification",
      "Dispatch engineering team with ETA communicated to affected guests within 15 minutes",
      "Offer room move or service alternative for guests with active impact",
      "Engage external contractor if internal resolution time exceeds threshold",
      "Update WELBX maintenance log with real-time status and resolution timeline",
    ],
    owners: ["Engineering Lead", "Duty Manager", "Facilities Manager"],
    escalationRules: [
      "If fault not resolved within 4 hours → notify Director of Operations",
      "If guest safety is compromised → evacuate and notify GM immediately",
      "If external contractor required → obtain authorisation from Finance within 1 hour",
    ],
    successCriteria: [
      "Fault resolved and guest confirmation received before end of shift",
      "No secondary failures arising from the original fault within 24 hours",
      "Full incident report filed in property management system within 2 hours of resolution",
      "Preventive action plan documented to avoid recurrence",
    ],
    stats: {
      firesLast30Days: 9,
      avgResolutionMinutes: 67,
      successRate: 78,
    },
    executions: [
      {
        id: "EX-005-09",
        timestamp: "2026-06-10T06:50:00Z",
        trigger: "HVAC failure — Floors 3–5 (guest-impacting)",
        owner: "M. Okonkwo (Engineering Lead)",
        outcome: "Partial",
        resolutionMinutes: 95,
      },
      {
        id: "EX-005-08",
        timestamp: "2026-06-07T13:20:00Z",
        trigger: "Room 318 — plumbing fault unresolved >2 hrs",
        owner: "M. Okonkwo (Engineering Lead)",
        outcome: "Resolved",
        resolutionMinutes: 58,
      },
      {
        id: "EX-005-07",
        timestamp: "2026-06-05T09:10:00Z",
        trigger: "Maintenance backlog at capacity — AM shift",
        owner: "S. Lindqvist (Facilities Manager)",
        outcome: "Resolved",
        resolutionMinutes: 45,
      },
      {
        id: "EX-005-06",
        timestamp: "2026-06-02T20:35:00Z",
        trigger: "Power fault — conference wing Zone B",
        owner: "M. Okonkwo (Engineering Lead)",
        outcome: "Escalated",
        resolutionMinutes: 120,
      },
      {
        id: "EX-005-05",
        timestamp: "2026-05-30T11:00:00Z",
        trigger: "Guest-impacting defect — Pool area surface",
        owner: "S. Lindqvist (Facilities Manager)",
        outcome: "Resolved",
        resolutionMinutes: 75,
      },
    ],
  },
];
