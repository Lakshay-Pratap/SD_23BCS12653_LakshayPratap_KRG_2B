# CampusConnect+

CampusConnect+ is a production-style, full-stack campus networking platform built as a service-oriented TypeScript monorepo. It showcases secure identity, route-aware matching, realtime chat, anonymous community posts with moderation, hybrid recommendations, analytics, feature flags, and deployment-ready infrastructure.

## Why this project stands out

- Service-oriented architecture with an API Gateway and clean domain boundaries
- Realtime experiences using Socket.IO plus event-driven workflows shaped for Kafka
- Hybrid data strategy: PostgreSQL for structured identity/social data, MongoDB for chat and feed, Redis for cache and geospatial lookups
- Fault-tolerance patterns including retries, circuit breakers, degraded fallbacks, and offline sync
- A polished Next.js dashboard that surfaces matching, chat, moderation, search, feature flags, experiments, and health in one place
- Docker, Kubernetes, Terraform, and GitHub Actions assets for deployment storytelling

## Monorepo layout

```text
apps/
  api-gateway/        Gateway, aggregation, security, rate limiting
  web/                Next.js dashboard frontend
services/
  auth-service/       JWT, OAuth stub, identity verification
  user-service/       Profiles, location updates, feature flags
  chat-service/       Socket.IO, delivery states, offline sync
  matching-service/   Geo-aware user matching
  moderation-service/ Anonymous feed, reports, trust-and-safety queue
  recommendation-service/ Hybrid recommendations
  notification-service/ Async notification inbox
packages/
  shared/             Contracts, demo data, resilience helpers, ranking logic
docs/                 Architecture, schemas, scaling, API docs, diagrams
infra/                Docker, Kubernetes, Terraform, local scripts
```

## Core capabilities

### Authentication and profiles
- JWT-style access and refresh tokens
- OAuth provider entry point stub
- RBAC with `user`, `moderator`, and `admin`
- Optional blockchain identity hash endpoint for uniqueness verification storytelling

### Realtime matching
- Route-aware and interest-aware matching
- Geo-bucketing via reusable geospatial helper
- Live presence feed concept for same-bucket users

### Chat and messaging
- One-to-one and group conversation summaries
- Delivery state updates: `sent`, `delivered`, `read`
- Attachment metadata support for media sharing
- Offline replay/sync concept exposed through API

### Anonymous posting and moderation
- Anonymous post submission with heuristic toxicity/safety screening
- Reporting flow and moderator review queue
- Admin summary for trust-and-safety operations

### Recommendation engine
- Hybrid scoring combining collaborative and content-based signals
- Experiment bucket support and feature-flag visibility
- Search highlights and dashboard analytics

## Quick start

### Local development

1. Copy `.env.example` to `.env` if you want to override defaults.
2. Install dependencies:

```bash
npm install
```

3. Start everything in development mode:

```bash
npm run dev
```

4. Open:
- Web: `http://localhost:3000`
- Gateway: `http://localhost:4000`

### Docker

```bash
npm run docker:up
```

This brings up:
- PostgreSQL
- MongoDB
- Redis
- Kafka + ZooKeeper
- all backend services
- API Gateway
- Next.js frontend

## Key routes

- `POST /api/auth/login`
- `GET /api/dashboard/:userId`
- `GET /api/search?q=ai`
- `GET /api/architecture`
- `POST /api/posts/anonymous`
- `POST /api/chat/messages`

## Documentation map

- [Architecture](./docs/architecture.md)
- [Database Schema](./docs/database-schema.md)
- [Scaling Strategy](./docs/scaling-strategy.md)
- [Deployment](./docs/deployment.md)
- [API Docs](./docs/api.md)
- [OpenAPI Spec](./docs/openapi.yaml)
- [System Diagram](./docs/diagrams/system-architecture.mmd)
- [Data Flow Diagram](./docs/diagrams/data-flow.mmd)

## Demo and presentation tips

- Use the web dashboard to walk through matching, feed moderation, chat presence, analytics, and service health.
- Pair the UI with the docs to explain why SQL, NoSQL, Redis, and Kafka each exist.
- Show the Docker, Kubernetes, and Terraform folders to demonstrate deployment readiness.
- Capture screenshots from the dashboard and a short Loom/video after starting the stack locally.

## Current scope

The repository is intentionally designed as an interview-ready and academic-project-ready platform skeleton. Several integrations are implemented with realistic interfaces and demo data rather than live cloud dependencies, which keeps the project runnable while still demonstrating strong system design decisions.
