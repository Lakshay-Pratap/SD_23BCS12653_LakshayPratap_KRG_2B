variable "project_name" {
  description = "Project slug for resource naming"
  type        = string
  default     = "campusconnect"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region for platform resources"
  type        = string
  default     = "ap-south-1"
}
