import { useId, useMemo, useState } from "react";
import { usePilotScope } from "@/context/PilotScopeContext";
import { useDeployment } from "@/context/DeploymentContext";
import { usePartnerRoomNavigate } from "@/components/PartnerRoomLayout";
import { PILOT_PROPOSITION, PILOT_SCENARIOS, PILOT_SUCCESS_MEASURES } from "@/data/travelPilotModel";
import {
  BASELINE_METHODS, ENQUIRY_ADDRESS, MAX_PILOT_PROPERTIES, integrationPrerequisites, isPortfolio,
  pilotCommercialAssumptions, requiredRoles, scenarioTitle, scopeGaps, scopeMailto, scopeSummary, securityPrerequisites,
  type BaselineMethod, type PeopleRole,
} from "@/lib/pilotScope";
import "./pilot-scope.css";

const money = (n: number) => `${n < 0 ? "−" : ""}$${Math.round(Math.abs(n)).toLocaleString()}`;

function RouteLink({ href, children }: { href: string; children: React.ReactNode }) {
  const navigateTo = usePartnerRoomNavigate();
  return <a href={href} onClick={event => { event.preventDefault(); navigateTo(href); }}>{children}</a>;
}

export function PilotScopeBuilder() {
  const { scope, setScope, value, resetScope } = usePilotScope();
  const uid = useId();
  const { activeDeployment } = useDeployment();
  const [copyStatus, setCopyStatus] = useState("");
  const summary = useMemo(() => scopeSummary(scope, value), [scope, value]);
  const gaps = scopeGaps(scope);
  const mail = scopeMailto(summary);
  const integrations = integrationPrerequisites(scope.momentIds);

  const setProperty = (index: number, key: "name" | "type" | "rooms", text: string) =>
    setScope(current => ({ ...current, properties: current.properties.map((p, i) => i === index ? { ...p, [key]: text } : p) }));
  const toggle = (key: "momentIds" | "measureIds", id: string, on: boolean) =>
    setScope(current => ({ ...current, [key]: on ? [...current[key], id] : current[key].filter(item => item !== id) }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus("Scope copied. Paste it into an email or document.");
    } catch {
      setCopyStatus("Copying is blocked in this browser. Select the text in the box below and copy it.");
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([summary], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "jaldo-travel-pilot-scope.txt";
    link.click();
    URL.revokeObjectURL(url);
    setCopyStatus("Scope downloaded as jaldo-travel-pilot-scope.txt.");
  };

  return (
    <section id="pilot-scope" className="ps" aria-labelledby="pilot-scope-title">
      <p className="ps-eyebrow">Pilot pathway</p>
      <h2 id="pilot-scope-title">Define a concrete pilot scope.</h2>
      <p className="ps-lead">
        Set the properties, accountable people, moments, baseline, measures, prerequisites and review decision. It uses the Stage 3 portfolio model, the Calculator and the Integration Brief. {PILOT_PROPOSITION.targetEnvironment}.
      </p>
      <p className="ps-session" data-testid="scope-session-notice">
        Kept in this browser tab while you move between Partner Room pages. Refreshing ends the session and clears it. Nothing is saved or sent from this page.
      </p>

      <fieldset className="ps-block">
        <legend>1 · Properties</legend>
        {scope.properties.map((property, index) => (
          <div className="ps-row" key={index}>
            <label>Property {index + 1} name<input id={`${uid}-property-${index}-name`} value={property.name} onChange={e => setProperty(index, "name", e.target.value)} placeholder="e.g. Harbour Hotel" /></label>
            <label>Type<input id={`${uid}-property-${index}-type`} value={property.type} onChange={e => setProperty(index, "type", e.target.value)} placeholder="e.g. City hotel" /></label>
            <label>Rooms<input id={`${uid}-property-${index}-rooms`} value={property.rooms} inputMode="numeric" onChange={e => setProperty(index, "rooms", e.target.value)} placeholder="e.g. 220" /></label>
            {scope.properties.length > 1 && (
              <button type="button" className="ps-secondary" onClick={() => setScope(current => ({ ...current, properties: current.properties.filter((_, i) => i !== index) }))}>Remove property {index + 1}</button>
            )}
          </div>
        ))}
        <div className="ps-actions">
          {scope.properties.length < MAX_PILOT_PROPERTIES && (
            <button type="button" className="ps-secondary" onClick={() => setScope(current => ({ ...current, properties: [...current.properties, { name: "", type: "", rooms: "" }] }))}>Add a property</button>
          )}
          {activeDeployment && !scope.properties.some(p => p.name === activeDeployment.deploymentName) && (
            <button type="button" className="ps-secondary" onClick={() => setScope(current => {
              const first = { name: activeDeployment.deploymentName, type: activeDeployment.propertyType, rooms: String(activeDeployment.roomCount) };
              const properties = current.properties[0]?.name.trim() ? [...current.properties, first].slice(0, MAX_PILOT_PROPERTIES) : [first, ...current.properties.slice(1)];
              return { ...current, properties };
            })}>Use the configured deployment ({activeDeployment.deploymentName})</button>
          )}
        </div>
        {isPortfolio(scope) && <p className="ps-hint">More than one property: a portfolio exception owner is needed, as in the <RouteLink href="/partner-room/product-proof/stage-3-operating-layer#portfolio-coordination">Stage 3 portfolio model</RouteLink>.</p>}
      </fieldset>

      <fieldset className="ps-block">
        <legend>2 · Accountable people</legend>
        <div className="ps-grid">
          {requiredRoles(scope).map(role => (
            <label key={role.id}>{role.label}<span className="ps-help">{role.help}</span>
              <input id={`${uid}-person-${role.id}`} value={scope.people[role.id] ?? ""} onChange={e => setScope(current => ({ ...current, people: { ...current.people, [role.id as PeopleRole]: e.target.value } }))} placeholder="Name and title" />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="ps-block">
        <legend>3 · Selected moments</legend>
        {PILOT_SCENARIOS.map(item => (
          <label key={item.scenarioId} className="ps-check">
            <input id={`${uid}-moment-${item.scenarioId}`} type="checkbox" checked={scope.momentIds.includes(item.scenarioId)} onChange={e => toggle("momentIds", item.scenarioId, e.target.checked)} />
            <span>{scenarioTitle(item.scenarioId)} <em>{item.role === "primary" ? "core pilot moment" : "optional"}</em></span>
          </label>
        ))}
      </fieldset>

      <fieldset className="ps-block">
        <legend>4 · Baseline</legend>
        <div className="ps-row">
          <label>Method
            <select value={scope.baseline.method} onChange={e => setScope(current => ({ ...current, baseline: { ...current.baseline, method: e.target.value as BaselineMethod } }))}>
              {Object.entries(BASELINE_METHODS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>
          <label>Weeks before the pilot
            <input id={`${uid}-baseline-weeks`} type="number" min={1} max={12} value={scope.baseline.weeks} onChange={e => setScope(current => ({ ...current, baseline: { ...current.baseline, weeks: Number(e.target.value) || 0 } }))} />
          </label>
        </div>
        <p className="ps-hint">Recorded by the measurement owner, so pilot results compare against the property's own starting point rather than an industry average.</p>
      </fieldset>

      <fieldset className="ps-block">
        <legend>5 · Measures</legend>
        <div className="ps-measures">
          {["Operational", "Guest", "Governance"].map(category => (
            <div key={category}>
              <h4>{category}</h4>
              {PILOT_SUCCESS_MEASURES.filter(m => m.category === category).map(m => (
                <label key={m.id} className="ps-check">
                  <input id={`${uid}-measure-${m.id}`} type="checkbox" checked={scope.measureIds.includes(m.id)} onChange={e => toggle("measureIds", m.id, e.target.checked)} />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
        <div className="ps-value" data-testid="scope-value">
          <h4>Value hypothesis</h4>
          {value
            ? <p>From the <RouteLink href="/partner-room/proof-calculator">Calculator</RouteLink>: {value.sites} site(s) × {value.roomsPerSite} rooms; net monthly impact hypothesis {money(value.lowMonthly)} / {money(value.baseMonthly)} / {money(value.highMonthly)} (low / base / high){value.costIncluded ? "" : ", programme cost not included"}. Modelled, not a forecast.</p>
            : <p>Not modelled yet. Use <RouteLink href="/partner-room/proof-calculator#value-title">the Calculator</RouteLink> and choose “Use in pilot scope” to bring its assumptions here.</p>}
        </div>
      </fieldset>

      <fieldset className="ps-block">
        <legend>6 · Integration and security prerequisites</legend>
        <p className="ps-hint">From the <RouteLink href="/partner-room/integration-brief#security-data">Integration Brief</RouteLink>, for the moments selected above.</p>
        <ul className="ps-prereqs" data-testid="scope-prerequisites">
          {integrations.map(item => <li key={item.title}><strong>{item.title}</strong><span className={`ps-status ps-status-${item.status === "Working Proof" ? "demo" : "planned"}`}>{item.status === "Working Proof" ? "Demonstrated only" : item.status}</span></li>)}
          {securityPrerequisites().map(item => <li key={item.title}><strong>{item.title}</strong><span className="ps-status ps-status-required">Required before live data</span></li>)}
        </ul>
      </fieldset>

      <fieldset className="ps-block">
        <legend>7 · Review decision</legend>
        <div className="ps-row">
          <label>Weeks after the pilot starts
            <input id={`${uid}-review-weeks`} type="number" min={4} max={26} value={scope.review.weeksAfterStart} onChange={e => setScope(current => ({ ...current, review: { ...current.review, weeksAfterStart: Number(e.target.value) || 0 } }))} />
          </label>
        </div>
        <label className="ps-wide" htmlFor={`${uid}-criteria`}>What the decision will be based on</label>
        <textarea id={`${uid}-criteria`} rows={2} value={scope.review.criteria} onChange={e => setScope(current => ({ ...current, review: { ...current.review, criteria: e.target.value } }))} placeholder="e.g. Time to acknowledge improves on the baseline at both properties, with every required approval and evidence item recorded" />
        <p className="ps-hint">Decided by the executive sponsor: continue to a wider rollout, extend with changes, or stop.</p>
      </fieldset>

      <div className="ps-block ps-commercial" data-testid="scope-commercial">
        <h3>Commercial assumptions</h3>
        <p className="ps-hint"><strong>From the existing commercial model. Subject to proposal; not a quote or approved pricing.</strong> {PILOT_PROPOSITION.durationNote}</p>
        <ul>{pilotCommercialAssumptions().map(item => <li key={item.name}><strong>{item.name}</strong> <span className="ps-status ps-status-planned">{item.status}</span><span>{item.note}</span></li>)}</ul>
      </div>

      <div className="ps-output" aria-labelledby="scope-output-title">
        <h3 id="scope-output-title">Your pilot scope</h3>
        {gaps.length
          ? <div className="ps-gaps" role="status" data-testid="scope-gaps"><strong>Still to agree ({gaps.length}):</strong><ul>{gaps.map(gap => <li key={gap}>{gap}</li>)}</ul></div>
          : <p className="ps-ready" role="status" data-testid="scope-gaps">Every part of the scope is filled in. It is a draft for discussion; nothing has been agreed.</p>}
        <label className="ps-wide" htmlFor={`${uid}-summary`}>Scope summary</label>
        <textarea id={`${uid}-summary`} readOnly rows={12} value={summary} data-testid="scope-summary" />
        <div className="ps-actions">
          <button type="button" onClick={copy}>Copy scope</button>
          <button type="button" onClick={download}>Download as text</button>
          <a className="ps-mail" href={mail.href} data-testid="scope-mailto">Open in your email app</a>
          <button type="button" className="ps-secondary" onClick={() => { resetScope(); setCopyStatus("Scope cleared."); }}>Start again</button>
        </div>
        {copyStatus && <p className="ps-copy-status" role="status">{copyStatus}</p>}
        <p className="ps-honest" data-testid="scope-send-notice">
          This page cannot send enquiries. “Open in your email app” starts a draft to {ENQUIRY_ADDRESS} with the scope filled in; you decide whether to send it.{mail.truncated ? " This scope is long, so the email draft is shortened; attach the downloaded text for the full version." : ""} If no email app opens, copy or download the scope and send it however you prefer.
        </p>
      </div>
    </section>
  );
}
