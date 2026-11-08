// Checks for the review workspace. They run the actual pinned Core kernel through the same session and views the page uses.
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { applyCommand, holderView, type Command } from "@workspace/jaldo-orchestration";
import { SCRIPTS, runPath } from "../src/paths";
import { moreOptions, nextSteps, visibleActionIds } from "../src/next";
import { DEMO_ROLES, Session, roleOf, type DemoRoleId } from "../src/session";
import { STEP } from "../src/copy";
import { page, roleView } from "../src/views";

const here = dirname(fileURLToPath(import.meta.url));
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ");
const view = (s: Session, role: DemoRoleId) => text(roleView(s, role, null));
const ROLE_ORDER: DemoRoleId[] = ["duty-lead", "guest", "reception", "housekeeping", "guest-services", "maintenance"];

/** Follows each role's primary next step, exactly as a person would by clicking it, until Core has nothing left for anyone. */
function followPrimaries(s: Session, max = 120) {
  for (let i = 0; i < max; i++) {
    // A highlighted primary is followed as is. The guest's sharing choice has no primary (allow and decline are equal), so the
    // person following the journey explicitly CHOOSES "allow", exactly as the guest would by pressing that button.
    const role = ROLE_ORDER.find((r) => nextSteps(s, r)[0]?.primary || guestAllow(s, r));
    if (!role) return i;
    const step = nextSteps(s, role)[0];
    const r = s.apply(role, (step.primary ?? guestAllow(s, role)!).command);
    if (!r.ok) throw new Error(`${role}: ${r.code} ${r.message}`);
  }
  throw new Error("did not settle");
}
const guestAllow = (s: Session, role: DemoRoleId) => (role === "guest" ? nextSteps(s, role)[0]?.others.find((c) => c.command.type === "approve") ?? null : null);
const deliver = () => { const s = new Session(); runPath(s, "didnothelp"); return s; };

describe("runtime behaviour comes from Core", () => {
  it("a refusal shown to the user is Core's own message for the same command and state", () => {
    const s = new Session();
    runPath(s, "missing");
    const command: Command = { type: "approve", actionId: "SUP-1", checks: { recipient: true, purpose: true, fields: true, authority: true } };
    const direct = applyCommand(s.config, s.state, { id: "x", command }, roleOf("duty-lead").actor, s.facts());
    const shown = s.apply("duty-lead", command);
    expect(direct.ok).toBe(false);
    expect(shown).toEqual({ ok: false, code: (direct as { code: string }).code, message: (direct as { message: string }).message });
    expect((shown as { message: string }).message).toMatch(/Waiting for: .*Space check accepted/);
  });

  it("the primary next step is derived from Core's plan and assurance output, not a first-accepted command", () => {
    const s = new Session();
    expect(nextSteps(s, "duty-lead")[0].what).toBe(s.report.plan.awaitingHuman.find((h) => h.who === "The addressed contact")!.what);
    s.apply("duty-lead", nextSteps(s, "duty-lead")[0].primary!.command);
    for (const role of ["duty-lead", "guest"] as DemoRoleId[]) {
      const first = nextSteps(s, role)[0];
      const coreWho = role === "guest" ? "The guest" : "The request holder";
      const core = s.report.plan.awaitingHuman.filter((h) => h.who === coreWho);
      // The step is Core's (same action, same owner). Only the guest's wording about sharing differs from Core's text.
      expect(core.map((h) => h.actionId)).toContain(first.actionId);
      if (role === "guest") expect(first.what).toBe("Choose what to share with Reception");
      else expect(core.map((h) => h.what)).toContain(first.what);
    }
  });

  it("following only primary next steps completes the normal journey, with no second lifecycle", () => {
    const s = new Session();
    followPrimaries(s);
    const sup = s.state.actions.find((a) => a.id === "SUP-1")!;
    expect(sup.state).toBe("completed");
    expect(s.state.actions.find((a) => a.id === "WLD-1")!.state).toBe("completed");
    // Only the guest's own answer is left, and none of the answers is a highlighted default.
    const guest = nextSteps(s, "guest")[0];
    expect(guest.primary).toBeNull();
    expect(guest.others.length).toBeGreaterThanOrEqual(3);
  });

  it("the workspace source holds no lifecycle rule", () => {
    const files = readdirSync(resolve(here, "../src")).filter((f: string) => f.endsWith(".ts"));
    for (const f of files) {
      const src = readFileSync(resolve(here, "../src", f), "utf8");
      expect(src, f).not.toMatch(/\.(state|status)\s*(===|!==|==|!=)/);
      if (f !== "copy.ts") expect(src, f).not.toMatch(/"(awaiting_approval|approved|queued|sent|received|accepted|completed|confirmed|withdrawn|unresolved|declined|not_approved)"/);
    }
    // Commands reach Core only through the orchestrator and applyCommand.
    expect(readFileSync(resolve(here, "../src/session.ts"), "utf8")).toMatch(/orchestrateMoment/);
  });

  it("every Core id the workspace words has wording, and the wording names no unknown id", () => {
    const s = new Session();
    for (const t of s.config.actions) expect(STEP[t.id], `no wording for ${t.id}`).toBeDefined();
    for (const id of Object.keys(STEP)) expect(s.config.actions.some((t) => t.id === id) || ["space-recheck", "capacity-recheck"].includes(id), `unknown id ${id}`).toBe(true);
  });
});

describe("what each role sees uses that role's projection only (holder-history leak regression)", () => {
  it("no role other than the holder is shown a line addressed only to the holder, anywhere in its page", () => {
    const s = deliver();
    // Add a negative response and open linked work so the holder has follow-up, link and deadline records.
    s.apply("guest", { type: "recordResponse", actionId: "SUP-1", responseId: "still-needs-support" });
    s.apply("duty-lead", { type: "linkWork", kindId: "facility-repair", reference: "WO-1182", status: "open" });
    s.advance(60);
    for (const role of ROLE_ORDER.filter((r) => r !== "duty-lead")) {
      const aud = role === "guest" ? "party:guest" : `party:${roleOf(role).party}`;
      const full = text(page(s, role, { ok: false, text: "Core refused (x): y" }, null).replace(/<details class="wbs-more" id="guide">[\s\S]*?<\/details>/, ""));
      const holderOnly = s.evidence.filter((e) => e.audience.includes("holder") && !e.audience.includes(aud));
      expect(holderOnly.length).toBeGreaterThan(5);
      for (const e of holderOnly) expect(full, `${role} shows holder-only: ${e.text.slice(0, 70)}`).not.toContain(text(e.text).trim());
      expect(full, role).not.toMatch(/History in detail \(holder only\)|member-a|FU-SUP|LNK-\d|Core also prepared/);
    }
  });

  it("Housekeeping sees no guest support fields, other units' work, or the handover", () => {
    const s = deliver();
    const hk = text(page(s, "housekeeping", null, null).replace(/<details class="wbs-more" id="guide">[\s\S]*?<\/details>/, ""));
    for (const bad of ["Alex", "quiet place", "luggage", "Guest name", "What the guest asked", "What the guest said", "Preferred contact", "guest app", "Support handover", "Hand the practical support", "Guest services accepted", "SUP-1", "SGS-1"]) expect(hk, bad).not.toContain(bad);
    expect(hk).toContain("Check staff capacity");
    // Its refusals and its options also name only its own work.
    expect([...visibleActionIds(s, "housekeeping")].sort()).toEqual(["CAP-1", "WLD-1"].filter((id) => s.state.actions.find((a) => a.id === id)!.sentAt !== null));
  });

  it("Reception sees only its own check; Maintenance sees only its own linked work", () => {
    const s = deliver();
    s.apply("duty-lead", { type: "linkWork", kindId: "facility-repair", reference: "WO-1182", status: "open" });
    const rc = view(s, "reception");
    expect(rc).toContain("Check a quiet space");
    for (const bad of ["Alex", "Guest name", "Support handover", "CAP-1", "WO-1182"]) expect(rc, bad).not.toContain(bad);
    const mt = view(s, "maintenance");
    expect(mt).toContain("WO-1182");
    for (const bad of ["Alex", "Guest name", "Support handover", "SUP-1", "quiet place", "SPC-1"]) expect(mt, bad).not.toContain(bad);
  });

  it("errors and option lists are role-scoped too: a role is never told about work it cannot see", () => {
    const s = deliver();
    for (const role of ["housekeeping", "reception", "maintenance"] as DemoRoleId[]) {
      const t = view(s, role);
      expect(t, role).not.toMatch(/Support handover|Share the request|SUP-1|SGS-1/);
    }
  });
});

describe("guest feedback, due times and the guest's stream", () => {
  it("negative feedback does not overwrite the delivery record, and the holder sees both", () => {
    const s = deliver();
    const before = JSON.stringify(s.state.actions.find((a) => a.id === "SUP-1")!, ["state", "completedAt", "acceptedAt", "sentAt", "outcome"]);
    s.apply("guest", { type: "recordResponse", actionId: "SUP-1", responseId: "still-needs-support" });
    const sup = s.state.actions.find((a) => a.id === "SUP-1")!;
    expect(JSON.stringify(sup, ["state", "completedAt", "acceptedAt", "sentAt", "outcome"])).toBe(before);
    const holder = view(s, "duty-lead");
    expect(holder).toMatch(/delivery reported \d\d:\d\d/);
    expect(holder).toMatch(/Delivery confirmation.*Guest feedback.*Still needs support.*Resolution/);
    expect(holder).toMatch(/FU-SUP-1-1 · open · owner: the duty lead/);
    expect(holder).toContain("Review follow-up FU-SUP-1-1");
  });

  it("no response is shown as unknown, and one overdue item is raised at expiry", () => {
    const s = deliver();
    expect(view(s, "duty-lead")).toMatch(/Guest feedback\s+None yet\. No answer is unknown/);
    s.advance(89);
    const before = s.evidence.length;
    s.advance(1);
    expect(s.evidence.length).toBeGreaterThan(before);
    s.advance(60);
    expect(s.evidence.filter((e) => e.kind === "moment.recognised" && /deadline-passed/.test(e.text)).length).toBe(1);
    expect(s.state.actions.find((a) => a.id === "SUP-1")!.confirmedBy).toBeNull();
  });

  it("due times shown to a role belong to its own work", () => {
    const s = new Session();
    runPath(s, "didnothelp");
    // Re-run to just after release so the handover acceptance deadline is the open one.
    runPath(s, "capacity");
    s.apply("duty-lead", { type: "execute", actionId: "SUP-1" });
    expect(view(s, "guest-services")).toMatch(/Guest services accept the handover: open \(due \d\d:\d\d UTC\)/);
    for (const role of ["reception", "housekeeping", "maintenance", "guest"] as DemoRoleId[]) expect(view(s, role), role).not.toMatch(/within 20 minutes|accept the handover|due \d\d:\d\d/);
    expect(view(s, "duty-lead")).toMatch(/Guest services accept the handover: open \(due \d\d:\d\d UTC\)/);
  });

  it("the guest's stream is short, tells their own words, and never turns a staff statement into a guest-confirmed fact", () => {
    const s = deliver();
    const guest = roleView(s, "guest", null);
    const stream = guest.match(/<section class="wbs-card" aria-labelledby="g-now">[\s\S]*?<\/section>/)![0];
    const lines = (stream.match(/<li>/g) ?? []).length;
    const detail = (guest.match(/<details class="wbs-more"><summary>Your record in detail[\s\S]*?<\/details>/)![0].match(/<li>/g) ?? []).length;
    expect(lines).toBeGreaterThan(2);
    expect(lines).toBeLessThan(detail);
    const t = text(stream);
    expect(t).toMatch(/Recorded by staff on the unit's behalf/);
    expect(t).toMatch(/This is their report; you have not confirmed it/);
    expect(t).not.toMatch(/You confirmed/);
    expect(text(guest)).toMatch(/recorded by a member on the party's behalf \(attested\)/); // attribution kept in the detail view
    s.apply("guest", { type: "confirm", actionId: "SUP-1" });
    expect(view(s, "guest")).toMatch(/You confirmed: Hand the practical support to Guest services/);
    s.apply("guest", { type: "recordResponse", actionId: "SUP-1", responseId: "still-needs-support" });
    expect(view(s, "guest")).toContain('Your response was recorded: "Still needs support"');
    expect(view(s, "guest")).not.toMatch(/follow-up FU|member-a|due \d\d:\d\d/);
  });
});

describe("review paths", () => {
  it("each path sets up with real kernel commands and none is refused", () => {
    for (const id of Object.keys(SCRIPTS)) {
      const s = new Session();
      const r = runPath(s, id);
      expect(r, id).toEqual({ ok: true });
    }
  });

  it("missing prerequisite: the handover waits, Core names what for, and nobody is offered its approval", () => {
    const s = new Session();
    runPath(s, "missing");
    const holder = view(s, "duty-lead");
    expect(holder).toMatch(/Hand the practical support to Guest services[^]*Waiting[^]*Space check accepted/);
    for (const role of ROLE_ORDER) for (const step of nextSteps(s, role)) expect(step.primary?.label ?? "", role).not.toMatch(/Approve · Hand the practical support/);
  });

  it("capacity withdrawn after approval: approval withdrawn, release refused, renewal restores it", () => {
    const s = new Session();
    runPath(s, "capacity");
    expect(s.state.actions.find((a) => a.id === "SUP-1")!.state).toBe("approved");
    const r = s.setCapacity("housekeeping", true);
    expect(r.ok).toBe(true);
    expect(s.state.actions.find((a) => a.id === "SUP-1")!.state).toBe("awaiting_approval");
    expect(s.apply("duty-lead", { type: "execute", actionId: "SUP-1" })).toMatchObject({ ok: false, code: "invalid_state" });
    s.setCapacity("housekeeping", false);
    followPrimaries(s);
    expect(s.state.actions.find((a) => a.id === "SUP-1")!.state).toBe("completed");
    expect(s.state.actions.filter((a) => a.typeId === "capacity-check" && a.state === "completed").length + s.state.actions.filter((a) => a.typeId === "capacity-check").length).toBeGreaterThan(1);
  });

  it("required safety dependency blocks release until Maintenance resolves it", () => {
    const s = new Session();
    runPath(s, "dependency");
    expect(view(s, "duty-lead")).toMatch(/Area safety clearance \(SC-77\) resolved/);
    expect(s.apply("duty-lead", { type: "execute", actionId: "SUP-1" })).toMatchObject({ ok: false, code: "dependency_unmet" });
    const mt = nextSteps(s, "maintenance")[0];
    expect(mt.what).toMatch(/Record the status of Area safety clearance \(SC-77\)/);
    s.apply("maintenance", { type: "recordLinkStatus", linkId: "LNK-1", status: "resolved" });
    expect(s.apply("duty-lead", { type: "execute", actionId: "SUP-1" }).ok).toBe(true);
  });

  it("support completes while independent maintenance stays open", () => {
    const s = new Session();
    runPath(s, "maintenance");
    expect(s.state.actions.find((a) => a.id === "SUP-1")!.state).toBe("confirmed");
    const holder = view(s, "duty-lead");
    expect(holder).toMatch(/Facility repair[^]*WO-1182[^]*open[^]*Independent/);
    expect(view(s, "maintenance")).toContain("WO-1182");
  });
});

describe("isolation and dependencies", () => {
  it("the Core pin is exact, recorded, and checked when a Core checkout is present", async () => {
    const pin = JSON.parse(readFileSync(resolve(here, "../core-pin.json"), "utf8"));
    expect(pin.commit).toMatch(/^[0-9a-f]{40}$/);
    const mod = await import("../check-core-pin.mjs");
    if (!existsSync(resolve(mod.coreDir, ".git"))) return; // reported by the verify script instead
    expect(mod.checkCorePin()).toMatchObject({ ok: true, commit: pin.commit });
  });

  it("Travel's own install, build and serving paths do not reference the workspace or Core", () => {
    const welbx = resolve(here, "../..");
    const pkg = readFileSync(resolve(welbx, "package.json"), "utf8");
    expect(pkg).not.toMatch(/workspace-harness|jaldo-orchestration|link:/);
    for (const f of ["vite.config.ts", "vite.public-wellbeing.config.ts", "tsconfig.json", "vitest.config.ts", "server/app.mjs", "scripts/check-access-boundaries.mjs"]) {
      expect(readFileSync(resolve(welbx, f), "utf8"), f).not.toMatch(/workspace-harness/);
    }
    const lock = readFileSync(resolve(welbx, "../../pnpm-lock.yaml"), "utf8");
    expect(lock).not.toMatch(/jaldo-orchestration|workspace-harness/);
    // No relative Core path is committed in anything Travel installs.
    expect(readFileSync(resolve(welbx, "../../pnpm-workspace.yaml"), "utf8")).not.toMatch(/rtbx-main|workspace-harness/);
  });

  it("the harness has its own package, outside the workspace globs, with no dependencies to install", () => {
    const pkg = JSON.parse(readFileSync(resolve(here, "../package.json"), "utf8"));
    expect(pkg.dependencies ?? {}).toEqual({});
    expect(pkg.devDependencies ?? {}).toEqual({});
  });

  it("all demo roles are labelled as demonstrations and none claims authentication", () => {
    const s = new Session();
    const html = page(s, "duty-lead", null, null);
    expect(text(html)).toMatch(/Demo role · not access control/);
    expect(text(html)).toMatch(/Interactive demonstration · fictional system events · simulated delivery/);
    expect(text(html)).toMatch(/No model is connected/);
    expect(text(html)).not.toMatch(/signed in|you are authenticated|is verified|live channel is connected/i);
    expect(text(html)).toMatch(/Not connected: real PMS and maintenance systems, verified identity and grants/);
    expect(DEMO_ROLES.length).toBe(6);
  });
});

describe("every option Core offers a role can be reached on the page", () => {
  it("the guest can record a response even while an earlier approval is waiting (found in review)", () => {
    const s = new Session(); runPath(s, "didnothelp");
    const html = roleView(s, "guest", null);
    expect(nextSteps(s, "guest").length).toBeGreaterThan(1);
    for (const label of ["Support helped", "Still needs support", "Keep feedback pending"]) expect(html).toContain(label);
  });
  it("every option listed for any step is rendered as a button, for every role on every path", () => {
    for (const id of Object.keys(SCRIPTS)) {
      const s = new Session(); runPath(s, id);
      for (const r of ROLE_ORDER) {
        const html = roleView(s, r, null);
        for (const n of nextSteps(s, r)) for (const c of [n.primary, ...n.others]) if (c) expect(html, `${id}/${r}: ${c.label}`).toContain(c.label.replace(/&/g, "&amp;"));
      }
    }
  });
});

describe("reviewed presentation changes keep Core's rules, permissions and isolation", () => {
  const paths = Object.keys(SCRIPTS);
  const moved = (s: Session) => holderView(s.config, s.state, s.evidence, s.facts(), "member-a")!.coordination!.deadlines.find((d) => d.defId === "guest-response-window")!;

  it("\"move the due time 30 minutes later\" moves the recorded due time by exactly 30 minutes, later (found: it used to set now+30, shortening it by an hour)", () => {
    const s = new Session(); runPath(s, "maintenance");
    const before = Date.parse(moved(s).dueAt);
    const opt = moreOptions(s, "duty-lead").find((o) => o.command.type === "rescheduleDeadline" && o.command.deadlineId.startsWith("guest-response-window"))!;
    expect(opt.label).toMatch(/30 minutes later, to 11:00 UTC/);
    expect(s.apply("duty-lead", opt.command).ok).toBe(true);
    expect(Date.parse(moved(s).dueAt)).toBe(before + 30 * 60_000);
  });
  it("once the due time has passed, the control gives 30 more minutes from now (30 after a passed due time would be refused)", () => {
    const s = new Session(); runPath(s, "noresponse"); s.advance(120);
    const opt = moreOptions(s, "duty-lead").find((o) => o.command.type === "rescheduleDeadline" && o.command.deadlineId.startsWith("guest-response-window"))!;
    expect(opt.label).toMatch(/^Give 30 more minutes from now, to 11:30 UTC/);
    expect(s.apply("duty-lead", opt.command).ok).toBe(true);
    expect(Date.parse(moved(s).dueAt)).toBe(s.clock.getTime() + 30 * 60_000);
  });
  it("the page shows the RECORDED due time and the move, never the configured 90 minutes as if it were the due time", () => {
    const s = new Session(); runPath(s, "maintenance");
    const opt = moreOptions(s, "duty-lead").find((o) => o.command.type === "rescheduleDeadline" && o.command.deadlineId.startsWith("guest-response-window"))!;
    s.apply("duty-lead", opt.command);
    const html = view(s, "duty-lead");
    expect(html).toMatch(/Guest response deadline: open \(due 11:00 UTC\) · moved 10:30 → 11:00 UTC \(a material change\)/);
    expect(html).not.toMatch(/within 90 minutes of delivery: open/);
    expect(html).toMatch(/configured: The guest is asked for a response within 90 minutes of delivery/); // Core's expectation, kept apart from the due time
  });
  it("a follow-up, an unresolved required check and an expired deadline are shown first to the holder, and only to the holder", () => {
    const f = new Session(); runPath(f, "didnothelp"); f.apply("guest", { type: "recordResponse", actionId: "SUP-1", responseId: "still-needs-support" });
    expect(view(f, "duty-lead")).toMatch(/Needs attention now.*The guest still needs support\..*Review the open follow-up/);
    expect(view(f, "duty-lead")).toMatch(/Delivery reported — follow-up open/);
    expect(view(f, "duty-lead")).toMatch(/Other available work/);
    const d = new Session(); runPath(d, "dependency");
    expect(view(d, "duty-lead")).toMatch(/Needs attention now.*Handover blocked: Area safety clearance.*Waiting on Maintenance/);
    const n = new Session(); runPath(n, "noresponse"); n.advance(91);
    expect(view(n, "duty-lead")).toMatch(/1 deadline is overdue/);
    for (const s of [f, d, n]) for (const r of ROLE_ORDER.filter((x) => x !== "duty-lead")) expect(view(s, r), r).not.toMatch(/Needs attention now|Handover blocked|still needs support\./);
  });
  it("required checks and independent repairs are separate sections with their own effect stated", () => {
    const s = new Session(); runPath(s, "maintenance");
    const html = roleView(s, "duty-lead", null);
    const req = html.indexOf("Required checks"), rel = html.indexOf("Related work · stays open separately");
    expect(req).toBeGreaterThan(-1); expect(rel).toBeGreaterThan(req);
    expect(html.slice(rel)).toMatch(/Facility repair<\/strong> · WO-1182 · open/);
    expect(html.slice(req, rel)).not.toMatch(/WO-1182/);
    const d = new Session(); runPath(d, "dependency");
    expect(roleView(d, "duty-lead", null).split("Related work")[0]).toMatch(/Area safety clearance<\/strong> · SC-77/);
  });
  it("the guest's sharing wording is clear, and the commands and Core's refusals are unchanged", () => {
    const s = new Session(); runPath(s, "missing");
    const steps = nextSteps(s, "guest");
    expect(steps[0].what).toMatch(/^Choose what to share with /);
    const labels = [steps[0].primary, ...steps[0].others].filter(Boolean).map((c) => c!.label);
    expect(labels.some((l) => /^Allow (Reception|Guest services) to see these details$/.test(l))).toBe(true);
    for (const c of [steps[0].primary, ...steps[0].others]) if (c) expect(["approve", "refuse"]).toContain(c.command.type);
    const html = roleView(s, "guest", null);
    expect(html).toMatch(/What you can choose to share/); expect(html).not.toMatch(/Approve · Share|Approve Share|agree to/);
    // a non-guest still reads the plain Core verbs, and the holder cannot approve for the guest
    expect(s.ask("duty-lead", { type: "approve", actionId: "SRC-1", checks: { recipient: true, purpose: true, fields: true, authority: true } }).ok).toBe(false);
  });
  it("every role on every path keeps the same permitted actions as Core would accept (nothing hidden by the new layout)", () => {
    for (const id of paths) {
      const s = new Session(); runPath(s, id);
      for (const r of ROLE_ORDER) {
        const html = roleView(s, r, null);
        for (const c of moreOptions(s, r)) expect(html, `${id}/${r}: ${c.label}`).toContain(c.label.replace(/&/g, "&amp;"));
      }
    }
  });
  it("the review tools start collapsed, hold the reviewer controls, and stay out of every role view", () => {
    const s = new Session(); runPath(s, "normal");
    const html = page(s, "duty-lead", null, null);
    expect(html).toMatch(/<details class="wbs-card hz-controls" id="review-tools"><summary>Review tools · viewing as Duty lead/);
    expect(html).not.toMatch(/id="review-tools" open/);
    const inside = html.slice(html.indexOf('id="review-tools"'), html.indexOf('id="role-view"'));
    for (const k of ["data-role=", "data-adv=", "data-cap=", "data-reset=", 'id="guide"']) expect(inside).toContain(k);
    for (const r of ROLE_ORDER) expect(roleView(s, r, null)).not.toMatch(/data-role=|data-path=|data-adv=|data-cap=|data-reset=/);
  });
  it("introductions are short, carry no photo, and the tables carry a label on every cell for the mobile cards", () => {
    const s = new Session(); runPath(s, "maintenance");
    for (const r of ROLE_ORDER) {
      const html = roleView(s, r, null);
      expect(html, r).not.toMatch(/<img|<figure/);
      expect(text(html.slice(0, html.indexOf('<div class="wbs-body">'))).length, r).toBeLessThan(260);
      for (const t of html.match(/<table class="wbs-table review-responsive">[\s\S]*?<\/table>/g) ?? []) expect(t.match(/<td(?![^>]*colspan)(?![^>]*data-label)/g), r).toBeNull();
    }
  });
});
