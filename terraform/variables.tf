variable "aws_region" {
  description = "AWS region for provisioning Kasa AutoBox resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "production"
}

variable "ecs_cluster_name" {
  description = "Name of the ECS Cluster hosting automotive ephemeral tasks"
  type        = string
  default     = "kasa-autobox-cluster"
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table storing sandbox state & TTL"
  type        = string
  default     = "kasa-autobox-sandboxes"
}
