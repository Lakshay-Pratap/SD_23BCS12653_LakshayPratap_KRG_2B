# Deployment and DevOps

## Containerization

Each app and service has its own Dockerfile:

- `apps/web/Dockerfile`
- `apps/api-gateway/Dockerfile`
- `services/*/Dockerfile`

This mirrors a realistic deployment pipeline where each component can be built and scaled independently.

## CI/CD pipeline

GitHub Actions workflow:

- installs workspace dependencies
- runs typecheck
- runs builds for all packages

The workflow is defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## Cloud deployment target

Recommended AWS mapping:

- CloudFront + S3 for media/CDN
- Application Load Balancer in front of gateway and web
- ECS or EKS for service workloads
- RDS PostgreSQL for relational data
- DocumentDB or MongoDB Atlas for messages/feed
- ElastiCache Redis for cache and presence
- MSK for Kafka
- CloudWatch for logs and metrics

## Kubernetes

The file [`infra/k8s/campusconnect-platform.yaml`](../infra/k8s/campusconnect-platform.yaml) provides:

- namespace
- shared config map
- deployment and service definitions for web, gateway, and domain services

## Terraform

The Terraform folder demonstrates:

- VPC provisioning
- ECR repositories
- log groups
- media bucket
- subnet groups for stateful services

It is intentionally a starter for cloud discussion rather than a fully secrets-wired production stack.

## Observability

Recommended production stack:

- structured JSON logs from Fastify
- CloudWatch, Datadog, or Grafana for dashboards
- OpenTelemetry traces from gateway to downstream services
- alerting on latency, queue lag, and moderation backlog
