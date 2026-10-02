import { mkdirSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const required = [
  'OHIP_GATEWAY_URL', 'OHIP_APP_KEY', 'OHIP_CLIENT_ID', 'OHIP_CLIENT_SECRET',
  'OHIP_ENTERPRISE_ID', 'OHIP_HOTEL_ID',
];
const missing = required.filter(key => !process.env[key]?.trim());
if (missing.length) {
  console.error('OHIP sandbox qualification cannot run. Missing environment keys: ' + missing.join(', '));
  process.exit(2);
}

const gateway = process.env.OHIP_GATEWAY_URL.replace(/\/+$/, '');
if (!gateway.startsWith('https://')) {
  console.error('OHIP_GATEWAY_URL must use HTTPS.');
  process.exit(2);
}
const scope = process.env.OHIP_SCOPE || 'urn:opc:hgbu:ws:__myscopes__';
const timeoutMs = Math.max(1000, Math.min(Number(process.env.OHIP_TIMEOUT_MS || 15000), 60000));
const results = [];
const record = (id, started, status, httpStatus, note) => {
  results.push({ id, status, httpStatus, elapsedMs: Math.round((performance.now() - started) * 100) / 100, note });
};

async function token() {
  const started = performance.now();
  const basic = Buffer.from(process.env.OHIP_CLIENT_ID + ':' + process.env.OHIP_CLIENT_SECRET).toString('base64');
  const body = new URLSearchParams({ grant_type: 'client_credentials', scope });
  const response = await fetch(gateway + '/oauth/v1/tokens', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-app-key': process.env.OHIP_APP_KEY,
      enterpriseId: process.env.OHIP_ENTERPRISE_ID,
      Authorization: 'Basic ' + basic,
    },
    body,
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    record('oauth-client-credentials', started, 'failed', response.status, 'Token request rejected; response body intentionally not persisted.');
    throw new Error('OAuth token request failed with HTTP ' + response.status);
  }
  const json = await response.json();
  if (!json?.access_token || typeof json.access_token !== 'string') {
    record('oauth-client-credentials', started, 'failed', response.status, 'No access_token in response.');
    throw new Error('OAuth response did not contain access_token');
  }
  record('oauth-client-credentials', started, 'passed', response.status, 'Token obtained in memory and not persisted.');
  return json.access_token;
}

async function propertyGet(id, tokenValue, path) {
  const started = performance.now();
  const response = await fetch(gateway + path, {
    headers: {
      Accept: 'application/json',
      'x-app-key': process.env.OHIP_APP_KEY,
      'x-hotelid': process.env.OHIP_HOTEL_ID,
      Authorization: 'Bearer ' + tokenValue,
      'X-Request-Id': crypto.randomUUID(),
    },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    record(id, started, 'failed', response.status, 'Property API request failed; body intentionally not persisted.');
    throw new Error(id + ' failed with HTTP ' + response.status);
  }
  record(id, started, 'passed', response.status, 'Successful response observed; body intentionally not persisted.');
}

let exitCode = 0;
try {
  const tokenValue = await token();
  const hotel = encodeURIComponent(process.env.OHIP_HOTEL_ID);
  const housekeepingPath = process.env.OHIP_HOUSEKEEPING_SMOKE_PATH || '/hsk/v1/hotels/' + hotel + '/housekeepingOverview';
  await propertyGet('housekeeping-overview-read', tokenValue, housekeepingPath);
  if (process.env.OHIP_RESERVATION_SMOKE_PATH?.trim()) {
    await propertyGet('reservation-read', tokenValue, process.env.OHIP_RESERVATION_SMOKE_PATH);
  } else {
    results.push({ id: 'reservation-read', status: 'not-run', httpStatus: null, elapsedMs: 0,
      note: 'Set OHIP_RESERVATION_SMOKE_PATH only after approving a bounded sandbox reservation query.' });
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  exitCode = 1;
}

const report = {
  schemaVersion: 'jaldo.vendor-qualification.oracle-ohip.v1',
  evidenceLevel: 'sandbox-smoke-test',
  generatedAt: new Date().toISOString(),
  gatewayHost: new URL(gateway).host,
  hotelConfigured: true,
  secretsPersisted: false,
  responseBodiesPersisted: false,
  streamingTested: false,
  results,
};
mkdirSync('simulation-results', { recursive: true });
writeFileSync('simulation-results/oracle-ohip-sandbox.json', JSON.stringify(report, null, 2) + '\n');
const lines = [
  '# Oracle OHIP sandbox smoke test', '',
  ...results.map(item => '- ' + item.id + ': **' + item.status + '**' + (item.httpStatus ? ' (HTTP ' + item.httpStatus + ')' : '')),
  '', 'No token, secret or response body is retained. Streaming qualification is a separate later gate.', '',
];
writeFileSync('simulation-results/oracle-ohip-sandbox-summary.md', lines.join('\n'));
process.exitCode = exitCode;
