import { 
  EphemeralSandbox, 
  ArchivedSandbox,
  CloudWatchLogEntry, 
  FinOpsMetrics, 
  SandboxTemplateId, 
  VehicleProfile 
} from '@/types/sandbox';
import { SANDBOX_TEMPLATES, PRESET_VEHICLES } from './templates';

interface GlobalStore {
  sandboxes: EphemeralSandbox[];
  archive: ArchivedSandbox[];
  logs: CloudWatchLogEntry[];
  totalLaunched: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __kasaAutoBoxStore: GlobalStore | undefined;
  // eslint-disable-next-line no-var
  var __kasaHeartbeatStarted: boolean | undefined;
}

function getStore(): GlobalStore {
  if (!global.__kasaAutoBoxStore) {
    const now = new Date();
    
    // Seed initial active sandboxes (Audi RS6 and Tesla Model Y)
    const initialSandboxes: EphemeralSandbox[] = [
      {
        id: 'sbx-bay-819',
        name: 'Kasa Workshop Reception Bench #1',
        templateId: 'workshop-bay',
        status: 'HEALTHY',
        createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        expiresAt: new Date(now.getTime() + 45 * 60 * 1000).toISOString(),
        initialTtlMinutes: 60,
        vehicle: PRESET_VEHICLES[0], // Toyota Hilux
        endpointUrl: 'https://sbx-bay-819.us-east-1.ecs.kasa-autobox.net/api/v2/reception',
        awsEcsTaskArn: 'arn:aws:ecs:us-east-1:492817290192:task/kasa-autobox-cluster/f92a18b76c5d43e2',
        ecsClusterName: 'kasa-autobox-prod',
        cloudWatchLogStream: 'ecs/kasa-workshop-bay/f92a18b76c5d43e2',
        credentials: {
          accessKeyId: 'ASIAR928BKAOTEMP819X',
          secretAccessKey: 'qZ8y7K+v9T2u5WxP3mL4jN1kR0sF6hG8dC2bA4e9',
          sessionToken: 'IQoJb3JpZ2luX2VjEOr//////////wEaCXVzLWVhc3QtMSJHMEUCIQCe9k7v...kasa-ephemeral-session-bay819',
          expiration: new Date(now.getTime() + 45 * 60 * 1000).toISOString(),
          scopedRoleArn: 'arn:aws:iam::492817290192:role/kasa-ephemeral-sandbox-role',
        },
        telemetry: {
          rpm: 850,
          speedKmh: 0,
          fuelLevelPct: 68,
          engineTempC: 88,
          batteryVoltage: 13.8,
          checkEngineLight: false,
          activeDtcs: [],
        },
      },
      {
        id: 'sbx-obd-404',
        name: 'High-Throughput CAN Ingestion Node',
        templateId: 'obd-telematics',
        status: 'HEALTHY',
        createdAt: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
        expiresAt: new Date(now.getTime() + 40 * 60 * 1000).toISOString(),
        initialTtlMinutes: 60,
        vehicle: PRESET_VEHICLES[1], // Ford Ranger Raptor
        endpointUrl: 'https://sbx-obd-404.us-east-1.ecs.kasa-autobox.net/telemetry/stream',
        awsEcsTaskArn: 'arn:aws:ecs:us-east-1:492817290192:task/kasa-autobox-cluster/3c7b91d4e08215aa',
        ecsClusterName: 'kasa-autobox-prod',
        cloudWatchLogStream: 'ecs/kasa-telematics-streamer/3c7b91d4e08215aa',
        credentials: {
          accessKeyId: 'ASIAR928BKAOTEMP404Y',
          secretAccessKey: 'wL9x8J+m1R3t4VqS2kK3hN0jP9rE5gF7cB1aZ3d8',
          sessionToken: 'IQoJb3JpZ2luX2VjEOr//////////wEaCXVzLWVhc3QtMSJHMEUCIQDf8k2w...kasa-ephemeral-session-obd404',
          expiration: new Date(now.getTime() + 40 * 60 * 1000).toISOString(),
          scopedRoleArn: 'arn:aws:iam::492817290192:role/kasa-ephemeral-sandbox-role',
        },
        telemetry: {
          rpm: 2450,
          speedKmh: 74,
          fuelLevelPct: 42,
          engineTempC: 92,
          batteryVoltage: 14.2,
          checkEngineLight: true,
          activeDtcs: [
            {
              code: 'P0420',
              description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
              severity: 'MEDIUM',
            },
          ],
        },
      },
    ];

    // Seed realistic compressed historical records spanning 1 week, 1 month, and 1 year
    const initialArchive: ArchivedSandbox[] = [
      {
        id: 'sbx-arch-901',
        name: 'Audi RS6 Diagnostic Calibration Run',
        templateId: 'fault-simulator',
        vehicle: PRESET_VEHICLES[2], // Audi RS6
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (Week)
        terminatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
        terminationReason: 'TTL_EXPIRED',
        totalUptimeMinutes: 45,
        estimatedCostUsd: 0.039,
        finalDtcs: [{ code: 'P0171', description: 'System Too Lean Bank 1' }],
        compressedPayloadSnippet: 'H4sICG3b1mcAA2FyY2hpdmUuanNvbgDtVU1v3DYQvfdXCHpaoFR+SCuCB8GDAK0L',
        compressedSizeKb: 1.4,
        logCount: 28,
      },
      {
        id: 'sbx-arch-742',
        name: 'Tesla Model Y Dual Motor Telemetry Stress',
        templateId: 'obd-telematics',
        vehicle: PRESET_VEHICLES[3], // Tesla Model Y
        createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago (Month)
        terminatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        terminationReason: 'USER_TERMINATED',
        totalUptimeMinutes: 60,
        estimatedCostUsd: 0.052,
        finalDtcs: [],
        compressedPayloadSnippet: 'H4sICNDc1mcAA2FyY2hpdmUyLmpzb27tVT1v3DYQvdffoOhpAQF7kVa0VBAgaF2g',
        compressedSizeKb: 2.1,
        logCount: 44,
      },
      {
        id: 'sbx-arch-511',
        name: 'RAM 2500 Heavy Cummins Intake Test',
        templateId: 'workshop-bay',
        vehicle: PRESET_VEHICLES[4], // RAM 2500
        createdAt: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString(), // 75 days ago (Year)
        terminatedAt: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        terminationReason: 'TTL_EXPIRED',
        totalUptimeMinutes: 30,
        estimatedCostUsd: 0.026,
        finalDtcs: [{ code: 'P0217', description: 'Engine Coolant Overtemperature' }],
        compressedPayloadSnippet: 'H4sICPPd1mcAA2FyY2hpdmUzLmpzb25zTzBv3DYQvfffkOjpoAB7mVaoEBAg6F1Y',
        compressedSizeKb: 0.9,
        logCount: 16,
      },
    ];

    const initialLogs: CloudWatchLogEntry[] = [
      {
        id: 'log-1',
        timestamp: new Date(now.getTime() - 14 * 60 * 1000).toISOString(),
        sandboxId: 'sbx-bay-819',
        level: 'INFO',
        source: 'aws:ecs:fargate',
        message: 'Task container started on AWS Fargate runtime (v1.4.0). Port 8080 listening on 0.0.0.0.',
        traceId: 'Root=1-6701a89f-4f8921a942008f12b7',
        requestId: 'req-8f920a1',
        durationMs: 42,
        memoryUsageMb: 124,
        cpuPct: 2.1,
        httpStatusCode: 200,
        payload: { event: 'CONTAINER_STARTED', port: 8080, vpcSubnet: 'subnet-09f182aa' },
      },
      {
        id: 'log-2',
        timestamp: new Date(now.getTime() - 12 * 60 * 1000).toISOString(),
        sandboxId: 'sbx-bay-819',
        level: 'STS_AUTH',
        source: 'aws:sts:assumerole',
        message: 'Issued temporary STS role session credentials (TTL: 60m). SessionId: kasa-sess-bay819.',
        traceId: 'Root=1-6701a8b1-3e7208d8102919aa44',
        requestId: 'req-sts-771',
        durationMs: 88,
        memoryUsageMb: 126,
        cpuPct: 3.5,
        httpStatusCode: 200,
        payload: { roleArn: 'arn:aws:iam::492817290192:role/kasa-ephemeral-sandbox-role', accessKeyPrefix: 'ASIAR928B' },
      },
      {
        id: 'log-3',
        timestamp: new Date(now.getTime() - 6 * 60 * 1000).toISOString(),
        sandboxId: 'sbx-bay-819',
        level: 'INFO',
        source: 'kasa:workshop:reception',
        message: 'Intake reception registered for VIN 3N1AB7AP6HY209418. Work order #WO-9941 dispatched to Bay #3.',
        traceId: 'Root=1-6701a8f9-9018274acb0198aa12',
        requestId: 'req-wo-9941',
        durationMs: 65,
        memoryUsageMb: 138,
        cpuPct: 4.8,
        httpStatusCode: 201,
        payload: { vin: '3N1AB7AP6HY209418', workOrder: 'WO-9941', bay: 3, technician: 'Alex Rivera' },
      },
      {
        id: 'log-4',
        timestamp: new Date(now.getTime() - 50 * 60 * 1000).toISOString(),
        sandboxId: 'sbx-obd-404',
        level: 'CAN_BUS',
        source: 'kasa:obd2:can_router',
        message: 'CAN Frame received [0x7DF 0x02 0x01 0x0C]: Engine RPM=2450, Speed=74 km/h.',
        traceId: 'Root=1-6701a711-2098471bd80192cc09',
        requestId: 'can-frame-881',
        durationMs: 4,
        memoryUsageMb: 210,
        cpuPct: 8.2,
        payload: { canId: '0x7DF', mode: 1, pid: '0x0C', rawHex: '02010C0992', parsed: { rpm: 2450, speedKmh: 74 } },
      },
      {
        id: 'log-5',
        timestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
        sandboxId: 'sbx-obd-404',
        level: 'WARN',
        source: 'kasa:ecu:mil_monitor',
        message: 'Diagnostic Trouble Code detected: P0420 (Catalyst System Efficiency Below Threshold). Check Engine Light commanded ON.',
        traceId: 'Root=1-6701a7df-110298bb770091ee45',
        requestId: 'dtc-alert-420',
        durationMs: 12,
        memoryUsageMb: 215,
        cpuPct: 9.4,
        payload: { dtc: 'P0420', ecuAddress: '0x10', freezeFrame: { coolantTemp: 92, rpm: 2450, throttlePos: '22%' } },
      },
    ];

    global.__kasaAutoBoxStore = {
      sandboxes: initialSandboxes,
      archive: initialArchive,
      logs: initialLogs,
      totalLaunched: 14,
    };
  }

  // Start continuous realistic automotive telemetry heartbeat
  if (!global.__kasaHeartbeatStarted) {
    global.__kasaHeartbeatStarted = true;
    const heartbeatTimer = setInterval(() => {
      const store = global.__kasaAutoBoxStore;
      if (!store || store.sandboxes.length === 0) return;

      // Pick a random active sandbox to emit dynamic live telemetry
      const active = store.sandboxes.filter(s => s.status !== 'TERMINATED');
      if (active.length === 0) return;

      const randomSandbox = active[Math.floor(Math.random() * active.length)];
      const randRpm = Math.floor(800 + Math.random() * 2200);
      const randSpeed = Math.floor(Math.random() * 85);

      // Pulse telemetry on the live sandbox
      randomSandbox.telemetry.rpm = randRpm;
      randomSandbox.telemetry.speedKmh = randSpeed;

      const logTemplates = [
        {
          level: 'CAN_BUS' as const,
          source: 'kasa:obd2:can_router',
          message: `CAN-BUS Broadcast: Engine RPM=${randRpm}, Speed=${randSpeed} km/h, Coolant Temp=${randomSandbox.telemetry.engineTempC}°C.`,
          payload: { canId: '0x7DF', rpm: randRpm, speedKmh: randSpeed, busLoadPct: '14.2%' },
        },
        {
          level: 'INFO' as const,
          source: 'aws:ecs:telemetry_streamer',
          message: `HTTP 200 GET /telemetry/stream - Health check nominal. Latency: ${Math.floor(8 + Math.random() * 20)}ms.`,
          payload: { endpoint: randomSandbox.endpointUrl, status: 200, activeConnections: 3 },
        },
        {
          level: 'INFO' as const,
          source: 'kasa:ecu:sensor_sweep',
          message: `Diagnostic Sweep Complete: O2 Sensor Lambda=1.002, Voltage=${(13.8 + Math.random() * 0.4).toFixed(2)}V DC.`,
          payload: { batteryVoltage: 13.95, lambda: 1.002, fuelTrim: '+1.4%' },
        },
      ];

      const chosen = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      addLog({
        sandboxId: randomSandbox.id,
        level: chosen.level,
        source: chosen.source,
        message: chosen.message,
        payload: chosen.payload,
      });
    }, 2500);

    if (typeof heartbeatTimer?.unref === 'function') {
      heartbeatTimer.unref();
    }
  }

  return global.__kasaAutoBoxStore;
}

// Check for duplicate vehicle actively running
export function findActiveSandboxByVin(vin: string): EphemeralSandbox | undefined {
  const store = getStore();
  const now = Date.now();
  return store.sandboxes.find(s => s.vehicle.vin === vin && new Date(s.expiresAt).getTime() > now);
}

// List ONLY ACTIVE sandboxes (auto-archives expired ones so they never clutter the main bay)
export function listSandboxes(): EphemeralSandbox[] {
  const store = getStore();
  const now = Date.now();

  const stillActive: EphemeralSandbox[] = [];

  for (const sbx of store.sandboxes) {
    const expiresMs = new Date(sbx.expiresAt).getTime();
    const remainingMs = expiresMs - now;

    if (remainingMs <= 0) {
      // Auto-move expired sandbox to Cold Storage Archive!
      archiveSandbox(sbx, 'TTL_EXPIRED');
    } else {
      if (remainingMs <= 15 * 60 * 1000 && sbx.status === 'HEALTHY') {
        stillActive.push({ ...sbx, status: 'EXPIRING_SOON' });
      } else {
        stillActive.push(sbx);
      }
    }
  }

  store.sandboxes = stillActive;
  return store.sandboxes;
}

// Archive a sandbox to cold storage
export function archiveSandbox(sbx: EphemeralSandbox, reason: 'TTL_EXPIRED' | 'USER_TERMINATED' | 'FORCE_REPLACED') {
  const store = getStore();
  const now = new Date();
  const createdMs = new Date(sbx.createdAt).getTime();
  const uptimeMinutes = Math.max(1, Math.round((now.getTime() - createdMs) / 60000));
  const cost = Number(((uptimeMinutes / 60) * 0.052).toFixed(3));

  // Check if not already in archive
  if (!store.archive.some(a => a.id === sbx.id)) {
    const archived: ArchivedSandbox = {
      id: sbx.id,
      name: sbx.name,
      templateId: sbx.templateId,
      vehicle: sbx.vehicle,
      createdAt: sbx.createdAt,
      terminatedAt: now.toISOString(),
      terminationReason: reason,
      totalUptimeMinutes: uptimeMinutes,
      estimatedCostUsd: cost,
      finalDtcs: sbx.telemetry.activeDtcs.map(d => ({ code: d.code, description: d.description })),
      compressedPayloadSnippet: `H4sIC${Math.random().toString(36).substring(2, 8)}AA2FyY2hpdnUuanNv${Math.random().toString(36).substring(2, 20)}`,
      compressedSizeKb: Number((1.2 + Math.random() * 1.5).toFixed(1)),
      logCount: store.logs.filter(l => l.sandboxId === sbx.id).length,
    };
    store.archive.unshift(archived);
  }

  addLog({
    sandboxId: sbx.id,
    level: 'WARN',
    source: 'aws:eventbridge:reaper',
    message: `Sandbox ${sbx.id} automatically dismantled. State dumped and compressed to Cold Storage Table.`,
    payload: { reason, uptimeMinutes },
  });
}

// List historical archived sandboxes with time filters (week, month, year)
export function listArchivedSandboxes(filter: 'week' | 'month' | 'year' = 'month'): ArchivedSandbox[] {
  const store = getStore();
  const now = Date.now();

  const filterLimits = {
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  };

  const limitMs = filterLimits[filter] || filterLimits.month;

  return store.archive.filter(item => {
    const termTime = new Date(item.terminatedAt).getTime();
    return (now - termTime) <= limitMs;
  });
}

export function getSandboxById(id: string): EphemeralSandbox | undefined {
  const store = getStore();
  return store.sandboxes.find(s => s.id === id);
}

export function createSandbox(params: {
  templateId: SandboxTemplateId;
  ttlMinutes: number;
  vehicleVin?: string;
  customName?: string;
  action?: 'create' | 'restart_ttl' | 'force_duplicate';
}): { sandbox: EphemeralSandbox; conflict?: boolean; existingSandbox?: EphemeralSandbox } {
  const store = getStore();
  const now = new Date();
  const template = SANDBOX_TEMPLATES.find(t => t.id === params.templateId) || SANDBOX_TEMPLATES[0];
  const vehicle = PRESET_VEHICLES.find(v => v.vin === params.vehicleVin) || PRESET_VEHICLES[0];

  // 1. Conflict Detection: Is this vehicle already in an active sandbox?
  const existingActive = findActiveSandboxByVin(vehicle.vin);

  if (existingActive) {
    if (params.action === 'restart_ttl') {
      // Action: Restart / extend TTL on existing sandbox
      const newExpiry = new Date(now.getTime() + params.ttlMinutes * 60 * 1000).toISOString();
      existingActive.expiresAt = newExpiry;
      existingActive.status = 'HEALTHY';
      existingActive.credentials.expiration = newExpiry;

      addLog({
        sandboxId: existingActive.id,
        level: 'INFO',
        source: 'kasa:orchestrator:conflict_resolver',
        message: `Active sandbox detected for ${vehicle.model} (${vehicle.vin}). TTL clock reset to ${params.ttlMinutes}m.`,
      });

      return { sandbox: existingActive };
    }

    if (params.action !== 'force_duplicate') {
      // Return conflict to trigger confirmation modal!
      return { 
        sandbox: existingActive, 
        conflict: true, 
        existingSandbox: existingActive 
      };
    }
  }
  
  // Proceed with creation
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const sandboxId = `sbx-${template.id.split('-')[0]}-${randomSuffix}`;
  const taskIdHex = Math.random().toString(16).substring(2, 18);
  const expiresAt = new Date(now.getTime() + params.ttlMinutes * 60 * 1000).toISOString();

  const newSandbox: EphemeralSandbox = {
    id: sandboxId,
    name: params.customName || `${template.name} #${randomSuffix}`,
    templateId: template.id,
    status: 'PROVISIONING',
    createdAt: now.toISOString(),
    expiresAt,
    initialTtlMinutes: params.ttlMinutes,
    vehicle,
    endpointUrl: `https://${sandboxId}.us-east-1.ecs.kasa-autobox.net/api`,
    awsEcsTaskArn: `arn:aws:ecs:us-east-1:492817290192:task/kasa-autobox-cluster/${taskIdHex}`,
    ecsClusterName: 'kasa-autobox-prod',
    cloudWatchLogStream: `ecs/${template.dockerImage.split('/')[1]?.split(':')[0] || 'app'}/${taskIdHex}`,
    credentials: {
      accessKeyId: `ASIAR928BKAOTEMP${randomSuffix}Z`,
      secretAccessKey: `kL7w9J+p${Math.random().toString(36).substring(2, 15)}XyZ`,
      sessionToken: `IQoJb3JpZ2luX2VjEOr//////////wEaCXVzLWVhc3QtMSJHMEUCIQD${Math.random().toString(36).substring(2, 15)}...kasa-session-${sandboxId}`,
      expiration: expiresAt,
      scopedRoleArn: 'arn:aws:iam::492817290192:role/kasa-ephemeral-sandbox-role',
    },
    telemetry: {
      rpm: 900,
      speedKmh: 0,
      fuelLevelPct: 75,
      engineTempC: 85,
      batteryVoltage: 13.9,
      checkEngineLight: false,
      activeDtcs: [],
    },
  };

  store.sandboxes.unshift(newSandbox);
  store.totalLaunched += 1;

  addLog({
    sandboxId,
    level: 'INFO',
    source: 'aws:ecs:fargate',
    message: `Provisioning task on cluster 'kasa-autobox-prod'. CPU: ${template.defaultCpuUnits}, RAM: ${template.defaultMemoryMb}MB.`,
    traceId: `Root=1-${Math.random().toString(16).substring(2, 10)}-${Math.random().toString(16).substring(2, 18)}`,
    requestId: `req-prov-${randomSuffix}`,
    payload: { templateId: template.id, vin: vehicle.vin, ttlMinutes: params.ttlMinutes },
  });

  addLog({
    sandboxId,
    level: 'STS_AUTH',
    source: 'aws:sts:assumerole',
    message: `Generated scoped STS credentials for sandbox ${sandboxId}. Enforced TTL: ${params.ttlMinutes}m.`,
    payload: { scopedRole: 'arn:aws:iam::492817290192:role/kasa-ephemeral-sandbox-role', expiresAt },
  });

  // Transition to HEALTHY after 2 seconds
  setTimeout(() => {
    const target = store.sandboxes.find(s => s.id === sandboxId);
    if (target && target.status === 'PROVISIONING') {
      target.status = 'HEALTHY';
      addLog({
        sandboxId,
        level: 'INFO',
        source: 'aws:alb:healthcheck',
        message: `HTTP 200 OK received from ${target.endpointUrl}. Status set to HEALTHY.`,
        httpStatusCode: 200,
      });
    }
  }, 2000);

  return { sandbox: newSandbox };
}

export function extendTtl(id: string, additionalMinutes: number = 30): EphemeralSandbox | null {
  const store = getStore();
  const sandbox = store.sandboxes.find(s => s.id === id);
  if (!sandbox) return null;

  const currentExpiry = new Date(sandbox.expiresAt).getTime();
  const newExpiry = new Date(Math.max(Date.now(), currentExpiry) + additionalMinutes * 60 * 1000);
  
  sandbox.expiresAt = newExpiry.toISOString();
  sandbox.credentials.expiration = newExpiry.toISOString();
  sandbox.status = 'HEALTHY';

  addLog({
    sandboxId: id,
    level: 'INFO',
    source: 'kasa:lifecycle:ttl_extender',
    message: `TTL extended by +${additionalMinutes} mins. New expiration: ${newExpiry.toLocaleTimeString()}.`,
    payload: { additionalMinutes, newExpiresAt: sandbox.expiresAt },
  });

  return sandbox;
}

export function terminateSandbox(id: string): boolean {
  const store = getStore();
  const index = store.sandboxes.findIndex(s => s.id === id);
  if (index === -1) return false;

  const sandbox = store.sandboxes[index];
  
  // Archive and remove from active list immediately
  archiveSandbox(sandbox, 'USER_TERMINATED');
  store.sandboxes.splice(index, 1);

  return true;
}

export function injectDiagnosticEvent(
  id: string,
  event: {
    type: 'DTC_FAULT' | 'TELEMETRY_UPDATE' | 'WORKSHOP_ACTION';
    code?: string;
    description?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH';
    rpm?: number;
    speedKmh?: number;
    checkEngine?: boolean;
    note?: string;
  }
): EphemeralSandbox | null {
  const store = getStore();
  const sandbox = store.sandboxes.find(s => s.id === id);
  if (!sandbox) return null;

  if (event.type === 'DTC_FAULT' && event.code) {
    const existing = sandbox.telemetry.activeDtcs.find(d => d.code === event.code);
    if (!existing) {
      sandbox.telemetry.activeDtcs.push({
        code: event.code,
        description: event.description || 'Generic Powertrain Diagnostic Fault',
        severity: event.severity || 'MEDIUM',
      });
      sandbox.telemetry.checkEngineLight = true;
    }

    addLog({
      sandboxId: id,
      level: 'ERROR',
      source: 'kasa:obd2:dtc_injector',
      message: `Diagnostic Trouble Code injected: [${event.code}] - ${event.description || 'MIL Lamp triggered'}.`,
      payload: { dtc: event.code, severity: event.severity || 'MEDIUM', mil: true },
    });
  } else if (event.type === 'TELEMETRY_UPDATE') {
    if (typeof event.rpm === 'number') sandbox.telemetry.rpm = event.rpm;
    if (typeof event.speedKmh === 'number') sandbox.telemetry.speedKmh = event.speedKmh;
    if (typeof event.checkEngine === 'boolean') sandbox.telemetry.checkEngineLight = event.checkEngine;

    addLog({
      sandboxId: id,
      level: 'CAN_BUS',
      source: 'kasa:telematics:can_bus',
      message: `Telemetry broadcast: RPM=${sandbox.telemetry.rpm}, Speed=${sandbox.telemetry.speedKmh} km/h, Temp=${sandbox.telemetry.engineTempC}°C.`,
      payload: { 
        rpm: sandbox.telemetry.rpm, 
        speedKmh: sandbox.telemetry.speedKmh, 
        engineTempC: sandbox.telemetry.engineTempC,
        voltage: sandbox.telemetry.batteryVoltage
      },
    });
  } else if (event.type === 'WORKSHOP_ACTION') {
    addLog({
      sandboxId: id,
      level: 'INFO',
      source: 'kasa:workshop:reception',
      message: `Technician action logged: ${event.note || 'Diagnostic bay inspection complete.'}`,
      payload: { action: event.note },
    });
  }

  return sandbox;
}

export function getLogs(sandboxId?: string): CloudWatchLogEntry[] {
  const store = getStore();
  if (!sandboxId || sandboxId === 'all') return store.logs;
  return store.logs.filter(l => l.sandboxId === sandboxId);
}

export function addLog(log: Omit<CloudWatchLogEntry, 'id' | 'timestamp'>) {
  const store = getStore();
  const newEntry: CloudWatchLogEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    traceId: log.traceId || `Root=1-${Math.random().toString(16).substring(2, 10)}-${Math.random().toString(16).substring(2, 18)}`,
    requestId: log.requestId || `req-${Math.random().toString(36).substring(2, 9)}`,
    durationMs: log.durationMs || Math.floor(10 + Math.random() * 80),
    memoryUsageMb: log.memoryUsageMb || Math.floor(120 + Math.random() * 40),
    cpuPct: log.cpuPct || Number((1.5 + Math.random() * 6).toFixed(1)),
    ...log,
  };
  store.logs.unshift(newEntry);
  if (store.logs.length > 500) {
    store.logs.pop();
  }
}

export function calculateFinOpsMetrics(): FinOpsMetrics {
  const store = getStore();
  const activeCount = store.sandboxes.length;
  
  const totalCompleted = store.totalLaunched;
  const hoursAvoided = totalCompleted * 23.25;
  const costAvoided = Number((hoursAvoided * 0.052).toFixed(2));

  return {
    totalSandboxesLaunched: store.totalLaunched,
    activeInstances: activeCount,
    zombieHoursPrevented: Math.round(hoursAvoided),
    estimatedCostAvoidedUsd: costAvoided,
    averageTtlMinutes: 45,
    carbonGramsAvoided: Math.round(hoursAvoided * 12.4),
  };
}
