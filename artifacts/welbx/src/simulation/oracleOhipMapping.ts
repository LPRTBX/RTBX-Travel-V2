/**
 * Oracle Hospitality Integration Platform (OHIP) documentation map for JALDO Travel.
 * Evidence level: documentation-mapped only.
 * This does NOT claim sandbox testing, customer approval, live exchange,
 * connector-ready status, integration, or production operation.
 */
import { TRAVEL_INTEGRATION_CONTRACTS, type ContractOperation } from './integrationContractRegistry';

export type VendorEvidenceLevel =
  | 'documentation-mapped'
  | 'sandbox-tested'
  | 'customer-staging-tested'
  | 'production-observed';
export type VendorCoverage = 'mapped' | 'partial' | 'not-mapped';

export interface OracleOhipOperationMap {
  id: string;
  jaldoRequirementId: string;
  jaldoOperation: ContractOperation;
  jaldoObject: string;
  coverage: VendorCoverage;
  oracleModule: string;
  oracleOperation: string;
  methodOrTransport: string;
  endpointOrEvent: string;
  purpose: string;
  prerequisites: string[];
  evidenceLevel: VendorEvidenceLevel;
  notes?: string;
}

export const ORACLE_OHIP_EVIDENCE_LEVEL: VendorEvidenceLevel = 'documentation-mapped';

export const ORACLE_OHIP_AUTH = {
  targetScheme: 'OCIM client credentials',
  required: [
    'OAuth Client ID', 'OAuth Client Secret', 'Application Key (x-app-key)',
    'Hotel ID (x-hotelid)', 'Gateway URL', 'Scope', 'Enterprise ID',
  ],
  requestHeaders: ['Authorization: Bearer <token>', 'x-app-key', 'x-hotelid'],
  optionalHeaders: ['x-externalSystem', 'x-hubid', 'X-Request-Id'],
  secretBoundary: 'Credentials must remain server-side and must not be placed in the browser bundle or synthetic fixtures.',
  evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
} as const;

export const ORACLE_OHIP_STREAMING = {
  transport: 'WebSocket / OHIP Streaming API',
  use: 'Subscribe to OPERA Cloud Business Events instead of continuously polling where the required event is available.',
  prerequisites: [
    'Eligible OHIP environment with Streaming enabled',
    'Customer/environment access approval',
    'Application event subscriptions configured in the Developer Portal',
    'Business Event triggers configured for every data element JALDO requires',
    'External system/event configuration agreed for the target environment',
  ],
  triggerBoundary: 'OHIP 25.4+ includes only explicitly configured trigger data elements in the Business Event detail array; JALDO must validate required fields against the customer event configuration.',
  validationBoundary: 'A successful partner streaming test proves the partner code receives configured events without errors; Oracle states this is not Oracle validation.',
  evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
} as const;

export const ORACLE_OHIP_OPERATIONS: OracleOhipOperationMap[] = [
  {
    id: 'ohip-pms-reservation-event', jaldoRequirementId: 'int-pms', jaldoOperation: 'event',
    jaldoObject: 'reservation / room status change', coverage: 'partial', oracleModule: 'Streaming Business Events',
    oracleOperation: 'Business Events subscription', methodOrTransport: 'WebSocket',
    endpointOrEvent: 'Reservation / CHECK IN / CHECK OUT / UPDATE RESERVATION business events',
    purpose: 'Push reservation and stay-state changes into the JALDO signal intake layer.',
    prerequisites: [...ORACLE_OHIP_STREAMING.prerequisites], evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
    notes: 'Room-status events are separately mapped through Housekeeping. Exact event/detail fields must be proven in sandbox trigger configuration.',
  },
  {
    id: 'ohip-pms-reservation-read', jaldoRequirementId: 'int-pms', jaldoOperation: 'read',
    jaldoObject: 'reservation', coverage: 'mapped', oracleModule: 'RSV',
    oracleOperation: 'getReservations / getReservation', methodOrTransport: 'REST',
    endpointOrEvent: '/rsv/v1/hotels/{HotelId}/reservations and reservation detail operation',
    purpose: 'Resolve reservation identity, stay status, arrival/departure and room context.',
    prerequisites: [...ORACLE_OHIP_AUTH.required], evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
  },
  {
    id: 'ohip-housekeeping-status-event', jaldoRequirementId: 'int-housekeeping', jaldoOperation: 'event',
    jaldoObject: 'room readiness / task status', coverage: 'partial', oracleModule: 'Streaming Business Events / HSK',
    oracleOperation: 'Business Events subscription', methodOrTransport: 'WebSocket',
    endpointOrEvent: 'UPDATE ROOM STATUS / GUEST SERVICE STATUS REQUEST',
    purpose: 'Push housekeeping room-status and configured guest-service status changes.',
    prerequisites: [...ORACLE_OHIP_STREAMING.prerequisites], evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
    notes: 'This does not by itself prove housekeeping task lifecycle events or ETA fields.',
  },
  {
    id: 'ohip-housekeeping-overview-read', jaldoRequirementId: 'int-housekeeping', jaldoOperation: 'read',
    jaldoObject: 'housekeeping task / ETA', coverage: 'partial', oracleModule: 'HSK',
    oracleOperation: 'getHousekeepingOverview / getHouseKeepingTasks', methodOrTransport: 'REST',
    endpointOrEvent: '/hsk/v1/hotels/{HotelId}/housekeepingOverview and housekeeping task operations',
    purpose: 'Read current room housekeeping state and available housekeeping task information.',
    prerequisites: [...ORACLE_OHIP_AUTH.required], evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
    notes: 'Task ownership/ETA fields required by a specific hotel configuration must be confirmed in sandbox.',
  },
  {
    id: 'ohip-housekeeping-room-status-write', jaldoRequirementId: 'int-housekeeping', jaldoOperation: 'action',
    jaldoObject: 'priority housekeeping task', coverage: 'partial', oracleModule: 'HSK',
    oracleOperation: 'putRoomRelatedStatus', methodOrTransport: 'REST PUT',
    endpointOrEvent: '/hsk/v1/hotels/{HotelId}/rooms/status',
    purpose: 'Update an approved housekeeping room status when the deployment permits JALDO to write back.',
    prerequisites: [...ORACLE_OHIP_AUTH.required, 'Customer-approved write permission and governance'], evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
    notes: 'This is a room-status write, not proof of generic task creation or prioritisation.',
  },
  {
    id: 'ohip-profile-read', jaldoRequirementId: 'int-crm-guest-profile', jaldoOperation: 'read',
    jaldoObject: 'guest profile / preferences / history', coverage: 'partial', oracleModule: 'CRM',
    oracleOperation: 'searchProfiles', methodOrTransport: 'REST POST', endpointOrEvent: '/profiles/searches',
    purpose: 'Locate guest profile context that may contribute to JALDO context assembly.',
    prerequisites: [...ORACLE_OHIP_AUTH.required, 'Customer-approved profile data scope and privacy controls'], evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
    notes: 'Exact preference/history fields and property-specific identification behavior must be confirmed against the target environment.',
  },
  {
    id: 'ohip-maintenance-read', jaldoRequirementId: 'int-maintenance', jaldoOperation: 'read',
    jaldoObject: 'asset / work order', coverage: 'partial', oracleModule: 'HSK',
    oracleOperation: 'getRoomMaintenance / getOutOfServiceRooms', methodOrTransport: 'REST',
    endpointOrEvent: 'Housekeeping room-maintenance and out-of-service operations',
    purpose: 'Read room-maintenance and room-availability exception state.',
    prerequisites: [...ORACLE_OHIP_AUTH.required], evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
    notes: 'JALDO generic asset/work-order semantics are broader than OPERA room-maintenance semantics.',
  },
  {
    id: 'ohip-maintenance-action', jaldoRequirementId: 'int-maintenance', jaldoOperation: 'action',
    jaldoObject: 'work order create / escalation', coverage: 'partial', oracleModule: 'HSK',
    oracleOperation: 'postRoomMaintenance / putRoomMaintenance', methodOrTransport: 'REST POST / PUT',
    endpointOrEvent: 'Room maintenance operations',
    purpose: 'Create or update approved room-maintenance records where the deployment permits write-back.',
    prerequisites: [...ORACLE_OHIP_AUTH.required, 'Customer-approved write permission and maintenance workflow mapping'], evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
    notes: 'Does not prove an external CMMS work-order or escalation connector.',
  },
];

const contractRequirementIds = new Set(TRAVEL_INTEGRATION_CONTRACTS.flatMap(contract => contract.requirements.map(requirement => requirement.id)));

export function validateOracleOhipMap() {
  const errors: string[] = [];
  for (const mapping of ORACLE_OHIP_OPERATIONS) {
    if (!contractRequirementIds.has(mapping.jaldoRequirementId)) errors.push('Unknown JALDO requirement: ' + mapping.jaldoRequirementId);
    const requirement = TRAVEL_INTEGRATION_CONTRACTS.flatMap(contract => contract.requirements).find(item => item.id === mapping.jaldoRequirementId);
    if (!requirement?.capabilities.some(capability => capability.operation === mapping.jaldoOperation)) {
      errors.push('Operation mismatch: ' + mapping.id + ' -> ' + mapping.jaldoRequirementId + ':' + mapping.jaldoOperation);
    }
    if (mapping.evidenceLevel !== 'documentation-mapped') errors.push('Unsupported evidence promotion: ' + mapping.id + ' -> ' + mapping.evidenceLevel);
  }
  return errors;
}

export function oracleOhipSummary() {
  const requirementIds = new Set(ORACLE_OHIP_OPERATIONS.map(item => item.jaldoRequirementId));
  return {
    schemaVersion: 'jaldo.vendor-map.oracle-ohip.v1',
    vendor: 'Oracle Hospitality Integration Platform (OHIP)',
    evidenceLevel: ORACLE_OHIP_EVIDENCE_LEVEL,
    mappedJaldoRequirements: requirementIds.size,
    documentedOperations: ORACLE_OHIP_OPERATIONS.length,
    fullyMappedOperations: ORACLE_OHIP_OPERATIONS.filter(item => item.coverage === 'mapped').length,
    partialOperations: ORACLE_OHIP_OPERATIONS.filter(item => item.coverage === 'partial').length,
    sandboxTestsPassed: 0,
    liveEventsObserved: 0,
    unresolvedJaldoRequirements: [
      'int-task-management', 'int-loyalty', 'int-guest-messaging', 'int-staff-app', 'int-iot-sensors',
      'gap-transport-provider', 'gap-marketplace-activation',
    ],
    authentication: ORACLE_OHIP_AUTH,
    streaming: ORACLE_OHIP_STREAMING,
  };
}
