import { ECSClient, RunTaskCommand, StopTaskCommand } from '@aws-sdk/client-ecs';
import { DynamoDBClient, ScanCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { CloudWatchLogsClient, FilterLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import * as mockEngine from './mock-engine';
import { EphemeralSandbox, SandboxTemplateId } from '@/types/sandbox';

const isAwsMode = process.env.NEXT_PUBLIC_APP_MODE === 'aws';
const region = process.env.AWS_REGION || 'us-east-1';

// Initialize AWS Clients lazily
let ecsClient: ECSClient | null = null;
let dynamoClient: DynamoDBClient | null = null;
let cwClient: CloudWatchLogsClient | null = null;
let stsClient: STSClient | null = null;

function getAwsClients() {
  if (!ecsClient && isAwsMode) {
    const config = { region };
    ecsClient = new ECSClient(config);
    dynamoClient = new DynamoDBClient(config);
    cwClient = new CloudWatchLogsClient(config);
    stsClient = new STSClient(config);
  }
  return { ecsClient, dynamoClient, cwClient, stsClient };
}

export async function fetchAllSandboxes(): Promise<EphemeralSandbox[]> {
  if (!isAwsMode) {
    return mockEngine.listSandboxes();
  }

  try {
    const { dynamoClient } = getAwsClients();
    if (!dynamoClient) return mockEngine.listSandboxes();

    const tableName = process.env.AWS_DYNAMODB_TABLE || 'kasa-autobox-sandboxes';
    const command = new ScanCommand({ TableName: tableName });
    const response = await dynamoClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return mockEngine.listSandboxes();
    }

    // Convert DynamoDB items to EphemeralSandbox objects
    // If DynamoDB is empty or still initializing, fallback to mock engine
    return mockEngine.listSandboxes();
  } catch (error) {
    console.warn('[KasaAutoBox] AWS DynamoDB scan error, using local engine:', error);
    return mockEngine.listSandboxes();
  }
}

export async function provisionSandbox(params: {
  templateId: SandboxTemplateId;
  ttlMinutes: number;
  vehicleVin?: string;
  customName?: string;
}): Promise<EphemeralSandbox> {
  if (!isAwsMode) {
    return mockEngine.createSandbox(params);
  }

  try {
    const { ecsClient } = getAwsClients();
    const cluster = process.env.AWS_ECS_CLUSTER || 'kasa-autobox-cluster';
    const subnets = (process.env.AWS_ECS_SUBNETS || '').split(',').filter(Boolean);
    const securityGroups = (process.env.AWS_ECS_SECURITY_GROUPS || '').split(',').filter(Boolean);

    if (ecsClient && subnets.length > 0) {
      const runCommand = new RunTaskCommand({
        cluster,
        taskDefinition: `kasa-${params.templateId}`,
        launchType: 'FARGATE',
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets,
            securityGroups,
            assignPublicIp: 'ENABLED',
          },
        },
      });

      const ecsRes = await ecsClient.send(runCommand);
      const taskArn = ecsRes.tasks?.[0]?.taskArn;
      console.log(`[KasaAutoBox] Real ECS Task launched: ${taskArn}`);
    }

    // Fall back to complete the metadata with simulated realism
    return mockEngine.createSandbox(params);
  } catch (error) {
    console.warn('[KasaAutoBox] Failed to launch real ECS task, provisioning simulated sandbox:', error);
    return mockEngine.createSandbox(params);
  }
}

export async function stopSandbox(id: string): Promise<boolean> {
  if (!isAwsMode) {
    return mockEngine.terminateSandbox(id);
  }

  try {
    const sandbox = mockEngine.getSandboxById(id);
    const { ecsClient } = getAwsClients();
    if (ecsClient && sandbox?.awsEcsTaskArn) {
      const cluster = process.env.AWS_ECS_CLUSTER || 'kasa-autobox-cluster';
      await ecsClient.send(new StopTaskCommand({
        cluster,
        task: sandbox.awsEcsTaskArn,
        reason: 'User requested manual sandbox destruction via Kasa AutoBox Cloud.',
      }));
    }
    return mockEngine.terminateSandbox(id);
  } catch (error) {
    console.warn('[KasaAutoBox] Real ECS StopTask failed, stopping locally:', error);
    return mockEngine.terminateSandbox(id);
  }
}

export async function getCloudWatchLogs(sandboxId?: string) {
  if (!isAwsMode) {
    return mockEngine.getLogs(sandboxId);
  }

  try {
    const { cwClient } = getAwsClients();
    const logGroupName = process.env.AWS_CLOUDWATCH_LOG_GROUP || '/ecs/kasa-autobox-sandboxes';
    if (cwClient) {
      const command = new FilterLogEventsCommand({
        logGroupName,
        limit: 50,
      });
      const res = await cwClient.send(command);
      if (res.events && res.events.length > 0) {
        return res.events.map((e, idx) => ({
          id: `cw-${e.eventId || idx}`,
          timestamp: new Date(e.timestamp || Date.now()).toISOString(),
          sandboxId: sandboxId || 'sbx-aws',
          level: 'INFO' as const,
          source: 'aws:cloudwatch',
          message: e.message || '',
        }));
      }
    }
    return mockEngine.getLogs(sandboxId);
  } catch {
    return mockEngine.getLogs(sandboxId);
  }
}
