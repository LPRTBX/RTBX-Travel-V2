// What each role sees. Every function here takes the selected role and builds its content ONLY from Core's projections for that
// role (holderView, subjectView, recipientView, deadlinesFor, linksFor) and from evidence addressed to that role's audience.
// The holder's history, owners, follow-ups and other units' work are rendered for the holder alone.
import { GENERIC_RESTRICTION, deadlineExpired, deadlinesFor, holderView, isLive, linksFor, partyOf, recipientView, subjectOf, subjectView, type DeadlineRecord, type EvidenceRecord } from "@workspace/jaldo-orchestration";
import { CONTRACTS, DEADLINE_NAMES, HELP_ACCEPTED, HELP_DECLINED, HELP_FURTHER, HELP_WORDS, DEADLINE_WORDS, DEPENDENCY_WORDS, FOLLOWUP_WORDS, GAPS, GUEST_SHARE, INTRO, JALDO_DOES, LABELS, LINK_WORDS, NEEDS_ATTENTION, PATHS, REASON_WORDS, STATE_WORDS, STEP, STEP_STATUS, STOPS, STRENGTH, WORDS } from "./copy";
import { moreOptions, nextSteps, optionsFor, planOptions, refusals, typeOptions, type Candidate, type NextStep } from "./next";
import { DERIVATION_NOTE } from "./config";
import { RULE, SOURCES, display, fullTime } from "./signals";
import { DEMO_ROLES, MEMBER_NAMES, roleOf, type DemoRoleId, type Session } from "./session";

export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const hhmm = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(11, 16) : "");
const cmdKey = (c: Candidate) => esc(JSON.stringify(c.command));
/** A deadline in words, from its own record. No comparison of lifecycle state: the words come from a lookup. */
const deadlineWords = (d: DeadlineRecord) => `${DEADLINE_WORDS[d.status]} (due ${hhmm(d.dueAt)} UTC${d.late === null ? "" : d.late ? "; after its due time" : "; in time"})`;
/** A deadline as recorded: its short name, the RECORDED due time, and any move with its reason. The configured duration is Core's label and is shown separately, never as if it were this due time. */
const deadlineLine = (s: Session, d: DeadlineRecord) => {
  const moved = d.history.filter((h) => h.kind === "rescheduled");
  const note = moved.length ? ` · moved ${moved.map((h) => `${hhmm(h.from)} → ${hhmm(h.to)} UTC${h.reasonId ? ` (${REASON_WORDS[h.reasonId] ?? h.reasonId})` : ""}`).join(", then ")}` : "";
  return `${DEADLINE_NAMES[d.defId] ?? s.config.deadlines!.find((x) => x.id === d.defId)!.label}: ${deadlineWords(d)}${note}`;
};
/** The guest's help answer in their own words. After something has been shared, "no" means no FURTHER help. */
const helpWords = (h: { status: string; afterDisclosure: boolean }) => (HELP_DECLINED[h.status] && h.afterDisclosure ? HELP_FURTHER : HELP_WORDS[h.status]);
const cell = (label: string, html: string) => `<td data-label="${esc(label)}">${html}</td>`;
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

function nextCard(s: Session, items: NextStep[], role: DemoRoleId, waitingOnOthers: string[], heading: string): string {
  if (items.length === 0) {
    return `<section class="wbs-next" aria-labelledby="next-h"><span class="wbs-k" id="next-h" tabindex="-1">${esc(heading)}</span><p class="do">Nothing is waiting for you right now.</p>${waitingOnOthers.length ? `<p class="wbs-small">Core shows the response is waiting on: ${esc(waitingOnOthers.join("; "))}</p>` : ""}</section>`;
  }
  const [first, ...rest] = items;
  const btn = (c: Candidate, cls: string) => `<button type="button" class="wbs-btn ${cls}" data-cmd="${cmdKey(c)}" data-focus="cmd">${esc(c.label)}</button>`;
  return `<section class="wbs-next" aria-labelledby="next-h" data-testid="next-step"><span class="wbs-k" id="next-h" tabindex="-1">${esc(heading)}</span>
    <p class="do">${esc(first.what)}</p>
    ${role === "guest" && first.actionId ? shareDetail(s, first.actionId) : ""}
    <div class="wbs-primary">${first.primary ? btn(first.primary, "main") : first.others.length ? `${first.others.length > 1 ? `<p class="wbs-small">Choose one. None is the expected answer.</p>` : ""}<div class="wbs-alts wbs-equal">${first.others.map((c) => btn(c, "alt")).join("")}</div>` : `<p class="wbs-small">Core would not accept any command from this role for this step yet.</p>`}</div>
    ${first.primary && first.others.length ? `<details class="wbs-more"><summary>Other options for this step (${first.others.length})</summary><div class="wbs-alts">${first.others.map((c) => btn(c, "alt")).join("")}</div></details>` : ""}
    ${rest.length ? `<details class="wbs-more"><summary>Also waiting for you (${rest.length})</summary><ul class="wbs-list">${rest.map((x) => `<li>${esc(x.what)}${x.primary ? `<br>${btn(x.primary, "alt")}${x.others.length ? `<details class="wbs-more"><summary>Other options for this step (${x.others.length})</summary><div class="wbs-alts">${x.others.map((c) => btn(c, "alt")).join("")}</div></details>` : ""}` : x.others.length ? `<br><span class="wbs-small">Choose one. None is the expected answer.</span><div class="wbs-alts wbs-equal">${x.others.map((c) => btn(c, "alt")).join("")}</div>` : ""}</li>`).join("")}</ul></details>` : ""}
  </section>`;
}


/** Exactly what would be shared, with whom and why, beside the choice. Values are Core's frozen field values, unmodified. */
function shareDetail(s: Session, actionId: string): string {
  const v = subjectView(s.config, s.state, s.evidence).actions.find((a) => a.id === actionId);
  const a = s.state.actions.find((x) => x.id === actionId);
  const t = a ? s.config.actions.find((x) => x.id === a.typeId) : null;
  if (!v || !t || !v.awaitingYourApproval) return "";
  const unit = v.recipientLabel.replace(" (fictional)", "");
  return `<div class="wbs-share" data-testid="share-detail"><p><strong>Recipient:</strong> ${esc(unit)}</p><p><strong>Purpose:</strong> ${esc(t.purpose)}</p>
    <table class="wbs-table review-responsive"><thead><tr><th>Detail</th><th>Exact value that would be shared</th></tr></thead><tbody>${v.wouldShare.map((f) => `<tr><td data-label="Detail">${esc(f.label)}</td><td data-label="Exact value that would be shared">${esc(f.value)}</td></tr>`).join("")}</tbody></table>
    <p class="wbs-small">Not shared: ${esc(t.withheld.join(", "))}. Declining shares nothing, and the hotel can still help in other ways you ask for.${s.sharingOpen ? "" : " Allowing is available after you say yes to practical help; declining is available now."}</p></div>`;
}

type HolderV = NonNullable<ReturnType<typeof holderView>>;

/** Delivery confirmation, the guest's feedback and resolution are three separate things. None stands in for another. */
function outcomeParts(s: Session, v: HolderV, a: HolderV["actions"][number]): { delivery: string; feedback: string; resolution: string } | null {
  const t = s.config.actions.find((x) => x.id === a.typeId)!;
  if (!t.responses) return null;
  const delivery = a.completedAt ? `${a.confirmedBy ? "The guest confirmed it was done. " : ""}Reported by ${esc(partyOf(s.config, t.recipient).label.replace(" (fictional)", ""))} at ${hhmm(a.completedAt)} (their report${a.confirmedBy ? "" : "; the guest has not confirmed it"}).` : "No delivery report yet.";
  const label = (id: string) => t.responses!.find((x) => x.id === id)!.label;
  const feedback = (a.responses ?? []).length ? (a.responses ?? []).map((r) => `${esc(label(r.responseId))} (${hhmm(r.at)})`).join(" → ") : a.completedAt ? "None yet. No answer is unknown, never “helped”." : "Not asked yet.";
  const fus = (v.coordination?.followUps ?? []).filter((f) => f.actionId === a.id);
  const last = (a.responses ?? []).at(-1);
  const helped = !!last && t.responses.find((x) => x.id === last.responseId)!.effect === "satisfied";
  const resolution = fus.length ? fus.map((f) => NEEDS_ATTENTION.followUp[f.status] ? `Open · owner: ${esc(MEMBER_NAMES[f.openedOwner ?? ""] ?? "the holder")}` : `Closed · ${esc(s.config.followUpOutcomes!.find((o) => o.id === f.outcomeId)?.label ?? "outcome recorded")}`).join("; ")
    : helped ? "No follow-up needed: the guest says it helped." : "Not established. Delivery alone does not resolve it.";
  return { delivery, feedback, resolution };
}
const outcomeHtml = (o: NonNullable<ReturnType<typeof outcomeParts>>) => `<dl class="wbs-outcome"><dt>Delivery confirmation</dt><dd>${o.delivery}</dd><dt>Guest feedback</dt><dd>${o.feedback}</dd><dt>Resolution</dt><dd>${o.resolution}</dd></dl>`;

/** What is shared, with whom, for what purpose, and the exact values. Frozen at approval; nothing here is recomputed. */
function disclosureSection(s: Session, v: HolderV): string {
  const rows = v.actions.filter((a) => isLive(a) && s.config.actions.find((t) => t.id === a.typeId)!.approver === "subject").map((a) => {
    const t = s.config.actions.find((x) => x.id === a.typeId)!;
    return `<tr>${cell("Step", `${esc(title(a.typeId))} <span class="wbs-small">(${esc(a.id)})</span>`)}${cell("Recipient", esc(partyOf(s.config, t.recipient).label.replace(" (fictional)", "")))}${cell("Purpose", esc(t.purpose))}${cell("Exact values", `<ul class="wbs-list">${a.fields.map((f) => `<li>${esc(f.label)}: ${esc(f.value)}</li>`).join("")}</ul><span class="wbs-small">Not shared: ${esc(t.withheld.join(", "))}</span>`)}${cell("Where it stands", esc(a.sentAt ? `Released ${hhmm(a.sentAt)} (simulated)` : (STATE_WORDS[a.state] ?? a.state)))}</tr>`;
  }).join("");
  return rows ? `<section class="wbs-card" aria-labelledby="disc-h"><span class="wbs-k" id="disc-h">What is shared, with whom, exactly</span><div class="wbs-scroll"><table class="wbs-table review-responsive"><thead><tr><th>Step</th><th>Recipient</th><th>Purpose</th><th>Exact values</th><th>Where it stands</th></tr></thead><tbody>${rows}</tbody></table></div></section>` : "";
}

/** One card per step on narrow screens: plan, ownership, due time and evidence together, so nothing repeats. */
function mobileSteps(s: Session, v: HolderV, owner: (id: string) => string): string {
  const deadlines = v.coordination?.deadlines ?? [];
  const items = v.plan.steps.map((st) => {
    const a = st.actionId ? v.actions.find((x) => x.id === st.actionId) : undefined;
    const out = a ? outcomeParts(s, v, a) : null;
    const dl = a ? deadlines.filter((d) => d.subject.kind === "action" && d.subject.actionId === a.id).map((d) => esc(deadlineLine(s, d))).join("<br>") : "";
    const ev = a ? [a.sentAt ? `released ${hhmm(a.sentAt)}` : "", a.acceptedAt ? `accepted ${hhmm(a.acceptedAt)}` : "", a.completedAt ? `delivery reported ${hhmm(a.completedAt)}` : ""].filter(Boolean).join(" · ") : "";
    const waiting = st.waitingFor.length ? st.waitingFor.map((w) => esc(w)).join("; ") : "Nothing outstanding";
    const status = a && (v.coordination?.followUps ?? []).some((f) => f.actionId === a.id && NEEDS_ATTENTION.followUp[f.status]) ? WORDS.deliveryFollowUp : (STEP_STATUS[st.status] ?? st.status);
    return `<li class="wbs-step"><strong>${esc(title(st.actionType))}${st.actionId ? ` <span class="wbs-small">(${esc(st.actionId)})</span>` : ""}</strong>
      <dl><dt>Status</dt><dd>${esc(status)}</dd><dt>Who approves</dt><dd>${esc(st.authority === "standing-policy" ? "Standing policy" : st.authority)}</dd><dt>Waiting for</dt><dd>${waiting}</dd>${a ? `<dt>Waiting on</dt><dd>${esc(owner(a.id))}</dd>` : ""}${dl ? `<dt>Due</dt><dd>${dl}</dd>` : ""}${ev ? `<dt>Evidence</dt><dd>${esc(ev)}</dd>` : ""}</dl>${out ? outcomeHtml(out) : ""}</li>`;
  }).join("");
  return `<ol class="wbs-list wbs-steps">${items}</ol>`;
}

/** The signal table: every event, in event-time order, with its full time, what it reported, how it was handled and how fresh the current reading is. */
function signalRows(s: Session): string {
  const now = s.clock;
  const rows = [...s.desk.received].sort((a, b) => (Date.parse(a.signal.occurredAt) || 0) - (Date.parse(b.signal.occurredAt) || 0) || a.order - b.order);
  const fresh = new Map(s.desk.assess(now).freshness.map((f) => [f.source, f]));
  return rows.map((r) => {
    const isCurrent = s.desk.current(r.signal.source) === r;
    const f = fresh.get(r.signal.source);
    const freshness = isCurrent && f ? `<strong>${f.fresh ? "Fresh" : "Too old: supports nothing"}</strong><br><span class="wbs-small">${f.ageMinutes} min old · maximum ${f.maxAgeMinutes} min · ${f.fresh ? "fresh until" : "was fresh until"} ${esc(fullTime(f.freshUntil))}</span>` : `<span class="wbs-small">${r.outcome === "taken-in" ? "Not the current reading" : "Not relied on"}</span>`;
    const when = Number.isNaN(Date.parse(r.signal.occurredAt)) ? esc(String(r.signal.occurredAt || "(missing)")) : esc(fullTime(r.signal.occurredAt));
    return `<tr>${cell("Source", esc(SOURCES[r.signal.source].label))}${cell("Event time", when)}${cell("Arrived", `#${r.order}`)}${cell("What it reported", `<ul class="wbs-list">${Object.entries(r.signal.context).map(([k, val]) => `<li>${esc(factLabel(k))}: ${esc(r.outcome === "refused" ? (val === "" ? "(missing)" : val) : display(r.signal.source, k, val))}</li>`).join("")}</ul>`)}${cell("How it was handled", `<strong>${esc(HANDLED[r.outcome])}</strong><br><span class="wbs-small">${esc(r.reason)}</span>`)}${cell("Freshness", freshness)}</tr>`;
  }).join("");
}
const HANDLED: Record<string, string> = { "taken-in": "Taken in", duplicate: "Duplicate: no second effect", conflict: "Conflict: nothing recorded", superseded: "Superseded: older than the current reading", refused: "Refused" };
const factLabel = (k: string) => ({ room: "Room", status: "Status", promisedReady: "Promised ready", guestArrived: "Guest arrived", guestHelpRequest: "Help request from guest", workOrder: "Work order", estimatedCompletion: "Estimated completion" } as Record<string, string>)[k] ?? k;

function signalTable(s: Session): string {
  const f = s.desk.freshness;
  return `<div class="wbs-scroll"><table class="wbs-table review-responsive"><thead><tr><th>Source</th><th>Event time</th><th>Arrived</th><th>What it reported</th><th>How it was handled</th><th>Freshness</th></tr></thead><tbody>${signalRows(s) || "<tr><td colspan='6'>No events have arrived.</td></tr>"}</tbody></table></div>
    <p class="wbs-small">Events are read in event-time order, whatever order they arrived in. Core's event envelope validates each one; the checks on required fields, allowed values, room matching and full timestamps, and the freshness limits (${esc(SOURCES.pms.label)} ${f.maxAgeMinutes.pms} min, ${esc(SOURCES.maintenance.label)} ${f.maxAgeMinutes.maintenance} min), belong to this demonstration adapter. Freshness is re-evaluated whenever the clock moves and again at the moment of adoption. The maintenance event type is not one Core admits: ${esc(s.coreRefusesMaintenance())}</p>`;
}

/** Before any request exists: what JALDO received, what it recognised and why, what is uncertain, and the one permitted next action. */
function signalDesk(s: Session): string {
  const a = s.desk.assess(s.clock);
  const evidence = a.evidence.map((e) => { const f = a.freshness.find((x) => x.label === e.source); return `<li><strong>${esc(e.source)}</strong> · event ${esc(fullTime(e.time))}${f ? ` · ${f.ageMinutes} min old (maximum ${f.maxAgeMinutes}${f.fresh ? "" : ": too old"})` : ""}<br>${e.facts.map((x) => `${esc(x.label)}: ${esc(x.value)}`).join("; ")}</li>`; }).join("");
  const reco = a.recognised
    ? `<section class="wbs-card review-reco" aria-labelledby="reco-h"><span class="wbs-k">Recognised moment · demonstrated recommendation</span><h2 id="reco-h">A proactive service check-in may help</h2>
        <p><strong>Why.</strong> ${esc(a.reason)}</p>
        <h3 class="wbs-h3">Evidence</h3><ul class="wbs-list">${evidence}</ul>
        <h3 class="wbs-h3">Not established</h3><ul class="wbs-list">${a.uncertainty.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>
        <h3 class="wbs-h3">Who decides, and what happens next</h3>
        <p>The Duty lead decides. If opened, the Duty lead accepts responsibility, then the guest chooses whether practical help is wanted before anything is shared. Guest services would deliver it; Reception and Housekeeping would only be asked for checks and would not receive guest details.</p>
        <p class="wbs-small">Freshness is checked again when you decide: if a reading has aged out or the evidence has changed, nothing is opened.</p>
        <p><label class="wbs-label" for="adopt-reason"><strong>Why are you opening it?</strong> Your reason is recorded with your decision.</label><br><textarea id="adopt-reason" class="wbs-textarea" rows="2" maxlength="300" aria-describedby="adopt-note"></textarea></p>
        <p><button type="button" class="wbs-btn main" data-adopt="${esc(s.desk.digest())}">Open a proactive check-in for me to review</button></p>
        <p class="wbs-small" id="adopt-note">Opening it records a request addressed to you. It approves nothing, shares nothing and releases nothing. The guest then decides whether help is wanted, and separately what may be shared. Leaving it unopened is also a valid decision.</p></section>`
    : `<section class="wbs-card review-reco" aria-labelledby="reco-h"><span class="wbs-k">Recognised moment · demonstrated recommendation</span><h2 id="reco-h">${a.missing.some((m) => /old/.test(m)) ? "The evidence is too old to recommend a check-in" : "Not enough to recommend a check-in"}</h2>
        <p>${esc(a.reason)}</p><h3 class="wbs-h3">What is missing or against it</h3><ul class="wbs-list">${a.missing.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
        <p class="wbs-small">A single source, a short wait, or a guest who has already asked does not call for a proactive check-in. Operational delay alone never establishes distress.</p></section>`;
  return `<section class="wbs-card" aria-labelledby="sig-h"><span class="wbs-k" id="sig-h">What JALDO received</span>${signalTable(s)}</section>${reco}`;
}

/** After adoption: why the response exists. The demonstration decision record and Core's own evidence are shown apart, on purpose. */
function recognisedBasis(s: Session): string {
  if (s.origin !== "signals") return "";
  const r = s.adoptions[0];
  if (!r) return "";
  const core = s.evidence.find((e) => e.kind === "request.opened");
  return `<section class="wbs-card" aria-labelledby="basis-h"><span class="wbs-k" id="basis-h">Why this response exists</span>
    <p>JALDO recognised a possible need${r.recognisedAt ? ` at ${esc(fullTime(r.recognisedAt))}` : ""} from two independent, fresh sources and recommended a proactive check-in. The guest had not asked. ${esc(s.desk.assess(s.clock).uncertainty[2])}</p>
    <h3 class="wbs-h3">Demonstration decision record <span class="wbs-small">(kept by this adapter; not Core evidence)</span></h3>
    <dl class="wbs-outcome" data-testid="decision-record"><dt>Authorised by</dt><dd>${esc(r.decidedBy.label)} · ${esc(r.decidedBy.note)}</dd>
      <dt>When</dt><dd>${esc(fullTime(r.decidedAt))}</dd><dt>Reason given</dt><dd>${esc(r.reason)}</dd>
      <dt>Interpretation rule</dt><dd>${esc(r.rule.id)} version ${esc(r.rule.version)}</dd>
      <dt>Source references</dt><dd>${r.sources.map((x) => `${esc(x.label)} ${esc(x.id)} (event ${esc(fullTime(x.occurredAt))}; ${x.ageMinutes} min old at decision, maximum ${x.maxAgeMinutes})`).join("<br>")}</dd>
      <dt>Evidence checked</dt><dd>Fingerprint ${esc(r.evidenceDigest)}, re-checked at the moment of decision</dd></dl>
    <h3 class="wbs-h3">Core-owned evidence <span class="wbs-small">(recorded by the Core kernel)</span></h3>
    <dl class="wbs-outcome" data-testid="core-record"><dt>Opening event</dt><dd>${esc(r.core.eventId)} · idempotency key ${esc(r.core.idempotencyKey)}</dd>
      <dt>Core evidence</dt><dd>request.opened${r.core.evidenceSequence !== null ? `, sequence ${r.core.evidenceSequence}` : ""}, recorded by ${core?.actor?.kind === "system" ? "Core's system actor" : "Core"}</dd></dl>
    <p class="wbs-small">Core holds the opening event and its sequence. It has no field for who decided, why, on which sources or under which rule version, so those live only in the demonstration record above (CORE-GAPS.md, G5).</p>
    <details class="wbs-more"><summary>Source events and how each was handled</summary>${signalTable(s)}</details></section>`;
}

/** The guest's own answer about help, and what it does and does not mean. Held by this adapter, not Core. */
function helpSection(s: Session): string {
  if (s.origin !== "signals" || !s.opened) return "";
  const last = s.helpHistory.at(-1);
  const words = { unanswered: "The guest has not answered yet. That is not a yes and not a no.", yes: "The guest said yes to practical help.", no: last?.afterDisclosure ? "The guest has declined further help." : "The guest said no thanks." }[s.help];
  const hist = s.helpHistory.map((h) => `<li>${esc(fullTime(h.at))} · ${esc(helpWords(h))}${h.afterDisclosure ? " (after something had been shared)" : ""}</li>`).join("");
  return `<section class="wbs-card" aria-labelledby="help-h"><span class="wbs-k" id="help-h">The guest's choice about help <span class="wbs-small">(demonstration record; not Core evidence)</span></span>
    <p><strong>${esc(words)}</strong>${s.offeredAt && s.help === "unanswered" ? ` Offered at ${esc(fullTime(s.offeredAt))}.` : ""}</p>
    ${hist ? `<ul class="wbs-list">${hist}</ul>` : ""}
    <p class="wbs-small">Accepting help, agreeing to share and withdrawing sharing are three different things. Saying yes shares nothing; agreeing to share never counts as saying yes; and saying no to help neither withdraws permission nor stops work, because Core has no contract for accepting or declining help or for stopping released work. This answer and the gate in front of NEW sharing approval are demonstration only (CORE-GAPS.md, G8, G9).</p></section>`;
}

/** What the guest sees while the offer has not reached them (nothing is waiting). */
function guestHelpView(s: Session, resultText: { ok: boolean; text: string } | null): string {
  const live = `<div id="result" role="status" aria-live="polite" class="wbs-scope${resultText && !resultText.ok ? " refused" : ""}" tabindex="-1">${resultText ? esc(resultText.text) : esc(WORDS.actionsNote)}</div>`;
  return `${hero(s, "guest")}<div class="wbs-body">${live}<section class="wbs-card" aria-labelledby="g-none"><span class="wbs-k" id="g-none">Nothing is waiting for your choice yet</span><p>The hotel is preparing an offer. Nothing about you has been shared.</p></section></div>`;
}

/** The help question or the guest's answer, above the normal view. Declining or taking back sharing stays reachable below, wherever Core permits. */
function helpCard(s: Session): string {
  const none = s.disclosed ? HELP_FURTHER : "No thanks";
  if (s.help === "unanswered") return `<section class="wbs-card wbs-ask" aria-labelledby="g-q"><span class="wbs-k">Your choice</span><h2 id="g-q">Would you like practical help?</h2>
    <p>The hotel noticed your room is delayed. Help could mean somewhere calm to wait, water and help with luggage (fictional). Saying yes does not share anything: you choose what may be shared next, and you can still decline any of it.</p>
    <div class="wbs-alts wbs-equal" role="group" aria-label="Would you like practical help?"><button type="button" class="wbs-btn alt" data-help="yes">Yes, I would like help</button><button type="button" class="wbs-btn alt" data-help="no">${esc(none)}</button></div>
    <p class="wbs-small">Not answering is not a yes and not a no. You can decline sharing, or take back an approval, whatever you answer here; allowing new sharing opens after you say yes.</p></section>`;
  const shared = evidenceFor(s, "guest").filter((l) => l.kind === "disclosure.made").map((l) => { const a = l.actionId ? s.state.actions.find((x) => x.id === l.actionId) : null; return `<li>${esc(l.time)} · ${esc(a ? title(a.typeId) : "A step")} was released (simulated)</li>`; }).join("");
  const after = s.helpHistory.at(-1)?.afterDisclosure ?? false;
  return `<section class="wbs-card wbs-ask" aria-labelledby="g-no" data-testid="help-declined"><span class="wbs-k" id="g-no">${after ? "You told the hotel you don't want further help" : "You said no thanks"}</span>
    <p>${after ? "This is recorded as your request. <strong>It does not recall anything already shared, cancel anything already sent, or withdraw your permission.</strong> Work already under way may continue until the hotel's team stops it, and nothing here has told Core to stop anything." : "Nothing will be shared and nothing is sent."}</p>
    ${after && shared ? `<p class="wbs-small">Already shared, and unchanged by this answer:</p><ul class="wbs-list">${shared}</ul>` : ""}
    <p class="wbs-small">Where Core allows it you can still decline sharing or take back an approval that has not been sent; those choices are below. You can change your mind about help at any time.</p>
    <p><button type="button" class="wbs-btn alt" data-help="yes">Actually, yes please</button></p></section>`;
}

/** Milestones from Core's own evidence, then what was recognised, delivered, felt and left open. Describes steps, never people. */
function processReview(s: Session, v: HolderV): string {
  const first = (kind: string, pred: (e: typeof s.evidence[number]) => boolean = () => true) => s.evidence.find((e) => e.kind === kind && pred(e));
  const last = (kind: string) => [...s.evidence].reverse().find((e) => e.kind === kind);
  const guestApprovals = s.evidence.filter((e) => e.kind === "approval.recorded" && e.actor?.kind === "party");
  const miles: { label: string; at: string | null }[] = [
    ...(s.origin === "signals" ? [{ label: "JALDO recognised the moment from system events", at: s.desk.recognisedAt }, { label: "Duty lead opened the proactive check-in", at: s.adoptedAt }] : [{ label: "The guest's request arrived", at: first("request.opened")?.at ?? null }]),
    { label: "Duty lead accepted responsibility", at: first("request.accepted")?.at ?? null },
    ...(s.origin === "signals" ? [{ label: "Offer of help reached the guest (demonstration record)", at: s.offeredAt }, { label: `Guest answered about help: ${s.helpHistory.at(-1) ? helpWords(s.helpHistory.at(-1)!).toLowerCase() : "no response"} (demonstration record; recording it stops no work)`, at: s.helpHistory[0]?.at ?? null }] : []),
    { label: "Guest chose to share (first agreement)", at: guestApprovals[0]?.at ?? null },
    { label: "Handover released (simulated)", at: s.evidence.find((e) => e.kind === "disclosure.made" && s.state.actions.find((a) => a.id === e.actionId)?.typeId === "support-handover")?.at ?? null },
    { label: "Delivery reported by the unit", at: first("completion.recorded")?.at ?? null },
    { label: "Guest feedback recorded", at: first("response.recorded")?.at ?? null },
    { label: "Follow-up opened", at: first("followup.opened")?.at ?? null },
    { label: "Follow-up closed", at: last("followup.closed")?.at ?? null },
  ];
  let prev: number | null = null;
  const timing = miles.map((m) => { const t = m.at ? Date.parse(m.at) : null; const d = t !== null && prev !== null ? `+${Math.round((t - prev) / 60000)} min` : ""; if (t !== null) prev = t; return `<tr>${cell("Step", esc(m.label))}${cell("Time (UTC)", m.at ? esc(hhmm(m.at)) : "<span class='wbs-small'>not yet</span>")}${cell("Since the step before", esc(d))}</tr>`; }).join("");
  const sup = v.actions.find((a) => a.typeId === "support-handover" && isLive(a)) ?? null;
  const out = sup ? outcomeParts(s, v, sup) : null;
  const SHORT: Record<string, string> = { "disclosure.made": "Released (simulated)", "acceptance.recorded": "Accepted by the unit", "completion.recorded": "Delivery reported by the unit", "confirmation.recorded": "Confirmed by the guest" };
  const evid = evidenceFor(s, "duty-lead").filter((l) => l.kind in SHORT).map((l) => { const a = l.actionId ? s.state.actions.find((x) => x.id === l.actionId) : null; return `<li>${esc(l.time)} · ${esc(SHORT[l.kind])}${a ? `: ${esc(title(a.typeId))} <span class="wbs-small">(${esc(a.id)})</span>` : ""}<br><span class="wbs-small">${esc(l.how)}</span></li>`; }).join("");
  const open: string[] = [];
  for (const f of v.coordination?.followUps ?? []) if (NEEDS_ATTENTION.followUp[f.status]) open.push(`Follow-up ${esc(f.id)} is open (owner: ${esc(MEMBER_NAMES[f.openedOwner ?? ""] ?? "the holder")}).`);
  for (const l of v.coordination?.links ?? []) { const k = s.config.linkKinds!.find((x) => x.id === l.kindId)!; if (NEEDS_ATTENTION.link[l.status]) open.push(`${esc(k.label)} (${esc(l.reference)}) is ${LINK_WORDS[l.status]} · ${k.dependency === "required" ? "required: blocks release" : "independent: tracked separately"}.`); }
  const overdue = (v.coordination?.deadlines ?? []).filter((d) => deadlineExpired(d, s.clock));
  if (overdue.length) open.push(`${overdue.length} deadline${overdue.length === 1 ? " has" : "s have"} passed without being met.`);
  if (s.origin === "signals" && s.help === "no" && s.disclosed) open.push("The guest has declined further help after information was shared. The answer is recorded; released work was not stopped and shared information was not recalled. Review each released step manually.");
  if (s.report.awaitingHuman.some((h) => /^Renew /.test(h.what))) open.push("A capacity check needs renewing after a unit lost capacity.");
  const proposals: string[] = [];
  if (s.evidence.some((e) => e.kind === "capacity.lost")) proposals.push("Consider rechecking capacity just before release, not only at approval. Observed: a unit lost capacity after accepting.");
  if ((v.coordination?.links ?? []).some((l) => s.config.linkKinds!.find((k) => k.id === l.kindId)!.dependency === "required" && NEEDS_ATTENTION.link[l.status])) proposals.push("Consider asking Maintenance for the area clearance earlier. Observed: a required check was unresolved when release was due.");
  if (overdue.some((d) => d.defId === "guest-response-window")) proposals.push("Consider whether the guest response window suits this kind of support. Observed: no response by the deadline, which stays unknown.");
  if (s.evidence.some((e) => e.kind === "followup.opened")) proposals.push("Consider letting the guest say what would help when support did not. Observed: the guest said it still needs support.");
  if (s.origin === "signals") proposals.push(`Consider whether the recognition rule's ${RULE.minimumRepairWaitMinutes}-minute repair threshold suits this property. Observed: recognised from two sources before the guest asked. (The rule is Travel-side demonstration data.)`);
  return `<section class="wbs-card" aria-labelledby="rev-h"><span class="wbs-k" id="rev-h">Process review · for authorised review</span>
    <p class="wbs-small">Describes the steps of this response, not the people in it. Nobody is scored or ranked. Nothing below changes a rule.</p>
    <h3 class="wbs-h3">What was recognised</h3><p>${s.origin === "signals" ? `System events (${esc(SOURCES.pms.label)}, ${esc(SOURCES.maintenance.label)}) were read as a possible need before the guest asked, under ${esc(RULE.id)} v${esc(RULE.version)}. ${esc(s.desk.assess(s.clock).uncertainty[2])}` : "The guest asked directly. Nothing was recognised from system events."}</p>
    ${s.adoptions[0] ? `<p><strong>Authorised by</strong> ${esc(s.adoptions[0].decidedBy.label)} at ${esc(fullTime(s.adoptions[0].decidedAt))}: “${esc(s.adoptions[0].reason)}” <span class="wbs-small">(demonstration decision record; Core holds only the opening event, sequence ${s.adoptions[0].core.evidenceSequence})</span></p>` : ""}
    <h3 class="wbs-h3">Response timing</h3><div class="wbs-scroll"><table class="wbs-table review-responsive"><thead><tr><th>Step</th><th>Time (UTC)</th><th>Since the step before</th></tr></thead><tbody>${timing}</tbody></table></div><p class="wbs-small">The clock is synthetic: it moves only when the reviewer moves it.</p>
    <h3 class="wbs-h3">Delivery evidence</h3><ul class="wbs-list">${evid || "<li>Nothing delivered yet.</li>"}</ul>
    <h3 class="wbs-h3">Guest outcome</h3>${out ? outcomeHtml(out) : "<p>Support has not been handed over yet.</p>"}
    <h3 class="wbs-h3">Unresolved work</h3>${open.length ? `<ul class="wbs-list">${open.map((o) => `<li>${o}</li>`).join("")}</ul>` : "<p>Nothing unresolved.</p>"}
    <h3 class="wbs-h3">Proposals for authorised review</h3>${proposals.length ? `<ul class="wbs-list">${proposals.map((o) => `<li>${esc(o)} <span class="wbs-small">Proposal only: not applied.</span></li>`).join("")}</ul>` : "<p>No proposal arises from this response so far.</p>"}
    <p class="wbs-small">Core has no record for review proposals or rule changes (CORE-GAPS.md, G6), so these are shown, not saved, and no automatic change is made.</p></section>`;
}

function hero(s: Session, role: DemoRoleId): string {
  const r = roleOf(role);
  let heading: string, body: string;
  if (!s.opened) {
    [heading, body] = r.kind === "holder" ? [JALDO_DOES.signalsHeading, JALDO_DOES.signalsBody] : r.kind === "subject" ? [JALDO_DOES.guestWaitingHeading, JALDO_DOES.guestWaitingBody] : [INTRO[r.kind === "unit" ? "unit" : "linked"].heading, JALDO_DOES.unitWaitingBody];
  } else if (s.origin === "signals") {
    [heading, body] = r.kind === "holder" ? [JALDO_DOES.openedHeading, JALDO_DOES.openedBody] : r.kind === "subject" ? [JALDO_DOES.guestOpenedHeading, JALDO_DOES.guestOpenedBody] : [INTRO[r.kind === "unit" ? "unit" : "linked"].heading, INTRO[r.kind === "unit" ? "unit" : "linked"].body];
  } else {
    const intro = INTRO[r.kind === "holder" ? "holder" : r.kind === "subject" ? "subject" : r.kind === "unit" ? "unit" : "linked"];
    [heading, body] = [intro.heading, intro.body];
  }
  return `<div class="wbs-hero review-compact"><div><span class="wbs-k">${esc(r.label)} · fictional demonstration</span><h2>${esc(heading)}</h2><p class="wbs-lede">${esc(body)}</p></div></div>`;
}

/** What needs the holder's attention first, from Core's own coordination record, each with the responses Core would accept now. */
function attention(s: Session): string {
  const v = holderView(s.config, s.state, s.evidence, s.facts(), "member-a");
  if (!v) return "";
  const c = v.coordination;
  const role: DemoRoleId = "duty-lead";
  const buttons = (list: Candidate[], heading = "Permitted responses") => {
    const forward = list.filter((x) => !STOPS.has(x.command.type)), back = list.filter((x) => STOPS.has(x.command.type));
    const btn = (x: Candidate) => `<button type="button" class="wbs-btn alt" data-cmd="${cmdKey(x)}" data-focus="cmd">${esc(x.label)}</button>`;
    return list.length ? `<div class="wbs-alts" role="group" aria-label="${esc(heading)}">${forward.map(btn).join("")}</div>${back.length ? `<details class="wbs-more"><summary>Other options that step back (${back.length})</summary><div class="wbs-alts">${back.map(btn).join("")}</div></details>` : ""}` : `<p class="wbs-small">Nothing is permitted to you on this yet.</p>`;
  };
  const rows: string[] = [];
  if (s.origin === "signals" && s.help === "no") {
    const after = s.helpHistory.at(-1)?.afterDisclosure ?? false;
    const live = v.actions.filter((a) => isLive(a));
    const released = live.filter((a) => a.sentAt !== null);
    const open = live.filter((a) => a.sentAt === null);
    const answered = s.helpHistory.at(-1)!;
    const manual = released.map((a) => { const o = optionsFor(s, role, a.id, ["withdraw"]); return `<li><strong>${esc(title(a.typeId))}</strong> <span class="wbs-small">(${esc(a.id)})</span> was released at ${esc(hhmm(a.sentAt))} and is “${esc(STATE_WORDS[a.state] ?? a.state)}”. ${o.length ? "Core offers: " : "Core offers no action on it. Manual review: contact the unit if it should stop."}${o.map((x) => `<button type="button" class="wbs-btn alt" data-cmd="${cmdKey(x)}" data-focus="cmd">${esc(x.label)}</button>`).join(" ")}</li>`; }).join("");
    rows.push(`<li data-testid="help-declined-lead"><strong>${after ? "The guest has declined further help." : "The guest said no thanks to help."}</strong>
      <dl class="wbs-outcome"><dt>Guest's request</dt><dd>Recorded at ${esc(fullTime(answered.at))} (demonstration record; not Core evidence).</dd>
      <dt>Work stopped</dt><dd><strong>No.</strong> Recording this answer did not stop or cancel anything, recall any information or withdraw any permission, and Core has not been told. Everything Core recorded before it is unchanged.</dd></dl>
      ${released.length ? `<p><strong>Already released: manual review needed.</strong></p><ul class="wbs-list">${manual}</ul>` : ""}
      ${open.length ? `<p><strong>Not yet released:</strong> Core lets you withdraw these.</p>${buttons(open.flatMap((a) => optionsFor(s, role, a.id, ["withdraw"])), "Responses to declined help")}` : ""}
      ${buttons(planOptions(s, role, ["revisePlan"]), "Plan-level response")}
      <p class="wbs-small">The guest can still decline or take back sharing where Core permits it, and can change their mind about help.</p></li>`);
  }
  const open = (c?.followUps ?? []).filter((f) => NEEDS_ATTENTION.followUp[f.status]);
  for (const f of open) rows.push(`<li><strong>The guest still needs support.</strong><p>Follow-up ${esc(f.id)} is open · owner: ${esc(MEMBER_NAMES[f.openedOwner ?? ""] ?? "the holder")}. Review the guest's response and coordinate further support. The earlier delivery record remains unchanged.</p>${buttons(optionsFor(s, role, f.actionId, ["closeFollowUp"]).filter((x) => x.command.type === "closeFollowUp" && x.command.followUpId === f.id), "Close the follow-up")}<a href="#followup-review">Review the open follow-up</a></li>`);
  for (const l of c?.links ?? []) {
    const k = s.config.linkKinds!.find((x) => x.id === l.kindId)!;
    if (k.dependency === "required" && NEEDS_ATTENTION.link[l.status]) rows.push(`<li><strong>Handover blocked: ${esc(k.label)}</strong><p>Waiting on ${esc(partyOf(s.config, k.party).label.replace(" (fictional)", ""))} · ${esc(l.reference)} · ${LINK_WORDS[l.status]}. Release stays governed by Core; ${esc(partyOf(s.config, k.party).label.replace(" (fictional)", ""))} records the status.</p>${buttons(planOptions(s, role, ["withdrawLink", "revisePlan"]).filter((x) => x.command.type === "revisePlan" || (x.command.type === "withdrawLink" && x.command.linkId === l.id)), "Responses to a blocked handover")}</li>`);
  }
  const late = (c?.deadlines ?? []).filter((d) => deadlineExpired(d, s.clock));
  if (late.length) rows.push(`<li><strong>${late.length} deadline${late.length === 1 ? " is" : "s are"} overdue.</strong><p>${late.map((d) => esc(deadlineLine(s, d))).join("<br>")}. An unanswered guest response remains unknown.</p>${buttons(late.flatMap((d) => d.subject.kind === "action" ? optionsFor(s, role, d.subject.actionId, ["rescheduleDeadline", "cancelDeadline"]).filter((x) => "deadlineId" in x.command && x.command.deadlineId === d.id) : []), "Responses to an overdue deadline")}<a href="#own-h">Review due times and evidence</a></li>`);
  for (const h of s.report.awaitingHuman.filter((x) => /^Renew /.test(x.what) && x.actionId && x.actionType)) rows.push(`<li><strong>Capacity changed.</strong><p>${esc(h.what)}. The earlier acceptance stays on record; the handover cannot rely on it.</p>${buttons(typeOptions(s, role, h.actionType!), "Renew the check")}</li>`);
  return rows.length ? `<section class="wbs-card review-attention" aria-labelledby="attention-h"><h2 id="attention-h">${esc(WORDS.attention)}</h2><ul class="wbs-list">${rows.join("")}</ul></section>` : "";
}

/** Holder view: the whole response. */
function holderSections(s: Session): string {
  const v = holderView(s.config, s.state, s.evidence, s.facts(), "member-a");
  if (!v) {
    // Before the addressed duty lead accepts, Core gives no holder view yet; they see only the request as it was sent to them.
    return `${recognisedBasis(s)}<section class="wbs-card" aria-labelledby="pre-h"><span class="wbs-k" id="pre-h">The request sent to you</span><ul class="wbs-list">${s.state.request.map((f) => `<li><strong>${esc(f.label)}:</strong> ${esc(f.value)}</li>`).join("")}</ul><p class="wbs-small">Accepting makes you the accountable holder. Until then Core shows no plan, history or owners.</p></section>`;
  }
  const assurance = v.assurance.actions;
  const owner = (id: string) => assurance.find((a) => a.actionId === id)?.nextStepOwner ?? "";
  const openFollow = (id: string | null) => !!id && (v.coordination?.followUps ?? []).some((f) => f.actionId === id && NEEDS_ATTENTION.followUp[f.status]);
  const plan = v.plan.steps.map((st) => `<tr>${cell("Step", `${esc(title(st.actionType))}${st.actionId ? ` <span class="wbs-small">(${esc(st.actionId)})</span>` : ""}`)}${cell("Status", esc(openFollow(st.actionId) ? WORDS.deliveryFollowUp : (STEP_STATUS[st.status] ?? st.status)))}${cell("Who approves", esc(st.authority === "standing-policy" ? "Standing policy" : st.authority))}${cell("Waiting for", st.waitingFor.length ? `<ul class="wbs-list">${st.waitingFor.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>` : "<span class='wbs-small'>Nothing outstanding</span>")}</tr>`).join("");
  const deadlines = v.coordination?.deadlines ?? [];
  const rows = v.actions.filter((a) => isLive(a)).map((a) => {
    const dl = deadlines.filter((d) => d.subject.kind === "action" && d.subject.actionId === a.id).map((d) => esc(deadlineLine(s, d))).join("<br>");
    const ev = [a.sentAt ? `released ${hhmm(a.sentAt)}` : "", a.acceptedAt ? `accepted ${hhmm(a.acceptedAt)}` : "", a.completedAt ? `delivery reported ${hhmm(a.completedAt)}` : ""].filter(Boolean).join(" · ");
    const resp = (a.responses ?? []).map((r) => `${esc(s.config.actions.find((t) => t.id === a.typeId)!.responses!.find((x) => x.id === r.responseId)!.label)} (${hhmm(r.at)})`).join(" → ");
    return `<tr>${cell("Step", `${esc(title(a.typeId))} <span class="wbs-small">(${esc(a.id)})</span>`)}${cell("State", esc(openFollow(a.id) ? WORDS.deliveryFollowUp : (STATE_WORDS[a.state] ?? a.state)))}${cell("Waiting on", esc(owner(a.id)))}${cell("Due", dl || "<span class='wbs-small'>none</span>")}${cell("Delivery evidence and response", `${esc(ev) || "<span class='wbs-small'>nothing yet</span>"}${(() => { const o = outcomeParts(s, v, a); return o ? outcomeHtml(o) : resp ? `<br><strong>Guest's own response:</strong> ${resp}` : ""; })()}`)}</tr>`;
  }).join("");
  const fu = (v.coordination?.followUps ?? []).map((f) => `<li><strong>${esc(f.id)}</strong> · ${FOLLOWUP_WORDS[f.status]} · owner: ${esc(MEMBER_NAMES[f.openedOwner ?? ""] ?? "the holder")}${f.outcomeId ? ` · outcome: ${esc(s.config.followUpOutcomes!.find((o) => o.id === f.outcomeId)!.label)}` : ""}<br><span class="wbs-small">Opened after the guest's own report. It does not change the delivery record.</span></li>`).join("");
  const linkSection = (dependency: "required" | "informational", heading: string, id: string, none: string) => {
    const items = (v.coordination?.links ?? []).filter((l) => s.config.linkKinds!.find((x) => x.id === l.kindId)!.dependency === dependency).map((l) => {
      const k = s.config.linkKinds!.find((x) => x.id === l.kindId)!;
      return `<li><strong>${esc(k.label)}</strong> · ${esc(l.reference)} · ${LINK_WORDS[l.status]}<p class="wbs-small">Owner: ${esc(partyOf(s.config, k.party).label.replace(" (fictional)", ""))}</p><p class="wbs-small">${esc(DEPENDENCY_WORDS[k.dependency])}</p></li>`;
    }).join("");
    return `<section class="wbs-card" aria-labelledby="${id}"><span class="wbs-k" id="${id}">${esc(heading)}</span>${items ? `<ul class="wbs-list">${items}</ul>` : `<p class="wbs-small">${esc(none)}</p>`}</section>`;
  };
  const expectations = (s.config.deadlines ?? []).map((d) => `<li>${esc(DEADLINE_NAMES[d.id] ?? d.id)} — configured: ${esc(d.label)}.</li>`).join("");
  const prepared = v.plan.communications.map((c) => `<li>Prepared, not sent: ${esc(c.purpose)} <span class="wbs-small">(to ${esc(c.toLabel)})</span></li>`).join("");
  return `
    ${recognisedBasis(s)}
    <section class="wbs-card desktop-only" aria-labelledby="plan-h"><span class="wbs-k" id="plan-h">Agreed plan and outstanding checks</span>
      <div class="wbs-scroll"><table class="wbs-table review-responsive"><thead><tr><th>Step</th><th>Status</th><th>Who approves</th><th>Waiting for</th></tr></thead><tbody>${plan}</tbody></table></div></section>
    <section class="wbs-card" aria-labelledby="own-h"><span class="wbs-k" id="own-h"><span class="desktop-only">Ownership, due times, delivery evidence and follow-up</span><span class="mobile-only">Plan, ownership and evidence</span></span>
      <div class="mobile-only">${mobileSteps(s, v, owner)}</div>
      <div class="wbs-scroll desktop-only"><table class="wbs-table review-responsive"><thead><tr><th>Step</th><th>State</th><th>Waiting on</th><th>Due</th><th>Delivery evidence and response</th></tr></thead><tbody>${rows || "<tr><td colspan='5'>Nothing prepared yet.</td></tr>"}</tbody></table></div>
      <details class="wbs-more"><summary>How due times are set</summary><p class="wbs-small">Each due time above is the instant Core recorded (a moved time shows from and to). Core's configured expectations:</p><ul class="wbs-list">${expectations}</ul></details>
      ${fu ? `<h3 class="wbs-h3" id="followup-review" tabindex="-1">Follow-up</h3><ul class="wbs-list">${fu}</ul>` : ""}</section>
    ${disclosureSection(s, v)}
    ${linkSection("required", WORDS.requiredChecks, "required-h", "No required check is linked.")}
    ${linkSection("informational", WORDS.relatedWork, "related-h", "No independent work is linked yet.")}
    <section class="wbs-card" aria-labelledby="msg-h"><span class="wbs-k" id="msg-h">Messages</span><ul class="wbs-list">${prepared || "<li>No message is prepared.</li>"}${s.state.released.map((r) => `<li>Released: ${esc(s.config.communications.find((c) => c.id === r.templateId)!.purpose)} <span class="wbs-small">${hhmm(r.at)}</span></li>`).join("")}</ul></section>
    ${processReview(s, v)}
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
  const mineToChoose = v.actions.filter((a) => s.config.actions.find((t) => t.id === s.state.actions.find((x) => x.id === a.id)!.typeId)!.approver === "subject");
  const follows = v.actions.filter((a) => !mineToChoose.includes(a));
  const item = (a: (typeof v.actions)[number]) => `<li><strong>${esc(title(s.state.actions.find((x) => x.id === a.id)!.typeId))}</strong> · ${esc(STATE_WORDS[a.state] ?? a.state)}<br><span class="wbs-small">${esc(GUEST_SHARE.would(a.recipientLabel.replace(" (fictional)", ""), a.wouldShare.map((f) => `${f.label} “${f.value}”`).join("; ")))}${a.awaitingYourApproval ? ` · <b>${esc(GUEST_SHARE.waiting)}</b>` : ""}</span></li>`;
  const asks = mineToChoose.map(item).join("");
  const followList = follows.map((a) => `<li><strong>${esc(title(s.state.actions.find((x) => x.id === a.id)!.typeId))}</strong> · ${esc(STATE_WORDS[a.state] ?? a.state)}<br><span class="wbs-small">The hotel's own step. It uses only what you chose to share above, and the Duty lead approves it, not you.</span></li>`).join("");
  // The guest's own account of the outcome, from evidence addressed to them: delivery is the unit's report, feedback is theirs, and
  // neither settles it. Holder-only follow-up detail is never shown here.
  const reported = lines.some((l) => l.kind === "completion.recorded");
  const mine = lines.filter((l) => l.kind === "response.recorded");
  const outcome = reported || mine.length ? `<section class="wbs-card" aria-labelledby="g-out"><span class="wbs-k" id="g-out">How the support went</span>
    <dl class="wbs-outcome"><dt>Delivery confirmation</dt><dd>${reported ? `The unit reports it delivered the support${lines.some((l) => l.kind === "confirmation.recorded") ? "; you confirmed it" : ". That is their report; you have not confirmed it"}.` : "Not reported yet."}</dd>
    <dt>Your feedback</dt><dd>${mine.length ? mine.map((l) => esc(l.text)).join(" → ") : "Not given yet. Not answering is not a “yes” or a “no”."}</dd>
    <dt>Resolution</dt><dd>Delivery alone does not settle it. Your feedback tells the hotel whether more help is needed.</dd></dl></section>` : "";
  const said = s.origin === "signals" && s.help === "yes" ? s.helpHistory.at(-1) : null;
  const helpNote = said ? `<p class="wbs-small" data-testid="help-note">You said yes to practical help at ${esc(fullTime(said.at))}. That is separate from what you agree to share below. <button type="button" class="wbs-btn ghost" data-help="no">Change my answer: ${s.disclosed ? HELP_FURTHER : "No thanks"}</button></p>` : "";
  return `
    <section class="wbs-card" aria-labelledby="g-ask"><span class="wbs-k" id="g-ask">${esc(GUEST_SHARE.section)}</span>${helpNote}<ul class="wbs-list">${asks || "<li>Nothing is waiting for your choice.</li>"}</ul>${followList ? `<h3 class="wbs-h3">What follows</h3><ul class="wbs-list">${followList}</ul>` : ""}</section>
    ${outcome}
    <section class="wbs-card" aria-labelledby="g-now"><span class="wbs-k" id="g-now">What is happening</span><ol class="wbs-list wbs-hist">${stream.map((x) => `<li><time>${esc(x.time)}</time><span>${esc(x.text)}</span></li>`).join("") || "<li>Nothing yet.</li>"}</ol></section>
    <details class="wbs-more"><summary>Your record in detail, with who recorded each line</summary>${historyList(lines)}</details>`;
}

function unitSections(s: Session, role: DemoRoleId): string {
  const r = roleOf(role);
  const mine = recipientView(s.config, s.state, s.evidence, r.party!);
  const dl = deadlinesFor(s.config, s.state, { party: r.party! });
  const work = mine.map((a) => `<li><strong>${esc(title(s.state.actions.find((x) => x.id === a.id)!.typeId))}</strong> <span class="wbs-small">(${esc(a.id)})</span> · ${esc(STATE_WORDS[a.state] ?? a.state)}<br><span class="wbs-small">You were sent: ${esc(a.fields.map((f) => `${f.label}: ${f.value}`).join(" · ") || "nothing")}. ${esc(GENERIC_RESTRICTION)}</span></li>`).join("");
  const due = dl.map((d) => `<li>${esc(deadlineLine(s, d))}</li>`).join("");
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

/** Before any request exists. Only the Duty lead sees the signal desk; everyone else has nothing, and is told so plainly. */
function preOpen(s: Session, role: DemoRoleId, resultText: { ok: boolean; text: string } | null): string {
  const r = roleOf(role);
  const body = r.kind === "holder" ? signalDesk(s) : `<section class="wbs-card" aria-labelledby="none-h"><span class="wbs-k" id="none-h">${r.kind === "subject" ? "Nothing is waiting for your choice" : "Nothing has been sent to you"}</span><p>${r.kind === "subject" ? "The hotel has not asked to share anything about you." : r.kind === "unit" ? "Work appears here only when it is sent to your team." : "Linked work appears here only when it is assigned to you."}</p></section>`;
  return `${hero(s, role)}<div class="wbs-body"><div id="result" role="status" aria-live="polite" class="wbs-scope${resultText && !resultText.ok ? " refused" : ""}" tabindex="-1">${resultText ? esc(resultText.text) : esc(WORDS.actionsNote)}</div>${body}</div>`;
}

export function roleView(s: Session, role: DemoRoleId, resultText: { ok: boolean; text: string } | null): string {
  if (!s.opened) return preOpen(s, role, resultText);
  const r = roleOf(role);
  if (role === "guest" && s.origin === "signals" && !s.helpOffered) return guestHelpView(s, resultText);
  const items = nextSteps(s, role);
  const others = r.kind === "holder" ? s.report.plan.awaitingHuman.filter((h) => !["The request holder", "The addressed contact"].includes(h.who)).map((h) => `${h.who}: ${h.what}`) : [];
  const sections = r.kind === "holder" ? holderSections(s) : r.kind === "subject" ? guestSections(s) : r.kind === "unit" ? unitSections(s, role) : linkedSections(s, role);
  const more = moreOptions(s, role);
  const nextCmds = new Set(items.flatMap((i) => [i.primary, ...i.others]).filter(Boolean).map((c) => JSON.stringify(c!.command)));
  const rest = more.filter((c) => !nextCmds.has(JSON.stringify(c.command)));
  const refused = refusals(s, role);
  const attn = r.kind === "holder" ? attention(s) : "";
  return `${hero(s, role)}<div class="wbs-body">
    <div id="result" role="status" aria-live="polite" class="wbs-scope${resultText && !resultText.ok ? " refused" : ""}" tabindex="-1">${resultText ? esc(resultText.text) : esc(WORDS.actionsNote)}</div>
    ${role === "guest" && s.origin === "signals" && !s.sharingOpen ? helpCard(s) : ""}
    ${attn}
    ${nextCard(s, items, role, others, attn ? WORDS.otherWork : WORDS.nextStep)}
    ${r.kind === "holder" ? helpSection(s) : ""}
    ${sections}
    ${rest.length === 0 ? "" : `<details class="wbs-more"><summary>${esc(WORDS.moreActions)} (${rest.length})</summary><div class="wbs-alts">${rest.map((c) => `<button type="button" class="wbs-btn alt" data-cmd="${cmdKey(c)}" data-focus="cmd">${esc(c.label)}</button>`).join("") || "<p class='wbs-small'>Nothing else.</p>"}</div></details>`}
    <details class="wbs-more" id="refusals-details"><summary>${esc(WORDS.unavailable)} (${refused.length}), with Core's reason</summary><div class="wbs-scroll"><table class="wbs-table" id="refusals"><tbody>${refused.map((x) => `<tr><td>${esc(x.label)}</td><td class="wbs-reason">${esc(x.code)}: ${esc(x.message)}</td></tr>`).join("")}</tbody></table></div></details>
  </div>`;
}

function technical(s: Session): string {
  const pin = typeof __CORE_PIN__ !== "undefined" ? __CORE_PIN__ : { commit: "test", contractVersion: "" };
  return `<div class="wbs-tech"><h3 class="wbs-h3">What is real, and what is demonstrated</h3><ul class="wbs-list">
    <li><strong>Core kernel:</strong> the actual JALDO Core kernel runs in this page (commit ${esc(pin.commit.slice(0, 7))}, contract ${esc(pin.contractVersion)}). Approvals, handovers, checks, delivery records and follow-up are Core's.</li>
    <li><strong>Configuration:</strong> ${esc(DERIVATION_NOTE)}</li>
    <li><strong>Recognition and recommendation:</strong> demonstrated, not AI. The proactive recommendation comes from a fixed, versioned rule (${esc(RULE.id)} v${esc(RULE.version)}: ${esc(RULE.label)}) with fixed wording. Core's recognition rules and wording are likewise configured text. <strong>No model is connected</strong> and nothing here claims model quality. A connected recommendation model would be a separate capability that no accepted Core contract covers.</li>
    <li><strong>Signal checks, freshness and the guest's help answer:</strong> required fields, allowed values, room matching, full timestamps, per-source maximum ages (property ${s.desk.freshness.maxAgeMinutes.pms} min, maintenance ${s.desk.freshness.maxAgeMinutes.maintenance} min, future tolerance ${s.desk.freshness.futureToleranceSeconds} s), the adoption decision record and the guest's answer about help are all demonstration-adapter behaviour. Core provides none of them.</li>
    <li><strong>People and channels:</strong> demo roles are a view selector, not access control; delivery is simulated; every system event is fictional; the clock is synthetic.</li></ul>
    <h3 class="wbs-h3">Core contract status (a merged contract is not an accepted contract)</h3>
    <div class="wbs-scroll"><table class="wbs-table review-responsive"><thead><tr><th>Contract</th><th>Status recorded in Core</th><th>Here</th></tr></thead><tbody>${CONTRACTS.map((c) => `<tr><td data-label="Contract">${esc(c.name)}</td><td data-label="Status recorded in Core">${esc(c.status)}</td><td data-label="Here">${esc(c.used)}</td></tr>`).join("")}</tbody></table></div>
    <h3 class="wbs-h3">Missing in Core, and the boundary demonstrated</h3>
    <div class="wbs-scroll"><table class="wbs-table review-responsive"><thead><tr><th></th><th>Gap</th><th>Boundary</th></tr></thead><tbody>${GAPS.map((g) => `<tr><td data-label="Gap">${esc(g.id)}</td><td data-label="What is missing">${esc(g.gap)}</td><td data-label="Boundary here">${esc(g.boundary)}</td></tr>`).join("")}</tbody></table></div></div>`;
}

export function page(s: Session, role: DemoRoleId, resultText: { ok: boolean; text: string } | null, pathId: string | null): string {
  const pin = typeof __CORE_PIN__ !== "undefined" ? __CORE_PIN__ : { commit: "test", contractVersion: "" };
  const path = PATHS.find((p) => p.id === pathId);
  return `<a class="pw-skip" href="#role-view">Skip to the selected role's view</a>
  <header class="pw-header"><div class="pw-brand"><img src="/brand/jaldo-logo-white.webp" alt="JALDO" width="120"><span>TRAVEL · RESPONSE WORKSPACE</span></div>
    <nav aria-label="Workspace"><span>Core ${esc(pin.commit.slice(0, 7))} · contract ${esc(pin.contractVersion)}</span></nav></header>
  <p class="hz-banner" role="note">${esc(LABELS.banner)}</p>
  <main id="main" class="wbs hz-main">
    <details class="wbs-card hz-controls" id="review-tools"><summary>Review tools · viewing as ${esc(roleOf(role).label)}</summary><div class="review-controls-body">
      <span class="wbs-k">Demo role · not access control</span>
      <div class="wbs-tabs" role="group" aria-label="Demo role">${DEMO_ROLES.map((r) => `<button type="button" class="wbs-role" data-role="${r.id}" aria-pressed="${r.id === role}">${esc(r.label)}</button>`).join("")}</div>
      <p class="wbs-small">${esc(LABELS.roleNote)}</p>
      <span class="wbs-k">Starting point</span>
      <div class="wbs-tabs" role="group" aria-label="Starting point">${([["signals", "System events first"], ["guest", "Guest asks first"]] as const).map(([id, label]) => `<button type="button" class="wbs-role" data-origin="${id}" aria-pressed="${id === s.origin}">${label}</button>`).join("")}</div>
      <span class="wbs-k">Signal checks (before a request is opened)</span>
      <div class="wbs-tabs">${[["duplicate", "Repeat the property event"], ["conflict", "Same key, different content"], ["stale", "Late, older property reading"], ["asked", "Guest already asked"], ["future", "Future-dated event"], ["malformed", "Malformed time"], ["missing", "Missing field"], ["bad-status", "Unknown status"], ["out-of-order", "Maintenance arrives first"], ["pms-only", "Only the property event"], ["short-repair", "Short repair"], ["maintenance", "Add the maintenance event"], ["reset-signals", "Restore both events"]].map(([id, label]) => `<button type="button" class="wbs-btn alt" data-signal="${id}">${label}</button>`).join("")}</div>
      <span class="wbs-k">Synthetic facts (the reviewer, not a role)</span>
      <div class="wbs-tabs"><span class="wbs-small hz-clock">Synthetic clock ${esc(s.clock.toISOString().slice(11, 16))} UTC</span>
        <button type="button" class="wbs-btn alt" data-adv="10">Advance 10 min</button><button type="button" class="wbs-btn alt" data-adv="60">Advance 60 min</button>
        <button type="button" class="wbs-btn alt" data-cap="housekeeping:down">Housekeeping unavailable</button><button type="button" class="wbs-btn alt" data-cap="housekeeping:up">Housekeeping available</button>
        <button type="button" class="wbs-btn reset" data-reset="1">Start again</button></div>
      <details class="wbs-more" id="guide"><summary>Reviewer guide: seven review paths (not part of any role's view)</summary>
        <div class="wbs-alts">${PATHS.map((p) => `<button type="button" class="wbs-btn ghost" data-path="${p.id}" aria-pressed="${p.id === pathId}">${esc(p.title)}</button>`).join("")}</div>
        ${path ? `<p class="wbs-scope"><strong>${esc(path.title)}.</strong> ${esc(path.what)}<br>${esc(path.try)}<br><span class="wbs-small">Setting up a path applies real commands to the kernel as the roles that would take them; a refusal stops it and is shown.</span></p>` : "<p class='wbs-small'>Choose a path to set up its starting point with real kernel commands.</p>"}</details>
      <details class="wbs-more" id="tech"><summary>Technical review details</summary>${technical(s)}</details>
    </div></details>
    <div id="role-view" tabindex="-1" aria-label="${esc(roleOf(role).label)} view">${roleView(s, role, resultText)}</div>
  </main>
  <footer class="pw-footer"><span class="wbs-small">Isolated review harness. In-page state only; nothing is stored, sent or published. Not a Travel page.</span></footer>`;
}
