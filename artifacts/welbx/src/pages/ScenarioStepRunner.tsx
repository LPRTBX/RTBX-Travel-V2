import { useState } from "react";
import { useRoute, Link } from "wouter";
import { SCENARIOS } from "@/data/scenarios";
import type { ChainStep } from "@/data/scenarios";

const P = {
  bg:      "hsl(220 13% 5%)",
  navy:    "hsl(220 16% 9%)",
  navy2:   "hsl(220 14% 12%)",
  navy3:   "hsl(220 13% 16%)",
  border:  "hsl(220 13% 18%)",
  amber:   "#c9a84c",
  amberDim:"rgba(201,168,76,0.15)",
  white:   "#f8f9fb",
  muted:   "hsl(220 10% 55%)",
  dimmed:  "hsl(220 10% 35%)",
  green:   "#10b981",
  greenDim:"rgba(16,185,129,0.12)",
  blue:    "#3b82f6",
  blueDim: "rgba(59,130,246,0.12)",
  violet:  "#8b5cf6",
  violetDim:"rgba(139,92,246,0.12)",
  cyan:    "#06b6d4",
  cyanDim: "rgba(6,182,212,0.12)",
  red:     "#ef4444",
  redDim:  "rgba(239,68,68,0.12)",
  orange:  "#f59e0b",
  orangeDim:"rgba(245,158,11,0.12)",
};

const STAGE_COLOR: Record<string, string> = {
  SIGNAL:        P.blue,
  MOMENT:        P.violet,
  DECISION:      P.amber,
  COMMUNICATION: P.cyan,
  ACTION:        P.orange,
  OUTCOME:       P.green,
  LEARNING:      "#a78bfa",
};

const FIELDS: { key: keyof ChainStep; label: string; icon: string; color: string; dimColor: string }[] = [
  { key: "detected",    label: "What WELBX Detected",   icon: "⬡",  color: P.blue,   dimColor: P.blueDim },
  { key: "whyMatters",  label: "Why It Matters",         icon: "◈",  color: P.amber,  dimColor: P.amberDim },
  { key: "whatHappens", label: "What Should Happen",     icon: "▷",  color: P.violet, dimColor: P.violetDim },
  { key: "responsible", label: "Who Is Responsible",     icon: "◉",  color: P.cyan,   dimColor: P.cyanDim },
  { key: "success",     label: "What Success Looks Like",icon: "◎",  color: P.green,  dimColor: P.greenDim },
  { key: "couldFail",   label: "What Could Fail",        icon: "⊘",  color: P.red,    dimColor: P.redDim },
];

const URGENCY_COLOR: Record<string, string> = {
  CRITICAL: P.red,
  HIGH:     P.orange,
  MEDIUM:   P.amber,
  LOW:      P.muted,
};

function UrgencyBadge({ urgency }: { urgency: string }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
      color: URGENCY_COLOR[urgency] ?? P.muted,
      border: `1px solid ${URGENCY_COLOR[urgency] ?? P.muted}`,
      borderRadius: 3, padding: "2px 6px",
    }}>{urgency}</span>
  );
}

function StepDot({ idx, current, label, color, done }: {
  idx: number; current: number; label: string; color: string; done: boolean;
}) {
  const isActive = idx === current;
  const isPast   = idx < current;
  return (
    <div
      style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "7px 0", cursor: "default",
        opacity: isPast ? 0.55 : isActive ? 1 : 0.35,
      }}
    >
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          background: isActive ? color : isPast ? "transparent" : "transparent",
          border: `2px solid ${isActive ? color : isPast ? color : P.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}>
          {isPast && (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {isActive && (
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: P.bg }} />
          )}
          {!isActive && !isPast && (
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: P.dimmed }} />
          )}
        </div>
        {idx < 6 && (
          <div style={{
            width: 2, height: 24, background: isPast ? color : P.border,
            margin: "3px auto 0", borderRadius: 1, opacity: isPast ? 0.4 : 0.3,
          }} />
        )}
      </div>
      <div style={{ paddingTop: 1 }}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
          color: isActive ? color : isPast ? color : P.dimmed,
          marginBottom: 1,
        }}>{label}</div>
        <div style={{ fontSize: 10, color: isActive ? P.white : P.dimmed }}>
          Step {idx + 1} of 7
        </div>
      </div>
    </div>
  );
}

function FieldCard({ field, value }: {
  field: typeof FIELDS[0]; value: string;
}) {
  return (
    <div style={{
      background: P.navy2,
      border: `1px solid ${P.border}`,
      borderRadius: 8,
      padding: "16px 18px",
      display: "flex", flexDirection: "column", gap: 10,
      borderTop: `2px solid ${field.color}`,
      transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          fontSize: 14, color: field.color,
          background: field.dimColor,
          width: 26, height: 26, borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>{field.icon}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
          color: field.color, textTransform: "uppercase",
        }}>{field.label}</span>
      </div>
      <p style={{
        margin: 0, fontSize: 12.5, lineHeight: 1.7,
        color: P.white, fontWeight: 400,
      }}>{value}</p>
    </div>
  );
}

export default function ScenarioStepRunner() {
  const [, params] = useRoute("/scenario-replay-lab/:id");
  const scenarioId = params?.id ?? "SCN-001";
  const scenario = SCENARIOS.find(s => s.id === scenarioId) ?? SCENARIOS[0];

  const [stepIdx, setStepIdx] = useState(0);

  const step = scenario.chain[stepIdx];
  const stageColor = STAGE_COLOR[step.stage] ?? P.amber;
  const isFirst = stepIdx === 0;
  const isLast  = stepIdx === scenario.chain.length - 1;

  function prev() { if (!isFirst) setStepIdx(i => i - 1); }
  function next() { if (!isLast)  setStepIdx(i => i + 1); }

  return (
    <div style={{
      marginLeft: 224, minHeight: "100vh",
      background: P.bg, color: P.white,
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${P.border}`,
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 52, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/scenario-replay-lab"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              color: P.muted, textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            SCENARIO LAB
          </Link>
          <span style={{ color: P.border }}>›</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: P.dimmed }}>
            {scenario.id}
          </span>
          <span style={{ color: P.border }}>›</span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            color: stageColor, padding: "2px 7px",
            background: `${stageColor}1a`, borderRadius: 3,
            border: `1px solid ${stageColor}40`,
          }}>
            GUIDED TEST
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <UrgencyBadge urgency={scenario.urgency} />
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
            color: P.muted, padding: "2px 8px",
            border: `1px solid ${P.border}`, borderRadius: 3,
          }}>
            {scenario.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left: Step Timeline */}
        <div style={{
          width: 200, flexShrink: 0,
          borderRight: `1px solid ${P.border}`,
          padding: "24px 20px",
          overflowY: "auto",
        }}>
          <div style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
            color: P.dimmed, marginBottom: 16, textTransform: "uppercase",
          }}>BEHAVIOURAL CHAIN</div>
          {scenario.chain.map((s, i) => (
            <div key={s.stage} onClick={() => setStepIdx(i)} style={{ cursor: "pointer" }}>
              <StepDot
                idx={i}
                current={stepIdx}
                label={s.stage}
                color={STAGE_COLOR[s.stage] ?? P.amber}
                done={i < stepIdx}
              />
            </div>
          ))}
        </div>

        {/* Right: Step Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px 100px" }}>

          {/* Stage badge + scenario name */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.16em",
                color: stageColor, background: `${stageColor}1a`,
                border: `1px solid ${stageColor}40`,
                borderRadius: 4, padding: "3px 10px",
              }}>{step.stage}</span>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                color: P.dimmed,
              }}>STEP {stepIdx + 1} / {scenario.chain.length}</span>
            </div>

            <h1 style={{
              margin: "0 0 6px", fontSize: 24, fontWeight: 700,
              color: P.white, letterSpacing: "-0.02em",
            }}>{scenario.name}</h1>
            <p style={{ margin: 0, fontSize: 13, color: P.muted, lineHeight: 1.6 }}>
              {scenario.summary}
            </p>
          </div>

          {/* Step title and detail */}
          <div style={{
            background: P.navy,
            border: `1px solid ${P.border}`,
            borderLeft: `3px solid ${stageColor}`,
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 24,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              color: P.dimmed, marginBottom: 6,
            }}>STEP TITLE</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: P.white, marginBottom: 6 }}>
              {step.label}
            </div>
            <div style={{ fontSize: 12, color: P.muted, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
              {step.detail}
            </div>
          </div>

          {/* 6 Field Cards — 2 column grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 28,
          }}>
            {FIELDS.map(f => (
              <FieldCard
                key={f.key}
                field={f}
                value={String(step[f.key] ?? "")}
              />
            ))}
          </div>

          {/* Output / test result */}
          <div style={{
            background: step.pass ? P.greenDim : P.redDim,
            border: `1px solid ${step.pass ? P.green : P.red}30`,
            borderRadius: 8, padding: "12px 18px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
              color: step.pass ? P.green : P.red,
              background: `${step.pass ? P.green : P.red}25`,
              padding: "3px 8px", borderRadius: 3,
            }}>{step.pass ? "PASS" : "FLAGGED"}</span>
            <span style={{
              fontSize: 11.5, color: P.muted,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}>{step.output}</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div style={{
        position: "fixed",
        bottom: 0, left: 224, right: 0,
        background: P.navy,
        borderTop: `1px solid ${P.border}`,
        padding: "14px 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 100,
      }}>
        {/* Progress dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {scenario.chain.map((s, i) => (
            <div
              key={i}
              onClick={() => setStepIdx(i)}
              style={{
                width: i === stepIdx ? 24 : 8,
                height: 8, borderRadius: 4,
                background: i === stepIdx
                  ? stageColor
                  : i < stepIdx
                  ? `${STAGE_COLOR[scenario.chain[i].stage]}60`
                  : P.border,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>

        {/* Step label */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: stageColor, marginBottom: 2,
          }}>{step.stage}</div>
          <div style={{ fontSize: 11, color: P.muted }}>
            {step.label}
          </div>
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={prev}
            disabled={isFirst}
            style={{
              padding: "8px 20px", borderRadius: 5,
              border: `1px solid ${P.border}`,
              background: "transparent",
              color: isFirst ? P.dimmed : P.white,
              fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
              cursor: isFirst ? "default" : "pointer",
              opacity: isFirst ? 0.4 : 1,
              transition: "all 0.15s",
            }}
          >
            ← PREVIOUS
          </button>
          {!isLast ? (
            <button
              onClick={next}
              style={{
                padding: "8px 24px", borderRadius: 5,
                border: `1px solid ${stageColor}`,
                background: `${stageColor}18`,
                color: stageColor,
                fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              NEXT →
            </button>
          ) : (
            <Link
              href="/scenario-replay-lab"
              style={{
                padding: "8px 20px", borderRadius: 5,
                border: `1px solid ${P.green}`,
                background: `${P.green}18`,
                color: P.green,
                fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                cursor: "pointer", textDecoration: "none",
                display: "inline-block",
              }}
            >
              ✓ COMPLETE
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
