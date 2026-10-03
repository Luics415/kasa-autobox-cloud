resource "aws_ecs_cluster" "autobox" {
  name = var.ecs_cluster_name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "autobox_providers" {
  cluster_name = aws_ecs_cluster.autobox.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 100
    base              = 0
  }
}

resource "aws_cloudwatch_log_group" "autobox_logs" {
  name              = "/ecs/kasa-autobox-sandboxes"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "workshop_bay" {
  family                   = "kasa-workshop-bay"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ephemeral_sandbox_role.arn

  container_definitions = jsonencode([
    {
      name      = "workshop-api"
      image     = "public.ecr.aws/docker/library/nginx:alpine"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "APP_DOMAIN", value = "automotive.kasa-service.local" },
        { name = "ENABLE_OBD_TELEMETRY", value = "true" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.autobox_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}
