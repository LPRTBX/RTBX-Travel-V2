// Regression cases for the review findings: freshness, business validation, adoption evidence, and accepting help versus sharing.
import { describe, expect, it } from "vitest";
import { applyCommand } from "@workspace/jaldo-orchestration";
import { BAD_STATUS_PMS, DEFAULT_FRESHNESS, FUTURE_PMS, MAINTENANCE_EVENT, MALFORMED_TIME_PMS, MISSING_FIELD_MNT, PMS_EVENT, SignalDesk, fullTime, parseFullTime, validateBusiness, type Signal } from "../src/signals";
import { runPath } from "../src/paths";
import { nextSteps } from "../src/next";
import { DEMO_ROLES, Session, roleOf, type DemoRoleId } from "../src/session";
import { page, roleView } from "../src/views";

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ");
const view = (s: Session, role: DemoRoleId) => text(roleView(s, role, null));
const ROLES = DEMO_ROLES.map((r) => r.id);
const at = (hhmm: string, day = "2026-11-02") => new Date(`${day}T${hhmm}:00.000Z`);
const iso = (hhmm: string, day = "2026-11-02") => at(hhmm, day).toISOString();
const REASON = "The room is still unavailable and the repair is long, so a check-in is sensible.";
const signals = () => new Session("signals");
const adopt = (s: Session, extra: { expectedDigest?: string; reason?: string } = {}) => s.adopt("duty-lead", { reason: REASON, ...extra });
const withOffer = () => { const s = signals(); expect(adopt(s).ok).toBe(true); expect(s.apply("duty-lead", nextSteps(s, "duty-lead")[0].primary!.command).ok).toBe(true); return s; };
const both = (now = at("09:00"), freshness = DEFAULT_FRESHNESS) => { const d = new SignalDesk(freshness); d.ingest(PMS_EVENT, now); d.ingest(MAINTENANCE_EVENT, now); return d; };

describe("freshness: an old reading stops supporting a recommendation even if nothing new arrives", () => {
  it("recognised while fresh, then not once a source ages out, with no new event", () => {
    const d = both();
    expect(d.assess(at("09:00")).recognised).toBe(true);
    const later = d.assess(at("09:21")); // property reading 08:50 is 31 minutes old; its maximum is 30
    expect(later.recognised).toBe(false);
    expect(later.missing.join(" ")).toMatch(/property management system reading is 31 minutes old; the maximum is 30/);
    expect(later.freshness.find((f) => f.source === "pms")!.fresh).toBe(false);
    expect(later.freshness.find((f) => f.source === "maintenance")!.fresh).toBe(true); // 26 minutes of 60
    expect(d.received.length).toBe(2); // nothing new was received
  });
  it("the limit is inclusive at the boundary and each source has its own configurable maximum", () => {
    const d = both();
    expect(d.assess(at("09:20")).recognised).toBe(true); // exactly 30 minutes
    expect(d.assess(new Date(at("09:20").getTime() + 60_000)).recognised).toBe(false);
    const tight = both(at("09:00"), { ...DEFAULT_FRESHNESS, maxAgeMinutes: { pms: 5, maintenance: 5 } });
    expect(tight.assess(at("09:00")).recognised).toBe(false);
    const wide = both(at("09:00"), { ...DEFAULT_FRESHNESS, maxAgeMinutes: { pms: 120, maintenance: 120 } });
    expect(wide.assess(at("10:00")).recognised).toBe(true);
    const mntOnly = both(at("09:00"), { ...DEFAULT_FRESHNESS, maxAgeMinutes: { pms: 120, maintenance: 5 } });
    expect(mntOnly.assess(at("09:00")).recognised).toBe(true); // 5 of 5 minutes: inclusive
    expect(mntOnly.assess(at("09:01")).missing.join(" ")).toMatch(/maintenance work orders reading is 6 minutes old; the maximum is 5/);
    expect(mntOnly.assess(at("09:01")).freshness.find((f) => f.source === "pms")!.fresh).toBe(true);
  });
  it("the Session re-evaluates when time advances, the card says why, and adoption is refused", () => {
    const s = signals();
    expect(view(s, "duty-lead")).toMatch(/Recommended: offer the guest a proactive check-in/);
    s.advance(21); // 09:21: the 08:50 property reading is 31 minutes old
    const v = view(s, "duty-lead");
    expect(v).toMatch(/The evidence is too old to recommend a check-in/); expect(v).toMatch(/Too old: supports nothing/);
    expect(roleView(s, "duty-lead", null)).not.toContain("data-adopt");
    const r = adopt(s); expect(r.ok).toBe(false); expect(s.opened).toBe(false);
    expect(r.ok ? "" : r.message).toMatch(/Nothing to adopt now: .*31 minutes old/);
  });
  it("freshness is re-evaluated immediately before adoption, not only when the page was drawn", () => {
    const s = signals(); roleView(s, "duty-lead", null); // the recommendation was on screen
    s.clock = new Date(s.clock.getTime() + 45 * 60_000); // time passed without any redraw or tick
    expect(adopt(s).ok).toBe(false); expect(s.opened).toBe(false);
  });
  it("a fresher reading restores the recommendation, and recognition time restarts", () => {
    const s = signals(); s.advance(70); expect(s.desk.assess(s.clock).recognised).toBe(false); expect(s.desk.recognisedAt).toBeNull(); // 10:10: both readings aged out
    s.receiveSignal({ ...PMS_EVENT, id: "pms-evt-9", key: "pms-412-1009", occurredAt: iso("10:09"), context: { ...PMS_EVENT.context } });
    expect(s.desk.assess(s.clock).recognised).toBe(false); // the property reading is fresh again, the maintenance reading (75 min old) is not
    s.receiveSignal({ ...MAINTENANCE_EVENT, id: "mnt-evt-9", key: "wo-1182-1009", occurredAt: iso("10:09"), context: { ...MAINTENANCE_EVENT.context, estimatedCompletion: iso("12:30") } });
    expect(s.desk.assess(s.clock).recognised).toBe(true);
    expect(s.desk.recognisedAt).toBe(s.clock.toISOString());
  });
  it("future-dated events are refused and change nothing; a little clock skew is tolerated", () => {
    const d = both(); const before = d.digest();
    const r = d.ingest(FUTURE_PMS, at("09:00")); expect(r.outcome).toBe("refused"); expect(r.reason).toMatch(/future/i);
    expect(d.digest()).toBe(before);
    const skew = { ...PMS_EVENT, id: "pms-evt-8", key: "pms-412-skew", occurredAt: new Date(at("09:00").getTime() + 30_000).toISOString() };
    expect(d.ingest(skew, at("09:00")).outcome).toBe("taken-in");
    const over = { ...PMS_EVENT, id: "pms-evt-7", key: "pms-412-over", occurredAt: new Date(at("09:00").getTime() + 61_000).toISOString() };
    expect(d.ingest(over, at("09:00")).outcome).toBe("refused");
  });
});

describe("business validation beyond Core's envelope", () => {
  const pms = (c: Partial<Record<string, string>>, id = "x"): Signal => ({ ...PMS_EVENT, id, key: `k-${id}`, context: { ...PMS_EVENT.context, ...c } as Record<string, string> });
  const mnt = (c: Partial<Record<string, string>>, id = "y"): Signal => ({ ...MAINTENANCE_EVENT, id, key: `k-${id}`, context: { ...MAINTENANCE_EVENT.context, ...c } as Record<string, string> });
  const bad: [string, Signal, RegExp][] = [
    ["missing room", pms({ room: "" }), /“room” is missing/],
    ["missing promised time", pms({ promisedReady: "" }), /“promisedReady” is missing/],
    ["bare clock time", pms({ promisedReady: "08:45" }), /not a full UTC timestamp/],
    ["impossible date", pms({ promisedReady: "2026-02-31T08:45:00.000Z" }), /not a full UTC timestamp/],
    ["no time zone", pms({ guestArrived: "2026-11-02T08:10:00" }), /not a full UTC timestamp/],
    ["unknown room status", pms({ status: "maybe-ready" }), /Unknown room status/],
    ["unknown help-request value", pms({ guestHelpRequest: "perhaps" }), /Unknown help-request value/],
    ["unexpected field", pms({ extra: "x" }), /Unexpected field “extra”/],
    ["room not a number", pms({ room: "4x2" }), /room must be a room number/],
    ["guest arrives after the event", pms({ guestArrived: iso("09:30") }), /cannot have arrived after the event/],
    ["unknown work-order status", mnt({ status: "pending" }), /Unknown work-order status/],
    ["bad work-order reference", mnt({ workOrder: "1182" }), /must look like WO-1234/],
    ["missing estimate", mnt({ estimatedCompletion: "" }), /“estimatedCompletion” is missing/],
    ["estimate before the event", mnt({ estimatedCompletion: iso("08:00") }), /cannot precede the event/],
    ["wrong event type", { ...PMS_EVENT, type: "work-order.updated" }, /event type must be room\.status-reported/],
    ["event time not a full timestamp", { ...PMS_EVENT, occurredAt: "08:50" }, /event time is missing or is not a full UTC timestamp/],
  ];
  for (const [name, sig, re] of bad) it(`refuses: ${name}`, () => {
    expect(validateBusiness(sig).join("; ")).toMatch(re);
    const d = new SignalDesk(); const r = d.ingest(sig, at("09:00")); expect(r.outcome).toBe("refused"); expect(d.current(sig.source)).toBeNull();
  });
  it("malformed or missing times give insufficient evidence, and say what is missing", () => {
    const d = new SignalDesk(); d.ingest(MALFORMED_TIME_PMS, at("09:00")); d.ingest(MAINTENANCE_EVENT, at("09:00"));
    const a = d.assess(at("09:00")); expect(a.recognised).toBe(false); expect(a.missing.join(" ")).toMatch(/valid property-system reading/);
    const e = new SignalDesk(); e.ingest(PMS_EVENT, at("09:00")); e.ingest(MISSING_FIELD_MNT, at("09:00"));
    expect(e.assess(at("09:00")).missing.join(" ")).toMatch(/valid, independent maintenance reading/);
    const f = new SignalDesk(); f.ingest(BAD_STATUS_PMS, at("09:00")); expect(f.assess(at("09:00")).recognised).toBe(false);
  });
  it("a malformed event after good ones is refused and does not disturb the recommendation", () => {
    const d = both(); const before = d.digest();
    expect(d.ingest(MALFORMED_TIME_PMS, at("09:00")).outcome).toBe("refused");
    expect(d.digest()).toBe(before); expect(d.assess(at("09:00")).recognised).toBe(true);
  });
  it("refused events are shown with the reason, not hidden", () => {
    const s = signals(); s.receiveSignal(MALFORMED_TIME_PMS); s.receiveSignal(FUTURE_PMS);
    const v = view(s, "duty-lead");
    expect(v).toMatch(/Refused.*promisedReady.*not a full UTC timestamp/); expect(v).toMatch(/Dated in the future/);
  });
});

describe("midnight and date changes use full timestamps", () => {
  const day1 = "2026-11-02", day2 = "2026-11-03";
  const desk = (promised: string, eta: string) => {
    const d = new SignalDesk();
    d.ingest({ ...PMS_EVENT, id: "p", key: "p", occurredAt: iso("23:50", day1), context: { room: "412", status: "not-ready", promisedReady: promised, guestArrived: iso("23:10", day1), guestHelpRequest: "none" } }, at("23:56", day1));
    d.ingest({ ...MAINTENANCE_EVENT, id: "m", key: "m", occurredAt: iso("23:55", day1), context: { room: "412", workOrder: "WO-1182", status: "open", estimatedCompletion: eta } }, at("23:56", day1));
    return d;
  };
  it("ages are computed across midnight", () => {
    const d = desk(iso("23:45", day1), iso("02:30", day2));
    expect(d.assess(at("23:58", day1)).recognised).toBe(true);
    expect(d.assess(at("00:20", day2)).recognised).toBe(true); // property reading is exactly 30 minutes old
    const stale = d.assess(at("00:21", day2)); expect(stale.recognised).toBe(false); expect(stale.freshness[0].ageMinutes).toBe(31);
    expect(fullTime(stale.freshness[0].freshUntil)).toBe("3 Nov 00:20 UTC");
  });
  it("a promised time after midnight has not passed until it has", () => {
    const d = desk(iso("00:10", day2), iso("03:30", day2));
    expect(d.assess(at("23:58", day1)).missing.join(" ")).toMatch(/promised ready time has not passed yet/);
    expect(d.assess(at("00:12", day2)).recognised).toBe(true);
  });
  it("a repair estimate across midnight is measured from the right day", () => {
    const d = desk(iso("23:45", day1), iso("00:30", day2)); // 35 minutes after 23:55: short
    expect(d.assess(at("23:58", day1)).missing.join(" ")).toMatch(/expected within 60 minutes/);
  });
  it("a bare clock time is never accepted, so the date can never be guessed", () => {
    expect(parseFullTime("00:10")).toBeNull(); expect(parseFullTime("2026-11-03T00:10:00.000Z")).not.toBeNull();
    expect(fullTime(iso("00:05", day2))).toBe("3 Nov 00:05 UTC");
  });
});

describe("adoption evidence: who authorised, when, why, on what, under which rule", () => {
  it("a reason is required and nothing is opened without it", () => {
    for (const reason of [undefined, "", "   ", "short"]) { const s = signals(); const r = s.adopt("duty-lead", { reason }); expect(r.ok).toBe(false); expect(r.ok ? "" : r.code).toBe("reason_required"); expect(s.opened).toBe(false); expect(s.adoptions).toEqual([]); expect(s.evidence).toEqual([]); }
  });
  it("records the decision, preserved beside Core's opening event, and says which is which", () => {
    const s = signals(); s.advance(5); expect(adopt(s).ok).toBe(true);
    const rec = s.adoptions[0];
    expect(rec).toMatchObject({ kind: "demonstration-decision-record", decidedBy: { role: "duty-lead", actorId: "member-a" }, reason: REASON, rule: { id: "proactive-checkin-demo", version: "0.2" } });
    expect(rec.decidedBy.note).toMatch(/not an authenticated identity/);
    expect(rec.decidedAt).toBe(s.clock.toISOString());
    expect(rec.sources.map((x) => x.id)).toEqual(["pms-evt-1", "mnt-evt-1"]);
    expect(rec.sources[0]).toMatchObject({ occurredAt: iso("08:50"), ageMinutes: 15, maxAgeMinutes: 30 });
    const core = s.evidence.find((e) => e.kind === "request.opened")!;
    expect(rec.core).toEqual({ eventId: "evt-adopt-1", idempotencyKey: "proactive-adopt-1", evidenceSequence: core.sequence });
    expect(core.provenance.eventId).toBe(rec.core.eventId);
    const v = view(s, "duty-lead");
    expect(v).toMatch(/Demonstration decision record \(kept by this demonstration; not Core evidence\)/);
    expect(v).toMatch(/Core-owned evidence \(recorded by Core\)/);
    expect(v).toMatch(/Authorised by Duty lead · A demo role, not an authenticated identity/);
    expect(v).toContain(REASON); expect(v).toMatch(/proactive-checkin-demo version 0\.2/);
    expect(v).toMatch(/It has no field for who decided, why, on which sources or under which rule version/);
  });
  it("Core's own evidence does not contain the decision, so no adoption contract is implied", () => {
    const s = signals(); adopt(s);
    const blob = JSON.stringify(s.evidence);
    expect(blob).not.toContain(REASON); expect(blob).not.toContain("proactive-checkin-demo"); expect(blob).not.toContain("0.2");
  });
  it("a second adoption is refused and adds neither a record nor Core evidence", () => {
    const s = signals(); adopt(s); const n = s.evidence.length;
    const r = adopt(s); expect(r.ok).toBe(false); expect(r.ok ? "" : r.message).toMatch(/second adoption is refused/);
    expect(s.adoptions.length).toBe(1); expect(s.evidence.length).toBe(n);
  });
  it("evidence that changed after the person looked is refused, and the changed recommendation must be reviewed again", () => {
    const s = signals(); const seen = s.desk.digest();
    s.receiveSignal({ ...PMS_EVENT, id: "pms-evt-9", key: "pms-412-0902", occurredAt: iso("08:59"), context: { ...PMS_EVENT.context } }); // a newer reading arrives
    expect(s.desk.digest()).not.toBe(seen);
    const r = adopt(s, { expectedDigest: seen }); expect(r.ok).toBe(false); expect(r.ok ? "" : r.code).toBe("evidence_changed"); expect(s.opened).toBe(false);
    expect(adopt(s, { expectedDigest: s.desk.digest() }).ok).toBe(true);
  });
  it("evidence that changed so the moment is no longer recognised cannot be adopted", () => {
    const s = signals(); const seen = s.desk.digest(); s.signalAction("asked"); // the guest asked for help in the meantime
    expect(adopt(s, { expectedDigest: seen }).ok).toBe(false); expect(s.opened).toBe(false);
    expect(view(s, "duty-lead")).toMatch(/already has a help request open/);
  });
  it("the button carries the evidence the person saw", () => {
    const s = signals(); expect(roleView(s, "duty-lead", null)).toContain(`data-adopt="${s.desk.digest()}"`);
  });
  it("no other role sees the decision record, the reason or the rule version", () => {
    const s = signals(); adopt(s); s.apply("duty-lead", nextSteps(s, "duty-lead")[0].primary!.command);
    for (const r of ROLES.filter((x) => x !== "duty-lead")) expect(view(s, r), r).not.toMatch(new RegExp(`${REASON.slice(0, 20)}|decision record|proactive-checkin-demo|Core-owned evidence`));
  });
});

describe("accepting help is separate from agreeing to share", () => {
  it("the offer reaches the guest only after the Duty lead accepts responsibility", () => {
    const s = signals(); adopt(s);
    expect(s.helpOffered).toBe(false); expect(s.chooseHelp("yes").ok).toBe(false);
    expect(view(s, "guest")).toMatch(/Nothing is waiting for your choice yet/);
    s.apply("duty-lead", nextSteps(s, "duty-lead")[0].primary!.command);
    expect(s.helpOffered).toBe(true); expect(s.offeredAt).toBe(s.clock.toISOString());
    expect(view(s, "guest")).toMatch(/Would you like practical help\?/);
  });
  it("before an answer, no sharing choice is open: the gate refuses it, though Core itself would accept it", () => {
    const s = withOffer(); const allow = { type: "approve", actionId: "SRC-1", checks: { recipient: true, purpose: true, fields: true, authority: true } } as const;
    expect(applyCommand(s.config, s.state, { id: "direct", command: allow }, roleOf("guest").actor, s.facts()).ok).toBe(true); // Core has no such gate
    const asked = s.ask("guest", allow); expect(asked.ok).toBe(false); expect(asked.ok ? "" : asked.code).toBe("help_not_accepted");
    expect(asked.ok ? "" : asked.message).toMatch(/Demonstration gate, not Core/);
    const applied = s.apply("guest", allow); expect(applied.ok).toBe(false);
    expect(s.evidence.some((e) => e.kind === "approval.recorded")).toBe(false);
    const g = roleView(s, "guest", null);
    expect(text(g)).toMatch(/Would you like practical help\?/); expect(g).not.toMatch(/data-cmd="[^"]*approve/); // allowing is not offered; the refusal is listed with its reason, not as a button
    expect(g).toContain('data-help="yes"'); expect(g).toContain('data-help="no"');
  });
  it("Yes and No thanks are equally prominent, and neither shares anything", () => {
    const s = withOffer(); const g = roleView(s, "guest", null);
    const group = g.slice(g.indexOf('role="group" aria-label="Would you like practical help?"'), g.indexOf("</div>", g.indexOf('role="group" aria-label="Would you like practical help?"')));
    expect([...group.matchAll(/class="wbs-btn (\w+)"/g)].map((m) => m[1])).toEqual(["alt", "alt"]);
    expect(s.chooseHelp("yes").ok).toBe(true);
    expect(s.evidence.some((e) => e.kind === "approval.recorded" || e.kind === "disclosure.made")).toBe(false); // yes grants no permission to share
    expect(s.state.actions.every((a) => a.sentAt === null)).toBe(true);
  });
  it("after yes the guest chooses what to share, separately, and can still decline it", () => {
    const s = withOffer(); s.chooseHelp("yes");
    const step = nextSteps(s, "guest")[0];
    expect(step.others.map((c) => c.command.type)).toEqual(["approve", "refuse"]);
    expect(view(s, "guest")).toMatch(/You said yes to practical help at .*That is separate from what you agree to share/);
    expect(s.apply("guest", step.others.find((c) => c.command.type === "refuse")!.command).ok).toBe(true);
    expect(s.help).toBe("yes"); expect(s.evidence.some((e) => e.kind === "disclosure.made")).toBe(false);
  });
  it("no response is its own state: not yes, not no, nothing shared, and the Duty lead is told so", () => {
    const s = withOffer(); s.advance(120);
    expect(s.help).toBe("unanswered"); expect(s.helpHistory).toEqual([]);
    expect(s.evidence.some((e) => e.kind === "disclosure.made" || e.kind === "approval.recorded")).toBe(false);
    const lead = view(s, "duty-lead");
    expect(lead).toMatch(/The guest has not answered yet\. That is not a yes and not a no\./); expect(lead).toMatch(/Offered at 2 Nov 09:00 UTC/);
    expect(lead).not.toMatch(/The guest said no thanks to help/);
    expect(lead).toMatch(/Guest answered about help: no response \(demonstration record/);
  });
  it("the three answers are recorded as three different things", () => {
    const a = withOffer(); const b = withOffer(); const c = withOffer();
    b.chooseHelp("yes"); c.chooseHelp("no");
    expect([a.help, b.help, c.help]).toEqual(["unanswered", "yes", "no"]);
    expect([a.helpHistory.length, b.helpHistory.length, c.helpHistory.length]).toEqual([0, 1, 1]);
  });
  it("only the guest and the Duty lead see the help answer; units and maintenance never do", () => {
    const s = withOffer(); s.chooseHelp("yes");
    expect(view(s, "duty-lead")).toMatch(/The guest's choice about help/);
    for (const r of ["reception", "housekeeping", "guest-services", "maintenance"] as DemoRoleId[]) expect(view(s, r), r).not.toMatch(/choice about help|practical help\?|said yes|no thanks/i);
  });
  it("a guest who asked directly has already asked for help, so the original paths are unchanged", () => {
    const s = new Session("guest"); expect(s.help).toBe("yes"); expect(s.sharingOpen).toBe(true);
    expect(nextSteps(s, "guest").length).toBe(0); s.apply("duty-lead", nextSteps(s, "duty-lead")[0].primary!.command);
    expect(nextSteps(s, "guest")[0].others.some((c) => c.command.type === "approve")).toBe(true);
  });
  it("the page states the boundary: help and sharing gates are demonstration only", () => {
    const s = withOffer(); const t = text(page(s, "duty-lead", null, null));
    expect(t).toMatch(/guest's answer about help are all demonstration-adapter behaviour/);
    expect(t).toMatch(/Core has no contract for accepting or declining help or for stopping released work/);
  });
});

describe("declining help is separate from withdrawing sharing", () => {
  const OK = { recipient: true, purpose: true, fields: true, authority: true };
  const strip = (s: Session) => JSON.parse(JSON.stringify({ state: s.state, evidence: s.evidence }));
  const afterDelivery = () => { const s = signals(); runPath(s, "maintenance"); expect(s.disclosed).toBe(true); return s; };

  it("the guest can say they don't want further help after disclosure, and everything Core recorded stays exactly as it was", () => {
    const s = afterDelivery(); const before = strip(s);
    const r = s.chooseHelp("no"); expect(r.ok).toBe(true); expect(r.ok ? r.evidence : null).toEqual([]);
    expect(strip(s)).toEqual(before); // no Core state or evidence changed: disclosure and delivery evidence are untouched
    expect(s.help).toBe("no"); expect(s.helpHistory.at(-1)).toMatchObject({ status: "no", afterDisclosure: true });
    expect(s.evidence.filter((e) => e.kind === "disclosure.made").length).toBeGreaterThan(0);
    expect(s.evidence.some((e) => e.kind === "completion.recorded")).toBe(true);
  });
  it("the guest is told plainly what recording it does not do, and sees what stays shared", () => {
    const s = afterDelivery(); s.chooseHelp("no");
    const g = view(s, "guest");
    expect(g).toMatch(/You told the hotel you don't want further help/);
    expect(g).toMatch(/This is recorded as your request\. It does not recall anything already shared, cancel anything already sent, or withdraw your permission/);
    expect(g).toMatch(/nothing here has told Core to stop anything/); expect(g).toMatch(/Already shared, and unchanged by this answer:.*was released/);
    expect(g).toMatch(/Actually, yes please/);
    expect(g).not.toMatch(/work (has been )?stopped|permission (has been )?withdrawn|information (has been )?recalled|cancelled for you/i);
  });
  it("the label changes with the facts: 'No thanks' before anything is shared, \"I don't want further help\" after", () => {
    const early = withOffer(); expect(roleView(early, "guest", null)).toMatch(/data-help="no">No thanks</);
    const late = afterDelivery(); late.chooseHelp("no"); late.chooseHelp("yes");
    expect(roleView(late, "guest", null)).toMatch(/Change my answer: I don't want further help/);
  });
  it("the Duty lead sees the request recorded, not work stopped, released steps for manual review, and Core's available actions", () => {
    const s = afterDelivery(); s.chooseHelp("no");
    const html = roleView(s, "duty-lead", null);
    const start = html.indexOf('data-testid="help-declined-lead"');
    const panel = html.slice(start, html.indexOf("can change their mind about help", start));
    const t = text(panel);
    expect(t).toMatch(/The guest has declined further help\./);
    expect(t).toMatch(/Guest's request\s+Recorded at 2 Nov 09:00 UTC \(demonstration record; not Core evidence\)/);
    expect(t).toMatch(/Work stopped\s+No\. Recording this answer did not stop or cancel anything, recall any information or withdraw any permission, and Core has not been told\./);
    expect(t).toMatch(/Already released: manual review needed/);
    for (const id of ["SGS-1", "SPC-1", "CAP-1", "SUP-1"]) expect(t).toContain(`(${id})`);
    expect(t).toMatch(/Core offers no action to stop released work, so contact each unit if it should stop\./);
    expect(view(s, "duty-lead")).toMatch(/The guest has declined further help\./);
    expect(view(s, "duty-lead")).toMatch(/Unresolved work[\s\S]*declined further help after information was shared[\s\S]*review each released step manually/i);
    // every Core action offered in the panel is one Core accepts
    for (const m of panel.matchAll(/data-cmd="([^"]+)"/g)) expect(s.ask("duty-lead", JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"))).ok).toBe(true);
  });
  it("released steps that Core can still act on show Core's action next to them", () => {
    const s = signals(); runPath(s, "capacity"); // approved, not released: Core offers withdraw
    s.chooseHelp("no"); const t = view(s, "duty-lead");
    expect(t).toMatch(/Not yet released:\s*Core lets you withdraw these/);
    const html = roleView(s, "duty-lead", null);
    expect(html).toMatch(/data-cmd="[^"]*withdraw[^"]*"/);
  });
  it("declining further help is not withdrawing permission: the Core-level sharing records are the same, and a guest request is not 'work stopped'", () => {
    const s = afterDelivery(); const approvals = s.evidence.filter((e) => e.kind === "approval.recorded").length;
    s.chooseHelp("no");
    expect(s.evidence.filter((e) => e.kind === "approval.recorded").length).toBe(approvals);
    expect(s.evidence.some((e) => e.kind === "approval.revoked" || e.kind === "action.withdrawn" || e.kind === "execution.cancelled")).toBe(false);
    expect(s.state.actions.filter((a) => a.sentAt !== null).length).toBeGreaterThan(0);
  });

  it("refusing sharing is reachable without accepting help: before any answer, and after No thanks", () => {
    for (const answer of [null, "no"] as const) {
      const s = withOffer(); if (answer) s.chooseHelp(answer);
      const step = nextSteps(s, "guest")[0];
      const refuse = step.others.find((c) => c.command.type === "refuse")!; expect(refuse, String(answer)).toBeTruthy();
      expect(step.others.some((c) => c.command.type === "approve")).toBe(false); // allowing is gated; declining is not
      const before = s.evidence.length;
      expect(s.ask("guest", refuse.command).ok).toBe(true); expect(s.apply("guest", refuse.command).ok).toBe(true);
      expect(s.evidence.length).toBeGreaterThan(before); expect(s.help).toBe(answer ?? "unanswered"); // refusing is not an answer about help
      expect(s.evidence.some((e) => e.kind === "disclosure.made")).toBe(false);
      expect(s.state.actions.find((a) => a.id === (refuse.command as { actionId: string }).actionId)!.sentAt).toBeNull();
    }
  });
  it("only NEW sharing approval is gated; Core's refusal and revocation are never blocked by the help answer", () => {
    const s = withOffer();
    const approve = { type: "approve", actionId: "SRC-1", checks: OK } as const;
    const gated = s.ask("guest", approve); expect(gated.ok).toBe(false); expect(gated.ok ? "" : gated.code).toBe("help_not_accepted");
    expect(gated.ok ? "" : gated.message).toMatch(/no new sharing approval is open/); expect(gated.ok ? "" : gated.message).toMatch(/Declining or taking back sharing stays available/);
    // revocation with nothing to revoke is Core's refusal, not the gate's
    const revoke = s.ask("guest", { type: "revokeApproval", actionId: "SRC-1" }); expect(revoke.ok).toBe(false); expect(revoke.ok ? "" : revoke.code).not.toBe("help_not_accepted");
    expect(s.ask("guest", { type: "refuse", actionId: "SRC-1" }).ok).toBe(true);
  });
  it("an unsent approval can be taken back after declining help, and earlier evidence is unchanged", () => {
    const s = withOffer(); s.chooseHelp("yes");
    expect(s.apply("guest", { type: "approve", actionId: "SRC-1", checks: OK }).ok).toBe(true);
    s.chooseHelp("no"); expect(s.help).toBe("no");
    const before = JSON.parse(JSON.stringify(s.evidence));
    const guest = roleView(s, "guest", null);
    expect(guest).toMatch(/Take back permission for Reception \(before anything is sent\)/);
    const rv = { type: "revokeApproval", actionId: "SRC-1" } as const;
    expect(s.ask("guest", rv).ok).toBe(true);
    expect(s.apply("guest", rv).ok).toBe(true);
    expect(s.evidence.slice(0, before.length)).toEqual(before); // append-only: nothing earlier changed
    expect(s.evidence.slice(before.length).map((e) => e.kind)).toContain("approval.revoked");
    expect(s.state.actions.find((a) => a.id === "SRC-1")!.sentAt).toBeNull();
    expect(s.help).toBe("no");
    // and new approval is still gated while help is declined
    expect(s.apply("guest", { type: "approve", actionId: "SGS-1", checks: OK }).ok).toBe(false);
  });
  it("role isolation holds: no other role sees the help answer, the decline, the manual-review list or the demonstration record", () => {
    const s = afterDelivery(); s.chooseHelp("no");
    for (const r of ["reception", "housekeeping", "guest-services", "maintenance"] as DemoRoleId[]) {
      expect(view(s, r), r).not.toMatch(/declined further help|further help|Manual review|manual review|Guest's request|Work stopped|choice about help|demonstration record|decision record|Already released/i);
    }
    for (const f of s.state.request) expect(view(s, "housekeeping")).not.toContain(f.value);
    expect(view(s, "guest")).not.toMatch(/Manual review|Work stopped|Guest's request|follow-up|decision record/i);
  });
  it("a guest who asked directly is unaffected: declining help does not exist there, and the original gate-free paths are unchanged", () => {
    const s = new Session("guest"); expect(s.chooseHelp("no").ok).toBe(false);
    for (const id of ["normal", "capacity", "didnothelp"]) { const g = new Session("guest"); expect(runPath(g, id), id).toEqual({ ok: true }); }
  });
});
