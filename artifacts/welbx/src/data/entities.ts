export const PROPERTIES = [
  { id: "gml", label: "Grand Meridian", city: "London" },
  { id: "tce", label: "The Cartwright", city: "Edinburgh" },
  { id: "hdl", label: "Hotel du Lac",   city: "Geneva" },
  { id: "mps", label: "Meridian Palace", city: "Singapore" },
  { id: "gmd", label: "Grand Meridian",  city: "Dubai" },
] as const;

export type PropertyId = typeof PROPERTIES[number]["id"];

export const ROLES = [
  { id: "gm",         label: "GM",       full: "General Manager"      },
  { id: "ops",        label: "OPS",      full: "Operations Director"  },
  { id: "commercial", label: "COM",      full: "Commercial Director"  },
  { id: "director",   label: "DIR",      full: "Group Director"       },
] as const;

export type RoleId = typeof ROLES[number]["id"];

export const PERIODS = [
  { id: "7d",  label: "7 days"  },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
] as const;

export type PeriodId = typeof PERIODS[number]["id"];

export const MOMENT_IDS = {
  QUEUE_PRESSURE:       "GM-003",
  VIP_ARRIVAL:          "GM-001",
  HOUSEKEEPING_BOTTLENECK: "GM-011",
  GUEST_SENTIMENT:      "GM-002",
  SERVICE_RECOVERY:     "GM-004",
  DINING_ACTIVATION:    "GM-009",
} as const;

export const SIGNAL_IDS = {
  ROOM_READINESS:     "SIG-007",
  QUEUE_DEPTH:        "SIG-003",
  LOYALTY_GAP:        "SIG-004",
  ARRIVAL_SENTIMENT:  "SIG-001",
  STAFF_CAPACITY:     "SIG-011",
  RESPONSE_LATENCY:   "SIG-014",
} as const;
