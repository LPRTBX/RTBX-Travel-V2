import { useState } from "react";
import {
  CAPABILITY_LABELS, MIN_RETURN_REASON, PORTFOLIO_ACTORS, PORTFOLIO_EXCEPTIONS, PORTFOLIO_PROPERTIES,
  actorLabel, decideException, newExceptionRecord, pendingApprovers,
  type CapabilityStatus, type ExceptionRecord,
} from "@/lib/portfolioCoordination";
import { usePartnerRoomNavigate } from "@/components/PartnerRoomLayout";
import "./portfolio-coordination.css";

const CAPABILITIES: Array<{ status: CapabilityStatus; items: string[] }> = [
  { status: "implemented", items: [
    "Approval by the named role before action; a wrong role is refused",
    "Return with a recorded reason",
    "Required evidence before a case can close",
    "Welfare cases decided only by a person, with restricted drafts",
  ] },
  { status: "simulated", items: [
    "Several properties with their own accountable people",
    "Portfolio exception rules and multi-role approval",
    "De-identified portfolio view of restricted cases",
  ] },
  { status: "proposed", items: [
    "PMS, housekeeping and task feeds from each property",
    "Group directory sign-in so each approval is a named person",
    "Cross-property room inventory and guest messaging with receipts",
  ] },
];

const KIND_LABELS = { pattern: "Repeated pattern", authority: "Beyond local authority", welfare: "Restricted · stays local" } as const;

export function PortfolioCoordination() {
  const navigateTo = usePartnerRoomNavigate();
  const [selectedId, setSelectedId] = useState(PORTFOLIO_EXCEPTIONS[0].id);
  const [actorId, setActorId] = useState("regional-ops");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<{ tone: "refused" | "done"; text: string } | null>(null);
  const [records, setRecords] = useState<Record<string, ExceptionRecord>>(
    () => Object.fromEntries(PORTFOLIO_EXCEPTIONS.map(ex => [ex.id, newExceptionRecord(ex.id)])),
  );
  const exception = PORTFOLIO_EXCEPTIONS.find(ex => ex.id === selectedId)!;
  const record = records[selectedId];
  const pending = pendingApprovers(exception, record);

  const act = (action: "approve" | "return") => {
    try {
      const next = decideException(exception, record, actorId, action, reason);
      setRecords(prev => ({ ...prev, [selectedId]: next }));
      setReason("");
      setMessage({ tone: "done", text: action === "return"
        ? `Returned by ${actorLabel(actorId)}. Nothing proceeds; the properties keep their cases.`
        : next.status === "approved"
          ? `Approved by ${actorLabel(actorId)}. All required approvals are recorded (simulated); nothing was sent.`
          : `Approval recorded for ${actorLabel(actorId)}. Still needed: ${pendingApprovers(exception, next).map(actorLabel).join(", ")}.` });
    } catch (error) {
      setMessage({ tone: "refused", text: error instanceof Error ? error.message : String(error) });
    }
  };

  const select = (id: string) => { setSelectedId(id); setMessage(null); setReason(""); };

  return (
    <section id="portfolio-coordination" className="pc" aria-labelledby="portfolio-coordination-title">
      <p className="pc-eyebrow">Stage 3 · Portfolio coordination · planned simulation</p>
      <h2 id="portfolio-coordination-title">Several properties, local accountability, one governed portfolio response.</h2>
      <p className="pc-lead">
        Each property keeps its own accountable people and decides its own cases. Only situations that cross a property's authority, or repeat across properties, reach the portfolio, and each names exactly who may decide it.
      </p>
      <p className="pc-synthetic" data-testid="portfolio-synthetic">
        <strong>Synthetic data.</strong> Every property, person, case and count below is fictional. No system is connected and nothing is sent.
      </p>

      <ul className="pc-properties" aria-label="Properties in the portfolio">
        {PORTFOLIO_PROPERTIES.map(property => {
          const involved = exception.propertyIds.includes(property.id);
          return (
            <li key={property.id} className={`pc-property${involved ? " pc-involved" : ""}`} data-property={property.id}>
              <h3>{property.name}</h3>
              <p className="pc-meta">{property.type} · {property.size}</p>
              <p className="pc-authority"><span>Decides locally:</span> {property.localAuthority}</p>
              <ul className="pc-cases">
                {property.cases.map(item => (
                  <li key={item.title}><strong>{item.title}</strong><span>{actorLabel(item.ownerId)} · {item.state}</span></li>
                ))}
              </ul>
              {involved && <p className="pc-flag">Part of the selected exception</p>}
            </li>
          );
        })}
      </ul>

      <div className="pc-workspace">
        <div className="pc-exceptions">
          <h3>Portfolio exceptions</h3>
          <ul aria-label="Portfolio exceptions">
            {PORTFOLIO_EXCEPTIONS.map(item => (
              <li key={item.id}>
                <button type="button" aria-pressed={item.id === selectedId} onClick={() => select(item.id)} className="pc-exception">
                  <span className={`pc-kind pc-kind-${item.kind}`}>{KIND_LABELS[item.kind]}</span>
                  <span className="pc-exception-title">{item.title}</span>
                  <span className="pc-exception-status">{statusText(records[item.id], item.kind)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="pc-response" role="region" aria-label={`Governed response: ${exception.title}`} data-testid="portfolio-response">
          <h3>{exception.title}</h3>
          <dl>
            <div><dt>Why it reached the portfolio</dt><dd>{exception.rule}</dd></div>
            <div><dt>Proposed response</dt><dd>{exception.proposedResponse}</dd></div>
            <div><dt>Stays with the properties</dt><dd>{exception.staysLocal}</dd></div>
            <div><dt>Who decides</dt><dd data-testid="portfolio-decider">{exception.kind === "welfare"
              ? `${actorLabel(exception.localDeciderId!)}, on site. The portfolio cannot decide this case.`
              : exception.requiredApproverIds.map(actorLabel).join(" and then ")}</dd></div>
            <div><dt>Evidence required</dt><dd><ul>{exception.evidenceRequired.map(item => <li key={item}>{item}</li>)}</ul></dd></div>
          </dl>

          {record.entries.length > 0 && (
            <ol className="pc-log" aria-label="Recorded decisions (synthetic)">
              {record.entries.map((entry, i) => (
                <li key={i}>{entry.action === "approved" ? "Approved" : "Returned"} by {actorLabel(entry.actorId)} (simulated){entry.reason ? `: “${entry.reason}”` : ""}</li>
              ))}
            </ol>
          )}

          {record.status === "awaiting" && (
            <div className="pc-controls">
              <label htmlFor="pc-actor">Act as</label>
              <select id="pc-actor" value={actorId} onChange={event => { setActorId(event.target.value); setMessage(null); }}>
                {PORTFOLIO_ACTORS.map(actor => <option key={actor.id} value={actor.id}>{actor.label}</option>)}
              </select>
              {exception.kind !== "welfare" && pending.length > 0 && (
                <p className="pc-pending">Waiting for: {pending.map(actorLabel).join(", ")}</p>
              )}
              <label htmlFor="pc-reason">Reason, if returning</label>
              <textarea id="pc-reason" rows={2} value={reason} onChange={event => setReason(event.target.value)} placeholder={`At least ${MIN_RETURN_REASON} characters`} />
              <div className="pc-buttons">
                <button type="button" onClick={() => act("approve")}>Approve as selected role</button>
                <button type="button" onClick={() => act("return")}>Return with reason</button>
              </div>
            </div>
          )}
          {message && <p className={`pc-message pc-${message.tone}`} role={message.tone === "refused" ? "alert" : "status"} data-testid="portfolio-message">{message.text}</p>}
          <p className="pc-boundary">No room is moved, no guest or partner is contacted and no system is updated. Approvals here are simulated by choosing a role; a pilot needs named sign-in.</p>
        </div>
      </div>

      <div className="pc-capabilities" aria-label="What is implemented, simulated and proposed">
        {CAPABILITIES.map(group => (
          <div key={group.status} className={`pc-capability pc-capability-${group.status}`} data-capability={group.status}>
            <h3>{CAPABILITY_LABELS[group.status]}</h3>
            <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        ))}
      </div>

      <a href="/partner-room/pilot-model#pilot-scope" className="pc-next" onClick={event => { event.preventDefault(); navigateTo("/partner-room/pilot-model#pilot-scope"); }}>
        Scope a pilot: properties, accountable people and moments →
      </a>
    </section>
  );
}

function statusText(record: ExceptionRecord, kind: string) {
  if (kind === "welfare") return "Handled on site · portfolio sees status only";
  if (record.status === "approved") return "Approved (simulated)";
  if (record.status === "returned") return "Returned with reason";
  return record.entries.length ? "Partly approved" : "Awaiting decision";
}
