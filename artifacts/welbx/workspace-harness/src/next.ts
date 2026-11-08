// Next steps and available commands, derived from Core. Core says WHO a step is waiting on (the plan's awaitingHuman and the
// assurance projection's nextStepOwner) and, by a dry run, WHICH commands it would accept from the selected role. This file only
// lists syntactically possible commands for the steps Core names; it holds no rule about when a command is allowed.
import { linksFor, partyOf, recipientView, subjectOf, subjectView, type Command, type GovernedAction } from "@workspace/jaldo-orchestration";
import { COMPLETE, GUEST_SHARE, LINK_REF, STEP, STOPS, VERB } from "./copy";
import { roleOf, type DemoRoleId, type Session } from "./session";

const CHECKS4 = { recipient: true, purpose: true, fields: true, authority: true };
const ACCEPT3 = { scope: true, conflict: true, capacity: true };

export interface Candidate { command: Command; label: string }
export interface NextStep { what: string; actionId: string | null; primary: Candidate | null; others: Candidate[] }
export interface Refusal { label: string; code: string; message: string }

/** The actions this role may know about, as Core's own projections define them. */
export function visibleActionIds(s: Session, role: DemoRoleId): Set<string> {
  const r = roleOf(role);
  if (r.kind === "holder") return new Set(s.state.actions.filter((a) => !a.heldBack).map((a) => a.id));
  if (r.kind === "subject") return new Set(subjectView(s.config, s.state, s.evidence).actions.map((a) => a.id));
  if (r.kind === "unit") return new Set(recipientView(s.config, s.state, s.evidence, r.party!).map((a) => a.id));
  return new Set();
}

const titleOf = (s: Session, a: GovernedAction) => `${STEP[a.typeId]?.title ?? a.typeId} (${a.id})`;

function forAction(s: Session, a: GovernedAction): Candidate[] {
  const t = s.config.actions.find((x) => x.id === a.typeId)!;
  const name = titleOf(s, a);
  const c = (command: Command, label: string): Candidate => ({ command, label });
  const out: Candidate[] = [
    c({ type: "submit", actionId: a.id }, `${VERB.submit} · ${name}`),
    c({ type: "approve", actionId: a.id, checks: CHECKS4 }, `${VERB.approve} · ${name}`),
    c({ type: "execute", actionId: a.id }, `${VERB.execute} · ${name}`),
    c({ type: "receive", actionId: a.id }, `${VERB.receive} · ${name}`),
    c({ type: "accept", actionId: a.id, checks: ACCEPT3 }, `${VERB.accept} · ${name}`),
    c({ type: "complete", actionId: a.id }, `${COMPLETE[a.typeId] ?? VERB.complete} · ${name}`),
    ...(t.responses ?? []).map((r) => c({ type: "recordResponse", actionId: a.id, responseId: r.id }, `${r.label} · ${name}`)),
    c({ type: "confirm", actionId: a.id }, `${VERB.confirm} it was done · ${name}`),
    c({ type: "recheck", actionId: a.id }, `${VERB.recheck} · ${name}`),
    ...s.config.declineReasons.map((d) => c({ type: "decline", actionId: a.id, reasonId: d.id }, `${VERB.decline}: ${d.label} · ${name}`)),
    c({ type: "refuse", actionId: a.id }, `${VERB.refuse} · ${name}`),
    c({ type: "revokeApproval", actionId: a.id }, `${VERB.revokeApproval} · ${name}`),
    c({ type: "withdraw", actionId: a.id }, `${VERB.withdraw} · ${name}`),
  ];
  for (const tpl of s.config.communications.filter((x) => x.trigger.actionType === a.typeId)) out.push(c({ type: "releaseCommunication", templateId: tpl.id, actionId: a.id }, `${VERB.releaseCommunication} · ${name}`));
  for (const f of (s.state.followUps ?? []).filter((x) => x.actionId === a.id)) for (const o of s.config.followUpOutcomes ?? []) out.unshift(c({ type: "closeFollowUp", followUpId: f.id, outcomeId: o.id }, `Close the follow-up: ${o.label}`));
  for (const d of (s.state.deadlines ?? []).filter((x) => x.subject.kind === "action" && x.subject.actionId === a.id)) {
    // The label and the command agree. Before the due time passes, "30 minutes later" is the recorded due time + 30. Once it has
    // passed, that instant could already be in the past (Core refuses a due time that is not later than now), so the control says
    // plainly that it gives 30 more minutes from now.
    const passed = s.clock.getTime() >= Date.parse(d.dueAt);
    const later = new Date(Math.max(Date.parse(d.dueAt), s.clock.getTime()) + 30 * 60_000);
    const at = later.toISOString().slice(11, 16);
    out.unshift(c({ type: "rescheduleDeadline", deadlineId: d.id, dueAt: later.toISOString(), reasonId: s.config.changeReasons![0].id }, `${passed ? "Give 30 more minutes from now" : VERB.rescheduleDeadline}, to ${at} UTC · ${name}`));
    out.push(c({ type: "cancelDeadline", deadlineId: d.id, reasonId: s.config.changeReasons![0].id }, `${VERB.cancelDeadline} · ${name}`));
  }
  return out;
}

function forType(s: Session, typeId: string): Candidate[] {
  return [{ command: { type: "propose", actionType: typeId }, label: `${VERB.propose}: ${STEP[typeId]?.title ?? typeId}` }];
}

function forLinks(s: Session, role: DemoRoleId): Candidate[] {
  const r = roleOf(role);
  const out: Candidate[] = [];
  if (r.kind === "holder") for (const k of s.config.linkKinds ?? []) out.push({ command: { type: "linkWork", kindId: k.id, reference: LINK_REF[k.id], status: k.dependency === "required" ? "unknown" : "open" }, label: `${VERB.linkWork} ${k.label.toLowerCase()} (${LINK_REF[k.id]}) as ${k.dependency === "required" ? "not yet known" : "open"}` });
  const visible = r.kind === "holder" ? (s.state.links ?? []).filter((l) => !l.withdrawn) : r.party ? linksFor(s.config, s.state, { party: r.party }) : [];
  for (const l of visible) {
    const k = s.config.linkKinds!.find((x) => x.id === l.kindId)!;
    out.push({ command: { type: "recordLinkStatus", linkId: l.id, status: "resolved" }, label: `${VERB.recordLinkStatus} ${k.label.toLowerCase()} (${l.reference}) as resolved` });
    out.push({ command: { type: "recordLinkStatus", linkId: l.id, status: "open" }, label: `${VERB.recordLinkStatus} ${k.label.toLowerCase()} (${l.reference}) as open` });
    if (r.kind === "holder") out.push({ command: { type: "withdrawLink", linkId: l.id }, label: `${VERB.withdrawLink} · ${k.label.toLowerCase()} (${l.reference})` });
  }
  return out;
}

/** What the guest reads on buttons that grant or withhold sharing. Same commands; Core still decides acceptance. */
function phrase(s: Session, role: DemoRoleId, c: Candidate): Candidate {
  if (roleOf(role).kind !== "subject" || !("actionId" in c.command)) return c;
  const a = s.state.actions.find((x) => x.id === (c.command as { actionId: string }).actionId);
  if (!a || !a.typeId.startsWith("share-")) return c;
  const unit = STEP[a.typeId].unit;
  const label = c.command.type === "approve" ? GUEST_SHARE.allow(unit) : c.command.type === "refuse" ? GUEST_SHARE.decline(unit) : c.command.type === "revokeApproval" ? GUEST_SHARE.takeBack(unit) : null;
  return label ? { ...c, label } : c;
}
const accepted = (s: Session, role: DemoRoleId, list: Candidate[]) => list.map((x) => phrase(s, role, x)).filter((x) => s.ask(role, x.command).ok);

/** Core's own list of what is waiting on this role, then the commands Core would accept for each. */
export function nextSteps(s: Session, role: DemoRoleId): NextStep[] {
  const r = roleOf(role);
  const visible = visibleActionIds(s, role);
  const subject = subjectOf(s.config).label;
  const unitLabel = r.party ? partyOf(s.config, r.party).label : null;
  const items: { what: string; actionId: string | null; typeId: string | null }[] = [];
  const holderWho = ["The request holder", "The addressed contact"];
  for (const h of s.report.plan.awaitingHuman) {
    const mine = r.kind === "holder" ? holderWho.includes(h.who) : r.kind === "subject" ? h.who === subject : unitLabel !== null && h.who === unitLabel;
    if (mine) items.push({ what: r.kind === "subject" && h.actionType?.startsWith("share-") ? GUEST_SHARE.step(STEP[h.actionType].unit) : h.what, actionId: h.actionId ?? null, typeId: h.actionType ?? null });
  }
  for (const a of s.assurance().actions) {
    const mine = r.kind === "subject" ? a.nextStepOwner === subject : unitLabel !== null && r.kind === "unit" && a.nextStepOwner === unitLabel;
    if (mine && visible.has(a.actionId) && !items.some((x) => x.actionId === a.actionId)) items.push({ what: `${STEP[a.actionType]?.title ?? a.actionType}: ${a.state.replaceAll("_", " ")}. Core says this is waiting on you.`, actionId: a.actionId, typeId: a.actionType });
  }
  const seen = new Set<string>();
  const result: NextStep[] = [];
  for (const it of items) {
    const key = `${it.actionId ?? ""}|${it.what}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const a = it.actionId ? s.state.actions.find((x) => x.id === it.actionId) : undefined;
    let list: Candidate[] = [];
    if (a) list = forAction(s, a);
    else if (r.kind === "holder" && it.typeId === null) list = [{ command: { type: "acceptRequest", checks: { authority: true, noConflict: true, capacity: true } }, label: VERB.acceptRequest }];
    else if (r.party && it.typeId === null) list = forLinks(s, role); // an item with no step, for a party: the status of its linked work
    if (it.typeId) list = [...list, ...forType(s, it.typeId)];
    const ok = accepted(s, role, list);
    const forward = ok.filter((x) => !STOPS.has(x.command.type));
    const stops = ok.filter((x) => STOPS.has(x.command.type));
    // Several answers to one question (the guest's own response) are peers: none is highlighted as the expected one.
    // The guest's choice to share is likewise theirs: allow and decline are equal, neither is the expected answer.
    const sharing = r.kind === "subject" && ok.some((x) => x.command.type === "approve");
    const peers = (forward.length > 1 && forward.some((x) => x.command.type === "recordResponse")) || sharing;
    result.push({ what: it.what, actionId: it.actionId, primary: peers ? null : (forward[0] ?? null), others: peers ? [...forward, ...stops] : [...forward.slice(1), ...stops] });
  }
  return result;
}

/** Everything else Core would accept from this role right now, within what the role may see. */
export function moreOptions(s: Session, role: DemoRoleId): Candidate[] {
  const visible = visibleActionIds(s, role);
  const r = roleOf(role);
  const list: Candidate[] = [];
  for (const a of s.state.actions.filter((x) => visible.has(x.id))) list.push(...forAction(s, a));
  if (r.kind === "holder") {
    for (const t of s.config.actions) list.push(...forType(s, t.id));
    list.push({ command: { type: "revisePlan", reasonId: s.config.changeReasons![0].id }, label: `${VERB.revisePlan}` });
  }
  list.push(...forLinks(s, role));
  return accepted(s, role, list);
}

/** What Core would refuse, with Core's own reason. Only commands about things this role may see. */
export function refusals(s: Session, role: DemoRoleId): Refusal[] {
  const visible = visibleActionIds(s, role);
  const r = roleOf(role);
  const list: Candidate[] = [];
  for (const a of s.state.actions.filter((x) => visible.has(x.id))) list.push(...forAction(s, a));
  if (r.kind === "holder") for (const t of s.config.actions) list.push(...forType(s, t.id));
  list.push(...forLinks(s, role));
  const out: Refusal[] = [];
  for (const raw of list) { const x = phrase(s, role, raw); const res = s.ask(role, x.command); if (!res.ok) out.push({ label: x.label, code: res.code, message: res.message }); }
  return out;
}

/** The commands Core would accept from this role for one action, of the given kinds (used by the attention panel's buttons). */
export function optionsFor(s: Session, role: DemoRoleId, actionId: string, kinds: readonly Command["type"][]): Candidate[] {
  const a = s.state.actions.find((x) => x.id === actionId);
  if (!a) return [];
  return accepted(s, role, forAction(s, a)).filter((c) => kinds.includes(c.command.type));
}
/** The commands Core would accept from this role to prepare a step of one type. */
export function typeOptions(s: Session, role: DemoRoleId, typeId: string): Candidate[] { return accepted(s, role, forType(s, typeId)); }
/** Plan-level and link commands Core would accept (for blocked work). */
export function planOptions(s: Session, role: DemoRoleId, kinds: readonly Command["type"][]): Candidate[] {
  const list: Candidate[] = [{ command: { type: "revisePlan", reasonId: s.config.changeReasons![0].id }, label: VERB.revisePlan }, ...forLinks(s, role)];
  return accepted(s, role, list).filter((c) => kinds.includes(c.command.type));
}
