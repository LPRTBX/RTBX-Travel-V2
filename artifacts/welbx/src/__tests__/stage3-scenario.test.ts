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

  it("labels Enterprise as proposed and prevents decision-free progression", () => {
    expect(scenario).toContain("Proposed concept · not approved roadmap");
    expect(scenario).toContain('disabled={step === 3 && decision === null}');
    expect(scenario).toContain("setDecision(null)");
    expect(scenario).toContain("No real personal information is stored or shared.");
  });

  it("keeps both decision outcomes and evidence explicitly simulated", () => {
    expect(scenario).toContain('decision === "A"');
    expect(scenario).toContain("Multi-property coordination is a planned Stage 3 capability");
    expect(scenario).toContain("no revenue or value measured");
    expect(scenario).toContain("No PMS or task records changed");
    expect(scenario).toContain("Completed in simulation");
    expect(scenario).toContain("Unresolved responsibilities");
  });
});