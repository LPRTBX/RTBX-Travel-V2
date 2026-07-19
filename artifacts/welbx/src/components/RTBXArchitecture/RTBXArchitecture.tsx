/**
 * RTBXArchitecture component — four render modes, all data from rtbxArchitecture.ts.
 */

import { ENGINE_STAGES, INTELLIGENCE_LAYERS, PLATFORM_HIERARCHY } from "@/data/rtbxArchitecture";
import type { CapabilityOrigin } from "@/data/rtbxArchitecture";
import { CompactMode } from "./CompactMode";
import { FiveStepMode } from "./FiveStepMode";
import { SixLayerMode } from "./SixLayerMode";
import { HierarchyMode } from "./HierarchyMode";

export type RTBXArchitectureMode = "compact" | "five-step" | "six-layer" | "hierarchy";

export interface RTBXArchitectureProps {
  mode: RTBXArchitectureMode;
  /** Optional: override heading shown above the component */
  heading?: string;
  /** Optional: show Travel examples in five-step and six-layer modes (default: true) */
  showTravelExamples?: boolean;
}

export function RTBXArchitecture({
  mode,
  heading,
  showTravelExamples = true,
}: RTBXArchitectureProps) {
  if (mode === "compact") {
    return <CompactMode stages={ENGINE_STAGES} />;
  }

  if (mode === "five-step") {
    return (
      <FiveStepMode
        stages={ENGINE_STAGES}
        heading={heading}
        showTravelExamples={showTravelExamples}
      />
    );
  }

  if (mode === "six-layer") {
    return (
      <SixLayerMode
        layers={INTELLIGENCE_LAYERS}
        heading={heading}
        showTravelExamples={showTravelExamples}
      />
    );
  }

  if (mode === "hierarchy") {
    return (
      <HierarchyMode
        levels={PLATFORM_HIERARCHY}
        heading={heading}
      />
    );
  }

  return null;
}

// ── Shared design tokens used by all sub-components ──────────────────────────

/** Colour treatment for CapabilityOrigin — matches the app's dark-gold design system */
export const ORIGIN_COLORS: Record<CapabilityOrigin, { border: string; bg: string; text: string; badge: string }> = {
  "RTBX Core": {
    border: "rgba(201,168,76,0.35)",
    bg: "rgba(201,168,76,0.05)",
    text: "#c9a84c",
    badge: "rgba(201,168,76,0.15)",
  },
  "Travel Configuration": {
    border: "rgba(59,130,246,0.35)",
    bg: "rgba(59,130,246,0.05)",
    text: "#3b82f6",
    badge: "rgba(59,130,246,0.15)",
  },
  "Property Configuration": {
    border: "rgba(167,139,250,0.35)",
    bg: "rgba(167,139,250,0.05)",
    text: "#a78bfa",
    badge: "rgba(167,139,250,0.15)",
  },
};

/** Stage accent colours (keyed by EngineStageId) */
export const STAGE_COLORS: Record<string, string> = {
  connect:    "#3b82f6",
  understand: "#10b981",
  decide:     "#c9a84c",
  act:        "#f97316",
  learn:      "#a78bfa",
};

/** Layer accent colours (keyed by IntelligenceLayerId) */
export const LAYER_COLORS: Record<string, string> = {
  signal:     "#3b82f6",
  moment:     "#10b981",
  governance: "#c9a84c",
  decision:   "#f97316",
  comms:      "#22d3ee",
  outcome:    "#a78bfa",
};

/** Shared inline-style tokens */
export const T = {
  gold:    "#c9a84c",
  muted:   "rgba(255,255,255,0.5)",
  dim:     "rgba(255,255,255,0.22)",
  faint:   "rgba(255,255,255,0.1)",
  surface: "rgba(255,255,255,0.02)",
  border:  "rgba(255,255,255,0.06)",
};
