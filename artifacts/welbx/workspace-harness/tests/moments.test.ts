// The five moments a hotel decision-maker walks through, and the plain-language boundary: technical detail lives in the reviewer disclosure.
import { describe, expect, it } from "vitest";
import { runPath } from "../src/paths";
import { nextSteps } from "../src/next";
import { DEMO_ROLES, Session, type DemoRoleId } from "../src/session";
import { page, roleView } from "../src/views";

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\\s+/g, " ").replace(/\s+/g, " ");
const view = (s: Session, role: DemoRoleId) => text(roleView(s, role, null));
const ROLES = DEMO_ROLES.map((r) => r.id);
const REASON = "The room is still unavailable and the repair is long, so a check-in is sensible.";
const signals = () => new Session("signals");
const opened = () => { const s = signals(); expect(s.adopt("duty-lead", { reason: REASON }).ok).toBe(true); s.apply("duty-lead", nextSteps(s, "duty-lead")[0].primary!.command); return s; };

describe("1 Recognise: what happened, why it matters, what is not known", () => {
  it("leads with a conclusion, then the two reports, why it matters and what is unknown", () => {
    const t = view(signals(), "duty-lead");
    expect(t).toMatch(/1 · Recognise A guest's room is still not ready/);
    expect(t).toMatch(/What happened[\s\S]*Property management system\s*,\s*reported 2 Nov 08:50 UTC[\s\S]*Room 412 \(fictional\) is “Not ready”; it was promised for 2 Nov 08:45 UTC/);
    expect(t).toMatch(/Maintenance work orders\s*,\s*reported 2 Nov 08:55 UTC[\s\S]*Work order WO-1182 is “Open”; estimated completion 2 Nov 11:30 UTC/);
    expect(t).toMatch(/Why it matters[\s\S]*promised for 2 Nov 08:45 UTC and is still not ready\. The repair is not due until 2 Nov 11:30 UTC/);
    expect(t).toMatch(/What is not known[\s\S]*only the guest can say[\s\S]*does not establish distress/);
    expect(t.indexOf("What happened")).toBeLessThan(t.indexOf("Source events and how each was handled"));
  });
  it("reports are marked fresh with their age, and a stale one is marked too old", () => {
    const s = signals(); expect(view(s, "duty-lead")).toMatch(/fresh · 10 min old/);
    s.advance(21); expect(view(s, "duty-lead")).toMatch(/too old · 31 min/);
  });
  it("signal handling is in plain words, not engine terms", () => {
    const s = signals(); s.signalAction("duplicate"); s.signalAction("stale"); s.signalAction("malformed");
    const t = view(s, "duty-lead");
    expect(t).toMatch(/Used/); expect(t).toMatch(/Not used: a repeat of an event already received/); expect(t).toMatch(/Not used: older than the current reading/); expect(t).toMatch(/Refused: not valid/);
  });
});

describe("2 Decide: the recommended response, who authorises it and why", () => {
  it("names the recommendation, the authoriser, the reason and what happens next, with a plain button", () => {
    const html = roleView(signals(), "duty-lead", null); const t = text(html);
    expect(t).toMatch(/2 · Decide Recommended: offer the guest a proactive check-in/);
    expect(t).toMatch(/Who authorises it\. You, as Duty lead\. It is your call because you would hold responsibility/);
    expect(t).toMatch(/What happens next\. You authorise it, then accept responsibility\. After that the guest is asked whether they want practical help, and only then what may be shared/);
    expect(html).toMatch(/>Authorise the check-in</); expect(t).not.toMatch(/for me to review/);
  });
  it("after authorising, the next step and the waiting-on line are clear", () => {
    const s = signals(); s.adopt("duty-lead", { reason: REASON });
    const t = view(s, "duty-lead");
    expect(t).toMatch(/Right now, waiting on: you \(1\)/); expect(t).toMatch(/Authorised the check-in|authorised the check-in at 2 Nov 09:00 UTC/);
    expect(t).toMatch(/Accept responsibility for this request/);
  });
});

describe("3 Coordinate: what each team receives, owns and must acknowledge", () => {
  it("shows each team's exact receipt, its step and what it must do, and Maintenance apart", () => {
    const s = signals(); runPath(s, "maintenance");
    const t = view(s, "duty-lead"); const block = t.slice(t.indexOf("3 · Coordinate"), t.indexOf("5 · Where the outcome stands"));
    expect(block).toMatch(/Reception[\s\S]*Confirm a quiet space is available[\s\S]*Check a quiet space is available \(SPC-1\)[\s\S]*Accepted at 09:00/);
    expect(block).toMatch(/Guest services[\s\S]*Guest name: Alex \(fictional guest\)[\s\S]*Share the request with Guest services \(SGS-1\)/);
    expect(block).toMatch(/Housekeeping[\s\S]*Confirm capacity to reassign one waiting-area task[\s\S]*Check staff capacity \(CAP-1\)/);
    expect(block).toMatch(/Maintenance[\s\S]*Nothing about the guest[\s\S]*Facility repair \(WO-1182\)[\s\S]*records the status itself[\s\S]*Independent: stays open separately/);
    expect(block).toMatch(/Reported done at 09:00/);
  });
  it("a team that has not been sent anything is told so", () => {
    const s = opened(); const t = view(s, "duty-lead");
    expect(t).toMatch(/Nothing sent yet/); expect(t).toMatch(/Not sent yet: /);
  });
  it("no team sees another team's row or the coordination table", () => {
    const s = signals(); runPath(s, "maintenance");
    for (const r of ["reception", "housekeeping", "guest-services", "maintenance", "guest"] as DemoRoleId[]) expect(view(s, r), r).not.toMatch(/3 · Coordinate|what each team receives/);
    expect(view(s, "reception")).not.toMatch(/Housekeeping|Guest services/);
  });
});

describe("4 Adapt: capacity disappears, the guest declines further help", () => {
  it("capacity loss names the team, the step, the owner and the next action in plain words", () => {
    const s = signals(); runPath(s, "capacity"); s.setCapacity("housekeeping", true);
    const t = view(s, "duty-lead");
    expect(t).toMatch(/Capacity changed: Housekeeping can no longer act\./);
    expect(t).toMatch(/Housekeeping had accepted “Check staff capacity” \(CAP-1\) and has since lost capacity/);
    expect(t).toMatch(/Owner: you \(Duty lead\)\. Next: prepare a renewed check/);
    expect(t).toMatch(/Right now, waiting on: you/);
  });
  it("a response offered in the attention panel is not repeated as a second button elsewhere on the page", () => {
    const s = signals(); runPath(s, "capacity"); s.setCapacity("housekeeping", true);
    const html = roleView(s, "duty-lead", null);
    expect((html.match(/>Prepare: Check staff capacity</g) ?? []).length).toBe(1);
    const d = signals(); runPath(d, "maintenance"); d.chooseHelp("no");
    const w = roleView(d, "duty-lead", null);
    expect(w).toMatch(/Core lets you withdraw these\.<\/p><div class="wbs-alts" role="group" aria-label="Responses to declined help">/); // visible, not tucked away
  });
  it("a guest who declines further help is shown as a recorded request, with work NOT stopped, to the Duty lead only", () => {
    const s = signals(); runPath(s, "maintenance"); s.chooseHelp("no");
    expect(view(s, "duty-lead")).toMatch(/Guest's request\s+Recorded at/); expect(view(s, "duty-lead")).toMatch(/Work stopped\s+No\./);
    for (const r of ["reception", "housekeeping", "guest-services", "maintenance"] as DemoRoleId[]) expect(view(s, r), r).not.toMatch(/further help|Work stopped/);
  });
});

describe("5 Establish the outcome: four things, never merged", () => {
  it("shows delivery, the guest's response, outstanding support and independent repairs as four separate lines", () => {
    const s = signals(); runPath(s, "maintenance"); s.apply("guest", { type: "recordResponse", actionId: "SUP-1", responseId: "still-needs-support" });
    const t = view(s, "duty-lead"); const b = t.slice(t.indexOf("5 · Where the outcome stands"), t.indexOf("Plan, ownership and evidence") > 0 ? t.indexOf("Plan, ownership and evidence") : undefined);
    expect(b).toMatch(/Delivery reported[\s\S]*Reported by Guest services at 09:00 \(their report/);
    expect(b).toMatch(/The guest's response recorded[\s\S]*Still needs support/);
    expect(b).toMatch(/Outstanding support 1 open[\s\S]*The guest still needs support: follow-up FU-SUP-1-1 is open \(owner: the duty lead\)/);
    expect(b).toMatch(/Independent repairs tracked apart[\s\S]*Facility repair \(WO-1182\): open\. Owner: Maintenance[\s\S]*neither blocks the support nor is closed by it/);
  });
  it("before delivery the lines say so, and no response is unknown, not 'helped'", () => {
    const s = opened(); expect(view(s, "duty-lead")).toMatch(/Delivery not yet[\s\S]*No delivery report yet/);
    const d = signals(); runPath(d, "noresponse"); expect(view(d, "duty-lead")).toMatch(/The guest's response unknown[\s\S]*No answer is unknown, never “helped”/);
  });
  it("the guest's own view says the same things in their words, without staff-only detail", () => {
    const s = signals(); runPath(s, "didnothelp");
    const g = view(s, "guest"); expect(g).toMatch(/Delivery confirmation/); expect(g).toMatch(/Your feedback/); expect(g).not.toMatch(/Outstanding support|Independent repairs|follow-up/i);
  });
});

describe("technical detail lives in the reviewer disclosure, not on staff or guest screens", () => {
  it("no role view carries engine or contract language; the technical disclosure does", () => {
    const s = signals(); runPath(s, "didnothelp"); s.chooseHelp("no");
    for (const r of ROLES) expect(view(s, r), r).not.toMatch(/CORE-GAPS|G5\b|G6\b|G8\b|G9\b|event envelope|demonstration adapter|idempotency/i.test("") ? /x^/ : /CORE-GAPS|\bG[5689]\b|event envelope|demonstration adapter|signal desk|prepare-plan|kernel/i);
    const t = text(page(s, "duty-lead", null, null));
    expect(t).toMatch(/Technical review details/); expect(t).toMatch(/How events are handled:/); expect(t).toMatch(/Adoption evidence:/); expect(t).toMatch(/Help answers:/);
  });
  it("the concise demonstration label stays", () => {
    expect(text(page(signals(), "duty-lead", null, null))).toMatch(/Interactive demonstration · fictional system events · simulated delivery/);
  });
});
