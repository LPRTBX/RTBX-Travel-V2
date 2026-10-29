import { describe, expect, it } from "vitest";
import { initialSupportState, reduceSupport, supportActions, supportPlan, supportView, type SupportAction, type SupportRole, type SupportState } from "./wellbeingSupport";

const act = (s: SupportState, role: SupportRole, action: SupportAction) => reduceSupport(s, role, action);
function checked(s = initialSupportState()) {
  s = act(s, "Guest", "consent");
  s = act(s, "Reception", "quiet");
  s = act(s, "Housekeeping lead", "capacity");
  return act(s, "Duty Manager", "review");
}
function released(s = checked()) {
  return act(act(s, "Duty Manager", "approve"), "Duty Manager", "release");
}
function delivered(s = released(), owner: SupportRole = "Guest Services") {
  s = act(s, "Reception", "update");
  s = act(s, "Housekeeping lead", "reallocate");
  s = act(s, owner, "accept");
  s = act(s, owner, "arrive");
  return act(s, owner, "deliver");
}

describe("fictional wellbeing response gates", () => {
  it("holds approval for every missing check, including consent and human review", () => {
    for (const missing of ["consent", "quiet", "capacity", "review"] as const) {
      const s = checked();
      const p = supportPlan(s);
      if (missing === "review") p.reviewed = false;
      else p[missing] = false;
      expect(act(s, "Duty Manager", "approve")).toBe(s);
      expect(act(s, "Duty Manager", "release")).toBe(s);
    }
  });
  it("enforces role authority inside the reducer, not just in buttons", () => {
    const s = checked();
    for (const role of ["Guest", "Reception", "Guest Services", "Housekeeping lead"] as const)
      expect(act(s, role, "approve")).toBe(s);
    expect(act(initialSupportState(), "Duty Manager", "consent")).toEqual(initialSupportState());
  });
  it.each(["hold", "decline"] as const)("%s leaves the request open with no release", action => {
    let s = act(checked(), "Duty Manager", action);
    expect(act(s, "Duty Manager", "release")).toBe(s);
    expect(s.records).toHaveLength(0);
    expect(supportPlan(s).delivered).toBe(false);
    s = act(s, "Duty Manager", "resume");
    expect(supportPlan(act(s, "Duty Manager", "approve")).decision).toBe("Approved");
  });
  it("keeps approval, dispatch, acceptance, arrival and delivery separate", () => {
    let s = act(checked(), "Duty Manager", "approve");
    expect(s.records.map(r => r.status)).toEqual(["Draft", "Draft", "Draft"]);
    expect(act(s, "Guest Services", "accept")).toBe(s);
    s = act(s, "Duty Manager", "release");
    expect(s.records.every(r => r.status === "Released")).toBe(true);
    expect(act(s, "Guest Services", "deliver")).toBe(s);
    expect(act(s, "Guest Services", "arrive")).toBe(s);
    s = act(s, "Guest Services", "accept");
    expect(supportPlan(s).arrived).toBe(false);
    s = act(s, "Guest Services", "arrive");
    expect(act(s, "Guest Services", "deliver")).toBe(s); // HK/reception not acknowledged
    s = act(s, "Housekeeping lead", "reallocate");
    s = act(s, "Reception", "update");
    s = act(s, "Guest Services", "deliver");
    expect(supportPlan(s).delivered).toBe(true);
    expect(s.records.every(r => r.status === "Acknowledged")).toBe(true);
    expect(s.records.find(r => r.purpose === "Approved guest update")?.acknowledgedBy).toBe("Reception");
    expect(s.records.find(r => r.purpose === "Practical support handover")?.acknowledgedBy).toBe("Guest Services");
    expect(supportPlan(s).feedback).toBe("Pending");
    expect(supportPlan(s).followup).toBe(false);
  });
  it("exposes unaccepted handovers and unavailable recipients without inventing arrival", () => {
    let s = released();
    expect(supportView(s, "Duty Manager").summary.join(" ")).toContain("not accepted");
    s = act(s, "Guest Services", "unavailable");
    expect(supportPlan(s).decision).toBe("Invalidated");
    expect(act(s, "Guest Services", "accept")).toBe(s);
    expect(act(s, "Guest Services", "deliver")).toBe(s);
    expect(supportView(s, "Guest").status).toBe("Earlier plan paused");
    expect(supportView(s, "Guest").summary.join(" ")).not.toContain("Agreed support:");
  });
  it("material revisions preserve earlier records and require renewed checks and approval", () => {
    let s = act(released(), "Guest Services", "unavailable");
    const records = structuredClone(s.records);
    const history = structuredClone(s.history);
    s = act(s, "Duty Manager", "revise");
    expect(s.plans).toHaveLength(2);
    expect(s.records).toEqual(records);
    expect(s.history.slice(0, history.length)).toEqual(history);
    expect(supportPlan(s).owner).toBe("Duty Manager contact B");
    expect(supportPlan(s).consent).toBe(false);
    expect(act(s, "Duty Manager", "approve")).toBe(s);
    expect(act(s, "Duty Manager", "release")).toBe(s);
    s = released(checked(s));
    expect(act(s, "Guest Services", "accept")).toBe(s);
    s = delivered(s, "Duty Manager");
    expect(supportPlan(s).delivered).toBe(true);
    expect(s.records.filter(r => r.version === 1)).toEqual(records);
  });
  it("allows a reviewed material change even before recipient failure", () => {
    const s = act(released(), "Duty Manager", "revise");
    expect(s.plans[0].decision).toBe("Invalidated");
    expect(supportPlan(s).decision).toBe("Pending");
    expect(supportPlan(s).released).toBe(false);
  });
  it("keeps feedback pending, helped and further support separate from delivery", () => {
    let s = delivered();
    expect(supportPlan(s).feedback).toBe("Pending");
    expect(supportView(s, "Guest").summary.join(" ")).toContain("Pending");
    s = act(s, "Guest", "helped");
    expect(supportPlan(s).feedback).toBe("Helped");
    s = act(s, "Guest", "needs-support");
    expect(supportPlan(s).feedback).toBe("Still needs support");
    s = act(s, "Guest", "pending");
    expect(supportPlan(s).feedback).toBe("Pending");
    expect(act(s, "Reception", "helped")).toBe(s);
  });
  it("requires delivery before follow-up; overdue remains visible until a manager review", () => {
    let s = act(released(), "Duty Manager", "overdue");
    expect(supportView(s, "Duty Manager").summary.join(" ")).toContain("Overdue");
    expect(act(s, "Duty Manager", "followup")).toBe(s);
    s = delivered(s);
    s = act(s, "Duty Manager", "followup");
    expect(supportPlan(s).followup).toBe(true);
    expect(supportPlan(s).feedback).toBe("Pending");
    expect(supportView(s, "Guest").summary.join(" ")).toContain("Room repair remains open");
  });
});

describe("public wellbeing next-action guidance", () => {
  it("starts with explicit plain-language consent, no feedback controls or replacement-plan copy", () => {
    const view = supportView(initialSupportState(), "Guest");
    expect(view.guidance.primary?.type).toBe("consent");
    expect(view.guidance.primary?.label).toBe("Share what would help with the guest support team");
    expect(view.guidance.primary?.reason).toContain("Reception, Guest Services and the Duty Manager");
    expect(view.guidance.alternatives).toEqual([]);
    expect([view.status, ...view.summary, view.guidance.context].join(" ")).not.toMatch(/replacement|revised/i);
    expect(supportPlan(initialSupportState()).consent).toBe(false);
  });
  it.each(["consent", "quiet", "capacity"] as const)("hands over to the actual missing %s check, not approval", missing => {
    const s = checked();
    supportPlan(s)[missing] = false;
    const g = supportView(s, "Duty Manager").guidance;
    const owner = { consent: "Guest", quiet: "Reception", capacity: "Housekeeping lead" }[missing];
    expect(g.primary).toBeNull();
    expect(g.handover?.role).toBe(owner);
    expect(act(s, "Duty Manager", "approve")).toBe(s);
  });
  it("skips previously completed checks, including checks done in another order", () => {
    let s = initialSupportState();
    s = act(s, "Housekeeping lead", "capacity");
    s = act(s, "Duty Manager", "review");
    s = act(s, "Reception", "quiet");
    s = act(s, "Guest", "consent");
    expect(supportView(s, "Guest").guidance.handover).toMatchObject({ role: "Duty Manager", action: "approve" });
    expect(supportView(s, "Duty Manager").guidance.primary?.type).toBe("approve");
  });
  it("guides a complete run with explicit actions and role switches that leave state unchanged", () => {
    let s = initialSupportState(), role: SupportRole = "Guest";
    const performed: SupportAction[] = [];
    for (let i = 0; i < 60 && !supportPlan(s).followup; i++) {
      const saved = structuredClone(s);
      const g = supportView(s, role).guidance;
      if (g.primary) {
        expect(g.primary.enabled).toBe(true);
        performed.push(g.primary.type);
        s = act(s, role, g.primary.type);
        expect(s).not.toEqual(saved);
      } else {
        expect(g.handover).not.toBeNull();
        role = g.handover!.role;
        expect(s).toEqual(saved);
      }
    }
    expect(supportPlan(s)).toMatchObject({ delivered: true, feedback: "Pending", feedbackRecorded: true, followup: true });
    for (const action of ["consent", "quiet", "capacity", "review", "approve", "release", "accept", "arrive", "deliver", "pending", "followup"] as const)
      expect(performed).toContain(action);
    expect(performed.indexOf("release")).toBeGreaterThan(performed.indexOf("approve"));
    expect(performed.indexOf("arrive")).toBeGreaterThan(performed.indexOf("accept"));
    expect(supportView(s, "Guest").summary.join(" ")).toContain("Room repair remains open");
  });
  it.each(["hold", "decline"] as const)("describes %s as a paused decision, not a replacement already approved", action => {
    const s = act(checked(), "Duty Manager", action);
    expect(supportView(s, "Guest").status).toBe(action === "hold" ? "Plan on hold" : "Plan declined");
    expect(supportView(s, "Guest").summary.join(" ")).not.toContain("approved replacement");
    expect(supportView(s, "Duty Manager").guidance.primary?.type).toBe("resume");
  });
  it("requires renewed agreement and accurate scope for a real replacement", () => {
    let s = act(released(), "Guest Services", "unavailable");
    expect(supportView(s, "Guest").status).toBe("Earlier plan paused");
    expect(supportView(s, "Duty Manager").guidance.primary?.type).toBe("revise");
    s = act(s, "Duty Manager", "revise");
    expect(supportView(s, "Guest").status).toBe("Replacement plan awaiting review");
    expect(supportView(s, "Guest").guidance.primary?.reason).toContain("Reception and the Duty Manager");
    expect(supportView(s, "Guest").guidance.primary?.reason).not.toContain("Reception, Guest Services");
    s = act(s, "Guest", "consent");
    expect(supportView(s, "Guest Services").facts.join(" ")).not.toContain("quieter waiting");
    expect(act(s, "Duty Manager", "approve")).toBe(s);
  });
  it("keeps shared-role guidance and all counts/history unchanged by private feedback", () => {
    let s = delivered();
    for (const role of ["Housekeeping lead", "Guest Services"] as const) {
      const before = supportView(s, role);
      for (const action of ["helped", "needs-support", "pending"] as const) {
        s = act(s, "Guest", action);
        expect(supportView(s, role)).toEqual(before);
      }
    }
  });
  it("confirms an explicit pending choice without duplicate history and shows the fictional clock", () => {
    const s = act(delivered(), "Guest", "pending");
    expect(supportView(s, "Guest").feedbackNotice).toContain("Feedback left pending by choice");
    expect(act(s, "Guest", "pending")).toBe(s);
    expect(supportView(s, "Housekeeping lead").feedbackNotice).toBeNull();
    expect(supportView(s, "Guest Services").feedbackNotice).toBeNull();
    expect(supportView(s, "Duty Manager").clock).toBe("3:25 pm");
    expect(supportView(act(s, "Duty Manager", "overdue"), "Duty Manager").clock).toBe("3:50 pm");
  });
});

describe("consistent fictional role projections", () => {
  it("does not share preferences with receiving roles before guest agreement", () => {
    for (const role of ["Guest Services", "Duty Manager", "Housekeeping lead"] as const) {
      const view = supportView(initialSupportState(), role);
      expect(view.facts.join(" ")).not.toContain("quieter waiting");
      expect(view.records).toEqual([]);
    }
    const s = act(initialSupportState(), "Guest", "consent");
    expect(supportView(s, "Guest Services").facts.join(" ")).toContain("quieter waiting");
  });
  it("filters Housekeeping facts, communications, history and counts after every event", () => {
    let s = delivered();
    const before = supportView(s, "Housekeeping lead");
    s = act(s, "Guest", "needs-support");
    const after = supportView(s, "Housekeeping lead");
    expect(after).toEqual(before); // private feedback cannot change counts/status/summary
    expect(after.records).toHaveLength(1);
    const visible = JSON.stringify(after);
    for (const secret of ["quieter waiting", "practical assistance", "Still needs support", "Guest reported"])
      expect(visible).not.toContain(secret);
    expect(after.records[0].purpose).toBe("Workload reallocation");
  });
  it("Guest does not see drafts, staff capacity or team-only history", () => {
    const approved = act(checked(), "Duty Manager", "approve");
    expect(supportView(approved, "Guest").records).toHaveLength(0);
    const view = supportView(released(), "Guest");
    expect(view.records).toHaveLength(1);
    expect(view.records[0].purpose).toBe("Approved guest update");
    expect(view.facts.join(" ")).not.toContain("capacity pressure");
    expect(view.history.every(e => e.audience.includes("Guest"))).toBe(true);
  });
  it("state is unchanged by role projection/switching; reset creates a fresh isolated state", () => {
    const s = delivered();
    const saved = structuredClone(s);
    for (const role of ["Guest", "Reception", "Guest Services", "Housekeeping lead", "Duty Manager"] as const) {
      supportView(s, role);
      expect(supportActions(s, role).find(a => a.type === "reset")?.enabled).toBe(true);
    }
    expect(s).toEqual(saved);
    expect(act(s, "Guest", "reset")).toEqual(initialSupportState());
    expect(s).toEqual(saved);
  });
});
