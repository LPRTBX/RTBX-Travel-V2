// The configuration this workspace runs.
//
// It is Core's published practical-support configuration (travel-practical-support@1.0.0) plus ONE extra opening event type,
// `proactive.checkin-offered`, so a request can be opened from system signals before the guest has asked. Nothing else is
// changed: no rule, role, action, deadline, link or recognition wording. The result is validated by Core's own strict
// loader (loadConfiguration), so Core, not this file, decides whether it is acceptable.
//
// Ownership: this is a REVIEW-ONLY derived configuration. Core's own configuration has no proactive opening event; adding
// one belongs to Core's owners (see CORE-GAPS.md). Nothing here is, or claims to be, a Core-published configuration.
import { loadConfiguration, type DeploymentConfiguration } from "@workspace/jaldo-orchestration";
import { TRAVEL_PRACTICAL_SUPPORT_CONFIGURATION } from "@workspace/jaldo-orchestration/deployments";

export const PROACTIVE_EVENT_TYPE = "proactive.checkin-offered";
export const DERIVED_ID = "travel-practical-support-proactive-review";
export const DERIVED_VERSION = "0.1.0";

const base = TRAVEL_PRACTICAL_SUPPORT_CONFIGURATION;
const opener = base.events.find((e) => e.effect === "open-request")!;

export const DERIVED_CONFIGURATION = {
  ...base,
  id: DERIVED_ID,
  version: DERIVED_VERSION,
  events: [...base.events, { ...opener, type: PROACTIVE_EVENT_TYPE }],
};

export function loadDerived(): DeploymentConfiguration { return loadConfiguration(DERIVED_CONFIGURATION); }
/** What differs from Core's configuration, stated so a reviewer can check it. */
export const DERIVATION_NOTE = `Core's travel-practical-support@${base.version} plus one opening event type (${PROACTIVE_EVENT_TYPE}) with the same purpose, classification and permitted context as the guest's own opening event. No other change.`;
