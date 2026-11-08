// The proactive scenario: signals -> recognition -> recommendation -> authorised action -> review. Everything after adoption is Core's.
import { describe, expect, it } from "vitest";
import { admitEvent, loadConfiguration, orchestrateMoment, recognise } from "@workspace/jaldo-orchestration";
import { TRAVEL_PRACTICAL_SUPPORT_CONFIGURATION } from "@workspace/jaldo-orchestration/deployments";
import { DERIVED_CONFIGURATION, DERIVED_ID, PROACTIVE_EVENT_TYPE } from "../src/config";
import { CONFLICTING_PMS, GUEST_ALREADY_ASKED, MAINTENANCE_EVENT, PMS_EVENT, SHORT_REPAIR, STALE_PMS, SignalDesk } from "../src/signals";
import { SCRIPTS, runPath } from "../src/paths";
import { moreOptions, nextSteps } from "../src/next";
import { DEMO_ROLES, SCOPE, Session, type DemoRoleId } from "../src/session";
import { CONTRACTS, GAPS } from "../src/copy";
import { page, roleView } from "../src/views";

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ");
const view = (s: Session, role: DemoRoleId) => text(roleView(s, role, null));
const ROLES = DEMO_ROLES.map((r) => r.id);
const NOON = new Date("2026-11-02T09:00:00.000Z");
const signals = () => new Session("signals");
const REASON = "The room is still unavailable and the repair is long, so a check-in is sensible.";
const adopt = (s: Session, extra: { expectedDigest?: string } = {}) => s.adopt("duty-lead", { reason: REASON, ...extra });
const guestAllow = (s: Session) => nextSteps(s, "guest")[0].others.find((c) => c.command.type === "approve")!;

describe("what Core does and does not provide (each claim in CORE-GAPS.md is checked here)", () => {
  it("the derived configuration is Core's, plus exactly one opening event, and Core's own loader accepts it", () => {
    const { events, id, version, ...rest } = DERIVED_CONFIGURATION;
    const { events: baseEvents, id: bid, version: bver, ...baseRest } = TRAVEL_PRACTICAL_SUPPORT_CONFIGURATION;
    expect(rest).toEqual(baseRest);
    expect(events.length).toBe(baseEvents.length + 1);
    expect(events.filter((e) => !baseEvents.some((b) => b.type === e.type)).map((e) => e.type)).toEqual([PROACTIVE_EVENT_TYPE]);
    expect(id).toBe(DERIVED_ID); expect(bid).toBe("travel-practical-support"); expect(bver).toBe("1.0.0");
    expect(() => loadConfiguration(DERIVED_CONFIGURATION)).not.toThrow();
  });
  it("G2: Core refuses a maintenance work-order event, so it cannot be recorded as a fact", () => {
    const s = signals();
    const r = admitEvent(s.config, { schema: "jaldo.event", id: "m", idempotencyKey: "m", type: MAINTENANCE_EVENT.type, occurredAt: MAINTENANCE_EVENT.occurredAt, scope: SCOPE, source: { system: "maintenance-fictional" }, provenance: { method: "integration" }, purpose: "room-readiness", classification: "internal", context: MAINTENANCE_EVENT.context });
    expect(r.ok).toBe(false);
    expect(s.coreRefusesMaintenance()).toMatch(/event_not_permitted/);
  });
  it("G3: Core lets its configured system actor open a request (via prepare-plan automation) and refuses a configuration without it", () => {
    const s = signals();
    const def = s.config.events.find((e) => e.type === PROACTIVE_EVENT_TYPE)!;
    const event = { schema: "jaldo.event", id: "e", idempotencyKey: "e", type: def.type, occurredAt: NOON.toISOString(), scope: SCOPE, source: { system: "x" }, provenance: { method: "system" }, purpose: def.purpose, classification: def.maxClassification, context: s.desk.openingContext() };
    const open = orchestrateMoment(s.config, null, { kind: "event", event, actor: { kind: "system", scope: SCOPE }, routing: { destination: "member-a" } }, s.facts(), "c1");
    expect(open.ok).toBe(true);
    const without = loadConfiguration({ ...DERIVED_CONFIGURATION, automation: { operations: DERIVED_CONFIGURATION.automation.operations.filter((o) => o !== "prepare-plan") } } as never);
    expect(orchestrateMoment(without, null, { kind: "event", event, actor: { kind: "system", scope: SCOPE }, routing: { destination: "member-a" } }, s.facts(), "c2").ok).toBe(false);
  });
  it("G4: Core derives no recommendation for a holder who has not accepted", () => {
    const s = signals(); expect(adopt(s).ok).toBe(true);
    expect(recognise(s.config, s.state, s.facts(), "member-a").active).toEqual([]);
    expect(s.report.recognised).toEqual([]);
  });
  it("the contract status table names the draft 1.3.0 and does not call a merged contract accepted", () => {
    const t = (n: string) => CONTRACTS.find((c) => c.name.includes(n))!;
    expect(t("1.3.0").status).toMatch(/DRAFT/); expect(t("1.3.0").used).toMatch(/^Not used/);
    expect(t("1.2.0").status).toMatch(/no owner acceptance is recorded/);
    expect(CONTRACTS.filter((c) => /^Accepted/.test(c.status)).map((c) => c.name)).toEqual(["ADR-0036 (coordination foundation)"]);
    expect(GAPS.map((g) => g.id)).toEqual(["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"]);
  });
});

describe("the signal desk: duplicate, stale, out-of-order and insufficient signals", () => {
  const both = () => { const d = new SignalDesk(); d.ingest(PMS_EVENT, NOON); d.ingest(MAINTENANCE_EVENT, NOON); return d; };
  it("two independent, agreeing sources recognise the moment, with evidence and uncertainty, and distress is not inferred", () => {
    const a = both().assess(NOON);
    expect(a.recognised).toBe(true);
    expect(a.evidence.map((e) => e.source)).toEqual(["Property management system", "Maintenance work orders"]);
    expect(a.evidence[0].facts.find((f) => f.label === "Status")!.value).toBe("Not ready");
    expect(a.uncertainty.join(" ")).toMatch(/operational delay does not establish distress/i);
    expect(a.uncertainty.length).toBeGreaterThanOrEqual(4);
  });
  it("a repeated delivery has no second effect; the same key with different content is a conflict that changes nothing", () => {
    const d = both(); const before = JSON.stringify(d.assess(NOON));
    expect(d.ingest(PMS_EVENT, NOON).outcome).toBe("duplicate");
    expect(d.ingest(CONFLICTING_PMS, NOON).outcome).toBe("conflict");
    expect(JSON.stringify(d.assess(NOON))).toBe(before);
  });
  it("a stale, older reading that arrives late is kept but does not change the current facts", () => {
    const d = both(); const r = d.ingest(STALE_PMS, NOON);
    expect(r.outcome).toBe("superseded");
    expect(d.assess(NOON).recognised).toBe(true);
    expect(d.current("pms")!.signal.id).toBe(PMS_EVENT.id);
  });
  it("arrival order does not matter: events are read in event-time order", () => {
    const a = new SignalDesk(); a.ingest(MAINTENANCE_EVENT, NOON); a.ingest(PMS_EVENT, NOON);
    const b = both();
    expect(a.assess(NOON).recognised).toBe(true);
    expect(a.assess(NOON).evidence).toEqual(b.assess(NOON).evidence);
    const s = signals(); s.signalAction("out-of-order");
    const rows = text(roleView(s, "duty-lead", null));
    expect(rows.indexOf("Property management system")).toBeLessThan(rows.indexOf("Maintenance work orders"));
    expect(s.desk.received.map((r) => r.order)).toEqual([1, 2]);
    expect(s.desk.received[0].signal.source).toBe("maintenance");
  });
  it("a single source, a short repair, an unmet promised time or a guest who already asked is not enough, and nothing can be adopted", () => {
    const cases: [string, SignalDesk, Date?][] = [
      ["one source", (() => { const d = new SignalDesk(); d.ingest(PMS_EVENT, NOON); return d; })()],
      ["short repair", (() => { const d = new SignalDesk(); d.ingest(PMS_EVENT, NOON); d.ingest(SHORT_REPAIR, NOON); return d; })()],
      ["promised time not reached", both(), new Date("2026-11-02T08:30:00.000Z")],
      ["guest already asked", (() => { const d = both(); d.ingest(GUEST_ALREADY_ASKED, NOON); return d; })()],
    ];
    for (const [name, d, at] of cases) { const a = d.assess(at ?? NOON); expect(a.recognised, name).toBe(false); expect(a.missing.length, name).toBeGreaterThan(0); }
    const s = signals(); s.signalAction("pms-only");
    expect(view(s, "duty-lead")).toMatch(/Not enough to recommend a check-in/);
    const r = adopt(s); expect(r.ok).toBe(false); expect(s.opened).toBe(false);
  });
  it("every signal is validated against Core's event envelope", () => {
    const d = new SignalDesk();
    expect(d.ingest({ ...PMS_EVENT, id: "", key: "k" }, NOON).outcome).toBe("refused");
    expect(d.ingest({ ...PMS_EVENT, key: "k2", occurredAt: "yesterday" }, NOON).outcome).toBe("refused");
  });
});

describe("recognition recommends; people decide; Core does the rest", () => {
  it("adopting records one request addressed to the Duty lead and approves, shares and releases nothing", () => {
    const s = signals(); expect(s.opened).toBe(false);
    expect(adopt(s).ok).toBe(true);
    expect(s.evidence.map((e) => e.kind)).toEqual(["event.recorded", "request.opened"]);
    expect(s.state.actions).toEqual([]); expect(s.state.owner).toBeNull();
    expect(s.evidence.find((e) => e.kind === "request.opened")!.actor).toMatchObject({ kind: "system" });
    s.apply("duty-lead", nextSteps(s, "duty-lead")[0].primary!.command); // the Duty lead accepts responsibility
    const kinds = s.evidence.map((e) => e.kind);
    expect(kinds).not.toContain("approval.recorded"); expect(kinds).not.toContain("disclosure.made"); expect(kinds).not.toContain("execution.attempted");
  });
  it("only the Duty lead may adopt, and a second adoption is refused", () => {
    for (const r of ROLES.filter((x) => x !== "duty-lead")) { const s = signals(); expect(s.adopt(r, { reason: REASON }).ok, r).toBe(false); expect(s.opened).toBe(false); }
    const s = signals(); adopt(s); expect(adopt(s).ok).toBe(false);
  });
  it("before adoption there is no coordination, and every other role sees nothing of the signals", () => {
    const s = signals();
    expect(() => s.state).toThrow(/No coordination exists yet/);
    expect(s.apply("duty-lead", { type: "acceptRequest", checks: { authority: true, noConflict: true, capacity: true } }).ok).toBe(false);
    for (const r of ROLES.filter((x) => x !== "duty-lead")) expect(view(s, r), r).not.toMatch(/Room 412|WO-1182|Property management|air-handling|Not ready|PMS|signal/i);
    expect(view(s, "duty-lead")).toMatch(/Room 412.*WO-1182/);
  });
  it("the recommendation shows its reason, the responsible team and the next permitted action, and names a demonstration, not a model", () => {
    const html = view(signals(), "duty-lead");
    expect(html).toMatch(/A proactive service check-in may help/);
    expect(html).toMatch(/Why\. Two independent, fresh sources agree/);
    expect(html).toMatch(/The Duty lead decides/); expect(html).toMatch(/Guest services would deliver/);
    expect(html).toMatch(/Open a proactive check-in for me to review/);
    expect(html).toMatch(/demonstrated recommendation/i);
    expect(html).not.toMatch(/AI-powered|machine learning|model-based/i);
    expect(text(page(signals(), "duty-lead", null, null))).toMatch(/No model is connected/);
  });
  it("after adoption the other roles' views never contain the signal desk or its facts, and Housekeeping sees no guest field", () => {
    const s = signals(); runPath(s, "maintenance");
    for (const r of ROLES.filter((x) => x !== "duty-lead")) {
      const v = view(s, r);
      expect(v, r).not.toMatch(/Property management|Not ready|signal desk|Why this response exists|proactive-checkin-demo|Process review/i);
    }
    for (const f of s.state.request) expect(view(s, "housekeeping")).not.toContain(f.value);
    expect(view(s, "duty-lead")).toMatch(/Why this response exists/);
  });
});

describe("the guest chooses before anything is shared", () => {
  const start = () => { const s = signals(); runPath(s, "missing"); expect(s.chooseHelp("yes").ok).toBe(true); return s; };
  it("beside equally accessible allow and decline choices the guest sees the exact values, recipient and purpose", () => {
    const s = start(); const step = nextSteps(s, "guest")[0];
    expect(step.primary).toBeNull();
    const labels = step.others.map((c) => c.label);
    expect(labels).toEqual([expect.stringMatching(/^Allow (Reception|Guest services) to see these details$/), expect.stringMatching(/^Do not allow (Reception|Guest services) to see these details$/)]);
    const html = roleView(s, "guest", null);
    const card = html.slice(html.indexOf('data-testid="share-detail"'), html.indexOf("</table>", html.indexOf('data-testid="share-detail"')));
    const t = text(card);
    expect(t).toMatch(/Recipient: (Reception|Guest services)/); expect(t).toMatch(/Purpose: /);
    for (const f of s.state.request.filter((x) => /What the guest asked for|What the guest said would help/.test(x.label))) expect(t).toContain(f.value);
    expect(t).toMatch(/Nothing yet: the hotel is offering a check-in/);
    // equal prominence: the same class on both buttons, neither a highlighted primary
    const classes = [...html.matchAll(/<button type="button" class="wbs-btn (\w+)" data-cmd="[^"]*(?:approve|refuse)[^"]*"/g)].map((m) => m[1]);
    expect(classes.length).toBeGreaterThanOrEqual(2); expect(new Set(classes)).toEqual(new Set(["alt"]));
  });
  it("the guest is asked to choose only for sharing they approve; the handover the Duty lead approves is listed as what follows", () => {
    const s = start(); const html = roleView(s, "guest", null);
    const choose = text(html.slice(html.indexOf('id="g-ask"'), html.indexOf("What follows")));
    expect(choose).toMatch(/Share the request with Reception/); expect(choose).not.toMatch(/Hand the practical support/);
    expect(text(html.slice(html.indexOf("What follows")))).toMatch(/Hand the practical support to Guest services.*the Duty lead approves it, not you/);
  });
  it("declining shares nothing, the recipient sees nothing, and the guest can still choose differently for others", () => {
    const s = start(); const step = nextSteps(s, "guest")[0]; const id = step.actionId!;
    const decline = step.others.find((c) => c.command.type === "refuse")!;
    expect(s.apply("guest", decline.command).ok).toBe(true);
    const a = s.state.actions.find((x) => x.id === id)!;
    expect(a.sentAt).toBeNull();
    expect(s.evidence.filter((e) => e.actionId === id).map((e) => e.kind)).not.toContain("disclosure.made");
    const unit = DEMO_ROLES.find((r) => r.id === ({ "share-reception": "reception", "share-guest-services": "guest-services" } as Record<string, DemoRoleId>)[a.typeId])!.id;
    for (const f of s.state.request) expect(view(s, unit)).not.toContain(f.value);
    const next = nextSteps(s, "guest")[0];
    expect(next.others.some((c) => c.command.type === "approve")).toBe(true);
  });
  it("the guest's allow is a command Core accepts from the guest and refuses from the Duty lead", () => {
    const s = start(); const allow = guestAllow(s);
    expect(s.ask("duty-lead", allow.command).ok).toBe(false);
    expect(s.ask("guest", allow.command).ok).toBe(true);
  });
});

describe("changed approvals, required checks, feedback, no response and follow-up ownership (starting from signals)", () => {
  it("every existing path still sets up from signals, and each role keeps every action Core would accept", () => {
    for (const id of Object.keys(SCRIPTS)) {
      const s = signals(); const r = runPath(s, id); expect(r, id).toEqual({ ok: true });
      if (id === "normal") { expect(s.opened).toBe(false); continue; }
      for (const role of ROLES) { const html = roleView(s, role, null); for (const c of moreOptions(s, role)) expect(html, `${id}/${role}: ${c.label}`).toContain(c.label.replace(/&/g, "&amp;")); }
    }
  });
  it("capacity lost after approval: the attention panel offers the renewal, and Core accepts it", () => {
    const s = signals(); runPath(s, "capacity"); s.setCapacity("housekeeping", true);
    const html = roleView(s, "duty-lead", null);
    expect(html).toMatch(/Needs attention now[\s\S]*Capacity changed/);
    const panel = html.slice(html.indexOf('class="wbs-card review-attention"'), html.indexOf("</section>", html.indexOf('class="wbs-card review-attention"')));
    expect(panel).toMatch(/Prepare: Check staff capacity/);
    const btn = [...panel.matchAll(/data-cmd="([^"]+)"/g)].map((m) => JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&")));
    expect(btn.length).toBeGreaterThan(0);
    for (const c of btn) expect(s.ask("duty-lead", c).ok).toBe(true);
  });
  it("an unresolved required check blocks release, says who owns it, and offers only what Core permits the Duty lead", () => {
    const s = signals(); runPath(s, "dependency");
    const panel = roleView(s, "duty-lead", null);
    expect(panel).toMatch(/Handover blocked: Area safety clearance[\s\S]*Waiting on Maintenance/);
    expect(s.ask("duty-lead", { type: "execute", actionId: "SUP-1" }).ok).toBe(false);
    expect(s.ask("duty-lead", { type: "recordLinkStatus", linkId: s.state.links![0].id, status: "resolved" }).ok).toBe(false);
  });
  it("negative feedback keeps delivery, opens a follow-up owned by the Duty lead, and the panel closes it with an outcome", () => {
    const s = signals(); runPath(s, "didnothelp");
    const before = s.state.actions.find((a) => a.id === "SUP-1")!.completedAt;
    expect(s.apply("guest", { type: "recordResponse", actionId: "SUP-1", responseId: "still-needs-support" }).ok).toBe(true);
    expect(s.state.actions.find((a) => a.id === "SUP-1")!.completedAt).toBe(before);
    const html = roleView(s, "duty-lead", null);
    expect(text(html)).toMatch(/The guest still needs support\. Follow-up FU-SUP-1-1 is open · owner: the duty lead/);
    const panel = html.slice(html.indexOf('class="wbs-card review-attention"'), html.indexOf("</section>", html.indexOf('class="wbs-card review-attention"')));
    const close = [...panel.matchAll(/data-cmd="([^"]*closeFollowUp[^"]*)"/g)].map((m) => JSON.parse(m[1].replace(/&quot;/g, '"')));
    expect(close.length).toBe(3);
    expect(s.apply("duty-lead", close[0]).ok).toBe(true);
    expect(view(s, "duty-lead")).toMatch(/Resolution\s+Closed · /);
    expect(view(s, "duty-lead")).not.toMatch(/The guest still needs support\./);
  });
  it("delivery confirmation, guest feedback and resolution are three separate statements, for the lead and for the guest", () => {
    const s = signals(); runPath(s, "didnothelp");
    const lead0 = view(s, "duty-lead");
    expect(lead0).toMatch(/Delivery confirmation\s+Reported by Guest services at 09:00 \(their report; the guest has not confirmed it\)\.\s+Guest feedback\s+None yet\. No answer is unknown, never “helped”\.\s+Resolution\s+Not established\./);
    expect(view(s, "guest")).toMatch(/Delivery confirmation\s+The unit reports it delivered the support\. That is their report; you have not confirmed it\.\s+Your feedback\s+Not given yet/);
    s.apply("guest", { type: "recordResponse", actionId: "SUP-1", responseId: "helped" });
    expect(view(s, "duty-lead")).toMatch(/Guest feedback\s+Support helped.*Resolution\s+No follow-up needed: the guest says it helped\./);
    const g = view(s, "guest"); expect(g).toMatch(/Your feedback\s+Your response was recorded/); expect(g).not.toMatch(/follow-up/i);
  });
  it("no response stays unknown, one overdue item is raised, and the attention panel offers Core's reschedule and cancel", () => {
    const s = signals(); runPath(s, "noresponse"); s.advance(91);
    const html = roleView(s, "duty-lead", null);
    expect(html).toMatch(/1 deadline is overdue/);
    expect((html.match(/data-cmd="[^"]*rescheduleDeadline[^"]*"/g) ?? []).length).toBeGreaterThan(0);
    expect(view(s, "duty-lead")).toMatch(/Guest feedback\s+None yet\. No answer is unknown/);
    s.advance(60); expect(s.report.awaitingHuman.filter((h) => /deadline/i.test(h.what)).length).toBeLessThanOrEqual(1);
  });
  it("independent maintenance stays open and separate when support completes", () => {
    const s = signals(); runPath(s, "maintenance");
    const lead = roleView(s, "duty-lead", null);
    expect(lead.indexOf("Required checks")).toBeLessThan(lead.indexOf("Related work · stays open separately"));
    expect(text(lead.slice(lead.indexOf("Related work · stays open separately")))).toMatch(/Facility repair · WO-1182 · open/);
    expect(view(s, "maintenance")).toMatch(/WO-1182/); expect(view(s, "maintenance")).not.toMatch(/SUP-1|Alex/);
  });
});

describe("disclosure values, mobile cards and the process review", () => {
  it("the Duty lead sees exactly what was shared with whom, and nothing about it is recomputed", () => {
    const s = signals(); runPath(s, "maintenance");
    const t = view(s, "duty-lead");
    expect(t).toMatch(/What is shared, with whom, exactly/);
    for (const f of s.state.request) expect(t).toContain(f.value);
    expect(t).toMatch(/Not shared: Contact details, Any other guest, Internal notes/);
  });
  it("narrow screens get one card per step with plan, ownership, due time and evidence together", () => {
    const s = signals(); runPath(s, "maintenance");
    const html = roleView(s, "duty-lead", null);
    const block = html.slice(html.indexOf('<ol class="wbs-list wbs-steps">'), html.indexOf("</ol>", html.indexOf('<ol class="wbs-list wbs-steps">')));
    const titles = [...block.matchAll(/<li class="wbs-step"><strong>([^<]+)/g)].map((m) => m[1].replace(/ <span.*/, ""));
    expect(titles.length).toBeGreaterThanOrEqual(6); expect(new Set(titles).size).toBe(titles.length);
    expect(block).toMatch(/Status[\s\S]*Waiting for[\s\S]*Waiting on[\s\S]*Evidence/);
    expect(html).toMatch(/class="wbs-card desktop-only"[^>]*aria-labelledby="plan-h"/);
  });
  it("the process review describes steps, shows timing, delivery evidence, outcome and unresolved work, and scores no one", () => {
    const s = signals(); runPath(s, "didnothelp"); s.apply("guest", { type: "recordResponse", actionId: "SUP-1", responseId: "still-needs-support" });
    s.advance(30);
    const t = view(s, "duty-lead");
    const review = t.slice(t.indexOf("Process review"));
    expect(review).toMatch(/JALDO recognised the moment from system events/); expect(review).toMatch(/Duty lead opened the proactive check-in/);
    expect(review).toMatch(/Delivery reported by the unit/); expect(review).toMatch(/Guest feedback recorded/);
    expect(review).toMatch(/Unresolved work[\s\S]*Follow-up FU-SUP-1-1 is open/);
    expect(review).toMatch(/Nobody is scored or ranked/); expect(review).toMatch(/Proposals for authorised review/);
    expect(review).toMatch(/Proposal only: not applied/);
    expect(review).not.toMatch(/leaderboard|per person|performance rating|score of/i);
    for (const r of ROLES.filter((x) => x !== "duty-lead")) expect(view(s, r), r).not.toMatch(/Process review/);
  });
  it("viewing the review changes nothing: no rule, configuration or record moves", () => {
    const s = signals(); runPath(s, "capacity"); s.setCapacity("housekeeping", true);
    const before = JSON.stringify([s.config, s.state, s.evidence.length]);
    view(s, "duty-lead"); view(s, "guest");
    expect(JSON.stringify([s.config, s.state, s.evidence.length])).toBe(before);
  });
  it("the page leads with what JALDO does and keeps the concise demonstration label", () => {
    const s = signals(); const t = text(page(s, "duty-lead", null, null));
    expect(t).toMatch(/Interactive demonstration · fictional system events · simulated delivery/);
    expect(t.indexOf("JALDO is watching permitted system events")).toBeGreaterThan(-1);
    expect(t.indexOf("What JALDO received")).toBeLessThan(t.indexOf("Technical review details") + 100000);
  });
});
