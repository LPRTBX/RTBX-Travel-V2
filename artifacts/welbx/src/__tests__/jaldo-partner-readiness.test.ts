/**
 * JALDO Travel partner-readiness regression tests.
 *
 * Covers the audited release-blocker set: no active customer-facing RTBX
 * branding, the JALDO Travel brand hierarchy, proof-language boundaries,
 * scenario lifecycle reaching Closed, unique pilot-model keys, explicit
 * Not Found behaviour, and homepage CTA preservation.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const srcRoot = join(root, "src");
const appPath = join(srcRoot, "App.tsx");

// ── Active import graph (same resolution strategy as scripts/check-access-boundaries.mjs) ──

function resolveSourceImport(fromFile: string, specifier: string): string | null {
  if (!specifier.startsWith("@/") && !specifier.startsWith(".")) return null;
  const unresolved = specifier.startsWith("@/")
    ? join(srcRoot, specifier.slice(2))
    : resolve(dirname(fromFile), specifier);
  const candidates = [
    unresolved,
    `${unresolved}.ts`,
    `${unresolved}.tsx`,
    join(unresolved, "index.ts"),
    join(unresolved, "index.tsx"),
  ];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null;
}

function collectImportGraph(entryFile: string): Set<string> {
  const visited = new Set<string>();
  const pending = [entryFile];
  const importPattern = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;

  while (pending.length > 0) {
    const file = pending.pop();
    if (!file || visited.has(file)) continue;
    visited.add(file);
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const resolvedImport = resolveSourceImport(file, match[1]);
      if (resolvedImport && !visited.has(resolvedImport)) pending.push(resolvedImport);
    }
  }
  return visited;
}

const activeImportGraph = collectImportGraph(appPath);

describe("Route/import check — active import graph", () => {
  it("resolves at least 60 active source modules from App.tsx", () => {
    expect(activeImportGraph.size).toBeGreaterThanOrEqual(60);
  });

  it("does not reach the inactive/orphaned files this audit deliberately left untouched", () => {
    const deliberatelyInactive = [
      "pages/LiveDemo.tsx",
      "components/Sidebar.tsx",
      "components/GlobalSearch.tsx",
      "components/RTBXArchitecture/RTBXArchitecture.tsx",
      "pages/partner-room/PartnerCommercial.tsx",
    ];
    for (const relativePath of deliberatelyInactive) {
      expect(activeImportGraph.has(join(srcRoot, relativePath)), relativePath).toBe(false);
    }
  });
});

describe("Terminology check — no active customer-facing RTBX branding", () => {
  // \bRTBX\b (case-sensitive) does not match rtbx-* CSS classes, camelCase
  // identifiers (rtbxCoordinates, rtbxTravel...), SCREAMING_SNAKE identifiers
  // (RTBX_OWNED_CAPABILITIES) or import paths (rtbxArchitecture) — only a
  // standalone "RTBX" brand token used as display text or a data value.
  const RTBX_TOKEN = /\bRTBX\b/;

  it("finds zero standalone RTBX brand tokens across the active import graph", () => {
    const offenders: string[] = [];
    for (const file of activeImportGraph) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      const content = readFileSync(file, "utf8");
      if (RTBX_TOKEN.test(content)) offenders.push(file.replace(root, ""));
    }
    expect(offenders, `files still containing a standalone RTBX token: ${offenders.join(", ")}`).toEqual([]);
  });

  it("does not use RTBX branding in index.html title/meta", () => {
    const html = readFileSync(join(root, "index.html"), "utf8");
    expect(RTBX_TOKEN.test(html)).toBe(false);
  });

  it("preserves internal rtbx-* identifiers that carry technical risk to rename", () => {
    // Compatibility CSS classes, the storage key and the data-file import path
    // must survive the rebrand untouched.
    const layout = readFileSync(join(srcRoot, "components/PartnerRoomLayout.tsx"), "utf8");
    expect(layout).toContain('className="rtbx-brand-title"');
    const deployment = readFileSync(join(srcRoot, "context/DeploymentContext.tsx"), "utf8");
    expect(deployment).toContain('"rtbx_travel_deployment_v1"');
    const landing = readFileSync(join(srcRoot, "pages/Landing.tsx"), "utf8");
    expect(landing).toContain('className="rtbx-landing-page"');
  });

  it("keeps lance@rtbx.com.au unchanged pending a confirmed JALDO replacement address", () => {
    const nextStep = readFileSync(join(srcRoot, "pages/partner-room/PartnerNextStep.tsx"), "utf8");
    expect(nextStep).toContain("lance@rtbx.com.au");
  });
});

describe("JALDO Travel brand hierarchy", () => {
  it("shows the JALDO Travel wordmark in the Partner Room nav", () => {
    const layout = readFileSync(join(srcRoot, "components/PartnerRoomLayout.tsx"), "utf8");
    expect(layout).toContain("<TravelWordmark />");
    const wordmark = readFileSync(join(srcRoot, "components/TravelWordmark.tsx"), "utf8");
    expect(wordmark).toContain('aria-label="JALDO Travel"');
    expect(wordmark).toContain("brand/jaldo-logo-white.webp");
  });

  it("names JALDO, JALDO Core and JALDO Travel as the brand hierarchy on the Partner Room landing page", () => {
    const landing = readFileSync(join(srcRoot, "pages/partner-room/PartnerRoomLanding.tsx"), "utf8");
    expect(landing).toContain('label: "JALDO"');
    expect(landing).toContain('label: "JALDO Core"');
    expect(landing).toContain('label: "JALDO Travel"');
  });

  it("names Guest Experience as the capability and Behavioural Infrastructure as the category on the homepage", () => {
    const landing = readFileSync(join(srcRoot, "pages/Landing.tsx"), "utf8");
    expect(landing).toContain("Guest Experience");
    expect(landing).toContain("Behavioural Infrastructure");
  });
});

describe("Proof-language boundaries — audited phrases corrected", () => {
  const auditedProhibited = [
    /Real-time deployment\s*—\s*tracked state by state/i,
    /System state confirmed\s*—\s*metrics captured/i,
    /Samaritans liaison contacted/i,
    /Samaritans partnership\s*—\s*contacted/i,
    /proof the system works/i,
  ];

  it("does not contain the audited proof-language violations anywhere in the active import graph", () => {
    const offenders: string[] = [];
    for (const file of activeImportGraph) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      const content = readFileSync(file, "utf8");
      for (const pattern of auditedProhibited) {
        if (pattern.test(content)) offenders.push(`${file.replace(root, "")} :: ${pattern}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("does not make unqualified revenue or liability claims in the deployment environment value props", () => {
    const landing = readFileSync(join(srcRoot, "pages/partner-room/PartnerRoomLanding.tsx"), "utf8");
    expect(landing).not.toMatch(/Revenue per stay increases\./);
    expect(landing).not.toMatch(/Liability reduced\./);
    expect(landing).toMatch(/aim of increasing revenue per stay/i);
    expect(landing).toMatch(/aim of reducing liability exposure/i);
  });

  it("qualifies pilot/MVP claims as designed-for or subject to validation rather than proven fact", () => {
    const pilotModel = readFileSync(join(srcRoot, "pages/partner-room/PartnerPilotModel.tsx"), "utf8");
    expect(pilotModel).not.toMatch(/The pilot proves the operating model/);
    expect(pilotModel).toMatch(/designed to validate the operating model/i);

    const signalCapture = readFileSync(join(srcRoot, "pages/partner-room/PartnerSignalCapture.tsx"), "utf8");
    expect(signalCapture).not.toMatch(/The MVP proves the response loop/);
  });
});

describe("Scenario lifecycle reaches Closed", () => {
  it("can transition a configured scenario through every state to closed once required evidence is captured", async () => {
    const { DEFAULT_DEPLOYMENT } = await import("@/data/travelDeploymentConfig");
    const { TRAVEL_SCENARIOS } = await import("@/data/travelScenarios");
    const { TRAVEL_PLAYBOOKS } = await import("@/data/travelPlaybooks");
    const {
      createExecution,
      transitionExecution,
      captureEvidence,
      getMandatoryEvidenceGaps,
      canTransition,
    } = await import("@/lib/runtimeEngine");

    const configured = DEFAULT_DEPLOYMENT.scenarios.find((s) => s.active);
    expect(configured, "DEFAULT_DEPLOYMENT has at least one active scenario").toBeDefined();

    const scenario = TRAVEL_SCENARIOS.find((s) => s.id === configured!.scenarioId)!;
    const playbook = TRAVEL_PLAYBOOKS.find((p) => p.id === configured!.playbookId)!;
    expect(scenario).toBeDefined();
    expect(playbook).toBeDefined();

    let exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    expect(exec.state).toBe("signal-received");

    exec = transitionExecution(exec, "understanding", scenario)!;
    exec = transitionExecution(exec, "decision-required", scenario)!;
    expect(exec).not.toBeNull();

    const toApprovalOrAction = scenario.governanceConfig.humanApprovalRequired ? "approval-required" : "in-action";
    exec = transitionExecution(exec, toApprovalOrAction, scenario)!;
    expect(exec).not.toBeNull();

    if (exec.state === "approval-required") {
      exec = transitionExecution(exec, "in-action", scenario)!;
    }
    expect(exec.state).toBe("in-action");

    exec = transitionExecution(exec, "resolved", scenario)!;
    expect(exec.state).toBe("resolved");

    // Close is blocked until all required evidence is captured.
    expect(canTransition(exec, "closed", scenario).allowed).toBe(getMandatoryEvidenceGaps(exec).length === 0);

    for (const item of exec.evidence) {
      exec = captureEvidence(exec, item.id, { capturedByRole: "operator" });
    }
    expect(getMandatoryEvidenceGaps(exec)).toEqual([]);
    expect(canTransition(exec, "closed", scenario).allowed).toBe(true);

    exec = transitionExecution(exec, "closed", scenario)!;
    expect(exec).not.toBeNull();
    expect(exec.state).toBe("closed");
    expect(exec.closedAt).toBeTruthy();
  });

  it("also reaches closed via the escalation branch (approval-required → escalated → in-action → resolved → closed)", async () => {
    const { DEFAULT_DEPLOYMENT } = await import("@/data/travelDeploymentConfig");
    const { TRAVEL_SCENARIOS } = await import("@/data/travelScenarios");
    const { TRAVEL_PLAYBOOKS } = await import("@/data/travelPlaybooks");
    const { createExecution, transitionExecution, captureEvidence } = await import("@/lib/runtimeEngine");

    const configured = DEFAULT_DEPLOYMENT.scenarios.find(
      (s) => s.active && TRAVEL_SCENARIOS.find((sc) => sc.id === s.scenarioId)?.governanceConfig.humanApprovalRequired,
    ) ?? DEFAULT_DEPLOYMENT.scenarios.find((s) => s.active)!;
    const scenario = TRAVEL_SCENARIOS.find((s) => s.id === configured.scenarioId)!;
    const playbook = TRAVEL_PLAYBOOKS.find((p) => p.id === configured.playbookId)!;

    let exec = createExecution({ deployment: DEFAULT_DEPLOYMENT, scenario, playbook });
    exec = transitionExecution(exec, "understanding", scenario)!;
    exec = transitionExecution(exec, "decision-required", scenario)!;
    const next = scenario.governanceConfig.humanApprovalRequired ? "approval-required" : "in-action";
    exec = transitionExecution(exec, next, scenario)!;
    if (exec.state === "approval-required") {
      exec = transitionExecution(exec, "escalated", scenario)!;
      expect(exec.state).toBe("escalated");
      exec = transitionExecution(exec, "in-action", scenario)!;
    }
    expect(exec.state).toBe("in-action");
    exec = transitionExecution(exec, "resolved", scenario)!;
    for (const item of exec.evidence) exec = captureEvidence(exec, item.id, {});
    exec = transitionExecution(exec, "closed", scenario)!;
    expect(exec.state).toBe("closed");
  });
});

describe("Unique pilot-model keys", () => {
  function assertUniqueIds<T extends Record<string, unknown>>(items: T[], key: keyof T, label: string) {
    const ids = items.map((item) => item[key]);
    expect(new Set(ids).size, `${label} has duplicate ${String(key)} values`).toBe(ids.length);
  }

  it("PILOT_SCENARIOS, PILOT_OPERATING_SYSTEMS, DEPLOYMENT_PACKAGE and EXPANSION_STAGES each have unique React-key fields", async () => {
    const {
      PILOT_SCENARIOS,
      PILOT_OPERATING_SYSTEMS,
      DEPLOYMENT_PACKAGE,
      EXPANSION_STAGES,
      PILOT_SUCCESS_MEASURES,
      READINESS_CHECKLIST,
    } = await import("@/data/travelPilotModel");

    assertUniqueIds(PILOT_SCENARIOS as any[], "scenarioId", "PILOT_SCENARIOS");
    assertUniqueIds(PILOT_OPERATING_SYSTEMS as any[], "id", "PILOT_OPERATING_SYSTEMS");
    assertUniqueIds(DEPLOYMENT_PACKAGE as any[], "id", "DEPLOYMENT_PACKAGE");
    assertUniqueIds(EXPANSION_STAGES as any[], "id", "EXPANSION_STAGES");
    assertUniqueIds(PILOT_SUCCESS_MEASURES as any[], "id", "PILOT_SUCCESS_MEASURES");
    assertUniqueIds(READINESS_CHECKLIST as any[], "id", "READINESS_CHECKLIST");
  });

  it("PartnerPilotModel.tsx keys every mapped list on a stable, unique field", () => {
    const source = readFileSync(join(srcRoot, "pages/partner-room/PartnerPilotModel.tsx"), "utf8");
    expect(source).toContain("key={pos.id}");
    expect(source).toContain("key={ps.scenarioId}");
    expect(source).toContain("key={pkg.id}");
    expect(source).toContain("key={stage.id}");
    expect(source).toContain("key={m.id}");
    expect(source).toContain("key={item.id}");
  });
});

describe("Explicit Not Found behaviour", () => {
  it("routes the catch-all Switch entry to the Not Found page instead of redirecting to /", () => {
    const app = readFileSync(appPath, "utf8");
    expect(app).toMatch(/<Route>\{?\(?\)?\s*=>\s*<NotFound\s*\/>\}?<\/Route>/);
    expect(app).not.toMatch(/<Route>\{\(\)\s*=>\s*<Redirect to="\/" \/>\}<\/Route>/);
  });

  it("renders explicit, user-facing not-found copy rather than a developer placeholder", () => {
    const notFound = readFileSync(join(srcRoot, "pages/not-found.tsx"), "utf8");
    expect(notFound).toMatch(/404/);
    expect(notFound).toMatch(/page.{0,20}(not found|doesn't exist)/i);
    expect(notFound).not.toMatch(/Did you forget to add the page to the router/i);
    expect(notFound).toContain('href="/"');
    expect(notFound).toContain('href="/partner-room"');
  });
});

describe("Homepage CTA preservation", () => {
  it("keeps 'Enter the Operating Layer' pointed at /partner-room and 'The Framework' pointed at /story", () => {
    const landing = readFileSync(join(srcRoot, "pages/Landing.tsx"), "utf8");
    const enterIdx = landing.indexOf("Enter the Operating Layer");
    const frameworkIdx = landing.indexOf("The Framework");
    expect(enterIdx).toBeGreaterThan(-1);
    expect(frameworkIdx).toBeGreaterThan(-1);

    const beforeEnter = landing.slice(0, enterIdx);
    expect(beforeEnter.lastIndexOf('href="/partner-room"')).toBeGreaterThan(beforeEnter.lastIndexOf("<Link"));

    const beforeFramework = landing.slice(0, frameworkIdx);
    expect(beforeFramework.lastIndexOf('href="/story"')).toBeGreaterThan(beforeFramework.lastIndexOf("<Link"));
  });
});

describe("Pilot duration alignment", () => {
  it("states 8–10 weeks implementation/readiness followed by a 2–3 month controlled pilot in the canonical proposition", async () => {
    const { PILOT_PROPOSITION } = await import("@/data/travelPilotModel");
    expect(PILOT_PROPOSITION.durationNote).toMatch(/8–10 weeks/);
    expect(PILOT_PROPOSITION.durationNote).toMatch(/2–3 month/);
  });

  it("does not advertise a conflicting 8–12 week duration anywhere in the active import graph", () => {
    const offenders: string[] = [];
    for (const file of activeImportGraph) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      const content = readFileSync(file, "utf8");
      if (/8[–-]12\s*week/i.test(content)) offenders.push(file.replace(root, ""));
    }
    expect(offenders).toEqual([]);
  });
});
