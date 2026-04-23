terraform {
  required_version = ">= 1.8.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.60"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  service_names = [
    "api-gateway",
    "web",
    "auth-service",
    "user-service",
    "chat-service",
    "matching-service",
    "moderation-service",
    "recommendation-service",
    "notification-service"
  ]
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.9"

  name = "campusconnect"
  cidr = "10.20.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  public_subnets  = ["10.20.1.0/24", "10.20.2.0/24"]
  private_subnets = ["10.20.11.0/24", "10.20.12.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

resource "aws_ecr_repository" "services" {
  for_each = toset(local.service_names)
  name     = "campusconnect/${each.value}"
}

resource "aws_cloudwatch_log_group" "platform" {
  for_each          = toset(local.service_names)
  name              = "/campusconnect/${each.value}"
  retention_in_days = 14
}

resource "aws_s3_bucket" "media" {
  bucket = "${var.project_name}-media-${var.environment}"
}

resource "aws_cloudfront_origin_access_control" "media" {
  name                              = "${var.project_name}-media-oac"
  description                       = "CampusConnect media CDN access control"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_db_subnet_group" "postgres" {
  name       = "${var.project_name}-postgres"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.project_name}-redis"
  subnet_ids = module.vpc.private_subnets
}

output "ecr_repositories" {
  value = { for name, repo in aws_ecr_repository.services : name => repo.repository_url }
}
