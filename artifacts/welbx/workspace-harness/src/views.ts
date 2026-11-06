// What each role sees. Every function here takes the selected role and builds its content ONLY from Core's projections for that
// role (holderView, subjectView, recipientView, deadlinesFor, linksFor) and from evidence addressed to that role's audience.
// The holder's history, owners, follow-ups and other units' work are rendered for the holder alone.
import { GENERIC_RESTRICTION, deadlinesFor, holderView, isLive, linksFor, partyOf, recipientView, subjectOf, subjectView, type DeadlineRecord, type EvidenceRecord } from "@workspace/jaldo-orchestration";
import { DEADLINE_WORDS, DEPENDENCY_WORDS, FOLLOWUP_WORDS, LABELS, LINK_WORDS, PATHS, SITUATION, STATE_WORDS, STEP, STEP_STATUS, STRENGTH } from "./copy";
import { moreOptions, nextSteps, refusals, type Candidate, type NextStep } from "./next";
import { DEMO_ROLES, MEMBER_NAMES, roleOf, type DemoRoleId, type Session } from "./session";

export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const hhmm = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(11, 16) : "");
const cmdKey = (c: Candidate) => esc(JSON.stringify(c.command));
/** A deadline in words, from its own record. No comparison of lifecycle state: the words come from a lookup. */
const deadlineWords = (d: DeadlineRecord) => `${DEADLINE_WORDS[d.status]}${d.late === null ? ` (due ${hhmm(d.dueAt)} UTC)` : d.late ? " (after its due time)" : " (in time)"}`;
const title = (typeId: string) => STEP[typeId]?.title ?? typeId;

/** The audience key Core uses for a role's evidence. */
function audienceOf(role: DemoRoleId): string { const r = roleOf(role); return r.kind === "holder" ? "holder" : `party:${r.party}`; }

export interface Line { time: string; text: string; how: string; kind: string; actionId: string | null; byParty: boolean; attested: boolean }

/** Evidence addressed to this role, in this role's words (non-holders read the text Core wrote for the recipient). */
export function evidenceFor(s: Session, role: DemoRoleId): Line[] {
  const aud = audienceOf(role);
  const holder = role === "duty-lead";
  const subject = subjectOf(s.config).key;
  return s.evidence.filter((e) => e.audience.includes(aud)).map((e: EvidenceRecord) => {
    const who = e.actor === null ? "the system"
      : e.actor.kind === "party" ? partyOf(s.config, e.actor.id).label.replace(" (fictional)", "")
      : e.actor.kind === "system" ? "the system"
      : `${MEMBER_NAMES[e.actor.id] ?? "a member"}${e.actor.onBehalfOf ? ` for ${e.actor.onBehalfOf === subject ? "the guest" : partyOf(s.config, e.actor.onBehalfOf).label.replace(" (fictional)", "")}` : ""}`;
    return { time: hhmm(e.at), text: holder ? e.text : (e.recipientText ?? e.text), how: `${STRENGTH[e.strength] ?? e.strength}; by ${who}`, kind: e.kind, actionId: e.actionId, byParty: e.actor?.kind === "party", attested: e.strength === "attested" };
  });
}
const historyList = (lines: Line[]) =>
  `<ol class="wbs-list wbs-hist" aria-label="History">${lines.map((l) => `<li><time>${esc(l.time)}</time><span>${esc(l.text)}<br><span class="wbs-small">${esc(l.how)}</span></span></li>`).join("") || "<li>Nothing has been recorded for you yet.</li>"}</ol>`;

function nextCard(items: NextStep[], role: DemoRoleId, waitingOnOthers: string[]): string {
  if (items.length === 0) {
    return `<section class="wbs-next" aria-labelledby="next-h"><span class="wbs-k" id="next-h" tabindex="-1">Your next step</span><p class="do">Nothing is waiting for you right now.</p>${waitingOnOthers.length ? `<p class="wbs-small">Core shows the response is waiting on: ${esc(waitingOnOthers.join("; "))}</p>` : ""}</section>`;
  }
  const [first, ...rest] = items;
  const btn = (c: Candidate, cls: string) => `<button type="button" class="wbs-btn ${cls}" data-cmd="${cmdKey(c)}" data-focus="cmd">${esc(c.label)}</button>`;
  return `<section class="wbs-next" aria-labelledby="next-h" data-testid="next-step"><span class="wbs-k" id="next-h" tabindex="-1">Your next step</span>
    <p class="do">${esc(first.what)}</p>
    <div class="wbs-primary">${first.primary ? btn(first.primary, "main") : first.others.length ? `<p class="wbs-small">Choose one. None is the expected answer.</p><div class="wbs-alts">${first.others.map((c) => btn(c, "alt")).join("")}</div>` : `<p class="wbs-small">Core would not accept any command from this role for this step yet.</p>`}</div>
    ${first.primary && first.others.length ? `<details class="wbs-more"><summary>Other options for this step (${first.others.length})</summary><div class="wbs-alts">${first.others.map((c) => btn(c, "alt")).join("")}</div></details>` : ""}
    ${rest.length ? `<details class="wbs-more"><summary>Also waiting for you (${rest.length})</summary><ul class="wbs-list">${rest.map((x) => `<li>${esc(x.what)}${x.primary ? `<br>${btn(x.primary, "alt")}${x.others.length ? `<details class="wbs-more"><summary>Other options for this step (${x.others.length})</summary><div class="wbs-alts">${x.others.map((c) => btn(c, "alt")).join("")}</div></details>` : ""}` : x.others.length ? `<br><span class="wbs-small">Choose one. None is the expected answer.</span><div class="wbs-alts">${x.others.map((c) => btn(c, "alt")).join("")}</div>` : ""}</li>`).join("")}</ul></details>` : ""}
  </section>`;
}

function hero(s: Session, role: DemoRoleId): string {
  const r = roleOf(role);
  let k = "Your part of a fictional response", h = "A guest needs support. Your view shows only your own work.", body = "";
  if (r.kind === "holder") { k = SITUATION.eyebrow; h = SITUATION.title; body = SITUATION.body; }
  else if (r.kind === "subject") {
    const v = subjectView(s.config, s.state, s.evidence);
    k = "Your request · fictional demonstration"; h = "You asked for somewhere quiet and some practical help.";
    body = `You told the hotel: ${v.request.map((f) => `${f.label}: ${f.value}`).join(" · ") || "(nothing shared yet)"}. You decide who is told what, and you can see exactly what is shared.`;
  } else if (r.kind === "unit") {
    const mine = recipientView(s.config, s.state, s.evidence, r.party!);
    body = mine.length ? `You have been sent ${mine.length} item${mine.length === 1 ? "" : "s"}. Each shows only what you need.` : "Nothing has been sent to you yet.";
  } else body = "You own one piece of independent work. It is tracked beside this response and is never part of it.";
  return `<div class="wbs-hero"><div><span class="wbs-k">${esc(k)}</span><h2>${esc(h)}</h2><p class="wbs-lede">${esc(body)}</p></div>
    <figure class="wbs-photo"><img src="${SITUATION.image}" alt="${esc(SITUATION.imageAlt)}" width="480" height="360"><figcaption>Illustrative image, not a real guest or record.</figcaption></figure></div>`;
}

/** Holder view: the whole response. */
function holderSections(s: Session): string {
  const v = holderView(s.config, s.state, s.evidence, s.facts(), "member-a");
  if (!v) {
    // Before the addressed duty lead accepts, Core gives no holder view yet; they see only the request as it was sent to them.
    return `<section class="wbs-card" aria-labelledby="pre-h"><span class="wbs-k" id="pre-h">The request sent to you</span><ul class="wbs-list">${s.state.request.map((f) => `<li><strong>${esc(f.label)}:</strong> ${esc(f.value)}</li>`).join("")}</ul><p class="wbs-small">Accepting makes you the accountable holder. Until then Core shows no plan, history or owners.</p></section>`;
  }
  const assurance = v.assurance.actions;
  const owner = (id: string) => assurance.find((a) => a.actionId === id)?.nextStepOwner ?? "";
  const plan = v.plan.steps.map((st) => `<tr><td>${esc(title(st.actionType))}${st.actionId ? ` <span class="wbs-small">(${esc(st.actionId)})</span>` : ""}</td><td>${esc(STEP_STATUS[st.status] ?? st.status)}</td><td>${esc(st.authority === "standing-policy" ? "Standing policy" : st.authority)}</td><td>${st.waitingFor.length ? `<ul class="wbs-list">${st.waitingFor.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : "<span class='wbs-small'>Nothing outstanding</span>"}</td></tr>`).join("");
  const deadlines = v.coordination?.deadlines ?? [];
  const rows = v.actions.filter((a) => isLive(a)).map((a) => {
    const dl = deadlines.filter((d) => d.subject.kind === "action" && d.subject.actionId === a.id).map((d) => `${esc(s.config.deadlines!.find((x) => x.id === d.defId)!.label)}: ${esc(deadlineWords(d))}`).join("<br>");
    const ev = [a.sentAt ? `released ${hhmm(a.sentAt)}` : "", a.acceptedAt ? `accepted ${hhmm(a.acceptedAt)}` : "", a.completedAt ? `delivery reported ${hhmm(a.completedAt)}` : ""].filter(Boolean).join(" · ");
    const resp = (a.responses ?? []).map((r) => `${esc(s.config.actions.find((t) => t.id === a.typeId)!.responses!.find((x) => x.id === r.responseId)!.label)} (${hhmm(r.at)})`).join(" → ");
    return `<tr><td>${esc(title(a.typeId))} <span class="wbs-small">(${esc(a.id)})</span></td><td>${esc(STATE_WORDS[a.state] ?? a.state)}</td><td>${esc(owner(a.id))}</td><td>${dl || "<span class='wbs-small'>none</span>"}</td><td>${esc(ev) || "<span class='wbs-small'>nothing yet</span>"}${resp ? `<br><strong>Guest's own response:</strong> ${resp}` : ""}</td></tr>`;
  }).join("");
  const fu = (v.coordination?.followUps ?? []).map((f) => `<li><strong>${esc(f.id)}</strong> · ${FOLLOWUP_WORDS[f.status]} · owner: ${esc(MEMBER_NAMES[f.openedOwner ?? ""] ?? "the holder")}${f.outcomeId ? ` · outcome: ${esc(s.config.followUpOutcomes!.find((o) => o.id === f.outcomeId)!.label)}` : ""}<br><span class="wbs-small">Opened after the guest's own report. It does not change the delivery record.</span></li>`).join("");
  const links = (v.coordination?.links ?? []).map((l) => {
    const k = s.config.linkKinds!.find((x) => x.id === l.kindId)!;
    return `<li><strong>${esc(k.label)}</strong> (${esc(l.reference)}) · ${LINK_WORDS[l.status]} · owner: ${esc(partyOf(s.config, k.party).label)}<br><span class="wbs-small">${esc(DEPENDENCY_WORDS[k.dependency])}</span></li>`;
  }).join("");
  const prepared = v.plan.communications.map((c) => `<li>Prepared, not sent: ${esc(c.purpose)} <span class="wbs-small">(to ${esc(c.toLabel)})</span></li>`).join("");
  return `
    <section class="wbs-card" aria-labelledby="plan-h"><span class="wbs-k" id="plan-h">Agreed plan and outstanding checks</span>
      <div class="wbs-scroll"><table class="wbs-table"><thead><tr><th>Step</th><th>Status</th><th>Who approves</th><th>Waiting for</th></tr></thead><tbody>${plan}</tbody></table></div></section>
    <section class="wbs-card" aria-labelledby="own-h"><span class="wbs-k" id="own-h">Ownership, due times, delivery evidence and follow-up</span>
      <div class="wbs-scroll"><table class="wbs-table"><thead><tr><th>Step</th><th>State</th><th>Waiting on</th><th>Due</th><th>Delivery evidence and response</th></tr></thead><tbody>${rows || "<tr><td colspan='5'>Nothing prepared yet.</td></tr>"}</tbody></table></div>
      ${fu ? `<h3 class="wbs-h3">Follow-up</h3><ul class="wbs-list">${fu}</ul>` : ""}</section>
    <section class="wbs-card" aria-labelledby="link-h"><span class="wbs-k" id="link-h">Linked maintenance (independent)</span>${links ? `<ul class="wbs-list">${links}</ul>` : `<p class="wbs-empty">No independent work is linked yet.</p>`}</section>
    <section class="wbs-card" aria-labelledby="msg-h"><span class="wbs-k" id="msg-h">Messages</span><ul class="wbs-list">${prepared || "<li>No message is prepared.</li>"}${s.state.released.map((r) => `<li>Released: ${esc(s.config.communications.find((c) => c.id === r.templateId)!.purpose)} <span class="wbs-small">${hhmm(r.at)}</span></li>`).join("")}</ul></section>
    <details class="wbs-more"><summary>History in detail (holder only)</summary>${historyList(evidenceFor(s, "duty-lead"))}</details>`;
}

const GUEST_SENTENCES: Record<string, (l: Line, name: string, unit: string) => string> = {
  "approval.recorded": (l, name) => (l.byParty ? `You agreed: ${name}.` : `The duty lead approved: ${name}.`),
  "disclosure.made": (_l, name, unit) => `${name} was released to ${unit} (simulated; nothing is actually sent).`,
  "acceptance.recorded": (l, name, unit) => `${unit} accepted: ${name}. ${l.attested ? "Recorded by staff on the unit's behalf." : "Recorded by the unit itself."}`,
  "completion.recorded": (l, name, unit) => `${unit} reports it has delivered: ${name}. ${l.attested ? "Recorded by staff on the unit's behalf. " : ""}This is their report; you have not confirmed it.`,
  "response.recorded": (l) => l.text,
  "followup.closed": (l) => l.text,
  "plan.revised": (l) => l.text,
  "confirmation.recorded": (_l, name) => `You confirmed: ${name}.`,
};

function guestSections(s: Session): string {
  const v = subjectView(s.config, s.state, s.evidence);
  const lines = evidenceFor(s, "guest");
  const stream = lines.flatMap((l) => {
    const f = GUEST_SENTENCES[l.kind];
    if (!f) return [];
    const a = l.actionId ? s.state.actions.find((x) => x.id === l.actionId) : null;
    const t = a ? s.config.actions.find((x) => x.id === a.typeId) : null;
    const unit = t ? partyOf(s.config, t.recipient).label.replace(" (fictional)", "") : "the unit";
    return [{ time: l.time, text: f(l, a ? title(a.typeId) : "this step", unit) }];
  });
  const asks = v.actions.map((a) => `<li><strong>${esc(title(s.state.actions.find((x) => x.id === a.id)!.typeId))}</strong> · ${esc(STATE_WORDS[a.state] ?? a.state)}<br><span class="wbs-small">Would share with ${esc(a.recipientLabel.replace(" (fictional)", ""))}: ${esc(a.wouldShare.map((f) => f.label).join(", "))}${a.awaitingYourApproval ? " · <b>awaiting your agreement</b>" : ""}</span></li>`).join("");
  return `
    <section class="wbs-card" aria-labelledby="g-ask"><span class="wbs-k" id="g-ask">What you are asked to agree to</span><ul class="wbs-list">${asks || "<li>Nothing is waiting for your agreement.</li>"}</ul></section>
    <section class="wbs-card" aria-labelledby="g-now"><span class="wbs-k" id="g-now">What is happening</span><ol class="wbs-list wbs-hist">${stream.map((x) => `<li><time>${esc(x.time)}</time><span>${esc(x.text)}</span></li>`).join("") || "<li>Nothing yet.</li>"}</ol></section>
    <details class="wbs-more"><summary>Your record in detail, with who recorded each line</summary>${historyList(lines)}</details>`;
}

function unitSections(s: Session, role: DemoRoleId): string {
  const r = roleOf(role);
  const mine = recipientView(s.config, s.state, s.evidence, r.party!);
  const dl = deadlinesFor(s.config, s.state, { party: r.party! });
  const work = mine.map((a) => `<li><strong>${esc(title(s.state.actions.find((x) => x.id === a.id)!.typeId))}</strong> <span class="wbs-small">(${esc(a.id)})</span> · ${esc(STATE_WORDS[a.state] ?? a.state)}<br><span class="wbs-small">You were sent: ${esc(a.fields.map((f) => `${f.label}: ${f.value}`).join(" · ") || "nothing")}. ${esc(GENERIC_RESTRICTION)}</span></li>`).join("");
  const due = dl.map((d) => `<li>${esc(s.config.deadlines!.find((x) => x.id === d.defId)!.label)}: ${esc(deadlineWords(d))}</li>`).join("");
  return `
    <section class="wbs-card" aria-labelledby="u-work"><span class="wbs-k" id="u-work">Your work</span><ul class="wbs-list">${work || "<li>Nothing has been sent to you.</li>"}</ul></section>
    <section class="wbs-card" aria-labelledby="u-due"><span class="wbs-k" id="u-due">Due times for your work</span><ul class="wbs-list" id="status-${r.party}">${due || "<li>No due time applies to your work.</li>"}</ul></section>
    <details class="wbs-more"><summary>Your record in detail, with who recorded each line</summary>${historyList(evidenceFor(s, role))}</details>`;
}

function linkedSections(s: Session, role: DemoRoleId): string {
  const r = roleOf(role);
  const mine = linksFor(s.config, s.state, { party: r.party! });
  const items = mine.map((l) => { const k = s.config.linkKinds!.find((x) => x.id === l.kindId)!; return `<li><strong>${esc(k.label)}</strong> (${esc(l.reference)}) · ${LINK_WORDS[l.status]}<br><span class="wbs-small">You own the status of this work.</span></li>`; }).join("");
  return `<section class="wbs-card" aria-labelledby="m-work"><span class="wbs-k" id="m-work">Linked work you own</span><ul class="wbs-list">${items || "<li>No work is linked to you.</li>"}</ul></section>
    <details class="wbs-more"><summary>Your record in detail</summary>${historyList(evidenceFor(s, role))}</details>`;
}

export function roleView(s: Session, role: DemoRoleId, resultText: { ok: boolean; text: string } | null): string {
  const r = roleOf(role);
  const items = nextSteps(s, role);
  const others = r.kind === "holder" ? s.report.plan.awaitingHuman.filter((h) => !["The request holder", "The addressed contact"].includes(h.who)).map((h) => `${h.who}: ${h.what}`) : [];
  const sections = r.kind === "holder" ? holderSections(s) : r.kind === "subject" ? guestSections(s) : r.kind === "unit" ? unitSections(s, role) : linkedSections(s, role);
  const more = moreOptions(s, role);
  const nextCmds = new Set(items.flatMap((i) => [i.primary, ...i.others]).filter(Boolean).map((c) => JSON.stringify(c!.command)));
  const rest = more.filter((c) => !nextCmds.has(JSON.stringify(c.command)));
  const refused = refusals(s, role);
  return `${hero(s, role)}<div class="wbs-body">
    <div id="result" role="status" aria-live="polite" class="wbs-scope${resultText && !resultText.ok ? " refused" : ""}" tabindex="-1">${resultText ? esc(resultText.text) : "Each control here is offered or refused by the Core kernel running in this page."}</div>
    ${nextCard(items, role, others)}
    ${sections}
    <details class="wbs-more"><summary>Everything else Core would accept from this role now (${rest.length})</summary><div class="wbs-alts">${rest.map((c) => `<button type="button" class="wbs-btn alt" data-cmd="${cmdKey(c)}" data-focus="cmd">${esc(c.label)}</button>`).join("") || "<p class='wbs-small'>Nothing else.</p>"}</div></details>
    <details class="wbs-more" id="refusals-details"><summary>What Core would refuse from this role now (${refused.length}), with its reason</summary><div class="wbs-scroll"><table class="wbs-table" id="refusals"><tbody>${refused.map((x) => `<tr><td>${esc(x.label)}</td><td class="wbs-reason">${esc(x.code)}: ${esc(x.message)}</td></tr>`).join("")}</tbody></table></div></details>
  </div>`;
}

export function page(s: Session, role: DemoRoleId, resultText: { ok: boolean; text: string } | null, pathId: string | null): string {
  const pin = typeof __CORE_PIN__ !== "undefined" ? __CORE_PIN__ : { commit: "test", contractVersion: "" };
  const path = PATHS.find((p) => p.id === pathId);
  return `<a class="pw-skip" href="#role-view">Skip to the selected role's view</a>
  <header class="pw-header"><div class="pw-brand"><img src="/brand/jaldo-logo-white.webp" alt="JALDO" width="120"><span>TRAVEL · REVIEW WORKSPACE</span></div>
    <nav aria-label="Workspace"><span>Core ${esc(pin.commit.slice(0, 7))} · contract ${esc(pin.contractVersion)}</span></nav></header>
  <p class="hz-banner" role="note">${esc(LABELS.banner)}</p>
  <main id="main" class="wbs hz-main">
    <section class="wbs-card hz-controls" aria-label="Demonstration controls">
      <span class="wbs-k">Demo role · not access control</span>
      <div class="wbs-tabs" role="group" aria-label="Demo role">${DEMO_ROLES.map((r) => `<button type="button" class="wbs-role" data-role="${r.id}" aria-pressed="${r.id === role}">${esc(r.label)}</button>`).join("")}</div>
      <p class="wbs-small">${esc(LABELS.roleNote)}</p>
      <span class="wbs-k">Synthetic facts (the reviewer, not a role)</span>
      <div class="wbs-tabs"><span class="wbs-small hz-clock">Synthetic clock ${esc(s.clock.toISOString().slice(11, 16))} UTC</span>
        <button type="button" class="wbs-btn alt" data-adv="10">Advance 10 min</button><button type="button" class="wbs-btn alt" data-adv="60">Advance 60 min</button>
        <button type="button" class="wbs-btn alt" data-cap="housekeeping:down">Housekeeping unavailable</button><button type="button" class="wbs-btn alt" data-cap="housekeeping:up">Housekeeping available</button>
        <button type="button" class="wbs-btn reset" data-reset="1">Start again</button></div>
      <details class="wbs-more" id="guide"><summary>Reviewer guide: seven review paths (not part of any role's view)</summary>
        <div class="wbs-alts">${PATHS.map((p) => `<button type="button" class="wbs-btn ghost" data-path="${p.id}" aria-pressed="${p.id === pathId}">${esc(p.title)}</button>`).join("")}</div>
        ${path ? `<p class="wbs-scope"><strong>${esc(path.title)}.</strong> ${esc(path.what)}<br>${esc(path.try)}<br><span class="wbs-small">Setting up a path applies real commands to the kernel as the roles that would take them; a refusal stops it and is shown.</span></p>` : "<p class='wbs-small'>Choose a path to set up its starting point with real kernel commands.</p>"}</details>
    </section>
    <div id="role-view" tabindex="-1" aria-label="${esc(roleOf(role).label)} view">${roleView(s, role, resultText)}</div>
  </main>
  <footer class="pw-footer"><span class="wbs-small">Isolated review harness. In-page state only; nothing is stored, sent or published. Not a Travel page.</span></footer>`;
}
