// Review-path setup. Each path starts from the guest's request and applies REAL commands to the kernel, as the roles that would
// take them, in order. A refusal stops the setup and is reported. This is scripted use of Core, not playback of a recording.
import type { Command } from "@workspace/jaldo-orchestration";
import type { DemoRoleId, Session } from "./session";

type Step = [DemoRoleId, Command];
const CHECKS4 = { recipient: true, purpose: true, fields: true, authority: true };
const ACCEPT3 = { scope: true, conflict: true, capacity: true };
const accept: Step = ["duty-lead", { type: "acceptRequest", checks: { authority: true, noConflict: true, capacity: true } }];
const recv = (role: DemoRoleId, id: string): Step[] => [[role, { type: "receive", actionId: id }], [role, { type: "accept", actionId: id, checks: ACCEPT3 }]];

const checks: Step[] = [
  ["duty-lead", { type: "approve", actionId: "SPC-1", checks: CHECKS4 }], ["duty-lead", { type: "approve", actionId: "CAP-1", checks: CHECKS4 }],
  ["duty-lead", { type: "execute", actionId: "SPC-1" }], ["duty-lead", { type: "execute", actionId: "CAP-1" }],
  ...recv("reception", "SPC-1"), ...recv("housekeeping", "CAP-1"),
];
const agreement: Step[] = [["guest", { type: "approve", actionId: "SGS-1", checks: CHECKS4 }], ["duty-lead", { type: "execute", actionId: "SGS-1" }], ...recv("guest-services", "SGS-1")];
const approveHandover: Step[] = [["duty-lead", { type: "approve", actionId: "SUP-1", checks: CHECKS4 }]];
const deliver: Step[] = [["duty-lead", { type: "execute", actionId: "SUP-1" }], ...recv("guest-services", "SUP-1"), ["guest-services", { type: "complete", actionId: "SUP-1" }]];
// Core prepares and puts forward the plan's steps itself once the request is accepted, so nothing is submitted by hand here.
const prepared: Step[] = [accept];
const throughApproval: Step[] = [...prepared, ...checks, ...agreement, ...approveHandover];

export const SCRIPTS: Record<string, Step[]> = {
  normal: [],
  missing: prepared,
  capacity: throughApproval,
  dependency: [...throughApproval, ["duty-lead", { type: "linkWork", kindId: "area-safety-clearance", reference: "SC-77", status: "unknown" }]],
  didnothelp: [...throughApproval, ...deliver],
  noresponse: [...throughApproval, ...deliver],
  maintenance: [...throughApproval, ["duty-lead", { type: "linkWork", kindId: "facility-repair", reference: "WO-1182", status: "open" }], ...deliver, ["guest", { type: "confirm", actionId: "SUP-1" }]],
};

export function runPath(s: Session, id: string): { ok: true } | { ok: false; message: string } {
  s.reset();
  // Starting from signals, every path except the first adopts the recognised moment as the Duty lead, then carries on as before.
  if (s.origin === "signals" && (SCRIPTS[id] ?? []).length > 0) {
    const a = s.adopt("duty-lead");
    if (!a.ok) return { ok: false, message: `Setup stopped: adopting the recognised moment was refused (${a.code}): ${a.message}` };
  }
  for (const [role, command] of SCRIPTS[id] ?? []) {
    const r = s.apply(role, command);
    if (!r.ok) return { ok: false, message: `Setup stopped: Core refused ${command.type} as ${role} (${r.code}): ${r.message}` };
  }
  return { ok: true };
}
