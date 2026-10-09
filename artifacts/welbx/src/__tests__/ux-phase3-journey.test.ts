import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { NAV_GROUPS, PRIMARY_NAV } from "@/components/PartnerRoomLayout";
import { GUIDED_ROUTE, OPERATING_LOOP, findJourneyStep } from "@/data/partnerJourney";

const root = process.cwd();
const app = readFileSync(join(root, "src/App.tsx"), "utf8");
const routes = new Set([...app.matchAll(/path:\s*"([^"]+)"/g)].map(match => match[1]));
const sources = (dir: string): string[] => readdirSync(dir).flatMap(name => {
  const full = join(dir, name);
  return statSync(full).isDirectory() ? sources(full) : /\.tsx?$/.test(name) ? [readFileSync(full, "utf8")] : [];
});
const allSource = sources(join(root, "src")).join("\n");

function assertResolves(path: string) {
  const [withQuery, hash] = path.split("#");
  const base = withQuery.split("?")[0];
  expect(routes.has(base), `${path}: no route for ${base}`).toBe(true);
  if (hash) expect(allSource.includes(`id="${hash}"`), `${path}: no element with id="${hash}"`).toBe(true);
}

describe("Phase 3 guided route", () => {
  it("follows the agreed order", () => {
    expect(GUIDED_ROUTE.map(step => step.title)).toEqual([
      "Architecture", "Build & Configure", "Configured execution and evidence", "Simulation Lab",
      "Operating Evolution", "Value Calculator", "Stage 3", "Pilot",
    ]);
  });

  it("demonstrates the operating loop in order", () => {
    expect(OPERATING_LOOP.map(stage => stage.label)).toEqual([
      "Signal", "Context", "Governed decision", "Action", "Evidence", "Reviewed learning", "Improved next cycle",
    ]);
  });

  it("links only to real routes and sections", () => {
    for (const step of GUIDED_ROUTE) assertResolves(step.path);
    for (const stage of OPERATING_LOOP) assertResolves(stage.see.path);
    for (const item of [...PRIMARY_NAV, ...NAV_GROUPS.flatMap(group => group.items)]) assertResolves(item.path);
  });

  it("knows which step each page is, including the two Operations Centre views", () => {
    expect(findJourneyStep("/partner-room/operations", "")?.step.id).toBe("configured-execution");
    expect(findJourneyStep("/partner-room/operations", "?scenario=service-backlog")?.step.id).toBe("configured-execution");
    expect(findJourneyStep("/partner-room/operations", "view=simulation")?.step.id).toBe("simulation-lab");
    expect(findJourneyStep("/partner-room/product-proof/stage-3-operating-layer", "")?.index).toBe(6);
    expect(findJourneyStep("/partner-room/overview", "")).toBeNull();
  });
});

describe("Phase 3 navigation", () => {
  it("puts the calculator, Stage 3 and generated evidence in the primary navigation", () => {
    expect(PRIMARY_NAV.map(item => [item.label, item.path])).toEqual([
      ["Working Proof", "/partner-room/operations"],
      ["Evidence", "/partner-room/operations#generated-evidence"],
      ["Calculator", "/partner-room/proof-calculator"],
      ["Stage 3", "/partner-room/product-proof/stage-3-operating-layer"],
      ["Pilot", "/partner-room/pilot-model"],
      ["Next Step", "/partner-room/next-step"],
    ]);
  });

  it("labels the static ledgers as examples wherever the menu offers them", () => {
    const staticLinks = NAV_GROUPS.flatMap(group => group.items).filter(item => /#(outcome-ledger|evidence-ledger|value-dashboard|action-centre)$/.test(item.path));
    expect(staticLinks.length).toBeGreaterThan(0);
    for (const link of staticLinks) expect(link.label).toMatch(/^Static Examples/);
  });

  it("keeps generated evidence on the page with or without a deployment", () => {
    const operations = readFileSync(join(root, "src/pages/partner-room/PartnerOperationsCentre.tsx"), "utf8");
    expect(operations.match(/id="generated-evidence"/g)?.length).toBe(2);
    expect(operations).toContain("No evidence has been generated.");
    expect(operations).toContain("No runs yet, so no evidence has been generated.");
  });
});
