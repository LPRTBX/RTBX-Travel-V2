/**
 * Partner Content — Sprint 1 resolution: Option B
 *
 * The application previously attempted to silently fetch /partner-content.json.
 * No such file exists and the fetch failed silently on every page load.
 *
 * Resolution: the false fetch mechanism has been removed. All partner-room
 * content is currently managed in code (data/ files and page components).
 *
 * External / CMS-based content management is deferred to a future sprint.
 * When activated, implement the schema below and supply the file via
 * VITE_PARTNER_CONTENT_URL or as public/partner-content.json.
 *
 * Note: VITE_PARTNER_CONTENT_URL is accepted as an env var but currently unused.
 */

export interface PartnerFlowStep {
  label: string;
  desc: string;
}

export interface PartnerPath {
  title: string;
  sub: string;
  desc: string;
  cta: string;
  link: string;
  color: string;
}

export interface OverviewSection {
  num: string;
  heading: string;
  body: string;
}

export interface LogicChainStep {
  step: string;
  label: string;
  desc: string;
}

export interface PilotPhase {
  num: string;
  title: string;
  duration: string;
  desc: string;
  color: string;
}

export interface ValuePathway {
  title: string;
  sub: string;
  desc: string;
  points: string[];
  color: string;
}

export interface PartnerContent {
  contentVersion?: string;
  lastUpdated?: string;
  landing?: {
    tagline?: string;
    headline?: string;
    subheadline?: string;
    flowSteps?: PartnerFlowStep[];
    partnerPaths?: PartnerPath[];
  };
  overview?: {
    headline?: string;
    sections?: OverviewSection[];
  };
  momentsEconomy?: {
    headline?: string;
    subheadline?: string;
  };
  signalsEngine?: {
    headline?: string;
    subheadline?: string;
    logicChain?: LogicChainStep[];
  };
  pilotModel?: {
    headline?: string;
    subheadline?: string;
    phases?: PilotPhase[];
    successCriteria?: string[];
  };
  commercialModel?: {
    headline?: string;
    subheadline?: string;
    valuePathways?: ValuePathway[];
  };
  demoPaths?: {
    headline?: string;
    subheadline?: string;
  };
}

/**
 * Returns null — content is currently code-managed.
 * Replace this function body when external CMS is activated.
 */
export async function fetchPartnerContent(): Promise<PartnerContent | null> {
  // Content is code-managed. External content loading is deferred.
  // See docs/route-register.md for the deferred content-management item.
  return null;
}
