export type CcPriority = "CRITICAL" | "HIGH" | "ELEVATED" | "STANDARD";
export type CcStatus  = "EXECUTING" | "ROUTED" | "RESOLVED" | "MONITORING" | "ACTIVE";

export interface CcRow {
  id: string;
  time: string;
  signal: string;
  source: string;
  priority: CcPriority;
  conf: number;
  action: string;
  engine: string;
  owner: string;
  ownerRole: string;
  status: CcStatus;
  outcome: string;
  playbookId: string;
  relatedMoment?: string;
  momentId: string;
}

export const INITIAL_CC_ROWS: CcRow[] = [
  {
    id: "SIG-4471",
    time: "12:46",
    signal: "Guest distress detected · Room 412",
    source: "In-room sensor + zero movement 22 min",
    priority: "CRITICAL",
    conf: 96,
    action: "Initiate welfare protocol. Dispatch duty manager. Activate silent alert.",
    engine: "BXOS · 96% conf",
    owner: "J. Halliday",
    ownerRole: "Duty Manager",
    status: "EXECUTING",
    outcome: "—",
    playbookId: "PB-001",
    momentId: "GM-001",
  },
  {
    id: "SIG-4468",
    time: "12:43",
    signal: "Foyer capacity threshold exceeded",
    source: "Occupancy sensor + PMS arrival forecast +34%",
    priority: "HIGH",
    conf: 89,
    action: "Open overflow desk. Redirect to mobile check-in. Assign 2 additional floor staff.",
    engine: "BXOS · 89% conf",
    owner: "A. Osei",
    ownerRole: "Front Desk Lead",
    status: "ROUTED",
    outcome: "—",
    playbookId: "PB-005",
    relatedMoment: "Staff Capacity Gap",
    momentId: "OP-001",
  },
  {
    id: "SIG-4461",
    time: "12:38",
    signal: "First-stay guest disengagement · Ms. P. Chen",
    source: "No staff contact after check-in · 8 min elapsed",
    priority: "HIGH",
    conf: 82,
    action: "Proactive welcome contact. Service introduction. Assign guest liaison.",
    engine: "BXOS · 82% conf",
    owner: "M. Vance",
    ownerRole: "Concierge",
    status: "RESOLVED",
    outcome: "Guest engagement confirmed. Satisfaction signal positive.",
    playbookId: "PB-003",
    relatedMoment: "Loyalty Activation Window",
    momentId: "GM-003",
  },
  {
    id: "SIG-4449",
    time: "12:21",
    signal: "VIP arrival window misalignment · Mr. R. Nakamura",
    source: "PMS + flight data · ETA moved forward 40 min",
    priority: "CRITICAL",
    conf: 99,
    action: "Pre-stage suite. Brief escort team. Initiate arrival protocol.",
    engine: "BXOS · 99% conf",
    owner: "D. Pearce",
    ownerRole: "General Manager",
    status: "RESOLVED",
    outcome: "Arrival handled. Zero friction. Value protected.",
    playbookId: "PB-002",
    relatedMoment: "VIP Arrival",
    momentId: "GM-002",
  },
  {
    id: "SIG-4437",
    time: "11:58",
    signal: "Suite upgrade opportunity · Mr. J. Hartley",
    source: "Room 308 → Suite 501 · Returning guest + availability",
    priority: "STANDARD",
    conf: 78,
    action: "Offer complimentary upgrade. Personalise with prior preferences on file.",
    engine: "BXOS · 78% conf",
    owner: "C. Lim",
    ownerRole: "Guest Relations",
    status: "MONITORING",
    outcome: "Offer accepted. Activation confirmed. NPS impact positive.",
    playbookId: "PB-002",
    relatedMoment: "Suite Upgrade Window",
    momentId: "CM-001",
  },
];
