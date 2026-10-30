import { describe, expect, it } from "vitest";
import { SAFE_ROLES, createSafeState, reduceSafe, safeActions, safeView, type SafeAction, type SafeRole, type SafeState } from "./safeguarding";

const act = (s: SafeState, role: SafeRole, action: SafeAction) => reduceSafe(s, role, action);
function checked() {
  let s = createSafeState();
  for (const [r, a] of [
    ["Reception", "record"], ["Duty Manager", "own"], ["Duty Manager", "assess"],
    ["Guest", "contact"], ["Guest", "consent"], ["Reception", "space"],
    ["Duty Manager", "escort"], ["Duty Manager", "review"],
  ] as [SafeRole, SafeAction][]) s = act(s, r, a);
  return s;
}
const released = () => act(act(checked(), "Duty Manager", "approve"), "Duty Manager", "release");
function delivered() {
  let s = released();
  for (const a of ["accept", "arrive", "deliver"] as const) s = act(s, "Security", a);
  return s;
}

describe("fictional safeguarding coordination", () => {
  it.each(SAFE_ROLES)("offers immediate emergency help for %s before routine checks", role => {
    const s = act(createSafeState(), role, "request-emergency");
    expect(s.emergencyRequested).toBe(true);
    expect(s.responderAccepted).toBe(false);
    expect(s.consent).toBeNull();
    expect(s.owned).toBe(false);
    expect(s.released).toBe(false);
    expect(safeView(s, role).records[0].message).toContain("No actual call or message");
  });
  it("keeps emergency request and responder acceptance separate, without closing concern", () => {
    const requested = act(createSafeState(), "Reception", "request-emergency");
    const accepted = act(requested, "Security", "confirm-responder");
    expect(accepted.responderAccepted).toBe(true);
    expect(accepted.delivered).toBe(false);
    expect(safeView(accepted, "Guest").summary.join(" ")).toContain("Concern remains open");
    expect(accepted.events).toHaveLength(2);
    expect(accepted.events.every(e => /simulated|fictional/i.test(e.message))).toBe(true);
  });
  it.each(["Guest Services", "Housekeeping lead"] as const)("does not leak private emergency requests through %s controls or counts", role => {
    const before = safeView(createSafeState(), role);
    const requested = act(createSafeState(), "Reception", "request-emergency");
    expect(safeView(requested, role)).toEqual(before);
    expect(safeView(act(requested, "Duty Manager", "confirm-responder"), role)).toEqual(before);
  });
  it("makes emergency logging idempotent for a participant, retaining each relevant request", () => {
    let s = act(createSafeState(), "Reception", "request-emergency");
    expect(act(s, "Reception", "request-emergency")).toBe(s);
    s = act(s, "Guest Services", "request-emergency");
    expect(s.emergencyAuthors).toEqual(["Reception", "Guest Services"]);
    expect(act(s, "Guest Services", "request-emergency")).toBe(s);
  });
  it.each(["recorded", "owned", "assessed", "contact", "space", "escort"] as const)("holds approval without %s", field => {
    const s = { ...checked(), [field]: false };
    expect(act(s, "Duty Manager", "approve")).toBe(s);
    expect(act(s, "Duty Manager", "release")).toBe(s);
  });
  it("requires consent and the correct authority, and never equates approval, release, acceptance, arrival or delivery", () => {
    const s = checked();
    expect(act({ ...s, consent: null }, "Duty Manager", "approve").decision).toBe("Pending");
    expect(act(s, "Reception", "approve")).toBe(s);
    const approved = act(s, "Duty Manager", "approve");
    expect([approved.released, approved.accepted, approved.arrived, approved.delivered]).toEqual([false, false, false, false]);
    expect(act(approved, "Security", "accept")).toBe(approved);
    const release = act(approved, "Duty Manager", "release");
    expect(act(release, "Security", "deliver")).toBe(release);
    const accepted = act(release, "Security", "accept");
    expect([accepted.arrived, accepted.delivered]).toEqual([false, false]);
    const arrived = act(accepted, "Security", "arrive");
    expect(arrived.delivered).toBe(false);
    expect(act(arrived, "Security", "deliver").delivered).toBe(true);
  });
  it.each(["hold", "decline-plan"] as const)("preserves open ownership when the manager selects %s", action => {
    const s = act(checked(), "Duty Manager", action);
    expect(s.released).toBe(false);
    expect(safeView(s, "Guest").summary.join(" ")).toContain("Concern remains open");
    expect(act(s, "Duty Manager", "release")).toBe(s);
    expect(act(s, "Duty Manager", "resume").decision).toBe("Pending");
  });
  it("respects optional support refusal without promising contact or closing the concern", () => {
    let s = act(createSafeState(), "Reception", "record");
    s = act(s, "Duty Manager", "own");
    s = act(s, "Guest", "decline-support");
    s = act(s, "Duty Manager", "overdue");
    expect(act(s, "Duty Manager", "followup")).toBe(s);
    expect(safeView(s, "Guest").summary.join(" ")).toContain("Safe contact not yet agreed");
    s = act(s, "Guest", "contact");
    s = act(s, "Duty Manager", "followup");
    expect(s.followup).toBe(true);
    expect(s.released).toBe(false);
    expect(safeView(s, "Guest").summary.join(" ")).toContain("declined; respect choice, concern still open");
  });
  it.each(["missed", "unavailable"] as const)("retains outstanding Security work after %s and renews all replacement requirements", action => {
    const original = act(released(), "Duty Manager", action);
    expect(original.replan).toBe(true);
    expect(act(original, "Security", "accept")).toBe(original);
    let s = act(original, "Duty Manager", "revise");
    expect(s.version).toBe(2);
    expect(s.events.slice(0, -1)).toEqual(original.events);
    expect([s.contact, s.space, s.escort, s.reviewed, s.released, s.accepted]).toEqual([false, false, false, false, false, false]);
    expect(s.consent).toBeNull();
    expect(safeActions(s, "Guest").find(a => a.type === "consent")?.reason).toBeUndefined();
    for (const [r, a] of [
      ["Duty Manager", "assess"], ["Guest", "contact"], ["Guest", "consent"], ["Reception", "space"],
      ["Duty Manager", "escort"], ["Duty Manager", "review"], ["Duty Manager", "approve"], ["Duty Manager", "release"],
    ] as [SafeRole, SafeAction][]) s = act(s, r, a);
    expect(s.released).toBe(true);
    expect(s.accepted).toBe(false);
    expect(act(s, "Security", "accept")).toBe(s);
    expect(act(s, "Duty Manager", "accept").accepted).toBe(true);
    expect(safeView(s, "Security").records.every(e => e.version === 1)).toBe(true);
    expect(safeView(s, "Security").summary.join(" ")).toContain("No current authorised Security task");
  });
  it.each(["safer", "pending", "still-unsafe"] as const)("never establishes safety after %s feedback", action => {
    const s = act(delivered(), "Guest", action);
    expect(safeView(s, "Guest").summary.join(" ")).toContain("Concern remains open");
    expect(safeView(s, "Guest").summary.join(" ")).toContain("not proof of safety");
    expect(safeView(s, "Guest").feedbackNotice).toBeTruthy();
    expect(act(s, "Guest", action)).toBe(s);
  });
  it("keeps still-unsafe response active with a named next action and earlier evidence retained", () => {
    const s = act(delivered(), "Guest", "still-unsafe");
    expect(safeView(s, "Duty Manager").primary?.type).toBe("revise");
    expect(safeView(s, "Guest").summary.join(" ")).toContain("still feels unsafe");
    const revised = act(s, "Duty Manager", "revise");
    expect(revised.previousFeedback).toBe("still-unsafe");
    expect(revised.events.some(e => e.purpose === "Support delivery receipt")).toBe(true);
    expect(revised.delivered).toBe(false);
  });
  it.each(["Security", "Guest Services", "Housekeeping lead"] as const)("filters full %s projection including hints and counts from private feedback", role => {
    const s = delivered(), before = safeView(s, role);
    for (const a of ["safer", "pending", "still-unsafe"] as const) expect(safeView(act(s, "Guest", a), role)).toEqual(before);
    const projection = JSON.stringify(before);
    expect(projection).not.toContain("Someone is trying to find me");
    expect(projection).not.toContain("Private reported concern");
    expect(before.records.map(e => e.purpose)).not.toContain("Private guest feedback");
  });
  it("guides a complete run from actual prerequisites without perspective side effects", () => {
    let s = createSafeState(), role: SafeRole = "Reception";
    const seen: SafeAction[] = [];
    for (let i = 0; i < 70; i++) {
      const prior = structuredClone(s), view = safeView(s, role);
      expect(s).toEqual(prior);
      if (view.primary) {
        seen.push(view.primary.type);
        const updated = act(s, role, view.primary.type);
        expect(updated).not.toBe(s);
        s = updated;
      } else if (view.handover && view.handover !== role) role = view.handover;
      else break;
    }
    expect(seen).toEqual(expect.arrayContaining(["assess", "contact", "consent", "space", "escort", "review", "approve", "release", "accept", "practical", "cover", "arrive", "deliver", "pending", "followup"]));
    expect(s.delivered && s.followup && s.cover && s.practical).toBe(true);
    expect(s.feedback).toBe("pending");
  });
  it("resets only its own in-memory history and flags", () => {
    expect(act(delivered(), "Guest", "reset")).toEqual(createSafeState());
  });
  it("renews a future update time after a late revision without losing emergency history or inventing 6:60", () => {
    let s = act(delivered(), "Reception", "request-emergency");
    s = act(s, "Duty Manager", "overdue");
    s = act(s, "Guest", "still-unsafe");
    const revised = act(s, "Duty Manager", "revise");
    expect(revised.followupAt).toBe(55);
    expect(revised.emergencyRequested).toBe(true);
    expect(revised.events.some(e => e.purpose === "Simulated emergency help request")).toBe(true);
    expect(safeView(revised, "Guest").summary.join(" ")).toContain("6:55 pm");
    expect(safeView(act(revised, "Duty Manager", "overdue"), "Duty Manager").clock).toBe("7:00 pm");
  });
  it("records a late follow-up truthfully without erasing the missed deadline or falsely leaving the current review overdue", () => {
    const late = act(delivered(), "Duty Manager", "overdue");
    const reviewed = act(late, "Duty Manager", "followup");
    const view = safeView(reviewed, "Duty Manager");
    expect(view.summary.join(" ")).toContain("Follow-up review recorded");
    expect(view.summary.join(" ")).not.toContain("OVERDUE");
    expect(reviewed.events.some(e => e.status === "Overdue")).toBe(true);
    expect(view.summary.join(" ")).toContain("Concern remains open");
  });
  it("does not reveal private event counts in identifiers of subsequent shared-role records", () => {
    const s = delivered();
    const plain = act(s, "Guest Services", "practical");
    for (const feedback of ["pending", "safer", "still-unsafe"] as const) {
      const privateThenShared = act(act(s, "Guest", feedback), "Guest Services", "practical");
      expect(safeView(privateThenShared, "Guest Services")).toEqual(safeView(plain, "Guest Services"));
    }
    expect(safeView(plain, "Guest Services").records.map(e => e.id)).toEqual(["visible-1", "visible-2"]);
  });
});
