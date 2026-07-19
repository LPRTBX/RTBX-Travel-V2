/**
 * CompactMode — small inline badge/label row of the five engine stages.
 * Used as an inline indicator wherever the engine flow needs to be referenced.
 */

import type { EngineStage } from "@/data/rtbxArchitecture";
import { STAGE_COLORS, T } from "./RTBXArchitecture";

interface CompactModeProps {
  stages: EngineStage[];
}

export function CompactMode({ stages }: CompactModeProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 4,
      }}
      role="list"
      aria-label="RTBX Intelligence Engine stages"
    >
      {stages.map((stage, i) => (
        <div
          key={stage.id}
          role="listitem"
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          {/* Stage badge */}
          <div
            title={stage.summary}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${STAGE_COLORS[stage.id]}44`,
              borderTop: `2px solid ${STAGE_COLORS[stage.id]}`,
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: STAGE_COLORS[stage.id],
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: 8,
                color: "rgba(255,255,255,0.25)",
                fontWeight: 600,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {stage.label}
          </div>

          {/* Arrow connector */}
          {i < stages.length - 1 && (
            <span
              aria-hidden="true"
              style={{ fontSize: 9, color: T.faint, userSelect: "none" }}
            >
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
