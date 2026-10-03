# EventBridge Scheduler to trigger automated teardown of expired sandboxes
resource "aws_cloudwatch_event_rule" "reaper_schedule" {
  name                = "kasa-autobox-ttl-reaper"
  description         = "Triggers every 5 minutes to sweep and terminate expired ephemeral ECS tasks"
  schedule_expression = "rate(5 minutes)"
}

resource "aws_iam_role" "reaper_lambda_role" {
  name = "kasa-autobox-reaper-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "reaper_permissions" {
  name = "kasa-reaper-ecs-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecs:ListTasks",
          "ecs:StopTask",
          "ecs:DescribeTasks"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ]
        Resource = aws_dynamodb_table.sandboxes.arn
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "reaper_attach" {
  role       = aws_iam_role.reaper_lambda_role.name
  policy_arn = aws_iam_policy.reaper_permissions.arn
}
