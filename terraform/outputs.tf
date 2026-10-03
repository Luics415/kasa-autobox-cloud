output "ecs_cluster_arn" {
  description = "ARN of the provisioned ECS Cluster"
  value       = aws_ecs_cluster.autobox.arn
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table with TTL enabled"
  value       = aws_dynamodb_table.sandboxes.name
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group for Fargate container output"
  value       = aws_cloudwatch_log_group.autobox_logs.name
}

output "sts_role_arn" {
  description = "Scoped IAM Role for temporary STS session issuance"
  value       = aws_iam_role.ephemeral_sandbox_role.arn
}
