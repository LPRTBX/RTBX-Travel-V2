/**
 * JALDO Travel integration contract registry.
 *
 * Canonical capability requirements derived from the existing synthetic hotel
 * pathways and Travel integration responsibility records. This is NOT a vendor
 * API specification and does not promote any integration maturity.
 */
import { INTEGRATION_RECORDS, type IntegrationMaturity, type IntegrationProofStatus } from '../data/travelDeploymentPathway';
import { HOTEL_ROUTES, HOTEL_PATHS, type HotelPath } from './mockHotel';

export type ContractOperation = 'event' | 'read' | 'write' | 'action' | 'callback';
export type RequirementStatus = 'mapped' | 'gap';

export interface IntegrationCapability {
  operation: ContractOperation;
  object: string;
  required: boolean;
  purpose: string;
}

export interface IntegrationRequirement {
  id: string;
  status: RequirementStatus;
  system: string;
  providerHint?: string;
  maturity?: IntegrationMaturity;
  proof?: IntegrationProofStatus;
  capabilities: IntegrationCapability[];
  notes: string;
}

export interface ScenarioIntegrationContract {
  scenarioId: string;
  sourceKinds: Array<{ path: HotelPath; kind: string }>;
  requirements: IntegrationRequirement[];
  evidenceLevel: 'synthetic-contract-registry';
}

const capabilities: Record<string, IntegrationCapability[]> = {
  'int-pms': [
    { operation: 'event', object: 'reservation / room status change', required: true, purpose: 'Detect arrival, assignment, stay and room-state changes.' },
    { operation: 'read', object: 'reservation', required: true, purpose: 'Resolve reservation, arrival window, room assignment and stay context.' },
    { operation: 'read', object: 'room inventory / room status', required: true, purpose: 'Confirm availability and current room state.' },
    { operation: 'write', object: 'reservation / room note or status', required: false, purpose: 'Optional downstream operational update where the customer permits it.' },
  ],
  'int-housekeeping': [
    { operation: 'event', object: 'room readiness / task status', required: true, purpose: 'Receive cleaning, readiness and completion changes.' },
    { operation: 'read', object: 'housekeeping task / ETA', required: true, purpose: 'Confirm owner, state and expected completion.' },
    { operation: 'action', object: 'priority housekeeping task', required: false, purpose: 'Create or reprioritise an approved operational task.' },
    { operation: 'callback', object: 'task completion', required: true, purpose: 'Return completion evidence to the execution record.' },
  ],
  'int-crm-guest-profile': [
    { operation: 'read', object: 'guest profile / preferences / history', required: true, purpose: 'Add guest context without making the CRM the decision engine.' },
    { operation: 'write', object: 'guest note', required: false, purpose: 'Optionally return an approved service note.' },
  ],
  'int-task-management': [
    { operation: 'event', object: 'task / queue status', required: true, purpose: 'Detect backlog, assignment and completion changes.' },
    { operation: 'read', object: 'task / backlog', required: true, purpose: 'Resolve queue depth, owner and age.' },
    { operation: 'action', object: 'task create / priority update', required: true, purpose: 'Dispatch an approved operational action.' },
    { operation: 'callback', object: 'task acknowledgement / completion', required: true, purpose: 'Capture execution evidence and outcome state.' },
  ],
  'int-loyalty': [
    { operation: 'read', object: 'tier / eligibility / points context', required: true, purpose: 'Establish current loyalty context and eligibility.' },
    { operation: 'write', object: 'points / benefit activation', required: false, purpose: 'Expansion-only action subject to programme and commercial approval.' },
  ],
  'int-maintenance': [
    { operation: 'event', object: 'defect / work-order / asset alert', required: true, purpose: 'Detect a verified maintenance condition.' },
    { operation: 'read', object: 'asset / work order', required: true, purpose: 'Confirm severity, owner, history and current status.' },
    { operation: 'action', object: 'work order create / escalation', required: true, purpose: 'Dispatch an approved rectification action.' },
    { operation: 'callback', object: 'work-order status / resolution', required: true, purpose: 'Return remediation evidence and closure state.' },
  ],
  'int-guest-messaging': [
    { operation: 'event', object: 'guest request / reply / consent state', required: true, purpose: 'Receive guest-originated service and welfare signals where approved.' },
    { operation: 'read', object: 'channel preference / consent', required: true, purpose: 'Confirm an approved communication route.' },
    { operation: 'action', object: 'approved guest message', required: true, purpose: 'Send a governed acknowledgement, update or recovery message.' },
    { operation: 'callback', object: 'delivery / failure receipt', required: true, purpose: 'Prove whether the communication was delivered.' },
  ],
  'int-staff-app': [
    { operation: 'event', object: 'staff observation / acknowledgement', required: true, purpose: 'Receive staff-originated operational or welfare signals.' },
    { operation: 'read', object: 'role / assignment context', required: true, purpose: 'Resolve the intended operational owner.' },
    { operation: 'action', object: 'staff prompt / task / escalation', required: true, purpose: 'Route approved action to the accountable role.' },
    { operation: 'callback', object: 'acknowledgement / completion', required: true, purpose: 'Record receipt and execution evidence.' },
  ],
  'int-iot-sensors': [
    { operation: 'event', object: 'environmental / asset alert', required: true, purpose: 'Receive a preclassified building or room condition.' },
    { operation: 'read', object: 'asset / sensor metadata', required: true, purpose: 'Resolve asset identity, unit, threshold and location.' },
    { operation: 'callback', object: 'clear / restored state', required: false, purpose: 'Confirm the physical alert has cleared where the source supports it.' },
  ],
};

const scenarioDependencies: Record<string, Array<string | { gap: string; system: string; capabilities: IntegrationCapability[]; notes: string }>> = {
  'repeat-guest-room-not-ready': ['int-pms', 'int-housekeeping', 'int-crm-guest-profile', 'int-guest-messaging', 'int-staff-app'],
  'service-backlog': ['int-task-management', 'int-staff-app', 'int-guest-messaging'],
  'maintenance-defect': ['int-maintenance', 'int-iot-sensors', 'int-task-management', 'int-staff-app'],
  'distressed-guest': ['int-guest-messaging', 'int-staff-app'],
  'transport-disruption': ['int-pms', 'int-guest-messaging', 'int-staff-app', {
    gap: 'gap-transport-provider',
    system: 'Transport / transfer provider',
    capabilities: [
      { operation: 'event', object: 'booking / disruption status', required: true, purpose: 'Receive provider delay, cancellation or missed-transfer state.' },
      { operation: 'read', object: 'transfer booking / ETA', required: true, purpose: 'Confirm affected guest, booking and expected service.' },
      { operation: 'callback', object: 'recovery / rebooking status', required: true, purpose: 'Return the transport recovery outcome.' },
    ],
    notes: 'No canonical Transport integration record exists yet; requires provider discovery and interface mapping.',
  }],
  'premium-guest-opportunity': ['int-loyalty', 'int-crm-guest-profile', 'int-guest-messaging', {
    gap: 'gap-marketplace-activation',
    system: 'Marketplace / offer activation partner',
    capabilities: [
      { operation: 'read', object: 'current offer eligibility / terms', required: true, purpose: 'Verify the offer is genuinely available to the guest.' },
      { operation: 'action', object: 'approved offer activation', required: true, purpose: 'Activate only after consent, governance and commercial approval.' },
      { operation: 'callback', object: 'activation / redemption outcome', required: true, purpose: 'Return fulfilment evidence and outcome state.' },
    ],
    notes: 'Marketplace OS is expansion-only and no production marketplace connector is claimed.',
  }],
};

const records = new Map(INTEGRATION_RECORDS.map(record => [record.id, record]));
const sourceKindsByScenario = new Map<string, Array<{ path: HotelPath; kind: string }>>();
for (const path of HOTEL_PATHS) {
  for (const [kind, scenarioId] of Object.entries(HOTEL_ROUTES[path])) {
    const items = sourceKindsByScenario.get(scenarioId) ?? [];
    items.push({ path, kind });
    sourceKindsByScenario.set(scenarioId, items);
  }
}

function requirement(item: string | { gap: string; system: string; capabilities: IntegrationCapability[]; notes: string }): IntegrationRequirement {
  if (typeof item !== 'string') return { id: item.gap, status: 'gap', system: item.system, capabilities: item.capabilities, notes: item.notes };
  const record = records.get(item);
  if (!record) throw new Error(`Unknown integration record ${item}`);
  return {
    id: record.id,
    status: 'mapped',
    system: record.system,
    providerHint: record.provider,
    maturity: record.maturity,
    proof: record.proof,
    capabilities: capabilities[record.id] ?? [],
    notes: record.maturityNote ?? 'No maturity note supplied.',
  };
}

export const TRAVEL_INTEGRATION_CONTRACTS: ScenarioIntegrationContract[] = Object.entries(scenarioDependencies).map(([scenarioId, deps]) => ({
  scenarioId,
  sourceKinds: sourceKindsByScenario.get(scenarioId) ?? [],
  requirements: deps.map(requirement),
  evidenceLevel: 'synthetic-contract-registry',
}));

export function integrationContractForScenario(scenarioId: string): ScenarioIntegrationContract | undefined {
  return TRAVEL_INTEGRATION_CONTRACTS.find(contract => contract.scenarioId === scenarioId);
}

export function integrationRegistrySummary() {
  const allKinds = HOTEL_PATHS.flatMap(path => Object.keys(HOTEL_ROUTES[path]).map(kind => `${path}:${kind}`));
  const coveredKinds = new Set(TRAVEL_INTEGRATION_CONTRACTS.flatMap(contract => contract.sourceKinds.map(item => `${item.path}:${item.kind}`)));
  const gaps = TRAVEL_INTEGRATION_CONTRACTS.flatMap(contract => contract.requirements.filter(item => item.status === 'gap').map(item => ({ scenarioId: contract.scenarioId, id: item.id, system: item.system })));
  return {
    schemaVersion: 'jaldo.integration-contract-registry.v1',
    evidenceLevel: 'synthetic-contract-registry',
    scenarioContracts: TRAVEL_INTEGRATION_CONTRACTS.length,
    inputKinds: allKinds.length,
    coveredInputKinds: coveredKinds.size,
    mappedSystemRequirements: TRAVEL_INTEGRATION_CONTRACTS.flatMap(c => c.requirements).filter(r => r.status === 'mapped').length,
    explicitGaps: gaps,
  };
}
