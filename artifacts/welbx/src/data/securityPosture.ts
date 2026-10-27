/**
 * Security and data handling for the Integration Brief.
 *
 * Three separate claims, never mixed:
 * - verified: a control this build has, with the automated check that proves it;
 * - demonstrated: behaviour the demonstration shows, which is not a security control;
 * - required: what a production pilot needs before live data, none of it in place.
 * No certification is claimed.
 */

export interface SecurityItem {
  title: string;
  detail: string;
  /** Verified items only: the automated check that proves the claim. */
  evidence?: string;
}

export const VERIFIED_CONTROLS: SecurityItem[] = [
  {
    title: "Scenario and pilot-scope content stays in the browser during the tested journey",
    detail: "The server checks partner entry and session expiry. Scenario runs, their evidence, configuration and pilot scope remain in this page's memory; drafted communications are never delivered. Partner pages request typefaces from Google Fonts. These requests carry ordinary request metadata, but not scenario or scope content. Public pages use system fonts.",
    evidence: "Tests on a local build cover server entry and session checks separately from synthetic workflows. Supporting evidence: a scan of the app's own source allows fetch only for the partner session endpoint; scenario content is not sent by those calls. This does not cover third-party libraries or the hosting platform.",
  },
  {
    title: "Configuration and runs stay on this device",
    detail: "Configuration, runs, evidence and pilot scope are held in page memory, not persistent browser storage. They end on refresh or leaving the room. Previously persisted synthetic configuration is removed, not restored.",
    evidence: "Unit and browser checks for the session store: records clear on refresh, reset and re-activation.",
  },
  {
    title: "Partner pages and assets require server-verified access",
    detail: "The public introduction and sample demo do not load the partner application. All other pages, scripts and downloads are denied without a valid server session. Entry fails closed when the secret is missing. A shared code is not named-user identity or authorization for live data.",
    evidence: "Server boundary tests cover anonymous direct routes and assets, wrong codes, session expiry, revocation and logout. Build checks retain the exclusion of unapproved commercial modules. These checks do not assert that the published site has been updated.",
  },
];

export const DEMONSTRATED_BEHAVIOUR: SecurityItem[] = [
  {
    title: "Named-role approval",
    detail: "Actions wait for the scenario's approval role, and a wrong role is refused. In the demonstration the role is chosen, not signed in, so this shows the rule rather than securing it.",
  },
  {
    title: "Evidence before closure",
    detail: "A case cannot close until the evidence the configuration requires has been recorded.",
  },
  {
    title: "Restricted welfare handling",
    detail: "Welfare cases are decided only by a person, with human-authored drafts. Portfolio views see only that a restricted case is open.",
  },
];

export const PILOT_SECURITY_REQUIREMENTS: SecurityItem[] = [
  { title: "Named sign-in and server-side permissions", detail: "Single sign-on for every user, with roles enforced on the server so an approval is a named person's decision." },
  { title: "Encryption and hosting", detail: "Encrypted connections and storage, hosted in an agreed region, with fonts and other assets self-hosted so no third party is contacted." },
  { title: "Audit trail", detail: "A tamper-evident record of decisions and evidence, with agreed retention and access." },
  { title: "Privacy and data agreements", detail: "A data processing agreement, a privacy impact assessment, and minimisation rules for guest and welfare information." },
  { title: "Integration credentials", detail: "Least-privilege, read-first access to the PMS and other systems, approved by each vendor and held in a secrets manager." },
  { title: "Independent testing and response", detail: "A penetration test before live data, an incident response plan with named contacts, backups and regular access reviews." },
];

/** Where these findings come from, and what has not been checked. */
export const VERIFICATION_SCOPE =
  "These findings come from automated checks on a local build. The deployed Replit site has not been checked from this environment, so its hosting may add requests of its own (for example platform scripts or analytics). Third parties on the deployed site, including whether Google Fonts is the only one, must be verified there before any of these claims are repeated about it.";

export const CERTIFICATION_STATEMENT =
  "This demonstration makes no certification claim (for example ISO 27001 or SOC 2), and none is evidenced here. Any certification the partner requires is a pilot prerequisite to agree.";
