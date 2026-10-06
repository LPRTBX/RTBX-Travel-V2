/** Synthetic hotel input adapters. Reuses the existing Lab driver and Travel engine. */
import { DEFAULT_DEPLOYMENT, type TravelDeploymentConfig } from '../data/travelDeploymentConfig';
import { getDeploymentActivationReadiness } from '../lib/travelScenarioRouting';
import { startLabRun, advanceLabRun, acknowledgeLabEscalation, type LabRun } from '../lib/visualSimulation';
import { TRAVEL_SCENARIOS } from '../data/travelScenarios';

export const HOTEL_PATHS = ['pms', 'guest', 'staff', 'sensor'] as const;
export type HotelPath = typeof HOTEL_PATHS[number];
export type HotelCondition = 'normal' | 'approval-held' | 'missing-evidence' | 'escalation';
export const PATH_LABELS: Record<HotelPath, string> = {
  pms: 'PMS / reservations', guest: 'Guest requests', staff: 'Staff operations', sensor: 'Room / building sensors',
};
// Explicit synthetic contracts, not claimed vendor API schemas.
export const HOTEL_ROUTES = {
  pms: {
    'arrival-room-delay': 'repeat-guest-room-not-ready', 'room-assignment-conflict': 'repeat-guest-room-not-ready',
    'reservation-service-request': 'service-backlog', 'transfer-delay': 'transport-disruption',
    'room-out-of-service': 'maintenance-defect',
  },
  guest: {
    'room-not-ready': 'repeat-guest-room-not-ready', 'service-request': 'service-backlog',
    'room-defect': 'maintenance-defect', 'welfare-request': 'distressed-guest', 'missed-transfer': 'transport-disruption',
  },
  staff: {
    'housekeeping-delay': 'repeat-guest-room-not-ready', 'task-backlog': 'service-backlog',
    'maintenance-report': 'maintenance-defect', 'welfare-observation': 'distressed-guest', 'shuttle-delay': 'transport-disruption',
  },
  sensor: {
    'temperature-alert': 'maintenance-defect', 'water-leak': 'maintenance-defect',
    'hvac-fault': 'maintenance-defect', 'lift-fault': 'maintenance-defect', 'door-lock-fault': 'maintenance-defect',
  },
} satisfies Record<HotelPath, Record<string, string>>;
export const MOCK_HOTEL = {
  id: 'hotel-synthetic-harbour', name: 'Harbour Hotel — synthetic operations', rooms: 100,
  occupiedRooms: 76, arrivingReservations: 16, departingReservations: 8,
  departments: ['Front office', 'Guest services', 'Housekeeping', 'Maintenance', 'Duty management', 'Safety'],
};
export interface HotelSignal {
  schemaVersion: 'jaldo.hotel-input.v1'; eventId: string; hotelId: string; path: HotelPath;
  kind: string; room: number; guestId: string; observedAt: string; title: string;
  condition: HotelCondition; payload: Record<string, unknown>;
}
export function createHotelSignals(cycle = 1): HotelSignal[] {
  if (!Number.isSafeInteger(cycle) || cycle < 1) throw new Error('Cycle must be a positive integer');
  const conditions: HotelCondition[] = ['normal', 'approval-held', 'missing-evidence', 'escalation', 'normal'];
  // Interleave all four sources. Each has five event types and five different readings.
  return Array.from({ length: 100 }, (_, index) => {
    const path = HOTEL_PATHS[index % 4];
    const local = Math.floor(index / 4);
    const kind = Object.keys(HOTEL_ROUTES[path])[Math.floor(local / 5)];
    const reading = local % 5;
    const room = 101 + index;
    const guestId = `synthetic-guest-${room}`;
    const payload = path === 'pms' ? { reservationId: `mock-res-${room}`, delayMinutes: 5 + local * 2 }
      : path === 'guest' ? { requestId: `mock-request-${room}`, message: `Synthetic ${kind} request ${reading + 1}` }
      : path === 'staff' ? { staffId: `synthetic-staff-${local % 6}`, taskId: `mock-task-${room}`, backlogMinutes: 10 + local * 3 }
      : { sensorId: `mock-${kind}-${room}`, value: 21 + local * 0.7, unit: kind === 'temperature-alert' ? 'C' : 'synthetic-alert-level' };
    return { schemaVersion: 'jaldo.hotel-input.v1', eventId: `hotel-cycle-${cycle}-${path}-${local + 1}`,
      hotelId: MOCK_HOTEL.id, path, kind, room, guestId, observedAt: `2026-09-30T${String(8 + Math.floor(index / 60)).padStart(2, '0')}:${String(index % 60).padStart(2, '0')}:00.000Z`,
      title: `${PATH_LABELS[path]} · ${kind.replaceAll('-', ' ')} · reading ${reading + 1}`,
      condition: conditions[reading], payload };
  });
}
export function createHotelDeployment(): TravelDeploymentConfig {
  const deployment = structuredClone(DEFAULT_DEPLOYMENT);
  deployment.id = MOCK_HOTEL.id;
  deployment.deploymentName = MOCK_HOTEL.name;
  deployment.roomCount = MOCK_HOTEL.rooms;
  deployment.deploymentStatus = 'active-simulation';
  const included = new Set(Object.values(HOTEL_ROUTES).flatMap(routes => Object.values(routes)));
  deployment.scenarios = deployment.scenarios.map(s => ({ ...s, active: included.has(s.scenarioId),
    syntheticSignalOverride: included.has(s.scenarioId) }));
  const readiness = getDeploymentActivationReadiness(deployment);
  if (!readiness.ready) throw new Error(readiness.issues.map(i => i.reason).join('; '));
  return deployment;
}
export interface HotelRead { signal: HotelSignal; scenarioId: string; run: LabRun }
export interface IntakeRecord { eventId: string; path?: HotelPath; status: 'accepted' | 'duplicate' | 'rejected' | 'retry'; reason?: string }
export interface HotelSession {
  cycle: number; deployment: TravelDeploymentConfig; reads: HotelRead[];
  intake: IntakeRecord[]; online: Record<HotelPath, boolean>;
}
export function createHotelSession(cycle = 1): HotelSession {
  return { cycle, deployment: createHotelDeployment(), reads: [], intake: [],
    online: { pms: true, guest: true, staff: true, sensor: true } };
}
export function validateHotelSignal(value: unknown): HotelSignal {
  if (!value || typeof value !== 'object') throw new Error('Input must be an object');
  const s = value as HotelSignal;
  if (s.schemaVersion !== 'jaldo.hotel-input.v1' || s.hotelId !== MOCK_HOTEL.id) throw new Error('Schema or hotel mismatch');
  if (!HOTEL_PATHS.includes(s.path)) throw new Error('Unknown input path');
  if (!Object.hasOwn(HOTEL_ROUTES[s.path], s.kind)) throw new Error('Unsupported event kind');
  if (typeof s.eventId !== 'string' || !s.eventId.trim() || s.eventId.length > 160) throw new Error('Invalid event ID');
  if (!Number.isInteger(s.room) || s.room < 101 || s.room > 200) throw new Error('Unknown mock hotel room');
  if (s.guestId !== `synthetic-guest-${s.room}`) throw new Error('Guest / room correlation mismatch');
  if (typeof s.observedAt !== 'string' || !Number.isFinite(Date.parse(s.observedAt))) throw new Error('Invalid timestamp');
  if (typeof s.title !== 'string' || !s.title.trim()) throw new Error('Missing signal title');
  if (!['normal', 'approval-held', 'missing-evidence', 'escalation'].includes(s.condition)) throw new Error('Invalid test condition');
  const p = s.payload;
  if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('Missing payload');
  const text = (key: string) => typeof p[key] === 'string' && String(p[key]).trim().length > 0;
  const nonnegative = (key: string) => typeof p[key] === 'number' && Number.isFinite(p[key]) && Number(p[key]) >= 0;
  if (s.path === 'pms' && !(text('reservationId') && nonnegative('delayMinutes'))
    || s.path === 'guest' && !(text('requestId') && text('message'))
    || s.path === 'staff' && !(text('staffId') && text('taskId') && nonnegative('backlogMinutes'))
    || s.path === 'sensor' && !(text('sensorId') && nonnegative('value') && text('unit'))) throw new Error('Invalid path payload');
  return structuredClone(s);
}
export function ingestHotelSignal(session: HotelSession, raw: unknown): HotelSession {
  let signal: HotelSignal;
  try { signal = validateHotelSignal(raw); }
  catch (e) {
    return { ...session, intake: [...session.intake, { eventId: 'invalid-input', status: 'rejected', reason: String(e) }] };
  }
  const record = (status: IntakeRecord['status'], reason?: string) => ({ ...session,
    intake: [...session.intake, { eventId: signal.eventId, path: signal.path, status, reason }] });
  const previous = session.reads.find(r => r.signal.path === signal.path && r.signal.eventId === signal.eventId);
  if (previous) {
    return JSON.stringify(previous.signal) === JSON.stringify(signal) ? record('duplicate')
      : record('rejected', 'Event ID reused with a conflicting payload');
  }
  if (!session.online[signal.path]) return record('retry', 'Mock connection unavailable; retry after recovery');
  const scenarioId = (HOTEL_ROUTES[signal.path] as Record<string, string>)[signal.kind];
  try {
    const run = startLabRun(session.deployment, scenarioId, session.reads.length + 1,
      signal.condition === 'approval-held' ? 'normal' : signal.condition);
    return { ...record('accepted'), reads: [...session.reads, { signal, scenarioId, run }] };
  } catch (e) { return record('rejected', String(e)); }
}
export function advanceHotelSession(session: HotelSession, scripted = true): HotelSession {
  return { ...session, reads: session.reads.map(read => {
    let run = advanceLabRun(read.run, scripted && read.signal.condition !== 'approval-held');
    // Explicit synthetic acknowledgement only in scripted mode; visitor mode waits.
    if (scripted && run.execution.state === 'escalated') run = acknowledgeLabEscalation(run);
    return { ...read, run };
  }) };
}
export interface HotelBatch { hotel: HotelSession; signals: HotelSignal[]; drain: number; finished: boolean }
export function createHotelBatch(cycle = 1): HotelBatch {
  return { hotel: createHotelSession(cycle), signals: createHotelSignals(cycle), drain: 0, finished: false };
}
export function stepHotelBatch(batch: HotelBatch): HotelBatch {
  if (batch.finished) return batch;
  let hotel = advanceHotelSession(batch.hotel);
  for (const path of HOTEL_PATHS) {
    const signal = batch.signals.find(s => s.path === path && !hotel.reads.some(r => r.signal.eventId === s.eventId));
    if (signal && hotel.online[path]) hotel = ingestHotelSignal(hotel, signal);
  }
  const drain = hotel.reads.length === 100 ? batch.drain + 1 : 0;
  return { ...batch, hotel, drain, finished: drain >= 12 || hotel.reads.some(r => r.run.error)
    || hotel.intake.some(r => r.status === 'rejected') };
}
/** Whether the signal's routed scenario has a human approval gate (otherwise delegated authority applies). */
export function hotelSignalNeedsApproval(signal: HotelSignal): boolean {
  const scenarioId = (HOTEL_ROUTES[signal.path] as Record<string, string>)[signal.kind];
  return TRAVEL_SCENARIOS.find(s => s.id === scenarioId)?.governanceConfig.humanApprovalRequired ?? true;
}
export function expectedHotelState(signal: HotelSignal): LabRun['execution']['state'] {
  // A withheld approval only holds where an approval gate exists; delegated-authority cases proceed.
  return signal.condition === 'approval-held' && hotelSignalNeedsApproval(signal) ? 'approval-required'
    : signal.condition === 'missing-evidence' ? 'resolved' : 'closed';
}
export function checkHotelRead(read: HotelRead): string[] {
  const errors: string[] = [];
  const e = read.run.execution;
  if (read.run.error) errors.push(read.run.error);
  if (e.state !== expectedHotelState(read.signal)) errors.push(`Expected ${expectedHotelState(read.signal)}, observed ${e.state}`);
  if (e.scenarioId !== read.scenarioId) errors.push('Wrong scenario');
  if (e.deploymentId !== MOCK_HOTEL.id || !e.isSynthetic) errors.push('Wrong hotel or evidence level');
  if (read.signal.condition === 'approval-held' && hotelSignalNeedsApproval(read.signal)
    && (read.run.approval || e.decisions.length || e.communications.some(c => c.sent))) errors.push('Held approval dispatched action');
  if (e.state === 'closed' && e.approvalRequired && !e.decisions.some(d => d.decision === 'approved' && d.roleId === e.approvalRoleId)) errors.push('Closed without recorded approval');
  if (read.signal.condition === 'missing-evidence' && (e.closedAt || !e.evidence.some(item => item.required && !item.captured))) errors.push('Missing-evidence gate bypassed');
  if (read.signal.condition === 'escalation' && !e.escalations.some(item => item.acknowledged)) errors.push('Escalation not acknowledged');
  if (e.state === 'closed' && (!e.closedAt || e.evidence.some(item => item.required && !item.captured))) errors.push('Closure lacks evidence');
  if (e.outcomes.some(o => o.status !== (e.state === 'approval-required' ? 'pending' : 'not-measured'))) errors.push('Unsupported outcome claim');
  return errors;
}
