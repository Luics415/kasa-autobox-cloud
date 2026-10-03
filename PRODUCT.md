# PRODUCT.md — Kasa AutoBox Cloud

## Purpose & Positioning
**Kasa AutoBox Cloud** is a specialized, instrument-grade Ephemeral Cloud Sandbox platform designed for the automotive services industry (dealership workshops, fleet management, and telemática ecosystems like Kasa-service). 

It allows software engineers, QA testers, and dealership integration specialists to provision isolated, containerized automotive microservice environments on AWS (or local simulation) with an enforced Time-To-Live (TTL). Once the TTL expires, the environment auto-destructs, eliminating "zombie cloud resources" and slashing cloud infrastructure bills.

## Primary Users & Scenarios
1. **Automotive QA & Integration Engineers**: Need an isolated, clean workshop service environment (e.g., reception desk API, OBD-II ingestion pipeline, parts catalog) to test a new build or reproduce a vehicle diagnostic bug without polluting production or shared staging.
2. **Field Solutions Architects & Demo Teams**: Delivering live demonstrations of dealership workshop management software with vehicle telemetry, requiring clean demo data and temporary access credentials that auto-expire after the customer meeting.
3. **Cloud DevOps & FinOps Leads**: Mandating zero-idle container policies across engineering teams to prevent forgotten staging environments from running 24/7.

## Core Capabilities
- **Ephemeral Sandbox Orchestration**: Spin up isolated automotive service environments in seconds (Amazon ECS Fargate tasks in AWS mode, or ultra-fast container/mock runtime in Local mode).
- **Precision Countdown Clock & Lifecycle Control**: Live tabular countdown timer with millisecond/second fidelity, visual expiration warnings, "+30 min extend" quick actions, and instant manual termination.
- **Direct Access & STS Credential Vault**: Direct HTTP URL to the running service endpoint with one-click copyable temporary AWS STS access tokens (AccessKeyId, SecretAccessKey, SessionToken) scoped specifically to the sandbox.
- **Automotive Diagnostic & CAN-Bus Simulator**: Built-in testbench to dispatch live OBD-II diagnostic trouble codes (DTCs like P0300, P0420, P0171), vehicle speed/RPM events, and workshop bay check-in signals directly into the sandbox.
- **CloudWatch Logs Terminal**: High-density, real-time log streaming interface replicating Amazon CloudWatch Logs with log level filtering, auto-scroll, and search.
- **FinOps Cost Avoidance Engine**: Real-time counter of cloud dollars saved and idle CPU hours avoided by utilizing ephemeral lifecycles compared to standard 24/7 provisioned infrastructure.
- **Dual-Mode Architecture (AWS Live + Zero-Config Local Simulator)**: Runs out-of-the-box in local development with complete functional realism (no AWS account needed to evaluate the UI and workflows), with seamless toggle to connect to live AWS credentials via `@aws-sdk`.

## Platform & Tech Stack
- **Platform**: Web (Desktop & Tablet responsive, optimized for command centers and workshop workstations).
- **Frontend / Fullstack**: Next.js (App Router, React 19, TypeScript), Tailwind CSS, Lucide Icons.
- **Backend Services**: Next.js API Routes + AWS SDK v3 (`@aws-sdk/client-ecs`, `@aws-sdk/client-dynamodb`, `@aws-sdk/client-cloudwatch-logs`, `@aws-sdk/client-sts`).
- **Infrastructure as Code (IaC)**: Terraform definition (`/terraform`) for AWS ECS cluster, Fargate task definition, DynamoDB state table, and EventBridge reaper rule.

## Quality & Design Commitments (Impeccable Principles)
- No generic AI-generated tropes: zero floating blurry gradient blobs, zero identical lazy card grids, zero purple-to-blue generic gradients.
- Aesthetic world: **Tactical Automotive Diagnostic Cockpit / Telemetry Bench**. Dark obsidian surfaces (`#0a0c10`), crisp hairline borders (`#1e2430`), amber warning indicators (`#f59e0b`), nominal emerald telemetry accents (`#10b981`), and monospace tabular numbers for all clocks, VINs, and metric values.
