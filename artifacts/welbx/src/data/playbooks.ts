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
  },
];
