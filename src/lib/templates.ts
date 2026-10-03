import { SandboxTemplate, VehicleProfile } from '@/types/sandbox';

export const SANDBOX_TEMPLATES: SandboxTemplate[] = [
  {
    id: 'workshop-bay',
    name: 'Kasa Workshop & Service Bay API',
    category: 'Dealership Operations',
    description: 'Vehicle intake reception, automated work order dispatching, technician scheduling, and parts inventory API.',
    containerPort: 8080,
    dockerImage: '123456789012.dkr.ecr.us-east-1.amazonaws.com/kasa/workshop-service:v2.4.1',
    defaultMemoryMb: 512,
    defaultCpuUnits: 256,
  },
  {
    id: 'obd-telematics',
    name: 'OBD-II Telematics Ingestion Gateway',
    category: 'Connected Vehicle IoT',
    description: 'High-throughput microservice streaming CAN bus messages, engine RPM, fuel economy, and geolocation pings.',
    containerPort: 9000,
    dockerImage: '123456789012.dkr.ecr.us-east-1.amazonaws.com/kasa/telematics-streamer:v1.9.0',
    defaultMemoryMb: 1024,
    defaultCpuUnits: 512,
  },
  {
    id: 'fault-simulator',
    name: 'ECU Diagnostic & Fault Testbench',
    category: 'Diagnostics & QA',
    description: 'Simulates electronic control unit (ECU) freeze frames, OBD-II Diagnostic Trouble Codes (DTCs), and MIL alerts.',
    containerPort: 8000,
    dockerImage: '123456789012.dkr.ecr.us-east-1.amazonaws.com/kasa/diagnostic-bench:v3.1.2',
    defaultMemoryMb: 512,
    defaultCpuUnits: 256,
  },
];

export const PRESET_VEHICLES: VehicleProfile[] = [
  {
    vin: '3N1AB7AP6HY209418',
    model: 'Toyota Hilux 2.8 D-4D 4x4',
    licensePlate: 'KS-882-TL',
    odometerKm: 34120,
    fuelType: 'DIESEL',
  },
  {
    vin: '1FTFW1ED4MFA19823',
    model: 'Ford Ranger Raptor V6 EcoBoost',
    licensePlate: 'KB-501-RP',
    odometerKm: 18450,
    fuelType: 'GASOLINE',
  },
  {
    vin: 'WAUZZZF27NA082914',
    model: 'Audi RS6 Avant Quattro',
    licensePlate: 'KS-006-AV',
    odometerKm: 42100,
    fuelType: 'HYBRID',
  },
  {
    vin: '5YJ3E1EB9MF829104',
    model: 'Tesla Model Y Performance Dual Motor',
    licensePlate: 'EV-990-KS',
    odometerKm: 27800,
    fuelType: 'EV',
  },
];
