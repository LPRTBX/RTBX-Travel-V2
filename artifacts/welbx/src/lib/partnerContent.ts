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

const CONTENT_URL =
  (import.meta.env.VITE_PARTNER_CONTENT_URL as string | undefined) ||
  "/partner-content.json";

export async function fetchPartnerContent(): Promise<PartnerContent | null> {
  try {
    const res = await fetch(CONTENT_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as PartnerContent;
  } catch {
    return null;
  }
}
