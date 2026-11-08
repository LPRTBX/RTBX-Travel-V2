import "../../src/public-wellbeing/page.css";
import "../../src/components/partner-room/wellbeing-support.css";
import "./harness.css";
import type { Command } from "@workspace/jaldo-orchestration";
import { runPath } from "./paths";
import { Session, type ApplyResult, type DemoRoleId } from "./session";
import { page } from "./views";
import { VERB } from "./copy";

const session = new Session("signals");
let role: DemoRoleId = "duty-lead";
let result: { ok: boolean; text: string } | null = null;
let pathId: string | null = null;
/** The Duty lead's unsent reason, kept across re-renders so a refused decision does not lose what was typed. */
let draft = "";
const root = document.getElementById("root")!;

type Focus = "result" | "view" | "keep";
function render(focus: Focus = "keep") {
  const had = document.activeElement?.getAttribute("data-role");
  const open = ["review-tools", "guide"].filter((id) => (document.getElementById(id) as HTMLDetailsElement | null)?.open);
  root.innerHTML = page(session, role, result, pathId);
  for (const id of open) { const d = document.getElementById(id) as HTMLDetailsElement | null; if (d) d.open = true; }
  const ta = document.getElementById("adopt-reason") as HTMLTextAreaElement | null; if (ta) ta.value = draft;
  if (focus === "result") document.getElementById("result")?.focus({ preventScroll: false });
  else if (focus === "view") document.getElementById("role-view")?.focus({ preventScroll: true });
  else if (had) (root.querySelector(`[data-role="${had}"]`) as HTMLElement | null)?.focus();
}

const describe = (r: ApplyResult, okText: string): { ok: boolean; text: string } => {
  if (!r.ok) return { ok: false, text: `Core refused (${r.code}): ${r.message}` };
  const auto = role === "duty-lead" && r.automated.length ? ` Core also prepared: ${r.automated.join("; ")}.` : "";
  return { ok: true, text: `${okText} Core recorded ${r.evidence.length} ${r.evidence.length === 1 ? "entry" : "entries"}.${auto}` };
};

root.addEventListener("input", (e) => { const t = e.target as HTMLElement; if (t.id === "adopt-reason") draft = (t as HTMLTextAreaElement).value; });
root.addEventListener("click", (e) => {
  const t = (e.target as HTMLElement).closest("button") as HTMLButtonElement | null;
  if (!t) return;
  if (t.dataset.adopt) {
    const reason = (document.getElementById("adopt-reason") as HTMLTextAreaElement | null)?.value ?? "";
    draft = reason;
    result = describe(session.adopt(role, { reason, expectedDigest: t.dataset.adopt }), "Check-in authorised, with your reason recorded. Next: accept responsibility for the request, so the guest can be offered help.");
    if (result.ok) draft = "";
    render(result.ok ? "view" : "result"); return;
  }
  if (t.dataset.help) { const r = session.chooseHelp(t.dataset.help as "yes" | "no"); result = r.ok ? { ok: true, text: t.dataset.help === "yes" ? (session.disclosed ? "You said yes to practical help again. What was already shared is unchanged." : "You said yes to practical help. Nothing has been shared: you choose that next.") : (session.disclosed ? "Recorded: you don't want further help. This does not recall anything already shared, cancel anything already sent or withdraw your permission." : "You said no thanks. Nothing will be shared.") } : { ok: false, text: r.message }; render("result"); return; }
  if (t.dataset.origin) { session.origin = t.dataset.origin as "signals" | "guest"; session.reset(); result = null; pathId = null; role = "duty-lead"; render("view"); return; }
  if (t.dataset.signal) { result = session.signalAction(t.dataset.signal); render("result"); return; }
  if (t.dataset.role) { role = t.dataset.role as DemoRoleId; result = null; render("view"); return; }
  if (t.dataset.cmd) {
    const command = JSON.parse(t.dataset.cmd) as Command;
    result = describe(session.apply(role, command), `${VERB[command.type] ?? command.type}: accepted by Core.`);
    render("result"); return;
  }
  if (t.dataset.adv) { { const r = session.advance(Number(t.dataset.adv)); result = session.opened ? describe(r, `Synthetic clock moved ${t.dataset.adv} minutes; Core evaluated deadlines.`) : { ok: true, text: `Synthetic clock moved ${t.dataset.adv} minutes; the readings' freshness was re-evaluated. Core is not involved until a request is opened.` }; } render("result"); return; }
  if (t.dataset.cap) { const [p, s] = t.dataset.cap.split(":"); result = describe(session.setCapacity(p, s === "down"), `Capacity fact applied: ${p} ${s === "down" ? "unavailable" : "available"}.`); render("result"); return; }
  if (t.dataset.reset) { session.reset(); result = null; pathId = null; role = "duty-lead"; render("view"); return; }
  if (t.dataset.path) {
    pathId = t.dataset.path; const r = runPath(session, pathId);
    role = "duty-lead"; result = r.ok ? { ok: true, text: "Path set up with real kernel commands. Read the guide, then carry on as the roles it names." } : { ok: false, text: r.message };
    render("view");
  }
});

(window as unknown as { __workspace: unknown }).__workspace = {
  /** Read-only views for the review harness's own checks. Nothing here can change the session. */
  state: () => (session.opened ? session.state : null), desk: () => session.desk.received.map((r) => ({ id: r.signal.id, outcome: r.outcome, order: r.order })), origin: () => session.origin, evidence: () => session.evidence, clock: () => session.clock.toISOString(), role: () => role,
};
render("keep");
