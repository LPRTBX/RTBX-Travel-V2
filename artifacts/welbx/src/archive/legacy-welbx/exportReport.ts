import { SCENARIOS, type Scenario } from "@/data/scenarios";
import { COMPARISONS, DIMENSIONS } from "@/data/comparisons";
import { SCORECARD_DEFAULTS } from "@/data/scorecardDefaults";
import { loadScorecard } from "@/pages/ScenarioScorecard";

/* ─── Criterion definitions ──────────────────────────────────── */
const CRITERIA = [
  { key: "signalAccuracy",          label: "Signal Accuracy" },
  { key: "momentClassification",    label: "Moment Classification" },
  { key: "decisionUsefulness",      label: "Decision Usefulness" },
  { key: "communicationRelevance",  label: "Communication Relevance" },
  { key: "operationalPracticality", label: "Operational Practicality" },
  { key: "guestExperienceImpact",   label: "Guest Experience Impact" },
  { key: "staffAdoptionLikelihood", label: "Staff Adoption Likelihood" },
  { key: "outcomeVisibility",       label: "Outcome Visibility" },
  { key: "learningCaptured",        label: "Learning Captured" },
  { key: "overallValue",            label: "Overall Value" },
];

const IMPROVEMENT_SUGGESTIONS: Record<string, string> = {
  signalAccuracy:          "Review signal detection thresholds to reduce false negatives. Expand sensor integration points to increase early-warning coverage.",
  momentClassification:    "Refine moment classification confidence thresholds. Add more granular urgency tiers to improve precision under ambiguous conditions.",
  decisionUsefulness:      "Improve decision specificity by enriching playbook rules with contextual conditions. Test decision output with operations team before live pilot.",
  communicationRelevance:  "Audit recipient targeting logic. Ensure all communication templates are role-specific, time-sensitive, and concise enough to act on.",
  operationalPracticality: "Validate each chain step against actual department capacity. Consult heads of department on execution feasibility before pilot.",
  guestExperienceImpact:   "Increase guest-facing touchpoints within the chain. Ensure recovery gestures match the guest tier and occasion context.",
  staffAdoptionLikelihood: "Simplify staff notification format. Schedule role-based onboarding sessions before go-live to reduce adoption friction.",
  outcomeVisibility:       "Introduce mandatory closed-loop confirmation after each chain completion. Add real-time resolution tracking to the duty manager interface.",
  learningCaptured:        "Strengthen learning capture by adding post-resolution review triggers and automated pattern update workflows.",
  overallValue:            "Reassess the scenario's operational priority. Ensure the benefit of WELBX intervention is communicated clearly to all departmental stakeholders.",
};

/* ─── Helpers ────────────────────────────────────────────────── */
function statusFor(total: number): { label: string; color: string; bg: string } {
  if (total >= 85) return { label: "Strong Validation", color: "#10b981", bg: "#d1fae5" };
  if (total >= 70) return { label: "Needs Refinement",  color: "#d97706", bg: "#fef3c7" };
  return              { label: "Not Ready",             color: "#dc2626", bg: "#fee2e2" };
}

function urgencyColor(u: string): string {
  if (u === "CRITICAL") return "#dc2626";
  if (u === "HIGH")     return "#d97706";
  if (u === "MEDIUM")   return "#c9a84c";
  return "#6b7280";
}

function scoreBar(score: number, max = 10): string {
  const pct = (score / max) * 100;
  const col = score >= 8 ? "#10b981" : score >= 5 ? "#c9a84c" : "#dc2626";
  return `
    <div style="display:flex;align-items:center;gap:8px">
      <div style="flex:1;height:5px;background:#e5e7eb;border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${col};border-radius:3px"></div>
      </div>
      <span style="font-size:13px;font-weight:700;color:${col};min-width:16px;text-align:right">${score === 0 ? "—" : score}</span>
    </div>`;
}

/* ─── Base print styles ──────────────────────────────────────── */
const BASE_STYLES = `
  @page { size: A4 landscape; margin: 14mm 16mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    background: #ffffff;
    color: #1a1f2e;
    font-size: 10px;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page { page-break-before: always; padding: 0; }
  .page:first-child { page-break-before: avoid; }
  h1 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #1a1f2e; }
  h2 { font-size: 13px; font-weight: 700; color: #1a1f2e; margin-bottom: 10px; }
  h3 { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; }
  td, th { padding: 7px 10px; text-align: left; }
  th { background: #f9fafb; font-size: 8px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #6b7280; }
  .amber { color: #c9a84c; }
  .muted { color: #6b7280; }
  .pill {
    display: inline-block; font-size: 8px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 2px 8px; border-radius: 3px;
  }
  .section { margin-bottom: 20px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 14px; }
`;

/* ─── Report header ──────────────────────────────────────────── */
function reportHeader(sc: Scenario, total: number): string {
  const st = statusFor(total);
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;padding-bottom:12px;margin-bottom:18px;border-bottom:2px solid #c9a84c">
      <div>
        <div style="font-size:8px;font-weight:700;letter-spacing:0.18em;color:#c9a84c;text-transform:uppercase;margin-bottom:4px">
          WELBX TRAVEL OPERATING LAYER · THE GRAND MERIDIAN, LONDON
        </div>
        <h1>${sc.name}</h1>
        <div style="font-size:10px;color:#6b7280;margin-top:4px;max-width:560px">${sc.summary}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;padding-left:24px">
        <div style="font-size:8px;color:#6b7280;margin-bottom:6px">${sc.id} · ${dateStr}</div>
        <div style="display:flex;align-items:center;gap:8px;justify-content:flex-end;margin-bottom:4px">
          <span class="pill" style="color:${urgencyColor(sc.urgency)};border:1px solid ${urgencyColor(sc.urgency)}40;background:${urgencyColor(sc.urgency)}15">${sc.urgency}</span>
          <span class="pill" style="color:#6b7280;border:1px solid #e5e7eb;background:#f9fafb">${sc.category}</span>
        </div>
        <div class="pill" style="color:${st.color};background:${st.bg};font-size:9px;padding:3px 10px">${st.label} · ${total}/100</div>
      </div>
    </div>`;
}

/* ─── Comparison section ─────────────────────────────────────── */
function comparisonSection(scenarioId: string): string {
  const comp = COMPARISONS[scenarioId];
  if (!comp) return "";

  const rows = DIMENSIONS.map(d => {
    const row = comp[d.key];
    const deltaColor = row.delta === "major" ? "#10b981" : row.delta === "moderate" ? "#d97706" : "#6b7280";
    return `
      <tr>
        <td style="font-weight:600;font-size:10px;width:140px;border-right:1px solid #e5e7eb">
          <div>${d.label}</div>
          <span style="font-size:7px;font-weight:700;color:${deltaColor};letter-spacing:0.1em;text-transform:uppercase;background:${deltaColor}18;padding:1px 5px;border-radius:2px">${row.delta}</span>
        </td>
        <td style="background:#fef2f2;color:#b91c1c;font-size:9.5px;border-right:1px solid #e5e7eb;width:45%">${row.traditional}</td>
        <td style="background:#f0fdf4;color:#166534;font-size:9.5px;width:45%">${row.welbx}</td>
      </tr>`;
  }).join("");

  return `
    <div class="section">
      <h3>Traditional vs. WELBX Response</h3>
      <table style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden">
        <thead>
          <tr>
            <th>Dimension</th>
            <th style="background:#fef2f2;color:#b91c1c">Traditional Hotel Response</th>
            <th style="background:#f0fdf4;color:#166534">WELBX Response</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/* ─── Chain section ──────────────────────────────────────────── */
function chainSection(sc: Scenario): string {
  const stageColors: Record<string, string> = {
    SIGNAL: "#3b82f6", MOMENT: "#c9a84c", DECISION: "#a78bfa",
    COMMUNICATION: "#22d3ee", ACTION: "#10b981", OUTCOME: "#f59e0b", LEARNING: "#6b7280",
  };
  const rows = sc.chain.map((step, i) => {
    const col = stageColors[step.stage] ?? "#6b7280";
    const passColor = step.pass ? "#10b981" : "#d97706";
    const passBg = step.pass ? "#d1fae5" : "#fef3c7";
    return `
      <tr style="border-top:1px solid #e5e7eb">
        <td style="width:28px;color:#9ca3af;font-size:9px;font-weight:700">${i + 1}</td>
        <td style="width:90px">
          <span style="font-size:7.5px;font-weight:700;letter-spacing:0.1em;color:${col};text-transform:uppercase">${step.stage}</span>
        </td>
        <td style="font-weight:600;font-size:10px">${step.label}</td>
        <td style="color:#4b5563;font-size:9px">${step.detail}</td>
        <td style="font-family:monospace;font-size:8px;color:${col};max-width:140px">${step.output}</td>
        <td style="width:70px">
          <span class="pill" style="color:${passColor};background:${passBg}">${step.pass ? "PASS" : "FLAGGED"}</span>
        </td>
      </tr>`;
  }).join("");

  return `
    <div class="section">
      <h3>WELBX Behavioural Chain · ${sc.chain.length} Steps</h3>
      <table style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden">
        <thead>
          <tr>
            <th>#</th><th>Stage</th><th>Step</th><th>Detail</th><th>Output</th><th>Result</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/* ─── Scorecard section ──────────────────────────────────────── */
function scorecardSection(scenarioId: string): string {
  const saved = loadScorecard(scenarioId);
  const scores = saved?.scores ?? SCORECARD_DEFAULTS[scenarioId] ?? {};
  const total = saved?.total ?? Object.values(scores).reduce((a: number, b) => a + (b as number), 0);
  const notes = saved?.notes ?? "";
  const savedDate = saved?.savedAt ? new Date(saved.savedAt).toLocaleDateString("en-GB") : "Default data";
  const st = statusFor(total);
  const isDefault = !saved;

  const rows = CRITERIA.map(c => {
    const val = (scores[c.key] as number) ?? 0;
    return `
      <tr style="border-top:1px solid #e5e7eb">
        <td style="font-size:10px;font-weight:500">${c.label}</td>
        <td style="width:200px">${scoreBar(val)}</td>
        <td style="width:40px;font-size:12px;font-weight:700;text-align:center;color:${val >= 8 ? "#10b981" : val >= 5 ? "#c9a84c" : "#dc2626"}">${val || "—"}</td>
      </tr>`;
  }).join("");

  return `
    <div class="section">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <h3 style="margin:0">Validation Scorecard</h3>
        <span style="font-size:8px;color:#6b7280">${isDefault ? "Default scorecard data" : `Scored ${savedDate}`}</span>
      </div>
      <div class="two-col" style="align-items:start;gap:16px">
        <table style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden">
          <thead><tr><th>Criterion</th><th>Score</th><th style="width:40px">/10</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div>
          <div class="card" style="text-align:center;margin-bottom:12px">
            <div style="font-size:36px;font-weight:800;color:${st.color};line-height:1">${total}</div>
            <div style="font-size:9px;color:#6b7280;margin-top:2px">/ 100</div>
            <div class="pill" style="color:${st.color};background:${st.bg};margin-top:8px">${st.label}</div>
          </div>
          ${notes ? `
          <div class="card">
            <h3 style="margin-bottom:6px">Tester Notes</h3>
            <div style="font-size:9.5px;color:#374151;line-height:1.65">${notes.replace(/\n/g, "<br>")}</div>
          </div>` : ""}
        </div>
      </div>
    </div>`;
}

/* ─── Improvements section ───────────────────────────────────── */
function improvementsSection(scenarioId: string): string {
  const saved = loadScorecard(scenarioId);
  const scores = saved?.scores ?? SCORECARD_DEFAULTS[scenarioId] ?? {};
  const lowCriteria = CRITERIA.filter(c => ((scores[c.key] as number) ?? 0) < 8 && ((scores[c.key] as number) ?? 0) > 0);

  if (lowCriteria.length === 0) {
    return `
      <div class="section">
        <h3>Recommended Improvements</h3>
        <div class="card" style="color:#166534;background:#f0fdf4;border-color:#bbf7d0">
          All criteria scored ≥ 8 / 10. This scenario is ready for live pilot integration with no significant improvements required.
        </div>
      </div>`;
  }

  const items = lowCriteria.map(c => {
    const val = (scores[c.key] as number) ?? 0;
    const col = val >= 7 ? "#d97706" : "#dc2626";
    return `
      <div class="card" style="margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
          <span style="font-size:11px;font-weight:700;color:${col}">${c.label}</span>
          <span class="pill" style="color:${col};background:${col}18;font-size:8px">${val}/10</span>
        </div>
        <div style="font-size:9.5px;color:#374151;line-height:1.65">${IMPROVEMENT_SUGGESTIONS[c.key] ?? ""}</div>
      </div>`;
  }).join("");

  return `
    <div class="section">
      <h3>Recommended Improvements · ${lowCriteria.length} area${lowCriteria.length !== 1 ? "s" : ""} flagged</h3>
      ${items}
    </div>`;
}

/* ─── Red team section ───────────────────────────────────────── */
const RT_QUESTIONS_EXPORT = [
  { key: "wrong_signal",       text: "What if the signal is wrong?",                       detail: "Sensor misfire, stale data, or false positive triggers an incorrect moment classification." },
  { key: "conflict",           text: "What if two moments conflict?",                      detail: "Two simultaneous moments compete for the same resource, staff member, or communication channel." },
  { key: "staff_ignore",       text: "What if staff ignore the alert?",                    detail: "Notification received but no action taken within the expected response window." },
  { key: "guest_no_respond",   text: "What if the guest does not respond?",                detail: "Communication sent to guest but no acknowledgement or engagement is returned." },
  { key: "wrong_owner",        text: "What if the wrong owner is assigned?",               detail: "Action routed to incorrect department, role, or individual due to stale ownership data." },
  { key: "delayed_escalation", text: "What if escalation is delayed?",                     detail: "Escalation trigger fires late due to network latency, system load, or manual override." },
  { key: "privacy_limit",      text: "What if privacy constraints limit available data?",  detail: "GDPR or guest consent restrictions prevent key data points from being surfaced to the chain." },
];

const RT_STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  risk:       { label: "Risk Identified",     color: "#dc2626", bg: "#fee2e2" },
  mitigation: { label: "Mitigation Required", color: "#d97706", bg: "#fef3c7" },
  resolved:   { label: "Resolved",            color: "#10b981", bg: "#d1fae5" },
  na:         { label: "Not Applicable",      color: "#6b7280", bg: "#f3f4f6" },
};

function redTeamSection(scenarioId: string): string {
  type RTEntry = { status: string | null; notes: string };
  let rtData: Record<string, RTEntry> = {};
  try {
    const raw = localStorage.getItem(`welbx_redteam_${scenarioId}`);
    if (raw) rtData = JSON.parse(raw) as Record<string, RTEntry>;
  } catch { /* ignore */ }

  const reviewed = RT_QUESTIONS_EXPORT.filter(q => rtData[q.key]?.status).length;
  const riskCount = RT_QUESTIONS_EXPORT.filter(q => rtData[q.key]?.status === 'risk').length;
  const hasAny = reviewed > 0;

  const rows = RT_QUESTIONS_EXPORT.map((q, i) => {
    const entry = rtData[q.key];
    const sm = entry?.status ? RT_STATUS_META[entry.status] : null;
    return `
      <tr style="border-top:1px solid #e5e7eb">
        <td style="width:22px;color:#9ca3af;font-size:9px;font-weight:700">Q${i + 1}</td>
        <td>
          <div style="font-weight:600;font-size:10px;margin-bottom:2px">${q.text}</div>
          <div style="font-size:8.5px;color:#6b7280">${q.detail}</div>
          ${entry?.notes ? `<div style="font-size:8.5px;color:#374151;margin-top:4px;padding:4px 6px;background:#f9fafb;border-left:2px solid #e5e7eb">${entry.notes.replace(/\n/g, "<br>")}</div>` : ""}
        </td>
        <td style="width:130px;text-align:right;vertical-align:top">
          ${sm
            ? `<span class="pill" style="color:${sm.color};background:${sm.bg}">${sm.label}</span>`
            : `<span style="font-size:8px;color:#d1d5db">Not reviewed</span>`}
        </td>
      </tr>`;
  }).join("");

  const summaryItems = Object.entries(RT_STATUS_META).map(([k, m]) => {
    const n = RT_QUESTIONS_EXPORT.filter(q => rtData[q.key]?.status === k).length;
    return n > 0 ? `<span style="color:${m.color};font-weight:700">${n} ${m.label}</span>` : "";
  }).filter(Boolean).join(" &nbsp;·&nbsp; ");

  return `
    <div class="section" style="page-break-before:always">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <h3 style="margin:0">Red Team Testing · Edge Case Review</h3>
        <span style="font-size:8px;color:#6b7280">${hasAny ? `${reviewed}/7 reviewed · ${summaryItems || "No risks flagged"}` : "Not yet reviewed"}</span>
      </div>
      ${!hasAny ? `
        <div class="card" style="color:#6b7280;text-align:center">
          Red team testing not yet completed for this scenario. Open the RED TEAM tab in Scenario Replay Lab to review each edge case before pilot deployment.
        </div>` : `
        <table style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden">
          <thead><tr><th>#</th><th>Edge Case Question</th><th style="text-align:right">Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${riskCount > 0 ? `
        <div style="margin-top:10px;padding:10px 14px;background:#fee2e2;border:1px solid #fecaca;border-radius:5px;color:#b91c1c;font-size:9.5px">
          <strong>${riskCount} unresolved risk${riskCount > 1 ? "s" : ""} identified.</strong> These must be addressed before proceeding to live pilot deployment.
        </div>` : `
        <div style="margin-top:10px;padding:10px 14px;background:#d1fae5;border:1px solid #a7f3d0;border-radius:5px;color:#065f46;font-size:9.5px">
          All red team findings reviewed. No unresolved risks remain for this scenario.
        </div>`}`}
    </div>`;
}

/* ─── Full single scenario HTML ──────────────────────────────── */
function buildScenarioReport(sc: Scenario): string {
  const saved = loadScorecard(sc.id);
  const scores = saved?.scores ?? SCORECARD_DEFAULTS[sc.id] ?? {};
  const total = saved?.total ?? Object.values(scores).reduce((a: number, b) => a + (b as number), 0);

  return `
    <div class="page">
      ${reportHeader(sc, total)}
      <div class="two-col">
        <div>
          ${comparisonSection(sc.id)}
        </div>
        <div>
          ${chainSection(sc)}
        </div>
      </div>
      ${scorecardSection(sc.id)}
      ${improvementsSection(sc.id)}
      ${redTeamSection(sc.id)}
      <div style="margin-top:24px;padding-top:10px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;color:#9ca3af;font-size:8px">
        <span>WELBX Travel Operating Layer · Scenario Validation Report</span>
        <span>${sc.id} · ${new Date().toLocaleDateString("en-GB")}</span>
        <span>CONFIDENTIAL — Not for distribution</span>
      </div>
    </div>`;
}

/* ─── Cover page for full pack ───────────────────────────────── */
function buildCoverPage(): string {
  const allScores = SCENARIOS.map(sc => {
    const saved = loadScorecard(sc.id);
    const scores = saved?.scores ?? SCORECARD_DEFAULTS[sc.id] ?? {};
    const total = saved?.total ?? Object.values(scores).reduce((a: number, b) => a + (b as number), 0);
    return total;
  });
  const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const strong   = allScores.filter(t => t >= 85).length;
  const refine   = allScores.filter(t => t >= 70 && t < 85).length;
  const notReady = allScores.filter(t => t < 70).length;
  const pilotReady = strong >= 8 && notReady === 0;
  const st = statusFor(Math.round(avg));

  const scenarioRows = SCENARIOS
    .map(sc => {
      const saved = loadScorecard(sc.id);
      const scores = saved?.scores ?? SCORECARD_DEFAULTS[sc.id] ?? {};
      const total = saved?.total ?? Object.values(scores).reduce((a: number, b) => a + (b as number), 0);
      const s = statusFor(total);
      return { sc, total, s };
    })
    .sort((a, b) => b.total - a.total)
    .map(({ sc, total, s }) => `
      <tr style="border-top:1px solid #e5e7eb">
        <td style="font-family:monospace;font-size:8px;color:#9ca3af">${sc.id}</td>
        <td style="font-weight:600">${sc.name}</td>
        <td style="font-size:8px;color:#6b7280">${sc.category}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:80px;height:4px;background:#e5e7eb;border-radius:2px;overflow:hidden">
              <div style="height:100%;width:${((total - 60) / 40) * 100}%;background:${s.color}"></div>
            </div>
            <span style="font-weight:700;font-size:12px;color:${s.color}">${total}</span>
          </div>
        </td>
        <td><span class="pill" style="color:${s.color};background:${s.bg}">${s.label}</span></td>
      </tr>`).join("");

  return `
    <div class="page" style="display:flex;flex-direction:column;justify-content:space-between;min-height:180mm">
      <div>
        <div style="border-bottom:3px solid #c9a84c;padding-bottom:16px;margin-bottom:24px">
          <div style="font-size:9px;font-weight:700;letter-spacing:0.2em;color:#c9a84c;text-transform:uppercase;margin-bottom:8px">
            WELBX TRAVEL OPERATING LAYER · THE GRAND MERIDIAN, LONDON
          </div>
          <div style="font-size:28px;font-weight:800;color:#1a1f2e;letter-spacing:-0.02em;line-height:1.1">
            Full Validation Pack
          </div>
          <div style="font-size:12px;color:#6b7280;margin-top:6px">
            Scenario-by-scenario analysis of WELBX operational logic — all 10 test scenarios
          </div>
          <div style="font-size:9px;color:#9ca3af;margin-top:4px">
            Generated ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · CONFIDENTIAL
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:24px">
          ${[
            { l: "Average Score",        v: avg.toFixed(1), u: "/ 100",       c: st.color },
            { l: "Strong Validations",   v: strong,         u: "≥ 85 / 100", c: "#10b981" },
            { l: "Needs Refinement",     v: refine,         u: "70–84",      c: "#d97706" },
            { l: "Not Ready",            v: notReady,       u: "below 70",   c: "#dc2626" },
            { l: "Pilot Readiness",      v: pilotReady ? "READY" : "PENDING", u: "", c: pilotReady ? "#10b981" : "#d97706" },
          ].map(m => `
            <div class="card" style="text-align:center">
              <div style="font-size:8px;font-weight:700;letter-spacing:0.12em;color:#9ca3af;text-transform:uppercase;margin-bottom:6px">${m.l}</div>
              <div style="font-size:24px;font-weight:800;color:${m.c};line-height:1">${m.v}</div>
              ${m.u ? `<div style="font-size:8px;color:#9ca3af;margin-top:2px">${m.u}</div>` : ""}
            </div>`).join("")}
        </div>

        <h3>Scenario Summary</h3>
        <table style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden">
          <thead><tr><th>ID</th><th>Scenario</th><th>Category</th><th>Score</th><th>Status</th></tr></thead>
          <tbody>${scenarioRows}</tbody>
        </table>
      </div>
      <div style="color:#9ca3af;font-size:8px;padding-top:16px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between">
        <span>WELBX Travel Operating Layer · Full Validation Pack</span>
        <span>${new Date().toLocaleDateString("en-GB")}</span>
        <span>CONFIDENTIAL — Not for distribution</span>
      </div>
    </div>`;
}

/* ─── Public: export single scenario ────────────────────────── */
export function exportScenarioReport(scenarioId: string): void {
  const sc = SCENARIOS.find(s => s.id === scenarioId);
  if (!sc) return;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WELBX Validation Report · ${sc.id}</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  ${buildScenarioReport(sc)}
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 400);
    });
  </script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) { alert("Please allow pop-ups to export the report."); return; }
  win.document.write(html);
  win.document.close();
}

/* ─── Public: export full validation pack ───────────────────── */
export function exportFullValidationPack(): void {
  const pages = [buildCoverPage(), ...SCENARIOS.map(buildScenarioReport)].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WELBX Full Validation Pack · The Grand Meridian</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  ${pages}
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 400);
    });
  </script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) { alert("Please allow pop-ups to export the report."); return; }
  win.document.write(html);
  win.document.close();
}
