import { MATURITY_LABELS } from "@/data/travelScenarios";

export const PROOF_TAXONOMY = Object.freeze([
  MATURITY_LABELS["working-proof"],
  MATURITY_LABELS.prototype,
  MATURITY_LABELS.simulation,
  MATURITY_LABELS["connector-ready"],
  MATURITY_LABELS.integrated,
  MATURITY_LABELS.production,
  MATURITY_LABELS.planned,
]);

export const CURRENT_PROOF_BOUNDARY = {
  maturity: MATURITY_LABELS["working-proof"],
  evidence: MATURITY_LABELS.simulation,
  integrations: MATURITY_LABELS.planned,
  notice:
    "This Partner Room is a Working Proof using synthetic scenarios and modelled indicators. It is not an Integrated or Production deployment. No guest communication, staff task, partner activation or emergency action is sent from these demonstrations.",
} as const;

export const WORKING_PROOF_PATH = "/partner-room/guest-demo";
