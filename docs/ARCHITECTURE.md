# 🏗️ Kasa AutoBox Cloud — System Architecture & Design

## 1. High-Level Architecture Overview

Kasa AutoBox Cloud implements an **Event-Driven Ephemeral Container Platform** tailored for automotive software testing and dealership operations.

```
                    +------------------------------------+
                    |       Tech / Diagnostic Web UI     |
                    +-----------------+------------------+
                                      |
                     HTTPS / JSON REST API Calls
                                      |
                                      v
                    +------------------------------------+
                    |      Next.js 15 Control Plane      |
                    |  - Anti-Duplicate Vehicle Guard    |
                    |  - STS Token Minting Coordinator   |
                    |  - FinOps Cost Avoidance Engine    |
                    +--------+------------------+--------+
                             |                  |
           +-----------------+                  +-----------------+
           |                                                      |
           v                                                      v
+------------------------+                             +------------------------+
|  Amazon DynamoDB       |                             |   Amazon ECS (Fargate) |
|  - Active Bay Records  |                             |   - Vehicle Containers |
|  - TTL: expiresAtEpoch |                             |   - Fargate Spot (-70%)|
|  - Sub-ms Latency      |                             |   - Private VPC Subnet |
+-----------+------------+                             +-----------+------------+
            |                                                      |
            | TTL Expiration                                       | Stdout / Stderr
            v                                                      v
+------------------------+                             +------------------------+
|  AWS EventBridge       |                             | Amazon CloudWatch Logs |
|  - 5-Min Audit Cron    |                             | - /ecs/kasa-autobox    |
|  - Triggers Reaper     |                             | - Structured JSON      |
+-----------+------------+                             +------------------------+
            |
            v
+------------------------+
|  AWS Lambda "Reaper"   |
|  - Stops ECS Tasks     |
|  - Compresses State    |
|  - Moves to Cold Vault |
+------------------------+
```

---

## 2. Ephemeral Lifecycle & The Reaper Pattern

Every vehicle sandbox progresses through four distinct lifecycle phases:

```
[ PROVISIONING ] ──> [ HEALTHY / RUNNING ] ──> [ EXPIRING_SOON (<15m) ] ──> [ AUTO-DISASSEMBLED / COLD ARCHIVE ]
```

### Self-Destruction Mechanisms:
1. **Primary: Amazon DynamoDB Native TTL**
   * DynamoDB inspects the `expiresAtEpoch` timestamp (Unix epoch in seconds).
   * Upon reaching expiration, DynamoDB automatically deletes the item from the active table without incurring write capacity unit (WCU) costs.
2. **Secondary: AWS EventBridge Reaper (Cron Fallback)**
   * A scheduled rule `cron(0/5 * * * ? *)` invokes a lightweight AWS Lambda function every 5 minutes.
   * The function queries running ECS tasks in `kasa-autobox-cluster`. Any task whose runtime exceeded its configured TTL is terminated via `ecs:StopTask`.
3. **Tertiary: Client-Side Tabular Clock Auto-Teardown**
   * In the web interface, the `CountdownClock` component calculates remaining seconds in real time. When `remaining <= 0`, it triggers the optimistic client teardown hook, moving the car into the Cold Storage bay immediately.

---

## 3. Security & Scoped STS Token Vending

To avoid exposing static, long-lived AWS IAM access keys:
* When a sandbox is created, the control plane calls `sts:AssumeRole` targeting `arn:aws:iam::<ACCOUNT_ID>:role/kasa-ephemeral-sandbox-role`.
* The `DurationSeconds` parameter is set to match the exact sandbox TTL (e.g. 1800s for a 30m sandbox).
* The session credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`) expire cryptographically when the container terminates.

---

## 4. Cold Storage Tier & Data Compression

When a sandbox is terminated (either automatically via TTL or manually by the technician):
1. **Active Fleet Exclusion**: The sandbox is instantly unlinked from active memory and UI grids.
2. **State Serialization & Compression**:
   * Telemetry snapshots (final RPM, fuel level, coolant temperature).
   * Active Diagnostic Trouble Codes (DTCs).
   * Total uptime and estimated compute costs.
   * Compressed into a compact GZIP Base64 payload (<2 KB per record).
3. **Temporal Query Indexing**:
   * Indexed by `<1 week`, `<1 month`, and `<1 year` retention windows.
   * Supports 1-Click Relaunch, reproducing the exact vehicle and container stack.
