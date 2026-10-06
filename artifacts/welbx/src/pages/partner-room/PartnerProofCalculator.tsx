import { useState, type CSSProperties } from "react";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { calculateTravelValue, DEFAULT_VALUE_ASSUMPTIONS, type TravelValueAssumptions, type MomentKind, type ValueTier } from "@/lib/travelValueModel";
import "./proof-calculator.css";

const number = (n: number) => Math.round(n).toLocaleString();
const money = (n: number) => `${n < 0 ? "−" : ""}$${Math.round(Math.abs(n)).toLocaleString()}`;
const percent = (n: number) => `${Math.round(n * 100)}%`;

function Assumption({ label, value, min, max, step = 1, onChange, unit = "", hint }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void; unit?: string; hint?: string;
}) {
  return <div className="travel-value-input">
    <span className="travel-value-input-header"><span>{label}</span><span className="travel-value-number-wrap">
      <input type="number" onFocus={e => e.currentTarget.select()} aria-label={`${label} — exact value`} min={min} max={max} step={step} value={value}
        onChange={e => { if (e.target.value !== "" && Number.isFinite(e.target.valueAsNumber)) onChange(Math.min(max, Math.max(min, e.target.valueAsNumber))); }} />{unit}
    </span></span>
    <input className="travel-value-slider" type="range" aria-label={label} min={min} max={max} step={step} value={value}
      aria-valuetext={`${value}${unit}`} onChange={e => onChange(Number(e.target.value))}
      style={{ "--slider-color": "#a8dedb", "--slider-progress": `${((value - min) / (max - min)) * 100}%` } as CSSProperties} />
    {hint && <span className="travel-value-hint">{hint}</span>}
  </div>;
}

export default function PartnerProofCalculator() {
  const [a, setA] = useState<TravelValueAssumptions>(() => structuredClone(DEFAULT_VALUE_ASSUMPTIONS));
  const result = calculateTravelValue(a);
  const update = (key: Exclude<keyof TravelValueAssumptions, "moments">, value: number) => setA(current => ({ ...current, [key]: value }));
  const updateMoment = (kind: MomentKind, key: "momentsPer100Stays" | "actionRate" | "minutesSaved", value: number) =>
    setA(current => ({ ...current, moments: current.moments.map(m => m.kind === kind ? { ...m, [key]: value } : m) }));
  const updateTier = (kind: MomentKind, tier: ValueTier, value: number) => setA(current => ({ ...current, moments: current.moments.map(m => {
    if (m.kind !== kind || !m.value) return m;
    const next = { ...m.value, [tier]: value };
    // Keep the edited tier and move adjacent tiers only if needed to preserve an ordered range.
    if (tier === "low") { next.base = Math.max(next.base, value); next.high = Math.max(next.high, next.base); }
    if (tier === "base") { next.low = Math.min(next.low, value); next.high = Math.max(next.high, value); }
    if (tier === "high") { next.base = Math.min(next.base, value); next.low = Math.min(next.low, next.base); }
    return { ...m, value: next };
  }) }));

  return <PartnerRoomLayout><main className="travel-value">
    <header>
      <p className="travel-value-eyebrow">Commercial · Operating model · Proof of value</p>
      <h1>Everyday operations. Opportunities. Prevention. Recovery.</h1>
      <p className="travel-value-lead">Model how JALDO Travel could coordinate a property or portfolio. Start with occupancy and stays, then explore the moments where a decision or coordinated action matters.</p>
      <p className="travel-value-boundary">Illustrative, synthetic assumptions only. Defaults are editable examples, not industry benchmarks or measured results. Accountable people must validate the model in a named pilot.</p>
      <p><strong>Interactions</strong> are activity. <strong>Operational moments</strong> call for a decision or coordinated action. <strong>Issues</strong> are one type of moment.</p>
    </header>
    <div className="travel-value-toolbar"><span>Monthly model · $ values use one consistent currency chosen by you</span><button onClick={() => setA(structuredClone(DEFAULT_VALUE_ASSUMPTIONS))}>Reset assumptions</button></div>

    <section className="travel-value-section" aria-labelledby="capacity-title">
      <h2 id="capacity-title">1. Property capacity → occupancy → guest stays</h2>
      <div className="travel-value-input-grid">
        <Assumption label="Sites" value={a.sites} min={1} max={500} onChange={v => update("sites", v)} />
        <Assumption label="Rooms per site" value={a.roomsPerSite} min={1} max={1000} onChange={v => update("roomsPerSite", v)} hint="For a mixed portfolio, use average rooms per site." />
        <Assumption label="Days in month" value={a.days} min={28} max={31} onChange={v => update("days", v)} />
        <Assumption label="Monthly occupancy" value={Math.round(a.occupancy * 100)} min={0} max={100} unit="%" onChange={v => update("occupancy", v / 100)} />
        <Assumption label="Average length of stay" value={a.lengthOfStay} min={0.5} max={30} step={0.5} unit=" nights" onChange={v => update("lengthOfStay", v)} />
        <Assumption label="Guests per occupied room" value={a.guestsPerRoom} min={1} max={6} step={0.1} onChange={v => update("guestsPerRoom", v)} />
        <Assumption label="Interactions per guest stay" value={a.interactionsPerGuest} min={0} max={50} onChange={v => update("interactionsPerGuest", v)} hint="Illustrative guest touchpoints; not all interactions become moments." />
      </div>
      <div className="travel-value-stats" aria-live="polite" aria-atomic="true">
        <div><strong>{number(result.rooms)}</strong><span>Total rooms</span></div>
        <div><strong>{number(result.occupiedRoomNights)}</strong><span>Occupied room nights</span></div>
        <div><strong>{number(result.stays)}</strong><span>Estimated room stays</span></div>
        <div><strong>{number(result.guests)}</strong><span>Estimated guest arrivals</span></div>
        <div><strong>{number(result.interactions)}</strong><span>Estimated guest interactions</span></div>
      </div>
      <details><summary>How these volumes connect</summary><p>Occupied room nights = sites × rooms per site × days × occupancy. Room stays = occupied room nights ÷ average length of stay. Guest arrivals = room stays × guests per occupied room. Interactions = guest arrivals × interactions per guest stay.</p><p>This is a steady-state estimate; it does not track unique people, actual reservations or stays crossing month boundaries. Staff and system signals can create moments independently of guest interactions.</p></details>
    </section>

    <section className="travel-value-section" aria-labelledby="moments-title">
      <h2 id="moments-title">2. Operational moments → actions → outcomes</h2>
      <p>Enter moments per 100 room stays. A stay can have several moments. Give each moment one primary category; do not count the same event in several categories. “Action rate” means the assumed share reaching the category’s intended outcome, not merely generating a task.</p>
      <div className="travel-value-moments">{result.rows.map(m => <article key={m.kind} className="travel-value-moment">
        <h3>{m.label}</h3><p>{m.example}</p>
        <div className="travel-value-input-grid">
          <Assumption label={`${m.label}: moments per 100 room stays`} value={m.momentsPer100Stays} min={0} max={1000} onChange={v => updateMoment(m.kind, "momentsPer100Stays", v)} />
          <Assumption label={`${m.label}: action rate`} value={Math.round(m.actionRate * 100)} min={0} max={100} unit="%" onChange={v => updateMoment(m.kind, "actionRate", v / 100)} />
          {m.kind !== "welfare" && <Assumption label={`${m.label}: minutes saved per successful action`} value={m.minutesSaved} min={0} max={120} onChange={v => updateMoment(m.kind, "minutesSaved", v)} />}
        </div>
        <p className="travel-value-result">{number(m.moments)} modelled moments → {number(m.actions)} assumed successful actions{m.kind !== "welfare" && ` · ${number(m.staffHours)} hours of potential staff capacity`}</p>
        {m.value ? <>
          <h4>{m.kind === "opportunity" ? "Net contribution per successful opportunity" : "Avoided cost per successful action"} · $</h4>
          <div className="travel-value-tiers">{(["low", "base", "high"] as const).map(tier => <label key={tier}>{tier}<input type="number" onFocus={e => e.currentTarget.select()} aria-label={`${m.label}: ${tier} value per successful action`} min={0} max={10000} step={1} value={m.value![tier]} onChange={e => { if (e.target.value !== "" && Number.isFinite(e.target.valueAsNumber)) updateTier(m.kind, tier, Math.max(0, Math.min(10000, e.target.valueAsNumber))); }} /></label>)}</div>
          <p className="travel-value-hint">Editable assumptions, not prices or validated savings. Adjacent tiers adjust if needed to keep low ≤ base ≤ high.</p>
        </> : <p className="travel-value-hint">{m.kind === "welfare" ? "No dollar value or time-saving target is assigned to welfare and safety. Validate response time, human ownership and follow-through separately; action rate alone does not establish safety." : "Potential staff time is shown separately; it is not added to financial value or treated as cash savings."}</p>}
      </article>)}</div>
    </section>

    <section className="travel-value-section" aria-labelledby="value-title">
      <h2 id="value-title">3. Attribute value carefully</h2>
      <div className="travel-value-input-grid">
        <Assumption label="Incremental share attributable to JALDO" value={Math.round(a.incrementalShare * 100)} min={0} max={100} unit="%" onChange={v => update("incrementalShare", v / 100)} hint="Exclude outcomes the existing operation would achieve anyway." />
        <Assumption label="Allowance for overlapping financial benefits" value={Math.round(a.overlapAllowance * 100)} min={0} max={100} unit="%" onChange={v => update("overlapAllowance", v / 100)} hint="A planning deduction; verify overlap from unique events during the pilot." />
        <Assumption label="Monthly programme cost" value={a.monthlyCost} min={0} max={100000} step={100} unit=" $" onChange={v => update("monthlyCost", v)} hint="Enter total recurring cost plus allocated activation cost. Zero means cost is not included." />
      </div>
      <div className="travel-value-table-wrap"><table><caption>Illustrative monthly financial range</caption><thead><tr><th scope="col">Component</th><th scope="col">Low</th><th scope="col">Base</th><th scope="col">High</th></tr></thead><tbody>
        {result.rows.filter(m => m.value).map(m => <tr key={m.kind}><th scope="row">{m.label} · before deductions</th>{(["low", "base", "high"] as const).map(t => <td key={t}>{money(m.gross[t])}</td>)}</tr>)}
        <tr><th scope="row">Gross modelled benefit</th>{(["low", "base", "high"] as const).map(t => <td key={t}>{money(result.gross[t])}</td>)}</tr>
        <tr><th scope="row">After attribution and overlap allowance</th>{(["low", "base", "high"] as const).map(t => <td key={t}>{money(result.adjusted[t])}</td>)}</tr>
        <tr className="travel-value-total"><th scope="row">After entered programme cost</th>{(["low", "base", "high"] as const).map(t => <td key={t}>{money(result.net[t])}</td>)}</tr>
      </tbody></table></div>
      <p>Financial benefit = successful actions × value tier. Apply {percent(a.incrementalShare)} incremental attribution, then deduct {percent(a.overlapAllowance)} for overlap, then subtract {money(a.monthlyCost)} in entered monthly cost. Low/base/high vary the per-action value only; they are not statistical confidence bounds.</p>
      <div className="travel-value-stats">
        <div><strong>{number(result.moments)}</strong><span>Operational moments</span></div>
        <div><strong>{number(result.actions)}</strong><span>Assumed successful actions</span></div>
        <div><strong>{number(result.staffHours)} hrs</strong><span>Potential staff capacity · before overlap review</span></div>
      </div>
      <p>Staff time, financial benefits and welfare outcomes stay separate. Time released is not cash saved unless it changes actual cost. Nothing here proves guest satisfaction, safety, avoided harm, delivered actions or ROI.</p>
    </section>
    <section className="travel-value-section travel-value-close"><h2>Turn assumptions into a named pilot.</h2><p>Baseline moment volumes and outcomes, record who authorised each response, compare the result with existing practice, and review unique-event evidence. Use those findings to replace the assumptions and configure the next cycle.</p></section>
  </main></PartnerRoomLayout>;
}
