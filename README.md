# 🚗 Kasa AutoBox Cloud — Automotive Ephemeral Sandboxes on AWS

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![AWS ECS](https://img.shields.io/badge/AWS-ECS_Fargate-orange?style=flat&logo=amazon-aws)](https://aws.amazon.com/ecs/)
[![AWS DynamoDB](https://img.shields.io/badge/AWS-DynamoDB_TTL-blue?style=flat&logo=amazon-dynamodb)](https://aws.amazon.com/dynamodb/)
[![AWS CloudWatch](https://img.shields.io/badge/AWS-CloudWatch_Logs-red?style=flat&logo=amazon-cloudwatch)](https://aws.amazon.com/cloudwatch/)
[![Design Standard](https://img.shields.io/badge/Design-Impeccable_Craft-10b981?style=flat)](https://github.com/pbakaus/impeccable)
[![License](https://img.shields.io/badge/License-Apache_2.0-slate?style=flat)](LICENSE)

> **Kasa AutoBox Cloud** is an instrument-grade, on-demand Ephemeral Sandbox Platform tailored for the **automotive services and dealership workshop industry** (inspired by ecosystems like *Kasa-service*). It provisions isolated, containerized automotive microservices on **Amazon Web Services (AWS)** with an enforced Time-To-Live (TTL). Once the TTL expires, the environment auto-destructs, eliminating "zombie cloud resources" and slashing cloud bills.

---

## 💡 The Business Problem

In automotive software development (dealership workshop reception, fleet telematics, ECU diagnostics, spare parts catalogs), engineers and QA teams constantly need staging environments to test new releases or reproduce vehicle diagnostic bugs. 

Keeping multiple staging environments running 24/7 on AWS incurs hundreds or thousands of dollars in idle compute costs every month. **Kasa AutoBox Cloud** transforms this into an on-demand, self-service model where environments exist only while actively being tested.

---

## 🌟 Key Capabilities & AWS Integrations

| Feature | AWS Service / Architecture | Description |
| :--- | :--- | :--- |
| **Ephemeral Tasks** | **Amazon ECS (Fargate Spot)** | Serverless, isolated container execution for automotive service stacks with zero persistent server management. |
| **Precision Countdown & TTL** | **Amazon DynamoDB + EventBridge** | Real-time millisecond/second tabular countdown clock. Auto-destruction enforced via DynamoDB TTL and scheduled EventBridge reapers. |
| **Temporary Access Credentials** | **AWS STS (AssumeRole)** | One-click copyable scoped session tokens (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`) that auto-expire with the container. |
| **Diagnostic & CAN-Bus Simulator** | **ECU Diagnostic Testbench** | Live injection of OBD-II Diagnostic Trouble Codes (`P0420`, `P0300`, `P0171`, `P0217`) and CAN-Bus RPM/speed dynamics directly into active bays. |
| **Live Log Streaming** | **Amazon CloudWatch Logs** | Terminal-grade stream console replicating CloudWatch log groups with severity filtering (`INFO`, `WARN`, `ERROR`, `CAN-BUS`, `STS-AUTH`). |
| **FinOps Cost Avoidance** | **Cloud Cost Engine** | Real-time dashboard ticker showing compute hours eliminated, dollars saved, and carbon offset compared to 24/7 infrastructure. |
| **Zero-Cost Dual Mode** | **Hybrid Runtime** | Runs out-of-the-box locally with a high-fidelity simulation engine (no AWS credentials required to test), with seamless toggle to live AWS. |

---

## 🎨 Crafted with Impeccable Design Standards

Built following the [pbakaus/impeccable](https://github.com/pbakaus/impeccable) frontend craftsmanship framework:
* **Tactical Automotive Instrument Aesthetic**: Deep obsidian slate ground (`#0a0c10`), hairline borders (`#1e2638`), ignition amber (`#f59e0b`), and telemetry emerald (`#10b981`).
* **Strict Monospace Tabular Numerals**: Countdown clocks, VINs, Task ARNs, and CAN-bus metrics use `font-variant-numeric: tabular-nums` to eliminate jitter.
* **Refusal of Generic AI Tropes**: Zero pastel gradient blobs, zero repetitive lazy card grids, zero emojis disguised as icons (consistent 1.5px stroke Lucide SVGs).
* **High Information Density**: Designed for command centers, workshop reception bays, and DevOps war rooms.

---

## 📐 Architecture Diagram

```
                                      +---------------------------------------------+
                                      |         Kasa AutoBox Web Dashboard          |
                                      |     (Next.js 15 + Tailwind + Impeccable)    |
                                      +---------------------------------------------+
                                                             |
                                         REST API / AWS SDK v3 Client
                                                             |
                      +--------------------------------------+--------------------------------------+
                      |                                      |                                      |
                      v                                      v                                      v
        +----------------------------+         +----------------------------+         +----------------------------+
        |      Amazon DynamoDB       |         |      Amazon ECS Fargate    |         |    Amazon CloudWatch       |
        |   - Sandbox State Table    |         |   - Automotive API Tasks   |         |   - Live Container Logs    |
        |   - Native TTL Auto-Purge  |         |   - Isolated VPC Subnets   |         |   - OBD-II Diagnostic Feed |
        +----------------------------+         +----------------------------+         +----------------------------+
                      ^                                      ^
                      |                                      |
                      +------------------+-------------------+
                                         |
                                         v
                         +-------------------------------+
                         |    AWS EventBridge + Lambda   |
                         |     "The Sandbox Reaper"      |
                         |  (Auto-destruction on expiry) |
                         +-------------------------------+
```

---

## 🚀 Quick Start (Local Zero-Cost Mode)

You can clone and run Kasa AutoBox Cloud immediately without configuring any AWS account. The platform includes a realistic local simulation engine.

### Prerequisites
* Node.js 18+ (tested on Node 20 & 24)
* npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/your-username/kasa-autobox-cloud.git
cd kasa-autobox-cloud
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Engine Tests
```bash
npm test
```

---

## 🐳 Running with Docker

```bash
docker compose up --build
```
Access the application at `http://localhost:3000`.

---

## ☁️ Deploying to Real AWS (Production Mode)

### 1. Configure AWS Credentials
Ensure your environment has AWS credentials configured:
```bash
aws configure
```

### 2. Provision Infrastructure with Terraform
```bash
cd terraform
terraform init
terraform plan
terraform apply
```
This deploys the ECS cluster, Fargate task definitions, CloudWatch log groups, DynamoDB table with TTL, and least-privilege IAM roles.

### 3. Enable Live AWS Mode
In `.env.local`:
```env
NEXT_PUBLIC_APP_MODE=aws
AWS_REGION=us-east-1
AWS_ECS_CLUSTER=kasa-autobox-cluster
AWS_DYNAMODB_TABLE=kasa-autobox-sandboxes
AWS_CLOUDWATCH_LOG_GROUP=/ecs/kasa-autobox-sandboxes
```
Restart the application to connect directly to your AWS resources.

---

## 📁 Repository Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── sandboxes/            # GET / POST sandboxes
│   │   │   │   └── [id]/             # GET / DELETE (teardown) / PATCH (extend TTL)
│   │   │   │       ├── logs/         # GET CloudWatch logs for sandbox
│   │   │   │       └── simulate-event/# POST OBD-II DTCs & telemetry
│   │   │   └── stats/                # GET FinOps cost avoidance metrics
│   │   ├── globals.css               # Impeccable automotive tokens & styling
│   │   ├── layout.tsx                # App root layout & metadata
│   │   └── page.tsx                  # Main Command Center Dashboard
│   ├── components/
│   │   ├── CountdownClock.tsx        # High-precision tabular countdown timer
│   │   ├── CredentialsDrawer.tsx     # AWS STS temporary token copy vault
│   │   ├── DiagnosticInjector.tsx    # OBD-II DTC fault & CAN-bus testbench
│   │   ├── FinOpsWidget.tsx          # Cloud cost avoidance analytics
│   │   ├── Header.tsx                # Brand, status ribbon, and mode toggle
│   │   ├── LogTerminal.tsx           # CloudWatch logs streaming console
│   │   ├── SandboxCard.tsx           # Ephemeral bay card with direct URL & metrics
│   │   └── SandboxLauncher.tsx       # Automotive stack provisioning bay
│   ├── lib/
│   │   ├── aws-service.ts            # AWS SDK v3 adapter (ECS, DynamoDB, CloudWatch, STS)
│   │   ├── mock-engine.ts            # Local zero-cost simulation engine
│   │   └── templates.ts              # Automotive service stacks & VIN profiles
│   └── types/
│       └── sandbox.ts                # TypeScript domain models
├── terraform/                        # Infrastructure as Code (IaC)
│   ├── main.tf                       # Provider configuration
│   ├── ecs.tf                        # ECS Cluster, Fargate Spot & Log Groups
│   ├── dynamodb.tf                   # DynamoDB Table with TTL & Streams
│   ├── eventbridge_reaper.tf         # Automated teardown scheduler
│   ├── iam.tf                        # Scoped STS assume role & execution policies
│   ├── variables.tf                  # Configurable inputs
│   └── outputs.tf                    # Resource ARNs & connection endpoints
├── scripts/
│   └── test-engine.mjs               # Automated verification suite
├── Dockerfile                        # Multi-stage production container
├── docker-compose.yml                # 1-command containerized startup
├── PRODUCT.md                        # Durable product truth & domain specifications
├── DESIGN.md                         # Impeccable design system authority
└── package.json
```

---

## 🛠️ Automotive Service Stacks Included

1. **Kasa Workshop & Service Bay API**: Vehicle intake reception, automated work order dispatching, technician scheduling, and parts inventory API.
2. **OBD-II Telematics Ingestion Gateway**: High-throughput microservice streaming CAN bus messages, engine RPM, fuel economy, and geolocation pings.
3. **ECU Diagnostic & Fault Testbench**: Simulates electronic control unit (ECU) freeze frames, OBD-II Diagnostic Trouble Codes (DTCs), and MIL alerts.

---

## 📄 License
This project is licensed under the Apache License 2.0.
