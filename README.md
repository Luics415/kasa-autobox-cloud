# 🚗 Kasa AutoBox Cloud

### Instrument-Grade Automotive Ephemeral Sandboxes on AWS

[![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![AWS ECS](https://img.shields.io/badge/AWS-ECS_Fargate_Spot-orange?style=flat&logo=amazon-aws)](https://aws.amazon.com/ecs/)
[![AWS DynamoDB](https://img.shields.io/badge/AWS-DynamoDB_TTL-blue?style=flat&logo=amazon-dynamodb)](https://aws.amazon.com/dynamodb/)
[![AWS CloudWatch](https://img.shields.io/badge/AWS-CloudWatch_Logs-red?style=flat&logo=amazon-cloudwatch)](https://aws.amazon.com/cloudwatch/)
[![AWS STS](https://img.shields.io/badge/AWS-STS_AssumeRole-yellow?style=flat&logo=amazon-aws)](https://aws.amazon.com/iam/)
[![Design Standard](https://img.shields.io/badge/Design-Impeccable_Craft-10b981?style=flat)](https://github.com/pbakaus/impeccable)
[![License](https://img.shields.io/badge/License-Apache_2.0-slate?style=flat)](LICENSE)

> **Kasa AutoBox Cloud** is a specialized, production-ready Cloud Platform designed for the **automotive services, dealership workshops, and connected fleet industry** (inspired by *Kasa-service* ecosystems). It spins up isolated, containerized automotive microservices on **Amazon Web Services (AWS)** bounded by an enforced **Time-To-Live (TTL)**. 
> 
> When the mission clock hits zero, environments are automatically disassembled and compressed into cold storage—guaranteeing **zero zombie cloud resources** and eliminating runaway AWS billing.

---

## 📌 Executive Summary & Problem Space

In modern dealership networks and automotive telematics development:
1. **Cloud Cost Creep:** Developers and diagnostic technicians spin up cloud environments to test firmware updates, ECU fault handling, or workshop booking APIs. When forgotten overnight or through weekends, idle AWS resources generate hundreds or thousands of dollars in wasted compute spend.
2. **Resource Collision:** Multiple technicians testing the same vehicle identification number (VIN) create race conditions in telemetry pipelines and port allocations.
3. **Operational Clutter:** Expired or terminated environments linger in production consoles, distracting engineers from active bay operations.

**Kasa AutoBox Cloud** resolves all three challenges with **ephemeral isolation**, **anti-duplicate conflict detection**, and an **automatic cold storage tier**.

---

## ⚡ Core Architecture & Engineering Highlights

```
                                  +-----------------------------------------------+
                                  |            Kasa AutoBox Web Dashboard         |
                                  |     (Next.js 15 App Router · Tailwind CSS)    |
                                  +-----------------------+-----------------------+
                                                          |
                                      HTTPS REST API & Scoped STS Tokens
                                                          |
                      +-----------------------------------+-----------------------------------+
                      |                                   |                                   |
                      v                                   v                                   v
        +---------------------------+       +---------------------------+       +---------------------------+
        |     Amazon DynamoDB       |       |     Amazon ECS Fargate    |       |   Amazon CloudWatch Logs  |
        |  - Active Bay State Table |       |  - Automotive Microservices|      |  - Live Container Output  |
        |  - Native TTL Auto-Purge  |       |  - Isolated VPC Subnets   |       |  - Structured JSON Stream |
        |  - Sub-millisecond reads  |       |  - Fargate Spot (-70% cost|       |  - Correlation X-Ray IDs  |
        +-------------+-------------+       +-------------+-------------+       +---------------------------+
                      |                                   |
                      | DynamoDB Streams                  |
                      v                                   v
        +---------------------------+       +---------------------------+
        |   EventBridge Scheduler   | ----> |     Lambda Reaper Task    |
        |  (5-minute audit cron)    |       | (Force-dismantle expired) |
        +---------------------------+       +-------------+-------------+
                                                          |
                                                          v
                                            +---------------------------+
                                            |  DynamoDB Cold Storage    |
                                            |  - GZIP Compressed State  |
                                            |  - 1-Click Relaunch Bay   |
                                            +---------------------------+
```

### Key Technical Pillars:

| Component | AWS Technology | Implementation Details |
| :--- | :--- | :--- |
| **Ephemeral Compute** | **Amazon ECS (Fargate Spot)** | Microservices run in isolated Linux containers using Fargate Spot, slashing compute costs by 70% compared to on-demand instances. |
| **Precision TTL Clock** | **DynamoDB TTL + EventBridge** | Tabular, zero-jitter millisecond/second countdown timer. DynamoDB automatically expires records via `expiresAtEpoch` with fallback execution by an EventBridge Reaper Lambda. |
| **Zero Permanent Secrets** | **AWS STS (AssumeRole)** | No static credentials. Each sandbox generates cryptographic session tokens (`ASIAR...`) bounded strictly to the sandbox TTL. |
| **Anti-Duplicate Guard** | **Optimistic Locking & State** | Intercepts duplicate VIN provisioning attempts and renders a tactical 3-choice modal (`Reset TTL`, `Focus Existing`, `Force Duplicate`). |
| **Live Telemetry Engine** | **CloudWatch & CAN-Bus** | Real-time continuous CAN-bus telemetry heartbeat (RPM, speed, engine temperature) pulsating every 2.5s with interactive OBD-II DTC injection (`P0420`, `P0300`, `P0171`, `P0217`). |
| **Cold Storage Vault** | **Compressed State Engine** | Dead sandboxes are stripped from active bay view immediately, serialized into GZIP payloads (<2 KB), and indexed by `<1 week`, `<1 month`, and `<1 year` filters with 1-click restore. |
| **FinOps Metrics** | **Cost Avoidance Algorithm** | Live calculation of compute hours avoided, dollars saved, and carbon footprint reduction based on automotive Fargate rates. |
| **Zero-Cost Dual Mode** | **Simulation / Live AWS** | High-fidelity local in-memory engine for development and testing without AWS credentials, switchable to live AWS infrastructure via top tactical toggle. |

---

## 🎨 Impeccable Design Standards

Built following the [pbakaus/impeccable](https://github.com/pbakaus/impeccable) design craftsmanship principles:
* **Tactical Cockpit Palette:** Deep obsidian ground (`#0a0c10`), razor-thin surface borders (`#1e2638`), diagnostic amber (`#f59e0b`), telemetry nominal emerald (`#10b981`), and cyan data accents (`#06b6d4`).
* **Strict Monospace Tabular Figures:** Clocks, VINs, Task ARNs, and CAN-bus metrics strictly enforce `font-variant-numeric: tabular-nums` to eradicate visual jitter.
* **No AI Clichés:** Zero pastel purple-blue gradient soup, zero decorative blur blobs, zero generic card templates. Every element serves an operational command-center function.
* **Two-Step Destructive Actions:** In-card tactile confirmation replaces intrusive native browser popups with an animated `¿Confirmar?` button.

---

## 🚗 Preset Vehicle Fleet & Automotive Services

The platform ships with 9 real-world commercial and passenger vehicles:

| Vehicle Model | VIN | Powertrain | Diagnostic Profile |
| :--- | :--- | :--- | :--- |
| **Toyota Hilux 2.8 D-4D** | `3N1AB7AP6HY209418` | Diesel 4x4 | Common-rail particulate filter & workshop reception |
| **Ford Ranger Raptor V6** | `1FTFW1ED4MFA19823` | EcoBoost Twin-Turbo | High-throughput CAN-bus telematics gateway |
| **Audi RS6 Avant Quattro** | `WAUZZZF27LN092184` | 4.0L V8 MHEV | Active cylinder deactivation & dynamic ECU tuning |
| **Tesla Model Y Dual Motor** | `5YJ3E1EB8LF839201` | Pure Electric (BEV) | High-voltage battery BMS & inverter thermal loops |
| **RAM 2500 Heavy Duty** | `3C6UR5FL9NG198302` | Cummins Turbo Diesel | Heavy-duty intake & particulate regeneration |
| **Nissan Frontier PRO-4X** | `1N6ED0EA9PN291048` | V6 3.8L | Off-road powertrain & transmission oil pressure |
| **Porsche Taycan Turbo S** | `WP0AB2Y19MSA92810` | 800V Architecture | Fast-charge thermal management & regen braking |
| **Hyundai Tucson Smartstream**| `KM8J33A46NU109283` | Hybrid (HEV) | Dual-clutch transition & regenerative braking |
| **Volvo FH16 750 Globetrotter**| `YV2RTY0A7NA918234` | D16K Diesel | Heavy logistics telematics & Euro VI emission loop |

---

## 🛠️ Quick Start (Local Zero-Cost Mode)

You can clone, install, and execute Kasa AutoBox Cloud immediately without any AWS credentials.

### Prerequisites
* **Node.js**: v18.0.0 or higher (tested on Node 20 & Node 24)
* **npm**: v9.0.0 or higher

### 1. Clone & Install
```bash
git clone https://github.com/Luics415/kasa-autobox-cloud.git
cd kasa-autobox-cloud
npm install
```

### 2. Run Comprehensive Automated Tests
```bash
npm test
```
*Executes unit and integration test suite validating conflict detection, TTL extension, cold storage archival, and FinOps calculations.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if 3000 is occupied) in your browser.

### 4. Build for Production
```bash
npm run build
```
*Compiles all 7 dynamic and static routes cleanly under Next.js 15.*

---

## ☁️ Live AWS Infrastructure Deployment (Terraform)

The `/terraform` directory contains complete Infrastructure-as-Code modules for production AWS provisioning:

```bash
cd terraform

# 1. Initialize AWS and Random providers
terraform init

# 2. Review infrastructure execution plan
terraform plan -out=tfplan

# 3. Apply infrastructure to your AWS account
terraform apply tfplan
```

### Deployed AWS Resources:
* **`aws_ecs_cluster`**: `kasa-autobox-cluster` with Fargate Spot capacity providers.
* **`aws_dynamodb_table`**: `kasa_ephemeral_sandboxes` with native TTL enabled on `expiresAtEpoch`.
* **`aws_cloudwatch_log_group`**: `/ecs/kasa-autobox-sandboxes` with 7-day automated log retention.
* **`aws_cloudwatch_event_rule`**: EventBridge cron triggering every 5 minutes (`cron(0/5 * * * ? *)`).
* **`aws_iam_role`**: Least-privilege execution and task roles with STS AssumeRole policies.

---

## 📡 REST API Reference

The platform exposes an internal REST API for integration with workshop scanners and CI/CD pipelines:

### 1. List Active Ephemeral Sandboxes
```bash
curl -X GET http://localhost:3000/api/sandboxes
```

### 2. Provision New Sandbox (with Anti-Duplicate Guard)
```bash
curl -X POST http://localhost:3000/api/sandboxes \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "workshop-bay",
    "vehicleVin": "3FA6P0H74HR120932",
    "ttlMinutes": 45,
    "customName": "Workshop Reception - Brake Testbench"
  }'
```
*Returns `409 Conflict` if the VIN is already actively running.*

### 3. Extend TTL (+30m)
```bash
curl -X PATCH http://localhost:3000/api/sandboxes/sbx-bay-819 \
  -H "Content-Type: application/json" \
  -d '{"additionalMinutes": 30}'
```

### 4. Inject OBD-II Diagnostic Fault
```bash
curl -X POST http://localhost:3000/api/sandboxes/sbx-bay-819/simulate-event \
  -H "Content-Type: application/json" \
  -d '{
    "type": "DTC_FAULT",
    "code": "P0420",
    "description": "Catalyst System Efficiency Below Threshold",
    "severity": "MEDIUM"
  }'
```

### 5. Terminate and Move to Cold Storage
```bash
curl -X DELETE http://localhost:3000/api/sandboxes/sbx-bay-819
```

### 6. Query Cold Storage Archive
```bash
curl -X GET "http://localhost:3000/api/archive?filter=month"
```

---

## 📂 Project Directory Structure

```
kasa-autobox-cloud/
├── .github/                      # CI/CD Workflows
├── docs/                         # Extended Architectural & API Documentation
│   ├── ARCHITECTURE.md           # Deep dive into AWS Fargate & EventBridge Reaper
│   ├── API.md                    # Detailed OpenAPI/cURL specification
│   └── RUNBOOK.md                # DevOps maintenance & emergency procedures
├── scripts/
│   └── test-engine.mjs           # Automated integration test runner
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── api/                  # REST endpoints (sandboxes, logs, stats, archive)
│   │   ├── layout.tsx            # Root layout with tactical styling
│   │   └── page.tsx              # Main command center with active/archive/docs tabs
│   ├── components/               # Impeccable UI Components
│   │   ├── ArchivedFleetBay.tsx  # Cold storage table with 3 time filters
│   │   ├── CountdownClock.tsx    # Precision tabular countdown clock
│   │   ├── CredentialsDrawer.tsx # Scoped STS session token inspector
│   │   ├── DiagnosticInjector.tsx# OBD-II DTC & CAN-bus dynamic simulator
│   │   ├── DocumentationView.tsx # In-app 7-section technical guide
│   │   ├── DuplicateConfirmModal.tsx # Anti-duplicate conflict resolver
│   │   ├── FinOpsWidget.tsx      # Cost avoidance & compute savings dashboard
│   │   ├── Header.tsx            # Status banner & Dual Mode switch
│   │   ├── LogTerminal.tsx       # Enriched CloudWatch logs stream with JSON viewer
│   │   ├── SandboxCard.tsx       # Automotive bay card with in-card confirmation
│   │   └── SandboxLauncher.tsx   # Fleet provisioning launcher
│   ├── lib/
│   │   ├── aws-service.ts        # AWS SDK v3 adapter (ECS, DynamoDB, CloudWatch, STS)
│   │   ├── mock-engine.ts        # In-memory simulation engine with live CAN heartbeat
│   │   └── templates.ts          # 9 vehicle presets and 3 service stacks
│   └── types/
│       └── sandbox.ts            # TypeScript domain interfaces
├── terraform/                    # Complete AWS Infrastructure as Code
│   ├── main.tf
│   ├── ecs.tf
│   ├── dynamodb.tf
│   ├── eventbridge_reaper.tf
│   ├── iam.tf
│   ├── outputs.tf
│   └── variables.tf
├── Dockerfile                    # Container definition
├── docker-compose.yml            # Multi-service local orchestrator
├── LICENSE                       # Apache License 2.0
├── package.json
└── tsconfig.json
```

---

## 👨‍💻 Author

**Luis Enrique Rivera Delgado**
* **GitHub:** [@Luics415](https://github.com/Luics415)
* **LinkedIn:** [luis-enrique-rivera-delgado](https://linkedin.com/in/luis-enrique-rivera-delgado)
* **Portfolio:** [luics415.github.io](https://luics415.github.io)

---

## 📄 License

Licensed under the **Apache License, Version 2.0**. See the [LICENSE](LICENSE) file for complete terms and copyright notices.
