# 🛠️ Kasa AutoBox Cloud — Operations & Maintenance Runbook

This document outlines standard operating procedures (SOPs) for site reliability engineers (SREs), DevOps administrators, and automotive workshop supervisors.

---

## 1. Routine Health Audits

### 1.1 List Active ECS Tasks
Verify that all running tasks have a valid corresponding record in DynamoDB:
```bash
aws ecs list-tasks \
  --cluster kasa-autobox-prod \
  --desired-status RUNNING
```

### 1.2 Inspect DynamoDB TTL Health
Ensure native Time-To-Live remains enabled and healthy:
```bash
aws dynamodb describe-time-to-live \
  --table-name kasa_ephemeral_sandboxes
```

### 1.3 Audit CloudWatch Log Stream Ingestion
Check for unparsed container output or critical memory pressure:
```bash
aws logs filter-log-events \
  --log-group-name /ecs/kasa-autobox-sandboxes \
  --filter-pattern "?ERROR ?CRITICAL ?OOM" \
  --limit 20
```

---

## 2. Emergency Procedures (Incident Response)

### 2.1 Orphan Task Mass Drain
If a developer configured an abnormal TTL or a bug prevents auto-termination, stop all tasks in the cluster immediately:
```bash
for task in $(aws ecs list-tasks --cluster kasa-autobox-prod --output text --query "taskArns[]"); do
  aws ecs stop-task \
    --cluster kasa-autobox-prod \
    --task $task \
    --reason "Emergency mass drain: SRE maintenance"
done
```

### 2.2 Cold Storage Manual Purge (>365 Days)
Historical records beyond 1 year can be archived directly to S3 Glacier or purged:
```bash
aws dynamodb scan \
  --table-name kasa_historical_archives \
  --filter-expression "terminatedAtEpoch < :cutoff" \
  --expression-attribute-values '{":cutoff": {"N": "1735689600"}}'
```

---

## 3. Recommended CloudWatch Alarms

| Metric Name | Threshold | Action |
| :--- | :--- | :--- |
| `ConcurrentTasksRunning` | `> 25 tasks` | SNS Alert to Workshop Lead |
| `ReaperLambdaErrors` | `> 0 errors / 15m` | PagerDuty / SRE P1 |
| `EstimatedCharges` | `> $50 daily increase` | Cost Anomaly Investigation |
| `DynamoDBThrottledRequests` | `> 5 requests / 5m` | Adjust On-Demand Read/Write Units |
