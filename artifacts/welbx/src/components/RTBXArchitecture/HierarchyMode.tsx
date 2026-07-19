/**
 * HierarchyMode — the five-level Core → Travel → OS → Property → Deployment hierarchy.
 * Visually distinguishes RTBX Core, Travel Configuration, and Property Configuration levels.
 */

import type { HierarchyLevel } from "@/data/rtbxArchitecture";
import { ORIGIN_COLORS, T } from "./RTBXArchitecture";

interface HierarchyModeProps {
  levels: HierarchyLevel[];
  heading?: string;
}

/** Indent each level progressively to communicate the nesting */
const INDENT_PX = [0, 16, 32, 48, 48];

export function HierarchyMode({
  levels,
  heading = "Platform Hierarchy",
}: HierarchyModeProps) {
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
          RTBX Intelligence Engine · Platform Hierarchy
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
          One shared platform. Configured for Travel. Deployed for each property.
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
        <span
          style={{
            fontSize: 8.5,
            color: T.dim,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginRight: 4,
          }}
        >
          Layer origin:
        </span>
        {(["RTBX Core", "Travel Configuration", "Property Configuration"] as const).map((origin) => (
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

      {/* Hierarchy levels */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {levels.map((level, i) => {
          const colors = ORIGIN_COLORS[level.origin];
          const indent = INDENT_PX[i] ?? 0;

          return (
            <div
              key={level.id}
              style={{
                marginLeft: indent,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderLeft: `3px solid ${colors.text}`,
              }}
            >
              {/* Level header */}
              <div
                style={{
                  padding: "16px 20px 14px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  {/* Origin badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "1px 7px",
                      background: colors.badge,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 2,
                      fontSize: 7.5,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: colors.text,
                      marginBottom: 8,
                    }}
                  >
                    {level.origin}
                  </div>

                  {/* Level label */}
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 5,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {level.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.muted,
                      lineHeight: 1.65,
                      maxWidth: 560,
                    }}
                  >
                    {level.summary}
                  </div>
                </div>

                {/* Level number */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: colors.badge,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: colors.text,
                    }}
                  >
                    {String(i + 1)}
                  </span>
                </div>
              </div>

              {/* Examples */}
              <div
                style={{
                  padding: "0 20px 14px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {level.examples.map((ex) => (
                  <div
                    key={ex}
                    style={{
                      padding: "4px 10px",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.5)",
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {ex}
                  </div>
                ))}
              </div>

              {/* Connector arrow to next level */}
              {i < levels.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    paddingLeft: 20,
                    paddingBottom: 6,
                    fontSize: 9,
                    color: T.dim,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  ↓ configured as
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
