/**
 * OHIP sandbox qualification model.
 * Pure configuration/readiness logic only; this module never makes network calls.
 */
import { ORACLE_OHIP_OPERATIONS } from './oracleOhipMapping';

export const OHIP_SANDBOX_ENV_KEYS = [
  'OHIP_GATEWAY_URL',
  'OHIP_APP_KEY',
  'OHIP_CLIENT_ID',
  'OHIP_CLIENT_SECRET',
  'OHIP_ENTERPRISE_ID',
  'OHIP_HOTEL_ID',
] as const;

export const OHIP_DEFAULT_SCOPE = 'urn:opc:hgbu:ws:__myscopes__';

export type OhipSandboxEnvKey = typeof OHIP_SANDBOX_ENV_KEYS[number];

export interface OhipSandboxReadiness {
  ready: boolean;
  missing: OhipSandboxEnvKey[];
  evidenceLevel: 'qualification-harness-only';
  liveCallsAttempted: 0;
  documentedOperationsAvailableForQualification: number;
  secretValuesExposed: false;
}

export function assessOhipSandboxReadiness(env: Record<string, string | undefined>): OhipSandboxReadiness {
  const missing = OHIP_SANDBOX_ENV_KEYS.filter(key => !env[key]?.trim());
  return {
    ready: missing.length === 0,
    missing,
    evidenceLevel: 'qualification-harness-only',
    liveCallsAttempted: 0,
    documentedOperationsAvailableForQualification: ORACLE_OHIP_OPERATIONS.length,
    secretValuesExposed: false,
  };
}

export const OHIP_SANDBOX_QUALIFICATION_PLAN = [
  {
    id: 'oauth-client-credentials',
    evidenceTarget: 'sandbox-authenticated',
    purpose: 'Obtain an OAuth token using OCIM client credentials without persisting the token.',
    required: true,
  },
  {
    id: 'housekeeping-overview-read',
    evidenceTarget: 'sandbox-property-read',
    purpose: 'Verify authenticated property API access using the HSK housekeeping overview operation.',
    required: true,
  },
  {
    id: 'reservation-read',
    evidenceTarget: 'sandbox-reservation-read',
    purpose: 'Verify a configured reservation smoke path when an approved sandbox query is supplied.',
    required: false,
  },
  {
    id: 'streaming-business-event',
    evidenceTarget: 'sandbox-streaming-event',
    purpose: 'Later verify configured OHIP Streaming Business Events and required trigger fields.',
    required: false,
  },
] as const;

export function safeOhipQualificationDescriptor(env: Record<string, string | undefined>) {
  const readiness = assessOhipSandboxReadiness(env);
  return {
    ...readiness,
    gatewayConfigured: Boolean(env.OHIP_GATEWAY_URL?.trim()),
    hotelConfigured: Boolean(env.OHIP_HOTEL_ID?.trim()),
    scopeConfigured: Boolean((env.OHIP_SCOPE || OHIP_DEFAULT_SCOPE).trim()),
    plan: OHIP_SANDBOX_QUALIFICATION_PLAN,
  };
}
