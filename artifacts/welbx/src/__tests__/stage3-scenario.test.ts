import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const preview = source("src/pages/partner-room/PartnerStage3Preview.tsx");
const experience = source("src/pages/partner-room/Stage3PeakExperience.tsx");
const scenario = source("src/components/partner-room/PeakPressureScenario.tsx");
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

  it("replaces the old walkthrough with one connected peak-pressure and portfolio experience", () => {
    expect(existsSync(join(process.cwd(), "src/pages/partner-room/Stage3ScenarioExperience.tsx"))).toBe(false);
    expect(preview).toContain("<Stage3PeakExperience />");
    expect(preview).not.toContain("<PortfolioCoordination");
    expect(experience).toContain("<PeakPressureScenario");
    expect(experience).toContain("<PortfolioCoordination peak={");
    expect(experience).toContain("...portfolioSummary(state)");
  });

  it("separates approval, execution and verified outcome, and keeps everything synthetic and unsent", () => {
    for (const heading of ["Approval ·", "Execution ·", "Verified outcome ·", "Learning for the next peak period"]) expect(scenario).toContain(heading);
    expect(scenario).toContain("Approval allows these actions; it does not complete them.");
    expect(scenario).toContain("A result that was not measured stays unconfirmed.");
    expect(scenario).toContain("<strong>Synthetic data.</strong>");
    expect(scenario).toContain("held, not sent");
    expect(scenario).toContain("This is not a diagnosis and it is not about any individual.");
    expect(scenario).toContain("support details stay with the People &amp; Culture Lead");
  });

  it("never labels or diagnoses a person in the visible copy", () => {
    expect(scenario).not.toMatch(/\b(burn(ed|t)?[- ]?out|stress(ed)?|anxious|depress|exhaust|fatigu|diagnosed|at[- ]risk (employee|staff))\b/i);
  });

  it("keeps the retained guest-disruption scenario separate and mounted without resurrecting the old shell", () => {
    const portfolio = source("src/components/partner-room/PortfolioDisruptionScenario.tsx");
    expect(experience).toContain('useState<"peak" | "portfolio">("peak")');
    expect(experience).toContain('data-testid="scenario-portfolio-disruption"');
    expect(experience).toContain('hidden={scenario !== "peak"}');
    expect(experience).toContain('hidden={scenario !== "portfolio"}');
    expect(experience).toContain("<PortfolioDisruptionScenario />");
    expect(portfolio).toContain("useReducer(portfolioReducer, undefined, initialPortfolio)");
    expect(portfolio).not.toContain("setState");
    expect(portfolio).not.toMatch(/fetch\(|localStorage|sessionStorage/);
    expect(existsSync(join(process.cwd(), "src/pages/partner-room/stage3-scenario.css"))).toBe(false);
    expect(preview).toContain('hidden={view !== "stage3"}');
    expect(portfolio).toContain("OPEN: one booking remains with Alex");
    expect(portfolio).toContain("no cash ROI is claimed");
  });
});
