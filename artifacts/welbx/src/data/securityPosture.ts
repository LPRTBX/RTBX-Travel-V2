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
    detail: "The demonstration has no backend. In the tested journey, scenario runs, their evidence and the pilot scope are held in this browser and are not sent anywhere, and drafted communications are never delivered. The page does request its typefaces from Google Fonts. Like any web request, those carry ordinary request metadata (such as the device's IP address, the browser's user agent and, depending on browser settings, the page address as referrer), but none of the scenario or scope content.",
    evidence: "Browser check on a local build in Chromium: across the full Partner Room journey every request is a GET to the app itself or to Google Fonts, and none carries a request body. Supporting evidence: a scan of the app's own source finds no fetch, XMLHttpRequest, WebSocket, EventSource or sendBeacon calls. The scan does not cover third-party libraries or the hosting platform, so it supports the claim rather than proving it.",
  },
  {
    title: "Configuration and runs stay on this device",
    detail: "An activated configuration is kept in this browser's local storage and is rejected on load unless it is marked synthetic. Runs and their evidence are held in memory and end when the page is refreshed.",
    evidence: "Unit and browser checks for the session store: records clear on refresh, reset and re-activation.",
  },
  {
    title: "Restricted material is kept out of the published build",
    detail: "Only approved routes are reachable, and restricted modules and content cannot enter the production bundle.",
    evidence: "CI on every pull request: check-access-boundaries and check-bundle-boundaries fail the build if either is breached.",
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
  {
    title: "Partner Room access code",
    detail: "A preview code keeps casual visitors out. It is checked in the browser and shipped with the page, so it is not authentication or access control.",
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
