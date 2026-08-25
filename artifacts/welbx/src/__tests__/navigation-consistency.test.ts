import { describe, expect, it } from "vitest";
import { NAV_GROUPS } from "../components/PartnerRoomLayout";

const EXPECTED_NAVIGATION = [
  {
    label: "Start",
    items: [
      ["Partner Room", "/partner-room"],
      ["Overview", "/partner-room/overview"],
      ["Operator Brief", "/partner-room/operator-brief"],
      ["Next Step", "/partner-room/next-step"],
    ],
  },
  {
    label: "Platform",
    items: [
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
      ["Decision Spine", "/partner-room/decision-spine"],
      ["Communications", "/partner-room/travel-ai-comms"],
      ["Evidence and Outcomes", "/partner-room/operations#outcome-ledger"],
    ],
  },
  {
    label: "Proof",
    items: [
      ["Product Proof", "/partner-room/product-proof"],
      ["Validation", "/partner-room/validation"],
      ["Guest View", "/partner-room/guest-demo"],
      ["Operator View", "/partner-room/operator-demo"],
      ["Dual View", "/partner-room/dual-view-demo"],
    ],
  },
  {
    label: "Pilot and Partnership",
    items: [
      ["Pilot Model", "/partner-room/pilot-model"],
      ["Deployment", "/partner-room/rollout-model"],
      ["Partner Ecosystem", "/partner-room/partner-ecosystem"],
      ["Commercial Pathway", "/partner-room/commercial"],
      ["Resource Library", "/partner-room/brief-library"],
    ],
  },
] as const;

describe("Partner Room navigation model", () => {
  it("keeps exactly the five approved navigation groups and destinations", () => {
    expect(NAV_GROUPS.map((group) => ({
      label: group.label,
      items: group.items.map((item) => [item.label, item.path]),
    }))).toEqual(EXPECTED_NAVIGATION);
  });

  it("uses the canonical Commercial Pathway route", () => {
    const pilotGroup = NAV_GROUPS.find((group) => group.label === "Pilot and Partnership");
    const commercialPathway = pilotGroup?.items.find((item) => item.label === "Commercial Pathway");

    expect(commercialPathway?.path).toBe("/partner-room/commercial");
    expect(NAV_GROUPS.flatMap((group) => group.items).map((item) => item.path))
      .not.toContain("/partner-room/commercial-unit");
  });
});