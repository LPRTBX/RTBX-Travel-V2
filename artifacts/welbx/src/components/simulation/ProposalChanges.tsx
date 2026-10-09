import { describePolicyChanges, type PolicySettings } from "@/lib/plainLanguage";

/** A learning proposal as a before → after list of only the settings it changes. */
export function ProposalChanges({ before, after }: { before: PolicySettings; after: PolicySettings }) {
  const changes = describePolicyChanges(before, after);
  if (!changes.length) return <p className="proposal-changes-none">This proposal does not change any setting.</p>;
  return <table className="proposal-changes">
    <caption className="sr-only">Proposed setting changes</caption>
    <thead><tr><th scope="col">Setting</th><th scope="col">Now</th><th scope="col">Proposed</th></tr></thead>
    <tbody>{changes.map(change => <tr key={change.setting}><th scope="row">{change.setting}</th><td>{change.from}</td><td>{change.to}</td></tr>)}</tbody>
  </table>;
}
