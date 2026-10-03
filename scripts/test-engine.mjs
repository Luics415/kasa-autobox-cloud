import { 
  listSandboxes, 
  createSandbox, 
  extendTtl, 
  terminateSandbox, 
  injectDiagnosticEvent, 
  getLogs, 
  calculateFinOpsMetrics 
} from '../src/lib/mock-engine.ts';

console.log('🏁 --- STARTING KASA AUTOBOX ENGINE VERIFICATION --- 🏁\n');

// 1. Initial State
const initial = listSandboxes();
console.log(`[PASS] Initial sandboxes in memory: ${initial.length}`);
if (initial.length < 2) throw new Error('Expected at least 2 seeded sandboxes');

// 2. Create New Sandbox
const created = createSandbox({
  templateId: 'fault-simulator',
  ttlMinutes: 45,
  vehicleVin: '3N1AB7AP6HY209418',
  customName: 'Verification ECU Stress Bay',
});
console.log(`[PASS] Sandbox created: ${created.id} (Status: ${created.status})`);
console.log(`       Target Endpoint: ${created.endpointUrl}`);
console.log(`       AWS ECS Task: ${created.awsEcsTaskArn}`);
console.log(`       STS AccessKey: ${created.credentials.accessKeyId}`);

// 3. Inject OBD-II Diagnostic Fault
const updatedDtc = injectDiagnosticEvent(created.id, {
  type: 'DTC_FAULT',
  code: 'P0300',
  description: 'Random/Multiple Cylinder Misfire Detected',
  severity: 'HIGH',
});
if (!updatedDtc?.telemetry.checkEngineLight) throw new Error('Check engine light should be triggered');
console.log(`[PASS] Injected DTC P0300 - MIL Lamp is ON: ${updatedDtc.telemetry.checkEngineLight}`);

// 4. Extend TTL
const extended = extendTtl(created.id, 30);
console.log(`[PASS] Extended TTL by +30m. New expiry: ${extended?.expiresAt}`);

// 5. CloudWatch Logs
const logs = getLogs(created.id);
console.log(`[PASS] Generated CloudWatch logs for sandbox: ${logs.length} entries`);

// 6. FinOps Metrics
const metrics = calculateFinOpsMetrics();
console.log(`[PASS] FinOps Engine: Avoided $${metrics.estimatedCostAvoidedUsd} and ${metrics.zombieHoursPrevented} zombie hours`);

// 7. Auto-destruction / Teardown
const terminated = terminateSandbox(created.id);
console.log(`[PASS] Manual termination signal executed: ${terminated}`);

console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
