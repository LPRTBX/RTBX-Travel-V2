import {
  CERTIFICATION_STATEMENT, DEMONSTRATED_BEHAVIOUR, PILOT_SECURITY_REQUIREMENTS, VERIFIED_CONTROLS, type SecurityItem,
} from "@/data/securityPosture";
import { usePartnerRoomNavigate } from "@/components/PartnerRoomLayout";
import "./security-and-data.css";

function Group({ id, title, note, items, tone }: { id: string; title: string; note: string; items: SecurityItem[]; tone: string }) {
  return (
    <div className={`sd-group sd-${tone}`} data-testid={`security-${id}`}>
      <h3>{title}</h3>
      <p className="sd-note">{note}</p>
      <ul>
        {items.map(item => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
            {item.evidence && <span className="sd-evidence"><em>Evidence:</em> {item.evidence}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SecurityAndData() {
  const navigateTo = usePartnerRoomNavigate();
  return (
    <section id="security-data" className="sd" aria-labelledby="security-data-title">
      <p className="sd-eyebrow">Security and data</p>
      <h2 id="security-data-title">What is verified today, what is only demonstrated, and what a pilot needs.</h2>
      <div className="sd-groups">
        <Group id="verified" tone="verified" title="Verified controls in this build" note="Each claim is checked automatically on every pull request." items={VERIFIED_CONTROLS} />
        <Group id="demonstrated" tone="demonstrated" title="Demonstrated behaviour" note="Shown working in the demonstration. These are not security controls." items={DEMONSTRATED_BEHAVIOUR} />
        <Group id="required" tone="required" title="Required for a production pilot" note="None of these is in place. They are prerequisites before live guest or staff data." items={PILOT_SECURITY_REQUIREMENTS} />
      </div>
      <p className="sd-certification" data-testid="security-certification">{CERTIFICATION_STATEMENT}</p>
      <a href="/partner-room/pilot-model#pilot-scope" className="sd-next" onClick={event => { event.preventDefault(); navigateTo("/partner-room/pilot-model#pilot-scope"); }}>
        Add integration and security prerequisites to a pilot scope →
      </a>
    </section>
  );
}
