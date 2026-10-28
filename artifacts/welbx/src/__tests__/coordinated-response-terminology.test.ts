import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const route = "/partner-room/product-proof/stage-3-operating-layer";

describe("Coordinated Response visitor language", () => {
  it("keeps approved headline, supporting copy and simulated capability boundary", () => {
    const page = read("src/pages/partner-room/PartnerStage3Preview.tsx");
    expect(page).toContain("When pressure builds, the whole hotel responds together.");
    expect(page).toContain("Connect guest needs, staff capacity, room readiness and safety signals. Give each team a clear next action, keep decisions with authorised people, and verify what happened.");
    expect(page).toContain("Fictional simulations of planned coordination");
    expect(page).toContain("No live integration, message, task");
    expect(page).toContain("See the hotel respond under pressure");
  });

  it("uses named scenarios without changing their selectors or bookmarked route", () => {
    const selectors = read("src/pages/partner-room/Stage3PeakExperience.tsx");
    expect(selectors).toContain('aria-label="Choose a Coordinated Response scenario"');
    expect(selectors).toContain(">Peak-pressure response</button>");
    expect(selectors).toContain(">Coordination across hotels</button>");
    expect(selectors).toContain('data-testid="scenario-portfolio-disruption"');
    expect(read("src/App.tsx")).toContain(route);
    const publicPage = read("server/public.html");
    expect(publicPage).toContain("See the hotel respond under pressure");
    expect(publicPage).toContain("Coordination across hotels");
    expect(publicPage).not.toContain("Stage 3");
    expect(publicPage).toContain("stage-3-operating-layer%3Fscenario%3Dportfolio");
  });

  it("keeps genuine numbered rollout phases explicitly about deployment", () => {
    const pilot = read("src/data/travelPilotModel.ts");
    expect(pilot).toContain("Deployment phase 3 — Expand properties");
    expect(read("src/pages/partner-room/PartnerPilotExpansionPreview.tsx")).toContain("Deployment phase 3 — Coordination across hotels");
  });
});
