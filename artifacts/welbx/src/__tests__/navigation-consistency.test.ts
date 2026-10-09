import { describe, expect, it } from "vitest";
import { NAV_GROUPS } from "../components/PartnerRoomLayout";

const EXPECTED_NAVIGATION = [
  {
    label: "Start",
    items: [
      ["Partner Room", "/partner-room"],
      ["Guided Route", "/partner-room#guided-route"],
      ["Overview", "/partner-room/overview"],
      ["Operator Brief", "/partner-room/operator-brief"],
      ["Next Step", "/partner-room/next-step"],
    ],
  },
  {
    label: "Platform",
    items: [
      ["Architecture Lab", "/partner-room/architecture-lab"],
      ["Operating Model", "/partner-room/operating-model"],
      ["Travel Intelligence", "/partner-room/travel-intelligence"],
      ["Travel Operating Systems", "/partner-room/travel-operating-systems"],
      ["Integration", "/partner-room/integration-brief"],
    ],
  },
  {
    label: "Configure and Execute",
    items: [
      ["Build & Configure", "/partner-room/build-configure"],
      ["Execution Centre", "/partner-room/operations"],
      ["Generated Evidence", "/partner-room/operations#generated-evidence"],
      ["Decision Spine", "/partner-room/decision-spine"],
      ["Communications", "/partner-room/travel-ai-comms"],
    ],
  },
  {
    label: "Proof",
    items: [
      ["Simulation Lab", "/partner-room/operations?view=simulation"],
      ["Operating Evolution", "/partner-room/operating-evolution"],
      ["Value Calculator", "/partner-room/proof-calculator"],
      ["Scenario Impact Map", "/partner-room/impact-map"],
      ["Product Proof", "/partner-room/product-proof"],
      ["Validation", "/partner-room/validation"],
      ["Static Examples: Outcomes and Value", "/partner-room/operations#outcome-ledger"],
      ["Guest View", "/partner-room/guest-demo"],
      ["Operator View", "/partner-room/operator-demo"],
      ["Dual View", "/partner-room/dual-view-demo"],
    ],
  },
  {
    label: "Pilot and Partnership",
    items: [
      ["Stage 3 Operating Layer", "/partner-room/product-proof/stage-3-operating-layer"],
      ["Pilot Model", "/partner-room/pilot-model"],
      ["Deployment", "/partner-room/rollout-model"],
      ["Partner Ecosystem", "/partner-room/partner-ecosystem"],
      ["Resource Library", "/partner-room/brief-library"],
    ],
  },
] as const;

/** Every destination the menu offered before Phase 3; none may be lost. */
const PREVIOUS_DESTINATIONS = [
  "/partner-room", "/partner-room/overview", "/partner-room/operator-brief", "/partner-room/next-step",
  "/partner-room/architecture-lab", "/partner-room/operating-model", "/partner-room/travel-intelligence",
  "/partner-room/travel-operating-systems", "/partner-room/integration-brief", "/partner-room/build-configure",
  "/partner-room/operations", "/partner-room/decision-spine", "/partner-room/travel-ai-comms",
  "/partner-room/operations#outcome-ledger", "/partner-room/operating-evolution", "/partner-room/impact-map",
  "/partner-room/product-proof", "/partner-room/validation", "/partner-room/operations?view=simulation",
  "/partner-room/guest-demo", "/partner-room/operator-demo", "/partner-room/dual-view-demo",
  "/partner-room/pilot-model", "/partner-room/rollout-model", "/partner-room/partner-ecosystem", "/partner-room/brief-library",
];

describe("Partner Room navigation model", () => {
  it("keeps exactly the five approved navigation groups and destinations", () => {
    expect(NAV_GROUPS.map((group) => ({
      label: group.label,
      items: group.items.map((item) => [item.label, item.path]),
    }))).toEqual(EXPECTED_NAVIGATION);
  });

  it("keeps direct access to every destination the menu offered before, each listed once", () => {
    const paths = NAV_GROUPS.flatMap((group) => group.items).map((item) => item.path);
    expect(paths).toEqual(expect.arrayContaining(PREVIOUS_DESTINATIONS));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("keeps commercially restricted routes out of navigation", () => {
    const pilotGroup = NAV_GROUPS.find((group) => group.label === "Pilot and Partnership");

    expect(NAV_GROUPS.flatMap((group) => group.items).map((item) => item.path))
      .not.toContain("/partner-room/commercial");
    expect(pilotGroup?.items.map((item) => item.label))
      .not.toContain("Commercial Pathway");
    expect(NAV_GROUPS.flatMap((group) => group.items).map((item) => item.path))
      .not.toContain("/partner-room/commercial-unit");
  });
});