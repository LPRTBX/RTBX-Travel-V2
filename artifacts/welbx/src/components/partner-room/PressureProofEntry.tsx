import { Link } from "wouter";

const proofPaths = [
  {
    title: "One room-delay decision",
    href: "/partner-room/architecture-lab",
    detail: "Approve a synthetic response, check delivery, keep the original result and review a separate replay. Missing evidence and insufficient capacity stay visible.",
  },
  {
    title: "Peak-period team pressure",
    href: "/partner-room/product-proof/stage-3-operating-layer",
    detail: "Inspect the existing wellbeing and staffing simulation. Approval, staff release and arrival are separate; arrival evidence is required before break cover.",
  },
  {
    title: "Portfolio disruption",
    href: "/partner-room/product-proof/stage-3-operating-layer?scenario=portfolio",
    detail: "Compare network and local choices. Changed room capacity reopens approvals; receipts and named follow-up keep the unresolved booking visible.",
  },
];

/** Connects the public illustration to existing proof, not a new composite simulation. */
export function PressureProofEntry() {
  return (
    <section aria-labelledby="pressure-proof-heading" style={{ margin: "30px 0 40px", padding: "24px", border: "1px solid #617f88", borderRadius: 10, background: "#12323e" }}>
      <p style={{ color: "#a8dedb", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", marginTop: 0 }}>From public explanation to working synthetic proof</p>
      <h2 id="pressure-proof-heading" style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 34px)", lineHeight: 1.2 }}>Pressure → accountable action → checked recovery</h2>
      <p style={{ color: "#d4e1e5", maxWidth: 850, lineHeight: 1.7 }}>
        Friday at 4pm: arrivals, room delays and lift faults compete for the same team.
        The public example is an illustrative composite—not one executable case or a live hotel.
        Use the existing proof below to inspect individual decisions, owners and evidence.
      </p>
      <p style={{ color: "#a8dedb", fontWeight: 700 }}>Who owns it? What is still open? What shows it is resolved?</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 16 }}>
        {proofPaths.map(item => (
          <article key={item.href} style={{ padding: 18, background: "#0a2531", borderRadius: 6 }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 19, color: "#fff" }}>
              <Link href={item.href} style={{ color: "#a8dedb", textDecoration: "underline", textUnderlineOffset: 4 }}>{item.title}</Link>
            </h3>
            <p style={{ color: "#d4e1e5", fontSize: 15, lineHeight: 1.6, marginBottom: 0 }}>{item.detail}</p>
          </article>
        ))}
      </div>
      <p style={{ color: "#d4e1e5", lineHeight: 1.7 }}>
        Safety support starts earlier. Stage 3 explores broader coordination and reviewed learning across properties;
        it is not a live capability. Private staff support details belong only with authorised support roles, not broad team or portfolio views.
        Demonstration views are not authenticated role permissions.
      </p>
      <p style={{ color: "#d4e1e5", lineHeight: 1.7 }}>
        Continue through the <Link href="/partner-room#guided-route" style={{ color: "#a8dedb", textDecoration: "underline" }}>existing eight-step journey</Link>.
        Within <Link href="/partner-room/operations" style={{ color: "#a8dedb", textDecoration: "underline" }}>Operations</Link>, inspect the existing role views, Playbooks and Comms controls.
        Reuse validated mappings, playbooks and configuration only after systems access, integration testing and site readiness checks.
        Synthetic results do not establish live outcomes.
      </p>
    </section>
  );
}
