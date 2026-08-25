import { describe, expect, it } from "vitest";
import { STAGES } from "../pages/partner-room/PartnerGuestDemo";

describe("Guest Demo action branching data", () => {
  it("gives every action a globally unique ID", () => {
    const actions = STAGES.flatMap((stage) => stage.phoneActions);
    const ids = actions.map((action) => action.id);

    expect(ids).toHaveLength(28);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every action complete, action-specific response content", () => {
    for (const stage of STAGES) {
      const confirmations = stage.phoneActions.map((action) => action.confirmation);

      expect(new Set(confirmations).size).toBe(confirmations.length);
      for (const action of stage.phoneActions) {
        expect(action.label.trim(), `${stage.stage} action label`).not.toBe("");
        expect(action.confirmation.trim(), `${action.id} confirmation`).not.toBe("");
        expect(action.rtbxCoordinates.trim(), `${action.id} RTBX coordination`).not.toBe("");
        expect(action.operatorReceives.trim(), `${action.id} operator response`).not.toBe("");
        expect(action.valueCreated.trim(), `${action.id} value outcome`).not.toBe("");
      }
    }
  });

  it("produces different responses for two choices in the same stage", () => {
    const arrival = STAGES.find((stage) => stage.stage === "Arrival");
    const checkIn = arrival?.phoneActions.find((action) => action.id === "arrival-check-in");
    const bags = arrival?.phoneActions.find((action) => action.id === "arrival-bags");

    expect(checkIn).toBeDefined();
    expect(bags).toBeDefined();
    expect(checkIn?.confirmation).not.toBe(bags?.confirmation);
    expect(checkIn?.rtbxCoordinates).not.toBe(bags?.rtbxCoordinates);
    expect(checkIn?.operatorReceives).not.toBe(bags?.operatorReceives);
    expect(checkIn?.valueCreated).not.toBe(bags?.valueCreated);
  });

  it("keeps the welfare decline choice respectful and non-escalating", () => {
    const welfare = STAGES.find((stage) => stage.stage === "Guest Welfare");
    const fine = welfare?.phoneActions.find((action) => action.id === "welfare-fine");

    expect(fine?.confirmation).toMatch(/prompt closes|response is respected/i);
    expect(fine?.confirmation).not.toMatch(/quiet space|staff member/i);
    expect(fine?.confirmation).toMatch(/no automatic escalation/i);
  });

  it("keeps the resolved recovery choice separate from escalation", () => {
    const recovery = STAGES.find((stage) => stage.stage === "Service Recovery");
    const sorted = recovery?.phoneActions.find((action) => action.id === "recovery-sorted");

    expect(sorted?.confirmation).toMatch(/marked resolved|confirmation is captured/i);
    expect(sorted?.confirmation).not.toMatch(/manager escalation/i);
    expect(sorted?.rtbxCoordinates).not.toMatch(/manager escalation|manager timer/i);
  });

  it("keeps receipt delivery separate from generic checkout and rebooking responses", () => {
    const checkout = STAGES.find((stage) => stage.stage === "Checkout");
    const receipt = checkout?.phoneActions.find((action) => action.id === "checkout-receipt");

    expect(receipt?.confirmation).toMatch(/receipt delivery/i);
    expect(receipt?.confirmation).not.toMatch(/look forward to welcoming you back/i);
    expect(receipt?.rtbxCoordinates).toMatch(/receipt-delivery route only/i);
  });
});