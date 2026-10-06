import { useState, type CSSProperties } from "react";
import { PartnerRoomLayout } from "@/components/PartnerRoomLayout";
import { calculateTravelValue, DEFAULT_VALUE_ASSUMPTIONS, type TravelValueAssumptions, type MomentKind, type ValueTier } from "@/lib/travelValueModel";
import { INTERACTION_BASIS_LABELS } from "@/lib/travelGuestJourney";
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
  const update = (key: Exclude<keyof TravelValueAssumptions, "moments" | "journey">, value: number) => setA(current => ({ ...current, [key]: value }));
  const updateJourney = (id: string, frequency: number) => setA(current => ({ ...current, journey: current.journey.map(j => j.id === id ? { ...j, frequency } : j) }));
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
      </div>
      <div className="travel-value-stats" aria-live="polite" aria-atomic="true">
        <div><strong>{number(result.rooms)}</strong><span>Total rooms</span></div>
        <div><strong>{number(result.occupiedRoomNights)}</strong><span>Occupied room nights</span></div>
        <div><strong>{number(result.stays)}</strong><span>Estimated room stays</span></div>
        <div><strong>{number(result.guests)}</strong><span>Estimated guest arrivals</span></div>
        <div><strong>{number(result.guestNights)}</strong><span>Estimated guest nights</span></div>
        <div><strong>{result.interactionsPerRoomStay.toLocaleString(undefined, { maximumFractionDigits: 1 })}</strong><span>Interactions per room stay</span></div>
        <div><strong>{number(result.interactions)}</strong><span>Estimated guest interactions</span></div>
      </div>
      <details><summary>How occupancy and stays connect</summary><p>Occupied room nights = sites × rooms per site × days × occupancy. Room stays = occupied room nights ÷ average length of stay. Guest arrivals = room stays × guests per occupied room. Guest nights = occupied room nights × guests per occupied room.</p><p>This is a steady-state estimate; it does not track unique people, actual reservations or stays crossing month boundaries.</p></details>
      <h3 style={{ marginTop: 28 }}>Build the guest interaction plan</h3>
      <p>This worked example includes pre-arrival, arrival, daily service, departure and follow-up. It is a full-service pattern, not a standard or industry average. Change each frequency to match the property: zero excludes an exchange; 0.5 means it occurs in half of the relevant stays or nights.</p>
      <p>Shared check-ins, meals and room-service exchanges count once per room party. Individual exchanges scale with guest nights only when guests interact independently. Count a complete service episode once, not every message, click or retry. An automated message counts only if it becomes a meaningful exchange.</p>
      <div className="travel-value-table-wrap"><table><caption>Editable interaction guide · {a.lengthOfStay}-night average stay</caption><thead><tr><th scope="col">Exchange</th><th scope="col">Counting basis</th><th scope="col">Frequency</th><th scope="col">Per room stay</th><th scope="col">Monthly</th></tr></thead><tbody>
        {result.journeyRows.map(j => <tr key={j.id}><th scope="row">{j.label}<span className="travel-value-hint">{j.stage} · {j.purpose}</span></th><td>{INTERACTION_BASIS_LABELS[j.basis]}</td><td><input className="travel-value-frequency" type="number" aria-label={`${j.label}: frequency`} min={0} max={10} step={0.5} value={j.frequency} onFocus={e => e.currentTarget.select()} onChange={e => { if (e.target.value !== "" && Number.isFinite(e.target.valueAsNumber)) updateJourney(j.id, Math.max(0, Math.min(10, e.target.valueAsNumber))); }} /></td><td>{j.perStay.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td><td>{number(j.monthly)}</td></tr>)}
        <tr className="travel-value-total"><th scope="row">Total distinct guest-facing exchanges</th><td colSpan={2}>Shared + individual</td><td>{result.interactionsPerRoomStay.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td><td>{number(result.interactions)}</td></tr>
      </tbody></table></div>
      <p className="travel-value-result">Monthly: {number(result.sharedInteractions)} shared exchanges + {number(result.individualInteractions)} individual exchanges = {number(result.interactions)} guest-facing interactions.</p>
      <p>Stay-level exchanges scale with room stays; daily shared exchanges scale with occupied room nights; individual daily exchanges scale with guest nights. At fixed occupancy, longer stays reduce arrival/departure exchanges but not daily service volume. Before/after-stay exchanges are allocated to the stay for planning, not dated live records. Staff, system and partner exchanges are not included in this guest-facing total.</p>
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
          <p className="travel-value-hint">Editable assumptions, not prices or validated savings. Exclude staff labour that is accounted for in the human-resource section below. Adjacent tiers adjust if needed to keep low ≤ base ≤ high.</p>
        </> : <p className="travel-value-hint">{m.kind === "welfare" ? "No dollar value or time-saving target is assigned to welfare and safety. Validate response time, human ownership and follow-through separately; action rate alone does not establish safety." : "Potential staff time is shown separately; it is not added to financial value or treated as cash savings."}</p>}
      </article>)}</div>
    </section>

    <section className="travel-value-section" aria-labelledby="value-title">
      <h2 id="value-title">3. Attribute value carefully</h2>
      <div className="travel-value-input-grid">
        <Assumption label="Incremental share attributable to JALDO" value={Math.round(a.incrementalShare * 100)} min={0} max={100} unit="%" onChange={v => update("incrementalShare", v / 100)} hint="Exclude outcomes the existing operation would achieve anyway." />
        <Assumption label="Allowance for overlapping benefits" value={Math.round(a.overlapAllowance * 100)} min={0} max={100} unit="%" onChange={v => update("overlapAllowance", v / 100)} hint="Applied to financial benefit and staff time; verify overlap from unique events during the pilot." />
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
    <section className="travel-value-section travel-value-impact" aria-labelledby="bottom-impact-title">
      <h2 id="bottom-impact-title">4. Human-resource impact and the financial bottom line</h2>
      <p>What could this mean for the team and the operation each month? Use the same {percent(a.incrementalShare)} attribution and {percent(a.overlapAllowance)} overlap allowance to estimate incremental staff capacity.</p>
      <div className="travel-value-input-grid">
        <Assumption label="Working hours per full-time equivalent per month" value={a.hoursPerFteMonth} min={1} max={240} onChange={v => update("hoursPerFteMonth", v)} hint="Your working-hours basis; the default is an example, not a staffing standard." />
        <Assumption label="Loaded staff cost per hour" value={a.hourlyStaffCost} min={0} max={200} unit=" $" onChange={v => update("hourlyStaffCost", v)} hint="Use the full hourly cost in the same currency as the value tiers." />
        <Assumption label="Released time that actually reduces cash cost" value={Math.round(a.cashRealisationRate * 100)} min={0} max={100} unit="%" onChange={v => update("cashRealisationRate", v / 100)} hint="Default 0%. Increase only for a defensible reduction in paid overtime, agency hours or other actual spend." />
      </div>
      <div className="travel-value-stats" aria-live="polite" aria-atomic="true">
        <div><strong>{number(result.adjustedStaffHours)} hrs</strong><span>Incremental staff capacity per month</span></div>
        <div><strong>{result.fteEquivalent.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong><span>FTE-equivalent capacity · not headcount reduction</span></div>
        <div><strong>{money(result.staffCapacityValue)}</strong><span>Cost equivalent of released time · not cash savings</span></div>
        <div><strong>{money(result.cashStaffSavings)}</strong><span>Entered cash-saving hypothesis at {percent(a.cashRealisationRate)}</span></div>
      </div>
      <p>{number(result.staffHours)} gross potential hours × {percent(a.incrementalShare)} attribution × {percent(1 - a.overlapAllowance)} after overlap = {number(result.adjustedStaffHours)} incremental hours. Equivalent capacity = hours ÷ {a.hoursPerFteMonth}; cost equivalent = hours × {money(a.hourlyStaffCost)}. Redeployment may improve service and workload without lowering payroll.</p>
      <div className="travel-value-table-wrap"><table><caption>Monthly bottom-line hypothesis · after entered costs</caption><thead><tr><th scope="col">Component</th><th scope="col">Low</th><th scope="col">Base</th><th scope="col">High</th></tr></thead><tbody>
        <tr><th scope="row">Attributed service contribution / avoided cost</th>{(["low", "base", "high"] as const).map(t => <td key={t}>{money(result.adjusted[t])}</td>)}</tr>
        <tr><th scope="row">Entered staff cash-saving hypothesis</th>{(["low", "base", "high"] as const).map(t => <td key={t}>{money(result.cashStaffSavings)}</td>)}</tr>
        <tr><th scope="row">Entered programme cost</th>{(["low", "base", "high"] as const).map(t => <td key={t}>−{money(a.monthlyCost)}</td>)}</tr>
        <tr className="travel-value-total"><th scope="row">Net monthly impact hypothesis</th>{(["low", "base", "high"] as const).map(t => <td key={t}>{money(result.bottomLine[t])}</td>)}</tr>
      </tbody></table></div>
      <p>Exclude labour costs already included in prevention/recovery value tiers. The overlap allowance is a planning adjustment, not proof of deduplication. This is not an accounting profit forecast: attribution, avoided costs, actual cash savings and complete programme costs still need pilot evidence. Welfare, safety and guest satisfaction remain separate outcomes.</p>
    </section>
    <section className="travel-value-section travel-value-close"><h2>Turn assumptions into a named pilot.</h2><p>Baseline moment volumes and outcomes, record who authorised each response, compare the result with existing practice, and review unique-event evidence. Use those findings to replace the assumptions and configure the next cycle.</p></section>
  </main></PartnerRoomLayout>;
}
