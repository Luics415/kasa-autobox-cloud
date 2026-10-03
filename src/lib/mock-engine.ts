import { 
  EphemeralSandbox, 
  CloudWatchLogEntry, 
  FinOpsMetrics, 
  SandboxTemplateId, 
  VehicleProfile 
} from '@/types/sandbox';
import { SANDBOX_TEMPLATES, PRESET_VEHICLES } from './templates';

// In-memory persistent state across hot-reloads via global singleton
interface GlobalStore {
  sandboxes: EphemeralSandbox[];
  logs: CloudWatchLogEntry[];
  totalLaunched: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __kasaAutoBoxStore: GlobalStore | undefined;
}

function getStore(): GlobalStore {
  if (!global.__kasaAutoBoxStore) {
    const now = new Date();
    
    // Seed initial realistic sandboxes so the user immediately sees a live system!
    const initialSandboxes: EphemeralSandbox[] = [
      {
        id: 'sbx-bay-819',
        name: 'Kasa Workshop Reception Bench #1',
        templateId: 'workshop-bay',
        status: 'HEALTHY',
        createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        expiresAt: new Date(now.getTime() + 45 * 60 * 1000).toISOString(),
        initialTtlMinutes: 60,
        vehicle: PRESET_VEHICLES[0],
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
        status: 'EXPIRING_SOON',
        createdAt: new Date(now.getTime() - 52 * 60 * 1000).toISOString(),
        expiresAt: new Date(now.getTime() + 8 * 60 * 1000).toISOString(), // 8 mins left!
        initialTtlMinutes: 60,
        vehicle: PRESET_VEHICLES[1],
        endpointUrl: 'https://sbx-obd-404.us-east-1.ecs.kasa-autobox.net/telemetry/stream',
        awsEcsTaskArn: 'arn:aws:ecs:us-east-1:492817290192:task/kasa-autobox-cluster/3c7b91d4e08215aa',
        ecsClusterName: 'kasa-autobox-prod',
        cloudWatchLogStream: 'ecs/kasa-telematics-streamer/3c7b91d4e08215aa',
        credentials: {
          accessKeyId: 'ASIAR928BKAOTEMP404Y',
          secretAccessKey: 'wL9x8J+m1R3t4VqS2kK3hN0jP9rE5gF7cB1aZ3d8',
          sessionToken: 'IQoJb3JpZ2luX2VjEOr//////////wEaCXVzLWVhc3QtMSJHMEUCIQDf8k2w...kasa-ephemeral-session-obd404',
          expiration: new Date(now.getTime() + 8 * 60 * 1000).toISOString(),
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

    const initialLogs: CloudWatchLogEntry[] = [
      {
        id: 'log-1',
        timestamp: new Date(now.getTime() - 14 * 60 * 1000).toISOString(),
        sandboxId: 'sbx-bay-819',
        level: 'INFO',
        source: 'aws:ecs:task',
        message: 'Task container started on AWS Fargate runtime (v1.4.0). Port 8080 open.',
      },
      {
        id: 'log-2',
        timestamp: new Date(now.getTime() - 12 * 60 * 1000).toISOString(),
        sandboxId: 'sbx-bay-819',
        level: 'STS_AUTH',
        source: 'aws:sts:assumerole',
        message: 'Issued temporary STS role session credentials (TTL: 60m). SessionId: kasa-sess-bay819.',
      },
      {
        id: 'log-3',
        timestamp: new Date(now.getTime() - 6 * 60 * 1000).toISOString(),
        sandboxId: 'sbx-bay-819',
        level: 'INFO',
        source: 'kasa:workshop:reception',
        message: 'Intake reception registered for VIN 3N1AB7AP6HY209418. Work order #WO-9941 created.',
      },
      {
        id: 'log-4',
        timestamp: new Date(now.getTime() - 50 * 60 * 1000).toISOString(),
        sandboxId: 'sbx-obd-404',
        level: 'CAN_BUS',
        source: 'kasa:obd2:can_router',
        message: 'CAN Frame received [0x7DF 0x02 0x01 0x0C]: Engine RPM=2450. Vehicle Speed=74 km/h.',
      },
      {
        id: 'log-5',
        timestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
        sandboxId: 'sbx-obd-404',
        level: 'WARN',
        source: 'kasa:ecu:mil_monitor',
        message: 'Diagnostic Trouble Code detected: P0420 (Catalyst System Efficiency Below Threshold). Check Engine Light commanded ON.',
      },
    ];

    global.__kasaAutoBoxStore = {
      sandboxes: initialSandboxes,
      logs: initialLogs,
      totalLaunched: 14,
    };
  }
  return global.__kasaAutoBoxStore;
}

export function listSandboxes(): EphemeralSandbox[] {
  const store = getStore();
  const now = Date.now();

  // Auto-update status based on real-time TTL
  store.sandboxes = store.sandboxes.map(sbx => {
    const expiresMs = new Date(sbx.expiresAt).getTime();
    const remainingMs = expiresMs - now;

    if (remainingMs <= 0 && sbx.status !== 'TERMINATED') {
      return { ...sbx, status: 'TERMINATED' };
    }
    if (remainingMs > 0 && remainingMs <= 15 * 60 * 1000 && sbx.status === 'HEALTHY') {
      return { ...sbx, status: 'EXPIRING_SOON' };
    }
    return sbx;
  });

  return store.sandboxes;
}

export function getSandboxById(id: string): EphemeralSandbox | undefined {
  const sandboxes = listSandboxes();
  return sandboxes.find(s => s.id === id);
}

export function createSandbox(params: {
  templateId: SandboxTemplateId;
  ttlMinutes: number;
  vehicleVin?: string;
  customName?: string;
}): EphemeralSandbox {
  const store = getStore();
  const now = new Date();
  const template = SANDBOX_TEMPLATES.find(t => t.id === params.templateId) || SANDBOX_TEMPLATES[0];
  const vehicle = PRESET_VEHICLES.find(v => v.vin === params.vehicleVin) || PRESET_VEHICLES[0];
  
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

  // Append initial provisioning logs
  addLog({
    sandboxId,
    level: 'INFO',
    source: 'aws:ecs:fargate',
    message: `Provisioning task on cluster 'kasa-autobox-prod'. CPU: ${template.defaultCpuUnits}, RAM: ${template.defaultMemoryMb}MB.`,
  });

  addLog({
    sandboxId,
    level: 'STS_AUTH',
    source: 'aws:sts:assumerole',
    message: `Generated scoped STS credentials for sandbox ${sandboxId}. Enforced TTL: ${params.ttlMinutes}m.`,
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
      });
    }
  }, 2000);

  return newSandbox;
}

export function extendTtl(id: string, additionalMinutes: number = 30): EphemeralSandbox | null {
  const store = getStore();
  const sandbox = store.sandboxes.find(s => s.id === id);
  if (!sandbox || sandbox.status === 'TERMINATED') return null;

  const currentExpiry = new Date(sandbox.expiresAt).getTime();
  const newExpiry = new Date(Math.max(Date.now(), currentExpiry) + additionalMinutes * 60 * 1000);
  
  sandbox.expiresAt = newExpiry.toISOString();
  sandbox.credentials.expiration = newExpiry.toISOString();
  if (sandbox.status === 'EXPIRING_SOON') {
    sandbox.status = 'HEALTHY';
  }

  addLog({
    sandboxId: id,
    level: 'INFO',
    source: 'kasa:lifecycle:ttl_extender',
    message: `TTL extended by +${additionalMinutes} mins. New expiration: ${newExpiry.toLocaleTimeString()}.`,
  });

  return sandbox;
}

export function terminateSandbox(id: string): boolean {
  const store = getStore();
  const index = store.sandboxes.findIndex(s => s.id === id);
  if (index === -1) return false;

  const sandbox = store.sandboxes[index];
  sandbox.status = 'TERMINATED';

  addLog({
    sandboxId: id,
    level: 'WARN',
    source: 'aws:eventbridge:reaper',
    message: `Teardown signal dispatched to AWS ECS Task '${sandbox.awsEcsTaskArn}'. Container stopped. Port closed.`,
  });

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
  if (!sandbox || sandbox.status === 'TERMINATED') return null;

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
    });
  } else if (event.type === 'WORKSHOP_ACTION') {
    addLog({
      sandboxId: id,
      level: 'INFO',
      source: 'kasa:workshop:reception',
      message: `Technician action logged: ${event.note || 'Diagnostic bay inspection complete.'}`,
    });
  }

  return sandbox;
}

export function getLogs(sandboxId?: string): CloudWatchLogEntry[] {
  const store = getStore();
  if (!sandboxId) return store.logs;
  return store.logs.filter(l => l.sandboxId === sandboxId);
}

export function addLog(log: Omit<CloudWatchLogEntry, 'id' | 'timestamp'>) {
  const store = getStore();
  const newEntry: CloudWatchLogEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ...log,
  };
  store.logs.unshift(newEntry);
  if (store.logs.length > 500) {
    store.logs.pop();
  }
}

export function calculateFinOpsMetrics(): FinOpsMetrics {
  const store = getStore();
  const activeCount = store.sandboxes.filter(s => s.status !== 'TERMINATED').length;
  
  // Real calculation: Each 24/7 idle Fargate container costs ~$36/month ($0.05/hr)
  // Ephemeral sandboxes auto-terminate after an average of 45 minutes instead of running 24h/day.
  const hoursAvoided = (store.totalLaunched * 23.25);
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
