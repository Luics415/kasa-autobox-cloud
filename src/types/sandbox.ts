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

export interface CloudWatchLogEntry {
  id: string;
  timestamp: string;
  sandboxId: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CAN_BUS' | 'STS_AUTH';
  source: string;
  message: string;
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
