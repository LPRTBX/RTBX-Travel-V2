export type CcStatus = "EXECUTING" | "ROUTED" | "RESOLVED" | "MONITORING" | "ACTIVE";

export interface CcRow {
  id: string;
  momentId: string;
  status: CcStatus;
  playbookId: string;
  conf: number;
  outcome: string;
}

export const CC_ROWS: CcRow[] = [
  { id: "SIG-4471", momentId: "GM-001", status: "EXECUTING",  playbookId: "PB-001", conf: 96, outcome: "—" },
  { id: "SIG-4468", momentId: "OP-001", status: "ROUTED",     playbookId: "PB-005", conf: 89, outcome: "—" },
  { id: "SIG-4461", momentId: "GM-003", status: "RESOLVED",   playbookId: "PB-003", conf: 82, outcome: "Guest engagement confirmed. Satisfaction signal positive." },
  { id: "SIG-4449", momentId: "GM-002", status: "RESOLVED",   playbookId: "PB-002", conf: 99, outcome: "Arrival handled. Zero friction. Value protected." },
  { id: "SIG-4437", momentId: "CM-001", status: "MONITORING", playbookId: "PB-002", conf: 78, outcome: "Offer accepted. Activation confirmed. NPS impact positive." },
];
