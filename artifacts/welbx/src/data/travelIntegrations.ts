/** Systems a JALDO Travel pilot could connect, and how far each connection has got. */
export type IntegrationStatus = "Working Proof" | "Connector-ready" | "Planned";

export const INTEGRATION_STATUS_COLORS: Record<IntegrationStatus, string> = {
  "Working Proof": "#10b981", "Connector-ready": "#3b82f6", Planned: "#f97316",
};

export const INTEGRATION_CATEGORIES: { title: string; sub: string; desc: string; color: string; status: IntegrationStatus }[] = [
  {
    title: "Property Management Systems",
    sub: "PMS",
    desc: "Arrival manifests, room status, reservation data, loyalty tier, guest profile, check-in/out events.",
    color: "#a8dedb",
    status: "Planned",
  },
  {
    title: "Housekeeping Platforms",
    sub: "OPERATIONS",
    desc: "Room readiness pipeline, task assignment status, completion timestamps, staff capacity ratios.",
    color: "#a8dedb",
    status: "Planned",
  },
  {
    title: "Task Management & Workforce",
    sub: "WORKFORCE",
    desc: "Staff assignment, response latency, task completion rates, shift logs, handover quality signals.",
    color: "#3b82f6",
    status: "Planned",
  },
  {
    title: "Guest-Facing Applications",
    sub: "GUEST APP",
    desc: "In-stay requests, sentiment signals, complaint submissions, dining intent, service interaction data.",
    color: "#3b82f6",
    status: "Working Proof",
  },
  {
    title: "CRM & Loyalty Platforms",
    sub: "CRM / LOYALTY",
    desc: "Guest history, loyalty tier, preference profiles, spend patterns, prior stay records, cancellation signals.",
    color: "#a78bfa",
    status: "Planned",
  },
  {
    title: "Booking Engine",
    sub: "BOOKING",
    desc: "Reservation intent, arrival windows, party composition and booking-channel signals feeding early arrival detection.",
    color: "#a78bfa",
    status: "Planned",
  },
  {
    title: "Guest Messaging",
    sub: "MESSAGING",
    desc: "Two-way guest messaging. In this demonstration, messages are drafted for staff approval and never sent; a pilot would deliver them through the property's messaging provider and record receipts.",
    color: "#a78bfa",
    status: "Working Proof",
  },
  {
    title: "Maintenance Systems",
    sub: "MAINTENANCE",
    desc: "Work-order status, defect reports and technician scheduling feeding the Maintenance Defect scenario.",
    color: "#10b981",
    status: "Planned",
  },
  {
    title: "Payments",
    sub: "PAYMENTS",
    desc: "Spend patterns, refund and compensation triggers used in service-recovery and welfare playbooks.",
    color: "#10b981",
    status: "Planned",
  },
  {
    title: "Revenue Management Systems",
    sub: "RMS",
    desc: "Rate signals, occupancy patterns, activation exposure index, upsell window data, commercial triggers.",
    color: "#10b981",
    status: "Planned",
  },
  {
    title: "Building & IoT Infrastructure",
    sub: "BMS / IoT",
    desc: "Queue sensor data, environmental signals, energy anomalies, safety system triggers, HVAC status.",
    color: "#10b981",
    status: "Planned",
  },
  {
    title: "Partner Systems",
    sub: "PARTNER SYSTEMS",
    desc: "Local service, marketplace and loyalty partner systems activated through JALDO Travel at the right moment in the guest journey.",
    color: "#22d3ee",
    status: "Planned",
  },
];

