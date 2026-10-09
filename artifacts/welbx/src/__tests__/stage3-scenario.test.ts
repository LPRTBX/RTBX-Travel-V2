import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const preview = source("src/pages/partner-room/PartnerStage3Preview.tsx");
const scenario = source("src/pages/partner-room/Stage3ScenarioExperience.tsx");
const app = source("src/App.tsx");

describe("Stage 3 scenario boundaries", () => {
  it("keeps the existing gated route and unchanged current demonstration destinations", () => {
    expect(app).toContain('path: "/partner-room/product-proof/stage-3-operating-layer",  component: PartnerStage3Preview');
    expect(app).toContain("<PartnerAccessGate>");
    expect(preview).toContain("Explore today · Working Proof");
    expect(preview).toContain('href="/partner-room/guest-demo"');
    expect(preview).toContain("href={WORKING_PROOF_PATH}");
    expect(preview).toContain("Experience Stage 3 · Planned simulation");
  });

  it("replaces the Enterprise and café walkthrough without changing today's links", () => {
    expect(scenario).not.toContain("JALDO Enterprise");
    expect(scenario).not.toContain("Standard Recovery");
    expect(preview).not.toContain("Enterprise");
    expect(preview).toContain("Safety intervention belongs earlier");
    expect(preview).toContain("authenticated access controls");
    expect(preview).toContain('href="/partner-room/product-proof/pilot-expansion-preview"');
  });

  it("keeps scenario preview separate from live execution", () => {
    expect(preview).toContain("All cases, signals, confirmations, receipts and outcomes are fictional");
    expect(preview).toContain("not live execution");
    expect(preview).toContain("Costs are modelled, not cash ROI");
    expect(scenario).not.toMatch(/fetch\(|axios|localStorage/);
  });
});