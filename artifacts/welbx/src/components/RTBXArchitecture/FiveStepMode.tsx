/**
 * FiveStepMode — visual five-step engine with Travel examples.
 * Shows each stage as a card with capabilities and optional Travel examples.
 */

import type { EngineStage } from "@/data/rtbxArchitecture";
import { STAGE_COLORS, ORIGIN_COLORS, T } from "./RTBXArchitecture";

interface FiveStepModeProps {
  stages: EngineStage[];
  heading?: string;
  showTravelExamples?: boolean;
}

export function FiveStepMode({
  stages,
  heading = "The RTBX Intelligence Engine",
  showTravelExamples = true,
}: FiveStepModeProps) {
  return (
    <div>
      {/* Heading */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 8.5,
            letterSpacing: "0.2em",
            color: T.dim,
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          RTBX Intelligence Engine · Five Stages
        </div>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.01em",
            margin: 0,
            marginBottom: 8,
          }}
        >
          {heading}
        </h2>
        <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.65, margin: 0, maxWidth: 640 }}>
          One signal-to-action loop. Every stage is governed; every response has a named human owner.
        </p>
      </div>

      {/* Flow indicator */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, marginBottom: 20 }}>
        {stages.map((stage, i) => (
          <div key={stage.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div
              style={{
                padding: "4px 10px",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: STAGE_COLORS[stage.id],
                background: `${STAGE_COLORS[stage.id]}11`,
                border: `1px solid ${STAGE_COLORS[stage.id]}33`,
              }}
            >
              {stage.label}
            </div>
            {i < stages.length - 1 && (
              <span style={{ fontSize: 9, color: T.faint }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Stage cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {stages.map((stage, i) => (
          <div
            key={stage.id}
            style={{
              padding: "24px 24px",
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${STAGE_COLORS[stage.id]}`,
            }}
          >
            {/* Stage header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `${STAGE_COLORS[stage.id]}18`,
                  border: `1px solid ${STAGE_COLORS[stage.id]}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: STAGE_COLORS[stage.id],
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {stage.label}
                </div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                  {stage.summary}
                </div>
              </div>
            </div>

            {/* Capabilities + Travel examples in a two-column layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: showTravelExamples ? "1fr 1fr" : "1fr",
                gap: 16,
              }}
            >
              {/* Core capabilities */}
              <div>
                <div
                  style={{
                    fontSize: 8,
                    letterSpacing: "0.14em",
                    color: ORIGIN_COLORS["RTBX Core"].text,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      padding: "1px 6px",
                      background: ORIGIN_COLORS["RTBX Core"].badge,
                      border: `1px solid ${ORIGIN_COLORS["RTBX Core"].border}`,
                      borderRadius: 2,
                      fontSize: 7,
                    }}
                  >
                    RTBX Core
                  </span>
                  Core Capabilities
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {stage.coreCapabilities.map((cap) => (
                    <div
                      key={cap}
                      style={{
                        display: "flex",
                        gap: 8,
                        fontSize: 11,
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          color: ORIGIN_COLORS["RTBX Core"].text,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        ·
                      </span>
                      {cap}
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel examples */}
              {showTravelExamples && (
                <div>
                  <div
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.14em",
                      color: ORIGIN_COLORS["Travel Configuration"].text,
                      textTransform: "uppercase",
                      fontWeight: 700,
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        padding: "1px 6px",
                        background: ORIGIN_COLORS["Travel Configuration"].badge,
                        border: `1px solid ${ORIGIN_COLORS["Travel Configuration"].border}`,
                        borderRadius: 2,
                        fontSize: 7,
                      }}
                    >
                      Travel
                    </span>
                    Travel Configuration Examples
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {stage.travelExamples.map((ex) => (
                      <div
                        key={ex}
                        style={{
                          display: "flex",
                          gap: 8,
                          fontSize: 11,
                          color: "rgba(255,255,255,0.55)",
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            color: ORIGIN_COLORS["Travel Configuration"].text,
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          ·
                        </span>
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Outputs */}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
              <span
                style={{
                  fontSize: 8,
                  letterSpacing: "0.12em",
                  color: T.dim,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginRight: 10,
                }}
              >
                Outputs
              </span>
              {stage.outputs.map((out, j) => (
                <span key={out} style={{ fontSize: 10, color: "rgba(255,255,255,0.38)" }}>
                  {out}{j < stage.outputs.length - 1 ? " · " : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
