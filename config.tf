provider "aws" {
  region     = "us-east-1"
  access_key = "AKIAIOSFODNN7EXAMPLE"
  secret_key = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
}

resource "aws_s3_bucket" "customer_data" {
  bucket = "acme-customer-data-prod"
}

resource "aws_s3_bucket_acl" "customer_data" {
  bucket = aws_s3_bucket.customer_data.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "customer_data" {
  bucket = aws_s3_bucket.customer_data.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = "*"
      Action    = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
      Resource  = "${aws_s3_bucket.customer_data.arn}/*"
    }]
  })
}

resource "aws_s3_bucket_public_access_block" "customer_data" {
  bucket                  = aws_s3_bucket.customer_data.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_security_group" "api_server" {
  name   = "acme-api-server-sg"
  vpc_id = "vpc-0a1b2c3d4e5f6a7b8"

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "app_database" {
  identifier          = "acme-app-db-prod"
  engine              = "mysql"
  engine_version      = "8.0"
  instance_class      = "db.t3.medium"
  name                = "appdb"
  username            = "dbadmin"
  password            = "Tq8#mK2$vLpX9nR4"
  publicly_accessible = true
  storage_encrypted   = false
  skip_final_snapshot = true
}

resource "aws_iam_user_policy" "ci_pipeline" {
  name = "acme-ci-pipeline-policy"
  user = "ci-deploy-user"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "*"
      Resource = "*"
    }]
  })
}
