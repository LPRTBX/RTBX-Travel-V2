/**
 * JALDO Travel — Canonical Role Register.
 *
 * Thirteen governed roles covering every accountable function across
 * Travel operating systems. Use these IDs consistently across scenarios,
 * playbooks and operating-system data. Do not invent role names inline.
 */

export type TravelRoleLevel =
  | "frontline"
  | "manager"
  | "property"
  | "regional"
  | "group"
  | "partner";

export interface TravelRole {
  id: string;
  name: string;
  level: TravelRoleLevel;
  responsibilities: string[];
  decisionRights: string[];
  escalationRights: string[];
  evidenceResponsibilities: string[];
  communicationPermissions: string[];
}

export const TRAVEL_ROLES: TravelRole[] = [
  {
    id: "front-office",
    name: "Front Office",
    level: "frontline",
    responsibilities: [
      "Manage guest arrivals, check-in and check-out",
      "Respond to guest requests at the front desk",
      "Coordinate room allocation and readiness confirmations",
      "Relay guest needs to relevant departments",
      "Action operational prompts from JALDO within approved parameters",
    ],
    decisionRights: [
      "Acknowledge and assign incoming guest requests",
      "Offer standard lounge access or waiting support during room delays",
      "Send approved guest communications",
      "Confirm room readiness and close standard service tasks",
    ],
    escalationRights: [
      "Escalate to Duty Manager when room delay exceeds recovery threshold",
      "Escalate when guest sentiment deteriorates beyond standard resolution",
      "Escalate when a request falls outside role authority",
    ],
    evidenceResponsibilities: [
      "Record guest acknowledgement delivery",
      "Log task assignment and completion timestamps",
      "Capture guest communication record",
    ],
    communicationPermissions: [
      "Send approved guest acknowledgements and standard service messages",
      "Send internal task handoff notifications to Housekeeping and Duty Manager",
      "Must not send compensation offers or recovery commitments without Duty Manager approval",
    ],
  },
  {
    id: "guest-services",
    name: "Guest Services",
    level: "frontline",
    responsibilities: [
      "Coordinate guest requests throughout the stay",
      "Manage transport, activity and partner bookings",
      "Respond to disruption affecting guest arrivals or departures",
      "Provide in-stay assistance and information",
      "Monitor guest satisfaction signals and act on prompts",
    ],
    decisionRights: [
      "Action standard guest requests and bookings",
      "Send approved guest notifications about disruption or changes",
      "Confirm transport and activity alternatives",
      "Escalate or close transport disruption cases within role authority",
    ],
    escalationRights: [
      "Escalate to Duty Manager when no approved alternative is available",
      "Escalate when a high-impact guest is affected and requires senior ownership",
    ],
    evidenceResponsibilities: [
      "Record partner activation and transport confirmation",
      "Log guest notification delivery",
      "Capture revised arrival or itinerary record",
    ],
    communicationPermissions: [
      "Send approved guest disruption notices and alternative offers",
      "Send partner activation requests through approved channels",
      "Must not commit to compensation without Duty Manager approval",
    ],
  },
  {
    id: "concierge",
    name: "Concierge",
    level: "frontline",
    responsibilities: [
      "Provide personalised guest assistance and recommendations",
      "Coordinate premium guest experience and VIP protocols",
      "Manage partner activations for dining, activities and experiences",
      "Review and action JALDO opportunity prompts for eligible guests",
    ],
    decisionRights: [
      "Recommend and present approved offers to eligible guests",
      "Action partner referrals and activations within approved inventory",
      "Confirm guest preferences and personalise service delivery",
    ],
    escalationRights: [
      "Escalate to Revenue and Loyalty Lead when commercial approval is required",
      "Escalate to Duty Manager when a guest interaction escalates beyond concierge authority",
    ],
    evidenceResponsibilities: [
      "Record offer approval and delivery",
      "Log partner activation confirmation",
      "Capture guest response and outcome",
    ],
    communicationPermissions: [
      "Deliver approved personalised guest messages after required approval",
      "Send partner activation requests",
      "Must not send guest-facing commercial offers without Revenue and Loyalty Lead approval",
    ],
  },
  {
    id: "housekeeping",
    name: "Housekeeping",
    level: "frontline",
    responsibilities: [
      "Maintain room readiness to property standard",
      "Prioritise rooms against guest arrival schedule",
      "Respond to housekeeping task prompts from JALDO",
      "Report maintenance defects identified during service",
      "Complete room service and turndown within SLA",
    ],
    decisionRights: [
      "Reprioritise room queue when instructed by Duty Manager or operations system",
      "Flag a room as blocked where a defect prevents safe occupation",
    ],
    escalationRights: [
      "Escalate to Duty Manager when a room cannot be made ready within the window",
      "Escalate maintenance defects requiring safety assessment",
    ],
    evidenceResponsibilities: [
      "Log task start and completion timestamps",
      "Record maintenance defect reports with asset and room details",
      "Confirm room readiness status in the operational system",
    ],
    communicationPermissions: [
      "Receive internal task prompts and reallocation instructions",
      "Send status updates to Duty Manager and Front Office",
      "Must not communicate directly with guests about room status without Front Office coordination",
    ],
  },
  {
    id: "maintenance-lead",
    name: "Maintenance Lead",
    level: "frontline",
    responsibilities: [
      "Respond to maintenance defect reports",
      "Assess and classify defects by safety and guest impact",
      "Coordinate repair and asset remediation",
      "Maintain evidence of defect history and repair completion",
      "Support Duty Manager on repair or relocation decisions",
    ],
    decisionRights: [
      "Classify defect severity and required response",
      "Assign repair tasks within maintenance team",
      "Isolate a room or asset where a safety defect is identified",
    ],
    escalationRights: [
      "Escalate to Duty Manager where safety classification requires guest relocation",
      "Escalate repeat defects to General Manager for asset review",
    ],
    evidenceResponsibilities: [
      "Record defect report, classification and repair action",
      "Log repair completion with timestamp and technician record",
      "Maintain defect history for repeat-fault detection",
    ],
    communicationPermissions: [
      "Send internal maintenance status updates to Duty Manager and Housekeeping",
      "Must not communicate directly with guests about defect status",
    ],
  },
  {
    id: "duty-manager",
    name: "Duty Manager",
    level: "manager",
    responsibilities: [
      "Hold primary accountability for guest experience during shift",
      "Approve recovery decisions and compensation within authority",
      "Respond to escalated service failures, welfare events and safety incidents",
      "Own escalated scenario closure and evidence sign-off",
      "Brief General Manager on high-impact events",
    ],
    decisionRights: [
      "Approve room upgrades, relocations and compensation within property authority matrix",
      "Authorise escalated recovery actions",
      "Close welfare and safety incidents after review",
      "Approve guest-facing recovery communications",
    ],
    escalationRights: [
      "Escalate to General Manager when incident exceeds Duty Manager authority",
      "Escalate to Safety and Security Lead for welfare and safety events",
      "Escalate to Operations Manager when operational capacity is the root cause",
    ],
    evidenceResponsibilities: [
      "Record escalation ownership and decision",
      "Sign off closure of welfare and safety events",
      "Confirm compensation approval records",
      "Review and approve evidence completeness before incident closure",
    ],
    communicationPermissions: [
      "Approve guest recovery communications above standard thresholds",
      "Send approved escalation notifications to department leads",
      "Initiate internal welfare and safety escalation communications",
    ],
  },
  {
    id: "operations-manager",
    name: "Operations Manager",
    level: "manager",
    responsibilities: [
      "Manage operational capacity, staffing and service level compliance",
      "Respond to service backlogs and staffing pressure events",
      "Oversee department task completion and SLA monitoring",
      "Coordinate cross-department resource reallocation",
    ],
    decisionRights: [
      "Approve staff reallocation across departments",
      "Defer non-urgent tasks to protect guest-facing priority",
      "Escalate resource failures to General Manager",
    ],
    escalationRights: [
      "Escalate to General Manager when operational failure cannot be resolved within shift",
    ],
    evidenceResponsibilities: [
      "Record reallocation decisions and rationale",
      "Log backlog clearance and SLA breach data",
      "Review capacity-pattern reports for recurring operational issues",
    ],
    communicationPermissions: [
      "Send internal operational briefings and reallocation instructions",
      "Receive and action JALDO backlog and pressure alerts",
      "Must not send guest-facing communications without Duty Manager approval",
    ],
  },
  {
    id: "safety-security-lead",
    name: "Safety and Security Lead",
    level: "manager",
    responsibilities: [
      "Own the safety, welfare and security escalation pathway",
      "Respond to guest welfare events, security concerns and emergency situations",
      "Maintain safety procedures and governance compliance",
      "Conduct or coordinate post-incident reviews",
    ],
    decisionRights: [
      "Activate security and emergency protocols",
      "Restrict or control access in safety-critical situations",
      "Approve welfare-sensitive communications",
      "Determine whether emergency services are required",
    ],
    escalationRights: [
      "Escalate to General Manager and external emergency services when required",
      "Engage specialist welfare or medical support as needed",
    ],
    evidenceResponsibilities: [
      "Record welfare and safety event details within privacy constraints",
      "Log escalation actions and external notifications",
      "Complete post-incident review documentation",
    ],
    communicationPermissions: [
      "Control communication during active welfare and safety events",
      "Send internal safety escalation notifications",
      "Restrict automated guest communications during welfare events",
    ],
  },
  {
    id: "revenue-loyalty-lead",
    name: "Revenue and Loyalty Lead",
    level: "manager",
    responsibilities: [
      "Govern commercial opportunity activation within the guest experience",
      "Approve personalised offers and partner commercial activations",
      "Monitor loyalty status and guest commercial eligibility",
      "Review commercial outcome attribution and value measurement",
    ],
    decisionRights: [
      "Approve personalised offers before guest delivery",
      "Approve partner activations within commercial policy",
      "Set offer frequency and consent controls",
    ],
    escalationRights: [
      "Escalate to General Manager when a commercial activation raises guest trust or brand risk",
    ],
    evidenceResponsibilities: [
      "Record offer approval and delivery confirmation",
      "Log guest response and commercial outcome",
      "Maintain value attribution records",
    ],
    communicationPermissions: [
      "Approve guest-facing commercial and loyalty communications",
      "Send approved commercial offer briefs to Concierge",
    ],
  },
  {
    id: "general-manager",
    name: "General Manager",
    level: "property",
    responsibilities: [
      "Hold ultimate accountability for property operations, guest experience and staff performance",
      "Review high-impact incidents and authorise responses beyond Duty Manager authority",
      "Own playbook and policy governance at property level",
      "Review operational and commercial performance reports",
    ],
    decisionRights: [
      "Approve recovery actions and compensation exceeding Duty Manager authority",
      "Authorise emergency protocols and external escalation",
      "Approve playbook updates and local governance rules",
    ],
    escalationRights: [
      "Escalate to Regional Operations for cross-property issues",
      "Engage external emergency, legal or safety authorities",
    ],
    evidenceResponsibilities: [
      "Review high-impact incident evidence and sign off closure",
      "Maintain property-level audit readiness",
    ],
    communicationPermissions: [
      "Approve all communications above Duty Manager authority",
      "Communicate with partner and funder leadership on operational matters",
    ],
  },
  {
    id: "regional-operations",
    name: "Regional Operations",
    level: "regional",
    responsibilities: [
      "Oversee operational performance across a group of properties",
      "Identify recurring patterns and improvement opportunities",
      "Support property leaders on high-impact escalations",
      "Review cross-property playbook effectiveness",
    ],
    decisionRights: [
      "Approve cross-property resource and playbook changes",
      "Escalate systemic issues to Group Operations",
    ],
    escalationRights: [
      "Escalate to Group Operations for systemic or portfolio-level issues",
    ],
    evidenceResponsibilities: [
      "Review portfolio evidence and outcome patterns",
      "Confirm cross-property learning and playbook improvements",
    ],
    communicationPermissions: [
      "Communicate operational guidance to General Managers",
      "Receive portfolio-level JALDO performance reports",
    ],
  },
  {
    id: "group-operations",
    name: "Group Operations",
    level: "group",
    responsibilities: [
      "Set operating standards and policies across the property group",
      "Review portfolio-level JALDO performance and risk",
      "Approve governance and playbook standards",
    ],
    decisionRights: [
      "Approve portfolio-wide operational and governance changes",
      "Authorise new operating system activations across the portfolio",
    ],
    escalationRights: [
      "Escalate to partner or funder leadership for systemic or strategic risk",
    ],
    evidenceResponsibilities: [
      "Review group-level audit and compliance evidence",
    ],
    communicationPermissions: [
      "Communicate governance and standard updates to Regional Operations",
    ],
  },
  {
    id: "partner-service-provider",
    name: "Partner / Service Provider",
    level: "partner",
    responsibilities: [
      "Deliver contracted services activated through JALDO (transport, dining, activities)",
      "Confirm activation and delivery of partner bookings",
      "Provide feedback on referral and conversion outcomes",
    ],
    decisionRights: [
      "Confirm availability and accept or decline activations within partner agreement",
    ],
    escalationRights: [
      "Escalate delivery failures to Guest Services or Concierge",
    ],
    evidenceResponsibilities: [
      "Confirm booking and delivery records through approved partner channel",
    ],
    communicationPermissions: [
      "Receive activation requests through approved partner channel",
      "Send delivery confirmations back through the same channel",
    ],
  },
];

/** Lookup a role by ID — returns undefined if not found. */
export function getTravelRole(id: string): TravelRole | undefined {
  return TRAVEL_ROLES.find(r => r.id === id);
}

/** All valid role IDs — use to validate references in scenarios and playbooks. */
export const TRAVEL_ROLE_IDS = TRAVEL_ROLES.map(r => r.id);
