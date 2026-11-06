import "../../src/public-wellbeing/page.css";
import "../../src/components/partner-room/wellbeing-support.css";
import "./harness.css";
import type { Command } from "@workspace/jaldo-orchestration";
import { runPath } from "./paths";
import { Session, type ApplyResult, type DemoRoleId } from "./session";
import { page } from "./views";
import { VERB } from "./copy";

const session = new Session();
let role: DemoRoleId = "duty-lead";
let result: { ok: boolean; text: string } | null = null;
let pathId: string | null = null;
const root = document.getElementById("root")!;

type Focus = "result" | "view" | "keep";
function render(focus: Focus = "keep") {
  const had = document.activeElement?.getAttribute("data-role");
  root.innerHTML = page(session, role, result, pathId);
  if (focus === "result") document.getElementById("result")?.focus({ preventScroll: false });
  else if (focus === "view") document.getElementById("role-view")?.focus({ preventScroll: true });
  else if (had) (root.querySelector(`[data-role="${had}"]`) as HTMLElement | null)?.focus();
}

const describe = (r: ApplyResult, okText: string): { ok: boolean; text: string } => {
  if (!r.ok) return { ok: false, text: `Core refused (${r.code}): ${r.message}` };
  const auto = role === "duty-lead" && r.automated.length ? ` Core also prepared: ${r.automated.join("; ")}.` : "";
  return { ok: true, text: `${okText} Core recorded ${r.evidence.length} ${r.evidence.length === 1 ? "entry" : "entries"}.${auto}` };
};

root.addEventListener("click", (e) => {
  const t = (e.target as HTMLElement).closest("button") as HTMLButtonElement | null;
  if (!t) return;
  if (t.dataset.role) { role = t.dataset.role as DemoRoleId; result = null; render("view"); return; }
  if (t.dataset.cmd) {
    const command = JSON.parse(t.dataset.cmd) as Command;
    result = describe(session.apply(role, command), `${VERB[command.type] ?? command.type}: accepted by Core.`);
    render("result"); return;
  }
  if (t.dataset.adv) { result = describe(session.advance(Number(t.dataset.adv)), `Synthetic clock moved ${t.dataset.adv} minutes; Core evaluated deadlines.`); render("result"); return; }
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
  state: () => session.state, evidence: () => session.evidence, clock: () => session.clock.toISOString(), role: () => role,
};
render("keep");
