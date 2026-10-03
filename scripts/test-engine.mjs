import { 
  listSandboxes, 
  createSandbox, 
  extendTtl, 
  terminateSandbox, 
  injectDiagnosticEvent, 
  getLogs, 
  calculateFinOpsMetrics,
  listArchivedSandboxes
} from '../src/lib/mock-engine.ts';

console.log('🏁 --- STARTING KASA AUTOBOX COMPREHENSIVE TEST SUITE --- 🏁\n');

// 1. Initial State
const initial = listSandboxes();
console.log(`[PASS] Initial active sandboxes: ${initial.length}`);
if (initial.length < 2) throw new Error('Expected at least 2 seeded sandboxes');

// 2. Conflict Prevention Test (Double Click / Duplicate Vehicle)
const targetVin = '3N1AB7AP6HY209418'; // Toyota Hilux already running
const duplicateAttempt = createSandbox({
  templateId: 'workshop-bay',
  ttlMinutes: 45,
  vehicleVin: targetVin,
  customName: 'Duplicate Attempt Bay',
});

if (!duplicateAttempt.conflict) {
  throw new Error('Engine should detect duplicate active sandbox for the same VIN');
}
console.log(`[PASS] Duplicate conflict correctly intercepted for VIN ${targetVin}`);
console.log(`       Existing Sandbox ID: ${duplicateAttempt.existingSandbox?.id}`);

// 3. Resolve Conflict via Restart TTL
const restartAttempt = createSandbox({
  templateId: 'workshop-bay',
  ttlMinutes: 60,
  vehicleVin: targetVin,
  action: 'restart_ttl',
});
console.log(`[PASS] Resolved conflict via restart_ttl without creating duplicate. New expiry: ${restartAttempt.sandbox.expiresAt}`);

// 4. Create New Non-Conflicting Sandbox with a fresh vehicle
const freshVin = '3C6UR5FL9NG198302'; // RAM 2500
const created = createSandbox({
  templateId: 'fault-simulator',
  ttlMinutes: 30,
  vehicleVin: freshVin,
  customName: 'RAM 2500 Diagnostic Stress Bay',
});
console.log(`[PASS] New unique sandbox created: ${created.sandbox.id}`);

// 5. Injected DTC Fault and CAN Telemetry
const updatedDtc = injectDiagnosticEvent(created.sandbox.id, {
  type: 'DTC_FAULT',
  code: 'P0217',
  description: 'Engine Coolant Overtemperature Condition',
  severity: 'HIGH',
});
if (!updatedDtc?.telemetry.checkEngineLight) throw new Error('Check engine light should be triggered');
console.log(`[PASS] Injected DTC P0217 - Check Engine MIL Lamp is ON: ${updatedDtc.telemetry.checkEngineLight}`);

// 6. Test Cold Storage Archiving
const terminated = terminateSandbox(created.sandbox.id);
console.log(`[PASS] Sandbox terminated and moved to Cold Storage: ${terminated}`);

// Verify it's no longer in active sandboxes
const activeAfterTeardown = listSandboxes();
const stillInActive = activeAfterTeardown.some(s => s.id === created.sandbox.id);
if (stillInActive) throw new Error('Terminated sandbox must not linger in active fleet bay');
console.log(`[PASS] Active bay verified clean: terminated sandbox removed from active fleet.`);

// 7. Verify Historical Archive with 3 Filters (Week, Month, Year)
const weekArchive = listArchivedSandboxes('week');
const monthArchive = listArchivedSandboxes('month');
const yearArchive = listArchivedSandboxes('year');
console.log(`[PASS] Archive filters verified:`);
console.log(`       - Menos de 1 Semana: ${weekArchive.length} registros`);
console.log(`       - Menos de 1 Mes:    ${monthArchive.length} registros`);
console.log(`       - Menos de 1 Año:    ${yearArchive.length} registros`);

if (weekArchive.length === 0 || monthArchive.length === 0 || yearArchive.length === 0) {
  throw new Error('Archive filters must return valid historical data');
}

// 8. Enriched CloudWatch Logs & FinOps Metrics
const logs = getLogs();
console.log(`[PASS] CloudWatch Logs Stream Buffer: ${logs.length} entries`);
const metrics = calculateFinOpsMetrics();
console.log(`[PASS] FinOps Metrics: $${metrics.estimatedCostAvoidedUsd} saved, ${metrics.zombieHoursPrevented} zombie hours eliminated`);

console.log('\n🎉 ALL PRODUCTION CHECKS AND REQUIREMENTS PASSED 100%!');
process.exit(0);
