/**
 * SixLayerMode — the six intelligence layers stacked with descriptions.
 * Visually distinguishes RTBX Core capabilities from Travel configuration examples.
 */

import type { IntelligenceLayer } from "@/data/rtbxArchitecture";
import { LAYER_COLORS, ORIGIN_COLORS, STAGE_COLORS, T } from "./RTBXArchitecture";

interface SixLayerModeProps {
  layers: IntelligenceLayer[];
  heading?: string;
  showTravelExamples?: boolean;
}

export function SixLayerMode({
  layers,
  heading = "Six Intelligence Layers",
  showTravelExamples = true,
}: SixLayerModeProps) {
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
          RTBX Intelligence Engine · Intelligence Layers
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
          Six layers built on RTBX Core, each configured for travel. Every layer has a named human owner at its action boundary.
        </p>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 20,
          padding: "10px 14px",
          background: T.surface,
          border: `1px solid ${T.border}`,
        }}
      >
        <span style={{ fontSize: 8.5, color: T.dim, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 4 }}>
          Origin:
        </span>
        {(["RTBX Core", "Travel Configuration"] as const).map((origin) => (
          <div
            key={origin}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "2px 8px",
              background: ORIGIN_COLORS[origin].badge,
              border: `1px solid ${ORIGIN_COLORS[origin].border}`,
              borderRadius: 2,
              fontSize: 8.5,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: ORIGIN_COLORS[origin].text,
            }}
          >
            {origin}
          </div>
        ))}
      </div>

      {/* Layer cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {layers.map((layer, i) => (
          <div
            key={layer.id}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${LAYER_COLORS[layer.id]}`,
            }}
          >
            {/* Layer header row */}
            <div
              style={{
                padding: "16px 20px 14px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                {/* Layer number */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${LAYER_COLORS[layer.id]}18`,
                    border: `1px solid ${LAYER_COLORS[layer.id]}44`,
                    borderRadius: "50%",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: LAYER_COLORS[layer.id],
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 4,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {layer.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.6, maxWidth: 600 }}>
                    {layer.summary}
                  </div>
                </div>
              </div>

              {/* Primary stage badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  flexShrink: 0,
                  padding: "3px 9px",
                  background: `${STAGE_COLORS[layer.primaryStage]}11`,
                  border: `1px solid ${STAGE_COLORS[layer.primaryStage]}33`,
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: STAGE_COLORS[layer.primaryStage],
                }}
              >
                {layer.primaryStage}
              </div>
            </div>

            {/* Capabilities + Travel examples */}
            <div
              style={{
                padding: "14px 20px 16px",
                display: "grid",
                gridTemplateColumns: showTravelExamples ? "1fr 1fr" : "1fr",
                gap: 16,
              }}
            >
              {/* Shared capabilities — RTBX Core */}
              <div>
                <div
                  style={{
                    fontSize: 7.5,
                    letterSpacing: "0.12em",
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
                      color: ORIGIN_COLORS["RTBX Core"].text,
                      fontSize: 7,
                    }}
                  >
                    RTBX Core
                  </span>
                  <span style={{ color: ORIGIN_COLORS["RTBX Core"].text }}>
                    Shared Capabilities
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {layer.sharedCapabilities.map((cap) => (
                    <div
                      key={cap}
                      style={{
                        display: "flex",
                        gap: 8,
                        fontSize: 10.5,
                        color: "rgba(255,255,255,0.58)",
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
                      fontSize: 7.5,
                      letterSpacing: "0.12em",
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
                        color: ORIGIN_COLORS["Travel Configuration"].text,
                        fontSize: 7,
                      }}
                    >
                      Travel
                    </span>
                    <span style={{ color: ORIGIN_COLORS["Travel Configuration"].text }}>
                      Travel Configuration
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {layer.travelExamples.map((ex) => (
                      <div
                        key={ex}
                        style={{
                          display: "flex",
                          gap: 8,
                          fontSize: 10.5,
                          color: "rgba(255,255,255,0.5)",
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
          </div>
        ))}
      </div>
    </div>
  );
}
