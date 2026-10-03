resource "aws_iam_role" "ecs_execution_role" {
  name = "kasa-autobox-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Scoped Role for Ephemeral Sandboxes (issued via AWS STS)
resource "aws_iam_role" "ephemeral_sandbox_role" {
  name = "kasa-ephemeral-sandbox-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          AWS = "*"
        }
        Condition = {
          StringEquals = {
            "aws:PrincipalTag/Project" = "Kasa-AutoBox-Cloud"
          }
        }
      }
    ]
  })
}

resource "aws_iam_policy" "sandbox_scoped_policy" {
  name        = "kasa-sandbox-least-privilege-policy"
  description = "Allows ephemeral sandboxes to read vehicle telematics and write diagnostic logs"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.autobox_logs.arn}:*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:UpdateItem"
        ]
        Resource = aws_dynamodb_table.sandboxes.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "sandbox_policy_attach" {
  role       = aws_iam_role.ephemeral_sandbox_role.name
  policy_arn = aws_iam_policy.sandbox_scoped_policy.arn
}
