/**
 * A concrete pilot scope: properties, accountable people, selected moments,
 * baseline, measures, integration prerequisites and the review decision.
 *
 * Built from existing models: pilot scenarios and measures (travelPilotModel),
 * integrations (travelIntegrations), security requirements (securityPosture) and
 * commercial components (travelCommercialModel, all subject to proposal).
 * Nothing is sent: the scope is summarised for the visitor to copy, download or
 * email themselves.
 */
import { PILOT_PROPOSITION, PILOT_SCENARIOS, PILOT_SUCCESS_MEASURES } from "@/data/travelPilotModel";
import { TRAVEL_SCENARIOS } from "@/data/travelScenarios";
import { INTEGRATION_CATEGORIES, type IntegrationStatus } from "@/data/travelIntegrations";
import { PILOT_SECURITY_REQUIREMENTS } from "@/data/securityPosture";
import { COMMERCIAL_COMPONENTS, COMMERCIAL_STATUS_LABELS } from "@/data/travelCommercialModel";

export const MAX_PILOT_PROPERTIES = 5;
export const ENQUIRY_ADDRESS = "lance@rtbx.com.au";
/** Keep mailto links well inside what common email apps accept. */
export const MAILTO_BODY_LIMIT = 1800;

export interface ScopeProperty { name: string; type: string; rooms: string }

export type PeopleRole = "sponsor" | "pilotOwner" | "propertyLead" | "approver" | "measurementOwner" | "integrationOwner" | "portfolioOwner";

export const PEOPLE_ROLES: Array<{ id: PeopleRole; label: string; help: string; portfolioOnly?: boolean }> = [
  { id: "sponsor", label: "Executive sponsor", help: "Owns the review decision." },
  { id: "pilotOwner", label: "Pilot owner", help: "Runs the pilot day to day." },
  { id: "propertyLead", label: "Property lead", help: "General Manager or equivalent at each property." },
  { id: "approver", label: "Approval role", help: "Approves recovery actions, usually the Duty Manager." },
  { id: "measurementOwner", label: "Measurement owner", help: "Records the baseline and the pilot measures." },
  { id: "integrationOwner", label: "Integration and security owner", help: "Approves system access and data handling." },
  { id: "portfolioOwner", label: "Portfolio exception owner", help: "Decides exceptions that cross properties.", portfolioOnly: true },
];

export type BaselineMethod = "manual-log" | "system-export" | "sampled-observation";
export const BASELINE_METHODS: Record<BaselineMethod, string> = {
  "manual-log": "Manual log kept by the team",
  "system-export": "Export from existing systems (PMS, task tool)",
  "sampled-observation": "Sampled observation of shifts",
};

export interface PilotScope {
  properties: ScopeProperty[];
  people: Partial<Record<PeopleRole, string>>;
  momentIds: string[];
  baseline: { method: BaselineMethod; weeks: number };
  measureIds: string[];
  review: { weeksAfterStart: number; criteria: string };
}

export interface ValueSnapshot {
  sites: number;
  roomsPerSite: number;
  /** Base-case net monthly impact hypothesis from the Calculator. */
  baseMonthly: number;
  lowMonthly: number;
  highMonthly: number;
  costIncluded: boolean;
}

export const DEFAULT_MEASURE_IDS = ["sm-time-to-ack", "sm-time-to-resolve", "sm-evidence-completion", "sm-approval-completed"];

export function defaultPilotScope(): PilotScope {
  return {
    properties: [{ name: "", type: "", rooms: "" }],
    people: {},
    momentIds: PILOT_SCENARIOS.filter(item => item.role === "primary").map(item => item.scenarioId),
    baseline: { method: "manual-log", weeks: 4 },
    measureIds: [...DEFAULT_MEASURE_IDS],
    review: { weeksAfterStart: 12, criteria: "" },
  };
}

export const scenarioTitle = (id: string) => TRAVEL_SCENARIOS.find(item => item.id === id)?.title ?? id;
export const measureLabel = (id: string) => PILOT_SUCCESS_MEASURES.find(item => item.id === id)?.label ?? id;

/** Systems each pilot moment depends on, matched to the Integration Brief's categories. */
const MOMENT_SYSTEMS: Record<string, string[]> = {
  "repeat-guest-room-not-ready": ["Property Management Systems", "Housekeeping Platforms", "Guest Messaging"],
  "service-backlog": ["Task Management & Workforce", "Guest-Facing Applications"],
  "maintenance-defect": ["Maintenance Systems", "Task Management & Workforce"],
  "transport-disruption": ["Partner Systems", "Guest Messaging"],
};

export interface Prerequisite { title: string; status: IntegrationStatus | "Required"; detail: string }

export function integrationPrerequisites(momentIds: string[]): Prerequisite[] {
  const names = [...new Set(momentIds.flatMap(id => MOMENT_SYSTEMS[id] ?? []))];
  return INTEGRATION_CATEGORIES
    .filter(category => names.includes(category.title))
    .map(category => ({ title: category.title, status: category.status, detail: category.desc }));
}

export function securityPrerequisites(): Prerequisite[] {
  return PILOT_SECURITY_REQUIREMENTS.map(item => ({ title: item.title, status: "Required", detail: item.detail }));
}

/** Commercial components that apply to a pilot. Labelled with their status; none is approved pricing. */
export function pilotCommercialAssumptions() {
  return COMMERCIAL_COMPONENTS
    .filter(item => item.appliesTo.some(scope => /pilot/i.test(scope)))
    .map(item => ({ name: item.name, summary: item.summary, status: COMMERCIAL_STATUS_LABELS[item.status], note: item.note ?? "" }));
}

export const isPortfolio = (scope: PilotScope) => namedProperties(scope).length > 1;
const namedProperties = (scope: PilotScope) => scope.properties.filter(property => property.name.trim());

export function requiredRoles(scope: PilotScope) {
  return PEOPLE_ROLES.filter(role => !role.portfolioOnly || isPortfolio(scope));
}

/** What still has to be agreed before the scope can be shared as complete. */
export function scopeGaps(scope: PilotScope): string[] {
  const gaps: string[] = [];
  if (!namedProperties(scope).length) gaps.push("Name at least one property");
  for (const role of requiredRoles(scope)) if (!scope.people[role.id]?.trim()) gaps.push(`Name the ${role.label.toLowerCase()}`);
  if (!scope.momentIds.length) gaps.push("Select at least one moment");
  if (scope.baseline.weeks < 2) gaps.push("Run the baseline for at least two weeks");
  if (!scope.measureIds.length) gaps.push("Select at least one measure");
  if (!scope.review.criteria.trim()) gaps.push("State what the review decision will be based on");
  return gaps;
}

const money = (n: number) => `${n < 0 ? "-" : ""}$${Math.round(Math.abs(n)).toLocaleString("en-AU")}`;

export function scopeSummary(scope: PilotScope, value: ValueSnapshot | null): string {
  const properties = namedProperties(scope);
  const lines = [
    "JALDO Travel — proposed pilot scope (draft for discussion)",
    "",
    "PROPERTIES",
    ...(properties.length ? properties.map(p => `- ${p.name}${p.type ? `, ${p.type}` : ""}${p.rooms ? `, ${p.rooms} rooms` : ""}`) : ["- To be agreed"]),
    "",
    "ACCOUNTABLE PEOPLE",
    ...requiredRoles(scope).map(role => `- ${role.label}: ${scope.people[role.id]?.trim() || "to be named"}`),
    "",
    "SELECTED MOMENTS",
    ...(scope.momentIds.length ? scope.momentIds.map(id => `- ${scenarioTitle(id)}`) : ["- To be agreed"]),
    "",
    "BASELINE",
    `- ${BASELINE_METHODS[scope.baseline.method]}, for ${scope.baseline.weeks} weeks before the pilot starts`,
    "",
    "MEASURES",
    ...(scope.measureIds.length ? scope.measureIds.map(id => `- ${measureLabel(id)}`) : ["- To be agreed"]),
    "",
    "INTEGRATION PREREQUISITES",
    ...integrationPrerequisites(scope.momentIds).map(p => `- ${p.title} (${p.status})`),
    ...securityPrerequisites().map(p => `- ${p.title} (required before live data)`),
    "",
    "REVIEW DECISION",
    `- ${scope.review.weeksAfterStart} weeks after the pilot starts, decided by ${scope.people.sponsor?.trim() || "the executive sponsor"}: continue to wider rollout, extend with changes, or stop`,
    `- Based on: ${scope.review.criteria.trim() || "to be agreed"}`,
    "",
    "VALUE HYPOTHESIS (MODELLED, NOT A FORECAST)",
    value
      ? `- From the Calculator: ${value.sites} site(s) × ${value.roomsPerSite} rooms; net monthly impact hypothesis ${money(value.lowMonthly)} / ${money(value.baseMonthly)} / ${money(value.highMonthly)} (low / base / high)${value.costIncluded ? "" : "; programme cost not included"}`
      : "- Not yet modelled in the Calculator",
    "",
    "COMMERCIAL ASSUMPTIONS (FROM THE EXISTING MODEL; SUBJECT TO PROPOSAL, NOT A QUOTE)",
    ...pilotCommercialAssumptions().map(c => `- ${c.name}: ${c.status}`),
    `- ${PILOT_PROPOSITION.durationNote}`,
    "",
    "All Partner Room data is synthetic. This scope is a draft; nothing has been agreed or sent.",
  ];
  const gaps = scopeGaps(scope);
  if (gaps.length) lines.push("", "STILL TO AGREE", ...gaps.map(gap => `- ${gap}`));
  return lines.join("\n");
}

/** A mailto link the visitor's own email app opens. Long scopes are shortened with a pointer to the full copy. */
export function scopeMailto(summary: string): { href: string; truncated: boolean } {
  const truncated = summary.length > MAILTO_BODY_LIMIT;
  const body = truncated
    ? `${summary.slice(0, MAILTO_BODY_LIMIT)}\n\n[Shortened to fit an email link. The full scope is in the copied or downloaded text.]`
    : summary;
  return {
    href: `mailto:${ENQUIRY_ADDRESS}?subject=${encodeURIComponent("Pilot scope — JALDO Travel")}&body=${encodeURIComponent(body)}`,
    truncated,
  };
}
