/**
 * Plain-language display text for engine records.
 *
 * The engine keeps machine identifiers (state names, role ids, ISO times,
 * execution ids) so its audit trail stays exact. These helpers only translate
 * those values for people; they never change what was recorded.
 */
import { TRAVEL_ROLES } from "@/data/travelRoles";
import type { ScenarioExecutionState } from "@/data/travelDeploymentConfig";
import { getStateLabel } from "@/lib/runtimeEngine";

export type OutcomeStatus = "met" | "not-met" | "pending";

export const OUTCOME_LABELS: Record<OutcomeStatus, string> = {
  met: "Outcome met",
  "not-met": "Outcome not met",
  pending: "Pending evidence",
};

export const FOLLOW_UP_REASON_LABELS: Record<string, string> = {
  "late-response": "response later than the 20-minute target",
  "ineffective-action": "action completed but the issue was not restored",
  "missing-receipt": "no synthetic delivery receipt recorded",
  "missing-measurement": "no follow-up measurement recorded",
};

const SIMULATED_ROLE_PREFIX = "synthetic-";

/** "duty-manager" → "Duty Manager"; "synthetic-duty-manager" → "Duty Manager (simulated)". */
export function roleLabel(roleId: string): string {
  const simulated = roleId.startsWith(SIMULATED_ROLE_PREFIX);
  const id = simulated ? roleId.slice(SIMULATED_ROLE_PREFIX.length) : roleId;
  const name = TRAVEL_ROLES.find(role => role.id === id)?.name
    ?? id.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  return simulated ? `${name} (simulated)` : name;
}

/** Replace any known role id inside free text (e.g. engine notes) with its name. */
export function withRoleNames(text: string): string {
  return TRAVEL_ROLES.reduce(
    (result, role) => result.replace(new RegExp(`\\b(${SIMULATED_ROLE_PREFIX})?${role.id}\\b`, "g"), match => roleLabel(match)),
    text,
  );
}

export function stateLabel(state: ScenarioExecutionState): string {
  const label = getStateLabel(state);
  return label.charAt(0) + label.slice(1).toLowerCase();
}

export function describeFollowUpReasons(reasons: string[]): string {
  return reasons.map(reason => FOLLOW_UP_REASON_LABELS[reason] ?? reason.replaceAll("-", " ")).join("; ");
}

/** "2026-10-08T07:55:36.557Z" → "07:55" in the viewer's time zone. */
export function formatRecordedTime(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export interface AuditLine {
  /** What happened, in plain language. */
  title: string;
  /** Who or what it concerned, when that helps. */
  detail?: string;
  /** The original engine record, kept for technical review. */
  technical: string;
}

/** Translate one engine audit entry. The original step and detail are kept in `technical`. */
export function describeAuditEntry(entry: { step: string; detail: string }): AuditLine {
  const technical = `${entry.step}: ${entry.detail}`;
  // Hotel cases record the owner's role id; other traces record a short note. Only call a role an owner.
  const isRole = TRAVEL_ROLES.some(r => r.id === entry.detail);
  const role = () => isRole ? roleLabel(entry.detail) : withRoleNames(entry.detail);
  const owner = () => isRole ? `Owner: ${roleLabel(entry.detail)}` : withRoleNames(entry.detail);
  switch (entry.step) {
    case "signal-received": return { title: "Signal received", technical };
    case "understanding": return { title: "Signal validated", detail: owner(), technical };
    case "decision-required": return { title: "Moment classified; a decision is required", detail: owner(), technical };
    case "approval-required": return { title: "Waiting for approval", detail: owner(), technical };
    case "approval": return { title: "Approved", detail: `By ${roleLabel(entry.detail.replace(/^Synthetic actor:\s*/, ""))} (scripted test actor)`, technical };
    case "delegated-authority": return { title: "Decided within delegated authority", detail: `By ${roleLabel(entry.detail.replace(/^Synthetic actor:\s*/, ""))} (scripted test actor)`, technical };
    case "in-action": return { title: "Action under way", detail: owner(), technical };
    case "mock-dispatch": return { title: "Simulated action dispatched", detail: "Nothing was sent outside this demonstration", technical };
    case "outcome-verification": {
      const [outcome, reasons = ""] = entry.detail.split(/:\s*/, 2);
      const label = OUTCOME_LABELS[outcome as OutcomeStatus] ?? outcome;
      const why = reasons && !reasons.startsWith("receipt + restored") ? describeFollowUpReasons(reasons.split(/,\s*/)) : "synthetic receipt recorded, issue restored within 20 minutes";
      return { title: `Follow-up checked: ${label.toLowerCase()}`, detail: why, technical };
    }
    case "escalated": return { title: "Escalated to the owner", detail: role(), technical };
    case "resolved": return { title: "Resolved", detail: owner(), technical };
    case "closed": return { title: "Closed with required evidence", detail: owner(), technical };
    case "prior-observation-retained": return { title: "Earlier follow-up kept on record", detail: "Later evidence was added without replacing it", technical };
    case "reviewed-learning-replay": return { title: "Replayed the same signal under the approved change", detail: "A new execution; the original record is unchanged", technical };
    case "reopened-from": return { title: "Reopened from an earlier closed case", technical };
    default: return { title: entry.step.replaceAll("-", " "), detail: withRoleNames(entry.detail), technical };
  }
}

export interface PolicySettings { responseMinutes: number; interventionAttempts: number; receiptAttempts: number }

export interface PolicyChange { setting: string; from: string; to: string }

const POLICY_SETTINGS: Array<{ key: keyof PolicySettings; label: string; unit: (n: number) => string }> = [
  { key: "responseMinutes", label: "Respond within", unit: n => `${n} minutes` },
  { key: "interventionAttempts", label: "Intervention attempts before escalation", unit: n => `${n}` },
  { key: "receiptAttempts", label: "Delivery receipt attempts", unit: n => `${n}` },
];

/** Only the settings a proposal actually changes, in words. */
export function describePolicyChanges(before: PolicySettings, after: PolicySettings): PolicyChange[] {
  return POLICY_SETTINGS
    .filter(({ key }) => before[key] !== after[key])
    .map(({ key, label, unit }) => ({ setting: label, from: unit(before[key]), to: unit(after[key]) }));
}

const ENGINE_NOTE_LABELS: Record<string, string> = {
  "Simulation Lab synthetic step": "Simulated step",
  "Synthetic closed-loop test": "Simulated step",
  "Execution started": "Execution started",
};

/** Notes the runtime engine attaches to state changes, with role ids replaced by names. */
export function describeEngineNote(note: string | undefined): string {
  if (!note) return "";
  return ENGINE_NOTE_LABELS[note] ?? withRoleNames(note);
}
