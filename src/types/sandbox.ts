export type SandboxTemplateId = 
  | 'workshop-bay' 
  | 'obd-telematics' 
  | 'fault-simulator';

export interface SandboxTemplate {
  id: SandboxTemplateId;
  name: string;
  category: string;
  description: string;
  containerPort: number;
  dockerImage: string;
  defaultMemoryMb: number;
  defaultCpuUnits: number;
}

export type SandboxStatus = 
  | 'PROVISIONING'
  | 'HEALTHY'
  | 'EXPIRING_SOON'
  | 'TERMINATING'
  | 'TERMINATED';

export interface VehicleProfile {
  vin: string;
  model: string;
  licensePlate: string;
  odometerKm: number;
  fuelType: 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'EV';
}

export interface TemporaryStsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: string;
  scopedRoleArn: string;
}

export interface VehicleTelemetryState {
  rpm: number;
  speedKmh: number;
  fuelLevelPct: number;
  engineTempC: number;
  batteryVoltage: number;
  checkEngineLight: boolean;
  activeDtcs: Array<{
    code: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
}

export interface EphemeralSandbox {
  id: string;
  name: string;
  templateId: SandboxTemplateId;
  status: SandboxStatus;
  createdAt: string;
  expiresAt: string;
  initialTtlMinutes: number;
  vehicle: VehicleProfile;
  endpointUrl: string;
  awsEcsTaskArn: string;
  ecsClusterName: string;
  cloudWatchLogStream: string;
  credentials: TemporaryStsCredentials;
  telemetry: VehicleTelemetryState;
}

export interface ArchivedSandbox {
  id: string;
  name: string;
  templateId: SandboxTemplateId;
  vehicle: VehicleProfile;
  createdAt: string;
  terminatedAt: string;
  terminationReason: 'TTL_EXPIRED' | 'USER_TERMINATED' | 'FORCE_REPLACED';
  totalUptimeMinutes: number;
  estimatedCostUsd: number;
  finalDtcs: Array<{ code: string; description: string }>;
  compressedPayloadSnippet: string;
  compressedSizeKb: number;
  logCount: number;
}

export interface CloudWatchLogEntry {
  id: string;
  timestamp: string;
  sandboxId: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CAN_BUS' | 'STS_AUTH';
  source: string;
  message: string;
  traceId?: string;
  requestId?: string;
  durationMs?: number;
  memoryUsageMb?: number;
  cpuPct?: number;
  httpStatusCode?: number;
  payload?: Record<string, unknown>;
}

export interface FinOpsMetrics {
  totalSandboxesLaunched: number;
  activeInstances: number;
  zombieHoursPrevented: number;
  estimatedCostAvoidedUsd: number;
  averageTtlMinutes: number;
  carbonGramsAvoided: number;
}

export interface SandboxConflictData {
  hasConflict: boolean;
  existingSandbox: EphemeralSandbox;
  vehicle: VehicleProfile;
}
